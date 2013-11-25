/// <reference path="../idl/3d-party/gamepad.d.ts" />
/// <reference path="../idl/AIGamepadMap.ts" />
define(["require", "exports", "logger", "debug", "info", "util/ObjectArray"], function(require, exports, __logger__, __debug__, __info__, __ObjectArray__) {
    //export var TYPICAL_BUTTON_COUNT = 16;
    //export var TYPICAL_AXIS_COUNT = 4;
    var logger = __logger__;
    var debug = __debug__;
    var info = __info__;
    var ObjectArray = __ObjectArray__;

    var GamepadMap = (function () {
        function GamepadMap() {
            this._bTicking = false;
            this._pCollection = new ObjectArray();
            this._pPrevRawGamepadTypes = [null, null, null, null];
            this._pPrevTimestamps = [0, 0, 0, 0];
        }
        GamepadMap.prototype.init = function () {
            var _this = this;
            if (!info.api.gamepad) {
                logger.warn("Gamepad API is unsupported.");
                return false;
            }

            var pCollection = this._pCollection;

            window.addEventListener('MozGamepadConnected', function (e) {
                pCollection.push(e.gamepad);
                _this.connected(e.gamepad);
                _this.startPolling();
            }, false);

            window.addEventListener('MozGamepadDisconnected', function (e) {
                for (var i = 0; i < pCollection.length; ++i) {
                    if (pCollection.value(i).index == e.gamepad.index) {
                        _this.disconnected(pCollection.takeAt(i));
                        break;
                    }
                }

                if (pCollection.length == 0) {
                    _this.stopPolling();
                }
            }, false);

            if (!!navigator.gamepads || !!navigator.getGamepads) {
                this.startPolling();
                return true;
            }

            return false;
        };

        GamepadMap.prototype.isActive = function () {
            return this._bTicking;
        };

        GamepadMap.prototype.find = function (id) {
            var sID = null;
            var i = 0;

            if (arguments.length) {
                if (isString(arguments[0])) {
                    sID = arguments[0];
                } else if (isInt(arguments[0])) {
                    i = arguments[0];
                }
            }

            if (!isNull(sID)) {
                for (i = 0; i < this._pCollection.length; ++i) {
                    if (this._pCollection.value(i).id == sID) {
                        return this._pCollection.value(i);
                    }
                }
            }

            return this._pCollection.value(i);
        };

        GamepadMap.prototype.startPolling = function () {
            if (!this._bTicking) {
                this._bTicking = true;
                this.update();
            }
        };

        GamepadMap.prototype.stopPolling = function () {
            this._bTicking = false;
        };

        GamepadMap.prototype.update = function () {
            this.pollStatus();
        };

        GamepadMap.prototype.pollStatus = function () {
            if (!this._bTicking) {
                return;
            }

            this.pollGamepads();

            for (var i = 0; i < this._pCollection.length; ++i) {
                var pGamepad = this._pCollection.value(i);

                if (pGamepad.timestamp && (pGamepad.timestamp == this._pPrevTimestamps[i])) {
                    continue;
                }

                this._pPrevTimestamps[i] = pGamepad.timestamp;
            }
        };

        GamepadMap.prototype.pollGamepads = function () {
            var pRawGamepads = (navigator.getGamepads && navigator.getGamepads()) || navigator.gamepads;
            if (isDefAndNotNull(pRawGamepads)) {
                this._pCollection.clear();

                var isGamepadsChanged = false;

                for (var i = 0; i < pRawGamepads.length; i++) {
                    if (typeof pRawGamepads[i] != this._pPrevRawGamepadTypes[i]) {
                        isGamepadsChanged = true;
                        this._pPrevRawGamepadTypes[i] = typeof pRawGamepads[i];

                        if (isDefAndNotNull(pRawGamepads[i])) {
                            debug.log("gamepad " + i + " updated: " + pRawGamepads[i].id);
                            this.updated(pRawGamepads[i]);
                        }
                    }

                    if (isDefAndNotNull(pRawGamepads[i])) {
                        this._pCollection.push(pRawGamepads[i]);
                    }
                }
                //if (isGamepadsChanged) {
                //todo: collection changed...
                //}
            }
        };
        return GamepadMap;
    })();

    
    return GamepadMap;
});
//# sourceMappingURL=GamepadMap.js.map
