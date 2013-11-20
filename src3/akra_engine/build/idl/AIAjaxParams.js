// AIAjaxParams interface
// [write description here...]
var AEAjaxDataTypes;
(function (AEAjaxDataTypes) {
    AEAjaxDataTypes[AEAjaxDataTypes["TEXT"] = 0] = "TEXT";
    AEAjaxDataTypes[AEAjaxDataTypes["JSON"] = 1] = "JSON";
    AEAjaxDataTypes[AEAjaxDataTypes["BLOB"] = 2] = "BLOB";
    AEAjaxDataTypes[AEAjaxDataTypes["ARRAY_BUFFER"] = 3] = "ARRAY_BUFFER";
    AEAjaxDataTypes[AEAjaxDataTypes["DOCUMENT"] = 4] = "DOCUMENT";
})(AEAjaxDataTypes || (AEAjaxDataTypes = {}));

var AEAjaxHttpMethods;
(function (AEAjaxHttpMethods) {
    AEAjaxHttpMethods[AEAjaxHttpMethods["GET"] = 1] = "GET";
    AEAjaxHttpMethods[AEAjaxHttpMethods["POST"] = 2] = "POST";
})(AEAjaxHttpMethods || (AEAjaxHttpMethods = {}));
var AEAjaxHttpCodes;
(function (AEAjaxHttpCodes) {
    AEAjaxHttpCodes[AEAjaxHttpCodes["OK"] = 200] = "OK";
    AEAjaxHttpCodes[AEAjaxHttpCodes["CREATED"] = 201] = "CREATED";
    AEAjaxHttpCodes[AEAjaxHttpCodes["ACCEPTED"] = 202] = "ACCEPTED";
    AEAjaxHttpCodes[AEAjaxHttpCodes["PARTIAL_INFORMATION"] = 203] = "PARTIAL_INFORMATION";
    AEAjaxHttpCodes[AEAjaxHttpCodes["MOVED"] = 301] = "MOVED";
    AEAjaxHttpCodes[AEAjaxHttpCodes["FOUND"] = 302] = "FOUND";
    AEAjaxHttpCodes[AEAjaxHttpCodes["METHOD"] = 303] = "METHOD";
    AEAjaxHttpCodes[AEAjaxHttpCodes["NOT_MODIFIED"] = 304] = "NOT_MODIFIED";
    AEAjaxHttpCodes[AEAjaxHttpCodes["BAD_REQUEST"] = 400] = "BAD_REQUEST";
    AEAjaxHttpCodes[AEAjaxHttpCodes["UNAUTHORIZED"] = 401] = "UNAUTHORIZED";
    AEAjaxHttpCodes[AEAjaxHttpCodes["PAYMENT_REQUIRED"] = 402] = "PAYMENT_REQUIRED";
    AEAjaxHttpCodes[AEAjaxHttpCodes["FORBIDDEN"] = 403] = "FORBIDDEN";
    AEAjaxHttpCodes[AEAjaxHttpCodes["NOT_FOUND"] = 404] = "NOT_FOUND";
    AEAjaxHttpCodes[AEAjaxHttpCodes["INTERNAL_ERROR"] = 500] = "INTERNAL_ERROR";
    AEAjaxHttpCodes[AEAjaxHttpCodes["NOT_IMPLEMENTED"] = 501] = "NOT_IMPLEMENTED";
    AEAjaxHttpCodes[AEAjaxHttpCodes["SERVICE_TEMPORARILY_OVERLOADED"] = 502] = "SERVICE_TEMPORARILY_OVERLOADED";
    AEAjaxHttpCodes[AEAjaxHttpCodes["GATEWAY_TIMEOUT"] = 503] = "GATEWAY_TIMEOUT";
})(AEAjaxHttpCodes || (AEAjaxHttpCodes = {}));
//# sourceMappingURL=AIAjaxParams.js.map
