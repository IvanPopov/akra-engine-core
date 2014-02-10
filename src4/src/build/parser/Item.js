/// <reference path="../idl/IMap.ts" />
var akra;
(function (akra) {
    /// <reference path="../idl/parser/IParser.ts" />
    /// <reference path="../idl/parser/IItem.ts" />
    /// <reference path="../common.ts" />
    /// <reference path="symbols.ts" />
    (function (parser) {
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
                    var pKeys = Object.getOwnPropertyNames(arguments[2]);

                    for (var i = 0; i < pKeys.length; i++) {
                        this.addExpected(pKeys[i]);
                    }
                }
            }
            Item.prototype.getRule = function () {
                return this._pRule;
            };

            Item.prototype.setRule = function (pRule) {
                this._pRule = pRule;
            };

            Item.prototype.getPosition = function () {
                return this._iPos;
            };

            Item.prototype.setPosition = function (iPos) {
                this._iPos = iPos;
            };

            Item.prototype.getState = function () {
                return this._pState;
            };

            Item.prototype.setState = function (pState) {
                this._pState = pState;
            };

            Item.prototype.getIndex = function () {
                return this._iIndex;
            };

            Item.prototype.setIndex = function (iIndex) {
                this._iIndex = iIndex;
            };

            Item.prototype.getIsNewExpected = function () {
                return this._isNewExpected;
            };

            Item.prototype.setIsNewExpected = function (_isNewExpected) {
                this._isNewExpected = _isNewExpected;
            };

            Item.prototype.getExpectedSymbols = function () {
                return this._pExpected;
            };

            Item.prototype.getLength = function () {
                return this._iLength;
            };

            Item.prototype.isEqual = function (pItem, eType) {
                if (typeof eType === "undefined") { eType = 0 /* k_LR0 */; }
                if (eType === 0 /* k_LR0 */) {
                    return (this._pRule === pItem.getRule() && this._iPos === pItem.getPosition());
                } else if (eType === 1 /* k_LR1 */) {
                    if (!(this._pRule === pItem.getRule() && this._iPos === pItem.getPosition() && this._iLength === pItem.getLength())) {
                        return false;
                    }
                    var i = "";
                    for (i in this._pExpected) {
                        if (!pItem.isExpected(i)) {
                            return false;
                        }
                    }
                    return true;
                } else {
                    //We never must be here, for LALR(1) we work with LR0 items. This 'else'-stmt onlu for closure-compliler.
                    return false;
                }
            };

            Item.prototype.isParentItem = function (pItem) {
                return (this._pRule === pItem.getRule() && this._iPos === pItem.getPosition() + 1);
            };

            Item.prototype.isChildItem = function (pItem) {
                return (this._pRule === pItem.getRule() && this._iPos === pItem.getPosition() - 1);
            };

            Item.prototype.mark = function () {
                var pRight = this._pRule.right;
                if (this._iPos === pRight.length) {
                    return akra.parser.END_POSITION;
                }
                return pRight[this._iPos];
            };

            Item.prototype.end = function () {
                return this._pRule.right[this._pRule.right.length - 1] || akra.parser.T_EMPTY;
            };

            Item.prototype.nextMarked = function () {
                return this._pRule.right[this._iPos + 1] || akra.parser.END_POSITION;
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

                if (akra.isDef(this._pExpected)) {
                    sExpected = ", ";
                    var pKeys = Object.getOwnPropertyNames(this._pExpected);

                    for (var l = 0; l < pKeys.length; ++l) {
                        sExpected += pKeys[l] + "/";
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
        parser.Item = Item;
    })(akra.parser || (akra.parser = {}));
    var parser = akra.parser;
})(akra || (akra = {}));
//# sourceMappingURL=Item.js.map
