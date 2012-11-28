//Temp
module akra.bf {
    export var testAll = (value: int, set: int) =>(((value) & (set)) == (set));
}
//Temp
module akra {
    // TEMP
    interface StringMap {
        [s: string]: string;
        [s: number]: string;
    }

    export interface ObjectMap {
        [s: string]: Object;
        [s: number]: Object;
    }

    interface IEngine {
        isDebug(): bool;
    }
    var isString = (x: any) =>(typeof x === "string");
    var isInt = (x: any) =>(typeof x === "number");
    var isObject = (x: any) =>(typeof x === "object");
    var isNull = (x: any) =>(x === null);
    var isDef = (x: any) =>(x !== undefined);
    //END TEMP


    interface IFormatMessageFunc {
        (sMessage: string, pInfo?: ObjectMap): string;
    }

    interface IFormatCallbackMap {
        [s: number]: IFormatMessageFunc;
    }

    interface ILogRoutineMap {
        [s: number]: ILogRoutineFunc;
    }

    export enum ELogLevel {

        RELEASE = 0x0000,
        INFORMATION = 0x0001,
        ERROR = 0x0002,
        WARNING = 0x0004,
        LOG = 0x0008,

        DEBUG = 0x0020,
        DEBUG_INFORMATION = 0x0040,
        DEBUG_ERROR = 0x0080,
        DEBUG_WARNING = 0x0100,
        DEBUG_LOG = 0x0200
    }

    export interface ILogRoutineFunc {
        (...pArgs: any[]): void;
    }

    export interface ISourcePosition {

    }

    export interface ILoggerEntity {
        code: uint;
        position: ISourcePosition;
        info: ObjectMap;
        hint: string;
    }

    export interface ILogger {

        error(eCode: uint, pLocation?: ISourcePosition, sHint?: string): void;
        error(sMessage: string, pLocation?: ISourcePosition): void;
        error(pEntity: ILoggerEntity): void;

        warning(eCode: uint, pLocation?: ISourcePosition, sHint?: string): void;
        warning(sMessage: string, pLocation?: ISourcePosition): void;
        warning(pEntity: ILoggerEntity): void;

        info(eCode: uint, pLocation?: ISourcePosition, sHint?: string): void;
        info(sMessage: string, pLocation?: ISourcePosition): void;
        info(pEntity: ILoggerEntity): void;

        debug_error(eCode: uint, pLocation?: ISourcePosition, sHint?: string): void;
        debug_error(sMessage: string, pLocation?: ISourcePosition): void;
        debug_error(pEntity: ILoggerEntity): void;

        debug_warning(eCode: uint, pLocation?: ISourcePosition, sHint?: string): void;
        debug_warning(sMessage: string, pLocation?: ISourcePosition): void;
        debug_warning(pEntity: ILoggerEntity): void;

        debug_info(eCode: uint, pLocation?: ISourcePosition, sHint?: string): void;
        debug_info(sMessage: string, pLocation?: ISourcePosition): void;
        debug_info(pEntity: ILoggerEntity): void;

        log(...pArgs: any[]);
        debug_log(...pArgs: any[]);

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

    }

    class Logger implements ILogger {

        private _pCodeMessagesMap: StringMap;
        private _pCodeFormatCallbackMap: IFormatCallbackMap;
        private _pLogRoutineMap: ILogRoutineMap;

        private _eLogLevel: ELogLevel;
        private _pEngine: IEngine;

        constructor (pEngine: IEngine) {
            this._pEngine = pEngine;

            this._pCodeMessagesMap = <StringMap>{};
            this._pCodeFormatCallbackMap = <IFormatCallbackMap>{};
            this._pLogRoutineMap = <ILogRoutineMap>{};
        }

        init(): bool {
            //TODO: Load file
            return true;
        }

        formatMessage(eCode: uint, pEntity: ILoggerEntity): string {

            return "";
        }

        setLogLevel(eLevel: ELogLevel): bool {
            if (!this._pEngine.isDebug() && eLevel > ELogLevel.DEBUG) {
                return false;
            }
            this._eLogLevel = eLevel;
        }

        getLogLevel(): ELogLevel {
            return this._eLogLevel;
        }


        setLogRoutine(fnLogRoutine: ILogRoutineFunc, eLevel: ELogLevel): bool {
            if (this._pEngine.isDebug() && eLevel > ELogLevel.DEBUG) {
                return false;
            }


            //if (bf.testAll(eLevel, ELogLevel.INFORMATION)) {
            //    this._pLogRoutineMap[ELogLevel.INFORMATION] = fnLogRoutine;
            //}
            //else if (bf.testAll(eLevel, ELogLevel.ERROR)) {
            //    this._pLogRoutineMap[ELogLevel.ERROR] = fnLogRoutine;
            //}
            //else if (bf.testAll(eLevel, ELogLevel.WARNING)) {
            //    this._pLogRoutineMap[ELogLevel.WARNING] = fnLogRoutine;
            //}
            //else if (bf.testAll(eLevel, ELogLevel.LOG)) {
            //    this._pLogRoutineMap[ELogLevel.LOG] = fnLogRoutine;
            //}
            //else if (bf.testAll(eLevel, ELogLevel.DEBUG_INFORMATION)) {
            //    this._pLogRoutineMap[ELogLevel.DEBUG_INFORMATION] = fnLogRoutine;
            //}
            //else if (bf.testAll(eLevel, ELogLevel.DEBUG_ERROR)) {
            //    this._pLogRoutineMap[ELogLevel.DEBUG_ERROR] = fnLogRoutine;
            //}
            //else if (bf.testAll(eLevel, ELogLevel.DEBUG_WARNING)) {
            //    this._pLogRoutineMap[ELogLevel.DEBUG_WARNING] = fnLogRoutine;
            //}
            //else if (bf.testAll(eLevel, ELogLevel.DEBUG_LOG)) {
            //    this._pLogRoutineMap[ELogLevel.DEBUG_LOG] = fnLogRoutine;
            //}

            return true;
        }


        log(...pArgs: any[]): void {

        }

        debug_log(...pArgs: any[]): void {

        }

        error(sMessage: string, pLocation?: ISourcePosition = null): void;
        error(pEntity: ILoggerEntity): void;
        error(eCode: uint, pLocation?: ISourcePosition = null, sHint?: string = ""): void;
        error(): void {
            var sMessage: string;
            sMessage = this.generateLoggerMessage.call(this, arguments[0], arguments[1], arguments[2]);

            this.printMessage(sMessage, ELogLevel.ERROR);
        }

        warning(sMessage: string, pLocation?: ISourcePosition = null): void;
        warning(pEntity: ILoggerEntity): void;
        warning(eCode: uint, pLocation?: ISourcePosition = null, sHint?: string = ""): void;
        warning(): void {
            var sMessage: string;
            sMessage = this.generateLoggerMessage.call(this, arguments[0], arguments[1], arguments[2]);

            this.printMessage(sMessage, ELogLevel.WARNING);
        }

        info(sMessage: string, pLocation?: ISourcePosition = null): void;
        info(pEntity: ILoggerEntity): void;
        info(eCode: uint, pLocation?: ISourcePosition = null, sHint?: string = ""): void;
        info(): void {
            var sMessage: string;
            sMessage = this.generateLoggerMessage.call(this, arguments[0], arguments[1], arguments[2]);

            this.printMessage(sMessage, ELogLevel.INFORMATION);
        }

        debug_error(sMessage: string, pLocation?: ISourcePosition = null): void;
        debug_error(pEntity: ILoggerEntity): void;
        debug_error(eCode: uint, pLocation?: ISourcePosition = null, sHint?: string = ""): void;
        debug_error(): void {

            if (!this._pEngine.isDebug()) {
                return;
            }

            var sMessage: string;
            sMessage = this.generateLoggerMessage.call(this, arguments[0], arguments[1], arguments[2]);

            this.printMessage(sMessage, ELogLevel.DEBUG_ERROR);
        }

        debug_warning(sMessage: string, pLocation?: ISourcePosition = null): void;
        debug_warning(pEntity: ILoggerEntity): void;
        debug_warning(eCode: uint, pLocation?: ISourcePosition = null, sHint?: string = ""): void;
        debug_warning(): void {

            if (!this._pEngine.isDebug()) {
                return;
            }

            var sMessage: string;
            sMessage = this.generateLoggerMessage.call(this, arguments[0], arguments[1], arguments[2]);

            this.printMessage(sMessage, ELogLevel.DEBUG_WARNING);
        }

        debug_info(sMessage: string, pLocation?: ISourcePosition = null): void;
        debug_info(pEntity: ILoggerEntity): void;
        debug_info(eCode: uint, pLocation?: ISourcePosition = null, sHint?: string = ""): void;
        debug_info(): void {

            if (!this._pEngine.isDebug()) {
                return;
            }

            var sMessage: string;
            sMessage = this.generateLoggerMessage.call(this, arguments[0], arguments[1], arguments[2]);

            this.printMessage(sMessage, ELogLevel.DEBUG_INFORMATION);
        }



        private generateLoggerMessage(sMessage: string, pLocation?: ISourcePosition = null): string;
        private generateLoggerMessage(pEntity: ILoggerEntity): string;
        private generateLoggerMessage(eCode: uint, pLocation?: ISourcePosition = null, sHint?: string = ""): string;
        private generateLoggerMessage(): string {

            var sLoggerMessage: string;

            var sMessage: string;
            var pLocation: ISourcePosition;
            var sHint: string;

            if (isString(arguments[0])) {
                sMessage = arguments[0];
                pLocation = arguments[1] || null;
                sHint = "";
            }
            else if (isObject(arguments[0])) {
                var pEntity: ILoggerEntity = arguments[0];

                sMessage = this.getMessageFromCode(pEntity.code, pEntity.info);
                pLocation = pEntity.position;
                sHint = pEntity.hint;
            }
            else if (isInt(arguments[0])) {
                var eCode: uint = arguments[0];

                sMessage = this.getMessageFromCode(eCode);
                pLocation = arguments[1] || null;
                sHint = arguments[2] || "";
            }
            else {
                return;
            }

            sLoggerMessage = this.prepareMessage(pLocation, sMessage, sHint);
            return sLoggerMessage;
        }

        private printMessage(sMessage: string, eLevel: ELogLevel): void {
            this._pLogRoutineMap[eLevel].call(null, sMessage);
        }

        private getMessageFromCode(eCode: uint, pInfo?: ObjectMap = null): string {
            if (!isDef(this._pCodeMessagesMap[eCode])) {
                return "Code " + eCode + ": No Message";;
            }
            return this._pCodeFormatCallbackMap[eCode].call(null, pInfo);
        }

        private prepareMessage(pLocation: ISourcePosition, sMessage: string, sHint: string): string {
            var sLogMessage: string;

            if (isNull(pLocation)) {
                sLogMessage += pLocation.toString() + ": ";
            }
            else {
                sLogMessage += "[Unknown]: ";
            }

            sLogMessage += sMessage;

            if (sHint != "") {
                sLogMessage += "\n Hint: " + sHint;
            }

            return sLogMessage;
        }

    }

}