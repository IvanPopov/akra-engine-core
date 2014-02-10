/// <reference path="../idl/parser/IParser.ts" />
var akra;
(function (akra) {
    /// <reference path="../logger.ts" />
    /// <reference path="symbols.ts" />
    (function (parser) {
        /** @const */
        var LEXER_UNKNOWN_TOKEN = 2101;

        /** @const */
        var LEXER_BAD_TOKEN = 2102;

        akra.logger.registerCodeFamily(2000, 2199, "ParserSyntaxErrors");

        akra.logger.registerCode(LEXER_UNKNOWN_TOKEN, "Unknown token: {tokenValue}");
        akra.logger.registerCode(LEXER_BAD_TOKEN, "Bad token: {tokenValue}");

        //interface AIStateMap {
        //    [index: string]: AIState;
        //}
        var Lexer = (function () {
            function Lexer(pParser) {
                this._iLineNumber = 0;
                this._iColumnNumber = 0;
                this._sSource = "";
                this._iIndex = 0;
                this._pParser = pParser;
                this._pPunctuatorsMap = {};
                this._pKeywordsMap = {};
                this._pPunctuatorsFirstSymbols = {};
            }
            Lexer.getPunctuatorName = function (sValue) {
                return "T_PUNCTUATOR_" + sValue.charCodeAt(0);
            };

            Lexer.prototype.addPunctuator = function (sValue, sName) {
                if (typeof sName === "undefined") { sName = Lexer.getPunctuatorName(sValue); }
                this._pPunctuatorsMap[sValue] = sName;
                this._pPunctuatorsFirstSymbols[sValue[0]] = true;
                return sName;
            };

            Lexer.prototype.addKeyword = function (sValue, sName) {
                this._pKeywordsMap[sValue] = sName;
                return sName;
            };

            Lexer.prototype.getTerminalValueByName = function (sName) {
                var sValue = "";

                for (sValue in this._pPunctuatorsMap) {
                    if (this._pPunctuatorsMap[sValue] === sName) {
                        return sValue;
                    }
                }

                for (sValue in this._pKeywordsMap) {
                    if (this._pKeywordsMap[sValue] === sName) {
                        return sValue;
                    }
                }

                return sName;
            };

            Lexer.prototype.init = function (sSource) {
                this._sSource = sSource;
                this._iLineNumber = 0;
                this._iColumnNumber = 0;
                this._iIndex = 0;
            };

            Lexer.prototype.getNextToken = function () {
                var ch = this.currentChar();
                if (!ch) {
                    return {
                        name: akra.parser.END_SYMBOL,
                        value: akra.parser.END_SYMBOL,
                        start: this._iColumnNumber,
                        end: this._iColumnNumber,
                        line: this._iLineNumber
                    };
                }
                var eType = this.identityTokenType();
                var pToken;
                switch (eType) {
                    case 1 /* k_NumericLiteral */:
                        pToken = this.scanNumber();
                        break;
                    case 2 /* k_CommentLiteral */:
                        this.scanComment();
                        pToken = this.getNextToken();
                        break;
                    case 3 /* k_StringLiteral */:
                        pToken = this.scanString();
                        break;
                    case 4 /* k_PunctuatorLiteral */:
                        pToken = this.scanPunctuator();
                        break;
                    case 6 /* k_IdentifierLiteral */:
                        pToken = this.scanIdentifier();
                        break;
                    case 5 /* k_WhitespaceLiteral */:
                        this.scanWhiteSpace();
                        pToken = this.getNextToken();
                        break;
                    default:
                        this._error(LEXER_UNKNOWN_TOKEN, {
                            name: akra.parser.UNKNOWN_TOKEN,
                            value: ch + this._sSource[this._iIndex + 1],
                            start: this._iColumnNumber,
                            end: this._iColumnNumber + 1,
                            line: this._iLineNumber
                        });
                }
                return pToken;
            };

            Lexer.prototype._getIndex = function () {
                return this._iIndex;
            };

            Lexer.prototype._setSource = function (sSource) {
                this._sSource = sSource;
            };

            Lexer.prototype._setIndex = function (iIndex) {
                this._iIndex = iIndex;
            };

            Lexer.prototype._error = function (eCode, pToken) {
                var pLocation = {
                    file: this._pParser.getParseFileName(),
                    line: this._iLineNumber
                };
                var pInfo = {
                    tokenValue: pToken.value,
                    tokenType: pToken.type
                };

                var pLogEntity = { code: eCode, info: pInfo, location: pLocation };

                akra.logger.error(pLogEntity);

                throw new Error(eCode.toString());
            };

            Lexer.prototype.identityTokenType = function () {
                if (this.isIdentifierStart()) {
                    return 6 /* k_IdentifierLiteral */;
                }
                if (this.isWhiteSpaceStart()) {
                    return 5 /* k_WhitespaceLiteral */;
                }
                if (this.isStringStart()) {
                    return 3 /* k_StringLiteral */;
                }
                if (this.isCommentStart()) {
                    return 2 /* k_CommentLiteral */;
                }
                if (this.isNumberStart()) {
                    return 1 /* k_NumericLiteral */;
                }
                if (this.isPunctuatorStart()) {
                    return 4 /* k_PunctuatorLiteral */;
                }
                return 8 /* k_Unknown */;
            };

            Lexer.prototype.isNumberStart = function () {
                var ch = this.currentChar();

                if ((ch >= "0") && (ch <= "9")) {
                    return true;
                }

                var ch1 = this.nextChar();
                if (ch === "." && (ch1 >= "0") && (ch1 <= "9")) {
                    return true;
                }

                return false;
            };

            Lexer.prototype.isCommentStart = function () {
                var ch = this.currentChar();
                var ch1 = this.nextChar();

                if (ch === "/" && (ch1 === "/" || ch1 === "*")) {
                    return true;
                }

                return false;
            };

            Lexer.prototype.isStringStart = function () {
                var ch = this.currentChar();
                if (ch === "\"" || ch === "'") {
                    return true;
                }
                return false;
            };

            Lexer.prototype.isPunctuatorStart = function () {
                var ch = this.currentChar();
                if (this._pPunctuatorsFirstSymbols[ch]) {
                    return true;
                }
                return false;
            };

            Lexer.prototype.isWhiteSpaceStart = function () {
                var ch = this.currentChar();
                if (ch === " " || ch === "\n" || ch === "\r" || ch === "\t") {
                    return true;
                }
                return false;
            };

            Lexer.prototype.isIdentifierStart = function () {
                var ch = this.currentChar();
                if ((ch === "_") || (ch >= "a" && ch <= "z") || (ch >= "A" && ch <= "Z")) {
                    return true;
                }
                return false;
            };

            Lexer.prototype.isLineTerminator = function (sSymbol) {
                return (sSymbol === "\n" || sSymbol === "\r" || sSymbol === "\u2028" || sSymbol === "\u2029");
            };

            Lexer.prototype.isWhiteSpace = function (sSymbol) {
                return (sSymbol === " ") || (sSymbol === "\t");
            };

            Lexer.prototype.isKeyword = function (sValue) {
                return !!(this._pKeywordsMap[sValue]);
            };

            Lexer.prototype.isPunctuator = function (sValue) {
                return !!(this._pPunctuatorsMap[sValue]);
            };

            Lexer.prototype.nextChar = function () {
                return this._sSource[this._iIndex + 1];
            };

            Lexer.prototype.currentChar = function () {
                return this._sSource[this._iIndex];
            };

            Lexer.prototype.readNextChar = function () {
                this._iIndex++;
                this._iColumnNumber++;
                return this._sSource[this._iIndex];
            };

            Lexer.prototype.scanString = function () {
                var chFirst = this.currentChar();
                var sValue = chFirst;
                var ch = "";
                var chPrevious = chFirst;
                var isGoodFinish = false;
                var iStart = this._iColumnNumber;

                while (true) {
                    ch = this.readNextChar();
                    if (!ch) {
                        break;
                    }
                    sValue += ch;
                    if (ch === chFirst && chPrevious !== "\\") {
                        isGoodFinish = true;
                        this.readNextChar();
                        break;
                    }
                    chPrevious = ch;
                }

                if (isGoodFinish) {
                    return {
                        name: akra.parser.T_STRING,
                        value: sValue,
                        start: iStart,
                        end: this._iColumnNumber - 1,
                        line: this._iLineNumber
                    };
                } else {
                    if (!ch) {
                        ch = akra.parser.EOF;
                    }
                    sValue += ch;

                    this._error(LEXER_BAD_TOKEN, {
                        type: 3 /* k_StringLiteral */,
                        value: sValue,
                        start: iStart,
                        end: this._iColumnNumber,
                        line: this._iLineNumber
                    });
                    return null;
                }
            };

            Lexer.prototype.scanPunctuator = function () {
                var sValue = this.currentChar();
                var ch;
                var iStart = this._iColumnNumber;

                while (true) {
                    ch = this.readNextChar();
                    if (ch) {
                        sValue += ch;
                        this._iColumnNumber++;
                        if (!this.isPunctuator(sValue)) {
                            sValue = sValue.slice(0, sValue.length - 1);
                            break;
                        }
                    } else {
                        break;
                    }
                }

                return {
                    name: this._pPunctuatorsMap[sValue],
                    value: sValue,
                    start: iStart,
                    end: this._iColumnNumber - 1,
                    line: this._iLineNumber
                };
            };

            Lexer.prototype.scanNumber = function () {
                var ch = this.currentChar();
                var sValue = "";
                var isFloat = false;
                var chPrevious = ch;
                var isGoodFinish = false;
                var iStart = this._iColumnNumber;
                var isE = false;

                if (ch === ".") {
                    sValue += 0;
                    isFloat = true;
                }

                sValue += ch;

                while (true) {
                    ch = this.readNextChar();
                    if (ch === ".") {
                        if (isFloat) {
                            break;
                        } else {
                            isFloat = true;
                        }
                    } else if (ch === "e") {
                        if (isE) {
                            break;
                        } else {
                            isE = true;
                        }
                    } else if (((ch === "+" || ch === "-") && chPrevious === "e")) {
                        sValue += ch;
                        chPrevious = ch;
                        continue;
                    } else if (ch === "f" && isFloat) {
                        ch = this.readNextChar();
                        if ((ch >= "a" && ch <= "z") || (ch >= "A" && ch <= "Z")) {
                            break;
                        }
                        isGoodFinish = true;
                        break;
                    } else if ((ch >= "a" && ch <= "z") || (ch >= "A" && ch <= "Z")) {
                        break;
                    } else if (!((ch >= "0") && (ch <= "9")) || !ch) {
                        if ((isE && chPrevious !== "+" && chPrevious !== "-" && chPrevious !== "e") || !isE) {
                            isGoodFinish = true;
                        }
                        break;
                    }
                    sValue += ch;
                    chPrevious = ch;
                }

                if (isGoodFinish) {
                    var sName = isFloat ? akra.parser.T_FLOAT : akra.parser.T_UINT;
                    return {
                        name: sName,
                        value: sValue,
                        start: iStart,
                        end: this._iColumnNumber - 1,
                        line: this._iLineNumber
                    };
                } else {
                    if (!ch) {
                        ch = akra.parser.EOF;
                    }
                    sValue += ch;
                    this._error(LEXER_BAD_TOKEN, {
                        type: 1 /* k_NumericLiteral */,
                        value: sValue,
                        start: iStart,
                        end: this._iColumnNumber,
                        line: this._iLineNumber
                    });
                    return null;
                }
            };

            Lexer.prototype.scanIdentifier = function () {
                var ch = this.currentChar();
                var sValue = ch;
                var iStart = this._iColumnNumber;
                var isGoodFinish = false;

                while (true) {
                    ch = this.readNextChar();
                    if (!ch) {
                        isGoodFinish = true;
                        break;
                    }
                    if (!((ch === "_") || (ch >= "a" && ch <= "z") || (ch >= "A" && ch <= "Z") || (ch >= "0" && ch <= "9"))) {
                        isGoodFinish = true;
                        break;
                    }
                    sValue += ch;
                }

                if (isGoodFinish) {
                    if (this.isKeyword(sValue)) {
                        return {
                            name: this._pKeywordsMap[sValue],
                            value: sValue,
                            start: iStart,
                            end: this._iColumnNumber - 1,
                            line: this._iLineNumber
                        };
                    } else {
                        var sName = this._pParser.isTypeId(sValue) ? akra.parser.T_TYPE_ID : akra.parser.T_NON_TYPE_ID;
                        return {
                            name: sName,
                            value: sValue,
                            start: iStart,
                            end: this._iColumnNumber - 1,
                            line: this._iLineNumber
                        };
                    }
                } else {
                    if (!ch) {
                        ch = akra.parser.EOF;
                    }
                    sValue += ch;
                    this._error(LEXER_BAD_TOKEN, {
                        type: 6 /* k_IdentifierLiteral */,
                        value: sValue,
                        start: iStart,
                        end: this._iColumnNumber,
                        line: this._iLineNumber
                    });
                    return null;
                }
            };

            Lexer.prototype.scanWhiteSpace = function () {
                var ch = this.currentChar();

                while (true) {
                    if (!ch) {
                        break;
                    }
                    if (this.isLineTerminator(ch)) {
                        if (ch === "\r" && this.nextChar() === "\n") {
                            this._iLineNumber--;
                        }
                        this._iLineNumber++;
                        ch = this.readNextChar();
                        this._iColumnNumber = 0;
                        continue;
                    } else if (ch === "\t") {
                        this._iColumnNumber += 3;
                    } else if (ch !== " ") {
                        break;
                    }
                    ch = this.readNextChar();
                }

                return true;
            };

            Lexer.prototype.scanComment = function () {
                var sValue = this.currentChar();
                var ch = this.readNextChar();
                sValue += ch;

                if (ch === "/") {
                    while (true) {
                        ch = this.readNextChar();
                        if (!ch) {
                            break;
                        }
                        if (this.isLineTerminator(ch)) {
                            if (ch === "\r" && this.nextChar() === "\n") {
                                this._iLineNumber--;
                            }
                            this._iLineNumber++;
                            this.readNextChar();
                            this._iColumnNumber = 0;
                            break;
                        }
                        sValue += ch;
                    }

                    return true;
                } else {
                    //Multiline Comment
                    var chPrevious = ch;
                    var isGoodFinish = false;
                    var iStart = this._iColumnNumber;

                    while (true) {
                        ch = this.readNextChar();
                        if (!ch) {
                            break;
                        }
                        sValue += ch;
                        if (ch === "/" && chPrevious === "*") {
                            isGoodFinish = true;
                            this.readNextChar();
                            break;
                        }
                        if (this.isLineTerminator(ch)) {
                            if (ch === "\r" && this.nextChar() === "\n") {
                                this._iLineNumber--;
                            }
                            this._iLineNumber++;
                            this._iColumnNumber = -1;
                        }
                        chPrevious = ch;
                    }

                    if (isGoodFinish) {
                        return true;
                    } else {
                        if (!ch) {
                            ch = akra.parser.EOF;
                        }
                        sValue += ch;
                        this._error(LEXER_BAD_TOKEN, {
                            type: 2 /* k_CommentLiteral */,
                            value: sValue,
                            start: iStart,
                            end: this._iColumnNumber,
                            line: this._iLineNumber
                        });
                        return false;
                    }
                }
            };
            return Lexer;
        })();
        parser.Lexer = Lexer;
    })(akra.parser || (akra.parser = {}));
    var parser = akra.parser;
})(akra || (akra = {}));
//# sourceMappingURL=Lexer.js.map
