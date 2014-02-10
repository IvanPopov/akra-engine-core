/// <reference path="../idl/IFile.ts" />
/// <reference path="../config/config.ts" />
/// <reference path="../path/path.ts" />
/// <reference path="../uri/uri.ts" />
/// <reference path="../logger.ts" />
/// <reference path="io.ts" />
/// <reference path="../info/info.ts" />
/// <reference path="../math/math.ts" />
var akra;
(function (akra) {
    /**
    * FIle implementation via <Local filesystem>.
    * ONLY FOR LOCAL FILES!!
    */
    (function (io) {
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

            akra.logger.error(sMesg);
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

            window.storageInfo.requestQuota(window.TEMPORARY, akra.config.io.local.filesystemLimit || 33554432, function (nGrantedBytes) {
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
                if (akra.isDef(sMode)) {
                    this._iMode = akra.isString(sMode) ? akra.io.filemode(sMode) : sMode;
                }

                this.setAndValidateUri(akra.uri.parse(sFilename));

                if (arguments.length > 2) {
                    this.open(sFilename, sMode, fnCallback);
                }
            }
            LocalFile.prototype.getPath = function () {
                akra.logger.assert(akra.isDefAndNotNull(this._pFile), "There is no file handle open.");
                return this._pUri.toString();
            };

            LocalFile.prototype.getName = function () {
                return akra.path.parse(this._pUri.getPath()).getBaseName();
            };

            LocalFile.prototype.getMeta = function () {
                return null;
            };

            LocalFile.prototype.getByteLength = function () {
                return this._pFile ? this._pFile.size : 0;
            };

            LocalFile.prototype.getMode = function () {
                return this._iMode;
            };

            LocalFile.prototype.setMode = function (sMode) {
                this._iMode = akra.isString(sMode) ? akra.io.filemode(sMode) : sMode;
            };

            LocalFile.prototype.setOnRead = function (fnCallback) {
                this.read(fnCallback);
            };

            LocalFile.prototype.setOnOpen = function (fnCallback) {
                this.open(fnCallback);
            };

            LocalFile.prototype.getPosition = function () {
                akra.logger.assert(akra.isDefAndNotNull(this._pFile), "There is no file handle open.");
                return this._nCursorPosition;
            };

            LocalFile.prototype.setPosition = function (iOffset) {
                akra.logger.assert(akra.isDefAndNotNull(this._pFile), "There is no file handle open.");
                this._nCursorPosition = iOffset;
            };

            LocalFile.prototype.open = function (sFilename, iMode, fnCallback) {
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
                fnCallback = fnCallback || LocalFile.defaultCallback;

                if (this.isOpened()) {
                    akra.logger.warn("file already opened: " + this.getName());
                    fnCallback(null, this._pFile);
                }

                this.setAndValidateUri(akra.uri.parse(arguments[0]));

                if (hasMode) {
                    this._iMode = (akra.isString(arguments[1]) ? akra.io.filemode(arguments[1]) : arguments[1]);
                }

                var fnFSInited;
                var pFileSystem = null;
                var fnErrorHandler = function (e) {
                    if (e.code == FileError.NOT_FOUND_ERR && akra.io.canCreate(this.mode)) {
                        LocalFile.createDir(pFileSystem.root, akra.path.parse(this.path).getDirName().split('/'), function (e) {
                            if (!akra.isNull(e)) {
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
                    akra.logger.assert(akra.isDefAndNotNull(pFs), "local file system not initialized");

                    pFileSystem = pFs;
                    pFs.root.getFile(this.path, {
                        create: akra.io.canCreate(this._iMode),
                        exclusive: false
                    }, function (fileEntry) {
                        var _this = this;
                        this.setFileEntry(fileEntry);
                        fileEntry.file(function (file) {
                            _this.setFile(file);

                            if (akra.io.isTrunc(_this.mode) && _this.byteLength) {
                                _this.clear(function (err) {
                                    if (err) {
                                        fnCallback(err);
                                    } else {
                                        fnCallback.call(_this, null, file);
                                    }
                                });
                                return;
                            }

                            if (akra.io.isAppend(_this.mode)) {
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

                akra.logger.assert(akra.isDefAndNotNull(this._pFile), 'There is no file handle open');

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

                akra.logger.assert(akra.io.canRead(this._iMode), "The file is not readable.");

                var pReader = this._pFileReader;
                var pFileObject = this._pFile;

                pReader.onloadend = function (e) {
                    var pData = (e.target).result;
                    var nPos = this.position;

                    if (nPos > 0) {
                        if (akra.io.isBinary(this.mode)) {
                            pData = (new Uint8Array((new Uint8Array(pData)).subarray(nPos))).buffer;
                        } else {
                            pData = pData.substr(nPos);
                        }
                    }

                    this.atEnd();

                    fnCallback.call(this, null, pData);
                };

                if (akra.io.isBinary(this.getMode())) {
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

                akra.logger.assert(akra.io.canWrite(iMode), "The file is not writable.");

                sContentType = sContentType || (akra.io.isBinary(iMode) ? "application/octet-stream" : "text/plain");

                var pFile = this;
                var pFileEntry = this._pFileEntry;

                pFileEntry.createWriter(function (pWriter) {
                    pWriter.seek(pFile.getPosition());

                    pWriter.onerror = function (e) {
                        fnCallback.call(pFileEntry, e);
                    };

                    pWriter.onwriteend = function () {
                        if (akra.io.isBinary(iMode)) {
                            pFile.seek(pData.byteLength);
                        } else {
                            pFile.seek(pData.length);
                        }

                        fnCallback.call(pFile, null);
                    };

                    pWriter.write((new Blob(pData, { type: sContentType })));
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

                if (akra.io.isBinary(this._iMode)) {
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
                var pName = akra.path.parse(sFilename);

                akra.logger.assert(!pName.getDirName(), 'only filename can be specified.');

                this.move(akra.path.parse(this._pUri.getPath()).getDirName() + "/" + pName.getBaseName(), fnCallback);
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
                this.setPosition(this.getByteLength());
                return this._nCursorPosition;
            };

            //return current position;
            LocalFile.prototype.seek = function (iOffset) {
                akra.logger.assert(akra.isDefAndNotNull(this._pFile), "There is no file handle open.");

                var nSeek = this._nCursorPosition + iOffset;
                if (nSeek < 0) {
                    nSeek = this.getByteLength() - (akra.math.abs(nSeek) % this.getByteLength());
                }

                akra.logger.assert(nSeek >= 0 && nSeek <= this.getByteLength(), "Invalid offset parameter");

                this._nCursorPosition = nSeek;

                return this._nCursorPosition;
            };

            LocalFile.prototype.isOpened = function () {
                return this._pFile !== null;
            };

            LocalFile.prototype.isExists = function (fnCallback) {
                this.open(function (e) {
                    fnCallback(akra.isNull(e) ? true : false);
                });
            };

            LocalFile.prototype.isLocal = function () {
                return true;
            };

            LocalFile.prototype.getMetaData = function (fnCallback) {
                akra.logger.assert(akra.isDefAndNotNull(this._pFile), 'There is no file handle open.');
                fnCallback(null, {
                    lastModifiedDate: this._pFile.lastModifiedDate
                });
            };

            LocalFile.prototype.setFileEntry = function (pFileEntry) {
                if (!akra.isNull(this._pFileEntry)) {
                    return false;
                }

                this._pFileEntry = pFileEntry;
                return true;
            };

            LocalFile.prototype.setFile = function (pFile) {
                if (!akra.isNull(this._pFile)) {
                    return false;
                }

                this._pFile = pFile;

                return true;
            };

            LocalFile.prototype.setAndValidateUri = function (sFilename) {
                var pUri = akra.uri.parse(sFilename);
                var pUriLocal;

                if (pUri.getProtocol() === "filesystem") {
                    pUriLocal = akra.uri.parse(pUri.getPath());

                    akra.logger.assert(!(pUriLocal.getProtocol() && pUriLocal.getHost() !== akra.info.uri.getHost()), "Поддерживаются только локальные файлы в пределах текущего домена.");

                    var pFolders = pUriLocal.getPath().split('/');

                    if (pFolders[0] == "" || pFolders[0] == ".") {
                        pFolders = pFolders.slice(1);
                    }

                    akra.logger.assert(pUri.getHost() === "temporary", "Поддерживаются только файловые системы типа \"temporary\".");

                    this._pUri = akra.uri.parse(pFolders.join("/"));
                } else {
                    akra.logger.error("used non local uri");
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

                akra.logger.error(sMesg);
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
        io.LocalFile = LocalFile;
    })(akra.io || (akra.io = {}));
    var io = akra.io;
})(akra || (akra = {}));
//# sourceMappingURL=LocalFile.js.map
