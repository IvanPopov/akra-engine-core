/// <reference path="../idl/AIUtilTimer.ts" />

import time = require("time");
import logger = require("logger");

class Timer implements AIUtilTimer {
    private _isTimerInitialized: boolean = false;
    private _isTimerStopped: boolean = false;
    private _fTicksPerSec: float = 0.;
    private _iStopTime: int = 0;
    private _iLastElapsedTime: int = 0;
    private _iBaseTime: int = 0;

    get absoluteTime(): float {
        return this.execCommand(AEUtilTimerCommands.TIMER_GET_ABSOLUTE_TIME);
    }

    get appTime(): float {
        return this.execCommand(AEUtilTimerCommands.TIMER_GET_APP_TIME);
    }

    get elapsedTime(): float {
        return this.execCommand(AEUtilTimerCommands.TIMER_GET_ELAPSED_TIME);
    }

    start(): boolean {
        return this.execCommand(AEUtilTimerCommands.TIMER_START) === 0;
    }
    stop(): boolean {
        return this.execCommand(AEUtilTimerCommands.TIMER_STOP) === 0;
    }

    reset(): boolean {
        return this.execCommand(AEUtilTimerCommands.TIMER_RESET) === 0;
    }

    execCommand(eCommand: AEUtilTimerCommands): float {
        var fTime: float = 0.;
        var fElapsedTime: float = 0.;
        var iTime: int;

        if (this._isTimerInitialized == false) {
            this._isTimerInitialized = true;
            this._fTicksPerSec = 1000;
        }

        // Get either the current time or the stop time, depending
        // on whether we're stopped and what command was sent
        if (this._iStopTime != 0 && eCommand != AEUtilTimerCommands.TIMER_START &&
            eCommand != AEUtilTimerCommands.TIMER_GET_ABSOLUTE_TIME) {
            iTime = this._iStopTime;
        }
        else {
            iTime = time();
        }

        // Return the elapsed time
        if (eCommand == AEUtilTimerCommands.TIMER_GET_ELAPSED_TIME) {
            fElapsedTime = (iTime - this._iLastElapsedTime) / this._fTicksPerSec;
            // LOG(iTime - this.iLastElapsedTime,  this.fTicksPerSec, fElapsedTime);
            this._iLastElapsedTime = iTime;
            return fElapsedTime;
        }

        // Return the current time
        if (eCommand == AEUtilTimerCommands.TIMER_GET_APP_TIME) {
            var fAppTime = (iTime - this._iBaseTime) / this._fTicksPerSec;
            return fAppTime;
        }

        // Reset the timer
        if (eCommand == AEUtilTimerCommands.TIMER_RESET) {
            this._iBaseTime = iTime;
            this._iLastElapsedTime = iTime;
            this._iStopTime = 0;
            this._isTimerStopped = false;
            return 0;
        }

        // Start the timer
        if (eCommand == AEUtilTimerCommands.TIMER_START) {
            if (this._isTimerStopped) {
                this._iBaseTime += iTime - this._iStopTime;
            }
            this._iStopTime = 0;
            this._iLastElapsedTime = iTime;
            this._isTimerStopped = false;
            return 0;
        }

        // Stop the timer
        if (eCommand == AEUtilTimerCommands.TIMER_STOP) {
            if (!this._isTimerStopped) {
                this._iStopTime = iTime;
                this._iLastElapsedTime = iTime;
                this._isTimerStopped = true;
            }
            return 0;
        }

        // Advance the timer by 1/10th second
        if (eCommand == AEUtilTimerCommands.TIMER_ADVANCE) {
            this._iStopTime += this._fTicksPerSec / 10;
            return 0;
        }

        if (eCommand == AEUtilTimerCommands.TIMER_GET_ABSOLUTE_TIME) {
            fTime = iTime / this._fTicksPerSec;
            return fTime;
        }
        // Invalid command specified
        return -1;
    }

    static start(): Timer {
        var pTimer: Timer = new Timer;

        if (pTimer.start()) {
            return pTimer;
        }

        logger.presume(false, "cannot start util timer");

        return null;
    }
}


export = Timer;