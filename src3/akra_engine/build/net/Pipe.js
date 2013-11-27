define(["require", "exports", "logger", "config", "uri", "path"], function(require, exports, __logger__, __config__, __uri__, __path__) {
    /// <reference path="../idl/AIPipe.ts" />
    var logger = __logger__;
    var config = __config__;
    var uri = __uri__;
    var path = __path__;

    /** @const */
    var WEBSOCKET_PORT = config.net.port;

    var Pipe = (function () {
        function Pipe(sAddr) {
            if (typeof sAddr === "undefined") { sAddr = null; }
            this._pAddr = null;
            this._nMesg = 0;
            this._eType = 0 /* UNKNOWN */;
            this._pConnect = null;
            this._bSetupComplete = false;
            if (!isNull(sAddr)) {
                this.open(sAddr);
            }
        }
        Object.defineProperty(Pipe.prototype, "uri", {
            get: function () {
                return uri.parse(this._pAddr.toString());
            },
            enumerable: true,
            configurable: true
        });

        Pipe.prototype.open = function (sAddr) {
            if (typeof sAddr === "undefined") { sAddr = null; }
            var pAddr;
            var eType;
            var pSocket = null;
            var pWorker = null;
            var pPipe = this;

            if (!isNull(sAddr)) {
                pAddr = uri.parse(sAddr);
            } else {
                if (this.isCreated()) {
                    this.close();
                }

                pAddr = this.uri;
            }

            if (pAddr.protocol.toLowerCase() === "ws") {
                if (!(pAddr.port > 0)) {
                    pAddr.port = WEBSOCKET_PORT;
                }

                if (!isDefAndNotNull(WebSocket)) {
                    logger.error("Your browser does not support websocket api.");
                    return false;
                }

                pSocket = new WebSocket(pAddr.toString());

                pSocket.binaryType = "arraybuffer";
                eType = 1 /* WEBSOCKET */;
            } else if (path.parse(pAddr.path).ext.toLowerCase() === "js") {
                if (!isDefAndNotNull(Worker)) {
                    logger.error("Your browser does not support webworker api.");
                    return false;
                }

                pWorker = new Worker(pAddr.toString());
                eType = 2 /* WEBWORKER */;
            } else {
                logger.error("Pipe supported only websockets/webworkers.");
                return false;
            }

            this._pConnect = pWorker || pSocket;
            this._pAddr = pAddr;
            this._eType = eType;

            if (isDefAndNotNull(window)) {
                window.onunload = function () {
                    pPipe.close();
                };
            }

            if (!isNull(this._pConnect)) {
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
                if (isArrayBuffer(pMessage.data)) {
                    pPipe.message(pMessage.data, 0 /* BINARY */);
                } else {
                    pPipe.message(pMessage.data, 1 /* STRING */);
                }
            };

            pConnect.onopen = function (pEvent) {
                logger.log("created connect to: " + pAddr.toString());

                pPipe.opened(pEvent);
            };

            pConnect.onerror = function (pErr) {
                logger.warn("pipe error detected: " + pErr.message);
                pPipe.error(pErr);
            };

            pConnect.onclose = function (pEvent) {
                logger.log("connection to " + pAddr.toString() + " closed");
                logger.log("Close event:", pEvent);
                pPipe.closed(pEvent);
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

                        if (isObject(pValue)) {
                            pValue = JSON.stringify(pValue);
                        }

                        pSocket.send(pValue);

                        return true;

                    case 2 /* WEBWORKER */:
                        pWorker = this._pConnect;

                        if (isDef(pValue.byteLength)) {
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
                    return isNull(this._pConnect) || ((this._pConnect).readyState === WebSocket.CLOSED);
            }

            return isNull(this._pConnect);
        };

        Pipe.prototype.isOpened = function () {
            switch (this._eType) {
                case 1 /* WEBSOCKET */:
                    return !isNull(this._pConnect) && (this._pConnect).readyState === WebSocket.OPEN;
            }

            return !isNull(this._pConnect);
        };

        Pipe.prototype.isCreated = function () {
            return !isNull(this._pConnect);
        };
        return Pipe;
    })();

    
    return Pipe;
});
//# sourceMappingURL=Pipe.js.map
