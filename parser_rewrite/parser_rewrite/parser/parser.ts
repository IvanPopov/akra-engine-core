module akra {

    var END_POSITION: string = "END";
    var T_EMPTY: string = "EMPTY";
    var UNKNOWN_TOKEN: string = "UNNOWN";
    var END_SYMBOL: string = "$";

    // Need to be added in akra module
    //-------
    interface StringEnum {
        [s: string]: string;
        [s: number]: string;
    }

    interface StringMap {
        [s: string]: string;
    }

    interface BoolMap {
        [s: string]: bool;
    }

    //function error(...args: any[]): void {
    //    //TODO: add it to akra
    //}

    //function prepareErrorMessage(sMessage: string): string {
    //    //TODO: generate error from sMessage and ErrorContainer
    //    return "error";
    //}
    //END TEMP



    enum EOperationType {
        k_Error = 100,
        k_Shift,
        k_Reduce,
        k_Success,
        k_Pause
    }

    enum EItemType {
        k_LR0 = 1,
        k_LR
    }

    export enum ENodeCreateMode {
        k_Default,
        k_Necessary,
        k_Not
    }

    enum EParseCode {
        k_Pause,
        k_Ok,
        k_Error
    }

    enum EParserType {
        k_LR0,
        k_LR1,
        k_LALR
    }

    enum ESyntaxErrorCode {
        k_Parser = 100,
        k_Lexer = 200,
        k_UnknownToken
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

    //    var SyntaxErrorMessages: StringEnum = <StringEnum>{};
    //    SyntaxErrorMessages[ESyntaxErrorCode.k_UnknownToken] = "Uknown token: \'{Syntax.Lexer.VALUE}\'. In line: {Syntax.Lexer.LINE}. In column {Syntax.Lexer.START_COLUMN}.";

    interface IRule {
        left: string;
        right: string[];
        index: uint;
    }

    interface IOperation {
        type: EOperationType;
        rule: IRule;
        index: uint;
    }

    interface IItem {
        isEqual(pItem: IItem): bool;
        isParentItem(pItem: IItem): bool;
        isChildItem(pItem: IItem): bool;

        mark(): string;
        end(): string;
        nextMarked(): string;

        toString(): string;

        rule: IRule;
        position: uint;
        state: IState;
    }

    interface IState {

        hasItem(pItem: IItem): IItem;
        hasParentItem(pItem: IItem): IItem;
        hasChildItem(pItem: IItem): IItem;

        isEmpty(): bool;
        isEqual(pState: IState, eType: EItemType): bool;

        push(pItem: IItem): void;

        tryPush_LR0(pRule: IRule, iPos: uint): bool;
        tryPush_LR(pRule: IRule, iPos: uint, sExpectedSymbol: string): bool;

        deleteNotBase(): void;

        items: IItem[];
        baseItems: uint;
    }

    interface IToken {
        name: string;
        value: string;
        start: uint;
        end: uint;
        line: uint;
    }

    interface IStatesMap {
        [s: string]: IState;
    }

    interface ILexer {
        addPunctuator(sValue: string, sName?: string): string;
        addKeyword(sValue: string, sName: string): string;

        init(sSource: string): void;

        getNextToken(): IToken;
    }

    export interface IParseFlags {
        add: bool;
        negate: bool;
        all: bool;
        optimize: bool;
    }

    export interface IParser {
        isTypeId(sValue: string): bool;
        returnCode(pNode: IParseNode): string;
        init(sGrammar: string, eType: EParserType, pFlags: IParseFlags): bool;
        parse(sSource: string, isSync: bool): bool;
        pause(): EParseCode;
        resume(): bool;
        error(): ESyntaxErrorCode;
    }

    export interface IParseNode {
        children: IParseNode[];
        parent: IParseNode;
        name: string;
        value: string;
    }

    export interface IParseTree {
        setRoot(): void;

        addNode(pNode: IParseNode): void;
        reduceByRule(pRule: IRule, eCreate: ENodeCreateMode, isOptimize: bool);

        toString(): string;

        clone(): IParseTree;

        root: IParseNode;
    }





    class Item implements IItem {
        private _pRule: IRule;
        private _iPos: uint;
        private _iIndex: uint;
        private _pState: IState;

        /** @inline */
        get rule(): IRule {
            return this._pRule;
        }
        /** @inline */
        set rule(pRule: IRule) {
            this._pRule = pRule;
        }
        /** @inline */
        get position(): uint {
            return this._iPos;
        }
        /** @inline */
        set position(iPos: uint) {
            this._iPos = iPos;
        }
        /** @inline */
        get state(): IState {
            return this._pState;
        }
        /** @inline */
        set state(pState: IState) {
            this._pState = pState;
        }

        constructor (pRule: IRule, iPos: uint) {
            this._pRule = pRule;
            this._iPos = iPos;
            this._iIndex = 0;
            this._pState = null;
        }

        isEqual(pItem: IItem): bool {
            return (this._pRule === pItem.rule && this._iPos === pItem.position);
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

        end(): string {
            var pRight = this._pRule.right;
            return pRight[pRight.length - 1] || T_EMPTY;
        }

        nextMarked(): string {
            return this._pRule.right[this._iPos + 1] || END_POSITION;
        }

        toString(): string {
            var sMsg: string = this._pRule.left + " -> ";
            var pRight: string[] = this._pRule.right;

            for (var k: uint = 0; k < pRight.length; k++) {
                if (k === this._iPos) {
                    sMsg += ". ";
                }
                sMsg += pRight[k] + " ";
            }
            if (this._iPos === pRight.length) {
                sMsg += ". ";
            }
            sMsg = sMsg.slice(0, sMsg.length - 1);
            return sMsg;
        }
    }

    class ItemLR extends Item {
        private _pRule: IRule;
        private _iPos: uint;
        private _iIndex: uint;
        private _pState: IState;

        private _pExpected: BoolMap;
        private _isNewExpected: bool;
        private _iLength: uint;

        /** @inline */
        get expectedSymbols(): BoolMap {
            return this._pExpected;
        }
        /** @inline */
        get length(): uint {
            return this._iLength;
        }

        constructor (pRule: IRule, iPos: uint, pExpected: BoolMap);
        constructor (pRule: IRule, iPos: uint) {
            super(pRule, iPos);

            this._isNewExpected = true;
            this._iLength = 0;
            this._pExpected = {};

            if (arguments.length === 3) {
                var i: string;
                for (i in <BoolMap>arguments[2]) {
                    this.addExpected(i);
                }
            }
        }

        isEqual(pItem: IItem, eType?: EItemType = EItemType.k_LR0): bool {
            if (eType === EItemType.k_LR0) {
                return (this._pRule === pItem.rule && this._iPos === pItem.position);
            }
            else if (eType === EItemType.k_LR) {
                if (!(this._pRule === pItem.rule && this._iPos === pItem.position && this._iLength === (<ItemLR>pItem).length)) {
                    return false;
                }
                var i: string;
                for (i in this._pExpected) {
                    if (!(<ItemLR>pItem).isExpected(i)) {
                        return false;
                    }
                }
                return true;
            }
        }

        isExpected(sSymbol: string): bool {
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
            sExpected = ", ";
            for (var l in this._pExpected) {
                sExpected += l + "/";
            }
            if (sExpected !== ", ") {
                sMsg += sExpected;
            }

            sMsg = sMsg.slice(0, sMsg.length - 1);
            return sMsg;
        }
    }

    class State implements IState {
        private _pItems: IItem[];
        private _pNextStates: IStatesMap;
        private _iIndex: uint;
        private _nBaseItems: uint;

        /** @inline */
        get items(): IItem[] {
            return this._pItems;
        }
        /** @inline */
        get baseItems(): uint {
            return this._nBaseItems;
        }

        constructor () {
            this._pItems = <IItem[]>[];
            this._pNextStates = <IStatesMap>{};
            this._iIndex = 0;
            this._nBaseItems = 0;
        }

        hasItem(pItem: IItem): IItem {
            var i;
            var pItems: IItem[] = this._pItems;
            for (i = 0; i < pItems.length; i++) {
                if (pItems[i].isEqual(pItem)) {
                    return pItems[i];
                }
            }
            return null;
        }

        hasParentItem(pItem: IItem): IItem {
            var i;
            var pItems = this._pItems;
            for (i = 0; i < pItems.length; i++) {
                if (pItems[i].isParentItem(pItem)) {
                    return pItems[i];
                }
            }
            return null;
        }

        hasChildItem(pItem: IItem): IItem {
            var i;
            var pItems = this._pItems;
            for (i = 0; i < pItems.length; i++) {
                if (pItems[i].isChildItem(pItem)) {
                    return pItems[i];
                }
            }
            return null;
        }

        isEmpty(): bool {
            return !(this._pItems.length);
        }

        isEqual(pState: IState, eType: EItemType): bool {

            var pItemsA: IItem[] = this._pItems;
            var pItemsB: IItem[] = pState.items;

            if (this._nBaseItems !== pState.baseItems) {
                return false;
            }
            var nItems = this._nBaseItems;
            var i, j;
            var isEqual;
            for (i = 0; i < nItems; i++) {
                isEqual = false;
                for (j = 0; j < nItems; j++) {
                    if ((<ItemLR>pItemsA[i]).isEqual(pItemsB[j], eType)) {
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
            if (this._pItems.length === 0 || pItem.position > 0) {
                this._nBaseItems += 1;
            }
            pItem.state = this;
            this._pItems.push(pItem);
        }

        tryPush_LR0(pRule: IRule, iPos: uint): bool {
            var i: uint;
            var pItems: IItem[] = this._pItems;
            for (i = 0; i < pItems.length; i++) {
                if (pItems[i].rule === pRule && pItems[i].position === iPos) {
                    return false;
                }
            }
            var pItem = new Item(pRule, iPos);
            this.push(pItem);
            return true;
        }

        tryPush_LR(pRule: IRule, iPos: uint, sExpectedSymbol: string): bool {
            var i: uint;
            var pItems: ItemLR[] = <ItemLR[]>(this._pItems);

            for (i = 0; i < pItems.length; i++) {
                if (pItems[i].rule === pRule && pItems[i].position === iPos) {
                    return pItems[i].addExpected(sExpectedSymbol);
                }
            }

            var pExpected: BoolMap = {};
            pExpected[sExpectedSymbol] = true;

            var pItem: ItemLR = new ItemLR(pRule, iPos, pExpected);
            this.push(pItem);
            return true;
        }

        deleteNotBase(): void {
            this._pItems.length = this._nBaseItems;
        }
    }

    class Operation implements IOperation {
        private _eType: EOperationType;
        private _pRule: IRule;
        private _iIndex: uint;

        /** @inline */
        get type(): EOperationType {
            return this._eType;
        }
        /** @inline */
        set type(eType: EOperationType) {
            this._eType = eType;
        }
        /** @inline */
        get rule(): IRule {
            return this._pRule;
        }
        /** @inline */
        set rule(pRule: IRule) {
            this._pRule = pRule;
        }
        /** @inline */
        get index(): uint {
            return this._iIndex;
        }
        /** @inline */
        set index(iIndex: uint) {
            this._iIndex = iIndex;
        }

        constructor (eType: EOperationType, iIndex: uint);
        constructor (eType: EOperationType, pRule: IRule);
        constructor () {
            if (arguments.length === 0) {
                this._eType = EOperationType.k_Error;
            }
            else if (arguments.length === 2 && arguments[0] === EOperationType.k_Shift) {
                this._eType = EOperationType.k_Shift;
                this._iIndex = <uint>arguments[1];
            }
            else if (arguments.length === 2 && arguments[0] === EOperationType.k_Reduce) {
                this._eType = EOperationType.k_Reduce;
                this._pRule = <IRule>arguments[1];
            }
        }
    }

    class Rule implements IRule {
        private _sLeft: string;
        private _pRight: string[];
        private _iIndex: uint;

        /** @inline */
        get left(): string {
            return this._sLeft;
        }
        /** @inline */
        set left(sLeft: string) {
            this._sLeft = sLeft;
        }
        /** @inline */
        get right(): string[] {
            return this._pRight;
        }
        /** @inline */
        set right(pRight: string[]) {
            this._pRight = pRight;
        }
        /** @inline */
        get index(): uint {
            return this._iIndex;
        }
        /** @inline */
        set index(iIndex: uint) {
            this._iIndex = iIndex;
        }

        constructor () {
            this._sLeft = "";
            this._pRight = <string[]>[];
            this._iIndex = 0;
        }
    }


    export class ParseTree implements IParseTree {
        private _pRoot: IParseNode;
        private _pNodes: IParseNode[];
        private _pNodesCountStack: uint[];

        /** @inline */
        get root(): IParseNode {
            return this._pRoot;
        }
        /** @inline */
        set root(pRoot: IParseNode) {
            this._pRoot = pRoot;
        }

        constructor () {
            this._pRoot = null;
            this._pNodes = <IParseNode[]>[];
            this._pNodesCountStack = <uint[]>[];
        }

        setRoot(): void {
            this._pRoot = this._pNodes.pop();
        }

        addNode(pNode: IParseNode): void {
            this._pNodes.push(pNode);
            this._pNodesCountStack.push(1);
        }

        reduceByRule(pRule: IRule, eCreate: ENodeCreateMode = ENodeCreateMode.k_Default, isOptimize: bool = false): void {
            var iReduceCount: uint = 0;
            var pNodesCountStack: uint[] = this._pNodesCountStack;
            var pNode: IParseNode;
            var iRuleLength: uint = pRule.right.length;
            var pNodes: IParseNode[] = this._pNodes;
            var nOptimize: uint = isOptimize ? 1 : 0;

            while (iRuleLength) {
                iReduceCount += pNodesCountStack.pop();
                iRuleLength--;
            }

            if ((eCreate === ENodeCreateMode.k_Default && iReduceCount > nOptimize) || (eCreate === ENodeCreateMode.k_Necessary)) {
                pNode = { name: pRule.left, children: null, parent: null, value: "" };

                while (iReduceCount) {
                    this._addLink(pNode, pNodes.pop());
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
                return this._toStringNode(this._pRoot);
            }
            else {
                return "";
            }
        }

        clone(): IParseTree {
            var pTree = new ParseTree();
            pTree.root = this._cloneNode(this._pRoot);
            return pTree;
        }

        private _addLink(pParent: IParseNode, pNode: IParseNode): void {
            if (!pParent.children) {
                pParent.children = <IParseNode[]>[];
            }
            pParent.children.push(pParent);
            pNode.parent = pParent;
        }

        private _cloneNode(pNode: IParseNode): IParseNode {
            var pNewNode: IParseNode;
            pNewNode = <IParseNode>{
                name: pNode.name,
                value: pNode.value,
                children: null,
                parent: null
            };

            var pChildren: IParseNode[] = pNode.children;
            for (var i = 0; pChildren && i < pChildren.length; i++) {
                this._addLink(pNewNode, this._cloneNode(pChildren[i]));
            }

            return pNewNode;
        }

        private _toStringNode(pNode: IParseNode, sPadding: string = ""): string {
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
                        sRes += this._toStringNode(pChildren[i], sPadding);
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
            this._pPunctuatorsMap = {};
            this._pKeywordsMap = {};
            this._pPunctuatorsFirstSymbols = {};
        }

        addPunctuator(sValue: string, sName?: string): string {
            if (typeof (sName) === undefined && sValue.length === 1) {
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
            var ch: string = this._currentChar();
            if (!ch) {
                return <IToken>{
                    name: END_SYMBOL,
                    value: END_SYMBOL,
                    start: this._iColumnNumber,
                    end: this._iColumnNumber,
                    line: this._iLineNumber
                };
            }
            var eType: ETokenType = this._identityTokenType();
            var pToken: IToken;
            switch (eType) {
                case ETokenType.k_NumericLiteral:
                    pToken = this._scanNumber();
                    break;
                case ETokenType.k_CommentLiteral:
                    this._scanComment();
                    pToken = this.getNextToken();
                    break;
                case ETokenType.k_StringLiteral:
                    pToken = this._scanString();
                    break;
                case ETokenType.k_PunctuatorLiteral:
                    pToken = this._scanPunctuator();
                    break;
                case ETokenType.k_IdentifierLiteral:
                    pToken = this._scanIdentifier();
                    break;
                case ETokenType.k_WhitespaceLiteral:
                    this._scanWhiteSpace();
                    pToken = this.getNextToken();
                    break;
                default:
                    this._error(ESyntaxErrorCode.k_UnknownToken,
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

        private _error(eCode: ESyntaxErrorCode, pToken: IToken): void {
            //ErrorContainer.Syntax.Lexer.
        }

        private _identityTokenType(): ETokenType {
            if (this._isIdentifierStart()) {
                return ETokenType.k_IdentifierLiteral;
            }
            if (this._isWhiteSpaceStart()) {
                return ETokenType.k_WhitespaceLiteral;
            }
            if (this._isStringStart()) {
                return ETokenType.k_StringLiteral;
            }
            if (this._isCommentStart()) {
                return ETokenType.k_CommentLiteral;
            }
            if (this._isNumberStart()) {
                return ETokenType.k_NumericLiteral;
            }
            if (this._isPunctuatorStart()) {
                return ETokenType.k_PunctuatorLiteral;
            }
            return ETokenType.k_Unknown;
        }

        private _isNumberStart(): bool {
            var ch: string = this._currentChar();

            if ((ch >= '0') && (ch <= '9')) {
                return true;
            }

            var ch1: string = this._nextChar();
            if (ch === "." && (ch1 >= '0') && (ch1 <= '9')) {
                return true;
            }

            return false;
        }

        private _isCommentStart(): bool {
            var ch: string = this._currentChar();
            var ch1: string = this._nextChar();

            if (ch === "/" && (ch1 === "/" || ch1 === "*")) {
                return true;
            }

            return false;
        }

        private _isStringStart(): bool {
            var ch: string = this._currentChar();
            if (ch === "\"" || ch === "'") {
                return true;
            }
            return false;
        }

        private _isPunctuatorStart(): bool {
            var ch: string = this._currentChar();
            if (this._pPunctuatorsFirstSymbols[ch]) {
                return true;
            }
            return false;
        }

        private _isWhiteSpaceStart(): bool {
            var ch: string = this._currentChar();
            if (ch === ' ' || ch === '\n' || ch === '\r' || ch === '\t') {
                return true;
            }
            return false;
        }

        private _isIdentifierStart(): bool {
            var ch: string = this._currentChar();
            if ((ch === '_') || (ch >= 'a' && ch <= 'z') || (ch >= 'A' && ch <= 'Z')) {
                return true;
            }
            return false;
        }

        private _isLineTerminator(sSymbol: string): bool {
            return (sSymbol === '\n' || sSymbol === '\r' || sSymbol === '\u2028' || sSymbol === '\u2029');
        }

        private _isWhiteSpace(sSymbol: string): bool {
            return (sSymbol === ' ') || (sSymbol === '\t');
        }

        /** @inline */
        private _isKeyword(sValue: string): bool {
            return !!(this._pKeywordsMap[sValue]);
        }

        /** @inline */
        private _isPunctuator(sValue: string): bool {
            return !!(this._pPunctuatorsMap[sValue]);
        }

        /** @inline */
        private _nextChar(): string {
            return this._sSource[this._iIndex + 1];
        }

        /** @inline */
        private _currentChar(): string {
            return this._sSource[<number>this._iIndex];
        }

        /** @inline */
        private _readNextChar(): string {
            this._iIndex++;
            this._iColumnNumber++;
            return this._sSource[<number>this._iIndex];
        }

        private _scanString(): IToken {
            return <IToken>{};
        }

        private _scanPunctuator(): IToken {
            return <IToken>{};
        }

        private _scanNumber(): IToken {
            return <IToken>{};
        }

        private _scanIdentifier(): IToken {
            return <IToken>{};
        }

        private _scanWhiteSpace(): bool {
            return true;
        }

        private _scanComment(): bool {
            return true;
        }


    }

    //Lexer.prototype._scanString = function () {
    //    var chFirst = this._currentChar();
    //    var sValue = chFirst;
    //    var ch;
    //    var chPrevious = chFirst;
    //    var isGoodFinish = false;
    //    var iStart = this.iColumnNumber;
    //    while (1) {
    //        ch = this._nextChar();
    //        if (!ch) {
    //            break;
    //        }
    //        sValue += ch;
    //        if (ch === chFirst && chPrevious !== '\\') {
    //            isGoodFinish = true;
    //            this._nextChar();
    //            break;
    //        }
    //        chPrevious = ch;
    //    }
    //    if (isGoodFinish) {
    //        return {
    //            sName  : "T_STRING",
    //            sValue : sValue,
    //            iStart : iStart,
    //            iEnd   : this.iColumnNumber - 1,
    //            iLine  : this.iLineNumber
    //        };
    //    }
    //    else {
    //        if (!ch) {
    //            ch = "EOF";
    //        }
    //        sValue += ch;
    //        this._error(a.Lexer.Error.BAD_TOKEN_ERROR,
    //                    {
    //                        eType  : a.Parser.TokenType.STRING_LITERAL,
    //                        sValue : sValue,
    //                        iStart : iStart,
    //                        iEnd   : this.iColumnNumber,
    //                        iLine  : this.iLineNumber
    //                    });
    //    }
    //};
    //Lexer.prototype._scanPunctuator = function () {
    //    var sValue = this._currentChar();
    //    var ch;
    //    var iStart = this.iColumnNumber;
    //    while (1) {
    //        ch = this._nextChar();
    //        if (ch) {
    //            sValue += ch;
    //            this.iColumnNumber++;
    //            if (!this._isPunctuator(sValue)) {
    //                sValue = sValue.slice(0, sValue.length - 1);
    //                break;
    //            }
    //        }
    //        else {
    //            break;
    //        }
    //    }
    //    return {
    //        sName  : this._pPunctuators[sValue],
    //        sValue : sValue,
    //        iStart : iStart,
    //        iEnd   : this.iColumnNumber - 1,
    //        iLine  : this.iLineNumber
    //    };
    //};
    //Lexer.prototype._scanWhiteSpace = function () {
    //    var ch = this._currentChar();
    //    while (1) {
    //        if (!ch) {
    //            break;
    //        }
    //        if (this._isLineTerminator(ch)) {
    //            this.iLineNumber++;
    //            ch = this._nextChar();
    //            this.iColumnNumber = 0;
    //            continue;
    //        }
    //        else if (ch === '\t') {
    //            this.iColumnNumber += 3;
    //        }
    //        else if (ch !== ' ') {
    //            break;
    //        }
    //        ch = this._nextChar();
    //    }
    //    return true;
    //};
    //Lexer.prototype._scanComment = function () {
    //    var sValue = this._currentChar();
    //    var ch = this._nextChar();
    //    sValue += ch;
    //    if (ch === '/') {
    //        //Line Comment
    //        while (1) {
    //            ch = this._nextChar();
    //            if (!ch) {
    //                break;
    //            }
    //            if (this._isLineTerminator(ch)) {
    //                this.iLineNumber++;
    //                this._nextChar();
    //                this.iColumnNumber = 0;
    //                break;
    //            }
    //            sValue += ch;
    //        }
    //        return true;
    //    }
    //    else {
    //        //Multiline Comment
    //        var chPrevious = ch;
    //        var isGoodFinish = false;
    //        var iStart = this.iColumnNumber;
    //        while (1) {
    //            ch = this._nextChar();
    //            if (!ch) {
    //                break;
    //            }
    //            sValue += ch;
    //            if (ch === '/' && chPrevious === '*') {
    //                isGoodFinish = true;
    //                this._nextChar();
    //                break;
    //            }
    //            if (this._isLineTerminator(ch)) {
    //                this.iLineNumber++;
    //                this.iColumnNumber = -1;
    //            }
    //            chPrevious = ch;
    //        }
    //        if (isGoodFinish) {
    //            return true;
    //        }
    //        else {
    //            if (!ch) {
    //                ch = "EOF";
    //            }
    //            sValue += ch;
    //            this._error(a.Lexer.Error.BAD_TOKEN_ERROR,
    //                        {
    //                            eType  : a.Parser.TokenType.COMMENT_LITERAL,
    //                            sValue : sValue,
    //                            iStart : iStart,
    //                            iEnd   : this.iColumnNumber,
    //                            iLine  : this.iLineNumber
    //                        });
    //        }
    //    }
    //};
    //Lexer.prototype._scanNumber = function () {
    //    var ch = this._currentChar();
    //    var sValue = "";
    //    var isFloat = false;
    //    var chPrevious = ch;
    //    var isGoodFinish = false;
    //    var iStart = this.iColumnNumber;
    //    var isE = false;
    //    if (ch === '.') {
    //        sValue += 0;
    //        isFloat = true;
    //    }
    //    sValue += ch;
    //    while (1) {
    //        ch = this._nextChar();
    //        if (ch === '.') {
    //            if (isFloat) {
    //                break;
    //            }
    //            else {
    //                isFloat = true;
    //            }
    //        }
    //        else if (ch === 'e') {
    //            if (isE) {
    //                break;
    //            }
    //            else {
    //                isE = true;
    //            }
    //        }
    //        else if (((ch === '+' || ch === '-') && chPrevious === 'e')) {
    //            sValue += ch;
    //            chPrevious = ch;
    //            continue;
    //        }
    //        else if (ch === 'f' && isFloat) {
    //            ch = this._nextChar();
    //            if ((ch >= 'a' && ch <= 'z') || (ch >= 'A' && ch <= 'Z')) {
    //                break;
    //            }
    //            isGoodFinish = true;
    //            break;
    //        }
    //        else if ((ch >= 'a' && ch <= 'z') || (ch >= 'A' && ch <= 'Z')) {
    //            break;
    //        }
    //        else if (!((ch >= '0') && (ch <= '9')) || !ch) {
    //            if ((isE && chPrevious !== '+' && chPrevious !== '-' && chPrevious !== 'e') || !isE) {
    //                isGoodFinish = true;
    //            }
    //            break;
    //        }
    //        sValue += ch;
    //        chPrevious = ch;
    //    }

    //    if (isGoodFinish) {
    //        var sName = isFloat ? "T_FLOAT" : "T_UINT";
    //        return {
    //            sName  : sName,
    //            sValue : sValue,
    //            iStart : iStart,
    //            iEnd   : this.iColumnNumber - 1,
    //            iLine  : this.iLineNumber
    //        };
    //    }
    //    else {
    //        if (!ch) {
    //            ch = "EOF";
    //        }
    //        sValue += ch;
    //        this._error(a.Lexer.Error.BAD_TOKEN_ERROR,
    //                    {
    //                        eType  : a.Parser.TokenType.NUMERIC_LITERAL,
    //                        sValue : sValue,
    //                        iStart : iStart,
    //                        iEnd   : this.iColumnNumber,
    //                        iLine  : this.iLineNumber
    //                    });
    //    }
    //};
    //Lexer.prototype._scanIdentifier = function () {
    //    var ch = this._currentChar();
    //    var sValue = ch;
    //    var iStart = this.iColumnNumber;
    //    var isGoodFinish = false;
    //    while (1) {
    //        ch = this._nextChar();
    //        if (!ch) {
    //            isGoodFinish = true;
    //            break;
    //        }
    //        if (!((ch === '_') || (ch >= 'a' && ch <= 'z') || (ch >= 'A' && ch <= 'Z') || (ch >= '0' && ch <= '9'))) {
    //            isGoodFinish = true;
    //            break;
    //        }
    //        sValue += ch;
    //    }
    //    if (isGoodFinish) {
    //        if (this._isKeyword(sValue)) {
    //            return {
    //                sName  : this._pKeywords[sValue],
    //                sValue : sValue,
    //                iStart : iStart,
    //                iEnd   : this.iColumnNumber - 1,
    //                iLine  : this.iLineNumber
    //            };
    //        }
    //        else {
    //            var sName = this.pParser.isTypeId(sValue) ? "T_TYPE_ID" : "T_NON_TYPE_ID";
    //            return {
    //                sName  : sName,
    //                sValue : sValue,
    //                iStart : iStart,
    //                iEnd   : this.iColumnNumber - 1,
    //                iLine  : this.iLineNumber
    //            };
    //        }
    //    }
    //    else {
    //        if (!ch) {
    //            ch = "EOF";
    //        }
    //        sValue += ch;
    //        this._error(a.Lexer.Error.BAD_TOKEN_ERROR,
    //                    {
    //                        eType  : a.Parser.TokenType.IDENTIFIER_LITERAL,
    //                        sValue : sValue,
    //                        iStart : iStart,
    //                        iEnd   : this.iColumnNumber,
    //                        iLine  : this.iLineNumber
    //                    });
    //    }
    //};

}