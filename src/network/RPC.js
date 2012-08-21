if (!a) {
    var a = {NET: {}};
}

if (!error) {
    var error = console.error.bind(console);
}

var RPC_TYPE_FAILURE = 0;
var RPC_TYPE_CALL = 1;
var RPC_TYPE_RESPONSE = 2;

function RPC(pUri, pContext, fnCallback) {
    this.pPipe = null;
    this.pContext = pContext || self || window;

    this.pOptions = {
        defferedCallsLimit: 1024,
        callbacksLimit: 2048
    };

    //стек вызововы, которые были отложены
    this._pDefferedCalls = [];
    //стек вызовов, ожидающих результата
    this._pCallbacks = [];
    //число совершенных вызовов
    this._nCalls = 0;
    this._iReconnect = -1;

    if (arguments.length > 0) {
        this.connect(pUri, fnCallback);
    }
}

RPC.prototype.connect = function(pUri, fnCallback) {
    var pPipe = this.pPipe;
    var me = this;

    if (!pPipe) {
        pPipe = new a.NET.Pipe(pUri);
    }
    else {
        pPipe.open();
    }

    pPipe.on('msg', function (pMessage, sType) {
        if (sType !== 'binary') {
            me.parse(JSON.parse(pMessage));
        }
        else {
            pMessage = new Uint8Array(pMessage);
            me.parseBinary(pMessage);
        }
    });
    pPipe.on('open', function () {
        var pDeffered = me._pDefferedCalls;
        if (pDeffered.length) {
            for (var i = 0; i < pDeffered.length; ++ i) {
                pPipe.send(pDeffered[i]);
            }

            me._pDefferedCalls = [];
        }

        me.proc('proc_list', function (pList) {
            if (pList && pList instanceof Array) {
                for (var i = 0; i < pList.length; ++ i) {
                    (function (sMethod) {
                        me[sMethod] = function () {
                            var argv = [sMethod];
                            for (var j = 0; j < arguments.length; ++ j) {
                                argv.push(arguments[j]);  
                            }
                            return me.proc.apply(me, argv);
                        };
                    })(String(pList[i]));   
                }
            }

            if (fnCallback) {
                fnCallback.call(me);
            }
        })
    });
    pPipe.on('error', function () {
        me.reconnect();
    });

    this.pPipe = pPipe;
};

RPC.prototype.reconnect = function () {
    'use strict';
    
    var me = this;
    clearTimeout(this._iReconnect);

    if (this.pPipe.isOpened()) {
        return true;
    }

    if (this.pPipe.isClosed()) {
        trace('attempt to reconnecting...');
        //error('cannot reconnect to rpc server. pipe completly closed.');
    }

    this.connect();

    this._iReconnect = setTimeout(function () {
        me.reconnect();      
    }, 5000);
};

RPC.prototype.parse = function(pObject) {
    var pRes = pObject;
    var pStack = this._pCallbacks;

    if (pRes.n === undefined) {
        trace(pObject);
        warning('message droped, because serial not recognized...');
        return;
    }

    return this.response(pRes.n, pRes.type, pRes.res);
};

RPC.prototype.parseBinary = function (pBuffer) {
    var pRes = pBuffer;
    var nMsg = (new Uint32Array(pBuffer.subarray(0, 4).buffer, 0, 4))[0];
    var eType = pBuffer[4];
    var pResult = pBuffer.buffer.slice(8, pBuffer.length);

    return this.response(nMsg, eType, pResult);
};

RPC.prototype.response = function (nSerial, eType, pResult) {
    'use strict';
    
    var pStack = this._pCallbacks;

    if (eType === RPC_TYPE_RESPONSE) {
        for (var i = pStack.length - 1; i >= 0; i--) {
            if (pStack[i].n === nSerial) {
                pStack[i].fn.call(this, pResult);
                pStack.splice(i, 1);
                return;
            }
        };
    }
    else if (eType === RPC_TYPE_FAILURE) {
        error('detected FAILURE on ' + nSerial + 'package.');
    }
    else {
        error('unsupported response type detected: ' + eType);
    }
};

RPC.prototype.free = function () {
    'use strict';
    
    this._pDefferedCalls = [];
    this._pCallbacks = [];
};

RPC.prototype.proc = function () {
    'use strict';

    var iCallback = arguments.length - 1;
    var fnCallback = typeof arguments[iCallback] === 'function'? arguments[iCallback]: null;
    var pArgv = new Array(arguments.length - (fnCallback? 2: 1));
    var pPipe = this.pPipe;

    for (var i = 0; i < pArgv.length; ++ i) {
    	pArgv[i] = arguments[i + 1];
    };

    var pProc = {
        type: RPC_TYPE_CALL,
    	proc: String(arguments[0]),
    	argv: pArgv,
    	n: this._nCalls ++
    };

    if (fnCallback) {
    	this._pCallbacks.push({n: pProc.n, fn: fnCallback});
    }

    if (!pPipe || !pPipe.isOpened()) {
        this._pDefferedCalls.push(pProc);
        return false;
    }

    return this.pPipe.send(pProc);
};

a.NET.RPC = RPC;