/// <reference path="../idl/AIParser.ts" />

import logger = require("logger");
import debug = require("debug");
import bf = require("bitflags");

import Lexer = require("parser/Lexer");
import ParseTree = require("parser/ParseTree");
import Item = require("parser/Item");
import State = require("parser/State");

import symbols = require("symbols");
import T_EMPTY = symbols.T_EMPTY;

import FLAG_RULE_CREATE_NODE = symbols.FLAG_RULE_CREATE_NODE;
import FLAG_RULE_NOT_CREATE_NODE = symbols.FLAG_RULE_NOT_CREATE_NODE;
import FLAG_RULE_FUNCTION = symbols.FLAG_RULE_FUNCTION;

import LEXER_RULES = symbols.LEXER_RULES;

import START_SYMBOL = symbols.START_SYMBOL;
import END_SYMBOL = symbols.END_SYMBOL;

import END_POSITION = symbols.END_POSITION;

import UNUSED_SYMBOL = symbols.UNUSED_SYMBOL;

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

logger.registerCode(PARSER_GRAMMAR_ADD_OPERATION, "Grammar not LALR(1)! Cannot to generate syntax table. Add operation error.\n" +
    "Conflict in state with index: {stateIndex}. With grammar symbol: \"{grammarSymbol}\"\n" +
    "Old operation: {oldOperation}\n" +
    "New operation: {newOperation}\n" +
    "For more info init parser in debug-mode and see syntax table and list of states.");

logger.registerCode(PARSER_GRAMMAR_ADD_STATE_LINK, "Grammar not LALR(1)! Cannot to generate syntax table. Add state link error.\n" +
    "Conflict in state with index: {stateIndex}. With grammar symbol: \"{grammarSymbol}\"\n" +
    "Old next state: {oldNextStateIndex}\n" +
    "New next state: {newNextStateIndex}\n" +
    "For more info init parser in debug-mode and see syntax table and list of states.");

logger.registerCode(PARSER_GRAMMAR_UNEXPECTED_SYMBOL, "Grammar error. Can`t generate rules from grammar\n" +
    "Unexpected symbol: {unexpectedSymbol}\n" +
    "Expected: {expectedSymbol}");

logger.registerCode(PARSER_GRAMMAR_BAD_ADDITIONAL_FUNC_NAME, "Grammar error. Empty additional function name.");
logger.registerCode(PARSER_GRAMMAR_BAD_KEYWORD, "Grammar error. Bad keyword: {badKeyword}\n" +
    "All keyword must be define in lexer rule block.");

logger.registerCode(PARSER_SYNTAX_ERROR, "Syntax error during parsing. Token: {tokenValue}\n" +
    "Line: {line}. Column: {column}.");


function sourceLocationToString(pLocation: AISourceLocation): string {
    var sLocation: string = "[" + pLocation.file + ":" + pLocation.line.toString() + "]: ";
    return sLocation;
}

function syntaxErrorLogRoutine(pLogEntity: AILoggerEntity): void {
    var sPosition: string = sourceLocationToString(pLogEntity.location);
    var sError: string = "Code: " + pLogEntity.code.toString() + ". ";
    var pParseMessage: string[] = pLogEntity.message.split(/\{(\w+)\}/);
    var pInfo: any = pLogEntity.info;

    for (var i = 0; i < pParseMessage.length; i++) {
        if (isDef(pInfo[pParseMessage[i]])) {
            pParseMessage[i] = <string><any>pInfo[pParseMessage[i]];
        }
    }

    var sMessage = sPosition + sError + pParseMessage.join("");

    console["error"].call(console, sMessage);
}

logger.setCodeFamilyRoutine("ParserSyntaxErrors", syntaxErrorLogRoutine, AELogLevel.ERROR);

interface AIOperation {
    type: AEOperationType;
    rule?: AIRule;
    index?: uint;
}

interface AIOperationMap {
		[grammarSymbol: string]: AIOperation;
		[stateIndex: uint]: AIOperation;
}

interface AIOperationDMap {
		[stateIndex: uint]: AIOperationMap;
}

interface AIRuleMap {
		[ruleIndex: uint]: AIRule;
		[ruleName: string]: AIRule;
}

interface AIRuleDMap {
		[ruleIndex: uint]: AIRuleMap;
		[ruleName: string]: AIRuleMap;
}

interface AIRuleFunctionMap {
		[grammarSymbolOrFuncName: string]: AIRuleFunction;
}

interface AIRuleFunctionDMap {
		[stateIndex: uint]: AIRuleFunctionMap;
}

interface AIAdditionalFuncInfo {
    name: string;
    position: uint;
    rule: AIRule;
}

class Parser implements AIParser {
    // //Input

    private _sSource: string;
    private _iIndex: uint;
    private _sFileName: string;

    //Output

    private _pSyntaxTree: AIParseTree;
    private _pTypeIdMap: AIMap<boolean>;

    //Process params

    private _pLexer: AILexer;
    private _pStack: uint[];
    private _pToken: AIToken;

    //For async loading of files work fine

    private _fnFinishCallback: AIFinishFunc;
    private _pCaller: any;

    //Grammar Info

    private _pSymbolMap: AIMap<boolean>;
    private _pSyntaxTable: AIOperationDMap;
    private _pReduceOperationsMap: AIOperationMap;
    private _pShiftOperationsMap: AIOperationMap;
    private _pSuccessOperation: AIOperation;

    private _pFirstTerminalsDMap: AIBoolDMap;
    private _pFollowTerminalsDMap: AIBoolDMap;

    private _pRulesDMap: AIRuleDMap;
    private _pStateList: AIState[];
    private _nRules: uint;

    private _pAdditionalFuncInfoList: AIAdditionalFuncInfo[];
    private _pAdditionalFunctionsMap: AIRuleFunctionMap;

    private _pAdidtionalFunctByStateDMap: AIRuleFunctionDMap;

    private _eType: AEParserType;

    private _pGrammarSymbols: AIStringMap;

    //Additioanal info

    private _pRuleCreationModeMap: AIIntMap;
    private _eParseMode: AEParseMode;

    // private _isSync: boolean;

    //Temp

    private _pStatesTempMap: AIMap<AIState>;
    private _pBaseItemList: AIItem[];
    private _pExpectedExtensionDMap: AIBoolDMap;


    constructor() {
        this._sSource = "";
        this._iIndex = 0;

        this._pSyntaxTree = null;
        this._pTypeIdMap = null;

        this._pLexer = null;
        this._pStack = <uint[]>[];
        this._pToken = null;

        this._fnFinishCallback = null;
        this._pCaller = null;

        this._pSymbolMap = <AIMap<boolean>><any>{ END_SYMBOL: true };
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

        this._eType = AEParserType.k_LR0;

        this._pRuleCreationModeMap = null;
        this._eParseMode = AEParseMode.k_AllNode;

        // this._isSync = false;

        this._pStatesTempMap = null;
        this._pBaseItemList = null;

        this._pExpectedExtensionDMap = null;

        this._sFileName = "stdin";;
    }

    isTypeId(sValue: string): boolean {
        return !!(this._pTypeIdMap[sValue]);
    }

    returnCode(pNode: AIParseNode): string {
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

    init(sGrammar: string, eMode: AEParseMode = AEParseMode.k_AllNode, eType: AEParserType = AEParserType.k_LALR): boolean {
        try {
            this._eType = eType;
            this._pLexer = new Lexer(this);
            this._eParseMode = eMode;
            this.generateRules(sGrammar);
            this.buildSyntaxTable();
            this.generateFunctionByStateMap();
            if (!bf.testAll(eMode, AEParseMode.k_DebugMode)) {
                this.clearMem();
            }
            return true;
        }
        catch (e) {
            debug.log(e.stack);
            // error("Could`not initialize parser. Error with code has occurred: " + e.message + ". See log for more info.");
            return false;
        }
    }

    parse(sSource: string, fnFinishCallback: AIFinishFunc = null, pCaller: any = null): AEParserCode {
        try {
            this.defaultInit();
            this._sSource = sSource;
            this._pLexer.init(sSource);

            //this._isSync = isSync;

            this._fnFinishCallback = fnFinishCallback;
            this._pCaller = pCaller;

            var pTree: AIParseTree = this._pSyntaxTree;
            var pStack: uint[] = this._pStack;
            var pSyntaxTable: AIOperationDMap = this._pSyntaxTable;

            var isStop: boolean = false;
            var isError: boolean = false;
            var isPause: boolean = false;
            var pToken: AIToken = this.readToken();

            var pOperation: AIOperation;
            var iRuleLength: uint;

            var eAdditionalOperationCode: AEOperationType;
            var iStateIndex: uint = 0;

            while (!isStop) {
                pOperation = pSyntaxTable[pStack[pStack.length - 1]][pToken.name];
                if (isDef(pOperation)) {
                    switch (pOperation.type) {
                        case AEOperationType.k_Success:
                            isStop = true;
                            break;

                        case AEOperationType.k_Shift:

                            iStateIndex = pOperation.index;
                            pStack.push(iStateIndex);
                            pTree.addNode(<AIParseNode>pToken);

                            eAdditionalOperationCode = this.operationAdditionalAction(iStateIndex, pToken.name);

                            if (eAdditionalOperationCode === AEOperationType.k_Error) {
                                isError = true;
                                isStop = true;
                            }
                            else if (eAdditionalOperationCode === AEOperationType.k_Pause) {
                                this._pToken = null;
                                isStop = true;
                                isPause = true;
                            }
                            else if (eAdditionalOperationCode === AEOperationType.k_Ok) {
                                pToken = this.readToken();
                            }

                            break;

                        case AEOperationType.k_Reduce:

                            iRuleLength = pOperation.rule.right.length;
                            pStack.length -= iRuleLength;
                            iStateIndex = pSyntaxTable[pStack[pStack.length - 1]][pOperation.rule.left].index;
                            pStack.push(iStateIndex);
                            pTree.reduceByRule(pOperation.rule, this._pRuleCreationModeMap[pOperation.rule.left]);

                            eAdditionalOperationCode = this.operationAdditionalAction(iStateIndex, pOperation.rule.left);

                            if (eAdditionalOperationCode === AEOperationType.k_Error) {
                                isError = true;
                                isStop = true;
                            }
                            else if (eAdditionalOperationCode === AEOperationType.k_Pause) {
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
        }
        catch (e) {
            // debug_print(e.stack);
            this._sFileName = "stdin";
            return AEParserCode.k_Error;
        }

        if (isPause) {
            return AEParserCode.k_Pause;
        }

        if (!isError) {
            pTree.setRoot();
            if (!isNull(this._fnFinishCallback)) {
                this._fnFinishCallback.call(this._pCaller, AEParserCode.k_Ok, this.getParseFileName());
            }
            this._sFileName = "stdin";
            return AEParserCode.k_Ok;
        }
        else {
            this._error(PARSER_SYNTAX_ERROR, pToken);
            if (!isNull(this._fnFinishCallback)) {
                this._fnFinishCallback.call(this._pCaller, AEParserCode.k_Error, this.getParseFileName());
            }
            this._sFileName = "stdin";
            return AEParserCode.k_Error;
        }
    }

    setParseFileName(sFileName: string): void {
        this._sFileName = sFileName;
    }

    getParseFileName(): string {
        return this._sFileName;
    }

    pause(): AEParserCode {
        return AEParserCode.k_Pause;
    }

    resume(): AEParserCode {
        return this.resumeParse();
    }

    printStates(isBaseOnly: boolean = true): void {
        if (!isDef(this._pStateList)) {
            logger.log("It`s impossible to print states. You must init parser in debug-mode");
            return;
        }
        var sMsg: string = "\n" + this.statesToString(isBaseOnly);
        logger.log(sMsg);
    }

    printState(iStateIndex: uint, isBaseOnly: boolean = true): void {
        if (!isDef(this._pStateList)) {
            logger.log("It`s impossible to print states. You must init parser in debug-mode");
            return;
        }

        var pState: AIState = this._pStateList[iStateIndex];
        if (!isDef(pState)) {
            logger.log("Can not print stete with index: " + iStateIndex.toString());
            return;
        }

        var sMsg: string = "\n" + pState.toString(isBaseOnly);
        logger.log(sMsg);
    }

    getGrammarSymbols(): AIStringMap {
        return this._pGrammarSymbols;
    }

    /** inline */ getSyntaxTree(): AIParseTree {
        return this._pSyntaxTree;
    }

    _saveState(): AIParserState {
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
    }

    _loadState(pState: AIParserState): void {
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
    }



    protected addAdditionalFunction(sFuncName: string, fnRuleFunction: AIRuleFunction): void {
        if (isNull(this._pAdditionalFunctionsMap)) {
            this._pAdditionalFunctionsMap = <AIRuleFunctionMap>{};
        }
        this._pAdditionalFunctionsMap[sFuncName] = fnRuleFunction;
    }

    protected addTypeId(sIdentifier: string): void {
        if (isNull(this._pTypeIdMap)) {
            this._pTypeIdMap = <AIMap<boolean>>{};
        }
        this._pTypeIdMap[sIdentifier] = true;
    }

    protected defaultInit(): void {
        this._iIndex = 0;
        this._pStack = [0];
        this._pSyntaxTree = new ParseTree();
        this._pTypeIdMap = <AIMap<boolean>>{};

        this._pSyntaxTree.setOptimizeMode(bf.testAll(this._eParseMode, AEParseMode.k_Optimize));
    }

    private _error(eCode: uint, pErrorInfo: any): void {
        var pLocation: AISourceLocation = <AISourceLocation>{};

        var pInfo: any = {
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

        var pLogEntity: AILoggerEntity = <AILoggerEntity>{ code: eCode, info: pInfo, location: pLocation };

        if (eCode === PARSER_SYNTAX_ERROR) {
            var pToken: AIToken = <AIToken>pErrorInfo;
            var iLine: uint = pToken.line;
            var iColumn: uint = pToken.start;

            pInfo.tokenValue = pToken.value;
            pInfo.line = iLine;
            pInfo.column = iColumn;

            pLocation.file = this.getParseFileName();
            pLocation.line = iLine;
        }
        else if (eCode === PARSER_GRAMMAR_ADD_OPERATION) {
            var iStateIndex: uint = pErrorInfo.stateIndex;
            var sSymbol: string = pErrorInfo.grammarSymbol;
            var pOldOperation: AIOperation = pErrorInfo.oldOperation;
            var pNewOperation: AIOperation = pErrorInfo.newOperation;

            pInfo.stateIndex = iStateIndex;
            pInfo.grammarSymbol = sSymbol;
            pInfo.oldOperation = this.operationToString(pOldOperation);
            pInfo.newOperation = this.operationToString(pNewOperation);

            pLocation.file = "GRAMMAR";
            pLocation.line = 0;
        }
        else if (eCode === PARSER_GRAMMAR_ADD_STATE_LINK) {
            var iStateIndex: uint = pErrorInfo.stateIndex;
            var sSymbol: string = pErrorInfo.grammarSymbol;
            var iOldNextStateIndex: uint = pErrorInfo.oldNextStateIndex;
            var iNewNextStateIndex: uint = pErrorInfo.newNextStateIndex;

            pInfo.stateIndex = iStateIndex;
            pInfo.grammarSymbol = sSymbol;
            pInfo.oldNextStateIndex = iOldNextStateIndex;
            pInfo.newNextStateIndex = iNewNextStateIndex;

            pLocation.file = "GRAMMAR";
            pLocation.line = 0;
        }
        else if (eCode === PARSER_GRAMMAR_UNEXPECTED_SYMBOL) {
            var iLine: uint = pErrorInfo.grammarLine;
            var sExpectedSymbol: string = pErrorInfo.expectedSymbol;
            var sUnexpectedSymbol: string = pErrorInfo.unexpectedSymbol;

            pInfo.expectedSymbol = sExpectedSymbol;
            pInfo.unexpectedSymbol = sExpectedSymbol;

            pLocation.file = "GRAMMAR";
            pLocation.line = iLine || 0;
        }
        else if (eCode === PARSER_GRAMMAR_BAD_ADDITIONAL_FUNC_NAME) {
            var iLine: uint = pErrorInfo.grammarLine;

            pLocation.file = "GRAMMAR";
            pLocation.line = iLine || 0;
        }
        else if (eCode === PARSER_GRAMMAR_BAD_KEYWORD) {
            var iLine: uint = pErrorInfo.grammarLine;
            var sBadKeyword: string = pErrorInfo.badKeyword;

            pInfo.badKeyword = sBadKeyword;

            pLocation.file = "GRAMMAR";
            pLocation.line = iLine || 0;
        }

        logger["error"](pLogEntity);

        throw new Error(eCode.toString());
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

    private hasState(pState: AIState, eType: AEParserType) {
        var pStateList: AIState[] = this._pStateList;
        var i: uint = 0;

        for (i = 0; i < pStateList.length; i++) {
            if (pStateList[i].isEqual(pState, eType)) {
                return pStateList[i];
            }
        }

        return null;
    }

    private isTerminal(sSymbol: string): boolean {
        return !(this._pRulesDMap[sSymbol]);
    }

    private pushState(pState: AIState): void {
        pState.index = this._pStateList.length;
        this._pStateList.push(pState);
    }

    private pushBaseItem(pItem: AIItem): void {
        pItem.index = this._pBaseItemList.length;
        this._pBaseItemList.push(pItem);
    }

    private tryAddState(pState: AIState, eType: AEParserType): AIState {
        var pRes = this.hasState(pState, eType);

        if (isNull(pRes)) {
            if (eType === AEParserType.k_LR0) {
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

    private hasEmptyRule(sSymbol: string): boolean {
        if (this.isTerminal(sSymbol)) {
            return false;
        }

        var pRulesDMap: AIRuleDMap = this._pRulesDMap;
        for (var i in pRulesDMap[sSymbol]) {
            if (pRulesDMap[sSymbol][i].right.length === 0) {
                return true;
            }
        }

        return false;
    }

    private pushInSyntaxTable(iIndex: uint, sSymbol: string, pOperation: AIOperation): void {
        var pSyntaxTable: AIOperationDMap = this._pSyntaxTable;
        if (!pSyntaxTable[iIndex]) {
            pSyntaxTable[iIndex] = <AIOperationMap>{};
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
    }

    private addStateLink(pState: AIState, pNextState: AIState, sSymbol: string): void {
        var isAddState: boolean = pState.addNextState(sSymbol, pNextState);
        if (!isAddState) {
            this._error(PARSER_GRAMMAR_ADD_STATE_LINK, {
                stateIndex: pState.index,
                oldNextStateIndex: pState.getNextStateBySymbol(sSymbol),
                newNextStateIndex: pNextState.index,
                grammarSymbol: this.convertGrammarSymbol(sSymbol)
            });
        }
    }

    private firstTerminal(sSymbol: string): AIMap<boolean> {
        if (this.isTerminal(sSymbol)) {
            return null;
        }

        if (isDef(this._pFirstTerminalsDMap[sSymbol])) {
            return this._pFirstTerminalsDMap[sSymbol];
        }

        var i: string = null, j: uint = 0, k: string = null;
        var pRulesMap: AIRuleMap = this._pRulesDMap[sSymbol];

        var pTempRes: AIMap<boolean> = <AIMap<boolean>>{};
        var pRes: AIMap<boolean>;

        var pRight: string[];
        var isFinish: boolean;

        pRes = this._pFirstTerminalsDMap[sSymbol] = <AIMap<boolean>>{};

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

    private followTerminal(sSymbol: string): AIMap<boolean> {
        if (isDef(this._pFollowTerminalsDMap[sSymbol])) {
            return this._pFollowTerminalsDMap[sSymbol];
        }

        var i: string = null, j: string = null, k: uint = 0, l: uint = 0, m: string = null;
        var pRulesDMap: AIRuleDMap = this._pRulesDMap;

        var pTempRes: AIMap<boolean>;
        var pRes: AIMap<boolean>;

        var pRight: string[];
        var isFinish: boolean;

        pRes = this._pFollowTerminalsDMap[sSymbol] = <AIMap<boolean>>{};

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

    private firstTerminalForSet(pSet: string[], pExpected: AIMap<boolean>): AIMap<boolean> {
        var i: uint = 0, j: string = null;

        var pTempRes: AIMap<boolean>;
        var pRes: AIMap<boolean> = <AIMap<boolean>>{};

        var isEmpty: boolean;

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
        var pRule: AIRule;
        var isLexerBlock: boolean = false;

        this._pRulesDMap = <AIRuleDMap>{};
        this._pAdditionalFuncInfoList = <AIAdditionalFuncInfo[]>[];
        this._pRuleCreationModeMap = <AIIntMap>{};
        this._pGrammarSymbols = <AIStringMap>{};

        var i: uint = 0, j: uint = 0;

        var isAllNodeMode: boolean = bf.testAll(<int>this._eParseMode, <int>AEParseMode.k_AllNode);
        var isNegateMode: boolean = bf.testAll(<int>this._eParseMode, <int>AEParseMode.k_Negate);
        var isAddMode: boolean = bf.testAll(<int>this._eParseMode, <int>AEParseMode.k_Add);

        var pSymbolsWithNodeMap: AIIntMap = this._pRuleCreationModeMap;


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
                        this._error(PARSER_GRAMMAR_UNEXPECTED_SYMBOL, {
                            unexpectedSymbol: pTempRule[2][pTempRule[2].length - 1],
                            expectedSymbol: pTempRule[2][0],
                            grammarLine: i
                        });
                    }

                    pTempRule[2] = pTempRule[2].slice(1, pTempRule[2].length - 1);

                    var ch: string = pTempRule[2][0];
                    var sName: string;

                    if ((ch === "_") || (ch >= "a" && ch <= "z") || (ch >= "A" && ch <= "Z")) {
                        sName = this._pLexer.addKeyword(pTempRule[2], pTempRule[0]);
                    }
                    else {
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

            //NON TERMNINAL RULES
            if (isDef(this._pRulesDMap[pTempRule[0]]) === false) {
                this._pRulesDMap[pTempRule[0]] = <AIRuleMap>{};
            }

            pRule = <AIRule>{
                left: pTempRule[0],
                right: <string[]>[],
                index: 0
            };
            this._pSymbolMap[pTempRule[0]] = true;
            this._pGrammarSymbols[pTempRule[0]] = pTempRule[0];

            if (isAllNodeMode) {
                pSymbolsWithNodeMap[pTempRule[0]] = AENodeCreateMode.k_Default;
            }
            else if (isNegateMode && !isDef(pSymbolsWithNodeMap[pTempRule[0]])) {
                pSymbolsWithNodeMap[pTempRule[0]] = AENodeCreateMode.k_Default;
            }
            else if (isAddMode && !isDef(pSymbolsWithNodeMap[pTempRule[0]])) {
                pSymbolsWithNodeMap[pTempRule[0]] = AENodeCreateMode.k_Not;
            }

            for (j = 2; j < pTempRule.length; j++) {
                if (pTempRule[j] === "") {
                    continue;
                }
                if (pTempRule[j] === FLAG_RULE_CREATE_NODE) {
                    if (isAddMode) {
                        pSymbolsWithNodeMap[pTempRule[0]] = AENodeCreateMode.k_Necessary;
                    }
                    continue;
                }
                if (pTempRule[j] === FLAG_RULE_NOT_CREATE_NODE) {
                    if (isNegateMode && !isAllNodeMode) {
                        pSymbolsWithNodeMap[pTempRule[0]] = AENodeCreateMode.k_Not;
                    }
                    continue;
                }
                if (pTempRule[j] === FLAG_RULE_FUNCTION) {
                    if ((!pTempRule[j + 1] || pTempRule[j + 1].length === 0)) {
                        this._error(PARSER_GRAMMAR_BAD_ADDITIONAL_FUNC_NAME, { grammarLine: i });
                    }

                    var pFuncInfo: AIAdditionalFuncInfo = <AIAdditionalFuncInfo>{
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

    private generateFunctionByStateMap(): void {
        if (isNull(this._pAdditionalFunctionsMap)) {
            return;
        }

        var pStateList: AIState[] = this._pStateList;
        var pFuncInfoList: AIAdditionalFuncInfo[] = this._pAdditionalFuncInfoList;
        var pFuncInfo: AIAdditionalFuncInfo;
        var pRule: AIRule;
        var iPos: uint = 0;
        var pFunc: AIRuleFunction;
        var sGrammarSymbol: string;

        var i: uint = 0, j: uint = 0;

        var pFuncByStateDMap: AIRuleFunctionDMap = <AIRuleFunctionDMap>{};
        pFuncByStateDMap = this._pAdidtionalFunctByStateDMap = <AIRuleFunctionDMap>{};

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
                        pFuncByStateDMap[pStateList[j].index] = <AIRuleFunctionMap>{};
                    }

                    pFuncByStateDMap[pStateList[j].index][sGrammarSymbol] = pFunc;
                }
            }
        }
    }

    private generateFirstState(eType: AEParserType): void {
        if (eType === AEParserType.k_LR0) {
            this.generateFirstState_LR0();
        }
        else {
            this.generateFirstState_LR();
        }
    }

    private generateFirstState_LR0(): void {
        var pState: AIState = new State();
        var pItem: AIItem = new Item(this._pRulesDMap[START_SYMBOL][0], 0);

        this.pushBaseItem(pItem);
        pState.push(pItem);

        this.closure_LR0(pState);
        this.pushState(pState);
    }

    private generateFirstState_LR(): void {
        var pState: AIState = new State();
        var pExpected: AIMap<boolean> = <AIMap<boolean>>{};
        pExpected[END_SYMBOL] = true;

        pState.push(new Item(this._pRulesDMap[START_SYMBOL][0], 0, pExpected));

        this.closure_LR(pState);
        this.pushState(pState);
    }

    private closure(pState: AIState, eType: AEParserType): AIState {
        if (eType === AEParserType.k_LR0) {
            return this.closure_LR0(pState);
        }
        else {
            this.closure_LR(pState);
        }
    }

    private closure_LR0(pState: AIState): AIState {
        var pItemList: AIItem[] = pState.items;
        var i: uint = 0, j: string = null;
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

    private closure_LR(pState: AIState): AIState {
        var pItemList: AIItem[] = <AIItem[]>(pState.items);
        var i: uint = 0, j: string = null, k: string = null;
        var sSymbol: string;
        var pSymbols: AIMap<boolean>;
        var pTempSet: string[];
        var isNewExpected: boolean = false;

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

    private nexeState(pState: AIState, sSymbol: string, eType: AEParserType): AIState {
        if (eType === AEParserType.k_LR0) {
            return this.nextState_LR0(pState, sSymbol);
        }
        else {
            return this.nextState_LR(pState, sSymbol);
        }
    }

    private nextState_LR0(pState: AIState, sSymbol: string): AIState {
        var pItemList: AIItem[] = pState.items;
        var i: uint = 0;
        var pNewState: AIState = new State();

        for (i = 0; i < pItemList.length; i++) {
            if (sSymbol === pItemList[i].mark()) {
                pNewState.push(new Item(pItemList[i].rule, pItemList[i].position + 1));
            }
        }

        return pNewState;
    }

    private nextState_LR(pState: AIState, sSymbol: string): AIState {
        var pItemList: AIItem[] = <AIItem[]>pState.items;
        var i: uint = 0;
        var pNewState: AIState = new State();

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

    private closureForItem(pRule: AIRule, iPos: uint): AIState {
        var sIndex: string = "";
        sIndex += pRule.index + "_" + iPos;

        var pState: AIState = this._pStatesTempMap[sIndex];
        if (isDef(pState)) {
            return pState;
        }
        else {
            var pExpected: AIMap<boolean> = <AIMap<boolean>>{};
            pExpected[UNUSED_SYMBOL] = true;

            pState = new State();
            pState.push(new Item(pRule, iPos, pExpected));

            this.closure_LR(pState);
            this._pStatesTempMap[sIndex] = pState;

            return pState;
        }
    }

    private addLinkExpected(pItem: AIItem, pItemX: AIItem): void {
        var pTable: AIBoolDMap = this._pExpectedExtensionDMap;
        var iIndex: uint = pItem.index;

        if (!isDef(pTable[iIndex])) {
            pTable[iIndex] = <AIMap<boolean>>{};
        }

        pTable[iIndex][pItemX.index] = true;
    }

    private determineExpected(pTestState: AIState, sSymbol: string): void {
        var pStateX = pTestState.getNextStateBySymbol(sSymbol);

        if (isNull(pStateX)) {
            return;
        }

        var pItemListX: AIItem[] = <AIItem[]>pStateX.items;
        var pItemList: AIItem[] = <AIItem[]>pTestState.items;
        var pState: AIState;
        var pItem: AIItem;
        var i: uint = 0, j: uint = 0, k: string = null;

        var nBaseItemTest = pTestState.numBaseItems;
        var nBaseItemX = pStateX.numBaseItems;

        for (i = 0; i < nBaseItemTest; i++) {
            pState = this.closureForItem(pItemList[i].rule, pItemList[i].position);

            for (j = 0; j < nBaseItemX; j++) {
                pItem = <AIItem>pState.hasChildItem(pItemListX[j]);

                if (pItem) {
                    var pExpected: AIMap<boolean> = pItem.expectedSymbols;

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
        var i: uint = 0, j: string = null;
        var pStates: AIState[] = this._pStateList;

        for (i = 0; i < pStates.length; i++) {
            for (j in this._pSymbolMap) {
                this.determineExpected(pStates[i], j);
            }
        }
    }

    private expandExpected(): void {
        var pItemList: AIItem[] = <AIItem[]>this._pBaseItemList;
        var pTable: AIBoolDMap = this._pExpectedExtensionDMap;
        var i: uint = 0, j: string = null;
        var sSymbol: string = null;
        var isNewExpected: boolean = false;

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
                var pExpected: AIMap<boolean> = pItemList[i].expectedSymbols;

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

    private generateStates(eType: AEParserType): void {
        if (eType === AEParserType.k_LR0) {
            this.generateStates_LR0();
        }
        else if (eType === AEParserType.k_LR1) {
            this.generateStates_LR();
        }
        else if (eType === AEParserType.k_LALR) {
            this.generateStates_LALR();
        }
    }

    private generateStates_LR0(): void {
        this.generateFirstState_LR0();

        var i: uint = 0;
        var pStateList: AIState[] = this._pStateList;
        var sSymbol: string = null;
        var pState: AIState;

        for (i = 0; i < pStateList.length; i++) {
            for (sSymbol in this._pSymbolMap) {
                pState = this.nextState_LR0(pStateList[i], sSymbol);

                if (!pState.isEmpty()) {
                    pState = this.tryAddState(pState, AEParserType.k_LR0);
                    this.addStateLink(pStateList[i], pState, sSymbol);
                }
            }
        }
    }

    private generateStates_LR(): void {
        this._pFirstTerminalsDMap = <AIBoolDMap>{};
        this.generateFirstState_LR();

        var i: uint = 0;
        var pStateList: AIState[] = this._pStateList;
        var sSymbol: string = null;
        var pState: AIState;

        for (i = 0; i < pStateList.length; i++) {
            for (sSymbol in this._pSymbolMap) {
                pState = this.nextState_LR(pStateList[i], sSymbol);

                if (!pState.isEmpty()) {
                    pState = this.tryAddState(pState, AEParserType.k_LR1);
                    this.addStateLink(pStateList[i], pState, sSymbol);
                }
            }
        }
    }

    private generateStates_LALR(): void {

        this._pStatesTempMap = <AIMap<AIState>>{};
        this._pBaseItemList = <AIItem[]>[];
        this._pExpectedExtensionDMap = <AIBoolDMap>{};
        this._pFirstTerminalsDMap = <AIBoolDMap>{};

        this.generateStates_LR0();
        this.deleteNotBaseItems();
        this.generateLinksExpected();
        this.expandExpected();

        var i: uint = 0;
        var pStateList: AIState[] = this._pStateList;

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

    private printExpectedTable(): string {
        var i: string = null, j: string = null;
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

    private addReducing(pState: AIState): void {
        var i: uint = 0, j: string = null;
        var pItemList: AIItem[] = pState.items;

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

    private addShift(pState: AIState) {
        var i: string = null;
        var pStateMap: AIMap<AIState> = pState.nextStates;

        for (i in pStateMap) {
            this.pushInSyntaxTable(pState.index, i, this._pShiftOperationsMap[pStateMap[i].index]);
        }
    }

    private buildSyntaxTable(): void {
        this._pStateList = <AIState[]>[];

        var pStateList: AIState[] = this._pStateList;
        var pState: AIState;

        //Generate states
        this.generateStates(this._eType);

        //Init necessary properties
        this._pSyntaxTable = <AIOperationDMap>{};
        this._pReduceOperationsMap = <AIOperationMap>{};
        this._pShiftOperationsMap = <AIOperationMap>{};

        this._pSuccessOperation = <AIOperation>{ type: AEOperationType.k_Success };

        var i: uint = 0, j: string = null, k: string = null;

        for (i = 0; i < pStateList.length; i++) {
            this._pShiftOperationsMap[pStateList[i].index] = <AIOperation>{
                type: AEOperationType.k_Shift,
                index: pStateList[i].index
            };
        }

        for (j in this._pRulesDMap) {
            for (k in this._pRulesDMap[j]) {
                this._pReduceOperationsMap[k] = <AIOperation>{
                    type: AEOperationType.k_Reduce,
                    rule: this._pRulesDMap[j][k]
                };
            }
        }

        //Build syntax table
        for (var i: uint = 0; i < pStateList.length; i++) {
            pState = pStateList[i];
            this.addReducing(pState);
            this.addShift(pState);
        }
    }

    private readToken(): AIToken {
        return this._pLexer.getNextToken();
    }

    private operationAdditionalAction(iStateIndex: uint, sGrammarSymbol: string): AEOperationType {
        var pFuncDMap: AIRuleFunctionDMap = this._pAdidtionalFunctByStateDMap;

        if (!isNull(this._pAdidtionalFunctByStateDMap) &&
            isDef(pFuncDMap[iStateIndex]) &&
            isDef(pFuncDMap[iStateIndex][sGrammarSymbol])) {

            return pFuncDMap[iStateIndex][sGrammarSymbol].call(this);
        }

        return AEOperationType.k_Ok;
    }

    private resumeParse(): AEParserCode {
        try {
            var pTree: AIParseTree = this._pSyntaxTree;
            var pStack: uint[] = this._pStack;
            var pSyntaxTable: AIOperationDMap = this._pSyntaxTable;

            var isStop: boolean = false;
            var isError: boolean = false;
            var isPause: boolean = false;
            var pToken: AIToken = isNull(this._pToken) ? this.readToken() : this._pToken;

            var pOperation: AIOperation;
            var iRuleLength: uint;

            var eAdditionalOperationCode: AEOperationType;
            var iStateIndex: uint = 0;

            while (!isStop) {
                pOperation = pSyntaxTable[pStack[pStack.length - 1]][pToken.name];
                if (isDef(pOperation)) {
                    switch (pOperation.type) {
                        case AEOperationType.k_Success:
                            isStop = true;
                            break;

                        case AEOperationType.k_Shift:

                            iStateIndex = pOperation.index;
                            pStack.push(iStateIndex);
                            pTree.addNode(<AIParseNode>pToken);

                            eAdditionalOperationCode = this.operationAdditionalAction(iStateIndex, pToken.name);

                            if (eAdditionalOperationCode === AEOperationType.k_Error) {
                                isError = true;
                                isStop = true;
                            }
                            else if (eAdditionalOperationCode === AEOperationType.k_Pause) {
                                this._pToken = null;
                                isStop = true;
                                isPause = true;
                            }
                            else if (eAdditionalOperationCode === AEOperationType.k_Ok) {
                                pToken = this.readToken();
                            }

                            break;

                        case AEOperationType.k_Reduce:

                            iRuleLength = pOperation.rule.right.length;
                            pStack.length -= iRuleLength;
                            iStateIndex = pSyntaxTable[pStack[pStack.length - 1]][pOperation.rule.left].index;
                            pStack.push(iStateIndex);
                            pTree.reduceByRule(pOperation.rule, this._pRuleCreationModeMap[pOperation.rule.left]);

                            eAdditionalOperationCode = this.operationAdditionalAction(iStateIndex, pOperation.rule.left);

                            if (eAdditionalOperationCode === AEOperationType.k_Error) {
                                isError = true;
                                isStop = true;
                            }
                            else if (eAdditionalOperationCode === AEOperationType.k_Pause) {
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
        }
        catch (e) {
            this._sFileName = "stdin";
            return AEParserCode.k_Error;
        }
        if (isPause) {
            return AEParserCode.k_Pause;
        }

        if (!isError) {
            pTree.setRoot();
            if (isDef(this._fnFinishCallback)) {
                this._fnFinishCallback.call(this._pCaller, AEParserCode.k_Ok, this.getParseFileName());
            }
            this._sFileName = "stdin";
            return AEParserCode.k_Ok;
        }
        else {
            this._error(PARSER_SYNTAX_ERROR, pToken);
            if (isDef(this._fnFinishCallback)) {
                this._fnFinishCallback.call(this._pCaller, AEParserCode.k_Error, this.getParseFileName());
            }
            this._sFileName = "stdin";
            return AEParserCode.k_Error;
        }
    }

    private statesToString(isBaseOnly: boolean = true): string {
        if (!isDef(this._pStateList)) {
            return null;
        }

        var sMsg: string = "";
        var i: uint = 0;

        for (i = 0; i < this._pStateList.length; i++) {
            sMsg += this._pStateList[i].toString(isBaseOnly);
            sMsg += " ";
        }

        return sMsg;
    }

    private operationToString(pOperation: AIOperation): string {
        var sOperation: string = null;

        switch (pOperation.type) {
            case AEOperationType.k_Shift:
                sOperation = "SHIFT to state " + pOperation.index.toString();
                break;
            case AEOperationType.k_Reduce:
                sOperation = "REDUCE by rule { " + this.ruleToString(pOperation.rule) + " }";
                break;
            case AEOperationType.k_Success:
                sOperation = "SUCCESS";
                break;
        }

        return sOperation;
    }

    private ruleToString(pRule: AIRule): string {
        var sRule: string;

        sRule = pRule.left + " : " + pRule.right.join(" ");

        return sRule;
    }

    private convertGrammarSymbol(sSymbol: string): string {
        if (!this.isTerminal(sSymbol)) {
            return sSymbol;
        }
        else {
            return this._pLexer.getTerminalValueByName(sSymbol);
        }
    }

}

export = Parser;