"use strict";

//requirements
var autoloader 	= require('autoloader');
var cluster 	= require('cluster');
var websocket 	= require('websocket');
var http 		= require('http');

//setup global variables
var WebSocketServer = websocket.server;
var webSocketsServerPort = 1337;

//autoload all modules
autoloader.autoload(__dirname + '/lib');

var RPC_TYPE_FAILURE = 0;
var RPC_TYPE_CALL = 1;
var RPC_TYPE_RESPONSE = 2;

var server = http.createServer(function(request, response) {
    // process HTTP request. Since we're writing just WebSockets server
    // we don't have to implement anything.
});

server.listen(1337, function() { 
	console.log((new Date()) + " Server is listening on port " + webSocketsServerPort); 
});

// create the server
var wsServer = new WebSocketServer({
    httpServer: server
});

var request, response;

function echo(msg) {
	return msg;
}

function bufferTest() {
    return new Float32Array([100, 200, 300, 400, 500]);
}

global['bufferTest'] = bufferTest;
global['echo'] = echo;
global['proc_list'] = function () {
    var pList = Object.keys(global);
    var pRes = [];

    for (var i = 0; i < pList.length; i++) {
        if (typeof global[pList[i]] === 'function') {
            pRes.push(pList[i]);
        }
    };

    return pRes;
};

function proc(req) {
    if (req.type === RPC_TYPE_CALL) {
    	if (!req.proc || !req.argv) {
    		return false;
    	}
    	
    	var procedure = req.proc;
        var result = null;

    	if (global[procedure]) {
            result = global[procedure].apply(null, req.argv);

            if (result.byteLength) {
                if (!(result instanceof ArrayBuffer)) {
                    result = result.buffer;
                }
                
                var pBuffer = new Uint8Array(result.byteLength + 8);
                
                pBuffer.set(new Uint8Array((new Uint32Array([req.n])).buffer));
                pBuffer[4] = RPC_TYPE_RESPONSE;
                pBuffer.set(new Uint8Array(result), 8);

                // trace(pBuffer.buffer.byteLength);
                // trace(new Float32Array(pBuffer.buffer, 8, 4));
                return new Buffer(pBuffer);
            }

    		return {n: req.n, res: result, type: RPC_TYPE_RESPONSE};
    	}

    	//trace('procedure: ', procedure, 'not exists...');
        return {n: req.n, type: RPC_TYPE_FAILURE};
    }

    return {n: req.n, type: RPC_TYPE_FAILURE};
}

// WebSocket server
wsServer.on('request', function(request) {
	console.log((new Date()) + ' Connection from origin ' + request.origin + '.');


    var connection = request.accept(null, request.origin);

    //trace(Object.keys(connection));
    // This is the most important callback for us, we'll handle
    // all messages from users here.
    connection.on('message', function(message) {
        if (message.type === 'utf8') {
            //trace('message from socket:', message.utf8Data);

            request = JSON.parse(message.utf8Data);
            response = proc(request);
            //trace(response);
            if (response instanceof Buffer) {
                //trace('send as binary >> ', response);
                connection.sendBytes(response);    
                // for (var i in connection) {
                //     if (typeof connection[i] === 'function') {
                //         trace(i);
                //     }
                // }
            }
            else {
        	   connection.sendUTF(JSON.stringify(response));
            }
        }
        else {
            if (message.type === 'binary') {
                trace(new Uint8Array(message.binaryData));
            }
            else {
            	trace('received message from socket in wrong encoding');
                trace(message);
            }
        }
    });

    connection.on('close', function(connection) {
        console.log((new Date()) + " Peer "
                + connection.remoteAddress + " disconnected.");
    });
});
