#ifndef THREADMANAGER_TS
#define THREADMANAGER_TS

#include "common.ts"
#include "IThreadManager.ts"
#include "IThread.ts"
#include "events/events.ts"


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

	export class ThreadManager implements IThreadManager, IEventProvider {
		private _sDefaultScript: string;
		private _pWorkerList: IThread[] = [];
		private _pStatsList: IThreadStats[] = [];
		private _pWaiters: Function[] = [];

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
				
				// console.log("checking threads...", this._pStatsList.length, this._sDefaultScript);
				// console.log(this._pStatsList);
				for (var i: int = 0, n: int = this._pStatsList.length; i < n; ++ i) {
					pStats = this._pStatsList[i];
					
					if (pStats.releaseTime > 0 && iNow - pStats.releaseTime > TM_THREAD_MAX_IDLE_TIME * 1000) {
						if (this.terminateThread(i)) {
							debug_print("thread with id - " + i + " terminated. (" + i + "/" +  n + ")");
							i --, n --;
							continue;
						}
						
						debug_warning("thread must be removed: " + i);
					}
				};
			}, 5000);
		}

		createThread(): bool {
			//console.log((new Error).stack)
			if (this._pWorkerList.length === TM_MAX_THREAD_NUMBER) {
				WARNING("Reached limit the number of threads");
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
			// console.log(this._pWorkerList.length, "workers created in ", this._sDefaultScript);
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
		    	WARNING("cannot occupy thread");
		    	return null;
		    }
		}

		terminateThread(iThread: int): bool {
			var pStats: IThreadStats = this._pStatsList[iThread];
			var pWorker: IThread = this._pWorkerList[iThread];

			if (!isDefAndNotNull(pWorker) && pStats.status != EThreadStatuses.k_WorkerFree) {
				return false;
			}

			(<Worker><any>pWorker).terminate();

			this._pStatsList.splice(iThread, 1);
			this._pWorkerList.splice(iThread, 1);

			return true;
		}

		private checkWaiters(pThread: IThread = null): void {
			if (this._pWaiters.length == 0) {
				return;
			}

			if (isNull(pThread)) {
				pThread = this.occupyThread();
			}

			if (!isNull(pThread)) {	
				(this._pWaiters.shift())(pThread);
				return;
			}
			
		    // console.log("unreleased threads: ", this.countUnreleasedThreds());
			
			return;
		}

		// private countUnreleasedThreds(): uint {
		// 	var t = 0;
		// 	var pStats: IThreadStats;
		// 	for (var i: int = 0, n: int = this._pWorkerList.length; i < n; ++i) {
		// 		pStats = this._pStatsList[i];
		//         if (pStats.status != EThreadStatuses.k_WorkerFree) {
		//         	t ++;
		//         }
		//     }

		//     return t;
		// }

		waitForThread(fnWaiter: Function): int {
			if (!isFunction(fnWaiter)) {
				return -1;
			}


			this._pWaiters.push(fnWaiter);
			this.checkWaiters();

			return this._pWaiters.length;
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

				this.checkWaiters();
				return true;
			}

			return false;
		}

		initialize(): bool { return true; }
        destroy(): void {}

        CREATE_EVENT_TABLE(ThreadManager)
        // BROADCAST(threadReleased, VOID);
	}
}

#endif