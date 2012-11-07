#ifndef LOGGER_TS
#define LOGGER_TS

#include "common.js"
#include "ILogger.ts"
#include "bf/bitflags.ts"

module akra.util {

    interface IFormatMessageFunc {
        (sMessage: string, pInfo?: ObjectMap): string;
    }

    interface IFormatCallbackMap {
        [s: number]: IFormatMessageFunc;
    }

    interface ILogRoutineMap {
        [s: number]: ILogRoutineFunc;
    }

    class Logger implements ILogger {

        private _pCodeMessagesMap: StringMap;
        private _pCodeFormatCallbackMap: IFormatCallbackMap;
        private _pLogRoutineMap: ILogRoutineMap;

        private _eLogLevel: ELogLevel;
        private _pEngine: IEngine;

        private _pLastLogEntity: ILoggerEntity; 
        private _pCurrentSourceLocation: ISourcePosition;

        constructor (pEngine: IEngine) {
            this._pEngine = pEngine;

            this._pCodeMessagesMap = <StringMap>{};
            this._pCodeFormatCallbackMap = <IFormatCallbackMap>{};
            this._pLogRoutineMap = <ILogRoutineMap>{};

            this._pCurrentSourceLocation = <ISourcePosition>{
                                            file: "",
                                            line: 0
                                        };

            this._pLastLogEntity = <ILoggerEntity>{
                                    code: UNKNOWN_CODE,
                                    position: this._pCurrentSourceLocation,
                                    info: null,
                                    
                                   };
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

        error(...pArgs:any[]){

            if(pArgs.length === 0){
                //default unknown error
            }
            else if(pArgs.length === 1 && this.isLogEntity(pArgs[0])){
                //By log entity
            }
            else if(this.isLogCode(pArgs[0])){
                //By code
            }
            else{
                //Unknown error
            }
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

        private isLogEntity(pObj:any):bool{
            if(isObject(pObj) && isDef(pObj.code) && isDef(pObj.position)){
                return true;
            }

            return false;
        }

        private static isLogCode(eCode:any):bool{
            if(isInt(eCode) && isDef(this._pCodeMessagesMap[eCode])){
                return true;
            }

            return false;
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