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

var server = http.createServer(function(request, response) {
    // process HTTP request. Since we're writing just WebSockets server
    // we don't have to implement anything.
});

server.listen(webSocketsServerPort, function() { 
	console.log((new Date()) + " Server is listening on port " + webSocketsServerPort); 
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

                        console.log("allocated response buffer with size " + pBuffer.length + " bytes");
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

// WebSocket server
wsServer.on('request', function(request) {
	console.log((new Date()) + ' Connection from origin ' + request.origin + '.');

    var connection = request.accept(null, request.origin);
    // This is the most important callback for us, we'll handle
    // all messages from users here.
    connection.on('message', function(message) {
        if (message.type === 'utf8') {
	        proc(connection, JSON.parse(message.utf8Data));
        }
        else {
            trace('received message from socket in wrong encoding');
            if (message.type === 'binary') {
                trace(new Uint8Array(message.binaryData));
            }
            else {
                trace(message);
            }
        }
    });

    connection.on('close', function(connection) {
        console.log((new Date()) + " Peer "
                + connection.remoteAddress + " disconnected.");
    });
});
