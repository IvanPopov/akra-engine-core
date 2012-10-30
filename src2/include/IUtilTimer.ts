///<reference path="akra.ts" />

module akra {
	export enum EUtilTimerCommands {
		TIMER_RESET, //! <to reset the timer
		TIMER_START, //! <to start the timer
		TIMER_STOP, //! <to stop (or pause) the timer
		TIMER_ADVANCE, //! <to advance the timer by 0.1 seconds
		TIMER_GET_ABSOLUTE_TIME, //! <to get the absolute system time
		TIMER_GET_APP_TIME, //! <to get the current time
		TIMER_GET_ELAPSED_TIME
		//! to get the time that elapsed between TIMER_GETELAPSEDTIME calls
	}

    export interface IUtilTimer {
        absoluteTime: float;
        appTime: float;
        elapsedTime: float;

        start(): bool;
        stop(): bool;
        reset(): bool;
        execCommand(e: EUtilTimerCommands): float;
        
        //static start(): IUtilTimer;
    }
}