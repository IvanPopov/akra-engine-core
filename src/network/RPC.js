function RPC(pUri, pContext) {
    this.pPipe = null;
    this.pContext = pContext || window;

    this.pOptions = {
        defferedCallsLimit: 1024
        callbacksLimit: 2048
    };

    //стек вызововы, которые были отложены
    this._pDefferedCalls = [];
    //стек вызовов, ожидающих результата
    this._pCallbacks = [];
    //число совершенных вызовов
    this._nCalls = 0;

    if (arguments.length > 1) {
        this.connect(pUri);
    }
}

RPC.prototype.connect = function(sAddr) {
    var pPipe;
    var me = this;

    pPipe = new a.NET.Pipe(pUri);
    pPipe.on('msg', function (sMsg) {
        me.parse(sMsg);
    });
    pPipe.on('open', function () {
        var pDeffered = me._pDefferedCalls;
        if (pDeffered.length) {
            for (var i = 0; i < pDeffered.length; ++ i) {
                pPipe.send(pDeffered[i]);
            }
        }
    });

    this.pPipe = pPipe;
};

RPC.prototype.parse = function(sMsg) {
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

RPC.prototype.proc = function () {
    'use strict';



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