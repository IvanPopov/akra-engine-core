/// <reference path="../../src/akra/idl/3d-party/fixes.d.ts" />
declare module akra {
  interface IMap<T> {
    [index: string]: T;
    [index: number]: T;
  }
  interface IDMap<T> {
    [index: string]: IMap<T>;
    [index: number]: IMap<T>;
  }
  /** @deprecated Use IMap<string> instead. */
  interface IStringMap {
    [index: string]: string;
    [index: number]: string;
  }
  /** @deprecated Use IMap<int> instead. */
  interface IIntMap {
    [index: string]: number;
    [index: number]: number;
  }
  /** @deprecated Use IMap<uint> instead. */
  interface IUintMap {
    [index: string]: number;
    [index: number]: number;
  }
  /** @deprecated Use IMap<float> instead. */
  interface IFloatMap {
    [index: string]: number;
    [index: number]: number;
  }
  /** @deprecated Use IMap<boolean> instead. */
  interface IBoolMap {
    [index: string]: boolean;
    [index: number]: boolean;
  }
  /** @deprecated Use IDMap<boolean> instead. */
  interface IBoolDMap {
    [index: string]: IBoolMap;
    [index: number]: IBoolMap;
  }
  /** @deprecated Use IDMap<string> instead. */
  interface IStringDMap {
    [index: string]: IStringMap;
    [index: number]: IStringMap;
  }
}
declare module akra.parser {
  enum ENodeCreateMode {
    k_Default = 0,
    k_Necessary = 1,
    k_Not = 2,
  }
  enum EParserCode {
    k_Pause = 0,
    k_Ok = 1,
    k_Error = 2,
  }
  enum EParserType {
    k_LR0 = 0,
    k_LR1 = 1,
    k_LALR = 2,
  }
  enum EParseMode {
    k_AllNode = 1,
    k_Negate = 2,
    k_Add = 4,
    k_Optimize = 8,
    k_DebugMode = 16,
  }
  enum ETokenType {
    k_NumericLiteral = 1,
    k_CommentLiteral = 2,
    k_StringLiteral = 3,
    k_PunctuatorLiteral = 4,
    k_WhitespaceLiteral = 5,
    k_IdentifierLiteral = 6,
    k_KeywordLiteral = 7,
    k_Unknown = 8,
    k_End = 9,
  }
  interface IToken {
    value: string;
    start: number;
    end: number;
    line: number;
    name?: string;
    type?: ETokenType;
  }
  interface IRule {
    left: string;
    right: string[];
    index: number;
  }
  interface IFinishFunc {
    (eCode: EParserCode, sFileName: string): void;
  }
  enum EOperationType {
    k_Error = 100,
    k_Shift = 101,
    k_Reduce = 102,
    k_Success = 103,
    k_Pause = 104,
    k_Ok = 105,
  }
  interface IRuleFunction {
    (): EOperationType;
  }
  interface IParseNode {
    children: IParseNode[];
    parent: IParseNode;
    name: string;
    value: string;
    isAnalyzed: boolean;
    position: number;
    start?: number;
    end?: number;
    line?: number;
  }
  interface IParseTree {
    finishTree(): void;
    setOptimizeMode(isOptimize: boolean): void;
    addNode(pNode: IParseNode): void;
    reduceByRule(pRule: IRule, eCreate: ENodeCreateMode): any;
    toString(): string;
    clone(): IParseTree;
    getNodes(): IParseNode[];
    getLastNode(): IParseNode;
    getRoot(): IParseNode;
    setRoot(pRoot: IParseNode): void;
  }
  interface ILexer {
    addPunctuator(sValue: string, sName?: string): string;
    addKeyword(sValue: string, sName: string): string;
    getTerminalValueByName(sName: string): string;
    init(sSource: string): void;
    getNextToken(): IToken;
    _getIndex(): number;
    _setSource(sSource: string): void;
    _setIndex(iIndex: number): void;
  }
  interface IParserState {
    source: string;
    index: number;
    fileName: string;
    tree: IParseTree;
    types: akra.IMap<boolean>;
    stack: number[];
    token: IToken;
    fnCallback: IFinishFunc;
    caller: any;
  }
  interface IParser {
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
    printState(iStateIndex: number, isPrintOnlyBase?: boolean): void;
    getGrammarSymbols(): akra.IMap<string>;
    _saveState(): IParserState;
    _loadState(pState: IParserState): void;
  }
}
declare module akra.bf {
  /**
  * Сдвиг единицы на @a x позиций влево.
  */
  var flag: (x: number) => number;
  /**
  * Проверка того что у @a value бит под номером @a bit равен единице.
  */
  var testBit: (value: number, bit: number) => boolean;
  /**
  * Проверка того что у @a value равны единице все биты,
  * которые равны единице у @a set.
  */
  var testAll: (value: number, set: number) => boolean;
  /**
  * Проверка того что у @a value равны единице хотя бы какие то из битов,
  * которые равны единице у @a set.
  */
  var testAny: (value: number, set: number) => boolean;
  /**
  * Выставляет бит под номером @a bit у числа @a value равным единице
  */
  var setBit: (value: number, bit: number, setting?: boolean) => number;
  /**
  *
  */
  var clearBit: (value: number, bit: number) => number;
  /**
  * Выставляет бит под номером @a bit у числа @a value равным нулю
  */
  var setAll: (value: number, set: number, setting?: boolean) => number;
  /**
  * Выставляет все биты у числа @a value равными единице,
  * которые равны единице у числа @a set
  */
  var clearAll: (value: number, set: number) => number;
  /**
  * Выставляет все биты у числа @a value равными нулю,
  * которые равны единице у числа @a set
  */
  var equal: (value: number, src: number) => void;
  /**
  * Прирасваивает числу @a value число @a src
  */
  var isEqual: (value: number, src: number) => boolean;
  /**
  * Если число @a value равно числу @a src возвращается true
  */
  var isNotEqaul: (value: number, src: number) => boolean;
  /**
  * Прирасваивает числу @a value число @a src
  */
  var set: (value: number, src: number) => void;
  /**
  * Обнуляет число @a value
  */
  var clear: (value: number) => void;
  /**
  * Выставляет все биты у числа @a value равными единице,
  * которые равны единице у числа @a src
  */
  var setFlags: (value: number, src: number) => number;
  /**
  * Выставляет все биты у числа @a value равными нулю,
  * которые равны единице у числа @a src
  */
  var clearFlags: (value: number, src: number) => number;
  /**
  * Проверяет равно ли число @a value нулю. Если равно возвращает true.
  * Если не равно возвращает false.
  */
  var isEmpty: (value: number) => boolean;
  /**
  * Возвращает общее количество бит числа @a value.
  * На самом деле возвращает всегда 32.
  */
  var totalBits: (value: number) => number;
  /**
  * Возвращает общее количество ненулевых бит числа @a value.
  */
  var totalSet: (value: number) => number;
  /**
  * Convert N bit colour channel value to P bits. It fills P bits with the
  * bit pattern repeated. (this is /((1<<n)-1) in fixed point)
  */
  function fixedToFixed(value: number, n: number, p: number): number;
  /**
  * Convert floating point colour channel value between 0.0 and 1.0 (otherwise clamped)
  * to integer of a certain number of bits. Works for any value of bits between 0 and 31.
  */
  function floatToFixed(value: number, bits: number): number;
  /**
  * Fixed point to float
  */
  function fixedToFloat(value: number, bits: number): number;
  /**
  * Write a n*8 bits integer value to memory in native endian.
  */
  function intWrite(pDest: Uint8Array, n: number, value: number): void;
  /**
  * Read a n*8 bits integer value to memory in native endian.
  */
  function intRead(pSrc: Uint8Array, n: number): number;
  function floatToHalf(f: number): number;
  function floatToHalfI(i: number): number;
  /**
  * Convert a float16 (NV_half_float) to a float32
  * Courtesy of OpenEXR
  */
  function halfToFloat(y: number): number;
  /** Converts a half in uint16 format to a float
  in uint32 format
  */
  function halfToFloatI(y: number): number;
}
declare module akra {
  interface IConverter<ARRAY_TYPE> {
    (data: string, output: ARRAY_TYPE, from?: number): number;
  }
  interface IConvertionTableRow<ARRAY_TYPE> {
    type: any;
    converter: IConverter<ARRAY_TYPE>;
  }
  interface IConvertionTable {
    [type: string]: IConvertionTableRow<any[]>;
  }
}
declare module akra {
  enum EDataTypes {
    BYTE = 5120,
    UNSIGNED_BYTE = 5121,
    SHORT = 5122,
    UNSIGNED_SHORT = 5123,
    INT = 5124,
    UNSIGNED_INT = 5125,
    FLOAT = 5126,
  }
  enum EDataTypeSizes {
    BYTES_PER_BYTE = 1,
    BYTES_PER_UNSIGNED_BYTE = 1,
    BYTES_PER_UBYTE = 1,
    BYTES_PER_SHORT = 2,
    BYTES_PER_UNSIGNED_SHORT = 2,
    BYTES_PER_USHORT = 2,
    BYTES_PER_INT = 4,
    BYTES_PER_UNSIGNED_INT = 4,
    BYTES_PER_UINT = 4,
    BYTES_PER_FLOAT = 4,
  }
}
declare module akra.conv {
  var conversionFormats: akra.IConvertionTable;
  function parseBool(sValue: string): boolean;
  function parseString(sValue: string): string;
  function parseJSON(sJSON: string): any;
  /**
  * Convert text/html into Dom object.
  */
  function parseHTML(sHTML: string): NodeList;
  function parseHTMLDocument(sHtml: string): DocumentFragment;
  function retrieve<SRC_ARRAY_TYPE, DST_ARRAY_TYPE>(pSrc: SRC_ARRAY_TYPE, pDst: DST_ARRAY_TYPE, iStride?: number, iFrom?: number, iCount?: number, iOffset?: number, iLen?: number): number;
  function string2Array<T>(sData: string, ppData: T[], fnConv: (data: string, ...args: any[]) => T, iFrom?: number): number;
  function stoia(sData: string, ppData: number[], iFrom?: number): number;
  function stofa(sData: string, ppData: number[], iFrom?: number): number;
  function stoba(sData: string, ppData: boolean[], iFrom?: number): number;
  function stosa(sData: string, ppData: string[], iFrom?: number): number;
  function stoa<T extends any[]>(sData: string, n: number, sType: string, isArray?: boolean): T;
  /**
  * Convert string to ArrayBuffer.
  */
  function stoab(s: string): ArrayBuffer;
  /**
  * Convert ArrayBuffer to string.
  */
  function abtos(pBuf: ArrayBuffer): string;
  /**
  * Convert ArrayBuffer to string via BlobReader.
  */
  function abtosAsync(pBuffer: ArrayBuffer, callback: (result: string) => void): void;
  /**
  * Convert ArrayBuffer to typed array.
  */
  function abtota(pBuffer: ArrayBuffer, eType: akra.EDataTypes): ArrayBufferView;
  /**
  * Blob to ArrayBuffer async.
  */
  function btoaAsync(pBlob: Blob, fn: (e: ErrorEvent, pBuffer: ArrayBuffer) => void): void;
  function dutobAsync(sBlobURL: string, fn: (b: Blob) => void): void;
  /**
  * Data URL to JSON.
  */
  function dutojAsync(sBlobURL: string, fn: (json: Object) => void): void;
  /**
  * Data URL to Blob object.
  */
  function dutob(dataURI: string): Blob;
  function toURL(data: any, mime?: string): string;
  /** Convert UTF8 string to Base64 string*/
  function utf8tob64(s: string): string;
  function toUTF8(argString: string): string;
  function fromUTF8(str_data: string): string;
}
declare module akra.crypto {
  function sha1(str: string): string;
}
declare module akra.crypto {
  function md5(str: any): string;
}
declare module akra.crypto {
  function crc32(str: string): string;
}
interface String {
  replaceAt(n: number, s: string): any;
}
interface Array {
  last: any;
  first: any;
  el(i: number): any;
  clear(): any[];
  swap(i: number, j: number): any[];
  insert(elements: any[]): any[];
  find(pElement: any): boolean;
}
interface Number {
  toHex(length: number): string;
  printBinary(isPretty?: boolean): string;
}
declare module akra {
  var typeOf: (x: any) => string;
  var isDef: (x: any) => boolean;
  var isDefAndNotNull: (x: any) => boolean;
  var isEmpty: (x: any) => boolean;
  var isNull: (x: any) => boolean;
  var isBoolean: (x: any) => boolean;
  var isString: (x: any) => boolean;
  var isNumber: (x: any) => boolean;
  var isFloat: (x: any) => boolean;
  var isInt: (x: any) => boolean;
  var isUint: (x: any) => boolean;
  var isFunction: (x: any) => boolean;
  var isObject: (x: any) => boolean;
  var isArrayBuffer: (x: any) => boolean;
  var isTypedArray: (x: any) => boolean;
  var isBlob: (x: any) => boolean;
  var isArray: (x: any) => boolean;
}
declare module akra {
  enum ELogLevel {
    NONE = 0,
    LOG = 1,
    INFORMATION = 2,
    WARNING = 4,
    ERROR = 8,
    CRITICAL = 16,
    ALL = 31,
  }
  interface ILogRoutineFunc {
    (pEntity: ILoggerEntity): void;
  }
  interface ISourceLocation {
    file: string;
    line: number;
  }
  interface ILoggerEntity {
    code: number;
    location: ISourceLocation;
    message?: string;
    info: any;
  }
  interface ILogger {
    init(): boolean;
    setLogLevel(eLevel: ELogLevel): void;
    getLogLevel(): ELogLevel;
    registerCode(eCode: number, sMessage?: string): boolean;
    setUnknownCode(eCode: number, sMessage: string): void;
    registerCodeFamily(eCodeMin: number, eCodeMax: number, sFamilyName?: string): boolean;
    getFamilyName(eCode: number): string;
    setCodeFamilyRoutine(eCodeFromFamily: number, fnLogRoutine: ILogRoutineFunc, eLevel: number): boolean;
    setCodeFamilyRoutine(sFamilyName: string, fnLogRoutine: ILogRoutineFunc, eLevel: number): boolean;
    setLogRoutine(fnLogRoutine: ILogRoutineFunc, eLevel: number): void;
    setSourceLocation(sFile: string, iLine: number): void;
    setSourceLocation(pLocation: ISourceLocation): void;
    time(sLabel: string): void;
    timeEnd(sLabel: string): void;
    group(...pArgs: any[]): void;
    groupEnd(): void;
    log(...pArgs: any[]): any;
    info(pEntity: ILoggerEntity): void;
    info(eCode: number, ...pArgs: any[]): void;
    info(...pArgs: any[]): void;
    warn(pEntity: ILoggerEntity): void;
    warn(eCode: number, ...pArgs: any[]): void;
    warn(...pArgs: any[]): void;
    error(pEntity: ILoggerEntity): void;
    error(eCode: number, ...pArgs: any[]): void;
    error(...pArgs: any[]): void;
    critical(pEntity: ILoggerEntity): void;
    critical(eCode: number, ...pArgs: any[]): void;
    critical(...pArgs: any[]): void;
    assert(bCondition: boolean, pEntity: ILoggerEntity): void;
    assert(bCondition: boolean, eCode: number, ...pArgs: any[]): void;
    assert(bCondition: boolean, ...pArgs: any[]): void;
  }
}
declare module akra.util {
  class Singleton<T> {
    private static _instance;
    constructor();
  }
}
declare module akra.util {
  class Logger implements akra.ILogger {
    private _eLogLevel;
    private _pGeneralRoutineMap;
    private _pCurrentSourceLocation;
    private _pLastLogEntity;
    private _pCodeFamilyList;
    private _pCodeFamilyMap;
    private _pCodeInfoMap;
    private _pCodeFamilyRoutineDMap;
    private _nFamilyGenerator;
    private static _sDefaultFamilyName;
    private _eUnknownCode;
    private _sUnknownMessage;
    constructor();
    public init(): boolean;
    public setLogLevel(eLevel: akra.ELogLevel): void;
    public getLogLevel(): akra.ELogLevel;
    public registerCode(eCode: number, sMessage?: string): boolean;
    public setUnknownCode(eCode: number, sMessage: string): void;
    public registerCodeFamily(eCodeMin: number, eCodeMax: number, sFamilyName?: string): boolean;
    public getFamilyName(eCode: any): string;
    public setCodeFamilyRoutine(eCodeFromFamily: number, fnLogRoutine: akra.ILogRoutineFunc, eLevel: number): boolean;
    public setCodeFamilyRoutine(sFamilyName: string, fnLogRoutine: akra.ILogRoutineFunc, eLevel: number): boolean;
    public setLogRoutine(fnLogRoutine: akra.ILogRoutineFunc, eLevel: number): void;
    public setSourceLocation(sFile: string, iLine: number): void;
    public setSourceLocation(pLocation: akra.ISourceLocation): void;
    public time(sLabel: string): void;
    public timeEnd(sLabel: string): void;
    public group(...pArgs: any[]): void;
    public groupEnd(): void;
    public log(...pArgs: any[]): void;
    public info(pEntity: akra.ILoggerEntity): void;
    public info(eCode: number, ...pArgs: any[]): void;
    public info(...pArgs: any[]): void;
    public warn(pEntity: akra.ILoggerEntity): void;
    public warn(eCode: number, ...pArgs: any[]): void;
    public warn(...pArgs: any[]): void;
    public error(pEntity: akra.ILoggerEntity): void;
    public error(eCode: number, ...pArgs: any[]): void;
    public error(...pArgs: any[]): void;
    public critical(pEntity: akra.ILoggerEntity): void;
    public critical(eCode: number, ...pArgs: any[]): void;
    public critical(...pArgs: any[]): void;
    public assert(bCondition: boolean, pEntity: akra.ILoggerEntity): void;
    public assert(bCondition: boolean, eCode: number, ...pArgs: any[]): void;
    public assert(bCondition: boolean, ...pArgs: any[]): void;
    private generateFamilyName();
    private isValidCodeInterval(eCodeMin, eCodeMax);
    private isUsedFamilyName(sFamilyName);
    private isUsedCode(eCode);
    private isLogEntity(pObj);
    private isLogCode(eCode);
    private prepareLogEntity(pEntity);
    private getCodeRoutineFunc(eCode, eLevel);
  }
}
declare module akra {
  var logger: ILogger;
}
declare module akra.parser {
  /** @const */
  var END_POSITION: string;
  /** @const */
  var T_EMPTY: string;
  /** @const */
  var UNKNOWN_TOKEN: string;
  /** @const */
  var START_SYMBOL: string;
  /** @const */
  var UNUSED_SYMBOL: string;
  /** @const */
  var END_SYMBOL: string;
  /** @const */
  var LEXER_RULES: string;
  /** @const */
  var FLAG_RULE_CREATE_NODE: string;
  /** @const */
  var FLAG_RULE_NOT_CREATE_NODE: string;
  /** @const */
  var FLAG_RULE_FUNCTION: string;
  /** @const */
  var EOF: string;
  /** @const */
  var T_STRING: string;
  /** @const */
  var T_FLOAT: string;
  /** @const */
  var T_UINT: string;
  /** @const */
  var T_TYPE_ID: string;
  /** @const */
  var T_NON_TYPE_ID: string;
}
declare module akra.parser {
  class Lexer implements parser.ILexer {
    private _iLineNumber;
    private _iColumnNumber;
    private _sSource;
    private _iIndex;
    private _pParser;
    private _pPunctuatorsMap;
    private _pKeywordsMap;
    private _pPunctuatorsFirstSymbols;
    constructor(pParser: parser.IParser);
    static getPunctuatorName(sValue: string): string;
    public addPunctuator(sValue: string, sName?: string): string;
    public addKeyword(sValue: string, sName: string): string;
    public getTerminalValueByName(sName: string): string;
    public init(sSource: string): void;
    public getNextToken(): parser.IToken;
    public _getIndex(): number;
    public _setSource(sSource: string): void;
    public _setIndex(iIndex: number): void;
    private _error(eCode, pToken);
    private identityTokenType();
    private isNumberStart();
    private isCommentStart();
    private isStringStart();
    private isPunctuatorStart();
    private isWhiteSpaceStart();
    private isIdentifierStart();
    private isLineTerminator(sSymbol);
    private isWhiteSpace(sSymbol);
    private isKeyword(sValue);
    private isPunctuator(sValue);
    private nextChar();
    private currentChar();
    private readNextChar();
    private scanString();
    private scanPunctuator();
    private scanNumber();
    private scanIdentifier();
    private scanWhiteSpace();
    private scanComment();
  }
}
declare module akra.parser {
  class ParseTree implements parser.IParseTree {
    private _pRoot;
    private _pNodes;
    private _pNodesCountStack;
    private _isOptimizeMode;
    public getRoot(): parser.IParseNode;
    public setRoot(pRoot: parser.IParseNode): void;
    constructor();
    public finishTree(): void;
    public setOptimizeMode(isOptimize: boolean): void;
    public addNode(pNode: parser.IParseNode): void;
    public reduceByRule(pRule: parser.IRule, eCreate?: parser.ENodeCreateMode): void;
    public toString(): string;
    public clone(): parser.IParseTree;
    public getNodes(): parser.IParseNode[];
    public getLastNode(): parser.IParseNode;
    private addLink(pParent, pNode);
    private cloneNode(pNode);
    private toStringNode(pNode, sPadding?);
  }
}
declare module akra.parser {
  interface IState {
    hasItem(pItem: parser.IItem, eType: parser.EParserType): parser.IItem;
    hasParentItem(pItem: parser.IItem): parser.IItem;
    hasChildItem(pItem: parser.IItem): parser.IItem;
    hasRule(pRule: parser.IRule, iPos: number): boolean;
    isEmpty(): boolean;
    isEqual(pState: IState, eType: parser.EParserType): boolean;
    push(pItem: parser.IItem): void;
    tryPush_LR0(pRule: parser.IRule, iPos: number): boolean;
    tryPush_LR(pRule: parser.IRule, iPos: number, sExpectedSymbol: string): boolean;
    deleteNotBase(): void;
    getNextStateBySymbol(sSymbol: string): IState;
    addNextState(sSymbol: string, pState: IState): boolean;
    toString(isBase?: boolean): string;
    getIndex(): number;
    setIndex(iIndex: number): void;
    getItems(): parser.IItem[];
    getNumBaseItems(): number;
    getNextStates(): akra.IMap<IState>;
  }
}
declare module akra.parser {
  interface IItem {
    isEqual(pItem: IItem, eType?: parser.EParserType): boolean;
    isParentItem(pItem: IItem): boolean;
    isChildItem(pItem: IItem): boolean;
    mark(): string;
    end(): string;
    nextMarked(): string;
    toString(): string;
    isExpected(sSymbol: string): boolean;
    addExpected(sSymbol: string): boolean;
    getRule(): parser.IRule;
    setRule(pRule: parser.IRule): void;
    getPosition(): number;
    setPosition(iPosition: number): void;
    getIndex(): number;
    setIndex(iIndex: number): void;
    getState(): parser.IState;
    setState(pState: parser.IState): void;
    getIsNewExpected(): boolean;
    setIsNewExpected(isNewExpected: boolean): void;
    getExpectedSymbols(): akra.IMap<boolean>;
    getLength(): number;
  }
}
declare module akra.parser {
  class Item implements parser.IItem {
    private _pRule;
    private _iPos;
    private _iIndex;
    private _pState;
    private _pExpected;
    private _isNewExpected;
    private _iLength;
    public getRule(): parser.IRule;
    public setRule(pRule: parser.IRule): void;
    public getPosition(): number;
    public setPosition(iPos: number): void;
    public getState(): parser.IState;
    public setState(pState: parser.IState): void;
    public getIndex(): number;
    public setIndex(iIndex: number): void;
    public getIsNewExpected(): boolean;
    public setIsNewExpected(_isNewExpected: boolean): void;
    public getExpectedSymbols(): akra.IMap<boolean>;
    public getLength(): number;
    constructor(pRule: parser.IRule, iPos: number, pExpected?: akra.IMap<boolean>);
    public isEqual(pItem: parser.IItem, eType?: parser.EParserType): boolean;
    public isParentItem(pItem: parser.IItem): boolean;
    public isChildItem(pItem: parser.IItem): boolean;
    public mark(): string;
    public end(): string;
    public nextMarked(): string;
    public isExpected(sSymbol: string): boolean;
    public addExpected(sSymbol: string): boolean;
    public toString(): string;
  }
}
declare module akra.parser {
  class State implements parser.IState {
    private _pItemList;
    private _pNextStates;
    private _iIndex;
    private _nBaseItems;
    public getIndex(): number;
    public setIndex(iIndex: number): void;
    public getItems(): parser.IItem[];
    public getNumBaseItems(): number;
    public getNextStates(): akra.IMap<parser.IState>;
    constructor();
    public hasItem(pItem: parser.IItem, eType: parser.EParserType): parser.IItem;
    public hasParentItem(pItem: parser.IItem): parser.IItem;
    public hasChildItem(pItem: parser.IItem): parser.IItem;
    public hasRule(pRule: parser.IRule, iPos: number): boolean;
    public isEmpty(): boolean;
    public isEqual(pState: parser.IState, eType: parser.EParserType): boolean;
    public push(pItem: parser.IItem): void;
    public tryPush_LR0(pRule: parser.IRule, iPos: number): boolean;
    public tryPush_LR(pRule: parser.IRule, iPos: number, sExpectedSymbol: string): boolean;
    public getNextStateBySymbol(sSymbol: string): parser.IState;
    public addNextState(sSymbol: string, pState: parser.IState): boolean;
    public deleteNotBase(): void;
    public toString(isBase?: boolean): string;
  }
}
declare module akra.parser {
  class Parser implements parser.IParser {
    private _sSource;
    private _iIndex;
    private _sFileName;
    private _pSyntaxTree;
    private _pTypeIdMap;
    private _pLexer;
    private _pStack;
    private _pToken;
    private _fnFinishCallback;
    private _pCaller;
    private _pSymbolMap;
    private _pSyntaxTable;
    private _pReduceOperationsMap;
    private _pShiftOperationsMap;
    private _pSuccessOperation;
    private _pFirstTerminalsDMap;
    private _pFollowTerminalsDMap;
    private _pRulesDMap;
    private _pStateList;
    private _nRules;
    private _pAdditionalFuncInfoList;
    private _pAdditionalFunctionsMap;
    private _pAdidtionalFunctByStateDMap;
    private _eType;
    private _pGrammarSymbols;
    private _pRuleCreationModeMap;
    private _eParseMode;
    private _pStatesTempMap;
    private _pBaseItemList;
    private _pExpectedExtensionDMap;
    constructor();
    public isTypeId(sValue: string): boolean;
    public returnCode(pNode: parser.IParseNode): string;
    public init(sGrammar: string, eMode?: parser.EParseMode, eType?: parser.EParserType): boolean;
    public parse(sSource: string, fnFinishCallback?: parser.IFinishFunc, pCaller?: any): parser.EParserCode;
    public setParseFileName(sFileName: string): void;
    public getParseFileName(): string;
    public pause(): parser.EParserCode;
    public resume(): parser.EParserCode;
    public printStates(isBaseOnly?: boolean): void;
    public printState(iStateIndex: number, isBaseOnly?: boolean): void;
    public getGrammarSymbols(): akra.IMap<string>;
    public getSyntaxTree(): parser.IParseTree;
    public _saveState(): parser.IParserState;
    public _loadState(pState: parser.IParserState): void;
    public addAdditionalFunction(sFuncName: string, fnRuleFunction: parser.IRuleFunction): void;
    public addTypeId(sIdentifier: string): void;
    public defaultInit(): void;
    private _error(eCode, pErrorInfo);
    private clearMem();
    private hasState(pState, eType);
    private isTerminal(sSymbol);
    private pushState(pState);
    private pushBaseItem(pItem);
    private tryAddState(pState, eType);
    private hasEmptyRule(sSymbol);
    private pushInSyntaxTable(iIndex, sSymbol, pOperation);
    private addStateLink(pState, pNextState, sSymbol);
    private firstTerminal(sSymbol);
    private followTerminal(sSymbol);
    private firstTerminalForSet(pSet, pExpected);
    private generateRules(sGrammarSource);
    private generateFunctionByStateMap();
    private generateFirstState(eType);
    private generateFirstState_LR0();
    private generateFirstState_LR();
    private closure(pState, eType);
    private closure_LR0(pState);
    private closure_LR(pState);
    private nexeState(pState, sSymbol, eType);
    private nextState_LR0(pState, sSymbol);
    private nextState_LR(pState, sSymbol);
    private deleteNotBaseItems();
    private closureForItem(pRule, iPos);
    private addLinkExpected(pItem, pItemX);
    private determineExpected(pTestState, sSymbol);
    private generateLinksExpected();
    private expandExpected();
    private generateStates(eType);
    private generateStates_LR0();
    private generateStates_LR();
    private generateStates_LALR();
    private calcBaseItem();
    private printExpectedTable();
    private addReducing(pState);
    private addShift(pState);
    private buildSyntaxTable();
    private readToken();
    private operationAdditionalAction(iStateIndex, sGrammarSymbol);
    private resumeParse();
    private statesToString(isBaseOnly?);
    private operationToString(pOperation);
    private ruleToString(pRule);
    private convertGrammarSymbol(sSymbol);
  }
}
