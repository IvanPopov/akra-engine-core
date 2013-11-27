/// <reference path="../idl/IPipe.ts" />

/// <reference path="../logger.ts" />
/// <reference path="../debug.ts" />
/// <reference path="../config/config.ts" />
/// <reference path="../uri/uri.ts" />
/// <reference path="../path/path.ts" />
/// <reference path="../events.ts" />
/// <reference path="../guid.ts" />

module akra.net {

    /** @const */
    var WEBSOCKET_PORT = config.net.port;


    export class Pipe implements IPipe {
        guid: uint = guid();

        opened: ISignal<{ (pPipe: IPipe, e: Event): void; }> = new Signal(this);
        closed: ISignal<{ (pPipe: IPipe, e: CloseEvent): void; }> = new Signal(this);
        error: ISignal<{ (pPipe: IPipe, e: ErrorEvent): void; }> = new Signal(this);
        message: ISignal<{ (pPipe: IPipe, pData: any, eType: EPipeDataTypes): void; }> = new Signal(this);   
        

        protected _pAddr: IURI = null;
        protected _nMesg: uint = 0; /** Number of sended messages.*/
        protected _eType: EPipeTypes = EPipeTypes.UNKNOWN;
        protected _pConnect: IVirualDescriptor = null;
        protected _bSetupComplete: boolean = false;

        get uri(): IURI {
            return uri.parse(this._pAddr.toString());
        }

        constructor(sAddr: string = null) {
            if (!isNull(sAddr)) {
                this.open(sAddr);
            }
        }

        open(pAddr?: IURI): boolean;
        open(sAddr?: string): boolean;
        open(sAddr: any = null): boolean {
            var pAddr: IURI;
            var eType: EPipeTypes;
            var pSocket: WebSocket = null;
            var pWorker: Worker = null;
            var pPipe: IPipe = this;

            if (!isNull(sAddr)) {
                pAddr = uri.parse(<string>sAddr);
            }
            else {
                if (this.isCreated()) {
                    this.close();
                }

                pAddr = this.uri;
            }

            // pipe to websocket
            if (pAddr.protocol.toLowerCase() === "ws") {
                //unknown port
                if (!(pAddr.port > 0)) {
                    pAddr.port = WEBSOCKET_PORT;
                }

                //websocket unsupported
                if (!isDefAndNotNull(WebSocket)) {
                    logger.error("Your browser does not support websocket api.");
                    return false;
                }

                pSocket = new WebSocket(pAddr.toString());


                pSocket.binaryType = "arraybuffer";
                eType = EPipeTypes.WEBSOCKET;
            }
            else if (path.parse(pAddr.path).ext.toLowerCase() === "js") {
                if (!isDefAndNotNull(Worker)) {
                    logger.error("Your browser does not support webworker api.");
                    return false;
                }

                pWorker = new Worker(pAddr.toString());
                eType = EPipeTypes.WEBWORKER;
            }
            else {
                logger.error("Pipe supported only websockets/webworkers.");
                return false;
            }

            this._pConnect = pWorker || pSocket;
            this._pAddr = pAddr;
            this._eType = eType;

            if (isDefAndNotNull(window)) {
                window.onunload = function (): void {
                    pPipe.close();
                }
			}

            if (!isNull(this._pConnect)) {
                this.setupConnect();

                return true;
            }

            return false;
        }

        private setupConnect(): void {
            var pConnect: IVirualDescriptor = this._pConnect;
            var pPipe: IPipe = this;
            var pAddr: IURI = this._pAddr;

            if (this._bSetupComplete) {
                return;
            }

            pConnect.onmessage = function (pMessage: any): void {
                if (isArrayBuffer(pMessage.data)) {
                    pPipe.message.emit(pMessage.data, EPipeDataTypes.BINARY);
                }
                else {
                    pPipe.message.emit(pMessage.data, EPipeDataTypes.STRING);
                }
            }

			pConnect.onopen = function (pEvent: Event): void {
                logger.log("created connect to: " + pAddr.toString());

                pPipe.opened.emit(pEvent);
            }

			pConnect.onerror = function (pErr: ErrorEvent): void {
                debug.warn("pipe error detected: " + pErr.message);
                pPipe.error.emit(pErr);
            }

			pConnect.onclose = function (pEvent: CloseEvent): void {
                logger.log("connection to " + pAddr.toString() + " closed");
                debug.log("Close event:", pEvent);
                pPipe.closed.emit(pEvent);
            }

			this._bSetupComplete = true;
        }

        close(): void {
            var pSocket: WebSocket;
            var pWorker: Worker;
            if (this.isOpened()) {
                switch (this._eType) {
                    case EPipeTypes.WEBSOCKET:
                        pSocket = <WebSocket>this._pConnect;
                        pSocket.onmessage = null;
                        pSocket.onerror = null;
                        pSocket.onopen = null;
                        pSocket.close();
                        break;
                    case EPipeTypes.WEBWORKER:
                        pWorker = <Worker><any>this._pConnect;
                        pWorker.terminate();
                }
            }

            this._pConnect = null;
            this._bSetupComplete = false;
        }

        write(pValue: any): boolean {
            var pSocket: WebSocket;
            var pWorker: Worker;

            if (this.isOpened()) {
                this._nMesg++;

                switch (this._eType) {
                    case EPipeTypes.WEBSOCKET:
                        pSocket = <WebSocket>this._pConnect;

                        if (isObject(pValue)) {
                            pValue = JSON.stringify(pValue);
                        }

                        pSocket.send(pValue);

                        return true;

                    case EPipeTypes.WEBWORKER:
                        pWorker = <Worker><any>this._pConnect;

                        if (isDef(pValue.byteLength)) {
                            pWorker.postMessage(pValue, [pValue]);
                        }
                        else {
                            pWorker.postMessage(pValue);
                        }

                        return true;
                }
            }

            return false;
        }

        isClosed(): boolean {
            switch (this._eType) {
                case EPipeTypes.WEBSOCKET:
                    return isNull(this._pConnect) || ((<WebSocket>this._pConnect).readyState === WebSocket.CLOSED);
            }

            return isNull(this._pConnect);
        }

        isOpened(): boolean {
            switch (this._eType) {
                case EPipeTypes.WEBSOCKET:
                    return !isNull(this._pConnect) && (<WebSocket>this._pConnect).readyState === WebSocket.OPEN;
            }

            return !isNull(this._pConnect);
        }


        isCreated(): boolean {
            return !isNull(this._pConnect);
        }
    }

}