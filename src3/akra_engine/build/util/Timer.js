/// <reference path="../idl/AIUtilTimer.ts" />
define(["require", "exports", "time", "logger"], function(require, exports, __time__, __logger__) {
    var time = __time__;
    var logger = __logger__;

    var Timer = (function () {
        function Timer() {
            this._isTimerInitialized = false;
            this._isTimerStopped = false;
            this._fTicksPerSec = 0.;
            this._iStopTime = 0;
            this._iLastElapsedTime = 0;
            this._iBaseTime = 0;
        }
        Object.defineProperty(Timer.prototype, "absoluteTime", {
            get: function () {
                return this.execCommand(4 /* TIMER_GET_ABSOLUTE_TIME */);
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(Timer.prototype, "appTime", {
            get: function () {
                return this.execCommand(5 /* TIMER_GET_APP_TIME */);
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(Timer.prototype, "elapsedTime", {
            get: function () {
                return this.execCommand(6 /* TIMER_GET_ELAPSED_TIME */);
            },
            enumerable: true,
            configurable: true
        });

        Timer.prototype.start = function () {
            return this.execCommand(1 /* TIMER_START */) === 0;
        };
        Timer.prototype.stop = function () {
            return this.execCommand(2 /* TIMER_STOP */) === 0;
        };

        Timer.prototype.reset = function () {
            return this.execCommand(0 /* TIMER_RESET */) === 0;
        };

        Timer.prototype.execCommand = function (eCommand) {
            var fTime = 0.;
            var fElapsedTime = 0.;
            var iTime;

            if (this._isTimerInitialized == false) {
                this._isTimerInitialized = true;
                this._fTicksPerSec = 1000;
            }

            if (this._iStopTime != 0 && eCommand != 1 /* TIMER_START */ && eCommand != 4 /* TIMER_GET_ABSOLUTE_TIME */) {
                iTime = this._iStopTime;
            } else {
                iTime = time();
            }

            if (eCommand == 6 /* TIMER_GET_ELAPSED_TIME */) {
                fElapsedTime = (iTime - this._iLastElapsedTime) / this._fTicksPerSec;

                // LOG(iTime - this.iLastElapsedTime,  this.fTicksPerSec, fElapsedTime);
                this._iLastElapsedTime = iTime;
                return fElapsedTime;
            }

            if (eCommand == 5 /* TIMER_GET_APP_TIME */) {
                var fAppTime = (iTime - this._iBaseTime) / this._fTicksPerSec;
                return fAppTime;
            }

            if (eCommand == 0 /* TIMER_RESET */) {
                this._iBaseTime = iTime;
                this._iLastElapsedTime = iTime;
                this._iStopTime = 0;
                this._isTimerStopped = false;
                return 0;
            }

            if (eCommand == 1 /* TIMER_START */) {
                if (this._isTimerStopped) {
                    this._iBaseTime += iTime - this._iStopTime;
                }
                this._iStopTime = 0;
                this._iLastElapsedTime = iTime;
                this._isTimerStopped = false;
                return 0;
            }

            if (eCommand == 2 /* TIMER_STOP */) {
                if (!this._isTimerStopped) {
                    this._iStopTime = iTime;
                    this._iLastElapsedTime = iTime;
                    this._isTimerStopped = true;
                }
                return 0;
            }

            if (eCommand == 3 /* TIMER_ADVANCE */) {
                this._iStopTime += this._fTicksPerSec / 10;
                return 0;
            }

            if (eCommand == 4 /* TIMER_GET_ABSOLUTE_TIME */) {
                fTime = iTime / this._fTicksPerSec;
                return fTime;
            }

            // Invalid command specified
            return -1;
        };

        Timer.start = function () {
            var pTimer = new Timer();

            if (pTimer.start()) {
                return pTimer;
            }

            logger.presume(false, "cannot start util timer");

            return null;
        };
        return Timer;
    })();

    
    return Timer;
});
//# sourceMappingURL=Timer.js.map
