var akra = {};

/**
 * @typedef {(Object.<string, ?>|Object.<number, ?>)}
 */
akra.IMap;

/**
 * @deprecated Use IMap<type> instead.
 *
 * @typedef {(Object.<string, string>|Object.<number, string>)}
 */
akra.IStringMap;

/**
 * @deprecated Use IMap<type> instead.
 *
 * @typedef {(Object.<string, number>|Object.<number, number>)}
 */
akra.IIntMap;

/**
 * @deprecated Use IMap<type> instead.
 *
 * @typedef {(Object.<string, number>|Object.<number, number>)}
 */
akra.IUintMap;

/**
 * @deprecated Use IMap<type> instead.
 *
 * @typedef {(Object.<string, number>|Object.<number, number>)}
 */
akra.IFloatMap;

/**
 * @deprecated Use IMap<type> instead.
 *
 * @typedef {(Object.<string, boolean>|Object.<number, boolean>)}
 */
akra.IBoolMap;

/**
 * @deprecated Use IMap<type> instead.
 *
 * @typedef {(Object.<string, akra.IBoolMap>|Object.<number, akra.IBoolMap>)}
 */
akra.IBoolDMap;

/**
 * @deprecated Use IMap<type> instead.
 *
 * @typedef {(Object.<string, akra.IStringMap>|Object.<number, akra.IStringMap>)}
 */
akra.IStringDMap;
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
akra.bf = {};

/**
 * Сдвиг единицы на @a x позиций влево.
 *
 * @type {?function(number): number}
 */
akra.bf.flag = function (x) {
  return (1 << (x));
};

/**
 * Проверка того что у @a value бит под номером @a bit равен единице.
 *
 * @type {?function(number, number): boolean}
 */
akra.bf.testBit = function (value, bit) {
  return ((value & akra.bf.flag(bit)) != 0);
};

/**
 * Проверка того что у @a value равны единице все биты,,которые равны единице у @a set.
 *
 * @type {?function(number, number): boolean}
 */
akra.bf.testAll = function (value, set) {
  return (((value) & (set)) == (set));
};

/**
 * Проверка того что у @a value равны единице хотя бы какие то из битов,,которые равны единице у @a set.
 *
 * @type {?function(number, number): boolean}
 */
akra.bf.testAny = function (value, set) {
  return (((value) & (set)) != 0);
};

/**
 * Выставляет бит под номером @a bit у числа @a value равным единице
 *
 * @type {?function(number, number, boolean=): number}
 */
akra.bf.setBit = function (value, bit, setting) {
  if (typeof setting === "undefined") setting = true;
  return (setting ? ((value) |= akra.bf.flag((bit))) : akra.bf.clearBit(value, bit));
};

/**
 *
 *
 * @type {?function(number, number): number}
 */
akra.bf.clearBit = function (value, bit) {
  return ((value) &= ~akra.bf.flag((bit)));
};

/**
 * Выставляет бит под номером @a bit у числа @a value равным нулю
 *
 * @type {?function(number, number, boolean=): number}
 */
akra.bf.setAll = function (value, set, setting) {
  if (typeof setting === "undefined") setting = true;
  return (setting ? ((value) |= (set)) : ((value) &= ~(set)));
};

/**
 * Выставляет все биты у числа @a value равными единице,,которые равны единице у числа @a set
 *
 * @type {?function(number, number): number}
 */
akra.bf.clearAll = function (value, set) {
  return ((value) &= ~(set));
};

/**
 * Выставляет все биты у числа @a value равными нулю,,которые равны единице у числа @a set
 *
 * @type {?function(number, number)}
 */
akra.bf.equal = function (value, src) {
  value = src;
};

/**
 * Прирасваивает числу @a value число @a src
 *
 * @type {?function(number, number): boolean}
 */
akra.bf.isEqual = function (value, src) {
  return value == src;
};

/**
 * Если число @a value равно числу @a src возвращается true
 *
 * @type {?function(number, number): boolean}
 */
akra.bf.isNotEqaul = function (value, src) {
  return value != src;
};

/**
 * Прирасваивает числу @a value число @a src
 *
 * @type {?function(number, number)}
 */
akra.bf.set = function (value, src) {
  value = src;
};

/**
 * Обнуляет число @a value
 *
 * @type {?function(number)}
 */
akra.bf.clear = function (value) {
  value = 0;
};

/**
 * Выставляет все биты у числа @a value равными единице,,которые равны единице у числа @a src
 *
 * @type {?function(number, number): number}
 */
akra.bf.setFlags = function (value, src) {
  return (value |= src);
};

/**
 * Выставляет все биты у числа @a value равными нулю,,которые равны единице у числа @a src
 *
 * @type {?function(number, number): number}
 */
akra.bf.clearFlags = function (value, src) {
  return value &= ~src;
};

/**
 * Проверяет равно ли число @a value нулю. Если равно возвращает true.,Если не равно возвращает false.
 *
 * @type {?function(number): boolean}
 */
akra.bf.isEmpty = function (value) {
  return (value == 0);
};

/**
 * Возвращает общее количество бит числа @a value.,На самом деле возвращает всегда 32.
 *
 * @type {?function(number): number}
 */
akra.bf.totalBits = function (value) {
  return 32;
};

/**
 * Возвращает общее количество ненулевых бит числа @a value.
 *
 * @type {?function(number): number}
 */
akra.bf.totalSet = function (value) {
  /** @type {number} */ var count = 0;
  /** @type {number} */ var total = akra.bf.totalBits(value);

  for (var i = total; i; --i) {
    count += (value & 1);
    value >>= 1;
  }

  return (count);
};

/**
 * Convert N bit colour channel value to P bits. It fills P bits with the,bit pattern repeated. (this is /((1<<n)-1) in fixed point)
 *
 * @param {number} value
 * @param {number} n
 * @param {number} p
 * @returns {number}
 */
akra.bf.fixedToFixed = function (value, n, p) {
  if (n > p) {
    // Less bits required than available; this is easy
    value >>= n - p;
  } else if (n < p) {
    if (value == 0)
      value = 0;
else if (value == (/** @type {number} */ ((1)) << n) - 1)
      value = (1 << p) - 1;
else
      value = value * (1 << p) / ((1 << n) - 1);
  }
  return value;
};

/**
 * Convert floating point colour channel value between 0.0 and 1.0 (otherwise clamped) ,to integer of a certain number of bits. Works for any value of bits between 0 and 31.
 *
 * @param {number} value
 * @param {number} bits
 * @returns {number}
 */
akra.bf.floatToFixed = function (value, bits) {
  if (value <= 0.0)
    return 0;
else if (value >= 1.0)
    return (1 << bits) - 1;
else
    return /** @type {number} */ ((value * (1 << bits)));
};

/**
 * Fixed point to float
 *
 * @param {number} value
 * @param {number} bits
 * @returns {number}
 */
akra.bf.fixedToFloat = function (value, bits) {
  return /** @type {number} */ ((value & ((1 << bits) - 1))) / /** @type {number} */ (((1 << bits) - 1));
};

/**
 * Write a n*8 bits integer value to memory in native endian.
 *
 * @param {Uint8Array} pDest
 * @param {number} n
 * @param {number} value
 */
akra.bf.intWrite = function (pDest, n, value) {
  switch (n) {
    case 1:
      pDest[0] = value;
      break;
    case 2:
      pDest[1] = ((value >> 8) & 0xFF);
      pDest[0] = (value & 0xFF);
      break;
    case 3:
      pDest[2] = ((value >> 16) & 0xFF);
      pDest[1] = ((value >> 8) & 0xFF);
      pDest[0] = (value & 0xFF);
      break;
    case 4:
      pDest[3] = ((value >> 24) & 0xFF);
      pDest[2] = ((value >> 16) & 0xFF);
      pDest[1] = ((value >> 8) & 0xFF);
      pDest[0] = (value & 0xFF);
      break;
  }
};

/**
 * Read a n*8 bits integer value to memory in native endian.
 *
 * @param {Uint8Array} pSrc
 * @param {number} n
 * @returns {number}
 */
akra.bf.intRead = function (pSrc, n) {
  switch (n) {
    case 1:
      return pSrc[0];
    case 2:
      return pSrc[0] | pSrc[1] << 8;
    case 3:
      return pSrc[0] | pSrc[1] << 8 | pSrc[2] << 16;
    case 4:
      return (pSrc[0]) | (pSrc[1] << 8) | (pSrc[2] << 16) | (pSrc[3] << 24);
  }
  return 0;
};

/**
 * float32/uint32 union
 *
 * @type {Uint32Array}
 */
akra.bf._u32 = new Uint32Array(1);
/** @type {Float32Array} */ akra.bf._f32 = new Float32Array(akra.bf._u32.buffer);

/**
 * @param {number} f
 * @returns {number}
 */
akra.bf.floatToHalf = function (f) {
  akra.bf._f32[0] = f;
  return akra.bf.floatToHalfI(akra.bf._u32[0]);
};

/**
 * @param {number} i
 * @returns {number}
 */
akra.bf.floatToHalfI = function (i) {
  /** @type {number} */ var s = (i >> 16) & 0x00008000;
  /** @type {number} */ var e = ((i >> 23) & 0x000000ff) - (127 - 15);
  /** @type {number} */ var m = i & 0x007fffff;

  if (e <= 0) {
    if (e < -10) {
      return 0;
    }
    m = (m | 0x00800000) >> (1 - e);

    return /** @type {number} */ ((s | (m >> 13)));
  } else if (e == 0xff - (127 - 15)) {
    if (m == 0) {
      return /** @type {number} */ ((s | 0x7c00));
    } else {
      m >>= 13;
      return /** @type {number} */ ((s | 0x7c00 | m | /** @type {number} */ (/** @type {?} */ ((m == 0)))));
    }
  } else {
    if (e > 30) {
      return /** @type {number} */ ((s | 0x7c00));
    }

    return /** @type {number} */ ((s | (e << 10) | (m >> 13)));
  }
};

/**
 * Convert a float16 (NV_half_float) to a float32,Courtesy of OpenEXR
 *
 * @param {number} y
 * @returns {number}
 */
akra.bf.halfToFloat = function (y) {
  akra.bf._u32[0] = akra.bf.halfToFloatI(y);
  return akra.bf._f32[0];
};

/**
 * Converts a half in uint16 format to a float,in uint32 format
 *
 * @param {number} y
 * @returns {number}
 */
akra.bf.halfToFloatI = function (y) {
  /** @type {number} */ var s = (y >> 15) & 0x00000001;
  /** @type {number} */ var e = (y >> 10) & 0x0000001f;
  /** @type {number} */ var m = y & 0x000003ff;

  if (e == 0) {
    if (m == 0) {
      return s << 31;
    } else {
      while (!(m & 0x00000400)) {
        m <<= 1;
        e -= 1;
      }

      e += 1;
      m &= ~0x00000400;
    }
  } else if (e == 31) {
    if (m == 0) {
      return (s << 31) | 0x7f800000;
    } else {
      return (s << 31) | 0x7f800000 | (m << 13);
    }
  }

  e = e + (127 - 15);
  m = m << 13;

  return (s << 31) | (e << 23) | m;
};
/**
 * @typedef {?function(string, ?, number=): number}
 */
akra.IConverter;

/**
 * @interface
 */
akra.IConvertionTableRow = function () {
};

/** @type {?} */ akra.IConvertionTableRow.prototype.type;
/** @type {akra.IConverter} */ akra.IConvertionTableRow.prototype.converter;

/**
 * @typedef {Object.<string, akra.IConvertionTableRow>}
 */
akra.IConvertionTable;
/**
 * @enum {number}
 */
akra.EDataTypes = {
  BYTE: 0x1400,
  UNSIGNED_BYTE: 0x1401,
  SHORT: 0x1402,
  UNSIGNED_SHORT: 0x1403,
  INT: 0x1404,
  UNSIGNED_INT: 0x1405,
  FLOAT: 0x1406
};

/**
 * @enum {number}
 */
akra.EDataTypeSizes = {
  BYTES_PER_BYTE: 1,
  BYTES_PER_UNSIGNED_BYTE: 1,
  BYTES_PER_UBYTE: 1,
  BYTES_PER_SHORT: 2,
  BYTES_PER_UNSIGNED_SHORT: 2,
  BYTES_PER_USHORT: 2,
  BYTES_PER_INT: 4,
  BYTES_PER_UNSIGNED_INT: 4,
  BYTES_PER_UINT: 4,
  BYTES_PER_FLOAT: 4
};
/**
 * / <reference path="../idl/IConverter.ts" />
 * / <reference path="../idl/EDataTypes.ts" />
 * / <reference path="../idl/3d-party/fixes.d.ts" />
 * / <reference path="../common.ts" />
 */
akra.conv = {};

/** @type {akra.IConvertionTable} */ akra.conv.conversionFormats;

/**
 * @param {string} sValue
 * @returns {boolean}
 */
akra.conv.parseBool = function (sValue) {
  return (sValue === "true");
};

/**
 * @param {string} sValue
 * @returns {string}
 */
akra.conv.parseString = function (sValue) {
  return String(sValue);
};

/**
 * @param {string} sJSON
 * @returns {?}
 */
akra.conv.parseJSON = function (sJSON) {
  return eval('(' + sJSON + ')');
};

/**
 * Convert text/html into Dom object.
 *
 * @param {string} sHTML
 * @returns {NodeList}
 */
akra.conv.parseHTML = function (sHTML) {
  /** @type {HTMLDivElement} */ var pDivEl = /** @type {HTMLDivElement} */ (/** @type {HTMLDivElement} */ (document.createElement('div')));
  /** @type {DocumentFragment} */ var pDocFrag;

  pDivEl.innerHTML = sHTML;

  return pDivEl.childNodes;
};

/**
 * @param {string} sHtml
 * @returns {DocumentFragment}
 */
akra.conv.parseHTMLDocument = function (sHtml) {
  /** @type {DocumentFragment} */ var pDocFrag;
  /** @type {NodeList} */ var pNodes = akra.conv.parseHTML(sHtml);

  pDocFrag = document.createDocumentFragment();

  for (var i = 0, len = pNodes.length; i < len; ++i) {
    if (!akra.isDef(pNodes[i])) {
      continue;
    }

    pDocFrag.appendChild(pNodes[i]);
  }

  return pDocFrag;
};

/**
 * @param {?} pSrc
 * @param {?} pDst
 * @param {number=} iStride
 * @param {number=} iFrom
 * @param {number=} iCount
 * @param {number=} iOffset
 * @param {number=} iLen
 * @returns {number}
 */
akra.conv.retrieve = function (pSrc, pDst, iStride, iFrom, iCount, iOffset, iLen) {
  if (!akra.isDef(iCount)) {
    iCount = ((/** @type {Array.<?>} */ (/** @type {?} */ (pSrc))).length / iStride - iFrom);
  }

  if (iOffset + iLen > iStride) {
    iLen = iStride - iOffset;
  }

  /** @type {number} */ var iBegin = iFrom * iStride;
  /** @type {number} */ var n = 0;

  for (var i = 0; i < iCount; ++i) {
    for (var j = 0; j < iLen; ++j) {
      pDst[n++] = (pSrc[iBegin + i * iStride + iOffset + j]);
    }
  }

  return n;
};

/**
 * @param {string} sData
 * @param {Array.<?>} ppData
 * @param {?function(string, ...[?]): ?} fnConv
 * @param {number=} iFrom
 * @returns {number}
 */
akra.conv.string2Array = function (sData, ppData, fnConv, iFrom) {
  /** @type {Array.<string>} */ var pData = /** @type {Array.<string>} */ (sData.split(/[\s]+/g));

  for (var i = 0, n = pData.length, j = 0; i < n; ++i) {
    if (pData[i] != "") {
      ppData[iFrom + j] = fnConv(pData[i]);
      j++;
    }
  }

  return j;
};
/**
 * @param {string} sData
 * @param {Array.<number>} ppData
 * @param {number=} iFrom
 * @returns {number}
 */
akra.conv.stoia = function (sData, ppData, iFrom) {
  return akra.conv.string2Array(sData, ppData, parseInt, iFrom);
};
/**
 * @param {string} sData
 * @param {Array.<number>} ppData
 * @param {number=} iFrom
 * @returns {number}
 */
akra.conv.stofa = function (sData, ppData, iFrom) {
  return akra.conv.string2Array(sData, ppData, parseFloat, iFrom);
};
/**
 * @param {string} sData
 * @param {Array.<boolean>} ppData
 * @param {number=} iFrom
 * @returns {number}
 */
akra.conv.stoba = function (sData, ppData, iFrom) {
  return akra.conv.string2Array(sData, ppData, akra.conv.parseBool, iFrom);
};
/**
 * @param {string} sData
 * @param {Array.<string>} ppData
 * @param {number=} iFrom
 * @returns {number}
 */
akra.conv.stosa = function (sData, ppData, iFrom) {
  return akra.conv.string2Array(sData, ppData, akra.conv.parseString, iFrom);
};

/**
 * @param {string} sData
 * @param {number} n
 * @param {string} sType
 * @param {boolean=} isArray
 * @returns {?}
 */
akra.conv.stoa = function (sData, n, sType, isArray) {
  /** @type {akra.IConvertionTableRow} */ var pRow = akra.conv.conversionFormats[sType];
  /** @type {?} */ var ppData = new (pRow.type)(n);
  pRow.converter(sData, ppData);

  if (n == 1 && !isArray) {
    return ppData[0];
  }

  return ppData;
};

// data convertion
akra.conv.conversionFormats = {
  "int": { type: Int32Array, converter: akra.conv.stoia },
  "float": { type: Float32Array, converter: akra.conv.stofa },
  "boolean": { type: Array, converter: akra.conv.stoba },
  "string": { type: Array, converter: akra.conv.stosa }
};

/**
 * ////////////////
 * Convert string to ArrayBuffer.
 *
 * @param {string} s
 * @returns {ArrayBuffer}
 */
akra.conv.stoab = function (s) {
  /** @type {number} */ var len = s.length;
  /** @type {Uint8Array} */ var pCodeList = new Uint8Array(len);

  for (var i = 0; i < len; ++i) {
    pCodeList[i] = s.charCodeAt(i);
  }

  return pCodeList.buffer;
};

/**
 * Convert ArrayBuffer to string.
 *
 * @param {ArrayBuffer} pBuf
 * @returns {string}
 */
akra.conv.abtos = function (pBuf) {
  /** @type {Uint8Array} */ var pData = new Uint8Array(pBuf);
  /** @type {string} */ var s = "";

  for (var n = 0; n < pData.length; ++n) {
    s += String.fromCharCode(pData[n]);
  }

  return s;
  // return String.fromCharCode.apply(null, Array.prototype.slice.call(new Uint8Array(pBuf), 0));
};

/**
 * Convert ArrayBuffer to string via BlobReader.
 *
 * @param {ArrayBuffer} pBuffer
 * @param {?function(string)} callback
 */
akra.conv.abtosAsync = function (pBuffer, callback) {
  /** @type {Blob} */ var bb = new Blob([pBuffer]);
  /** @type {FileReader} */ var f = new FileReader();

  f.onload = function (e) {
    callback(e.target.result);
  };

  f.readAsText(bb);
};

/**
 * Convert ArrayBuffer to typed array.
 *
 * @param {ArrayBuffer} pBuffer
 * @param {akra.EDataTypes} eType
 * @returns {ArrayBufferView}
 */
akra.conv.abtota = function (pBuffer, eType) {
  switch (eType) {
    case akra.EDataTypes.FLOAT:
      return new Float32Array(pBuffer);
    case akra.EDataTypes.SHORT:
      return new Int16Array(pBuffer);
    case akra.EDataTypes.UNSIGNED_SHORT:
      return new Uint16Array(pBuffer);
    case akra.EDataTypes.INT:
      return new Int32Array(pBuffer);
    case akra.EDataTypes.UNSIGNED_INT:
      return new Uint32Array(pBuffer);
    case akra.EDataTypes.BYTE:
      return new Int8Array(pBuffer);
    default:
    case akra.EDataTypes.UNSIGNED_BYTE:
      return new Uint8Array(pBuffer);
  }
};

/**
 * Blob to ArrayBuffer async.
 *
 * @param {Blob} pBlob
 * @param {?function(ErrorEvent, ArrayBuffer)} fn
 */
akra.conv.btoaAsync = function (pBlob, fn) {
  /** @type {FileReader} */ var pReader = new FileReader();

  pReader.onload = function (e) {
    fn(null, e.target.result);
  };

  pReader.onerror = function (e) {
    fn(e, null);
  };

  pReader.readAsArrayBuffer(pBlob);
};

/**
 * DataURL to Blob object async.
 *
 * @param {string} sBlobURL
 * @param {?function(Blob)} fn
 */
akra.conv.dutobAsync = function (sBlobURL, fn) {
  /** @type {XMLHttpRequest} */ var xhr = new XMLHttpRequest();
  xhr.open("GET", sBlobURL, true);
  xhr.responseType = "blob";

  xhr.onload = function (e) {
    if (this.status == 200) {
      fn(/** @type {Blob} */ (this.response));
    }
  };

  xhr.send();
};

/**
 * Data URL to JSON.
 *
 * @param {string} sBlobURL
 * @param {?function(Object)} fn
 */
akra.conv.dutojAsync = function (sBlobURL, fn) {
  /** @type {XMLHttpRequest} */ var xhr = new XMLHttpRequest();

  xhr.open("GET", sBlobURL, true);
  xhr.overrideMimeType('application/json');
  xhr.responseType = "json";

  xhr.onload = function (e) {
    if (this.status == 200) {
      fn(/** @type {Object} */ (this.response));
    }
  };

  xhr.send();
};

/**
 * Data URL to Blob object.
 *
 * @param {?} dataURI
 * @returns {Blob}
 */
akra.conv.dutob = function (dataURI) {
  /**
   * convert base64 to raw binary data held in a string
   * doesn't handle URLEncoded DataURIs - see SO answer #6850276 for code that does this
   *
   * @type {string}
   */
  var byteString = atob(dataURI.split(',')[1]);

  /**
   * separate out the mime component
   *
   * @type {?}
   */
  var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

  /**
   * write the bytes of the string to an ArrayBuffer
   *
   * @type {ArrayBuffer}
   */
  var ab = new ArrayBuffer(byteString.length);
  /** @type {Uint8Array} */ var ia = new Uint8Array(ab);
  for (var i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }

  /**
   * write the ArrayBuffer to a blob, and you're done
   *
   * @type {Blob}
   */
  var bb = new Blob([ab], { type: mimeString });
  return bb;
};

/**
 * TODO: remove this
 *
 * @param {?} data
 * @param {string=} mime
 * @returns {string}
 */
akra.conv.toURL = function (data, mime) {
  if (typeof mime === "undefined") mime = "text/plain";
  /** @type {Blob} */ var blob;

  try  {
    blob = new Blob([data], { type: mime });
  } catch (e) {
    /**
     * Backwards-compatibility
     *
     * @type {BlobBuilder}
     */
    var bb = new BlobBuilder();
    bb.append(data);
    blob = bb.getBlob(mime);
  }

  return URL.createObjectURL(blob);
};

/**
 * Convert UTF8 string to Base64 string
 *
 * @param {string} s
 * @returns {string}
 */
akra.conv.utf8tob64 = function (s) {
  return window.btoa(unescape(encodeURIComponent(s)));
};

/**
 * @param {string} argString
 * @returns {string}
 */
akra.conv.toUTF8 = function (argString) {
  if (argString === null || typeof argString === "undefined") {
    return "";
  }

  /**
   * .replace(/\r\n/g, "\n").replace(/\r/g, "\n");
   *
   * @type {string}
   */
  var string = (argString + "");
  /** @type {string} */ var utftext = "";
  /** @type {?} */ var start;
  /** @type {?} */ var end;
  /** @type {number} */ var stringl = 0;

  start = end = 0;
  stringl = string.length;
  for (var n = 0; n < stringl; n++) {
    /** @type {number} */ var c1 = string.charCodeAt(n);
    /** @type {?} */ var enc = null;

    if (c1 < 128) {
      end++;
    } else if (c1 > 127 && c1 < 2048) {
      enc = String.fromCharCode((c1 >> 6) | 192) + String.fromCharCode((c1 & 63) | 128);
    } else {
      enc = String.fromCharCode((c1 >> 12) | 224) + String.fromCharCode(((c1 >> 6) & 63) | 128) + String.fromCharCode((c1 & 63) | 128);
    }
    if (enc !== null) {
      if (end > start) {
        utftext += string.slice(start, end);
      }
      utftext += enc;
      start = end = n + 1;
    }
  }

  if (end > start) {
    utftext += string.slice(start, stringl);
  }

  return utftext;
};

/**
 * @param {string} str_data
 * @returns {string}
 */
akra.conv.fromUTF8 = function (str_data) {
  /**
   * http://kevin.vanzonneveld.net
   * +   original by: Webtoolkit.info (http://www.webtoolkit.info/)
   * +      input by: Aman Gupta
   * +   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
   * +   improved by: Norman "zEh" Fuchs
   * +   bugfixed by: hitwork
   * +   bugfixed by: Onno Marsman
   * +      input by: Brett Zamir (http://brett-zamir.me)
   * +   bugfixed by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
   * *     example 1: utf8_decode('Kevin van Zonneveld');
   * *     returns 1: 'Kevin van Zonneveld'
   *
   * @type {Array.<?>}
   */
  var tmp_arr = [];
  /** @type {number} */ var i = 0;
  /** @type {number} */ var ac = 0;
  /** @type {number} */ var c1 = 0;
  /** @type {number} */ var c2 = 0;
  /** @type {number} */ var c3 = 0;

  str_data += "";

  while (i < str_data.length) {
    c1 = str_data.charCodeAt(i);
    if (c1 < 128) {
      tmp_arr[ac++] = String.fromCharCode(c1);
      i++;
    } else if (c1 > 191 && c1 < 224) {
      c2 = str_data.charCodeAt(i + 1);
      tmp_arr[ac++] = String.fromCharCode(((c1 & 31) << 6) | (c2 & 63));
      i += 2;
    } else {
      c2 = str_data.charCodeAt(i + 1);
      c3 = str_data.charCodeAt(i + 2);
      tmp_arr[ac++] = String.fromCharCode(((c1 & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
      i += 3;
    }
  }

  return tmp_arr.join("");
};
/**
 * / <reference path="../conv/conv.ts" />
 */
akra.crypto = {};

/**
 * @param {string} str
 * @returns {string}
 */
akra.crypto.sha1 = function (str) {
  /**
   * http://kevin.vanzonneveld.net
   * +   original by: Webtoolkit.info (http://www.webtoolkit.info/)
   * + namespaced by: Michael White (http://getsprink.com)
   * +      input by: Brett Zamir (http://brett-zamir.me)
   * +   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
   * -    depends on: utf8_encode
   * *     example 1: sha1('Kevin van Zonneveld');
   * *     returns 1: '54916d2e62f65b3afa6e192e6a601cdbe5cb5897'
   *
   * @type {?function(?, ?): number}
   */
  var rotate_left = function (n, s) {
    /** @type {number} */ var t4 = (n << s) | (n >>> (32 - s));
    return t4;
  };

  /**
   * /*var lsb_hex = function (val) {,var str="";,var i;,var vh;,var vl;,for ( i=0; i<=6; i+=2 ) {,vh = (val>>>(i*4+4))&0x0f;,vl = (val>>>(i*4))&0x0f;,str += vh.toString(16) + vl.toString(16);,},return str;,};
   *
   * @type {?function(?): string}
   */
  var cvt_hex = function (val) {
    /** @type {string} */ var str = "";
    /** @type {?} */ var i;
    /** @type {?} */ var v;

    for (i = 7; i >= 0; i--) {
      v = (val >>> (i * 4)) & 0x0f;
      str += v.toString(16);
    }
    return str;
  };

  /** @type {?} */ var blockstart;
  /** @type {?} */ var i;
  /** @type {?} */ var j;
  /** @type {Array.<?>} */ var W = new Array(80);
  /** @type {number} */ var H0 = 0x67452301;
  /** @type {number} */ var H1 = 0xEFCDAB89;
  /** @type {number} */ var H2 = 0x98BADCFE;
  /** @type {number} */ var H3 = 0x10325476;
  /** @type {number} */ var H4 = 0xC3D2E1F0;
  /** @type {?} */ var A;
  /** @type {?} */ var B;
  /** @type {?} */ var C;
  /** @type {?} */ var D;
  /** @type {?} */ var E;
  /** @type {?} */ var temp;

  str = akra.conv.toUTF8(str);
  /** @type {number} */ var str_len = str.length;

  /** @type {Array.<?>} */ var word_array = [];
  for (i = 0; i < str_len - 3; i += 4) {
    j = str.charCodeAt(i) << 24 | str.charCodeAt(i + 1) << 16 | str.charCodeAt(i + 2) << 8 | str.charCodeAt(i + 3);
    word_array.push(j);
  }

  switch (str_len % 4) {
    case 0:
      i = 0x080000000;
      break;
    case 1:
      i = str.charCodeAt(str_len - 1) << 24 | 0x0800000;
      break;
    case 2:
      i = str.charCodeAt(str_len - 2) << 24 | str.charCodeAt(str_len - 1) << 16 | 0x08000;
      break;
    case 3:
      i = str.charCodeAt(str_len - 3) << 24 | str.charCodeAt(str_len - 2) << 16 | str.charCodeAt(str_len - 1) << 8 | 0x80;
      break;
  }

  word_array.push(i);

  while ((word_array.length % 16) != 14) {
    word_array.push(0);
  }

  word_array.push(str_len >>> 29);
  word_array.push((str_len << 3) & 0x0ffffffff);

  for (blockstart = 0; blockstart < word_array.length; blockstart += 16) {
    for (i = 0; i < 16; i++) {
      W[i] = word_array[blockstart + i];
    }
    for (i = 16; i <= 79; i++) {
      W[i] = rotate_left(W[i - 3] ^ W[i - 8] ^ W[i - 14] ^ W[i - 16], 1);
    }

    A = H0;
    B = H1;
    C = H2;
    D = H3;
    E = H4;

    for (i = 0; i <= 19; i++) {
      temp = (rotate_left(A, 5) + ((B & C) | (~B & D)) + E + W[i] + 0x5A827999) & 0x0ffffffff;
      E = D;
      D = C;
      C = rotate_left(B, 30);
      B = A;
      A = temp;
    }

    for (i = 20; i <= 39; i++) {
      temp = (rotate_left(A, 5) + (B ^ C ^ D) + E + W[i] + 0x6ED9EBA1) & 0x0ffffffff;
      E = D;
      D = C;
      C = rotate_left(B, 30);
      B = A;
      A = temp;
    }

    for (i = 40; i <= 59; i++) {
      temp = (rotate_left(A, 5) + ((B & C) | (B & D) | (C & D)) + E + W[i] + 0x8F1BBCDC) & 0x0ffffffff;
      E = D;
      D = C;
      C = rotate_left(B, 30);
      B = A;
      A = temp;
    }

    for (i = 60; i <= 79; i++) {
      temp = (rotate_left(A, 5) + (B ^ C ^ D) + E + W[i] + 0xCA62C1D6) & 0x0ffffffff;
      E = D;
      D = C;
      C = rotate_left(B, 30);
      B = A;
      A = temp;
    }

    H0 = (H0 + A) & 0x0ffffffff;
    H1 = (H1 + B) & 0x0ffffffff;
    H2 = (H2 + C) & 0x0ffffffff;
    H3 = (H3 + D) & 0x0ffffffff;
    H4 = (H4 + E) & 0x0ffffffff;
  }

  temp = cvt_hex(H0) + cvt_hex(H1) + cvt_hex(H2) + cvt_hex(H3) + cvt_hex(H4);
  return temp.toLowerCase();
};
/**
 * @param {?} str
 * @returns {string}
 */
akra.crypto.md5 = function (str) {
  /**
   * http://kevin.vanzonneveld.net
   * +   original by: Webtoolkit.info (http://www.webtoolkit.info/)
   * + namespaced by: Michael White (http://getsprink.com)
   * +    tweaked by: Jack
   * +   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
   * +      input by: Brett Zamir (http://brett-zamir.me)
   * +   bugfixed by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
   * -    depends on: utf8_encode
   * *     example 1: md5('Kevin van Zonneveld');
   * *     returns 1: '6e658d4bfcb59cc13f96c14450ac40b9'
   *
   * @type {?}
   */
  var xl;
  /** @type {?} */ var a;
  /** @type {?} */ var b;
  /** @type {?} */ var c;
  /** @type {?} */ var d;
  /** @type {?} */ var e;

  /** @type {?function(?, ?): number} */ var rotateLeft = function (lValue, iShiftBits) {
    return (lValue << iShiftBits) | (lValue >>> (32 - iShiftBits));
  };

  /** @type {?function(?, ?): number} */ var addUnsigned = function (lX, lY) {
    /** @type {?} */ var lX4;
    /** @type {?} */ var lY4;
    /** @type {?} */ var lX8;
    /** @type {?} */ var lY8;
    /** @type {?} */ var lResult;
    lX8 = (lX & 0x80000000);
    lY8 = (lY & 0x80000000);
    lX4 = (lX & 0x40000000);
    lY4 = (lY & 0x40000000);
    lResult = (lX & 0x3FFFFFFF) + (lY & 0x3FFFFFFF);
    if (lX4 & lY4) {
      return (lResult ^ 0x80000000 ^ lX8 ^ lY8);
    }
    if (lX4 | lY4) {
      if (lResult & 0x40000000) {
        return (lResult ^ 0xC0000000 ^ lX8 ^ lY8);
      } else {
        return (lResult ^ 0x40000000 ^ lX8 ^ lY8);
      }
    } else {
      return (lResult ^ lX8 ^ lY8);
    }
  };

  /** @type {?function(?, ?, ?): number} */ var _F = function (x, y, z) {
    return (x & y) | ((~x) & z);
  };
  /** @type {?function(?, ?, ?): number} */ var _G = function (x, y, z) {
    return (x & z) | (y & (~z));
  };
  /** @type {?function(?, ?, ?): number} */ var _H = function (x, y, z) {
    return (x ^ y ^ z);
  };
  /** @type {?function(?, ?, ?): number} */ var _I = function (x, y, z) {
    return (y ^ (x | (~z)));
  };

  /** @type {?function(?, ?, ?, ?, ?, ?, ?): number} */ var _FF = function (a, b, c, d, x, s, ac) {
    a = addUnsigned(a, addUnsigned(addUnsigned(_F(b, c, d), x), ac));
    return addUnsigned(rotateLeft(a, s), b);
  };

  /** @type {?function(?, ?, ?, ?, ?, ?, ?): number} */ var _GG = function (a, b, c, d, x, s, ac) {
    a = addUnsigned(a, addUnsigned(addUnsigned(_G(b, c, d), x), ac));
    return addUnsigned(rotateLeft(a, s), b);
  };

  /** @type {?function(?, ?, ?, ?, ?, ?, ?): number} */ var _HH = function (a, b, c, d, x, s, ac) {
    a = addUnsigned(a, addUnsigned(addUnsigned(_H(b, c, d), x), ac));
    return addUnsigned(rotateLeft(a, s), b);
  };

  /** @type {?function(?, ?, ?, ?, ?, ?, ?): number} */ var _II = function (a, b, c, d, x, s, ac) {
    a = addUnsigned(a, addUnsigned(addUnsigned(_I(b, c, d), x), ac));
    return addUnsigned(rotateLeft(a, s), b);
  };

  /** @type {?function(?): Array.<?>} */ var convertToWordArray = function (str) {
    /** @type {?} */ var lWordCount;
    /** @type {?} */ var lMessageLength = str.length;
    /** @type {?} */ var lNumberOfWords_temp1 = lMessageLength + 8;
    /** @type {number} */ var lNumberOfWords_temp2 = (lNumberOfWords_temp1 - (lNumberOfWords_temp1 % 64)) / 64;
    /** @type {number} */ var lNumberOfWords = (lNumberOfWords_temp2 + 1) * 16;
    /** @type {Array.<?>} */ var lWordArray = new Array(lNumberOfWords - 1);
    /** @type {number} */ var lBytePosition = 0;
    /** @type {number} */ var lByteCount = 0;
    while (lByteCount < lMessageLength) {
      lWordCount = (lByteCount - (lByteCount % 4)) / 4;
      lBytePosition = (lByteCount % 4) * 8;
      lWordArray[lWordCount] = (lWordArray[lWordCount] | (str.charCodeAt(lByteCount) << lBytePosition));
      lByteCount++;
    }
    lWordCount = (lByteCount - (lByteCount % 4)) / 4;
    lBytePosition = (lByteCount % 4) * 8;
    lWordArray[lWordCount] = lWordArray[lWordCount] | (0x80 << lBytePosition);
    lWordArray[lNumberOfWords - 2] = lMessageLength << 3;
    lWordArray[lNumberOfWords - 1] = lMessageLength >>> 29;
    return lWordArray;
  };

  /** @type {?function(?): string} */ var wordToHex = function (lValue) {
    /** @type {string} */ var wordToHexValue = "";
    /** @type {string} */ var wordToHexValue_temp = "";
    /** @type {?} */ var lByte;
    /** @type {?} */ var lCount;
    for (lCount = 0; lCount <= 3; lCount++) {
      lByte = (lValue >>> (lCount * 8)) & 255;
      wordToHexValue_temp = "0" + lByte.toString(16);
      wordToHexValue = wordToHexValue + wordToHexValue_temp.substr(wordToHexValue_temp.length - 2, 2);
    }
    return wordToHexValue;
  };

  /** @type {Array.<?>} */ var x = [];
  /** @type {?} */ var k;
  /** @type {?} */ var AA;
  /** @type {?} */ var BB;
  /** @type {?} */ var CC;
  /** @type {?} */ var DD;
  
  
  
  
  /** @type {number} */ var S11 = 7;
  /** @type {number} */ var S12 = 12;
  /** @type {number} */ var S13 = 17;
  /** @type {number} */ var S14 = 22;
  /** @type {number} */ var S21 = 5;
  /** @type {number} */ var S22 = 9;
  /** @type {number} */ var S23 = 14;
  /** @type {number} */ var S24 = 20;
  /** @type {number} */ var S31 = 4;
  /** @type {number} */ var S32 = 11;
  /** @type {number} */ var S33 = 16;
  /** @type {number} */ var S34 = 23;
  /** @type {number} */ var S41 = 6;
  /** @type {number} */ var S42 = 10;
  /** @type {number} */ var S43 = 15;
  /** @type {number} */ var S44 = 21;

  str = akra.conv.toUTF8(str);
  x = convertToWordArray(str);
  a = 0x67452301;
  b = 0xEFCDAB89;
  c = 0x98BADCFE;
  d = 0x10325476;

  xl = x.length;
  for (k = 0; k < xl; k += 16) {
    AA = a;
    BB = b;
    CC = c;
    DD = d;
    a = _FF(a, b, c, d, x[k + 0], S11, 0xD76AA478);
    d = _FF(d, a, b, c, x[k + 1], S12, 0xE8C7B756);
    c = _FF(c, d, a, b, x[k + 2], S13, 0x242070DB);
    b = _FF(b, c, d, a, x[k + 3], S14, 0xC1BDCEEE);
    a = _FF(a, b, c, d, x[k + 4], S11, 0xF57C0FAF);
    d = _FF(d, a, b, c, x[k + 5], S12, 0x4787C62A);
    c = _FF(c, d, a, b, x[k + 6], S13, 0xA8304613);
    b = _FF(b, c, d, a, x[k + 7], S14, 0xFD469501);
    a = _FF(a, b, c, d, x[k + 8], S11, 0x698098D8);
    d = _FF(d, a, b, c, x[k + 9], S12, 0x8B44F7AF);
    c = _FF(c, d, a, b, x[k + 10], S13, 0xFFFF5BB1);
    b = _FF(b, c, d, a, x[k + 11], S14, 0x895CD7BE);
    a = _FF(a, b, c, d, x[k + 12], S11, 0x6B901122);
    d = _FF(d, a, b, c, x[k + 13], S12, 0xFD987193);
    c = _FF(c, d, a, b, x[k + 14], S13, 0xA679438E);
    b = _FF(b, c, d, a, x[k + 15], S14, 0x49B40821);
    a = _GG(a, b, c, d, x[k + 1], S21, 0xF61E2562);
    d = _GG(d, a, b, c, x[k + 6], S22, 0xC040B340);
    c = _GG(c, d, a, b, x[k + 11], S23, 0x265E5A51);
    b = _GG(b, c, d, a, x[k + 0], S24, 0xE9B6C7AA);
    a = _GG(a, b, c, d, x[k + 5], S21, 0xD62F105D);
    d = _GG(d, a, b, c, x[k + 10], S22, 0x2441453);
    c = _GG(c, d, a, b, x[k + 15], S23, 0xD8A1E681);
    b = _GG(b, c, d, a, x[k + 4], S24, 0xE7D3FBC8);
    a = _GG(a, b, c, d, x[k + 9], S21, 0x21E1CDE6);
    d = _GG(d, a, b, c, x[k + 14], S22, 0xC33707D6);
    c = _GG(c, d, a, b, x[k + 3], S23, 0xF4D50D87);
    b = _GG(b, c, d, a, x[k + 8], S24, 0x455A14ED);
    a = _GG(a, b, c, d, x[k + 13], S21, 0xA9E3E905);
    d = _GG(d, a, b, c, x[k + 2], S22, 0xFCEFA3F8);
    c = _GG(c, d, a, b, x[k + 7], S23, 0x676F02D9);
    b = _GG(b, c, d, a, x[k + 12], S24, 0x8D2A4C8A);
    a = _HH(a, b, c, d, x[k + 5], S31, 0xFFFA3942);
    d = _HH(d, a, b, c, x[k + 8], S32, 0x8771F681);
    c = _HH(c, d, a, b, x[k + 11], S33, 0x6D9D6122);
    b = _HH(b, c, d, a, x[k + 14], S34, 0xFDE5380C);
    a = _HH(a, b, c, d, x[k + 1], S31, 0xA4BEEA44);
    d = _HH(d, a, b, c, x[k + 4], S32, 0x4BDECFA9);
    c = _HH(c, d, a, b, x[k + 7], S33, 0xF6BB4B60);
    b = _HH(b, c, d, a, x[k + 10], S34, 0xBEBFBC70);
    a = _HH(a, b, c, d, x[k + 13], S31, 0x289B7EC6);
    d = _HH(d, a, b, c, x[k + 0], S32, 0xEAA127FA);
    c = _HH(c, d, a, b, x[k + 3], S33, 0xD4EF3085);
    b = _HH(b, c, d, a, x[k + 6], S34, 0x4881D05);
    a = _HH(a, b, c, d, x[k + 9], S31, 0xD9D4D039);
    d = _HH(d, a, b, c, x[k + 12], S32, 0xE6DB99E5);
    c = _HH(c, d, a, b, x[k + 15], S33, 0x1FA27CF8);
    b = _HH(b, c, d, a, x[k + 2], S34, 0xC4AC5665);
    a = _II(a, b, c, d, x[k + 0], S41, 0xF4292244);
    d = _II(d, a, b, c, x[k + 7], S42, 0x432AFF97);
    c = _II(c, d, a, b, x[k + 14], S43, 0xAB9423A7);
    b = _II(b, c, d, a, x[k + 5], S44, 0xFC93A039);
    a = _II(a, b, c, d, x[k + 12], S41, 0x655B59C3);
    d = _II(d, a, b, c, x[k + 3], S42, 0x8F0CCC92);
    c = _II(c, d, a, b, x[k + 10], S43, 0xFFEFF47D);
    b = _II(b, c, d, a, x[k + 1], S44, 0x85845DD1);
    a = _II(a, b, c, d, x[k + 8], S41, 0x6FA87E4F);
    d = _II(d, a, b, c, x[k + 15], S42, 0xFE2CE6E0);
    c = _II(c, d, a, b, x[k + 6], S43, 0xA3014314);
    b = _II(b, c, d, a, x[k + 13], S44, 0x4E0811A1);
    a = _II(a, b, c, d, x[k + 4], S41, 0xF7537E82);
    d = _II(d, a, b, c, x[k + 11], S42, 0xBD3AF235);
    c = _II(c, d, a, b, x[k + 2], S43, 0x2AD7D2BB);
    b = _II(b, c, d, a, x[k + 9], S44, 0xEB86D391);
    a = addUnsigned(a, AA);
    b = addUnsigned(b, BB);
    c = addUnsigned(c, CC);
    d = addUnsigned(d, DD);
  }

  /** @type {string} */ var temp = wordToHex(a) + wordToHex(b) + wordToHex(c) + wordToHex(d);

  return temp.toLowerCase();
};
/**
 * @param {string} str
 * @returns {string}
 */
akra.crypto.crc32 = function (str) {
  // http://kevin.vanzonneveld.net
  // +   original by: Webtoolkit.info (http://www.webtoolkit.info/)
  // +   improved by: T0bsn
  // -    depends on: utf8_encode
  // *     example 1: crc32('Kevin van Zonneveld');
  // *     returns 1: 1249991249
  str = akra.conv.toUTF8(str);
  /** @type {string} */ var table = "00000000 77073096 EE0E612C 990951BA 076DC419 706AF48F E963A535 9E6495A3 0EDB8832 79DCB8A4 E0D5E91E 97D2D988 09B64C2B 7EB17CBD E7B82D07 90BF1D91 1DB71064 6AB020F2 F3B97148 84BE41DE 1ADAD47D 6DDDE4EB F4D4B551 83D385C7 136C9856 646BA8C0 FD62F97A 8A65C9EC 14015C4F 63066CD9 FA0F3D63 8D080DF5 3B6E20C8 4C69105E D56041E4 A2677172 3C03E4D1 4B04D447 D20D85FD A50AB56B 35B5A8FA 42B2986C DBBBC9D6 ACBCF940 32D86CE3 45DF5C75 DCD60DCF ABD13D59 26D930AC 51DE003A C8D75180 BFD06116 21B4F4B5 56B3C423 CFBA9599 B8BDA50F 2802B89E 5F058808 C60CD9B2 B10BE924 2F6F7C87 58684C11 C1611DAB B6662D3D 76DC4190 01DB7106 98D220BC EFD5102A 71B18589 06B6B51F 9FBFE4A5 E8B8D433 7807C9A2 0F00F934 9609A88E E10E9818 7F6A0DBB 086D3D2D 91646C97 E6635C01 6B6B51F4 1C6C6162 856530D8 F262004E 6C0695ED 1B01A57B 8208F4C1 F50FC457 65B0D9C6 12B7E950 8BBEB8EA FCB9887C 62DD1DDF 15DA2D49 8CD37CF3 FBD44C65 4DB26158 3AB551CE A3BC0074 D4BB30E2 4ADFA541 3DD895D7 A4D1C46D D3D6F4FB 4369E96A 346ED9FC AD678846 DA60B8D0 44042D73 33031DE5 AA0A4C5F DD0D7CC9 5005713C 270241AA BE0B1010 C90C2086 5768B525 206F85B3 B966D409 CE61E49F 5EDEF90E 29D9C998 B0D09822 C7D7A8B4 59B33D17 2EB40D81 B7BD5C3B C0BA6CAD EDB88320 9ABFB3B6 03B6E20C 74B1D29A EAD54739 9DD277AF 04DB2615 73DC1683 E3630B12 94643B84 0D6D6A3E 7A6A5AA8 E40ECF0B 9309FF9D 0A00AE27 7D079EB1 F00F9344 8708A3D2 1E01F268 6906C2FE F762575D 806567CB 196C3671 6E6B06E7 FED41B76 89D32BE0 10DA7A5A 67DD4ACC F9B9DF6F 8EBEEFF9 17B7BE43 60B08ED5 D6D6A3E8 A1D1937E 38D8C2C4 4FDFF252 D1BB67F1 A6BC5767 3FB506DD 48B2364B D80D2BDA AF0A1B4C 36034AF6 41047A60 DF60EFC3 A867DF55 316E8EEF 4669BE79 CB61B38C BC66831A 256FD2A0 5268E236 CC0C7795 BB0B4703 220216B9 5505262F C5BA3BBE B2BD0B28 2BB45A92 5CB36A04 C2D7FFA7 B5D0CF31 2CD99E8B 5BDEAE1D 9B64C2B0 EC63F226 756AA39C 026D930A 9C0906A9 EB0E363F 72076785 05005713 95BF4A82 E2B87A14 7BB12BAE 0CB61B38 92D28E9B E5D5BE0D 7CDCEFB7 0BDBDF21 86D3D2D4 F1D4E242 68DDB3F8 1FDA836E 81BE16CD F6B9265B 6FB077E1 18B74777 88085AE6 FF0F6A70 66063BCA 11010B5C 8F659EFF F862AE69 616BFFD3 166CCF45 A00AE278 D70DD2EE 4E048354 3903B3C2 A7672661 D06016F7 4969474D 3E6E77DB AED16A4A D9D65ADC 40DF0B66 37D83BF0 A9BCAE53 DEBB9EC5 47B2CF7F 30B5FFE9 BDBDF21C CABAC28A 53B39330 24B4A3A6 BAD03605 CDD70693 54DE5729 23D967BF B3667A2E C4614AB8 5D681B02 2A6F2B94 B40BBE37 C30C8EA1 5A05DF1B 2D02EF8D";

  /** @type {number} */ var crc = 0;
  /** @type {number} */ var x = 0;
  /** @type {number} */ var y = 0;

  crc = crc ^ (-1);
  for (var i = 0, iTop = str.length; i < iTop; i++) {
    y = (crc ^ str.charCodeAt(i)) & 0xFF;
    x = parseInt("0x" + table.substr(y * 9, 8), 10);
    crc = (crc >>> 8) ^ x;
  }

  return String(crc ^ (-1));
};
/// <reference path="conv/conv.ts" />
/// <reference path="crypto/sha-1.ts" />
/// <reference path="crypto/md5.ts" />
/// <reference path="crypto/crc32.ts" />


/**
 * @typedef {Object.<number, ?>}
 */
var Array;



/** @type {?function(?): string} */ akra.typeOf = function (x) {
  /** @type {string} */ var s = typeof x;

  if (s === "object") {
    if (x) {
      if (x instanceof Array) {
        return "array";
      } else if (x instanceof Object) {
        return s;
      }

      /** @type {?} */ var sClassName = Object.prototype.toString.call(x);

      if (sClassName === "[object Window]") {
        return "object";
      }

      if ((sClassName === "[object Array]" || typeof x.length === "number" && typeof x.splice !== "undefined" && typeof x.propertyIsEnumerable !== "undefined" && !x.propertyIsEnumerable("splice"))) {
        return "array";
      }

      if ((sClassName === "[object Function]" || typeof x.call !== "undefined" && typeof x.propertyIsEnumerable !== "undefined" && !x.propertyIsEnumerable("call"))) {
        return "function";
      }
    } else {
      return "null";
    }
  } else if (s === "function" && typeof x.call === "undefined") {
    return "object";
  }

  return s;
};

/** @type {?function(?): boolean} */ akra.isDef = function (x) {
  return x !== undefined;
};
/** @type {?function(?): boolean} */ akra.isDefAndNotNull = function (x) {
  return x != null;
};
/** @type {?function(?): boolean} */ akra.isEmpty = function (x) {
  return x.length === 0;
};
/** @type {?function(?): boolean} */ akra.isNull = function (x) {
  return x === null;
};
/** @type {?function(?): boolean} */ akra.isBoolean = function (x) {
  return typeof x === "boolean";
};
/** @type {?function(?): boolean} */ akra.isString = function (x) {
  return typeof x === "string";
};
/** @type {?function(?): boolean} */ akra.isNumber = function (x) {
  return typeof x === "number";
};
/** @type {?function(?): boolean} */ akra.isFloat = akra.isNumber;
/** @type {?function(?): boolean} */ akra.isInt = akra.isNumber;
/** @type {?function(?): boolean} */ akra.isFunction = function (x) {
  return akra.typeOf(x) === "function";
};
/** @type {?function(?): boolean} */ akra.isObject = function (x) {
  /** @type {string} */ var type = akra.typeOf(x);
  return type === "object" || type === "array" || type === "function";
};
/** @type {?function(?): boolean} */ akra.isArrayBuffer = function (x) {
  return x instanceof ArrayBuffer;
};
/** @type {?function(?): boolean} */ akra.isTypedArray = function (x) {
  return x !== null && typeof x === "object" && typeof x.byteOffset === "number";
};
/** @type {?function(?): boolean} */ akra.isBlob = function (x) {
  return x instanceof Blob;
};
/** @type {?function(?): boolean} */ akra.isArray = function (x) {
  return akra.typeOf(x) === "array";
};

String.prototype.replaceAt = function (n, chr) {
  return this.substr(0, n) + chr + this.substr(n + chr.length);
};

Object.defineProperty(Array.prototype, 'first', {
  enumerable: false,
  configurable: true,
  get: function () {
    return this[0];
  }
});

Object.defineProperty(Array.prototype, 'last', {
  enumerable: false,
  configurable: true,
  get: function () {
    return this[this.length - 1];
  }
});

Object.defineProperty(Array.prototype, 'el', {
  enumerable: false,
  configurable: true,
  value: function (i) {
    i = i || 0;
    return this[i < 0 ? this.length + i : i];
  }
});

Object.defineProperty(Array.prototype, 'clear', {
  enumerable: false,
  configurable: true,
  value: function () {
    this.length = 0;
  }
});

Object.defineProperty(Array.prototype, 'swap', {
  enumerable: false,
  configurable: true,
  value: function (i, j) {
    if (i < this.length && j < this.length) {
      /** @type {?} */ var t = this[i];
      this[i] = this[j];
      this[j] = t;
    }
  }
});

Object.defineProperty(Array.prototype, 'insert', {
  enumerable: false,
  configurable: true,
  value: function (pElement) {
    if (typeof pElement.length === 'number') {
      for (var i = 0, n = pElement.length; i < n; ++i) {
        this.push(pElement[i]);
      }
      ;
    } else {
      this.push(pElement);
    }

    return this;
  }
});

Number.prototype.toHex = function (iLength) {
  /** @type {?} */ var sValue = this.toString(16);

  for (var i = 0; i < iLength - sValue.length; ++i) {
    sValue = '0' + sValue;
  }

  return sValue;
};

Number.prototype.printBinary = function (isPretty) {
  if (typeof isPretty === "undefined") isPretty = true;
  /** @type {string} */ var res = "";
  for (var i = 0; i < 32; ++i) {
    if (i && (i % 4) == 0 && isPretty) {
      res = ' ' + res;
    }
    (this >> i & 0x1 ? res = '1' + res : res = '0' + res);
  }
  return res;
};
/**
 * @enum {number}
 */
akra.ELogLevel = {
  NONE: 0x0000,
  LOG: 0x0001,
  INFORMATION: 0x0002,
  WARNING: 0x0004,
  ERROR: 0x0008,
  CRITICAL: 0x0010,
  ALL: 0x001F
};

/**
 * @typedef {?function(akra.ILoggerEntity)}
 */
akra.ILogRoutineFunc;

/**
 * @interface
 */
akra.ISourceLocation = function () {
};

/** @type {string} */ akra.ISourceLocation.prototype.file;
/** @type {number} */ akra.ISourceLocation.prototype.line;

/**
 * @interface
 */
akra.ILoggerEntity = function () {
};

/** @type {number} */ akra.ILoggerEntity.prototype.code;
/** @type {akra.ISourceLocation} */ akra.ILoggerEntity.prototype.location;
/** @type {string} */ akra.ILoggerEntity.prototype.message;
/** @type {?} */ akra.ILoggerEntity.prototype.info;

/**
 * @interface
 */
akra.ILogger = function () {
};

/**
 * @type {?function(): boolean}
 */
akra.ILogger.prototype.init;

/**
 * @type {?function(akra.ELogLevel)}
 */
akra.ILogger.prototype.setLogLevel;
/**
 * @type {?function(): akra.ELogLevel}
 */
akra.ILogger.prototype.getLogLevel;

/**
 * @type {?function(number, string=): boolean}
 */
akra.ILogger.prototype.registerCode;
/**
 * @type {?function(number, string)}
 */
akra.ILogger.prototype.setUnknownCode;

/**
 * @type {?function(number, number, string=): boolean}
 */
akra.ILogger.prototype.registerCodeFamily;

/**
 * @type {?function(number): string}
 */
akra.ILogger.prototype.getFamilyName;

/**
 * @type {(?function(number, akra.ILogRoutineFunc, number): boolean|?function(string, akra.ILogRoutineFunc, number): boolean)}
 */
akra.ILogger.prototype.setCodeFamilyRoutine;
/**
 * @type {(?function(number, akra.ILogRoutineFunc, number): boolean|?function(string, akra.ILogRoutineFunc, number): boolean)}
 */
akra.ILogger.prototype.setCodeFamilyRoutine;

/**
 * @type {?function(akra.ILogRoutineFunc, number)}
 */
akra.ILogger.prototype.setLogRoutine;

/**
 * @type {(?function(string, number)|?function(akra.ISourceLocation))}
 */
akra.ILogger.prototype.setSourceLocation;
/**
 * @type {(?function(string, number)|?function(akra.ISourceLocation))}
 */
akra.ILogger.prototype.setSourceLocation;

/**
 * @type {?function(...[?]): ?}
 */
akra.ILogger.prototype.log;

/**
 * @type {(?function(akra.ILoggerEntity)|?function(number, ...[?])|?function(...[?]))}
 */
akra.ILogger.prototype.info;
/**
 * @type {(?function(akra.ILoggerEntity)|?function(number, ...[?])|?function(...[?]))}
 */
akra.ILogger.prototype.info;
/**
 * @type {(?function(akra.ILoggerEntity)|?function(number, ...[?])|?function(...[?]))}
 */
akra.ILogger.prototype.info;

/**
 * @type {(?function(akra.ILoggerEntity)|?function(number, ...[?])|?function(...[?]))}
 */
akra.ILogger.prototype.warn;
/**
 * @type {(?function(akra.ILoggerEntity)|?function(number, ...[?])|?function(...[?]))}
 */
akra.ILogger.prototype.warn;
/**
 * @type {(?function(akra.ILoggerEntity)|?function(number, ...[?])|?function(...[?]))}
 */
akra.ILogger.prototype.warn;

/**
 * @type {(?function(akra.ILoggerEntity)|?function(number, ...[?])|?function(...[?]))}
 */
akra.ILogger.prototype.error;
/**
 * @type {(?function(akra.ILoggerEntity)|?function(number, ...[?])|?function(...[?]))}
 */
akra.ILogger.prototype.error;
/**
 * @type {(?function(akra.ILoggerEntity)|?function(number, ...[?])|?function(...[?]))}
 */
akra.ILogger.prototype.error;

/**
 * @type {(?function(akra.ILoggerEntity)|?function(number, ...[?])|?function(...[?]))}
 */
akra.ILogger.prototype.critical;
/**
 * @type {(?function(akra.ILoggerEntity)|?function(number, ...[?])|?function(...[?]))}
 */
akra.ILogger.prototype.critical;
/**
 * @type {(?function(akra.ILoggerEntity)|?function(number, ...[?])|?function(...[?]))}
 */
akra.ILogger.prototype.critical;

/**
 * @type {(?function(boolean, akra.ILoggerEntity)|?function(boolean, number, ...[?])|?function(boolean, ...[?]))}
 */
akra.ILogger.prototype.assert;
/**
 * @type {(?function(boolean, akra.ILoggerEntity)|?function(boolean, number, ...[?])|?function(boolean, ...[?]))}
 */
akra.ILogger.prototype.assert;
/**
 * @type {(?function(boolean, akra.ILoggerEntity)|?function(boolean, number, ...[?])|?function(boolean, ...[?]))}
 */
akra.ILogger.prototype.assert;

/**
 * @type {(?function(boolean, akra.ILoggerEntity)|?function(boolean, number, ...[?]): ?|?function(boolean, ...[?]): ?)}
 */
akra.ILogger.prototype.presume;
/**
 * @type {(?function(boolean, akra.ILoggerEntity)|?function(boolean, number, ...[?]): ?|?function(boolean, ...[?]): ?)}
 */
akra.ILogger.prototype.presume;
/**
 * @type {(?function(boolean, akra.ILoggerEntity)|?function(boolean, number, ...[?]): ?|?function(boolean, ...[?]): ?)}
 */
akra.ILogger.prototype.presume;
/**
 * / <reference path="../common.ts" />
 */
akra.util = {};

/**
 * /*,constructor() {,if (isDef(Singleton._instance)),throw new Error("Singleton class may be created only one time.");,Singleton._instance = <T>this;,},static getInstance() {,if (Singleton._instance === null) {,Singleton._instance = new ((<any>this).constructor)();,},return Singleton._instance;,}
 *
 * @constructor
 * @struct
 */
akra.util.Singleton = function () {
  /** @type {?} */ var _this = /** @type {?} */ (this);
  /** @type {?} */ var _constructor = _this.constructor;

  if (_constructor._instance != null) {
    throw new Error("Singleton class may be created only one time.");
  }

  _constructor._instance = /** @type {?} */ (this);
};

/**
 * @returns {?}
 */
akra.util.Singleton.getInstance = function () {
  if (this._instance === null) {
    this._instance = new ((/** @type {?} */ (this)))();
  }

  return this._instance;
};

/** @type {?} */ akra.util.Singleton._instance = null;
/**
 * @param {Function} d
 * @param {Function} b
 */
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};

/**
 * @typedef {Object.<number, akra.ILogRoutineFunc>}
 */
akra.util.ILogRoutineMap;

/**
 * @interface
 */
akra.util.AICodeFamily = function () {
};

/** @type {string} */ akra.util.AICodeFamily.prototype.familyName;
/** @type {number} */ akra.util.AICodeFamily.prototype.codeMin;
/** @type {number} */ akra.util.AICodeFamily.prototype.codeMax;

/**
 * @typedef {Object.<string, akra.util.AICodeFamily>}
 */
akra.util.AICodeFamilyMap;

/**
 * @interface
 */
akra.util.AICodeInfo = function () {
};

/** @type {number} */ akra.util.AICodeInfo.prototype.code;
/** @type {string} */ akra.util.AICodeInfo.prototype.message;
/** @type {string} */ akra.util.AICodeInfo.prototype.familyName;

/**
 * @typedef {Object.<number, akra.util.AICodeInfo>}
 */
akra.util.AICodeInfoMap;

/**
 * @typedef {Object.<string, akra.util.ILogRoutineMap>}
 */
akra.util.AICodeFamilyRoutineDMap;

/**
 * @constructor
 * @struct
 * @extends {akra.util.Singleton}
 * @implements {akra.ILogger}
 */
akra.util.Logger = function () {
  akra.util.Singleton.call(this);
  /** @type {akra.ELogLevel} */ this._eLogLevel;
  /** @type {akra.util.ILogRoutineMap} */ this._pGeneralRoutineMap;
  /** @type {akra.ISourceLocation} */ this._pCurrentSourceLocation;
  /** @type {akra.ILoggerEntity} */ this._pLastLogEntity;
  /** @type {Array.<akra.util.AICodeFamily>} */ this._pCodeFamilyList;
  /** @type {akra.util.AICodeFamilyMap} */ this._pCodeFamilyMap;
  /** @type {akra.util.AICodeInfoMap} */ this._pCodeInfoMap;
  /** @type {akra.util.AICodeFamilyRoutineDMap} */ this._pCodeFamilyRoutineDMap;
  /** @type {number} */ this._nFamilyGenerator;
  /** @type {number} */ this._eUnknownCode;
  /** @type {string} */ this._sUnknownMessage;

  this._eUnknownCode = 0;
  this._sUnknownMessage = "Unknown code";

  this._eLogLevel = akra.ELogLevel.ALL;
  this._pGeneralRoutineMap = /** @type {akra.util.ILogRoutineMap} */ ({});

  this._pCurrentSourceLocation = /** @type {akra.ISourceLocation} */ ({
    file: "",
    line: 0
  });

  this._pLastLogEntity = /** @type {akra.ILoggerEntity} */ ({
    code: this._eUnknownCode,
    location: this._pCurrentSourceLocation,
    message: this._sUnknownMessage,
    info: null
  });

  this._pCodeFamilyMap = /** @type {akra.util.AICodeFamilyMap} */ ({});
  this._pCodeFamilyList = /** @type {Array.<akra.util.AICodeFamily>} */ ([]);
  this._pCodeInfoMap = /** @type {akra.util.AICodeInfoMap} */ ({});

  this._pCodeFamilyRoutineDMap = /** @type {akra.util.AICodeFamilyRoutineDMap} */ ({});

  this._nFamilyGenerator = 0;
};

__extends(akra.util.Logger, akra.util.Singleton);

/**
 * @returns {boolean}
 */
akra.util.Logger.prototype.init = function () {
  //TODO: Load file
  return true;
};

/**
 * @param {akra.ELogLevel} eLevel
 */
akra.util.Logger.prototype.setLogLevel = function (eLevel) {
  this._eLogLevel = eLevel;
};

/**
 * @returns {akra.ELogLevel}
 */
akra.util.Logger.prototype.getLogLevel = function () {
  return this._eLogLevel;
};

/**
 * @param {number} eCode
 * @param {string=} sMessage
 * @returns {boolean}
 */
akra.util.Logger.prototype.registerCode = function (eCode, sMessage) {
  if (typeof sMessage === "undefined") sMessage = this._sUnknownMessage;
  if (this.isUsedCode(eCode)) {
    return false;
  }

  /** @type {string} */ var sFamilyName = this.getFamilyName(eCode);
  if (akra.isNull(sFamilyName)) {
    return false;
  }

  /** @type {akra.util.AICodeInfo} */ var pCodeInfo = /** @type {akra.util.AICodeInfo} */ ({
    code: eCode,
    message: sMessage,
    familyName: sFamilyName
  });

  this._pCodeInfoMap[eCode] = pCodeInfo;

  return true;
};

/**
 * @param {number} eCode
 * @param {string} sMessage
 */
akra.util.Logger.prototype.setUnknownCode = function (eCode, sMessage) {
  this._eUnknownCode = eCode;
  this._sUnknownMessage = sMessage;
};

/**
 * @param {number} eCodeMin
 * @param {number} eCodeMax
 * @param {string=} sFamilyName
 * @returns {boolean}
 */
akra.util.Logger.prototype.registerCodeFamily = function (eCodeMin, eCodeMax, sFamilyName) {
  if (typeof sFamilyName === "undefined") sFamilyName = this.generateFamilyName();
  if (this.isUsedFamilyName(sFamilyName)) {
    return false;
  }

  if (!this.isValidCodeInterval(eCodeMin, eCodeMax)) {
    return false;
  }

  /** @type {akra.util.AICodeFamily} */ var pCodeFamily = /** @type {akra.util.AICodeFamily} */ ({
    familyName: sFamilyName,
    codeMin: eCodeMin,
    codeMax: eCodeMax
  });

  this._pCodeFamilyMap[sFamilyName] = pCodeFamily;
  this._pCodeFamilyList.push(pCodeFamily);

  return true;
};

/**
 * @param {?} eCode
 * @returns {string}
 */
akra.util.Logger.prototype.getFamilyName = function (eCode) {
  /** @type {number} */ var i = 0;
  /** @type {Array.<akra.util.AICodeFamily>} */ var pCodeFamilyList = this._pCodeFamilyList;
  /** @type {akra.util.AICodeFamily} */ var pCodeFamily;

  for (i = 0; i < pCodeFamilyList.length; i++) {
    pCodeFamily = pCodeFamilyList[i];

    if (pCodeFamily.codeMin <= eCode && pCodeFamily.codeMax >= eCode) {
      return pCodeFamily.familyName;
    }
  }

  return null;
};

/**
 * @type {(?function(number, akra.ILogRoutineFunc, number): boolean|?function(string, akra.ILogRoutineFunc, number): boolean|?function(): boolean)}
 */
akra.util.Logger.prototype.setCodeFamilyRoutine = function () {
  /** @type {string} */ var sFamilyName = null;
  /** @type {akra.ILogRoutineFunc} */ var fnLogRoutine = null;
  /** @type {akra.ELogLevel} */ var eLevel = akra.ELogLevel.LOG;

  if (akra.isInt(arguments[0])) {
    sFamilyName = this.getFamilyName(arguments[0]);
    fnLogRoutine = arguments[1];
    eLevel = arguments[2];

    if (akra.isNull(sFamilyName)) {
      return false;
    }
  } else if (akra.isString(arguments[0])) {
    sFamilyName = arguments[0];
    fnLogRoutine = arguments[1];
    eLevel = arguments[2];
  }

  if (!this.isUsedFamilyName(sFamilyName)) {
    return false;
  }

  /** @type {akra.util.ILogRoutineMap} */ var pCodeFamilyRoutineMap = this._pCodeFamilyRoutineDMap[sFamilyName];

  if (!akra.isDef(pCodeFamilyRoutineMap)) {
    pCodeFamilyRoutineMap = this._pCodeFamilyRoutineDMap[sFamilyName] = /** @type {akra.util.ILogRoutineMap} */ ({});
  }

  if (akra.bf.testAll(eLevel, akra.ELogLevel.LOG)) {
    pCodeFamilyRoutineMap[akra.ELogLevel.LOG] = fnLogRoutine;
  }
  if (akra.bf.testAll(eLevel, akra.ELogLevel.INFORMATION)) {
    pCodeFamilyRoutineMap[akra.ELogLevel.INFORMATION] = fnLogRoutine;
  }
  if (akra.bf.testAll(eLevel, akra.ELogLevel.WARNING)) {
    pCodeFamilyRoutineMap[akra.ELogLevel.WARNING] = fnLogRoutine;
  }
  if (akra.bf.testAll(eLevel, akra.ELogLevel.ERROR)) {
    pCodeFamilyRoutineMap[akra.ELogLevel.ERROR] = fnLogRoutine;
  }
  if (akra.bf.testAll(eLevel, akra.ELogLevel.CRITICAL)) {
    pCodeFamilyRoutineMap[akra.ELogLevel.CRITICAL] = fnLogRoutine;
  }

  return true;
};

/**
 * @param {akra.ILogRoutineFunc} fnLogRoutine
 * @param {number} eLevel
 */
akra.util.Logger.prototype.setLogRoutine = function (fnLogRoutine, eLevel) {
  if (akra.bf.testAll(eLevel, akra.ELogLevel.LOG)) {
    this._pGeneralRoutineMap[akra.ELogLevel.LOG] = fnLogRoutine;
  }
  if (akra.bf.testAll(eLevel, akra.ELogLevel.INFORMATION)) {
    this._pGeneralRoutineMap[akra.ELogLevel.INFORMATION] = fnLogRoutine;
  }
  if (akra.bf.testAll(eLevel, akra.ELogLevel.WARNING)) {
    this._pGeneralRoutineMap[akra.ELogLevel.WARNING] = fnLogRoutine;
  }
  if (akra.bf.testAll(eLevel, akra.ELogLevel.ERROR)) {
    this._pGeneralRoutineMap[akra.ELogLevel.ERROR] = fnLogRoutine;
  }
  if (akra.bf.testAll(eLevel, akra.ELogLevel.CRITICAL)) {
    this._pGeneralRoutineMap[akra.ELogLevel.CRITICAL] = fnLogRoutine;
  }
};

/**
 * @type {(?function(string, number)|?function(akra.ISourceLocation)|?function())}
 */
akra.util.Logger.prototype.setSourceLocation = function () {
  /** @type {string} */ var sFile;
  /** @type {number} */ var iLine;

  if (arguments.length === 2) {
    sFile = arguments[0];
    iLine = arguments[1];
  } else {
    if (akra.isDef(arguments[0]) && !(akra.isNull(arguments[0]))) {
      sFile = arguments[0].file;
      iLine = arguments[0].line;
    } else {
      sFile = "";
      iLine = 0;
    }
  }

  this._pCurrentSourceLocation.file = sFile;
  this._pCurrentSourceLocation.line = iLine;
};

/**
 * @param {...?} pArgs$rest
 */
akra.util.Logger.prototype.log = function (pArgs$rest) {
  /** @type {Array.<?>} */ var pArgs = [];
  for (var _i = 0; _i < arguments.length; _i++) {
    pArgs[_i] = arguments[_i];
  }
  if (!akra.bf.testAll(this._eLogLevel, akra.ELogLevel.LOG)) {
    return;
  }

  /** @type {akra.ILogRoutineFunc} */ var fnLogRoutine = this._pGeneralRoutineMap[akra.ELogLevel.LOG];
  if (!akra.isDef(fnLogRoutine)) {
    return;
  }

  /** @type {akra.ILoggerEntity} */ var pLogEntity = this._pLastLogEntity;

  pLogEntity.code = this._eUnknownCode;
  pLogEntity.location = this._pCurrentSourceLocation;
  pLogEntity.info = pArgs;
  pLogEntity.message = this._sUnknownMessage;

  fnLogRoutine.call(null, pLogEntity);
};

/**
 * @type {(?function(akra.ILoggerEntity)|?function(number, ...[?])|?function(...[?])|?function())}
 */
akra.util.Logger.prototype.info = function () {
  if (!akra.bf.testAll(this._eLogLevel, akra.ELogLevel.INFORMATION)) {
    return;
  }

  /** @type {akra.ILoggerEntity} */ var pLogEntity;
  /** @type {akra.ILogRoutineFunc} */ var fnLogRoutine;

  pLogEntity = this.prepareLogEntity.apply(this, arguments);
  fnLogRoutine = this.getCodeRoutineFunc(pLogEntity.code, akra.ELogLevel.INFORMATION);

  if (akra.isNull(fnLogRoutine)) {
    return;
  }

  fnLogRoutine.call(null, pLogEntity);
};

/**
 * @type {(?function(akra.ILoggerEntity)|?function(number, ...[?])|?function(...[?])|?function())}
 */
akra.util.Logger.prototype.warn = function () {
  if (!akra.bf.testAll(this._eLogLevel, akra.ELogLevel.WARNING)) {
    return;
  }

  /** @type {akra.ILoggerEntity} */ var pLogEntity;
  /** @type {akra.ILogRoutineFunc} */ var fnLogRoutine;

  pLogEntity = this.prepareLogEntity.apply(this, arguments);
  fnLogRoutine = this.getCodeRoutineFunc(pLogEntity.code, akra.ELogLevel.WARNING);

  if (akra.isNull(fnLogRoutine)) {
    return;
  }

  fnLogRoutine.call(null, pLogEntity);
};

/**
 * @type {(?function(akra.ILoggerEntity)|?function(number, ...[?])|?function(...[?])|?function())}
 */
akra.util.Logger.prototype.error = function () {
  if (!akra.bf.testAll(this._eLogLevel, akra.ELogLevel.ERROR)) {
    return;
  }

  /** @type {akra.ILoggerEntity} */ var pLogEntity;
  /** @type {akra.ILogRoutineFunc} */ var fnLogRoutine;

  pLogEntity = this.prepareLogEntity.apply(this, arguments);
  fnLogRoutine = this.getCodeRoutineFunc(pLogEntity.code, akra.ELogLevel.ERROR);

  if (akra.isNull(fnLogRoutine)) {
    return;
  }

  fnLogRoutine.call(null, pLogEntity);
};

/**
 * @type {(?function(akra.ILoggerEntity)|?function(number, ...[?])|?function(...[?])|?function())}
 */
akra.util.Logger.prototype.critical = function () {
  /** @type {akra.ILoggerEntity} */ var pLogEntity;
  /** @type {akra.ILogRoutineFunc} */ var fnLogRoutine;

  pLogEntity = this.prepareLogEntity.apply(this, arguments);
  fnLogRoutine = this.getCodeRoutineFunc(pLogEntity.code, akra.ELogLevel.CRITICAL);

  /** @type {string} */ var sSystemMessage = "A Critical error has occured! Code: " + pLogEntity.code.toString();

  if (akra.bf.testAll(this._eLogLevel, akra.ELogLevel.CRITICAL) && !akra.isNull(fnLogRoutine)) {
    fnLogRoutine.call(null, pLogEntity);
  }

  alert(sSystemMessage);
  throw new Error(sSystemMessage);
};

/**
 * @type {(?function(boolean, akra.ILoggerEntity)|?function(boolean, number, ...[?])|?function(boolean, ...[?])|?function())}
 */
akra.util.Logger.prototype.assert = function () {
  /** @type {boolean} */ var bCondition = /** @type {boolean} */ (arguments[0]);

  if (!bCondition) {
    /** @type {akra.ILoggerEntity} */ var pLogEntity;
    /** @type {akra.ILogRoutineFunc} */ var fnLogRoutine;

    /** @type {Array.<?>} */ var pArgs = [];

    for (var i = 1; i < arguments.length; i++) {
      pArgs[i - 1] = arguments[i];
    }

    pLogEntity = this.prepareLogEntity.apply(this, pArgs);
    fnLogRoutine = this.getCodeRoutineFunc(pLogEntity.code, akra.ELogLevel.CRITICAL);

    /** @type {string} */ var sSystemMessage = "A error has occured! Code: " + pLogEntity.code.toString() + "\n Accept to exit, refuse to continue.";

    if (akra.bf.testAll(this._eLogLevel, akra.ELogLevel.CRITICAL) && !akra.isNull(fnLogRoutine)) {
      fnLogRoutine.call(null, pLogEntity);
    }

    if (confirm(sSystemMessage)) {
      throw new Error(sSystemMessage);
    }
  }
};

/**
 * @type {(?function(boolean, akra.ILoggerEntity)|?function(boolean, number, ...[?])|?function(boolean, ...[?])|?function())}
 */
akra.util.Logger.prototype.presume = function () {
};

/**
 * @returns {string}
 */
akra.util.Logger.prototype.generateFamilyName = function () {
  /** @type {string} */ var sSuffix = /** @type {string} */ (/** @type {?} */ ((this._nFamilyGenerator++)));
  /** @type {string} */ var sName = akra.util.Logger._sDefaultFamilyName + sSuffix;

  if (this.isUsedFamilyName(sName)) {
    return this.generateFamilyName();
  } else {
    return sName;
  }
};

/**
 * @param {number} eCodeMin
 * @param {number} eCodeMax
 * @returns {boolean}
 */
akra.util.Logger.prototype.isValidCodeInterval = function (eCodeMin, eCodeMax) {
  if (eCodeMin > eCodeMax) {
    return false;
  }

  /** @type {number} */ var i = 0;
  /** @type {Array.<akra.util.AICodeFamily>} */ var pCodeFamilyList = this._pCodeFamilyList;
  /** @type {akra.util.AICodeFamily} */ var pCodeFamily;

  for (i = 0; i < pCodeFamilyList.length; i++) {
    pCodeFamily = pCodeFamilyList[i];

    if ((pCodeFamily.codeMin <= eCodeMin && pCodeFamily.codeMax >= eCodeMin) || (pCodeFamily.codeMin <= eCodeMax && pCodeFamily.codeMax >= eCodeMax)) {
      return false;
    }
  }

  return true;
};

/**
 * @param {string} sFamilyName
 * @returns {boolean}
 */
akra.util.Logger.prototype.isUsedFamilyName = function (sFamilyName) {
  return akra.isDef(this._pCodeFamilyMap[sFamilyName]);
};

/**
 * @param {number} eCode
 * @returns {boolean}
 */
akra.util.Logger.prototype.isUsedCode = function (eCode) {
  return akra.isDef(this._pCodeInfoMap[eCode]);
};

/**
 * @param {?} pObj
 * @returns {boolean}
 */
akra.util.Logger.prototype.isLogEntity = function (pObj) {
  if (akra.isObject(pObj) && akra.isDef(pObj.code) && akra.isDef(pObj.location)) {
    return true;
  }

  return false;
};

/**
 * @param {?} eCode
 * @returns {boolean}
 */
akra.util.Logger.prototype.isLogCode = function (eCode) {
  return akra.isInt(eCode);
};

/**
 * @type {(?function(akra.ILoggerEntity): akra.ILoggerEntity|?function(number, ...[?]): akra.ILoggerEntity|?function(...[?]): akra.ILoggerEntity|?function(): akra.ILoggerEntity)}
 */
akra.util.Logger.prototype.prepareLogEntity = function () {
  /** @type {number} */ var eCode = this._eUnknownCode;
  /** @type {string} */ var sMessage = this._sUnknownMessage;
  /** @type {?} */ var pInfo = null;

  if (arguments.length === 1 && this.isLogEntity(arguments[0])) {
    /** @type {akra.ILoggerEntity} */ var pEntity = arguments[0];

    eCode = pEntity.code;
    pInfo = pEntity.info;
    this.setSourceLocation(pEntity.location);

    if (!akra.isDef(pEntity.message)) {
      /** @type {akra.util.AICodeInfo} */ var pCodeInfo = this._pCodeInfoMap[eCode];
      if (akra.isDef(pCodeInfo)) {
        sMessage = pCodeInfo.message;
      }
    }
  } else {
    if (this.isLogCode(arguments[0])) {
      eCode = /** @type {number} */ (arguments[0]);
      if (arguments.length > 1) {
        pInfo = new Array(arguments.length - 1);
        /** @type {number} */ var i = 0;

        for (i = 0; i < pInfo.length; i++) {
          pInfo[i] = arguments[i + 1];
        }
      }
    } else {
      eCode = this._eUnknownCode;

      // if(arguments.length > 0){
      pInfo = new Array(arguments.length);
      i = 0;

      for (i = 0; i < pInfo.length; i++) {
        pInfo[i] = arguments[i];
      }
      // }
      // else {
      //     pInfo = null;
      // }
    }

    pCodeInfo = this._pCodeInfoMap[eCode];
    if (akra.isDef(pCodeInfo)) {
      sMessage = pCodeInfo.message;
    }
  }

  /** @type {akra.ILoggerEntity} */ var pLogEntity = this._pLastLogEntity;

  pLogEntity.code = eCode;
  pLogEntity.location = this._pCurrentSourceLocation;
  pLogEntity.message = sMessage;
  pLogEntity.info = pInfo;

  return pLogEntity;
};

/**
 * @param {number} eCode
 * @param {akra.ELogLevel} eLevel
 * @returns {akra.ILogRoutineFunc}
 */
akra.util.Logger.prototype.getCodeRoutineFunc = function (eCode, eLevel) {
  /** @type {akra.util.AICodeInfo} */ var pCodeInfo = this._pCodeInfoMap[eCode];
  /** @type {akra.ILogRoutineFunc} */ var fnLogRoutine;

  if (!akra.isDef(pCodeInfo)) {
    fnLogRoutine = this._pGeneralRoutineMap[eLevel];
    return akra.isDef(fnLogRoutine) ? fnLogRoutine : null;
  }

  /** @type {akra.util.ILogRoutineMap} */ var pCodeFamilyRoutineMap = this._pCodeFamilyRoutineDMap[pCodeInfo.familyName];

  if (!akra.isDef(pCodeFamilyRoutineMap) || !akra.isDef(pCodeFamilyRoutineMap[eLevel])) {
    fnLogRoutine = this._pGeneralRoutineMap[eLevel];
    return akra.isDef(fnLogRoutine) ? fnLogRoutine : null;
  }

  fnLogRoutine = pCodeFamilyRoutineMap[eLevel];

  return fnLogRoutine;
};

/** @type {string} */ akra.util.Logger._sDefaultFamilyName = "CodeFamily";
/// <reference path="common.ts" />
/// <reference path="util/Logger.ts" />
/**
 * export var logger: ILogger = util.Logger.getInstance();
 *
 * @type {akra.ILogger}
 */
akra.logger = new akra.util.Logger();

akra.logger.init();
akra.logger.setUnknownCode(0, "unknown");
akra.logger.setLogLevel(akra.ELogLevel.ALL);

/**
 * Default log routines
 *
 * @param {akra.ISourceLocation} pLocation
 * @returns {string}
 */
akra.sourceLocationToString = function (pLocation) {
  /** @type {Date} */ var pDate = new Date();
  /** @type {string} */ var sTime = pDate.getHours() + ":" + pDate.getMinutes() + "." + pDate.getSeconds();
  /** @type {string} */ var sLocation = "[" + pLocation.file + ":" + pLocation.line.toString() + " " + sTime + "]: ";
  return sLocation;
};

/**
 * @param {akra.ILoggerEntity} pLogEntity
 */
akra.logRoutine = function (pLogEntity) {
  /** @type {Array.<?>} */ var pArgs = pLogEntity.info;

  /** @type {string} */ var sLocation = akra.sourceLocationToString(pLogEntity.location);

  if (akra.isString(pArgs[0])) {
    pArgs[0] = sLocation + " " + pArgs[0];
  } else {
    pArgs.unshift(sLocation);
  }

  console.log.apply(console, pArgs);
};

/**
 * @param {akra.ILoggerEntity} pLogEntity
 */
akra.warningRoutine = function (pLogEntity) {
  /** @type {Array.<?>} */ var pArgs = pLogEntity.info;

  /** @type {string} */ var sCodeInfo = "Code: " + pLogEntity.code.toString() + ".";
  /** @type {string} */ var sLocation = akra.sourceLocationToString(pLogEntity.location);

  if (akra.isString(pArgs[0])) {
    pArgs[0] = sLocation + " " + sCodeInfo + " " + pArgs[0];
  } else {
    pArgs.unshift(sLocation + " " + sCodeInfo);
  }

  console.warn.apply(console, pArgs);
};

/**
 * @param {akra.ILoggerEntity} pLogEntity
 */
akra.errorRoutine = function (pLogEntity) {
  /** @type {Array.<?>} */ var pArgs = pLogEntity.info;

  /** @type {string} */ var sMessage = pLogEntity.message;
  /** @type {string} */ var sCodeInfo = "Error code: " + pLogEntity.code.toString() + ".";
  /** @type {string} */ var sLocation = akra.sourceLocationToString(pLogEntity.location);

  if (akra.isString(pArgs[0])) {
    pArgs[0] = sLocation + " " + sCodeInfo + " " + sMessage + " " + pArgs[0];
  } else {
    pArgs.unshift(sLocation + " " + sCodeInfo + " " + sMessage);
  }

  console.error.apply(console, pArgs);
};

akra.logger.setLogRoutine(akra.logRoutine, akra.ELogLevel.LOG | akra.ELogLevel.INFORMATION);
akra.logger.setLogRoutine(akra.warningRoutine, akra.ELogLevel.WARNING);
akra.logger.setLogRoutine(akra.errorRoutine, akra.ELogLevel.ERROR | akra.ELogLevel.CRITICAL);
/**
 * @const
 *
 * @type {string}
 */
akra.parser.END_POSITION = "END";

/**
 * @const
 *
 * @type {string}
 */
akra.parser.T_EMPTY = "EMPTY";

/**
 * @const
 *
 * @type {string}
 */
akra.parser.UNKNOWN_TOKEN = "UNNOWN";

/**
 * @const
 *
 * @type {string}
 */
akra.parser.START_SYMBOL = "S";

/**
 * @const
 *
 * @type {string}
 */
akra.parser.UNUSED_SYMBOL = "##";

/**
 * @const
 *
 * @type {string}
 */
akra.parser.END_SYMBOL = "$";

/**
 * @const
 *
 * @type {string}
 */
akra.parser.LEXER_RULES = "--LEXER--";

/**
 * @const
 *
 * @type {string}
 */
akra.parser.FLAG_RULE_CREATE_NODE = "--AN";

/**
 * @const
 *
 * @type {string}
 */
akra.parser.FLAG_RULE_NOT_CREATE_NODE = "--NN";

/**
 * @const
 *
 * @type {string}
 */
akra.parser.FLAG_RULE_FUNCTION = "--F";

/**
 * @const
 *
 * @type {string}
 */
akra.parser.EOF = "EOF";

/**
 * @const
 *
 * @type {string}
 */
akra.parser.T_STRING = "T_STRING";

/**
 * @const
 *
 * @type {string}
 */
akra.parser.T_FLOAT = "T_FLOAT";

/**
 * @const
 *
 * @type {string}
 */
akra.parser.T_UINT = "T_UINT";

/**
 * @const
 *
 * @type {string}
 */
akra.parser.T_TYPE_ID = "T_TYPE_ID";

/**
 * @const
 *
 * @type {string}
 */
akra.parser.T_NON_TYPE_ID = "T_NON_TYPE_ID";
/**
 * @const
 *
 * @type {number}
 */
akra.parser.LEXER_UNKNOWN_TOKEN = 2101;

/**
 * @const
 *
 * @type {number}
 */
akra.parser.LEXER_BAD_TOKEN = 2102;

akra.logger.registerCodeFamily(2000, 2199, "ParserSyntaxErrors");

akra.logger.registerCode(akra.parser.LEXER_UNKNOWN_TOKEN, "Unknown token: {tokenValue}");
akra.logger.registerCode(akra.parser.LEXER_BAD_TOKEN, "Bad token: {tokenValue}");

/**
 * interface AIStateMap {
 *    [index: string]: AIState;
 * }
 *
 * @param {akra.parser.IParser} pParser
 * @constructor
 * @struct
 * @implements {akra.parser.ILexer}
 */
akra.parser.Lexer = function (pParser) {
  /** @type {number} */ this._iLineNumber;
  /** @type {number} */ this._iColumnNumber;
  /** @type {string} */ this._sSource;
  /** @type {number} */ this._iIndex;
  /** @type {akra.parser.IParser} */ this._pParser;
  /** @type {akra.IMap} */ this._pPunctuatorsMap;
  /** @type {akra.IMap} */ this._pKeywordsMap;
  /** @type {akra.IMap} */ this._pPunctuatorsFirstSymbols;
  this._iLineNumber = 0;
  this._iColumnNumber = 0;
  this._sSource = "";
  this._iIndex = 0;
  this._pParser = pParser;
  this._pPunctuatorsMap = /** @type {akra.IMap} */ ({});
  this._pKeywordsMap = /** @type {akra.IMap} */ ({});
  this._pPunctuatorsFirstSymbols = /** @type {akra.IMap} */ ({});
};

/**
 * @param {string} sValue
 * @returns {string}
 */
akra.parser.Lexer.getPunctuatorName = function (sValue) {
  return "T_PUNCTUATOR_" + sValue.charCodeAt(0);
};

/**
 * @param {string} sValue
 * @param {string=} sName
 * @returns {string}
 */
akra.parser.Lexer.prototype.addPunctuator = function (sValue, sName) {
  if (typeof sName === "undefined") sName = akra.parser.Lexer.getPunctuatorName(sValue);
  this._pPunctuatorsMap[sValue] = sName;
  this._pPunctuatorsFirstSymbols[sValue[0]] = true;
  return sName;
};

/**
 * @param {string} sValue
 * @param {string} sName
 * @returns {string}
 */
akra.parser.Lexer.prototype.addKeyword = function (sValue, sName) {
  this._pKeywordsMap[sValue] = sName;
  return sName;
};

/**
 * @param {string} sName
 * @returns {string}
 */
akra.parser.Lexer.prototype.getTerminalValueByName = function (sName) {
  /** @type {string} */ var sValue = null;

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

/**
 * @param {string} sSource
 */
akra.parser.Lexer.prototype.init = function (sSource) {
  this._sSource = sSource;
  this._iLineNumber = 0;
  this._iColumnNumber = 0;
  this._iIndex = 0;
};

/**
 * @returns {akra.parser.IToken}
 */
akra.parser.Lexer.prototype.getNextToken = function () {
  /** @type {string} */ var ch = this.currentChar();
  if (!ch) {
    return /** @type {akra.parser.IToken} */ ({
      name: akra.parser.END_SYMBOL,
      value: akra.parser.END_SYMBOL,
      start: this._iColumnNumber,
      end: this._iColumnNumber,
      line: this._iLineNumber
    });
  }
  /** @type {akra.parser.ETokenType} */ var eType = this.identityTokenType();
  /** @type {akra.parser.IToken} */ var pToken;
  switch (eType) {
    case akra.parser.ETokenType.k_NumericLiteral:
      pToken = this.scanNumber();
      break;
    case akra.parser.ETokenType.k_CommentLiteral:
      this.scanComment();
      pToken = this.getNextToken();
      break;
    case akra.parser.ETokenType.k_StringLiteral:
      pToken = this.scanString();
      break;
    case akra.parser.ETokenType.k_PunctuatorLiteral:
      pToken = this.scanPunctuator();
      break;
    case akra.parser.ETokenType.k_IdentifierLiteral:
      pToken = this.scanIdentifier();
      break;
    case akra.parser.ETokenType.k_WhitespaceLiteral:
      this.scanWhiteSpace();
      pToken = this.getNextToken();
      break;
    default:
      this._error(akra.parser.LEXER_UNKNOWN_TOKEN, /** @type {akra.parser.IToken} */ ({
        name: akra.parser.UNKNOWN_TOKEN,
        value: ch + this._sSource[this._iIndex + 1],
        start: this._iColumnNumber,
        end: this._iColumnNumber + 1,
        line: this._iLineNumber
      }));
  }
  return pToken;
};

/**
 * @returns {number}
 */
akra.parser.Lexer.prototype._getIndex = function () {
  return this._iIndex;
};

/**
 * @param {string} sSource
 */
akra.parser.Lexer.prototype._setSource = function (sSource) {
  this._sSource = sSource;
};

/**
 * @param {number} iIndex
 */
akra.parser.Lexer.prototype._setIndex = function (iIndex) {
  this._iIndex = iIndex;
};

/**
 * @param {number} eCode
 * @param {akra.parser.IToken} pToken
 */
akra.parser.Lexer.prototype._error = function (eCode, pToken) {
  /** @type {akra.ISourceLocation} */ var pLocation = /** @type {akra.ISourceLocation} */ ({
    file: this._pParser.getParseFileName(),
    line: this._iLineNumber
  });
  /** @type {Object} */ var pInfo = {
    tokenValue: pToken.value,
    tokenType: pToken.type
  };

  /** @type {akra.ILoggerEntity} */ var pLogEntity = /** @type {akra.ILoggerEntity} */ ({ code: eCode, info: pInfo, location: pLocation });

  akra.logger.error(pLogEntity);

  throw new Error(eCode.toString());
};

/**
 * @returns {akra.parser.ETokenType}
 */
akra.parser.Lexer.prototype.identityTokenType = function () {
  if (this.isIdentifierStart()) {
    return akra.parser.ETokenType.k_IdentifierLiteral;
  }
  if (this.isWhiteSpaceStart()) {
    return akra.parser.ETokenType.k_WhitespaceLiteral;
  }
  if (this.isStringStart()) {
    return akra.parser.ETokenType.k_StringLiteral;
  }
  if (this.isCommentStart()) {
    return akra.parser.ETokenType.k_CommentLiteral;
  }
  if (this.isNumberStart()) {
    return akra.parser.ETokenType.k_NumericLiteral;
  }
  if (this.isPunctuatorStart()) {
    return akra.parser.ETokenType.k_PunctuatorLiteral;
  }
  return akra.parser.ETokenType.k_Unknown;
};

/**
 * @returns {boolean}
 */
akra.parser.Lexer.prototype.isNumberStart = function () {
  /** @type {string} */ var ch = this.currentChar();

  if ((ch >= "0") && (ch <= "9")) {
    return true;
  }

  /** @type {string} */ var ch1 = this.nextChar();
  if (ch === "." && (ch1 >= "0") && (ch1 <= "9")) {
    return true;
  }

  return false;
};

/**
 * @returns {boolean}
 */
akra.parser.Lexer.prototype.isCommentStart = function () {
  /** @type {string} */ var ch = this.currentChar();
  /** @type {string} */ var ch1 = this.nextChar();

  if (ch === "/" && (ch1 === "/" || ch1 === "*")) {
    return true;
  }

  return false;
};

/**
 * @returns {boolean}
 */
akra.parser.Lexer.prototype.isStringStart = function () {
  /** @type {string} */ var ch = this.currentChar();
  if (ch === "\"" || ch === "'") {
    return true;
  }
  return false;
};

/**
 * @returns {boolean}
 */
akra.parser.Lexer.prototype.isPunctuatorStart = function () {
  /** @type {string} */ var ch = this.currentChar();
  if (this._pPunctuatorsFirstSymbols[ch]) {
    return true;
  }
  return false;
};

/**
 * @returns {boolean}
 */
akra.parser.Lexer.prototype.isWhiteSpaceStart = function () {
  /** @type {string} */ var ch = this.currentChar();
  if (ch === " " || ch === "\n" || ch === "\r" || ch === "\t") {
    return true;
  }
  return false;
};

/**
 * @returns {boolean}
 */
akra.parser.Lexer.prototype.isIdentifierStart = function () {
  /** @type {string} */ var ch = this.currentChar();
  if ((ch === "_") || (ch >= "a" && ch <= "z") || (ch >= "A" && ch <= "Z")) {
    return true;
  }
  return false;
};

/**
 * @param {string} sSymbol
 * @returns {boolean}
 */
akra.parser.Lexer.prototype.isLineTerminator = function (sSymbol) {
  return (sSymbol === "\n" || sSymbol === "\r" || sSymbol === "\u2028" || sSymbol === "\u2029");
};

/**
 * @param {string} sSymbol
 * @returns {boolean}
 */
akra.parser.Lexer.prototype.isWhiteSpace = function (sSymbol) {
  return (sSymbol === " ") || (sSymbol === "\t");
};

/**
 * @param {string} sValue
 * @returns {boolean}
 */
akra.parser.Lexer.prototype.isKeyword = function (sValue) {
  return !!(this._pKeywordsMap[sValue]);
};

/**
 * @param {string} sValue
 * @returns {boolean}
 */
akra.parser.Lexer.prototype.isPunctuator = function (sValue) {
  return !!(this._pPunctuatorsMap[sValue]);
};

/**
 * @returns {string}
 */
akra.parser.Lexer.prototype.nextChar = function () {
  return this._sSource[this._iIndex + 1];
};

/**
 * @returns {string}
 */
akra.parser.Lexer.prototype.currentChar = function () {
  return this._sSource[/** @type {number} */ (this._iIndex)];
};

/**
 * @returns {string}
 */
akra.parser.Lexer.prototype.readNextChar = function () {
  this._iIndex++;
  this._iColumnNumber++;
  return this._sSource[/** @type {number} */ (this._iIndex)];
};

/**
 * @returns {akra.parser.IToken}
 */
akra.parser.Lexer.prototype.scanString = function () {
  /** @type {string} */ var chFirst = this.currentChar();
  /** @type {string} */ var sValue = chFirst;
  /** @type {string} */ var ch = null;
  /** @type {string} */ var chPrevious = chFirst;
  /** @type {boolean} */ var isGoodFinish = false;
  /** @type {number} */ var iStart = this._iColumnNumber;

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
    return /** @type {akra.parser.IToken} */ ({
      name: akra.parser.T_STRING,
      value: sValue,
      start: iStart,
      end: this._iColumnNumber - 1,
      line: this._iLineNumber
    });
  } else {
    if (!ch) {
      ch = akra.parser.EOF;
    }
    sValue += ch;

    this._error(akra.parser.LEXER_BAD_TOKEN, /** @type {akra.parser.IToken} */ ({
      type: akra.parser.ETokenType.k_StringLiteral,
      value: sValue,
      start: iStart,
      end: this._iColumnNumber,
      line: this._iLineNumber
    }));
    return null;
  }
};

/**
 * @returns {akra.parser.IToken}
 */
akra.parser.Lexer.prototype.scanPunctuator = function () {
  /** @type {string} */ var sValue = this.currentChar();
  /** @type {string} */ var ch;
  /** @type {number} */ var iStart = this._iColumnNumber;

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

  return /** @type {akra.parser.IToken} */ ({
    name: this._pPunctuatorsMap[sValue],
    value: sValue,
    start: iStart,
    end: this._iColumnNumber - 1,
    line: this._iLineNumber
  });
};

/**
 * @returns {akra.parser.IToken}
 */
akra.parser.Lexer.prototype.scanNumber = function () {
  /** @type {string} */ var ch = this.currentChar();
  /** @type {string} */ var sValue = "";
  /** @type {boolean} */ var isFloat = false;
  /** @type {string} */ var chPrevious = ch;
  /** @type {boolean} */ var isGoodFinish = false;
  /** @type {number} */ var iStart = this._iColumnNumber;
  /** @type {boolean} */ var isE = false;

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
    /** @type {string} */ var sName = isFloat ? akra.parser.T_FLOAT : akra.parser.T_UINT;
    return /** @type {akra.parser.IToken} */ ({
      name: sName,
      value: sValue,
      start: iStart,
      end: this._iColumnNumber - 1,
      line: this._iLineNumber
    });
  } else {
    if (!ch) {
      ch = akra.parser.EOF;
    }
    sValue += ch;
    this._error(akra.parser.LEXER_BAD_TOKEN, /** @type {akra.parser.IToken} */ ({
      type: akra.parser.ETokenType.k_NumericLiteral,
      value: sValue,
      start: iStart,
      end: this._iColumnNumber,
      line: this._iLineNumber
    }));
    return null;
  }
};

/**
 * @returns {akra.parser.IToken}
 */
akra.parser.Lexer.prototype.scanIdentifier = function () {
  /** @type {string} */ var ch = this.currentChar();
  /** @type {string} */ var sValue = ch;
  /** @type {number} */ var iStart = this._iColumnNumber;
  /** @type {boolean} */ var isGoodFinish = false;

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
      return /** @type {akra.parser.IToken} */ ({
        name: this._pKeywordsMap[sValue],
        value: sValue,
        start: iStart,
        end: this._iColumnNumber - 1,
        line: this._iLineNumber
      });
    } else {
      /** @type {string} */ var sName = this._pParser.isTypeId(sValue) ? akra.parser.T_TYPE_ID : akra.parser.T_NON_TYPE_ID;
      return /** @type {akra.parser.IToken} */ ({
        name: sName,
        value: sValue,
        start: iStart,
        end: this._iColumnNumber - 1,
        line: this._iLineNumber
      });
    }
  } else {
    if (!ch) {
      ch = akra.parser.EOF;
    }
    sValue += ch;
    this._error(akra.parser.LEXER_BAD_TOKEN, /** @type {akra.parser.IToken} */ ({
      type: akra.parser.ETokenType.k_IdentifierLiteral,
      value: sValue,
      start: iStart,
      end: this._iColumnNumber,
      line: this._iLineNumber
    }));
    return null;
  }
};

/**
 * @returns {boolean}
 */
akra.parser.Lexer.prototype.scanWhiteSpace = function () {
  /** @type {string} */ var ch = this.currentChar();

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

/**
 * @returns {boolean}
 */
akra.parser.Lexer.prototype.scanComment = function () {
  /** @type {string} */ var sValue = this.currentChar();
  /** @type {string} */ var ch = this.readNextChar();
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
    /**
     * Multiline Comment
     *
     * @type {string}
     */
    var chPrevious = ch;
    /** @type {boolean} */ var isGoodFinish = false;
    /** @type {number} */ var iStart = this._iColumnNumber;

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
      this._error(akra.parser.LEXER_BAD_TOKEN, /** @type {akra.parser.IToken} */ ({
        type: akra.parser.ETokenType.k_CommentLiteral,
        value: sValue,
        start: iStart,
        end: this._iColumnNumber,
        line: this._iLineNumber
      }));
      return false;
    }
  }
};
/**
 * @constructor
 * @struct
 * @implements {akra.parser.IParseTree}
 */
akra.parser.ParseTree = function () {
  /** @type {akra.parser.IParseNode} */ this._pRoot;
  /** @type {Array.<akra.parser.IParseNode>} */ this._pNodes;
  /** @type {Array.<number>} */ this._pNodesCountStack;
  /** @type {boolean} */ this._isOptimizeMode;
  this._pRoot = null;
  this._pNodes = /** @type {Array.<akra.parser.IParseNode>} */ ([]);
  this._pNodesCountStack = /** @type {Array.<number>} */ ([]);
  this._isOptimizeMode = false;
};

/**
 * @returns {akra.parser.IParseNode}
 */
akra.parser.ParseTree.prototype.getRoot = function () {
  return this._pRoot;
};

/**
 * @param {akra.parser.IParseNode} pRoot
 */
akra.parser.ParseTree.prototype.setRoot = function (pRoot) {
  this._pRoot = pRoot;
};

akra.parser.ParseTree.prototype.finishTree = function () {
  this._pRoot = this._pNodes.pop();
};

/**
 * @param {boolean} isOptimize
 */
akra.parser.ParseTree.prototype.setOptimizeMode = function (isOptimize) {
  this._isOptimizeMode = isOptimize;
};

/**
 * @param {akra.parser.IParseNode} pNode
 */
akra.parser.ParseTree.prototype.addNode = function (pNode) {
  this._pNodes.push(pNode);
  this._pNodesCountStack.push(1);
};

/**
 * @param {akra.parser.IRule} pRule
 * @param {akra.parser.ENodeCreateMode=} eCreate
 */
akra.parser.ParseTree.prototype.reduceByRule = function (pRule, eCreate) {
  if (typeof eCreate === "undefined") eCreate = akra.parser.ENodeCreateMode.k_Default;
  /** @type {number} */ var iReduceCount = 0;
  /** @type {Array.<number>} */ var pNodesCountStack = this._pNodesCountStack;
  /** @type {akra.parser.IParseNode} */ var pNode;
  /** @type {number} */ var iRuleLength = pRule.right.length;
  /** @type {Array.<akra.parser.IParseNode>} */ var pNodes = this._pNodes;
  /** @type {number} */ var nOptimize = this._isOptimizeMode ? 1 : 0;

  while (iRuleLength) {
    iReduceCount += pNodesCountStack.pop();
    iRuleLength--;
  }

  if ((eCreate === akra.parser.ENodeCreateMode.k_Default && iReduceCount > nOptimize) || (eCreate === akra.parser.ENodeCreateMode.k_Necessary)) {
    pNode = /** @type {akra.parser.IParseNode} */ ({
      name: pRule.left,
      children: null,
      parent: null,
      value: "",
      isAnalyzed: false,
      position: this._pNodes.length
    });

    while (iReduceCount) {
      this.addLink(pNode, pNodes.pop());
      iReduceCount -= 1;
    }

    pNodes.push(pNode);
    pNodesCountStack.push(1);
  } else {
    pNodesCountStack.push(iReduceCount);
  }
};

/**
 * @returns {string}
 */
akra.parser.ParseTree.prototype.toString = function () {
  if (this._pRoot) {
    return this.toStringNode(this._pRoot);
  } else {
    return "";
  }
};

/**
 * @returns {akra.parser.IParseTree}
 */
akra.parser.ParseTree.prototype.clone = function () {
  /** @type {akra.parser.ParseTree} */ var pTree = new akra.parser.ParseTree();
  pTree.setRoot(this.cloneNode(this._pRoot));
  return pTree;
};

/**
 * @returns {Array.<akra.parser.IParseNode>}
 */
akra.parser.ParseTree.prototype.getNodes = function () {
  return this._pNodes;
};

/**
 * @returns {akra.parser.IParseNode}
 */
akra.parser.ParseTree.prototype.getLastNode = function () {
  return this._pNodes[this._pNodes.length - 1];
};

/**
 * @param {akra.parser.IParseNode} pParent
 * @param {akra.parser.IParseNode} pNode
 */
akra.parser.ParseTree.prototype.addLink = function (pParent, pNode) {
  if (!pParent.children) {
    pParent.children = /** @type {Array.<akra.parser.IParseNode>} */ ([]);
  }
  pParent.children.push(pNode);
  pNode.parent = pParent;
};

/**
 * @param {akra.parser.IParseNode} pNode
 * @returns {akra.parser.IParseNode}
 */
akra.parser.ParseTree.prototype.cloneNode = function (pNode) {
  /** @type {akra.parser.IParseNode} */ var pNewNode;
  pNewNode = /** @type {akra.parser.IParseNode} */ ({
    name: pNode.name,
    value: pNode.value,
    children: null,
    parent: null,
    isAnalyzed: pNode.isAnalyzed,
    position: pNode.position
  });

  /** @type {Array.<akra.parser.IParseNode>} */ var pChildren = pNode.children;
  for (var i = 0; pChildren && i < pChildren.length; i++) {
    this.addLink(pNewNode, this.cloneNode(pChildren[i]));
  }

  return pNewNode;
};

/**
 * @param {akra.parser.IParseNode} pNode
 * @param {string=} sPadding
 * @returns {string}
 */
akra.parser.ParseTree.prototype.toStringNode = function (pNode, sPadding) {
  if (typeof sPadding === "undefined") sPadding = "";
  /** @type {string} */ var sRes = sPadding + "{\n";
  /** @type {string} */ var sOldPadding = sPadding;
  /** @type {string} */ var sDefaultPadding = "  ";

  sPadding += sDefaultPadding;

  if (pNode.value) {
    sRes += sPadding + "name : \"" + pNode.name + "\"" + ",\n";
    sRes += sPadding + "value : \"" + pNode.value + "\"" + "\n";
  } else {
    sRes += sPadding + "name : \"" + pNode.name + "\"" + "\n";
    sRes += sPadding + "children : [";

    /** @type {Array.<akra.parser.IParseNode>} */ var pChildren = pNode.children;

    if (pChildren) {
      sRes += "\n";
      sPadding += sDefaultPadding;

      for (var i = pChildren.length - 1; i >= 0; i--) {
        sRes += this.toStringNode(pChildren[i], sPadding);
        sRes += ",\n";
      }

      sRes = sRes.slice(0, sRes.length - 2);
      sRes += "\n";
      sRes += sOldPadding + sDefaultPadding + "]\n";
    } else {
      sRes += " ]\n";
    }
  }
  sRes += sOldPadding + "}";
  return sRes;
};
/**
 * @interface
 */
akra.parser.IState = function () {
};

/**
 * @type {?function(akra.parser.IItem, akra.parser.EParserType): akra.parser.IItem}
 */
akra.parser.IState.prototype.hasItem;
/**
 * @type {?function(akra.parser.IItem): akra.parser.IItem}
 */
akra.parser.IState.prototype.hasParentItem;
/**
 * @type {?function(akra.parser.IItem): akra.parser.IItem}
 */
akra.parser.IState.prototype.hasChildItem;

/**
 * @type {?function(akra.parser.IRule, number): boolean}
 */
akra.parser.IState.prototype.hasRule;

/**
 * @type {?function(): boolean}
 */
akra.parser.IState.prototype.isEmpty;
/**
 * @type {?function(akra.parser.IState, akra.parser.EParserType): boolean}
 */
akra.parser.IState.prototype.isEqual;

/**
 * @type {?function(akra.parser.IItem)}
 */
akra.parser.IState.prototype.push;

/**
 * @type {?function(akra.parser.IRule, number): boolean}
 */
akra.parser.IState.prototype.tryPush_LR0;
/**
 * @type {?function(akra.parser.IRule, number, string): boolean}
 */
akra.parser.IState.prototype.tryPush_LR;

/**
 * @type {?function()}
 */
akra.parser.IState.prototype.deleteNotBase;

/**
 * @type {?function(string): akra.parser.IState}
 */
akra.parser.IState.prototype.getNextStateBySymbol;
/**
 * @type {?function(string, akra.parser.IState): boolean}
 */
akra.parser.IState.prototype.addNextState;

/**
 * @type {?function(boolean): string}
 */
akra.parser.IState.prototype.toString;

/**
 * @type {?function(): number}
 */
akra.parser.IState.prototype.getIndex;
/**
 * @type {?function(number)}
 */
akra.parser.IState.prototype.setIndex;

/**
 * @type {?function(): Array.<akra.parser.IItem>}
 */
akra.parser.IState.prototype.getItems;
/**
 * @type {?function(): number}
 */
akra.parser.IState.prototype.getNumBaseItems;
/**
 * @type {?function(): akra.IMap}
 */
akra.parser.IState.prototype.getNextStates;
/**
 * @interface
 */
akra.parser.IItem = function () {
};

/**
 * @type {?function(akra.parser.IItem, akra.parser.EParserType=): boolean}
 */
akra.parser.IItem.prototype.isEqual;
/**
 * @type {?function(akra.parser.IItem): boolean}
 */
akra.parser.IItem.prototype.isParentItem;
/**
 * @type {?function(akra.parser.IItem): boolean}
 */
akra.parser.IItem.prototype.isChildItem;

/**
 * @type {?function(): string}
 */
akra.parser.IItem.prototype.mark;
/**
 * @type {?function(): string}
 */
akra.parser.IItem.prototype.end;
/**
 * @type {?function(): string}
 */
akra.parser.IItem.prototype.nextMarked;

/**
 * @type {?function(): string}
 */
akra.parser.IItem.prototype.toString;

/**
 * @type {?function(string): boolean}
 */
akra.parser.IItem.prototype.isExpected;
/**
 * @type {?function(string): boolean}
 */
akra.parser.IItem.prototype.addExpected;

/**
 * @type {?function(): akra.parser.IRule}
 */
akra.parser.IItem.prototype.getRule;
/**
 * @type {?function(akra.parser.IRule)}
 */
akra.parser.IItem.prototype.setRule;

/**
 * @type {?function(): number}
 */
akra.parser.IItem.prototype.getPosition;
/**
 * @type {?function(number)}
 */
akra.parser.IItem.prototype.setPosition;

/**
 * @type {?function(): number}
 */
akra.parser.IItem.prototype.getIndex;
/**
 * @type {?function(number)}
 */
akra.parser.IItem.prototype.setIndex;

/**
 * @type {?function(): akra.parser.IState}
 */
akra.parser.IItem.prototype.getState;
/**
 * @type {?function(akra.parser.IState)}
 */
akra.parser.IItem.prototype.setState;

/**
 * @type {?function(): boolean}
 */
akra.parser.IItem.prototype.getIsNewExpected;
/**
 * @type {?function(boolean)}
 */
akra.parser.IItem.prototype.setIsNewExpected;

/**
 * @type {?function(): akra.IMap}
 */
akra.parser.IItem.prototype.getExpectedSymbols;
/**
 * @type {?function(): number}
 */
akra.parser.IItem.prototype.getLength;
/**
 * @param {akra.parser.IRule} pRule
 * @param {number} iPos
 * @param {akra.IMap=} pExpected
 * @constructor
 * @struct
 * @implements {akra.parser.IItem}
 */
akra.parser.Item = function (pRule, iPos, pExpected) {
  /** @type {akra.parser.IRule} */ this._pRule;
  /** @type {number} */ this._iPos;
  /** @type {number} */ this._iIndex;
  /** @type {akra.parser.IState} */ this._pState;
  /** @type {akra.IMap} */ this._pExpected;
  /** @type {boolean} */ this._isNewExpected;
  /** @type {number} */ this._iLength;
  this._pRule = pRule;
  this._iPos = iPos;
  this._iIndex = 0;
  this._pState = null;

  this._isNewExpected = true;
  this._iLength = 0;
  this._pExpected = /** @type {akra.IMap} */ ({});

  if (arguments.length === 3) {
    /** @type {Array.<string>} */ var pKeys = Object.getOwnPropertyNames(/** @type {akra.IMap} */ (arguments[2]));

    for (var i = 0; i < pKeys.length; i++) {
      this.addExpected(pKeys[i]);
    }
  }
};

/**
 * @returns {akra.parser.IRule}
 */
akra.parser.Item.prototype.getRule = function () {
  return this._pRule;
};

/**
 * @param {akra.parser.IRule} pRule
 */
akra.parser.Item.prototype.setRule = function (pRule) {
  this._pRule = pRule;
};

/**
 * @returns {number}
 */
akra.parser.Item.prototype.getPosition = function () {
  return this._iPos;
};

/**
 * @param {number} iPos
 */
akra.parser.Item.prototype.setPosition = function (iPos) {
  this._iPos = iPos;
};

/**
 * @returns {akra.parser.IState}
 */
akra.parser.Item.prototype.getState = function () {
  return this._pState;
};

/**
 * @param {akra.parser.IState} pState
 */
akra.parser.Item.prototype.setState = function (pState) {
  this._pState = pState;
};

/**
 * @returns {number}
 */
akra.parser.Item.prototype.getIndex = function () {
  return this._iIndex;
};

/**
 * @param {number} iIndex
 */
akra.parser.Item.prototype.setIndex = function (iIndex) {
  this._iIndex = iIndex;
};

/**
 * @returns {boolean}
 */
akra.parser.Item.prototype.getIsNewExpected = function () {
  return this._isNewExpected;
};

/**
 * @param {boolean} _isNewExpected
 */
akra.parser.Item.prototype.setIsNewExpected = function (_isNewExpected) {
  this._isNewExpected = _isNewExpected;
};

/**
 * @returns {akra.IMap}
 */
akra.parser.Item.prototype.getExpectedSymbols = function () {
  return this._pExpected;
};

/**
 * @returns {number}
 */
akra.parser.Item.prototype.getLength = function () {
  return this._iLength;
};

/**
 * @param {akra.parser.IItem} pItem
 * @param {akra.parser.EParserType=} eType
 * @returns {boolean}
 */
akra.parser.Item.prototype.isEqual = function (pItem, eType) {
  if (typeof eType === "undefined") eType = akra.parser.EParserType.k_LR0;
  if (eType === akra.parser.EParserType.k_LR0) {
    return (this._pRule === pItem.getRule() && this._iPos === pItem.getPosition());
  } else if (eType === akra.parser.EParserType.k_LR1) {
    if (!(this._pRule === pItem.getRule() && this._iPos === pItem.getPosition() && this._iLength === (/** @type {akra.parser.IItem} */ (pItem)).getLength())) {
      return false;
    }
    /** @type {string} */ var i = null;
    for (i in this._pExpected) {
      if (!(/** @type {akra.parser.IItem} */ (pItem)).isExpected(i)) {
        return false;
      }
    }
    return true;
  } else {
    //We never must be here, for LALR(1) we work with LR0 items. This 'else'-stmt onlu for closure-compliler.
    return false;
  }
};

/**
 * @param {akra.parser.IItem} pItem
 * @returns {boolean}
 */
akra.parser.Item.prototype.isParentItem = function (pItem) {
  return (this._pRule === pItem.getRule() && this._iPos === pItem.getPosition() + 1);
};

/**
 * @param {akra.parser.IItem} pItem
 * @returns {boolean}
 */
akra.parser.Item.prototype.isChildItem = function (pItem) {
  return (this._pRule === pItem.getRule() && this._iPos === pItem.getPosition() - 1);
};

/**
 * @returns {string}
 */
akra.parser.Item.prototype.mark = function () {
  /** @type {Array.<string>} */ var pRight = this._pRule.right;
  if (this._iPos === pRight.length) {
    return akra.parser.END_POSITION;
  }
  return pRight[this._iPos];
};

/**
 * @returns {string}
 */
akra.parser.Item.prototype.end = function () {
  return this._pRule.right[this._pRule.right.length - 1] || akra.parser.T_EMPTY;
};

/**
 * @returns {string}
 */
akra.parser.Item.prototype.nextMarked = function () {
  return this._pRule.right[this._iPos + 1] || akra.parser.END_POSITION;
};

/**
 * @param {string} sSymbol
 * @returns {boolean}
 */
akra.parser.Item.prototype.isExpected = function (sSymbol) {
  return !!(this._pExpected[sSymbol]);
};

/**
 * @param {string} sSymbol
 * @returns {boolean}
 */
akra.parser.Item.prototype.addExpected = function (sSymbol) {
  if (this._pExpected[sSymbol]) {
    return false;
  }
  this._pExpected[sSymbol] = true;
  this._isNewExpected = true;
  this._iLength++;
  return true;
};

/**
 * @returns {string}
 */
akra.parser.Item.prototype.toString = function () {
  /** @type {string} */ var sMsg = this._pRule.left + " -> ";
  /** @type {string} */ var sExpected = "";
  /** @type {Array.<string>} */ var pRight = this._pRule.right;

  for (var k = 0; k < pRight.length; k++) {
    if (k === this._iPos) {
      sMsg += ". ";
    }
    sMsg += pRight[k] + " ";
  }

  if (this._iPos === pRight.length) {
    sMsg += ". ";
  }

  if (akra.isDef(this._pExpected)) {
    sExpected = ", ";
    /** @type {Array.<string>} */ var pKeys = Object.getOwnPropertyNames(this._pExpected);

    for (var l = 0; l < pKeys.length; ++l) {
      sExpected += pKeys[l] + "/";
    }

    if (sExpected !== ", ") {
      sMsg += sExpected;
    }
  }

  sMsg = sMsg.slice(0, sMsg.length - 1);
  return sMsg;
};
/**
 * @constructor
 * @struct
 * @implements {akra.parser.IState}
 */
akra.parser.State = function () {
  /** @type {Array.<akra.parser.IItem>} */ this._pItemList;
  /** @type {akra.IMap} */ this._pNextStates;
  /** @type {number} */ this._iIndex;
  /** @type {number} */ this._nBaseItems;
  this._pItemList = /** @type {Array.<akra.parser.IItem>} */ ([]);
  this._pNextStates = /** @type {akra.IMap} */ ({});
  this._iIndex = 0;
  this._nBaseItems = 0;
};

/**
 * @returns {number}
 */
akra.parser.State.prototype.getIndex = function () {
  return this._iIndex;
};

/**
 * @param {number} iIndex
 */
akra.parser.State.prototype.setIndex = function (iIndex) {
  this._iIndex = iIndex;
};

/**
 * @returns {Array.<akra.parser.IItem>}
 */
akra.parser.State.prototype.getItems = function () {
  return this._pItemList;
};

/**
 * @returns {number}
 */
akra.parser.State.prototype.getNumBaseItems = function () {
  return this._nBaseItems;
};

/**
 * @returns {akra.IMap}
 */
akra.parser.State.prototype.getNextStates = function () {
  return this._pNextStates;
};

/**
 * @param {akra.parser.IItem} pItem
 * @param {akra.parser.EParserType} eType
 * @returns {akra.parser.IItem}
 */
akra.parser.State.prototype.hasItem = function (pItem, eType) {
  /** @type {?} */ var i;
  /** @type {Array.<akra.parser.IItem>} */ var pItems = this._pItemList;
  for (i = 0; i < pItems.length; i++) {
    if (pItems[i].isEqual(pItem, eType)) {
      return pItems[i];
    }
  }
  return null;
};

/**
 * @param {akra.parser.IItem} pItem
 * @returns {akra.parser.IItem}
 */
akra.parser.State.prototype.hasParentItem = function (pItem) {
  /** @type {?} */ var i;
  /** @type {Array.<akra.parser.IItem>} */ var pItems = this._pItemList;
  for (i = 0; i < pItems.length; i++) {
    if (pItems[i].isParentItem(pItem)) {
      return pItems[i];
    }
  }
  return null;
};

/**
 * @param {akra.parser.IItem} pItem
 * @returns {akra.parser.IItem}
 */
akra.parser.State.prototype.hasChildItem = function (pItem) {
  /** @type {?} */ var i;
  /** @type {Array.<akra.parser.IItem>} */ var pItems = this._pItemList;
  for (i = 0; i < pItems.length; i++) {
    if (pItems[i].isChildItem(pItem)) {
      return pItems[i];
    }
  }
  return null;
};

/**
 * @param {akra.parser.IRule} pRule
 * @param {number} iPos
 * @returns {boolean}
 */
akra.parser.State.prototype.hasRule = function (pRule, iPos) {
  /** @type {number} */ var i = 0;
  /** @type {Array.<akra.parser.IItem>} */ var pItemList = this._pItemList;
  /** @type {akra.parser.IItem} */ var pItem;

  for (i = 0; i < this._nBaseItems; i++) {
    pItem = pItemList[i];
    if (pItem.getRule() === pRule && pItem.getPosition() === iPos) {
      return true;
    }
  }

  return false;
};

/**
 * @returns {boolean}
 */
akra.parser.State.prototype.isEmpty = function () {
  return !(this._pItemList.length);
};

/**
 * @param {akra.parser.IState} pState
 * @param {akra.parser.EParserType} eType
 * @returns {boolean}
 */
akra.parser.State.prototype.isEqual = function (pState, eType) {
  /** @type {Array.<akra.parser.IItem>} */ var pItemsA = this._pItemList;
  /** @type {Array.<akra.parser.IItem>} */ var pItemsB = pState.getItems();

  if (this._nBaseItems !== pState.getNumBaseItems()) {
    return false;
  }
  /** @type {number} */ var nItems = this._nBaseItems;
  /** @type {?} */ var i;
  /** @type {?} */ var j;
  /** @type {?} */ var isEqual;
  for (i = 0; i < nItems; i++) {
    isEqual = false;
    for (j = 0; j < nItems; j++) {
      if (pItemsA[i].isEqual(pItemsB[j], eType)) {
        isEqual = true;
        break;
      }
    }
    if (!isEqual) {
      return false;
    }
  }
  return true;
};

/**
 * @param {akra.parser.IItem} pItem
 */
akra.parser.State.prototype.push = function (pItem) {
  if (this._pItemList.length === 0 || pItem.getPosition() > 0) {
    this._nBaseItems += 1;
  }
  pItem.setState(this);
  this._pItemList.push(pItem);
};

/**
 * @param {akra.parser.IRule} pRule
 * @param {number} iPos
 * @returns {boolean}
 */
akra.parser.State.prototype.tryPush_LR0 = function (pRule, iPos) {
  /** @type {number} */ var i;
  /** @type {Array.<akra.parser.IItem>} */ var pItems = this._pItemList;
  for (i = 0; i < pItems.length; i++) {
    if (pItems[i].getRule() === pRule && pItems[i].getPosition() === iPos) {
      return false;
    }
  }
  /** @type {akra.parser.IItem} */ var pItem = new akra.parser.Item(pRule, iPos);
  this.push(pItem);
  return true;
};

/**
 * @param {akra.parser.IRule} pRule
 * @param {number} iPos
 * @param {string} sExpectedSymbol
 * @returns {boolean}
 */
akra.parser.State.prototype.tryPush_LR = function (pRule, iPos, sExpectedSymbol) {
  /** @type {number} */ var i;
  /** @type {Array.<akra.parser.IItem>} */ var pItems = /** @type {Array.<akra.parser.IItem>} */ ((this._pItemList));

  for (i = 0; i < pItems.length; i++) {
    if (pItems[i].getRule() === pRule && pItems[i].getPosition() === iPos) {
      return pItems[i].addExpected(sExpectedSymbol);
    }
  }

  /** @type {akra.IMap} */ var pExpected = /** @type {akra.IMap} */ ({});
  pExpected[sExpectedSymbol] = true;

  /** @type {akra.parser.IItem} */ var pItem = new akra.parser.Item(pRule, iPos, pExpected);
  this.push(pItem);
  return true;
};

/**
 * @param {string} sSymbol
 * @returns {akra.parser.IState}
 */
akra.parser.State.prototype.getNextStateBySymbol = function (sSymbol) {
  if (akra.isDef(this._pNextStates[sSymbol])) {
    return this._pNextStates[sSymbol];
  } else {
    return null;
  }
};

/**
 * @param {string} sSymbol
 * @param {akra.parser.IState} pState
 * @returns {boolean}
 */
akra.parser.State.prototype.addNextState = function (sSymbol, pState) {
  if (akra.isDef(this._pNextStates[sSymbol])) {
    return false;
  } else {
    this._pNextStates[sSymbol] = pState;
    return true;
  }
};

akra.parser.State.prototype.deleteNotBase = function () {
  this._pItemList.length = this._nBaseItems;
};

/**
 * @param {boolean} isBase
 * @returns {string}
 */
akra.parser.State.prototype.toString = function (isBase) {
  /** @type {number} */ var len = 0;
  /** @type {string} */ var sMsg;
  /** @type {Array.<akra.parser.IItem>} */ var pItemList = this._pItemList;

  sMsg = "State " + this._iIndex + ":\n";
  len = isBase ? this._nBaseItems : pItemList.length;

  for (var j = 0; j < len; j++) {
    sMsg += "\t\t";
    sMsg += pItemList[j].toString();
    sMsg += "\n";
  }

  return sMsg;
};
/**
 * @const
 *
 * @type {number}
 */
akra.parser.PARSER_GRAMMAR_ADD_OPERATION = 2001;

/**
 * @const
 *
 * @type {number}
 */
akra.parser.PARSER_GRAMMAR_ADD_STATE_LINK = 2002;

/**
 * @const
 *
 * @type {number}
 */
akra.parser.PARSER_GRAMMAR_UNEXPECTED_SYMBOL = 2003;

/**
 * @const
 *
 * @type {number}
 */
akra.parser.PARSER_GRAMMAR_BAD_ADDITIONAL_FUNC_NAME = 2004;

/**
 * @const
 *
 * @type {number}
 */
akra.parser.PARSER_GRAMMAR_BAD_KEYWORD = 2005;

/**
 * @const
 *
 * @type {number}
 */
akra.parser.PARSER_SYNTAX_ERROR = 2051;

akra.logger.registerCode(akra.parser.PARSER_GRAMMAR_ADD_OPERATION, "Grammar not LALR(1)! Cannot to generate syntax table. Add operation error.\n" + "Conflict in state with index: {stateIndex}. With grammar symbol: \"{grammarSymbol}\"\n" + "Old operation: {oldOperation}\n" + "New operation: {newOperation}\n" + "For more info init parser in debug-mode and see syntax table and list of states.");

akra.logger.registerCode(akra.parser.PARSER_GRAMMAR_ADD_STATE_LINK, "Grammar not LALR(1)! Cannot to generate syntax table. Add state link error.\n" + "Conflict in state with index: {stateIndex}. With grammar symbol: \"{grammarSymbol}\"\n" + "Old next state: {oldNextStateIndex}\n" + "New next state: {newNextStateIndex}\n" + "For more info init parser in debug-mode and see syntax table and list of states.");

akra.logger.registerCode(akra.parser.PARSER_GRAMMAR_UNEXPECTED_SYMBOL, "Grammar error. Can`t generate rules from grammar\n" + "Unexpected symbol: {unexpectedSymbol}\n" + "Expected: {expectedSymbol}");

akra.logger.registerCode(akra.parser.PARSER_GRAMMAR_BAD_ADDITIONAL_FUNC_NAME, "Grammar error. Empty additional function name.");
akra.logger.registerCode(akra.parser.PARSER_GRAMMAR_BAD_KEYWORD, "Grammar error. Bad keyword: {badKeyword}\n" + "All keyword must be define in lexer rule block.");

akra.logger.registerCode(akra.parser.PARSER_SYNTAX_ERROR, "Syntax error during parsing. Token: {tokenValue}\n" + "Line: {line}. Column: {column}.");

/**
 * @param {akra.ISourceLocation} pLocation
 * @returns {string}
 */
akra.parser.sourceLocationToString = function (pLocation) {
  /** @type {string} */ var sLocation = "[" + pLocation.file + ":" + pLocation.line.toString() + "]: ";
  return sLocation;
};

/**
 * @param {akra.ILoggerEntity} pLogEntity
 */
akra.parser.syntaxErrorLogRoutine = function (pLogEntity) {
  /** @type {string} */ var sPosition = akra.parser.sourceLocationToString(pLogEntity.location);
  /** @type {string} */ var sError = "Code: " + pLogEntity.code.toString() + ". ";
  /** @type {Array.<string>} */ var pParseMessage = /** @type {Array.<string>} */ (pLogEntity.message.split(/\{(\w+)\}/));
  /** @type {?} */ var pInfo = pLogEntity.info;

  for (var i = 0; i < pParseMessage.length; i++) {
    if (akra.isDef(pInfo[pParseMessage[i]])) {
      pParseMessage[i] = /** @type {string} */ (/** @type {?} */ (pInfo[pParseMessage[i]]));
    }
  }

  /** @type {string} */ var sMessage = sPosition + sError + pParseMessage.join("");

  console.error.call(console, sMessage);
};

/** @type {boolean} */ (akra.logger.setCodeFamilyRoutine("ParserSyntaxErrors", akra.parser.syntaxErrorLogRoutine, akra.ELogLevel.ERROR));

/**
 * @interface
 */
akra.parser.IOperation = function () {
};

/** @type {akra.parser.EOperationType} */ akra.parser.IOperation.prototype.type;
/** @type {akra.parser.IRule} */ akra.parser.IOperation.prototype.rule;
/** @type {number} */ akra.parser.IOperation.prototype.index;

/**
 * @typedef {(Object.<string, akra.parser.IOperation>|Object.<number, akra.parser.IOperation>)}
 */
akra.parser.IOperationMap;

/**
 * @typedef {Object.<number, akra.parser.IOperationMap>}
 */
akra.parser.IOperationDMap;

/**
 * @typedef {(Object.<number, akra.parser.IRule>|Object.<string, akra.parser.IRule>)}
 */
akra.parser.IRuleMap;

/**
 * @typedef {(Object.<number, akra.parser.IRuleMap>|Object.<string, akra.parser.IRuleMap>)}
 */
akra.parser.IRuleDMap;

/**
 * @typedef {Object.<string, akra.parser.IRuleFunction>}
 */
akra.parser.IRuleFunctionMap;

/**
 * @typedef {Object.<number, akra.parser.IRuleFunctionMap>}
 */
akra.parser.IRuleFunctionDMap;

/**
 * @interface
 */
akra.parser.IAdditionalFuncInfo = function () {
};

/** @type {string} */ akra.parser.IAdditionalFuncInfo.prototype.name;
/** @type {number} */ akra.parser.IAdditionalFuncInfo.prototype.position;
/** @type {akra.parser.IRule} */ akra.parser.IAdditionalFuncInfo.prototype.rule;

/**
 * @constructor
 * @struct
 * @implements {akra.parser.IParser}
 */
akra.parser.Parser = function () {
  /**
   * //Input
   *
   * @type {string}
   */
  this._sSource;
  /** @type {number} */ this._iIndex;
  /** @type {string} */ this._sFileName;
  /**
   * Output
   *
   * @type {akra.parser.IParseTree}
   */
  this._pSyntaxTree;
  /** @type {akra.IMap} */ this._pTypeIdMap;
  /**
   * Process params
   *
   * @type {akra.parser.ILexer}
   */
  this._pLexer;
  /** @type {Array.<number>} */ this._pStack;
  /** @type {akra.parser.IToken} */ this._pToken;
  /**
   * For async loading of files work fine
   *
   * @type {akra.parser.IFinishFunc}
   */
  this._fnFinishCallback;
  /** @type {?} */ this._pCaller;
  /**
   * Grammar Info
   *
   * @type {akra.IMap}
   */
  this._pSymbolMap;
  /** @type {akra.parser.IOperationDMap} */ this._pSyntaxTable;
  /** @type {akra.parser.IOperationMap} */ this._pReduceOperationsMap;
  /** @type {akra.parser.IOperationMap} */ this._pShiftOperationsMap;
  /** @type {akra.parser.IOperation} */ this._pSuccessOperation;
  /** @type {akra.IBoolDMap} */ this._pFirstTerminalsDMap;
  /** @type {akra.IBoolDMap} */ this._pFollowTerminalsDMap;
  /** @type {akra.parser.IRuleDMap} */ this._pRulesDMap;
  /** @type {Array.<akra.parser.IState>} */ this._pStateList;
  /** @type {number} */ this._nRules;
  /** @type {Array.<akra.parser.IAdditionalFuncInfo>} */ this._pAdditionalFuncInfoList;
  /** @type {akra.parser.IRuleFunctionMap} */ this._pAdditionalFunctionsMap;
  /** @type {akra.parser.IRuleFunctionDMap} */ this._pAdidtionalFunctByStateDMap;
  /** @type {akra.parser.EParserType} */ this._eType;
  /** @type {akra.IMap} */ this._pGrammarSymbols;
  /**
   * Additioanal info
   *
   * @type {akra.IMap}
   */
  this._pRuleCreationModeMap;
  /** @type {akra.parser.EParseMode} */ this._eParseMode;
  /**
   * private _isSync: boolean;
   * Temp
   *
   * @type {akra.IMap}
   */
  this._pStatesTempMap;
  /** @type {Array.<akra.parser.IItem>} */ this._pBaseItemList;
  /** @type {akra.IBoolDMap} */ this._pExpectedExtensionDMap;
  this._sSource = "";
  this._iIndex = 0;

  this._pSyntaxTree = null;
  this._pTypeIdMap = null;

  this._pLexer = null;
  this._pStack = /** @type {Array.<number>} */ ([]);
  this._pToken = null;

  this._fnFinishCallback = null;
  this._pCaller = null;

  this._pSymbolMap = /** @type {akra.IMap} */ (/** @type {?} */ ({ END_SYMBOL: true }));
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

  this._eType = akra.parser.EParserType.k_LR0;

  this._pRuleCreationModeMap = null;
  this._eParseMode = akra.parser.EParseMode.k_AllNode;

  // this._isSync = false;
  this._pStatesTempMap = null;
  this._pBaseItemList = null;

  this._pExpectedExtensionDMap = null;

  this._sFileName = "stdin";
};

/**
 * @param {string} sValue
 * @returns {boolean}
 */
akra.parser.Parser.prototype.isTypeId = function (sValue) {
  return !!(this._pTypeIdMap[sValue]);
};

/**
 * @param {akra.parser.IParseNode} pNode
 * @returns {string}
 */
akra.parser.Parser.prototype.returnCode = function (pNode) {
  if (pNode) {
    if (pNode.value) {
      return pNode.value + " ";
    } else if (pNode.children) {
      /** @type {string} */ var sCode = "";
      /** @type {number} */ var i = 0;
      for (i = pNode.children.length - 1; i >= 0; i--) {
        sCode += this.returnCode(pNode.children[i]);
      }
      return sCode;
    }
  }
  return "";
};

/**
 * @param {string} sGrammar
 * @param {akra.parser.EParseMode=} eMode
 * @param {akra.parser.EParserType=} eType
 * @returns {boolean}
 */
akra.parser.Parser.prototype.init = function (sGrammar, eMode, eType) {
  if (typeof eMode === "undefined") eMode = akra.parser.EParseMode.k_AllNode;
  if (typeof eType === "undefined") eType = akra.parser.EParserType.k_LALR;
  try  {
    this._eType = eType;
    this._pLexer = new akra.parser.Lexer(this);
    this._eParseMode = eMode;
    this.generateRules(sGrammar);
    this.buildSyntaxTable();
    this.generateFunctionByStateMap();
    if (!akra.bf.testAll(eMode, akra.parser.EParseMode.k_DebugMode)) {
      this.clearMem();
    }
    return true;
  } catch (e) {
    akra.logger.log(e.stack);

    // error("Could`not initialize parser. Error with code has occurred: " + e.message + ". See log for more info.");
    return false;
  }
};

/**
 * @param {string} sSource
 * @param {akra.parser.IFinishFunc=} fnFinishCallback
 * @param {?=} pCaller
 * @returns {akra.parser.EParserCode}
 */
akra.parser.Parser.prototype.parse = function (sSource, fnFinishCallback, pCaller) {
  if (typeof fnFinishCallback === "undefined") fnFinishCallback = null;
  if (typeof pCaller === "undefined") pCaller = null;
  try  {
    this.defaultInit();
    this._sSource = sSource;
    this._pLexer.init(sSource);

    //this._isSync = isSync;
    this._fnFinishCallback = fnFinishCallback;
    this._pCaller = pCaller;

    /** @type {akra.parser.IParseTree} */ var pTree = this._pSyntaxTree;
    /** @type {Array.<number>} */ var pStack = this._pStack;
    /** @type {akra.parser.IOperationDMap} */ var pSyntaxTable = this._pSyntaxTable;

    /** @type {boolean} */ var isStop = false;
    /** @type {boolean} */ var isError = false;
    /** @type {boolean} */ var isPause = false;
    /** @type {akra.parser.IToken} */ var pToken = this.readToken();

    /** @type {akra.parser.IOperation} */ var pOperation;
    /** @type {number} */ var iRuleLength;

    /** @type {akra.parser.EOperationType} */ var eAdditionalOperationCode;
    /** @type {number} */ var iStateIndex = 0;

    while (!isStop) {
      pOperation = pSyntaxTable[pStack[pStack.length - 1]][pToken.name];
      if (akra.isDef(pOperation)) {
        switch (pOperation.type) {
          case akra.parser.EOperationType.k_Success:
            isStop = true;
            break;

          case akra.parser.EOperationType.k_Shift:
            iStateIndex = pOperation.index;
            pStack.push(iStateIndex);
            pTree.addNode(/** @type {akra.parser.IParseNode} */ (pToken));

            eAdditionalOperationCode = this.operationAdditionalAction(iStateIndex, pToken.name);

            if (eAdditionalOperationCode === akra.parser.EOperationType.k_Error) {
              isError = true;
              isStop = true;
            } else if (eAdditionalOperationCode === akra.parser.EOperationType.k_Pause) {
              this._pToken = null;
              isStop = true;
              isPause = true;
            } else if (eAdditionalOperationCode === akra.parser.EOperationType.k_Ok) {
              pToken = this.readToken();
            }

            break;

          case akra.parser.EOperationType.k_Reduce:
            iRuleLength = pOperation.rule.right.length;
            pStack.length -= iRuleLength;
            iStateIndex = pSyntaxTable[pStack[pStack.length - 1]][pOperation.rule.left].index;
            pStack.push(iStateIndex);
            pTree.reduceByRule(pOperation.rule, this._pRuleCreationModeMap[pOperation.rule.left]);

            eAdditionalOperationCode = this.operationAdditionalAction(iStateIndex, pOperation.rule.left);

            if (eAdditionalOperationCode === akra.parser.EOperationType.k_Error) {
              isError = true;
              isStop = true;
            } else if (eAdditionalOperationCode === akra.parser.EOperationType.k_Pause) {
              this._pToken = pToken;
              isStop = true;
              isPause = true;
            }

            break;
        }
      } else {
        isError = true;
        isStop = true;
      }
    }
  } catch (e) {
    // debug_print(e.stack);
    this._sFileName = "stdin";
    return akra.parser.EParserCode.k_Error;
  }

  if (isPause) {
    return akra.parser.EParserCode.k_Pause;
  }

  if (!isError) {
    pTree.finishTree();
    if (!akra.isNull(this._fnFinishCallback)) {
      this._fnFinishCallback.call(this._pCaller, akra.parser.EParserCode.k_Ok, this.getParseFileName());
    }
    this._sFileName = "stdin";
    return akra.parser.EParserCode.k_Ok;
  } else {
    this._error(akra.parser.PARSER_SYNTAX_ERROR, pToken);
    if (!akra.isNull(this._fnFinishCallback)) {
      this._fnFinishCallback.call(this._pCaller, akra.parser.EParserCode.k_Error, this.getParseFileName());
    }
    this._sFileName = "stdin";
    return akra.parser.EParserCode.k_Error;
  }
};

/**
 * @param {string} sFileName
 */
akra.parser.Parser.prototype.setParseFileName = function (sFileName) {
  this._sFileName = sFileName;
};

/**
 * @returns {string}
 */
akra.parser.Parser.prototype.getParseFileName = function () {
  return this._sFileName;
};

/**
 * @returns {akra.parser.EParserCode}
 */
akra.parser.Parser.prototype.pause = function () {
  return akra.parser.EParserCode.k_Pause;
};

/**
 * @returns {akra.parser.EParserCode}
 */
akra.parser.Parser.prototype.resume = function () {
  return this.resumeParse();
};

/**
 * @param {boolean=} isBaseOnly
 */
akra.parser.Parser.prototype.printStates = function (isBaseOnly) {
  if (typeof isBaseOnly === "undefined") isBaseOnly = true;
  if (!akra.isDef(this._pStateList)) {
    akra.logger.log("It`s impossible to print states. You must init parser in debug-mode");
    return;
  }
  /** @type {string} */ var sMsg = "\n" + this.statesToString(isBaseOnly);
  akra.logger.log(sMsg);
};

/**
 * @param {number} iStateIndex
 * @param {boolean=} isBaseOnly
 */
akra.parser.Parser.prototype.printState = function (iStateIndex, isBaseOnly) {
  if (typeof isBaseOnly === "undefined") isBaseOnly = true;
  if (!akra.isDef(this._pStateList)) {
    akra.logger.log("It`s impossible to print states. You must init parser in debug-mode");
    return;
  }

  /** @type {akra.parser.IState} */ var pState = this._pStateList[iStateIndex];
  if (!akra.isDef(pState)) {
    akra.logger.log("Can not print stete with index: " + iStateIndex.toString());
    return;
  }

  /** @type {string} */ var sMsg = "\n" + pState.toString(isBaseOnly);
  akra.logger.log(sMsg);
};

/**
 * @returns {akra.IMap}
 */
akra.parser.Parser.prototype.getGrammarSymbols = function () {
  return this._pGrammarSymbols;
};

/**
 * inline
 *
 * @returns {akra.parser.IParseTree}
 */
akra.parser.Parser.prototype.getSyntaxTree = function () {
  return this._pSyntaxTree;
};

/**
 * @returns {akra.parser.IParserState}
 */
akra.parser.Parser.prototype._saveState = function () {
  return /** @type {akra.parser.IParserState} */ ({
    source: this._sSource,
    index: this._pLexer._getIndex(),
    fileName: this._sFileName,
    tree: this._pSyntaxTree,
    types: this._pTypeIdMap,
    stack: this._pStack,
    token: this._pToken,
    fnCallback: this._fnFinishCallback,
    caller: this._pCaller
  });
};

/**
 * @param {akra.parser.IParserState} pState
 */
akra.parser.Parser.prototype._loadState = function (pState) {
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
};

/**
 * @param {string} sFuncName
 * @param {akra.parser.IRuleFunction} fnRuleFunction
 */
akra.parser.Parser.prototype.addAdditionalFunction = function (sFuncName, fnRuleFunction) {
  if (akra.isNull(this._pAdditionalFunctionsMap)) {
    this._pAdditionalFunctionsMap = /** @type {akra.parser.IRuleFunctionMap} */ ({});
  }
  this._pAdditionalFunctionsMap[sFuncName] = fnRuleFunction;
};

/**
 * @param {string} sIdentifier
 */
akra.parser.Parser.prototype.addTypeId = function (sIdentifier) {
  if (akra.isNull(this._pTypeIdMap)) {
    this._pTypeIdMap = /** @type {akra.IMap} */ ({});
  }
  this._pTypeIdMap[sIdentifier] = true;
};

akra.parser.Parser.prototype.defaultInit = function () {
  this._iIndex = 0;
  this._pStack = [0];
  this._pSyntaxTree = new akra.parser.ParseTree();
  this._pTypeIdMap = /** @type {akra.IMap} */ ({});

  this._pSyntaxTree.setOptimizeMode(akra.bf.testAll(this._eParseMode, akra.parser.EParseMode.k_Optimize));
};

/**
 * @param {number} eCode
 * @param {?} pErrorInfo
 */
akra.parser.Parser.prototype._error = function (eCode, pErrorInfo) {
  /** @type {akra.ISourceLocation} */ var pLocation = /** @type {akra.ISourceLocation} */ ({});

  /** @type {?} */ var pInfo = {
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

  /** @type {akra.ILoggerEntity} */ var pLogEntity = /** @type {akra.ILoggerEntity} */ ({ code: eCode, info: pInfo, location: pLocation });

  /** @type {akra.parser.IToken} */ var pToken;
  /** @type {number} */ var iLine;
  /** @type {number} */ var iColumn;
  /** @type {number} */ var iStateIndex;
  /** @type {string} */ var sSymbol;
  /** @type {akra.parser.IOperation} */ var pOldOperation;
  /** @type {akra.parser.IOperation} */ var pNewOperation;
  /** @type {number} */ var iOldNextStateIndex;
  /** @type {number} */ var iNewNextStateIndex;
  /** @type {string} */ var sExpectedSymbol;
  /** @type {string} */ var sUnexpectedSymbol;
  /** @type {string} */ var sBadKeyword;

  if (eCode === akra.parser.PARSER_SYNTAX_ERROR) {
    pToken = /** @type {akra.parser.IToken} */ (pErrorInfo);
    iLine = pToken.line;
    iColumn = pToken.start;

    pInfo.tokenValue = pToken.value;
    pInfo.line = iLine;
    pInfo.column = iColumn;

    pLocation.file = this.getParseFileName();
    pLocation.line = iLine;
  } else if (eCode === akra.parser.PARSER_GRAMMAR_ADD_OPERATION) {
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
  } else if (eCode === akra.parser.PARSER_GRAMMAR_ADD_STATE_LINK) {
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
  } else if (eCode === akra.parser.PARSER_GRAMMAR_UNEXPECTED_SYMBOL) {
    iLine = pErrorInfo.grammarLine;
    sExpectedSymbol = pErrorInfo.expectedSymbol;
    sUnexpectedSymbol = pErrorInfo.unexpectedSymbol;

    pInfo.expectedSymbol = sExpectedSymbol;
    pInfo.unexpectedSymbol = sExpectedSymbol;

    pLocation.file = "GRAMMAR";
    pLocation.line = iLine || 0;
  } else if (eCode === akra.parser.PARSER_GRAMMAR_BAD_ADDITIONAL_FUNC_NAME) {
    iLine = pErrorInfo.grammarLine;

    pLocation.file = "GRAMMAR";
    pLocation.line = iLine || 0;
  } else if (eCode === akra.parser.PARSER_GRAMMAR_BAD_KEYWORD) {
    iLine = pErrorInfo.grammarLine;
    sBadKeyword = pErrorInfo.badKeyword;

    pInfo.badKeyword = sBadKeyword;

    pLocation.file = "GRAMMAR";
    pLocation.line = iLine || 0;
  }

  akra.logger.error(pLogEntity);

  throw new Error(eCode.toString());
};

akra.parser.Parser.prototype.clearMem = function () {
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
};

/**
 * @param {akra.parser.IState} pState
 * @param {akra.parser.EParserType} eType
 * @returns {akra.parser.IState}
 */
akra.parser.Parser.prototype.hasState = function (pState, eType) {
  /** @type {Array.<akra.parser.IState>} */ var pStateList = this._pStateList;
  /** @type {number} */ var i = 0;

  for (i = 0; i < pStateList.length; i++) {
    if (pStateList[i].isEqual(pState, eType)) {
      return pStateList[i];
    }
  }

  return null;
};

/**
 * @param {string} sSymbol
 * @returns {boolean}
 */
akra.parser.Parser.prototype.isTerminal = function (sSymbol) {
  return !(this._pRulesDMap[sSymbol]);
};

/**
 * @param {akra.parser.IState} pState
 */
akra.parser.Parser.prototype.pushState = function (pState) {
  pState.setIndex(this._pStateList.length);
  this._pStateList.push(pState);
};

/**
 * @param {akra.parser.IItem} pItem
 */
akra.parser.Parser.prototype.pushBaseItem = function (pItem) {
  pItem.setIndex(this._pBaseItemList.length);
  this._pBaseItemList.push(pItem);
};

/**
 * @param {akra.parser.IState} pState
 * @param {akra.parser.EParserType} eType
 * @returns {akra.parser.IState}
 */
akra.parser.Parser.prototype.tryAddState = function (pState, eType) {
  /** @type {akra.parser.IState} */ var pRes = this.hasState(pState, eType);

  if (akra.isNull(pRes)) {
    if (eType === akra.parser.EParserType.k_LR0) {
      /** @type {Array.<akra.parser.IItem>} */ var pItems = pState.getItems();
      for (var i = 0; i < pItems.length; i++) {
        this.pushBaseItem(pItems[i]);
      }
    }

    this.pushState(pState);
    this.closure(pState, eType);

    return pState;
  }

  return pRes;
};

/**
 * @param {string} sSymbol
 * @returns {boolean}
 */
akra.parser.Parser.prototype.hasEmptyRule = function (sSymbol) {
  if (this.isTerminal(sSymbol)) {
    return false;
  }

  /** @type {akra.parser.IRuleDMap} */ var pRulesDMap = this._pRulesDMap;
  for (var i in pRulesDMap[sSymbol]) {
    if (pRulesDMap[sSymbol][i].right.length === 0) {
      return true;
    }
  }

  return false;
};

/**
 * @param {number} iIndex
 * @param {string} sSymbol
 * @param {akra.parser.IOperation} pOperation
 */
akra.parser.Parser.prototype.pushInSyntaxTable = function (iIndex, sSymbol, pOperation) {
  /** @type {akra.parser.IOperationDMap} */ var pSyntaxTable = this._pSyntaxTable;
  if (!pSyntaxTable[iIndex]) {
    pSyntaxTable[iIndex] = /** @type {akra.parser.IOperationMap} */ ({});
  }
  if (akra.isDef(pSyntaxTable[iIndex][sSymbol])) {
    this._error(akra.parser.PARSER_GRAMMAR_ADD_OPERATION, {
      stateIndex: iIndex,
      grammarSymbol: this.convertGrammarSymbol(sSymbol),
      oldOperation: this._pSyntaxTable[iIndex][sSymbol],
      newOperation: pOperation
    });
  }
  pSyntaxTable[iIndex][sSymbol] = pOperation;
};

/**
 * @param {akra.parser.IState} pState
 * @param {akra.parser.IState} pNextState
 * @param {string} sSymbol
 */
akra.parser.Parser.prototype.addStateLink = function (pState, pNextState, sSymbol) {
  /** @type {boolean} */ var isAddState = pState.addNextState(sSymbol, pNextState);
  if (!isAddState) {
    this._error(akra.parser.PARSER_GRAMMAR_ADD_STATE_LINK, {
      stateIndex: pState.getIndex(),
      oldNextStateIndex: pState.getNextStateBySymbol(sSymbol),
      newNextStateIndex: pNextState.getIndex(),
      grammarSymbol: this.convertGrammarSymbol(sSymbol)
    });
  }
};

/**
 * @param {string} sSymbol
 * @returns {akra.IMap}
 */
akra.parser.Parser.prototype.firstTerminal = function (sSymbol) {
  if (this.isTerminal(sSymbol)) {
    return null;
  }

  if (akra.isDef(this._pFirstTerminalsDMap[sSymbol])) {
    return this._pFirstTerminalsDMap[sSymbol];
  }

  /** @type {string} */ var sRule;
  /** @type {string} */ var sName;
  /** @type {Array.<string>} */ var pNames;
  /** @type {number} */ var i = 0;
  /** @type {number} */ var j = 0;
  /** @type {number} */ var k = null;
  /** @type {akra.parser.IRuleMap} */ var pRulesMap = this._pRulesDMap[sSymbol];

  /** @type {akra.IMap} */ var pTempRes = /** @type {akra.IMap} */ ({});
  /** @type {akra.IMap} */ var pRes;

  /** @type {Array.<string>} */ var pRight;
  /** @type {boolean} */ var isFinish;

  pRes = this._pFirstTerminalsDMap[sSymbol] = /** @type {akra.IMap} */ ({});

  if (this.hasEmptyRule(sSymbol)) {
    pRes[akra.parser.T_EMPTY] = true;
  }

  if (akra.isNull(pRulesMap)) {
    return pRes;
  }

  /** @type {Array.<string>} */ var pRuleNames = Object.keys(pRulesMap);

  for (i = 0; i < pRuleNames.length; ++i) {
    sRule = pRuleNames[i];

    isFinish = false;
    pRight = pRulesMap[sRule].right;

    for (j = 0; j < pRight.length; j++) {
      if (pRight[j] === sSymbol) {
        if (pRes[akra.parser.T_EMPTY]) {
          continue;
        }

        isFinish = true;
        break;
      }

      pTempRes = this.firstTerminal(pRight[j]);

      if (akra.isNull(pTempRes)) {
        pRes[pRight[j]] = true;
      } else {
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
      pRes[akra.parser.T_EMPTY] = true;
    }
  }

  return pRes;
};

/**
 * @param {string} sSymbol
 * @returns {akra.IMap}
 */
akra.parser.Parser.prototype.followTerminal = function (sSymbol) {
  if (akra.isDef(this._pFollowTerminalsDMap[sSymbol])) {
    return this._pFollowTerminalsDMap[sSymbol];
  }

  /** @type {number} */ var i = 0;
  /** @type {number} */ var j = 0;
  /** @type {number} */ var k = 0;
  /** @type {number} */ var l = 0;
  /** @type {number} */ var m = 0;
  /** @type {akra.parser.IRuleDMap} */ var pRulesDMap = this._pRulesDMap;
  /** @type {Array.<string>} */ var pRulesDMapKeys;
  /** @type {Array.<string>} */ var pRulesMapKeys;

  /** @type {akra.parser.IRule} */ var pRule;
  /** @type {akra.IMap} */ var pTempRes;
  /** @type {Array.<string>} */ var pTempKeys;
  /** @type {akra.IMap} */ var pRes;

  /** @type {Array.<string>} */ var pRight;
  /** @type {boolean} */ var isFinish;

  /** @type {string} */ var sFirstKey;
  /** @type {string} */ var sSecondKey;

  pRes = this._pFollowTerminalsDMap[sSymbol] = /** @type {akra.IMap} */ ({});

  if (akra.isNull(pRulesDMap)) {
    return pRes;
  }

  pRulesDMapKeys = Object.keys(pRulesDMap);
  for (i = 0; i < pRulesDMapKeys.length; i++) {
    sFirstKey = pRulesDMapKeys[i];

    if (akra.isNull(pRulesDMap[sFirstKey])) {
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
          } else {
            isFinish = false;

            for (l = k + 1; l < pRight.length; l++) {
              pTempRes = this.firstTerminal(pRight[l]);

              if (akra.isNull(pTempRes)) {
                pRes[pRight[l]] = true;
                isFinish = true;
                break;
              } else {
                pTempKeys = Object.keys(pTempRes);
                for (m = 0; m < pTempKeys.length; i++) {
                  pRes[pTempKeys[m]] = true;
                }
              }

              if (!pTempRes[akra.parser.T_EMPTY]) {
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
};

/**
 * @param {Array.<string>} pSet
 * @param {akra.IMap} pExpected
 * @returns {akra.IMap}
 */
akra.parser.Parser.prototype.firstTerminalForSet = function (pSet, pExpected) {
  /** @type {number} */ var i = 0;
  /** @type {number} */ var j = 0;

  /** @type {akra.IMap} */ var pTempRes;
  /** @type {akra.IMap} */ var pRes = /** @type {akra.IMap} */ ({});

  /** @type {boolean} */ var isEmpty;

  /** @type {Array.<string>} */ var pKeys;
  /** @type {string} */ var sKey;

  for (i = 0; i < pSet.length; i++) {
    pTempRes = this.firstTerminal(pSet[i]);

    if (akra.isNull(pTempRes)) {
      pRes[pSet[i]] = true;
      return pRes;
    }

    isEmpty = false;

    pKeys = Object.keys(pTempRes);

    for (j = 0; j < pKeys.length; j++) {
      sKey = pKeys[j];

      if (sKey === akra.parser.T_EMPTY) {
        isEmpty = true;
        continue;
      }
      pRes[sKey] = true;
    }

    if (!isEmpty) {
      return pRes;
    }
  }

  if (!akra.isNull(pExpected)) {
    pKeys = Object.keys(pExpected);
    for (j = 0; j < pKeys.length; j++) {
      pRes[pKeys[j]] = true;
    }
  }

  return pRes;
};

/**
 * @param {string} sGrammarSource
 */
akra.parser.Parser.prototype.generateRules = function (sGrammarSource) {
  /** @type {Array.<string>} */ var pAllRuleList = /** @type {Array.<string>} */ (sGrammarSource.split(/\r?\n/));
  /** @type {Array.<string>} */ var pTempRule;
  /** @type {akra.parser.IRule} */ var pRule;
  /** @type {boolean} */ var isLexerBlock = false;

  this._pRulesDMap = /** @type {akra.parser.IRuleDMap} */ ({});
  this._pAdditionalFuncInfoList = /** @type {Array.<akra.parser.IAdditionalFuncInfo>} */ ([]);
  this._pRuleCreationModeMap = /** @type {akra.IMap} */ ({});
  this._pGrammarSymbols = /** @type {akra.IMap} */ ({});

  /** @type {number} */ var i = 0;
  /** @type {number} */ var j = 0;

  /** @type {boolean} */ var isAllNodeMode = akra.bf.testAll(/** @type {number} */ (this._eParseMode), /** @type {number} */ (akra.parser.EParseMode.k_AllNode));
  /** @type {boolean} */ var isNegateMode = akra.bf.testAll(/** @type {number} */ (this._eParseMode), /** @type {number} */ (akra.parser.EParseMode.k_Negate));
  /** @type {boolean} */ var isAddMode = akra.bf.testAll(/** @type {number} */ (this._eParseMode), /** @type {number} */ (akra.parser.EParseMode.k_Add));

  /** @type {akra.IMap} */ var pSymbolsWithNodeMap = this._pRuleCreationModeMap;
  /** @type {string} */ var sName;

  for (i = 0; i < pAllRuleList.length; i++) {
    if (pAllRuleList[i] === "" || pAllRuleList[i] === "\r") {
      continue;
    }

    pTempRule = /** @type {Array.<string>} */ (pAllRuleList[i].split(/\s* \s*/));

    if (isLexerBlock) {
      if ((pTempRule.length === 3 || (pTempRule.length === 4 && pTempRule[3] === "")) && ((pTempRule[2][0] === "\"" || pTempRule[2][0] === "'") && pTempRule[2].length > 3)) {
        if (pTempRule[2][0] !== pTempRule[2][pTempRule[2].length - 1]) {
          this._error(akra.parser.PARSER_GRAMMAR_UNEXPECTED_SYMBOL, {
            unexpectedSymbol: pTempRule[2][pTempRule[2].length - 1],
            expectedSymbol: pTempRule[2][0],
            grammarLine: i
          });
        }

        pTempRule[2] = pTempRule[2].slice(1, pTempRule[2].length - 1);

        /** @type {string} */ var ch = pTempRule[2][0];

        if ((ch === "_") || (ch >= "a" && ch <= "z") || (ch >= "A" && ch <= "Z")) {
          sName = this._pLexer.addKeyword(pTempRule[2], pTempRule[0]);
        } else {
          sName = this._pLexer.addPunctuator(pTempRule[2], pTempRule[0]);
        }

        this._pGrammarSymbols[sName] = pTempRule[2];
      }

      continue;
    }

    if (pTempRule[0] === akra.parser.LEXER_RULES) {
      isLexerBlock = true;
      continue;
    }

    if (akra.isDef(this._pRulesDMap[pTempRule[0]]) === false) {
      this._pRulesDMap[pTempRule[0]] = /** @type {akra.parser.IRuleMap} */ ({});
    }

    pRule = /** @type {akra.parser.IRule} */ ({
      left: pTempRule[0],
      right: /** @type {Array.<string>} */ ([]),
      index: 0
    });
    this._pSymbolMap[pTempRule[0]] = true;
    this._pGrammarSymbols[pTempRule[0]] = pTempRule[0];

    if (isAllNodeMode) {
      pSymbolsWithNodeMap[pTempRule[0]] = akra.parser.ENodeCreateMode.k_Default;
    } else if (isNegateMode && !akra.isDef(pSymbolsWithNodeMap[pTempRule[0]])) {
      pSymbolsWithNodeMap[pTempRule[0]] = akra.parser.ENodeCreateMode.k_Default;
    } else if (isAddMode && !akra.isDef(pSymbolsWithNodeMap[pTempRule[0]])) {
      pSymbolsWithNodeMap[pTempRule[0]] = akra.parser.ENodeCreateMode.k_Not;
    }

    for (j = 2; j < pTempRule.length; j++) {
      if (pTempRule[j] === "") {
        continue;
      }
      if (pTempRule[j] === akra.parser.FLAG_RULE_CREATE_NODE) {
        if (isAddMode) {
          pSymbolsWithNodeMap[pTempRule[0]] = akra.parser.ENodeCreateMode.k_Necessary;
        }
        continue;
      }
      if (pTempRule[j] === akra.parser.FLAG_RULE_NOT_CREATE_NODE) {
        if (isNegateMode && !isAllNodeMode) {
          pSymbolsWithNodeMap[pTempRule[0]] = akra.parser.ENodeCreateMode.k_Not;
        }
        continue;
      }
      if (pTempRule[j] === akra.parser.FLAG_RULE_FUNCTION) {
        if ((!pTempRule[j + 1] || pTempRule[j + 1].length === 0)) {
          this._error(akra.parser.PARSER_GRAMMAR_BAD_ADDITIONAL_FUNC_NAME, { grammarLine: i });
        }

        /** @type {akra.parser.IAdditionalFuncInfo} */ var pFuncInfo = /** @type {akra.parser.IAdditionalFuncInfo} */ ({
          name: pTempRule[j + 1],
          position: pRule.right.length,
          rule: pRule
        });
        this._pAdditionalFuncInfoList.push(pFuncInfo);
        j++;
        continue;
      }
      if (pTempRule[j][0] === "'" || pTempRule[j][0] === "\"") {
        if (pTempRule[j].length !== 3) {
          this._error(akra.parser.PARSER_GRAMMAR_BAD_KEYWORD, {
            badKeyword: pTempRule[j],
            grammarLine: i
          });
        }
        if (pTempRule[j][0] !== pTempRule[j][2]) {
          this._error(akra.parser.PARSER_GRAMMAR_UNEXPECTED_SYMBOL, {
            unexpectedSymbol: pTempRule[j][2],
            expectedSymbol: pTempRule[j][0],
            grammarLine: i
          });
          //this._error("Can`t generate rules from grammar! Unexpected symbol! Must be");
        }
        sName = this._pLexer.addPunctuator(pTempRule[j][1]);
        pRule.right.push(sName);
        this._pSymbolMap[sName] = true;
      } else {
        pRule.right.push(pTempRule[j]);
        this._pSymbolMap[pTempRule[j]] = true;
      }
    }

    pRule.index = this._nRules;
    this._pRulesDMap[pTempRule[0]][pRule.index] = pRule;
    this._nRules += 1;
  }
};

akra.parser.Parser.prototype.generateFunctionByStateMap = function () {
  if (akra.isNull(this._pAdditionalFunctionsMap)) {
    return;
  }

  /** @type {Array.<akra.parser.IState>} */ var pStateList = this._pStateList;
  /** @type {Array.<akra.parser.IAdditionalFuncInfo>} */ var pFuncInfoList = this._pAdditionalFuncInfoList;
  /** @type {akra.parser.IAdditionalFuncInfo} */ var pFuncInfo;
  /** @type {akra.parser.IRule} */ var pRule;
  /** @type {number} */ var iPos = 0;
  /** @type {akra.parser.IRuleFunction} */ var pFunc;
  /** @type {string} */ var sGrammarSymbol;

  /** @type {number} */ var i = 0;
  /** @type {number} */ var j = 0;

  /** @type {akra.parser.IRuleFunctionDMap} */ var pFuncByStateDMap = /** @type {akra.parser.IRuleFunctionDMap} */ ({});
  pFuncByStateDMap = this._pAdidtionalFunctByStateDMap = /** @type {akra.parser.IRuleFunctionDMap} */ ({});

  for (i = 0; i < pFuncInfoList.length; i++) {
    pFuncInfo = pFuncInfoList[i];

    pFunc = this._pAdditionalFunctionsMap[pFuncInfo.name];
    if (!akra.isDef(pFunc)) {
      continue;
    }

    pRule = pFuncInfo.rule;
    iPos = pFuncInfo.position;
    sGrammarSymbol = pRule.right[iPos - 1];

    for (j = 0; j < pStateList.length; j++) {
      if (pStateList[j].hasRule(pRule, iPos)) {
        if (!akra.isDef(pFuncByStateDMap[pStateList[j].getIndex()])) {
          pFuncByStateDMap[pStateList[j].getIndex()] = /** @type {akra.parser.IRuleFunctionMap} */ ({});
        }

        pFuncByStateDMap[pStateList[j].getIndex()][sGrammarSymbol] = pFunc;
      }
    }
  }
};

/**
 * @param {akra.parser.EParserType} eType
 */
akra.parser.Parser.prototype.generateFirstState = function (eType) {
  if (eType === akra.parser.EParserType.k_LR0) {
    this.generateFirstState_LR0();
  } else {
    this.generateFirstState_LR();
  }
};

akra.parser.Parser.prototype.generateFirstState_LR0 = function () {
  /** @type {akra.parser.IState} */ var pState = new akra.parser.State();
  /** @type {akra.parser.IItem} */ var pItem = new akra.parser.Item(this._pRulesDMap[akra.parser.START_SYMBOL][0], 0);

  this.pushBaseItem(pItem);
  pState.push(pItem);

  this.closure_LR0(pState);
  this.pushState(pState);
};

akra.parser.Parser.prototype.generateFirstState_LR = function () {
  /** @type {akra.parser.IState} */ var pState = new akra.parser.State();
  /** @type {akra.IMap} */ var pExpected = /** @type {akra.IMap} */ ({});
  pExpected[akra.parser.END_SYMBOL] = true;

  pState.push(new akra.parser.Item(this._pRulesDMap[akra.parser.START_SYMBOL][0], 0, pExpected));

  this.closure_LR(pState);
  this.pushState(pState);
};

/**
 * @param {akra.parser.IState} pState
 * @param {akra.parser.EParserType} eType
 * @returns {akra.parser.IState}
 */
akra.parser.Parser.prototype.closure = function (pState, eType) {
  if (eType === akra.parser.EParserType.k_LR0) {
    return this.closure_LR0(pState);
  } else {
    return this.closure_LR(pState);
  }
};

/**
 * @param {akra.parser.IState} pState
 * @returns {akra.parser.IState}
 */
akra.parser.Parser.prototype.closure_LR0 = function (pState) {
  /** @type {Array.<akra.parser.IItem>} */ var pItemList = pState.getItems();
  /** @type {number} */ var i = 0;
  /** @type {number} */ var j = 0;
  /** @type {string} */ var sSymbol;
  /** @type {Array.<string>} */ var pKeys;

  for (i = 0; i < pItemList.length; i++) {
    sSymbol = pItemList[i].mark();

    if (sSymbol !== akra.parser.END_POSITION && (!this.isTerminal(sSymbol))) {
      pKeys = Object.keys(this._pRulesDMap[sSymbol]);
      for (j = 0; j < pKeys.length; j++) {
        pState.tryPush_LR0(this._pRulesDMap[sSymbol][pKeys[j]], 0);
      }
    }
  }
  return pState;
};

/**
 * @param {akra.parser.IState} pState
 * @returns {akra.parser.IState}
 */
akra.parser.Parser.prototype.closure_LR = function (pState) {
  /** @type {Array.<akra.parser.IItem>} */ var pItemList = /** @type {Array.<akra.parser.IItem>} */ ((pState.getItems()));
  /** @type {number} */ var i = 0;
  /** @type {number} */ var j = 0;
  /** @type {number} */ var k = 0;
  /** @type {string} */ var sSymbol;
  /** @type {akra.IMap} */ var pSymbols;
  /** @type {Array.<string>} */ var pTempSet;
  /** @type {boolean} */ var isNewExpected = false;

  /** @type {Array.<string>} */ var pRulesMapKeys;
  /** @type {Array.<string>} */ var pSymbolsKeys;

  while (true) {
    if (i === pItemList.length) {
      if (!isNewExpected) {
        break;
      }
      i = 0;
      isNewExpected = false;
    }
    sSymbol = pItemList[i].mark();

    if (sSymbol !== akra.parser.END_POSITION && (!this.isTerminal(sSymbol))) {
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
};

/**
 * @param {akra.parser.IState} pState
 * @param {string} sSymbol
 * @param {akra.parser.EParserType} eType
 * @returns {akra.parser.IState}
 */
akra.parser.Parser.prototype.nexeState = function (pState, sSymbol, eType) {
  if (eType === akra.parser.EParserType.k_LR0) {
    return this.nextState_LR0(pState, sSymbol);
  } else {
    return this.nextState_LR(pState, sSymbol);
  }
};

/**
 * @param {akra.parser.IState} pState
 * @param {string} sSymbol
 * @returns {akra.parser.IState}
 */
akra.parser.Parser.prototype.nextState_LR0 = function (pState, sSymbol) {
  /** @type {Array.<akra.parser.IItem>} */ var pItemList = pState.getItems();
  /** @type {number} */ var i = 0;
  /** @type {akra.parser.IState} */ var pNewState = new akra.parser.State();

  for (i = 0; i < pItemList.length; i++) {
    if (sSymbol === pItemList[i].mark()) {
      pNewState.push(new akra.parser.Item(pItemList[i].getRule(), pItemList[i].getPosition() + 1));
    }
  }

  return pNewState;
};

/**
 * @param {akra.parser.IState} pState
 * @param {string} sSymbol
 * @returns {akra.parser.IState}
 */
akra.parser.Parser.prototype.nextState_LR = function (pState, sSymbol) {
  /** @type {Array.<akra.parser.IItem>} */ var pItemList = /** @type {Array.<akra.parser.IItem>} */ (pState.getItems());
  /** @type {number} */ var i = 0;
  /** @type {akra.parser.IState} */ var pNewState = new akra.parser.State();

  for (i = 0; i < pItemList.length; i++) {
    if (sSymbol === pItemList[i].mark()) {
      pNewState.push(new akra.parser.Item(pItemList[i].getRule(), pItemList[i].getPosition() + 1, pItemList[i].getExpectedSymbols()));
    }
  }

  return pNewState;
};

akra.parser.Parser.prototype.deleteNotBaseItems = function () {
  /** @type {number} */ var i = 0;
  for (i = 0; i < this._pStateList.length; i++) {
    this._pStateList[i].deleteNotBase();
  }
};

/**
 * @param {akra.parser.IRule} pRule
 * @param {number} iPos
 * @returns {akra.parser.IState}
 */
akra.parser.Parser.prototype.closureForItem = function (pRule, iPos) {
  /** @type {string} */ var sIndex = "";
  sIndex += pRule.index + "_" + iPos;

  /** @type {akra.parser.IState} */ var pState = this._pStatesTempMap[sIndex];
  if (akra.isDef(pState)) {
    return pState;
  } else {
    /** @type {akra.IMap} */ var pExpected = /** @type {akra.IMap} */ ({});
    pExpected[akra.parser.UNUSED_SYMBOL] = true;

    pState = new akra.parser.State();
    pState.push(new akra.parser.Item(pRule, iPos, pExpected));

    this.closure_LR(pState);
    this._pStatesTempMap[sIndex] = pState;

    return pState;
  }
};

/**
 * @param {akra.parser.IItem} pItem
 * @param {akra.parser.IItem} pItemX
 */
akra.parser.Parser.prototype.addLinkExpected = function (pItem, pItemX) {
  /** @type {akra.IBoolDMap} */ var pTable = this._pExpectedExtensionDMap;
  /** @type {number} */ var iIndex = pItem.getIndex();

  if (!akra.isDef(pTable[iIndex])) {
    pTable[iIndex] = /** @type {akra.IMap} */ ({});
  }

  pTable[iIndex][pItemX.getIndex()] = true;
};

/**
 * @param {akra.parser.IState} pTestState
 * @param {string} sSymbol
 */
akra.parser.Parser.prototype.determineExpected = function (pTestState, sSymbol) {
  /** @type {akra.parser.IState} */ var pStateX = pTestState.getNextStateBySymbol(sSymbol);

  if (akra.isNull(pStateX)) {
    return;
  }

  /** @type {Array.<akra.parser.IItem>} */ var pItemListX = /** @type {Array.<akra.parser.IItem>} */ (pStateX.getItems());
  /** @type {Array.<akra.parser.IItem>} */ var pItemList = /** @type {Array.<akra.parser.IItem>} */ (pTestState.getItems());
  /** @type {akra.parser.IState} */ var pState;
  /** @type {akra.parser.IItem} */ var pItem;
  /** @type {number} */ var i = 0;
  /** @type {number} */ var j = 0;
  /** @type {string} */ var k = null;

  /** @type {number} */ var nBaseItemTest = pTestState.getNumBaseItems();
  /** @type {number} */ var nBaseItemX = pStateX.getNumBaseItems();

  for (i = 0; i < nBaseItemTest; i++) {
    pState = this.closureForItem(pItemList[i].getRule(), pItemList[i].getPosition());

    for (j = 0; j < nBaseItemX; j++) {
      pItem = /** @type {akra.parser.IItem} */ (pState.hasChildItem(pItemListX[j]));

      if (pItem) {
        /** @type {akra.IMap} */ var pExpected = pItem.getExpectedSymbols();

        for (k in pExpected) {
          if (k === akra.parser.UNUSED_SYMBOL) {
            this.addLinkExpected(pItemList[i], pItemListX[j]);
          } else {
            pItemListX[j].addExpected(k);
          }
        }
      }
    }
  }
};

akra.parser.Parser.prototype.generateLinksExpected = function () {
  /** @type {number} */ var i = 0;
  /** @type {number} */ var j = 0;
  /** @type {Array.<akra.parser.IState>} */ var pStates = this._pStateList;
  /** @type {Array.<string>} */ var pKeys;

  for (i = 0; i < pStates.length; i++) {
    pKeys = Object.keys(this._pSymbolMap);
    for (j = 0; j < pKeys.length; j++) {
      this.determineExpected(pStates[i], pKeys[j]);
    }
  }
};

akra.parser.Parser.prototype.expandExpected = function () {
  /** @type {Array.<akra.parser.IItem>} */ var pItemList = /** @type {Array.<akra.parser.IItem>} */ (this._pBaseItemList);
  /** @type {akra.IBoolDMap} */ var pTable = this._pExpectedExtensionDMap;
  /** @type {number} */ var i = 0;
  /** @type {number} */ var j = 0;
  /** @type {number} */ var k = 0;
  /** @type {string} */ var sSymbol = null;
  /** @type {boolean} */ var isNewExpected = false;

  pItemList[0].addExpected(akra.parser.END_SYMBOL);
  pItemList[0].setIsNewExpected(true);

  while (true) {
    if (i === pItemList.length) {
      if (!isNewExpected) {
        break;
      }
      isNewExpected = false;
      i = 0;
    }

    if (pItemList[i].getIsNewExpected() && akra.isDefAndNotNull(pTable[i]) && akra.isDefAndNotNull(pItemList[i].getExpectedSymbols())) {
      /** @type {Array.<string>} */ var pExpectedSymbols = Object.keys(pItemList[i].getExpectedSymbols());
      /** @type {Array.<string>} */ var pKeys = Object.keys(pTable[i]);

      for (j = 0; j < pExpectedSymbols.length; j++) {
        sSymbol = pExpectedSymbols[j];
        for (k = 0; k < pKeys.length; k++) {
          if (pItemList[/** @type {number} */ (/** @type {?} */ (pKeys[k]))].addExpected(sSymbol)) {
            isNewExpected = true;
          }
        }
      }
    }

    pItemList[i].setIsNewExpected(false);
    i++;
  }
};

/**
 * @param {akra.parser.EParserType} eType
 */
akra.parser.Parser.prototype.generateStates = function (eType) {
  if (eType === akra.parser.EParserType.k_LR0) {
    this.generateStates_LR0();
  } else if (eType === akra.parser.EParserType.k_LR1) {
    this.generateStates_LR();
  } else if (eType === akra.parser.EParserType.k_LALR) {
    this.generateStates_LALR();
  }
};

akra.parser.Parser.prototype.generateStates_LR0 = function () {
  this.generateFirstState_LR0();

  /** @type {number} */ var i = 0;
  /** @type {number} */ var j = 0;
  /** @type {Array.<akra.parser.IState>} */ var pStateList = this._pStateList;
  /** @type {string} */ var sSymbol = null;
  /** @type {akra.parser.IState} */ var pState;
  /** @type {Array.<string>} */ var pSymbols = Object.keys(this._pSymbolMap);

  for (i = 0; i < pStateList.length; i++) {
    for (j = 0; j < pSymbols.length; j++) {
      sSymbol = pSymbols[j];
      pState = this.nextState_LR0(pStateList[i], sSymbol);

      if (!pState.isEmpty()) {
        pState = this.tryAddState(pState, akra.parser.EParserType.k_LR0);
        this.addStateLink(pStateList[i], pState, sSymbol);
      }
    }
  }
};

akra.parser.Parser.prototype.generateStates_LR = function () {
  this._pFirstTerminalsDMap = /** @type {akra.IBoolDMap} */ ({});
  this.generateFirstState_LR();

  /** @type {number} */ var i = 0;
  /** @type {number} */ var j = 0;
  /** @type {Array.<akra.parser.IState>} */ var pStateList = this._pStateList;
  /** @type {string} */ var sSymbol = null;
  /** @type {akra.parser.IState} */ var pState;
  /** @type {Array.<string>} */ var pSymbols = Object.keys(this._pSymbolMap);

  for (i = 0; i < pStateList.length; i++) {
    for (j = 0; j < pSymbols.length; j++) {
      sSymbol = pSymbols[j];
      pState = this.nextState_LR(pStateList[i], sSymbol);

      if (!pState.isEmpty()) {
        pState = this.tryAddState(pState, akra.parser.EParserType.k_LR1);
        this.addStateLink(pStateList[i], pState, sSymbol);
      }
    }
  }
};

akra.parser.Parser.prototype.generateStates_LALR = function () {
  this._pStatesTempMap = /** @type {akra.IMap} */ ({});
  this._pBaseItemList = /** @type {Array.<akra.parser.IItem>} */ ([]);
  this._pExpectedExtensionDMap = /** @type {akra.IBoolDMap} */ ({});
  this._pFirstTerminalsDMap = /** @type {akra.IBoolDMap} */ ({});

  this.generateStates_LR0();
  this.deleteNotBaseItems();
  this.generateLinksExpected();
  this.expandExpected();

  /** @type {number} */ var i = 0;
  /** @type {Array.<akra.parser.IState>} */ var pStateList = this._pStateList;

  for (i = 0; i < pStateList.length; i++) {
    this.closure_LR(pStateList[i]);
  }
};

/**
 * @returns {number}
 */
akra.parser.Parser.prototype.calcBaseItem = function () {
  /** @type {number} */ var num = 0;
  /** @type {number} */ var i = 0;

  for (i = 0; i < this._pStateList.length; i++) {
    num += this._pStateList[i].getNumBaseItems();
  }

  return num;
};

/**
 * @returns {string}
 */
akra.parser.Parser.prototype.printExpectedTable = function () {
  /** @type {number} */ var i = 0;
  /** @type {number} */ var j = 0;
  /** @type {string} */ var sMsg = "";

  /** @type {Array.<string>} */ var pKeys = Object.keys(this._pExpectedExtensionDMap);
  for (i = 0; i < pKeys.length; i++) {
    sMsg += "State " + this._pBaseItemList[/** @type {number} */ (/** @type {?} */ (pKeys[i]))].getState().getIndex() + ":   ";
    sMsg += this._pBaseItemList[/** @type {number} */ (/** @type {?} */ (pKeys[i]))].toString() + "  |----->\n";

    /** @type {Array.<string>} */ var pExtentions = Object.keys(this._pExpectedExtensionDMap[pKeys[i]]);
    for (j = 0; j < pExtentions.length; j++) {
      sMsg += "\t\t\t\t\t" + "State " + this._pBaseItemList[/** @type {number} */ (/** @type {?} */ (pExtentions[j]))].getState().getIndex() + ":   ";
      sMsg += this._pBaseItemList[/** @type {number} */ (/** @type {?} */ (pExtentions[j]))].toString() + "\n";
    }

    sMsg += "\n";
  }

  return sMsg;
};

/**
 * @param {akra.parser.IState} pState
 */
akra.parser.Parser.prototype.addReducing = function (pState) {
  /** @type {number} */ var i = 0;
  /** @type {number} */ var j = 0;
  /** @type {Array.<akra.parser.IItem>} */ var pItemList = pState.getItems();

  for (i = 0; i < pItemList.length; i++) {
    if (pItemList[i].mark() === akra.parser.END_POSITION) {
      if (pItemList[i].getRule().left === akra.parser.START_SYMBOL) {
        this.pushInSyntaxTable(pState.getIndex(), akra.parser.END_SYMBOL, this._pSuccessOperation);
      } else {
        /** @type {akra.IMap} */ var pExpected = pItemList[i].getExpectedSymbols();

        /** @type {Array.<string>} */ var pKeys = Object.keys(pExpected);
        for (j = 0; j < pKeys.length; j++) {
          this.pushInSyntaxTable(pState.getIndex(), pKeys[j], this._pReduceOperationsMap[pItemList[i].getRule().index]);
        }
      }
    }
  }
};

/**
 * @param {akra.parser.IState} pState
 */
akra.parser.Parser.prototype.addShift = function (pState) {
  /** @type {number} */ var i = 0;
  /** @type {akra.IMap} */ var pStateMap = pState.getNextStates();

  /** @type {Array.<string>} */ var pStateKeys = Object.keys(pStateMap);

  for (i = 0; i < pStateKeys.length; i++) {
    /** @type {string} */ var sSymbol = pStateKeys[i];
    this.pushInSyntaxTable(pState.getIndex(), sSymbol, this._pShiftOperationsMap[pStateMap[sSymbol].getIndex()]);
  }
};

akra.parser.Parser.prototype.buildSyntaxTable = function () {
  this._pStateList = /** @type {Array.<akra.parser.IState>} */ ([]);

  /** @type {Array.<akra.parser.IState>} */ var pStateList = this._pStateList;
  /** @type {akra.parser.IState} */ var pState;

  //Generate states
  this.generateStates(this._eType);

  //Init necessary properties
  this._pSyntaxTable = /** @type {akra.parser.IOperationDMap} */ ({});
  this._pReduceOperationsMap = /** @type {akra.parser.IOperationMap} */ ({});
  this._pShiftOperationsMap = /** @type {akra.parser.IOperationMap} */ ({});

  this._pSuccessOperation = /** @type {akra.parser.IOperation} */ ({ type: akra.parser.EOperationType.k_Success });

  /** @type {number} */ var i = 0;
  /** @type {number} */ var j = 0;
  /** @type {number} */ var k = 0;

  for (i = 0; i < pStateList.length; i++) {
    this._pShiftOperationsMap[pStateList[i].getIndex()] = /** @type {akra.parser.IOperation} */ ({
      type: akra.parser.EOperationType.k_Shift,
      index: pStateList[i].getIndex()
    });
  }

  /** @type {Array.<string>} */ var pRulesDMapKeys = Object.keys(this._pRulesDMap);
  for (j = 0; j < pRulesDMapKeys.length; j++) {
    /** @type {Array.<string>} */ var pRulesMapKeys = Object.keys(this._pRulesDMap[pRulesDMapKeys[j]]);
    for (k = 0; k < pRulesMapKeys.length; k++) {
      /** @type {string} */ var sSymbol = pRulesMapKeys[k];
      /** @type {akra.parser.IRule} */ var pRule = this._pRulesDMap[pRulesDMapKeys[j]][sSymbol];

      this._pReduceOperationsMap[sSymbol] = /** @type {akra.parser.IOperation} */ ({
        type: akra.parser.EOperationType.k_Reduce,
        rule: pRule
      });
    }
  }

  for (i = 0; i < pStateList.length; i++) {
    pState = pStateList[i];
    this.addReducing(pState);
    this.addShift(pState);
  }
};

/**
 * @returns {akra.parser.IToken}
 */
akra.parser.Parser.prototype.readToken = function () {
  return this._pLexer.getNextToken();
};

/**
 * @param {number} iStateIndex
 * @param {string} sGrammarSymbol
 * @returns {akra.parser.EOperationType}
 */
akra.parser.Parser.prototype.operationAdditionalAction = function (iStateIndex, sGrammarSymbol) {
  /** @type {akra.parser.IRuleFunctionDMap} */ var pFuncDMap = this._pAdidtionalFunctByStateDMap;

  if (!akra.isNull(this._pAdidtionalFunctByStateDMap) && akra.isDef(pFuncDMap[iStateIndex]) && akra.isDef(pFuncDMap[iStateIndex][sGrammarSymbol])) {
    return pFuncDMap[iStateIndex][sGrammarSymbol].call(this);
  }

  return akra.parser.EOperationType.k_Ok;
};

/**
 * @returns {akra.parser.EParserCode}
 */
akra.parser.Parser.prototype.resumeParse = function () {
  try  {
    /** @type {akra.parser.IParseTree} */ var pTree = this._pSyntaxTree;
    /** @type {Array.<number>} */ var pStack = this._pStack;
    /** @type {akra.parser.IOperationDMap} */ var pSyntaxTable = this._pSyntaxTable;

    /** @type {boolean} */ var isStop = false;
    /** @type {boolean} */ var isError = false;
    /** @type {boolean} */ var isPause = false;
    /** @type {akra.parser.IToken} */ var pToken = akra.isNull(this._pToken) ? this.readToken() : this._pToken;

    /** @type {akra.parser.IOperation} */ var pOperation;
    /** @type {number} */ var iRuleLength;

    /** @type {akra.parser.EOperationType} */ var eAdditionalOperationCode;
    /** @type {number} */ var iStateIndex = 0;

    while (!isStop) {
      pOperation = pSyntaxTable[pStack[pStack.length - 1]][pToken.name];
      if (akra.isDef(pOperation)) {
        switch (pOperation.type) {
          case akra.parser.EOperationType.k_Success:
            isStop = true;
            break;

          case akra.parser.EOperationType.k_Shift:
            iStateIndex = pOperation.index;
            pStack.push(iStateIndex);
            pTree.addNode(/** @type {akra.parser.IParseNode} */ (pToken));

            eAdditionalOperationCode = this.operationAdditionalAction(iStateIndex, pToken.name);

            if (eAdditionalOperationCode === akra.parser.EOperationType.k_Error) {
              isError = true;
              isStop = true;
            } else if (eAdditionalOperationCode === akra.parser.EOperationType.k_Pause) {
              this._pToken = null;
              isStop = true;
              isPause = true;
            } else if (eAdditionalOperationCode === akra.parser.EOperationType.k_Ok) {
              pToken = this.readToken();
            }

            break;

          case akra.parser.EOperationType.k_Reduce:
            iRuleLength = pOperation.rule.right.length;
            pStack.length -= iRuleLength;
            iStateIndex = pSyntaxTable[pStack[pStack.length - 1]][pOperation.rule.left].index;
            pStack.push(iStateIndex);
            pTree.reduceByRule(pOperation.rule, this._pRuleCreationModeMap[pOperation.rule.left]);

            eAdditionalOperationCode = this.operationAdditionalAction(iStateIndex, pOperation.rule.left);

            if (eAdditionalOperationCode === akra.parser.EOperationType.k_Error) {
              isError = true;
              isStop = true;
            } else if (eAdditionalOperationCode === akra.parser.EOperationType.k_Pause) {
              this._pToken = pToken;
              isStop = true;
              isPause = true;
            }

            break;
        }
      } else {
        isError = true;
        isStop = true;
      }
    }
  } catch (e) {
    this._sFileName = "stdin";
    return akra.parser.EParserCode.k_Error;
  }
  if (isPause) {
    return akra.parser.EParserCode.k_Pause;
  }

  if (!isError) {
    pTree.finishTree();
    if (akra.isDef(this._fnFinishCallback)) {
      this._fnFinishCallback.call(this._pCaller, akra.parser.EParserCode.k_Ok, this.getParseFileName());
    }
    this._sFileName = "stdin";
    return akra.parser.EParserCode.k_Ok;
  } else {
    this._error(akra.parser.PARSER_SYNTAX_ERROR, pToken);
    if (akra.isDef(this._fnFinishCallback)) {
      this._fnFinishCallback.call(this._pCaller, akra.parser.EParserCode.k_Error, this.getParseFileName());
    }
    this._sFileName = "stdin";
    return akra.parser.EParserCode.k_Error;
  }
};

/**
 * @param {boolean=} isBaseOnly
 * @returns {string}
 */
akra.parser.Parser.prototype.statesToString = function (isBaseOnly) {
  if (typeof isBaseOnly === "undefined") isBaseOnly = true;
  if (!akra.isDef(this._pStateList)) {
    return null;
  }

  /** @type {string} */ var sMsg = "";
  /** @type {number} */ var i = 0;

  for (i = 0; i < this._pStateList.length; i++) {
    sMsg += this._pStateList[i].toString(isBaseOnly);
    sMsg += " ";
  }

  return sMsg;
};

/**
 * @param {akra.parser.IOperation} pOperation
 * @returns {string}
 */
akra.parser.Parser.prototype.operationToString = function (pOperation) {
  /** @type {string} */ var sOperation = null;

  switch (pOperation.type) {
    case akra.parser.EOperationType.k_Shift:
      sOperation = "SHIFT to state " + pOperation.index.toString();
      break;
    case akra.parser.EOperationType.k_Reduce:
      sOperation = "REDUCE by rule { " + this.ruleToString(pOperation.rule) + " }";
      break;
    case akra.parser.EOperationType.k_Success:
      sOperation = "SUCCESS";
      break;
  }

  return sOperation;
};

/**
 * @param {akra.parser.IRule} pRule
 * @returns {string}
 */
akra.parser.Parser.prototype.ruleToString = function (pRule) {
  /** @type {string} */ var sRule;

  sRule = pRule.left + " : " + pRule.right.join(" ");

  return sRule;
};

/**
 * @param {string} sSymbol
 * @returns {string}
 */
akra.parser.Parser.prototype.convertGrammarSymbol = function (sSymbol) {
  if (!this.isTerminal(sSymbol)) {
    return sSymbol;
  } else {
    return this._pLexer.getTerminalValueByName(sSymbol);
  }
};
