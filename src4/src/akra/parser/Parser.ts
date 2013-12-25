/// <reference path="../idl/parser/IParser.ts" />
/// <reference path="../idl/IMap.ts" />
/// <reference path="../bf/bf.ts" />
/// <reference path="../logger.ts" />

/// <reference path="Lexer.ts" />
/// <reference path="ParseTree.ts" />
/// <reference path="Item.ts" />
/// <reference path="State.ts" />
/// <reference path="symbols.ts" />

module akra.parser {
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

	function sourceLocationToString(pLocation: ISourceLocation): string {
		var sLocation: string = "[" + pLocation.file + ":" + pLocation.line.toString() + "]: ";
		return sLocation;
	}

	function syntaxErrorLogRoutine(pLogEntity: ILoggerEntity): void {
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

		console.error.call(console, sMessage);
	}

	logger.setCodeFamilyRoutine("ParserSyntaxErrors", syntaxErrorLogRoutine, ELogLevel.ERROR);

	interface IOperation {
		type: EOperationType;
		rule?: IRule;
		index?: uint;
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

	interface IRuleFunctionMap {
		[grammarSymbolOrFuncName: string]: IRuleFunction;
	}

	interface IRuleFunctionDMap {
		[stateIndex: uint]: IRuleFunctionMap;
	}

	interface IAdditionalFuncInfo {
		name: string;
		position: uint;
		rule: IRule;
	}

	export class Parser implements IParser {
		//Input

		private _sSource: string;
		private _iIndex: uint;
		private _sFileName: string;

		//Output

		private _pSyntaxTree: IParseTree;
		private _pTypeIdMap: IMap<boolean>;

		//Process params

		private _pLexer: ILexer;
		private _pStack: uint[];
		private _pToken: IToken;

		//For async loading of files work fine

		private _fnFinishCallback: IFinishFunc;
		private _pCaller: any;

		//Grammar Info

		private _pSymbolMap: IMap<boolean>;
		private _pSyntaxTable: IOperationDMap;
		private _pReduceOperationsMap: IOperationMap;
		private _pShiftOperationsMap: IOperationMap;
		private _pSuccessOperation: IOperation;

		private _pFirstTerminalsDMap: IBoolDMap;
		private _pFollowTerminalsDMap: IBoolDMap;

		private _pRulesDMap: IRuleDMap;
		private _pStateList: IState[];
		private _nRules: uint;

		private _pAdditionalFuncInfoList: IAdditionalFuncInfo[];
		private _pAdditionalFunctionsMap: IRuleFunctionMap;

		private _pAdidtionalFunctByStateDMap: IRuleFunctionDMap;

		private _eType: EParserType;

		private _pGrammarSymbols: IMap<string>;

		//Additioanal info

		private _pRuleCreationModeMap: IMap<int>;
		private _eParseMode: EParseMode;

		// private _isSync: boolean;

		//Temp

		private _pStatesTempMap: IMap<IState>;
		private _pBaseItemList: IItem[];
		private _pExpectedExtensionDMap: IBoolDMap;

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

			this._pSymbolMap = <IMap<boolean>><any>{ END_SYMBOL: true };
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

			// this._isSync = false;

			this._pStatesTempMap = null;
			this._pBaseItemList = null;

			this._pExpectedExtensionDMap = null;

			this._sFileName = "stdin";
		}

		final isTypeId(sValue: string): boolean {
			return !!(this._pTypeIdMap[sValue]);
		}

		final returnCode(pNode: IParseNode): string {
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

		init(sGrammar: string, eMode: EParseMode = EParseMode.k_AllNode, eType: EParserType = EParserType.k_LALR): boolean {
			try {
				this._eType = eType;
				this._pLexer = new Lexer(this);
				this._eParseMode = eMode;
				this.generateRules(sGrammar);
				this.buildSyntaxTable();
				this.generateFunctionByStateMap();
				if (!bf.testAll(eMode, EParseMode.k_DebugMode)) {
					this.clearMem();
				}
				return true;
			}
			catch (e) {
				logger.log(e.stack);
				// error("Could`not initialize parser. Error with code has occurred: " + e.message + ". See log for more info.");
				return false;
			}
		}

		final parse(sSource: string, fnFinishCallback: IFinishFunc = null, pCaller: any = null): EParserCode {
			try {
				this.defaultInit();
				this._sSource = sSource;
				this._pLexer.init(sSource);

				//this._isSync = isSync;

				this._fnFinishCallback = fnFinishCallback;
				this._pCaller = pCaller;

				var pTree: IParseTree = this._pSyntaxTree;
				var pStack: uint[] = this._pStack;
				var pSyntaxTable: IOperationDMap = this._pSyntaxTable;

				var isStop: boolean = false;
				var isError: boolean = false;
				var isPause: boolean = false;
				var pToken: IToken = this.readToken();

				var pOperation: IOperation;
				var iRuleLength: uint;

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

								if (eAdditionalOperationCode === EOperationType.k_Error) {
									isError = true;
									isStop = true;
								}
								else if (eAdditionalOperationCode === EOperationType.k_Pause) {
									this._pToken = null;
									isStop = true;
									isPause = true;
								}
								else if (eAdditionalOperationCode === EOperationType.k_Ok) {
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

								if (eAdditionalOperationCode === EOperationType.k_Error) {
									isError = true;
									isStop = true;
								}
								else if (eAdditionalOperationCode === EOperationType.k_Pause) {
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
				return EParserCode.k_Error;
			}

			if (isPause) {
				return EParserCode.k_Pause;
			}

			if (!isError) {
				pTree.finishTree();
				if (!isNull(this._fnFinishCallback)) {
					this._fnFinishCallback.call(this._pCaller, EParserCode.k_Ok, this.getParseFileName());
				}
				this._sFileName = "stdin";
				return EParserCode.k_Ok;
			}
			else {
				this._error(PARSER_SYNTAX_ERROR, pToken);
				if (!isNull(this._fnFinishCallback)) {
					this._fnFinishCallback.call(this._pCaller, EParserCode.k_Error, this.getParseFileName());
				}
				this._sFileName = "stdin";
				return EParserCode.k_Error;
			}
		}

		final setParseFileName(sFileName: string): void {
			this._sFileName = sFileName;
		}

		final getParseFileName(): string {
			return this._sFileName;
		}

		final pause(): EParserCode {
			return EParserCode.k_Pause;
		}

		final resume(): EParserCode {
			return this.resumeParse();
		}

		final printStates(isBaseOnly: boolean = true): void {
			if (!isDef(this._pStateList)) {
				logger.log("It`s impossible to print states. You must init parser in debug-mode");
				return;
			}
			var sMsg: string = "\n" + this.statesToString(isBaseOnly);
			logger.log(sMsg);
		}

		final printState(iStateIndex: uint, isBaseOnly: boolean = true): void {
			if (!isDef(this._pStateList)) {
				logger.log("It`s impossible to print states. You must init parser in debug-mode");
				return;
			}

			var pState: IState = this._pStateList[iStateIndex];
			if (!isDef(pState)) {
				logger.log("Can not print stete with index: " + iStateIndex.toString());
				return;
			}

			var sMsg: string = "\n" + pState.toString(isBaseOnly);
			logger.log(sMsg);
		}

		final getGrammarSymbols(): IMap<string> {
			return this._pGrammarSymbols;
		}

		final getSyntaxTree(): IParseTree {
			return this._pSyntaxTree;
		}

		_saveState(): IParserState {
			return <IParserState>{
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

		_loadState(pState: IParserState): void {
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

		protected addAdditionalFunction(sFuncName: string, fnRuleFunction: IRuleFunction): void {
			if (isNull(this._pAdditionalFunctionsMap)) {
				this._pAdditionalFunctionsMap = <IRuleFunctionMap>{};
			}
			this._pAdditionalFunctionsMap[sFuncName] = fnRuleFunction;
		}

		protected addTypeId(sIdentifier: string): void {
			if (isNull(this._pTypeIdMap)) {
				this._pTypeIdMap = <IMap<boolean>>{};
			}
			this._pTypeIdMap[sIdentifier] = true;
		}

		protected defaultInit(): void {
			this._iIndex = 0;
			this._pStack = [0];
			this._pSyntaxTree = new ParseTree();
			this._pTypeIdMap = <IMap<boolean>>{};

			this._pSyntaxTree.setOptimizeMode(bf.testAll(this._eParseMode, EParseMode.k_Optimize));
		}

		private _error(eCode: uint, pErrorInfo: any): void {
			var pLocation: ISourceLocation = <ISourceLocation>{};

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

			var pLogEntity: ILoggerEntity = <ILoggerEntity>{ code: eCode, info: pInfo, location: pLocation };

			var pToken: IToken;
			var iLine: uint;
			var iColumn: uint;
			var iStateIndex: uint;
			var sSymbol: string;
			var pOldOperation: IOperation;
			var pNewOperation: IOperation;
			var iOldNextStateIndex: uint;
			var iNewNextStateIndex: uint;
			var sExpectedSymbol: string;
			var sUnexpectedSymbol: string;
			var sBadKeyword: string;

			if (eCode === PARSER_SYNTAX_ERROR) {
				pToken = <IToken>pErrorInfo;
				iLine = pToken.line;
				iColumn = pToken.start;

				pInfo.tokenValue = pToken.value;
				pInfo.line = iLine;
				pInfo.column = iColumn;

				pLocation.file = this.getParseFileName();
				pLocation.line = iLine;
			}
			else if (eCode === PARSER_GRAMMAR_ADD_OPERATION) {
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
			}
			else if (eCode === PARSER_GRAMMAR_ADD_STATE_LINK) {
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
			}
			else if (eCode === PARSER_GRAMMAR_UNEXPECTED_SYMBOL) {
				iLine = pErrorInfo.grammarLine;
				sExpectedSymbol = pErrorInfo.expectedSymbol;
				sUnexpectedSymbol = pErrorInfo.unexpectedSymbol;

				pInfo.expectedSymbol = sExpectedSymbol;
				pInfo.unexpectedSymbol = sExpectedSymbol;

				pLocation.file = "GRAMMAR";
				pLocation.line = iLine || 0;
			}
			else if (eCode === PARSER_GRAMMAR_BAD_ADDITIONAL_FUNC_NAME) {
				iLine = pErrorInfo.grammarLine;

				pLocation.file = "GRAMMAR";
				pLocation.line = iLine || 0;
			}
			else if (eCode === PARSER_GRAMMAR_BAD_KEYWORD) {
				iLine = pErrorInfo.grammarLine;
				sBadKeyword = pErrorInfo.badKeyword;

				pInfo.badKeyword = sBadKeyword;

				pLocation.file = "GRAMMAR";
				pLocation.line = iLine || 0;
			}

			logger.error(pLogEntity);

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

		private isTerminal(sSymbol: string): boolean {
			return !(this._pRulesDMap[sSymbol]);
		}

		private pushState(pState: IState): void {
			pState.setIndex(this._pStateList.length);
			this._pStateList.push(pState);
		}

		private pushBaseItem(pItem: IItem): void {
			pItem.setIndex(this._pBaseItemList.length);
			this._pBaseItemList.push(pItem);
		}

		private tryAddState(pState: IState, eType: EParserType): IState {
			var pRes = this.hasState(pState, eType);

			if (isNull(pRes)) {
				if (eType === EParserType.k_LR0) {
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
		}

		private hasEmptyRule(sSymbol: string): boolean {
			if (this.isTerminal(sSymbol)) {
				return false;
			}

			var pRulesDMap: IRuleDMap = this._pRulesDMap;
			for (var i in pRulesDMap[sSymbol]) {
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
				this._error(PARSER_GRAMMAR_ADD_OPERATION, {
					stateIndex: iIndex,
					grammarSymbol: this.convertGrammarSymbol(sSymbol),
					oldOperation: this._pSyntaxTable[iIndex][sSymbol],
					newOperation: pOperation
				});
			}
			pSyntaxTable[iIndex][sSymbol] = pOperation;
		}

		private addStateLink(pState: IState, pNextState: IState, sSymbol: string): void {
			var isAddState: boolean = pState.addNextState(sSymbol, pNextState);
			if (!isAddState) {
				this._error(PARSER_GRAMMAR_ADD_STATE_LINK, {
					stateIndex: pState.getIndex(),
					oldNextStateIndex: pState.getNextStateBySymbol(sSymbol),
					newNextStateIndex: pNextState.getIndex(),
					grammarSymbol: this.convertGrammarSymbol(sSymbol)
				});
			}
		}

		private firstTerminal(sSymbol: string): IMap<boolean> {
			if (this.isTerminal(sSymbol)) {
				return null;
			}

			if (isDef(this._pFirstTerminalsDMap[sSymbol])) {
				return this._pFirstTerminalsDMap[sSymbol];
			}

			var sRule: string, sName: string;
			var pNames: string[];
			var i: uint = 0, j: uint = 0, k: uint = 0;
			var pRulesMap: IRuleMap = this._pRulesDMap[sSymbol];

			var pTempRes: IMap<boolean> = <IMap<boolean>>{};
			var pRes: IMap<boolean>;

			var pRight: string[];
			var isFinish: boolean;

			pRes = this._pFirstTerminalsDMap[sSymbol] = <IMap<boolean>>{};

			if (this.hasEmptyRule(sSymbol)) {
				pRes[T_EMPTY] = true;
			}

			if (isNull(pRulesMap)) {
				return pRes;
			}

			var pRuleNames: string[] = Object.keys(pRulesMap);

			for (i = 0; i < pRuleNames.length; ++i) {
				sRule = pRuleNames[i];

				isFinish = false;
				pRight = pRulesMap[sRule].right;

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
					pRes[T_EMPTY] = true;
				}
			}

			return pRes;
		}

		private followTerminal(sSymbol: string): IMap<boolean> {
			if (isDef(this._pFollowTerminalsDMap[sSymbol])) {
				return this._pFollowTerminalsDMap[sSymbol];
			}

			var i: uint = 0, j: uint = 0, k: uint = 0, l: uint = 0, m: uint = 0;
			var pRulesDMap: IRuleDMap = this._pRulesDMap;
			var pRulesDMapKeys: string[], pRulesMapKeys: string[];

			var pRule: IRule;
			var pTempRes: IMap<boolean>;
			var pTempKeys: string[];
			var pRes: IMap<boolean>;

			var pRight: string[];
			var isFinish: boolean;

			var sFirstKey: string;
			var sSecondKey: string;

			pRes = this._pFollowTerminalsDMap[sSymbol] = <IMap<boolean>>{};

			if (isNull(pRulesDMap)) {
				return pRes;
			}

			pRulesDMapKeys = Object.keys(pRulesDMap);
			for (i = 0; i < pRulesDMapKeys.length; i++) {
				sFirstKey = pRulesDMapKeys[i];

				if (isNull(pRulesDMap[sFirstKey])) {
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
										pTempKeys = Object.keys(pTempRes);
										for (m = 0; m < pTempKeys.length; i++) {
											pRes[pTempKeys[m]] = true;
										}
									}

									if (!pTempRes[T_EMPTY]) {
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
		}

		private firstTerminalForSet(pSet: string[], pExpected: IMap<boolean>): IMap<boolean> {
			var i: uint = 0, j: uint = 0;

			var pTempRes: IMap<boolean>;
			var pRes: IMap<boolean> = <IMap<boolean>>{};

			var isEmpty: boolean;

			var pKeys: string[];
			var sKey: string;

			for (i = 0; i < pSet.length; i++) {
				pTempRes = this.firstTerminal(pSet[i]);

				if (isNull(pTempRes)) {
					pRes[pSet[i]] = true;
					return pRes;
				}

				isEmpty = false;

				pKeys = Object.keys(pTempRes);

				for (j = 0; j < pKeys.length; j++) {
					sKey = pKeys[j];

					if (sKey === T_EMPTY) {
						isEmpty = true;
						continue;
					}
					pRes[sKey] = true;
				}

				if (!isEmpty) {
					return pRes;
				}
			}

			if (!isNull(pExpected)) {
				pKeys = Object.keys(pExpected);
				for (j = 0; j < pKeys.length; j++) {
					pRes[pKeys[j]] = true;
				}
			}

			return pRes;
		}

		private generateRules(sGrammarSource: string): void {
			var pAllRuleList: string[] = sGrammarSource.split(/\r?\n/);
			var pTempRule: string[];
			var pRule: IRule;
			var isLexerBlock: boolean = false;

			this._pRulesDMap = <IRuleDMap>{};
			this._pAdditionalFuncInfoList = <IAdditionalFuncInfo[]>[];
			this._pRuleCreationModeMap = <IMap<int>>{};
			this._pGrammarSymbols = <IMap<string>>{};

			var i: uint = 0, j: uint = 0;

			var isAllNodeMode: boolean = bf.testAll(<int>this._eParseMode, <int>EParseMode.k_AllNode);
			var isNegateMode: boolean = bf.testAll(<int>this._eParseMode, <int>EParseMode.k_Negate);
			var isAddMode: boolean = bf.testAll(<int>this._eParseMode, <int>EParseMode.k_Add);

			var pSymbolsWithNodeMap: IMap<int> = this._pRuleCreationModeMap;
			var sName: string;

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
					this._pRulesDMap[pTempRule[0]] = <IRuleMap>{};
				}

				pRule = <IRule>{
					left: pTempRule[0],
					right: <string[]>[],
					index: 0
				};
				this._pSymbolMap[pTempRule[0]] = true;
				this._pGrammarSymbols[pTempRule[0]] = pTempRule[0];

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
							this._error(PARSER_GRAMMAR_BAD_ADDITIONAL_FUNC_NAME, { grammarLine: i });
						}

						var pFuncInfo: IAdditionalFuncInfo = <IAdditionalFuncInfo>{
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

			var pStateList: IState[] = this._pStateList;
			var pFuncInfoList: IAdditionalFuncInfo[] = this._pAdditionalFuncInfoList;
			var pFuncInfo: IAdditionalFuncInfo;
			var pRule: IRule;
			var iPos: uint = 0;
			var pFunc: IRuleFunction;
			var sGrammarSymbol: string;

			var i: uint = 0, j: uint = 0;

			var pFuncByStateDMap: IRuleFunctionDMap = <IRuleFunctionDMap>{};
			pFuncByStateDMap = this._pAdidtionalFunctByStateDMap = <IRuleFunctionDMap>{};

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
						if (!isDef(pFuncByStateDMap[pStateList[j].getIndex()])) {
							pFuncByStateDMap[pStateList[j].getIndex()] = <IRuleFunctionMap>{};
						}

						pFuncByStateDMap[pStateList[j].getIndex()][sGrammarSymbol] = pFunc;
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
			var pExpected: IMap<boolean> = <IMap<boolean>>{};
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
				return this.closure_LR(pState);
			}
		}

		private closure_LR0(pState: IState): IState {
			var pItemList: IItem[] = pState.getItems();
			var i: uint = 0, j: uint = 0;
			var sSymbol: string;
			var pKeys: string[];

			for (i = 0; i < pItemList.length; i++) {
				sSymbol = pItemList[i].mark();

				if (sSymbol !== END_POSITION && (!this.isTerminal(sSymbol))) {
					pKeys = Object.keys(this._pRulesDMap[sSymbol]);
					for (j = 0; j < pKeys.length; j++) {
						pState.tryPush_LR0(this._pRulesDMap[sSymbol][pKeys[j]], 0);
					}
				}
			}
			return pState;
		}

		private closure_LR(pState: IState): IState {
			var pItemList: IItem[] = <IItem[]>(pState.getItems());
			var i: uint = 0, j: uint = 0, k: uint = 0;
			var sSymbol: string;
			var pSymbols: IMap<boolean>;
			var pTempSet: string[];
			var isNewExpected: boolean = false;

			var pRulesMapKeys: string[], pSymbolsKeys: string[];

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
			var pItemList: IItem[] = pState.getItems();
			var i: uint = 0;
			var pNewState: IState = new State();

			for (i = 0; i < pItemList.length; i++) {
				if (sSymbol === pItemList[i].mark()) {
					pNewState.push(new Item(pItemList[i].getRule(), pItemList[i].getPosition() + 1));
				}
			}

			return pNewState;
		}

		private nextState_LR(pState: IState, sSymbol: string): IState {
			var pItemList: IItem[] = <IItem[]>pState.getItems();
			var i: uint = 0;
			var pNewState: IState = new State();

			for (i = 0; i < pItemList.length; i++) {
				if (sSymbol === pItemList[i].mark()) {
					pNewState.push(new Item(pItemList[i].getRule(), pItemList[i].getPosition() + 1, pItemList[i].getExpectedSymbols()));
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
				var pExpected: IMap<boolean> = <IMap<boolean>>{};
				pExpected[UNUSED_SYMBOL] = true;

				pState = new State();
				pState.push(new Item(pRule, iPos, pExpected));

				this.closure_LR(pState);
				this._pStatesTempMap[sIndex] = pState;

				return pState;
			}
		}

		private addLinkExpected(pItem: IItem, pItemX: IItem): void {
			var pTable: IBoolDMap = this._pExpectedExtensionDMap;
			var iIndex: uint = pItem.getIndex();

			if (!isDef(pTable[iIndex])) {
				pTable[iIndex] = <IMap<boolean>>{};
			}

			pTable[iIndex][pItemX.getIndex()] = true;
		}

		private determineExpected(pTestState: IState, sSymbol: string): void {
			var pStateX = pTestState.getNextStateBySymbol(sSymbol);

			if (isNull(pStateX)) {
				return;
			}

			var pItemListX: IItem[] = <IItem[]>pStateX.getItems();
			var pItemList: IItem[] = <IItem[]>pTestState.getItems();
			var pState: IState;
			var pItem: IItem;
			var i: uint = 0, j: uint = 0, k: string;

			var nBaseItemTest = pTestState.getNumBaseItems();
			var nBaseItemX = pStateX.getNumBaseItems();

			for (i = 0; i < nBaseItemTest; i++) {
				pState = this.closureForItem(pItemList[i].getRule(), pItemList[i].getPosition());

				for (j = 0; j < nBaseItemX; j++) {
					pItem = <IItem>pState.hasChildItem(pItemListX[j]);

					if (pItem) {
						var pExpected: IMap<boolean> = pItem.getExpectedSymbols();

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
			var i: uint = 0, j: uint = 0;
			var pStates: IState[] = this._pStateList;
			var pKeys: string[];

			for (i = 0; i < pStates.length; i++) {
				pKeys = Object.keys(this._pSymbolMap);
				for (j = 0; j < pKeys.length; j++) {
					this.determineExpected(pStates[i], pKeys[j]);
				}
			}
		}

		private expandExpected(): void {
			var pItemList: IItem[] = <IItem[]>this._pBaseItemList;
			var pTable: IBoolDMap = this._pExpectedExtensionDMap;
			var i: uint = 0, j: uint = 0, k: uint = 0;
			var sSymbol: string = "";
			var isNewExpected: boolean = false;

			pItemList[0].addExpected(END_SYMBOL);
			pItemList[0].setIsNewExpected(true);

			while (true) {
				if (i === pItemList.length) {
					if (!isNewExpected) {
						break;
					}
					isNewExpected = false;
					i = 0;
				}

				if (pItemList[i].getIsNewExpected() && isDefAndNotNull(pTable[i]) && isDefAndNotNull(pItemList[i].getExpectedSymbols())) {
					var pExpectedSymbols: string[] = Object.keys(pItemList[i].getExpectedSymbols());
					var pKeys: string[] = Object.keys(pTable[i]);

					for (j = 0; j < pExpectedSymbols.length; j++) {
						sSymbol = pExpectedSymbols[j];
						for (k = 0; k < pKeys.length; k++) {
							if (pItemList[<number><any>pKeys[k]].addExpected(sSymbol)) {
								isNewExpected = true;
							}
						}
					}
				}

				pItemList[i].setIsNewExpected(false);
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

			var i: uint = 0, j: uint = 0;
			var pStateList: IState[] = this._pStateList;
			var sSymbol: string = "";
			var pState: IState;
			var pSymbols: string[] = Object.keys(this._pSymbolMap);

			for (i = 0; i < pStateList.length; i++) {
				for (j = 0; j < pSymbols.length; j++) {
					sSymbol = pSymbols[j];
					pState = this.nextState_LR0(pStateList[i], sSymbol);

					if (!pState.isEmpty()) {
						pState = this.tryAddState(pState, EParserType.k_LR0);
						this.addStateLink(pStateList[i], pState, sSymbol);
					}
				}
			}
		}

		private generateStates_LR(): void {
			this._pFirstTerminalsDMap = <IBoolDMap>{};
			this.generateFirstState_LR();

			var i: uint = 0, j: uint = 0;
			var pStateList: IState[] = this._pStateList;
			var sSymbol: string = "";
			var pState: IState;
			var pSymbols: string[] = Object.keys(this._pSymbolMap);

			for (i = 0; i < pStateList.length; i++) {
				for (j = 0; j < pSymbols.length; j++) {
					sSymbol = pSymbols[j];
					pState = this.nextState_LR(pStateList[i], sSymbol);

					if (!pState.isEmpty()) {
						pState = this.tryAddState(pState, EParserType.k_LR1);
						this.addStateLink(pStateList[i], pState, sSymbol);
					}
				}
			}
		}

		private generateStates_LALR(): void {
			this._pStatesTempMap = <IMap<IState>>{};
			this._pBaseItemList = <IItem[]>[];
			this._pExpectedExtensionDMap = <IBoolDMap>{};
			this._pFirstTerminalsDMap = <IBoolDMap>{};

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
				num += this._pStateList[i].getNumBaseItems();
			}

			return num;
		}

		private printExpectedTable(): string {
			var i: uint = 0, j: uint = 0;
			var sMsg: string = "";

			var pKeys: string[] = Object.keys(this._pExpectedExtensionDMap);
			for (i = 0; i < pKeys.length; i++) {
				sMsg += "State " + this._pBaseItemList[<number><any>pKeys[i]].getState().getIndex() + ":   ";
				sMsg += this._pBaseItemList[<number><any>pKeys[i]].toString() + "  |----->\n";

				var pExtentions: string[] = Object.keys(this._pExpectedExtensionDMap[pKeys[i]]);
				for (j = 0; j < pExtentions.length; j++) {
					sMsg += "\t\t\t\t\t" + "State " + this._pBaseItemList[<number><any>pExtentions[j]].getState().getIndex() + ":   ";
					sMsg += this._pBaseItemList[<number><any>pExtentions[j]].toString() + "\n";
				}

				sMsg += "\n";
			}

			return sMsg;
		}

		private addReducing(pState: IState): void {
			var i: uint = 0, j: uint = 0;
			var pItemList: IItem[] = pState.getItems();

			for (i = 0; i < pItemList.length; i++) {
				if (pItemList[i].mark() === END_POSITION) {
					if (pItemList[i].getRule().left === START_SYMBOL) {
						this.pushInSyntaxTable(pState.getIndex(), END_SYMBOL, this._pSuccessOperation);
					}
					else {
						var pExpected = pItemList[i].getExpectedSymbols();

						var pKeys: string[] = Object.keys(pExpected);
						for (j = 0; j < pKeys.length; j++) {
							this.pushInSyntaxTable(pState.getIndex(), pKeys[j], this._pReduceOperationsMap[pItemList[i].getRule().index]);
						}
					}
				}
			}
		}

		private addShift(pState: IState) {
			var i: uint = 0;
			var pStateMap: IMap<IState> = pState.getNextStates();

			var pStateKeys: string[] = Object.keys(pStateMap);

			for (i = 0; i < pStateKeys.length; i++) {
				var sSymbol: string = pStateKeys[i];
				this.pushInSyntaxTable(pState.getIndex(), sSymbol, this._pShiftOperationsMap[pStateMap[sSymbol].getIndex()]);
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

			var i: uint = 0, j: uint = 0, k: uint = 0;

			for (i = 0; i < pStateList.length; i++) {
				this._pShiftOperationsMap[pStateList[i].getIndex()] = <IOperation>{
					type: EOperationType.k_Shift,
					index: pStateList[i].getIndex()
				};
			}

			var pRulesDMapKeys: string[] = Object.keys(this._pRulesDMap);
			for (j = 0; j < pRulesDMapKeys.length; j++) {
				var pRulesMapKeys: string[] = Object.keys(this._pRulesDMap[pRulesDMapKeys[j]]);
				for (k = 0; k < pRulesMapKeys.length; k++) {
					var sSymbol: string = pRulesMapKeys[k];
					var pRule: IRule = this._pRulesDMap[pRulesDMapKeys[j]][sSymbol];

					this._pReduceOperationsMap[sSymbol] = <IOperation>{
						type: EOperationType.k_Reduce,
						rule: pRule
					};
				}
			}

			//Build syntax table
			for (i = 0; i < pStateList.length; i++) {
				pState = pStateList[i];
				this.addReducing(pState);
				this.addShift(pState);
			}
		}

		private readToken(): IToken {
			return this._pLexer.getNextToken();
		}

		private operationAdditionalAction(iStateIndex: uint, sGrammarSymbol: string): EOperationType {
			var pFuncDMap: IRuleFunctionDMap = this._pAdidtionalFunctByStateDMap;

			if (!isNull(this._pAdidtionalFunctByStateDMap) &&
				isDef(pFuncDMap[iStateIndex]) &&
				isDef(pFuncDMap[iStateIndex][sGrammarSymbol])) {
				return pFuncDMap[iStateIndex][sGrammarSymbol].call(this);
			}

			return EOperationType.k_Ok;
		}

		private resumeParse(): EParserCode {
			try {
				var pTree: IParseTree = this._pSyntaxTree;
				var pStack: uint[] = this._pStack;
				var pSyntaxTable: IOperationDMap = this._pSyntaxTable;

				var isStop: boolean = false;
				var isError: boolean = false;
				var isPause: boolean = false;
				var pToken: IToken = isNull(this._pToken) ? this.readToken() : this._pToken;

				var pOperation: IOperation;
				var iRuleLength: uint;

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

								if (eAdditionalOperationCode === EOperationType.k_Error) {
									isError = true;
									isStop = true;
								}
								else if (eAdditionalOperationCode === EOperationType.k_Pause) {
									this._pToken = null;
									isStop = true;
									isPause = true;
								}
								else if (eAdditionalOperationCode === EOperationType.k_Ok) {
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

								if (eAdditionalOperationCode === EOperationType.k_Error) {
									isError = true;
									isStop = true;
								}
								else if (eAdditionalOperationCode === EOperationType.k_Pause) {
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
				return EParserCode.k_Error;
			}
			if (isPause) {
				return EParserCode.k_Pause;
			}

			if (!isError) {
				pTree.finishTree();
				if (isDef(this._fnFinishCallback)) {
					this._fnFinishCallback.call(this._pCaller, EParserCode.k_Ok, this.getParseFileName());
				}
				this._sFileName = "stdin";
				return EParserCode.k_Ok;
			}
			else {
				this._error(PARSER_SYNTAX_ERROR, pToken);
				if (isDef(this._fnFinishCallback)) {
					this._fnFinishCallback.call(this._pCaller, EParserCode.k_Error, this.getParseFileName());
				}
				this._sFileName = "stdin";
				return EParserCode.k_Error;
			}
		}

		private statesToString(isBaseOnly: boolean = true): string {
			if (!isDef(this._pStateList)) {
				return "";
			}

			var sMsg: string = "";
			var i: uint = 0;

			for (i = 0; i < this._pStateList.length; i++) {
				sMsg += this._pStateList[i].toString(isBaseOnly);
				sMsg += " ";
			}

			return sMsg;
		}

		private operationToString(pOperation: IOperation): string {
			var sOperation: string = "";

			switch (pOperation.type) {
				case EOperationType.k_Shift:
					sOperation = "SHIFT to state " + pOperation.index.toString();
					break;
				case EOperationType.k_Reduce:
					sOperation = "REDUCE by rule { " + this.ruleToString(pOperation.rule) + " }";
					break;
				case EOperationType.k_Success:
					sOperation = "SUCCESS";
					break;
			}

			return sOperation;
		}

		private ruleToString(pRule: IRule): string {
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
}
