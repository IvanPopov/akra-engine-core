// AILogger interface
// [write description here...]

enum AELogLevel {
	NONE = 0x0000,
	LOG = 0x0001,
	INFORMATION = 0x0002,
	WARNING = 0x0004,
	ERROR = 0x0008,
	CRITICAL = 0x0010,
	ALL = 0x001F
}

interface AILogRoutineFunc {
	(pEntity: AILoggerEntity): void;
}

interface AISourceLocation {
	file: string;
	line: uint;
}

interface AILoggerEntity {
	code: uint;
	location: AISourceLocation;
	message?: string;
	info: any;		
}

interface AILogger {

    ///**
    //* For plugin api:
    //* Load file with custom user codes and three messages 
    //*/
    //loadManifestFile(): boolean;

    init(): boolean;

    setLogLevel(eLevel: AELogLevel): void;
    getLogLevel(): AELogLevel;

    registerCode(eCode: uint, sMessage?: string): boolean;
    setUnknownCode(eCode: uint, sMessage: string): void;

    registerCodeFamily(eCodeMin: uint, eCodeMax: uint, sFamilyName?: string): boolean;

    getFamilyName(eCode: uint): string;

    setCodeFamilyRoutine(eCodeFromFamily: uint, fnLogRoutine: AILogRoutineFunc, eLevel: AELogLevel): boolean;
    setCodeFamilyRoutine(sFamilyName: string, fnLogRoutine: AILogRoutineFunc, eLevel: AELogLevel): boolean;

    setLogRoutine(fnLogRoutine: AILogRoutineFunc, eLevel: AELogLevel): void;

    setSourceLocation(sFile: string, iLine: uint): void;
    setSourceLocation(pLocation: AISourceLocation): void;

    // Print messages methods

    log(...pArgs: any[]);

    info(pEntity: AILoggerEntity): void;
    info(eCode: uint, ...pArgs: any[]): void;
    info(...pArgs: any[]): void;

    warn(pEntity: AILoggerEntity): void;
    warn(eCode: uint, ...pArgs: any[]): void;
    warn(...pArgs: any[]): void;

    error(pEntity: AILoggerEntity): void;
    error(eCode: uint, ...pArgs: any[]): void;
    error(...pArgs: any[]): void;

    critical(pEntity: AILoggerEntity): void;
    critical(eCode: uint, ...pArgs: any[]): void;
    critical(...pArgs: any[]): void;

    assert(bCondition: boolean, pEntity: AILoggerEntity): void;
    assert(bCondition: boolean, eCode: uint, ...pArgs: any[]): void;
    assert(bCondition: boolean, ...pArgs: any[]): void;

    presume(bCond: boolean, pEntity: AILoggerEntity): void;
    presume(bCond: boolean, eCode: uint, ...pArgs: any[]);
    presume(bCond: boolean, ...pArgs: any[]);
}


