/// <reference path="../idl/AIThreadManager.ts" />
/// <reference path="../idl/AIThread.ts" />
define(["require", "exports", "config", "logger", "time", "info"], function(require, exports, __config__, __logger__, __time__, __info__) {
    var config = __config__;
    var logger = __logger__;
    var time = __time__;
    var info = __info__;

    var AEThreadStatuses;
    (function (AEThreadStatuses) {
        AEThreadStatuses[AEThreadStatuses["k_WorkerBusy"] = 0] = "k_WorkerBusy";
        AEThreadStatuses[AEThreadStatuses["k_WorkerFree"] = 1] = "k_WorkerFree";
    })(AEThreadStatuses || (AEThreadStatuses = {}));

    var ThreadManager = (function () {
        function ThreadManager(sScript) {
            if (typeof sScript === "undefined") { sScript = null; }
            this._pWorkerList = [];
            this._pStatsList = [];
            this._pWaiters = [];
            this._iSysRoutine = -1;
            this._sDefaultScript = sScript;

            for (var i = 0; i < config.threading.min; ++i) {
                this.createThread();
            }
        }
        ThreadManager.prototype.startSystemRoutine = function () {
            var _this = this;
            if (this._iSysRoutine > 0) {
                return;
            }

            logger.log("start routine", this._sDefaultScript);

            this._iSysRoutine = setInterval(function () {
                var pStats;
                var iNow = time();

                for (var i = 0, n = _this._pStatsList.length; i < n; ++i) {
                    pStats = _this._pStatsList[i];

                    if (pStats.releaseTime > 0 && iNow - pStats.releaseTime > config.threading.idleTime * 1000) {
                        if (_this.terminateThread(i)) {
                            logger.log("thread with id - " + i + " terminated. (" + i + "/" + n + ")");
                            i--, n--;
                            continue;
                        }

                        logger.warn("thread must be removed: " + i);
                    }
                }
                ;
            }, 5000);
        };

        ThreadManager.prototype.stopSystemRoutine = function () {
            logger.log("stop routine", this._sDefaultScript);
            clearInterval(this._iSysRoutine);
        };

        ThreadManager.prototype.createThread = function () {
            if (this._pWorkerList.length === config.threading.max) {
                logger.warn("Reached limit the number of threads");
                return false;
            }

            if (!info.api.webWorker) {
                logger.error("WebWorkers unsupprted..");
                return false;
            }

            var pWorker = (new Worker(this._sDefaultScript));

            pWorker.id = this._pWorkerList.length;
            pWorker.send = (pWorker).postMessage;

            this._pWorkerList.push(pWorker);
            this._pStatsList.push({
                status: 1 /* k_WorkerFree */,
                creationTime: time(),
                releaseTime: time()
            });

            if (this._pWorkerList.length == 1) {
                this.startSystemRoutine();
            }

            return true;
        };

        ThreadManager.prototype.occupyThread = function () {
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
                logger.warn("cannot occupy thread");
                return null;
            }
        };

        ThreadManager.prototype.terminateThread = function (iThread) {
            var pStats = this._pStatsList[iThread];
            var pWorker = this._pWorkerList[iThread];

            if (!isDefAndNotNull(pWorker) && pStats.status != 1 /* k_WorkerFree */) {
                return false;
            }

            (pWorker).terminate();

            this._pStatsList.splice(iThread, 1);
            this._pWorkerList.splice(iThread, 1);

            if (this._pWorkerList.length == 0) {
                this.stopSystemRoutine();
            }

            return true;
        };

        ThreadManager.prototype.checkWaiters = function (pThread) {
            if (typeof pThread === "undefined") { pThread = null; }
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
        ThreadManager.prototype.waitForThread = function (fnWaiter) {
            if (!isFunction(fnWaiter)) {
                return -1;
            }

            this._pWaiters.push(fnWaiter);
            this.checkWaiters();

            return this._pWaiters.length;
        };

        ThreadManager.prototype.releaseThread = function (pThread) {
            var iThread;
            var pStats;

            if (!isInt(pThread)) {
                iThread = pThread.id;
            } else {
                iThread = pThread;
            }

            if (isDef(this._pStatsList[iThread])) {
                pStats = this._pStatsList[iThread];

                pStats.status = 1 /* k_WorkerFree */;
                pStats.releaseTime = time();

                this.checkWaiters();
                return true;
            }

            return false;
        };

        ThreadManager.prototype.initialize = function () {
            return true;
        };
        ThreadManager.prototype.destroy = function () {
        };
        return ThreadManager;
    })();
    
    return ThreadManager;
});
//# sourceMappingURL=ThreadManager.js.map
