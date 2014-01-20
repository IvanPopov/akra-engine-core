/// <reference path="../idl/IUtilTimer.ts" />

/// <reference path="../time.ts" />
/// <reference path="../debug.ts" />

module akra.util {
	export class UtilTimer implements IUtilTimer {
		private _isTimerInitialized: boolean = false;
		private _isTimerStopped: boolean = false;
		private _fTicksPerSec: float = 0.;
		private _iStopTime: int = 0;
		private _iLastElapsedTime: int = 0;
		private _iBaseTime: int = 0;

		get absoluteTime(): float {
			return this.execCommand(EUtilTimerCommands.TIMER_GET_ABSOLUTE_TIME);
		}

		get appTime(): float {
			return this.execCommand(EUtilTimerCommands.TIMER_GET_APP_TIME);
		}

		get elapsedTime(): float {
			return this.execCommand(EUtilTimerCommands.TIMER_GET_ELAPSED_TIME);
		}

		start(): boolean {
			return this.execCommand(EUtilTimerCommands.TIMER_START) === 0;
		}
		stop(): boolean {
			return this.execCommand(EUtilTimerCommands.TIMER_STOP) === 0;
		}

		reset(): boolean {
			return this.execCommand(EUtilTimerCommands.TIMER_RESET) === 0;
		}

		execCommand(eCommand: EUtilTimerCommands): float {
			var fTime: float = 0.;
			var fElapsedTime: float = 0.;
			var iTime: int;

			if (this._isTimerInitialized == false) {
				this._isTimerInitialized = true;
				this._fTicksPerSec = 1000;
			}

			// Get either the current time or the stop time, depending
			// on whether we're stopped and what command was sent
			if (this._iStopTime != 0 && eCommand != EUtilTimerCommands.TIMER_START &&
				eCommand != EUtilTimerCommands.TIMER_GET_ABSOLUTE_TIME) {
				iTime = this._iStopTime;
			}
			else {
				iTime = time();
			}

			// Return the elapsed time
			if (eCommand == EUtilTimerCommands.TIMER_GET_ELAPSED_TIME) {
				fElapsedTime = (iTime - this._iLastElapsedTime) / this._fTicksPerSec;
				// LOG(iTime - this.iLastElapsedTime,  this.fTicksPerSec, fElapsedTime);
				this._iLastElapsedTime = iTime;
				return fElapsedTime;
			}

			// Return the current time
			if (eCommand == EUtilTimerCommands.TIMER_GET_APP_TIME) {
				var fAppTime = (iTime - this._iBaseTime) / this._fTicksPerSec;
				return fAppTime;
			}

			// Reset the timer
			if (eCommand == EUtilTimerCommands.TIMER_RESET) {
				this._iBaseTime = iTime;
				this._iLastElapsedTime = iTime;
				this._iStopTime = 0;
				this._isTimerStopped = false;
				return 0;
			}

			// Start the timer
			if (eCommand == EUtilTimerCommands.TIMER_START) {
				if (this._isTimerStopped) {
					this._iBaseTime += iTime - this._iStopTime;
				}
				this._iStopTime = 0;
				this._iLastElapsedTime = iTime;
				this._isTimerStopped = false;
				return 0;
			}

			// Stop the timer
			if (eCommand == EUtilTimerCommands.TIMER_STOP) {
				if (!this._isTimerStopped) {
					this._iStopTime = iTime;
					this._iLastElapsedTime = iTime;
					this._isTimerStopped = true;
				}
				return 0;
			}

			// Advance the timer by 1/10th second
			if (eCommand == EUtilTimerCommands.TIMER_ADVANCE) {
				this._iStopTime += this._fTicksPerSec / 10;
				return 0;
			}

			if (eCommand == EUtilTimerCommands.TIMER_GET_ABSOLUTE_TIME) {
				fTime = iTime / this._fTicksPerSec;
				return fTime;
			}
			// Invalid command specified
			return -1;
		}

		static start(): IUtilTimer {
			var pTimer: IUtilTimer = new UtilTimer;

			if (pTimer.start()) {
				return pTimer;
			}

			debug.log("cannot start util timer");

			return null;
		}
	}
}