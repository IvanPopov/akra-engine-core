/// <reference path="IEventProvider.ts" />
var akra;
(function (akra) {
    (function (EPipeTypes) {
        EPipeTypes[EPipeTypes["UNKNOWN"] = 0] = "UNKNOWN";

        EPipeTypes[EPipeTypes["WEBSOCKET"] = 1] = "WEBSOCKET";
        EPipeTypes[EPipeTypes["WEBWORKER"] = 2] = "WEBWORKER";
    })(akra.EPipeTypes || (akra.EPipeTypes = {}));
    var EPipeTypes = akra.EPipeTypes;

    (function (EPipeDataTypes) {
        EPipeDataTypes[EPipeDataTypes["BINARY"] = 0] = "BINARY";
        EPipeDataTypes[EPipeDataTypes["STRING"] = 1] = "STRING";
    })(akra.EPipeDataTypes || (akra.EPipeDataTypes = {}));
    var EPipeDataTypes = akra.EPipeDataTypes;
})(akra || (akra = {}));
//# sourceMappingURL=IPipe.js.map
