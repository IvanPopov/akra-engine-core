#ifndef KEYMAP_TS
#define KEYMAP_TS

#include "IKeyMap.ts"

module akra.controls {
	export class KeyMap implements IKeyMap {
		private _pMap: bool[] = new Array(256);
		
		private _bAlt: bool = false;
		private _bCtrl: bool = false;
		private _bShift: bool = false;

		private _bMouseDown: bool = false;
		private _v2iMousePosition: IVec2 = new Vec2;
		private _v2iMousePrevPosition: IVec2 = new Vec2;
		private _v2iMouseShift: IVec2 = new Vec2;

		constructor(pTarget: Node) {
			for (var i = EKeyCodes.TOTAL; i--;) {
		        this._pMap[i] = false;
		    }

		    if (isDefAndNotNull(pTarget)) {
		    	this.capture(pTarget);
		    }
		}

		capture(pTarget: Node): void {
			this.captureMouse(pTarget);
			this.captureKeyboard(pTarget);
		}

		captureMouse(pTarget: Node): void {
			var pKeys: IKeyMap = this;
		    var fn: Function = function (e) {
		        pKeys.dispatch(e);
		    };

		    if (pMouseTarget.addEventListener) {
		        pMouseTarget.addEventListener("mousemove", fn, true);
		        pMouseTarget.addEventListener("mouseup", fn, true);
		        pMouseTarget.addEventListener("mousedown", fn, true);
		    }
		    else if (pMouseTarget.attachEvent) {
		        pMouseTarget.attachEvent("onmousemove", fn);
		        pMouseTarget.attachEvent("onmouseup", fn);
		        pMouseTarget.attachEvent("onmousedown", fn);
		    }
		    else {
		        pMouseTarget.onmousemove = pMouseTarget.onmouseup = pMouseTarget.onmousedown = fn;
		    }
		}

		captureKeyboard(pTarget: Node): void {
			var pKeys: IKeyMap = this;
		    var fn: Function = function (e) {
		        pKeys.dispatch(e);
		    };

		    if (pKeyboardTarget.addEventListener) {
		        pKeyboardTarget.addEventListener("keydown", fn, false);
        		pKeyboardTarget.addEventListener("keyup", fn, false);
		    }
		    else if (pKeyboardTarget.attachEvent) {
		        pKeyboardTarget.attachEvent("onkeydown", fn);
        		pKeyboardTarget.attachEvent("onkeyup", fn);
		    }
		    else {
		        pKeyboardTarget.onkeydown = pKeyboardTarget.onkeyup = fn;
		    }
		}

	}
}

#endif