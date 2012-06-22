/**
 * @file
 * @author Ivan Popov
 * @brief Ajax API
 * @email vantuziast@odserve.org
 */

/** @example Ajax.js
 * Пример использования данного API.
 */

/**
 * @enum
 */
Enum(
    [
        OK = 200,
        CREATED,
        ACCEPTED,
        PARTIAL_INFORMATION,
        MOVED = 301,
        FOUND,
        METHOD,
        NOT_MODIFIED = 304,
        BAD_REQUEST = 400,
        UNAUTHORIZED,
        PAYMENT_REQUIRED,
        FORBIDDEN,
        NOT_FOUND,
        INTERNAL_ERROR = 500,
        NOT_IMPLEMENTED,
        SERVICE_TEMPORARILY_OVERLOADED,
        GATEWAY_TIMEOUT
    ], HTTP_STATUS_CODES, a.HTTP_STATUS_CODE);

/**
 * @enum
 */
Enum(
    [
        GET = 1,
        POST
    ], HTTP_METHODS, a.HTTP_METHOD);

/**
 * @enum
 */
Enum(
    [
        TYPE_TEXT,
        TYPE_JSON,
        TYPE_BLOB,
        TYPE_ARRAY_BUFFER,
        TYPE_DOCUMENT,
    ], AJAX_DATA_TYPES, a.Ajax);

/**
 * Ajax "GET" запрос.
 * @tparam String sUrl
 * @tparam Object pData
 * @tparam Function fnSuccess
 * @tparam Enumeration(AJAX_DATA_TYPES)/String eDataType
 */
a.get = function (sUrl, pData, fnSuccess, eDataType) {
    return a.ajax({
                      url:      sUrl,
                      data:     pData,
                      success:  fnSuccess,
                      dataType: eDataType
                  });
};

a.require = function (sUrl) {
    eval(a.ajax({
                    url:   sUrl,
                    async: false
                }).data);
};

/**
 * Сериализация объекта в query string.
 * @tparam Object pObj Объект для сериализации.
 * @tparam String sPrefix Использовать префикс(не обязательно).
 * @treturn String
 */
a.queryString = function (pObj, sPrefix) {
    if (typeof pObj == 'string') {
        return pObj;
    }

    var str = [];
    for (var p in pObj) {
        var k = sPrefix ? sPrefix + "[" + p + "]" : p, v = pObj[p];
        str.push(typeof v == "object" ?
                     a.queryString(v, k) :
                     encodeURIComponent(k) + "=" + encodeURIComponent(v));
    }

    return str.join("&");
}

/**
 * Аякс запрос.
 * @tparam Object pSettings Объект настроект может
 * содержать следующие поля:
 * String               url
 * Boolean              async
 * Object               statusCode
 * Function             success
 * Function             error
 * Function             beforeSend
 * Object               data
 * Boolean              cache
 * String               contentType
 * Enumeration(String)  dataType
 * Enumeration(String)  type
 *
 * @treturn XMLHttpRequest
 */
a.ajax = function (pSettings, pRequest) {
    var sUrl = ifndef(pSettings.url, '');
    var isAsync = ifndef(pSettings.async, true);
    var pStatusCode = ifndef(pSettings.statusCode, {});
    var fnSuccess = ifndef(pSettings.success, null);
    var fnError = ifndef(pSettings.error, null);
    var fnBeforeSend = ifndef(pSettings.beforeSend, null);
    var pData = ifndef(pSettings.data, {}), sQueryString;
    var useCache = ifndef(pSettings.cache, false);
    var sContentType = ifndef(pSettings.contentType,
                              "application/x-www-form-urlencoded");
    var eDataType = ifndef(pSettings.dataType, a.Ajax.TYPE_TEXT);
    var eMethod = ifndef(pSettings.type, a.HTTP_METHOD.GET);
    var nTimeout = ifndef(pSettings.timeout, 0);
    var iTimeoutId = null;
    var isAborted = false;

    if (typeof eMethod == 'string') {
        eMethod = eMethod.toLowerCase();
        if (eMethod == 'get') {
            eMethod = a.HTTP_METHOD.GET;
        }
        else if (eMethod == 'post') {
            eMethod = a.HTTP_METHOD.POST;
        }
    }

    if (typeof eDataType == 'string') {
        eDataType = eDataType.toLowerCase();

        switch (eDataType) {
            case 'json':
                eDataType = a.Ajax.TYPE_JSON;
                break;
            case 'blob':
                eDataType = a.Ajax.TYPE_BLOB;
                break;
            case 'html':
            case 'document':
                eDataType = a.Ajax.TYPE_DOCUMENT;
                break;
            case 'array_buffer':
            case 'arraybuffer':
                eDataType = a.Ajax.TYPE_ARRAY_BUFFER;
                break;
            default:
                eDataType = a.Ajax.TYPE_TEXT;
        }
    }

    var fnInitRequest = function () {
        if (window.XMLHttpRequest) {
            return new XMLHttpRequest();
        }
        else if (window.ActiveXObject) {
            return new ActiveXObject("Microsoft.XMLHTTP");
        }
        return null;
    };

    var fnConvData = function (pReq) {
        switch (eDataType) {
            case a.Ajax.TYPE_TEXT:
                return window.String(pReq.responseText);
            case a.Ajax.TYPE_JSON:
                return a.parseJSON(pReq.responseText);
            case a.Ajax.TYPE_BLOB:
                return (isAsync ? pReq.response :
                    (new BlobBuilder()).append(pReq.responseText));
            case a.Ajax.TYPE_ARRAY_BUFFER:
                return (isAsync ? (pReq.response) : pReq.responseText);
            case a.Ajax.TYPE_DOCUMENT:
                return (isAsync ? pReq.response : a.toDOM(pReq.responseText));
        }
    };

    var fnProcRequest = function () {
        if (isAborted) {
            return;
        }
        if (pRequest.readyState == this.HEADERS_RECEIVED) {
            if (nTimeout > 0) {
                clearTimeout(iTimeoutId);
            }
        }
        if (pRequest.readyState == this.DONE) {
            var iStatusCode = pRequest.status;

            var fnStatusHandler = pStatusCode[iStatusCode];
            if (fnStatusHandler) {
                fnStatusHandler();
            }

            fnBeforeResult();
            if (iStatusCode == a.HTTP_STATUS_CODE.OK) {
                if (fnSuccess) {
                    fnSuccess(fnConvData(pRequest), pRequest.textStatus,
                              pRequest);
                }
            }
            else if (!fnStatusHandler) {
                fnCauseError(pRequest, new Error('Request is not completed ' +
                                                     'successfully'));
            }
        }
    };

    var fnCauseError = function (pReq, pErr) {
        if (!fnError) {
            throw pErr;
        }
        else {
            fnError(pReq, (pReq ? pReq.textStatus : null), pErr);
        }
    }

    var fnResponseType = function (eDataType) {
        switch (eDataType) {
            case a.Ajax.TYPE_BLOB:
                return 'blob';
            case a.Ajax.TYPE_ARRAY_BUFFER:
                return 'arraybuffer';
            case a.Ajax.TYPE_DOCUMENT:
                return 'document';
            case a.Ajax.TYPE_TEXT:
                return 'text';
        }
        return '';
    };

    var fnBeforeResult = function () {
        if (iTimeoutId !== null) {
            clearTimeout(iTimeoutId);
        }
    }

    pRequest = pRequest || fnInitRequest();
    pRequest.onreadystatechange = fnProcRequest;


    if (!pRequest) {
        fnCauseError(null, new Error('Invalid request object.'));
    }

    if (nTimeout > 0) {
        iTimeoutId = setTimeout(function () {
            isAborted = true;
            pRequest.abort();
            fnCauseError(pRequest, new Error('Timeout is over.'));
        }, nTimeout);
    }

    if (fnBeforeSend) {
        if (!fnBeforeSend(pRequest, pSettings)) {
            return null;
        }
    }

    if (!useCache) {
        pData['TIMESTAMP'] = (new Date()).getTime();
    }

    sQueryString = a.queryString(pData);

    if (isAborted) {
        return null;
    }

    if (isAsync) {
        try {
            (eMethod == a.HTTP_METHOD.GET ?
                function () {
                    pRequest.open('GET', sUrl +
                        (sQueryString.length ? '?' + sQueryString : ''), true);
                    pRequest.responseType = fnResponseType(eDataType);
                    pRequest.send(null);
                }
                : function () {
                pRequest.open("POST", sUrl, true);
                pRequest.setRequestHeader("Content-Type", sContentType);
                pRequest.responseType = fnResponseType(eDataType);
                pRequest.send(sQueryString);

            })();
        }
        catch (e) {
            fnCauseError(pRequest, e);
        }
    }
    else {
        return (eMethod == a.HTTP_METHOD.GET ?
            function () {
                pRequest.open('GET', sUrl + '?' + sQueryString, false);
                pRequest.send(null);
                fnBeforeResult();
                return {
                    data:       fnConvData(pRequest),
                    textStatus: pRequest.textStatus,
                    xhr:        pRequest
                };
            }
            : function () {
            pRequest.open('POST', sUrl, false);
            pRequest.setRequestHeader("Content-type", sContentType);
            pRequest.send(sQueryString);
            fnBeforeResult();
            return {
                data:       fnConvData(pRequest),
                textStatus: pRequest.textStatus,
                xhr:        pRequest
            };
        })();
    }
    return null;
}