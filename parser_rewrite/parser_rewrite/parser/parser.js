var __extends = this.__extends || function (d, b) {
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var akra;
(function (akra) {
    var END_POSITION = "END";
    var T_EMPTY = "EMPTY";
    var UNKNOWN_TOKEN = "UNNOWN";
    var END_SYMBOL = "$";
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
    })(EOperationType || (EOperationType = {}));
    var EItemType;
    (function (EItemType) {
        EItemType._map = [];
        EItemType.k_LR0 = 1;
        EItemType._map[2] = "k_LR";
        EItemType.k_LR = 2;
    })(EItemType || (EItemType = {}));
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
    var EParseCode;
    (function (EParseCode) {
        EParseCode._map = [];
        EParseCode._map[0] = "k_Pause";
        EParseCode.k_Pause = 0;
        EParseCode._map[1] = "k_Ok";
        EParseCode.k_Ok = 1;
        EParseCode._map[2] = "k_Error";
        EParseCode.k_Error = 2;
    })(EParseCode || (EParseCode = {}));
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
        ESyntaxErrorCode.k_Lexer = 200;
        ESyntaxErrorCode._map[201] = "k_UnknownToken";
        ESyntaxErrorCode.k_UnknownToken = 201;
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
        function Item(pRule, iPos) {
            this._pRule = pRule;
            this._iPos = iPos;
            this._iIndex = 0;
            this._pState = null;
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
        Item.prototype.isEqual = function (pItem) {
            return (this._pRule === pItem.rule && this._iPos === pItem.position);
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
        Item.prototype.toString = function () {
            var sMsg = this._pRule.left + " -> ";
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
            sMsg = sMsg.slice(0, sMsg.length - 1);
            return sMsg;
        };
        return Item;
    })();    
    var ItemLR = (function (_super) {
        __extends(ItemLR, _super);
        function ItemLR(pRule, iPos) {
                _super.call(this, pRule, iPos);
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
        Object.defineProperty(ItemLR.prototype, "expectedSymbols", {
            get: function () {
                return this._pExpected;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ItemLR.prototype, "length", {
            get: function () {
                return this._iLength;
            },
            enumerable: true,
            configurable: true
        });
        ItemLR.prototype.isEqual = function (pItem, eType) {
            if (typeof eType === "undefined") { eType = EItemType.k_LR0; }
            if(eType === EItemType.k_LR0) {
                return (this._pRule === pItem.rule && this._iPos === pItem.position);
            } else {
                if(eType === EItemType.k_LR) {
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
        ItemLR.prototype.isExpected = function (sSymbol) {
            return !!(this._pExpected[sSymbol]);
        };
        ItemLR.prototype.addExpected = function (sSymbol) {
            if(this._pExpected[sSymbol]) {
                return false;
            }
            this._pExpected[sSymbol] = true;
            this._isNewExpected = true;
            this._iLength++;
            return true;
        };
        ItemLR.prototype.toString = function () {
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
            sExpected = ", ";
            for(var l in this._pExpected) {
                sExpected += l + "/";
            }
            if(sExpected !== ", ") {
                sMsg += sExpected;
            }
            sMsg = sMsg.slice(0, sMsg.length - 1);
            return sMsg;
        };
        return ItemLR;
    })(Item);    
    var State = (function () {
        function State() {
            this._pItems = [];
            this._pNextStates = {
            };
            this._iIndex = 0;
            this._nBaseItems = 0;
        }
        Object.defineProperty(State.prototype, "items", {
            get: function () {
                return this._pItems;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(State.prototype, "baseItems", {
            get: function () {
                return this._nBaseItems;
            },
            enumerable: true,
            configurable: true
        });
        State.prototype.hasItem = function (pItem) {
            var i;
            var pItems = this._pItems;
            for(i = 0; i < pItems.length; i++) {
                if(pItems[i].isEqual(pItem)) {
                    return pItems[i];
                }
            }
            return null;
        };
        State.prototype.hasParentItem = function (pItem) {
            var i;
            var pItems = this._pItems;
            for(i = 0; i < pItems.length; i++) {
                if(pItems[i].isParentItem(pItem)) {
                    return pItems[i];
                }
            }
            return null;
        };
        State.prototype.hasChildItem = function (pItem) {
            var i;
            var pItems = this._pItems;
            for(i = 0; i < pItems.length; i++) {
                if(pItems[i].isChildItem(pItem)) {
                    return pItems[i];
                }
            }
            return null;
        };
        State.prototype.isEmpty = function () {
            return !(this._pItems.length);
        };
        State.prototype.isEqual = function (pState, eType) {
            var pItemsA = this._pItems;
            var pItemsB = pState.items;
            if(this._nBaseItems !== pState.baseItems) {
                return false;
            }
            var nItems = this._nBaseItems;
            var i;
            var j;

            var isEqual;
            for(i = 0; i < nItems; i++) {
                isEqual = false;
                for(j = 0; j < nItems; j++) {
                    if((pItemsA[i]).isEqual(pItemsB[j], eType)) {
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
            if(this._pItems.length === 0 || pItem.position > 0) {
                this._nBaseItems += 1;
            }
            pItem.state = this;
            this._pItems.push(pItem);
        };
        State.prototype.tryPush_LR0 = function (pRule, iPos) {
            var i;
            var pItems = this._pItems;
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
            var pItems = (this._pItems);
            for(i = 0; i < pItems.length; i++) {
                if(pItems[i].rule === pRule && pItems[i].position === iPos) {
                    return pItems[i].addExpected(sExpectedSymbol);
                }
            }
            var pExpected = {
            };
            pExpected[sExpectedSymbol] = true;
            var pItem = new ItemLR(pRule, iPos, pExpected);
            this.push(pItem);
            return true;
        };
        State.prototype.deleteNotBase = function () {
            this._pItems.length = this._nBaseItems;
        };
        return State;
    })();    
    var Operation = (function () {
        function Operation() {
            if(arguments.length === 0) {
                this._eType = EOperationType.k_Error;
            } else {
                if(arguments.length === 2 && arguments[0] === EOperationType.k_Shift) {
                    this._eType = EOperationType.k_Shift;
                    this._iIndex = arguments[1];
                } else {
                    if(arguments.length === 2 && arguments[0] === EOperationType.k_Reduce) {
                        this._eType = EOperationType.k_Reduce;
                        this._pRule = arguments[1];
                    }
                }
            }
        }
        Object.defineProperty(Operation.prototype, "type", {
            get: function () {
                return this._eType;
            },
            set: function (eType) {
                this._eType = eType;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Operation.prototype, "rule", {
            get: function () {
                return this._pRule;
            },
            set: function (pRule) {
                this._pRule = pRule;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Operation.prototype, "index", {
            get: function () {
                return this._iIndex;
            },
            set: function (iIndex) {
                this._iIndex = iIndex;
            },
            enumerable: true,
            configurable: true
        });
        return Operation;
    })();    
    var Rule = (function () {
        function Rule() {
            this._sLeft = "";
            this._pRight = [];
            this._iIndex = 0;
        }
        Object.defineProperty(Rule.prototype, "left", {
            get: function () {
                return this._sLeft;
            },
            set: function (sLeft) {
                this._sLeft = sLeft;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Rule.prototype, "right", {
            get: function () {
                return this._pRight;
            },
            set: function (pRight) {
                this._pRight = pRight;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Rule.prototype, "index", {
            get: function () {
                return this._iIndex;
            },
            set: function (iIndex) {
                this._iIndex = iIndex;
            },
            enumerable: true,
            configurable: true
        });
        return Rule;
    })();    
    var ParseTree = (function () {
        function ParseTree() {
            this._pRoot = null;
            this._pNodes = [];
            this._pNodesCountStack = [];
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
        ParseTree.prototype.addNode = function (pNode) {
            this._pNodes.push(pNode);
            this._pNodesCountStack.push(1);
        };
        ParseTree.prototype.reduceByRule = function (pRule, eCreate, isOptimize) {
            if (typeof eCreate === "undefined") { eCreate = ENodeCreateMode.k_Default; }
            if (typeof isOptimize === "undefined") { isOptimize = false; }
            var iReduceCount = 0;
            var pNodesCountStack = this._pNodesCountStack;
            var pNode;
            var iRuleLength = pRule.right.length;
            var pNodes = this._pNodes;
            var nOptimize = isOptimize ? 1 : 0;
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
                    this._addLink(pNode, pNodes.pop());
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
                return this._toStringNode(this._pRoot);
            } else {
                return "";
            }
        };
        ParseTree.prototype.clone = function () {
            var pTree = new ParseTree();
            pTree.root = this._cloneNode(this._pRoot);
            return pTree;
        };
        ParseTree.prototype._addLink = function (pParent, pNode) {
            if(!pParent.children) {
                pParent.children = [];
            }
            pParent.children.push(pParent);
            pNode.parent = pParent;
        };
        ParseTree.prototype._cloneNode = function (pNode) {
            var pNewNode;
            pNewNode = {
                name: pNode.name,
                value: pNode.value,
                children: null,
                parent: null
            };
            var pChildren = pNode.children;
            for(var i = 0; pChildren && i < pChildren.length; i++) {
                this._addLink(pNewNode, this._cloneNode(pChildren[i]));
            }
            return pNewNode;
        };
        ParseTree.prototype._toStringNode = function (pNode, sPadding) {
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
                        sRes += this._toStringNode(pChildren[i], sPadding);
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
            var ch = this._currentChar();
            if(!ch) {
                return {
                    name: END_SYMBOL,
                    value: END_SYMBOL,
                    start: this._iColumnNumber,
                    end: this._iColumnNumber,
                    line: this._iLineNumber
                };
            }
            var eType = this._identityTokenType();
            var pToken;
            switch(eType) {
                case ETokenType.k_NumericLiteral: {
                    pToken = this._scanNumber();
                    break;

                }
                case ETokenType.k_CommentLiteral: {
                    this._scanComment();
                    pToken = this.getNextToken();
                    break;

                }
                case ETokenType.k_StringLiteral: {
                    pToken = this._scanString();
                    break;

                }
                case ETokenType.k_PunctuatorLiteral: {
                    pToken = this._scanPunctuator();
                    break;

                }
                case ETokenType.k_IdentifierLiteral: {
                    pToken = this._scanIdentifier();
                    break;

                }
                case ETokenType.k_WhitespaceLiteral: {
                    this._scanWhiteSpace();
                    pToken = this.getNextToken();
                    break;

                }
                default: {
                    this._error(ESyntaxErrorCode.k_UnknownToken, {
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
        Lexer.prototype._error = function (eCode, pToken) {
        };
        Lexer.prototype._identityTokenType = function () {
            if(this._isIdentifierStart()) {
                return ETokenType.k_IdentifierLiteral;
            }
            if(this._isWhiteSpaceStart()) {
                return ETokenType.k_WhitespaceLiteral;
            }
            if(this._isStringStart()) {
                return ETokenType.k_StringLiteral;
            }
            if(this._isCommentStart()) {
                return ETokenType.k_CommentLiteral;
            }
            if(this._isNumberStart()) {
                return ETokenType.k_NumericLiteral;
            }
            if(this._isPunctuatorStart()) {
                return ETokenType.k_PunctuatorLiteral;
            }
            return ETokenType.k_Unknown;
        };
        Lexer.prototype._isNumberStart = function () {
            var ch = this._currentChar();
            if((ch >= '0') && (ch <= '9')) {
                return true;
            }
            var ch1 = this._nextChar();
            if(ch === "." && (ch1 >= '0') && (ch1 <= '9')) {
                return true;
            }
            return false;
        };
        Lexer.prototype._isCommentStart = function () {
            var ch = this._currentChar();
            var ch1 = this._nextChar();
            if(ch === "/" && (ch1 === "/" || ch1 === "*")) {
                return true;
            }
            return false;
        };
        Lexer.prototype._isStringStart = function () {
            var ch = this._currentChar();
            if(ch === "\"" || ch === "'") {
                return true;
            }
            return false;
        };
        Lexer.prototype._isPunctuatorStart = function () {
            var ch = this._currentChar();
            if(this._pPunctuatorsFirstSymbols[ch]) {
                return true;
            }
            return false;
        };
        Lexer.prototype._isWhiteSpaceStart = function () {
            var ch = this._currentChar();
            if(ch === ' ' || ch === '\n' || ch === '\r' || ch === '\t') {
                return true;
            }
            return false;
        };
        Lexer.prototype._isIdentifierStart = function () {
            var ch = this._currentChar();
            if((ch === '_') || (ch >= 'a' && ch <= 'z') || (ch >= 'A' && ch <= 'Z')) {
                return true;
            }
            return false;
        };
        Lexer.prototype._isLineTerminator = function (sSymbol) {
            return (sSymbol === '\n' || sSymbol === '\r' || sSymbol === '\u2028' || sSymbol === '\u2029');
        };
        Lexer.prototype._isWhiteSpace = function (sSymbol) {
            return (sSymbol === ' ') || (sSymbol === '\t');
        };
        Lexer.prototype._isKeyword = function (sValue) {
            return !!(this._pKeywordsMap[sValue]);
        };
        Lexer.prototype._isPunctuator = function (sValue) {
            return !!(this._pPunctuatorsMap[sValue]);
        };
        Lexer.prototype._nextChar = function () {
            return this._sSource[this._iIndex + 1];
        };
        Lexer.prototype._currentChar = function () {
            return this._sSource[this._iIndex];
        };
        Lexer.prototype._readNextChar = function () {
            this._iIndex++;
            this._iColumnNumber++;
            return this._sSource[this._iIndex];
        };
        Lexer.prototype._scanString = function () {
            return {
            };
        };
        Lexer.prototype._scanPunctuator = function () {
            return {
            };
        };
        Lexer.prototype._scanNumber = function () {
            return {
            };
        };
        Lexer.prototype._scanIdentifier = function () {
            return {
            };
        };
        Lexer.prototype._scanWhiteSpace = function () {
            return true;
        };
        Lexer.prototype._scanComment = function () {
            return true;
        };
        return Lexer;
    })();
    akra.Lexer = Lexer;    
})(akra || (akra = {}));
