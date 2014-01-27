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
		private _sSenderCallbackName: string = "";

		private static _pEmptyListenersList: IListener<T>[] = [];
		private static _nEmptyListenersCount: uint = 0;

		constructor(pSender: S, fnSenderCallback: Function = null, eType: EEventTypes = EEventTypes.BROADCAST) {
			this._pSender = pSender;
			this._fnSenderCallback = fnSenderCallback;
			this._eType = eType;

			if (this._eType === EEventTypes.BROADCAST) {
				this._pBroadcastListeners = [];
			}

			if (!isNull(this._pSender)) {
				this._sSenderCallbackName = this.findCallbacknameForListener(this._pSender, this._fnSenderCallback);
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
			if (!isNull(this._fnSenderCallback)) {
				switch (arguments.length) {
					case 0:
						if (this._sSenderCallbackName !== "") {
							this._pSender[this._sSenderCallbackName]();
						}
						else if (isNull(this._pSender)) {
							this._fnSenderCallback();
						}
						else {
							this._fnSenderCallback.call(this._pSender);
						}
						break;
					case 1:
						if (this._sSenderCallbackName !== "") {
							this._pSender[this._sSenderCallbackName](arguments[0]);
						}
						else if (isNull(this._pSender)) {
							this._fnSenderCallback(arguments[0]);
						}
						else {
							this._fnSenderCallback.call(this._pSender, arguments[0]);
						}
						break;
					case 2:
						if (this._sSenderCallbackName !== "") {
							this._pSender[this._sSenderCallbackName](arguments[0], arguments[1]);
						}
						else if (isNull(this._pSender)) {
							this._fnSenderCallback(arguments[0], arguments[1]);
						}
						else {
							this._fnSenderCallback.call(this._pSender, arguments[0], arguments[1]);
						}
						break;
					case 3:
						if (this._sSenderCallbackName !== "") {
							this._pSender[this._sSenderCallbackName](arguments[0], arguments[1], arguments[2]);
						}
						else if (isNull(this._pSender)) {
							this._fnSenderCallback(arguments[0], arguments[1], arguments[2]);
						}
						else {
							this._fnSenderCallback.call(this._pSender, arguments[0], arguments[1], arguments[2]);
						}
						break;
					case 4:
						if (this._sSenderCallbackName !== "") {
							this._pSender[this._sSenderCallbackName](arguments[0], arguments[1], arguments[2], arguments[3]);
						}
						else if (isNull(this._pSender)) {
							this._fnSenderCallback(arguments[0], arguments[1], arguments[2], arguments[3]);
						}
						else {
							this._fnSenderCallback.call(this._pSender, arguments[0], arguments[1], arguments[2], arguments[3]);
						}
						break;
					case 5:
						if (this._sSenderCallbackName !== "") {
							this._pSender[this._sSenderCallbackName](arguments[0], arguments[1], arguments[2], arguments[3], arguments[4]);
						}
						else if (isNull(this._pSender)) {
							this._fnSenderCallback(arguments[0], arguments[1], arguments[2], arguments[3], arguments[4]);
						}
						else {
							this._fnSenderCallback.call(this._pSender, arguments[0], arguments[1], arguments[2], arguments[3], arguments[4]);
						}
						break;
					case 6:
						if (this._sSenderCallbackName !== "") {
							this._pSender[this._sSenderCallbackName](
								arguments[0], arguments[1], arguments[2], arguments[3], arguments[4],
								arguments[5]);
						}
						else if (isNull(this._pSender)) {
							this._fnSenderCallback(
								arguments[0], arguments[1], arguments[2], arguments[3], arguments[4],
								arguments[5]);
						}
						else {
							this._fnSenderCallback.call(this._pSender,
								arguments[0], arguments[1], arguments[2], arguments[3], arguments[4],
								arguments[5]);
						}
						break;
					case 7:
						if (this._sSenderCallbackName !== "") {
							this._pSender[this._sSenderCallbackName](
								arguments[0], arguments[1], arguments[2], arguments[3], arguments[4],
								arguments[5], arguments[6]);
						}
						else if (isNull(this._pSender)) {
							this._fnSenderCallback(
								arguments[0], arguments[1], arguments[2], arguments[3], arguments[4],
								arguments[5], arguments[6]);
						}
						else {
							this._fnSenderCallback.call(this._pSender,
								arguments[0], arguments[1], arguments[2], arguments[3], arguments[4],
								arguments[5], arguments[6]);
						}
						break;
					case 8:
						if (this._sSenderCallbackName !== "") {
							this._pSender[this._sSenderCallbackName](
								arguments[0], arguments[1], arguments[2], arguments[3], arguments[4],
								arguments[5], arguments[6], arguments[7]);
						}
						else if (isNull(this._pSender)) {
							this._fnSenderCallback(
								arguments[0], arguments[1], arguments[2], arguments[3], arguments[4],
								arguments[5], arguments[6], arguments[7]);
						}
						else {
							this._fnSenderCallback.call(this._pSender,
								arguments[0], arguments[1], arguments[2], arguments[3], arguments[4],
								arguments[5], arguments[6], arguments[7]);
						}
						break;
					case 9:
						if (this._sSenderCallbackName !== "") {
							this._pSender[this._sSenderCallbackName](
								arguments[0], arguments[1], arguments[2], arguments[3], arguments[4],
								arguments[5], arguments[6], arguments[7], arguments[8]);
						}
						else if (isNull(this._pSender)) {
							this._fnSenderCallback(
								arguments[0], arguments[1], arguments[2], arguments[3], arguments[4],
								arguments[5], arguments[6], arguments[7], arguments[8]);
						}
						else {
							this._fnSenderCallback.call(this._pSender,
								arguments[0], arguments[1], arguments[2], arguments[3], arguments[4],
								arguments[5], arguments[6], arguments[7], arguments[8]);
						}
						break;
					case 10:
						if (this._sSenderCallbackName !== "") {
							this._pSender[this._sSenderCallbackName](
								arguments[0], arguments[1], arguments[2], arguments[3], arguments[4],
								arguments[5], arguments[6], arguments[7], arguments[8], arguments[9]);
						}
						else if (isNull(this._pSender)) {
							this._fnSenderCallback(
								arguments[0], arguments[1], arguments[2], arguments[3], arguments[4],
								arguments[5], arguments[6], arguments[7], arguments[8], arguments[9]);
						}
						else {
							this._fnSenderCallback.call(this._pSender,
								arguments[0], arguments[1], arguments[2], arguments[3], arguments[4],
								arguments[5], arguments[6], arguments[7], arguments[8], arguments[9]);
						}
						break;
					default:
						// this._fnSenderCallback.apply(this._pSender, arguments);
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

				var sCallbackName: string = pListener.callbackName;
				var pReciever: any = pListener.reciever;
				var fnCallback: T = pListener.callback;

				switch (arguments.length) {
					case 0:
						if (sCallbackName !== "") {
							pReciever[sCallbackName](this._pSender);
						}
						else if (isNull(pReciever)) {
							fnCallback(this._pSender);
						}
						else {
							fnCallback.call(pReciever, this._pSender);
						}
						break;
					case 1:
						if (sCallbackName !== "") {
							pReciever[sCallbackName](this._pSender,
								arguments[0]);
						}
						else if (isNull(pReciever)) {
							fnCallback(this._pSender,
								arguments[0]);
						}
						else {
							fnCallback.call(pReciever, this._pSender,
								arguments[0]);
						}
						break;
					case 2:
						if (sCallbackName !== "") {
							pReciever[sCallbackName](this._pSender,
								arguments[0], arguments[1]);
						}
						else if (isNull(pReciever)) {
							fnCallback(this._pSender,
								arguments[0], arguments[1]);
						}
						else {
							fnCallback.call(pReciever, this._pSender,
								arguments[0], arguments[1]);
						}
						break;
					case 3:
						if (sCallbackName !== "") {
							pReciever[sCallbackName](this._pSender,
								arguments[0], arguments[1], arguments[2]);
						}
						else if (isNull(pReciever)) {
							fnCallback(this._pSender,
								arguments[0], arguments[1], arguments[2]);
						}
						else {
							fnCallback.call(pReciever, this._pSender,
								arguments[0], arguments[1], arguments[2]);
						}
						break;
					case 4:
						if (sCallbackName !== "") {
							pReciever[sCallbackName](this._pSender,
								arguments[0], arguments[1], arguments[2], arguments[3]);
						}
						else if (isNull(pReciever)) {
							fnCallback(this._pSender,
								arguments[0], arguments[1], arguments[2], arguments[3]);
						}
						else {
							fnCallback.call(pReciever, this._pSender,
								arguments[0], arguments[1], arguments[2], arguments[3]);
						}
						break;
					case 5:
						if (sCallbackName !== "") {
							pReciever[sCallbackName](this._pSender,
								arguments[0], arguments[1], arguments[2], arguments[3], arguments[4]);
						}
						else if (isNull(pReciever)) {
							fnCallback(this._pSender,
								arguments[0], arguments[1], arguments[2], arguments[3], arguments[4]);
						}
						else {
							fnCallback.call(pReciever, this._pSender,
								arguments[0], arguments[1], arguments[2], arguments[3], arguments[4]);
						}
						break;
					case 6:
						if (sCallbackName !== "") {
							pReciever[sCallbackName](this._pSender,
								arguments[0], arguments[1], arguments[2], arguments[3], arguments[4],
								arguments[5]);
						}
						else if (isNull(pReciever)) {
							fnCallback(this._pSender,
								arguments[0], arguments[1], arguments[2], arguments[3], arguments[4],
								arguments[5]);
						}
						else {
							fnCallback.call(pReciever, this._pSender,
								arguments[0], arguments[1], arguments[2], arguments[3], arguments[4],
								arguments[5]);
						}
						break;
					case 7:
						if (sCallbackName !== "") {
							pReciever[sCallbackName](this._pSender,
								arguments[0], arguments[1], arguments[2], arguments[3], arguments[4],
								arguments[5], arguments[6]);
						}
						else if (isNull(pReciever)) {
							fnCallback(this._pSender,
								arguments[0], arguments[1], arguments[2], arguments[3], arguments[4],
								arguments[5], arguments[6]);
						}
						else {
							fnCallback.call(pReciever, this._pSender,
								arguments[0], arguments[1], arguments[2], arguments[3], arguments[4],
								arguments[5], arguments[6]);
						}
						break;
					case 8:
						if (sCallbackName !== "") {
							pReciever[sCallbackName](this._pSender,
								arguments[0], arguments[1], arguments[2], arguments[3], arguments[4],
								arguments[5], arguments[6], arguments[7]);
						}
						else if (isNull(pReciever)) {
							fnCallback(this._pSender,
								arguments[0], arguments[1], arguments[2], arguments[3], arguments[4],
								arguments[5], arguments[6], arguments[7]);
						}
						else {
							fnCallback.call(pReciever, this._pSender,
								arguments[0], arguments[1], arguments[2], arguments[3], arguments[4],
								arguments[5], arguments[6], arguments[7]);
						}
						break;
					case 9:
						if (sCallbackName !== "") {
							pReciever[sCallbackName](this._pSender,
								arguments[0], arguments[1], arguments[2], arguments[3], arguments[4],
								arguments[5], arguments[6], arguments[7], arguments[8]);
						}
						else if (isNull(pReciever)) {
							fnCallback(this._pSender,
								arguments[0], arguments[1], arguments[2], arguments[3], arguments[4],
								arguments[5], arguments[6], arguments[7], arguments[8]);
						}
						else {
							fnCallback.call(pReciever, this._pSender,
								arguments[0], arguments[1], arguments[2], arguments[3], arguments[4],
								arguments[5], arguments[6], arguments[7], arguments[8]);
						}
						break;
					case 10:
						if (sCallbackName !== "") {
							pReciever[sCallbackName](this._pSender,
								arguments[0], arguments[1], arguments[2], arguments[3], arguments[4],
								arguments[5], arguments[6], arguments[7], arguments[8], arguments[9]);
						}
						else if (isNull(pReciever)) {
							fnCallback(this._pSender,
								arguments[0], arguments[1], arguments[2], arguments[3], arguments[4],
								arguments[5], arguments[6], arguments[7], arguments[8], arguments[9]);
						}
						else {
							fnCallback.call(pReciever, this._pSender,
								arguments[0], arguments[1], arguments[2], arguments[3], arguments[4],
								arguments[5], arguments[6], arguments[7], arguments[8], arguments[9]);
						}
						break;
					default:
						// var args = [this._pSender];
						// for (var _i = 0; _i < (arguments.length); _i++) {
						// 	args[_i + 1] = arguments[_i];
						// }

						// fnCallback.apply(pReciever, args);
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
			var sCallbackName: string = "";
			var pSignal: ISignal<T> = null;
			var eType: any = this._eType;

			switch (pArguments.length) {
				case 1:
					if (isFunction(pArguments[0])) {
						fnCallback = pArguments[0];
					}
					else {
						pSignal = pArguments[0];
						pReciever = pSignal;
						fnCallback = pSignal.emit;
						sCallbackName = "emit";
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

				sCallbackName = fnCallback;
				fnCallback = pReciever[sCallbackName];

				//if (pReciever.constructor.prototype[fnCallback]) {
				//	fnCallback = pReciever.constructor.prototype[fnCallback];
				//}
				//else {
				//	fnCallback = pReciever[fnCallback];
				//}
			}
			else if (!isNull(pReciever)) {
				sCallbackName = this.findCallbacknameForListener(pReciever, fnCallback);
			}

			if (eType !== this._eType || fnCallback === undefined || fnCallback === null) {
				return null;
			}

			var pListener: IListener<T> = this.getEmptyListener();
			pListener.reciever = pReciever;
			pListener.callback = fnCallback;
			pListener.callbackName = sCallbackName;
			pListener.type = eType;

			return pListener;
		}

		private findCallbacknameForListener(pReciever: any, fnCallback: Function): string {
			if (!isNull(fnCallback)) {
				for (var i in pReciever) {
					if (pReciever[i] === fnCallback) {
						return i;
					}
				}
			}

			return "";
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
					callbackName: "",
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
			pListener.callbackName = "";
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