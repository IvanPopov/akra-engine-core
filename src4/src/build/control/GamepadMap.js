/// <reference path="../idl/3d-party/gamepad.d.ts" />
/// <reference path="../idl/IGamepadMap.ts" />
var akra;
(function (akra) {
    //export var TYPICAL_BUTTON_COUNT = 16;
    //export var TYPICAL_AXIS_COUNT = 4;
    /// <reference path="../logger.ts" />
    /// <reference path="../debug.ts" />
    /// <reference path="../info/info.ts" />
    /// <reference path="../util/ObjectArray.ts" />
    /// <reference path="../events.ts" />
    /// <reference path="../guid.ts" />
    (function (control) {
        var ObjectArray = akra.util.ObjectArray;

        var GamepadMap = (function () {
            function GamepadMap() {
                this.guid = akra.guid();
                this._bTicking = false;
                this._pCollection = new ObjectArray();
                this._pPrevRawGamepadTypes = [null, null, null, null];
                this._pPrevTimestamps = [0, 0, 0, 0];
                this.setupSignals();
            }
            GamepadMap.prototype.setupSignals = function () {
                this.connected = this.connected || new akra.Signal(this);
                this.disconnected = this.disconnected || new akra.Signal(this);
                this.updated = this.updated || new akra.Signal(this);
            };

            GamepadMap.prototype.init = function () {
                var _this = this;
                if (!akra.info.api.getGamepad()) {
                    akra.logger.warn("Gamepad API is unsupported.");
                    return false;
                }

                var pCollection = this._pCollection;

                window.addEventListener('MozGamepadConnected', function (e) {
                    pCollection.push(e.gamepad);
                    _this.connected.emit(e.gamepad);
                    _this.startPolling();
                }, false);

                window.addEventListener('MozGamepadDisconnected', function (e) {
                    for (var i = 0; i < pCollection.getLength(); ++i) {
                        if (pCollection.value(i).index == e.gamepad.index) {
                            _this.disconnected.emit(pCollection.takeAt(i));
                            break;
                        }
                    }

                    if (pCollection.getLength() === 0) {
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
                    if (akra.isString(arguments[0])) {
                        sID = arguments[0];
                    } else if (akra.isInt(arguments[0])) {
                        i = arguments[0];
                    }
                }

                if (!akra.isNull(sID)) {
                    for (i = 0; i < this._pCollection.getLength(); ++i) {
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

                for (var i = 0; i < this._pCollection.getLength(); ++i) {
                    var pGamepad = this._pCollection.value(i);

                    if (pGamepad.timestamp && (pGamepad.timestamp == this._pPrevTimestamps[i])) {
                        continue;
                    }

                    this._pPrevTimestamps[i] = pGamepad.timestamp;
                }
            };

            GamepadMap.prototype.pollGamepads = function () {
                var pRawGamepads = (navigator.getGamepads && navigator.getGamepads()) || navigator.gamepads;
                if (akra.isDefAndNotNull(pRawGamepads)) {
                    this._pCollection.clear();

                    var isGamepadsChanged = false;

                    for (var i = 0; i < pRawGamepads.length; i++) {
                        if (typeof pRawGamepads[i] != this._pPrevRawGamepadTypes[i]) {
                            isGamepadsChanged = true;
                            this._pPrevRawGamepadTypes[i] = typeof pRawGamepads[i];

                            if (akra.isDefAndNotNull(pRawGamepads[i])) {
                                akra.debug.log("gamepad " + i + " updated: " + pRawGamepads[i].id);
                                this.updated.emit(pRawGamepads[i]);
                            }
                        }

                        if (akra.isDefAndNotNull(pRawGamepads[i])) {
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
        control.GamepadMap = GamepadMap;
    })(akra.control || (akra.control = {}));
    var control = akra.control;
})(akra || (akra = {}));
//# sourceMappingURL=GamepadMap.js.map
