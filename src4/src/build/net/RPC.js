/// <reference path="../idl/IRPC.ts" />
var akra;
(function (akra) {
    /// <reference path="../logger.ts" />
    /// <reference path="../debug.ts" />
    /// <reference path="../config/config.ts" />
    /// <reference path="../uri/uri.ts" />
    /// <reference path="../path/path.ts" />
    /// <reference path="../events.ts" />
    /// <reference path="../guid.ts" />
    /// <reference path="../time.ts" />
    /// <reference path="Pipe.ts" />
    /// <reference path="../util/ObjectArray.ts" />
    /// <reference path="../util/ObjectList.ts" />
    /// <reference path="../util/ObjectSortCollection.ts" />
    (function (net) {
        var ObjectList = akra.util.ObjectList;
        var ObjectArray = akra.util.ObjectArray;
        var ObjectSortCollection = akra.util.ObjectSortCollection;

        var OPTIONS = akra.config.rpc;

        function hasLimitedDeferredCalls(pRpc) {
            return (pRpc.getOptions().deferredCallsLimit >= 0);
        }

        function hasReconnect(pRpc) {
            return (pRpc.getOptions().reconnectTimeout > 0);
        }

        function hasSystemRoutine(pRpc) {
            return (pRpc.getOptions().systemRoutineInterval > 0);
        }
        function hasCallbackLifetime(pRpc) {
            return (pRpc.getOptions().callbackLifetime > 0);
        }

        function hasGroupCalls(pRpc) {
            return (pRpc.getOptions().callsFrequency > 0);
        }

        function hasCallbacksCountLimit(pRpc) {
            return (pRpc.getOptions().maxCallbacksCount > 0);
        }

        var RPC = (function () {
            function RPC(pAddr, pOption) {
                if (typeof pAddr === "undefined") { pAddr = null; }
                if (typeof pOption === "undefined") { pOption = {}; }
                this.guid = akra.guid();
                this._pPipe = null;
                this._iGroupID = -1;
                this._pGroupCalls = null;
                //стек вызововы, которые были отложены
                this._pDefferedRequests = new ObjectList();
                //стек вызовов, ожидающих результата
                //type: ObjectList<IRPCCallback>
                this._pCallbacksList = null;
                this._pCallbacksCollection = null;
                //число совершенных вызовов
                this._nCalls = 0;
                this._pRemoteAPI = {};
                this._eState = 0 /* k_Deteached */;
                //rejoin timer
                this._iReconnect = -1;
                //timer for system routine
                this._iSystemRoutine = -1;
                this._iGroupCallRoutine = -1;
                this.setupSignals();

                for (var i in OPTIONS) {
                    if (!akra.isDef(pOption[i])) {
                        pOption[i] = OPTIONS[i];
                    }
                }

                this._pOption = pOption;

                if (!akra.isDefAndNotNull(pOption.procMap)) {
                    pOption.procMap = {};
                }

                pOption.procMap[pOption.procListName] = {
                    lifeTime: -1,
                    priority: 10
                };

                if (hasCallbacksCountLimit(this)) {
                    this._pCallbacksCollection = new ObjectSortCollection(this._pOption.maxCallbacksCount);
                    this._pCallbacksCollection.setCollectionFuncion(function (pCallback) {
                        return akra.isNull(pCallback) ? -1 : pCallback.n;
                    });
                } else {
                    this._pCallbacksList = new ObjectList();
                }
                pAddr = pAddr || pOption.addr;

                if (akra.isDefAndNotNull(pAddr)) {
                    this.join(pAddr);
                }
            }
            RPC.prototype.getRemote = function () {
                return this._pRemoteAPI;
            };
            RPC.prototype.getOptions = function () {
                return this._pOption;
            };
            RPC.prototype.getGroup = function () {
                return !akra.isNull(this._pGroupCalls) ? this._iGroupID : -1;
            };

            RPC.prototype.setupSignals = function () {
                this.joined = this.joined || new akra.Signal(this);
                this.error = this.error || new akra.Signal(this);
            };

            RPC.prototype.join = function (sAddr) {
                if (typeof sAddr === "undefined") { sAddr = null; }
                var _this = this;
                var pPipe = this._pPipe;
                var pDeffered = this._pDefferedRequests;

                if (akra.isNull(pPipe)) {
                    pPipe = new akra.net.Pipe();

                    pPipe.message.connect(function (pPipe, pMessage, eType) {
                        // LOG(pMessage);
                        if (eType !== 0 /* BINARY */) {
                            _this.parse(JSON.parse(pMessage));
                        } else {
                            _this.parseBinary(new Uint8Array(pMessage));
                        }
                    });

                    pPipe.opened.connect(function (pPipe, pEvent) {
                        _this._startRoutines();

                        //if we have unhandled call in deffered...
                        if (pDeffered.getLength()) {
                            pDeffered.seek(0);

                            while (pDeffered.getLength() > 0) {
                                pPipe.write(pDeffered.getCurrent());
                                _this._releaseRequest(pDeffered.takeCurrent());
                            }

                            akra.debug.assert(pDeffered.getLength() === 0, "something going wrong. length is: " + pDeffered.getLength());
                        }

                        var pRPC = _this;

                        _this.proc(_this.getOptions().procListName, function (pError, pList) {
                            if (!akra.isNull(pError)) {
                                akra.logger.critical("could not get proc. list");
                            }

                            //TODO: FIX akra. prefix...
                            if (!akra.isNull(pList) && akra.isArray(pList)) {
                                for (var i = 0; i < pList.length; ++i) {
                                    (function (sMethod) {
                                        pRPC.getOptions().procMap[sMethod] = pRPC.getOptions().procMap[sMethod] || {
                                            lifeTime: -1,
                                            priority: 0
                                        };

                                        pRPC.getRemote()[sMethod] = function () {
                                            var pArguments = [sMethod];

                                            for (var j = 0; j < arguments.length; ++j) {
                                                pArguments.push(arguments[j]);
                                            }

                                            return pRPC.proc.apply(pRPC, pArguments);
                                        };
                                    })(String(pList[i]));
                                }
                                // logger.log("rpc options: ", pRPC.options);
                            }

                            pRPC.joined.emit();
                        });
                    });

                    pPipe.error.connect(function (pPipe, pError) {
                        akra.debug.error("pipe error occured...");
                        _this.error.emit(pError);
                        //pRPC.rejoin();
                    });

                    pPipe.closed.connect(function (pPipe, pEvent) {
                        _this._stopRoutines();
                        _this.rejoin();
                    });
                }

                pPipe.open(sAddr);

                this._pPipe = pPipe;
                this._eState = 1 /* k_Joined */;
            };

            RPC.prototype.rejoin = function () {
                var pRPC = this;

                clearTimeout(this._iReconnect);

                //rejoin not needed, because pipe already connected
                if (this._pPipe.isOpened()) {
                    this._eState = 1 /* k_Joined */;
                    return;
                }

                //rejoin not needed, because we want close connection
                if (this._eState == 2 /* k_Closing */) {
                    this._eState = 0 /* k_Deteached */;
                    return;
                }

                if (this._pPipe.isClosed()) {
                    //callbacks that will not be called, because connection was lost
                    this.freeCallbacks();

                    if (hasReconnect(this)) {
                        this._iReconnect = setTimeout(function () {
                            pRPC.join();
                        }, this.getOptions().reconnectTimeout);
                    }
                }
            };

            RPC.prototype.parse = function (pRes) {
                if (!akra.isDef(pRes.n)) {
                    //logger.log(pRes);
                    akra.logger.warn("message droped, because seriial not recognized.");
                }

                this.response(pRes.n, pRes.type, pRes.res);
            };

            RPC.prototype.parseBinary = function (pBuffer) {
                var iHeaderByteLength = 12;
                var pHeader = new Uint32Array(pBuffer.buffer, pBuffer.byteOffset, iHeaderByteLength / 4);

                var nMsg = pHeader[0];
                var eType = pHeader[1];
                var iByteLength = pHeader[2];

                var pResult = pBuffer.subarray(iHeaderByteLength, iHeaderByteLength + iByteLength);

                this.response(nMsg, eType, pResult);

                var iPacketByteLength = iHeaderByteLength + iByteLength;

                if (pBuffer.byteLength > iPacketByteLength) {
                    // console.log("group message detected >> ");
                    this.parseBinary(pBuffer.subarray(iPacketByteLength));
                }
            };

            RPC.prototype.response = function (nSerial, eType, pResult) {
                if (eType === 2 /* RESPONSE */) {
                    var fn = null;
                    var pCallback = null;

                    // WARNING("---------------->",nSerial,"<-----------------");
                    // LOG(pStack.length);
                    if (hasCallbacksCountLimit(this)) {
                        var pCollection = this._pCallbacksCollection;
                        pCallback = pCollection.takeElement(nSerial);
                        if (!akra.isNull(pCallback)) {
                            fn = pCallback.fn;
                            this._releaseCallback(pCallback);

                            if (!akra.isNull(fn)) {
                                fn(null, pResult);
                            }
                            return;
                        }
                    } else {
                        var pStack = this._pCallbacksList;
                        pCallback = pStack.getLast();
                        if (!akra.isNull(pCallback)) {
                            do {
                                // LOG("#n: ", nSerial, " result: ", pResult);
                                if (pCallback.n === nSerial) {
                                    fn = pCallback.fn;
                                    this._releaseCallback(pStack.takeCurrent());

                                    if (!akra.isNull(fn)) {
                                        fn(null, pResult);
                                    }
                                    return;
                                }
                            } while(pCallback = pStack.prev());
                        }
                    }
                    // WARNING("package droped, invalid serial: " + nSerial);
                } else if (eType === 1 /* REQUEST */) {
                    akra.logger.error("TODO: REQUEST package type temprary unsupported.");
                } else if (eType === 0 /* FAILURE */) {
                    akra.logger.error("detected FAILURE on " + nSerial + " package");
                    akra.logger.log(pResult);
                } else {
                    akra.logger.error("unsupported response type detected: " + eType);
                }
            };

            RPC.prototype.freeRequests = function () {
                var pStack = this._pDefferedRequests;
                var pReq = pStack.getFirst();

                if (pReq) {
                    do {
                        this._releaseRequest(pReq);
                    } while(pReq = pStack.next());

                    pStack.clear();
                }
            };

            RPC.prototype.freeCallbacks = function () {
                if (hasCallbacksCountLimit(this)) {
                    this._pCallbacksCollection.clear();
                } else {
                    var pStack = this._pCallbacksList;
                    var pCallback = pStack.getFirst();

                    if (pCallback) {
                        do {
                            this._releaseCallback(pCallback);
                        } while(pCallback = pStack.next());

                        pStack.clear();
                    }
                }
            };

            RPC.prototype.free = function () {
                this.freeRequests();
                this.freeCallbacks();
            };

            RPC.prototype.detach = function () {
                this._eState = 2 /* k_Closing */;

                if (!akra.isNull(this._pPipe) && this._pPipe.isOpened()) {
                    this._pPipe.close();
                }

                this.free();
            };

            RPC.prototype.findLifeTimeFor = function (sProc) {
                var pProcOpt = this._pOption.procMap[sProc];

                if (pProcOpt) {
                    var iProcLt = pProcOpt.lifeTime;

                    if (iProcLt >= 0)
                        return iProcLt;
                }

                return this._pOption.callbackLifetime;
            };

            RPC.prototype.findPriorityFor = function (sProc) {
                var pProcOpt = this._pOption.procMap[sProc];

                if (pProcOpt) {
                    var iProcPr = pProcOpt.priority || 0;

                    return iProcPr;
                }

                return 0;
            };

            RPC.prototype.setProcedureOption = function (sProc, sOpt, pValue) {
                var pOptions = this.getOptions().procMap[sProc];

                if (!pOptions) {
                    pOptions = this.getOptions().procMap[sProc] = {
                        lifeTime: -1
                    };
                }

                pOptions[sOpt] = pValue;
            };

            RPC.prototype.proc = function () {
                var argv = [];
                for (var _i = 0; _i < (arguments.length - 0); _i++) {
                    argv[_i] = arguments[_i + 0];
                }
                var IRPCCallback = arguments.length - 1;
                var fnCallback = akra.isFunction(arguments[IRPCCallback]) ? arguments[IRPCCallback] : null;
                var nArg = arguments.length - (fnCallback ? 2 : 1);
                var pArgv = new Array(nArg);
                var pPipe = this._pPipe;
                var pCallback = null;

                for (var i = 0; i < nArg; ++i) {
                    pArgv[i] = arguments[i + 1];
                }

                var pProc = this._createRequest();

                pProc.n = this._nCalls++;
                pProc.type = 1 /* REQUEST */;
                pProc.proc = String(arguments[0]);
                pProc.argv = pArgv;
                pProc.next = null;
                pProc.lt = this.findLifeTimeFor(pProc.proc);
                pProc.pr = this.findPriorityFor(pProc.proc);

                pCallback = this._createCallback();
                pCallback.n = pProc.n;
                pCallback.fn = fnCallback;
                pCallback.timestamp = akra.time();

                if (akra.config.DEBUG) {
                    pCallback.procInfo = pProc.proc + "(" + pArgv.join(',') + ")";
                }

                if (akra.isNull(pPipe) || !pPipe.isOpened()) {
                    if (!hasLimitedDeferredCalls(this) || this._pDefferedRequests.getLength() <= this.getOptions().deferredCallsLimit) {
                        this._pDefferedRequests.push(pProc);

                        if (hasCallbacksCountLimit(this)) {
                            this._pCallbacksCollection.push(pCallback);
                        } else {
                            this._pCallbacksList.push(pCallback);
                        }
                    } else {
                        pCallback.fn(RPC.ERRORS.STACK_SIZE_EXCEEDED);
                        akra.logger.log(RPC.ERRORS.STACK_SIZE_EXCEEDED);

                        this._releaseCallback(pCallback);
                        this._releaseRequest(pProc);
                    }

                    return false;
                }

                if (hasCallbacksCountLimit(this)) {
                    this._pCallbacksCollection.push(pCallback);
                } else {
                    this._pCallbacksList.push(pCallback);
                }

                return this.callProc(pProc);
            };

            RPC.prototype.callProc = function (pProc) {
                var pPipe = this._pPipe;
                var bResult = false;

                if (hasGroupCalls(this)) {
                    if (akra.isNull(this._pGroupCalls)) {
                        this._pGroupCalls = pProc;
                        this._iGroupID++;
                    } else {
                        pProc.next = this._pGroupCalls;
                        this._pGroupCalls = pProc;
                    }

                    return true;
                } else {
                    bResult = pPipe.write(pProc);
                    this._releaseRequest(pProc);
                }

                return bResult;
            };

            RPC.prototype._systemRoutine = function () {
                this._removeExpiredCallbacks();
            };

            RPC.prototype._startRoutines = function () {
                var pRPC = this;

                if (hasSystemRoutine(this)) {
                    this._iSystemRoutine = setInterval(function () {
                        pRPC._systemRoutine();
                    }, this.getOptions().systemRoutineInterval);
                }

                if (hasGroupCalls(this)) {
                    this._iGroupCallRoutine = setInterval(function () {
                        pRPC.groupCall();
                    }, this.getOptions().callsFrequency);
                }
            };

            RPC.prototype._stopRoutines = function () {
                clearInterval(this._iSystemRoutine);
                this._systemRoutine();

                clearInterval(this._iGroupCallRoutine);
                //TODO: remove calls from group call, if RPC finally detached!
            };

            RPC.prototype.groupCall = function () {
                var pReq = this._pGroupCalls;

                if (akra.isNull(pReq)) {
                    return;
                }

                this._pPipe.write(pReq);

                return this.dropGroupCall();
            };

            RPC.prototype.dropGroupCall = function () {
                var pReq = this._pGroupCalls;

                for (; ;) {
                    var pNext = pReq.next;
                    this._releaseRequest(pReq);

                    if (!pNext) {
                        break;
                    }

                    pReq = pNext;
                }

                this._pGroupCalls = null;
                return this._iGroupID;
            };

            RPC.prototype._removeExpiredCallbacks = function () {
                var pCallback = null;
                var iNow = akra.time();
                var fn = null;
                var sInfo = null;

                if (hasCallbacksCountLimit(this)) {
                    //				 for(var i: uint = 0; i < this.options.maxCallbacksCount; i++){
                    //					 pCallback = <IRPCCallback>this._pCallbacksCollection.getElementAt(i);
                    //					 if (!isNull(pCallback) && HAS_CALLBACK_LIFETIME(this) && (iNow - pCallback.timestamp) >= this.options.callbackLifetime) {
                    //						 fn = pCallback.fn;
                    // #ifdef DEBUG
                    //						 sInfo = pCallback.procInfo;
                    // #endif
                    //						 this._releaseCallback(pCallback);
                    //						 this._pCallbacksCollection.removeElementAt(i);
                    //						 if (!isNull(fn)) {
                    //							 // logger.log("procedure info: ", sInfo);
                    //							 fn(RPC.ERRORS.CALLBACK_LIFETIME_EXPIRED, null);
                    //						 }
                    //					 }
                    //				 }
                } else {
                    var pCallbacks = this._pCallbacksList;
                    pCallback = pCallbacks.getFirst();
                    while (!akra.isNull(pCallback)) {
                        if (hasCallbackLifetime(this) && (iNow - pCallback.timestamp) >= this.getOptions().callbackLifetime) {
                            fn = pCallback.fn;
                            if (akra.config.DEBUG) {
                                sInfo = pCallback.procInfo;
                            }
                            this._releaseCallback(pCallbacks.takeCurrent());

                            pCallback = pCallbacks.getCurrent();

                            if (!akra.isNull(fn)) {
                                // logger.log("procedure info: ", sInfo);
                                fn(RPC.ERRORS.CALLBACK_LIFETIME_EXPIRED, null);
                            }
                        } else {
                            pCallback = pCallbacks.next();
                        }
                    }
                }
            };

            RPC.prototype._releaseRequest = function (pReq) {
                pReq.n = 0;
                pReq.proc = null;
                pReq.argv = null;
                pReq.next = null;
                pReq.lt = 0;
                pReq.pr = 0;

                RPC.requestPool.push(pReq);
            };

            RPC.prototype._createRequest = function () {
                if (RPC.requestPool.getLength() == 0) {
                    // LOG("allocated rpc request");
                    return { n: 0, type: 1 /* REQUEST */, proc: null, argv: null, next: null, lt: 0, pr: 0 };
                }

                return RPC.requestPool.pop();
            };

            RPC.prototype._releaseCallback = function (pCallback) {
                pCallback.n = 0;
                pCallback.fn = null;
                pCallback.timestamp = 0;
                pCallback.procInfo = null;

                RPC.callbackPool.push(pCallback);
            };

            RPC.prototype._createCallback = function () {
                if (RPC.callbackPool.getLength() == 0) {
                    // LOG("allocated callback");
                    return { n: 0, fn: null, timestamp: 0, procInfo: null };
                }

                return RPC.callbackPool.pop();
            };

            RPC.requestPool = new ObjectArray();
            RPC.callbackPool = new ObjectArray();

            RPC.ERRORS = {
                STACK_SIZE_EXCEEDED: {
                    name: "RPC err.",
                    message: "stack size exceeded",
                    code: 0 /* STACK_SIZE_EXCEEDED */
                },
                CALLBACK_LIFETIME_EXPIRED: {
                    name: "RPC err.",
                    message: "procedure life time expired",
                    code: 1 /* CALLBACK_LIFETIME_EXPIRED */
                }
            };
            return RPC;
        })();

        function createRpc(addr, opt) {
            if (arguments.length === 1) {
                if (akra.isString(addr)) {
                    return new RPC(addr);
                }

                return new RPC(null, arguments[0]);
            }

            return new RPC(addr, opt);
        }
        net.createRpc = createRpc;
    })(akra.net || (akra.net = {}));
    var net = akra.net;
})(akra || (akra = {}));
//# sourceMappingURL=RPC.js.map
