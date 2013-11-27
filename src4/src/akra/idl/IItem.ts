/// <reference path="IState.ts" />
/// <reference path="IMap.ts" />
/// <reference path="AIparser.ts" />

module akra {
	export interface IItem {
	    isEqual(pItem: IItem, eType?: EParserType): boolean;
	    isParentItem(pItem: IItem): boolean;
	    isChildItem(pItem: IItem): boolean;
	
	    mark(): string;
	    end(): string;
	    nextMarked(): string;
	
	    toString(): string;
	
	    isExpected(sSymbol: string): boolean;
	    addExpected(sSymbol: string): boolean;
	
	    rule: IRule;
	    position: uint;
	    index: uint;
	    state: IState;
	    expectedSymbols: IMap<boolean>;
	    isNewExpected: boolean;
	    length: uint;
	}
	
}
