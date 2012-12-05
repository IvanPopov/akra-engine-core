var akra;
(function (akra) {
    var END_POSITION = "END";
    var T_EMPTY = "EMPTY";
    var UNKNOWN_TOKEN = "UNNOWN";
    var START_SYMBOL = "S";
    var UNUSED_SYMBOL = "##";
    var END_SYMBOL = "$";
    var LEXER_RULES = "--LEXER--";
    var FLAG_RULE_CREATE_NODE = "--AN";
    var FLAG_RULE_NOT_CREATE_NODE = "--NN";
    var FLAG_RULE_FUNCTION = "--F";
    var bf;
    (function (bf) {
        bf.testAll = function (value, set) {
            return (((value) & (set)) == (set));
        };
    })(bf || (bf = {}));
    var isString = function (x) {
        return (typeof x === "string");
    };
    var isInt = function (x) {
        return (typeof x === "number");
    };
    var isObject = function (x) {
        return (typeof x === "object");
    };
    var isNull = function (x) {
        return (x === null);
    };
    var isDef = function (x) {
        return (x === undefined);
    };
    var EOperationType;
    (function (EOperationType) {
        EOperationType._map = [];
        EOperationType.k_Error = 100;
        EOperationType._map[101] = "k_Shift";
        EOperationType.k_Shift = 101;
        EOperationType._map[102] = "k_Reduce";
        EOperationType.k_Reduce = 102;
        EOperationType._map[103] = "k_Success";
        EOperationType.k_Success = 103;
        EOperationType._map[104] = "k_Pause";
        EOperationType.k_Pause = 104;
        EOperationType._map[105] = "k_Ok";
        EOperationType.k_Ok = 105;
    })(EOperationType || (EOperationType = {}));
    (function (ENodeCreateMode) {
        ENodeCreateMode._map = [];
        ENodeCreateMode._map[0] = "k_Default";
        ENodeCreateMode.k_Default = 0;
        ENodeCreateMode._map[1] = "k_Necessary";
        ENodeCreateMode.k_Necessary = 1;
        ENodeCreateMode._map[2] = "k_Not";
        ENodeCreateMode.k_Not = 2;
    })(akra.ENodeCreateMode || (akra.ENodeCreateMode = {}));
    var ENodeCreateMode = akra.ENodeCreateMode;
    var EParserCode;
    (function (EParserCode) {
        EParserCode._map = [];
        EParserCode._map[0] = "k_Pause";
        EParserCode.k_Pause = 0;
        EParserCode._map[1] = "k_Ok";
        EParserCode.k_Ok = 1;
        EParserCode._map[2] = "k_Error";
        EParserCode.k_Error = 2;
    })(EParserCode || (EParserCode = {}));
    var EParserType;
    (function (EParserType) {
        EParserType._map = [];
        EParserType._map[0] = "k_LR0";
        EParserType.k_LR0 = 0;
        EParserType._map[1] = "k_LR1";
        EParserType.k_LR1 = 1;
        EParserType._map[2] = "k_LALR";
        EParserType.k_LALR = 2;
    })(EParserType || (EParserType = {}));
    var ESyntaxErrorCode;
    (function (ESyntaxErrorCode) {
        ESyntaxErrorCode._map = [];
        ESyntaxErrorCode.k_Parser = 100;
        ESyntaxErrorCode._map[101] = "k_GrammarAddOperation";
        ESyntaxErrorCode.k_GrammarAddOperation = 101;
        ESyntaxErrorCode._map[102] = "k_GrammarAddStateLink";
        ESyntaxErrorCode.k_GrammarAddStateLink = 102;
        ESyntaxErrorCode._map[103] = "k_GrammarUnexpectedSymbol";
        ESyntaxErrorCode.k_GrammarUnexpectedSymbol = 103;
        ESyntaxErrorCode._map[104] = "k_GrammarBadAdditionalFunctionName";
        ESyntaxErrorCode.k_GrammarBadAdditionalFunctionName = 104;
        ESyntaxErrorCode._map[105] = "k_GrammarBadKeyword";
        ESyntaxErrorCode.k_GrammarBadKeyword = 105;
        ESyntaxErrorCode._map[106] = "k_SyntaxError";
        ESyntaxErrorCode.k_SyntaxError = 106;
        ESyntaxErrorCode.k_Lexer = 200;
        ESyntaxErrorCode._map[201] = "k_UnknownToken";
        ESyntaxErrorCode.k_UnknownToken = 201;
        ESyntaxErrorCode._map[202] = "k_BadToken";
        ESyntaxErrorCode.k_BadToken = 202;
    })(ESyntaxErrorCode || (ESyntaxErrorCode = {}));
    var ETokenType;
    (function (ETokenType) {
        ETokenType._map = [];
        ETokenType.k_NumericLiteral = 1;
        ETokenType._map[2] = "k_CommentLiteral";
        ETokenType.k_CommentLiteral = 2;
        ETokenType._map[3] = "k_StringLiteral";
        ETokenType.k_StringLiteral = 3;
        ETokenType._map[4] = "k_PunctuatorLiteral";
        ETokenType.k_PunctuatorLiteral = 4;
        ETokenType._map[5] = "k_WhitespaceLiteral";
        ETokenType.k_WhitespaceLiteral = 5;
        ETokenType._map[6] = "k_IdentifierLiteral";
        ETokenType.k_IdentifierLiteral = 6;
        ETokenType._map[7] = "k_KeywordLiteral";
        ETokenType.k_KeywordLiteral = 7;
        ETokenType._map[8] = "k_Unknown";
        ETokenType.k_Unknown = 8;
        ETokenType._map[9] = "k_End";
        ETokenType.k_End = 9;
    })(ETokenType || (ETokenType = {}));
    var Item = (function () {
        function Item(pRule, iPos, pExpected) {
            this._pRule = pRule;
            this._iPos = iPos;
            this._iIndex = 0;
            this._pState = null;
            this._isNewExpected = true;
            this._iLength = 0;
            this._pExpected = {
            };
            if(arguments.length === 3) {
                var i;
                for(i in arguments[2]) {
                    this.addExpected(i);
                }
            }
        }
        Object.defineProperty(Item.prototype, "rule", {
            get: function () {
                return this._pRule;
            },
            set: function (pRule) {
                this._pRule = pRule;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Item.prototype, "position", {
            get: function () {
                return this._iPos;
            },
            set: function (iPos) {
                this._iPos = iPos;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Item.prototype, "state", {
            get: function () {
                return this._pState;
            },
            set: function (pState) {
                this._pState = pState;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Item.prototype, "index", {
            get: function () {
                return this._iIndex;
            },
            set: function (iIndex) {
                this._iIndex = iIndex;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Item.prototype, "expectedSymbols", {
            get: function () {
                return this._pExpected;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Item.prototype, "length", {
            get: function () {
                return this._iLength;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Item.prototype, "isNewExpected", {
            get: function () {
                return this._isNewExpected;
            },
            set: function (_isNewExpected) {
                this._isNewExpected = _isNewExpected;
            },
            enumerable: true,
            configurable: true
        });
        Item.prototype.isEqual = function (pItem, eType) {
            if (typeof eType === "undefined") { eType = EParserType.k_LR0; }
            if(eType === EParserType.k_LR0) {
                return (this._pRule === pItem.rule && this._iPos === pItem.position);
            } else {
                if(eType === EParserType.k_LR1) {
                    if(!(this._pRule === pItem.rule && this._iPos === pItem.position && this._iLength === (pItem).length)) {
                        return false;
                    }
                    var i;
                    for(i in this._pExpected) {
                        if(!(pItem).isExpected(i)) {
                            return false;
                        }
                    }
                    return true;
                }
            }
        };
        Item.prototype.isParentItem = function (pItem) {
            return (this._pRule === pItem.rule && this._iPos === pItem.position + 1);
        };
        Item.prototype.isChildItem = function (pItem) {
            return (this._pRule === pItem.rule && this._iPos === pItem.position - 1);
        };
        Item.prototype.mark = function () {
            var pRight = this._pRule.right;
            if(this._iPos === pRight.length) {
                return END_POSITION;
            }
            return pRight[this._iPos];
        };
        Item.prototype.end = function () {
            var pRight = this._pRule.right;
            return pRight[pRight.length - 1] || T_EMPTY;
        };
        Item.prototype.nextMarked = function () {
            return this._pRule.right[this._iPos + 1] || END_POSITION;
        };
        Item.prototype.isExpected = function (sSymbol) {
            return !!(this._pExpected[sSymbol]);
        };
        Item.prototype.addExpected = function (sSymbol) {
            if(this._pExpected[sSymbol]) {
                return false;
            }
            this._pExpected[sSymbol] = true;
            this._isNewExpected = true;
            this._iLength++;
            return true;
        };
        Item.prototype.toString = function () {
            var sMsg = this._pRule.left + " -> ";
            var sExpected = "";
            var pRight = this._pRule.right;
            for(var k = 0; k < pRight.length; k++) {
                if(k === this._iPos) {
                    sMsg += ". ";
                }
                sMsg += pRight[k] + " ";
            }
            if(this._iPos === pRight.length) {
                sMsg += ". ";
            }
            if(isDef(this._pExpected)) {
                sExpected = ", ";
                for(var l in this._pExpected) {
                    sExpected += l + "/";
                }
                if(sExpected !== ", ") {
                    sMsg += sExpected;
                }
            }
            sMsg = sMsg.slice(0, sMsg.length - 1);
            return sMsg;
        };
        return Item;
    })();    
    var State = (function () {
        function State() {
            this._pItemList = [];
            this._pNextStates = {
            };
            this._iIndex = 0;
            this._nBaseItems = 0;
        }
        Object.defineProperty(State.prototype, "items", {
            get: function () {
                return this._pItemList;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(State.prototype, "numBaseItems", {
            get: function () {
                return this._nBaseItems;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(State.prototype, "index", {
            get: function () {
                return this._iIndex;
            },
            set: function (iIndex) {
                this._iIndex = iIndex;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(State.prototype, "nextStates", {
            get: function () {
                return this._pNextStates;
            },
            enumerable: true,
            configurable: true
        });
        State.prototype.hasItem = function (pItem, eType) {
            var i;
            var pItems = this._pItemList;
            for(i = 0; i < pItems.length; i++) {
                if(pItems[i].isEqual(pItem, eType)) {
                    return pItems[i];
                }
            }
            return null;
        };
        State.prototype.hasParentItem = function (pItem) {
            var i;
            var pItems = this._pItemList;
            for(i = 0; i < pItems.length; i++) {
                if(pItems[i].isParentItem(pItem)) {
                    return pItems[i];
                }
            }
            return null;
        };
        State.prototype.hasChildItem = function (pItem) {
            var i;
            var pItems = this._pItemList;
            for(i = 0; i < pItems.length; i++) {
                if(pItems[i].isChildItem(pItem)) {
                    return pItems[i];
                }
            }
            return null;
        };
        State.prototype.isEmpty = function () {
            return !(this._pItemList.length);
        };
        State.prototype.isEqual = function (pState, eType) {
            var pItemsA = this._pItemList;
            var pItemsB = pState.items;
            if(this._nBaseItems !== pState.numBaseItems) {
                return false;
            }
            var nItems = this._nBaseItems;
            var i;
            var j;

            var isEqual;
            for(i = 0; i < nItems; i++) {
                isEqual = false;
                for(j = 0; j < nItems; j++) {
                    if(pItemsA[i].isEqual(pItemsB[j], eType)) {
                        isEqual = true;
                        break;
                    }
                }
                if(!isEqual) {
                    return false;
                }
            }
            return true;
        };
        State.prototype.push = function (pItem) {
            if(this._pItemList.length === 0 || pItem.position > 0) {
                this._nBaseItems += 1;
            }
            pItem.state = this;
            this._pItemList.push(pItem);
        };
        State.prototype.tryPush_LR0 = function (pRule, iPos) {
            var i;
            var pItems = this._pItemList;
            for(i = 0; i < pItems.length; i++) {
                if(pItems[i].rule === pRule && pItems[i].position === iPos) {
                    return false;
                }
            }
            var pItem = new Item(pRule, iPos);
            this.push(pItem);
            return true;
        };
        State.prototype.tryPush_LR = function (pRule, iPos, sExpectedSymbol) {
            var i;
            var pItems = (this._pItemList);
            for(i = 0; i < pItems.length; i++) {
                if(pItems[i].rule === pRule && pItems[i].position === iPos) {
                    return pItems[i].addExpected(sExpectedSymbol);
                }
            }
            var pExpected = {
            };
            pExpected[sExpectedSymbol] = true;
            var pItem = new Item(pRule, iPos, pExpected);
            this.push(pItem);
            return true;
        };
        State.prototype.getNextStateBySymbol = function (sSymbol) {
            if(isDef(this._pNextStates[sSymbol])) {
                return this._pNextStates[sSymbol];
            } else {
                return null;
            }
        };
        State.prototype.addNextState = function (sSymbol, pState) {
            if(isDef(this._pNextStates[sSymbol])) {
                return false;
            } else {
                this._pNextStates[sSymbol] = pState;
                return true;
            }
        };
        State.prototype.deleteNotBase = function () {
            this._pItemList.length = this._nBaseItems;
        };
        State.prototype.toString = function (isBase) {
            var len = 0;
            var sMsg;
            var pItemList = this._pItemList;
            sMsg = "State " + this._iIndex + ":\n";
            len = isBase ? this._nBaseItems : pItemList.length;
            for(var j = 0; j < len; j++) {
                sMsg += "\t\t";
                sMsg += pItemList[j].toString();
                sMsg += "\n";
            }
            return sMsg;
        };
        return State;
    })();    
    var ParseTree = (function () {
        function ParseTree() {
            this._pRoot = null;
            this._pNodes = [];
            this._pNodesCountStack = [];
            this._isOptimizeMode = false;
        }
        Object.defineProperty(ParseTree.prototype, "root", {
            get: function () {
                return this._pRoot;
            },
            set: function (pRoot) {
                this._pRoot = pRoot;
            },
            enumerable: true,
            configurable: true
        });
        ParseTree.prototype.setRoot = function () {
            this._pRoot = this._pNodes.pop();
        };
        ParseTree.prototype.setOptimizeMode = function (isOptimize) {
            this._isOptimizeMode = isOptimize;
        };
        ParseTree.prototype.addNode = function (pNode) {
            this._pNodes.push(pNode);
            this._pNodesCountStack.push(1);
        };
        ParseTree.prototype.reduceByRule = function (pRule, eCreate) {
            if (typeof eCreate === "undefined") { eCreate = ENodeCreateMode.k_Default; }
            var iReduceCount = 0;
            var pNodesCountStack = this._pNodesCountStack;
            var pNode;
            var iRuleLength = pRule.right.length;
            var pNodes = this._pNodes;
            var nOptimize = this._isOptimizeMode ? 1 : 0;
            while(iRuleLength) {
                iReduceCount += pNodesCountStack.pop();
                iRuleLength--;
            }
            if((eCreate === ENodeCreateMode.k_Default && iReduceCount > nOptimize) || (eCreate === ENodeCreateMode.k_Necessary)) {
                pNode = {
                    name: pRule.left,
                    children: null,
                    parent: null,
                    value: ""
                };
                while(iReduceCount) {
                    this.addLink(pNode, pNodes.pop());
                    iReduceCount -= 1;
                }
                pNodes.push(pNode);
                pNodesCountStack.push(1);
            } else {
                pNodesCountStack.push(iReduceCount);
            }
        };
        ParseTree.prototype.toString = function () {
            if(this._pRoot) {
                return this.toStringNode(this._pRoot);
            } else {
                return "";
            }
        };
        ParseTree.prototype.clone = function () {
            var pTree = new ParseTree();
            pTree.root = this.cloneNode(this._pRoot);
            return pTree;
        };
        ParseTree.prototype.addLink = function (pParent, pNode) {
            if(!pParent.children) {
                pParent.children = [];
            }
            pParent.children.push(pParent);
            pNode.parent = pParent;
        };
        ParseTree.prototype.cloneNode = function (pNode) {
            var pNewNode;
            pNewNode = {
                name: pNode.name,
                value: pNode.value,
                children: null,
                parent: null
            };
            var pChildren = pNode.children;
            for(var i = 0; pChildren && i < pChildren.length; i++) {
                this.addLink(pNewNode, this.cloneNode(pChildren[i]));
            }
            return pNewNode;
        };
        ParseTree.prototype.toStringNode = function (pNode, sPadding) {
            if (typeof sPadding === "undefined") { sPadding = ""; }
            var sRes = sPadding + "{\n";
            var sOldPadding = sPadding;
            var sDefaultPadding = "  ";
            sPadding += sDefaultPadding;
            if(pNode.value) {
                sRes += sPadding + "name : \"" + pNode.name + "\"" + ",\n";
                sRes += sPadding + "value : \"" + pNode.value + "\"" + "\n";
            } else {
                sRes += sPadding + "name : \"" + pNode.name + "\"" + "\n";
                sRes += sPadding + "children : [";
                var pChildren = pNode.children;
                if(pChildren) {
                    sRes += "\n";
                    sPadding += sDefaultPadding;
                    for(var i = pChildren.length - 1; i >= 0; i--) {
                        sRes += this.toStringNode(pChildren[i], sPadding);
                        sRes += ",\n";
                    }
                    sRes = sRes.slice(0, sRes.length - 2);
                    sRes += "\n";
                    sRes += sOldPadding + sDefaultPadding + "]\n";
                } else {
                    sRes += " ]\n";
                }
            }
            sRes += sOldPadding + "}";
            return sRes;
        };
        return ParseTree;
    })();
    akra.ParseTree = ParseTree;    
    var Lexer = (function () {
        function Lexer(pParser) {
            this._iLineNumber = 0;
            this._iColumnNumber = 0;
            this._sSource = "";
            this._iIndex = 0;
            this._pParser = pParser;
            this._pPunctuatorsMap = {
            };
            this._pKeywordsMap = {
            };
            this._pPunctuatorsFirstSymbols = {
            };
        }
        Lexer.prototype.addPunctuator = function (sValue, sName) {
            if(typeof (sName) === undefined && sValue.length === 1) {
                sName = "T_PUNCTUATOR_" + sValue.charCodeAt(0);
            }
            this._pPunctuatorsMap[sValue] = sName;
            this._pPunctuatorsFirstSymbols[sValue[0]] = true;
            return sName;
        };
        Lexer.prototype.addKeyword = function (sValue, sName) {
            this._pKeywordsMap[sValue] = sName;
            return sName;
        };
        Lexer.prototype.init = function (sSource) {
            this._sSource = sSource;
            this._iLineNumber = 0;
            this._iColumnNumber = 0;
            this._iIndex = 0;
        };
        Lexer.prototype.getNextToken = function () {
            var ch = this.currentChar();
            if(!ch) {
                return {
                    name: END_SYMBOL,
                    value: END_SYMBOL,
                    start: this._iColumnNumber,
                    end: this._iColumnNumber,
                    line: this._iLineNumber
                };
            }
            var eType = this.identityTokenType();
            var pToken;
            switch(eType) {
                case ETokenType.k_NumericLiteral: {
                    pToken = this.scanNumber();
                    break;

                }
                case ETokenType.k_CommentLiteral: {
                    this.scanComment();
                    pToken = this.getNextToken();
                    break;

                }
                case ETokenType.k_StringLiteral: {
                    pToken = this.scanString();
                    break;

                }
                case ETokenType.k_PunctuatorLiteral: {
                    pToken = this.scanPunctuator();
                    break;

                }
                case ETokenType.k_IdentifierLiteral: {
                    pToken = this.scanIdentifier();
                    break;

                }
                case ETokenType.k_WhitespaceLiteral: {
                    this.scanWhiteSpace();
                    pToken = this.getNextToken();
                    break;

                }
                default: {
                    this.error(ESyntaxErrorCode.k_UnknownToken, {
                        name: UNKNOWN_TOKEN,
                        value: ch + this._sSource[this._iIndex + 1],
                        start: this._iColumnNumber,
                        end: this._iColumnNumber + 1,
                        line: this._iLineNumber
                    });

                }
            }
            return pToken;
        };
        Lexer.prototype.error = function (eCode, pToken) {
        };
        Lexer.prototype.identityTokenType = function () {
            if(this.isIdentifierStart()) {
                return ETokenType.k_IdentifierLiteral;
            }
            if(this.isWhiteSpaceStart()) {
                return ETokenType.k_WhitespaceLiteral;
            }
            if(this.isStringStart()) {
                return ETokenType.k_StringLiteral;
            }
            if(this.isCommentStart()) {
                return ETokenType.k_CommentLiteral;
            }
            if(this.isNumberStart()) {
                return ETokenType.k_NumericLiteral;
            }
            if(this.isPunctuatorStart()) {
                return ETokenType.k_PunctuatorLiteral;
            }
            return ETokenType.k_Unknown;
        };
        Lexer.prototype.isNumberStart = function () {
            var ch = this.currentChar();
            if((ch >= '0') && (ch <= '9')) {
                return true;
            }
            var ch1 = this.nextChar();
            if(ch === "." && (ch1 >= '0') && (ch1 <= '9')) {
                return true;
            }
            return false;
        };
        Lexer.prototype.isCommentStart = function () {
            var ch = this.currentChar();
            var ch1 = this.nextChar();
            if(ch === "/" && (ch1 === "/" || ch1 === "*")) {
                return true;
            }
            return false;
        };
        Lexer.prototype.isStringStart = function () {
            var ch = this.currentChar();
            if(ch === "\"" || ch === "'") {
                return true;
            }
            return false;
        };
        Lexer.prototype.isPunctuatorStart = function () {
            var ch = this.currentChar();
            if(this._pPunctuatorsFirstSymbols[ch]) {
                return true;
            }
            return false;
        };
        Lexer.prototype.isWhiteSpaceStart = function () {
            var ch = this.currentChar();
            if(ch === ' ' || ch === '\n' || ch === '\r' || ch === '\t') {
                return true;
            }
            return false;
        };
        Lexer.prototype.isIdentifierStart = function () {
            var ch = this.currentChar();
            if((ch === '_') || (ch >= 'a' && ch <= 'z') || (ch >= 'A' && ch <= 'Z')) {
                return true;
            }
            return false;
        };
        Lexer.prototype.isLineTerminator = function (sSymbol) {
            return (sSymbol === '\n' || sSymbol === '\r' || sSymbol === '\u2028' || sSymbol === '\u2029');
        };
        Lexer.prototype.isWhiteSpace = function (sSymbol) {
            return (sSymbol === ' ') || (sSymbol === '\t');
        };
        Lexer.prototype.isKeyword = function (sValue) {
            return !!(this._pKeywordsMap[sValue]);
        };
        Lexer.prototype.isPunctuator = function (sValue) {
            return !!(this._pPunctuatorsMap[sValue]);
        };
        Lexer.prototype.nextChar = function () {
            return this._sSource[this._iIndex + 1];
        };
        Lexer.prototype.currentChar = function () {
            return this._sSource[this._iIndex];
        };
        Lexer.prototype.readNextChar = function () {
            this._iIndex++;
            this._iColumnNumber++;
            return this._sSource[this._iIndex];
        };
        Lexer.prototype.scanString = function () {
            var chFirst = this.currentChar();
            var sValue = chFirst;
            var ch;
            var chPrevious = chFirst;
            var isGoodFinish = false;
            var iStart = this._iColumnNumber;
            while(true) {
                ch = this.readNextChar();
                if(!ch) {
                    break;
                }
                sValue += ch;
                if(ch === chFirst && chPrevious !== '\\') {
                    isGoodFinish = true;
                    this.readNextChar();
                    break;
                }
                chPrevious = ch;
            }
            if(isGoodFinish) {
                return {
                    name: "T_STRING",
                    value: sValue,
                    start: iStart,
                    end: this._iColumnNumber - 1,
                    line: this._iLineNumber
                };
            } else {
                if(!ch) {
                    ch = "EOF";
                }
                sValue += ch;
                this.error(ESyntaxErrorCode.k_BadToken, {
                    type: ETokenType.k_StringLiteral,
                    value: sValue,
                    start: iStart,
                    end: this._iColumnNumber,
                    line: this._iLineNumber
                });
                return null;
            }
        };
        Lexer.prototype.scanPunctuator = function () {
            var sValue = this.currentChar();
            var ch;
            var iStart = this._iColumnNumber;
            while(true) {
                ch = this.readNextChar();
                if(ch) {
                    sValue += ch;
                    this._iColumnNumber++;
                    if(!this.isPunctuator(sValue)) {
                        sValue = sValue.slice(0, sValue.length - 1);
                        break;
                    }
                } else {
                    break;
                }
            }
            return {
                name: this._pPunctuatorsMap[sValue],
                value: sValue,
                start: iStart,
                end: this._iColumnNumber - 1,
                line: this._iLineNumber
            };
        };
        Lexer.prototype.scanNumber = function () {
            var ch = this.currentChar();
            var sValue = "";
            var isFloat = false;
            var chPrevious = ch;
            var isGoodFinish = false;
            var iStart = this._iColumnNumber;
            var isE = false;
            if(ch === '.') {
                sValue += 0;
                isFloat = true;
            }
            sValue += ch;
            while(true) {
                ch = this.readNextChar();
                if(ch === '.') {
                    if(isFloat) {
                        break;
                    } else {
                        isFloat = true;
                    }
                } else {
                    if(ch === 'e') {
                        if(isE) {
                            break;
                        } else {
                            isE = true;
                        }
                    } else {
                        if(((ch === '+' || ch === '-') && chPrevious === 'e')) {
                            sValue += ch;
                            chPrevious = ch;
                            continue;
                        } else {
                            if(ch === 'f' && isFloat) {
                                ch = this.readNextChar();
                                if((ch >= 'a' && ch <= 'z') || (ch >= 'A' && ch <= 'Z')) {
                                    break;
                                }
                                isGoodFinish = true;
                                break;
                            } else {
                                if((ch >= 'a' && ch <= 'z') || (ch >= 'A' && ch <= 'Z')) {
                                    break;
                                } else {
                                    if(!((ch >= '0') && (ch <= '9')) || !ch) {
                                        if((isE && chPrevious !== '+' && chPrevious !== '-' && chPrevious !== 'e') || !isE) {
                                            isGoodFinish = true;
                                        }
                                        break;
                                    }
                                }
                            }
                        }
                    }
                }
                sValue += ch;
                chPrevious = ch;
            }
            if(isGoodFinish) {
                var sName = isFloat ? "T_FLOAT" : "T_UINT";
                return {
                    name: sName,
                    value: sValue,
                    start: iStart,
                    end: this._iColumnNumber - 1,
                    line: this._iLineNumber
                };
            } else {
                if(!ch) {
                    ch = "EOF";
                }
                sValue += ch;
                this.error(ESyntaxErrorCode.k_BadToken, {
                    type: ETokenType.k_NumericLiteral,
                    value: sValue,
                    start: iStart,
                    end: this._iColumnNumber,
                    line: this._iLineNumber
                });
                return null;
            }
        };
        Lexer.prototype.scanIdentifier = function () {
            var ch = this.currentChar();
            var sValue = ch;
            var iStart = this._iColumnNumber;
            var isGoodFinish = false;
            while(1) {
                ch = this.readNextChar();
                if(!ch) {
                    isGoodFinish = true;
                    break;
                }
                if(!((ch === '_') || (ch >= 'a' && ch <= 'z') || (ch >= 'A' && ch <= 'Z') || (ch >= '0' && ch <= '9'))) {
                    isGoodFinish = true;
                    break;
                }
                sValue += ch;
            }
            if(isGoodFinish) {
                if(this.isKeyword(sValue)) {
                    return {
                        name: this._pKeywordsMap[sValue],
                        value: sValue,
                        start: iStart,
                        end: this._iColumnNumber - 1,
                        line: this._iLineNumber
                    };
                } else {
                    var sName = this._pParser.isTypeId(sValue) ? "T_TYPE_ID" : "T_NON_TYPE_ID";
                    return {
                        name: sName,
                        value: sValue,
                        start: iStart,
                        end: this._iColumnNumber - 1,
                        line: this._iLineNumber
                    };
                }
            } else {
                if(!ch) {
                    ch = "EOF";
                }
                sValue += ch;
                this.error(ESyntaxErrorCode.k_BadToken, {
                    type: ETokenType.k_IdentifierLiteral,
                    value: sValue,
                    start: iStart,
                    end: this._iColumnNumber,
                    line: this._iLineNumber
                });
                return null;
            }
        };
        Lexer.prototype.scanWhiteSpace = function () {
            var ch = this.currentChar();
            while(true) {
                if(!ch) {
                    break;
                }
                if(this.isLineTerminator(ch)) {
                    this._iLineNumber++;
                    ch = this.readNextChar();
                    this._iColumnNumber = 0;
                    continue;
                } else {
                    if(ch === '\t') {
                        this._iColumnNumber += 3;
                    } else {
                        if(ch !== ' ') {
                            break;
                        }
                    }
                }
                ch = this.readNextChar();
            }
            return true;
        };
        Lexer.prototype.scanComment = function () {
            var sValue = this.currentChar();
            var ch = this.readNextChar();
            sValue += ch;
            if(ch === '/') {
                while(true) {
                    ch = this.readNextChar();
                    if(!ch) {
                        break;
                    }
                    if(this.isLineTerminator(ch)) {
                        this._iLineNumber++;
                        this.readNextChar();
                        this._iColumnNumber = 0;
                        break;
                    }
                    sValue += ch;
                }
                return true;
            } else {
                var chPrevious = ch;
                var isGoodFinish = false;
                var iStart = this._iColumnNumber;
                while(true) {
                    ch = this.readNextChar();
                    if(!ch) {
                        break;
                    }
                    sValue += ch;
                    if(ch === '/' && chPrevious === '*') {
                        isGoodFinish = true;
                        this.readNextChar();
                        break;
                    }
                    if(this.isLineTerminator(ch)) {
                        this._iLineNumber++;
                        this._iColumnNumber = -1;
                    }
                    chPrevious = ch;
                }
                if(isGoodFinish) {
                    return true;
                } else {
                    if(!ch) {
                        ch = "EOF";
                    }
                    sValue += ch;
                    this.error(ESyntaxErrorCode.k_BadToken, {
                        type: ETokenType.k_CommentLiteral,
                        value: sValue,
                        start: iStart,
                        end: this._iColumnNumber,
                        line: this._iLineNumber
                    });
                }
            }
        };
        return Lexer;
    })();
    akra.Lexer = Lexer;    
    (function (EParseMode) {
        EParseMode._map = [];
        EParseMode.k_AllNode = 1;
        EParseMode.k_Negate = 2;
        EParseMode.k_Add = 4;
        EParseMode.k_Optimize = 8;
    })(akra.EParseMode || (akra.EParseMode = {}));
    var EParseMode = akra.EParseMode;
    ; ;
    var Parser = (function () {
        function Parser() {
            this._sSource = "";
            this._iIndex = 0;
            this._pSyntaxTree = null;
            this._pTypeIdMap = null;
            this._pLexer = null;
            this._pStack = [];
            this._pToken = null;
            this._fnFinishCallback = null;
            this._pCaller = null;
            this._pSymbols = {
            };
            this._pSymbols[END_SYMBOL] = true;
            this._pSyntaxTable = null;
            this._pReduceOperationsMap = null;
            this._pShiftOperationsMap = null;
            this._pSuccessOperation = null;
            this._pFirstTerminalsDMap = null;
            this._pFollowTerminalsDMap = null;
            this._pRulesDMap = null;
            this._pStateList = null;
            this._nRules = 0;
            this._pRuleFunctionNamesMap = null;
            this._pAdditionalFunctionsMap = null;
            this._eType = EParserType.k_LR0;
            this._pSymbolsWithNodesMap = null;
            this._eParseMode = EParseMode.k_AllNode;
            this._isSync = false;
            this._pStatesTempMap = null;
            this._pBaseItemList = null;
            this._pExpectedExtensionDMap = null;
        }
        Parser.prototype.isTypeId = function (sValue) {
            return !!(this._pTypeIdMap[sValue]);
        };
        Parser.prototype.returnCode = function (pNode) {
            if(pNode) {
                if(pNode.value) {
                    return pNode.value + " ";
                } else {
                    if(pNode.children) {
                        var sCode = "";
                        var i = 0;
                        for(i = pNode.children.length - 1; i >= 0; i--) {
                            sCode += this.returnCode(pNode.children[i]);
                        }
                        return sCode;
                    }
                }
            }
            return "";
        };
        Parser.prototype.init = function (sGrammar, eType, eMode) {
            try  {
                this._eType = eType || EParserType.k_LALR;
                this._pLexer = new Lexer(this);
                this._eParseMode = eMode || EParseMode.k_AllNode;
                this.generateRules(sGrammar);
                this.buildSyntaxTable();
                this.clearMem();
                return true;
            } catch (e) {
                return false;
            }
        };
        Parser.prototype.parse = function (sSource, isSync, fnFinishCallback, pCaller) {
            if (typeof fnFinishCallback === "undefined") { fnFinishCallback = null; }
            if (typeof pCaller === "undefined") { pCaller = null; }
            try  {
                this.defaultInit();
                this._sSource = sSource;
                this._pLexer.init(sSource);
                this._isSync = isSync;
                this._fnFinishCallback = fnFinishCallback;
                this._pCaller = pCaller;
                var pTree = this._pSyntaxTree;
                var pStack = this._pStack;
                var pSyntaxTable = this._pSyntaxTable;
                var isStop = false;
                var isError = false;
                var isPause = false;
                var pToken = this.readToken();
                var pOperation;
                var iRuleLength;
                while(!isStop) {
                    pOperation = pSyntaxTable[pStack[pStack.length - 1]][pToken.name];
                    if(isDef(pOperation)) {
                        switch(pOperation.type) {
                            case EOperationType.k_Success: {
                                isStop = true;
                                break;

                            }
                            case EOperationType.k_Shift: {
                                pStack.push(pOperation.index);
                                pTree.addNode(pToken);
                                pToken = this.readToken();
                                break;

                            }
                            case EOperationType.k_Reduce: {
                                iRuleLength = pOperation.rule.right.length;
                                pStack.length -= iRuleLength;
                                pStack.push(pSyntaxTable[pStack[pStack.length - 1]][pOperation.rule.left].index);
                                if(this.ruleAction(pOperation.rule) === EOperationType.k_Pause) {
                                    this._pToken = pToken;
                                    isStop = true;
                                    isPause = true;
                                }
                                break;

                            }
                        }
                    } else {
                        isError = true;
                        isStop = true;
                    }
                }
                if(isPause) {
                    return EParserCode.k_Pause;
                }
                if(!isError) {
                    pTree.setRoot();
                    if(isDef(this._fnFinishCallback)) {
                        this._fnFinishCallback.call(this._pCaller, EParserCode.k_Ok);
                    }
                    return EParserCode.k_Ok;
                } else {
                    this.error(ESyntaxErrorCode.k_SyntaxError);
                    if(isDef(this._fnFinishCallback)) {
                        this._fnFinishCallback.call(this._pCaller, EParserCode.k_Error);
                    }
                    return EParserCode.k_Error;
                }
            } catch (e) {
                return EParserCode.k_Error;
            }
        };
        Parser.prototype.pause = function () {
            return EParserCode.k_Pause;
        };
        Parser.prototype.resume = function () {
            return this.resumeParse();
        };
        Parser.prototype.error = function (eCode) {
        };
        Parser.prototype.clearMem = function () {
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
        };
        Parser.prototype.hasState = function (pState, eType) {
            var pStateList = this._pStateList;
            var i = 0;
            for(i = 0; i < pStateList.length; i++) {
                if(pStateList[i].isEqual(pState, eType)) {
                    return pStateList[i];
                }
            }
            return null;
        };
        Parser.prototype.isTerminal = function (sSymbol) {
            return !!(this._pRulesDMap[sSymbol]);
        };
        Parser.prototype.pushState = function (pState) {
            pState.index = this._pStateList.length;
            this._pStateList.push(pState);
        };
        Parser.prototype.pushBaseItem = function (pItem) {
            pItem.index = this._pBaseItemList.length;
            this._pBaseItemList.push(pItem);
        };
        Parser.prototype.tryAddState = function (pState, eType) {
            var pRes = this.hasState(pState, eType);
            if(isNull(pRes)) {
                if(eType === EParserType.k_LR0) {
                    var pItems = pState.items;
                    for(var i = 0; i < pItems.length; i++) {
                        this.pushBaseItem(pItems[i]);
                    }
                }
                this.pushState(pState);
                this.closure(pState, eType);
                return pState;
            }
            return pRes;
        };
        Parser.prototype.hasEmptyRule = function (sSymbol) {
            if(this.isTerminal(sSymbol)) {
                return false;
            }
            var pRulesDMap = this._pRulesDMap;
            for(var i in pRulesDMap) {
                if(pRulesDMap[sSymbol][i].right.length === 0) {
                    return true;
                }
            }
            return false;
        };
        Parser.prototype.pushInSyntaxTable = function (iIndex, sSymbol, pOperation) {
            var pSyntaxTable = this._pSyntaxTable;
            if(!pSyntaxTable[iIndex]) {
                pSyntaxTable[iIndex] = {
                };
            }
            if(isDef(pSyntaxTable[iIndex][sSymbol])) {
                this.error(ESyntaxErrorCode.k_GrammarAddOperation);
            }
            pSyntaxTable[iIndex][sSymbol] = pOperation;
        };
        Parser.prototype.addStateLink = function (pState, pNextState, sSymbol) {
            var isAddState = pState.addNextState(sSymbol, pNextState);
            if(!isAddState) {
                this.error(ESyntaxErrorCode.k_GrammarAddStateLink);
            }
        };
        Parser.prototype.firstTerminal = function (sSymbol) {
            if(this.isTerminal(sSymbol)) {
                return null;
            }
            if(isDef(this._pFirstTerminalsDMap[sSymbol])) {
                return this._pFirstTerminalsDMap[sSymbol];
            }
            var i;
            var j;
            var k;

            var pRulesMap = this._pRulesDMap[sSymbol];
            var pTempRes;
            var pRes;
            var pRight;
            var isFinish;
            pRes = this._pFirstTerminalsDMap[sSymbol] = {
            };
            if(this.hasEmptyRule(sSymbol)) {
                pRes[T_EMPTY] = true;
            }
            for(i in pRulesMap) {
                isFinish = false;
                pRight = pRulesMap[i].right;
                for(j = 0; j < pRight.length; j++) {
                    if(pRight[j] === sSymbol) {
                        if(pRes[T_EMPTY]) {
                            continue;
                        }
                        isFinish = true;
                        break;
                    }
                    pTempRes = this.firstTerminal(pRight[j]);
                    if(isNull(pTempRes)) {
                        pRes[pRight[j]] = true;
                    } else {
                        for(k in pTempRes) {
                            pRes[k] = true;
                        }
                    }
                    if(!this.hasEmptyRule(pRight[j])) {
                        isFinish = true;
                        break;
                    }
                }
                if(!isFinish) {
                    pRes[T_EMPTY] = true;
                }
            }
            return pRes;
        };
        Parser.prototype.followTerminal = function (sSymbol) {
            if(isDef(this._pFollowTerminalsDMap[sSymbol])) {
                return this._pFollowTerminalsDMap[sSymbol];
            }
            var i;
            var j;
            var k;
            var l;
            var m;

            var pRulesDMap = this._pRulesDMap;
            var pTempRes;
            var pRes;
            var pRight;
            var isFinish;
            pRes = this._pFollowTerminalsDMap[sSymbol] = {
            };
            for(i in pRulesDMap) {
                for(j in pRulesDMap[i]) {
                    pRight = pRulesDMap[i][j].right;
                    for(k = 0; k < pRight.length; k++) {
                        if(pRight[k] === sSymbol) {
                            if(k === pRight.length - 1) {
                                pTempRes = this.followTerminal(pRulesDMap[i][j].left);
                                for(m in pTempRes) {
                                    pRes[m] = true;
                                }
                            } else {
                                isFinish = false;
                                for(l = k + 1; l < pRight.length; l++) {
                                    pTempRes = this.firstTerminal(pRight[l]);
                                    if(isNull(pTempRes)) {
                                        pRes[pRight[l]] = true;
                                        isFinish = true;
                                        break;
                                    } else {
                                        for(m in pTempRes) {
                                            pRes[m] = true;
                                        }
                                    }
                                    if(!pTempRes[T_EMPTY]) {
                                        isFinish = true;
                                        break;
                                    }
                                }
                                if(!isFinish) {
                                    pTempRes = this.followTerminal(pRulesDMap[i][j].left);
                                    for(m in pTempRes) {
                                        pRes[m] = true;
                                    }
                                }
                            }
                        }
                    }
                }
            }
            return pRes;
        };
        Parser.prototype.firstTerminalForSet = function (pSet, pExpected) {
            var i;
            var j;

            var pTempRes;
            var pRes;
            var isEmpty;
            for(i = 0; i < pSet.length; i++) {
                pTempRes = this.firstTerminal(pSet[i]);
                if(isNull(pTempRes)) {
                    pRes[pSet[i]] = true;
                }
                isEmpty = false;
                for(j in pTempRes) {
                    if(j === T_EMPTY) {
                        isEmpty = true;
                        continue;
                    }
                    pRes[j] = true;
                }
                if(!isEmpty) {
                    return pRes;
                }
            }
            for(j in pExpected) {
                pRes[j] = true;
            }
            return pRes;
        };
        Parser.prototype.generateRules = function (sGrammarSource) {
            var pAllRuleList = sGrammarSource.split(/\r?\n/);
            var pTempRule;
            var pRule;
            var isLexerBlock = false;
            this._pRulesDMap = {
            };
            this._pRuleFunctionNamesMap = {
            };
            this._pSymbolsWithNodesMap = {
            };
            var i = 0;
            var j = 0;

            var isAllNodeMode = bf.testAll(this._eParseMode, EParseMode.k_AllNode);
            var isNegateMode = bf.testAll(this._eParseMode, EParseMode.k_Negate);
            var isAddMode = bf.testAll(this._eParseMode, EParseMode.k_Add);
            var pSymbolsWithNodeMap = this._pSymbolsWithNodesMap;
            for(i = 0; i < pAllRuleList.length; i++) {
                if(pAllRuleList[i] === "" || pAllRuleList[i] === "\r") {
                    continue;
                }
                pTempRule = pAllRuleList[i].split(/\s* \s*/);
                if(isLexerBlock) {
                    if((pTempRule.length === 3 || (pTempRule.length === 4 && pTempRule[3] === "")) && ((pTempRule[2][0] === "\"" || pTempRule[2][0] === "'") && pTempRule[2].length > 3)) {
                        if(pTempRule[2][0] !== pTempRule[2][pTempRule[2].length - 1]) {
                            this.error(ESyntaxErrorCode.k_GrammarUnexpectedSymbol);
                        }
                        pTempRule[2] = pTempRule[2].slice(1, pTempRule[2].length - 1);
                        var ch = pTempRule[2][0];
                        if((ch === '_') || (ch >= 'a' && ch <= 'z') || (ch >= 'A' && ch <= 'Z')) {
                            this._pLexer.addKeyword(pTempRule[2], pTempRule[0]);
                        } else {
                            this._pLexer.addPunctuator(pTempRule[2], pTempRule[0]);
                        }
                    }
                    continue;
                }
                if(pTempRule[0] === LEXER_RULES) {
                    isLexerBlock = true;
                    continue;
                }
                if(isDef(this._pRulesDMap[pTempRule[0]]) === false) {
                    this._pRulesDMap[pTempRule[0]] = {
                    };
                }
                pRule = {
                    left: pTempRule[0],
                    right: [],
                    index: 0
                };
                this._pSymbols[pTempRule[0]] = true;
                if(isAllNodeMode) {
                    pSymbolsWithNodeMap[pTempRule[0]] = ENodeCreateMode.k_Default;
                } else {
                    if(isNegateMode && !isDef(pSymbolsWithNodeMap[pTempRule[0]])) {
                        pSymbolsWithNodeMap[pTempRule[0]] = ENodeCreateMode.k_Default;
                    } else {
                        if(isAddMode && !isDef(pSymbolsWithNodeMap[pTempRule[0]])) {
                            pSymbolsWithNodeMap[pTempRule[0]] = ENodeCreateMode.k_Not;
                        }
                    }
                }
                for(j = 2; j < pTempRule.length; j++) {
                    if(pTempRule[j] === "") {
                        continue;
                    }
                    if(pTempRule[j] === FLAG_RULE_CREATE_NODE) {
                        if(isAddMode) {
                            pSymbolsWithNodeMap[pTempRule[0]] = ENodeCreateMode.k_Necessary;
                        }
                        continue;
                    }
                    if(pTempRule[j] === FLAG_RULE_NOT_CREATE_NODE) {
                        if(isNegateMode && !isAllNodeMode) {
                            pSymbolsWithNodeMap[pTempRule[0]] = ENodeCreateMode.k_Not;
                        }
                        continue;
                    }
                    if(pTempRule[j] === FLAG_RULE_FUNCTION) {
                        if((!pTempRule[j + 1] || pTempRule[j + 1].length === 0)) {
                            this.error(ESyntaxErrorCode.k_GrammarBadAdditionalFunctionName);
                        }
                        this._pRuleFunctionNamesMap[this._nRules] = pTempRule[j + 1];
                        j++;
                        continue;
                    }
                    if(pTempRule[j][0] === "'" || pTempRule[j][0] === "\"") {
                        if(pTempRule[j].length !== 3) {
                            this.error(ESyntaxErrorCode.k_GrammarBadKeyword);
                        }
                        if(pTempRule[j][0] !== pTempRule[j][2]) {
                            this.error(ESyntaxErrorCode.k_GrammarUnexpectedSymbol);
                        }
                        var sName = this._pLexer.addPunctuator(pTempRule[j][1]);
                        pRule.right.push(sName);
                        this._pSymbols[sName] = true;
                    } else {
                        pRule.right.push(pTempRule[j]);
                        this._pSymbols[pTempRule[j]] = true;
                    }
                }
                pRule.index = this._nRules;
                this._pRulesDMap[pTempRule[0]][pRule.index] = pRule;
                this._nRules += 1;
            }
        };
        Parser.prototype.generateFirstState = function (eType) {
            if(eType === EParserType.k_LR0) {
                this.generateFirstState_LR0();
            } else {
                this.generateFirstState_LR();
            }
        };
        Parser.prototype.generateFirstState_LR0 = function () {
            var pState = new State();
            var pItem = new Item(this._pRulesDMap[START_SYMBOL][0], 0);
            this.pushBaseItem(pItem);
            pState.push(pItem);
            this.closure_LR0(pState);
            this.pushState(pState);
        };
        Parser.prototype.generateFirstState_LR = function () {
            var pState = new State();
            var pExpected = {
            };
            pExpected[END_SYMBOL] = true;
            pState.push(new Item(this._pRulesDMap[START_SYMBOL][0], 0, pExpected));
            this.closure_LR(pState);
            this.pushState(pState);
        };
        Parser.prototype.closure = function (pState, eType) {
            if(eType === EParserType.k_LR0) {
                return this.closure_LR0(pState);
            } else {
                this.closure_LR(pState);
            }
        };
        Parser.prototype.closure_LR0 = function (pState) {
            var pItemList = pState.items;
            var i = 0;
            var j;

            var sSymbol;
            for(i = 0; i < pItemList.length; i++) {
                sSymbol = pItemList[i].mark();
                if(sSymbol !== END_POSITION && (!this.isTerminal(sSymbol))) {
                    for(j in this._pRulesDMap[sSymbol]) {
                        pState.tryPush_LR0(this._pRulesDMap[sSymbol][j], 0);
                    }
                }
            }
            return pState;
        };
        Parser.prototype.closure_LR = function (pState) {
            var pItemList = (pState.items);
            var i = 0;
            var j;
            var k;

            var sSymbol;
            var pSymbols;
            var pTempSet;
            var isNewExpected = false;
            while(true) {
                if(i === pItemList.length) {
                    if(!isNewExpected) {
                        break;
                    }
                    i = 0;
                    isNewExpected = false;
                }
                sSymbol = pItemList[i].mark();
                if(sSymbol !== END_POSITION && (!this.isTerminal(sSymbol))) {
                    pTempSet = pItemList[i].rule.right.slice(pItemList[i].position + 1);
                    pSymbols = this.firstTerminalForSet(pTempSet, pItemList[i].expectedSymbols);
                    for(j in this._pRulesDMap[sSymbol]) {
                        for(k in pSymbols) {
                            if(pState.tryPush_LR(this._pRulesDMap[sSymbol][j], 0, k)) {
                                isNewExpected = true;
                            }
                        }
                    }
                }
                i++;
            }
            return pState;
        };
        Parser.prototype.nexeState = function (pState, sSymbol, eType) {
            if(eType === EParserType.k_LR0) {
                return this.nextState_LR0(pState, sSymbol);
            } else {
                return this.nextState_LR(pState, sSymbol);
            }
        };
        Parser.prototype.nextState_LR0 = function (pState, sSymbol) {
            var pItemList = pState.items;
            var i = 0;
            var pNewState = new State();
            for(i = 0; i < pItemList.length; i++) {
                if(sSymbol === pItemList[i].mark()) {
                    pNewState.push(new Item(pItemList[i].rule, pItemList[i].position + 1));
                }
            }
            return pNewState;
        };
        Parser.prototype.nextState_LR = function (pState, sSymbol) {
            var pItemList = pState.items;
            var i = 0;
            var pNewState = new State();
            for(i = 0; i < pItemList.length; i++) {
                if(sSymbol === pItemList[i].mark()) {
                    pNewState.push(new Item(pItemList[i].rule, pItemList[i].position + 1, pItemList[i].expectedSymbols));
                }
            }
            return pNewState;
        };
        Parser.prototype.deleteNotBaseItems = function () {
            var i = 0;
            for(i = 0; i < this._pStateList.length; i++) {
                this._pStateList[i].deleteNotBase();
            }
        };
        Parser.prototype.closureForItem = function (pRule, iPos) {
            var sIndex = "";
            sIndex += pRule.index + "_" + iPos;
            var pState = this._pStatesTempMap[sIndex];
            if(isDef(pState)) {
                return pState;
            } else {
                var pExpected = {
                };
                pExpected[UNUSED_SYMBOL] = true;
                pState = new State();
                pState.push(new Item(pRule, iPos, pExpected));
                this.closure_LR(pState);
                this._pStatesTempMap[sIndex] = pState;
                return pState;
            }
        };
        Parser.prototype.addLinkExpected = function (pItem, pItemX) {
            var pTable = this._pExpectedExtensionDMap;
            var iIndex = pItem.index;
            if(!isDef(pTable[iIndex])) {
                pTable[iIndex] = {
                };
            }
            pTable[iIndex][pItemX.index] = true;
        };
        Parser.prototype.determineExpected = function (pTestState, sSymbol) {
            var pStateX = pTestState.getNextStateBySymbol(sSymbol);
            if(isNull(pStateX)) {
                return;
            }
            var pItemListX = pStateX.items;
            var pItemList = pTestState.items;
            var pState;
            var pItem;
            var i;
            var j;
            var k;

            var nBaseItemTest = pTestState.numBaseItems;
            var nBaseItemX = pStateX.numBaseItems;
            for(i = 0; i < nBaseItemTest; i++) {
                pState = this.closureForItem(pItemList[i].rule, pItemList[i].position);
                for(j = 0; j < nBaseItemX; j++) {
                    pItem = pState.hasChildItem(pItemListX[j]);
                    if(pItem) {
                        var pExpected = pItem.expectedSymbols;
                        for(k in pExpected) {
                            if(k === UNUSED_SYMBOL) {
                                this.addLinkExpected(pItemList[i], pItemListX[j]);
                            } else {
                                pItemListX[j].addExpected(k);
                            }
                        }
                    }
                }
            }
        };
        Parser.prototype.generateLinksExpected = function () {
            var i;
            var j;

            var pStates = this._pStateList;
            for(i = 0; i < pStates.length; i++) {
                for(j in this._pSymbols) {
                    this.determineExpected(pStates[i], j);
                }
            }
        };
        Parser.prototype.expandExpected = function () {
            var pItemList = this._pBaseItemList;
            var pTable = this._pExpectedExtensionDMap;
            var i = 0;
            var j;

            var sSymbol;
            var isNewExpected = false;
            pItemList[0].addExpected(END_SYMBOL);
            pItemList[0].isNewExpected = true;
            while(true) {
                if(i === pItemList.length) {
                    if(!isNewExpected) {
                        break;
                    }
                    isNewExpected = false;
                    i = 0;
                }
                if(pItemList[i].isNewExpected) {
                    var pExpected = pItemList[i].expectedSymbols;
                    for(sSymbol in pExpected) {
                        for(j in pTable[i]) {
                            if(pItemList[j].addExpected(sSymbol)) {
                                isNewExpected = true;
                            }
                        }
                    }
                }
                pItemList[i].isNewExpected = false;
                i++;
            }
        };
        Parser.prototype.generateStates = function (eType) {
            if(eType === EParserType.k_LR0) {
                this.generateStates_LR0();
            } else {
                if(eType === EParserType.k_LR1) {
                    this.generateStates_LR();
                } else {
                    if(eType === EParserType.k_LALR) {
                        this.generateStates_LALR();
                    }
                }
            }
        };
        Parser.prototype.generateStates_LR0 = function () {
            this.generateFirstState_LR0();
            var i;
            var pStateList = this._pStateList;
            var sSymbol;
            var pState;
            for(i = 0; i < pStateList.length; i++) {
                for(sSymbol in this._pSymbols) {
                    pState = this.nextState_LR0(pStateList[i], sSymbol);
                    if(!pState.isEmpty()) {
                        pState = this.tryAddState(pState, EParserType.k_LR0);
                        this.addStateLink(pStateList[i], pState, sSymbol);
                    }
                }
            }
        };
        Parser.prototype.generateStates_LR = function () {
            this._pFirstTerminalsDMap = {
            };
            this.generateFirstState_LR();
            var i;
            var pStateList = this._pStateList;
            var sSymbol;
            var pState;
            for(i = 0; i < pStateList.length; i++) {
                for(sSymbol in this._pSymbols) {
                    pState = this.nextState_LR(pStateList[i], sSymbol);
                    if(!pState.isEmpty()) {
                        pState = this.tryAddState(pState, EParserType.k_LR1);
                        this.addStateLink(pStateList[i], pState, sSymbol);
                    }
                }
            }
        };
        Parser.prototype.generateStates_LALR = function () {
            this._pStatesTempMap = {
            };
            this._pBaseItemList = [];
            this._pExpectedExtensionDMap = {
            };
            this._pFirstTerminalsDMap = {
            };
            this.generateStates_LR0();
            this.deleteNotBaseItems();
            this.generateLinksExpected();
            this.expandExpected();
            var i = 0;
            var pStateList = this._pStateList;
            for(i = 0; i < pStateList.length; i++) {
                this.closure_LR(pStateList[i]);
            }
        };
        Parser.prototype.calcBaseItem = function () {
            var num = 0;
            var i = 0;
            for(i = 0; i < this._pStateList.length; i++) {
                num += this._pStateList[i].numBaseItems;
            }
            return num;
        };
        Parser.prototype.printStates = function (isBase) {
            var sMsg = "";
            var i = 0;
            for(i = 0; i < this._pStateList.length; i++) {
                sMsg += this.printState(this._pStateList[i], isBase);
                sMsg += " ";
            }
            return sMsg;
        };
        Parser.prototype.printState = function (pState, isBase) {
            var sMsg = pState.toString(isBase);
            return sMsg;
        };
        Parser.prototype.printExpectedTable = function () {
            var i;
            var j;

            var sMsg = "";
            for(i in this._pExpectedExtensionDMap) {
                sMsg += "State " + this._pBaseItemList[i].state.index + ":   ";
                sMsg += this._pBaseItemList[i].toString() + "  |----->\n";
                for(j in this._pExpectedExtensionDMap[i]) {
                    sMsg += "\t\t\t\t\t" + "State " + this._pBaseItemList[j].state.index + ":   ";
                    sMsg += this._pBaseItemList[j].toString() + "\n";
                }
                sMsg += "\n";
            }
            return sMsg;
        };
        Parser.prototype.addReducing = function (pState) {
            var i;
            var j;

            var pItemList = pState.items;
            for(i = 0; i < pItemList.length; i++) {
                if(pItemList[i].mark() === END_POSITION) {
                    if(pItemList[i].rule.left === START_SYMBOL) {
                        this.pushInSyntaxTable(pState.index, END_SYMBOL, this._pSuccessOperation);
                    } else {
                        var pExpected = pItemList[i].expectedSymbols;
                        for(j in pExpected) {
                            this.pushInSyntaxTable(pState.index, j, this._pReduceOperationsMap[pItemList[i].rule.index]);
                        }
                    }
                }
            }
        };
        Parser.prototype.addShift = function (pState) {
            var i;
            var pStateMap = pState.nextStates;
            for(i in pStateMap) {
                this.pushInSyntaxTable(pState.index, i, this._pShiftOperationsMap[pStateMap[i].index]);
            }
        };
        Parser.prototype.buildSyntaxTable = function () {
            this._pStateList = [];
            var pStateList = this._pStateList;
            var pState;
            this.generateStates(this._eType);
            this._pSyntaxTable = {
            };
            this._pReduceOperationsMap = {
            };
            this._pShiftOperationsMap = {
            };
            this._pSuccessOperation = {
                type: EOperationType.k_Success
            };
            var i = 0;
            var j;
            var k;

            for(i = 0; i < pStateList.length; i++) {
                this._pShiftOperationsMap[pStateList[i].index] = {
                    type: EOperationType.k_Shift,
                    index: pStateList[i].index
                };
            }
            for(j in this._pRulesDMap) {
                for(k in this._pRulesDMap[j]) {
                    this._pReduceOperationsMap[k] = {
                        type: EOperationType.k_Reduce,
                        rule: this._pRulesDMap[j][k]
                    };
                }
            }
            for(var i = 0; i < pStateList.length; i++) {
                pState = pStateList[i];
                this.addReducing(pState);
                this.addShift(pState);
            }
        };
        Parser.prototype.readToken = function () {
            return this._pLexer.getNextToken();
        };
        Parser.prototype.ruleAction = function (pRule) {
            this._pSyntaxTree.reduceByRule(pRule, this._pSymbolsWithNodesMap[pRule.left]);
            var sActionName = this._pRuleFunctionNamesMap[pRule.index];
            if(isDef(sActionName)) {
                return (this._pAdditionalFunctionsMap[sActionName]).call(this, pRule);
            }
            return EOperationType.k_Ok;
        };
        Parser.prototype.defaultInit = function () {
            this._iIndex = 0;
            this._pStack = [
                0
            ];
            this._pSyntaxTree = new ParseTree();
            this._pTypeIdMap = {
            };
        };
        Parser.prototype.resumeParse = function () {
            try  {
                var pTree = this._pSyntaxTree;
                var pStack = this._pStack;
                var pSyntaxTable = this._pSyntaxTable;
                var isStop = false;
                var isError = false;
                var isPause = false;
                var pToken = this._pToken;
                var pOperation;
                var iRuleLength;
                while(!isStop) {
                    pOperation = pSyntaxTable[pStack[pStack.length - 1]][pToken.name];
                    if(isDef(pOperation)) {
                        switch(pOperation.type) {
                            case EOperationType.k_Success: {
                                isStop = true;
                                break;

                            }
                            case EOperationType.k_Shift: {
                                pStack.push(pOperation.index);
                                pTree.addNode(pToken);
                                pToken = this.readToken();
                                break;

                            }
                            case EOperationType.k_Reduce: {
                                iRuleLength = pOperation.rule.right.length;
                                pStack.length -= iRuleLength;
                                pStack.push(pSyntaxTable[pStack[pStack.length - 1]][pOperation.rule.left].index);
                                if(this.ruleAction(pOperation.rule) === EOperationType.k_Pause) {
                                    this._pToken = pToken;
                                    isStop = true;
                                    isPause = true;
                                }
                                break;

                            }
                        }
                    } else {
                        isError = true;
                        isStop = true;
                    }
                }
                if(isPause) {
                    return EParserCode.k_Pause;
                }
                if(!isError) {
                    pTree.setRoot();
                    if(isDef(this._fnFinishCallback)) {
                        this._fnFinishCallback.call(this._pCaller, EParserCode.k_Ok);
                    }
                    return EParserCode.k_Ok;
                } else {
                    this.error(ESyntaxErrorCode.k_SyntaxError);
                    if(isDef(this._fnFinishCallback)) {
                        this._fnFinishCallback.call(this._pCaller, EParserCode.k_Error);
                    }
                    return EParserCode.k_Error;
                }
            } catch (e) {
                return EParserCode.k_Error;
            }
        };
        return Parser;
    })();
    akra.Parser = Parser;    
})(akra || (akra = {}));
