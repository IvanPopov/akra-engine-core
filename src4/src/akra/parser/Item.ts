/// <reference path="../idl/IMap.ts" />

/// <reference path="../idl/parser/IParser.ts" />
/// <reference path="../idl/parser/IItem.ts" />

/// <reference path="../common.ts" />
/// <reference path="symbols.ts" />

module akra.parser {
    export class Item implements IItem {
        private _pRule: IRule;
        private _iPos: uint;
        private _iIndex: uint;
        private _pState: IState;

        private _pExpected: IMap<boolean>;
        private _isNewExpected: boolean;
        private _iLength: uint;


        get rule(): IRule {
            return this._pRule;
        }

        set rule(pRule: IRule) {
            this._pRule = pRule;
        }

        get position(): uint {
            return this._iPos;
        }

        set position(iPos: uint) {
            this._iPos = iPos;
        }

        get state(): IState {
            return this._pState;
        }

        set state(pState: IState) {
            this._pState = pState;
        }

        get index(): uint {
            return this._iIndex;
        }

        set index(iIndex: uint) {
            this._iIndex = iIndex;
        }

        get expectedSymbols(): IMap<boolean> {
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

        constructor(pRule: IRule, iPos: uint, pExpected?: IMap<boolean>) {
            this._pRule = pRule;
            this._iPos = iPos;
            this._iIndex = 0;
            this._pState = null;

            this._isNewExpected = true;
            this._iLength = 0;
            this._pExpected = <IMap<boolean>>{};

            if (arguments.length === 3) {
                var pKeys = Object.getOwnPropertyNames(<IMap<boolean>>arguments[2]);

                for (var i: int = 0; i < pKeys.length; i++) {
                    this.addExpected(pKeys[i]);
                }
            }
        }

        isEqual(pItem: IItem, eType: EParserType = EParserType.k_LR0): boolean {
            if (eType === EParserType.k_LR0) {
                return (this._pRule === pItem.rule && this._iPos === pItem.position);
            }
            else if (eType === EParserType.k_LR1) {
                if (!(this._pRule === pItem.rule && this._iPos === pItem.position && this._iLength === (<IItem>pItem).length)) {
                    return false;
                }
                var i: string = null;
                for (i in this._pExpected) {
                    if (!(<IItem>pItem).isExpected(i)) {
                        return false;
                    }
                }
                return true;
            }
        }

        isParentItem(pItem: IItem): boolean {
            return (this._pRule === pItem.rule && this._iPos === pItem.position + 1);
        }

        isChildItem(pItem: IItem): boolean {
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
                var pKeys = Object.getOwnPropertyNames(this._pExpected);

                for (var l: int = 0; l < pKeys.length; ++l) {
                    sExpected += pKeys[l] + "/";
                }

                if (sExpected !== ", ") {
                    sMsg += sExpected;
                }
            }

            sMsg = sMsg.slice(0, sMsg.length - 1);
            return sMsg;
        }
    }
}

