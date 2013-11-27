/// <reference path="../idl/AIParser.ts" />
define(["require", "exports", "logger", "debug", "bitflags", "parser/Lexer", "parser/ParseTree", "parser/Item", "parser/State"], function(require, exports, __logger__, __debug__, __bf__, __Lexer__, __ParseTree__, __Item__, __State__) {
    var logger = __logger__;
    var debug = __debug__;
    var bf = __bf__;

    var Lexer = __Lexer__;
    var ParseTree = __ParseTree__;
    var Item = __Item__;
    var State = __State__;

    
    var T_EMPTY = symbols.T_EMPTY;

    var FLAG_RULE_CREATE_NODE = symbols.FLAG_RULE_CREATE_NODE;
    var FLAG_RULE_NOT_CREATE_NODE = symbols.FLAG_RULE_NOT_CREATE_NODE;
    var FLAG_RULE_FUNCTION = symbols.FLAG_RULE_FUNCTION;

    var LEXER_RULES = symbols.LEXER_RULES;

    var START_SYMBOL = symbols.START_SYMBOL;
    var END_SYMBOL = symbols.END_SYMBOL;

    var END_POSITION = symbols.END_POSITION;

    var UNUSED_SYMBOL = symbols.UNUSED_SYMBOL;

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

    /** @const */
    var LEXER_UNKNOWN_TOKEN = 2101;

    /** @const */
    var LEXER_BAD_TOKEN = 2102;

    logger.registerCode(PARSER_GRAMMAR_ADD_OPERATION, "Grammar not LALR(1)! Cannot to generate syntax table. Add operation error.\n" + "Conflict in state with index: {stateIndex}. With grammar symbol: \"{grammarSymbol}\"\n" + "Old operation: {oldOperation}\n" + "New operation: {newOperation}\n" + "For more info init parser in debug-mode and see syntax table and list of states.");

    logger.registerCode(PARSER_GRAMMAR_ADD_STATE_LINK, "Grammar not LALR(1)! Cannot to generate syntax table. Add state link error.\n" + "Conflict in state with index: {stateIndex}. With grammar symbol: \"{grammarSymbol}\"\n" + "Old next state: {oldNextStateIndex}\n" + "New next state: {newNextStateIndex}\n" + "For more info init parser in debug-mode and see syntax table and list of states.");

    logger.registerCode(PARSER_GRAMMAR_UNEXPECTED_SYMBOL, "Grammar error. Can`t generate rules from grammar\n" + "Unexpected symbol: {unexpectedSymbol}\n" + "Expected: {expectedSymbol}");

    logger.registerCode(PARSER_GRAMMAR_BAD_ADDITIONAL_FUNC_NAME, "Grammar error. Empty additional function name.");
    logger.registerCode(PARSER_GRAMMAR_BAD_KEYWORD, "Grammar error. Bad keyword: {badKeyword}\n" + "All keyword must be define in lexer rule block.");

    logger.registerCode(PARSER_SYNTAX_ERROR, "Syntax error during parsing. Token: {tokenValue}\n" + "Line: {line}. Column: {column}.");

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
            if (isDef(pInfo[pParseMessage[i]])) {
                pParseMessage[i] = pInfo[pParseMessage[i]];
            }
        }

        var sMessage = sPosition + sError + pParseMessage.join("");

        console["error"].call(console, sMessage);
    }

    logger.setCodeFamilyRoutine("ParserSyntaxErrors", syntaxErrorLogRoutine, 8 /* ERROR */);

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

            this._eType = 0 /* k_LR0 */;

            this._pRuleCreationModeMap = null;
            this._eParseMode = 1 /* k_AllNode */;

            // this._isSync = false;
            this._pStatesTempMap = null;
            this._pBaseItemList = null;

            this._pExpectedExtensionDMap = null;

            this._sFileName = "stdin";
            ;
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
            if (typeof eMode === "undefined") { eMode = 1 /* k_AllNode */; }
            if (typeof eType === "undefined") { eType = 2 /* k_LALR */; }
            try  {
                this._eType = eType;
                this._pLexer = new Lexer(this);
                this._eParseMode = eMode;
                this.generateRules(sGrammar);
                this.buildSyntaxTable();
                this.generateFunctionByStateMap();
                if (!bf.testAll(eMode, 16 /* k_DebugMode */)) {
                    this.clearMem();
                }
                return true;
            } catch (e) {
                debug.log(e.stack);

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
                    if (isDef(pOperation)) {
                        switch (pOperation.type) {
                            case 103 /* k_Success */:
                                isStop = true;
                                break;

                            case 101 /* k_Shift */:
                                iStateIndex = pOperation.index;
                                pStack.push(iStateIndex);
                                pTree.addNode(pToken);

                                eAdditionalOperationCode = this.operationAdditionalAction(iStateIndex, pToken.name);

                                if (eAdditionalOperationCode === 100 /* k_Error */) {
                                    isError = true;
                                    isStop = true;
                                } else if (eAdditionalOperationCode === 104 /* k_Pause */) {
                                    this._pToken = null;
                                    isStop = true;
                                    isPause = true;
                                } else if (eAdditionalOperationCode === 105 /* k_Ok */) {
                                    pToken = this.readToken();
                                }

                                break;

                            case 102 /* k_Reduce */:
                                iRuleLength = pOperation.rule.right.length;
                                pStack.length -= iRuleLength;
                                iStateIndex = pSyntaxTable[pStack[pStack.length - 1]][pOperation.rule.left].index;
                                pStack.push(iStateIndex);
                                pTree.reduceByRule(pOperation.rule, this._pRuleCreationModeMap[pOperation.rule.left]);

                                eAdditionalOperationCode = this.operationAdditionalAction(iStateIndex, pOperation.rule.left);

                                if (eAdditionalOperationCode === 100 /* k_Error */) {
                                    isError = true;
                                    isStop = true;
                                } else if (eAdditionalOperationCode === 104 /* k_Pause */) {
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
                return 2 /* k_Error */;
            }

            if (isPause) {
                return 0 /* k_Pause */;
            }

            if (!isError) {
                pTree.setRoot();
                if (!isNull(this._fnFinishCallback)) {
                    this._fnFinishCallback.call(this._pCaller, 1 /* k_Ok */, this.getParseFileName());
                }
                this._sFileName = "stdin";
                return 1 /* k_Ok */;
            } else {
                this._error(PARSER_SYNTAX_ERROR, pToken);
                if (!isNull(this._fnFinishCallback)) {
                    this._fnFinishCallback.call(this._pCaller, 2 /* k_Error */, this.getParseFileName());
                }
                this._sFileName = "stdin";
                return 2 /* k_Error */;
            }
        };

        Parser.prototype.setParseFileName = function (sFileName) {
            this._sFileName = sFileName;
        };

        Parser.prototype.getParseFileName = function () {
            return this._sFileName;
        };

        Parser.prototype.pause = function () {
            return 0 /* k_Pause */;
        };

        Parser.prototype.resume = function () {
            return this.resumeParse();
        };

        Parser.prototype.printStates = function (isBaseOnly) {
            if (typeof isBaseOnly === "undefined") { isBaseOnly = true; }
            if (!isDef(this._pStateList)) {
                logger.log("It`s impossible to print states. You must init parser in debug-mode");
                return;
            }
            var sMsg = "\n" + this.statesToString(isBaseOnly);
            logger.log(sMsg);
        };

        Parser.prototype.printState = function (iStateIndex, isBaseOnly) {
            if (typeof isBaseOnly === "undefined") { isBaseOnly = true; }
            if (!isDef(this._pStateList)) {
                logger.log("It`s impossible to print states. You must init parser in debug-mode");
                return;
            }

            var pState = this._pStateList[iStateIndex];
            if (!isDef(pState)) {
                logger.log("Can not print stete with index: " + iStateIndex.toString());
                return;
            }

            var sMsg = "\n" + pState.toString(isBaseOnly);
            logger.log(sMsg);
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
            if (isNull(this._pAdditionalFunctionsMap)) {
                this._pAdditionalFunctionsMap = {};
            }
            this._pAdditionalFunctionsMap[sFuncName] = fnRuleFunction;
        };

        Parser.prototype.addTypeId = function (sIdentifier) {
            if (isNull(this._pTypeIdMap)) {
                this._pTypeIdMap = {};
            }
            this._pTypeIdMap[sIdentifier] = true;
        };

        Parser.prototype.defaultInit = function () {
            this._iIndex = 0;
            this._pStack = [0];
            this._pSyntaxTree = new ParseTree();
            this._pTypeIdMap = {};

            this._pSyntaxTree.setOptimizeMode(bf.testAll(this._eParseMode, 8 /* k_Optimize */));
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

            if (eCode === PARSER_SYNTAX_ERROR) {
                var pToken = pErrorInfo;
                var iLine = pToken.line;
                var iColumn = pToken.start;

                pInfo.tokenValue = pToken.value;
                pInfo.line = iLine;
                pInfo.column = iColumn;

                pLocation.file = this.getParseFileName();
                pLocation.line = iLine;
            } else if (eCode === PARSER_GRAMMAR_ADD_OPERATION) {
                var iStateIndex = pErrorInfo.stateIndex;
                var sSymbol = pErrorInfo.grammarSymbol;
                var pOldOperation = pErrorInfo.oldOperation;
                var pNewOperation = pErrorInfo.newOperation;

                pInfo.stateIndex = iStateIndex;
                pInfo.grammarSymbol = sSymbol;
                pInfo.oldOperation = this.operationToString(pOldOperation);
                pInfo.newOperation = this.operationToString(pNewOperation);

                pLocation.file = "GRAMMAR";
                pLocation.line = 0;
            } else if (eCode === PARSER_GRAMMAR_ADD_STATE_LINK) {
                var iStateIndex = pErrorInfo.stateIndex;
                var sSymbol = pErrorInfo.grammarSymbol;
                var iOldNextStateIndex = pErrorInfo.oldNextStateIndex;
                var iNewNextStateIndex = pErrorInfo.newNextStateIndex;

                pInfo.stateIndex = iStateIndex;
                pInfo.grammarSymbol = sSymbol;
                pInfo.oldNextStateIndex = iOldNextStateIndex;
                pInfo.newNextStateIndex = iNewNextStateIndex;

                pLocation.file = "GRAMMAR";
                pLocation.line = 0;
            } else if (eCode === PARSER_GRAMMAR_UNEXPECTED_SYMBOL) {
                var iLine = pErrorInfo.grammarLine;
                var sExpectedSymbol = pErrorInfo.expectedSymbol;
                var sUnexpectedSymbol = pErrorInfo.unexpectedSymbol;

                pInfo.expectedSymbol = sExpectedSymbol;
                pInfo.unexpectedSymbol = sExpectedSymbol;

                pLocation.file = "GRAMMAR";
                pLocation.line = iLine || 0;
            } else if (eCode === PARSER_GRAMMAR_BAD_ADDITIONAL_FUNC_NAME) {
                var iLine = pErrorInfo.grammarLine;

                pLocation.file = "GRAMMAR";
                pLocation.line = iLine || 0;
            } else if (eCode === PARSER_GRAMMAR_BAD_KEYWORD) {
                var iLine = pErrorInfo.grammarLine;
                var sBadKeyword = pErrorInfo.badKeyword;

                pInfo.badKeyword = sBadKeyword;

                pLocation.file = "GRAMMAR";
                pLocation.line = iLine || 0;
            }

            logger["error"](pLogEntity);

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
            pState.index = this._pStateList.length;
            this._pStateList.push(pState);
        };

        Parser.prototype.pushBaseItem = function (pItem) {
            pItem.index = this._pBaseItemList.length;
            this._pBaseItemList.push(pItem);
        };

        Parser.prototype.tryAddState = function (pState, eType) {
            var pRes = this.hasState(pState, eType);

            if (isNull(pRes)) {
                if (eType === 0 /* k_LR0 */) {
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
            if (isDef(pSyntaxTable[iIndex][sSymbol])) {
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
                    stateIndex: pState.index,
                    oldNextStateIndex: pState.getNextStateBySymbol(sSymbol),
                    newNextStateIndex: pNextState.index,
                    grammarSymbol: this.convertGrammarSymbol(sSymbol)
                });
            }
        };

        Parser.prototype.firstTerminal = function (sSymbol) {
            if (this.isTerminal(sSymbol)) {
                return null;
            }

            if (isDef(this._pFirstTerminalsDMap[sSymbol])) {
                return this._pFirstTerminalsDMap[sSymbol];
            }

            var i = null, j = 0, k = null;
            var pRulesMap = this._pRulesDMap[sSymbol];

            var pTempRes = {};
            var pRes;

            var pRight;
            var isFinish;

            pRes = this._pFirstTerminalsDMap[sSymbol] = {};

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
                    } else {
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
        };

        Parser.prototype.followTerminal = function (sSymbol) {
            if (isDef(this._pFollowTerminalsDMap[sSymbol])) {
                return this._pFollowTerminalsDMap[sSymbol];
            }

            var i = null, j = null, k = 0, l = 0, m = null;
            var pRulesDMap = this._pRulesDMap;

            var pTempRes;
            var pRes;

            var pRight;
            var isFinish;

            pRes = this._pFollowTerminalsDMap[sSymbol] = {};

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
                            } else {
                                isFinish = false;

                                for (l = k + 1; l < pRight.length; l++) {
                                    pTempRes = this.firstTerminal(pRight[l]);

                                    if (isNull(pTempRes)) {
                                        pRes[pRight[l]] = true;
                                        isFinish = true;
                                        break;
                                    } else {
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
        };

        Parser.prototype.firstTerminalForSet = function (pSet, pExpected) {
            var i = 0, j = null;

            var pTempRes;
            var pRes = {};

            var isEmpty;

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

            var isAllNodeMode = bf.testAll(this._eParseMode, 1 /* k_AllNode */);
            var isNegateMode = bf.testAll(this._eParseMode, 2 /* k_Negate */);
            var isAddMode = bf.testAll(this._eParseMode, 4 /* k_Add */);

            var pSymbolsWithNodeMap = this._pRuleCreationModeMap;

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
                        var sName;

                        if ((ch === "_") || (ch >= "a" && ch <= "z") || (ch >= "A" && ch <= "Z")) {
                            sName = this._pLexer.addKeyword(pTempRule[2], pTempRule[0]);
                        } else {
                            sName = this._pLexer.addPunctuator(pTempRule[2], pTempRule[0]);
                        }

                        this._pGrammarSymbols[sName] = pTempRule[2];
                    }

                    continue;
                }

                if (pTempRule[0] === LEXER_RULES) {
                    isLexerBlock = true;
                    continue;
                }

                if (isDef(this._pRulesDMap[pTempRule[0]]) === false) {
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
                    pSymbolsWithNodeMap[pTempRule[0]] = 0 /* k_Default */;
                } else if (isNegateMode && !isDef(pSymbolsWithNodeMap[pTempRule[0]])) {
                    pSymbolsWithNodeMap[pTempRule[0]] = 0 /* k_Default */;
                } else if (isAddMode && !isDef(pSymbolsWithNodeMap[pTempRule[0]])) {
                    pSymbolsWithNodeMap[pTempRule[0]] = 2 /* k_Not */;
                }

                for (j = 2; j < pTempRule.length; j++) {
                    if (pTempRule[j] === "") {
                        continue;
                    }
                    if (pTempRule[j] === FLAG_RULE_CREATE_NODE) {
                        if (isAddMode) {
                            pSymbolsWithNodeMap[pTempRule[0]] = 1 /* k_Necessary */;
                        }
                        continue;
                    }
                    if (pTempRule[j] === FLAG_RULE_NOT_CREATE_NODE) {
                        if (isNegateMode && !isAllNodeMode) {
                            pSymbolsWithNodeMap[pTempRule[0]] = 2 /* k_Not */;
                        }
                        continue;
                    }
                    if (pTempRule[j] === FLAG_RULE_FUNCTION) {
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
                        var sName = this._pLexer.addPunctuator(pTempRule[j][1]);
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
            if (isNull(this._pAdditionalFunctionsMap)) {
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
                if (!isDef(pFunc)) {
                    continue;
                }

                pRule = pFuncInfo.rule;
                iPos = pFuncInfo.position;
                sGrammarSymbol = pRule.right[iPos - 1];

                for (j = 0; j < pStateList.length; j++) {
                    if (pStateList[j].hasRule(pRule, iPos)) {
                        if (!isDef(pFuncByStateDMap[pStateList[j].index])) {
                            pFuncByStateDMap[pStateList[j].index] = {};
                        }

                        pFuncByStateDMap[pStateList[j].index][sGrammarSymbol] = pFunc;
                    }
                }
            }
        };

        Parser.prototype.generateFirstState = function (eType) {
            if (eType === 0 /* k_LR0 */) {
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
            var pExpected = {};
            pExpected[END_SYMBOL] = true;

            pState.push(new Item(this._pRulesDMap[START_SYMBOL][0], 0, pExpected));

            this.closure_LR(pState);
            this.pushState(pState);
        };

        Parser.prototype.closure = function (pState, eType) {
            if (eType === 0 /* k_LR0 */) {
                return this.closure_LR0(pState);
            } else {
                this.closure_LR(pState);
            }
        };

        Parser.prototype.closure_LR0 = function (pState) {
            var pItemList = pState.items;
            var i = 0, j = null;
            var sSymbol;

            for (i = 0; i < pItemList.length; i++) {
                sSymbol = pItemList[i].mark();

                if (sSymbol !== END_POSITION && (!this.isTerminal(sSymbol))) {
                    for (j in this._pRulesDMap[sSymbol]) {
                        pState.tryPush_LR0(this._pRulesDMap[sSymbol][j], 0);
                    }
                }
            }
            return pState;
        };

        Parser.prototype.closure_LR = function (pState) {
            var pItemList = (pState.items);
            var i = 0, j = null, k = null;
            var sSymbol;
            var pSymbols;
            var pTempSet;
            var isNewExpected = false;

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
        };

        Parser.prototype.nexeState = function (pState, sSymbol, eType) {
            if (eType === 0 /* k_LR0 */) {
                return this.nextState_LR0(pState, sSymbol);
            } else {
                return this.nextState_LR(pState, sSymbol);
            }
        };

        Parser.prototype.nextState_LR0 = function (pState, sSymbol) {
            var pItemList = pState.items;
            var i = 0;
            var pNewState = new State();

            for (i = 0; i < pItemList.length; i++) {
                if (sSymbol === pItemList[i].mark()) {
                    pNewState.push(new Item(pItemList[i].rule, pItemList[i].position + 1));
                }
            }

            return pNewState;
        };

        Parser.prototype.nextState_LR = function (pState, sSymbol) {
            var pItemList = pState.items;
            var i = 0;
            var pNewState = new State();

            for (i = 0; i < pItemList.length; i++) {
                if (sSymbol === pItemList[i].mark()) {
                    pNewState.push(new Item(pItemList[i].rule, pItemList[i].position + 1, pItemList[i].expectedSymbols));
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
            if (isDef(pState)) {
                return pState;
            } else {
                var pExpected = {};
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

            if (!isDef(pTable[iIndex])) {
                pTable[iIndex] = {};
            }

            pTable[iIndex][pItemX.index] = true;
        };

        Parser.prototype.determineExpected = function (pTestState, sSymbol) {
            var pStateX = pTestState.getNextStateBySymbol(sSymbol);

            if (isNull(pStateX)) {
                return;
            }

            var pItemListX = pStateX.items;
            var pItemList = pTestState.items;
            var pState;
            var pItem;
            var i = 0, j = 0, k = null;

            var nBaseItemTest = pTestState.numBaseItems;
            var nBaseItemX = pStateX.numBaseItems;

            for (i = 0; i < nBaseItemTest; i++) {
                pState = this.closureForItem(pItemList[i].rule, pItemList[i].position);

                for (j = 0; j < nBaseItemX; j++) {
                    pItem = pState.hasChildItem(pItemListX[j]);

                    if (pItem) {
                        var pExpected = pItem.expectedSymbols;

                        for (k in pExpected) {
                            if (k === UNUSED_SYMBOL) {
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
            var i = 0, j = null;
            var pStates = this._pStateList;

            for (i = 0; i < pStates.length; i++) {
                for (j in this._pSymbolMap) {
                    this.determineExpected(pStates[i], j);
                }
            }
        };

        Parser.prototype.expandExpected = function () {
            var pItemList = this._pBaseItemList;
            var pTable = this._pExpectedExtensionDMap;
            var i = 0, j = null;
            var sSymbol = null;
            var isNewExpected = false;

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
                    var pExpected = pItemList[i].expectedSymbols;

                    for (sSymbol in pExpected) {
                        for (j in pTable[i]) {
                            if (pItemList[j].addExpected(sSymbol)) {
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
            if (eType === 0 /* k_LR0 */) {
                this.generateStates_LR0();
            } else if (eType === 1 /* k_LR1 */) {
                this.generateStates_LR();
            } else if (eType === 2 /* k_LALR */) {
                this.generateStates_LALR();
            }
        };

        Parser.prototype.generateStates_LR0 = function () {
            this.generateFirstState_LR0();

            var i = 0;
            var pStateList = this._pStateList;
            var sSymbol = null;
            var pState;

            for (i = 0; i < pStateList.length; i++) {
                for (sSymbol in this._pSymbolMap) {
                    pState = this.nextState_LR0(pStateList[i], sSymbol);

                    if (!pState.isEmpty()) {
                        pState = this.tryAddState(pState, 0 /* k_LR0 */);
                        this.addStateLink(pStateList[i], pState, sSymbol);
                    }
                }
            }
        };

        Parser.prototype.generateStates_LR = function () {
            this._pFirstTerminalsDMap = {};
            this.generateFirstState_LR();

            var i = 0;
            var pStateList = this._pStateList;
            var sSymbol = null;
            var pState;

            for (i = 0; i < pStateList.length; i++) {
                for (sSymbol in this._pSymbolMap) {
                    pState = this.nextState_LR(pStateList[i], sSymbol);

                    if (!pState.isEmpty()) {
                        pState = this.tryAddState(pState, 1 /* k_LR1 */);
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
                num += this._pStateList[i].numBaseItems;
            }

            return num;
        };

        Parser.prototype.printExpectedTable = function () {
            var i = null, j = null;
            var sMsg = "";

            for (i in this._pExpectedExtensionDMap) {
                sMsg += "State " + this._pBaseItemList[i].state.index + ":   ";
                sMsg += this._pBaseItemList[i].toString() + "  |----->\n";

                for (j in this._pExpectedExtensionDMap[i]) {
                    sMsg += "\t\t\t\t\t" + "State " + this._pBaseItemList[j].state.index + ":   ";
                    sMsg += this._pBaseItemList[j].toString() + "\n";
                }

                sMsg += "\n";
            }

            return sMsg;
        };

        Parser.prototype.addReducing = function (pState) {
            var i = 0, j = null;
            var pItemList = pState.items;

            for (i = 0; i < pItemList.length; i++) {
                if (pItemList[i].mark() === END_POSITION) {
                    if (pItemList[i].rule.left === START_SYMBOL) {
                        this.pushInSyntaxTable(pState.index, END_SYMBOL, this._pSuccessOperation);
                    } else {
                        var pExpected = pItemList[i].expectedSymbols;

                        for (j in pExpected) {
                            this.pushInSyntaxTable(pState.index, j, this._pReduceOperationsMap[pItemList[i].rule.index]);
                        }
                    }
                }
            }
        };

        Parser.prototype.addShift = function (pState) {
            var i = null;
            var pStateMap = pState.nextStates;

            for (i in pStateMap) {
                this.pushInSyntaxTable(pState.index, i, this._pShiftOperationsMap[pStateMap[i].index]);
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

            this._pSuccessOperation = { type: 103 /* k_Success */ };

            var i = 0, j = null, k = null;

            for (i = 0; i < pStateList.length; i++) {
                this._pShiftOperationsMap[pStateList[i].index] = {
                    type: 101 /* k_Shift */,
                    index: pStateList[i].index
                };
            }

            for (j in this._pRulesDMap) {
                for (k in this._pRulesDMap[j]) {
                    this._pReduceOperationsMap[k] = {
                        type: 102 /* k_Reduce */,
                        rule: this._pRulesDMap[j][k]
                    };
                }
            }

            for (var i = 0; i < pStateList.length; i++) {
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

            if (!isNull(this._pAdidtionalFunctByStateDMap) && isDef(pFuncDMap[iStateIndex]) && isDef(pFuncDMap[iStateIndex][sGrammarSymbol])) {
                return pFuncDMap[iStateIndex][sGrammarSymbol].call(this);
            }

            return 105 /* k_Ok */;
        };

        Parser.prototype.resumeParse = function () {
            try  {
                var pTree = this._pSyntaxTree;
                var pStack = this._pStack;
                var pSyntaxTable = this._pSyntaxTable;

                var isStop = false;
                var isError = false;
                var isPause = false;
                var pToken = isNull(this._pToken) ? this.readToken() : this._pToken;

                var pOperation;
                var iRuleLength;

                var eAdditionalOperationCode;
                var iStateIndex = 0;

                while (!isStop) {
                    pOperation = pSyntaxTable[pStack[pStack.length - 1]][pToken.name];
                    if (isDef(pOperation)) {
                        switch (pOperation.type) {
                            case 103 /* k_Success */:
                                isStop = true;
                                break;

                            case 101 /* k_Shift */:
                                iStateIndex = pOperation.index;
                                pStack.push(iStateIndex);
                                pTree.addNode(pToken);

                                eAdditionalOperationCode = this.operationAdditionalAction(iStateIndex, pToken.name);

                                if (eAdditionalOperationCode === 100 /* k_Error */) {
                                    isError = true;
                                    isStop = true;
                                } else if (eAdditionalOperationCode === 104 /* k_Pause */) {
                                    this._pToken = null;
                                    isStop = true;
                                    isPause = true;
                                } else if (eAdditionalOperationCode === 105 /* k_Ok */) {
                                    pToken = this.readToken();
                                }

                                break;

                            case 102 /* k_Reduce */:
                                iRuleLength = pOperation.rule.right.length;
                                pStack.length -= iRuleLength;
                                iStateIndex = pSyntaxTable[pStack[pStack.length - 1]][pOperation.rule.left].index;
                                pStack.push(iStateIndex);
                                pTree.reduceByRule(pOperation.rule, this._pRuleCreationModeMap[pOperation.rule.left]);

                                eAdditionalOperationCode = this.operationAdditionalAction(iStateIndex, pOperation.rule.left);

                                if (eAdditionalOperationCode === 100 /* k_Error */) {
                                    isError = true;
                                    isStop = true;
                                } else if (eAdditionalOperationCode === 104 /* k_Pause */) {
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
                return 2 /* k_Error */;
            }
            if (isPause) {
                return 0 /* k_Pause */;
            }

            if (!isError) {
                pTree.setRoot();
                if (isDef(this._fnFinishCallback)) {
                    this._fnFinishCallback.call(this._pCaller, 1 /* k_Ok */, this.getParseFileName());
                }
                this._sFileName = "stdin";
                return 1 /* k_Ok */;
            } else {
                this._error(PARSER_SYNTAX_ERROR, pToken);
                if (isDef(this._fnFinishCallback)) {
                    this._fnFinishCallback.call(this._pCaller, 2 /* k_Error */, this.getParseFileName());
                }
                this._sFileName = "stdin";
                return 2 /* k_Error */;
            }
        };

        Parser.prototype.statesToString = function (isBaseOnly) {
            if (typeof isBaseOnly === "undefined") { isBaseOnly = true; }
            if (!isDef(this._pStateList)) {
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
                case 101 /* k_Shift */:
                    sOperation = "SHIFT to state " + pOperation.index.toString();
                    break;
                case 102 /* k_Reduce */:
                    sOperation = "REDUCE by rule { " + this.ruleToString(pOperation.rule) + " }";
                    break;
                case 103 /* k_Success */:
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

    
    return Parser;
});
//# sourceMappingURL=Parser2.js.map
