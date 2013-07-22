#ifndef ITHREADMANAGER_TS
#define ITHREADMANAGER_TS

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

#include "IManager.ts"

module akra {

	IFACE(IThread);
	
	export interface IThreadManager extends IManager {
		waitForThread(fn: Function): int;
		createThread(): bool;
		occupyThread(): IThread;
		releaseThread(iThread: int): bool;
		releaseThread(pThread: IThread): bool;
	}
}

#endif