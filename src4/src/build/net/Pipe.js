/// <reference path="../idl/IPipe.ts" />
var akra;
(function (akra) {
    /// <reference path="../logger.ts" />
    /// <reference path="../debug.ts" />
    /// <reference path="../config/config.ts" />
    /// <reference path="../uri/uri.ts" />
    /// <reference path="../path/path.ts" />
    /// <reference path="../events.ts" />
    /// <reference path="../guid.ts" />
    (function (net) {
        /** @const */
        var WEBSOCKET_PORT = akra.config.net.port;

        var Pipe = (function () {
            function Pipe(sAddr) {
                if (typeof sAddr === "undefined") { sAddr = null; }
                this.guid = akra.guid();
                this._pAddr = null;
                this._nMesg = 0;
                this._eType = 0 /* UNKNOWN */;
                this._pConnect = null;
                this._bSetupComplete = false;
                this.setupSignals();

                if (!akra.isNull(sAddr)) {
                    this.open(sAddr);
                }
            }
            Pipe.prototype.setupSignals = function () {
                this.opened = this.opened || new akra.Signal(this);
                this.closed = this.closed || new akra.Signal(this);
                this.error = this.error || new akra.Signal(this);
                this.message = this.message || new akra.Signal(this);
            };

            Pipe.prototype.getURI = function () {
                return akra.uri.parse(this._pAddr.toString());
            };

            Pipe.prototype.open = function (sAddr) {
                if (typeof sAddr === "undefined") { sAddr = null; }
                var pAddr;
                var eType;
                var pSocket = null;
                var pWorker = null;
                var pPipe = this;

                if (!akra.isNull(sAddr)) {
                    pAddr = akra.uri.parse(sAddr);
                } else {
                    if (this.isCreated()) {
                        this.close();
                    }

                    pAddr = this.getURI();
                }

                // pipe to websocket
                if (pAddr.getProtocol().toLowerCase() === "ws") {
                    //unknown port
                    if (!(pAddr.getPort() > 0)) {
                        pAddr.setPort(WEBSOCKET_PORT);
                    }

                    //websocket unsupported
                    if (!akra.isDefAndNotNull(WebSocket)) {
                        akra.logger.error("Your browser does not support websocket api.");
                        return false;
                    }

                    pSocket = new WebSocket(pAddr.toString());

                    pSocket.binaryType = "arraybuffer";
                    eType = 1 /* WEBSOCKET */;
                } else if (akra.path.parse(pAddr.getPath()).getExt().toLowerCase() === "js") {
                    if (!akra.isDefAndNotNull(Worker)) {
                        akra.logger.error("Your browser does not support webworker api.");
                        return false;
                    }

                    pWorker = new Worker(pAddr.toString());
                    eType = 2 /* WEBWORKER */;
                } else {
                    akra.logger.error("Pipe supported only websockets/webworkers.");
                    return false;
                }

                this._pConnect = (pWorker || pSocket);
                this._pAddr = pAddr;
                this._eType = eType;

                if (akra.isDefAndNotNull(window)) {
                    window.onunload = function () {
                        pPipe.close();
                    };
                }

                if (!akra.isNull(this._pConnect)) {
                    this.setupConnect();

                    return true;
                }

                return false;
            };

            Pipe.prototype.setupConnect = function () {
                var pConnect = this._pConnect;
                var pPipe = this;
                var pAddr = this._pAddr;

                if (this._bSetupComplete) {
                    return;
                }

                pConnect.onmessage = function (pMessage) {
                    if (akra.isArrayBuffer(pMessage.data)) {
                        pPipe.message.emit(pMessage.data, 0 /* BINARY */);
                    } else {
                        pPipe.message.emit(pMessage.data, 1 /* STRING */);
                    }
                };

                pConnect.onopen = function (pEvent) {
                    akra.logger.log("created connect to: " + pAddr.toString());

                    pPipe.opened.emit(pEvent);
                };

                pConnect.onerror = function (pErr) {
                    akra.debug.warn("pipe error detected: " + pErr.message);
                    pPipe.error.emit(pErr);
                };

                pConnect.onclose = function (pEvent) {
                    akra.logger.log("connection to " + pAddr.toString() + " closed");
                    akra.debug.log("Close event:", pEvent);
                    pPipe.closed.emit(pEvent);
                };

                this._bSetupComplete = true;
            };

            Pipe.prototype.close = function () {
                var pSocket;
                var pWorker;
                if (this.isOpened()) {
                    switch (this._eType) {
                        case 1 /* WEBSOCKET */:
                            pSocket = this._pConnect;
                            pSocket.onmessage = null;
                            pSocket.onerror = null;
                            pSocket.onopen = null;
                            pSocket.close();
                            break;
                        case 2 /* WEBWORKER */:
                            pWorker = this._pConnect;
                            pWorker.terminate();
                    }
                }

                this._pConnect = null;
                this._bSetupComplete = false;
            };

            Pipe.prototype.write = function (pValue) {
                var pSocket;
                var pWorker;

                if (this.isOpened()) {
                    this._nMesg++;

                    switch (this._eType) {
                        case 1 /* WEBSOCKET */:
                            pSocket = this._pConnect;

                            if (akra.isObject(pValue)) {
                                pValue = JSON.stringify(pValue);
                            }

                            pSocket.send(pValue);

                            return true;

                        case 2 /* WEBWORKER */:
                            pWorker = this._pConnect;

                            if (akra.isDef(pValue.byteLength)) {
                                pWorker.postMessage(pValue, [pValue]);
                            } else {
                                pWorker.postMessage(pValue);
                            }

                            return true;
                    }
                }

                return false;
            };

            Pipe.prototype.isClosed = function () {
                switch (this._eType) {
                    case 1 /* WEBSOCKET */:
                        return akra.isNull(this._pConnect) || (this._pConnect.readyState === WebSocket.CLOSED);
                }

                return akra.isNull(this._pConnect);
            };

            Pipe.prototype.isOpened = function () {
                switch (this._eType) {
                    case 1 /* WEBSOCKET */:
                        return !akra.isNull(this._pConnect) && this._pConnect.readyState === WebSocket.OPEN;
                }

                return !akra.isNull(this._pConnect);
            };

            Pipe.prototype.isCreated = function () {
                return !akra.isNull(this._pConnect);
            };
            return Pipe;
        })();
        net.Pipe = Pipe;
    })(akra.net || (akra.net = {}));
    var net = akra.net;
})(akra || (akra = {}));
//# sourceMappingURL=Pipe.js.map
