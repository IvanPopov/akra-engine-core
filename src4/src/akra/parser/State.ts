/// <reference path="../idl/IMap.ts" />
/// <reference path="../idl/parser/IItem.ts" />
/// <reference path="../idl/parser/IState.ts" />

module akra.parser {
	final export class State implements IState {
		private _pItemList: IItem[];
		private _pNextStates: IMap<IState>;
		private _iIndex: uint;
		private _nBaseItems: uint;

		getIndex(): uint {
			return this._iIndex;
		}

		setIndex(iIndex: uint): void {
			this._iIndex = iIndex;
		}

		getItems(): IItem[] {
			return this._pItemList;
		}

		getNumBaseItems(): uint {
			return this._nBaseItems;
		}

		getNextStates(): IMap<IState> {
			return this._pNextStates;
		}

		constructor() {
			this._pItemList = <IItem[]>[];
			this._pNextStates = <IMap<IState>>{};
			this._iIndex = 0;
			this._nBaseItems = 0;
		}

		hasItem(pItem: IItem, eType: EParserType): IItem {
			var i;
			var pItems: IItem[] = this._pItemList;
			for (i = 0; i < pItems.length; i++) {
				if (pItems[i].isEqual(pItem, eType)) {
					return pItems[i];
				}
			}
			return null;
		}

		hasParentItem(pItem: IItem): IItem {
			var i;
			var pItems = this._pItemList;
			for (i = 0; i < pItems.length; i++) {
				if (pItems[i].isParentItem(pItem)) {
					return pItems[i];
				}
			}
			return null;
		}

		hasChildItem(pItem: IItem): IItem {
			var i;
			var pItems = this._pItemList;
			for (i = 0; i < pItems.length; i++) {
				if (pItems[i].isChildItem(pItem)) {
					return pItems[i];
				}
			}
			return null;
		}

		hasRule(pRule: IRule, iPos: uint): boolean {
			var i: uint = 0;
			var pItemList: IItem[] = this._pItemList;
			var pItem: IItem;

			for (i = 0; i < this._nBaseItems; i++) {
				pItem = pItemList[i];
				if (pItem.getRule() === pRule && pItem.getPosition() === iPos) {
					return true;
				}
			}

			return false;
		}

		isEmpty(): boolean {
			return !(this._pItemList.length);
		}

		isEqual(pState: IState, eType: EParserType): boolean {
			var pItemsA: IItem[] = this._pItemList;
			var pItemsB: IItem[] = pState.getItems();

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
		}

		push(pItem: IItem): void {
			if (this._pItemList.length === 0 || pItem.getPosition() > 0) {
				this._nBaseItems += 1;
			}
			pItem.setState(this);
			this._pItemList.push(pItem);
		}

		tryPush_LR0(pRule: IRule, iPos: uint): boolean {
			var i: uint;
			var pItems: IItem[] = this._pItemList;
			for (i = 0; i < pItems.length; i++) {
				if (pItems[i].getRule() === pRule && pItems[i].getPosition() === iPos) {
					return false;
				}
			}
			var pItem: IItem = new Item(pRule, iPos);
			this.push(pItem);
			return true;
		}

		tryPush_LR(pRule: IRule, iPos: uint, sExpectedSymbol: string): boolean {
			var i: uint;
			var pItems: IItem[] = <IItem[]>(this._pItemList);

			for (i = 0; i < pItems.length; i++) {
				if (pItems[i].getRule() === pRule && pItems[i].getPosition() === iPos) {
					return pItems[i].addExpected(sExpectedSymbol);
				}
			}

			var pExpected: IMap<boolean> = <IMap<boolean>>{};
			pExpected[sExpectedSymbol] = true;

			var pItem: IItem = new Item(pRule, iPos, pExpected);
			this.push(pItem);
			return true;
		}

		getNextStateBySymbol(sSymbol: string): IState {
			if (isDef(this._pNextStates[sSymbol])) {
				return this._pNextStates[sSymbol];
			}
			else {
				return null;
			}
		}

		addNextState(sSymbol: string, pState: IState): boolean {
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

		toString(isBase: boolean = true): string {
			var len: uint = 0;
			var sMsg: string;
			var pItemList: IItem[] = this._pItemList;

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
}
