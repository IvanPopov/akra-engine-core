/// <reference path="../idl/AIFile.ts" />

/**
 * FIle implementation via <Local filesystem>.
 * ONLY FOR LOCAL FILES!!
 */

import config = require("config");
import path = require("path");
import uri = require("uri");
import logger = require("logger");
import io = require("io");
import info = require("info");
import math = require("math");

var pLocalFs: FileSystem = null;
var pLocalFsWaiters: Function[] = [];

function errorHandler(e: FileError): void {
    var sMesg: string = "init filesystem: ";

    switch (e.code) {
        case FileError.QUOTA_EXCEEDED_ERR:
            sMesg += 'QUOTA_EXCEEDED_ERR';
            break;
        case FileError.NOT_FOUND_ERR:
            sMesg += 'NOT_FOUND_ERR';
            break;
        case FileError.SECURITY_ERR:
            sMesg += 'SECURITY_ERR';
            break;
        case FileError.INVALID_MODIFICATION_ERR:
            sMesg += 'INVALID_MODIFICATION_ERR';
            break;
        case FileError.INVALID_STATE_ERR:
            sMesg += 'INVALID_STATE_ERR';
            break;
        default:
            sMesg += 'Unknown Error';
            break;
    }

    logger.error(sMesg);
}

function setupFileSystem(fnCallback: Function): void {
    if (pLocalFs) {
        fnCallback(pLocalFs);
        return;
    }

    pLocalFsWaiters.push(fnCallback);

    if (pLocalFsWaiters.length > 1) {
        return;
    }

    window.storageInfo.requestQuota(window.TEMPORARY, config.io.local.filesystemLimit || 33554432,
        (nGrantedBytes: uint) => {
            window.requestFileSystem(window.TEMPORARY, nGrantedBytes, (pFs: FileSystem) => {
                pLocalFs = pFs;

                if (pLocalFsWaiters.length) {
                    for (var i: int = 0; i < pLocalFsWaiters.length; ++i) {
                        pLocalFsWaiters[i](pFs);
                    }
                }
            }, errorHandler);
        });
}



class LocalFile implements AIFile {
    private _pUri: AIURI;
    private _iMode: int;

    //File
    private _pFile: File;
    //file reader
    private _pFileReader: FileReader;
    //pointer to file entry in filsystem
    private _pFileEntry: FileEntry;
    private _nCursorPosition: uint = 0;




    get path(): string {
        logger.assert(isDefAndNotNull(this._pFile), "There is no file handle open.");
        return this._pUri.toString();
    }

    get name(): string {
        return path.parse(this._pUri.path).basename;
    }

    get mode(): int {
        return this._iMode;
    }

    get meta(): AIFileMeta {
        return null;
    }

    //set mode(sMode: string);
    //set mode(iMode: int);
    set mode(sMode: any) {
        this._iMode = isString(sMode) ? io.filemode(<any>sMode) : sMode;
    }

    set onread(fnCallback: (e: Error, data: any) => void) {
        this.read(fnCallback);
    }

    set onopen(fnCallback: Function) {
        this.open(fnCallback);
    }

    get position(): uint {
        logger.assert(isDefAndNotNull(this._pFile), "There is no file handle open.");
        return this._nCursorPosition;
    }

    set position(iOffset: uint) {
        logger.assert(isDefAndNotNull(this._pFile), "There is no file handle open.");
        this._nCursorPosition = iOffset;
    }

    get byteLength(): uint {
        return this._pFile ? this._pFile.size : 0;
    }


    constructor(sFilename?: string, sMode?: string, fnCallback?: Function);
    constructor(sFilename?: string, iMode?: int, fnCallback?: Function);
    constructor(sFilename?: string, sMode?: any, fnCallback: Function = LocalFile.defaultCallback) {
        if (isDef(sMode)) {
            this._iMode = isString(sMode) ? io.filemode(sMode) : sMode;
        }

        this.setAndValidateUri(uri.parse(sFilename));

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
        fnCallback = fnCallback || LocalFile.defaultCallback;

        if (this.isOpened()) {
            logger.warn("file already opened: " + this.name);
            (<Function>fnCallback)(null, this._pFile);
        }

        this.setAndValidateUri(uri.parse(arguments[0]));

        if (hasMode) {
            this._iMode = (isString(arguments[1]) ? io.filemode(<string>arguments[1]) : arguments[1]);
        }

        var fnFSInited: Function;
        var pFileSystem: FileSystem = null;
        var fnErrorHandler: Function = function (e) {
            if (e.code == FileError.NOT_FOUND_ERR && io.canCreate(this.mode)) {
                LocalFile.createDir(
                    pFileSystem.root,
                    path.parse(this.path).dirname.split('/'),
                    function (e) {
                        if (!isNull(e)) {
                            fnCallback.call(this, e);
                        }
                        else {
                            fnFSInited.call(this, pFileSystem);
                        }
                    });
            }
            else {
                fnCallback.call(this, e);
            }
        }

        fnFSInited = function (pFs: FileSystem) {
            logger.assert(isDefAndNotNull(pFs), "local file system not initialized");

            pFileSystem = pFs;
            pFs.root.getFile(this.path,
                {
                    create: io.canCreate(this._iMode),
                    exclusive: false
                },
                function (fileEntry: FileEntry) {
                    this.setFileEntry(<FileEntry>fileEntry);
                    fileEntry.file((file: File) => {
                        this.setFile(file);

                        if (io.isTrunc(this.mode) && this.byteLength) {
                            this.clear((err) => {
                                if (err) {
                                    fnCallback(err);
                                }
                                else {
                                    fnCallback.call(this, null, file);
                                }
                            });
                            return;
                        }

                        if (io.isAppend(this.mode)) {
                            this.position = this.byteLength;
                        }

                        fnCallback.call(this, null, file);
                    }, <ErrorCallback>fnErrorHandler);

                },
                <ErrorCallback>fnErrorHandler);
        }

        //gete file system
        setupFileSystem((pFileSystem: FileSystem) => {
            fnFSInited(pFileSystem);
        });
    }

    close(): void {
        this._pUri = null;
        this._iMode = AEIO.IN | AEIO.OUT;
        this._nCursorPosition = 0;
        this._pFile = null;
    }

    private checkIfNotOpen(method: Function, callback: Function): boolean {
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


    clear(fnCallback: Function = LocalFile.defaultCallback): void {
        if (this.checkIfNotOpen(this.clear, fnCallback)) {
            return;
        }

        logger.assert(isDefAndNotNull(this._pFile), 'There is no file handle open');

        var pFile: AIFile = this;
        var pFileEntry: FileEntry = this._pFileEntry;

        pFileEntry.createWriter(
            function (pWriter: FileWriter) {
                pWriter.seek(0);

                pWriter.onwriteend = function () {
                    fnCallback.call(pFile, null);
                }

					pWriter.truncate(0);

            },
            function (e: FileError) {
                fnCallback.call(pFile, e);
            });
    }

    read(fnCallback: (e: Error, data: any) => void = <any>LocalFile.defaultCallback): void {
        if (this.checkIfNotOpen(this.read, fnCallback)) {
            return;
        }

        logger.assert(io.canRead(this._iMode), "The file is not readable.");

        var pReader: FileReader = this._pFileReader;
        var pFileObject: File = this._pFile;

        pReader.onloadend = function (e) {
            var pData: any = (<any>(e.target)).result;
            var nPos: uint = this.position;

            if (nPos > 0) {
                if (io.isBinary(this.mode)) {
                    pData = (new Uint8Array((new Uint8Array(pData)).subarray(nPos))).buffer;
                }
                else {
                    pData = pData.substr(nPos);
                }
            }

            this.atEnd();

            fnCallback.call(this, null, pData);
        }

        if (io.isBinary(this.mode)) {
            pReader.readAsArrayBuffer(pFileObject);
        }
        else {
            pReader.readAsText(pFileObject);
        }
    }

    write(sData: string, fnCallback?: Function, sContentType?: string): void;
    write(pData: ArrayBuffer, fnCallback?: Function, sContentType?: string): void;
    write(pData: any, fnCallback: Function = LocalFile.defaultCallback, sContentType?: string): void {
        if (this.checkIfNotOpen(this.write, fnCallback)) {
            return;
        }

        var pFile: AIFile = this;
        var iMode: int = this._iMode;

        logger.assert(io.canWrite(iMode), "The file is not writable.");

        sContentType = sContentType || (io.isBinary(iMode) ? "application/octet-stream" : "text/plain");

        var pFile: AIFile = this;
        var pFileEntry: FileEntry = this._pFileEntry;

        pFileEntry.createWriter(function (pWriter: FileWriter) {
            pWriter.seek(pFile.position);

            pWriter.onerror = function (e: FileError) {
                fnCallback.call(pFileEntry, e);
            }


				pWriter.onwriteend = function () {
                if (io.isBinary(iMode)) {
                    pFile.seek(pData.byteLength);
                }
                else {
                    pFile.seek(pData.length);
                }

                fnCallback.call(pFile, null);
            }

            pWriter.write(<Blob>(new (<any>Blob)(pData, { type: sContentType })));

        },
            function (e: FileError) {
                fnCallback.call(pFile, e);
            });
    }


    move(sFilename: string, fnCallback: Function = LocalFile.defaultCallback): void {
        var pFile: AIFile = this;

        this.copy(sFilename, function (err) {
            if (err) {
                fnCallback(err);
                return;
            }

            pFile.remove(fnCallback);
        });
    }

    copy(sFilename: string, fnCallback: Function = LocalFile.defaultCallback): void {
        var iMode: int = AEIO.IN | AEIO.OUT | AEIO.TRUNC;
        var pFile: AIFile = this;
        var pFileCopy: AIFile;

        if (io.isBinary(this._iMode)) {
            iMode |= AEIO.BIN;
        }

        pFileCopy = new LocalFile(sFilename, iMode, (e: Error): void => {
            if (e) fnCallback(e);
            pFile.read((e: Error, pData: ArrayBuffer): void => {
                pFile.write(pData, fnCallback);
            });
        });
    }

    rename(sFilename: string, fnCallback: Function = LocalFile.defaultCallback): void {
        var pName: AIPathinfo = path.parse(sFilename);

        logger.assert(!pName.dirname, 'only filename can be specified.');

        this.move(path.parse(this._pUri.path).dirname + "/" + pName.basename, fnCallback);
    }

    remove(fnCallback: Function = LocalFile.defaultCallback): void {
        if (this.checkIfNotOpen(this.remove, fnCallback)) {
            return;
        }

        var pFile: AIFile = this;
        this._pFileEntry.remove(
            <VoidCallback>function () {
                pFile.close();
                fnCallback.call(pFile, null);
            }, <ErrorCallback>fnCallback);
    }

    //return current position
    atEnd(): int {
        this.position = this.byteLength;
        return this._nCursorPosition;
    }
    //return current position;
    seek(iOffset: int): int {
        logger.assert(isDefAndNotNull(this._pFile), "There is no file handle open.");

        var nSeek: int = this._nCursorPosition + iOffset;
        if (nSeek < 0) {
            nSeek = this.byteLength - (math.abs(nSeek) % this.byteLength);
        }

        logger.assert(nSeek >= 0 && nSeek <= this.byteLength, "Invalid offset parameter");

        this._nCursorPosition = nSeek;

        return this._nCursorPosition;
    }

    isOpened(): boolean {
        return this._pFile !== null;
    }

    isExists(fnCallback: Function): void {
        this.open(function (e: FileError) {
            fnCallback(isNull(e) ? true : false);
        });
    }

    isLocal(): boolean {
        return true;
    }

    getMetaData(fnCallback: Function): void {
        logger.assert(isDefAndNotNull(this._pFile), 'There is no file handle open.');
        fnCallback(null, {
            lastModifiedDate: this._pFile.lastModifiedDate
        });
    }

    setFileEntry(pFileEntry: FileEntry): boolean {
        if (!isNull(this._pFileEntry)) {
            return false;
        }

        this._pFileEntry = pFileEntry;
        return true;
    }

    setFile(pFile: File): boolean {
        if (!isNull(this._pFile)) {
            return false;
        }

        this._pFile = pFile;

        return true;
    }

    private setAndValidateUri(sFilename: AIURI);
    private setAndValidateUri(sFilename: string);
    private setAndValidateUri(sFilename: any) {
        var pUri: AIURI = uri.parse(sFilename);
        var pUriLocal: AIURI;

        if (pUri.protocol === "filesystem") {
            pUriLocal = uri.parse(pUri.path);

            logger.assert(!(pUriLocal.protocol && pUriLocal.host != info.uri.host),
                "Поддерживаются только локальные файлы в пределах текущего домена.");

            var pFolders: string[] = pUriLocal.path.split('/');

            if (pFolders[0] == "" || pFolders[0] == ".") {
                pFolders = pFolders.slice(1);
            }

            logger.assert(pUri.host === "temporary",
                "Поддерживаются только файловые системы типа \"temporary\".");

            this._pUri = uri.parse(pFolders.join("/"));
        }
        else {
            logger.error("used non local uri");
        }
    }

    static errorHandler(e: FileError): void {
        var sMesg: string = "";

        switch (e.code) {
            case FileError.QUOTA_EXCEEDED_ERR:
                sMesg += 'QUOTA_EXCEEDED_ERR';
                break;
            case FileError.NOT_FOUND_ERR:
                sMesg += 'NOT_FOUND_ERR';
                break;
            case FileError.SECURITY_ERR:
                sMesg += 'SECURITY_ERR';
                break;
            case FileError.INVALID_MODIFICATION_ERR:
                sMesg += 'INVALID_MODIFICATION_ERR';
                break;
            case FileError.INVALID_STATE_ERR:
                sMesg += 'INVALID_STATE_ERR';
                break;
            default:
                sMesg += 'Unknown Error';
                break;
        }

        logger.error(sMesg);
    }

    static createDir(pRootDirEntry: DirectoryEntry, pFolders: string[], fnCallback) {
        if (pFolders[0] == "." || pFolders[0] == "") {
            pFolders = pFolders.slice(1);
        }

        pRootDirEntry.getDirectory(
            pFolders[0],
            { create: true },
            function (dirEntry: Entry) {
                if (pFolders.length) {
                    LocalFile.createDir(<DirectoryEntry>dirEntry, pFolders.slice(1), fnCallback);
                }
                else {
                    fnCallback(null);
                }
            }, fnCallback);
    }

		static defaultCallback: Function = function (err) {
        if (err) {
            LocalFile.errorHandler(err);
        }
    }

	}


export = LocalFile;