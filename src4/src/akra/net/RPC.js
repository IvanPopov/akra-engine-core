var akra;
(function (akra) {
    /// <reference path="../idl/IRPC.ts" />
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
        var ObjectList = util.ObjectList;
        var ObjectArray = util.ObjectArray;
        var ObjectSortCollection = util.ObjectSortCollection;

        var OPTIONS = akra.config.rpc;

        function hasLimitedDeferredCalls(pRpc) {
            return (pRpc.options.deferredCallsLimit >= 0);
        }

        function hasReconnect(pRpc) {
            return (pRpc.options.reconnectTimeout > 0);
        }

        function hasSystemRoutine(pRpc) {
            return (pRpc.options.systemRoutineInterval > 0);
        }
        function hasCallbackLifetime(pRpc) {
            return (pRpc.options.callbackLifetime > 0);
        }

        function hasGroupCalls(pRpc) {
            return (pRpc.options.callsFrequency > 0);
        }

        function hasCallbacksCountLimit(pRpc) {
            return (pRpc.options.maxCallbacksCount > 0);
        }

        var RPC = (function () {
            function RPC(pAddr, pOption) {
                if (typeof pAddr === "undefined") { pAddr = null; }
                if (typeof pOption === "undefined") { pOption = {}; }
                this.guid = akra.guid();
                this.joined = new akra.Signal(this);
                this.error = new akra.Signal(this);
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
                this._eState = akra.ERpcStates.k_Deteached;
                //rejoin timer
                this._iReconnect = -1;
                //timer for system routine
                this._iSystemRoutine = -1;
                this._iGroupCallRoutine = -1;
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
            Object.defineProperty(RPC.prototype, "remote", {
                get: function () {
                    return this._pRemoteAPI;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(RPC.prototype, "options", {
                get: function () {
                    return this._pOption;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(RPC.prototype, "group", {
                get: function () {
                    return !akra.isNull(this._pGroupCalls) ? this._iGroupID : -1;
                },
                enumerable: true,
                configurable: true
            });

            RPC.prototype.join = function (sAddr) {
                if (typeof sAddr === "undefined") { sAddr = null; }
                var _this = this;
                var pPipe = this._pPipe;
                var pDeffered = this._pDefferedRequests;

                if (akra.isNull(pPipe)) {
                    pPipe = new net.Pipe();

                    pPipe.message.connect(function (pPipe, pMessage, eType) {
                        if (eType !== akra.EPipeDataTypes.BINARY) {
                            _this.parse(JSON.parse(pMessage));
                        } else {
                            _this.parseBinary(new Uint8Array(pMessage));
                        }
                    });

                    pPipe.opened.connect(function (pPipe, pEvent) {
                        _this._startRoutines();

                        if (pDeffered.length) {
                            pDeffered.seek(0);

                            while (pDeffered.length > 0) {
                                pPipe.write(pDeffered.current);
                                _this._releaseRequest(pDeffered.takeCurrent());
                            }

                            akra.logger.presume(pDeffered.length === 0, "something going wrong. length is: " + pDeffered.length);
                        }

                        _this.proc(_this.options.procListName, function (pError, pList) {
                            if (!akra.isNull(pError)) {
                                akra.logger.critical("could not get proc. list");
                            }

                            if (!akra.isNull(pList) && akra.isArray(pList)) {
                                for (var i = 0; i < pList.length; ++i) {
                                    (function (sMethod) {
                                        this.options.procMap[sMethod] = this.options.procMap[sMethod] || {
                                            lifeTime: -1,
                                            priority: 0
                                        };

                                        this.remote[sMethod] = function () {
                                            var pArguments = [sMethod];

                                            for (var j = 0; j < arguments.length; ++j) {
                                                pArguments.push(arguments[j]);
                                            }

                                            return this.proc.apply(this, pArguments);
                                        };
                                    })(String(pList[i]));
                                }
                                // logger.log("rpc options: ", pRPC.options);
                            }

                            this.joined();
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
                this._eState = akra.ERpcStates.k_Joined;
            };

            RPC.prototype.rejoin = function () {
                var pRPC = this;

                clearTimeout(this._iReconnect);

                if (this._pPipe.isOpened()) {
                    this._eState = akra.ERpcStates.k_Joined;
                    return;
                }

                if (this._eState == akra.ERpcStates.k_Closing) {
                    this._eState = akra.ERpcStates.k_Deteached;
                    return;
                }

                if (this._pPipe.isClosed()) {
                    //callbacks that will not be called, because connection was lost
                    this.freeCallbacks();

                    if (hasReconnect(this)) {
                        this._iReconnect = setTimeout(function () {
                            pRPC.join();
                        }, this.options.reconnectTimeout);
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
                if (eType === akra.ERPCPacketTypes.RESPONSE) {
                    var fn = null;
                    var pCallback = null;

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
                        pCallback = pStack.last;
                        do {
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
                    // WARNING("package droped, invalid serial: " + nSerial);
                } else if (eType === akra.ERPCPacketTypes.REQUEST) {
                    akra.logger.error("TODO: REQUEST package type temprary unsupported.");
                } else if (eType === akra.ERPCPacketTypes.FAILURE) {
                    akra.logger.error("detected FAILURE on " + nSerial + " package");
                    akra.logger.log(pResult);
                } else {
                    akra.logger.error("unsupported response type detected: " + eType);
                }
            };

            RPC.prototype.freeRequests = function () {
                var pStack = this._pDefferedRequests;
                var pReq = pStack.first;

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
                    var pCallback = pStack.first;

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
                this._eState = akra.ERpcStates.k_Closing;

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
                var pOptions = this.options.procMap[sProc];

                if (!pOptions) {
                    pOptions = this.options.procMap[sProc] = {
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
                pProc.type = akra.ERPCPacketTypes.REQUEST;
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
                    if (!hasLimitedDeferredCalls(this) || this._pDefferedRequests.length <= this.options.deferredCallsLimit) {
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
                    }, this.options.systemRoutineInterval);
                }

                if (hasGroupCalls(this)) {
                    this._iGroupCallRoutine = setInterval(function () {
                        pRPC.groupCall();
                    }, this.options.callsFrequency);
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
                    pCallback = pCallbacks.first;
                    while (!akra.isNull(pCallback)) {
                        if (hasCallbackLifetime(this) && (iNow - pCallback.timestamp) >= this.options.callbackLifetime) {
                            fn = pCallback.fn;
                            if (akra.config.DEBUG) {
                                sInfo = pCallback.procInfo;
                            }
                            this._releaseCallback(pCallbacks.takeCurrent());

                            pCallback = pCallbacks.current;

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
                if (RPC.requestPool.length == 0) {
                    // LOG("allocated rpc request");
                    return { n: 0, type: akra.ERPCPacketTypes.REQUEST, proc: null, argv: null, next: null, lt: 0, pr: 0 };
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
                if (RPC.callbackPool.length == 0) {
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
                    code: 1
                },
                CALLBACK_LIFETIME_EXPIRED: {
                    name: "RPC err.",
                    message: "procedure life time expired",
                    code: 2
                }
            };
            return RPC;
        })();
    })(akra.net || (akra.net = {}));
    var net = akra.net;
})(akra || (akra = {}));
