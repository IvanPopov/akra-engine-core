// AIThreadManager interface
// [write description here...]

#ifndef TM_MIN_THREAD_NUMBER
#define TM_MIN_THREAD_NUMBER 0
#endif

#ifndef TM_MAX_THREAD_NUMBER
#define TM_MAX_THREAD_NUMBER 4
#endif

#ifndef THREADMANAGER_ERRORS
//#define ERR_TM_REACHED_LIMIT 0
#endif

#ifndef TM_THREAD_MAX_IDLE_TIME
//seconds
#define TM_THREAD_MAX_IDLE_TIME 30 
#endif

/// <reference path="AIManager.ts" />


/// <reference path="AIThread.ts" />

interface AIThreadManager extends AIManager {
	waitForThread(fn: Function): int;
	createThread(): boolean;
	occupyThread(): AIThread;
	releaseThread(iThread: int): boolean;
	releaseThread(pThread: AIThread): boolean;
}