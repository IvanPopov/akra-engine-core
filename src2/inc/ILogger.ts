#ifndef ILOGGER_TS
#define ILOGGER_TS

module akra.util {
    
    #define UNKNOWN_CODE 0

	export enum ELogLevel {
        INFORMATION = 0x0001,
        LOG = 0x0002,
        WARNING = 0x0004,
        ERROR = 0x0008,
        CRITICAL = 0x0010,
        ALL = 0x001F

        // DEBUG_INFORMATION = 0x0020,
        // DEBUG_LOG = 0x0040,
        // DEBUG_WARNING = 0x0080,
        // DEBUG_ERROR = 0x0100,
        // DEBUG_CRITICAL = 0x0200,
        // DEBUG_ALL = 0x03E0
    }

    export interface ILogRoutineFunc {
        (...pArgs: any[]): void;
    }

    export interface ISourcePosition {
        file: string;
        line: uint;
    }

    export interface ILoggerEntity {
        code: uint;
        position: ISourcePosition;
        info?: Object;
        hint?: string;
        message?: string;
    }

    export interface ILogger {

        error(...pArgs: any[]): void;

        warning(eCode: uint, pLocation?: ISourcePosition, sHint?: string): void;
        warning(sMessage: string, pLocation?: ISourcePosition): void;
        warning(pEntity: ILoggerEntity): void;

        info(eCode: uint, pLocation?: ISourcePosition, sHint?: string): void;
        info(sMessage: string, pLocation?: ISourcePosition): void;
        info(pEntity: ILoggerEntity): void;

        critical_error():void;
        assert():void;

        log(...pArgs: any[]);

        formatMessage(eCode: uint, pEntity: ILoggerEntity): string;

        setLogLevel(eLevel: ELogLevel): bool;
        getLogLevel(): ELogLevel;

        init(): bool;
        ///**
        //* For plugin api:
        //* Load file with custom user codes and three messages 
        //*/
        //loadManifestFile(): bool;


        ///** For plugin API */
        //registerCode(eCode: uint, sMessage: string, sDebugMessage: string): bool;
        ///** For plugin API */
        //registerCodeFamily(sFamilyName:string): bool;
        /** 
        * logger.setLogRoutine(function(sMsg){console.log(sMsg)}, ELogLevel.INFORMATION | ELogLevel.DEBUG_INFORMATION);
        */
        setLogRoutine(fnLogRoutine: ILogRoutineFunc, eLevel: ELogLevel): bool;

        setSourceLocation(pLocation: ISourcePosition);

    }
}

#endif