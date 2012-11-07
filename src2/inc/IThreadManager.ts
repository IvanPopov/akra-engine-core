#ifndef ITHREADMANAGER_TS
#define ITHREADMANAGER_TS

#ifndef TM_MIN_THREAD_NUMBER
#define TM_MIN_THREAD_NUMBER 4
#endif

#ifndef TM_MAX_THREAD_NUMBER
#define TM_MAX_THREAD_NUMBER 16
#endif

#ifndef THREADMANAGER_ERRORS
//#define ERR_TM_REACHED_LIMIT 0
#endif

module akra {

	IFACE(IThread);

	export enum EThreadManagerErrors {
		//Reached limit the number of threads
		REACHED_THREAD_LIMIT = THREADMANAGER_ERRORS
	}

	export interface IThreadManager extends IManager {
		createThread(): bool;
		occupyThread(): IThread;
		releaseThread(iThread: int): bool;
		releaseThread(pThread: IThread): bool;
	}
}

#endif