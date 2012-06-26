/**
 * @file
 * @author Ivan Popov
 * @brief Базовые функции для чтения и записи удаленных файлов.
 * @email vantuziast@odserve.org
 */

/** @example RemoteFile.js
 * Пример использования данного класса.
 * В примере описаны базовые конструкции для синхронной и асинхронной
 * загрузко файла.
 */

/**
 * Файл на удаленном сервере, доступный по http протоколу.
 * @ctor
 * Конструктор.
 * @tparam String sServerUri Адресс ресурса на сервере(http).
 * @tparam Enumeration eDataType Тип данных.
 */
function RemoteFile () {

    Enum([
             STATE_UNKNOWN,
             STATE_IN_PROCESS,
             STATE_LOADED
         ], REMOTE_FILE_STATES, a.RemoteFile);

    Enum([
             TYPE_TEXT,
             TYPE_JSON,
             TYPE_BLOB,
             TYPE_ARRAY_BUFFER,
             TYPE_DOCUMENT
         ], REMOTE_FILE_TYPES, a.RemoteFile);

    /**
     * Содержимое файла.
     * @note В зависимости от настроект ajax, мб и JSON объектом.
     * @private
     * @type String/Object
     */
    this._pData = null;

    /**
     * Объект XHR, используемый в ajax запросах.
     * @private
     * @type XMLHttpRequest
     */
    this._pRequest = undefined;

    /**
     * Адресс ресурса на сервере(http), где будет осуществляться поиск файла.
     * @private
     * @type String
     */
    this._sServerUri = arguments[0] || '';
    /**
     * Параметры Ajax реквеста.
     * @private
     * @type Object
     */
    this._pSettings = {
        url:   null,
        async: false,
        cache: false//true
    };

    /**
     * Тип файла. (text/bin/xml/json/blob)
     * @private
     * @type Enumeration
     */
    this._eDataType = arguments[1] || a.RemoteFile.TYPE_TEXT;


    /**
     * Состояние файла.
     * @private
     */
    this._eState = a.RemoteFile.STATE_UNKNOWN;

}

/**
 * Задать тип данных удаленного файла.
 * @tparam Enumeration(REMOTE_FILE_TYPES) eDataType
 */
RemoteFile.prototype.setDataType = function (eDataType) {
    this._eDataType = eDataType;
};

/**
 * Использовать асинхронный метод получения файлов.
 * @tparam Function fnSuccess Функция, исполняемая при успешной загрузке файла.
 * @tparam Function fnError Функция, исполняемая при ошибке(HTTP_CODE != 200).
 */
RemoteFile.prototype.setAsync = function (fnSuccess, fnError) {
    var pSett = this._pSettings, me = this;
    pSett.success = function (pData, sStatusText, pXhr) {
        me._pData = pData;
        me._pRequest = pXhr;
        me._eState = a.RemoteFile.STATE_LOADED;

        if (fnSuccess) {
            fnSuccess(pData);
        }
    };
    if (fnError) {
        pSett.error = fnError;
    }
    else {
        pSett.error = function () {
            error('Cannot load remote file: ' + me.name());
        }
    }
    pSett.async = true;
};


/**
 * Использовать синхронный метод получения файлов.
 */
RemoteFile.prototype.setSync = function () {
    var pSett = this._pSettings;
    pSett.success = null;
    pSett.error = null;
    pSett.async = false;
};


/**
 * Имя файла.
 * @treturn String
 */
RemoteFile.prototype.name = function () {
    return a.File.getName(this._pSettings.url);
};


/**
 * Идентификатор ресурса файла.
 * @treturn String
 */
RemoteFile.prototype.uri = function () {
    url = this._pSettings.url;
    return (url ? url : this._sServerUri);
};

/**
 * Абсолютный путь к папке с файлом.
 * @treturn String
 */
RemoteFile.prototype.path = function () {

    return a.File.getPath(this._pSettings.url);
};

/**
 * @memberof RemoteFile
 * @property Boolean setRequestParameter(Object pSettings)
 * @tparam Object pSettings Обект с настройками.
 * @treturn Boolean
 */

/**
 * Выставить параметры Ajax запроса.
 * @tparam String sKey Имя параметра.
 * @tparam * pValue Значение параметра.
 * @treturn Boolean
 */
RemoteFile.prototype.setRequestParameter = function () {

    var dst = this._pSettings;
    if (arguments.length == 2) {
        dst[arguments[0]] = arguments[1];
        return true;
    }
    var src = arguments[0];
    for (var k in src) {
        dst[k] = src[k];
    }
    return true;
};

/**
 * @property open(sFile, fnSuccess, fnError = null)
 * Открыть файл.
 * @tparam String sFile Имя файла.
 * @tparam Function fnSuccess Функция.
 * @tparam Function fnError Функция.
 * @treturn Boolean
 */
/**
 * @property open(fnSuccess, fnError = null)
 * Открыть файл.
 * @tparam Function fnSuccess Функция.
 * @tparam Function fnError Функция.
 * @treturn Boolean
 */
/**
 * @property open(sFile)
 * Открыть файл.
 * @treturn Boolean
 */
/**
 * Открыть файл.
 * @treturn Boolean
 */
RemoteFile.prototype.open = function () {
    var sFile = (typeof arguments[0] == 'string' ? arguments[0] : '');
    var fnSuccess = (typeof arguments[0] == 'function' ? arguments[0] :
        ifndef(arguments[1], null));
    var fnError = (typeof arguments[0] == 'function' && arguments.length > 1 ?
        arguments[1] : ifndef(arguments[2], null));

    var pResult;
    var pSettings = this._pSettings;

    pSettings.url = this._sServerUri + (sFile.length ? '/' + sFile : '');
    pSettings.dataType = this._eDataType;
    if (fnSuccess) {
        this.setAsync(fnSuccess, fnError);
    }

    this._eState = a.RemoteFile.STATE_IN_PROCESS;
    pResult = a.ajax(pSettings, this._pRequest);

    if (pResult) {
        this._pData = pResult.data;
        this._pRequest = pResult.xhr;
        this._eState = a.RemoteFile.STATE_LOADED;
    }

    return (pResult ? true : false);
};

RemoteFile.prototype.state = function () {
    return this._eState;
};

/**
 * Считать файл.
 * @treturn * Содержиое файла.
 */
RemoteFile.prototype.read = function () {
    return this._pData;
};

a.RemoteFile = RemoteFile;