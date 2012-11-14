#ifndef THREADMANAGER_TS
#define THREADMANAGER_TS

#include "IThreadManager.ts"
#include "IThread.ts"


module akra.util {

	export enum EThreadStatuses {
		k_WorkerBusy,
		k_WorkerFree
	}

	export interface IThreadStats {
		status: EThreadStatuses;
		creationTime: uint;
		releaseTime: uint;
	}

	export class ThreadManager implements IThreadManager {
		private _sDefaultScript: string;
		private _pWorkerList: IThread[] = [];
		private _pStatsList: IThreadStats[] = [];

		constructor (sScript: string = null) {
			
			this._sDefaultScript = sScript;

#if TM_MIN_THREAD_NUMBER > 0
			for (var i: int = 0; i < TM_MIN_THREAD_NUMBER; ++ i) {
				this.createThread();
			};
#endif
			setInterval((): void => {
				var pStats: IThreadStats;
				var iNow: uint = now();

				for (var i: int = 0; i < this._pStatsList.length; ++ i) {
					pStats = this._pStatsList[i];

					if (pStats.releaseTime > 0 && iNow - pStats.releaseTime > TM_THREAD_MAX_IDLE_TIME * 1000) {
						debug_warning("thread must be removed: " + i);
					}
				};
			}, 30000);
		}

		createThread(): bool {
			//console.log((new Error).stack)
			if (this._pWorkerList.length === TM_MAX_THREAD_NUMBER) {
				ERROR("Reached limit the number of threads");
				return false;
			}

			if (!info.api.webWorker) {
				ERROR("WebWorkers unsupprted..");
				return false;
			}

			var pWorker: IThread = <IThread><any>(new Worker(this._sDefaultScript));

			pWorker.id = this._pWorkerList.length;
			pWorker.send = (<any>pWorker).postMessage;

			this._pWorkerList.push(<IThread>pWorker);
			this._pStatsList.push({
				status: EThreadStatuses.k_WorkerFree, 
				creationTime: now(), 
				releaseTime: now()
				});
			
			return true;
		}

		occupyThread(): IThread {
			var pStats: IThreadStats;
			for (var i: int = 0, n: int = this._pWorkerList.length; i < n; ++i) {
				pStats = this._pStatsList[i];
		        if (pStats.status == EThreadStatuses.k_WorkerFree) {
		            pStats.status = EThreadStatuses.k_WorkerBusy;
		            pStats.releaseTime = 0;

		            return this._pWorkerList[i];
		        }
		    }

		    if (this.createThread()) {
		    	return this.occupyThread();
		    }

		    else {
		    	ERROR("cannot occupy thread");
		    	return null;
		    }
		}

		releaseThread(pThread: IThread): bool;
		releaseThread(iThread: int): bool;
		releaseThread(pThread: any): bool {
			var iThread: int;
			var pStats: IThreadStats;

			if (!isInt(pThread)) {
				iThread = pThread.id;
			}
			else {
				iThread = pThread;
			}
			
			if (isDef(this._pStatsList[iThread])) {
				pStats = this._pStatsList[iThread];
				
				pStats.status = EThreadStatuses.k_WorkerFree;
				pStats.releaseTime = now();
			}

			return false;
		}

		initialize(): bool { return true; }
        destroy(): void {}
	}
}

#endif