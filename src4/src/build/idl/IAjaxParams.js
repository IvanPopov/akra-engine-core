var akra;
(function (akra) {
    (function (EAjaxDataTypes) {
        EAjaxDataTypes[EAjaxDataTypes["TEXT"] = 0] = "TEXT";
        EAjaxDataTypes[EAjaxDataTypes["JSON"] = 1] = "JSON";
        EAjaxDataTypes[EAjaxDataTypes["BLOB"] = 2] = "BLOB";
        EAjaxDataTypes[EAjaxDataTypes["ARRAY_BUFFER"] = 3] = "ARRAY_BUFFER";
        EAjaxDataTypes[EAjaxDataTypes["DOCUMENT"] = 4] = "DOCUMENT";
    })(akra.EAjaxDataTypes || (akra.EAjaxDataTypes = {}));
    var EAjaxDataTypes = akra.EAjaxDataTypes;

    (function (EAjaxHttpMethods) {
        EAjaxHttpMethods[EAjaxHttpMethods["GET"] = 1] = "GET";
        EAjaxHttpMethods[EAjaxHttpMethods["POST"] = 2] = "POST";
    })(akra.EAjaxHttpMethods || (akra.EAjaxHttpMethods = {}));
    var EAjaxHttpMethods = akra.EAjaxHttpMethods;
    (function (EAjaxHttpCodes) {
        EAjaxHttpCodes[EAjaxHttpCodes["OK"] = 200] = "OK";
        EAjaxHttpCodes[EAjaxHttpCodes["CREATED"] = 201] = "CREATED";
        EAjaxHttpCodes[EAjaxHttpCodes["ACCEPTED"] = 202] = "ACCEPTED";
        EAjaxHttpCodes[EAjaxHttpCodes["PARTIAL_INFORMATION"] = 203] = "PARTIAL_INFORMATION";
        EAjaxHttpCodes[EAjaxHttpCodes["MOVED"] = 301] = "MOVED";
        EAjaxHttpCodes[EAjaxHttpCodes["FOUND"] = 302] = "FOUND";
        EAjaxHttpCodes[EAjaxHttpCodes["METHOD"] = 303] = "METHOD";
        EAjaxHttpCodes[EAjaxHttpCodes["NOT_MODIFIED"] = 304] = "NOT_MODIFIED";
        EAjaxHttpCodes[EAjaxHttpCodes["BAD_REQUEST"] = 400] = "BAD_REQUEST";
        EAjaxHttpCodes[EAjaxHttpCodes["UNAUTHORIZED"] = 401] = "UNAUTHORIZED";
        EAjaxHttpCodes[EAjaxHttpCodes["PAYMENT_REQUIRED"] = 402] = "PAYMENT_REQUIRED";
        EAjaxHttpCodes[EAjaxHttpCodes["FORBIDDEN"] = 403] = "FORBIDDEN";
        EAjaxHttpCodes[EAjaxHttpCodes["NOT_FOUND"] = 404] = "NOT_FOUND";
        EAjaxHttpCodes[EAjaxHttpCodes["INTERNAL_ERROR"] = 500] = "INTERNAL_ERROR";
        EAjaxHttpCodes[EAjaxHttpCodes["NOT_IMPLEMENTED"] = 501] = "NOT_IMPLEMENTED";
        EAjaxHttpCodes[EAjaxHttpCodes["SERVICE_TEMPORARILY_OVERLOADED"] = 502] = "SERVICE_TEMPORARILY_OVERLOADED";
        EAjaxHttpCodes[EAjaxHttpCodes["GATEWAY_TIMEOUT"] = 503] = "GATEWAY_TIMEOUT";
    })(akra.EAjaxHttpCodes || (akra.EAjaxHttpCodes = {}));
    var EAjaxHttpCodes = akra.EAjaxHttpCodes;
})(akra || (akra = {}));
//# sourceMappingURL=IAjaxParams.js.map
