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

global['echo'] = echo;

function proc(req) {
	if (!req.proc || !req.argv) {
		return false;
	}
	
	var procedure = req.proc;

	if (global[procedure]) {
		return {n: req.n, res: global[procedure].apply(null, req.argv)};
	}
	trace('procedure: ', procedure, 'not exists...');
	return {n: req.n, res: null};
}

// WebSocket server
wsServer.on('request', function(request) {
	console.log((new Date()) + ' Connection from origin ' + request.origin + '.');


    var connection = request.accept(null, request.origin);

    // This is the most important callback for us, we'll handle
    // all messages from users here.
    connection.on('message', function(message) {
        if (message.type === 'utf8') {
            //trace('message from socket:', message.utf8Data);

            request = JSON.parse(message.utf8Data);
            response = proc(request);
            trace(response);
        	connection.sendUTF(JSON.stringify(response));
        }
        else {
        	trace('received message from socket in wrong encoding');
        }
    });

    connection.on('close', function(connection) {
        console.log((new Date()) + " Peer "
                + connection.remoteAddress + " disconnected.");
    });
});
