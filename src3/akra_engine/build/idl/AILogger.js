// AILogger interface
// [write description here...]
var AELogLevel;
(function (AELogLevel) {
    AELogLevel[AELogLevel["NONE"] = 0x0000] = "NONE";
    AELogLevel[AELogLevel["LOG"] = 0x0001] = "LOG";
    AELogLevel[AELogLevel["INFORMATION"] = 0x0002] = "INFORMATION";
    AELogLevel[AELogLevel["WARNING"] = 0x0004] = "WARNING";
    AELogLevel[AELogLevel["ERROR"] = 0x0008] = "ERROR";
    AELogLevel[AELogLevel["CRITICAL"] = 0x0010] = "CRITICAL";
    AELogLevel[AELogLevel["ALL"] = 0x001F] = "ALL";
})(AELogLevel || (AELogLevel = {}));
//# sourceMappingURL=AILogger.js.map
