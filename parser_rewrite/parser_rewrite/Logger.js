var akra;
(function (akra) {
    (function (bf) {
        bf.testAll = function (value, set) {
            return (((value) & (set)) == (set));
        };
    })(akra.bf || (akra.bf = {}));
    var bf = akra.bf;
})(akra || (akra = {}));
var akra;
(function (akra) {
    var isString = function (x) {
        return (typeof x === "string");
    };
    var isInt = function (x) {
        return (typeof x === "number");
    };
    var isObject = function (x) {
        return (typeof x === "object");
    };
    var isNull = function (x) {
        return (x === null);
    };
    var isDef = function (x) {
        return (x !== undefined);
    };
    (function (ELogLevel) {
        ELogLevel._map = [];
        ELogLevel.RELEASE = 0;
        ELogLevel.INFORMATION = 1;
        ELogLevel.ERROR = 2;
        ELogLevel.WARNING = 4;
        ELogLevel.LOG = 8;
        ELogLevel.DEBUG = 32;
        ELogLevel.DEBUG_INFORMATION = 64;
        ELogLevel.DEBUG_ERROR = 128;
        ELogLevel.DEBUG_WARNING = 256;
        ELogLevel.DEBUG_LOG = 512;
    })(akra.ELogLevel || (akra.ELogLevel = {}));
    var ELogLevel = akra.ELogLevel;
    var Logger = (function () {
        function Logger(pEngine) {
            this._pEngine = pEngine;
            this._pCodeMessagesMap = {
            };
            this._pCodeFormatCallbackMap = {
            };
            this._pLogRoutineMap = {
            };
        }
        Logger.prototype.init = function () {
            return true;
        };
        Logger.prototype.formatMessage = function (eCode, pEntity) {
            return "";
        };
        Logger.prototype.setLogLevel = function (eLevel) {
            if(!this._pEngine.isDebug() && eLevel > ELogLevel.DEBUG) {
                return false;
            }
            this._eLogLevel = eLevel;
        };
        Logger.prototype.getLogLevel = function () {
            return this._eLogLevel;
        };
        Logger.prototype.setLogRoutine = function (fnLogRoutine, eLevel) {
            if(this._pEngine.isDebug() && eLevel > ELogLevel.DEBUG) {
                return false;
            }
            return true;
        };
        Logger.prototype.log = function () {
            var pArgs = [];
            for (var _i = 0; _i < (arguments.length - 0); _i++) {
                pArgs[_i] = arguments[_i + 0];
            }
        };
        Logger.prototype.debug_log = function () {
            var pArgs = [];
            for (var _i = 0; _i < (arguments.length - 0); _i++) {
                pArgs[_i] = arguments[_i + 0];
            }
        };
        Logger.prototype.error = function () {
            var sMessage;
            sMessage = this.generateLoggerMessage.call(this, arguments[0], arguments[1], arguments[2]);
            this.printMessage(sMessage, ELogLevel.ERROR);
        };
        Logger.prototype.warning = function () {
            var sMessage;
            sMessage = this.generateLoggerMessage.call(this, arguments[0], arguments[1], arguments[2]);
            this.printMessage(sMessage, ELogLevel.WARNING);
        };
        Logger.prototype.info = function () {
            var sMessage;
            sMessage = this.generateLoggerMessage.call(this, arguments[0], arguments[1], arguments[2]);
            this.printMessage(sMessage, ELogLevel.INFORMATION);
        };
        Logger.prototype.debug_error = function () {
            if(!this._pEngine.isDebug()) {
                return;
            }
            var sMessage;
            sMessage = this.generateLoggerMessage.call(this, arguments[0], arguments[1], arguments[2]);
            this.printMessage(sMessage, ELogLevel.DEBUG_ERROR);
        };
        Logger.prototype.debug_warning = function () {
            if(!this._pEngine.isDebug()) {
                return;
            }
            var sMessage;
            sMessage = this.generateLoggerMessage.call(this, arguments[0], arguments[1], arguments[2]);
            this.printMessage(sMessage, ELogLevel.DEBUG_WARNING);
        };
        Logger.prototype.debug_info = function () {
            if(!this._pEngine.isDebug()) {
                return;
            }
            var sMessage;
            sMessage = this.generateLoggerMessage.call(this, arguments[0], arguments[1], arguments[2]);
            this.printMessage(sMessage, ELogLevel.DEBUG_INFORMATION);
        };
        Logger.prototype.generateLoggerMessage = function () {
            var sLoggerMessage;
            var sMessage;
            var pLocation;
            var sHint;
            if(isString(arguments[0])) {
                sMessage = arguments[0];
                pLocation = arguments[1] || null;
                sHint = "";
            } else {
                if(isObject(arguments[0])) {
                    var pEntity = arguments[0];
                    sMessage = this.getMessageFromCode(pEntity.code, pEntity.info);
                    pLocation = pEntity.position;
                    sHint = pEntity.hint;
                } else {
                    if(isInt(arguments[0])) {
                        var eCode = arguments[0];
                        sMessage = this.getMessageFromCode(eCode);
                        pLocation = arguments[1] || null;
                        sHint = arguments[2] || "";
                    } else {
                        return;
                    }
                }
            }
            sLoggerMessage = this.prepareMessage(pLocation, sMessage, sHint);
            return sLoggerMessage;
        };
        Logger.prototype.printMessage = function (sMessage, eLevel) {
            this._pLogRoutineMap[eLevel].call(null, sMessage);
        };
        Logger.prototype.getMessageFromCode = function (eCode, pInfo) {
            if (typeof pInfo === "undefined") { pInfo = null; }
            if(!isDef(this._pCodeMessagesMap[eCode])) {
                return "Code " + eCode + ": No Message";
                ; ;
            }
            return this._pCodeFormatCallbackMap[eCode].call(null, pInfo);
        };
        Logger.prototype.prepareMessage = function (pLocation, sMessage, sHint) {
            var sLogMessage;
            if(isNull(pLocation)) {
                sLogMessage += pLocation.toString() + ": ";
            } else {
                sLogMessage += "[Unknown]: ";
            }
            sLogMessage += sMessage;
            if(sHint != "") {
                sLogMessage += "\n Hint: " + sHint;
            }
            return sLogMessage;
        };
        return Logger;
    })();    
})(akra || (akra = {}));
