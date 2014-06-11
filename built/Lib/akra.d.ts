/// <reference path="../../src/akra/idl/3d-party/fixes.d.ts" />
/// <reference path="../../src/akra/idl/3d-party/gamepad.d.ts" />
/// <reference path="../../src/akra/idl/3d-party/webgl.d.ts" />
/// <reference path="../../src/akra/idl/3d-party/zip.d.ts" />
/// <reference path="../../src/akra/idl/3d-party/FileSaver.d.ts" />
/// <reference path="../../src/akra/idl/3d-party/es6-promises.d.ts" />
declare module akra {
    enum EAjaxDataTypes {
        TEXT = 0,
        JSON = 1,
        BLOB = 2,
        ARRAY_BUFFER = 3,
        DOCUMENT = 4,
    }
    enum EAjaxHttpMethods {
        GET = 1,
        POST = 2,
    }
    enum EAjaxHttpCodes {
        OK = 200,
        CREATED = 201,
        ACCEPTED = 202,
        PARTIAL_INFORMATION = 203,
        MOVED = 301,
        FOUND = 302,
        METHOD = 303,
        NOT_MODIFIED = 304,
        BAD_REQUEST = 400,
        UNAUTHORIZED = 401,
        PAYMENT_REQUIRED = 402,
        FORBIDDEN = 403,
        NOT_FOUND = 404,
        INTERNAL_ERROR = 500,
        NOT_IMPLEMENTED = 501,
        SERVICE_TEMPORARILY_OVERLOADED = 502,
        GATEWAY_TIMEOUT = 503,
    }
    interface IAjaxStatusCodeCallback {
        (code: number): void;
    }
    interface IAjaxStatusCodeMap {
        [code: number]: IAjaxStatusCodeCallback;
    }
    interface IAjaxErrorCallback {
        (request?: XMLHttpRequest, statusText?: string, error?: Error): void;
    }
    interface IAjaxSuccessCallback {
        (data?: any, statusText?: string, request?: XMLHttpRequest): void;
    }
    interface IAjaxBeforeSendCallback {
        (request?: XMLHttpRequest, settings?: IAjaxParams): boolean;
    }
    interface IAjaxParams {
        url?: string;
        async?: boolean;
        statusCode?: IAjaxStatusCodeMap;
        success?: IAjaxSuccessCallback;
        error?: IAjaxErrorCallback;
        beforeSend?: IAjaxBeforeSendCallback;
        data?: Object;
        cache?: boolean;
        contentType?: string;
        dataType?: EAjaxDataTypes;
        type?: EAjaxHttpMethods;
        timeout?: number;
    }
    interface IAjaxResultSync {
        data: any;
        statusText: string;
        xhr: XMLHttpRequest;
    }
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
    var conversionFormats: IConvertionTable;
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
    function abtos(pBuf: ArrayBuffer, iByteOffset?: number, iByteLength?: number): string;
    /**
    * Convert ArrayBuffer to string via BlobReader.
    */
    function abtosAsync(pBuffer: ArrayBuffer, callback: (result: string) => void): void;
    /**
    * Convert ArrayBuffer to typed array.
    */
    function abtota(pBuffer: ArrayBuffer, eType: EDataTypes): ArrayBufferView;
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
interface Array<T> {
    last: any;
    first: any;
    el(i: number): any;
    clear(): any[];
    swap(i: number, j: number): any[];
    /** Insert array as elements sequens or just push single element. */
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
declare module akra.util {
    class Singleton<T> {
        private static _instance;
        constructor();
    }
}
declare module akra.util {
    class Logger implements ILogger {
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
        public setLogLevel(eLevel: ELogLevel): void;
        public getLogLevel(): ELogLevel;
        public registerCode(eCode: number, sMessage?: string): boolean;
        public setUnknownCode(eCode: number, sMessage: string): void;
        public registerCodeFamily(eCodeMin: number, eCodeMax: number, sFamilyName?: string): boolean;
        public getFamilyName(eCode: any): string;
        public setCodeFamilyRoutine(eCodeFromFamily: number, fnLogRoutine: ILogRoutineFunc, eLevel: number): boolean;
        public setCodeFamilyRoutine(sFamilyName: string, fnLogRoutine: ILogRoutineFunc, eLevel: number): boolean;
        public setLogRoutine(fnLogRoutine: ILogRoutineFunc, eLevel: number): void;
        public setSourceLocation(sFile: string, iLine: number): void;
        public setSourceLocation(pLocation: ISourceLocation): void;
        public time(sLabel: string): void;
        public timeEnd(sLabel: string): void;
        public group(...pArgs: any[]): void;
        public groupEnd(): void;
        public log(...pArgs: any[]): void;
        public info(pEntity: ILoggerEntity): void;
        public info(eCode: number, ...pArgs: any[]): void;
        public info(...pArgs: any[]): void;
        public warn(pEntity: ILoggerEntity): void;
        public warn(eCode: number, ...pArgs: any[]): void;
        public warn(...pArgs: any[]): void;
        public error(pEntity: ILoggerEntity): void;
        public error(eCode: number, ...pArgs: any[]): void;
        public error(...pArgs: any[]): void;
        public critical(pEntity: ILoggerEntity): void;
        public critical(eCode: number, ...pArgs: any[]): void;
        public critical(...pArgs: any[]): void;
        public assert(bCondition: boolean, pEntity: ILoggerEntity): void;
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
declare var AE_DEBUG: boolean;
declare module akra {
    var logger: ILogger;
}
declare module akra {
    interface IUnique {
        guid: number;
    }
}
declare module akra {
    enum EEventTypes {
        UNICAST = 0,
        BROADCAST = 1,
    }
    interface ISignal<T extends Function> {
        connect(pSignal: ISignal<any>): boolean;
        connect(fnCallback: T, eType?: EEventTypes): boolean;
        connect(fnCallback: string, eType?: EEventTypes): boolean;
        connect(pReciever: any, fnCallback: T, eType?: EEventTypes): boolean;
        connect(pReciever: any, fnCallback: string, eType?: EEventTypes): boolean;
        disconnect(pSignal: ISignal<any>): boolean;
        disconnect(fnCallback: T, eType?: EEventTypes): boolean;
        disconnect(fnCallback: string, eType?: EEventTypes): boolean;
        disconnect(pReciever: any, fnCallback: T, eType?: EEventTypes): boolean;
        disconnect(pReciever: any, fnCallback: string, eType?: EEventTypes): boolean;
        emit(...args: any[]): any;
        clear(): void;
        hasListeners(): boolean;
        getSender(): any;
        getType(): EEventTypes;
        getListeners(eEventType: EEventTypes): IListener<T>[];
        setForerunner(fn: Function): void;
        _syncSignal(pSignal: ISignal<T>): void;
    }
    interface IListener<T extends Function> {
        /** Context of signal. */
        reciever: any;
        /** Callback function. */
        callback: T;
        /** Event type. */
        type: EEventTypes;
        callbackName: string;
    }
    interface IEventProvider extends IUnique {
        setupSignals(): void;
    }
}
declare module akra {
    interface IReferenceCounter {
        /**
        * Текущее количесвто ссылок  на объект
        **/
        referenceCount(): number;
        /** Предупреждает если объект еще используется */
        destructor(): void;
        /**
        * Добаволение ссылки  на объект, увеличивает внутренний счетчки на 1,
        * проверяет не достигнуто ли максимальное количесвто
        **/
        addRef(): number;
        /**
        * Уведомление об удалении ссылки  на объект, уменьшает внутренний счетчки на 1,
        * проверяет есть ли ее объекты
        **/
        release(): number;
        /**
        * Данная функция нужна чтобы обеспечить наследникам ее возможность,
        * само количестdо ссылок не копируется
        */
        eq(pSrc: IReferenceCounter): IReferenceCounter;
    }
}
declare module akra {
    interface IManager {
        initialize(): boolean;
        destroy(): void;
    }
}
declare module akra {
    enum ESceneTypes {
        TYPE_3D = 0,
        TYPE_2D = 1,
    }
    interface IScene extends IEventProvider {
        getType(): ESceneTypes;
        getName(): string;
        getManager(): ISceneManager;
    }
}
declare module akra {
    interface IExplorerFunc {
        (pEntity: IEntity): boolean;
    }
}
declare module akra {
    enum EEntityTypes {
        UNKNOWN = 0,
        NODE = 1,
        JOINT = 2,
        SCENE_NODE = 3,
        CAMERA = 4,
        SHADOW_CASTER = 5,
        MODEL_ENTRY = 6,
        LIGHT = 37,
        SCENE_OBJECT = 64,
        MODEL = 65,
        TERRAIN = 66,
        TERRAIN_ROAM = 67,
        TERRAIN_SECTION = 68,
        TERRAIN_SECTION_ROAM = 69,
        TEXT3D = 70,
        SPRITE = 71,
        EMITTER = 72,
        UI_NODE = 100,
        OBJECTS_LIMIT = 128,
    }
    interface IEntity extends IEventProvider, IReferenceCounter {
        getName(): string;
        setName(sName: string): void;
        getParent(): IEntity;
        setParent(pParent: IEntity): void;
        getSibling(): IEntity;
        setSibling(pSibling: IEntity): void;
        getChild(): IEntity;
        setChild(pChild: IEntity): void;
        getRightSibling(): IEntity;
        getType(): EEntityTypes;
        getDepth(): number;
        getRoot(): IEntity;
        destroy(bRecursive?: boolean, bPromoteChildren?: boolean): void;
        findEntity(sName: string): IEntity;
        explore(fn: IExplorerFunc, bWithSiblings?: boolean): void;
        childOf(pParent: IEntity): boolean;
        siblingCount(): number;
        childCount(): number;
        children(): IEntity[];
        childAt(i: number): IEntity;
        descCount(): number;
        update(): boolean;
        recursiveUpdate(): boolean;
        recursivePreUpdate(): void;
        prepareForUpdate(): void;
        hasParent(): boolean;
        hasChild(): boolean;
        hasSibling(): boolean;
        isASibling(pSibling: IEntity): boolean;
        isAChild(pChild: IEntity): boolean;
        isInFamily(pEntity: IEntity, bSearchEntireTree?: boolean): boolean;
        isUpdated(): boolean;
        hasUpdatedSubNodes(): boolean;
        addSibling(pSibling: IEntity): IEntity;
        addChild(pChild: IEntity): IEntity;
        removeChild(pChild: IEntity): IEntity;
        removeAllChildren(): void;
        attachToParent(pParent: IEntity): boolean;
        detachFromParent(): boolean;
        promoteChildren(): void;
        relocateChildren(pParent: IEntity): void;
        toString(isRecursive?: boolean, iDepth?: number): string;
        attached: ISignal<(pEntity: IEntity) => void>;
        detached: ISignal<(pEntity: IEntity) => void>;
        childAdded: ISignal<(pEntity: IEntity, pChild: IEntity) => void>;
        childRemoved: ISignal<(pEntity: IEntity, pChild: IEntity) => void>;
    }
}
declare module akra {
    interface IVec2Constructor {
        (): any;
        (fValue: number): any;
        (v2fVec: IVec2): any;
        (pArray: number[]): any;
        (fValue1: number, fValue2: number): any;
    }
    interface IVec2 {
        x: number;
        y: number;
        set(): IVec2;
        set(fValue: number): IVec2;
        set(v2fVec: IVec2): IVec2;
        set(pArray: number[]): IVec2;
        set(fValue1: number, fValue2: number): IVec2;
        clear(): IVec2;
        add(v2fVec: IVec2, v2fDestination?: IVec2): IVec2;
        subtract(v2fVec: IVec2, v2fDestination?: IVec2): IVec2;
        dot(v2fVec: IVec2): number;
        isEqual(v2fVec: IVec2, fEps?: number): boolean;
        isClear(fEps?: number): boolean;
        negate(v2fDestination?: IVec2): IVec2;
        scale(fScale: number, v2fDestination?: IVec2): IVec2;
        normalize(v2fDestination?: IVec2): IVec2;
        length(): number;
        lengthSquare(): number;
        direction(v2fVec: IVec2, v2fDestination?: IVec2): IVec2;
        mix(v2fVec: IVec2, fA: number, v2fDestination?: IVec2): IVec2;
        toString(): string;
        clone(sForm: "xx", v2fDest?: IVec2): IVec2;
        clone(sForm: "xy", v2fDest?: IVec2): IVec2;
        clone(sForm: "yx", v2fDest?: IVec2): IVec2;
        clone(sForm: "yy", v2fDest?: IVec2): IVec2;
        clone(sForm: string, v2fDest?: IVec2): IVec2;
        copy(sForm: "xx", v2fFrom: IVec2): IVec2;
        copy(sForm: "xx", fValue: number): IVec2;
        copy(sForm: "xy", v2fFrom: IVec2): IVec2;
        copy(sForm: "xy", fValue: number): IVec2;
        copy(sForm: "yx", v2fFrom: IVec2): IVec2;
        copy(sForm: "yx", fValue: number): IVec2;
        copy(sForm: "yy", v2fFrom: IVec2): IVec2;
        copy(sForm: "yy", fValue: number): IVec2;
        copy(sForm: string, v2fFrom: IVec2): IVec2;
        copy(sForm: string, fValue: number): IVec2;
    }
}
declare module akra {
    interface IColorIValue {
        r: number;
        g: number;
        b: number;
        a: number;
    }
    interface IColorValue {
        r: number;
        g: number;
        b: number;
        a: number;
    }
}
declare module akra {
    interface IVec4Constructor {
        (): any;
        (fValue: number): any;
        (v4fVec: IVec4): any;
        (pArray: number[]): any;
        (fValue: number, v3fVec: IVec3): any;
        (v2fVec1: IVec2, v2fVec2: IVec2): any;
        (v3fVec: IVec3, fValue: number): any;
        (fValue1: number, fValue2: number, v2fVec: IVec2): any;
        (fValue1: number, v2fVec: IVec2, fValue2: number): any;
        (v2fVec: IVec2, fValue1: number, fValue2: number): any;
        (fValue1: number, fValue2: number, fValue3: number, fValue4: number): any;
    }
    interface IVec4 {
        x: number;
        y: number;
        z: number;
        w: number;
        set(): IVec4;
        set(fValue: number): IVec4;
        set(v4fVec: IVec4): IVec4;
        set(c4fColor: IColorValue): IVec4;
        set(pArray: number[]): IVec4;
        set(fValue: number, v3fVec: IVec3): IVec4;
        set(v2fVec1: IVec2, v2fVec2: IVec2): IVec4;
        set(v3fVec: IVec3, fValue: number): IVec4;
        set(fValue1: number, fValue2: number, v2fVec: IVec2): IVec4;
        set(fValue1: number, v2fVec: IVec2, fValue2: number): IVec4;
        set(v2fVec: IVec2, fValue1: number, fValue2: number): IVec4;
        set(fValue1: number, fValue2: number, fValue3: number, fValue4: number): IVec4;
        clear(): IVec4;
        add(v4fVec: IVec4, v4fDestination?: IVec4): IVec4;
        subtract(v4fVec: IVec4, v4fDestination?: IVec4): IVec4;
        dot(v4fVec: IVec4): number;
        isEqual(v4fVec: IVec4, fEps?: number): boolean;
        isClear(fEps?: number): boolean;
        negate(v4fDestination?: IVec4): IVec4;
        scale(fScale: number, v4fDestination?: IVec4): IVec4;
        normalize(v4fDestination?: IVec4): IVec4;
        length(): number;
        lengthSquare(): number;
        direction(v4fVec: IVec4, v4fDestination?: IVec4): IVec4;
        mix(v4fVec: IVec4, fA: number, v4fDestination?: IVec4): IVec4;
        toString(): string;
        clone(sForm: "xx", v2fDest?: IVec2): IVec2;
        clone(sForm: "xy", v2fDest?: IVec2): IVec2;
        clone(sForm: "xz", v2fDest?: IVec2): IVec2;
        clone(sForm: "xw", v2fDest?: IVec2): IVec2;
        clone(sForm: "yx", v2fDest?: IVec2): IVec2;
        clone(sForm: "yy", v2fDest?: IVec2): IVec2;
        clone(sForm: "yz", v2fDest?: IVec2): IVec2;
        clone(sForm: "yw", v2fDest?: IVec2): IVec2;
        clone(sForm: "zx", v2fDest?: IVec2): IVec2;
        clone(sForm: "zy", v2fDest?: IVec2): IVec2;
        clone(sForm: "zz", v2fDest?: IVec2): IVec2;
        clone(sForm: "zw", v2fDest?: IVec2): IVec2;
        clone(sForm: "wx", v2fDest?: IVec2): IVec2;
        clone(sForm: "wy", v2fDest?: IVec2): IVec2;
        clone(sForm: "wz", v2fDest?: IVec2): IVec2;
        clone(sForm: "ww", v2fDest?: IVec2): IVec2;
        clone(sForm: "xxx", v3fDest?: IVec3): IVec3;
        clone(sForm: "xxy", v3fDest?: IVec3): IVec3;
        clone(sForm: "xxz", v3fDest?: IVec3): IVec3;
        clone(sForm: "xxw", v3fDest?: IVec3): IVec3;
        clone(sForm: "xyx", v3fDest?: IVec3): IVec3;
        clone(sForm: "xyy", v3fDest?: IVec3): IVec3;
        clone(sForm: "xyz", v3fDest?: IVec3): IVec3;
        clone(sForm: "xyw", v3fDest?: IVec3): IVec3;
        clone(sForm: "xzx", v3fDest?: IVec3): IVec3;
        clone(sForm: "xzy", v3fDest?: IVec3): IVec3;
        clone(sForm: "xzz", v3fDest?: IVec3): IVec3;
        clone(sForm: "xzw", v3fDest?: IVec3): IVec3;
        clone(sForm: "xwx", v3fDest?: IVec3): IVec3;
        clone(sForm: "xwy", v3fDest?: IVec3): IVec3;
        clone(sForm: "xwz", v3fDest?: IVec3): IVec3;
        clone(sForm: "xww", v3fDest?: IVec3): IVec3;
        clone(sForm: "yxx", v3fDest?: IVec3): IVec3;
        clone(sForm: "yxy", v3fDest?: IVec3): IVec3;
        clone(sForm: "yxz", v3fDest?: IVec3): IVec3;
        clone(sForm: "yxw", v3fDest?: IVec3): IVec3;
        clone(sForm: "yyx", v3fDest?: IVec3): IVec3;
        clone(sForm: "yyy", v3fDest?: IVec3): IVec3;
        clone(sForm: "yyz", v3fDest?: IVec3): IVec3;
        clone(sForm: "yyw", v3fDest?: IVec3): IVec3;
        clone(sForm: "yzx", v3fDest?: IVec3): IVec3;
        clone(sForm: "yzy", v3fDest?: IVec3): IVec3;
        clone(sForm: "yzz", v3fDest?: IVec3): IVec3;
        clone(sForm: "yzw", v3fDest?: IVec3): IVec3;
        clone(sForm: "ywx", v3fDest?: IVec3): IVec3;
        clone(sForm: "ywy", v3fDest?: IVec3): IVec3;
        clone(sForm: "ywz", v3fDest?: IVec3): IVec3;
        clone(sForm: "yww", v3fDest?: IVec3): IVec3;
        clone(sForm: "zxx", v3fDest?: IVec3): IVec3;
        clone(sForm: "zxy", v3fDest?: IVec3): IVec3;
        clone(sForm: "zxz", v3fDest?: IVec3): IVec3;
        clone(sForm: "zxw", v3fDest?: IVec3): IVec3;
        clone(sForm: "zyx", v3fDest?: IVec3): IVec3;
        clone(sForm: "zyy", v3fDest?: IVec3): IVec3;
        clone(sForm: "zyz", v3fDest?: IVec3): IVec3;
        clone(sForm: "zyw", v3fDest?: IVec3): IVec3;
        clone(sForm: "zzx", v3fDest?: IVec3): IVec3;
        clone(sForm: "zzy", v3fDest?: IVec3): IVec3;
        clone(sForm: "zzz", v3fDest?: IVec3): IVec3;
        clone(sForm: "zzw", v3fDest?: IVec3): IVec3;
        clone(sForm: "zwx", v3fDest?: IVec3): IVec3;
        clone(sForm: "zwy", v3fDest?: IVec3): IVec3;
        clone(sForm: "zwz", v3fDest?: IVec3): IVec3;
        clone(sForm: "zww", v3fDest?: IVec3): IVec3;
        clone(sForm: "wxx", v3fDest?: IVec3): IVec3;
        clone(sForm: "wxy", v3fDest?: IVec3): IVec3;
        clone(sForm: "wxz", v3fDest?: IVec3): IVec3;
        clone(sForm: "wxw", v3fDest?: IVec3): IVec3;
        clone(sForm: "wyx", v3fDest?: IVec3): IVec3;
        clone(sForm: "wyy", v3fDest?: IVec3): IVec3;
        clone(sForm: "wyz", v3fDest?: IVec3): IVec3;
        clone(sForm: "wyw", v3fDest?: IVec3): IVec3;
        clone(sForm: "wzx", v3fDest?: IVec3): IVec3;
        clone(sForm: "wzy", v3fDest?: IVec3): IVec3;
        clone(sForm: "wzz", v3fDest?: IVec3): IVec3;
        clone(sForm: "wzw", v3fDest?: IVec3): IVec3;
        clone(sForm: "wwx", v3fDest?: IVec3): IVec3;
        clone(sForm: "wwy", v3fDest?: IVec3): IVec3;
        clone(sForm: "wwz", v3fDest?: IVec3): IVec3;
        clone(sForm: "www", v3fDest?: IVec3): IVec3;
        clone(sForm: "xxxx", v4fDest?: IVec4): IVec4;
        clone(sForm: "xxxy", v4fDest?: IVec4): IVec4;
        clone(sForm: "xxxz", v4fDest?: IVec4): IVec4;
        clone(sForm: "xxxw", v4fDest?: IVec4): IVec4;
        clone(sForm: "xxyx", v4fDest?: IVec4): IVec4;
        clone(sForm: "xxyy", v4fDest?: IVec4): IVec4;
        clone(sForm: "xxyz", v4fDest?: IVec4): IVec4;
        clone(sForm: "xxyw", v4fDest?: IVec4): IVec4;
        clone(sForm: "xxzx", v4fDest?: IVec4): IVec4;
        clone(sForm: "xxzy", v4fDest?: IVec4): IVec4;
        clone(sForm: "xxzz", v4fDest?: IVec4): IVec4;
        clone(sForm: "xxzw", v4fDest?: IVec4): IVec4;
        clone(sForm: "xxwx", v4fDest?: IVec4): IVec4;
        clone(sForm: "xxwy", v4fDest?: IVec4): IVec4;
        clone(sForm: "xxwz", v4fDest?: IVec4): IVec4;
        clone(sForm: "xxww", v4fDest?: IVec4): IVec4;
        clone(sForm: "xyxx", v4fDest?: IVec4): IVec4;
        clone(sForm: "xyxy", v4fDest?: IVec4): IVec4;
        clone(sForm: "xyxz", v4fDest?: IVec4): IVec4;
        clone(sForm: "xyxw", v4fDest?: IVec4): IVec4;
        clone(sForm: "xyyx", v4fDest?: IVec4): IVec4;
        clone(sForm: "xyyy", v4fDest?: IVec4): IVec4;
        clone(sForm: "xyyz", v4fDest?: IVec4): IVec4;
        clone(sForm: "xyyw", v4fDest?: IVec4): IVec4;
        clone(sForm: "xyzx", v4fDest?: IVec4): IVec4;
        clone(sForm: "xyzy", v4fDest?: IVec4): IVec4;
        clone(sForm: "xyzz", v4fDest?: IVec4): IVec4;
        clone(sForm: "xyzw", v4fDest?: IVec4): IVec4;
        clone(sForm: "xywx", v4fDest?: IVec4): IVec4;
        clone(sForm: "xywy", v4fDest?: IVec4): IVec4;
        clone(sForm: "xywz", v4fDest?: IVec4): IVec4;
        clone(sForm: "xyww", v4fDest?: IVec4): IVec4;
        clone(sForm: "xzxx", v4fDest?: IVec4): IVec4;
        clone(sForm: "xzxy", v4fDest?: IVec4): IVec4;
        clone(sForm: "xzxz", v4fDest?: IVec4): IVec4;
        clone(sForm: "xzxw", v4fDest?: IVec4): IVec4;
        clone(sForm: "xzyx", v4fDest?: IVec4): IVec4;
        clone(sForm: "xzyy", v4fDest?: IVec4): IVec4;
        clone(sForm: "xzyz", v4fDest?: IVec4): IVec4;
        clone(sForm: "xzyw", v4fDest?: IVec4): IVec4;
        clone(sForm: "xzzx", v4fDest?: IVec4): IVec4;
        clone(sForm: "xzzy", v4fDest?: IVec4): IVec4;
        clone(sForm: "xzzz", v4fDest?: IVec4): IVec4;
        clone(sForm: "xzzw", v4fDest?: IVec4): IVec4;
        clone(sForm: "xzwx", v4fDest?: IVec4): IVec4;
        clone(sForm: "xzwy", v4fDest?: IVec4): IVec4;
        clone(sForm: "xzwz", v4fDest?: IVec4): IVec4;
        clone(sForm: "xzww", v4fDest?: IVec4): IVec4;
        clone(sForm: "xwxx", v4fDest?: IVec4): IVec4;
        clone(sForm: "xwxy", v4fDest?: IVec4): IVec4;
        clone(sForm: "xwxz", v4fDest?: IVec4): IVec4;
        clone(sForm: "xwxw", v4fDest?: IVec4): IVec4;
        clone(sForm: "xwyx", v4fDest?: IVec4): IVec4;
        clone(sForm: "xwyy", v4fDest?: IVec4): IVec4;
        clone(sForm: "xwyz", v4fDest?: IVec4): IVec4;
        clone(sForm: "xwyw", v4fDest?: IVec4): IVec4;
        clone(sForm: "xwzx", v4fDest?: IVec4): IVec4;
        clone(sForm: "xwzy", v4fDest?: IVec4): IVec4;
        clone(sForm: "xwzz", v4fDest?: IVec4): IVec4;
        clone(sForm: "xwzw", v4fDest?: IVec4): IVec4;
        clone(sForm: "xwwx", v4fDest?: IVec4): IVec4;
        clone(sForm: "xwwy", v4fDest?: IVec4): IVec4;
        clone(sForm: "xwwz", v4fDest?: IVec4): IVec4;
        clone(sForm: "xwww", v4fDest?: IVec4): IVec4;
        clone(sForm: "yxxx", v4fDest?: IVec4): IVec4;
        clone(sForm: "yxxy", v4fDest?: IVec4): IVec4;
        clone(sForm: "yxxz", v4fDest?: IVec4): IVec4;
        clone(sForm: "yxxw", v4fDest?: IVec4): IVec4;
        clone(sForm: "yxyx", v4fDest?: IVec4): IVec4;
        clone(sForm: "yxyy", v4fDest?: IVec4): IVec4;
        clone(sForm: "yxyz", v4fDest?: IVec4): IVec4;
        clone(sForm: "yxyw", v4fDest?: IVec4): IVec4;
        clone(sForm: "yxzx", v4fDest?: IVec4): IVec4;
        clone(sForm: "yxzy", v4fDest?: IVec4): IVec4;
        clone(sForm: "yxzz", v4fDest?: IVec4): IVec4;
        clone(sForm: "yxzw", v4fDest?: IVec4): IVec4;
        clone(sForm: "yxwx", v4fDest?: IVec4): IVec4;
        clone(sForm: "yxwy", v4fDest?: IVec4): IVec4;
        clone(sForm: "yxwz", v4fDest?: IVec4): IVec4;
        clone(sForm: "yxww", v4fDest?: IVec4): IVec4;
        clone(sForm: "yyxx", v4fDest?: IVec4): IVec4;
        clone(sForm: "yyxy", v4fDest?: IVec4): IVec4;
        clone(sForm: "yyxz", v4fDest?: IVec4): IVec4;
        clone(sForm: "yyxw", v4fDest?: IVec4): IVec4;
        clone(sForm: "yyyx", v4fDest?: IVec4): IVec4;
        clone(sForm: "yyyy", v4fDest?: IVec4): IVec4;
        clone(sForm: "yyyz", v4fDest?: IVec4): IVec4;
        clone(sForm: "yyyw", v4fDest?: IVec4): IVec4;
        clone(sForm: "yyzx", v4fDest?: IVec4): IVec4;
        clone(sForm: "yyzy", v4fDest?: IVec4): IVec4;
        clone(sForm: "yyzz", v4fDest?: IVec4): IVec4;
        clone(sForm: "yyzw", v4fDest?: IVec4): IVec4;
        clone(sForm: "yywx", v4fDest?: IVec4): IVec4;
        clone(sForm: "yywy", v4fDest?: IVec4): IVec4;
        clone(sForm: "yywz", v4fDest?: IVec4): IVec4;
        clone(sForm: "yyww", v4fDest?: IVec4): IVec4;
        clone(sForm: "yzxx", v4fDest?: IVec4): IVec4;
        clone(sForm: "yzxy", v4fDest?: IVec4): IVec4;
        clone(sForm: "yzxz", v4fDest?: IVec4): IVec4;
        clone(sForm: "yzxw", v4fDest?: IVec4): IVec4;
        clone(sForm: "yzyx", v4fDest?: IVec4): IVec4;
        clone(sForm: "yzyy", v4fDest?: IVec4): IVec4;
        clone(sForm: "yzyz", v4fDest?: IVec4): IVec4;
        clone(sForm: "yzyw", v4fDest?: IVec4): IVec4;
        clone(sForm: "yzzx", v4fDest?: IVec4): IVec4;
        clone(sForm: "yzzy", v4fDest?: IVec4): IVec4;
        clone(sForm: "yzzz", v4fDest?: IVec4): IVec4;
        clone(sForm: "yzzw", v4fDest?: IVec4): IVec4;
        clone(sForm: "yzwx", v4fDest?: IVec4): IVec4;
        clone(sForm: "yzwy", v4fDest?: IVec4): IVec4;
        clone(sForm: "yzwz", v4fDest?: IVec4): IVec4;
        clone(sForm: "yzww", v4fDest?: IVec4): IVec4;
        clone(sForm: "ywxx", v4fDest?: IVec4): IVec4;
        clone(sForm: "ywxy", v4fDest?: IVec4): IVec4;
        clone(sForm: "ywxz", v4fDest?: IVec4): IVec4;
        clone(sForm: "ywxw", v4fDest?: IVec4): IVec4;
        clone(sForm: "ywyx", v4fDest?: IVec4): IVec4;
        clone(sForm: "ywyy", v4fDest?: IVec4): IVec4;
        clone(sForm: "ywyz", v4fDest?: IVec4): IVec4;
        clone(sForm: "ywyw", v4fDest?: IVec4): IVec4;
        clone(sForm: "ywzx", v4fDest?: IVec4): IVec4;
        clone(sForm: "ywzy", v4fDest?: IVec4): IVec4;
        clone(sForm: "ywzz", v4fDest?: IVec4): IVec4;
        clone(sForm: "ywzw", v4fDest?: IVec4): IVec4;
        clone(sForm: "ywwx", v4fDest?: IVec4): IVec4;
        clone(sForm: "ywwy", v4fDest?: IVec4): IVec4;
        clone(sForm: "ywwz", v4fDest?: IVec4): IVec4;
        clone(sForm: "ywww", v4fDest?: IVec4): IVec4;
        clone(sForm: "zxxx", v4fDest?: IVec4): IVec4;
        clone(sForm: "zxxy", v4fDest?: IVec4): IVec4;
        clone(sForm: "zxxz", v4fDest?: IVec4): IVec4;
        clone(sForm: "zxxw", v4fDest?: IVec4): IVec4;
        clone(sForm: "zxyx", v4fDest?: IVec4): IVec4;
        clone(sForm: "zxyy", v4fDest?: IVec4): IVec4;
        clone(sForm: "zxyz", v4fDest?: IVec4): IVec4;
        clone(sForm: "zxyw", v4fDest?: IVec4): IVec4;
        clone(sForm: "zxzx", v4fDest?: IVec4): IVec4;
        clone(sForm: "zxzy", v4fDest?: IVec4): IVec4;
        clone(sForm: "zxzz", v4fDest?: IVec4): IVec4;
        clone(sForm: "zxzw", v4fDest?: IVec4): IVec4;
        clone(sForm: "zxwx", v4fDest?: IVec4): IVec4;
        clone(sForm: "zxwy", v4fDest?: IVec4): IVec4;
        clone(sForm: "zxwz", v4fDest?: IVec4): IVec4;
        clone(sForm: "zxww", v4fDest?: IVec4): IVec4;
        clone(sForm: "zyxx", v4fDest?: IVec4): IVec4;
        clone(sForm: "zyxy", v4fDest?: IVec4): IVec4;
        clone(sForm: "zyxz", v4fDest?: IVec4): IVec4;
        clone(sForm: "zyxw", v4fDest?: IVec4): IVec4;
        clone(sForm: "zyyx", v4fDest?: IVec4): IVec4;
        clone(sForm: "zyyy", v4fDest?: IVec4): IVec4;
        clone(sForm: "zyyz", v4fDest?: IVec4): IVec4;
        clone(sForm: "zyyw", v4fDest?: IVec4): IVec4;
        clone(sForm: "zyzx", v4fDest?: IVec4): IVec4;
        clone(sForm: "zyzy", v4fDest?: IVec4): IVec4;
        clone(sForm: "zyzz", v4fDest?: IVec4): IVec4;
        clone(sForm: "zyzw", v4fDest?: IVec4): IVec4;
        clone(sForm: "zywx", v4fDest?: IVec4): IVec4;
        clone(sForm: "zywy", v4fDest?: IVec4): IVec4;
        clone(sForm: "zywz", v4fDest?: IVec4): IVec4;
        clone(sForm: "zyww", v4fDest?: IVec4): IVec4;
        clone(sForm: "zzxx", v4fDest?: IVec4): IVec4;
        clone(sForm: "zzxy", v4fDest?: IVec4): IVec4;
        clone(sForm: "zzxz", v4fDest?: IVec4): IVec4;
        clone(sForm: "zzxw", v4fDest?: IVec4): IVec4;
        clone(sForm: "zzyx", v4fDest?: IVec4): IVec4;
        clone(sForm: "zzyy", v4fDest?: IVec4): IVec4;
        clone(sForm: "zzyz", v4fDest?: IVec4): IVec4;
        clone(sForm: "zzyw", v4fDest?: IVec4): IVec4;
        clone(sForm: "zzzx", v4fDest?: IVec4): IVec4;
        clone(sForm: "zzzy", v4fDest?: IVec4): IVec4;
        clone(sForm: "zzzz", v4fDest?: IVec4): IVec4;
        clone(sForm: "zzzw", v4fDest?: IVec4): IVec4;
        clone(sForm: "zzwx", v4fDest?: IVec4): IVec4;
        clone(sForm: "zzwy", v4fDest?: IVec4): IVec4;
        clone(sForm: "zzwz", v4fDest?: IVec4): IVec4;
        clone(sForm: "zzww", v4fDest?: IVec4): IVec4;
        clone(sForm: "zwxx", v4fDest?: IVec4): IVec4;
        clone(sForm: "zwxy", v4fDest?: IVec4): IVec4;
        clone(sForm: "zwxz", v4fDest?: IVec4): IVec4;
        clone(sForm: "zwxw", v4fDest?: IVec4): IVec4;
        clone(sForm: "zwyx", v4fDest?: IVec4): IVec4;
        clone(sForm: "zwyy", v4fDest?: IVec4): IVec4;
        clone(sForm: "zwyz", v4fDest?: IVec4): IVec4;
        clone(sForm: "zwyw", v4fDest?: IVec4): IVec4;
        clone(sForm: "zwzx", v4fDest?: IVec4): IVec4;
        clone(sForm: "zwzy", v4fDest?: IVec4): IVec4;
        clone(sForm: "zwzz", v4fDest?: IVec4): IVec4;
        clone(sForm: "zwzw", v4fDest?: IVec4): IVec4;
        clone(sForm: "zwwx", v4fDest?: IVec4): IVec4;
        clone(sForm: "zwwy", v4fDest?: IVec4): IVec4;
        clone(sForm: "zwwz", v4fDest?: IVec4): IVec4;
        clone(sForm: "zwww", v4fDest?: IVec4): IVec4;
        clone(sForm: "wxxx", v4fDest?: IVec4): IVec4;
        clone(sForm: "wxxy", v4fDest?: IVec4): IVec4;
        clone(sForm: "wxxz", v4fDest?: IVec4): IVec4;
        clone(sForm: "wxxw", v4fDest?: IVec4): IVec4;
        clone(sForm: "wxyx", v4fDest?: IVec4): IVec4;
        clone(sForm: "wxyy", v4fDest?: IVec4): IVec4;
        clone(sForm: "wxyz", v4fDest?: IVec4): IVec4;
        clone(sForm: "wxyw", v4fDest?: IVec4): IVec4;
        clone(sForm: "wxzx", v4fDest?: IVec4): IVec4;
        clone(sForm: "wxzy", v4fDest?: IVec4): IVec4;
        clone(sForm: "wxzz", v4fDest?: IVec4): IVec4;
        clone(sForm: "wxzw", v4fDest?: IVec4): IVec4;
        clone(sForm: "wxwx", v4fDest?: IVec4): IVec4;
        clone(sForm: "wxwy", v4fDest?: IVec4): IVec4;
        clone(sForm: "wxwz", v4fDest?: IVec4): IVec4;
        clone(sForm: "wxww", v4fDest?: IVec4): IVec4;
        clone(sForm: "wyxx", v4fDest?: IVec4): IVec4;
        clone(sForm: "wyxy", v4fDest?: IVec4): IVec4;
        clone(sForm: "wyxz", v4fDest?: IVec4): IVec4;
        clone(sForm: "wyxw", v4fDest?: IVec4): IVec4;
        clone(sForm: "wyyx", v4fDest?: IVec4): IVec4;
        clone(sForm: "wyyy", v4fDest?: IVec4): IVec4;
        clone(sForm: "wyyz", v4fDest?: IVec4): IVec4;
        clone(sForm: "wyyw", v4fDest?: IVec4): IVec4;
        clone(sForm: "wyzx", v4fDest?: IVec4): IVec4;
        clone(sForm: "wyzy", v4fDest?: IVec4): IVec4;
        clone(sForm: "wyzz", v4fDest?: IVec4): IVec4;
        clone(sForm: "wyzw", v4fDest?: IVec4): IVec4;
        clone(sForm: "wywx", v4fDest?: IVec4): IVec4;
        clone(sForm: "wywy", v4fDest?: IVec4): IVec4;
        clone(sForm: "wywz", v4fDest?: IVec4): IVec4;
        clone(sForm: "wyww", v4fDest?: IVec4): IVec4;
        clone(sForm: "wzxx", v4fDest?: IVec4): IVec4;
        clone(sForm: "wzxy", v4fDest?: IVec4): IVec4;
        clone(sForm: "wzxz", v4fDest?: IVec4): IVec4;
        clone(sForm: "wzxw", v4fDest?: IVec4): IVec4;
        clone(sForm: "wzyx", v4fDest?: IVec4): IVec4;
        clone(sForm: "wzyy", v4fDest?: IVec4): IVec4;
        clone(sForm: "wzyz", v4fDest?: IVec4): IVec4;
        clone(sForm: "wzyw", v4fDest?: IVec4): IVec4;
        clone(sForm: "wzzx", v4fDest?: IVec4): IVec4;
        clone(sForm: "wzzy", v4fDest?: IVec4): IVec4;
        clone(sForm: "wzzz", v4fDest?: IVec4): IVec4;
        clone(sForm: "wzzw", v4fDest?: IVec4): IVec4;
        clone(sForm: "wzwx", v4fDest?: IVec4): IVec4;
        clone(sForm: "wzwy", v4fDest?: IVec4): IVec4;
        clone(sForm: "wzwz", v4fDest?: IVec4): IVec4;
        clone(sForm: "wzww", v4fDest?: IVec4): IVec4;
        clone(sForm: "wwxx", v4fDest?: IVec4): IVec4;
        clone(sForm: "wwxy", v4fDest?: IVec4): IVec4;
        clone(sForm: "wwxz", v4fDest?: IVec4): IVec4;
        clone(sForm: "wwxw", v4fDest?: IVec4): IVec4;
        clone(sForm: "wwyx", v4fDest?: IVec4): IVec4;
        clone(sForm: "wwyy", v4fDest?: IVec4): IVec4;
        clone(sForm: "wwyz", v4fDest?: IVec4): IVec4;
        clone(sForm: "wwyw", v4fDest?: IVec4): IVec4;
        clone(sForm: "wwzx", v4fDest?: IVec4): IVec4;
        clone(sForm: "wwzy", v4fDest?: IVec4): IVec4;
        clone(sForm: "wwzz", v4fDest?: IVec4): IVec4;
        clone(sForm: "wwzw", v4fDest?: IVec4): IVec4;
        clone(sForm: "wwwx", v4fDest?: IVec4): IVec4;
        clone(sForm: "wwwy", v4fDest?: IVec4): IVec4;
        clone(sForm: "wwwz", v4fDest?: IVec4): IVec4;
        clone(sForm: "wwww", v4fDest?: IVec4): IVec4;
        clone(sForm: string, v2fDest?: IVec2): IVec2;
        clone(sForm: string, v3fDest?: IVec3): IVec3;
        clone(sForm: string, v4fDest?: IVec4): IVec4;
        copy(sForm: "xx", v2fFrom: IVec2): IVec4;
        copy(sForm: "xx", fValue: number): IVec4;
        copy(sForm: "xy", v2fFrom: IVec2): IVec4;
        copy(sForm: "xy", fValue: number): IVec4;
        copy(sForm: "xz", v2fFrom: IVec2): IVec4;
        copy(sForm: "xz", fValue: number): IVec4;
        copy(sForm: "xw", v2fFrom: IVec2): IVec4;
        copy(sForm: "xw", fValue: number): IVec4;
        copy(sForm: "yx", v2fFrom: IVec2): IVec4;
        copy(sForm: "yx", fValue: number): IVec4;
        copy(sForm: "yy", v2fFrom: IVec2): IVec4;
        copy(sForm: "yy", fValue: number): IVec4;
        copy(sForm: "yz", v2fFrom: IVec2): IVec4;
        copy(sForm: "yz", fValue: number): IVec4;
        copy(sForm: "yw", v2fFrom: IVec2): IVec4;
        copy(sForm: "yw", fValue: number): IVec4;
        copy(sForm: "zx", v2fFrom: IVec2): IVec4;
        copy(sForm: "zx", fValue: number): IVec4;
        copy(sForm: "zy", v2fFrom: IVec2): IVec4;
        copy(sForm: "zy", fValue: number): IVec4;
        copy(sForm: "zz", v2fFrom: IVec2): IVec4;
        copy(sForm: "zz", fValue: number): IVec4;
        copy(sForm: "zw", v2fFrom: IVec2): IVec4;
        copy(sForm: "zw", fValue: number): IVec4;
        copy(sForm: "wx", v2fFrom: IVec2): IVec4;
        copy(sForm: "wx", fValue: number): IVec4;
        copy(sForm: "wy", v2fFrom: IVec2): IVec4;
        copy(sForm: "wy", fValue: number): IVec4;
        copy(sForm: "wz", v2fFrom: IVec2): IVec4;
        copy(sForm: "wz", fValue: number): IVec4;
        copy(sForm: "ww", v2fFrom: IVec2): IVec4;
        copy(sForm: "ww", fValue: number): IVec4;
        copy(sForm: "xxx", v3fFrom: IVec3): IVec4;
        copy(sForm: "xxx", fValue: number): IVec4;
        copy(sForm: "xxy", v3fFrom: IVec3): IVec4;
        copy(sForm: "xxy", fValue: number): IVec4;
        copy(sForm: "xxz", v3fFrom: IVec3): IVec4;
        copy(sForm: "xxz", fValue: number): IVec4;
        copy(sForm: "xxw", v3fFrom: IVec3): IVec4;
        copy(sForm: "xxw", fValue: number): IVec4;
        copy(sForm: "xyx", v3fFrom: IVec3): IVec4;
        copy(sForm: "xyx", fValue: number): IVec4;
        copy(sForm: "xyy", v3fFrom: IVec3): IVec4;
        copy(sForm: "xyy", fValue: number): IVec4;
        copy(sForm: "xyz", v3fFrom: IVec3): IVec4;
        copy(sForm: "xyz", fValue: number): IVec4;
        copy(sForm: "xyw", v3fFrom: IVec3): IVec4;
        copy(sForm: "xyw", fValue: number): IVec4;
        copy(sForm: "xzx", v3fFrom: IVec3): IVec4;
        copy(sForm: "xzx", fValue: number): IVec4;
        copy(sForm: "xzy", v3fFrom: IVec3): IVec4;
        copy(sForm: "xzy", fValue: number): IVec4;
        copy(sForm: "xzz", v3fFrom: IVec3): IVec4;
        copy(sForm: "xzz", fValue: number): IVec4;
        copy(sForm: "xzw", v3fFrom: IVec3): IVec4;
        copy(sForm: "xzw", fValue: number): IVec4;
        copy(sForm: "xwx", v3fFrom: IVec3): IVec4;
        copy(sForm: "xwx", fValue: number): IVec4;
        copy(sForm: "xwy", v3fFrom: IVec3): IVec4;
        copy(sForm: "xwy", fValue: number): IVec4;
        copy(sForm: "xwz", v3fFrom: IVec3): IVec4;
        copy(sForm: "xwz", fValue: number): IVec4;
        copy(sForm: "xww", v3fFrom: IVec3): IVec4;
        copy(sForm: "xww", fValue: number): IVec4;
        copy(sForm: "yxx", v3fFrom: IVec3): IVec4;
        copy(sForm: "yxx", fValue: number): IVec4;
        copy(sForm: "yxy", v3fFrom: IVec3): IVec4;
        copy(sForm: "yxy", fValue: number): IVec4;
        copy(sForm: "yxz", v3fFrom: IVec3): IVec4;
        copy(sForm: "yxz", fValue: number): IVec4;
        copy(sForm: "yxw", v3fFrom: IVec3): IVec4;
        copy(sForm: "yxw", fValue: number): IVec4;
        copy(sForm: "yyx", v3fFrom: IVec3): IVec4;
        copy(sForm: "yyx", fValue: number): IVec4;
        copy(sForm: "yyy", v3fFrom: IVec3): IVec4;
        copy(sForm: "yyy", fValue: number): IVec4;
        copy(sForm: "yyz", v3fFrom: IVec3): IVec4;
        copy(sForm: "yyz", fValue: number): IVec4;
        copy(sForm: "yyw", v3fFrom: IVec3): IVec4;
        copy(sForm: "yyw", fValue: number): IVec4;
        copy(sForm: "yzx", v3fFrom: IVec3): IVec4;
        copy(sForm: "yzx", fValue: number): IVec4;
        copy(sForm: "yzy", v3fFrom: IVec3): IVec4;
        copy(sForm: "yzy", fValue: number): IVec4;
        copy(sForm: "yzz", v3fFrom: IVec3): IVec4;
        copy(sForm: "yzz", fValue: number): IVec4;
        copy(sForm: "yzw", v3fFrom: IVec3): IVec4;
        copy(sForm: "yzw", fValue: number): IVec4;
        copy(sForm: "ywx", v3fFrom: IVec3): IVec4;
        copy(sForm: "ywx", fValue: number): IVec4;
        copy(sForm: "ywy", v3fFrom: IVec3): IVec4;
        copy(sForm: "ywy", fValue: number): IVec4;
        copy(sForm: "ywz", v3fFrom: IVec3): IVec4;
        copy(sForm: "ywz", fValue: number): IVec4;
        copy(sForm: "yww", v3fFrom: IVec3): IVec4;
        copy(sForm: "yww", fValue: number): IVec4;
        copy(sForm: "zxx", v3fFrom: IVec3): IVec4;
        copy(sForm: "zxx", fValue: number): IVec4;
        copy(sForm: "zxy", v3fFrom: IVec3): IVec4;
        copy(sForm: "zxy", fValue: number): IVec4;
        copy(sForm: "zxz", v3fFrom: IVec3): IVec4;
        copy(sForm: "zxz", fValue: number): IVec4;
        copy(sForm: "zxw", v3fFrom: IVec3): IVec4;
        copy(sForm: "zxw", fValue: number): IVec4;
        copy(sForm: "zyx", v3fFrom: IVec3): IVec4;
        copy(sForm: "zyx", fValue: number): IVec4;
        copy(sForm: "zyy", v3fFrom: IVec3): IVec4;
        copy(sForm: "zyy", fValue: number): IVec4;
        copy(sForm: "zyz", v3fFrom: IVec3): IVec4;
        copy(sForm: "zyz", fValue: number): IVec4;
        copy(sForm: "zyw", v3fFrom: IVec3): IVec4;
        copy(sForm: "zyw", fValue: number): IVec4;
        copy(sForm: "zzx", v3fFrom: IVec3): IVec4;
        copy(sForm: "zzx", fValue: number): IVec4;
        copy(sForm: "zzy", v3fFrom: IVec3): IVec4;
        copy(sForm: "zzy", fValue: number): IVec4;
        copy(sForm: "zzz", v3fFrom: IVec3): IVec4;
        copy(sForm: "zzz", fValue: number): IVec4;
        copy(sForm: "zzw", v3fFrom: IVec3): IVec4;
        copy(sForm: "zzw", fValue: number): IVec4;
        copy(sForm: "zwx", v3fFrom: IVec3): IVec4;
        copy(sForm: "zwx", fValue: number): IVec4;
        copy(sForm: "zwy", v3fFrom: IVec3): IVec4;
        copy(sForm: "zwy", fValue: number): IVec4;
        copy(sForm: "zwz", v3fFrom: IVec3): IVec4;
        copy(sForm: "zwz", fValue: number): IVec4;
        copy(sForm: "zww", v3fFrom: IVec3): IVec4;
        copy(sForm: "zww", fValue: number): IVec4;
        copy(sForm: "wxx", v3fFrom: IVec3): IVec4;
        copy(sForm: "wxx", fValue: number): IVec4;
        copy(sForm: "wxy", v3fFrom: IVec3): IVec4;
        copy(sForm: "wxy", fValue: number): IVec4;
        copy(sForm: "wxz", v3fFrom: IVec3): IVec4;
        copy(sForm: "wxz", fValue: number): IVec4;
        copy(sForm: "wxw", v3fFrom: IVec3): IVec4;
        copy(sForm: "wxw", fValue: number): IVec4;
        copy(sForm: "wyx", v3fFrom: IVec3): IVec4;
        copy(sForm: "wyx", fValue: number): IVec4;
        copy(sForm: "wyy", v3fFrom: IVec3): IVec4;
        copy(sForm: "wyy", fValue: number): IVec4;
        copy(sForm: "wyz", v3fFrom: IVec3): IVec4;
        copy(sForm: "wyz", fValue: number): IVec4;
        copy(sForm: "wyw", v3fFrom: IVec3): IVec4;
        copy(sForm: "wyw", fValue: number): IVec4;
        copy(sForm: "wzx", v3fFrom: IVec3): IVec4;
        copy(sForm: "wzx", fValue: number): IVec4;
        copy(sForm: "wzy", v3fFrom: IVec3): IVec4;
        copy(sForm: "wzy", fValue: number): IVec4;
        copy(sForm: "wzz", v3fFrom: IVec3): IVec4;
        copy(sForm: "wzz", fValue: number): IVec4;
        copy(sForm: "wzw", v3fFrom: IVec3): IVec4;
        copy(sForm: "wzw", fValue: number): IVec4;
        copy(sForm: "wwx", v3fFrom: IVec3): IVec4;
        copy(sForm: "wwx", fValue: number): IVec4;
        copy(sForm: "wwy", v3fFrom: IVec3): IVec4;
        copy(sForm: "wwy", fValue: number): IVec4;
        copy(sForm: "wwz", v3fFrom: IVec3): IVec4;
        copy(sForm: "wwz", fValue: number): IVec4;
        copy(sForm: "www", v3fFrom: IVec3): IVec4;
        copy(sForm: "www", fValue: number): IVec4;
        copy(sForm: "xxxx", v4fFrom: IVec4): IVec4;
        copy(sForm: "xxxx", fValue: number): IVec4;
        copy(sForm: "xxxy", v4fFrom: IVec4): IVec4;
        copy(sForm: "xxxy", fValue: number): IVec4;
        copy(sForm: "xxxz", v4fFrom: IVec4): IVec4;
        copy(sForm: "xxxz", fValue: number): IVec4;
        copy(sForm: "xxxw", v4fFrom: IVec4): IVec4;
        copy(sForm: "xxxw", fValue: number): IVec4;
        copy(sForm: "xxyx", v4fFrom: IVec4): IVec4;
        copy(sForm: "xxyx", fValue: number): IVec4;
        copy(sForm: "xxyy", v4fFrom: IVec4): IVec4;
        copy(sForm: "xxyy", fValue: number): IVec4;
        copy(sForm: "xxyz", v4fFrom: IVec4): IVec4;
        copy(sForm: "xxyz", fValue: number): IVec4;
        copy(sForm: "xxyw", v4fFrom: IVec4): IVec4;
        copy(sForm: "xxyw", fValue: number): IVec4;
        copy(sForm: "xxzx", v4fFrom: IVec4): IVec4;
        copy(sForm: "xxzx", fValue: number): IVec4;
        copy(sForm: "xxzy", v4fFrom: IVec4): IVec4;
        copy(sForm: "xxzy", fValue: number): IVec4;
        copy(sForm: "xxzz", v4fFrom: IVec4): IVec4;
        copy(sForm: "xxzz", fValue: number): IVec4;
        copy(sForm: "xxzw", v4fFrom: IVec4): IVec4;
        copy(sForm: "xxzw", fValue: number): IVec4;
        copy(sForm: "xxwx", v4fFrom: IVec4): IVec4;
        copy(sForm: "xxwx", fValue: number): IVec4;
        copy(sForm: "xxwy", v4fFrom: IVec4): IVec4;
        copy(sForm: "xxwy", fValue: number): IVec4;
        copy(sForm: "xxwz", v4fFrom: IVec4): IVec4;
        copy(sForm: "xxwz", fValue: number): IVec4;
        copy(sForm: "xxww", v4fFrom: IVec4): IVec4;
        copy(sForm: "xxww", fValue: number): IVec4;
        copy(sForm: "xyxx", v4fFrom: IVec4): IVec4;
        copy(sForm: "xyxx", fValue: number): IVec4;
        copy(sForm: "xyxy", v4fFrom: IVec4): IVec4;
        copy(sForm: "xyxy", fValue: number): IVec4;
        copy(sForm: "xyxz", v4fFrom: IVec4): IVec4;
        copy(sForm: "xyxz", fValue: number): IVec4;
        copy(sForm: "xyxw", v4fFrom: IVec4): IVec4;
        copy(sForm: "xyxw", fValue: number): IVec4;
        copy(sForm: "xyyx", v4fFrom: IVec4): IVec4;
        copy(sForm: "xyyx", fValue: number): IVec4;
        copy(sForm: "xyyy", v4fFrom: IVec4): IVec4;
        copy(sForm: "xyyy", fValue: number): IVec4;
        copy(sForm: "xyyz", v4fFrom: IVec4): IVec4;
        copy(sForm: "xyyz", fValue: number): IVec4;
        copy(sForm: "xyyw", v4fFrom: IVec4): IVec4;
        copy(sForm: "xyyw", fValue: number): IVec4;
        copy(sForm: "xyzx", v4fFrom: IVec4): IVec4;
        copy(sForm: "xyzx", fValue: number): IVec4;
        copy(sForm: "xyzy", v4fFrom: IVec4): IVec4;
        copy(sForm: "xyzy", fValue: number): IVec4;
        copy(sForm: "xyzz", v4fFrom: IVec4): IVec4;
        copy(sForm: "xyzz", fValue: number): IVec4;
        copy(sForm: "xyzw", v4fFrom: IVec4): IVec4;
        copy(sForm: "xyzw", fValue: number): IVec4;
        copy(sForm: "xywx", v4fFrom: IVec4): IVec4;
        copy(sForm: "xywx", fValue: number): IVec4;
        copy(sForm: "xywy", v4fFrom: IVec4): IVec4;
        copy(sForm: "xywy", fValue: number): IVec4;
        copy(sForm: "xywz", v4fFrom: IVec4): IVec4;
        copy(sForm: "xywz", fValue: number): IVec4;
        copy(sForm: "xyww", v4fFrom: IVec4): IVec4;
        copy(sForm: "xyww", fValue: number): IVec4;
        copy(sForm: "xzxx", v4fFrom: IVec4): IVec4;
        copy(sForm: "xzxx", fValue: number): IVec4;
        copy(sForm: "xzxy", v4fFrom: IVec4): IVec4;
        copy(sForm: "xzxy", fValue: number): IVec4;
        copy(sForm: "xzxz", v4fFrom: IVec4): IVec4;
        copy(sForm: "xzxz", fValue: number): IVec4;
        copy(sForm: "xzxw", v4fFrom: IVec4): IVec4;
        copy(sForm: "xzxw", fValue: number): IVec4;
        copy(sForm: "xzyx", v4fFrom: IVec4): IVec4;
        copy(sForm: "xzyx", fValue: number): IVec4;
        copy(sForm: "xzyy", v4fFrom: IVec4): IVec4;
        copy(sForm: "xzyy", fValue: number): IVec4;
        copy(sForm: "xzyz", v4fFrom: IVec4): IVec4;
        copy(sForm: "xzyz", fValue: number): IVec4;
        copy(sForm: "xzyw", v4fFrom: IVec4): IVec4;
        copy(sForm: "xzyw", fValue: number): IVec4;
        copy(sForm: "xzzx", v4fFrom: IVec4): IVec4;
        copy(sForm: "xzzx", fValue: number): IVec4;
        copy(sForm: "xzzy", v4fFrom: IVec4): IVec4;
        copy(sForm: "xzzy", fValue: number): IVec4;
        copy(sForm: "xzzz", v4fFrom: IVec4): IVec4;
        copy(sForm: "xzzz", fValue: number): IVec4;
        copy(sForm: "xzzw", v4fFrom: IVec4): IVec4;
        copy(sForm: "xzzw", fValue: number): IVec4;
        copy(sForm: "xzwx", v4fFrom: IVec4): IVec4;
        copy(sForm: "xzwx", fValue: number): IVec4;
        copy(sForm: "xzwy", v4fFrom: IVec4): IVec4;
        copy(sForm: "xzwy", fValue: number): IVec4;
        copy(sForm: "xzwz", v4fFrom: IVec4): IVec4;
        copy(sForm: "xzwz", fValue: number): IVec4;
        copy(sForm: "xzww", v4fFrom: IVec4): IVec4;
        copy(sForm: "xzww", fValue: number): IVec4;
        copy(sForm: "xwxx", v4fFrom: IVec4): IVec4;
        copy(sForm: "xwxx", fValue: number): IVec4;
        copy(sForm: "xwxy", v4fFrom: IVec4): IVec4;
        copy(sForm: "xwxy", fValue: number): IVec4;
        copy(sForm: "xwxz", v4fFrom: IVec4): IVec4;
        copy(sForm: "xwxz", fValue: number): IVec4;
        copy(sForm: "xwxw", v4fFrom: IVec4): IVec4;
        copy(sForm: "xwxw", fValue: number): IVec4;
        copy(sForm: "xwyx", v4fFrom: IVec4): IVec4;
        copy(sForm: "xwyx", fValue: number): IVec4;
        copy(sForm: "xwyy", v4fFrom: IVec4): IVec4;
        copy(sForm: "xwyy", fValue: number): IVec4;
        copy(sForm: "xwyz", v4fFrom: IVec4): IVec4;
        copy(sForm: "xwyz", fValue: number): IVec4;
        copy(sForm: "xwyw", v4fFrom: IVec4): IVec4;
        copy(sForm: "xwyw", fValue: number): IVec4;
        copy(sForm: "xwzx", v4fFrom: IVec4): IVec4;
        copy(sForm: "xwzx", fValue: number): IVec4;
        copy(sForm: "xwzy", v4fFrom: IVec4): IVec4;
        copy(sForm: "xwzy", fValue: number): IVec4;
        copy(sForm: "xwzz", v4fFrom: IVec4): IVec4;
        copy(sForm: "xwzz", fValue: number): IVec4;
        copy(sForm: "xwzw", v4fFrom: IVec4): IVec4;
        copy(sForm: "xwzw", fValue: number): IVec4;
        copy(sForm: "xwwx", v4fFrom: IVec4): IVec4;
        copy(sForm: "xwwx", fValue: number): IVec4;
        copy(sForm: "xwwy", v4fFrom: IVec4): IVec4;
        copy(sForm: "xwwy", fValue: number): IVec4;
        copy(sForm: "xwwz", v4fFrom: IVec4): IVec4;
        copy(sForm: "xwwz", fValue: number): IVec4;
        copy(sForm: "xwww", v4fFrom: IVec4): IVec4;
        copy(sForm: "xwww", fValue: number): IVec4;
        copy(sForm: "yxxx", v4fFrom: IVec4): IVec4;
        copy(sForm: "yxxx", fValue: number): IVec4;
        copy(sForm: "yxxy", v4fFrom: IVec4): IVec4;
        copy(sForm: "yxxy", fValue: number): IVec4;
        copy(sForm: "yxxz", v4fFrom: IVec4): IVec4;
        copy(sForm: "yxxz", fValue: number): IVec4;
        copy(sForm: "yxxw", v4fFrom: IVec4): IVec4;
        copy(sForm: "yxxw", fValue: number): IVec4;
        copy(sForm: "yxyx", v4fFrom: IVec4): IVec4;
        copy(sForm: "yxyx", fValue: number): IVec4;
        copy(sForm: "yxyy", v4fFrom: IVec4): IVec4;
        copy(sForm: "yxyy", fValue: number): IVec4;
        copy(sForm: "yxyz", v4fFrom: IVec4): IVec4;
        copy(sForm: "yxyz", fValue: number): IVec4;
        copy(sForm: "yxyw", v4fFrom: IVec4): IVec4;
        copy(sForm: "yxyw", fValue: number): IVec4;
        copy(sForm: "yxzx", v4fFrom: IVec4): IVec4;
        copy(sForm: "yxzx", fValue: number): IVec4;
        copy(sForm: "yxzy", v4fFrom: IVec4): IVec4;
        copy(sForm: "yxzy", fValue: number): IVec4;
        copy(sForm: "yxzz", v4fFrom: IVec4): IVec4;
        copy(sForm: "yxzz", fValue: number): IVec4;
        copy(sForm: "yxzw", v4fFrom: IVec4): IVec4;
        copy(sForm: "yxzw", fValue: number): IVec4;
        copy(sForm: "yxwx", v4fFrom: IVec4): IVec4;
        copy(sForm: "yxwx", fValue: number): IVec4;
        copy(sForm: "yxwy", v4fFrom: IVec4): IVec4;
        copy(sForm: "yxwy", fValue: number): IVec4;
        copy(sForm: "yxwz", v4fFrom: IVec4): IVec4;
        copy(sForm: "yxwz", fValue: number): IVec4;
        copy(sForm: "yxww", v4fFrom: IVec4): IVec4;
        copy(sForm: "yxww", fValue: number): IVec4;
        copy(sForm: "yyxx", v4fFrom: IVec4): IVec4;
        copy(sForm: "yyxx", fValue: number): IVec4;
        copy(sForm: "yyxy", v4fFrom: IVec4): IVec4;
        copy(sForm: "yyxy", fValue: number): IVec4;
        copy(sForm: "yyxz", v4fFrom: IVec4): IVec4;
        copy(sForm: "yyxz", fValue: number): IVec4;
        copy(sForm: "yyxw", v4fFrom: IVec4): IVec4;
        copy(sForm: "yyxw", fValue: number): IVec4;
        copy(sForm: "yyyx", v4fFrom: IVec4): IVec4;
        copy(sForm: "yyyx", fValue: number): IVec4;
        copy(sForm: "yyyy", v4fFrom: IVec4): IVec4;
        copy(sForm: "yyyy", fValue: number): IVec4;
        copy(sForm: "yyyz", v4fFrom: IVec4): IVec4;
        copy(sForm: "yyyz", fValue: number): IVec4;
        copy(sForm: "yyyw", v4fFrom: IVec4): IVec4;
        copy(sForm: "yyyw", fValue: number): IVec4;
        copy(sForm: "yyzx", v4fFrom: IVec4): IVec4;
        copy(sForm: "yyzx", fValue: number): IVec4;
        copy(sForm: "yyzy", v4fFrom: IVec4): IVec4;
        copy(sForm: "yyzy", fValue: number): IVec4;
        copy(sForm: "yyzz", v4fFrom: IVec4): IVec4;
        copy(sForm: "yyzz", fValue: number): IVec4;
        copy(sForm: "yyzw", v4fFrom: IVec4): IVec4;
        copy(sForm: "yyzw", fValue: number): IVec4;
        copy(sForm: "yywx", v4fFrom: IVec4): IVec4;
        copy(sForm: "yywx", fValue: number): IVec4;
        copy(sForm: "yywy", v4fFrom: IVec4): IVec4;
        copy(sForm: "yywy", fValue: number): IVec4;
        copy(sForm: "yywz", v4fFrom: IVec4): IVec4;
        copy(sForm: "yywz", fValue: number): IVec4;
        copy(sForm: "yyww", v4fFrom: IVec4): IVec4;
        copy(sForm: "yyww", fValue: number): IVec4;
        copy(sForm: "yzxx", v4fFrom: IVec4): IVec4;
        copy(sForm: "yzxx", fValue: number): IVec4;
        copy(sForm: "yzxy", v4fFrom: IVec4): IVec4;
        copy(sForm: "yzxy", fValue: number): IVec4;
        copy(sForm: "yzxz", v4fFrom: IVec4): IVec4;
        copy(sForm: "yzxz", fValue: number): IVec4;
        copy(sForm: "yzxw", v4fFrom: IVec4): IVec4;
        copy(sForm: "yzxw", fValue: number): IVec4;
        copy(sForm: "yzyx", v4fFrom: IVec4): IVec4;
        copy(sForm: "yzyx", fValue: number): IVec4;
        copy(sForm: "yzyy", v4fFrom: IVec4): IVec4;
        copy(sForm: "yzyy", fValue: number): IVec4;
        copy(sForm: "yzyz", v4fFrom: IVec4): IVec4;
        copy(sForm: "yzyz", fValue: number): IVec4;
        copy(sForm: "yzyw", v4fFrom: IVec4): IVec4;
        copy(sForm: "yzyw", fValue: number): IVec4;
        copy(sForm: "yzzx", v4fFrom: IVec4): IVec4;
        copy(sForm: "yzzx", fValue: number): IVec4;
        copy(sForm: "yzzy", v4fFrom: IVec4): IVec4;
        copy(sForm: "yzzy", fValue: number): IVec4;
        copy(sForm: "yzzz", v4fFrom: IVec4): IVec4;
        copy(sForm: "yzzz", fValue: number): IVec4;
        copy(sForm: "yzzw", v4fFrom: IVec4): IVec4;
        copy(sForm: "yzzw", fValue: number): IVec4;
        copy(sForm: "yzwx", v4fFrom: IVec4): IVec4;
        copy(sForm: "yzwx", fValue: number): IVec4;
        copy(sForm: "yzwy", v4fFrom: IVec4): IVec4;
        copy(sForm: "yzwy", fValue: number): IVec4;
        copy(sForm: "yzwz", v4fFrom: IVec4): IVec4;
        copy(sForm: "yzwz", fValue: number): IVec4;
        copy(sForm: "yzww", v4fFrom: IVec4): IVec4;
        copy(sForm: "yzww", fValue: number): IVec4;
        copy(sForm: "ywxx", v4fFrom: IVec4): IVec4;
        copy(sForm: "ywxx", fValue: number): IVec4;
        copy(sForm: "ywxy", v4fFrom: IVec4): IVec4;
        copy(sForm: "ywxy", fValue: number): IVec4;
        copy(sForm: "ywxz", v4fFrom: IVec4): IVec4;
        copy(sForm: "ywxz", fValue: number): IVec4;
        copy(sForm: "ywxw", v4fFrom: IVec4): IVec4;
        copy(sForm: "ywxw", fValue: number): IVec4;
        copy(sForm: "ywyx", v4fFrom: IVec4): IVec4;
        copy(sForm: "ywyx", fValue: number): IVec4;
        copy(sForm: "ywyy", v4fFrom: IVec4): IVec4;
        copy(sForm: "ywyy", fValue: number): IVec4;
        copy(sForm: "ywyz", v4fFrom: IVec4): IVec4;
        copy(sForm: "ywyz", fValue: number): IVec4;
        copy(sForm: "ywyw", v4fFrom: IVec4): IVec4;
        copy(sForm: "ywyw", fValue: number): IVec4;
        copy(sForm: "ywzx", v4fFrom: IVec4): IVec4;
        copy(sForm: "ywzx", fValue: number): IVec4;
        copy(sForm: "ywzy", v4fFrom: IVec4): IVec4;
        copy(sForm: "ywzy", fValue: number): IVec4;
        copy(sForm: "ywzz", v4fFrom: IVec4): IVec4;
        copy(sForm: "ywzz", fValue: number): IVec4;
        copy(sForm: "ywzw", v4fFrom: IVec4): IVec4;
        copy(sForm: "ywzw", fValue: number): IVec4;
        copy(sForm: "ywwx", v4fFrom: IVec4): IVec4;
        copy(sForm: "ywwx", fValue: number): IVec4;
        copy(sForm: "ywwy", v4fFrom: IVec4): IVec4;
        copy(sForm: "ywwy", fValue: number): IVec4;
        copy(sForm: "ywwz", v4fFrom: IVec4): IVec4;
        copy(sForm: "ywwz", fValue: number): IVec4;
        copy(sForm: "ywww", v4fFrom: IVec4): IVec4;
        copy(sForm: "ywww", fValue: number): IVec4;
        copy(sForm: "zxxx", v4fFrom: IVec4): IVec4;
        copy(sForm: "zxxx", fValue: number): IVec4;
        copy(sForm: "zxxy", v4fFrom: IVec4): IVec4;
        copy(sForm: "zxxy", fValue: number): IVec4;
        copy(sForm: "zxxz", v4fFrom: IVec4): IVec4;
        copy(sForm: "zxxz", fValue: number): IVec4;
        copy(sForm: "zxxw", v4fFrom: IVec4): IVec4;
        copy(sForm: "zxxw", fValue: number): IVec4;
        copy(sForm: "zxyx", v4fFrom: IVec4): IVec4;
        copy(sForm: "zxyx", fValue: number): IVec4;
        copy(sForm: "zxyy", v4fFrom: IVec4): IVec4;
        copy(sForm: "zxyy", fValue: number): IVec4;
        copy(sForm: "zxyz", v4fFrom: IVec4): IVec4;
        copy(sForm: "zxyz", fValue: number): IVec4;
        copy(sForm: "zxyw", v4fFrom: IVec4): IVec4;
        copy(sForm: "zxyw", fValue: number): IVec4;
        copy(sForm: "zxzx", v4fFrom: IVec4): IVec4;
        copy(sForm: "zxzx", fValue: number): IVec4;
        copy(sForm: "zxzy", v4fFrom: IVec4): IVec4;
        copy(sForm: "zxzy", fValue: number): IVec4;
        copy(sForm: "zxzz", v4fFrom: IVec4): IVec4;
        copy(sForm: "zxzz", fValue: number): IVec4;
        copy(sForm: "zxzw", v4fFrom: IVec4): IVec4;
        copy(sForm: "zxzw", fValue: number): IVec4;
        copy(sForm: "zxwx", v4fFrom: IVec4): IVec4;
        copy(sForm: "zxwx", fValue: number): IVec4;
        copy(sForm: "zxwy", v4fFrom: IVec4): IVec4;
        copy(sForm: "zxwy", fValue: number): IVec4;
        copy(sForm: "zxwz", v4fFrom: IVec4): IVec4;
        copy(sForm: "zxwz", fValue: number): IVec4;
        copy(sForm: "zxww", v4fFrom: IVec4): IVec4;
        copy(sForm: "zxww", fValue: number): IVec4;
        copy(sForm: "zyxx", v4fFrom: IVec4): IVec4;
        copy(sForm: "zyxx", fValue: number): IVec4;
        copy(sForm: "zyxy", v4fFrom: IVec4): IVec4;
        copy(sForm: "zyxy", fValue: number): IVec4;
        copy(sForm: "zyxz", v4fFrom: IVec4): IVec4;
        copy(sForm: "zyxz", fValue: number): IVec4;
        copy(sForm: "zyxw", v4fFrom: IVec4): IVec4;
        copy(sForm: "zyxw", fValue: number): IVec4;
        copy(sForm: "zyyx", v4fFrom: IVec4): IVec4;
        copy(sForm: "zyyx", fValue: number): IVec4;
        copy(sForm: "zyyy", v4fFrom: IVec4): IVec4;
        copy(sForm: "zyyy", fValue: number): IVec4;
        copy(sForm: "zyyz", v4fFrom: IVec4): IVec4;
        copy(sForm: "zyyz", fValue: number): IVec4;
        copy(sForm: "zyyw", v4fFrom: IVec4): IVec4;
        copy(sForm: "zyyw", fValue: number): IVec4;
        copy(sForm: "zyzx", v4fFrom: IVec4): IVec4;
        copy(sForm: "zyzx", fValue: number): IVec4;
        copy(sForm: "zyzy", v4fFrom: IVec4): IVec4;
        copy(sForm: "zyzy", fValue: number): IVec4;
        copy(sForm: "zyzz", v4fFrom: IVec4): IVec4;
        copy(sForm: "zyzz", fValue: number): IVec4;
        copy(sForm: "zyzw", v4fFrom: IVec4): IVec4;
        copy(sForm: "zyzw", fValue: number): IVec4;
        copy(sForm: "zywx", v4fFrom: IVec4): IVec4;
        copy(sForm: "zywx", fValue: number): IVec4;
        copy(sForm: "zywy", v4fFrom: IVec4): IVec4;
        copy(sForm: "zywy", fValue: number): IVec4;
        copy(sForm: "zywz", v4fFrom: IVec4): IVec4;
        copy(sForm: "zywz", fValue: number): IVec4;
        copy(sForm: "zyww", v4fFrom: IVec4): IVec4;
        copy(sForm: "zyww", fValue: number): IVec4;
        copy(sForm: "zzxx", v4fFrom: IVec4): IVec4;
        copy(sForm: "zzxx", fValue: number): IVec4;
        copy(sForm: "zzxy", v4fFrom: IVec4): IVec4;
        copy(sForm: "zzxy", fValue: number): IVec4;
        copy(sForm: "zzxz", v4fFrom: IVec4): IVec4;
        copy(sForm: "zzxz", fValue: number): IVec4;
        copy(sForm: "zzxw", v4fFrom: IVec4): IVec4;
        copy(sForm: "zzxw", fValue: number): IVec4;
        copy(sForm: "zzyx", v4fFrom: IVec4): IVec4;
        copy(sForm: "zzyx", fValue: number): IVec4;
        copy(sForm: "zzyy", v4fFrom: IVec4): IVec4;
        copy(sForm: "zzyy", fValue: number): IVec4;
        copy(sForm: "zzyz", v4fFrom: IVec4): IVec4;
        copy(sForm: "zzyz", fValue: number): IVec4;
        copy(sForm: "zzyw", v4fFrom: IVec4): IVec4;
        copy(sForm: "zzyw", fValue: number): IVec4;
        copy(sForm: "zzzx", v4fFrom: IVec4): IVec4;
        copy(sForm: "zzzx", fValue: number): IVec4;
        copy(sForm: "zzzy", v4fFrom: IVec4): IVec4;
        copy(sForm: "zzzy", fValue: number): IVec4;
        copy(sForm: "zzzz", v4fFrom: IVec4): IVec4;
        copy(sForm: "zzzz", fValue: number): IVec4;
        copy(sForm: "zzzw", v4fFrom: IVec4): IVec4;
        copy(sForm: "zzzw", fValue: number): IVec4;
        copy(sForm: "zzwx", v4fFrom: IVec4): IVec4;
        copy(sForm: "zzwx", fValue: number): IVec4;
        copy(sForm: "zzwy", v4fFrom: IVec4): IVec4;
        copy(sForm: "zzwy", fValue: number): IVec4;
        copy(sForm: "zzwz", v4fFrom: IVec4): IVec4;
        copy(sForm: "zzwz", fValue: number): IVec4;
        copy(sForm: "zzww", v4fFrom: IVec4): IVec4;
        copy(sForm: "zzww", fValue: number): IVec4;
        copy(sForm: "zwxx", v4fFrom: IVec4): IVec4;
        copy(sForm: "zwxx", fValue: number): IVec4;
        copy(sForm: "zwxy", v4fFrom: IVec4): IVec4;
        copy(sForm: "zwxy", fValue: number): IVec4;
        copy(sForm: "zwxz", v4fFrom: IVec4): IVec4;
        copy(sForm: "zwxz", fValue: number): IVec4;
        copy(sForm: "zwxw", v4fFrom: IVec4): IVec4;
        copy(sForm: "zwxw", fValue: number): IVec4;
        copy(sForm: "zwyx", v4fFrom: IVec4): IVec4;
        copy(sForm: "zwyx", fValue: number): IVec4;
        copy(sForm: "zwyy", v4fFrom: IVec4): IVec4;
        copy(sForm: "zwyy", fValue: number): IVec4;
        copy(sForm: "zwyz", v4fFrom: IVec4): IVec4;
        copy(sForm: "zwyz", fValue: number): IVec4;
        copy(sForm: "zwyw", v4fFrom: IVec4): IVec4;
        copy(sForm: "zwyw", fValue: number): IVec4;
        copy(sForm: "zwzx", v4fFrom: IVec4): IVec4;
        copy(sForm: "zwzx", fValue: number): IVec4;
        copy(sForm: "zwzy", v4fFrom: IVec4): IVec4;
        copy(sForm: "zwzy", fValue: number): IVec4;
        copy(sForm: "zwzz", v4fFrom: IVec4): IVec4;
        copy(sForm: "zwzz", fValue: number): IVec4;
        copy(sForm: "zwzw", v4fFrom: IVec4): IVec4;
        copy(sForm: "zwzw", fValue: number): IVec4;
        copy(sForm: "zwwx", v4fFrom: IVec4): IVec4;
        copy(sForm: "zwwx", fValue: number): IVec4;
        copy(sForm: "zwwy", v4fFrom: IVec4): IVec4;
        copy(sForm: "zwwy", fValue: number): IVec4;
        copy(sForm: "zwwz", v4fFrom: IVec4): IVec4;
        copy(sForm: "zwwz", fValue: number): IVec4;
        copy(sForm: "zwww", v4fFrom: IVec4): IVec4;
        copy(sForm: "zwww", fValue: number): IVec4;
        copy(sForm: "wxxx", v4fFrom: IVec4): IVec4;
        copy(sForm: "wxxx", fValue: number): IVec4;
        copy(sForm: "wxxy", v4fFrom: IVec4): IVec4;
        copy(sForm: "wxxy", fValue: number): IVec4;
        copy(sForm: "wxxz", v4fFrom: IVec4): IVec4;
        copy(sForm: "wxxz", fValue: number): IVec4;
        copy(sForm: "wxxw", v4fFrom: IVec4): IVec4;
        copy(sForm: "wxxw", fValue: number): IVec4;
        copy(sForm: "wxyx", v4fFrom: IVec4): IVec4;
        copy(sForm: "wxyx", fValue: number): IVec4;
        copy(sForm: "wxyy", v4fFrom: IVec4): IVec4;
        copy(sForm: "wxyy", fValue: number): IVec4;
        copy(sForm: "wxyz", v4fFrom: IVec4): IVec4;
        copy(sForm: "wxyz", fValue: number): IVec4;
        copy(sForm: "wxyw", v4fFrom: IVec4): IVec4;
        copy(sForm: "wxyw", fValue: number): IVec4;
        copy(sForm: "wxzx", v4fFrom: IVec4): IVec4;
        copy(sForm: "wxzx", fValue: number): IVec4;
        copy(sForm: "wxzy", v4fFrom: IVec4): IVec4;
        copy(sForm: "wxzy", fValue: number): IVec4;
        copy(sForm: "wxzz", v4fFrom: IVec4): IVec4;
        copy(sForm: "wxzz", fValue: number): IVec4;
        copy(sForm: "wxzw", v4fFrom: IVec4): IVec4;
        copy(sForm: "wxzw", fValue: number): IVec4;
        copy(sForm: "wxwx", v4fFrom: IVec4): IVec4;
        copy(sForm: "wxwx", fValue: number): IVec4;
        copy(sForm: "wxwy", v4fFrom: IVec4): IVec4;
        copy(sForm: "wxwy", fValue: number): IVec4;
        copy(sForm: "wxwz", v4fFrom: IVec4): IVec4;
        copy(sForm: "wxwz", fValue: number): IVec4;
        copy(sForm: "wxww", v4fFrom: IVec4): IVec4;
        copy(sForm: "wxww", fValue: number): IVec4;
        copy(sForm: "wyxx", v4fFrom: IVec4): IVec4;
        copy(sForm: "wyxx", fValue: number): IVec4;
        copy(sForm: "wyxy", v4fFrom: IVec4): IVec4;
        copy(sForm: "wyxy", fValue: number): IVec4;
        copy(sForm: "wyxz", v4fFrom: IVec4): IVec4;
        copy(sForm: "wyxz", fValue: number): IVec4;
        copy(sForm: "wyxw", v4fFrom: IVec4): IVec4;
        copy(sForm: "wyxw", fValue: number): IVec4;
        copy(sForm: "wyyx", v4fFrom: IVec4): IVec4;
        copy(sForm: "wyyx", fValue: number): IVec4;
        copy(sForm: "wyyy", v4fFrom: IVec4): IVec4;
        copy(sForm: "wyyy", fValue: number): IVec4;
        copy(sForm: "wyyz", v4fFrom: IVec4): IVec4;
        copy(sForm: "wyyz", fValue: number): IVec4;
        copy(sForm: "wyyw", v4fFrom: IVec4): IVec4;
        copy(sForm: "wyyw", fValue: number): IVec4;
        copy(sForm: "wyzx", v4fFrom: IVec4): IVec4;
        copy(sForm: "wyzx", fValue: number): IVec4;
        copy(sForm: "wyzy", v4fFrom: IVec4): IVec4;
        copy(sForm: "wyzy", fValue: number): IVec4;
        copy(sForm: "wyzz", v4fFrom: IVec4): IVec4;
        copy(sForm: "wyzz", fValue: number): IVec4;
        copy(sForm: "wyzw", v4fFrom: IVec4): IVec4;
        copy(sForm: "wyzw", fValue: number): IVec4;
        copy(sForm: "wywx", v4fFrom: IVec4): IVec4;
        copy(sForm: "wywx", fValue: number): IVec4;
        copy(sForm: "wywy", v4fFrom: IVec4): IVec4;
        copy(sForm: "wywy", fValue: number): IVec4;
        copy(sForm: "wywz", v4fFrom: IVec4): IVec4;
        copy(sForm: "wywz", fValue: number): IVec4;
        copy(sForm: "wyww", v4fFrom: IVec4): IVec4;
        copy(sForm: "wyww", fValue: number): IVec4;
        copy(sForm: "wzxx", v4fFrom: IVec4): IVec4;
        copy(sForm: "wzxx", fValue: number): IVec4;
        copy(sForm: "wzxy", v4fFrom: IVec4): IVec4;
        copy(sForm: "wzxy", fValue: number): IVec4;
        copy(sForm: "wzxz", v4fFrom: IVec4): IVec4;
        copy(sForm: "wzxz", fValue: number): IVec4;
        copy(sForm: "wzxw", v4fFrom: IVec4): IVec4;
        copy(sForm: "wzxw", fValue: number): IVec4;
        copy(sForm: "wzyx", v4fFrom: IVec4): IVec4;
        copy(sForm: "wzyx", fValue: number): IVec4;
        copy(sForm: "wzyy", v4fFrom: IVec4): IVec4;
        copy(sForm: "wzyy", fValue: number): IVec4;
        copy(sForm: "wzyz", v4fFrom: IVec4): IVec4;
        copy(sForm: "wzyz", fValue: number): IVec4;
        copy(sForm: "wzyw", v4fFrom: IVec4): IVec4;
        copy(sForm: "wzyw", fValue: number): IVec4;
        copy(sForm: "wzzx", v4fFrom: IVec4): IVec4;
        copy(sForm: "wzzx", fValue: number): IVec4;
        copy(sForm: "wzzy", v4fFrom: IVec4): IVec4;
        copy(sForm: "wzzy", fValue: number): IVec4;
        copy(sForm: "wzzz", v4fFrom: IVec4): IVec4;
        copy(sForm: "wzzz", fValue: number): IVec4;
        copy(sForm: "wzzw", v4fFrom: IVec4): IVec4;
        copy(sForm: "wzzw", fValue: number): IVec4;
        copy(sForm: "wzwx", v4fFrom: IVec4): IVec4;
        copy(sForm: "wzwx", fValue: number): IVec4;
        copy(sForm: "wzwy", v4fFrom: IVec4): IVec4;
        copy(sForm: "wzwy", fValue: number): IVec4;
        copy(sForm: "wzwz", v4fFrom: IVec4): IVec4;
        copy(sForm: "wzwz", fValue: number): IVec4;
        copy(sForm: "wzww", v4fFrom: IVec4): IVec4;
        copy(sForm: "wzww", fValue: number): IVec4;
        copy(sForm: "wwxx", v4fFrom: IVec4): IVec4;
        copy(sForm: "wwxx", fValue: number): IVec4;
        copy(sForm: "wwxy", v4fFrom: IVec4): IVec4;
        copy(sForm: "wwxy", fValue: number): IVec4;
        copy(sForm: "wwxz", v4fFrom: IVec4): IVec4;
        copy(sForm: "wwxz", fValue: number): IVec4;
        copy(sForm: "wwxw", v4fFrom: IVec4): IVec4;
        copy(sForm: "wwxw", fValue: number): IVec4;
        copy(sForm: "wwyx", v4fFrom: IVec4): IVec4;
        copy(sForm: "wwyx", fValue: number): IVec4;
        copy(sForm: "wwyy", v4fFrom: IVec4): IVec4;
        copy(sForm: "wwyy", fValue: number): IVec4;
        copy(sForm: "wwyz", v4fFrom: IVec4): IVec4;
        copy(sForm: "wwyz", fValue: number): IVec4;
        copy(sForm: "wwyw", v4fFrom: IVec4): IVec4;
        copy(sForm: "wwyw", fValue: number): IVec4;
        copy(sForm: "wwzx", v4fFrom: IVec4): IVec4;
        copy(sForm: "wwzx", fValue: number): IVec4;
        copy(sForm: "wwzy", v4fFrom: IVec4): IVec4;
        copy(sForm: "wwzy", fValue: number): IVec4;
        copy(sForm: "wwzz", v4fFrom: IVec4): IVec4;
        copy(sForm: "wwzz", fValue: number): IVec4;
        copy(sForm: "wwzw", v4fFrom: IVec4): IVec4;
        copy(sForm: "wwzw", fValue: number): IVec4;
        copy(sForm: "wwwx", v4fFrom: IVec4): IVec4;
        copy(sForm: "wwwx", fValue: number): IVec4;
        copy(sForm: "wwwy", v4fFrom: IVec4): IVec4;
        copy(sForm: "wwwy", fValue: number): IVec4;
        copy(sForm: "wwwz", v4fFrom: IVec4): IVec4;
        copy(sForm: "wwwz", fValue: number): IVec4;
        copy(sForm: "wwww", v4fFrom: IVec4): IVec4;
        copy(sForm: "wwww", fValue: number): IVec4;
        copy(sForm: string, fValue: number): IVec4;
        copy(sForm: string, v2fFrom: IVec2): IVec4;
        copy(sForm: string, v3fFrom: IVec3): IVec4;
        copy(sForm: string, v4fFrom: IVec4): IVec4;
    }
}
declare module akra {
    interface IQuat4Constructor {
        (): any;
        (q4fQuat: IQuat4): any;
        (pArray: number[]): any;
        (fValue: number, fW: number): any;
        (v3fValue: IVec3, fW: number): any;
        (fX: number, fY: number, fZ: number, fW: number): any;
    }
    interface IQuat4 {
        x: number;
        y: number;
        z: number;
        w: number;
        set(): IQuat4;
        set(q4fQuat: IQuat4): IQuat4;
        set(pArray: number[]): IQuat4;
        set(fValue: number, fW: number): IQuat4;
        set(v3fValue: IVec3, fW: number): IQuat4;
        set(fX: number, fY: number, fZ: number, fW: number): IQuat4;
        multiply(q4fQuat: IQuat4, q4fDestination?: IQuat4): IQuat4;
        multiplyVec3(v3fVec: IVec3, v3fDestination?: IVec3): IVec3;
        conjugate(q4fDestination?: IQuat4): IQuat4;
        inverse(q4fDestination?: IQuat4): IQuat4;
        length(): number;
        normalize(q4fDestination?: IQuat4): IQuat4;
        calculateW(q4fDestination?: IQuat4): IQuat4;
        isEqual(q4fQuat: IQuat4, fEps?: number, asMatrix?: boolean): boolean;
        getYaw(): number;
        getPitch(): number;
        getRoll(): number;
        toYawPitchRoll(v3fDestination?: IVec3): IVec3;
        toMat3(m3fDestination?: IMat3): IMat3;
        toMat4(m4fDestination?: IMat4): IMat4;
        toString(): string;
        mix(q4fQuat: IQuat4, fA: number, q4fDestination?: IQuat4, bShortestPath?: boolean): any;
        smix(q4fQuat: IQuat4, fA: number, q4fDestination?: IQuat4, bShortestPath?: boolean): any;
    }
}
declare module akra {
    interface IMat3Constructor {
        (): any;
        (fValue: number): any;
        (v3fVec: IVec3): any;
        (m3fMat: IMat3): any;
        (m4fMat: IMat4): any;
        (pArray: number[]): any;
        (fValue1: number, fValue2: number, fValue3: number): any;
        (v3fVec1: IVec3, v3fVec2: IVec3, v3fVec3: IVec3): any;
        (pArray1: number[], pArray2: number[], pArray3: number[]): any;
        (fValue1: number, fValue2: number, fValue3: number, fValue4: number, fValue5: number, fValue6: number, fValue7: number, fValue8: number, fValue9: number): any;
    }
    interface IMat3 {
        data: Float32Array;
        set(): IMat3;
        set(fValue: number): IMat3;
        set(v3fVec: IVec3): IMat3;
        set(m3fMat: IMat3): IMat3;
        set(m4fMat: IMat4): IMat3;
        set(pArray: number[]): IMat3;
        set(fValue1: number, fValue2: number, fValue3: number): IMat3;
        set(v3fVec1: IVec3, v3fVec2: IVec3, v3fVec3: IVec3): IMat3;
        set(pArray1: number[], pArray2: number[], pArray3: number[]): IMat3;
        set(fValue1: number, fValue2: number, fValue3: number, fValue4: number, fValue5: number, fValue6: number, fValue7: number, fValue8: number, fValue9: number): IMat3;
        identity(): IMat3;
        add(m3fMat: IMat3, m3fDestination?: IMat3): IMat3;
        subtract(m3fMat: IMat3, m3fDestination?: IMat3): IMat3;
        multiply(m3fMat: IMat3, m3fDestination?: IMat3): IMat3;
        multiplyVec3(v3fVec: IVec3, v3fDestination?: IVec3): IVec3;
        transpose(m3fDestination?: IMat3): IMat3;
        determinant(): number;
        inverse(m3fDestination?: IMat3): IMat3;
        isEqual(m3fMat: IMat3, fEps?: number): boolean;
        isDiagonal(fEps?: number): boolean;
        toMat4(m4fDestination?: IMat4): IMat4;
        toQuat4(q4fDestination?: IQuat4): IQuat4;
        toString(): string;
        decompose(q4fRotation: IQuat4, v3fScale: IVec3): boolean;
        row(iRow: number, v3fDestination?: IVec3): IVec3;
        column(iColumn: number, v3fDestination?: IVec3): IVec3;
    }
}
declare module akra {
    interface IMat4Constructor {
        (): any;
        (fValue: number): any;
        (v4fVec: IVec4): any;
        (m4fMat: IMat4): any;
        (pArray: number[]): any;
        (m3fMat: IMat3, v3fTranslation?: IVec3): any;
        (pArray: Float32Array, bFlag: boolean): any;
        (fValue1: number, fValue2: number, fValue3: number, fValue4: number): any;
        (v4fVec1: IVec4, v4fVec2: IVec4, v4fVec3: IVec4, v4fVec4: IVec4): any;
        (pArray1: number[], pArray2: number[], pArray3: number[], pArray4: number[]): any;
        (fValue1: number, fValue2: number, fValue3: number, fValue4: number, fValue5: number, fValue6: number, fValue7: number, fValue8: number, fValue9: number, fValue10: number, fValue11: number, fValue12: number, fValue13: number, fValue14: number, fValue15: number, fValue16: number): any;
    }
    interface IMat4 {
        data: Float32Array;
        set(): IMat4;
        set(fValue: number): IMat4;
        set(v4fVec: IVec4): IMat4;
        set(m3fMat: IMat3, v3fTranslation?: IVec3): IMat4;
        set(m4fMat: IMat4): IMat4;
        set(pArray: number[]): IMat4;
        set(fValue1: number, fValue2: number, fValue3: number, fValue4: number): IMat4;
        set(v4fVec1: IVec4, v4fVec2: IVec4, v4fVec3: IVec4, v4fVec4: IVec4): IMat4;
        set(pArray1: number[], pArray2: number[], pArray3: number[], pArray4: number[]): IMat4;
        set(fValue1: number, fValue2: number, fValue3: number, fValue4: number, fValue5: number, fValue6: number, fValue7: number, fValue8: number, fValue9: number, fValue10: number, fValue11: number, fValue12: number, fValue13: number, fValue14: number, fValue15: number, fValue16: number): IMat4;
        identity(): IMat4;
        add(m4fMat: IMat4, m4fDestination?: IMat4): IMat4;
        subtract(m4fMat: IMat4, m4fDestination?: IMat4): IMat4;
        multiply(m4fMat: IMat4, m4fDestination?: IMat4): IMat4;
        multiplyLeft(m4fMat: IMat4, m4fDestination?: IMat4): IMat4;
        multiplyVec4(v4fVec: IVec4, v4fDestination?: IVec4): IVec4;
        /**
        * @copydoc Mat4::multiplyNumber()
        */
        multiplyNumber(fValue: number, m4fDestination?: IMat4): IMat4;
        transpose(m4fDestination?: IMat4): IMat4;
        determinant(): number;
        inverse(m4fDestination?: IMat4): IMat4;
        trace(): number;
        isEqual(m4fMat: IMat4, fEps?: number): boolean;
        isDiagonal(fEps?: number): boolean;
        toMat3(m3fDestination?: IMat3): IMat3;
        toQuat4(q4fDestination?: IQuat4): IQuat4;
        toRotationMatrix(m4fDestination?: IMat4): IMat4;
        toString(): string;
        toArray(pDest?: number[]): number[];
        rotateRight(fAngle: number, v3fAxis: IVec3, m4fDestination?: IMat4): IMat4;
        rotateLeft(fAngle: number, v3fAxis: IVec3, m4fDestination?: IMat4): IMat4;
        setTranslation(v3fTranslation: IVec3): IMat4;
        getTranslation(v3fTranslation?: IVec3): IVec3;
        translateRight(v3fTranslation: IVec3, m4fDestination?: IMat4): IMat4;
        translateLeft(v3fTranslation: IVec3, m4fDestination?: IMat4): IMat4;
        scaleRight(fScale: number, m4fDestination?: IMat4): IMat4;
        scaleRight(v3fScale: IVec3, m4fDestination?: IMat4): IMat4;
        scaleLeft(fScale: number, m4fDestination?: IMat4): IMat4;
        scaleLeft(v3fScale: IVec3, m4fDestination?: IMat4): IMat4;
        decompose(q4fRotation: IQuat4, v3fScale: IVec3, v3fTranslation: IVec3): boolean;
        row(iRow: number, v4fDestination?: IVec4): IVec4;
        column(iColumn: number, v4fDestination?: IVec4): IVec4;
        unproj(v3fScreen: IVec3, v4fDestination?: IVec4): IVec4;
        unproj(v4fScreen: IVec4, v4fDestination?: IVec4): IVec4;
        unprojZ(fZ: number): number;
        /**
        * use only this projection matrix otherwise result doesn't have any sense
        */
        isOrthogonalProjection(): boolean;
    }
}
declare module akra {
    interface IVec3Constructor {
        (): any;
        (fValue: number): any;
        (v3fVec: IVec3): any;
        (pArray: number[]): any;
        (fValue: number, v2fVec: IVec2): any;
        (v2fVec: IVec2, fValue: number): any;
        (fValue1: number, fValue2: number, fValue3: number): any;
    }
    interface IVec3 {
        x: number;
        y: number;
        z: number;
        set(): IVec3;
        set(fValue: number): IVec3;
        set(v3fVec: IVec3): IVec3;
        set(pArray: number[]): IVec3;
        set(fValue: number, v2fVec: IVec2): IVec3;
        set(v2fVec: IVec2, fValue: number): IVec3;
        set(fValue1: number, fValue2: number, fValue3: number): IVec3;
        clear(): IVec3;
        add(v3fVec: IVec3, v3fDestination?: IVec3): IVec3;
        subtract(v3fVec: IVec3, v3fDestination?: IVec3): IVec3;
        dot(v3fVec: IVec3): number;
        cross(v3fVec: IVec3, v3fDestination?: IVec3): IVec3;
        isEqual(v3fVec: IVec3, fEps?: number): boolean;
        isClear(fEps?: number): boolean;
        negate(v3fDestination?: IVec3): IVec3;
        scale(fScale: number, v3fDestination?: IVec3): IVec3;
        scale(v3fScale: IVec3, v3fDestination?: IVec3): IVec3;
        normalize(v3fDestination?: IVec3): IVec3;
        length(): number;
        lengthSquare(): number;
        direction(v3fVec: IVec3, v3fDestination?: IVec3): IVec3;
        mix(v3fVec: IVec3, fA: number, v3fDestination?: IVec3): IVec3;
        toString(): string;
        toArray(): number[];
        toTranslationMatrix(m4fDestination?: IMat4): any;
        vec3TransformCoord(m4fTransformation: IMat4, v3fDestination?: IVec3): IVec3;
        clone(sForm: "xx", v2fDest?: IVec2): IVec2;
        clone(sForm: "xy", v2fDest?: IVec2): IVec2;
        clone(sForm: "xz", v2fDest?: IVec2): IVec2;
        clone(sForm: "yx", v2fDest?: IVec2): IVec2;
        clone(sForm: "yy", v2fDest?: IVec2): IVec2;
        clone(sForm: "yz", v2fDest?: IVec2): IVec2;
        clone(sForm: "zx", v2fDest?: IVec2): IVec2;
        clone(sForm: "zy", v2fDest?: IVec2): IVec2;
        clone(sForm: "zz", v2fDest?: IVec2): IVec2;
        clone(sForm: "xxx", v3fDest?: IVec3): IVec3;
        clone(sForm: "xxy", v3fDest?: IVec3): IVec3;
        clone(sForm: "xxz", v3fDest?: IVec3): IVec3;
        clone(sForm: "xyx", v3fDest?: IVec3): IVec3;
        clone(sForm: "xyy", v3fDest?: IVec3): IVec3;
        clone(sForm: "xyz", v3fDest?: IVec3): IVec3;
        clone(sForm: "xzx", v3fDest?: IVec3): IVec3;
        clone(sForm: "xzy", v3fDest?: IVec3): IVec3;
        clone(sForm: "xzz", v3fDest?: IVec3): IVec3;
        clone(sForm: "yxx", v3fDest?: IVec3): IVec3;
        clone(sForm: "yxy", v3fDest?: IVec3): IVec3;
        clone(sForm: "yxz", v3fDest?: IVec3): IVec3;
        clone(sForm: "yyx", v3fDest?: IVec3): IVec3;
        clone(sForm: "yyy", v3fDest?: IVec3): IVec3;
        clone(sForm: "yyz", v3fDest?: IVec3): IVec3;
        clone(sForm: "yzx", v3fDest?: IVec3): IVec3;
        clone(sForm: "yzy", v3fDest?: IVec3): IVec3;
        clone(sForm: "yzz", v3fDest?: IVec3): IVec3;
        clone(sForm: "zxx", v3fDest?: IVec3): IVec3;
        clone(sForm: "zxy", v3fDest?: IVec3): IVec3;
        clone(sForm: "zxz", v3fDest?: IVec3): IVec3;
        clone(sForm: "zyx", v3fDest?: IVec3): IVec3;
        clone(sForm: "zyy", v3fDest?: IVec3): IVec3;
        clone(sForm: "zyz", v3fDest?: IVec3): IVec3;
        clone(sForm: "zzx", v3fDest?: IVec3): IVec3;
        clone(sForm: "zzy", v3fDest?: IVec3): IVec3;
        clone(sForm: "zzz", v3fDest?: IVec3): IVec3;
        clone(sForm: string, v2fDest?: IVec2): IVec2;
        clone(sForm: string, v3fDest?: IVec3): IVec3;
        copy(sForm: "xx", v2fFrom: IVec2): IVec3;
        copy(sForm: "xx", fValue: number): IVec3;
        copy(sForm: "xy", v2fFrom: IVec2): IVec3;
        copy(sForm: "xy", fValue: number): IVec3;
        copy(sForm: "xz", v2fFrom: IVec2): IVec3;
        copy(sForm: "xz", fValue: number): IVec3;
        copy(sForm: "yx", v2fFrom: IVec2): IVec3;
        copy(sForm: "yx", fValue: number): IVec3;
        copy(sForm: "yy", v2fFrom: IVec2): IVec3;
        copy(sForm: "yy", fValue: number): IVec3;
        copy(sForm: "yz", v2fFrom: IVec2): IVec3;
        copy(sForm: "yz", fValue: number): IVec3;
        copy(sForm: "zx", v2fFrom: IVec2): IVec3;
        copy(sForm: "zx", fValue: number): IVec3;
        copy(sForm: "zy", v2fFrom: IVec2): IVec3;
        copy(sForm: "zy", fValue: number): IVec3;
        copy(sForm: "zz", v2fFrom: IVec2): IVec3;
        copy(sForm: "zz", fValue: number): IVec3;
        copy(sForm: "xxx", v3fFrom: IVec3): IVec3;
        copy(sForm: "xxx", fValue: number): IVec3;
        copy(sForm: "xxy", v3fFrom: IVec3): IVec3;
        copy(sForm: "xxy", fValue: number): IVec3;
        copy(sForm: "xxz", v3fFrom: IVec3): IVec3;
        copy(sForm: "xxz", fValue: number): IVec3;
        copy(sForm: "xyx", v3fFrom: IVec3): IVec3;
        copy(sForm: "xyx", fValue: number): IVec3;
        copy(sForm: "xyy", v3fFrom: IVec3): IVec3;
        copy(sForm: "xyy", fValue: number): IVec3;
        copy(sForm: "xyz", v3fFrom: IVec3): IVec3;
        copy(sForm: "xyz", fValue: number): IVec3;
        copy(sForm: "xzx", v3fFrom: IVec3): IVec3;
        copy(sForm: "xzx", fValue: number): IVec3;
        copy(sForm: "xzy", v3fFrom: IVec3): IVec3;
        copy(sForm: "xzy", fValue: number): IVec3;
        copy(sForm: "xzz", v3fFrom: IVec3): IVec3;
        copy(sForm: "xzz", fValue: number): IVec3;
        copy(sForm: "yxx", v3fFrom: IVec3): IVec3;
        copy(sForm: "yxx", fValue: number): IVec3;
        copy(sForm: "yxy", v3fFrom: IVec3): IVec3;
        copy(sForm: "yxy", fValue: number): IVec3;
        copy(sForm: "yxz", v3fFrom: IVec3): IVec3;
        copy(sForm: "yxz", fValue: number): IVec3;
        copy(sForm: "yyx", v3fFrom: IVec3): IVec3;
        copy(sForm: "yyx", fValue: number): IVec3;
        copy(sForm: "yyy", v3fFrom: IVec3): IVec3;
        copy(sForm: "yyy", fValue: number): IVec3;
        copy(sForm: "yyz", v3fFrom: IVec3): IVec3;
        copy(sForm: "yyz", fValue: number): IVec3;
        copy(sForm: "yzx", v3fFrom: IVec3): IVec3;
        copy(sForm: "yzx", fValue: number): IVec3;
        copy(sForm: "yzy", v3fFrom: IVec3): IVec3;
        copy(sForm: "yzy", fValue: number): IVec3;
        copy(sForm: "yzz", v3fFrom: IVec3): IVec3;
        copy(sForm: "yzz", fValue: number): IVec3;
        copy(sForm: "zxx", v3fFrom: IVec3): IVec3;
        copy(sForm: "zxx", fValue: number): IVec3;
        copy(sForm: "zxy", v3fFrom: IVec3): IVec3;
        copy(sForm: "zxy", fValue: number): IVec3;
        copy(sForm: "zxz", v3fFrom: IVec3): IVec3;
        copy(sForm: "zxz", fValue: number): IVec3;
        copy(sForm: "zyx", v3fFrom: IVec3): IVec3;
        copy(sForm: "zyx", fValue: number): IVec3;
        copy(sForm: "zyy", v3fFrom: IVec3): IVec3;
        copy(sForm: "zyy", fValue: number): IVec3;
        copy(sForm: "zyz", v3fFrom: IVec3): IVec3;
        copy(sForm: "zyz", fValue: number): IVec3;
        copy(sForm: "zzx", v3fFrom: IVec3): IVec3;
        copy(sForm: "zzx", fValue: number): IVec3;
        copy(sForm: "zzy", v3fFrom: IVec3): IVec3;
        copy(sForm: "zzy", fValue: number): IVec3;
        copy(sForm: "zzz", v3fFrom: IVec3): IVec3;
        copy(sForm: "zzz", fValue: number): IVec3;
        copy(sForm: string, fValue: number): IVec3;
        copy(sForm: string, v2fFrom: IVec2): IVec3;
        copy(sForm: string, v3fFrom: IVec3): IVec3;
    }
}
declare module akra {
    enum ENodeInheritance {
        NONE = 0,
        POSITION = 1,
        ROTSCALE = 2,
        ROTPOSITION = 3,
        ALL = 4,
    }
    interface INode extends IEntity {
        getLocalOrientation(): IQuat4;
        setLocalOrientation(qOrient: IQuat4): INode;
        getLocalPosition(): IVec3;
        setLocalPosition(v3fPosition: IVec3): INode;
        getLocalScale(): IVec3;
        setLocalScale(v3fScale: IVec3): INode;
        getLocalMatrix(): IMat4;
        setLocalMatrix(m4fLocal: IMat4): INode;
        getWorldMatrix(): IMat4;
        getWorldPosition(): IVec3;
        getWorldOrientation(): IQuat4;
        getWorldScale(): IVec3;
        getInverseWorldMatrix(): IMat4;
        getNormalMatrix(): IMat3;
        getVectorUp(): IVec3;
        getVectorRight(): IVec3;
        getVectorForward(): IVec3;
        getTempVectorUp(): IVec3;
        getTempVectorRight(): IVec3;
        getTempVectorForward(): IVec3;
        create(): boolean;
        setInheritance(eInheritance: ENodeInheritance): any;
        getInheritance(): ENodeInheritance;
        isWorldMatrixNew(): boolean;
        isLocalMatrixNew(): boolean;
        setWorldPosition(v3fPosition: IVec3): INode;
        setWorldPosition(fX: number, fY: number, fZ: number): INode;
        setPosition(v3fPosition: IVec3): INode;
        setPosition(fX: number, fY: number, fZ: number): INode;
        setRelPosition(v3fPosition: IVec3): INode;
        setRelPosition(fX: number, fY: number, fZ: number): INode;
        addPosition(v3fPosition: IVec3): INode;
        addPosition(fX: number, fY: number, fZ: number): INode;
        addRelPosition(v3fPosition: IVec3): INode;
        addRelPosition(fX: number, fY: number, fZ: number): INode;
        setRotationByMatrix(m3fRotation: IMat3): INode;
        setRotationByMatrix(m4fRotation: IMat4): INode;
        setRotationByAxisAngle(v3fAxis: IVec3, fAngle: number): INode;
        setRotationByForwardUp(v3fForward: IVec3, v3fUp: IVec3): INode;
        setRotationByEulerAngles(fYaw: number, fPitch: number, fRoll: number): INode;
        setRotationByXYZAxis(fX: number, fY: number, fZ: number): INode;
        setRotation(q4fRotation: IQuat4): INode;
        addRelRotationByMatrix(m4fRotation: IMat4): INode;
        addRelRotationByMatrix(m3fRotation: IMat3): INode;
        addRelRotationByAxisAngle(v3fAxis: IVec3, fAngle: number): INode;
        addRelRotationByForwardUp(v3fForward: IVec3, v3fUp: IVec3): INode;
        addRelRotationByEulerAngles(fYaw: number, fPitch: number, fRoll: number): INode;
        addRelRotationByXYZAxis(fX: number, fY: number, fZ: number): INode;
        addRelRotation(q4fRotation: IQuat4): INode;
        addRotationByMatrix(m4fRotation: IMat4): INode;
        addRotationByMatrix(m3fRotation: IMat3): INode;
        addRotationByAxisAngle(v3fAxis: IVec3, fAngle: number): INode;
        addRotationByForwardUp(v3fForward: IVec3, v3fUp: IVec3): INode;
        addRotationByEulerAngles(fYaw: number, fPitch: number, fRoll: number): INode;
        addRotationByXYZAxis(fX: number, fY: number, fZ: number): INode;
        addRotation(q4fRotation: IQuat4): INode;
        addOrbitRotationByMatrix(m4fRotation: IMat4): INode;
        addOrbitRotationByMatrix(m3fRotation: IMat3): INode;
        addOrbitRotationByAxisAngle(v3fAxis: IVec3, fAngle: number): INode;
        addOrbitRotationByForwardUp(v3fForward: IVec3, v3fUp: IVec3): INode;
        addOrbitRotationByEulerAngles(fYaw: number, fPitch: number, fRoll: number): INode;
        addOrbitRotationByXYZAxis(fX: number, fY: number, fZ: number): INode;
        addOrbitRotation(q4fRotation: IQuat4): INode;
        scale(fScale: number): INode;
        scale(v3fScale: IVec3): INode;
        scale(fX: number, fY: number, fZ: number): INode;
        lookAt(v3fFrom: IVec3, v3fCenter: IVec3, v3fUp?: IVec3): any;
        lookAt(v3fCenter: IVec3, v3fUp?: IVec3): any;
    }
}
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
declare module akra {
    interface IJoint extends ISceneNode {
        getBoneName(): string;
        setBoneName(sName: string): void;
        create(): boolean;
    }
}
declare module akra {
    enum EAnimationInterpolations {
        LINEAR = 0,
        SPHERICAL = 1,
    }
    interface IFrame {
        type: EAnimationInterpolations;
        /** readonly */ 
        time: number;
        /** readonly */ 
        weight: number;
        reset(): IFrame;
        set(pFrame: IFrame): IFrame;
        add(pFrame: IFrame, isFirst: boolean): IFrame;
        mult(fScalar: number): IFrame;
        normilize(): IFrame;
        interpolate(pStartFrame: IFrame, pEndFrame: IFrame, fBlend: number): IFrame;
    }
}
declare module akra {
    interface IPositionFrame extends IFrame {
        /** readonly */ 
        rotation: IQuat4;
        /** readonly */ 
        scale: IVec3;
        /** readonly */ 
        translation: IVec3;
        toMatrix(): IMat4;
    }
}
declare module akra {
    interface IAnimationParameter {
        getTotalFrames(): number;
        getDuration(): number;
        getFirst(): number;
        /** Get keyframe by number */
        getKeyFrame(iFrame: number): IFrame;
        /** Set keyframe */
        keyFrame(pFrame: IFrame): boolean;
        /** Find keyframe by time */
        findKeyFrame(fTime: number): number;
        /** Calculate frame by time */
        frame(fTime: number): IFrame;
    }
}
declare module akra {
    interface IJointMap {
        [index: string]: IJoint;
    }
    interface ISkeleton {
        getTotalBones(): number;
        getTotalNodes(): number;
        getName(): string;
        getRoot(): IJoint;
        getRootJoint(): IJoint;
        getRootJoints(): IJoint[];
        getJointMap(): IJointMap;
        getNodeList(): ISceneNode[];
        addRootJoint(pJoint: IJoint): boolean;
        update(): boolean;
        findJoint(sName: string): IJoint;
        findJointByName(sName: string): IJoint;
        attachMesh(pMesh: IMesh): boolean;
        detachMesh(): void;
    }
}
declare module akra {
    interface IAnimationTrack extends IAnimationParameter {
        getTargetName(): string;
        setTargetName(sName: string): void;
        getTarget(): ISceneNode;
        keyFrame(pFrame: IPositionFrame): boolean;
        keyFrame(fTime: number, pMatrix: IMat4): boolean;
        bind(sJoint: string, pSkeleton: ISkeleton): any;
        bind(pSkeleton: ISkeleton): any;
        bind(pNode: ISceneNode): any;
    }
}
declare module akra {
    interface IAnimationTarget {
        target: ISceneNode;
        index: number;
        name: string;
        track?: IAnimationTrack;
    }
    enum EAnimationTypes {
        ANIMATION = 0,
        LIST = 1,
        CLIP = 2,
        CONTAINER = 3,
        BLEND = 4,
    }
    interface IAnimationBase extends IEventProvider {
        getDuration(): number;
        setDuration(fDuration: number): void;
        getName(): string;
        setName(sName: string): void;
        getType(): EAnimationTypes;
        getFirst(): number;
        extra: any;
        play(fRealTime: number): void;
        stop(fRealTime: number): void;
        isAttached(): boolean;
        attach(pTarget: ISceneNode): void;
        frame(sName: string, fRealTime: number): IPositionFrame;
        apply(fRealTime: number): boolean;
        addTarget(sName: string, pTarget: ISceneNode): IAnimationTarget;
        setTarget(sName: string, pTarget: ISceneNode): IAnimationTarget;
        getTarget(sTargetName: string): IAnimationTarget;
        getTargetByName(sName: string): IAnimationTarget;
        getTargetList(): IAnimationTarget[];
        targetNames(): string[];
        targetList(): ISceneNode[];
        jointList(): IJoint[];
        grab(pAnimationBase: IAnimationBase, bRewrite?: boolean): void;
        createAnimationMask(): IMap<number>;
        played: ISignal<(pBase: IAnimationBase, fRealTime: number) => void>;
        stoped: ISignal<(pBase: IAnimationBase, fRealTime: number) => void>;
        renamed: ISignal<(pBase: IAnimationBase, sName: number) => void>;
    }
}
declare module akra {
    interface IAnimationController extends IEventProvider {
        name: string;
        getTotalAnimations(): number;
        getActive(): IAnimationBase;
        getTarget(): ISceneNode;
        getEngine(): IEngine;
        setOptions(eOptions: any): void;
        addAnimation(pAnimation: IAnimationBase): boolean;
        removeAnimation(pAnimation: string): boolean;
        removeAnimation(pAnimation: number): boolean;
        removeAnimation(pAnimation: IAnimationBase): boolean;
        findAnimation(pAnimation: string): IAnimationBase;
        findAnimation(pAnimation: number): IAnimationBase;
        findAnimation(pAnimation: IAnimationBase): IAnimationBase;
        getAnimation(iAnim: number): IAnimationBase;
        setAnimation(iAnimation: number, pAnimation: IAnimationBase): void;
        attach(pTarget: ISceneNode): void;
        _setActiveAnimation(pAnimation: IAnimationBase): void;
        animationAdded: ISignal<(pController: IAnimationController, pAnimation: IAnimationBase) => void>;
        play: ISignal<(pController: IAnimationController, pAnimation: IAnimationBase, fRealTime: number) => void>;
        stop(): void;
        update(): void;
        toString(bFullInfo?: boolean): any;
    }
}
declare module akra {
    enum ESceneNodeFlags {
        FROZEN_PARENT = 0,
        FROZEN_SELF = 1,
        HIDDEN_PARENT = 2,
        HIDDEN_SELF = 3,
    }
    interface ISceneNode extends INode {
        getScene(): IScene3d;
        getTotalControllers(): number;
        getController(i?: number): IAnimationController;
        addController(pController: IAnimationController): void;
        isFrozen(): boolean;
        isSelfFrozen(): boolean;
        isParentFrozen(): boolean;
        freeze(value?: boolean): void;
        isHidden(): boolean;
        hide(value?: boolean): void;
        frozen: ISignal<(pNode: ISceneNode, bValue: boolean) => void>;
        hidden: ISignal<(pNode: ISceneNode, bValue: boolean) => void>;
    }
}
declare module akra {
    /** User events. */
    enum EUserEvents {
        CLICK = 1,
        MOUSEMOVE = 2,
        MOUSEDOWN = 4,
        MOUSEUP = 8,
        MOUSEOVER = 16,
        MOUSEOUT = 32,
        DRAGSTART = 64,
        DRAGSTOP = 128,
        DRAGGING = 256,
        MOUSEWHEEL = 512,
        ANY = 1023,
    }
    /** Object that can receive user events. */
    interface IControllable {
        /**
        * @param iType Flags of events,
        *	like: akra.EUserEvents.CLICK | akraEUserEvents.MOUSEWHEEL
        *
        * @return Activated events.
        */
        enableSupportForUserEvent(iType: number): number;
        /** @return TRUE if event supported for this object. */
        isUserEventSupported(iEvents: number): boolean;
        isUserEventSupported(eType: EUserEvents): boolean;
    }
}
declare module akra {
    interface IPoint {
        x: number;
        y: number;
    }
}
declare module akra {
    interface IOffset {
        x: number;
        y: number;
    }
}
declare module akra {
    enum EKeyCodes {
        BACKSPACE = 8,
        TAB = 9,
        ENTER = 13,
        SHIFT = 16,
        CTRL = 17,
        ALT = 18,
        PAUSE = 19,
        BREAK = 19,
        CAPSLOCK = 20,
        ESCAPE = 27,
        SPACE = 32,
        PAGEUP = 33,
        PAGEDOWN = 34,
        END = 35,
        HOME = 36,
        LEFT = 37,
        UP = 38,
        RIGHT = 39,
        DOWN = 40,
        INSERT = 45,
        DELETE = 46,
        N0 = 48,
        N1 = 49,
        N2 = 50,
        N3 = 51,
        N4 = 52,
        N5 = 53,
        N6 = 54,
        N7 = 55,
        N8 = 56,
        N9 = 57,
        A = 65,
        B = 66,
        C = 67,
        D = 68,
        E = 69,
        F = 70,
        G = 71,
        H = 72,
        I = 73,
        J = 74,
        K = 75,
        L = 76,
        M = 77,
        N = 78,
        O = 79,
        P = 80,
        Q = 81,
        R = 82,
        S = 83,
        T = 84,
        U = 85,
        V = 86,
        W = 87,
        X = 88,
        Y = 89,
        Z = 90,
        LEFTWINDOWKEY = 91,
        RIGHTWINDOWKEY = 92,
        SELECTKEY = 93,
        NUMPAD0 = 96,
        NUMPAD1 = 97,
        NUMPAD2 = 98,
        NUMPAD3 = 99,
        NUMPAD4 = 100,
        NUMPAD5 = 101,
        NUMPAD6 = 102,
        NUMPAD7 = 103,
        NUMPAD8 = 104,
        NUMPAD9 = 105,
        MULTIPLY = 106,
        ADD = 107,
        SUBTRACT = 109,
        DECIMALPOINT = 110,
        DIVIDE = 111,
        F1 = 112,
        F2 = 113,
        F3 = 114,
        F4 = 115,
        F5 = 116,
        F6 = 117,
        F7 = 118,
        F8 = 119,
        F9 = 120,
        F10 = 121,
        F11 = 122,
        F12 = 123,
        NUMLOCK = 144,
        SCROLLLOCK = 145,
        SEMICOLON = 186,
        EQUALSIGN = 187,
        COMMA = 188,
        DASH = 189,
        PERIOD = 190,
        FORWARDSLASH = 191,
        GRAVEACCENT = 192,
        OPENBRACKET = 219,
        BACKSLASH = 220,
        CLOSEBRACKET = 221,
        SINGLEQUOTE = 222,
        TOTAL = 256,
    }
    enum EMouseButton {
        UNKNOWN = 0,
        LEFT = 1,
        MIDDLE = 2,
        RIGHT = 3,
    }
    interface IKeyMap {
        isKeyPress(iCode: number): any;
        isKeyPress(eCode: EKeyCodes): any;
        getMouse(): IPoint;
        getMouseShift(): IOffset;
        isMouseMoved(): boolean;
        isMousePress(): boolean;
        bind(sCombination: string, fn: Function): boolean;
        captureMouse(pMouseTarget: Node): void;
        captureMouse(pMouseTarget: Document): void;
        captureKeyboard(pKeyboardTarget: Node): void;
        captureKeyboard(pKeyboardTarget: Document): void;
        capture(pTarget: Node): void;
        capture(pTarget: Document): void;
        update(): void;
    }
}
declare module akra {
    interface IClickable extends IEventProvider {
        dragstart: ISignal<any>;
        dragstop: ISignal<any>;
        dragging: ISignal<any>;
        click: ISignal<any>;
        mousemove: ISignal<any>;
        mousedown: ISignal<any>;
        mouseup: ISignal<any>;
        mouseover: ISignal<any>;
        mouseout: ISignal<any>;
        mousewheel: ISignal<any>;
    }
}
declare module akra {
    interface ICircle {
        radius: number;
        center: IVec2;
        set(): ICircle;
        set(pCircle: ICircle): ICircle;
        set(v2fCenter: IVec2, fRadius: number): ICircle;
        set(fCenterX: number, fCenterY: number, fRadius: number): ICircle;
        clear(): ICircle;
        isEqual(pCircle: ICircle): boolean;
        isClear(): boolean;
        isValid(): boolean;
        offset(v2fOffset: IVec2): ICircle;
        expand(fInc: number): ICircle;
        normalize(): ICircle;
    }
}
declare module akra {
    interface IRect2d {
        x0: number;
        x1: number;
        y0: number;
        y1: number;
        getLeft(): number;
        getTop(): number;
        getWidth(): number;
        getHeight(): number;
        set(): IRect2d;
        set(pRect: IRect2d): IRect2d;
        set(v2fVec: IVec2): IRect2d;
        set(fSizeX: number, fSizeY: number): IRect2d;
        set(v2fMinPoint: IVec2, v2fMaxPoint: IVec2): IRect2d;
        set(fX0: number, fX1: number, fY0: number, fY1: number): IRect2d;
        setFloor(pRect: IRect2d): IRect2d;
        setCeil(pRect: IRect2d): IRect2d;
        clear(): IRect2d;
        addSelf(fValue: number): IRect2d;
        addSelf(v2fVec: IVec2): IRect2d;
        subSelf(fValue: number): IRect2d;
        subSelf(v2fVec: IVec2): IRect2d;
        multSelf(fValue: number): IRect2d;
        multSelf(v2fVec: IVec2): IRect2d;
        divSelf(fValue: number): IRect2d;
        divSelf(v2fVec: IVec2): IRect2d;
        offset(v2fOffset: IVec2): IRect2d;
        offset(fOffsetX: number, fOffsetY: number): IRect2d;
        expand(fValue: number): IRect2d;
        expand(v2fValue: IVec2): IRect2d;
        expand(fValueX: number, fValueY: number): IRect2d;
        expandX(fValue: number): IRect2d;
        expandY(fValue: number): IRect2d;
        resize(v2fSize: IVec2): IRect2d;
        resize(fSizeX: number, fSizeY: number): IRect2d;
        resizeX(fSize: number): IRect2d;
        resizeY(fSize: number): IRect2d;
        resizeMax(v2fSpan: IVec2): IRect2d;
        resizeMax(fSpanX: number, fSpanY: number): IRect2d;
        resizeMaxX(fSpan: number): IRect2d;
        resizeMaxY(fSpan: number): IRect2d;
        resizeMin(v2fSpan: IVec2): IRect2d;
        resizeMin(fSpanX: number, fSpanY: number): IRect2d;
        resizeMinX(fSpan: number): IRect2d;
        resizeMinY(fSpan: number): IRect2d;
        unionPoint(v2fPoint: IVec2): IRect2d;
        unionPoint(fX: number, fY: number): IRect2d;
        unionRect(pRect: IRect2d): IRect2d;
        negate(pDestination?: IRect2d): IRect2d;
        normalize(): IRect2d;
        isEqual(pRect: IRect2d): boolean;
        isClear(): boolean;
        isValid(): boolean;
        isPointInRect(v2fPoint: IVec2): boolean;
        midPoint(v2fDestination?: IVec2): IVec2;
        midX(): number;
        midY(): number;
        size(v2fDestination?: IVec2): IVec2;
        sizeX(): number;
        sizeY(): number;
        minPoint(v2fDestination?: IVec2): IVec2;
        maxPoint(v2fDestination?: IVec2): IVec2;
        area(): number;
        corner(iIndex: number, v2fDestination?: IVec2): IVec2;
        createBoundingCircle(pCircle?: ICircle): ICircle;
        distanceToPoint(v2fPoint: IVec2): number;
        toString(): string;
    }
}
declare module akra {
    interface IRect3d {
        x0: number;
        x1: number;
        y0: number;
        y1: number;
        z0: number;
        z1: number;
        getRect2d(): IRect2d;
        setRect2d(pRect: IRect2d): void;
        set(): IRect3d;
        set(pRect: IRect3d): IRect3d;
        set(v3fSize: IVec3): IRect3d;
        set(fSizeX: number, fSizeY: number, fSizeZ: number): IRect3d;
        set(v3fMinPoint: IVec3, v3fMaxPoint: IVec3): IRect3d;
        set(fX0: number, fX1: number, fY0: number, fY1: number, fZ0: number, fZ1: number): IRect3d;
        setFloor(pRect: IRect3d): IRect3d;
        setCeil(pRect: IRect3d): IRect3d;
        clear(): IRect3d;
        addSelf(fValue: number): IRect3d;
        addSelf(v3fVec: IVec3): IRect3d;
        subSelf(fValue: number): IRect3d;
        subSelf(v3fVec: IVec3): IRect3d;
        multSelf(fValue: number): IRect3d;
        multSelf(v3fVec: IVec3): IRect3d;
        divSelf(fValue: number): IRect3d;
        divSelf(v3fVec: IVec3): IRect3d;
        offset(v3fOffset: IVec3): IRect3d;
        offset(fOffsetX: number, fOffsetY: number, fOffsetZ: number): IRect3d;
        expand(fValue: number): IRect3d;
        expand(v3fVec: IVec3): IRect3d;
        expand(fValueX: number, fValueY: number, fValueZ: number): IRect3d;
        expandX(fValue: number): IRect3d;
        expandY(fValue: number): IRect3d;
        expandZ(fValue: number): IRect3d;
        resize(v3fSize: IVec3): IRect3d;
        resize(fSizeX: number, fSizeY: number, fSizeZ: number): IRect3d;
        resizeX(fSize: number): IRect3d;
        resizeY(fSize: number): IRect3d;
        resizeZ(fSize: number): IRect3d;
        resizeMax(v3fSpan: IVec3): IRect3d;
        resizeMax(fSpanX: number, fSpanY: number, fSpanZ: number): IRect3d;
        resizeMaxX(fSpan: number): IRect3d;
        resizeMaxY(fSpan: number): IRect3d;
        resizeMaxZ(fSpan: number): IRect3d;
        resizeMin(v3fSpan: IVec3): IRect3d;
        resizeMin(fSpanX: number, fSpanY: number, fSpanZ: number): IRect3d;
        resizeMinX(fSpan: number): IRect3d;
        resizeMinY(fSpan: number): IRect3d;
        resizeMinZ(fSpan: number): IRect3d;
        unionPoint(v3fPoint: IVec3): IRect3d;
        unionPoint(fX: number, fY: number, fZ: number): IRect3d;
        unionRect(pRect: IRect3d): IRect3d;
        negate(pDestination?: IRect3d): IRect3d;
        normalize(): IRect3d;
        transform(m4fMatrix: IMat4): IRect3d;
        isEqual(pRect: IRect3d): boolean;
        isClear(): boolean;
        isValid(): boolean;
        isPointInRect(v3fPoint: IVec3): boolean;
        midPoint(v3fDestination?: IVec3): IVec3;
        midX(): number;
        midY(): number;
        midZ(): number;
        size(v3fDestination: IVec3): IVec3;
        sizeX(): number;
        sizeY(): number;
        sizeZ(): number;
        minPoint(v3fDestination?: IVec3): IVec3;
        maxPoint(v3fDestination?: IVec3): IVec3;
        volume(): number;
        corner(iIndex: number, v3fDestination?: IVec3): IVec3;
        createBoundingSphere(pSphere?: ISphere): ISphere;
        distanceToPoint(v3fPoint: IVec3): number;
        toString(): string;
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
        addToken(pToken: IToken): void;
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
        _addPunctuator(sValue: string, sName?: string): string;
        _addKeyword(sValue: string, sName: string): string;
        _getTerminalValueByName(sName: string): string;
        _init(sSource: string): void;
        _getNextToken(): IToken;
        _getIndex(): number;
        _setSource(sSource: string): void;
        _setIndex(iIndex: number): void;
    }
    interface IParserState {
        source: string;
        index: number;
        fileName: string;
        tree: IParseTree;
        types: IMap<boolean>;
        stack: number[];
        token: IToken;
        fnCallback: IFinishFunc;
        caller: any;
    }
    interface IParser {
        isTypeId(sValue: string): boolean;
        returnCode(pNode: IParseNode): string;
        init(sGrammar: string, eMode?: EParseMode, eType?: EParserType): boolean;
        defaultInit(): void;
        parse(sSource: string, fnFinishCallback?: IFinishFunc, pCaller?: any): EParserCode;
        setParseFileName(sFileName: string): void;
        getParseFileName(): string;
        pause(): EParserCode;
        resume(): EParserCode;
        getSyntaxTree(): IParseTree;
        printStates(isPrintOnlyBase?: boolean): void;
        printState(iStateIndex: number, isPrintOnlyBase?: boolean): void;
        getGrammarSymbols(): IMap<string>;
        _saveState(): IParserState;
        _loadState(pState: IParserState): void;
    }
}
declare module akra {
    enum ERenderStateValues {
        UNDEF = 0,
        TRUE = 1,
        FALSE = 2,
        ZERO = 3,
        ONE = 4,
        SRCCOLOR = 5,
        INVSRCCOLOR = 6,
        SRCALPHA = 7,
        INVSRCALPHA = 8,
        DESTALPHA = 9,
        INVDESTALPHA = 10,
        DESTCOLOR = 11,
        INVDESTCOLOR = 12,
        SRCALPHASAT = 13,
        NONE = 14,
        CW = 15,
        CCW = 16,
        FRONT = 17,
        BACK = 18,
        FRONT_AND_BACK = 19,
        NEVER = 20,
        LESS = 21,
        EQUAL = 22,
        LESSEQUAL = 23,
        GREATER = 24,
        NOTEQUAL = 25,
        GREATEREQUAL = 26,
        ALWAYS = 27,
        FUNCADD = 28,
        FUNCSUBTRACT = 29,
        FUNCREVERSESUBTRACT = 30,
    }
}
declare module akra {
    enum EAFXInstructionTypes {
        k_Instruction = 0,
        k_InstructionCollector = 1,
        k_SimpleInstruction = 2,
        k_VariableTypeInstruction = 3,
        k_SystemTypeInstruction = 4,
        k_ComplexTypeInstruction = 5,
        k_TypedInstruction = 6,
        k_DeclInstruction = 7,
        k_IntInstruction = 8,
        k_FloatInstruction = 9,
        k_BoolInstruction = 10,
        k_StringInstruction = 11,
        k_IdInstruction = 12,
        k_KeywordInstruction = 13,
        k_TypeDeclInstruction = 14,
        k_VariableDeclInstruction = 15,
        k_AnnotationInstruction = 16,
        k_UsageTypeInstruction = 17,
        k_BaseTypeInstruction = 18,
        k_StructDeclInstruction = 19,
        k_StructFieldsInstruction = 20,
        k_ExprInstruction = 21,
        k_IdExprInstruction = 22,
        k_ArithmeticExprInstruction = 23,
        k_AssignmentExprInstruction = 24,
        k_RelationalExprInstruction = 25,
        k_LogicalExprInstruction = 26,
        k_ConditionalExprInstruction = 27,
        k_CastExprInstruction = 28,
        k_UnaryExprInstruction = 29,
        k_PostfixIndexInstruction = 30,
        k_PostfixPointInstruction = 31,
        k_PostfixArithmeticInstruction = 32,
        k_PrimaryExprInstruction = 33,
        k_ComplexExprInstruction = 34,
        k_FunctionCallInstruction = 35,
        k_SystemCallInstruction = 36,
        k_ConstructorCallInstruction = 37,
        k_CompileExprInstruction = 38,
        k_InitExprInstruction = 39,
        k_SamplerStateBlockInstruction = 40,
        k_SamplerStateInstruction = 41,
        k_ExtractExprInstruction = 42,
        k_MemExprInstruction = 43,
        k_FunctionDeclInstruction = 44,
        k_ShaderFunctionInstruction = 45,
        k_SystemFunctionInstruction = 46,
        k_FunctionDefInstruction = 47,
        k_StmtInstruction = 48,
        k_StmtBlockInstruction = 49,
        k_ExprStmtInstruction = 50,
        k_BreakStmtInstruction = 51,
        k_WhileStmtInstruction = 52,
        k_ForStmtInstruction = 53,
        k_IfStmtInstruction = 54,
        k_DeclStmtInstruction = 55,
        k_ReturnStmtInstruction = 56,
        k_ExtractStmtInstruction = 57,
        k_SemicolonStmtInstruction = 58,
        k_PassInstruction = 59,
        k_TechniqueInstruction = 60,
    }
    enum EFunctionType {
        k_Vertex = 0,
        k_Pixel = 1,
        k_Fragment = 1,
        k_Function = 2,
        k_PassFunction = 3,
    }
    enum ECheckStage {
        CODE_TARGET_SUPPORT = 0,
        SELF_CONTAINED = 1,
    }
    enum EVarUsedMode {
        k_Read = 0,
        k_Write = 1,
        k_ReadWrite = 2,
        k_Undefined = 3,
        k_Default = 2,
    }
    interface IAFXInstructionStateMap extends IStringMap {
    }
    interface IAFXInstructionRoutine {
        (): void;
    }
    interface IAFXInstructionError {
        code: number;
        info: any;
    }
    interface IAFXInstructionMap {
        [index: number]: IAFXInstruction;
    }
    interface IAFXSimpleInstructionMap {
        [index: string]: IAFXSimpleInstruction;
        [index: number]: IAFXSimpleInstruction;
    }
    interface IAFXIdExprMap {
        [index: string]: IAFXIdExprInstruction;
    }
    interface IAFXVariableTypeMap {
        [index: string]: IAFXVariableTypeInstruction;
        [index: number]: IAFXVariableTypeInstruction;
    }
    interface IAFXTypeMap {
        [index: string]: IAFXTypeInstruction;
        [index: number]: IAFXTypeInstruction;
    }
    interface IAFXTypeListMap {
        [index: string]: IAFXTypeInstruction[];
        [index: number]: IAFXTypeInstruction[];
    }
    interface IAFXTypeDeclMap {
        [index: string]: IAFXTypeDeclInstruction;
        [index: number]: IAFXTypeDeclInstruction;
    }
    interface IAFXVariableDeclMap {
        [index: number]: IAFXVariableDeclInstruction;
        [index: string]: IAFXVariableDeclInstruction;
    }
    interface IAFXVariableDeclListMap {
        [index: number]: IAFXVariableDeclInstruction[];
        [index: string]: IAFXVariableDeclInstruction[];
    }
    interface IAFXVarUsedModeMap {
        [index: string]: EVarUsedMode;
    }
    interface IAFXFunctionDeclMap {
        [index: string]: IAFXFunctionDeclInstruction;
        [index: number]: IAFXFunctionDeclInstruction;
    }
    interface IAFXTypeUseInfoContainer {
        type: IAFXVariableTypeInstruction;
        isRead: boolean;
        isWrite: boolean;
        numRead: number;
        numWrite: number;
        numUsed: number;
    }
    interface IAFXTypeUseInfoMap {
        [index: number]: IAFXTypeUseInfoContainer;
    }
    enum EExtractExprType {
        k_Header = 0,
        k_Float = 1,
        k_Int = 2,
        k_Bool = 3,
        k_Float2 = 4,
        k_Int2 = 5,
        k_Bool2 = 6,
        k_Float3 = 7,
        k_Int3 = 8,
        k_Bool3 = 9,
        k_Float4 = 10,
        k_Int4 = 11,
        k_Bool4 = 12,
        k_Float4x4 = 13,
    }
    enum EAFXBlendMode {
        k_Shared = 0,
        k_Uniform = 1,
        k_Attribute = 2,
        k_Foreign = 3,
        k_Global = 4,
        k_Varying = 5,
        k_TypeDecl = 6,
        k_VertexOut = 7,
    }
    interface IAFXImportedTechniqueInfo {
        technique: IAFXTechniqueInstruction;
        component: IAFXComponent;
        shift: number;
    }
    /**
    * All opertion are represented by:
    * operator : arg1 ... argn
    * Operator and instructions may be empty.
    */
    interface IAFXInstruction {
        _setParent(pParent: IAFXInstruction): void;
        _getParent(): IAFXInstruction;
        _setOperator(sOperator: string): void;
        _getOperator(): string;
        _setInstructions(pInstructionList: IAFXInstruction[]): void;
        _getInstructions(): IAFXInstruction[];
        _getInstructionType(): EAFXInstructionTypes;
        _getInstructionID(): number;
        _getScope(): number;
        _setScope(iScope: number): void;
        _isInGlobalScope(): boolean;
        _check(eStage: ECheckStage): boolean;
        _getLastError(): IAFXInstructionError;
        _setError(eCode: number, pInfo?: any): void;
        _clearError(): void;
        _isErrorOccured(): boolean;
        _setVisible(isVisible: boolean): void;
        _isVisible(): boolean;
        _initEmptyInstructions(): void;
        _push(pInstruction: IAFXInstruction, isSetParent?: boolean): void;
        _addRoutine(fnRoutine: IAFXInstructionRoutine, iPriority?: number): any;
        _prepareFor(eUsedType: EFunctionType): void;
        toString(): string;
        _toFinalCode(): string;
        _clone(pRelationMap?: IAFXInstructionMap): IAFXInstruction;
    }
    interface IAFXSimpleInstruction extends IAFXInstruction {
        _setValue(sValue: string): void;
        _isValue(sValue: string): boolean;
    }
    interface IAFXTypeInstruction extends IAFXInstruction {
        _toDeclString(): string;
        _isBuiltIn(): boolean;
        _setBuiltIn(isBuiltIn: boolean): void;
        /**
        * Simple tests
        */
        _isBase(): boolean;
        _isArray(): boolean;
        _isNotBaseArray(): boolean;
        _isComplex(): boolean;
        _isEqual(pType: IAFXTypeInstruction): boolean;
        _isStrongEqual(pType: IAFXTypeInstruction): boolean;
        _isConst(): boolean;
        _isSampler(): boolean;
        _isSamplerCube(): boolean;
        _isSampler2D(): boolean;
        _isWritable(): boolean;
        _isReadable(): boolean;
        _containArray(): boolean;
        _containSampler(): boolean;
        _containPointer(): boolean;
        _containComplexType(): boolean;
        /**
        * Set private params
        */
        _setName(sName: string): void;
        _canWrite(isWritable: boolean): void;
        _canRead(isReadable: boolean): void;
        /**
        * get type info
        */
        _getName(): string;
        _getRealName(): string;
        _getHash(): string;
        _getStrongHash(): string;
        _getSize(): number;
        _getBaseType(): IAFXTypeInstruction;
        _getLength(): number;
        _getArrayElementType(): IAFXTypeInstruction;
        _getTypeDecl(): IAFXTypeDeclInstruction;
        _hasField(sFieldName: string): boolean;
        _hasFieldWithSematic(sSemantic: string): any;
        _hasAllUniqueSemantics(): boolean;
        _hasFieldWithoutSemantic(): boolean;
        _getField(sFieldName: string): IAFXVariableDeclInstruction;
        _getFieldBySemantic(sSemantic: string): IAFXVariableDeclInstruction;
        _getFieldType(sFieldName: string): IAFXVariableTypeInstruction;
        _getFieldNameList(): string[];
        /**
        * System
        */
        _clone(pRelationMap?: IAFXInstructionMap): IAFXTypeInstruction;
        _blend(pType: IAFXTypeInstruction, eMode: EAFXBlendMode): IAFXTypeInstruction;
    }
    interface IAFXVariableTypeInstruction extends IAFXTypeInstruction {
        _setCollapsed(bValue: boolean): void;
        _isCollapsed(): boolean;
        /**
        * Simple tests
        */
        _isPointer(): boolean;
        _isStrictPointer(): boolean;
        _isPointIndex(): boolean;
        _isFromVariableDecl(): boolean;
        _isFromTypeDecl(): boolean;
        _isUniform(): boolean;
        _isGlobal(): boolean;
        _isConst(): boolean;
        _isShared(): boolean;
        _isForeign(): boolean;
        _isTypeOfField(): boolean;
        _isUnverifiable(): boolean;
        /**
        * init api
        */
        _setPadding(iPadding: number): void;
        _pushType(pType: IAFXTypeInstruction): void;
        _addUsage(sUsage: string): void;
        _addArrayIndex(pExpr: IAFXExprInstruction): void;
        _addPointIndex(isStrict?: boolean): void;
        _setVideoBuffer(pBuffer: IAFXVariableDeclInstruction): void;
        _initializePointers(): void;
        _setPointerToStrict(): void;
        _addPointIndexInDepth(): void;
        _setVideoBufferInDepth(): void;
        _markAsUnverifiable(isUnverifiable: boolean): void;
        _addAttrOffset(pOffset: IAFXVariableDeclInstruction): void;
        /**
        * Type info
        */
        _getPadding(): number;
        _getArrayElementType(): IAFXVariableTypeInstruction;
        _getUsageList(): string[];
        _getSubType(): IAFXTypeInstruction;
        _hasUsage(sUsageName: string): boolean;
        _hasVideoBuffer(): boolean;
        _getPointDim(): number;
        _getPointer(): IAFXVariableDeclInstruction;
        _getVideoBuffer(): IAFXVariableDeclInstruction;
        _getFieldExpr(sFieldName: string): IAFXIdExprInstruction;
        _getFieldIfExist(sFieldName: string): IAFXVariableDeclInstruction;
        _getSubVarDecls(): IAFXVariableDeclInstruction[];
        _getFullName(): string;
        _getVarDeclName(): string;
        _getTypeDeclName(): string;
        _getParentVarDecl(): IAFXVariableDeclInstruction;
        _getParentContainer(): IAFXVariableDeclInstruction;
        _getMainVariable(): IAFXVariableDeclInstruction;
        _getMainPointer(): IAFXVariableDeclInstruction;
        _getUpPointer(): IAFXVariableDeclInstruction;
        _getDownPointer(): IAFXVariableDeclInstruction;
        _getAttrOffset(): IAFXVariableDeclInstruction;
        /**
        * System
        */
        _wrap(): IAFXVariableTypeInstruction;
        _clone(pRelationMap?: IAFXInstructionMap): IAFXVariableTypeInstruction;
        _blend(pVariableType: IAFXVariableTypeInstruction, eMode: EAFXBlendMode): IAFXVariableTypeInstruction;
        _setCloneHash(sHash: string, sStrongHash: string): void;
        _setCloneArrayIndex(pElementType: IAFXVariableTypeInstruction, pIndexExpr: IAFXExprInstruction, iLength: number): void;
        _setClonePointeIndexes(nDim: number, pPointerList: IAFXVariableDeclInstruction[]): void;
        _setCloneFields(pFieldMap: IAFXVariableDeclMap): void;
        _setUpDownPointers(pUpPointer: IAFXVariableDeclInstruction, pDownPointer: IAFXVariableDeclInstruction): void;
    }
    interface IAFXTypedInstruction extends IAFXInstruction {
        _getType(): IAFXTypeInstruction;
        _setType(pType: IAFXTypeInstruction): void;
        _clone(pRelationMap?: IAFXInstructionMap): IAFXTypedInstruction;
    }
    interface IAFXDeclInstruction extends IAFXTypedInstruction {
        _setSemantic(sSemantic: string): any;
        _setAnnotation(pAnnotation: IAFXAnnotationInstruction): void;
        _getName(): string;
        _getRealName(): string;
        _getNameId(): IAFXIdInstruction;
        _getSemantic(): string;
        _isBuiltIn(): boolean;
        _setBuiltIn(isBuiltIn: boolean): void;
        _isForAll(): boolean;
        _isForPixel(): boolean;
        _isForVertex(): boolean;
        _setForAll(canUse: boolean): void;
        _setForPixel(canUse: boolean): void;
        _setForVertex(canUse: boolean): void;
        _clone(pRelationMap?: IAFXInstructionMap): IAFXDeclInstruction;
    }
    interface IAFXTypeDeclInstruction extends IAFXDeclInstruction {
        _clone(pRelationMap?: IAFXInstructionMap): IAFXTypeDeclInstruction;
        _blend(pDecl: IAFXTypeDeclInstruction, eBlendMode: EAFXBlendMode): IAFXTypeDeclInstruction;
    }
    interface IAFXVariableDeclInstruction extends IAFXDeclInstruction {
        _hasInitializer(): boolean;
        _getInitializeExpr(): IAFXInitExprInstruction;
        _hasConstantInitializer(): boolean;
        _lockInitializer(): void;
        _unlockInitializer(): void;
        _getDefaultValue(): any;
        _prepareDefaultValue(): void;
        _getValue(): any;
        _setValue(pValue: any): any;
        _getType(): IAFXVariableTypeInstruction;
        _setType(pType: IAFXVariableTypeInstruction): void;
        _isUniform(): boolean;
        _isField(): boolean;
        _isPointer(): boolean;
        _isVideoBuffer(): boolean;
        _isSampler(): boolean;
        _getSubVarDecls(): IAFXVariableDeclInstruction[];
        _isDefinedByZero(): boolean;
        _defineByZero(isDefine: boolean): void;
        _setAttrExtractionBlock(pCodeBlock: IAFXInstruction): void;
        _getAttrExtractionBlock(): IAFXInstruction;
        _markAsVarying(bValue: boolean): void;
        _markAsShaderOutput(isShaderOutput: boolean): void;
        _isShaderOutput(): boolean;
        _getNameIndex(): number;
        _getFullNameExpr(): IAFXExprInstruction;
        _getFullName(): string;
        _getVideoBufferSampler(): IAFXVariableDeclInstruction;
        _getVideoBufferHeader(): IAFXVariableDeclInstruction;
        _getVideoBufferInitExpr(): IAFXInitExprInstruction;
        _setName(sName: string): void;
        _setRealName(sName: string): void;
        _setVideoBufferRealName(sSampler: string, sHeader: string): void;
        _setCollapsed(bValue: boolean): void;
        _isCollapsed(): boolean;
        _clone(pRelationMap?: IAFXInstructionMap): IAFXVariableDeclInstruction;
        _blend(pVariableDecl: IAFXVariableDeclInstruction, eMode: EAFXBlendMode): IAFXVariableDeclInstruction;
    }
    interface IAFXFunctionDeclInstruction extends IAFXDeclInstruction {
        _toFinalDefCode(): string;
        _hasImplementation(): boolean;
        _getArguments(): IAFXTypedInstruction[];
        _getNumNeededArguments(): number;
        _getReturnType(): IAFXVariableTypeInstruction;
        _getFunctionType(): EFunctionType;
        _setFunctionType(eType: EFunctionType): void;
        _getVertexShader(): IAFXFunctionDeclInstruction;
        _getPixelShader(): IAFXFunctionDeclInstruction;
        _setFunctionDef(pFunctionDef: IAFXDeclInstruction): void;
        _setImplementation(pImplementation: IAFXStmtInstruction): void;
        _clone(pRelationMap?: IAFXInstructionMap): IAFXFunctionDeclInstruction;
        _addOutVariable(pVariable: IAFXVariableDeclInstruction): boolean;
        _getOutVariable(): IAFXVariableDeclInstruction;
        _markUsedAs(eUsedType: EFunctionType): void;
        _isUsedAs(eUsedType: EFunctionType): boolean;
        _isUsedAsFunction(): boolean;
        _isUsedAsVertex(): boolean;
        _isUsedAsPixel(): boolean;
        _isUsed(): boolean;
        _markUsedInVertex(): void;
        _markUsedInPixel(): void;
        _isUsedInVertex(): boolean;
        _isUsedInPixel(): boolean;
        _checkVertexUsage(): boolean;
        _checkPixelUsage(): boolean;
        _checkDefenitionForVertexUsage(): boolean;
        _checkDefenitionForPixelUsage(): boolean;
        _canUsedAsFunction(): boolean;
        _notCanUsedAsFunction(): void;
        _addUsedFunction(pFunction: IAFXFunctionDeclInstruction): boolean;
        _getUsedFunctionList(): IAFXFunctionDeclInstruction[];
        _addUsedVariable(pVariable: IAFXVariableDeclInstruction): void;
        _isBlackListFunction(): boolean;
        _addToBlackList(): void;
        _getStringDef(): string;
        _convertToVertexShader(): IAFXFunctionDeclInstruction;
        _convertToPixelShader(): IAFXFunctionDeclInstruction;
        _prepareForVertex(): void;
        _prepareForPixel(): void;
        _generateInfoAboutUsedData(): void;
        _getAttributeVariableMap(): IAFXVariableDeclMap;
        _getVaryingVariableMap(): IAFXVariableDeclMap;
        _getSharedVariableMap(): IAFXVariableDeclMap;
        _getGlobalVariableMap(): IAFXVariableDeclMap;
        _getUniformVariableMap(): IAFXVariableDeclMap;
        _getForeignVariableMap(): IAFXVariableDeclMap;
        _getTextureVariableMap(): IAFXVariableDeclMap;
        _getUsedComplexTypeMap(): IAFXTypeMap;
        _getAttributeVariableKeys(): number[];
        _getVaryingVariableKeys(): number[];
        _getSharedVariableKeys(): number[];
        _getUniformVariableKeys(): number[];
        _getForeignVariableKeys(): number[];
        _getGlobalVariableKeys(): number[];
        _getTextureVariableKeys(): number[];
        _getUsedComplexTypeKeys(): number[];
        _getExtSystemFunctionList(): IAFXFunctionDeclInstruction[];
        _getExtSystemMacrosList(): IAFXSimpleInstruction[];
        _getExtSystemTypeList(): IAFXTypeDeclInstruction[];
    }
    interface IAFXStructDeclInstruction extends IAFXInstruction {
    }
    interface IAFXIdInstruction extends IAFXInstruction {
        _getName(): string;
        _getRealName(): string;
        _setName(sName: string): void;
        _setRealName(sName: string): void;
        _markAsVarying(bValue: boolean): void;
        _clone(pRelationMap?: IAFXInstructionMap): IAFXIdInstruction;
    }
    interface IAFXKeywordInstruction extends IAFXInstruction {
        _setValue(sValue: string): void;
        _isValue(sTestValue: string): boolean;
    }
    interface IAFXAnalyzedInstruction extends IAFXInstruction {
        _addUsedData(pUsedDataCollector: IAFXTypeUseInfoMap, eUsedMode?: EVarUsedMode): void;
    }
    interface IAFXExprInstruction extends IAFXTypedInstruction, IAFXAnalyzedInstruction {
        _evaluate(): boolean;
        _simplify(): boolean;
        _getEvalValue(): any;
        _isConst(): boolean;
        _getType(): IAFXVariableTypeInstruction;
        _clone(pRelationMap?: IAFXInstructionMap): IAFXExprInstruction;
    }
    interface IAFXInitExprInstruction extends IAFXExprInstruction {
        _optimizeForVariableType(pType: IAFXVariableTypeInstruction): boolean;
    }
    interface IAFXIdExprInstruction extends IAFXExprInstruction {
        _clone(pRelationMap?: IAFXInstructionMap): IAFXIdExprInstruction;
    }
    interface IAFXLiteralInstruction extends IAFXExprInstruction {
        _setValue(pValue: any): void;
        _clone(pRelationMap?: IAFXInstructionMap): IAFXLiteralInstruction;
    }
    interface IAFXAnnotationInstruction extends IAFXInstruction {
    }
    interface IAFXStmtInstruction extends IAFXInstruction, IAFXAnalyzedInstruction {
    }
    interface IAFXPassInstruction extends IAFXDeclInstruction {
        _addFoundFunction(pNode: parser.IParseNode, pShader: IAFXFunctionDeclInstruction, eType: EFunctionType): void;
        _getFoundedFunction(pNode: parser.IParseNode): IAFXFunctionDeclInstruction;
        _getFoundedFunctionType(pNode: parser.IParseNode): EFunctionType;
        _setParseNode(pNode: parser.IParseNode): void;
        _getParseNode(): parser.IParseNode;
        _markAsComplex(isComplex: boolean): void;
        _addCodeFragment(sCode: string): void;
        _getSharedVariableMapV(): IAFXVariableDeclMap;
        _getGlobalVariableMapV(): IAFXVariableDeclMap;
        _getUniformVariableMapV(): IAFXVariableDeclMap;
        _getForeignVariableMapV(): IAFXVariableDeclMap;
        _getTextureVariableMapV(): IAFXVariableDeclMap;
        _getUsedComplexTypeMapV(): IAFXTypeMap;
        _getSharedVariableMapP(): IAFXVariableDeclMap;
        _getGlobalVariableMapP(): IAFXVariableDeclMap;
        _getUniformVariableMapP(): IAFXVariableDeclMap;
        _getForeignVariableMapP(): IAFXVariableDeclMap;
        _getTextureVariableMapP(): IAFXVariableDeclMap;
        _getUsedComplexTypeMapP(): IAFXTypeMap;
        _getFullUniformMap(): IAFXVariableDeclMap;
        _getFullForeignMap(): IAFXVariableDeclMap;
        _getFullTextureMap(): IAFXVariableDeclMap;
        _getVertexShader(): IAFXFunctionDeclInstruction;
        _getPixelShader(): IAFXFunctionDeclInstruction;
        _addOwnUsedForignVariable(pVarDecl: IAFXVariableDeclInstruction): void;
        _addShader(pShader: IAFXFunctionDeclInstruction): void;
        _setState(eType: ERenderStates, eValue: ERenderStateValues): void;
        _finalizePass(): void;
        _isComplexPass(): boolean;
        _evaluate(pEngineStates: any, pForeigns: any, pUniforms: any): boolean;
        _getState(eType: ERenderStates): ERenderStateValues;
        _getRenderStates(): IMap<ERenderStateValues>;
    }
    interface IAFXTechniqueInstruction extends IAFXDeclInstruction {
        _setName(sName: string, isComplexName: boolean): void;
        _getName(): string;
        _hasComplexName(): boolean;
        _isPostEffect(): boolean;
        _addPass(pPass: IAFXPassInstruction): void;
        _getPassList(): IAFXPassInstruction[];
        _getPass(iPass: number): IAFXPassInstruction;
        _totalOwnPasses(): number;
        _totalPasses(): number;
        _getSharedVariablesForVertex(): IAFXVariableDeclInstruction[];
        _getSharedVariablesForPixel(): IAFXVariableDeclInstruction[];
        _addTechniqueFromSameEffect(pTechnique: IAFXTechniqueInstruction, iShift: number): void;
        _addComponent(pComponent: IAFXComponent, iShift: number): void;
        _getFullComponentList(): IAFXComponent[];
        _getFullComponentShiftList(): number[];
        _checkForCorrectImports(): boolean;
        _setGlobalParams(sProvideNameSpace: string, pGloabalImportList: IAFXImportedTechniqueInfo[]): void;
        _finalize(pComposer: IAFXComposer): void;
    }
    interface IAFXVariableBlendInfo {
        varList: IAFXVariableDeclInstruction[];
        blendType: IAFXVariableTypeInstruction;
        name: string;
        nameIndex: number;
    }
    interface IAFXVariableBlendInfoMap {
        [index: number]: IAFXVariableBlendInfo;
    }
    interface IAFXFunctionDeclListMap {
        [functionName: string]: IAFXFunctionDeclInstruction[];
    }
}
declare module akra {
    enum EPassTypes {
        UNDEF = 0,
        DEFAULT = 1,
        POSTEFFECT = 2,
    }
    interface IAFXComponent extends IResourcePoolItem {
        getTechnique(): IAFXTechniqueInstruction;
        setTechnique(pTechnique: IAFXTechniqueInstruction): void;
        isPostEffect(): boolean;
        getName(): string;
        getTotalPasses(): number;
        getHash(iShift: number, iPass: number): string;
    }
    interface IAFXComponentMap {
        [index: number]: IAFXComponent;
        [index: string]: IAFXComponent;
    }
}
declare module akra {
    interface IEffect extends IResourcePoolItem {
        getTotalComponents(): number;
        getTotalPasses(): number;
        isEqual(pEffect: IEffect): boolean;
        isReplicated(): boolean;
        isMixid(): boolean;
        isParameterUsed(pParam: any, iPass?: number): boolean;
        replicable(bValue: boolean): void;
        miscible(bValue: boolean): void;
        addComponent(iComponentHandle: number, iShift?: number, iPass?: number): boolean;
        addComponent(pComponent: IAFXComponent, iShift?: number, iPass?: number): boolean;
        addComponent(sComponent: string, iShift?: number, iPass?: number): boolean;
        delComponent(iComponentHandle: number, iShift?: number, iPass?: number): boolean;
        delComponent(sComponent: string, iShift?: number, iPass?: number): boolean;
        delComponent(pComponent: IAFXComponent, iShift?: number, iPass?: number): boolean;
        hasComponent(sComponent: string, iShift?: number, iPass?: number): boolean;
        activate(iShift?: number): boolean;
        deactivate(): boolean;
        findParameter(pParam: any, iPass?: number): any;
    }
}
declare module akra {
    interface IBuffer {
        getLength(): number;
        getByteLength(): number;
    }
}
declare module akra {
    interface IBufferData {
        getByteOffset(): number;
        getByteLength(): number;
        getBuffer(): IBuffer;
    }
}
declare module akra {
    interface IBufferDataModifier {
        (pData: ArrayBufferView): void;
    }
}
declare module akra {
    interface IVertexDeclaration {
        /** Get byte length.*/
        stride: number;
        /** Get number of vertex elements. */
        getLength(): number;
        append(...pElement: IVertexElementInterface[]): boolean;
        append(pElements: IVertexElementInterface[]): boolean;
        extend(pDecl: IVertexDeclaration): boolean;
        hasSemantics(sSemantics: string): boolean;
        findElement(sSemantics: string, iCount?: number): IVertexElement;
        clone(): IVertexDeclaration;
        element(i: number): IVertexElement;
        _update(): boolean;
        toString(): string;
    }
}
declare module akra {
    enum EHardwareBufferFlags {
        STATIC = 1,
        DYNAMIC = 2,
        STREAM = 128,
        READABLE = 4,
        BACKUP_COPY = 8,
        /** indicate, that buffer does not use GPU memory or other specific memory. */
        SOFTWARE = 16,
        /** Indicate, tha buffer uses specific data aligment */
        ALIGNMENT = 32,
        /** Indicates that the application will be refilling the contents
        of the buffer regularly (not just updating, but generating the
        contents from scratch), and therefore does not mind if the contents
        of the buffer are lost somehow and need to be recreated. This
        allows and additional level of optimisation on the buffer.
        This option only really makes sense when combined with
        DYNAMIC and without READING.
        */
        DISCARDABLE = 64,
        STATIC_READABLE = 5,
        DYNAMIC_DISCARDABLE = 66,
    }
    enum ELockFlags {
        READ = 1,
        WRITE = 2,
        DISCARD = 4,
        NO_OVERWRITE = 8,
        NORMAL = 3,
    }
    interface IHardwareBuffer extends IBuffer {
        clone(pSrc: IHardwareBuffer): boolean;
        isValid(): boolean;
        isDynamic(): boolean;
        isStatic(): boolean;
        isStream(): boolean;
        isReadable(): boolean;
        isBackupPresent(): boolean;
        isSoftware(): boolean;
        isAligned(): boolean;
        isLocked(): boolean;
        getFlags(): number;
        readData(ppDest: ArrayBufferView): boolean;
        readData(iOffset: number, iSize: number, ppDest: ArrayBufferView): boolean;
        writeData(pData: ArrayBufferView, iOffset?: number, iSize?: number, bDiscardWholeBuffer?: boolean): boolean;
        copyData(pSrcBuffer: IHardwareBuffer, iSrcOffset: number, iDstOffset: number, iSize: number, bDiscardWholeBuffer?: boolean): boolean;
        create(iSize: number, iFlags?: number): boolean;
        destroy(): void;
        resize(iSize: number): boolean;
        lock(iLockFlags: number): any;
        lock(iOffset: number, iSize: number, iLockFlags?: number): any;
        unlock(): void;
        restoreFromBackup(): boolean;
    }
}
declare module akra {
    interface IVertexElementInterface {
        /**
        * Number of uint.
        */
        count: number;
        /**
        * Type of units.
        */
        type: EDataTypes;
        /**
        * Usage of element.
        * For ex., basicly for vertices is 'POSITION'.
        */
        usage: string;
        /**
        * Offset in bytes.
        */
        offset?: number;
    }
    interface IVertexElement extends IVertexElementInterface {
        /**
        * Size in bytes.
        */
        size: number;
        /**
        * numerical index of declaration.
        * For ex. for usage INDEX10, index is 10, semantics is 'INDEX'.
        */
        index: number;
        /**
        * Semantics of declaration.
        * @see DelcarationUsages.
        */
        semantics: string;
        clone(): IVertexElement;
        isEnd(): boolean;
        toString(): string;
    }
}
declare module akra {
    enum EVertexBufferTypes {
        UNKNOWN = 0,
        VBO = 1,
        TBO = 2,
    }
    interface IVertexBuffer extends IHardwareBuffer, IRenderResource {
        getType(): EVertexBufferTypes;
        getVertexData(i: number): IVertexData;
        getVertexData(iOffset: number, iCount: number, pElements: IVertexElement[]): IVertexData;
        getVertexData(iOffset: number, iCount: number, pDecl: IVertexDeclaration): IVertexData;
        getEmptyVertexData(iCount: number, pElements: IVertexElement[], ppVertexDataIn?: IVertexData): IVertexData;
        getEmptyVertexData(iCount: number, pDecl: IVertexDeclaration, ppVertexDataIn?: IVertexData): IVertexData;
        getEmptyVertexData(iCount: number, pSize: number, ppVertexDataIn?: IVertexData): IVertexData;
        freeVertexData(pVertexData: IVertexData): boolean;
        freeVertexData(): boolean;
        create(iByteSize: number, iFlags?: number, pData?: Uint8Array): boolean;
        allocateData(pElements: IVertexElement[], pData: ArrayBufferView): IVertexData;
        allocateData(pDecl: IVertexDeclaration, pData: ArrayBufferView): IVertexData;
    }
}
declare module akra {
    interface IVertexData extends IBufferData, IBuffer, IEventProvider {
        getStride(): number;
        getStartIndex(): number;
        getID(): number;
        getVertexDeclaration(): IVertexDeclaration;
        setVertexDeclaration(pDecl: IVertexDeclaration): boolean;
        getVertexElementCount(): number;
        hasSemantics(sSemantics: string): boolean;
        destroy(): void;
        extend(pDecl: IVertexDeclaration, pData?: ArrayBufferView): boolean;
        resize(nCount: number, pDecl?: IVertexDeclaration): boolean;
        resize(nCount: number, iStride?: number): boolean;
        applyModifier(sUsage: string, fnModifier: IBufferDataModifier): boolean;
        setData(pData: ArrayBufferView, iOffset: number, iSize?: number, nCountStart?: number, nCount?: number): boolean;
        setData(pData: ArrayBufferView, sUsage?: string, iSize?: number, nCountStart?: number, nCount?: number): boolean;
        getData(): ArrayBuffer;
        getData(iOffset: number, iSize: number, iFrom?: number, iCount?: number): ArrayBuffer;
        getData(sUsage: string): ArrayBuffer;
        getData(sUsage: string, iFrom: number, iCount: number): ArrayBuffer;
        getTypedData(sUsage: string, iFrom?: number, iCount?: number): ArrayBufferView;
        getBufferHandle(): number;
        toString(): string;
        relocated: ISignal<(pData: IVertexData, from: number, to: number) => void>;
        resized: ISignal<(pData: IVertexData, iByteLength: number) => void>;
        declarationChanged: ISignal<(pData: IVertexData, pDecl: IVertexDeclaration) => void>;
        updated: ISignal<(pData: IVertexData) => void>;
    }
}
declare module akra {
    interface IMaterialBase {
        diffuse: IColorValue;
        ambient: IColorValue;
        specular: IColorValue;
        emissive: IColorValue;
        shininess: number;
        /**
        * Determines whether the object is transparent.
        * @note 1. - opaque, 0. - fully transparent.
        */
        transparency: number;
    }
    interface IMaterial extends IMaterialBase, IUnique {
        guid: number;
        /** Name of material */
        name: string;
        diffuse: IColor;
        ambient: IColor;
        specular: IColor;
        emissive: IColor;
        set(sMat: "gold"): IMaterial;
        set(sMat: "cooper"): IMaterial;
        set(sMat: "plastic"): IMaterial;
        set(sMat: "iron"): IMaterial;
        set(sMat: "aluminium"): IMaterial;
        set(sMat: "silver"): IMaterial;
        set(sMat: "water"): IMaterial;
        set(sMat: "glass"): IMaterial;
        set(sMat: string): IMaterial;
        set(pMat: IMaterialBase): IMaterial;
        isEqual(pMat: IMaterialBase): boolean;
        isTransparent(): boolean;
    }
}
declare module akra {
    enum ESurfaceMaterialTextures {
        TEXTURE0 = 0,
        TEXTURE1 = 1,
        TEXTURE2 = 2,
        TEXTURE3 = 3,
        TEXTURE4 = 4,
        TEXTURE5 = 5,
        TEXTURE6 = 6,
        TEXTURE7 = 7,
        TEXTURE8 = 8,
        TEXTURE9 = 9,
        TEXTURE10 = 10,
        TEXTURE11 = 11,
        TEXTURE12 = 12,
        TEXTURE13 = 13,
        TEXTURE14 = 14,
        TEXTURE15 = 15,
        DIFFUSE = 0,
        AMBIENT = 1,
        SPECULAR = 2,
        EMISSIVE = 3,
        NORMAL = 4,
        SHININESS = 5,
        EMISSION = 3,
    }
    interface ISurfaceMaterial extends IResourcePoolItem {
        getTotalUpdatesOfTextures(): number;
        getTotalUpdatesOfTexcoords(): number;
        getTotalTextures(): number;
        getTextureFlags(): number;
        getTextureMatrixFlags(): number;
        getMaterial(): IMaterial;
        setMaterial(pMaterial: IMaterial): void;
        setTexture(iIndex: number, sTexture: string, iTexcoord?: number): boolean;
        setTexture(iIndex: number, iTextureHandle: number, iTexcoord?: number): boolean;
        setTexture(iIndex: number, pTexture: ITexture, iTexcoord?: number): boolean;
        setTextureMatrix(iIndex: number, m4fValue: IMat4): boolean;
        isEqual(pSurface: ISurfaceMaterial): boolean;
        texture(iSlot: number): ITexture;
        texcoord(iSlot: number): number;
        textureMatrix(iSlot: number): IMat4;
    }
}
declare module akra {
    enum ERenderStates {
        BLENDENABLE = 0,
        CULLFACEENABLE = 1,
        ZENABLE = 2,
        ZWRITEENABLE = 3,
        DITHERENABLE = 4,
        SCISSORTESTENABLE = 5,
        STENCILTESTENABLE = 6,
        POLYGONOFFSETFILLENABLE = 7,
        CULLFACE = 8,
        FRONTFACE = 9,
        SRCBLENDCOLOR = 10,
        DESTBLENDCOLOR = 11,
        SRCBLENDALPHA = 12,
        DESTBLENDALPHA = 13,
        BLENDEQUATIONCOLOR = 14,
        BLENDEQUATIONALPHA = 15,
        ZFUNC = 16,
        ALPHABLENDENABLE = 17,
        ALPHATESTENABLE = 18,
        SRCBLEND = 19,
        DESTBLEND = 20,
        BLENDFUNC = 21,
        BLENDFUNCSEPARATE = 22,
        BLENDEQUATION = 23,
        BLENDEQUATIONSEPARATE = 24,
    }
}
declare module akra {
    interface IAFXPassInputStateInfo {
        uniformKey: number;
        foreignKey: number;
        samplerKey: number;
        renderStatesKey: number;
    }
    interface IAFXPassInputBlend extends IUnique {
        samplers: IAFXSamplerStateMap;
        samplerArrays: IAFXSamplerStateListMap;
        samplerArrayLength: IIntMap;
        uniforms: any;
        foreigns: any;
        textures: any;
        samplerKeys: number[];
        samplerArrayKeys: number[];
        uniformKeys: number[];
        foreignKeys: number[];
        textureKeys: number[];
        renderStates: IMap<ERenderStateValues>;
        getStatesInfo(): IAFXPassInputStateInfo;
        hasUniform(sName: string): boolean;
        hasTexture(sName: string): boolean;
        hasForeign(sName: string): boolean;
        setUniform(sName: string, pValue: any): void;
        setTexture(sName: string, pValue: any): void;
        setForeign(sName: string, pValue: any): void;
        setSampler(sName: string, pState: IAFXSamplerState): void;
        setSamplerArray(sName: string, pSamplerArray: IAFXSamplerState[]): void;
        setSamplerTexture(sName: string, sTexture: string): void;
        setSamplerTexture(sName: string, pTexture: ITexture): void;
        setStruct(sName: string, pValue: any): void;
        setSurfaceMaterial(pMaterial: ISurfaceMaterial): void;
        setRenderState(eState: ERenderStates, eValue: ERenderStateValues): void;
        _getForeignVarNameIndex(sName: string): number;
        _getForeignVarNameByIndex(iNameIndex: number): string;
        _getUniformVarNameIndex(sName: string): number;
        _getUniformVarNameByIndex(iNameIndex: number): string;
        _getUniformVar(iNameIndex: number): IAFXVariableDeclInstruction;
        _getUniformLength(iNameIndex: number): number;
        _getUniformType(iNameIndex: number): EAFXShaderVariableType;
        _getSamplerState(iNameIndex: number): IAFXSamplerState;
        _getSamplerTexture(iNameIndex: number): ITexture;
        _getTextureForSamplerState(pSamplerState: IAFXSamplerState): ITexture;
        _release(): void;
        _isFromSameBlend(pInput: IAFXPassInputBlend): boolean;
        _getBlend(): IAFXComponentPassInputBlend;
        _copyFrom(pInput: IAFXPassInputBlend): void;
        _copyUniformsFromInput(pInput: IAFXPassInputBlend): void;
        _copySamplersFromInput(pInput: IAFXPassInputBlend): void;
        _copyForeignsFromInput(pInput: IAFXPassInputBlend): void;
        _copyRenderStatesFromInput(pInput: IAFXPassInputBlend): void;
        _getLastPassBlendId(): number;
        _getLastShaderId(): number;
        _setPassBlendId(id: number): void;
        _setShaderId(id: number): void;
    }
}
declare module akra {
    enum EAFXShaderVariableType {
        k_NotVar = 0,
        k_Texture = 2,
        k_Float = 3,
        k_Int = 4,
        k_Bool = 5,
        k_Float2 = 6,
        k_Int2 = 7,
        k_Bool2 = 8,
        k_Float3 = 9,
        k_Int3 = 10,
        k_Bool3 = 11,
        k_Float4 = 12,
        k_Int4 = 13,
        k_Bool4 = 14,
        k_Float2x2 = 15,
        k_Float3x3 = 16,
        k_Float4x4 = 17,
        k_Sampler2D = 18,
        k_SamplerCUBE = 19,
        k_SamplerVertexTexture = 20,
        k_CustomSystem = 21,
        k_Complex = 22,
    }
    interface IAFXShaderVarTypeMap {
        [index: number]: EAFXShaderVariableType;
    }
    interface IAFXVariableInfo {
        variable: IAFXVariableDeclInstruction;
        type: EAFXShaderVariableType;
        name: string;
        realName: string;
        isArray: boolean;
    }
    interface IAFXVariableContainer {
        getIndices(): number[];
        add(pVar: IAFXVariableDeclInstruction): void;
        addSystemEntry(sName: string, eType: EAFXShaderVariableType): void;
        finalize(): void;
        getVarInfoByIndex(iIndex: number): IAFXVariableInfo;
        getVarByIndex(iIndex: number): IAFXVariableDeclInstruction;
        getTypeByIndex(iIndex: number): EAFXShaderVariableType;
        isArrayVariable(iIndex: number): boolean;
        getIndexByName(sName: string): number;
        getIndexByRealName(sName: string): number;
        hasVariableWithName(sName: string): boolean;
        hasVariableWithRealName(sName: string): boolean;
        getVarByName(sName: string): IAFXVariableDeclInstruction;
        getVarByRealName(sName: string): IAFXVariableDeclInstruction;
    }
}
declare module akra {
    interface IAFXComponentInfo {
        component: IAFXComponent;
        shift: number;
        pass: number;
        hash: string;
    }
    interface IAFXComponentPassInputBlend {
        getUniforms(): IAFXVariableContainer;
        getTextures(): IAFXVariableContainer;
        getForeigns(): IAFXVariableContainer;
        addDataFromPass(pPass: IAFXPassInstruction): void;
        finalizeInput(): void;
        getPassInput(): IAFXPassInputBlend;
        releasePassInput(pPassInput: IAFXPassInputBlend): void;
    }
    interface IAFXComponentBlend extends IUnique {
        isReadyToUse(): boolean;
        isEmpty(): boolean;
        getComponentCount(): number;
        getTotalPasses(): number;
        getHash(): string;
        _getMinShift(): number;
        _getMaxShift(): number;
        hasPostEffect(): boolean;
        getPassTypes(): EPassTypes[];
        containComponent(pComponent: IAFXComponent, iShift: number, iPass: number): any;
        containComponentHash(sComponentHash: string): boolean;
        findAnyAddedComponentInfo(pComponent: IAFXComponent, iShift: number, iPass: number): IAFXComponentInfo;
        addComponent(pComponent: IAFXComponent, iShift: number, iPass: number): void;
        removeComponent(pComponent: IAFXComponent, iShift: number, iPass: number): void;
        finalizeBlend(): boolean;
        getPassInputForPass(iPass: number): IAFXPassInputBlend;
        getPassListAtPass(iPass: number): IAFXPassInstruction[];
        clone(): IAFXComponentBlend;
        _getComponentInfoList(): IAFXComponentInfo[];
        _setDataForClone(pAddedComponentInfoList: IAFXComponentInfo[], pComponentHashMap: IBoolMap, nShiftMin: number, nShiftMax: number): void;
    }
    interface IAFXComponentBlendMap {
        [index: number]: IAFXComponentBlend;
        [index: string]: IAFXComponentBlend;
    }
}
declare module akra {
    enum EPrimitiveTypes {
        POINTLIST = 0,
        LINELIST = 1,
        LINELOOP = 2,
        LINESTRIP = 3,
        TRIANGLELIST = 4,
        TRIANGLESTRIP = 5,
        TRIANGLEFAN = 6,
    }
}
declare module akra {
    interface IIndexData extends IBufferData, IBuffer {
        getType(): EDataTypes;
        getLength(): number;
        getBytesPerIndex(): number;
        getID(): number;
        getData(iOffset: number, iSize: number): ArrayBuffer;
        getTypedData(iStart?: number, iCount?: number): ArrayBufferView;
        setData(pData: ArrayBufferView): boolean;
        setData(pData: ArrayBufferView, iOffset: number): boolean;
        setData(pData: ArrayBufferView, iOffset: number, iCount: number): boolean;
        destroy(): void;
        getPrimitiveType(): EPrimitiveTypes;
        getPrimitiveCount(): number;
        getBufferHandle(): number;
    }
}
declare module akra {
    enum EDataFlowTypes {
        MAPPABLE = 1,
        UNMAPPABLE = 0,
    }
    interface IDataFlow {
        flow: number;
        data: IVertexData;
        type: EDataFlowTypes;
        mapper: IDataMapper;
    }
    interface IDataMapper {
        data: IVertexData;
        semantics: string;
        addition: number;
    }
    interface IBufferMap extends IReferenceCounter, IEventProvider {
        getPrimType(): EPrimitiveTypes;
        setPrimType(eType: EPrimitiveTypes): void;
        getIndex(): IIndexData;
        setIndex(pIndex: IIndexData): void;
        getLength(): number;
        setLength(iLength: number): void;
        _setLengthForce(iLength: number): void;
        getTotalUpdates(): number;
        /** Number of primitives. */
        getPrimCount(): number;
        /** Maximum flow available in buffer map. */
        getLimit(): number;
        /** Start index for drawning. */
        getStartIndex(): number;
        /** Number of completed flows. */
        getSize(): number;
        /** Completed flows. */
        getFlows(): IDataFlow[];
        /**
        * Mappers.
        * @private
        */
        getMappers(): IDataMapper[];
        /**
        * Offset in bytes for drawing with global idnex.
        * @deprecated
        */
        getOffset(): number;
        /**
        * Find flow by semantics in.
        * @param sSemantics VertexElement usage or semantics.
        * @param {boolean=} bComplete Find only in completed flows. Default is TRUE.
        */
        getFlow(sSemantics: string, bComplete?: boolean): IDataFlow;
        getFlow(iFlow: number, bComplete?: boolean): IDataFlow;
        getFlowBySemantic(sSemantics: string): IDataFlow;
        findFlow(sSemantics: string): IDataFlow;
        reset(): void;
        /**
        * Add data to flow.
        */
        flow(pVertexData: IVertexData): number;
        flow(iFlow: number, pVertexData: IVertexData): number;
        /**
        * Add index for flow.
        */
        mapping(iFlow: number, pMap: IVertexData, sSemantics: string, iAddition?: number): boolean;
        /**
        * Check, Is pData already used as flow or mapper.
        */
        checkData(pData: IVertexData): boolean;
        /**
        * Recals all statistics in buffer map.
        */
        update(): boolean;
        clone(bWithMapping?: boolean): IBufferMap;
        /**
        * Draw buffer map.
        */
        _draw(): void;
        toString(bListAll?: boolean): string;
        modified: ISignal<(pMap: IBufferMap) => void>;
    }
}
declare module akra {
    interface IRIDTable {
        [iSceneObjectGuid: number]: IMap<number>;
    }
    interface IRIDPair {
        renderable: IRenderableObject;
        object: ISceneObject;
    }
    interface IRIDMap {
        [rid: number]: IRIDPair;
    }
    interface IPickedObject extends IRIDPair {
        x: number;
        y: number;
    }
}
declare module akra {
    interface IAFXComposer {
        getComponentByName(sComponentName: string): IAFXComponent;
        getEngine(): IEngine;
        getComponentCountForEffect(pEffectResource: IEffect): number;
        getTotalPassesForEffect(pEffectResource: IEffect): number;
        addComponentToEffect(pEffectResource: IEffect, pComponent: IAFXComponent, iShift: number, iPass: number): boolean;
        removeComponentFromEffect(pEffectResource: IEffect, pComponent: IAFXComponent, iShift: number, iPass: number): boolean;
        hasComponentForEffect(pEffectResource: IEffect, pComponent: IAFXComponent, iShift: number, iPass: number): boolean;
        activateEffectResource(pEffectResource: IEffect, iShift: number): boolean;
        deactivateEffectResource(pEffectResource: IEffect): boolean;
        getPassInputBlendForEffect(pEffectResource: IEffect, iPass: number): IAFXPassInputBlend;
        copyTechniqueOwnComponentBlend(pFrom: IRenderTechnique, pTo: IRenderTechnique): void;
        getMinShiftForOwnTechniqueBlend(pRenderTechnique: IRenderTechnique): number;
        getTotalPassesForTechnique(pRenderTechnique: IRenderTechnique): number;
        addOwnComponentToTechnique(pRenderTechnique: IRenderTechnique, pComponent: IAFXComponent, iShift: number, iPass: number): boolean;
        removeOwnComponentToTechnique(pRenderTechnique: IRenderTechnique, pComponent: IAFXComponent, iShift: number, iPass: number): boolean;
        hasOwnComponentInTechnique(pRenderTechnique: IRenderTechnique, pComponent: IAFXComponent, iShift: number, iPass: number): boolean;
        prepareTechniqueBlend(pRenderTechnique: IRenderTechnique): boolean;
        markTechniqueAsNeedUpdate(pRenderTechnique: IRenderTechnique): void;
        getPassInputBlendForTechnique(pRenderTechnique: IRenderTechnique, iPass: number): IAFXPassInputBlend;
        applyBufferMap(pBufferMap: IBufferMap): boolean;
        applySurfaceMaterial(pSurfaceMaterial: ISurfaceMaterial): boolean;
        _calcRenderID(pSceneObject: ISceneObject, pRenderable: IRenderableObject, bCreateIfNotExists?: boolean): number;
        _getRenderableByRid(iRid: number): IRenderableObject;
        _getObjectByRid(iRid: number): ISceneObject;
        _setCurrentSceneObject(pSceneObject: ISceneObject): void;
        _setCurrentViewport(pViewport: IViewport): void;
        _setCurrentRenderableObject(pRenderable: IRenderableObject): void;
        _getCurrentSceneObject(): ISceneObject;
        _getCurrentViewport(): IViewport;
        _getCurrentRenderableObject(): IRenderableObject;
        _setDefaultCurrentState(): void;
        renderTechniquePass(pRenderTechnique: IRenderTechnique, iPass: number): void;
        /** @deprected will be removed from release version, use _loadEffectFromBinary instead.*/
        _loadEffectFromSyntaxTree(pTree: parser.IParseTree, sFileName: string): boolean;
        _loadEffectFromBinary(pData: Uint8Array, sFileName: string): boolean;
    }
}
declare module akra {
    interface IDepthBuffer extends IRenderResource {
        getBitDepth(): number;
        getWidth(): number;
        getHeight(): number;
        create(iBitDepth: number, iWidth: number, iHeight: number, bManual: boolean): void;
        isManual(): boolean;
        isCompatible(pTarget: IRenderTarget): boolean;
        _notifyRenderTargetAttached(pTarget: IRenderTarget): void;
        _notifyRenderTargetDetached(pTarget: IRenderTarget): void;
    }
}
declare module akra {
    interface AIFPSStat {
        last: number;
        avg: number;
        best: number;
        worst: number;
    }
    interface ITimeStat {
        best: number;
        worst: number;
    }
    interface IFrameStats {
        fps: AIFPSStat;
        time: ITimeStat;
        polygonsCount: number;
    }
}
declare module akra {
    interface IBox {
        getWidth(): number;
        getHeight(): number;
        getDepth(): number;
        left: number;
        top: number;
        right: number;
        bottom: number;
        front: number;
        back: number;
        contains(pDest: IBox): boolean;
        isEqual(pDest: IBox): boolean;
        setPosition(iLeft: number, iTop: number, iWidth: number, iHeight: number, iFront?: number, iDepth?: number): void;
        toString(): string;
    }
}
declare module akra {
    enum EPixelFormats {
        UNKNOWN = 0,
        L8 = 1,
        BYTE_L = 1,
        L16 = 2,
        SHORT_L = 2,
        A8 = 3,
        BYTE_A = 3,
        A4L4 = 4,
        BYTE_LA = 5,
        R5G6B5 = 6,
        B5G6R5 = 7,
        R3G3B2 = 31,
        A4R4G4B4 = 8,
        A1R5G5B5 = 9,
        R8G8B8 = 10,
        B8G8R8 = 11,
        A8R8G8B8 = 12,
        A8B8G8R8 = 13,
        B8G8R8A8 = 14,
        R8G8B8A8 = 28,
        X8R8G8B8 = 26,
        X8B8G8R8 = 27,
        BYTE_RGB = 10,
        BYTE_BGR = 11,
        BYTE_BGRA = 14,
        BYTE_RGBA = 28,
        BYTE_ABGR = 13,
        BYTE_ARGB = 12,
        A2R10G10B10 = 15,
        A2B10G10R10 = 16,
        DXT1 = 17,
        DXT2 = 18,
        DXT3 = 19,
        DXT4 = 20,
        DXT5 = 21,
        FLOAT16_R = 32,
        FLOAT16_RGB = 22,
        FLOAT16_RGBA = 23,
        FLOAT32_R = 33,
        FLOAT32_RGB = 24,
        FLOAT32_RGBA = 25,
        FLOAT16_GR = 35,
        FLOAT32_GR = 36,
        FLOAT32_DEPTH = 29,
        DEPTH8 = 44,
        BYTE_DEPTH = 44,
        DEPTH16 = 45,
        SHORT_DEPTH = 45,
        DEPTH32 = 46,
        DEPTH24STENCIL8 = 47,
        SHORT_RGBA = 30,
        SHORT_GR = 34,
        SHORT_RGB = 37,
        PVRTC_RGB2 = 38,
        PVRTC_RGBA2 = 39,
        PVRTC_RGB4 = 40,
        PVRTC_RGBA4 = 41,
        R8 = 42,
        RG8 = 43,
        TOTAL = 48,
    }
    interface IPixelFormatList {
        [index: number]: EPixelFormats;
    }
    /**
    * Flags defining some on/off properties of pixel formats
    */
    enum EPixelFormatFlags {
        HASALPHA = 1,
        COMPRESSED = 2,
        FLOAT = 4,
        DEPTH = 8,
        NATIVEENDIAN = 16,
        LUMINANCE = 32,
        STENCIL = 64,
    }
    /** Pixel component format */
    enum EPixelComponentTypes {
        BYTE = 0,
        SHORT = 1,
        INT = 2,
        FLOAT16 = 3,
        FLOAT32 = 4,
        COUNT = 5,
    }
    enum EFilters {
        NEAREST = 0,
        LINEAR = 1,
        BILINEAR = 2,
        BOX = 3,
        TRIANGLE = 4,
        BICUBIC = 5,
    }
}
declare module akra {
    interface IPixelBuffer extends IHardwareBuffer, IRenderResource {
        getWidth(): number;
        getHeight(): number;
        getDepth(): number;
        getFormat(): EPixelFormats;
        create(iFlags: number): boolean;
        create(iWidth: number, iHeight: number, iDepth: number, eFormat: EPixelFormats, iFlags: number): boolean;
        blit(pSource: IPixelBuffer, pSrcBox: IBox, pDestBox: IBox): boolean;
        blit(pSource: IPixelBuffer): any;
        unwrapFromCubeTexture(pCubeTex: ITexture): boolean;
        blitFromMemory(pSource: IPixelBox): boolean;
        blitFromMemory(pSource: IPixelBox, pDestBox?: IBox): boolean;
        blitToMemory(pDest: IPixelBox): boolean;
        blitToMemory(pSrcBox: IBox, pDest: IPixelBox): boolean;
        getRenderTarget(): IRenderTarget;
        lock(iLockFlags: number): IPixelBox;
        lock(iOffset: number, iSize: number, iLockFlags?: number): IPixelBox;
        lock(pLockBox: IBox, iLockFlags?: number): IPixelBox;
        readPixels(pDestBox: IPixelBox): boolean;
        _clearRTT(iZOffset: number): void;
        reset(): void;
        reset(iSize: number): void;
        reset(iWidth: number, iHeight: number): void;
    }
}
declare module akra {
    interface IColor extends IColorValue {
        getRgba(): number;
        setRgba(iValue: number): void;
        getArgb(): number;
        setArgb(iValue: number): void;
        getBgra(): number;
        setBgra(iValue: number): void;
        getAbgr(): number;
        setAbgr(iValue: number): void;
        getHtml(): string;
        getHtmlRgba(): string;
        set(rgba: string): IColor;
        set(cColor: IColorValue): IColor;
        set(cColor: IColor): IColor;
        set(r?: number, g?: number, b?: number, a?: number): IColor;
        set(fGray: number, fAlpha: number): IColor;
        /** Clamps colour value to the range [0, 1].
        */
        saturate(): void;
        /** As saturate, except that this colour value is unaffected and
        the saturated colour value is returned as a copy. */
        saturateCopy(): IColor;
        add(cColor: IColor, ppDest?: IColor): IColor;
        subtract(cColor: IColor, ppDest?: IColor): IColor;
        multiply(cColor: IColor, ppDest?: IColor): IColor;
        multiply(fScalar: number, ppDest?: IColor): IColor;
        divide(cColor: IColor, ppDest?: IColor): IColor;
        divide(fScalar: number, ppDest?: IColor): IColor;
        /** Set a colour value from Hue, Saturation and Brightness.
        @param hue Hue value, scaled to the [0,1] range as opposed to the 0-360
        @param saturation Saturation level, [0,1]
        @param brightness Brightness level, [0,1]
        */
        setHSB(fHue: number, fSaturation: number, fBrightness: number): IColor;
        /** Convert the current colour to Hue, Saturation and Brightness values.
        @param hue Output hue value, scaled to the [0,1] range as opposed to the 0-360
        @param saturation Output saturation level, [0,1]
        @param brightness Output brightness level, [0,1]
        */
        getHSB(pHsb?: number[]): number[];
        toString(): string;
    }
}
declare module akra {
    interface IPixelBox extends IBox {
        format: EPixelFormats;
        data: Uint8Array;
        rowPitch: number;
        slicePitch: number;
        setConsecutive(): void;
        getRowSkip(): number;
        getSliceSkip(): number;
        isConsecutive(): boolean;
        getConsecutiveSize(): number;
        getSubBox(pDest: IBox, pDestPixelBox?: IPixelBox): IPixelBox;
        getColorAt(pColor: IColor, x: number, y: number, z?: number): IColor;
        setColorAt(pColor: IColor, x: number, y: number, z?: number): void;
        scale(pDest: IPixelBox, eFilter?: EFilters): boolean;
        refresh(pExtents: IBox, ePixelFormat: EPixelFormats, pPixelData: Uint8Array): void;
    }
}
declare module akra {
    enum EFramebuffer {
        FRONT = 0,
        BACK = 1,
        AUTO = 2,
    }
    enum EStatFlags {
        NONE = 0,
        FPS = 1,
        AVG_FPS = 2,
        BEST_FPS = 4,
        WORST_FPS = 8,
        TRIANGLE_COUNT = 16,
        ALL = 65535,
    }
    interface IRenderTarget extends IEventProvider, IControllable {
        getName(): string;
        setName(sName: string): void;
        getWidth(): number;
        getHeight(): number;
        getColorDepth(): number;
        getTotalViewports(): number;
        getPriority(): number;
        getRenderer(): IRenderer;
        getDepthBuffer(): IDepthBuffer;
        attachDepthBuffer(pBuffer: IDepthBuffer): boolean;
        attachDepthPixelBuffer(pBuffer: IPixelBuffer): boolean;
        attachDepthTexture(pTexture: ITexture): boolean;
        detachDepthBuffer(): void;
        detachDepthTexture(): void;
        detachDepthPixelBuffer(): void;
        destroy(): void;
        update(): void;
        updateStats(): void;
        getCustomAttribute(sName: string): any;
        addViewport(pViewport: IViewport): IViewport;
        getViewport(iIndex: number): IViewport;
        getViewportByZIndex(iZIndex: number): IViewport;
        hasViewportByZIndex(iZIndex: number): boolean;
        removeViewport(iZIndex: number): boolean;
        removeAllViewports(): number;
        getPolygonCount(): number;
        getStatistics(): IFrameStats;
        getLastFPS(): number;
        getAverageFPS(): number;
        getBestFPS(): number;
        getWorstFPS(): number;
        getBestFrameTime(): number;
        getWorstFrameTime(): number;
        resetStatistics(): void;
        isActive(): boolean;
        setActive(isActive?: boolean): void;
        setAutoUpdated(isAutoUpdate?: boolean): void;
        isAutoUpdated(): boolean;
        isPrimary(): boolean;
        readPixels(ppDest?: IPixelBox, eFramebuffer?: EFramebuffer): IPixelBox;
        _beginUpdate(): void;
        _updateViewport(iZIndex: number, bUpdateStatistics?: boolean): void;
        _updateViewport(pViewport: IViewport, bUpdateStatistics?: boolean): void;
        _updateAutoUpdatedViewports(bUpdateStatistics?: boolean): void;
        _endUpdate(): void;
        preUpdate: ISignal<(pTarget: IRenderTarget) => void>;
        postUpdate: ISignal<(pTarget: IRenderTarget) => void>;
        viewportPreUpdate: ISignal<(pTarget: IRenderTarget, pViewport: IViewport) => void>;
        viewportPostUpdate: ISignal<(pTarget: IRenderTarget, pViewport: IViewport) => void>;
        viewportAdded: ISignal<(pTarget: IRenderTarget, pViewport: IViewport) => void>;
        viewportRemoved: ISignal<(pTarget: IRenderTarget, pViewport: IViewport) => void>;
        resized: ISignal<(pTarget: IRenderTarget, iWidth: number, iHeight: number) => void>;
        cameraRemoved: ISignal<(pTarget: IRenderTarget, pCamera: ICamera) => void>;
    }
}
declare module akra {
    interface IRenderPass extends IUnique {
        setForeign(sName: string, fValue: number): void;
        setForeign(sName: string, bValue: boolean): void;
        setTexture(sName: string, pTexture: ITexture): void;
        setUniform(sName: string, pValue: any): void;
        setStruct(sName: string, pValue: any): void;
        setRenderState(eState: ERenderStates, eValue: ERenderStateValues): void;
        setSamplerTexture(sName: string, sTexture: string): void;
        setSamplerTexture(sName: string, pTexture: ITexture): void;
        getRenderTarget(): IRenderTarget;
        setRenderTarget(pTarget: IRenderTarget): void;
        getPassInput(): IAFXPassInputBlend;
        setPassInput(pInput: IAFXPassInputBlend, isNeedRelocate: boolean): void;
        blend(sComponentName: string, iPass: number): boolean;
        activate(): void;
        deactivate(): void;
        isActive(): boolean;
    }
}
declare module akra {
    interface IRenderMethod extends IResourcePoolItem {
        /** Are all materials/effects loaded? */
        isReady(): boolean;
        getEffect(): IEffect;
        setEffect(pEffect: IEffect): void;
        getSurfaceMaterial(): ISurfaceMaterial;
        setSurfaceMaterial(pSurfaceMaterial: ISurfaceMaterial): void;
        getMaterial(): IMaterial;
        setForeign(sName: string, pValue: any, iPass?: number): void;
        setUniform(sName: string, pValue: any, iPass?: number): void;
        setTexture(sName: string, pValue: ITexture, iPass?: number): void;
        setRenderState(eState: ERenderStates, eValue: ERenderStateValues, iPass?: number): void;
        setSamplerTexture(sName: string, pTexture: ITexture, iPass?: number): void;
        setSamplerTexture(sName: string, sTexture: string, iPass?: number): void;
        isEqual(pRenderMethod: IRenderMethod): boolean;
        _getPassInput(iPass: number): IAFXPassInputBlend;
    }
}
declare module akra {
    interface IRenderTechnique extends IEventProvider {
        getTotalPasses(): number;
        getModified(): number;
        destroy(): void;
        getPass(n: number): IRenderPass;
        getMethod(): IRenderMethod;
        setMethod(pMethod: IRenderMethod): any;
        isReady(): boolean;
        setState(sName: string, pValue: any): void;
        setForeign(sName: string, pValue: any): void;
        setStruct(sName: string, pValue: any): void;
        setTextureBySemantics(sName: string, pValue: any): void;
        setShadowSamplerArray(sName: string, pValue: any): void;
        setVec2BySemantic(sName: string, pValue: any): void;
        copyTechniqueOwnComponentBlend(pFrom: IRenderTechnique): void;
        addComponent(iComponentHandle: number, iShift?: number, iPass?: number): boolean;
        addComponent(pComponent: IAFXComponent, iShift?: number, iPass?: number): boolean;
        addComponent(sComponent: string, iShift?: number, iPass?: number): boolean;
        delComponent(iComponentHandle: number, iShift?: number, iPass?: number): boolean;
        delComponent(sComponent: string, iShift?: number, iPass?: number): boolean;
        delComponent(pComponent: IAFXComponent, iShift?: number, iPass?: number): boolean;
        hasComponent(sComponent: string, iShift?: number, iPass?: number): boolean;
        hasOwnComponent(sComponent: string, iShift?: number, iPass?: number): boolean;
        hasPostEffect(): boolean;
        isPostEffectPass(iPass: number): boolean;
        isLastPass(iPass: number): boolean;
        isFirstPass(iPass: number): boolean;
        isLastPostEffectPass(iPass: number): boolean;
        isFreeze(): boolean;
        updatePasses(bSaveOldUniformValue: boolean): void;
        _blockPass(iPass: number): void;
        _setBlendPassTypes(pTypes: EPassTypes[]): void;
        _setComposer(pComposer: IAFXComposer): void;
        _getComposer(): IAFXComposer;
        _renderTechnique(pViewport: IViewport, pRenderable: IRenderableObject, pSceneObject: ISceneObject): void;
        render: ISignal<(pTech: IRenderTechnique, iPass: number, pRenderable: IRenderableObject, pSceneObject: ISceneObject, pViewport: IViewport) => void>;
    }
}
declare module akra {
    enum ERenderDataBufferOptions {
        VB_READABLE,
        RD_ADVANCED_INDEX,
        RD_SINGLE_INDEX,
        RD_RENDERABLE,
    }
    interface IRenderDataCollection extends IBuffer, IReferenceCounter {
        getBuffer(): IVertexBuffer;
        getByteLength(): number;
        getLength(): number;
        getEngine(): IEngine;
        getOptions(): number;
        getData(sUsage: string): IVertexData;
        getData(iOffset: number): IVertexData;
        getRenderData(iSubset: number): IRenderData;
        getEmptyRenderData(ePrimType: EPrimitiveTypes, eOptions?: ERenderDataBufferOptions): IRenderData;
        getDataLocation(sSemantics: string): number;
        allocateData(pDataDecl: IVertexDeclaration, pData: ArrayBufferView, isCommon?: boolean): number;
        allocateData(pDataDecl: IVertexDeclaration, pData: ArrayBuffer, isCommon?: boolean): number;
        allocateData(pDeclData: IVertexElementInterface[], pData: ArrayBufferView, isCommon?: boolean): number;
        allocateData(pDeclData: IVertexElementInterface[], pData: ArrayBuffer, isCommon?: boolean): number;
        destroy(): void;
        _draw(): void;
        _draw(iSubset: number): void;
        _allocateData(pVertexDecl: IVertexDeclaration, iSize: number): IVertexData;
        _allocateData(pVertexDecl: IVertexDeclaration, pData: ArrayBufferView): IVertexData;
        _allocateData(pVertexDecl: IVertexDeclaration, pData: ArrayBuffer): IVertexData;
        _allocateData(pDeclData: IVertexElementInterface[], iSize: number): IVertexData;
        _allocateData(pDeclData: IVertexElementInterface[], pData: ArrayBufferView): IVertexData;
        _allocateData(pDeclData: IVertexElementInterface[], pData: ArrayBuffer): IVertexData;
    }
}
declare module akra {
    enum ERenderDataAttributeTypes {
        STATIC = 0,
        DYNAMIC = 1,
    }
    enum ERenderDataTypes {
        ISOLATED = 0,
        INDEXED = 1,
        I2I = 2,
        DIRECT = 3,
    }
    enum ERenderDataOptions {
        ADVANCED_INDEX = 65536,
        SINGLE_INDEX = 131072,
        RENDERABLE = 262144,
    }
    interface IRenderDataType {
        new(): IRenderData;
    }
    interface IRenderData extends IReferenceCounter {
        getBuffer(): IRenderDataCollection;
        _getAttribBuffer(eType: ERenderDataAttributeTypes): IVertexBuffer;
        /**
        * Allocate data for rendering.
        */
        allocateData(pDataDecl: IVertexElementInterface[], pData: ArrayBuffer, hasIndex?: boolean): number;
        allocateData(pDataDecl: IVertexElementInterface[], pData: ArrayBufferView, hasIndex?: boolean): number;
        allocateData(pDataDecl: IVertexDeclaration, pData: ArrayBuffer, hasIndex?: boolean): number;
        allocateData(pDataDecl: IVertexDeclaration, pData: ArrayBufferView, hasIndex?: boolean): number;
        /**
        * Remove data from this render data.
        */
        releaseData(iDataLocation: number): void;
        allocateAttribute(pAttrDecl: IVertexElementInterface[], pData: ArrayBuffer, eType?: ERenderDataAttributeTypes, bSilent?: boolean): boolean;
        allocateAttribute(pAttrDecl: IVertexDeclaration, pData: ArrayBuffer, eType?: ERenderDataAttributeTypes, bSilent?: boolean): boolean;
        allocateAttribute(pAttrDecl: IVertexElementInterface[], pData: ArrayBufferView, eType?: ERenderDataAttributeTypes, bSilent?: boolean): boolean;
        allocateAttribute(pAttrDecl: IVertexDeclaration, pData: ArrayBufferView, eType?: ERenderDataAttributeTypes, bSilent?: boolean): boolean;
        allocateIndex(pAttrDecl: IVertexDeclaration, pData: ArrayBuffer): boolean;
        allocateIndex(pAttrDecl: IVertexDeclaration, pData: ArrayBufferView): boolean;
        allocateIndex(pAttrDecl: IVertexElementInterface[], pData: ArrayBuffer): boolean;
        allocateIndex(pAttrDecl: IVertexElementInterface[], pData: ArrayBufferView): boolean;
        addIndexSet(usePreviousDataSet?: boolean, ePrimType?: EPrimitiveTypes, sName?: string): number;
        getNumIndexSet(): number;
        getIndexSetName(iSet: number): string;
        selectIndexSet(iSet: number): boolean;
        selectIndexSet(sName: string): boolean;
        getIndexSet(): number;
        findIndexSet(sName: string): number;
        /**
        * Specifies uses advanced index.
        */
        hasAttributes(): boolean;
        useAdvancedIndex(): boolean;
        useSingleIndex(): boolean;
        useMultiIndex(): boolean;
        /** mark index set as renderable */
        setRenderable(iIndexSet: number, bValue: boolean): void;
        isRenderable(iIndexSet: number): boolean;
        /** Mark this RenderData as renderable. */
        isRenderable(): boolean;
        setRenderable(bValue: boolean): void;
        hasSemantics(sSemantics: string, bSearchComplete?: boolean): boolean;
        getDataLocation(iDataLocation: number): number;
        getDataLocation(sSemantics: string): number;
        getIndexFor(sSemantics: string): ArrayBufferView;
        getIndexFor(iDataLocation: number): ArrayBufferView;
        getIndices(): IBufferData;
        getPrimitiveCount(): number;
        getPrimitiveType(): EPrimitiveTypes;
        getAdvancedIndexData(sSemantics: string): IVertexData;
        index(sData: string, sSemantics: string, useSame?: boolean, iBeginWith?: number, bForceUsage?: boolean): boolean;
        index(iData: number, sSemantics: string, useSame?: boolean, iBeginWith?: number, bForceUsage?: boolean): boolean;
        toString(): string;
        _allocateData(pDataDecl: IVertexDeclaration, pData: ArrayBuffer, eType: ERenderDataTypes): number;
        _draw(pTechnique: IRenderTechnique, pViewport: IViewport, pRenderable: IRenderableObject, pSceneObject: ISceneObject): void;
        _getFlow(iDataLocation: number): IDataFlow;
        _getFlow(sSemantics: string, bSearchComplete?: boolean): IDataFlow;
        _getData(iDataLocation: number, bSearchOnlyInCurrentMap?: boolean): IVertexData;
        _getData(sSemanticsn: string, bSearchOnlyInCurrentMap?: boolean): IVertexData;
        _addData(pVertexData: IVertexData, iFlow?: number, eType?: ERenderDataTypes): number;
        _setup(pCollection: IRenderDataCollection, iId: number, ePrimType?: EPrimitiveTypes, eOptions?: number): boolean;
        _setIndexLength(iLength: number): any;
        _getComposer(): IAFXComposer;
    }
}
declare module akra {
    enum ECompareFunction {
        ALWAYS_FAIL = 0,
        ALWAYS_PASS = 1,
        LESS = 2,
        LESS_EQUAL = 3,
        EQUAL = 4,
        NOT_EQUAL = 5,
        GREATER_EQUAL = 6,
        GREATER = 7,
    }
    enum ECullingMode {
        NONE = 1,
        CLOCKWISE = 2,
        ANTICLOCKWISE = 3,
    }
    enum EFrameBufferTypes {
        COLOR = 1,
        DEPTH = 2,
        STENCIL = 4,
    }
    interface IViewportState {
        cullingMode: ECullingMode;
        depthTest: boolean;
        depthWrite: boolean;
        depthFunction: ECompareFunction;
        clearColor: IColor;
        clearDepth: number;
        clearBuffers: number;
    }
}
declare module akra {
    interface IDepthRange {
        min: number;
        max: number;
    }
    enum EViewportTypes {
        DEFAULT = -1,
        DSVIEWPORT = 1,
        SHADOWVIEWPORT = 2,
        COLORVIEWPORT = 3,
        TEXTUREVIEWPORT = 4,
        LPPVIEWPORT = 5,
        FORWARDVIEWPORT = 6,
        MIRRORVIEWPORT = 7,
    }
    interface IViewport extends IEventProvider, IClickable, IControllable {
        getLeft(): number;
        getTop(): number;
        getWidth(): number;
        getHeight(): number;
        getActualLeft(): number;
        getActualTop(): number;
        getActualWidth(): number;
        getActualHeight(): number;
        getZIndex(): number;
        getType(): EViewportTypes;
        getBackgroundColor(): IColor;
        setBackgroundColor(cColor: IColor): void;
        getDepthClear(): number;
        setDepthClear(fDepth: number): void;
        viewportDimensionsChanged: ISignal<(pViewport: IViewport) => void>;
        viewportCameraChanged: ISignal<(pViewport: IViewport) => void>;
        render: ISignal<(pViewport: IViewport, pTechnique: IRenderTechnique, iPass: number, pRenderable: IRenderableObject, pSceneObject: ISceneObject) => void>;
        update(): void;
        destroy(): void;
        hide(bValue?: boolean): void;
        startFrame(): void;
        renderObject(pRenderable: IRenderableObject): void;
        endFrame(): void;
        clear(iBuffers?: number, cColor?: IColor, fDepth?: number, iStencil?: number): void;
        getTarget(): IRenderTarget;
        getCamera(): ICamera;
        setCamera(pCamera: ICamera): boolean;
        setDimensions(fLeft: number, fTop: number, fWidth: number, fHeight: number): boolean;
        setDimensions(pRect: IRect2d): boolean;
        getActualDimensions(): IRect2d;
        setClearEveryFrame(isClear: boolean, iBuffers?: number): void;
        getClearEveryFrame(): boolean;
        getClearBuffers(): number;
        setDepthParams(bDepthTest: boolean, bDepthWrite: boolean, eDepthFunction: ECompareFunction): void;
        setCullingMode(eCullingMode: ECullingMode): void;
        setAutoUpdated(bValue?: boolean): void;
        isAutoUpdated(): boolean;
        isUpdated(): boolean;
        _setDefaultRenderMethod(sMethod: string): void;
        _clearUpdatedFlag(): void;
        _updateImpl(): void;
        _getNumRenderedPolygons(): number;
        _updateDimensions(bEmitEvent?: boolean): void;
        _getViewportState(): IViewportState;
        _setTarget(pTarget: IRenderTarget): void;
        _onRender(pTechnique: IRenderTechnique, iPass: number, pRenderable: IRenderableObject, pSceneObject: ISceneObject): void;
    }
}
declare module akra {
    enum ERenderableTypes {
        UNKNOWN = 0,
        MESH_SUBSET = 1,
        SCREEN = 2,
        SPRITE = 3,
    }
    interface IRenderableObject extends IEventProvider, IClickable {
        getRenderMethod(): IRenderMethod;
        setRenderMethod(pMethod: IRenderMethod): void;
        getShadow(): boolean;
        setShadow(bValue: boolean): void;
        getType(): ERenderableTypes;
        getEffect(): IEffect;
        getSurfaceMaterial(): ISurfaceMaterial;
        getData(): IRenderData;
        getMaterial(): IMaterial;
        getRenderer(): IRenderer;
        getTechnique(sName?: string): IRenderTechnique;
        getTechniqueDefault(): IRenderTechnique;
        getRenderID(pObject: ISceneObject): number;
        destroy(): void;
        setVisible(bVisible?: boolean): void;
        isVisible(): boolean;
        addRenderMethod(pMethod: IRenderMethod, csName?: string): boolean;
        addRenderMethod(csMethod: string, csName?: string): boolean;
        switchRenderMethod(csName: string): boolean;
        switchRenderMethod(pMethod: IRenderMethod): boolean;
        removeRenderMethod(csName: string): boolean;
        getRenderMethodByName(csName?: string): IRenderMethod;
        getRenderMethodDefault(): IRenderMethod;
        isReadyForRender(): boolean;
        isAllMethodsLoaded(): boolean;
        isFrozen(): boolean;
        /**
        * Display with wireframe.
        * @param bEnable Enable/Disable wireframe display mode.
        * @param bOverlay If TRUE, wireframe will be overlayed into default material; Default is TRUE.
        */
        wireframe(bEnable?: boolean, bOverlay?: boolean): boolean;
        render(pViewport: IViewport, csMethod?: string, pSceneObject?: ISceneObject): void;
        _setRenderData(pData: IRenderData): void;
        _setup(pRenderer: IRenderer, csDefaultMethod?: string): void;
        _draw(): void;
        /** Notify, when shadow added or removed. */
        shadowed: ISignal<(pRenderable: IRenderableObject, bValue: boolean) => void>;
        beforeRender: ISignal<(pRenderable: IRenderableObject, pViewport: IViewport, pMethod: IRenderMethod) => void>;
        click: ISignal<(pRenderable: IRenderableObject, pViewport: IViewport, pObject: ISceneObject, x: any, y: any) => void>;
        mousemove: ISignal<(pRenderable: IRenderableObject, pViewport: IViewport, pObject: ISceneObject, x: any, y: any) => void>;
        mousedown: ISignal<(pRenderable: IRenderableObject, pViewport: IViewport, pObject: ISceneObject, x: any, y: any) => void>;
        mouseup: ISignal<(pRenderable: IRenderableObject, pViewport: IViewport, pObject: ISceneObject, x: any, y: any) => void>;
        mouseover: ISignal<(pRenderable: IRenderableObject, pViewport: IViewport, pObject: ISceneObject, x: any, y: any) => void>;
        mouseout: ISignal<(pRenderable: IRenderableObject, pViewport: IViewport, pObject: ISceneObject, x: any, y: any) => void>;
        dragstart: ISignal<(pRenderable: IRenderableObject, pViewport: IViewport, pObject: ISceneObject, x: any, y: any) => void>;
        dragstop: ISignal<(pRenderable: IRenderableObject, pViewport: IViewport, pObject: ISceneObject, x: any, y: any) => void>;
        dragging: ISignal<(pRenderable: IRenderableObject, pViewport: IViewport, pObject: ISceneObject, x: any, y: any) => void>;
    }
}
declare module akra {
    interface ISceneObject extends ISceneNode, IControllable, IClickable {
        getTotalRenderable(): number;
        getWorldBounds(): IRect3d;
        getLocalBounds(): IRect3d;
        accessLocalBounds(): IRect3d;
        getShadow(): boolean;
        setShadow(bValue: boolean): void;
        getBillboard(): boolean;
        setBillboard(bValue: boolean): void;
        isBillboard(): boolean;
        getRenderable(i?: number): IRenderableObject;
        getObjectFlags(): number;
        getRenderID(): number;
        /**
        * Get unique render id.
        * Render ID used to identify the object in each pixel of viewport/screen.
        * @param iRenderable Number of renderable object.
        */
        getRenderID(iRenderable: number): number;
        isWorldBoundsNew(): boolean;
        prepareForRender(pViewport: IViewport): void;
        worldBoundsUpdated: ISignal<(pObject: ISceneObject) => void>;
        click: ISignal<(pObject: ISceneObject, pViewport: IViewport, pRenderable: IRenderableObject, x: number, y: number) => void>;
        mousemove: ISignal<(pObject: ISceneObject, pViewport: IViewport, pRenderable: IRenderableObject, x: number, y: number) => void>;
        mousedown: ISignal<(pObject: ISceneObject, pViewport: IViewport, pRenderable: IRenderableObject, x: number, y: number) => void>;
        mouseup: ISignal<(pObject: ISceneObject, pViewport: IViewport, pRenderable: IRenderableObject, x: number, y: number) => void>;
        mouseover: ISignal<(pObject: ISceneObject, pViewport: IViewport, pRenderable: IRenderableObject, x: number, y: number) => void>;
        mouseout: ISignal<(pObject: ISceneObject, pViewport: IViewport, pRenderable: IRenderableObject, x: number, y: number) => void>;
        dragstart: ISignal<(pObject: ISceneObject, pViewport: IViewport, pRenderable: IRenderableObject, x: number, y: number) => void>;
        dragstop: ISignal<(pObject: ISceneObject, pViewport: IViewport, pRenderable: IRenderableObject, x: number, y: number) => void>;
        dragging: ISignal<(pObject: ISceneObject, pViewport: IViewport, pRenderable: IRenderableObject, x: number, y: number) => void>;
    }
}
declare module akra {
    interface ISphere {
        center: IVec3;
        radius: number;
        getCircle(): ICircle;
        setCircle(pCircle: ICircle): void;
        getZ(): number;
        setZ(fZ: number): void;
        set(): ISphere;
        set(pSphere: ISphere): ISphere;
        set(v3fCenter: IVec3, fRadius: number): ISphere;
        set(fCenterX: number, fCenterY: number, fCenterZ: number, fRadius: number): ISphere;
        clear(): ISphere;
        isEqual(pSphere: ISphere): boolean;
        isClear(): boolean;
        isValid(): boolean;
        offset(v3fOffset: IVec3): ISphere;
        expand(fInc: number): ISphere;
        normalize(): ISphere;
        transform(m4fMatrix: IMat4): ISphere;
    }
}
declare module akra {
    interface IRay3d {
        point: IVec3;
        normal: IVec3;
    }
}
declare module akra {
    interface IPlane3d {
        normal: IVec3;
        distance: number;
        set(): IPlane3d;
        set(pPlane: IPlane3d): IPlane3d;
        set(v3fNormal: IVec3, fDistance: number): IPlane3d;
        set(v3fPoint1: IVec3, v3fPoint2: IVec3, v3fPoint3: IVec3): IPlane3d;
        clear(): IPlane3d;
        negate(): IPlane3d;
        normalize(): IPlane3d;
        isEqual(pPlane: IPlane3d): boolean;
        projectPointToPlane(v3fPoint: IVec3, v3fDestination?: IVec3): IVec3;
        intersectRay3d(pRay: IRay3d, vDest: IVec3): boolean;
        solveForX(fY: number, fZ: number): number;
        solveForY(fX: number, fZ: number): number;
        solveForZ(fX: number, fY: number): number;
        signedDistance(v3fPoint: IVec3): number;
        toString(): string;
    }
}
declare module akra {
    interface IFrustum {
        leftPlane: IPlane3d;
        rightPlane: IPlane3d;
        topPlane: IPlane3d;
        bottomPlane: IPlane3d;
        nearPlane: IPlane3d;
        farPlane: IPlane3d;
        getFrustumVertices(): IVec3[];
        set(): IFrustum;
        set(pFrustum: IFrustum): IFrustum;
        set(pLeftPlane: IPlane3d, pRightPlane: IPlane3d, pTopPlane: IPlane3d, pBottomPlane: IPlane3d, pNearPlane: IPlane3d, pFarPlane: IPlane3d): IFrustum;
        calculateFrustumVertices(): IVec3[];
        extractFromMatrix(m4fProjection: IMat4, m4fWorld?: IMat4, pSearchRect?: IRect3d): IFrustum;
        isEqual(pFrustum: IFrustum): boolean;
        getPlanePoints(sPlaneKey: string, pDestination?: IVec3[]): IVec3[];
        testPoint(v3fPoint: IVec3): boolean;
        testRect(pRect: IRect3d): boolean;
        testSphere(pSphere: ISphere): boolean;
        testFrustum(pFrustum: IFrustum): boolean;
        getViewDirection(v3fDirection?: IVec3): IVec3;
        toString(): string;
    }
}
declare module akra {
    /** ObjectArray export interface */
    interface IObjectArray<T> {
        /** number of element in array */
        getLength(): number;
        /** lock array for writing */
        lock(): void;
        /**
        * unlock array.
        */
        unlock(): void;
        /**
        * Is arrat can be modified?
        */
        isLocked(): boolean;
        /**
        * Remove all elements from array;
        * @param {Bool=false} bRemoveLinks Remove old pointers to data.
        */
        clear(bRemoveLinks?: boolean): IObjectArray<T>;
        /** Get value of <n> element. */
        value(n: number): T;
        /** Set value for <n> element. */
        set(n: number, data: T): IObjectArray<T>;
        /** Fill ObjectArray from T <Array> */
        fromArray(elements: T[], iOffset?: number, iSize?: number): IObjectArray<T>;
        /** Push element to end of array */
        push(element: T): IObjectArray<T>;
        /** Get & remove last element in array */
        pop(): T;
        /** Complitly remove all data from array */
        release(): IObjectArray<T>;
        /** Swap elements in array */
        swap(i: number, j: number): IObjectArray<T>;
        takeAt(iPos: any): T;
    }
}
declare module akra {
    enum ECameraParameters {
        CONST_ASPECT = 1,
    }
    enum ECameraTypes {
        PERSPECTIVE = 0,
        ORTHO = 1,
        OFFSET_ORTHO = 2,
    }
    interface ICamera extends ISceneNode {
        getViewMatrix(): IMat4;
        getProjectionMatrix(): IMat4;
        getProjViewMatrix(): IMat4;
        getTargetPos(): IVec3;
        getViewDistance(): number;
        getSearchRect(): IRect3d;
        getFrustum(): IFrustum;
        getFOV(): number;
        setFOV(fValue: number): void;
        getAspect(): number;
        setAspect(fValue: number): void;
        getNearPlane(): number;
        setNearPlane(fValue: number): void;
        getFarPlane(): number;
        setFarPlane(fValue: number): void;
        setParameter(eParam: ECameraParameters, pValue: any): void;
        isConstantAspect(): boolean;
        setProjParams(fFOV: number, fAspect: number, fNearPlane: number, fFarPlane: number): void;
        setOrthoParams(fWidth: number, fHeight: number, fNearPlane: number, fFarPlane: number): void;
        setOffsetOrthoParams(fMinX: number, fMaxX: number, fMinY: number, fMaxY: number, fNearPlane: number, fFarPlane: number): void;
        projectPoint(v3fPoint: IVec3, v3fDestination?: IVec3): IVec3;
        isProjParamsNew(): boolean;
        recalcProjMatrix(): void;
        isActive(): boolean;
        display(iList?: number): IObjectArray<ISceneObject>;
        _renderScene(pViewport: IViewport): void;
        _keepLastViewport(pViewport: IViewport): void;
        _getLastViewport(): IViewport;
        _getNumRenderedFaces(): number;
        _notifyRenderedFaces(nFaces: number): void;
        _getLastResults(iList?: number): IObjectArray<ISceneObject>;
        getDepthRange(): IDepthRange;
    }
}
declare module akra {
    interface ILightParameters {
    }
    enum ELightTypes {
        UNKNOWN = 0,
        PROJECT = 1,
        OMNI = 2,
        SUN = 3,
    }
    interface ILightPoint extends ISceneNode {
        getParams(): ILightParameters;
        getLightType(): ELightTypes;
        /** optimized camera frustum for better shadow casting */
        getOptimizedCameraFrustum(): IFrustum;
        isEnabled(): boolean;
        setEnabled(bValue: boolean): void;
        isShadowCaster(): boolean;
        setShadowCaster(bValue: boolean): void;
        getLightingDistance(): number;
        setLightingDistance(fValue: number): void;
        isRestricted(): boolean;
        setRestrictedLocalBounds(pBox: IRect3d): void;
        getRestrictedLocalBounds(): IRect3d;
        restrictLight(bEnable: boolean, pBox?: IRect3d): void;
        create(isShadowCaster?: boolean, iMaxShadowResolution?: number): boolean;
        /** false if lighting not active or it's effect don't seen */
        _prepareForLighting(pCamera: ICamera): boolean;
        _calculateShadows(): void;
    }
}
declare module akra {
    interface ISkin extends IEventProvider {
        /**
        * Event is sent when the skin transformed.
        */
        transformed: ISignal<(pSkin: ISkin) => void>;
        getData(): IRenderDataCollection;
        getSkeleton(): ISkeleton;
        getTotalBones(): number;
        /**
        * @copydoc Skin::getAffectedNode()
        */
        getAffectedNode(iNode: number): ISceneNode;
        /**
        * Set binding matrix.
        * @see <bind_shape_matrix> in Collada.
        */
        setBindMatrix(m4fMatrix: IMat4): void;
        /**
        * @see <bind_shape_matrix> in Collada.
        */
        getBindMatrix(): IMat4;
        getBoneName(iBone: number): string;
        getBoneIndex(sBone: string): number;
        /**
        * Bone offset matrices.
        * @see Bone offset matrices in Collada.
        */
        getBoneOffsetMatrix(iBone: number): IMat4;
        getBoneOffsetMatrix(sBoneName: string): IMat4;
        setBoneOffsetMatrices(pMatrices: IMat4[]): void;
        /** Set skeleton. */
        setSkeleton(pSkeleton: ISkeleton): boolean;
        /**
        * Make a skin dependent on scene node whose names match the
        * names of the bones that affect the skin.
        */
        attachToScene(pRootNode: ISceneNode): boolean;
        /**
        * Set names of bones, that affect to skin.
        */
        setBoneNames(pNames: string[]): boolean;
        /**
        * Weights.
        */
        setWeights(pWeights: Float32Array): boolean;
        /**
        * разметка влияний на вершины
        * пары: {число влияний, адресс индексов влияний}
        */
        getInfluenceMetaData(): IVertexData;
        /**
        * инф. о вляиниях на вершины
        * пары: {индекс матрицы кости, индекс веса}
        */
        getInfluences(): IVertexData;
        setInfluences(pInfluencesCount: number[], pInfluences: Float32Array): boolean;
        /**
        * Short way to call setWeights() && setIfluences();
        */
        setVertexWeights(pInfluencesCount: number[], pInfluences: Float32Array, pWeights: Float32Array): boolean;
        /**
        * Recalculate skin matrices and fill it to video memory.
        * @return Status showing if changed bone matrix with the last update.
        */
        applyBoneMatrices(bForce?: boolean): boolean;
        /**
        * Is skin ready to use?
        */
        isReady(): boolean;
        /**
        * Data with result matrices.
        */
        getBoneTransforms(): IVertexData;
        /**
        * Check, is this skin affect to data?
        */
        isAffect(pData: IVertexData): boolean;
        /**
        * Add skin info to data with vertices.
        */
        _attach(pData: IVertexData): void;
    }
}
declare module akra {
    interface IMeshSubset extends IEventProvider, IRenderableObject {
        skinAdded: ISignal<(pSubset: IMeshSubset, pSkin: ISkin) => void>;
        skinRemoved: ISignal<(pSubset: IMeshSubset, pSkin: ISkin) => void>;
        /**
        * Emit when mesh geometry transformated by skin.
        */
        transformed: ISignal<(pSubset: IMeshSubset, pSkin: ISkin) => void>;
        /**
        * @return False - if persisted geometry.
        */
        update(): boolean;
        getName(): string;
        getMesh(): IMesh;
        getSkin(): ISkin;
        getBoundingBox(): IRect3d;
        getBoundingSphere(): ISphere;
        /**
        * @copydoc Skin::getTotalBones()
        * Alias for Skin::getTotalBones()
        */
        getTotalBones(): number;
        getBoneLocalBound(sBone: string): IRect3d;
        getBoneLocalBound(iBone: number): IRect3d;
        getInitialGeometryBoundingBox(): IRect3d;
        getInitialGeometryBoundingSphere(): ISphere;
        computeNormals(): void;
        computeTangents(): void;
        computeBinormals(): void;
        isSkinned(): boolean;
        isOptimizedSkinned(): boolean;
        setSkin(pSkin: ISkin): boolean;
        destroy(): void;
    }
}
declare module akra {
    enum EMeshOptions {
        HB_READABLE,
        RD_ADVANCED_INDEX,
    }
    enum EMeshCloneOptions {
        GEOMETRY_ONLY = 0,
        SHARED_GEOMETRY = 1,
    }
    interface IMesh extends IEventProvider {
        /** notify, when one of substets added or removed shadow */
        shadowed: ISignal<(pMesh: IMesh, pSubset: IMeshSubset, bShadow: boolean) => void>;
        getName(): string;
        getData(): IRenderDataCollection;
        getLength(): number;
        getBoundingBox(): IRect3d;
        getBoundingSphere(): ISphere;
        /**
        * Return TRUE if after last update mesh geometry was changed.
        */
        isGeometryChanged(): boolean;
        isSkinned(): boolean;
        getShadow(): boolean;
        setShadow(bValue: boolean): void;
        getOptions(): number;
        getEngine(): IEngine;
        destroy(): void;
        clone(iCloneOptions: number): IMesh;
        createSubset(sName: string, ePrimType: EPrimitiveTypes, eOptions?: number): any;
        freeSubset(sName: string): boolean;
        getSubset(sMesh: string): IMeshSubset;
        getSubset(i: number): IMeshSubset;
        appendSubset(sName: string, pData: IRenderData): IMeshSubset;
        setSkin(pSkin: ISkin): void;
        createSkin(): ISkin;
        calculateBoundingBox(): boolean;
        calculateBoundingSphere(): boolean;
        isReadyForRender(): boolean;
        /** Updtae all submeshes(apply bone matricie for skinned submeshes) */
        update(): boolean;
    }
}
declare module akra {
    interface ISceneModel extends ISceneObject {
        setVisible(bValue: boolean): void;
        getMesh(): IMesh;
        setMesh(pMesh: IMesh): void;
        isVisible(): boolean;
    }
}
declare module akra {
    interface ISprite extends ISceneObject {
        setTexture(pTex: ITexture): void;
    }
}
declare module akra {
    interface IDisplayList<T extends ISceneNode> extends IEventProvider {
        getName(): string;
        _findObjects(pCamera: ICamera, pResultArray?: IObjectArray<T>, bQuickSearch?: boolean): IObjectArray<T>;
        _setup(pScene: IScene3d): void;
    }
}
declare module akra {
    interface IShadowCaster extends ICamera {
        getLightPoint(): ILightPoint;
        getFace(): number;
        getAffectedObjects(): IObjectArray<ISceneObject>;
        getOptimizedProjection(): IMat4;
        /** casted shadows in the last frame*/
        isShadowCasted(): boolean;
        setShadowCasted(bValue: boolean): void;
        _optimizeProjectionMatrix(pEffectiveCameraFrustum: IFrustum): void;
    }
}
declare module akra {
    interface ITerrainSection extends ISceneObject {
        getSectorX(): number;
        getSectorY(): number;
        getTerrainSystem(): ITerrain;
        getSectionIndex(): number;
        getHeightY(): number;
        getHeightX(): number;
        getVertexDescription(): IVertexElementInterface[];
        _internalCreate(pParentSystem: ITerrain, iSectorX: number, iSectorY: number, iHeightMapX: number, iHeightMapY: number, iXVerts: number, iYVerts: number, pWorldRect: IRect2d): boolean;
        _createRenderable(): void;
    }
}
declare module akra {
    interface ITriTreeNode {
        baseNeighbor: ITriTreeNode;
        leftNeighbor: ITriTreeNode;
        rightNeighbor: ITriTreeNode;
        leftChild: ITriTreeNode;
        rightChild: ITriTreeNode;
    }
    interface ITriangleNodePool {
        getMaxCount(): number;
        getNextTriNode(): number;
        setNextTriNode(iNextTriNode: number): void;
        getPool(): ITriTreeNode[];
        setPool(pPool: ITriTreeNode[]): void;
        request(): ITriTreeNode;
        reset(): void;
    }
}
declare module akra {
    interface ITerrainSectionROAM extends ITerrainSection {
        getTriangleA(): ITriTreeNode;
        getTriangleB(): ITriTreeNode;
        getQueueSortValue(): number;
        getTerrainSystem(): ITerrainROAM;
        _internalCreate(pParentSystem: ITerrainROAM, iSectorX: number, iSectorY: number, iHeightMapX: number, iHeightMapY: number, iXVerts: number, iYVerts: number, pWorldRect: IRect2d, iStartIndex?: number): boolean;
        _initTessellationData(): void;
        reset(): void;
        tessellate(fScale: number, fLimit: number): void;
        buildTriangleList(): void;
    }
}
declare module akra {
    interface IAnimation extends IAnimationBase {
        getTotalTracks(): number;
        push(pTrack: IAnimationTrack): void;
        attach(pTarget: ISceneNode): void;
        getTracks(): IAnimationTrack[];
        getTrack(i: number): IAnimationTrack;
        frame(sName: string, fTime: number): IPositionFrame;
        extend(pAnimation: IAnimation): void;
    }
}
declare module akra {
    interface ICollada extends IModel {
        getOptions(): IColladaLoadOptions;
        setOptions(pOptions: IColladaLoadOptions): void;
        getAsset(): IColladaAsset;
        getAnimations(): IColladaAnimation[];
        getAnimation(i: number): IColladaAnimation;
        getFilename(): string;
        getBasename(): string;
        isVisualSceneLoaded(): boolean;
        isAnimationLoaded(): boolean;
        extractFullScene(pScene: IScene3d): IModelEntry;
        extractFullScene(pNode: ISceneNode): IModelEntry;
        extractFullScene(): IModelEntry;
        extractAnimations(): IAnimation[];
        extractAnimation(i: number): IAnimation;
        /**
        * Works only for static geometry.
        */
        extractModel(pScene: IScene3d, sMeshName?: string): ISceneModel;
        extractModel(pNode: ISceneNode, sMeshName?: string): ISceneModel;
        extractModel(sMeshName?: string): ISceneModel;
        /**
        * Works only for static geometry.
        */
        extractMesh(sMeshName?: string): IMesh;
        /**
        * @deprecated Use Collada::extractFullScene() instead.
        */
        attachToScene(pNode: ISceneNode): IModelEntry;
        attachToScene(pScene: IScene3d): IModelEntry;
        parse(sXMLData: string, pOptions?: IColladaLoadOptions): boolean;
        loadResource(sFilename?: string, pOptions?: IColladaLoadOptions): boolean;
    }
    interface IColladaAnimationLoadOptions {
        /** @unsupported */
        pose?: boolean;
    }
    interface IColladaImageLoadOptions {
        flipY?: boolean;
    }
    interface IColladaLoadOptions extends IModelLoadOptions {
        /** Display all meshes with wireframe overlay. Default to FALSE.*/
        wireframe?: boolean;
        /** Enable/Disable shadows for all models. Dfault to TRUE.*/
        shadows?: boolean;
        /**
        * Determines whether to load animations.
        * Use NULL to skip animation loading.
        * Default to not null;
        */
        animation?: IColladaAnimationLoadOptions;
        /** Determines whether to create visual scene, written in Collada. Default to TRUE.*/
        scene?: boolean;
        /**
        * Determines whether to extends all animation with default mesh poses.
        * Default to TRUE.
        * @system
        */
        extractPoses?: boolean;
        /**
        * Upload skeletons from collada.
        * @system
        * @deprectaed
        */
        skeletons?: ISkeleton[];
        /** @note: unsupported now... */
        images?: IColladaImageLoadOptions;
        /** Name of scene root node. */
        name?: string;
    }
    interface IXMLExplorer {
        (pXML: Element, sName?: string): void;
    }
    interface IColladaTarget {
        value: number;
        object?: IColladaEntry;
        source?: IColladaEntry;
    }
    interface IColladaEntry {
        id?: string;
        sid?: string;
        name?: string;
        xml?: Element;
    }
    interface IColladaEntryMap {
        [id: string]: IColladaEntry;
    }
    interface IColladaLibrary extends IColladaEntry {
        /** Real type is IColladaEntryMap, but typescript don`t allow to fo this */
        [element: string]: any;
    }
    interface IColladaEffectLibrary extends IColladaLibrary {
        effect: {
            [id: string]: IColladaEffect;
        };
    }
    interface IColladaEntryLoader {
        (pXML: Element): IColladaEntry;
    }
    interface IColladaUnknownFormat {
        name: string[];
        type: string[];
    }
    /** Stride for collada formats, discretized at 32 bits. */
    interface IColladaFormatStrideTable {
        [format: string]: number;
    }
    interface IColladaLinkMap {
        [link: string]: any;
    }
    interface IColladaLibraryMap {
        [library: string]: IColladaLibrary;
    }
    interface IColladaLibraryTemplate {
        lib: string;
        element: string;
    }
    interface IColladaArray extends IColladaEntry {
        [i: number]: any;
    }
    interface IColladaUnit extends IColladaEntry {
        name: string;
        meter: number;
    }
    interface IColladaContributor extends IColladaEntry {
        author?: string;
        authoringTool?: string;
        comments?: string;
        copyright?: string;
        sourceData?: any;
    }
    interface IColladaAsset extends IColladaEntry {
        unit: IColladaUnit;
        upAxis: string;
        title?: string;
        subject?: string;
        created: string;
        modified: string;
        keywords?: string[];
        contributor?: IColladaContributor;
    }
    interface IColladaInstance extends IColladaEntry {
        url?: string;
    }
    interface IColladaAnnotate extends IColladaEntry {
        name: string;
        value: string;
    }
    interface IColladaNewParam extends IColladaEntry {
        sid: string;
        annotate: IColladaAnnotate;
        semantics: string;
        modifier: string;
        value: any;
        type: string;
    }
    interface IColladaNewParamMap {
        [sid: string]: IColladaNewParam;
    }
    interface IColladaParam extends IColladaEntry {
        name: string;
        type: string;
    }
    interface IColladaAccessor extends IColladaEntry {
        source?: string;
        data: IColladaArray;
        count: number;
        stride: number;
        params: IColladaParam[];
    }
    interface IColladaTechniqueCommon extends IColladaEntry {
        accessor: IColladaAccessor;
        perspective: IColladaPerspective;
    }
    interface IColladaSource extends IColladaEntry {
        name: string;
        array: Object;
        techniqueCommon: IColladaTechniqueCommon;
    }
    interface IColladaInput extends IColladaEntry {
        semantics: string;
        source: IColladaSource;
        offset: number;
        set: string;
        array?: any[];
        accessor?: IColladaAccessor;
    }
    interface IColladaTransform extends IColladaEntry {
        transform: string;
        value: any;
    }
    interface IColladaRotate extends IColladaTransform {
        value: IVec4;
    }
    interface IColladaTranslate extends IColladaTransform {
        value: IVec3;
    }
    interface IColladaScale extends IColladaTransform {
        value: IVec3;
    }
    interface IColladaMatrix extends IColladaTransform {
        value: IMat4;
    }
    interface IColladaVertices extends IColladaEntry {
        inputs: {
            [semantics: string]: IColladaInput;
        };
    }
    interface IColladaJoints extends IColladaEntry {
        inputs: {
            [input: string]: IColladaInput;
        };
    }
    interface IColladaPolygons extends IColladaEntry {
        name: string;
        inputs: IColladaInput[];
        p: number[];
        material: string;
        type?: EPrimitiveTypes;
        count: number;
    }
    interface IColladaMesh extends IColladaEntry {
        sources: IColladaSource[];
        polygons: IColladaPolygons[];
    }
    interface IColladaConvexMesh extends IColladaEntry {
    }
    interface IColladaSpline extends IColladaEntry {
    }
    interface IColladaGeometrie extends IColladaEntry {
        name: string;
        mesh: IColladaMesh;
        convexMesh: IColladaConvexMesh;
        spline: IColladaSpline;
    }
    interface IColladaMorph extends IColladaEntry {
    }
    interface IColladaVertexWeights extends IColladaEntry {
        count: number;
        inputs: IColladaInput[];
        weightInput: IColladaInput;
        vcount: number[];
        v: number[];
    }
    interface IColladaSkin extends IColladaEntry {
        shapeMatrix: IMat4;
        sources: IColladaSource[];
        geometry: IColladaGeometrie;
        joints: IColladaJoints;
        vertexWeights: IColladaVertexWeights;
    }
    interface IColladaController extends IColladaEntry {
        name: string;
        skin: IColladaSkin;
        morph: IColladaMorph;
    }
    interface IColladaImage extends IColladaEntry {
        name: string;
        data: any;
        path: string;
        format?: string;
        depth?: number;
        height?: number;
        width?: number;
    }
    interface IColladaSurface extends IColladaEntry {
        initFrom: string;
    }
    interface IColladaSampler2D extends IColladaEntry {
        source: string;
        wrapS: string;
        wrapT: string;
        minFilter: string;
        mipFilter: string;
        magFilter: string;
    }
    interface IColladaTexture extends IColladaEntry {
        texcoord: string;
        sampler: IColladaNewParam;
        surface: IColladaNewParam;
        image: IColladaImage;
    }
    interface IColladaInstanceEffect extends IColladaInstance {
        parameters: Object;
        techniqueHint: IStringMap;
        effect: IColladaEffect;
    }
    interface IColladaPhong extends IColladaEntry {
        diffuse: IColorValue;
        specular: IColorValue;
        ambient: IColorValue;
        emissive: IColorValue;
        shininess: number;
        reflective: IColorValue;
        reflectivity: number;
        transparent: IColorValue;
        transparency: number;
        indexOfRefraction: number;
        textures?: {
            diffuse: IColladaTexture;
            specular: IColladaTexture;
            ambient: IColladaTexture;
            emissive: IColladaTexture;
            normal: IColladaTexture;
        };
        material: IMaterial;
    }
    interface IColladaEffectTechnique extends IColladaEntry {
        sid: string;
        type: string;
        value: IColladaEntry;
    }
    interface IColladaProfileCommon extends IColladaEntry {
        technique: IColladaEffectTechnique;
        newParam: IColladaNewParamMap;
    }
    interface IColladaEffect extends IColladaEntry {
        profileCommon: IColladaProfileCommon;
    }
    interface IColladaMaterial extends IColladaEntry {
        name: string;
        instanceEffect: IColladaInstanceEffect;
    }
    interface IColladaTechniqueValue extends IColladaEntry {
    }
    interface IColladaBindVertexInput extends IColladaEntry {
        semantics: string;
        inputSemantic: string;
        inputSet: number;
    }
    interface IColladaBindVertexInputMap {
        [semantics: string]: IColladaBindVertexInput;
    }
    interface IColladaInstanceMaterial extends IColladaInstance {
        symbol: string;
        target: string;
        vertexInput: IColladaBindVertexInputMap;
        material: IColladaMaterial;
    }
    interface IColladaInstanceCamera extends IColladaInstance {
        camera: IColladaCamera;
    }
    interface IColladaInstanceLight extends IColladaInstance {
        light: IColladaLight;
    }
    interface IColladaBindMaterial extends IColladaEntry {
        [index: string]: any;
    }
    interface IColladaInstanceGeometry extends IColladaInstance {
        geometry: IColladaGeometrie;
        material: IColladaBindMaterial;
    }
    interface IColladaInstanceController extends IColladaInstance {
        controller: IColladaController;
        material: IColladaBindMaterial;
        skeletons: string[];
    }
    interface IColladaPerspective extends IColladaEntry {
        xfov: number;
        yfov: number;
        znear: number;
        zfar: number;
        aspect: number;
    }
    interface IColladaOptics extends IColladaEntry {
        techniqueCommon: IColladaTechniqueCommon;
    }
    interface IColladaCamera extends IColladaEntry {
        optics: IColladaOptics;
    }
    interface IColladaLight extends IColladaEntry {
    }
    interface IColladaNode extends IColladaEntry {
        sid: string;
        name: string;
        type: string;
        layer: string;
        transform: IMat4;
        geometry: IColladaInstanceGeometry[];
        controller: IColladaInstanceController[];
        camera: IColladaInstanceCamera[];
        childNodes: IColladaNode[];
        depth: number;
        transforms: IColladaTransform[];
        constructedNode: ISceneNode;
    }
    interface IColladaVisualScene extends IColladaEntry {
        name: string;
        nodes: IColladaNode[];
    }
    interface IColladaAnimationSampler extends IColladaEntry {
        inputs: {
            [semantics: string]: IColladaInput;
        };
    }
    interface IColladaAnimationChannel extends IColladaEntry {
        target: IColladaTarget;
        sampler: IColladaAnimationSampler;
    }
    interface IColladaAnimation extends IColladaEntry {
        name: string;
        sources: IColladaSource[];
        samplers: IColladaAnimationSampler[];
        channels: IColladaAnimationChannel[];
        animations?: IColladaAnimation[];
    }
    interface IColladaScene {
    }
    interface IColladaDocument {
        asset?: IColladaAsset;
        libEffects?: IColladaEffectLibrary;
        libMaterials?: IColladaLibrary;
        libGeometries?: IColladaLibrary;
        libVisualScenes?: IColladaLibrary;
        libAnimations?: IColladaLibrary;
        scene?: IColladaScene;
    }
    interface IColladaAnimationClip extends IColladaEntry {
        name?: string;
        start: number;
        end: number;
    }
}
declare module akra {
    enum EModelFormats {
        UNKNOWN = 0,
        COLLADA = 4096,
        OBJ = 8192,
    }
    interface IModelLoadOptions {
    }
    interface IModel extends IResourcePoolItem {
        getByteLength(): number;
        getModelFormat(): EModelFormats;
        loadResource(sFilename?: string, pOptions?: IModelLoadOptions): boolean;
    }
}
declare module akra {
    enum EImageFlags {
        COMPRESSED = 1,
        CUBEMAP = 2,
        TEXTURE_3D = 4,
    }
    enum EImageCubeFlags {
        POSITIVE_X = 1,
        NEGATIVE_X = 2,
        POSITIVE_Y = 4,
        NEGATIVE_Y = 8,
        POSITIVE_Z = 16,
        NEGATIVE_Z = 32,
    }
    interface ICubemap {
        negX: string;
        posX: string;
        negY: string;
        posY: string;
        negZ: string;
        posZ: string;
    }
    interface IImg extends IResourcePoolItem {
        getByteLength(): number;
        getWidth(): number;
        getHeight(): number;
        getDepth(): number;
        getNumFaces(): number;
        getNumMipMaps(): number;
        getFormat(): EPixelFormats;
        getFlags(): number;
        getCubeFlags(): number;
        set(pSrc: IImg): IImg;
        load(sFileName: string, fnCallBack?: Function): IImg;
        load(pData: Uint8Array, sType?: string, fnCallBack?: Function): IImg;
        load(pCanvas: HTMLCanvasElement, fnCallBack?: Function): IImg;
        loadRawData(pData: Uint8Array, iWidth: number, iHeight: number, iDepth?: number, eFormat?: EPixelFormats, nFaces?: number, nMipMaps?: number): IImg;
        loadDynamicImage(pData: Uint8Array, iWidth: number, iHeight: number, iDepth?: number, eFormat?: EPixelFormats, nFaces?: number, nMipMaps?: number): IImg;
        create(iWidth: number, iHeight: number, iDepth: number, eFormat: EPixelFormats, nFaces: number, nMipMaps: number): IImg;
        convert(eFormat: EPixelFormats): boolean;
        getRawSpan(): number;
        getPixelSize(): number;
        getBPP(): number;
        getData(): Uint8Array;
        hasFlag(eFlag: EImageFlags): boolean;
        hasAlpha(): boolean;
        isCompressed(): boolean;
        isLuminance(): boolean;
        freeMemory(): any;
        getColorAt(pColor: IColor, x: number, y: number, z?: number): IColor;
        setColorAt(pColor: IColor, x: number, y: number, z?: number): void;
        getPixels(nFace?: number, iMipMap?: number): IPixelBox;
        scale(pDest: IPixelBox, eFilter?: EFilters): boolean;
        resize(iWidth: number, iHeight: number, eFilter?: EFilters): boolean;
        generatePerlinNoise(fScale: number, iOctaves: number, fFalloff: number): void;
        randomChannelNoise(iChannel: number, iMinRange: number, iMaxRange: number): void;
    }
}
declare module akra {
    interface IMegaTexture extends IEventProvider {
        getManualMinLevelLoad(): boolean;
        setManualMinLevelLoad(bManual: boolean): void;
        init(pObject: ISceneObject, sSurfaceTextures: string): void;
        prepareForRender(pViewport: IViewport): void;
        applyForRender(pRenderPass: IRenderPass): void;
        getWidthOrig(iLevel: number): number;
        getHeightOrig(iLevel: number): number;
        setMinLevelTexture(pImg: IImg): any;
    }
}
declare module akra {
    interface ITerrainMaps {
        height: IImg;
        normal: IImg;
    }
    interface ITerrainSampleData {
        iColor: number;
        fScale: number;
    }
    interface ITerrain extends ISceneObject {
        getWorldExtents(): IRect3d;
        getWorldSize(): IVec3;
        getMapScale(): IVec3;
        getSectorCountX(): number;
        getSectorCountY(): number;
        getSectorSize(): IVec2;
        getTableWidth(): number;
        getTableHeight(): number;
        getSectorShift(): number;
        getDataFactory(): IRenderDataCollection;
        getMaxHeight(): number;
        getTerrain2DLength(): number;
        getMegaTexture(): IMegaTexture;
        getManualMegaTextureInit(): boolean;
        setManualMegaTextureInit(bManual: boolean): void;
        getShowMegaTexture(): boolean;
        setShowMegaTexture(bShow: boolean): void;
        isCreate(): boolean;
        /**
        * Создаем terrain
        * @param {ISceneNode} pRootNode Узел на сцене к которому цепляется terrain.
        * @param {IImageMap} pMap набор карт для terrain.
        * @param {IRect3d} worldExtents Размеры terrain в мире.
        * @param {uint} iShift Количество векторов в секторе (указывается в степенях двойки).
        * @param {uint} iShiftX Количество секторов в terrain по оси X (указывается в степенях двойки).
        * @param {uint} iShiftY Количество секторов в terrain по оси Y (указывается в степенях двойки).
        * @param {string} sSurfaceTextures Название мега текстуры.
        */
        init(pMaps: ITerrainMaps, pWorldExtents: IRect3d, iShift: number, iShiftX: number, iShiftY: number, sSurfaceTextures: string, pRootNode?: ISceneNode): boolean;
        initMegaTexture(sSurfaceTextures?: string): void;
        /**
        * Ищет секцию по координате
        */
        findSection(iX: number, iY: number): any;
        /**
        * Возвращает высоту terrain в заданной точке.
        */
        readWorldHeight(iIndex: number): number;
        readWorldHeight(iMapX: number, iMapY: number): number;
        readWorldNormal(v3fNormal: IVec3, iMapX: number, iMapY: number): IVec3;
        projectPoint(v3fCoord: IVec3, v3fDestenation: IVec3): boolean;
        /**
        * Destructor
        */
        destroy(): void;
        /**
        * Сброс параметров.
        */
        reset(): void;
        _tableIndex(iMapX: number, iMapY: number): number;
        _useVertexNormal(): boolean;
    }
}
declare module akra {
    interface ITerrainROAM extends ITerrain {
        getVerts(): number[];
        getIndex(): Float32Array;
        getMaxTriTreeNodes(): number;
        getVertexId(): number;
        getLocalCameraCoord(): IVec3;
        getTessellationScale(): number;
        setTessellationScale(fScale: number): void;
        getTessellationLimit(): number;
        setTessellationLimit(fLimit: number): void;
        getUseTessellationThread(): boolean;
        setUseTessellationThread(bUseThread: boolean): void;
        getTotalIndex(): number;
        setTotalIndex(iTotalIndices: number): void;
        requestTriNode(): ITriTreeNode;
        addToTessellationQueue(pSection: ITerrainSectionROAM): boolean;
        resetWithCamera(pCamera: ICamera): void;
    }
}
declare module akra {
    interface IModelEntry extends ISceneNode {
        getResource(): IModel;
    }
}
declare module akra {
    interface IText3d extends ISceneNode {
    }
    interface IScene3d extends IScene {
        getTotalDL(): number;
        getRootNode(): ISceneNode;
        recursivePreUpdate(): void;
        updateCamera(): boolean;
        updateScene(): boolean;
        recursiveUpdate(): void;
        isUpdated(): boolean;
        /** @note for DEBUG usage only */
        createObject(sName?: string): ISceneObject;
        createNode(sName?: string): ISceneNode;
        createModel(sName?: string): ISceneModel;
        createCamera(sName?: string): ICamera;
        createLightPoint(eType?: ELightTypes, isShadowCaster?: boolean, iMaxShadowResolution?: number, sName?: string): ILightPoint;
        createSprite(sName?: string): ISprite;
        createJoint(sName?: string): IJoint;
        createText3d(sName?: string): IText3d;
        createTerrain(sName?: string): ITerrain;
        createTerrainROAM(sName?: string): ITerrainROAM;
        createTerrainSection(sName?: string): ITerrainSection;
        createTerrainSectionROAM(sName?: string): ITerrainSectionROAM;
        _createModelEntry(pModel: IModel): IModelEntry;
        _createShadowCaster(pLightPoint: ILightPoint, iFace?: number, sName?: string): IShadowCaster;
        getDisplayList(index: number): IDisplayList<ISceneNode>;
        getDisplayListByName(csName: string): number;
        addDisplayList(pList: IDisplayList<ISceneNode>): number;
        delDisplayList(index: number): boolean;
        displayListAdded: ISignal<(pScene: IScene3d, pList: IDisplayList<ISceneNode>, iIndex: number) => void>;
        displayListRemoved: ISignal<(pScene: IScene3d, pList: IDisplayList<ISceneNode>, iIndex: number) => void>;
        beforeUpdate: ISignal<(pScene: IScene3d) => void>;
        postUpdate: ISignal<(pScene: IScene3d) => void>;
        preUpdate: ISignal<(pScene: IScene3d) => void>;
        nodeAttachment: ISignal<(pScene: IScene3d, pNode: ISceneNode) => void>;
        nodeDetachment: ISignal<(pScene: IScene3d, pNode: ISceneNode) => void>;
        _render(pCamera: ICamera, pViewport: IViewport): void;
    }
}
declare module akra {
    interface IScene2d extends IScene {
    }
}
declare module akra {
    interface ISceneManager extends IManager {
        createScene3D(sName?: string): IScene3d;
        createUI(): IScene2d;
        getEngine(): IEngine;
        getScene3D(): IScene3d;
        getScene3D(sName: string): IScene3d;
        getScene3D(iScene: number): IScene3d;
        getScene2D(): IScene2d;
        getScene2D(sName: string): IScene2d;
        getScene2D(iScene: number): IScene2d;
        getScene(iScene?: number, eType?: ESceneTypes): IScene;
        update(): void;
        notifyUpdateScene(): void;
        notifyPreUpdateScene(): void;
    }
}
declare module akra {
    interface IParticleManager extends IManager {
    }
}
declare module akra {
    enum EResourceCodes {
        INVALID_CODE = 4294967295,
    }
    interface IResourceCode {
        getFamily(): number;
        setFamily(iFamily: number): void;
        getType(): number;
        setType(iType: number): void;
        /** Пеерводит текущее состояние идентифиакора в невалидное */
        setInvalid(): void;
        /** operator "<" */
        less(pSrc: IResourceCode): boolean;
        /** operator = */
        eq(pSrc: IResourceCode): IResourceCode;
        valueOf(): number;
        toNumber(): number;
    }
}
declare module akra {
    interface IResourcePool<T extends IResourcePoolItem> extends IEventProvider {
        getFourcc(): number;
        setFourcc(iFourcc: number): void;
        getManager(): IResourcePoolManager;
        /** Добавление данного пула в менеджер ресурсво по его коду */
        registerResourcePool(pCode: IResourceCode): void;
        /** Удаление данного пула в менеджер ресурсво по его коду */
        unregisterResourcePool(): void;
        /** По имени ресурса возвращает его хендл */
        findResourceHandle(sName: string): number;
        /** По хендлу ресурва возвращает его имя */
        findResourceName(iHandle: number): string;
        /** set resource name */
        setResourceName(iHandle: number, sName: string): void;
        initialize(iGrowSize: number): void;
        destroy(): void;
        clean(): void;
        destroyAll(): void;
        restoreAll(): void;
        disableAll(): void;
        isInitialized(): boolean;
        createResource(sResourceName: string): T;
        loadResource(sResourceName: string): T;
        saveResource(pResource: T): boolean;
        destroyResource(pResource: T): void;
        findResource(sName: string): T;
        getResource(iHandle: number): T;
        getResources(): T[];
        createdResource: ISignal<(pPool: IResourcePool<T>, pResource: T) => void>;
    }
}
declare module akra {
    interface IResourceWatcherFunc {
        (nLoaded?: number, nTotal?: number, pTarget?: IResourcePoolItem): void;
    }
}
declare module akra {
    interface IObjLoadOptions extends IModelLoadOptions {
        shadows?: boolean;
        name?: string;
        transform?: IMat4;
    }
    interface IObj extends IModel {
        getFilename(): string;
        getBasename(): string;
        parse(sXMLData: string, pOptions?: IObjLoadOptions): boolean;
        loadResource(sFilename?: string, pOptions?: IObjLoadOptions): boolean;
        uploadVertexes(pPositions: Float32Array, pIndexes?: Float32Array): void;
        setOptions(pOptions: IObjLoadOptions): void;
        attachToScene(pNode: ISceneNode): IModelEntry;
        attachToScene(pScene: IScene3d): IModelEntry;
    }
}
/** Семейства ресурсов */
declare module akra {
    enum EResourceFamilies {
        VIDEO_RESOURCE = 0,
        AUDIO_RESOURCE = 1,
        GAME_RESOURCE = 2,
        TOTAL_RESOURCE_FAMILIES = 3,
    }
    /** Члены семейства видео ресурсов */
    enum EVideoResources {
        TEXTURE_RESOURCE = 0,
        VIDEOBUFFER_RESOURCE = 1,
        VERTEXBUFFER_RESOURCE = 2,
        INDEXBUFFER_RESOURCE = 3,
        EFFECT_RESOURCE = 4,
        RENDERMETHOD_RESOURCE = 5,
        MODEL_RESOURCE = 6,
        EFFECTFILEDATA_RESOURCE = 7,
        IMAGE_RESOURCE = 8,
        SURFACEMATERIAL_RESOURCE = 9,
        SHADERPROGRAM_RESOURCE = 10,
        COMPONENT_RESOURCE = 11,
        EFFECTDATA_RESOURCE = 12,
        TOTAL_VIDEO_RESOURCES = 13,
    }
    enum EAudioResources {
        TOTAL_AUDIO_RESOURCES = 0,
    }
    enum EGameResources {
        TOTAL_GAME_RESOURCES = 0,
    }
    /** Конструктор класса, занимается очисткой списков пулов по семействам ресурсвов и краты пулов по коду ресурсов */
    interface IResourcePoolManager extends IManager {
        getTexturePool(): IResourcePool<ITexture>;
        getSurfaceMaterialPool(): IResourcePool<ISurfaceMaterial>;
        getVertexBufferPool(): IResourcePool<IVertexBuffer>;
        getVideoBufferPool(): IResourcePool<IVertexBuffer>;
        getIndexBufferPool(): IResourcePool<IIndexBuffer>;
        getTextureBufferPool(): IResourcePool<IPixelBuffer>;
        getRenderMethodPool(): IResourcePool<IRenderMethod>;
        getColladaPool(): IResourcePool<ICollada>;
        getObjPool(): IResourcePool<IObj>;
        getImagePool(): IResourcePool<IImg>;
        getShaderProgramPool(): IResourcePool<IShaderProgram>;
        getEffectPool(): IResourcePool<IEffect>;
        getComponentPool(): IResourcePool<IAFXComponent>;
        getEffectDataPool(): IResourcePool<IResourcePoolItem>;
        getRenderBufferPool(): IResourcePool<IPixelBuffer>;
        /** Регистрируется пул ресурсов опредленного типа в менеджере русурсов */
        registerResourcePool(pCode: IResourceCode, pPool: IResourcePool<IResourcePoolItem>): void;
        /** Удаляет пул ресурсов опредленного типа в менеджере русурсов */
        unregisterResourcePool(pCode: IResourceCode): IResourcePool<IResourcePoolItem>;
        /** Удаление ресурсов определенного семества */
        destroyResourceFamily(eFamily: EResourceFamilies): void;
        restoreResourceFamily(eFamily: EResourceFamilies): void;
        disableResourceFamily(eFamily: EResourceFamilies): void;
        cleanResourceFamily(eFamily: EResourceFamilies): void;
        destroyResourceType(pCode: IResourceCode): void;
        restoreResourceType(pCode: IResourceCode): void;
        disableResourceType(pCode: IResourceCode): void;
        cleanResourceType(pCode: IResourceCode): void;
        /** Возвращает пул ресурса опредленного типа по его коду */
        findResourcePool(pCode: IResourceCode): IResourcePool<IResourcePoolItem>;
        /**
        * Возвращает хендл конкретного ресурса по его имени из конкретного пула опредленного типа
        **/
        findResourceHandle(pCode: IResourceCode, sName: string): number;
        /** Возвращает конкретный ресурс по его имени из конкретного пула опредленного типа */
        findResource(pCode: IResourceCode, sName: string): IResourcePoolItem;
        findResource(pCode: IResourceCode, iHandle: number): IResourcePoolItem;
        getModelPoolByFormat(eFormat: EModelFormats): IResourcePool<IResourcePoolItem>;
        /** Удаление всех ресурсов */
        destroyAll(): void;
        restoreAll(): void;
        disableAll(): void;
        clean(): void;
        createDeviceResources(): boolean;
        destroyDeviceResources(): boolean;
        restoreDeviceResources(): boolean;
        disableDeviceResources(): boolean;
        getEngine(): IEngine;
        createRenderMethod(sResourceName: string): IRenderMethod;
        createTexture(sResourceName: string): ITexture;
        createSurfaceMaterial(sResourceName: string): ISurfaceMaterial;
        createEffect(sResourceName: string): IEffect;
        createVertexBuffer(sResourceName: string): IVertexBuffer;
        createVideoBuffer(sResourceName: string): IVertexBuffer;
        createIndexBuffer(sResourceName: string): IIndexBuffer;
        createShaderProgram(sResourceName: string): IShaderProgram;
        createModel(sResourceName: string, eFormat?: EModelFormats): IModel;
        createImg(sResourceName: string): IImg;
        loadModel(sFilename: string, pOptions?: IModelLoadOptions): IModel;
        loadImage(sFilename: string): IImg;
    }
}
declare module akra {
    enum EUtilTimerCommands {
        TIMER_RESET = 0,
        TIMER_START = 1,
        TIMER_STOP = 2,
        TIMER_ADVANCE = 3,
        TIMER_GET_ABSOLUTE_TIME = 4,
        TIMER_GET_APP_TIME = 5,
        TIMER_GET_ELAPSED_TIME = 6,
    }
    interface IUtilTimer {
        getAbsoluteTime(): number;
        getAppTime(): number;
        getElapsedTime(): number;
        start(): boolean;
        stop(): boolean;
        reset(): boolean;
        execCommand(e: EUtilTimerCommands): number;
        isStopped(): boolean;
    }
}
declare module akra {
    enum EDependenceStatuses {
        PENDING = 0,
        INITIALIZATION = 1,
        CHECKING = 2,
        LOADING = 3,
        DOWNLOADING = 4,
        UNPACKING = 5,
        EXTRACTION = 6,
        LOADED = 7,
        REJECTED = 8,
        INTERNAL_UPDATE = 9,
    }
    interface IDepStats {
        status: EDependenceStatuses;
        bytesLoaded: number;
        byteLength: number;
        unpacked: number;
    }
    interface IDep {
        stats?: IDepStats;
        content?: any;
        path: string;
        name?: string;
        comment?: string;
        type?: string;
    }
    interface IDependens {
        files?: IDep[];
        deps?: IDependens;
        root?: string;
    }
    interface IDepEvent {
        source: IDep;
        time: number;
        loaded: number;
        total: number;
        bytesLoaded: number;
        bytesTotal: number;
        unpacked: number;
    }
    interface IDepHandler {
        (pEngine: IEngine, pDep: IDep, cb: (pDep: IDep, eStatus: EDependenceStatuses, pData?: any) => void): void;
    }
}
declare module akra {
    enum EGamepadCodes {
        FACE_1 = 0,
        FACE_2 = 1,
        FACE_3 = 2,
        FACE_4 = 3,
        LEFT_SHOULDER = 4,
        RIGHT_SHOULDER = 5,
        LEFT_SHOULDER_BOTTOM = 6,
        RIGHT_SHOULDER_BOTTOM = 7,
        SELECT = 8,
        START = 9,
        LEFT_ANALOGUE_STICK = 10,
        RIGHT_ANALOGUE_STICK = 11,
        PAD_TOP = 12,
        PAD_BOTTOM = 13,
        PAD_LEFT = 14,
        PAD_RIGHT = 15,
    }
    enum EGamepadAxis {
        LEFT_ANALOGUE_HOR = 0,
        LEFT_ANALOGUE_VERT = 1,
        RIGHT_ANALOGUE_HOR = 2,
        RIGHT_ANALOGUE_VERT = 3,
    }
    interface IGamepadMap extends IEventProvider {
        init(): boolean;
        update(): void;
        isActive(): boolean;
        find(sID?: string): Gamepad;
        find(i?: number): Gamepad;
        connected: ISignal<(pGamepadMap: IGamepadMap, pGamepad: Gamepad) => void>;
        disconnected: ISignal<(pGamepadMap: IGamepadMap, pGamepad: Gamepad) => void>;
        updated: ISignal<(pGamepadMap: IGamepadMap, pGamepad: Gamepad) => void>;
    }
}
declare module akra {
    interface ISpriteManager {
        _allocateSprite(pSprite: ISprite): IRenderData;
    }
}
declare module akra {
    interface IEngineOptions {
        /**
        * Path to load the root dependencies.
        * The default path is #config.data .
        * @see config.data
        */
        path?: string;
        /**
        * Additional engine dependencies, like: textures, models, effects etc...
        * @sa deps
        */
        deps?: IDependens;
        /**
        * Enable gamepad support. Similar to IEngine::enableGamepads()
        * @see IEngine::enableGamepads(), IEngine::getGamepads(), IGamepadMap
        */
        gamepads?: boolean;
        /**
        * Additional renderer options.
        * # External resources
        * [WebGL / Context creation parameters](http://www.khronos.org/registry/webgl/specs/latest/1.0/#5.2)
        */
        renderer?: IRendererOptions;
        /**
        * Loading progress callback.
        */
        progress: (e: IDepEvent) => void;
    }
    interface IEngine extends IEventProvider {
        getTime(): number;
        getElapsedTime(): number;
        getScene(): IScene3d;
        getSceneManager(): ISceneManager;
        getParticleManager(): IParticleManager;
        getResourceManager(): IResourcePoolManager;
        getSpriteManager(): ISpriteManager;
        getRenderer(): IRenderer;
        getComposer(): IAFXComposer;
        pause(): void;
        play(): void;
        /** Render one frame. */
        renderFrame(): boolean;
        /** Start exucution(rendering loop). */
        exec(): void;
        isActive(): boolean;
        isPaused(): boolean;
        isLoaded(): boolean;
        isHidden(): boolean;
        isFrozen(): boolean;
        ready(cb?: (pEngine: IEngine) => void): boolean;
        enableGamepads(): boolean;
        getGamepads(): IGamepadMap;
        createMesh(sName?: string, eOptions?: number, pDataBuffer?: IRenderDataCollection): IMesh;
        createRenderDataCollection(iOptions?: number): IRenderDataCollection;
        createBufferMap(): IBufferMap;
        createAnimationController(sName?: string, iOptions?: number): IAnimationController;
        frameStarted: ISignal<(pEngine: IEngine) => void>;
        frameEnded: ISignal<(pEngine: IEngine) => void>;
        depsLoaded: ISignal<(pEngine: IEngine, pDeps: IDependens) => void>;
        inactive: ISignal<(pEngine: IEngine) => void>;
        active: ISignal<(pEngine: IEngine) => void>;
    }
}
declare module akra {
    interface IResourceNotifyRoutineFunc {
        (pSender: IResourcePoolItem, iFlagBit?: number, iResourceFlags?: number, isSet?: boolean): void;
        (pSender: IResourcePoolItem, eEvent?: EResourceItemEvents, iResourceFlags?: number, isSet?: boolean): void;
    }
}
/**
* Отражает состояние ресурса
**/
declare module akra {
    enum EResourceItemEvents {
        CREATED = 0,
        LOADED = 1,
        DISABLED = 2,
        ALTERED = 3,
        TOTALRESOURCEFLAGS = 4,
    }
    interface IResourcePoolItem extends IReferenceCounter, IEventProvider {
        created: ISignal<(pResource: IResourcePoolItem) => void>;
        destroyed: ISignal<(pResource: IResourcePoolItem) => void>;
        loaded: ISignal<(pResource: IResourcePoolItem) => void>;
        unloaded: ISignal<(pResource: IResourcePoolItem) => void>;
        restored: ISignal<(pResource: IResourcePoolItem) => void>;
        disabled: ISignal<(pResource: IResourcePoolItem) => void>;
        altered: ISignal<(pResource: IResourcePoolItem) => void>;
        saved: ISignal<(pResource: IResourcePoolItem) => void>;
        stateChanged: ISignal<(pResource: IResourcePoolItem, eEvent: EResourceItemEvents, iFlags: number, isSet: boolean) => any>;
        /** resource code */
        getResourceCode(): IResourceCode;
        /** resource pool */
        getResourcePool(): IResourcePool<IResourcePoolItem>;
        /** resource handle */
        getResourceHandle(): number;
        /** resource flags */
        getResourceFlags(): number;
        /** Проверка был ли изменен ресур после загрузки */
        getAlteredFlag(): boolean;
        /** Get current Engine. */
        getEngine(): IEngine;
        getManager(): IResourcePoolManager;
        /** Инициализация ресурса, вызывается один раз. Виртуальная. */
        createResource(): boolean;
        /** Уничтожение ресурса. Виртуальная. */
        destroyResource(): boolean;
        /**  Удаление ресурса из энергозависимой памяти. Виртуальная. */
        disableResource(): boolean;
        /** Возвращение ресурса в энегрозависимю память. Виртуальная. */
        restoreResource(): boolean;
        /** Загрузка ресурса из файла, или null при использовании имени ресурса. Виртуальная. */
        loadResource(sFilename?: string): boolean;
        /** Сохранение ресурса в файл, или null при использовании имени ресурса. */
        saveResource(sFilename?: string): boolean;
        /** sinchronize events with other resourse */
        isSyncedTo(eSlot: EResourceItemEvents): boolean;
        isSyncComplete(eSignal: EResourceItemEvents): boolean;
        findRelatedResources(eState: EResourceItemEvents): IResourcePoolItem[];
        sync(pResource: IResourcePoolItem, eSignal: string, eSlot?: string): boolean;
        sync(pResource: IResourcePoolItem, eSignal: EResourceItemEvents, eSlot?: EResourceItemEvents): boolean;
        unsync(pResourceItem: IResourcePoolItem, eSignal: EResourceItemEvents, eSlot?: EResourceItemEvents): boolean;
        /** Установка состояния в созданный */
        notifyCreated(): void;
        /** Установка в состояние не созданный */
        notifyDestroyed(): void;
        /** Уставнока в состояние загруженный */
        notifyLoaded(): void;
        /** Уставнока в состояние незагруженный */
        notifyUnloaded(): void;
        /** Установка в состояние используемый */
        notifyRestored(): void;
        /** Установка в состояние не используемый */
        notifyDisabled(): void;
        /** Установка в состояние не используемый */
        notifyAltered(): void;
        /** Установка в состояние сохраненый */
        notifySaved(): void;
        /** Проверка создан ли ресурс */
        isResourceCreated(): boolean;
        /** Проверка загружен ли ресурс */
        isResourceLoaded(): boolean;
        /** Проверка активен ли ресурс */
        isResourceDisabled(): boolean;
        /** Проверка обновлен ли ресурс */
        isResourceAltered(): boolean;
        /** Пиписывание ресурсу имени */
        setResourceName(sName: string): any;
        /** Поиск имени ресурса */
        findResourceName(): string;
        /** оповещение о уменьшении количесва ссылок на ресурс */
        release(): number;
        setResourceCode(pCode: IResourceCode): void;
        setResourcePool(pPool: IResourcePool<IResourcePoolItem>): void;
        setResourceHandle(iHandle: number): void;
        setResourceFlag(eFlagBit: EResourceItemEvents, isSetting: boolean): boolean;
        setResourceFlag(iFlagBit: number, isSetting: boolean): boolean;
    }
    interface IResourcePoolItemType {
        new(pManager: IResourcePoolManager): IResourcePoolItem;
    }
}
declare module akra {
    interface IRenderResource extends IResourcePoolItem {
    }
}
declare module akra {
    enum ETextureFlags {
        STATIC,
        DYNAMIC,
        READEBLE,
        DYNAMIC_DISCARDABLE,
        AUTOMIPMAP = 256,
        RENDERTARGET = 512,
        DEFAULT,
    }
    enum ETextureFilters {
        UNDEF = 0,
        NEAREST = 9728,
        LINEAR = 9729,
        NEAREST_MIPMAP_NEAREST = 9984,
        LINEAR_MIPMAP_NEAREST = 9985,
        NEAREST_MIPMAP_LINEAR = 9986,
        LINEAR_MIPMAP_LINEAR = 9987,
    }
    enum ETextureWrapModes {
        UNDEF = 0,
        REPEAT = 10497,
        CLAMP_TO_EDGE = 33071,
        MIRRORED_REPEAT = 33648,
    }
    enum ETextureParameters {
        MAG_FILTER = 10240,
        MIN_FILTER = 10241,
        WRAP_S = 10242,
        WRAP_T = 10243,
    }
    enum ETextureTypes {
        TEXTURE_2D = 3553,
        TEXTURE_CUBE_MAP = 34067,
    }
    enum ECubeFace {
        POSITIVE_X = 0,
        NEGATIVE_X = 1,
        POSITIVE_Y = 2,
        NEGATIVE_Y = 3,
        POSITIVE_Z = 4,
        NEGATIVE_Z = 5,
    }
    enum ETextureCubeFlags {
        POSITIVE_X = 1,
        NEGATIVE_X = 2,
        POSITIVE_Y = 4,
        NEGATIVE_Y = 8,
        POSITIVE_Z = 12,
        NEGATIVE_Z = 16,
    }
    enum ETextureUnits {
        TEXTURE0 = 33984,
    }
    interface ITexture extends IRenderResource {
        getWidth(): number;
        getHeight(): number;
        getDepth(): number;
        getFormat(): EPixelFormats;
        getMipLevels(): number;
        getTextureType(): ETextureTypes;
        getByteLength(): number;
        setFlags(iTextureFlag: number): void;
        getFlags(): number;
        getNumFaces(): number;
        getSize(): number;
        isTexture2D(): boolean;
        isTextureCube(): boolean;
        isCompressed(): boolean;
        isValid(): boolean;
        unwrapCubeTexture(pCubeTex: ITexture): boolean;
        create(iWidth: number, iHeight: number, iDepth: number, cFillColor?: IColor, eFlags?: ETextureFlags, nMipLevels?: number, nFaces?: number, eTextureType?: ETextureTypes, eFormat?: EPixelFormats): boolean;
        create(iWidth: number, iHeight: number, iDepth: number, pPixels?: any[], eFlags?: ETextureFlags, nMipLevels?: number, nFaces?: number, eTextureType?: ETextureTypes, eFormat?: EPixelFormats): boolean;
        create(iWidth: number, iHeight: number, iDepth: number, pPixels?: ArrayBufferView, eFlags?: ETextureFlags, nMipLevels?: number, nFaces?: number, eTextureType?: ETextureTypes, eFormat?: EPixelFormats): boolean;
        getBuffer(iFace?: number, iMipmap?: number): IPixelBuffer;
        setFilter(eParam: ETextureParameters, eValue: ETextureFilters): boolean;
        setWrapMode(eParam: ETextureParameters, eValue: ETextureWrapModes): boolean;
        getFilter(eParam: ETextureParameters): ETextureFilters;
        getWrapMode(eParam: ETextureParameters): ETextureWrapModes;
        loadRawData(pData: ArrayBufferView, iWidth: number, iHeight: number, iDepth?: number, eFormat?: EPixelFormats, nFaces?: number, nMipMaps?: number): boolean;
        loadImage(pImage: IImg): boolean;
        loadImages(pImages: IImg[]): boolean;
        loadImages(pImages: string[]): boolean;
        convertToImage(pDestImage: IImg, bIncludeMipMaps: boolean): void;
        copyToTexture(pTarget: ITexture): void;
        createInternalTexture(cFillColor?: IColor): boolean;
        freeInternalTexture(): boolean;
        reset(): void;
        reset(iSize: number): void;
        reset(iWidth: number, iHeight: number): void;
    }
}
declare module akra {
    interface IAFXSamplerState {
        textureName: string;
        texture: ITexture;
        wrap_s: ETextureWrapModes;
        wrap_t: ETextureWrapModes;
        mag_filter: ETextureFilters;
        min_filter: ETextureFilters;
    }
    /** @deprecated Use IMap<IAFXSamplerState> instead. */
    interface IAFXSamplerStateMap {
        [index: string]: IAFXSamplerState;
    }
    /** @deprecated Use IMap<IAFXSamplerState[]> instead. */
    interface IAFXSamplerStateListMap {
        [index: string]: IAFXSamplerState[];
    }
}
declare module akra {
    interface IShaderProgram extends IRenderResource {
        create(csVertex?: string, csPixel?: string): boolean;
        compile(csVertex?: string, csPixel?: string): boolean;
        isLinked(): boolean;
        isValid(): boolean;
        isActive(): boolean;
        setFloat(sName: string, fValue: number): void;
        setInt(sName: string, iValue: number): void;
        setVec2(sName: string, v2fValue: IVec2): void;
        setVec2i(sName: string, v2iValue: IVec2): void;
        setVec3(sName: string, v3fValue: IVec3): void;
        setVec3i(sName: string, v3iValue: IVec3): void;
        setVec4(sName: string, v4fValue: IVec4): void;
        setVec4i(sName: string, v4iValue: IVec4): void;
        setMat3(sName: string, m3fValue: IMat3): void;
        setMat4(sName: string, m4fValue: IMat4): void;
        setFloat32Array(sName: string, pValue: Float32Array): void;
        setInt32Array(sName: string, pValue: Int32Array): void;
        setVec2Array(sName: string, pValue: IVec2[]): void;
        setVec2iArray(sName: string, pValue: IVec2[]): void;
        setVec3Array(sName: string, pValue: IVec3[]): void;
        setVec3iArray(sName: string, pValue: IVec3[]): void;
        setVec4Array(sName: string, pValue: IVec4[]): void;
        setVec4iArray(sName: string, pValue: IVec4[]): void;
        setMat3Array(sName: string, pValue: IMat3[]): void;
        setMat4Array(sName: string, pValue: IMat4[]): void;
        setStruct(sName: string, pData: Object): void;
        setSampler(sName: string, pSampler: IAFXSamplerState): void;
        setSamplerArray(sName: string, pSamplerList: IAFXSamplerState[]): void;
        setTexture(sName: string, pData: ITexture): void;
        applyVertexData(sName: string, pData: IVertexData): void;
        applyBufferMap(pMap: IBufferMap): void;
        setVertexBuffer(sName: string, pBuffer: IVertexBuffer): void;
        _getActiveUniformNames(): string[];
        _getActiveAttributeNames(): string[];
    }
}
declare module akra {
    interface IAFXSamplerBlender {
    }
}
declare module akra {
    interface IAFXAttributeBlendContainer {
        getAttrsInfo(): IAFXVariableBlendInfo[];
        getTexcoordVar(iSlot: number): IAFXVariableDeclInstruction;
        hasTexcoord(iSlot: number): boolean;
        getSlotBySemanticIndex(iIndex: number): number;
        getBufferSlotBySemanticIndex(iIndex: number): number;
        getOffsetVarsBySemantic(sName: string): IAFXVariableDeclInstruction[];
        getOffsetDefault(sName: string): number;
        getTypeBySemanticIndex(iIndex: number): IAFXVariableTypeInstruction;
    }
}
declare module akra {
    interface IShaderInput {
        uniforms: {
            [index: number]: any;
        };
        attrs: {
            [index: number]: any;
        };
        renderStates: IMap<ERenderStateValues>;
    }
}
declare module akra {
    interface IAFXBaseAttrInfo {
        name: string;
        semantic: string;
    }
    interface IAFXMaker extends IUnique {
        getShaderProgram(): IShaderProgram;
        getUniformNames(): string[];
        getAttributeInfo(): IAFXBaseAttrInfo[];
        _create(sVertex: string, sPixel: string): boolean;
        isUniformExists(sName: string): boolean;
        isAttrExists(sName: string): boolean;
        isArray(sName: string): boolean;
        getType(sName: string): EAFXShaderVariableType;
        getLength(sName: string): number;
        setUniform(iLocation: number, pValue: any): void;
        _freeUniformCache(): void;
        _make(pPassInput: IAFXPassInputBlend, pBufferMap: IBufferMap): IShaderInput;
        _initInput(pPassInput: IAFXPassInputBlend, pBlend: IAFXSamplerBlender, pAttrs: IAFXAttributeBlendContainer): boolean;
        _createDataPool(): IShaderInput;
        _getShaderInput(): IShaderInput;
        _releaseShaderInput(pPool: IShaderInput): void;
    }
    interface IAFXMakerMap {
        [index: string]: IAFXMaker;
        [index: number]: IAFXMaker;
    }
}
declare module akra {
    interface IRenderEntry {
        viewport: IViewport;
        renderTarget: IRenderTarget;
        maker: IAFXMaker;
        input: IShaderInput;
        bufferMap: IBufferMap;
        clear(): void;
    }
}
declare module akra {
    interface IRenderQueue {
        execute(bSort?: boolean): void;
        push(pEntry: IRenderEntry): void;
        createEntry(): IRenderEntry;
        releaseEntry(pEntry: IRenderEntry): void;
    }
}
declare module akra {
    interface IAFXObject {
        getName(): string;
        getId(): IAFXIdInstruction;
    }
    interface IAFXVariable extends IAFXObject {
        setName(sName: string): void;
        setType(pType: IAFXVariableTypeInstruction): void;
        getType(): IAFXVariableTypeInstruction;
        initializeFromInstruction(pInstruction: IAFXVariableDeclInstruction): void;
    }
    interface IAFXType extends IAFXObject {
        isBase(): boolean;
        initializeFromInstruction(pInstruction: IAFXTypeDeclInstruction): boolean;
    }
    interface IAFXFunction extends IAFXObject {
        getHash(): string;
    }
    interface IAFXPass extends IAFXObject {
    }
    interface IAFXTechnique extends IAFXObject {
    }
    interface IAFXEffectStats {
        time: number;
    }
    interface IAFXEffect {
        analyze(pTree: parser.IParseTree): boolean;
        setAnalyzedFileName(sFileName: string): void;
        getStats(): IAFXEffectStats;
        clear(): void;
        getTechniqueList(): IAFXTechniqueInstruction[];
    }
}
declare module akra {
    interface IIndexBuffer extends IHardwareBuffer, IRenderResource {
        create(iByteSize: number, iFlags?: number, pData?: ArrayBufferView): boolean;
        getIndexData(iOffset: number, iCount: number, ePrimitiveType: EPrimitiveTypes, eElementsType: EDataTypes): IIndexData;
        getEmptyIndexData(iCount: number, ePrimitiveType: EPrimitiveTypes, eElementsType: EDataTypes): IIndexData;
        freeIndexData(pIndexData: IIndexData): boolean;
        allocateData(ePrimitiveType: EPrimitiveTypes, eElementsType: EDataTypes, pData: ArrayBufferView): IIndexData;
    }
}
declare module akra {
    enum ECanvasTypes {
        TYPE_UNKNOWN = -1,
        TYPE_2D = 1,
        TYPE_3D = 2,
    }
    interface ICanvas {
        getType(): ECanvasTypes;
        isFullscreen(): boolean;
        setFullscreen(isFullscreen?: boolean): void;
    }
}
declare module akra {
    interface ICanvas3d extends ICanvas, IRenderTarget {
        getLeft(): number;
        setLeft(iLeft: number): void;
        getTop(): number;
        setTop(iTop: number): void;
        create(sName: string, iWidth?: number, iHeight?: number, isFullscreen?: boolean): boolean;
        destroy(): void;
        setFullscreen(isFullscreen?: boolean): void;
        setVisible(bVisible?: boolean): void;
        setDeactivateOnFocusChange(bDeactivate?: boolean): void;
        isFullscreen(): boolean;
        isVisible(): boolean;
        isDeactivatedOnFocusChange(): boolean;
        resize(iWidth: number, iHeight: number): void;
    }
}
declare module akra {
    enum ERenderers {
        UNKNOWN = 0,
        WEBGL = 1,
    }
    interface IRendererOptions extends WebGLContextAttributes {
        canvas?: HTMLCanvasElement;
    }
    enum ERenderCapabilitiesCategory {
        C_COMMON = 0,
        C_COMMON_2 = 1,
        C_WEBGL = 2,
        COUNT = 3,
    }
    enum ERenderCapabilities {
        AUTOMIPMAP,
        BLENDING,
        ANISOTROPY,
        DOT3,
        CUBEMAPPING,
        HWSTENCIL,
        VBO,
        VERTEX_PROGRAM,
        FRAGMENT_PROGRAM,
        SCISSOR_TEST,
        TWO_SIDED_STENCIL,
        STENCIL_WRAP,
        HWOCCLUSION,
        USER_CLIP_PLANES,
        VERTEX_FORMAT_UBYTE4,
        INFINITE_FAR_PLANE,
        HWRENDER_TO_TEXTURE,
        TEXTURE_FLOAT,
        NON_POWER_OF_2_TEXTURES,
        TEXTURE_3D,
        POINT_SPRITES,
        POINT_EXTENDED_PARAMETERS,
        VERTEX_TEXTURE_FETCH,
        MIPMAP_LOD_BIAS,
        GEOMETRY_PROGRAM,
        HWRENDER_TO_VERTEX_BUFFER,
        TEXTURE_COMPRESSION,
        TEXTURE_COMPRESSION_DXT,
        TEXTURE_COMPRESSION_VTC,
        TEXTURE_COMPRESSION_PVRTC,
        TEXTURE_COMPRESSION_ATC,
        FIXED_FUNCTION,
        MRT_DIFFERENT_BIT_DEPTHS,
        ALPHA_TO_COVERAGE,
        ADVANCED_BLEND_OPERATIONS,
        RTT_SEPARATE_DEPTHBUFFER,
        RTT_MAIN_DEPTHBUFFER_ATTACHABLE,
        RTT_DEPTHBUFFER_RESOLUTION_LESSEQUAL,
        VERTEX_BUFFER_INSTANCE_DATA,
        CAN_GET_COMPILED_SHADER_BUFFER,
        FBO,
        PBUFFER,
        SEPARATE_SHADER_OBJECTS,
    }
    enum EAttachmentTypes {
        COLOR_ATTACHMENT0 = 36064,
        DEPTH_ATTACHMENT = 36096,
        STENCIL_ATTACHMENT = 36128,
        DEPTH_STENCIL_ATTACHMENT = 33306,
    }
    interface IRenderer extends IEventProvider {
        getType(): ERenderers;
        getEngine(): IEngine;
        debug(bValue?: boolean, useApiTrace?: boolean): boolean;
        isDebug(): boolean;
        isValid(): boolean;
        getError(): any;
        clearFrameBuffer(iBuffer: number, cColor: IColor, fDepth: number, iStencil: number): void;
        _beginRender(): void;
        _renderEntry(pEntry: IRenderEntry): void;
        _endRender(): void;
        _disableAllTextureUnits(): void;
        _disableTextureUnitsFrom(iUnit: number): void;
        _initRenderTargets(): void;
        _updateAllRenderTargets(): void;
        _setViewport(pViewport: IViewport): void;
        _setViewportForRender(pViewport: IViewport): void;
        _getViewport(): IViewport;
        _setRenderTarget(pTarget: IRenderTarget): void;
        _setCullingMode(eMode: ECullingMode): void;
        _setDepthBufferParams(bDepthTest: boolean, bDepthWrite: boolean, eDepthFunction: ECompareFunction, fClearDepth?: number): void;
        hasCapability(eCapability: ERenderCapabilities): boolean;
        attachRenderTarget(pTarget: IRenderTarget): boolean;
        detachRenderTarget(pTarget: IRenderTarget): boolean;
        destroyRenderTarget(pTarget: IRenderTarget): void;
        getActiveProgram(): IShaderProgram;
        getDefaultCanvas(): ICanvas3d;
        createEntry(): IRenderEntry;
        releaseEntry(pEntry: IRenderEntry): void;
        pushEntry(pEntry: IRenderEntry): void;
        executeQueue(bSort?: boolean): void;
        _lockRenderTarget(): void;
        _unlockRenderTarget(): void;
        _isLockRenderTarget(): boolean;
    }
}
declare module akra {
    interface IURI {
        getScheme(): string;
        getUserInfo(): string;
        getFragment(): string;
        getURN(): string;
        getURL(): string;
        getAuthority(): string;
        getProtocol(): string;
        getHost(): string;
        setHost(sHost: string): void;
        getPort(): number;
        setPort(iPort: number): void;
        getPath(): string;
        setPath(sPath: string): void;
        getQuery(): string;
        setQuery(sQuery: string): void;
        toString(): string;
    }
}
declare module akra {
    interface IDataURI {
        base64: boolean;
        data: string;
        mediatype: string;
        charset: string;
    }
}
declare module akra {
    interface IPathinfo {
        getPath(): string;
        setPath(sPath: string): void;
        getDirName(): string;
        setDirName(sDir: string): void;
        getFileName(): string;
        setFileName(sFile: string): void;
        getExt(): string;
        setExt(sExt: string): void;
        getBaseName(): string;
        setBaseName(sBase: string): void;
        set(sPath: string): void;
        set(pPath: IPathinfo): void;
        isAbsolute(): boolean;
        toString(): string;
    }
}
declare module akra.path {
    function normalize(sPath: string): string;
    function parse(pPath: IPathinfo): IPathinfo;
    function parse(sPath: string): IPathinfo;
}
declare module akra.uri {
    function resolve(sFrom: string, sTo?: string): string;
    function parseDataURI(sUri: string): IDataURI;
    function parse(sUri: string): IURI;
    function currentScript(): HTMLScriptElement;
    function currentPath(): string;
    function here(): IURI;
}
declare var AE_DEBUG: boolean;
declare var AE_VERSION: string;
declare var AE_THREAD_FILEINTERFACE: {
    content: any;
    format: string;
};
declare var AE_THREAD_LOCALFILE: {
    content: any;
    format: string;
};
declare var AE_THREAD_REMOTEFILE: {
    content: any;
    format: string;
};
declare var AE_THREAD_TESSELATION: {
    content: any;
    format: string;
};
declare var AE_WEBGL_DEBUG: boolean;
declare module akra.config {
    var DEBUG: boolean;
    var VERSION: string;
    var WEBGL: boolean;
    /**
    * Will be TRUE if ui extension presented.
    */
    var UI: boolean;
    /**
    * Display debugging information while parsing effects.
    */
    var AFX_DEBUG_PARSER: boolean;
    /**
    * If there is support for loading effects in text form, is TRUE.
    */
    var AFX_ENABLE_TEXT_EFFECTS: boolean;
    /**
    * Use GPU for pre-calculation of atmospheric scattering.
    */ 
    var USE_ATMOSPHERIC_SCATTERING_GPU_MODE: boolean;
    /**
    * Do not use this, if you dont know what it.
    * @debug
    */
    var __VIEW_INTERNALS__: boolean;
    /**
    * If [WebGLDebugUtils](https://www.khronos.org/registry/webgl/sdk/debug/webgl-debug.js) presented,
    * they will use to create a context.
    */
    var WEBGL_DEBUG: boolean;
    /**
    * Calculate profile information for terrain tesselation
    * @debug
    */
    var PROFILE_TESSEALLATION: boolean;
    var data: any;
    var coreDeps: IDependens;
    /** Unknown constants. */
    var unknown: {
        "code": number;
        "message": string;
        "name": string;
    };
    /** Default <any> name */
    var defaultName: string;
    /** Type of used renderer. Default to ERenderers::WEBGL. */
    var renderer: ERenderers;
    /** Ajax default parameters. */
    var ajax: {
        "async": boolean;
        "statusCode": {};
        "success": any;
        "error": any;
        "beforeSend": any;
        "data": any;
        "cache": boolean;
        "contentType": string;
        "dataType": string;
        "type": string;
        "timeout": number;
    };
    var threading: {
        "min": number;
        "max": number;
        "idleTime": number;
    };
    var render: {
        shadows: {
            enabled: boolean;
            discardDistance: number;
        };
    };
    var io: {
        "tfile": {
            "iface": {
                content: any;
                format: string;
            };
            "local": {
                content: any;
                format: string;
            };
            "remote": {
                content: any;
                format: string;
            };
        };
        "local": {
            "filesystemLimit": number;
        };
    };
    var deps: {
        "archiveIndex": string;
        "etag": {
            "file": string;
            "forceCheck": boolean;
        };
    };
    var net: {
        "port": number;
    };
    var rpc: {
        "deferredCallsLimit": number;
        "reconnectTimeout": number;
        "systemRoutineInterval": number;
        "callbackLifetime": number;
        "maxCallbacksCount": number;
        "procListName": string;
        "callsFrequency": number;
    };
    var material: {
        "name": string;
        "default": {
            "diffuse": number;
            "ambient": number;
            "specular": number;
            "emissive": number;
            "shininess": number;
            "transparency": number;
        };
    };
    var fx: {
        grammar: string;
    };
    var terrain: {
        "useMegaTexture": boolean;
        "roam": {
            "tessellationThread": {
                content: any;
                format: string;
            };
        };
    };
    var webgl: {
        "preparedFramebuffersNum": number;
        "indexbufferMinSize": number;
        "vertexbufferMinSize": number;
        "vertexTextureMinSize": number;
        "extensionsBlackList": any[];
    };
    var addons: {};
}
declare module akra {
    /**
    * Get current time in milliseconds from the time the page is loaded.
    */
    var time: () => number;
}
declare module akra {
    function ajax(sUrl: string, pSettings?: IAjaxParams, pRequest?: XMLHttpRequest): IAjaxResultSync;
    function ajax(pSettings: IAjaxParams, pRequest?: XMLHttpRequest): IAjaxResultSync;
}
declare module akra {
    enum EDocumentEntry {
        k_Unknown = 0,
        k_Instance = 1,
        k_Controller = 2,
        k_Animation = 3,
        k_AnimationBlend = 4,
        k_AnimationContainer = 5,
        k_SceneNode = 6,
        k_Material = 7,
    }
    enum EDocumentFormat {
        JSON = 0,
        BINARY_JSON = 1,
    }
    interface IEntry {
        guid?: number;
    }
    interface IDataEntry extends IEntry {
        type: EDocumentEntry;
        extra?: any;
    }
    interface ILibraryEntry extends IEntry {
        data: IUnique;
        entry: IDataEntry;
    }
    interface ILibrary {
        [guid: number]: ILibraryEntry;
    }
    interface IContributor {
        author?: string;
        authoringTool?: string;
        comments?: string;
        copyright?: string;
        sourceData?: any;
    }
    interface IUnit {
        name: string;
        meter: number;
    }
    interface IAsset {
        unit: IUnit;
        upAxis: string;
        title?: string;
        subject?: string;
        created: string;
        modified: string;
        keywords: string[];
        contributor?: IContributor;
    }
    interface IAnimationFrameEntry {
        time: number;
        weight: number;
        matrix: number[];
        type: number;
    }
    interface IAnimationTrackEntry {
        interpolation: EAnimationInterpolations;
        keyframes: IAnimationFrameEntry[];
        targetName: string;
        target: number;
    }
    interface IAnimationTargetEntry {
        target: number;
        name: string;
    }
    interface IAnimationBaseEntry extends IDataEntry {
        name: string;
        targets: IAnimationTargetEntry[];
        extra: {
            graph?: {
                x: number;
                y: number;
            };
        };
    }
    interface IAnimationEntry extends IAnimationBaseEntry {
        tracks: IAnimationTrackEntry[];
    }
    interface IAnimationBlendElementEntry {
        animation: number;
        weight: number;
        mask: IMap<number>;
    }
    interface IAnimationBlendEntry extends IAnimationBaseEntry {
        animations: IAnimationBlendElementEntry[];
    }
    interface IAnimationContainerEntry extends IAnimationBaseEntry {
        enable: boolean;
        startTime: number;
        speed: number;
        loop: boolean;
        animation: number;
        reverse: boolean;
        pause: boolean;
        leftInfinity: boolean;
        rightInfinity: boolean;
    }
    interface IColorEntry {
        [i: number]: number;
    }
    interface IMaterialEntry extends IDataEntry {
        name: string;
        diffuse: IColorEntry;
        specular: IColorEntry;
        emissive: IColorEntry;
        shininess: number;
        transparency: number;
    }
    interface IControllerEntry extends IDataEntry {
        animations: number[];
        options: number;
        name: string;
    }
    interface IDocument {
        asset?: IAsset;
        library: IDataEntry[];
        scenes: number[];
    }
}
declare module akra {
    interface IAnimationElement {
        animation: IAnimationBase;
        weight: number;
        mask: IMap<number>;
        acceleration?: number;
        time: number;
        realTime: number;
    }
    interface IAnimationBlend extends IAnimationBase {
        getTotalAnimations(): number;
        addAnimation(pAnimation: IAnimationBase, fWeight?: number, pMask?: IMap<number>): number;
        setAnimation(iAnimation: number, pAnimation: IAnimationBase, fWeight?: number, pMask?: IMap<number>): boolean;
        getAnimationIndex(sName: string): number;
        getAnimation(sName: string): IAnimationBase;
        getAnimation(iAnimation: number): IAnimationBase;
        getAnimationWeight(sName: string): number;
        getAnimationWeight(iAnimation: number): number;
        swapAnimations(i: number, j: number): boolean;
        removeAnimation(iAnimation: number): boolean;
        setWeights(...pWeight: number[]): boolean;
        setWeightSwitching(fWeight: number, iAnimationFrom: number, iAnimationTo: number): boolean;
        setAnimationWeight(iAnimation: number, fWeight: number): boolean;
        setAnimationWeight(fWeight: number): boolean;
        setAnimationMask(sName: string, pMask: IMap<number>): boolean;
        setAnimationMask(iAnimation: number, pMask: IMap<number>): boolean;
        getAnimationMask(sName: string): IMap<number>;
        getAnimationMask(iAnimation: number): IMap<number>;
        getAnimationAcceleration(sName: string): number;
        getAnimationAcceleration(iAnimation: number): number;
        createAnimationMask(iAnimation?: number): IMap<number>;
        weightUpdated: ISignal<(pBlend: IAnimationBlend, iAnim: number, fWeight: number) => void>;
        durationUpdated: ISignal<(pBlend: IAnimationBlend, fDuration: number) => void>;
    }
}
declare module akra {
    interface IAnimationContainer extends IAnimationBase {
        getAnimationName(): string;
        getAnimationTime(): number;
        getTime(): number;
        getSpeed(): number;
        setSpeed(fSpeed: number): void;
        getAnimation(): IAnimationBase;
        setAnimation(pAnimation: IAnimationBase): void;
        setStartTime(fRealTime: number): void;
        getStartTime(): number;
        enable(): void;
        disable(): void;
        isEnabled(): boolean;
        leftInfinity(bValue: boolean): void;
        rightInfinity(bValue: boolean): void;
        inLeftInfinity(): boolean;
        inRightInfinity(): boolean;
        useLoop(bValue: boolean): void;
        inLoop(): boolean;
        reverse(bValue: boolean): void;
        isReversed(): boolean;
        rewind(fRealTime: number): void;
        pause(bValue?: boolean): void;
        isPaused(): boolean;
        durationUpdated: ISignal<(pContainer: IAnimationContainer, fDuration: number) => void>;
        enterFrame: ISignal<(pContainer: IAnimationContainer, fRealTime: number, fTime: number) => void>;
    }
}
declare module akra {
    var debug: ILogger;
}
declare module akra.math {
    var __11: number;
    var __12: number;
    var __13: number;
    var __14: number;
    var __21: number;
    var __22: number;
    var __23: number;
    var __24: number;
    var __31: number;
    var __32: number;
    var __33: number;
    var __34: number;
    var __41: number;
    var __42: number;
    var __43: number;
    var __44: number;
    var __a11: number;
    var __a12: number;
    var __a13: number;
    var __a21: number;
    var __a22: number;
    var __a23: number;
    var __a31: number;
    var __a32: number;
    var __a33: number;
}
declare module akra.gen {
    /**
    * Generated typed array by {Type} and {size}.
    */
    function array<T>(size: number, Type?: any): T[];
}
declare module akra.math {
    class Vec2 implements IVec2 {
        public x: number;
        public y: number;
        constructor();
        constructor(xy: number);
        constructor(xy: IVec2);
        constructor(xy: number[]);
        constructor(x: number, y: number);
        public set(): IVec2;
        public set(xy: number): IVec2;
        public set(xy: IVec2): IVec2;
        public set(xy: number[]): IVec2;
        public set(x: number, y: number): IVec2;
        /**  */ 
        public clear(): IVec2;
        public add(v2fVec: IVec2, v2fDestination?: IVec2): IVec2;
        public subtract(v2fVec: IVec2, v2fDestination?: IVec2): IVec2;
        /**  */ 
        public dot(v2fVec: IVec2): number;
        public isEqual(v2fVec: IVec2, fEps?: number): boolean;
        public isClear(fEps?: number): boolean;
        public negate(v2fDestination?: IVec2): IVec2;
        public scale(fScale: number, v2fDestination?: IVec2): IVec2;
        public normalize(v2fDestination?: IVec2): IVec2;
        /**  */ 
        public length(): number;
        /**  */ 
        public lengthSquare(): number;
        public direction(v2fVec: IVec2, v2fDestination?: IVec2): IVec2;
        public mix(v2fVec: IVec2, fA: number, v2fDestination?: IVec2): IVec2;
        /**  */ 
        public toString(): string;
        public clone(sForm: string, v2fDest?: IVec2): IVec2;
        public copy(sForm: string, v2fFrom: IVec2): IVec2;
        public copy(sForm: string, fValue: number): IVec2;
        static temp(): IVec2;
        static temp(xy: number): IVec2;
        static temp(xy: IVec2): IVec2;
        static temp(xy: number[]): IVec2;
        static temp(x: number, y: number): IVec2;
    }
}
declare module akra.math {
    class Vec3 implements IVec3 {
        public x: number;
        public y: number;
        public z: number;
        constructor();
        constructor(xyz: number);
        constructor(xyz: IVec3);
        constructor(xyz: number[]);
        constructor(x: number, yz: IVec2);
        constructor(xy: IVec2, z: number);
        constructor(x: number, y: number, z: number);
        public set(): IVec3;
        public set(xyz: number): IVec3;
        public set(xyz: IVec3): IVec3;
        public set(xyz: number[]): IVec3;
        public set(x: number, yz: IVec2): IVec3;
        public set(xy: IVec2, z: number): IVec3;
        public set(x: number, y: number, z: number): IVec3;
        public X(fLength?: number): IVec3;
        public Y(fLength?: number): IVec3;
        public Z(fLength?: number): IVec3;
        /**  */ 
        public clear(): IVec3;
        public add(v3fVec: IVec3, v3fDestination?: IVec3): IVec3;
        public subtract(v3fVec: IVec3, v3fDestination?: IVec3): IVec3;
        /**  */ 
        public dot(v3fVec: IVec3): number;
        public cross(v3fVec: IVec3, v3fDestination?: IVec3): IVec3;
        public isEqual(v3fVec: IVec3, fEps?: number): boolean;
        public isClear(fEps?: number): boolean;
        public negate(v3fDestination?: IVec3): IVec3;
        public scale(v3fScale: IVec3, v3fDestination?: IVec3): IVec3;
        public scale(fScale: number, v3fDestination?: IVec3): IVec3;
        public normalize(v3fDestination?: IVec3): IVec3;
        /**  */ 
        public length(): number;
        /**  */ 
        public lengthSquare(): number;
        public direction(v3fVec: IVec3, v3fDestination?: IVec3): IVec3;
        public mix(v3fVec: IVec3, fA: number, v3fDestination?: IVec3): IVec3;
        /**  */ 
        public toString(): string;
        /**  */ 
        public toArray(pDest?: number[]): number[];
        public toTranslationMatrix(m4fDestination?: IMat4): IMat4;
        public vec3TransformCoord(m4fTransformation: IMat4, v3fDestination?: IVec3): IVec3;
        public clone(sForm: string, v2fDest?: IVec2): IVec2;
        public clone(sForm: string, v3fDest?: IVec3): IVec3;
        public copy(sForm: string, fValue: number): IVec3;
        public copy(sForm: string, v2fFrom: IVec2): IVec3;
        public copy(sForm: string, v3fFrom: IVec3): IVec3;
        static temp(): IVec3;
        static temp(xyz: number): IVec3;
        static temp(xyz: IVec3): IVec3;
        static temp(xyz: number[]): IVec3;
        static temp(x: number, yz: IVec2): IVec3;
        static temp(xy: IVec2, z: number): IVec3;
        static temp(x: number, y: number, z: number): IVec3;
    }
}
declare module akra.math {
    class Vec4 implements IVec4 {
        public x: number;
        public y: number;
        public z: number;
        public w: number;
        constructor();
        constructor(xyzw: number);
        constructor(xyzw: IVec4);
        constructor(xyzw: number[]);
        constructor(rgba: IColorValue);
        constructor(x: number, yzw: IVec3);
        constructor(xy: IVec2, zw: IVec2);
        constructor(xyz: IVec3, w: number);
        constructor(x: number, y: number, zw: IVec2);
        constructor(x: number, yz: IVec2, w: number);
        constructor(xy: IVec2, z: number, w: number);
        constructor(x: number, y: number, z: number, w: number);
        public set(): IVec4;
        public set(xyzw: number): IVec4;
        public set(xyzw: IVec4): IVec4;
        public set(xyzw: number[]): IVec4;
        public set(rgba: IColorValue): IVec4;
        public set(x: number, yzw: IVec3): IVec4;
        public set(xy: IVec2, zw: IVec2): IVec4;
        public set(xyz: IVec3, w: number): IVec4;
        public set(x: number, y: number, zw: IVec2): IVec4;
        public set(x: number, yz: IVec2, w: number): IVec4;
        public set(xy: IVec2, z: number, w: number): IVec4;
        public set(x: number, y: number, z: number, w: number): IVec4;
        /**  */ 
        public clear(): IVec4;
        public add(v4fVec: IVec4, v4fDestination?: IVec4): IVec4;
        public subtract(v4fVec: IVec4, v4fDestination?: IVec4): IVec4;
        /**  */ 
        public dot(v4fVec: IVec4): number;
        public isEqual(v4fVec: IVec4, fEps?: number): boolean;
        public isClear(fEps?: number): boolean;
        public negate(v4fDestination?: IVec4): IVec4;
        public scale(fScale: number, v4fDestination?: IVec4): IVec4;
        public normalize(v4fDestination?: IVec4): IVec4;
        /**  */ 
        public length(): number;
        /**  */ 
        public lengthSquare(): number;
        public direction(v4fVec: IVec4, v4fDestination?: IVec4): IVec4;
        public mix(v4fVec: IVec4, fA: number, v4fDestination?: IVec4): IVec4;
        /**  */ 
        public toString(): string;
        public clone(sForm: string, v2fDest?: IVec2): IVec2;
        public clone(sForm: string, v3fDest?: IVec3): IVec3;
        public clone(sForm: string, v4fDest?: IVec4): IVec4;
        public copy(sForm: string, fValue: number): IVec4;
        public copy(sForm: string, v2fFrom: IVec2): IVec4;
        public copy(sForm: string, v3fFrom: IVec3): IVec4;
        public copy(sForm: string, v4fFrom: IVec4): IVec4;
        static temp(): IVec4;
        static temp(xyzw: number): IVec4;
        static temp(xyzw: IVec4): IVec4;
        static temp(xyzw: number[]): IVec4;
        static temp(rgba: IColorValue): IVec4;
        static temp(x: number, yzw: IVec3): IVec4;
        static temp(xy: IVec2, zw: IVec2): IVec4;
        static temp(xyz: IVec3, w: number): IVec4;
        static temp(x: number, y: number, zw: IVec2): IVec4;
        static temp(x: number, yz: IVec2, w: number): IVec4;
        static temp(xy: IVec2, z: number, w: number): IVec4;
        static temp(x: number, y: number, z: number, w: number): IVec4;
    }
}
declare module akra.math {
    class Mat3 implements IMat3 {
        public data: Float32Array;
        constructor();
        constructor(f: number);
        constructor(v3fVec: IVec3);
        constructor(m3fMat: IMat3);
        constructor(m4fMat: IMat4);
        constructor(pArray: number[]);
        constructor(f1: number, f2: number, f3: number);
        constructor(v3fVec1: IVec3, v3fVec2: IVec3, v3fVec3: IVec3);
        constructor(pArray1: number[], pArray2: number[], pArray3: number[]);
        constructor(f1: number, f2: number, f3: number, f4: number, f5: number, f6: number, f7: number, f8: number, f9: number);
        /** Zero matrix.*/
        public set(): IMat3;
        /** Put on the diagonal. */
        public set(f: number): IMat3;
        /** Put on the diagonal. */
        public set(v: IVec3): IMat3;
        /** From another matrix 3x3. */
        public set(m: IMat3): IMat3;
        /** From another matrix 4x4. */
        public set(m: IMat4): IMat3;
        /**
        * Diagonal matrix of the array of length 3,
        * or simply a matrix of an array of size 16.
        */
        public set(p: number[]): IMat3;
        /** Put on the diagonal. */
        public set(f1: number, f2: number, f3: number): IMat3;
        /** Arrange the columns. */
        public set(v1: IVec3, v2: IVec3, v3: IVec3): IMat3;
        /** Arrange the columns. */
        public set(p1: number[], p2: number[], p3: number[]): IMat3;
        /** Arrange the columns. */
        public set(f1: number, f2: number, f3: number, f4: number, f5: number, f6: number, f7: number, f8: number, f9: number): IMat3;
        public identity(): IMat3;
        public add(m3fMat: IMat3, m3fDestination?: IMat3): IMat3;
        public subtract(m3fMat: IMat3, m3fDestination?: IMat3): IMat3;
        public multiply(m3fMat: IMat3, m3fDestination?: IMat3): IMat3;
        public multiplyVec3(v3fVec: IVec3, v3fDestination?: IVec3): IVec3;
        public transpose(m3fDestination?: IMat3): IMat3;
        public determinant(): number;
        public inverse(m3fDestination?: IMat3): IMat3;
        public isEqual(m3fMat: IMat3, fEps?: number): boolean;
        public isDiagonal(fEps?: number): boolean;
        public toMat4(m4fDestination?: IMat4): IMat4;
        public toQuat4(q4fDestination?: IQuat4): IQuat4;
        public toString(): string;
        public decompose(q4fRotation: IQuat4, v3fScale: IVec3): boolean;
        public row(iRow: number, v3fDestination?: IVec3): IVec3;
        public column(iColumn: number, v3fDestination?: IVec3): IVec3;
        static fromYawPitchRoll(fYaw: number, fPitch: number, fRoll: number, m3fDestination?: IMat3): IMat3;
        static fromYawPitchRoll(v3fAngles: IVec3, m3fDestination?: IMat3): IMat3;
        static fromXYZ(fX: number, fY: number, fZ: number, m3fDestination?: IMat3): IMat3;
        static fromXYZ(v3fAngles: IVec3, m3fDestination?: IMat3): IMat3;
        static temp(): IMat3;
        static temp(f: number): IMat3;
        static temp(v: IVec3): IMat3;
        static temp(m3: IMat3): IMat3;
        static temp(m4: IMat4): IMat3;
        static temp(p: number[]): IMat3;
        static temp(f1: number, f2: number, f3: number): IMat3;
        static temp(v1: IVec3, v2: IVec3, v3: IVec3): IMat3;
        static temp(p1: number[], p2: number[], p3: number[]): IMat3;
        static temp(f1: number, f2: number, f3: number, f4: number, f5: number, f6: number, f7: number, f8: number, f9: number): IMat3;
    }
}
declare module akra.math {
    class Mat4 implements IMat4 {
        public data: Float32Array;
        constructor();
        constructor(f: number);
        constructor(v: IVec4);
        constructor(m: IMat3, v?: IVec3);
        constructor(m: IMat4);
        constructor(p: number[]);
        /**
        * Use a pointer or copy.
        */
        constructor(p: Float32Array, bFlag: boolean);
        constructor(f1: number, f2: number, f3: number, f4: number);
        constructor(v4fVec1: IVec4, v4fVec2: IVec4, v4fVec3: IVec4, v4fVec4: IVec4);
        constructor(p1: number[], p2: number[], p3: number[], p4: number[]);
        constructor(f1: number, f2: number, f3: number, f4: number, f5: number, f6: number, f7: number, f8: number, f9: number, f10: number, f11: number, f12: number, f13: number, f14: number, f15: number, f16: number);
        public set(): IMat4;
        public set(f: number): IMat4;
        public set(v4: IVec4): IMat4;
        public set(m3: IMat3, v3?: IVec3): IMat4;
        public set(m4: IMat4): IMat4;
        public set(p: number[]): IMat4;
        public set(f1: number, f2: number, f3: number, f4: number): IMat4;
        public set(v1: IVec4, v2: IVec4, v3: IVec4, v4: IVec4): IMat4;
        public set(p1: number[], p2: number[], p3: number[], p4: number[]): IMat4;
        public set(f1: number, f2: number, f3: number, f4: number, f5: number, f6: number, f7: number, f8: number, f9: number, f10: number, f11: number, f12: number, f13: number, f14: number, f15: number, f16: number): IMat4;
        public identity(): IMat4;
        public add(m4fMat: IMat4, m4fDestination?: IMat4): IMat4;
        public subtract(m4fMat: IMat4, m4fDestination?: IMat4): IMat4;
        public multiply(m4fMat: IMat4, m4fDestination?: IMat4): IMat4;
        public multiplyLeft(m4fMat: IMat4, m4fDestination?: IMat4): IMat4;
        public multiplyVec4(v4fVec: IVec4, v4fDestination?: IVec4): IVec4;
        /**
        * Multiply matrix by number. Per component multiply.
        */
        public multiplyNumber(fValue: number, m4fDestination?: IMat4): IMat4;
        public transpose(m4fDestination?: IMat4): IMat4;
        public determinant(): number;
        public inverse(m4fDestination?: IMat4): IMat4;
        /**  */ 
        public trace(): number;
        public isEqual(m4fMat: IMat4, fEps?: number): boolean;
        public isDiagonal(fEps?: number): boolean;
        public toMat3(m3fDestination?: IMat3): IMat3;
        public toQuat4(q4fDestination?: IQuat4): IQuat4;
        public toRotationMatrix(m4fDestination?: IMat4): IMat4;
        public toString(iFixed?: number): string;
        public toArray(pDest?: number[]): number[];
        public rotateRight(fAngle: number, v3fAxis: IVec3, m4fDestination?: IMat4): IMat4;
        public rotateLeft(fAngle: number, v3fAxis: IVec3, m4fDestination?: IMat4): IMat4;
        /**  */ 
        public setTranslation(v3fTranslation: IVec3): IMat4;
        /**  */ 
        public getTranslation(v3fTranslation?: IVec3): IVec3;
        public translateRight(v3fTranslation: IVec3, m4fDestination?: IMat4): IMat4;
        public translateLeft(v3fTranslation: IVec3, m4fDestination?: IMat4): IMat4;
        public scaleRight(fScale: number, m4fDestination?: IMat4): IMat4;
        public scaleRight(v3fScale: IVec3, m4fDestination?: IMat4): IMat4;
        public scaleLeft(fScale: number, m4fDestination?: IMat4): IMat4;
        public scaleLeft(v3fScale: IVec3, m4fDestination?: IMat4): IMat4;
        /**  */ 
        public decompose(q4fRotation: IQuat4, v3fScale: IVec3, v3fTranslation: IVec3): boolean;
        public row(iRow: number, v4fDestination?: IVec4): IVec4;
        public column(iColumn: number, v4fDestination?: IVec4): IVec4;
        public unproj(v3fScreen: IVec3, v4fDestination?: IVec4): IVec4;
        public unproj(v4fScreen: IVec4, v4fDestination?: IVec4): IVec4;
        public unprojZ(fZ: number): number;
        /**  */ 
        public isOrthogonalProjection(): boolean;
        static fromYawPitchRoll(fYaw: number, fPitch: number, fRoll: number, m4fDestination?: IMat4): IMat4;
        static fromYawPitchRoll(v3fAngles: IVec3, m4fDestination?: IMat4): IMat4;
        static fromXYZ(fX: number, fY: number, fZ: number, m4fDestination?: IMat4): IMat4;
        static fromXYZ(v3fAngles: IVec3, m4fDestination?: IMat4): IMat4;
        static frustum(fLeft: number, fRight: number, fBottom: number, fTop: number, fNear: number, fFar: number, m4fDestination?: IMat4): IMat4;
        /**  */ 
        static perspective(fFovy: number, fAspect: number, fNear: number, fFar: number, m4fDestination?: IMat4): IMat4;
        static orthogonalProjectionAsymmetric(fLeft: number, fRight: number, fBottom: number, fTop: number, fNear: number, fFar: number, m4fDestination?: IMat4): IMat4;
        /**  */ 
        static orthogonalProjection(fWidth: number, fHeight: number, fNear: number, fFar: number, m4fDestination?: IMat4): IMat4;
        static lookAt(v3fEye: IVec3, v3fCenter: IVec3, v3fUp: IVec3, m4fDestination?: IMat4): IMat4;
        static temp(): IMat4;
        static temp(f: number): IMat4;
        static temp(v4: IVec4): IMat4;
        static temp(m3: IMat3, v3?: IVec3): IMat4;
        static temp(m4: IMat4): IMat4;
        static temp(p: number[]): IMat4;
        static temp(f11: number, f22: number, f33: number, f44: number): IMat4;
        static temp(vColumn1: IVec4, vColumn2: IVec4, vColumn3: IVec4, vColumn4: IVec4): IMat4;
        static temp(pColumn1: number[], pColumn2: number[], pColumn3: number[], pColumn4: number[]): IMat4;
        static temp(f1: number, f2: number, f3: number, f4: number, f5: number, f6: number, f7: number, f8: number, f9: number, f10: number, f11: number, f12: number, f13: number, f14: number, f15: number, f16: number): IMat4;
    }
}
declare module akra.math {
    class Quat4 implements IQuat4 {
        public x: number;
        public y: number;
        public z: number;
        public w: number;
        constructor();
        constructor(q: IQuat4);
        constructor(q: number[]);
        constructor(xyz: number, w: number);
        constructor(xyz: IVec3, w: number);
        constructor(x: number, y: number, z: number, w: number);
        public set(): IQuat4;
        public set(q: IQuat4): IQuat4;
        public set(q: number[]): IQuat4;
        public set(xyz: number, w: number): IQuat4;
        public set(xyz: IVec3, w: number): IQuat4;
        public set(x: number, y: number, z: number, w: number): IQuat4;
        public multiply(q4fQuat: IQuat4, q4fDestination?: IQuat4): IQuat4;
        public multiplyVec3(v3fVec: IVec3, v3fDestination?: IVec3): IVec3;
        public conjugate(q4fDestination?: IQuat4): IQuat4;
        public inverse(q4fDestination?: IQuat4): IQuat4;
        /**  */ 
        public length(): number;
        public normalize(q4fDestination?: IQuat4): IQuat4;
        public calculateW(q4fDestination?: IQuat4): IQuat4;
        public isEqual(q4fQuat: IQuat4, fEps?: number, asMatrix?: boolean): boolean;
        public getYaw(): number;
        public getPitch(): number;
        public getRoll(): number;
        public toYawPitchRoll(v3fDestination?: IVec3): IVec3;
        public toMat3(m3fDestination?: IMat3): IMat3;
        public toMat4(m4fDestination?: IMat4): IMat4;
        /**  */ 
        public toString(): string;
        public mix(q4fQuat: IQuat4, fA: number, q4fDestination?: IQuat4, bShortestPath?: boolean): IQuat4;
        public smix(q4fQuat: IQuat4, fA: number, q4fDestination?: IQuat4, bShortestPath?: boolean): IQuat4;
        static fromForwardUp(v3fForward: IVec3, v3fUp: IVec3, q4fDestination?: IQuat4): IQuat4;
        static fromAxisAngle(v3fAxis: IVec3, fAngle: number, q4fDestination?: IQuat4): IQuat4;
        static fromYawPitchRoll(fYaw: number, fPitch: number, fRoll: number, q4fDestination?: IQuat4): IQuat4;
        static fromYawPitchRoll(v3fAngles: IVec3, q4fDestination?: IQuat4): IQuat4;
        static fromXYZ(fX: number, fY: number, fZ: number, q4fDestination?: IQuat4): IQuat4;
        static fromXYZ(v3fAngles: IVec3, q4fDestination?: IQuat4): IQuat4;
        static temp(): IQuat4;
        static temp(q: IQuat4): IQuat4;
        static temp(q: number[]): IQuat4;
        static temp(xyz: number, w: number): IQuat4;
        static temp(xyz: IVec3, w: number): IQuat4;
        static temp(x: number, y: number, z: number, w: number): IQuat4;
    }
}
declare module akra.math {
    var E: number;
    var LN2: number;
    var LOG2E: number;
    var LOG10E: number;
    var PI: number;
    var SQRT1_2: number;
    var SQRT2: number;
    var LN10: number;
    var POSITIVE_INFINITY: number;
    var NEGATIVE_INFINITY: number;
    var FLOAT_PRECISION: number;
    var TWO_PI: number;
    var HALF_PI: number;
    var QUARTER_PI: number;
    var EIGHTH_PI: number;
    var PI_SQUARED: number;
    var PI_INVERSE: number;
    var PI_OVER_180: number;
    var PI_DIV_180: number;
    var NATURAL_LOGARITHM_BASE: number;
    var EULERS_CONSTANT: number;
    var SQUARE_ROOT_2: number;
    var INVERSE_ROOT_2: number;
    var SQUARE_ROOT_3: number;
    var SQUARE_ROOT_5: number;
    var SQUARE_ROOT_10: number;
    var CUBE_ROOT_2: number;
    var CUBE_ROOT_3: number;
    var FOURTH_ROOT_2: number;
    var NATURAL_LOG_2: number;
    var NATURAL_LOG_3: number;
    var NATURAL_LOG_10: number;
    var NATURAL_LOG_PI: number;
    var BASE_TEN_LOG_PI: number;
    var NATURAL_LOGARITHM_BASE_INVERSE: number;
    var NATURAL_LOGARITHM_BASE_SQUARED: number;
    var GOLDEN_RATIO: number;
    var DEGREE_RATIO: number;
    var RADIAN_RATIO: number;
    var GRAVITY_CONSTANT: number;
    var abs: (x: number) => number;
    var acos: (x: number) => number;
    var asin: (x: number) => number;
    var atan: (x: number) => number;
    var atan2: (y: number, x: number) => number;
    var exp: (x: number) => number;
    var min: (...values: number[]) => number;
    var random: () => number;
    var sqrt: (x: number) => number;
    var log: (x: number) => number;
    var round: (x: number) => number;
    var floor: (x: number) => number;
    var ceil: (x: number) => number;
    var sin: (x: number) => number;
    var cos: (x: number) => number;
    var tan: (x: number) => number;
    var pow: (x: number, y: number) => number;
    var max: (...values: number[]) => number;
    /** @ */
    var fpBits: (f: number) => number;
    /** @ */
    var intBits: (i: number) => number;
    /** @ */
    var fpSign: (f: number) => number;
    /** @ */
    var fpExponent: (f: number) => number;
    /** @ */
    var fpExponentSign: (f: number) => number;
    /** @ */
    var fpPureMantissa: (f: number) => number;
    /** @ */
    var fpMantissa: (f: number) => number;
    var fpOneBits: number;
    /** @ */
    var flipSign: (i: number, flip: number) => number;
    /**
    * Число положительно?
    */
    var isPositive: (a: number) => boolean;
    /**
    * Число отрицательно?
    */
    var isNegative: (a: number) => boolean;
    /**
    * Число одного знака?
    */
    var sameSigns: (a: number, b: number) => boolean;
    /**
    * Копировать знак
    */
    var copySign: (a: number, b: number) => number;
    /**
    * Растояние между а и b меньше epsilon?
    */
    var deltaRangeTest: (a: number, b: number, epsilon?: number) => boolean;
    /**
    * Ограничивает value интервалом [low,high]
    */
    var clamp: (value: number, low: number, high: number) => number;
    /**
    * Ограничивает value интервалом [0,+Infinity]
    */
    var clampPositive: (value: number) => number;
    /**
    * Ограничивает value интервалом [-Infinity,0]
    */
    var clampNegative: (value: number) => number;
    /**
    * Ограничивает value интервалом [-1,1]
    */
    var clampUnitSize: (value: number) => number;
    var sign: (value: number) => number;
    /**
    * Номер с права начиная от нуля, самого левого установленного бита
    */
    var highestBitSet: (value: number) => number;
    /**
    * Номер с права начиная от нуля, самого правого установленного бита
    */
    var lowestBitSet: (value: number) => number;
    /**
    * Является ли число степенью двойки
    */
    var isPowerOfTwo: (value: number) => boolean;
    /**
    * Округление до числа наиболее близкого к степени двойки
    */
    var nearestPowerOfTwo: (value: number) => number;
    /**
    * Округление до следующего числа являющегося к степени двойки
    */
    var ceilingPowerOfTwo: (value: number) => number;
    /**
    * Округление до предыдущего числа являющегося к степени двойки
    */
    var floorPowerOfTwo: (value: number) => number;
    /**
    * Деление по модулю
    */
    var modulus: (e: number, divisor: number) => number;
    /**
    *
    */
    var mod: (e: number, divisor: number) => number;
    /**
    * Вырвнивание числа на alignment вверх
    */
    var alignUp: (value: number, alignment: number) => number;
    /**
    * Вырвнивание числа на alignment вниз
    */
    var alignDown: (value: number, alignment: number) => number;
    /**
    * пнвертировать число
    */
    var inverse: (a: number) => number;
    /**
    * log base 2
    */
    var log2: (f: number) => number;
    /**
    * Округлени числа с определенной точностью, где округляется до значащих чисел как 1/(2^precision)
    */
    var trimFloat: (f: number, precision: number) => number;
    /**
    * Перевод дробного в целое с усеением
    */
    var realToInt32_chop: (a: number) => number;
    /**
    * Перевод дробного в целое до меньшего
    */
    var realToInt32_floor: (a: number) => number;
    /**
    * Перевод дробного в целое до большего
    */
    var realToInt32_ceil: (a: number) => number;
    /**
    * Наибольший общий делитель
    */
    var nod: (n: number, m: number) => number;
    /**
    * Наименьшее общее кратное
    */
    var nok: (n: number, m: number) => number;
    /**
    * Greatest common devider
    */
    var gcd: (n: number, m: number) => number;
    /**
    * Least common multiple
    */
    var lcm: (n: number, m: number) => number;
    var isRealEqual: (a: number, b: number, tolerance?: number) => boolean;
    function calcPOTtextureSize(nPixels: number): number[];
    function floatToFloat3(value: number): IVec3;
}
declare module akra {
    enum EIO {
        IN = 1,
        OUT = 2,
        ATE = 4,
        APP = 8,
        TRUNC = 16,
        BINARY = 32,
        TEXT = 64,
        JSON = 128,
        URL = 256,
        BIN = 32,
    }
}
declare module akra {
    interface IFileMeta {
        lastModifiedDate: string;
        size: number;
        eTag?: string;
    }
    interface IFile extends IEventProvider {
        opened: ISignal<(pFile: IFile) => void>;
        closed: ISignal<(pFile: IFile) => void>;
        renamed: ISignal<(pFile: IFile, sName: string, sNamePrev: string) => void>;
        getPath(): string;
        getName(): string;
        getByteLength(): number;
        getMode(): number;
        setMode(sMode: string): void;
        setMode(iMode: number): void;
        getPosition(): number;
        setPosition(iPos: number): void;
        open(sFilename: string, iMode: number, cb?: (e: Error, pMeta: IFileMeta) => void): void;
        open(sFilename: string, sMode: string, cb?: (e: Error, pMeta: IFileMeta) => void): void;
        open(sFilename: string, cb?: (e: Error, pMeta: IFileMeta) => void): void;
        open(iMode: number, cb?: (e: Error, pMeta: IFileMeta) => void): void;
        open(cb?: (e: Error, pMeta: IFileMeta) => void): void;
        close(): void;
        clear(cb?: Function): void;
        read(cb?: (e: Error, data: any) => void, fnProgress?: (bytesLoaded: number, bytesTotal: number) => void): void;
        write(sData: string, cb?: Function, sContentType?: string): void;
        write(pData: ArrayBuffer, cb?: Function, sContentType?: string): void;
        move(sFilename: string, cb?: (e: Error, sPath: string, sPathPrev: string) => void): void;
        copy(sFilename: string, cb?: (e: Error, pCopy: IFile) => void): void;
        rename(sFilename: string, cb?: Function): void;
        remove(cb?: (e: Error, sName: string, sNamePrev: string) => void): void;
        atEnd(): number;
        seek(iOffset: number): number;
        isOpened(): boolean;
        isExists(cb: Function): void;
        isLocal(): boolean;
        getMetaData(cb: (e: Error, pMeta: IFileMeta) => void): void;
    }
}
declare module akra {
    interface IThread {
        onmessage: Function;
        onerror: Function;
        id: number;
        send(pData: Object, pTransferables?: any[]): void;
        send(pData: ArrayBuffer, pTransferables?: any[]): void;
        send(pData: ArrayBufferView, pTransferables?: any[]): void;
    }
}
declare module akra {
    enum EFileTransferModes {
        k_Normal = 0,
        k_Fast = 1,
        k_Slow = 2,
    }
}
declare module akra {
    interface IThreadManager extends IManager {
        waitForThread(fn: Function): number;
        createThread(): boolean;
        occupyThread(): IThread;
        releaseThread(iThread: number): boolean;
        releaseThread(pThread: IThread): boolean;
    }
}
declare module akra {
    function guid(): number;
}
declare module akra {
    interface ICanvasInfo {
        width: number;
        height: number;
        id: string;
    }
}
declare module akra {
    interface IBrowserInfo {
        getName(): string;
        getVersion(): string;
        getOS(): string;
    }
}
declare module akra.info {
    class BrowserInfo extends util.Singleton<BrowserInfo> implements IBrowserInfo {
        private _sBrowser;
        private _sVersion;
        private _sOS;
        private _sVersionSearch;
        constructor();
        public getName(): string;
        public getVersion(): string;
        public getOS(): string;
        private init();
        private searchString(pDataBrowser);
        private searchVersion(sData);
        private static dataBrowser;
        private static dataOS;
    }
}
declare module akra {
    interface IApiInfo {
        getGamepad(): boolean;
        getWebGL(): boolean;
        getWebAudio(): boolean;
        getFile(): boolean;
        getFileSystem(): boolean;
        getWebWorker(): boolean;
        getTransferableObjects(): boolean;
        getLocalStorage(): boolean;
        getWebSocket(): boolean;
        getZip(): boolean;
    }
}
declare module akra {
    interface IPixelFormatDescription {
        name: string;
        elemBytes: number;
        flags: number;
        /** Component type
        */
        componentType: EPixelComponentTypes;
        /** Component count
        */
        componentCount: number;
        rbits: number;
        gbits: number;
        bbits: number;
        abits: number;
        rmask: number;
        gmask: number;
        bmask: number;
        amask: number;
        rshift: number;
        gshift: number;
        bshift: number;
        ashift: number;
    }
}
declare module akra {
    interface IPair<FIRST_TYPE, SECOND_TYPE> {
        first: FIRST_TYPE;
        second: SECOND_TYPE;
    }
}
declare module akra {
    function copy(pDst: ArrayBuffer, iDstOffset: number, pSrc: ArrayBuffer, iSrcOffset: number, nLength: number): void;
    /** mem copy from beginning*/
    function copyfb(pDst: ArrayBuffer, pSrc: ArrayBuffer, nLength: number): void;
}
declare module akra.geometry {
    class Box implements IBox {
        public left: number;
        public top: number;
        public front: number;
        public right: number;
        public bottom: number;
        public back: number;
        public getWidth(): number;
        public getHeight(): number;
        public getDepth(): number;
        constructor();
        constructor(pExtents: IBox);
        constructor(iLeft: number, iTop: number, iFront: number);
        constructor(iLeft: number, iTop: number, iRight: number, iBottom: number);
        constructor(iLeft: number, iTop: number, iFront: number, iRight: number, iBottom: number, iBack: number);
        public set(): IBox;
        public set(pExtents: IBox): IBox;
        public set(iLeft: number, iTop: number, iFront: number): IBox;
        public set(iLeft: number, iTop: number, iRight: number, iBottom: number): IBox;
        public set(iLeft: number, iTop: number, iFront: number, iRight: number, iBottom: number, iBack: number): IBox;
        public contains(pDest: IBox): boolean;
        public setPosition(iLeft: number, iTop: number, iWidth: number, iHeight: number, iFront?: number, iDepth?: number): void;
        public isEqual(pDest: IBox): boolean;
        public toString(): string;
        static temp(): IBox;
        static temp(pBox: IBox): IBox;
        static temp(iLeft: number, iTop: number, iFront: number): IBox;
        static temp(iLeft: number, iTop: number, iRight: number, iBottom: number): IBox;
        static temp(iLeft: number, iTop: number, iFront: number, iRight: number, iBottom: number, iBack: number): IBox;
    }
}
declare module akra.color {
    class Color implements IColor {
        public r: number;
        public g: number;
        public b: number;
        public a: number;
        constructor();
        constructor(rgba: string);
        constructor(cColor: IColor);
        constructor(pData: ArrayBufferView);
        constructor(r: number, g: number, b: number, a: number);
        constructor(r: number, g: number, b: number);
        constructor(fGray: number, fAlpha: number);
        constructor(fGray: number);
        public getHtml(): string;
        public getHtmlRgba(): string;
        public getRgba(): number;
        public getArgb(): number;
        public getBgra(): number;
        public getAbgr(): number;
        public setRgba(c: number): void;
        public setArgb(c: number): void;
        public setBgra(c: number): void;
        public setAbgr(c: number): void;
        public set(): IColor;
        public set(rgba: string): IColor;
        public set(cColor: IColorValue): IColor;
        public set(pData: ArrayBufferView): IColor;
        public set(cColor: IColor): IColor;
        public set(r: number, g: number, b: number, a: number): IColor;
        public set(r: number, g: number, b: number): IColor;
        public set(fGray: number, fAlpha: number): IColor;
        public set(fGray: number): IColor;
        public saturate(): IColor;
        /** As saturate, except that this colour value is unaffected and
        the saturated colour value is returned as a copy. */
        public saturateCopy(): IColor;
        public add(cColor: IColor, ppDest?: IColor): IColor;
        public subtract(cColor: IColor, ppDest?: IColor): IColor;
        public multiply(cColor: IColor, ppDest?: IColor): IColor;
        public multiply(fScalar: number, ppDest?: IColor): IColor;
        public divide(cColor: IColor, ppDest?: IColor): IColor;
        public divide(fScalar: number, ppDest?: IColor): IColor;
        public setHSB(fHue: number, fSaturation: number, fBrightness: number): IColor;
        public getHSB(pHsb?: number[]): number[];
        public toString(): string;
        static toFloat32Array(pValue: IColorValue): Float32Array;
        static BLACK: IColor;
        static WHITE: IColor;
        static ZERO: IColor;
        static isEqual(c1: IColorValue, c2: IColorValue): boolean;
        static temp(): IColor;
        static temp(c: IColorValue): IColor;
        static temp(pData: ArrayBufferView): IColor;
        static temp(c: IColor): IColor;
        static temp(r: number, g: number, b: number, a: number): IColor;
        static temp(r: number, g: number, b: number): IColor;
        static temp(fGray: number, fAlpha: number): IColor;
        static temp(fGray: number): IColor;
    }
}
declare module akra.pixelUtil {
    class PixelBox extends geometry.Box implements IPixelBox {
        public data: Uint8Array;
        public format: EPixelFormats;
        public rowPitch: number;
        public slicePitch: number;
        constructor();
        constructor(iWidth: number, iHeight: number, iDepth: number, ePixelFormat: EPixelFormats, pPixelData?: any);
        constructor(pExtents: IBox, ePixelFormat: EPixelFormats, pPixelData?: Uint8Array);
        public setConsecutive(): void;
        public getRowSkip(): number;
        public getSliceSkip(): number;
        public isConsecutive(): boolean;
        public getConsecutiveSize(): number;
        public getSubBox(pDest: IBox, pDestPixelBox?: IPixelBox): PixelBox;
        public getColorAt(pColor: IColor, x: number, y: number, z?: number): IColor;
        public setColorAt(pColor: IColor, x: number, y: number, z?: number): void;
        public scale(pDest: IPixelBox, eFilter?: EFilters): boolean;
        public refresh(pExtents: IBox, ePixelFormat: EPixelFormats, pPixelData: Uint8Array): void;
        public toString(): string;
        static temp(): IPixelBox;
        static temp(iWidth: number, iHeight: number, iDepth: number, ePixelFormat: EPixelFormats, pPixelData?: Uint8Array): IPixelBox;
        static temp(pExtents: IBox, ePixelFormat: EPixelFormats, pPixelData?: Uint8Array): IPixelBox;
    }
}
declare module akra.pixelUtil {
    function getDescriptionFor(eFmt: EPixelFormats): IPixelFormatDescription;
    /** Returns the size in bytes of an element of the given pixel format.
    @return
    The size in bytes of an element. See Remarks.
    @remarks
    Passing PF_UNKNOWN will result in returning a size of 0 bytes.
    */
    function getNumElemBytes(eFormat: EPixelFormats): number;
    /** Returns the size in bits of an element of the given pixel format.
    @return
    The size in bits of an element. See Remarks.
    @remarks
    Passing PF_UNKNOWN will result in returning a size of 0 bits.
    */
    function getNumElemBits(eFormat: EPixelFormats): number;
    /** Returns the size in memory of a region with the given extents and pixel
    format with consecutive memory layout.
    @param width
    The width of the area
    @param height
    The height of the area
    @param depth
    The depth of the area
    @param format
    The format of the area
    @return
    The size in bytes
    @remarks
    In case that the format is non-compressed, this simply returns
    width*height*depth*PixelUtil::getNumElemBytes(format). In the compressed
    case, this does serious magic.
    */
    function getMemorySize(iWidth: number, iHeight: number, iDepth: number, eFormat: EPixelFormats): number;
    /** Returns the property flags for this pixel format
    @return
    A bitfield combination of PFF_HASALPHA, PFF_ISCOMPRESSED,
    PFF_FLOAT, PFF_DEPTH, PFF_NATIVEENDIAN, PFF_LUMINANCE
    @remarks
    This replaces the separate functions for formatHasAlpha, formatIsFloat, ...
    */
    function getFlags(eFormat: EPixelFormats): number;
    /** Shortcut method to determine if the format has an alpha component */
    function hasAlpha(eFormat: EPixelFormats): boolean;
    /** Shortcut method to determine if the format is floating point */
    function isFloatingPoint(eFormat: EPixelFormats): boolean;
    /** Shortcut method to determine if the format is compressed */
    function isCompressed(eFormat: EPixelFormats): boolean;
    /** Shortcut method to determine if the format is a depth format. */
    function isDepth(eFormat: EPixelFormats): boolean;
    /** Shortcut method to determine if the format is in native endian format. */
    function isNativeEndian(eFormat: EPixelFormats): boolean;
    /** Shortcut method to determine if the format is a luminance format. */
    function isLuminance(eFormat: EPixelFormats): boolean;
    /** Return wether a certain image extent is valid for this image format.
    @param width
    The width of the area
    @param height
    The height of the area
    @param depth
    The depth of the area
    @param format
    The format of the area
    @remarks For non-compressed formats, this is always true. For DXT formats,
    only sizes with a width and height multiple of 4 and depth 1 are allowed.
    */
    function isValidExtent(iWidth: number, iHeight: number, iDepth: number, eFormat: EPixelFormats): boolean;
    /** Gives the number of bits (RGBA) for a format. See remarks.
    @remarks      For non-colour formats (dxt, depth) this returns [0,0,0,0].
    */
    function getBitDepths(eFormat: EPixelFormats): number[];
    /** Gives the masks for the R, G, B and A component
    @note			Only valid for native endian formats
    */
    function getBitMasks(eFormat: EPixelFormats): number[];
    /** Gives the bit shifts for R, G, B and A component
    @note			Only valid for native endian formats
    */
    function getBitShifts(eFormat: EPixelFormats): number[];
    /** Gets the name of an image format
    */
    function getFormatName(eSrcFormat: EPixelFormats): string;
    /** Returns wether the format can be packed or unpacked with the packColour()
    and unpackColour() functions. This is generally not true for compressed and
    depth formats as they are special. It can only be true for formats with a
    fixed element size.
    @return
    true if yes, otherwise false
    */
    function isAccessible(eSrcFormat: EPixelFormats): boolean;
    /** Returns the component type for a certain pixel format. Returns PCT_BYTE
    in case there is no clear component type like with compressed formats.
    This is one of PCT_BYTE, PCT_SHORT, PCT_FLOAT16, PCT_FLOAT32.
    */
    function getComponentType(eFmt: EPixelFormats): EPixelComponentTypes;
    /** Returns the component count for a certain pixel format. Returns 3(no alpha) or
    4 (has alpha) in case there is no clear component type like with compressed formats.
    */
    function getComponentCount(eFmt: EPixelFormats): number;
    function getComponentTypeBits(eFormat: EPixelFormats): number;
    /** Gets the format from given name.
    @param  name            The string of format name
    @param  accessibleOnly  If true, non-accessible format will treat as invalid format,
    otherwise, all supported format are valid.
    @param  caseSensitive   Should be set true if string match should use case sensitivity.
    @return                The format match the format name, or PF_UNKNOWN if is invalid name.
    */
    function getFormatFromName(sName: string, isAccessibleOnly?: boolean, isCaseSensitive?: boolean): EPixelFormats;
    /** Gets the BNF expression of the pixel-formats.
    @note                   The string returned by this function is intended to be used as a BNF expression
    to work with Compiler2Pass.
    @param  accessibleOnly  If true, only accessible pixel format will take into account, otherwise all
    pixel formats list in EPixelFormats enumeration will being returned.
    @return                A string contains the BNF expression.
    */
    function getBNFExpressionOfPixelFormats(isAccessibleOnly?: boolean): string;
    /** Returns the similar format but acoording with given bit depths.
    @param fmt      The original foamt.
    @param integerBits Preferred bit depth (pixel bits) for integer pixel format.
    Available values: 0, 16 and 32, where 0 (the default) means as it is.
    @param floatBits Preferred bit depth (channel bits) for float pixel format.
    Available values: 0, 16 and 32, where 0 (the default) means as it is.
    @return        The format that similar original format with bit depth according
    with preferred bit depth, or original format if no conversion occurring.
    */
    function getFormatForBitDepths(eFmt: EPixelFormats, iIntegerBits: number, iFloatBits: number): EPixelFormats;
    /** Pack a colour value to memory
    @param colour	The colour
    @param pf		Pixelformat in which to write the colour
    @param dest		Destination memory location
    */
    function packColour(cColour: IColor, ePf: EPixelFormats, pDest: Uint8Array): void;
    /** Pack a colour value to memory
    @param r,g,b,a	The four colour components, range 0x00 to 0xFF
    @param pf		Pixelformat in which to write the colour
    @param dest		Destination memory location
    */
    function packColourUint(r: number, g: number, b: number, a: number, ePf: EPixelFormats, pDest: Uint8Array): void;
    /** Pack a colour value to memory
    @param r,g,b,a	The four colour components, range 0.0f to 1.0f
    (an exception to this case exists for floating point pixel
    formats, which don't clamp to 0.0f..1.0f)
    @param pf		Pixelformat in which to write the colour
    @param dest		Destination memory location
    */
    function packColourFloat(r: number, g: number, b: number, a: number, ePf: EPixelFormats, pDest: Uint8Array): void;
    /** Unpack a colour value from memory
    @param colour	The colour is returned here
    @param pf		Pixelformat in which to read the colour
    @param src		Source memory location
    */
    function unpackColour(cColour: IColor, ePf: EPixelFormats, pSrc: Uint8Array): void;
    /** Unpack a colour value from memory
    @param r,g,b,a	The colour is returned here (as byte)
    @param pf		Pixelformat in which to read the colour
    @param src		Source memory location
    @remarks 	This function returns the colour components in 8 bit precision,
    this will lose precision when coming from PF_A2R10G10B10 or floating
    point formats.
    */
    function unpackColourUint(rgba: IColorIValue, ePf: EPixelFormats, pSrc: Uint8Array): void;
    /** Unpack a colour value from memory
    @param r,g,b,a	The colour is returned here (as float)
    @param pf		Pixelformat in which to read the colour
    @param src		Source memory location
    */
    function unpackColourFloat(rgba: IColorValue, ePf: EPixelFormats, pSrc: Uint8Array): void;
    /** Convert consecutive pixels from one format to another. No dithering or filtering is being done.
    Converting from RGB to luminance takes the R channel.  In case the source and destination format match,
    just a copy is done.
    @param	src			Pointer to source region
    @param	srcFormat	Pixel format of source region
    @param   dst			Pointer to destination region
    @param	dstFormat	Pixel format of destination region
    */
    function bulkPixelConversion(pSrc: Uint8Array, eSrcFormat: EPixelFormats, pDest: Uint8Array, eDstFormat: EPixelFormats, iCount: number): void;
    /** Convert pixels from one format to another. No dithering or filtering is being done. Converting
    from RGB to luminance takes the R channel.
    @param	src			PixelBox containing the source pixels, pitches and format
    @param	dst			PixelBox containing the destination pixels, pitches and format
    @remarks The source and destination boxes must have the same
    dimensions. In case the source and destination format match, a plain copy is done.
    */
    function bulkPixelConversion(pSrc: IPixelBox, pDest: IPixelBox): void;
    function calculateSizeForImage(nMipLevels: number, nFaces: number, iWidth: number, iHeight: number, iDepth: number, eFormat: EPixelFormats): number;
}
declare module akra.webgl {
    var maxTextureSize: number;
    var maxCubeMapTextureSize: number;
    var maxViewPortSize: number;
    var maxTextureImageUnits: number;
    var maxVertexAttributes: number;
    var maxVertexTextureImageUnits: number;
    var maxCombinedTextureImageUnits: number;
    var maxColorAttachments: number;
    var stencilBits: number;
    var colorBits: number[];
    var alphaBits: number;
    var multisampleType: number;
    var shaderVersion: number;
    var hasNonPowerOf2Textures: boolean;
    var OES_TEXTURE_FLOAT: string;
    var OES_TEXTURE_HALF_FLOAT: string;
    var OES_STANDARD_DERIVATIVES: string;
    var OES_VERTEX_ARRAY_OBJECT: string;
    var OES_ELEMENT_INDEX_UINT: string;
    var WEBGL_DEBUG_RENDERER_INFO: string;
    var WEBGL_DEBUG_SHADERS: string;
    var EXT_TEXTURE_FILTER_ANISOTROPIC: string;
    var WEBGL_LOSE_CONTEXT: string;
    var WEBGL_DEPTH_TEXTURE: string;
    var WEBGL_COMPRESSED_TEXTURE_S3TC: string;
    var WEBGL_COMPRESSED_TEXTURE_ATC: string;
    var WEBGL_COMPRESSED_TEXTURE_PVRTC: string;
    var WEBGL_COLOR_BUFFER_FLOAT: string;
    var EXT_COLOR_BUFFER_HALF_FLOAT: string;
    var EXT_TEXTURE_RG: string;
    var OES_DEPTH24: string;
    var OES_DEPTH32: string;
    var OES_PACKED_DEPTH_STENCIL: string;
    var EXT_TEXTURE_NPOT_2D_MIPMAP: string;
    var GLSL_VS_SHADER_MIN: string;
    var GLSL_FS_SHADER_MIN: string;
    function loadExtension(pWebGLContext: WebGLRenderingContext, sExtName: string): boolean;
    var isEnabled: () => boolean;
    function createContext(pCanvas?: HTMLCanvasElement, pOptions?: WebGLContextAttributes): WebGLRenderingContext;
    function hasExtension(sExtName: string): boolean;
    function getWebGLUsage(iFlags: number): number;
    function getWebGLFormat(eFormat: EPixelFormats): number;
    function isWebGLFormatSupport(eFormat: EPixelFormats): boolean;
    function getWebglElementType(eType: EDataTypes): number;
    function getWebGLDataType(eFormat: EPixelFormats): number;
    function getWebGLInternalFormat(eFormat: EPixelFormats): number;
    function getWebGLPrimitiveType(eType: EPrimitiveTypes): number;
    function getClosestWebGLInternalFormat(eFormat: EPixelFormats): number;
    /**
    * Convert GL format to EPixelFormat.
    */
    function getClosestAkraFormat(iGLFormat: number, iGLDataType: number): EPixelFormats;
    function optionalPO2(iValue: number): number;
    function convertToWebGLformat(pSource: IPixelBox, pDest: IPixelBox): void;
    function checkFBOAttachmentFormat(eFormat: EPixelFormats): boolean;
    function checkReadPixelFormat(eFormat: EPixelFormats): boolean;
    function checkCopyTexImage(eFormat: EPixelFormats): boolean;
    function getSupportedAlternative(eFormat: EPixelFormats): EPixelFormats;
}
declare module akra.info {
    class ApiInfo extends util.Singleton<ApiInfo> implements IApiInfo {
        private _bWebAudio;
        private _bFile;
        private _bFileSystem;
        private _bWebWorker;
        private _bTransferableObjects;
        private _bLocalStorage;
        private _bWebSocket;
        private _bGamepad;
        private _bPromise;
        public getWebGL(): boolean;
        public getTransferableObjects(): boolean;
        public getFile(): boolean;
        public getFileSystem(): boolean;
        public getWebAudio(): boolean;
        public getWebWorker(): boolean;
        public getLocalStorage(): boolean;
        public getWebSocket(): boolean;
        public getGamepad(): boolean;
        public getZip(): boolean;
        public getPromise(): boolean;
        constructor();
        private chechTransferableObjects();
    }
}
declare module akra {
    interface IScreenInfo {
        getWidth(): number;
        getHeight(): number;
        getAspect(): number;
        getPixelDepth(): number;
        getColorDepth(): number;
        getAvailHeight(): number;
        getAvailWidth(): number;
    }
}
declare module akra.info {
    class ScreenInfo implements IScreenInfo {
        private _pScreen;
        public getWidth(): number;
        public getHeight(): number;
        public getAspect(): number;
        public getPixelDepth(): number;
        public getColorDepth(): number;
        public getAvailHeight(): number;
        public getAvailWidth(): number;
    }
}
declare module akra {
    interface ICallbackWithSender<S> {
        (sender: S, ...pArgs: any[]): void;
    }
    class Signal<S> implements ISignal<(sender: S, ...pArgs: any[]) => void> {
        private _pBroadcastListeners;
        private _nBroadcastListenersCount;
        private _pUnicastListener;
        private _pSender;
        private _eType;
        private _fnForerunnerTrigger;
        private _pSyncSignal;
        private _sForerunnerTriggerName;
        private static _pEmptyListenersList;
        private static _nEmptyListenersCount;
        /**
        * @param pSender Object, that will be emit signal.
        * @param eType Signal type.
        */
        constructor(pSender: S, eType?: EEventTypes);
        public getListeners(eEventType: EEventTypes): IListener<ICallbackWithSender<S>>[];
        public getSender(): S;
        public getType(): EEventTypes;
        /** @param fn Must be method of signal sender */
        public setForerunner(fn: Function): void;
        public connect(pSignal: ISignal<any>): boolean;
        public connect(fnCallback: ICallbackWithSender<S>, eType?: EEventTypes): boolean;
        public connect(fnCallback: string, eType?: EEventTypes): boolean;
        public connect(pReciever: any, fnCallback: ICallbackWithSender<S>, eType?: EEventTypes): boolean;
        public connect(pReciever: any, fnCallback: string, eType?: EEventTypes): boolean;
        public disconnect(pSignal: ISignal<any>): boolean;
        public disconnect(fnCallback: ICallbackWithSender<S>, eType?: EEventTypes): boolean;
        public disconnect(fnCallback: string, eType?: EEventTypes): boolean;
        public disconnect(pReciever: any, fnCallback: ICallbackWithSender<S>, eType?: EEventTypes): boolean;
        public disconnect(pReciever: any, fnCallback: string, eType?: EEventTypes): boolean;
        public emit(...pArgs: any[]): any;
        public clear(): void;
        public hasListeners(): boolean;
        public _syncSignal(pSignal: ISignal<ICallbackWithSender<S>>): void;
        public _setSender(pSender: S): void;
        private fromParamsToListener(pArguments);
        private findCallbacknameForListener(pReciever, fnCallback);
        private indexOfBroadcastListener(pReciever, fnCallback);
        private getEmptyListener();
        private clearListener(pListener);
        private isMethodExistsInSenderPrototype(fn);
    }
    class MuteSignal<S> extends Signal<S> {
        public emit(): void;
    }
}
declare module akra.info {
    /**
    * @see https://developer.mozilla.org/en-US/docs/Web/Guide/User_experience/Using_the_Page_Visibility_API
    */
    class VisibilityInfo implements IEventProvider {
        public guid: number;
        public visibilityChanged: ISignal<(pInfo: VisibilityInfo, bVisible: boolean) => void>;
        private _bDocumentVisible;
        constructor();
        public setupSignals(): void;
        /** Is visibility api supported? */
        public isSupported(): boolean;
        /** Indicate, whether page visible. */
        public isVisible(): boolean;
        public _onVisibilityChange(bVisible: boolean): void;
        /** Indicates whether the HTML element visible. */
        static isHTMLElementVisible(pElement: HTMLElement): boolean;
    }
}
declare module akra.info {
    function determImageExtension(url: string, cb: (e: Error, pData: Uint8Array, sExt: string) => void): void;
}
declare module akra.info {
    function canvas(pCanvas: HTMLCanvasElement): ICanvasInfo;
    function canvas(id: string): ICanvasInfo;
    var browser: IBrowserInfo;
    var api: IApiInfo;
    var screen: IScreenInfo;
    var visibility: VisibilityInfo;
    var uri: IURI;
    module is {
    }
}
declare module akra.threading {
    class Manager implements IThreadManager, IEventProvider {
        public guid: number;
        public threadReleased: ISignal<(pManager: IThreadManager) => any>;
        private _sDefaultScript;
        private _pWorkerList;
        private _pStatsList;
        private _pWaiters;
        private _iSysRoutine;
        /** @param sScript URL to script, that will be used during Worker initialization. */
        constructor(sScript?: string);
        public setupSignals(): void;
        private startSystemRoutine();
        private stopSystemRoutine();
        public createThread(): boolean;
        public occupyThread(): IThread;
        public terminateThread(iThread: number): boolean;
        private checkWaiters(pThread?);
        public waitForThread(fnWaiter: Function): number;
        public releaseThread(pThread: IThread): boolean;
        public releaseThread(iThread: number): boolean;
        public initialize(): boolean;
        public destroy(): void;
    }
}
declare module akra.threading {
}
declare module akra.io {
    enum EFileActions {
        k_Open = 1,
        k_Read = 2,
        k_Write = 3,
        k_Clear = 4,
        k_Exists = 5,
        k_Remove = 6,
    }
    interface IFileCommand {
        act: EFileActions;
        name: string;
        mode: number;
        pos?: number;
        transfer?: EFileTransferModes;
        data?: any;
        contentType?: string;
        progress?: boolean;
    }
    class TFile implements IFile {
        public guid: number;
        public opened: ISignal<(pFile: IFile) => void>;
        public closed: ISignal<(pFile: IFile) => void>;
        public renamed: ISignal<(pFile: IFile, sName: string, sNamePrev: string) => void>;
        private static localManager;
        private static remoteManager;
        public _iMode: number;
        public _pUri: IURI;
        public _nCursorPosition: number;
        public _bOpened: boolean;
        public _eTransferMode: EFileTransferModes;
        public _pFileMeta: IFileMeta;
        public _isLocal: boolean;
        constructor(sFilename?: string, sMode?: string, cb?: (e: Error, pMeta: IFileMeta) => void);
        constructor(sFilename?: string, iMode?: number, cb?: (e: Error, pMeta: IFileMeta) => void);
        public setupSignals(): void;
        public getPath(): string;
        public getName(): string;
        public getByteLength(): number;
        public getMode(): number;
        public setMode(sMode: string): void;
        public setMode(iMode: number): void;
        public getPosition(): number;
        public setPosition(iOffset: number): void;
        public open(sFilename: string, iMode: number, cb?: (e: Error, pMeta: IFileMeta) => void): void;
        public open(sFilename: string, sMode: string, cb?: (e: Error, pMeta: IFileMeta) => void): void;
        public open(sFilename: string, cb?: (e: Error, pMeta: IFileMeta) => void): void;
        public open(iMode: number, cb?: (e: Error, pMeta: IFileMeta) => void): void;
        public open(cb?: (e: Error, pMeta: IFileMeta) => void): void;
        public close(): void;
        public checkIfNotOpen(method: Function, callback: Function, pArgs?: IArguments): boolean;
        public clear(cb?: Function): void;
        public read(cb?: (e: Error, data: any) => void, fnProgress?: (bytesLoaded: number, bytesTotal: number) => void): void;
        public write(sData: string, cb?: Function, sContentType?: string): void;
        public write(pData: ArrayBuffer, cb?: Function, sContentType?: string): void;
        public move(sFilename: string, cb?: (e: Error, sPath: string, sPathPrev: string) => void): void;
        public copy(sFilename: string, cb?: (e: Error, pCopy: IFile, pMeta: IFileMeta) => void): void;
        public rename(sFilename: string, cb?: (e: Error, sName: string, sNamePrev: string) => void): void;
        public remove(cb?: Function): void;
        public atEnd(): number;
        public seek(iOffset: number): number;
        public isOpened(): boolean;
        public isExists(cb: Function): void;
        public isLocal(): boolean;
        public getMetaData(cb: (e: Error, pMeta: IFileMeta) => void): void;
        private setAndValidateUri(sFilename);
        public update(cb?: Function): void;
        private execCommand(pCommand, cb, pTransferables?);
        static defaultCallback: Function;
        private static execCommand(pFile, isLocal, pCommand, cb, pTransferables?);
    }
}
declare module akra {
    interface IPackerOptions {
        header?: boolean;
    }
    interface IPacker extends IBinWriter {
        getTemplate(): IPackerTemplate;
        write(pData: any, sType?: string, bHeader?: boolean): boolean;
    }
}
declare module akra {
    interface IPackerBlacklist {
        [type: string]: Function;
    }
    interface IPackerCodec {
        /**
        * Как читать данные кодека
        * @type {String | () => any}
        */
        read?: any;
        /**
        * Как писать данные
        * @type{String | (pData: any) => void}
        */
        write?: any;
    }
    interface IPackerFormat {
        [type: string]: any;
    }
    interface IPackerTemplate {
        getType(iType: number): any;
        getTypeId(sType: string): number;
        set(pFormat: IPackerFormat): void;
        detectType(pObject: any): string;
        resolveType(sType: string): string;
        properties(sType: any): IPackerCodec;
        data(): IPackerFormat;
    }
}
declare module akra {
    interface IBinWriter {
        getByteLength(): number;
        string(sData: string): void;
        uint32(iValue: number): void;
        uint16(iValue: number): void;
        uint8(iValue: number): void;
        boolean(bValue: boolean): void;
        int32(iValue: number): void;
        int16(iValue: number): void;
        int8(iValue: number): void;
        float64(fValue: number): void;
        float32(fValue: number): void;
        stringArray(pValue: string[]): void;
        uint32Array(pValue: Uint32Array): void;
        uint16Array(pValue: Uint16Array): void;
        uint8Array(pValue: Uint8Array): void;
        int32Array(pValue: Int32Array): void;
        int16Array(pValue: Int16Array): void;
        int8Array(pValue: Int8Array): void;
        float64Array(pValue: Float64Array): void;
        float32Array(pValue: Float64Array): void;
        data(): ArrayBuffer;
        dataAsString(): string;
        dataAsUint8Array(): Uint8Array;
    }
}
declare module akra {
    interface IBinReader {
        string(sDefault?: string): string;
        uint32(): number;
        uint16(): number;
        uint8(): number;
        boolean(): boolean;
        int32(): number;
        int16(): number;
        int8(): number;
        float64(): number;
        float32(): number;
        stringArray(): string[];
        uint32Array(): Uint32Array;
        uint16Array(): Uint16Array;
        uint8Array(): Uint8Array;
        int32Array(): Int32Array;
        int16Array(): Int16Array;
        int8Array(): Int8Array;
        float64Array(): Float64Array;
        float32Array(): Float32Array;
    }
}
declare module akra {
    var MIN_INT32: number;
    var MAX_INT32: number;
    var MIN_INT16: number;
    var MAX_INT16: number;
    var MIN_INT8: number;
    var MAX_INT8: number;
    var MIN_UINT32: number;
    var MAX_UINT32: number;
    var MIN_UINT16: number;
    var MAX_UINT16: number;
    var MIN_UINT8: number;
    var MAX_UINT8: number;
    var SIZE_FLOAT64: number;
    var SIZE_REAL64: number;
    var SIZE_FLOAT32: number;
    var SIZE_REAL32: number;
    var SIZE_INT32: number;
    var SIZE_UINT32: number;
    var SIZE_INT16: number;
    var SIZE_UINT16: number;
    var SIZE_INT8: number;
    var SIZE_UINT8: number;
    var SIZE_BYTE: number;
    var SIZE_UBYTE: number;
    var MAX_FLOAT64: number;
    var MIN_FLOAT64: number;
    var TINY_FLOAT64: number;
    var MAX_FLOAT32: number;
    var MIN_FLOAT32: number;
    var TINY_FLOAT32: number;
}
/**
* Как исполльзовать:
* var bw = new BinWriter();	  //создаем экземпляр класса
*						STRING
* bw.string("abc");			  //запигшет строку
* bw.stringArray(["abc", "abc"]) //запишет массив строк
*						UINT
* bw.uint8(1)			 //варовняет до 4 байт uint и запишет
* bw.uint16(1)			//варовняет до 4 байт uint и запишет
* bw.uint32(1)			//запишет uint32
* bw.uint8Array([1, 2])   //запишет массив uint8 где каждое число будет занимать
*						 //1 байт и выровняет общую длинну массива до 4
* bw.uint16Array([1, 2])  //запишет массив uint16 где каждое число будет занимать
*						 //2 байта и выровняет общую длинну массива до 4
* bw.uint32Array([1, 2])  //запишет массив uint32 где каждое число будет занимать
*						 //4 байта
*						INT
* bw.int8(1)			  //варовняет до 4 байт int и запишет
* bw.int16(1)			 //варовняет до 4 байт int и запишет
* bw.int32(1)			 //запишет int32
* bw.int8Array([1, 2])	//запишет массив int8 где каждое число будет занимать
*						 //1 байт и выровняет общую длинну массива до 4
* bw.int16Array([1, 2])   //запишет массив int16 где каждое число будет занимать
*						 //2 байта и выровняет общую длинну массива до 4
* bw.int32Array([1, 2])   //запишет массив int32 где каждое число будет занимать
*						 //4 байта
*						 FLOAT
* bw.float64(1.1)			 //запишет float64
* bw.float32(1.1)			 //запишет float32
* bw.float32Array([1.2, 2.3]) //запишет массив float32
* bw.float64Array([1.2, 2.3]) //запишет массив float64
*
* bw.data()			 //возвратит массив типа ArrayBuffer где бедет лежать все записанные данные
* bw.dataAsString()	 //соберет все данные в строку и вернет
* bw.dataAsUint8Array() //соберет все данные в массив Uint8 и вернет
*/
declare module akra.io {
    class BinWriter implements IBinWriter {
        /**
        * Двумерный массив куда заносятся данные.
        * @private
        * @type Uint8Array[]
        */
        public _pArrData: Uint8Array[];
        /**
        * Счетчик общего количества байт.
        * @private
        * @type int
        */
        public _iCountData: number;
        public getByteLength(): number;
        /******************************************************************************/
        /**
        * @property string(str)
        * Запись строки. Перед строкой записывается длинна строки в тип uint32. Если
        * передано null или undefined то длинна строки записывается как 0xffffffff.
        * Это сделано для того что при дальнейшем считывании такая строка будет
        * возвращена как null.
        * @memberof BinWriter
        * @tparam String str строка. Все не строковые типы преобразуются к строке.
        */
        public string(str: string): void;
        /******************************************************************************/
        /**
        * @property uintX(iValue, iX)
        * Запись числа типа uint(8, 16, 32). Если число занимает меньше 4 байт то оно
        * выравнивается до 4 байт. Если передан null то число принимается равным 0.
        * Если передано любое другое не числовое значение то выводится ошибка.
        * @memberof BinWriter
        * @tparam uint iValue число.
        * @tparam int iX - 8, 16, 32 количество бит.
        */
        private uintX(iValue, iX);
        /**
        * @property uint8(iValue)
        * Запись числа типа uint8. Оно выравнивается до 4 байт. Если передан null то
        * число принимается равным 0. Если передано любое другое не числовое значение
        * то выводится ошибка.
        * Сокращенная запись функции uintX(iValue, 8).
        * @memberof BinWriter
        * @tparam uint iValue число.
        */
        public uint8(iValue: number): void;
        /**
        * @property uint16(iValue)
        * Запись числа типа uint16. Оно выравнивается до 4 байт. Если передан null то
        * число принимается равным 0. Если передано любое другое не числовое значение
        * то выводится ошибка.
        * Сокращенная запись функции uintX(iValue, 16).
        * @memberof BinWriter
        * @tparam uint iValue число.
        */
        public uint16(iValue: number): void;
        /**
        * @property uint32(iValue)
        * Запись числа типа uint8. Если передан null то число принимается равным 0.
        * Если передано любое другое не числовое значение то выводится ошибка.
        * Сокращенная запись функции uintX(iValue, 32).
        * @memberof BinWriter
        * @tparam uint iValue число.
        */
        public uint32(iValue: number): void;
        /**
        * @property boolean(bValue)
        * Запись числа типа boolean. В зависимости от bValue записывается либо 1 либо ноль.
        * Если передано любое другое не числовое значение то выводится ошибка.
        * Сокращенная запись функции uintX(bValue? 1: 0, 8).
        * @memberof BinWriter
        * @tparam boolean bValue число.
        */
        public boolean(bValue: boolean): void;
        /******************************************************************************/
        /**
        * @property writeArrayElementUintX(iValue, iX)
        * Запись числа типа uint(8, 16, 32). Используется для записи элементов массивов.
        * В отличии от uintX число не выравнивается до 4 байт, а записывается ровно
        * столько байт сколько передано во втором параметре в функцию. Вторым
        * параметром передается колчиество бит а не байт. Если передан null то число
        * принимается равным 0. Если передано любое другое не числовое значение то
        * выводится ошибка.
        * @memberof BinWriter
        * @tparam uint iValue число.
        * @tparam int iX - 8, 16, 32 количество бит.
        */
        private writeArrayElementUintX(iValue, iX);
        /******************************************************************************/
        /**
        * @property intX(iValue, iX)
        * Запись числа типа int(8, 16, 32). Если число занимает меньше 4 байт то оно
        * выравнивается до 4 байт. Если передан null то число принимается равным 0.
        * Если передано любое другое не числовое значение то выводится ошибка.
        * @memberof BinWriter
        * @tparam int iValue число.
        * @tparam int iX - 8, 16, 32 количество бит.
        */
        private intX(iValue, iX);
        /**
        * @property int8(iValue)
        * Запись числа типа int8. Оно выравнивается до 4 байт. Если передан null то
        * число принимается равным 0. Если передано любое другое не числовое значение
        * то выводится ошибка.
        * Сокращенная запись функции intX(iValue, 8).
        * @memberof BinWriter
        * @tparam uint iValue число.
        */
        public int8(iValue: number): void;
        /**
        * @property int16(iValue)
        * Запись числа типа uint16. Оно выравнивается до 4 байт. Если передан null то
        * число принимается равным 0. Если передано любое другое не числовое значение
        * то выводится ошибка.
        * Сокращенная запись функции intX(iValue, 16).
        * @memberof BinWriter
        * @tparam int iValue число.
        */
        public int16(iValue: number): void;
        /**
        * @property uint32(iValue)
        * Запись числа типа uint8. Если передан null то число принимается равным 0.
        * Если передано любое другое не числовое значение то выводится ошибка.
        * Сокращенная запись функции intX(iValue, 32).
        * @memberof BinWriter
        * @tparam int iValue число.
        */
        public int32(iValue: number): void;
        /******************************************************************************/
        /**
        * @property writeArrayElementIntX(iValue, iX)
        * Запись числа типа int(8, 16, 32). Используется для записи элементов массивов.
        * В отличии от intX число не выравнивается до 4 байт, а записывается ровно
        * столько байт сколько передано во втором параметре в функцию. Вторым
        * параметром передается колчиество бит а не байт. Если передан null то число
        * принимается равным 0. Если передано любое другое не числовое значение то
        * выводится ошибка.
        * @memberof BinWriter
        * @tparam int iValue число.
        * @tparam int iX - 8, 16, 32 количество бит.
        */
        private writeArrayElementIntX(iValue, iX);
        /******************************************************************************/
        /**
        * @property floatX(fValue, iX)
        * Запись числа типа float(32, 64). выравнивания не происходит т.к. они уже
        * выравнены до 4. Если передан null то число принимается равным 0.
        * Если передано любое другое не числовое значение то выводится ошибка.
        * @memberof BinWriter
        * @tparam float fValue число.
        * @tparam int iX - 32, 64 количество бит.
        */
        private floatX(fValue, iX);
        /**
        * @property float32(fValue)
        * Запись числа типа float32. Если передан null то число принимается равным 0.
        * Если передано любое другое не числовое значение то выводится ошибка.
        * Сокращенная запись функции floatX(fValue, 32).
        * @memberof BinWriter
        * @tparam float fValue число.
        */
        public float32(fValue: any): void;
        /**
        * @property float64(fValue)
        * Запись числа типа float64. Если передан null то число принимается равным 0.
        * Если передано любое другое не числовое значение то выводится ошибка.
        * Сокращенная запись функции floatX(fValue, 64).
        * @memberof BinWriter
        * @tparam float fValue число.
        */
        public float64(fValue: any): void;
        /******************************************************************************/
        /**
        * @property stringArray(arrString)
        * Записывает массив строк использую дял каждого элемента функцию this.string
        * Да начала записи элементов записывает общее количество элементов как число
        * uint32. Если в качестве параметра функции передано null или undefined
        * то количество элементов записывается равным 0xffffffff.
        * @memberof BinWriter
        * @tparam Array arrString массив строк.
        */
        public stringArray(arrString: string[]): void;
        /******************************************************************************/
        /**
        * @property uintXArray(arrUint, iX)
        * Записывает массив чисел uint(8, 16, 32) использую для каждого элемента функцию
        *  writeArrayElementUintX. До начала записи элементов записывает общее
        *  количество элементов как число uint32. Если в качестве параметра функции
        * передано null или undefined то количество элементов записывается
        * равным 0xffffffff. Общее количество байт в массиве выравнивается к 4.
        * Все массивы приводятся к нужному типу Uint(iX)Array.
        * @memberof BinWriter
        * @tparam Uint(iX)Array arrUint массив uint(iX).
        * @tparam int iX размер элемента в битах (8, 16, 32).
        */
        public uintXArray(arrUint: ArrayBufferView, iX: number): void;
        /**
        * @property uint8Array(arrUint)
        * Запись массива типа Uint8Array. До начала записи элементов записывает общее
        * количество элементов как число uint32. Если в качестве параметра функции
        * передано null или undefined то количество элементов записывается
        * равным 0xffffffff. Общее количество байт в массиве выравнивается до 4.
        * Сокращенная запись функции uintXArray(arrUint, 8).
        * @memberof BinWriter
        * @tparam Uint8Array arrUint массив uint8.
        */
        public uint8Array(arrUint: Uint8Array): void;
        /**
        * @property uint16Array(arrUint)
        * Запись массива типа Uint16Array. До начала записи элементов записывает общее
        * количество элементов как число uint32. Если в качестве параметра функции
        * передано null или undefined то количество элементов записывается
        * равным 0xffffffff. Общее количество байт в массиве выравнивается до 4.
        * Сокращенная запись функции uintXArray(arrUint, 16).
        * @memberof BinWriter
        * @tparam Uint16Array arrUint массив uint16.
        */
        public uint16Array(arrUint: Uint16Array): void;
        /**
        * @property uint32Array(arrUint)
        * Запись массива типа Uint32Array. До начала записи элементов записывает общее
        * количество элементов как число uint32. Если в качестве параметра функции
        * передано null или undefined то количество элементов записывается
        * равным 0xffffffff.
        * Сокращенная запись функции uintXArray(arrUint, 32).
        * @memberof BinWriter
        * @tparam Uint32Array arrUint массив uint32.
        */
        public uint32Array(arrUint: Uint32Array): void;
        /******************************************************************************/
        /**
        * @property intXArray(arrInt, iX)
        * Записывает массив чисел int(8, 16, 32) использую для каждого элемента функцию
        *  writeArrayElementIntX. До начала записи элементов записывает общее
        *  количество элементов как число int32. Если в качестве параметра функции
        * передано null или undefined то количество элементов записывается
        * равным 0xffffffff. Общее количество байт в массиве выравнивается к 4.
        * Все массивы приводятся к нужному типу Int(iX)Array.
        * @memberof BinWriter
        * @tparam Int(iX)Array arrUint массив int(iX).
        * @tparam int iX размер элемента в битах (8, 16, 32).
        */
        public intXArray(arrInt: ArrayBufferView, iX: number): void;
        /**
        * @property int8Array(arrInt)
        * Запись массива типа Int8Array. До начала записи элементов записывает общее
        * количество элементов как число uint32. Если в качестве параметра функции
        * передано null или undefined то количество элементов записывается
        * равным 0xffffffff. Общее количество байт в массиве выравнивается до 4.
        * Сокращенная запись функции intXArray(arrInt, 8).
        * @memberof BinWriter
        * @tparam Int8Array arrInt массив int8.
        */
        public int8Array(arrInt: Int8Array): void;
        /**
        * @property int16Array(arrInt)
        * Запись массива типа Int16Array. До начала записи элементов записывает общее
        * количество элементов как число uint32. Если в качестве параметра функции
        * передано null или undefined то количество элементов записывается
        * равным 0xffffffff. Общее количество байт в массиве выравнивается до 4.
        * Сокращенная запись функции intXArray(arrInt, 16).
        * @memberof BinWriter
        * @tparam Int16Array arrInt массив int16.
        */
        public int16Array(arrInt: Int16Array): void;
        /**
        * @property int32Array(arrInt)
        * Запись массива типа Int32Array. До начала записи элементов записывает общее
        * количество элементов как число uint32. Если в качестве параметра функции
        * передано null или undefined то количество элементов записывается
        * равным 0xffffffff.
        * Сокращенная запись функции intXArray(arrInt, 32).
        * @memberof BinWriter
        * @tparam Int32Array arrInt массив int32.
        */
        public int32Array(arrInt: Int32Array): void;
        /******************************************************************************/
        /**
        * @property floatXArray(arrFloat, iX)
        * Записывает массив чисел float(32, 64) использую для каждого элемента функцию
        *  floatX. До начала записи элементов записывает общее
        *  количество элементов как число int32. Если в качестве параметра функции
        * передано null или undefined то количество элементов записывается
        * равным 0xffffffff.
        * Все массивы приводятся к нужному типу Float(iX)Array.
        * @memberof BinWriter
        * @tparam Float(iX)Array arrFloat массив float(iX).
        * @tparam int iX размер элемента в битах (32, 64).
        */
        public floatXArray(arrFloat: ArrayBufferView, iX: number): void;
        /**
        * @property float32Array(arrFloat)
        * Запись массива типа Float32Array. До начала записи элементов записывает общее
        * количество элементов как число uint32. Если в качестве параметра функции
        * передано null или undefined то количество элементов записывается
        * равным 0xffffffff.
        * Все переданные массивы приводятся к типу Float32Array.
        * Сокращенная запись функции floatXArray(arrFloat, 32).
        * @memberof BinWriter
        * @tparam Float32Array arrFloat массив float32.
        */
        public float32Array(arrFloat: Float32Array): void;
        /**
        * @property float64Array(arrFloat)
        * Запись массива типа Float64Array. До начала записи элементов записывает общее
        * количество элементов как число uint32. Если в качестве параметра функции
        * передано null или undefined то количество элементов записывается
        * равным 0xffffffff.
        * Все переданные массивы приводятся к типу Float64Array.
        * Сокращенная запись функции floatXArray(arrFloat, 64).
        * @memberof BinWriter
        * @tparam Float64Array arrFloat массив float64.
        */
        public float64Array(arrFloat: Float64Array): void;
        /**
        * @property data()
        * Берет все данные из массива _pArrData и записывает их в массив
        * типа ArrayBuffer.
        * @memberof BinWriter
        * @treturn ArrayBuffer.
        */
        public data(): ArrayBuffer;
        /**
        * @property data()
        * Берет все данные из массива _pArrData и записывает их в строку.
        * @memberof BinWriter
        * @treturn String.
        */
        public dataAsString(): string;
        /**
        * @property toUint8Array()
        * Берет все данные из массива _pArrData и вернет Uint8Array.
        * @memberof BinWriter
        * @treturn Uint8Array.
        */
        public dataAsUint8Array(): Uint8Array;
        /**
        * @property rawStringToBuffer()
        * Берет строку и преобразует ее в массив Uint8Array.
        * @memberof BinWriter
        * @treturn Uint8Array.
        */
        static rawStringToBuffer(str: any): Uint8Array;
    }
}
declare module akra.io {
    class Packer extends BinWriter implements IPacker {
        public _pHashTable: IMap<any>;
        public _pTemplate: IPackerTemplate;
        constructor(pTemplate: IPackerTemplate);
        public getTemplate(): IPackerTemplate;
        private memof(pObject, iAddr, sType);
        private addr(pObject, sType);
        private nullPtr();
        private rollback(n?);
        private append(pData);
        private x;
        private writeData(pObject, sType);
        public write(pObject: any, sType?: string): boolean;
    }
}
declare module akra {
    interface IUnPacker extends IBinReader {
        getTemplate(): IPackerTemplate;
        read(): any;
    }
}
/**
* Usage:
* var br = new Binreader(data); type of data is ArrayBuffer
* var string = bw.string();
* var array = bw.stringArray()
* var value = bw.uint8()
* var value = bw.uint16()
* var value = bw.uint32()
* var array = bw.uint8Array()
* var array = bw.uint16Array()
* var array = bw.uint32Array()
* var value = bw.int8()
* var value = bw.int16()
* var value = bw.int32()
* var array = bw.int8Array()
* var array = bw.int16Array()
* var array = bw.int32Array()
* var value = bw.float64()
* var value = bw.float32()
* var array = bw.float32Array()
* var array = bw.float64Array()
*/
/**
* Работает заебись, докуменитировать лень.
*/
declare module akra.io {
    class BinReader implements IBinReader {
        public _pDataView: DataView;
        public _iPosition: number;
        constructor(pBuffer: ArrayBuffer, iByteOffset?: number, iByteLength?: number);
        constructor(pBuffer: IBinWriter, iByteOffset?: number, iByteLength?: number);
        public string(sDefault?: string): string;
        public uint32(): number;
        public uint16(): number;
        public uint8(): number;
        public boolean(): boolean;
        public int32(): number;
        public int16(): number;
        public int8(): number;
        public float64(): number;
        public float32(): number;
        public stringArray(): string[];
        public uint32Array(): Uint32Array;
        public uint16Array(): Uint16Array;
        public uint8Array(): Uint8Array;
        public int32Array(): Int32Array;
        public int16Array(): Int16Array;
        public int8Array(): Int8Array;
        public float64Array(): Float64Array;
        public float32Array(): Float32Array;
        private uintXArray(iX);
        private intXArray(iX);
        private floatXArray(iX);
    }
}
declare module akra.io {
    class UnPacker extends BinReader implements IUnPacker {
        public _pHashTable: any[];
        public _pTemplate: IPackerTemplate;
        public _pPositions: number[];
        constructor(pBuffer: any, pTemlate: IPackerTemplate);
        public getTemplate(): IPackerTemplate;
        private pushPosition(iPosition);
        private popPosition();
        private memof(pObject, iAddr);
        private memread(iAddr);
        private readPtr(iAddr, sType, pObject?);
        public read(): any;
    }
}
declare module akra.io {
    class PackerTemplate {
        public _pData: IPackerFormat;
        public _nTypes: number;
        public _pNum2Tpl: IMap<string>;
        public _pTpl2Num: IMap<number>;
        constructor(pData?: IPackerFormat);
        public getType(iType: number): string;
        public getTypeId(sType: string): number;
        public set(pFormat: IPackerFormat): void;
        public detectType(pObject: any): string;
        public resolveType(sType: string): string;
        public properties(sType: any): IPackerCodec;
        public data(): IPackerFormat;
        static getClass(pObj: any): string;
    }
}
declare module akra.io.templates {
    var common: IPackerTemplate;
}
declare module akra.io {
    function canCreate(mode: number): boolean;
    function canRead(mode: number): boolean;
    function canWrite(mode: number): boolean;
    function isAppend(mode: number): boolean;
    function isTrunc(mode: number): boolean;
    function isBinary(mode: number): boolean;
    function isText(mode: number): boolean;
    function isJson(mode: number): boolean;
    function isUrl(mode: number): boolean;
    function filemode(sMode: string): number;
    function fopen(sUri: string, pMode?: any): IFile;
    function dump(pObject: any, pTemplate?: IPackerTemplate): ArrayBuffer;
    function undump(pBuffer: any, pTemplate?: IPackerTemplate): any;
}
declare module akra.exchange {
    class Exporter {
        static VERSION: string;
        static UP_AXIS: string;
        static TOOL: string;
        public _pLibrary: ILibrary;
        public _pDocument: IDocument;
        public _bScenesWrited: boolean;
        public _sTitle: string;
        public _sSubject: string;
        public _pKeywords: string[];
        public _sAuthor: string;
        public _sComments: string;
        public _sCopyright: string;
        public _sSourceData: string;
        public writeAnimation(pAnimation: IAnimationBase): void;
        public writeController(pController: IAnimationController): void;
        public writeMaterial(pMaterial: IMaterial): void;
        public clear(): void;
        public findLibraryEntry(iGuid: number): ILibraryEntry;
        public findEntry(iGuid: number): IDataEntry;
        public findEntryData(iGuid: number): any;
        public isSceneWrited(): boolean;
        public isEntryExists(iGuid: number): boolean;
        public makeEntry(eType: EDocumentEntry, pData: IUnique): void;
        public writeEntry(eType: EDocumentEntry, pEntry: ILibraryEntry): void;
        public encodeEntry(eType: EDocumentEntry, pEntry: ILibraryEntry): boolean;
        public encodeAnimationBaseEntry(pAnimation: IAnimationBase): IDataEntry;
        public encodeAnimationFrameEntry(pFrame: IPositionFrame): IAnimationFrameEntry;
        public encodeAnimationTrack(pTrack: IAnimationTrack): IAnimationTrackEntry;
        public encodeAnimationEntry(pAnimation: IAnimation): IDataEntry;
        public encodeAnimationContainerEntry(pContainer: IAnimationContainer): IDataEntry;
        public encodeAnimationBlendEntry(pBlend: IAnimationBlend): IDataEntry;
        public encodeControllerEntry(pController: IAnimationController): IDataEntry;
        public encodeMaterialEntry(pMaterial: IMaterial): IMaterialEntry;
        public encodeColorEntry(pColor: IColor): IColorEntry;
        public toolInfo(): string;
        public createUnit(): IUnit;
        public createContributor(): IContributor;
        public createAsset(): IAsset;
        public createDocument(): IDocument;
        public export(eFormat?: EDocumentFormat): Blob;
        public saveAs(sName: string, eFormat?: EDocumentFormat): void;
        static exportAsJSON(pDocument: IDocument): Blob;
        static exportAsJSONBinary(pDocument: IDocument): Blob;
        static getDate(): string;
    }
}
declare module akra.animation {
    class Frame implements IFrame {
        public type: EAnimationInterpolations;
        public time: number;
        public weight: number;
        constructor(eType: EAnimationInterpolations, fTime?: number, fWeight?: number);
        public reset(): IFrame;
        public add(pFrame: IFrame, isFirst: boolean): IFrame;
        public set(pFrame: IFrame): IFrame;
        public mult(fScalar: number): IFrame;
        public normilize(): IFrame;
        public interpolate(pStartFrame: IFrame, pEndFrame: IFrame, fBlend: number): IFrame;
    }
    class PositionFrame extends Frame implements IPositionFrame {
        private matrix;
        public rotation: IQuat4;
        public scale: IVec3;
        public translation: IVec3;
        constructor();
        constructor(fTime: number, pMatrix: IMat4);
        constructor(fTime: number, pMatrix: IMat4, fWeight: number);
        public toMatrix(): IMat4;
        public reset(): IPositionFrame;
        public set(pFrame: IPositionFrame): IPositionFrame;
        /**
        * Adding frame data with own weight.
        * @note Frame must be normilized after this modification!
        */
        public add(pFrame: IPositionFrame, isFirst: boolean): IPositionFrame;
        public normilize(): IPositionFrame;
        public interpolate(pStartFrame: IPositionFrame, pEndFrame: IPositionFrame, fBlend: number): IPositionFrame;
        static temp(): IFrame;
    }
    class MatrixFrame extends Frame {
        public matrix: IMat4;
        constructor();
        constructor(fTime: number, pMatrix: IMat4);
        constructor(fTime: number, pMatrix: IMat4, fWeight: number);
        public reset(): MatrixFrame;
        public set(pFrame: MatrixFrame): MatrixFrame;
        public toMatrix(): IMat4;
        public add(pFrame: MatrixFrame, isFirst: boolean): MatrixFrame;
        public normilize(): MatrixFrame;
        public interpolate(pStartFrame: MatrixFrame, pEndFrame: MatrixFrame, fBlend: number): MatrixFrame;
        static temp(): IFrame;
    }
}
declare module akra.animation {
    class Parameter implements IAnimationParameter {
        private _pKeyFrames;
        public getTotalFrames(): number;
        public getDuration(): number;
        public getFirst(): number;
        public keyFrame(pFrame: IFrame): boolean;
        public getKeyFrame(iFrame: number): IFrame;
        public findKeyFrame(fTime: number): number;
        public frame(fTime: number): IFrame;
    }
    function createParameter(): IAnimationParameter;
}
declare module akra.animation {
    function createTrack(sTarget?: string): IAnimationTrack;
}
declare module akra.util {
    class ReferenceCounter implements IReferenceCounter {
        private nReferenceCount;
        /** Выстанавливает чило ссылок  на объект в ноль */
        constructor();
        /**
        * Выстанавливает чило ссылок  на объект в ноль
        * количесвто ссылок привязаны к конкретному экземпляру, поэтому никогда не копируются
        */
        constructor(pSrc: IReferenceCounter);
        public referenceCount(): number;
        public destructor(): void;
        public release(): number;
        public addRef(): number;
        public eq(pSrc: IReferenceCounter): IReferenceCounter;
    }
}
declare module akra.util {
    class Entity extends ReferenceCounter implements IEntity {
        public guid: number;
        public attached: ISignal<(pEntity: IEntity) => void>;
        public detached: ISignal<(pEntity: IEntity) => void>;
        public childAdded: ISignal<(pEntity: IEntity, pChild: IEntity) => void>;
        public childRemoved: ISignal<(pEntity: IEntity, pChild: IEntity) => void>;
        public _sName: string;
        public _pParent: IEntity;
        public _pSibling: IEntity;
        public _pChild: IEntity;
        public _eType: EEntityTypes;
        public _iStateFlags: number;
        public getName(): string;
        public setName(sName: string): void;
        public getParent(): IEntity;
        public setParent(pParent: IEntity): void;
        public getSibling(): IEntity;
        public setSibling(pSibling: IEntity): void;
        public getChild(): IEntity;
        public setChild(pChild: IEntity): void;
        public getType(): EEntityTypes;
        public getRightSibling(): IEntity;
        public getDepth(): number;
        constructor(eType: EEntityTypes);
        public setupSignals(): void;
        public getRoot(): IEntity;
        public destroy(bRecursive?: boolean, bPromoteChildren?: boolean): void;
        public findEntity(sName: string): IEntity;
        public explore(fn: IExplorerFunc, bWithSiblings?: boolean): void;
        public childOf(pParent: IEntity): boolean;
        public children(): IEntity[];
        public childAt(i: number): IEntity;
        /**
        * Returns the current number of siblings of this object.
        */
        public siblingCount(): number;
        public descCount(): number;
        /**
        * Returns the current number of children of this object
        */
        public childCount(): number;
        public isUpdated(): boolean;
        public hasUpdatedSubNodes(): boolean;
        public recursiveUpdate(): boolean;
        public recursivePreUpdate(): void;
        public prepareForUpdate(): void;
        /** Parent is not undef */
        public hasParent(): boolean;
        /** Child is not undef*/
        public hasChild(): boolean;
        /** Sibling is not undef */
        public hasSibling(): boolean;
        /**
        * Checks to see if the provided item is a sibling of this object
        */
        public isASibling(pSibling: IEntity): boolean;
        /** Checks to see if the provided item is a child of this object. (one branch depth only) */
        public isAChild(pChild: IEntity): boolean;
        /**
        * Checks to see if the provided item is a child or sibling of this object. If SearchEntireTree
        * is TRUE, the check is done recursivly through all siblings and children. SearchEntireTree
        * is FALSE by default.
        */
        public isInFamily(pEntity: IEntity, bSearchEntireTree?: boolean): boolean;
        /**
        * Adds the provided ModelSpace object to the descendant list of this object. The provided
        * ModelSpace object is removed from any parent it may already belong to.
        */
        public addSibling(pSibling: IEntity): IEntity;
        /**
        * Adds the provided ModelSpace object to the descendant list of this object. The provided
        * ModelSpace object is removed from any parent it may already belong to.
        */
        public addChild(pChild: IEntity): IEntity;
        /**
        * Removes a specified child object from this parent object. If the child is not the
        * FirstChild of this object, all of the Children are searched to find the object to remove.
        */
        public removeChild(pChild: IEntity): IEntity;
        /** Removes all Children from this parent object */
        public removeAllChildren(): void;
        /** Attaches this object ot a new parent. Same as calling the parent's addChild() routine. */
        public attachToParent(pParent: IEntity): boolean;
        public detachFromParent(): boolean;
        /**
        * Attaches this object's children to it's parent, promoting them up the tree
        */
        public promoteChildren(): void;
        public relocateChildren(pParent: IEntity): void;
        public update(): boolean;
        public toString(isRecursive?: boolean, iDepth?: number): string;
    }
}
declare module akra.scene {
    enum ENodeUpdateFlags {
        k_SetForDestruction = 0,
        k_NewOrientation = 1,
        k_NewWorldMatrix = 2,
        k_NewLocalMatrix = 3,
        k_RebuildInverseWorldMatrix = 4,
        k_RebuildNormalMatrix = 5,
    }
    class Node extends util.Entity implements INode {
        public _m4fLocalMatrix: IMat4;
        public _m4fWorldMatrix: IMat4;
        public _m4fInverseWorldMatrix: IMat4;
        public _m3fNormalMatrix: IMat3;
        public _v3fWorldPosition: IVec3;
        public _qRotation: IQuat4;
        public _v3fTranslation: IVec3;
        public _v3fScale: IVec3;
        public _iUpdateFlags: number;
        public _eInheritance: ENodeInheritance;
        public create(): boolean;
        public getLocalOrientation(): IQuat4;
        public setLocalOrientation(qOrient: IQuat4): INode;
        public getLocalPosition(): IVec3;
        public setLocalPosition(v3fPosition: IVec3): INode;
        public getLocalScale(): IVec3;
        public setLocalScale(v3fScale: IVec3): INode;
        public getLocalMatrix(): IMat4;
        public setLocalMatrix(m4fLocalMatrix: IMat4): INode;
        public getWorldMatrix(): IMat4;
        public getWorldPosition(): IVec3;
        public getWorldOrientation(): IQuat4;
        public getWorldScale(): IVec3;
        public getInverseWorldMatrix(): IMat4;
        public getNormalMatrix(): IMat3;
        public getVectorUp(): IVec3;
        public getVectorRight(): IVec3;
        public getVectorForward(): IVec3;
        public getTempVectorUp(): IVec3;
        public getTempVectorRight(): IVec3;
        public getTempVectorForward(): IVec3;
        public update(): boolean;
        public prepareForUpdate(): void;
        public setInheritance(eInheritance: ENodeInheritance): void;
        public getInheritance(): ENodeInheritance;
        public isWorldMatrixNew(): boolean;
        public isLocalMatrixNew(): boolean;
        private recalcWorldMatrix();
        public setWorldPosition(v3fPosition: IVec3): INode;
        public setWorldPosition(fX: number, fY: number, fZ: number): INode;
        public setPosition(v3fPosition: IVec3): INode;
        public setPosition(fX: number, fY: number, fZ: number): INode;
        public setRelPosition(v3fPosition: IVec3): INode;
        public setRelPosition(fX: number, fY: number, fZ: number): INode;
        public addPosition(v3fPosition: IVec3): INode;
        public addPosition(fX: number, fY: number, fZ: number): INode;
        public addRelPosition(v3fPosition: IVec3): INode;
        public addRelPosition(fX: number, fY: number, fZ: number): INode;
        public setRotationByMatrix(m3fRotation: IMat3): INode;
        public setRotationByMatrix(m4fRotation: IMat4): INode;
        public setRotationByAxisAngle(v3fAxis: IVec3, fAngle: number): INode;
        public setRotationByForwardUp(v3fForward: IVec3, v3fUp: IVec3): INode;
        public setRotationByEulerAngles(fYaw: number, fPitch: number, fRoll: number): INode;
        public setRotationByXYZAxis(fX: number, fY: number, fZ: number): INode;
        public setRotation(q4fRotation: IQuat4): INode;
        public addRelRotationByMatrix(m3fRotation: IMat3): INode;
        public addRelRotationByMatrix(m4fRotation: IMat4): INode;
        public addRelRotationByAxisAngle(v3fAxis: IVec3, fAngle: number): INode;
        public addRelRotationByForwardUp(v3fForward: IVec3, v3fUp: IVec3): INode;
        public addRelRotationByEulerAngles(fYaw: number, fPitch: number, fRoll: number): INode;
        public addRelRotationByXYZAxis(fX: number, fY: number, fZ: number): INode;
        public addRelRotation(q4fRotation: IQuat4): INode;
        public addRotationByMatrix(m3fRotation: IMat3): INode;
        public addRotationByMatrix(m4fRotation: IMat4): INode;
        public addRotationByAxisAngle(v3fAxis: IVec3, fAngle: number): INode;
        public addRotationByForwardUp(v3fForward: IVec3, v3fUp: IVec3): INode;
        public addRotationByEulerAngles(fYaw: number, fPitch: number, fRoll: number): INode;
        public addRotationByXYZAxis(fX: number, fY: number, fZ: number): INode;
        public addRotation(q4fRotation: IQuat4): INode;
        public addOrbitRotationByMatrix(m3fRotation: IMat3): INode;
        public addOrbitRotationByMatrix(m4fRotation: IMat4): INode;
        public addOrbitRotationByAxisAngle(v3fAxis: IVec3, fAngle: number): INode;
        public addOrbitRotationByForwardUp(v3fForward: IVec3, v3fUp: IVec3): INode;
        public addOrbitRotationByEulerAngles(fYaw: number, fPitch: number, fRoll: number): INode;
        public addOrbitRotationByXYZAxis(fX: number, fY: number, fZ: number): INode;
        public addOrbitRotation(q4fRotation: IQuat4): INode;
        public scale(fScale: number): INode;
        public scale(v3fScale: IVec3): INode;
        public scale(fX: number, fY: number, fZ: number): INode;
        public lookAt(v3fFrom: IVec3, v3fCenter: IVec3, v3fUp?: IVec3): INode;
        public lookAt(v3fCenter: IVec3, v3fUp?: IVec3): INode;
        public attachToParent(pParent: INode): boolean;
        public detachFromParent(): boolean;
        public toString(isRecursive?: boolean, iDepth?: number): string;
        private static _v3fTemp1;
        private static _v4fTemp1;
        private static _m3fTemp1;
        private static _m4fTemp1;
        private static _m4fTemp2;
        private static _q4fTemp1;
    }
}
declare module akra.scene {
    class SceneNode extends Node implements ISceneNode {
        public frozen: ISignal<(pNode: ISceneNode, bValue: boolean) => void>;
        public hidden: ISignal<(pNode: ISceneNode, bValue: boolean) => void>;
        public _pScene: IScene3d;
        public _pAnimationControllers: IAnimationController[];
        public _iSceneNodeFlags: number;
        constructor(pScene: IScene3d, eType?: EEntityTypes);
        public setupSignals(): void;
        public getScene(): IScene3d;
        public getTotalControllers(): number;
        public getController(i?: number): IAnimationController;
        public addController(pController: IAnimationController): void;
        public isFrozen(): boolean;
        public isSelfFrozen(): boolean;
        public isParentFrozen(): boolean;
        public freeze(bValue?: boolean): void;
        public isHidden(): boolean;
        public hide(bValue?: boolean): void;
        public _parentFrozen(pParent: ISceneNode, bValue: boolean): void;
        public _parentHidden(pParent: ISceneNode, bValue: boolean): void;
        public create(): boolean;
        public update(): boolean;
        public destroy(): void;
        public attachToParent(pParent: ISceneNode): boolean;
        public detachFromParent(): boolean;
        public toString(isRecursive?: boolean, iDepth?: number): string;
    }
}
declare module akra.scene {
    class Joint extends SceneNode implements IJoint {
        private _sBone;
        constructor(pScene: IScene3d);
        public getBoneName(): string;
        public setBoneName(sBone: string): void;
        public create(): boolean;
        public toString(isRecursive?: boolean, iDepth?: number): string;
        static isJoint(pEntity: IEntity): boolean;
    }
}
declare module akra.animation {
    interface IMap<IAnimationTarget> {
        [index: string]: IAnimationTarget;
    }
    class Base implements IAnimationBase {
        public guid: number;
        public played: ISignal<(pBase: IAnimationBase, fRealTime: number) => void>;
        public stoped: ISignal<(pBase: IAnimationBase, fRealTime: number) => void>;
        public renamed: ISignal<(pBase: IAnimationBase, sName: number) => void>;
        public _pTargetMap: IMap<IAnimationTarget>;
        public _pTargetList: IAnimationTarget[];
        public _fDuration: number;
        public _fFirst: number;
        public _sName: string;
        public _eType: EAnimationTypes;
        public extra: any;
        constructor(eType: EAnimationTypes, sName?: string);
        public setupSignals(): void;
        public getType(): EAnimationTypes;
        public getDuration(): number;
        public getFirst(): number;
        public setDuration(fValue: number): void;
        public getName(): string;
        public setName(sName: string): void;
        public play(fRealTime: number): void;
        public stop(fRealTime: number): void;
        public isAttached(): boolean;
        public attach(pTarget: ISceneNode): void;
        public frame(sName: string, fRealTime: number): IPositionFrame;
        public apply(fRealTime: number): boolean;
        public addTarget(sName: string, pTarget?: ISceneNode): IAnimationTarget;
        public setTarget(sName: string, pTarget: ISceneNode): IAnimationTarget;
        public getTarget(sTargetName: string): IAnimationTarget;
        public getTargetList(): IAnimationTarget[];
        public getTargetByName(sName: string): IAnimationTarget;
        public targetNames(): string[];
        public targetList(): ISceneNode[];
        public jointList(): IJoint[];
        public grab(pAnimationBase: IAnimationBase, bRewrite?: boolean): void;
        public createAnimationMask(): IMap<number>;
        public toString(): string;
    }
}
declare module akra.animation {
    class Animation extends Base implements IAnimation {
        private _pTracks;
        constructor(sName?: string);
        public getTotalTracks(): number;
        public push(pTrack: IAnimationTrack): void;
        public attach(pTarget: ISceneNode): void;
        public getTracks(): IAnimationTrack[];
        public getTrack(i: number): IAnimationTrack;
        public frame(sName: string, fTime: number): IPositionFrame;
        public extend(pAnimation: IAnimation): void;
        public toString(): string;
        static isAnimation(pAnimation: IAnimationBase): boolean;
    }
    function createAnimation(sName?: string): IAnimation;
}
declare module akra.animation {
    class Blend extends Base implements IAnimationBlend {
        public weightUpdated: ISignal<(pBlend: IAnimationBlend, iAnim: number, fWeight: number) => void>;
        public durationUpdated: ISignal<(pBlend: IAnimationBlend, fDuration: number) => void>;
        private _pAnimationList;
        constructor(sName?: string);
        public setupSignals(): void;
        public getTotalAnimations(): number;
        public play(fRealTime: number): void;
        public stop(): void;
        public attach(pTarget: ISceneNode): void;
        public addAnimation(pAnimation: IAnimationBase, fWeight?: number, pMask?: IMap<number>): number;
        public setAnimation(iAnimation: number, pAnimation: IAnimationBase, fWeight?: number, pMask?: IMap<number>): boolean;
        public swapAnimations(i: number, j: number): boolean;
        public removeAnimation(i: number): boolean;
        public _onDurationUpdate(pAnimation: IAnimationBase, fDuration: number): void;
        public updateDuration(): void;
        public getAnimationIndex(sName: string): number;
        public getAnimation(sName: string): IAnimationBase;
        public getAnimation(iAnimation: number): IAnimationBase;
        public getAnimationWeight(iAnimation: number): number;
        public getAnimationWeight(sName: string): number;
        public setWeights(...pWeight: number[]): boolean;
        public setWeightSwitching(fWeight: number, iAnimationFrom: number, iAnimationTo: number): boolean;
        public setAnimationWeight(fWeight: number): boolean;
        public setAnimationWeight(iAnimation: number, fWeight: number): boolean;
        public setAnimationWeight(sName: string, fWeight: number): boolean;
        public setAnimationMask(iAnimation: number, pMask: IMap<number>): boolean;
        public setAnimationMask(sName: string, pMask: IMap<number>): boolean;
        public getAnimationMask(iAnimation: number): IMap<number>;
        public getAnimationMask(sName: string): IMap<number>;
        public getAnimationAcceleration(iAnimation: number): number;
        public getAnimationAcceleration(sName: string): number;
        public createAnimationMask(iAnimation?: number): IMap<number>;
        public frame(sName: string, fRealTime: number): IPositionFrame;
        public toString(): string;
        static isBlend(pAnimation: IAnimationBase): boolean;
    }
    function createBlend(sName?: string): IAnimationBlend;
}
declare module akra.animation {
    class Container extends Base implements IAnimationContainer {
        public durationUpdated: ISignal<(pContainer: IAnimationContainer, fDuration: number) => void>;
        public enterFrame: ISignal<(pContainer: IAnimationContainer, fRealTime: number, fTime: number) => void>;
        private _bEnable;
        private _fStartTime;
        private _fSpeed;
        private _bLoop;
        private _pAnimation;
        private _bReverse;
        private _fTrueTime;
        private _fRealTime;
        private _fTime;
        private _bPause;
        private _bLeftInfinity;
        private _bRightInfinity;
        constructor(pAnimation?: IAnimationBase, sName?: string);
        public setupSignals(): void;
        public getAnimationName(): string;
        public getAnimationTime(): number;
        public getTime(): number;
        public setStartTime(fRealTime: number): void;
        public getStartTime(): number;
        public setSpeed(fSpeed: number): void;
        public getSpeed(): number;
        public play(fRealTime: number): void;
        public stop(): void;
        public attach(pTarget: ISceneNode): void;
        public setAnimation(pAnimation: IAnimationBase): void;
        public _onDurationUpdate(pAnimation: IAnimationBase, fDuration: number): void;
        public getAnimation(): IAnimationBase;
        public enable(): void;
        public disable(): void;
        public isEnabled(): boolean;
        public leftInfinity(bValue: boolean): void;
        public inLeftInfinity(): boolean;
        public inRightInfinity(): boolean;
        public rightInfinity(bValue: boolean): void;
        public useLoop(bValue: boolean): void;
        public inLoop(): boolean;
        public reverse(bValue: boolean): void;
        public isReversed(): boolean;
        public pause(bValue?: boolean): void;
        public rewind(fRealTime: number): void;
        public isPaused(): boolean;
        public calcTime(fRealTime: number): void;
        public frame(sName: string, fRealTime: number): IPositionFrame;
        static isContainer(pAnimation: IAnimationBase): boolean;
    }
    function createContainer(pAnimation?: IAnimationBase, sName?: string): IAnimationContainer;
}
declare module akra.material {
    class Material implements IMaterial {
        public guid: number;
        public name: string;
        public diffuse: IColor;
        public ambient: IColor;
        public specular: IColor;
        public emissive: IColor;
        public transparency: number;
        public shininess: number;
        constructor(sName?: string, pMat?: IMaterialBase);
        public set(pMat: IMaterialBase): IMaterial;
        public set(sMat: string): IMaterial;
        public isEqual(pMat: IMaterialBase): boolean;
        public isTransparent(): boolean;
        public toString(): string;
    }
}
declare module akra.material {
    function create(sName?: string, pMat?: IMaterialBase): IMaterial;
}
declare module akra.exchange {
    class Importer {
        private _pEngine;
        private _pDocument;
        private _pLibrary;
        constructor(_pEngine: IEngine);
        public getEngine(): IEngine;
        public getDocument(): IDocument;
        public getLibrary(): ILibrary;
        public clear(): void;
        public import(pData: string, eFormat?: EDocumentFormat): Importer;
        public import(pData: Object, eFormat?: EDocumentFormat): Importer;
        public import(pData: ArrayBuffer, eFormat?: EDocumentFormat): Importer;
        public import(pData: Blob, eFormat?: EDocumentFormat): Importer;
        public loadDocument(pDocument: IDocument): Importer;
        public importFromBinaryJSON(pData: ArrayBuffer): IDocument;
        public importFromJSON(pData: any): IDocument;
        public updateLibrary(): void;
        public findEntries(eType: EDocumentEntry, fnCallback: (pEntry: ILibraryEntry, n?: number) => boolean): void;
        public findEntryByIndex(eType: EDocumentEntry, i: number): ILibraryEntry;
        public find(eType: EDocumentEntry, fnCallback: (pData: any, n?: number) => boolean): void;
        public findByIndex(eType: EDocumentEntry, i?: number): any;
        public findFirst(eType: EDocumentEntry): any;
        public getController(iContrller?: number): IAnimationController;
        public getMaterials(): IMap<IMaterial>;
        public decodeEntry(pEntry: IDataEntry): any;
        public registerData(iGuid: number, pData: any): void;
        public decodeInstance(iGuid: number): any;
        public decodeEntryList(pEntryList: IDataEntry[], fnCallback: (pData: any) => void): void;
        public decodeInstanceList(pInstances: number[], fnCallback: (pData: any, n?: number) => void): void;
        public decodeMaterialEntry(pEntry: IMaterialEntry): IMaterial;
        public decodeColorEntry(pEntry: IColorEntry, pDest?: IColor): IColor;
        public decodeAnimationFrame(pEntry: IAnimationFrameEntry): IPositionFrame;
        public decodeAnimationTrack(pEntry: IAnimationTrackEntry): IAnimationTrack;
        public decodeAnimationEntry(pEntry: IAnimationEntry): IAnimation;
        public decodeAnimationBlendEntry(pEntry: IAnimationBlendEntry): IAnimationBlend;
        public decodeAnimationContainerEntry(pEntry: IAnimationContainerEntry): IAnimationContainer;
        public decodeControllerEntry(pEntry: IControllerEntry): IAnimationController;
    }
}
declare module akra.pool {
    class ResourceCode implements IResourceCode {
        private _iValue;
        public getFamily(): number;
        public setFamily(iNewFamily: number): void;
        public getType(): number;
        public setType(iNewType: number): void;
        constructor();
        constructor(iCode: number);
        constructor(eCode: EResourceCodes);
        constructor(pCode: IResourceCode);
        constructor(iFamily: number, iType: number);
        public setInvalid(): void;
        public less(pSrc: IResourceCode): boolean;
        public eq(pSrc: IResourceCode): IResourceCode;
        public valueOf(): number;
        public toNumber(): number;
    }
}
declare module akra {
    interface IDataPool {
        getManager(): IResourcePoolManager;
        /** Инициализация пула данных */
        initialize(iGrowSize: number): void;
        /** Инициализирован ли пул */
        isInitialized(): boolean;
        /** Очистка пула и пометка о том что он больш не инициализирован */
        destroy(): void;
        /** Высвобождаем элемент в пуле по его номеру */
        release(iHandle: number): void;
        clear(): void;
        /** Добавляет новый элемент в пул */
        add(pMembers: IResourcePoolItem): number;
        /** Цикл по всем объектам с приминением к ним функции, как fFunction(текущий пул данных, объект к торому применяется); */
        forEach(fFunction: (pPool: IDataPool, iHandle: number, pMember: IResourcePoolItem) => void): void;
        /** Ищет первый свободный элемент в пуле */
        nextHandle(): number;
        /** Проверяется используется лм этот элемент */
        isHandleValid(iHandle: number): boolean;
        /** Возвратитть элемент по хендлу */
        get(iHandle: number): IResourcePoolItem;
        /** Возвратитть элемент по хендлу */
        getPtr(iHandle: number): IResourcePoolItem;
        /** Возвратитть элемент по хендлу */
        getGenericPtr(iHandle: number): IResourcePoolItem;
    }
}
declare module akra.pool {
    class PoolGroup {
        private pManager;
        /** Конструктор для создания данных в группе */
        private tTemplate;
        /** Число свободных элементов группы */
        private iTotalOpen;
        /** Первый свободный элемент группы */
        private iFirstOpen;
        /** Колмичество элементов в группе */
        private iMaxCount;
        /** Список свободных элементов группы */
        private pNextOpenList;
        /** Массив элементов группы */
        private pMemberList;
        public getManager(): IResourcePoolManager;
        /**
        * Возвращает количесвто свободных мест в группе
        * @
        */
        public getTotalOpen(): number;
        /**
        * Возвращает количесвто занятых мест в группе
        * @
        */
        public getTotalUsed(): number;
        /**
        * Номер первого свободного элемента в группе
        * @
        */
        public getFirstOpen(): number;
        constructor(pManager: IResourcePoolManager, tTemplate: IResourcePoolItemType, iMaxCount: number);
        /** Создание группы, создается массив элементов, инициализирется список свободный и т.д. */
        public create(): void;
        /**
        * Удаление группы: удаление массива элементов, списка совбодных элементов и т.д.
        * Выдается ошибка если группа не пуста
        * */
        public destroy(): void;
        /** Возвращает номер следующего совбодного элемента в списке, и помечает его как используемый */
        public nextMember(): number;
        /** Добавляем новый элемент в список */
        public addMember(pMember: IResourcePoolItem): number;
        /** Исключение элемента из списка по его номеру */
        public release(iIndex: number): void;
        /** Проверить свободна ли эта ячейка в группе */
        public isOpen(iIndex: number): boolean;
        /** Получение элемента по его номеру */
        public member(iIndex: number): IResourcePoolItem;
        public memberPtr(iIndex: number): IResourcePoolItem;
        static INVALID_INDEX: number;
    }
}
declare module akra.pool {
    interface IGroupNumber {
        value: number;
    }
    class DataPool implements IDataPool {
        private pManager;
        private tTemplate;
        private bInitialized;
        /** Массив групп */
        private pGroupList;
        /** Общее число ячеек */
        private iTotalMembers;
        /** Количесвто свободных ячеек */
        private iTotalOpen;
        /** Количесвто элементов в группе */
        private iGroupCount;
        /**
        * Номер элемента состоит из номер группы сдвинутого на _iIndexShift
        * и номера элемента в этой группе, который можно вырезать маской _iIndexMask
        */
        private iIndexMask;
        /**
        * Номер элемента состоит из номер группы сдвинутого на _iIndexShift
        * и номера элемента в этой группе, который можно вырезать маской _iIndexMask
        */
        private iIndexShift;
        public getManager(): IResourcePoolManager;
        constructor(pManager: IResourcePoolManager, tTemplate: IResourcePoolItemType);
        public initialize(iGrowSize: number): void;
        /** @ */
        public isInitialized(): boolean;
        public destroy(): void;
        public release(iHandle: number): void;
        public clear(): void;
        public add(pMembers: IResourcePoolItem): number;
        public forEach(fFunction: (pPool: IDataPool, iHandle: number, pMember: IResourcePoolItem) => void): void;
        public nextHandle(): number;
        public isHandleValid(iHandle: number): boolean;
        public get(iHandle: number): IResourcePoolItem;
        public getPtr(iHandle: number): IResourcePoolItem;
        public getGenericPtr(iHandle: number): IResourcePoolItem;
        /**
        * @
        * Получение номера группы по номеру элемента
        */
        private getGroupNumber(iHandle);
        /**
        * @
        * Получение номера элеменат в группе по его номеру
        */
        private getItemIndex(iHandle);
        /**
        * @
        * Полученяи номера элеменат по его номеру группы и группе
        */
        private buildHandle(iGroup, iIndex);
        /** Добавление группы в пул */
        private addGroup();
        /** Поиск первой группы которая имеет свободную область */
        private findOpenGroup(pGroupNumber);
        /**
        * @
        * Возвращает группу по ее номеру
        */
        private getGroup(iIndex);
    }
}
declare module akra.pool {
    class ResourcePool<T extends IResourcePoolItem> extends util.ReferenceCounter implements IResourcePool<T> {
        public guid: number;
        public createdResource: ISignal<(pPool: IResourcePool<T>, pResource: T) => void>;
        private _pManager;
        /** Конструктор для создания данных в пуле ресурсов */
        private _tTemplate;
        private _sExt;
        private _pRegistrationCode;
        private _pNameMap;
        private _pDataPool;
        constructor(pManager: IResourcePoolManager, tTemplate: IResourcePoolItemType);
        public setupSignals(): void;
        public getFourcc(): number;
        public setFourcc(iNewFourcc: number): void;
        public getManager(): IResourcePoolManager;
        /** Добавление данного пула в менеджер ресурсво по его коду */
        public registerResourcePool(pCode: IResourceCode): void;
        /** Удаление данного пула в менеджер ресурсво по его коду */
        public unregisterResourcePool(): void;
        /** По имени ресурса возвращает его хендл */
        public findResourceHandle(sName: string): number;
        /**
        * Get resource name by handle.
        * @
        */
        public findResourceName(iHandle: number): string;
        public setResourceName(iHandle: number, sName: string): void;
        public initialize(iGrowSize: number): void;
        /** @ */
        public destroy(): void;
        public clean(): void;
        public destroyAll(): void;
        public restoreAll(): void;
        public disableAll(): void;
        /** @ */
        public isInitialized(): boolean;
        public createResource(sResourceName: string): T;
        public loadResource(sResourceName: string): T;
        public saveResource(pResource: T): boolean;
        public destroyResource(pResource: T): void;
        public findResource(sName: string): T;
        public getResource(iHandle: number): T;
        public getResources(): T[];
        private internalGetResource(iHandle);
        private internalDestroyResource(iHandle);
        private internalCreateResource(sResourceName);
        private static callbackDestroy(pPool, iHandle, pResource);
        private static callbackDisable(pPool, iHandle, pResource);
        private static callbackRestore(pPool, iHandle, pResource);
        private static callbackClean(pPool, iHandle, pResource);
    }
}
declare module akra.pool {
    interface ICallbackSlot {
        state: boolean;
        fn: IResourceNotifyRoutineFunc;
        resource: IResourcePoolItem;
        event: EResourceItemEvents;
    }
    class ResourcePoolItem extends util.ReferenceCounter implements IResourcePoolItem {
        public guid: number;
        public created: ISignal<(pResource: IResourcePoolItem) => void>;
        public destroyed: ISignal<(pResource: IResourcePoolItem) => void>;
        public loaded: ISignal<(pResource: IResourcePoolItem) => void>;
        public unloaded: ISignal<(pResource: IResourcePoolItem) => void>;
        public restored: ISignal<(pResource: IResourcePoolItem) => void>;
        public disabled: ISignal<(pResource: IResourcePoolItem) => void>;
        public altered: ISignal<(pResource: IResourcePoolItem) => void>;
        public saved: ISignal<(pResource: IResourcePoolItem) => void>;
        public stateChanged: ISignal<(pResource: IResourcePoolItem, eEvent: EResourceItemEvents, iFlags: number, isSet: boolean) => any>;
        private _pResourceCode;
        private _pResourcePool;
        private _iResourceHandle;
        private _iResourceFlags;
        private _iResourceSyncFlags;
        private _pCallbackSlots;
        /** Constructor of ResourcePoolItem class */
        constructor();
        public setupSignals(): void;
        public getResourceCode(): IResourceCode;
        public getResourcePool(): IResourcePool<IResourcePoolItem>;
        public getResourceHandle(): number;
        public getResourceFlags(): number;
        public getAlteredFlag(): boolean;
        public getEngine(): IEngine;
        public getManager(): IResourcePoolManager;
        public createResource(): boolean;
        public destroyResource(): boolean;
        public disableResource(): boolean;
        public restoreResource(): boolean;
        public loadResource(sFilename?: string): boolean;
        public saveResource(sFilename?: string): boolean;
        public isSyncedTo(eSlot: EResourceItemEvents): boolean;
        /**
        * Find resources, that may affect the @eState of this resoyrces.
        */
        public findRelatedResources(eState: EResourceItemEvents): IResourcePoolItem[];
        public isSyncComplete(eSignal: EResourceItemEvents): boolean;
        private updateSyncState(eState);
        /**
        * Sync resource with another.
        * @param eSignal Signal of @pResourceItem
        * @param eSlot State of this resource.
        */
        public sync(pResourceItem: IResourcePoolItem, eSignal: string, eSlot?: string): boolean;
        public sync(pResourceItem: IResourcePoolItem, eSignal: EResourceItemEvents, eSlot?: EResourceItemEvents): boolean;
        public unsync(pResourceItem: IResourcePoolItem, eSignal: EResourceItemEvents, eSlot?: EResourceItemEvents): boolean;
        public isResourceCreated(): boolean;
        public isResourceLoaded(): boolean;
        public isResourceDisabled(): boolean;
        public isResourceAltered(): boolean;
        public setResourceName(sName: string): void;
        public findResourceName(): string;
        public release(): number;
        public notifyCreated(): void;
        public notifyDestroyed(): void;
        public notifyLoaded(): void;
        public notifyUnloaded(): void;
        public notifyRestored(): void;
        public notifyDisabled(): void;
        public notifyAltered(): void;
        public notifySaved(): void;
        /**
        * Назначение кода ресурсу
        * @
        */
        public setResourceCode(pCode: IResourceCode): void;
        /**
        * Чтобы ресурс знал какому пулу ресурсов принадлжит
        * @
        */
        public setResourcePool(pPool: IResourcePool<IResourcePoolItem>): void;
        /**
        * Назначение хендла ресурсу
        * @
        */
        public setResourceHandle(iHandle: number): void;
        private notifyStateChanged(eState);
        public setResourceFlag(eFlagBit: EResourceItemEvents, isSetting: boolean): boolean;
        public setResourceFlag(iFlagBit: number, isSetting: boolean): boolean;
        private static parseEvent(sEvent);
        static DISABLED: string;
        static ALTERED: string;
        static CREATED: string;
        static LOADED: string;
    }
}
declare module akra {
    /** @deprecated Use IMap<IAFXPassBlend> instead. */
    interface IAFXPassBlendMap {
        [index: number]: IAFXPassBlend;
    }
    interface IAFXPassBlend extends IUnique {
        initFromPassList(pPassList: IAFXPassInstruction[]): boolean;
        generateFXMaker(pPassInput: IAFXPassInputBlend, pSurfaceMaterial: ISurfaceMaterial, pBuffer: IBufferMap): IAFXMaker;
        _hasUniformWithName(sName: string): boolean;
        _hasUniformWithNameIndex(iNameIndex: number): boolean;
        _getRenderStates(): IMap<ERenderStateValues>;
    }
}
declare module akra {
    interface IAFXBlender {
        addComponentToBlend(pComponentBlend: IAFXComponentBlend, pComponent: IAFXComponent, iShift: number, iPass: number): IAFXComponentBlend;
        removeComponentFromBlend(pComponentBlend: IAFXComponentBlend, pComponent: IAFXComponent, iShift: number, iPass: number): IAFXComponentBlend;
        addBlendToBlend(pComponentBlend: IAFXComponentBlend, pAddBlend: IAFXComponentBlend, iShift: number): IAFXComponentBlend;
        generatePassBlend(pPassList: IAFXPassInstruction[], pStates: any, pForeigns: any, pUniforms: any): IAFXPassBlend;
        getPassBlendById(id: number): IAFXPassBlend;
    }
}
declare module akra.color {
    function random(bVarious?: boolean): IColor;
    var ZERO: IColor;
    var ALICE_BLUE: IColor;
    var ANTIQUE_WHITE: IColor;
    var AQUA: IColor;
    var AQUA_MARINE: IColor;
    var AZURE: IColor;
    var BEIGE: IColor;
    var BISQUE: IColor;
    var BLANCHED_ALMOND: IColor;
    var BLACK: IColor;
    var BLUE: IColor;
    var BLUE_VIOLET: IColor;
    var BROWN: IColor;
    var BURLY_WOOD: IColor;
    var CADET_BLUE: IColor;
    var CHARTREUSE: IColor;
    var CHOCOLATE: IColor;
    var CORAL: IColor;
    var CORNFLOWER_BLUE: IColor;
    var CORNSILK: IColor;
    var CRIMSON: IColor;
    var CYAN: IColor;
    var DARK_BLUE: IColor;
    var DARK_CYAN: IColor;
    var DARK_GOLDEN_ROD: IColor;
    var DARK_GRAY: IColor;
    var DARK_GREEN: IColor;
    var DARK_KHAKI: IColor;
    var DARK_MAGENTA: IColor;
    var DARK_OLIVE_GREEN: IColor;
    var DARK_ORANGE: IColor;
    var DARK_ORCHID: IColor;
    var DARK_RED: IColor;
    var DARK_SALMON: IColor;
    var DARK_SEA_GREEN: IColor;
    var DARK_SLATE_BLUE: IColor;
    var DARK_SLATE_GRAY: IColor;
    var DARK_TURQUOISE: IColor;
    var DARK_VIOLET: IColor;
    var DEEP_PINK: IColor;
    var DEEP_SKY_BLUE: IColor;
    var DIM_GRAY: IColor;
    var DIM_GREY: IColor;
    var DODGER_BLUE: IColor;
    var FIRE_BRICK: IColor;
    var FLORAL_WHITE: IColor;
    var FOREST_GREEN: IColor;
    var FUCHSIA: IColor;
    var GAINSBORO: IColor;
    var GHOST_WHITE: IColor;
    var GOLD: IColor;
    var GOLDEN_ROD: IColor;
    var GRAY: IColor;
    var GREEN: IColor;
    var GREEN_YELLOW: IColor;
    var HONEY_DEW: IColor;
    var HOT_PINK: IColor;
    var INDIAN_RED: IColor;
    var INDIGO: IColor;
    var IVORY: IColor;
    var KHAKI: IColor;
    var LAVENDER: IColor;
    var LAVENDER_BLUSH: IColor;
    var LAWN_GREEN: IColor;
    var LEMON_CHIFFON: IColor;
    var LIGHT_BLUE: IColor;
    var LIGHT_CORAL: IColor;
    var LIGHT_CYAN: IColor;
    var LIGHT_GOLDEN_ROD_YELLOW: IColor;
    var LIGHT_GRAY: IColor;
    var LIGHT_GREEN: IColor;
    var LIGHT_PINK: IColor;
    var LIGHT_SALMON: IColor;
    var LIGHT_SEA_GREEN: IColor;
    var LIGHT_SKY_BLUE: IColor;
    var LIGHT_SLATE_GRAY: IColor;
    var LIGHT_STEEL_BLUE: IColor;
    var LIGHT_YELLOW: IColor;
    var LIME: IColor;
    var LIME_GREEN: IColor;
    var LINEN: IColor;
    var MAGENTA: IColor;
    var MAROON: IColor;
    var MEDIUM_AQUA_MARINE: IColor;
    var MEDIUM_BLUE: IColor;
    var MEDIUM_ORCHID: IColor;
    var MEDIUM_PURPLE: IColor;
    var MEDIUM_SEA_GREEN: IColor;
    var MEDIUM_SLATE_BLUE: IColor;
    var MEDIUM_SPRING_GREEN: IColor;
    var MEDIUM_TURQUOISE: IColor;
    var MEDIUM_VIOLET_RED: IColor;
    var MIDNIGHT_BLUE: IColor;
    var MINT_CREAM: IColor;
    var MISTY_ROSE: IColor;
    var MOCCASIN: IColor;
    var NAVAJO_WHITE: IColor;
    var NAVY: IColor;
    var OLD_LACE: IColor;
    var OLIVE: IColor;
    var OLIVE_DRAB: IColor;
    var ORANGE: IColor;
    var ORANGE_RED: IColor;
    var ORCHID: IColor;
    var PALE_GOLDEN_ROD: IColor;
    var PALE_GREEN: IColor;
    var PALE_TURQUOISE: IColor;
    var PALE_VIOLET_RED: IColor;
    var PAPAYA_WHIP: IColor;
    var PEACH_PUFF: IColor;
    var PERU: IColor;
    var PINK: IColor;
    var PLUM: IColor;
    var POWDER_BLUE: IColor;
    var PURPLE: IColor;
    var RED: IColor;
    var ROSY_BROWN: IColor;
    var ROYAL_BLUE: IColor;
    var SADDLE_BROWN: IColor;
    var SALMON: IColor;
    var SANDY_BROWN: IColor;
    var SEA_GREEN: IColor;
    var SEA_SHELL: IColor;
    var SIENNA: IColor;
    var SILVER: IColor;
    var SKY_BLUE: IColor;
    var SLATE_BLUE: IColor;
    var SLATE_GRAY: IColor;
    var SNOW: IColor;
    var SPRING_GREEN: IColor;
    var STEEL_BLUE: IColor;
    var TAN: IColor;
    var TEAL: IColor;
    var THISTLE: IColor;
    var TOMATO: IColor;
    var TURQUOISE: IColor;
    var VIOLET: IColor;
    var WHEAT: IColor;
    var WHITE: IColor;
    var WHITE_SMOKE: IColor;
    var YELLOW: IColor;
    var YELLOW_GREEN: IColor;
}
declare module akra.render {
    function createRenderStateMap(): IMap<ERenderStateValues>;
    function copyRenderStateMap(pFrom: IMap<ERenderStateValues>, pTo: IMap<ERenderStateValues>): void;
    function mergeRenderStateMap(pFromA: IMap<ERenderStateValues>, pFromB: IMap<ERenderStateValues>, pTo: IMap<ERenderStateValues>): void;
    function clearRenderStateMap(pMap: IMap<ERenderStateValues>): void;
    function createSamplerState(): IAFXSamplerState;
}
declare module akra.util {
    class ObjectArray<T> implements IObjectArray<T> {
        public _pData: T[];
        public _bLock: boolean;
        public _iLength: number;
        public getLength(): number;
        constructor(pElements?: T[]);
        public lock(): void;
        public unlock(): void;
        public isLocked(): boolean;
        public clear(bRemoveLinks?: boolean): IObjectArray<T>;
        public release(): IObjectArray<T>;
        public value(n: number): T;
        private extend(n);
        public set(n: number, pData: T): IObjectArray<T>;
        public fromArray(pElements: T[], iOffset?: number, iSize?: number): IObjectArray<T>;
        public push(pElement: T): IObjectArray<T>;
        public pop(): T;
        public swap(i: number, j: number): IObjectArray<T>;
        public takeAt(iPos: any): T;
        public indexOf(pObject: T): number;
    }
}
declare module akra {
    interface IStringDictionary {
        add(sEntry: string): number;
        index(sEntry: string): number;
        findEntry(iIndex: string): string;
    }
}
declare module akra.stringUtils {
    class StringDictionary implements IStringDictionary {
        private _pDictionary;
        private _pIndexToEntryMap;
        private _nEntryCount;
        constructor();
        public add(sEntry: string): number;
        public index(sEntry: string): number;
        public findEntry(iIndex: string): string;
    }
}
declare module akra {
    enum EEffectErrors {
        REDEFINE_SYSTEM_TYPE = 2201,
        REDEFINE_TYPE = 2202,
        REDEFINE_VARIABLE = 2234,
        REDEFINE_SYSTEM_VARIABLE = 2235,
        REDEFINE_FUNCTION = 2236,
        REDEFINE_SYSTEM_FUNCTION = 2237,
        UNSUPPORTED_TYPEDECL = 2203,
        UNSUPPORTED_EXPR = 2204,
        UNKNOWN_VARNAME = 2205,
        BAD_ARITHMETIC_OPERATION = 2206,
        BAD_ARITHMETIC_ASSIGNMENT_OPERATION = 2207,
        BAD_ASSIGNMENT_OPERATION = 2208,
        BAD_RELATIONAL_OPERATION = 2209,
        BAD_LOGICAL_OPERATION = 2210,
        BAD_CONDITION_TYPE = 2211,
        BAD_CONDITION_VALUE_TYPES = 2212,
        BAD_CAST_TYPE_USAGE = 2213,
        BAD_CAST_TYPE_NOT_BASE = 2214,
        BAD_CAST_UNKNOWN_TYPE = 2215,
        BAD_UNARY_OPERATION = 2216,
        BAD_POSTIX_NOT_ARRAY = 2217,
        BAD_POSTIX_NOT_INT_INDEX = 2218,
        BAD_POSTIX_NOT_FIELD = 2219,
        BAD_POSTIX_NOT_POINTER = 2220,
        BAD_POSTIX_ARITHMETIC = 2221,
        BAD_PRIMARY_NOT_POINT = 2222,
        BAD_COMPLEX_NOT_FUNCTION = 2223,
        BAD_COMPLEX_NOT_TYPE = 2224,
        BAD_COMPLEX_NOT_CONSTRUCTOR = 2225,
        BAD_COMPILE_NOT_FUNCTION = 2226,
        BAD_REDEFINE_FUNCTION = 2227,
        BAD_WHILE_CONDITION = 2228,
        BAD_DO_WHILE_CONDITION = 2229,
        BAD_IF_CONDITION = 2230,
        BAD_FOR_INIT_EXPR = 2231,
        BAD_FOR_INIT_EMPTY_ITERATOR = 2232,
        BAD_FOR_COND_EMPTY = 2233,
        BAD_FOR_COND_RELATION = 2238,
        BAD_FOR_STEP_EMPTY = 2239,
        BAD_FOR_STEP_OPERATOR = 2240,
        BAD_FOR_STEP_EXPRESSION = 2241,
        BAD_NEW_FIELD_FOR_STRUCT_NAME = 2242,
        BAD_NEW_FIELD_FOR_STRUCT_SEMANTIC = 2243,
        BAD_NEW_ANNOTATION_VAR = 2244,
        BAD_FUNCTION_PARAMETER_DEFENITION_NEED_DEFAULT = 2245,
        BAD_CANNOT_CHOOSE_FUNCTION = 2246,
        BAD_FUNCTION_DEF_RETURN_TYPE = 2247,
        BAD_SYSTEM_FUNCTION_REDEFINE = 2248,
        BAD_SYSTEM_FUNCTION_RETURN_TYPE = 2249,
        BAD_TYPE_NAME_NOT_TYPE = 2250,
        BAD_TYPE_VECTOR_MATRIX = 2251,
        BAD_TECHNIQUE_REDEFINE_NAME = 2252,
        BAD_MEMOF_ARGUMENT = 2253,
        BAD_MEMOF_NO_BUFFER = 2254,
        BAD_FUNCTION_USAGE_RECURSION = 2255,
        BAD_FUNCTION_USAGE_BLACKLIST = 2256,
        BAD_FUNCTION_USAGE_VERTEX = 2257,
        BAD_FUNCTION_USAGE_PIXEL = 2258,
        BAD_FUNCTION_VERTEX_DEFENITION = 2259,
        BAD_FUNCTION_PIXEL_DEFENITION = 2260,
        BAD_RETURN_STMT_VOID = 2261,
        BAD_RETURN_STMT_EMPTY = 2262,
        BAD_RETURN_STMT_NOT_EQUAL_TYPES = 2263,
        BAD_RETURN_TYPE_FOR_FUNCTION = 2264,
        BAD_FUNCTION_PARAMETER_USAGE = 2265,
        BAD_OUT_VARIABLE_IN_FUNCTION = 2266,
        BAD_TYPE_FOR_WRITE = 2267,
        BAD_TYPE_FOR_READ = 2268,
        BAD_VARIABLE_INITIALIZER = 2269,
        NOT_SUPPORT_STATE_INDEX = 2270,
        BAD_TEXTURE_FOR_SAMLER = 2271,
        CANNOT_CALCULATE_PADDINGS = 2272,
        UNSUPPORTED_EXTRACT_BASE_TYPE = 2273,
        BAD_EXTRACTING = 2274,
        BAD_TECHNIQUE_IMPORT = 2275,
        BAD_USE_OF_ENGINE_VARIABLE = 2276,
        BAD_IMPORTED_COMPONENT_NOT_EXIST = 2277,
        CANNOT_ADD_SHARED_VARIABLE = 2278,
        BAD_FUNCTION_DONT_HAVE_RETURN_STMT = 2279,
    }
    enum EEffectTempErrors {
        BAD_ARRAY_OF_POINTERS = 2300,
        BAD_LOCAL_OF_SHADER_INPUT = 2301,
        BAD_LOCAL_OF_SHADER_OUTPUT = 2302,
        UNSUPPORTED_PROVIDE_AS = 2303,
    }
}
declare module akra {
    interface IEffectErrorInfo {
        typeName?: string;
        techName?: string;
        exprName?: string;
        varName?: string;
        operator?: string;
        leftTypeName?: string;
        rirgtTypeName?: string;
        fieldName?: string;
        funcName?: string;
        funcDef?: string;
        semanticName?: string;
        techniqueName?: string;
        componentName?: string;
        line?: number;
        column?: number;
    }
}
declare module akra {
    enum EScopeType {
        k_Default = 0,
        k_Struct = 1,
        k_Annotation = 2,
    }
    interface IScope {
        parent: IScope;
        index: number;
        type: EScopeType;
        isStrictMode: boolean;
        variableMap: IAFXVariableDeclMap;
        typeMap: IAFXTypeDeclMap;
        functionMap: IAFXFunctionDeclListMap;
    }
    /** @deprecated Use IMap<IScope> instead. */
    interface IScopeMap {
        [scopeIndex: string]: IScope;
    }
}
declare module akra.fx {
}
declare module akra.fx.instructions {
    class Instruction implements IAFXInstruction {
        public _pParentInstruction: IAFXInstruction;
        public _sOperatorName: string;
        public _pInstructionList: IAFXInstruction[];
        public _nInstructions: number;
        public _eInstructionType: EAFXInstructionTypes;
        public _pLastError: IAFXInstructionError;
        public _bErrorOccured: boolean;
        public _iInstructionID: number;
        public _iScope: number;
        private static _nInstructionCounter;
        private _bVisible;
        public _getParent(): IAFXInstruction;
        public _setParent(pParentInstruction: IAFXInstruction): void;
        public _getOperator(): string;
        public _setOperator(sOperator: string): void;
        public _getInstructions(): IAFXInstruction[];
        public _setInstructions(pInstructionList: IAFXInstruction[]): void;
        public _getInstructionType(): EAFXInstructionTypes;
        public _getInstructionID(): number;
        public _getScope(): number;
        public _setScope(iScope: number): void;
        public _isInGlobalScope(): boolean;
        public _getLastError(): IAFXInstructionError;
        public _setError(eCode: number, pInfo?: any): void;
        public _clearError(): void;
        public _isErrorOccured(): boolean;
        public _setVisible(isVisible: boolean): void;
        public _isVisible(): boolean;
        public _initEmptyInstructions(): void;
        constructor();
        public _push(pInstruction: IAFXInstruction, isSetParent?: boolean): void;
        public _addRoutine(fnRoutine: IAFXInstructionRoutine, iPriority?: number): void;
        public _prepareFor(eUsedType: EFunctionType): void;
        /**
        * Проверка валидности инструкции
        */
        public _check(eStage: ECheckStage, pInfo?: any): boolean;
        /**
        * Подготовка интсрукции к дальнейшему анализу
        */
        public prepare(): boolean;
        public toString(): string;
        public _toFinalCode(): string;
        public _clone(pRelationMap?: IAFXInstructionMap): IAFXInstruction;
        static UNDEFINE_LENGTH: number;
        static UNDEFINE_SIZE: number;
        static UNDEFINE_SCOPE: number;
        static UNDEFINE_PADDING: number;
        static UNDEFINE_NAME: string;
    }
}
declare module akra.fx.instructions {
    class TypedInstruction extends Instruction implements IAFXTypedInstruction {
        public _pType: IAFXTypeInstruction;
        constructor();
        public _getType(): IAFXTypeInstruction;
        public _setType(pType: IAFXTypeInstruction): void;
        public _clone(pRelationMap?: IAFXInstructionMap): IAFXTypedInstruction;
    }
}
declare module akra.fx.instructions {
    class ExprInstruction extends TypedInstruction implements IAFXExprInstruction {
        public _pLastEvalResult: any;
        /**
        * Respresent all kind of instruction
        */
        constructor();
        public _evaluate(): boolean;
        public _simplify(): boolean;
        public _getEvalValue(): any;
        public _isConst(): boolean;
        public _getType(): IAFXVariableTypeInstruction;
        public _clone(pRelationMap?: IAFXInstructionMap): IAFXExprInstruction;
        public _addUsedData(pUsedDataCollector: IAFXTypeUseInfoMap, eUsedMode?: EVarUsedMode): void;
    }
}
declare module akra.fx.instructions {
    /**
    * Represent someExpr + / - * % someExpr
    * (+|-|*|/|%) Instruction Instruction
    */
    class ArithmeticExprInstruction extends ExprInstruction {
        constructor();
        public _addUsedData(pUsedDataCollector: IAFXTypeUseInfoMap, eUsedMode?: EVarUsedMode): void;
        public _evaluate(): boolean;
        public _toFinalCode(): string;
        public _isConst(): boolean;
    }
}
declare module akra.fx.instructions {
    /**
    * Represent someExpr = += -= /= *= %= someExpr
    * (=|+=|-=|*=|/=|%=) Instruction Instruction
    */
    class AssignmentExprInstruction extends ExprInstruction {
        constructor();
        public _toFinalCode(): string;
        public _addUsedData(pUsedDataCollector: IAFXTypeUseInfoMap, eUsedMode?: EVarUsedMode): void;
    }
}
declare module akra.fx.instructions {
    class BoolInstruction extends ExprInstruction implements IAFXLiteralInstruction {
        private _bValue;
        private static _pBoolType;
        /**
        * EMPTY_OPERATOR EMPTY_ARGUMENTS
        */
        constructor();
        public _setValue(bValue: boolean): void;
        public toString(): string;
        public _toFinalCode(): string;
        public _evaluate(): boolean;
        public _isConst(): boolean;
        public _clone(pRelationMap?: IAFXInstructionMap): IAFXLiteralInstruction;
    }
}
declare module akra.fx.instructions {
    /**
    * Represent all kind of statements
    */
    class StmtInstruction extends Instruction implements IAFXStmtInstruction {
        constructor();
        public _addUsedData(pUsedDataCollector: IAFXTypeUseInfoMap, eUsedMode?: EVarUsedMode): void;
    }
}
declare module akra.fx.instructions {
    /**
    * Reprsernt continue; break; discard;
    * (continue || break || discard)
    */
    class BreakStmtInstruction extends StmtInstruction {
        constructor();
        public _toFinalCode(): string;
    }
}
declare module akra.fx.instructions {
    /**
    * Represent (type) expr
    * EMPTY_OPERATOR VariableTypeInstruction Instruction
    */
    class CastExprInstruction extends ExprInstruction {
        constructor();
        public _toFinalCode(): string;
        public _addUsedData(pUsedDataCollector: IAFXTypeUseInfoMap, eUsedMode?: EVarUsedMode): void;
        public _isConst(): boolean;
    }
}
declare module akra.fx.instructions {
    /**
    * Represent (expr)
    * EMPTY_OPERATOR ExprInstruction
    */
    class ComplexExprInstruction extends ExprInstruction {
        constructor();
        public _toFinalCode(): string;
        public _isConst(): boolean;
        public _evaluate(): boolean;
    }
}
declare module akra.fx.instructions {
    class ComplexTypeInstruction extends Instruction implements IAFXTypeInstruction {
        private _sName;
        private _sRealName;
        private _sHash;
        private _sStrongHash;
        private _iSize;
        private _pFieldDeclMap;
        private _pFieldDeclList;
        private _pFieldNameList;
        private _pFieldDeclBySemanticMap;
        private _bHasAllUniqueSemantics;
        private _bHasFieldWithoutSemantic;
        private _isContainArray;
        private _isContainSampler;
        private _isContainPointer;
        private _isContainComplexType;
        constructor();
        public toString(): string;
        public _toDeclString(): string;
        public _toFinalCode(): string;
        public _isBuiltIn(): boolean;
        public _setBuiltIn(isBuiltIn: boolean): void;
        public _isBase(): boolean;
        public _isArray(): boolean;
        public _isNotBaseArray(): boolean;
        public _isComplex(): boolean;
        public _isEqual(pType: IAFXTypeInstruction): boolean;
        public _isStrongEqual(pType: IAFXTypeInstruction): boolean;
        public _isConst(): boolean;
        public _isSampler(): boolean;
        public _isSamplerCube(): boolean;
        public _isSampler2D(): boolean;
        public _isWritable(): boolean;
        public _isReadable(): boolean;
        public _containArray(): boolean;
        public _containSampler(): boolean;
        public _containPointer(): boolean;
        public _containComplexType(): boolean;
        public _setName(sName: string): void;
        public setRealName(sRealName: string): void;
        public setSize(iSize: number): void;
        public _canWrite(isWritable: boolean): void;
        public _canRead(isWritable: boolean): void;
        public addField(pVariable: IAFXVariableDeclInstruction): void;
        public addFields(pFieldCollector: IAFXInstruction, isSetParent?: boolean): void;
        public _getName(): string;
        public _getRealName(): string;
        public _getHash(): string;
        public _getStrongHash(): string;
        public _hasField(sFieldName: string): boolean;
        public _hasFieldWithSematic(sSemantic: string): boolean;
        public _hasAllUniqueSemantics(): boolean;
        public _hasFieldWithoutSemantic(): boolean;
        public _getField(sFieldName: string): IAFXVariableDeclInstruction;
        public _getFieldBySemantic(sSemantic: string): IAFXVariableDeclInstruction;
        public _getFieldType(sFieldName: string): IAFXVariableTypeInstruction;
        public _getFieldNameList(): string[];
        public _getSize(): number;
        public _getBaseType(): IAFXTypeInstruction;
        public _getArrayElementType(): IAFXTypeInstruction;
        public _getTypeDecl(): IAFXTypeDeclInstruction;
        public _getLength(): number;
        public _getFieldDeclList(): IAFXVariableDeclInstruction[];
        public _clone(pRelationMap?: IAFXInstructionMap): ComplexTypeInstruction;
        public _blend(pType: IAFXTypeInstruction, eMode: EAFXBlendMode): IAFXTypeInstruction;
        public _setCloneName(sName: string, sRealName: string): void;
        public _setCloneHash(sHash: string, sStrongHash: string): void;
        public _setCloneContain(isContainArray: boolean, isContainSampler: boolean): void;
        public _setCloneFields(pFieldDeclList: IAFXVariableDeclInstruction[], pFieldNameList: string[], pFieldDeclMap: IAFXVariableDeclMap): void;
        public _calcSize(): number;
        private calcHash();
        private calcStrongHash();
        private analyzeSemantics();
        private calculatePaddings();
    }
}
declare module akra.fx.instructions {
    /**
    * Represetn compile vs_func(...args)
    * compile IdExprInstruction ExprInstruction ... ExprInstruction
    */
    class CompileExprInstruction extends ExprInstruction {
        constructor();
        public getFunction(): IAFXFunctionDeclInstruction;
    }
}
declare module akra.fx.instructions {
    /**
    * Represen boolExpr ? someExpr : someExpr
    * EMPTY_OPERATOR Instruction Instruction Instruction
    */
    class ConditionalExprInstruction extends ExprInstruction {
        constructor();
        public _toFinalCode(): string;
        public _addUsedData(pUsedDataCollector: IAFXTypeUseInfoMap, eUsedMode?: EVarUsedMode): void;
        public _isConst(): boolean;
    }
}
declare module akra.fx.instructions {
    /**
    * Respresnt ctor(arg1,..., argn)
    * EMPTY_OPERATOR IdInstruction ExprInstruction ... ExprInstruction
    */
    class ConstructorCallInstruction extends ExprInstruction {
        constructor();
        public _toFinalCode(): string;
        public _addUsedData(pUsedDataCollector: IAFXTypeUseInfoMap, eUsedMode?: EVarUsedMode): void;
        public _isConst(): boolean;
        public _evaluate(): boolean;
    }
}
declare module akra.fx.instructions {
    /**
    * Represent TypeDecl or VariableDecl or VarStructDecl
    * EMPTY DeclInstruction
    */
    class DeclStmtInstruction extends StmtInstruction {
        constructor();
        public _toFinalCode(): string;
        public _addUsedData(pUsedDataCollector: IAFXTypeUseInfoMap, eUsedMode?: EVarUsedMode): void;
    }
}
declare module akra.fx.instructions {
    /**
    * Represent expr;
    * EMPTY_OPERTOR ExprInstruction
    */
    class ExprStmtInstruction extends StmtInstruction {
        constructor();
        public _toFinalCode(): string;
    }
}
declare module akra.fx.instructions {
    class SimpleInstruction extends Instruction implements IAFXSimpleInstruction {
        private _sValue;
        constructor(sValue: string);
        public _setValue(sValue: string): void;
        public _isValue(sValue: string): boolean;
        public toString(): string;
        public _toFinalCode(): string;
        public _clone(pRelationMap?: IAFXInstructionMap): SimpleInstruction;
    }
}
declare module akra.fx {
    class ExprTemplateTranslator {
        private _pInToOutArgsMap;
        private _pExprPart;
        constructor(sExprTemplate: string);
        public toInstructionList(pArguments: IAFXInstruction[]): IAFXInstruction[];
    }
}
declare module akra.fx.instructions {
    class ExtractExprInstruction extends ExprInstruction {
        private _eExtractExprType;
        private _pPointer;
        private _pBuffer;
        private _pOffsetVar;
        private _sPaddingExpr;
        private _sExtractFunction;
        private _bNeedSecondBracket;
        constructor();
        public getExtractFunction(): IAFXFunctionDeclInstruction;
        public initExtractExpr(pExtractType: IAFXVariableTypeInstruction, pPointer: IAFXVariableDeclInstruction, pBuffer: IAFXVariableDeclInstruction, sPaddingExpr: string, pOffsetVar: IAFXVariableDeclInstruction): void;
        public _addUsedData(pUsedDataCollector: IAFXTypeUseInfoMap, eUsedMode?: EVarUsedMode): void;
        public _toFinalCode(): string;
        public _clone(pRelationMap?: IAFXInstructionMap): ExtractExprInstruction;
        public _setCloneParams(pPointer: IAFXVariableDeclInstruction, pBuffer: IAFXVariableDeclInstruction, eExtractExprType: EExtractExprType, sPaddingExpr: string, sExtractFunction: string, bNeedSecondBracket: boolean): void;
    }
}
declare module akra.fx.instructions {
    class ExtractStmtInstruction extends ExprInstruction {
        private _pExtractInVar;
        private _pExtractInExpr;
        private _pExtactExpr;
        constructor();
        public generateStmtForBaseType(pVarDecl: IAFXVariableDeclInstruction, pPointer: IAFXVariableDeclInstruction, pBuffer: IAFXVariableDeclInstruction, iPadding: number, pOffset?: IAFXVariableDeclInstruction): void;
        public _toFinalCode(): string;
        public _addUsedData(pUsedDataCollector: IAFXTypeUseInfoMap, eUsedMode?: EVarUsedMode): void;
        public getExtractFunction(): IAFXFunctionDeclInstruction;
    }
}
declare module akra.fx.instructions {
    class FloatInstruction extends ExprInstruction implements IAFXLiteralInstruction {
        private _fValue;
        /**
        * EMPTY_OPERATOR EMPTY_ARGUMENTS
        */
        constructor();
        public _setValue(fValue: number): void;
        public toString(): string;
        public _toFinalCode(): string;
        public _evaluate(): boolean;
        public _isConst(): boolean;
        public _clone(pRelationMap?: IAFXInstructionMap): IAFXLiteralInstruction;
    }
}
declare module akra.fx.instructions {
    /**
    * Represent for(forInit forCond ForStep) stmt
    * for ExprInstruction or VarDeclInstruction ExprInstruction ExprInstruction StmtInstruction
    */
    class ForStmtInstruction extends StmtInstruction {
        constructor();
        public _toFinalCode(): string;
        public _check(eStage: ECheckStage, pInfo?: any): boolean;
        public _addUsedData(pUsedDataCollector: IAFXTypeUseInfoMap, eUsedMode?: EVarUsedMode): void;
    }
}
declare module akra.fx.instructions {
    /**
    * Respresnt func(arg1,..., argn)
    * EMPTY_OPERATOR IdExprInstruction ExprInstruction ... ExprInstruction
    */
    class FunctionCallInstruction extends ExprInstruction {
        constructor();
        public _toFinalCode(): string;
        public getFunction(): IAFXFunctionDeclInstruction;
        public _addUsedData(pUsedDataCollector: IAFXTypeUseInfoMap, eUsedMode?: EVarUsedMode): void;
    }
}
declare module akra.fx.instructions {
    class DeclInstruction extends TypedInstruction implements IAFXDeclInstruction {
        public _sSemantic: string;
        public _pAnnotation: IAFXAnnotationInstruction;
        public _bForPixel: boolean;
        public _bForVertex: boolean;
        public _bIsBuiltIn: boolean;
        constructor();
        public _setSemantic(sSemantic: string): void;
        public _setAnnotation(pAnnotation: IAFXAnnotationInstruction): void;
        public _getName(): string;
        public _getRealName(): string;
        public _getNameId(): IAFXIdInstruction;
        public _getSemantic(): string;
        public _isBuiltIn(): boolean;
        public _setBuiltIn(isBuiltIn: boolean): void;
        public _isForAll(): boolean;
        public _isForPixel(): boolean;
        public _isForVertex(): boolean;
        public _setForAll(canUse: boolean): void;
        public _setForPixel(canUse: boolean): void;
        public _setForVertex(canUse: boolean): void;
        public _clone(pRelationMap?: IAFXInstructionMap): IAFXDeclInstruction;
    }
}
declare module akra.fx.instructions {
    /**
    * Represent type func(...args)[:Semantic]
    * EMPTY_OPERTOR VariableTypeInstruction IdInstruction VarDeclInstruction ... VarDeclInstruction
    */
    class FunctionDefInstruction extends DeclInstruction {
        private _pParameterList;
        private _pParamListForShaderCompile;
        private _pParamListForShaderInput;
        private _bIsComplexShaderInput;
        private _pReturnType;
        private _pFunctionName;
        private _nParamsNeeded;
        private _sDefinition;
        private _isAnalyzedForVertexUsage;
        private _isAnalyzedForPixelUsage;
        private _bCanUsedAsFunction;
        private _bShaderDef;
        constructor();
        public _toFinalCode(): string;
        public _setType(pType: IAFXTypeInstruction): void;
        public _getType(): IAFXTypeInstruction;
        public setReturnType(pReturnType: IAFXVariableTypeInstruction): boolean;
        public getReturnType(): IAFXVariableTypeInstruction;
        public setFunctionName(pNameId: IAFXIdInstruction): boolean;
        public _getName(): string;
        public _getRealName(): string;
        public _getNameId(): IAFXIdInstruction;
        public getArguments(): IAFXVariableDeclInstruction[];
        public getNumNeededArguments(): number;
        public markAsShaderDef(isShaderDef: boolean): void;
        public isShaderDef(): boolean;
        public addParameter(pParameter: IAFXVariableDeclInstruction, isStrictModeOn?: boolean): boolean;
        public getParameListForShaderInput(): IAFXVariableDeclInstruction[];
        public isComplexShaderInput(): boolean;
        public _clone(pRelationMap?: IAFXInstructionMap): FunctionDefInstruction;
        public _setShaderParams(pParamList: IAFXVariableDeclInstruction[], isComplexInput: boolean): void;
        public _setAnalyzedInfo(isAnalyzedForVertexUsage: boolean, isAnalyzedForPixelUsage: boolean, bCanUsedAsFunction: boolean): void;
        public _getStringDef(): string;
        public _canUsedAsFunction(): boolean;
        public _checkForVertexUsage(): boolean;
        public _checkForPixelUsage(): boolean;
        private checkReturnTypeForVertexUsage();
        private checkReturnTypeForPixelUsage();
        private checkArgumentsForVertexUsage();
        private checkArgumentsForPixelUsage();
    }
}
declare module akra.fx.instructions {
    class IdInstruction extends Instruction implements IAFXIdInstruction {
        private _sName;
        private _sRealName;
        private _isForVarying;
        public _isVisible(): boolean;
        /**
        * EMPTY_OPERATOR EMPTY_ARGUMENTS
        */
        constructor();
        public _getName(): string;
        public _getRealName(): string;
        public _setName(sName: string): void;
        public _setRealName(sRealName: string): void;
        public _markAsVarying(bValue: boolean): void;
        public toString(): string;
        public _toFinalCode(): string;
        public _clone(pRelationMap?: IAFXInstructionMap): IdInstruction;
    }
}
declare module akra.fx.instructions {
    class IdExprInstruction extends ExprInstruction implements IAFXIdExprInstruction {
        public _pType: IAFXVariableTypeInstruction;
        private _bToFinalCode;
        private _isInPassUnifoms;
        private _isInPassForeigns;
        public _isVisible(): boolean;
        constructor();
        public _getType(): IAFXVariableTypeInstruction;
        public _isConst(): boolean;
        public _evaluate(): boolean;
        public _prepareFor(eUsedMode: EFunctionType): void;
        public _toFinalCode(): string;
        public _clone(pRelationMap?: IAFXInstructionMap): IAFXIdExprInstruction;
        public _addUsedData(pUsedDataCollector: IAFXTypeUseInfoMap, eUsedMode?: EVarUsedMode): void;
    }
}
declare module akra.fx.instructions {
    /**
    * Represent if(expr) stmt or if(expr) stmt else stmt
    * ( if || if_else ) Expr Stmt [Stmt]
    */
    class IfStmtInstruction extends StmtInstruction {
        constructor();
        public _toFinalCode(): string;
    }
}
declare module akra.fx.instructions {
    class IntInstruction extends ExprInstruction implements IAFXLiteralInstruction {
        private _iValue;
        /**
        * EMPTY_OPERATOR EMPTY_ARGUMENTS
        */
        constructor();
        public _setValue(iValue: number): void;
        public toString(): string;
        public _toFinalCode(): string;
        public _evaluate(): boolean;
        public _isConst(): boolean;
        public _clone(pRelationMap?: IAFXInstructionMap): IAFXLiteralInstruction;
    }
}
declare module akra.fx.instructions {
    class InstructionCollector extends Instruction {
        constructor();
        public _toFinalCode(): string;
    }
}
declare module akra.fx.instructions {
    /**
    * Represetn sampler_state { states }
    */
    class SamplerStateBlockInstruction extends ExprInstruction {
        private _pTexture;
        private _pSamplerParams;
        constructor();
        public addState(sStateType: string, sStateValue: string): void;
        public setTexture(pTexture: IAFXVariableDeclInstruction): void;
        public getTexture(): IAFXVariableDeclInstruction;
        public _isConst(): boolean;
        public _evaluate(): boolean;
        static convertWrapMode(sState: string): ETextureWrapModes;
        static convertFilters(sState: string): ETextureFilters;
    }
}
declare module akra.fx.instructions {
    /**
    * Represent {stmts}
    * EMPTY_OPERATOR StmtInstruction ... StmtInstruction
    */
    class StmtBlockInstruction extends StmtInstruction {
        constructor();
        public _toFinalCode(): string;
    }
}
declare module akra.fx.instructions {
    class VariableTypeInstruction extends Instruction implements IAFXVariableTypeInstruction {
        private _pSubType;
        private _pUsageList;
        private _sName;
        private _bIsWritable;
        private _bIsReadable;
        private _bUsedForWrite;
        private _bUsedForRead;
        private _sHash;
        private _sStrongHash;
        private _bIsArray;
        private _bIsPointer;
        private _bIsStrictPointer;
        private _bIsPointIndex;
        private _bIsUniform;
        private _bIsGlobal;
        private _bIsConst;
        private _bIsShared;
        private _bIsForeign;
        private _iLength;
        private _isNeedToUpdateLength;
        private _bIsFromVariableDecl;
        private _bIsFromTypeDecl;
        private _bIsField;
        private _pArrayIndexExpr;
        private _pArrayElementType;
        private _pFieldDeclMap;
        private _pFieldDeclBySemanticMap;
        private _pFieldIdMap;
        private _pUsedFieldMap;
        private _pVideoBuffer;
        private _pMainPointIndex;
        private _pUpPointIndex;
        private _pDownPointIndex;
        private _nPointDim;
        private _pPointerList;
        private _iPadding;
        private _pSubDeclList;
        private _pAttrOffset;
        private _bUnverifiable;
        private _bCollapsed;
        constructor();
        public toString(): string;
        public _toFinalCode(): string;
        public _toDeclString(): string;
        public _isBuiltIn(): boolean;
        public _setBuiltIn(isBuiltIn: boolean): void;
        public _setCollapsed(bValue: boolean): void;
        public _isCollapsed(): boolean;
        public _isBase(): boolean;
        public _isArray(): boolean;
        public _isNotBaseArray(): boolean;
        public _isComplex(): boolean;
        public _isEqual(pType: IAFXTypeInstruction): boolean;
        public _isStrongEqual(pType: IAFXTypeInstruction): boolean;
        public _isSampler(): boolean;
        public _isSamplerCube(): boolean;
        public _isSampler2D(): boolean;
        public _isWritable(): boolean;
        public _isReadable(): boolean;
        public _containArray(): boolean;
        public _containSampler(): boolean;
        public _containPointer(): boolean;
        public _containComplexType(): boolean;
        public _isPointer(): boolean;
        public _isStrictPointer(): boolean;
        public _isPointIndex(): boolean;
        public _isFromVariableDecl(): boolean;
        public _isFromTypeDecl(): boolean;
        public _isUniform(): boolean;
        public _isGlobal(): boolean;
        public _isConst(): boolean;
        public _isShared(): boolean;
        public _isForeign(): boolean;
        public _isTypeOfField(): boolean;
        public _isUnverifiable(): boolean;
        public _setName(sName: string): void;
        public _canWrite(isWritable: boolean): void;
        public _canRead(isReadable: boolean): void;
        public _setPadding(iPadding: number): void;
        public _pushType(pType: IAFXTypeInstruction): void;
        public _addUsage(sUsage: string): void;
        public _addArrayIndex(pExpr: IAFXExprInstruction): void;
        public _addPointIndex(isStrict?: boolean): void;
        public _setVideoBuffer(pBuffer: IAFXVariableDeclInstruction): void;
        public _initializePointers(): void;
        public _setPointerToStrict(): void;
        public _addPointIndexInDepth(): void;
        public _setVideoBufferInDepth(): void;
        public _markAsUnverifiable(isUnverifiable: boolean): void;
        public _addAttrOffset(pOffset: IAFXVariableDeclInstruction): void;
        public _getName(): string;
        public _getRealName(): string;
        public _getHash(): string;
        public _getStrongHash(): string;
        public _getSize(): number;
        public _getBaseType(): IAFXTypeInstruction;
        public _getLength(): number;
        public _getPadding(): number;
        public _getArrayElementType(): IAFXVariableTypeInstruction;
        public _getTypeDecl(): IAFXTypeDeclInstruction;
        public _hasField(sFieldName: string): boolean;
        public _hasFieldWithSematic(sSemantic: string): boolean;
        public _hasAllUniqueSemantics(): boolean;
        public _hasFieldWithoutSemantic(): boolean;
        public _getField(sFieldName: string): IAFXVariableDeclInstruction;
        public _getFieldBySemantic(sSemantic: string): IAFXVariableDeclInstruction;
        public _getFieldType(sFieldName: string): IAFXVariableTypeInstruction;
        public _getFieldNameList(): string[];
        public _getUsageList(): string[];
        public _getSubType(): IAFXTypeInstruction;
        public _hasUsage(sUsageName: string): boolean;
        public _hasVideoBuffer(): boolean;
        public _getPointDim(): number;
        public _getPointer(): IAFXVariableDeclInstruction;
        public _getVideoBuffer(): IAFXVariableDeclInstruction;
        public _getFieldExpr(sFieldName: string): IAFXIdExprInstruction;
        public _getFieldIfExist(sFieldName: string): IAFXVariableDeclInstruction;
        public _getSubVarDecls(): IAFXVariableDeclInstruction[];
        public _getFullName(): string;
        public _getVarDeclName(): string;
        public _getTypeDeclName(): string;
        public _getParentVarDecl(): IAFXVariableDeclInstruction;
        public _getParentContainer(): IAFXVariableDeclInstruction;
        public _getMainVariable(): IAFXVariableDeclInstruction;
        public _getMainPointer(): IAFXVariableDeclInstruction;
        public _getUpPointer(): IAFXVariableDeclInstruction;
        public _getDownPointer(): IAFXVariableDeclInstruction;
        public _getAttrOffset(): IAFXVariableDeclInstruction;
        public _wrap(): IAFXVariableTypeInstruction;
        public _clone(pRelationMap?: IAFXInstructionMap): IAFXVariableTypeInstruction;
        public _blend(pType: IAFXVariableTypeInstruction, eMode: EAFXBlendMode): IAFXVariableTypeInstruction;
        public _setCloneHash(sHash: string, sStrongHash: string): void;
        public _setCloneArrayIndex(pElementType: IAFXVariableTypeInstruction, pIndexExpr: IAFXExprInstruction, iLength: number): void;
        public _setClonePointeIndexes(nDim: number, pPointerList: IAFXVariableDeclInstruction[]): void;
        public _setCloneFields(pFieldMap: IAFXVariableDeclMap): void;
        public _setUpDownPointers(pUpPointIndex: IAFXVariableDeclInstruction, pDownPointIndex: IAFXVariableDeclInstruction): void;
        private calcHash();
        private calcStrongHash();
        private generateSubDeclList();
        private canHaveSubDecls();
    }
}
declare module akra.fx.instructions {
    /**
    * Represent type func(...args)[:Semantic] [<Annotation> {stmts}]
    * EMPTY_OPERTOR FunctionDefInstruction StmtBlockInstruction
    */
    class FunctionDeclInstruction extends DeclInstruction implements IAFXFunctionDeclInstruction {
        public _pFunctionDefenition: FunctionDefInstruction;
        public _pImplementation: StmtBlockInstruction;
        public _eFunctionType: EFunctionType;
        public _bUsedAsFunction: boolean;
        public _bUsedAsVertex: boolean;
        public _bUsedAsPixel: boolean;
        public _bCanUsedAsFunction: boolean;
        public _bUsedInVertex: boolean;
        public _bUsedInPixel: boolean;
        public _pParseNode: parser.IParseNode;
        public _iImplementationScope: number;
        public _isInBlackList: boolean;
        public _pOutVariable: IAFXVariableDeclInstruction;
        public _pUsedFunctionMap: IAFXFunctionDeclMap;
        public _pUsedFunctionList: IAFXFunctionDeclInstruction[];
        public _pAttributeVariableMap: IAFXVariableDeclMap;
        public _pVaryingVariableMap: IAFXVariableDeclMap;
        public _pUsedVarTypeMap: IAFXTypeUseInfoMap;
        public _pSharedVariableMap: IAFXVariableDeclMap;
        public _pGlobalVariableMap: IAFXVariableDeclMap;
        public _pUniformVariableMap: IAFXVariableDeclMap;
        public _pForeignVariableMap: IAFXVariableDeclMap;
        public _pTextureVariableMap: IAFXVariableDeclMap;
        public _pUsedComplexTypeMap: IAFXTypeMap;
        public _pAttributeVariableKeys: number[];
        public _pVaryingVariableKeys: number[];
        public _pSharedVariableKeys: number[];
        public _pUniformVariableKeys: number[];
        public _pForeignVariableKeys: number[];
        public _pGlobalVariableKeys: number[];
        public _pTextureVariableKeys: number[];
        public _pUsedComplexTypeKeys: number[];
        public _pVertexShader: IAFXFunctionDeclInstruction;
        public _pPixelShader: IAFXFunctionDeclInstruction;
        private _pExtSystemTypeList;
        private _pExtSystemFunctionList;
        private _pExtSystemMacrosList;
        constructor();
        public _toFinalCode(): string;
        public _toFinalDefCode(): string;
        public _getType(): IAFXTypeInstruction;
        public _getName(): string;
        public _getRealName(): string;
        public _getNameId(): IAFXIdInstruction;
        public _getArguments(): IAFXVariableDeclInstruction[];
        public _getNumNeededArguments(): number;
        public _hasImplementation(): boolean;
        public _getReturnType(): IAFXVariableTypeInstruction;
        public _getFunctionType(): EFunctionType;
        public _setFunctionType(eFunctionType: EFunctionType): void;
        public _setImplementationScope(iScope: number): void;
        public _getImplementationScope(): number;
        public _setParseNode(pNode: parser.IParseNode): void;
        public _getParseNode(): parser.IParseNode;
        public _setFunctionDef(pFunctionDef: IAFXDeclInstruction): void;
        public _setImplementation(pImplementation: IAFXStmtInstruction): void;
        public _clone(pRelationMap?: IAFXInstructionMap): IAFXFunctionDeclInstruction;
        public _addOutVariable(pVariable: IAFXVariableDeclInstruction): boolean;
        public _getOutVariable(): IAFXVariableDeclInstruction;
        public _getVertexShader(): IAFXFunctionDeclInstruction;
        public _getPixelShader(): IAFXFunctionDeclInstruction;
        public _markUsedAs(eUsedType: EFunctionType): void;
        public _isUsedAs(eUsedType: EFunctionType): boolean;
        public _isUsedAsFunction(): boolean;
        public _isUsedAsVertex(): boolean;
        public _isUsedAsPixel(): boolean;
        public _markUsedInVertex(): void;
        public _markUsedInPixel(): void;
        public _isUsedInVertex(): boolean;
        public _isUsedInPixel(): boolean;
        public _isUsed(): boolean;
        public _checkVertexUsage(): boolean;
        public _checkPixelUsage(): boolean;
        public _checkDefenitionForVertexUsage(): boolean;
        public _checkDefenitionForPixelUsage(): boolean;
        public _canUsedAsFunction(): boolean;
        public _notCanUsedAsFunction(): void;
        public _addUsedFunction(pFunction: IAFXFunctionDeclInstruction): boolean;
        public _addUsedVariable(pVariable: IAFXVariableDeclInstruction): void;
        public _getUsedFunctionList(): IAFXFunctionDeclInstruction[];
        public _isBlackListFunction(): boolean;
        public _addToBlackList(): void;
        public _getStringDef(): string;
        public _convertToVertexShader(): IAFXFunctionDeclInstruction;
        public _convertToPixelShader(): IAFXFunctionDeclInstruction;
        public _prepareForVertex(): void;
        public _prepareForPixel(): void;
        public _setOutVariable(pVar: IAFXVariableDeclInstruction): void;
        public _setUsedFunctions(pUsedFunctionMap: IAFXFunctionDeclMap, pUsedFunctionList: IAFXFunctionDeclInstruction[]): void;
        public _setUsedVariableData(pUsedVarTypeMap: IAFXTypeUseInfoMap, pSharedVariableMap: IAFXVariableDeclMap, pGlobalVariableMap: IAFXVariableDeclMap, pUniformVariableMap: IAFXVariableDeclMap, pForeignVariableMap: IAFXVariableDeclMap, pTextureVariableMap: IAFXVariableDeclMap, pUsedComplexTypeMap: IAFXTypeMap): void;
        public _initAfterClone(): void;
        public _generateInfoAboutUsedData(): void;
        public _getAttributeVariableMap(): IAFXVariableDeclMap;
        public _getVaryingVariableMap(): IAFXVariableDeclMap;
        public _getSharedVariableMap(): IAFXVariableDeclMap;
        public _getGlobalVariableMap(): IAFXVariableDeclMap;
        public _getUniformVariableMap(): IAFXVariableDeclMap;
        public _getForeignVariableMap(): IAFXVariableDeclMap;
        public _getTextureVariableMap(): IAFXVariableDeclMap;
        public _getUsedComplexTypeMap(): IAFXTypeMap;
        public _getAttributeVariableKeys(): number[];
        public _getVaryingVariableKeys(): number[];
        public _getSharedVariableKeys(): number[];
        public _getUniformVariableKeys(): number[];
        public _getForeignVariableKeys(): number[];
        public _getGlobalVariableKeys(): number[];
        public _getTextureVariableKeys(): number[];
        public _getUsedComplexTypeKeys(): number[];
        public _getExtSystemFunctionList(): IAFXFunctionDeclInstruction[];
        public _getExtSystemMacrosList(): IAFXSimpleInstruction[];
        public _getExtSystemTypeList(): IAFXTypeDeclInstruction[];
        private generatesVertexAttrubutes();
        private generateVertexVaryings();
        private generatePixelVaryings();
        private cloneVarTypeUsedMap(pMap, pRelationMap);
        private cloneVarDeclMap(pMap, pRelationMap);
        private cloneTypeMap(pMap, pRelationMap);
        private addGlobalVariableType(pVariableType, isWrite, isRead);
        private addUniformParameter(pType);
        private addUsedComplexType(pType);
        private addUsedInfoFromFunction(pFunction);
        private addExtSystemFunction(pFunction);
        private isVariableTypeUse(pVariableType);
        private generateExtractBlockForAttribute(pAttr);
        private generateExtractStmtFromPointer(pPointer, pOffset, iDepth, pCollector);
        private generateExtractStmtForComplexVar(pVarDecl, pOffset, iDepth, pCollector, pPointer, pBuffer, iPadding);
        private createOffsetForAttr(pAttr);
    }
}
declare module akra.fx.instructions {
    class InitExprInstruction extends ExprInstruction implements IAFXInitExprInstruction {
        private _pConstructorType;
        private _bIsConst;
        private _isArray;
        constructor();
        public _toFinalCode(): string;
        public _isConst(): boolean;
        public _optimizeForVariableType(pType: IAFXVariableTypeInstruction): boolean;
        public _evaluate(): boolean;
    }
}
declare module akra.fx.instructions {
    /**
    * Represent boolExpr && || boolExpr
    * (&& | ||) Instruction Instruction
    */
    class LogicalExprInstruction extends ExprInstruction {
        constructor();
        public _toFinalCode(): string;
        public _addUsedData(pUsedDataCollector: IAFXTypeUseInfoMap, eUsedMode?: EVarUsedMode): void;
        public _isConst(): boolean;
    }
}
declare module akra.fx.instructions {
    class MemExprInstruction extends ExprInstruction {
        private _pBuffer;
        constructor();
        public getBuffer(): IAFXVariableDeclInstruction;
        public setBuffer(pBuffer: IAFXVariableDeclInstruction): void;
        public _addUsedData(pUsedDataCollector: IAFXTypeUseInfoMap, eUsedMode?: EVarUsedMode): void;
    }
}
declare module akra.fx.instructions {
    class PassInstruction extends DeclInstruction implements IAFXPassInstruction {
        private _pTempNodeList;
        private _pTempFoundedFuncList;
        private _pTempFoundedFuncTypeList;
        private _pParseNode;
        private _sFunctionCode;
        private _pShadersMap;
        private _pPassStateMap;
        private _bIsComlexPass;
        private _fnPassFunction;
        private _pVertexShader;
        private _pPixelShader;
        private _pSharedVariableMapV;
        private _pGlobalVariableMapV;
        private _pUniformVariableMapV;
        private _pForeignVariableMapV;
        private _pTextureVariableMapV;
        private _pUsedComplexTypeMapV;
        private _pSharedVariableMapP;
        private _pGlobalVariableMapP;
        private _pUniformVariableMapP;
        private _pForeignVariableMapP;
        private _pTextureVariableMapP;
        private _pUsedComplexTypeMapP;
        private _pFullUniformVariableMap;
        private _pFullForeignVariableMap;
        private _pFullTextureVariableMap;
        private _pOwnUsedForeignVariableMap;
        private _pComplexPassEvaluateOutput;
        constructor();
        public _addFoundFunction(pNode: parser.IParseNode, pShader: IAFXFunctionDeclInstruction, eType: EFunctionType): void;
        public _getFoundedFunction(pNode: parser.IParseNode): IAFXFunctionDeclInstruction;
        public _getFoundedFunctionType(pNode: parser.IParseNode): EFunctionType;
        public _setParseNode(pNode: parser.IParseNode): void;
        public _getParseNode(): parser.IParseNode;
        public _addCodeFragment(sCode: string): void;
        public _markAsComplex(isComplex: boolean): void;
        public _getSharedVariableMapV(): IAFXVariableDeclMap;
        public _getGlobalVariableMapV(): IAFXVariableDeclMap;
        public _getUniformVariableMapV(): IAFXVariableDeclMap;
        public _getForeignVariableMapV(): IAFXVariableDeclMap;
        public _getTextureVariableMapV(): IAFXVariableDeclMap;
        public _getUsedComplexTypeMapV(): IAFXTypeMap;
        public _getSharedVariableMapP(): IAFXVariableDeclMap;
        public _getGlobalVariableMapP(): IAFXVariableDeclMap;
        public _getUniformVariableMapP(): IAFXVariableDeclMap;
        public _getForeignVariableMapP(): IAFXVariableDeclMap;
        public _getTextureVariableMapP(): IAFXVariableDeclMap;
        public _getUsedComplexTypeMapP(): IAFXTypeMap;
        public _getFullUniformMap(): IAFXVariableDeclMap;
        public _getFullForeignMap(): IAFXVariableDeclMap;
        public _getFullTextureMap(): IAFXVariableDeclMap;
        public _isComplexPass(): boolean;
        public _getVertexShader(): IAFXFunctionDeclInstruction;
        public _getPixelShader(): IAFXFunctionDeclInstruction;
        public _addOwnUsedForignVariable(pVarDecl: IAFXVariableDeclInstruction): void;
        public _addShader(pShader: IAFXFunctionDeclInstruction): void;
        public _setState(eType: ERenderStates, eValue: ERenderStateValues): void;
        public _finalizePass(): void;
        public _evaluate(pEngineStates: any, pForeigns: any, pUniforms: any): boolean;
        public _getState(eType: ERenderStates): ERenderStateValues;
        public _getRenderStates(): IMap<ERenderStateValues>;
        private clearPassStates();
        private generateInfoAboutUsedVaraibles();
        private addInfoAbouUsedVariablesFromFunction(pFunction);
        static POST_EFFECT_SEMANTIC: string;
    }
}
declare module akra.fx.instructions {
    /**
    * Represent someExpr ++
    * (-- | ++) Instruction
    */
    class PostfixArithmeticInstruction extends ExprInstruction {
        constructor();
        public _toFinalCode(): string;
        public _addUsedData(pUsedDataCollector: IAFXTypeUseInfoMap, eUsedMode?: EVarUsedMode): void;
        public _isConst(): boolean;
    }
}
declare module akra.fx.instructions {
    /**
    * Represent someExpr[someIndex]
    * EMPTY_OPERATOR Instruction ExprInstruction
    */
    class PostfixIndexInstruction extends ExprInstruction {
        private _pSamplerArrayDecl;
        constructor();
        public _toFinalCode(): string;
        public _addUsedData(pUsedDataCollector: IAFXTypeUseInfoMap, eUsedMode?: EVarUsedMode): void;
        public _isConst(): boolean;
    }
}
declare module akra.fx.instructions {
    class PostfixPointInstruction extends ExprInstruction {
        private _bToFinalFirst;
        private _bToFinalSecond;
        constructor();
        public _prepareFor(eUsedMode: EFunctionType): void;
        public _toFinalCode(): string;
        public _addUsedData(pUsedDataCollector: IAFXTypeUseInfoMap, eUsedMode?: EVarUsedMode): void;
        public _isConst(): boolean;
    }
}
declare module akra.fx.instructions {
    /**
    * Represent @ Expr
    * @ Instruction
    */
    class PrimaryExprInstruction extends ExprInstruction {
        constructor();
        public _toFinalCode(): string;
        public _addUsedData(pUsedDataCollector: IAFXTypeUseInfoMap, eUsedMode?: EVarUsedMode): void;
    }
}
declare module akra.fx {
    class ProgramScope {
        private _pScopeMap;
        private _iCurrentScope;
        private _nScope;
        constructor();
        public _isStrictMode(iScope?: number): boolean;
        public _setStrictModeOn(iScope?: number): void;
        public _newScope(eType: EScopeType): void;
        public _resumeScope(): void;
        public _setScope(iScope: number): void;
        public _getScope(): number;
        public _endScope(): void;
        public _getScopeType(): EScopeType;
        public _getVariable(sVariableName: string, iScope?: number): IAFXVariableDeclInstruction;
        public _getType(sTypeName: string, iScope?: number): IAFXTypeInstruction;
        public _getTypeDecl(sTypeName: string, iScope?: number): IAFXTypeDeclInstruction;
        /**
        * get function by name and list of types
        * return null - if threre are not function; undefined - if there more then one function; function - if all ok
        */
        public _getFunction(sFuncName: string, pArgumentTypes: IAFXTypedInstruction[], iScope?: number): IAFXFunctionDeclInstruction;
        /**
        * get shader function by name and list of types
        * return null - if threre are not function; undefined - if there more then one function; function - if all ok
        */
        public _getShaderFunction(sFuncName: string, pArgumentTypes: IAFXTypedInstruction[], iScope?: number): IAFXFunctionDeclInstruction;
        public _addVariable(pVariable: IAFXVariableDeclInstruction, iScope?: number): boolean;
        public _addType(pType: IAFXTypeDeclInstruction, iScope?: number): boolean;
        public _addFunction(pFunction: IAFXFunctionDeclInstruction, iScope?: number): boolean;
        public _hasVariable(sVariableName: string, iScope?: number): boolean;
        public _hasType(sTypeName: string, iScope?: number): boolean;
        public _hasFunction(sFuncName: string, pArgumentTypes: IAFXTypedInstruction[], iScope?: number): boolean;
        private hasVariableInScope(sVariableName, iScope);
        private hasTypeInScope(sTypeName, iScope);
        private hasFunctionInScope(pFunction, iScope);
        static GLOBAL_SCOPE: number;
    }
}
declare module akra.fx.instructions {
    /**
    * Represent someExpr == != < > <= >= someExpr
    * (==|!=|<|>|<=|>=) Instruction Instruction
    */
    class RelationalExprInstruction extends ExprInstruction {
        constructor();
        public _toFinalCode(): string;
        public _addUsedData(pUsedDataCollector: IAFXTypeUseInfoMap, eUsedMode?: EVarUsedMode): void;
        public _isConst(): boolean;
    }
}
declare module akra.fx.instructions {
    /**
    * Represent return expr;
    * return ExprInstruction
    */
    class ReturnStmtInstruction extends StmtInstruction {
        private _pPreparedCode;
        private _isPositionReturn;
        private _isColorReturn;
        private _isOnlyReturn;
        constructor();
        public _prepareFor(eUsedMode: EFunctionType): void;
        public _toFinalCode(): string;
    }
}
declare module akra.fx.instructions {
    /**
    * Represent empty statement only semicolon ;
    * ;
    */
    class SemicolonStmtInstruction extends StmtInstruction {
        constructor();
        public _toFinalCode(): string;
    }
}
declare module akra.fx.instructions {
    class StringInstruction extends ExprInstruction implements IAFXLiteralInstruction {
        private _sValue;
        private static _pStringType;
        /**
        * EMPTY_OPERATOR EMPTY_ARGUMENTS
        */
        constructor();
        public _setValue(sValue: string): void;
        public toString(): string;
        public _toFinalCode(): string;
        public _evaluate(): boolean;
        public _isConst(): boolean;
        public _clone(pRelationMap?: IAFXInstructionMap): IAFXLiteralInstruction;
    }
}
declare module akra.fx.instructions {
    class SystemFunctionInstruction extends DeclInstruction implements IAFXFunctionDeclInstruction {
        private _pExprTranslator;
        private _pName;
        private _pReturnType;
        private _pArguments;
        private _sDefinition;
        private _sImplementation;
        private _pExtSystemTypeList;
        private _pExtSystemFunctionList;
        private _pExtSystemMacrosList;
        constructor(sName: string, pReturnType: IAFXTypeInstruction, pExprTranslator: ExprTemplateTranslator, pArgumentTypes: IAFXTypeInstruction[]);
        public setDeclCode(sDefenition: string, sImplementation: string): void;
        /**
        * Generate code
        */
        public _toFinalCode(): string;
        public _toFinalDefCode(): string;
        public setUsedSystemData(pTypeList: IAFXTypeDeclInstruction[], pFunctionList: IAFXFunctionDeclInstruction[], pMacrosList: IAFXSimpleInstruction[]): void;
        public closeSystemDataInfo(): void;
        public setExprTranslator(pExprTranslator: ExprTemplateTranslator): void;
        public _getNameId(): IAFXIdInstruction;
        public _getArguments(): IAFXTypedInstruction[];
        public _getNumNeededArguments(): number;
        public _hasImplementation(): boolean;
        public _getType(): IAFXVariableTypeInstruction;
        public _getReturnType(): IAFXVariableTypeInstruction;
        public _getFunctionType(): EFunctionType;
        public _setFunctionType(eFunctionType: EFunctionType): void;
        public closeArguments(pArguments: IAFXInstruction[]): IAFXInstruction[];
        public _setFunctionDef(pFunctionDef: IAFXDeclInstruction): void;
        public _setImplementation(pImplementation: IAFXStmtInstruction): void;
        public _clone(pRelationMap?: IAFXInstructionMap): SystemFunctionInstruction;
        public _addOutVariable(pVariable: IAFXVariableDeclInstruction): boolean;
        public _getOutVariable(): IAFXVariableDeclInstruction;
        public _getVertexShader(): IAFXFunctionDeclInstruction;
        public _getPixelShader(): IAFXFunctionDeclInstruction;
        public _markUsedAs(eUsedType: EFunctionType): void;
        public _isUsedAs(eUsedType: EFunctionType): boolean;
        public _isUsedAsFunction(): boolean;
        public _isUsedAsVertex(): boolean;
        public _isUsedAsPixel(): boolean;
        public _markUsedInVertex(): void;
        public _markUsedInPixel(): void;
        public _isUsedInVertex(): boolean;
        public _isUsedInPixel(): boolean;
        public _isUsed(): boolean;
        public _checkVertexUsage(): boolean;
        public _checkPixelUsage(): boolean;
        public _checkDefenitionForVertexUsage(): boolean;
        public _checkDefenitionForPixelUsage(): boolean;
        public _canUsedAsFunction(): boolean;
        public _notCanUsedAsFunction(): void;
        public _addUsedFunction(pFunction: IAFXFunctionDeclInstruction): boolean;
        public _addUsedVariable(pVariable: IAFXVariableDeclInstruction): void;
        public _getUsedFunctionList(): IAFXFunctionDeclInstruction[];
        public _isBlackListFunction(): boolean;
        public _addToBlackList(): void;
        public _getStringDef(): string;
        public _convertToVertexShader(): IAFXFunctionDeclInstruction;
        public _convertToPixelShader(): IAFXFunctionDeclInstruction;
        public _prepareForVertex(): void;
        public _prepareForPixel(): void;
        public addUsedVariableType(pType: IAFXVariableTypeInstruction, eUsedMode: EVarUsedMode): boolean;
        public _generateInfoAboutUsedData(): void;
        public _getAttributeVariableMap(): IAFXVariableDeclMap;
        public _getVaryingVariableMap(): IAFXVariableDeclMap;
        public _getSharedVariableMap(): IAFXVariableDeclMap;
        public _getGlobalVariableMap(): IAFXVariableDeclMap;
        public _getUniformVariableMap(): IAFXVariableDeclMap;
        public _getForeignVariableMap(): IAFXVariableDeclMap;
        public _getTextureVariableMap(): IAFXVariableDeclMap;
        public _getUsedComplexTypeMap(): IAFXTypeMap;
        public _getAttributeVariableKeys(): number[];
        public _getVaryingVariableKeys(): number[];
        public _getSharedVariableKeys(): number[];
        public _getUniformVariableKeys(): number[];
        public _getForeignVariableKeys(): number[];
        public _getGlobalVariableKeys(): number[];
        public _getTextureVariableKeys(): number[];
        public _getUsedComplexTypeKeys(): number[];
        public _getExtSystemFunctionList(): IAFXFunctionDeclInstruction[];
        public _getExtSystemMacrosList(): IAFXSimpleInstruction[];
        public _getExtSystemTypeList(): IAFXTypeDeclInstruction[];
    }
}
declare module akra.fx.instructions {
    /**
    * Respresnt system_func(arg1,..., argn)
    * EMPTY_OPERATOR SimpleInstruction ... SimpleInstruction
    */
    class SystemCallInstruction extends ExprInstruction {
        private _pSystemFunction;
        private _pSamplerDecl;
        constructor();
        public _toFinalCode(): string;
        public setSystemCallFunction(pFunction: IAFXFunctionDeclInstruction): void;
        public _setInstructions(pInstructionList: IAFXInstruction[]): void;
        public fillByArguments(pArguments: IAFXInstruction[]): void;
        public _addUsedData(pUsedDataCollector: IAFXTypeUseInfoMap, eUsedMode?: EVarUsedMode): void;
        public _clone(pRelationMap?: IAFXInstructionMap): SystemCallInstruction;
    }
}
declare module akra.fx.instructions {
    class SystemTypeInstruction extends Instruction implements IAFXTypeInstruction {
        private _sName;
        private _sRealName;
        private _pElementType;
        private _iLength;
        private _iSize;
        private _pFieldDeclMap;
        private _bIsArray;
        private _bIsWritable;
        private _bIsReadable;
        private _pFieldNameList;
        private _pWrapVariableType;
        private _bIsBuiltIn;
        private _sDeclString;
        constructor();
        public toString(): string;
        public _toDeclString(): string;
        public _toFinalCode(): string;
        public _isBuiltIn(): boolean;
        public _setBuiltIn(isBuiltIn: boolean): void;
        public setDeclString(sDecl: string): void;
        public _isBase(): boolean;
        public _isArray(): boolean;
        public _isNotBaseArray(): boolean;
        public _isComplex(): boolean;
        public _isEqual(pType: IAFXTypeInstruction): boolean;
        public _isStrongEqual(pType: IAFXTypeInstruction): boolean;
        public _isConst(): boolean;
        public _isSampler(): boolean;
        public _isSamplerCube(): boolean;
        public _isSampler2D(): boolean;
        public _isWritable(): boolean;
        public _isReadable(): boolean;
        public _containArray(): boolean;
        public _containSampler(): boolean;
        public _containPointer(): boolean;
        public _containComplexType(): boolean;
        public _setName(sName: string): void;
        public setRealName(sRealName: string): void;
        public setSize(iSize: number): void;
        public _canWrite(isWritable: boolean): void;
        public _canRead(isReadable: boolean): void;
        public addIndex(pType: IAFXTypeInstruction, iLength: number): void;
        public addField(sFieldName: string, pType: IAFXTypeInstruction, isWrite?: boolean, sRealFieldName?: string): void;
        public _getName(): string;
        public _getRealName(): string;
        public _getHash(): string;
        public _getStrongHash(): string;
        public _getSize(): number;
        public _getBaseType(): IAFXTypeInstruction;
        public getVariableType(): IAFXVariableTypeInstruction;
        public _getArrayElementType(): IAFXTypeInstruction;
        public _getTypeDecl(): IAFXTypeDeclInstruction;
        public _getLength(): number;
        public _hasField(sFieldName: string): boolean;
        public _hasFieldWithSematic(sSemantic: string): boolean;
        public _hasAllUniqueSemantics(): boolean;
        public _hasFieldWithoutSemantic(): boolean;
        public _getField(sFieldName: string): IAFXVariableDeclInstruction;
        public _getFieldBySemantic(sSemantic: string): IAFXVariableDeclInstruction;
        public _getFieldType(sFieldName: string): IAFXVariableTypeInstruction;
        public _getFieldNameList(): string[];
        public _clone(pRelationMap?: IAFXInstructionMap): SystemTypeInstruction;
        public _blend(pType: IAFXTypeInstruction, eMode: EAFXBlendMode): IAFXTypeInstruction;
    }
}
declare module akra.fx.instructions {
    class TechniqueInstruction extends DeclInstruction implements IAFXTechniqueInstruction {
        private _sName;
        private _bHasComplexName;
        private _pParseNode;
        private _pSharedVariableListV;
        private _pSharedVariableListP;
        private _pPassList;
        private _bHasImportedTechniqueFromSameEffect;
        private _pImportedTechniqueList;
        private _pFullComponentList;
        private _pFullComponentShiftList;
        private _nTotalPasses;
        private _bIsPostEffect;
        private _bIsFinalize;
        constructor();
        public _setName(sName: string, isComplexName: boolean): void;
        public _getName(): string;
        public _setSemantic(sSemantic: string): void;
        public _hasComplexName(): boolean;
        public _isPostEffect(): boolean;
        public _getSharedVariablesForVertex(): IAFXVariableDeclInstruction[];
        public _getSharedVariablesForPixel(): IAFXVariableDeclInstruction[];
        public _addPass(pPass: IAFXPassInstruction): void;
        public _getPassList(): IAFXPassInstruction[];
        public _getPass(iPass: number): IAFXPassInstruction;
        public _totalOwnPasses(): number;
        public _totalPasses(): number;
        public _addTechniqueFromSameEffect(pTechnique: IAFXTechniqueInstruction, iShift: number): void;
        public _addComponent(pComponent: IAFXComponent, iShift: number): void;
        public _getFullComponentList(): IAFXComponent[];
        public _getFullComponentShiftList(): number[];
        public _checkForCorrectImports(): boolean;
        public _setGlobalParams(sProvideNameSpace: string, pGlobalImportList: IAFXImportedTechniqueInfo[]): void;
        public _finalize(pComposer: IAFXComposer): void;
        private generateListOfSharedVariables();
        private addSharedVariable(pVar, eType);
        private generateFullListOfComponent();
    }
}
declare module akra.fx.instructions {
    class TypeDeclInstruction extends DeclInstruction implements IAFXTypeDeclInstruction {
        constructor();
        public _getType(): IAFXTypeInstruction;
        public _clone(pRelationMap?: IAFXInstructionMap): IAFXTypeDeclInstruction;
        public _toFinalCode(): string;
        public _getName(): string;
        public _getRealName(): string;
        public _blend(pDecl: IAFXTypeDeclInstruction, eBlendMode: EAFXBlendMode): IAFXTypeDeclInstruction;
    }
}
declare module akra.fx.instructions {
    /**
    * Represent + - ! ++ -- expr
    * (+|-|!|++|--|) Instruction
    */
    class UnaryExprInstruction extends ExprInstruction {
        constructor();
        public _toFinalCode(): string;
        public _addUsedData(pUsedDataCollector: IAFXTypeUseInfoMap, eUsedMode?: EVarUsedMode): void;
        public _isConst(): boolean;
        public _evaluate(): boolean;
    }
}
declare module akra.fx.instructions {
    /**
    * Represent while(expr) stmt
    * ( while || do_while) ExprInstruction StmtInstruction
    */
    class WhileStmtInstruction extends StmtInstruction {
        constructor();
        public _toFinalCode(): string;
    }
}
declare module akra.fx {
    class Effect implements IAFXEffect {
        public guid: number;
        private _pComposer;
        private _pParseTree;
        private _pAnalyzedNode;
        private _pEffectScope;
        private _pCurrentInstruction;
        private _pCurrentFunction;
        private _pCurrentPass;
        private _bHaveCurrentFunctionReturnOccur;
        private _pStatistics;
        private _sAnalyzedFileName;
        private _pSystemMacros;
        private _pSystemTypes;
        private _pSystemFunctionsMap;
        private _pSystemFunctionHashMap;
        private _pSystemVariables;
        private _pPointerForExtractionList;
        private _pFunctionWithImplementationList;
        private _pTechniqueList;
        private _pTechniqueMap;
        private _isAnalyzeInPass;
        private _sProvideNameSpace;
        private _pImportedGlobalTechniqueList;
        private _pAddedTechniqueList;
        static pSystemMacros: IAFXSimpleInstructionMap;
        static pSystemTypes: IMap<instructions.SystemTypeInstruction>;
        static pSystemFunctions: IMap<instructions.SystemFunctionInstruction[]>;
        static pSystemVariables: IAFXVariableDeclMap;
        static pSystemVertexOut: instructions.ComplexTypeInstruction;
        constructor(pComposer: IAFXComposer);
        public analyze(pTree: parser.IParseTree): boolean;
        public getStats(): IAFXEffectStats;
        public setAnalyzedFileName(sFileName: string): void;
        public clear(): void;
        public getTechniqueList(): IAFXTechniqueInstruction[];
        static getBaseVertexOutType(): instructions.ComplexTypeInstruction;
        static getSystemType(sTypeName: string): instructions.SystemTypeInstruction;
        static getSystemVariable(sName: string): IAFXVariableDeclInstruction;
        static getSystemMacros(sName: string): IAFXSimpleInstruction;
        static findSystemFunction(sFunctionName: string, pArguments: IAFXTypedInstruction[]): IAFXFunctionDeclInstruction;
        static createVideoBufferVariable(): IAFXVariableDeclInstruction;
        static getExternalType(pType: IAFXTypeInstruction): any;
        static isMatrixType(pType: IAFXTypeInstruction): boolean;
        static isVectorType(pType: IAFXTypeInstruction): boolean;
        static isScalarType(pType: IAFXTypeInstruction): boolean;
        static isFloatBasedType(pType: IAFXTypeInstruction): boolean;
        static isIntBasedType(pType: IAFXTypeInstruction): boolean;
        static isBoolBasedType(pType: IAFXTypeInstruction): boolean;
        static isSamplerType(pType: IAFXTypeInstruction): boolean;
        private generateSuffixLiterals(pLiterals, pOutput, iDepth?);
        private initSystemMacros();
        private initSystemTypes();
        private initSystemFunctions();
        private initSystemVariables();
        private addSystemMacros();
        private addSystemVariables();
        private generateSystemVariable(sName, sRealName, sTypeName, isForVertex, isForPixel, isOnlyRead);
        private generatePassEngineVariable();
        private generateBaseVertexOutput();
        private addSystemFunctions();
        private generateSystemFunction(sName, sTranslationExpr, sReturnTypeName, pArgumentsTypes, pTemplateTypes, isForVertex?, isForPixel?);
        private generateSystemMacros(sMacrosName, sMacrosCode);
        private generateNotBuiltInSystemFuction(sName, sDefenition, sImplementation, sReturnType, pUsedTypes, pUsedFunctions, pUsedMacros);
        private generateSystemType(sName, sRealName, iSize?, isArray?, pElementType?, iLength?);
        private generateNotBuildtInSystemType(sName, sRealName, sDeclString, iSize?, isArray?, pElementType?, iLength?);
        private addSystemTypeScalar();
        private addSystemTypeVector();
        private addSystemTypeMatrix();
        private addFieldsToVectorFromSuffixObject(pSuffixMap, pType, sBaseType);
        private getVariable(sName);
        private hasVariable(sName);
        private getType(sTypeName);
        private isSystemFunction(pFunction);
        private isSystemVariable(pVariable);
        private isSystemType(pType);
        private _errorFromInstruction(pError);
        private _error(eCode, pInfo?);
        private setAnalyzedNode(pNode);
        private getAnalyzedNode();
        private isStrictMode();
        private setStrictModeOn();
        private newScope(eScopeType?);
        private resumeScope();
        private getScope();
        private setScope(iScope);
        private endScope();
        private getScopeType();
        private setCurrentAnalyzedFunction(pFunction);
        private setCurrentAnalyzedPass(pPass);
        private getCurrentAnalyzedFunction();
        private getCurrentAnalyzedPass();
        private isAnalzeInPass();
        private setAnalyzeInPass(isInPass);
        private setOperator(sOperator);
        private clearPointersForExtract();
        private addPointerForExtract(pPointer);
        private getPointerForExtractList();
        private findFunction(sFunctionName, pArguments);
        private findConstructor(pType, pArguments);
        private findShaderFunction(sFunctionName, pArguments);
        private findFunctionByDef(pDef);
        private addVariableDecl(pVariable);
        private addTypeDecl(pType);
        private addFunctionDecl(pFunction);
        private addTechnique(pTechnique);
        private addExternalSharedVariable(pVariable, eShaderType);
        private analyzeGlobalUseDecls();
        private analyzeGlobalProvideDecls();
        private analyzeGlobalTypeDecls();
        private analyzeFunctionDefinitions();
        private analyzeGlobalImports();
        private analyzeTechniqueImports();
        private analyzeVariableDecls();
        private analyzeFunctionDecls();
        private analyzeTechniques();
        private checkFunctionsForRecursion();
        private checkFunctionForCorrectUsage();
        private generateInfoAboutUsedData();
        private generateShadersFromFunctions();
        private analyzeVariableDecl(pNode, pInstruction?);
        private analyzeUsageType(pNode);
        private analyzeType(pNode);
        private analyzeUsage(pNode);
        private analyzeVariable(pNode, pGeneralType);
        private analyzeVariableDim(pNode, pVariableDecl);
        private analyzeAnnotation(pNode);
        private analyzeSemantic(pNode);
        private analyzeInitializer(pNode);
        private analyzeFromExpr(pNode);
        private analyzeInitExpr(pNode);
        private analyzeExpr(pNode);
        private analyzeObjectExpr(pNode);
        private analyzeCompileExpr(pNode);
        private analyzeSamplerStateBlock(pNode);
        private analyzeSamplerState(pNode, pSamplerStates);
        private analyzeComplexExpr(pNode);
        private analyzeFunctionCallExpr(pNode);
        private analyzeConstructorCallExpr(pNode);
        private analyzeSimpleComplexExpr(pNode);
        private analyzePrimaryExpr(pNode);
        private analyzePostfixExpr(pNode);
        private analyzePostfixIndex(pNode);
        private analyzePostfixPoint(pNode);
        private analyzePostfixArithmetic(pNode);
        private analyzeUnaryExpr(pNode);
        private analyzeCastExpr(pNode);
        private analyzeConditionalExpr(pNode);
        private analyzeArithmeticExpr(pNode);
        private analyzeRelationExpr(pNode);
        private analyzeLogicalExpr(pNode);
        private analyzeAssignmentExpr(pNode);
        private analyzeIdExpr(pNode);
        private analyzeSimpleExpr(pNode);
        private analyzeMemExpr(pNode);
        private analyzeConstTypeDim(pNode);
        private analyzeVarStructDecl(pNode, pInstruction?);
        private analyzeUsageStructDecl(pNode);
        private analyzeTypeDecl(pNode, pParentInstruction?);
        private analyzeStructDecl(pNode);
        private analyzeStruct(pNode);
        private analyzeFunctionDeclOnlyDefinition(pNode);
        private resumeFunctionAnalysis(pAnalzedFunction);
        private analyzeFunctionDef(pNode);
        private analyzeParamList(pNode, pFunctionDef);
        private analyzeParameterDecl(pNode);
        private analyzeParamUsageType(pNode);
        private analyzeStmtBlock(pNode);
        private analyzeStmt(pNode);
        private analyzeSimpleStmt(pNode);
        private analyzeReturnStmt(pNode);
        private analyzeBreakStmt(pNode);
        private analyzeDeclStmt(pNode);
        private analyzeExprStmt(pNode);
        private analyzeWhileStmt(pNode);
        private analyzeIfStmt(pNode);
        private analyzeNonIfStmt(pNode);
        private analyzeForStmt(pNode);
        private analyzeForInit(pNode, pForStmtInstruction);
        private analyzeForCond(pNode, pForStmtInstruction);
        private analyzeForStep(pNode, pForStmtInstruction);
        private analyzeUseDecl(pNode);
        private analyzeTechniqueForImport(pNode);
        private analyzeComplexName(pNode);
        private analyzeTechniqueBodyForImports(pNode, pTechnique);
        private analyzePassDeclForImports(pNode, pTechnique);
        private analyzePassStateBlockForShaders(pNode, pPass);
        private analyzePassStateForShader(pNode, pPass);
        private analyzePassStateIfForShader(pNode, pPass);
        private analyzePassStateSwitchForShader(pNode, pPass);
        private analyzePassCaseBlockForShader(pNode, pPass);
        private analyzePassCaseStateForShader(pNode, pPass);
        private analyzePassDefaultStateForShader(pNode, pPass);
        private resumeTechniqueAnalysis(pTechnique);
        private resumePassAnalysis(pPass);
        private analyzePassStateBlock(pNode, pPass);
        private analyzePassState(pNode, pPass);
        private getRenderState(sState);
        private getRenderStateValue(eState, sValue);
        private analyzePassStateIf(pNode, pPass);
        private analyzePassStateSwitch(pNode, pPass);
        private analyzePassCaseBlock(pNode, pPass);
        private analyzePassCaseState(pNode, pPass);
        private analyzePassDefault(pNode, pPass);
        private analyzeImportDecl(pNode, pTechnique?);
        private analyzeProvideDecl(pNode);
        private analyzeShiftOpt(pNode);
        private addComponent(pComponent, iShift, pTechnique);
        private isAddedTechnique(pTechnique);
        /**
        * Проверят возможность использования оператора между двумя типами.
        * Возращает тип получаемый в результате приминения опрератора, или, если применить его невозможно - null.
        *
        * @sOperator {string} Один из операторов: + - * / % += -= *= /= %= = < > <= >= == != =
        * @pLeftType {IAFXVariableTypeInstruction} Тип левой части выражения
        * @pRightType {IAFXVariableTypeInstruction} Тип правой части выражения
        */
        private checkTwoOperandExprTypes(sOperator, pLeftType, pRightType);
        /**
        * Проверят возможность использования оператора к типу данных.
        * Возращает тип получаемый в результате приминения опрератора, или, если применить его невозможно - null.
        *
        * @sOperator {string} Один из операторов: + - ! ++ --
        * @pLeftType {IAFXVariableTypeInstruction} Тип операнда
        */
        private checkOneOperandExprType(sOperator, pType);
        private isAssignmentOperator(sOperator);
        private isArithmeticalOperator(sOperator);
        private isRelationalOperator(sOperator);
        private isEqualOperator(sOperator);
        private addExtactionStmts(pStmt);
        private generateExtractStmtFromPointer(pPointer, pParentStmt);
        private generateExtractStmtForComplexVar(pVarDecl, pParentStmt, pPointer, pBuffer, iPadding);
        private getNodeSourceLocation(pNode);
        private checkInstruction(pInst, eStage);
    }
}
declare module akra.fx.instructions {
    class VariableDeclInstruction extends DeclInstruction implements IAFXVariableDeclInstruction {
        private _bIsVideoBuffer;
        private _pVideoBufferSampler;
        private _pVideoBufferHeader;
        private _pFullNameExpr;
        private _bDefineByZero;
        private _pSubDeclList;
        private _bShaderOutput;
        private _pAttrOffset;
        private _pAttrExtractionBlock;
        private _pValue;
        private _pDefaultValue;
        private _bLockInitializer;
        private _iNameIndex;
        static pShaderVarNamesGlobalDictionary: stringUtils.StringDictionary;
        static _getIndex(sName: string): number;
        /**
        * Represent type var_name [= init_expr]
        * EMPTY_OPERATOR VariableTypeInstruction IdInstruction InitExprInstruction
        */
        constructor();
        public _hasInitializer(): boolean;
        public _getInitializeExpr(): IAFXInitExprInstruction;
        public _hasConstantInitializer(): boolean;
        public _lockInitializer(): void;
        public _unlockInitializer(): void;
        public _getDefaultValue(): any;
        public _prepareDefaultValue(): void;
        public _getValue(): any;
        public _setValue(pValue: any): any;
        public _getType(): IAFXVariableTypeInstruction;
        public _setType(pType: IAFXVariableTypeInstruction): void;
        public _setName(sName: string): void;
        public _setRealName(sRealName: string): void;
        public _setVideoBufferRealName(sSampler: string, sHeader: string): void;
        public _getName(): string;
        public _getRealName(): string;
        public _getNameId(): IAFXIdInstruction;
        public _isUniform(): boolean;
        public _isField(): boolean;
        public _isPointer(): boolean;
        public _isVideoBuffer(): boolean;
        public _isSampler(): boolean;
        public _getSubVarDecls(): IAFXVariableDeclInstruction[];
        public _isDefinedByZero(): boolean;
        public _defineByZero(isDefine: boolean): void;
        public _toFinalCode(): string;
        public _markAsVarying(bValue: boolean): void;
        public _markAsShaderOutput(isShaderOutput: boolean): void;
        public _isShaderOutput(): boolean;
        public _setAttrExtractionBlock(pCodeBlock: IAFXInstruction): void;
        public _getAttrExtractionBlock(): IAFXInstruction;
        public _getNameIndex(): number;
        public _getFullNameExpr(): IAFXExprInstruction;
        public _getFullName(): string;
        public _getVideoBufferSampler(): IAFXVariableDeclInstruction;
        public _getVideoBufferHeader(): IAFXVariableDeclInstruction;
        public _getVideoBufferInitExpr(): IAFXInitExprInstruction;
        public _setCollapsed(bValue: boolean): void;
        public _isCollapsed(): boolean;
        public _clone(pRelationMap?: IAFXInstructionMap): IAFXVariableDeclInstruction;
        public _blend(pVariableDecl: IAFXVariableDeclInstruction, eMode: EAFXBlendMode): IAFXVariableDeclInstruction;
    }
}
declare module akra.fx {
    class SamplerBlender {
        public _pSlotList: util.ObjectArray<IAFXVariableDeclInstruction>[];
        public _nActiveSlots: number;
        public _pIdToSlotMap: IMap<number>;
        public _pIdList: number[];
        public getSlots(): util.ObjectArray<IAFXVariableDeclInstruction>[];
        public getTotalActiveSlots(): number;
        constructor();
        public getSamplersBySlot(iSlot: number): util.ObjectArray<IAFXVariableDeclInstruction>;
        public clear(): void;
        public clearSamplerNames(): void;
        public addTextureSlot(id: number): void;
        public addObjectToSlotById(pObject: any, id: number): void;
        public addObjectToSlotIdAuto(pObject: any, id: number): void;
        public getHash(): string;
        /** @const */
        static ZERO_SLOT: number;
    }
}
declare module akra.fx {
    class PassInputBlend implements IAFXPassInputBlend {
        public guid: number;
        public _pCreator: IAFXComponentPassInputBlend;
        private _iLastPassBlendId;
        private _iLastShaderId;
        private _pMaterialContainer;
        private _nLastSufraceMaterialTextureUpdates;
        private _nLastSamplerUpdates;
        private _pLastSurfaceMaterial;
        private _isFirstSetSurfaceNaterial;
        private _pMaterialNameIndices;
        private _pStatesInfo;
        public samplers: IAFXSamplerStateMap;
        public samplerArrays: IAFXSamplerStateListMap;
        public samplerArrayLength: IMap<number>;
        public uniforms: any;
        public foreigns: any;
        public textures: any;
        public samplerKeys: number[];
        public samplerArrayKeys: number[];
        public uniformKeys: number[];
        public foreignKeys: number[];
        public textureKeys: number[];
        public renderStates: IMap<ERenderStateValues>;
        public getStatesInfo(): IAFXPassInputStateInfo;
        constructor(pCreator: IAFXComponentPassInputBlend);
        public hasUniform(sName: string): boolean;
        public hasTexture(sName: string): boolean;
        public hasForeign(sName: string): boolean;
        public setUniform(sName: string, pValue: any): void;
        public setTexture(sName: string, pValue: any): void;
        public setForeign(sName: string, pValue: any): void;
        public setSampler(sName: string, pValue: IAFXSamplerState): void;
        public setSamplerArray(sName: string, pValue: IAFXSamplerState[]): void;
        public setSamplerTexture(sName: string, sTexture: string): void;
        public setSamplerTexture(sName: string, pTexture: ITexture): void;
        public _setSamplerTextureObject(sName: string, pTexture: ITexture): void;
        public setStruct(sName: string, pValue: any): void;
        public setSurfaceMaterial(pSurfaceMaterial: ISurfaceMaterial): void;
        public setRenderState(eState: ERenderStates, eValue: ERenderStateValues): void;
        public _getForeignVarNameIndex(sName: string): number;
        public _getForeignVarNameByIndex(iNameIndex: number): string;
        public _getUniformVarNameIndex(sName: string): number;
        public _getUniformVar(iNameIndex: number): IAFXVariableDeclInstruction;
        public _getUniformVarNameByIndex(iNameIndex: number): string;
        public _getUniformLength(iNameIndex: number): number;
        public _getUniformType(iNameIndex: number): EAFXShaderVariableType;
        public _getSamplerState(iNameIndex: number): IAFXSamplerState;
        public _getSamplerTexture(iNameIndex: number): ITexture;
        public _getTextureForSamplerState(pSamplerState: IAFXSamplerState): ITexture;
        public _release(): void;
        public _isFromSameBlend(pInput: IAFXPassInputBlend): boolean;
        public _getBlend(): IAFXComponentPassInputBlend;
        public _copyFrom(pInput: IAFXPassInputBlend): void;
        public _copyUniformsFromInput(pInput: IAFXPassInputBlend): void;
        public _copySamplersFromInput(pInput: IAFXPassInputBlend): void;
        public _copyForeignsFromInput(pInput: IAFXPassInputBlend): void;
        public _copyRenderStatesFromInput(pInput: IAFXPassInputBlend): void;
        public _getLastPassBlendId(): number;
        public _getLastShaderId(): number;
        public _setPassBlendId(id: number): void;
        public _setShaderId(id: number): void;
        private init();
        private isVarArray(pVar);
        private clearSamplerState(pState);
        private _setSamplerTextureObjectByIndex(iNameIndex, pTexture);
        private copySamplerState(pFrom, pTo);
    }
}
declare module akra.sort {
    function minMax(a: number, b: number): number;
    function maxMin(a: number, b: number): number;
    /**
    * Search In Sort Array
    */
    function binary<T>(array: T[], value: T): number;
}
declare module akra.fx {
    class VariableContainer implements IAFXVariableContainer {
        private _pNameToIndexMap;
        private _pRealNameToIndexMap;
        private _pIndexList;
        private _pVariableInfoMap;
        private _bLock;
        constructor();
        public getIndices(): number[];
        public add(pVar: IAFXVariableDeclInstruction): void;
        public addSystemEntry(sName: string, eType: EAFXShaderVariableType): void;
        public finalize(): void;
        public getVarInfoByIndex(iIndex: number): IAFXVariableInfo;
        public getVarByIndex(iIndex: number): IAFXVariableDeclInstruction;
        public getTypeByIndex(iIndex: number): EAFXShaderVariableType;
        public isArrayVariable(iIndex: number): boolean;
        public getIndexByName(sName: string): number;
        public getIndexByRealName(sName: string): number;
        public hasVariableWithName(sName: string): boolean;
        public hasVariableWithRealName(sName: string): boolean;
        public getVarByName(sName: string): IAFXVariableDeclInstruction;
        public getVarByRealName(sName: string): IAFXVariableDeclInstruction;
        private static _pDefaultValuesForTypes;
        static getVariableDefaultValue(pVar: IAFXVariableDeclInstruction): any;
        static getVariableType(pVar: IAFXVariableDeclInstruction): EAFXShaderVariableType;
    }
}
declare module akra.fx {
    class ComponentPassInputBlend implements IAFXComponentPassInputBlend {
        private _pUniformsContainer;
        private _pForeignsContainer;
        private _pTexturesContainer;
        private _pFreePassInputBlendList;
        public getUniforms(): IAFXVariableContainer;
        public getTextures(): IAFXVariableContainer;
        public getForeigns(): IAFXVariableContainer;
        constructor();
        public addDataFromPass(pPass: IAFXPassInstruction): void;
        public finalizeInput(): void;
        public getPassInput(): IAFXPassInputBlend;
        public releasePassInput(pInput: IAFXPassInputBlend): void;
        private addUniformVariable(pVariable, sPrevName, sPrevRealName);
        private generateNewPassInputs(nCount?);
    }
}
declare module akra.fx {
    class ComponentBlend implements IAFXComponentBlend {
        public guid: number;
        private _pComposer;
        private _isReady;
        private _sHash;
        private _bNeedToUpdateHash;
        private _pComponentHashMap;
        private _pAddedComponentInfoList;
        private _iShiftMin;
        private _iShiftMax;
        private _nTotalPasses;
        private _pPassTypesList;
        private _bHasPostEffectPass;
        private _pPassesDList;
        private _pComponentInputVarBlend;
        constructor(pComposer: IAFXComposer);
        public _getMinShift(): number;
        public _getMaxShift(): number;
        public isReadyToUse(): boolean;
        public isEmpty(): boolean;
        public getComponentCount(): number;
        public getTotalPasses(): number;
        public hasPostEffect(): boolean;
        public getPassTypes(): EPassTypes[];
        public getHash(): string;
        public containComponent(pComponent: IAFXComponent, iShift: number, iPass: number): boolean;
        public containComponentHash(sComponentHash: string): boolean;
        public findAnyAddedComponentInfo(pComponent: IAFXComponent, iShift: number, iPass: number): IAFXComponentInfo;
        public addComponent(pComponent: IAFXComponent, iShift: number, iPass: number): void;
        public removeComponent(pComponent: IAFXComponent, iShift: number, iPass: number): void;
        public finalizeBlend(): boolean;
        public getPassInputForPass(iPass: number): IAFXPassInputBlend;
        public getPassListAtPass(iPass: number): IAFXPassInstruction[];
        public clone(): IAFXComponentBlend;
        public _getComponentInfoList(): IAFXComponentInfo[];
        public _setDataForClone(pComponentInfoList: IAFXComponentInfo[], pComponentHashMap: IMap<boolean>, iShiftMin: number, iShiftMax: number): void;
        private calcHash();
        static EMPTY_BLEND: string;
    }
}
declare module akra.stringUtils {
    class StringMinifier {
        private _pMinMap;
        private _nCount;
        public minify(sValue: string): number;
    }
}
declare module akra.fx {
    /**
    * Use for fast and simple find element by ordered parts of complex uint key. Use when you can split you key for independent parts.
    * For example, we can fully described fx.Maker by combination of foreigns, sampler, buffers and material.
    * So if we create unique keys for those parameters we can easly create unique key for maker.
    * And we can not store all this parts of keys in uint variable or in string hash.
    * But if each part can be greater than 256, we can not use single uint variable.
    * And string hash is not very fast. So we can use HashTree<T>, it`s pretty fast ant easy to use.
    * Some code for example:
    * var pMaker: IAFXMaker = this._pFXMakerHashTree.next(iForeignPartHash)
    *                                               .next(iSamplerPartHash)
    *                                               .next(iMaterialPartHash)
    *                                               .next(iBufferPartHash)
    *                                               .getContent();
    */
    class HashTree<T> {
        /** Root entry */
        private _pRoot;
        /** Current entry */
        private _pCurrent;
        /** Sort function */
        private _fnSort;
        constructor();
        public has(iValue: number): boolean;
        public next(iValue: number): HashTree<T>;
        public release(): void;
        public addContent(pContent: T): void;
        public getContent(): T;
        private static binarySearchInSortArray<T>(pArray, iValue);
    }
}
declare module akra {
    interface ICodec {
        getType(): string;
        getDataType(): string;
        magicNumberMatch(pMagicNumber: Uint8Array): boolean;
        magicNumberToFileExt(pMagicNumber: Uint8Array): string;
        code(pInput: Uint8Array, pData: ICodecData): Uint8Array;
        decode(pData: Uint8Array, pCodecData: ICodecData): Uint8Array;
    }
    interface ICodecData {
        getDataType(): string;
    }
}
declare module akra {
    interface IImgCodec extends ICodec {
    }
    interface IImgData extends ICodecData {
        getHeight(): number;
        setHeight(iHeight: number): void;
        getWidth(): number;
        setWidth(iWidth: number): void;
        getDepth(): number;
        setDepth(iDepth: number): void;
        getNumMipMaps(): number;
        setNumMipMaps(nMipMaps: number): void;
        getFlags(): number;
        setFlags(iFlags: number): void;
        getCubeFlags(): number;
        setCubeFlags(iFlags: number): void;
        getFormat(): EPixelFormats;
        setFormat(eFormat: EPixelFormats): void;
        getSize(): number;
        getNumFace(): number;
    }
}
declare module akra.pixelUtil {
    class Codec implements ICodec {
        private static _pMapCodecs;
        static registerCodec(pCodec: ICodec): void;
        static isCodecRegistered(pCodec: ICodec): boolean;
        static unRegisterCodec(pCodec: ICodec): void;
        static getExtension(): string[];
        static getCodec(sExt: string): ICodec;
        static getCodec(pMagicNumber: Uint8Array): ICodec;
        public magicNumberMatch(pMagicNumber: Uint8Array): boolean;
        public magicNumberToFileExt(pMagicNumber: Uint8Array): string;
        public getType(): string;
        public getDataType(): string;
        public code(pInput: Uint8Array, pData: ICodecData): Uint8Array;
        public decode(pData: Uint8Array, pCodecData: ICodecData): Uint8Array;
    }
}
declare module akra.pixelUtil {
    class ImgCodec extends Codec implements IImgCodec {
        public getDataType(): string;
    }
}
declare module akra.pixelUtil {
    class CodecData implements ICodecData {
        public getDataType(): string;
    }
}
declare module akra.pixelUtil {
    class ImgData extends CodecData implements IImgData {
        public _iHeight: number;
        public _iWidth: number;
        public _iDepth: number;
        public _iSize: number;
        public _iCubeFlags: number;
        public _nMipMaps: number;
        public _iFlags: number;
        public _eFormat: EPixelFormats;
        public getWidth(): number;
        public setWidth(iWidth: number): void;
        public getHeight(): number;
        public setHeight(iHeight: number): void;
        public getDepth(): number;
        public setDepth(iDepth: number): void;
        public getNumMipMaps(): number;
        public setNumMipMaps(nNumMipMaps: number): void;
        public getFormat(): EPixelFormats;
        public setFormat(ePixelFormat: EPixelFormats): void;
        public getFlags(): number;
        public setFlags(iFlags: number): void;
        public getCubeFlags(): number;
        public setCubeFlags(iFlags: number): void;
        public getSize(): number;
        public getNumFace(): number;
        public getDataType(): string;
    }
}
declare module akra.pool.resources {
    class Img extends ResourcePoolItem implements IImg {
        public _iWidth: number;
        public _iHeight: number;
        public _iDepth: number;
        public _nMipMaps: number;
        public _iFlags: number;
        public _iCubeFlags: number;
        public _eFormat: EPixelFormats;
        public _pBuffer: Uint8Array;
        public getByteLength(): number;
        public getWidth(): number;
        public getHeight(): number;
        public getDepth(): number;
        public getNumFaces(): number;
        public getNumMipMaps(): number;
        public getFormat(): EPixelFormats;
        public getFlags(): number;
        public getCubeFlags(): number;
        constructor();
        public createResource(): boolean;
        public destroyResource(): boolean;
        public restoreResource(): boolean;
        public disableResource(): boolean;
        public loadResource(sFilename?: string): boolean;
        public saveResource(sFilename?: string): boolean;
        public create(iWidth: number, iHeight: number, iDepth?: number, eFormat?: EPixelFormats, nFaces?: number, nMipMaps?: number): IImg;
        public freeMemory(): void;
        public set(pSrc: IImg): IImg;
        private loadImageWithInternalFormatFromURL(sPath, sExt, cb?);
        public load(sFileName: string, cb?: (e: Error) => void): IImg;
        public load(pData: Uint8Array, sType?: string, cb?: (e: Error) => void): IImg;
        public load(pCanvas: HTMLCanvasElement, cb?: (e: Error) => void): IImg;
        public loadRawData(pData: Uint8Array, iWidth: number, iHeight: number, iDepth?: number, eFormat?: EPixelFormats, nFaces?: number, nMipMaps?: number): IImg;
        public loadDynamicImage(pData: Uint8Array, iWidth: number, iHeight: number, iDepth?: number, eFormat?: EPixelFormats, nFaces?: number, nMipMaps?: number): IImg;
        public convert(eFormat: EPixelFormats): boolean;
        public getRawSpan(): number;
        public getBPP(): number;
        public getPixelSize(): number;
        public getData(): Uint8Array;
        public hasFlag(eFlag: EImageFlags): boolean;
        public hasAlpha(): boolean;
        public isCompressed(): boolean;
        public isLuminance(): boolean;
        public getColorAt(pColor: IColor, x: number, y: number, z?: number): IColor;
        public setColorAt(pColor: IColor, x: number, y: number, z?: number): void;
        public getPixels(iFace?: number, iMipMap?: number): IPixelBox;
        public scale(pDest: IPixelBox, eFilter?: EFilters): boolean;
        public resize(iWidth: number, iHeight: number, eFilter?: EFilters): boolean;
        public generatePerlinNoise(fScale: number, iOctaves: number, fFalloff: number): void;
        public randomChannelNoise(iChannel: number, iMinRange: number, iMaxRange: number): void;
        static calculateSize(nMipMaps: number, nFaces: number, iWidth: number, iHeight: number, iDepth: number, eFormat: EPixelFormats): number;
        static isInternalImageFormat(sExt: string): boolean;
        static decodeImageWithInternalFormatFromURL(sPath: string, sExt: string, cb: (e: Error, pData: Uint8Array, iWidth: number, iHeight: number, iDepth: number, eFormat: EPixelFormats) => void): void;
        static getMaxMipmaps(iWidth: number, iHeight: number, iDepth: number, eFormat: EPixelFormats): number;
    }
}
declare module akra.pool.resources {
    enum ETextureForcedFormatFlags {
        FORCEMIPLEVELS = 0,
        FORCEFORMAT = 1,
        FORCESIZE = 2,
    }
    class Texture extends ResourcePoolItem implements ITexture {
        public _iFlags: number;
        public _iWidth: number;
        public _iHeight: number;
        public _iDepth: number;
        public _eFormat: EPixelFormats;
        public _nMipLevels: number;
        public _nRequestedMipLevels: number;
        public _eTextureType: ETextureTypes;
        public _pParams: IMap<number>;
        public _isInternalResourceCreated: boolean;
        public _isMipmapsHardwareGenerated: boolean;
        constructor();
        public getWidth(): number;
        public getHeight(): number;
        public getDepth(): number;
        public getFormat(): EPixelFormats;
        public getTextureType(): ETextureTypes;
        public getMipLevels(): number;
        public getByteLength(): number;
        public getFlags(): number;
        public setFlags(iFlags: ETextureFlags): void;
        public isTexture2D(): boolean;
        public isTextureCube(): boolean;
        public isCompressed(): boolean;
        public isValid(): boolean;
        public getNumFaces(): number;
        public getSize(): number;
        public unwrapCubeTexture(pCubeTex: ITexture): boolean;
        public reset(): void;
        public reset(iSize: number): void;
        public reset(iWidth: number, iHeight: number): void;
        public getBuffer(iFace?: number, iMipmap?: number): IPixelBuffer;
        public create(iWidth: number, iHeight: number, iDepth: number, cFillColor?: IColor, eFlags?: ETextureFlags, nMipLevels?: number, nFaces?: number, eTextureType?: ETextureTypes, eFormat?: EPixelFormats): boolean;
        public create(iWidth: number, iHeight: number, iDepth: number, pPixels?: any[], eFlags?: ETextureFlags, nMipLevels?: number, nFaces?: number, eTextureType?: ETextureTypes, eFormat?: EPixelFormats): boolean;
        public create(iWidth: number, iHeight: number, iDepth: number, pPixels?: ArrayBufferView, eFlags?: ETextureFlags, nMipLevels?: number, nFaces?: number, eTextureType?: ETextureTypes, eFormat?: EPixelFormats): boolean;
        public loadResource(sFilename?: string): boolean;
        public _onImageLoad(pImage: IImg): void;
        public destroyResource(): boolean;
        public setFilter(eParam: ETextureParameters, eValue: ETextureFilters): boolean;
        public setWrapMode(eParam: ETextureParameters, eValue: ETextureWrapModes): boolean;
        public getFilter(eParam: ETextureParameters): ETextureFilters;
        public getWrapMode(eParam: ETextureParameters): ETextureWrapModes;
        public _setFilterInternalTexture(eParam: ETextureParameters, eValue: ETextureFilters): boolean;
        public _setWrapModeInternalTexture(eParam: ETextureParameters, eValue: ETextureWrapModes): boolean;
        public _getFilterInternalTexture(eParam: ETextureParameters): ETextureFilters;
        public _getWrapModeInternalTexture(eParam: ETextureParameters): ETextureWrapModes;
        public loadRawData(pData: Uint8Array, iWidth: number, iHeight: number, iDepth?: number, eFormat?: EPixelFormats, nFaces?: number, nMipMaps?: number): boolean;
        public loadImage(pImage: IImg): boolean;
        public loadImages(pImages: string[]): boolean;
        public loadImages(pImages: IImg[]): boolean;
        private _loadImages(pImageList);
        public convertToImage(pDestImage: IImg, bIncludeMipMaps: boolean): void;
        public copyToTexture(pTarget: ITexture): void;
        public createInternalTexture(cFillColor?: IColor): boolean;
        public freeInternalTexture(): boolean;
        public _createInternalTextureImpl(cFillColor?: IColor): boolean;
        public freeInternalTextureImpl(): boolean;
        public setPixelRGBA(i1: number, i2: number, iTextureWidth: number, iTextureHeight: number, pBuffer: Uint8Array): void;
    }
}
declare module akra.pool.resources {
    class SurfaceMaterial extends ResourcePoolItem implements ISurfaceMaterial {
        public _pMaterial: IMaterial;
        public _nTotalTextures: number;
        public _iTextureFlags: number;
        public _iTextureMatrixFlags: number;
        public _pTextures: ITexture[];
        public _pTexcoords: number[];
        public _pTextureMatrices: IMat4[];
        public _nTextureUpdates: number;
        public _nTexcoordUpdates: number;
        public notifyAltered(): void;
        public getTotalUpdatesOfTextures(): number;
        public getTotalUpdatesOfTexcoords(): number;
        public getTotalTextures(): number;
        public getTextureFlags(): number;
        public getTextureMatrixFlags(): number;
        public getMaterial(): IMaterial;
        public setMaterial(pMaterial: IMaterial): void;
        constructor();
        public createResource(): boolean;
        public setTexture(iIndex: number, iTextureHandle: number, iTexcoord?: number): boolean;
        public setTexture(iIndex: number, sTexture: string, iTexcoord?: number): boolean;
        public setTexture(iIndex: number, pTexture: ITexture, iTexcoord?: number): boolean;
        public setTextureMatrix(iIndex: number, m4fValue: IMat4): boolean;
        public isEqual(pSurfaceMaterial: ISurfaceMaterial): boolean;
        public texture(iSlot: number): ITexture;
        public texcoord(iSlot: number): number;
        public textureMatrix(iSlot: number): IMat4;
        static MAX_TEXTURES_PER_SURFACE: number;
    }
}
declare module akra.fx {
    class TexcoordSwapper {
        public _pTmpToTex: string[];
        public _pTexToTmp: string[];
        public _pTexcoords: number[];
        public _sTmpToTexCode: string;
        public _sTexToTmpCode: string;
        public _iMaxTexcoords: number;
        constructor();
        public getTmpDeclCode(): string;
        public getTecoordSwapCode(): string;
        public clear(): void;
        public generateSwapCode(pMaterial: ISurfaceMaterial, pAttrConatiner: IAFXAttributeBlendContainer): void;
    }
}
declare module akra.fx {
    class VariableBlendContainer {
        public _pVarBlendInfoList: IAFXVariableBlendInfo[];
        public _pNameToIndexMap: IMap<number>;
        public _pNameIndexToIndexMap: IMap<number>;
        public getVarsInfo(): IAFXVariableBlendInfo[];
        public getVarBlenInfo(iIndex: number): IAFXVariableBlendInfo;
        public getVarList(iIndex: number): IAFXVariableDeclInstruction[];
        public getBlendType(iIndex: number): IAFXVariableTypeInstruction;
        public getKeyIndexByName(sName: string): number;
        public getKeyIndexByNameIndex(iNameIndex: number): number;
        public hasVariableWithName(sName: string): boolean;
        public hasVariableWithNameIndex(iNameIndex: number): boolean;
        public hasVariable(pVar: IAFXVariableDeclInstruction): boolean;
        public getVariable(iIndex: number): IAFXVariableDeclInstruction;
        public getVariableByName(sName: string): IAFXVariableDeclInstruction;
        public getVariableByNameIndex(iNameIndex: number): IAFXVariableDeclInstruction;
        constructor();
        public addVariable(pVariable: IAFXVariableDeclInstruction, eBlendMode: EAFXBlendMode): boolean;
        public getDeclCodeForVar(iIndex: number, bWithInitializer: boolean): string;
        public forEach(iIndex: number, fnModifier: (pVar: IAFXVariableDeclInstruction) => void): void;
        public setNameForEach(iIndex: number, sNewRealName: string): void;
    }
}
declare module akra.data {
    var Usages: {
        "POSITION": string;
        "POSITION1": string;
        "POSITION2": string;
        "POSITION3": string;
        "BLENDWEIGHT": string;
        "BLENDINDICES": string;
        "BLENDMETA": string;
        "NORMAL": string;
        "NORMAL1": string;
        "NORMAL2": string;
        "NORMAL3": string;
        "PSIZE": string;
        "TEXCOORD": string;
        "TEXCOORD1": string;
        "TEXCOORD2": string;
        "TEXCOORD3": string;
        "TEXCOORD4": string;
        "TEXCOORD5": string;
        "TANGENT": string;
        "BINORMAL": string;
        "TESSFACTOR": string;
        "COLOR": string;
        "FOG": string;
        "DEPTH": string;
        "SAMPLE": string;
        "INDEX": string;
        "INDEX0": string;
        "INDEX1": string;
        "INDEX2": string;
        "INDEX3": string;
        "INDEX10": string;
        "INDEX11": string;
        "INDEX12": string;
        "INDEX13": string;
        "MATERIAL": string;
        "MATERIAL1": string;
        "MATERIAL2": string;
        "DIFFUSE": string;
        "AMBIENT": string;
        "SPECULAR": string;
        "EMISSIVE": string;
        "SHININESS": string;
        "TEXTURE_HEADER": string;
        "UNKNOWN": string;
        "END": string;
    };
}
declare module akra.fx {
    class AttributeBlendContainer extends VariableBlendContainer implements IAFXAttributeBlendContainer {
        private _pSlotBySemanticIndex;
        private _pTypeInfoBySemanticIndex;
        private _pFlowBySlots;
        private _pSlotByFlows;
        private _pIsPointerBySlot;
        private _pVBByBufferSlots;
        private _pBufferSlotBySlots;
        private _pHashPartList;
        private _pOffsetVarsBySemanticMap;
        private _pOffsetDefaultMap;
        private _nSemantics;
        private _nSlots;
        private _nBufferSlots;
        public _sHash: string;
        public getAttrsInfo(): IAFXVariableBlendInfo[];
        public getTotalSlots(): number;
        public getTotalBufferSlots(): number;
        constructor();
        public getOffsetVarsBySemantic(sName: string): IAFXVariableDeclInstruction[];
        public getOffsetDefault(sName: string): number;
        public getSlotBySemanticIndex(iIndex: number): number;
        public getBufferSlotBySemanticIndex(iIndex: number): number;
        public getAttributeListBySemanticIndex(iIndex: number): IAFXVariableDeclInstruction[];
        public getTypeForShaderAttributeBySemanticIndex(iIndex: number): IAFXTypeInstruction;
        public getTypeBySemanticIndex(iIndex: number): IAFXVariableTypeInstruction;
        public addAttribute(pVariable: IAFXVariableDeclInstruction): boolean;
        public hasAttrWithSemantic(sSemantic: string): boolean;
        public getAttributeBySemanticIndex(iIndex: number): IAFXVariableDeclInstruction;
        public getAttributeBySemantic(sSemantic: string): IAFXVariableDeclInstruction;
        public hasTexcoord(iSlot: number): boolean;
        public getTexcoordVar(iSlot: number): IAFXVariableDeclInstruction;
        public finalize(): void;
        public clear(): void;
        public generateOffsetMap(): void;
        public initFromBufferMap(pMap: IBufferMap): void;
        public getHash(): string;
        private createTypeInfo(iIndex);
    }
}
declare module akra.fx {
    class ComplexTypeBlendContainer {
        private _pTypeListMap;
        private _pTypeKeys;
        public getKeys(): string[];
        public getTypes(): IAFXTypeMap;
        constructor();
        public addComplexType(pComplexType: IAFXTypeInstruction): boolean;
        public addFromVarConatiner(pContainer: VariableBlendContainer): boolean;
    }
}
declare module akra.fx {
    class ExtSystemDataContainer {
        public _pExtSystemMacrosList: IAFXSimpleInstruction[];
        public _pExtSystemTypeList: IAFXTypeDeclInstruction[];
        public _pExtSystemFunctionList: IAFXFunctionDeclInstruction[];
        public getMacroses(): IAFXSimpleInstruction[];
        public getTypes(): IAFXTypeDeclInstruction[];
        public getFunctions(): IAFXFunctionDeclInstruction[];
        constructor();
        public addFromFunction(pFunction: IAFXFunctionDeclInstruction): void;
    }
}
declare module akra.fx {
    class Maker implements IAFXMaker {
        public guid: number;
        private _pComposer;
        private _pPassBlend;
        private _pShaderProgram;
        private _pRealUniformNameList;
        private _pRealAttrNameList;
        private _pUniformExistMap;
        private _pAttrExistMap;
        private _isUsedZero2D;
        private _isUsedZeroCube;
        private _pDataPoolArray;
        private _pShaderUniformInfoMap;
        private _pShaderAttrInfoMap;
        private _pShaderUniformInfoList;
        private _pShaderAttrInfoList;
        private _pInputUniformInfoList;
        private _pInputSamplerInfoList;
        private _pInputSamplerArrayInfoList;
        private _pUnifromInfoForStructFieldMap;
        public isArray(sName: string): boolean;
        public getType(sName: string): EAFXShaderVariableType;
        public getLength(sName: string): number;
        public getShaderProgram(): IShaderProgram;
        public getAttributeInfo(): IAFXBaseAttrInfo[];
        public getUniformNames(): string[];
        constructor(pComposer: IAFXComposer, pPassBlend: IAFXPassBlend);
        public _create(sVertex: string, sPixel: string): boolean;
        public _getShaderInput(): IShaderInput;
        public _releaseShaderInput(pPool: IShaderInput): void;
        public isUniformExists(sName: string): boolean;
        public isAttrExists(sName: string): boolean;
        public _createDataPool(): IShaderInput;
        public setUniform(iLocation: number, pValue: any): void;
        public _freeUniformCache(): void;
        public _initInput(pPassInput: IAFXPassInputBlend, pBlend: SamplerBlender, pAttrs: IAFXAttributeBlendContainer): boolean;
        private _pMakeTime;
        private _iCount;
        public _make(pPassInput: IAFXPassInputBlend, pBufferMap: IBufferMap): IShaderInput;
        private prepareApplyFunctionForUniform(pUniform);
        private getUniformApplyFunction(eType, isArray);
        private getUniformApplyFunctionName(eType, isArray);
        private getUnifromDefaultValue(eType, isArray);
        private setSamplerState(pOut, pTexture, pFrom);
        private expandStructUniforms(pVariable, sPrevName?);
        private applyStructUniform(pStructInfo, pValue, pInput);
        private applyUnifromArray(sName, eType, pValue);
        private applyUniform(sName, eType, pValue);
    }
}
declare module akra.fx {
    class PassBlend implements IAFXPassBlend {
        public guid: number;
        private _pComposer;
        private _pFXMakerHashTree;
        private _pExtSystemDataV;
        private _pComplexTypeContainerV;
        private _pForeignContainerV;
        private _pUniformContainerV;
        private _pSharedContainerV;
        private _pGlobalContainerV;
        private _pAttributeContainerV;
        private _pVaryingContainerV;
        private _pVertexOutType;
        private _pUsedFunctionListV;
        private _pPassFunctionListV;
        private _pTextureMapV;
        private _pExtSystemDataP;
        private _pComplexTypeContainerP;
        private _pForeignContainerP;
        private _pUniformContainerP;
        private _pSharedContainerP;
        private _pGlobalContainerP;
        private _pVaryingContainerP;
        private _pUsedFunctionListP;
        private _pPassFunctionListP;
        private _pTextureMapP;
        private _hasEmptyVertex;
        private _hasEmptyPixel;
        private _pPassStateMap;
        private _sUniformSamplerCodeV;
        private _sAttrBufferDeclCode;
        private _sAttrDeclCode;
        private _sAFXAttrDeclCode;
        private _sAttrBufferInitCode;
        private _sAFXAttrInitCode;
        private _sSystemExtBlockCodeV;
        private _sFunctionDefCodeV;
        private _sSharedVarCodeV;
        private _sVaryingDeclCodeV;
        private _sVertexOutDeclCode;
        private _sVertexOutToVaryingCode;
        private _sPassFunctionCallCodeV;
        private _sUniformSamplerCodeP;
        private _sSystemExtBlockCodeP;
        private _sFunctionDefCodeP;
        private _sSharedVarCodeP;
        private _sVaryingDeclCodeP;
        private _sPassFunctionCallCodeP;
        private _sVertexCode;
        private _sPixelCode;
        private _pDefaultSamplerBlender;
        private _pTexcoordSwapper;
        private _pSamplerByIdMap;
        private _pSamplerIdList;
        private _pSamplerArrayByIdMap;
        private _pSamplerArrayIdList;
        private _pPassInputForeignsHashMap;
        private _pPassInputSamplersHashMap;
        private _pBufferMapHashMap;
        private _pSurfaceMaterialHashMap;
        private _isSamplersPrepared;
        private _isBufferMapPrepared;
        private _isSurfaceMaterialPrepared;
        private static texcoordSwapper;
        private static hashMinifier;
        constructor(pComposer: IAFXComposer);
        public initFromPassList(pPassList: IAFXPassInstruction[]): boolean;
        public generateFXMaker(pPassInput: IAFXPassInputBlend, pSurfaceMaterial: ISurfaceMaterial, pBuffer: IBufferMap): IAFXMaker;
        public _hasUniformWithName(sName: string): boolean;
        public _hasUniformWithNameIndex(iNameIndex: number): boolean;
        public _getRenderStates(): IMap<ERenderStateValues>;
        private finalizeBlend();
        private addPass(pPass);
        private finalizeBlendForVertex();
        private finalizeBlendForPixel();
        private enableVaringPrefixes(eType, bEnabled);
        private finalizeComplexTypeForShader(eType);
        private hasUniformWithName(sName);
        private hasUniformWithNameIndex(iNameIndex);
        private prepareForeigns(pPassInput);
        private prepareSamplers(pPassInput, isForce);
        private prepareSurfaceMaterial(pMaterial, isForce);
        private prepareBufferMap(pMap, isForce);
        private swapTexcoords(pMaterial);
        private isSamplerUsedInShader(pSampler, eType);
        private applyForeigns(pPassInput);
        private resetForeigns();
        private generateShaderCode();
        private generateCodeForVertex();
        private generateCodeForPixel();
        private clearCodeFragments();
        private reduceSamplers();
        private resetSamplerVarsToDefault();
        private static fnSamplerReducer(pSamplerVar);
        private reduceAttributes();
        private generateSystemExtBlock(eType);
        private generateTypeDels(eType);
        private generateFunctionDefenitions(eType);
        private generateSharedVars(eType);
        private generateVertexOut();
        private generateVaryings(eType);
        private generateUniformSamplers(eType);
        private generateUniformVars(eType);
        private generateAttrBuffers();
        private generateGlobalVars(eType);
        private generateFunctions(eType);
        private generatePassFunctions(eType);
        private generateRealAttrs();
        private generateAFXAttrs();
        private generateAttrBufferInit();
        private generateAFXAttrInit();
        private generateTexcoordSwap();
        private generatePassFunctionCall(eType);
        private generateVertexOutToVaryings();
        private prepareFastObjects();
        private prepareFastSamplers(eType);
        private static _pStats;
    }
}
declare module akra.fx {
    class Blender implements IAFXBlender {
        private _pComposer;
        private _pComponentBlendByHashMap;
        private _pBlendWithComponentMap;
        private _pBlendWithBlendMap;
        private _pPassBlendByHashMap;
        private _pPassBlendByIdMap;
        private _pPassBlendHashTree;
        private _pTmpRenderStateMap;
        constructor(pComposer: IAFXComposer);
        public addComponentToBlend(pComponentBlend: IAFXComponentBlend, pComponent: IAFXComponent, iShift: number, iPass: number): IAFXComponentBlend;
        public removeComponentFromBlend(pComponentBlend: IAFXComponentBlend, pComponent: IAFXComponent, iShift: number, iPass: number): IAFXComponentBlend;
        public addBlendToBlend(pComponentBlend: IAFXComponentBlend, pAddBlend: IAFXComponentBlend, iShift: number): IAFXComponentBlend;
        public generatePassBlend(pPassList: IAFXPassInstruction[], pComposerStates: any, pForeigns: any, pUniforms: any): IAFXPassBlend;
        public getPassBlendById(id: number): IAFXPassBlend;
    }
}
declare module akra {
    function sizeof(eType: EDataTypes): number;
}
declare module akra.data {
    class VertexElement implements IVertexElement {
        public count: number;
        public type: EDataTypes;
        public usage: string;
        public offset: number;
        public size: number;
        public index: number;
        public semantics: string;
        constructor(nCount?: number, eType?: EDataTypes, eUsage?: string, iOffset?: number);
        private update();
        public clone(): IVertexElement;
        /**  */ 
        static hasUnknownOffset(pElement: IVertexElementInterface): boolean;
        /**  */ 
        public isEnd(): boolean;
        public toString(): string;
        static custom(sUsage: string, eType?: EDataTypes, iCount?: number, iOffset?: number): IVertexElementInterface;
        static float(sUsage: string, iOffset?: number): IVertexElementInterface;
        static float2(sUsage: string, iOffset?: number): IVertexElementInterface;
        static float3(sUsage: string, iOffset?: number): IVertexElementInterface;
        static float4(sUsage: string, iOffset?: number): IVertexElementInterface;
        static float4x4(sUsage: string, iOffset?: number): IVertexElementInterface;
        static int(sUsage: string, iOffset?: number): IVertexElementInterface;
        static end(iOffset?: number): IVertexElementInterface;
    }
}
declare module akra.render {
    class RenderPass implements IRenderPass {
        public guid: number;
        private _pTechnique;
        private _pRenderTarget;
        private _iPassNumber;
        private _pInput;
        private _isActive;
        constructor(pTechnique: IRenderTechnique, iPass: number);
        public setForeign(sName: string, bValue: boolean): void;
        public setForeign(sName: string, fValue: number): void;
        public setTexture(sName: string, pTexture: ITexture): void;
        public setUniform(sName: string, pValue: any): void;
        public setStruct(sName: string, pValue: any): void;
        public setRenderState(eState: ERenderStates, eValue: ERenderStateValues): void;
        public setSamplerTexture(sName: string, sTexture: string): void;
        public setSamplerTexture(sName: string, pTexture: ITexture): void;
        public getRenderTarget(): IRenderTarget;
        public setRenderTarget(pTarget: IRenderTarget): void;
        public getPassInput(): IAFXPassInputBlend;
        public setPassInput(pInput: IAFXPassInputBlend, isNeedRelocate: boolean): void;
        public blend(sComponentName: string, iPass: number): boolean;
        public activate(): void;
        public deactivate(): void;
        public isActive(): boolean;
        private relocateOldInput(pNewInput);
    }
}
declare module akra.render {
    class RenderTechnique implements IRenderTechnique {
        public guid: number;
        public render: ISignal<(pTech: IRenderTechnique, iPass: number, pRenderable: IRenderableObject, pSceneObject: ISceneObject, pViewport: IViewport) => void>;
        private _pMethod;
        private _isFreeze;
        private _pComposer;
        private _pPassList;
        private _pPassBlackList;
        private _iCurrentPass;
        private _pCurrentPass;
        /**
        * Only for read, because it`s pointer to ComponentBlend._pPassTypesList
        */
        private _pBlendPassTypesList;
        private _bHasPostEffectPass;
        private _iLastPostEffectPass;
        private _iMinShiftOfOwnBlend;
        private _pRenderMethodPassStateList;
        static pRenderMethodPassStatesPool: IObjectArray<IAFXPassInputStateInfo>;
        constructor(pMethod?: IRenderMethod);
        public setupSignals(): void;
        public copyTechniqueOwnComponentBlend(pFrom: IRenderTechnique): void;
        public getModified(): number;
        public getTotalPasses(): number;
        public destroy(): void;
        public getPass(iPass: number): IRenderPass;
        public getMethod(): IRenderMethod;
        public setMethod(pMethod: IRenderMethod): void;
        public setState(sName: string, pValue: any): void;
        public setForeign(sName: string, pValue: any): void;
        public setStruct(sName: string, pValue: any): void;
        public setTextureBySemantics(sName: string, pValue: any): void;
        public setShadowSamplerArray(sName: string, pValue: any): void;
        public setVec2BySemantic(sName: string, pValue: any): void;
        public isReady(): boolean;
        public addComponent(iComponentHandle: number, iShift?: number, iPass?: number): boolean;
        public addComponent(pComponent: IAFXComponent, iShift?: number, iPass?: number): boolean;
        public addComponent(sComponent: string, iShift?: number, iPass?: number): boolean;
        public delComponent(iComponentHandle: number, iShift?: number, iPass?: number): boolean;
        public delComponent(sComponent: string, iShift?: number, iPass?: number): boolean;
        public delComponent(pComponent: IAFXComponent, iShift?: number, iPass?: number): boolean;
        public hasComponent(sComponent: string, iShift?: number, iPass?: number): boolean;
        public hasOwnComponent(sComponent: string, iShift?: number, iPass?: number): boolean;
        public hasPostEffect(): boolean;
        public isPostEffectPass(iPass: number): boolean;
        public isLastPass(iPass: number): boolean;
        public isLastPostEffectPass(iPass: number): boolean;
        public isFirstPass(iPass: number): boolean;
        public isFreeze(): boolean;
        public updatePasses(bSaveOldUniformValue: boolean): void;
        public _setComposer(pComposer: IAFXComposer): void;
        public _getComposer(): IAFXComposer;
        public _renderTechnique(pViewport: IViewport, pRenderable: IRenderableObject, pSceneObject: ISceneObject): void;
        public _updateMethod(pMethod: IRenderMethod): void;
        public _blockPass(iPass: number): void;
        public _setBlendPassTypes(pTypes: EPassTypes[]): void;
        private updatePassTypesInfo();
        private informComposer();
        private prepareRenderMethodPassStateInfo(pMethod);
        /**
        * Copy input data from render method to render technique.
        * It's nessasery for adding ability.......
        */
        private takePassInputsFromRenderMethod();
        private activatePass(iPass);
        private getFreePassState();
        private freePassState(pState);
    }
}
declare module akra.render {
    class RenderableObject implements IRenderableObject {
        public guid: number;
        public shadowed: ISignal<(pRenderable: IRenderableObject, bValue: boolean) => void>;
        public beforeRender: ISignal<(pRenderable: IRenderableObject, pViewport: IViewport, pMethod: IRenderMethod) => void>;
        public click: ISignal<(pRenderable: IRenderableObject, pViewport: IViewport, pObject: ISceneObject, x: any, y: any) => void>;
        public mousemove: ISignal<(pRenderable: IRenderableObject, pViewport: IViewport, pObject: ISceneObject, x: any, y: any) => void>;
        public mousedown: ISignal<(pRenderable: IRenderableObject, pViewport: IViewport, pObject: ISceneObject, x: any, y: any) => void>;
        public mouseup: ISignal<(pRenderable: IRenderableObject, pViewport: IViewport, pObject: ISceneObject, x: any, y: any) => void>;
        public mouseover: ISignal<(pRenderable: IRenderableObject, pViewport: IViewport, pObject: ISceneObject, x: any, y: any) => void>;
        public mouseout: ISignal<(pRenderable: IRenderableObject, pViewport: IViewport, pObject: ISceneObject, x: any, y: any) => void>;
        public mousewheel: ISignal<(pRenderable: IRenderableObject, pViewport: IViewport, pObject: ISceneObject, x: any, y: any, fDelta: any) => void>;
        public dragstart: ISignal<(pRenderable: IRenderableObject, pViewport: IViewport, pObject: ISceneObject, x: any, y: any) => void>;
        public dragstop: ISignal<(pRenderable: IRenderableObject, pViewport: IViewport, pObject: ISceneObject, x: any, y: any) => void>;
        public dragging: ISignal<(pRenderable: IRenderableObject, pViewport: IViewport, pObject: ISceneObject, x: any, y: any) => void>;
        public _pRenderData: IRenderData;
        public _pRenderer: IRenderer;
        public _pTechnique: IRenderTechnique;
        public _pTechniqueMap: IMap<IRenderTechnique>;
        public _eRenderableType: ERenderableTypes;
        public _bShadow: boolean;
        public _bVisible: boolean;
        public _bFrozen: boolean;
        public _bWireframeOverlay: boolean;
        constructor(eType?: ERenderableTypes);
        public setupSignals(): void;
        public getType(): ERenderableTypes;
        public getEffect(): IEffect;
        public getSurfaceMaterial(): ISurfaceMaterial;
        public getMaterial(): IMaterial;
        public getData(): IRenderData;
        public getRenderMethod(): IRenderMethod;
        public getRenderID(pObject?: ISceneObject): number;
        public setRenderMethod(pMethod: IRenderMethod): void;
        public getShadow(): boolean;
        public setShadow(bShadow: boolean): void;
        public _setRenderData(pData: IRenderData): void;
        public _setup(pRenderer: IRenderer, csDefaultMethod?: string): void;
        public getRenderer(): IRenderer;
        public destroy(): void;
        public addRenderMethod(pMethod: IRenderMethod, csName?: string): boolean;
        public addRenderMethod(csMethod: string, csName?: string): boolean;
        public switchRenderMethod(pMethod: IRenderMethod): boolean;
        public switchRenderMethod(csName: string): boolean;
        public removeRenderMethod(csName: string): boolean;
        public getRenderMethodByName(csName?: string): IRenderMethod;
        public getRenderMethodDefault(): IRenderMethod;
        public isReadyForRender(): boolean;
        public isAllMethodsLoaded(): boolean;
        public isFrozen(): boolean;
        public wireframe(bEnable?: boolean, bOverlay?: boolean): boolean;
        public render(pViewport: IViewport, csMethod?: string, pSceneObject?: ISceneObject): void;
        public getTechnique(sName?: string): IRenderTechnique;
        public getTechniqueDefault(): IRenderTechnique;
        public _draw(): void;
        public isVisible(): boolean;
        public setVisible(bVisible?: boolean): void;
    }
    function isScreen(pObject: IRenderableObject): boolean;
    function isSprite(pObject: IRenderableObject): boolean;
}
declare module akra {
    interface IRay2d {
        point: IVec2;
        normal: IVec2;
    }
}
declare module akra.geometry {
    class Ray2d implements IRay2d {
        public point: IVec2;
        public normal: IVec2;
        constructor();
    }
}
declare module akra.geometry {
    class Ray3d implements IRay3d {
        public point: IVec3;
        public normal: IVec3;
        constructor();
    }
}
declare module akra {
    interface ISegment2d {
        ray: IRay2d;
        distance: number;
        getPoint(): IVec2;
        setPoint(v2fPoint: IVec2): void;
        getNormal(): IVec2;
        setNormal(v2fNormal: IVec2): void;
    }
}
declare module akra.geometry {
    class Segment2d implements ISegment2d {
        public ray: IRay2d;
        public distance: number;
        constructor();
        public getPoint(): IVec2;
        public setPoint(v2fPoint: IVec2): void;
        public getNormal(): IVec2;
        public setNormal(v2fNormal: IVec2): void;
    }
}
declare module akra {
    interface ISegment3d {
        ray: IRay3d;
        distance: number;
        getPoint(): IVec3;
        setPoint(v3fPoint: IVec3): void;
        getNormal(): IVec3;
        setNormal(v3fNormal: IVec3): void;
    }
}
declare module akra.geometry {
    class Segment3d implements ISegment3d {
        public ray: IRay3d;
        public distance: number;
        constructor();
        public getPoint(): IVec3;
        public setPoint(v3fPoint: IVec3): void;
        public getNormal(): IVec3;
        public setNormal(v3fNormal: IVec3): void;
    }
}
declare module akra.geometry {
    class Circle implements ICircle {
        public center: IVec2;
        public radius: number;
        constructor();
        constructor(pCircle: ICircle);
        constructor(v2fCenter: IVec2, fRadius: number);
        constructor(fCenterX: number, fCenterY: number, fRadius: number);
        public set(): ICircle;
        public set(pCircle: ICircle): ICircle;
        public set(v2fCenter: IVec2, fRadius: number): ICircle;
        public set(fCenterX: number, fCenterY: number, fRadius: number): ICircle;
        /**  */ 
        public clear(): ICircle;
        /**  */ 
        public isEqual(pCircle: ICircle): boolean;
        /**  */ 
        public isClear(): boolean;
        /**  */ 
        public isValid(): boolean;
        /**  */ 
        public offset(v2fOffset: IVec2): ICircle;
        /**  */ 
        public expand(fInc: number): ICircle;
        /**  */ 
        public normalize(): ICircle;
    }
}
declare module akra.geometry {
    class Sphere implements ISphere {
        public center: IVec3;
        public radius: number;
        constructor();
        constructor(pSphere: ISphere);
        constructor(v3fCenter: IVec3, fRadius: number);
        constructor(fCenterX: number, fCenterY: number, fCenterZ: number, fRadius: number);
        public getCircle(): ICircle;
        public setCircle(pCircle: ICircle): void;
        public getZ(): number;
        public setZ(fZ: number): void;
        public set(): ISphere;
        public set(pSphere: ISphere): ISphere;
        public set(v3fCenter: IVec3, fRadius: number): ISphere;
        public set(fCenterX: number, fCenterY: number, fCenterZ: number, fRadius: number): ISphere;
        /**  */ 
        public clear(): ISphere;
        /**  */ 
        public isEqual(pSphere: ISphere): boolean;
        /**  */ 
        public isClear(): boolean;
        /**  */ 
        public isValid(): boolean;
        /**  */ 
        public offset(v3fOffset: IVec3): ISphere;
        /**  */ 
        public expand(fInc: number): ISphere;
        /**  */ 
        public normalize(): ISphere;
        public transform(m4fMatrix: IMat4): ISphere;
    }
}
declare module akra.geometry {
    class Rect2d implements IRect2d {
        public x0: number;
        public x1: number;
        public y0: number;
        public y1: number;
        public getLeft(): number;
        public getTop(): number;
        public getWidth(): number;
        public getHeight(): number;
        constructor();
        constructor(pRect: IRect2d);
        constructor(v2fVec: IVec2);
        constructor(fSizeX: number, fSizeY: number);
        constructor(fX0: number, fX1: number, fY0: number, fY1: number);
        public set(): IRect2d;
        public set(pRect: IRect2d): IRect2d;
        public set(v2fVec: IVec2): IRect2d;
        public set(fSizeX: number, fSizeY: number): IRect2d;
        public set(v2fMinPoint: IVec2, v2fMaxPoint: IVec2): IRect2d;
        public set(fX0: number, fX1: number, fY0: number, fY1: number): IRect2d;
        public setFloor(pRect: IRect2d): IRect2d;
        public setCeil(pRect: IRect2d): IRect2d;
        public clear(): IRect2d;
        public addSelf(fValue: number): IRect2d;
        public addSelf(v2fVec: IVec2): IRect2d;
        public subSelf(fValue: number): IRect2d;
        public subSelf(v2fVec: IVec2): IRect2d;
        public multSelf(fValue: number): IRect2d;
        public multSelf(v2fVec: IVec2): IRect2d;
        public divSelf(fValue: number): IRect2d;
        public divSelf(v2fVec: IVec2): IRect2d;
        public offset(v2fOffset: IVec2): IRect2d;
        public offset(fOffsetX: number, fOffsetY: number): IRect2d;
        public expand(fValue: number): IRect2d;
        public expand(v2fValue: IVec2): IRect2d;
        public expand(fValueX: number, fValueY: number): IRect2d;
        public expandX(fValue: number): IRect2d;
        public expandY(fValue: number): IRect2d;
        public resize(v2fSize: IVec2): IRect2d;
        public resize(fSizeX: number, fSizeY: number): IRect2d;
        public resizeX(fSize: number): IRect2d;
        public resizeY(fSize: number): IRect2d;
        public resizeMax(v2fSpan: IVec2): IRect2d;
        public resizeMax(fSpanX: number, fSpanY: number): IRect2d;
        public resizeMaxX(fSpan: number): IRect2d;
        public resizeMaxY(fSpan: number): IRect2d;
        public resizeMin(v2fSpan: IVec2): IRect2d;
        public resizeMin(fSpanX: number, fSpanY: number): IRect2d;
        public resizeMinX(fSpan: number): IRect2d;
        public resizeMinY(fSpan: number): IRect2d;
        public unionPoint(v2fPoint: IVec2): IRect2d;
        public unionPoint(fX: number, fY: number): IRect2d;
        public unionRect(pRect: IRect2d): IRect2d;
        public negate(pDestination?: IRect2d): IRect2d;
        public normalize(): IRect2d;
        public isEqual(pRect: IRect2d): boolean;
        public isClear(): boolean;
        public isValid(): boolean;
        public isPointInRect(v2fPoint: IVec2): boolean;
        public midPoint(v2fDestination?: IVec2): IVec2;
        public midX(): number;
        public midY(): number;
        public size(v2fDestination?: IVec2): IVec2;
        public sizeX(): number;
        public sizeY(): number;
        public minPoint(v2fDestination?: IVec2): IVec2;
        public maxPoint(v2fDestination?: IVec2): IVec2;
        public area(): number;
        /**
        * counter-clockwise
        * x0,y0 -> x1,y0 -> x1,y1 -> x0,y1;
        */
        public corner(iIndex: number, v2fDestination?: IVec2): IVec2;
        public createBoundingCircle(pCircle?: ICircle): ICircle;
        public distanceToPoint(v2fPoint: IVec2): number;
        public toString(): string;
    }
}
declare module akra.geometry {
    class Rect3d implements IRect3d {
        public x0: number;
        public x1: number;
        public y0: number;
        public y1: number;
        public z0: number;
        public z1: number;
        constructor();
        constructor(pRect: IRect3d);
        constructor(v3fSize: IVec3);
        constructor(fSizeX: number, fSizeY: number, fSizeZ: number);
        constructor(v3fMinPoint: IVec3, v3fMaxPoint: IVec3);
        constructor(fX0: number, fX1: number, fY0: number, fY1: number, fZ0: number, fZ1: number);
        public getRect2d(): IRect2d;
        public setRect2d(pRect: IRect2d): void;
        public set(): IRect3d;
        public set(pRect: IRect3d): IRect3d;
        public set(v3fSize: IVec3): IRect3d;
        public set(fSizeX: number, fSizeY: number, fSizeZ: number): IRect3d;
        public set(v3fMinPoint: IVec3, v3fMaxPoint: IVec3): IRect3d;
        public set(fX0: number, fX1: number, fY0: number, fY1: number, fZ0: number, fZ1: number): IRect3d;
        public setFloor(pRect: IRect3d): IRect3d;
        public setCeil(pRect: IRect3d): IRect3d;
        public clear(): IRect3d;
        public addSelf(fValue: number): IRect3d;
        public addSelf(v3fVec: IVec3): IRect3d;
        public subSelf(fValue: number): IRect3d;
        public subSelf(v3fVec: IVec3): IRect3d;
        public multSelf(fValue: number): IRect3d;
        public multSelf(v3fVec: IVec3): IRect3d;
        public divSelf(fValue: number): IRect3d;
        public divSelf(v3fVec: IVec3): IRect3d;
        public offset(v3fOffset: IVec3): IRect3d;
        public offset(fOffsetX: number, fOffsetY: number, fOffsetZ: number): IRect3d;
        public expand(fValue: number): IRect3d;
        public expand(v3fVec: IVec3): IRect3d;
        public expand(fValueX: number, fValueY: number, fValueZ: number): IRect3d;
        public expandX(fValue: number): IRect3d;
        public expandY(fValue: number): IRect3d;
        public expandZ(fValue: number): IRect3d;
        public resize(v3fSize: IVec3): IRect3d;
        public resize(fSizeX: number, fSizeY: number, fSizeZ: number): IRect3d;
        public resizeX(fSize: number): IRect3d;
        public resizeY(fSize: number): IRect3d;
        public resizeZ(fSize: number): IRect3d;
        public resizeMax(v3fSpan: IVec3): IRect3d;
        public resizeMax(fSpanX: number, fSpanY: number, fSpanZ: number): IRect3d;
        public resizeMaxX(fSpan: number): IRect3d;
        public resizeMaxY(fSpan: number): IRect3d;
        public resizeMaxZ(fSpan: number): IRect3d;
        public resizeMin(v3fSpan: IVec3): IRect3d;
        public resizeMin(fSpanX: number, fSpanY: number, fSpanZ: number): IRect3d;
        public resizeMinX(fSpan: number): IRect3d;
        public resizeMinY(fSpan: number): IRect3d;
        public resizeMinZ(fSpan: number): IRect3d;
        public unionPoint(v3fPoint: IVec3): IRect3d;
        public unionPoint(fX: number, fY: number, fZ: number): IRect3d;
        public unionRect(pRect: IRect3d): IRect3d;
        public negate(pDestination?: IRect3d): IRect3d;
        public normalize(): IRect3d;
        public transform(m4fMatrix: IMat4): IRect3d;
        public isEqual(pRect: IRect3d): boolean;
        public isClear(): boolean;
        public isValid(): boolean;
        public isPointInRect(v3fPoint: IVec3): boolean;
        public midPoint(v3fDestination?: IVec3): IVec3;
        public midX(): number;
        public midY(): number;
        public midZ(): number;
        public size(v3fDestination?: IVec3): IVec3;
        public sizeX(): number;
        public sizeY(): number;
        public sizeZ(): number;
        public minPoint(v3fDestination?: IVec3): IVec3;
        public maxPoint(v3fDestination?: IVec3): IVec3;
        public volume(): number;
        /**
        * counter-clockwise and from bottom
        * x0,y0,z0 -> x1,y0,z0 -> x1,y1,z0 -> x0,y1,z0 ->
        * x0,y0,z1 -> x1,y0,z1 -> x1,y1,z1 -> x0,y1,z1
        */
        public corner(iIndex: number, v3fDestination?: IVec3): IVec3;
        public createBoundingSphere(pSphere?: ISphere): ISphere;
        public distanceToPoint(v3fPoint: IVec3): number;
        public toString(): string;
        private static _pBuffer;
        private static _iElement;
        static temp(): IRect3d;
        static temp(pRect: IRect3d): IRect3d;
        static temp(v3fSize: IVec3): IRect3d;
        static temp(fSizeX: number, fSizeY: number, fSizeZ: number): IRect3d;
        static temp(v3fMinPoint: IVec3, v3fMaxPoint: IVec3): IRect3d;
        static temp(fX0: number, fX1: number, fY0: number, fY1: number, fZ0: number, fZ1: number): IRect3d;
    }
}
declare module akra {
    interface IPlane2d {
        normal: IVec2;
        distance: number;
        set(): IPlane2d;
        set(pPlane: IPlane2d): IPlane2d;
        set(v2fNormal: IVec2, fDistance: number): IPlane2d;
        set(v2fPoint1: IVec2, v2fPoint2: IVec2): IPlane2d;
        clear(): IPlane2d;
        negate(): IPlane2d;
        normalize(): IPlane2d;
        isEqual(pPlane: IPlane2d): boolean;
        projectPointToPlane(v2fPoint: IVec2, v2fDestination?: IVec2): IVec2;
        solveForX(fY: number): number;
        solveForY(fX: number): number;
        signedDistance(v2fPoint: any): number;
        toString(): string;
    }
}
declare module akra.geometry {
    class Plane2d implements IPlane2d {
        public normal: IVec2;
        public distance: number;
        constructor();
        constructor(pPlane: IPlane2d);
        constructor(v2fNormal: IVec2, fDistance: number);
        constructor(v2fPoint1: IVec2, v2fPoint2: IVec2);
        public set(): IPlane2d;
        public set(pPlane: IPlane2d): IPlane2d;
        public set(v2fNormal: IVec2, fDistance: number): IPlane2d;
        public set(v2fPoint1: IVec2, v2fPoint2: IVec2): IPlane2d;
        /**  */ 
        public clear(): IPlane2d;
        /**  */ 
        public negate(): IPlane2d;
        public normalize(): IPlane2d;
        /**  */ 
        public isEqual(pPlane: IPlane2d): boolean;
        public projectPointToPlane(v2fPoint: IVec2, v2fDestination?: IVec2): IVec2;
        public solveForX(fY: number): number;
        public solveForY(fX: number): number;
        /**  */ 
        public signedDistance(v2fPoint: IVec2): number;
        public toString(): string;
    }
}
declare module akra.geometry.intersect {
    function plane2dRay2d(pPlane: IPlane2d, pRay: IRay2d): boolean;
    function plane3dRay3d(pPlane: IPlane3d, pRay: IRay3d): boolean;
    function circleRay2d(pCircle: ICircle, pRay: IRay2d): boolean;
    function sphereRay3d(pSphere: ISphere, pRay: IRay3d): boolean;
    function rect2dRay2d(pRect: IRect2d, pRay: IRay2d): boolean;
    function rect3dRay3d(pRect: IRect3d, pRay: IRay3d): boolean;
    function circleCircle(pCircle1: ICircle, pCircle2: ICircle): boolean;
    function sphereSphere(pSphere1: ISphere, pSphere2: ISphere): boolean;
    function rect2dCircle(pRect: IRect2d, pCircle: ICircle): boolean;
    function rect3dSphere(pRect: IRect3d, pSphere: ISphere): boolean;
    function rect2dRect2d(pRect1: IRect2d, pRect2: IRect2d, pResult?: IRect2d): boolean;
    function rect3dRect3d(pRect1: IRect3d, pRect2: IRect3d, pResult?: IRect3d): boolean;
    function intersect(pPlane: IPlane2d, pRay: IRay2d): boolean;
    function intersect(pPlane: IPlane3d, pRay: IRay3d): boolean;
    function intersect(pCircle: ICircle, pRay: IRay2d): boolean;
    function intersect(pSphere: ISphere, pRay: IRay3d): boolean;
    function intersect(pRect: IRect2d, pRay: IRay2d): boolean;
    function intersect(pRect: IRect3d, pRay: IRay3d): boolean;
    function intersect(pCircle1: ICircle, pCircle2: ICircle): boolean;
    function intersect(pSphere1: ISphere, pSphere2: ISphere): boolean;
    function intersect(pRect: IRect2d, pCircle: ICircle): boolean;
    function intersect(pRect: IRect3d, pSphere: ISphere): boolean;
    function intersect(pRect1: IRect2d, pRect2: IRect2d, pResult?: IRect2d): boolean;
    function intersect(pRect1: IRect3d, pRect2: IRect3d, pResult?: IRect3d): boolean;
}
declare module akra.geometry {
    class Plane3d implements IPlane3d {
        public normal: IVec3;
        public distance: number;
        constructor();
        constructor(pPlane: IPlane3d);
        constructor(v3fNormal: IVec3, fDistance: number);
        constructor(v3fPoint1: IVec3, v3fPoint2: IVec3, v3fPoint3: IVec3);
        public set(): IPlane3d;
        public set(pPlane: IPlane3d): IPlane3d;
        public set(v3fNormal: IVec3, fDistance: number): IPlane3d;
        public set(v3fPoint1: IVec3, v3fPoint2: IVec3, v3fPoint3: IVec3): IPlane3d;
        public clear(): IPlane3d;
        public negate(): IPlane3d;
        public normalize(): IPlane3d;
        public isEqual(pPlane: IPlane3d): boolean;
        public projectPointToPlane(v3fPoint: IVec3, v3fDestination?: IVec3): IVec3;
        public solveForX(fY: number, fZ: number): number;
        public solveForY(fX: number, fZ: number): number;
        public solveForZ(fX: number, fY: number): number;
        public intersectRay3d(pRay: IRay3d, vDest: IVec3): boolean;
        public signedDistance(v3fPoint: IVec3): number;
        public toString(): string;
    }
}
declare module akra {
    enum EPlaneClassifications {
        /**
        * ax+by+cz+d=0
        * PLANE_FRONT - объект находится перед плоскостью, то есть по направлению нормали
        * PLANE_BACK - объект находится за плостостью, то есть против направления нормали
        */
        PLANE_FRONT = 0,
        PLANE_BACK = 1,
        PLANE_INTERSECT = 2,
    }
}
declare module akra {
    enum EVolumeClassifications {
        NO_RELATION = 0,
        EQUAL = 1,
        A_CONTAINS_B = 2,
        B_CONTAINS_A = 3,
        INTERSECTING = 4,
    }
}
declare module akra.geometry.classify {
    function planeCircle(pPlane: IPlane2d, pCircle: ICircle): EPlaneClassifications;
    function planeSphere(pPlane: IPlane3d, pSphere: ISphere): EPlaneClassifications;
    function planeRect2d(pPlane: IPlane2d, pRect: IRect2d): EPlaneClassifications;
    function planeRect3d(pPlane: IPlane3d, pRect: IRect3d): EPlaneClassifications;
    function plane(pPlane: IPlane2d, pCircle: ICircle): EPlaneClassifications;
    function plane(pPlane: IPlane3d, pSphere: ISphere): EPlaneClassifications;
    function plane(pPlane: IPlane2d, pRect: IRect2d): EPlaneClassifications;
    function plane(pPlane: IPlane3d, pRect: IRect3d): EPlaneClassifications;
    function rect2d(pRectA: IRect2d, pRectB: IRect2d): EVolumeClassifications;
    function rect3d(pRectA: IRect3d, pRectB: IRect3d): EVolumeClassifications;
    function frustumRect3d(pFrustum: IFrustum, pRect: IRect3d): EVolumeClassifications;
}
declare module akra.geometry {
    class Frustum implements IFrustum {
        public leftPlane: IPlane3d;
        public rightPlane: IPlane3d;
        public topPlane: IPlane3d;
        public bottomPlane: IPlane3d;
        public nearPlane: IPlane3d;
        public farPlane: IPlane3d;
        public _pFrustumVertices: IVec3[];
        constructor();
        constructor(pFrustum: IFrustum);
        constructor(pLeftPlane: IPlane3d, pRightPlane: IPlane3d, pTopPlane: IPlane3d, pBottomPlane: IPlane3d, pNearPlane: IPlane3d, pFarPlane: IPlane3d);
        public getFrustumVertices(): IVec3[];
        public set(): IFrustum;
        public set(pFrustum: IFrustum): IFrustum;
        public set(pLeftPlane: IPlane3d, pRightPlane: IPlane3d, pTopPlane: IPlane3d, pBottomPlane: IPlane3d, pNearPlane: IPlane3d, pFarPlane: IPlane3d): IFrustum;
        public calculateFrustumVertices(): IVec3[];
        public extractFromMatrix(m4fProjection: IMat4, m4fWorld?: IMat4, pSearchRect?: IRect3d): IFrustum;
        /**  */ 
        public isEqual(pFrustum: IFrustum): boolean;
        public getPlanePoints(sPlaneKey: string, pDestination?: IVec3[]): IVec3[];
        public testPoint(v3fPoint: IVec3): boolean;
        public testRect(pRect: IRect3d): boolean;
        public testSphere(pSphere: ISphere): boolean;
        public testFrustum(pFrustum: IFrustum): boolean;
        public getViewDirection(v3fDirection?: IVec3): IVec3;
        public toString(): string;
        static frustumPlanesKeys: string[];
    }
}
declare module akra.geometry {
    /**
    * Computes a coordinate-axis oriented bounding box.
    */
    function computeBoundingBox(pVertexData: IVertexData, pBoundingBox: IRect3d): boolean;
    /** расчет данных для отрисовки бокса */
    function computeDataForCascadeBoundingBox(pBoundingBox: IRect3d, ppVertexes: number[], ppIndexes: number[], fMinSize?: number): boolean;
    /** подсчет обобщающей сферы над двумя сферами */
    function computeGeneralizingSphere(pSphereA: ISphere, pSphereB: ISphere, pSphereDest?: ISphere): boolean;
    /** расчет данных для отрисовки сферы */
    function computeDataForCascadeBoundingSphere(pBoundingSphere: ISphere, ppVertexes: number[], ppIndexes: number[], fMinSize?: number): boolean;
    /**
    * Computes a bounding sphere.
    * При использование быстрого вычисления, опционально можно получить баундинг бокс.
    */
    function computeBoundingSphere(pVertexData: IVertexData, pSphere: ISphere, bFastMethod?: boolean, pBoundingBox?: IRect3d): boolean;
    /**
    * Computes a bounding sphere - not minimal. Also if it need compute dounding box
    */
    function computeBoundingSphereFast(pVertexData: IVertexData, pSphere: ISphere, pBoundingBox?: IRect3d): boolean;
    /**
    * Computes a bounding sphere - minimal.
    */
    function computeBoundingSphereMinimal(pVertexData: IVertexData, pSphere: ISphere): boolean;
}
declare module akra {
    interface IAFXPreRenderState {
    }
}
declare module akra.render {
    class Viewport implements IViewport {
        public guid: number;
        public viewportDimensionsChanged: ISignal<(pViewport: IViewport) => void>;
        public viewportCameraChanged: ISignal<(pViewport: IViewport) => void>;
        public render: ISignal<(pViewport: IViewport, pTechnique: IRenderTechnique, iPass: number, pRenderable: IRenderableObject, pSceneObject: ISceneObject) => void>;
        public dragstart: ISignal<(pViewport: IViewport, eBtn: EMouseButton, x: number, y: number) => void>;
        public dragstop: ISignal<(pViewport: IViewport, eBtn: EMouseButton, x: number, y: number) => void>;
        public dragging: ISignal<(pViewport: IViewport, eBtn: EMouseButton, x: number, y: number) => void>;
        public click: ISignal<(pViewport: IViewport, x: number, y: number) => void>;
        public mousemove: ISignal<(pViewport: IViewport, x: number, y: number) => void>;
        public mousedown: ISignal<(pViewport: IViewport, eBtn: EMouseButton, x: number, y: number) => void>;
        public mouseup: ISignal<(pViewport: IViewport, eBtn: EMouseButton, x: number, y: number) => void>;
        public mouseover: ISignal<(pViewport: IViewport, x: number, y: number) => void>;
        public mouseout: ISignal<(pViewport: IViewport, x: number, y: number) => void>;
        public mousewheel: ISignal<(pViewport: IViewport, x: number, y: number, fDelta: number) => void>;
        public _pCamera: ICamera;
        public _pTarget: IRenderTarget;
        public _fRelLeft: number;
        public _fRelTop: number;
        public _fRelWidth: number;
        public _fRelHeight: number;
        public _iActLeft: number;
        public _iActTop: number;
        public _iActWidth: number;
        public _iActHeight: number;
        public _iZIndex: number;
        public _pDepthRange: IDepthRange;
        public _pViewportState: IViewportState;
        public _bClearEveryFrame: boolean;
        public _bUpdated: boolean;
        public _iVisibilityMask: number;
        public _sMaterialSchemeName: string;
        public _isAutoUpdated: boolean;
        public _csDefaultRenderMethod: string;
        public _isDepthRangeUpdated: boolean;
        public _bHidden: boolean;
        public _iUserEvents: number;
        /**
        * @param csRenderMethod Name of render technique, that will be selected in the renderable for render.
        */
        constructor(pCamera: ICamera, csRenderMethod?: string, fLeft?: number, fTop?: number, fWidth?: number, fHeight?: number, iZIndex?: number);
        public setupSignals(): void;
        public getLeft(): number;
        public getTop(): number;
        public getWidth(): number;
        public getHeight(): number;
        public getActualLeft(): number;
        public getActualTop(): number;
        public getActualWidth(): number;
        public getActualHeight(): number;
        public getZIndex(): number;
        public getType(): EViewportTypes;
        public getBackgroundColor(): IColor;
        public setBackgroundColor(cColor: IColor): void;
        public getDepthClear(): number;
        public setDepthClear(fDepthClearValue: number): void;
        public _setDefaultRenderMethod(sMethod: string): void;
        public destroy(): void;
        public clear(iBuffers?: number, cColor?: IColor, fDepth?: number, iStencil?: number): void;
        public getTarget(): IRenderTarget;
        public getCamera(): ICamera;
        public setCamera(pCamera: ICamera): boolean;
        public _setCamera(pCamera: ICamera): void;
        public setDimensions(fLeft: number, fTop: number, fWidth: number, fHeight: number): boolean;
        public setDimensions(pRect: IRect2d): boolean;
        public getActualDimensions(): IRect2d;
        public setClearEveryFrame(isClear: boolean, iBuffers?: number): void;
        public getClearEveryFrame(): boolean;
        public getClearBuffers(): number;
        public setDepthParams(bDepthTest: boolean, bDepthWrite: boolean, eDepthFunction: ECompareFunction): void;
        public setCullingMode(eCullingMode: ECullingMode): void;
        public setAutoUpdated(bValue?: boolean): void;
        public isAutoUpdated(): boolean;
        public _updateDimensions(bEmitEvent?: boolean): void;
        public hide(bValue?: boolean): void;
        public update(): void;
        public _updateImpl(): void;
        public startFrame(): void;
        public renderObject(pRenderable: IRenderableObject, csMethod?: string): void;
        public endFrame(): void;
        public renderAsNormal(csMethod: string, pCamera: ICamera): void;
        public _onRender(pTechnique: IRenderTechnique, iPass: number, pRenderable: IRenderableObject, pSceneObject: ISceneObject): void;
        public _setTarget(pTarget: IRenderTarget): void;
        public isUpdated(): boolean;
        public enableSupportForUserEvent(iType: number): number;
        public isUserEventSupported(eType: EUserEvents): boolean;
        public _clearUpdatedFlag(): void;
        public _getNumRenderedPolygons(): number;
        public _getViewportState(): IViewportState;
        static RenderSignal: any;
    }
}
declare module akra.render {
    class TextureViewport extends Viewport implements IViewport {
        private _pTargetTexture;
        private _pDeferredView;
        private _pEffect;
        private _v4fMapping;
        public getType(): EViewportTypes;
        constructor(pTexture: ITexture, fLeft?: number, fTop?: number, fWidth?: number, fHeight?: number, iZIndex?: number);
        public getEffect(): IEffect;
        public _setTarget(pTarget: IRenderTarget): void;
        public _updateImpl(): void;
        public setMapping(x: number, y: number, w: number, h: number): void;
        public _onRender(pTechnique: IRenderTechnique, iPass: number, pRenderable: IRenderableObject, pSceneObject: ISceneObject): void;
    }
}
declare module akra {
    /** Viewport that can supports 3D events, depth range, object picking. */
    interface IViewport3D extends IViewport {
        /** Get global post effects. */
        getEffect(): IEffect;
        /**
        * Propagate or not propagate viewport events to 3D objects.
        * @param bEnable Enable or Disable 3D events propagation.
        */
        enable3DEvents(bEnable?: boolean): void;
        /** @return TRUE - if events apply to objects in this viewport. */
        is3DEventsSupported(): boolean;
        /**
        * Manual call mouseout event for last focused object/renderable.
        */
        touch(): void;
        /**
        * Pick 3D object by screen position.
        *
        * @param pDept Pick results.
        * @return Picked object.
        */
        pick(x: number, y: number, pDest?: IPickedObject): IPickedObject;
        /** @return Scene object with screen postion (x, y); */
        getObject(x: number, y: number): ISceneObject;
        /** @return Renderable with screen postion (x, y); */
        getRenderable(x: number, y: number): IRenderableObject;
        /** Get screen depth for (x, y) postion. */
        getDepth(x: number, y: number): number;
        /** Get depth range for viewport. */
        getDepthRange(): IDepthRange;
        /**
        * Indicates whether the mouse is over the viewport.
        */
        isMouseCaptured(): boolean;
        /** Project point from world space to screen. */
        projectPoint(v3fPoint: IVec3, v3fDestination?: IVec3): IVec3;
        /** Unproject point fron screen to world space. */
        unprojectPoint(x: number, y: number, v3fDestination?: IVec3): IVec3;
        unprojectPoint(pPos: IPoint, v3fDestination?: IVec3): IVec3;
        /** Get render ID for (@x, @y) position. */
        _getRenderId(x: number, y: number): number;
    }
    /**  Viewport that can display skyboxes. */
    interface IViewportSkybox extends IViewport3D {
        /** Events occurring after the viewport changed skybox. */
        addedSkybox: ISignal<(pViewport: IViewport, pSkyTexture: ITexture) => void>;
        /** Get current skybox texture. */
        getSkybox(): ITexture;
        /** Set new skybox. */
        setSkybox(pSkyTexture: ITexture): void;
    }
    /** Viewport that can support antialiasing. */
    interface IViewportAntialising extends IViewport3D {
        /** Enable antialiasing. */
        setAntialiasing(bEnabled?: boolean): void;
        /** Is antaliasing enabled?
        * @return TRUE if anttialiasing enabled.
        */
        isAntialiased(): boolean;
    }
    /** Viewport that can support fog. */
    interface IViewportFogged extends IViewport3D {
        /** Enable fog. */
        setFog(bEnabled?: boolean): void;
        /** Is fog enabled?
        * @return TRUE if fog enabled.
        */
        isFogged(): boolean;
    }
    /** Viewport that can highligh objects. */
    interface IViewportHighlighting extends IViewport3D {
        /** Highlight object by render id. */
        highlight(iRid: number): void;
        /** Hightlight ISceneObject or/and IRenderableObject. */
        highlight(pObject: ISceneObject, pRenderable?: IRenderableObject): void;
        /** Hightlight render pair. */
        highlight(pPair: IRIDPair): void;
    }
    enum EShadingModel {
        BLINNPHONG = 0,
        PHONG = 1,
        PBS_SIMPLE = 2,
    }
    interface IShadedViewport extends IViewport3D {
        setShadingModel(eModel: EShadingModel): any;
        getShadingModel(): EShadingModel;
        getLightSources(): IObjectArray<ILightPoint>;
        setDefaultEnvironmentMap(pTexture: ITexture): void;
        getDefaultEnvironmentMap(): ITexture;
        getDepthTexture(): ITexture;
        setShadowEnabled(bValue: boolean): void;
        isShadowEnabled(): boolean;
        setTransparencySupported(bEnable: boolean): void;
        isTransparencySupported(): boolean;
        _getTransparencyViewport(): IShadedViewport;
        _setLightUniformsManual(bValue: boolean, pUniformsMap?: any): void;
    }
}
declare module akra {
    interface IDSViewport extends IShadedViewport, IViewportSkybox, IViewportAntialising, IViewportHighlighting, IViewportFogged {
        getColorTextures(): ITexture[];
        _getDeferredTexValue(iTex: number, x: number, y: number): IColor;
        getDepthTexture(): ITexture;
        getTextureWithObjectID(): ITexture;
        getView(): IRenderableObject;
    }
}
declare module akra {
    interface IOmniParameters extends ILightParameters {
        ambient: IColor;
        diffuse: IColor;
        specular: IColor;
        attenuation: IVec3;
    }
    interface IOmniLight extends ILightPoint {
        getParams(): IOmniParameters;
        getShadowCaster(): IShadowCaster[];
        getDepthTextureCube(): ITexture[];
        getRenderTarget(iFace: number): IRenderTarget;
        _prepareForLighting(pCamera: ICamera): boolean;
    }
}
declare module akra {
    interface IProjectParameters extends ILightParameters {
        ambient: IColor;
        diffuse: IColor;
        specular: IColor;
        attenuation: IVec3;
    }
    interface IProjectLight extends ILightPoint {
        getParams(): IProjectParameters;
        getShadowCaster(): IShadowCaster;
        getDepthTexture(): ITexture;
        getRenderTarget(): IRenderTarget;
        _prepareForLighting(pCamera: ICamera): boolean;
    }
}
declare module akra.render {
    class ViewportWithTransparencyMode extends Viewport {
        private _bTransparencyMode;
        public setTransparencyMode(bValue: boolean): void;
        public renderAsNormal(csMethod: string, pCamera: ICamera): void;
    }
}
declare module akra.render {
    class Viewport3D extends Viewport implements IViewport3D {
        private _pMousePositionLast;
        private _bMouseIsCaptured;
        private _b3DRequirePick;
        private _p3DEventPickLast;
        private _p3DEventPickPrev;
        private _p3DEventDragTarget;
        private _b3DEventsSupport;
        public setupSignals(): void;
        /** @copydoc IViewport3D::getEffect() */
        public getEffect(): IEffect;
        public update(): void;
        /** @copydoc IViewport3D::enable3DEvents() */
        public enable3DEvents(bEnable?: boolean): void;
        /** @copydoc IViewport3D::is3DEventsSupported() */
        public is3DEventsSupported(): boolean;
        /** @copydoc IViewport3D::touch() */
        public touch(): void;
        /** @copydoc IViewport3D::pick() */
        public pick(x: number, y: number, pDest?: IPickedObject): IPickedObject;
        /** @copydoc IViewport3D::getObject() */
        public getObject(x: number, y: number): ISceneObject;
        /** @copydoc IViewport3D::getRenderable() */
        public getRenderable(x: number, y: number): IRenderableObject;
        public _getDepthRangeImpl(): IDepthRange;
        /** @copydoc IViewport3D::getDepth() */
        public getDepth(x: number, y: number): number;
        /** @copydoc IViewport3D::getDepthRange() */
        public getDepthRange(): IDepthRange;
        /** @copydoc IViewport3D::isMouseCaptured() */
        public isMouseCaptured(): boolean;
        public projectPoint(v3fPoint: IVec3, v3fDestination?: IVec3): IVec3;
        public unprojectPoint(x: number, y: number, v3fDestination?: IVec3): IVec3;
        public unprojectPoint(pPos: IPoint, v3fDestination?: IVec3): IVec3;
        /** @return Cached pick result, limited - one pick per frame maximum. */
        public _pick(x: number, y: number): IPickedObject;
        /** @return Is pick required for current frame? */
        private isPickResultRecalcNeeded();
        public _handleMouseInout(pCurr: IRIDPair, x: number, y: number): IRIDPair;
        public _keepLastMousePosition(x: number, y: number): void;
        public _getLastMousePosition(): IPoint;
        public _setUserEventDragTarget(pObject?: ISceneObject, pRenderable?: IRenderableObject): void;
        public _getUserEventDragTarget(): IRIDPair;
        public _setMouseCaptured(bValue: boolean): void;
        public _getRenderId(x: number, y: number): number;
        public _onRender(pTechnique: IRenderTechnique, iPass: number, pRenderable: IRenderableObject, pSceneObject: ISceneObject): void;
        static DraggingSignal: typeof Signal;
        static DragstartSignal: typeof Signal;
        static DragstopSignal: typeof Signal;
        static MousedownSignal: typeof Signal;
        static MouseupSignal: typeof Signal;
        static MouseoverSignal: typeof Signal;
        static MouseoutSignal: typeof Signal;
        static MousewheelSignal: typeof Signal;
        static MousemoveSignal: typeof Signal;
        static ClickSignal: typeof Signal;
        private static PICK_CONTAINER;
    }
}
declare module akra {
    interface ISunParameters extends ILightParameters {
        eyePosition: IVec3;
        sunDir: IVec3;
        groundC0: IVec3;
        groundC1: IVec3;
        hg: IVec3;
    }
    interface ISunLight extends ILightPoint {
        getParams(): ISunParameters;
        getSkyDome(): ISceneModel;
        setSkyDome(pSkyDome: ISceneModel): void;
        updateSunDirection(v3fSunDir: IVec3): void;
        getDepthTexture(): ITexture;
        getShadowCaster(): IShadowCaster;
    }
}
declare module akra.render {
    interface IUniform {
    }
    class LightData {
        public DIFFUSE: IVec4;
        public AMBIENT: IVec4;
        public SPECULAR: IVec4;
        public POSITION: IVec3;
        public ATTENUATION: IVec3;
        public set(pLightParam: ILightParameters, v3fPosition: IVec3): LightData;
    }
    class SunLightData {
        public SUN_DIRECTION: IVec3;
        public EYE_POSITION: IVec3;
        public GROUNDC0: IVec3;
        public GROUNDC1: IVec3;
        public HG: IVec3;
        public SKY_DOME_ID: number;
        public set(pSunParam: ISunParameters, iSunDomeId: number): SunLightData;
    }
    class UniformOmni implements IUniform {
        public LIGHT_DATA: LightData;
        public setLightData(pLightParam: IOmniParameters, v3fPosition: IVec3): UniformOmni;
        private static _pBuffer;
        private static _iElement;
        static temp(): IUniform;
    }
    class UniformProject implements IUniform {
        public LIGHT_DATA: LightData;
        public SHADOW_MATRIX: IMat4;
        public setLightData(pLightParam: IProjectParameters, v3fPosition: IVec3): UniformProject;
        public setMatrix(m4fMatrix: IMat4): UniformProject;
        private static _pBuffer;
        private static _iElement;
        static temp(): IUniform;
    }
    class UniformProjectShadow implements IUniform {
        public LIGHT_DATA: LightData;
        public TO_LIGHT_SPACE: IMat4;
        public REAL_PROJECTION_MATRIX: IMat4;
        public OPTIMIZED_PROJECTION_MATRIX: IMat4;
        public SHADOW_SAMPLER: IAFXSamplerState;
        public setLightData(pLightParam: IProjectParameters, v3fPosition: IVec3): UniformProjectShadow;
        public setMatrix(m4fToLightSpace: IMat4, m4fRealProj: IMat4, m4fOptimizedProj: IMat4): UniformProjectShadow;
        public setSampler(pTexture: ITexture): UniformProjectShadow;
        private static _pBuffer;
        private static _iElement;
        static temp(): IUniform;
    }
    class UniformOmniShadow implements IUniform {
        public LIGHT_DATA: LightData;
        public TO_LIGHT_SPACE: IMat4[];
        public OPTIMIZED_PROJECTION_MATRIX: IMat4[];
        public SHADOW_SAMPLER: IAFXSamplerState[];
        public setLightData(pLightParam: IOmniParameters, v3fPosition: IVec3): UniformOmniShadow;
        public setMatrix(m4fToLightSpace: IMat4, m4fOptimizedProj: IMat4, index: number): UniformOmniShadow;
        public setSampler(pTexture: ITexture, index: number): UniformOmniShadow;
        private static _pBuffer;
        private static _iElement;
        static temp(): IUniform;
    }
    class UniformSun implements IUniform {
        public LIGHT_DATA: SunLightData;
        public setLightData(pSunParam: ISunParameters, iSunDomeId: number): UniformSun;
        private static _pBuffer;
        private static _iElement;
        static temp(): IUniform;
    }
    class UniformSunShadow implements IUniform {
        public LIGHT_DATA: SunLightData;
        public SHADOW_SAMPLER: IAFXSamplerState;
        public TO_LIGHT_SPACE: IMat4;
        public OPTIMIZED_PROJECTION_MATRIX: IMat4;
        public setLightData(pSunParam: ISunParameters, iSunDomeId: number): UniformSunShadow;
        public setSampler(pTexture: ITexture): UniformSunShadow;
        public setMatrix(m4fToLightSpace: IMat4, m4fOptimizedProj: IMat4): UniformSunShadow;
        private static _pBuffer;
        private static _iElement;
        static temp(): IUniform;
    }
    class UniformOmniRestricted extends UniformOmni {
        public POINT0: math.Vec3;
        public POINT1: math.Vec3;
        public TO_LIGHT_SPACE: math.Mat4;
        public setRestrictedData(pBound: IRect3d, m4fToLightSpace: IMat4): void;
        private static _pBufferR;
        private static _iElementR;
        static temp(): IUniform;
    }
    interface UniformMap {
        omni: UniformOmni[];
        project: UniformProject[];
        sun: UniformSun[];
        omniShadows: UniformOmniShadow[];
        projectShadows: UniformProjectShadow[];
        sunShadows: UniformSunShadow[];
        textures: ITexture[];
        samplersOmni: IAFXSamplerState[];
        samplersProject: IAFXSamplerState[];
        samplersSun: IAFXSamplerState[];
        omniRestricted: UniformOmniRestricted[];
    }
}
declare module akra.render {
    class ShadedViewport extends Viewport3D implements IShadedViewport {
        public _pLightingUnifoms: UniformMap;
        public _pLightPoints: IObjectArray<ILightPoint>;
        public _pTextureForTransparentObjects: ITexture;
        private _eShadingModel;
        private _pDefaultEnvMap;
        private _isTransparencySupported;
        private _isShadowEnabled;
        private _bManualUpdateForLightUniforms;
        private _pDepthBufferTexture;
        public getDepthTexture(): ITexture;
        public setDepthTexture(pTexture: ITexture): void;
        public getLightSources(): IObjectArray<ILightPoint>;
        public setShadingModel(eModel: EShadingModel): void;
        public getShadingModel(): EShadingModel;
        public setDefaultEnvironmentMap(pEnvMap: ITexture): void;
        public getDefaultEnvironmentMap(): ITexture;
        public setTransparencySupported(bEnable: boolean): void;
        public isTransparencySupported(): boolean;
        public setShadowEnabled(bValue: boolean): void;
        public isShadowEnabled(): boolean;
        public _setLightUniformsManual(bValue: boolean, pUniformsMap?: any): void;
        public _getTransparencyViewport(): IShadedViewport;
        public _isManualUpdateForLightUniforms(): boolean;
        public createLightingUniforms(pCamera: ICamera, pLightPoints: IObjectArray<ILightPoint>, pUniforms: UniformMap): void;
        public resetUniforms(): void;
        public initTextureForTransparentObjects(): void;
    }
}
declare module akra.data {
    class VertexDeclaration implements IVertexDeclaration {
        public stride: number;
        private _pElements;
        public getLength(): number;
        constructor(...pElements: IVertexElementInterface[]);
        constructor(pElements?: IVertexElementInterface[]);
        public element(i: number): IVertexElement;
        public append(...pElements: IVertexElementInterface[]): boolean;
        public append(pElements?: IVertexElementInterface[]): boolean;
        public _update(): boolean;
        public extend(decl: IVertexDeclaration): boolean;
        public hasSemantics(sSemantics: string): boolean;
        public findElement(sSemantics: string, iCount?: number): IVertexElement;
        public clone(): IVertexDeclaration;
        public toString(): string;
        static normalize(): IVertexDeclaration;
        static normalize(pElement: IVertexElement): IVertexDeclaration;
        static normalize(pElements: IVertexElementInterface[]): IVertexDeclaration;
        static normalize(pDecl: IVertexDeclaration): IVertexDeclaration;
    }
}
declare module akra.render {
    class Screen extends RenderableObject {
        public _pBuffer: IRenderDataCollection;
        constructor(pRenderer: IRenderer, pCollection?: IRenderDataCollection);
    }
}
declare module akra {
    interface IRenderTexture extends IRenderTarget {
        copyContentsToMemory(pDest: IPixelBox, pBuffer: EFramebuffer): void;
        suggestPixelFormat(): EPixelFormats;
        getPixelBuffer(): IPixelBuffer;
    }
}
declare module akra.pool.resources {
    class HardwareBuffer extends ResourcePoolItem implements IHardwareBuffer {
        public _iFlags: number;
        public _isLocked: boolean;
        /** Lock byte offset. */
        public _iLockStart: number;
        /** Lock byte size. */
        public _iLockSize: number;
        public _pBackupCopy: HardwareBuffer;
        public _pBackupUpdated: boolean;
        public _bIgnoreHardwareUpdate: boolean;
        public getByteLength(): number;
        public getLength(): number;
        constructor();
        public isValid(): boolean;
        public isDynamic(): boolean;
        public isStatic(): boolean;
        public isStream(): boolean;
        public isReadable(): boolean;
        public isBackupPresent(): boolean;
        public isSoftware(): boolean;
        public isAligned(): boolean;
        public isLocked(): boolean;
        public clone(pSrc: IHardwareBuffer): boolean;
        public getFlags(): number;
        public readData(ppDest: ArrayBufferView): boolean;
        public readData(iOffset: number, iSize: number, ppDest: ArrayBufferView): boolean;
        public writeData(pData: Uint8Array, iOffset?: number, iSize?: number, bDiscardWholeBuffer?: boolean): boolean;
        public writeData(pData: ArrayBufferView, iOffset?: number, iSize?: number, bDiscardWholeBuffer?: boolean): boolean;
        public copyData(pSrcBuffer: IHardwareBuffer, iSrcOffset: number, iDstOffset: number, iSize: number, bDiscardWholeBuffer?: boolean): boolean;
        public create(iSize: number, iFlags?: number): boolean;
        public destroy(): void;
        public resize(iSize: number): boolean;
        public lock(iLockFlags: number): any;
        public lock(iOffset: number, iSize: number, iLockFlags?: number): any;
        public unlock(): void;
        public restoreFromBackup(): boolean;
        public createResource(): boolean;
        public destroyResource(): boolean;
        public restoreResource(): boolean;
        public disableResource(): boolean;
        public lockImpl(iOffset: number, iSize: number, iLockFlags: number): any;
        public unlockImpl(): void;
        public copyBackupToRealImpl(pRealData: any, pBackupData: any, iLockFlags: number): void;
    }
}
declare module akra.webgl {
    class WebGLPixelBuffer extends pool.resources.HardwareBuffer implements IPixelBuffer {
        public _iWidth: number;
        public _iHeight: number;
        public _iDepth: number;
        public _iRowPitch: number;
        public _iSlicePitch: number;
        public _eFormat: EPixelFormats;
        public _pCurrentLock: IPixelBox;
        public _pLockedBox: IBox;
        public _iCurrentLockFlags: number;
        public _pBuffer: IPixelBox;
        public _iWebGLInternalFormat: number;
        public _iByteSize: number;
        public getByteLength(): number;
        public getWidth(): number;
        public getHeight(): number;
        public getDepth(): number;
        public getFormat(): EPixelFormats;
        constructor();
        public upload(pData: IPixelBox, pDestBox: IBox): void;
        public download(pData: IPixelBox): void;
        public _bindToFramebuffer(pAttachment: number, iZOffset: number): void;
        public _getWebGLFormat(): number;
        public _clearRTT(iZOffset: number): void;
        public reset(): void;
        public reset(iSize: number): void;
        public reset(iWidth: number, iHeight: number): void;
        public create(iFlags: number): boolean;
        public create(iWidth: number, iHeight: number, iDepth: number, eFormat: EPixelFormats, iFlags: number): boolean;
        public destroy(): void;
        public destroyResource(): boolean;
        public readData(ppDest: ArrayBufferView): boolean;
        public readData(iOffset: number, iSize: number, ppDest: ArrayBufferView): boolean;
        public writeData(pData: Uint8Array, iOffset?: number, iSize?: number, bDiscardWholeBuffer?: boolean): boolean;
        public writeData(pData: ArrayBuffer, iOffset?: number, iSize?: number, bDiscardWholeBuffer?: boolean): boolean;
        public readPixels(pDestBox: IPixelBox): boolean;
        public blit(pSource: IPixelBuffer): boolean;
        public blit(pSource: IPixelBuffer, pSrcBox: IBox, pDestBox: IBox): boolean;
        public unwrapFromCubeTexture(pCubeTex: ITexture): boolean;
        public blitFromMemory(pSource: IPixelBox): boolean;
        public blitFromMemory(pSource: IPixelBox, pDestBox: IBox): boolean;
        public blitToMemory(pDest: IPixelBox): boolean;
        public blitToMemory(pSrcBox: IBox, pDest: IPixelBox): boolean;
        public getRenderTarget(): IRenderTarget;
        public lock(iLockFlags: number): IPixelBox;
        public lock(pLockBox: IBox, iLockFlags?: number): IPixelBox;
        public lock(iOffset: number, iSize: number, iLockFlags?: number): IPixelBox;
        public allocateBuffer(): void;
        public freeBuffer(): void;
        public lockImpl(iOffset: number, iSize: number, iLockFlags: number): any;
        public lockImpl(pLockBox: IBox, iLockFlags: number): IPixelBox;
        public unlockImpl(): void;
    }
}
declare module akra.webgl {
    function computeLog(iValue: number): number;
    class WebGLTextureBuffer extends WebGLPixelBuffer implements IPixelBuffer {
        public _eTarget: number;
        public _eFaceTarget: number;
        public _pWebGLTexture: WebGLTexture;
        public _iFace: number;
        public _iLevel: number;
        public _bSoftwareMipmap: boolean;
        public _pRTTList: IRenderTexture[];
        public _clearRTT(iZOffset: number): void;
        public reset(): void;
        public reset(iSize: number): void;
        public reset(iWidth: number, iHeight: number): void;
        private notifyResized();
        public create(iFlags: number): boolean;
        public create(iWidth: number, iHeight: number, iDepth: number, eFormat: EPixelFormats, iFlags: number): boolean;
        public create(eTarget: number, pTexture: WebGLTexture, iWidth: number, iHeight: number, iInternalFormat: number, iFormat: number, iFace: number, iLevel: number, iFlags: number, bSoftwareMipmap: boolean): boolean;
        public destroy(): void;
        public unwrapFromCubeTexture(pCubeTex: WebGLInternalTexture): boolean;
        public upload(pData: IPixelBox, pDestBox: IBox): void;
        public download(pData: IPixelBox): void;
        public buildMipmaps(pData: IPixelBox): void;
        public _bindToFramebuffer(iAttachment: number, iZOffset: number): void;
        public _copyFromFramebuffer(iZOffset: number): void;
        public _getTarget(): number;
        public _getWebGLTexture(): WebGLTexture;
        public _getFaceTarget(): number;
        public blit(pSource: IPixelBuffer): boolean;
        public blit(pSource: IPixelBuffer, pSrcBox: IBox, pDestBox: IBox): boolean;
        private static copyTex2DImageByProgram(pProgram, pDestBox, eFormat, pSource, pSrcBox?);
        public blitFromTexture(pSource: WebGLTextureBuffer, pSrcBox: IBox, pDestBox: IBox): boolean;
        public blitFromMemory(pSource: IPixelBox): boolean;
        public blitFromMemory(pSource: IPixelBox, pDestBox?: IBox): boolean;
        public getRenderTarget(): IRenderTarget;
        public getRenderTarget(iZOffest: number): IRenderTarget;
        public resize(iSize: number): boolean;
    }
}
declare module akra.webgl {
    class WebGLInternalTexture extends pool.resources.Texture {
        private _pSurfaceList;
        private _pWebGLTexture;
        public getWebGLTexture(): WebGLTexture;
        constructor();
        public _getWebGLTextureTarget(): number;
        private _getWebGLTextureParameter(eParam);
        private _getWebGLTextureParameterValue(eValue);
        private _getAkraTextureParameterValue(iWebGLValue);
        public reset(): void;
        public reset(iSize: number): void;
        public reset(iWidth: number, iHeight: number): void;
        public _setFilterInternalTexture(eParam: ETextureParameters, eValue: ETextureFilters): boolean;
        public _setWrapModeInternalTexture(eParam: ETextureParameters, eValue: ETextureWrapModes): boolean;
        public _getFilterInternalTexture(eParam: ETextureParameters): ETextureFilters;
        public _createInternalTextureImpl(cFillColor?: IColor): boolean;
        public freeInternalTextureImpl(): boolean;
        private _createSurfaceList();
        public getBuffer(iFace?: number, iMipmap?: number): IPixelBuffer;
        public createRenderTexture(): boolean;
    }
}
declare module akra.webgl {
    function getDepthRange(pDepthTexture: ITexture): IDepthRange;
}
declare module akra {
    interface ILightGraph extends IDisplayList<ILightPoint> {
    }
}
declare module akra {
    interface IListExplorerFunc<T> {
        (data: T, index?: number): boolean;
    }
    interface IObjectListItem<T> {
        next: IObjectListItem<T>;
        prev: IObjectListItem<T>;
        data: T;
    }
    /** ObjectList export interface. */
    interface IObjectList<T> {
        /** Number of elements in list */
        getLength(): number;
        /** First element in list */
        getFirst(): T;
        /** Last element in list */
        getLast(): T;
        /** Current element in list */
        getCurrent(): T;
        /** Lock list for midifications. */
        lock(): void;
        /** Unlock list */
        unlock(): void;
        /** Is list locked ? */
        isLocked(): boolean;
        /** Set current element to <n> position. */
        seek(n?: number): IObjectList<T>;
        /** Get next element */
        next(): T;
        /** Get prev element */
        prev(): T;
        /** Push element to end of list. */
        push(element: T): IObjectList<T>;
        /** Pop element from end of list. */
        pop(): T;
        /** Add element to list head. */
        prepend(element: T): IObjectList<T>;
        /** Add element from array. */
        fromArray(elements: T[], iOffset?: number, iSize?: number): IObjectList<T>;
        /** Insert element before <n> element. */
        insert(n: number, data: T): IObjectList<T>;
        /** Get valuie of <n> element */
        value(n: number, defaultValue?: T): T;
        /** Get index of element with given data */
        indexOf(element: T, from?: number): number;
        /** Get sub list from this list */
        mid(pos?: number, size?: number): IObjectList<T>;
        /** slice from array */
        slice(start?: number, end?: number): IObjectList<T>;
        /** Move element from <from> postion to <to> position.*/
        move(from: number, to: number): IObjectList<T>;
        /** Replace data of <n> element. */
        replace(pos: number, value: T): IObjectList<T>;
        /** Erase element with number <n>. */
        erase(pos: number): IObjectList<T>;
        /** Erase elements from begin to end. */
        erase(begin: number, end: number): IObjectList<T>;
        /** Is list contains data with <value>?*/
        contains(value: T): boolean;
        /** Get data of <n> item and remove it. */
        takeAt(pos: number): T;
        /** Get data of first item and remove it. */
        takeFirst(): T;
        /** Get data of last item and remove it. */
        takeLast(): T;
        /** Get data of current item and remove it. */
        takeCurrent(): T;
        /** Remove <n> item. */
        removeAt(n: number): void;
        /** Remove one lement with data <element>. */
        removeOne(element: T): void;
        /** Remove all lement with data <element>. */
        removeAll(element: T): number;
        /** Swap items. */
        swap(i: number, j: number): IObjectList<T>;
        /** Add another list to this */
        add(list: IObjectList<T>): IObjectList<T>;
        /** Is this list equal to <list>. */
        isEqual(list: IObjectList<T>): boolean;
        /** Clear list. */
        clear(): IObjectList<T>;
        /** For each loop. */
        forEach(fn: IListExplorerFunc<T>): void;
    }
}
declare module akra {
    interface IOcTreeNode extends IUnique {
        /** Parent tree */
        tree: IOcTree;
        /** Level of node */
        level: number;
        /** Index in array of nodes in tree */
        index: number;
        /** First SceneObject in this node */
        membersList: IObjectList<ISceneObject>;
        /** Rect of node in real world */
        worldBounds: IRect3d;
        /** Link ro previous node in tree */
        rearNodeLink: IOcTreeNode;
        childrenList: IObjectList<IOcTreeNode>[];
        addMember(pMember: ISceneObject): void;
        removeMember(pMember: ISceneObject): void;
        toString(): string;
    }
}
declare module akra {
    interface IOcTree extends IDisplayList<ISceneObject> {
        getDepth(): number;
        getWorldScale(): IVec3;
        getWorldOffset(): IVec3;
        create(pWorldBoundingBox: IRect3d, iDepth: number, nNode?: number): void;
        isReady(): boolean;
        findTreeNode(pObject: ISceneObject): IOcTreeNode;
        findTreeNodeByRect(iX0: number, iX1: number, iY0: number, iY1: number, iZ0: number, iZ1: number): IOcTreeNode;
        getAndSetFreeNode(iLevel: number, iComposedIndex: number, pParentNode: IOcTreeNode): IOcTreeNode;
        deleteNodeFromTree(pNode: IOcTreeNode): void;
        _toSimpleObject(pNode?: IOcTreeNode): any;
    }
}
declare module akra.scene {
    class SceneObject extends SceneNode implements ISceneObject {
        public worldBoundsUpdated: ISignal<(pObject: ISceneObject) => void>;
        public click: ISignal<(pObject: ISceneObject, pViewport: IViewport, pRenderable: IRenderableObject, x: number, y: number) => void>;
        public mousemove: ISignal<(pObject: ISceneObject, pViewport: IViewport, pRenderable: IRenderableObject, x: number, y: number) => void>;
        public mousedown: ISignal<(pObject: ISceneObject, pViewport: IViewport, pRenderable: IRenderableObject, x: number, y: number) => void>;
        public mouseup: ISignal<(pObject: ISceneObject, pViewport: IViewport, pRenderable: IRenderableObject, x: number, y: number) => void>;
        public mouseover: ISignal<(pObject: ISceneObject, pViewport: IViewport, pRenderable: IRenderableObject, x: number, y: number) => void>;
        public mouseout: ISignal<(pObject: ISceneObject, pViewport: IViewport, pRenderable: IRenderableObject, x: number, y: number) => void>;
        public mousewheel: ISignal<(pObject: ISceneObject, pViewport: IViewport, pRenderable: IRenderableObject, x: number, y: number, fDelta: number) => void>;
        public dragstart: ISignal<(pObject: ISceneObject, pViewport: IViewport, pRenderable: IRenderableObject, x: number, y: number) => void>;
        public dragstop: ISignal<(pObject: ISceneObject, pViewport: IViewport, pRenderable: IRenderableObject, x: number, y: number) => void>;
        public dragging: ISignal<(pObject: ISceneObject, pViewport: IViewport, pRenderable: IRenderableObject, x: number, y: number) => void>;
        public _iObjectFlags: number;
        public _iViewModes: number;
        public _pLocalBounds: IRect3d;
        public _pWorldBounds: IRect3d;
        private _iUserEvents;
        constructor(pScene: IScene3d, eType?: EEntityTypes);
        public setupSignals(): void;
        public enableSupportForUserEvent(iType: number): number;
        public isUserEventSupported(eType: EUserEvents): boolean;
        public getTotalRenderable(): number;
        public getWorldBounds(): IRect3d;
        public getLocalBounds(): IRect3d;
        public accessLocalBounds(): IRect3d;
        public getShadow(): boolean;
        public setShadow(bValue: boolean): void;
        public setBillboard(bValue: boolean): void;
        public getBillboard(): boolean;
        public isBillboard(): boolean;
        public getRenderable(i?: number): IRenderableObject;
        public getRenderID(): number;
        /**
        * Get unique render id.
        * Render ID used to identify the object in each pixel of viewport/screen.
        * @param iRenderable Number of renderable object.
        */
        public getRenderID(iRenderable: number): number;
        public isWorldBoundsNew(): boolean;
        public prepareForUpdate(): void;
        public update(): boolean;
        public recalcWorldBounds(): boolean;
        public _setWorldBoundsUpdated(): number;
        public getObjectFlags(): number;
        public prepareForRender(pViewport: IViewport): void;
        public toString(isRecursive?: boolean, iDepth?: number): string;
        static isSceneObject(pEntity: IEntity): boolean;
    }
}
declare module akra.model {
    class Skin implements ISkin {
        public guid: number;
        /**
        * @copydoc ISkin::transformed
        */
        public transformed: ISignal<(pSkin: ISkin) => void>;
        private _pMesh;
        private _pSkeleton;
        private _pNodeNames;
        private _m4fBindMatrix;
        private _pBoneTransformMatrices;
        /**
        * Common buffer for all transform matrices.
        * _pBoneOffsetMatrixBuffer = [_pBoneTransformMatrices[0], ..., _pBoneTransformMatrices[N]]
        */
        private _pBoneOffsetMatrixBuffer;
        private _pBoneOffsetMatrices;
        /**
        * Pointers to nodes, that affect to this skin.
        */
        private _pAffectingNodes;
        /**
        * Format:
        * BONE_INF_COUNT - number of bones, that influence to the vertex.
        * BONE_INF_LOC - address of influence, pointer to InfData structire list.
        * ..., [BONE_INF_COUNT: float, BONE_INF_LOC: float], ...
        *
        */
        private _pInfMetaData;
        /**
        * Format:
        * BONE_INF_DATA - bone matrix address, pointer to BONE_MATRIX list
        * BONE_WEIGHT - bone weight
        * ..., [BONE_INF_DATA: float, BONE_WEIGHT: float], ...
        */
        private _pInfData;
        /**
        * Format:
        * ..., [BONE_MATRIX: matrix4], ...
        */
        private _pBoneTransformMatrixData;
        private _pWeights;
        /**
        * Links to VertexData, that contain meta from this skin.
        */
        private _pTiedData;
        constructor(pMesh: IMesh);
        public setupSignals(): void;
        public getData(): IRenderDataCollection;
        public getTotalBones(): number;
        public getBoneName(iBone: number): string;
        public getBoneIndex(sBone: string): number;
        public getSkeleton(): ISkeleton;
        public setBindMatrix(m4fMatrix: IMat4): void;
        public getBindMatrix(): IMat4;
        /**
        * Get scene node that are affected by this skin.
        * Nodes are arranged in the order they are located in video memory.
        * @param iNode Node index.
        */
        public getAffectedNode(iNode: number): ISceneNode;
        public getBoneOffsetMatrix(iBone: number): IMat4;
        public getBoneOffsetMatrix(sBoneName: string): IMat4;
        public setSkeleton(pSkeleton: ISkeleton): boolean;
        public attachToScene(pRootNode: ISceneNode): boolean;
        public setBoneNames(pNames: string[]): boolean;
        public setBoneOffsetMatrices(pMatrices: IMat4[]): void;
        public setWeights(pWeights: Float32Array): boolean;
        public getInfluenceMetaData(): IVertexData;
        public getInfluences(): IVertexData;
        public setInfluences(pInfluencesCount: number[], pInfluences: Float32Array): boolean;
        public setVertexWeights(pInfluencesCount: number[], pInfluences: Float32Array, pWeights: Float32Array): boolean;
        public applyBoneMatrices(bForce?: boolean): boolean;
        public isReady(): boolean;
        public getBoneTransforms(): IVertexData;
        public isAffect(pData: IVertexData): boolean;
        public _attach(pData: IVertexData): void;
    }
    function createSkin(pMesh: IMesh): ISkin;
}
declare module akra.model {
    function createMesh(pEngine: IEngine, sName?: string, eOptions?: number, pDataBuffer?: IRenderDataCollection): IMesh;
}
declare module akra.scene {
    class SceneModel extends SceneObject implements ISceneModel {
        private _pMesh;
        private _bShow;
        constructor(pScene: IScene3d);
        public getVisible(): boolean;
        public setVisible(bValue: boolean): void;
        public getMesh(): IMesh;
        public setMesh(pMesh: IMesh): void;
        public getTotalRenderable(): number;
        public getRenderable(i?: number): IRenderableObject;
        public getShadow(): boolean;
        public setShadow(bValue: boolean): void;
        public isVisible(): boolean;
        public toString(isRecursive?: boolean, iDepth?: number): string;
        public recalcWorldBounds(): boolean;
        static isModel(pEntity: IEntity): boolean;
    }
}
declare module akra.scene {
    class DisplayList<T extends ISceneNode> implements IDisplayList<T> {
        public guid: number;
        public _pScene: IScene3d;
        public _sName: string;
        public getName(): string;
        constructor(sName: string);
        public setupSignals(): void;
        public _onNodeAttachment(pScene: IScene3d, pNode: T): void;
        public _onNodeDetachment(pScene: IScene3d, pNode: T): void;
        public attachObject(pNode: T): void;
        public detachObject(pNode: T): void;
        public _setup(pScene: IScene3d): void;
        public _findObjects(pCamera: ICamera, pResultArray?: IObjectArray<T>, bQuickSearch?: boolean): IObjectArray<T>;
    }
}
declare module akra.util {
    class ObjectList<T> implements IObjectList<T> {
        public _pHead: IObjectListItem<T>;
        public _pTail: IObjectListItem<T>;
        public _pCurrent: IObjectListItem<T>;
        public _iLength: number;
        public _bLock: boolean;
        public getLength(): number;
        public getFirst(): T;
        public getLast(): T;
        public getCurrent(): T;
        public lock(): void;
        public unlock(): void;
        public isLocked(): boolean;
        public value(n: number): T;
        constructor(pData?: T[]);
        public indexOf(pData: T, iFrom?: number): number;
        public mid(iPos?: number, iSize?: number): IObjectList<T>;
        public slice(iStart?: number, iEnd?: number): IObjectList<T>;
        public move(iFrom: number, iTo: number): IObjectList<T>;
        public replace(iPos: number, pData: T): IObjectList<T>;
        public erase(pos: number): IObjectList<T>;
        public erase(begin: number, end: number): IObjectList<T>;
        public contains(pData: T): boolean;
        public removeAt(n: number): void;
        public removeOne(pData: T): void;
        public removeAll(pData: T): number;
        public swap(i: number, j: number): IObjectList<T>;
        public add(pList: IObjectList<T>): IObjectList<T>;
        public seek(n?: number): IObjectList<T>;
        public next(): T;
        public prev(): T;
        public push(pElement: T): IObjectList<T>;
        public takeAt(n: number): T;
        private pullElement(pItem);
        public takeFirst(): T;
        public takeLast(): T;
        public takeCurrent(isPrev?: boolean): T;
        public pop(): T;
        public prepend(pElement: T): IObjectList<T>;
        private find(n);
        private releaseItem(pItem);
        private createItem();
        public fromArray(elements: T[], iOffset?: number, iSize?: number): IObjectList<T>;
        public insert(n: number, pData: T): IObjectList<T>;
        public isEqual(pList: IObjectList<T>): boolean;
        public clear(): IObjectList<T>;
        public forEach(fn: IListExplorerFunc<T>): void;
        private static _pool;
    }
}
declare module akra.scene {
    /** OcTreeNode class represent node of OcTree */
    class OcTreeNode implements IOcTreeNode {
        public guid: number;
        /** Parent tree */
        public tree: IOcTree;
        /** Level of node */
        public level: number;
        /** Index in array of nodes in tree */
        public index: number;
        /** First SceneObject in this node */
        public membersList: IObjectList<ISceneObject>;
        /** Rect of node in real world */
        public worldBounds: IRect3d;
        /** Link to previous node in tree */
        public rearNodeLink: IOcTreeNode;
        public childrenList: IObjectList<IOcTreeNode>[];
        constructor(pTree: IOcTree);
        /**
        * Add object in this node
        */
        public addMember(pObject: ISceneObject): void;
        /**
        * Remove member object from node and release node if there are not members in it
        */
        public removeMember(pObject: ISceneObject): void;
        public toString(): string;
        public OcTreeObjectMoved(pObject: ISceneObject): void;
    }
    class OcTreeRootNode extends OcTreeNode implements IOcTreeNode {
        public _pBasicWorldBounds: IRect3d;
        constructor(pTree: IOcTree);
        public addMember(pMember: ISceneObject): void;
        public removeMember(pObject: ISceneObject): void;
        public _updateNodeBoundingBox(): void;
    }
}
declare module akra.scene {
    class OcTree extends DisplayList<ISceneObject> implements IOcTree {
        public _pHead: IOcTreeNode;
        /** Size of world bounding box */
        public _v3fWorldExtents: IVec3;
        /** Negate min point of bounding box */
        public _v3fWorldScale: IVec3;
        /** Value of relation between (1024,1024,1024) and bounding box size */
        public _v3fWorldOffset: IVec3;
        /** Maximum depth of tree. Value set when you call OcTree::create() */
        public _iDepth: number;
        /**
        * Список свободных узлов(объектов OcTreeNode).
        * Необходимо для экономии ресурсов памяти и чтобы не делать лишних delete
        */
        public _pFreeNodePool: IOcTreeNode[];
        constructor();
        public getDepth(): number;
        public getWorldScale(): IVec3;
        public getWorldOffset(): IVec3;
        /**
        * Create
        */
        public create(pWorldBoundingBox: IRect3d, iDepth: number, nNodes?: number): void;
        /**
        * is any levels of tree are availeable(some object in a tree)
        */
        public isReady(): boolean;
        /**
        * find node
        */
        public findTreeNode(pObject: ISceneObject): IOcTreeNode;
        /**
        * Find tree node by Rect
        */
        public findTreeNodeByRect(iX0: number, iX1: number, iY0: number, iY1: number, iZ0: number, iZ1: number): IOcTreeNode;
        private _parentTest(iLevel, iParentIndex, iChildIndex);
        private _findNodeLevel(iX0, iX1, iY0, iY1, iZ0, iZ1);
        /**
        * Get free node.
        * Get it from _pFreeNodePull or create new OcTreeNode if it`s empty and set his data.
        */
        public getAndSetFreeNode(iLevel: number, iComposedIndex: number, pParentNode: IOcTreeNode): IOcTreeNode;
        /**
        * Delete node from tree
        */
        public deleteNodeFromTree(pNode: IOcTreeNode): void;
        public _findObjects(pCamera: ICamera, pResultArray?: IObjectArray<ISceneObject>, bFastSearch?: boolean): IObjectArray<ISceneObject>;
        public _buildSearchResultsByRect(pSearchRect: IRect3d, pNode: IOcTreeNode, pResultList: IObjectArray<ISceneObject>): void;
        public _buildSearchResultsByRectAndFrustum(pSearchRect: IRect3d, pFrustum: IFrustum, pNode: IOcTreeNode, pResultList: IObjectArray<ISceneObject>): void;
        public _includeAllTreeSubbranch(pNode: IOcTreeNode, pResultList: IObjectArray<ISceneObject>): void;
        public attachObject(pNode: ISceneNode): void;
        public detachObject(pNode: ISceneNode): void;
        public _toSimpleObject(pNode?: IOcTreeNode): any;
    }
}
declare module akra.scene.light {
    class LightPoint extends SceneNode implements ILightPoint {
        public _isShadowCaster: boolean;
        public _isEnabled: boolean;
        public _iMaxShadowResolution: number;
        public _eLightType: ELightTypes;
        public _pOptimizedCameraFrustum: IFrustum;
        public _pRestrictedLocalBounds: IRect3d;
        public _isRestricted: boolean;
        public _iLightPointFlags: number;
        public getParams(): ILightParameters;
        public getLightType(): ELightTypes;
        public getOptimizedCameraFrustum(): IFrustum;
        public isEnabled(): boolean;
        public setEnabled(bValue: boolean): void;
        public isShadowCaster(): boolean;
        public setShadowCaster(bValue: boolean): void;
        public getLightingDistance(): number;
        public setLightingDistance(fDistance: number): void;
        public isRestricted(): boolean;
        public setRestrictedLocalBounds(pBox: IRect3d): void;
        public getRestrictedLocalBounds(): IRect3d;
        constructor(pScene: IScene3d, eType?: ELightTypes);
        public create(isShadowCaster?: boolean, iMaxShadowResolution?: number): boolean;
        public restrictLight(bEnable: boolean, pBox?: IRect3d): void;
        public prepareForUpdate(): void;
        public _prepareForLighting(pCamera: ICamera): boolean;
        public _calculateShadows(): void;
        static isLightPoint(pNode: IEntity): boolean;
    }
}
declare module akra.scene {
    class LightGraph extends DisplayList<ILightPoint> implements ILightGraph {
        public _pLightPoints: IObjectList<ILightPoint>;
        constructor();
        public _findObjects(pCamera: ICamera, pResultArray?: IObjectArray<ILightPoint>, bFastSearch?: boolean): IObjectArray<ILightPoint>;
        public attachObject(pNode: ISceneNode): void;
        public detachObject(pNode: ISceneNode): void;
    }
}
declare module akra.scene {
    class SpriteManager implements ISpriteManager {
        private _pEngine;
        private _pSprites;
        private _pDataFactory;
        constructor(pEngine: IEngine);
        public _allocateSprite(pSprite: ISprite): IRenderData;
    }
    class Sprite extends SceneObject implements ISprite {
        public _pManager: ISpriteManager;
        public _pRenderable: IRenderableObject;
        public getTotalRenderable(): number;
        public getSpriteManager(): ISpriteManager;
        constructor(pScene: IScene3d);
        public create(fSizeX?: number, fSizeY?: number): boolean;
        public setTexture(pTex: ITexture): void;
        public getRenderable(): IRenderableObject;
    }
}
declare module akra.scene.objects {
    class ModelEntry extends SceneNode implements IModelEntry {
        public _pModelResource: IModel;
        public getResource(): IModel;
        constructor(pScene: IScene3d, pModel: IModel);
        static isModelEntry(pEntity: IEntity): boolean;
    }
}
declare module akra.scene.objects {
    class DLTechnique<T extends ISceneNode> {
        public list: IDisplayList<T>;
        public camera: ICamera;
        private _pPrevResult;
        constructor(pList: IDisplayList<T>, pCamera: ICamera);
        public findObjects(pResultArray: IObjectArray<T>, bQuickSearch?: boolean): IObjectArray<T>;
    }
    class Camera extends SceneNode implements ICamera {
        public preRenderScene: ISignal<(pCamera: ICamera) => void>;
        public postRenderScene: ISignal<(pCamera: ICamera) => void>;
        /** camera type */
        public _eCameraType: ECameraTypes;
        /** camera options */
        public _iCameraOptions: number;
        /** update projection bit flag */
        public _iUpdateProjectionFlags: number;
        /**
        * View matrix
        */
        public _m4fView: IMat4;
        /** internal, un-biased projection matrix */
        public _m4fProj: IMat4;
        /** internal, un-biased projection+view matrix */
        public _m4fProjView: IMat4;
        /** Search rect for scene culling */
        public _pSearchRect: IRect3d;
        /** Position */
        public _v3fTargetPos: IVec3;
        /** Attributes for projection matrix */
        public _fFOV: number;
        public _fAspect: number;
        public _fNearPlane: number;
        public _fFarPlane: number;
        public _fWidth: number;
        public _fHeight: number;
        public _fMinX: number;
        public _fMaxX: number;
        public _fMinY: number;
        public _fMaxY: number;
        public _pFrustum: IFrustum;
        public _pLastViewport: IViewport;
        public _pDLTechniques: DLTechnique<ISceneObject>[];
        public _pDLResultStorage: IObjectArray<ISceneObject>[];
        constructor(pScene: IScene3d, eType?: EEntityTypes);
        public setupSignals(): void;
        public getViewMatrix(): IMat4;
        public getProjectionMatrix(): IMat4;
        public getProjViewMatrix(): IMat4;
        public getTargetPos(): IVec3;
        public getViewDistance(): number;
        public getSearchRect(): IRect3d;
        public getFrustum(): IFrustum;
        public getFOV(): number;
        public setFOV(fFOV: number): void;
        public getAspect(): number;
        public setAspect(fAspect: number): void;
        public getNearPlane(): number;
        public setNearPlane(fNearPlane: number): void;
        public getFarPlane(): number;
        public setFarPlane(fFarPlane: number): void;
        public create(): boolean;
        public isProjParamsNew(): boolean;
        public recalcProjMatrix(): void;
        public prepareForUpdate(): void;
        public display(iList?: number): IObjectArray<ISceneObject>;
        public _getLastResults(iList?: number): IObjectArray<ISceneObject>;
        public setParameter(eParam: ECameraParameters, pValue: any): void;
        public isConstantAspect(): boolean;
        public setProjParams(fFOV: number, fAspect: number, fNearPlane: number, fFarPlane: number): void;
        public setOrthoParams(fWidth: number, fHeight: number, fNearPlane: number, fFarPlane: number): void;
        public setOffsetOrthoParams(fMinX: number, fMaxX: number, fMinY: number, fMaxY: number, fNearPlane: number, fFarPlane: number): void;
        private recalcMatrices();
        public update(): boolean;
        public _renderScene(pViewport: IViewport): void;
        public _keepLastViewport(pViewport: IViewport): void;
        public _getLastViewport(): IViewport;
        public _getNumRenderedFaces(): number;
        public _notifyRenderedFaces(nFaces: number): void;
        public isActive(): boolean;
        public toString(isRecursive?: boolean, iDepth?: number): string;
        public projectPoint(v3fPoint: IVec3, v3fDestination?: IVec3): IVec3;
        public getDepthRange(): IDepthRange;
        public _addDisplayList(pScene: IScene3d, pList: IDisplayList<ISceneObject>, index: number): void;
        public _removeDisplayList(pScene: IScene3d, pList: IDisplayList<ISceneObject>, index: number): void;
        static isCamera(pNode: IEntity): boolean;
    }
}
declare module akra.data {
    class RenderData extends util.ReferenceCounter implements IRenderData {
        /**
        * Options.
        */
        private _eOptions;
        /**
        * Buffer, that create this class.
        */
        private _pBuffer;
        /**
        * ID of this data.
        */
        private _iId;
        /**
        * Buffer with indices.
        * If the data is the simplest mesh, with no more
        * than one index, the type will be IndexBuffer,
        * otherwise VertexBuffer.
        */
        private _pIndexBuffer;
        /**
        * Buffer with attributes.
        */
        private _pAttribBuffer;
        /**
        * VextexTextureBuffer with attributes
        */
        private _pAttribVideoBuffer;
        /**
        * Data with indices.
        * If _pIndexBuffer has type IndexBuffer, indices data
        * has type IndexData, otherwise VertexData.
        */
        private _pIndexData;
        /**
        * Data with attributes.
        */
        private _pAttribData;
        /**
        * Buffer map for current index set.
        */
        private _pMap;
        /**
        * Buffer maps of all index sets.
        */
        private _pIndicesArray;
        /**
        * Current index set.
        */
        private _iIndexSet;
        private _iRenderable;
        private _pComposer;
        public getBuffer(): IRenderDataCollection;
        public _getAttribBuffer(eType: ERenderDataAttributeTypes): IVertexBuffer;
        private getCurrentIndexSet();
        constructor(pCollection?: IRenderDataCollection);
        /**
        * Allocate data for rendering.
        */
        public allocateData(pDataDecl: IVertexElementInterface[], pData: ArrayBuffer, hasIndex?: boolean): number;
        public allocateData(pDataDecl: IVertexElementInterface[], pData: ArrayBufferView, hasIndex?: boolean): number;
        public allocateData(pDataDecl: IVertexDeclaration, pData: ArrayBuffer, hasIndex?: boolean): number;
        public allocateData(pDataDecl: IVertexDeclaration, pData: ArrayBufferView, hasIndex?: boolean): number;
        /**
        * Remove data from this render data.
        */
        public releaseData(iDataLocation: number): void;
        /**
        * Allocate attribute.
        * Attribute - data without index.
        * @param bSilent Do not add attribute to buffer map as data.
        */
        public allocateAttribute(pDecl: IVertexElementInterface[], pData: ArrayBuffer, eType?: ERenderDataAttributeTypes, bSilent?: boolean): boolean;
        public allocateAttribute(pDecl: IVertexDeclaration, pData: ArrayBuffer, eType?: ERenderDataAttributeTypes, bSilent?: boolean): boolean;
        public allocateAttribute(pDecl: IVertexDeclaration, pData: ArrayBufferView, eType?: ERenderDataAttributeTypes, bSilent?: boolean): boolean;
        public allocateAttribute(pDecl: IVertexElementInterface[], pData: ArrayBufferView, eType?: ERenderDataAttributeTypes, bSilent?: boolean): boolean;
        /**
        * Allocate index.
        */
        public allocateIndex(pAttrDecl: IVertexElementInterface[], pData: ArrayBuffer): boolean;
        public allocateIndex(pAttrDecl: IVertexDeclaration, pData: ArrayBuffer): boolean;
        public allocateIndex(pAttrDecl: IVertexElementInterface[], pData: ArrayBufferView): boolean;
        public allocateIndex(pAttrDecl: IVertexDeclaration, pData: ArrayBufferView): boolean;
        public getAdvancedIndexData(sSemantics: string): IVertexData;
        /**
        * Add new set of indices.
        */
        public addIndexSet(usePreviousDataSet?: boolean, ePrimType?: EPrimitiveTypes, sName?: string): number;
        public getNumIndexSet(): number;
        public getIndexSetName(iSet?: number): string;
        /**
        * Select set of indices.
        */
        public selectIndexSet(iSet: number): boolean;
        public selectIndexSet(sName: string): boolean;
        public findIndexSet(sName: string): number;
        /**
        * Get number of current index set.
        */
        public getIndexSet(): number;
        public hasAttributes(): boolean;
        /**
        * Specifies uses advanced index.
        */
        public useAdvancedIndex(): boolean;
        public useSingleIndex(): boolean;
        public useMultiIndex(): boolean;
        public setRenderable(bValue: boolean): void;
        public setRenderable(iIndexSet: number, bValue?: boolean): void;
        public isRenderable(): boolean;
        public isRenderable(iIndexSet: number): boolean;
        /**
        * Check whether the semantics used in this data set.
        */
        public hasSemantics(sSemantics: string, bSearchComplete?: boolean): boolean;
        /**
        * Get data location.
        */
        public getDataLocation(sSemantics: string): number;
        public getDataLocation(iDataLocation: number): number;
        /**
        * Get indices that uses in current index set.
        */
        public getIndices(): IBufferData;
        /** Get real index, that will be used in shader program. */
        public getIndexFor(sSemantics: string): ArrayBufferView;
        public getIndexFor(iDataLocation: number): ArrayBufferView;
        public getInitialIndexFor(sSemantics: string): ArrayBufferView;
        public getInitialIndexFor(iDataLocation: number): ArrayBufferView;
        /**
        * Get number of primitives for rendering.
        */
        public getPrimitiveCount(): number;
        public getPrimitiveType(): EPrimitiveTypes;
        /**
        * Setup index.
        *
        * @param sData Data semantics.
        * @param useSame All data will be addressed with same(zero by default) index. Default to FALSE. (??)
        * @param iBeginWith If @useSame will be setted to TRUE, all data will be addressed with @iBeginWith address. Default to zero.
        * @param bForceUsage If FALSE, original indices will be recalculated according to them data memory location. Default to FALSE.
        */
        public index(sData: string, sSemantics: string, useSame?: boolean, iBeginWith?: number, bForceUsage?: boolean): boolean;
        public index(iData: number, sSemantics: string, useSame?: boolean, iBeginWith?: number, bForceUsage?: boolean): boolean;
        public _setup(pCollection: IRenderDataCollection, iId: number, ePrimType?: EPrimitiveTypes, eOptions?: number): boolean;
        public _allocateData(pDataDecl: IVertexDeclaration, pData: ArrayBuffer, eType: ERenderDataTypes): number;
        public _allocateData(pDataDecl: IVertexDeclaration, pData: ArrayBufferView, eType: ERenderDataTypes): number;
        /**
        * Add vertex data to this render data.
        */
        public _addData(pVertexData: IVertexData, iFlow?: number, eType?: ERenderDataTypes): number;
        public _getComposer(): IAFXComposer;
        /**
        * Register data in this render.
        * Necessary for index to index mode, when data realy
        * not using in this render data for building final buffer map.
        */
        private _registerData(pVertexData);
        /**
        * Allocate advanced index.
        */
        private _allocateAdvancedIndex(pAttrDecl, pData);
        /**
        * Create IndexBuffer/IndexData for storage indices.
        */
        private _createIndex(pAttrDecl, pData);
        /**
        * Allocate index.
        */
        private _allocateIndex(pAttrDecl, pData);
        public _setIndexLength(iLength: number): boolean;
        /**
        * Get data flow by semantics or data location.
        */
        public _getFlow(iDataLocation: number): IDataFlow;
        public _getFlow(sSemantics: string, bSearchComplete?: boolean): IDataFlow;
        /**
        * Get data by semantics or location.
        */
        public _getData(iDataLocation: number, bSearchOnlyInCurrentMap?: boolean): IVertexData;
        public _getData(sSemanticsn: string, bSearchOnlyInCurrentMap?: boolean): IVertexData;
        /**
        * Draw this data.
        */
        public _draw(pTechnique: IRenderTechnique, pViewport: IViewport, pRenderable: IRenderableObject, pSceneObject: ISceneObject): void;
        public toString(): string;
    }
}
declare module akra.data {
    class RenderDataCollection extends util.ReferenceCounter implements IRenderDataCollection {
        private _pDataBuffer;
        private _pEngine;
        private _eDataOptions;
        private _pDataArray;
        public getBuffer(): IVertexBuffer;
        public getLength(): number;
        public getByteLength(): number;
        constructor(pEngine: IEngine, eOptions?: ERenderDataBufferOptions);
        public clone(pSrc: IRenderDataCollection): boolean;
        public getEngine(): IEngine;
        public getOptions(): ERenderDataBufferOptions;
        /**
        * Find VertexData with given semantics/usage.
        */
        public getData(sUsage: string): IVertexData;
        public getData(iOffset: number): IVertexData;
        /**
        * Положить данные в буфер.
        */
        public _allocateData(pVertexDecl: IVertexDeclaration, iSize: number): IVertexData;
        public _allocateData(pVertexDecl: IVertexDeclaration, pData: ArrayBufferView): IVertexData;
        public _allocateData(pVertexDecl: IVertexDeclaration, pData: ArrayBuffer): IVertexData;
        public _allocateData(pDeclData: IVertexElementInterface[], iSize: number): IVertexData;
        public _allocateData(pDeclData: IVertexElementInterface[], pData: ArrayBufferView): IVertexData;
        public _allocateData(pDeclData: IVertexElementInterface[], pData: ArrayBuffer): IVertexData;
        public allocateData(pDataDecl: IVertexDeclaration, pData: ArrayBufferView, isCommon?: boolean): number;
        public allocateData(pDataDecl: IVertexDeclaration, pData: ArrayBuffer, isCommon?: boolean): number;
        public allocateData(pDeclData: IVertexElementInterface[], pData: ArrayBufferView, isCommon?: boolean): number;
        public allocateData(pDeclData: IVertexElementInterface[], pData: ArrayBuffer, isCommon?: boolean): number;
        public getDataLocation(sSemantics: string): number;
        private createDataBuffer();
        public getRenderData(iSubset: number): IRenderData;
        public getEmptyRenderData(ePrimType: EPrimitiveTypes, eOptions?: ERenderDataBufferOptions): IRenderData;
        public _draw(): void;
        public destroy(): void;
        private setup(eOptions?);
    }
    function createRenderDataCollection(pEngine: IEngine, eOptions?: ERenderDataBufferOptions): IRenderDataCollection;
}
declare module akra {
    enum ERPCPacketTypes {
        FAILURE = 0,
        REQUEST = 1,
        RESPONSE = 2,
    }
    interface IRPCCallback {
        n: number;
        fn: Function;
        timestamp: number;
        procInfo?: string;
    }
    interface IRPCPacket {
        n: number;
        type: ERPCPacketTypes;
        next: IRPCPacket;
    }
    interface IRPCRequest extends IRPCPacket {
        proc: string;
        argv: any[];
        lt: number;
        pr: number;
    }
    interface IRPCResponse extends IRPCPacket {
        res: any;
    }
    interface IRPCProcOptions {
        lifeTime?: number;
        priority?: number;
    }
    enum ERPCErrorCodes {
        STACK_SIZE_EXCEEDED = 0,
        CALLBACK_LIFETIME_EXPIRED = 1,
    }
    interface IRPCError extends Error {
        code: ERPCErrorCodes;
    }
    interface IRPCOptions {
        addr?: string;
        deferredCallsLimit?: number;
        maxCallbacksCount?: number;
        reconnectTimeout?: number;
        systemRoutineInterval?: number;
        callbackLifetime?: number;
        procListName?: string;
        callsFrequency?: number;
        context?: any;
        procMap?: IMap<IRPCProcOptions>;
    }
    enum ERpcStates {
        k_Deteached = 0,
        k_Joined = 1,
        k_Closing = 2,
    }
    interface IRPC extends IEventProvider {
        getOptions(): IRPCOptions;
        getRemote(): any;
        getGroup(): number;
        join(sAddr?: string): void;
        rejoin(): void;
        free(): void;
        detach(): void;
        proc(...argv: any[]): boolean;
        groupCall(): number;
        dropGroupCall(): number;
        setProcedureOption(sProc: string, sOpt: string, pValue: any): void;
        joined: ISignal<(pRpc: IRPC) => void>;
        error: ISignal<(pRpc: IRPC, e: Error) => void>;
    }
}
declare module akra {
    interface IVirualDescriptor {
        onmessage: (pMessage: any) => void;
        onerror: (pErr: ErrorEvent) => void;
        onclose: (pEvent: CloseEvent) => void;
        onopen: (pEvent: Event) => void;
    }
    enum EPipeTypes {
        UNKNOWN = 0,
        WEBSOCKET = 1,
        WEBWORKER = 2,
    }
    enum EPipeDataTypes {
        BINARY = 0,
        STRING = 1,
    }
    interface IPipe extends IEventProvider {
        getURI(): IURI;
        open(pAddr?: IURI): boolean;
        open(sAddr?: string): boolean;
        close(): void;
        write(sValue: string): boolean;
        write(pValue: Object): boolean;
        write(pValue: ArrayBuffer): boolean;
        write(pValue: ArrayBufferView): boolean;
        isOpened(): boolean;
        isCreated(): boolean;
        isClosed(): boolean;
        opened: ISignal<(pPipe: IPipe, pEvent: Event) => void>;
        error: ISignal<(pPipe: IPipe, pErr: ErrorEvent) => void>;
        closed: ISignal<(pPipe: IPipe, pEvent: CloseEvent) => void>;
        message: ISignal<(pPipe: IPipe, pData: any, eType: EPipeDataTypes) => void>;
    }
}
declare module akra.net {
    class Pipe implements IPipe {
        public guid: number;
        public opened: ISignal<(pPipe: IPipe, e: Event) => void>;
        public closed: ISignal<(pPipe: IPipe, e: CloseEvent) => void>;
        public error: ISignal<(pPipe: IPipe, e: ErrorEvent) => void>;
        public message: ISignal<(pPipe: IPipe, pData: any, eType: EPipeDataTypes) => void>;
        public _pAddr: IURI;
        public _nMesg: number;
        public _eType: EPipeTypes;
        public _pConnect: IVirualDescriptor;
        public _bSetupComplete: boolean;
        constructor(sAddr?: string);
        public setupSignals(): void;
        public getURI(): IURI;
        public open(pAddr?: IURI): boolean;
        public open(sAddr?: string): boolean;
        private setupConnect();
        public close(): void;
        public write(pValue: any): boolean;
        public isClosed(): boolean;
        public isOpened(): boolean;
        public isCreated(): boolean;
    }
}
declare module akra {
    interface ICollectionIndexFunction {
        (pElement: any): number;
    }
    interface IObjectSortCollection<T> {
        getElementAt(iIndex: number): T;
        setElementAt(iIndex: number, pValue: T): void;
        removeElementAt(iIndex: number): void;
        setCollectionFuncion(fnCollection: ICollectionIndexFunction): void;
        push(pElement: any): void;
        findElement(iCollectionIndex: number): T;
        takeElement(iCollectionIndex: number): T;
        clear(): void;
    }
}
declare module akra.util {
    class ObjectSortCollection<T> implements IObjectSortCollection<T> {
        private _iSize;
        private _iCursor;
        private _pElements;
        private _fnCollectionIndex;
        private _iCursorElementIndex;
        private _iStartElementIndex;
        private _iLastElementIndex;
        constructor(iSize: number);
        public push(pElement: T): void;
        public findElement(iCollectionIndex: number): T;
        public takeElement(iCollectionIndex: number): T;
        public getElementAt(iIndex: number): T;
        public setElementAt(iIndex: number, pValue: T): void;
        public removeElementAt(iIndex: number): void;
        public clear(): void;
        public setCollectionFuncion(fnCollection: ICollectionIndexFunction): void;
    }
}
declare module akra.net {
    function createRpc(opt?: IRPCOptions): IRPC;
    function createRpc(addr?: string, opt?: IRPCOptions): IRPC;
}
declare module akra.terrain {
    class MegaTexture implements IMegaTexture {
        public guid: number;
        public minLevelLoaded: ISignal<(pMegaTexture: IMegaTexture) => void>;
        private _pEngine;
        private _pObject;
        private _pWorldExtents;
        private _v2fCameraCoord;
        private _sSurfaceTextures;
        private _v2iOriginalTextreMaxSize;
        private _v2iOriginalTextreMinSize;
        private _v2iTextureLevelSize;
        private _iMinLevel;
        private _iMaxLevel;
        private _eTextureFormat;
        private _iBlockSize;
        private _iBufferWidth;
        private _iBufferHeight;
        private _pTextures;
        private _pTextureForSwap;
        private _pSectorLoadInfo;
        private _pXY;
        private _pLoadInfoForSwap;
        private _pDefaultSectorLoadInfo;
        private _pRPC;
        private _fTexCourdXOld;
        private _fTexCourdYOld;
        private _nCountRender;
        private _iSectorLifeTime;
        private _pSamplerUniforms;
        private _pLoadStatusUniforms;
        private _pTexcoordOffsetUniforms;
        private _bManualMinLevelLoad;
        private _bStreaming;
        private _tLastUpdateTime;
        constructor(pEngine: IEngine);
        public setupSignals(): void;
        public getManualMinLevelLoad(): boolean;
        public setManualMinLevelLoad(bManual: boolean): void;
        public init(pObject: ISceneObject, sSurfaceTextures: string): void;
        public enableStreaming(bEnable?: boolean): void;
        public connectToServer(sURL?: string): void;
        public disconnectFromServer(): void;
        public prepareForRender(pViewport: IViewport): void;
        private _fThresHold;
        public _bColored: boolean;
        public applyForRender(pRenderPass: IRenderPass): void;
        public getWidthOrig(iLevel: number): number;
        public getHeightOrig(iLevel: number): number;
        public setMinLevelTexture(pImg: IImg): void;
        public checkTextureSizeSettings(): boolean;
        public createUniforms(): void;
        public rpcErrorOccured(pRPC: IRPC, pError: Error): void;
        private _iTryCount;
        public loadMinTextureLevel(): void;
        public getDataFromServer(iLevelTex: number, iOrigTexX: number, iOrigTexY: number, iWidth: number, iHeight: number, iAreaX?: number, iAreaY?: number, iAreaWidth?: number, iAreaHeight?: number): void;
        private _iTrafficCounter;
        private _iResponseCount;
        private _iQueryCount;
        private _printTraffic();
        private _fnPRCCallBack;
        private getDataByRPC(iLev, iX, iY, iBlockSize);
        public setDataT(pBuffer: any, iX: number, iY: number, iWidth: number, iHeight: number, pBufferIn: any, iInX: number, iInY: number, iInWidth: number, iInHeight: number, iBlockWidth: number, iBlockHeight: number, iComponents: number): void;
        private _setDataBetweenBufferMap(pBuffer, iX, iY, pBufferIn, iInX, iInY, iBlockWidth, iBlockHeight);
        public setSectorLoadInfoToDefault(pBuffer: Uint32Array): void;
        private pDataList;
        private testDataInit();
    }
}
declare module akra.terrain {
    class TerrainSection extends scene.SceneObject implements ITerrainSection {
        public _pTerrainSystem: ITerrain;
        public _iVertexID: number;
        public _iHeightMapX: number;
        public _iHeightMapY: number;
        public _iSectorX: number;
        public _iSectorY: number;
        public _iSectorIndex: number;
        public _iXVerts: number;
        public _iYVerts: number;
        public _pWorldRect: IRect3d;
        private _pRenderableObject;
        private _pVertexDescription;
        constructor(pScene: IScene3d, eType?: EEntityTypes);
        public getSectorX(): number;
        public getSectorY(): number;
        public getTerrainSystem(): ITerrain;
        public getSectionIndex(): number;
        public getHeightX(): number;
        public getHeightY(): number;
        public getVertexDescription(): IVertexElementInterface[];
        public getTotalRenderable(): number;
        public getRenderable(i?: number): IRenderableObject;
        public _internalCreate(pParentSystem: ITerrain, iSectorX: number, iSectorY: number, iHeightMapX: number, iHeightMapY: number, iXVerts: number, iYVerts: number, pWorldRect: IRect2d): boolean;
        public _createRenderable(): void;
        public _createRenderDataForVertexAndIndex(): boolean;
        public _buildVertexBuffer(): boolean;
        public _buildIndexBuffer(): boolean;
        static createSingleStripGrid(pIndexValues: Float32Array, iXVerts: number, iYVerts: number, iXStep: number, iYStep: number, iSride: number, iFlags: number): number;
        static getCountIndexForStripGrid(iXVerts: number, iYVerts: number): number;
    }
}
declare module akra.terrain {
    class Terrain extends scene.SceneObject implements ITerrain {
        public _pEngine: IEngine;
        public _pWorldExtents: IRect3d;
        private _v3fWorldSize;
        private _v3fMapScale;
        public _iSectorCountX: number;
        public _iSectorCountY: number;
        public _pSectorArray: ITerrainSection[];
        public _pDataFactory: IRenderDataCollection;
        public _v2fSectorSize: IVec2;
        public _iSectorShift: number;
        public _iSectorUnits: number;
        public _iSectorVerts: number;
        public _iTableWidth: number;
        public _iTableHeight: number;
        public _pHeightTable: Float32Array;
        private _pNormalMapTexture;
        private _pNormalMapImage;
        private _pBaseNormalTexture;
        private _pBaseNormalImage;
        private _pHeightMapTexture;
        private _pTempNormalColor;
        private _pMegaTexures;
        public _bUseVertexNormal: boolean;
        public _pDefaultRenderMethod: IRenderMethod;
        public _pRenderMethod: IRenderMethod;
        public _pDefaultScreen: IRenderableObject;
        private _fMaxHeight;
        private _f2DDiagonal;
        public _isCreate: boolean;
        public _bManualMegaTextureInit: boolean;
        public _bShowMegaTexture: boolean;
        public _bMegaTextureCreated: boolean;
        public _sSurfaceTextures: string;
        constructor(pScene: IScene3d, eType?: EEntityTypes);
        public getDataFactory(): IRenderDataCollection;
        public getWorldExtents(): IRect3d;
        public getWorldSize(): IVec3;
        public getMapScale(): IVec3;
        public getSectorCountX(): number;
        public getSectorCountY(): number;
        public getSectorSize(): IVec2;
        public getTableWidth(): number;
        public getTableHeight(): number;
        public getSectorShift(): number;
        public getMaxHeight(): number;
        public getTerrain2DLength(): number;
        public isCreate(): boolean;
        public getMegaTexture(): IMegaTexture;
        public getManualMegaTextureInit(): boolean;
        public setManualMegaTextureInit(bManual: boolean): void;
        public getShowMegaTexture(): boolean;
        public setShowMegaTexture(bShow: boolean): void;
        public _initSystemData(): boolean;
        public init(pMaps: ITerrainMaps, worldExtents: IRect3d, iShift: number, iShiftX: number, iShiftY: number, sSurfaceTextures: string, pRootNode?: ISceneNode): boolean;
        public initMegaTexture(sSurfaceTextures?: string): void;
        public findSection(iX: number, iY: number): ITerrainSection;
        public _allocateSectors(): boolean;
        public _setRenderMethod(pRenderMethod: IRenderMethod): void;
        public _buildHeightAndNormalTables(pImageHightMap: IImg, pImageNormalMap: IImg): void;
        public readWorldHeight(iIndex: number): number;
        public readWorldHeight(iMapX: number, iMapY: number): number;
        public readWorldNormal(v3fNormal: IVec3, iMapX: number, iMapY: number): IVec3;
        public projectPoint(v3fCoord: IVec3, v3fDestenation: IVec3): boolean;
        /**
        * Подготовка терраина к рендерингу.
        */
        public prepareForRender(pViewport: IViewport): void;
        /**
        * Сброс параметров.
        */
        public reset(): void;
        public computeBaseNormal(pImageHightMap: IImg): void;
        public _tableIndex(iMapX: number, iMapY: number): number;
        public _useVertexNormal(): boolean;
        public computeBoundingBox(): void;
        public _onRender(pTechnique: IRenderTechnique, iPass: number): void;
        public _onGenerateNormalRender(pTechnique: IRenderTechnique, iPass: number): void;
    }
}
declare module akra.terrain {
    class TriangleNodePool implements ITriangleNodePool {
        private _iNextTriNode;
        private _iMaxCount;
        private _pPool;
        public getNextTriNode(): number;
        public setNextTriNode(iNextTriNode: number): void;
        public getMaxCount(): number;
        public getPool(): ITriTreeNode[];
        public setPool(pPool: ITriTreeNode[]): void;
        constructor(iCount: number);
        public request(): ITriTreeNode;
        public reset(): void;
        static createTriTreeNode(): ITriTreeNode;
    }
}
declare module akra.terrain {
    class TerrainSectionROAM extends TerrainSection implements ITerrainSectionROAM {
        public _pTerrainSystem: ITerrainROAM;
        private _iTotalDetailLevels;
        private _iTotalVariances;
        private _iOffsetInVertexBuffer;
        private _pRootTriangleA;
        private _pRootTriangleB;
        private _pVarianceTreeA;
        private _pVarianceTreeB;
        private _v3fDistance0;
        private _v3fDistance1;
        private _v3fDistance2;
        private _v3fDistance3;
        private _fDistance0;
        private _fDistance1;
        private _fDistance2;
        private _fDistance3;
        private _fQueueSortValue;
        private _leftNeighborOfA;
        private _rightNeighborOfA;
        private _leftNeighborOfB;
        private _rightNeighborOfB;
        private _iStartIndex;
        private _iTempTotalIndices;
        private _pTempIndexList;
        private _iMaxIndices;
        constructor(pScene: IScene3d, eType?: EEntityTypes);
        public getTerrainSystem(): ITerrainROAM;
        public getTriangleA(): ITriTreeNode;
        public getTriangleB(): ITriTreeNode;
        public getQueueSortValue(): number;
        public _internalCreate(pParentSystem: ITerrainROAM, iSectorX: number, iSectorY: number, iHeightMapX: number, iHeightMapY: number, iXVerts: number, iYVerts: number, pWorldRect: IRect2d, iStartIndex?: number): boolean;
        public _initTessellationData(): void;
        public prepareForRender(pViewport: IViewport): void;
        public reset(): void;
        public tessellate(fScale: number, fLimit: number): void;
        public recursiveTessellate(pTri: ITriTreeNode, iCornerAX: number, iCornerAY: number, fCornerAZ: number, iCornerBX: number, iCornerBY: number, fCornerBZ: number, iCornerCX: number, iCornerCY: number, fCornerCZ: number, pVTree: number[], iIndex: number): void;
        public split(pTri: ITriTreeNode): void;
        public _createRenderDataForVertexAndIndex(): boolean;
        public _buildIndexBuffer(): boolean;
        public _buildVertexBuffer(): boolean;
        public buildTriangleList(): void;
        public recursiveBuildTriangleList(pTri: ITriTreeNode, iPointBase: number, iPointLeft: number, iPointRight: number): void;
        public computeVariance(): void;
        public recursiveComputeVariance(iCornerAX: number, iCornerAY: number, iCornerBX: number, iCornerBY: number, iCornerCX: number, iCornerCY: number, fHeightA: number, fHeightB: number, fHeightC: number, pVTree: number[], iIndex: number): number;
        public maxVariance(): void;
        public minVariance(): void;
        public drawVariance(iIndex: number, iCornerA: number, iCornerB: number, iCornerC: number, pVTree: number[]): void;
    }
}
declare module akra.terrain {
    class TerrainROAM extends Terrain implements ITerrainROAM {
        private _pRenderableObject;
        private _pRenderData;
        private _pDataIndex;
        private _iTotalIndices;
        private _iTotalIndicesOld;
        private _iTotalIndicesMax;
        private _pIndexList;
        private _pVerts;
        private _iVertexID;
        private _pTessellationQueue;
        private _iTessellationQueueCount;
        private _isRenderInThisFrame;
        private _iMaxTriTreeNodes;
        private _iTessellationQueueSize;
        public _pSectorArray: ITerrainSectionROAM[];
        public _fScale: number;
        public _fLimit: number;
        private _iTessellationQueueCountOld;
        private _nCountRender;
        private _m4fLastCameraMatrix;
        private _m4fLastTessellationMatrix;
        private _v3fLocalCameraCoord;
        private _isNeedReset;
        private _fLastTessellationTime;
        private _fTessellationSelfInterval;
        private _fTessellationThreadInterval;
        private _bUseTessellationThread;
        private _bIsInitTessellationSelfData;
        private _bIsInitTessellationThreadData;
        private _pTessellationThread;
        private _pTessellationTransferableData;
        private _pTmpTransferableArray;
        private _bIsReadyForTesseltion;
        private _pNodePool;
        private _fAvgTesselateCallsInSec;
        private _iCurrentTesselateCount;
        private _nSec;
        private _fLastTimeStart;
        constructor(pScene: IScene3d, eType?: EEntityTypes);
        public getMaxTriTreeNodes(): number;
        public getVerts(): number[];
        public getIndex(): Float32Array;
        public getVertexId(): number;
        public getTotalRenderable(): number;
        public getRenderable(i?: number): IRenderableObject;
        public getLocalCameraCoord(): IVec3;
        public getTessellationScale(): number;
        public setTessellationScale(fScale: number): void;
        public getTessellationLimit(): number;
        public setTessellationLimit(fLimit: number): void;
        public getUseTessellationThread(): boolean;
        public setUseTessellationThread(bUseThread: boolean): void;
        public getTotalIndex(): number;
        public setTotalIndex(iTotalIndices: number): void;
        public init(pMaps: ITerrainMaps, worldExtents: IRect3d, iShift: number, iShiftX: number, iShiftY: number, sSurfaceTextures: string, pRootNode?: ISceneObject): boolean;
        public destroy(): void;
        public initTessellationSelfData(): void;
        public initTessellationThreadData(): void;
        public terminateTessellationThread(): void;
        public successThreadInit(): void;
        public _allocateSectors(): boolean;
        public reset(): void;
        public resetWithCamera(pCamera: ICamera): boolean;
        public requestTriNode(): ITriTreeNode;
        public addToTessellationQueue(pSection: ITerrainSectionROAM): boolean;
        public processTessellationQueue(): void;
        public prepareIndexData(pData: ArrayBuffer): void;
        public _setTessellationParameters(fScale: number, fLimit: number): void;
        public _isOldCamera(pCamera: ICamera): boolean;
        public _onBeforeRender(pRenderableObject: IRenderableObject, pViewport: IViewport): void;
        private static fnSortSection(pSectionA, pSectionB);
    }
}
declare module akra.scene.light {
    function calculatePlanesForFrustumLighting(pLightFrustum: IFrustum, v3fLightPosition: IVec3, pCameraFrustum: IFrustum, pResultArray: IPlane3d[]): number;
    function calculatePlanesForOrthogonalLighting(pLightFrustum: IFrustum, v3fLightPosition: IVec3, pCameraFrustum: IFrustum, pResultArray: IPlane3d[]): number;
}
declare module akra.scene.light {
    class ShadowCaster extends objects.Camera implements IShadowCaster {
        public _pLightPoint: ILightPoint;
        public _iFace: number;
        public _pAffectedObjects: IObjectArray<ISceneObject>;
        public _m4fOptimizedProj: IMat4;
        public _isShadowCasted: boolean;
        constructor(pLightPoint: ILightPoint, iFace?: number);
        public getLightPoint(): ILightPoint;
        public getFace(): number;
        public getAffectedObjects(): IObjectArray<ISceneObject>;
        public getOptimizedProjection(): IMat4;
        public isShadowCasted(): boolean;
        public setShadowCasted(isShadowCasted: boolean): void;
        public _optimizeProjectionMatrix(pEffectiveCameraFrustum: IFrustum): void;
        public _getBoxForCameraFrustum(pEffectiveCameraFrustum: IFrustum, pDestination?: IRect2d): IRect2d;
        static isShadowCaster(pEntity: IEntity): boolean;
    }
}
declare module akra.scene.light {
    class ProjectParameters implements IProjectParameters {
        public ambient: IColor;
        public diffuse: IColor;
        public specular: IColor;
        public attenuation: IVec3;
    }
    class ProjectLight extends LightPoint implements IProjectLight {
        public _pDepthTexture: ITexture;
        public _pColorTexture: ITexture;
        public _pLightParameters: IProjectParameters;
        public _pShadowCaster: IShadowCaster;
        constructor(pScene: IScene3d);
        public getParams(): IProjectParameters;
        public isShadowCaster(): boolean;
        /**
        * overridden setter isShadow caster,
        * if depth texture don't created then create depth texture
        */
        public setShadowCaster(bValue: boolean): void;
        public getLightingDistance(): number;
        public setLightingDistance(fDistance: any): void;
        public getShadowCaster(): IShadowCaster;
        public getDepthTexture(): ITexture;
        public getRenderTarget(): IRenderTarget;
        public create(isShadowCaster?: boolean, iMaxShadowResolution?: number): boolean;
        private initializeTextures();
        public _calculateShadows(): void;
        public _prepareForLighting(pCamera: ICamera): boolean;
        public _defineLightingInfluence(pCamera: ICamera): IObjectArray<ISceneObject>;
        public _defineShadowInfluence(pCamera: ICamera): IObjectArray<ISceneObject>;
        static _pFrustumPlanes: IPlane3d[];
    }
}
declare module akra.scene.light {
    class OmniParameters implements IOmniParameters {
        public ambient: IColor;
        public diffuse: IColor;
        public specular: IColor;
        public attenuation: IVec3;
    }
    class OmniLight extends LightPoint implements IOmniLight {
        public _pDepthTextureCube: ITexture[];
        public _pColorTextureCube: ITexture[];
        public _pLightParameters: IOmniParameters;
        public _pShadowCasterCube: IShadowCaster[];
        constructor(pScene: IScene3d);
        public getParams(): IOmniParameters;
        public isShadowCaster(): boolean;
        /**
        * overridden setter isShadow caster,
        * if depth textures don't created then create depth textures
        */
        public setShadowCaster(bValue: boolean): void;
        public getLightingDistance(): number;
        public setLightingDistance(fDistance: any): void;
        public getDepthTextureCube(): ITexture[];
        public getRenderTarget(iFace: number): IRenderTarget;
        public getShadowCaster(): IShadowCaster[];
        public create(isShadowCaster?: boolean, iMaxShadowResolution?: number): boolean;
        private initializeTextures();
        public _calculateShadows(): void;
        public _prepareForLighting(pCamera: ICamera): boolean;
        public _defineLightingInfluence(pCamera: ICamera, iFace: number): IObjectArray<ISceneObject>;
        public _defineShadowInfluence(pCamera: ICamera, iFace: number): IObjectArray<ISceneObject>;
        static _pFrustumPlanes: IPlane3d[];
    }
}
declare module akra.scene.light {
    class SunParameters implements ISunParameters {
        public eyePosition: IVec3;
        public sunDir: IVec3;
        public groundC0: IVec3;
        public groundC1: IVec3;
        public hg: IVec3;
    }
    class SunLight extends LightPoint implements ISunLight {
        public _pLightParameters: ISunParameters;
        public _pSkyDome: ISceneModel;
        public _pColorTexture: ITexture;
        public _pDepthTexture: ITexture;
        public _pShadowCaster: IShadowCaster;
        public getParams(): ISunParameters;
        public getSkyDome(): ISceneModel;
        public setSkyDome(pSkyDome: ISceneModel): void;
        public getLightingDistance(): number;
        public setLightingDistance(fDistance: any): void;
        public isShadowCaster(): boolean;
        public setShadowCaster(bValue: boolean): void;
        public getDepthTexture(): ITexture;
        public getRenderTarget(): IRenderTarget;
        public getShadowCaster(): IShadowCaster;
        constructor(pScene: IScene3d);
        public create(isShadowCaster?: boolean, iMaxShadowResolution?: number): boolean;
        public _calculateShadows(): void;
        public _prepareForLighting(pCamera: ICamera): boolean;
        public _defineLightingInfluence(pCamera: ICamera): IObjectArray<ISceneObject>;
        public _defineShadowInfluence(pCamera: ICamera): IObjectArray<ISceneObject>;
        public updateSunDirection(v3fSunDir: IVec3): void;
        private initializeTextures();
        static _pFrustumPlanes: IPlane3d[];
        static _pTmpPlanePoints: IVec3[];
        static _pTmpIndexList: number[];
        static _pTmpDirLengthList: number[];
    }
}
declare module akra.scene {
    class Scene3d implements IScene3d {
        public guid: number;
        public displayListAdded: ISignal<(pScene: IScene3d, pList: IDisplayList<ISceneNode>, iIndex: number) => void>;
        public displayListRemoved: ISignal<(pScene: IScene3d, pList: IDisplayList<ISceneNode>, iIndex: number) => void>;
        public beforeUpdate: ISignal<(pScene: IScene3d) => void>;
        public postUpdate: ISignal<(pScene: IScene3d) => void>;
        public preUpdate: ISignal<(pScene: IScene3d) => void>;
        public nodeAttachment: ISignal<(pScene: IScene3d, pNode: ISceneNode) => void>;
        public nodeDetachment: ISignal<(pScene: IScene3d, pNode: ISceneNode) => void>;
        public _sName: string;
        public _pRootNode: ISceneNode;
        public _pSceneManager: ISceneManager;
        public _pDisplayLists: IDisplayList<ISceneNode>[];
        public _pDisplayListsCount: number;
        public _isUpdated: boolean;
        public getType(): ESceneTypes;
        public getTotalDL(): number;
        public getName(): string;
        constructor(pSceneManager: ISceneManager, sName?: string);
        public setupSignals(): void;
        public getManager(): ISceneManager;
        public isUpdated(): boolean;
        public getRootNode(): ISceneNode;
        public recursivePreUpdate(): void;
        public recursiveUpdate(): void;
        public updateCamera(): boolean;
        public updateScene(): boolean;
        public createObject(sName?: string): ISceneObject;
        public createNode(sName?: string): ISceneNode;
        public createModel(sName?: string): ISceneModel;
        public createCamera(sName?: string): ICamera;
        public createLightPoint(eType?: ELightTypes, isShadowCaster?: boolean, iMaxShadowResolution?: number, sName?: string): ILightPoint;
        public createSprite(sName?: string): ISprite;
        public createJoint(sName?: string): IJoint;
        public _createModelEntry(pModel: IModel): IModelEntry;
        public createText3d(sName?: string): IText3d;
        public createTerrain(sName?: string): ITerrain;
        public createTerrainROAM(sName?: string): ITerrainROAM;
        public createTerrainSection(sName?: string): ITerrainSection;
        public createTerrainSectionROAM(sName?: string): ITerrainSectionROAM;
        public _createShadowCaster(pLightPoint: ILightPoint, iFace?: number, sName?: string): IShadowCaster;
        public getDisplayList(i: number): IDisplayList<ISceneNode>;
        public getDisplayListByName(csName: string): number;
        public _render(pCamera: ICamera, pViewport: IViewport): void;
        private setupNode(pNode, sName?);
        public delDisplayList(index: number): boolean;
        public addDisplayList(pList: IDisplayList<ISceneNode>): number;
        static DL_DEFAULT: number;
        static DL_LIGHTING: number;
    }
}
declare module akra.render {
    class DSViewport extends ShadedViewport implements IDSViewport {
        public addedSkybox: ISignal<(pViewport: IViewport, pSkyTexture: ITexture) => void>;
        public addedBackground: ISignal<(pViewport: IViewport, pTexture: ITexture) => void>;
        private _pDeferredEffect;
        private _pDeferredColorTextures;
        private _pDeferredView;
        private _pDeferredSkyTexture;
        private _pLightDL;
        private _pHighlightedObject;
        constructor(pCamera: ICamera, fLeft?: number, fTop?: number, fWidth?: number, fHeight?: number, iZIndex?: number);
        public setupSignals(): void;
        public getType(): EViewportTypes;
        public getEffect(): IEffect;
        public getColorTextures(): ITexture[];
        public getView(): IRenderableObject;
        public getTextureWithObjectID(): ITexture;
        public setShadingModel(eModel: EShadingModel): void;
        public setDefaultEnvironmentMap(pEnvMap: ITexture): void;
        public setTransparencySupported(bEnable: boolean): void;
        public _getTransparencyViewport(): IShadedViewport;
        public _setTarget(pTarget: IRenderTarget): void;
        public setCamera(pCamera: ICamera): boolean;
        public _updateDimensions(bEmitEvent?: boolean): void;
        public _updateImpl(): void;
        public endFrame(): void;
        public prepareForDeferredShading(): void;
        public getSkybox(): ITexture;
        public _getRenderId(x: number, y: number): number;
        public _getDeferredTexValue(iTex: number, x: number, y: number): IColor;
        public getDepth(x: number, y: number): number;
        public setSkybox(pSkyTexture: ITexture): boolean;
        public setFXAA(bValue?: boolean): void;
        public highlight(iRid: number): void;
        public highlight(pObject: ISceneObject, pRenderable?: IRenderableObject): void;
        public highlight(pPair: IRIDPair): void;
        public isFXAA(): boolean;
        public isAntialiased(): boolean;
        public setAntialiasing(bEnabled?: boolean): void;
        public setFog(bEnabled?: boolean): void;
        public isFogged(): boolean;
        public destroy(): void;
        public _onRender(pTechnique: IRenderTechnique, iPass: number, pRenderable: IRenderableObject, pSceneObject: ISceneObject): void;
    }
}
declare module akra {
    interface ILPPViewport extends IShadedViewport, IViewportSkybox, IViewportAntialising, IViewportHighlighting, IViewportFogged {
        getDepthTexture(): ITexture;
        getTextureWithObjectID(): ITexture;
        getView(): IRenderableObject;
    }
}
declare module akra.render {
    class LPPViewport extends ShadedViewport implements ILPPViewport {
        public addedSkybox: ISignal<(pViewport: IViewport, pSkyTexture: ITexture) => void>;
        /** Buffer with normal, shininess and objectID */
        private _pNormalBufferTexture;
        /**
        * 0 - Diffuse and specular
        * 1 - Ambient and shadow
        */
        private _pLightBufferTextures;
        /** Resyult of LPP with out posteffects */
        private _pResultLPPTexture;
        private _pViewScreen;
        private _v2fTextureRatio;
        private _v2fScreenSize;
        private _pHighlightedObject;
        private _pSkyboxTexture;
        constructor(pCamera: ICamera, fLeft?: number, fTop?: number, fWidth?: number, fHeight?: number, iZIndex?: number);
        public setupSignals(): void;
        public getType(): EViewportTypes;
        public getView(): IRenderableObject;
        public getEffect(): IEffect;
        public getSkybox(): ITexture;
        public getTextureWithObjectID(): ITexture;
        public setShadingModel(eModel: EShadingModel): void;
        public setDefaultEnvironmentMap(pEnvMap: ITexture): void;
        public setTransparencySupported(bEnable: boolean): void;
        public _getTransparencyViewport(): IShadedViewport;
        public _setTarget(pTarget: IRenderTarget): void;
        public setCamera(pCamera: ICamera): boolean;
        public _getRenderId(x: number, y: number): number;
        public _updateDimensions(bEmitEvent?: boolean): void;
        public _updateImpl(): void;
        public setSkybox(pSkyTexture: ITexture): boolean;
        public setFXAA(bValue?: boolean): void;
        public isFXAA(): boolean;
        public setAntialiasing(bEnabled?: boolean): void;
        public isAntialiased(): boolean;
        public setFog(bEnabled?: boolean): void;
        public isFogged(): boolean;
        public highlight(iRid: number): void;
        public highlight(pObject: ISceneObject, pRenderable?: IRenderableObject): void;
        public highlight(pPair: IRIDPair): void;
        public _onNormalBufferRender(pViewport: IViewport, pTechnique: IRenderTechnique, iPass: number, pRenderable: IRenderableObject, pSceneObject: ISceneObject): void;
        public _onLightMapRender(pViewport: IViewport, pTechnique: IRenderTechnique, iPass: number, pRenderable: IRenderableObject, pSceneObject: ISceneObject): void;
        public _onObjectsRender(pViewport: IViewport, pTechnique: IRenderTechnique, iPass: number, pRenderable: IRenderableObject, pSceneObject: ISceneObject): void;
        public _onRender(pTechnique: IRenderTechnique, iPass: number, pRenderable: IRenderableObject, pSceneObject: ISceneObject): void;
        public endFrame(): void;
        public getDepth(x: number, y: number): number;
        private createNormalBufferRenderTarget(iWidth, iHeight);
        private createLightBuffersRenderTargets(iWidth, iHeight);
        private createResultLPPRenderTarget(iWidth, iHeight);
        private prepareRenderMethods();
        private updateRenderTextureDimensions(pTexture);
        private prepareForLPPShading();
    }
}
declare module akra {
    interface IForwardViewport extends IShadedViewport, IViewportSkybox, IViewportAntialising, IViewportHighlighting, IViewportFogged {
        _renderOnlyTransparentObjects(bValue: boolean): void;
        setSkyboxModel(pRenderable: IRenderableObject): void;
    }
}
declare module akra.render {
    class ForwardViewport extends ShadedViewport implements IForwardViewport {
        public addedSkybox: ISignal<(pViewport: IViewport, pSkyTexture: ITexture) => void>;
        /** Buffer with objectID */
        private _pTextureWithObjectID;
        /** Texture with result of rendereingd(for global posteffects) */
        private _pResultTexture;
        private _pViewScreen;
        private _v2fTextureRatio;
        private _v2fScreenSize;
        private _pSkyboxTexture;
        private _pTextureToScreenViewport;
        private _bRenderOnlyTransparentObjects;
        private _pSkybox;
        private _isFogEnabled;
        constructor(pCamera: ICamera, fLeft?: number, fTop?: number, fWidth?: number, fHeight?: number, iZIndex?: number);
        public setupSignals(): void;
        public getType(): EViewportTypes;
        public getView(): IRenderableObject;
        public getEffect(): IEffect;
        public getSkybox(): ITexture;
        public getTextureWithObjectID(): ITexture;
        public _renderOnlyTransparentObjects(bValue: boolean): void;
        public _getTransparencyViewport(): IShadedViewport;
        public _setTarget(pTarget: IRenderTarget): void;
        public _getRenderId(x: number, y: number): number;
        public _updateDimensions(bEmitEvent?: boolean): void;
        public _updateImpl(): void;
        public renderAsNormal(csMethod: string, pCamera: ICamera): void;
        private _fnSort;
        public renderTransparentObjects(csMethod: string, pCamera: ICamera): void;
        public endFrame(): void;
        public setSkybox(pSkyTexture: ITexture): boolean;
        public setSkyboxModel(pRenderable: IRenderableObject): void;
        public setFXAA(bValue?: boolean): void;
        public isFXAA(): boolean;
        public setAntialiasing(bEnabled?: boolean): void;
        public isAntialiased(): boolean;
        public highlight(a: any): void;
        public setFog(bEnabled?: boolean): void;
        public isFogged(): boolean;
        public _onScreenRender(pViewport: IViewport, pTechnique: IRenderTechnique, iPass: number, pRenderable: IRenderableObject, pSceneObject: ISceneObject): void;
        public _onRender(pTechnique: IRenderTechnique, iPass: number, pRenderable: IRenderableObject, pSceneObject: ISceneObject): void;
        private prepareForForwardShading();
        private updateRenderTextureDimensions(pTexture);
        private prepareRenderMethods();
        private createResultRenderTarget(iWidth, iHeight);
        public initTextureForTransparentObjects(): void;
        private _pTransparencyObjectList;
        private _iNumOfTransparencyObjects;
        private resetTransparencyObjectsQueue();
        private pushTransparencyObjectInQueue(fDistance, pRenderable, pSceneObject);
        private sortTransparencyObjectsQueue(iStart?, iEnd?);
        private renderTransparencyObjectsQueue(csMethod, pCamera);
    }
}
declare module akra {
    interface IMirrorViewport extends IViewport {
        getReflectionPlane(): IPlane3d;
        getInternalViewport(): IViewport;
    }
}
declare module akra.render {
    class MirrorViewport extends Viewport implements IMirrorViewport {
        private _pReflectionPlane;
        private _pInternal3dViewport;
        private _v4fReflPlaneStruct;
        public getReflectionPlane(): IPlane3d;
        public getInternalViewport(): IViewport;
        constructor(pCamera: ICamera, fLeft?: number, fTop?: number, fWidth?: number, fHeight?: number, iZIndex?: number);
        public _setTarget(pTarget: IRenderTarget): void;
        public _updateImpl(): void;
        public _onRenderReflection(pTech: IRenderTechnique, iPass: any, pRenderable: any, pSceneObject: any, pViewport: any): void;
        private prepareForMirrorRender();
    }
}
declare module akra.render {
    class ColorViewport extends Viewport implements IViewport {
        public _pGuidToColorMap: IMap<number>;
        public _pColorToSceneObjectMap: ISceneObject[];
        public _pColorToRenderableMap: IRenderableObject[];
        public getGuidToColorMap(): IMap<number>;
        public getType(): EViewportTypes;
        constructor(pCamera: ICamera, fLeft?: number, fTop?: number, fWidth?: number, fHeight?: number, iZIndex?: number);
        public _updateImpl(): void;
        public pick(x?: number, y?: number): IRIDPair;
        public _onRender(pTechnique: IRenderTechnique, iPass: number, pRenderable: IRenderableObject, pSceneObject: ISceneObject): void;
        private prepareRenderableForPicking(pRenderable);
    }
}
declare module akra.render {
    class ShadowViewport extends Viewport implements IViewport {
        public getType(): EViewportTypes;
        constructor(pCamera: ICamera, fLeft?: number, fTop?: number, fWidth?: number, fHeight?: number, iZIndex?: number);
        public _updateImpl(): void;
        private prepareRenderableForShadows(pRenderable);
        public _getDepthRangeImpl(): IDepthRange;
    }
}
declare module akra.render {
    class RenderTarget implements IRenderTarget {
        public guid: number;
        public preUpdate: ISignal<(pTarget: IRenderTarget) => void>;
        public postUpdate: ISignal<(pTarget: IRenderTarget) => void>;
        public viewportPreUpdate: ISignal<(pTarget: IRenderTarget, pViewport: IViewport) => void>;
        public viewportPostUpdate: ISignal<(pTarget: IRenderTarget, pViewport: IViewport) => void>;
        public viewportAdded: ISignal<(pTarget: IRenderTarget, pViewport: IViewport) => void>;
        public viewportRemoved: ISignal<(pTarget: IRenderTarget, pViewport: IViewport) => void>;
        public resized: ISignal<(pTarget: IRenderTarget, iWidth: number, iHeight: number) => void>;
        public cameraRemoved: ISignal<(pTarget: IRenderTarget, pCamera: ICamera) => void>;
        public _sName: string;
        public _pRenderer: IRenderer;
        public _iPriority: number;
        public _iWidth: number;
        public _iHeight: number;
        public _iColorDepth: number;
        public _pDepthBuffer: IDepthBuffer;
        public _pDepthPixelBuffer: IPixelBuffer;
        public _pFrameStats: IFrameStats;
        public _fLastSecond: number;
        public _fLastTime: number;
        public _iFrameCount: number;
        public _isActive: boolean;
        public _isAutoUpdate: boolean;
        public _bHwGamma: boolean;
        public _pViewportList: IViewport[];
        private _iUserEvents;
        constructor(pRenderer: IRenderer);
        public setupSignals(): void;
        public getWidth(): number;
        public getHeight(): number;
        public getColorDepth(): number;
        public getTotalViewports(): number;
        public getTotalFrames(): number;
        public getPriority(): number;
        public getName(): string;
        public setName(sName: string): void;
        public enableSupportForUserEvent(iType: number): number;
        public isUserEventSupported(eType: EUserEvents): boolean;
        public getRenderer(): IRenderer;
        public destroy(): void;
        public getDepthBuffer(): IDepthBuffer;
        public attachDepthBuffer(pBuffer: IDepthBuffer): boolean;
        public attachDepthPixelBuffer(pBuffer: IPixelBuffer): boolean;
        public detachDepthPixelBuffer(): void;
        public detachDepthBuffer(): void;
        public attachDepthTexture(pTexture: ITexture): boolean;
        public detachDepthTexture(): void;
        public _detachDepthBuffer(): void;
        public _beginUpdate(): void;
        public _updateAutoUpdatedViewports(bUpdateStatistics?: boolean): void;
        public _endUpdate(): void;
        public _updateViewport(iZIndex: number, bUpdateStatistics?: boolean): void;
        public _updateViewport(pViewportPtr: IViewport, bUpdateStatistics?: boolean): void;
        public addViewport(pViewport: IViewport): IViewport;
        public removeViewport(iZIndex: number): boolean;
        public removeAllViewports(): number;
        public getStatistics(): IFrameStats;
        public getLastFPS(): number;
        public getAverageFPS(): number;
        public getBestFPS(): number;
        public getWorstFPS(): number;
        public getPolygonCount(): number;
        public getBestFrameTime(): number;
        public getWorstFrameTime(): number;
        public resetStatistics(): void;
        public updateStats(): void;
        public getCustomAttribute(sName: string): any;
        public getViewport(iIndex: number): IViewport;
        public getViewportByZIndex(iZIndex: number): IViewport;
        public hasViewportByZIndex(iZIndex: number): boolean;
        public isActive(): boolean;
        public setActive(bValue?: boolean): void;
        public setAutoUpdated(isAutoUpdate?: boolean): void;
        public _notifyCameraRemoved(pCamera: ICamera): void;
        public isAutoUpdated(): boolean;
        public isPrimary(): boolean;
        public update(): void;
        public readPixels(ppDest?: IPixelBox, eFramebuffer?: EFramebuffer): IPixelBox;
        public updateImpl(): void;
        static NUM_RENDERTARGET_GROUPS: number;
        static DEFAULT_RT_GROUP: number;
        static REND_TO_TEX_RT_GROUP: number;
    }
}
declare module akra.render {
    class RenderEntry implements IRenderEntry {
        public viewport: IViewport;
        public renderTarget: IRenderTarget;
        public maker: IAFXMaker;
        public input: IShaderInput;
        public bufferMap: IBufferMap;
        public clear(): void;
    }
}
declare module akra.render {
    class RenderQueue implements IRenderQueue {
        public _pRenderer: IRenderer;
        public _pEntryList: IObjectArray<IRenderEntry>;
        public _fnSortFunction: Function;
        constructor(pRenderer: IRenderer);
        public execute(bSort?: boolean): void;
        public quickSortQueue(iStart: number, iEnd: number): void;
        public push(pEntry: IRenderEntry): void;
        public createEntry(): IRenderEntry;
        public releaseEntry(pEntry: IRenderEntry): void;
        static createEntry(): IRenderEntry;
        static releaseEntry(pEntry: IRenderEntry): void;
        static pool: IObjectArray<IRenderEntry>;
    }
}
declare module akra.render {
    var SShaderPrefixes: {
        k_Sampler: string;
        k_Header: string;
        k_Attribute: string;
        k_Offset: string;
        k_Texture: string;
        k_Texcoord: string;
        k_Texmatrix: string;
        k_Temp: string;
        k_BlendType: string;
    };
    var ZEROSAMPLER: number;
    var SSystemSemantics: {
        MODEL_MATRIX: string;
        VIEW_MATRIX: string;
        PROJ_MATRIX: string;
        NORMAL_MATRIX: string;
        BIND_MATRIX: string;
        RENDER_OBJECT_ID: string;
    };
    interface IRenderTargetPriorityMap {
        [priority: number]: IRenderTarget[];
    }
    class Renderer implements IRenderer {
        public guid: number;
        public active: ISignal<(pRender: IRenderer, pEngine: IEngine) => void>;
        public inactive: ISignal<(pRender: IRenderer, pEngine: IEngine) => void>;
        public _isActive: boolean;
        public _pEngine: IEngine;
        public _pRenderTargets: IRenderTarget[];
        public _pPrioritisedRenderTargets: IMap<IRenderTarget[]>;
        public _pPriorityList: number[];
        public _pRenderQueue: RenderQueue;
        public _pActiveViewport: IViewport;
        public _pActiveRenderTarget: IRenderTarget;
        /** TODO: FIX RENDER TARGET LOCK*/
        public _bLockRenderTarget: boolean;
        constructor(pEngine: IEngine);
        public setupSignals(): void;
        public getType(): ERenderers;
        public getEngine(): IEngine;
        public hasCapability(eCapability: ERenderCapabilities): boolean;
        public debug(bValue?: boolean, useApiTrace?: boolean): boolean;
        public isDebug(): boolean;
        public isValid(): boolean;
        public getError(): string;
        public _beginRender(): void;
        public _renderEntry(pEntry: IRenderEntry): void;
        public _endRender(): void;
        public clearFrameBuffer(iBuffer: number, cColor: IColor, fDepth: number, iStencil: number): void;
        public attachRenderTarget(pTarget: IRenderTarget): boolean;
        public detachRenderTarget(pTarget: IRenderTarget): boolean;
        public destroyRenderTarget(pTarget: IRenderTarget): void;
        public getActiveProgram(): IShaderProgram;
        public _disableAllTextureUnits(): void;
        public _disableTextureUnitsFrom(iUnit: number): void;
        public _initRenderTargets(): void;
        public _updateAllRenderTargets(): void;
        public _setViewport(pViewport: IViewport): void;
        public _setViewportForRender(pViewport: IViewport): void;
        public _getViewport(): IViewport;
        public _setRenderTarget(pTarget: IRenderTarget): void;
        public _setCullingMode(eMode: ECullingMode): void;
        public _setDepthBufferParams(bDepthTest: boolean, bDepthWrite: boolean, eDepthFunction: ECompareFunction, fClearDepth?: number): void;
        public getDefaultCanvas(): ICanvas3d;
        public createEntry(): IRenderEntry;
        public releaseEntry(pEntry: IRenderEntry): void;
        public pushEntry(pEntry: IRenderEntry): void;
        public executeQueue(bSort?: boolean): void;
        public _lockRenderTarget(): void;
        public _unlockRenderTarget(): void;
        public _isLockRenderTarget(): boolean;
        public _activated(): void;
        public _inactivated(): void;
    }
}
declare module akra.util {
    class UtilTimer implements IUtilTimer {
        private _isTimerInitialized;
        private _isTimerStopped;
        private _fTicksPerSec;
        private _iStopTime;
        private _iLastElapsedTime;
        private _iBaseTime;
        public getAbsoluteTime(): number;
        public getAppTime(): number;
        public getElapsedTime(): number;
        public start(): boolean;
        public stop(): boolean;
        public reset(): boolean;
        public isStopped(): boolean;
        public execCommand(eCommand: EUtilTimerCommands): number;
        static start(): IUtilTimer;
    }
}
declare module akra.render {
    class Canvas3d extends RenderTarget implements ICanvas3d {
        public _isFullscreen: boolean;
        public _isPrimary: boolean;
        public _bAutoDeactivatedOnFocusChange: boolean;
        public getLeft(): number;
        public setLeft(iLeft: number): void;
        public getTop(): number;
        public setTop(iTop: number): void;
        public getType(): ECanvasTypes;
        constructor(pRenderer: IRenderer);
        public create(sName: string, iWidth?: number, iHeight?: number, isFullscreen?: boolean): boolean;
        public destroy(): void;
        public setFullscreen(isFullscreen?: boolean): void;
        public setVisible(bVisible?: boolean): void;
        public setDeactivateOnFocusChange(bDeactivate?: boolean): void;
        public isFullscreen(): boolean;
        public isVisible(): boolean;
        public isClosed(): boolean;
        public isPrimary(): boolean;
        public isDeactivatedOnFocusChange(): boolean;
        public resize(iWidth: number, iHeight: number): void;
    }
}
declare module akra.webgl {
    class WebGLCanvas extends render.Canvas3d implements IClickable {
        public click: ISignal<(pCanvas: ICanvas3d, x: number, y: number) => void>;
        public mousemove: ISignal<(pCanvas: ICanvas3d, x: number, y: number) => void>;
        public mousedown: ISignal<(pCanvas: ICanvas3d, eBtn: EMouseButton, x: number, y: number) => void>;
        public mouseup: ISignal<(pCanvas: ICanvas3d, eBtn: EMouseButton, x: number, y: number) => void>;
        public mouseover: ISignal<(pCanvas: ICanvas3d, x: number, y: number) => void>;
        public mouseout: ISignal<(pCanvas: ICanvas3d, x: number, y: number) => void>;
        public mousewheel: ISignal<(pCanvas: ICanvas3d, x: number, y: number, fDelta: number) => void>;
        public dragstart: ISignal<(pCanvas: ICanvas3d, eBtn: EMouseButton, x: number, y: number) => void>;
        public dragstop: ISignal<(pCanvas: ICanvas3d, eBtn: EMouseButton, x: number, y: number) => void>;
        public dragging: ISignal<(pCanvas: ICanvas3d, eBtn: EMouseButton, x: number, y: number, dx: number, dy: number) => void>;
        public _pCanvas: HTMLCanvasElement;
        public _pCanvasCreationInfo: ICanvasInfo;
        public _iRealWidth: number;
        public _iRealHeight: number;
        public _pUserEventViewportLast: IViewport;
        public _pUserEventDragTarget: IViewport;
        public _pUserEventMouseDownPos: IPoint;
        public _iUserEventDragDeadZone: number;
        public _bUserEventDragging: boolean;
        public _eUserEventDragBtn: EMouseButton;
        public _bUserEventSkipNextClick: boolean;
        public _iUserHandledEvents: number;
        constructor(pRenderer: IRenderer);
        public setupSignals(): void;
        public getLeft(): number;
        public setLeft(iLeft: number): void;
        public getTop(): number;
        public setTop(iTop: number): void;
        public getElement(): HTMLCanvasElement;
        public hideCursor(bHide?: boolean): void;
        public setCursor(sType: string): void;
        public create(sName?: string, iWidth?: number, iHeight?: number, isFullscreen?: boolean): boolean;
        /** @return TRUE if event already handled, FALSE if not handled */
        private checkOrSaveEventHandler(eType);
        public enableSupportForUserEvent(iType: number): number;
        public destroy(): void;
        public getCustomAttribute(sName: string): any;
        public setFullscreen(isFullscreen?: boolean): void;
        public isVisible(): boolean;
        public setVisible(bVisible?: boolean): void;
        public resize(iWidth?: number, iHeight?: number): void;
        public readPixels(ppDest?: IPixelBox, eFramebuffer?: EFramebuffer): IPixelBox;
        private findViewportByPosition(x, y);
        private getViewportByMouseEvent(x, y);
        public _onClick(x: number, y: number): void;
        public _onMousemove(x: number, y: number): void;
        public _onMousedown(eBtn: EMouseButton, x: number, y: number): void;
        public _onMouseup(eBtn: EMouseButton, x: number, y: number): void;
        public _onMouseover(x: number, y: number): void;
        public _onMouseout(x: number, y: number): void;
        public _onMousewheel(x: number, y: number, fDelta: number): void;
        public _onDragstart(eBtn: EMouseButton, x: number, y: number): void;
        public _onDragstop(eBtn: EMouseButton, x: number, y: number): void;
        public _onDragging(eBtn: EMouseButton, x: number, y: number): void;
        static fullscreenLock: boolean;
    }
}
declare module akra.webgl {
    interface WebGLUniformLocationMap {
        [index: string]: WebGLUniformLocation;
    }
    class WebGLShaderProgram extends pool.ResourcePoolItem implements IShaderProgram {
        public _pWebGLRenderer: WebGLRenderer;
        public _pWebGLContext: WebGLRenderingContext;
        public _pWebGLProgram: WebGLProgram;
        public _pWebGLUniformLocations: WebGLUniformLocationMap;
        public _pWebGLAttributeLocations: IMap<number>;
        public _pWebGLAttributesInfo: WebGLActiveInfo[];
        public _iTotalAttributes: number;
        public create(csVertex?: string, csPixel?: string): boolean;
        public destroy(): void;
        public compile(csVertex?: string, csPixel?: string): boolean;
        public getTotalAttributes(): number;
        public _getActiveUniformNames(): string[];
        public _getActiveAttributeNames(): string[];
        public _getActiveAttribLocations(): IMap<number>;
        public isLinked(): boolean;
        public isValid(): boolean;
        public isActive(): boolean;
        public setFloat(sName: string, fValue: number): void;
        public setInt(sName: string, iValue: number): void;
        public setVec2(sName: string, v2fValue: IVec2): void;
        public setVec2i(sName: string, v2iValue: IVec2): void;
        public setVec3(sName: string, v3fValue: IVec3): void;
        public setVec3i(sName: string, v3iValue: IVec3): void;
        public setVec4(sName: string, v4fValue: IVec4): void;
        public setVec4i(sName: string, v4iValue: IVec4): void;
        public setMat3(sName: string, m3fValue: IMat3): void;
        public setMat4(sName: string, m4fValue: IMat4): void;
        public setFloat32Array(sName: string, pValue: Float32Array): void;
        public setInt32Array(sName: string, pValue: Int32Array): void;
        static uniformBuffer: ArrayBuffer;
        public setVec2Array(sName: string, pValue: IVec2[]): void;
        public setVec2iArray(sName: string, pValue: IVec2[]): void;
        public setVec3Array(sName: string, pValue: IVec3[]): void;
        public setVec3iArray(sName: string, pValue: IVec3[]): void;
        public setVec4Array(sName: string, pValue: IVec4[]): void;
        public setVec4iArray(sName: string, pValue: IVec4[]): void;
        public setMat3Array(sName: string, pValue: IMat3[]): void;
        public setMat4Array(sName: string, pValue: IMat4[]): void;
        public setStruct(sName: string, pData: Object): void;
        public setSampler(sName: string, pSampler: IAFXSamplerState): void;
        public setVertexBuffer(sName: string, pBuffer: IVertexBuffer): void;
        public setSamplerArray(sName: string, pList: IAFXSamplerState[]): void;
        public setTexture(sName: string, pData: ITexture): void;
        private applySamplerState(pSampler);
        public applyVertexData(sName: string, pData: IVertexData): boolean;
        public _setFloat(pWebGLUniformLocation: WebGLUniformLocation, fValue: number): void;
        public _setInt(pWebGLUniformLocation: WebGLUniformLocation, iValue: number): void;
        public _setVec2(pWebGLUniformLocation: WebGLUniformLocation, v2fValue: IVec2): void;
        public _setVec2i(pWebGLUniformLocation: WebGLUniformLocation, v2iValue: IVec2): void;
        public _setVec3(pWebGLUniformLocation: WebGLUniformLocation, v3fValue: IVec3): void;
        public _setVec3i(pWebGLUniformLocation: WebGLUniformLocation, v3iValue: IVec3): void;
        public _setVec4(pWebGLUniformLocation: WebGLUniformLocation, v4fValue: IVec4): void;
        public _setVec4i(pWebGLUniformLocation: WebGLUniformLocation, v4iValue: IVec4): void;
        public _setMat3(pWebGLUniformLocation: WebGLUniformLocation, m3fValue: IMat3): void;
        public _setMat4(pWebGLUniformLocation: WebGLUniformLocation, m4fValue: IMat4): void;
        public _setFloat32Array(pWebGLUniformLocation: WebGLUniformLocation, pValue: Float32Array): void;
        public _setInt32Array(pWebGLUniformLocation: WebGLUniformLocation, pValue: Int32Array): void;
        public _setVec2Array(pWebGLUniformLocation: WebGLUniformLocation, pValue: IVec2[]): void;
        public _setVec2iArray(pWebGLUniformLocation: WebGLUniformLocation, pValue: IVec2[]): void;
        public _setVec3Array(pWebGLUniformLocation: WebGLUniformLocation, pValue: IVec3[]): void;
        public _setVec3iArray(pWebGLUniformLocation: WebGLUniformLocation, pValue: IVec3[]): void;
        public _setVec4Array(pWebGLUniformLocation: WebGLUniformLocation, pValue: IVec4[]): void;
        public _setVec4iArray(pWebGLUniformLocation: WebGLUniformLocation, pValue: IVec4[]): void;
        public _setMat3Array(pWebGLUniformLocation: WebGLUniformLocation, pValue: IMat3[]): void;
        public _setMat4Array(pWebGLUniformLocation: WebGLUniformLocation, pValue: IMat4[]): void;
        public _setSampler(pWebGLUniformLocation: WebGLUniformLocation, pSampler: IAFXSamplerState): void;
        public _setVertexBuffer(pWebGLUniformLocation: WebGLUniformLocation, pBuffer: IVertexBuffer): void;
        public _setSamplerArray(pWebGLUniformLocation: WebGLUniformLocation, pList: IAFXSamplerState[]): void;
        public applyBufferMap(pMap: IBufferMap): void;
        public getWebGLAttributeLocation(sName: string): number;
        public getWebGLUniformLocations(): WebGLUniformLocationMap;
        public getWebGLUniformLocation(sName: string): WebGLUniformLocation;
        public getWebGLProgram(): WebGLProgram;
        public getTranslatedShaderCode(eWebGLType: number): string;
        public printTranslatedShaderCode(eWebGLType?: number): void;
        public createWebGLShader(eType: number, csCode: string): WebGLShader;
        public saveResource(sName?: string): boolean;
        public obtainWebGLUniforms(): void;
        public obtainWebGLAttributes(): void;
    }
}
declare module akra.webgl {
    interface WebGLInternalTextureState {
        isUsed: boolean;
        texture: WebGLInternalTexture;
        states: IMap<number>;
    }
    interface WebGLInternalTextureStateMap {
        [guid: number]: WebGLInternalTextureState;
    }
    class WebGLInternalTextureStateManager {
        private _pActiveTextureStateMap;
        private _pActiveTextureList;
        private _pWebGLRenderer;
        constructor(pRenderer: WebGLRenderer);
        public add(pTexture: WebGLInternalTexture): IMap<number>;
        public reset(): void;
        public getTextureState(iGuid: number): IMap<number>;
    }
}
declare module akra.webgl {
    class WebGLRenderer extends render.Renderer {
        private _pCanvas;
        private _pWebGLContext;
        private _pWebGLFramebufferList;
        private _pDefaultCanvas;
        private _pWebGLInternalContext;
        private _nActiveAttributes;
        private _iSlot;
        private _iCurrentTextureSlot;
        private _iNextTextureSlot;
        private _pTextureSlotList;
        /**
        * Need To reset texture states after render
        */
        private _pTextureStateManager;
        /**
        * Need to impove speed
        */
        private _pCurrentContextStates;
        private _pRenderStatesPool;
        private _pFreeRenderStatesPool;
        static DEFAULT_OPTIONS: IRendererOptions;
        public getType(): ERenderers;
        public hasCapability(eCapability: ERenderCapabilities): boolean;
        constructor(pEngine: IEngine);
        constructor(pEngine: IEngine, sCanvas: string);
        constructor(pEngine: IEngine, pOptions: IRendererOptions);
        constructor(pEngine: IEngine, pCanvas: HTMLCanvasElement);
        public debug(bValue?: boolean, useApiTrace?: boolean): boolean;
        public blendColor(fRed: number, fGreen: number, fBlue: number, fAlpha: number): void;
        public blendEquation(iWebGLMode: number): void;
        public blendEquationSeparate(iWebGLModeRGB: number, iWebGLModeAlpha: number): void;
        public blendFunc(iWebGLSFactor: number, iWebGLDFactor: number): void;
        public blendFuncSeparate(iWebGLSFactorRGB: number, iWebGLDFactorRGB: number, iWebGLSFactorAlpha: number, iWebGLDFactorAlpha: number): void;
        public clearColor(fRed: number, fGreen: number, fBlue: number, fAlpha: number): void;
        public clearDepth(fDepth: number): void;
        public clearStencil(iS: number): void;
        public colorMask(bRed: boolean, bGreen: boolean, bBlue: boolean, bAlpha: boolean): void;
        public cullFace(iWebGLMode: number): void;
        public depthFunc(iWebGLMode: number): void;
        public depthMask(bWrite: boolean): void;
        public depthRange(fZNear: number, fZFar: number): void;
        public disable(iWebGLCap: number): void;
        public enable(iWebGLCap: number): void;
        public frontFace(iWebGLMode: number): void;
        public getParameter(iWebGLName: number): any;
        public lineWidth(fWidth: number): void;
        public pixelStorei(iWebGLName: number, iParam: number): void;
        public polygonOffset(fFactor: number, fUnints: number): void;
        public sampleCoverage(fValue: number, bInvert: boolean): void;
        public stencilFunc(iWebGLFunc: number, iRef: number, iMask: number): void;
        public stencilFuncSeparate(iWebGLFace: number, iWebGLFunc: number, iRef: number, iMask: number): void;
        public stencilMask(iMask: number): void;
        public stencilMaskSeparate(iWebGLFace: number, iMask: number): void;
        public stencilOp(iFail: number, iZFail: number, iZPass: number): void;
        public stencilOpSeparate(iWebGLFace: number, iFail: number, iZFail: number, iZPass: number): void;
        public _getTextureStateManager(): WebGLInternalTextureStateManager;
        public _beginRender(): void;
        private _time;
        public _printTime(): void;
        private _pLastMaker;
        public _renderEntry(pEntry: IRenderEntry): void;
        public _endRender(): void;
        public _setViewport(pViewport: IViewport): void;
        public _setRenderTarget(pTarget: IRenderTarget): void;
        public _setCullingMode(eMode: ECullingMode): void;
        public _setDepthBufferParams(bDepthTest: boolean, bDepthWrite: boolean, eDepthFunction: ECompareFunction, fClearDepth?: number): void;
        public isDebug(): boolean;
        public getHTMLCanvas(): HTMLCanvasElement;
        public getWebGLContext(): WebGLRenderingContext;
        /** Buffer Objects. */
        public bindWebGLBuffer(eTarget: number, pBuffer: WebGLBuffer): void;
        public createWebGLBuffer(): WebGLBuffer;
        public deleteWebGLBuffer(pBuffer: WebGLBuffer): void;
        /** Texture Objects. */
        public bindWebGLTexture(eTarget: number, pTexture: WebGLTexture): void;
        public activateWebGLTexture(iWebGLSlot: number): void;
        public activateWebGLTextureInAutoSlot(eTarget: number, pTexture: WebGLTexture): number;
        public createWebGLTexture(): WebGLTexture;
        public deleteWebGLTexture(pTexture: WebGLTexture): void;
        /** Framebuffer Objects */
        public createWebGLFramebuffer(): WebGLFramebuffer;
        public bindWebGLFramebuffer(eTarget: number, pBuffer: WebGLFramebuffer): void;
        public bindWebGLFramebufferTexture2D(eTarget: number, eAttachment: number, eTexTarget: number, pTexture: WebGLTexture, iMipLevel?: number): void;
        public deleteWebGLFramebuffer(pBuffer: WebGLFramebuffer): void;
        /** Renderbuffer Objects */
        public createWebGLRenderbuffer(): WebGLRenderbuffer;
        public bindWebGLRenderbuffer(eTarget: number, pBuffer: WebGLRenderbuffer): void;
        public deleteWebGLRenderbuffer(pBuffer: WebGLRenderbuffer): void;
        public createWebGLProgram(): WebGLProgram;
        public deleteWebGLProgram(pProgram: WebGLProgram): void;
        public useWebGLProgram(pProgram: WebGLProgram): void;
        public enableWebGLVertexAttribs(iTotal: number): void;
        public disableAllWebGLVertexAttribs(): void;
        public getDefaultCanvas(): ICanvas3d;
        public clearFrameBuffer(iBuffers: number, cColor: IColor, fDepth: number, iStencil: number): void;
        public _disableTextureUnitsFrom(iUnit: number): void;
        public _pushRenderStates(): void;
        public _popRenderStates(isForce: boolean): void;
        private restoreWebGLContextRenderStates(pStatesFrom);
        private restoreBlendStates(pStatesFrom);
        private restoreCullStates(pStatesFrom);
        private restoreColorStates(pStatesFrom);
        private restoreDepthStates(pStatesFrom);
        private restoreDitherStates(pStatesFrom);
        private restoreFrontFaceStates(pStatesFrom);
        private restorePolygonStates(pStatesFrom);
        private restoreSampleStates(pStatesFrom);
        private restoreScissorStates(pStatesFrom);
        private restoreStencilStates(pStatesFrom);
        private restorePackStates(pStatesFrom);
        private forceUpdateContextRenderStates();
        private getFreeRenderStates();
        private applyInputRenderStates(pStates);
        private convertRenderStateValue(eStateValue);
        private convertCompareFunction(eFunc);
        private static createWebGLContextStates(pStates?);
        private static copyWebGLContextStates(pStatesTo, pStatesFrom);
        private static initStatesFromWebGLContext(pStatesTo, pWebGLContext);
    }
}
declare module akra.webgl {
    function calculateSkin(pMeshSubset: IMeshSubset): boolean;
}
declare module akra.model {
    class MeshSubset extends render.RenderableObject implements IMeshSubset {
        public skinAdded: ISignal<(pSubset: IMeshSubset, pSkin: ISkin) => void>;
        public skinRemoved: ISignal<(pSubset: IMeshSubset, pSkin: ISkin) => void>;
        public transformed: ISignal<(pSubset: IMeshSubset, pSkin: ISkin) => void>;
        private _sName;
        private _pMesh;
        private _pSkin;
        private _pBoundingBox;
        private _pBoundingSphere;
        private _isOptimizedSkinned;
        private _pInitialGeometryBoundingBox;
        private _pInitialGeometryBoundingSphere;
        private _pSkinLocalBounds;
        constructor(pMesh: IMesh, pRenderData: IRenderData, sName?: string);
        public getBoundingBox(): IRect3d;
        public getBoundingSphere(): ISphere;
        public getInitialGeometryBoundingBox(): IRect3d;
        public getInitialGeometryBoundingSphere(): ISphere;
        public getSkin(): ISkin;
        public getName(): string;
        public getMesh(): IMesh;
        public setupSignals(): void;
        public setup(pMesh: IMesh, pRenderData: IRenderData, sName: string): void;
        public createBoundingBox(): boolean;
        public createBoundingSphere(): boolean;
        public deleteBoundingBox(): boolean;
        public deleteBoundingSphere(): boolean;
        public _showBoundingBox(): boolean;
        public _isBoundingBoxVisible(): boolean;
        public _hideBoundingBox(): boolean;
        public _showBoundingSphere(): boolean;
        public _isBoundingSphereVisible(): boolean;
        public _hideBoundingSphere(): boolean;
        public getTotalBones(): number;
        public getBoneLocalBound(sBone: string): IRect3d;
        public getBoneLocalBound(iBone: number): IRect3d;
        public computeNormals(): boolean;
        public computeTangents(): void;
        public computeBinormals(): void;
        public isSkinned(): boolean;
        public isOptimizedSkinned(): boolean;
        public getVertexData(sUsage: string): IVertexData;
        public getVertexData(sUsage: 'TEXCOORD'): IVertexData;
        public getVertexData(sUsage: 'NORMAL'): IVertexData;
        public getVertexData(sUsage: 'POSITION'): IVertexData;
        public setSkin(pSkin: ISkin): boolean;
        public update(): boolean;
        private calculateBoneLocalBoundingBoxes();
        private calculateSkin();
        private calculateSkinBasedBoundingBox();
        static isMeshSubset(pObject: IRenderableObject): boolean;
    }
}
declare module akra.fx {
    class Composer implements IAFXComposer {
        private _pEngine;
        private _pTechniqueToBlendMap;
        private _pTechniqueToOwnBlendMap;
        private _pTechniqueLastGlobalBlendMap;
        private _pTechniqueNeedUpdateMap;
        private _pEffectResourceToComponentBlendMap;
        private _pBlender;
        private _pGlobalEffectResorceIdStack;
        private _pGlobalComponentBlendStack;
        private _pGlobalComponentBlend;
        private _pCurrentSceneObject;
        private _pCurrentViewport;
        private _pCurrentRenderable;
        private _pCurrentBufferMap;
        private _pCurrentSurfaceMaterial;
        private _pComposerState;
        /** Render targets for global-post effects */
        private _pRenderTargetA;
        private _pRenderTargetB;
        private _pLastRenderTarget;
        private _pPostEffectViewport;
        private _pPostEffectTextureA;
        private _pPostEffectTextureB;
        private _pPostEffectDepthBuffer;
        static pDefaultSamplerBlender: SamplerBlender;
        private _pRidTable;
        private _pRidMap;
        private _nRidSO;
        private _nRidRE;
        private _pSystemUniformsNameIndexList;
        private _bIsFirstApplySystemUnifoms;
        constructor(pEngine: IEngine);
        public getComponentByName(sComponentName: string): IAFXComponent;
        public getEngine(): IEngine;
        public getComponentCountForEffect(pEffectResource: IEffect): number;
        public getTotalPassesForEffect(pEffectResource: IEffect): number;
        public addComponentToEffect(pEffectResource: IEffect, pComponent: IAFXComponent, iShift: number, iPass: number): boolean;
        public removeComponentFromEffect(pEffectResource: IEffect, pComponent: IAFXComponent, iShift: number, iPass: number): boolean;
        public hasComponentForEffect(pEffectResource: IEffect, pComponent: IAFXComponent, iShift: number, iPass: number): boolean;
        public activateEffectResource(pEffectResource: IEffect, iShift: number): boolean;
        public deactivateEffectResource(pEffectResource: IEffect): boolean;
        public getPassInputBlendForEffect(pEffectResource: IEffect, iPass: number): IAFXPassInputBlend;
        public copyTechniqueOwnComponentBlend(pFrom: IRenderTechnique, pTo: IRenderTechnique): void;
        public getMinShiftForOwnTechniqueBlend(pRenderTechnique: IRenderTechnique): number;
        public getTotalPassesForTechnique(pRenderTechnique: IRenderTechnique): number;
        public addOwnComponentToTechnique(pRenderTechnique: IRenderTechnique, pComponent: IAFXComponent, iShift: number, iPass: number): boolean;
        public removeOwnComponentToTechnique(pRenderTechnique: IRenderTechnique, pComponent: IAFXComponent, iShift: number, iPass: number): boolean;
        public hasOwnComponentInTechnique(pRenderTechnique: IRenderTechnique, pComponent: IAFXComponent, iShift: number, iPass: number): boolean;
        public prepareTechniqueBlend(pRenderTechnique: IRenderTechnique): boolean;
        public markTechniqueAsNeedUpdate(pRenderTechnique: IRenderTechnique): void;
        public getPassInputBlendForTechnique(pRenderTechnique: IRenderTechnique, iPass: number): IAFXPassInputBlend;
        public applyBufferMap(pMap: IBufferMap): boolean;
        public applySurfaceMaterial(pSurfaceMaterial: ISurfaceMaterial): boolean;
        public _setCurrentSceneObject(pSceneObject: ISceneObject): void;
        public _setCurrentViewport(pViewport: IViewport): void;
        public _setCurrentRenderableObject(pRenderable: IRenderableObject): void;
        public _getCurrentSceneObject(): ISceneObject;
        public _getCurrentViewport(): IViewport;
        public _getCurrentRenderableObject(): IRenderableObject;
        public _setDefaultCurrentState(): void;
        public renderTechniquePass(pRenderTechnique: IRenderTechnique, iPass: number): void;
        public _loadEffectFromSyntaxTree(pTree: parser.IParseTree, sFileName: string): boolean;
        public _loadEffectFromBinary(pData: Uint8Array, sFileName: string): boolean;
        private initComponent(pTechnique);
        private clearPreRenderState();
        public bNormalFix: boolean;
        public bUseNormalMap: boolean;
        public bIsDebug: boolean;
        public bIsRealNormal: boolean;
        public bTerrainBlackSectors: boolean;
        public bShowTriangles: boolean;
        public kFixNormal: number;
        public fSunSpecular: number;
        public fSunAmbient: number;
        public cHeightFalloff: number;
        public cGlobalDensity: number;
        public _calcRenderID(pSceneObject: ISceneObject, pRenderable: IRenderableObject, bCreateIfNotExists?: boolean): number;
        public _getRenderableByRid(iRid: number): IRenderableObject;
        public _getObjectByRid(iRid: number): ISceneObject;
        private applySystemUnifoms(pPassInput);
        private prepareComposerState();
        private initPostEffectTextures();
        private resizePostEffectTextures(iWidth, iHeight);
        private prepareRenderTarget(pEntry, pRenderTechnique, iPass);
    }
}
declare module akra.parser {
    var END_POSITION: string;
    var T_EMPTY: string;
    var UNKNOWN_TOKEN: string;
    var START_SYMBOL: string;
    var UNUSED_SYMBOL: string;
    var END_SYMBOL: string;
    var LEXER_RULES: string;
    var FLAG_RULE_CREATE_NODE: string;
    var FLAG_RULE_NOT_CREATE_NODE: string;
    var FLAG_RULE_FUNCTION: string;
    var EOF: string;
    var T_STRING: string;
    var T_FLOAT: string;
    var T_UINT: string;
    var T_TYPE_ID: string;
    var T_NON_TYPE_ID: string;
}
declare module akra.parser {
    class Lexer implements ILexer {
        private _iLineNumber;
        private _iColumnNumber;
        private _sSource;
        private _iIndex;
        private _pParser;
        private _pPunctuatorsMap;
        private _pKeywordsMap;
        private _pPunctuatorsFirstSymbols;
        constructor(pParser: IParser);
        static _getPunctuatorName(sValue: string): string;
        public _addPunctuator(sValue: string, sName?: string): string;
        public _addKeyword(sValue: string, sName: string): string;
        public _getTerminalValueByName(sName: string): string;
        public _init(sSource: string): void;
        public _getNextToken(): IToken;
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
    class ParseTree implements IParseTree {
        private _pRoot;
        private _pNodes;
        private _pNodesCountStack;
        private _isOptimizeMode;
        public getRoot(): IParseNode;
        public setRoot(pRoot: IParseNode): void;
        constructor();
        public finishTree(): void;
        public setOptimizeMode(isOptimize: boolean): void;
        public addToken(pToken: IToken): void;
        public addNode(pNode: IParseNode): void;
        public reduceByRule(pRule: IRule, eCreate?: ENodeCreateMode): void;
        public toString(): string;
        public clone(): IParseTree;
        public getNodes(): IParseNode[];
        public getLastNode(): IParseNode;
        private addLink(pParent, pNode);
        private cloneNode(pNode);
        private toStringNode(pNode, sPadding?);
    }
}
declare module akra.parser {
    interface IState {
        hasItem(pItem: IItem, eType: EParserType): IItem;
        hasParentItem(pItem: IItem): IItem;
        hasChildItem(pItem: IItem): IItem;
        hasRule(pRule: IRule, iPos: number): boolean;
        isEmpty(): boolean;
        isEqual(pState: IState, eType: EParserType): boolean;
        push(pItem: IItem): void;
        tryPush_LR0(pRule: IRule, iPos: number): boolean;
        tryPush_LR(pRule: IRule, iPos: number, sExpectedSymbol: string): boolean;
        deleteNotBase(): void;
        getNextStateBySymbol(sSymbol: string): IState;
        addNextState(sSymbol: string, pState: IState): boolean;
        toString(isBase?: boolean): string;
        getIndex(): number;
        setIndex(iIndex: number): void;
        getItems(): IItem[];
        getNumBaseItems(): number;
        getNextStates(): IMap<IState>;
    }
}
declare module akra.parser {
    interface IItem {
        isEqual(pItem: IItem, eType?: EParserType): boolean;
        isParentItem(pItem: IItem): boolean;
        isChildItem(pItem: IItem): boolean;
        mark(): string;
        end(): string;
        nextMarked(): string;
        toString(): string;
        isExpected(sSymbol: string): boolean;
        addExpected(sSymbol: string): boolean;
        getRule(): IRule;
        setRule(pRule: IRule): void;
        getPosition(): number;
        setPosition(iPosition: number): void;
        getIndex(): number;
        setIndex(iIndex: number): void;
        getState(): IState;
        setState(pState: IState): void;
        getIsNewExpected(): boolean;
        setIsNewExpected(isNewExpected: boolean): void;
        getExpectedSymbols(): IMap<boolean>;
        getLength(): number;
    }
}
declare module akra.parser {
    class Item implements IItem {
        private _pRule;
        private _iPos;
        private _iIndex;
        private _pState;
        private _pExpected;
        private _isNewExpected;
        private _iLength;
        public getRule(): IRule;
        public setRule(pRule: IRule): void;
        public getPosition(): number;
        public setPosition(iPos: number): void;
        public getState(): IState;
        public setState(pState: IState): void;
        public getIndex(): number;
        public setIndex(iIndex: number): void;
        public getIsNewExpected(): boolean;
        public setIsNewExpected(_isNewExpected: boolean): void;
        public getExpectedSymbols(): IMap<boolean>;
        public getLength(): number;
        constructor(pRule: IRule, iPos: number, pExpected?: IMap<boolean>);
        public isEqual(pItem: IItem, eType?: EParserType): boolean;
        public isParentItem(pItem: IItem): boolean;
        public isChildItem(pItem: IItem): boolean;
        public mark(): string;
        public end(): string;
        public nextMarked(): string;
        public isExpected(sSymbol: string): boolean;
        public addExpected(sSymbol: string): boolean;
        public toString(): string;
    }
}
declare module akra.parser {
    class State implements IState {
        private _pItemList;
        private _pNextStates;
        private _iIndex;
        private _nBaseItems;
        public getIndex(): number;
        public setIndex(iIndex: number): void;
        public getItems(): IItem[];
        public getNumBaseItems(): number;
        public getNextStates(): IMap<IState>;
        constructor();
        public hasItem(pItem: IItem, eType: EParserType): IItem;
        public hasParentItem(pItem: IItem): IItem;
        public hasChildItem(pItem: IItem): IItem;
        public hasRule(pRule: IRule, iPos: number): boolean;
        public isEmpty(): boolean;
        public isEqual(pState: IState, eType: EParserType): boolean;
        public push(pItem: IItem): void;
        public tryPush_LR0(pRule: IRule, iPos: number): boolean;
        public tryPush_LR(pRule: IRule, iPos: number, sExpectedSymbol: string): boolean;
        public getNextStateBySymbol(sSymbol: string): IState;
        public addNextState(sSymbol: string, pState: IState): boolean;
        public deleteNotBase(): void;
        public toString(isBase?: boolean): string;
    }
}
declare module akra.parser {
    class Parser implements IParser {
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
        public returnCode(pNode: IParseNode): string;
        public init(sGrammar: string, eMode?: EParseMode, eType?: EParserType): boolean;
        public parse(sSource: string, fnFinishCallback?: IFinishFunc, pCaller?: any): EParserCode;
        public setParseFileName(sFileName: string): void;
        public getParseFileName(): string;
        public pause(): EParserCode;
        public resume(): EParserCode;
        public printStates(isBaseOnly?: boolean): void;
        public printState(iStateIndex: number, isBaseOnly?: boolean): void;
        public getGrammarSymbols(): IMap<string>;
        public getSyntaxTree(): IParseTree;
        public _saveState(): IParserState;
        public _loadState(pState: IParserState): void;
        public addAdditionalFunction(sFuncName: string, fnRuleFunction: IRuleFunction): void;
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
declare module akra.fx {
    class EffectParser extends parser.Parser {
        private _pIncludedFilesMap;
        constructor();
        public defaultInit(): void;
        public _addIncludedFile(sFileName: string): void;
        private _addType();
        private _includeCode();
        public _saveState(): parser.IParserState;
        public _loadState(pState: parser.IParserState): void;
    }
}
declare module akra.fx {
    /** For addComponent/delComponent/hasComponent */
    var ALL_PASSES: number;
    /** Only for hasComponent */
    var ANY_PASS: number;
    /** For addComponent/delComponent/hasComponent */
    var ANY_SHIFT: number;
    /** For addComponent/delComponent/hasComponent  */
    var DEFAULT_SHIFT: number;
    /** @const */
    var effectParser: EffectParser;
    function initAFXParser(sGrammar: string): void;
}
declare module akra.pool.resources {
    class RenderMethod extends ResourcePoolItem implements IRenderMethod {
        public _pEffect: IEffect;
        public _pSurfaceMaterial: ISurfaceMaterial;
        public _pPassInputList: IAFXPassInputBlend[];
        public _nTotalPasses: number;
        public isReady(): boolean;
        public createResource(): boolean;
        public getEffect(): IEffect;
        public setEffect(pEffect: IEffect): void;
        public getSurfaceMaterial(): ISurfaceMaterial;
        public setSurfaceMaterial(pMaterial: ISurfaceMaterial): void;
        public getMaterial(): IMaterial;
        public isEqual(pRenderMethod: IRenderMethod): boolean;
        public setForeign(sName: string, pValue: any, iPass?: number): void;
        public setUniform(sName: string, pValue: any, iPass?: number): void;
        public setTexture(sName: string, pValue: ITexture, iPass?: number): void;
        public setRenderState(eState: ERenderStates, eValue: ERenderStateValues, iPass?: number): void;
        public setSamplerTexture(sName: string, sTexture: string, iPass?: number): void;
        public setSamplerTexture(sName: string, pTexture: ITexture, iPass?: number): void;
        public _getPassInput(iPass: number): IAFXPassInputBlend;
        /** Clear previous pass-inputs.*/
        public updateEffect(pEffect: IEffect): void;
    }
}
declare module akra.pool.resources {
    class Effect extends ResourcePoolItem implements IEffect {
        public _nTotalPasses: number;
        public _nTotalComponents: number;
        public getTotalComponents(): number;
        public getTotalPasses(): number;
        public isEqual(pEffect: IEffect): boolean;
        public isReplicated(): boolean;
        public isMixid(): boolean;
        public isParameterUsed(pParam: any, iPass?: number): boolean;
        public createResource(): boolean;
        public replicable(bValue: boolean): void;
        public miscible(bValue: boolean): void;
        public addComponent(iComponentHandle: number, iShift?: number, iPass?: number): boolean;
        public addComponent(pComponent: IAFXComponent, iShift?: number, iPass?: number): boolean;
        public addComponent(sComponent: string, iShift?: number, iPass?: number): boolean;
        public delComponent(iComponentHandle: number, iShift?: number, iPass?: number): boolean;
        public delComponent(sComponent: string, iShift?: number, iPass?: number): boolean;
        public delComponent(pComponent: IAFXComponent, iShift?: number, iPass?: number): boolean;
        public hasComponent(sComponent: string, iShift?: number, iPass?: number): boolean;
        public activate(iShift?: number): boolean;
        public deactivate(): boolean;
        public findParameter(pParam: any, iPass?: number): any;
        private getComposer();
    }
}
declare module akra.pool.resources {
    class Component extends ResourcePoolItem implements IAFXComponent {
        private _pTechnique;
        private _pComposer;
        public create(): void;
        public getTechnique(): IAFXTechniqueInstruction;
        public setTechnique(pTechnique: IAFXTechniqueInstruction): void;
        public isPostEffect(): boolean;
        public getName(): string;
        public getTotalPasses(): number;
        public getHash(iShift: number, iPass: number): string;
    }
}
declare module akra.animation {
    function createController(pEngine: IEngine, sName?: string, iOptions?: number): IAnimationController;
}
declare module akra.deps {
    function resolve(a: any, b?: any): string;
    /**
    * @param sType Resource string type.
    * @param isResource Is the resource dependence?
    */
    function addDependenceHandler(pTypes: string[], fnPoolSelector: (pRsmgr: IResourcePoolManager) => IResourcePool<any>, fnHandler: IDepHandler): void;
    /** Get lowest level of deps. */
    function getLowestLevel(pDeps: IDependens): IDependens;
    function calcDepth(pDeps: IDependens): number;
    function eachLevel(pDeps: IDependens, fn: (pDeps: IDependens, pParentDeps: IDependens) => void): void;
    /**
    * Recursive walk
    */
    function walk(pDeps: IDependens, fn: (pDeps: IDependens, i: number, iDepth: number, pParentDeps: IDependens) => void, iDepth?: number, fnEnd?: Function, pParentDeps?: IDependens): void;
    function each(pDeps: IDependens, fn: (pDep: IDep) => void): void;
    function countFiles(pDeps: IDependens): number;
    /**
    * Make the <path> absolute for IDep
    */
    function normalize(pDeps: IDependens, sRoot?: string, iDepth?: number): void;
    function getType(pDep: IDep): string;
    function loadResource(pEngine: IEngine, pDep: IDep, cb: (pDep: IDep, eStatus: EDependenceStatuses, pData?: any) => void): void;
    function loadMap(pEngine: IEngine, pDep: IDep, cb: (pDep: IDep, eStatus: EDependenceStatuses, pData?: any) => void): void;
    function loadGrammar(pEngine: IEngine, pDep: IDep, cb: (pDep: IDep, eStatus: EDependenceStatuses, pData?: any) => void): void;
    function loadCustom(pEngine: IEngine, pDep: IDep, cb: (pDep: IDep, eStatus: EDependenceStatuses, pData?: any) => void): void;
    function loadJSON(pEngine: IEngine, pDep: IDep, cb: (pDep: IDep, eStatus: EDependenceStatuses, pData?: any) => void): void;
    function loadBSON(pEngine: IEngine, pDep: IDep, cb: (pDep: IDep, eStatus: EDependenceStatuses, pData?: any) => void): void;
    function loadARA(pEngine: IEngine, pArchiveDep: IDep, cb: (pDep: IDep, eStatus: EDependenceStatuses, pData?: any) => void): void;
    /**
    * @param pEngine Engine instance.
    * @param pDeps Dependencies list.
    * @param sRoot Default root path for loading resources. (config.data for ex.)
    * @param fnLoaded All loaded?
    * @param fnStatusChanged
    */
    function load(pEngine: IEngine, pDeps: IDependens, sRoot: string, fnLoaded: (e: Error, pDeps: IDependens) => void, fnProgress?: (e: IDepEvent) => void): void;
    function link(pParent: IDependens, pChild: IDependens): IDependens;
    function createDependenceByPath(sPath: string, sType?: string, sRoot?: string): IDependens;
}
declare module akra.pool {
    function isVideoResource(pItem: IResourcePoolItem): boolean;
}
declare module akra.pool.resources {
    class Collada extends ResourcePoolItem implements ICollada {
        static DEFAULT_OPTIONS: IColladaLoadOptions;
        private static SCENE_TEMPLATE;
        private static ANIMATION_TEMPLATE;
        private static COLLADA_MATERIAL_NAMES;
        private _pModel;
        private _pOptions;
        private _pLinks;
        private _pLib;
        private _pMeshCache;
        private _pMaterialCache;
        private _pAsset;
        private _pVisualScene;
        private _pAnimations;
        private _sFilename;
        private _pXMLDocument;
        private _pXMLRoot;
        private _iByteLength;
        public getModelFormat(): EModelFormats;
        public getOptions(): IColladaLoadOptions;
        public getByteLength(): number;
        public _setByteLength(iByteLength: number): void;
        constructor();
        public isShadowsEnabled(): boolean;
        private trifanToTriangles(pXML, iStride);
        private polygonToTriangles(pXML, iStride);
        private tristripToTriangles(pXML, iStride);
        private polylistToTriangles(pXML, iStride);
        private eachNode(pXMLList, fnCallback, nMax?);
        private eachChild(pXML, fnCallback);
        private eachByTag(pXML, sTag, fnCallback, nMax?);
        private findNode(pNodes, sNode?, fnNodeCallback?);
        private COLLADATranslateMatrix(pXML);
        private COLLADARotateMatrix(pXML);
        private COLLADAScaleMatrix(pXML);
        private COLLADAData(pXML);
        private COLLADAGetSourceData(pSource, pFormat);
        private COLLADATransform(pXML, id?);
        private COLLADANewParam(pXML);
        private COLLADAAsset(pXML?);
        private COLLADALibrary(pXML, pTemplate);
        private COLLADAAccessor(pXML);
        private COLLADAInput(pXML, iOffset?);
        private COLLADATechniqueCommon(pXML);
        private COLLADASource(pXML);
        private COLLADAVertices(pXML);
        private COLLADAJoints(pXML);
        static isSingleIndexedPolygons(pPolygons: IColladaPolygons): boolean;
        private COLLADAPolygons(pXML, sType);
        private COLLADAVertexWeights(pXML);
        private COLLADAMesh(pXML);
        private static isCOLLADAMeshOptimized(pMesh);
        private optimizeCOLLADAMesh(pMesh);
        private COLLADANodeChanged(pBefore, pAfter);
        private isCOLLADAChangesTracingEnabled();
        private COLLADAGeometrie(pXML);
        private COLLADASkin(pXML);
        private COLLADAController(pXML);
        private COLLADAImage(pXML);
        private COLLADASurface(pXML);
        private COLLADATexture(pXML);
        private COLLADASampler2D(pXML);
        private COLLADAPhong(pXML);
        private COLLADAEffectTechnique(pXML);
        private COLLADAProfileCommon(pXML);
        private COLLADAEffect(pXML);
        private COLLADAMaterial(pXML);
        private COLLADANode(pXML, iDepth?);
        private COLLADAVisualScene(pXML);
        private COLLADABindMaterial(pXML);
        private COLLADAInstanceEffect(pXML);
        private COLLADAInstanceController(pXML);
        private COLLADAInstanceGeometry(pXML);
        private COLLADAInstanceCamera(pXML);
        private COLLADAInstanceLight(pXML);
        private COLLADAScene(pXML?);
        private COLLADAPerspective(pXML);
        private COLLADAOptics(pXML);
        private COLLADACamera(pXML);
        private COLLADALight(pXML);
        private COLLADAAnimationSampler(pXML);
        private COLLADAAnimationChannel(pXML);
        private COLLADAAnimation(pXML);
        private source(sUrl);
        private link(el, pTarget?);
        private target(sPath);
        private buildAnimationTrack(pChannel);
        private buildAnimationTrackList(pAnimationData);
        private buildAnimation(pAnimationData);
        private buildAnimations(pAnimationsList?);
        private buildAssetTransform(pNode, pAsset?);
        private buildDeclarationFromAccessor(sSemantic, pAccessor);
        private buildDefaultMaterials(pMesh);
        private buildMaterials(pMesh, pGeometryInstance);
        private buildSkeleton(pSkeletonsList);
        private buildMesh(pGeometryInstance, isSkinned?);
        private buildSkinMesh(pControllerInstance);
        private buildSkinMeshInstance(pControllers, pSceneNode?);
        private buildMeshInstance(pGeometries, pSceneNode?);
        private buildMeshByName(sName);
        private buildMeshes();
        private buildSceneNode(pNode, pParentNode);
        private buildJointNode(pNode, pParentNode);
        private buildCamera(pColladaInstanceCamera, pParent);
        private buildNodes(pNodes, pParentNode?);
        private buildScene(pRootNode);
        private buildInititalPose(pNodes, pSkeleton);
        private buildInitialPoses(pPoseSkeletons?);
        private buildComplete();
        public setOptions(pOptions: IColladaLoadOptions): void;
        private setXMLDocument(pDocument);
        private getXMLDocument();
        private setXMLRoot(pXML);
        private getXMLRoot();
        private findMesh(sName);
        private addMesh(pMesh);
        private findMaterial(sName);
        private addMaterial(sName, pMaterial);
        private prepareInput(pInput);
        public isVisualSceneLoaded(): boolean;
        public isAnimationLoaded(): boolean;
        private isSceneNeeded();
        private isAnimationNeeded();
        private isPoseExtractionNeeded();
        private isWireframeEnabled();
        private getSkeletonsOutput();
        private addSkeleton(pSkeleton);
        private getImageOptions();
        private getVisualScene();
        public getAnimations(): IColladaAnimation[];
        public getAnimation(i: number): IColladaAnimation;
        public getAsset(): IColladaAsset;
        private isLibraryLoaded(sLib);
        private isLibraryExists(sLib);
        private getLibrary(sLib);
        public getBasename(): string;
        public getVersion(): string;
        public getFilename(): string;
        private setFilename(sName);
        private readLibraries(pXML, pTemplates);
        private checkLibraries(pXML, pTemplates);
        public parse(sXMLData: string, pOptions?: IColladaLoadOptions): boolean;
        public loadResource(sFilename?: string, pOptions?: IColladaLoadOptions): boolean;
        private uploadMaterial(sMaterial);
        private syncMaterials();
        public extractUsedMaterials(): IMaterial[];
        public toBlob(): Blob;
        public extractMesh(sMeshName?: string): IMesh;
        public extractModel(pScene: IScene3d, sMeshName?: string): ISceneModel;
        public extractModel(pNode: ISceneNode, sMeshName?: string): ISceneModel;
        public extractModel(sMeshName?: string): ISceneModel;
        public extractFullScene(pScene: IScene3d): IModelEntry;
        public extractFullScene(pNode: ISceneNode): IModelEntry;
        public extractFullScene(): IModelEntry;
        public extractAnimation(i: number): IAnimation;
        public extractAnimations(): IAnimation[];
        /**
        * @deprecated Use Collada::extractFullScene() instead.
        */
        public attachToScene(pScene: IScene3d): IModelEntry;
        public attachToScene(pNode: ISceneNode): IModelEntry;
        private getNodeByParent(pScene);
        static isColladaResource(pItem: IResourcePoolItem): boolean;
    }
    function isModelResource(pItem: IResourcePoolItem): boolean;
}
declare module akra {
}
declare module akra.pool.resources {
    enum EObjFVF {
        XYZ = 1,
        NORMAL = 2,
        UV = 4,
    }
    class Obj extends ResourcePoolItem implements IObj {
        private _sFilename;
        private _iByteLength;
        private _pOptions;
        private _pVertices;
        private _pNormals;
        private _pTextureCoords;
        private _pVertexIndexes;
        private _pTexcoordIndexes;
        private _pNormalIndexes;
        private _iFVF;
        public getModelFormat(): EModelFormats;
        public getByteLength(): number;
        public getOptions(): IObjLoadOptions;
        public getFilename(): string;
        public getBasename(): string;
        private setFilename(sName);
        public setOptions(pOptions: IObjLoadOptions): void;
        public attachToScene(pScene: IScene3d): IModelEntry;
        public attachToScene(pNode: ISceneNode): IModelEntry;
        private buildMesh(pRoot);
        public uploadVertexes(pPositions: Float32Array, pIndexes?: Float32Array): void;
        public parse(sData: string, pOptions?: IObjLoadOptions): boolean;
        private calcDeps();
        private calcVertexIndices();
        private calcNormals(useSmoothing?);
        static VERTEX_REGEXP: RegExp;
        static TEXCOORD_REGEXP: RegExp;
        static NORMAL_REGEXP: RegExp;
        public readVertexInfo(s: string): void;
        public hasTexcoords(): boolean;
        public hasNormals(): boolean;
        static VERTEX_UV_FACE_REGEXP: RegExp;
        static VERTEX_NORMAL_FACE_REGEXP: RegExp;
        static VERTEX_UV_NORMAL_FACE_REGEXP: RegExp;
        public readFaceInfo(s: string): void;
        public loadResource(sFilename?: string, pOptions?: IObjLoadOptions): boolean;
        static DEFAULT_OPTIONS: IObjLoadOptions;
        private static row;
    }
}
declare module akra.pool.resources {
    class EffectData extends ResourcePoolItem {
        private _pFile;
        private _pSyntaxTree;
        public createResource(): boolean;
        public getByteLength(): number;
        public loadResource(sFileName?: string): boolean;
        public _initFromParsedEffect(eCode: parser.EParserCode, sFileName: string): void;
        public _initFromBinaryData(pData: Uint8Array, sFileName: string): void;
    }
}
declare module akra.data {
    class VertexData implements IVertexData {
        public guid: number;
        public resized: ISignal<(pData: IVertexData, iByteLength: number) => void>;
        public relocated: ISignal<(pData: IVertexData, iFrom: number, iTo: number) => void>;
        public declarationChanged: ISignal<(pData: IVertexData, pDecl: IVertexDeclaration) => void>;
        public updated: ISignal<(pData: IVertexData) => void>;
        private _pVertexBuffer;
        private _iOffset;
        private _iStride;
        private _iLength;
        private _pVertexDeclaration;
        private _iId;
        public getID(): number;
        public getLength(): number;
        public getByteOffset(): number;
        public getByteLength(): number;
        public getBuffer(): IVertexBuffer;
        public getStride(): number;
        public getStartIndex(): number;
        constructor(pVertexBuffer: IVertexBuffer, id: number, iOffset: number, iCount: number, nSize: number);
        constructor(pVertexBuffer: IVertexBuffer, id: number, iOffset: number, iCount: number, pDecl: IVertexDeclaration);
        public setupSignals(): void;
        public getVertexDeclaration(): IVertexDeclaration;
        public setVertexDeclaration(pDecl: IVertexDeclaration): boolean;
        public getVertexElementCount(): number;
        public hasSemantics(sUsage: string): boolean;
        public destroy(): void;
        public extend(pDecl: IVertexDeclaration, pData?: ArrayBufferView): boolean;
        public resize(nCount: number, pDecl?: IVertexDeclaration): boolean;
        public resize(nCount: number, iStride?: number): boolean;
        public applyModifier(sUsage: string, fnModifier: IBufferDataModifier): boolean;
        public setData(pData: ArrayBufferView, iOffset: number, iSize?: number, nCountStart?: number, nCount?: number): boolean;
        public setData(pData: ArrayBufferView, sUsage?: string, iSize?: number, nCountStart?: number, nCount?: number): boolean;
        /**
        * @param iOffset Offset in bytes.
        * @param iSize Size of single lement in bytes.
        * @param iFrom=0 Element number with which to begin reading data.
        * @param iCount=::getLength() Number of element to be returned.
        */
        public getData(iOffset: number, iSize: number, iFrom?: number, iCount?: number): ArrayBuffer;
        /**
        * @param sUsage Get data by usage.
        * @sa Usages, VertexDeclaration
        */
        public getData(sUsage: string): ArrayBuffer;
        /**
        * @param sUsage Usage of data.
        * @param iFrom Element number with which to begin reading data.
        * @param iCount Number of element to be returned.
        */
        public getData(sUsage: string, iFrom: number, iCount: number): ArrayBuffer;
        /**
        * Get all data.
        */
        public getData(): ArrayBuffer;
        public getTypedData(sUsage: string, iFrom?: number, iCount?: number): ArrayBufferView;
        public getBufferHandle(): number;
        public toString(): string;
    }
}
declare module akra.pool.resources {
    class MemoryBuffer extends HardwareBuffer {
        public _pData: Uint8Array;
        public getByteLength(): number;
        public getLength(): number;
        public create(iByteSize: number, iFlags?: number): boolean;
        public destroy(): void;
        public resize(iSize: number): boolean;
        public lockImpl(iOffset: number, iLength: number, iLockFlags: number): Uint8Array;
        public readData(ppDest: ArrayBufferView): boolean;
        public readData(iOffset: number, iSize: number, ppDest: ArrayBufferView): boolean;
        public writeData(pData: ArrayBufferView, iOffset?: number, iSize?: number, bDiscardWholeBuffer?: boolean): boolean;
    }
}
declare module akra.pool.resources {
    class VertexBuffer extends HardwareBuffer implements IVertexBuffer {
        public _pVertexDataArray: IVertexData[];
        public _iDataCounter: number;
        public getType(): EVertexBufferTypes;
        public getLength(): number;
        constructor();
        public create(iByteSize: number, iFlags?: number, pData?: ArrayBufferView): boolean;
        public destroy(): void;
        public getVertexData(i: number): IVertexData;
        public getVertexData(iOffset: number, iCount: number, pElements: IVertexElement[]): IVertexData;
        public getVertexData(iOffset: number, iCount: number, pDecl: IVertexDeclaration): IVertexData;
        public getEmptyVertexData(iCount: number, pElements: IVertexElement[], ppVertexDataIn?: IVertexData): IVertexData;
        public getEmptyVertexData(iCount: number, pDecl: IVertexDeclaration, ppVertexDataIn?: IVertexData): IVertexData;
        public getEmptyVertexData(iCount: number, pSize: number, ppVertexDataIn?: IVertexData): IVertexData;
        public freeVertexData(): boolean;
        public allocateData(pElements: IVertexElementInterface[], pData: ArrayBufferView): IVertexData;
        public allocateData(pDecl: IVertexDeclaration, pData: ArrayBufferView): IVertexData;
        static isVBO(pBuffer: IVertexBuffer): boolean;
        static isTBO(pBuffer: IVertexBuffer): boolean;
    }
}
declare module akra.webgl {
    class WebGLVertexBuffer extends pool.resources.VertexBuffer implements IVertexBuffer {
        public _iByteSize: number;
        public _pWebGLBuffer: WebGLBuffer;
        private _pLockData;
        public _sCS: string;
        public getType(): EVertexBufferTypes;
        public getByteLength(): number;
        public create(iByteSize: number, iFlags?: number, pData?: ArrayBufferView): boolean;
        public destroy(): void;
        public readData(ppDest: ArrayBufferView): boolean;
        public readData(iOffset: number, iSize: number, ppDest: ArrayBufferView): boolean;
        public writeData(pData: Uint8Array, iOffset?: number, iSize?: number, bDiscardWholeBuffer?: boolean): boolean;
        public writeData(pData: ArrayBufferView, iOffset?: number, iSize?: number, bDiscardWholeBuffer?: boolean): boolean;
        public resize(iSize: number): boolean;
        public getWebGLBuffer(): WebGLBuffer;
        public lockImpl(iOffset: number, iSize: number, iLockFlags: number): any;
        public unlockImpl(): void;
        public copyBackupToRealImpl(pRealData: Uint8Array, pBackupData: Uint8Array, iLockFlags: number): void;
    }
}
declare module akra.webgl {
    class WebGLVertexTexture extends pool.resources.VertexBuffer implements IVertexBuffer {
        public _iWidth: number;
        public _iHeight: number;
        public _pWebGLTexture: WebGLTexture;
        public _eWebGLFormat: number;
        public _eWebGLType: number;
        public _ePixelFormat: EPixelFormats;
        public _bForceUpdateBackupCopy: boolean;
        public _pHeader: IVertexData;
        private _pLockData;
        public getType(): EVertexBufferTypes;
        public getByteLength(): number;
        public getWebGLTexture(): WebGLTexture;
        constructor();
        public _getWidth(): number;
        public _getHeight(): number;
        public create(iByteSize: number, iFlags?: number, pData?: Uint8Array): boolean;
        public create(iByteSize: number, iFlags?: number, pData?: ArrayBufferView): boolean;
        public destroy(): void;
        public readData(ppDest: ArrayBufferView): boolean;
        public readData(iOffset: number, iSize: number, ppDest: ArrayBufferView): boolean;
        public writeData(pData: Uint8Array, iOffset?: number, iSize?: number, bDiscardWholeBuffer?: boolean): boolean;
        public writeData(pData: ArrayBufferView, iOffset?: number, iSize?: number, bDiscardWholeBuffer?: boolean): boolean;
        public resize(iSize: number): boolean;
        public lockImpl(iOffset: number, iSize: number, iLockFlags: number): any;
        public unlockImpl(): void;
        public copyBackupToRealImpl(pRealData: Uint8Array, pBackupData: Uint8Array, iLockFlags: number): void;
        public _header(iTextureSizeX?: number, iTextureSizeY?: number): Float32Array;
        static _pWebGLBuffer1: WebGLBuffer;
        static _pWebGLBuffer2: WebGLBuffer;
        static _pWebGLBuffer3: WebGLBuffer;
    }
}
declare module akra.data {
    class IndexData implements IIndexData {
        private _pIndexBuffer;
        private _iOffset;
        private _iLength;
        private _ePrimitiveType;
        private _eElementsType;
        private _iId;
        public getID(): number;
        public getType(): EDataTypes;
        public getLength(): number;
        public getBytesPerIndex(): number;
        public getByteOffset(): number;
        public getByteLength(): number;
        public getBuffer(): IIndexBuffer;
        constructor(pIndexBuffer: IIndexBuffer, id: number, iOffset: number, iCount: number, ePrimitiveType?: EPrimitiveTypes, eElementsType?: EDataTypes);
        public getData(iOffset: number, iSize: number): ArrayBuffer;
        public getTypedData(iStart?: number, iCount?: number): ArrayBufferView;
        public setData(pData: ArrayBufferView, iOffset?: number, iCount?: number): boolean;
        public destroy(): void;
        public getPrimitiveType(): EPrimitiveTypes;
        public getPrimitiveCount(iIndexCount?: number): number;
        public getBufferHandle(): number;
        static getPrimitiveCount(eType: EPrimitiveTypes, nVertices: number): number;
    }
}
declare module akra.pool.resources {
    class IndexBuffer extends HardwareBuffer implements IIndexBuffer {
        public _pIndexDataArray: IIndexData[];
        public _iDataCounter: number;
        public geLength(): number;
        constructor();
        public create(iByteSize: number, iFlags?: number, pData?: ArrayBufferView): boolean;
        public destroy(): void;
        public getIndexData(iOffset: number, iCount: number, ePrimitiveType: EPrimitiveTypes, eElementsType: EDataTypes): IIndexData;
        public getEmptyIndexData(iCount: number, ePrimitiveType: EPrimitiveTypes, eElementsType: EDataTypes): IIndexData;
        public freeIndexData(): boolean;
        public allocateData(ePrimitiveType: EPrimitiveTypes, eElementsType: EDataTypes, pData: ArrayBufferView): IIndexData;
    }
}
declare module akra.webgl {
    class WebGLIndexBuffer extends pool.resources.IndexBuffer implements IIndexBuffer {
        public _iByteSize: number;
        public _pWebGLBuffer: WebGLBuffer;
        private _pLockData;
        public getByteLength(): number;
        constructor();
        public create(iByteSize: number, iFlags?: number, pData?: Uint8Array): boolean;
        public create(iByteSize: number, iFlags?: number, pData?: ArrayBufferView): boolean;
        public destroy(): void;
        public readData(ppDest: ArrayBufferView): boolean;
        public readData(iOffset: number, iSize: number, ppDest: ArrayBufferView): boolean;
        public writeData(pData: Uint8Array, iOffset?: number, iSize?: number, bDiscardWholeBuffer?: boolean): boolean;
        public writeData(pData: ArrayBufferView, iOffset?: number, iSize?: number, bDiscardWholeBuffer?: boolean): boolean;
        public getIndexData(iOffset: any, iCount: any, ePrimitiveType: any, eElementsTyps: any): IIndexData;
        public getEmptyIndexData(iCount: any, ePrimitiveType: any, eElementsTyps: any): IIndexData;
        public resize(iSize: number): boolean;
        public getWebGLBuffer(): WebGLBuffer;
        public lockImpl(iOffset: number, iSize: number, iLockFlags: number): any;
        public unlockImpl(): void;
        public copyBackupToRealImpl(pRealData: Uint8Array, pBackupData: Uint8Array, iLockFlags: number): void;
    }
}
declare module akra.webgl {
    class WebGLInternalRenderBuffer extends WebGLPixelBuffer {
        public _pWebGLRenderbuffer: WebGLRenderbuffer;
        constructor();
        public create(iFlags: number): boolean;
        public create(iWidth: number, iHeight: number, iDepth: number, eFormat: EPixelFormats, iFlags: number): boolean;
        public create(iWebGLFormat: number, iWidth: number, iHeight: number, bCreateStorage: boolean): boolean;
        public destroy(): void;
        public _bindToFramebuffer(iAttachment: number, iZOffset: number): void;
    }
}
declare module akra.pool.resources {
    class DepthBuffer extends ResourcePoolItem implements IDepthBuffer {
        public _iBitDepth: number;
        public _iWidth: number;
        public _iHeight: number;
        public _isManual: boolean;
        public _pAttachedRenderTargetsList: IRenderTarget[];
        constructor();
        public getBitDepth(): number;
        public getWidth(): number;
        public getHeight(): number;
        public create(iBitDepth: number, iWidth: number, iHeight: number, isManual: boolean): boolean;
        public destroy(): void;
        public destroyResource(): boolean;
        public isManual(): boolean;
        public isCompatible(pTarget: IRenderTarget): boolean;
        public _notifyRenderTargetAttached(pTarget: IRenderTarget): void;
        public _notifyRenderTargetDetached(pTarget: IRenderTarget): void;
        public detachFromAllRenderTargets(): void;
    }
}
declare module akra.render {
    class RenderTexture extends RenderTarget implements IRenderTexture {
        public _pBuffer: IPixelBuffer;
        public _iZOffset: number;
        constructor(pRenderer: IRenderer, pBuffer: IPixelBuffer, iZOffset: number);
        public enableSupportFor3DEvent(iType: number): number;
        public getPixelBuffer(): IPixelBuffer;
        public destroy(): void;
        public suggestPixelFormat(): EPixelFormats;
        public copyContentsToMemory(pDest: IPixelBox, eBuffer: EFramebuffer): void;
        public readPixels(ppDest?: IPixelBox, eFramebuffer?: EFramebuffer): IPixelBox;
    }
}
declare module akra.webgl {
    class WebGLRenderTexture extends render.RenderTexture {
        public _pFrameBuffer: WebGLInternalFrameBuffer;
        public getWidth(): number;
        public getHeight(): number;
        constructor(pRenderer: IRenderer, pTarget: IPixelBuffer);
        public destroy(): void;
        public requiresTextureFlipping(): boolean;
        public getCustomAttribute(sName: string): any;
        public swapBuffers(): void;
        public attachDepthBuffer(pDepthBuffer: IDepthBuffer): boolean;
        public attachDepthPixelBuffer(pBuffer: IPixelBuffer): boolean;
        public attachDepthTexture(pTexture: ITexture): boolean;
        public detachDepthPixelBuffer(): void;
        public detachDepthBuffer(): void;
        public detachDepthTexture(): void;
    }
}
declare module akra.webgl {
    interface IWebGLAttachments {
        [webGLAttachment: number]: WebGLPixelBuffer;
    }
    class WebGLInternalFrameBuffer {
        private _pWebGLRenderer;
        private _pWebGLFramebuffer;
        private _pAttachments;
        private _iWebglActiveAttachment;
        constructor(pWebGLRenderer: IRenderer);
        public destroy(): void;
        public getWidth(): number;
        public getHeight(): number;
        public getFormat(): number;
        public getColorAttachment(iAttachment: number): WebGLPixelBuffer;
        public getAttachment(iWebGLAttachment: number): WebGLPixelBuffer;
        public bindSurface(iWebGLAttachment: number, pSurface: IPixelBuffer): void;
        public unbindSurface(iWebGLAttachment: number): void;
        public bindColorSurface(iAttachment: number, pSurface: IPixelBuffer): void;
        public _bind(): void;
        public attachDepthBuffer(pDepthBuffer: IDepthBuffer): void;
        public attachDepthTexture(pDepthTexture: ITexture): void;
        public detachDepthTexture(): void;
        public detachDepthBuffer(): void;
        public swapBuffers(): void;
        private checkAttachment(iWebGLAttachment);
        private releaseAttachment(iWebGLAttachment);
    }
}
declare module akra.webgl {
    class WebGLDepthBuffer extends pool.resources.DepthBuffer {
        public _pDepthBuffer: WebGLInternalRenderBuffer;
        public _pStencilBuffer: WebGLInternalRenderBuffer;
        constructor();
        public getDepthBuffer(): WebGLInternalRenderBuffer;
        public getStencilBuffer(): WebGLInternalRenderBuffer;
        public create(iBitDepth: number, iWidth: number, iHeight: number, bManual: boolean): boolean;
        public create(pDepth: WebGLInternalRenderBuffer, pStencil: WebGLInternalRenderBuffer, iWidth: number, iHeight: number, isManual: boolean): boolean;
        public destroy(): void;
        public isCompatible(pTarget: IRenderTarget): boolean;
    }
}
declare module akra.pool {
    class ResourcePoolManager implements IResourcePoolManager {
        private pSurfaceMaterialPool;
        private pEffectPool;
        private pRenderMethodPool;
        private pVertexBufferPool;
        private pIndexBufferPool;
        private pColladaPool;
        private pObjPool;
        private pImagePool;
        private pTexturePool;
        private pVideoBufferPool;
        private pShaderProgramPool;
        private pComponentPool;
        private pTextureBufferPool;
        private pRenderBufferPool;
        private pDepthBufferPool;
        private pEffectDataPool;
        /** Списки пулов по семействам ресурсов */
        private pResourceFamilyList;
        /** Карта пулов по коду ресурса */
        private pResourceTypeMap;
        private pEngine;
        public getSurfaceMaterialPool(): IResourcePool<ISurfaceMaterial>;
        public getEffectPool(): IResourcePool<IEffect>;
        public getRenderMethodPool(): IResourcePool<IRenderMethod>;
        public getVertexBufferPool(): IResourcePool<IVertexBuffer>;
        public getIndexBufferPool(): IResourcePool<IIndexBuffer>;
        public getColladaPool(): IResourcePool<ICollada>;
        public getObjPool(): IResourcePool<IObj>;
        public getImagePool(): IResourcePool<IImg>;
        public getTexturePool(): IResourcePool<ITexture>;
        public getVideoBufferPool(): IResourcePool<IVertexBuffer>;
        public getShaderProgramPool(): IResourcePool<IShaderProgram>;
        public getComponentPool(): IResourcePool<IAFXComponent>;
        public getTextureBufferPool(): IResourcePool<IPixelBuffer>;
        public getRenderBufferPool(): IResourcePool<IPixelBuffer>;
        public getDepthBufferPool(): IResourcePool<IDepthBuffer>;
        public getEffectDataPool(): IResourcePool<IResourcePoolItem>;
        constructor(pEngine: IEngine);
        public initialize(): boolean;
        public destroy(): void;
        public registerResourcePool(pCode: IResourceCode, pPool: IResourcePool<IResourcePoolItem>): void;
        public unregisterResourcePool(pCode: IResourceCode): IResourcePool<IResourcePoolItem>;
        public destroyResourceFamily(eFamily: EResourceFamilies): void;
        public restoreResourceFamily(eFamily: EResourceFamilies): void;
        public disableResourceFamily(eFamily: EResourceFamilies): void;
        public cleanResourceFamily(eFamily: EResourceFamilies): void;
        public destroyResourceType(pCode: IResourceCode): void;
        public restoreResourceType(pCode: IResourceCode): void;
        public disableResourceType(pCode: IResourceCode): void;
        public cleanResourceType(pCode: IResourceCode): void;
        public findResourcePool(pCode: IResourceCode): IResourcePool<IResourcePoolItem>;
        public findResourceHandle(pCode: IResourceCode, sName: string): number;
        public findResource(pCode: IResourceCode, sName: string): IResourcePoolItem;
        public findResource(pCode: IResourceCode, iHandle: number): IResourcePoolItem;
        public destroyAll(): void;
        public restoreAll(): void;
        public disableAll(): void;
        public clean(): void;
        public createDeviceResources(): boolean;
        public destroyDeviceResources(): boolean;
        public restoreDeviceResources(): boolean;
        public disableDeviceResources(): boolean;
        public getEngine(): IEngine;
        public createRenderMethod(sResourceName: string): IRenderMethod;
        public createTexture(sResourceName: string): ITexture;
        public createEffect(sResourceName: string): IEffect;
        public createSurfaceMaterial(sResourceName: string): ISurfaceMaterial;
        public createVertexBuffer(sResourceName: string): IVertexBuffer;
        public createVideoBuffer(sResourceName: string): IVertexBuffer;
        public createIndexBuffer(sResourceName: string): IIndexBuffer;
        public createShaderProgram(sResourceName: string): IShaderProgram;
        public createModel(sResourceName: string, eFormat?: EModelFormats): IModel;
        public getModelPoolByFormat(eFormat: EModelFormats): IResourcePool<IResourcePoolItem>;
        public loadModel(sFilename: string, pOptions?: IModelLoadOptions): IModel;
        public createImg(sResourceName: string): IImg;
        public loadImage(sFilename: string): IImg;
        private createDeviceResource();
        private registerDeviceResources();
        private unregisterDeviceResources();
        private static pTypedResourseTotal;
    }
}
declare module akra.scene {
    class SceneManager implements ISceneManager {
        private _pEngine;
        private _pSceneList;
        private _fUpdateTimeCount;
        private _fMillisecondsPerTick;
        constructor(pEngine: IEngine);
        public getEngine(): IEngine;
        public update(): void;
        public notifyUpdateScene(): void;
        public notifyPreUpdateScene(): void;
        public createScene3D(sName?: string): IScene3d;
        public createScene2D(sName?: string): IScene2d;
        public createUI(): IScene2d;
        public getScene3D(): IScene3d;
        public getScene3D(sName: string): IScene3d;
        public getScene3D(iScene: number): IScene3d;
        public getScene2D(): IScene2d;
        public getScene2D(sName: string): IScene2d;
        public getScene2D(iScene: number): IScene2d;
        public getScene(IScene?: number, eType?: ESceneTypes): IScene;
        public initialize(): boolean;
        public destroy(): void;
    }
}
declare module akra {
    interface IDDSCodec extends IImgCodec {
    }
}
declare module akra.pixelUtil {
    class DDSCodec extends ImgCodec implements IDDSCodec {
        private _sType;
        private static _pInstance;
        public magicNumberToFileExt(pMagicNumber: Uint8Array): string;
        static startup(): void;
        static shutdown(): void;
        public getType(): string;
        public decode(pData: Uint8Array, pImgData: IImgData): Uint8Array;
    }
}
declare module akra.data {
    class BufferMap extends util.ReferenceCounter implements IBufferMap {
        public guid: number;
        public modified: ISignal<(pMap: IBufferMap) => void>;
        private _pFlows;
        private _pMappers;
        private _pIndex;
        private _nLength;
        private _ePrimitiveType;
        private _pCompleteFlows;
        private _nCompleteFlows;
        private _nCompleteVideoBuffers;
        private _pCompleteVideoBuffers;
        private _nUsedFlows;
        private _pEngine;
        private _nStartIndex;
        private _pBuffersCompatibleMap;
        private _pSemanticsMap;
        private _nUpdates;
        constructor(pEngine: IEngine);
        public setupSignals(): void;
        public getPrimType(): EPrimitiveTypes;
        public setPrimType(eType: EPrimitiveTypes): void;
        public getIndex(): IIndexData;
        public setIndex(pIndexData: IIndexData): void;
        public getLength(): number;
        public setLength(nLength: number): void;
        public _setLengthForce(nLength: number): void;
        public getTotalUpdates(): number;
        public getPrimCount(): number;
        public getLimit(): number;
        public getStartIndex(): number;
        public getSize(): number;
        public getFlows(): IDataFlow[];
        public getMappers(): IDataMapper[];
        public getOffset(): number;
        public _draw(): void;
        private drawArrays();
        private drawElements();
        public getFlow(sSemantics: string, bComplete?: boolean): IDataFlow;
        public getFlow(iFlow: number, bComplete?: boolean): IDataFlow;
        public getFlowBySemantic(sSemantics: string): IDataFlow;
        public reset(nFlowLimit?: number): void;
        public flow(pVertexData: IVertexData): number;
        public flow(iFlow: number, pVertexData: IVertexData): number;
        private clearLinks();
        private linkFlow(pFlow);
        public checkData(pData: IVertexData): boolean;
        public findMapping(pMap: any, eSemantics: any, iAddition: any): IDataMapper;
        public mapping(iFlow: number, pMap: IVertexData, eSemantics: string, iAddition?: number): boolean;
        private trackData(pData);
        private untrackData(pData);
        public update(): boolean;
        public findFlow(sSemantics: string): IDataFlow;
        public clone(bWithMapping?: boolean): IBufferMap;
        public toString(bListAll?: boolean): string;
    }
    function createBufferMap(pEngine: IEngine): IBufferMap;
}
declare module akra.model {
    function createSkeleton(sName?: string): ISkeleton;
}
declare module akra.control {
    class GamepadMap implements IGamepadMap {
        public connected: ISignal<(pGamepadMap: IGamepadMap, pGamepad: Gamepad) => void>;
        public disconnected: ISignal<(pGamepadMap: IGamepadMap, pGamepad: Gamepad) => void>;
        public updated: ISignal<(pGamepadMap: IGamepadMap, pGamepad: Gamepad) => void>;
        public guid: number;
        private _bTicking;
        private _pCollection;
        private _pPrevRawGamepadTypes;
        private _pPrevTimestamps;
        constructor();
        public setupSignals(): void;
        public init(): boolean;
        public isActive(): boolean;
        public find(sID?: string): Gamepad;
        public find(i?: number): Gamepad;
        private startPolling();
        private stopPolling();
        public update(): void;
        private pollStatus();
        private pollGamepads();
    }
}
declare module akra.control {
    class KeyMap implements IKeyMap {
        private _pMap;
        private _pCallbackMap;
        private _bMouseDown;
        private _v2iMousePosition;
        private _v2iMousePrevPosition;
        private _v2iMouseShift;
        constructor(pTarget?: HTMLElement);
        constructor(pTarget?: Document);
        public bind(sCombination: string, fn: Function): boolean;
        public capture(pTarget: Document): void;
        public capture(pTarget: HTMLElement): void;
        public captureMouse(pTarget: HTMLElement): void;
        public captureMouse(pTarget: Document): void;
        public captureKeyboard(pTarget: Document): void;
        public captureKeyboard(pTarget: HTMLElement): void;
        public dispatch(e?: MouseEvent): void;
        private callListeners();
        public isKeyPress(iCode: number): any;
        public isKeyPress(eCode: EKeyCodes): any;
        /**  */ 
        public getMouse(): IVec2;
        /**  */ 
        public getMouseShift(): IVec2;
        public isMouseMoved(): boolean;
        public isMousePress(): boolean;
        public update(): void;
    }
}
declare module akra.control {
    function createGamepadMap(): IGamepadMap;
    function createKeymap(target?: Document): IKeyMap;
    function createKeymap(target?: HTMLElement): IKeyMap;
}
declare module akra.model {
    class Sky implements IEventProvider {
        private _pEngine;
        public guid: number;
        public skyDome: ISceneModel;
        public sun: ISunLight;
        public _fSunTheta: number;
        public _fSunPhi: number;
        public _fKr: number;
        public _fKr4PI: number;
        public _fKm: number;
        public _fKm4PI: number;
        public _fESun: number;
        public _fKrESun: number;
        public _fKmESun: number;
        public _fg: number;
        public _fg2: number;
        public _fExposure: number;
        public _fInnerRadius: number;
        public _fInnerRadius2: number;
        public _fOuterRadius: number;
        public _fOuterRadius2: number;
        public _fScale: number;
        public _fScaleOverScaleDepth: number;
        public _fRayleighScaleDepth: number;
        public _fMieScaleDepth: number;
        public _nHorinLevel: number;
        public time: number;
        private _v3fSunDir;
        private _v3fInvWavelength4;
        private _v3fHG;
        private _v3fEye;
        private _v3fGroundc0;
        private _v3fGroundc1;
        private _nSize;
        private _nSamples;
        private _v2fTex;
        private _pBackBuffer;
        private _pSurface;
        private _pSkyBuffer;
        private _pSkyBackBuffer;
        private _pSkyBlitBox;
        constructor(_pEngine: IEngine, nCols: number, nRows: number, fR: number);
        /** Number of sample rays to use in integral equation */
        public getSize(): number;
        public getSampler(): number;
        public setWaveLength(x: number, y: number, z: number): Sky;
        public setWaveLength(v3fLength: IVec3): Sky;
        public getWaveLength(v3fDest?: IVec3): IVec3;
        public setupSignals(): void;
        public getEngine(): IEngine;
        public getSunDirection(): IVec3;
        public scale(fCos: number): number;
        public expv(v: IVec3): IVec3;
        private _init();
        public init(): void;
        private updateSunLight();
        private createBuffers();
        public _onSkyDomeTexRender(pTechnique: IRenderTechnique, iPass: number): void;
        private _pScreen;
        private _pSkyDomeViewport;
        private getWrite();
        private getRead();
        public updateSkyBuffer(pPass: IRenderPass): void;
        public createDome(Cols: number, Rows: number): IMesh;
        public k: number;
        public update(pSceneObject: ISceneObject, pCamera: ICamera, pPass: IRenderPass): void;
        public setTime(T: number): void;
        public _onDomeRender(pTechnique: IRenderTechnique, iPass: number, pRenderable: IRenderableObject, pSceneObject: ISceneObject, pViewport: IViewport): void;
    }
}
declare var AE_CORE_DEPENDENCIES: {
    path: string;
    type: string;
};
declare module akra.core {
    class Engine implements IEngine {
        public frameStarted: ISignal<(pEngine: IEngine) => void>;
        public frameEnded: ISignal<(pEngine: IEngine) => void>;
        public depsLoaded: ISignal<(pEngine: IEngine, pDeps: IDependens) => void>;
        public inactive: ISignal<(pEngine: IEngine) => void>;
        public active: ISignal<(pEngine: IEngine) => void>;
        public guid: number;
        private _pResourceManager;
        private _pSceneManager;
        private _pParticleManager;
        private _pSpriteManager;
        private _pRenderer;
        private _pComposer;
        /** stop render loop?*/
        private _pTimer;
        private _iStatus;
        private _pGamepads;
        private _fElapsedAppTime;
        constructor(pOptions?: IEngineOptions);
        public setupSignals(): void;
        /** Get app time */
        public getTime(): number;
        public getElapsedTime(): number;
        public enableGamepads(): boolean;
        public getGamepads(): IGamepadMap;
        private parseOptions(pOptions);
        public getSpriteManager(): ISpriteManager;
        public getScene(): IScene3d;
        public getSceneManager(): ISceneManager;
        public getParticleManager(): IParticleManager;
        public getResourceManager(): IResourcePoolManager;
        public getRenderer(): IRenderer;
        public getComposer(): IAFXComposer;
        public isActive(): boolean;
        public isPaused(): boolean;
        public isLoaded(): boolean;
        public isHidden(): boolean;
        public isFrozen(): boolean;
        public isLaunched(): boolean;
        public exec(bValue?: boolean): void;
        public renderFrame(): boolean;
        public play(): void;
        public pause(): void;
        public _stop(): void;
        public _start(): void;
        public _setPaused(bValue: boolean): void;
        public _setHidden(bValue: boolean): void;
        public _setLaunched(bValue: boolean): void;
        public createMesh(sName?: string, eOptions?: number, pDataBuffer?: IRenderDataCollection): IMesh;
        public createRenderDataCollection(iOptions?: number): IRenderDataCollection;
        public createBufferMap(): IBufferMap;
        public createAnimationController(sName?: string, iOptions?: number): IAnimationController;
        public ready(cb?: (pEngine: IEngine) => void): boolean;
    }
}
declare module akra {
    var Vec2: typeof math.Vec2;
    var Vec3: typeof math.Vec3;
    var Vec4: typeof math.Vec4;
    var Mat3: typeof math.Mat3;
    var Mat4: typeof math.Mat4;
    var Quat4: typeof math.Quat4;
    var Color: typeof color.Color;
    function createEngine(pOtions?: IEngineOptions): IEngine;
}
