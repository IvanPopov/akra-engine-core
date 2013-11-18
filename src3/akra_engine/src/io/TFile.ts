/// <reference path="../idl/AIFile.ts" />
/// <reference path="../idl/AIThread.ts" />
/// <reference path="../idl/AEFileTransferModes.ts" />

import config = require("config");
import threading = require("threading");
import path = require("path");
import uri = require("uri");
import logger = require("logger");
import io = require("io");
import info = require("info");
import math = require("math");


enum AEFileActions {
    k_Open = 1,
    k_Read = 2,
    k_Write,
    k_Clear,
    k_Exists,
    k_Remove
}

interface AIFileCommand {
    act: AEFileActions;
    name: string;
    mode: int;
    pos?: uint;
    transfer?: AEFileTransferModes;
    data?: any;
    contentType?: string;
    progress?: boolean;
}






class TFile implements AIFile {
    private static localManager = new threading.Manager(config.io.tfile.local);
    private static remoteManager = new threading.Manager(config.io.tfile.remote);

    protected _iMode: int;
    protected _pUri: AIURI = null;
    protected _nCursorPosition: uint = 0;
    protected _bOpened: boolean = false;
    protected _eTransferMode: AEFileTransferModes = AEFileTransferModes.k_Normal;
    protected _pFileMeta: AIFileMeta = null;
    protected _isLocal: boolean = false;

    get path(): string {
        return this._pUri.toString();
    }

    get name(): string {
        return path.parse(this._pUri.path).basename;
    }

    get mode(): int {
        return this._iMode;
    }

    get meta(): AIFileMeta {
        logger.assert(isDefAndNotNull(this._pFileMeta), "There is no file handle open.");
        return this._pFileMeta;
    }

    //set mode(sMode: string);
    //set mode(iMode: int);
    set mode(mode: any) {
        this._iMode = isString(mode) ? io.filemode(<string><any>mode) : mode;
    }

    set onread(fnCallback: (e: Error, data: any) => void) {
        this.read(fnCallback);
    }

    set onopen(fnCallback: Function) {
        this.open(fnCallback);
    }

    get position(): uint {
        logger.assert(isDefAndNotNull(this._pFileMeta), "There is no file handle open.");
        return this._nCursorPosition;
    }

    set position(iOffset: uint) {
        logger.assert(isDefAndNotNull(this._pFileMeta), "There is no file handle open.");
        this._nCursorPosition = iOffset;
    }

    get byteLength(): uint {
        return this._pFileMeta ? this._pFileMeta.size : 0;
    }

    constructor(sFilename?: string, sMode?: string, fnCallback?: Function);
    constructor(sFilename?: string, iMode?: int, fnCallback?: Function);
    constructor(sFilename?: string, sMode?: any, fnCallback: Function = TFile.defaultCallback) {
        if (isDef(sMode)) {
            this._iMode = isString(sMode) ? io.filemode(sMode) : sMode;
        }

        this.setAndValidateUri(uri.parse(sFilename));

        if (info.api.transferableObjects) {
            this._eTransferMode = AEFileTransferModes.k_Fast;
        }
        //OPERA MOVED TO WEBKIT, and this TRAP not more be needed!
        // else if (info.browser.name == "Opera") {
        // 	this._eTransferMode = AEFileTransferModes.k_Slow;
        // }

        if (arguments.length > 2) {
            this.open(sFilename, sMode, fnCallback);
        }
    }

    open(sFilename: string, iMode: int, fnCallback?: Function): void;
    open(sFilename: string, sMode: string, fnCallback?: Function): void;
    open(sFilename: string, fnCallback?: Function): void;
    open(iMode: int, fnCallback?: Function): void;
    open(fnCallback?: Function): void;
    open(sFilename?: any, iMode?: any, fnCallback?: any): void {
        var pFile: AIFile = this;
        var hasMode: boolean = !isFunction(iMode);

        if (arguments.length < 3) {
            if (isString(arguments[0])) {
                this.setAndValidateUri(uri.parse(sFilename));
                fnCallback = arguments[1];
            }
            else if (isInt(arguments[0])) {
                this._iMode = arguments[0];
                fnCallback = arguments[1];
            }
            else {
                fnCallback = arguments[0];
            }

            logger.assert(isDefAndNotNull(this._pUri), "No filename provided.");


            this.open(this._pUri.toString(), this._iMode, fnCallback);

            return;
        }

        fnCallback = arguments[hasMode ? 2 : 1];
        fnCallback = fnCallback || TFile.defaultCallback;

        if (this.isOpened()) {
            logger.warn("file already opened: " + this.name);
            (<Function>fnCallback).call(pFile, null, this._pFileMeta);
        }

        this.setAndValidateUri(uri.parse(arguments[0]));

        if (hasMode) {
            this._iMode = (isString(arguments[1]) ? io.filemode(<string>arguments[1]) : arguments[1]);
        }

        this.update(function (err) {
            if (err) {
                logger.warn("file update err", err);
                fnCallback.call(pFile, err);
                return;
            }

            if (io.isAppend(this._iMode)) {
                this.position = this.size;
            }

            fnCallback.call(pFile, null, this._pFileMeta);
        });
    }

    close(): void {
        this._pUri = null;
        this._iMode = AEIO.IN | AEIO.OUT;
        this._nCursorPosition = 0;
        this._pFileMeta = null;
    }

    protected checkIfNotOpen(method: Function, callback: Function): boolean {
        if (!this.isOpened) {
            var argv: IArguments = arguments;
            this.open((e) => {
                if (e) {
                    if (callback) {
                        callback(e);
                    }
                }

                method.apply(this, argv);
            });

            return true;
        }

        return false;
    }

    clear(fnCallback: Function = TFile.defaultCallback): void {
        if (this.checkIfNotOpen(this.clear, fnCallback)) {
            return;
        }

        var pCommand: AIFileCommand = {
            act: AEFileActions.k_Clear,
            name: this.path,
            mode: this._iMode
        };

        this.execCommand(pCommand, fnCallback);
    }


    read(
        fnCallback: (e: Error, data: any) => void = <any>TFile.defaultCallback,
        fnProgress?: (bytesLoaded: uint, bytesTotal: uint) => void): void {

        if (this.checkIfNotOpen(read, fnCallback)) {
            return;
        }

        var pFile: AIFile = this;
        var eTransferMode: AEFileTransferModes = this._eTransferMode;

        logger.assert(io.canRead(this._iMode), "The file is not readable.");

        var pCommand: AIFileCommand = {
            act: AEFileActions.k_Read,
            name: this.path,
            mode: this._iMode,
            pos: this._nCursorPosition,
            transfer: this._eTransferMode,
            progress: isDefAndNotNull(fnProgress)
        };

        var fnCallbackSystem: Function = (err, pData: any): any => {
            if (err) {
                fnCallback.call(pFile, err);
                return;
            }

            if (pData.progress) {
                fnProgress(pData.loaded, pData.total);
                return false;
            }


            pFile.atEnd();
            fnCallback.call(pFile, null, pData.data);
        };

        this.execCommand(pCommand, fnCallbackSystem);
    }

    write(sData: string, fnCallback?: Function, sContentType?: string): void;
    write(pData: ArrayBuffer, fnCallback?: Function, sContentType?: string): void;
    write(pData: any, fnCallback: Function = TFile.defaultCallback, sContentType?: string): void {
        if (this.checkIfNotOpen(write, fnCallback)) {
            return;
        }

        var pFile: AIFile = this;
        var iMode: int = this._iMode;
        var pCommand: AIFileCommand;
        var fnCallbackSystem: Function = function (err, pMeta) {
            if (err) {
                fnCallback.call(pFile, err);
                return;
            }

            pFile.position += isString(pData) ? pData.length : pData.byteLength;
            (<any>pFile)._pFileMeta = <AIFileMeta>pMeta;

            fnCallback.call(pFile, null, pMeta);
        };

        logger.assert(io.canWrite(iMode), "The file is not writable.");

        sContentType = sContentType || (io.isBinary(iMode) ? "application/octet-stream" : "text/plain");

        pCommand = {
            act: AEFileActions.k_Write,
            name: this.path,
            mode: this._iMode,
            data: pData,
            contentType: sContentType,
            pos: this._nCursorPosition
        };

        if (!isString(pData)) {
            this.execCommand(pCommand, fnCallbackSystem, [pData]);
        }
        else {
            this.execCommand(pCommand, fnCallbackSystem);
        }
    }

    move(sFilename: string, fnCallback: Function = TFile.defaultCallback): void {
        var pFile: AIFile = this;

        this.copy(sFilename, function (err) {
            if (err) {
                fnCallback(err);
                return;
            }

            pFile.remove(fnCallback);
        });
    }

    copy(sFilename: string, fnCallback: Function = TFile.defaultCallback): void {
        var iMode: int = AEIO.IN | AEIO.OUT | AEIO.TRUNC;
        var pFile: AIFile = this;
        var pFileCopy: AIFile;

        if (io.isBinary(this._iMode)) {
            iMode |= AEIO.BIN;
        }

        pFileCopy = new TFile(sFilename, iMode,
            function (err) {
                if (err) {
                    fnCallback(err);
                }

                pFile.read((e: Error, pData: ArrayBuffer): void => {
                    pFile.write(pData, fnCallback);
                });
            });
    }

    rename(sFilename: string, fnCallback: Function = TFile.defaultCallback): void {
        var pName: AIPathinfo = path.parse(sFilename);

        logger.assert(!pName.dirname, 'only filename can be specified.');

        this.move(path.parse(this._pUri.path).dirname + "/" + pName.basename, fnCallback);
    }

    remove(fnCallback: Function = TFile.defaultCallback): void {
        if (this.checkIfNotOpen(remove, fnCallback)) {
            return;
        }

        var pFile: AIFile = this;
        var pCommand: AIFileCommand = {
            act: AEFileActions.k_Remove,
            name: this.path,
            mode: this._iMode
        };
        var fnCallbackSystem: Function = function (err, pData) {
            pFile.close();

            if (isDef(fnCallback)) {
                fnCallback.call(pFile, err, pData);
            }
        }

			this.execCommand(pCommand, fnCallbackSystem);
    }

    //return current position
    atEnd(): int {
        this.position = this.byteLength;
        return this._nCursorPosition;
    }
    //return current position;
    seek(iOffset: int): int {
        logger.assert(isDefAndNotNull(this._pFileMeta), "There is no file handle open.");

        var nSeek: int = this._nCursorPosition + iOffset;
        if (nSeek < 0) {
            nSeek = this.byteLength - (math.abs(nSeek) % this.byteLength);
        }

        logger.assert(nSeek >= 0 && nSeek <= this.byteLength, "Invalid offset parameter");

        this._nCursorPosition = nSeek;

        return this._nCursorPosition;
    }

    isOpened(): boolean {
        return this._pFileMeta !== null;
    }

    isExists(fnCallback: Function): void {
        var pCommand: AIFileCommand = {
            act: AEFileActions.k_Exists,
            name: this.path,
            mode: this._iMode
        };
        this.execCommand(pCommand, fnCallback);
    }

    isLocal(): boolean {
        return this._isLocal;
    }

    getMetaData(fnCallback: Function): void {
        logger.assert(isDefAndNotNull(this._pFileMeta), 'There is no file handle open.');
        fnCallback(null, {
            lastModifiedDate: this._pFileMeta.lastModifiedDate
        });
    }
    private setAndValidateUri(sFilename: AIURI);
    private setAndValidateUri(sFilename: string);
    private setAndValidateUri(sFilename: any) {
        var pUri: AIURI = uri.parse(sFilename);
        var pUriLocal: AIURI;

        if (pUri.scheme === "filesystem:") {
            pUriLocal = uri.parse(pUri.path);
            // console.log(pUriLocal.toString());
            logger.assert(!(pUriLocal.protocol && pUriLocal.host != info.uri.host),
                "It supports only local files within the current domain.");

            var pFolders: string[] = pUriLocal.path.split('/');


            if (pFolders[0] == "" || pFolders[0] == ".") {
                pFolders = pFolders.slice(1);
            }

            logger.assert(pFolders[0] === "temporary",
                "Supported only \"temporary\" filesystems. " + pUri.toString());

            //removing "temporary" from path...
            pFolders = pFolders.slice(1);

            this._pUri = uri.parse(pFolders.join("/"));
            // console.log(sFilename.toString(), "===>", this._pUri.toString());
            this._isLocal = true;
        }
        else {
            this._pUri = pUri;
        }
    }

    protected update(fnCallback: Function = TFile.defaultCallback) {
        var pFile: AIFile = this;
        var pCommand: AIFileCommand = {
            act: AEFileActions.k_Open,
            name: this._pUri.toString(),
            mode: this._iMode
        };
        var fnCallbackSystem: Function = function (err, pMeta) {
            (<any>pFile)._pFileMeta = <AIFileMeta>pMeta;
            // console.log(pMeta);
            fnCallback.call(pFile, err, pFile);
        };

        this.execCommand(pCommand, fnCallbackSystem);
    }

    private execCommand(pCommand: AIFileCommand, fnCallback: Function, pTransferables?: any[]): void {
        TFile.execCommand(this, this.isLocal(), pCommand, fnCallback, pTransferables);
    }

		static defaultCallback: Function = function (err) {
        if (err) {
            throw err;
        }
    }


		private static execCommand(pFile: AIFile, isLocal: boolean, pCommand: AIFileCommand, fnCallback: Function, pTransferables?: any[]): void {

        // var pFile: AIFile = this;
        var pManager: AIThreadManager = isLocal ? TFile.localManager : TFile.remoteManager;
        pManager.waitForThread((pThread: AIThread) => {
            pThread.onmessage = function (e) {
                if (fnCallback.call(pFile, null, e.data) === false) {
                    return;
                }

                pThread.onmessage = null;
                pManager.releaseThread(pThread);
            }

				pThread.onerror = function (e) {
                pThread.onmessage = null;
                fnCallback.call(pFile, e);
                pManager.releaseThread(pThread);
            }



				if (isDef(pTransferables)) {
                // console.log(pCommand, pTransferables);
                pThread.send(pCommand, pTransferables);
            }
            else {
                pThread.send(pCommand);
            }
        });
    }

}


export = TFile;