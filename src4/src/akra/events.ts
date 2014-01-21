/// <reference path="idl/IEventProvider.ts" />
/// <reference path="common.ts" />


module akra {

	export class Signal<T extends Function, S> implements ISignal<T> {
		private _pBroadcastListeners: IListener<T>[] = null;
		private _nBroadcastListenersCount: uint = 0;
		private _pUnicastListener: IListener<T> = null;
		private _pSender: S = null;
		private _eType: EEventTypes = EEventTypes.BROADCAST;
		private _fnSenderCallback: Function = null;

		private static _pEmptyListenersList: IListener<T>[] = [];
		private static _nEmptyListenersCount: uint = 0;

		constructor(pSender: S, fnSenderCallback: Function = null, eType: EEventTypes = EEventTypes.BROADCAST){
			this._pSender = pSender;
			this._fnSenderCallback = fnSenderCallback;
			this._eType = eType;

			if (this._eType === EEventTypes.BROADCAST) {
				this._pBroadcastListeners = [];
			}
		}

		public connect(pSignal: ISignal<any>): boolean;
		public connect(fnCallback: T, eType?: EEventTypes): boolean;
		public connect(fnCallback: string, eType?: EEventTypes): boolean;
		public connect(pReciever: any, fnCallback: T, eType?: EEventTypes): boolean;
		public connect(pReciever: any, fnCallback: string, eType?: EEventTypes): boolean;
		public connect(): boolean {
			var pListener: IListener<T> = this.fromParamsToListener(arguments);

			if (pListener === null) {
				return false;
			}

			if (pListener.type === EEventTypes.UNICAST) {
				if (this._pUnicastListener !== null) {
					this.clearListener(pListener);
					return false;
				}

				this._pUnicastListener = pListener;
			}
			else {
				if (this.indexOfBroadcastListener(pListener.reciever, pListener.callback) >= 0) {
					this.clearListener(pListener);
					return false;
				}

				this._pBroadcastListeners[this._nBroadcastListenersCount++] = pListener;
			}

			return true;
		}

		public disconnect(pSignal: ISignal<any>): boolean;
		public disconnect(fnCallback: T, eType?: EEventTypes): boolean;
		public disconnect(fnCallback: string, eType?: EEventTypes): boolean;
		public disconnect(pReciever: any, fnCallback: T, eType?: EEventTypes): boolean;
		public disconnect(pReciever: any, fnCallback: string, eType?: EEventTypes): boolean;
		public disconnect(): boolean {
			var pTmpListener: IListener<T> = this.fromParamsToListener(arguments);
			var bResult: boolean = false;

			if (pTmpListener === null) {
				return false;
			}

			if (pTmpListener.type === EEventTypes.UNICAST) {
				if (pTmpListener.reciever === this._pUnicastListener.reciever &&
					pTmpListener.callback === this._pUnicastListener.callback) {
					this.clearListener(this._pUnicastListener);
					this._pUnicastListener = null;
					bResult = true;
				}
			}
			else {
				var index = this.indexOfBroadcastListener(pTmpListener.reciever, pTmpListener.callback);
				if (index >= 0) {
					this.clearListener(this._pBroadcastListeners.splice(index, 1)[0]);
					this._nBroadcastListenersCount--;
					bResult = true;
				}
			}

			this.clearListener(pTmpListener);
			return bResult;
		}

		public emit(...pArgs: any[]);
		public emit() {

			if(!isNull(this._fnSenderCallback)) {
				switch (arguments.length) {
					case 0:
						this._fnSenderCallback.call(this._pSender);
						break;
					case 1:
						this._fnSenderCallback.call(this._pSender, arguments[0]);
						break;
					case 2:
						this._fnSenderCallback.call(this._pSender, arguments[0], arguments[1]);
						break;
					case 3:
						this._fnSenderCallback.call(this._pSender, arguments[0], arguments[1], arguments[2]);
						break;
					case 4:
						this._fnSenderCallback.call(this._pSender,
							arguments[0], arguments[1], arguments[2], arguments[3]);
						break;
					case 5:
						this._fnSenderCallback.call(this._pSender,
							arguments[0], arguments[1], arguments[2], arguments[3], arguments[4]);
						break;
					case 6:
						this._fnSenderCallback.call(this._pSender,
							arguments[0], arguments[1], arguments[2], arguments[3], arguments[4],
							arguments[5]);
						break;
					case 7:
						this._fnSenderCallback.call(this._pSender,
							arguments[0], arguments[1], arguments[2], arguments[3], arguments[4],
							arguments[5], arguments[6]);
						break;
					case 8:
						this._fnSenderCallback.call(this._pSender,
							arguments[0], arguments[1], arguments[2], arguments[3], arguments[4],
							arguments[5], arguments[6], arguments[7]);
						break;
					case 9:
						this._fnSenderCallback.call(this._pSender,
							arguments[0], arguments[1], arguments[2], arguments[3], arguments[4],
							arguments[5], arguments[6], arguments[7], arguments[8]);
						break;
					case 10:
						this._fnSenderCallback.call(this._pSender,
							arguments[0], arguments[1], arguments[2], arguments[3], arguments[4],
							arguments[5], arguments[6], arguments[7], arguments[8], arguments[9]);
						break;
					default:
						this._fnSenderCallback.apply(this._pSender, arguments);
				}

			}

			var pListener: IListener<T> = null;
			var nListeners: uint = this._eType === EEventTypes.BROADCAST ? this._nBroadcastListenersCount : 1;
			for (var i: int = 0; i < nListeners; i++) {
				if (this._eType === EEventTypes.UNICAST) {
					pListener = this._pUnicastListener;
				}
				else {
					pListener = this._pBroadcastListeners[i];
				}

				if (pListener === null) {
					continue;
				}

				switch (arguments.length) {
					case 0:
						pListener.callback.call(pListener.reciever, this._pSender);
						break;
					case 1:
						pListener.callback.call(pListener.reciever, this._pSender,
							arguments[0]);
						break;
					case 2:
						pListener.callback.call(pListener.reciever, this._pSender,
							arguments[0], arguments[1]);
						break;
					case 3:
						pListener.callback.call(pListener.reciever, this._pSender,
							arguments[0], arguments[1], arguments[2]);
						break;
					case 4:
						pListener.callback.call(pListener.reciever, this._pSender,
							arguments[0], arguments[1], arguments[2], arguments[3]);
						break;
					case 5:
						pListener.callback.call(pListener.reciever, this._pSender,
							arguments[0], arguments[1], arguments[2], arguments[3], arguments[4]);
						break;
					case 6:
						pListener.callback.call(pListener.reciever, this._pSender,
							arguments[0], arguments[1], arguments[2], arguments[3], arguments[4],
							arguments[5]);
						break;
					case 7:
						pListener.callback.call(pListener.reciever, this._pSender,
							arguments[0], arguments[1], arguments[2], arguments[3], arguments[4],
							arguments[5], arguments[6]);
						break;
					case 8:
						pListener.callback.call(pListener.reciever, this._pSender,
							arguments[0], arguments[1], arguments[2], arguments[3], arguments[4],
							arguments[5], arguments[6], arguments[7]);
						break;
					case 9:
						pListener.callback.call(pListener.reciever, this._pSender,
							arguments[0], arguments[1], arguments[2], arguments[3], arguments[4],
							arguments[5], arguments[6], arguments[7], arguments[8]);
						break;
					case 10:
						pListener.callback.call(pListener.reciever, this._pSender,
							arguments[0], arguments[1], arguments[2], arguments[3], arguments[4],
							arguments[5], arguments[6], arguments[7], arguments[8], arguments[9]);
						break;
					default:
						var args = [this._pSender];
						for (var _i = 0; _i < (arguments.length); _i++) {
							args[_i + 1] = arguments[_i];
						}

						pListener.callback.apply(pListener.reciever, args);
				}

			}
		}

		public clear(): void {
			for (var i: uint = 0; i < this._nBroadcastListenersCount; i++) {
				this.clearListener(this._pBroadcastListeners[i]);
				this._pBroadcastListeners[i] = null;
			}

			this._nBroadcastListenersCount = 0;

			this.clearListener(this._pUnicastListener);
			this._pUnicastListener = null;
		}

		public hasListeners(): boolean {
			return this._nBroadcastListenersCount > 0 || this._pUnicastListener !== null;
		}

		private fromParamsToListener(pArguments: IArguments): IListener<T> {
			var pReciever: any = null;
			var fnCallback: any = null;
			var pSignal: ISignal<T> = null;
			var eType: any = this._eType;

			switch (pArguments.length) {
				case 1:
					if (isFunction(pArguments[0])) {
						fnCallback = pArguments[0];
					}
					else {
						pSignal = pArguments[0];
						pReciever = pSignal.getSender();
						fnCallback = pSignal.emit;
					}
					break;
				case 2:
					if (isNumber(pArguments[1])) {
						fnCallback = pArguments[0];
						eType = pArguments[1];
					}
					else {
						pReciever = pArguments[0];
						fnCallback = pArguments[1];
					}
					break;
				case 3:
					pReciever = pArguments[0];
					fnCallback = pArguments[1];
					eType = pArguments[2];
					break;
			}

			if (typeof (fnCallback) === "string") {
				if (pReciever === null) {
					return null;
				}

				if (pReciever.constructor.prototype[fnCallback]) {
					fnCallback = pReciever.constructor.prototype[fnCallback];
				}
				else {
					fnCallback = pReciever[fnCallback]
			}
			}

			if (eType !== this._eType || fnCallback === undefined || fnCallback === null) {
				return null;
			}

			var pListener: IListener<T> = this.getEmptyListener();
			pListener.reciever = pReciever;
			pListener.callback = fnCallback;
			pListener.type = eType;

			return pListener;
		}

		private indexOfBroadcastListener(pReciever: any, fnCallback: T): int {
			for (var i: uint = 0; i < this._nBroadcastListenersCount; i++) {
				if (this._pBroadcastListeners[i].reciever === pReciever && this._pBroadcastListeners[i].callback === fnCallback) {
					return i;
				}
			}

			return -1;
		}

		private getEmptyListener(): IListener<T> {
			if (Signal._nEmptyListenersCount > 0) {
				var pListener: IListener<T> = Signal._pEmptyListenersList[--Signal._nEmptyListenersCount];
				Signal._pEmptyListenersList[Signal._nEmptyListenersCount] = null;
				return pListener;
			}
			else {
				return <IListener<T>>{
					reciever: null,
					callback: null,
					type: 0
				};
			}
		}

		private clearListener(pListener: IListener<T>): void {
			if (pListener === null) {
				return;
			}

			pListener.reciever = null;
			pListener.callback = null;
			pListener.type = 0;

			Signal._pEmptyListenersList[Signal._nEmptyListenersCount++] = pListener;
		}

		getSender(): S {
			return this._pSender;
		}

		getType(): EEventTypes {
			return this._eType;
		}
	}
}

////////////////////////////// TESTS /////////////////////////
//var sTestPackName: string = "";
//var nFailTests: uint = 0;
//var nTests: uint = 0;

//function startTest(sName: string = "DEFAULT") {
//    sTestPackName = sName;
//    console.log("-------START TEST PACK " + sTestPackName + "-------");
//}

//function endTest() {
//    if (nFailTests === 0) {
//        console.log("SUCCESS!! All tests: " + nTests + ". Fail tests: " + nFailTests + ".");
//    }
//    else {
//        console.error("FAIL!! All tests: " + nTests + ". Fail tests: " + nFailTests + ".");
//    }

//    console.log("-------END TEST PACK " + sTestPackName + "-------");
//    nTests = 0;
//    nFailTests = 0;
//}

//function passTest(pResult, pRequire) {
//    if (pResult === pRequire) {
//        console.log("Pass test #" + (nTests++));
//    }
//    else {
//        console.error("Fail test#" + (nTests++));
//        nFailTests++;
//    }
//}


//class Test {
//    signal1: ISignal<{ (sender: Test, msg: string) }, Test> = new Signal(this);
//    signal2: ISignal<{ (sender: Test, msg: string) }, Test> = new Signal(this, EEventTypes.UNICAST);

//    constructor(public id: uint = 0) { }


//    test1(pSender: Test, sMsg: string) {
//        passTest(pSender != null, true);
//        passTest(this != null, true);
//        passTest(sMsg.length > 0, true);

//        console.log("#1 Sender:", pSender.id, "Reciever:", this.id, sMsg);
//    }

//    test2 = function (pSender: Test, sMsg: string) {
//        passTest(pSender != null, true);
//        passTest(this != null, true);
//        passTest(sMsg.length > 0, true);

//        console.log("#2 Sender:", pSender.id, "Reciever:", this.id, sMsg);
//    }

//    test3(pSender: Test, sMsg: string) {
//        passTest(pSender != null, true);
//        passTest(this != null, true);
//        passTest(sMsg.length > 0, true);

//        console.log("#3 Sender:", pSender.id, "Reciever:", this.id, sMsg);
//    }


//}

//var t1 = new Test(1);
//var t2 = new Test(2);

//startTest("(CONNECT TO BROADCAST SIGNAL)");
//passTest(t1.signal1.connect(t2, t2.test1), true);
//passTest(t1.signal1.connect(t2, t2.test2, EEventTypes.UNICAST), false);
//passTest(t1.signal1.connect(t2, t2.test2), true);
//passTest(t1.signal1.connect(t2, "test3"), true);
//passTest(t1.signal1.connect(t2, t2.test3), false);
//endTest();

//startTest("(CONNECT TO UNICAST SIGNAL)");
//passTest(t1.signal2.connect(t2, t2.test1, EEventTypes.BROADCAST), false);
//passTest(t1.signal2.connect(t2, "test2"), true);
//passTest(t1.signal2.connect(t2, t2.test1), false);
//endTest();

//startTest("(HASLISTENERS OF SIGNAL)");
//passTest(t1.signal1.hasListeners(), true);
//passTest(t1.signal2.hasListeners(), true);
//endTest();

//startTest("(EMIT BROADCAST SIGNAL)");
//t1.signal1.emit("message1");
//endTest();

//startTest("(EMIT UNICAST SIGNAL)");
//t1.signal2.emit("message2");
//endTest();

//startTest("(DISCONNECT FROM BROADCAST SIGNAL)");
//passTest(t1.signal1.disconnect(t2, t2.test2), true);
//endTest();

//startTest("(DISCONNECT FROM UNICAST SIGNAL)");
//passTest(t1.signal2.disconnect(t2, t2.test2), true);
//endTest();

//startTest("(EMIT BROADCAST SIGNAL)");
//t1.signal1.emit("message1");
//endTest();

//startTest("(EMIT UNICAST SIGNAL)");
//t1.signal2.emit("message2");
//endTest();


//startTest("(CONNECT TO UNICAST SIGNAL AGAIN)");
//passTest(t1.signal2.connect(t2, t2.test1), true);
//endTest();

//startTest("(EMIT UNICAST SIGNAL)");
//t1.signal2.emit("message2");
//endTest();

//startTest("(CLEAR SIGNALS)");
//t1.signal1.clear();
//t1.signal2.clear();
//endTest();

//startTest("(EMIT SIGNALS AGAIN)");
//t1.signal1.emit("msg1");
//t1.signal2.emit("msg2");
//endTest();