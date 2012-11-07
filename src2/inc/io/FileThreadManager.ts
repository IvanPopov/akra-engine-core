#ifndef FILETHREADMANAGER_TS
#define FILETHREADMANAGER_TS

#include "util/ThreadManager.ts"

#ifndef FTM_DEFAULT_THREAD
#define FTM_DEFAULT_THREAD ""
#endif

#define FileThreadManager() ThreadManager(FTM_DEFAULT_THREAD)

module akra.io {
	var pFileThreadManager = new FileThreadManager();

	export var getFileThreadManager = (): IThreadManager => pFileThreadManager;
}

#endif