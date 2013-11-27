var akra;
(function (akra) {
    /// <reference path="../idl/IFile.ts" />
    /// <reference path="../idl/IThread.ts" />
    /// <reference path="../idl/EFileTransferModes.ts" />
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
            function TFile(sFilename, sMode, fnCallback) {
                if (typeof fnCallback === "undefined") { fnCallback = TFile.defaultCallback; }
                this._pUri = null;
                this._nCursorPosition = 0;
                this._bOpened = false;
                this._eTransferMode = akra.EFileTransferModes.k_Normal;
                this._pFileMeta = null;
                this._isLocal = false;
                if (akra.isDef(sMode)) {
                    this._iMode = akra.isString(sMode) ? akra.io.filemode(sMode) : sMode;
                }

                this.setAndValidateUri(akra.uri.parse(sFilename));

                if (akra.info.api.transferableObjects) {
                    this._eTransferMode = akra.EFileTransferModes.k_Fast;
                }

                if (arguments.length > 2) {
                    this.open(sFilename, sMode, fnCallback);
                }
            }
            Object.defineProperty(TFile.prototype, "path", {
                get: function () {
                    return this._pUri.toString();
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(TFile.prototype, "name", {
                get: function () {
                    return akra.path.parse(this._pUri.path).basename;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(TFile.prototype, "mode", {
                get: function () {
                    return this._iMode;
                },
                set: //set mode(sMode: string);
                //set mode(iMode: int);
                function (mode) {
                    this._iMode = akra.isString(mode) ? akra.io.filemode(mode) : mode;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(TFile.prototype, "meta", {
                get: function () {
                    akra.logger.assert(akra.isDefAndNotNull(this._pFileMeta), "There is no file handle open.");
                    return this._pFileMeta;
                },
                enumerable: true,
                configurable: true
            });


            Object.defineProperty(TFile.prototype, "onread", {
                set: function (fnCallback) {
                    this.read(fnCallback);
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(TFile.prototype, "onopen", {
                set: function (fnCallback) {
                    this.open(fnCallback);
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(TFile.prototype, "position", {
                get: function () {
                    akra.logger.assert(akra.isDefAndNotNull(this._pFileMeta), "There is no file handle open.");
                    return this._nCursorPosition;
                },
                set: function (iOffset) {
                    akra.logger.assert(akra.isDefAndNotNull(this._pFileMeta), "There is no file handle open.");
                    this._nCursorPosition = iOffset;
                },
                enumerable: true,
                configurable: true
            });


            Object.defineProperty(TFile.prototype, "byteLength", {
                get: function () {
                    return this._pFileMeta ? this._pFileMeta.size : 0;
                },
                enumerable: true,
                configurable: true
            });

            TFile.prototype.open = function (sFilename, iMode, fnCallback) {
                var pFile = this;
                var hasMode = !akra.isFunction(iMode);

                if (arguments.length < 3) {
                    if (akra.isString(arguments[0])) {
                        this.setAndValidateUri(akra.uri.parse(sFilename));
                        fnCallback = arguments[1];
                    } else if (akra.isInt(arguments[0])) {
                        this._iMode = arguments[0];
                        fnCallback = arguments[1];
                    } else {
                        fnCallback = arguments[0];
                    }

                    akra.logger.assert(akra.isDefAndNotNull(this._pUri), "No filename provided.");

                    this.open(this._pUri.toString(), this._iMode, fnCallback);

                    return;
                }

                fnCallback = arguments[hasMode ? 2 : 1];
                fnCallback = fnCallback || TFile.defaultCallback;

                if (this.isOpened()) {
                    akra.logger.warn("file already opened: " + this.name);
                    (fnCallback).call(pFile, null, this._pFileMeta);
                }

                this.setAndValidateUri(akra.uri.parse(arguments[0]));

                if (hasMode) {
                    this._iMode = (akra.isString(arguments[1]) ? akra.io.filemode(arguments[1]) : arguments[1]);
                }

                this.update(function (err) {
                    if (err) {
                        akra.logger.warn("file update err", err);
                        fnCallback.call(pFile, err);
                        return;
                    }

                    if (akra.io.isAppend(this._iMode)) {
                        this.position = this.size;
                    }

                    fnCallback.call(pFile, null, this._pFileMeta);
                });
            };

            TFile.prototype.close = function () {
                this._pUri = null;
                this._iMode = akra.EIO.IN | akra.EIO.OUT;
                this._nCursorPosition = 0;
                this._pFileMeta = null;
            };

            TFile.prototype.checkIfNotOpen = function (method, callback) {
                var _this = this;
                if (!this.isOpened) {
                    var argv = arguments;
                    this.open(function (e) {
                        if (e) {
                            if (callback) {
                                callback(e);
                            }
                        }

                        method.apply(_this, argv);
                    });

                    return true;
                }

                return false;
            };

            TFile.prototype.clear = function (fnCallback) {
                if (typeof fnCallback === "undefined") { fnCallback = TFile.defaultCallback; }
                if (this.checkIfNotOpen(this.clear, fnCallback)) {
                    return;
                }

                var pCommand = {
                    act: AEFileActions.k_Clear,
                    name: this.path,
                    mode: this._iMode
                };

                this.execCommand(pCommand, fnCallback);
            };

            TFile.prototype.read = function (fnCallback, fnProgress) {
                if (typeof fnCallback === "undefined") { fnCallback = TFile.defaultCallback; }
                if (this.checkIfNotOpen(this.read, fnCallback)) {
                    return;
                }

                var pFile = this;
                var eTransferMode = this._eTransferMode;

                akra.logger.assert(akra.io.canRead(this._iMode), "The file is not readable.");

                var pCommand = {
                    act: AEFileActions.k_Read,
                    name: this.path,
                    mode: this._iMode,
                    pos: this._nCursorPosition,
                    transfer: this._eTransferMode,
                    progress: akra.isDefAndNotNull(fnProgress)
                };

                var fnCallbackSystem = function (err, pData) {
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
            };

            TFile.prototype.write = function (pData, fnCallback, sContentType) {
                if (typeof fnCallback === "undefined") { fnCallback = TFile.defaultCallback; }
                if (this.checkIfNotOpen(this.write, fnCallback)) {
                    return;
                }

                var pFile = this;
                var iMode = this._iMode;
                var pCommand;
                var fnCallbackSystem = function (err, pMeta) {
                    if (err) {
                        fnCallback.call(pFile, err);
                        return;
                    }

                    pFile.position += akra.isString(pData) ? pData.length : pData.byteLength;
                    (pFile)._pFileMeta = pMeta;

                    fnCallback.call(pFile, null, pMeta);
                };

                akra.logger.assert(akra.io.canWrite(iMode), "The file is not writable.");

                sContentType = sContentType || (akra.io.isBinary(iMode) ? "application/octet-stream" : "text/plain");

                pCommand = {
                    act: AEFileActions.k_Write,
                    name: this.path,
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

            TFile.prototype.move = function (sFilename, fnCallback) {
                if (typeof fnCallback === "undefined") { fnCallback = TFile.defaultCallback; }
                var pFile = this;

                this.copy(sFilename, function (err) {
                    if (err) {
                        fnCallback(err);
                        return;
                    }

                    pFile.remove(fnCallback);
                });
            };

            TFile.prototype.copy = function (sFilename, fnCallback) {
                if (typeof fnCallback === "undefined") { fnCallback = TFile.defaultCallback; }
                var iMode = akra.EIO.IN | akra.EIO.OUT | akra.EIO.TRUNC;
                var pFile = this;
                var pFileCopy;

                if (akra.io.isBinary(this._iMode)) {
                    iMode |= akra.EIO.BIN;
                }

                pFileCopy = new TFile(sFilename, iMode, function (err) {
                    if (err) {
                        fnCallback(err);
                    }

                    pFile.read(function (e, pData) {
                        pFile.write(pData, fnCallback);
                    });
                });
            };

            TFile.prototype.rename = function (sFilename, fnCallback) {
                if (typeof fnCallback === "undefined") { fnCallback = TFile.defaultCallback; }
                var pName = akra.path.parse(sFilename);

                akra.logger.assert(!pName.dirname, 'only filename can be specified.');

                this.move(akra.path.parse(this._pUri.path).dirname + "/" + pName.basename, fnCallback);
            };

            TFile.prototype.remove = function (fnCallback) {
                if (typeof fnCallback === "undefined") { fnCallback = TFile.defaultCallback; }
                if (this.checkIfNotOpen(this.remove, fnCallback)) {
                    return;
                }

                var pFile = this;
                var pCommand = {
                    act: AEFileActions.k_Remove,
                    name: this.path,
                    mode: this._iMode
                };
                var fnCallbackSystem = function (err, pData) {
                    pFile.close();

                    if (akra.isDef(fnCallback)) {
                        fnCallback.call(pFile, err, pData);
                    }
                };

                this.execCommand(pCommand, fnCallbackSystem);
            };

            //return current position
            TFile.prototype.atEnd = function () {
                this.position = this.byteLength;
                return this._nCursorPosition;
            };

            //return current position;
            TFile.prototype.seek = function (iOffset) {
                akra.logger.assert(akra.isDefAndNotNull(this._pFileMeta), "There is no file handle open.");

                var nSeek = this._nCursorPosition + iOffset;
                if (nSeek < 0) {
                    nSeek = this.byteLength - (akra.math.abs(nSeek) % this.byteLength);
                }

                akra.logger.assert(nSeek >= 0 && nSeek <= this.byteLength, "Invalid offset parameter");

                this._nCursorPosition = nSeek;

                return this._nCursorPosition;
            };

            TFile.prototype.isOpened = function () {
                return this._pFileMeta !== null;
            };

            TFile.prototype.isExists = function (fnCallback) {
                var pCommand = {
                    act: AEFileActions.k_Exists,
                    name: this.path,
                    mode: this._iMode
                };
                this.execCommand(pCommand, fnCallback);
            };

            TFile.prototype.isLocal = function () {
                return this._isLocal;
            };

            TFile.prototype.getMetaData = function (fnCallback) {
                akra.logger.assert(akra.isDefAndNotNull(this._pFileMeta), 'There is no file handle open.');
                fnCallback(null, {
                    lastModifiedDate: this._pFileMeta.lastModifiedDate
                });
            };

            TFile.prototype.setAndValidateUri = function (sFilename) {
                var pUri = akra.uri.parse(sFilename);
                var pUriLocal;

                if (pUri.scheme === "filesystem:") {
                    pUriLocal = akra.uri.parse(pUri.path);

                    // console.log(pUriLocal.toString());
                    akra.logger.assert(!(pUriLocal.protocol && pUriLocal.host != akra.info.uri.host), "It supports only local files within the current domain.");

                    var pFolders = pUriLocal.path.split('/');

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

            TFile.prototype.update = function (fnCallback) {
                if (typeof fnCallback === "undefined") { fnCallback = TFile.defaultCallback; }
                var pFile = this;
                var pCommand = {
                    act: AEFileActions.k_Open,
                    name: this._pUri.toString(),
                    mode: this._iMode
                };
                var fnCallbackSystem = function (err, pMeta) {
                    (pFile)._pFileMeta = pMeta;

                    // console.log(pMeta);
                    fnCallback.call(pFile, err, pFile);
                };

                this.execCommand(pCommand, fnCallbackSystem);
            };

            TFile.prototype.execCommand = function (pCommand, fnCallback, pTransferables) {
                TFile.execCommand(this, this.isLocal(), pCommand, fnCallback, pTransferables);
            };

            TFile.execCommand = function (pFile, isLocal, pCommand, fnCallback, pTransferables) {
                // var pFile: IFile = this;
                var pManager = isLocal ? TFile.localManager : TFile.remoteManager;
                pManager.waitForThread(function (pThread) {
                    pThread.onmessage = function (e) {
                        if (fnCallback.call(pFile, null, e.data) === false) {
                            return;
                        }

                        pThread.onmessage = null;
                        pManager.releaseThread(pThread);
                    };

                    pThread.onerror = function (e) {
                        pThread.onmessage = null;
                        fnCallback.call(pFile, e);
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
