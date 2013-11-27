

/// <reference path="IManager.ts" />
/// <reference path="IThread.ts" />

module akra {
	export interface IThreadManager extends IManager {
		waitForThread(fn: Function): int;
		createThread(): boolean;
		occupyThread(): IThread;
		releaseThread(iThread: int): boolean;
		releaseThread(pThread: IThread): boolean;
	}
	
}
