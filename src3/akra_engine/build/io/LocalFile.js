/// <reference path="../idl/AIFile.ts" />
define(["require", "exports", "config", "path", "uri", "logger", "io", "info", "math"], function(require, exports, __config__, __path__, __uri__, __logger__, __io__, __info__, __math__) {
    /**
    * FIle implementation via <Local filesystem>.
    * ONLY FOR LOCAL FILES!!
    */
    var config = __config__;
    var path = __path__;
    var uri = __uri__;
    var logger = __logger__;
    var io = __io__;
    var info = __info__;
    var math = __math__;

    var pLocalFs = null;
    var pLocalFsWaiters = [];

    function errorHandler(e) {
        var sMesg = "init filesystem: ";

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

    function setupFileSystem(fnCallback) {
        if (pLocalFs) {
            fnCallback(pLocalFs);
            return;
        }

        pLocalFsWaiters.push(fnCallback);

        if (pLocalFsWaiters.length > 1) {
            return;
        }

        window.storageInfo.requestQuota(window.TEMPORARY, config.io.local.filesystemLimit || 33554432, function (nGrantedBytes) {
            window.requestFileSystem(window.TEMPORARY, nGrantedBytes, function (pFs) {
                pLocalFs = pFs;

                if (pLocalFsWaiters.length) {
                    for (var i = 0; i < pLocalFsWaiters.length; ++i) {
                        pLocalFsWaiters[i](pFs);
                    }
                }
            }, errorHandler);
        });
    }

    var LocalFile = (function () {
        function LocalFile(sFilename, sMode, fnCallback) {
            if (typeof fnCallback === "undefined") { fnCallback = LocalFile.defaultCallback; }
            this._nCursorPosition = 0;
            if (isDef(sMode)) {
                this._iMode = isString(sMode) ? io.filemode(sMode) : sMode;
            }

            this.setAndValidateUri(uri.parse(sFilename));

            if (arguments.length > 2) {
                this.open(sFilename, sMode, fnCallback);
            }
        }
        Object.defineProperty(LocalFile.prototype, "path", {
            get: function () {
                logger.assert(isDefAndNotNull(this._pFile), "There is no file handle open.");
                return this._pUri.toString();
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(LocalFile.prototype, "name", {
            get: function () {
                return path.parse(this._pUri.path).basename;
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(LocalFile.prototype, "mode", {
            get: function () {
                return this._iMode;
            },
            set: //set mode(sMode: string);
            //set mode(iMode: int);
            function (sMode) {
                this._iMode = isString(sMode) ? io.filemode(sMode) : sMode;
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(LocalFile.prototype, "meta", {
            get: function () {
                return null;
            },
            enumerable: true,
            configurable: true
        });


        Object.defineProperty(LocalFile.prototype, "onread", {
            set: function (fnCallback) {
                this.read(fnCallback);
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(LocalFile.prototype, "onopen", {
            set: function (fnCallback) {
                this.open(fnCallback);
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(LocalFile.prototype, "position", {
            get: function () {
                logger.assert(isDefAndNotNull(this._pFile), "There is no file handle open.");
                return this._nCursorPosition;
            },
            set: function (iOffset) {
                logger.assert(isDefAndNotNull(this._pFile), "There is no file handle open.");
                this._nCursorPosition = iOffset;
            },
            enumerable: true,
            configurable: true
        });


        Object.defineProperty(LocalFile.prototype, "byteLength", {
            get: function () {
                return this._pFile ? this._pFile.size : 0;
            },
            enumerable: true,
            configurable: true
        });

        LocalFile.prototype.open = function (sFilename, iMode, fnCallback) {
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
            fnCallback = fnCallback || LocalFile.defaultCallback;

            if (this.isOpened()) {
                logger.warn("file already opened: " + this.name);
                (fnCallback)(null, this._pFile);
            }

            this.setAndValidateUri(uri.parse(arguments[0]));

            if (hasMode) {
                this._iMode = (isString(arguments[1]) ? io.filemode(arguments[1]) : arguments[1]);
            }

            var fnFSInited;
            var pFileSystem = null;
            var fnErrorHandler = function (e) {
                if (e.code == FileError.NOT_FOUND_ERR && io.canCreate(this.mode)) {
                    LocalFile.createDir(pFileSystem.root, path.parse(this.path).dirname.split('/'), function (e) {
                        if (!isNull(e)) {
                            fnCallback.call(this, e);
                        } else {
                            fnFSInited.call(this, pFileSystem);
                        }
                    });
                } else {
                    fnCallback.call(this, e);
                }
            };

            fnFSInited = function (pFs) {
                logger.assert(isDefAndNotNull(pFs), "local file system not initialized");

                pFileSystem = pFs;
                pFs.root.getFile(this.path, {
                    create: io.canCreate(this._iMode),
                    exclusive: false
                }, function (fileEntry) {
                    var _this = this;
                    this.setFileEntry(fileEntry);
                    fileEntry.file(function (file) {
                        _this.setFile(file);

                        if (io.isTrunc(_this.mode) && _this.byteLength) {
                            _this.clear(function (err) {
                                if (err) {
                                    fnCallback(err);
                                } else {
                                    fnCallback.call(_this, null, file);
                                }
                            });
                            return;
                        }

                        if (io.isAppend(_this.mode)) {
                            _this.position = _this.byteLength;
                        }

                        fnCallback.call(_this, null, file);
                    }, fnErrorHandler);
                }, fnErrorHandler);
            };

            //gete file system
            setupFileSystem(function (pFileSystem) {
                fnFSInited(pFileSystem);
            });
        };

        LocalFile.prototype.close = function () {
            this._pUri = null;
            this._iMode = 1 /* IN */ | 2 /* OUT */;
            this._nCursorPosition = 0;
            this._pFile = null;
        };

        LocalFile.prototype.checkIfNotOpen = function (method, callback) {
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

        LocalFile.prototype.clear = function (fnCallback) {
            if (typeof fnCallback === "undefined") { fnCallback = LocalFile.defaultCallback; }
            if (this.checkIfNotOpen(this.clear, fnCallback)) {
                return;
            }

            logger.assert(isDefAndNotNull(this._pFile), 'There is no file handle open');

            var pFile = this;
            var pFileEntry = this._pFileEntry;

            pFileEntry.createWriter(function (pWriter) {
                pWriter.seek(0);

                pWriter.onwriteend = function () {
                    fnCallback.call(pFile, null);
                };

                pWriter.truncate(0);
            }, function (e) {
                fnCallback.call(pFile, e);
            });
        };

        LocalFile.prototype.read = function (fnCallback) {
            if (typeof fnCallback === "undefined") { fnCallback = LocalFile.defaultCallback; }
            if (this.checkIfNotOpen(this.read, fnCallback)) {
                return;
            }

            logger.assert(io.canRead(this._iMode), "The file is not readable.");

            var pReader = this._pFileReader;
            var pFileObject = this._pFile;

            pReader.onloadend = function (e) {
                var pData = ((e.target)).result;
                var nPos = this.position;

                if (nPos > 0) {
                    if (io.isBinary(this.mode)) {
                        pData = (new Uint8Array((new Uint8Array(pData)).subarray(nPos))).buffer;
                    } else {
                        pData = pData.substr(nPos);
                    }
                }

                this.atEnd();

                fnCallback.call(this, null, pData);
            };

            if (io.isBinary(this.mode)) {
                pReader.readAsArrayBuffer(pFileObject);
            } else {
                pReader.readAsText(pFileObject);
            }
        };

        LocalFile.prototype.write = function (pData, fnCallback, sContentType) {
            if (typeof fnCallback === "undefined") { fnCallback = LocalFile.defaultCallback; }
            if (this.checkIfNotOpen(this.write, fnCallback)) {
                return;
            }

            var pFile = this;
            var iMode = this._iMode;

            logger.assert(io.canWrite(iMode), "The file is not writable.");

            sContentType = sContentType || (io.isBinary(iMode) ? "application/octet-stream" : "text/plain");

            var pFile = this;
            var pFileEntry = this._pFileEntry;

            pFileEntry.createWriter(function (pWriter) {
                pWriter.seek(pFile.position);

                pWriter.onerror = function (e) {
                    fnCallback.call(pFileEntry, e);
                };

                pWriter.onwriteend = function () {
                    if (io.isBinary(iMode)) {
                        pFile.seek(pData.byteLength);
                    } else {
                        pFile.seek(pData.length);
                    }

                    fnCallback.call(pFile, null);
                };

                pWriter.write((new (Blob)(pData, { type: sContentType })));
            }, function (e) {
                fnCallback.call(pFile, e);
            });
        };

        LocalFile.prototype.move = function (sFilename, fnCallback) {
            if (typeof fnCallback === "undefined") { fnCallback = LocalFile.defaultCallback; }
            var pFile = this;

            this.copy(sFilename, function (err) {
                if (err) {
                    fnCallback(err);
                    return;
                }

                pFile.remove(fnCallback);
            });
        };

        LocalFile.prototype.copy = function (sFilename, fnCallback) {
            if (typeof fnCallback === "undefined") { fnCallback = LocalFile.defaultCallback; }
            var iMode = 1 /* IN */ | 2 /* OUT */ | 16 /* TRUNC */;
            var pFile = this;
            var pFileCopy;

            if (io.isBinary(this._iMode)) {
                iMode |= 32 /* BIN */;
            }

            pFileCopy = new LocalFile(sFilename, iMode, function (e) {
                if (e)
                    fnCallback(e);
                pFile.read(function (e, pData) {
                    pFile.write(pData, fnCallback);
                });
            });
        };

        LocalFile.prototype.rename = function (sFilename, fnCallback) {
            if (typeof fnCallback === "undefined") { fnCallback = LocalFile.defaultCallback; }
            var pName = path.parse(sFilename);

            logger.assert(!pName.dirname, 'only filename can be specified.');

            this.move(path.parse(this._pUri.path).dirname + "/" + pName.basename, fnCallback);
        };

        LocalFile.prototype.remove = function (fnCallback) {
            if (typeof fnCallback === "undefined") { fnCallback = LocalFile.defaultCallback; }
            if (this.checkIfNotOpen(this.remove, fnCallback)) {
                return;
            }

            var pFile = this;
            this._pFileEntry.remove(function () {
                pFile.close();
                fnCallback.call(pFile, null);
            }, fnCallback);
        };

        //return current position
        LocalFile.prototype.atEnd = function () {
            this.position = this.byteLength;
            return this._nCursorPosition;
        };

        //return current position;
        LocalFile.prototype.seek = function (iOffset) {
            logger.assert(isDefAndNotNull(this._pFile), "There is no file handle open.");

            var nSeek = this._nCursorPosition + iOffset;
            if (nSeek < 0) {
                nSeek = this.byteLength - (math.abs(nSeek) % this.byteLength);
            }

            logger.assert(nSeek >= 0 && nSeek <= this.byteLength, "Invalid offset parameter");

            this._nCursorPosition = nSeek;

            return this._nCursorPosition;
        };

        LocalFile.prototype.isOpened = function () {
            return this._pFile !== null;
        };

        LocalFile.prototype.isExists = function (fnCallback) {
            this.open(function (e) {
                fnCallback(isNull(e) ? true : false);
            });
        };

        LocalFile.prototype.isLocal = function () {
            return true;
        };

        LocalFile.prototype.getMetaData = function (fnCallback) {
            logger.assert(isDefAndNotNull(this._pFile), 'There is no file handle open.');
            fnCallback(null, {
                lastModifiedDate: this._pFile.lastModifiedDate
            });
        };

        LocalFile.prototype.setFileEntry = function (pFileEntry) {
            if (!isNull(this._pFileEntry)) {
                return false;
            }

            this._pFileEntry = pFileEntry;
            return true;
        };

        LocalFile.prototype.setFile = function (pFile) {
            if (!isNull(this._pFile)) {
                return false;
            }

            this._pFile = pFile;

            return true;
        };

        LocalFile.prototype.setAndValidateUri = function (sFilename) {
            var pUri = uri.parse(sFilename);
            var pUriLocal;

            if (pUri.protocol === "filesystem") {
                pUriLocal = uri.parse(pUri.path);

                logger.assert(!(pUriLocal.protocol && pUriLocal.host != info.uri.host), "Поддерживаются только локальные файлы в пределах текущего домена.");

                var pFolders = pUriLocal.path.split('/');

                if (pFolders[0] == "" || pFolders[0] == ".") {
                    pFolders = pFolders.slice(1);
                }

                logger.assert(pUri.host === "temporary", "Поддерживаются только файловые системы типа \"temporary\".");

                this._pUri = uri.parse(pFolders.join("/"));
            } else {
                logger.error("used non local uri");
            }
        };

        LocalFile.errorHandler = function (e) {
            var sMesg = "";

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
        };

        LocalFile.createDir = function (pRootDirEntry, pFolders, fnCallback) {
            if (pFolders[0] == "." || pFolders[0] == "") {
                pFolders = pFolders.slice(1);
            }

            pRootDirEntry.getDirectory(pFolders[0], { create: true }, function (dirEntry) {
                if (pFolders.length) {
                    LocalFile.createDir(dirEntry, pFolders.slice(1), fnCallback);
                } else {
                    fnCallback(null);
                }
            }, fnCallback);
        };

        LocalFile.defaultCallback = function (err) {
            if (err) {
                LocalFile.errorHandler(err);
            }
        };
        return LocalFile;
    })();

    
    return LocalFile;
});
//# sourceMappingURL=LocalFile.js.map
