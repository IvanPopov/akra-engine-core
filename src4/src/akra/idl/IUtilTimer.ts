
module akra {
	enum EUtilTimerCommands {
		//! <to reset the timer
		TIMER_RESET, 
		//! <to start the timer
		TIMER_START, 
		//! <to stop (or pause) the timer
		TIMER_STOP, 
		//! <to advance the timer by 0.1 seconds
		TIMER_ADVANCE, 
		//! <to get the absolute system time
		TIMER_GET_ABSOLUTE_TIME, 
		//! <to get the current time
		TIMER_GET_APP_TIME, 
		TIMER_GET_ELAPSED_TIME
		//! to get the time that elapsed between TIMER_GETELAPSEDTIME calls
	}
	
	interface IUtilTimer {
		absoluteTime: float;
		appTime: float;
		elapsedTime: float;
	
		start(): boolean;
		stop(): boolean;
		reset(): boolean;
		execCommand(e: EUtilTimerCommands): float;
		
		//static start(): IUtilTimer;
	}
	
}
