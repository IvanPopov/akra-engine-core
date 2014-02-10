/// <reference path="../idl/IFile.ts" />
/// <reference path="../idl/IThread.ts" />
/// <reference path="../idl/EFileTransferModes.ts" />
var akra;
(function (akra) {
    /// <reference path="../config/config.ts" />
    /// <reference path="../threading/threading.ts" />
    /// <reference path="../path/path.ts" />
    /// <reference path="../uri/uri.ts" />
    /// <reference path="../logger.ts" />
    /// <reference path="io.ts" />
    /// <reference path="../info/info.ts" />
    /// <reference path="../math/math.ts" />
    (function (io) {
        var AEFileActions;
        (function (AEFileActions) {
            AEFileActions[AEFileActions["k_Open"] = 1] = "k_Open";
            AEFileActions[AEFileActions["k_Read"] = 2] = "k_Read";
            AEFileActions[AEFileActions["k_Write"] = 3] = "k_Write";
            AEFileActions[AEFileActions["k_Clear"] = 4] = "k_Clear";
            AEFileActions[AEFileActions["k_Exists"] = 5] = "k_Exists";
            AEFileActions[AEFileActions["k_Remove"] = 6] = "k_Remove";
        })(AEFileActions || (AEFileActions = {}));

        var TFile = (function () {
            function TFile(sFilename, sMode, cb) {
                if (typeof cb === "undefined") { cb = TFile.defaultCallback; }
                this.guid = akra.guid();
                this._pUri = null;
                this._nCursorPosition = 0;
                this._bOpened = false;
                this._eTransferMode = 0 /* k_Normal */;
                this._pFileMeta = null;
                this._isLocal = false;
                this.setupSignals();

                if (akra.isDef(sMode)) {
                    this._iMode = akra.isString(sMode) ? akra.io.filemode(sMode) : sMode;
                }

                this.setAndValidateUri(akra.uri.parse(sFilename));

                if (akra.info.api.getTransferableObjects()) {
                    this._eTransferMode = 1 /* k_Fast */;
                }

                //OPERA MOVED TO WEBKIT, and this TRAP not more be needed!
                // else if (info.browser.name == "Opera") {
                // 	this._eTransferMode = EFileTransferModes.k_Slow;
                // }
                if (arguments.length > 2) {
                    this.open(sFilename, sMode, cb);
                }
            }
            TFile.prototype.setupSignals = function () {
                this.opened = this.opened || new akra.Signal(this);
                this.closed = this.closed || new akra.Signal(this);
                this.renamed = this.renamed || new akra.Signal(this);
            };

            TFile.prototype.getPath = function () {
                return this._pUri.toString();
            };

            TFile.prototype.getName = function () {
                return akra.path.parse(this._pUri.getPath()).getBaseName();
            };

            TFile.prototype.getMeta = function () {
                akra.logger.assert(akra.isDefAndNotNull(this._pFileMeta), "There is no file handle open.");
                return this._pFileMeta;
            };

            TFile.prototype.getByteLength = function () {
                return this._pFileMeta ? this._pFileMeta.size : 0;
            };

            TFile.prototype.getMode = function () {
                return this._iMode;
            };

            TFile.prototype.setMode = function (mode) {
                this._iMode = akra.isString(mode) ? akra.io.filemode(mode) : mode;
            };

            TFile.prototype.getPosition = function () {
                akra.logger.assert(akra.isDefAndNotNull(this._pFileMeta), "There is no file handle open.");
                return this._nCursorPosition;
            };

            TFile.prototype.setPosition = function (iOffset) {
                akra.logger.assert(akra.isDefAndNotNull(this._pFileMeta), "There is no file handle open.");
                this._nCursorPosition = iOffset;
            };

            TFile.prototype.open = function (sFilename, iMode, cb) {
                var pFile = this;
                var hasMode = !akra.isFunction(iMode);

                if (arguments.length < 3) {
                    if (akra.isString(arguments[0])) {
                        this.setAndValidateUri(akra.uri.parse(sFilename));
                        cb = arguments[1];
                    } else if (akra.isInt(arguments[0])) {
                        this._iMode = arguments[0];
                        cb = arguments[1];
                    } else {
                        cb = arguments[0];
                    }

                    akra.logger.assert(akra.isDefAndNotNull(this._pUri), "No filename provided.");

                    this.open(this._pUri.toString(), this._iMode, cb);

                    return;
                }

                cb = arguments[hasMode ? 2 : 1];
                cb = cb || TFile.defaultCallback;

                if (this.isOpened()) {
                    akra.logger.warn("file already opened: " + this.getName());
                    cb.call(pFile, null, this._pFileMeta);
                }

                this.setAndValidateUri(akra.uri.parse(arguments[0]));

                if (hasMode) {
                    this._iMode = (akra.isString(arguments[1]) ? akra.io.filemode(arguments[1]) : arguments[1]);
                }

                this.update(function (err) {
                    if (err) {
                        akra.logger.warn("file update err", err);
                        cb.call(pFile, err);
                        return;
                    }

                    if (akra.io.isAppend(this._iMode)) {
                        this.setPosition(this.size);
                    }

                    cb.call(pFile, null, this._pFileMeta);
                });
            };

            TFile.prototype.close = function () {
                this._pUri = null;
                this._iMode = 1 /* IN */ | 2 /* OUT */;
                this._nCursorPosition = 0;
                this._pFileMeta = null;
            };

            TFile.prototype.checkIfNotOpen = function (method, callback, pArgs) {
                if (typeof pArgs === "undefined") { pArgs = null; }
                var _this = this;
                if (!this.isOpened()) {
                    this.open(function (e) {
                        if (e) {
                            if (callback) {
                                callback(e);
                            }
                        }

                        if (!akra.isNull(pArgs)) {
                            method.apply(_this, pArgs);
                        } else {
                            method.call(_this, callback);
                        }
                    });

                    return true;
                }

                return false;
            };

            TFile.prototype.clear = function (cb) {
                if (typeof cb === "undefined") { cb = TFile.defaultCallback; }
                if (this.checkIfNotOpen(this.clear, cb)) {
                    return;
                }

                var pCommand = {
                    act: 4 /* k_Clear */,
                    name: this.getPath(),
                    mode: this._iMode
                };

                this.execCommand(pCommand, cb);
            };

            TFile.prototype.read = function (cb, fnProgress) {
                if (typeof cb === "undefined") { cb = TFile.defaultCallback; }
                if (this.checkIfNotOpen(this.read, cb, arguments)) {
                    return;
                }

                var pFile = this;
                var eTransferMode = this._eTransferMode;

                akra.logger.assert(akra.io.canRead(this._iMode), "The file is not readable.");

                var pCommand = {
                    act: 2 /* k_Read */,
                    name: this.getPath(),
                    mode: this._iMode,
                    pos: this._nCursorPosition,
                    transfer: this._eTransferMode,
                    progress: akra.isDefAndNotNull(fnProgress)
                };

                var fnCallbackSystem = function (err, pData) {
                    if (err) {
                        cb.call(pFile, err);
                        return;
                    }

                    if (pData.progress) {
                        fnProgress(pData.loaded, pData.total);
                        return false;
                    }

                    pFile.atEnd();
                    cb.call(pFile, null, pData.data);
                };

                this.execCommand(pCommand, fnCallbackSystem);
            };

            TFile.prototype.write = function (pData, cb, sContentType) {
                if (typeof cb === "undefined") { cb = TFile.defaultCallback; }
                if (this.checkIfNotOpen(this.write, cb, arguments)) {
                    return;
                }

                var pFile = this;
                var iMode = this._iMode;
                var pCommand;
                var fnCallbackSystem = function (err, pMeta) {
                    if (err) {
                        cb.call(pFile, err);
                        return;
                    }

                    pFile.setPosition(pFile.getPosition() + (akra.isString(pData) ? pData.length : pData.byteLength));
                    pFile._pFileMeta = pMeta;

                    cb.call(pFile, null, pMeta);
                };

                akra.logger.assert(akra.io.canWrite(iMode), "The file is not writable.");

                sContentType = sContentType || (akra.io.isBinary(iMode) ? "application/octet-stream" : "text/plain");

                pCommand = {
                    act: 3 /* k_Write */,
                    name: this.getPath(),
                    mode: this._iMode,
                    data: pData,
                    contentType: sContentType,
                    pos: this._nCursorPosition
                };

                if (!akra.isString(pData)) {
                    this.execCommand(pCommand, fnCallbackSystem, [pData]);
                } else {
                    this.execCommand(pCommand, fnCallbackSystem);
                }
            };

            TFile.prototype.move = function (sFilename, cb) {
                if (typeof cb === "undefined") { cb = TFile.defaultCallback; }
                var pFile = this;
                var sPath = this.getPath();

                this.copy(sFilename, function (e, pCopy) {
                    if (e) {
                        return cb.call(pFile, e);
                    }

                    pFile.remove(function (e) {
                        pFile.close();
                        pFile.open(sFilename);

                        cb.call(pFile, e, pFile.getPath(), sPath);
                    });
                });
            };

            //copy file
            TFile.prototype.copy = function (sFilename, cb) {
                if (typeof cb === "undefined") { cb = TFile.defaultCallback; }
                var iMode = 1 /* IN */ | 2 /* OUT */ | 16 /* TRUNC */;
                var pFile = this;
                var pCopy;

                if (akra.io.isBinary(this._iMode)) {
                    iMode |= 32 /* BIN */;
                }

                pCopy = akra.io.fopen(sFilename, iMode);

                pCopy.open(function (err) {
                    if (err) {
                        return cb.call(pFile, err, null);
                    }

                    pFile.read(function (e, pData) {
                        pCopy.write(pData, function (e, pMeta) {
                            if (!e) {
                                pCopy.close();
                            }

                            cb.call(pFile, e, pCopy, pMeta);
                        });
                    });
                });
            };

            TFile.prototype.rename = function (sFilename, cb) {
                if (typeof cb === "undefined") { cb = TFile.defaultCallback; }
                var _this = this;
                var pName = akra.path.parse(sFilename);
                var sNamePrev = this.getName();

                akra.logger.assert(!pName.getDirName(), "only filename can be specified.");

                this.move(akra.path.parse(this._pUri.getPath()).getDirName() + "/" + pName.getBaseName(), function (e) {
                    _this.renamed.emit(_this.getName(), sNamePrev);
                    cb.call(_this, _this.getName(), sNamePrev);
                });
            };

            TFile.prototype.remove = function (cb) {
                if (typeof cb === "undefined") { cb = TFile.defaultCallback; }
                if (this.checkIfNotOpen(this.remove, cb)) {
                    return;
                }

                var pFile = this;

                var pCommand = {
                    act: 6 /* k_Remove */,
                    name: this.getPath(),
                    mode: this._iMode
                };

                this.execCommand(pCommand, function (e) {
                    if (!e) {
                        pFile.close();
                    }

                    cb.call(pFile, e);
                });
            };

            //return current position
            TFile.prototype.atEnd = function () {
                this.setPosition(this.getByteLength());
                return this._nCursorPosition;
            };

            //return current position;
            TFile.prototype.seek = function (iOffset) {
                akra.logger.assert(akra.isDefAndNotNull(this._pFileMeta), "There is no file handle open.");

                var nSeek = this._nCursorPosition + iOffset;
                if (nSeek < 0) {
                    nSeek = this.getByteLength() - (akra.math.abs(nSeek) % this.getByteLength());
                }

                akra.logger.assert(nSeek >= 0 && nSeek <= this.getByteLength(), "Invalid offset parameter");

                this._nCursorPosition = nSeek;

                return this._nCursorPosition;
            };

            TFile.prototype.isOpened = function () {
                return this._pFileMeta !== null;
            };

            TFile.prototype.isExists = function (cb) {
                var pCommand = {
                    act: 5 /* k_Exists */,
                    name: this.getPath(),
                    mode: this._iMode
                };

                this.execCommand(pCommand, cb);
            };

            TFile.prototype.isLocal = function () {
                return this._isLocal;
            };

            TFile.prototype.getMetaData = function (cb) {
                akra.logger.assert(akra.isDefAndNotNull(this._pFileMeta), 'There is no file handle open.');
                cb(null, {
                    lastModifiedDate: this._pFileMeta.lastModifiedDate
                });
            };

            TFile.prototype.setAndValidateUri = function (sFilename) {
                var pUri = akra.uri.parse(sFilename);
                var pUriLocal;

                if (pUri.getScheme() === "filesystem:") {
                    pUriLocal = akra.uri.parse(pUri.getPath());

                    // console.log(pUriLocal.toString());
                    akra.logger.assert(!(pUriLocal.getProtocol() && pUriLocal.getHost() != akra.info.uri.getHost()), "It supports only local files within the current domain.");

                    var pFolders = pUriLocal.getPath().split('/');

                    if (pFolders[0] == "" || pFolders[0] == ".") {
                        pFolders = pFolders.slice(1);
                    }

                    akra.logger.assert(pFolders[0] === "temporary", "Supported only \"temporary\" filesystems. " + pUri.toString());

                    //removing "temporary" from path...
                    pFolders = pFolders.slice(1);

                    this._pUri = akra.uri.parse(pFolders.join("/"));

                    // console.log(sFilename.toString(), "===>", this._pUri.toString());
                    this._isLocal = true;
                } else {
                    this._pUri = pUri;
                }
            };

            TFile.prototype.update = function (cb) {
                if (typeof cb === "undefined") { cb = TFile.defaultCallback; }
                var pFile = this;
                var pCommand = {
                    act: 1 /* k_Open */,
                    name: this._pUri.toString(),
                    mode: this._iMode
                };

                var fnCallbackSystem = function (err, pMeta) {
                    pFile._pFileMeta = pMeta;
                    cb.call(pFile, err, pFile);
                };

                this.execCommand(pCommand, fnCallbackSystem);
            };

            TFile.prototype.execCommand = function (pCommand, cb, pTransferables) {
                TFile.execCommand(this, this.isLocal(), pCommand, cb, pTransferables);
            };

            TFile.execCommand = function (pFile, isLocal, pCommand, cb, pTransferables) {
                // var pFile: IFile = this;
                var pManager = isLocal ? TFile.localManager : TFile.remoteManager;
                pManager.waitForThread(function (pThread) {
                    pThread.onmessage = function (e) {
                        if (cb.call(pFile, null, e.data) === false) {
                            return;
                        }

                        pThread.onmessage = null;
                        pManager.releaseThread(pThread);
                    };

                    pThread.onerror = function (e) {
                        pThread.onmessage = null;
                        cb.call(pFile, e);
                        pManager.releaseThread(pThread);
                    };

                    if (akra.isDef(pTransferables)) {
                        // console.log(pCommand, pTransferables);
                        pThread.send(pCommand, pTransferables);
                    } else {
                        pThread.send(pCommand);
                    }
                });
            };
            TFile.localManager = new akra.threading.Manager(akra.config.io.tfile.local);
            TFile.remoteManager = new akra.threading.Manager(akra.config.io.tfile.remote);

            TFile.defaultCallback = function (err) {
                if (err) {
                    throw err;
                }
            };
            return TFile;
        })();
        io.TFile = TFile;
    })(akra.io || (akra.io = {}));
    var io = akra.io;
})(akra || (akra = {}));
//# sourceMappingURL=TFile.js.map
