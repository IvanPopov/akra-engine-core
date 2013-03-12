function LocalFile () {
    this._eFileMode = ((typeof (arguments[1])) == "string" ? a.io.stringTomode(arguments[1]) : (arguments[1]) || (1));
    this._pFileName = (a.pathinfo(arguments[0])) || null;
    this._pFile = null;
    this._pFileReader = new FileReader();
    this._nSeek = 0;
    this._pFileHandle = null;
    if ((arguments.length) > 2) {
        this.open(arguments[0], arguments[1], arguments[2], arguments[3]);

    }

}

function LocalFS () {
    this._pFileSystem = null;
    this._pCallbackQueue = [];

}

LocalFS.prototype.get = function (fnCallback) {
    if (this._pFileSystem) {
        fnCallback(this._pFileSystem);
        return;

    }
    var me = this;
    var pQueue = me._pCallbackQueue;
    pQueue.push(fnCallback);
    if ((pQueue.length) > 1) {
        return;

    }
    var fnErrorHandler = function (e) {
        var msg = "Init filesystem: ";
        switch (e.code) {
            case FileError.QUOTA_EXCEEDED_ERR:
                msg += "QUOTA_EXCEEDED_ERR";
                break;

            case FileError.NOT_FOUND_ERR:
                msg += "NOT_FOUND_ERR";
                break;

            case FileError.SECURITY_ERR:
                msg += "SECURITY_ERR";
                break;

            case FileError.INVALID_MODIFICATION_ERR:
                msg += "INVALID_MODIFICATION_ERR";
                break;

            case FileError.INVALID_STATE_ERR:
                msg += "INVALID_STATE_ERR";
                break;

            default:
                msg += "Unknown Error";
                break;
        }
        if (!0) {
            var err = ((((((("Error:: " + msg) + "\n") + "\tfile: ") + __FILE__) + "\n") + "\tline: ") + __LINE__)
                + "\n";
            if (confirm(err + "Accept to exit, refuse to continue.")) {
                throw new Error(msg);
            }

        }
        ;

    }
    window.requestFileSystem = (window.requestFileSystem) || (window.webkitRequestFileSystem);
    window.webkitStorageInfo.requestQuota(window.TEMPORARY, (32 * 1024) * 1024, function (nGrantedBytes) {
                                              window.requestFileSystem(window.TEMPORARY, nGrantedBytes, function (pFs) {
                                                                           me._pFileSystem = pFs;
                                                                           if (pQueue.length) {
                                                                               for (var i = 0; i < (pQueue.length);
                                                                                    ++i) {
                                                                                   pQueue[i](pFs);

                                                                               }


                                                                           }

                                                                       }
                                                  , fnErrorHandler);

                                          }
    );

};
LocalFile.prototype._pFileSystem = new LocalFS();
LocalFile.prototype._fs = function (fn) {
    this._pFileSystem.get(fn);

};
Object.defineProperty(LocalFile.prototype, "mode", {
    set: function (pMode) {
        this._eFileMode = ((typeof pMode) == "string" ? a.io.stringTomode(pMode) : pMode);

    },
    get: function () {
        return this._eFileMode;

    }
});
LocalFile.prototype._errorHandler = function (e) {
    var msg = "";
    switch (e.code) {
        case FileError.QUOTA_EXCEEDED_ERR:
            msg += "QUOTA_EXCEEDED_ERR";
            break;

        case FileError.NOT_FOUND_ERR:
            msg += "NOT_FOUND_ERR";
            break;

        case FileError.SECURITY_ERR:
            msg += "SECURITY_ERR";
            break;

        case FileError.INVALID_MODIFICATION_ERR:
            msg += "INVALID_MODIFICATION_ERR";
            break;

        case FileError.INVALID_STATE_ERR:
            msg += "INVALID_STATE_ERR";
            break;

        default:
            msg += "Unknown Error";
            break;
    }
    if (!0) {
        var err = ((((((("Error:: " + msg) + "\n") + "\tfile: ") + __FILE__) + "\n") + "\tline: ") + __LINE__) + "\n";
        if (confirm(err + "Accept to exit, refuse to continue.")) {
            throw new Error(msg);
        }

    }
    ;

};
LocalFile.prototype.open = function () {
    if (!(((arguments.length) >= 0) && ((arguments.length) < 5))) {
        var err = ((((((("Error:: " + (("Invalid number(" + (arguments.length)) + ") of parameters.")) + "\n")
            + "\tfile: ") + __FILE__) + "\n") + "\tline: ") + __LINE__) + "\n";
        if (confirm(err + "Accept to exit, refuse to continue.")) {
            throw new Error((("Invalid number("
                + (arguments.length)) + ") of parameters."));
        }

    }
    ;
    var fnSuccess, fnError, hasMode = (typeof (arguments[1])) != "function";
    if ((arguments.length) < 3) {
        if ((typeof (arguments[0])) == "string") {
            this._pFileName = arguments[0];
            fnSuccess = arguments[1];
            fnError = null;

        }
        else if ((typeof (arguments[0])) == "number") {
            this._eFileMode = arguments[0];
            fnSuccess = arguments[1];
            fnError = null;

        }
        else {
            fnSuccess = arguments[0];
            fnError = (arguments[1]) || null;

        }
        if (!this._pFileName) {
            var err = ((((((("Error:: " + "No filename provided.") + "\n") + "\tfile: ") + __FILE__) + "\n")
                + "\tline: ") + __LINE__) + "\n";
            if (confirm(err + "Accept to exit, refuse to continue.")) {
                throw new Error("No filename provided.");
            }

        }
        ;
        this.open(this._pFileName, this._eFileMode, fnSuccess, fnError);
        return;

    }
    fnSuccess = arguments[(hasMode ? 2 : 1)];
    fnError = (arguments[(hasMode ? 3 : 2)]) || null;
    if (this.isOpened()) {
        console.warn((((("[WARNING][" + __FILE__) + "][") + __LINE__) + "]") + "file already opened.");
        fnSuccess(this._pFile);

    }
    var me = this;
    var pFileSystem = null;
    this._pFileName = a.pathinfo(arguments[0]);
    this._eFileMode = (hasMode ? ((typeof (arguments[1])) == "string" ? a.io.stringTomode(arguments[1]) : arguments[1])
        : this._eFileMode);
    var fnErrorHandler = function (e) {
        var fn = (!fnError ? me._errorHandler : fnError);
        if (((e.code) == (FileError.NOT_FOUND_ERR)) && ((me._eFileMode & (1 << 1)) != 0)) {
            LocalFile.createDir(pFileSystem.root, me._pFileName.dirname.split("/"), function () {
                                    fnFSInited.apply(me, [pFileSystem]);

                                }
                , function () {
                    fn.apply(me, arguments);

                }
            );

        }
        else {
            fn.apply(me, arguments);
        }

    }
    var fnFSInited = function (pFs) {
        if (!pFs) {
            var err = ((((((("Error:: " + "Local file system not initialized.") + "\n") + "\tfile: ") + __FILE__)
                + "\n") + "\tline: ") + __LINE__) + "\n";
            if (confirm(err
                            + "Accept to exit, refuse to continue.")) {
                throw new Error("Local file system not initialized.");
            }

        }
        ;
        pFileSystem = pFs;
        pFs.root.getFile(this._pFileName, {
                             create:    (this._eFileMode & (1 << 1)) != 0,
                             exclusive: false
                         }, function (fileEntry) {
                             me._pFileHandle = fileEntry;
                             fileEntry.file(function (file) {
                                                me._pFile = file;
                                                if (((me._eFileMode & (1 << 4)) != 0) && (me.size)) {
                                                    me.clear(function () {
                                                                 fnSuccess.apply(me, [file]);

                                                             }
                                                        , fnError);
                                                    return;

                                                }
                                                if ((me._eFileMode & (1 << 3)) != 0) {
                                                    me.position = me.size;

                                                }
                                                fnSuccess.apply(me, [file]);

                                            }
                                 , fnErrorHandler);

                         }
            , fnErrorHandler);

    }
    this._fs(function (pFileSystem) {
                 fnFSInited.apply(me, [pFileSystem]);

             }
    );

};
Object.defineProperty(LocalFile.prototype, "path", {
    get: function () {
        if (!this._pFile) {
            var err = ((((((("Error:: " + "There is no file handle open.") + "\n") + "\tfile: ") + __FILE__) + "\n")
                + "\tline: ") + __LINE__) + "\n";
            if (confirm(err + "Accept to exit, refuse to continue.")) {
                throw new Error("There is no file handle open.");
            }

        }
        ;
        return this._pFileName.toString();

    }
});
LocalFile.prototype.close = function () {
    this._pFileName = null;
    this._eFileMode = (1) | (2);
    this._nLength = 0;
    this._nSeek = 0;
    {
        if (this._pFile) {
            delete this._pFile;
            this._pFile = 0;

        }

    }
    ;

};
LocalFile.prototype.clear = function (fnSuccess, fnError) {
    if (!this._pFile) {
        var err = ((((((("Error:: " + "There is no file handle open") + "\n") + "\tfile: ") + __FILE__) + "\n")
            + "\tline: ") + __LINE__) + "\n";
        if (confirm(err + "Accept to exit, refuse to continue.")) {
            throw new Error("There is no file handle open");
        }

    }
    ;
    var me = this;
    me._pFileHandle.createWriter(function (pWriter) {
                                     pWriter.seek(0);
                                     if (fnSuccess) {
                                         pWriter.onwriteend = function () {
                                             fnSuccess.apply(me, arguments);

                                         };

                                     }
                                     pWriter.truncate(0);

                                 }
        , function () {
            var fn = fnError || (this._errorHandler);
            fn.apply(me.arguments);

        }
    );

};
Object.defineProperty(LocalFile.prototype, "name", {
    get: function () {
        return this._pFileName.basename;

    },
    set: function (sFileName) {
        if (!(!(this._pFile))) {
            var err = ((((((("Error:: " + "There is file handle open.") + "\n") + "\tfile: ") + __FILE__) + "\n")
                + "\tline: ") + __LINE__) + "\n";
            if (confirm(err + "Accept to exit, refuse to continue.")) {
                throw new Error("There is file handle open.");
            }

        }
        ;
        this._pFileName.basename = sFileName;

    }
});
LocalFile.prototype.isOpened = function () {
    return (this._pFile ? true : false);

};
LocalFile.prototype.write = function (pData, fnSuccess, fnError, sContentType) {
    if (!(this._pFile)) {
        var pArgs = arguments;
        this.open(function () {
                      this.write.apply(this, pArgs);

                  }
            , fnError || null);
        return;

    }
    ;
    var iMode = this._eFileMode;
    if (!(iMode & (1 << 1)) != 0) {
        var err = ((((((("Error:: " + "The file is not writable.") + "\n") + "\tfile: ") + __FILE__) + "\n")
            + "\tline: ") + __LINE__) + "\n";
        if (confirm(err + "Accept to exit, refuse to continue.")) {
            throw new Error("The file is not writable.");
        }

    }
    ;
    sContentType = sContentType || (((iMode & (1 << 5)) != 0 ? "application/octet-stream" : "text/plain"));
    var me = this;
    me._pFileHandle.createWriter(function (pWriter) {
                                     pWriter.seek(me._nSeek);
                                     pWriter.onerror = function () {
                                         if (fnError) {
                                             fnError.apply(me, arguments);

                                         }
                                         else {
                                             if (!0) {
                                                 var err = ((((((("Error:: " + ("Write failed: " + (e.toString())))
                                                     + "\n") + "\tfile: ") + __FILE__) + "\n") + "\tline: ") + __LINE__)
                                                     + "\n";
                                                 if (confirm(err
                                                                 + "Accept to exit, refuse to continue.")) {
                                                     throw new Error(("Write failed: "
                                                         + (e.toString())));
                                                 }

                                             }
                                             ;

                                         }

                                     };
                                     if (fnSuccess) {
                                         pWriter.onwriteend = function () {
                                             if ((iMode & (1 << 5)) != 0) {
                                                 me.seek(pData.byteLength);

                                             }
                                             else {
                                                 me.seek(pData.length);

                                             }
                                             fnSuccess.apply(me, arguments);

                                         };

                                     }
                                     var bb = new BlobBuilder();
                                     bb.append(pData);
                                     pWriter.write(bb.getBlob(sContentType));

                                 }
        , function () {
            fnError || (this._errorHandler).apply(me, arguments);

        }
    );

};
LocalFile.prototype.atEnd = function () {
    this.position = this.size;

};
LocalFile.prototype.read = function (fnSuccess, fnError) {
    if (!(this._eFileMode & (1 << 0)) != 0) {
        var err = ((((((("Error:: " + "The file is not readable.") + "\n") + "\tfile: ") + __FILE__) + "\n")
            + "\tline: ") + __LINE__) + "\n";
        if (confirm(err + "Accept to exit, refuse to continue.")) {
            throw new Error("The file is not readable.");
        }

    }
    ;
    if (!(this._pFile)) {
        var pArgs = arguments;
        this.open(function () {
                      this.read.apply(this, pArgs);

                  }
            , fnError || null);
        return;

    }
    ;
    var reader = this._pFileReader;
    var me = this;
    reader.onloadend = function (e) {
        var pData = e.target.result;
        var nPos = me._nSeek;
        if (nPos) {
            if ((me._eFileMode & (1 << 5)) != 0) {
                pData = new Uint8Array(new Uint8Array(pData).subarray(nPos)).buffer;

            }
            else {
                pData = pData.substr(nPos);

            }

        }
        me.atEnd();
        fnSuccess.apply(me, [pData]);

    };
    if ((me._eFileMode & (1 << 5)) != 0) {
        reader.readAsArrayBuffer(this._pFile);

    }
    else {
        reader.readAsText(this._pFile);

    }

};
Object.defineProperty(LocalFile.prototype, "position", {
    get: function () {
        if (!this._pFile) {
            var err = ((((((("Error:: " + "There is no file handle open.") + "\n") + "\tfile: ") + __FILE__) + "\n")
                + "\tline: ") + __LINE__) + "\n";
            if (confirm(err + "Accept to exit, refuse to continue.")) {
                throw new Error("There is no file handle open.");
            }

        }
        ;
        return this._nSeek;

    },
    set: function (iOffset) {
        if (!this._pFile) {
            var err = ((((((("Error:: " + "There is no file handle open.") + "\n") + "\tfile: ") + __FILE__) + "\n")
                + "\tline: ") + __LINE__) + "\n";
            if (confirm(err + "Accept to exit, refuse to continue.")) {
                throw new Error("There is no file handle open.");
            }

        }
        ;
        this._nSeek = iOffset;

    }
});
Object.defineProperty(LocalFile.prototype, "size", {
    get: function () {
        if (!this._pFile) {
            var err = ((((((("Error:: " + "There is no file handle open.") + "\n") + "\tfile: ") + __FILE__) + "\n")
                + "\tline: ") + __LINE__) + "\n";
            if (confirm(err + "Accept to exit, refuse to continue.")) {
                throw new Error("There is no file handle open.");
            }

        }
        ;
        return this._pFile.size;

    }
});
LocalFile.prototype.seek = function (iOffset) {
    if (!this._pFile) {
        var err = ((((((("Error:: " + "There is no file handle open.") + "\n") + "\tfile: ") + __FILE__) + "\n")
            + "\tline: ") + __LINE__) + "\n";
        if (confirm(err + "Accept to exit, refuse to continue.")) {
            throw new Error("There is no file handle open.");
        }

    }
    ;
    var nSeek = (this._nSeek) + iOffset;
    if (nSeek < 0) {
        nSeek = (this.size) - ((Math.abs(nSeek)) % (this.size));

    }
    if (!((nSeek >= 0) && (nSeek <= (this.size)))) {
        var err = ((((((("Error:: " + "Invalid offset parameter") + "\n") + "\tfile: ") + __FILE__) + "\n")
            + "\tline: ") + __LINE__) + "\n";
        if (confirm(err + "Accept to exit, refuse to continue.")) {
            throw new Error("Invalid offset parameter");
        }

    }
    ;
    this._nSeek = nSeek;

};
LocalFile.prototype.isExists = function (fnSuccess, fnError) {
    var me = this;
    this.open(function () {
                  fnSuccess(true);

              }
        , function (e) {
            if ((e.code) == (FileError.NOT_FOUND_ERR)) {
                fnSuccess.apply(me, [false]);

            }
            else {
                if (fnError) {
                    fnError.apply(me, arguments);

                }
                else {
                    throw e;

                }

            }

        }
    );

};
LocalFile.prototype.move = function (pFileName, fnSuccess, fnError) {
    var me = this;
    this.copy(pFileName, function () {
                  me.remove(fnSuccess, fnError);

              }
        , fnError);

};
LocalFile.prototype.rename = function (pFileName, fnSuccess, fnError) {
    var pName = a.pathinfo(pFileName);
    if (!(!(pName.dirname))) {
        var err = ((((((("Error:: " + "only filename can be specified.") + "\n") + "\tfile: ") + __FILE__) + "\n")
            + "\tline: ") + __LINE__) + "\n";
        if (confirm(err + "Accept to exit, refuse to continue.")) {
            throw new Error("only filename can be specified.");
        }

    }
    ;
    this.move(((this._pFileName.sDirname) + "/") + (pName.basename), fnSuccess, fnError);

};
LocalFile.prototype.copy = function (pFileName, fnSuccess, fnError) {
    var iMode = ((1) | (2)) | (16);
    if ((this._eFileMode & (1 << 5)) != 0) {
        iMode |= 32;

    }
    var me = this;
    var pFile = new LocalFile(pFileName, iMode, function () {
                                  me.read(function (pData) {
                                              pFile.write(pData, fnSuccess, fnError);

                                          }
                                  );

                              }
        , fnError);

};
LocalFile.prototype.getMetadata = function (fnSuccess, fnError) {
    if (!this._pFile) {
        var err = ((((((("Error:: " + "There is no file handle open.") + "\n") + "\tfile: ") + __FILE__) + "\n")
            + "\tline: ") + __LINE__) + "\n";
        if (confirm(err + "Accept to exit, refuse to continue.")) {
            throw new Error("There is no file handle open.");
        }

    }
    ;
    fnSuccess({
                  lastModifiedDate: this._pFile.lastModifiedDate
              });

};
LocalFile.prototype.remove = function (fnSuccess, fnError) {
    if (!(this._pFile)) {
        var pArgs = arguments;
        this.open(function () {
                      this.remove.apply(this, pArgs);

                  }
            , fnError || null);
        return;

    }
    ;
    var me = this;
    var fnErr = (fnError ? function () {
        fnError.apply(this, arguments);

    }
        : undefined);
    this._pFileHandle.remove(function () {
                                 me.close();
                                 if (fnSuccess) {
                                     fnSuccess.apply(me, arguments);

                                 }

                             }
        , fnErr);

};
LocalFile.isSupported = function () {
    return (window.requestFileSystem !== undefined) || (window.webkitRequestFileSystem !== undefined);

};
LocalFile.createDir = function (pRootDirEntry, pFolders, fnSuccess, fnError) {
    if (((pFolders[0]) == ".") || ((pFolders[0]) == "")) {
        pFolders = pFolders.slice(1);

    }
    pRootDirEntry.getDirectory(pFolders[0], {
                                   create: true
                               }, function (dirEntry) {
                                   if (pFolders.length) {
                                       a.LocalFile.createDir(dirEntry, pFolders.slice(1), fnSuccess, fnError);

                                   }
                                   else if (fnSuccess) {
                                       fnSuccess();
                                   }

                               }
        , fnError || (function (e) {
            if (!0) {
                var err = ((((((("Error:: " + (("createDir:: cannot create folder. error code(" + (e.code)) + ")"))
                    + "\n") + "\tfile: ") + __FILE__) + "\n") + "\tline: ") + __LINE__) + "\n";
                if (confirm(err
                                + "Accept to exit, refuse to continue.")) {
                    throw new Error((("createDir:: cannot create folder. error code("
                        + (e.code)) + ")"));
                }

            }
            ;

        }
            ));

};
LocalFile.copy = function (pRootDirEntry, sFrom, sTo, fnSuccess, fnError) {
    pRootDirEntry.getFile(sFrom, {}, function (fileEntry) {
                              pRootDirEntry.getDirectory(sTo, {}, function (dirEntry) {
                                                             fileEntry.copyTo(dirEntry, fnSuccess, fnError);

                                                         }
                                  , fnError || (function (e) {
                                      if (!0) {
                                          var err = ((((((("Error:: " + (((("copy:: cannot get directory(" + sTo)
                                              + "). error code(") + (e.code)) + ")")) + "\n") + "\tfile: ") + __FILE__)
                                              + "\n") + "\tline: ") + __LINE__) + "\n";
                                          if (confirm(err
                                                          + "Accept to exit, refuse to continue.")) {
                                              throw new Error((((("copy:: cannot get directory("
                                                  + sTo) + "). error code(") + (e.code)) + ")"));
                                          }

                                      }
                                      ;

                                  }
                                      ));

                          }
        , fnError || (function (e) {
            if (!0) {
                var err = ((((((("Error:: " + (((("copy:: cannot get file(" + sFrom) + "). error code(") + (e.code))
                    + ")")) + "\n") + "\tfile: ") + __FILE__) + "\n") + "\tline: ") + __LINE__) + "\n";
                if (confirm(err + "Accept to exit, refuse to continue.")) {
                    throw new Error((((("copy:: cannot get file("
                        + sFrom) + "). error code(") + (e.code)) + ")"));
                }

            }
            ;

        }
            ));

};

a.LocalFile = LocalFile;

