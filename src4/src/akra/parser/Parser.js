var akra;
(function (akra) {
    /// <reference path="../idl/parser/IParser.ts" />
    /// <reference path="../idl/IMap.ts" />
    /// <reference path="../bf/bf.ts" />
    /// <reference path="../logger.ts" />
    /// <reference path="Lexer.ts" />
    /// <reference path="ParseTree.ts" />
    /// <reference path="Item.ts" />
    /// <reference path="State.ts" />
    /// <reference path="symbols.ts" />
    (function (parser) {
        /** @const */
        var PARSER_GRAMMAR_ADD_OPERATION = 2001;

        /** @const */
        var PARSER_GRAMMAR_ADD_STATE_LINK = 2002;

        /** @const */
        var PARSER_GRAMMAR_UNEXPECTED_SYMBOL = 2003;

        /** @const */
        var PARSER_GRAMMAR_BAD_ADDITIONAL_FUNC_NAME = 2004;

        /** @const */
        var PARSER_GRAMMAR_BAD_KEYWORD = 2005;

        /** @const */
        var PARSER_SYNTAX_ERROR = 2051;

        akra.logger.registerCode(PARSER_GRAMMAR_ADD_OPERATION, "Grammar not LALR(1)! Cannot to generate syntax table. Add operation error.\n" + "Conflict in state with index: {stateIndex}. With grammar symbol: \"{grammarSymbol}\"\n" + "Old operation: {oldOperation}\n" + "New operation: {newOperation}\n" + "For more info init parser in debug-mode and see syntax table and list of states.");

        akra.logger.registerCode(PARSER_GRAMMAR_ADD_STATE_LINK, "Grammar not LALR(1)! Cannot to generate syntax table. Add state link error.\n" + "Conflict in state with index: {stateIndex}. With grammar symbol: \"{grammarSymbol}\"\n" + "Old next state: {oldNextStateIndex}\n" + "New next state: {newNextStateIndex}\n" + "For more info init parser in debug-mode and see syntax table and list of states.");

        akra.logger.registerCode(PARSER_GRAMMAR_UNEXPECTED_SYMBOL, "Grammar error. Can`t generate rules from grammar\n" + "Unexpected symbol: {unexpectedSymbol}\n" + "Expected: {expectedSymbol}");

        akra.logger.registerCode(PARSER_GRAMMAR_BAD_ADDITIONAL_FUNC_NAME, "Grammar error. Empty additional function name.");
        akra.logger.registerCode(PARSER_GRAMMAR_BAD_KEYWORD, "Grammar error. Bad keyword: {badKeyword}\n" + "All keyword must be define in lexer rule block.");

        akra.logger.registerCode(PARSER_SYNTAX_ERROR, "Syntax error during parsing. Token: {tokenValue}\n" + "Line: {line}. Column: {column}.");

        function sourceLocationToString(pLocation) {
            var sLocation = "[" + pLocation.file + ":" + pLocation.line.toString() + "]: ";
            return sLocation;
        }

        function syntaxErrorLogRoutine(pLogEntity) {
            var sPosition = sourceLocationToString(pLogEntity.location);
            var sError = "Code: " + pLogEntity.code.toString() + ". ";
            var pParseMessage = pLogEntity.message.split(/\{(\w+)\}/);
            var pInfo = pLogEntity.info;

            for (var i = 0; i < pParseMessage.length; i++) {
                if (akra.isDef(pInfo[pParseMessage[i]])) {
                    pParseMessage[i] = pInfo[pParseMessage[i]];
                }
            }

            var sMessage = sPosition + sError + pParseMessage.join("");

            console.error.call(console, sMessage);
        }

        akra.logger.setCodeFamilyRoutine("ParserSyntaxErrors", syntaxErrorLogRoutine, akra.ELogLevel.ERROR);

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

                this._pSymbolMap = { END_SYMBOL: true };
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

                this._eType = parser.EParserType.k_LR0;

                this._pRuleCreationModeMap = null;
                this._eParseMode = parser.EParseMode.k_AllNode;

                // this._isSync = false;
                this._pStatesTempMap = null;
                this._pBaseItemList = null;

                this._pExpectedExtensionDMap = null;

                this._sFileName = "stdin";
            }
            Parser.prototype.isTypeId = function (sValue) {
                return !!(this._pTypeIdMap[sValue]);
            };

            Parser.prototype.returnCode = function (pNode) {
                if (pNode) {
                    if (pNode.value) {
                        return pNode.value + " ";
                    } else if (pNode.children) {
                        var sCode = "";
                        var i = 0;
                        for (i = pNode.children.length - 1; i >= 0; i--) {
                            sCode += this.returnCode(pNode.children[i]);
                        }
                        return sCode;
                    }
                }
                return "";
            };

            Parser.prototype.init = function (sGrammar, eMode, eType) {
                if (typeof eMode === "undefined") { eMode = parser.EParseMode.k_AllNode; }
                if (typeof eType === "undefined") { eType = parser.EParserType.k_LALR; }
                try  {
                    this._eType = eType;
                    this._pLexer = new parser.Lexer(this);
                    this._eParseMode = eMode;
                    this.generateRules(sGrammar);
                    this.buildSyntaxTable();
                    this.generateFunctionByStateMap();
                    if (!akra.bf.testAll(eMode, parser.EParseMode.k_DebugMode)) {
                        this.clearMem();
                    }
                    return true;
                } catch (e) {
                    akra.logger.log(e.stack);

                    // error("Could`not initialize parser. Error with code has occurred: " + e.message + ". See log for more info.");
                    return false;
                }
            };

            Parser.prototype.parse = function (sSource, fnFinishCallback, pCaller) {
                if (typeof fnFinishCallback === "undefined") { fnFinishCallback = null; }
                if (typeof pCaller === "undefined") { pCaller = null; }
                try  {
                    this.defaultInit();
                    this._sSource = sSource;
                    this._pLexer.init(sSource);

                    //this._isSync = isSync;
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

                    var eAdditionalOperationCode;
                    var iStateIndex = 0;

                    while (!isStop) {
                        pOperation = pSyntaxTable[pStack[pStack.length - 1]][pToken.name];
                        if (akra.isDef(pOperation)) {
                            switch (pOperation.type) {
                                case parser.EOperationType.k_Success:
                                    isStop = true;
                                    break;

                                case parser.EOperationType.k_Shift:
                                    iStateIndex = pOperation.index;
                                    pStack.push(iStateIndex);
                                    pTree.addNode(pToken);

                                    eAdditionalOperationCode = this.operationAdditionalAction(iStateIndex, pToken.name);

                                    if (eAdditionalOperationCode === parser.EOperationType.k_Error) {
                                        isError = true;
                                        isStop = true;
                                    } else if (eAdditionalOperationCode === parser.EOperationType.k_Pause) {
                                        this._pToken = null;
                                        isStop = true;
                                        isPause = true;
                                    } else if (eAdditionalOperationCode === parser.EOperationType.k_Ok) {
                                        pToken = this.readToken();
                                    }

                                    break;

                                case parser.EOperationType.k_Reduce:
                                    iRuleLength = pOperation.rule.right.length;
                                    pStack.length -= iRuleLength;
                                    iStateIndex = pSyntaxTable[pStack[pStack.length - 1]][pOperation.rule.left].index;
                                    pStack.push(iStateIndex);
                                    pTree.reduceByRule(pOperation.rule, this._pRuleCreationModeMap[pOperation.rule.left]);

                                    eAdditionalOperationCode = this.operationAdditionalAction(iStateIndex, pOperation.rule.left);

                                    if (eAdditionalOperationCode === parser.EOperationType.k_Error) {
                                        isError = true;
                                        isStop = true;
                                    } else if (eAdditionalOperationCode === parser.EOperationType.k_Pause) {
                                        this._pToken = pToken;
                                        isStop = true;
                                        isPause = true;
                                    }

                                    break;
                            }
                        } else {
                            isError = true;
                            isStop = true;
                        }
                    }
                } catch (e) {
                    // debug_print(e.stack);
                    this._sFileName = "stdin";
                    return parser.EParserCode.k_Error;
                }

                if (isPause) {
                    return parser.EParserCode.k_Pause;
                }

                if (!isError) {
                    pTree.finishTree();
                    if (!akra.isNull(this._fnFinishCallback)) {
                        this._fnFinishCallback.call(this._pCaller, parser.EParserCode.k_Ok, this.getParseFileName());
                    }
                    this._sFileName = "stdin";
                    return parser.EParserCode.k_Ok;
                } else {
                    this._error(PARSER_SYNTAX_ERROR, pToken);
                    if (!akra.isNull(this._fnFinishCallback)) {
                        this._fnFinishCallback.call(this._pCaller, parser.EParserCode.k_Error, this.getParseFileName());
                    }
                    this._sFileName = "stdin";
                    return parser.EParserCode.k_Error;
                }
            };

            Parser.prototype.setParseFileName = function (sFileName) {
                this._sFileName = sFileName;
            };

            Parser.prototype.getParseFileName = function () {
                return this._sFileName;
            };

            Parser.prototype.pause = function () {
                return parser.EParserCode.k_Pause;
            };

            Parser.prototype.resume = function () {
                return this.resumeParse();
            };

            Parser.prototype.printStates = function (isBaseOnly) {
                if (typeof isBaseOnly === "undefined") { isBaseOnly = true; }
                if (!akra.isDef(this._pStateList)) {
                    akra.logger.log("It`s impossible to print states. You must init parser in debug-mode");
                    return;
                }
                var sMsg = "\n" + this.statesToString(isBaseOnly);
                akra.logger.log(sMsg);
            };

            Parser.prototype.printState = function (iStateIndex, isBaseOnly) {
                if (typeof isBaseOnly === "undefined") { isBaseOnly = true; }
                if (!akra.isDef(this._pStateList)) {
                    akra.logger.log("It`s impossible to print states. You must init parser in debug-mode");
                    return;
                }

                var pState = this._pStateList[iStateIndex];
                if (!akra.isDef(pState)) {
                    akra.logger.log("Can not print stete with index: " + iStateIndex.toString());
                    return;
                }

                var sMsg = "\n" + pState.toString(isBaseOnly);
                akra.logger.log(sMsg);
            };

            Parser.prototype.getGrammarSymbols = function () {
                return this._pGrammarSymbols;
            };

            /** inline */ Parser.prototype.getSyntaxTree = function () {
                return this._pSyntaxTree;
            };

            Parser.prototype._saveState = function () {
                return {
                    source: this._sSource,
                    index: this._pLexer._getIndex(),
                    fileName: this._sFileName,
                    tree: this._pSyntaxTree,
                    types: this._pTypeIdMap,
                    stack: this._pStack,
                    token: this._pToken,
                    fnCallback: this._fnFinishCallback,
                    caller: this._pCaller
                };
            };

            Parser.prototype._loadState = function (pState) {
                this._sSource = pState.source;
                this._iIndex = pState.index;
                this._sFileName = pState.fileName;
                this._pSyntaxTree = pState.tree;
                this._pTypeIdMap = pState.types;
                this._pStack = pState.stack;
                this._pToken = pState.token;
                this._fnFinishCallback = pState.fnCallback;
                this._pCaller = pState.caller;

                this._pLexer._setSource(pState.source);
                this._pLexer._setIndex(pState.index);
            };

            Parser.prototype.addAdditionalFunction = function (sFuncName, fnRuleFunction) {
                if (akra.isNull(this._pAdditionalFunctionsMap)) {
                    this._pAdditionalFunctionsMap = {};
                }
                this._pAdditionalFunctionsMap[sFuncName] = fnRuleFunction;
            };

            Parser.prototype.addTypeId = function (sIdentifier) {
                if (akra.isNull(this._pTypeIdMap)) {
                    this._pTypeIdMap = {};
                }
                this._pTypeIdMap[sIdentifier] = true;
            };

            Parser.prototype.defaultInit = function () {
                this._iIndex = 0;
                this._pStack = [0];
                this._pSyntaxTree = new parser.ParseTree();
                this._pTypeIdMap = {};

                this._pSyntaxTree.setOptimizeMode(akra.bf.testAll(this._eParseMode, parser.EParseMode.k_Optimize));
            };

            Parser.prototype._error = function (eCode, pErrorInfo) {
                var pLocation = {};

                var pInfo = {
                    tokenValue: null,
                    line: null,
                    column: null,
                    stateIndex: null,
                    oldNextStateIndex: null,
                    newNextStateIndex: null,
                    grammarSymbol: null,
                    newOperation: null,
                    oldOperation: null,
                    expectedSymbol: null,
                    unexpectedSymbol: null,
                    badKeyword: null
                };

                var pLogEntity = { code: eCode, info: pInfo, location: pLocation };

                var pToken;
                var iLine;
                var iColumn;
                var iStateIndex;
                var sSymbol;
                var pOldOperation;
                var pNewOperation;
                var iOldNextStateIndex;
                var iNewNextStateIndex;
                var sExpectedSymbol;
                var sUnexpectedSymbol;
                var sBadKeyword;

                if (eCode === PARSER_SYNTAX_ERROR) {
                    pToken = pErrorInfo;
                    iLine = pToken.line;
                    iColumn = pToken.start;

                    pInfo.tokenValue = pToken.value;
                    pInfo.line = iLine;
                    pInfo.column = iColumn;

                    pLocation.file = this.getParseFileName();
                    pLocation.line = iLine;
                } else if (eCode === PARSER_GRAMMAR_ADD_OPERATION) {
                    iStateIndex = pErrorInfo.stateIndex;
                    sSymbol = pErrorInfo.grammarSymbol;
                    pOldOperation = pErrorInfo.oldOperation;
                    pNewOperation = pErrorInfo.newOperation;

                    pInfo.stateIndex = iStateIndex;
                    pInfo.grammarSymbol = sSymbol;
                    pInfo.oldOperation = this.operationToString(pOldOperation);
                    pInfo.newOperation = this.operationToString(pNewOperation);

                    pLocation.file = "GRAMMAR";
                    pLocation.line = 0;
                } else if (eCode === PARSER_GRAMMAR_ADD_STATE_LINK) {
                    iStateIndex = pErrorInfo.stateIndex;
                    sSymbol = pErrorInfo.grammarSymbol;
                    iOldNextStateIndex = pErrorInfo.oldNextStateIndex;
                    iNewNextStateIndex = pErrorInfo.newNextStateIndex;

                    pInfo.stateIndex = iStateIndex;
                    pInfo.grammarSymbol = sSymbol;
                    pInfo.oldNextStateIndex = iOldNextStateIndex;
                    pInfo.newNextStateIndex = iNewNextStateIndex;

                    pLocation.file = "GRAMMAR";
                    pLocation.line = 0;
                } else if (eCode === PARSER_GRAMMAR_UNEXPECTED_SYMBOL) {
                    iLine = pErrorInfo.grammarLine;
                    sExpectedSymbol = pErrorInfo.expectedSymbol;
                    sUnexpectedSymbol = pErrorInfo.unexpectedSymbol;

                    pInfo.expectedSymbol = sExpectedSymbol;
                    pInfo.unexpectedSymbol = sExpectedSymbol;

                    pLocation.file = "GRAMMAR";
                    pLocation.line = iLine || 0;
                } else if (eCode === PARSER_GRAMMAR_BAD_ADDITIONAL_FUNC_NAME) {
                    iLine = pErrorInfo.grammarLine;

                    pLocation.file = "GRAMMAR";
                    pLocation.line = iLine || 0;
                } else if (eCode === PARSER_GRAMMAR_BAD_KEYWORD) {
                    iLine = pErrorInfo.grammarLine;
                    sBadKeyword = pErrorInfo.badKeyword;

                    pInfo.badKeyword = sBadKeyword;

                    pLocation.file = "GRAMMAR";
                    pLocation.line = iLine || 0;
                }

                akra.logger.error(pLogEntity);

                throw new Error(eCode.toString());
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

                for (i = 0; i < pStateList.length; i++) {
                    if (pStateList[i].isEqual(pState, eType)) {
                        return pStateList[i];
                    }
                }

                return null;
            };

            Parser.prototype.isTerminal = function (sSymbol) {
                return !(this._pRulesDMap[sSymbol]);
            };

            Parser.prototype.pushState = function (pState) {
                pState.setIndex(this._pStateList.length);
                this._pStateList.push(pState);
            };

            Parser.prototype.pushBaseItem = function (pItem) {
                pItem.setIndex(this._pBaseItemList.length);
                this._pBaseItemList.push(pItem);
            };

            Parser.prototype.tryAddState = function (pState, eType) {
                var pRes = this.hasState(pState, eType);

                if (akra.isNull(pRes)) {
                    if (eType === parser.EParserType.k_LR0) {
                        var pItems = pState.getItems();
                        for (var i = 0; i < pItems.length; i++) {
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
                if (this.isTerminal(sSymbol)) {
                    return false;
                }

                var pRulesDMap = this._pRulesDMap;
                for (var i in pRulesDMap[sSymbol]) {
                    if (pRulesDMap[sSymbol][i].right.length === 0) {
                        return true;
                    }
                }

                return false;
            };

            Parser.prototype.pushInSyntaxTable = function (iIndex, sSymbol, pOperation) {
                var pSyntaxTable = this._pSyntaxTable;
                if (!pSyntaxTable[iIndex]) {
                    pSyntaxTable[iIndex] = {};
                }
                if (akra.isDef(pSyntaxTable[iIndex][sSymbol])) {
                    this._error(PARSER_GRAMMAR_ADD_OPERATION, {
                        stateIndex: iIndex,
                        grammarSymbol: this.convertGrammarSymbol(sSymbol),
                        oldOperation: this._pSyntaxTable[iIndex][sSymbol],
                        newOperation: pOperation
                    });
                }
                pSyntaxTable[iIndex][sSymbol] = pOperation;
            };

            Parser.prototype.addStateLink = function (pState, pNextState, sSymbol) {
                var isAddState = pState.addNextState(sSymbol, pNextState);
                if (!isAddState) {
                    this._error(PARSER_GRAMMAR_ADD_STATE_LINK, {
                        stateIndex: pState.getIndex(),
                        oldNextStateIndex: pState.getNextStateBySymbol(sSymbol),
                        newNextStateIndex: pNextState.getIndex(),
                        grammarSymbol: this.convertGrammarSymbol(sSymbol)
                    });
                }
            };

            Parser.prototype.firstTerminal = function (sSymbol) {
                if (this.isTerminal(sSymbol)) {
                    return null;
                }

                if (akra.isDef(this._pFirstTerminalsDMap[sSymbol])) {
                    return this._pFirstTerminalsDMap[sSymbol];
                }

                var sRule, sName;
                var pNames;
                var i = 0, j = 0, k = null;
                var pRulesMap = this._pRulesDMap[sSymbol];

                var pTempRes = {};
                var pRes;

                var pRight;
                var isFinish;

                pRes = this._pFirstTerminalsDMap[sSymbol] = {};

                if (this.hasEmptyRule(sSymbol)) {
                    pRes[parser.T_EMPTY] = true;
                }

                if (akra.isNull(pRulesMap)) {
                    return pRes;
                }

                var pRuleNames = Object.keys(pRulesMap);

                for (i = 0; i < pRuleNames.length; ++i) {
                    sRule = pRuleNames[i];

                    isFinish = false;
                    pRight = pRulesMap[sRule].right;

                    for (j = 0; j < pRight.length; j++) {
                        if (pRight[j] === sSymbol) {
                            if (pRes[parser.T_EMPTY]) {
                                continue;
                            }

                            isFinish = true;
                            break;
                        }

                        pTempRes = this.firstTerminal(pRight[j]);

                        if (akra.isNull(pTempRes)) {
                            pRes[pRight[j]] = true;
                        } else {
                            for (pNames = Object.keys(pTempRes), k = 0; k < pNames.length; ++k) {
                                sName = pNames[k];
                                pRes[sName] = true;
                            }
                        }

                        if (!this.hasEmptyRule(pRight[j])) {
                            isFinish = true;
                            break;
                        }
                    }

                    if (!isFinish) {
                        pRes[parser.T_EMPTY] = true;
                    }
                }

                return pRes;
            };

            Parser.prototype.followTerminal = function (sSymbol) {
                if (akra.isDef(this._pFollowTerminalsDMap[sSymbol])) {
                    return this._pFollowTerminalsDMap[sSymbol];
                }

                var i = 0, j = 0, k = 0, l = 0, m = 0;
                var pRulesDMap = this._pRulesDMap;
                var pRulesDMapKeys, pRulesMapKeys;

                var pRule;
                var pTempRes;
                var pTempKeys;
                var pRes;

                var pRight;
                var isFinish;

                var sFirstKey;
                var sSecondKey;

                pRes = this._pFollowTerminalsDMap[sSymbol] = {};

                if (akra.isNull(pRulesDMap)) {
                    return pRes;
                }

                pRulesDMapKeys = Object.keys(pRulesDMap);
                for (i = 0; i < pRulesDMapKeys.length; i++) {
                    sFirstKey = pRulesDMapKeys[i];

                    if (akra.isNull(pRulesDMap[sFirstKey])) {
                        continue;
                    }

                    pRulesMapKeys = Object.keys(pRulesDMap[sFirstKey]);

                    for (j = 0; j < pRulesMapKeys.length; j++) {
                        pRule = pRulesDMap[sFirstKey][sSecondKey];
                        pRight = pRule.right;

                        for (k = 0; k < pRight.length; k++) {
                            if (pRight[k] === sSymbol) {
                                if (k === pRight.length - 1) {
                                    pTempRes = this.followTerminal(pRule.left);

                                    pTempKeys = Object.keys(pTempRes);
                                    for (m = 0; m < pTempKeys.length; i++) {
                                        pRes[pTempKeys[m]] = true;
                                    }
                                } else {
                                    isFinish = false;

                                    for (l = k + 1; l < pRight.length; l++) {
                                        pTempRes = this.firstTerminal(pRight[l]);

                                        if (akra.isNull(pTempRes)) {
                                            pRes[pRight[l]] = true;
                                            isFinish = true;
                                            break;
                                        } else {
                                            pTempKeys = Object.keys(pTempRes);
                                            for (m = 0; m < pTempKeys.length; i++) {
                                                pRes[pTempKeys[m]] = true;
                                            }
                                        }

                                        if (!pTempRes[parser.T_EMPTY]) {
                                            isFinish = true;
                                            break;
                                        }
                                    }

                                    if (!isFinish) {
                                        pTempRes = this.followTerminal(pRule.left);

                                        pTempKeys = Object.keys(pTempRes);
                                        for (m = 0; m < pTempKeys.length; i++) {
                                            pRes[pTempKeys[m]] = true;
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
                var i = 0, j = 0;

                var pTempRes;
                var pRes = {};

                var isEmpty;

                var pKeys;
                var sKey;

                for (i = 0; i < pSet.length; i++) {
                    pTempRes = this.firstTerminal(pSet[i]);

                    if (akra.isNull(pTempRes)) {
                        pRes[pSet[i]] = true;
                        return pRes;
                    }

                    isEmpty = false;

                    pKeys = Object.keys(pTempRes);

                    for (j = 0; j < pKeys.length; j++) {
                        sKey = pKeys[j];

                        if (sKey === parser.T_EMPTY) {
                            isEmpty = true;
                            continue;
                        }
                        pRes[sKey] = true;
                    }

                    if (!isEmpty) {
                        return pRes;
                    }
                }

                if (!akra.isNull(pExpected)) {
                    pKeys = Object.keys(pExpected);
                    for (j = 0; j < pKeys.length; j++) {
                        pRes[pKeys[j]] = true;
                    }
                }

                return pRes;
            };

            Parser.prototype.generateRules = function (sGrammarSource) {
                var pAllRuleList = sGrammarSource.split(/\r?\n/);
                var pTempRule;
                var pRule;
                var isLexerBlock = false;

                this._pRulesDMap = {};
                this._pAdditionalFuncInfoList = [];
                this._pRuleCreationModeMap = {};
                this._pGrammarSymbols = {};

                var i = 0, j = 0;

                var isAllNodeMode = akra.bf.testAll(this._eParseMode, parser.EParseMode.k_AllNode);
                var isNegateMode = akra.bf.testAll(this._eParseMode, parser.EParseMode.k_Negate);
                var isAddMode = akra.bf.testAll(this._eParseMode, parser.EParseMode.k_Add);

                var pSymbolsWithNodeMap = this._pRuleCreationModeMap;
                var sName;

                for (i = 0; i < pAllRuleList.length; i++) {
                    if (pAllRuleList[i] === "" || pAllRuleList[i] === "\r") {
                        continue;
                    }

                    pTempRule = pAllRuleList[i].split(/\s* \s*/);

                    if (isLexerBlock) {
                        if ((pTempRule.length === 3 || (pTempRule.length === 4 && pTempRule[3] === "")) && ((pTempRule[2][0] === "\"" || pTempRule[2][0] === "'") && pTempRule[2].length > 3)) {
                            if (pTempRule[2][0] !== pTempRule[2][pTempRule[2].length - 1]) {
                                this._error(PARSER_GRAMMAR_UNEXPECTED_SYMBOL, {
                                    unexpectedSymbol: pTempRule[2][pTempRule[2].length - 1],
                                    expectedSymbol: pTempRule[2][0],
                                    grammarLine: i
                                });
                            }

                            pTempRule[2] = pTempRule[2].slice(1, pTempRule[2].length - 1);

                            var ch = pTempRule[2][0];

                            if ((ch === "_") || (ch >= "a" && ch <= "z") || (ch >= "A" && ch <= "Z")) {
                                sName = this._pLexer.addKeyword(pTempRule[2], pTempRule[0]);
                            } else {
                                sName = this._pLexer.addPunctuator(pTempRule[2], pTempRule[0]);
                            }

                            this._pGrammarSymbols[sName] = pTempRule[2];
                        }

                        continue;
                    }

                    if (pTempRule[0] === parser.LEXER_RULES) {
                        isLexerBlock = true;
                        continue;
                    }

                    if (akra.isDef(this._pRulesDMap[pTempRule[0]]) === false) {
                        this._pRulesDMap[pTempRule[0]] = {};
                    }

                    pRule = {
                        left: pTempRule[0],
                        right: [],
                        index: 0
                    };
                    this._pSymbolMap[pTempRule[0]] = true;
                    this._pGrammarSymbols[pTempRule[0]] = pTempRule[0];

                    if (isAllNodeMode) {
                        pSymbolsWithNodeMap[pTempRule[0]] = parser.ENodeCreateMode.k_Default;
                    } else if (isNegateMode && !akra.isDef(pSymbolsWithNodeMap[pTempRule[0]])) {
                        pSymbolsWithNodeMap[pTempRule[0]] = parser.ENodeCreateMode.k_Default;
                    } else if (isAddMode && !akra.isDef(pSymbolsWithNodeMap[pTempRule[0]])) {
                        pSymbolsWithNodeMap[pTempRule[0]] = parser.ENodeCreateMode.k_Not;
                    }

                    for (j = 2; j < pTempRule.length; j++) {
                        if (pTempRule[j] === "") {
                            continue;
                        }
                        if (pTempRule[j] === parser.FLAG_RULE_CREATE_NODE) {
                            if (isAddMode) {
                                pSymbolsWithNodeMap[pTempRule[0]] = parser.ENodeCreateMode.k_Necessary;
                            }
                            continue;
                        }
                        if (pTempRule[j] === parser.FLAG_RULE_NOT_CREATE_NODE) {
                            if (isNegateMode && !isAllNodeMode) {
                                pSymbolsWithNodeMap[pTempRule[0]] = parser.ENodeCreateMode.k_Not;
                            }
                            continue;
                        }
                        if (pTempRule[j] === parser.FLAG_RULE_FUNCTION) {
                            if ((!pTempRule[j + 1] || pTempRule[j + 1].length === 0)) {
                                this._error(PARSER_GRAMMAR_BAD_ADDITIONAL_FUNC_NAME, { grammarLine: i });
                            }

                            var pFuncInfo = {
                                name: pTempRule[j + 1],
                                position: pRule.right.length,
                                rule: pRule
                            };
                            this._pAdditionalFuncInfoList.push(pFuncInfo);
                            j++;
                            continue;
                        }
                        if (pTempRule[j][0] === "'" || pTempRule[j][0] === "\"") {
                            if (pTempRule[j].length !== 3) {
                                this._error(PARSER_GRAMMAR_BAD_KEYWORD, {
                                    badKeyword: pTempRule[j],
                                    grammarLine: i
                                });
                            }
                            if (pTempRule[j][0] !== pTempRule[j][2]) {
                                this._error(PARSER_GRAMMAR_UNEXPECTED_SYMBOL, {
                                    unexpectedSymbol: pTempRule[j][2],
                                    expectedSymbol: pTempRule[j][0],
                                    grammarLine: i
                                });
                                //this._error("Can`t generate rules from grammar! Unexpected symbol! Must be");
                            }
                            sName = this._pLexer.addPunctuator(pTempRule[j][1]);
                            pRule.right.push(sName);
                            this._pSymbolMap[sName] = true;
                        } else {
                            pRule.right.push(pTempRule[j]);
                            this._pSymbolMap[pTempRule[j]] = true;
                        }
                    }

                    pRule.index = this._nRules;
                    this._pRulesDMap[pTempRule[0]][pRule.index] = pRule;
                    this._nRules += 1;
                }
            };

            Parser.prototype.generateFunctionByStateMap = function () {
                if (akra.isNull(this._pAdditionalFunctionsMap)) {
                    return;
                }

                var pStateList = this._pStateList;
                var pFuncInfoList = this._pAdditionalFuncInfoList;
                var pFuncInfo;
                var pRule;
                var iPos = 0;
                var pFunc;
                var sGrammarSymbol;

                var i = 0, j = 0;

                var pFuncByStateDMap = {};
                pFuncByStateDMap = this._pAdidtionalFunctByStateDMap = {};

                for (i = 0; i < pFuncInfoList.length; i++) {
                    pFuncInfo = pFuncInfoList[i];

                    pFunc = this._pAdditionalFunctionsMap[pFuncInfo.name];
                    if (!akra.isDef(pFunc)) {
                        continue;
                    }

                    pRule = pFuncInfo.rule;
                    iPos = pFuncInfo.position;
                    sGrammarSymbol = pRule.right[iPos - 1];

                    for (j = 0; j < pStateList.length; j++) {
                        if (pStateList[j].hasRule(pRule, iPos)) {
                            if (!akra.isDef(pFuncByStateDMap[pStateList[j].getIndex()])) {
                                pFuncByStateDMap[pStateList[j].getIndex()] = {};
                            }

                            pFuncByStateDMap[pStateList[j].getIndex()][sGrammarSymbol] = pFunc;
                        }
                    }
                }
            };

            Parser.prototype.generateFirstState = function (eType) {
                if (eType === parser.EParserType.k_LR0) {
                    this.generateFirstState_LR0();
                } else {
                    this.generateFirstState_LR();
                }
            };

            Parser.prototype.generateFirstState_LR0 = function () {
                var pState = new parser.State();
                var pItem = new parser.Item(this._pRulesDMap[parser.START_SYMBOL][0], 0);

                this.pushBaseItem(pItem);
                pState.push(pItem);

                this.closure_LR0(pState);
                this.pushState(pState);
            };

            Parser.prototype.generateFirstState_LR = function () {
                var pState = new parser.State();
                var pExpected = {};
                pExpected[parser.END_SYMBOL] = true;

                pState.push(new parser.Item(this._pRulesDMap[parser.START_SYMBOL][0], 0, pExpected));

                this.closure_LR(pState);
                this.pushState(pState);
            };

            Parser.prototype.closure = function (pState, eType) {
                if (eType === parser.EParserType.k_LR0) {
                    return this.closure_LR0(pState);
                } else {
                    return this.closure_LR(pState);
                }
            };

            Parser.prototype.closure_LR0 = function (pState) {
                var pItemList = pState.getItems();
                var i = 0, j = 0;
                var sSymbol;
                var pKeys;

                for (i = 0; i < pItemList.length; i++) {
                    sSymbol = pItemList[i].mark();

                    if (sSymbol !== parser.END_POSITION && (!this.isTerminal(sSymbol))) {
                        pKeys = Object.keys(this._pRulesDMap[sSymbol]);
                        for (j = 0; j < pKeys.length; j++) {
                            pState.tryPush_LR0(this._pRulesDMap[sSymbol][pKeys[j]], 0);
                        }
                    }
                }
                return pState;
            };

            Parser.prototype.closure_LR = function (pState) {
                var pItemList = (pState.getItems());
                var i = 0, j = 0, k = 0;
                var sSymbol;
                var pSymbols;
                var pTempSet;
                var isNewExpected = false;

                var pRulesMapKeys, pSymbolsKeys;

                while (true) {
                    if (i === pItemList.length) {
                        if (!isNewExpected) {
                            break;
                        }
                        i = 0;
                        isNewExpected = false;
                    }
                    sSymbol = pItemList[i].mark();

                    if (sSymbol !== parser.END_POSITION && (!this.isTerminal(sSymbol))) {
                        pTempSet = pItemList[i].getRule().right.slice(pItemList[i].getPosition() + 1);
                        pSymbols = this.firstTerminalForSet(pTempSet, pItemList[i].getExpectedSymbols());

                        pRulesMapKeys = Object.keys(this._pRulesDMap[sSymbol]);
                        pSymbolsKeys = Object.keys(pSymbols);

                        for (j = 0; j < pRulesMapKeys.length; j++) {
                            for (k = 0; k < pSymbolsKeys.length; k++) {
                                if (pState.tryPush_LR(this._pRulesDMap[sSymbol][pRulesMapKeys[j]], 0, pSymbolsKeys[k])) {
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
                if (eType === parser.EParserType.k_LR0) {
                    return this.nextState_LR0(pState, sSymbol);
                } else {
                    return this.nextState_LR(pState, sSymbol);
                }
            };

            Parser.prototype.nextState_LR0 = function (pState, sSymbol) {
                var pItemList = pState.getItems();
                var i = 0;
                var pNewState = new parser.State();

                for (i = 0; i < pItemList.length; i++) {
                    if (sSymbol === pItemList[i].mark()) {
                        pNewState.push(new parser.Item(pItemList[i].getRule(), pItemList[i].getPosition() + 1));
                    }
                }

                return pNewState;
            };

            Parser.prototype.nextState_LR = function (pState, sSymbol) {
                var pItemList = pState.getItems();
                var i = 0;
                var pNewState = new parser.State();

                for (i = 0; i < pItemList.length; i++) {
                    if (sSymbol === pItemList[i].mark()) {
                        pNewState.push(new parser.Item(pItemList[i].getRule(), pItemList[i].getPosition() + 1, pItemList[i].getExpectedSymbols()));
                    }
                }

                return pNewState;
            };

            Parser.prototype.deleteNotBaseItems = function () {
                var i = 0;
                for (i = 0; i < this._pStateList.length; i++) {
                    this._pStateList[i].deleteNotBase();
                }
            };

            Parser.prototype.closureForItem = function (pRule, iPos) {
                var sIndex = "";
                sIndex += pRule.index + "_" + iPos;

                var pState = this._pStatesTempMap[sIndex];
                if (akra.isDef(pState)) {
                    return pState;
                } else {
                    var pExpected = {};
                    pExpected[parser.UNUSED_SYMBOL] = true;

                    pState = new parser.State();
                    pState.push(new parser.Item(pRule, iPos, pExpected));

                    this.closure_LR(pState);
                    this._pStatesTempMap[sIndex] = pState;

                    return pState;
                }
            };

            Parser.prototype.addLinkExpected = function (pItem, pItemX) {
                var pTable = this._pExpectedExtensionDMap;
                var iIndex = pItem.getIndex();

                if (!akra.isDef(pTable[iIndex])) {
                    pTable[iIndex] = {};
                }

                pTable[iIndex][pItemX.getIndex()] = true;
            };

            Parser.prototype.determineExpected = function (pTestState, sSymbol) {
                var pStateX = pTestState.getNextStateBySymbol(sSymbol);

                if (akra.isNull(pStateX)) {
                    return;
                }

                var pItemListX = pStateX.getItems();
                var pItemList = pTestState.getItems();
                var pState;
                var pItem;
                var i = 0, j = 0, k = null;

                var nBaseItemTest = pTestState.getNumBaseItems();
                var nBaseItemX = pStateX.getNumBaseItems();

                for (i = 0; i < nBaseItemTest; i++) {
                    pState = this.closureForItem(pItemList[i].getRule(), pItemList[i].getPosition());

                    for (j = 0; j < nBaseItemX; j++) {
                        pItem = pState.hasChildItem(pItemListX[j]);

                        if (pItem) {
                            var pExpected = pItem.getExpectedSymbols();

                            for (k in pExpected) {
                                if (k === parser.UNUSED_SYMBOL) {
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
                var i = 0, j = 0;
                var pStates = this._pStateList;
                var pKeys;

                for (i = 0; i < pStates.length; i++) {
                    pKeys = Object.keys(this._pSymbolMap);
                    for (j = 0; j < pKeys.length; j++) {
                        this.determineExpected(pStates[i], pKeys[j]);
                    }
                }
            };

            Parser.prototype.expandExpected = function () {
                var pItemList = this._pBaseItemList;
                var pTable = this._pExpectedExtensionDMap;
                var i = 0, j = 0, k = 0;
                var sSymbol = null;
                var isNewExpected = false;

                pItemList[0].addExpected(parser.END_SYMBOL);
                pItemList[0].setIsNewExpected(true);

                while (true) {
                    if (i === pItemList.length) {
                        if (!isNewExpected) {
                            break;
                        }
                        isNewExpected = false;
                        i = 0;
                    }

                    if (pItemList[i].getIsNewExpected() && akra.isDefAndNotNull(pTable[i]) && akra.isDefAndNotNull(pItemList[i].getExpectedSymbols())) {
                        var pExpectedSymbols = Object.keys(pItemList[i].getExpectedSymbols());
                        var pKeys = Object.keys(pTable[i]);

                        for (j = 0; j < pExpectedSymbols.length; j++) {
                            sSymbol = pExpectedSymbols[j];
                            for (k = 0; k < pKeys.length; k++) {
                                if (pItemList[pKeys[k]].addExpected(sSymbol)) {
                                    isNewExpected = true;
                                }
                            }
                        }
                    }

                    pItemList[i].setIsNewExpected(false);
                    i++;
                }
            };

            Parser.prototype.generateStates = function (eType) {
                if (eType === parser.EParserType.k_LR0) {
                    this.generateStates_LR0();
                } else if (eType === parser.EParserType.k_LR1) {
                    this.generateStates_LR();
                } else if (eType === parser.EParserType.k_LALR) {
                    this.generateStates_LALR();
                }
            };

            Parser.prototype.generateStates_LR0 = function () {
                this.generateFirstState_LR0();

                var i = 0, j = 0;
                var pStateList = this._pStateList;
                var sSymbol = null;
                var pState;
                var pSymbols = Object.keys(this._pSymbolMap);

                for (i = 0; i < pStateList.length; i++) {
                    for (j = 0; j < pSymbols.length; j++) {
                        sSymbol = pSymbols[j];
                        pState = this.nextState_LR0(pStateList[i], sSymbol);

                        if (!pState.isEmpty()) {
                            pState = this.tryAddState(pState, parser.EParserType.k_LR0);
                            this.addStateLink(pStateList[i], pState, sSymbol);
                        }
                    }
                }
            };

            Parser.prototype.generateStates_LR = function () {
                this._pFirstTerminalsDMap = {};
                this.generateFirstState_LR();

                var i = 0, j = 0;
                var pStateList = this._pStateList;
                var sSymbol = null;
                var pState;
                var pSymbols = Object.keys(this._pSymbolMap);

                for (i = 0; i < pStateList.length; i++) {
                    for (j = 0; j < pSymbols.length; j++) {
                        sSymbol = pSymbols[j];
                        pState = this.nextState_LR(pStateList[i], sSymbol);

                        if (!pState.isEmpty()) {
                            pState = this.tryAddState(pState, parser.EParserType.k_LR1);
                            this.addStateLink(pStateList[i], pState, sSymbol);
                        }
                    }
                }
            };

            Parser.prototype.generateStates_LALR = function () {
                this._pStatesTempMap = {};
                this._pBaseItemList = [];
                this._pExpectedExtensionDMap = {};
                this._pFirstTerminalsDMap = {};

                this.generateStates_LR0();
                this.deleteNotBaseItems();
                this.generateLinksExpected();
                this.expandExpected();

                var i = 0;
                var pStateList = this._pStateList;

                for (i = 0; i < pStateList.length; i++) {
                    this.closure_LR(pStateList[i]);
                }
            };

            Parser.prototype.calcBaseItem = function () {
                var num = 0;
                var i = 0;

                for (i = 0; i < this._pStateList.length; i++) {
                    num += this._pStateList[i].getNumBaseItems();
                }

                return num;
            };

            Parser.prototype.printExpectedTable = function () {
                var i = 0, j = 0;
                var sMsg = "";

                var pKeys = Object.keys(this._pExpectedExtensionDMap);
                for (i = 0; i < pKeys.length; i++) {
                    sMsg += "State " + this._pBaseItemList[pKeys[i]].getState().getIndex() + ":   ";
                    sMsg += this._pBaseItemList[pKeys[i]].toString() + "  |----->\n";

                    var pExtentions = Object.keys(this._pExpectedExtensionDMap[pKeys[i]]);
                    for (j = 0; j < pExtentions.length; j++) {
                        sMsg += "\t\t\t\t\t" + "State " + this._pBaseItemList[pExtentions[j]].getState().getIndex() + ":   ";
                        sMsg += this._pBaseItemList[pExtentions[j]].toString() + "\n";
                    }

                    sMsg += "\n";
                }

                return sMsg;
            };

            Parser.prototype.addReducing = function (pState) {
                var i = 0, j = 0;
                var pItemList = pState.getItems();

                for (i = 0; i < pItemList.length; i++) {
                    if (pItemList[i].mark() === parser.END_POSITION) {
                        if (pItemList[i].getRule().left === parser.START_SYMBOL) {
                            this.pushInSyntaxTable(pState.getIndex(), parser.END_SYMBOL, this._pSuccessOperation);
                        } else {
                            var pExpected = pItemList[i].getExpectedSymbols();

                            var pKeys = Object.keys(pExpected);
                            for (j = 0; j < pKeys.length; j++) {
                                this.pushInSyntaxTable(pState.getIndex(), pKeys[j], this._pReduceOperationsMap[pItemList[i].getRule().index]);
                            }
                        }
                    }
                }
            };

            Parser.prototype.addShift = function (pState) {
                var i = 0;
                var pStateMap = pState.getNextStates();

                var pStateKeys = Object.keys(pStateMap);

                for (i = 0; i < pStateKeys.length; i++) {
                    var sSymbol = pStateKeys[i];
                    this.pushInSyntaxTable(pState.getIndex(), sSymbol, this._pShiftOperationsMap[pStateMap[sSymbol].getIndex()]);
                }
            };

            Parser.prototype.buildSyntaxTable = function () {
                this._pStateList = [];

                var pStateList = this._pStateList;
                var pState;

                //Generate states
                this.generateStates(this._eType);

                //Init necessary properties
                this._pSyntaxTable = {};
                this._pReduceOperationsMap = {};
                this._pShiftOperationsMap = {};

                this._pSuccessOperation = { type: parser.EOperationType.k_Success };

                var i = 0, j = 0, k = 0;

                for (i = 0; i < pStateList.length; i++) {
                    this._pShiftOperationsMap[pStateList[i].getIndex()] = {
                        type: parser.EOperationType.k_Shift,
                        index: pStateList[i].getIndex()
                    };
                }

                var pRulesDMapKeys = Object.keys(this._pRulesDMap);
                for (j = 0; j < pRulesDMapKeys.length; j++) {
                    var pRulesMapKeys = Object.keys(this._pRulesDMap[pRulesDMapKeys[j]]);
                    for (k = 0; k < pRulesMapKeys.length; k++) {
                        var sSymbol = pRulesMapKeys[k];
                        var pRule = this._pRulesDMap[pRulesDMapKeys[j]][sSymbol];

                        this._pReduceOperationsMap[sSymbol] = {
                            type: parser.EOperationType.k_Reduce,
                            rule: pRule
                        };
                    }
                }

                for (i = 0; i < pStateList.length; i++) {
                    pState = pStateList[i];
                    this.addReducing(pState);
                    this.addShift(pState);
                }
            };

            Parser.prototype.readToken = function () {
                return this._pLexer.getNextToken();
            };

            Parser.prototype.operationAdditionalAction = function (iStateIndex, sGrammarSymbol) {
                var pFuncDMap = this._pAdidtionalFunctByStateDMap;

                if (!akra.isNull(this._pAdidtionalFunctByStateDMap) && akra.isDef(pFuncDMap[iStateIndex]) && akra.isDef(pFuncDMap[iStateIndex][sGrammarSymbol])) {
                    return pFuncDMap[iStateIndex][sGrammarSymbol].call(this);
                }

                return parser.EOperationType.k_Ok;
            };

            Parser.prototype.resumeParse = function () {
                try  {
                    var pTree = this._pSyntaxTree;
                    var pStack = this._pStack;
                    var pSyntaxTable = this._pSyntaxTable;

                    var isStop = false;
                    var isError = false;
                    var isPause = false;
                    var pToken = akra.isNull(this._pToken) ? this.readToken() : this._pToken;

                    var pOperation;
                    var iRuleLength;

                    var eAdditionalOperationCode;
                    var iStateIndex = 0;

                    while (!isStop) {
                        pOperation = pSyntaxTable[pStack[pStack.length - 1]][pToken.name];
                        if (akra.isDef(pOperation)) {
                            switch (pOperation.type) {
                                case parser.EOperationType.k_Success:
                                    isStop = true;
                                    break;

                                case parser.EOperationType.k_Shift:
                                    iStateIndex = pOperation.index;
                                    pStack.push(iStateIndex);
                                    pTree.addNode(pToken);

                                    eAdditionalOperationCode = this.operationAdditionalAction(iStateIndex, pToken.name);

                                    if (eAdditionalOperationCode === parser.EOperationType.k_Error) {
                                        isError = true;
                                        isStop = true;
                                    } else if (eAdditionalOperationCode === parser.EOperationType.k_Pause) {
                                        this._pToken = null;
                                        isStop = true;
                                        isPause = true;
                                    } else if (eAdditionalOperationCode === parser.EOperationType.k_Ok) {
                                        pToken = this.readToken();
                                    }

                                    break;

                                case parser.EOperationType.k_Reduce:
                                    iRuleLength = pOperation.rule.right.length;
                                    pStack.length -= iRuleLength;
                                    iStateIndex = pSyntaxTable[pStack[pStack.length - 1]][pOperation.rule.left].index;
                                    pStack.push(iStateIndex);
                                    pTree.reduceByRule(pOperation.rule, this._pRuleCreationModeMap[pOperation.rule.left]);

                                    eAdditionalOperationCode = this.operationAdditionalAction(iStateIndex, pOperation.rule.left);

                                    if (eAdditionalOperationCode === parser.EOperationType.k_Error) {
                                        isError = true;
                                        isStop = true;
                                    } else if (eAdditionalOperationCode === parser.EOperationType.k_Pause) {
                                        this._pToken = pToken;
                                        isStop = true;
                                        isPause = true;
                                    }

                                    break;
                            }
                        } else {
                            isError = true;
                            isStop = true;
                        }
                    }
                } catch (e) {
                    this._sFileName = "stdin";
                    return parser.EParserCode.k_Error;
                }
                if (isPause) {
                    return parser.EParserCode.k_Pause;
                }

                if (!isError) {
                    pTree.finishTree();
                    if (akra.isDef(this._fnFinishCallback)) {
                        this._fnFinishCallback.call(this._pCaller, parser.EParserCode.k_Ok, this.getParseFileName());
                    }
                    this._sFileName = "stdin";
                    return parser.EParserCode.k_Ok;
                } else {
                    this._error(PARSER_SYNTAX_ERROR, pToken);
                    if (akra.isDef(this._fnFinishCallback)) {
                        this._fnFinishCallback.call(this._pCaller, parser.EParserCode.k_Error, this.getParseFileName());
                    }
                    this._sFileName = "stdin";
                    return parser.EParserCode.k_Error;
                }
            };

            Parser.prototype.statesToString = function (isBaseOnly) {
                if (typeof isBaseOnly === "undefined") { isBaseOnly = true; }
                if (!akra.isDef(this._pStateList)) {
                    return null;
                }

                var sMsg = "";
                var i = 0;

                for (i = 0; i < this._pStateList.length; i++) {
                    sMsg += this._pStateList[i].toString(isBaseOnly);
                    sMsg += " ";
                }

                return sMsg;
            };

            Parser.prototype.operationToString = function (pOperation) {
                var sOperation = null;

                switch (pOperation.type) {
                    case parser.EOperationType.k_Shift:
                        sOperation = "SHIFT to state " + pOperation.index.toString();
                        break;
                    case parser.EOperationType.k_Reduce:
                        sOperation = "REDUCE by rule { " + this.ruleToString(pOperation.rule) + " }";
                        break;
                    case parser.EOperationType.k_Success:
                        sOperation = "SUCCESS";
                        break;
                }

                return sOperation;
            };

            Parser.prototype.ruleToString = function (pRule) {
                var sRule;

                sRule = pRule.left + " : " + pRule.right.join(" ");

                return sRule;
            };

            Parser.prototype.convertGrammarSymbol = function (sSymbol) {
                if (!this.isTerminal(sSymbol)) {
                    return sSymbol;
                } else {
                    return this._pLexer.getTerminalValueByName(sSymbol);
                }
            };
            return Parser;
        })();
        parser.Parser = Parser;
    })(akra.parser || (akra.parser = {}));
    var parser = akra.parser;
})(akra || (akra = {}));
