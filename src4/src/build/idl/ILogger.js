var akra;
(function (akra) {
    (function (ELogLevel) {
        ELogLevel[ELogLevel["NONE"] = 0x0000] = "NONE";
        ELogLevel[ELogLevel["LOG"] = 0x0001] = "LOG";
        ELogLevel[ELogLevel["INFORMATION"] = 0x0002] = "INFORMATION";
        ELogLevel[ELogLevel["WARNING"] = 0x0004] = "WARNING";
        ELogLevel[ELogLevel["ERROR"] = 0x0008] = "ERROR";
        ELogLevel[ELogLevel["CRITICAL"] = 0x0010] = "CRITICAL";
        ELogLevel[ELogLevel["ALL"] = 0x001F] = "ALL";
    })(akra.ELogLevel || (akra.ELogLevel = {}));
    var ELogLevel = akra.ELogLevel;
})(akra || (akra = {}));
//# sourceMappingURL=ILogger.js.map
