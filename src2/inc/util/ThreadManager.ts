#ifndef THREADMANAGER_TS
#define THREADMANAGER_TS

#include "IThreadManager.ts"
#include "IThread.ts"

module akra.util {

	export enum EWorkerStatuses {
		k_WorkerBusy,
		k_WorkerFree
	}

	export class ThreadManager implements IThreadManager {
		private _sDefaultScript: string;
		private _pWorkerList: IThread[] = [];
		private _pStatusList: EWorkerStatuses[] = [];

		constructor (sScript: string = null) {
			
			this._sDefaultScript = sScript;

			for (var i: int = 0; i < TM_MIN_THREAD_NUMBER; ++ i) {
				this.createThread(sScript);
			};
		}

		createThread(): bool {
			if (this._pWorkerList.length === TM_MAX_THREAD_NUMBER) {
				error("Reached limit the number of threads");
				return false;
			}

			if (!a.info.api.webWorker) {
				error("WebWorkers unsupprted..");
				return false;
			}

			var pWorker: IThread = <IThread>(new Worker(sScript));

			pWorker.id = this._pWorkerList.length;
			pWorker.send = pWorker.postMessage;

			this._pWorkerList.push(<IThread>pWorker);
			this._pStatusList.push(EWorkerStatuses.k_WorkerBusy);
			
			return true;
		}

		occupyThread(): IThread {
			for (var i: int = 0, n: int = this._pWorkerList.length; i < n; ++i) {
		        if (this._pWorkerStatus[i] == EWorkerStatuses.k_WorkerFree) {
		            this._pWorkerStatus[i] = EWorkerStatuses.k_WorkerBusy;
		            return this._pWorkerList[i];
		        }
		    }

		    if (this.createThread()) {
		    	return this.occupyThread();
		    }

		    else {
		    	error("cannot occupy thread");
		    	return null;
		    }
		}

		releaseThread(pThread: IThread): bool
		releaseThread(iThread: int): bool;
		releaseThread(pThread: any): bool {
			var iThread: int;

			if (!isInt(pThread)) {
				iThread = pThread.id;
			}
			else {
				iThread = pThread;
			}
			
			if (isDef(this._pStatusList[iThread])) {
				this._pStatusList[iThread] = EWorkerStatuses.k_WorkerFree;
			}

			return false;
		}

		initialize(): bool { return true; }
        destroy(): void {}
	}
}

#endif