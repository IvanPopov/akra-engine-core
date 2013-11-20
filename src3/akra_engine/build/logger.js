define(["require", "exports", "config", "logger/Logger"], function(require, exports, __cfg__, __Logger__) {
    var cfg = __cfg__;
    var Logger = __Logger__;

    exports.logger = null;

    exports.logger = Logger.getInstance();

    exports.logger.init();
    exports.logger.setUnknownCode(cfg.unknown.code, cfg.unknown.message);
    exports.logger.setLogLevel(has("DEBUG") ? 31 /* ALL */ : 8 /* ERROR */);

    //Default code families
    exports.logger.registerCodeFamily(0, 100, "SystemCodes");
    exports.logger.registerCodeFamily(2000, 2199, "ParserSyntaxErrors");
    exports.logger.registerCodeFamily(2200, 2500, "EffectSyntaxErrors");

    //Default log routines
    function sourceLocationToString(pLocation) {
        var pDate = new Date();
        var sTime = pDate.getHours() + ":" + pDate.getMinutes() + "." + pDate.getSeconds();
        var sLocation = "[" + pLocation.file + ":" + pLocation.line.toString() + " " + sTime + "]: ";
        return sLocation;
    }

    function logRoutine(pLogEntity) {
        var pArgs = pLogEntity.info;

        var sLocation = sourceLocationToString(pLogEntity.location);

        if (isString(pArgs[0])) {
            pArgs[0] = sLocation + " " + pArgs[0];
        } else {
            pArgs.unshift(sLocation);
        }

        console["log"].apply(console, pArgs);
    }

    function warningRoutine(pLogEntity) {
        var pArgs = pLogEntity.info;

        var sCodeInfo = "Code: " + pLogEntity.code.toString() + ".";
        var sLocation = sourceLocationToString(pLogEntity.location);

        if (isString(pArgs[0])) {
            pArgs[0] = sLocation + " " + sCodeInfo + " " + pArgs[0];
        } else {
            pArgs.unshift(sLocation + " " + sCodeInfo);
        }

        console["warn"].apply(console, pArgs);
    }

    function errorRoutine(pLogEntity) {
        var pArgs = pLogEntity.info;

        var sMessage = pLogEntity.message;
        var sCodeInfo = "Error code: " + pLogEntity.code.toString() + ".";
        var sLocation = sourceLocationToString(pLogEntity.location);

        if (isString(pArgs[0])) {
            pArgs[0] = sLocation + " " + sCodeInfo + " " + sMessage + " " + pArgs[0];
        } else {
            pArgs.unshift(sLocation + " " + sCodeInfo + " " + sMessage);
        }

        console["error"].apply(console, pArgs);
    }

    exports.logger.setLogRoutine(logRoutine, 1 /* LOG */ | 2 /* INFORMATION */);
    exports.logger.setLogRoutine(warningRoutine, 4 /* WARNING */);
    exports.logger.setLogRoutine(errorRoutine, 8 /* ERROR */ | 16 /* CRITICAL */);

    exports.log = exports.logger.log.bind(exports.logger);
    exports.warn = exports.logger.warn.bind(exports.logger);
    exports.error = exports.logger.error.bind(exports.logger);
    exports.critical = exports.logger.critical.bind(exports.logger);
    exports.info = exports.logger.info.bind(exports.logger);
    exports.assert = exports.logger.assert.bind(exports.logger);
    exports.presume = exports.logger.presume.bind(exports.logger);
});
//# sourceMappingURL=logger.js.map
