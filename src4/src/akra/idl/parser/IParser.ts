/// <reference path="../IMap.ts" />

module akra.parser {

	export enum ENodeCreateMode {
		k_Default,
		k_Necessary,
		k_Not
	}

	export enum EParserCode {
		k_Pause,
		k_Ok,
		k_Error
	}

	export enum EParserType {
		k_LR0,
		k_LR1,
		k_LALR
	}

	export enum EParseMode {
		k_AllNode = 0x0001,
		k_Negate = 0x0002,
		k_Add = 0x0004,
		k_Optimize = 0x0008,
		k_DebugMode = 0x0010
	}

	export enum ETokenType {
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

	export interface IToken {
		value: string;
		start: uint;
		end: uint;
		line: uint;

		name?: string;
		type?: ETokenType;
	}


	export interface IRule {
		left: string;
		right: string[];
		index: uint;
	}

	export interface IFinishFunc {
		(eCode: EParserCode, sFileName: string): void;
	}

	export enum EOperationType {
		k_Error = 100,
		k_Shift,
		k_Reduce,
		k_Success,
		k_Pause,
		k_Ok
	}

	export interface IRuleFunction {
		(): EOperationType;
	}

	export interface IParseNode {
		children: IParseNode[];
		parent: IParseNode;
		name: string;
		value: string;
		
		//Data for next-step analyze
		isAnalyzed: boolean;
		position: uint;

		start?: uint;
		end?: uint;
		line?: uint;
	}

	export interface IParseTree {
		setRoot(): void;

		setOptimizeMode(isOptimize: boolean): void;

		addNode(pNode: IParseNode): void;
		reduceByRule(pRule: IRule, eCreate: ENodeCreateMode);

		toString(): string;

		clone(): IParseTree;

		getNodes(): IParseNode[];
		getLastNode(): IParseNode;

		root: IParseNode;
	}

	export interface ILexer {
		addPunctuator(sValue: string, sName?: string): string;
		addKeyword(sValue: string, sName: string): string;

		getTerminalValueByName(sName: string): string;

		init(sSource: string): void;

		getNextToken(): IToken;
		_getIndex(): uint;
		_setSource(sSource: string): void;
		_setIndex(iIndex: uint): void;
	}

	export interface IParserState {
		source: string;
		index: uint;
		fileName: string;
		tree: IParseTree;
		types: IMap<boolean>;
		stack: uint[];
		token: IToken;
		fnCallback: IFinishFunc;
		caller: any;
	}

	export interface IParser {

		isTypeId(sValue: string): boolean;

		returnCode(pNode: IParseNode): string;

		init(sGrammar: string, eMode?: EParseMode, eType?: EParserType): boolean;

		parse(sSource: string, fnFinishCallback?: IFinishFunc, pCaller?: any): EParserCode;

		setParseFileName(sFileName: string): void;
		getParseFileName(): string;

		pause(): EParserCode;
		resume(): EParserCode;

		getSyntaxTree(): IParseTree;

		printStates(isPrintOnlyBase?: boolean): void;
		printState(iStateIndex: uint, isPrintOnlyBase?: boolean): void; 

		getGrammarSymbols(): IMap<string>;

		_saveState(): IParserState;
		_loadState(pState: IParserState): void;
		
		// _getLexer(): ILexer;
		// _getSource(): string;
		// _getIndex(): uint;
		// _getTypeMap(): BoolMap;
		// _getStack(): uint[];
		// _getToken(): IToken;
		// _getCallback(): IFinishFunc;
		// _getCaller(): any;

		// _setParserState(sSource: string,
		//				 iIndex: uint,
		//				 sFileName: string,
		//				 pTree: IParseTree,
		//				 pTypes: BoolMap,
		//				 pStack: uint[],
		//				 pToken: IToken,
		//				 fnCallback: IFinishFunc,
		//				 pCaller: any): void;
	}

}