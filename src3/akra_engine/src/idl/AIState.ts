/// <reference path="AIItem.ts" />
/// <reference path="AIMap.ts" />

interface AIState {

    hasItem(pItem: AIItem, eType: AEParserType): AIItem;
    hasParentItem(pItem: AIItem): AIItem;
    hasChildItem(pItem: AIItem): AIItem;

    hasRule(pRule: AIRule, iPos: uint): boolean;

    isEmpty(): boolean;
    isEqual(pState: AIState, eType: AEParserType): boolean;

    push(pItem: AIItem): void;

    tryPush_LR0(pRule: AIRule, iPos: uint): boolean;
    tryPush_LR(pRule: AIRule, iPos: uint, sExpectedSymbol: string): boolean;

    deleteNotBase(): void;

    getNextStateBySymbol(sSymbol: string): AIState;
    addNextState(sSymbol: string, pState: AIState): boolean;

    toString(isBase: boolean): string;

    items: AIItem[];
    numBaseItems: uint;
    index: uint;
    nextStates: AIMap<AIState>;
}
