var WEBSOCKET_PORT = 1337;

if (!a) {
	var a = {NET: {}};
}

if (!error) {
	var error = console.error.bind(console);
}

/**
 * Pipe, просто интерфейс для создания соединений между клиентом и сервером
 * и любыми другими объектами.
 */
function Pipe (sAddr, fnCallback) {
	this._pAddr = null;
	this._fnMessage = null;

	this._nMesg = 0;
	this._pCallbackStack = null;
	this._eMode = 0;

	if (arguments.length) {
		this.open(sAddr, fnCallback);
	}
}

Pipe.prototype.open = function (sAddr, fnCallback) {
    'use strict';
    
    fnCallback = fnCallback || null;

    var pAddr = new URI(sAddr);
	var pConnect = null;
	var me = this;

	if (pAddr.protocol !== 'ws') {
		error('Pipe supported only websockets.');
		return false;
	}

	if (!pAddr.port) {
		pAddr.port = WEBSOCKET_PORT;
	}

	if (!WebSocket) {
		error('You browser does not support webSocket api.');
		return false;
	}

	pConnect = new WebSocket(pAddr.toString());
	
	pConnect.onopen = fnCallback || function () {
		trace('created pipe to: ' + pAddr.toString());
	};
	
	pConnect.onerror = function (pErr) {
		warning('pipe error...');
		trace(pErr);
	};

	this._pConnect = pConnect;
	this._pAddr = pAddr;

	window.onunload = function () {
		pConnect.close();
	};	

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
			this._pConnect.onmessage = fnCallback;
			return true;
	}

	return false;
};


Pipe.prototype.isOpened = function () {
    'use strict';
    
	return this._pConnect.readyState === 1;
};

Pipe.prototype.isCreated = function (first_argument) {
    'use strict';
    
	return this._pConnect !== null;
};

Pipe.prototype.close = function () {
    'use strict';
    
    if (this.isOpened()) {
		this._pConnect.close();
	}
};

Pipe.prototype.send = function (pValue) {
    'use strict';
    
	if (this.isOpened()) {
		this._nMesg ++;
		return this._pConnect.send(JSON.stringify(pValue));
	}

	return false;
};

Pipe.prototype.write = Pipe.prototype.send;

a.NET.Pipe = Pipe;