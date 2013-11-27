// AIPipe interface
// [write description here...]
var AEPipeTypes;
(function (AEPipeTypes) {
    AEPipeTypes[AEPipeTypes["UNKNOWN"] = 0] = "UNKNOWN";

    AEPipeTypes[AEPipeTypes["WEBSOCKET"] = 1] = "WEBSOCKET";
    AEPipeTypes[AEPipeTypes["WEBWORKER"] = 2] = "WEBWORKER";
})(AEPipeTypes || (AEPipeTypes = {}));

var AEPipeDataTypes;
(function (AEPipeDataTypes) {
    AEPipeDataTypes[AEPipeDataTypes["BINARY"] = 0] = "BINARY";
    AEPipeDataTypes[AEPipeDataTypes["STRING"] = 1] = "STRING";
})(AEPipeDataTypes || (AEPipeDataTypes = {}));
//# sourceMappingURL=AIPipe.js.map
