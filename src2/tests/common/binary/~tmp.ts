

















// #define CRYPTO_API 1








module akra {

	export enum ELogLevel {
        NONE = 0x0000,
        LOG = 0x0001,
        INFORMATION = 0x0002,
        WARNING = 0x0004,
        ERROR = 0x0008,
        CRITICAL = 0x0010,
        ALL = 0x001F
    }

    export interface ILogRoutineFunc {
        (pEntity: ILoggerEntity): void;
    }

    export interface ISourceLocation {
        file: string;
        line:  number ;
    }

    export interface ILoggerEntity {
        code:  number ;
        location: ISourceLocation;
        message?: string;
        info: any;
    }

    export interface ILogger {

///**
//* For plugin api:
//* Load file with custom user codes and three messages 
//*/
//loadManifestFile(): bool;

        init(): bool;

        setLogLevel(eLevel: ELogLevel): void;
        getLogLevel(): ELogLevel;

        registerCode(eCode:  number , sMessage?: string): bool;
        setUnknownCode(eCode:  number , sMessage: string): void;

        registerCodeFamily(eCodeMin:  number , eCodeMax:  number , sFamilyName?: string): bool;

        getFamilyName(eCode:  number ): string;

        setCodeFamilyRoutine(eCodeFromFamily:  number , fnLogRoutine: ILogRoutineFunc, eLevel: ELogLevel): bool;
        setCodeFamilyRoutine(sFamilyName: string, fnLogRoutine: ILogRoutineFunc, eLevel: ELogLevel): bool;

        setLogRoutine(fnLogRoutine: ILogRoutineFunc, eLevel: ELogLevel): void;

        setSourceLocation(sFile: string, iLine:  number ): void;
        setSourceLocation(pLocation: ISourceLocation): void;

// Print messages methods

        log(...pArgs: any[]);

        info(pEntity: ILoggerEntity): void;
        info(eCode:  number , ...pArgs: any[]): void;
        info(...pArgs: any[]): void;

        warning(pEntity: ILoggerEntity): void;
        warning(eCode:  number , ...pArgs: any[]): void;
        warning(...pArgs: any[]): void;

        error(pEntity: ILoggerEntity): void;
        error(eCode:  number , ...pArgs: any[]): void;
        error(...pArgs: any[]): void;

        criticalError(pEntity: ILoggerEntity): void;
        criticalError(eCode:  number , ...pArgs: any[]): void;
        criticalError(...pArgs: any[]):void;

        assert(bCondition: bool, pEntity: ILoggerEntity): void;
        assert(bCondition: bool, eCode:  number , ...pArgs: any[]): void;
        assert(bCondition: bool, ...pArgs: any[]):void;

    }
}


























/*I ## */
/*I ## */
/*I ## */
/*I ## */


module akra {


    export var  DEBUG : bool = true;


    export var logger: ILogger;
    export var typeOf: (x: any) => string;

    typeOf = function typeOf(x: any): string {
        var s: string = typeof x;

        if (s === "object") {
            if (x) {

                if (x instanceof Array) {
                    return 'array';
                } else if (x instanceof Object) {
                    return s;
                }

                var sClassName = Object.prototype.toString.call(x);

                if (sClassName == '[object Window]') {
                    return 'object';
                }

                if ((sClassName == '[object Array]' ||
                     typeof x.length == 'number' &&
                     typeof x.splice != 'undefined' &&
                     typeof x.propertyIsEnumerable != 'undefined' &&
                     !x.propertyIsEnumerable('splice')

                    )) {
                    return 'array';
                }

                if ((sClassName == '[object Function]' ||
                    typeof x.call != 'undefined' &&
                    typeof x.propertyIsEnumerable != 'undefined' &&
                    !x.propertyIsEnumerable('call'))) {
                    return 'function';
                }

            } else {
                return 'null';
            }

        } else if (s == 'function' && typeof x.call == 'undefined') {
            return 'object';
        }
        return s;
    };


/** @inline */

    export var isDef = (x: any): bool =>  x !== undefined;
/** @inline */

    export var isEmpty = (x: any): bool =>  x.length == 0;

// Note that undefined == null.
/** @inline */

    export var isDefAndNotNull = (x: any): bool =>  x != null;

/** @inline */

    export var isNull = (x: any): bool =>  x === null;

/** @inline */

    export var isBoolean = (x: any): bool => typeof x === "boolean";

/** @inline */

    export var isString = (x: any): bool => typeof x === "string";

/** @inline */

    export var isNumber = (x: any): bool => typeof x === "number";
/** @inline */

    export var isFloat = isNumber;
/** @inline */

    export var isInt = isNumber;

/** @inline */

    export var isFunction = (x: any): bool => typeOf(x) === "function";

/** @inline */

    export var isObject = (x: any): bool => {
        var type = typeOf(x);
        return type == "object" || type == "array" || type == "function";
    };

    export var isArrayBuffer = (x: any): bool => x instanceof ArrayBuffer;

    export var isTypedArray = (x: any): bool => typeof x === "object" && typeof x.byteOffset === "number";

/** @inline */

    export var isArray = (x: any): bool => {
        return typeOf(x) == "array";
    };

    export interface Pair {
        first: any;
        second: any;
    };

// if (!isDef(console.assert)) {
//     console.assert = function (isOK?: bool, ...pParams: any[]): void {
//         if (!isOK) {
//             trace('---------------------------');
//             trace.apply(null, pParams);
//             throw new Error("[assertion failed]");
//         }
//     }
// }

// export var trace = console.log.bind(console);
// export var assert = console.assert.bind(console);
// export var warning = console.warn.bind(console);
// export var error = console.error.bind(console); 









// export var debug_print = (pArg:any, ...pParams: any[]): void => {
//         trace.apply(null, arguments);
// }

// export var debug_assert = (isOK: bool, ...pParams: any[]): void => {
//         assert.apply(null, arguments);
// }

// export var debug_warning = (pArg:any, ...pParams: any[]): void => {
//         warning.apply(null, arguments);
// }

// export var debug_error = (pArg:any, ...pParams: any[]): void => {
//         error.apply(null, arguments);
// }




    export function genArray(pType: any, nSize:  number ) {
        var tmp = new Array(nSize);

        for (var i:  number  = 0; i < nSize; ++i) {
            tmp[i] = (pType? new pType: null);
        }

        return tmp;
    }


    export  /**@const*/var  INVALID_INDEX:  number  =  0xffff;

// (-2147483646);
    export  /**@const*/var  MIN_INT32:  number  = 0xffffffff;
// ( 2147483647);
    export  /**@const*/var  MAX_INT32:  number  = 0x7fffffff;
// (-32768);
    export  /**@const*/var  MIN_INT16:  number  = 0xffff;
// ( 32767);  
    export  /**@const*/var  MAX_INT16:  number  = 0x7fff;
// (-128);
    export  /**@const*/var  MIN_INT8:  number  = 0xff;
// ( 127);        
    export  /**@const*/var  MAX_INT8:  number  = 0x7f;
    export  /**@const*/var  MIN_UINT32:  number  = 0;
    export  /**@const*/var  MAX_UINT32:  number  = 0xffffffff;
    export  /**@const*/var  MIN_UINT16:  number  = 0;
    export  /**@const*/var  MAX_UINT16:  number  = 0xffff;
    export  /**@const*/var  MIN_UINT8:  number  = 0;
    export  /**@const*/var  MAX_UINT8:  number  = 0xff;


    export  /**@const*/var  SIZE_FLOAT64:  number  = 8;
    export  /**@const*/var  SIZE_REAL64:  number  = 8;
    export  /**@const*/var  SIZE_FLOAT32:  number  = 4;
    export  /**@const*/var  SIZE_REAL32:  number  = 4;
    export  /**@const*/var  SIZE_INT32:  number  = 4;
    export  /**@const*/var  SIZE_UINT32:  number  = 4;
    export  /**@const*/var  SIZE_INT16:  number  = 2;
    export  /**@const*/var  SIZE_UINT16:  number  = 2;
    export  /**@const*/var  SIZE_INT8:  number  = 1;
    export  /**@const*/var  SIZE_UINT8:  number  = 1;
    export  /**@const*/var  SIZE_BYTE:  number  = 1;
    export  /**@const*/var  SIZE_UBYTE:  number  = 1;

//1.7976931348623157e+308
    export  /**@const*/var  MAX_FLOAT64:  number  = Number.MAX_VALUE;
//-1.7976931348623157e+308
    export  /**@const*/var  MIN_FLOAT64:  number  = -Number.MAX_VALUE;
//5e-324
    export  /**@const*/var  TINY_FLOAT64:  number  = Number.MIN_VALUE;

//    export const MAX_REAL64: number = Number.MAX_VALUE;   //1.7976931348623157e+308
//    export const MIN_REAL64: number = -Number.MAX_VALUE;  //-1.7976931348623157e+308
//    export const TINY_REAL64: number = Number.MIN_VALUE;  //5e-324


//3.4e38
    export  /**@const*/var  MAX_FLOAT32:  number  = 3.4e38;
//-3.4e38
    export  /**@const*/var  MIN_FLOAT32:  number  = -3.4e38;
//1.5e-45  
    export  /**@const*/var  TINY_FLOAT32:  number  = 1.5e-45;

//    export const MAX_REAL32: number = 3.4e38;     //3.4e38
//    export const MIN_REAL32: number = -3.4e38;    //-3.4e38
//    export const TINY_REAL32: number = 1.5e-45;   //1.5e-45

    export  /**@const*/var  DEFAULT_MATERIAL_NAME: string =  "default" ;

    export enum EDataTypes {
        BYTE = 0x1400,
        UNSIGNED_BYTE = 0x1401,
        SHORT = 0x1402,
        UNSIGNED_SHORT = 0x1403,
        INT = 0x1404,
        UNSIGNED_INT = 0x1405,
        FLOAT = 0x1406
    };

    export enum EDataTypeSizes {
        BYTES_PER_BYTE = 1,
        BYTES_PER_UNSIGNED_BYTE = 1,
        BYTES_PER_UBYTE = 1,

        BYTES_PER_SHORT = 2,
        BYTES_PER_UNSIGNED_SHORT = 2,
        BYTES_PER_USHORT = 2,

        BYTES_PER_INT = 4,
        BYTES_PER_UNSIGNED_INT = 4,
        BYTES_PER_UINT = 4,

        BYTES_PER_FLOAT = 4
    };

/*
    export enum EResourceTypes {
        SURFACE = 1,
        VOLUME,
        TEXTURE,   
        VOLUMETEXTURE,
        CUBETEXTURE,
        VERTEXBUFFER,
        INDEXBUFFER,
        FORCE_DWORD = 0x7fffffff
    };

*/


    export interface StringMap {
        [index: string]: string;
        [index: number]: string;
    };

    export interface IntMap {
        [index: string]:  number ;
        [index: number]:  number ;
    };

    export interface UintMap {
        [index: string]:  number ;
        [index: number]:  number ;
    };

    export interface FloatMap {
        [index: string]:  number ;
        [index: number]:  number ;
    };

    export interface BoolMap {
        [index: string]: bool;
        [index: number]: bool;
    };

    export interface BoolDMap{
        [index: string]: BoolMap;
        [index: number]: BoolMap;
    };

    export interface StringDMap{
        [index: string]: StringMap;
        [index: number]: StringMap;
    }

/**
     * Возвращет размер типа в байтах
     **/

//export function getTypeSize(eType: EImageTypes): uint;
    export function getTypeSize(eType: EDataTypes):  number ;
    export function getTypeSize(eType):  number  {
        switch (eType) {
            case EDataTypes.BYTE:
            case EDataTypes.UNSIGNED_BYTE:
                return 1;
            case EDataTypes.SHORT:
            case EDataTypes.UNSIGNED_SHORT:
//case EImageTypes.UNSIGNED_SHORT_4_4_4_4:
//case EImageTypes.UNSIGNED_SHORT_5_5_5_1:
//case EImageTypes.UNSIGNED_SHORT_5_6_5:
                return 2;
            case EDataTypes.INT:
            case EDataTypes.UNSIGNED_INT:
            case EDataTypes.FLOAT:
                return 4;
            default:
                logger.setSourceLocation( "common.ts" , 401 ); logger.error('unknown data/image type used'); ;
        }

        return 0;
    }


    export var sid = ():  number  => (++ sid._iTotal);
    sid._iTotal = 0;


    export function now():  number  {
        return (new Date).getTime();
    }



    export  /**@inline*/  function memcpy(pDst: ArrayBuffer, iDstOffset:  number , pSrc: ArrayBuffer, iSrcOffset:  number , nLength:  number ) {
      var dstU8 = new Uint8Array(pDst, iDstOffset, nLength);
      var srcU8 = new Uint8Array(pSrc, iSrcOffset, nLength);
      dstU8.set(srcU8);
    };


//export function 

	(<any>window).URL = (<any>window).URL ? (<any>window).URL : (<any>window).webkitURL ? (<any>window).webkitURL : null;
	(<any>window).BlobBuilder = (<any>window).WebKitBlobBuilder || (<any>window).MozBlobBuilder || (<any>window).BlobBuilder;
	(<any>window).requestFileSystem = (<any>window).requestFileSystem || (<any>window).webkitRequestFileSystem;
	(<any>window).requestAnimationFrame = (<any>window).requestAnimationFrame || (<any>window).webkitRequestAnimationFrame ||
		(<any>window).mozRequestAnimationFrame;
	(<any>window).WebSocket = (<any>window).WebSocket || (<any>window).MozWebSocket;
    (<any>window).storageInfo = (<any>window).storageInfo || (<any>window).webkitStorageInfo;
    Worker.prototype.postMessage = (<any>Worker).prototype.webkitPostMessage || Worker.prototype.postMessage;
};






function utf8_encode (argString: string): string {
// Encodes an ISO-8859-1 string to UTF-8  
// 
// version: 1109.2015
// discuss at: http://phpjs.org/functions/utf8_encode
// +   original by: Webtoolkit.info (http://www.webtoolkit.info/)
// +   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
// +   improved by: sowberry
// +    tweaked by: Jack
// +   bugfixed by: Onno Marsman
// +   improved by: Yves Sucaet
// +   bugfixed by: Onno Marsman
// +   bugfixed by: Ulrich
// +   bugfixed by: Rafal Kukawski
// *     example 1: utf8_encode('Kevin van Zonneveld');
// *     returns 1: 'Kevin van Zonneveld'
    if (argString === null || typeof argString === "undefined") {
        return "";
    }
// .replace(/\r\n/g, "\n").replace(/\r/g, "\n");
    var string = (argString + "");
    var utftext = "",
        start, end, stringl = 0;

    start = end = 0;
    stringl = string.length;
    for (var n = 0; n < stringl; n++) {
        var c1 = string.charCodeAt(n);
        var enc = null;

        if (c1 < 128) {
            end++;
        } else if (c1 > 127 && c1 < 2048) {
            enc = String.fromCharCode((c1 >> 6) | 192) + String.fromCharCode((c1 & 63) | 128);
        }
        else {
            enc = String.fromCharCode((c1 >> 12) | 224) + String.fromCharCode(((c1 >> 6) & 63) | 128)
                + String.fromCharCode((c1 & 63) | 128);
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
}


function utf8_decode (str_data: string): string {
// http://kevin.vanzonneveld.net
// +   original by: Webtoolkit.info (http://www.webtoolkit.info/)
// +      input by: Aman Gupta
// +   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
// +   improved by: Norman "zEh" Fuchs
// +   bugfixed by: hitwork
// +   bugfixed by: Onno Marsman
// +      input by: Brett Zamir (http://brett-zamir.me)
// +   bugfixed by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
// *     example 1: utf8_decode('Kevin van Zonneveld');
// *     returns 1: 'Kevin van Zonneveld'
    var tmp_arr = [],
        i = 0,
        ac = 0,
        c1 = 0,
        c2 = 0,
        c3 = 0;

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
        }
        else {
            c2 = str_data.charCodeAt(i + 1);
            c3 = str_data.charCodeAt(i + 2);
            tmp_arr[ac++] = String.fromCharCode(((c1 & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
            i += 3;
        }
    }

    return tmp_arr.join("");
}



interface String {
    toUTF8(): string;
    fromUTF8(): string;



    replaceAt(n:  number , s: string);

}

interface Array {
    last: any;
    first: any;
    el(i : number ): any;
    clear(): any[];
    swap(i:  number , j:  number ): any[];
    insert(elements: any[]): any[];
    find(pElement: any): bool;
}

interface Number {
    toHex(length:  number ): string;
    printBinary(isPretty?: bool);
}

module akra.libs {
/**
     * Encodes an ISO-8859-1 string to UTF-8
     * @treturn String
     */

    String.prototype.toUTF8 = function () {
        return utf8_encode(this);
    };

/**
     * Converts a UTF-8 encoded string to ISO-8859-1
     * @treturn String
     */

    String.prototype.fromUTF8 = function () {
        return utf8_decode(this);
    };



    String.prototype.replaceAt = function (n, chr) {
        return this.substr(0, n) + chr + this.substr(n + chr.length);
    };


    Object.defineProperty(Array.prototype, 'first', {
        enumerable: false,
        configurable: true,
        get: function() {
            return this[0];
        }
    });

    Object.defineProperty(Array.prototype, 'last', {
        enumerable: false,
        configurable: true,
        get: function() {
            return this[this.length - 1];
        }
    });

    Object.defineProperty(Array.prototype, 'el', {
        enumerable: false,
        configurable: true,
        value: function (i) {i = i || 0; return this[i < 0? this.length + i: i];}
    });

    Object.defineProperty(Array.prototype, 'clear', {
        enumerable: false,
        configurable: true,
        value: function () {this.length = 0;}
    });

    Object.defineProperty(Array.prototype, 'swap', {
        enumerable: false,
        configurable: true,
        value: function (i, j) {
            if (i < this.length && j < this.length) {
                var t = this[i]; this[i] = this[j]; this[j] = t;
            }
        }
    });

    Object.defineProperty(Array.prototype, 'insert', {
        enumerable: false,
        configurable: true,
        value: function (pElement) {
            if (typeof pElement.length === 'number') {
                for (var i = 0, n = pElement.length; i < n; ++ i) {
                    this.push(pElement[i]);
                };
            }
            else {
                this.push(pElement);
            }

            return this;
        }
    });

    Number.prototype.toHex = function (iLength:  number ): string {
        var sValue = this.toString(16);

        for (var i = 0; i < iLength - sValue.length; ++ i) {
            sValue = '0' + sValue;
        }

        return sValue;
    };

    Number.prototype.printBinary = function (isPretty: bool = true): string {
        var res: string = "";
        for (var i = 0; i < 32; ++i) {
            if (i && (i % 4) == 0 && isPretty) {
                res = ' ' + res;
            }
            (this >> i & 0x1 ? res = '1' + res : res = '0' + res);
        }
        return res;
    };
}
















/**
 * FLAG(x)
 * Сдвиг единицы на @a x позиций влево.
 */



/**
 * TEST_BIT(value, bit)
 * Проверка того что у @a value бит под номером @a bit равен единице.
 */



/**
 * TEST_ALL(value, set)
 * Проверка того что у @a value равны единице все биты,
 * которые равны единице у @a set.
 */



/**
 * TEST_ANY(value, set)
 * Проверка того что у @a value равны единице хотя бы какие то из битов,
 * которые равны единице у @a set.
 */



/**
 * SET_BIT(value, bit)
 * Выставляет бит под номером @a bit у числа @a value равным единице
 */






/**
 * CLEAR_BIT(value, bit)
 * Выставляет бит под номером @a bit у числа @a value равным нулю
 */



/**
 * SET_ALL(value, set)
 * Выставляет все биты у числа @a value равными единице,
 * которые равны единице у числа @a set
 */



/**
 * CLEAR_ALL(value, set)
 * Выставляет все биты у числа @a value равными нулю,
 * которые равны единице у числа @a set
 */



//#define SET_ALL(value, set, setting) (setting ? SET_ALL(value, set) : CLEAR_ALL(value, set))



module akra.bf {
/**
	 * Сдвиг единицы на @a x позиций влево.
	 * @inline
	 */

	export var flag = (x:  number ) => (1 << (x));
/**
	 * Проверка того что у @a value бит под номером @a bit равен единице.
	 * @inline
	 */

	export var testBit = (value:  number , bit:  number ) => ((value & flag(bit)) != 0);
/**
	 * Проверка того что у @a value равны единице все биты,
 	 * которые равны единице у @a set.
	 * @inline
	 */

	export var testAll = (value:  number , set:  number ) => (((value) & (set)) == (set));
/**
	 * Проверка того что у @a value равны единице хотя бы какие то из битов,
 	 * которые равны единице у @a set.
	 * @inline
	 */

	export var testAny = (value:  number , set:  number ) => (((value) & (set)) != 0);
/**
	 * Выставляет бит под номером @a bit у числа @a value равным единице
	 * @inline
	 */

	export var setBit = (value:  number , bit:  number , setting: bool = true) => (setting ? ((value) |= flag((bit))) : clearBit(value, bit));
/**
	 * 
	 * @inline
	 */

	export var clearBit = (value:  number , bit:  number ) => ((value) &= ~flag((bit)));
/**
	 * Выставляет бит под номером @a bit у числа @a value равным нулю
	 * @inline
	 */

	export var setAll = (value:  number , set:  number , setting: bool = true) => (setting ? setAll(value, set) : clearAll(value, set));
/**
	 * Выставляет все биты у числа @a value равными единице,
 	 * которые равны единице у числа @a set
	 * @inline
	 */

	export var clearAll = (value:  number , set:  number ) => ((value) &= ~(set));
/**
	 * Выставляет все биты у числа @a value равными нулю,
 	 * которые равны единице у числа @a set
	 * @inline
	 */

	export var equal = (value:  number , src:  number ) => { value = src; };
/**
	 * Прирасваивает числу @a value число @a src
	 * @inline
	 */

	export var isEqual = (value:  number , src:  number ) => value == src;
/**
	 * Если число @a value равно числу @a src возвращается true
	 * @inline
	 */

	export var isNotEqaul = (value:  number , src:  number ) => value != src;
/**
	 * Прирасваивает числу @a value число @a src
	 * @inline
	 */

	export var set = (value:  number , src:  number ) => { value = src; };
/**
	 * Обнуляет число @a value
	 * @inline
	 */

	export var clear = (value:  number ) => { value = 0; };
/**
	 * Выставляет все биты у числа @a value равными единице,
 	 * которые равны единице у числа @a src
	 * @inline
	 */

	export var setFlags = (value:  number , src:  number ) => (value |= src);
/**
	 * Выставляет все биты у числа @a value равными нулю,
 	 * которые равны единице у числа @a src
	 * @inline
	 */

	export var clearFlags = (value:  number , src:  number ) => value &= ~src;
/**
	 * Проверяет равно ли число @a value нулю. Если равно возвращает true.
 	 * Если не равно возвращает false.
	 * @inline
	 */

	export var isEmpty = (value:  number ) => (value == 0);
/**
	 * Возвращает общее количество бит числа @a value.
 	 * На самом деле возвращает всегда 32.
	 * @inline
	 */

	export var totalBits = (value:  number ) => 32;
/**
	 * Возвращает общее количество ненулевых бит числа @a value.
	 * @inline
	 */

	export var totalSet = (value:  number ):  number  => {
		var count:  number  = 0;
        var total:  number  = totalBits(value);

        for (var i:  number  = total; i; --i) {
            count += (value & 1);
            value >>= 1;
        }

        return(count);
	}

/**
     * Convert N bit colour channel value to P bits. It fills P bits with the
     * bit pattern repeated. (this is /((1<<n)-1) in fixed point)
     */

    export  /**@inline*/  function fixedToFixed(value:  number , n:  number , p:  number ):  number  {
        if(n > p) {
// Less bits required than available; this is easy
            value >>= n-p;
        }
        else if(n < p) {
// More bits required than are there, do the fill
// Use old fashioned division, probably better than a loop
            if(value == 0)
                    value = 0;
            else if(value == (< number >(1)<<n)-1)
                    value = (1<<p)-1;
            else    value = value*(1<<p)/((1<<n)-1);
        }
        return value;
    }

/**
     * Convert floating point colour channel value between 0.0 and 1.0 (otherwise clamped) 
     * to integer of a certain number of bits. Works for any value of bits between 0 and 31.
     */

    export  /**@inline*/  function floatToFixed(value:  number , bits:  number ):  number  {
        if(value <= 0.0) return 0;
        else if (value >= 1.0) return (1<<bits)-1;
        else return < number >(value * (1<<bits));
    }

/**
     * Fixed point to float
     */

    export  /**@inline*/  function fixedToFloat(value:  number , bits:  number ):  number  {
        return < number >(value&((1<<bits)-1))/< number >((1<<bits)-1);
    }

/**
     * Write a n*8 bits integer value to memory in native endian.
     */

    export  /**@inline*/  function intWrite(pDest: Uint8Array, n:  number , value:  number ): void {
        switch(n) {
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
    }

/**
     * Read a n*8 bits integer value to memory in native endian.
     */

    export  /**@inline*/  function intRead(pSrc: Uint8Array, n:  number ):  number  {
        switch(n) {
            case 1:
                return pSrc[0];
            case 2:
                return pSrc[0] | pSrc[1]<<8;
            case 3:
                return pSrc[0] | pSrc[1]<<8 | pSrc[2]<<16;
            case 4:
                return (pSrc[0]) | (pSrc[1]<<8) | (pSrc[2]<<16) | (pSrc[3]<<24);
        }
        return 0;
    }

    export function floatToHalfI(i:  number ):  number ;

//float32/uint32 union
    var _u32 = new Uint32Array(1);
    var _f32 = new Float32Array(_u32.buffer);

    export  /**@inline*/  function floatToHalf(f:  number ) {
    	_f32[0] = f;
    	return floatToHalfI(_u32[0]);
    }
    export  /**@inline*/  function floatToHalfI(i:  number ):  number  {

        var s:  number  =  (i >> 16) & 0x00008000;
        var e:  number  = ((i >> 23) & 0x000000ff) - (127 - 15);
        var m:  number  =   i        & 0x007fffff;

        if (e <= 0) {
            if (e < -10)
            {
                return 0;
            }
            m = (m | 0x00800000) >> (1 - e);

            return < number >(s | (m >> 13));
        }
        else if (e == 0xff - (127 - 15)) {
// Inf            if (m == 0)
            {
                return < number >(s | 0x7c00);
            }
// NAN            else
            {
                m >>= 13;
                return < number >(s | 0x7c00 | m | < number ><any>(m == 0));
            }
        }
        else {
// Overflow            if (e > 30)
            {
                return < number >(s | 0x7c00);
            }

            return < number >(s | (e << 10) | (m >> 13));
        }
    }

/**
     * Convert a float16 (NV_half_float) to a float32
     * Courtesy of OpenEXR
     */

    export  /**@inline*/  function halfToFloat(y:  number ):  number  {
        _u32[0] = halfToFloatI(y);
        return _f32[0];
    }

/** Converts a half in uint16 format to a float
	 	in uint32 format
	 */

    export  /**@inline*/  function halfToFloatI(y:  number ):  number  {
        var s:  number  = (y >> 15) & 0x00000001;
        var e:  number  = (y >> 10) & 0x0000001f;
        var m:  number  =  y        & 0x000003ff;

        if (e == 0) {
// Plus or minus zero
            if (m == 0)  {
                return s << 31;
            }
// Denormalized number -- renormalize it
            else {
                while (!(m & 0x00000400)) {
                    m <<= 1;
                    e -=  1;
                }

                e += 1;
                m &= ~0x00000400;
            }
        }
        else if (e == 31) {
//Inf
            if (m == 0) {
                return (s << 31) | 0x7f800000;
            }
//NaN
            else {
                return (s << 31) | 0x7f800000 | (m << 13);
            }
        }

        e = e + (127 - 15);
        m = m << 13;

        return (s << 31) | (e << 23) | m;
    }

}


// #include "Singleton.ts"

module akra.util {

    export interface ILogRoutineMap {
        [eLogLevel:  number ]: ILogRoutineFunc;
    }

    export  interface ICodeFamily {
        familyName: string;
        codeMin:  number ;
        codeMax:  number ;
    }

    export  interface ICodeFamilyMap{
        [familyName: string]: ICodeFamily;
    }

    export interface ICodeInfo{
        code:  number ;
        message: string;
        familyName: string;
    }

    export interface ICodeInfoMap{
        [code:  number ] : ICodeInfo;
    }

    export interface ICodeFamilyRoutineDMap{
        [familyName: string]: ILogRoutineMap;
    }

/* extends Singleton*/
    export class Logger                       implements ILogger {
        private _eLogLevel: ELogLevel;
        private _pGeneralRoutineMap: ILogRoutineMap;

        private _pCurrentSourceLocation: ISourceLocation;
        private _pLastLogEntity: ILoggerEntity;

        private _pCodeFamilyList: ICodeFamily[];
        private _pCodeFamilyMap: ICodeFamilyMap;
        private _pCodeInfoMap: ICodeInfoMap;

        private _pCodeFamilyRoutineDMap: ICodeFamilyRoutineDMap;

        private _nFamilyGenerator:  number ;
        static private _sDefaultFamilyName: string = "CodeFamily";

        private _eUnknownCode:  number ;
        private _sUnknownMessage: string;

        constructor () {
//super();

            this._eUnknownCode = 0;
            this._sUnknownMessage = "Unknown code";

            this._eLogLevel = ELogLevel.ALL;
            this._pGeneralRoutineMap = <ILogRoutineMap>{};

            this._pCurrentSourceLocation = <ISourceLocation>{
                                            file: "",
                                            line: 0
                                        };

            this._pLastLogEntity = <ILoggerEntity>{
                                    code: this._eUnknownCode,
                                    location: this._pCurrentSourceLocation,
                                    message: this._sUnknownMessage,
                                    info: null,
                                   };

            this._pCodeFamilyMap = <ICodeFamilyMap>{};
            this._pCodeFamilyList = <ICodeFamily[]>[];
            this._pCodeInfoMap = <ICodeInfoMap>{};

            this._pCodeFamilyRoutineDMap = <ICodeFamilyRoutineDMap>{};

            this._nFamilyGenerator = 0;


        }

        init(): bool {
//TODO: Load file
            return true;
        }

        setLogLevel(eLevel: ELogLevel): void {
            this._eLogLevel = eLevel;
        }

        getLogLevel(): ELogLevel {
            return this._eLogLevel;
        }

        registerCode(eCode:  number , sMessage?: string = this._sUnknownMessage): bool{
            if(this.isUsedCode(eCode)){
                return false;
            }

            var sFamilyName: string = this.getFamilyName(eCode);
            if(isNull(sFamilyName)){
                return false;
            }

            var pCodeInfo: ICodeInfo = <ICodeInfo>{
                                            code: eCode,
                                            message: sMessage,
                                            familyName: sFamilyName
                                            };

            this._pCodeInfoMap[eCode] = pCodeInfo;

            return true;
        }

        setUnknownCode(eCode:  number , sMessage: string):void{
            this._eUnknownCode = eCode;
            this._sUnknownMessage = sMessage;
        }

        registerCodeFamily(eCodeMin:  number , eCodeMax:  number , sFamilyName?: string): bool{
            if(!isDef(sFamilyName)){
                sFamilyName = this.generateFamilyName();
            }

            if(this.isUsedFamilyName(sFamilyName)){
                return false;
            }

            if(!this.isValidCodeInterval(eCodeMin, eCodeMax)){
                return false;
            }

            var pCodeFamily: ICodeFamily = <ICodeFamily>{
                                                    familyName: sFamilyName,
                                                    codeMin: eCodeMin,
                                                    codeMax: eCodeMax
                                                    };

            this._pCodeFamilyMap[sFamilyName] = pCodeFamily;
            this._pCodeFamilyList.push(pCodeFamily);

            return true;
        }

        getFamilyName(eCode): string{
            var i:  number  = 0;
            var pCodeFamilyList: ICodeFamily[] = this._pCodeFamilyList;
            var pCodeFamily: ICodeFamily;

            for(i = 0; i < pCodeFamilyList.length; i++){
                pCodeFamily = pCodeFamilyList[i];

                if(pCodeFamily.codeMin <= eCode && pCodeFamily.codeMax >= eCode){
                    return pCodeFamily.familyName;
                }
            }

            return null;
        }

        setCodeFamilyRoutine(eCodeFromFamily:  number , fnLogRoutine: ILogRoutineFunc, eLevel: ELogLevel): bool;
        setCodeFamilyRoutine(sFamilyName: string, fnLogRoutine: ILogRoutineFunc, eLevel: ELogLevel): bool;
        setCodeFamilyRoutine():bool {
            var sFamilyName: string;
            var fnLogRoutine: ILogRoutineFunc;
            var eLevel:ELogLevel;

            if(isInt(arguments[0])){
                sFamilyName = this.getFamilyName(arguments[0]);
                fnLogRoutine = arguments[1];
                eLevel = arguments[2];

                if(isNull(sFamilyName)){
                    return false;
                }
            }
            else if(isString(arguments[0])){
                sFamilyName = arguments[0];
                fnLogRoutine = arguments[1];
                eLevel = arguments[2];
            }

            if(!this.isUsedFamilyName(sFamilyName)){
                return false;
            }

            var pCodeFamilyRoutineMap: ILogRoutineMap = this._pCodeFamilyRoutineDMap[sFamilyName];

            if(!isDef(pCodeFamilyRoutineMap)){
                pCodeFamilyRoutineMap = this._pCodeFamilyRoutineDMap[sFamilyName] = <ILogRoutineMap>{};
            }

            if (bf.testAll(eLevel, ELogLevel.LOG)) {
               pCodeFamilyRoutineMap[ELogLevel.LOG] = fnLogRoutine;
            }
            if (bf.testAll(eLevel, ELogLevel.INFORMATION)) {
               pCodeFamilyRoutineMap[ELogLevel.INFORMATION] = fnLogRoutine;
            }
            if (bf.testAll(eLevel, ELogLevel.WARNING)) {
               pCodeFamilyRoutineMap[ELogLevel.WARNING] = fnLogRoutine;
            }
            if (bf.testAll(eLevel, ELogLevel.ERROR)) {
               pCodeFamilyRoutineMap[ELogLevel.ERROR] = fnLogRoutine;
            }
            if (bf.testAll(eLevel, ELogLevel.CRITICAL)) {
               pCodeFamilyRoutineMap[ELogLevel.CRITICAL] = fnLogRoutine;
            }

            return true;
        }

        setLogRoutine(fnLogRoutine: ILogRoutineFunc, eLevel: ELogLevel): void {

            if (bf.testAll(eLevel, ELogLevel.LOG)) {
               this._pGeneralRoutineMap[ELogLevel.LOG] = fnLogRoutine;
            }
            if (bf.testAll(eLevel, ELogLevel.INFORMATION)) {
               this._pGeneralRoutineMap[ELogLevel.INFORMATION] = fnLogRoutine;
            }
            if (bf.testAll(eLevel, ELogLevel.WARNING)) {
               this._pGeneralRoutineMap[ELogLevel.WARNING] = fnLogRoutine;
            }
            if (bf.testAll(eLevel, ELogLevel.ERROR)) {
               this._pGeneralRoutineMap[ELogLevel.ERROR] = fnLogRoutine;
            }
            if (bf.testAll(eLevel, ELogLevel.CRITICAL)) {
               this._pGeneralRoutineMap[ELogLevel.CRITICAL] = fnLogRoutine;
            }
        }

        setSourceLocation(sFile: string, iLine:  number ): void;
        setSourceLocation(pLocation: ISourceLocation): void;
        setSourceLocation(): void {
            var sFile: string;
            var iLine:  number ;

            if(arguments.length === 2){
                sFile = arguments[0];
                iLine = arguments[1];
            }
            else {
                if(isDef(arguments[0]) && !(isNull(arguments[0]))){
                    sFile = arguments[0].file;
                    iLine = arguments[0].line;
                }
                else{
                    sFile = "";
                    iLine = 0;
                }
            }

            this._pCurrentSourceLocation.file = sFile;
            this._pCurrentSourceLocation.line = iLine;
        }


        log(...pArgs: any[]): void {
            if(!bf.testAll(this._eLogLevel, ELogLevel.LOG)){
                return;
            }

            var fnLogRoutine:ILogRoutineFunc = this._pGeneralRoutineMap[ELogLevel.LOG];
            if(!isDef(fnLogRoutine)){
                return;
            }

            var pLogEntity: ILoggerEntity = this._pLastLogEntity;

            pLogEntity.code = this._eUnknownCode;
            pLogEntity.location = this._pCurrentSourceLocation;
            pLogEntity.info = pArgs;
            pLogEntity.message = this._sUnknownMessage;

            fnLogRoutine.call(null, pLogEntity);
        }

        info(pEntity: ILoggerEntity): void;
        info(eCode:  number , ...pArgs: any[]): void;
        info(...pArgs: any[]): void;
        info(): void {
            if(!bf.testAll(this._eLogLevel, ELogLevel.INFORMATION)){
                return;
            }

            var pLogEntity: ILoggerEntity;
            var fnLogRoutine: ILogRoutineFunc;

            pLogEntity = this.prepareLogEntity.apply(this, arguments);
            fnLogRoutine = this.getCodeRoutineFunc(pLogEntity.code, ELogLevel.INFORMATION);

            if(isNull(fnLogRoutine)){
                return;
            }

            fnLogRoutine.call(null, pLogEntity);
        }

        warning(pEntity: ILoggerEntity): void;
        warning(eCode:  number , ...pArgs: any[]): void;
        warning(...pArgs: any[]): void;
        warning(): void {
            if(!bf.testAll(this._eLogLevel, ELogLevel.WARNING)){
                return;
            }

            var pLogEntity: ILoggerEntity;
            var fnLogRoutine: ILogRoutineFunc;

            pLogEntity = this.prepareLogEntity.apply(this, arguments);
            fnLogRoutine = this.getCodeRoutineFunc(pLogEntity.code, ELogLevel.WARNING);

            if(isNull(fnLogRoutine)){
                return;
            }

            fnLogRoutine.call(null, pLogEntity);
        }

        error(pEntity: ILoggerEntity): void;
        error(eCode:  number , ...pArgs: any[]): void;
        error(...pArgs: any[]): void;
        error(): void {
            if(!bf.testAll(this._eLogLevel, ELogLevel.ERROR)){
                return;
            }

            var pLogEntity: ILoggerEntity;
            var fnLogRoutine: ILogRoutineFunc;

            pLogEntity = this.prepareLogEntity.apply(this, arguments);
            fnLogRoutine = this.getCodeRoutineFunc(pLogEntity.code, ELogLevel.ERROR);

            if(isNull(fnLogRoutine)){
                return;
            }

            fnLogRoutine.call(null, pLogEntity);
        }

        criticalError(pEntity: ILoggerEntity): void;
        criticalError(eCode:  number , ...pArgs: any[]): void;
        criticalError(...pArgs: any[]):void;
        criticalError():void {

            var pLogEntity: ILoggerEntity;
            var fnLogRoutine: ILogRoutineFunc;

            pLogEntity = this.prepareLogEntity.apply(this, arguments);
            fnLogRoutine = this.getCodeRoutineFunc(pLogEntity.code, ELogLevel.CRITICAL);

            var sSystemMessage: string = "A Critical error has occured! Code: " + pLogEntity.code.toString();

            if(bf.testAll(this._eLogLevel, ELogLevel.CRITICAL) && !isNull(fnLogRoutine)){
                fnLogRoutine.call(null, pLogEntity);
            }

            alert(sSystemMessage);
            throw new Error(sSystemMessage);
        }

        assert(bCondition: bool, pEntity: ILoggerEntity): void;
        assert(bCondition: bool, eCode:  number , ...pArgs: any[]): void;
        assert(bCondition: bool, ...pArgs: any[]):void;
        assert():void{
            var bCondition: bool = <bool> arguments[0];

            if(!bCondition){
                var pLogEntity: ILoggerEntity;
                var fnLogRoutine: ILogRoutineFunc;

                var pArgs: any[] = [];

                for(var i = 1; i < arguments.length; i++){
                    pArgs[i - 1] = arguments[i];
                }

                pLogEntity = this.prepareLogEntity.apply(this, pArgs);
                fnLogRoutine = this.getCodeRoutineFunc(pLogEntity.code, ELogLevel.CRITICAL);

                var sSystemMessage: string = "A error has occured! Code: " + pLogEntity.code.toString() +
                                             "\n Accept to exit, refuse to continue.";

                if(bf.testAll(this._eLogLevel, ELogLevel.CRITICAL) && !isNull(fnLogRoutine)){
                    fnLogRoutine.call(null, pLogEntity);
                }

                if(confirm(sSystemMessage)){
                    throw new Error(sSystemMessage);
                }
            }
        }


        private generateFamilyName(): string {
            var sSuffix: string = <string><any>(this._nFamilyGenerator++);
            var sName: string = Logger._sDefaultFamilyName + sSuffix;

            if(this.isUsedFamilyName(sName)){
                return this.generateFamilyName();
            }
            else {
                return sName;
            }
        }

        private isValidCodeInterval(eCodeMin:  number , eCodeMax:  number ): bool{
            if(eCodeMin > eCodeMax){
                return false;
            }

            var i:  number  = 0;
            var pCodeFamilyList: ICodeFamily[] = this._pCodeFamilyList;
            var pCodeFamily: ICodeFamily;

            for(i = 0; i < pCodeFamilyList.length; i++){
                pCodeFamily = pCodeFamilyList[i];

                if((pCodeFamily.codeMin <= eCodeMin && pCodeFamily.codeMax >= eCodeMin) ||
                   (pCodeFamily.codeMin <= eCodeMax && pCodeFamily.codeMax >= eCodeMax)){

                    return false;
                }
            }

            return true;
        }

        private  /**@inline*/  isUsedFamilyName(sFamilyName: string): bool{
            return isDef(this._pCodeFamilyMap[sFamilyName]);
        }

        private  /**@inline*/  isUsedCode(eCode:  number ): bool{
            return isDef(this._pCodeInfoMap[eCode]);
        }

        private isLogEntity(pObj:any):bool {
            if(isObject(pObj) && isDef(pObj.code) && isDef(pObj.location)){
                return true;
            }

            return false;
        }

        private  /**@inline*/  isLogCode(eCode:any):bool {
            return isInt(eCode);
        }

        private prepareLogEntity(pEntity: ILoggerEntity): void;
        private prepareLogEntity(eCode:  number , ...pArgs: any[]): void;
        private prepareLogEntity(pArgs:any[]): ILoggerEntity;
        private prepareLogEntity(): ILoggerEntity{
            var eCode:  number  = this._eUnknownCode;
            var sMessage:string = this._sUnknownMessage;
            var pInfo: any = null;

            if(arguments.length === 1 && this.isLogEntity(arguments[0])){
                var pEntity: ILoggerEntity = arguments[0];

                eCode = pEntity.code;
                pInfo = pEntity.info;
                this.setSourceLocation(pEntity.location);

                if(!isDef(pEntity.message)){
                    var pCodeInfo: ICodeInfo = this._pCodeInfoMap[eCode];
                    if(isDef(pCodeInfo)){
                        sMessage = pCodeInfo.message;
                    }
                }

            }
            else {
                if(this.isLogCode(arguments[0])){
                    eCode = < number >arguments[0];
                    if(arguments.length > 1){
                        pInfo = new Array(arguments.length - 1);
                        var i:  number  = 0;

                        for(i = 0; i < pInfo.length; i++){
                            pInfo[i] = arguments[i+1];
                        }
                    }
                }
                else {
                    eCode = this._eUnknownCode;
                    if(arguments.length > 0){
                        pInfo = new Array(arguments.length);
                        var i:  number  = 0;

                        for(i = 0; i < pInfo.length; i++){
                            pInfo[i] = arguments[i];
                        }
                    }
                    else {
                        pInfo = null;
                    }
                }

                var pCodeInfo: ICodeInfo = this._pCodeInfoMap[eCode];
                if(isDef(pCodeInfo)){
                    sMessage = pCodeInfo.message;
                }
            }

            var pLogEntity: ILoggerEntity = this._pLastLogEntity;

            pLogEntity.code = eCode;
            pLogEntity.location = this._pCurrentSourceLocation;
            pLogEntity.message = sMessage;
            pLogEntity.info = pInfo;

            return pLogEntity;
        }

        private getCodeRoutineFunc(eCode:  number , eLevel: ELogLevel): ILogRoutineFunc{
            var pCodeInfo: ICodeInfo = this._pCodeInfoMap[eCode];
            var fnLogRoutine: ILogRoutineFunc;

            if(!isDef(pCodeInfo)){
                fnLogRoutine = this._pGeneralRoutineMap[eLevel];
                return isDef(fnLogRoutine) ? fnLogRoutine : null;
            }

            var pCodeFamilyRoutineMap: ILogRoutineMap = this._pCodeFamilyRoutineDMap[pCodeInfo.familyName];

            if(!isDef(pCodeFamilyRoutineMap) || !isDef(pCodeFamilyRoutineMap[eLevel])) {
                fnLogRoutine = this._pGeneralRoutineMap[eLevel];
                return isDef(fnLogRoutine) ? fnLogRoutine : null;
            }

            fnLogRoutine = pCodeFamilyRoutineMap[eLevel];

            return fnLogRoutine;
        }

    }
}

module akra.util {
    export var logger: ILogger = new Logger();

    logger.init();
    logger.setUnknownCode( 0 ,  "Unknown code." );
    logger.setLogLevel(ELogLevel.ALL);

//Default code families

    logger.registerCodeFamily(0, 100, "SystemCodes");
    logger.registerCodeFamily(2000, 2199, "ParserSyntaxErrors");
    logger.registerCodeFamily(2200, 2500, "EffectSyntaxErrors");

//Default log routines

    function sourceLocationToString(pLocation: ISourceLocation): string {
        var sLocation:string = "[" + pLocation.file + ":" + pLocation.line.toString() + "]: ";
        return sLocation;
    }

    function logRoutine(pLogEntity: ILoggerEntity): void{
        var pArgs:any[] = pLogEntity.info;

        pArgs.unshift(sourceLocationToString(pLogEntity.location));
        console["log"].apply(console, pArgs);
    }

    function warningRoutine(pLogEntity: ILoggerEntity): void{
        var pArgs:any[] = pLogEntity.info;

        pArgs.unshift("Code: " + pLogEntity.code.toString());
        pArgs.unshift(sourceLocationToString(pLogEntity.location));

        console["warn"].apply(console, pArgs);
    }

    function errorRoutine(pLogEntity: ILoggerEntity): void{
        var pArgs:any[] = pLogEntity.info;

        pArgs.unshift(pLogEntity.message);
        pArgs.unshift("Error code: " + pLogEntity.code.toString() + ".");
        pArgs.unshift(sourceLocationToString(pLogEntity.location));

        console["error"].apply(console, pArgs);
    }


    logger.setLogRoutine(logRoutine, ELogLevel.LOG | ELogLevel.INFORMATION);
    logger.setLogRoutine(warningRoutine, ELogLevel.WARNING);
    logger.setLogRoutine(errorRoutine, ELogLevel.ERROR | ELogLevel.CRITICAL);
}

module akra {
    logger = util.logger;
}







module akra.util {

	window.prompt = function (message?: string, defaul?: string): string {
		console.warn("prompt > " + message);
		return null;
	}

/*window.alert = function(message?: string): void {
		console.warn("alert > " + message);
	}*/


	window.confirm = function (message?: string): bool {
		console.warn("confirm > " + message);
		return false;
	}


	var pTestCondList: ITestCond[] = [];
	var pTestList: ITestManifest[] = [];
	var isPassed: bool;
	var pTest: ITestManifest = null;
	var iBegin:  number ;

	function addCond(pCond: ITestCond): void {
		pTestCondList.unshift(pCond);
	}

	interface ITestCond {
		description: string;
		toString(): string;
		verify(pArgv: any[]): bool;
	}

	class TestCond implements ITestCond {
		private sDescription: string;
		constructor (sDescription: string) {
			this.sDescription = sDescription;
		}

		toString(): string {
			return this.sDescription;
		}

		verify(pArgv: any[]) {
			return false;
		}

		get description(): string {
			return this.sDescription;
		}
	}

	class ArrayCond extends TestCond implements ITestCond {
		/**@protected*/  _pArr: any[];
		constructor (sDescription: string, pArr: any[]) {
			super(sDescription);

			this._pArr = pArr;
		}
		verify(pArgv: any[]): bool {
			var pArr: any[] = pArgv[0];

			if (pArr.length != this._pArr.length) {
				return false;
			}

			for (var i:  number  = 0; i < pArr.length; ++ i) {
				if (pArr[i] != this._pArr[i]) {
					return false;
				}
			};

			return true;
		}
	}

	class ValueCond extends TestCond implements ITestCond {
		/**@protected*/  _pValue: any;
		/**@protected*/  _isNegate: bool;
		constructor (sDescription: string, pValue: any, isNegate: bool = false) {
			super(sDescription);

			this._pValue = pValue;
			this._isNegate = isNegate;
		}

		verify(pArgv: any[]): bool {
			var bResult: bool = pArgv[0] === this._pValue;

// console.warn(">", pArgv[0], "!==", this._pValue);
			return this._isNegate? !bResult: bResult;
		}
	}



	function output(sText: string): void {
		var pElement = document.createElement("div");
		pElement.innerHTML = sText;
		document.body.appendChild(pElement);

	}

	export function check(...pArgv: any[]): void {
		var pTest: ITestCond = pTestCondList.pop();
		var bResult: bool;

		if (!pTest) {
			console.log((<any>(new Error)).stack);
			console.warn("chech() without condition...");
			return;
		}

		bResult = pTest.verify(pArgv);
		isPassed = isPassed && bResult;

		if (bResult) {
			output("<pre style=\"margin: 0; margin-left: 20px;\"><span style=\"color: green;\"><b>[ PASSED ]</b></span> " + pTest.toString() + "</pre>");
		}
		else {
			output("<pre style=\"margin: 0; margin-left: 20px;\"><span style=\"color: red;\"><b>[ FAILED ]</b></span> " + pTest.toString() + "</pre>");
		}
	}


	export function failed(e?: Error): void {
		if (isDef(e)) {
			printError(e.message, <string>(<any>e).stack);
		}

		var iTotal:  number  = pTestCondList.length;

		for (var i:  number  = 0; i < iTotal; ++ i) {
			check(false);
		}

		isPassed = false;
		pTest = null;
		printResults();

		run();
	}

	export function shouldBeTrue(sDescription: string) {
		addCond(new ValueCond(sDescription, true));
	}

	export function shouldBeFalse(sDescription: string) {
		addCond(new ValueCond(sDescription, false));
	}

	export function shouldBeArray(sDescription: string, pArr: any) {
		addCond(new ArrayCond(sDescription, <any[]>pArr));
	}

	export function shouldBe (sDescription: string, pValue: any) {
		addCond(new ValueCond(sDescription, pValue));
	}

	export function shouldBeNotNull(sDescription: string) {
		addCond(new ValueCond(sDescription, null, true));
	}

	export interface ITestManifest {
		name: string;
		description?: string;
		entry?: () => void;
		async?: bool;
	}

	export function test(sDescription: string, fnWrapper: () => void, isAsync?: bool);
	export function test(pManifest: ITestManifest, fnWrapper: () => void, isAsync?: bool);
	export function test (manifest: any, fnWrapper: () => void, isAsync: bool = false) {
		var pManifest: ITestManifest;

		if (isString(manifest)) {
			pManifest = {
				name: <string>arguments[0],
				description: null,
				entry: fnWrapper
			};
		}
		else {
			pManifest = <ITestManifest>arguments[0];
			pManifest.entry = fnWrapper;
		}

		pManifest.async = isAsync;

		pTestList.unshift(pManifest);
	}

	function printInfo (): void {
		output("<h4 style=\"font-family: monospace;\">" + pTest.name || "" + "</h4>");
	}

	function printResults(): void {
		output(
			"<pre style=\"margin-left: 20px;\">" +
			"<hr align=\"left\" style=\"border: 0; background-color: gray; height: 1px; width: 500px;\"/><span style=\"color: gray;\">total time: " + (now() - iBegin) + " msec" + "</span>" +
			"<br /><b>" + (isPassed? "<span style=\"color: green\">TEST PASSED</span>": "<span style=\"color: red\">TEST FAILED</span>") + "</b>" +
			"</pre>");
	}

	function printError(message: string, stack?: string): void {
		message = "<b>" + message + "</b>";

		if (isDef(stack)) {
			 message += "\n" + stack;
		}

		output(
			"<pre style=\"margin-left: 20px;\">" +
			"<span style=\"color: red; background-color: rgba(255, 0, 0, .1);\">" + message + "</span>" +
			"</pre>");
	}

	export function asyncTest (manifest: any, fnWrapper: () => void) {
		test(manifest, fnWrapper, true);
	}

	export function run(): void {
//если вдруг остались тесты.
		if (pTestCondList.length) {
			failed();
		}

//если предыдущий тест был асинхронным, значит он кончился и надо распечатать результаты
		if (!isNull(pTest) && pTest.async == true) {
			printResults();
		}

		while (pTestList.length) {
//начинаем новый тест
			pTest = pTestList.pop();
			iBegin = now();
			isPassed = true;


			printInfo();
//start test

			try {
				pTest.entry();
			} catch (e) {
				failed(e);
				return;
			}

			if (!pTest.async) {
				printResults();
				pTest = null;
			}
			else {
				return;
			}
		};
	}

	window.onload = function () {
		run();
	}
}

var test 			= akra.util.test;
var asyncTest 		= akra.util.asyncTest;
var failed 			= akra.util.failed;
var run 			= akra.util.run;
var shouldBe 		= akra.util.shouldBe;
var shouldBeArray 	= akra.util.shouldBeArray;
var shouldBeTrue 	= akra.util.shouldBeTrue;
var shouldBeFalse 	= akra.util.shouldBeFalse;
var shouldBeNotNull	= akra.util.shouldBeNotNull;
var check 			= akra.util.check;
var ok = check;












module akra {

	export interface IBinReader {

		string(sDefault?: string): string;

		uint32():  number ;
		uint16():  number ;
		uint8():  number ;

		bool(): bool;

		int32():  number ;
		int16():  number ;
		int8():  number ;

		float64():  number ;
		float32():  number ;

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





module akra.io {

	export class BinReader implements IBinReader {
		/**@protected*/  _pDataView: DataView;
		/**@protected*/  _iPosition:  number ;

		constructor (pBuffer: ArrayBuffer, iByteOffset?:  number , iByteLength?:  number );
		constructor (pBuffer: IBinWriter, iByteOffset?:  number , iByteLength?:  number );
		constructor (pBuffer: any, iByteOffset?:  number , iByteLength?:  number ) {
			if (!isDef(iByteOffset)) { iByteOffset = 0; }
			if (!isDef(iByteLength)) { iByteLength = pBuffer.byteLength; }

			this._pDataView = new DataView(isArrayBuffer(pBuffer)? (<ArrayBuffer>pBuffer): (<IBinWriter>pBuffer).data(),
									iByteOffset, iByteLength);
			this._iPosition = 0;
		}

		string(sDefault: string = null): string {
			var iStringLength:  number  = this.uint32();
			var iBitesToAdd:  number ;

		    if (iStringLength == MAX_INT32) {
		        return sDefault;
		    }

		    iBitesToAdd = (( 4 - (iStringLength % 4) == 4)) ? 0 : ( 4 - (iStringLength % 4));
		    iStringLength += iBitesToAdd;

//Проверка на возможный выход за пределы массива.
		    logger.setSourceLocation( "io/BinReader.ts" , 66 ); logger.assert(this._iPosition + iStringLength - 1 < this._pDataView.byteLength, "Выход за пределы массива"); ;

		    var pBuffer: Uint8Array = new Uint8Array(iStringLength);

		    for (var i:  number  = 0; i < iStringLength; i++) {
		        pBuffer[i] = this._pDataView.getUint8(this._iPosition + i);
		    }

		    this._iPosition += iStringLength;
		    var sString: string = "",
			    charCode: string,
			    code:  number ;

		    for (var n = 0; n < pBuffer.length; ++n) {
		        code = pBuffer[n];

		        if (code == 0) {
		            break;
		        }

		        charCode = String.fromCharCode(code);
		        sString = sString + charCode;
		    }

		    sString = sString.fromUTF8();
// LOG("string:", sString);
/*sString.substr(0, iStringLength);//sString;//*/
		    return sString;
		}

		uint32():  number  {
			var i:  number  = this._pDataView.getUint32(this._iPosition, true);
		    this._iPosition += 4;
// LOG("uint32:", i);
		    return i;
		}

		uint16():  number  {
			var i:  number  = this._pDataView.getUint16(this._iPosition, true);
		    this._iPosition += 4;
		    return i;
		}

		uint8():  number  {
			var i:  number  = this._pDataView.getUint8(this._iPosition);
		    this._iPosition += 4;
		    return i;
		}

		/**@inline*/  bool(): bool {
			return this.uint8() > 0;
		}

		int32():  number  {
			var i:  number  = this._pDataView.getInt32(this._iPosition, true);
		    this._iPosition += 4;
		    return i;
		}

		int16():  number  {
			var i:  number  = this._pDataView.getInt16(this._iPosition, true);
		    this._iPosition += 4;
		    return i;
		}

		int8():  number  {
			var i:  number  = this._pDataView.getInt8(this._iPosition);
		    this._iPosition += 4;
		    return i;
		}

		float64():  number  {
			var f:  number  = this._pDataView.getFloat64(this._iPosition, true);
		    this._iPosition += 8;
		    return f;
		}

		float32():  number  {
			var f:  number  = this._pDataView.getFloat32(this._iPosition, true);
		    this._iPosition += 4;
// LOG("float32:", f);
		    return f;
		}

		stringArray(): string[] {
			var iLength:  number  = this.uint32();

		    if (iLength == MAX_INT32) {
		        return null;
		    }

		    var pArray: string[] = new Array(iLength);

		    for (var i:  number  = 0; i < iLength; i++) {
		        pArray[i] = this.string();
		    }

		    return pArray;
		}

		/**@inline*/  uint32Array(): Uint32Array {
			return <Uint32Array>this.uintXArray(32);
		}

		/**@inline*/  uint16Array(): Uint16Array {
			return <Uint16Array>this.uintXArray(16);
		}

		/**@inline*/  uint8Array(): Uint8Array {
			return <Uint8Array>this.uintXArray(8);
		}

		/**@inline*/  int32Array(): Int32Array {
			return <Int32Array>this.intXArray(32);
		}

		/**@inline*/  int16Array(): Int16Array {
			return <Int16Array>this.intXArray(16);
		}

		/**@inline*/  int8Array(): Int8Array {
			return <Int8Array>this.intXArray(8);
		}

		/**@inline*/  float64Array(): Float64Array {
			return <Float64Array>this.floatXArray(64);
		}

		/**@inline*/  float32Array(): Float32Array {
			return <Float32Array>this.floatXArray(32);
		}

		private uintXArray(iX:  number ): ArrayBufferView {
		    var iLength:  number  = this.uint32();

		    if (iLength == MAX_INT32) {
		        return null;
		    }

		    var iBytes:  number  = iX / 8;
		    var pArray: ArrayBufferView;

		    switch (iBytes) {
		        case 1:
		            pArray = new Uint8Array(iLength);

		            for (var i = 0; i < iLength; i++) {
		                pArray[i] = this._pDataView.getUint8(this._iPosition + i * iBytes);
		            }

		            break;
		        case 2:
		            pArray = new Uint16Array(iLength);

		            for (var i = 0; i < iLength; i++) {
		                pArray[i] = this._pDataView.getUint16(this._iPosition + i * iBytes, true);
		            }

		            break;
		        case 4:
		            pArray = new Uint32Array(iLength);

		            for (var i = 0; i < iLength; i++) {
		                pArray[i] = this._pDataView.getUint32(this._iPosition + i * iBytes, true);
		            }

		            break;
		        default:
		            logger.setSourceLocation( "io/BinReader.ts" , 233 ); logger.error("unsupported array length detected: " + iBytes); ;
		    }

		    var iByteLength:  number  = iBytes * iLength;
		    iByteLength += -iByteLength & 3;

		    this._iPosition += iByteLength;

		    return pArray;
		}

		private intXArray(iX:  number ): ArrayBufferView {
		    var iLength:  number  = this.uint32();

		    if (iLength == MAX_INT32) {
		        return null;
		    }

		    var iBytes:  number  = iX / 8;
		    var pArray: ArrayBufferView;

		    switch (iBytes) {
		        case 1:
		            pArray = new Int8Array(iLength);

		            for (var i = 0; i < iLength; i++) {
		                pArray[i] = this._pDataView.getInt8(this._iPosition + i * iBytes);
		            }

		            break;
		        case 2:
		            pArray = new Int16Array(iLength);

		            for (var i = 0; i < iLength; i++) {
		                pArray[i] = this._pDataView.getInt16(this._iPosition + i * iBytes, true);
		            }

		            break;
		        case 4:
		            pArray = new Int32Array(iLength);

		            for (var i = 0; i < iLength; i++) {
		                pArray[i] = this._pDataView.getInt32(this._iPosition + i * iBytes, true);
		            }

		            break;
		        default:
		            logger.setSourceLocation( "io/BinReader.ts" , 280 ); logger.error("unsupported array length detected: " + iBytes); ;
		    }

		    var iByteLength:  number  = iBytes * iLength;
		    iByteLength += -iByteLength & 3;

		    this._iPosition += iByteLength;

		    return pArray;
		}

		private floatXArray(iX:  number ): ArrayBufferView {
		    var iLength:  number  = this.uint32();

		    if (iLength == MAX_INT32) {
		        return null;
		    }

		    var iBytes:  number  = iX / 8;
		    var pArray: ArrayBufferView;

		    switch (iBytes) {
		        case 4:
		            pArray = new Float32Array(iLength);

		            for (var i = 0; i < iLength; i++) {
		                pArray[i] = this._pDataView.getFloat32(this._iPosition + i * iBytes, true);
		            }

		            break;
		        case 8:
		            pArray = new Float64Array(iLength);

		            for (var i = 0; i < iLength; i++) {
		                pArray[i] = this._pDataView.getFloat64(this._iPosition + i * iBytes, true);
		            }

		            break;
		        default:
		            logger.setSourceLocation( "io/BinReader.ts" , 319 ); logger.error("unsupported array length detected: " + iBytes); ;
		    }

		    var iByteLength = iBytes * iLength;
		    iByteLength += -iByteLength & 3;

		    this._iPosition += iByteLength;

		    return pArray;
		}
	}
}












module akra {
	export interface IBinWriter {
		byteLength:  number ;

		string(sData: string): void;

		uint32(iValue:  number ): void;
		uint16(iValue:  number ): void;
		uint8(iValue:  number ): void;

		bool(bValue: bool): void;

		int32(iValue:  number ): void;
		int16(iValue:  number ): void;
		int8(iValue:  number ): void;

		float64(fValue:  number ): void;
		float32(fValue:  number ): void;

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



/**
 * Как исполльзовать:
 * var bw = new BinWriter();      //создаем экземпляр класса
 *                        STRING
 * bw.string("abc");              //запигшет строку
 * bw.stringArray(["abc", "abc"]) //запишет массив строк
 *                        UINT
 * bw.uint8(1)             //варовняет до 4 байт uint и запишет
 * bw.uint16(1)            //варовняет до 4 байт uint и запишет
 * bw.uint32(1)            //запишет uint32
 * bw.uint8Array([1, 2])   //запишет массив uint8 где каждое число будет занимать
 *                         //1 байт и выровняет общую длинну массива до 4
 * bw.uint16Array([1, 2])  //запишет массив uint16 где каждое число будет занимать
 *                         //2 байта и выровняет общую длинну массива до 4
 * bw.uint32Array([1, 2])  //запишет массив uint32 где каждое число будет занимать
 *                         //4 байта
 *                        INT
 * bw.int8(1)              //варовняет до 4 байт int и запишет
 * bw.int16(1)             //варовняет до 4 байт int и запишет
 * bw.int32(1)             //запишет int32
 * bw.int8Array([1, 2])    //запишет массив int8 где каждое число будет занимать
 *                         //1 байт и выровняет общую длинну массива до 4
 * bw.int16Array([1, 2])   //запишет массив int16 где каждое число будет занимать
 *                         //2 байта и выровняет общую длинну массива до 4
 * bw.int32Array([1, 2])   //запишет массив int32 где каждое число будет занимать
 *                         //4 байта
 *                         FLOAT
 * bw.float64(1.1)             //запишет float64
 * bw.float32(1.1)             //запишет float32
 * bw.float32Array([1.2, 2.3]) //запишет массив float32
 * bw.float64Array([1.2, 2.3]) //запишет массив float64
 *
 * bw.data()             //возвратит массив типа ArrayBuffer где бедет лежать все записанные данные
 * bw.dataAsString()     //соберет все данные в строку и вернет
 * bw.dataAsUint8Array() //соберет все данные в массив Uint8 и вернет
 */




module akra.io {
	export class BinWriter implements IBinWriter {
/**
	     * Двумерный массив куда заносятся данные.
	     * @private
	     * @type Uint8Array[]
	     */

	    /**@protected*/  _pArrData: Uint8Array[] = [];
/**
	     * Счетчик общего количества байт.
	     * @private
	     * @type int
	     */

	    /**@protected*/  _iCountData:  number  = 0;

		/**@inline*/  get byteLength():  number  {
			return this._iCountData;
		}

/******************************************************************************/

/*                                 string                                     */

/******************************************************************************/


/**
		 * @property string(str)
		 * Запись строки. Перед строкой записывается длинна строки в тип uint32. Если
		 * передано null или undefined то длинна строки записывается к��к 0xffffffff.
		 * Это сделано для того что при дальнейшем считывании такая строка будет
		 * возвращена как null.
		 * @memberof BinWriter
		 * @tparam String str строка. Все не строковые типы преобразуются к строке.
		 */

		string(str: string): void {
		    if (!isDefAndNotNull(str)) {
		        this.uint32(MAX_UINT32);
		        return;
		    }

		    str = String(str);

// LOG("string: ", str);

		    var sUTF8String: string = str.toUTF8();
		    var iStrLen:  number  = sUTF8String.length;
		    var arrUTF8string: Uint8Array = BinWriter.rawStringToBuffer(sUTF8String);

		    logger.setSourceLocation( "io/BinWriter.ts" , 92 ); logger.assert(iStrLen <= Math.pow(2, 32) - 1, "Это значение не влезет в тип string"); ;

		    this.uint32(iStrLen);

		    var iBitesToAdd:  number  = (( 4 - (iStrLen % 4) == 4)) ? 0 : ( 4 - (iStrLen % 4));

		    this._pArrData[this._pArrData.length] = arrUTF8string;
		    this._iCountData += (iStrLen + iBitesToAdd);
//trace('string', str);
		}

/******************************************************************************/

/*                                   uintX                                    */

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

		private uintX(iValue:  number , iX:  number ): void {

		    if (isNull(iValue)) {
		        iValue = 0;
		    }

// LOG("uint" + iX + ": ", iValue);

		    logger.setSourceLocation( "io/BinWriter.ts" , 124 ); logger.assert(isNumber(iValue), "Не является числом: " + iValue); ; ;

		    logger.setSourceLocation( "io/BinWriter.ts" , 126 ); logger.assert(0 <= iValue && iValue <= Math.pow(2, iX), "Это значение не влезет в тип uint" + iX); ;
		    var arrTmpBuf: ArrayBufferView;

		    switch (iX) {
		        case 8:
		            arrTmpBuf = new Uint8Array(4);
		            arrTmpBuf[0] = iValue;
		            break;
		        case 16:
		            arrTmpBuf = new Uint16Array(2);
		            arrTmpBuf[0] = iValue;
		            break;
		        case 32:
		            arrTmpBuf = new Uint32Array(1);
		            arrTmpBuf[0] = iValue;
		            break;
		        default:
		            logger.setSourceLocation( "io/BinWriter.ts" , 143 ); logger.error("Передано недопустимое значение длинны. Допустимые значения 8, 16, 32."); ;
		            break;
		    }
//trace('uint' + iX, iValue);
//if(iX == 8)
//  this._pArrData[this._pArrData.length] = arrTmpBuf;
//else
		    this._pArrData[this._pArrData.length] = new Uint8Array(arrTmpBuf.buffer);
		    this._iCountData += 4;
		}

/**
		 * @property uint8(iValue)
		 * Запись числа типа uint8. Оно выравнивается до 4 байт. Если передан null то
		 * число принимается равным 0. Если передано любое другое не числовое значение
		 * то выводится ошибка.
		 * Сокращенная запись функции uintX(iValue, 8).
		 * @memberof BinWriter
		 * @tparam uint iValue число.
		 */

		/**@inline*/  uint8(iValue:  number ): void {
		    this.uintX(iValue, 8);
		}

/**
		 * @property uint16(iValue)
		 * Запись числа типа uint16. Оно выравнивается до 4 байт. Если передан null то
		 * число принимает��я равным 0. Если передано любое другое не числовое значение
		 * то выводится ошибка.
		 * Сокращенная запись функции uintX(iValue, 16).
		 * @memberof BinWriter
		 * @tparam uint iValue число.
		 */

		/**@inline*/  uint16(iValue:  number ): void {
		    this.uintX(iValue, 16);
		}

/**
		 * @property uint32(iValue)
		 * Запись числа типа uint8. Если передан null то число принимается равным 0.
		 * Если передано любое другое не числовое значение то выводится ошибка.
		 * Сокращенная запись функции uintX(iValue, 32).
		 * @memberof BinWriter
		 * @tparam uint iValue число.
		 */

		/**@inline*/  uint32(iValue:  number ): void {
		    this.uintX(iValue, 32);
		}

/**
		 * @property bool(bValue)
		 * Запись числа типа bool. В зависимости от bValue записывается либо 1 либо ноль.
		 * Если передано любое другое не числовое значение то выводится ошибка.
		 * Сокращенная запись функции uintX(bValue? 1: 0, 8).
		 * @memberof BinWriter
		 * @tparam bool bValue число.
		 */

		/**@inline*/  bool(bValue: bool): void {
// LOG(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>> BOOL >>> ");
		    this.uintX(bValue ? 1 : 0, 8);
		}


/******************************************************************************/

/*                       writeArrayElementUintX                               */

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

		private writeArrayElementUintX(iValue:  number , iX:  number ): void {
		    if (isNull(iValue)) {
		        iValue = 0;
		    }

// LOG("array uint", iX, ": ", iValue);

		    logger.setSourceLocation( "io/BinWriter.ts" , 229 ); logger.assert(isNumber(iValue), "Не является числом: " + iValue); ;
		    logger.setSourceLocation( "io/BinWriter.ts" , 230 ); logger.assert(0 <= iValue && iValue <= Math.pow(2, iX), "Это значение не влезет в тип uint" + iX); ;

		    var arrTmpBuf: ArrayBufferView;
		    switch (iX) {
/* WARNING Только private и записи масивов. Нет выравнивания на 4, оно ложится на функцию записи массива.*/
		        case 8:
		            arrTmpBuf = new Uint8Array(1);
		            arrTmpBuf[0] = iValue;
		            break;
/* WARNING Только private и записи масивов. Нет выравнивания на 4, оно ложится на функцию записи массива.*/
		        case 16:
		            arrTmpBuf = new Uint16Array(1);
		            arrTmpBuf[0] = iValue;
		            break;
		        case 32:
		            arrTmpBuf = new Uint32Array(1);
		            arrTmpBuf[0] = iValue;
		            break;
		        default:
		            logger.setSourceLocation( "io/BinWriter.ts" , 247 ); logger.error("Передано недопустимое значение длинны. Допустимые значения 8, 16, 32."); ;
		            break;
		    }

		    if (iX == 8) {
		        this._pArrData[this._pArrData.length] = <Uint8Array>arrTmpBuf;
		    }
		    else {
		        this._pArrData[this._pArrData.length] = new Uint8Array(arrTmpBuf.buffer);
		    }

		    this._iCountData += (iX / 8);
		}

/******************************************************************************/

/*                                    intX                                    */

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

		private intX(iValue:  number , iX:  number ): void {
		    if (isNull(iValue)) {
		        iValue = 0;
		    }

// LOG("int", iX, ": ", iValue);

		    logger.setSourceLocation( "io/BinWriter.ts" , 281 ); logger.assert(isNumber(iValue), "Не является числом: " + iValue); ;
		    logger.setSourceLocation( "io/BinWriter.ts" , 283 ); logger.assert(-Math.pow(2, iX - 1) <= iValue && iValue <= Math.pow(2, iX - 1) - 1, "Это значение не влезет в тип int" + iX);
                                                                                  ;

		    var arrTmpBuf: ArrayBufferView;
		    switch (iX) {
		        case 8:
		            arrTmpBuf = new Int8Array(4);
		            arrTmpBuf[0] = iValue;
		            break;
		        case 16:
		            arrTmpBuf = new Int16Array(2);
		            arrTmpBuf[0] = iValue;
		            break;
		        case 32:
		            arrTmpBuf = new Int32Array(1);
		            arrTmpBuf[0] = iValue;
		            break;
		        default:
		            logger.setSourceLocation( "io/BinWriter.ts" , 300 ); logger.error("Передано недопустимое значение длинны. Допустимые значения 8, 16, 32."); ;
		            break;
		    }
//trace('int' + iX, iValue);
		    this._pArrData[this._pArrData.length] = new Uint8Array(arrTmpBuf.buffer);
		    this._iCountData += 4;
		}

/**
		 * @property int8(iValue)
		 * Запись числа типа int8. Оно выравнивается до 4 байт. Если передан null то
		 * число принимается равным 0. Если передано любое другое не числовое значение
		 * то выводится ошибка.
		 * Сокращенная запись функции intX(iValue, 8).
		 * @memberof BinWriter
		 * @tparam uint iValue число.
		 */

		/**@inline*/  int8(iValue:  number ): void {
		    this.intX(iValue, 8);
		}

/**
		 * @property int16(iValue)
		 * Запись числа типа uint16. Оно выравнивается до 4 байт. Если передан null то
		 * число принимается равным 0. Если передано любое другое не числовое значение
		 * то выводится ошибка.
		 * Сокращенная запись функции intX(iValue, 16).
		 * @memberof BinWriter
		 * @tparam int iValue число.
		 */

		/**@inline*/  int16(iValue:  number ): void {
		    this.intX(iValue, 16);
		}

/**
		 * @property uint32(iValue)
		 * Запись числа типа uint8. Если передан null то число принимается равным 0.
		 * Если передано любое другое не числовое значение то выводится ошибка.
		 * Сокращенная запись функции intX(iValue, 32).
		 * @memberof BinWriter
		 * @tparam int iValue число.
		 */

		/**@inline*/  int32(iValue:  number ): void {
		    this.intX(iValue, 32);
		}

/******************************************************************************/

/*                          writeArrayElementIntX                            */

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

		private writeArrayElementIntX(iValue:  number , iX:  number ) {
		    if (isNull(iValue)) {
		        iValue = 0;
		    }

// LOG("array int", iX, ": ", iValue);

		    logger.setSourceLocation( "io/BinWriter.ts" , 369 ); logger.assert(isNumber(iValue), "Не является числом: " + iValue); ;
		    logger.setSourceLocation( "io/BinWriter.ts" , 371 ); logger.assert(-Math.pow(2, iX - 1) <= iValue && iValue <= Math.pow(2, iX - 1) - 1, "Это значение не влезет в тип int" + iX);
                                                                                  ;

		    var arrTmpBuf: ArrayBufferView;

		    switch (iX) {
/* WARNING Только private и записи масивов. Нет выравнивания на 4, оно ложится на функцию записи массива.*/
		        case 8:
		            arrTmpBuf = new Int8Array(1);
		            arrTmpBuf[0] = iValue;
		            break;
/* WARNING Только private и записи масивов. Нет выравнивания на 4, оно ложится на функцию записи массива.*/
		        case 16:
		            arrTmpBuf = new Int16Array(1);
		            arrTmpBuf[0] = iValue;
		            break;
		        case 32:
		            arrTmpBuf = new Int32Array(1);
		            arrTmpBuf[0] = iValue;
		            break;
		        default:
		            logger.setSourceLocation( "io/BinWriter.ts" , 389 ); logger.error("Передано недопустимое значение длинны. Допустимые значения 8, 16, 32."); ;
		            break;
		    }
		    this._pArrData[this._pArrData.length] = new Uint8Array(arrTmpBuf.buffer);
		    this._iCountData += (iX / 8);
		}

/******************************************************************************/

/*                                  floatX                                    */

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

		private floatX(fValue:  number , iX:  number ): void {
		    if (isNull(fValue)) {
		        fValue = 0;
		    }

		    logger.setSourceLocation( "io/BinWriter.ts" , 414 ); logger.assert(isNumber(fValue), "Не является числом: " + fValue); ;
//debug_assert(typeof(fValue) == 'number', "Не явл��ется числом");

// LOG("float", iX, ": ", fValue);

		    var arrTmpBuf: ArrayBufferView;

		    switch (iX) {
		        case 32:
		            arrTmpBuf = new Float32Array(1);
		            arrTmpBuf[0] = fValue;
		            break;
		        case 64:
		            arrTmpBuf = new Float64Array(1);
		            arrTmpBuf[0] = fValue;
		            break;
		        default:
		            logger.setSourceLocation( "io/BinWriter.ts" , 431 ); logger.error("Передано недопустимое значение длинны. Допустимые значения 32, 64."); ;
		            break;
		    }
//trace('float' + iX, fValue);
		    this._pArrData[this._pArrData.length] = new Uint8Array(arrTmpBuf.buffer);
		    this._iCountData += (iX / 8);
		}

/**
		 * @property float32(fValue)
		 * Запись числа типа float32. Если передан null то число принимается равным 0.
		 * Если передано любое другое не числовое значение то выводится ошибка.
		 * Сокращенная запись функции floatX(fValue, 32).
		 * @memberof BinWriter
		 * @tparam float fValue число.
		 */

		/**@inline*/  float32(fValue) {
		    this.floatX(fValue, 32);
		}

/**
		 * @property float64(fValue)
		 * Запись числа типа float64. Если передан null то число принимается равным 0.
		 * Если передано любое другое не числовое значение то выводится ошибка.
		 * Сокращенная запись функции floatX(fValue, 64).
		 * @memberof BinWriter
		 * @tparam float fValue число.
		 */

		/**@inline*/  float64(fValue) {
		    this.floatX(fValue, 64);
		}


/******************************************************************************/

/*                             stringArray                                    */

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

		stringArray(arrString: string[]): void {
		    if (!isDefAndNotNull(arrString)) {
		        this.uint32(0xffffffff);
		        return;
		    }

		    this.uint32(arrString.length);
		    for (var i = 0; i < arrString.length; i++) {
		        this.string(arrString[i]);
		    }
		}

/******************************************************************************/

/*                             uintXArray                                     */

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

		uintXArray(arrUint: ArrayBufferView, iX:  number ): void {
		    if (!isDefAndNotNull(arrUint)) {
		        this.uint32(0xffffffff);
		        return;
		    }

		    var iUintArrLength:  number  = arrUint.byteLength;
		    var iBitesToAdd:  number ;
		    var arrTmpUint: ArrayBufferView;

		    switch (iX) {
		        case 8:
		            iBitesToAdd = (( 4 - (iUintArrLength % 4) == 4)) ? 0 : ( 4 - (iUintArrLength % 4));
		            if (iBitesToAdd > 0 || !(arrUint instanceof Uint8Array)) {
		                arrTmpUint = new Uint8Array(iUintArrLength + iBitesToAdd);
		                (<Uint8Array>arrTmpUint).set(<Uint8Array>arrUint);
		            }
		            else {
		                arrTmpUint = arrUint;
		            }
		            break;
		        case 16:
		        	iUintArrLength /= 2;
		            iBitesToAdd = (( 2 - (iUintArrLength % 2) == 2)) ? 0 : ( 2 - (iUintArrLength % 2));
		            if (iBitesToAdd > 0 || !(arrUint instanceof Uint16Array)) {
		                arrTmpUint = new Uint16Array(iUintArrLength + iBitesToAdd);
		                (<Uint16Array>arrTmpUint).set(<Uint16Array>arrUint);
		            }
		            else {
		                arrTmpUint = arrUint;
		            }
		            break;
		        case 32:
		        	iUintArrLength /= 4;
		            if (!(arrUint instanceof Uint32Array)) {
		                arrTmpUint = new Uint32Array(arrUint);
		            }
		            else {
		                arrTmpUint = arrUint;
		            }
		            break;
		    }

		    this.uint32(iUintArrLength);

		    for (var i:  number  = 0, n:  number  = arrTmpUint.byteLength / (iX / 8); i < n; i++) {
		        this.writeArrayElementUintX(arrTmpUint[i], iX);
		    }
		}

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

		/**@inline*/  uint8Array(arrUint: Uint8Array): void {
		    this.uintXArray(arrUint, 8);
		}

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

		/**@inline*/  uint16Array(arrUint: Uint16Array): void {
		    this.uintXArray(arrUint, 16);
		}

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

		/**@inline*/  uint32Array(arrUint: Uint32Array): void {
		    this.uintXArray(arrUint, 32);
		}


/******************************************************************************/

/*                               intXArray                                    */

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

		intXArray(arrInt: ArrayBufferView, iX:  number ): void {
		    if (!isDefAndNotNull(arrInt)) {
		        this.uint32(0xffffffff);
		        return;
		    }

		    var iIntArrLength:  number ;
		    var iBitesToAdd:  number ;
		    var arrTmpInt: ArrayBufferView;

		    switch (iX) {
		        case 8:
		        	iIntArrLength = (<Int8Array>arrInt).length;
		            iBitesToAdd = (( 4 - (iIntArrLength % 4) == 4)) ? 0 : ( 4 - (iIntArrLength % 4));
		            if (iBitesToAdd > 0 || !(arrInt instanceof Int8Array)) {
		                arrTmpInt = new Int8Array(iIntArrLength + iBitesToAdd);
		                (<Int8Array>arrTmpInt).set(<Int8Array>arrInt);
		            }
		            else {
		                arrTmpInt = arrInt;
		            }
		            break;
		        case 16:
		        	iIntArrLength = (<Int16Array>arrInt).length;
		            iBitesToAdd = (( 2 - (iIntArrLength % 2) == 2)) ? 0 : ( 2 - (iIntArrLength % 2));
		            if (iBitesToAdd > 0 || !(arrInt instanceof Int16Array)) {
		                arrTmpInt = new Int16Array(iIntArrLength + iBitesToAdd);
		                (<Int16Array>arrTmpInt).set(<Int16Array>arrInt);
		            }
		            else {
		                arrTmpInt = arrInt;
		            }
		            break;
		        case 32:
		        	iIntArrLength = (<Int32Array>arrInt).length;
		            if (!(arrInt instanceof Int32Array)) {
		                arrTmpInt = new Int32Array(arrInt);
		            }
		            else {
		                arrTmpInt = arrInt;
		            }
		            break;
		    }

		    this.uint32(iIntArrLength);

		    for (var i:  number  = 0, n:  number  = arrTmpInt.byteLength / (iX / 8); i < n; i++) {
		        this.writeArrayElementIntX(arrTmpInt[i], iX);
		    }
		}

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

		/**@inline*/  int8Array(arrInt: Int8Array): void {
		    this.intXArray(arrInt, 8);
		}

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

		/**@inline*/  int16Array(arrInt: Int16Array): void {
		    this.intXArray(arrInt, 16);
		}

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

		/**@inline*/  int32Array(arrInt: Int32Array): void {
		    this.intXArray(arrInt, 32);
		}


/******************************************************************************/

/*                              floatXArray                                   */

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

		floatXArray(arrFloat: ArrayBufferView, iX:  number ) {
		    if (!isDefAndNotNull(arrFloat)) {
		        this.uint32(0xffffffff);
		        return;
		    }

		    switch (iX) {
		        case 32:
		            if (!(arrFloat instanceof Float32Array)) {
		                arrFloat = new Float32Array(arrFloat);
		            }
		            break;
		        case 64:
		            if (!(arrFloat instanceof Float64Array)) {
		                arrFloat = new Float64Array(arrFloat);
		            }
		            break;
		    }
		    var iFloatArrLength:  number  = arrFloat.byteLength / (iX / 8);
		    this.uint32(iFloatArrLength);
//Поэлементно записываем массив
		    for (var i:  number  = 0, n:  number  = iFloatArrLength; i < n; i++) {
		        this.floatX(arrFloat[i], iX);
		    }
		}

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

		/**@inline*/  float32Array(arrFloat: Float32Array): void {
		    this.floatXArray(arrFloat, 32);
		}

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

		/**@inline*/  float64Array(arrFloat: Float64Array): void {
		    this.floatXArray(arrFloat, 64);
		}

/**
		 * @property data()
		 * Берет все данные из массива _pArrData и записывает их в массив
		 * типа ArrayBuffer.
		 * @memberof BinWriter
		 * @treturn ArrayBuffer.
		 */

		/**@inline*/  data(): ArrayBuffer {
		    return this.dataAsUint8Array().buffer;
		}

/**
		 * @property data()
		 * Берет все данные из массива _pArrData и записывает их в строку.
		 * @memberof BinWriter
		 * @treturn String.
		 */

		dataAsString(): string {
		    var tmpArrBuffer: Uint8Array = this.dataAsUint8Array();
		    var sString: string = "";

		    for (var n:  number  = 0; n < tmpArrBuffer.length; ++n) {
		        var charCode = String.fromCharCode(tmpArrBuffer[n]);
		        sString = sString + charCode;
		    }

		    return sString;
		}

/**
		 * @property toUint8Array()
		 * Берет все данные из массива _pArrData и вернет Uint8Array.
		 * @memberof BinWriter
		 * @treturn Uint8Array.
		 */

		dataAsUint8Array(): Uint8Array {
		    var arrUint8: Uint8Array = new Uint8Array(this._iCountData);

		    for (var i:  number  = 0, k:  number  = 0; i < this._pArrData.length; i++) {
		        for (var n:  number  = 0; n < this._pArrData[i].length; n++) {
		            arrUint8[k++] = this._pArrData[i][n];
		        }
		    }

		    return arrUint8;
		}


/**
		 * @property rawStringToBuffer()
		 * Берет строку и преобразует ее в массив Uint8Array.
		 * @memberof BinWriter
		 * @treturn Uint8Array.
		 */

		static rawStringToBuffer(str): Uint8Array {

		    var idx:  number ;
		    var len:  number  = str.length;
		    var iBitesToAdd:  number  = (( 4 - (len % 4) == 4)) ? 0 : ( 4 - (len % 4));
		    var arr:  number [] = new Array(len + iBitesToAdd);

		    for (idx = 0; idx < len; ++idx) {
/* & 0xFF;*/
		        arr[ idx ] = str.charCodeAt(idx);
		    }
		    return new Uint8Array(arr);
		};
	}
}













module akra {
	export interface IPackerTemplate {} ;

	export interface IPackerOptions {
		header?: bool;
	}

	export interface IPacker extends IBinWriter {
		template: IPackerTemplate;

		write(pData: any, sType?: string, bHeader?: bool): bool;
	}
}











module akra {
	export interface IPackerBlacklist {
		[type: string]: Function;
	};

	export interface IPackerCodec {
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

	export interface IPackerFormat {
		[type: string]: string;
		[type: string]: IPackerCodec;
	}

//вспомогательный класс, для разрешения форматов, при упаковке данных
	export interface IPackerTemplate {
		getType(iType:  number ): any;
		getTypeId(sType: string):  number ;

		set(pFormat: IPackerFormat): void;

		detectType(pObject: any): string;
		resolveType(sType: string): string;
		properties(sType): IPackerCodec;
		data(): IPackerFormat;
	}
}



module akra.io {
	var pCommonTemplate: IPackerTemplate = null;

	export function getPackerTemplate(): IPackerTemplate {
		return pCommonTemplate;
	}

	export class PackerTemplate {
		/**@protected*/  _pData: IPackerFormat = <IPackerFormat>{};
		/**@protected*/  _nTypes:  number  = 0;
		/**@protected*/  _pNum2Tpl: StringMap = <StringMap>{};
		/**@protected*/  _pTpl2Num: IntMap = <IntMap>{};

		constructor (pData?: IPackerFormat) {
			if (isDef(pData)) {
				this.set(pData);
			}
		}

		getType(iType:  number ): string {
			logger.setSourceLocation( "PackerFormat.ts" , 26 ); logger.assert(isDef(this._pNum2Tpl[iType]), "unknown type detected: " + iType); ;
			return this._pNum2Tpl[iType];
		}

		getTypeId(sType: string):  number  {
			logger.setSourceLocation( "PackerFormat.ts" , 31 ); logger.assert(isDef(this._pTpl2Num[sType]), "unknown type detected: " + sType); ;
			return this._pTpl2Num[sType];
		}

		set(pFormat: IPackerFormat): void {
			var iType:  number ;

		    for (var i in pFormat) {
		        this._pData[i] = pFormat[i];

		        iType = this._nTypes ++;

		        this._pNum2Tpl[iType] = i;
		        this._pTpl2Num[i] = iType;
		    }
		}

		detectType(pObject: any): string {
			return PackerTemplate.getClass(pObject);
		}

		resolveType(sType: string): string {
			var pTemplates: IPackerFormat = this._pData;
			var pProperties: IPackerCodec;
			var sProperties: string;


			while (isString(sProperties = pTemplates[sType])) {
		        sType = sProperties;
		    }

			logger.setSourceLocation( "PackerFormat.ts" , 62 ); logger.assert(!isString(sProperties), "cannot resolve type: " + sType); ;

		    return sType;
		}

		properties(sType): IPackerCodec {
			var pProperties: any = this._pData[sType];

			if (isString(pProperties)) {
				return this.properties(this.resolveType(sType));
			}

		    return <IPackerCodec>pProperties;
		}

		data(): IPackerFormat {
			return this._pData;
		}

		static getClass(pObj: any): string {
			 if (pObj &&
			 	isObject(pObj) &&
		        Object.prototype.toString.call(pObj) !== "[object Array]" &&
		        isDefAndNotNull(pObj.constructor) && pObj != this.window) {

		        var arr: string[] = pObj.constructor.toString().match(/function\s*(\w+)/);

		        if (!isNull(arr) && arr.length == 2) {
		            return arr[1];
		        }
		    }

		    var sType: string = typeof pObj;

		    return sType[0].toUpperCase() + sType.substr(1);
		}
	}

	pCommonTemplate = new PackerTemplate;

	pCommonTemplate.set({
		"Float32Array": {
			write	: function (pData) { this.float32Array(pData); },
			read	: function () { return this.float32Array(); }
		},
		"Float64Array": {
			write	: function (pData) { this.float64Array(pData); },
			read	: function () { return this.float64Array(); }
		},

		"Int32Array":  {
			write	: function (pData) { this.int32Array(pData); },
			read	: function () { return this.int32Array(); }
		},
		"Int16Array": {
			write	: function (pData) { this.int16Array(pData); },
			read	: function () { return this.int16Array(); }
		},
		"Int8Array"	: {
			write	: function (pData) { this.int8Array(pData); },
			read	: function () { return this.int8Array(); }
		},

		"Uint32Array": {
			write	: function (pData) { this.uint32Array(pData); },
			read	: function () { return this.uint32Array(); }
		},
		"Uint16Array": {
			write	: function (pData) { this.uint16Array(pData); },
			read	: function () { return this.uint16Array(); }
		},
		"Uint8Array" : {
			write	: function (pData) { this.uint8Array(pData); },
			read	: function () { return this.uint8Array(); }
		},

		"String": {
			write	: function (str) { this.string(str); },
			read	: function () { return this.string(); }
		},

//float
		"Float64": {
			write	: function (val) { this.float64(val); },
			read	: function () { return this.float64(); }
		},
		"Float32": {
			write	: function (val) { this.float32(val); },
			read	: function () { return this.float32(); }
		},


//int
		"Int32"	: {
			write	: function (val) { this.int32(val); },
			read	: function () { return this.int32(); }
		},
		"Int16"	: {
			write	: function (val) { this.int16(val); },
			read	: function () { return this.int16(); }
		},
		"Int8"	: {
			write	: function (val) { this.int8(val); },
			read	: function () { return this.int8(); }
		},

//uint
		"Uint32": {
			write	: function (val) { this.uint32(val); },
			read	: function () { return this.uint32(); }
		},
		"Uint16": {
			write	: function (val) { this.uint16(val); },
			read	: function () { return this.uint16(); }
		},
		"Uint8"	: {
			write	: function (val) { this.uint8(val); },
			read	: function () { return this.uint8(); }
		},

		"Boolean": {
			write	: function (b) { this.bool(b); },
			read	: function () { return this.bool(); }
		},

		"Object": {
			write: function (object: any) {

				if (isArray(object)) {
/*is array*/
					this.bool(true);
					this.uint32((<any[]>object).length);

					for (var i = 0; i < (<any[]>object).length; ++ i) {
						this.write((<any[]>object)[i]);
					}
				}
				else {
/*is not array*/
					this.bool(false);
					this.stringArray(Object.keys(object));

					for (var key in object) {
						this.write(object[key]);
					}
				}
			},
			read: function (object: any) {
				var isArray: bool = this.bool();
				var keys: string[];
				var n:  number ;

				if (isArray) {
					n = this.uint32();
					object = object || new Array(n);

					for (var i = 0; i < n; ++ i) {
						object[i] = this.read();
					}
				}
				else {
					object = object || {};
					keys = this.stringArray();

					for (var i = 0; i < keys.length; ++ i) {
						object[keys[i]] = this.read();
					}
				}

				return object;
			}
		},

		"Function": {
			write: function (fn: Function): void {
				var sFunc: string = String(fn.valueOf());
				var sBody: string = sFunc.substr(sFunc.indexOf("{") + 1, sFunc.lastIndexOf("}") - sFunc.indexOf("{") - 1);
				var pArgs: string[] = sFunc.substr(sFunc.indexOf("(") + 1, sFunc.indexOf(")") - sFunc.indexOf("(") - 1).match(/[$A-Z_][0-9A-Z_$]*/gi);
//var sName: string = null;

//var pMatches: string[] = sFunc.match(/(function\s+)([_$a-zA-Z][_$a-zA-Z0-9]*)(?=\s*\()/gi);

// if (isDefAndNotNull(pMatches) && pMatches.length > 2) {
// 	sName = pMatches[2];
// }

//this.string(sName);
				this.stringArray(pArgs);
				this.string(sBody);
			},
			read: function (): Function {
				return new Function(this.stringArray(), this.string());
			}
		},
		"Number": "Float32",
		"Float"	: "Float32",
		"Int"	: "Int32",
		"Uint"	: "Uint32",
		"Array"	: "Object"
	});
}





module akra.io {


	interface IHash {
		[type: string]: any[];
	}


	class Packer extends BinWriter implements IPacker {
		/**@protected*/  _pHashTable: IHash = {};
		/**@protected*/  _pTemplate: IPackerTemplate = getPackerTemplate();

		/**@inline*/  get template(): IPackerTemplate { return this._pTemplate; }

		private memof(pObject: any, iAddr:  number , sType: string): void;
		private addr(pObject: any, sType: string):  number ;
		private nullPtr(): void;
		private rollback(n?:  number ): Uint8Array[];
		private append(pData: Uint8Array[]): void;
		private append(pData: ArrayBuffer): void;
		private append(pData: Uint8Array): void;
		private writeData(pObject: any, sType: string): bool;

		write(pObject: any, sType?: string): bool;

		private memof(pObject: any, iAddr:  number , sType: string): void {
			var pTable: IHash = this._pHashTable;
		    var pCell: any[] = pTable[sType];

		    if (!isDef(pCell)) {
		        pCell = pTable[sType] = [];
		    }

		    pCell.push(pObject, iAddr);
		}

		private addr(pObject: any, sType: string):  number  {
			var pTable: IHash = this._pHashTable;
		    var iAddr:  number ;
		    var pCell: any[] = pTable[sType];

		    if (isDef(pCell)) {

		        for (var i:  number  = 0, n:  number  = pCell.length / 2; i < n; ++ i) {
		            var j = 2 * i;

		            if (pCell[j] === pObject) {
		                return < number >pCell[j + 1];
		            }
		        }
		    }

		    return -1;
		}

		private  /**@inline*/  nullPtr(): void {
			return this.uint32(MAX_UINT32);
		}


		private rollback(n:  number  = 1): Uint8Array[] {
		    if (n === -1) {
		        n = this._pArrData.length;
		    }

		    var pRollback: Uint8Array[] = new Array(n);
		    var iRollbackLength:  number  = 0;

		    for (var i:  number  = 0; i < n; ++ i) {
		        pRollback[i] = this._pArrData.pop();
		        iRollbackLength += pRollback[i].byteLength;
		    }

		    this._iCountData -= iRollbackLength;

		    return pRollback;
		}

		private append(pData: any): void {
			if (isArray(pData)) {
		        for (var i:  number  = 0; i < (<Uint8Array[]>pData).length; ++ i) {
		            this._pArrData.push((<Uint8Array[]>pData)[i]);
		            this._iCountData += (<Uint8Array[]>pData)[i].byteLength;
		        }
		    }
		    else{
		        if (isArrayBuffer(pData)) {
		            pData = new Uint8Array(pData);
		        }
		        this._pArrData.push(<Uint8Array>pData);
		        this._iCountData += (<Uint8Array>pData).byteLength;
		    }
		}

		private writeData(pObject: any, sType: string): bool {
			var pTemplate: IPackerTemplate = this.template;
		    var pProperties: IPackerCodec = pTemplate.properties(sType);
		    var fnWriter: Function = null;

		    fnWriter = pProperties.write;

		    if (!isNull(fnWriter)) {
		         if (fnWriter.call(this, pObject) === false) {
		            logger.setSourceLocation( "io/Packer.ts" , 112 ); logger.error("cannot write type: " + sType); ;
		        }

		        return true;
		    }

		    logger.setSourceLocation( "io/Packer.ts" , 118 ); logger.assert(isDefAndNotNull(pProperties), "unknown object <" + sType + "> type cannot be writed"); ;
		    return true;
		}

		write(pObject: any, sType: string = null): bool {
			var pProperties: IPackerCodec;
		    var iAddr:  number , iType:  number ;
		    var pTemplate: IPackerTemplate = this.template;

		    if (isNull(sType)) {
		        sType = pTemplate.detectType(pObject);
		    }


	        pProperties = pTemplate.properties(sType);
	        iType = pTemplate.getTypeId(sType);


		    if (isNull(pObject) || !isDef(pObject) || !isDef(iType)) {
		        this.nullPtr();
		        return false;
		    }

		    iAddr = this.addr(pObject, sType);

		    if (iAddr < 0) {
		        iAddr = this.byteLength + 4 + 4;

		        this.uint32(iAddr);
		        this.uint32(iType);

		        if (this.writeData(pObject, sType)) {
		            this.memof(pObject, iAddr, sType);
		        }
		        else {
		            this.rollback(2);
		            this.nullPtr();
		        }
		    }
		    else {
		        this.uint32(iAddr);
		        this.uint32(iType);
		    }

		    return true;
		}
	}

	export function dump(pObject: any): ArrayBuffer {
		var pPacker: IPacker = new Packer;
	    pPacker.write(pObject);
	    return pPacker.data();
	}

}















module akra {
	export interface IPackerTemplate {} ;

	export interface IUnPacker extends IBinReader {
		template: IPackerTemplate;

		read(): any;
	}
}







module akra.io {
	class UnPacker extends BinReader implements IUnPacker {
		/**@protected*/  _pHashTable: any[] = <any[]><any>{};
		/**@protected*/  _pTemplate: IPackerTemplate = getPackerTemplate();
		/**@protected*/  _pPositions:  number [] = [];

		/**@inline*/  get template(): IPackerTemplate { return this._pTemplate; }

		private pushPosition(iPosition:  number ): void;
		private popPosition(): void;
		private memof(pObject: any, iAddr:  number ): void;
		private memread(iAddr:  number ): any;
		private readPtr(iAddr:  number , sType: string, pObject?: any): any;


		private  /**@inline*/  pushPosition(iPosition:  number ): void {
			this._pPositions.push(this._iPosition);
		    this._iPosition = iPosition;
		}

		private  /**@inline*/  popPosition(): void {
			this._iPosition = this._pPositions.pop();
		}

		private memof(pObject: any, iAddr:  number ): void {
			this._pHashTable[iAddr] = pObject;
		}

		private memread(iAddr:  number ): any {
			return this._pHashTable[iAddr] || null;
		}


		private readPtr(iAddr:  number , sType: string, pObject: any = null): any {
		    if (iAddr === MAX_UINT32) {
		        return null;
		    }

		    var pTmp: any = this.memread(iAddr);
		    var isReadNext: bool = false;
		    var fnReader: Function = null;
		    var pTemplate: IPackerTemplate = this.template;
		    var pProperties: IPackerCodec;

		    if (isDefAndNotNull(pTmp)) {
		        return pTmp;
		    }

		    if (iAddr === this._iPosition) {
		        isReadNext = true;
		    }
		    else {
//set new position
		        this.pushPosition(iAddr);
		    }

		    pProperties = pTemplate.properties(sType);

		    logger.setSourceLocation( "io/UnPacker.ts" , 67 ); logger.assert(isDefAndNotNull(pProperties), "unknown object <" + sType + "> type cannot be readed"); ;

		    fnReader = pProperties.read;

//read primal type
		    if (isDefAndNotNull(fnReader)) {
		        pTmp = fnReader.call(this, pObject);
		        this.memof(pTmp, iAddr);

//restore prev. position
		        if (!isReadNext) {
		            this.popPosition();
		        }

		        return pTmp;
		    }

		    logger.setSourceLocation( "io/UnPacker.ts" , 84 ); logger.criticalError("unhandled case!"); ;
		    return null;
		}


		read(): any {
		    var iAddr:  number  = this.uint32();

		    if (iAddr === MAX_UINT32) {
		        return null;
		    }

		    var iType:  number  = this.uint32();
		    var sType: string = this.template.getType(iType);

		    return this.readPtr(iAddr, sType);
		};
	}

	export function undump (pBuffer: any): any {
	    if (!isDefAndNotNull(pBuffer)) {
	        return null;
	    }

	    return (new UnPacker(pBuffer)).read();
	}
}




module akra {

	test("Bin Reader/Writer tests", () => {

		var pWriter: IBinWriter = new io.BinWriter;

		var i8a 	= new Int8Array([-1, -2, -3, -4, -5, -6, -7, -8, 0, 8, 7, 6, 5, 4, 3, 2, 1]);
	    var i16a 	= new Int16Array([-1, -2, -3, -4, -5, -6, -7, -8, 0, 8, 7, 6, 5, 4, 3, 2, 1]);
	    var i32a 	= new Int32Array([-1, -2, -3, -4, -5, -6, -7, -8, 0, 8, 7, 6, 5, 4, 3, 2, 1]);

	    var ui8a 	= new Uint8Array([8, 7, 6, 5, 4, 3, 2, 1, 0]);
	    var ui16a 	= new Uint16Array([8, 7, 6, 5, 4, 3, 2, 1, 0]);
	    var ui32a 	= new Uint32Array([8, 7, 6, 5, 4, 3, 2, 1, 0]);

	    var f32a 	= new Float32Array([-50, -100, -150]);
	    var f64a 	= new Float64Array([100, 200, 300]);

	    var sa 	= ["word 1", "word 2", "word 3"];


		shouldBeTrue("Is bool: TRUE");
		shouldBeFalse("Is bool: FALSE");

		shouldBe("Is uint: 8", 8);
		shouldBe("Is uint: 16", 16);
		shouldBe("Is uint: 32", 32);

		shouldBe("Is int: -8", -8);
		shouldBe("Is int: -16", -16);
		shouldBe("Is int: -32", -32);

		shouldBe("Is float: 128", 128);
		shouldBe("Is float: 256", 256);

		shouldBe("Is string: \"en/english\"", "en/english");
		shouldBe("Is string: \"ru/русский\"", "ru/русский");

		shouldBeArray("Is int8Array: [-1, -2, -3, -4, -5, -6, -7, -8, 0, 8, 7, 6, 5, 4, 3, 2, 1]", i8a);
		shouldBeArray("Is int16Array: [-1, -2, -3, -4, -5, -6, -7, -8, 0, 8, 7, 6, 5, 4, 3, 2, 1]", i16a);
		shouldBeArray("Is int32Array: [-1, -2, -3, -4, -5, -6, -7, -8, 0, 8, 7, 6, 5, 4, 3, 2, 1]", i32a);

		shouldBeArray("Is Uint8Array: [8, 7, 6, 5, 4, 3, 2, 1, 0]", ui8a);
		shouldBeArray("Is Uint16Array: [8, 7, 6, 5, 4, 3, 2, 1, 0]", ui16a);
		shouldBeArray("Is Uint32Array: [8, 7, 6, 5, 4, 3, 2, 1, 0]", ui32a);

		shouldBeArray("Is float32Array: [-50, -100, -150]", f32a);
		shouldBeArray("Is float64Array: [100, 200, 300]", f64a);

		shouldBeArray("Is stringArray: [\"word 1\", \"word 2\", \"word 3\"]", sa);

	    pWriter.bool(true);
	    pWriter.bool(false);

	    pWriter.uint8(8);
	    pWriter.uint16(16);
	    pWriter.uint32(32);

	    pWriter.int8(-8);
	    pWriter.int16(-16);
	    pWriter.int32(-32);

	    pWriter.float32(128);
	    pWriter.float64(256);

	    pWriter.string("en/english");
	    pWriter.string("ru/русский");


	    pWriter.int8Array(i8a);
	    pWriter.int16Array(i16a);
	    pWriter.int32Array(i32a);

	    pWriter.uint8Array(ui8a);
	    pWriter.uint16Array(ui16a);
	    pWriter.uint32Array(ui32a);

	    pWriter.float32Array(f32a);
	    pWriter.float64Array(f64a);

	    pWriter.stringArray(sa);

//===========================

	    var pReader = new io.BinReader(pWriter);


	    check(pReader.bool());
	    check(pReader.bool());

	    check(pReader.uint8());
	    check(pReader.uint16());
	    check(pReader.uint32());

	    check(pReader.int8());
	    check(pReader.int16());
	    check(pReader.int32());

	    check(pReader.float32());
	    check(pReader.float64());

	    check(pReader.string());
	    check(pReader.string());

	    check(pReader.int8Array());
	    check(pReader.int16Array());
	    check(pReader.int32Array());

	    check(pReader.uint8Array());
	    check(pReader.uint16Array());
	    check(pReader.uint32Array());

	    check(pReader.float32Array());
	    check(pReader.float64Array());

	    check(pReader.stringArray());

	});

	test("Packer/Unpacker tests", () => {
		var f32a: Float32Array = new Float32Array([4, 3, 2, 1]);
		var fnNoName: Function = function (b, c, a) {
			return Math.pow((b + a) * c, 2);
		};

		var pSub: Object = {
			name: "sub",
			a: [1, 2, 3, 4, 5],
			fa: f32a,
			fn: fnNoName
		};

		var pObject: Object = {
			value: [pSub, pSub]
		}

		shouldBeArray("Must be " + f32a.toString(), f32a);
		shouldBeTrue("Function packing");
		shouldBeTrue("Object with circular links");


		check(io.undump(io.dump(f32a)));
		check((<Function>io.undump(io.dump(fnNoName)))(10, 20, 30) == fnNoName(10, 20, 30));

		var pCopy = io.undump(io.dump(pObject));

		check(pCopy.value[0] === pCopy.value[1] && pCopy.value[0].fn(10, 20, 30) == fnNoName(10, 20 ,30));

	});
}
