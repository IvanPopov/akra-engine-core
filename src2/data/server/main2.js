var cluster = require('cluster');
var net = require('net');
var fs = require('fs');
var numCPUs = require('os').cpus().length;
var workers = new Array(numCPUs);

var websocket 	= require('websocket');
var http 		= require('http');

//setup global variables
var WebSocketServer = websocket.server;
var webSocketsServerPort = 6112;

var VIEW_CONNECTIONS_LIST = false;

var server = http.createServer();
var connection = null;

server.listen(webSocketsServerPort, function() { 
    if (VIEW_CONNECTIONS_LIST) {
        console.clear();
        process.stdout.cursorTo(0, 0);
        console.log(((new Date()) + " Server is listening on port " + webSocketsServerPort).gray().bold()); 
    }
});

// create the server
var wsServer = new WebSocketServer({
    httpServer: server
});


console.clear = console.clear || 
    (!!process.platform.match(/^win/)? 
    function () {
        var lines = process.stdout.getWindowSize()[1];
        
        for(var i = 0; i < lines; i++) {
            console.log('\r\n');
        }
    }: 
    function () {
        console.log('\033[2J');
    });

String.prototype.size = function (n, ch) {
    n = n || this.length;
    ch = ch || " ";

    for (var i = this.length, str = this; i < n; ++ i) {
        str += ch;
    }

    return str;
}

String.prototype.middle = function (n, ch) {
    n = n || this.length;
    ch = ch || " ";

    var d = n - this.length;
    var dl, dr;
    var d2;
    var str = this;

    if (d < 0) {
        return this;
    }

    d2 = d / 2;

    if (d % 2 == 1) {
        dl = Math.floor(d2);
        dr = Math.ceil(d2);
    }
    else {
        dl = dr = d2;
    }

    for (var i = 0; i < dl; ++ i) {
        str = ch + str;
    }

    for (var i = 0; i < dr; ++ i) {
        str = str + ch;
    }

    return str;
}


String.spec = {
    reset: '\033[0m',
    inv: '\x1B[7m',

    red: '\033[31m',
    blue: '\033[34m',
    green: '\033[32m',
    gray: '\033[90m',

    bold: '\033[1m',
    italic: '\033[3m',
    underline: '\033[4m'
}

for (var i in String.spec) {
    if (i == "reset") continue;
    (function (i){
        String.prototype[i] = function() {
            return String.spec[i] + this + String.spec.reset;
        }
    })(i);
}

Number.prototype.prettyByteSize = function () {
    var bytes = this;

    if (bytes < 1000) {
        return String(bytes) + " b";
    }

    if (bytes < 1000000) {
        return String((bytes / 1000).toFixed(2)) + " kb";
    }

    return String((bytes / 1000000).toFixed(2)) + " mb"; 
}


function ConnectionWrapper(request) {
    var connection = request.accept(null, request.origin);
    var connected = new Date();
    var wrapper = this;

    //Recieve (in)
    var RX = {
        packets: 0,
        bytes: 0
    };

    //Trancieve (out) 
    var TX = {
        packets: 0,
        bytes: 0
    };

    var events = {
        "message": null
    };

    var ext = request.requestedExtensions;
    var isDeflateSupported = false;

    for (var i = 0; i < ext.length; i++) {
        if (ext[i].name.match(/deflate/)) {
            isDeflateSupported = true;
        }
    };

    connection.on("message", function(message) {
        var callback = events["message"];

        RX.packets ++;

        switch (message.type) {
            case "utf8":
                RX.bytes += Buffer.byteLength(message.utf8Data, "utf8");
            break;
            case "binary":
            default: 
                RX.bytes += message.binaryData.length;
        }
        
        if (callback) {
            callback(message);
        }
    });

    connection.on("close", function(connection) {
        var callback = events["close"];

        wrapper.opened = false;
        wrapper.disconnected = new Date();

        if (callback) {
            callback(connection);
        }
    });


    this.request = request;
    this.connection = connection;
    this.connected = connected;
    this.TX = TX;
    this.RX = RX;
    this.events = events;
    this.opened = true;
    this.disconnected = 0;
    this.deflate = isDeflateSupported;
    
    ConnectionWrapper.connections.push(this);
}

ConnectionWrapper.prototype = {
    sendUTF: function (str) {
        this.TX.packets ++;
        this.TX.bytes += Buffer.byteLength(str, "utf8");

        this.connection.sendUTF(str);
    },

    sendBytes: function (buffer) {
        this.TX.packets ++;
        this.TX.bytes += buffer.length;

        this.connection.sendBytes(buffer);
    },

    on: function (event, callback) {
        this.events[event] = callback;
    },

    toString: function () {
        var duration = Math.round(((this.opened? (new Date): this.disconnected).getTime() - this.connected.getTime()) / 1000);
//
        return (
            "".size(this.id, "\n") + 
            (this.request.origin + (this.deflate? " (deflate) ": "" )).middle(32) + "|" +
            ("   " + this.RX.packets + " / " + (this.RX.bytes).prettyByteSize()).middle(24) + "|" +
            ("   " + this.TX.packets + " / " + (this.TX.bytes).prettyByteSize()).middle(24) + "|" +
            (((1. - this.TX.packets / this.RX.packets) * 100).toFixed(4) + "%").middle(16) + "|" +
            (duration + " sec").middle(16) + "|" +
            (this.opened? "opened".middle(16).green(): "closed".middle(16).red()) /*+ 
            "\r"*/);
    }
}

ConnectionWrapper.connections = [];
ConnectionWrapper.printStatUnitsStr = null;
ConnectionWrapper.printStatUnits = function () {
    if (!ConnectionWrapper.printStatUnitsStr) {
        var output = [
            ("peer (pid: " + process.pid + ")").middle(32).inv(),
            "RX packets / bytes".middle(24).inv(),
            "TX packets / bytes".middle(24).inv(),
            "losses".middle(16).inv(),
            "duration".middle(16).inv(),
            "status".middle(16).inv()
        ];

        ConnectionWrapper.printStatUnitsStr = output.join("|");
    }

    return ConnectionWrapper.printStatUnitsStr;
}

function getMemoryUsage() {
    var usage = process.memoryUsage();
    var s = ""
    s += ("RAM: " + usage.rss.prettyByteSize().bold()).gray().inv();
    s += (", heap total: " + usage.heapTotal.prettyByteSize()).gray().inv();
    s += (", heap used: " + usage.heapUsed.prettyByteSize()).gray().inv();
    return s;
}

if (VIEW_CONNECTIONS_LIST) {
    setInterval(function () {
        process.stdout.cursorTo(0, 1);


        process.stdout.write(getMemoryUsage() + "\n" + ConnectionWrapper.printStatUnits() + "\n" + ConnectionWrapper.connections.join("\n"));

    }, 1000);
}


cluster.setupMaster({
  exec : "proc.js"
});

var n = 0;
function handleRequest(req, force_single) {
	if (n === numCPUs) {
		n = 0;
	}

	if (req.next == null || force_single) {
		workers[n ++].send(req);
	}
	else {
		for (;req;) {
			handleRequest(req, true);
			req = req.next;
		}
	}
}


var pBuffer = null;
var pCommonBuffer = null;
var preparedBuffers = [];
var iTotalBytes = 0;

function onWorkerMessage(response) {
	if (typeof response === "string") {
		connection.sendUTF(response)
	}
	else {
		if (response.type !== "Buffer") throw Error("incorrect response from worker");
		
		var iPrevBytes = iTotalBytes;
		iTotalBytes += response.data.length;

		if (!pBuffer || pBuffer.length < iTotalBytes) {
			var pTemp = new Buffer(iTotalBytes);
			
			// console.log("new Buffer(", iTotalBytes, "bytes )");

			if (pBuffer) {
				pBuffer.copy(pTemp, 0, 0, pBuffer.length);
				// console.log("buffer.copy(", pBuffer.length, "bytes )");
			}

			pBuffer = pTemp;
		}

		var buf = pBuffer.slice(iPrevBytes, iTotalBytes);
		// console.log("buffer.slice(from: ", iPrevBytes, ", to: ", iTotalBytes, ")");
		
		for (var i = 0; i < response.data.length; ++ i) {
			buf[i] = response.data[i];
		}
		
		preparedBuffers.push(buf);
		
		
		// if (preparedBuffers.length >= 32) {
		// 	var pRes = pBuffer.slice(0, iTotalBytes);

		// 	connection.sendBytes(pRes);

		// 	iTotalBytes = 0;
		// 	preparedBuffers.length = 0;
		// }
	}
}

function processResponseStack() {
	if (!preparedBuffers.length) {
		return;
	}

	var pRes = pBuffer.slice(0, iTotalBytes);

	connection.sendBytes(pRes);

	iTotalBytes = 0;
	preparedBuffers.length = 0;	
}

setInterval(processResponseStack, 30);

if (cluster.isMaster) {
	// Fork workers.
	for (var i = 0; i < workers.length; i++) {
		workers[i] = cluster.fork();
		workers[i].on("message", onWorkerMessage);
	}

	cluster.on('exit', function(worker, code, signal) {
		console.log('worker ' + worker.process.pid + ' died');
	});
}

// WebSocket server
wsServer.on("request", function(request) {
	
    connection = new ConnectionWrapper(request);
    connection.on('message', function(message) {
        if (message.type === 'utf8') {
        	

        	var req = JSON.parse(message.utf8Data);
        	handleRequest(req);
        }
    });
});
