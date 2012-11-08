#ifndef ILOGGER_TS
#define ILOGGER_TS

module akra.util {

	export enum ELogLevel {
        NONE = 0x0000,
        LOG = 0x0001,
        INFORMATION = 0x0002,
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
        (pEntity: ILoggerEntity): void;
    }

    export interface ISourceLocation {
        file: string;
        line: uint;
    }

    export interface ILoggerEntity {
        code: uint;
        location: ISourceLocation;
        message?: string;
        info: any;        
    }

    export interface ILogger {
       
        ///**
        //* For plugin api:
        //* Load file with custom user codes and three messages 
        //*/
        //loadManifestFile(): bool;

        init(): bool;

        setLogLevel(eLevel: ELogLevel): void;
        getLogLevel(): ELogLevel;
        
        registerCode(eCode: uint, sMessage?: string): bool;
        setUnknownCode(eCode: uint, sMessage: string): void;

        registerCodeFamily(eCodeMin: uint, eCodeMax: uint, sFamilyName?: string): bool;

        getFamilyName(eCode: uint): string;

        setCodeFamilyRoutine(eCodeFromFamily: uint, fnLogRoutine: ILogRoutineFunc, eLevel: ELogLevel): bool;
        setCodeFamilyRoutine(sFamilyName: string, fnLogRoutine: ILogRoutineFunc, eLevel: ELogLevel): bool;

        setLogRoutine(fnLogRoutine: ILogRoutineFunc, eLevel: ELogLevel): void;

        setSourceLocation(sFile: string, iLine: uint): void;
        setSourceLocation(pLocation: ISourceLocation): void;

        // Print messages methods
        
        log(...pArgs: any[]);

        info(...pArgs: any[]): void;

        warning(...pArgs: any[]): void;

        error(...pArgs: any[]): void;

        critical_error(...pArgs: any[]):void;

        assert(bCondition: bool, ...pArgs: any[]):void;

    }
}

#endif