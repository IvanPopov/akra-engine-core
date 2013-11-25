/// <reference path="AIState.ts" />
/// <reference path="AIMap.ts" />
/// <reference path="AIparser.ts" />

interface AIItem {
    isEqual(pItem: AIItem, eType?: AEParserType): boolean;
    isParentItem(pItem: AIItem): boolean;
    isChildItem(pItem: AIItem): boolean;

    mark(): string;
    end(): string;
    nextMarked(): string;

    toString(): string;

    isExpected(sSymbol: string): boolean;
    addExpected(sSymbol: string): boolean;

    rule: AIRule;
    position: uint;
    index: uint;
    state: AIState;
    expectedSymbols: AIMap<boolean>;
    isNewExpected: boolean;
    length: uint;
}
