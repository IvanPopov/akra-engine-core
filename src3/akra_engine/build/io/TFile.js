/// <reference path="../idl/AIFile.ts" />
/// <reference path="../idl/AIThread.ts" />
/// <reference path="../idl/AEFileTransferModes.ts" />
define(["require", "exports", "config", "threading", "path", "uri", "logger", "io", "info", "math"], function(require, exports, __config__, __threading__, __path__, __uri__, __logger__, __io__, __info__, __math__) {
    var config = __config__;
    var threading = __threading__;
    var path = __path__;
    var uri = __uri__;
    var logger = __logger__;
    var io = __io__;
    var info = __info__;
    var math = __math__;

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
            this._eTransferMode = 0 /* k_Normal */;
            this._pFileMeta = null;
            this._isLocal = false;
            if (isDef(sMode)) {
                this._iMode = isString(sMode) ? io.filemode(sMode) : sMode;
            }

            this.setAndValidateUri(uri.parse(sFilename));

            if (info.api.transferableObjects) {
                this._eTransferMode = 1 /* k_Fast */;
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
                return path.parse(this._pUri.path).basename;
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
                this._iMode = isString(mode) ? io.filemode(mode) : mode;
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(TFile.prototype, "meta", {
            get: function () {
                logger.assert(isDefAndNotNull(this._pFileMeta), "There is no file handle open.");
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
                logger.assert(isDefAndNotNull(this._pFileMeta), "There is no file handle open.");
                return this._nCursorPosition;
            },
            set: function (iOffset) {
                logger.assert(isDefAndNotNull(this._pFileMeta), "There is no file handle open.");
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
            var hasMode = !isFunction(iMode);

            if (arguments.length < 3) {
                if (isString(arguments[0])) {
                    this.setAndValidateUri(uri.parse(sFilename));
                    fnCallback = arguments[1];
                } else if (isInt(arguments[0])) {
                    this._iMode = arguments[0];
                    fnCallback = arguments[1];
                } else {
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
                (fnCallback).call(pFile, null, this._pFileMeta);
            }

            this.setAndValidateUri(uri.parse(arguments[0]));

            if (hasMode) {
                this._iMode = (isString(arguments[1]) ? io.filemode(arguments[1]) : arguments[1]);
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
        };

        TFile.prototype.close = function () {
            this._pUri = null;
            this._iMode = 1 /* IN */ | 2 /* OUT */;
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
                act: 4 /* k_Clear */,
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

            logger.assert(io.canRead(this._iMode), "The file is not readable.");

            var pCommand = {
                act: 2 /* k_Read */,
                name: this.path,
                mode: this._iMode,
                pos: this._nCursorPosition,
                transfer: this._eTransferMode,
                progress: isDefAndNotNull(fnProgress)
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

                pFile.position += isString(pData) ? pData.length : pData.byteLength;
                (pFile)._pFileMeta = pMeta;

                fnCallback.call(pFile, null, pMeta);
            };

            logger.assert(io.canWrite(iMode), "The file is not writable.");

            sContentType = sContentType || (io.isBinary(iMode) ? "application/octet-stream" : "text/plain");

            pCommand = {
                act: 3 /* k_Write */,
                name: this.path,
                mode: this._iMode,
                data: pData,
                contentType: sContentType,
                pos: this._nCursorPosition
            };

            if (!isString(pData)) {
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
            var iMode = 1 /* IN */ | 2 /* OUT */ | 16 /* TRUNC */;
            var pFile = this;
            var pFileCopy;

            if (io.isBinary(this._iMode)) {
                iMode |= 32 /* BIN */;
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
            var pName = path.parse(sFilename);

            logger.assert(!pName.dirname, 'only filename can be specified.');

            this.move(path.parse(this._pUri.path).dirname + "/" + pName.basename, fnCallback);
        };

        TFile.prototype.remove = function (fnCallback) {
            if (typeof fnCallback === "undefined") { fnCallback = TFile.defaultCallback; }
            if (this.checkIfNotOpen(this.remove, fnCallback)) {
                return;
            }

            var pFile = this;
            var pCommand = {
                act: 6 /* k_Remove */,
                name: this.path,
                mode: this._iMode
            };
            var fnCallbackSystem = function (err, pData) {
                pFile.close();

                if (isDef(fnCallback)) {
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
            logger.assert(isDefAndNotNull(this._pFileMeta), "There is no file handle open.");

            var nSeek = this._nCursorPosition + iOffset;
            if (nSeek < 0) {
                nSeek = this.byteLength - (math.abs(nSeek) % this.byteLength);
            }

            logger.assert(nSeek >= 0 && nSeek <= this.byteLength, "Invalid offset parameter");

            this._nCursorPosition = nSeek;

            return this._nCursorPosition;
        };

        TFile.prototype.isOpened = function () {
            return this._pFileMeta !== null;
        };

        TFile.prototype.isExists = function (fnCallback) {
            var pCommand = {
                act: 5 /* k_Exists */,
                name: this.path,
                mode: this._iMode
            };
            this.execCommand(pCommand, fnCallback);
        };

        TFile.prototype.isLocal = function () {
            return this._isLocal;
        };

        TFile.prototype.getMetaData = function (fnCallback) {
            logger.assert(isDefAndNotNull(this._pFileMeta), 'There is no file handle open.');
            fnCallback(null, {
                lastModifiedDate: this._pFileMeta.lastModifiedDate
            });
        };

        TFile.prototype.setAndValidateUri = function (sFilename) {
            var pUri = uri.parse(sFilename);
            var pUriLocal;

            if (pUri.scheme === "filesystem:") {
                pUriLocal = uri.parse(pUri.path);

                // console.log(pUriLocal.toString());
                logger.assert(!(pUriLocal.protocol && pUriLocal.host != info.uri.host), "It supports only local files within the current domain.");

                var pFolders = pUriLocal.path.split('/');

                if (pFolders[0] == "" || pFolders[0] == ".") {
                    pFolders = pFolders.slice(1);
                }

                logger.assert(pFolders[0] === "temporary", "Supported only \"temporary\" filesystems. " + pUri.toString());

                //removing "temporary" from path...
                pFolders = pFolders.slice(1);

                this._pUri = uri.parse(pFolders.join("/"));

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
                act: 1 /* k_Open */,
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
            // var pFile: AIFile = this;
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

                if (isDef(pTransferables)) {
                    // console.log(pCommand, pTransferables);
                    pThread.send(pCommand, pTransferables);
                } else {
                    pThread.send(pCommand);
                }
            });
        };
        TFile.localManager = new threading.Manager(config.io.tfile.local);
        TFile.remoteManager = new threading.Manager(config.io.tfile.remote);

        TFile.defaultCallback = function (err) {
            if (err) {
                throw err;
            }
        };
        return TFile;
    })();

    
    return TFile;
});
//# sourceMappingURL=TFile.js.map
