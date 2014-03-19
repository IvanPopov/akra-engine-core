/// <reference path="../idl/IKeyMap.ts" />
/// <reference path="../math/Vec2.ts" />

module akra.control {
	import Vec2 = math.Vec2;

	export class KeyMap implements IKeyMap {
		private _pMap: boolean[] = new Array<boolean>(EKeyCodes.TOTAL);
		private _pCallbackMap: { [combo: string]: Function[]; } = <any>{};

		private _bMouseDown: boolean = false;
		private _v2iMousePosition: IVec2 = new Vec2;
		private _v2iMousePrevPosition: IVec2 = new Vec2;
		private _v2iMouseShift: IVec2 = new Vec2;

		constructor(pTarget?: HTMLElement);
		constructor(pTarget?: Document);
		constructor(pTarget?: any) {
			for (var i = EKeyCodes.TOTAL; i--;) {
				this._pMap[i] = false;
			}

			if (isDefAndNotNull(pTarget)) {
				this.capture(pTarget);
			}
		}

		bind(sCombination: string, fn: Function): boolean {
			var pKeys: string[] = sCombination.replace(/[\s]+/g, "").split("+");
			var pCodes: uint[] = [];

			for (var i: int = 0; i < pKeys.length; ++i) {
				var iCode: uint = EKeyCodes[pKeys[i].toUpperCase()];

				if (!isDef(iCode)) {
					return false;
				}

				pCodes.push(iCode);
			}

			var sHash: string = " " + pCodes.sort().join(' ');
			var pFuncList: Function[] = this._pCallbackMap[sHash];

			if (!isDefAndNotNull(pFuncList)) {
				pFuncList = this._pCallbackMap[sHash] = [];
			}

			if (pFuncList.indexOf(fn) === -1) {
				pFuncList.push(fn);
			}

			return true;
		}

		capture(pTarget: Document): void;
		capture(pTarget: HTMLElement): void;
		capture(pTarget: any): void {
			this.captureMouse(pTarget);
			this.captureKeyboard(pTarget);
		}

		captureMouse(pTarget: HTMLElement): void;
		captureMouse(pTarget: Document): void;
		captureMouse(pTarget: any): void {
			var pKeys: KeyMap = this;
			var fn: EventListener = function (e: Event) {
				pKeys.dispatch(<MouseEvent>e);
			};

			if (pTarget.addEventListener) {
				pTarget.addEventListener("mousemove", fn, true);
				pTarget.addEventListener("mouseup", fn, true);
				pTarget.addEventListener("mousedown", fn, true);
			}
			else if (pTarget.attachEvent) {
				pTarget.attachEvent("onmousemove", fn);
				pTarget.attachEvent("onmouseup", fn);
				pTarget.attachEvent("onmousedown", fn);
			}
			else {
				pTarget.onmousemove = pTarget.onmouseup = pTarget.onmousedown = fn;
			}
		}

		captureKeyboard(pTarget: Document): void;
		captureKeyboard(pTarget: HTMLElement): void;
		captureKeyboard(pTarget: any): void {
			var pKeys: KeyMap = this;
			var fn: EventListener = function (e: Event) {
				pKeys.dispatch(<MouseEvent>e);
			};

			if (pTarget.addEventListener) {
				pTarget.addEventListener("keydown", fn, false);
				pTarget.addEventListener("keyup", fn, false);
			}
			else if (pTarget.attachEvent) {
				pTarget.attachEvent("onkeydown", fn);
				pTarget.attachEvent("onkeyup", fn);
			}
			else {
				pTarget.onkeydown = pTarget.onkeyup = fn;
			}
		}

		dispatch(e: MouseEvent = <MouseEvent><any>window.event): void {
			var iCode: int = (<KeyboardEvent><any>e).keyCode;

			if (e.type == "keydown") {
				this._pMap[iCode] = true;

				if (e.altKey) {
					this._pMap[EKeyCodes.ALT] = true;
				}
				if (e.ctrlKey) {
					this._pMap[EKeyCodes.CTRL] = true;
				}
				if (e.shiftKey) {
					this._pMap[EKeyCodes.SHIFT] = true;
				}
				// if (e.altKey || e.ctrlKey || e.shiftKey) {
				//	 this._pMap.splice(0);
				// }
			}
			else if (e.type == "keyup") {
				this.callListeners();

				this._pMap[iCode] = false;

				if (iCode == EKeyCodes.ALT) {
					this._pMap[EKeyCodes.ALT] = false;
				}
				if (iCode == EKeyCodes.CTRL) {
					this._pMap[EKeyCodes.CTRL] = false;
				}
				if (iCode == EKeyCodes.SHIFT) {
					this._pMap[EKeyCodes.SHIFT] = false;
				}
			}

			if (e.type == "mousemove") {
				this._v2iMousePosition.x = (<MouseEvent>e).offsetX === undefined ? (<MouseEvent>e).layerX : (<MouseEvent>e).offsetX;
				this._v2iMousePosition.y = (<MouseEvent>e).offsetY === undefined ? (<MouseEvent>e).layerY : (<MouseEvent>e).offsetY;
			}
			else if (e.type == "mouseup") {
				// LOG(e);
				this._bMouseDown = false;
			}
			else if (e.type == "mousedown") {
				e.preventDefault();
				this._v2iMousePrevPosition.x = (<MouseEvent>e).offsetX === undefined ? (<MouseEvent>e).layerX : (<MouseEvent>e).offsetX;
				this._v2iMousePrevPosition.y = (<MouseEvent>e).offsetY === undefined ? (<MouseEvent>e).layerY : (<MouseEvent>e).offsetY;
				this._bMouseDown = true;
			}
		}

		private callListeners(): void {
			var sHash: string = "";

			for (var i = 0; i < this._pMap.length; ++i) {
				if (this._pMap[i]) {
					sHash += " " + i;
				}
			}

			var pFuncList: Function[] = this._pCallbackMap[sHash];

			if (isDefAndNotNull(pFuncList)) {
				for (var i = 0; i < pFuncList.length; ++i) {
					pFuncList[i]();
				}
			}
		}

		isKeyPress(iCode: int);
		isKeyPress(eCode: EKeyCodes);

		/**  */ isKeyPress(iCode: int) {
			return this._pMap[iCode];
		}

		/**  */ getMouse(): IVec2 {
			return this._v2iMousePosition;
		}

		/**  */ getMouseShift(): IVec2 {
			return this._v2iMouseShift.set(
				this._v2iMousePosition.x - this._v2iMousePrevPosition.x,
				this._v2iMousePosition.y - this._v2iMousePrevPosition.y);
		}

		isMouseMoved(): boolean {
			return this._v2iMousePosition.x != this._v2iMousePrevPosition.x ||
				this._v2iMousePosition.y != this._v2iMousePrevPosition.y;
		}

		isMousePress(): boolean {
			return this._bMouseDown;
		}

		update(): void {
			this._v2iMousePrevPosition.set(this._v2iMousePosition);
		}
	}

}


