#ifndef KEYMAP_TS
#define KEYMAP_TS

#include "IKeyMap.ts"

module akra.controls {
	class KeyMap implements IKeyMap {
		private _pMap: bool[] = new Array(256);
		
		private _bAlt: bool = false;
		private _bCtrl: bool = false;
		private _bShift: bool = false;

		private _bMouseDown: bool = false;
		private _v2iMousePosition: IVec2 = new Vec2;
		private _v2iMousePrevPosition: IVec2 = new Vec2;
		private _v2iMouseShift: IVec2 = new Vec2;

		constructor(pTarget?: HTMLElement) {
			for (var i = EKeyCodes.TOTAL; i--;) {
		        this._pMap[i] = false;
		    }

		    if (isDefAndNotNull(pTarget)) {
		    	this.capture(pTarget);
		    }
		}

		capture(pTarget: HTMLElement): void {
			this.captureMouse(pTarget);
			this.captureKeyboard(pTarget);
		}

		captureMouse(pTarget: HTMLElement): void {
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

		captureKeyboard(pTarget: HTMLElement): void {
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
		            this._bAlt = true;
		        }
		        if (e.ctrlKey) {
		            this._bCtrl = true;
		        }
		        if (e.shiftKey) {
		            this._bShift = true;
		        }
		        // if (e.altKey || e.ctrlKey || e.shiftKey) {
		        //     this._pMap.splice(0);
		        // }
		    }
		    else if (e.type == "keyup") {
		        this._pMap[iCode] = false;

		        if(iCode == EKeyCodes.ALT){
		            this._bAlt = false;
		        }
		        if(iCode == EKeyCodes.CTRL){
		            this._bCtrl = false;
		        }
		        if(iCode == EKeyCodes.SHIFT){
		            this._bShift = false;
		        }
		    }

		    if (e.type == "mousemove") {
		        this._v2iMousePosition.x = (<MouseEvent>e).pageX;
		        this._v2iMousePosition.y = (<MouseEvent>e).pageY;
		    }
		    else if (e.type == "mouseup") {
		        this._bMouseDown = false;
		    }
		    else if (e.type == "mousedown") {
		        this._bMouseDown = true;
		    }
		}

	    isKeyPress(iCode: int);
		isKeyPress(eCode: EKeyCodes);

		inline isKeyPress(iCode: int) {
			return this._pMap[iCode];
		}

		inline getMouse(): IVec2 {
			return this._v2iMousePosition;
		}

		inline getMouseShift(): IVec2 {
			return this._v2iMouseShift.set(
				this._v2iMousePosition.x - this._v2iMousePrevPosition.x, 
				this._v2iMousePosition.y - this._v2iMousePrevPosition.y);
		}

		isMouseMoved(): bool {
			return this._v2iMousePosition.x != this._v2iMousePrevPosition.x || 
					this._v2iMousePosition.y != this._v2iMousePrevPosition.y;
		}

		isMousePress(): bool {
			return this._bMouseDown;
		}

		update(): void {
			this._v2iMousePrevPosition.set(this._v2iMousePosition);
		}
	}

	export function createKeymap(target?: HTMLElement): IKeyMap {
		return new KeyMap(target);
	}
}

#endif