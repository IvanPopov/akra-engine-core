#ifndef PARSER_TS
#define PARSER_TS

#include "akra.ts"
#include "IParser.ts"
#include "bf/bitflags.ts"

module akra.util {

    enum EOperationType {
        k_Error = 100,
        k_Shift,
        k_Reduce,
        k_Success,
        k_Pause,
        k_Ok
    }



    enum ESyntaxErrorCode {
        k_Parser = 100,
        k_GrammarAddOperation,
        k_GrammarAddStateLink,
        k_GrammarUnexpectedSymbol,
        k_GrammarBadAdditionalFunctionName,
        k_GrammarBadKeyword,
        k_SyntaxError,

        k_Lexer = 200,
        k_UnknownToken,
        k_BadToken
    }

    enum ETokenType {
        k_NumericLiteral = 1,
        k_CommentLiteral,
        k_StringLiteral,
        k_PunctuatorLiteral,
        k_WhitespaceLiteral,
        k_IdentifierLiteral,
        k_KeywordLiteral,
        k_Unknown,
        k_End
    }

//     //    var SyntaxErrorMessages: StringEnum = <StringEnum>{};
//     //    SyntaxErrorMessages[ESyntaxErrorCode.k_UnknownToken] = "Uknown token: \'{Syntax.Lexer.VALUE}\'. In line: {Syntax.Lexer.LINE}. In column {Syntax.Lexer.START_COLUMN}.";

    interface IOperation {
        type: EOperationType;
        rule?: IRule;
        index?: uint;
    }

    interface IItem {
        isEqual(pItem: IItem, eType?: EParserType): bool;
        isParentItem(pItem: IItem): bool;
        isChildItem(pItem: IItem): bool;

        mark(): string;
        end(): string;
        nextMarked(): string;

        toString(): string;

        isExpected(sSymbol: string): bool;
        addExpected(sSymbol: string): bool;

        rule: IRule;
        position: uint;
        index: uint;
        state: IState;
        expectedSymbols: BoolMap;
        isNewExpected: bool;
        length: uint;
    }

    interface IState {

        hasItem(pItem: IItem, eType: EParserType): IItem;
        hasParentItem(pItem: IItem): IItem;
        hasChildItem(pItem: IItem): IItem;

        hasRule(pRule:IRule, iPos:uint):bool;

        isEmpty(): bool;
        isEqual(pState: IState, eType: EParserType): bool;

        push(pItem: IItem): void;

        tryPush_LR0(pRule: IRule, iPos: uint): bool;
        tryPush_LR(pRule: IRule, iPos: uint, sExpectedSymbol: string): bool;

        deleteNotBase(): void;

        getNextStateBySymbol(sSymbol: string): IState;
        addNextState(sSymbol: string, pState: IState): bool;

        toString(isBase: bool): string;

        items: IItem[];
        numBaseItems: uint;
        index: uint;
        nextStates: IStateMap;
    }

    interface IToken {
        value: string;
        start: uint;
        end: uint;
        line: uint;

        name?: string;
        type?: ETokenType;
    }

    interface IStateMap {
        [index: string]: IState;
    }


    class Item implements IItem {
        private _pRule: IRule;
        private _iPos: uint;
        private _iIndex: uint;
        private _pState: IState;

        private _pExpected: BoolMap;
        private _isNewExpected: bool;
        private _iLength: uint;

        
        inline get rule(): IRule {
            return this._pRule;
        }
        
        inline set rule(pRule: IRule) {
            this._pRule = pRule;
        }
        
        inline get position(): uint {
            return this._iPos;
        }
        
        inline set position(iPos: uint) {
            this._iPos = iPos;
        }
        
        inline get state(): IState {
            return this._pState;
        }
        
        inline set state(pState: IState) {
            this._pState = pState;
        }
        
        inline get index(): uint {
            return this._iIndex;
        }
        
        inline set index(iIndex: uint) {
            this._iIndex = iIndex;
        }

        inline get expectedSymbols(): BoolMap {
            return this._pExpected;
        }
        
        inline get length(): uint {
            return this._iLength;
        }
        
        inline get isNewExpected(): bool {
            return this._isNewExpected;
        }
        
        inline set isNewExpected(_isNewExpected: bool) {
            this._isNewExpected = _isNewExpected;
        }

        constructor (pRule: IRule, iPos: uint, pExpected?: BoolMap) {
            this._pRule = pRule;
            this._iPos = iPos;
            this._iIndex = 0;
            this._pState = null;

            this._isNewExpected = true;
            this._iLength = 0;
            this._pExpected = <BoolMap>{};

            if (arguments.length === 3) {
                var i: string;
                for (i in <BoolMap>arguments[2]) {
                    this.addExpected(i);
                }
            }
        }

        isEqual(pItem: IItem, eType?: EParserType = EParserType.k_LR0): bool {
            if (eType === EParserType.k_LR0) {
                return (this._pRule === pItem.rule && this._iPos === pItem.position);
            }
            else if (eType === EParserType.k_LR1) {
                if (!(this._pRule === pItem.rule && this._iPos === pItem.position && this._iLength === (<IItem>pItem).length)) {
                    return false;
                }
                var i: string;
                for (i in this._pExpected) {
                    if (!(<IItem>pItem).isExpected(i)) {
                        return false;
                    }
                }
                return true;
            }
        }

        isParentItem(pItem: IItem): bool {
            return (this._pRule === pItem.rule && this._iPos === pItem.position + 1);
        }

        isChildItem(pItem: IItem): bool {
            return (this._pRule === pItem.rule && this._iPos === pItem.position - 1);
        }

        mark(): string {
            var pRight: string[] = this._pRule.right;
            if (this._iPos === pRight.length) {
                return END_POSITION;
            }
            return pRight[this._iPos];
        }

        inline end(): string {
            return this._pRule.right[this._pRule.right.length - 1] || T_EMPTY;
        }

        inline nextMarked(): string {
            return this._pRule.right[this._iPos + 1] || END_POSITION;
        }

        inline isExpected(sSymbol: string): bool {
            return !!(this._pExpected[sSymbol]);
        }

        addExpected(sSymbol: string): bool {
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

    class State implements IState {
        private _pItemList: IItem[];
        private _pNextStates: IStateMap;
        private _iIndex: uint;
        private _nBaseItems: uint;

        inline get items(): IItem[] {
            return this._pItemList;
        }

        inline get numBaseItems(): uint {
            return this._nBaseItems;
        }

        inline get index(): uint {
            return this._iIndex;
        }

        inline set index(iIndex: uint) {
            this._iIndex = iIndex;
        }

        inline get nextStates(): IStateMap {
            return this._pNextStates;
        }

        constructor () {
            this._pItemList = <IItem[]>[];
            this._pNextStates = <IStateMap>{};
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

        hasRule(pRule:IRule, iPos: uint): bool {
            var i:uint = 0;
            var pItemList:IItem[] = this._pItemList;
            var pItem:IItem;

            for(i = 0; i < this._nBaseItems; i++){
                pItem = pItemList[i];
                if(pItem.rule === pRule && pItem.position === iPos){
                    return true;
                }
            }

            return false;
        }

        inline isEmpty(): bool {
            return !(this._pItemList.length);
        }

        isEqual(pState: IState, eType: EParserType): bool {

            var pItemsA: IItem[] = this._pItemList;
            var pItemsB: IItem[] = pState.items;

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

        push(pItem: IItem): void {
            if (this._pItemList.length === 0 || pItem.position > 0) {
                this._nBaseItems += 1;
            }
            pItem.state = this;
            this._pItemList.push(pItem);
        }

        tryPush_LR0(pRule: IRule, iPos: uint): bool {
            var i: uint;
            var pItems: IItem[] = this._pItemList;
            for (i = 0; i < pItems.length; i++) {
                if (pItems[i].rule === pRule && pItems[i].position === iPos) {
                    return false;
                }
            }
            var pItem: IItem = new Item(pRule, iPos);
            this.push(pItem);
            return true;
        }

        tryPush_LR(pRule: IRule, iPos: uint, sExpectedSymbol: string): bool {
            var i: uint;
            var pItems: IItem[] = <IItem[]>(this._pItemList);

            for (i = 0; i < pItems.length; i++) {
                if (pItems[i].rule === pRule && pItems[i].position === iPos) {
                    return pItems[i].addExpected(sExpectedSymbol);
                }
            }

            var pExpected: BoolMap = <BoolMap>{};
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

        addNextState(sSymbol: string, pState: IState) {
            if (isDef(this._pNextStates[sSymbol])) {
                return false;
            }
            else {
                this._pNextStates[sSymbol] = pState;
                return true;
            }
        }

        inline deleteNotBase(): void {
            this._pItemList.length = this._nBaseItems;
        }

        toString(isBase: bool): string {
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

    export class ParseTree implements IParseTree {
        private _pRoot: IParseNode;
        private _pNodes: IParseNode[];
        private _pNodesCountStack: uint[];
        private _isOptimizeMode: bool;

        inline get root(): IParseNode {
            return this._pRoot;
        }

        inline set root(pRoot: IParseNode) {
            this._pRoot = pRoot;
        }

        constructor () {
            this._pRoot = null;
            this._pNodes = <IParseNode[]>[];
            this._pNodesCountStack = <uint[]>[];
            this._isOptimizeMode = false;
        }

        setRoot(): void {
            this._pRoot = this._pNodes.pop();
        }

        setOptimizeMode(isOptimize: bool): void {
            this._isOptimizeMode = isOptimize;
        }

        addNode(pNode: IParseNode): void {
            this._pNodes.push(pNode);
            this._pNodesCountStack.push(1);
        }

        reduceByRule(pRule: IRule, eCreate: ENodeCreateMode = ENodeCreateMode.k_Default): void {
            var iReduceCount: uint = 0;
            var pNodesCountStack: uint[] = this._pNodesCountStack;
            var pNode: IParseNode;
            var iRuleLength: uint = pRule.right.length;
            var pNodes: IParseNode[] = this._pNodes;
            var nOptimize: uint = this._isOptimizeMode ? 1 : 0;

            while (iRuleLength) {
                iReduceCount += pNodesCountStack.pop();
                iRuleLength--;
            }

            if ((eCreate === ENodeCreateMode.k_Default && iReduceCount > nOptimize) || (eCreate === ENodeCreateMode.k_Necessary)) {
                pNode = <IParseNode>{ name: pRule.left, children: null, parent: null, value: "" };

                while (iReduceCount) {
                    this.addLink(pNode, pNodes.pop());
                    iReduceCount -= 1;
                }

                pNodes.push(pNode);
                pNodesCountStack.push(1);
            }
            else {
                pNodesCountStack.push(iReduceCount);
            }
        }

        toString(): string {
            if (this._pRoot) {
                return this.toStringNode(this._pRoot);
            }
            else {
                return "";
            }
        }

        clone(): IParseTree {
            var pTree = new ParseTree();
            pTree.root = this.cloneNode(this._pRoot);
            return pTree;
        }

        private addLink(pParent: IParseNode, pNode: IParseNode): void {
            if (!pParent.children) {
                pParent.children = <IParseNode[]>[];
            }
            pParent.children.push(pNode);
            pNode.parent = pParent;
        }

        private cloneNode(pNode: IParseNode): IParseNode {
            var pNewNode: IParseNode;
            pNewNode = <IParseNode>{
                name: pNode.name,
                value: pNode.value,
                children: null,
                parent: null
            };

            var pChildren: IParseNode[] = pNode.children;
            for (var i = 0; pChildren && i < pChildren.length; i++) {
                this.addLink(pNewNode, this.cloneNode(pChildren[i]));
            }

            return pNewNode;
        }

        private toStringNode(pNode: IParseNode, sPadding: string = ""): string {
            var sRes: string = sPadding + "{\n";
            var sOldPadding: string = sPadding;
            var sDefaultPadding: string = "  ";

            sPadding += sDefaultPadding;

            if (pNode.value) {
                sRes += sPadding + "name : \"" + pNode.name + "\"" + ",\n";
                sRes += sPadding + "value : \"" + pNode.value + "\"" + "\n";
            }
            else {

                sRes += sPadding + "name : \"" + pNode.name + "\"" + "\n";
                sRes += sPadding + "children : [";

                var pChildren: IParseNode[] = pNode.children;

                if (pChildren) {
                    sRes += "\n";
                    sPadding += sDefaultPadding;

                    for (var i = pChildren.length - 1; i >= 0; i--) {
                        sRes += this.toStringNode(pChildren[i], sPadding);
                        sRes += ",\n";
                    }

                    sRes = sRes.slice(0, sRes.length - 2);
                    sRes += "\n";
                    sRes += sOldPadding + sDefaultPadding + "]\n";
                }
                else {
                    sRes += " ]\n";
                }
            }
            sRes += sOldPadding + "}";
            return sRes;
        }
    }

    export class Lexer implements ILexer {
        private _iLineNumber: uint;
        private _iColumnNumber: uint;
        private _sSource: string;
        private _iIndex: uint;
        private _pParser: IParser;
        private _pPunctuatorsMap: StringMap;
        private _pKeywordsMap: StringMap;
        private _pPunctuatorsFirstSymbols: BoolMap;

        constructor (pParser: IParser) {
            this._iLineNumber = 0;
            this._iColumnNumber = 0;
            this._sSource = "";
            this._iIndex = 0;
            this._pParser = pParser;
            this._pPunctuatorsMap = <StringMap>{};
            this._pKeywordsMap = <StringMap>{};
            this._pPunctuatorsFirstSymbols = <BoolMap>{};
        }

        addPunctuator(sValue: string, sName?: string): string {
            if (sName === undefined && sValue.length === 1) {
                sName = "T_PUNCTUATOR_" + sValue.charCodeAt(0);

            }
            this._pPunctuatorsMap[sValue] = sName;
            this._pPunctuatorsFirstSymbols[sValue[0]] = true;
            return sName;
        }

        addKeyword(sValue: string, sName: string): string {
            this._pKeywordsMap[sValue] = sName;
            return sName;
        }

        init(sSource: string): void {
            this._sSource = sSource;
            this._iLineNumber = 0;
            this._iColumnNumber = 0;
            this._iIndex = 0;
        }

        getNextToken(): IToken {
            var ch: string = this.currentChar();
            if (!ch) {
                return <IToken>{
                    name: END_SYMBOL,
                    value: END_SYMBOL,
                    start: this._iColumnNumber,
                    end: this._iColumnNumber,
                    line: this._iLineNumber
                };
            }
            var eType: ETokenType = this.identityTokenType();
            var pToken: IToken;
            switch (eType) {
                case ETokenType.k_NumericLiteral:
                    pToken = this.scanNumber();
                    break;
                case ETokenType.k_CommentLiteral:
                    this.scanComment();
                    pToken = this.getNextToken();
                    break;
                case ETokenType.k_StringLiteral:
                    pToken = this.scanString();
                    break;
                case ETokenType.k_PunctuatorLiteral:
                    pToken = this.scanPunctuator();
                    break;
                case ETokenType.k_IdentifierLiteral:
                    pToken = this.scanIdentifier();
                    break;
                case ETokenType.k_WhitespaceLiteral:
                    this.scanWhiteSpace();
                    pToken = this.getNextToken();
                    break;
                default:
                    this.error(ESyntaxErrorCode.k_UnknownToken,
                                <IToken>{
                                    name: UNKNOWN_TOKEN,
                                    value: ch + this._sSource[this._iIndex + 1],
                                    start: this._iColumnNumber,
                                    end: this._iColumnNumber + 1,
                                    line: this._iLineNumber
                                });
            }
            return pToken;
        }

        private error(eCode: ESyntaxErrorCode, pToken: IToken): void {
            console.log(eCode, pToken);
            //ErrorContainer.Syntax.Lexer.
        }

        private identityTokenType(): ETokenType {
            if (this.isIdentifierStart()) {
                return ETokenType.k_IdentifierLiteral;
            }
            if (this.isWhiteSpaceStart()) {
                return ETokenType.k_WhitespaceLiteral;
            }
            if (this.isStringStart()) {
                return ETokenType.k_StringLiteral;
            }
            if (this.isCommentStart()) {
                return ETokenType.k_CommentLiteral;
            }
            if (this.isNumberStart()) {
                return ETokenType.k_NumericLiteral;
            }
            if (this.isPunctuatorStart()) {
                return ETokenType.k_PunctuatorLiteral;
            }
            return ETokenType.k_Unknown;
        }

        private isNumberStart(): bool {
            var ch: string = this.currentChar();

            if ((ch >= '0') && (ch <= '9')) {
                return true;
            }

            var ch1: string = this.nextChar();
            if (ch === "." && (ch1 >= '0') && (ch1 <= '9')) {
                return true;
            }

            return false;
        }

        private isCommentStart(): bool {
            var ch: string = this.currentChar();
            var ch1: string = this.nextChar();

            if (ch === "/" && (ch1 === "/" || ch1 === "*")) {
                return true;
            }

            return false;
        }

        private isStringStart(): bool {
            var ch: string = this.currentChar();
            if (ch === "\"" || ch === "'") {
                return true;
            }
            return false;
        }

        private isPunctuatorStart(): bool {
            var ch: string = this.currentChar();
            if (this._pPunctuatorsFirstSymbols[ch]) {
                return true;
            }
            return false;
        }

        private isWhiteSpaceStart(): bool {
            var ch: string = this.currentChar();
            if (ch === ' ' || ch === '\n' || ch === '\r' || ch === '\t') {
                return true;
            }
            return false;
        }

        private isIdentifierStart(): bool {
            var ch: string = this.currentChar();
            if ((ch === '_') || (ch >= 'a' && ch <= 'z') || (ch >= 'A' && ch <= 'Z')) {
                return true;
            }
            return false;
        }

        private isLineTerminator(sSymbol: string): bool {
            return (sSymbol === '\n' || sSymbol === '\r' || sSymbol === '\u2028' || sSymbol === '\u2029');
        }

        private isWhiteSpace(sSymbol: string): bool {
            return (sSymbol === ' ') || (sSymbol === '\t');
        }

        private inline isKeyword(sValue: string): bool {
            return !!(this._pKeywordsMap[sValue]);
        }

        private inline isPunctuator(sValue: string): bool {
            return !!(this._pPunctuatorsMap[sValue]);
        }

        private inline nextChar(): string {
            return this._sSource[this._iIndex + 1];
        }

        private inline currentChar(): string {
            return this._sSource[<number>this._iIndex];
        }

        private inline readNextChar(): string {
            this._iIndex++;
            this._iColumnNumber++;
            return this._sSource[<number>this._iIndex];
        }

        private scanString(): IToken {
            var chFirst: string = this.currentChar();
            var sValue: string = chFirst;
            var ch: string;
            var chPrevious: string = chFirst;
            var isGoodFinish: bool = false;
            var iStart: uint = this._iColumnNumber;

            while (true) {
                ch = this.readNextChar();
                if (!ch) {
                    break;
                }
                sValue += ch;
                if (ch === chFirst && chPrevious !== '\\') {
                    isGoodFinish = true;
                    this.readNextChar();
                    break;
                }
                chPrevious = ch;
            }

            if (isGoodFinish) {
                return <IToken>{
                    name: T_STRING,
                    value: sValue,
                    start: iStart,
                    end: this._iColumnNumber - 1,
                    line: this._iLineNumber
                };
            }
            else {
                if (!ch) {
                    ch = EOF;
                }
                sValue += ch;

                this.error(ESyntaxErrorCode.k_BadToken, <IToken> {
                    type: ETokenType.k_StringLiteral,
                    value: sValue,
                    start: iStart,
                    end: this._iColumnNumber,
                    line: this._iLineNumber
                });
                return null;
            }
        }

        private scanPunctuator(): IToken {
            var sValue: string = this.currentChar();
            var ch: string;
            var iStart: uint = this._iColumnNumber;

            while (true) {
                ch = this.readNextChar();
                if (ch) {
                    sValue += ch;
                    this._iColumnNumber++;
                    if (!this.isPunctuator(sValue)) {
                        sValue = sValue.slice(0, sValue.length - 1);
                        break;
                    }
                }
                else {
                    break;
                }
            }

            return <IToken>{
                name: this._pPunctuatorsMap[sValue],
                value: sValue,
                start: iStart,
                end: this._iColumnNumber - 1,
                line: this._iLineNumber
            };
        }

        private scanNumber(): IToken {
            var ch: string = this.currentChar();
            var sValue: string = "";
            var isFloat: bool = false;
            var chPrevious: string = ch;
            var isGoodFinish: bool = false;
            var iStart: uint = this._iColumnNumber;
            var isE: bool = false;

            if (ch === '.') {
                sValue += 0;
                isFloat = true;
            }

            sValue += ch;

            while (true) {
                ch = this.readNextChar();
                if (ch === '.') {
                    if (isFloat) {
                        break;
                    }
                    else {
                        isFloat = true;
                    }
                }
                else if (ch === 'e') {
                    if (isE) {
                        break;
                    }
                    else {
                        isE = true;
                    }
                }
                else if (((ch === '+' || ch === '-') && chPrevious === 'e')) {
                    sValue += ch;
                    chPrevious = ch;
                    continue;
                }
                else if (ch === 'f' && isFloat) {
                    ch = this.readNextChar();
                    if ((ch >= 'a' && ch <= 'z') || (ch >= 'A' && ch <= 'Z')) {
                        break;
                    }
                    isGoodFinish = true;
                    break;
                }
                else if ((ch >= 'a' && ch <= 'z') || (ch >= 'A' && ch <= 'Z')) {
                    break;
                }
                else if (!((ch >= '0') && (ch <= '9')) || !ch) {
                    if ((isE && chPrevious !== '+' && chPrevious !== '-' && chPrevious !== 'e') || !isE) {
                        isGoodFinish = true;
                    }
                    break;
                }
                sValue += ch;
                chPrevious = ch;
            }

            if (isGoodFinish) {
                var sName = isFloat ? T_FLOAT : T_UINT;
                return {
                    name: sName,
                    value: sValue,
                    start: iStart,
                    end: this._iColumnNumber - 1,
                    line: this._iLineNumber
                };
            }
            else {
                if (!ch) {
                    ch = EOF;
                }
                sValue += ch;
                this.error(ESyntaxErrorCode.k_BadToken, <IToken> {
                    type: ETokenType.k_NumericLiteral,
                    value: sValue,
                    start: iStart,
                    end: this._iColumnNumber,
                    line: this._iLineNumber
                });
                return null;
            }
        }

        private scanIdentifier(): IToken {
            var ch: string = this.currentChar();
            var sValue: string = ch;
            var iStart: uint = this._iColumnNumber;
            var isGoodFinish: bool = false;

            while (1) {
                ch = this.readNextChar();
                if (!ch) {
                    isGoodFinish = true;
                    break;
                }
                if (!((ch === '_') || (ch >= 'a' && ch <= 'z') || (ch >= 'A' && ch <= 'Z') || (ch >= '0' && ch <= '9'))) {
                    isGoodFinish = true;
                    break;
                }
                sValue += ch;
            }

            if (isGoodFinish) {
                if (this.isKeyword(sValue)) {
                    return <IToken>{
                        name: this._pKeywordsMap[sValue],
                        value: sValue,
                        start: iStart,
                        end: this._iColumnNumber - 1,
                        line: this._iLineNumber
                    };
                }
                else {
                    var sName = this._pParser.isTypeId(sValue) ? T_TYPE_ID : T_NON_TYPE_ID;
                    return <IToken> {
                        name: sName,
                        value: sValue,
                        start: iStart,
                        end: this._iColumnNumber - 1,
                        line: this._iLineNumber
                    };
                }
            }
            else {
                if (!ch) {
                    ch = EOF;
                }
                sValue += ch;
                this.error(ESyntaxErrorCode.k_BadToken, <IToken> {
                    type: ETokenType.k_IdentifierLiteral,
                    value: sValue,
                    start: iStart,
                    end: this._iColumnNumber,
                    line: this._iLineNumber
                });
                return null;
            }
        }

        private scanWhiteSpace(): bool {
            var ch: string = this.currentChar();

            while (true) {
                if (!ch) {
                    break;
                }
                if (this.isLineTerminator(ch)) {
                    if(ch === "\r" && this.nextChar() === "\n"){
                        this._iLineNumber--;    
                    }
                    this._iLineNumber++;
                    ch = this.readNextChar();
                    this._iColumnNumber = 0;
                    continue;
                }
                else if (ch === '\t') {
                    this._iColumnNumber += 3;
                }
                else if (ch !== ' ') {
                    break;
                }
                ch = this.readNextChar();
            }

            return true;
        }

        private scanComment(): bool {
            var sValue: string = this.currentChar();
            var ch: string = this.readNextChar();
            sValue += ch;

            if (ch === '/') {
                //Line Comment
                while (true) {
                    ch = this.readNextChar();
                    if (!ch) {
                        break;
                    }
                    if (this.isLineTerminator(ch)) {
                        if(ch === "\r" && this.nextChar() === "\n"){
                            this._iLineNumber--;    
                        }
                        this._iLineNumber++;
                        this.readNextChar();
                        this._iColumnNumber = 0;
                        break;
                    }
                    sValue += ch;
                }

                return true;
            }
            else {
                //Multiline Comment
                var chPrevious: string = ch;
                var isGoodFinish: bool = false;
                var iStart: uint = this._iColumnNumber;

                while (true) {
                    ch = this.readNextChar();
                    if (!ch) {
                        break;
                    }
                    sValue += ch;
                    if (ch === '/' && chPrevious === '*') {
                        isGoodFinish = true;
                        this.readNextChar();
                        break;
                    }
                    if (this.isLineTerminator(ch)) {
                        if(ch === "\r" && this.nextChar() === "\n"){
                            this._iLineNumber--;    
                        }
                        this._iLineNumber++;
                        this._iColumnNumber = -1;
                    }
                    chPrevious = ch;
                }

                if (isGoodFinish) {
                    return true;
                }
                else {
                    if (!ch) {
                        ch = EOF;
                    }
                    sValue += ch;
                    this.error(ESyntaxErrorCode.k_BadToken, <IToken> {
                        type: ETokenType.k_CommentLiteral,
                        value: sValue,
                        start: iStart,
                        end: this._iColumnNumber,
                        line: this._iLineNumber
                    });

                }

            }
        }
    }


    interface IOperationMap {
        [grammarSymbol: string]: IOperation;
        [stateIndex: uint]: IOperation;
    }

    interface IOperationDMap {
        [stateIndex: uint]: IOperationMap;
    }

    interface IRuleMap {
        [ruleIndex: uint]: IRule;
        [ruleName: string]: IRule;
    }

    interface IRuleDMap {
        [ruleIndex: uint]: IRuleMap;
        [ruleName: string]: IRuleMap;
    }

    interface IRuleFunction {
        (): EOperationType;
    }

    interface IRuleFunctionMap {
        [grammarSymbol: string]: IRuleFunction;
    }

    interface IRuleFunctionDMap {
        [stateIndex: uint]: IRuleFunctionMap;
    }

    interface IAdditionalFuncInfo{
        name: string;
        position: uint;
        rule: IRule;
    }

    export class Parser implements IParser {
        // //Input
        
        private _sSource: string;
        private _iIndex: uint;

        //Output
        
        private _pSyntaxTree: IParseTree;
        private _pTypeIdMap: BoolMap;

        //Process params

        private _pLexer: ILexer;
        private _pStack: uint[];
        private _pToken: IToken;

        //For async loading of files work fine

        private _fnFinishCallback: IFinishFunc;
        private _pCaller: any;

        //Grammar Info
        
        private _pSymbolMap: BoolMap;
        private _pSyntaxTable: IOperationDMap;
        private _pReduceOperationsMap: IOperationMap;
        private _pShiftOperationsMap: IOperationMap;
        private _pSuccessOperation: IOperation;

        private _pFirstTerminalsDMap: BoolDMap;
        private _pFollowTerminalsDMap: BoolDMap;

        private _pRulesDMap: IRuleDMap;
        private _pStateList: IState[];
        private _nRules: uint;

        private _pAdditionalFuncInfoList: IAdditionalFuncInfo[];
        private _pAdditionalFunctionsMap: IRuleFunctionMap;

        private _pAdidtionalFunctByStateDMap: IRuleFunctionDMap;

        private _eType: EParserType;

        //Additioanal info
        
        private _pRuleCreationModeMap: IntMap;
        private _eParseMode: EParseMode;

        private _isSync: bool;

        //Temp

        private _pStatesTempMap: IStateMap;
        private _pBaseItemList: IItem[];
        private _pExpectedExtensionDMap: BoolDMap;


        constructor () {
            this._sSource = "";
            this._iIndex = 0;

            this._pSyntaxTree = null;
            this._pTypeIdMap = null;

            this._pLexer = null;
            this._pStack = <uint[]>[];
            this._pToken = null;

            this._fnFinishCallback = null;
            this._pCaller = null;

            this._pSymbolMap = <BoolMap><any>{END_SYMBOL: true};
            this._pSyntaxTable = null;
            this._pReduceOperationsMap = null;
            this._pShiftOperationsMap = null;
            this._pSuccessOperation = null;

            this._pFirstTerminalsDMap = null;
            this._pFollowTerminalsDMap = null;
            this._pRulesDMap = null;
            this._pStateList = null;
            this._nRules = 0;
            this._pAdditionalFuncInfoList = null;
            this._pAdditionalFunctionsMap = null;
            this._pAdidtionalFunctByStateDMap = null;

            this._eType = EParserType.k_LR0;

            this._pRuleCreationModeMap = null;
            this._eParseMode = EParseMode.k_AllNode;

            this._isSync = false;

            this._pStatesTempMap = null;
            this._pBaseItemList = null;

            this._pExpectedExtensionDMap = null;
        }

        isTypeId(sValue: string): bool {
            return !!(this._pTypeIdMap[sValue]);
        }

        returnCode(pNode: IParseNode): string {
            if (pNode) {
                if (pNode.value) {
                    return pNode.value + " ";
                }
                else if (pNode.children) {
                    var sCode: string = "";
                    var i: uint = 0;
                    for (i = pNode.children.length - 1; i >= 0; i--) {
                        sCode += this.returnCode(pNode.children[i]);
                    }
                    return sCode;
                }
            }
            return "";
        }

        init(sGrammar: string, eType?: EParserType = EParserType.k_LALR, eMode?: EParseMode = EParseMode.k_AllNode): bool {
            try {
                this._eType = eType;
                this._pLexer = new Lexer(this);
                this._eParseMode = eMode;
                this.generateRules(sGrammar);
                this.buildSyntaxTable();
                this.generateFunctionByStateMap();
                this.clearMem();
                return true;
            }
            catch (e) {
                return false;
            }
        }

        parse(sSource: string, isSync?: bool = true, fnFinishCallback?: IFinishFunc = null, pCaller?: any = null): EParserCode {
             try {
                this.defaultInit();
                this._sSource = sSource;
                this._pLexer.init(sSource);

                this._isSync = isSync;

                this._fnFinishCallback = fnFinishCallback;
                this._pCaller = pCaller;

                var pTree:IParseTree = this._pSyntaxTree;
                var pStack:uint[] = this._pStack;
                var pSyntaxTable:IOperationDMap = this._pSyntaxTable;

                var isStop:bool = false;
                var isError:bool = false;
                var isPause:bool = false;
                var pToken:IToken = this.readToken();

                var pOperation:IOperation;
                var iRuleLength:uint;

                var eAdditionalOperationCode: EOperationType;
                var iStateIndex: uint = 0;

                while (!isStop) {
                    pOperation = pSyntaxTable[pStack[pStack.length - 1]][pToken.name];
                    if (isDef(pOperation)) {
                        switch (pOperation.type) {
                            case EOperationType.k_Success:
                                isStop = true;
                                break;

                            case EOperationType.k_Shift:

                                iStateIndex = pOperation.index;
                                pStack.push(iStateIndex);
                                pTree.addNode(<IParseNode>pToken);

                                eAdditionalOperationCode = this.operationAdditionalAction(iStateIndex, pToken.name);

                                if(eAdditionalOperationCode === EOperationType.k_Error){
                                    isError = true;
                                    isStop = true;    
                                }
                                else if(eAdditionalOperationCode === EOperationType.k_Pause){
                                    this._pToken = null;
                                    isStop = true;
                                    isPause = true;
                                }
                                else if(eAdditionalOperationCode === EOperationType.k_Ok){
                                    pToken = this.readToken();
                                }

                                break;
                            
                            case EOperationType.k_Reduce:

                                iRuleLength = pOperation.rule.right.length;
                                pStack.length -= iRuleLength;
                                iStateIndex = pSyntaxTable[pStack[pStack.length - 1]][pOperation.rule.left].index;
                                pStack.push(iStateIndex);
                                pTree.reduceByRule(pOperation.rule, this._pRuleCreationModeMap[pOperation.rule.left]);

                                eAdditionalOperationCode = this.operationAdditionalAction(iStateIndex, pOperation.rule.left);

                                if(eAdditionalOperationCode === EOperationType.k_Error){
                                    isError = true;
                                    isStop = true;    
                                }
                                else if(eAdditionalOperationCode === EOperationType.k_Pause){
                                    this._pToken = pToken;
                                    isStop = true;
                                    isPause = true;
                                }

                                break;
                        }
                    }
                    else {
                        isError = true;
                        isStop = true;
                    }
                }
                if (isPause) {
                    return EParserCode.k_Pause;
                }

                if (!isError) {
                    pTree.setRoot();
                    if (isDef(this._fnFinishCallback)) {
                        this._fnFinishCallback.call(this._pCaller, EParserCode.k_Ok);
                    }
                    return EParserCode.k_Ok;
                }
                else {
                    this.error(ESyntaxErrorCode.k_SyntaxError);
                    if (isDef(this._fnFinishCallback)) {
                        this._fnFinishCallback.call(this._pCaller, EParserCode.k_Error);
                    }
                    return EParserCode.k_Error;
                }

            }
            catch (e) {
                 return EParserCode.k_Error;
            }
        }

        pause(): EParserCode {
            return EParserCode.k_Pause;
        }

        resume(): EParserCode {
            return this.resumeParse();
        }


        private error(eCode: ESyntaxErrorCode): void {
            console.log(this.printStates(true));
            //console.log((new Error).stack);
            console.log("Error with code", eCode);
        }

        private clearMem(): void {
            delete this._pFirstTerminalsDMap;
            delete this._pFollowTerminalsDMap;
            delete this._pRulesDMap;
            delete this._pStateList;
            delete this._pReduceOperationsMap;
            delete this._pShiftOperationsMap;
            delete this._pSuccessOperation;
            delete this._pStatesTempMap;
            delete this._pBaseItemList;
            delete this._pExpectedExtensionDMap;
        }

        private hasState(pState: IState, eType: EParserType) {
            var pStateList: IState[] = this._pStateList;
            var i: uint = 0;

            for (i = 0; i < pStateList.length; i++) {
                if (pStateList[i].isEqual(pState, eType)) {
                    return pStateList[i];
                }
            }

            return null;
        }

        private isTerminal(sSymbol: string): bool {
            return !(this._pRulesDMap[sSymbol]);
        }

        private pushState(pState: IState): void {
            pState.index = this._pStateList.length;
            this._pStateList.push(pState);
        }

        private pushBaseItem(pItem: IItem): void {
            pItem.index = this._pBaseItemList.length;
            this._pBaseItemList.push(pItem);
        }

        private tryAddState(pState: IState, eType: EParserType): IState {
            var pRes = this.hasState(pState, eType);

            if (isNull(pRes)) {
                if (eType === EParserType.k_LR0) {
                    var pItems = pState.items;
                    for (var i = 0; i < pItems.length; i++) {
                        this.pushBaseItem(pItems[i]);
                    }
                }

                this.pushState(pState);
                this.closure(pState, eType);

                return pState;
            }

            return pRes;
        }

        private hasEmptyRule(sSymbol: string): bool {
            if (this.isTerminal(sSymbol)) {
                return false;
            }

            var pRulesDMap: IRuleDMap = this._pRulesDMap;
            for (var i in pRulesDMap) {
                if (pRulesDMap[sSymbol][i].right.length === 0) {
                    return true;
                }
            }

            return false;
        }

        private pushInSyntaxTable(iIndex: uint, sSymbol: string, pOperation: IOperation): void {
            var pSyntaxTable: IOperationDMap = this._pSyntaxTable;
            if (!pSyntaxTable[iIndex]) {
                pSyntaxTable[iIndex] = <IOperationMap>{};
            }
            if (isDef(pSyntaxTable[iIndex][sSymbol])) {
                this.error(ESyntaxErrorCode.k_GrammarAddOperation);
                //this.error("Grammar is not LALR(1)!", "State:", this._pStates[iIndex], "Symbol:", sSymbol, ":",
                //            "Old value:", this._ppSynatxTable[iIndex][sSymbol], "New Value: ", pOperation);
            }
            pSyntaxTable[iIndex][sSymbol] = pOperation;
        }

        private addStateLink(pState: IState, pNextState: IState, sSymbol: string): void {
            var isAddState: bool = pState.addNextState(sSymbol, pNextState);
            if (!isAddState) {
                this.error(ESyntaxErrorCode.k_GrammarAddStateLink);
                //this.error("AddlinkState: Grammar is not LALR(1)! Rewrite link!", "State", pState, "Link to", pNextState,
                //    "Symbol", sSymbol);
            }
        }

        private firstTerminal(sSymbol: string): BoolMap {
            if (this.isTerminal(sSymbol)) {
                return null;
            }

            if (isDef(this._pFirstTerminalsDMap[sSymbol])) {
                return this._pFirstTerminalsDMap[sSymbol];
            }

            var i: string, j: uint, k: string;
            var pRulesMap: IRuleMap = this._pRulesDMap[sSymbol];

            var pTempRes: BoolMap = <BoolMap>{};
            var pRes: BoolMap;

            var pRight: string[];
            var isFinish: bool;

            pRes = this._pFirstTerminalsDMap[sSymbol] = <BoolMap>{};

            if (this.hasEmptyRule(sSymbol)) {
                pRes[T_EMPTY] = true;
            }
            for (i in pRulesMap) {

                isFinish = false;
                pRight = pRulesMap[i].right;

                for (j = 0; j < pRight.length; j++) {

                    if (pRight[j] === sSymbol) {
                        if (pRes[T_EMPTY]) {
                            continue;
                        }
                        isFinish = true;
                        break;
                    }

                    pTempRes = this.firstTerminal(pRight[j]);

                    if (isNull(pTempRes)) {
                        pRes[pRight[j]] = true;
                    }
                    else {
                        for (k in pTempRes) {
                            pRes[k] = true;
                        }
                    }

                    if (!this.hasEmptyRule(pRight[j])) {
                        isFinish = true;
                        break;
                    }

                }

                if (!isFinish) {
                    pRes[T_EMPTY] = true;
                }

            }

            return pRes;
        }

        private followTerminal(sSymbol: string): BoolMap {
            if (isDef(this._pFollowTerminalsDMap[sSymbol])) {
                return this._pFollowTerminalsDMap[sSymbol];
            }

            var i: string, j: string, k: uint, l: uint, m: string;
            var pRulesDMap: IRuleDMap = this._pRulesDMap;

            var pTempRes: BoolMap;
            var pRes: BoolMap;

            var pRight: string[];
            var isFinish: bool;

            pRes = this._pFollowTerminalsDMap[sSymbol] = <BoolMap>{};

            for (i in pRulesDMap) {
                for (j in pRulesDMap[i]) {

                    pRight = pRulesDMap[i][j].right;

                    for (k = 0; k < pRight.length; k++) {

                        if (pRight[k] === sSymbol) {

                            if (k === pRight.length - 1) {
                                pTempRes = this.followTerminal(pRulesDMap[i][j].left);
                                for (m in pTempRes) {
                                    pRes[m] = true;
                                }
                            }
                            else {
                                isFinish = false;

                                for (l = k + 1; l < pRight.length; l++) {
                                    pTempRes = this.firstTerminal(pRight[l]);

                                    if (isNull(pTempRes)) {
                                        pRes[pRight[l]] = true;
                                        isFinish = true;
                                        break;
                                    }
                                    else {
                                        for (m in pTempRes) {
                                            pRes[m] = true;
                                        }
                                    }

                                    if (!pTempRes[T_EMPTY]) {
                                        isFinish = true;
                                        break;
                                    }
                                }

                                if (!isFinish) {
                                    pTempRes = this.followTerminal(pRulesDMap[i][j].left);
                                    for (m in pTempRes) {
                                        pRes[m] = true;
                                    }
                                }
                            }
                        }
                    }
                }
            }

            return pRes;
        }

        private firstTerminalForSet(pSet: string[], pExpected: BoolMap): BoolMap {
            var i: uint, j: string;

            var pTempRes: BoolMap;
            var pRes: BoolMap = <BoolMap>{};

            var isEmpty: bool;

            for (i = 0; i < pSet.length; i++) {
                pTempRes = this.firstTerminal(pSet[i]);

                if (isNull(pTempRes)) {
                    pRes[pSet[i]] = true;
                }

                isEmpty = false;

                for (j in pTempRes) {
                    if (j === T_EMPTY) {
                        isEmpty = true;
                        continue;
                    }
                    pRes[j] = true;
                }

                if (!isEmpty) {
                    return pRes;
                }
            }

            for (j in pExpected) {
                pRes[j] = true;
            }

            return pRes;
        }

        private generateRules(sGrammarSource: string): void {
            var pAllRuleList: string[] = sGrammarSource.split(/\r?\n/);
            var pTempRule: string[];
            var pRule: IRule;
            var isLexerBlock: bool = false;

            this._pRulesDMap = <IRuleDMap>{};
            this._pAdditionalFuncInfoList = <IAdditionalFuncInfo[]>[];
            this._pRuleCreationModeMap = <IntMap>{};

            var i: uint = 0, j: uint = 0;

            var isAllNodeMode: bool = bf.testAll(<int>this._eParseMode, <int>EParseMode.k_AllNode);
            var isNegateMode: bool = bf.testAll(<int>this._eParseMode, <int>EParseMode.k_Negate);
            var isAddMode: bool = bf.testAll(<int>this._eParseMode, <int>EParseMode.k_Add);

            var pSymbolsWithNodeMap: IntMap = this._pRuleCreationModeMap;


            for (i = 0; i < pAllRuleList.length; i++) {
                if (pAllRuleList[i] === "" || pAllRuleList[i] === "\r") {
                    continue;
                }

                pTempRule = pAllRuleList[i].split(/\s* \s*/);

                if (isLexerBlock) {
                    if ((pTempRule.length === 3 || (pTempRule.length === 4 && pTempRule[3] === "")) &&
                        ((pTempRule[2][0] === "\"" || pTempRule[2][0] === "'") && pTempRule[2].length > 3)) {

                            //TERMINALS
                        if (pTempRule[2][0] !== pTempRule[2][pTempRule[2].length - 1]) {
                            this.error(ESyntaxErrorCode.k_GrammarUnexpectedSymbol);
                            //this._error("Can`t generate rules from grammar! Unexpected symbol! Must be")
                        }

                        pTempRule[2] = pTempRule[2].slice(1, pTempRule[2].length - 1);

                        var ch = pTempRule[2][0];

                        if ((ch === "_") || (ch >= "a" && ch <= "z") || (ch >= "A" && ch <= "Z")) {
                            this._pLexer.addKeyword(pTempRule[2], pTempRule[0]);
                        }
                        else {
                            this._pLexer.addPunctuator(pTempRule[2], pTempRule[0]);
                        }
                    }

                    continue;
                }

                if (pTempRule[0] === LEXER_RULES) {
                    isLexerBlock = true;
                    continue;
                }

                //NON TERMNINAL RULES
                if (isDef(this._pRulesDMap[pTempRule[0]]) === false) {
                    this._pRulesDMap[pTempRule[0]] = <IRuleMap>{};
                }

                pRule = <IRule>{
                    left: pTempRule[0],
                    right: <string[]>[],
                    index: 0
                };
                this._pSymbolMap[pTempRule[0]] = true;

                if (isAllNodeMode) {
                    pSymbolsWithNodeMap[pTempRule[0]] = ENodeCreateMode.k_Default;
                }
                else if (isNegateMode && !isDef(pSymbolsWithNodeMap[pTempRule[0]])) {
                    pSymbolsWithNodeMap[pTempRule[0]] = ENodeCreateMode.k_Default;
                }
                else if (isAddMode && !isDef(pSymbolsWithNodeMap[pTempRule[0]])) {
                    pSymbolsWithNodeMap[pTempRule[0]] = ENodeCreateMode.k_Not;
                }

                for (j = 2; j < pTempRule.length; j++) {
                    if (pTempRule[j] === "") {
                        continue;
                    }
                    if (pTempRule[j] === FLAG_RULE_CREATE_NODE) {
                        if (isAddMode) {
                            pSymbolsWithNodeMap[pTempRule[0]] = ENodeCreateMode.k_Necessary;
                        }
                        continue;
                    }
                    if (pTempRule[j] === FLAG_RULE_NOT_CREATE_NODE) {
                        if (isNegateMode && !isAllNodeMode) {
                            pSymbolsWithNodeMap[pTempRule[0]] = ENodeCreateMode.k_Not;
                        }
                        continue;
                    }
                    if (pTempRule[j] === FLAG_RULE_FUNCTION) {
                        if ((!pTempRule[j + 1] || pTempRule[j + 1].length === 0)) {
                            this.error(ESyntaxErrorCode.k_GrammarBadAdditionalFunctionName);
                            //this._error("Can`t generate rule for grammar! Addititional functionhas has bad name");
                        }

                        var pFuncInfo: IAdditionalFuncInfo = <IAdditionalFuncInfo>{name: pTempRule[j + 1], 
                                                                                   position: pRule.right.length,
                                                                                   rule: pRule};
                        this._pAdditionalFuncInfoList.push(pFuncInfo);
                        j++;
                        continue;
                    }
                    if (pTempRule[j][0] === "'" || pTempRule[j][0] === "\"") {
                        if (pTempRule[j].length !== 3) {
                            this.error(ESyntaxErrorCode.k_GrammarBadKeyword);
                            //this._error("Can`t generate rules from grammar! Keywords must be rules");
                        }
                        if (pTempRule[j][0] !== pTempRule[j][2]) {
                            this.error(ESyntaxErrorCode.k_GrammarUnexpectedSymbol);
                            //this._error("Can`t generate rules from grammar! Unexpected symbol! Must be");
                        }
                        var sName: string = this._pLexer.addPunctuator(pTempRule[j][1]);
                        pRule.right.push(sName);
                        this._pSymbolMap[sName] = true;
                    }
                    else {
                        pRule.right.push(pTempRule[j]);
                        this._pSymbolMap[pTempRule[j]] = true;
                    }
                }

                pRule.index = this._nRules;
                this._pRulesDMap[pTempRule[0]][pRule.index] = pRule;
                this._nRules += 1;

            }
        }

        private generateFunctionByStateMap():void {
            if(isNull(this._pAdditionalFunctionsMap)){
                return;
            }

            var pStateList: IState[] = this._pStateList; 
            var pFuncInfoList: IAdditionalFuncInfo[] = this._pAdditionalFuncInfoList;
            var pFuncInfo: IAdditionalFuncInfo;
            var pRule: IRule;
            var iPos: uint = 0;
            var pFunc: IRuleFunction;
            var sGrammarSymbol: string; 

            var i:uint = 0, j: uint = 0;

            var pFuncByStateDMap:IRuleFunctionDMap = <IRuleFunctionDMap>{}; 
            pFuncByStateDMap = this._pAdidtionalFunctByStateDMap = <IRuleFunctionDMap>{};

            for(i = 0; i < pFuncInfoList.length; i++){
                pFuncInfo = pFuncInfoList[i];
                
                pFunc = this._pAdditionalFunctionsMap[pFuncInfo.name];
                if(!isDef(pFunc)){
                    continue;
                }

                pRule = pFuncInfo.rule;
                iPos = pFuncInfo.position;
                sGrammarSymbol = pRule.right[iPos - 1];                

                for(j = 0; j < pStateList.length; j++){
                    if(pStateList[j].hasRule(pRule, iPos)){
                        if(!isDef(pFuncByStateDMap[pStateList[j].index])){
                            pFuncByStateDMap[pStateList[j].index] = <IRuleFunctionMap>{};    
                        }

                        pFuncByStateDMap[pStateList[j].index][sGrammarSymbol] = pFunc;    
                    }
                }
            }
        }

        private generateFirstState(eType: EParserType): void {
            if (eType === EParserType.k_LR0) {
                this.generateFirstState_LR0();
            }
            else {
                this.generateFirstState_LR();
            }
        }

        private generateFirstState_LR0(): void {
            var pState: IState = new State();
            var pItem: IItem = new Item(this._pRulesDMap[START_SYMBOL][0], 0);

            this.pushBaseItem(pItem);
            pState.push(pItem);

            this.closure_LR0(pState);
            this.pushState(pState);
        }

        private generateFirstState_LR(): void {
            var pState: IState = new State();
            var pExpected: BoolMap = <BoolMap>{};
            pExpected[END_SYMBOL] = true;

            pState.push(new Item(this._pRulesDMap[START_SYMBOL][0], 0, pExpected));

            this.closure_LR(pState);
            this.pushState(pState);
        }

        private closure(pState: IState, eType: EParserType): IState {
            if (eType === EParserType.k_LR0) {
                return this.closure_LR0(pState);
            }
            else {
                this.closure_LR(pState);
            }
        }

        private closure_LR0(pState: IState): IState {
            var pItemList: IItem[] = pState.items;
            var i: uint = 0, j: string;
            var sSymbol: string;

            for (i = 0; i < pItemList.length; i++) {
                sSymbol = pItemList[i].mark();

                if (sSymbol !== END_POSITION && (!this.isTerminal(sSymbol))) {
                    for (j in this._pRulesDMap[sSymbol]) {
                        pState.tryPush_LR0(this._pRulesDMap[sSymbol][j], 0);
                    }
                }

            }
            return pState;
        }

        private closure_LR(pState: IState): IState {
            var pItemList: IItem[] = <IItem[]>(pState.items);
            var i: uint = 0, j: string, k: string;
            var sSymbol: string;
            var pSymbols: BoolMap;
            var pTempSet: string[];
            var isNewExpected: bool = false;

            while (true) {
                if (i === pItemList.length) {
                    if (!isNewExpected) {
                        break;
                    }
                    i = 0;
                    isNewExpected = false;
                }
                sSymbol = pItemList[i].mark();

                if (sSymbol !== END_POSITION && (!this.isTerminal(sSymbol))) {
                    pTempSet = pItemList[i].rule.right.slice(pItemList[i].position + 1);
                    pSymbols = this.firstTerminalForSet(pTempSet, pItemList[i].expectedSymbols);

                    for (j in this._pRulesDMap[sSymbol]) {
                        for (k in pSymbols) {
                            if (pState.tryPush_LR(this._pRulesDMap[sSymbol][j], 0, k)) {
                                isNewExpected = true;
                            }
                        }
                    }
                }

                i++;
            }

            return pState;
        }

        private nexeState(pState: IState, sSymbol: string, eType: EParserType): IState {
            if (eType === EParserType.k_LR0) {
                return this.nextState_LR0(pState, sSymbol);
            }
            else {
                return this.nextState_LR(pState, sSymbol);
            }
        }

        private nextState_LR0(pState: IState, sSymbol: string): IState {
            var pItemList: IItem[] = pState.items;
            var i: uint = 0;
            var pNewState: IState = new State();

            for (i = 0; i < pItemList.length; i++) {
                if (sSymbol === pItemList[i].mark()) {
                    pNewState.push(new Item(pItemList[i].rule, pItemList[i].position + 1));
                }
            }

            return pNewState;
        }

        private nextState_LR(pState: IState, sSymbol: string): IState {
            var pItemList: IItem[] = <IItem[]>pState.items;
            var i: uint = 0;
            var pNewState: IState = new State();

            for (i = 0; i < pItemList.length; i++) {
                if (sSymbol === pItemList[i].mark()) {
                    pNewState.push(new Item(pItemList[i].rule, pItemList[i].position + 1, pItemList[i].expectedSymbols));
                }
            }

            return pNewState;
        }

        private deleteNotBaseItems(): void {
            var i: uint = 0;
            for (i = 0; i < this._pStateList.length; i++) {
                this._pStateList[i].deleteNotBase();
            }
        }

        private closureForItem(pRule: IRule, iPos: uint): IState {
            var sIndex: string = "";
            sIndex += pRule.index + "_" + iPos;

            var pState: IState = this._pStatesTempMap[sIndex];
            if (isDef(pState)) {
                return pState;
            }
            else {
                var pExpected: BoolMap = <BoolMap>{};
                pExpected[UNUSED_SYMBOL] = true;

                pState = new State();
                pState.push(new Item(pRule, iPos, pExpected));

                this.closure_LR(pState);
                this._pStatesTempMap[sIndex] = pState;

                return pState;
            }
        }

        private addLinkExpected(pItem: IItem, pItemX: IItem): void {
            var pTable: BoolDMap = this._pExpectedExtensionDMap;
            var iIndex: uint = pItem.index;

            if (!isDef(pTable[iIndex])) {
                pTable[iIndex] = <BoolMap>{};
            }

            pTable[iIndex][pItemX.index] = true;
        }

        private determineExpected(pTestState: IState, sSymbol: string): void {
            var pStateX = pTestState.getNextStateBySymbol(sSymbol);

            if (isNull(pStateX)) {
                return;
            }

            var pItemListX: IItem[] = <IItem[]>pStateX.items;
            var pItemList: IItem[] = <IItem[]>pTestState.items;
            var pState: IState;
            var pItem: IItem;
                var i: uint, j: uint, k: string;

            var nBaseItemTest = pTestState.numBaseItems;
            var nBaseItemX = pStateX.numBaseItems;

            for (i = 0; i < nBaseItemTest; i++) {
                pState = this.closureForItem(pItemList[i].rule, pItemList[i].position);

                for (j = 0; j < nBaseItemX; j++) {
                    pItem = <IItem>pState.hasChildItem(pItemListX[j]);

                    if (pItem) {
                        var pExpected: BoolMap = pItem.expectedSymbols;

                        for (k in pExpected) {
                            if (k === UNUSED_SYMBOL) {
                                this.addLinkExpected(pItemList[i], pItemListX[j]);
                            }
                            else {
                                pItemListX[j].addExpected(k);
                            }
                        }
                    }
                }
            }
        }

        private generateLinksExpected(): void {
            var i: uint, j: string;
            var pStates: IState[] = this._pStateList;

            for (i = 0; i < pStates.length; i++) {
                for (j in this._pSymbolMap) {
                    this.determineExpected(pStates[i], j);
                }
            }    
        }

        private expandExpected(): void {
            var pItemList: IItem[] = <IItem[]>this._pBaseItemList;
            var pTable: BoolDMap = this._pExpectedExtensionDMap;
            var i: uint = 0, j: string;
            var sSymbol: string;
            var isNewExpected: bool = false;

            pItemList[0].addExpected(END_SYMBOL);
            pItemList[0].isNewExpected = true;

            while (true) {

                if (i === pItemList.length) {
                    if (!isNewExpected) {
                        break;
                    }
                    isNewExpected = false;
                    i = 0;
                }

                if (pItemList[i].isNewExpected) {
                    var pExpected: BoolMap = pItemList[i].expectedSymbols;

                    for (sSymbol in pExpected) {
                        for (j in pTable[i]) {
                            if (pItemList[<number><any>j].addExpected(sSymbol)) {
                                isNewExpected = true;
                            }
                        }
                    }
                }

                pItemList[i].isNewExpected = false;
                i++;
            }
        }

        private generateStates(eType: EParserType): void {
            if (eType === EParserType.k_LR0) {
                this.generateStates_LR0();
            }
            else if (eType === EParserType.k_LR1) {
                this.generateStates_LR();
            }
            else if (eType === EParserType.k_LALR) {
                this.generateStates_LALR();
            }
        }

        private generateStates_LR0(): void {
            this.generateFirstState_LR0();

            var i: uint;
            var pStateList: IState[] = this._pStateList;
            var sSymbol: string;
            var pState: IState;

            for (i = 0; i < pStateList.length; i++) {
                for (sSymbol in this._pSymbolMap) {
                    pState = this.nextState_LR0(pStateList[i], sSymbol);

                    if (!pState.isEmpty()) {
                        pState = this.tryAddState(pState, EParserType.k_LR0);
                        this.addStateLink(pStateList[i], pState, sSymbol);
                    }
                }
            }
        }

        private generateStates_LR(): void {
            this._pFirstTerminalsDMap = <BoolDMap>{};
            this.generateFirstState_LR();

            var i: uint;
            var pStateList: IState[] = this._pStateList;
            var sSymbol: string;
            var pState: IState;

            for (i = 0; i < pStateList.length; i++) {
                for (sSymbol in this._pSymbolMap) {
                    pState = this.nextState_LR(pStateList[i], sSymbol);

                    if (!pState.isEmpty()) {
                        pState = this.tryAddState(pState, EParserType.k_LR1);
                        this.addStateLink(pStateList[i], pState, sSymbol);
                    }
                }
            }
        }

        private generateStates_LALR(): void {

            this._pStatesTempMap = <IStateMap>{};
            this._pBaseItemList = <IItem[]>[];
            this._pExpectedExtensionDMap = <BoolDMap>{};
            this._pFirstTerminalsDMap = <BoolDMap>{};

            this.generateStates_LR0();
            this.deleteNotBaseItems();
            this.generateLinksExpected();
            this.expandExpected();

            var i: uint = 0;
            var pStateList: IState[] = this._pStateList;

            for (i = 0; i < pStateList.length; i++) {
                this.closure_LR(pStateList[i]);
            }
        }

        private calcBaseItem(): uint {
            var num: uint = 0;
            var i: uint = 0;

            for (i = 0; i < this._pStateList.length; i++) {
                num += this._pStateList[i].numBaseItems;
            }

            return num;
        }

        private printStates(isBase: bool): string {
            var sMsg: string = "";
            var i: uint = 0;

            for (i = 0; i < this._pStateList.length; i++) {
                sMsg += this.printState(this._pStateList[i], isBase);
                sMsg += " ";
            }

            return sMsg;
        }

        private printState(pState: IState, isBase: bool): string {
            var sMsg: string = pState.toString(isBase);
            return sMsg;
        }

        private printExpectedTable(): string {
            var i: string, j: string;
            var sMsg: string = "";

            for (i in this._pExpectedExtensionDMap) {
                sMsg += "State " + this._pBaseItemList[<number><any>i].state.index + ":   ";
                sMsg += this._pBaseItemList[<number><any>i].toString() + "  |----->\n";

                for (j in this._pExpectedExtensionDMap[i]) {
                    sMsg += "\t\t\t\t\t" + "State " + this._pBaseItemList[<number><any>j].state.index + ":   ";
                    sMsg += this._pBaseItemList[<number><any>j].toString() + "\n";
                }

                sMsg += "\n";
            }

            return sMsg;
        }

        private addReducing(pState: IState): void {
            var i: uint, j: string;
            var pItemList: IItem[] = pState.items;

            for (i = 0; i < pItemList.length; i++) {
                if (pItemList[i].mark() === END_POSITION) {

                    if (pItemList[i].rule.left === START_SYMBOL) {
                        this.pushInSyntaxTable(pState.index, END_SYMBOL, this._pSuccessOperation);
                    }
                    else {
                        var pExpected = pItemList[i].expectedSymbols;

                        for (j in pExpected) {
                            this.pushInSyntaxTable(pState.index, j, this._pReduceOperationsMap[pItemList[i].rule.index]);
                        }
                    }
                }
            }
        }

        private addShift(pState: IState) {
            var i: string;
            var pStateMap: IStateMap = pState.nextStates;

            for (i in pStateMap) {
                this.pushInSyntaxTable(pState.index, i, this._pShiftOperationsMap[pStateMap[i].index]);
            }
        }

        private buildSyntaxTable(): void {
            this._pStateList = <IState[]>[];

            var pStateList: IState[] = this._pStateList;
            var pState: IState;

            //Generate states
            this.generateStates(this._eType);

            //Init necessary properties
            this._pSyntaxTable = <IOperationDMap>{};
            this._pReduceOperationsMap = <IOperationMap>{};
            this._pShiftOperationsMap = <IOperationMap>{};

            this._pSuccessOperation = <IOperation>{ type: EOperationType.k_Success };

            var i: uint = 0, j: string, k: string;

            for (i = 0; i < pStateList.length; i++) {
                this._pShiftOperationsMap[pStateList[i].index] = <IOperation>{
                    type: EOperationType.k_Shift,
                    index: pStateList[i].index
                };
            }

            for (j in this._pRulesDMap) {
                for (k in this._pRulesDMap[j]) {
                    this._pReduceOperationsMap[k] = <IOperation>{
                        type: EOperationType.k_Reduce,
                        rule: this._pRulesDMap[j][k]
                    };
                }
            }

            //Build syntax table
            for (var i = 0; i < pStateList.length; i++) {
                pState = pStateList[i];
                this.addReducing(pState);
                this.addShift(pState);
            }
        }

        private readToken(): IToken {
            return this._pLexer.getNextToken();
        }

        private operationAdditionalAction(iStateIndex:uint, sGrammarSymbol: string): EOperationType {
            var pFuncDMap:IRuleFunctionDMap = this._pAdidtionalFunctByStateDMap;
            
            if(isDef(pFuncDMap[iStateIndex]) && 
               isDef(pFuncDMap[iStateIndex][sGrammarSymbol])){

                return pFuncDMap[iStateIndex][sGrammarSymbol].call(this);
            }

            return EOperationType.k_Ok;
        }

        private defaultInit(): void {
            this._iIndex = 0;
            this._pStack = [0];
            this._pSyntaxTree = new ParseTree();
            this._pTypeIdMap = <BoolMap>{};
        }

        private resumeParse(): EParserCode {
            try {
                var pTree:IParseTree = this._pSyntaxTree;
                var pStack:uint[] = this._pStack;
                var pSyntaxTable:IOperationDMap = this._pSyntaxTable;

                var isStop:bool = false;
                var isError:bool = false;
                var isPause:bool = false;
                var pToken:IToken = isNull(this._pToken) ? this.readToken() : this._pToken;

                var pOperation:IOperation;
                var iRuleLength:uint;

                while (!isStop) {
                    pOperation = pSyntaxTable[pStack[pStack.length - 1]][pToken.name];
                    if (isDef(pOperation)) {
                        switch (pOperation.type) {
                            case EOperationType.k_Success:
                                isStop = true;
                                break;

                            case EOperationType.k_Shift:

                                iStateIndex = pOperation.index;
                                pStack.push(iStateIndex);
                                pTree.addNode(<IParseNode>pToken);

                                eAdditionalOperationCode = this.operationAdditionalAction(iStateIndex, pToken.name);

                                if(eAdditionalOperationCode === EOperationType.k_Error){
                                    isError = true;
                                    isStop = true;    
                                }
                                else if(eAdditionalOperationCode === EOperationType.k_Pause){
                                    this._pToken = null;
                                    isStop = true;
                                    isPause = true;
                                }
                                else if(eAdditionalOperationCode === EOperationType.k_Ok){
                                    pToken = this.readToken();
                                }

                                break;
                            
                            case EOperationType.k_Reduce:

                                iRuleLength = pOperation.rule.right.length;
                                pStack.length -= iRuleLength;
                                iStateIndex = pSyntaxTable[pStack[pStack.length - 1]][pOperation.rule.left].index;
                                pStack.push(iStateIndex);
                                pTree.reduceByRule(pOperation.rule, this._pRuleCreationModeMap[pOperation.rule.left]);

                                eAdditionalOperationCode = this.operationAdditionalAction(iStateIndex, pOperation.rule.left);

                                if(eAdditionalOperationCode === EOperationType.k_Error){
                                    isError = true;
                                    isStop = true;    
                                }
                                else if(eAdditionalOperationCode === EOperationType.k_Pause){
                                    this._pToken = pToken;
                                    isStop = true;
                                    isPause = true;
                                }

                                break;
                        }
                    }
                    else {
                        isError = true;
                        isStop = true;
                    }
                }
                if (isPause) {
                    return EParserCode.k_Pause;
                }

                if (!isError) {
                    pTree.setRoot();
                    if (isDef(this._fnFinishCallback)) {
                        this._fnFinishCallback.call(this._pCaller, EParserCode.k_Ok);
                    }
                    return EParserCode.k_Ok;
                }
                else {
                    this.error(ESyntaxErrorCode.k_SyntaxError);
                    //console.log("Error!!!", pToken);
                    if (isDef(this._fnFinishCallback)) {
                        this._fnFinishCallback.call(this._pCaller, EParserCode.k_Error);
                    }
                    return EParserCode.k_Error;
                }

            }
            catch (e) {
                 return EParserCode.k_Error;
            }
        }

    }

}

#endif
