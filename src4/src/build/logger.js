/// <reference path="common.ts" />
/// <reference path="util/Logger.ts" />
var akra;
(function (akra) {
    //export var logger: ILogger = util.Logger.getInstance();
    akra.logger = new akra.util.Logger();

    akra.logger.init();
    akra.logger.setUnknownCode(0, "unknown");
    akra.logger.setLogLevel(31 /* ALL */);

    akra.logger.registerCodeFamily(0, 100, "SystemCodes");

    //Default log routines
    function logRoutine(pLogEntity) {
        var pArgs = pLogEntity.info;

        console.log.apply(console, pArgs);
    }

    function warningRoutine(pLogEntity) {
        var pArgs = pLogEntity.info || [];

        var sCodeInfo = "%cwarning" + (pLogEntity.code != 0 ? " AE" + pLogEntity.code.toString() : "") + ":";
        pArgs.unshift(sCodeInfo, "color: red;");

        console.warn.apply(console, pArgs);
    }

    function errorRoutine(pLogEntity) {
        var pArgs = pLogEntity.info || [];

        var sMessage = pLogEntity.message;
        var sCodeInfo = "error" + (pLogEntity.code != 0 ? " AE" + pLogEntity.code.toString() : "") + ":";

        pArgs.unshift("%c " + sCodeInfo, "color: red;", sMessage);

        console.error.apply(console, pArgs);
    }

    akra.logger.setLogRoutine(logRoutine, 1 /* LOG */ | 2 /* INFORMATION */);
    akra.logger.setLogRoutine(warningRoutine, 4 /* WARNING */);
    akra.logger.setLogRoutine(errorRoutine, 8 /* ERROR */ | 16 /* CRITICAL */);
})(akra || (akra = {}));
//# sourceMappingURL=logger.js.map
