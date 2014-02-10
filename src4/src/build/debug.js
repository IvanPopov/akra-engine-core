/// <reference path="logger.ts" />
var akra;
(function (akra) {
    akra.debug = new akra.util.Logger();

    akra.debug.init();
    akra.debug.setUnknownCode(0, "unknown");
    akra.debug.setLogLevel(31 /* ALL */);

    akra.debug.registerCodeFamily(0, 100, "SystemCodes");

    //Default log routines
    function logRoutine(pLogEntity) {
        var pArgs = pLogEntity.info;
        pArgs.unshift("%c[D]", "color: gray;");
        console.log.apply(console, pArgs);
    }

    function warningRoutine(pLogEntity) {
        var pArgs = pLogEntity.info || [];

        var sCodeInfo = "%c[W]" + (pLogEntity.code != 0 ? " AE" + pLogEntity.code.toString() + ":" : "") + " ";
        pArgs.unshift(sCodeInfo, "color: red;");

        console.warn.apply(console, pArgs);
    }

    function errorRoutine(pLogEntity) {
        var pArgs = pLogEntity.info || [];

        var sMessage = pLogEntity.message;
        var sCodeInfo = "[E]" + (pLogEntity.code != 0 ? " AE" + pLogEntity.code.toString() + ":" : "") + " ";

        pArgs.unshift("%c " + sCodeInfo, "color: red;", sMessage);

        console.error.apply(console, pArgs);
    }

    akra.debug.setLogRoutine(logRoutine, 1 /* LOG */ | 2 /* INFORMATION */);
    akra.debug.setLogRoutine(warningRoutine, 4 /* WARNING */);
    akra.debug.setLogRoutine(errorRoutine, 8 /* ERROR */ | 16 /* CRITICAL */);
})(akra || (akra = {}));
//# sourceMappingURL=debug.js.map
