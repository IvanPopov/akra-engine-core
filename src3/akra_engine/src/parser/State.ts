/// <reference path="../idl/AIMap.ts" />

import Item = require("parser/Item");

class State implements AIState {
    private _pItemList: AIItem[];
    private _pNextStates: AIMap<AIState>;
    private _iIndex: uint;
    private _nBaseItems: uint;

    get items(): AIItem[] {
        return this._pItemList;
    }

    get numBaseItems(): uint {
        return this._nBaseItems;
    }

    get index(): uint {
        return this._iIndex;
    }

    set index(iIndex: uint) {
        this._iIndex = iIndex;
    }

    get nextStates(): AIMap<AIState> {
        return this._pNextStates;
    }

    constructor() {
        this._pItemList = <AIItem[]>[];
        this._pNextStates = <AIMap<AIState>>{};
        this._iIndex = 0;
        this._nBaseItems = 0;
    }

    hasItem(pItem: AIItem, eType: AEParserType): AIItem {
        var i;
        var pItems: AIItem[] = this._pItemList;
        for (i = 0; i < pItems.length; i++) {
            if (pItems[i].isEqual(pItem, eType)) {
                return pItems[i];
            }
        }
        return null;
    }

    hasParentItem(pItem: AIItem): AIItem {
        var i;
        var pItems = this._pItemList;
        for (i = 0; i < pItems.length; i++) {
            if (pItems[i].isParentItem(pItem)) {
                return pItems[i];
            }
        }
        return null;
    }

    hasChildItem(pItem: AIItem): AIItem {
        var i;
        var pItems = this._pItemList;
        for (i = 0; i < pItems.length; i++) {
            if (pItems[i].isChildItem(pItem)) {
                return pItems[i];
            }
        }
        return null;
    }

    hasRule(pRule: AIRule, iPos: uint): boolean {
        var i: uint = 0;
        var pItemList: AIItem[] = this._pItemList;
        var pItem: AIItem;

        for (i = 0; i < this._nBaseItems; i++) {
            pItem = pItemList[i];
            if (pItem.rule === pRule && pItem.position === iPos) {
                return true;
            }
        }

        return false;
    }

    isEmpty(): boolean {
        return !(this._pItemList.length);
    }

    isEqual(pState: AIState, eType: AEParserType): boolean {

        var pItemsA: AIItem[] = this._pItemList;
        var pItemsB: AIItem[] = pState.items;

        if (this._nBaseItems !== pState.numBaseItems) {
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
    }

    push(pItem: AIItem): void {
        if (this._pItemList.length === 0 || pItem.position > 0) {
            this._nBaseItems += 1;
        }
        pItem.state = this;
        this._pItemList.push(pItem);
    }

    tryPush_LR0(pRule: AIRule, iPos: uint): boolean {
        var i: uint;
        var pItems: AIItem[] = this._pItemList;
        for (i = 0; i < pItems.length; i++) {
            if (pItems[i].rule === pRule && pItems[i].position === iPos) {
                return false;
            }
        }
        var pItem: AIItem = new Item(pRule, iPos);
        this.push(pItem);
        return true;
    }

    tryPush_LR(pRule: AIRule, iPos: uint, sExpectedSymbol: string): boolean {
        var i: uint;
        var pItems: AIItem[] = <AIItem[]>(this._pItemList);

        for (i = 0; i < pItems.length; i++) {
            if (pItems[i].rule === pRule && pItems[i].position === iPos) {
                return pItems[i].addExpected(sExpectedSymbol);
            }
        }

        var pExpected: AIMap<boolean> = <AIMap<boolean>>{};
        pExpected[sExpectedSymbol] = true;

        var pItem: AIItem = new Item(pRule, iPos, pExpected);
        this.push(pItem);
        return true;
    }

    getNextStateBySymbol(sSymbol: string): AIState {
        if (isDef(this._pNextStates[sSymbol])) {
            return this._pNextStates[sSymbol];
        }
        else {
            return null;
        }
    }

    addNextState(sSymbol: string, pState: AIState): boolean {
        if (isDef(this._pNextStates[sSymbol])) {
            return false;
        }
        else {
            this._pNextStates[sSymbol] = pState;
            return true;
        }
    }

    deleteNotBase(): void {
        this._pItemList.length = this._nBaseItems;
    }

    toString(isBase: boolean): string {
        var len: uint = 0;
        var sMsg: string;
        var pItemList: AIItem[] = this._pItemList;

        sMsg = "State " + this._iIndex + ":\n";
        len = isBase ? this._nBaseItems : pItemList.length;

        for (var j = 0; j < len; j++) {
            sMsg += "\t\t";
            sMsg += pItemList[j].toString();
            sMsg += "\n";
        }

        return sMsg;
    }
}

export = State;