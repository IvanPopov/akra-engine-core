/// <reference path="logger.ts" />


module akra {

	export var debug: ILogger = new util.Logger();

	debug.init();
	debug.setUnknownCode(0, "unknown");
	debug.setLogLevel(ELogLevel.ALL);

	debug.registerCodeFamily(0, 100, "SystemCodes");

	//Default log routines

	function logRoutine(pLogEntity: ILoggerEntity): void {
		var pArgs: any[] = pLogEntity.info;
		pArgs.unshift("%c[D]", "color: gray;");
		console.log.apply(console, pArgs);
	}

	function warningRoutine(pLogEntity: ILoggerEntity): void {
		var pArgs: any[] = pLogEntity.info || [];

		var sCodeInfo: string = "%c[W]" + (pLogEntity.code != 0 ? " AE" + pLogEntity.code.toString() + ":": "") + " ";
		pArgs.unshift(sCodeInfo, "color: red;");

		console.warn.apply(console, pArgs);
	}

	function errorRoutine(pLogEntity: ILoggerEntity): void {
		var pArgs: any[] = pLogEntity.info || [];

		var sMessage: string = pLogEntity.message;
		var sCodeInfo: string = "[E]" + (pLogEntity.code != 0 ? " AE" + pLogEntity.code.toString() + ":" : "") + " ";

		pArgs.unshift("%c " + sCodeInfo, "color: red;", sMessage);

		console.error.apply(console, pArgs);
	}

	debug.setLogRoutine(logRoutine, ELogLevel.LOG | ELogLevel.INFORMATION);
	debug.setLogRoutine(warningRoutine, ELogLevel.WARNING);
	debug.setLogRoutine(errorRoutine, ELogLevel.ERROR | ELogLevel.CRITICAL);

}