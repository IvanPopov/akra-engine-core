/**
 * @param {Function} d
 * @param {Function} b
 */
function __extends(d, b) {
  for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
  /** @constructor */ function __() { this.constructor = d; }
  __.prototype = b.prototype;
  d.prototype = new __();
}

var akra = {};

/**
 * / <reference path="../idl/ILogger.ts" />
 * / <reference path="../common.ts" />
 * / <reference path="../bf/bf.ts" />
 * / <reference path="../util/Singleton.ts" />
 */
akra.util = {};

/**
 * @typedef {Object.<number, akra.ILogRoutineFunc>}
 */
akra.util.ILogRoutineMap;

/**
 * @interface
 */
akra.util.AICodeFamily = function () {
};

/** @type {string} */ akra.util.AICodeFamily.prototype.familyName;
/** @type {number} */ akra.util.AICodeFamily.prototype.codeMin;
/** @type {number} */ akra.util.AICodeFamily.prototype.codeMax;

/**
 * @typedef {Object.<string, akra.util.AICodeFamily>}
 */
akra.util.AICodeFamilyMap;

/**
 * @interface
 */
akra.util.AICodeInfo = function () {
};

/** @type {number} */ akra.util.AICodeInfo.prototype.code;
/** @type {string} */ akra.util.AICodeInfo.prototype.message;
/** @type {string} */ akra.util.AICodeInfo.prototype.familyName;

/**
 * @typedef {Object.<number, akra.util.AICodeInfo>}
 */
akra.util.AICodeInfoMap;

/**
 * @typedef {Object.<string, akra.util.ILogRoutineMap>}
 */
akra.util.AICodeFamilyRoutineDMap;

/**
 * @constructor
 * @struct
 * @extends {akra.util.Singleton}
 * @implements {akra.ILogger}
 */
akra.util.Logger = function () {
  akra.util.Singleton.call(this);
  /** @type {akra.ELogLevel} */ this._eLogLevel;
  /** @type {akra.util.ILogRoutineMap} */ this._pGeneralRoutineMap;
  /** @type {akra.ISourceLocation} */ this._pCurrentSourceLocation;
  /** @type {akra.ILoggerEntity} */ this._pLastLogEntity;
  /** @type {Array.<akra.util.AICodeFamily>} */ this._pCodeFamilyList;
  /** @type {akra.util.AICodeFamilyMap} */ this._pCodeFamilyMap;
  /** @type {akra.util.AICodeInfoMap} */ this._pCodeInfoMap;
  /** @type {akra.util.AICodeFamilyRoutineDMap} */ this._pCodeFamilyRoutineDMap;
  /** @type {number} */ this._nFamilyGenerator;
  /** @type {number} */ this._eUnknownCode;
  /** @type {string} */ this._sUnknownMessage;

  this._eUnknownCode = 0;
  this._sUnknownMessage = "Unknown code";

  this._eLogLevel = akra.ELogLevel.ALL;
  this._pGeneralRoutineMap = /** @type {akra.util.ILogRoutineMap} */ ({});

  this._pCurrentSourceLocation = /** @type {akra.ISourceLocation} */ ({
    file: "",
    line: 0
  });

  this._pLastLogEntity = /** @type {akra.ILoggerEntity} */ ({
    code: this._eUnknownCode,
    location: this._pCurrentSourceLocation,
    message: this._sUnknownMessage,
    info: null
  });

  this._pCodeFamilyMap = /** @type {akra.util.AICodeFamilyMap} */ ({});
  this._pCodeFamilyList = /** @type {Array.<akra.util.AICodeFamily>} */ ([]);
  this._pCodeInfoMap = /** @type {akra.util.AICodeInfoMap} */ ({});

  this._pCodeFamilyRoutineDMap = /** @type {akra.util.AICodeFamilyRoutineDMap} */ ({});

  this._nFamilyGenerator = 0;
};

__extends(akra.util.Logger, akra.util.Singleton);

/**
 * @returns {boolean}
 */
akra.util.Logger.prototype.init = function () {
  //TODO: Load file
  return true;
};

/**
 * @param {akra.ELogLevel} eLevel
 */
akra.util.Logger.prototype.setLogLevel = function (eLevel) {
  this._eLogLevel = eLevel;
};

/**
 * @returns {akra.ELogLevel}
 */
akra.util.Logger.prototype.getLogLevel = function () {
  return this._eLogLevel;
};

/**
 * @param {number} eCode
 * @param {string=} sMessage
 * @returns {boolean}
 */
akra.util.Logger.prototype.registerCode = function (eCode, sMessage) {
  if (typeof sMessage === "undefined") sMessage = this._sUnknownMessage;
  if (this.isUsedCode(eCode)) {
    return false;
  }

  /** @type {string} */ var sFamilyName = this.getFamilyName(eCode);
  if (akra.isNull(sFamilyName)) {
    return false;
  }

  /** @type {akra.util.AICodeInfo} */ var pCodeInfo = /** @type {akra.util.AICodeInfo} */ ({
    code: eCode,
    message: sMessage,
    familyName: sFamilyName
  });

  this._pCodeInfoMap[eCode] = pCodeInfo;

  return true;
};

/**
 * @param {number} eCode
 * @param {string} sMessage
 */
akra.util.Logger.prototype.setUnknownCode = function (eCode, sMessage) {
  this._eUnknownCode = eCode;
  this._sUnknownMessage = sMessage;
};

/**
 * @param {number} eCodeMin
 * @param {number} eCodeMax
 * @param {string=} sFamilyName
 * @returns {boolean}
 */
akra.util.Logger.prototype.registerCodeFamily = function (eCodeMin, eCodeMax, sFamilyName) {
  if (typeof sFamilyName === "undefined") sFamilyName = this.generateFamilyName();
  if (this.isUsedFamilyName(sFamilyName)) {
    return false;
  }

  if (!this.isValidCodeInterval(eCodeMin, eCodeMax)) {
    return false;
  }

  /** @type {akra.util.AICodeFamily} */ var pCodeFamily = /** @type {akra.util.AICodeFamily} */ ({
    familyName: sFamilyName,
    codeMin: eCodeMin,
    codeMax: eCodeMax
  });

  this._pCodeFamilyMap[sFamilyName] = pCodeFamily;
  this._pCodeFamilyList.push(pCodeFamily);

  return true;
};

/**
 * @param {?} eCode
 * @returns {string}
 */
akra.util.Logger.prototype.getFamilyName = function (eCode) {
  /** @type {number} */ var i = 0;
  /** @type {Array.<akra.util.AICodeFamily>} */ var pCodeFamilyList = this._pCodeFamilyList;
  /** @type {akra.util.AICodeFamily} */ var pCodeFamily;

  for (i = 0; i < pCodeFamilyList.length; i++) {
    pCodeFamily = pCodeFamilyList[i];

    if (pCodeFamily.codeMin <= eCode && pCodeFamily.codeMax >= eCode) {
      return pCodeFamily.familyName;
    }
  }

  return null;
};

/**
 * @type {(?function(number, akra.ILogRoutineFunc, number): boolean|?function(string, akra.ILogRoutineFunc, number): boolean|?function(): boolean)}
 */
akra.util.Logger.prototype.setCodeFamilyRoutine = function () {
  /** @type {string} */ var sFamilyName = null;
  /** @type {akra.ILogRoutineFunc} */ var fnLogRoutine = null;
  /** @type {akra.ELogLevel} */ var eLevel = akra.ELogLevel.LOG;

  if (akra.isInt(arguments[0])) {
    sFamilyName = this.getFamilyName(arguments[0]);
    fnLogRoutine = arguments[1];
    eLevel = arguments[2];

    if (akra.isNull(sFamilyName)) {
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

  /** @type {akra.util.ILogRoutineMap} */ var pCodeFamilyRoutineMap = this._pCodeFamilyRoutineDMap[sFamilyName];

  if (!akra.isDef(pCodeFamilyRoutineMap)) {
    pCodeFamilyRoutineMap = this._pCodeFamilyRoutineDMap[sFamilyName] = /** @type {akra.util.ILogRoutineMap} */ ({});
  }

  if (akra.bf.testAll(eLevel, akra.ELogLevel.LOG)) {
    pCodeFamilyRoutineMap[akra.ELogLevel.LOG] = fnLogRoutine;
  }
  if (akra.bf.testAll(eLevel, akra.ELogLevel.INFORMATION)) {
    pCodeFamilyRoutineMap[akra.ELogLevel.INFORMATION] = fnLogRoutine;
  }
  if (akra.bf.testAll(eLevel, akra.ELogLevel.WARNING)) {
    pCodeFamilyRoutineMap[akra.ELogLevel.WARNING] = fnLogRoutine;
  }
  if (akra.bf.testAll(eLevel, akra.ELogLevel.ERROR)) {
    pCodeFamilyRoutineMap[akra.ELogLevel.ERROR] = fnLogRoutine;
  }
  if (akra.bf.testAll(eLevel, akra.ELogLevel.CRITICAL)) {
    pCodeFamilyRoutineMap[akra.ELogLevel.CRITICAL] = fnLogRoutine;
  }

  return true;
};

/**
 * @param {akra.ILogRoutineFunc} fnLogRoutine
 * @param {number} eLevel
 */
akra.util.Logger.prototype.setLogRoutine = function (fnLogRoutine, eLevel) {
  if (akra.bf.testAll(eLevel, akra.ELogLevel.LOG)) {
    this._pGeneralRoutineMap[akra.ELogLevel.LOG] = fnLogRoutine;
  }
  if (akra.bf.testAll(eLevel, akra.ELogLevel.INFORMATION)) {
    this._pGeneralRoutineMap[akra.ELogLevel.INFORMATION] = fnLogRoutine;
  }
  if (akra.bf.testAll(eLevel, akra.ELogLevel.WARNING)) {
    this._pGeneralRoutineMap[akra.ELogLevel.WARNING] = fnLogRoutine;
  }
  if (akra.bf.testAll(eLevel, akra.ELogLevel.ERROR)) {
    this._pGeneralRoutineMap[akra.ELogLevel.ERROR] = fnLogRoutine;
  }
  if (akra.bf.testAll(eLevel, akra.ELogLevel.CRITICAL)) {
    this._pGeneralRoutineMap[akra.ELogLevel.CRITICAL] = fnLogRoutine;
  }
};

/**
 * @type {(?function(string, number)|?function(akra.ISourceLocation)|?function())}
 */
akra.util.Logger.prototype.setSourceLocation = function () {
  /** @type {string} */ var sFile;
  /** @type {number} */ var iLine;

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

/**
 * @param {...?} pArgs$rest
 */
akra.util.Logger.prototype.log = function (pArgs$rest) {
  /** @type {Array.<?>} */ var pArgs = [];
  for (var _i = 0; _i < arguments.length; _i++) {
    pArgs[_i] = arguments[_i];
  }
  if (!akra.bf.testAll(this._eLogLevel, akra.ELogLevel.LOG)) {
    return;
  }

  /** @type {akra.ILogRoutineFunc} */ var fnLogRoutine = this._pGeneralRoutineMap[akra.ELogLevel.LOG];
  if (!akra.isDef(fnLogRoutine)) {
    return;
  }

  /** @type {akra.ILoggerEntity} */ var pLogEntity = this._pLastLogEntity;

  pLogEntity.code = this._eUnknownCode;
  pLogEntity.location = this._pCurrentSourceLocation;
  pLogEntity.info = pArgs;
  pLogEntity.message = this._sUnknownMessage;

  fnLogRoutine.call(null, pLogEntity);
};

/**
 * @type {(?function(akra.ILoggerEntity)|?function(number, ...[?])|?function(...[?])|?function())}
 */
akra.util.Logger.prototype.info = function () {
  if (!akra.bf.testAll(this._eLogLevel, akra.ELogLevel.INFORMATION)) {
    return;
  }

  /** @type {akra.ILoggerEntity} */ var pLogEntity;
  /** @type {akra.ILogRoutineFunc} */ var fnLogRoutine;

  pLogEntity = this.prepareLogEntity.apply(this, arguments);
  fnLogRoutine = this.getCodeRoutineFunc(pLogEntity.code, akra.ELogLevel.INFORMATION);

  if (akra.isNull(fnLogRoutine)) {
    return;
  }

  fnLogRoutine.call(null, pLogEntity);
};

/**
 * @type {(?function(akra.ILoggerEntity)|?function(number, ...[?])|?function(...[?])|?function())}
 */
akra.util.Logger.prototype.warn = function () {
  if (!akra.bf.testAll(this._eLogLevel, akra.ELogLevel.WARNING)) {
    return;
  }

  /** @type {akra.ILoggerEntity} */ var pLogEntity;
  /** @type {akra.ILogRoutineFunc} */ var fnLogRoutine;

  pLogEntity = this.prepareLogEntity.apply(this, arguments);
  fnLogRoutine = this.getCodeRoutineFunc(pLogEntity.code, akra.ELogLevel.WARNING);

  if (akra.isNull(fnLogRoutine)) {
    return;
  }

  fnLogRoutine.call(null, pLogEntity);
};

/**
 * @type {(?function(akra.ILoggerEntity)|?function(number, ...[?])|?function(...[?])|?function())}
 */
akra.util.Logger.prototype.error = function () {
  if (!akra.bf.testAll(this._eLogLevel, akra.ELogLevel.ERROR)) {
    return;
  }

  /** @type {akra.ILoggerEntity} */ var pLogEntity;
  /** @type {akra.ILogRoutineFunc} */ var fnLogRoutine;

  pLogEntity = this.prepareLogEntity.apply(this, arguments);
  fnLogRoutine = this.getCodeRoutineFunc(pLogEntity.code, akra.ELogLevel.ERROR);

  if (akra.isNull(fnLogRoutine)) {
    return;
  }

  fnLogRoutine.call(null, pLogEntity);
};

/**
 * @type {(?function(akra.ILoggerEntity)|?function(number, ...[?])|?function(...[?])|?function())}
 */
akra.util.Logger.prototype.critical = function () {
  /** @type {akra.ILoggerEntity} */ var pLogEntity;
  /** @type {akra.ILogRoutineFunc} */ var fnLogRoutine;

  pLogEntity = this.prepareLogEntity.apply(this, arguments);
  fnLogRoutine = this.getCodeRoutineFunc(pLogEntity.code, akra.ELogLevel.CRITICAL);

  /** @type {string} */ var sSystemMessage = "A Critical error has occured! Code: " + pLogEntity.code.toString();

  if (akra.bf.testAll(this._eLogLevel, akra.ELogLevel.CRITICAL) && !akra.isNull(fnLogRoutine)) {
    fnLogRoutine.call(null, pLogEntity);
  }

  alert(sSystemMessage);
  throw new Error(sSystemMessage);
};

/**
 * @type {(?function(boolean, akra.ILoggerEntity)|?function(boolean, number, ...[?])|?function(boolean, ...[?])|?function())}
 */
akra.util.Logger.prototype.assert = function () {
  /** @type {boolean} */ var bCondition = /** @type {boolean} */ (arguments[0]);

  if (!bCondition) {
    /** @type {akra.ILoggerEntity} */ var pLogEntity;
    /** @type {akra.ILogRoutineFunc} */ var fnLogRoutine;

    /** @type {Array.<?>} */ var pArgs = [];

    for (var i = 1; i < arguments.length; i++) {
      pArgs[i - 1] = arguments[i];
    }

    pLogEntity = this.prepareLogEntity.apply(this, pArgs);
    fnLogRoutine = this.getCodeRoutineFunc(pLogEntity.code, akra.ELogLevel.CRITICAL);

    /** @type {string} */ var sSystemMessage = "A error has occured! Code: " + pLogEntity.code.toString() + "\n Accept to exit, refuse to continue.";

    if (akra.bf.testAll(this._eLogLevel, akra.ELogLevel.CRITICAL) && !akra.isNull(fnLogRoutine)) {
      fnLogRoutine.call(null, pLogEntity);
    }

    if (confirm(sSystemMessage)) {
      throw new Error(sSystemMessage);
    }
  }
};

/**
 * @type {(?function(boolean, akra.ILoggerEntity)|?function(boolean, number, ...[?])|?function(boolean, ...[?])|?function())}
 */
akra.util.Logger.prototype.presume = function () {
};

/**
 * @returns {string}
 */
akra.util.Logger.prototype.generateFamilyName = function () {
  /** @type {string} */ var sSuffix = /** @type {string} */ (/** @type {?} */ ((this._nFamilyGenerator++)));
  /** @type {string} */ var sName = akra.util.Logger._sDefaultFamilyName + sSuffix;

  if (this.isUsedFamilyName(sName)) {
    return this.generateFamilyName();
  } else {
    return sName;
  }
};

/**
 * @param {number} eCodeMin
 * @param {number} eCodeMax
 * @returns {boolean}
 */
akra.util.Logger.prototype.isValidCodeInterval = function (eCodeMin, eCodeMax) {
  if (eCodeMin > eCodeMax) {
    return false;
  }

  /** @type {number} */ var i = 0;
  /** @type {Array.<akra.util.AICodeFamily>} */ var pCodeFamilyList = this._pCodeFamilyList;
  /** @type {akra.util.AICodeFamily} */ var pCodeFamily;

  for (i = 0; i < pCodeFamilyList.length; i++) {
    pCodeFamily = pCodeFamilyList[i];

    if ((pCodeFamily.codeMin <= eCodeMin && pCodeFamily.codeMax >= eCodeMin) || (pCodeFamily.codeMin <= eCodeMax && pCodeFamily.codeMax >= eCodeMax)) {
      return false;
    }
  }

  return true;
};

/**
 * @param {string} sFamilyName
 * @returns {boolean}
 */
akra.util.Logger.prototype.isUsedFamilyName = function (sFamilyName) {
  return akra.isDef(this._pCodeFamilyMap[sFamilyName]);
};

/**
 * @param {number} eCode
 * @returns {boolean}
 */
akra.util.Logger.prototype.isUsedCode = function (eCode) {
  return akra.isDef(this._pCodeInfoMap[eCode]);
};

/**
 * @param {?} pObj
 * @returns {boolean}
 */
akra.util.Logger.prototype.isLogEntity = function (pObj) {
  if (akra.isObject(pObj) && akra.isDef(pObj.code) && akra.isDef(pObj.location)) {
    return true;
  }

  return false;
};

/**
 * @param {?} eCode
 * @returns {boolean}
 */
akra.util.Logger.prototype.isLogCode = function (eCode) {
  return akra.isInt(eCode);
};

/**
 * @type {(?function(akra.ILoggerEntity): akra.ILoggerEntity|?function(number, ...[?]): akra.ILoggerEntity|?function(...[?]): akra.ILoggerEntity|?function(): akra.ILoggerEntity)}
 */
akra.util.Logger.prototype.prepareLogEntity = function () {
  /** @type {number} */ var eCode = this._eUnknownCode;
  /** @type {string} */ var sMessage = this._sUnknownMessage;
  /** @type {?} */ var pInfo = null;

  if (arguments.length === 1 && this.isLogEntity(arguments[0])) {
    /** @type {akra.ILoggerEntity} */ var pEntity = arguments[0];

    eCode = pEntity.code;
    pInfo = pEntity.info;
    this.setSourceLocation(pEntity.location);

    if (!akra.isDef(pEntity.message)) {
      /** @type {akra.util.AICodeInfo} */ var pCodeInfo = this._pCodeInfoMap[eCode];
      if (akra.isDef(pCodeInfo)) {
        sMessage = pCodeInfo.message;
      }
    }
  } else {
    if (this.isLogCode(arguments[0])) {
      eCode = /** @type {number} */ (arguments[0]);
      if (arguments.length > 1) {
        pInfo = new Array(arguments.length - 1);
        /** @type {number} */ var i = 0;

        for (i = 0; i < pInfo.length; i++) {
          pInfo[i] = arguments[i + 1];
        }
      }
    } else {
      eCode = this._eUnknownCode;

      // if(arguments.length > 0){
      pInfo = new Array(arguments.length);
      i = 0;

      for (i = 0; i < pInfo.length; i++) {
        pInfo[i] = arguments[i];
      }
      // }
      // else {
      //     pInfo = null;
      // }
    }

    pCodeInfo = this._pCodeInfoMap[eCode];
    if (akra.isDef(pCodeInfo)) {
      sMessage = pCodeInfo.message;
    }
  }

  /** @type {akra.ILoggerEntity} */ var pLogEntity = this._pLastLogEntity;

  pLogEntity.code = eCode;
  pLogEntity.location = this._pCurrentSourceLocation;
  pLogEntity.message = sMessage;
  pLogEntity.info = pInfo;

  return pLogEntity;
};

/**
 * @param {number} eCode
 * @param {akra.ELogLevel} eLevel
 * @returns {akra.ILogRoutineFunc}
 */
akra.util.Logger.prototype.getCodeRoutineFunc = function (eCode, eLevel) {
  /** @type {akra.util.AICodeInfo} */ var pCodeInfo = this._pCodeInfoMap[eCode];
  /** @type {akra.ILogRoutineFunc} */ var fnLogRoutine;

  if (!akra.isDef(pCodeInfo)) {
    fnLogRoutine = this._pGeneralRoutineMap[eLevel];
    return akra.isDef(fnLogRoutine) ? fnLogRoutine : null;
  }

  /** @type {akra.util.ILogRoutineMap} */ var pCodeFamilyRoutineMap = this._pCodeFamilyRoutineDMap[pCodeInfo.familyName];

  if (!akra.isDef(pCodeFamilyRoutineMap) || !akra.isDef(pCodeFamilyRoutineMap[eLevel])) {
    fnLogRoutine = this._pGeneralRoutineMap[eLevel];
    return akra.isDef(fnLogRoutine) ? fnLogRoutine : null;
  }

  fnLogRoutine = pCodeFamilyRoutineMap[eLevel];

  return fnLogRoutine;
};

/** @type {string} */ akra.util.Logger._sDefaultFamilyName = "CodeFamily";
