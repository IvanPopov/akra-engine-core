/**
 * @file
 * @author Ivan Popov
 * @brief Локальный файл с синхронизацией с сервером.
 * @email vantuziast@odserve.org
 */

/** @example SynchroFile.js
 * Пример использования данного класса.
 * В примере описаны все события, параметры к ним и
 * возможные реакции на них.
 */

/**
 * @property SynchroFile(sServerUri, eDataType=TYPE_TEXT)
 * Constructor
 * @memberof SynchroFile
 * @tpram String sServerUri Идентификатор http ресурса с файлами.
 * @tparam Enumeration(SYNCHRO_FILE_TYPES) eDataType
 * @extends RemoteFile
 */
/**
 * SynchroFile класс для синхронизации удаленных файлов с локальными.
 * @ctor
 * Конструктор.
 * @extends RemoteFile
 */
function SynchroFile () {

    /**
     * @enum
     */
    Enum([
             MODE_ONLY_REMOTE,
             MODE_REMOTE_LOCAL
         ], SYNCHRO_FILE_MODES, a.SynchroFile);


    /**
     * @enum
     */
    Enum([
             HM_IF_AVALIABLE,
             HM_REPLACE
         ], SYNCHRO_FILE_HASH_MODES, a.SynchroFile);

    /**
     * @enum
     */
    Enum([
             TYPE_TEXT = 0,
             TYPE_ARRAY_BUFFER = 3,
         ], SYNCHRO_FILE_TYPES, a.SynchroFile);


    /**
     * @enum
     */
    Enum([
             FORMAT_JSON = 1,
             FORMAT_DOCUMENT = 4,
             FORMAT_DEFAULT = 0
         ], SYNCHRO_FILE_FORMATS, a.SynchroFile);

    /**
     * @enum
     */
    Enum([
             EVENT_FIRST_READING, /**< Первые данные, полученные из файла.
     (данные могут быть устаревшими!)*/
             EVENT_COMPLETE, /**< Успешное прочтение файла.
     (обязательно после попытки сверить кэш!)*/
             EVENT_FAILURE, /**< Не удалось открыть файл
     (ни локально, ни удаленно)*/
             EVENT_REMOTE_FILE_UNAVAILABLE, /**< Удаленный файл недоступен.*/
             EVENT_REMOTE_FILE_BEFORE_LOAD, /**< Перед загрузкой удаленного файла.
     (можно предотвратить загрузку,
     вернув false в обработчике)*/
             EVENT_HASH_MATCHED,
             EVENT_HASH_NOT_MATCHED,
             EVENT_HASH_NOT_AVAILABLE,
             EVENT_HASH_RECEIVED,
             EVENT_HASH_BEFORE_LOAD,
             EVENT_LOCAL_COPY_UNAVAILABLE,
             EVENT_LOCAL_COPY_DELETED,
             EVENT_LOCAL_COPY_BEFORE_UPDATE,
             EVENT_LOCAL_COPY_NOT_FOUND,
             EVENT_LOCAL_COPY_BEFORE_UPDATE,
             EVENT_LOCAL_COPY_UPDATED,
             EVENT_LOCAL_COPY_UPDATE_ERR,
             EVENT_LOCAL_PATH_NOT_FOUND,
             EVENT_LOCAL_PATH_BEFORE_CREATION,
             EVENT_LOCAL_PATH_CREATED
         ], SYNCHRO_FILE_EVENTS, a.SynchroFile);

    Define(a.SynchroFile.MAX_DL_ATTEMPTS, 1);
    Define(a.SynchroFile.isPrimaryEvent(e), function () {
        (e <= a.SynchroFile.EVENT_FAILURE)
    });

    /**
     * Текущий режим работы синхрофайла.(локально-удаленный/только удаленный)
     * @private
     * @type Enumeration(SYNCHRO_FILE_MODES)
     */
    this._eMode = (a.LocalFile.isSupported() ?
        a.SynchroFile.MODE_REMOTE_LOCAL : a.SynchroFile.MODE_ONLY_REMOTE);

    /**
     * Локальная копия удаленного файла.
     * @private
     * @type LocalFile
     */
    this._pLocalFile = (this._eMode ? new a.LocalFile : null);

    /**
     * Текущий режим проверки хэша.
     * @private
     */
    this._eHashMode = a.SynchroFile.HM_REPLACE;


    warn_assert(this._eMode, "Local filesystem unsupported.")
    SynchroFile.superclass.constructor.apply(this, arguments);
}

a.extend(SynchroFile, a.RemoteFile);


/**
 * Создание имени хеша, по имени файла.
 * @tparam String sFile Имя файла.
 * @treturn String
 */
SynchroFile.createHashName = function (sFile) {
    return sFile + '.md5';
}


/**
 * Открыть файл.
 * @tparam String sFile Имя файла.
 * @tparam Function fnCallback Функция, вызываемая на всех событиях.
 */
SynchroFile.prototype.open = function (sFile, fnCallback, eFormat) {
    eFormat = eFormat || a.SynchroFile.TYPE_TEXT;

    if (typeof eFormat == 'string') {
        eFormat = eFormat.toLowerCase();
        if (eFormat == 'json') {
            eFormat = a.SynchroFile.FORMAT_JSON;
        }
        else if (eFormat == 'document') {
            eFormat = a.SynchroFile.FORMAT_DOCUMENT;
        }
        else {
            error('Unsupported output format used: ' + eFormat + '.');
        }
    }

    var pLocal = this._pLocalFile;
    var pRemote = this;

    var fnUCallback = fnCallback || function (e) {
        debug_print(e);
    };

    fnCallback = function () {
        fnUCallback.apply(pRemote, arguments);
    };

    var fnConvert = function (pData) {
        if (typeof pData != 'string') {
            return pData;
        }
        switch (eFormat) {
            case a.SynchroFile.FORMAT_JSON:
                return a.parseJSON(pData);
            case a.SynchroFile.FORMAT_DOCUMENT:
                return a.toDOM(pData);
        }
        return pData;
    };

    if (!this._eMode) {
        fnCallback(a.SynchroFile.EVENT_LOCAL_COPY_UNAVAILABLE);

        if (fnCallback(a.SynchroFile.EVENT_REMOTE_FILE_BEFORE_LOAD) !== false) {
            return SynchroFile.superclass.open.apply(pRemote, [
                sFile,
                function () {
                    var pData = pRemote.read();
                    fnCallback(a.SynchroFile.EVENT_FIRST_READING, fnConvert(pData));
                    fnCallback(a.SynchroFile.EVENT_COMPLETE, fnConvert(pData));
                },
                function (e) {
                    fnCallback(a.SynchroFile.EVENT_LOCAL_COPY_UNAVAILABLE, e);
                }
            ]);
        }
    }

    pLocal.setDataType(pRemote._eDataType);

    var sLuri = a.File.getURL(this.uri());
    sLuri = (!sLuri.length ? document.URL : sLuri);
    var sLocalPath = '/tmp/' + String((sLuri + this.uri().substr(sLuri.length)))
        .replace(/[^a-zA-Z 0-9]+/g, '_') +
        (sFile.length && sFile.charCodeAt(0) != '/' ? '/' + sFile : sFile);

    var sLocalHash = null;
    var sRealHash = null;
    var isReadOnce = false;

    var fnCheckHash = function () {
        if (!sLocalHash || !sRealHash) {
            return;
        }

        if (sLocalHash == sRealHash) {
            fnCallback(a.SynchroFile.EVENT_HASH_MATCHED, sLocalHash);

            return true;
        }

        fnCallback(a.SynchroFile.EVENT_HASH_NOT_MATCHED, sRealHash, sLocalHash);
        return false;
    };

    var fnBufferToString = function (pBuffer) {
        var pBytes = new Uint8Array(pBuffer);
        var sRes = '';
        for (var n = 0; n < pBytes.length; ++n) {
            sRes += String.fromCharCode(pBytes[n]);
        }

        return sRes.fromUTF8();
    }

    var fnLocalOpenedRO = function () {

        pLocal.read(function (pData) {
            var sData = (pData instanceof ArrayBuffer ?
                fnBufferToString(pData) : pData);
            //console.log(fnConvert(pData));
            sLocalHash = sData.md5();

            var isOk = fnCheckHash();
            if (isOk) {
                fnCallback(a.SynchroFile.EVENT_COMPLETE, fnConvert(pData));
            }
            else {
                isReadOnce = true;
                fnCallback(a.SynchroFile.EVENT_FIRST_READING, fnConvert(pData));
            }

        });

        var sHashName = SynchroFile.createHashName(pRemote.uri() +
                                                       (sFile.length ? '/' + sFile : ''));
        var sDiffName = fnCallback(a.SynchroFile.EVENT_HASH_BEFORE_LOAD,
                                   sHashName);

        if (typeof sDiffName == 'string' && sDiffName.length) {
            sHashName = sDiffName;
        }

        var pHashFile = new a.RemoteFile(sHashName);

        pHashFile.setRequestParameter('statusCode', {
            404: function (e) {
                fnCallback(a.SynchroFile.EVENT_HASH_NOT_AVAILABLE);

                var nAttempts = a.SynchroFile.MAX_DL_ATTEMPTS;
                var fnLUFRErr = function () {
                    --nAttempts;
                    if (nAttempts) {
                        fnLocalUpdateFromRemote(fnLUFRErr);
                    }
                    else {
                        warning('exhausted the maximum number of attempts to ' +
                                    'synchronize the file');

                        fnCallback(a.SynchroFile.EVENT_REMOTE_FILE_UNAVAILABLE,
                                   pLocal.read(function (sData) {
                                       fnCallback(a.SynchroFile.EVENT_COMPLETE,
                                                  fnConvert(sData));
                                   }));
                    }
                };


                switch (pRemote._eHashMode) {
                    case a.SynchroFile.HM_IF_AVALIABLE:
                        pLocal.read(function (sData) {
                            fnCallback(a.SynchroFile.EVENT_COMPLETE,
                                       fnConvert(sData));

                            pLocal.remove(function () {
                                fnCallback(a.SynchroFile.EVENT_LOCAL_COPY_DELETED);
                            });
                        });

                        break;

                    case a.SynchroFile.HM_REPLACE:
                        fnLocalUpdateFromRemote(fnLUFRErr);
                        break;
                }
            }
        });


        pHashFile.open(function () {

            sRealHash = pHashFile.read();
            fnCallback(a.SynchroFile.EVENT_HASH_RECEIVED, sRealHash);

            var isOk = fnCheckHash();

            if (isOk) {
                //TODO return data with complete event.
                pLocal.read(function (sData) {
                    fnCallback(a.SynchroFile.EVENT_COMPLETE,
                               fnConvert(sData));
                });
            }
            else if (isOk === false) {
                fnLocalUpdateFromRemote(function (e) {
                    fnCallback(a.SynchroFile.EVENT_REMOTE_FILE_UNAVAILABLE,
                               null, e);
                })
            }
        });
    };

    var fnLocalUpdateFromRemote = function (fnFailure) {
        if (pRemote.state() == a.RemoteFile.LOADED) {
            fnRemoteLoaded(pRemote.read());
        }
        else {
            if (fnCallback(a.SynchroFile.EVENT_REMOTE_FILE_BEFORE_LOAD) !== false) {
                SynchroFile.superclass.open.apply(pRemote, [
                    sFile, fnRemoteLoaded,
                    fnFailure
                ]);
            }
        }
    };

    var fnLocalOpenedROErr = function (e) {
        if (e.code == FileError.NOT_FOUND_ERR) {

            fnCallback(a.SynchroFile.EVENT_LOCAL_COPY_NOT_FOUND);
            fnLocalUpdateFromRemote(function (e) {
                fnCallback(a.SynchroFile.EVENT_REMOTE_FILE_UNAVAILABLE, null, e);
                fnCallback(a.SynchroFile.EVENT_FAILURE, null, e);
            });
        }
        else {
            error('File error:: <' + sFile + '> with code:: ' + e.code);
        }
    };

    var fnRemoteLoaded = function (data) {

        if (!isReadOnce) {
            fnCallback(a.SynchroFile.EVENT_FIRST_READING, fnConvert(pRemote.read()));
        }

        if (fnCallback(a.SynchroFile.EVENT_LOCAL_COPY_BEFORE_UPDATE) === false) {
            return;
        }

        pLocal.open(sLocalPath, a.LocalFile.READ_WRITE, fnLocalOpenedRW,
                    fnLocalOpenedRWErr);
    };


    var fnLocalWritten = function () {
        fnCallback(a.SynchroFile.EVENT_LOCAL_COPY_UPDATED);
        fnCallback(a.SynchroFile.EVENT_COMPLETE,
                   fnConvert(pRemote.read()));
    };


    var fnLocalWrittenErr = function (e) {
        if (fnCallback(a.SynchroFile.EVENT_LOCAL_COPY_UPDATE_ERR, e) !== false) {
            error('local:: ERROR: cannot write file.');
        }
    };

    var fnLocalOpenedRW = function () {

        pLocal.clear(function () {
            pLocal.write(SynchroFile.superclass.read.apply(pRemote, []),
                         fnLocalWritten, fnLocalWrittenErr);
        });

    };

    var fnLocalOpenedRWErr = function (e) {
        if (e.code == FileError.NOT_FOUND_ERR) {
            if (fnCallback(a.SynchroFile.EVENT_LOCAL_PATH_NOT_FOUND) === false) {
                return;
            }

            var sLocalPath = pLocal.path().replace('\\', '/');
            var sDiffPath = fnCallback(a.SynchroFile.EVENT_LOCAL_PATH_BEFORE_CREATION,
                                       sLocalPath);

            if (typeof sDiffPath == 'string') {
                sLocalPath = sDiffPath;
            }

            var pFolders = sLocalPath.split('/');

            a.LocalFile.createDir(pLocal.fs().root, pFolders, function () {
                fnCallback(a.SynchroFile.EVENT_LOCAL_PATH_CREATED, sDiffPath);

                pLocal.open(sLocalPath + pLocal.name(),
                            a.LocalFile.READ_WRITE, fnLocalOpenedRW,
                            fnLocalOpenedRWErr);
            });
        }
        else if (fnCallback(a.SynchroFile.EVENT_LOCAL_COPY_UPDATE_ERR, e) !== false) {
            error('local:: cannot create file.');
        }
    };

    pLocal.open(sLocalPath, a.LocalFile.READ_ONLY, fnLocalOpenedRO, fnLocalOpenedROErr);
}


SynchroFile.prototype.localPath = function () {
    return this._pLocalFile.path();
}

SynchroFile.prototype.localName = function () {
    return this._pLocalFile.name();
}

a.SynchroFile = SynchroFile;