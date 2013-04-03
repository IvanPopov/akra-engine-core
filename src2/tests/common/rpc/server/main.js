//requirements
var autoloader 	= require('autoloader');
// var cluster 	= require('cluster');
var websocket 	= require('websocket');
var http 		= require('http');

//setup global variables
var WebSocketServer = websocket.server;
var webSocketsServerPort = 6112;

//autoload all modules
autoloader.autoload(__dirname + '/lib');

var RPC_TYPE_FAILURE = 0;
var RPC_TYPE_CALL = 1;
var RPC_TYPE_RESPONSE = 2;

var server = http.createServer();

server.listen(webSocketsServerPort, function() { 
    console.clear();
    process.stdout.cursorTo(0, 0);
	console.log(((new Date()) + " Server is listening on port " + webSocketsServerPort).gray().bold()); 
});

// create the server
var wsServer = new WebSocketServer({
    httpServer: server
});

var request, response;

/* common procedures */

function echo(fnCallback, msg) {
	fnCallback(null, msg);
}

function bufferTest(fnCallback) {
    fnCallback(null, new Uint8Array([1, 2, 4, 8, 16, 32, 64, 128]));
}

function procList(fnCallback) {
    var pList = Object.keys(global);
    var pRes = [];

    for (var i = 0; i < pList.length; i++) {
        if (typeof global[pList[i]] === 'function') {
            pRes.push(pList[i]);
        }
    };

    fnCallback(null, pRes);
}

global["bufferTest"] = bufferTest;
global["echo"] = echo;
global["proc_list"] = procList;

var pBuffer = null;
var pHeader = null;
var pData = null;
var pJsonResponse = {n: 0, res: null, type: 0};

function jsonResponse(n, res, type) {
    pJsonResponse.n = n;
    pJsonResponse.res = res;
    pJsonResponse.type = type;
    return pJsonResponse;
}

function jsonFailure(n, err) {
    return jsonResponse(n, err? err.message: null, RPC_TYPE_FAILURE);
}

function proc(connection, req) {
    if (req.type === RPC_TYPE_CALL && req.proc && req.argv) {
    	
    	var procedure = req.proc;
        var result = null;

    	if (global[procedure]) {

    		var fnCall = function(err, result) {
                if (err) {
                    connection.sendUTF(JSON.stringify(jsonFailure(req.n, err)));
                }

			    if (result && result.BYTES_PER_ELEMENT === 1) {
                    //result must be Uint8Array

                    var iResponseSize = result.byteLength + 8;

                    if (pBuffer === null || (pBuffer && pBuffer.length < iResponseSize)) {
                        pBuffer = new Buffer(iResponseSize);
                        pHeader = new Uint32Array(pBuffer, 0, 2);
                        pData = new Uint8Array(pBuffer, 8);

                        //console.log("allocated response buffer with size " + pBuffer.length + " bytes");
                    }


                    pHeader[0] = req.n;
                    pHeader[1] = RPC_TYPE_RESPONSE;

    				pData.set(result);

                    //slice() returns a new buffer which references the same memory as the old.
    				connection.sendBytes(pBuffer.slice(0, iResponseSize)); 
			    }
                else {
                    connection.sendUTF(JSON.stringify(jsonResponse(req.n, result, RPC_TYPE_RESPONSE)));
                }
    		}
    		
            req.argv.unshift(fnCall);
            global[procedure].apply(null, req.argv);
        }
    }
    else {	
       connection.sendUTF(JSON.stringify(jsonFailure(req.n, null)));
    }
}

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

setInterval(function () {
    process.stdout.cursorTo(0, 1);


    process.stdout.write(getMemoryUsage() + "\n" + ConnectionWrapper.printStatUnits() + "\n" + ConnectionWrapper.connections.join("\n"));

}, 1000);

// WebSocket server
wsServer.on("request", function(request) {

    var connection = new ConnectionWrapper(request);

    
    // This is the most important callback for us, we'll handle
    // all messages from users here.
    connection.on('message', function(message) {
        if (message.type === 'utf8') {
	        proc(connection, JSON.parse(message.utf8Data));
        }
    });

    // connection.on('close', function(connection) {
    //     console.log((new Date()) + " Peer "
    //             + connection.remoteAddress + " disconnected.");
    // });
});
