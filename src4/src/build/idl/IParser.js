/// <reference path="IMap.ts" />
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
var akra;
(function (akra) {
    (function (ENodeCreateMode) {
        ENodeCreateMode[ENodeCreateMode["k_Default"] = 0] = "k_Default";
        ENodeCreateMode[ENodeCreateMode["k_Necessary"] = 1] = "k_Necessary";
        ENodeCreateMode[ENodeCreateMode["k_Not"] = 2] = "k_Not";
    })(akra.ENodeCreateMode || (akra.ENodeCreateMode = {}));
    var ENodeCreateMode = akra.ENodeCreateMode;

    (function (EParserCode) {
        EParserCode[EParserCode["k_Pause"] = 0] = "k_Pause";
        EParserCode[EParserCode["k_Ok"] = 1] = "k_Ok";
        EParserCode[EParserCode["k_Error"] = 2] = "k_Error";
    })(akra.EParserCode || (akra.EParserCode = {}));
    var EParserCode = akra.EParserCode;

    (function (EParserType) {
        EParserType[EParserType["k_LR0"] = 0] = "k_LR0";
        EParserType[EParserType["k_LR1"] = 1] = "k_LR1";
        EParserType[EParserType["k_LALR"] = 2] = "k_LALR";
    })(akra.EParserType || (akra.EParserType = {}));
    var EParserType = akra.EParserType;

    (function (EParseMode) {
        EParseMode[EParseMode["k_AllNode"] = 0x0001] = "k_AllNode";
        EParseMode[EParseMode["k_Negate"] = 0x0002] = "k_Negate";
        EParseMode[EParseMode["k_Add"] = 0x0004] = "k_Add";
        EParseMode[EParseMode["k_Optimize"] = 0x0008] = "k_Optimize";
        EParseMode[EParseMode["k_DebugMode"] = 0x0010] = "k_DebugMode";
    })(akra.EParseMode || (akra.EParseMode = {}));
    var EParseMode = akra.EParseMode;

    (function (ETokenType) {
        ETokenType[ETokenType["k_NumericLiteral"] = 1] = "k_NumericLiteral";
        ETokenType[ETokenType["k_CommentLiteral"] = 2] = "k_CommentLiteral";
        ETokenType[ETokenType["k_StringLiteral"] = 3] = "k_StringLiteral";
        ETokenType[ETokenType["k_PunctuatorLiteral"] = 4] = "k_PunctuatorLiteral";
        ETokenType[ETokenType["k_WhitespaceLiteral"] = 5] = "k_WhitespaceLiteral";
        ETokenType[ETokenType["k_IdentifierLiteral"] = 6] = "k_IdentifierLiteral";
        ETokenType[ETokenType["k_KeywordLiteral"] = 7] = "k_KeywordLiteral";
        ETokenType[ETokenType["k_Unknown"] = 8] = "k_Unknown";
        ETokenType[ETokenType["k_End"] = 9] = "k_End";
    })(akra.ETokenType || (akra.ETokenType = {}));
    var ETokenType = akra.ETokenType;

    (function (EOperationType) {
        EOperationType[EOperationType["k_Error"] = 100] = "k_Error";
        EOperationType[EOperationType["k_Shift"] = 101] = "k_Shift";
        EOperationType[EOperationType["k_Reduce"] = 102] = "k_Reduce";
        EOperationType[EOperationType["k_Success"] = 103] = "k_Success";
        EOperationType[EOperationType["k_Pause"] = 104] = "k_Pause";
        EOperationType[EOperationType["k_Ok"] = 105] = "k_Ok";
    })(akra.EOperationType || (akra.EOperationType = {}));
    var EOperationType = akra.EOperationType;
})(akra || (akra = {}));
//# sourceMappingURL=IParser.js.map
