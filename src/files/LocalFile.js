/**
 * @file
 * @author Ivan Popov
 * @brief Базовые функции для чтения и записи локальных файлов.
 * @email vantuziast@odserve.org
 */

/** @example LocalFile.js
 * Пример использования данного класса.
 * В примере описаны базовые конструкции для чтения и записи локальных файлов.
 */


/*
 class File {
 constructors:
 File(string filename, int/string mode = READ, func success = null, func error = null);

 methods:

 void open(string filename, int/string mode, func success, func error = null);
 void open(string filename, int/string mode);
 void open(string filename, func success, func error = null);
 void open(func success, func error = null);

 void read(func success, func error);
 void write(string/buffer data, func success, func error = null, string content_type = 'text/plain');
 void remove(func success, func error);
 void seek(uint position);
 void close();
 void clear(func success, func error);
 bool isOpened();
 void atEnd();
 bool isExists(fnSuccess, fnError);
 void copy(string filename, func success, func error);
 void move(string filename, func success, func error);
 void rename(string filename, func success, func error);
 void getMetadata(func success, func error);
 properies:
 get       uint size;
 get/set   uint position;
 get       string name;
 get       string path;
 }
 */

Define(a.LocalFile.FS_MAX_SIZE, 32 * 1024 * 1024); //32 MB

/**
 * BUILD
 Include('sources/Common.js');
 Include('sources/Bitflags.js');
 Include('sources/FileUtils.js');
 Include('sources/data/LocalFile.js');
 */

/**
 * @property LocalFile(sFileName, eFileMode=READ)
 * Constructor
 * @memberof LocalFile
 * @tparam String sFileName Имя файла.
 * @tparam Enumeration eFileMode Мод.
 */
/**
 * @property LocalFile(sFileName, eFileMode, fnSuccess, fnError = null)
 * Constructor
 * @memberof LocalFile
 * @tparam String sFileName Имя файла.
 * @tparam Enumeration eFileMode Мод.
 * @tparam Function fnSuccess Вызывается при открытии файла.
 * @tparam Function fnError Вызывается при ошибке.
 */
/**
 * LocalFile class.
 * @ctro
 * Конструктор.
 * Класс для работы с файлами по средствам local file system API.
 */
function LocalFile () {
    /**
     * Мод.
     * @private
     * @type Enumeration(LOCAL_FILE_ACCESS)
     */
    this._eFileMode = (typeof arguments[1] == 'string' ?
        a.io.stringTomode(arguments[1]) : arguments[1] || a.io.IN);


    /**
     * Имя файла.
     * @private
     * @type String
     */
    this._pFileName = a.pathinfo(arguments[0]) || null;
    /**
     * Файловый дескриптор.
     * @private
     * @type Object
     */
    this._pFile = null;

    /**
     * Устройство чтения из файла.
     * @private
     * @type FileReader
     */
    this._pFileReader = new FileReader;

    /**
     * Текущая позиция в файле
     * @private
     * @type Int
     */
    this._nSeek = 0;

    /**
     * Указатель на запись файла в файловой системе.
     * @private
     * @type FileHandle
     */

    this._pFileHandle = null;

    if (arguments.length > 2) {
        this.open(arguments[0], arguments[1], arguments[2], arguments[3]);
    }
}

function LocalFS () {
    this._pFileSystem = null;
    this._pCallbackQueue = [];
}

/**
 * Инициализация файловой системы.
 * @tparam Function fnCallback Функция, вызываемая
 * при успешной(получет в 1ом параметре fs)
 * инициализации системы.
 */
LocalFS.prototype.get = function (fnCallback) {
    if (this._pFileSystem) {
        fnCallback(this._pFileSystem);
        return;
    }

    var me = this;
    var pQueue = me._pCallbackQueue;

    pQueue.push(fnCallback);

    if (pQueue.length > 1) {
        return;
    }


    var fnErrorHandler = function (e) {
        var msg = 'Init filesystem: ';

        switch (e.code) {
            case FileError.QUOTA_EXCEEDED_ERR:
                msg += 'QUOTA_EXCEEDED_ERR';
                break;
            case FileError.NOT_FOUND_ERR:
                msg += 'NOT_FOUND_ERR';
                break;
            case FileError.SECURITY_ERR:
                msg += 'SECURITY_ERR';
                break;
            case FileError.INVALID_MODIFICATION_ERR:
                msg += 'INVALID_MODIFICATION_ERR';
                break;
            case FileError.INVALID_STATE_ERR:
                msg += 'INVALID_STATE_ERR';
                break;
            default:
                msg += 'Unknown Error';
                break;
        }
        error(msg);
    }

    window.requestFileSystem =
        window.requestFileSystem || window.webkitRequestFileSystem;
    window.webkitStorageInfo.requestQuota(window.TEMPORARY, a.LocalFile.FS_MAX_SIZE,
                                          function (nGrantedBytes) {
                                              window.requestFileSystem(window.TEMPORARY, nGrantedBytes,
                                                                       function (pFs) {

                                                                           me._pFileSystem = pFs;

                                                                           if (pQueue.length) {
                                                                               for (var i = 0; i < pQueue.length; ++i) {
                                                                                   pQueue[i](pFs);
                                                                               }
                                                                           }


                                                                       }, fnErrorHandler);
                                          });
};


LocalFile.prototype._pFileSystem = new LocalFS;

/**
 * Get file system.
 * @tparan Function FileSystem callback.
 */
LocalFile.prototype._fs = function (fn) {
    this._pFileSystem.get(fn);
};

/**
 * Set File mode.
 */
Object.defineProperty(LocalFile.prototype, 'mode', {
    set: function (pMode) {
        this._eFileMode = (typeof pMode == 'string' ?
            a.io.stringTomode(pMode) : pMode);
    },
    get: function () {
        return this._eFileMode;
    }
});

/**
 * Базовый обработчик ошибок.
 * @private
 */
LocalFile.prototype._errorHandler = function (e) {
    var msg = '';

    switch (e.code) {
        case FileError.QUOTA_EXCEEDED_ERR:
            msg += 'QUOTA_EXCEEDED_ERR';
            break;
        case FileError.NOT_FOUND_ERR:
            msg += 'NOT_FOUND_ERR';
            break;
        case FileError.SECURITY_ERR:
            msg += 'SECURITY_ERR';
            break;
        case FileError.INVALID_MODIFICATION_ERR:
            msg += 'INVALID_MODIFICATION_ERR';
            break;
        case FileError.INVALID_STATE_ERR:
            msg += 'INVALID_STATE_ERR';
            break;
        default:
            msg += 'Unknown Error';
            break;
    }
    error(msg);
};


/**
 * @property open(sFileName, eFileMode, fnSuccess, fnError = null)
 * Открытие файла.
 * @memberof LocalFile
 * @tparam String sFileName Имя файла.
 * @tparam Enumeration eFileMode Мод.
 * @tparam Function fnSuccess Вызывается при открытии файла.
 * @tparam Function fnError Вызывается при ошибке.
 * @treturn Boolean
 */
/**
 * @property open(sFileName, fnSuccess, fnError = null)
 * Открытие файла.
 * @memberof LocalFile
 * @tparam String sFileName Имя файла.
 * @tparam Function fnSuccess Вызывается при открытии файла.
 * @tparam Function fnError Вызывается при ошибке(не обязательный!).
 * @treturn Boolean
 */
/**
 * Открытие файла.
 * @tparam Function fnSuccess Вызывается при открытии файла.
 * @treturn Boolean
 */
LocalFile.prototype.open = function () {
    assert(arguments.length >= 0 && arguments.length < 5,
           "Invalid number(" + arguments.length + ") of parameters.");


    var fnSuccess, fnError, hasMode = ((typeof arguments[1]) != 'function');

    if (arguments.length < 3) {
        if (typeof arguments[0] == 'string') {
            this._pFileName = arguments[0];
            fnSuccess = arguments[1];
            fnError = null;
        }
        else if (typeof arguments[0] == 'number') {
            this._eFileMode = arguments[0];
            fnSuccess = arguments[1];
            fnError = null;
        }
        else {
            fnSuccess = arguments[0];
            fnError = arguments[1] || null;
        }

        assert(this._pFileName, "No filename provided.");


        this.open(this._pFileName, this._eFileMode, fnSuccess, fnError);
        return;
    }


    fnSuccess = arguments[hasMode ? 2 : 1];
    fnError = arguments[hasMode ? 3 : 2] || null;

    if (this.isOpened()) {
        warning('file already opened.');
        fnSuccess(this._pFile);
    }

    var me = this;
    var pFileSystem = null;

    this._pFileName = a.pathinfo(arguments[0]);
    this._eFileMode = (hasMode ? (typeof arguments[1] == 'string' ?
        a.io.stringTomode(arguments[1]) : arguments[1]) : this._eFileMode);


    var fnErrorHandler = function (e) {
        var fn = (!fnError ? me._errorHandler : fnError);

        if (e.code == FileError.NOT_FOUND_ERR && a.io.canCreate(me._eFileMode)) {
            LocalFile.createDir(pFileSystem.root, me._pFileName.dirname.split('/'),
                                function () {
                                    fnFSInited.apply(me, [pFileSystem]);
                                },
                                function () {
                                    fn.apply(me, arguments);
                                });
        }
        else {
            fn.apply(me, arguments);
        }
    };

    var fnFSInited = function (pFs) {
        assert(pFs, 'Local file system not initialized.');

        pFileSystem = pFs;
        pFs.root.getFile(this._pFileName,
                         {
                             create:    a.io.canCreate(this._eFileMode),
                             exclusive: false
                         },
                         function (fileEntry) {
                             me._pFileHandle = fileEntry;

                             fileEntry.file(function (file) {
                                 me._pFile = file;

                                 if (a.io.isTrunc(me._eFileMode) && me.size) {
                                     me.clear(function () {
                                         fnSuccess.apply(me, [file]);
                                     }, fnError);
                                     return;
                                 }

                                 if (a.io.isAppend(me._eFileMode)) {
                                     me.position = me.size;
                                 }

                                 fnSuccess.apply(me, [file]);
                             }, fnErrorHandler);

                         },
                         fnErrorHandler);
    };

    this._fs(function (pFileSystem) {
        fnFSInited.apply(me, [pFileSystem]);
    });
};

Define(LocalFile.checkIfOpen(fn, args), function () {
    if (!this._pFile) {
        var pArgs = args;
        this.open(function () {
            fn.apply(this, pArgs);
        }, fnError || null);
        return;
    }
});

Object.defineProperty(LocalFile.prototype, 'path', {
    get: function () {
        assert(this._pFile, 'There is no file handle open.');
        return this._pFileName.toString();
    }
});

/**
 * Закрыть файл.
 */
LocalFile.prototype.close = function () {
    this._pFileName = null;
    this._eFileMode = a.io.IN | a.io.OUT;
    this._nLength = 0;
    this._nSeek = 0;
    safe_delete(this._pFile);
};

/**
 * Очистить файл.
 * @tparam Function fnSuccess Вызывается в случае успеха.
 * @tparam Function fnError Вызывается в случае неудачи.
 */
LocalFile.prototype.clear = function (fnSuccess, fnError) {
    assert(this._pFile, 'There is no file handle open');

    var me = this;
    //var fileWriter = me._pFileWriter;

    me._pFileHandle.createWriter(function (pWriter) {
        pWriter.seek(0);
        if (fnSuccess) {
            pWriter.onwriteend = function () {
                fnSuccess.apply(me, arguments);
            }
        }

        pWriter.truncate(0);

    }, function () {
        var fn = (fnError || this._errorHandler);
        fn.apply(me.arguments);
    });
};


Object.defineProperty(LocalFile.prototype, 'name', {
         /**
          * Имя файла.
          * @treturn String Имя Файла.
          */
         get: function () {
             return this._pFileName.basename;
         },

    set: function (sFileName) {
        assert(!this._pFile, 'There is file handle open.');
        this._pFileName.basename = sFileName;
    }
});

/**
 * Открыт ли фпйл?
 * @treturn Boolean Открут/закрыт.
 */
LocalFile.prototype.isOpened = function () {
    return (this._pFile ? true : false);
};

/**
 * @property write(pData)
 * Запись в файл.
 * @memberof LocalFile
 * @tparam * pData Данные.
 */
/**
 * @property write(pData, fnSuccess)
 * Запись в файл.
 * @tparam * pData Данные.
 * @tparam Function fnSuccess Вызывается при успешной записи.
 */
/**
 * Запись в файл.
 * @tparam * pData Данные.
 * @tparam Function fnSuccess Вызывается при успешной записи.
 * @tparam Function fnError Вызывается при ошибки записи.
 */
LocalFile.prototype.write = function (pData, fnSuccess, fnError, sContentType) {
    LocalFile.checkIfOpen(this.write, arguments);

    var iMode = this._eFileMode;

    assert(a.io.canWrite(iMode), "The file is not writable.");

    sContentType = sContentType || (a.io.isBinary(iMode) ?
        'application/octet-stream' : 'text/plain');

    var me = this;
    me._pFileHandle.createWriter(function (pWriter) {
        pWriter.seek(me._nSeek);
        pWriter.onerror = function () {
            if (fnError) {
                fnError.apply(me, arguments);
            }
            else {
                error('Write failed: ' + e.toString());
            }
        }

        if (fnSuccess) {
            pWriter.onwriteend = function () {
                if (a.io.isBinary(iMode)) {
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

    }, function () {
        (fnError || this._errorHandler).apply(me, arguments);
    });
};

LocalFile.prototype.atEnd = function () {
    this.position = this.size;
};

/**
 * Чтение данных из файла.
 * @tparam Function fnSuccess Вызывается при успешном \
 * получении содержимого файла.
 */
LocalFile.prototype.read = function (fnSuccess, fnError) {
    assert(a.io.canRead(this._eFileMode), 'The file is not readable.');

    LocalFile.checkIfOpen(this.read, arguments);

    var reader = this._pFileReader;
    var me = this;

    reader.onloadend = function (e) {
        var pData = e.target.result;
        var nPos = me._nSeek;
        if (nPos) {
            if (a.io.isBinary(me._eFileMode)) {
                pData = (new Uint8Array((new Uint8Array(pData)).subarray(nPos))).buffer;
            }
            else {
                pData = pData.substr(nPos);
            }
        }

        me.atEnd();

        fnSuccess.apply(me, [pData]);
    };

    if (a.io.isBinary(me._eFileMode)) {
        reader.readAsArrayBuffer(this._pFile);
    }
    else {
        reader.readAsText(this._pFile);
    }
};


Object.defineProperty(LocalFile.prototype, 'position', {
         /**
          * Получить текущую позицию в файле.
          * @treturn Int
          */
         get: function () {
             assert(this._pFile, 'There is no file handle open.');
             return this._nSeek;
         },
              /**
               * Установить позицию в файле.
               * @tparam Function fnSuccess Вызывается при успешном \
               * получении содержимого файла.
               * @tparam Function fnError Вызывается при ошибки чтения.
               */
              set: function (iOffset) {
                  assert(this._pFile, 'There is no file handle open.');
                  this._nSeek = iOffset;
              }
});

Object.defineProperty(LocalFile.prototype, 'size', {
         /**
          * Получить длину файла в символах.
          * @treturn Int
          */
         get: function () {
             assert(this._pFile, 'There is no file handle open.');
             return this._pFile.size;
         }
});

/**
 * Переместить указатель на позицию.
 * @tparam Int iOffset
 */
LocalFile.prototype.seek = function (iOffset) {
    assert(this._pFile, "There is no file handle open.");

    var nSeek = this._nSeek + iOffset;

    if (nSeek < 0) {
        nSeek = this.size - (Math.abs(nSeek) % this.size);
    }

    assert(nSeek >= 0 && nSeek <= this.size, "Invalid offset parameter");


    this._nSeek = nSeek;
};

LocalFile.prototype.isExists = function (fnSuccess, fnError) {
    var me = this;
    this.open(function () {
                  fnSuccess(true);
              },
              function (e) {
                  if (e.code == FileError.NOT_FOUND_ERR) {
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
              });
};

LocalFile.prototype.move = function (pFileName, fnSuccess, fnError) {
    //assert(a.io.canWrite(this._eFileMode), 'Change the file is not allowed.');
    var me = this;

    this.copy(pFileName, function () {
        me.remove(fnSuccess, fnError);
    }, fnError);

};

LocalFile.prototype.rename = function (pFileName, fnSuccess, fnError) {
    var pName = a.pathinfo(pFileName);
    assert(!pName.dirname, 'only filename can be specified.');
    this.move(this._pFileName.sDirname + '/' + pName.basename, fnSuccess, fnError);
}

LocalFile.prototype.copy = function (pFileName, fnSuccess, fnError) {
    var iMode = a.io.IN | a.io.OUT | a.io.TRUNC;
    if (a.io.isBinary(this._eFileMode)) {
        iMode |= a.io.BIN;
    }
    var me = this;

    var pFile = new LocalFile(pFileName, iMode,
                              function () {
                                  me.read(function (pData) {
                                      pFile.write(pData, fnSuccess, fnError);
                                  });

                              }, fnError);
};

LocalFile.prototype.getMetadata = function (fnSuccess, fnError) {
    assert(this._pFile, 'There is no file handle open.');
    fnSuccess({
                  lastModifiedDate: this._pFile.lastModifiedDate
              });
}


/**
 * Удалить файл.
 * @tparam Function fnSuccess
 * @tparam Function fnError
 */
LocalFile.prototype.remove = function (fnSuccess, fnError) {
    LocalFile.checkIfOpen(this.remove, arguments);

    var me = this;
    var fnErr = (fnError ? function () {
        fnError.apply(this, arguments);
    } : undefined);
    this._pFileHandle.remove(function () {
        me.close();
        if (fnSuccess) {
            fnSuccess.apply(me, arguments);
        }
    }, fnErr);
}

/**
 * @static
 * @treturn Boolean
 * Проверка, поддерживаются ли локальные файлы.
 */
LocalFile.isSupported = function () {
    return (isset(window.requestFileSystem) ||
        isset(window.webkitRequestFileSystem));
}

LocalFile.createDir = function (pRootDirEntry, pFolders, fnSuccess, fnError) {
    if (pFolders[0] == '.' || pFolders[0] == '') {
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
    }, fnError || function (e) {
        error('createDir:: cannot create folder. error code(' + e.code + ')');
    });
};


/**
 * Копирование файлов.
 * @tparam DirectoryEntry pRootDirEntry
 * @tparam String sFrom
 * @tparam String sTo
 * @tparam Function fnSuccess
 * @tparam Function fnError
 */
LocalFile.copy = function (pRootDirEntry, sFrom, sTo, fnSuccess, fnError) {
    pRootDirEntry.getFile(sFrom, {}, function (fileEntry) {

        pRootDirEntry.getDirectory(sTo, {}, function (dirEntry) {
            fileEntry.copyTo(dirEntry, fnSuccess, fnError);
        }, fnError || function (e) {
            error('copy:: cannot get directory(' + sTo + '). error code(' +
                      e.code + ')');
        });

    }, fnError || function (e) {
        error('copy:: cannot get file(' + sFrom + '). error code('
                  + e.code + ')');
    });
};
    
