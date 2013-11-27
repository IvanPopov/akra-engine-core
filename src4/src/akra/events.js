/// <reference path="idl/IEventProvider.ts" />
var akra;
(function (akra) {
    var Signal = (function () {
        function Signal(pSender, eType) {
            if (typeof eType === "undefined") { eType = akra.EEventType.BROADCAST; }
            this._pBroadcastListeners = null;
            this._nBroadcastListenersCount = 0;
            this._pUnicastListener = null;
            this._pSender = null;
            this._eType = akra.EEventType.BROADCAST;
            this._pSender = pSender;
            this._eType = eType;

            if (this._eType === akra.EEventType.BROADCAST) {
                this._pBroadcastListeners = [];
            }
        }
        Signal.prototype.connect = function () {
            var pListener = this.fromParamsToListener(arguments);

            if (pListener === null) {
                return false;
            }

            if (pListener.type === akra.EEventType.UNICAST) {
                if (this._pUnicastListener !== null) {
                    this.clearListener(pListener);
                    return false;
                }

                this._pUnicastListener = pListener;
            } else {
                if (this.indexOfBroadcastListener(pListener.reciever, pListener.callback) >= 0) {
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

            if (pTmpListener.type === akra.EEventType.UNICAST) {
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
            var nListeners = this._eType === akra.EEventType.BROADCAST ? this._nBroadcastListenersCount : 1;
            for (var i = 0; i < nListeners; i++) {
                if (this._eType === akra.EEventType.UNICAST) {
                    pListener = this._pUnicastListener;
                } else {
                    pListener = this._pBroadcastListeners[i];
                }

                if (pListener === null) {
                    continue;
                }

                switch (arguments.length) {
                    case 0:
                        pListener.callback.call(pListener.reciever, this._pSender);
                        break;
                    case 1:
                        pListener.callback.call(pListener.reciever, this._pSender, arguments[0]);
                        break;
                    case 2:
                        pListener.callback.call(pListener.reciever, this._pSender, arguments[0], arguments[1]);
                        break;
                    case 3:
                        pListener.callback.call(pListener.reciever, this._pSender, arguments[0], arguments[1], arguments[2]);
                        break;
                    case 4:
                        pListener.callback.call(pListener.reciever, this._pSender, arguments[0], arguments[1], arguments[2], arguments[3]);
                        break;
                    case 5:
                        pListener.callback.call(pListener.reciever, this._pSender, arguments[0], arguments[1], arguments[2], arguments[3], arguments[4]);
                        break;
                    case 6:
                        pListener.callback.call(pListener.reciever, this._pSender, arguments[0], arguments[1], arguments[2], arguments[3], arguments[4], arguments[5]);
                        break;
                    case 7:
                        pListener.callback.call(pListener.reciever, this._pSender, arguments[0], arguments[1], arguments[2], arguments[3], arguments[4], arguments[5], arguments[6]);
                        break;
                    case 8:
                        pListener.callback.call(pListener.reciever, this._pSender, arguments[0], arguments[1], arguments[2], arguments[3], arguments[4], arguments[5], arguments[6], arguments[7]);
                        break;
                    case 9:
                        pListener.callback.call(pListener.reciever, this._pSender, arguments[0], arguments[1], arguments[2], arguments[3], arguments[4], arguments[5], arguments[6], arguments[7], arguments[8]);
                        break;
                    case 10:
                        pListener.callback.call(pListener.reciever, this._pSender, arguments[0], arguments[1], arguments[2], arguments[3], arguments[4], arguments[5], arguments[6], arguments[7], arguments[8], arguments[9]);
                        break;
                    default:
                        var args = [this._pSender];
                        for (var _i = 0; _i < (arguments.length); _i++) {
                            args[_i + 1] = arguments[_i];
                        }
                        pListener.callback.apply(pListener.reciever, args);
                }
            }
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

        Signal.prototype.fromParamsToListener = function (pArguments) {
            var pReciever = null;
            var fnCallback = null;
            var eType = this._eType;

            switch (pArguments.length) {
                case 1:
                    fnCallback = pArguments[0];
                    break;
                case 2:
                    if (typeof (pArguments[1]) === "number") {
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

                if (pReciever.constructor.prototype[fnCallback]) {
                    fnCallback = pReciever.constructor.prototype[fnCallback];
                } else {
                    fnCallback = pReciever[fnCallback];
                }
            }

            if (eType !== this._eType || fnCallback === undefined || fnCallback === null) {
                return null;
            }

            var pListener = this.getEmptyListener();
            pListener.reciever = pReciever;
            pListener.callback = fnCallback;
            pListener.type = eType;

            return pListener;
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
                    type: 0
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

            Signal._pEmptyListenersList[Signal._nEmptyListenersCount++] = pListener;
        };
        Signal._pEmptyListenersList = [];
        Signal._nEmptyListenersCount = 0;
        return Signal;
    })();
    akra.Signal = Signal;
})(akra || (akra = {}));
