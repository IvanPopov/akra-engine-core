/// <reference path="../idl/AIMap.ts" />
/// <reference path="../idl/AIItem.ts" />
define(["require", "exports"], function(require, exports) {
    
    var END_POSITION = symbols.END_POSITION;
    var T_EMPTY = symbols.T_EMPTY;

    var Item = (function () {
        function Item(pRule, iPos, pExpected) {
            this._pRule = pRule;
            this._iPos = iPos;
            this._iIndex = 0;
            this._pState = null;

            this._isNewExpected = true;
            this._iLength = 0;
            this._pExpected = {};

            if (arguments.length === 3) {
                var i = null;
                for (i in arguments[2]) {
                    this.addExpected(i);
                }
            }
        }
        Object.defineProperty(Item.prototype, "rule", {
            get: function () {
                return this._pRule;
            },
            set: function (pRule) {
                this._pRule = pRule;
            },
            enumerable: true,
            configurable: true
        });


        Object.defineProperty(Item.prototype, "position", {
            get: function () {
                return this._iPos;
            },
            set: function (iPos) {
                this._iPos = iPos;
            },
            enumerable: true,
            configurable: true
        });


        Object.defineProperty(Item.prototype, "state", {
            get: function () {
                return this._pState;
            },
            set: function (pState) {
                this._pState = pState;
            },
            enumerable: true,
            configurable: true
        });


        Object.defineProperty(Item.prototype, "index", {
            get: function () {
                return this._iIndex;
            },
            set: function (iIndex) {
                this._iIndex = iIndex;
            },
            enumerable: true,
            configurable: true
        });


        Object.defineProperty(Item.prototype, "expectedSymbols", {
            get: function () {
                return this._pExpected;
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(Item.prototype, "length", {
            get: function () {
                return this._iLength;
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(Item.prototype, "isNewExpected", {
            get: function () {
                return this._isNewExpected;
            },
            set: function (_isNewExpected) {
                this._isNewExpected = _isNewExpected;
            },
            enumerable: true,
            configurable: true
        });


        Item.prototype.isEqual = function (pItem, eType) {
            if (typeof eType === "undefined") { eType = 0 /* k_LR0 */; }
            if (eType === 0 /* k_LR0 */) {
                return (this._pRule === pItem.rule && this._iPos === pItem.position);
            } else if (eType === 1 /* k_LR1 */) {
                if (!(this._pRule === pItem.rule && this._iPos === pItem.position && this._iLength === (pItem).length)) {
                    return false;
                }
                var i = null;
                for (i in this._pExpected) {
                    if (!(pItem).isExpected(i)) {
                        return false;
                    }
                }
                return true;
            }
        };

        Item.prototype.isParentItem = function (pItem) {
            return (this._pRule === pItem.rule && this._iPos === pItem.position + 1);
        };

        Item.prototype.isChildItem = function (pItem) {
            return (this._pRule === pItem.rule && this._iPos === pItem.position - 1);
        };

        Item.prototype.mark = function () {
            var pRight = this._pRule.right;
            if (this._iPos === pRight.length) {
                return END_POSITION;
            }
            return pRight[this._iPos];
        };

        Item.prototype.end = function () {
            return this._pRule.right[this._pRule.right.length - 1] || T_EMPTY;
        };

        Item.prototype.nextMarked = function () {
            return this._pRule.right[this._iPos + 1] || END_POSITION;
        };

        Item.prototype.isExpected = function (sSymbol) {
            return !!(this._pExpected[sSymbol]);
        };

        Item.prototype.addExpected = function (sSymbol) {
            if (this._pExpected[sSymbol]) {
                return false;
            }
            this._pExpected[sSymbol] = true;
            this._isNewExpected = true;
            this._iLength++;
            return true;
        };

        Item.prototype.toString = function () {
            var sMsg = this._pRule.left + " -> ";
            var sExpected = "";
            var pRight = this._pRule.right;

            for (var k = 0; k < pRight.length; k++) {
                if (k === this._iPos) {
                    sMsg += ". ";
                }
                sMsg += pRight[k] + " ";
            }

            if (this._iPos === pRight.length) {
                sMsg += ". ";
            }

            if (isDef(this._pExpected)) {
                sExpected = ", ";
                for (var l in this._pExpected) {
                    sExpected += l + "/";
                }
                if (sExpected !== ", ") {
                    sMsg += sExpected;
                }
            }

            sMsg = sMsg.slice(0, sMsg.length - 1);
            return sMsg;
        };
        return Item;
    })();

    
    return Item;
});
//# sourceMappingURL=Item.js.map
