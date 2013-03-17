#ifndef UTILTIMER_TS
#define UTILTIMER_TS

#include "IUtilTimer.ts"

module akra.util {
	
	export class UtilTimer implements IUtilTimer {
		private isTimerInitialized: bool = false;
		private isTimerStopped: bool = false;
		private fTicksPerSec: float = 0.;
		private iStopTime: int = 0;
		private iLastElapsedTime: int = 0;
		private iBaseTime: int = 0;

		inline get absoluteTime(): float {
			return this.execCommand(EUtilTimerCommands.TIMER_GET_ABSOLUTE_TIME);
		}

		inline get appTime(): float {
			return this.execCommand(EUtilTimerCommands.TIMER_GET_APP_TIME);
		}

		inline get elapsedTime(): float {
			return this.execCommand(EUtilTimerCommands.TIMER_GET_ELAPSED_TIME);
		}

		inline start(): bool {
			return this.execCommand(EUtilTimerCommands.TIMER_START) === 0;
		}
        inline stop(): bool {
        	return this.execCommand(EUtilTimerCommands.TIMER_STOP) === 0;
        }

        inline reset(): bool {
        	return this.execCommand(EUtilTimerCommands.TIMER_RESET) === 0;
        }

        execCommand(eCommand: EUtilTimerCommands): float {
		    var fTime: float = 0.;
		    var fElapsedTime: float = 0.;
		    var iTime: int;

		    if (this.isTimerInitialized == false) {
		        this.isTimerInitialized = true;
		        this.fTicksPerSec = 1000;
		    }

		    // Get either the current time or the stop time, depending
		    // on whether we're stopped and what command was sent
		    if (this.iStopTime != 0 && eCommand != EUtilTimerCommands.TIMER_START && 
		    	eCommand != EUtilTimerCommands.TIMER_GET_ABSOLUTE_TIME) {
		        iTime = this.iStopTime;
		    }
		    else {
		        iTime = (new Date()).getTime();
		    }

		    // Return the elapsed time
		    if (eCommand == EUtilTimerCommands.TIMER_GET_ELAPSED_TIME) {
		        fElapsedTime = (iTime - this.iLastElapsedTime) / this.fTicksPerSec;
		        this.iLastElapsedTime = iTime;
		        return fElapsedTime;
		    }

		    // Return the current time
		    if (eCommand == EUtilTimerCommands.TIMER_GET_APP_TIME) {
		        var fAppTime = ( iTime - this.iBaseTime ) / this.fTicksPerSec;
		        return fAppTime;
		    }

		    // Reset the timer
		    if (eCommand == EUtilTimerCommands.TIMER_RESET) {
		        this.iBaseTime = iTime;
		        this.iLastElapsedTime = iTime;
		        this.iStopTime = 0;
		        this.isTimerStopped = false;
		        return 0;
		    }

		    // Start the timer
		    if (eCommand == EUtilTimerCommands.TIMER_START) {
		        if (this.isTimerStopped) {
		            this.iBaseTime += iTime - this.iStopTime;
		        }
		        this.iStopTime = 0;
		        this.iLastElapsedTime = iTime;
		        this.isTimerStopped = false;
		        return 0;
		    }

		    // Stop the timer
		    if (eCommand == EUtilTimerCommands.TIMER_STOP) {
		        if (!this.isTimerStopped) {
		            this.iStopTime = iTime;
		            this.iLastElapsedTime = iTime;
		            this.isTimerStopped = true;
		        }
		        return 0;
		    }

		    // Advance the timer by 1/10th second
		    if (eCommand == EUtilTimerCommands.TIMER_ADVANCE) {
		        this.iStopTime += this.fTicksPerSec / 10;
		        return 0;
		    }

		    if (eCommand == EUtilTimerCommands.TIMER_GET_ABSOLUTE_TIME) {
		        fTime = iTime / this.fTicksPerSec;
		        return  fTime;
		    }
			// Invalid command specified
		    return -1; 
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

#endif