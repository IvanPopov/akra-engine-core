/// <reference path="../idl/ILogger.ts" />
/// <reference path="../common.ts" />
/// <reference path="../bf/bf.ts" />
/// <reference path="../util/Singleton.ts" />
var akra;
(function (akra) {
    (function (util) {
        var Logger = (function () {
            function Logger() {
                this._eUnknownCode = 0;
                this._sUnknownMessage = "Unknown code";

                this._eLogLevel = 31 /* ALL */;
                this._pGeneralRoutineMap = {};

                this._pCurrentSourceLocation = {
                    file: "",
                    line: 0
                };

                this._pLastLogEntity = {
                    code: this._eUnknownCode,
                    location: this._pCurrentSourceLocation,
                    message: this._sUnknownMessage,
                    info: null
                };

                this._pCodeFamilyMap = {};
                this._pCodeFamilyList = [];
                this._pCodeInfoMap = {};

                this._pCodeFamilyRoutineDMap = {};

                this._nFamilyGenerator = 0;
            }
            Logger.prototype.init = function () {
                //TODO: Load file
                return true;
            };

            Logger.prototype.setLogLevel = function (eLevel) {
                this._eLogLevel = eLevel;
            };

            Logger.prototype.getLogLevel = function () {
                return this._eLogLevel;
            };

            Logger.prototype.registerCode = function (eCode, sMessage) {
                if (typeof sMessage === "undefined") { sMessage = this._sUnknownMessage; }
                if (this.isUsedCode(eCode)) {
                    //debug.error("Error code " + String(eCode) + " already in use.");
                    return false;
                }

                var sFamilyName = this.getFamilyName(eCode);
                if (akra.isNull(sFamilyName)) {
                    return false;
                }

                var pCodeInfo = {
                    code: eCode,
                    message: sMessage,
                    familyName: sFamilyName
                };

                this._pCodeInfoMap[eCode] = pCodeInfo;

                return true;
            };

            Logger.prototype.setUnknownCode = function (eCode, sMessage) {
                this._eUnknownCode = eCode;
                this._sUnknownMessage = sMessage;
            };

            Logger.prototype.registerCodeFamily = function (eCodeMin, eCodeMax, sFamilyName) {
                if (typeof sFamilyName === "undefined") { sFamilyName = this.generateFamilyName(); }
                if (this.isUsedFamilyName(sFamilyName)) {
                    return false;
                }

                if (!this.isValidCodeInterval(eCodeMin, eCodeMax)) {
                    return false;
                }

                var pCodeFamily = {
                    familyName: sFamilyName,
                    codeMin: eCodeMin,
                    codeMax: eCodeMax
                };

                this._pCodeFamilyMap[sFamilyName] = pCodeFamily;
                this._pCodeFamilyList.push(pCodeFamily);

                return true;
            };

            Logger.prototype.getFamilyName = function (eCode) {
                var i = 0;
                var pCodeFamilyList = this._pCodeFamilyList;
                var pCodeFamily;

                for (i = 0; i < pCodeFamilyList.length; i++) {
                    pCodeFamily = pCodeFamilyList[i];

                    if (pCodeFamily.codeMin <= eCode && pCodeFamily.codeMax >= eCode) {
                        return pCodeFamily.familyName;
                    }
                }

                return "";
            };

            Logger.prototype.setCodeFamilyRoutine = function () {
                var sFamilyName = "";
                var fnLogRoutine = null;
                var eLevel = 1 /* LOG */;

                if (akra.isInt(arguments[0])) {
                    sFamilyName = this.getFamilyName(arguments[0]);
                    fnLogRoutine = arguments[1];
                    eLevel = arguments[2];

                    if (sFamilyName === "") {
                        return false;
                    }
                } else if (akra.isString(arguments[0])) {
                    sFamilyName = arguments[0];
                    fnLogRoutine = arguments[1];
                    eLevel = arguments[2];
                }

                if (!this.isUsedFamilyName(sFamilyName)) {
                    return false;
                }

                var pCodeFamilyRoutineMap = this._pCodeFamilyRoutineDMap[sFamilyName];

                if (!akra.isDef(pCodeFamilyRoutineMap)) {
                    pCodeFamilyRoutineMap = this._pCodeFamilyRoutineDMap[sFamilyName] = {};
                }

                if (akra.bf.testAll(eLevel, 1 /* LOG */)) {
                    pCodeFamilyRoutineMap[1 /* LOG */] = fnLogRoutine;
                }
                if (akra.bf.testAll(eLevel, 2 /* INFORMATION */)) {
                    pCodeFamilyRoutineMap[2 /* INFORMATION */] = fnLogRoutine;
                }
                if (akra.bf.testAll(eLevel, 4 /* WARNING */)) {
                    pCodeFamilyRoutineMap[4 /* WARNING */] = fnLogRoutine;
                }
                if (akra.bf.testAll(eLevel, 8 /* ERROR */)) {
                    pCodeFamilyRoutineMap[8 /* ERROR */] = fnLogRoutine;
                }
                if (akra.bf.testAll(eLevel, 16 /* CRITICAL */)) {
                    pCodeFamilyRoutineMap[16 /* CRITICAL */] = fnLogRoutine;
                }

                return true;
            };

            Logger.prototype.setLogRoutine = function (fnLogRoutine, eLevel) {
                if (akra.bf.testAll(eLevel, 1 /* LOG */)) {
                    this._pGeneralRoutineMap[1 /* LOG */] = fnLogRoutine;
                }
                if (akra.bf.testAll(eLevel, 2 /* INFORMATION */)) {
                    this._pGeneralRoutineMap[2 /* INFORMATION */] = fnLogRoutine;
                }
                if (akra.bf.testAll(eLevel, 4 /* WARNING */)) {
                    this._pGeneralRoutineMap[4 /* WARNING */] = fnLogRoutine;
                }
                if (akra.bf.testAll(eLevel, 8 /* ERROR */)) {
                    this._pGeneralRoutineMap[8 /* ERROR */] = fnLogRoutine;
                }
                if (akra.bf.testAll(eLevel, 16 /* CRITICAL */)) {
                    this._pGeneralRoutineMap[16 /* CRITICAL */] = fnLogRoutine;
                }
            };

            Logger.prototype.setSourceLocation = function () {
                var sFile;
                var iLine;

                if (arguments.length === 2) {
                    sFile = arguments[0];
                    iLine = arguments[1];
                } else {
                    if (akra.isDef(arguments[0]) && !(akra.isNull(arguments[0]))) {
                        sFile = arguments[0].file;
                        iLine = arguments[0].line;
                    } else {
                        sFile = "";
                        iLine = 0;
                    }
                }

                this._pCurrentSourceLocation.file = sFile;
                this._pCurrentSourceLocation.line = iLine;
            };

            Logger.prototype.time = function (sLabel) {
                console.time(sLabel);
            };

            Logger.prototype.timeEnd = function (sLabel) {
                console.timeEnd(sLabel);
            };

            Logger.prototype.group = function () {
                var pArgs = [];
                for (var _i = 0; _i < (arguments.length - 0); _i++) {
                    pArgs[_i] = arguments[_i + 0];
                }
                console.group.apply(console, arguments);
            };

            Logger.prototype.groupEnd = function () {
                console.groupEnd();
            };

            Logger.prototype.log = function () {
                var pArgs = [];
                for (var _i = 0; _i < (arguments.length - 0); _i++) {
                    pArgs[_i] = arguments[_i + 0];
                }
                if (!akra.bf.testAll(this._eLogLevel, 1 /* LOG */)) {
                    return;
                }

                var fnLogRoutine = this._pGeneralRoutineMap[1 /* LOG */];
                if (!akra.isDef(fnLogRoutine)) {
                    return;
                }

                var pLogEntity = this._pLastLogEntity;

                pLogEntity.code = this._eUnknownCode;
                pLogEntity.location = this._pCurrentSourceLocation;
                pLogEntity.info = pArgs;
                pLogEntity.message = this._sUnknownMessage;

                fnLogRoutine.call(null, pLogEntity);
            };

            Logger.prototype.info = function () {
                if (!akra.bf.testAll(this._eLogLevel, 2 /* INFORMATION */)) {
                    return;
                }

                var pLogEntity;
                var fnLogRoutine;

                pLogEntity = this.prepareLogEntity.apply(this, arguments);
                fnLogRoutine = this.getCodeRoutineFunc(pLogEntity.code, 2 /* INFORMATION */);

                if (akra.isNull(fnLogRoutine)) {
                    return;
                }

                fnLogRoutine.call(null, pLogEntity);
            };

            Logger.prototype.warn = function () {
                if (!akra.bf.testAll(this._eLogLevel, 4 /* WARNING */)) {
                    return;
                }

                var pLogEntity;
                var fnLogRoutine;

                pLogEntity = this.prepareLogEntity.apply(this, arguments);
                fnLogRoutine = this.getCodeRoutineFunc(pLogEntity.code, 4 /* WARNING */);

                if (akra.isNull(fnLogRoutine)) {
                    return;
                }

                fnLogRoutine.call(null, pLogEntity);
            };

            Logger.prototype.error = function () {
                if (!akra.bf.testAll(this._eLogLevel, 8 /* ERROR */)) {
                    return;
                }

                var pLogEntity;
                var fnLogRoutine;

                pLogEntity = this.prepareLogEntity.apply(this, arguments);
                fnLogRoutine = this.getCodeRoutineFunc(pLogEntity.code, 8 /* ERROR */);

                if (akra.isNull(fnLogRoutine)) {
                    return;
                }

                fnLogRoutine.call(null, pLogEntity);
            };

            Logger.prototype.critical = function () {
                var pLogEntity;
                var fnLogRoutine;

                pLogEntity = this.prepareLogEntity.apply(this, arguments);
                fnLogRoutine = this.getCodeRoutineFunc(pLogEntity.code, 16 /* CRITICAL */);

                var sSystemMessage = "A Critical error has occured! Code: " + pLogEntity.code.toString();

                if (akra.bf.testAll(this._eLogLevel, 16 /* CRITICAL */) && !akra.isNull(fnLogRoutine)) {
                    fnLogRoutine.call(null, pLogEntity);
                }

                alert(sSystemMessage);
                throw new Error(sSystemMessage);
            };

            Logger.prototype.assert = function () {
                var bCondition = arguments[0];

                if (!bCondition) {
                    var pLogEntity;
                    var fnLogRoutine;

                    var pArgs = [];

                    for (var i = 1; i < arguments.length; i++) {
                        pArgs[i - 1] = arguments[i];
                    }

                    pLogEntity = this.prepareLogEntity.apply(this, pArgs);
                    fnLogRoutine = this.getCodeRoutineFunc(pLogEntity.code, 16 /* CRITICAL */);

                    var sSystemMessage = "A error has occured! Code: " + pLogEntity.code.toString() + "\n Accept to exit, refuse to continue.";

                    if (akra.bf.testAll(this._eLogLevel, 16 /* CRITICAL */) && !akra.isNull(fnLogRoutine)) {
                        fnLogRoutine.call(null, pLogEntity);
                    }

                    if (confirm(sSystemMessage)) {
                        throw new Error(sSystemMessage);
                    }
                }
            };

            Logger.prototype.generateFamilyName = function () {
                var sSuffix = (this._nFamilyGenerator++);
                var sName = Logger._sDefaultFamilyName + sSuffix;

                if (this.isUsedFamilyName(sName)) {
                    return this.generateFamilyName();
                } else {
                    return sName;
                }
            };

            Logger.prototype.isValidCodeInterval = function (eCodeMin, eCodeMax) {
                if (eCodeMin > eCodeMax) {
                    return false;
                }

                var i = 0;
                var pCodeFamilyList = this._pCodeFamilyList;
                var pCodeFamily;

                for (i = 0; i < pCodeFamilyList.length; i++) {
                    pCodeFamily = pCodeFamilyList[i];

                    if ((pCodeFamily.codeMin <= eCodeMin && pCodeFamily.codeMax >= eCodeMin) || (pCodeFamily.codeMin <= eCodeMax && pCodeFamily.codeMax >= eCodeMax)) {
                        return false;
                    }
                }

                return true;
            };

            Logger.prototype.isUsedFamilyName = function (sFamilyName) {
                return akra.isDef(this._pCodeFamilyMap[sFamilyName]);
            };

            Logger.prototype.isUsedCode = function (eCode) {
                return akra.isDef(this._pCodeInfoMap[eCode]);
            };

            Logger.prototype.isLogEntity = function (pObj) {
                if (akra.isObject(pObj) && akra.isDef(pObj.code) && akra.isDef(pObj.location)) {
                    return true;
                }

                return false;
            };

            Logger.prototype.isLogCode = function (eCode) {
                return akra.isInt(eCode);
            };

            Logger.prototype.prepareLogEntity = function () {
                var eCode = this._eUnknownCode;
                var sMessage = this._sUnknownMessage;
                var pInfo = null;

                if (arguments.length === 1 && this.isLogEntity(arguments[0])) {
                    var pEntity = arguments[0];

                    eCode = pEntity.code;
                    pInfo = pEntity.info;
                    this.setSourceLocation(pEntity.location);

                    if (!akra.isDef(pEntity.message)) {
                        var pCodeInfo = this._pCodeInfoMap[eCode];
                        if (akra.isDef(pCodeInfo)) {
                            sMessage = pCodeInfo.message;
                        }
                    }
                } else {
                    if (this.isLogCode(arguments[0])) {
                        eCode = arguments[0];
                        if (arguments.length > 1) {
                            pInfo = new Array(arguments.length - 1);
                            var i = 0;

                            for (i = 0; i < pInfo.length; i++) {
                                pInfo[i] = arguments[i + 1];
                            }
                        }
                    } else {
                        eCode = this._eUnknownCode;

                        // if(arguments.length > 0){
                        pInfo = new Array(arguments.length);
                        var i = 0;

                        for (i = 0; i < pInfo.length; i++) {
                            pInfo[i] = arguments[i];
                        }
                        // }
                        // else {
                        //     pInfo = null;
                        // }
                    }

                    var pCodeInfo = this._pCodeInfoMap[eCode];
                    if (akra.isDef(pCodeInfo)) {
                        sMessage = pCodeInfo.message;
                    }
                }

                var pLogEntity = this._pLastLogEntity;

                pLogEntity.code = eCode;
                pLogEntity.location = this._pCurrentSourceLocation;
                pLogEntity.message = sMessage;
                pLogEntity.info = pInfo;

                return pLogEntity;
            };

            Logger.prototype.getCodeRoutineFunc = function (eCode, eLevel) {
                var pCodeInfo = this._pCodeInfoMap[eCode];
                var fnLogRoutine;

                if (!akra.isDef(pCodeInfo)) {
                    fnLogRoutine = this._pGeneralRoutineMap[eLevel];
                    return akra.isDef(fnLogRoutine) ? fnLogRoutine : null;
                }

                var pCodeFamilyRoutineMap = this._pCodeFamilyRoutineDMap[pCodeInfo.familyName];

                if (!akra.isDef(pCodeFamilyRoutineMap) || !akra.isDef(pCodeFamilyRoutineMap[eLevel])) {
                    fnLogRoutine = this._pGeneralRoutineMap[eLevel];
                    return akra.isDef(fnLogRoutine) ? fnLogRoutine : null;
                }

                fnLogRoutine = pCodeFamilyRoutineMap[eLevel];

                return fnLogRoutine;
            };
            Logger._sDefaultFamilyName = "CodeFamily";
            return Logger;
        })();
        util.Logger = Logger;
    })(akra.util || (akra.util = {}));
    var util = akra.util;
})(akra || (akra = {}));
//# sourceMappingURL=Logger.js.map
