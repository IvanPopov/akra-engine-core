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
            var sErrorMessage;
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
                    sMessage = this._getMessageFromCode(pEntity.code, pEntity.info);
                    pLocation = pEntity.position;
                    sHint = pEntity.hint;
                } else {
                    if(isInt(arguments[0])) {
                        var eCode = arguments[0];
                        sMessage = this._getMessageFromCode(eCode);
                        pLocation = arguments[1] || null;
                        sHint = arguments[2] || "";
                    } else {
                        return;
                    }
                }
            }
            sErrorMessage = this._prepareMessage(pLocation, sMessage, sHint);
            this._printMessage(sErrorMessage, ELogLevel.ERROR);
        };
        Logger.prototype.warning = function () {
        };
        Logger.prototype.info = function () {
        };
        Logger.prototype.debug_error = function () {
        };
        Logger.prototype.debug_warning = function () {
        };
        Logger.prototype.debug_info = function () {
        };
        Logger.prototype._printMessage = function (sMessage, eLevel) {
            this._pLogRoutineMap[eLevel].call(null, sMessage);
        };
        Logger.prototype._getMessageFromCode = function (eCode, pInfo) {
            if (typeof pInfo === "undefined") { pInfo = null; }
            return "";
        };
        Logger.prototype._prepareMessage = function (pLocation, sMessage, sHint) {
            return "";
        };
        return Logger;
    })();    
})(akra || (akra = {}));
