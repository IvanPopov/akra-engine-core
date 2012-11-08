#ifndef LOGGER_INIT_TS
#define LOGGER_INIT_TS

#include "common.ts"
#include "util/Logger.ts"

#define UNKNOWN_CODE 0
#define UNKONWN_MESSAGE "Unknown code."

module akra {
	export var logger: util.ILogger = new util.Logger();

	logger.init();
	logger.setUnknownCode(UNKNOWN_CODE, UNKONWN_MESSAGE);
    

	//Default code families
    
    logger.registerCodeFamily(0, 100, "SystemCodes");
    logger.registerCodeFamily(2000, 2199, "ParserSyntaxErrors");
    logger.registerCodeFamily(2200, 2500, "EffectSyntaxErrors");
   
    //Default log routines

    function sourceLocationToString(pLocation: util.ISourceLocation): string {
        var sLocation:string = "[" + pLocation.file + ":" + pLocation.line.toString() + "]: ";
        return sLocation;
    }

    function logRoutine(pLogEntity: util.ILoggerEntity): void{
        var pArgs:any[] = pLogEntity.info;
        
        pArgs.unshift(sourceLocationToString(pLogEntity.location));
        
        console["log"].apply(console, pArgs);
    }

    function warningRoutine(pLogEntity: util.ILoggerEntity): void{
        var pArgs:any[] = pLogEntity.info; 

        pArgs.unshift("Code: " + pLogEntity.code.toString());
        pArgs.unshift(sourceLocationToString(pLogEntity.location));
        
        console["warning"].apply(console, pArgs);    
    }

    function errorRoutine(pLogEntity: util.ILoggerEntity): void{
        var pArgs:any[] = pLogEntity.info; 

        pArgs.unshift(pLogEntity.message);
        pArgs.unshift("Error code: " + pLogEntity.code.toString() + ".");
        pArgs.unshift(sourceLocationToString(pLogEntity.location));
        
        console["error"].apply(console, pArgs);    
    }

    

    logger.setLogRoutine(logRoutine, util.ELogLevel.LOG | 
                                     util.ELogLevel.INFO);

    logger.setLogRoutine(warningRoutine, util.ELogLevel.WARNING);
    
    logger.setLogRoutine(errorRoutine, util.ELogLevel.ERROR | 
                                       util.ELogLevel.CRITICAL | 
                                       util.ELogLevel.ASSERT);

}

#endif