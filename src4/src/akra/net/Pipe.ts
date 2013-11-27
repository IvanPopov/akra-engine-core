/// <reference path="../idl/AIPipe.ts" />
import logger = require("logger");
import config = require("config");
import uri = require("uri");
import path = require("path");

/** @const */
var WEBSOCKET_PORT = config.net.port;


class Pipe implements AIPipe {
    protected _pAddr: AIURI = null;
    protected _nMesg: uint = 0; /** Number of sended messages.*/
    protected _eType: AEPipeTypes = AEPipeTypes.UNKNOWN;
    protected _pConnect: AIVirualDescriptor = null;
    protected _bSetupComplete: boolean = false;

    get uri(): AIURI {
        return uri.parse(this._pAddr.toString());
    }

    constructor(sAddr: string = null) {
        if (!isNull(sAddr)) {
            this.open(sAddr);
        }
    }

    open(pAddr?: AIURI): boolean;
    open(sAddr?: string): boolean;
    open(sAddr: any = null): boolean {
        var pAddr: AIURI;
        var eType: AEPipeTypes;
        var pSocket: WebSocket = null;
        var pWorker: Worker = null;
        var pPipe: AIPipe = this;

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
            eType = AEPipeTypes.WEBSOCKET;
        }
        else if (path.parse(pAddr.path).ext.toLowerCase() === "js") {
            if (!isDefAndNotNull(Worker)) {
                logger.error("Your browser does not support webworker api.");
                return false;
            }

            pWorker = new Worker(pAddr.toString());
            eType = AEPipeTypes.WEBWORKER;
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
        var pConnect: AIVirualDescriptor = this._pConnect;
        var pPipe: AIPipe = this;
        var pAddr: AIURI = this._pAddr;

        if (this._bSetupComplete) {
            return;
        }

        pConnect.onmessage = function (pMessage: any): void {
            if (isArrayBuffer(pMessage.data)) {
                pPipe.message(pMessage.data, AEPipeDataTypes.BINARY);
            }
            else {
                pPipe.message(pMessage.data, AEPipeDataTypes.STRING);
            }
        }

			pConnect.onopen = function (pEvent: Event): void {
            logger.log("created connect to: " + pAddr.toString());

            pPipe.opened(pEvent);
        }

			pConnect.onerror = function (pErr: ErrorEvent): void {
            logger.warn("pipe error detected: " + pErr.message);
            pPipe.error(pErr);
        }

			pConnect.onclose = function (pEvent: CloseEvent): void {
            logger.log("connection to " + pAddr.toString() + " closed");
            logger.log("Close event:", pEvent);
            pPipe.closed(pEvent);
        }

			this._bSetupComplete = true;
    }

    close(): void {
        var pSocket: WebSocket;
        var pWorker: Worker;
        if (this.isOpened()) {
            switch (this._eType) {
                case AEPipeTypes.WEBSOCKET:
                    pSocket = <WebSocket>this._pConnect;
                    pSocket.onmessage = null;
                    pSocket.onerror = null;
                    pSocket.onopen = null;
                    pSocket.close();
                    break;
                case AEPipeTypes.WEBWORKER:
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
                case AEPipeTypes.WEBSOCKET:
                    pSocket = <WebSocket>this._pConnect;

                    if (isObject(pValue)) {
                        pValue = JSON.stringify(pValue);
                    }

                    pSocket.send(pValue);

                    return true;

                case AEPipeTypes.WEBWORKER:
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
            case AEPipeTypes.WEBSOCKET:
                return isNull(this._pConnect) || ((<WebSocket>this._pConnect).readyState === WebSocket.CLOSED);
        }

        return isNull(this._pConnect);
    }

    isOpened(): boolean {
        switch (this._eType) {
            case AEPipeTypes.WEBSOCKET:
                return !isNull(this._pConnect) && (<WebSocket>this._pConnect).readyState === WebSocket.OPEN;
        }

        return !isNull(this._pConnect);
    }


    isCreated(): boolean {
        return !isNull(this._pConnect);
    }

    //CREATE_EVENT_TABLE(Pipe);
    //BROADCAST(opened, VOID);
    //BROADCAST(closed, CALL(ev));
    //BROADCAST(error, CALL(err));
    //BROADCAST(message, CALL(data, type));
}

export = Pipe;