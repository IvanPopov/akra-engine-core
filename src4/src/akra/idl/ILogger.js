var akra = {};

/**
 * @enum {number}
 */
akra.ELogLevel = {
  NONE: 0x0000,
  LOG: 0x0001,
  INFORMATION: 0x0002,
  WARNING: 0x0004,
  ERROR: 0x0008,
  CRITICAL: 0x0010,
  ALL: 0x001F
};

/**
 * @typedef {?function(akra.ILoggerEntity)}
 */
akra.ILogRoutineFunc;

/**
 * @interface
 */
akra.ISourceLocation = function () {
};

/** @type {string} */ akra.ISourceLocation.prototype.file;
/** @type {number} */ akra.ISourceLocation.prototype.line;

/**
 * @interface
 */
akra.ILoggerEntity = function () {
};

/** @type {number} */ akra.ILoggerEntity.prototype.code;
/** @type {akra.ISourceLocation} */ akra.ILoggerEntity.prototype.location;
/** @type {string} */ akra.ILoggerEntity.prototype.message;
/** @type {?} */ akra.ILoggerEntity.prototype.info;

/**
 * @interface
 */
akra.ILogger = function () {
};

/**
 * @type {?function(): boolean}
 */
akra.ILogger.prototype.init;

/**
 * @type {?function(akra.ELogLevel)}
 */
akra.ILogger.prototype.setLogLevel;
/**
 * @type {?function(): akra.ELogLevel}
 */
akra.ILogger.prototype.getLogLevel;

/**
 * @type {?function(number, string=): boolean}
 */
akra.ILogger.prototype.registerCode;
/**
 * @type {?function(number, string)}
 */
akra.ILogger.prototype.setUnknownCode;

/**
 * @type {?function(number, number, string=): boolean}
 */
akra.ILogger.prototype.registerCodeFamily;

/**
 * @type {?function(number): string}
 */
akra.ILogger.prototype.getFamilyName;

/**
 * @type {(?function(number, akra.ILogRoutineFunc, number): boolean|?function(string, akra.ILogRoutineFunc, number): boolean)}
 */
akra.ILogger.prototype.setCodeFamilyRoutine;

/**
 * @type {?function(akra.ILogRoutineFunc, number)}
 */
akra.ILogger.prototype.setLogRoutine;

/**
 * @type {(?function(string, number)|?function(akra.ISourceLocation))}
 */
akra.ILogger.prototype.setSourceLocation;

/**
 * @type {?function(...[?]): ?}
 */
akra.ILogger.prototype.log;

/**
 * @type {(?function(akra.ILoggerEntity)|?function(number, ...[?])|?function(...[?]))}
 */
akra.ILogger.prototype.info;

/**
 * @type {(?function(akra.ILoggerEntity)|?function(number, ...[?])|?function(...[?]))}
 */
akra.ILogger.prototype.warn;

/**
 * @type {(?function(akra.ILoggerEntity)|?function(number, ...[?])|?function(...[?]))}
 */
akra.ILogger.prototype.error;

/**
 * @type {(?function(akra.ILoggerEntity)|?function(number, ...[?])|?function(...[?]))}
 */
akra.ILogger.prototype.critical;

/**
 * @type {(?function(boolean, akra.ILoggerEntity)|?function(boolean, number, ...[?])|?function(boolean, ...[?]))}
 */
akra.ILogger.prototype.assert;

/**
 * @type {(?function(boolean, akra.ILoggerEntity)|?function(boolean, number, ...[?]): ?|?function(boolean, ...[?]): ?)}
 */
akra.ILogger.prototype.presume;
