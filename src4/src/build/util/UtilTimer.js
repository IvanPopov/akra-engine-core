/// <reference path="../idl/IUtilTimer.ts" />
var akra;
(function (akra) {
    /// <reference path="../time.ts" />
    /// <reference path="../debug.ts" />
    (function (util) {
        var UtilTimer = (function () {
            function UtilTimer() {
                this._isTimerInitialized = false;
                this._isTimerStopped = false;
                this._fTicksPerSec = 0.;
                this._iStopTime = 0;
                this._iLastElapsedTime = 0;
                this._iBaseTime = 0;
            }
            UtilTimer.prototype.getAbsoluteTime = function () {
                return this.execCommand(4 /* TIMER_GET_ABSOLUTE_TIME */);
            };

            UtilTimer.prototype.getAppTime = function () {
                return this.execCommand(5 /* TIMER_GET_APP_TIME */);
            };

            UtilTimer.prototype.getElapsedTime = function () {
                return this.execCommand(6 /* TIMER_GET_ELAPSED_TIME */);
            };

            UtilTimer.prototype.start = function () {
                return this.execCommand(1 /* TIMER_START */) === 0;
            };
            UtilTimer.prototype.stop = function () {
                return this.execCommand(2 /* TIMER_STOP */) === 0;
            };

            UtilTimer.prototype.reset = function () {
                return this.execCommand(0 /* TIMER_RESET */) === 0;
            };

            UtilTimer.prototype.execCommand = function (eCommand) {
                var fTime = 0.;
                var fElapsedTime = 0.;
                var iTime;

                if (this._isTimerInitialized == false) {
                    this._isTimerInitialized = true;
                    this._fTicksPerSec = 1000;
                }

                // Get either the current time or the stop time, depending
                // on whether we're stopped and what command was sent
                if (this._iStopTime != 0 && eCommand != 1 /* TIMER_START */ && eCommand != 4 /* TIMER_GET_ABSOLUTE_TIME */) {
                    iTime = this._iStopTime;
                } else {
                    iTime = akra.time();
                }

                // Return the elapsed time
                if (eCommand == 6 /* TIMER_GET_ELAPSED_TIME */) {
                    fElapsedTime = (iTime - this._iLastElapsedTime) / this._fTicksPerSec;

                    // LOG(iTime - this.iLastElapsedTime,  this.fTicksPerSec, fElapsedTime);
                    this._iLastElapsedTime = iTime;
                    return fElapsedTime;
                }

                // Return the current time
                if (eCommand == 5 /* TIMER_GET_APP_TIME */) {
                    var fAppTime = (iTime - this._iBaseTime) / this._fTicksPerSec;
                    return fAppTime;
                }

                // Reset the timer
                if (eCommand == 0 /* TIMER_RESET */) {
                    this._iBaseTime = iTime;
                    this._iLastElapsedTime = iTime;
                    this._iStopTime = 0;
                    this._isTimerStopped = false;
                    return 0;
                }

                // Start the timer
                if (eCommand == 1 /* TIMER_START */) {
                    if (this._isTimerStopped) {
                        this._iBaseTime += iTime - this._iStopTime;
                    }
                    this._iStopTime = 0;
                    this._iLastElapsedTime = iTime;
                    this._isTimerStopped = false;
                    return 0;
                }

                // Stop the timer
                if (eCommand == 2 /* TIMER_STOP */) {
                    if (!this._isTimerStopped) {
                        this._iStopTime = iTime;
                        this._iLastElapsedTime = iTime;
                        this._isTimerStopped = true;
                    }
                    return 0;
                }

                // Advance the timer by 1/10th second
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

            UtilTimer.start = function () {
                var pTimer = new UtilTimer;

                if (pTimer.start()) {
                    return pTimer;
                }

                akra.debug.log("cannot start util timer");

                return null;
            };
            return UtilTimer;
        })();
        util.UtilTimer = UtilTimer;
    })(akra.util || (akra.util = {}));
    var util = akra.util;
})(akra || (akra = {}));
//# sourceMappingURL=UtilTimer.js.map
