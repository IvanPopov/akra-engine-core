/// <reference path="../idl/IMap.ts" />
/// <reference path="../idl/parser/IItem.ts" />
/// <reference path="../idl/parser/IState.ts" />
var akra;
(function (akra) {
    (function (parser) {
        var State = (function () {
            function State() {
                this._pItemList = [];
                this._pNextStates = {};
                this._iIndex = 0;
                this._nBaseItems = 0;
            }
            State.prototype.getIndex = function () {
                return this._iIndex;
            };

            State.prototype.setIndex = function (iIndex) {
                this._iIndex = iIndex;
            };

            State.prototype.getItems = function () {
                return this._pItemList;
            };

            State.prototype.getNumBaseItems = function () {
                return this._nBaseItems;
            };

            State.prototype.getNextStates = function () {
                return this._pNextStates;
            };

            State.prototype.hasItem = function (pItem, eType) {
                var i;
                var pItems = this._pItemList;
                for (i = 0; i < pItems.length; i++) {
                    if (pItems[i].isEqual(pItem, eType)) {
                        return pItems[i];
                    }
                }
                return null;
            };

            State.prototype.hasParentItem = function (pItem) {
                var i;
                var pItems = this._pItemList;
                for (i = 0; i < pItems.length; i++) {
                    if (pItems[i].isParentItem(pItem)) {
                        return pItems[i];
                    }
                }
                return null;
            };

            State.prototype.hasChildItem = function (pItem) {
                var i;
                var pItems = this._pItemList;
                for (i = 0; i < pItems.length; i++) {
                    if (pItems[i].isChildItem(pItem)) {
                        return pItems[i];
                    }
                }
                return null;
            };

            State.prototype.hasRule = function (pRule, iPos) {
                var i = 0;
                var pItemList = this._pItemList;
                var pItem;

                for (i = 0; i < this._nBaseItems; i++) {
                    pItem = pItemList[i];
                    if (pItem.getRule() === pRule && pItem.getPosition() === iPos) {
                        return true;
                    }
                }

                return false;
            };

            State.prototype.isEmpty = function () {
                return !(this._pItemList.length);
            };

            State.prototype.isEqual = function (pState, eType) {
                var pItemsA = this._pItemList;
                var pItemsB = pState.getItems();

                if (this._nBaseItems !== pState.getNumBaseItems()) {
                    return false;
                }
                var nItems = this._nBaseItems;
                var i, j;
                var isEqual;
                for (i = 0; i < nItems; i++) {
                    isEqual = false;
                    for (j = 0; j < nItems; j++) {
                        if (pItemsA[i].isEqual(pItemsB[j], eType)) {
                            isEqual = true;
                            break;
                        }
                    }
                    if (!isEqual) {
                        return false;
                    }
                }
                return true;
            };

            State.prototype.push = function (pItem) {
                if (this._pItemList.length === 0 || pItem.getPosition() > 0) {
                    this._nBaseItems += 1;
                }
                pItem.setState(this);
                this._pItemList.push(pItem);
            };

            State.prototype.tryPush_LR0 = function (pRule, iPos) {
                var i;
                var pItems = this._pItemList;
                for (i = 0; i < pItems.length; i++) {
                    if (pItems[i].getRule() === pRule && pItems[i].getPosition() === iPos) {
                        return false;
                    }
                }
                var pItem = new akra.parser.Item(pRule, iPos);
                this.push(pItem);
                return true;
            };

            State.prototype.tryPush_LR = function (pRule, iPos, sExpectedSymbol) {
                var i;
                var pItems = (this._pItemList);

                for (i = 0; i < pItems.length; i++) {
                    if (pItems[i].getRule() === pRule && pItems[i].getPosition() === iPos) {
                        return pItems[i].addExpected(sExpectedSymbol);
                    }
                }

                var pExpected = {};
                pExpected[sExpectedSymbol] = true;

                var pItem = new akra.parser.Item(pRule, iPos, pExpected);
                this.push(pItem);
                return true;
            };

            State.prototype.getNextStateBySymbol = function (sSymbol) {
                if (akra.isDef(this._pNextStates[sSymbol])) {
                    return this._pNextStates[sSymbol];
                } else {
                    return null;
                }
            };

            State.prototype.addNextState = function (sSymbol, pState) {
                if (akra.isDef(this._pNextStates[sSymbol])) {
                    return false;
                } else {
                    this._pNextStates[sSymbol] = pState;
                    return true;
                }
            };

            State.prototype.deleteNotBase = function () {
                this._pItemList.length = this._nBaseItems;
            };

            State.prototype.toString = function (isBase) {
                if (typeof isBase === "undefined") { isBase = true; }
                var len = 0;
                var sMsg;
                var pItemList = this._pItemList;

                sMsg = "State " + this._iIndex + ":\n";
                len = isBase ? this._nBaseItems : pItemList.length;

                for (var j = 0; j < len; j++) {
                    sMsg += "\t\t";
                    sMsg += pItemList[j].toString();
                    sMsg += "\n";
                }

                return sMsg;
            };
            return State;
        })();
        parser.State = State;
    })(akra.parser || (akra.parser = {}));
    var parser = akra.parser;
})(akra || (akra = {}));
//# sourceMappingURL=State.js.map
