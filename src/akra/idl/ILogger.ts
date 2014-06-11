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
		//loadManifestFile(): boolean;

		init(): boolean;

		setLogLevel(eLevel: ELogLevel): void;
		getLogLevel(): ELogLevel;

		registerCode(eCode: uint, sMessage?: string): boolean;
		setUnknownCode(eCode: uint, sMessage: string): void;

		registerCodeFamily(eCodeMin: uint, eCodeMax: uint, sFamilyName?: string): boolean;

		getFamilyName(eCode: uint): string;

		setCodeFamilyRoutine(eCodeFromFamily: uint, fnLogRoutine: ILogRoutineFunc, eLevel: uint): boolean;
		setCodeFamilyRoutine(sFamilyName: string, fnLogRoutine: ILogRoutineFunc, eLevel: uint): boolean;

		setLogRoutine(fnLogRoutine: ILogRoutineFunc, eLevel: uint): void;

		setSourceLocation(sFile: string, iLine: uint): void;
		setSourceLocation(pLocation: ISourceLocation): void;

		// Print messages methods

		time(sLabel: string): void;
		timeEnd(sLabel: string): void;

		group(...pArgs: any[]): void;
		groupEnd(): void;

		log(...pArgs: any[]);

		info(pEntity: ILoggerEntity): void;
		info(eCode: uint, ...pArgs: any[]): void;
		info(...pArgs: any[]): void;

		warn(pEntity: ILoggerEntity): void;
		warn(eCode: uint, ...pArgs: any[]): void;
		warn(...pArgs: any[]): void;

		error(pEntity: ILoggerEntity): void;
		error(eCode: uint, ...pArgs: any[]): void;
		error(...pArgs: any[]): void;

		critical(pEntity: ILoggerEntity): void;
		critical(eCode: uint, ...pArgs: any[]): void;
		critical(...pArgs: any[]): void;

		assert(bCondition: boolean, pEntity: ILoggerEntity): void;
		assert(bCondition: boolean, eCode: uint, ...pArgs: any[]): void;
		assert(bCondition: boolean, ...pArgs: any[]): void;
	}
}
