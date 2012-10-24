///<reference path="../akra.ts" />

module akra.util {
	
	export class UtilTimer implements IUtilTimer {
		private isTimerInitialized: bool = false;
		private isTimerStopped: bool = false;
		private fTicksPerSec: float = 0.;
		private iStopTime: int = 0;
		private iLastElapsedTime: int = 0;
		private iBaseTime: int = 0;

		get absoluteTime(): float {
			return this.execCommand(UtilTimerCommands.TIMER_GET_ABSOLUTE_TIME);
		}

		get appTime(): float {
			return this.execCommand(UtilTimerCommands.TIMER_GET_APP_TIME);
		}

		get elapsedTime(): float {
			return this.execCommand(UtilTimerCommands.TIMER_GET_ELAPSED_TIME);
		}

		start(): bool {
			return this.execCommand(UtilTimerCommands.TIMER_START) === 0;
		}
        stop(): bool {
        	return this.execCommand(UtilTimerCommands.TIMER_STOP) === 0;
        }

        reset(): bool {
        	return this.execCommand(UtilTimerCommands.TIMER_RESET) === 0;
        }

        execCommand(e: UtilTimerCommands): float {
		    var fTime: float = 0.;
		    var fElapsedTime: float = 0.;
		    var iTime: int;

		    if (this.isTimerInitialized == false) {
		        this.isTimerInitialized = true;
		        this.fTicksPerSec = 1000;
		    }

		    // Get either the current time or the stop time, depending
		    // on whether we're stopped and what command was sent
		    if (this.iStopTime != 0 && eCommand != UtilTimerCommands.TimerStart && 
		    	eCommand != UtilTimerCommands.TimerGetAbsoluteTime) {
		        iTime = this.iStopTime;
		    }
		    else {
		        iTime = (new Date()).getTime();
		    }

		    // Return the elapsed time
		    if (eCommand == UtilTimerCommands.TimerGetElapsedTime) {
		        fElapsedTime = (iTime - this.iLastElapsedTime) / this.fTicksPerSec;
		        this.iLastElapsedTime = iTime;
		        return fElapsedTime;
		    }

		    // Return the current time
		    if (eCommand == UtilTimerCommands.TimerGetAppTime) {
		        var fAppTime = ( iTime - this.iBaseTime ) / this.fTicksPerSec;
		        return fAppTime;
		    }

		    // Reset the timer
		    if (eCommand == UtilTimerCommands.TimerReset) {
		        this.iBaseTime = iTime;
		        this.iLastElapsedTime = iTime;
		        this.iStopTime = 0;
		        this.isTimerStopped = false;
		        return 0;
		    }

		    // Start the timer
		    if (eCommand == UtilTimerCommands.TimerStart) {
		        if (this.isTimerStopped) {
		            this.iBaseTime += iTime - this.iStopTime;
		        }
		        this.iStopTime = 0;
		        this.iLastElapsedTime = iTime;
		        this.isTimerStopped = false;
		        return 0;
		    }

		    // Stop the timer
		    if (eCommand == UtilTimerCommands.TimerStop) {
		        if (!this.isTimerStopped) {
		            this.iStopTime = iTime;
		            this.iLastElapsedTime = iTime;
		            this.isTimerStopped = true;
		        }
		        return 0;
		    }

		    // Advance the timer by 1/10th second
		    if (eCommand == UtilTimerCommands.TimerAdvance) {
		        this.iStopTime += this.fTicksPerSec / 10;
		        return 0;
		    }

		    if (eCommand == UtilTimerCommands.TimerGetAbsoluteTime) {
		        fTime = iTime / this.fTicksPerSec;
		        return  fTime;
		    }

		    return -1; // Invalid command specified
        }

        static start(): UtilTimer {
        	var pTimer: UtilTimer = new UtilTimer;
        	
        	if (pTimer.start()) {
        		return pTimer;
        	}

        	debug_error('cannot start util timer');

        	return null;
        }
	}
}