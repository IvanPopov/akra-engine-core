A_DEFINE_NAMESPACE(NET);

Enum([
	WEBSOCKET_PORT = 1337
	], NETWORK, a.NET);

function Pipe () {
	Enum([
			MODE_DEFAULT = 0x00,
			MODE_RPC = 0x01
		], PIPE, a.NET.Pipe);

	this._pAddr = null;
	this._fnMessage = null;

	this._nMesg = 0;
	this._pCallbackStack = null;
	this._eMode = 0;
}

Pipe.prototype.create = function (sAddr, fnCallback) {
    'use strict';
    
    fnCallback = fnCallback || null;

    var pAddr = a.uri(sAddr);
	var pConnect = null;
	var me = this;

	if (pAddr.protocol !== 'ws') {
		return false;
	}

	if (!pAddr.port) {
		pAddr.port = a.NET.WEBSOCKET_PORT;
	}

	if (!a.info.support.webSocket) {
		warning('You browser does not support webSocket api.');
		return false;
	}

	trace(pAddr.toString());
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
	}

	return false;
};

Pipe.prototype.rpc = function () {
    'use strict';
    	
    var me = this;
    this._pCallbackStack = [];

	this._eMode = a.NET.Pipe.MODE_RPC;
	
	this._pConnect.onmessage = function (sMsg) {
		var pRes = JSON.parse(sMsg.data);
		var pStack = me._pCallbackStack;

		if (pRes.n === undefined) {
			return;
		}

		for (var i = pStack.length - 1; i >= 0; i--) {
			if (pStack[i].n === pRes.n) {
				pStack[i].fn.call(me, pRes.res);
				pStack.splice(i, 1);
				return;
			}
		};
	};
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



Pipe.prototype.proc = function () {
    'use strict';

    if (this._eMode !== a.NET.Pipe.MODE_RPC) {
    	return false;
    }

    var iCallback = arguments.length - 1;
    var fnCallback = typeof arguments[iCallback] === 'function'? arguments[iCallback]: null;
    var pArgv = new Array(arguments.length - (fnCallback? 2: 1));

    for (var i = 0; i < pArgv.length; ++ i) {
    	pArgv[i] = arguments[i + 1];
    };

    var pProc = {
    	proc: String(arguments[0]),
    	argv: pArgv,
    	n: this._nMesg
    };

    if (fnCallback) {
    	this._pCallbackStack.push({n: pProc.n, fn: fnCallback});
    }

    return this.send(pProc);
};


A_NAMESPACE(Pipe, NET);

function pipe() {
	var pUri = a.uri(arguments[0]);
	var fnCallback = arguments[1];
	var pPipe = new a.NET.Pipe();

	return pPipe.create(pUri, fnCallback) || null;
}

A_NAMESPACE(pipe, NET);