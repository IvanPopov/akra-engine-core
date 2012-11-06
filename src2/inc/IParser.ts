#ifndef IPARSER_TS
#define IPARSER_TS

module akra.util {
	#define END_POSITION "END"
    #define T_EMPTY "EMPTY"
    #define UNKNOWN_TOKEN "UNNOWN"
    #define START_SYMBOL "S"
    #define UNUSED_SYMBOL "##"
    #define END_SYMBOL "$"
    #define LEXER_RULES "--LEXER--"
    #define FLAG_RULE_CREATE_NODE "--AN"
    #define FLAG_RULE_NOT_CREATE_NODE "--NN"
    #define FLAG_RULE_FUNCTION "--F"
    #define EOF "EOF"
    #define T_STRING "T_STRING"
    #define T_FLOAT "T_FLOAT"
    #define T_UINT "T_UINT"
    #define T_TYPE_ID "T_TYPE_ID"
    #define T_NON_TYPE_ID "T_NON_TYPE_ID"

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
        k_Optimize = 0x0008
    };


    export interface IRule {
        left: string;
        right: string[];
        index: uint;
    }

    export interface IFinishFunc {
        (eCode: EParserCode): void;
    }
    
    export interface IParseNode {
        children: IParseNode[];
        parent: IParseNode;
        name: string;
        value: string;

        start?: uint;
        end?: uint;
        line?: uint;
    }

    export interface IParseTree {
        setRoot(): void;

        setOptimizeMode(isOptimize: bool): void;

        addNode(pNode: IParseNode): void;
        reduceByRule(pRule: IRule, eCreate: ENodeCreateMode);

        toString(): string;

        clone(): IParseTree;

        root: IParseNode;
    }

    export interface ILexer {
        addPunctuator(sValue: string, sName?: string): string;
        addKeyword(sValue: string, sName: string): string;

        init(sSource: string): void;

        getNextToken(): IToken;
    }

    export interface IParser {

        isTypeId(sValue: string): bool;

        returnCode(pNode: IParseNode): string;

        init(sGrammar: string, eType?: EParserType, eMode?: EParseMode): bool;

        parse(sSource: string, isSync?: bool, fnFinishCallback?: IFinishFunc, pCaller?: any): EParserCode;

        pause(): EParserCode;
        resume(): EParserCode;
    }
}

#endif