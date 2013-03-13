

















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
	export interface IEventTable {} ;

	export enum EEventTypes {
		BROADCAST,
		UNICAST
	};

	export interface IEventProvider {
		getGuid():  number ;
		getEventTable(): IEventTable;
		connect(pSender: IEventProvider, sSignal: string, sSlot: string, eType?: EEventTypes): bool;
		disconnect(pSender: IEventProvider, sSignal: string, sSlot: string, eType?: EEventTypes): bool;																														bind(sSignal: string, fnListener: Function, eType?: EEventTypes): bool;																															unbind(sSignal: string, fnListener: Function, eType?: EEventTypes): bool;
	}
}



module akra {
	export enum ERPCPacketTypes {
        FAILURE,
        REQUEST,
        RESPONSE
    }

    export interface IRPCCallback {
        n:  number ;
        fn: Function;
    }

	export interface IRPCPacket {
        n:  number ;
        type: ERPCPacketTypes;
    }

    export interface IRPCRequest extends IRPCPacket {
        proc: string;
        argv: any[];
    }

    export interface IRPCResponse extends IRPCPacket  {
//procedure result
        res: any;
    }

	export interface IRPC extends IEventProvider {
		remote: any;

		join(sAddr?: string): void;
		rejoin(): void;
		free(): void;
		proc(...argv: any[]): bool;

		parse(pResponse: IRPCResponse): void;
		parseBinary(pData: ArrayBuffer): void;

		 joined(): void;

        _createRequest(): IRPCRequest;
        _releaseRequest(pReq: IRPCRequest): void;

	}
}














module akra {
	export enum EPipeTypes {
		UNKNOWN,

/** Connect to websocket. */
		WEBSOCKET,
/** Connect to webworker. */
		WEBWORKER
	}

	export enum EPipeDataTypes {
		BINARY,
		STRING
	}

	export interface IPipe extends IEventProvider {
		 uri: IURI;

		open(pAddr?: IURI): bool;
		open(sAddr?: string): bool;
		close(): void;

		write(sValue: string): bool;
		write(pValue: Object): bool;
		write(pValue: ArrayBuffer): bool;
		write(pValue: ArrayBufferView): bool;

		isOpened(): bool;
		isCreated(): bool;
		isClosed(): bool;

		 opened(pEvent: Event): void;
		 error(pErr: ErrorEvent): void;
		 closed(pEvent: CloseEvent): void;
		 message(pData: any, eType: EPipeDataTypes): void;
	}
}











module akra {
	export interface IEventSlot {
		target: any;
		callback: string;
		listener: Function;
	}

	export interface IEventSlotListMap {
		[index: string]: IEventSlot[];
	}
	export interface IEventSlotMap {
		[index: string]: IEventSlot;
	}

	export interface IEventSlotTable {
		[index: number]: IEventSlotListMap;
		[index: string]: IEventSlotListMap;
	}

	export interface IEventSlotList {
		[index: number]: IEventSlotMap;
		[index: string]: IEventSlotMap;
	}

	export interface IEventTable {
		broadcast: IEventSlotTable;
		unicast: IEventSlotList;

		addDestination(iGuid:  number , sSignal: string, pTarget: IEventProvider, sSlot: string, eType?: EEventTypes): bool;
		removeDestination(iGuid:  number , sSignal: string, pTarget: IEventProvider, sSlot: string, eType?: EEventTypes): bool;
		addListener(iGuid:  number , sSignal: string, fnListener: Function, eType?: EEventTypes): bool;
		removeListener(iGuid:  number , sSignal: string, fnListener: Function, eType?: EEventTypes): bool;

		findUnicastList(iGuid:  number ): IEventSlotMap;
		findBroadcastList(iGuid:  number ): IEventSlotListMap;
	}
}







/*console.error(this.getEventTable());*/











/**event, signal, slot*/


/**event, signal, slot*/










module akra.events {
	export class EventTable implements IEventTable {
		broadcast: IEventSlotTable = <IEventSlotTable>{};
		unicast: IEventSlotList = <IEventSlotList>{};

		addDestination(iGuid:  number , sSignal: string, pTarget: IEventProvider, sSlot: string, eType: EEventTypes = EEventTypes.BROADCAST): bool {
			if (eType === EEventTypes.BROADCAST) {
				this.findBroadcastSignalMap(iGuid, sSignal).push({target: pTarget, callback: sSlot, listener: null});
				return true;
			}
			else {
				this.unicast[iGuid] = this.unicast[iGuid] || {};
//console.log(iGuid, sSignal, pTarget, sSlot, eType);
//console.warn(this.unicast);
				if (!isDef(this.unicast[iGuid][sSignal])) {
					this.unicast[iGuid][sSignal] = {target: pTarget, callback: sSlot, listener: null};
					return true;
				}
			}
			return false;
		}

		removeDestination(iGuid:  number , sSignal: string, pTarget: IEventProvider, sSlot: string, eType: EEventTypes = EEventTypes.BROADCAST): bool {
			if (eType === EEventTypes.BROADCAST) {
				var pList: IEventSlot[] = this.findBroadcastSignalMap(iGuid, sSignal);
				for (var i:  number  = 0; i < pList.length; ++ i) {
					if (pList[i].target === pTarget && pList[i].callback === sSlot) {
						pList.splice(i, 1);
						return true;
					}
				}
			}
			else {
				if (this.unicast[iGuid] && this.unicast[iGuid][sSignal]) {
					delete this.unicast[iGuid][sSignal];
					return true;
				}
			}
			logger.setSourceLocation( "events/events.ts" , 109 ); logger.warning("cannot remove destination for GUID <%s> with signal <%s>", iGuid, sSignal); ;
			return false;
		}

		addListener(iGuid:  number , sSignal: string, fnListener: Function, eType: EEventTypes = EEventTypes.BROADCAST): bool {
			if (eType === EEventTypes.BROADCAST) {
				this.findBroadcastSignalMap(iGuid, sSignal).push({target: null, callback: null, listener: fnListener});
				return true;
			}
			else {
				this.unicast[iGuid] = this.unicast[iGuid] || {};
				if (!isDef(this.unicast[iGuid][sSignal])) {
					this.unicast[iGuid][sSignal] = {target: null, callback: null, listener: fnListener};
					return true;
				}
			}
			logger.setSourceLocation( "events/events.ts" , 125 ); logger.warning("cannot add listener for GUID <%s> with signal <%s>", iGuid, sSignal); ;
			return false;
		}

		removeListener(iGuid:  number , sSignal: string, fnListener: Function, eType: EEventTypes = EEventTypes.BROADCAST): bool {
			if (eType === EEventTypes.BROADCAST) {
				var pList: IEventSlot[] = this.findBroadcastSignalMap(iGuid, sSignal);
				for (var i:  number  = 0; i < pList.length; ++ i) {
					if (pList[i].listener === fnListener) {
						pList.splice(i, 1);
						return true;
					}
				}
			}
			else {
				if (this.unicast[iGuid] && this.unicast[iGuid][sSignal]) {
					delete this.unicast[iGuid][sSignal];
					return true;
				}
			}
			return false;
		}

		findBroadcastList(iGuid:  number ): IEventSlotListMap {
			this.broadcast[iGuid] = this.broadcast[iGuid] || {};
			return this.broadcast[iGuid];
		}

		findUnicastList(iGuid:  number ): IEventSlotMap {
//console.error(iGuid,this.unicast[iGuid]);

			this.unicast[iGuid] = this.unicast[iGuid] || {};
			return this.unicast[iGuid];
		}

		private findBroadcastSignalMap(iGuid:  number , sSignal: string): IEventSlot[] {
			this.broadcast[iGuid] = this.broadcast[iGuid] || {};
			this.broadcast[iGuid][sSignal] = this.broadcast[iGuid][sSignal] || [];
			return this.broadcast[iGuid][sSignal];
		}

		private
	}
}















module akra {
	export interface IPathinfo {
		path: string;
		dirname: string;
		filename: string;
		ext: string;
		basename: string;


		set(sPath: string): void;
		set(pPath: IPathinfo): void;
		isAbsolute(): bool;

		toString(): string;
	}

}



module akra.util {
	export class Pathinfo implements IPathinfo {
		private _sDirname: string = null;
		private _sExtension: string = null;
		private _sFilename: string = null;

		/**@inline*/  get path(): string { return this.toString(); }
		/**@inline*/  set path(sPath: string) { this.set(sPath); }

		/**@inline*/  get dirname(): string { return this._sDirname; }
		/**@inline*/  set dirname(sDirname: string) { this._sDirname = sDirname; }

		/**@inline*/  get filename(): string { return this._sFilename; }
		/**@inline*/  set filename(sFilename: string) { this._sFilename = sFilename; }

		/**@inline*/  get ext(): string { return this._sExtension; }
		/**@inline*/  set ext(sExtension: string) { this._sExtension = sExtension; }

		/**@inline*/  get basename(): string {
			return (this._sFilename ? this._sFilename + (this._sExtension ? "." + this._sExtension : "") : "");
		}

		/**@inline*/  set basename(sBasename: string) {
			var nPos:  number  = sBasename.lastIndexOf(".");

	        if (nPos < 0) {
	            this._sFilename = sBasename.substr(0);
	            this._sExtension = null;
	        }
	        else {
	            this._sFilename = sBasename.substr(0, nPos);
	            this._sExtension = sBasename.substr(nPos + 1);
	        }
		}


		constructor (pPath: IPathinfo);
		constructor (sPath: string);
		constructor (pPath?: any) {
			if (isDef(pPath)) {
				this.set(<string>pPath);
			}
		}


		set(sPath: string): void;
		set(pPath: IPathinfo): void;
		set(sPath?: any) {
			if (isString(sPath)) {
		        var pParts: string[] = sPath.replace('\\', '/').split('/');

		        this.basename = pParts.pop();

		        this._sDirname = pParts.join('/');
		    }
		    else if (sPath instanceof Pathinfo) {
		        this._sDirname = sPath.dirname;
		        this._sFilename = sPath.filename;
		        this._sExtension = sPath.ext;
		    }
		    else {
//critical_error
		        logger.setSourceLocation( "Pathinfo.ts" , 68 ); logger.error("Unexpected data type was used."); ;
		    }
		}

		isAbsolute(): bool { return this._sDirname[0] === "/"; }


		toString(): string {
			return (this._sDirname ? this._sDirname + "/" : "") + (this.basename);
		}

	}

}

module akra {
	export var Pathinfo = util.Pathinfo;
}










module akra {
	export interface IURI {
		scheme: string;
		userinfo: string;
		host: string;
		port:  number ;
		path: string;
		query: string;
		fragment: string;
		urn: string;
		url: string;
		authority: string;
		protocol: string;

		toString(): string;
	}
}



module akra.util {
	export class URI implements IURI {
		private sScheme: string = null;
		private sUserinfo: string = null;
		private sHost: string = null;
		private nPort:  number  = 0;
		private sPath: string = null;
		private sQuery: string = null;
		private sFragment: string = null;

		get urn(): string {
			return (this.sPath ? this.sPath : "") +
			(this.sQuery ? '?' + this.sQuery : "") +
			(this.sFragment ? '#' + this.sFragment : "");
		}

		get url(): string {
			return (this.sScheme ? this.sScheme : "") + this.authority;
		}

		get authority(): string {
			return (this.sHost ? '//' + (this.sUserinfo ? this.sUserinfo + '@' : "") +
				this.sHost + (this.nPort ? ':' + this.nPort : "") : "");
		}

		/**@inline*/  get scheme(): string {
			return this.sScheme;
		}

		get protocol(): string {
			if (!this.sScheme) {
				return this.sScheme;
			}

			return (this.sScheme.substr(0, this.sScheme.lastIndexOf(':')));
		}

		/**@inline*/  get userinfo(): string {
			return this.sUserinfo;
		}

		/**@inline*/  get host(): string {
			return this.sHost;
		}

		/**@inline*/  get port():  number  {
			return this.nPort;
		}

		/**@inline*/  set port(iPort:  number ) {
			this.nPort = iPort;
		}

		/**@inline*/  get path(): string {
			return this.sPath;
		}

		/**@inline*/  get query(): string {
			return this.sQuery;
		}

		/**@inline*/  get fragment(): string {
			return this.sFragment;
		}


		constructor (pUri: URI);
		constructor (sUri: string);
		constructor (pUri?) {
			if (pUri) {
				this.set(pUri);
			}
		}

		set(pUri: URI);
		set(sUri: string);
		set(pData?): URI {
			if (isString(pData)) {
				var pUri:RegExpExecArray = URI.uriExp.exec(<string>pData);

				logger.setSourceLocation( "URI.ts" , 86 ); logger.assert(pUri !== null, 'Invalid URI format used.\nused uri: ' + pData); ;

				if (!pUri) {
					return null;
				}

				this.sScheme = pUri[1] || null;
				this.sUserinfo = pUri[2] || null;
				this.sHost = pUri[3] || null;
				this.nPort = parseInt(pUri[4]) || null;
				this.sPath = pUri[5] || pUri[6] || null;
				this.sQuery = pUri[7] || null;
				this.sFragment = pUri[8] || null;

				return this;

			}
			else if (pData instanceof URI) {
				return this.set(pData.toString());
			}

			logger.setSourceLocation( "URI.ts" , 107 ); logger.error('Unexpected data type was used.'); ;

			return null;
		}

		toString(): string {
			return this.url + this.urn;
		}

//------------------------------------------------------------------//
//----- Validate a URI -----//
//------------------------------------------------------------------//
//- The different parts are kept in their own groups and can be recombined
//  depending on the scheme:
//  - http as $1://$3:$4$5?$7#$8
//  - ftp as $1://$2@$3:$4$5
//  - mailto as $1:$6?$7
//- groups are as follows:
//  1   == scheme
//  2   == userinfo
//  3   == host
//  4   == port
//  5,6 == path (5 if it has an authority, 6 if it doesn't)
//  7   == query
//  8   == fragment


		static private uriExp:RegExp = new RegExp("^([a-z0-9+.-]+:)?(?:\\/\\/(?:((?:[a-z0-9-._~!$&'()*+,;=:]|%[0-9A-F]{2})*)@)?((?:[a-z0-9-._~!$&'()*+,;=]|%[0-9A-F]{2})*)(?::(\\d*))?(\\/(?:[a-z0-9-._~!$&'()*+,;=:@/]|%[0-9A-F]{2})*)?|(\\/?(?:[a-z0-9-._~!$&'()*+,;=:@]|%[0-9A-F]{2})*(?:[a-z0-9-._~!$&'()*+,;=:@/]|%[0-9A-F]{2})*)?)(?:\\?((?:[a-z0-9-._~!$&'()*+,;=:/?@]|%[0-9A-F]{2})*))?(?:#((?:[a-z0-9-._~!$&'()*+,;=:/?@]|%[0-9A-F]{2})*))?$", "i");

/*
		 composed as follows:
		 ^
		 ([a-z0-9+.-]+):							#scheme
		 (?:
		 //							#it has an authority:
		 (?:((?:[a-z0-9-._~!$&'()*+,;=:]|%[0-9A-F]{2})*)@)?	#userinfo
		 ((?:[a-z0-9-._~!$&'()*+,;=]|%[0-9A-F]{2})*)		#host
		 (?::(\d*))?						#port
		 (/(?:[a-z0-9-._~!$&'()*+,;=:@/]|%[0-9A-F]{2})*)?	#path
		 |
		 #it doesn't have an authority:
		 (/?(?:[a-z0-9-._~!$&'()*+,;=:@]|%[0-9A-F]{2})+(?:[a-z0-9-._~!$&'()*+,;=:@/]|%[0-9A-F]{2})*)?	#path
		 )
		 (?:
		 \?((?:[a-z0-9-._~!$&'()*+,;=:/?@]|%[0-9A-F]{2})*)	#query string
		 )?
		 (?:
		 #((?:[a-z0-9-._~!$&'()*+,;=:/?@]|%[0-9A-F]{2})*)	#fragment
		 )?
		 $
		 */

	}
}



// #include "ReferenceCounter.ts"
// #include "Singleton.ts"

// #include "BrowserInfo.ts"
// #include "ApiInfo.ts"
// #include "ScreenInfo.ts"
// #include "DeviceInfo.ts"

// #include "UtilTimer.ts"

// #include "Entity.ts"

// #include "ThreadManager.ts"

module akra.util {

	export var uri = (sUri:string): IURI => new util.URI(sUri);

// export var pathinfo: (sPath: string) => IPathinfo;
// export var pathinfo: (pPath: IPathinfo) => IPathinfo;
	export var pathinfo: (pPath?) => IPathinfo;

	pathinfo = function (pPath?): IPathinfo {
		return new Pathinfo(pPath);
	}

//string to array buffer
	export var stoab = function (s: string): ArrayBuffer {
		var pCodeList:  number [] = new Array(len);

	    for (var i:  number  = 0, len = s.length; i < len; ++i) {
/*& 0xFF;*/
	        pCodeList[ i ] = s.charCodeAt(i);
	    }

	    return (new Uint8Array(pCodeList)).buffer;
	}

	export var abtos = function (pBuf: ArrayBuffer): string {
		var pData: Uint8Array = new Uint8Array(pBuf);
	    var s: string = "";

	    for (var n:  number  = 0; n < pData.length; ++ n) {
	        s += String.fromCharCode(pData[n]);
	    }

	    return s;
	}


	export function abtota(pBuffer: ArrayBuffer, eType: EDataTypes): ArrayBufferView {
        switch (eType) {
            case EDataTypes.FLOAT:
                return new Float32Array(pBuffer);
            case EDataTypes.SHORT:
                return new Int16Array(pBuffer);
            case EDataTypes.UNSIGNED_SHORT:
                return new Uint16Array(pBuffer);
            case EDataTypes.INT:
                return new Int32Array(pBuffer);
            case EDataTypes.UNSIGNED_INT:
                return new Uint32Array(pBuffer);
            case EDataTypes.BYTE:
                return new Int8Array(pBuffer);
            default:
            case EDataTypes.UNSIGNED_BYTE:
                return new Uint8Array(pBuffer);
        }
    }


	export function parseJSON(sJSON: string): Object {
		return eval('(' + sJSON + ')');
	};

/**
	 * Преобразование html-сформированного текста
	 * в dom.
	 */

	export function parseHTML(sHTML: string, useDocFragment: bool = true): any {
	    var pDivEl: HTMLDivElement = <HTMLDivElement>document.createElement('div');
	    var pDocFrag: DocumentFragment;

	    pDivEl.innerHTML = sHTML;

	    if (!useDocFragment) {
	        return pDivEl.childNodes;
	    }

	    pDocFrag = document.createDocumentFragment();

	    for (var i = 0, len:  number  = pDivEl.childNodes.length; i < len; ++ i) {
	        if (!isDef(pDivEl.childNodes[i])) {
	            continue;
	        }

	        pDocFrag.appendChild(pDivEl.childNodes[i]);
	    }

	    return pDocFrag;
	};

}



module akra.net {
	export  /**@const*/var  WEBSOCKET_PORT = 1337;

	interface IVirualDescriptor {
		onmessage: (pMessage: any) => void;
		onerror: (pErr: ErrorEvent) => void;
		onclose: (pEvent: CloseEvent) => void;
		onopen: (pEvent: Event) => void;
	}

	class Pipe implements IPipe {
		/**@protected*/  _pAddr: IURI = null;
/** Number of sended messages.*/
		/**@protected*/  _nMesg:  number  = 0;
		/**@protected*/  _eType: EPipeTypes = EPipeTypes.UNKNOWN;
		/**@protected*/  _pConnect: IVirualDescriptor = null;
		/**@protected*/  _bSetupComplete: bool = false;

		/**@inline*/  get uri(): IURI {
			return util.uri(this._pAddr.toString());
		}

		constructor (sAddr: string = null) {
			if (!isNull(sAddr)) {
				this.open(sAddr);
			}
		}

		open(pAddr?: IURI): bool;
		open(sAddr?: string): bool;
		open(sAddr: any = null): bool {
			var pAddr: IURI;
			var eType: EPipeTypes;
			var pSocket: WebSocket = null;
			var pWorker: Worker = null;
			var pPipe: IPipe = this;

			if (!isNull(sAddr)) {
				pAddr = util.uri(<string>sAddr);
			}
			else {
				if (this.isCreated()) {
					this.close();
				}

				pAddr = this.uri;
			}

// pipe to websocket
			if (pAddr.protocol.toLowerCase() === "ws") {
//unknown port
				if (!(pAddr.port > 0)) {
					pAddr.port = WEBSOCKET_PORT;
				}

//websocket unsupported
				if (!isDefAndNotNull(WebSocket)) {
					logger.setSourceLocation( "Pipe.ts" , 64 ); logger.error("Your browser does not support websocket api."); ;
					return false;
				}

				pSocket = new WebSocket(pAddr.toString());


				pSocket.binaryType = "arraybuffer";
				eType = EPipeTypes.WEBSOCKET;
			}
			else if (util.pathinfo(pAddr.path).ext.toLowerCase() === "js") {
				if (!isDefAndNotNull(Worker)) {
					logger.setSourceLocation( "Pipe.ts" , 76 ); logger.error("Your browser does not support webworker api."); ;
					return false;
				}

				pWorker = new Worker(pAddr.toString());
				eType = EPipeTypes.WEBWORKER;
			}
			else {
				logger.setSourceLocation( "Pipe.ts" , 84 ); logger.error("Pipe supported only websockets/webworkers."); ;
				return false;
			}

			this._pConnect = pWorker || pSocket;
			this._pAddr = pAddr;
			this._eType = eType;

			if (isDefAndNotNull(window)) {
				window.onunload = function (): void {
					pPipe.close();
				}
			}

			if (!isNull(this._pConnect)) {
				this.setupConnect();

				return true;
			}

			return false;
		}

		private setupConnect(): void {
			var pConnect: IVirualDescriptor = this._pConnect;
			var pPipe: IPipe = this;
			var pAddr: IURI = this._pAddr;

			if (this._bSetupComplete) {
				return;
			}

			pConnect.onmessage = function (pMessage: any): void {
				if (isArrayBuffer(pMessage.data)) {
					pPipe.message(pMessage.data, EPipeDataTypes.BINARY);
				}
				else {
					pPipe.message(pMessage.data, EPipeDataTypes.STRING);
				}
			}

			pConnect.onopen = function (pEvent: Event): void {
				logger.setSourceLocation( "Pipe.ts" , 126 ); logger.log("created connect to: " + pAddr.toString()); ;

				pPipe.opened(pEvent);
			}

			pConnect.onerror = function (pErr: ErrorEvent): void {
				logger.setSourceLocation( "Pipe.ts" , 132 ); logger.warning("pipe error detected: " + pErr.message); ;
				pPipe.error(pErr);
			}

			pConnect.onclose = function (pEvent: CloseEvent): void {
				logger.setSourceLocation( "Pipe.ts" , 137 ); logger.log("connection to " + pAddr.toString() + " closed"); ;
				pPipe.closed(pEvent);
			}

			this._bSetupComplete = true;
		}

		close(): void {
			var pSocket: WebSocket;
			var pWorker: Worker;
			if (this.isOpened()) {
		    	switch (this._eType) {
			    	case EPipeTypes.WEBSOCKET:
			    		pSocket = <WebSocket>this._pConnect;
						pSocket.onmessage = null;
				    	pSocket.onerror = null;
				    	pSocket.onopen = null;
						pSocket.close();
						break;
					case EPipeTypes.WEBWORKER:
						pWorker = <Worker><any>this._pConnect;
						pWorker.terminate();
				}
			}

			this._pConnect = null;
			this._bSetupComplete = false;
		}

		write(pValue: any): bool {
			var pSocket: WebSocket;
			var pWorker: Worker;

			if (this.isOpened()) {
				this._nMesg ++;

				switch (this._eType) {
			    	case EPipeTypes.WEBSOCKET:
			    		pSocket = <WebSocket>this._pConnect;

						if (isObject(pValue)) {
							pValue = JSON.stringify(pValue);
						}
						pSocket.send(pValue);
						return true;

					case EPipeTypes.WEBWORKER:
						pWorker = <Worker><any>this._pConnect;

						if (isDef(pValue.byteLength)) {
							pWorker.postMessage(pValue, [pValue]);
						}
						else {
							pWorker.postMessage(pValue);
						}

						return true;
				}
			}

			return false;
		}

		isClosed(): bool {
			switch (this._eType) {
				case EPipeTypes.WEBSOCKET:
					return ((<WebSocket>this._pConnect).readyState === WebSocket.CLOSED);
			}

			return isNull(this._pConnect);
		}

		isOpened(): bool {
			switch (this._eType) {
				case EPipeTypes.WEBSOCKET:
					return (<WebSocket>this._pConnect).readyState === WebSocket.OPEN;
			}

			return !isNull(this._pConnect);
		}


		/**@inline*/  isCreated(): bool {
			return !isNull(this._pConnect);
		}

		private _iGuid: number = eval("this._iGuid || akra.sid()"); private _pUnicastSlotMap: IEventSlotMap = null; private _pBroadcastSlotList: IEventSlotListMap = null; private static _pEventTable: IEventTable = new events.EventTable(); /**@inline*/ getEventTable(): IEventTable {return Pipe._pEventTable; } getGuid(): number {return this._iGuid < 0? (this._iGuid = sid()): this._iGuid; } /**@inline*/ connect(pSender: IEventProvider, sSignal: string, sSlot: string, eType?: EEventTypes): bool { return pSender.getEventTable().addDestination(pSender.getGuid(), sSignal, this, sSlot, eType); }; /**@inline*/ disconnect(pSender: IEventProvider, sSignal: string, sSlot: string, eType?: EEventTypes): bool { return pSender.getEventTable().removeDestination(pSender.getGuid(), sSignal, this, sSlot, eType); } /**@inline*/ bind(sSignal: string, fnListener: Function, eType?: EEventTypes): bool { return this.getEventTable().addListener(this.getGuid(), sSignal, fnListener, eType); } /**@inline*/ unbind(sSignal: string, fnListener: Function, eType?: EEventTypes): bool { return this.getEventTable().removeListener(this.getGuid(), sSignal, fnListener, eType); } ;
			opened (): void { this._pBroadcastSlotList = this._pBroadcastSlotList || this.getEventTable().findBroadcastList(this._iGuid); var _broadcast: IEventSlot[] = (<any>this._pBroadcastSlotList).opened; var _recivier: any = this; if(isDef(_broadcast)){ for (var i = 0; i < _broadcast.length; ++ i) { _broadcast[i].target? _broadcast[i].target[_broadcast[i].callback] (_recivier) : _broadcast[i].listener (_recivier) ; } } } ; ;
			closed (ev): void { this._pBroadcastSlotList = this._pBroadcastSlotList || this.getEventTable().findBroadcastList(this._iGuid); var _broadcast: IEventSlot[] = (<any>this._pBroadcastSlotList).closed; var _recivier: any = this; if(isDef(_broadcast)){ for (var i = 0; i < _broadcast.length; ++ i) { _broadcast[i].target? _broadcast[i].target[_broadcast[i].callback] (_recivier, ev) : _broadcast[i].listener (_recivier, ev) ; } } } ; ;
			error (err): void { this._pBroadcastSlotList = this._pBroadcastSlotList || this.getEventTable().findBroadcastList(this._iGuid); var _broadcast: IEventSlot[] = (<any>this._pBroadcastSlotList).error; var _recivier: any = this; if(isDef(_broadcast)){ for (var i = 0; i < _broadcast.length; ++ i) { _broadcast[i].target? _broadcast[i].target[_broadcast[i].callback] (_recivier, err) : _broadcast[i].listener (_recivier, err) ; } } } ; ;
			message (data, type): void { this._pBroadcastSlotList = this._pBroadcastSlotList || this.getEventTable().findBroadcastList(this._iGuid); var _broadcast: IEventSlot[] = (<any>this._pBroadcastSlotList).message; var _recivier: any = this; if(isDef(_broadcast)){ for (var i = 0; i < _broadcast.length; ++ i) { _broadcast[i].target? _broadcast[i].target[_broadcast[i].callback] (_recivier, data, type) : _broadcast[i].listener (_recivier, data, type) ; } } } ; ;
		;
	}

	export function createPipe(sAddr: string = null): IPipe {
		return new Pipe(sAddr);
	}
}















module akra {
	export interface IListExplorerFunc {
		(data: any, index?:  number ): bool;
//(data: any): void;
	}

/** ObjectList interface. */

	export interface IObjectList {
/** Number of elements in list */

		length:  number ;
/** First element in list */

		first: any;
/** Last element in list */

		last: any;
/** Current element in list */

		current: any;

/** Lock list for midifications. */

		lock(): void;
/** Unlock list */

		unlock(): void;
/** Is list locked ? */

		isLocked(): bool;

/** Set current element to <n> position. */

		seek(n?:  number ): IObjectList;
/** Get next element */

		next(): any;
/** Get prev element */

		prev(): any;
/** Push element to end of list. */

		push(element: any): IObjectList;
/** Pop element from end of list. */

		pop(): any;
/** Add element to list head. */

		prepend(element: any): IObjectList;

/** Add element from array. */

		fromArray(elements: any[], iOffset?:  number , iSize?:  number ): IObjectList;

/** Insert element before <n> element. */

		insert(n:  number , data: any): IObjectList;
/** Get valuie of <n> element */

		value(n:  number , defaultValue?: any): any;
/** Get index of element with given data */

		indexOf(element: any, from?:  number ):  number ;
/** Get sub list from this list */

		mid(pos?:  number , size?:  number ): IObjectList;
/** slice from array */

		slice(start?:  number , end?:  number ): IObjectList;
/** Move element from <from> postion to <to> position.*/

		move(from:  number , to:  number ): IObjectList;

/** Replace data of <n> element. */

		replace(pos:  number , value: any): IObjectList;
/** Erase element with number <n>. */

		erase(pos:  number ): IObjectList;
/** Erase elements from begin to end. */

		erase(begin:  number , end:  number ): IObjectList;
/** Is list contains data with <value>?*/

		contains(value: any): bool;

/** Get data of <n> item and remove it. */

		takeAt(pos:  number ): any;
/** Get data of first item and remove it. */

		takeFirst(): any;
/** Get data of last item and remove it. */

		takeLast(): any;
/** Get data of current item and remove it. */

		takeCurrent(): any;

/** Remove <n> item. */

		removeAt(n:  number ): void;
/** Remove one lement with data <element>. */

		removeOne(element: any): void;
/** Remove all lement with data <element>. */

		removeAll(element: any):  number ;

/** Swap items. */

		swap(i:  number , j:  number ): IObjectList;
/** Add another list to this */

		add(list: IObjectList): IObjectList;
/** Is this list equal to <list>. */

		isEqual(list: IObjectList): bool;

/** Clear list. */

		clear(): IObjectList;
/** For each loop. */

		forEach(fn: IListExplorerFunc): void;
	}
}












module akra {
/** ObjectArray interface */

	export interface IObjectArray {
/** number of element in array */

		length:  number ;

/** lock array for writing */

		lock(): void;
/**
		 * unlock array.
		 */

		unlock(): void;
/**
		 * Is arrat can be modified?
		 */

		isLocked(): bool;

/**
		 * Remove all elements from array;
		 * @param {Bool=false} bRemoveLinks Remove old pointers to data. 
		 */

		clear(bQuick?: bool): IObjectArray;

/** Get value of <n> element. */

		value(n:  number ): any;
/** Set value for <n> element. */

		set(n:  number , data: any): IObjectArray;
/** Fill ObjectArray from any <Array> */

		fromArray(elements: any[], iOffset?:  number , iSize?:  number ): IObjectArray;
/** Push element to end of array */

		push(element: any): IObjectArray;
/** Get & remove last element in array */

		pop(): any;
/** Complitly remove all data from array */

		release(): IObjectArray;
/** Swap elements in array */

		swap(i:  number , j:  number ): IObjectArray;
	}
}





module akra.util {
	export class ObjectArray implements IObjectArray {
		/**@protected*/  _pData: any[] = [];
		/**@protected*/  _bLock: bool = false;
		/**@protected*/  _iLength:  number  = 0;

		/**@inline*/  get length():  number  {
			return this._iLength;
		}

// set length(n: uint) {

// 	if (this._bLock) {
// 		return;
// 	}

// 	this.extend(n);
// 	this._iLength = n;
// }

		constructor (pElements?: any[]) {
			if (arguments.length) {
				this.fromArray(pElements);
			}
		}

		/**@inline*/  lock(): void {
			this._bLock = true;
		}

		/**@inline*/  unlock(): void {
			this._bLock = false;
		}

		/**@inline*/  isLocked(): bool {
			return this._bLock;
		}

		clear(bRemoveLinks: bool = false): IObjectArray {

			logger.setSourceLocation( "ObjectArray.ts" , 47 ); logger.assert(!this._bLock, "cannot clear. array is locked."); ;

			this._iLength = 0;

			if (bRemoveLinks) {
				for (var i:  number  = 0; i < this._pData.length; ++ i) {
					this._pData[i] = null;
				}
			}

			return this;
		}

		release(): IObjectArray {
			this.clear(true);
			this._pData.clear();
			return this;
		}

		/**@inline*/  value(n:  number ): any {
			return this._pData[n];
		}

		private extend(n:  number ): void {
			if (this._pData.length < n) {
// LOG("extending object array to > " + n);
				for (var i:  number  = this._pData.length; i < n; ++ i) {
					this._pData[i] = null;
				}
			}
		}

		set(n:  number , pData: any): IObjectArray {
			logger.setSourceLocation( "ObjectArray.ts" , 80 ); logger.assert(!this._bLock, "cannot clear. array is locked."); ;

			var N:  number  = n + 1;

			this.extend(N);

			if (this._iLength < N) {
				this._iLength = N;
			}

			this._pData[n] = pData;

			return this;
		}

		fromArray(pElements: any[], iOffset:  number  = 0, iSize:  number  = 0): IObjectArray {
			logger.setSourceLocation( "ObjectArray.ts" , 96 ); logger.assert(!this._bLock, "cannot clear. array is locked."); ;

			iSize = iSize > 0? iSize < pElements.length? iSize: pElements.length: pElements.length;

			this.extend(iSize);

			for (var i:  number  = iOffset, j:  number  = 0; i < iSize; ++ i, ++ j) {
				this._pData[i] = pElements[j];
			}

			this._iLength = i;

			return this;
		}

		/**@inline*/  push(pElement: any): IObjectArray {

			logger.setSourceLocation( "ObjectArray.ts" , 113 ); logger.assert(!this._bLock, "cannot clear. array is locked."); ;

			return this.set(this._iLength, pElement);
		}

		/**@inline*/  pop(): any {
			logger.setSourceLocation( "ObjectArray.ts" , 119 ); logger.assert(!this._bLock, "cannot clear. array is locked."); ;
			return this._iLength > 0? this._pData[-- this._iLength]: null;
		}

		/**@inline*/  swap(i:  number , j:  number ): IObjectArray {
			logger.setSourceLocation( "ObjectArray.ts" , 124 ); logger.assert(!this._bLock, "cannot clear. array is locked."); ;
			logger.setSourceLocation( "ObjectArray.ts" , 125 ); logger.assert(i < this._iLength && j < this._iLength, "invalid swap index."); ;

			this._pData.swap(i, j);

			return this;
		}

	}
}

module akra {
	export var ObjectArray = util.ObjectArray;
}



module akra.util {
	export interface IObjectListItem {
		next: IObjectListItem;
		prev: IObjectListItem;
		data: any;
	};


	export class ObjectList implements IObjectList {
		/**@protected*/  _pHead: IObjectListItem = null;
		/**@protected*/  _pTail: IObjectListItem = null;
		/**@protected*/  _pCurrent: IObjectListItem = null;
		/**@protected*/  _iLength:  number  = 0;
		/**@protected*/  _bLock: bool = false;


		/**@inline*/  get length():  number  {
			return this._iLength;
		};

		/**@inline*/  get first(): any {
			this._pCurrent = this._pHead;
			return (isDefAndNotNull(this._pCurrent)) ? this._pCurrent.data : null;
		};

		/**@inline*/  get last(): any {
			this._pCurrent = this._pTail;
			return (isDefAndNotNull(this._pCurrent)) ? this._pCurrent.data : null;
		}

		/**@inline*/  get current(): any {
			return (isDefAndNotNull(this._pCurrent)) ? this._pCurrent.data : null;
		}

		/**@inline*/  lock(): void {
			this._bLock = true;
		}

		/**@inline*/  unlock(): void {
			this._bLock = false;
		}

		/**@inline*/  isLocked(): bool {
			return this._bLock;
		}

		/**@inline*/  value(n:  number ): any{
			return this.find(n).data;
		};

		constructor (pData?: any[]) {
			if (arguments.length) {
				this.fromArray(pData);
			}
		}

		indexOf(pData: any, iFrom:  number  = 0.):  number {
			var pItem: IObjectListItem = this.find(iFrom);

			for(var i:  number  = iFrom; i<this._iLength; i++){
				if(pItem.data === pData){
					return i;
				}
				pItem = pItem.next;
			}
			return -1;
		};

		mid(iPos:  number  = 0, iSize:  number  = this._iLength): IObjectList{
			iSize = Math.min(this._iLength - iPos, iSize);

			if (iPos > this._iLength - 1) {
				return null;
			}

			var pNewList: IObjectList = new ObjectList();
			var pItem: IObjectListItem = this.find(iPos);

			for (var i:  number  = 0; i < iSize; ++ i) {
				pNewList.push(pItem.data);
				pItem = pItem.next;
			};

			return pNewList;
		};

		/**@inline*/  slice(iStart:  number  = 0, iEnd:  number  = Math.max(this._iLength - iStart, 0)): IObjectList {
			return this.mid(iStart, iEnd - iStart);
		}

		/**@inline*/  move(iFrom:  number , iTo:  number ): IObjectList{
			return this.insert(iTo - 1, this.takeAt(iFrom));
		};

		/**@inline*/  replace(iPos:  number , pData: any): IObjectList{
			logger.setSourceLocation( "util/ObjectList.ts" , 102 ); logger.assert(!this.isLocked(), "list locked."); ;
			this.find(iPos).data = pData;
			return this;
		};

		erase(pos:  number ): IObjectList;
		erase(begin:  number , end:  number ): IObjectList;
		erase(begin:  number , end?:  number ): IObjectList{
			if(arguments.length < 2){
				this.takeAt(< number >arguments[0]);
			}
			else{
				end = Math.min(end, this._iLength);
				for(var i:  number  = begin; i < end; i++){
					this.takeAt(i);
				}
			}
			return this;
		};

		/**@inline*/  contains(pData: any): bool{
			return (this.indexOf(pData) >= 0);
		};

		/**@inline*/  removeAt(n:  number ): void{
			this.takeAt(n);
		};

		/**@inline*/  removeOne(pData: any): void{
			this.removeAt(this.indexOf(pData));
		};

		/**@inline*/  removeAll(pData: any):  number  {
			var i:  number ;
			var n:  number  = this.length;

			while((i = this.indexOf(pData)) >= 0){
				this.removeAt(i);
				i--;
			}

			return n;
		}

		swap(i:  number , j:  number ): IObjectList {
			logger.setSourceLocation( "util/ObjectList.ts" , 147 ); logger.assert(!this.isLocked(), "list locked."); ;

			i = Math.min(i, this._iLength-1);
			j = Math.min(j, this._iLength-1);

			if (i != j) {
				var pItem1: IObjectListItem = this.find(i);
				var pItem2: IObjectListItem = this.find(j);

				var pTmp: any = pItem1.data;

				pItem1.data = pItem2.data;
				pItem2.data = pTmp;
			}

			return this;
		}

		add(pList: IObjectList): IObjectList{
			pList.seek(0);

			if(pList.length > 1){
				this.push(pList.first());
			}

			for(var i:  number =1; i<pList.length; i++){
				this.push(pList.next());
			}

			return this;
		}

		seek(n:  number  = 0): IObjectList {
			var pElement: IObjectListItem;

			n = Math.min(n, this._iLength - 1);

			if (n > this._iLength / 2) {
				pElement = this._pTail;

				for (var m:  number  = this._iLength - 1 - n; m > 0; -- m) {
					pElement = pElement.prev;
				}
			}
			else {
				pElement = this._pHead;

				for (var i:  number  = 0; i < n; ++ i) {
					pElement = pElement.next;
				}
			}

			this._pCurrent = pElement;

			return this;
		};

		/**@inline*/  next(): any {
			return (isDefAndNotNull(this._pCurrent) && isDefAndNotNull(this._pCurrent.next))? (this._pCurrent = this._pCurrent.next).data: null;
		}

		/**@inline*/  prev(): any {
			return (isDefAndNotNull(this._pCurrent) && isDefAndNotNull(this._pCurrent.prev))? (this._pCurrent = this._pCurrent.prev).data: null;
		}

		/**@inline*/  push(pElement: any): IObjectList{
			return this.insert(this._iLength, pElement)
		};

		/**@inline*/  takeAt(n:  number ): any{
			logger.setSourceLocation( "util/ObjectList.ts" , 217 ); logger.assert(!this.isLocked(), "list locked."); ;

			if(n < 0){
				return null;
			}

			return this.pullElement(this.find(n));
		};

		private pullElement(pItem: IObjectListItem): any {

			if (isNull(pItem.prev)) {
				this._pHead = pItem.next;
			}
			else {
				pItem.prev.next = pItem.next;
			}

			if (isNull(pItem.next)) {
				this._pTail = pItem.prev;
			}
			else {
				pItem.next.prev = pItem.prev;
			}

			this._iLength --;

			if (isNull(pItem.next)) {
				this._pCurrent = this._pTail;
			}
			else {
				this._pCurrent = pItem.next;
			}

			return this.releaseItem(pItem);
		};


		/**@inline*/  takeFirst(): any{
			return this.takeAt(0);
		};

		/**@inline*/  takeLast(): any {
			return this.takeAt(this._iLength - 1);
		};

		/**@inline*/  takeCurrent(isPrev: bool = false): any {
			return this.pullElement(this._pCurrent);
		}

		/**@inline*/  pop(): any{
			return this.takeAt(this._iLength - 1);
		};

		/**@inline*/  prepend(pElement: any): IObjectList{
			return this.insert(0,pElement)
		};

		/**@inline*/  private find(n:  number ): IObjectListItem{
			if (n < this._iLength) {
				this.seek(n);
				return this._pCurrent;
			}

			return null;
		};

		/**@inline*/  private releaseItem(pItem: IObjectListItem): any {
			var pData: any = pItem.data;

			pItem.next = null;
			pItem.prev = null;
			pItem.data = null;

			ObjectList.listItemPool.push(pItem);

			return pData;
		};

		/**@inline*/  private createItem(): IObjectListItem {
			if (ObjectList.listItemPool.length == 0) {
// LOG("allocated object list item");
				return {next: null, prev: null, data: null};
			}
// LOG("before pop <----------", this._iLength, this.first);
			return <IObjectListItem>ObjectList.listItemPool.pop();
		}

		fromArray(elements: any[], iOffset:  number  = 0, iSize:  number  = elements.length): IObjectList{
			iOffset = Math.min(iOffset, this._iLength);

			for(var i:  number  = 0; i < iSize; i++){
				this.insert(iOffset + i, elements[i]);
			}

			return this;
		}

		insert(n:  number , pData: any): IObjectList{
			logger.setSourceLocation( "util/ObjectList.ts" , 316 ); logger.assert(!this.isLocked(), "list locked."); ;

			var pNew: IObjectListItem = this.createItem();
			var pItem: IObjectListItem;

			n = Math.min(n, this._iLength);
			pNew.data = pData;


			if (n == 0) {
				if (isNull(this._pHead)) {
					this._pTail = pNew;
				}

				pNew.next = this._pHead;
				this._pHead = pNew;
			}
			else {
				pItem = this.find(n - 1);

				if(pItem == null) {
					this._pHead = pNew;
				}
				else {

					if (pItem.next == null) {
						this._pTail = pNew;
					}
					else {
						pNew.next = pItem.next;
						pItem.next.prev = pNew;
					}

					pItem.next = pNew;
					pNew.prev = pItem;
				}
			}

			this._iLength ++;
			this._pCurrent = pNew;

			return this;
		};

		isEqual(pList: IObjectList): bool {
			if (this._iLength == pList.length) {
				if (this === pList) {
					return true;
				}

				var l1: IObjectListItem = this.first;
				var l2: IObjectListItem = pList.first;

				for (var i:  number  = 0; i < this._iLength; ++i) {
					if (l1 != l2) {
						return false;
					}

					l1 = this.next();
					l2 = pList.next();
				}

				return true;
			}

			return false;
		}

		clear(): IObjectList {
			logger.setSourceLocation( "util/ObjectList.ts" , 385 ); logger.assert(!this.isLocked(), "list locked."); ;

			var pPrev: IObjectListItem;
			var pNext: IObjectListItem;

			this._pCurrent = this._pHead;

			for (var i:  number  = 0; i < this._iLength; ++ i) {
				pPrev = this._pCurrent;
				pNext = this._pCurrent = this._pCurrent.next;

				this.releaseItem(pPrev);
			}

			this._pHead = this._pCurrent = this._pTail = null;
			this._iLength = 0;

			return this;
		}

		forEach(fn: IListExplorerFunc): void {
			var pItem: IObjectListItem = this._pHead;
			var n:  number  = 0;
			do {
				if (fn(pItem.data, n ++) === false) {
					return;
				}
			} while ((pItem = pItem.next));
		}

		static private listItemPool: IObjectArray = new ObjectArray;

	}
}

module akra {
	export var ObjectList = util.ObjectList;
}




module akra.net {

    class RPC implements IRPC {
        /**@protected*/  _pPipe: IPipe = null;

//стек вызововы, которые были отложены
        /**@protected*/  _pDefferedRequests: IObjectList = new ObjectList;
//стек вызовов, ожидающих результата
//type: ObjectList<IRPCCallback>
        /**@protected*/  _pCallbacks: IObjectList = new ObjectList;
//число совершенных вызовов
        /**@protected*/  _nCalls:  number  = 0;
//rejoin timer
// protected _iReconnect: int = -1;

        /**@protected*/  _pRemoteAPI: Object = {};

//контекст, у которого будут вызываться методы
//при получении REQUEST запросов со стороны сервера
        /**@protected*/  _pContext: any = null;

        /**@inline*/  get remote(): any { return this._pRemoteAPI; }

        constructor (sAddr?: string, pContext?: Object);
        constructor (pAddr: any = null, pContext: Object = null) {
            if (!isNull(pAddr)) {
                this.join(<string>pAddr);
            }
        }

        join(sAddr: string = null): void {
            var pPipe: IPipe = this._pPipe;
            var pRPC: IRPC = this;
            var pDeffered: IObjectList = this._pDefferedRequests;

            if (isNull(pPipe)) {
                pPipe = net.createPipe();

                pPipe.bind( "message" ,
                    function (pPipe: IPipe, pMessage: any, eType: EPipeDataTypes): void {
// LOG(pMessage);
                        if (eType !== EPipeDataTypes.BINARY) {
                            pRPC.parse(JSON.parse(<string>pMessage));
                        }
                        else {
                            pRPC.parseBinary(new Uint8Array(pMessage));
                        }
                    }
                );

                pPipe.bind( "opened" ,
                    function (pPipe: IPipe, pEvent: Event): void {
//if we have unhandled call in deffered...
                        if (pDeffered.length) {
                            pDeffered.seek(0);

                            while(pDeffered.length > 0) {
                                pPipe.write(pDeffered.current);
                                pRPC._releaseRequest(<IRPCRequest>pDeffered.takeCurrent());
                            }

                            logger.setSourceLocation( "net/RPC.ts" , 72 ); logger.assert(pDeffered.length === 0, "something going wrong. length is: " + pDeffered.length); ;
                        }

                        pRPC.proc(RPC.PROC_LIST,
                            function (pError: Error, pList: string[]) {
                                if (!akra.isNull(pError)) {
                                    logger.setSourceLocation( "net/RPC.ts" , 78 ); logger.criticalError("could not get proc. list"); ;
                                }
//TODO: FIX akra. prefix...
                                if (!akra.isNull(pList) && akra.isArray(pList)) {

                                    for (var i:  number  = 0; i < pList.length; ++ i) {
                                        (function (sMethod) {

                                            pRPC.remote[sMethod] = function () {
                                                var pArguments: string[] = [sMethod];

                                                for (var j:  number  = 0; j < arguments.length; ++ j) {
                                                    pArguments.push(arguments[j]);
                                                }

                                                return pRPC.proc.apply(pRPC, pArguments);
                                            }
                                        })(String(pList[i]));
                                    }
                                }

                                pRPC.joined();
                            }
                        );
                    }
                );

                pPipe.bind( "error" ,
                    function(pPipe: IPipe, pError: Error): void {
                        logger.setSourceLocation( "net/RPC.ts" , 107 ); logger.error("pipe error occured..."); ;
                        pRPC.rejoin();
                    }
                );

                pPipe.bind( "closed" ,
                    function (pPipe: IPipe, pEvent: CloseEvent): void {
                        pRPC.rejoin();
                    }
                );
            }

            pPipe.open(<string>sAddr);

            this._pPipe = pPipe;
        }

        rejoin(): void {
            var pRPC: IRPC = this;
// clearTimeout(this._iReconnect);

            if (this._pPipe.isOpened()) {
                return;
            }

            if (this._pPipe.isClosed()) {
// LOG("attempt to reconnecting...");

                this.join();
            }

// this._iReconnect = setTimeout(
//     function (): void {
//         pRPC.rejoin();
//     },
//     RPC.OPTIONS.RECONNECT_TIMEOUT
// );
        }

        parse(pRes: IRPCResponse): void {
            if (!isDef(pRes.n)) {
                logger.setSourceLocation( "net/RPC.ts" , 148 ); logger.log(pRes); ;
                logger.setSourceLocation( "net/RPC.ts" , 149 ); logger.warning("message droped, because seriial not recognized."); ;
            };

            this.response(pRes.n, pRes.type, pRes.res);
        }

        parseBinary(pBuffer: Uint8Array): void {
            var pRes: Uint8Array = pBuffer;
            var nMsg:  number  = (new Uint32Array(pBuffer.subarray(0, 4).buffer, 0, 4))[0];
            var eType: ERPCPacketTypes = <ERPCPacketTypes>pBuffer[4];
            var pResult: Uint8Array = new Uint8Array(pBuffer, 8);

            this.response(nMsg, eType, pResult);
        }

        private response(nSerial:  number , eType: ERPCPacketTypes, pResult: any): void {
            var pStack: IObjectList = this._pCallbacks;

            if (eType === ERPCPacketTypes.RESPONSE) {
                var pCallback: IRPCCallback = <IRPCCallback>pStack.last;
// WARNING("---------------->",nSerial,"<-----------------");
                do {
// LOG("#n: ", pCallback.n, " result: ", pResult);
                    if (pCallback.n === nSerial) {
                        pCallback.fn(null, pResult);
                        this._releaseCallback(pStack.takeCurrent());
                        return;
                    }
                } while (pCallback = pStack.prev());


                logger.setSourceLocation( "net/RPC.ts" , 180 ); logger.warning("package droped, invalid serial: " + nSerial); ;
            }
            else if (eType === ERPCPacketTypes.REQUEST) {
                logger.setSourceLocation( "net/RPC.ts" , 183 ); logger.error("TODO: REQUEST package type temprary unsupported."); ;
            }
            else if (eType === ERPCPacketTypes.FAILURE) {
                logger.setSourceLocation( "net/RPC.ts" , 186 ); logger.error("detected FAILURE on " + nSerial + " package"); ;
            }
            else {
                logger.setSourceLocation( "net/RPC.ts" , 189 ); logger.error("unsupported response type detected: " + eType); ;
            }
        }

        free() {
            this._pDefferedRequests.clear();
            this._pCallbacks.clear();
        }

        proc(...argv: any[]): bool {

            var IRPCCallback:  number  = arguments.length -1;
            var fnCallback: Function =
                isFunction(arguments[IRPCCallback])? <Function>arguments[IRPCCallback]: null;
            var nArg:  number  = arguments.length - (fnCallback? 2: 1);
            var pArgv: any[] = new Array(nArg);
            var pPipe: IPipe = this._pPipe;
            var pCallback: IRPCCallback;
            var bResult: bool;

            for (var i = 0; i < nArg; ++ i) {
                pArgv[i] = arguments[i + 1];
            }

            var pProc: IRPCRequest = this._createRequest();

            pProc.n     = this._nCalls ++;
            pProc.type  = ERPCPacketTypes.REQUEST;
            pProc.proc  = String(arguments[0]);
            pProc.argv  = pArgv;


            if (!isNull(fnCallback)) {
                pCallback = <IRPCCallback>this._createCallback();
                pCallback.n = pProc.n;
                pCallback.fn = fnCallback;
            }

            if (isNull(pPipe) || !pPipe.isOpened()) {
                if (this._pDefferedRequests.length <= RPC.OPTIONS.DEFFERED_CALLS_LIMIT) {
                    this._pDefferedRequests.push(pProc);
                    this._pCallbacks.push(pCallback);
                }
                else {
                    pCallback.fn(RPC.ERRORS.STACK_SIZE_EXCEEDED);
                    logger.setSourceLocation( "net/RPC.ts" , 234 ); logger.warning(RPC.ERRORS.STACK_SIZE_EXCEEDED); ;

                    this._releaseCallback(pCallback);
                }

                return false;
            }

            this._pCallbacks.push(pCallback);

            bResult = pPipe.write(pProc);

            this._releaseRequest(pProc);

            return bResult;
        }

        /**@inline*/  _releaseRequest(pReq: IRPCRequest): void {
            pReq.n = 0;
            pReq.proc = null;
            pReq.argv = null;

            RPC.requestPool.push(pReq);
        };

        /**@inline*/  _createRequest(): IRPCRequest {
            if (RPC.requestPool.length == 0) {
// LOG("allocated rpc request");
                return {n: 0, type: ERPCPacketTypes.REQUEST, proc: null, argv: null };
            }

            return <IRPCRequest>RPC.requestPool.pop();
        }

        /**@inline*/  _releaseCallback(pReq: IRPCCallback): void {
            pReq.n = 0;
            pReq.fn = null;

            RPC.callbackPool.push(pReq);
        };

        /**@inline*/  _createCallback(): IRPCCallback {
            if (RPC.callbackPool.length == 0) {
// LOG("allocated callback");
                return { n: 0, fn: null};
            }

            return <IRPCCallback>RPC.callbackPool.pop();
        }

        private _iGuid: number = eval("this._iGuid || akra.sid()"); private _pUnicastSlotMap: IEventSlotMap = null; private _pBroadcastSlotList: IEventSlotListMap = null; private static _pEventTable: IEventTable = new events.EventTable(); /**@inline*/ getEventTable(): IEventTable {return RPC._pEventTable; } getGuid(): number {return this._iGuid < 0? (this._iGuid = sid()): this._iGuid; } /**@inline*/ connect(pSender: IEventProvider, sSignal: string, sSlot: string, eType?: EEventTypes): bool { return pSender.getEventTable().addDestination(pSender.getGuid(), sSignal, this, sSlot, eType); }; /**@inline*/ disconnect(pSender: IEventProvider, sSignal: string, sSlot: string, eType?: EEventTypes): bool { return pSender.getEventTable().removeDestination(pSender.getGuid(), sSignal, this, sSlot, eType); } /**@inline*/ bind(sSignal: string, fnListener: Function, eType?: EEventTypes): bool { return this.getEventTable().addListener(this.getGuid(), sSignal, fnListener, eType); } /**@inline*/ unbind(sSignal: string, fnListener: Function, eType?: EEventTypes): bool { return this.getEventTable().removeListener(this.getGuid(), sSignal, fnListener, eType); } ;
            joined (): void { this._pBroadcastSlotList = this._pBroadcastSlotList || this.getEventTable().findBroadcastList(this._iGuid); var _broadcast: IEventSlot[] = (<any>this._pBroadcastSlotList).joined; var _recivier: any = this; if(isDef(_broadcast)){ for (var i = 0; i < _broadcast.length; ++ i) { _broadcast[i].target? _broadcast[i].target[_broadcast[i].callback] (_recivier) : _broadcast[i].listener (_recivier) ; } } } ; ;
        ;

        private static requestPool: IObjectArray = new ObjectArray;
        private static callbackPool: IObjectArray = new ObjectArray;

        static OPTIONS = {
            DEFFERED_CALLS_LIMIT: 1024,
            RECONNECT_TIMEOUT   : 1000
        }

        static ERRORS = {
            STACK_SIZE_EXCEEDED: new Error("stack size exceeded")
        }

//имя процедуры, для получения все поддерживаемых процедур
        static PROC_LIST: string = "proc_list";

    }

    export function createRpc(): IRPC {
        return new RPC;
    }
}



module akra.util {

	test("RPC tests", () => {
		var pRpc: IRPC = net.createRpc();
		var i:  number  = 0;

		pRpc.join("ws://localhost");

		pRpc.bind( "joined" ,
			function (pRpc: IRPC): void {

				setInterval(function (): void {

					var iSendTime:  number  = now();

					(function (n) {
						pRpc.remote.echo(n, function (pErr: Error, j:  number ): void {
							if (!isNull(pErr)) {
								logger.setSourceLocation( "Z:/home/akra/www/akra-engine-core/src2/tests/common/rpc/rpc.ts" , 22 ); logger.warning(pErr.message); ;
								return;
							}

							shouldBeTrue("ping: " + (now() - iSendTime) +" ms" + "[ echo: " + j + " ]");
							check(n == j);


						})
					})(i ++);
				}, 10);
			}
		);
	});
}
