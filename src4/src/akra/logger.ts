/// <reference path="common.ts" />
/// <reference path="util/Logger.ts" />

module akra {
	//export var logger: ILogger = util.Logger.getInstance();
	export var logger: ILogger = new util.Logger();

	logger.init();
	logger.setUnknownCode(0, "unknown");
	logger.setLogLevel(ELogLevel.ALL);

	logger.registerCodeFamily(0, 100, "SystemCodes");

	//Default log routines

	function sourceLocationToString(pLocation: ISourceLocation): string {
		var pDate: Date = new Date;
		var sTime: string = pDate.getHours() + ":" + pDate.getMinutes() + "." + pDate.getSeconds();
		var sLocation: string = "[" + pLocation.file + ":" + pLocation.line.toString() + " " + sTime + "]: ";
		return sLocation;
	}

	function logRoutine(pLogEntity: ILoggerEntity): void {
		var pArgs: any[] = pLogEntity.info;

		var sLocation: string = sourceLocationToString(pLogEntity.location);

		if (isString(pArgs[0])) {
			pArgs[0] = sLocation + " " + pArgs[0];
		}
		else {
			pArgs.unshift(sLocation);
		}

		console.log.apply(console, pArgs);
	}

	function warningRoutine(pLogEntity: ILoggerEntity): void {
		var pArgs: any[] = pLogEntity.info;

		var sCodeInfo: string = "Code: " + pLogEntity.code.toString() + ".";
		var sLocation: string = sourceLocationToString(pLogEntity.location);

		if (isString(pArgs[0])) {
			pArgs[0] = sLocation + " " + sCodeInfo + " " + pArgs[0];
		}
		else {
			pArgs.unshift(sLocation + " " + sCodeInfo);
		}

		console.warn.apply(console, pArgs);
	}

	function errorRoutine(pLogEntity: ILoggerEntity): void {
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

		console.error.apply(console, pArgs);
	}

	logger.setLogRoutine(logRoutine, ELogLevel.LOG | ELogLevel.INFORMATION);
	logger.setLogRoutine(warningRoutine, ELogLevel.WARNING);
	logger.setLogRoutine(errorRoutine, ELogLevel.ERROR | ELogLevel.CRITICAL);
}
