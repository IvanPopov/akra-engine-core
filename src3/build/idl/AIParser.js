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
var AENodeCreateMode;
(function (AENodeCreateMode) {
    AENodeCreateMode[AENodeCreateMode["k_Default"] = 0] = "k_Default";
    AENodeCreateMode[AENodeCreateMode["k_Necessary"] = 1] = "k_Necessary";
    AENodeCreateMode[AENodeCreateMode["k_Not"] = 2] = "k_Not";
})(AENodeCreateMode || (AENodeCreateMode = {}));

var AEParserCode;
(function (AEParserCode) {
    AEParserCode[AEParserCode["k_Pause"] = 0] = "k_Pause";
    AEParserCode[AEParserCode["k_Ok"] = 1] = "k_Ok";
    AEParserCode[AEParserCode["k_Error"] = 2] = "k_Error";
})(AEParserCode || (AEParserCode = {}));

var AEParserType;
(function (AEParserType) {
    AEParserType[AEParserType["k_LR0"] = 0] = "k_LR0";
    AEParserType[AEParserType["k_LR1"] = 1] = "k_LR1";
    AEParserType[AEParserType["k_LALR"] = 2] = "k_LALR";
})(AEParserType || (AEParserType = {}));

var AEParseMode;
(function (AEParseMode) {
    AEParseMode[AEParseMode["k_AllNode"] = 0x0001] = "k_AllNode";
    AEParseMode[AEParseMode["k_Negate"] = 0x0002] = "k_Negate";
    AEParseMode[AEParseMode["k_Add"] = 0x0004] = "k_Add";
    AEParseMode[AEParseMode["k_Optimize"] = 0x0008] = "k_Optimize";
    AEParseMode[AEParseMode["k_DebugMode"] = 0x0010] = "k_DebugMode";
})(AEParseMode || (AEParseMode = {}));

var AETokenType;
(function (AETokenType) {
    AETokenType[AETokenType["k_NumericLiteral"] = 1] = "k_NumericLiteral";
    AETokenType[AETokenType["k_CommentLiteral"] = 2] = "k_CommentLiteral";
    AETokenType[AETokenType["k_StringLiteral"] = 3] = "k_StringLiteral";
    AETokenType[AETokenType["k_PunctuatorLiteral"] = 4] = "k_PunctuatorLiteral";
    AETokenType[AETokenType["k_WhitespaceLiteral"] = 5] = "k_WhitespaceLiteral";
    AETokenType[AETokenType["k_IdentifierLiteral"] = 6] = "k_IdentifierLiteral";
    AETokenType[AETokenType["k_KeywordLiteral"] = 7] = "k_KeywordLiteral";
    AETokenType[AETokenType["k_Unknown"] = 8] = "k_Unknown";
    AETokenType[AETokenType["k_End"] = 9] = "k_End";
})(AETokenType || (AETokenType = {}));

var AEOperationType;
(function (AEOperationType) {
    AEOperationType[AEOperationType["k_Error"] = 100] = "k_Error";
    AEOperationType[AEOperationType["k_Shift"] = 101] = "k_Shift";
    AEOperationType[AEOperationType["k_Reduce"] = 102] = "k_Reduce";
    AEOperationType[AEOperationType["k_Success"] = 103] = "k_Success";
    AEOperationType[AEOperationType["k_Pause"] = 104] = "k_Pause";
    AEOperationType[AEOperationType["k_Ok"] = 105] = "k_Ok";
})(AEOperationType || (AEOperationType = {}));
//# sourceMappingURL=AIParser.js.map
