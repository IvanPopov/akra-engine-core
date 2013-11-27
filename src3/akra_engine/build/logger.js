define(["require", "exports", "config", "logger/Logger"], function(require, exports, __cfg__, __Logger__) {
    var cfg = __cfg__;
    var Logger = __Logger__;

    var logger = null;

    logger = Logger.getInstance();

    logger.init();
    logger.setUnknownCode(cfg.unknown.code, cfg.unknown.message);
    logger.setLogLevel(has("DEBUG") ? 31 /* ALL */ : 8 /* ERROR */);

    //Default code families
    logger.registerCodeFamily(0, 100, "SystemCodes");
    logger.registerCodeFamily(2000, 2199, "ParserSyntaxErrors");
    logger.registerCodeFamily(2200, 2500, "EffectSyntaxErrors");

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

    logger.setLogRoutine(logRoutine, 1 /* LOG */ | 2 /* INFORMATION */);
    logger.setLogRoutine(warningRoutine, 4 /* WARNING */);
    logger.setLogRoutine(errorRoutine, 8 /* ERROR */ | 16 /* CRITICAL */);

    
    return logger;
});
//# sourceMappingURL=logger.js.map
