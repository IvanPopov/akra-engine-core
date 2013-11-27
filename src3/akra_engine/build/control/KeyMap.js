/// <reference path="../idl/AIKeyMap.ts" />
define(["require", "exports", "math/Vec2"], function(require, exports, __Vec2__) {
    var Vec2 = __Vec2__;

    var KeyMap = (function () {
        function KeyMap(pTarget) {
            this._pMap = new Array(256 /* TOTAL */);
            this._pCallbackMap = {};
            this._bMouseDown = false;
            this._v2iMousePosition = new Vec2();
            this._v2iMousePrevPosition = new Vec2();
            this._v2iMouseShift = new Vec2();
            for (var i = 256 /* TOTAL */; i--;) {
                this._pMap[i] = false;
            }

            if (isDefAndNotNull(pTarget)) {
                this.capture(pTarget);
            }
        }
        KeyMap.prototype.bind = function (sCombination, fn) {
            var pKeys = sCombination.replace(/[\s]+/g, "").split("+");
            var pCodes = [];

            for (var i = 0; i < pKeys.length; ++i) {
                var iCode = AEKeyCodes[pKeys[i].toUpperCase()];

                if (!isDef(iCode)) {
                    return false;
                }

                pCodes.push(iCode);
            }

            var sHash = " " + pCodes.sort().join(' ');
            var pFuncList = this._pCallbackMap[sHash];

            if (!isDefAndNotNull(pFuncList)) {
                pFuncList = this._pCallbackMap[sHash] = [];
            }

            if (pFuncList.indexOf(fn) === -1) {
                pFuncList.push(fn);
            }

            return true;
        };

        KeyMap.prototype.capture = function (pTarget) {
            this.captureMouse(pTarget);
            this.captureKeyboard(pTarget);
        };

        KeyMap.prototype.captureMouse = function (pTarget) {
            var pKeys = this;
            var fn = function (e) {
                pKeys.dispatch(e);
            };

            if (pTarget.addEventListener) {
                pTarget.addEventListener("mousemove", fn, true);
                pTarget.addEventListener("mouseup", fn, true);
                pTarget.addEventListener("mousedown", fn, true);
            } else if (pTarget.attachEvent) {
                pTarget.attachEvent("onmousemove", fn);
                pTarget.attachEvent("onmouseup", fn);
                pTarget.attachEvent("onmousedown", fn);
            } else {
                pTarget.onmousemove = pTarget.onmouseup = pTarget.onmousedown = fn;
            }
        };

        KeyMap.prototype.captureKeyboard = function (pTarget) {
            var pKeys = this;
            var fn = function (e) {
                pKeys.dispatch(e);
            };

            if (pTarget.addEventListener) {
                pTarget.addEventListener("keydown", fn, false);
                pTarget.addEventListener("keyup", fn, false);
            } else if (pTarget.attachEvent) {
                pTarget.attachEvent("onkeydown", fn);
                pTarget.attachEvent("onkeyup", fn);
            } else {
                pTarget.onkeydown = pTarget.onkeyup = fn;
            }
        };

        KeyMap.prototype.dispatch = function (e) {
            if (typeof e === "undefined") { e = window.event; }
            var iCode = (e).keyCode;

            if (e.type == "keydown") {
                this._pMap[iCode] = true;

                if (e.altKey) {
                    this._pMap[18 /* ALT */] = true;
                }
                if (e.ctrlKey) {
                    this._pMap[17 /* CTRL */] = true;
                }
                if (e.shiftKey) {
                    this._pMap[16 /* SHIFT */] = true;
                }
                // if (e.altKey || e.ctrlKey || e.shiftKey) {
                //	 this._pMap.splice(0);
                // }
            } else if (e.type == "keyup") {
                this.callListeners();

                this._pMap[iCode] = false;

                if (iCode == 18 /* ALT */) {
                    this._pMap[18 /* ALT */] = false;
                }
                if (iCode == 17 /* CTRL */) {
                    this._pMap[17 /* CTRL */] = false;
                }
                if (iCode == 16 /* SHIFT */) {
                    this._pMap[16 /* SHIFT */] = false;
                }
            }

            if (e.type == "mousemove") {
                this._v2iMousePosition.x = (e).offsetX;
                this._v2iMousePosition.y = (e).offsetY;
            } else if (e.type == "mouseup") {
                // LOG(e);
                this._bMouseDown = false;
            } else if (e.type == "mousedown") {
                e.preventDefault();
                this._v2iMousePrevPosition.x = (e).offsetX;
                this._v2iMousePrevPosition.y = (e).offsetY;
                this._bMouseDown = true;
            }
        };

        KeyMap.prototype.callListeners = function () {
            var sHash = "";

            for (var i = 0; i < this._pMap.length; ++i) {
                if (this._pMap[i]) {
                    sHash += " " + i;
                }
            }

            var pFuncList = this._pCallbackMap[sHash];

            if (isDefAndNotNull(pFuncList)) {
                for (var i = 0; i < pFuncList.length; ++i) {
                    pFuncList[i]();
                }
            }
        };

        /** inline */ KeyMap.prototype.isKeyPress = function (iCode) {
            return this._pMap[iCode];
        };

        /** inline */ KeyMap.prototype.getMouse = function () {
            return this._v2iMousePosition;
        };

        /** inline */ KeyMap.prototype.getMouseShift = function () {
            return this._v2iMouseShift.set(this._v2iMousePosition.x - this._v2iMousePrevPosition.x, this._v2iMousePosition.y - this._v2iMousePrevPosition.y);
        };

        KeyMap.prototype.isMouseMoved = function () {
            return this._v2iMousePosition.x != this._v2iMousePrevPosition.x || this._v2iMousePosition.y != this._v2iMousePrevPosition.y;
        };

        KeyMap.prototype.isMousePress = function () {
            return this._bMouseDown;
        };

        KeyMap.prototype.update = function () {
            this._v2iMousePrevPosition.set(this._v2iMousePosition);
        };
        return KeyMap;
    })();

    
    return KeyMap;
});
//# sourceMappingURL=KeyMap.js.map
