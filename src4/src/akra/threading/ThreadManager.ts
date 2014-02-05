/// <reference path="../idl/IThreadManager.ts" />
/// <reference path="../idl/IThread.ts" />
/// <reference path="../config/config.ts" />
/// <reference path="../logger.ts" />
/// <reference path="../time.ts" />
/// <reference path="../guid.ts" />
/// <reference path="../info/info.ts" />
/// <reference path="../events.ts" />

module akra.threading {

	enum AEThreadStatuses {
		k_WorkerBusy,
		k_WorkerFree
	}

	interface AIThreadStats {
		status: AEThreadStatuses;
		creationTime: uint;
		releaseTime: uint;
	}

	export class Manager implements IThreadManager, IEventProvider {
		guid: uint = guid();
		threadReleased: ISignal<{ (pManager: IThreadManager) }>;

		private _sDefaultScript: string;
		private _pWorkerList: IThread[] = [];
		private _pStatsList: AIThreadStats[] = [];
		private _pWaiters: Function[] = [];
		private _iSysRoutine: int = -1;

		/** @param sScript URL to script, that will be used during Worker initialization. */
		constructor(sScript: string = null) {
			this.setupSignals();

			this._sDefaultScript = sScript;

			for (var i: int = 0; i < config.threading.min; ++i) {
				this.createThread();
			}
		}

		protected setupSignals(): void {
			this.threadReleased = this.threadReleased || new Signal(<any>this);
		}

		private startSystemRoutine(): void {
			if (this._iSysRoutine > 0) {
				return;
			}

			this._iSysRoutine = setInterval((): void => {
				var pStats: AIThreadStats;
				var iNow: uint = time();

				for (var i: int = 0, n: int = this._pStatsList.length; i < n; ++i) {
					pStats = this._pStatsList[i];

					if (pStats.releaseTime > 0 && iNow - pStats.releaseTime > config.threading.idleTime * 1000) {
						if (this.terminateThread(i)) {
							debug.log("Thread " + i + " terminated. (" + i + "/" + n + ")");
							i--, n--;
							continue;
						}

						logger.warn("Thread must be removed: " + i);
					}
				};
			}, 5000);

			debug.log("Routine " + path.parse(this._sDefaultScript).getFileName() + " started.");
		}

		private stopSystemRoutine(): void {
			clearInterval(this._iSysRoutine);
			debug.log("Routine " + path.parse(this._sDefaultScript).getFileName() + " stoped.");
		}

		createThread(): boolean {
			//console.log((new Error).stack)
			if (this._pWorkerList.length === config.threading.max) {
				debug.log("Reached limit the number of threads.");
				return false;
			}

			if (!info.api.getWebWorker()) {
				logger.critical("WebWorker unsupported.");
				return false;
			}

			var pWorker: IThread = <IThread><any>(new Worker(this._sDefaultScript));

			pWorker.id = this._pWorkerList.length;
			pWorker.send = (<any>pWorker).postMessage;

			this._pWorkerList.push(<IThread>pWorker);
			this._pStatsList.push({
				status: AEThreadStatuses.k_WorkerFree,
				creationTime: time(),
				releaseTime: time()
			});

			if (this._pWorkerList.length == 1) {
				this.startSystemRoutine();
			}

			return true;
		}

		occupyThread(): IThread {
			var pStats: AIThreadStats;
			for (var i: int = 0, n: int = this._pWorkerList.length; i < n; ++i) {
				pStats = this._pStatsList[i];
				if (pStats.status == AEThreadStatuses.k_WorkerFree) {
					pStats.status = AEThreadStatuses.k_WorkerBusy;
					pStats.releaseTime = 0;
					return this._pWorkerList[i];
				}
			}

			if (this.createThread()) {
				return this.occupyThread();
			}
			else {
				return null;
			}
		}

		terminateThread(iThread: int): boolean {
			var pStats: AIThreadStats = this._pStatsList[iThread];
			var pWorker: IThread = this._pWorkerList[iThread];

			if (!isDefAndNotNull(pWorker) && pStats.status != AEThreadStatuses.k_WorkerFree) {
				return false;
			}

			(<Worker><any>pWorker).terminate();

			this._pStatsList.splice(iThread, 1);
			this._pWorkerList.splice(iThread, 1);

			if (this._pWorkerList.length == 0) {
				this.stopSystemRoutine();
			}

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
		// 	var pStats: AIThreadStats;
		// 	for (var i: int = 0, n: int = this._pWorkerList.length; i < n; ++i) {
		// 		pStats = this._pStatsList[i];
		//		 if (pStats.status != AEThreadStatuses.k_WorkerFree) {
		//		 	t ++;
		//		 }
		//	 }

		//	 return t;
		// }

		waitForThread(fnWaiter: Function): int {
			if (!isFunction(fnWaiter)) {
				return -1;
			}


			this._pWaiters.push(fnWaiter);
			this.checkWaiters();

			return this._pWaiters.length;
		}

		releaseThread(pThread: IThread): boolean;
		releaseThread(iThread: int): boolean;
		releaseThread(pThread: any): boolean {
			var iThread: int;
			var pStats: AIThreadStats;

			if (!isInt(pThread)) {
				iThread = pThread.id;
			}
			else {
				iThread = pThread;
			}

			if (isDef(this._pStatsList[iThread])) {
				pStats = this._pStatsList[iThread];

				pStats.status = AEThreadStatuses.k_WorkerFree;
				pStats.releaseTime = time();

				this.checkWaiters();
				return true;
			}

			return false;
		}

		initialize(): boolean { return true; }
		destroy(): void { }

		//CREATE_EVENT_TABLE(ThreadManager)
		// BROADCAST(threadReleased, VOID);
	}
}