/// <reference path="../idl/AIApiInfo.ts" />
/// <reference path="../idl/3d-party/zip.d.ts" />
/// <reference path="../idl/common.d.ts" />


import Singleton = require("util/Singleton");
import webgl = require("webgl");
import logger = require("logger");





class Info extends Singleton<Info> implements AIApiInfo {
    private _bWebAudio: boolean = false;
    private _bFile: boolean = false;
    private _bFileSystem: boolean = false;
    private _bWebWorker: boolean = false;
    private _bTransferableObjects: boolean = false;
    private _bLocalStorage: boolean = false;
    private _bWebSocket: boolean = false;
    private _bGamepad: boolean = false;

    /** inline */ get webGL(): boolean {
        return webgl.isEnabled();
    }

    get transferableObjects(): boolean {
        if (!this._bTransferableObjects) {
            this._bTransferableObjects = (this._bWebWorker && this.chechTransferableObjects() ? true : false);
        }

        return this._bTransferableObjects;
    }

    /** inline */ get file(): boolean {
        return this._bFile;
    }

    /** inline */ get fileSystem(): boolean {
        return this._bFileSystem;
    }

    /** inline */ get webAudio(): boolean {
        return this._bWebAudio;
    }

    /** inline */ get webWorker(): boolean {
        return this._bWebWorker;
    }

    /** inline */ get localStorage(): boolean {
        return this._bLocalStorage;
    }

    /** inline */ get webSocket(): boolean {
        return this._bWebSocket;
    }

    /** inline */ get gamepad(): boolean {
        return this._bGamepad;
    }

    /** inline */ get zip(): boolean {
        return isDefAndNotNull(window["zip"]);
    }

    constructor() {
        super();

        var pApi = {};

        this._bWebAudio = ((<any>window).AudioContext && (<any>window).webkitAudioContext ? true : false);
        this._bFile = ((<any>window).File && (<any>window).FileReader && (<any>window).FileList && (<any>window).Blob ? true : false);
        this._bFileSystem = (this._bFile && (<any>window).URL && (<any>window).requestFileSystem ? true : false);
        this._bWebWorker = isDef((<any>window).Worker);
        this._bLocalStorage = isDef((<any>window).localStorage);
        this._bWebSocket = isDef((<any>window).WebSocket);
        this._bGamepad = !!(<any>navigator).webkitGetGamepads || !!(<any>navigator).webkitGamepads || (navigator.userAgent.indexOf('Firefox/') != -1);
    }

    private chechTransferableObjects(): boolean {
        var pBlob: Blob = new Blob(["onmessage = function(e) { postMessage(true); }"], { "type": "text\/javascript" });
        var sBlobURL: string = (<any>window).URL.createObjectURL(pBlob);
        var pWorker: Worker = new Worker(sBlobURL);

        var pBuffer: ArrayBuffer = new ArrayBuffer(1);

        try {
            pWorker.postMessage(pBuffer, [pBuffer]);
        }
        catch (e) {
            logger.log('transferable objects not supported in your browser...');
        }

        pWorker.terminate();

        if (pBuffer.byteLength) {
		    return false
		}

        return true;
    }
}


export = Info;

