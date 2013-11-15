// AIParser interface

/// <reference path="AIMap.ts" />

// #define END_POSITION "END"
// #define T_EMPTY "EMPTY"
// #define UNKNOWN_TOKEN "UNNOWN"
// #define START_SYMBOL "S"
// #define UNUSED_SYMBOL "##"
// #define END_SYMBOL "$"
// #define LEXER_RULES "--LEXER--"
// #define FLAG_RULE_CREATE_NODE "--AN"
// #define FLAG_RULE_NOT_CREATE_NODE "--NN"
// #define FLAG_RULE_FUNCTION "--F"
// #define EOF "EOF"
// #define T_STRING "T_STRING"
// #define T_FLOAT "T_FLOAT"
// #define T_UINT "T_UINT"
// #define T_TYPE_ID "T_TYPE_ID"
// #define T_NON_TYPE_ID "T_NON_TYPE_ID"

enum AENodeCreateMode {
	k_Default,
	k_Necessary,
	k_Not
}

enum AEParserCode {
	k_Pause,
	k_Ok,
	k_Error
}

enum AEParserType {
	k_LR0,
	k_LR1,
	k_LALR
}

enum AEParseMode {
	k_AllNode = 0x0001,
	k_Negate = 0x0002,
	k_Add = 0x0004,
	k_Optimize = 0x0008,
	k_DebugMode = 0x0010
}

enum AETokenType {
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

interface AIToken {
	value: string;
	start: uint;
	end: uint;
	line: uint;

	name?: string;
	type?: AETokenType;
}


interface AIRule {
	left: string;
	right: string[];
	index: uint;
}

interface AIFinishFunc {
	(eCode: AEParserCode, sFileName: string): void;
}

enum AEOperationType {
	k_Error = 100,
	k_Shift,
	k_Reduce,
	k_Success,
	k_Pause,
	k_Ok
}

interface AIRuleFunction {
	(): AEOperationType;
}

interface AIParseNode {
	children: AIParseNode[];
	parent: AIParseNode;
	name: string;
	value: string;
	
	//Data for next-step analyze
	isAnalyzed: boolean;
	position: uint;

	start?: uint;
	end?: uint;
	line?: uint;
}

interface AIParseTree {
	setRoot(): void;

	setOptimizeMode(isOptimize: boolean): void;

	addNode(pNode: AIParseNode): void;
	reduceByRule(pRule: AIRule, eCreate: AENodeCreateMode);

	toString(): string;

	clone(): AIParseTree;

	getNodes(): AIParseNode[];
	getLastNode(): AIParseNode;

	root: AIParseNode;
}

interface AILexer {
	addPunctuator(sValue: string, sName?: string): string;
	addKeyword(sValue: string, sName: string): string;

	getTerminalValueByName(sName: string): string;

	init(sSource: string): void;

	getNextToken(): AIToken;
	_getIndex(): uint;
	_setSource(sSource: string): void;
	_setIndex(iIndex: uint): void;
}

interface AIParserState {
	source: string;
	index: uint;
	fileName: string;
	tree: AIParseTree;
	types: AIBoolMap;
	stack: uint[];
	token: AIToken;
	fnCallback: AIFinishFunc;
	caller: any;
}

interface AIParser {

	isTypeId(sValue: string): boolean;

	returnCode(pNode: AIParseNode): string;

	init(sGrammar: string, eMode?: AEParseMode, eType?: AEParserType): boolean;

	parse(sSource: string, fnFinishCallback?: AIFinishFunc, pCaller?: any): AEParserCode;

	setParseFileName(sFileName: string): void;
	getParseFileName(): string;

	pause(): AEParserCode;
	resume(): AEParserCode;

	getSyntaxTree(): AIParseTree;

	printStates(isPrintOnlyBase?: boolean): void;
	printState(iStateIndex: uint, isPrintOnlyBase?: boolean): void; 

	getGrammarSymbols(): AIStringMap;

	_saveState(): AIParserState;
	_loadState(pState: AIParserState): void;
	
	// _getLexer(): AILexer;
	// _getSource(): string;
	// _getIndex(): uint;
	// _getTypeMap(): BoolMap;
	// _getStack(): uint[];
	// _getToken(): AIToken;
	// _getCallback(): AIFinishFunc;
	// _getCaller(): any;

	// _setParserState(sSource: string,
	//				 iIndex: uint,
	//				 sFileName: string,
	//				 pTree: AIParseTree,
	//				 pTypes: BoolMap,
	//				 pStack: uint[],
	//				 pToken: AIToken,
	//				 fnCallback: AIFinishFunc,
	//				 pCaller: any): void;
}

