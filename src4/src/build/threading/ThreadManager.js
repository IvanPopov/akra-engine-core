/// <reference path="../idl/IThreadManager.ts" />
/// <reference path="../idl/IThread.ts" />
/// <reference path="../config/config.ts" />
/// <reference path="../logger.ts" />
/// <reference path="../time.ts" />
/// <reference path="../guid.ts" />
/// <reference path="../info/info.ts" />
/// <reference path="../events.ts" />
var akra;
(function (akra) {
    (function (threading) {
        var AEThreadStatuses;
        (function (AEThreadStatuses) {
            AEThreadStatuses[AEThreadStatuses["k_WorkerBusy"] = 0] = "k_WorkerBusy";
            AEThreadStatuses[AEThreadStatuses["k_WorkerFree"] = 1] = "k_WorkerFree";
        })(AEThreadStatuses || (AEThreadStatuses = {}));

        var Manager = (function () {
            /** @param sScript URL to script, that will be used during Worker initialization. */
            function Manager(sScript) {
                if (typeof sScript === "undefined") { sScript = null; }
                this.guid = akra.guid();
                this._pWorkerList = [];
                this._pStatsList = [];
                this._pWaiters = [];
                this._iSysRoutine = -1;
                this.setupSignals();

                this._sDefaultScript = sScript;

                for (var i = 0; i < akra.config.threading.min; ++i) {
                    this.createThread();
                }
            }
            Manager.prototype.setupSignals = function () {
                this.threadReleased = this.threadReleased || new akra.Signal(this);
            };

            Manager.prototype.startSystemRoutine = function () {
                var _this = this;
                if (this._iSysRoutine > 0) {
                    return;
                }

                this._iSysRoutine = setInterval(function () {
                    var pStats;
                    var iNow = akra.time();

                    for (var i = 0, n = _this._pStatsList.length; i < n; ++i) {
                        pStats = _this._pStatsList[i];

                        if (pStats.releaseTime > 0 && iNow - pStats.releaseTime > akra.config.threading.idleTime * 1000) {
                            if (_this.terminateThread(i)) {
                                akra.debug.log("Thread " + i + " terminated. (" + i + "/" + n + ")");
                                i--, n--;
                                continue;
                            }

                            akra.logger.warn("Thread must be removed: " + i);
                        }
                    }
                    ;
                }, 5000);

                akra.debug.log("Routine " + akra.path.parse(this._sDefaultScript).getFileName() + " started.");
            };

            Manager.prototype.stopSystemRoutine = function () {
                clearInterval(this._iSysRoutine);
                akra.debug.log("Routine " + akra.path.parse(this._sDefaultScript).getFileName() + " stoped.");
            };

            Manager.prototype.createThread = function () {
                //console.log((new Error).stack)
                if (this._pWorkerList.length === akra.config.threading.max) {
                    akra.debug.log("Reached limit the number of threads.");
                    return false;
                }

                if (!akra.info.api.getWebWorker()) {
                    akra.logger.critical("WebWorker unsupported.");
                    return false;
                }

                var pWorker = (new Worker(this._sDefaultScript));

                pWorker.id = this._pWorkerList.length;
                pWorker.send = pWorker.postMessage;

                this._pWorkerList.push(pWorker);
                this._pStatsList.push({
                    status: 1 /* k_WorkerFree */,
                    creationTime: akra.time(),
                    releaseTime: akra.time()
                });

                if (this._pWorkerList.length == 1) {
                    this.startSystemRoutine();
                }

                return true;
            };

            Manager.prototype.occupyThread = function () {
                var pStats;
                for (var i = 0, n = this._pWorkerList.length; i < n; ++i) {
                    pStats = this._pStatsList[i];
                    if (pStats.status == 1 /* k_WorkerFree */) {
                        pStats.status = 0 /* k_WorkerBusy */;
                        pStats.releaseTime = 0;
                        return this._pWorkerList[i];
                    }
                }

                if (this.createThread()) {
                    return this.occupyThread();
                } else {
                    return null;
                }
            };

            Manager.prototype.terminateThread = function (iThread) {
                var pStats = this._pStatsList[iThread];
                var pWorker = this._pWorkerList[iThread];

                if (!akra.isDefAndNotNull(pWorker) && pStats.status != 1 /* k_WorkerFree */) {
                    return false;
                }

                pWorker.terminate();

                this._pStatsList.splice(iThread, 1);
                this._pWorkerList.splice(iThread, 1);

                if (this._pWorkerList.length == 0) {
                    this.stopSystemRoutine();
                }

                return true;
            };

            Manager.prototype.checkWaiters = function (pThread) {
                if (typeof pThread === "undefined") { pThread = null; }
                if (this._pWaiters.length == 0) {
                    return;
                }

                if (akra.isNull(pThread)) {
                    pThread = this.occupyThread();
                }

                if (!akra.isNull(pThread)) {
                    (this._pWaiters.shift())(pThread);
                    return;
                }

                // console.log("unreleased threads: ", this.countUnreleasedThreds());
                return;
            };

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
            Manager.prototype.waitForThread = function (fnWaiter) {
                if (!akra.isFunction(fnWaiter)) {
                    return -1;
                }

                this._pWaiters.push(fnWaiter);
                this.checkWaiters();

                return this._pWaiters.length;
            };

            Manager.prototype.releaseThread = function (pThread) {
                var iThread;
                var pStats;

                if (!akra.isInt(pThread)) {
                    iThread = pThread.id;
                } else {
                    iThread = pThread;
                }

                if (akra.isDef(this._pStatsList[iThread])) {
                    pStats = this._pStatsList[iThread];

                    pStats.status = 1 /* k_WorkerFree */;
                    pStats.releaseTime = akra.time();

                    this.checkWaiters();
                    return true;
                }

                return false;
            };

            Manager.prototype.initialize = function () {
                return true;
            };
            Manager.prototype.destroy = function () {
            };
            return Manager;
        })();
        threading.Manager = Manager;
    })(akra.threading || (akra.threading = {}));
    var threading = akra.threading;
})(akra || (akra = {}));
//# sourceMappingURL=ThreadManager.js.map
