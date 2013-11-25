import cfg = require("config");
import Logger = require("logger/Logger");

var logger: AILogger = null;


logger = Logger.getInstance();

logger.init();
logger.setUnknownCode(cfg.unknown.code, cfg.unknown.message);
logger.setLogLevel(has("DEBUG") ? AELogLevel.ALL : AELogLevel.ERROR);

//Default code families

logger.registerCodeFamily(0, 100, "SystemCodes");
logger.registerCodeFamily(2000, 2199, "ParserSyntaxErrors");
logger.registerCodeFamily(2200, 2500, "EffectSyntaxErrors");

//Default log routines

function sourceLocationToString(pLocation: AISourceLocation): string {
    var pDate: Date = new Date;
    var sTime: string = pDate.getHours() + ":" + pDate.getMinutes() + "." + pDate.getSeconds();
    var sLocation: string = "[" + pLocation.file + ":" + pLocation.line.toString() + " " + sTime + "]: ";
    return sLocation;
}

function logRoutine(pLogEntity: AILoggerEntity): void {
    var pArgs: any[] = pLogEntity.info;

    var sLocation: string = sourceLocationToString(pLogEntity.location);

    if (isString(pArgs[0])) {
        pArgs[0] = sLocation + " " + pArgs[0];
    }
    else {
        pArgs.unshift(sLocation);
    }

    console["log"].apply(console, pArgs);
}

function warningRoutine(pLogEntity: AILoggerEntity): void {
    var pArgs: any[] = pLogEntity.info;

    var sCodeInfo: string = "Code: " + pLogEntity.code.toString() + ".";
    var sLocation: string = sourceLocationToString(pLogEntity.location);

    if (isString(pArgs[0])) {
        pArgs[0] = sLocation + " " + sCodeInfo + " " + pArgs[0];
    }
    else {
        pArgs.unshift(sLocation + " " + sCodeInfo);
    }

    console["warn"].apply(console, pArgs);
}

function errorRoutine(pLogEntity: AILoggerEntity): void {
    var pArgs: any[] = pLogEntity.info;

    var sMessage: string = pLogEntity.message;
    var sCodeInfo: string = "Error code: " + pLogEntity.code.toString() + ".";
    var sLocation: string = sourceLocationToString(pLogEntity.location);

    if (isString(pArgs[0])) {
        pArgs[0] = sLocation + " " + sCodeInfo + " " + sMessage + " " + pArgs[0];
    }
    else {
        pArgs.unshift(sLocation + " " + sCodeInfo + " " + sMessage);
    }

    console["error"].apply(console, pArgs);
}


logger.setLogRoutine(logRoutine, AELogLevel.LOG | AELogLevel.INFORMATION);
logger.setLogRoutine(warningRoutine, AELogLevel.WARNING);
logger.setLogRoutine(errorRoutine, AELogLevel.ERROR | AELogLevel.CRITICAL);

export = logger;