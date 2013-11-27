var cluster 	= require('cluster');
var net 		= require('net');
var fs 			= require('fs');
var websocket 	= require('websocket');
var http 		= require('http');

var ConnectionWrapper = require('./ConnectionWrapper').wrapper;
var WebSocketServer = websocket.server;

var ws_port = 6112;
var web_port = 6113;
var path_to_worker = './procedurer.js';
var workers = null;
var stat = { input: 0, output: 0, dropped: 0 };
var queue = [];

function now() {
	return Date.now();
}

function destroy_proc_handler(worker_info) {
	//todo
}

function prepare_binary_answer(worker_info, data) {
	var conn = worker_info.connection;
	var conn_info = conn.info;

	var prev_bytes_num = conn_info.total_bytes;

	conn_info.total_bytes += data.length;

	var buffer = conn_info.flex_buffer;

	if (buffer == null || buffer.length < conn_info.total_bytes) {

		var temp = new Buffer(conn_info.total_bytes);

		if (buffer) {
			buffer.copy(temp, 0, 0, buffer.length);
		}

		buffer = conn_info.flex_buffer = temp;
	}

	var buf = buffer.slice(prev_bytes_num, conn_info.total_bytes);

	for (var i = 0; i < data.length; ++ i) {
		buf[i] = data[i];
	}
	
	conn_info.prepared_buffers.push(buf);

	process_response_stack(worker_info);
}

function process_response_stack_by_connect(conn) {
	var conn_info = conn.info;

	if (conn_info.prepared_buffers.length === 0) {
		return;
	}

	// if (conn_info.total_time > )

	// if (now() - conn_info.last_update < 30) {
	// 	return;
	// }

	conn_info.last_update = now();
	conn_info.stat.output += conn_info.prepared_buffers.length;
	stat.output += conn_info.prepared_buffers.length;;

	
	var res = conn_info.flex_buffer.slice(0, conn_info.total_bytes);
	
	conn_info.total_bytes = 0;
	conn_info.prepared_buffers.length = 0;	

	conn.sendBytes(res);
}

function process_response_stack(worker_info) {
	var conn = worker_info.connection;

	// process_response_stack_by_connect(conn);
}


function handle_proc_result(worker_info, data) {
	var conn = worker_info.connection;

	if (typeof data === "string") {
		conn.sendUTF(data);

		worker_info.connection.info.stat.output ++;
		stat.output ++;
	}
	else {
		if (data.type !== "Buffer") throw Error("incorrect response from worker");

		prepare_binary_answer(worker_info, data.data);
	}

	//from
	console.log("(" + worker_info.n + ")", worker_info.req.proc, "(", worker_info.req.argv.join(','), ") > ",
	 now() - worker_info.time, "ms (pr.: ", worker_info.req.pr, ")", "(rest: " + queue.length + ", dropped: " + stat.dropped + ")");

	//to

	worker_info.req = null;
	worker_info.connection = null;
	worker_info.busy = false;
	worker_info.total_time += now() - worker_info.time;
	worker_info.total ++;

	process_queue();
}

function create_proc_handler(workers, i) {
	var worker = workers[i]= {
		n: i,
		process: null,		//link to worker
		busy: false,		//status
		connection: null,	//connection, from that procedure inited
		pipe: null,			//pipe to worker
		time: 0,			//timestamp of request
		total_time: 0,		//total work time
		total: 0,			//total req handed,

		req: null			//current request // debug
	};

	worker.process = cluster.fork();
	worker.process.on("message", function (res) {
		handle_proc_result(worker, res);
	});

//	setTimeout(function () {
//		worker.process.kill();
//	}, 7 * 1000);

	return worker;
}

function create_proc_handlers(path_to_worker, num_workers) {
	num_workers = num_workers || (require('os').cpus().length);
	
	cluster.setupMaster({exec : path_to_worker});

	var workers = new Array(num_workers);

	for (var i = 0; i < workers.length; ++ i) {
		create_proc_handler(workers, i);
	}

	cluster.on('exit', function(worker, code, signal) {
		//console.log('worker ' + worker.process.pid + ' died');
		for (var i = 0; i < workers.length; ++ i) {
			if (workers[i].process === worker) {
				console.log("worker #" + i + " died...", workers[i].connection);
				var prev_info = workers[i];
	
				create_proc_handler(workers, i);
				
				if (prev_info.connection && prev_info.req) {
					add_requests_to_queue(prev_info.connection, prev_info.req, true);
				}

				return;
			}
		}
	});

	return workers;
}

function create_websock_server(port) {
	var server = http.createServer();

	server.listen(port, function() {
	    console.log((new Date()) + " Server is listening on port " + port); 
	});

	return new WebSocketServer({httpServer: server});
}

function find_free_worker() {
	if (now() % 2) {
		for (var i = 0; i < workers.length; ++ i) {
			if (workers[i].busy == false && workers[i].connection == null) {
				return workers[i];
			}
		}
	}
	else {
		for (var i = workers.length - 1; i >= 0; -- i) {
			if (workers[i].busy == false && workers[i].connection == null) {
				return workers[i];
			}
		}
	}

	return null;
}

function process_queue() {
	if (queue.length == 0) {
		return;
	}

	var worker_info = find_free_worker();

	if (worker_info === null) {
		return;
	}

	var queue_entry = queue.shift();
	var req = queue_entry.request;

	if (req == null || queue_entry.conn.opened == false) {
		stat.dropped ++;
		process_queue();
		return;
	}

	if (req.lt > 0 && (now() - queue_entry.time) >= req.lt) {
		console.log("dropped by lifetime(" + req.lt + " / " + (now() - queue_entry.time) + ") > ", req.proc + "(" + req.argv.join(',') + ")");
		stat.dropped ++;
		process_queue();
		return;
	}

	worker_info.req = req; //debug

	worker_info.busy = true;
	worker_info.connection = queue_entry.conn;
	worker_info.connection.info.stat.input ++;
	worker_info.time = queue_entry.time;
	worker_info.process.send(req);
}

function add_requests_to_queue(connection, req, force_single) {
	if (req.next == null || force_single) {
		req.next = null;
		var queue_entry = {conn: connection, request: req, time: now()};
		
		if (req.pr > 0) {
			queue.unshift(queue_entry);
		}
		else {
			queue.push(queue_entry);
		}

		stat.input ++;
		process_queue();
	}
	else {
		for (;req;) {
			add_requests_to_queue(connection, req, true);
			req = req.next;
		}
	}
}

function request_handler(request) {
    var connection = new ConnectionWrapper(request);

    connection.info = {
		flex_buffer: null,
		prepared_buffers: [],
		total_bytes: 0,
		last_update: 0,
		timer: -1,

		stat: {
			input: 0,
			output: 0
		}
	};

	connection.info.timer = setInterval(function() {
		process_response_stack_by_connect(connection);
	}, 15);
	

    connection.on('message', function(message) {
        if (message.type === 'utf8') {
        	add_requests_to_queue(connection, JSON.parse(message.utf8Data));
        }
    });

    connection.on('close', function () {
    	console.log(arguments);
    });
}

function get_memory_usage() {
    var usage = process.memoryUsage();
    var s = ""
    s += ("RAM: " + usage.rss.prettyByteSize().bold()).gray().inv();
    s += (", heap total: " + usage.heapTotal.prettyByteSize()).gray().inv();
    s += (", heap used: " + usage.heapUsed.prettyByteSize()).gray().inv();
    return s;
}

function get_rpc_stats() {
	var s = "";
	s += ("input: " + stat.input.toString().bold());
	s += (", output: " + stat.output.toString().bold());
	s += (", dropped: " + stat.dropped.toString().bold());
	s += (", losses: " + ((1. - stat.output / stat.input) * 100.0).toFixed(4) + "%");
	return "total rpc stats: [ " + s + " ]";
}

function get_worker_stats() {
	var s = "";
	
	for (var i = 0; i < workers.length; ++ i) {
		s += i + ": " + "{" + "avg proc time: " + (workers[i].total_time/workers[i].total).toFixed(0) + " ms, total proc: " + workers[i].total +  "}";
		if (i != workers.length - 1) {
			s += ", ";
		}
	}

	return "worker stats: " + s;
}

function create_rpc_server(ws_port, path_to_worker) {
	workers = create_proc_handlers(path_to_worker, 5);

	var websocket_server = create_websock_server(ws_port);
	websocket_server.on("request", request_handler);
}



function create_web_view(web_port) {
	http.createServer(function(request, response) {
		var conn_table = "";
		var conns = ConnectionWrapper.connections;
		var conn_stats_units = ConnectionWrapper.printStatUnits();

		conn_stats_units += "|" + "losses".middle(32).inv();

		for (var i = 0; i < conns.length; ++ i) {
			conn_table += conns[i].toString() + "|" + 
				("(" + conns[i].info.stat.output + " / " +  conns[i].info.stat.input + ") " + 
				(((1. - conns[i].info.stat.output / conns[i].info.stat.input) * 100).toFixed(4) + "%")).middle(32) + "\n";
		}

		response.writeHead(200);
		response.write("<!doctype html><html><head>" + 
			"<title>statistics</title>" + 
			'</head><body style="background: black; color: lightgray;margin: 0;padding:0;"><pre style="font-family: Consolas;">' + 
			"<script>setTimeout(function(){window.location.reload();}, 2000);</script>" + 
			get_memory_usage() + "\n" + 
			conn_stats_units + "\n" + 
			conn_table + 
			"\n\t" + get_rpc_stats() + 
			"\n\t" + get_worker_stats() + 
			"</pre></body>");

		response.end();

	}).listen(web_port);
}


create_rpc_server(ws_port, path_to_worker);
create_web_view(web_port);
