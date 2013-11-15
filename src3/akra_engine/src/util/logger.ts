/// <reference path="../idl/AILogger.ts" />

import Singleton = require("util/Singleton");
import type = require("type");
import cfg = require("cfg");
import bf = require("util/bitflags");

import isDef = type.isDef;
import isNull = type.isNull;
import isObject = type.isObject;
import isInt = type.isInt;
import isString = type.isString;

export interface AILogRoutineMap {
    [eLogLevel: uint]: AILogRoutineFunc;
}

export interface AICodeFamily {
    familyName: string;
    codeMin: uint;
    codeMax: uint;
}

export interface AICodeFamilyMap {
    [familyName: string]: AICodeFamily;
}

export interface AICodeInfo {
    code: uint;
    message: string;
    familyName: string;
}

export interface AICodeInfoMap {
    [code: uint]: AICodeInfo;
}

export interface AICodeFamilyRoutineDMap {
    [familyName: string]: AILogRoutineMap;
}

export class Logger extends Singleton<Logger> implements AILogger {
    private _eLogLevel: AELogLevel;
    private _pGeneralRoutineMap: AILogRoutineMap;

    private _pCurrentSourceLocation: AISourceLocation;
    private _pLastLogEntity: AILoggerEntity;

    private _pCodeFamilyList: AICodeFamily[];
    private _pCodeFamilyMap: AICodeFamilyMap;
    private _pCodeInfoMap: AICodeInfoMap;

    private _pCodeFamilyRoutineDMap: AICodeFamilyRoutineDMap;

    private _nFamilyGenerator: uint;

    private static _sDefaultFamilyName: string = "CodeFamily";

    private _eUnknownCode: uint;
    private _sUnknownMessage: string;

    constructor() {
        super();

        this._eUnknownCode = 0;
        this._sUnknownMessage = "Unknown code";

        this._eLogLevel = AELogLevel.ALL;
        this._pGeneralRoutineMap = <AILogRoutineMap>{};

        this._pCurrentSourceLocation = <AISourceLocation>{
            file: "",
            line: 0
        };

        this._pLastLogEntity = <AILoggerEntity>{
            code: this._eUnknownCode,
            location: this._pCurrentSourceLocation,
            message: this._sUnknownMessage,
            info: null,
        };

        this._pCodeFamilyMap = <AICodeFamilyMap>{};
        this._pCodeFamilyList = <AICodeFamily[]>[];
        this._pCodeInfoMap = <AICodeInfoMap>{};

        this._pCodeFamilyRoutineDMap = <AICodeFamilyRoutineDMap>{};

        this._nFamilyGenerator = 0;


    }

    init(): boolean {
        //TODO: Load file
        return true;
    }

    setLogLevel(eLevel: AELogLevel): void {
        this._eLogLevel = eLevel;
    }

    getLogLevel(): AELogLevel {
        return this._eLogLevel;
    }

    registerCode(eCode: uint, sMessage: string = null): boolean {
        if (isNull(sMessage)) {
            sMessage = this._sUnknownMessage;
        }

        if (this.isUsedCode(eCode)) {
            return false;
        }

        var sFamilyName: string = this.getFamilyName(eCode);
        if (isNull(sFamilyName)) {
            return false;
        }

        var pCodeInfo: AICodeInfo = <AICodeInfo>{
            code: eCode,
            message: sMessage,
            familyName: sFamilyName
        };

        this._pCodeInfoMap[eCode] = pCodeInfo;

        return true;
    }

    setUnknownCode(eCode: uint, sMessage: string): void {
        this._eUnknownCode = eCode;
        this._sUnknownMessage = sMessage;
    }

    registerCodeFamily(eCodeMin: uint, eCodeMax: uint, sFamilyName?: string): boolean {
        if (!isDef(sFamilyName)) {
            sFamilyName = this.generateFamilyName();
        }

        if (this.isUsedFamilyName(sFamilyName)) {
            return false;
        }

        if (!this.isValidCodeInterval(eCodeMin, eCodeMax)) {
            return false;
        }

        var pCodeFamily: AICodeFamily = <AICodeFamily>{
            familyName: sFamilyName,
            codeMin: eCodeMin,
            codeMax: eCodeMax
        };

        this._pCodeFamilyMap[sFamilyName] = pCodeFamily;
        this._pCodeFamilyList.push(pCodeFamily);

        return true;
    }

    getFamilyName(eCode): string {
        var i: uint = 0;
        var pCodeFamilyList: AICodeFamily[] = this._pCodeFamilyList;
        var pCodeFamily: AICodeFamily;

        for (i = 0; i < pCodeFamilyList.length; i++) {
            pCodeFamily = pCodeFamilyList[i];

            if (pCodeFamily.codeMin <= eCode && pCodeFamily.codeMax >= eCode) {
                return pCodeFamily.familyName;
            }
        }

        return null;
    }

    setCodeFamilyRoutine(eCodeFromFamily: uint, fnLogRoutine: AILogRoutineFunc, eLevel: AELogLevel): boolean;
    setCodeFamilyRoutine(sFamilyName: string, fnLogRoutine: AILogRoutineFunc, eLevel: AELogLevel): boolean;
    setCodeFamilyRoutine(): boolean {
        var sFamilyName: string = null;
        var fnLogRoutine: AILogRoutineFunc = null;
        var eLevel: AELogLevel = AELogLevel.LOG;

        if (isInt(arguments[0])) {
            sFamilyName = this.getFamilyName(arguments[0]);
            fnLogRoutine = arguments[1];
            eLevel = arguments[2];

            if (isNull(sFamilyName)) {
                return false;
            }
        }
        else if (isString(arguments[0])) {
            sFamilyName = arguments[0];
            fnLogRoutine = arguments[1];
            eLevel = arguments[2];
        }

        if (!this.isUsedFamilyName(sFamilyName)) {
            return false;
        }

        var pCodeFamilyRoutineMap: AILogRoutineMap = this._pCodeFamilyRoutineDMap[sFamilyName];

        if (!isDef(pCodeFamilyRoutineMap)) {
            pCodeFamilyRoutineMap = this._pCodeFamilyRoutineDMap[sFamilyName] = <AILogRoutineMap>{};
        }

        if (bf.testAll(eLevel, AELogLevel.LOG)) {
            pCodeFamilyRoutineMap[AELogLevel.LOG] = fnLogRoutine;
        }
        if (bf.testAll(eLevel, AELogLevel.INFORMATION)) {
            pCodeFamilyRoutineMap[AELogLevel.INFORMATION] = fnLogRoutine;
        }
        if (bf.testAll(eLevel, AELogLevel.WARNING)) {
            pCodeFamilyRoutineMap[AELogLevel.WARNING] = fnLogRoutine;
        }
        if (bf.testAll(eLevel, AELogLevel.ERROR)) {
            pCodeFamilyRoutineMap[AELogLevel.ERROR] = fnLogRoutine;
        }
        if (bf.testAll(eLevel, AELogLevel.CRITICAL)) {
            pCodeFamilyRoutineMap[AELogLevel.CRITICAL] = fnLogRoutine;
        }

        return true;
    }

    setLogRoutine(fnLogRoutine: AILogRoutineFunc, eLevel: AELogLevel): void {

        if (bf.testAll(eLevel, AELogLevel.LOG)) {
            this._pGeneralRoutineMap[AELogLevel.LOG] = fnLogRoutine;
        }
        if (bf.testAll(eLevel, AELogLevel.INFORMATION)) {
            this._pGeneralRoutineMap[AELogLevel.INFORMATION] = fnLogRoutine;
        }
        if (bf.testAll(eLevel, AELogLevel.WARNING)) {
            this._pGeneralRoutineMap[AELogLevel.WARNING] = fnLogRoutine;
        }
        if (bf.testAll(eLevel, AELogLevel.ERROR)) {
            this._pGeneralRoutineMap[AELogLevel.ERROR] = fnLogRoutine;
        }
        if (bf.testAll(eLevel, AELogLevel.CRITICAL)) {
            this._pGeneralRoutineMap[AELogLevel.CRITICAL] = fnLogRoutine;
        }
    }

    setSourceLocation(sFile: string, iLine: uint): void;
    setSourceLocation(pLocation: AISourceLocation): void;
    setSourceLocation(): void {
        var sFile: string;
        var iLine: uint;

        if (arguments.length === 2) {
            sFile = arguments[0];
            iLine = arguments[1];
        }
        else {
            if (isDef(arguments[0]) && !(isNull(arguments[0]))) {
                sFile = arguments[0].file;
                iLine = arguments[0].line;
            }
            else {
                sFile = "";
                iLine = 0;
            }
        }

        this._pCurrentSourceLocation.file = sFile;
        this._pCurrentSourceLocation.line = iLine;
    }


    log(...pArgs: any[]): void {
        if (!bf.testAll(this._eLogLevel, AELogLevel.LOG)) {
            return;
        }

        var fnLogRoutine: AILogRoutineFunc = this._pGeneralRoutineMap[AELogLevel.LOG];
        if (!isDef(fnLogRoutine)) {
            return;
        }

        var pLogEntity: AILoggerEntity = this._pLastLogEntity;

        pLogEntity.code = this._eUnknownCode;
        pLogEntity.location = this._pCurrentSourceLocation;
        pLogEntity.info = pArgs;
        pLogEntity.message = this._sUnknownMessage;

        fnLogRoutine.call(null, pLogEntity);
    }

    info(pEntity: AILoggerEntity): void;
    info(eCode: uint, ...pArgs: any[]): void;
    info(...pArgs: any[]): void;
    info(): void {
        if (!bf.testAll(this._eLogLevel, AELogLevel.INFORMATION)) {
            return;
        }

        var pLogEntity: AILoggerEntity;
        var fnLogRoutine: AILogRoutineFunc;

        pLogEntity = this.prepareLogEntity.apply(this, arguments);
        fnLogRoutine = this.getCodeRoutineFunc(pLogEntity.code, AELogLevel.INFORMATION);

        if (isNull(fnLogRoutine)) {
            return;
        }

        fnLogRoutine.call(null, pLogEntity);
    }

    warning(pEntity: AILoggerEntity): void;
    warning(eCode: uint, ...pArgs: any[]): void;
    warning(...pArgs: any[]): void;
    warning(): void {
        if (!bf.testAll(this._eLogLevel, AELogLevel.WARNING)) {
            return;
        }

        var pLogEntity: AILoggerEntity;
        var fnLogRoutine: AILogRoutineFunc;

        pLogEntity = this.prepareLogEntity.apply(this, arguments);
        fnLogRoutine = this.getCodeRoutineFunc(pLogEntity.code, AELogLevel.WARNING);

        if (isNull(fnLogRoutine)) {
            return;
        }

        fnLogRoutine.call(null, pLogEntity);
    }

    error(pEntity: AILoggerEntity): void;
    error(eCode: uint, ...pArgs: any[]): void;
    error(...pArgs: any[]): void;
    error(): void {
        if (!bf.testAll(this._eLogLevel, AELogLevel.ERROR)) {
            return;
        }

        var pLogEntity: AILoggerEntity;
        var fnLogRoutine: AILogRoutineFunc;

        pLogEntity = this.prepareLogEntity.apply(this, arguments);
        fnLogRoutine = this.getCodeRoutineFunc(pLogEntity.code, AELogLevel.ERROR);

        if (isNull(fnLogRoutine)) {
            return;
        }

        fnLogRoutine.call(null, pLogEntity);
    }

    critical(pEntity: AILoggerEntity): void;
    critical(eCode: uint, ...pArgs: any[]): void;
    critical(...pArgs: any[]): void;
    critical(): void {

        var pLogEntity: AILoggerEntity;
        var fnLogRoutine: AILogRoutineFunc;

        pLogEntity = this.prepareLogEntity.apply(this, arguments);
        fnLogRoutine = this.getCodeRoutineFunc(pLogEntity.code, AELogLevel.CRITICAL);

        var sSystemMessage: string = "A Critical error has occured! Code: " + pLogEntity.code.toString();

        if (bf.testAll(this._eLogLevel, AELogLevel.CRITICAL) && !isNull(fnLogRoutine)) {
            fnLogRoutine.call(null, pLogEntity);
        }

        alert(sSystemMessage);
        throw new Error(sSystemMessage);
    }

    assert(bCondition: boolean, pEntity: AILoggerEntity): void;
    assert(bCondition: boolean, eCode: uint, ...pArgs: any[]): void;
    assert(bCondition: boolean, ...pArgs: any[]): void;
    assert(): void {
        var bCondition: boolean = <boolean> arguments[0];

        if (!bCondition) {
            var pLogEntity: AILoggerEntity;
            var fnLogRoutine: AILogRoutineFunc;

            var pArgs: any[] = [];

            for (var i = 1; i < arguments.length; i++) {
                pArgs[i - 1] = arguments[i];
            }

            pLogEntity = this.prepareLogEntity.apply(this, pArgs);
            fnLogRoutine = this.getCodeRoutineFunc(pLogEntity.code, AELogLevel.CRITICAL);

            var sSystemMessage: string = "A error has occured! Code: " + pLogEntity.code.toString() +
                "\n Accept to exit, refuse to continue.";

            if (bf.testAll(this._eLogLevel, AELogLevel.CRITICAL) && !isNull(fnLogRoutine)) {
                fnLogRoutine.call(null, pLogEntity);
            }

            if (confirm(sSystemMessage)) {
                throw new Error(sSystemMessage);
            }
        }
    }


    private generateFamilyName(): string {
        var sSuffix: string = <string><any>(this._nFamilyGenerator++);
        var sName: string = Logger._sDefaultFamilyName + sSuffix;

        if (this.isUsedFamilyName(sName)) {
            return this.generateFamilyName();
        }
        else {
            return sName;
        }
    }

    private isValidCodeInterval(eCodeMin: uint, eCodeMax: uint): boolean {
        if (eCodeMin > eCodeMax) {
            return false;
        }

        var i: uint = 0;
        var pCodeFamilyList: AICodeFamily[] = this._pCodeFamilyList;
        var pCodeFamily: AICodeFamily;

        for (i = 0; i < pCodeFamilyList.length; i++) {
            pCodeFamily = pCodeFamilyList[i];

            if ((pCodeFamily.codeMin <= eCodeMin && pCodeFamily.codeMax >= eCodeMin) ||
                (pCodeFamily.codeMin <= eCodeMax && pCodeFamily.codeMax >= eCodeMax)) {

                return false;
            }
        }

        return true;
    }

    private /** inline */ isUsedFamilyName(sFamilyName: string): boolean {
        return isDef(this._pCodeFamilyMap[sFamilyName]);
    }

    private /** inline */ isUsedCode(eCode: uint): boolean {
        return isDef(this._pCodeInfoMap[eCode]);
    }

    private isLogEntity(pObj: any): boolean {
        if (isObject(pObj) && isDef(pObj.code) && isDef(pObj.location)) {
            return true;
        }

        return false;
    }

    private /** inline */ isLogCode(eCode: any): boolean {
        return isInt(eCode);
    }

    private prepareLogEntity(pEntity: AILoggerEntity): AILoggerEntity;
    private prepareLogEntity(eCode: uint, ...pArgs: any[]): AILoggerEntity;
    private prepareLogEntity(...pArgs: any[]): AILoggerEntity;
    private prepareLogEntity(): AILoggerEntity {
        var eCode: uint = this._eUnknownCode;
        var sMessage: string = this._sUnknownMessage;
        var pInfo: any = null;

        if (arguments.length === 1 && this.isLogEntity(arguments[0])) {
            var pEntity: AILoggerEntity = arguments[0];

            eCode = pEntity.code;
            pInfo = pEntity.info;
            this.setSourceLocation(pEntity.location);

            if (!isDef(pEntity.message)) {
                var pCodeInfo: AICodeInfo = this._pCodeInfoMap[eCode];
                if (isDef(pCodeInfo)) {
                    sMessage = pCodeInfo.message;
                }
            }

        }
        else {
            if (this.isLogCode(arguments[0])) {
                eCode = <uint>arguments[0];
                if (arguments.length > 1) {
                    pInfo = new Array(arguments.length - 1);
                    var i: uint = 0;

                    for (i = 0; i < pInfo.length; i++) {
                        pInfo[i] = arguments[i + 1];
                    }
                }
            }
            else {
                eCode = this._eUnknownCode;
                // if(arguments.length > 0){
                pInfo = new Array(arguments.length);
                var i: uint = 0;

                for (i = 0; i < pInfo.length; i++) {
                    pInfo[i] = arguments[i];
                }
                // }
                // else {
                //     pInfo = null;    
                // }
            }

            var pCodeInfo: AICodeInfo = this._pCodeInfoMap[eCode];
            if (isDef(pCodeInfo)) {
                sMessage = pCodeInfo.message;
            }
        }

        var pLogEntity: AILoggerEntity = this._pLastLogEntity;

        pLogEntity.code = eCode;
        pLogEntity.location = this._pCurrentSourceLocation;
        pLogEntity.message = sMessage;
        pLogEntity.info = pInfo;

        return pLogEntity;
    }

    private getCodeRoutineFunc(eCode: uint, eLevel: AELogLevel): AILogRoutineFunc {
        var pCodeInfo: AICodeInfo = this._pCodeInfoMap[eCode];
        var fnLogRoutine: AILogRoutineFunc;

        if (!isDef(pCodeInfo)) {
            fnLogRoutine = this._pGeneralRoutineMap[eLevel];
            return isDef(fnLogRoutine) ? fnLogRoutine : null;
        }

        var pCodeFamilyRoutineMap: AILogRoutineMap = this._pCodeFamilyRoutineDMap[pCodeInfo.familyName];

        if (!isDef(pCodeFamilyRoutineMap) || !isDef(pCodeFamilyRoutineMap[eLevel])) {
            fnLogRoutine = this._pGeneralRoutineMap[eLevel];
            return isDef(fnLogRoutine) ? fnLogRoutine : null;
        }

        fnLogRoutine = pCodeFamilyRoutineMap[eLevel];

        return fnLogRoutine;
    }
}

export var logger: AILogger = null;

var fnLog;
var fnAssert;

if (has("DEBUG")) {

    logger = Logger.getInstance();

    logger.init();
    logger.setUnknownCode(cfg.unknownCode, cfg.unknownMessage);
    logger.setLogLevel(AELogLevel.ALL);

    //Default code families

    logger.registerCodeFamily(0, 100, "SystemCodes");
    logger.registerCodeFamily(2000, 2199, "ParserSyntaxErrors");
    logger.registerCodeFamily(2200, 2500, "EffectSyntaxErrors");

    //Default log routines

    function sourceLocationToString(pLocation: AISourceLocation): string {
        var pDate: Date = new Date;
        var sTime: string = pDate.getHours() + ":" + pDate.getMinutes() + "." + pDate.getSeconds();
        var sLocation: string = "[" + pLocation.file + ":" + pLocation.line.toString() + " " + sTime + "]: ";
        return sLocation;
    }

    function logRoutine(pLogEntity: AILoggerEntity): void {
        var pArgs: any[] = pLogEntity.info;

        var sLocation: string = sourceLocationToString(pLogEntity.location);

        if (isString(pArgs[0])) {
            pArgs[0] = sLocation + " " + pArgs[0];
        }
        else {
            pArgs.unshift(sLocation);
        }

        console["log"].apply(console, pArgs);
    }

    function warningRoutine(pLogEntity: AILoggerEntity): void {
        var pArgs: any[] = pLogEntity.info;

        var sCodeInfo: string = "Code: " + pLogEntity.code.toString() + ".";
        var sLocation: string = sourceLocationToString(pLogEntity.location);

        if (isString(pArgs[0])) {
            pArgs[0] = sLocation + " " + sCodeInfo + " " + pArgs[0];
        }
        else {
            pArgs.unshift(sLocation + " " + sCodeInfo);
        }

        console["warn"].apply(console, pArgs);
    }

    function errorRoutine(pLogEntity: AILoggerEntity): void {
        var pArgs: any[] = pLogEntity.info;

        var sMessage: string = pLogEntity.message;
        var sCodeInfo: string = "Error code: " + pLogEntity.code.toString() + ".";
        var sLocation: string = sourceLocationToString(pLogEntity.location);

        if (isString(pArgs[0])) {
            pArgs[0] = sLocation + " " + sCodeInfo + " " + sMessage + " " + pArgs[0];
        }
        else {
            pArgs.unshift(sLocation + " " + sCodeInfo + " " + sMessage);
        }

        console["error"].apply(console, pArgs);
    }


    logger.setLogRoutine(logRoutine, AELogLevel.LOG | AELogLevel.INFORMATION);
    logger.setLogRoutine(warningRoutine, AELogLevel.WARNING);
    logger.setLogRoutine(errorRoutine, AELogLevel.ERROR | AELogLevel.CRITICAL);


    fnLog = function () {
        var stack = (<any>new Error()).stack;
        var file = stack.split("\n")[2].split("/")[4].split("?")[0]
        var line = stack.split("\n")[2].split(":")[5];

        logger.setSourceLocation(file, line);
        logger.log.apply(logger, arguments);
    }

    fnAssert = fnLog;
}

export var log: AILogPrint = fnLog;
export var warn: AILogPrint = fnLog;
export var error: AILogPrint = fnLog;
export var critical: AILogPrint = fnLog;
export var info: AILogPrint = fnLog;
export var assert: AILogAssert = fnAssert;

