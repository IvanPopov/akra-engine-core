/// <reference path="../idl/3d-party/gamepad.d.ts" />
/// <reference path="../idl/IGamepadMap.ts" />

//export var TYPICAL_BUTTON_COUNT = 16;
//export var TYPICAL_AXIS_COUNT = 4;

/// <reference path="../logger.ts" />
/// <reference path="../debug.ts" />
/// <reference path="../info/info.ts" />
/// <reference path="../util/ObjectArray.ts" />
/// <reference path="../events.ts" />
/// <reference path="../guid.ts" />

module akra.control {

	import ObjectArray = util.ObjectArray;

	navigator.getGamepads = <any>(navigator.getGamepads || navigator.webkitGetGamepads);

	export class GamepadMap implements IGamepadMap {

		connected: ISignal<{ (pGamepadMap: IGamepadMap, pGamepad: Gamepad): void; }>;
		disconnected: ISignal<{ (pGamepadMap: IGamepadMap, pGamepad: Gamepad): void; }>;
		updated: ISignal<{ (pGamepadMap: IGamepadMap, pGamepad: Gamepad): void; }>;

		public guid: uint = guid();

		private _bTicking: boolean = false;
		private _pCollection: IObjectArray<Gamepad> = new ObjectArray<Gamepad>();
		private _pPrevRawGamepadTypes: string[] = [null, null, null, null];
		private _pPrevTimestamps: long[] = [0, 0, 0, 0];

		constructor() {
			this.setupSignals();
		}

		protected setupSignals(): void {
			this.connected = this.connected || new Signal(this);
			this.disconnected = this.disconnected || new Signal(this);
			this.updated = this.updated || new Signal(this);
		}

		init(): boolean {

			if (!info.api.getGamepad()) {
				logger.warn("Gamepad API is unsupported.");
				return false;
			}

			var pCollection: IObjectArray<Gamepad> = this._pCollection;

			window.addEventListener('MozGamepadConnected', (e: GamepadEvent) => {
				pCollection.push(e.gamepad);
				this.connected.emit(e.gamepad);
				this.startPolling();
			}, false);

			window.addEventListener('MozGamepadDisconnected', (e: GamepadEvent) => {
				for (var i: int = 0; i < pCollection.getLength(); ++i) {
					if (<int>pCollection.value(i).index == e.gamepad.index) {
						this.disconnected.emit(pCollection.takeAt(i));
						break;
					}
				}

				if (pCollection.getLength() === 0) {
					this.stopPolling();
				}
			}, false);

			if (!!navigator.gamepads || !!navigator.getGamepads) {
				this.startPolling();
				return true;
			}

			return false;
		}

		isActive(): boolean {
			return this._bTicking;
		}


		find(sID?: string): Gamepad;
		find(i?: int): Gamepad;
		find(id?): Gamepad {
			var sID: string = null;
			var i: int = 0;

			if (arguments.length) {
				if (isString(arguments[0])) {
					sID = <string>arguments[0];
				}
				else if (isInt(arguments[0])) {
					i = <int>arguments[0];
				}
			}

			if (!isNull(sID)) {
				for (i = 0; i < this._pCollection.getLength(); ++i) {
					if (this._pCollection.value(i).id == sID) {
						return this._pCollection.value(i);
					}
				}
			}

			return this._pCollection.value(i);
		}

		private startPolling(): void {
			if (!this._bTicking) {
				this._bTicking = true;
				this.update();
			}
		}

		private stopPolling(): void {
			this._bTicking = false;
		}

		update(): void {
			this.pollStatus();
		}

		private pollStatus(): void {
			if (!this._bTicking) {
				return;
			}

			this.pollGamepads();

			for (var i = 0; i < this._pCollection.getLength(); ++i) {
				var pGamepad: Gamepad = this._pCollection.value(i);

				if (pGamepad.timestamp && (pGamepad.timestamp == this._pPrevTimestamps[i])) {
					continue;
				}

				this._pPrevTimestamps[i] = pGamepad.timestamp;
			}
		}

		private pollGamepads(): void {
			var pRawGamepads: Gamepad[] = (navigator.getGamepads && navigator.getGamepads()) || navigator.gamepads;
			if (isDefAndNotNull(pRawGamepads)) {
				this._pCollection.clear();

				var isGamepadsChanged: boolean = false;

				for (var i: int = 0; i < pRawGamepads.length; i++) {
					if (typeof pRawGamepads[i] != this._pPrevRawGamepadTypes[i]) {

						isGamepadsChanged = true;
						this._pPrevRawGamepadTypes[i] = typeof pRawGamepads[i];

						if (isDefAndNotNull(pRawGamepads[i])) {
							debug.log("gamepad " + i + " updated: " + pRawGamepads[i].id);
							this.updated.emit(pRawGamepads[i]);
						}
					}

					if (isDefAndNotNull(pRawGamepads[i])) {
						this._pCollection.push(pRawGamepads[i]);
					}
				}

				//if (isGamepadsChanged) {
				//todo: collection changed...
				//}
			}
		}
	}


}