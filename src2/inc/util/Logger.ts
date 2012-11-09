#ifndef LOGGER_TS
#define LOGGER_TS

#include "common.ts"
#include "ILogger.ts"
#include "bf/bitflags.ts"

module akra.util {
 
    export interface ILogRoutineMap {
        [eLogLevel: uint]: ILogRoutineFunc;
    }

    export  interface ICodeFamily {
        familyName: string;
        codeMin: uint;
        codeMax: uint;
    }

    export  interface ICodeFamilyMap{
        [familyName: string]: ICodeFamily;
    }

    export interface ICodeInfo{
        code: uint;
        message: string;
        familyName: string;
    }

    export interface ICodeInfoMap{
        [code: uint] : ICodeInfo;
    }

    export interface ICodeFamilyRoutineDMap{
        [familyName: string]: ILogRoutineMap;
    }

    export class Logger implements ILogger {

        private _eLogLevel: ELogLevel;
        private _pGeneralRoutineMap: ILogRoutineMap;

        private _pCurrentSourceLocation: ISourceLocation;
        private _pLastLogEntity: ILoggerEntity; 
        
        private _pCodeFamilyList: ICodeFamily[];
        private _pCodeFamilyMap: ICodeFamilyMap;
        private _pCodeInfoMap: ICodeInfoMap;

        private _pCodeFamilyRoutineDMap: ICodeFamilyRoutineDMap;

        private _nFamilyGenerator: uint;
        static private _sDefaultFamilyName: string = "CodeFamily";

        private _eUnknownCode: uint;
        private _sUnknownMessage: string;

        constructor () {
            this._eUnknownCode = 0;
            this._sUnknownMessage = "Unknown code";  

            this._eLogLevel = ELogLevel.ALL;
            this._pGeneralRoutineMap = <ILogRoutineMap>{};

            this._pCurrentSourceLocation = <ISourceLocation>{
                                            file: "",
                                            line: 0
                                        };

            this._pLastLogEntity = <ILoggerEntity>{
                                    code: this._eUnknownCode,
                                    location: this._pCurrentSourceLocation,
                                    message: this._sUnknownMessage,
                                    info: null,                                    
                                   };
            
            this._pCodeFamilyMap = <ICodeFamilyMap>{};        
            this._pCodeFamilyList = <ICodeFamily[]>[];
            this._pCodeInfoMap = <ICodeInfoMap>{};

            this._pCodeFamilyRoutineDMap = <ICodeFamilyRoutineDMap>{};

            this._nFamilyGenerator = 0;                       

              
        }

        init(): bool {
            //TODO: Load file
            return true;
        }

        setLogLevel(eLevel: ELogLevel): void {
            this._eLogLevel = eLevel;
        }

        getLogLevel(): ELogLevel {
            return this._eLogLevel;
        }

        registerCode(eCode: uint, sMessage?: string = this._sUnknownMessage): bool{
            if(this.isUsedCode(eCode)){
                return false;
            }

            var sFamilyName: string = this.getFamilyName(eCode);
            if(isNull(sFamilyName)){
                return false;
            }

            var pCodeInfo: ICodeInfo = <ICodeInfo>{
                                            code: eCode,
                                            message: sMessage,
                                            familyName: sFamilyName   
                                            };

            this._pCodeInfoMap[eCode] = pCodeInfo;

            return true;
        }

        setUnknownCode(eCode: uint, sMessage: string):void{
            this._eUnknownCode = eCode;
            this._sUnknownMessage = sMessage;
        }

        registerCodeFamily(eCodeMin: uint, eCodeMax: uint, sFamilyName?: string): bool{
            if(!isDef(sFamilyName)){
                sFamilyName = this.generateFamilyName();
            }

            if(this.isUsedFamilyName(sFamilyName)){
                return false;
            }

            if(!this.isValidCodeInterval(eCodeMin, eCodeMax)){
                return false;
            }

            var pCodeFamily: ICodeFamily = <ICodeFamily>{
                                                    familyName: sFamilyName,
                                                    codeMin: eCodeMin,
                                                    codeMax: eCodeMax
                                                    };

            this._pCodeFamilyMap[sFamilyName] = pCodeFamily;
            this._pCodeFamilyList.push(pCodeFamily);

            return true;
        }

        getFamilyName(eCode): string{
            var i: uint = 0;
            var pCodeFamilyList: ICodeFamily[] = this._pCodeFamilyList;
            var pCodeFamily: ICodeFamily;

            for(i = 0; i < pCodeFamilyList.length; i++){
                pCodeFamily = pCodeFamilyList[i];

                if(pCodeFamily.codeMin <= eCode && pCodeFamily.codeMax >= eCode){
                    return pCodeFamily.familyName;
                }
            }

            return null;
        }

        setCodeFamilyRoutine(eCodeFromFamily: uint, fnLogRoutine: ILogRoutineFunc, eLevel: ELogLevel): bool;
        setCodeFamilyRoutine(sFamilyName: string, fnLogRoutine: ILogRoutineFunc, eLevel: ELogLevel): bool;
        setCodeFamilyRoutine():bool {
            var sFamilyName: string;
            var fnLogRoutine: ILogRoutineFunc;
            var eLevel:ELogLevel;

            if(isInt(arguments[0])){
                sFamilyName = this.getFamilyName(arguments[0]);
                fnLogRoutine = arguments[1];
                eLevel = arguments[2];
                
                if(isNull(sFamilyName)){
                    return false;
                }
            }
            else if(isString(arguments[0])){
                sFamilyName = arguments[0];
                fnLogRoutine = arguments[1];
                eLevel = arguments[2];
            }

            if(!this.isUsedFamilyName(sFamilyName)){
                return false;
            }

            var pCodeFamilyRoutineMap: ILogRoutineMap = this._pCodeFamilyRoutineDMap[sFamilyName];

            if(!isDef(pCodeFamilyRoutineMap)){
                pCodeFamilyRoutineMap = this._pCodeFamilyRoutineDMap[sFamilyName] = <ILogRoutineMap>{};
            }

            if (bf.testAll(eLevel, ELogLevel.LOG)) {
               pCodeFamilyRoutineMap[ELogLevel.LOG] = fnLogRoutine;
            }
            if (bf.testAll(eLevel, ELogLevel.INFORMATION)) {
               pCodeFamilyRoutineMap[ELogLevel.INFORMATION] = fnLogRoutine;
            }
            if (bf.testAll(eLevel, ELogLevel.WARNING)) {
               pCodeFamilyRoutineMap[ELogLevel.WARNING] = fnLogRoutine;
            }
            if (bf.testAll(eLevel, ELogLevel.ERROR)) {
               pCodeFamilyRoutineMap[ELogLevel.ERROR] = fnLogRoutine;
            }
            if (bf.testAll(eLevel, ELogLevel.CRITICAL)) {
               pCodeFamilyRoutineMap[ELogLevel.CRITICAL] = fnLogRoutine;
            }

            return true;
        }

        setLogRoutine(fnLogRoutine: ILogRoutineFunc, eLevel: ELogLevel): void {

            if (bf.testAll(eLevel, ELogLevel.LOG)) {
               this._pGeneralRoutineMap[ELogLevel.LOG] = fnLogRoutine;
            }
            if (bf.testAll(eLevel, ELogLevel.INFORMATION)) {
               this._pGeneralRoutineMap[ELogLevel.INFORMATION] = fnLogRoutine;
            }
            if (bf.testAll(eLevel, ELogLevel.WARNING)) {
               this._pGeneralRoutineMap[ELogLevel.WARNING] = fnLogRoutine;
            }
            if (bf.testAll(eLevel, ELogLevel.ERROR)) {
               this._pGeneralRoutineMap[ELogLevel.ERROR] = fnLogRoutine;
            }
            if (bf.testAll(eLevel, ELogLevel.CRITICAL)) {
               this._pGeneralRoutineMap[ELogLevel.CRITICAL] = fnLogRoutine;
            }          
        }

        setSourceLocation(sFile: string, iLine: uint): void;
        setSourceLocation(pLocation: ISourceLocation): void;
        setSourceLocation(): void {
            var sFile: string;
            var iLine: uint;

            if(arguments.length === 2){
                sFile = arguments[0];
                iLine = arguments[1];
            }
            else {
                if(isDef(arguments[0]) && !(isNull(arguments[0]))){
                    sFile = arguments[0].file;
                    iLine = arguments[0].line;
                }
                else{
                    sFile = "";
                    iLine = 0;    
                }
            }

            this._pCurrentSourceLocation.file = sFile;
            this._pCurrentSourceLocation.line = iLine;
        }


        log(...pArgs: any[]): void {
            if(!bf.testAll(this._eLogLevel, ELogLevel.LOG)){
                return;
            }

            var fnLogRoutine:ILogRoutineFunc = this._pGeneralRoutineMap[ELogLevel.LOG];
            if(!isDef(fnLogRoutine)){
                return;
            }

            var pLogEntity: ILoggerEntity = this._pLastLogEntity;

            pLogEntity.code = this._eUnknownCode;
            pLogEntity.location = this._pCurrentSourceLocation;
            pLogEntity.info = pArgs;
            pLogEntity.message = this._sUnknownMessage;

            fnLogRoutine.call(null, pLogEntity);
        }

        info(...pArgs: any[]): void {
            if(!bf.testAll(this._eLogLevel, ELogLevel.INFORMATION)){
                return;
            }

            var pLogEntity: ILoggerEntity;
            var fnLogRoutine: ILogRoutineFunc;

            pLogEntity = this.prepareLogEntity(pArgs);
            fnLogRoutine = this.getCodeRoutineFunc(pLogEntity.code, ELogLevel.INFORMATION);

            if(isNull(fnLogRoutine)){
                return;
            }         

            fnLogRoutine.call(null, pLogEntity);
        }

        warning(...pArgs: any[]): void {
            if(!bf.testAll(this._eLogLevel, ELogLevel.WARNING)){
                return;
            }

            var pLogEntity: ILoggerEntity;
            var fnLogRoutine: ILogRoutineFunc;

            pLogEntity = this.prepareLogEntity(pArgs);
            fnLogRoutine = this.getCodeRoutineFunc(pLogEntity.code, ELogLevel.WARNING);

            if(isNull(fnLogRoutine)){
                return;
            }         

            fnLogRoutine.call(null, pLogEntity);
        }

        error(...pArgs:any[]): void {
            if(!bf.testAll(this._eLogLevel, ELogLevel.ERROR)){
                return;
            }

            var pLogEntity: ILoggerEntity;
            var fnLogRoutine: ILogRoutineFunc;

            pLogEntity = this.prepareLogEntity(pArgs);
            fnLogRoutine = this.getCodeRoutineFunc(pLogEntity.code, ELogLevel.ERROR);

            if(isNull(fnLogRoutine)){
                return;
            }         

            fnLogRoutine.call(null, pLogEntity);
        }

        critical_error(...pArgs: any[]):void {

            var pLogEntity: ILoggerEntity;
            var fnLogRoutine: ILogRoutineFunc;

            pLogEntity = this.prepareLogEntity(pArgs);
            fnLogRoutine = this.getCodeRoutineFunc(pLogEntity.code, ELogLevel.CRITICAL);

            var sSystemMessage: string = "A Critical error has occured! Code: " + pLogEntity.code.toString();
            
            if(bf.testAll(this._eLogLevel, ELogLevel.CRITICAL) && !isNull(fnLogRoutine)){
                fnLogRoutine.call(null, pLogEntity);
            }        

            alert(sSystemMessage);
            throw new Error(sSystemMessage);
        }
        
        assert(bCondition: bool, ...pArgs: any[]):void{
            if(!bCondition){
                var pLogEntity: ILoggerEntity;
                var fnLogRoutine: ILogRoutineFunc;

                pLogEntity = this.prepareLogEntity(pArgs);
                fnLogRoutine = this.getCodeRoutineFunc(pLogEntity.code, ELogLevel.CRITICAL);

                var sSystemMessage: string = "A error has occured! Code: " + pLogEntity.code.toString() + 
                                             "\n Accept to exit, refuse to continue.";
                
                if(bf.testAll(this._eLogLevel, ELogLevel.CRITICAL) && !isNull(fnLogRoutine)){
                    fnLogRoutine.call(null, pLogEntity);
                }        

                if(confirm(sSystemMessage)){
                    throw new Error(sSystemMessage);
                }    
            }
        }


        private generateFamilyName(): string {
            var sSuffix: string = <string><any>(this._nFamilyGenerator++);
            var sName: string = Logger._sDefaultFamilyName + sSuffix;

            if(this.isUsedFamilyName(sName)){
                return this.generateFamilyName();
            }
            else {
                return sName;
            }
        }

        private isValidCodeInterval(eCodeMin: uint, eCodeMax: uint): bool{
            if(eCodeMin > eCodeMax){
                return false;
            }

            var i: uint = 0;
            var pCodeFamilyList: ICodeFamily[] = this._pCodeFamilyList;
            var pCodeFamily: ICodeFamily;

            for(i = 0; i < pCodeFamilyList.length; i++){
                pCodeFamily = pCodeFamilyList[i];

                if((pCodeFamily.codeMin <= eCodeMin && pCodeFamily.codeMax >= eCodeMin) ||
                   (pCodeFamily.codeMin <= eCodeMax && pCodeFamily.codeMax >= eCodeMax)){

                    return false;    
                }
            }

            return true;
        }

        private inline isUsedFamilyName(sFamilyName: string): bool{
            return isDef(this._pCodeFamilyMap[sFamilyName]);
        }

        private inline isUsedCode(eCode: uint): bool{
            return isDef(this._pCodeInfoMap[eCode]);
        }

        private isLogEntity(pObj:any):bool {
            if(isObject(pObj) && isDef(pObj.code) && isDef(pObj.location)){
                return true;
            }

            return false;
        }

        private inline isLogCode(eCode:any):bool {
            return isInt(eCode);
        }

        private prepareLogEntity(pArgs:any[]): ILoggerEntity{
            var eCode: uint = this._eUnknownCode;
            var sMessage:string = this._sUnknownMessage;
            var pInfo: any = null;

            if(pArgs.length === 1 && this.isLogEntity(pArgs[0])){
                eCode = pArgs[0].code;
                pInfo = pArgs[0].info;
                this.setSourceLocation(pArgs[0].location);    
                
                if(!isDef(pArgs[0].message)){
                    var pCodeInfo: ICodeInfo = this._pCodeInfoMap[eCode];  
                    if(isDef(pCodeInfo)){
                        sMessage = pCodeInfo.message;
                    }
                }

            }
            else {
                if(this.isLogCode(pArgs[0])){
                    eCode = <uint>pArgs[0];
                    if(pArgs.length > 1){
                        if(isArray(pArgs)){
                            pArgs.shift();
                            pInfo = pArgs;
                        } 
                        else{
                            pInfo = new Array(pArgs.length - 1);
                            var i: uint = 0;
                            for(i = 0; i < pInfo.length; i++){
                                pInfo[i] = pArgs[i+1];
                            }
                        }
                    }
                }
                else {
                    eCode = this._eUnknownCode; 
                    pInfo = pArgs.length > 0 ? pArgs : null;   
                }

                var pCodeInfo: ICodeInfo = this._pCodeInfoMap[eCode];  
                if(isDef(pCodeInfo)){
                    sMessage = pCodeInfo.message;
                }
            }

            var pLogEntity: ILoggerEntity = this._pLastLogEntity;

            pLogEntity.code = eCode;
            pLogEntity.location = this._pCurrentSourceLocation;
            pLogEntity.message = sMessage;
            pLogEntity.info = pInfo;

            return pLogEntity;
        }

        private getCodeRoutineFunc(eCode: uint, eLevel: ELogLevel): ILogRoutineFunc{
            var pCodeInfo: ICodeInfo = this._pCodeInfoMap[eCode];
            var fnLogRoutine: ILogRoutineFunc;

            if(!isDef(pCodeInfo)){
                fnLogRoutine = this._pGeneralRoutineMap[eLevel];
                return isDef(fnLogRoutine) ? fnLogRoutine : null;
            }

            var pCodeFamilyRoutineMap: ILogRoutineMap = this._pCodeFamilyRoutineDMap[pCodeInfo.familyName];

            if(!isDef(pCodeFamilyRoutineMap) || !isDef(pCodeFamilyRoutineMap[eLevel])) {
                fnLogRoutine = this._pGeneralRoutineMap[eLevel];
                return isDef(fnLogRoutine) ? fnLogRoutine : null;
            }

            fnLogRoutine = pCodeFamilyRoutineMap[eLevel];

            return fnLogRoutine;
        }

    }

    #define log(...)            akra.logger.setSourceLocation(__FILE__, __LINE__); \
                            akra.logger.log(__VA_ARGS__);

    #define info(...)           akra.logger.setSourceLocation(__FILE__, __LINE__); \
                                akra.logger.info(__VA_ARGS__);

    #define warning(...)        akra.logger.setSourceLocation(__FILE__, __LINE__); \
                                akra.logger.warning(__VA_ARGS__);

    #define error(...)          akra.logger.setSourceLocation(__FILE__, __LINE__); \
                                akra.logger.error(__VA_ARGS__);

    #define critical(...)       akra.logger.setSourceLocation(__FILE__, __LINE__); \
                                akra.logger.critical_error(__VA_ARGS__);

    #define critical_error(...) akra.logger.setSourceLocation(__FILE__, __LINE__); \
                                akra.logger.critical_error(__VA_ARGS__);

    #define assert(...)         akra.logger.setSourceLocation(__FILE__, __LINE__); \
                                akra.logger.assert(__VA_ARGS__);


}

#endif