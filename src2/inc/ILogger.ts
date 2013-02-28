#ifndef ILOGGER_TS
#define ILOGGER_TS

module akra {

	export enum ELogLevel {
        NONE = 0x0000,
        LOG = 0x0001,
        INFORMATION = 0x0002,
        WARNING = 0x0004,
        ERROR = 0x0008,
        CRITICAL = 0x0010,
        ALL = 0x001F
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

        info(pEntity: ILoggerEntity): void;
        info(eCode: uint, ...pArgs: any[]): void;
        info(...pArgs: any[]): void;

        warning(pEntity: ILoggerEntity): void;
        warning(eCode: uint, ...pArgs: any[]): void;
        warning(...pArgs: any[]): void;

        error(pEntity: ILoggerEntity): void;
        error(eCode: uint, ...pArgs: any[]): void;
        error(...pArgs: any[]): void;

        criticalError(pEntity: ILoggerEntity): void;
        criticalError(eCode: uint, ...pArgs: any[]): void;
        criticalError(...pArgs: any[]):void;

        assert(bCondition: bool, pEntity: ILoggerEntity): void;
        assert(bCondition: bool, eCode: uint, ...pArgs: any[]): void;
        assert(bCondition: bool, ...pArgs: any[]):void;

    }
}

#endif