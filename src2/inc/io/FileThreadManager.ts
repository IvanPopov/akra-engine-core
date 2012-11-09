#ifndef FILETHREADMANAGER_TS
#define FILETHREADMANAGER_TS

#include "util/ThreadManager.ts"

#ifndef FTM_DEFAULT_LOCAL_THREAD
#define FTM_DEFAULT_LOCAL_THREAD "LocalFile.thread.js"
#endif

#ifndef FTM_DEFAULT_REMOTE_THREAD
#define FTM_DEFAULT_REMOTE_THREAD "RemoteFile.thread.js"
#endif

#define LocalFileThreadManager() util.ThreadManager(FTM_DEFAULT_LOCAL_THREAD)
#define RemoteFileThreadManager() util.ThreadManager(FTM_DEFAULT_REMOTE_THREAD)

module akra.io {
	var pLocalFileThreadManager = new LocalFileThreadManager();
	var pRemoteFileThreadManager = new RemoteFileThreadManager();

	export var getLocalFileThreadManager = (): IThreadManager => pLocalFileThreadManager;
	export var getRemoteFileThreadManager = (): IThreadManager => pRemoteFileThreadManager;
}

#endif