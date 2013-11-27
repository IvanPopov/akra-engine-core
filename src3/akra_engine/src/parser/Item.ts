/// <reference path="../idl/AIMap.ts" />
/// <reference path="../idl/AIItem.ts" />

import symbols = require("symbols");
import END_POSITION = symbols.END_POSITION;
import T_EMPTY = symbols.T_EMPTY;

class Item implements AIItem {
    private _pRule: AIRule;
    private _iPos: uint;
    private _iIndex: uint;
    private _pState: AIState;

    private _pExpected: AIMap<boolean>;
    private _isNewExpected: boolean;
    private _iLength: uint;


    get rule(): AIRule {
        return this._pRule;
    }

    set rule(pRule: AIRule) {
        this._pRule = pRule;
    }

    get position(): uint {
        return this._iPos;
    }

    set position(iPos: uint) {
        this._iPos = iPos;
    }

    get state(): AIState {
        return this._pState;
    }

    set state(pState: AIState) {
        this._pState = pState;
    }

    get index(): uint {
        return this._iIndex;
    }

    set index(iIndex: uint) {
        this._iIndex = iIndex;
    }

    get expectedSymbols(): AIMap<boolean> {
        return this._pExpected;
    }

    get length(): uint {
        return this._iLength;
    }

    get isNewExpected(): boolean {
        return this._isNewExpected;
    }

    set isNewExpected(_isNewExpected: boolean) {
        this._isNewExpected = _isNewExpected;
    }

    constructor(pRule: AIRule, iPos: uint, pExpected?: AIMap<boolean>) {
        this._pRule = pRule;
        this._iPos = iPos;
        this._iIndex = 0;
        this._pState = null;

        this._isNewExpected = true;
        this._iLength = 0;
        this._pExpected = <AIMap<boolean>>{};

        if (arguments.length === 3) {
            var i: string = null;
            for (i in <AIMap<boolean>>arguments[2]) {
                this.addExpected(i);
            }
        }
    }

    isEqual(pItem: AIItem, eType: AEParserType = AEParserType.k_LR0): boolean {
        if (eType === AEParserType.k_LR0) {
            return (this._pRule === pItem.rule && this._iPos === pItem.position);
        }
        else if (eType === AEParserType.k_LR1) {
            if (!(this._pRule === pItem.rule && this._iPos === pItem.position && this._iLength === (<AIItem>pItem).length)) {
                return false;
            }
            var i: string = null;
            for (i in this._pExpected) {
                if (!(<AIItem>pItem).isExpected(i)) {
                    return false;
                }
            }
            return true;
        }
    }

    isParentItem(pItem: AIItem): boolean {
        return (this._pRule === pItem.rule && this._iPos === pItem.position + 1);
    }

    isChildItem(pItem: AIItem): boolean {
        return (this._pRule === pItem.rule && this._iPos === pItem.position - 1);
    }

    mark(): string {
        var pRight: string[] = this._pRule.right;
        if (this._iPos === pRight.length) {
            return END_POSITION;
        }
        return pRight[this._iPos];
    }

    end(): string {
        return this._pRule.right[this._pRule.right.length - 1] || T_EMPTY;
    }

    nextMarked(): string {
        return this._pRule.right[this._iPos + 1] || END_POSITION;
    }

    isExpected(sSymbol: string): boolean {
        return !!(this._pExpected[sSymbol]);
    }

    addExpected(sSymbol: string): boolean {
        if (this._pExpected[sSymbol]) {
            return false;
        }
        this._pExpected[sSymbol] = true;
        this._isNewExpected = true;
        this._iLength++;
        return true;
    }

    toString(): string {
        var sMsg: string = this._pRule.left + " -> ";
        var sExpected: string = "";
        var pRight: string[] = this._pRule.right;

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
    }
}

export = Item;