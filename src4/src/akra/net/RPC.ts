/// <reference path="../idl/IRPC.ts" />

/// <reference path="../logger.ts" />
/// <reference path="../debug.ts" />
/// <reference path="../config/config.ts" />
/// <reference path="../uri/uri.ts" />
/// <reference path="../path/path.ts" />
/// <reference path="../events.ts" />
/// <reference path="../guid.ts" />
/// <reference path="../time.ts" />

/// <reference path="Pipe.ts" />

/// <reference path="../util/ObjectArray.ts" />
/// <reference path="../util/ObjectList.ts" />
/// <reference path="../util/ObjectSortCollection.ts" />

module akra.net {

	import ObjectList = util.ObjectList;
	import ObjectArray = util.ObjectArray;
	import ObjectSortCollection = util.ObjectSortCollection;


	var OPTIONS: IRPCOptions = config.rpc;

	function hasLimitedDeferredCalls(pRpc: IRPC): boolean {
		return (pRpc.getOptions().deferredCallsLimit >= 0)
	}

	function hasReconnect(pRpc: IRPC): boolean {
		return (pRpc.getOptions().reconnectTimeout > 0);
	}

	function hasSystemRoutine(pRpc: IRPC): boolean {
		return (pRpc.getOptions().systemRoutineInterval > 0)
	}
	function hasCallbackLifetime(pRpc: IRPC): boolean { 
		return (pRpc.getOptions().callbackLifetime > 0)
	}

	function hasGroupCalls(pRpc: IRPC): boolean {
		return (pRpc.getOptions().callsFrequency > 0);
	}

	function hasCallbacksCountLimit(pRpc: IRPC): boolean {
		return (pRpc.getOptions().maxCallbacksCount > 0);
	}

	class RPC implements IRPC {
		guid: uint = guid();

		joined: ISignal<{ (pRpc: IRPC): void; }>;
		error: ISignal<{ (pRpc: IRPC, e: Error): void; }>;

		protected _pOption: IRPCOptions;

		protected _pPipe: IPipe = null;

		protected _iGroupID: int = -1;
		protected _pGroupCalls: IRPCRequest = null;

		//стек вызововы, которые были отложены
		protected _pDefferedRequests: IObjectList<IRPCRequest> = new ObjectList<IRPCRequest>();
		//стек вызовов, ожидающих результата
		//type: ObjectList<IRPCCallback>
		protected _pCallbacksList: IObjectList<IRPCCallback> = null;
		protected _pCallbacksCollection: IObjectSortCollection<IRPCCallback> = null;
		//число совершенных вызовов
		protected _nCalls: uint = 0;

		protected _pRemoteAPI: Object = {}
		protected _eState: ERpcStates = ERpcStates.k_Deteached;

		//rejoin timer
		protected _iReconnect: int = -1;
		//timer for system routine
		protected _iSystemRoutine: int = -1;
		protected _iGroupCallRoutine: int = -1;


		getRemote(): any { return this._pRemoteAPI; }
		getOptions(): IRPCOptions { return this._pOption; }
		getGroup(): int { return !isNull(this._pGroupCalls) ? this._iGroupID : -1; }

		constructor(sAddr?: string, pOption?: IRPCOptions);
		constructor(pAddr: any = null, pOption: IRPCOptions = {}) {
			this.setupSignals();

			for (var i in OPTIONS) {
				if (!isDef(pOption[i])) {
					pOption[i] = OPTIONS[i];
				}
			}

			this._pOption = pOption;

			if (!isDefAndNotNull(pOption.procMap)) {
				pOption.procMap = {}
		}

			pOption.procMap[pOption.procListName] = {
				lifeTime: -1,
				priority: 10
			}

		if (hasCallbacksCountLimit(this)) {
				this._pCallbacksCollection = new ObjectSortCollection<IRPCCallback>(this._pOption.maxCallbacksCount);
				this._pCallbacksCollection.setCollectionFuncion((pCallback: IRPCCallback): int => {
					return isNull(pCallback) ? -1 : pCallback.n;
				});
			}
			else {
				this._pCallbacksList = new ObjectList<IRPCCallback>();
			}
			pAddr = pAddr || pOption.addr;

			if (isDefAndNotNull(pAddr)) {
				this.join(<string>pAddr);
			}
		}

		protected setupSignals(): void {
			this.joined = this.joined || new Signal(<any>this);
			this.error = this.error || new Signal(<any>this);
		}

		join(sAddr: string = null): void {
			var pPipe: IPipe = this._pPipe;
			var pDeffered: IObjectList<IRPCRequest> = this._pDefferedRequests;

			if (isNull(pPipe)) {
				pPipe = new Pipe();

				pPipe.message.connect(
					(pPipe: IPipe, pMessage: any, eType: EPipeDataTypes): void => {
						// LOG(pMessage);
						if (eType !== EPipeDataTypes.BINARY) {
							this.parse(JSON.parse(<string>pMessage));
						}
						else {
							this.parseBinary(new Uint8Array(pMessage));
						}
					});

				pPipe.opened.connect(
					(pPipe: IPipe, pEvent: Event): void => {

						this._startRoutines();

						//if we have unhandled call in deffered...
						if (pDeffered.getLength()) {
							pDeffered.seek(0);

							while (pDeffered.getLength() > 0) {
								pPipe.write(pDeffered.getCurrent());
								this._releaseRequest(<IRPCRequest>pDeffered.takeCurrent());
							}

							logger.presume(pDeffered.getLength() === 0, "something going wrong. length is: " + pDeffered.getLength());
						}

						var pRPC: IRPC = this;

						this.proc(this.getOptions().procListName,
							function (pError: Error, pList: string[]) {
								if (!isNull(pError)) {
									logger.critical("could not get proc. list");
								}
								//TODO: FIX akra. prefix...
								if (!isNull(pList) && isArray(pList)) {

									for (var i: int = 0; i < pList.length; ++i) {
										(function (sMethod) {

											pRPC.getOptions().procMap[sMethod] = pRPC.getOptions().procMap[sMethod] || {
												lifeTime: -1,
												priority: 0
											}

											pRPC.getRemote()[sMethod] = function () {
												var pArguments: string[] = [sMethod];

												for (var j: int = 0; j < arguments.length; ++j) {
													pArguments.push(arguments[j]);
												}

												return pRPC.proc.apply(pRPC, pArguments);
											}
										})(String(pList[i]));
									}

									// logger.log("rpc options: ", pRPC.options);
								}

								pRPC.joined.emit();
							});
					});

				pPipe.error.connect(
					(pPipe: IPipe, pError: ErrorEvent): void => {
						debug.error("pipe error occured...");
						this.error.emit(pError);
						//pRPC.rejoin();
					});

				pPipe.closed.connect(
					(pPipe: IPipe, pEvent: CloseEvent): void => {
						this._stopRoutines();
						this.rejoin();
					});
			}

			pPipe.open(<string>sAddr);

			this._pPipe = pPipe;
			this._eState = ERpcStates.k_Joined;
		}

		rejoin(): void {
			var pRPC: IRPC = this;

			clearTimeout(this._iReconnect);

			//rejoin not needed, because pipe already connected
			if (this._pPipe.isOpened()) {
				this._eState = ERpcStates.k_Joined;
				return;
			}

			//rejoin not needed, because we want close connection
			if (this._eState == ERpcStates.k_Closing) {
				this._eState = ERpcStates.k_Deteached;
				return;
			}

			if (this._pPipe.isClosed()) {
				//callbacks that will not be called, because connection was lost 
				this.freeCallbacks();

				if (hasReconnect(this)) {
					this._iReconnect = setTimeout(() => {
						pRPC.join();
					}, this.getOptions().reconnectTimeout);
				}
			}
		}

		parse(pRes: IRPCResponse): void {
			if (!isDef(pRes.n)) {
				//logger.log(pRes);
				logger.warn("message droped, because seriial not recognized.");
			}

			this.response(pRes.n, pRes.type, pRes.res);
		}


		parseBinary(pBuffer: Uint8Array): void {

			var iHeaderByteLength: uint = 12;
			var pHeader: Uint32Array = new Uint32Array(pBuffer.buffer, pBuffer.byteOffset, iHeaderByteLength / 4);

			var nMsg: uint = pHeader[0];
			var eType: ERPCPacketTypes = <ERPCPacketTypes>pHeader[1];
			var iByteLength: int = pHeader[2];

			var pResult: Uint8Array = pBuffer.subarray(iHeaderByteLength, iHeaderByteLength + iByteLength);

			this.response(nMsg, eType, pResult);

			var iPacketByteLength: int = iHeaderByteLength + iByteLength;

			if (pBuffer.byteLength > iPacketByteLength) {
				// console.log("group message detected >> ");
				this.parseBinary(pBuffer.subarray(iPacketByteLength));
			}
		}

		private response(nSerial: uint, eType: ERPCPacketTypes, pResult: any): void {
			if (eType === ERPCPacketTypes.RESPONSE) {
				var fn: Function = null;
				var pCallback: IRPCCallback = null;
				// WARNING("---------------->",nSerial,"<-----------------");
				// LOG(pStack.length);
				if (hasCallbacksCountLimit(this)) {
					var pCollection: IObjectSortCollection<IRPCCallback> = this._pCallbacksCollection;
					pCallback = pCollection.takeElement(nSerial);
					if (!isNull(pCallback)) {
						fn = pCallback.fn;
						this._releaseCallback(pCallback);

						if (!isNull(fn)) {
							fn(null, pResult);
						}
						return;
					}
				}
				else {
					var pStack: IObjectList<IRPCCallback> = this._pCallbacksList;
					pCallback = <IRPCCallback>pStack.getLast();
					if (!isNull(pCallback)) {
						do {
							// LOG("#n: ", nSerial, " result: ", pResult);
							if (pCallback.n === nSerial) {
								fn = pCallback.fn;
								this._releaseCallback(pStack.takeCurrent());

								if (!isNull(fn)) {
									fn(null, pResult);
								}
								return;
							}
						} while (pCallback = pStack.prev());
					}
				}


				// WARNING("package droped, invalid serial: " + nSerial);
			}
			else if (eType === ERPCPacketTypes.REQUEST) {
				logger.error("TODO: REQUEST package type temprary unsupported.");
			}
			else if (eType === ERPCPacketTypes.FAILURE) {
				logger.error("detected FAILURE on " + nSerial + " package");
				logger.log(pResult);
			}
			else {
				logger.error("unsupported response type detected: " + eType);
			}
		}

		private freeRequests(): void {
			var pStack: IObjectList<IRPCRequest> = this._pDefferedRequests;
			var pReq: IRPCRequest = <IRPCRequest>pStack.getFirst();

			if (pReq) {
				do {
					this._releaseRequest(pReq);
				} while (pReq = pStack.next());

				pStack.clear();
			}
		}

		private freeCallbacks(): void {
			if (hasCallbacksCountLimit(this)) {
				this._pCallbacksCollection.clear();
			}
			else {
				var pStack: IObjectList<IRPCCallback> = this._pCallbacksList;
				var pCallback: IRPCCallback = <IRPCCallback>pStack.getFirst();

				if (pCallback) {
					do {
						this._releaseCallback(pCallback);
					} while (pCallback = pStack.next());

					pStack.clear();
				}
			}
		}

		free(): void {
			this.freeRequests();
			this.freeCallbacks();
		}

		detach(): void {
			this._eState = ERpcStates.k_Closing;

			if (!isNull(this._pPipe) && this._pPipe.isOpened()) {
				this._pPipe.close();
			}

			this.free();
		}

		private findLifeTimeFor(sProc: string): uint {
			var pProcOpt: IRPCProcOptions = this._pOption.procMap[sProc];

			if (pProcOpt) {
				var iProcLt: int = pProcOpt.lifeTime;

				if (iProcLt >= 0)
					return iProcLt;
			}

			return this._pOption.callbackLifetime;
		}

		private findPriorityFor(sProc: string): uint {
			var pProcOpt: IRPCProcOptions = this._pOption.procMap[sProc];

			if (pProcOpt) {
				var iProcPr: int = pProcOpt.priority || 0;

				return iProcPr;
			}

			return 0;
		}

		setProcedureOption(sProc: string, sOpt: string, pValue: any): void {
			var pOptions: IRPCProcOptions = this.getOptions().procMap[sProc];

			if (!pOptions) {
				pOptions = this.getOptions().procMap[sProc] = {
					lifeTime: -1
				}
		}

			pOptions[sOpt] = pValue;
		}

		proc(...argv: any[]): boolean {

			var IRPCCallback: int = arguments.length - 1;
			var fnCallback: Function =
				isFunction(arguments[IRPCCallback]) ? <Function>arguments[IRPCCallback] : null;
			var nArg: uint = arguments.length - (fnCallback ? 2 : 1);
			var pArgv: any[] = new Array(nArg);
			var pPipe: IPipe = this._pPipe;
			var pCallback: IRPCCallback = null;

			for (var i = 0; i < nArg; ++i) {
				pArgv[i] = arguments[i + 1];
			}

			var pProc: IRPCRequest = this._createRequest();

			pProc.n = this._nCalls++;
			pProc.type = ERPCPacketTypes.REQUEST;
			pProc.proc = String(arguments[0]);
			pProc.argv = pArgv;
			pProc.next = null;
			pProc.lt = this.findLifeTimeFor(pProc.proc);
			pProc.pr = this.findPriorityFor(pProc.proc);

			pCallback = <IRPCCallback>this._createCallback();
			pCallback.n = pProc.n;
			pCallback.fn = fnCallback;
			pCallback.timestamp = time();

			if (config.DEBUG) {
				pCallback.procInfo = pProc.proc + "(" + pArgv.join(',') + ")";
			}

			if (isNull(pPipe) || !pPipe.isOpened()) {
				if (!hasLimitedDeferredCalls(this) ||
					this._pDefferedRequests.getLength() <= this.getOptions().deferredCallsLimit) {

					this._pDefferedRequests.push(pProc);

					if (hasCallbacksCountLimit(this)) {
						this._pCallbacksCollection.push(pCallback);
					}
					else {
						this._pCallbacksList.push(pCallback);
					}
				}
				else {
					pCallback.fn(RPC.ERRORS.STACK_SIZE_EXCEEDED);
					logger.log(RPC.ERRORS.STACK_SIZE_EXCEEDED);

					this._releaseCallback(pCallback);
					this._releaseRequest(pProc);
				}

				return false;
			}

			if (hasCallbacksCountLimit(this)) {
				this._pCallbacksCollection.push(pCallback);
			}
			else {
				this._pCallbacksList.push(pCallback);
			}

			return this.callProc(pProc);
		}

		private callProc(pProc: IRPCRequest): boolean {
			var pPipe: IPipe = this._pPipe;
			var bResult: boolean = false;

			if (hasGroupCalls(this)) {
				if (isNull(this._pGroupCalls)) {
					this._pGroupCalls = pProc;
					this._iGroupID++;
				}
				else {
					pProc.next = this._pGroupCalls;
					this._pGroupCalls = pProc;
				}

				return true;
			}
			else {
				bResult = pPipe.write(pProc);
				this._releaseRequest(pProc);
			}

			return bResult;
		}

		private _systemRoutine(): void {
			this._removeExpiredCallbacks();
		}

		private _startRoutines(): void {
			var pRPC: RPC = this;

			if (hasSystemRoutine(this)) {
				this._iSystemRoutine = setInterval(() => {
					pRPC._systemRoutine();
				}, this.getOptions().systemRoutineInterval);
			}

			if (hasGroupCalls(this)) {
				this._iGroupCallRoutine = setInterval(() => {
					pRPC.groupCall();
				}, this.getOptions().callsFrequency);
			}
		}

		private _stopRoutines(): void {
			clearInterval(this._iSystemRoutine);
			this._systemRoutine();

			clearInterval(this._iGroupCallRoutine);
			//TODO: remove calls from group call, if RPC finally detached!
		}

		groupCall(): int {
			var pReq: IRPCRequest = this._pGroupCalls;

			if (isNull(pReq)) {
				return;
			}

			this._pPipe.write(pReq);

			return this.dropGroupCall();
		}

		dropGroupCall(): int {
			var pReq: IRPCRequest = this._pGroupCalls;

			for (; ;) {
				var pNext = pReq.next;
				this._releaseRequest(pReq);

				if (!pNext) {
					break;
				}

				pReq = <IRPCRequest>pNext;
			}

			this._pGroupCalls = null;
			return this._iGroupID;
		}

		private _removeExpiredCallbacks(): void {
			var pCallback: IRPCCallback = null;
			var iNow: int = time();
			var fn: Function = null;
			var sInfo: string = null;

			if (hasCallbacksCountLimit(this)) {
				//				 for(var i: uint = 0; i < this.options.maxCallbacksCount; i++){
				//					 pCallback = <IRPCCallback>this._pCallbacksCollection.getElementAt(i);

				//					 if (!isNull(pCallback) && HAS_CALLBACK_LIFETIME(this) && (iNow - pCallback.timestamp) >= this.options.callbackLifetime) {
				//						 fn = pCallback.fn;
				// #ifdef DEBUG					
				//						 sInfo = pCallback.procInfo;
				// #endif
				//						 this._releaseCallback(pCallback);
				//						 this._pCallbacksCollection.removeElementAt(i);

				//						 if (!isNull(fn)) {
				//							 // logger.log("procedure info: ", sInfo);
				//							 fn(RPC.ERRORS.CALLBACK_LIFETIME_EXPIRED, null);
				//						 }
				//					 }
				//				 }
			}
			else {
				var pCallbacks: IObjectList<IRPCCallback> = this._pCallbacksList;
				pCallback = <IRPCCallback>pCallbacks.getFirst();
				while (!isNull(pCallback)) {

					if (hasCallbackLifetime(this) && (iNow - pCallback.timestamp) >= this.getOptions().callbackLifetime) {
						fn = pCallback.fn;
						if (config.DEBUG) {
							sInfo = pCallback.procInfo;
						}
						this._releaseCallback(<IRPCCallback>pCallbacks.takeCurrent());

						pCallback = pCallbacks.getCurrent();

						if (!isNull(fn)) {
							// logger.log("procedure info: ", sInfo);
							fn(RPC.ERRORS.CALLBACK_LIFETIME_EXPIRED, null);
						}
					}
					else {
						pCallback = <IRPCCallback>pCallbacks.next();
					}
				}
			}
		}

		private _releaseRequest(pReq: IRPCRequest): void {
			pReq.n = 0;
			pReq.proc = null;
			pReq.argv = null;
			pReq.next = null;
			pReq.lt = 0;
			pReq.pr = 0;

			RPC.requestPool.push(pReq);
		}

		private _createRequest(): IRPCRequest {
			if (RPC.requestPool.getLength() == 0) {
			// LOG("allocated rpc request");
			return { n: 0, type: ERPCPacketTypes.REQUEST, proc: null, argv: null, next: null, lt: 0, pr: 0 }
		}

			return RPC.requestPool.pop();
		}

		private _releaseCallback(pCallback: IRPCCallback): void {
			pCallback.n = 0;
			pCallback.fn = null;
			pCallback.timestamp = 0;
			pCallback.procInfo = null;

			RPC.callbackPool.push(pCallback);
		}

		private _createCallback(): IRPCCallback {
			if (RPC.callbackPool.getLength() == 0) {
			// LOG("allocated callback");
			return { n: 0, fn: null, timestamp: 0, procInfo: <string>null }
		}

			return RPC.callbackPool.pop();
		}


		private static requestPool: IObjectArray<IRPCRequest> = new ObjectArray<IRPCRequest>();
		private static callbackPool: IObjectArray<IRPCCallback> = new ObjectArray<IRPCCallback>();

		static ERRORS = {
			STACK_SIZE_EXCEEDED: <IRPCError>{
				name: "RPC err.",
				message: "stack size exceeded",
				code: ERPCErrorCodes.STACK_SIZE_EXCEEDED
			},
			CALLBACK_LIFETIME_EXPIRED: <IRPCError>{
				name: "RPC err.",
				message: "procedure life time expired",
				code: ERPCErrorCodes.CALLBACK_LIFETIME_EXPIRED
			}
		};

	}

	export function createRpc(opt?: IRPCOptions): IRPC;
	export function createRpc(addr?: string, opt?: IRPCOptions): IRPC;
	export function createRpc(addr?: any, opt?: any): IRPC {
		if (arguments.length === 1) {
			if (isString(addr)) {
				return new RPC(addr);
			}

			return new RPC(null, arguments[0]);
		}

		return new RPC(addr, opt);
	}
}

