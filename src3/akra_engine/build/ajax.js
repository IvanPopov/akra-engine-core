/// <reference path="idl/AIAjaxParams.ts" />
define(["require", "exports", "config", "conv", "logger", "time"], function(require, exports, __config__, __conv__, __logger__, __time__) {
    var config = __config__;
    var conv = __conv__;
    var logger = __logger__;
    var time = __time__;

    var pDefaulParams = config.ajax;

    function stringToHttpMethod(sMethod) {
        if (sMethod.toLowerCase() === "get") {
            return 1 /* GET */;
        }

        return 2 /* POST */;
    }

    function stringToAjaxDataType(sDataType) {
        switch (sDataType.toLowerCase()) {
            case "json":
                return 1 /* JSON */;
            case "blob":
                return 2 /* BLOB */;
            case "html":
            case "document":
                return 4 /* DOCUMENT */;
            case "array_buffer":
            case "arraybuffer":
                return 3 /* ARRAY_BUFFER */;
        }

        return 0 /* TEXT */;
    }

    function ajaxDataTypeToXHRResponseType(eDataType) {
        switch (eDataType) {
            case 2 /* BLOB */:
                return "blob";
            case 3 /* ARRAY_BUFFER */:
                return "arraybuffer";
            case 4 /* DOCUMENT */:
                return "document";
            case 0 /* TEXT */:
                return "text";
        }

        return "";
    }

    function createXMLHttpRequest() {
        if ((window).XMLHttpRequest) {
            return new XMLHttpRequest();
        } else if ((window).ActiveXObject) {
            return new ActiveXObject("Microsoft.XMLHTTP");
        }

        return null;
    }

    function queryString(pData, sPrefix) {
        if (typeof sPrefix === "undefined") { sPrefix = null; }
        if (isString(pData)) {
            return pData;
        }

        var pQueryParts = [];

        for (var p in pData) {
            var k = sPrefix ? sPrefix + "[" + p + "]" : p, v = pData[p];

            pQueryParts.push(isObject(v) ? queryString(v, k) : encodeURIComponent(k) + "=" + encodeURIComponent(v));
        }

        return pQueryParts.join("&");
    }

    function convertXHRResponse(pRequest, eType, isAsync) {
        switch (eType) {
            case 0 /* TEXT */:
                return String(pRequest.responseText);
            case 1 /* JSON */:
                return conv.parseJSON(pRequest.responseText);
            case 2 /* BLOB */:
                return (isAsync ? pRequest.response : (new Blob([pRequest.responseText], { type: "application/octet-stream" })));
            case 3 /* ARRAY_BUFFER */:
                return (isAsync ? (pRequest.response) : pRequest.responseText);
            case 4 /* DOCUMENT */:
                return (isAsync ? pRequest.response : conv.parseHTML(pRequest.responseText));
        }

        return null;
    }

    function ajax(pUrl, pSettings, pRequest) {
        var iTimeoutId = 0;
        var isAborted = false;
        var sQueryString;
        var pData;
        var sUrl;

        if (isString(arguments[0])) {
            sUrl = String(arguments[0]);
            pSettings = arguments[1] || {};
            pRequest = arguments[2];
            pSettings.url = sUrl;
        } else {
            pSettings = arguments[0];
            pRequest = arguments[1];
        }

        pData = pSettings.data || {};

        for (var sKey in pDefaulParams) {
            if (isDef(pSettings[sKey])) {
                continue;
            }

            pSettings[sKey] = pDefaulParams[sKey];
        }

        if (isString(pSettings.type)) {
            pSettings.type = stringToHttpMethod(pSettings.type);
        }

        if (isString(pSettings.dataType)) {
            pSettings.dataType = stringToAjaxDataType(pSettings.dataType);
        }

        var fnCauseError = function (pReq, pErr) {
            if (!pSettings.error) {
                logger.error(pErr);
            } else {
                pSettings.error(pReq, (pReq ? pReq.statusText : null), pErr);
            }
        };

        var fnBeforeResult = function () {
            if (iTimeoutId !== null) {
                clearTimeout(iTimeoutId);
            }
        };

        pRequest = pRequest || createXMLHttpRequest();

        if (!pRequest) {
            fnCauseError(null, new Error("Invalid request object."));
        }

        if (pSettings.timeout > 0) {
            iTimeoutId = setTimeout(function () {
                isAborted = true;
                pRequest.abort();
                fnCauseError(pRequest, new Error("Timeout is over."));
            }, pSettings.timeout);
        }

        if (pSettings.beforeSend) {
            if (!pSettings.beforeSend(pRequest, pSettings)) {
                return null;
            }
        }

        if (pSettings.cache) {
            pData["TIMESTAMP"] = time();
        }

        sQueryString = queryString(pData);

        pRequest.onreadystatechange = function () {
            if (isAborted) {
                return;
            }

            if (pRequest.readyState == this.HEADERS_RECEIVED) {
                if (pSettings.timeout > 0) {
                    clearTimeout(iTimeoutId);
                }
            }

            if (pRequest.readyState == this.DONE) {
                var iStatusCode = pRequest.status;
                var fnStatusHandler = pSettings.statusCode[iStatusCode];

                if (isDefAndNotNull(fnStatusHandler)) {
                    fnStatusHandler(pRequest.status);
                }

                fnBeforeResult();

                if (iStatusCode == 200 /* OK */) {
                    if (pSettings.success) {
                        pSettings.success(convertXHRResponse(pRequest, pSettings.dataType, true), pRequest.statusText, pRequest);
                    }
                } else if (!fnStatusHandler) {
                    fnCauseError(pRequest, new Error("Request is not completed successfully (code: " + iStatusCode + ")"));
                }
            }
        };

        if (isAborted) {
            return null;
        }

        if (pSettings.async) {
            try  {
                if (pSettings.type == 1 /* GET */) {
                    pRequest.open("GET", pSettings.url + (sQueryString.length ? "?" + sQueryString : ""), true);
                    pRequest.responseType = ajaxDataTypeToXHRResponseType(pSettings.dataType);
                    pRequest.send(null);
                } else {
                    pRequest.open("POST", pSettings.url, true);
                    pRequest.setRequestHeader("Content-Type", pSettings.contentType);
                    pRequest.responseType = ajaxDataTypeToXHRResponseType(pSettings.dataType);
                    pRequest.send(sQueryString);
                }
            } catch (e) {
                fnCauseError(pRequest, e);
            }
        } else {
            if (pSettings.type == 1 /* GET */) {
                pRequest.open("GET", pSettings.url + "?" + sQueryString, false);
                pRequest.send(null);
            } else {
                pRequest.open("POST", pSettings.url, false);
                pRequest.setRequestHeader("Content-type", pSettings.contentType);
                pRequest.send(sQueryString);
            }

            fnBeforeResult();

            return {
                data: convertXHRResponse(pRequest, pSettings.dataType, false),
                statusText: pRequest.statusText,
                xhr: pRequest
            };
        }

        return null;
    }

    
    return ajax;
});
//# sourceMappingURL=ajax.js.map
