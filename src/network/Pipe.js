var WEBSOCKET_PORT = 1337;

if (!a) {
	var a = {};
}

if (!a.NET) {
	a.NET = {};
}

if (!error) {
	var error = function (e) { throw new Error(e); };
}

if (!trace) {
	var trace = function () {};
}

var PIPE_TYPE_WEBSOCKET = 0;
var PIPE_TYPE_WEBWORKER = 1;

//Для совместимости с Node без window
WebSocket = WebSocket || MozWebSocket;

/**
 * Pipe, просто интерфейс для создания соединений между клиентом и сервером
 * и любыми другими объектами.
 */
function Pipe (sAddr, fnCallback) {
	this._pAddr = null;
	this._fnMessage = null;

	this._nMesg = 0;
	this._eType = 0;

	if (arguments.length) {
		this.open(sAddr, fnCallback);
	}
}

Pipe.prototype.open = function (sAddr, fnCallback) {
    'use strict';
    
	fnCallback = fnCallback || null;

    var pAddr, pConnect, me = this, eType;

    if (arguments.length > 0) {
	    pAddr = new URI(sAddr);
		pConnect = null;
	}
	else {
		if (this.isCreated()) {
			this.close();
		}

		pAddr = this._pAddr;
		pConnect = null;
	}

	if (pAddr.protocol === 'ws') { 		//create pipe to websocket.
		if (!pAddr.port) {
			pAddr.port = WEBSOCKET_PORT;
		}

		if (!WebSocket) {
			error('You browser does not support webSocket api.');
			return false;
		}

		pConnect = new WebSocket(pAddr.toString(),["deflate-frame","soap","wamp"]);
		
		pConnect.onopen = fnCallback || function () {
			trace('created pipe to: ' + pAddr.toString());
		};
		
		pConnect.onerror = function (pErr) {
			warning('pipe error...');
			trace(pErr);
		};

		pConnect.binaryType = "arraybuffer";
		eType = PIPE_TYPE_WEBSOCKET;

	}
	else if (a.pathinfo(pAddr.path).ext === 'js') { //create pipe to worker
		if (!Worker) {
			error('You browser does not support webWorker api.');
			return false;
		}

		pConnect = new Worker(pAddr.toString());
		eType = PIPE_TYPE_WEBWORKER;
	}
	else {
		error('Pipe supported only websockets/webworkers.');
		return false;
	}

	this._pConnect = pConnect;
	this._pAddr = pAddr;
	this._eType = eType;

	if (!self) {
		window.onunload = function () {
			me.close();
		};	
	}
	
    return this;
};



Pipe.prototype.on = function (eState, fnCallback) {
    'use strict';
    
	switch (eState) {
		case 'open':
		case 'error':
		case 'close':
			this._pConnect['on' + eState] = fnCallback;
			return true;
		case 'msg':
		case 'message':
			this._pConnect.onmessage = function (pMessage) {
				if (pMessage.data instanceof ArrayBuffer) {
					fnCallback(pMessage.data, 'binary');
				}
				else {
					fnCallback(pMessage.data, 'string');
				}
			}
			return true;
	}

	return false;
};


Pipe.prototype.isOpened = function () {
    'use strict';
    
    switch (this._eType) {
    	case PIPE_TYPE_WEBSOCKET:
			return this._pConnect.readyState === 1;
		case PIPE_TYPE_WEBWORKER:
			return this._pConnect !== null;
	}

	return false;
};

Pipe.prototype.isCreated = function () {
    'use strict';
    
	return this._pConnect !== null;
};

Pipe.prototype.isClosed = function () {
    'use strict';
    
	switch (this._eType) {
    	case PIPE_TYPE_WEBSOCKET:
			return this._pConnect.readyState === 3;
		case PIPE_TYPE_WEBWORKER:
			return this._pConnect == null;
	}

	return false;
};

Pipe.prototype.close = function () {
    'use strict';
    
    if (this.isOpened()) {
    	switch (this._eType) {
	    	case PIPE_TYPE_WEBSOCKET:
				this._pConnect.onmessage = null;
		    	this._pConnect.onerror = null;
		    	this._pConnect.onopen = null;
				this._pConnect.close();
				break;
			case PIPE_TYPE_WEBWORKER:
				this._pConnect.terminate();
				this._pConnect = null;
		}
	}
};

Pipe.prototype.send = function (pValue) {
    'use strict';
    
	if (this.isOpened()) {
		this._nMesg ++;
		
		switch (this._eType) {
	    	case PIPE_TYPE_WEBSOCKET:
				if (typeof pValue === 'object') {
					pValue = JSON.stringify(pValue);
				}

				return this._pConnect.send(pValue);
			case PIPE_TYPE_WEBWORKER:
				if (pValue.byteLength) {
					this._pConnect.postMessage(pValue, [pValue]);
				}
				else {
					this._pConnect.postMessage(pValue);	
				}
				return true;
		}
	}

	return false;
};

Pipe.prototype.write = Pipe.prototype.send;

a.NET.Pipe = Pipe;