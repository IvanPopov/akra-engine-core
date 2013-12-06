/// <reference path="IItem.ts" />
/// <reference path="../IMap.ts" />

module akra.parser {

	export interface IState {
		hasItem(pItem: IItem, eType: EParserType): IItem;
		hasParentItem(pItem: IItem): IItem;
		hasChildItem(pItem: IItem): IItem;

		hasRule(pRule: IRule, iPos: uint): boolean;

		isEmpty(): boolean;
		isEqual(pState: IState, eType: EParserType): boolean;

		push(pItem: IItem): void;

		tryPush_LR0(pRule: IRule, iPos: uint): boolean;
		tryPush_LR(pRule: IRule, iPos: uint, sExpectedSymbol: string): boolean;

		deleteNotBase(): void;

		getNextStateBySymbol(sSymbol: string): IState;
		addNextState(sSymbol: string, pState: IState): boolean;

		toString(isBase: boolean): string;

		getIndex(): uint;
		setIndex(iIndex: uint): void;

		getItems(): IItem[];
		getNumBaseItems(): uint;
		getNextStates(): IMap<IState>;
	}

}