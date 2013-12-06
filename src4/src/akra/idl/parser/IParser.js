var akra = {};

/**
 * / <reference path="../IMap.ts" />
 */
akra.parser = {};

/**
 * @enum {number}
 */
akra.parser.ENodeCreateMode = {
  k_Default: 0,
  k_Necessary: 1,
  k_Not: 2
};

/**
 * @enum {number}
 */
akra.parser.EParserCode = {
  k_Pause: 0,
  k_Ok: 1,
  k_Error: 2
};

/**
 * @enum {number}
 */
akra.parser.EParserType = {
  k_LR0: 0,
  k_LR1: 1,
  k_LALR: 2
};

/**
 * @enum {number}
 */
akra.parser.EParseMode = {
  k_AllNode: 0x0001,
  k_Negate: 0x0002,
  k_Add: 0x0004,
  k_Optimize: 0x0008,
  k_DebugMode: 0x0010
};

/**
 * @enum {number}
 */
akra.parser.ETokenType = {
  k_NumericLiteral: 1,
  k_CommentLiteral: 2,
  k_StringLiteral: 3,
  k_PunctuatorLiteral: 4,
  k_WhitespaceLiteral: 5,
  k_IdentifierLiteral: 6,
  k_KeywordLiteral: 7,
  k_Unknown: 8,
  k_End: 9
};

/**
 * @interface
 */
akra.parser.IToken = function () {
};

/** @type {string} */ akra.parser.IToken.prototype.value;
/** @type {number} */ akra.parser.IToken.prototype.start;
/** @type {number} */ akra.parser.IToken.prototype.end;
/** @type {number} */ akra.parser.IToken.prototype.line;

/** @type {string} */ akra.parser.IToken.prototype.name;
/** @type {akra.parser.ETokenType} */ akra.parser.IToken.prototype.type;

/**
 * @interface
 */
akra.parser.IRule = function () {
};

/** @type {string} */ akra.parser.IRule.prototype.left;
/** @type {Array.<string>} */ akra.parser.IRule.prototype.right;
/** @type {number} */ akra.parser.IRule.prototype.index;

/**
 * @typedef {?function(akra.parser.EParserCode, string)}
 */
akra.parser.IFinishFunc;

/**
 * @enum {number}
 */
akra.parser.EOperationType = {
  k_Error: 100,
  k_Shift: 101,
  k_Reduce: 102,
  k_Success: 103,
  k_Pause: 104,
  k_Ok: 105
};

/**
 * @typedef {?function(): akra.parser.EOperationType}
 */
akra.parser.IRuleFunction;

/**
 * @interface
 */
akra.parser.IParseNode = function () {
};

/** @type {Array.<akra.parser.IParseNode>} */ akra.parser.IParseNode.prototype.children;
/** @type {akra.parser.IParseNode} */ akra.parser.IParseNode.prototype.parent;
/** @type {string} */ akra.parser.IParseNode.prototype.name;
/** @type {string} */ akra.parser.IParseNode.prototype.value;

/**
 * Data for next-step analyze
 *
 * @type {boolean}
 */
akra.parser.IParseNode.prototype.isAnalyzed;
/** @type {number} */ akra.parser.IParseNode.prototype.position;

/** @type {number} */ akra.parser.IParseNode.prototype.start;
/** @type {number} */ akra.parser.IParseNode.prototype.end;
/** @type {number} */ akra.parser.IParseNode.prototype.line;

/**
 * @interface
 */
akra.parser.IParseTree = function () {
};

/**
 * @type {?function()}
 */
akra.parser.IParseTree.prototype.finishTree;

/**
 * @type {?function(boolean)}
 */
akra.parser.IParseTree.prototype.setOptimizeMode;

/**
 * @type {?function(akra.parser.IParseNode)}
 */
akra.parser.IParseTree.prototype.addNode;
/**
 * @type {?function(akra.parser.IRule, akra.parser.ENodeCreateMode): ?}
 */
akra.parser.IParseTree.prototype.reduceByRule;

/**
 * @type {?function(): string}
 */
akra.parser.IParseTree.prototype.toString;

/**
 * @type {?function(): akra.parser.IParseTree}
 */
akra.parser.IParseTree.prototype.clone;

/**
 * @type {?function(): Array.<akra.parser.IParseNode>}
 */
akra.parser.IParseTree.prototype.getNodes;
/**
 * @type {?function(): akra.parser.IParseNode}
 */
akra.parser.IParseTree.prototype.getLastNode;

/**
 * @type {?function(): akra.parser.IParseNode}
 */
akra.parser.IParseTree.prototype.getRoot;
/**
 * @type {?function(akra.parser.IParseNode)}
 */
akra.parser.IParseTree.prototype.setRoot;

/**
 * @interface
 */
akra.parser.ILexer = function () {
};

/**
 * @type {?function(string, string=): string}
 */
akra.parser.ILexer.prototype.addPunctuator;
/**
 * @type {?function(string, string): string}
 */
akra.parser.ILexer.prototype.addKeyword;

/**
 * @type {?function(string): string}
 */
akra.parser.ILexer.prototype.getTerminalValueByName;

/**
 * @type {?function(string)}
 */
akra.parser.ILexer.prototype.init;

/**
 * @type {?function(): akra.parser.IToken}
 */
akra.parser.ILexer.prototype.getNextToken;
/**
 * @type {?function(): number}
 */
akra.parser.ILexer.prototype._getIndex;
/**
 * @type {?function(string)}
 */
akra.parser.ILexer.prototype._setSource;
/**
 * @type {?function(number)}
 */
akra.parser.ILexer.prototype._setIndex;

/**
 * @interface
 */
akra.parser.IParserState = function () {
};

/** @type {string} */ akra.parser.IParserState.prototype.source;
/** @type {number} */ akra.parser.IParserState.prototype.index;
/** @type {string} */ akra.parser.IParserState.prototype.fileName;
/** @type {akra.parser.IParseTree} */ akra.parser.IParserState.prototype.tree;
/** @type {akra.IMap} */ akra.parser.IParserState.prototype.types;
/** @type {Array.<number>} */ akra.parser.IParserState.prototype.stack;
/** @type {akra.parser.IToken} */ akra.parser.IParserState.prototype.token;
/** @type {akra.parser.IFinishFunc} */ akra.parser.IParserState.prototype.fnCallback;
/** @type {?} */ akra.parser.IParserState.prototype.caller;

/**
 * @interface
 */
akra.parser.IParser = function () {
};

/**
 * @type {?function(string): boolean}
 */
akra.parser.IParser.prototype.isTypeId;

/**
 * @type {?function(akra.parser.IParseNode): string}
 */
akra.parser.IParser.prototype.returnCode;

/**
 * @type {?function(string, akra.parser.EParseMode=, akra.parser.EParserType=): boolean}
 */
akra.parser.IParser.prototype.init;

/**
 * @type {?function(string, akra.parser.IFinishFunc=, ?=): akra.parser.EParserCode}
 */
akra.parser.IParser.prototype.parse;

/**
 * @type {?function(string)}
 */
akra.parser.IParser.prototype.setParseFileName;
/**
 * @type {?function(): string}
 */
akra.parser.IParser.prototype.getParseFileName;

/**
 * @type {?function(): akra.parser.EParserCode}
 */
akra.parser.IParser.prototype.pause;
/**
 * @type {?function(): akra.parser.EParserCode}
 */
akra.parser.IParser.prototype.resume;

/**
 * @type {?function(): akra.parser.IParseTree}
 */
akra.parser.IParser.prototype.getSyntaxTree;

/**
 * @type {?function(boolean=)}
 */
akra.parser.IParser.prototype.printStates;
/**
 * @type {?function(number, boolean=)}
 */
akra.parser.IParser.prototype.printState;

/**
 * @type {?function(): akra.IMap}
 */
akra.parser.IParser.prototype.getGrammarSymbols;

/**
 * @type {?function(): akra.parser.IParserState}
 */
akra.parser.IParser.prototype._saveState;
/**
 * @type {?function(akra.parser.IParserState)}
 */
akra.parser.IParser.prototype._loadState;
