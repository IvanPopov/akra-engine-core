/// <reference path="../IMap.ts" />
var akra;
(function (akra) {
    (function (parser) {
        (function (ENodeCreateMode) {
            ENodeCreateMode[ENodeCreateMode["k_Default"] = 0] = "k_Default";
            ENodeCreateMode[ENodeCreateMode["k_Necessary"] = 1] = "k_Necessary";
            ENodeCreateMode[ENodeCreateMode["k_Not"] = 2] = "k_Not";
        })(parser.ENodeCreateMode || (parser.ENodeCreateMode = {}));
        var ENodeCreateMode = parser.ENodeCreateMode;

        (function (EParserCode) {
            EParserCode[EParserCode["k_Pause"] = 0] = "k_Pause";
            EParserCode[EParserCode["k_Ok"] = 1] = "k_Ok";
            EParserCode[EParserCode["k_Error"] = 2] = "k_Error";
        })(parser.EParserCode || (parser.EParserCode = {}));
        var EParserCode = parser.EParserCode;

        (function (EParserType) {
            EParserType[EParserType["k_LR0"] = 0] = "k_LR0";
            EParserType[EParserType["k_LR1"] = 1] = "k_LR1";
            EParserType[EParserType["k_LALR"] = 2] = "k_LALR";
        })(parser.EParserType || (parser.EParserType = {}));
        var EParserType = parser.EParserType;

        (function (EParseMode) {
            EParseMode[EParseMode["k_AllNode"] = 0x0001] = "k_AllNode";
            EParseMode[EParseMode["k_Negate"] = 0x0002] = "k_Negate";
            EParseMode[EParseMode["k_Add"] = 0x0004] = "k_Add";
            EParseMode[EParseMode["k_Optimize"] = 0x0008] = "k_Optimize";
            EParseMode[EParseMode["k_DebugMode"] = 0x0010] = "k_DebugMode";
        })(parser.EParseMode || (parser.EParseMode = {}));
        var EParseMode = parser.EParseMode;

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
        })(parser.ETokenType || (parser.ETokenType = {}));
        var ETokenType = parser.ETokenType;

        (function (EOperationType) {
            EOperationType[EOperationType["k_Error"] = 100] = "k_Error";
            EOperationType[EOperationType["k_Shift"] = 101] = "k_Shift";
            EOperationType[EOperationType["k_Reduce"] = 102] = "k_Reduce";
            EOperationType[EOperationType["k_Success"] = 103] = "k_Success";
            EOperationType[EOperationType["k_Pause"] = 104] = "k_Pause";
            EOperationType[EOperationType["k_Ok"] = 105] = "k_Ok";
        })(parser.EOperationType || (parser.EOperationType = {}));
        var EOperationType = parser.EOperationType;
    })(akra.parser || (akra.parser = {}));
    var parser = akra.parser;
})(akra || (akra = {}));
//# sourceMappingURL=IParser.js.map
