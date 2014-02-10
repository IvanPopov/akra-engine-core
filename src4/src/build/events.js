/// <reference path="idl/IEventProvider.ts" />
/// <reference path="common.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var akra;
(function (akra) {
    var Signal = (function () {
        /**
        * @param pSender Object, that will be emit signal.
        * @param eType Signal type.
        */
        function Signal(pSender, eType) {
            if (typeof eType === "undefined") { eType = 1 /* BROADCAST */; }
            this._pBroadcastListeners = null;
            this._nBroadcastListenersCount = 0;
            this._pUnicastListener = null;
            this._pSender = null;
            this._eType = 1 /* BROADCAST */;
            this._fnForerunnerTrigger = null;
            this._pSyncSignal = null;
            this._sForerunnerTriggerName = null;
            this._pSender = pSender;
            this._eType = eType;

            if (this._eType === 1 /* BROADCAST */) {
                this._pBroadcastListeners = [];
            }
            //if (!isNull(this._pSender)) {
            //	this._sSenderCallbackName = this.findCallbacknameForListener(this._pSender, this._fnSenderCallback);
            //}
        }
        Signal.prototype.getListeners = function (eEventType) {
            if (eEventType == 1 /* BROADCAST */) {
                return this._pBroadcastListeners;
            }

            if (!akra.isNull(this._pUnicastListener)) {
                return [this._pUnicastListener];
            }

            return [];
        };

        Signal.prototype.getSender = function () {
            return this._pSender;
        };

        Signal.prototype.getType = function () {
            return this._eType;
        };

        /** @param fn Must be method of signal sender */
        Signal.prototype.setForerunner = function (fn) {
            //debug.assert(this.isMethodExistsInSenderPrototype(fn), "Callback must be a part of sender proto.");
            this._fnForerunnerTrigger = fn;

            if (this._pSender !== null) {
                this._sForerunnerTriggerName = this.findCallbacknameForListener(this._pSender, fn);
            }
        };

        Signal.prototype.connect = function () {
            var pListener = this.fromParamsToListener(arguments);

            if (pListener === null) {
                return false;
            }

            if (pListener.type === 0 /* UNICAST */) {
                if (this._pUnicastListener !== null) {
                    this.clearListener(pListener);
                    return false;
                }

                this._pUnicastListener = pListener;
            } else {
                if (this.indexOfBroadcastListener(pListener.reciever, pListener.callback) >= 0) {
                    akra.debug.warn("Listener already exists: ", pListener);
                    this.clearListener(pListener);
                    return false;
                }

                this._pBroadcastListeners[this._nBroadcastListenersCount++] = pListener;
            }

            return true;
        };

        Signal.prototype.disconnect = function () {
            var pTmpListener = this.fromParamsToListener(arguments);
            var bResult = false;

            if (pTmpListener === null) {
                return false;
            }

            if (pTmpListener.type === 0 /* UNICAST */) {
                if (pTmpListener.reciever === this._pUnicastListener.reciever && pTmpListener.callback === this._pUnicastListener.callback) {
                    this.clearListener(this._pUnicastListener);
                    this._pUnicastListener = null;
                    bResult = true;
                }
            } else {
                var index = this.indexOfBroadcastListener(pTmpListener.reciever, pTmpListener.callback);
                if (index >= 0) {
                    this.clearListener(this._pBroadcastListeners.splice(index, 1)[0]);
                    this._nBroadcastListenersCount--;
                    bResult = true;
                }
            }

            this.clearListener(pTmpListener);
            return bResult;
        };

        Signal.prototype.emit = function () {
            var pListener = null;
            var nListeners = this._eType === 1 /* BROADCAST */ ? this._nBroadcastListenersCount : 1;

            switch (arguments.length) {
                case 0:
                    if (this._pSyncSignal !== null) {
                        var pOriginalSender = this._pSyncSignal.getSender();

                        if (this._pSyncSignal.getSender() !== null) {
                            this._pSyncSignal._setSender(this._pSender);
                        }

                        this._pSyncSignal.emit();

                        this._pSyncSignal._setSender(pOriginalSender);
                    }

                    if (this._fnForerunnerTrigger !== null) {
                        if (this._pSender === null) {
                            this._fnForerunnerTrigger();
                        } else if (this._sForerunnerTriggerName !== null) {
                            this._pSender[this._sForerunnerTriggerName]();
                        } else {
                            this._fnForerunnerTrigger.call(this._pSender);
                        }
                    }

                    if (this._eType === 0 /* UNICAST */ && this._pUnicastListener !== null) {
                        pListener = this._pUnicastListener;
                        if (pListener.reciever === null) {
                            pListener.callback(this._pSender);
                        } else if (pListener.callbackName !== null) {
                            pListener.reciever[pListener.callbackName](this._pSender);
                        } else {
                            pListener.callback.call(pListener.reciever, this._pSender);
                        }
                    } else {
                        for (var i = 0; i < this._nBroadcastListenersCount; i++) {
                            pListener = this._pBroadcastListeners[i];
                            if (pListener === null)
                                continue;
                            if (pListener.reciever === null) {
                                pListener.callback(this._pSender);
                            } else if (pListener.callbackName !== null) {
                                pListener.reciever[pListener.callbackName](this._pSender);
                            } else {
                                pListener.callback.call(pListener.reciever, this._pSender);
                            }
                        }
                    }

                    return;
                case 1:
                    if (this._pSyncSignal !== null) {
                        var pOriginalSender = this._pSyncSignal.getSender();

                        if (this._pSyncSignal.getSender() !== null) {
                            this._pSyncSignal._setSender(this._pSender);
                        }

                        this._pSyncSignal.emit(arguments[0]);

                        this._pSyncSignal._setSender(pOriginalSender);
                    }

                    if (this._fnForerunnerTrigger !== null) {
                        if (this._pSender === null) {
                            this._fnForerunnerTrigger(arguments[0]);
                        } else if (this._sForerunnerTriggerName !== null) {
                            this._pSender[this._sForerunnerTriggerName](arguments[0]);
                        } else {
                            this._fnForerunnerTrigger.call(this._pSender, arguments[0]);
                        }
                    }

                    if (this._eType === 0 /* UNICAST */ && this._pUnicastListener !== null) {
                        pListener = this._pUnicastListener;
                        if (this._pSender === null) {
                            pListener.callback(this._pSender, arguments[0]);
                        } else if (pListener.callbackName !== null) {
                            pListener.reciever[pListener.callbackName](this._pSender, arguments[0]);
                        } else {
                            pListener.callback.call(pListener.reciever, this._pSender, arguments[0]);
                        }
                    } else {
                        for (var i = 0; i < this._nBroadcastListenersCount; i++) {
                            pListener = this._pBroadcastListeners[i];
                            if (pListener === null)
                                continue;
                            if (this._pSender === null) {
                                pListener.callback(this._pSender, arguments[0]);
                            } else if (pListener.callbackName !== null) {
                                pListener.reciever[pListener.callbackName](this._pSender, arguments[0]);
                            } else {
                                pListener.callback.call(pListener.reciever, this._pSender, arguments[0]);
                            }
                        }
                    }

                    return;
                case 2:
                    if (this._pSyncSignal !== null) {
                        var pOriginalSender = this._pSyncSignal.getSender();

                        if (this._pSyncSignal.getSender() !== null) {
                            this._pSyncSignal._setSender(this._pSender);
                        }

                        this._pSyncSignal.emit(arguments[0], arguments[1]);

                        this._pSyncSignal._setSender(pOriginalSender);
                    }

                    if (this._fnForerunnerTrigger !== null) {
                        if (this._pSender === null) {
                            this._fnForerunnerTrigger(arguments[0], arguments[1]);
                        } else if (this._sForerunnerTriggerName !== null) {
                            this._pSender[this._sForerunnerTriggerName](arguments[0], arguments[1]);
                        } else {
                            this._fnForerunnerTrigger.call(this._pSender, arguments[0], arguments[1]);
                        }
                    }

                    if (this._eType === 0 /* UNICAST */ && this._pUnicastListener !== null) {
                        pListener = this._pUnicastListener;
                        if (this._pSender === null) {
                            pListener.callback(this._pSender, arguments[0], arguments[1]);
                        } else if (pListener.callbackName !== null) {
                            pListener.reciever[pListener.callbackName](this._pSender, arguments[0], arguments[1]);
                        } else {
                            pListener.callback.call(pListener.reciever, this._pSender, arguments[0], arguments[1]);
                        }
                    } else {
                        for (var i = 0; i < this._nBroadcastListenersCount; i++) {
                            pListener = this._pBroadcastListeners[i];
                            if (pListener === null)
                                continue;
                            if (this._pSender === null) {
                                pListener.callback(this._pSender, arguments[0], arguments[1]);
                            } else if (pListener.callbackName !== null) {
                                pListener.reciever[pListener.callbackName](this._pSender, arguments[0], arguments[1]);
                            } else {
                                pListener.callback.call(pListener.reciever, this._pSender, arguments[0], arguments[1]);
                            }
                        }
                    }

                    return;
                case 3:
                    if (this._pSyncSignal !== null) {
                        var pOriginalSender = this._pSyncSignal.getSender();

                        if (this._pSyncSignal.getSender() !== null) {
                            this._pSyncSignal._setSender(this._pSender);
                        }

                        this._pSyncSignal.emit(arguments[0], arguments[1], arguments[2]);

                        this._pSyncSignal._setSender(pOriginalSender);
                    }

                    if (this._fnForerunnerTrigger !== null) {
                        if (this._pSender === null) {
                            this._fnForerunnerTrigger(arguments[0], arguments[1], arguments[2]);
                        } else if (this._sForerunnerTriggerName !== null) {
                            this._pSender[this._sForerunnerTriggerName](arguments[0], arguments[1], arguments[2]);
                        } else {
                            this._fnForerunnerTrigger.call(this._pSender, arguments[0], arguments[1], arguments[2]);
                        }
                    }

                    if (this._eType === 0 /* UNICAST */ && this._pUnicastListener !== null) {
                        pListener = this._pUnicastListener;
                        if (this._pSender === null) {
                            pListener.callback(this._pSender, arguments[0], arguments[1], arguments[2]);
                        } else if (pListener.callbackName !== null) {
                            pListener.reciever[pListener.callbackName](this._pSender, arguments[0], arguments[1], arguments[2]);
                        } else {
                            pListener.callback.call(pListener.reciever, this._pSender, arguments[0], arguments[1], arguments[2]);
                        }
                    } else {
                        for (var i = 0; i < this._nBroadcastListenersCount; i++) {
                            pListener = this._pBroadcastListeners[i];
                            if (pListener === null)
                                continue;
                            if (this._pSender === null) {
                                pListener.callback(this._pSender, arguments[0], arguments[1], arguments[2]);
                            } else if (pListener.callbackName !== null) {
                                pListener.reciever[pListener.callbackName](this._pSender, arguments[0], arguments[1], arguments[2]);
                            } else {
                                pListener.callback.call(pListener.reciever, this._pSender, arguments[0], arguments[1], arguments[2]);
                            }
                        }
                    }

                    return;
                case 4:
                    if (this._pSyncSignal !== null) {
                        var pOriginalSender = this._pSyncSignal.getSender();

                        if (this._pSyncSignal.getSender() !== null) {
                            this._pSyncSignal._setSender(this._pSender);
                        }

                        this._pSyncSignal.emit(arguments[0], arguments[1], arguments[2], arguments[3]);

                        this._pSyncSignal._setSender(pOriginalSender);
                    }

                    if (this._fnForerunnerTrigger !== null) {
                        this._fnForerunnerTrigger.call(this._pSender, arguments[0], arguments[1], arguments[2], arguments[3]);
                    }

                    if (this._eType === 0 /* UNICAST */ && this._pUnicastListener !== null) {
                        pListener = this._pUnicastListener;
                        if (this._pSender === null) {
                            pListener.callback(this._pSender, arguments[0], arguments[1], arguments[2], arguments[3]);
                        } else if (pListener.callbackName !== null) {
                            pListener.reciever[pListener.callbackName](this._pSender, arguments[0], arguments[1], arguments[2], arguments[3]);
                        } else {
                            pListener.callback.call(pListener.reciever, this._pSender, arguments[0], arguments[1], arguments[2], arguments[3]);
                        }
                    } else {
                        for (var i = 0; i < this._nBroadcastListenersCount; i++) {
                            pListener = this._pBroadcastListeners[i];
                            if (pListener === null)
                                continue;
                            if (this._pSender === null) {
                                pListener.callback(this._pSender, arguments[0], arguments[1], arguments[2], arguments[3]);
                            } else if (pListener.callbackName !== null) {
                                pListener.reciever[pListener.callbackName](this._pSender, arguments[0], arguments[1], arguments[2], arguments[3]);
                            } else {
                                pListener.callback.call(pListener.reciever, this._pSender, arguments[0], arguments[1], arguments[2], arguments[3]);
                            }
                        }
                    }

                    return;
                case 5:
                    if (this._pSyncSignal !== null) {
                        var pOriginalSender = this._pSyncSignal.getSender();

                        if (this._pSyncSignal.getSender() !== null) {
                            this._pSyncSignal._setSender(this._pSender);
                        }

                        this._pSyncSignal.emit(arguments[0], arguments[1], arguments[2], arguments[3], arguments[4]);

                        this._pSyncSignal._setSender(pOriginalSender);
                    }

                    if (this._fnForerunnerTrigger !== null) {
                        this._fnForerunnerTrigger.call(this._pSender, arguments[0], arguments[1], arguments[2], arguments[3], arguments[4]);
                    }

                    if (this._eType === 0 /* UNICAST */ && this._pUnicastListener !== null) {
                        pListener = this._pUnicastListener;
                        if (this._pSender === null) {
                            pListener.callback(this._pSender, arguments[0], arguments[1], arguments[2], arguments[3], arguments[4]);
                        } else if (pListener.callbackName !== null) {
                            pListener.reciever[pListener.callbackName](this._pSender, arguments[0], arguments[1], arguments[2], arguments[3], arguments[4]);
                        } else {
                            pListener.callback.call(pListener.reciever, this._pSender, arguments[0], arguments[1], arguments[2], arguments[3], arguments[4]);
                        }
                    } else {
                        for (var i = 0; i < this._nBroadcastListenersCount; i++) {
                            pListener = this._pBroadcastListeners[i];
                            if (pListener === null)
                                continue;
                            if (this._pSender === null) {
                                pListener.callback(this._pSender, arguments[0], arguments[1], arguments[2], arguments[3], arguments[4]);
                            } else if (pListener.callbackName !== null) {
                                pListener.reciever[pListener.callbackName](this._pSender, arguments[0], arguments[1], arguments[2], arguments[3], arguments[4]);
                            } else {
                                pListener.callback.call(pListener.reciever, this._pSender, arguments[0], arguments[1], arguments[2], arguments[3], arguments[4]);
                            }
                        }
                    }

                    return;
                case 6:
                    if (this._pSyncSignal !== null) {
                        var pOriginalSender = this._pSyncSignal.getSender();

                        if (this._pSyncSignal.getSender() !== null) {
                            this._pSyncSignal._setSender(this._pSender);
                        }

                        this._pSyncSignal.emit(arguments[0], arguments[1], arguments[2], arguments[3], arguments[4], arguments[5]);

                        this._pSyncSignal._setSender(pOriginalSender);
                    }

                    if (this._fnForerunnerTrigger !== null) {
                        this._fnForerunnerTrigger.call(this._pSender, arguments[0], arguments[1], arguments[2], arguments[3], arguments[4], arguments[5]);
                    }

                    if (this._eType === 0 /* UNICAST */ && this._pUnicastListener !== null) {
                        pListener = this._pUnicastListener;
                        if (this._pSender === null) {
                            pListener.callback(this._pSender, arguments[0], arguments[1], arguments[2], arguments[3], arguments[4], arguments[5]);
                        } else if (pListener.callbackName !== null) {
                            pListener.reciever[pListener.callbackName](this._pSender, arguments[0], arguments[1], arguments[2], arguments[3], arguments[4], arguments[5]);
                        } else {
                            pListener.callback.call(pListener.reciever, this._pSender, arguments[0], arguments[1], arguments[2], arguments[3], arguments[4], arguments[5]);
                        }
                    } else {
                        for (var i = 0; i < this._nBroadcastListenersCount; i++) {
                            pListener = this._pBroadcastListeners[i];
                            if (pListener === null)
                                continue;
                            if (this._pSender === null) {
                                pListener.callback(this._pSender, arguments[0], arguments[1], arguments[2], arguments[3], arguments[4], arguments[5]);
                            } else if (pListener.callbackName !== null) {
                                pListener.reciever[pListener.callbackName](this._pSender, arguments[0], arguments[1], arguments[2], arguments[3], arguments[4], arguments[5]);
                            } else {
                                pListener.callback.call(pListener.reciever, this._pSender, arguments[0], arguments[1], arguments[2], arguments[3], arguments[4], arguments[5]);
                            }
                        }
                    }

                    return;
                case 7:
                    if (this._pSyncSignal !== null) {
                        var pOriginalSender = this._pSyncSignal.getSender();

                        if (this._pSyncSignal.getSender() !== null) {
                            this._pSyncSignal._setSender(this._pSender);
                        }

                        this._pSyncSignal.emit(arguments[0], arguments[1], arguments[2], arguments[3], arguments[4], arguments[5], arguments[6]);

                        this._pSyncSignal._setSender(pOriginalSender);
                    }

                    if (this._fnForerunnerTrigger !== null) {
                        this._fnForerunnerTrigger.call(this._pSender, arguments[0], arguments[1], arguments[2], arguments[3], arguments[4], arguments[5], arguments[6]);
                    }

                    if (this._eType === 0 /* UNICAST */ && this._pUnicastListener !== null) {
                        pListener = this._pUnicastListener;
                        if (this._pSender === null) {
                            pListener.callback(this._pSender, arguments[0], arguments[1], arguments[2], arguments[3], arguments[4], arguments[5], arguments[6]);
                        } else if (pListener.callbackName !== null) {
                            pListener.reciever[pListener.callbackName](this._pSender, arguments[0], arguments[1], arguments[2], arguments[3], arguments[4], arguments[5], arguments[6]);
                        } else {
                            pListener.callback.call(pListener.reciever, this._pSender, arguments[0], arguments[1], arguments[2], arguments[3], arguments[4], arguments[5], arguments[6]);
                        }
                    } else {
                        for (var i = 0; i < this._nBroadcastListenersCount; i++) {
                            pListener = this._pBroadcastListeners[i];
                            if (pListener === null)
                                continue;
                            if (this._pSender === null) {
                                pListener.callback(this._pSender, arguments[0], arguments[1], arguments[2], arguments[3], arguments[4], arguments[5], arguments[6]);
                            } else if (pListener.callbackName !== null) {
                                pListener.reciever[pListener.callbackName](this._pSender, arguments[0], arguments[1], arguments[2], arguments[3], arguments[4], arguments[5], arguments[6]);
                            } else {
                                pListener.callback.call(pListener.reciever, this._pSender, arguments[0], arguments[1], arguments[2], arguments[3], arguments[4], arguments[5], arguments[6]);
                            }
                        }
                    }

                    return;
                case 8:
                    if (this._pSyncSignal !== null) {
                        var pOriginalSender = this._pSyncSignal.getSender();

                        if (this._pSyncSignal.getSender() !== null) {
                            this._pSyncSignal._setSender(this._pSender);
                        }

                        this._pSyncSignal.emit(arguments[0], arguments[1], arguments[2], arguments[3], arguments[4], arguments[5], arguments[6], arguments[7]);

                        this._pSyncSignal._setSender(pOriginalSender);
                    }

                    if (this._fnForerunnerTrigger !== null) {
                        this._fnForerunnerTrigger.call(this._pSender, arguments[0], arguments[1], arguments[2], arguments[3], arguments[4], arguments[5], arguments[6], arguments[7]);
                    }

                    if (this._eType === 0 /* UNICAST */ && this._pUnicastListener !== null) {
                        pListener = this._pUnicastListener;
                        if (this._pSender === null) {
                            pListener.callback(this._pSender, arguments[0], arguments[1], arguments[2], arguments[3], arguments[4], arguments[5], arguments[6], arguments[7]);
                        } else if (pListener.callbackName !== null) {
                            pListener.reciever[pListener.callbackName](this._pSender, arguments[0], arguments[1], arguments[2], arguments[3], arguments[4], arguments[5], arguments[6], arguments[7]);
                        } else {
                            pListener.callback.call(pListener.reciever, this._pSender, arguments[0], arguments[1], arguments[2], arguments[3], arguments[4], arguments[5], arguments[6], arguments[7]);
                        }
                    } else {
                        for (var i = 0; i < this._nBroadcastListenersCount; i++) {
                            pListener = this._pBroadcastListeners[i];
                            if (pListener === null)
                                continue;
                            if (this._pSender === null) {
                                pListener.callback(this._pSender, arguments[0], arguments[1], arguments[2], arguments[3], arguments[4], arguments[5], arguments[6], arguments[7]);
                            } else if (pListener.callbackName !== null) {
                                pListener.reciever[pListener.callbackName](this._pSender, arguments[0], arguments[1], arguments[2], arguments[3], arguments[4], arguments[5], arguments[6], arguments[7]);
                            } else {
                                pListener.callback.call(pListener.reciever, this._pSender, arguments[0], arguments[1], arguments[2], arguments[3], arguments[4], arguments[5], arguments[6], arguments[7]);
                            }
                        }
                    }

                    return;
                case 9:
                    if (this._pSyncSignal !== null) {
                        var pOriginalSender = this._pSyncSignal.getSender();

                        if (this._pSyncSignal.getSender() !== null) {
                            this._pSyncSignal._setSender(this._pSender);
                        }

                        this._pSyncSignal.emit(arguments[0], arguments[1], arguments[2], arguments[3], arguments[4], arguments[5], arguments[6], arguments[7], arguments[8]);

                        this._pSyncSignal._setSender(pOriginalSender);
                    }

                    if (this._fnForerunnerTrigger !== null) {
                        this._fnForerunnerTrigger.call(this._pSender, arguments[0], arguments[1], arguments[2], arguments[3], arguments[4], arguments[5], arguments[6], arguments[7], arguments[8]);
                    }

                    if (this._eType === 0 /* UNICAST */ && this._pUnicastListener !== null) {
                        pListener = this._pUnicastListener;
                        if (this._pSender === null) {
                            pListener.callback(this._pSender, arguments[0], arguments[1], arguments[2], arguments[3], arguments[4], arguments[5], arguments[6], arguments[7], arguments[8]);
                        } else if (pListener.callbackName !== null) {
                            pListener.reciever[pListener.callbackName](this._pSender, arguments[0], arguments[1], arguments[2], arguments[3], arguments[4], arguments[5], arguments[6], arguments[7], arguments[8]);
                        } else {
                            pListener.callback.call(pListener.reciever, this._pSender, arguments[0], arguments[1], arguments[2], arguments[3], arguments[4], arguments[5], arguments[6], arguments[7], arguments[8]);
                        }
                    } else {
                        for (var i = 0; i < this._nBroadcastListenersCount; i++) {
                            pListener = this._pBroadcastListeners[i];
                            if (pListener === null)
                                continue;
                            if (this._pSender === null) {
                                pListener.callback(this._pSender, arguments[0], arguments[1], arguments[2], arguments[3], arguments[4], arguments[5], arguments[6], arguments[7], arguments[8]);
                            } else if (pListener.callbackName !== null) {
                                pListener.reciever[pListener.callbackName](this._pSender, arguments[0], arguments[1], arguments[2], arguments[3], arguments[4], arguments[5], arguments[6], arguments[7], arguments[8]);
                            } else {
                                pListener.callback.call(pListener.reciever, this._pSender, arguments[0], arguments[1], arguments[2], arguments[3], arguments[4], arguments[5], arguments[6], arguments[7], arguments[8]);
                            }
                        }
                    }

                    return;
                case 10:
                    if (this._pSyncSignal !== null) {
                        var pOriginalSender = this._pSyncSignal.getSender();

                        if (this._pSyncSignal.getSender() !== null) {
                            this._pSyncSignal._setSender(this._pSender);
                        }

                        this._pSyncSignal.emit(arguments[0], arguments[1], arguments[2], arguments[3], arguments[4], arguments[5], arguments[6], arguments[7], arguments[8], arguments[9]);

                        this._pSyncSignal._setSender(pOriginalSender);
                    }

                    if (this._fnForerunnerTrigger !== null) {
                        this._fnForerunnerTrigger.call(this._pSender, arguments[0], arguments[1], arguments[2], arguments[3], arguments[4], arguments[5], arguments[6], arguments[7], arguments[8], arguments[9]);
                    }

                    if (this._eType === 0 /* UNICAST */ && this._pUnicastListener !== null) {
                        pListener = this._pUnicastListener;
                        if (this._pSender === null) {
                            pListener.callback(this._pSender, arguments[0], arguments[1], arguments[2], arguments[3], arguments[4], arguments[5], arguments[6], arguments[7], arguments[8], arguments[9]);
                        } else if (pListener.callbackName !== null) {
                            pListener.reciever[pListener.callbackName](this._pSender, arguments[0], arguments[1], arguments[2], arguments[3], arguments[4], arguments[5], arguments[6], arguments[7], arguments[8], arguments[9]);
                        } else {
                            pListener.callback.call(pListener.reciever, this._pSender, arguments[0], arguments[1], arguments[2], arguments[3], arguments[4], arguments[5], arguments[6], arguments[7], arguments[8], arguments[9]);
                        }
                    } else {
                        for (var i = 0; i < this._nBroadcastListenersCount; i++) {
                            pListener = this._pBroadcastListeners[i];
                            if (pListener === null)
                                continue;
                            if (this._pSender === null) {
                                pListener.callback(this._pSender, arguments[0], arguments[1], arguments[2], arguments[3], arguments[4], arguments[5], arguments[6], arguments[7], arguments[8], arguments[9]);
                            } else if (pListener.callbackName !== null) {
                                pListener.reciever[pListener.callbackName](this._pSender, arguments[0], arguments[1], arguments[2], arguments[3], arguments[4], arguments[5], arguments[6], arguments[7], arguments[8], arguments[9]);
                            } else {
                                pListener.callback.call(pListener.reciever, this._pSender, arguments[0], arguments[1], arguments[2], arguments[3], arguments[4], arguments[5], arguments[6], arguments[7], arguments[8], arguments[9]);
                            }
                        }
                    }

                    return;
                default:
                    var args = [];
                    for (var _i = 0; _i < (arguments.length); _i++) {
                        args[_i] = arguments[_i];
                    }

                    if (this._pSyncSignal !== null) {
                        var pOriginalSender = this._pSyncSignal.getSender();

                        if (this._pSyncSignal.getSender() !== null) {
                            this._pSyncSignal._setSender(this._pSender);
                        }

                        this._pSyncSignal.emit.apply(this._pSyncSignal, args);

                        this._pSyncSignal._setSender(pOriginalSender);
                    }

                    if (this._fnForerunnerTrigger !== null) {
                        this._fnForerunnerTrigger.apply(this._pSender, args);
                    }

                    args.unshift(this._pSender);

                    if (this._eType === 0 /* UNICAST */ && this._pUnicastListener !== null) {
                        pListener = this._pUnicastListener;
                        pListener.callback.apply(pListener.reciever, args);
                    } else {
                        for (var i = 0; i < nListeners; i++) {
                            pListener = this._pBroadcastListeners[i];
                            if (pListener === null)
                                continue;
                            pListener.callback.apply(pListener.reciever, args);
                        }
                    }

                    return;
            }
            //var pListener: IListener<T> = null;
            //var nListeners: uint = this._eType === EEventTypes.BROADCAST ? this._nBroadcastListenersCount : 1;
            //switch (arguments.length) {
            //	case 0:
            //		if (this._pSyncSignal !== null) {
            //			var pOriginalSender: S = this._pSyncSignal.getSender();
            //			if (this._pSyncSignal.getSender() !== null) {
            //				this._pSyncSignal._setSender(this._pSender);
            //			}
            //			this._pSyncSignal.emit();
            //			this._pSyncSignal._setSender(pOriginalSender);
            //		}
            //		if (this._fnForerunnerTrigger !== null) {
            //			this._fnForerunnerTrigger.call(this._pSender);
            //		}
            //		if (this._eType === EEventTypes.UNICAST && this._pUnicastListener !== null) {
            //			pListener = this._pUnicastListener;
            //			pListener.callback.call(pListener.reciever, this._pSender);
            //		}
            //		else {
            //			for (var i: int = 0; i < this._nBroadcastListenersCount; i++) {
            //				pListener = this._pBroadcastListeners[i];
            //				if (pListener === null) continue;
            //				pListener.callback.call(pListener.reciever, this._pSender);
            //			}
            //		}
            //		return;
            //	case 1:
            //		if (this._pSyncSignal !== null) {
            //			var pOriginalSender: S = this._pSyncSignal.getSender();
            //			if (this._pSyncSignal.getSender() !== null) {
            //				this._pSyncSignal._setSender(this._pSender);
            //			}
            //			this._pSyncSignal.emit(arguments[0]);
            //			this._pSyncSignal._setSender(pOriginalSender);
            //		}
            //		if (this._fnForerunnerTrigger !== null) {
            //			this._fnForerunnerTrigger.call(this._pSender, arguments[0]);
            //		}
            //		if (this._eType === EEventTypes.UNICAST && this._pUnicastListener !== null) {
            //			pListener = this._pUnicastListener;
            //			pListener.callback.call(pListener.reciever, this._pSender,
            //				arguments[0]);
            //		}
            //		else {
            //			for (var i: int = 0; i < this._nBroadcastListenersCount; i++) {
            //				pListener = this._pBroadcastListeners[i];
            //				if (pListener === null) continue;
            //				pListener.callback.call(pListener.reciever, this._pSender,
            //					arguments[0]);
            //			}
            //		}
            //		return;
            //	case 2:
            //		if (this._pSyncSignal !== null) {
            //			var pOriginalSender: S = this._pSyncSignal.getSender();
            //			if (this._pSyncSignal.getSender() !== null) {
            //				this._pSyncSignal._setSender(this._pSender);
            //			}
            //			this._pSyncSignal.emit(arguments[0], arguments[1]);
            //			this._pSyncSignal._setSender(pOriginalSender);
            //		}
            //		if (this._fnForerunnerTrigger !== null) {
            //			this._fnForerunnerTrigger.call(this._pSender, arguments[0], arguments[1]);
            //		}
            //		if (this._eType === EEventTypes.UNICAST && this._pUnicastListener !== null) {
            //			pListener = this._pUnicastListener;
            //			pListener.callback.call(pListener.reciever, this._pSender,
            //				arguments[0], arguments[1]);
            //		}
            //		else {
            //			for (var i: int = 0; i < this._nBroadcastListenersCount; i++) {
            //				pListener = this._pBroadcastListeners[i];
            //				if (pListener === null) continue;
            //				pListener.callback.call(pListener.reciever, this._pSender,
            //					arguments[0], arguments[1]);
            //			}
            //		}
            //		return;
            //	case 3:
            //		if (this._pSyncSignal !== null) {
            //			var pOriginalSender: S = this._pSyncSignal.getSender();
            //			if (this._pSyncSignal.getSender() !== null) {
            //				this._pSyncSignal._setSender(this._pSender);
            //			}
            //			this._pSyncSignal.emit(arguments[0], arguments[1], arguments[2]);
            //			this._pSyncSignal._setSender(pOriginalSender);
            //		}
            //		if (this._fnForerunnerTrigger !== null) {
            //			this._fnForerunnerTrigger.call(this._pSender, arguments[0], arguments[1], arguments[2]);
            //		}
            //		if (this._eType === EEventTypes.UNICAST && this._pUnicastListener !== null) {
            //			pListener = this._pUnicastListener;
            //			pListener.callback.call(pListener.reciever, this._pSender,
            //				arguments[0], arguments[1], arguments[2]);
            //		}
            //		else {
            //			for (var i: int = 0; i < this._nBroadcastListenersCount; i++) {
            //				pListener = this._pBroadcastListeners[i];
            //				if (pListener === null) continue;
            //				pListener.callback.call(pListener.reciever, this._pSender,
            //					arguments[0], arguments[1], arguments[2]);
            //			}
            //		}
            //		return;
            //	case 4:
            //		if (this._pSyncSignal !== null) {
            //			var pOriginalSender: S = this._pSyncSignal.getSender();
            //			if (this._pSyncSignal.getSender() !== null) {
            //				this._pSyncSignal._setSender(this._pSender);
            //			}
            //			this._pSyncSignal.emit(arguments[0], arguments[1], arguments[2], arguments[3]);
            //			this._pSyncSignal._setSender(pOriginalSender);
            //		}
            //		if (this._fnForerunnerTrigger !== null) {
            //			this._fnForerunnerTrigger.call(this._pSender,
            //				arguments[0], arguments[1], arguments[2], arguments[3]);
            //		}
            //		if (this._eType === EEventTypes.UNICAST && this._pUnicastListener !== null) {
            //			pListener = this._pUnicastListener;
            //			pListener.callback.call(pListener.reciever, this._pSender,
            //				arguments[0], arguments[1], arguments[2], arguments[3]);
            //		}
            //		else {
            //			for (var i: int = 0; i < this._nBroadcastListenersCount; i++) {
            //				pListener = this._pBroadcastListeners[i];
            //				if (pListener === null) continue;
            //				pListener.callback.call(pListener.reciever, this._pSender,
            //					arguments[0], arguments[1], arguments[2], arguments[3]);
            //			}
            //		}
            //		return;
            //	case 5:
            //		if (this._pSyncSignal !== null) {
            //			var pOriginalSender: S = this._pSyncSignal.getSender();
            //			if (this._pSyncSignal.getSender() !== null) {
            //				this._pSyncSignal._setSender(this._pSender);
            //			}
            //			this._pSyncSignal.emit(arguments[0], arguments[1], arguments[2], arguments[3], arguments[4]);
            //			this._pSyncSignal._setSender(pOriginalSender);
            //		}
            //		if (this._fnForerunnerTrigger !== null) {
            //			this._fnForerunnerTrigger.call(this._pSender,
            //				arguments[0], arguments[1], arguments[2], arguments[3], arguments[4]);
            //		}
            //		if (this._eType === EEventTypes.UNICAST && this._pUnicastListener !== null) {
            //			pListener = this._pUnicastListener;
            //			pListener.callback.call(pListener.reciever, this._pSender,
            //				arguments[0], arguments[1], arguments[2], arguments[3], arguments[4]);
            //		}
            //		else {
            //			for (var i: int = 0; i < this._nBroadcastListenersCount; i++) {
            //				pListener = this._pBroadcastListeners[i];
            //				if (pListener === null) continue;
            //				pListener.callback.call(pListener.reciever, this._pSender,
            //					arguments[0], arguments[1], arguments[2], arguments[3], arguments[4]);
            //			}
            //		}
            //		return;
            //	case 6:
            //		if (this._pSyncSignal !== null) {
            //			var pOriginalSender: S = this._pSyncSignal.getSender();
            //			if (this._pSyncSignal.getSender() !== null) {
            //				this._pSyncSignal._setSender(this._pSender);
            //			}
            //			this._pSyncSignal.emit(arguments[0], arguments[1], arguments[2], arguments[3], arguments[4],
            //				arguments[5]);
            //			this._pSyncSignal._setSender(pOriginalSender);
            //		}
            //		if (this._fnForerunnerTrigger !== null) {
            //			this._fnForerunnerTrigger.call(this._pSender,
            //				arguments[0], arguments[1], arguments[2], arguments[3], arguments[4],
            //				arguments[5]);
            //		}
            //		if (this._eType === EEventTypes.UNICAST && this._pUnicastListener !== null) {
            //			pListener = this._pUnicastListener;
            //			pListener.callback.call(pListener.reciever, this._pSender,
            //				arguments[0], arguments[1], arguments[2], arguments[3], arguments[4],
            //				arguments[5]);
            //		}
            //		else {
            //			for (var i: int = 0; i < this._nBroadcastListenersCount; i++) {
            //				pListener = this._pBroadcastListeners[i];
            //				if (pListener === null) continue;
            //				pListener.callback.call(pListener.reciever, this._pSender,
            //					arguments[0], arguments[1], arguments[2], arguments[3], arguments[4],
            //					arguments[5]);
            //			}
            //		}
            //		return;
            //	case 7:
            //		if (this._pSyncSignal !== null) {
            //			var pOriginalSender: S = this._pSyncSignal.getSender();
            //			if (this._pSyncSignal.getSender() !== null) {
            //				this._pSyncSignal._setSender(this._pSender);
            //			}
            //			this._pSyncSignal.emit(arguments[0], arguments[1], arguments[2], arguments[3], arguments[4],
            //				arguments[5], arguments[6]);
            //			this._pSyncSignal._setSender(pOriginalSender);
            //		}
            //		if (this._fnForerunnerTrigger !== null) {
            //			this._fnForerunnerTrigger.call(this._pSender,
            //				arguments[0], arguments[1], arguments[2], arguments[3], arguments[4],
            //				arguments[5], arguments[6]);
            //		}
            //		if (this._eType === EEventTypes.UNICAST && this._pUnicastListener !== null) {
            //			pListener = this._pUnicastListener;
            //			pListener.callback.call(pListener.reciever, this._pSender,
            //				arguments[0], arguments[1], arguments[2], arguments[3], arguments[4],
            //				arguments[5], arguments[6]);
            //		}
            //		else {
            //			for (var i: int = 0; i < this._nBroadcastListenersCount; i++) {
            //				pListener = this._pBroadcastListeners[i];
            //				if (pListener === null) continue;
            //				pListener.callback.call(pListener.reciever, this._pSender,
            //					arguments[0], arguments[1], arguments[2], arguments[3], arguments[4],
            //					arguments[5], arguments[6]);
            //			}
            //		}
            //		return;
            //	case 8:
            //		if (this._pSyncSignal !== null) {
            //			var pOriginalSender: S = this._pSyncSignal.getSender();
            //			if (this._pSyncSignal.getSender() !== null) {
            //				this._pSyncSignal._setSender(this._pSender);
            //			}
            //			this._pSyncSignal.emit(arguments[0], arguments[1], arguments[2], arguments[3], arguments[4],
            //				arguments[5], arguments[6], arguments[7]);
            //			this._pSyncSignal._setSender(pOriginalSender);
            //		}
            //		if (this._fnForerunnerTrigger !== null) {
            //			this._fnForerunnerTrigger.call(this._pSender,
            //				arguments[0], arguments[1], arguments[2], arguments[3], arguments[4],
            //				arguments[5], arguments[6], arguments[7]);
            //		}
            //		if (this._eType === EEventTypes.UNICAST && this._pUnicastListener !== null) {
            //			pListener = this._pUnicastListener;
            //			pListener.callback.call(pListener.reciever, this._pSender,
            //				arguments[0], arguments[1], arguments[2], arguments[3], arguments[4],
            //				arguments[5], arguments[6], arguments[7]);
            //		}
            //		else {
            //			for (var i: int = 0; i < this._nBroadcastListenersCount; i++) {
            //				pListener = this._pBroadcastListeners[i];
            //				if (pListener === null) continue;
            //				pListener.callback.call(pListener.reciever, this._pSender,
            //					arguments[0], arguments[1], arguments[2], arguments[3], arguments[4],
            //					arguments[5], arguments[6], arguments[7]);
            //			}
            //		}
            //		return;
            //	case 9:
            //		if (this._pSyncSignal !== null) {
            //			var pOriginalSender: S = this._pSyncSignal.getSender();
            //			if (this._pSyncSignal.getSender() !== null) {
            //				this._pSyncSignal._setSender(this._pSender);
            //			}
            //			this._pSyncSignal.emit(arguments[0], arguments[1], arguments[2], arguments[3], arguments[4],
            //				arguments[5], arguments[6], arguments[7], arguments[8]);
            //			this._pSyncSignal._setSender(pOriginalSender);
            //		}
            //		if (this._fnForerunnerTrigger !== null) {
            //			this._fnForerunnerTrigger.call(this._pSender,
            //				arguments[0], arguments[1], arguments[2], arguments[3], arguments[4],
            //				arguments[5], arguments[6], arguments[7], arguments[8]);
            //		}
            //		if (this._eType === EEventTypes.UNICAST && this._pUnicastListener !== null) {
            //			pListener = this._pUnicastListener;
            //			pListener.callback.call(pListener.reciever, this._pSender,
            //				arguments[0], arguments[1], arguments[2], arguments[3], arguments[4],
            //				arguments[5], arguments[6], arguments[7], arguments[8]);
            //		}
            //		else {
            //			for (var i: int = 0; i < this._nBroadcastListenersCount; i++) {
            //				pListener = this._pBroadcastListeners[i];
            //				if (pListener === null) continue;
            //				pListener.callback.call(pListener.reciever, this._pSender,
            //					arguments[0], arguments[1], arguments[2], arguments[3], arguments[4],
            //					arguments[5], arguments[6], arguments[7], arguments[8]);
            //			}
            //		}
            //		return;
            //	case 10:
            //		if (this._pSyncSignal !== null) {
            //			var pOriginalSender: S = this._pSyncSignal.getSender();
            //			if (this._pSyncSignal.getSender() !== null) {
            //				this._pSyncSignal._setSender(this._pSender);
            //			}
            //			this._pSyncSignal.emit(arguments[0], arguments[1], arguments[2], arguments[3], arguments[4],
            //				arguments[5], arguments[6], arguments[7], arguments[8], arguments[9]);
            //			this._pSyncSignal._setSender(pOriginalSender);
            //		}
            //		if (this._fnForerunnerTrigger !== null) {
            //			this._fnForerunnerTrigger.call(this._pSender,
            //				arguments[0], arguments[1], arguments[2], arguments[3], arguments[4],
            //				arguments[5], arguments[6], arguments[7], arguments[8], arguments[9]);
            //		}
            //		if (this._eType === EEventTypes.UNICAST && this._pUnicastListener !== null) {
            //			pListener = this._pUnicastListener;
            //			pListener.callback.call(pListener.reciever, this._pSender,
            //				arguments[0], arguments[1], arguments[2], arguments[3], arguments[4],
            //				arguments[5], arguments[6], arguments[7], arguments[8], arguments[9])
            //		}
            //		else {
            //			for (var i: int = 0; i < this._nBroadcastListenersCount; i++) {
            //				pListener = this._pBroadcastListeners[i];
            //				if (pListener === null) continue;
            //				pListener.callback.call(pListener.reciever, this._pSender,
            //					arguments[0], arguments[1], arguments[2], arguments[3], arguments[4],
            //					arguments[5], arguments[6], arguments[7], arguments[8], arguments[9]);
            //			}
            //		}
            //		return;
            //	default:
            //		var args: any[] = [];
            //		for (var _i = 0; _i < (arguments.length); _i++) {
            //			args[_i] = arguments[_i];
            //		}
            //		if (this._pSyncSignal !== null) {
            //			var pOriginalSender: S = this._pSyncSignal.getSender();
            //			if (this._pSyncSignal.getSender() !== null) {
            //				this._pSyncSignal._setSender(this._pSender);
            //			}
            //			this._pSyncSignal.emit.apply(this._pSyncSignal, args);
            //			this._pSyncSignal._setSender(pOriginalSender);
            //		}
            //		if (this._fnForerunnerTrigger !== null) {
            //			this._fnForerunnerTrigger.apply(this._pSender, args);
            //		}
            //		args.unshift(this._pSender);
            //		if (this._eType === EEventTypes.UNICAST && this._pUnicastListener !== null) {
            //			pListener = this._pUnicastListener;
            //			pListener.callback.apply(pListener.reciever, args);
            //		}
            //		else {
            //			for (var i: int = 0; i < nListeners; i++) {
            //				pListener = this._pBroadcastListeners[i];
            //				if (pListener === null) continue;
            //				pListener.callback.apply(pListener.reciever, args);
            //			}
            //		}
            //		return;
            //}
        };

        Signal.prototype.clear = function () {
            for (var i = 0; i < this._nBroadcastListenersCount; i++) {
                this.clearListener(this._pBroadcastListeners[i]);
                this._pBroadcastListeners[i] = null;
            }

            this._nBroadcastListenersCount = 0;

            this.clearListener(this._pUnicastListener);
            this._pUnicastListener = null;
        };

        Signal.prototype.hasListeners = function () {
            return this._nBroadcastListenersCount > 0 || this._pUnicastListener !== null;
        };

        Signal.prototype._syncSignal = function (pSignal) {
            this._pSyncSignal = pSignal;
        };

        Signal.prototype._setSender = function (pSender) {
            this._pSender = pSender;
        };

        Signal.prototype.fromParamsToListener = function (pArguments) {
            var pReciever = null;
            var fnCallback = null;
            var sCallbackName = null;
            var pSignal = null;
            var eType = this._eType;

            switch (pArguments.length) {
                case 1:
                    if (akra.isFunction(pArguments[0])) {
                        fnCallback = pArguments[0];
                    } else {
                        pSignal = pArguments[0];
                        pReciever = pSignal;
                        fnCallback = pSignal.emit;
                        sCallbackName = "emit";
                    }
                    break;
                case 2:
                    if (akra.isNumber(pArguments[1])) {
                        fnCallback = pArguments[0];
                        eType = pArguments[1];
                    } else {
                        pReciever = pArguments[0];
                        fnCallback = pArguments[1];
                    }
                    break;
                case 3:
                    pReciever = pArguments[0];
                    fnCallback = pArguments[1];
                    eType = pArguments[2];
                    break;
            }

            if (typeof (fnCallback) === "string") {
                if (pReciever === null) {
                    return null;
                }

                fnCallback = pReciever[fnCallback];
                sCallbackName = fnCallback;
            } else if (!akra.isNull(pReciever)) {
                sCallbackName = this.findCallbacknameForListener(pReciever, fnCallback);
            }

            if (eType !== this._eType || fnCallback === undefined || fnCallback === null) {
                return null;
            }

            var pListener = this.getEmptyListener();
            pListener.reciever = pReciever;
            pListener.callback = fnCallback;
            pListener.type = eType;

            pListener.callbackName = sCallbackName;

            return pListener;
        };

        Signal.prototype.findCallbacknameForListener = function (pReciever, fnCallback) {
            if (!akra.isNull(fnCallback)) {
                for (var i in pReciever) {
                    if (pReciever[i] === fnCallback) {
                        return i;
                    }
                }
            }

            return null;
        };
        Signal.prototype.indexOfBroadcastListener = function (pReciever, fnCallback) {
            for (var i = 0; i < this._nBroadcastListenersCount; i++) {
                if (this._pBroadcastListeners[i].reciever === pReciever && this._pBroadcastListeners[i].callback === fnCallback) {
                    return i;
                }
            }

            return -1;
        };

        Signal.prototype.getEmptyListener = function () {
            if (Signal._nEmptyListenersCount > 0) {
                var pListener = Signal._pEmptyListenersList[--Signal._nEmptyListenersCount];
                Signal._pEmptyListenersList[Signal._nEmptyListenersCount] = null;
                return pListener;
            } else {
                return {
                    reciever: null,
                    callback: null,
                    type: 0,
                    callbackName: null
                };
            }
        };

        Signal.prototype.clearListener = function (pListener) {
            if (pListener === null) {
                return;
            }

            pListener.reciever = null;
            pListener.callback = null;
            pListener.type = 0;

            pListener.callbackName = null;

            Signal._pEmptyListenersList[Signal._nEmptyListenersCount++] = pListener;
        };

        // Проверяем, существует ли функция в прототипе сендера, чтобы не подавались noname
        // функции в сигналы и в качестве fnForerunner
        Signal.prototype.isMethodExistsInSenderPrototype = function (fn) {
            if (akra.isNull(this._pSender)) {
                return true;
            }

            for (var p in this._pSender) {
                if (this._pSender[p] === fn) {
                    return true;
                }
            }

            return false;
        };
        Signal._pEmptyListenersList = [];
        Signal._nEmptyListenersCount = 0;
        return Signal;
    })();
    akra.Signal = Signal;

    var MuteSignal = (function (_super) {
        __extends(MuteSignal, _super);
        function MuteSignal() {
            _super.apply(this, arguments);
        }
        MuteSignal.prototype.emit = function () {
        };
        return MuteSignal;
    })(Signal);
    akra.MuteSignal = MuteSignal;
})(akra || (akra = {}));
//# sourceMappingURL=events.js.map
