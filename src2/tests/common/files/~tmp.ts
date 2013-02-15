





























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


    export  var  INVALID_INDEX:  number  =  0xffff;

// (-2147483646);
    export  var  MIN_INT32:  number  = 0xffffffff;
// ( 2147483647);
    export  var  MAX_INT32:  number  = 0x7fffffff;
// (-32768);
    export  var  MIN_INT16:  number  = 0xffff;
// ( 32767);  
    export  var  MAX_INT16:  number  = 0x7fff;
// (-128);
    export  var  MIN_INT8:  number  = 0xff;
// ( 127);        
    export  var  MAX_INT8:  number  = 0x7f;
    export  var  MIN_UINT32:  number  = 0;
    export  var  MAX_UINT32:  number  = 0xffffffff;
    export  var  MIN_UINT16:  number  = 0;
    export  var  MAX_UINT16:  number  = 0xffff;
    export  var  MIN_UINT8:  number  = 0;
    export  var  MAX_UINT8:  number  = 0xff;


    export  var  SIZE_FLOAT64:  number  = 8;
    export  var  SIZE_REAL64:  number  = 8;
    export  var  SIZE_FLOAT32:  number  = 4;
    export  var  SIZE_REAL32:  number  = 4;
    export  var  SIZE_INT32:  number  = 4;
    export  var  SIZE_UINT32:  number  = 4;
    export  var  SIZE_INT16:  number  = 2;
    export  var  SIZE_UINT16:  number  = 2;
    export  var  SIZE_INT8:  number  = 1;
    export  var  SIZE_UINT8:  number  = 1;
    export  var  SIZE_BYTE:  number  = 1;
    export  var  SIZE_UBYTE:  number  = 1;

//1.7976931348623157e+308
    export  var  MAX_FLOAT64:  number  = Number.MAX_VALUE;
//-1.7976931348623157e+308
    export  var  MIN_FLOAT64:  number  = -Number.MAX_VALUE;
//5e-324
    export  var  TINY_FLOAT64:  number  = Number.MIN_VALUE;

//    export const MAX_REAL64: number = Number.MAX_VALUE;   //1.7976931348623157e+308
//    export const MIN_REAL64: number = -Number.MAX_VALUE;  //-1.7976931348623157e+308
//    export const TINY_REAL64: number = Number.MIN_VALUE;  //5e-324


//3.4e38
    export  var  MAX_FLOAT32:  number  = 3.4e38;
//-3.4e38
    export  var  MIN_FLOAT32:  number  = -3.4e38;
//1.5e-45  
    export  var  TINY_FLOAT32:  number  = 1.5e-45;

//    export const MAX_REAL32: number = 3.4e38;     //3.4e38
//    export const MIN_REAL32: number = -3.4e38;    //-3.4e38
//    export const TINY_REAL32: number = 1.5e-45;   //1.5e-45

    export  var  DEFAULT_MATERIAL_NAME: string =  "default" ;

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
                logger.setSourceLocation( "common.ts" , 396 ); logger.error('unknown data/image type used'); ;
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
        return < number >value/< number >((1<<bits)-1);
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
                return pSrc[0] | pSrc[1]<<8 | pSrc[2]<<16 | pSrc[3]<<32;
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






module akra.util {
	export class Singleton {
		constructor () {
			var _constructor = (<any>this).constructor;

			logger.setSourceLocation( "Singleton.ts" , 10 ); logger.assert(!isDef(_constructor._pInstance), 'Singleton class may be created only one time.');
                                                    ;

			_constructor._pInstance = this;
		}
	}
}



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

    export class Logger extends Singleton implements ILogger {
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
            super();

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
    logger = new Logger();

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

        console["warning"].apply(console, pArgs);
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







module akra.utils.test {

	var pTestCondList: ITestCond[] = [];

	function addCond(pCond: ITestCond): void {
		pTestCondList.unshift(pCond);
	}

	export interface ITestCond {
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

	class TrueCond extends TestCond implements ITestCond {
		constructor (sDescription: string) {
			super(sDescription);
		}

		verify(pArgv: any[]): bool {
			if (pArgv[0] === true) {
				return true;
			}
		}
	}

	function output(sText: string): void {
		document.body.innerHTML += sText;
	}

	export function check(...pArgv: any[]): void {
		var pTest: ITestCond = pTestCondList.pop();

		if (!pTest) {
			console.log((<any>(new Error)).stack);
			console.warn("chech() without condition...");
			return;
		}

		var bResult: bool = pTest.verify(pArgv);


		if (bResult) {
			output("<pre><span style=\"color: green;\">[ PASS ] </span>" + pTest.toString() + "</pre>");
		}
		else {
			output("<pre><span style=\"color: red;\">[ FAIL ] </span>" + pTest.toString() + "</pre>");
		}

	}

	export function failed(): void {
		var iTotal:  number  = pTestCondList.length;
		for (var i:  number  = 0; i < iTotal; ++ i) {
			check(false);
		}
	}

	export function shouldBeTrue(sDescription: string) {
		addCond(new TrueCond(sDescription));
	}

	export interface ITestManifest {
		name: string;
		main: () => void;
		description?: string;
	}

	export class Test {
		constructor (pManifest: ITestManifest) {
			Test.pTestList.push(pManifest);
		}

		static pTestList: ITestManifest[] = [];
		static run(): void {
			var pTestList = Test.pTestList;
			for (var i:  number  = 0; i < pTestList.length; ++ i) {
				var pTest: ITestManifest = pTestList[i];
				document.getElementById('test_name').innerHTML = ("<h2>" + pTest.name || "" + "</h2><hr />");
				pTest.main();
			};
		}
	}

	export function run(): void {
		Test.run();
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



module akra {
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










module akra {
	export interface ICanvasInfo {
		width:  number ;
		height:  number ;
		id: string;
	}
}












module akra {
	export interface IBrowserInfo {
		name: string;
		version: string;
		os: string;
	}
}






module akra.util {
	export interface IBrowserData {
		string: string;
		subString: string;
		identity: string;
		versionSearch?: string;
		prop?: string;
	}

	export class BrowserInfo extends Singleton implements IBrowserInfo {
		private sBrowser: string = null;
		private sVersion: string = null;
		private sOS: string = null;
		private sVersionSearch: string = null;

		get name(): string {
			return this.sBrowser;
		}

		get version(): string {
			return this.sVersion;
		}

		get os(): string {
			return this.sOS;
		}

		private init(): void {
			this.sBrowser = this.searchString(BrowserInfo.dataBrowser) || "An unknown browser";
			this.sVersion = this.searchVersion(navigator.userAgent)
								|| this.searchVersion(navigator.appVersion)
				|| "an unknown version";
			this.sOS = this.searchString(BrowserInfo.dataOS) || "an unknown OS";
		}

		private searchString(pDataBrowser: IBrowserData[]): string {
			for (var i: number  = 0; i < pDataBrowser.length; i++) {
				var sData:string = pDataBrowser[i].string;
				var dataProp:string = pDataBrowser[i].prop;

				this.sVersionSearch = pDataBrowser[i].versionSearch || pDataBrowser[i].identity;

				if (sData) {
					if (sData.indexOf(pDataBrowser[i].subString) != -1) {
						return pDataBrowser[i].identity;
					}
				}
				else if (dataProp) {
					return pDataBrowser[i].identity;
				}
			}
			return null;
		}

		private searchVersion(sData: string): string {
			var iStartIndex: number  = sData.indexOf(this.sVersionSearch);

			if (iStartIndex == -1) {
				return null;
			}

			iStartIndex = sData.indexOf('/', iStartIndex + 1);

			if (iStartIndex == -1) {
				return null;
			}

			var iEndIndex: number  = sData.indexOf(' ', iStartIndex + 1);

			if (iEndIndex == -1) {
				iEndIndex = sData.indexOf(';', iStartIndex + 1);
				if (iEndIndex == -1) {
					return null;
				}
				return sData.slice(iStartIndex + 1);
			}

			return sData.slice((iStartIndex + 1), iEndIndex);
		}

		static private dataBrowser: IBrowserData[] = [
			{
				string: navigator.userAgent,
				subString: "Chrome",
				identity: "Chrome"
			},
			{
				string: navigator.userAgent,
				subString: "OmniWeb",
				versionSearch: "OmniWeb/",
				identity: "OmniWeb"
			},
			{
				string: navigator.vendor,
				subString: "Apple",
				identity: "Safari",
				versionSearch: "Version"
			},
			{
				prop: window.opera,
				identity: "Opera",
				versionSearch: "Version"
			},
			{
				string: navigator.vendor,
				subString: "iCab",
				identity: "iCab"
			},
			{
				string: navigator.vendor,
				subString: "KDE",
				identity: "Konqueror"
			},
			{
				string: navigator.userAgent,
				subString: "Firefox",
				identity: "Firefox"
			},
			{
				string: navigator.vendor,
				subString: "Camino",
				identity: "Camino"
			},
			{
// for newer Netscapes (6+)
				string: navigator.userAgent,
				subString: "Netscape",
				identity: "Netscape"
			},
			{
				string: navigator.userAgent,
				subString: "MSIE",
				identity: "Explorer",
				versionSearch: "MSIE"
			},
			{
				string: navigator.userAgent,
				subString: "Gecko",
				identity: "Mozilla",
				versionSearch: "rv"
			},
			{
// for older Netscapes (4-)
				string: navigator.userAgent,
				subString: "Mozilla",
				identity: "Netscape",
				versionSearch: "Mozilla"
			}
		];

		static private dataOS: IBrowserData[] = [
			{
				string    : navigator.platform,
				subString : "Win",
				identity  : "Windows"
			},
			{
				string    : navigator.platform,
				subString : "Mac",
				identity  : "Mac"
			},
			{
				string    : navigator.userAgent,
				subString : "iPhone",
				identity  : "iPhone/iPod"
			},
			{
				string    : navigator.platform,
				subString : "Linux",
				identity  : "Linux"
			}
		];
	}
}











module akra {
	export interface IScreenInfo {
		width:  number ;
		height:  number ;
		aspect:  number ;
		pixelDepth:  number ;
		colorDepth:  number ;
	}
}



module akra.util {
	export class ScreenInfo implements IScreenInfo {
		get width():  number  {
			return screen.width;
		}

		get height():  number  {
			return screen.height;
		}

		get aspect():  number  {
			return screen.width / screen.height;
		}

		get pixelDepth():  number  {
			return screen.pixelDepth;
		}

		get colorDepth():  number  {
			return screen.colorDepth;
		}
	}
}










module akra {
	export interface IApiInfo {
		webGL: bool;
		webAudio: bool;
		file: bool;
		fileSystem: bool;
		webWorker: bool;
		transferableObjects: bool;
		localStorage: bool;
		webSocket: bool;
	}
}









// see: http://www.khronos.org/registry/webgl/specs/latest/

interface WebGLObject
{
};

interface WebGLBuffer extends WebGLObject
{
};

interface WebGLFramebuffer extends WebGLObject
{
};

interface WebGLProgram extends WebGLObject
{
};

interface WebGLRenderbuffer extends WebGLObject
{
};

interface WebGLShader extends WebGLObject
{
};

interface WebGLTexture extends WebGLObject
{
};

interface WebGLUniformLocation
{
};

interface WebGLActiveInfo
{
	size: number;
	type: number;
	name: string;
};

interface WebGLShaderPrecisionFormat
{
	rangeMin: number;
	rangeMax: number;
	precision: number;
};


interface WebGLContextAttributes
{
	alpha?: bool;
	depth?: bool;
	stencil?: bool;
	antialias?: bool;
	premultipliedAlpha?: bool;
	preserveDrawingBuffer?: bool;
};

interface WebGLRenderingContext
{
/* ClearBufferMask */

	DEPTH_BUFFER_BIT: number;
	STENCIL_BUFFER_BIT: number;
	COLOR_BUFFER_BIT: number;

/* BeginMode */

	POINTS: number;
	LINES: number;
	LINE_LOOP: number;
	LINE_STRIP: number;
	TRIANGLES: number;
	TRIANGLE_STRIP: number;
	TRIANGLE_FAN: number;

/* AlphaFunction (not supported in ES20) */

/*      NEVER */

/*      LESS */

/*      EQUAL */

/*      LEQUAL */

/*      GREATER */

/*      NOTEQUAL */

/*      GEQUAL */

/*      ALWAYS */


/* BlendingFactorDest */

	ZERO: number;
	ONE: number;
	SRC_COLOR: number;
	ONE_MINUS_SRC_COLOR: number;
	SRC_ALPHA: number;
	ONE_MINUS_SRC_ALPHA: number;
	DST_ALPHA: number;
	ONE_MINUS_DST_ALPHA: number;

/* BlendingFactorSrc */

/*      ZERO */

/*      ONE */

	DST_COLOR: number;
	ONE_MINUS_DST_COLOR: number;
	SRC_ALPHA_SATURATE: number;
/*      SRC_ALPHA */

/*      ONE_MINUS_SRC_ALPHA */

/*      DST_ALPHA */

/*      ONE_MINUS_DST_ALPHA */


/* BlendEquationSeparate */

	FUNC_ADD: number;
	BLEND_EQUATION: number;
	BLEND_EQUATION_RGB: number;
	BLEND_EQUATION_ALPHA: number;

/* BlendSubtract */

	FUNC_SUBTRACT: number;
	FUNC_REVERSE_SUBTRACT: number;

/* Separate Blend Functions */

	BLEND_DST_RGB: number;
	BLEND_SRC_RGB: number;
	BLEND_DST_ALPHA: number;
	BLEND_SRC_ALPHA: number;
	CONSTANT_COLOR: number;
	ONE_MINUS_CONSTANT_COLOR: number;
	CONSTANT_ALPHA: number;
	ONE_MINUS_CONSTANT_ALPHA: number;
	BLEND_COLOR: number;

/* Buffer Objects */

	ARRAY_BUFFER: number;
	ELEMENT_ARRAY_BUFFER: number;
	ARRAY_BUFFER_BINDING: number;
	ELEMENT_ARRAY_BUFFER_BINDING: number;

	STREAM_DRAW: number;
	STATIC_DRAW: number;
	DYNAMIC_DRAW: number;

	BUFFER_SIZE: number;
	BUFFER_USAGE: number;

	CURRENT_VERTEX_ATTRIB: number;

/* CullFaceMode */

	FRONT: number;
	BACK: number;
	FRONT_AND_BACK: number;

/* DepthFunction */

/*      NEVER */

/*      LESS */

/*      EQUAL */

/*      LEQUAL */

/*      GREATER */

/*      NOTEQUAL */

/*      GEQUAL */

/*      ALWAYS */


/* EnableCap */

/* TEXTURE_2D */

	CULL_FACE: number;
	BLEND: number;
	DITHER: number;
	STENCIL_TEST: number;
	DEPTH_TEST: number;
	SCISSOR_TEST: number;
	POLYGON_OFFSET_FILL: number;
	SAMPLE_ALPHA_TO_COVERAGE: number;
	SAMPLE_COVERAGE: number;

/* ErrorCode */

	NO_ERROR: number;
	INVALID_ENUM: number;
	INVALID_VALUE: number;
	INVALID_OPERATION: number;
	OUT_OF_MEMORY: number;

/* FrontFaceDirection */

	CW: number;
	CCW: number;

/* GetPName */

	LINE_WIDTH: number;
	ALIASED_POINT_SIZE_RANGE: number;
	ALIASED_LINE_WIDTH_RANGE: number;
	CULL_FACE_MODE: number;
	FRONT_FACE: number;
	DEPTH_RANGE: number;
	DEPTH_WRITEMASK: number;
	DEPTH_CLEAR_VALUE: number;
	DEPTH_FUNC: number;
	STENCIL_CLEAR_VALUE: number;
	STENCIL_FUNC: number;
	STENCIL_FAIL: number;
	STENCIL_PASS_DEPTH_FAIL: number;
	STENCIL_PASS_DEPTH_PASS: number;
	STENCIL_REF: number;
	STENCIL_VALUE_MASK: number;
	STENCIL_WRITEMASK: number;
	STENCIL_BACK_FUNC: number;
	STENCIL_BACK_FAIL: number;
	STENCIL_BACK_PASS_DEPTH_FAIL: number;
	STENCIL_BACK_PASS_DEPTH_PASS: number;
	STENCIL_BACK_REF: number;
	STENCIL_BACK_VALUE_MASK: number;
	STENCIL_BACK_WRITEMASK: number;
	VIEWPORT: number;
	SCISSOR_BOX: number;
/*      SCISSOR_TEST */

	COLOR_CLEAR_VALUE: number;
	COLOR_WRITEMASK: number;
	UNPACK_ALIGNMENT: number;
	PACK_ALIGNMENT: number;
	MAX_TEXTURE_SIZE: number;
	MAX_VIEWPORT_DIMS: number;
	SUBPIXEL_BITS: number;
	RED_BITS: number;
	GREEN_BITS: number;
	BLUE_BITS: number;
	ALPHA_BITS: number;
	DEPTH_BITS: number;
	STENCIL_BITS: number;
	POLYGON_OFFSET_UNITS: number;
/*      POLYGON_OFFSET_FILL */

	POLYGON_OFFSET_FACTOR: number;
	TEXTURE_BINDING_2D: number;
	SAMPLE_BUFFERS: number;
	SAMPLES: number;
	SAMPLE_COVERAGE_VALUE: number;
	SAMPLE_COVERAGE_INVERT: number;

/* GetTextureParameter */

/*      TEXTURE_MAG_FILTER */

/*      TEXTURE_MIN_FILTER */

/*      TEXTURE_WRAP_S */

/*      TEXTURE_WRAP_T */


	COMPRESSED_TEXTURE_FORMATS: number;

/* HintMode */

	DONT_CARE: number;
	FASTEST: number;
	NICEST: number;

/* HintTarget */

	GENERATE_MIPMAP_HINT: number;

/* DataType */

	BYTE: number;
	UNSIGNED_BYTE: number;
	SHORT: number;
	UNSIGNED_SHORT: number;
	INT: number;
	UNSIGNED_INT: number;
	FLOAT: number;

/* PixelFormat */

	DEPTH_COMPONENT: number;
	ALPHA: number;
	RGB: number;
	RGBA: number;
	LUMINANCE: number;
	LUMINANCE_ALPHA: number;

/* PixelType */

/*      UNSIGNED_BYTE */

	UNSIGNED_SHORT_4_4_4_4: number;
	UNSIGNED_SHORT_5_5_5_1: number;
	UNSIGNED_SHORT_5_6_5: number;

/* Shaders */

	FRAGMENT_SHADER: number;
	VERTEX_SHADER: number;
	MAX_VERTEX_ATTRIBS: number;
	MAX_VERTEX_UNIFORM_VECTORS: number;
	MAX_VARYING_VECTORS: number;
	MAX_COMBINED_TEXTURE_IMAGE_UNITS: number;
	MAX_VERTEX_TEXTURE_IMAGE_UNITS: number;
	MAX_TEXTURE_IMAGE_UNITS: number;
	MAX_FRAGMENT_UNIFORM_VECTORS: number;
	SHADER_TYPE: number;
	DELETE_STATUS: number;
	LINK_STATUS: number;
	VALIDATE_STATUS: number;
	ATTACHED_SHADERS: number;
	ACTIVE_UNIFORMS: number;
	ACTIVE_ATTRIBUTES: number;
	SHADING_LANGUAGE_VERSION: number;
	CURRENT_PROGRAM: number;

/* StencilFunction */

	NEVER: number;
	LESS: number;
	EQUAL: number;
	LEQUAL: number;
	GREATER: number;
	NOTEQUAL: number;
	GEQUAL: number;
	ALWAYS: number;

/* StencilOp */

/*      ZERO */

	KEEP: number;
	REPLACE: number;
	INCR: number;
	DECR: number;
	INVERT: number;
	INCR_WRAP: number;
	DECR_WRAP: number;

/* StringName */

	VENDOR: number;
	RENDERER: number;
	VERSION: number;

/* TextureMagFilter */

	NEAREST: number;
	LINEAR: number;

/* TextureMinFilter */

/*      NEAREST */

/*      LINEAR */

	NEAREST_MIPMAP_NEAREST: number;
	LINEAR_MIPMAP_NEAREST: number;
	NEAREST_MIPMAP_LINEAR: number;
	LINEAR_MIPMAP_LINEAR: number;

/* TextureParameterName */

	TEXTURE_MAG_FILTER: number;
	TEXTURE_MIN_FILTER: number;
	TEXTURE_WRAP_S: number;
	TEXTURE_WRAP_T: number;

/* TextureTarget */

	TEXTURE_2D: number;
	TEXTURE: number;

	TEXTURE_CUBE_MAP: number;
	TEXTURE_BINDING_CUBE_MAP: number;
	TEXTURE_CUBE_MAP_POSITIVE_X: number;
	TEXTURE_CUBE_MAP_NEGATIVE_X: number;
	TEXTURE_CUBE_MAP_POSITIVE_Y: number;
	TEXTURE_CUBE_MAP_NEGATIVE_Y: number;
	TEXTURE_CUBE_MAP_POSITIVE_Z: number;
	TEXTURE_CUBE_MAP_NEGATIVE_Z: number;
	MAX_CUBE_MAP_TEXTURE_SIZE: number;

/* TextureUnit */

	TEXTURE0: number;
	TEXTURE1: number;
	TEXTURE2: number;
	TEXTURE3: number;
	TEXTURE4: number;
	TEXTURE5: number;
	TEXTURE6: number;
	TEXTURE7: number;
	TEXTURE8: number;
	TEXTURE9: number;
	TEXTURE10: number;
	TEXTURE11: number;
	TEXTURE12: number;
	TEXTURE13: number;
	TEXTURE14: number;
	TEXTURE15: number;
	TEXTURE16: number;
	TEXTURE17: number;
	TEXTURE18: number;
	TEXTURE19: number;
	TEXTURE20: number;
	TEXTURE21: number;
	TEXTURE22: number;
	TEXTURE23: number;
	TEXTURE24: number;
	TEXTURE25: number;
	TEXTURE26: number;
	TEXTURE27: number;
	TEXTURE28: number;
	TEXTURE29: number;
	TEXTURE30: number;
	TEXTURE31: number;
	ACTIVE_TEXTURE: number;

/* TextureWrapMode */

	REPEAT: number;
	CLAMP_TO_EDGE: number;
	MIRRORED_REPEAT: number;

/* Uniform Types */

	FLOAT_VEC2: number;
	FLOAT_VEC3: number;
	FLOAT_VEC4: number;
	INT_VEC2: number;
	INT_VEC3: number;
	INT_VEC4: number;
	BOOL: number;
	BOOL_VEC2: number;
	BOOL_VEC3: number;
	BOOL_VEC4: number;
	FLOAT_MAT2: number;
	FLOAT_MAT3: number;
	FLOAT_MAT4: number;
	SAMPLER_2D: number;
	SAMPLER_CUBE: number;

/* Vertex Arrays */

	VERTEX_ATTRIB_ARRAY_ENABLED: number;
	VERTEX_ATTRIB_ARRAY_SIZE: number;
	VERTEX_ATTRIB_ARRAY_STRIDE: number;
	VERTEX_ATTRIB_ARRAY_TYPE: number;
	VERTEX_ATTRIB_ARRAY_NORMALIZED: number;
	VERTEX_ATTRIB_ARRAY_POINTER: number;
	VERTEX_ATTRIB_ARRAY_BUFFER_BINDING: number;

/* Shader Source */

	COMPILE_STATUS: number;

/* Shader Precision-Specified Types */

	LOW_FLOAT: number;
	MEDIUM_FLOAT: number;
	HIGH_FLOAT: number;
	LOW_INT: number;
	MEDIUM_INT: number;
	HIGH_INT: number;

/* Framebuffer Object. */

	FRAMEBUFFER: number;
	RENDERBUFFER: number;

	RGBA4: number;
	RGB5_A1: number;
	RGB565: number;
	DEPTH_COMPONENT16: number;
	STENCIL_INDEX: number;
	STENCIL_INDEX8: number;
	DEPTH_STENCIL: number;

	RENDERBUFFER_WIDTH: number;
	RENDERBUFFER_HEIGHT: number;
	RENDERBUFFER_INTERNAL_FORMAT: number;
	RENDERBUFFER_RED_SIZE: number;
	RENDERBUFFER_GREEN_SIZE: number;
	RENDERBUFFER_BLUE_SIZE: number;
	RENDERBUFFER_ALPHA_SIZE: number;
	RENDERBUFFER_DEPTH_SIZE: number;
	RENDERBUFFER_STENCIL_SIZE: number;

	FRAMEBUFFER_ATTACHMENT_OBJECT_TYPE: number;
	FRAMEBUFFER_ATTACHMENT_OBJECT_NAME: number;
	FRAMEBUFFER_ATTACHMENT_TEXTURE_LEVEL: number;
	FRAMEBUFFER_ATTACHMENT_TEXTURE_CUBE_MAP_FACE: number;

	COLOR_ATTACHMENT0: number;
	DEPTH_ATTACHMENT: number;
	STENCIL_ATTACHMENT: number;
	DEPTH_STENCIL_ATTACHMENT: number;

	NONE: number;

	FRAMEBUFFER_COMPLETE: number;
	FRAMEBUFFER_INCOMPLETE_ATTACHMENT: number;
	FRAMEBUFFER_INCOMPLETE_MISSING_ATTACHMENT: number;
	FRAMEBUFFER_INCOMPLETE_DIMENSIONS: number;
	FRAMEBUFFER_UNSUPPORTED: number;

	FRAMEBUFFER_BINDING: number;
	RENDERBUFFER_BINDING: number;
	MAX_RENDERBUFFER_SIZE: number;

	INVALID_FRAMEBUFFER_OPERATION: number;

/* WebGL-specific enums */

	UNPACK_FLIP_Y_WEBGL: number;
	UNPACK_PREMULTIPLY_ALPHA_WEBGL: number;
	CONTEXT_LOST_WEBGL: number;
	UNPACK_COLORSPACE_CONVERSION_WEBGL: number;
	BROWSER_DEFAULT_WEBGL: number;




	canvas: HTMLCanvasElement;
	drawingBufferWidth: number;
	drawingBufferHeight: number;

	getContextAttributes(): WebGLContextAttributes;
	isContextLost(): bool;

	getSupportedExtensions(): string[];
	getExtension(name: string): any;

	activeTexture(texture: number): void;
	attachShader(program: WebGLProgram, shader: WebGLShader): void;
	bindAttribLocation(program: WebGLProgram, index: number, name: string): void;
	bindBuffer(target: number, buffer: WebGLBuffer): void;
	bindFramebuffer(target: number, framebuffer: WebGLFramebuffer): void;
	bindRenderbuffer(target: number, renderbuffer: WebGLRenderbuffer): void;
	bindTexture(target: number, texture: WebGLTexture): void;
	blendColor(red: number, green: number, blue: number, alpha: number): void;
	blendEquation(mode: number): void;
	blendEquationSeparate(modeRGB: number, modeAlpha: number): void;
	blendFunc(sfactor: number, dfactor: number): void;
	blendFuncSeparate(srcRGB: number, dstRGB: number, srcAlpha: number, dstAlpha: number): void;

	bufferData(target: number, size: number, usage: number): void;
	bufferData(target: number, data: ArrayBufferView, usage: number): void;
	bufferData(target: number, data: ArrayBuffer, usage: number): void;
	bufferSubData(target: number, offset: number, data: ArrayBufferView): void;
	bufferSubData(target: number, offset: number, data: ArrayBuffer): void;

	checkFramebufferStatus(target: number): number;
	clear(mask: number): void;
	clearColor(red: number, green: number, blue: number, alpha: number): void;
	clearDepth(depth: number): void;
	clearStencil(s: number): void;
	colorMask(red: bool, green: bool, blue: bool, alpha: bool): void;
	compileShader(shader: WebGLShader): void;

	compressedTexImage2D(target: number, level: number, internalformat: number, width: number, height: number, border: number, data: ArrayBufferView): void;
	compressedTexSubImage2D(target: number, level: number, xoffset: number, yoffset: number, width: number, height: number, format: number, data: ArrayBufferView): void;

	copyTexImage2D(target: number, level: number, internalformat: number, x: number, y: number, width: number, height: number, border: number): void;
	copyTexSubImage2D(target: number, level: number, xoffset: number, yoffset: number, x: number, y: number, width: number, height: number): void;

	createBuffer(): WebGLBuffer;
	createFramebuffer(): WebGLFramebuffer;
	createProgram(): WebGLProgram;
	createRenderbuffer(): WebGLRenderbuffer;
	createShader(type: number): WebGLShader;
	createTexture(): WebGLTexture;

	cullFace(mode: number): void;

	deleteBuffer(buffer: WebGLBuffer): void;
	deleteFramebuffer(framebuffer: WebGLFramebuffer): void;
	deleteProgram(program: WebGLProgram): void;
	deleteRenderbuffer(renderbuffer: WebGLRenderbuffer): void;
	deleteShader(shader: WebGLShader): void;
	deleteTexture(texture: WebGLTexture): void;

	depthFunc(func: number): void;
	depthMask(flag: bool): void;
	depthRange(zNear: number, zFar: number): void;
	detachShader(program: WebGLProgram, shader: WebGLShader): void;
	disable(cap: number): void;
	disableVertexAttribArray(index: number): void;
	drawArrays(mode: number, first: number, count: number): void;
	drawElements(mode: number, count: number, type: number, offset: number): void;

	enable(cap: number): void;
	enableVertexAttribArray(index: number): void;
	finish(): void;
	flush(): void;
	framebufferRenderbuffer(target: number, attachment: number, renderbuffertarget: number, renderbuffer: WebGLRenderbuffer): void;
	framebufferTexture2D(target: number, attachment: number, textarget: number, texture: WebGLTexture, level: number): void;
	frontFace(mode: number): void;

	generateMipmap(target: number): void;

	getActiveAttrib(program: WebGLProgram, index: number): WebGLActiveInfo;
	getActiveUniform(program: WebGLProgram, index: number): WebGLActiveInfo;
	getAttachedShaders(program: WebGLProgram): WebGLShader[];

	getAttribLocation(program: WebGLProgram, name: string): number;

	getBufferParameter(target: number, pname: number): any;
	getParameter(pname: number): any;

	getError(): number;

	getFramebufferAttachmentParameter(target: number, attachment: number, pname: number): any;
	getProgramParameter(program: WebGLProgram, pname: number): any;
	getProgramInfoLog(program: WebGLProgram): string;
	getRenderbufferParameter(target: number, pname: number): any;
	getTranslatedShaderSource(shader: WebGLShader): string;
	getShaderParameter(shader: WebGLShader, pname: number): any;
	getShaderPrecisionFormat(shadertype: number, precisiontype: number): WebGLShaderPrecisionFormat;
	getShaderInfoLog(shader: WebGLShader): string;

	getShaderSource(shader: WebGLShader): string;

	getTexParameter(target: number, pname: number): any;

	getUniform(program: WebGLProgram, location: WebGLUniformLocation): any;

	getUniformLocation(program: WebGLProgram, name: string): WebGLUniformLocation;

	getVertexAttrib(index: number, pname: number): any;

	getVertexAttribOffset(index: number, pname: number): number;

	hint(target: number, mode: number): void;
	isBuffer(buffer: WebGLBuffer): bool;
	isEnabled(cap: number): bool;
	isFramebuffer(framebuffer: WebGLFramebuffer): bool;
	isProgram(program: WebGLProgram): bool;
	isRenderbuffer(renderbuffer: WebGLRenderbuffer): bool;
	isShader(shader: WebGLShader): bool;
	isTexture(texture: WebGLTexture): bool;
	lineWidth(width: number): void;
	linkProgram(program: WebGLProgram): void;
	pixelStorei(pname: number, param: number): void;
	polygonOffset(factor: number, units: number): void;

	readPixels(x: number, y: number, width: number, height: number, format: number, type: number, pixels: ArrayBufferView): void;

	renderbufferStorage(target: number, internalformat: number, width: number, height: number): void;
	sampleCoverage(value: number, invert: bool): void;
	scissor(x: number, y: number, width: number, height: number): void;

	shaderSource(shader: WebGLShader, source: string): void;

	stencilFunc(func: number, ref: number, mask: number): void;
	stencilFuncSeparate(face: number, func: number, ref: number, mask: number): void;
	stencilMask(mask: number): void;
	stencilMaskSeparate(face: number, mask: number): void;
	stencilOp(fail: number, zfail: number, zpass: number): void;
	stencilOpSeparate(face: number, fail: number, zfail: number, zpass: number): void;

	texImage2D(target: number, level: number, internalformat: number, width: number, height: number, border: number, format: number, type: number, pixels: ArrayBufferView): void;
	texImage2D(target: number, level: number, internalformat: number, format: number, type: number, pixels: ImageData): void;
// May throw DOMException	texImage2D(target: number, level: number, internalformat: number, format: number, type: number, image: HTMLImageElement): void;
// May throw DOMException	texImage2D(target: number, level: number, internalformat: number, format: number, type: number, canvas: HTMLCanvasElement): void;
// May throw DOMException	texImage2D(target: number, level: number, internalformat: number, format: number, type: number, video: HTMLVideoElement): void;

	texParameterf(target: number, pname: number, param: number): void;
	texParameteri(target: number, pname: number, param: number): void;

	texSubImage2D(target: number, level: number, xoffset: number, yoffset: number, width: number, height: number, format: number, type: number, pixels: ArrayBufferView): void;
	texSubImage2D(target: number, level: number, xoffset: number, yoffset: number, format: number, type: number, pixels: ImageData): void;
// May throw DOMException	texSubImage2D(target: number, level: number, xoffset: number, yoffset: number, format: number, type: number, image: HTMLImageElement): void;
// May throw DOMException	texSubImage2D(target: number, level: number, xoffset: number, yoffset: number, format: number, type: number, canvas: HTMLCanvasElement): void;
// May throw DOMException	texSubImage2D(target: number, level: number, xoffset: number, yoffset: number, format: number, type: number, video: HTMLVideoElement): void;

	uniform1f(location: WebGLUniformLocation, x: number): void;
	uniform1fv(location: WebGLUniformLocation, v: Float32Array): void;
	uniform1fv(location: WebGLUniformLocation, v: number[]): void;
	uniform1i(location: WebGLUniformLocation, x: number): void;
	uniform1iv(location: WebGLUniformLocation, v: Int32Array): void;
	uniform1iv(location: WebGLUniformLocation, v: number[]): void;
	uniform2f(location: WebGLUniformLocation, x: number, y: number): void;
	uniform2fv(location: WebGLUniformLocation, v: Float32Array): void;
	uniform2fv(location: WebGLUniformLocation, v: number[]): void;
	uniform2i(location: WebGLUniformLocation, x: number, y: number): void;
	uniform2iv(location: WebGLUniformLocation, v: Int32Array): void;
	uniform2iv(location: WebGLUniformLocation, v: number[]): void;
	uniform3f(location: WebGLUniformLocation, x: number, y: number, z: number): void;
	uniform3fv(location: WebGLUniformLocation, v: Float32Array): void;
	uniform3fv(location: WebGLUniformLocation, v: number[]): void;
	uniform3i(location: WebGLUniformLocation, x: number, y: number, z: number): void;
	uniform3iv(location: WebGLUniformLocation, v: Int32Array): void;
	uniform3iv(location: WebGLUniformLocation, v: number[]): void;
	uniform4f(location: WebGLUniformLocation, x: number, y: number, z: number, w: number): void;
	uniform4fv(location: WebGLUniformLocation, v: Float32Array): void;
	uniform4fv(location: WebGLUniformLocation, v: number[]): void;
	uniform4i(location: WebGLUniformLocation, x: number, y: number, z: number, w: number): void;
	uniform4iv(location: WebGLUniformLocation, v: Int32Array): void;
	uniform4iv(location: WebGLUniformLocation, v: number[]): void;

	uniformMatrix2fv(location: WebGLUniformLocation, transpose: bool, value: Float32Array): void;
	uniformMatrix2fv(location: WebGLUniformLocation, transpose: bool, value: number[]): void;
	uniformMatrix3fv(location: WebGLUniformLocation, transpose: bool, value: Float32Array): void;
	uniformMatrix3fv(location: WebGLUniformLocation, transpose: bool, value: number[]): void;
	uniformMatrix4fv(location: WebGLUniformLocation, transpose: bool, value: Float32Array): void;
	uniformMatrix4fv(location: WebGLUniformLocation, transpose: bool, value: number[]): void;

	useProgram(program: WebGLProgram): void;
	validateProgram(program: WebGLProgram): void;

	vertexAttrib1f(indx: number, x: number): void;
	vertexAttrib1fv(indx: number, values: Float32Array): void;
	vertexAttrib1fv(indx: number, value: number[]): void;
	vertexAttrib2f(indx: number, x: number, y: number): void;
	vertexAttrib2fv(indx: number, values: Float32Array): void;
	vertexAttrib2fv(indx: number, value: number[]): void;
	vertexAttrib3f(indx: number, x: number, y: number, z: number): void;
	vertexAttrib3fv(indx: number, values: Float32Array): void;
	vertexAttrib3fv(indx: number, value: number[]): void;
	vertexAttrib4f(indx: number, x: number, y: number, z: number, w: number): void;
	vertexAttrib4fv(indx: number, values: Float32Array): void;
	vertexAttrib4fv(indx: number, value: number[]): void;
	vertexAttribPointer(indx: number, size: number, type: number, normalized: bool, stride: number, offset: number): void;

	viewport(x: number, y: number, width: number, height: number): void;
};

interface CanvasRenderingContext {

}

interface WebGLRenderingContext extends CanvasRenderingContext {

}



declare var WebGLRenderingContext: {
    prototype: WebGLRenderingContext;
    new(): WebGLRenderingContext;
}

interface HTMLCanvasElement extends HTMLElement {
    getContext(contextId: string, args?: WebGLContextAttributes): WebGLRenderingContext;
}

interface WEBGL_debug_shaders {
      getTranslatedShaderSource(shader: WebGLShader): DOMString;
};

interface WEBGL_debug_renderer_info {
    UNMASKED_VENDOR_WEBGL: number;
    UNMASKED_RENDERER_WEBGL: number;
};

interface WEBGL_compressed_texture_pvrtc {
/* Compressed Texture Formats */

    COMPRESSED_RGB_PVRTC_4BPPV1_IMG: number;
    COMPRESSED_RGB_PVRTC_2BPPV1_IMG: number;
    COMPRESSED_RGBA_PVRTC_4BPPV1_IMG: number;
    COMPRESSED_RGBA_PVRTC_2BPPV1_IMG: number;
};

interface WEBGL_compressed_texture_atc {
/* Compressed Texture Formats */

    COMPRESSED_RGB_ATC_WEBGL: number;
    COMPRESSED_RGBA_ATC_EXPLICIT_ALPHA_WEBGL: number;
    COMPRESSED_RGBA_ATC_INTERPOLATED_ALPHA_WEBGL: number;
};

interface WEBGL_compressed_texture_s3tc {
/* Compressed Texture Formats */

    COMPRESSED_RGB_S3TC_DXT1_EXT : number;
    COMPRESSED_RGBA_S3TC_DXT1_EXT: number;
    COMPRESSED_RGBA_S3TC_DXT3_EXT: number;
    COMPRESSED_RGBA_S3TC_DXT5_EXT: number;
};

interface WEBGL_depth_texture {
  UNSIGNED_INT_24_8_WEBGL: number;
};

interface OES_element_index_uint {
};

interface WebGLVertexArrayObjectOES extends WebGLObject {
};

interface OES_vertex_array_object {
    VERTEX_ARRAY_BINDING_OES: number;

    createVertexArrayOES(): WebGLVertexArrayObjectOES;
    deleteVertexArrayOES(arrayObject: WebGLVertexArrayObjectOES): void;
    isVertexArrayOES(arrayObject: WebGLVertexArrayObjectOES): bool;
    bindVertexArrayOES(arrayObject: WebGLVertexArrayObjectOES): void;
};

interface OES_standard_derivatives {
    FRAGMENT_SHADER_DERIVATIVE_HINT_OES: number;
};

interface OES_texture_half_float {
 	HALF_FLOAT_OES: number;
};

interface OES_texture_float {
};

interface WEBGL_lose_context {
      loseContext(): void;
      restoreContext(): void;
};

interface WEBGL_multiple_render_targets {
    COLOR_ATTACHMENT0_WEBGL: number;
    COLOR_ATTACHMENT1_WEBGL: number;
    COLOR_ATTACHMENT2_WEBGL: number;
    COLOR_ATTACHMENT3_WEBGL: number;
    COLOR_ATTACHMENT4_WEBGL: number;
    COLOR_ATTACHMENT5_WEBGL: number;
    COLOR_ATTACHMENT6_WEBGL: number;
    COLOR_ATTACHMENT7_WEBGL: number;
    COLOR_ATTACHMENT8_WEBGL: number;
    COLOR_ATTACHMENT9_WEBGL: number;
    COLOR_ATTACHMENT10_WEBGL: number;
    COLOR_ATTACHMENT11_WEBGL: number;
    COLOR_ATTACHMENT12_WEBGL: number;
    COLOR_ATTACHMENT13_WEBGL: number;
    COLOR_ATTACHMENT14_WEBGL: number;
    COLOR_ATTACHMENT15_WEBGL: number;

    DRAW_BUFFER0_WEBGL: number;
    DRAW_BUFFER1_WEBGL: number;
    DRAW_BUFFER2_WEBGL: number;
    DRAW_BUFFER3_WEBGL: number;
    DRAW_BUFFER4_WEBGL: number;
    DRAW_BUFFER5_WEBGL: number;
    DRAW_BUFFER6_WEBGL: number;
    DRAW_BUFFER7_WEBGL: number;
    DRAW_BUFFER8_WEBGL: number;
    DRAW_BUFFER9_WEBGL: number;
    DRAW_BUFFER10_WEBGL: number;
    DRAW_BUFFER11_WEBGL: number;
    DRAW_BUFFER12_WEBGL: number;
    DRAW_BUFFER13_WEBGL: number;
    DRAW_BUFFER14_WEBGL: number;
    DRAW_BUFFER15_WEBGL: number;

    MAX_COLOR_ATTACHMENTS_WEBGL: number;
    MAX_DRAW_BUFFERS_WEBGL: number;

    drawBuffersWEBGL(buffers: number[]): void;
};

interface WEBGL_fbo_color_attachments {
    COLOR_ATTACHMENT0: number;
    COLOR_ATTACHMENT1: number;
    COLOR_ATTACHMENT2: number;
    COLOR_ATTACHMENT3: number;
    COLOR_ATTACHMENT4: number;
    COLOR_ATTACHMENT5: number;
    COLOR_ATTACHMENT6: number;
    COLOR_ATTACHMENT7: number;
    COLOR_ATTACHMENT8: number;
    COLOR_ATTACHMENT9: number;
    COLOR_ATTACHMENT10: number;
    COLOR_ATTACHMENT11: number;
    COLOR_ATTACHMENT12: number;
    COLOR_ATTACHMENT13: number;
    COLOR_ATTACHMENT14: number;
    COLOR_ATTACHMENT15: number;

    MAX_COLOR_ATTACHMENTS: number;
};

/* ClearBufferMask */





/* BeginMode */









/* AlphaFunction (not supported in ES20) */

/*      NEVER */

/*      LESS */

/*      EQUAL */

/*      LEQUAL */

/*      GREATER */

/*      NOTEQUAL */

/*      GEQUAL */

/*      ALWAYS */


/* BlendingFactorDest */










/* BlendingFactorSrc */

/*      ZERO */

/*      ONE */




/*      SRC_ALPHA */

/*      ONE_MINUS_SRC_ALPHA */

/*      DST_ALPHA */

/*      ONE_MINUS_DST_ALPHA */


/* BlendEquationSeparate */



/* same as BLEND_EQUATION */



/* BlendSubtract */




/* Separate Blend Functions */











/* Buffer Objects */















/* CullFaceMode */





/* DepthFunction */

/*      NEVER */

/*      LESS */

/*      EQUAL */

/*      LEQUAL */

/*      GREATER */

/*      NOTEQUAL */

/*      GEQUAL */

/*      ALWAYS */


/* EnableCap */

/* TEXTURE_2D */











/* ErrorCode */







/* FrontFaceDirection */




/* GetPName */



























/*      SCISSOR_TEST */















/*      POLYGON_OFFSET_FILL */








/* GetTextureParameter */

/*      TEXTURE_MAG_FILTER */

/*      TEXTURE_MIN_FILTER */

/*      TEXTURE_WRAP_S */

/*      TEXTURE_WRAP_T */




/* HintMode */





/* HintTarget */



/* DataType */










/* PixelFormat */










/* PixelType */

/*      UNSIGNED_BYTE */





/* Shaders */




















/* StencilFunction */










/* StencilOp */

/*      ZERO */









/* StringName */





/* TextureMagFilter */




/* TextureMinFilter */

/*      NEAREST */

/*      LINEAR */






/* TextureParameterName */






/* TextureTarget */














/* TextureUnit */



































/* TextureWrapMode */





/* Uniform Types */

















/* Vertex Arrays */









/* Shader Source */



/* Shader Precision-Specified Types */








/* Framebuffer Object. */














































/* WebGL-specific enums */





























//WebGL Extensions 










//draft









//Future













module akra {
	export enum EPixelFormats {
/*Unknown pixel format.*/
        UNKNOWN = 0,

/*8-bit pixel format, all bits luminance.*/
        L8 = 1,
        BYTE_L = L8,
/*16-bit pixel format, all bits luminance.*/
        L16 = 2,
        SHORT_L = L16,
/*8-bit pixel format, all bits alpha.*/
        A8 = 3,
        BYTE_A = A8,
/*8-bit pixel format, 4 bits alpha, 4 bits luminance.*/
        A4L4 = 4,
/*2 byte pixel format, 1 byte luminance, 1 byte alpha*/
        BYTE_LA = 5,

/*16-bit pixel format, 5 bits red, 6 bits green, 5 bits blue.*/
        R5G6B5 = 6,
/*16-bit pixel format, 5 bits red, 6 bits green, 5 bits blue.*/
        B5G6R5 = 7,
/*8-bit pixel format, 2 bits blue, 3 bits green, 3 bits red.*/
        R3G3B2 = 31,
/*16-bit pixel format, 4 bits for alpha, red, green and blue.*/
        A4R4G4B4 = 8,
/*16-bit pixel format, 5 bits for blue, green, red and 1 for alpha.*/
        A1R5G5B5 = 9,
/*24-bit pixel format, 8 bits for red, green and blue.*/
        R8G8B8 = 10,
/*24-bit pixel format, 8 bits for blue, green and red.*/
        B8G8R8 = 11,
/*32-bit pixel format, 8 bits for alpha, red, green and blue.*/
        A8R8G8B8 = 12,
/*32-bit pixel format, 8 bits for blue, green, red and alpha.*/
        A8B8G8R8 = 13,
/*32-bit pixel format, 8 bits for blue, green, red and alpha.*/
        B8G8R8A8 = 14,
/*32-bit pixel format, 8 bits for red, green, blue and alpha.*/
        R8G8B8A8 = 28,

/*32-bit pixel format, 8 bits for red, 8 bits for green, 8 bits for blue like A8R8G8B8, but alpha will get discarded*/
        X8R8G8B8 = 26,
/*32-bit pixel format, 8 bits for blue, 8 bits for green, 8 bits for red like A8B8G8R8, but alpha will get discarded*/
        X8B8G8R8 = 27,

/*3 byte pixel format, 1 byte for red, 1 byte for green, 1 byte for blue*/
        BYTE_RGB = R8G8B8,
/*3 byte pixel format, 1 byte for blue, 1 byte for green, 1 byte for red*/
        BYTE_BGR = B8G8R8,
/*4 byte pixel format, 1 byte for blue, 1 byte for green, 1 byte for red and one byte for alpha*/
        BYTE_BGRA = B8G8R8A8,
/*4 byte pixel format, 1 byte for red, 1 byte for green, 1 byte for blue, and one byte for alpha*/
        BYTE_RGBA = R8G8B8A8,

/*32-bit pixel format, 2 bits for alpha, 10 bits for red, green and blue.*/
        A2R10G10B10 = 15,
/*32-bit pixel format, 10 bits for blue, green and red, 2 bits for alpha.*/
        A2B10G10R10 = 16,

/*DDS (DirectDraw Surface) DXT1 format.*/
        DXT1 = 17,
/*DDS (DirectDraw Surface) DXT2 format.*/
        DXT2 = 18,
/*DDS (DirectDraw Surface) DXT3 format.*/
        DXT3 = 19,
/*DDS (DirectDraw Surface) DXT4 format.*/
        DXT4 = 20,
/*DDS (DirectDraw Surface) DXT5 format.*/
        DXT5 = 21,

/*16-bit pixel format, 16 bits (float) for red*/
        FLOAT16_R = 32,
/*48-bit pixel format, 16 bits (float) for red, 16 bits (float) for green, 16 bits (float) for blue*/
        FLOAT16_RGB = 22,
/*64-bit pixel format, 16 bits (float) for red, 16 bits (float) for green, 16 bits (float) for blue, 16 bits (float) for alpha*/
        FLOAT16_RGBA = 23,
/*32-bit pixel format, 32 bits (float) for red*/
        FLOAT32_R = 33,
/*96-bit pixel format, 32 bits (float) for red, 32 bits (float) for green, 32 bits (float) for blue*/
        FLOAT32_RGB = 24,
/*128-bit pixel format, 32 bits (float) for red, 32 bits (float) for green, 32 bits (float) for blue, 32 bits (float) for alpha*/
        FLOAT32_RGBA = 25,
/*32-bit, 2-channel s10e5 floating point pixel format, 16-bit green, 16-bit red*/
        FLOAT16_GR = 35,
/*64-bit, 2-channel floating point pixel format, 32-bit green, 32-bit red*/
        FLOAT32_GR = 36,

/*Float Depth texture format*/
        DEPTH = 29,
/*Byte Depth texture format */
        DEPTH_BYTE = 44,

/*64-bit pixel format, 16 bits for red, green, blue and alpha*/
        SHORT_RGBA = 30,
/*32-bit pixel format, 16-bit green, 16-bit red*/
        SHORT_GR = 34,
/*48-bit pixel format, 16 bits for red, green and blue*/
        SHORT_RGB = 37,

/*PVRTC (PowerVR) RGB 2 bpp.*/
        PVRTC_RGB2 = 38,
/*PVRTC (PowerVR) RGBA 2 bpp.*/
        PVRTC_RGBA2 = 39,
/*PVRTC (PowerVR) RGB 4 bpp.*/
        PVRTC_RGB4 = 40,
/*PVRTC (PowerVR) RGBA 4 bpp.*/
        PVRTC_RGBA4 = 41,

/*8-bit pixel format, all bits red.*/
        R8 = 42,
/*16-bit pixel format, 8 bits red, 8 bits green.*/
        RG8 = 43,
        TOTAL = 45
    };

    export interface PixelFormatList {
    	[index:  number ]: EPixelFormats;
    }


/**
     * Flags defining some on/off properties of pixel formats
     */

    export enum  EPixelFormatFlags {
// This format has an alpha channel
        HASALPHA        = 0x00000001,
// This format is compressed. This invalidates the values in elemBytes,
// elemBits and the bit counts as these might not be fixed in a compressed format.
        COMPRESSED    = 0x00000002,
// This is a floating point format
        FLOAT           = 0x00000004,
// This is a depth format (for depth textures)
        DEPTH           = 0x00000008,
// Format is in native endian. Generally true for the 16, 24 and 32 bits
// formats which can be represented as machine integers.
        NATIVEENDIAN    = 0x00000010,
// This is an intensity format instead of a RGB one. The luminance
// replaces R,G and B. (but not A)
        LUMINANCE       = 0x00000020
    }

/** Pixel component format */

    export enum EPixelComponentTypes
    {
/*Byte per component (8 bit fixed 0.0..1.0)*/
        BYTE = 0,
/*Short per component (16 bit fixed 0.0..1.0))*/
        SHORT = 1,
/*16 bit float per component*/
        FLOAT16 = 2,
/*32 bit float per component*/
        FLOAT32 = 3,
/*Number of pixel types*/
        COUNT = 4
    };

    export enum EFilters {
        NEAREST,
        LINEAR,
        BILINEAR,
        BOX,
        TRIANGLE,
        BICUBIC
    };
}






module akra {
	export interface IBox {
		width:  number ;
		height:  number ;
		depth:  number ;

		left:  number ;
		top:  number ;
		right:  number ;
		bottom:  number ;
		front:  number ;
		back:  number ;

		contains(pDest: IBox): bool;
	}
}




module akra {
	export interface IColor {} ;

	export interface IPixelBox extends IBox {
		format: EPixelFormats;
		data: Uint8Array;
		rowPitch:  number ;
		slicePitch:  number ;

		setConsecutive(): void;

		getRowSkip():  number ;
		getSliceSkip():  number ;

		isConsecutive(): bool;
		getConsecutiveSize():  number ;

		getSubBox(pDest: IBox): IPixelBox;
		getColorAt(x:  number , y:  number , z?:  number ): IColor;
		setColorAt(pColor: IColor, x:  number , y:  number , z?:  number ): void;

		scale(pDest: IPixelBox, eFilter?: EFilters): bool;
	}
}















module akra {
	export interface IBuffer {
//number of elements
		 length:  number ;

//size in bytes
		 byteLength:  number ;


	}
}



module akra {

	export enum EHardwareBufferFlags {
		STATIC 		= 0x01,
		DYNAMIC 	= 0x02,
		STREAM 		= 0x80,

		READABLE	= 0x04,

		BACKUP_COPY = 0x08,
/** indicate, that buffer does not use GPU memory or other specific memory. */

		SOFTWARE 	= 0x10,
/** Indicate, tha buffer uses specific data aligment */

		ALIGNMENT	= 0x20,
/** Indicates that the application will be refilling the contents
            of the buffer regularly (not just updating, but generating the
            contents from scratch), and therefore does not mind if the contents 
            of the buffer are lost somehow and need to be recreated. This
            allows and additional level of optimisation on the buffer.
            This option only really makes sense when combined with 
            DYNAMIC and without READING.
            */

		DISCARDABLE = 0x40,

		STATIC_READABLE = STATIC | READABLE,
		DYNAMIC_DISCARDABLE = DYNAMIC | DISCARDABLE
	}

	export enum ELockFlags {
		READ 			= 0x01,
		WRITE 			= 0x02,
		DISCARD 		= 0x04,
		NO_OVERWRITE	= 0x08,

		NORMAL			= READ | WRITE
	}

	export interface IHardwareBuffer extends IBuffer {
		clone(pSrc: IHardwareBuffer): bool;

		isValid(): bool;
		isDynamic(): bool;
		isStatic(): bool;
		isStream(): bool;
		isReadable(): bool;
		isBackupPresent(): bool;
		isSoftware(): bool;
		isAligned(): bool;
		isLocked(): bool;

		getFlags():  number ;

		readData(ppDest: ArrayBufferView): bool;
		readData(iOffset:  number , iSize:  number , ppDest: ArrayBufferView): bool;

		writeData(pData: Uint8Array, iOffset?:  number , iSize?:  number , bDiscardWholeBuffer?: bool): bool;
		writeData(pData: ArrayBuffer, iOffset?:  number , iSize?:  number , bDiscardWholeBuffer?: bool): bool;


		copyData(pSrcBuffer: IHardwareBuffer, iSrcOffset:  number ,
				 iDstOffset:  number , iSize:  number , bDiscardWholeBuffer?: bool): bool;

		create(iFlags:  number ): bool;
// create(iByteSize: uint, iFlags: int, pData: Uint8Array): bool;
// create(iByteSize: uint, iFlags: int, pData: ArrayBuffer): bool;

		destroy(): void;

		resize(iSize:  number ): bool;

		lock(iLockFlags:  number ): any;
		lock(iOffset:  number , iSize:  number , iLockFlags?:  number ): any;
		unlock(): void;

		restoreFromBackup(): bool;
	}
}

















module akra {

	export interface IVec2Constructor {
        ();
        (fValue:  number );
        (v2fVec: IVec2);
        (pArray:  number []);
        (fValue1:  number , fValue2:  number );
    }


	export interface IVec2 {
		x:  number ;
		y:  number ;


/*represents two-component vector from original vector*/

xx: IVec2;
/*represents two-component vector from original vector*/

xy: IVec2;
/*represents two-component vector from original vector*/

yx: IVec2;
/*represents two-component vector from original vector*/

yy: IVec2;

		set(): IVec2;
		set(fValue:  number ): IVec2;
		set(v2fVec: IVec2): IVec2;
		set(pArray:  number []): IVec2;
		set(fValue1:  number , fValue2:  number ): IVec2;

		clear(): IVec2;

		add(v2fVec: IVec2, v2fDestination?: IVec2): IVec2;
		subtract(v2fVec: IVec2, v2fDestination?: IVec2): IVec2;
		dot(v2fVec: IVec2):  number ;

		isEqual(v2fVec: IVec2, fEps?:  number ): bool;
		isClear(fEps?:  number ): bool;

		negate(v2fDestination?: IVec2): IVec2;
		scale(fScale:  number , v2fDestination?: IVec2): IVec2;
		normalize(v2fDestination?: IVec2): IVec2;
		length():  number ;
		lengthSquare():  number ;


		direction(v2fVec: IVec2, v2fDestination?: IVec2): IVec2;

		mix(v2fVec: IVec2, fA:  number , v2fDestination?: IVec2): IVec2;

		toString(): string;
	};
};



module akra.math {

    export class Vec2 implements IVec2{
        x:  number  = 0.;
        y:  number  = 0.;



get xx(): IVec2{
	return vec2(this.x, this.x);
};
set xx(v2fVec: IVec2){
	this.x = v2fVec.x; 	this.x = v2fVec.y;
};

get xy(): IVec2{
	return vec2(this.x, this.y);
};
set xy(v2fVec: IVec2){
	this.x = v2fVec.x; 	this.y = v2fVec.y;
};

get yx(): IVec2{
	return vec2(this.y, this.x);
};
set yx(v2fVec: IVec2){
	this.y = v2fVec.x; 	this.x = v2fVec.y;
};

get yy(): IVec2{
	return vec2(this.y, this.y);
};
set yy(v2fVec: IVec2){
	this.y = v2fVec.x; 	this.y = v2fVec.y;
};

        constructor();
        constructor(fValue:  number );
        constructor(v2fVec: IVec2);
        constructor(pArray:  number []);
        constructor(fValue1:  number , fValue2:  number );
        constructor(fValue1?, fValue2?){
            var nArgumentsLength:  number  = arguments.length;

            var v2fVec: IVec2 = this;

// if (<any>this === window || <any>this === akra || <any>this === akra.math) {
//     v2fVec = Vec2.stack[Vec2.stackPosition ++];

//     if(Vec2.stackPosition == Vec2.stackSize){
//         Vec2.stackPosition = 0;
//     }
// }

            switch(nArgumentsLength){
                case 1:
                    v2fVec.set(arguments[0]);
                    break;
                case 2:
                    v2fVec.set(arguments[0], arguments[1]);
                    break;
                default:
                    v2fVec.x = v2fVec.y = 0.;
                    break;
            }

        };

        set(): IVec2;
        set(fValue:  number ): IVec2;
        set(v2fVec: IVec2): IVec2;
        set(pArray:  number []): IVec2;
        set(fValue1:  number , fValue2:  number ): IVec2;
        set(fValue1?, fValue2?): IVec2{
            var nArgumentsLength:  number  = arguments.length;

            switch(nArgumentsLength){
                case 0:
                    this.x = this.y = 0.;
                    break;
                case 1:
                    if(isFloat(arguments[0])){
                        this.x = this.y = arguments[0];
                    }
                    else if(arguments[0] instanceof Vec2){
                        var v2fVec: IVec2 = arguments[0];

                        this.x = v2fVec.x;
                        this.y = v2fVec.y;
                    }
                    else{
                        var pArray:  number [] = arguments[0];

                        this.x = pArray[0];
                        this.y = pArray[1];
                    }
                    break;
                case 2:
                    this.x = arguments[0];
                    this.y = arguments[1];
                    break;
            };

            return this;
        };

        /**@inline*/  clear(): IVec2{
            this.x = this.y = 0.;
            return this;
        };

        add(v2fVec: IVec2, v2fDestination?: IVec2): IVec2{
            if(!isDef(v2fDestination)){
                v2fDestination = this;
            }

            v2fDestination.x = this.x + v2fVec.x;
            v2fDestination.y = this.y + v2fVec.y;

            return v2fDestination;
        };

        subtract(v2fVec: IVec2, v2fDestination?: IVec2): IVec2{
            if(!isDef(v2fDestination)){
                v2fDestination = this;
            }

            v2fDestination.x = this.x - v2fVec.x;
            v2fDestination.y = this.y - v2fVec.y;

            return v2fDestination;
        };

        /**@inline*/  dot(v2fVec: IVec2):  number {
            return this.x*v2fVec.x + this.y*v2fVec.y;
        };

        isEqual(v2fVec: IVec2, fEps:  number  = 0.): bool{
            if(fEps === 0.){
                if(    this.x != v2fVec.x
                    || this.y != v2fVec.y){

                    return false;
                }
            }
            else{
                if(    abs(this.x - v2fVec.x) > fEps
                    || abs(this.y - v2fVec.y) > fEps){

                    return false;
                }
            }

            return true;
        };

        isClear(fEps:  number  = 0.): bool{
            if(fEps === 0.){
                if(    this.x != 0.
                    || this.y != 0.){

                    return false;
                }
            }
            else{
                if(    abs(this.x) > fEps
                    || abs(this.y) > fEps){

                    return false;
                }
            }

            return true;
        };

        negate(v2fDestination?: IVec2): IVec2{
            if(!isDef(v2fDestination)){
                v2fDestination = this;
            }

            v2fDestination.x = -this.x;
            v2fDestination.y = -this.y;

            return v2fDestination;
        };

        scale(fScale:  number , v2fDestination?: IVec2): IVec2{
            if(!isDef(v2fDestination)){
                v2fDestination = this;
            }

            v2fDestination.x = this.x*fScale;
            v2fDestination.y = this.y*fScale;

            return v2fDestination;
        };

        normalize(v2fDestination?: IVec2): IVec2{
            if(!isDef(v2fDestination)){
                v2fDestination = this;
            }

            var x:  number  = this.x, y:  number  = this.y;
            var fLength:  number  = sqrt(x*x + y*y);

            if(fLength !== 0.){
                var fInvLength:  number  = 1./fLength;

                x *= fInvLength;
                y *= fInvLength;
            }

            v2fDestination.x = x;
            v2fDestination.y = y;

            return v2fDestination;
        };

        /**@inline*/  length():  number {
            var x:  number  = this.x, y:  number  = this.y;
            return sqrt(x*x + y*y);
        };

        /**@inline*/  lengthSquare():  number {
            var x:  number  = this.x, y:  number  = this.y;
            return x*x + y*y;
        };

        direction(v2fVec: IVec2, v2fDestination?: IVec2): IVec2{
            if(!isDef(v2fDestination)){
                v2fDestination = this;
            }

            var x:  number  = v2fVec.x - this.x;
            var y:  number  = v2fVec.y - this.y;

            var fLength:  number  = sqrt(x*x + y*y);

            if(fLength !== 0.){
                var fInvLength:  number  = 1./fLength;

                x *= fInvLength;
                y *= fInvLength;
            }

            v2fDestination.x = x;
            v2fDestination.y = y;

            return v2fDestination;
        };

        mix(v2fVec: IVec2, fA:  number , v2fDestination?: IVec2): IVec2{
            if(!isDef(v2fDestination)){
                v2fDestination = this;
            }

            fA = clamp(fA,0.,1.);

            var fA1:  number  = 1. - fA;
            var fA2:  number  = fA;

            v2fDestination.x = fA1*this.x + fA2*v2fVec.x;
            v2fDestination.y = fA1*this.y + fA2*v2fVec.y;

            return v2fDestination;
        };

        /**@inline*/  toString(): string{
            return "[x: " + this.x + ", y: " + this.y + "]";
        };

        static get stackCeil(): Vec2 { Vec2.stackPosition = Vec2.stackPosition === Vec2.stackSize - 1? 0: Vec2.stackPosition; return Vec2.stack[Vec2.stackPosition ++]; } static stackSize: number = 100; static stackPosition: number = 0; static stack: Vec2[] = (function(): Vec2[]{ var pStack: Vec2[] = new Array(Vec2.stackSize); for(var i: number = 0; i<Vec2.stackSize; i++){ pStack[i] = new Vec2(); } return pStack})();
   }
}












module akra {

	export interface IVec2 {} ;
	export interface IMat4 {} ;

	export interface IVec3Constructor {
        ();
        (fValue:  number );
        (v3fVec: IVec3);
        (pArray:  number []);
        (fValue:  number , v2fVec: IVec2);
        (v2fVec: IVec2, fValue:  number );
        (fValue1:  number , fValue2:  number , fValue3:  number );
    }


	export interface IVec3 {
		x:  number ;
		y:  number ;
		z:  number ;


/*represents two-component vector from original vector*/

xx: IVec2;
/*represents two-component vector from original vector*/

xy: IVec2;
/*represents two-component vector from original vector*/

xz: IVec2;
/*represents two-component vector from original vector*/

yx: IVec2;
/*represents two-component vector from original vector*/

yy: IVec2;
/*represents two-component vector from original vector*/

yz: IVec2;
/*represents two-component vector from original vector*/

zx: IVec2;
/*represents two-component vector from original vector*/

zy: IVec2;
/*represents two-component vector from original vector*/

zz: IVec2;

/*represents three-component vector from original vector*/

xxx: IVec3;
/*represents three-component vector from original vector*/

xxy: IVec3;
/*represents three-component vector from original vector*/

xxz: IVec3;
/*represents three-component vector from original vector*/

xyx: IVec3;
/*represents three-component vector from original vector*/

xyy: IVec3;
/*represents three-component vector from original vector*/

xyz: IVec3;
/*represents three-component vector from original vector*/

xzx: IVec3;
/*represents three-component vector from original vector*/

xzy: IVec3;
/*represents three-component vector from original vector*/

xzz: IVec3;
/*represents three-component vector from original vector*/

yxx: IVec3;
/*represents three-component vector from original vector*/

yxy: IVec3;
/*represents three-component vector from original vector*/

yxz: IVec3;
/*represents three-component vector from original vector*/

yyx: IVec3;
/*represents three-component vector from original vector*/

yyy: IVec3;
/*represents three-component vector from original vector*/

yyz: IVec3;
/*represents three-component vector from original vector*/

yzx: IVec3;
/*represents three-component vector from original vector*/

yzy: IVec3;
/*represents three-component vector from original vector*/

yzz: IVec3;
/*represents three-component vector from original vector*/

zxx: IVec3;
/*represents three-component vector from original vector*/

zxy: IVec3;
/*represents three-component vector from original vector*/

zxz: IVec3;
/*represents three-component vector from original vector*/

zyx: IVec3;
/*represents three-component vector from original vector*/

zyy: IVec3;
/*represents three-component vector from original vector*/

zyz: IVec3;
/*represents three-component vector from original vector*/

zzx: IVec3;
/*represents three-component vector from original vector*/

zzy: IVec3;
/*represents three-component vector from original vector*/

zzz: IVec3;

		set(): IVec3;
		set(fValue:  number ): IVec3;
		set(v3fVec: IVec3): IVec3;
		set(pArray:  number []): IVec3;
		set(fValue:  number , v2fVec: IVec2): IVec3;
		set(v2fVec: IVec2, fValue:  number ): IVec3;
		set(fValue1:  number , fValue2:  number , fValue3:  number ): IVec3;

		clear(): IVec3;

		add(v3fVec: IVec3, v3fDestination?: IVec3): IVec3;
		subtract(v3fVec: IVec3, v3fDestination?: IVec3): IVec3;
		dot(v3fVec: IVec3):  number ;
		cross(v3fVec: IVec3, v3fDestination?: IVec3): IVec3;

		isEqual(v3fVec: IVec3, fEps?:  number ): bool;
		isClear(fEps?:  number ): bool;

		negate(v3fDestination?: IVec3): IVec3;
		scale(fScale:  number , v3fDestination?: IVec3): IVec3;
		scale(v3fScale: IVec3, v3fDestination?: IVec3): IVec3;
		normalize(v3fDestination?: IVec3): IVec3;
		length():  number ;
		lengthSquare():  number ;

		direction(v3fVec: IVec3, v3fDestination?: IVec3): IVec3;

		mix(v3fVec: IVec3, fA:  number , v3fDestination?: IVec3): IVec3;

		toString(): string;
		toTranslationMatrix(m4fDestination?: IMat4);

		vec3TransformCoord(m4fTransformation: IMat4, v3fDestination?: IVec3): IVec3;
	};
};






/**
 * @important Если внезапно задумаем перейти обратно на 
 * хранение данных в матрицах по строкам, как собственно и было в начале,
 * то необходимо раскомментить definы и переписать метод set, 
 * так как он ложит по столбцам
 */


// #define __11 0
// #define __12 1
// #define __13 2
// #define __14 3
// #define __21 4
// #define __22 5
// #define __23 6
// #define __24 7
// #define __31 8
// #define __32 9
// #define __33 10
// #define __34 11
// #define __41 12
// #define __42 13
// #define __43 14
// #define __44 15


















module akra {

	export interface IVec3 {} ;
	export interface IVec4 {} ;
	export interface IMat3 {} ;
	export interface IQuat4 {} ;

	export interface IMat4Constructor {
		();
		(fValue:  number );
		(v4fVec: IVec4);
		(m4fMat: IMat4);
		(pArray:  number []);
		(m3fMat: IMat3, v3fTranslation?: IVec3);
		(pArray: Float32Array, bFlag: bool);
		(fValue1:  number , fValue2:  number , fValue3:  number , fValue4:  number );
		(v4fVec1: IVec4, v4fVec2: IVec4, v4fVec3: IVec4, v4fVec4: IVec4);
		(pArray1:  number [], pArray2:  number [], pArray3:  number [], pArray4:  number []);
		(fValue1:  number , fValue2:  number , fValue3:  number , fValue4:  number ,
				fValue5:  number , fValue6:  number , fValue7:  number , fValue8:  number ,
				fValue9:  number , fValue10:  number , fValue11:  number , fValue12:  number ,
				fValue13:  number , fValue14:  number , fValue15:  number , fValue16:  number );
	}

	export interface IMat4 {
		data: Float32Array;

		set(): IMat4;
		set(fValue:  number ): IMat4;
		set(v4fVec: IVec4): IMat4;
		set(m3fMat: IMat3, v3fTranslation?: IVec3): IMat4;
		set(m4fMat: IMat4): IMat4;
		set(pArray:  number []): IMat4;
		set(fValue1:  number , fValue2:  number ,
			fValue3:  number , fValue4:  number ): IMat4;
		set(v4fVec1: IVec4, v4fVec2: IVec4,
			v4fVec3: IVec4, v4fVec4: IVec4): IMat4;
		set(pArray1:  number [], pArray2:  number [],
			pArray3:  number [], pArray4:  number []): IMat4;
		set(fValue1:  number , fValue2:  number , fValue3:  number , fValue4:  number ,
			fValue5:  number , fValue6:  number , fValue7:  number , fValue8:  number ,
			fValue9:  number , fValue10:  number , fValue11:  number , fValue12:  number ,
			fValue13:  number , fValue14:  number , fValue15:  number , fValue16:  number ): IMat4;

		identity(): IMat4;

		add(m4fMat: IMat4, m4fDestination?: IMat4): IMat4;
		subtract(m4fMat: IMat4, m4fDestination?: IMat4): IMat4;
		multiply(m4fMat: IMat4, m4fDestination?: IMat4): IMat4;
		multiplyLeft(m4fMat: IMat4, m4fDestination?: IMat4): IMat4;
		multiplyVec4(v4fVec: IVec4, v4fDestination?: IVec4): IVec4;

		transpose(m4fDestination?: IMat4): IMat4;
		determinant():  number ;
		inverse(m4fDestination?: IMat4): IMat4;
		trace():  number ;

		isEqual(m4fMat: IMat4, fEps?:  number ): bool;
		isDiagonal(fEps?:  number ): bool;

		toMat3(m3fDestination?: IMat3): IMat3;
		toQuat4(q4fDestination?: IQuat4): IQuat4;
		toRotationMatrix(m4fDestination?: IMat4): IMat4;
		toString(): string;

		rotateRight(fAngle:  number , v3fAxis: IVec3, m4fDestination?: IMat4): IMat4;
		rotateLeft(fAngle:  number , v3fAxis: IVec3, m4fDestination?: IMat4): IMat4;

//rotateXRight(fAngle: float, m4fDestination?: IMat4): IMat4;
//rotateXLeft(fAngle: float, m4fDestination?: IMat4): IMat4;
//rotateYRight(fAngle: float, m4fDestination?: IMat4): IMat4;
//rotateYLeft(fAngle: float, m4fDestination?: IMat4): IMat4;
//rotateZRight(fAngle: float, m4fDestination?: IMat4): IMat4;
//rotateZLeft(fAngle: float, m4fDestination?: IMat4): IMat4;

		setTranslation(v3fTranslation: IVec3): IMat4;
		getTranslation(v3fTranslation?: IVec3): IVec3;

		translateRight(v3fTranslation: IVec3, m4fDestination?: IMat4): IMat4;
		translateLeft(v3fTranslation: IVec3, m4fDestination?: IMat4): IMat4;

		scaleRight(v3fScale: IVec3, m4fDestination?: IMat4): IMat4;
		scaleLeft(v3fScale: IVec3, m4fDestination?: IMat4): IMat4;

		decompose(q4fRotation: IQuat4, v3fScale: IVec3, v3fTranslation: IVec3): bool;

		row(iRow:  number , v4fDestination?: IVec4): IVec4;
		column(iColumn:  number , v4fDestination?: IVec4): IVec4;

/*v3fScreen - coordinates in screen space from -1 to 1
		* returns vec4(wsCoord,1.), where wsCoord - coordinates in world space
		* use with projection matrix only
		*/

		unproj(v3fScreen: IVec3, v4fDestination?: IVec4): IVec4;
		unproj(v4fScreen: IVec4, v4fDestination?: IVec4): IVec4;
	};
};



module akra.math {

    export class Vec3 {
        x:  number ;
        y:  number ;
        z:  number ;


get xx(): IVec2{
	return vec2(this.x, this.x);
};
set xx(v2fVec: IVec2){
	this.x = v2fVec.x; 	this.x = v2fVec.y;
};

get xy(): IVec2{
	return vec2(this.x, this.y);
};
set xy(v2fVec: IVec2){
	this.x = v2fVec.x; 	this.y = v2fVec.y;
};

get xz(): IVec2{
	return vec2(this.x, this.z);
};
set xz(v2fVec: IVec2){
	this.x = v2fVec.x; 	this.z = v2fVec.y;
};

get yx(): IVec2{
	return vec2(this.y, this.x);
};
set yx(v2fVec: IVec2){
	this.y = v2fVec.x; 	this.x = v2fVec.y;
};

get yy(): IVec2{
	return vec2(this.y, this.y);
};
set yy(v2fVec: IVec2){
	this.y = v2fVec.x; 	this.y = v2fVec.y;
};

get yz(): IVec2{
	return vec2(this.y, this.z);
};
set yz(v2fVec: IVec2){
	this.y = v2fVec.x; 	this.z = v2fVec.y;
};

get zx(): IVec2{
	return vec2(this.z, this.x);
};
set zx(v2fVec: IVec2){
	this.z = v2fVec.x; 	this.x = v2fVec.y;
};

get zy(): IVec2{
	return vec2(this.z, this.y);
};
set zy(v2fVec: IVec2){
	this.z = v2fVec.x; 	this.y = v2fVec.y;
};

get zz(): IVec2{
	return vec2(this.z, this.z);
};
set zz(v2fVec: IVec2){
	this.z = v2fVec.x; 	this.z = v2fVec.y;
};


get xxx(): IVec3{
	return vec3(this.x, this.x, this.x);
};
set xxx(v3fVec: IVec3){
	this.x = v3fVec.x; 	this.x = v3fVec.y; 	this.x = v3fVec.z;
};

get xxy(): IVec3{
	return vec3(this.x, this.x, this.y);
};
set xxy(v3fVec: IVec3){
	this.x = v3fVec.x; 	this.x = v3fVec.y; 	this.y = v3fVec.z;
};

get xxz(): IVec3{
	return vec3(this.x, this.x, this.z);
};
set xxz(v3fVec: IVec3){
	this.x = v3fVec.x; 	this.x = v3fVec.y; 	this.z = v3fVec.z;
};

get xyx(): IVec3{
	return vec3(this.x, this.y, this.x);
};
set xyx(v3fVec: IVec3){
	this.x = v3fVec.x; 	this.y = v3fVec.y; 	this.x = v3fVec.z;
};

get xyy(): IVec3{
	return vec3(this.x, this.y, this.y);
};
set xyy(v3fVec: IVec3){
	this.x = v3fVec.x; 	this.y = v3fVec.y; 	this.y = v3fVec.z;
};

get xyz(): IVec3{
	return vec3(this.x, this.y, this.z);
};
set xyz(v3fVec: IVec3){
	this.x = v3fVec.x; 	this.y = v3fVec.y; 	this.z = v3fVec.z;
};

get xzx(): IVec3{
	return vec3(this.x, this.z, this.x);
};
set xzx(v3fVec: IVec3){
	this.x = v3fVec.x; 	this.z = v3fVec.y; 	this.x = v3fVec.z;
};

get xzy(): IVec3{
	return vec3(this.x, this.z, this.y);
};
set xzy(v3fVec: IVec3){
	this.x = v3fVec.x; 	this.z = v3fVec.y; 	this.y = v3fVec.z;
};

get xzz(): IVec3{
	return vec3(this.x, this.z, this.z);
};
set xzz(v3fVec: IVec3){
	this.x = v3fVec.x; 	this.z = v3fVec.y; 	this.z = v3fVec.z;
};

get yxx(): IVec3{
	return vec3(this.y, this.x, this.x);
};
set yxx(v3fVec: IVec3){
	this.y = v3fVec.x; 	this.x = v3fVec.y; 	this.x = v3fVec.z;
};

get yxy(): IVec3{
	return vec3(this.y, this.x, this.y);
};
set yxy(v3fVec: IVec3){
	this.y = v3fVec.x; 	this.x = v3fVec.y; 	this.y = v3fVec.z;
};

get yxz(): IVec3{
	return vec3(this.y, this.x, this.z);
};
set yxz(v3fVec: IVec3){
	this.y = v3fVec.x; 	this.x = v3fVec.y; 	this.z = v3fVec.z;
};

get yyx(): IVec3{
	return vec3(this.y, this.y, this.x);
};
set yyx(v3fVec: IVec3){
	this.y = v3fVec.x; 	this.y = v3fVec.y; 	this.x = v3fVec.z;
};

get yyy(): IVec3{
	return vec3(this.y, this.y, this.y);
};
set yyy(v3fVec: IVec3){
	this.y = v3fVec.x; 	this.y = v3fVec.y; 	this.y = v3fVec.z;
};

get yyz(): IVec3{
	return vec3(this.y, this.y, this.z);
};
set yyz(v3fVec: IVec3){
	this.y = v3fVec.x; 	this.y = v3fVec.y; 	this.z = v3fVec.z;
};

get yzx(): IVec3{
	return vec3(this.y, this.z, this.x);
};
set yzx(v3fVec: IVec3){
	this.y = v3fVec.x; 	this.z = v3fVec.y; 	this.x = v3fVec.z;
};

get yzy(): IVec3{
	return vec3(this.y, this.z, this.y);
};
set yzy(v3fVec: IVec3){
	this.y = v3fVec.x; 	this.z = v3fVec.y; 	this.y = v3fVec.z;
};

get yzz(): IVec3{
	return vec3(this.y, this.z, this.z);
};
set yzz(v3fVec: IVec3){
	this.y = v3fVec.x; 	this.z = v3fVec.y; 	this.z = v3fVec.z;
};

get zxx(): IVec3{
	return vec3(this.z, this.x, this.x);
};
set zxx(v3fVec: IVec3){
	this.z = v3fVec.x; 	this.x = v3fVec.y; 	this.x = v3fVec.z;
};

get zxy(): IVec3{
	return vec3(this.z, this.x, this.y);
};
set zxy(v3fVec: IVec3){
	this.z = v3fVec.x; 	this.x = v3fVec.y; 	this.y = v3fVec.z;
};

get zxz(): IVec3{
	return vec3(this.z, this.x, this.z);
};
set zxz(v3fVec: IVec3){
	this.z = v3fVec.x; 	this.x = v3fVec.y; 	this.z = v3fVec.z;
};

get zyx(): IVec3{
	return vec3(this.z, this.y, this.x);
};
set zyx(v3fVec: IVec3){
	this.z = v3fVec.x; 	this.y = v3fVec.y; 	this.x = v3fVec.z;
};

get zyy(): IVec3{
	return vec3(this.z, this.y, this.y);
};
set zyy(v3fVec: IVec3){
	this.z = v3fVec.x; 	this.y = v3fVec.y; 	this.y = v3fVec.z;
};

get zyz(): IVec3{
	return vec3(this.z, this.y, this.z);
};
set zyz(v3fVec: IVec3){
	this.z = v3fVec.x; 	this.y = v3fVec.y; 	this.z = v3fVec.z;
};

get zzx(): IVec3{
	return vec3(this.z, this.z, this.x);
};
set zzx(v3fVec: IVec3){
	this.z = v3fVec.x; 	this.z = v3fVec.y; 	this.x = v3fVec.z;
};

get zzy(): IVec3{
	return vec3(this.z, this.z, this.y);
};
set zzy(v3fVec: IVec3){
	this.z = v3fVec.x; 	this.z = v3fVec.y; 	this.y = v3fVec.z;
};

get zzz(): IVec3{
	return vec3(this.z, this.z, this.z);
};
set zzz(v3fVec: IVec3){
	this.z = v3fVec.x; 	this.z = v3fVec.y; 	this.z = v3fVec.z;
};

        constructor();
        constructor(fValue:  number );
        constructor(v3fVec: IVec3);
        constructor(pArray:  number []);
        constructor(fValue:  number , v2fVec: IVec2);
        constructor(v2fVec: IVec2, fValue:  number );
        constructor(fValue1:  number , fValue2:  number , fValue3:  number );
        constructor(fValue1?, fValue2?, fValue3?){
            var nArgumentsLength:  number  = arguments.length;


            switch(nArgumentsLength){
                case 1:
                    this.set(arguments[0]);
                    break;
                case 2:
                    this.set(arguments[0], arguments[1]);
                    break;
                case 3:
                    this.set(arguments[0], arguments[1], arguments[2]);
                    break;
                default:
                    this.x = this.y = this.z = 0.;
                    break;
            }
        };

        set(): IVec3;
        set(fValue:  number ): IVec3;
        set(v3fVec: IVec3): IVec3;
        set(pArray:  number []): IVec3;
        set(fValue:  number , v2fVec: IVec2): IVec3;
        set(v2fVec: IVec2, fValue:  number ): IVec3;
        set(fValue1:  number , fValue2:  number , fValue3:  number ): IVec3;
        set(fValue1?, fValue2?, fValue3?): IVec3{
            var nArgumentsLength = arguments.length;

            switch(nArgumentsLength){
                case 0:
                    this.x = this.y = this.z = 0.;
                    break;
                case 1:
                    if(isFloat(arguments[0])){
                        this.x = this.y = this.z = arguments[0];
                    }
                    else if(arguments[0] instanceof Vec3){
                        var v3fVec: IVec3 = arguments[0];

                        this.x = v3fVec.x;
                        this.y = v3fVec.y;
                        this.z = v3fVec.z;
                    }
                    else{
                        var pArray:  number [] = arguments[0];

                        this.x = pArray[0];
                        this.y = pArray[1];
                        this.z = pArray[2];
                    }
                    break;
                case 2:
                    if(isFloat(arguments[0])){
                        var fValue:  number  = arguments[0];
                        var v2fVec: IVec2 = arguments[1];

                        this.x = fValue;
                        this.y = v2fVec.x;
                        this.z = v2fVec.y;
                    }
                    else{
                        var v2fVec: IVec2 = arguments[0];
                        var fValue:  number  = arguments[1];

                        this.x = v2fVec.x;
                        this.y = v2fVec.y;
                        this.z = fValue;
                    }
                    break;
                case 3:
                    this.x = arguments[0];
                    this.y = arguments[1];
                    this.z = arguments[2];
                    break;
            }

            return this;
        };

        /**@inline*/  clear(): IVec3{
            this.x = this.y = this.z = 0.;
            return this;
        };


        add(v3fVec: IVec3, v3fDestination?: IVec3): IVec3{
            if(!isDef(v3fDestination)){
                v3fDestination = this;
            }

            v3fDestination.x = this.x + v3fVec.x;
            v3fDestination.y = this.y + v3fVec.y;
            v3fDestination.z = this.z + v3fVec.z;

            return v3fDestination;
        };


        subtract(v3fVec: IVec3, v3fDestination?: IVec3): IVec3{
            if(!isDef(v3fDestination)){
                v3fDestination = this;
            }

            v3fDestination.x = this.x - v3fVec.x;
            v3fDestination.y = this.y - v3fVec.y;
            v3fDestination.z = this.z - v3fVec.z;

            return v3fDestination;
        };

        /**@inline*/  dot(v3fVec: IVec3):  number {
            return this.x*v3fVec.x + this.y*v3fVec.y + this.z*v3fVec.z;
        };


        cross(v3fVec: IVec3, v3fDestination?: IVec3): IVec3{
            if(!isDef(v3fDestination)){
                v3fDestination = this;
            }

            var x1:  number  = this.x, y1:  number  = this.y, z1:  number  = this.z;
            var x2:  number  = v3fVec.x, y2:  number  = v3fVec.y, z2:  number  = v3fVec.z;

            v3fDestination.x = y1*z2 - z1*y2;
            v3fDestination.y = z1*x2 - x1*z2;
            v3fDestination.z = x1*y2 - y1*x2;

            return v3fDestination;
        };

        isEqual(v3fVec: IVec3, fEps:  number  = 0.): bool{
            if(fEps === 0.){
                if(    this.x != v3fVec.x
                    || this.y != v3fVec.y
                    || this.z != v3fVec.z){

                    return false;
                }
            }
            else{
                if(    abs(this.x - v3fVec.x) > fEps
                    || abs(this.y - v3fVec.y) > fEps
                    || abs(this.z - v3fVec.z) > fEps){

                    return false;
                }
            }
            return true;
        };


        isClear(fEps:  number  = 0.): bool{
            if(fEps === 0.){
                if(    this.x != 0.
                    || this.y != 0.
                    || this.z != 0.) {

                    return false;
                }
            }
            else{
                if(    abs(this.x) > fEps
                    || abs(this.y) > fEps
                    || abs(this.z) > fEps){

                    return false;
                }
            }

            return true;
        };

        negate(v3fDestination?: IVec3): IVec3{
            if(!isDef(v3fDestination)){
                v3fDestination = this;
            }

            v3fDestination.x = -this.x;
            v3fDestination.y = -this.y;
            v3fDestination.z = -this.z;

            return v3fDestination;
        };

        scale(v3fScale: IVec3, v3fDestination?: IVec3): IVec3;
        scale(fScale:  number , v3fDestination?: IVec3): IVec3;
        scale(fScale?, v3fDestination?): IVec3{
            if(!isDef(v3fDestination)){
                v3fDestination = this;
            }

            if(isNumber(arguments[0])){
                var fScale:  number  = arguments[0];
                v3fDestination.x = this.x*fScale;
                v3fDestination.y = this.y*fScale;
                v3fDestination.z = this.z*fScale;
            }
            else{
                var v3fScale: IVec3 = arguments[0];
                v3fDestination.x = this.x*v3fScale.x;
                v3fDestination.y = this.y*v3fScale.y;
                v3fDestination.z = this.z*v3fScale.z;
            }

            return v3fDestination;
        };

        normalize(v3fDestination?: IVec3): IVec3{
            if(!v3fDestination){
                v3fDestination = this;
            }

            var x:  number  = this.x, y:  number  = this.y, z:  number  = this.z;
            var fLength:  number  = sqrt(x*x + y*y + z*z);

            if(fLength !== 0.){
                var fInvLength:  number  = 1./fLength;

                x *= fInvLength;
                y *= fInvLength;
                z *= fInvLength;
            }

            v3fDestination.x = x;
            v3fDestination.y = y;
            v3fDestination.z = z;

            return v3fDestination;
        };

        /**@inline*/  length():  number {
            var x:  number  = this.x, y:  number  = this.y, z:  number  = this.z;
            return sqrt(x*x + y*y + z*z);
        };

        /**@inline*/  lengthSquare():  number {
            var x:  number  = this.x, y:  number  = this.y, z:  number  = this.z;
            return x*x + y*y + z*z;
        };

        direction(v3fVec: IVec3, v3fDestination?: IVec3): IVec3{
            if(!isDef(v3fDestination)){
                v3fDestination = this;
            }

            var x:  number  = v3fVec.x - this.x;
            var y:  number  = v3fVec.y - this.y;
            var z:  number  = v3fVec.z - this.z;

            var fLength:  number  = sqrt(x*x + y*y + z*z);

            if(fLength !== 0.){
                var fInvLength = 1./fLength;

                x *= fInvLength;
                y *= fInvLength;
                z *= fInvLength;
            }

            v3fDestination.x = x;
            v3fDestination.y = y;
            v3fDestination.z = z;

            return v3fDestination;
        };

        mix(v3fVec: IVec3, fA:  number , v3fDestination?: IVec3): IVec3{
           if(!isDef(v3fDestination)){
                v3fDestination = this;
            }

            fA = clamp(fA,0.,1.);

            var fA1:  number  = 1. - fA;
            var fA2:  number  = fA;

            v3fDestination.x = fA1*this.x + fA2*v3fVec.x;
            v3fDestination.y = fA1*this.y + fA2*v3fVec.y;
            v3fDestination.z = fA1*this.z + fA2*v3fVec.z;

            return v3fDestination;
        };

        /**@inline*/  toString(): string{
            return "[x: " + this.x + " ,y: " + this.y + ", z: " + this.z + "]";
        };

        toTranslationMatrix(m4fDestination?: IMat4): IMat4{
            if(!isDef(m4fDestination)){
                m4fDestination = new Mat4(1.);
            }
            else{
                m4fDestination.set(1.);
            }

            var pData: Float32Array = m4fDestination.data;

            pData[ 12 ] = this.x;
            pData[ 13 ] = this.y;
            pData[ 14 ] = this.z;

            return m4fDestination;
        };

        vec3TransformCoord(m4fTransformation: IMat4, v3fDestination?: IVec3): IVec3{
            if(!v3fDestination){
                v3fDestination = this;
            }

            var pData: Float32Array = m4fTransformation.data;

            var x:  number  = this.x;
            var y:  number  = this.y;
            var z:  number  = this.z;
            var w:  number ;

            x = pData[ 0 ]*x + pData[ 4 ]*y + pData[ 8 ]*z + pData[ 12 ];
            y = pData[ 1 ]*x + pData[ 5 ]*y + pData[ 9 ]*z + pData[ 13 ];
            z = pData[ 2 ]*x + pData[ 6 ]*y + pData[ 10 ]*z + pData[ 14 ];
            w = pData[ 2 ]*x + pData[ 7 ]*y + pData[ 11 ]*z + pData[ 15 ];

            var fInvW:  number  = 1./w;

            v3fDestination.x = x*fInvW;
            v3fDestination.y = y*fInvW;
            v3fDestination.z = z*fInvW;

            return v3fDestination;
        };

        static get stackCeil(): Vec3 { Vec3.stackPosition = Vec3.stackPosition === Vec3.stackSize - 1? 0: Vec3.stackPosition; return Vec3.stack[Vec3.stackPosition ++]; } static stackSize: number = 100; static stackPosition: number = 0; static stack: Vec3[] = (function(): Vec3[]{ var pStack: Vec3[] = new Array(Vec3.stackSize); for(var i: number = 0; i<Vec3.stackSize; i++){ pStack[i] = new Vec3(); } return pStack})();

/*get xy(): Vec2  { return new Vec2(this.x, this.y); }
        get xz(): Vec2  { return new Vec2(this.x, this.z); }
        get yx(): Vec2  { return new Vec2(this.y, this.x); }
        get yz(): Vec2  { return new Vec2(this.y, this.z); }
        get zx(): Vec2  { return new Vec2(this.z, this.x); }
        get zy(): Vec2  { return new Vec2(this.z, this.y); }
        get xyz(): Vec3 { return new Vec3(this.x, this.y, this.z); }*/

    }
}











module akra.math {

    export class Vec4 implements IVec4{
        x:  number ;
        y:  number ;
        z:  number ;
        w:  number ;


get xx(): IVec2{
	return vec2(this.x, this.x);
};
set xx(v2fVec: IVec2){
	this.x = v2fVec.x; 	this.x = v2fVec.y;
};

get xy(): IVec2{
	return vec2(this.x, this.y);
};
set xy(v2fVec: IVec2){
	this.x = v2fVec.x; 	this.y = v2fVec.y;
};

get xz(): IVec2{
	return vec2(this.x, this.z);
};
set xz(v2fVec: IVec2){
	this.x = v2fVec.x; 	this.z = v2fVec.y;
};

get xw(): IVec2{
	return vec2(this.x, this.w);
};
set xw(v2fVec: IVec2){
	this.x = v2fVec.x; 	this.w = v2fVec.y;
};

get yx(): IVec2{
	return vec2(this.y, this.x);
};
set yx(v2fVec: IVec2){
	this.y = v2fVec.x; 	this.x = v2fVec.y;
};

get yy(): IVec2{
	return vec2(this.y, this.y);
};
set yy(v2fVec: IVec2){
	this.y = v2fVec.x; 	this.y = v2fVec.y;
};

get yz(): IVec2{
	return vec2(this.y, this.z);
};
set yz(v2fVec: IVec2){
	this.y = v2fVec.x; 	this.z = v2fVec.y;
};

get yw(): IVec2{
	return vec2(this.y, this.w);
};
set yw(v2fVec: IVec2){
	this.y = v2fVec.x; 	this.w = v2fVec.y;
};

get zx(): IVec2{
	return vec2(this.z, this.x);
};
set zx(v2fVec: IVec2){
	this.z = v2fVec.x; 	this.x = v2fVec.y;
};

get zy(): IVec2{
	return vec2(this.z, this.y);
};
set zy(v2fVec: IVec2){
	this.z = v2fVec.x; 	this.y = v2fVec.y;
};

get zz(): IVec2{
	return vec2(this.z, this.z);
};
set zz(v2fVec: IVec2){
	this.z = v2fVec.x; 	this.z = v2fVec.y;
};

get zw(): IVec2{
	return vec2(this.z, this.w);
};
set zw(v2fVec: IVec2){
	this.z = v2fVec.x; 	this.w = v2fVec.y;
};

get wx(): IVec2{
	return vec2(this.w, this.x);
};
set wx(v2fVec: IVec2){
	this.w = v2fVec.x; 	this.x = v2fVec.y;
};

get wy(): IVec2{
	return vec2(this.w, this.y);
};
set wy(v2fVec: IVec2){
	this.w = v2fVec.x; 	this.y = v2fVec.y;
};

get wz(): IVec2{
	return vec2(this.w, this.z);
};
set wz(v2fVec: IVec2){
	this.w = v2fVec.x; 	this.z = v2fVec.y;
};

get ww(): IVec2{
	return vec2(this.w, this.w);
};
set ww(v2fVec: IVec2){
	this.w = v2fVec.x; 	this.w = v2fVec.y;
};


get xxx(): IVec3{
	return vec3(this.x, this.x, this.x);
};
set xxx(v3fVec: IVec3){
	this.x = v3fVec.x; 	this.x = v3fVec.y; 	this.x = v3fVec.z;
};

get xxy(): IVec3{
	return vec3(this.x, this.x, this.y);
};
set xxy(v3fVec: IVec3){
	this.x = v3fVec.x; 	this.x = v3fVec.y; 	this.y = v3fVec.z;
};

get xxz(): IVec3{
	return vec3(this.x, this.x, this.z);
};
set xxz(v3fVec: IVec3){
	this.x = v3fVec.x; 	this.x = v3fVec.y; 	this.z = v3fVec.z;
};

get xxw(): IVec3{
	return vec3(this.x, this.x, this.w);
};
set xxw(v3fVec: IVec3){
	this.x = v3fVec.x; 	this.x = v3fVec.y; 	this.w = v3fVec.z;
};

get xyx(): IVec3{
	return vec3(this.x, this.y, this.x);
};
set xyx(v3fVec: IVec3){
	this.x = v3fVec.x; 	this.y = v3fVec.y; 	this.x = v3fVec.z;
};

get xyy(): IVec3{
	return vec3(this.x, this.y, this.y);
};
set xyy(v3fVec: IVec3){
	this.x = v3fVec.x; 	this.y = v3fVec.y; 	this.y = v3fVec.z;
};

get xyz(): IVec3{
	return vec3(this.x, this.y, this.z);
};
set xyz(v3fVec: IVec3){
	this.x = v3fVec.x; 	this.y = v3fVec.y; 	this.z = v3fVec.z;
};

get xyw(): IVec3{
	return vec3(this.x, this.y, this.w);
};
set xyw(v3fVec: IVec3){
	this.x = v3fVec.x; 	this.y = v3fVec.y; 	this.w = v3fVec.z;
};

get xzx(): IVec3{
	return vec3(this.x, this.z, this.x);
};
set xzx(v3fVec: IVec3){
	this.x = v3fVec.x; 	this.z = v3fVec.y; 	this.x = v3fVec.z;
};

get xzy(): IVec3{
	return vec3(this.x, this.z, this.y);
};
set xzy(v3fVec: IVec3){
	this.x = v3fVec.x; 	this.z = v3fVec.y; 	this.y = v3fVec.z;
};

get xzz(): IVec3{
	return vec3(this.x, this.z, this.z);
};
set xzz(v3fVec: IVec3){
	this.x = v3fVec.x; 	this.z = v3fVec.y; 	this.z = v3fVec.z;
};

get xzw(): IVec3{
	return vec3(this.x, this.z, this.w);
};
set xzw(v3fVec: IVec3){
	this.x = v3fVec.x; 	this.z = v3fVec.y; 	this.w = v3fVec.z;
};

get xwx(): IVec3{
	return vec3(this.x, this.w, this.x);
};
set xwx(v3fVec: IVec3){
	this.x = v3fVec.x; 	this.w = v3fVec.y; 	this.x = v3fVec.z;
};

get xwy(): IVec3{
	return vec3(this.x, this.w, this.y);
};
set xwy(v3fVec: IVec3){
	this.x = v3fVec.x; 	this.w = v3fVec.y; 	this.y = v3fVec.z;
};

get xwz(): IVec3{
	return vec3(this.x, this.w, this.z);
};
set xwz(v3fVec: IVec3){
	this.x = v3fVec.x; 	this.w = v3fVec.y; 	this.z = v3fVec.z;
};

get xww(): IVec3{
	return vec3(this.x, this.w, this.w);
};
set xww(v3fVec: IVec3){
	this.x = v3fVec.x; 	this.w = v3fVec.y; 	this.w = v3fVec.z;
};

get yxx(): IVec3{
	return vec3(this.y, this.x, this.x);
};
set yxx(v3fVec: IVec3){
	this.y = v3fVec.x; 	this.x = v3fVec.y; 	this.x = v3fVec.z;
};

get yxy(): IVec3{
	return vec3(this.y, this.x, this.y);
};
set yxy(v3fVec: IVec3){
	this.y = v3fVec.x; 	this.x = v3fVec.y; 	this.y = v3fVec.z;
};

get yxz(): IVec3{
	return vec3(this.y, this.x, this.z);
};
set yxz(v3fVec: IVec3){
	this.y = v3fVec.x; 	this.x = v3fVec.y; 	this.z = v3fVec.z;
};

get yxw(): IVec3{
	return vec3(this.y, this.x, this.w);
};
set yxw(v3fVec: IVec3){
	this.y = v3fVec.x; 	this.x = v3fVec.y; 	this.w = v3fVec.z;
};

get yyx(): IVec3{
	return vec3(this.y, this.y, this.x);
};
set yyx(v3fVec: IVec3){
	this.y = v3fVec.x; 	this.y = v3fVec.y; 	this.x = v3fVec.z;
};

get yyy(): IVec3{
	return vec3(this.y, this.y, this.y);
};
set yyy(v3fVec: IVec3){
	this.y = v3fVec.x; 	this.y = v3fVec.y; 	this.y = v3fVec.z;
};

get yyz(): IVec3{
	return vec3(this.y, this.y, this.z);
};
set yyz(v3fVec: IVec3){
	this.y = v3fVec.x; 	this.y = v3fVec.y; 	this.z = v3fVec.z;
};

get yyw(): IVec3{
	return vec3(this.y, this.y, this.w);
};
set yyw(v3fVec: IVec3){
	this.y = v3fVec.x; 	this.y = v3fVec.y; 	this.w = v3fVec.z;
};

get yzx(): IVec3{
	return vec3(this.y, this.z, this.x);
};
set yzx(v3fVec: IVec3){
	this.y = v3fVec.x; 	this.z = v3fVec.y; 	this.x = v3fVec.z;
};

get yzy(): IVec3{
	return vec3(this.y, this.z, this.y);
};
set yzy(v3fVec: IVec3){
	this.y = v3fVec.x; 	this.z = v3fVec.y; 	this.y = v3fVec.z;
};

get yzz(): IVec3{
	return vec3(this.y, this.z, this.z);
};
set yzz(v3fVec: IVec3){
	this.y = v3fVec.x; 	this.z = v3fVec.y; 	this.z = v3fVec.z;
};

get yzw(): IVec3{
	return vec3(this.y, this.z, this.w);
};
set yzw(v3fVec: IVec3){
	this.y = v3fVec.x; 	this.z = v3fVec.y; 	this.w = v3fVec.z;
};

get ywx(): IVec3{
	return vec3(this.y, this.w, this.x);
};
set ywx(v3fVec: IVec3){
	this.y = v3fVec.x; 	this.w = v3fVec.y; 	this.x = v3fVec.z;
};

get ywy(): IVec3{
	return vec3(this.y, this.w, this.y);
};
set ywy(v3fVec: IVec3){
	this.y = v3fVec.x; 	this.w = v3fVec.y; 	this.y = v3fVec.z;
};

get ywz(): IVec3{
	return vec3(this.y, this.w, this.z);
};
set ywz(v3fVec: IVec3){
	this.y = v3fVec.x; 	this.w = v3fVec.y; 	this.z = v3fVec.z;
};

get yww(): IVec3{
	return vec3(this.y, this.w, this.w);
};
set yww(v3fVec: IVec3){
	this.y = v3fVec.x; 	this.w = v3fVec.y; 	this.w = v3fVec.z;
};

get zxx(): IVec3{
	return vec3(this.z, this.x, this.x);
};
set zxx(v3fVec: IVec3){
	this.z = v3fVec.x; 	this.x = v3fVec.y; 	this.x = v3fVec.z;
};

get zxy(): IVec3{
	return vec3(this.z, this.x, this.y);
};
set zxy(v3fVec: IVec3){
	this.z = v3fVec.x; 	this.x = v3fVec.y; 	this.y = v3fVec.z;
};

get zxz(): IVec3{
	return vec3(this.z, this.x, this.z);
};
set zxz(v3fVec: IVec3){
	this.z = v3fVec.x; 	this.x = v3fVec.y; 	this.z = v3fVec.z;
};

get zxw(): IVec3{
	return vec3(this.z, this.x, this.w);
};
set zxw(v3fVec: IVec3){
	this.z = v3fVec.x; 	this.x = v3fVec.y; 	this.w = v3fVec.z;
};

get zyx(): IVec3{
	return vec3(this.z, this.y, this.x);
};
set zyx(v3fVec: IVec3){
	this.z = v3fVec.x; 	this.y = v3fVec.y; 	this.x = v3fVec.z;
};

get zyy(): IVec3{
	return vec3(this.z, this.y, this.y);
};
set zyy(v3fVec: IVec3){
	this.z = v3fVec.x; 	this.y = v3fVec.y; 	this.y = v3fVec.z;
};

get zyz(): IVec3{
	return vec3(this.z, this.y, this.z);
};
set zyz(v3fVec: IVec3){
	this.z = v3fVec.x; 	this.y = v3fVec.y; 	this.z = v3fVec.z;
};

get zyw(): IVec3{
	return vec3(this.z, this.y, this.w);
};
set zyw(v3fVec: IVec3){
	this.z = v3fVec.x; 	this.y = v3fVec.y; 	this.w = v3fVec.z;
};

get zzx(): IVec3{
	return vec3(this.z, this.z, this.x);
};
set zzx(v3fVec: IVec3){
	this.z = v3fVec.x; 	this.z = v3fVec.y; 	this.x = v3fVec.z;
};

get zzy(): IVec3{
	return vec3(this.z, this.z, this.y);
};
set zzy(v3fVec: IVec3){
	this.z = v3fVec.x; 	this.z = v3fVec.y; 	this.y = v3fVec.z;
};

get zzz(): IVec3{
	return vec3(this.z, this.z, this.z);
};
set zzz(v3fVec: IVec3){
	this.z = v3fVec.x; 	this.z = v3fVec.y; 	this.z = v3fVec.z;
};

get zzw(): IVec3{
	return vec3(this.z, this.z, this.w);
};
set zzw(v3fVec: IVec3){
	this.z = v3fVec.x; 	this.z = v3fVec.y; 	this.w = v3fVec.z;
};

get zwx(): IVec3{
	return vec3(this.z, this.w, this.x);
};
set zwx(v3fVec: IVec3){
	this.z = v3fVec.x; 	this.w = v3fVec.y; 	this.x = v3fVec.z;
};

get zwy(): IVec3{
	return vec3(this.z, this.w, this.y);
};
set zwy(v3fVec: IVec3){
	this.z = v3fVec.x; 	this.w = v3fVec.y; 	this.y = v3fVec.z;
};

get zwz(): IVec3{
	return vec3(this.z, this.w, this.z);
};
set zwz(v3fVec: IVec3){
	this.z = v3fVec.x; 	this.w = v3fVec.y; 	this.z = v3fVec.z;
};

get zww(): IVec3{
	return vec3(this.z, this.w, this.w);
};
set zww(v3fVec: IVec3){
	this.z = v3fVec.x; 	this.w = v3fVec.y; 	this.w = v3fVec.z;
};

get wxx(): IVec3{
	return vec3(this.w, this.x, this.x);
};
set wxx(v3fVec: IVec3){
	this.w = v3fVec.x; 	this.x = v3fVec.y; 	this.x = v3fVec.z;
};

get wxy(): IVec3{
	return vec3(this.w, this.x, this.y);
};
set wxy(v3fVec: IVec3){
	this.w = v3fVec.x; 	this.x = v3fVec.y; 	this.y = v3fVec.z;
};

get wxz(): IVec3{
	return vec3(this.w, this.x, this.z);
};
set wxz(v3fVec: IVec3){
	this.w = v3fVec.x; 	this.x = v3fVec.y; 	this.z = v3fVec.z;
};

get wxw(): IVec3{
	return vec3(this.w, this.x, this.w);
};
set wxw(v3fVec: IVec3){
	this.w = v3fVec.x; 	this.x = v3fVec.y; 	this.w = v3fVec.z;
};

get wyx(): IVec3{
	return vec3(this.w, this.y, this.x);
};
set wyx(v3fVec: IVec3){
	this.w = v3fVec.x; 	this.y = v3fVec.y; 	this.x = v3fVec.z;
};

get wyy(): IVec3{
	return vec3(this.w, this.y, this.y);
};
set wyy(v3fVec: IVec3){
	this.w = v3fVec.x; 	this.y = v3fVec.y; 	this.y = v3fVec.z;
};

get wyz(): IVec3{
	return vec3(this.w, this.y, this.z);
};
set wyz(v3fVec: IVec3){
	this.w = v3fVec.x; 	this.y = v3fVec.y; 	this.z = v3fVec.z;
};

get wyw(): IVec3{
	return vec3(this.w, this.y, this.w);
};
set wyw(v3fVec: IVec3){
	this.w = v3fVec.x; 	this.y = v3fVec.y; 	this.w = v3fVec.z;
};

get wzx(): IVec3{
	return vec3(this.w, this.z, this.x);
};
set wzx(v3fVec: IVec3){
	this.w = v3fVec.x; 	this.z = v3fVec.y; 	this.x = v3fVec.z;
};

get wzy(): IVec3{
	return vec3(this.w, this.z, this.y);
};
set wzy(v3fVec: IVec3){
	this.w = v3fVec.x; 	this.z = v3fVec.y; 	this.y = v3fVec.z;
};

get wzz(): IVec3{
	return vec3(this.w, this.z, this.z);
};
set wzz(v3fVec: IVec3){
	this.w = v3fVec.x; 	this.z = v3fVec.y; 	this.z = v3fVec.z;
};

get wzw(): IVec3{
	return vec3(this.w, this.z, this.w);
};
set wzw(v3fVec: IVec3){
	this.w = v3fVec.x; 	this.z = v3fVec.y; 	this.w = v3fVec.z;
};

get wwx(): IVec3{
	return vec3(this.w, this.w, this.x);
};
set wwx(v3fVec: IVec3){
	this.w = v3fVec.x; 	this.w = v3fVec.y; 	this.x = v3fVec.z;
};

get wwy(): IVec3{
	return vec3(this.w, this.w, this.y);
};
set wwy(v3fVec: IVec3){
	this.w = v3fVec.x; 	this.w = v3fVec.y; 	this.y = v3fVec.z;
};

get wwz(): IVec3{
	return vec3(this.w, this.w, this.z);
};
set wwz(v3fVec: IVec3){
	this.w = v3fVec.x; 	this.w = v3fVec.y; 	this.z = v3fVec.z;
};

get www(): IVec3{
	return vec3(this.w, this.w, this.w);
};
set www(v3fVec: IVec3){
	this.w = v3fVec.x; 	this.w = v3fVec.y; 	this.w = v3fVec.z;
};


get xxxx(): IVec4{
	return vec4(this.x, this.x, this.x, this.x);
};
set xxxx(v4fVec: IVec4){
	this.x = v4fVec.x; 	this.x = v4fVec.y;
	this.x = v4fVec.z; 	this.x = v4fVec.w;
};

get xxxy(): IVec4{
	return vec4(this.x, this.x, this.x, this.y);
};
set xxxy(v4fVec: IVec4){
	this.x = v4fVec.x; 	this.x = v4fVec.y;
	this.x = v4fVec.z; 	this.y = v4fVec.w;
};

get xxxz(): IVec4{
	return vec4(this.x, this.x, this.x, this.z);
};
set xxxz(v4fVec: IVec4){
	this.x = v4fVec.x; 	this.x = v4fVec.y;
	this.x = v4fVec.z; 	this.z = v4fVec.w;
};

get xxxw(): IVec4{
	return vec4(this.x, this.x, this.x, this.w);
};
set xxxw(v4fVec: IVec4){
	this.x = v4fVec.x; 	this.x = v4fVec.y;
	this.x = v4fVec.z; 	this.w = v4fVec.w;
};

get xxyx(): IVec4{
	return vec4(this.x, this.x, this.y, this.x);
};
set xxyx(v4fVec: IVec4){
	this.x = v4fVec.x; 	this.x = v4fVec.y;
	this.y = v4fVec.z; 	this.x = v4fVec.w;
};

get xxyy(): IVec4{
	return vec4(this.x, this.x, this.y, this.y);
};
set xxyy(v4fVec: IVec4){
	this.x = v4fVec.x; 	this.x = v4fVec.y;
	this.y = v4fVec.z; 	this.y = v4fVec.w;
};

get xxyz(): IVec4{
	return vec4(this.x, this.x, this.y, this.z);
};
set xxyz(v4fVec: IVec4){
	this.x = v4fVec.x; 	this.x = v4fVec.y;
	this.y = v4fVec.z; 	this.z = v4fVec.w;
};

get xxyw(): IVec4{
	return vec4(this.x, this.x, this.y, this.w);
};
set xxyw(v4fVec: IVec4){
	this.x = v4fVec.x; 	this.x = v4fVec.y;
	this.y = v4fVec.z; 	this.w = v4fVec.w;
};

get xxzx(): IVec4{
	return vec4(this.x, this.x, this.z, this.x);
};
set xxzx(v4fVec: IVec4){
	this.x = v4fVec.x; 	this.x = v4fVec.y;
	this.z = v4fVec.z; 	this.x = v4fVec.w;
};

get xxzy(): IVec4{
	return vec4(this.x, this.x, this.z, this.y);
};
set xxzy(v4fVec: IVec4){
	this.x = v4fVec.x; 	this.x = v4fVec.y;
	this.z = v4fVec.z; 	this.y = v4fVec.w;
};

get xxzz(): IVec4{
	return vec4(this.x, this.x, this.z, this.z);
};
set xxzz(v4fVec: IVec4){
	this.x = v4fVec.x; 	this.x = v4fVec.y;
	this.z = v4fVec.z; 	this.z = v4fVec.w;
};

get xxzw(): IVec4{
	return vec4(this.x, this.x, this.z, this.w);
};
set xxzw(v4fVec: IVec4){
	this.x = v4fVec.x; 	this.x = v4fVec.y;
	this.z = v4fVec.z; 	this.w = v4fVec.w;
};

get xxwx(): IVec4{
	return vec4(this.x, this.x, this.w, this.x);
};
set xxwx(v4fVec: IVec4){
	this.x = v4fVec.x; 	this.x = v4fVec.y;
	this.w = v4fVec.z; 	this.x = v4fVec.w;
};

get xxwy(): IVec4{
	return vec4(this.x, this.x, this.w, this.y);
};
set xxwy(v4fVec: IVec4){
	this.x = v4fVec.x; 	this.x = v4fVec.y;
	this.w = v4fVec.z; 	this.y = v4fVec.w;
};

get xxwz(): IVec4{
	return vec4(this.x, this.x, this.w, this.z);
};
set xxwz(v4fVec: IVec4){
	this.x = v4fVec.x; 	this.x = v4fVec.y;
	this.w = v4fVec.z; 	this.z = v4fVec.w;
};

get xxww(): IVec4{
	return vec4(this.x, this.x, this.w, this.w);
};
set xxww(v4fVec: IVec4){
	this.x = v4fVec.x; 	this.x = v4fVec.y;
	this.w = v4fVec.z; 	this.w = v4fVec.w;
};

get xyxx(): IVec4{
	return vec4(this.x, this.y, this.x, this.x);
};
set xyxx(v4fVec: IVec4){
	this.x = v4fVec.x; 	this.y = v4fVec.y;
	this.x = v4fVec.z; 	this.x = v4fVec.w;
};

get xyxy(): IVec4{
	return vec4(this.x, this.y, this.x, this.y);
};
set xyxy(v4fVec: IVec4){
	this.x = v4fVec.x; 	this.y = v4fVec.y;
	this.x = v4fVec.z; 	this.y = v4fVec.w;
};

get xyxz(): IVec4{
	return vec4(this.x, this.y, this.x, this.z);
};
set xyxz(v4fVec: IVec4){
	this.x = v4fVec.x; 	this.y = v4fVec.y;
	this.x = v4fVec.z; 	this.z = v4fVec.w;
};

get xyxw(): IVec4{
	return vec4(this.x, this.y, this.x, this.w);
};
set xyxw(v4fVec: IVec4){
	this.x = v4fVec.x; 	this.y = v4fVec.y;
	this.x = v4fVec.z; 	this.w = v4fVec.w;
};

get xyyx(): IVec4{
	return vec4(this.x, this.y, this.y, this.x);
};
set xyyx(v4fVec: IVec4){
	this.x = v4fVec.x; 	this.y = v4fVec.y;
	this.y = v4fVec.z; 	this.x = v4fVec.w;
};

get xyyy(): IVec4{
	return vec4(this.x, this.y, this.y, this.y);
};
set xyyy(v4fVec: IVec4){
	this.x = v4fVec.x; 	this.y = v4fVec.y;
	this.y = v4fVec.z; 	this.y = v4fVec.w;
};

get xyyz(): IVec4{
	return vec4(this.x, this.y, this.y, this.z);
};
set xyyz(v4fVec: IVec4){
	this.x = v4fVec.x; 	this.y = v4fVec.y;
	this.y = v4fVec.z; 	this.z = v4fVec.w;
};

get xyyw(): IVec4{
	return vec4(this.x, this.y, this.y, this.w);
};
set xyyw(v4fVec: IVec4){
	this.x = v4fVec.x; 	this.y = v4fVec.y;
	this.y = v4fVec.z; 	this.w = v4fVec.w;
};

get xyzx(): IVec4{
	return vec4(this.x, this.y, this.z, this.x);
};
set xyzx(v4fVec: IVec4){
	this.x = v4fVec.x; 	this.y = v4fVec.y;
	this.z = v4fVec.z; 	this.x = v4fVec.w;
};

get xyzy(): IVec4{
	return vec4(this.x, this.y, this.z, this.y);
};
set xyzy(v4fVec: IVec4){
	this.x = v4fVec.x; 	this.y = v4fVec.y;
	this.z = v4fVec.z; 	this.y = v4fVec.w;
};

get xyzz(): IVec4{
	return vec4(this.x, this.y, this.z, this.z);
};
set xyzz(v4fVec: IVec4){
	this.x = v4fVec.x; 	this.y = v4fVec.y;
	this.z = v4fVec.z; 	this.z = v4fVec.w;
};

get xyzw(): IVec4{
	return vec4(this.x, this.y, this.z, this.w);
};
set xyzw(v4fVec: IVec4){
	this.x = v4fVec.x; 	this.y = v4fVec.y;
	this.z = v4fVec.z; 	this.w = v4fVec.w;
};

get xywx(): IVec4{
	return vec4(this.x, this.y, this.w, this.x);
};
set xywx(v4fVec: IVec4){
	this.x = v4fVec.x; 	this.y = v4fVec.y;
	this.w = v4fVec.z; 	this.x = v4fVec.w;
};

get xywy(): IVec4{
	return vec4(this.x, this.y, this.w, this.y);
};
set xywy(v4fVec: IVec4){
	this.x = v4fVec.x; 	this.y = v4fVec.y;
	this.w = v4fVec.z; 	this.y = v4fVec.w;
};

get xywz(): IVec4{
	return vec4(this.x, this.y, this.w, this.z);
};
set xywz(v4fVec: IVec4){
	this.x = v4fVec.x; 	this.y = v4fVec.y;
	this.w = v4fVec.z; 	this.z = v4fVec.w;
};

get xyww(): IVec4{
	return vec4(this.x, this.y, this.w, this.w);
};
set xyww(v4fVec: IVec4){
	this.x = v4fVec.x; 	this.y = v4fVec.y;
	this.w = v4fVec.z; 	this.w = v4fVec.w;
};

get xzxx(): IVec4{
	return vec4(this.x, this.z, this.x, this.x);
};
set xzxx(v4fVec: IVec4){
	this.x = v4fVec.x; 	this.z = v4fVec.y;
	this.x = v4fVec.z; 	this.x = v4fVec.w;
};

get xzxy(): IVec4{
	return vec4(this.x, this.z, this.x, this.y);
};
set xzxy(v4fVec: IVec4){
	this.x = v4fVec.x; 	this.z = v4fVec.y;
	this.x = v4fVec.z; 	this.y = v4fVec.w;
};

get xzxz(): IVec4{
	return vec4(this.x, this.z, this.x, this.z);
};
set xzxz(v4fVec: IVec4){
	this.x = v4fVec.x; 	this.z = v4fVec.y;
	this.x = v4fVec.z; 	this.z = v4fVec.w;
};

get xzxw(): IVec4{
	return vec4(this.x, this.z, this.x, this.w);
};
set xzxw(v4fVec: IVec4){
	this.x = v4fVec.x; 	this.z = v4fVec.y;
	this.x = v4fVec.z; 	this.w = v4fVec.w;
};

get xzyx(): IVec4{
	return vec4(this.x, this.z, this.y, this.x);
};
set xzyx(v4fVec: IVec4){
	this.x = v4fVec.x; 	this.z = v4fVec.y;
	this.y = v4fVec.z; 	this.x = v4fVec.w;
};

get xzyy(): IVec4{
	return vec4(this.x, this.z, this.y, this.y);
};
set xzyy(v4fVec: IVec4){
	this.x = v4fVec.x; 	this.z = v4fVec.y;
	this.y = v4fVec.z; 	this.y = v4fVec.w;
};

get xzyz(): IVec4{
	return vec4(this.x, this.z, this.y, this.z);
};
set xzyz(v4fVec: IVec4){
	this.x = v4fVec.x; 	this.z = v4fVec.y;
	this.y = v4fVec.z; 	this.z = v4fVec.w;
};

get xzyw(): IVec4{
	return vec4(this.x, this.z, this.y, this.w);
};
set xzyw(v4fVec: IVec4){
	this.x = v4fVec.x; 	this.z = v4fVec.y;
	this.y = v4fVec.z; 	this.w = v4fVec.w;
};

get xzzx(): IVec4{
	return vec4(this.x, this.z, this.z, this.x);
};
set xzzx(v4fVec: IVec4){
	this.x = v4fVec.x; 	this.z = v4fVec.y;
	this.z = v4fVec.z; 	this.x = v4fVec.w;
};

get xzzy(): IVec4{
	return vec4(this.x, this.z, this.z, this.y);
};
set xzzy(v4fVec: IVec4){
	this.x = v4fVec.x; 	this.z = v4fVec.y;
	this.z = v4fVec.z; 	this.y = v4fVec.w;
};

get xzzz(): IVec4{
	return vec4(this.x, this.z, this.z, this.z);
};
set xzzz(v4fVec: IVec4){
	this.x = v4fVec.x; 	this.z = v4fVec.y;
	this.z = v4fVec.z; 	this.z = v4fVec.w;
};

get xzzw(): IVec4{
	return vec4(this.x, this.z, this.z, this.w);
};
set xzzw(v4fVec: IVec4){
	this.x = v4fVec.x; 	this.z = v4fVec.y;
	this.z = v4fVec.z; 	this.w = v4fVec.w;
};

get xzwx(): IVec4{
	return vec4(this.x, this.z, this.w, this.x);
};
set xzwx(v4fVec: IVec4){
	this.x = v4fVec.x; 	this.z = v4fVec.y;
	this.w = v4fVec.z; 	this.x = v4fVec.w;
};

get xzwy(): IVec4{
	return vec4(this.x, this.z, this.w, this.y);
};
set xzwy(v4fVec: IVec4){
	this.x = v4fVec.x; 	this.z = v4fVec.y;
	this.w = v4fVec.z; 	this.y = v4fVec.w;
};

get xzwz(): IVec4{
	return vec4(this.x, this.z, this.w, this.z);
};
set xzwz(v4fVec: IVec4){
	this.x = v4fVec.x; 	this.z = v4fVec.y;
	this.w = v4fVec.z; 	this.z = v4fVec.w;
};

get xzww(): IVec4{
	return vec4(this.x, this.z, this.w, this.w);
};
set xzww(v4fVec: IVec4){
	this.x = v4fVec.x; 	this.z = v4fVec.y;
	this.w = v4fVec.z; 	this.w = v4fVec.w;
};

get xwxx(): IVec4{
	return vec4(this.x, this.w, this.x, this.x);
};
set xwxx(v4fVec: IVec4){
	this.x = v4fVec.x; 	this.w = v4fVec.y;
	this.x = v4fVec.z; 	this.x = v4fVec.w;
};

get xwxy(): IVec4{
	return vec4(this.x, this.w, this.x, this.y);
};
set xwxy(v4fVec: IVec4){
	this.x = v4fVec.x; 	this.w = v4fVec.y;
	this.x = v4fVec.z; 	this.y = v4fVec.w;
};

get xwxz(): IVec4{
	return vec4(this.x, this.w, this.x, this.z);
};
set xwxz(v4fVec: IVec4){
	this.x = v4fVec.x; 	this.w = v4fVec.y;
	this.x = v4fVec.z; 	this.z = v4fVec.w;
};

get xwxw(): IVec4{
	return vec4(this.x, this.w, this.x, this.w);
};
set xwxw(v4fVec: IVec4){
	this.x = v4fVec.x; 	this.w = v4fVec.y;
	this.x = v4fVec.z; 	this.w = v4fVec.w;
};

get xwyx(): IVec4{
	return vec4(this.x, this.w, this.y, this.x);
};
set xwyx(v4fVec: IVec4){
	this.x = v4fVec.x; 	this.w = v4fVec.y;
	this.y = v4fVec.z; 	this.x = v4fVec.w;
};

get xwyy(): IVec4{
	return vec4(this.x, this.w, this.y, this.y);
};
set xwyy(v4fVec: IVec4){
	this.x = v4fVec.x; 	this.w = v4fVec.y;
	this.y = v4fVec.z; 	this.y = v4fVec.w;
};

get xwyz(): IVec4{
	return vec4(this.x, this.w, this.y, this.z);
};
set xwyz(v4fVec: IVec4){
	this.x = v4fVec.x; 	this.w = v4fVec.y;
	this.y = v4fVec.z; 	this.z = v4fVec.w;
};

get xwyw(): IVec4{
	return vec4(this.x, this.w, this.y, this.w);
};
set xwyw(v4fVec: IVec4){
	this.x = v4fVec.x; 	this.w = v4fVec.y;
	this.y = v4fVec.z; 	this.w = v4fVec.w;
};

get xwzx(): IVec4{
	return vec4(this.x, this.w, this.z, this.x);
};
set xwzx(v4fVec: IVec4){
	this.x = v4fVec.x; 	this.w = v4fVec.y;
	this.z = v4fVec.z; 	this.x = v4fVec.w;
};

get xwzy(): IVec4{
	return vec4(this.x, this.w, this.z, this.y);
};
set xwzy(v4fVec: IVec4){
	this.x = v4fVec.x; 	this.w = v4fVec.y;
	this.z = v4fVec.z; 	this.y = v4fVec.w;
};

get xwzz(): IVec4{
	return vec4(this.x, this.w, this.z, this.z);
};
set xwzz(v4fVec: IVec4){
	this.x = v4fVec.x; 	this.w = v4fVec.y;
	this.z = v4fVec.z; 	this.z = v4fVec.w;
};

get xwzw(): IVec4{
	return vec4(this.x, this.w, this.z, this.w);
};
set xwzw(v4fVec: IVec4){
	this.x = v4fVec.x; 	this.w = v4fVec.y;
	this.z = v4fVec.z; 	this.w = v4fVec.w;
};

get xwwx(): IVec4{
	return vec4(this.x, this.w, this.w, this.x);
};
set xwwx(v4fVec: IVec4){
	this.x = v4fVec.x; 	this.w = v4fVec.y;
	this.w = v4fVec.z; 	this.x = v4fVec.w;
};

get xwwy(): IVec4{
	return vec4(this.x, this.w, this.w, this.y);
};
set xwwy(v4fVec: IVec4){
	this.x = v4fVec.x; 	this.w = v4fVec.y;
	this.w = v4fVec.z; 	this.y = v4fVec.w;
};

get xwwz(): IVec4{
	return vec4(this.x, this.w, this.w, this.z);
};
set xwwz(v4fVec: IVec4){
	this.x = v4fVec.x; 	this.w = v4fVec.y;
	this.w = v4fVec.z; 	this.z = v4fVec.w;
};

get xwww(): IVec4{
	return vec4(this.x, this.w, this.w, this.w);
};
set xwww(v4fVec: IVec4){
	this.x = v4fVec.x; 	this.w = v4fVec.y;
	this.w = v4fVec.z; 	this.w = v4fVec.w;
};

get yxxx(): IVec4{
	return vec4(this.y, this.x, this.x, this.x);
};
set yxxx(v4fVec: IVec4){
	this.y = v4fVec.x; 	this.x = v4fVec.y;
	this.x = v4fVec.z; 	this.x = v4fVec.w;
};

get yxxy(): IVec4{
	return vec4(this.y, this.x, this.x, this.y);
};
set yxxy(v4fVec: IVec4){
	this.y = v4fVec.x; 	this.x = v4fVec.y;
	this.x = v4fVec.z; 	this.y = v4fVec.w;
};

get yxxz(): IVec4{
	return vec4(this.y, this.x, this.x, this.z);
};
set yxxz(v4fVec: IVec4){
	this.y = v4fVec.x; 	this.x = v4fVec.y;
	this.x = v4fVec.z; 	this.z = v4fVec.w;
};

get yxxw(): IVec4{
	return vec4(this.y, this.x, this.x, this.w);
};
set yxxw(v4fVec: IVec4){
	this.y = v4fVec.x; 	this.x = v4fVec.y;
	this.x = v4fVec.z; 	this.w = v4fVec.w;
};

get yxyx(): IVec4{
	return vec4(this.y, this.x, this.y, this.x);
};
set yxyx(v4fVec: IVec4){
	this.y = v4fVec.x; 	this.x = v4fVec.y;
	this.y = v4fVec.z; 	this.x = v4fVec.w;
};

get yxyy(): IVec4{
	return vec4(this.y, this.x, this.y, this.y);
};
set yxyy(v4fVec: IVec4){
	this.y = v4fVec.x; 	this.x = v4fVec.y;
	this.y = v4fVec.z; 	this.y = v4fVec.w;
};

get yxyz(): IVec4{
	return vec4(this.y, this.x, this.y, this.z);
};
set yxyz(v4fVec: IVec4){
	this.y = v4fVec.x; 	this.x = v4fVec.y;
	this.y = v4fVec.z; 	this.z = v4fVec.w;
};

get yxyw(): IVec4{
	return vec4(this.y, this.x, this.y, this.w);
};
set yxyw(v4fVec: IVec4){
	this.y = v4fVec.x; 	this.x = v4fVec.y;
	this.y = v4fVec.z; 	this.w = v4fVec.w;
};

get yxzx(): IVec4{
	return vec4(this.y, this.x, this.z, this.x);
};
set yxzx(v4fVec: IVec4){
	this.y = v4fVec.x; 	this.x = v4fVec.y;
	this.z = v4fVec.z; 	this.x = v4fVec.w;
};

get yxzy(): IVec4{
	return vec4(this.y, this.x, this.z, this.y);
};
set yxzy(v4fVec: IVec4){
	this.y = v4fVec.x; 	this.x = v4fVec.y;
	this.z = v4fVec.z; 	this.y = v4fVec.w;
};

get yxzz(): IVec4{
	return vec4(this.y, this.x, this.z, this.z);
};
set yxzz(v4fVec: IVec4){
	this.y = v4fVec.x; 	this.x = v4fVec.y;
	this.z = v4fVec.z; 	this.z = v4fVec.w;
};

get yxzw(): IVec4{
	return vec4(this.y, this.x, this.z, this.w);
};
set yxzw(v4fVec: IVec4){
	this.y = v4fVec.x; 	this.x = v4fVec.y;
	this.z = v4fVec.z; 	this.w = v4fVec.w;
};

get yxwx(): IVec4{
	return vec4(this.y, this.x, this.w, this.x);
};
set yxwx(v4fVec: IVec4){
	this.y = v4fVec.x; 	this.x = v4fVec.y;
	this.w = v4fVec.z; 	this.x = v4fVec.w;
};

get yxwy(): IVec4{
	return vec4(this.y, this.x, this.w, this.y);
};
set yxwy(v4fVec: IVec4){
	this.y = v4fVec.x; 	this.x = v4fVec.y;
	this.w = v4fVec.z; 	this.y = v4fVec.w;
};

get yxwz(): IVec4{
	return vec4(this.y, this.x, this.w, this.z);
};
set yxwz(v4fVec: IVec4){
	this.y = v4fVec.x; 	this.x = v4fVec.y;
	this.w = v4fVec.z; 	this.z = v4fVec.w;
};

get yxww(): IVec4{
	return vec4(this.y, this.x, this.w, this.w);
};
set yxww(v4fVec: IVec4){
	this.y = v4fVec.x; 	this.x = v4fVec.y;
	this.w = v4fVec.z; 	this.w = v4fVec.w;
};

get yyxx(): IVec4{
	return vec4(this.y, this.y, this.x, this.x);
};
set yyxx(v4fVec: IVec4){
	this.y = v4fVec.x; 	this.y = v4fVec.y;
	this.x = v4fVec.z; 	this.x = v4fVec.w;
};

get yyxy(): IVec4{
	return vec4(this.y, this.y, this.x, this.y);
};
set yyxy(v4fVec: IVec4){
	this.y = v4fVec.x; 	this.y = v4fVec.y;
	this.x = v4fVec.z; 	this.y = v4fVec.w;
};

get yyxz(): IVec4{
	return vec4(this.y, this.y, this.x, this.z);
};
set yyxz(v4fVec: IVec4){
	this.y = v4fVec.x; 	this.y = v4fVec.y;
	this.x = v4fVec.z; 	this.z = v4fVec.w;
};

get yyxw(): IVec4{
	return vec4(this.y, this.y, this.x, this.w);
};
set yyxw(v4fVec: IVec4){
	this.y = v4fVec.x; 	this.y = v4fVec.y;
	this.x = v4fVec.z; 	this.w = v4fVec.w;
};

get yyyx(): IVec4{
	return vec4(this.y, this.y, this.y, this.x);
};
set yyyx(v4fVec: IVec4){
	this.y = v4fVec.x; 	this.y = v4fVec.y;
	this.y = v4fVec.z; 	this.x = v4fVec.w;
};

get yyyy(): IVec4{
	return vec4(this.y, this.y, this.y, this.y);
};
set yyyy(v4fVec: IVec4){
	this.y = v4fVec.x; 	this.y = v4fVec.y;
	this.y = v4fVec.z; 	this.y = v4fVec.w;
};

get yyyz(): IVec4{
	return vec4(this.y, this.y, this.y, this.z);
};
set yyyz(v4fVec: IVec4){
	this.y = v4fVec.x; 	this.y = v4fVec.y;
	this.y = v4fVec.z; 	this.z = v4fVec.w;
};

get yyyw(): IVec4{
	return vec4(this.y, this.y, this.y, this.w);
};
set yyyw(v4fVec: IVec4){
	this.y = v4fVec.x; 	this.y = v4fVec.y;
	this.y = v4fVec.z; 	this.w = v4fVec.w;
};

get yyzx(): IVec4{
	return vec4(this.y, this.y, this.z, this.x);
};
set yyzx(v4fVec: IVec4){
	this.y = v4fVec.x; 	this.y = v4fVec.y;
	this.z = v4fVec.z; 	this.x = v4fVec.w;
};

get yyzy(): IVec4{
	return vec4(this.y, this.y, this.z, this.y);
};
set yyzy(v4fVec: IVec4){
	this.y = v4fVec.x; 	this.y = v4fVec.y;
	this.z = v4fVec.z; 	this.y = v4fVec.w;
};

get yyzz(): IVec4{
	return vec4(this.y, this.y, this.z, this.z);
};
set yyzz(v4fVec: IVec4){
	this.y = v4fVec.x; 	this.y = v4fVec.y;
	this.z = v4fVec.z; 	this.z = v4fVec.w;
};

get yyzw(): IVec4{
	return vec4(this.y, this.y, this.z, this.w);
};
set yyzw(v4fVec: IVec4){
	this.y = v4fVec.x; 	this.y = v4fVec.y;
	this.z = v4fVec.z; 	this.w = v4fVec.w;
};

get yywx(): IVec4{
	return vec4(this.y, this.y, this.w, this.x);
};
set yywx(v4fVec: IVec4){
	this.y = v4fVec.x; 	this.y = v4fVec.y;
	this.w = v4fVec.z; 	this.x = v4fVec.w;
};

get yywy(): IVec4{
	return vec4(this.y, this.y, this.w, this.y);
};
set yywy(v4fVec: IVec4){
	this.y = v4fVec.x; 	this.y = v4fVec.y;
	this.w = v4fVec.z; 	this.y = v4fVec.w;
};

get yywz(): IVec4{
	return vec4(this.y, this.y, this.w, this.z);
};
set yywz(v4fVec: IVec4){
	this.y = v4fVec.x; 	this.y = v4fVec.y;
	this.w = v4fVec.z; 	this.z = v4fVec.w;
};

get yyww(): IVec4{
	return vec4(this.y, this.y, this.w, this.w);
};
set yyww(v4fVec: IVec4){
	this.y = v4fVec.x; 	this.y = v4fVec.y;
	this.w = v4fVec.z; 	this.w = v4fVec.w;
};

get yzxx(): IVec4{
	return vec4(this.y, this.z, this.x, this.x);
};
set yzxx(v4fVec: IVec4){
	this.y = v4fVec.x; 	this.z = v4fVec.y;
	this.x = v4fVec.z; 	this.x = v4fVec.w;
};

get yzxy(): IVec4{
	return vec4(this.y, this.z, this.x, this.y);
};
set yzxy(v4fVec: IVec4){
	this.y = v4fVec.x; 	this.z = v4fVec.y;
	this.x = v4fVec.z; 	this.y = v4fVec.w;
};

get yzxz(): IVec4{
	return vec4(this.y, this.z, this.x, this.z);
};
set yzxz(v4fVec: IVec4){
	this.y = v4fVec.x; 	this.z = v4fVec.y;
	this.x = v4fVec.z; 	this.z = v4fVec.w;
};

get yzxw(): IVec4{
	return vec4(this.y, this.z, this.x, this.w);
};
set yzxw(v4fVec: IVec4){
	this.y = v4fVec.x; 	this.z = v4fVec.y;
	this.x = v4fVec.z; 	this.w = v4fVec.w;
};

get yzyx(): IVec4{
	return vec4(this.y, this.z, this.y, this.x);
};
set yzyx(v4fVec: IVec4){
	this.y = v4fVec.x; 	this.z = v4fVec.y;
	this.y = v4fVec.z; 	this.x = v4fVec.w;
};

get yzyy(): IVec4{
	return vec4(this.y, this.z, this.y, this.y);
};
set yzyy(v4fVec: IVec4){
	this.y = v4fVec.x; 	this.z = v4fVec.y;
	this.y = v4fVec.z; 	this.y = v4fVec.w;
};

get yzyz(): IVec4{
	return vec4(this.y, this.z, this.y, this.z);
};
set yzyz(v4fVec: IVec4){
	this.y = v4fVec.x; 	this.z = v4fVec.y;
	this.y = v4fVec.z; 	this.z = v4fVec.w;
};

get yzyw(): IVec4{
	return vec4(this.y, this.z, this.y, this.w);
};
set yzyw(v4fVec: IVec4){
	this.y = v4fVec.x; 	this.z = v4fVec.y;
	this.y = v4fVec.z; 	this.w = v4fVec.w;
};

get yzzx(): IVec4{
	return vec4(this.y, this.z, this.z, this.x);
};
set yzzx(v4fVec: IVec4){
	this.y = v4fVec.x; 	this.z = v4fVec.y;
	this.z = v4fVec.z; 	this.x = v4fVec.w;
};

get yzzy(): IVec4{
	return vec4(this.y, this.z, this.z, this.y);
};
set yzzy(v4fVec: IVec4){
	this.y = v4fVec.x; 	this.z = v4fVec.y;
	this.z = v4fVec.z; 	this.y = v4fVec.w;
};

get yzzz(): IVec4{
	return vec4(this.y, this.z, this.z, this.z);
};
set yzzz(v4fVec: IVec4){
	this.y = v4fVec.x; 	this.z = v4fVec.y;
	this.z = v4fVec.z; 	this.z = v4fVec.w;
};

get yzzw(): IVec4{
	return vec4(this.y, this.z, this.z, this.w);
};
set yzzw(v4fVec: IVec4){
	this.y = v4fVec.x; 	this.z = v4fVec.y;
	this.z = v4fVec.z; 	this.w = v4fVec.w;
};

get yzwx(): IVec4{
	return vec4(this.y, this.z, this.w, this.x);
};
set yzwx(v4fVec: IVec4){
	this.y = v4fVec.x; 	this.z = v4fVec.y;
	this.w = v4fVec.z; 	this.x = v4fVec.w;
};

get yzwy(): IVec4{
	return vec4(this.y, this.z, this.w, this.y);
};
set yzwy(v4fVec: IVec4){
	this.y = v4fVec.x; 	this.z = v4fVec.y;
	this.w = v4fVec.z; 	this.y = v4fVec.w;
};

get yzwz(): IVec4{
	return vec4(this.y, this.z, this.w, this.z);
};
set yzwz(v4fVec: IVec4){
	this.y = v4fVec.x; 	this.z = v4fVec.y;
	this.w = v4fVec.z; 	this.z = v4fVec.w;
};

get yzww(): IVec4{
	return vec4(this.y, this.z, this.w, this.w);
};
set yzww(v4fVec: IVec4){
	this.y = v4fVec.x; 	this.z = v4fVec.y;
	this.w = v4fVec.z; 	this.w = v4fVec.w;
};

get ywxx(): IVec4{
	return vec4(this.y, this.w, this.x, this.x);
};
set ywxx(v4fVec: IVec4){
	this.y = v4fVec.x; 	this.w = v4fVec.y;
	this.x = v4fVec.z; 	this.x = v4fVec.w;
};

get ywxy(): IVec4{
	return vec4(this.y, this.w, this.x, this.y);
};
set ywxy(v4fVec: IVec4){
	this.y = v4fVec.x; 	this.w = v4fVec.y;
	this.x = v4fVec.z; 	this.y = v4fVec.w;
};

get ywxz(): IVec4{
	return vec4(this.y, this.w, this.x, this.z);
};
set ywxz(v4fVec: IVec4){
	this.y = v4fVec.x; 	this.w = v4fVec.y;
	this.x = v4fVec.z; 	this.z = v4fVec.w;
};

get ywxw(): IVec4{
	return vec4(this.y, this.w, this.x, this.w);
};
set ywxw(v4fVec: IVec4){
	this.y = v4fVec.x; 	this.w = v4fVec.y;
	this.x = v4fVec.z; 	this.w = v4fVec.w;
};

get ywyx(): IVec4{
	return vec4(this.y, this.w, this.y, this.x);
};
set ywyx(v4fVec: IVec4){
	this.y = v4fVec.x; 	this.w = v4fVec.y;
	this.y = v4fVec.z; 	this.x = v4fVec.w;
};

get ywyy(): IVec4{
	return vec4(this.y, this.w, this.y, this.y);
};
set ywyy(v4fVec: IVec4){
	this.y = v4fVec.x; 	this.w = v4fVec.y;
	this.y = v4fVec.z; 	this.y = v4fVec.w;
};

get ywyz(): IVec4{
	return vec4(this.y, this.w, this.y, this.z);
};
set ywyz(v4fVec: IVec4){
	this.y = v4fVec.x; 	this.w = v4fVec.y;
	this.y = v4fVec.z; 	this.z = v4fVec.w;
};

get ywyw(): IVec4{
	return vec4(this.y, this.w, this.y, this.w);
};
set ywyw(v4fVec: IVec4){
	this.y = v4fVec.x; 	this.w = v4fVec.y;
	this.y = v4fVec.z; 	this.w = v4fVec.w;
};

get ywzx(): IVec4{
	return vec4(this.y, this.w, this.z, this.x);
};
set ywzx(v4fVec: IVec4){
	this.y = v4fVec.x; 	this.w = v4fVec.y;
	this.z = v4fVec.z; 	this.x = v4fVec.w;
};

get ywzy(): IVec4{
	return vec4(this.y, this.w, this.z, this.y);
};
set ywzy(v4fVec: IVec4){
	this.y = v4fVec.x; 	this.w = v4fVec.y;
	this.z = v4fVec.z; 	this.y = v4fVec.w;
};

get ywzz(): IVec4{
	return vec4(this.y, this.w, this.z, this.z);
};
set ywzz(v4fVec: IVec4){
	this.y = v4fVec.x; 	this.w = v4fVec.y;
	this.z = v4fVec.z; 	this.z = v4fVec.w;
};

get ywzw(): IVec4{
	return vec4(this.y, this.w, this.z, this.w);
};
set ywzw(v4fVec: IVec4){
	this.y = v4fVec.x; 	this.w = v4fVec.y;
	this.z = v4fVec.z; 	this.w = v4fVec.w;
};

get ywwx(): IVec4{
	return vec4(this.y, this.w, this.w, this.x);
};
set ywwx(v4fVec: IVec4){
	this.y = v4fVec.x; 	this.w = v4fVec.y;
	this.w = v4fVec.z; 	this.x = v4fVec.w;
};

get ywwy(): IVec4{
	return vec4(this.y, this.w, this.w, this.y);
};
set ywwy(v4fVec: IVec4){
	this.y = v4fVec.x; 	this.w = v4fVec.y;
	this.w = v4fVec.z; 	this.y = v4fVec.w;
};

get ywwz(): IVec4{
	return vec4(this.y, this.w, this.w, this.z);
};
set ywwz(v4fVec: IVec4){
	this.y = v4fVec.x; 	this.w = v4fVec.y;
	this.w = v4fVec.z; 	this.z = v4fVec.w;
};

get ywww(): IVec4{
	return vec4(this.y, this.w, this.w, this.w);
};
set ywww(v4fVec: IVec4){
	this.y = v4fVec.x; 	this.w = v4fVec.y;
	this.w = v4fVec.z; 	this.w = v4fVec.w;
};

get zxxx(): IVec4{
	return vec4(this.z, this.x, this.x, this.x);
};
set zxxx(v4fVec: IVec4){
	this.z = v4fVec.x; 	this.x = v4fVec.y;
	this.x = v4fVec.z; 	this.x = v4fVec.w;
};

get zxxy(): IVec4{
	return vec4(this.z, this.x, this.x, this.y);
};
set zxxy(v4fVec: IVec4){
	this.z = v4fVec.x; 	this.x = v4fVec.y;
	this.x = v4fVec.z; 	this.y = v4fVec.w;
};

get zxxz(): IVec4{
	return vec4(this.z, this.x, this.x, this.z);
};
set zxxz(v4fVec: IVec4){
	this.z = v4fVec.x; 	this.x = v4fVec.y;
	this.x = v4fVec.z; 	this.z = v4fVec.w;
};

get zxxw(): IVec4{
	return vec4(this.z, this.x, this.x, this.w);
};
set zxxw(v4fVec: IVec4){
	this.z = v4fVec.x; 	this.x = v4fVec.y;
	this.x = v4fVec.z; 	this.w = v4fVec.w;
};

get zxyx(): IVec4{
	return vec4(this.z, this.x, this.y, this.x);
};
set zxyx(v4fVec: IVec4){
	this.z = v4fVec.x; 	this.x = v4fVec.y;
	this.y = v4fVec.z; 	this.x = v4fVec.w;
};

get zxyy(): IVec4{
	return vec4(this.z, this.x, this.y, this.y);
};
set zxyy(v4fVec: IVec4){
	this.z = v4fVec.x; 	this.x = v4fVec.y;
	this.y = v4fVec.z; 	this.y = v4fVec.w;
};

get zxyz(): IVec4{
	return vec4(this.z, this.x, this.y, this.z);
};
set zxyz(v4fVec: IVec4){
	this.z = v4fVec.x; 	this.x = v4fVec.y;
	this.y = v4fVec.z; 	this.z = v4fVec.w;
};

get zxyw(): IVec4{
	return vec4(this.z, this.x, this.y, this.w);
};
set zxyw(v4fVec: IVec4){
	this.z = v4fVec.x; 	this.x = v4fVec.y;
	this.y = v4fVec.z; 	this.w = v4fVec.w;
};

get zxzx(): IVec4{
	return vec4(this.z, this.x, this.z, this.x);
};
set zxzx(v4fVec: IVec4){
	this.z = v4fVec.x; 	this.x = v4fVec.y;
	this.z = v4fVec.z; 	this.x = v4fVec.w;
};

get zxzy(): IVec4{
	return vec4(this.z, this.x, this.z, this.y);
};
set zxzy(v4fVec: IVec4){
	this.z = v4fVec.x; 	this.x = v4fVec.y;
	this.z = v4fVec.z; 	this.y = v4fVec.w;
};

get zxzz(): IVec4{
	return vec4(this.z, this.x, this.z, this.z);
};
set zxzz(v4fVec: IVec4){
	this.z = v4fVec.x; 	this.x = v4fVec.y;
	this.z = v4fVec.z; 	this.z = v4fVec.w;
};

get zxzw(): IVec4{
	return vec4(this.z, this.x, this.z, this.w);
};
set zxzw(v4fVec: IVec4){
	this.z = v4fVec.x; 	this.x = v4fVec.y;
	this.z = v4fVec.z; 	this.w = v4fVec.w;
};

get zxwx(): IVec4{
	return vec4(this.z, this.x, this.w, this.x);
};
set zxwx(v4fVec: IVec4){
	this.z = v4fVec.x; 	this.x = v4fVec.y;
	this.w = v4fVec.z; 	this.x = v4fVec.w;
};

get zxwy(): IVec4{
	return vec4(this.z, this.x, this.w, this.y);
};
set zxwy(v4fVec: IVec4){
	this.z = v4fVec.x; 	this.x = v4fVec.y;
	this.w = v4fVec.z; 	this.y = v4fVec.w;
};

get zxwz(): IVec4{
	return vec4(this.z, this.x, this.w, this.z);
};
set zxwz(v4fVec: IVec4){
	this.z = v4fVec.x; 	this.x = v4fVec.y;
	this.w = v4fVec.z; 	this.z = v4fVec.w;
};

get zxww(): IVec4{
	return vec4(this.z, this.x, this.w, this.w);
};
set zxww(v4fVec: IVec4){
	this.z = v4fVec.x; 	this.x = v4fVec.y;
	this.w = v4fVec.z; 	this.w = v4fVec.w;
};

get zyxx(): IVec4{
	return vec4(this.z, this.y, this.x, this.x);
};
set zyxx(v4fVec: IVec4){
	this.z = v4fVec.x; 	this.y = v4fVec.y;
	this.x = v4fVec.z; 	this.x = v4fVec.w;
};

get zyxy(): IVec4{
	return vec4(this.z, this.y, this.x, this.y);
};
set zyxy(v4fVec: IVec4){
	this.z = v4fVec.x; 	this.y = v4fVec.y;
	this.x = v4fVec.z; 	this.y = v4fVec.w;
};

get zyxz(): IVec4{
	return vec4(this.z, this.y, this.x, this.z);
};
set zyxz(v4fVec: IVec4){
	this.z = v4fVec.x; 	this.y = v4fVec.y;
	this.x = v4fVec.z; 	this.z = v4fVec.w;
};

get zyxw(): IVec4{
	return vec4(this.z, this.y, this.x, this.w);
};
set zyxw(v4fVec: IVec4){
	this.z = v4fVec.x; 	this.y = v4fVec.y;
	this.x = v4fVec.z; 	this.w = v4fVec.w;
};

get zyyx(): IVec4{
	return vec4(this.z, this.y, this.y, this.x);
};
set zyyx(v4fVec: IVec4){
	this.z = v4fVec.x; 	this.y = v4fVec.y;
	this.y = v4fVec.z; 	this.x = v4fVec.w;
};

get zyyy(): IVec4{
	return vec4(this.z, this.y, this.y, this.y);
};
set zyyy(v4fVec: IVec4){
	this.z = v4fVec.x; 	this.y = v4fVec.y;
	this.y = v4fVec.z; 	this.y = v4fVec.w;
};

get zyyz(): IVec4{
	return vec4(this.z, this.y, this.y, this.z);
};
set zyyz(v4fVec: IVec4){
	this.z = v4fVec.x; 	this.y = v4fVec.y;
	this.y = v4fVec.z; 	this.z = v4fVec.w;
};

get zyyw(): IVec4{
	return vec4(this.z, this.y, this.y, this.w);
};
set zyyw(v4fVec: IVec4){
	this.z = v4fVec.x; 	this.y = v4fVec.y;
	this.y = v4fVec.z; 	this.w = v4fVec.w;
};

get zyzx(): IVec4{
	return vec4(this.z, this.y, this.z, this.x);
};
set zyzx(v4fVec: IVec4){
	this.z = v4fVec.x; 	this.y = v4fVec.y;
	this.z = v4fVec.z; 	this.x = v4fVec.w;
};

get zyzy(): IVec4{
	return vec4(this.z, this.y, this.z, this.y);
};
set zyzy(v4fVec: IVec4){
	this.z = v4fVec.x; 	this.y = v4fVec.y;
	this.z = v4fVec.z; 	this.y = v4fVec.w;
};

get zyzz(): IVec4{
	return vec4(this.z, this.y, this.z, this.z);
};
set zyzz(v4fVec: IVec4){
	this.z = v4fVec.x; 	this.y = v4fVec.y;
	this.z = v4fVec.z; 	this.z = v4fVec.w;
};

get zyzw(): IVec4{
	return vec4(this.z, this.y, this.z, this.w);
};
set zyzw(v4fVec: IVec4){
	this.z = v4fVec.x; 	this.y = v4fVec.y;
	this.z = v4fVec.z; 	this.w = v4fVec.w;
};

get zywx(): IVec4{
	return vec4(this.z, this.y, this.w, this.x);
};
set zywx(v4fVec: IVec4){
	this.z = v4fVec.x; 	this.y = v4fVec.y;
	this.w = v4fVec.z; 	this.x = v4fVec.w;
};

get zywy(): IVec4{
	return vec4(this.z, this.y, this.w, this.y);
};
set zywy(v4fVec: IVec4){
	this.z = v4fVec.x; 	this.y = v4fVec.y;
	this.w = v4fVec.z; 	this.y = v4fVec.w;
};

get zywz(): IVec4{
	return vec4(this.z, this.y, this.w, this.z);
};
set zywz(v4fVec: IVec4){
	this.z = v4fVec.x; 	this.y = v4fVec.y;
	this.w = v4fVec.z; 	this.z = v4fVec.w;
};

get zyww(): IVec4{
	return vec4(this.z, this.y, this.w, this.w);
};
set zyww(v4fVec: IVec4){
	this.z = v4fVec.x; 	this.y = v4fVec.y;
	this.w = v4fVec.z; 	this.w = v4fVec.w;
};

get zzxx(): IVec4{
	return vec4(this.z, this.z, this.x, this.x);
};
set zzxx(v4fVec: IVec4){
	this.z = v4fVec.x; 	this.z = v4fVec.y;
	this.x = v4fVec.z; 	this.x = v4fVec.w;
};

get zzxy(): IVec4{
	return vec4(this.z, this.z, this.x, this.y);
};
set zzxy(v4fVec: IVec4){
	this.z = v4fVec.x; 	this.z = v4fVec.y;
	this.x = v4fVec.z; 	this.y = v4fVec.w;
};

get zzxz(): IVec4{
	return vec4(this.z, this.z, this.x, this.z);
};
set zzxz(v4fVec: IVec4){
	this.z = v4fVec.x; 	this.z = v4fVec.y;
	this.x = v4fVec.z; 	this.z = v4fVec.w;
};

get zzxw(): IVec4{
	return vec4(this.z, this.z, this.x, this.w);
};
set zzxw(v4fVec: IVec4){
	this.z = v4fVec.x; 	this.z = v4fVec.y;
	this.x = v4fVec.z; 	this.w = v4fVec.w;
};

get zzyx(): IVec4{
	return vec4(this.z, this.z, this.y, this.x);
};
set zzyx(v4fVec: IVec4){
	this.z = v4fVec.x; 	this.z = v4fVec.y;
	this.y = v4fVec.z; 	this.x = v4fVec.w;
};

get zzyy(): IVec4{
	return vec4(this.z, this.z, this.y, this.y);
};
set zzyy(v4fVec: IVec4){
	this.z = v4fVec.x; 	this.z = v4fVec.y;
	this.y = v4fVec.z; 	this.y = v4fVec.w;
};

get zzyz(): IVec4{
	return vec4(this.z, this.z, this.y, this.z);
};
set zzyz(v4fVec: IVec4){
	this.z = v4fVec.x; 	this.z = v4fVec.y;
	this.y = v4fVec.z; 	this.z = v4fVec.w;
};

get zzyw(): IVec4{
	return vec4(this.z, this.z, this.y, this.w);
};
set zzyw(v4fVec: IVec4){
	this.z = v4fVec.x; 	this.z = v4fVec.y;
	this.y = v4fVec.z; 	this.w = v4fVec.w;
};

get zzzx(): IVec4{
	return vec4(this.z, this.z, this.z, this.x);
};
set zzzx(v4fVec: IVec4){
	this.z = v4fVec.x; 	this.z = v4fVec.y;
	this.z = v4fVec.z; 	this.x = v4fVec.w;
};

get zzzy(): IVec4{
	return vec4(this.z, this.z, this.z, this.y);
};
set zzzy(v4fVec: IVec4){
	this.z = v4fVec.x; 	this.z = v4fVec.y;
	this.z = v4fVec.z; 	this.y = v4fVec.w;
};

get zzzz(): IVec4{
	return vec4(this.z, this.z, this.z, this.z);
};
set zzzz(v4fVec: IVec4){
	this.z = v4fVec.x; 	this.z = v4fVec.y;
	this.z = v4fVec.z; 	this.z = v4fVec.w;
};

get zzzw(): IVec4{
	return vec4(this.z, this.z, this.z, this.w);
};
set zzzw(v4fVec: IVec4){
	this.z = v4fVec.x; 	this.z = v4fVec.y;
	this.z = v4fVec.z; 	this.w = v4fVec.w;
};

get zzwx(): IVec4{
	return vec4(this.z, this.z, this.w, this.x);
};
set zzwx(v4fVec: IVec4){
	this.z = v4fVec.x; 	this.z = v4fVec.y;
	this.w = v4fVec.z; 	this.x = v4fVec.w;
};

get zzwy(): IVec4{
	return vec4(this.z, this.z, this.w, this.y);
};
set zzwy(v4fVec: IVec4){
	this.z = v4fVec.x; 	this.z = v4fVec.y;
	this.w = v4fVec.z; 	this.y = v4fVec.w;
};

get zzwz(): IVec4{
	return vec4(this.z, this.z, this.w, this.z);
};
set zzwz(v4fVec: IVec4){
	this.z = v4fVec.x; 	this.z = v4fVec.y;
	this.w = v4fVec.z; 	this.z = v4fVec.w;
};

get zzww(): IVec4{
	return vec4(this.z, this.z, this.w, this.w);
};
set zzww(v4fVec: IVec4){
	this.z = v4fVec.x; 	this.z = v4fVec.y;
	this.w = v4fVec.z; 	this.w = v4fVec.w;
};

get zwxx(): IVec4{
	return vec4(this.z, this.w, this.x, this.x);
};
set zwxx(v4fVec: IVec4){
	this.z = v4fVec.x; 	this.w = v4fVec.y;
	this.x = v4fVec.z; 	this.x = v4fVec.w;
};

get zwxy(): IVec4{
	return vec4(this.z, this.w, this.x, this.y);
};
set zwxy(v4fVec: IVec4){
	this.z = v4fVec.x; 	this.w = v4fVec.y;
	this.x = v4fVec.z; 	this.y = v4fVec.w;
};

get zwxz(): IVec4{
	return vec4(this.z, this.w, this.x, this.z);
};
set zwxz(v4fVec: IVec4){
	this.z = v4fVec.x; 	this.w = v4fVec.y;
	this.x = v4fVec.z; 	this.z = v4fVec.w;
};

get zwxw(): IVec4{
	return vec4(this.z, this.w, this.x, this.w);
};
set zwxw(v4fVec: IVec4){
	this.z = v4fVec.x; 	this.w = v4fVec.y;
	this.x = v4fVec.z; 	this.w = v4fVec.w;
};

get zwyx(): IVec4{
	return vec4(this.z, this.w, this.y, this.x);
};
set zwyx(v4fVec: IVec4){
	this.z = v4fVec.x; 	this.w = v4fVec.y;
	this.y = v4fVec.z; 	this.x = v4fVec.w;
};

get zwyy(): IVec4{
	return vec4(this.z, this.w, this.y, this.y);
};
set zwyy(v4fVec: IVec4){
	this.z = v4fVec.x; 	this.w = v4fVec.y;
	this.y = v4fVec.z; 	this.y = v4fVec.w;
};

get zwyz(): IVec4{
	return vec4(this.z, this.w, this.y, this.z);
};
set zwyz(v4fVec: IVec4){
	this.z = v4fVec.x; 	this.w = v4fVec.y;
	this.y = v4fVec.z; 	this.z = v4fVec.w;
};

get zwyw(): IVec4{
	return vec4(this.z, this.w, this.y, this.w);
};
set zwyw(v4fVec: IVec4){
	this.z = v4fVec.x; 	this.w = v4fVec.y;
	this.y = v4fVec.z; 	this.w = v4fVec.w;
};

get zwzx(): IVec4{
	return vec4(this.z, this.w, this.z, this.x);
};
set zwzx(v4fVec: IVec4){
	this.z = v4fVec.x; 	this.w = v4fVec.y;
	this.z = v4fVec.z; 	this.x = v4fVec.w;
};

get zwzy(): IVec4{
	return vec4(this.z, this.w, this.z, this.y);
};
set zwzy(v4fVec: IVec4){
	this.z = v4fVec.x; 	this.w = v4fVec.y;
	this.z = v4fVec.z; 	this.y = v4fVec.w;
};

get zwzz(): IVec4{
	return vec4(this.z, this.w, this.z, this.z);
};
set zwzz(v4fVec: IVec4){
	this.z = v4fVec.x; 	this.w = v4fVec.y;
	this.z = v4fVec.z; 	this.z = v4fVec.w;
};

get zwzw(): IVec4{
	return vec4(this.z, this.w, this.z, this.w);
};
set zwzw(v4fVec: IVec4){
	this.z = v4fVec.x; 	this.w = v4fVec.y;
	this.z = v4fVec.z; 	this.w = v4fVec.w;
};

get zwwx(): IVec4{
	return vec4(this.z, this.w, this.w, this.x);
};
set zwwx(v4fVec: IVec4){
	this.z = v4fVec.x; 	this.w = v4fVec.y;
	this.w = v4fVec.z; 	this.x = v4fVec.w;
};

get zwwy(): IVec4{
	return vec4(this.z, this.w, this.w, this.y);
};
set zwwy(v4fVec: IVec4){
	this.z = v4fVec.x; 	this.w = v4fVec.y;
	this.w = v4fVec.z; 	this.y = v4fVec.w;
};

get zwwz(): IVec4{
	return vec4(this.z, this.w, this.w, this.z);
};
set zwwz(v4fVec: IVec4){
	this.z = v4fVec.x; 	this.w = v4fVec.y;
	this.w = v4fVec.z; 	this.z = v4fVec.w;
};

get zwww(): IVec4{
	return vec4(this.z, this.w, this.w, this.w);
};
set zwww(v4fVec: IVec4){
	this.z = v4fVec.x; 	this.w = v4fVec.y;
	this.w = v4fVec.z; 	this.w = v4fVec.w;
};

get wxxx(): IVec4{
	return vec4(this.w, this.x, this.x, this.x);
};
set wxxx(v4fVec: IVec4){
	this.w = v4fVec.x; 	this.x = v4fVec.y;
	this.x = v4fVec.z; 	this.x = v4fVec.w;
};

get wxxy(): IVec4{
	return vec4(this.w, this.x, this.x, this.y);
};
set wxxy(v4fVec: IVec4){
	this.w = v4fVec.x; 	this.x = v4fVec.y;
	this.x = v4fVec.z; 	this.y = v4fVec.w;
};

get wxxz(): IVec4{
	return vec4(this.w, this.x, this.x, this.z);
};
set wxxz(v4fVec: IVec4){
	this.w = v4fVec.x; 	this.x = v4fVec.y;
	this.x = v4fVec.z; 	this.z = v4fVec.w;
};

get wxxw(): IVec4{
	return vec4(this.w, this.x, this.x, this.w);
};
set wxxw(v4fVec: IVec4){
	this.w = v4fVec.x; 	this.x = v4fVec.y;
	this.x = v4fVec.z; 	this.w = v4fVec.w;
};

get wxyx(): IVec4{
	return vec4(this.w, this.x, this.y, this.x);
};
set wxyx(v4fVec: IVec4){
	this.w = v4fVec.x; 	this.x = v4fVec.y;
	this.y = v4fVec.z; 	this.x = v4fVec.w;
};

get wxyy(): IVec4{
	return vec4(this.w, this.x, this.y, this.y);
};
set wxyy(v4fVec: IVec4){
	this.w = v4fVec.x; 	this.x = v4fVec.y;
	this.y = v4fVec.z; 	this.y = v4fVec.w;
};

get wxyz(): IVec4{
	return vec4(this.w, this.x, this.y, this.z);
};
set wxyz(v4fVec: IVec4){
	this.w = v4fVec.x; 	this.x = v4fVec.y;
	this.y = v4fVec.z; 	this.z = v4fVec.w;
};

get wxyw(): IVec4{
	return vec4(this.w, this.x, this.y, this.w);
};
set wxyw(v4fVec: IVec4){
	this.w = v4fVec.x; 	this.x = v4fVec.y;
	this.y = v4fVec.z; 	this.w = v4fVec.w;
};

get wxzx(): IVec4{
	return vec4(this.w, this.x, this.z, this.x);
};
set wxzx(v4fVec: IVec4){
	this.w = v4fVec.x; 	this.x = v4fVec.y;
	this.z = v4fVec.z; 	this.x = v4fVec.w;
};

get wxzy(): IVec4{
	return vec4(this.w, this.x, this.z, this.y);
};
set wxzy(v4fVec: IVec4){
	this.w = v4fVec.x; 	this.x = v4fVec.y;
	this.z = v4fVec.z; 	this.y = v4fVec.w;
};

get wxzz(): IVec4{
	return vec4(this.w, this.x, this.z, this.z);
};
set wxzz(v4fVec: IVec4){
	this.w = v4fVec.x; 	this.x = v4fVec.y;
	this.z = v4fVec.z; 	this.z = v4fVec.w;
};

get wxzw(): IVec4{
	return vec4(this.w, this.x, this.z, this.w);
};
set wxzw(v4fVec: IVec4){
	this.w = v4fVec.x; 	this.x = v4fVec.y;
	this.z = v4fVec.z; 	this.w = v4fVec.w;
};

get wxwx(): IVec4{
	return vec4(this.w, this.x, this.w, this.x);
};
set wxwx(v4fVec: IVec4){
	this.w = v4fVec.x; 	this.x = v4fVec.y;
	this.w = v4fVec.z; 	this.x = v4fVec.w;
};

get wxwy(): IVec4{
	return vec4(this.w, this.x, this.w, this.y);
};
set wxwy(v4fVec: IVec4){
	this.w = v4fVec.x; 	this.x = v4fVec.y;
	this.w = v4fVec.z; 	this.y = v4fVec.w;
};

get wxwz(): IVec4{
	return vec4(this.w, this.x, this.w, this.z);
};
set wxwz(v4fVec: IVec4){
	this.w = v4fVec.x; 	this.x = v4fVec.y;
	this.w = v4fVec.z; 	this.z = v4fVec.w;
};

get wxww(): IVec4{
	return vec4(this.w, this.x, this.w, this.w);
};
set wxww(v4fVec: IVec4){
	this.w = v4fVec.x; 	this.x = v4fVec.y;
	this.w = v4fVec.z; 	this.w = v4fVec.w;
};

get wyxx(): IVec4{
	return vec4(this.w, this.y, this.x, this.x);
};
set wyxx(v4fVec: IVec4){
	this.w = v4fVec.x; 	this.y = v4fVec.y;
	this.x = v4fVec.z; 	this.x = v4fVec.w;
};

get wyxy(): IVec4{
	return vec4(this.w, this.y, this.x, this.y);
};
set wyxy(v4fVec: IVec4){
	this.w = v4fVec.x; 	this.y = v4fVec.y;
	this.x = v4fVec.z; 	this.y = v4fVec.w;
};

get wyxz(): IVec4{
	return vec4(this.w, this.y, this.x, this.z);
};
set wyxz(v4fVec: IVec4){
	this.w = v4fVec.x; 	this.y = v4fVec.y;
	this.x = v4fVec.z; 	this.z = v4fVec.w;
};

get wyxw(): IVec4{
	return vec4(this.w, this.y, this.x, this.w);
};
set wyxw(v4fVec: IVec4){
	this.w = v4fVec.x; 	this.y = v4fVec.y;
	this.x = v4fVec.z; 	this.w = v4fVec.w;
};

get wyyx(): IVec4{
	return vec4(this.w, this.y, this.y, this.x);
};
set wyyx(v4fVec: IVec4){
	this.w = v4fVec.x; 	this.y = v4fVec.y;
	this.y = v4fVec.z; 	this.x = v4fVec.w;
};

get wyyy(): IVec4{
	return vec4(this.w, this.y, this.y, this.y);
};
set wyyy(v4fVec: IVec4){
	this.w = v4fVec.x; 	this.y = v4fVec.y;
	this.y = v4fVec.z; 	this.y = v4fVec.w;
};

get wyyz(): IVec4{
	return vec4(this.w, this.y, this.y, this.z);
};
set wyyz(v4fVec: IVec4){
	this.w = v4fVec.x; 	this.y = v4fVec.y;
	this.y = v4fVec.z; 	this.z = v4fVec.w;
};

get wyyw(): IVec4{
	return vec4(this.w, this.y, this.y, this.w);
};
set wyyw(v4fVec: IVec4){
	this.w = v4fVec.x; 	this.y = v4fVec.y;
	this.y = v4fVec.z; 	this.w = v4fVec.w;
};

get wyzx(): IVec4{
	return vec4(this.w, this.y, this.z, this.x);
};
set wyzx(v4fVec: IVec4){
	this.w = v4fVec.x; 	this.y = v4fVec.y;
	this.z = v4fVec.z; 	this.x = v4fVec.w;
};

get wyzy(): IVec4{
	return vec4(this.w, this.y, this.z, this.y);
};
set wyzy(v4fVec: IVec4){
	this.w = v4fVec.x; 	this.y = v4fVec.y;
	this.z = v4fVec.z; 	this.y = v4fVec.w;
};

get wyzz(): IVec4{
	return vec4(this.w, this.y, this.z, this.z);
};
set wyzz(v4fVec: IVec4){
	this.w = v4fVec.x; 	this.y = v4fVec.y;
	this.z = v4fVec.z; 	this.z = v4fVec.w;
};

get wyzw(): IVec4{
	return vec4(this.w, this.y, this.z, this.w);
};
set wyzw(v4fVec: IVec4){
	this.w = v4fVec.x; 	this.y = v4fVec.y;
	this.z = v4fVec.z; 	this.w = v4fVec.w;
};

get wywx(): IVec4{
	return vec4(this.w, this.y, this.w, this.x);
};
set wywx(v4fVec: IVec4){
	this.w = v4fVec.x; 	this.y = v4fVec.y;
	this.w = v4fVec.z; 	this.x = v4fVec.w;
};

get wywy(): IVec4{
	return vec4(this.w, this.y, this.w, this.y);
};
set wywy(v4fVec: IVec4){
	this.w = v4fVec.x; 	this.y = v4fVec.y;
	this.w = v4fVec.z; 	this.y = v4fVec.w;
};

get wywz(): IVec4{
	return vec4(this.w, this.y, this.w, this.z);
};
set wywz(v4fVec: IVec4){
	this.w = v4fVec.x; 	this.y = v4fVec.y;
	this.w = v4fVec.z; 	this.z = v4fVec.w;
};

get wyww(): IVec4{
	return vec4(this.w, this.y, this.w, this.w);
};
set wyww(v4fVec: IVec4){
	this.w = v4fVec.x; 	this.y = v4fVec.y;
	this.w = v4fVec.z; 	this.w = v4fVec.w;
};

get wzxx(): IVec4{
	return vec4(this.w, this.z, this.x, this.x);
};
set wzxx(v4fVec: IVec4){
	this.w = v4fVec.x; 	this.z = v4fVec.y;
	this.x = v4fVec.z; 	this.x = v4fVec.w;
};

get wzxy(): IVec4{
	return vec4(this.w, this.z, this.x, this.y);
};
set wzxy(v4fVec: IVec4){
	this.w = v4fVec.x; 	this.z = v4fVec.y;
	this.x = v4fVec.z; 	this.y = v4fVec.w;
};

get wzxz(): IVec4{
	return vec4(this.w, this.z, this.x, this.z);
};
set wzxz(v4fVec: IVec4){
	this.w = v4fVec.x; 	this.z = v4fVec.y;
	this.x = v4fVec.z; 	this.z = v4fVec.w;
};

get wzxw(): IVec4{
	return vec4(this.w, this.z, this.x, this.w);
};
set wzxw(v4fVec: IVec4){
	this.w = v4fVec.x; 	this.z = v4fVec.y;
	this.x = v4fVec.z; 	this.w = v4fVec.w;
};

get wzyx(): IVec4{
	return vec4(this.w, this.z, this.y, this.x);
};
set wzyx(v4fVec: IVec4){
	this.w = v4fVec.x; 	this.z = v4fVec.y;
	this.y = v4fVec.z; 	this.x = v4fVec.w;
};

get wzyy(): IVec4{
	return vec4(this.w, this.z, this.y, this.y);
};
set wzyy(v4fVec: IVec4){
	this.w = v4fVec.x; 	this.z = v4fVec.y;
	this.y = v4fVec.z; 	this.y = v4fVec.w;
};

get wzyz(): IVec4{
	return vec4(this.w, this.z, this.y, this.z);
};
set wzyz(v4fVec: IVec4){
	this.w = v4fVec.x; 	this.z = v4fVec.y;
	this.y = v4fVec.z; 	this.z = v4fVec.w;
};

get wzyw(): IVec4{
	return vec4(this.w, this.z, this.y, this.w);
};
set wzyw(v4fVec: IVec4){
	this.w = v4fVec.x; 	this.z = v4fVec.y;
	this.y = v4fVec.z; 	this.w = v4fVec.w;
};

get wzzx(): IVec4{
	return vec4(this.w, this.z, this.z, this.x);
};
set wzzx(v4fVec: IVec4){
	this.w = v4fVec.x; 	this.z = v4fVec.y;
	this.z = v4fVec.z; 	this.x = v4fVec.w;
};

get wzzy(): IVec4{
	return vec4(this.w, this.z, this.z, this.y);
};
set wzzy(v4fVec: IVec4){
	this.w = v4fVec.x; 	this.z = v4fVec.y;
	this.z = v4fVec.z; 	this.y = v4fVec.w;
};

get wzzz(): IVec4{
	return vec4(this.w, this.z, this.z, this.z);
};
set wzzz(v4fVec: IVec4){
	this.w = v4fVec.x; 	this.z = v4fVec.y;
	this.z = v4fVec.z; 	this.z = v4fVec.w;
};

get wzzw(): IVec4{
	return vec4(this.w, this.z, this.z, this.w);
};
set wzzw(v4fVec: IVec4){
	this.w = v4fVec.x; 	this.z = v4fVec.y;
	this.z = v4fVec.z; 	this.w = v4fVec.w;
};

get wzwx(): IVec4{
	return vec4(this.w, this.z, this.w, this.x);
};
set wzwx(v4fVec: IVec4){
	this.w = v4fVec.x; 	this.z = v4fVec.y;
	this.w = v4fVec.z; 	this.x = v4fVec.w;
};

get wzwy(): IVec4{
	return vec4(this.w, this.z, this.w, this.y);
};
set wzwy(v4fVec: IVec4){
	this.w = v4fVec.x; 	this.z = v4fVec.y;
	this.w = v4fVec.z; 	this.y = v4fVec.w;
};

get wzwz(): IVec4{
	return vec4(this.w, this.z, this.w, this.z);
};
set wzwz(v4fVec: IVec4){
	this.w = v4fVec.x; 	this.z = v4fVec.y;
	this.w = v4fVec.z; 	this.z = v4fVec.w;
};

get wzww(): IVec4{
	return vec4(this.w, this.z, this.w, this.w);
};
set wzww(v4fVec: IVec4){
	this.w = v4fVec.x; 	this.z = v4fVec.y;
	this.w = v4fVec.z; 	this.w = v4fVec.w;
};

get wwxx(): IVec4{
	return vec4(this.w, this.w, this.x, this.x);
};
set wwxx(v4fVec: IVec4){
	this.w = v4fVec.x; 	this.w = v4fVec.y;
	this.x = v4fVec.z; 	this.x = v4fVec.w;
};

get wwxy(): IVec4{
	return vec4(this.w, this.w, this.x, this.y);
};
set wwxy(v4fVec: IVec4){
	this.w = v4fVec.x; 	this.w = v4fVec.y;
	this.x = v4fVec.z; 	this.y = v4fVec.w;
};

get wwxz(): IVec4{
	return vec4(this.w, this.w, this.x, this.z);
};
set wwxz(v4fVec: IVec4){
	this.w = v4fVec.x; 	this.w = v4fVec.y;
	this.x = v4fVec.z; 	this.z = v4fVec.w;
};

get wwxw(): IVec4{
	return vec4(this.w, this.w, this.x, this.w);
};
set wwxw(v4fVec: IVec4){
	this.w = v4fVec.x; 	this.w = v4fVec.y;
	this.x = v4fVec.z; 	this.w = v4fVec.w;
};

get wwyx(): IVec4{
	return vec4(this.w, this.w, this.y, this.x);
};
set wwyx(v4fVec: IVec4){
	this.w = v4fVec.x; 	this.w = v4fVec.y;
	this.y = v4fVec.z; 	this.x = v4fVec.w;
};

get wwyy(): IVec4{
	return vec4(this.w, this.w, this.y, this.y);
};
set wwyy(v4fVec: IVec4){
	this.w = v4fVec.x; 	this.w = v4fVec.y;
	this.y = v4fVec.z; 	this.y = v4fVec.w;
};

get wwyz(): IVec4{
	return vec4(this.w, this.w, this.y, this.z);
};
set wwyz(v4fVec: IVec4){
	this.w = v4fVec.x; 	this.w = v4fVec.y;
	this.y = v4fVec.z; 	this.z = v4fVec.w;
};

get wwyw(): IVec4{
	return vec4(this.w, this.w, this.y, this.w);
};
set wwyw(v4fVec: IVec4){
	this.w = v4fVec.x; 	this.w = v4fVec.y;
	this.y = v4fVec.z; 	this.w = v4fVec.w;
};

get wwzx(): IVec4{
	return vec4(this.w, this.w, this.z, this.x);
};
set wwzx(v4fVec: IVec4){
	this.w = v4fVec.x; 	this.w = v4fVec.y;
	this.z = v4fVec.z; 	this.x = v4fVec.w;
};

get wwzy(): IVec4{
	return vec4(this.w, this.w, this.z, this.y);
};
set wwzy(v4fVec: IVec4){
	this.w = v4fVec.x; 	this.w = v4fVec.y;
	this.z = v4fVec.z; 	this.y = v4fVec.w;
};

get wwzz(): IVec4{
	return vec4(this.w, this.w, this.z, this.z);
};
set wwzz(v4fVec: IVec4){
	this.w = v4fVec.x; 	this.w = v4fVec.y;
	this.z = v4fVec.z; 	this.z = v4fVec.w;
};

get wwzw(): IVec4{
	return vec4(this.w, this.w, this.z, this.w);
};
set wwzw(v4fVec: IVec4){
	this.w = v4fVec.x; 	this.w = v4fVec.y;
	this.z = v4fVec.z; 	this.w = v4fVec.w;
};

get wwwx(): IVec4{
	return vec4(this.w, this.w, this.w, this.x);
};
set wwwx(v4fVec: IVec4){
	this.w = v4fVec.x; 	this.w = v4fVec.y;
	this.w = v4fVec.z; 	this.x = v4fVec.w;
};

get wwwy(): IVec4{
	return vec4(this.w, this.w, this.w, this.y);
};
set wwwy(v4fVec: IVec4){
	this.w = v4fVec.x; 	this.w = v4fVec.y;
	this.w = v4fVec.z; 	this.y = v4fVec.w;
};

get wwwz(): IVec4{
	return vec4(this.w, this.w, this.w, this.z);
};
set wwwz(v4fVec: IVec4){
	this.w = v4fVec.x; 	this.w = v4fVec.y;
	this.w = v4fVec.z; 	this.z = v4fVec.w;
};

get wwww(): IVec4{
	return vec4(this.w, this.w, this.w, this.w);
};
set wwww(v4fVec: IVec4){
	this.w = v4fVec.x; 	this.w = v4fVec.y;
	this.w = v4fVec.z; 	this.w = v4fVec.w;
};

        constructor();
        constructor(fValue:  number );
        constructor(v4fVec: IVec4);
        constructor(pArray:  number []);
        constructor(fValue:  number , v3fVec: IVec3);
        constructor(v2fVec1: IVec2, v2fVec2: IVec2);
        constructor(v3fVec: IVec3, fValue:  number );
        constructor(fValue1:  number , fValue2:  number , v2fVec: IVec2);
        constructor(fValue1:  number , v2fVec: IVec2, fValue2:  number );
        constructor(v2fVec: IVec2 ,fValue1:  number , fValue2:  number );
        constructor(fValue1:  number , fValue2:  number , fValue3:  number , fValue4:  number );
        constructor(fValue1?, fValue2?, fValue3?, fValue4?){
            var nArgumentsLength:  number  = arguments.length;
            var v4fVec: IVec4 = this;

// if (<any>this === window || <any>this === akra || <any>this === akra.math) {
//     v4fVec = Vec4.stack[Vec4.stackPosition ++];

//     if(Vec4.stackPosition == Vec4.stackSize){
//         Vec4.stackPosition = 0;
//     }
// }

            switch(nArgumentsLength) {
                case 1:
                    v4fVec.set(arguments[0]);
                    break;
                case 2:
                    v4fVec.set(arguments[0],arguments[1]);
                    break;
                case 3:
                    v4fVec.set(arguments[0],arguments[1], arguments[2]);
                    break;
                case 4:
                    v4fVec.set(arguments[0],arguments[1], arguments[2], arguments[3]);
                    break;
                default:
                    v4fVec.x = v4fVec.y = v4fVec.z = v4fVec.w = 0.;
                    break;
            }
        };

        set(): IVec4;
        set(fValue:  number ): IVec4;
        set(v4fVec: IVec4): IVec4;
        set(c4fColor: IColorValue): IVec4;
        set(pArray:  number []): IVec4;
        set(fValue:  number , v3fVec: IVec3): IVec4;
        set(v2fVec1: IVec2, v2fVec2: IVec2): IVec4;
        set(v3fVec: IVec3, fValue:  number ): IVec4;
        set(fValue1:  number , fValue2:  number , v2fVec: IVec2): IVec4;
        set(fValue1:  number , v2fVec: IVec2, fValue2:  number ): IVec4;
        set(v2fVec: IVec2, fValue1:  number , fValue2:  number ): IVec4;
        set(fValue1:  number , fValue2:  number , fValue3:  number , fValue4:  number ): IVec4;
        set(fValue1?, fValue2?, fValue3?, fValue4?): IVec4{
            var nArgumentsLength:  number  = arguments.length;

            switch(nArgumentsLength){
                case 0:
                    this.x = this.y = this.z = this.w = 0.;
                    break;
                case 1:
                    if(isFloat(arguments[0])){
                        this.x = this.y = this.z = this.w = arguments[0];
                    }
                    else if(arguments[0] instanceof Vec4){
                        var v4fVec: IVec4 = arguments[0];

                        this.x = v4fVec.x;
                        this.y = v4fVec.y;
                        this.z = v4fVec.z;
                        this.w = v4fVec.w;
                    }
//color
                    else if (isDef(arguments[0].r)) {
                        this.x = arguments[0].r;
                        this.y = arguments[0].g;
                        this.z = arguments[0].b;
                        this.w = arguments[0].a;
                    }
                    else{
//array
                        var pArray:  number [] = arguments[0];

                        this.x = pArray[0];
                        this.y = pArray[1];
                        this.z = pArray[2];
                        this.w = pArray[3];
                    }
                    break;
                case 2:
                    if(isFloat(arguments[0])){
                        var fValue:  number  = arguments[0];
                        var v3fVec: IVec3 = arguments[1];

                        this.x = fValue;
                        this.y = v3fVec.x;
                        this.z = v3fVec.y;
                        this.w = v3fVec.z;
                    }
                    else if(arguments[0] instanceof Vec2){
                        var v2fVec1: IVec2 = arguments[0];
                        var v2fVec2: IVec2 = arguments[1];

                        this.x = v2fVec1.x;
                        this.y = v2fVec1.y;
                        this.z = v2fVec2.x;
                        this.w = v2fVec2.y;
                    }
                    else{
                        var v3fVec: IVec3 = arguments[0];
                        var fValue:  number  = arguments[1];

                        this.x = v3fVec.x;
                        this.y = v3fVec.y;
                        this.z = v3fVec.z;
                        this.w = fValue;
                    }
                    break;
                case 3:
                    if(isFloat(arguments[0])){
                        var fValue1:  number  = arguments[0];

                        if(isFloat(arguments[1])){
                            var fValue2:  number  = arguments[1];
                            var v2fVec: IVec2 = arguments[2];

                            this.x = fValue1;
                            this.y = fValue2;
                            this.z = v2fVec.x;
                            this.w = v2fVec.y;
                        }
                        else{
                            var v2fVec: IVec2 = arguments[1];
                            var fValue2:  number  = arguments[2];

                            this.x = fValue1;
                            this.y = v2fVec.x;
                            this.z = v2fVec.y;
                            this.w = fValue2;
                        }
                    }
                    else{
                        var v2fVec: IVec2 = arguments[0];
                        var fValue1:  number  = arguments[1];
                        var fValue2:  number  = arguments[2];

                        this.x = v2fVec.x;
                        this.y = v2fVec.y;
                        this.z = fValue1;
                        this.w = fValue2;
                    }
                    break;
                case 4:
                    this.x = arguments[0];
                    this.y = arguments[1];
                    this.z = arguments[2];
                    this.w = arguments[3];
                    break;
            }

            return this;
        };

        /**@inline*/  clear(): IVec4{
            this.x = this.y = this.z = this.w = 0.;
            return this;
        };

        add(v4fVec: IVec4, v4fDestination?: IVec4): IVec4{
            if(!isDef(v4fDestination)){
                v4fDestination = this;
            }

            v4fDestination.x = this.x + v4fVec.x;
            v4fDestination.y = this.y + v4fVec.y;
            v4fDestination.z = this.z + v4fVec.z;
            v4fDestination.w = this.w + v4fVec.w;

            return v4fDestination;
        };

        subtract(v4fVec: IVec4, v4fDestination?: IVec4): IVec4{
            if(!isDef(v4fDestination)){
                v4fDestination = this;
            }

            v4fDestination.x = this.x - v4fVec.x;
            v4fDestination.y = this.y - v4fVec.y;
            v4fDestination.z = this.z - v4fVec.z;
            v4fDestination.w = this.w - v4fVec.w;

            return v4fDestination;
        };

        /**@inline*/  dot(v4fVec: IVec4):  number {
            return this.x*v4fVec.x + this.y*v4fVec.y + this.z*v4fVec.z + this.w*v4fVec.w;
        };

        isEqual(v4fVec: IVec4, fEps:  number  = 0.): bool{
            if(fEps === 0.){
                if(    this.x != v4fVec.x
                    || this.y != v4fVec.y
                    || this.z != v4fVec.z
                    || this.w != v4fVec.w){

                    return false;
                }
            }
            else{
                if(    abs(this.x - v4fVec.x) > fEps
                    || abs(this.y - v4fVec.y) > fEps
                    || abs(this.z - v4fVec.z) > fEps
                    || abs(this.w - v4fVec.w) > fEps){

                    return false;
                }
            }
            return true;
        };

        isClear(fEps:  number  = 0.): bool{

            if(fEps === 0.){
                if(    this.x != 0.
                    || this.y != 0.
                    || this.z != 0.
                    || this.w != 0.){

                    return false;
                }
            }
            else{
                if(    abs(this.x) > fEps
                    || abs(this.y) > fEps
                    || abs(this.z) > fEps
                    || abs(this.w) > fEps){

                    return false;
                }
            }
            return true;
        };

        negate(v4fDestination?: IVec4): IVec4{
            if(!isDef(v4fDestination)){
                v4fDestination = this;
            }

            v4fDestination.x = -this.x;
            v4fDestination.y = -this.y;
            v4fDestination.z = -this.z;
            v4fDestination.w = -this.w;

            return v4fDestination;
        };

        scale(fScale:  number , v4fDestination?: IVec4): IVec4{
            if(!isDef(v4fDestination)){
                v4fDestination = this;
            }

            v4fDestination.x = this.x*fScale;
            v4fDestination.y = this.y*fScale;
            v4fDestination.z = this.z*fScale;
            v4fDestination.w = this.w*fScale;

            return v4fDestination;
        };

        normalize(v4fDestination?: IVec4): IVec4{
            if(!isDef(v4fDestination)){
                v4fDestination = this;
            }

            var x:  number  = this.x, y:  number  = this.y, z:  number  = this.z, w:  number  = this.w;
            var fLength:  number  = sqrt(x*x + y*y +z*z + w*w);

            if(fLength !== 0.){
                var fInvLength:  number  = 1./fLength;

                x *= fInvLength;
                y *= fInvLength;
                z *= fInvLength;
                w *= fInvLength;
            }

            v4fDestination.x = x;
            v4fDestination.y = y;
            v4fDestination.z = z;
            v4fDestination.w = w;

            return v4fDestination;
        };

        /**@inline*/  length():  number {
            var x:  number  = this.x, y:  number  = this.y, z:  number  = this.z, w:  number  = this.w;
            return sqrt(x*x + y*y + z*z + w*w);
        };

        /**@inline*/  lengthSquare():  number {
            var x:  number  = this.x, y:  number  = this.y, z:  number  = this.z, w:  number  = this.w;
            return x*x + y*y + z*z + w*w;
        };

        direction(v4fVec: IVec4, v4fDestination?: IVec4): IVec4{
            if(!isDef(v4fDestination)){
                v4fDestination = this;
            }

            var x:  number  = v4fVec.x - this.x;
            var y:  number  = v4fVec.y - this.y;
            var z:  number  = v4fVec.z - this.z;
            var w:  number  = v4fVec.w - this.w;

            var fLength:  number  = sqrt(x*x + y*y + z*z + w*w);

            if(fLength !== 0.){
                var fInvLength = 1./fLength;

                x *= fInvLength;
                y *= fInvLength;
                z *= fInvLength;
                w *= fInvLength;
            }

            v4fDestination.x = x;
            v4fDestination.y = y;
            v4fDestination.z = z;
            v4fDestination.w = w;

            return v4fDestination;
        };

        mix(v4fVec: IVec4, fA:  number , v4fDestination?: IVec4): IVec4{
            if(!isDef(v4fDestination)){
                v4fDestination = this;
            }

            fA = clamp(fA,0.,1.);

            var fA1:  number  = 1. - fA;
            var fA2:  number  = fA;

            v4fDestination.x = fA1*this.x + fA2*v4fVec.x;
            v4fDestination.y = fA1*this.y + fA2*v4fVec.y;
            v4fDestination.z = fA1*this.z + fA2*v4fVec.z;
            v4fDestination.w = fA1*this.w + fA2*v4fVec.w;

            return v4fDestination;
        };

        /**@inline*/  toString(): string{
            return "[x: " + this.x + ", y: " + this.y
                        + ", z: " + this.z + ", w: " + this.w + "]";
        };

        static get stackCeil(): Vec4 { Vec4.stackPosition = Vec4.stackPosition === Vec4.stackSize - 1? 0: Vec4.stackPosition; return Vec4.stack[Vec4.stackPosition ++]; } static stackSize: number = 100; static stackPosition: number = 0; static stack: Vec4[] = (function(): Vec4[]{ var pStack: Vec4[] = new Array(Vec4.stackSize); for(var i: number = 0; i<Vec4.stackSize; i++){ pStack[i] = new Vec4(); } return pStack})();

    }
}





// module akra.math {
//     export class Mat2 {
//         private pData: Float32Array = new Float32Array(4);

//         constructor ();
//         constructor (m2f: Mat2);
//         constructor (f11: float, f12: float, f21: float, f22: float);
//         constructor (f11? , f12? , f21? , f22? ) {
//             switch (arguments.length) {
//                 case 1:
//                     this.set(f11);
//                     break;
//                 case 4:
//                     this.set(f11, f12, f21, f22);
//                     break;
//             }
//         }

//         set(): Mat2;
//         set(m2f: Mat2): Mat2;
//         set(f11: float, f12: float, f21: float, f22: float): Mat2;
//         set(f11? , f12? , f21? , f22? ): Mat2 {

//             var pData: Float32Array = this.pData;

//             switch (arguments.length) {
//                 case 1:
//                     if (isFloat(f11)) {
//                         pData[0] = pData[1] = pData[2] = pData[3] = f11;
//                     }
//                     else {
//                         //pData.set(f11.pData);
//                     }
//                     break;
//                 case 4:
//                     pData[0] = f11;
//                     pData[1] = f21;
//                     pData[2] = f12;
//                     pData[3] = f22;
//                     break;
//             }
//             return this;
//         }
//     }
// }









/**
 * @important Если внезапно задумаем перейти обратно на 
 * хранение данных в матрицах по строкам, как собственно и был�� в начале,
 * то необходимо раскомментить definы и переписать метод set, 
 * так как он ложит по столбцам
 */


// #define __a11 0
// #define __a12 1
// #define __a13 2
// #define __a21 3
// #define __a22 4
// #define __a23 5
// #define __a31 6
// #define __a32 7
// #define __a33 8











module akra {
	export interface IMat4 {} ;
	export interface IVec3 {} ;
	export interface IQuat4 {} ;

	export interface IMat3Constructor {
		();
		(fValue:  number );
		(v3fVec: IVec3);
		(m3fMat: IMat3);
		(m4fMat: IMat4);
		(pArray:  number []);
		(fValue1:  number , fValue2:  number , fValue3:  number );
		(v3fVec1: IVec3, v3fVec2: IVec3, v3fVec3: IVec3);
		(pArray1:  number [], pArray2:  number [], pArray3:  number []);
		(fValue1:  number , fValue2:  number , fValue3:  number ,
					fValue4:  number , fValue5:  number , fValue6:  number ,
					fValue7:  number , fValue8:  number , fValue9:  number );
	}

	export interface IMat3 {
		data: Float32Array;

		set(): IMat3;
		set(fValue:  number ): IMat3;
		set(v3fVec: IVec3): IMat3;
		set(m3fMat: IMat3): IMat3;
		set(m4fMat: IMat4): IMat3;
		set(pArray:  number []): IMat3;
		set(fValue1:  number , fValue2:  number , fValue3:  number ): IMat3;
		set(v3fVec1: IVec3, v3fVec2: IVec3, v3fVec3: IVec3): IMat3;
		set(pArray1:  number [], pArray2:  number [], pArray3:  number []): IMat3;
		set(fValue1:  number , fValue2:  number , fValue3:  number ,
			fValue4:  number , fValue5:  number , fValue6:  number ,
			fValue7:  number , fValue8:  number , fValue9:  number ): IMat3;

		identity(): IMat3;

		add(m3fMat: IMat3, m3fDestination?: IMat3): IMat3;
		subtract(m3fMat: IMat3, m3fDestination?: IMat3): IMat3;
		multiply(m3fMat: IMat3, m3fDestination?: IMat3): IMat3;
		multiplyVec3(v3fVec: IVec3, v3fDestination?: IVec3): IVec3;

		transpose(m3fDestination?: IMat3): IMat3;
		determinant():  number ;
		inverse(m3fDestination?: IMat3): IMat3;

		isEqual(m3fMat: IMat3, fEps?:  number ): bool;
		isDiagonal(fEps?:  number ) : bool;

		toMat4(m4fDestination?: IMat4): IMat4;
		toQuat4(q4fDestination?: IQuat4): IQuat4;
		toString(): string;

		decompose(q4fRotation: IQuat4, v3fScale: IVec3): bool;
		row(iRow:  number , v3fDestination?: IVec3): IVec3;
		column(iColumn:  number , v3fDestination?: IVec3): IVec3;
	};
};










module akra {

	export interface IVec3 {} ;
	export interface IMat3 {} ;
	export interface IMat4 {} ;

	export interface IQuat4Constructor {
		();
    	(q4fQuat: IQuat4);
    	(pArray:  number []);
    	(fValue:  number , fW:  number );
    	(v3fValue: IVec3, fW:  number );
    	(fX:  number , fY:  number , fZ:  number , fW:  number );
	}

	export interface IQuat4 {
		x:  number ;
		y:  number ;
		z:  number ;
		w:  number ;

		set(): IQuat4;
		set(q4fQuat: IQuat4): IQuat4;
		set(pArray:  number []): IQuat4;
		set(fValue:  number , fW:  number ): IQuat4;
		set(v3fValue: IVec3, fW:  number ): IQuat4;
		set(fX:  number , fY:  number , fZ:  number , fW:  number ): IQuat4;

		multiply(q4fQuat: IQuat4, q4fDestination?: IQuat4): IQuat4;
		multiplyVec3(v3fVec: IVec3, v3fDestination?: IVec3): IVec3;

		conjugate(q4fDestination?: IQuat4): IQuat4;
		inverse(q4fDestination?: IQuat4): IQuat4;

		length():  number ;
		normalize(q4fDestination?: IQuat4): IQuat4;

		calculateW(q4fDestination?: IQuat4): IQuat4;

		isEqual(q4fQuat: IQuat4, fEps?:  number , asMatrix?: bool): bool;

		getYaw():  number ;
		getPitch():  number ;
		getRoll():  number ;
		toYawPitchRoll(v3fDestination?: IVec3): IVec3;

		toMat3(m3fDestination?: IMat3): IMat3;
		toMat4(m4fDestination?: IMat4): IMat4;
		toString(): string;

		mix(q4fQuat: IQuat4, fA:  number , q4fDestination?: IQuat4, bShortestPath?: bool);
		smix(q4fQuat: IQuat4, fA:  number , q4fDestination?: IQuat4, bShortestPath?: bool);
	};
};



module akra.math {

    export class Mat3 {
	    data : Float32Array;

	    constructor();
		constructor(fValue:  number );
		constructor(v3fVec: IVec3);
		constructor(m3fMat: IMat3);
		constructor(m4fMat: IMat4);
		constructor(pArray:  number []);
		constructor(fValue1:  number , fValue2:  number , fValue3:  number );
		constructor(v3fVec1: IVec3, v3fVec2: IVec3, v3fVec3: IVec3);
		constructor(pArray1:  number [], pArray2:  number [], pArray3:  number []);
		constructor(fValue1:  number , fValue2:  number , fValue3:  number ,
					fValue4:  number , fValue5:  number , fValue6:  number ,
					fValue7:  number , fValue8:  number , fValue9:  number );

		constructor(fValue1?, fValue2?, fValue3?,
					fValue4?, fValue5?, fValue6?,
					fValue7?, fValue8?, fValue9?){


			var nArgumentsLength:  number  = arguments.length;

			switch(nArgumentsLength){
				case 1:
					this.set(arguments[0]);
					break;
				case 3:
					this.set(arguments[0], arguments[1], arguments[2]);
					break;
				case 9:
					this.set(arguments[0], arguments[1], arguments[2],
							 arguments[3], arguments[4], arguments[5],
							 arguments[6], arguments[7], arguments[8]);
					break;
				default:
					break;
			}
		};

		set(): IMat3;
		set(fValue:  number ): IMat3;
		set(v3fVec: IVec3): IMat3;
		set(m3fMat: IMat3): IMat3;
		set(m4fMat: IMat4): IMat3;
		set(pArray:  number []): IMat3;
		set(fValue1:  number , fValue2:  number , fValue3:  number ): IMat3;
		set(v3fVec1: IVec3, v3fVec2: IVec3, v3fVec3: IVec3): IMat3;
		set(pArray1:  number [], pArray2:  number [], pArray3:  number []): IMat3;
		set(fValue1:  number , fValue2:  number , fValue3:  number ,
			fValue4:  number , fValue5:  number , fValue6:  number ,
			fValue7:  number , fValue8:  number , fValue9:  number ): IMat3;

		set(fValue1?, fValue2?, fValue3?,
			fValue4?, fValue5?, fValue6?,
			fValue7?, fValue8?, fValue9?): IMat3{

			this.data = this.data || new Float32Array(9);

			var pData: Float32Array = this.data;

//без аргументов инициализируется нулями

		    var nArgumentsLength:  number  = arguments.length;
		    if(nArgumentsLength == 0){
		        pData[ 0 ] = pData[ 3 ] = pData[ 6 ] = 0;
		        pData[ 1 ] = pData[ 4 ] = pData[ 7 ] = 0;
		        pData[ 2 ] = pData[ 5 ] = pData[ 8 ] = 0;
		    }
		    if(nArgumentsLength == 1){
		        if(isFloat(arguments[0])){
		            var nValue:  number  = arguments[0];

		            pData[ 0 ] = nValue;
		            pData[ 3 ] = 0;
		            pData[ 6 ] = 0;

		            pData[ 1 ] = 0;
		            pData[ 4 ] = nValue;
		            pData[ 7 ] = 0;

		            pData[ 2 ] = 0;
		            pData[ 5 ] = 0;
		            pData[ 8 ] = nValue;
		        }

		        else if(isDef(arguments[0].data)){
		            var pElements: Float32Array = arguments[0].data;

		            if(pElements.length === 9){
//Mat3
			            pData[ 0 ] = pElements[ 0 ];
			            pData[ 3 ] = pElements[ 3 ];
			            pData[ 6 ] = pElements[ 6 ];

			            pData[ 1 ] = pElements[ 1 ];
			            pData[ 4 ] = pElements[ 4 ];
			            pData[ 7 ] = pElements[ 7 ];

			            pData[ 2 ] = pElements[ 2 ];
			            pData[ 5 ] = pElements[ 5 ];
			            pData[ 8 ] = pElements[ 8 ];
		        	}
		        	else{
//Mat4
		        		pData[ 0 ] = pElements[ 0 ];
			            pData[ 3 ] = pElements[ 4 ];
			            pData[ 6 ] = pElements[ 8 ];

			            pData[ 1 ] = pElements[ 1 ];
			            pData[ 4 ] = pElements[ 5 ];
			            pData[ 7 ] = pElements[ 9 ];

			            pData[ 2 ] = pElements[ 2 ];
			            pData[ 5 ] = pElements[ 6 ];
			            pData[ 8 ] = pElements[ 10 ];
		        	}
		        }
		        else if(arguments[0] instanceof Vec3){
		            var v3fVec: IVec3 = arguments[0];

//диагональ

		            pData[ 0 ] = v3fVec.x;
		            pData[ 3 ] = 0;
		            pData[ 6 ] = 0;

		            pData[ 1 ] = 0;
		            pData[ 4 ] = v3fVec.y;
		            pData[ 7 ] = 0;

		            pData[ 2 ] = 0;
		            pData[ 5 ] = 0;
		            pData[ 8 ] = v3fVec.z;
		        }
		        else{
		            var pElements:  number [] = arguments[0];

		            if(pElements.length == 3){
//ложим диагональ
		                pData[ 0 ] = pElements[0];
		                pData[ 3 ] = 0;
		                pData[ 6 ] = 0;

		                pData[ 1 ] = 0;
		                pData[ 4 ] = pElements[1];
		                pData[ 7 ] = 0;

		                pData[ 2 ] = 0;
		                pData[ 5 ] = 0;
		                pData[ 8 ] = pElements[2];
		            }
		            else{
		                pData[ 0 ] = pElements[ 0 ];
		                pData[ 3 ] = pElements[ 3 ];
		                pData[ 6 ] = pElements[ 6 ];

		                pData[ 1 ] = pElements[ 1 ];
		                pData[ 4 ] = pElements[ 4 ];
		                pData[ 7 ] = pElements[ 7 ];

		                pData[ 2 ] = pElements[ 2 ];
		                pData[ 5 ] = pElements[ 5 ];
		                pData[ 8 ] = pElements[ 8 ];
		            }
		        }
		    }
		    else if(nArgumentsLength == 3){
		        if(isFloat(arguments[0])){
//выставляем диагональ
		            pData[ 0 ] = arguments[0];
		            pData[ 3 ] = 0;
		            pData[ 6 ] = 0;

		            pData[ 1 ] = 0;
		            pData[ 4 ] = arguments[1];
		            pData[ 7 ] = 0;

		            pData[ 2 ] = 0;
		            pData[ 5 ] = 0;
		            pData[ 8 ] = arguments[2];
		        }
		        else{
		            var pData1,pData2,pData3;
		            if(arguments[0] instanceof Vec3){

		                var v3fVec1: IVec3 = arguments[0];
		                var v3fVec2: IVec3 = arguments[1];
		                var v3fVec3: IVec3 = arguments[2];

//ложим по столбцам

		                pData[ 0 ] = v3fVec1.x;
		                pData[ 3 ] = v3fVec2.x;
		                pData[ 6 ] = v3fVec3.x;

		                pData[ 1 ] = v3fVec1.y;
		                pData[ 4 ] = v3fVec2.y;
		                pData[ 7 ] = v3fVec3.y;

		                pData[ 2 ] = v3fVec1.z;
		                pData[ 5 ] = v3fVec2.z;
		                pData[ 8 ] = v3fVec3.z;
		            }
		            else{

		                var v3fVec1:  number [] = arguments[0];
		                var v3fVec2:  number [] = arguments[1];
		                var v3fVec3:  number [] = arguments[2];

//ложим по столбцам

		                pData[ 0 ] = v3fVec1[0];
		                pData[ 3 ] = v3fVec2[0];
		                pData[ 6 ] = v3fVec3[0];

		                pData[ 1 ] = v3fVec1[1];
		                pData[ 4 ] = v3fVec2[1];
		                pData[ 7 ] = v3fVec3[1];

		                pData[ 2 ] = v3fVec1[2];
		                pData[ 5 ] = v3fVec2[2];
		                pData[ 8 ] = v3fVec3[2];
		            }
		        }
		    }
		    else if(nArgumentsLength == 9){
//просто числа
		        pData[ 0 ] = arguments[ 0 ];
		        pData[ 3 ] = arguments[ 3 ];
		        pData[ 6 ] = arguments[ 6 ];

		        pData[ 1 ] = arguments[ 1 ];
		        pData[ 4 ] = arguments[ 4 ];
		        pData[ 7 ] = arguments[ 7 ];

		        pData[ 2 ] = arguments[ 2 ];
		        pData[ 5 ] = arguments[ 5 ];
		        pData[ 8 ] = arguments[ 8 ];
		    }

		    return this;
		};

		identity(): IMat3{
			var pData: Float32Array = this.data;

		    pData[ 0 ] = 1.;
		    pData[ 3 ] = 0.;
		    pData[ 6 ] = 0.;

		    pData[ 1 ] = 0.;
		    pData[ 4 ] = 1.;
		    pData[ 7 ] = 0.;

		    pData[ 2 ] = 0.;
		    pData[ 5 ] = 0.;
		    pData[ 8 ] = 1.;

		    return this;
		};

		add(m3fMat: IMat3, m3fDestination?: IMat3): IMat3{
			if(!isDef(m3fDestination)){
		        m3fDestination = this;
		    }

		    var pData1: Float32Array = this.data;
		    var pData2: Float32Array = m3fMat.data;
		    var pDataDestination: Float32Array = m3fDestination.data;

		    pDataDestination[ 0 ] = pData1[ 0 ] + pData2[ 0 ];
		    pDataDestination[ 3 ] = pData1[ 3 ] + pData2[ 3 ];
		    pDataDestination[ 6 ] = pData1[ 6 ] + pData2[ 6 ];

		    pDataDestination[ 1 ] = pData1[ 1 ] + pData2[ 1 ];
		    pDataDestination[ 4 ] = pData1[ 4 ] + pData2[ 4 ];
		    pDataDestination[ 7 ] = pData1[ 7 ] + pData2[ 7 ];

		    pDataDestination[ 2 ] = pData1[ 2 ] + pData2[ 2 ];
		    pDataDestination[ 5 ] = pData1[ 5 ] + pData2[ 5 ];
		    pDataDestination[ 8 ] = pData1[ 8 ] + pData2[ 8 ];

		    return m3fDestination;
		};

		subtract(m3fMat: IMat3, m3fDestination?: IMat3): IMat3{
			if(!isDef(m3fDestination)){
		        m3fDestination = this;
		    }

		    var pData1: Float32Array = this.data;
		    var pData2: Float32Array = m3fMat.data;
		    var pDataDestination: Float32Array = m3fDestination.data;

		    pDataDestination[ 0 ] = pData1[ 0 ] - pData2[ 0 ];
		    pDataDestination[ 3 ] = pData1[ 3 ] - pData2[ 3 ];
		    pDataDestination[ 6 ] = pData1[ 6 ] - pData2[ 6 ];

		    pDataDestination[ 1 ] = pData1[ 1 ] - pData2[ 1 ];
		    pDataDestination[ 4 ] = pData1[ 4 ] - pData2[ 4 ];
		    pDataDestination[ 7 ] = pData1[ 7 ] - pData2[ 7 ];

		    pDataDestination[ 2 ] = pData1[ 2 ] - pData2[ 2 ];
		    pDataDestination[ 5 ] = pData1[ 5 ] - pData2[ 5 ];
		    pDataDestination[ 8 ] = pData1[ 8 ] - pData2[ 8 ];

		    return m3fDestination;
		};

		multiply(m3fMat: IMat3, m3fDestination?: IMat3): IMat3{
			var pData1: Float32Array = this.data;
	        var pData2: Float32Array = m3fMat.data;

	        if(!isDef(m3fDestination)){
	            m3fDestination = this;
	        }
	        var pDataDestination = m3fDestination.data;

// Cache the matrix values (makes for huge speed increases!)
	        var a11:  number  = pData1[ 0 ], a12:  number  = pData1[ 3 ], a13:  number  = pData1[ 6 ];
	        var a21:  number  = pData1[ 1 ], a22:  number  = pData1[ 4 ], a23:  number  = pData1[ 7 ];
	        var a31:  number  = pData1[ 2 ], a32:  number  = pData1[ 5 ], a33:  number  = pData1[ 8 ];

	        var b11:  number  = pData2[ 0 ], b12:  number  = pData2[ 3 ], b13:  number  = pData2[ 6 ];
	        var b21:  number  = pData2[ 1 ], b22:  number  = pData2[ 4 ], b23:  number  = pData2[ 7 ];
	        var b31:  number  = pData2[ 2 ], b32:  number  = pData2[ 5 ], b33:  number  = pData2[ 8 ];

	        pDataDestination[ 0 ] = a11 * b11 + a12 * b21 + a13 * b31;
	        pDataDestination[ 3 ] = a11 * b12 + a12 * b22 + a13 * b32;
	        pDataDestination[ 6 ] = a11 * b13 + a12 * b23 + a13 * b33;

	        pDataDestination[ 1 ] = a21 * b11 + a22 * b21 + a23 * b31;
	        pDataDestination[ 4 ] = a21 * b12 + a22 * b22 + a23 * b32;
	        pDataDestination[ 7 ] = a21 * b13 + a22 * b23 + a23 * b33;

	        pDataDestination[ 2 ] = a31 * b11 + a32 * b21 + a33 * b31;
	        pDataDestination[ 5 ] = a31 * b12 + a32 * b22 + a33 * b32;
	        pDataDestination[ 8 ] = a31 * b13 + a32 * b23 + a33 * b33;

		    return m3fDestination;
		};

		multiplyVec3(v3fVec: IVec3, v3fDestination?: IVec3): IVec3{
			var pData: Float32Array = this.data;

	        if(!isDef(v3fDestination)){
	            v3fDestination = new Vec3();
	        }

	        var x:  number  = v3fVec.x, y:  number  = v3fVec.y, z:  number  = v3fVec.z;

	        v3fDestination.x = pData[ 0 ] * x + pData[ 3 ] * y + pData[ 6 ] * z;
	        v3fDestination.y = pData[ 1 ] * x + pData[ 4 ] * y + pData[ 7 ] * z;
	        v3fDestination.z = pData[ 2 ] * x + pData[ 5 ] * y + pData[ 8 ] * z;

		    return v3fDestination;
		};

		transpose(m3fDestination?: IMat3): IMat3{
			var pData: Float32Array = this.data;
		    if(!isDef(m3fDestination)){
//быстрее будет явно обработать оба случая
		        var a12:  number  = pData[ 3 ], a13:  number  = pData[ 6 ], a23:  number  = pData[ 7 ];

		        pData[ 3 ] = pData[ 1 ];
		        pData[ 6 ] = pData[ 2 ];

		        pData[ 1 ] = a12;
		        pData[ 7 ] = pData[ 5 ];

		        pData[ 2 ] = a13;
		        pData[ 5 ] = a23;

		        return this;
		    }

		    var pDataDestination: Float32Array = m3fDestination.data;

		    pDataDestination[ 0 ] = pData[ 0 ];
		    pDataDestination[ 3 ] = pData[ 1 ];
		    pDataDestination[ 6 ] = pData[ 2 ];

		    pDataDestination[ 1 ] = pData[ 3 ];
		    pDataDestination[ 4 ] = pData[ 4 ];
		    pDataDestination[ 7 ] = pData[ 5 ];

		    pDataDestination[ 2 ] = pData[ 6 ];
		    pDataDestination[ 5 ] = pData[ 7 ];
		    pDataDestination[ 8 ] = pData[ 8 ];

		    return m3fDestination;
		};

		determinant():  number {
			var pData: Float32Array = this.data;

		    var a11:  number  = pData[ 0 ], a12:  number  = pData[ 3 ], a13:  number  = pData[ 6 ];
		    var a21:  number  = pData[ 1 ], a22:  number  = pData[ 4 ], a23:  number  = pData[ 7 ];
		    var a31:  number  = pData[ 2 ], a32:  number  = pData[ 5 ], a33:  number  = pData[ 8 ];

		    return  a11 * (a22 * a33 - a23 * a32)
		            - a12 * (a21 * a33 - a23 * a31)
		            + a13 * (a21 * a32 - a22 * a31);
		};

		inverse(m3fDestination?: IMat3): IMat3{
			if(!isDef(m3fDestination)){
		        m3fDestination = this;
		    }

		    var pData: Float32Array = this.data;
		    var pDataDestination: Float32Array = m3fDestination.data;

		    var a11:  number  = pData[ 0 ], a12:  number  = pData[ 3 ], a13:  number  = pData[ 6 ];
		    var a21:  number  = pData[ 1 ], a22:  number  = pData[ 4 ], a23:  number  = pData[ 7 ];
		    var a31:  number  = pData[ 2 ], a32:  number  = pData[ 5 ], a33:  number  = pData[ 8 ];

		    var A11:  number  = a22 * a33 - a23 * a32;
		    var A12:  number  = a21 * a33 - a23 * a31;
		    var A13:  number  = a21 * a32 - a22 * a31;

		    var A21:  number  = a12 * a33 - a13 * a32;
		    var A22:  number  = a11 * a33 - a13 * a31;
		    var A23:  number  = a11 * a32 - a12 * a31;

		    var A31:  number  = a12 * a23 - a13 * a22;
		    var A32:  number  = a11 * a23 - a13 * a21;
		    var A33:  number  = a11 * a22 - a12 * a21;

		    var fDeterminant:  number  = a11*A11 - a12 * A12 + a13 * A13;

		    if(fDeterminant == 0.){
		        logger.setSourceLocation( "Mat3.ts" , 445 ); logger.error("обращение матрицы с нулевым детеминантом:\n", this.toString());
                                      ;

		        return m3fDestination.set(1.);
//чтоб все не навернулось
		    }

		    var fInverseDeterminant:  number  = 1./fDeterminant;

		    pDataDestination[ 0 ] = A11 * fInverseDeterminant;
		    pDataDestination[ 3 ] = -A21 * fInverseDeterminant;
		    pDataDestination[ 6 ] = A31 * fInverseDeterminant;

		    pDataDestination[ 1 ] = -A12 * fInverseDeterminant;
		    pDataDestination[ 4 ] = A22 * fInverseDeterminant;
		    pDataDestination[ 7 ] = -A32 * fInverseDeterminant;

		    pDataDestination[ 2 ] = A13 * fInverseDeterminant;
		    pDataDestination[ 5 ] = -A23 * fInverseDeterminant;
		    pDataDestination[ 8 ] = A33 * fInverseDeterminant;

		    return m3fDestination;
		};

		isEqual(m3fMat: IMat3, fEps:  number  = 0.): bool{
			var pData1: Float32Array = this.data;
		    var pData2: Float32Array = m3fMat.data;

		    if(fEps == 0){
		        if(    pData1[ 0 ] != pData2[ 0 ]
		            || pData1[ 3 ] != pData2[ 3 ]
		            || pData1[ 6 ] != pData2[ 6 ]
		            || pData1[ 1 ] != pData2[ 1 ]
		            || pData1[ 4 ] != pData2[ 4 ]
		            || pData1[ 7 ] != pData2[ 7 ]
		            || pData1[ 2 ] != pData2[ 2 ]
		            || pData1[ 5 ] != pData2[ 5 ]
		            || pData1[ 8 ] != pData2[ 8 ]){

		            return false;
		        }
		    }
		    else{
		        if(    Math.abs(pData1[ 0 ] - pData2[ 0 ]) > fEps
		            || Math.abs(pData1[ 3 ] - pData2[ 3 ]) > fEps
		            || Math.abs(pData1[ 6 ] - pData2[ 6 ]) > fEps
		            || Math.abs(pData1[ 1 ] - pData2[ 1 ]) > fEps
		            || Math.abs(pData1[ 4 ] - pData2[ 4 ]) > fEps
		            || Math.abs(pData1[ 7 ] - pData2[ 7 ]) > fEps
		            || Math.abs(pData1[ 2 ] - pData2[ 2 ]) > fEps
		            || Math.abs(pData1[ 5 ] - pData2[ 5 ]) > fEps
		            || Math.abs(pData1[ 8 ] - pData2[ 8 ]) > fEps){

		            return false;
		        }
		    }
		    return true;
		};

		isDiagonal(fEps:  number  = 0.) : bool{
			var pData: Float32Array = this.data;

		    if(fEps == 0){
		        if(    pData[ 3 ] != 0 || pData[ 6 ] != 0
		            || pData[ 1 ] != 0 || pData[ 7 ] != 0
		            || pData[ 2 ] != 0 || pData[ 5 ] != 0){

		            return false;
		        }
		    }
		    else{
		        if(    Math.abs(pData[ 3 ]) > fEps || Math.abs(pData[ 6 ]) > fEps
		            || Math.abs(pData[ 1 ]) > fEps || Math.abs(pData[ 7 ]) > fEps
		            || Math.abs(pData[ 2 ]) > fEps || Math.abs(pData[ 5 ]) > fEps){

		            return false;
		        }
		    }

		    return true;
		};

		toMat4(m4fDestination?: IMat4): IMat4{
			if(!isDef(m4fDestination)){
		        m4fDestination = new Mat4();
		    }

		    var pData: Float32Array = this.data;
		    var pDataDestination: Float32Array = m4fDestination.data;

		    pDataDestination[ 0 ] = pData[ 0 ];
		    pDataDestination[ 4 ] = pData[ 3 ];
		    pDataDestination[ 8 ] = pData[ 6 ];
		    pDataDestination[ 12 ] = 0;

		    pDataDestination[ 1 ] = pData[ 1 ];
		    pDataDestination[ 5 ] = pData[ 4 ];
		    pDataDestination[ 9 ] = pData[ 7 ];
		    pDataDestination[ 13 ] = 0;

		    pDataDestination[ 2 ] = pData[ 2 ];
		    pDataDestination[ 6 ] = pData[ 5 ];
		    pDataDestination[ 10 ] = pData[ 8 ];
		    pDataDestination[ 14 ] = 0;

		    pDataDestination[ 3 ] = 0;
		    pDataDestination[ 7 ] = 0;
		    pDataDestination[ 11 ] = 0;
		    pDataDestination[ 15 ] = 1;

		    return m4fDestination;
		};

		toQuat4(q4fDestination?: IQuat4): IQuat4{
			if(!isDef(q4fDestination)){
		        q4fDestination = new Quat4();
		    }

		    var pData: Float32Array = this.data;

		    var a11:  number  = pData[ 0 ], a12:  number  = pData[ 3 ], a13:  number  = pData[ 6 ];
		    var a21:  number  = pData[ 1 ], a22:  number  = pData[ 4 ], a23:  number  = pData[ 7 ];
		    var a31:  number  = pData[ 2 ], a32:  number  = pData[ 5 ], a33:  number  = pData[ 8 ];

/*x^2*/
		    var x2:  number  = ((a11 - a22 - a33) + 1)/4;
/*y^2*/
		    var y2:  number  = ((a22 - a11 - a33) + 1)/4;
/*z^2*/
		    var z2:  number  = ((a33 - a11 - a22) + 1)/4;
/*w^2*/
		    var w2:  number  = ((a11 + a22 + a33) + 1)/4;

		    var fMax:  number  = Math.max(x2,Math.max(y2,Math.max(z2,w2)));

		    if(fMax == x2){
//максимальная компонента берется положительной
		        var x:  number  = Math.sqrt(x2);

		        q4fDestination.x = x;
		        q4fDestination.y = (a21 + a12)/4/x;
		        q4fDestination.z = (a31 + a13)/4/x;
		        q4fDestination.w = (a32 - a23)/4/x;
		    }
		    else if(fMax == y2){
//максимальная компонента берется положительной
		        var y:  number  = Math.sqrt(y2); x

		        q4fDestination.x = (a21 + a12)/4/y;
		        q4fDestination.y = y;
		        q4fDestination.z = (a32 + a23)/4/y;
		        q4fDestination.w = (a13 - a31)/4/y;
		    }
		    else if(fMax == z2){
//максимальная компонента берется положительной
		        var z:  number  = Math.sqrt(z2);

		        q4fDestination.x = (a31 + a13)/4/z;
		        q4fDestination.y = (a32 + a23)/4/z;
		        q4fDestination.z = z;
		        q4fDestination.w = (a21 - a12)/4/z;
		    }
		    else{
//максимальная компонента берется положительной
		        var w:  number  = Math.sqrt(w2);

		        q4fDestination.x = (a32 - a23)/4/w;
		        q4fDestination.y = (a13 - a31)/4/w;
		        q4fDestination.z = (a21 - a12)/4/w;
		        q4fDestination.w = w;
		    }

		    return q4fDestination;
		};

		toString(): string{
			var pData = this.data;
		    return '[' + pData[ 0 ] + ', ' + pData[ 3 ] + ', ' + pData[ 6 ] + ',\n' +
		               + pData[ 1 ] + ', ' + pData[ 4 ] + ', ' + pData[ 7 ] + ',\n' +
		               + pData[ 2 ] + ', ' + pData[ 5 ] + ', ' + pData[ 8 ] + ']';
		};

		decompose(q4fRotation: IQuat4, v3fScale: IVec3): bool{
//изначально предполагаем, что порядок умножения был rot * scale
			var m3fRotScale: IMat3 = this;
			var m3fRotScaleTransposed: IMat3 = this.transpose(mat3());
			var isRotScale: bool = true;

//понадобятся если порядок умножения был другим
		    var m3fScaleRot: IMat3, m3fScaleRotTransposed: IMat3;

//было отражение или нет
    		var scaleSign:  number  = (m3fRotScale.determinant() >= 0.) ? 1 : -1;

    		var m3fResult: IMat3 = mat3();

//first variant rot * scale
// (rot * scale)T * (rot * scale) = 
// scaleT * rotT * rot * scale = scaleT *rot^-1 * rot * scale = 
// scaleT * scale
		    m3fRotScaleTransposed.multiply(m3fRotScale, m3fResult);
		   	if(!m3fResult.isDiagonal(1e-4)){
//предположение было неверным
		   		isRotScale = false;
//просто переобозначения чтобы не было путаницы
		        m3fScaleRot = m3fRotScale;
		        m3fScaleRotTransposed = m3fRotScaleTransposed;

//second variant scale * rot
// (scale * rot) * (scale * rot)T = 
// scale * rot * rotT * scaleT = scale *rot * rot^-1 * scaleT = 
// scale * scaleT

		        m3fScaleRot.multiply(m3fScaleRotTransposed,m3fResult);
		   	}

		   	var pResultData: Float32Array = m3fResult.data;

		   	var x:  number  = sqrt(pResultData[ 0 ]);
/*если было отражение, считается что оно было по y*/
		   	var y:  number  = sqrt(pResultData[ 4 ])*scaleSign;
		   	var z:  number  = sqrt(pResultData[ 8 ]);

		   	v3fScale.x = x;
		   	v3fScale.y = y;
		   	v3fScale.z = z;

		   	var m3fInverseScale: IMat3 = mat3(1./x,1./y,1./z);

		   	if(isRotScale){
		   		m3fRotScale.multiply(m3fInverseScale,mat3()).toQuat4(q4fRotation);
		   		return true;
		   	}
		   	else{
		   		m3fInverseScale.multiply(m3fScaleRot,mat3()).toQuat4(q4fRotation);
		   		logger.setSourceLocation( "Mat3.ts" , 674 ); logger.assert(false,"порядок умножения scale rot в данный момент не поддерживается"); ;
		   		return false;
		   	}
		};

		row(iRow:  number , v3fDestination?: IVec3): IVec3{
			if(!isDef(v3fDestination)){
				v3fDestination = new Vec3();
			}

			var pData: Float32Array = this.data;

			switch(iRow){
				case 1:
					v3fDestination.x = pData[ 0 ];
					v3fDestination.y = pData[ 3 ];
					v3fDestination.z = pData[ 6 ];
					break;
				case 2:
					v3fDestination.x = pData[ 1 ];
					v3fDestination.y = pData[ 4 ];
					v3fDestination.z = pData[ 7 ];
					break;
				case 3:
					v3fDestination.x = pData[ 2 ];
					v3fDestination.y = pData[ 5 ];
					v3fDestination.z = pData[ 8 ];
					break;
			}

			return v3fDestination;
		};

		column(iColumn:  number , v3fDestination?: IVec3): IVec3{
			if(!isDef(v3fDestination)){
				v3fDestination = new Vec3();
			}

			var pData: Float32Array = this.data;

			switch(iColumn){
				case 1:
					v3fDestination.x = pData[ 0 ];
					v3fDestination.y = pData[ 1 ];
					v3fDestination.z = pData[ 2 ];
					break;
				case 2:
					v3fDestination.x = pData[ 3 ];
					v3fDestination.y = pData[ 4 ];
					v3fDestination.z = pData[ 5 ];
					break;
				case 3:
					v3fDestination.x = pData[ 6 ];
					v3fDestination.y = pData[ 7 ];
					v3fDestination.z = pData[ 8 ];
					break;
			}

			return v3fDestination;
		};

		static fromYawPitchRoll(fYaw:  number , fPitch:  number , fRoll:  number , m3fDestination?: IMat3): IMat3;
		static fromYawPitchRoll(v3fAngles: IVec3, m3fDestination?: IMat3): IMat3;
		static fromYawPitchRoll(fYaw?,fPitch?,fRoll?,m3fDestination?): IMat3{
			if(arguments.length <= 2){
//Vec3 + m3fDestination
		        var v3fVec: IVec3 = arguments[0];

		        fYaw   = v3fVec.x;
		        fPitch = v3fVec.y;
		        fRoll  = v3fVec.z;

		        m3fDestination = arguments[1];
		    }

		    if(!isDef(m3fDestination)){
		        m3fDestination = new Mat3();
		    }

		    var pDataDestination: Float32Array = m3fDestination.data;

		    var fSin1:  number  = Math.sin(fYaw);
		    var fSin2:  number  = Math.sin(fPitch);
		    var fSin3:  number  = Math.sin(fRoll);

		    var fCos1:  number  = Math.cos(fYaw);
		    var fCos2:  number  = Math.cos(fPitch);
		    var fCos3:  number  = Math.cos(fRoll);

		    pDataDestination[ 0 ] = fCos1 * fCos3 + fSin1 * fSin2 * fSin3;
		    pDataDestination[ 3 ] = fCos3 * fSin1 * fSin2 - fCos1 * fSin3;
		    pDataDestination[ 6 ] = fCos2 * fSin1;

		    pDataDestination[ 1 ] = fCos2 * fSin3;
		    pDataDestination[ 4 ] = fCos2 * fCos3;
		    pDataDestination[ 7 ] = -fSin2;

		    pDataDestination[ 2 ] = fCos1 * fSin2 * fSin3 - fCos3 * fSin1;
		    pDataDestination[ 5 ] = fSin1 * fSin3 + fCos1 * fCos3 * fSin2;
		    pDataDestination[ 8 ] = fCos1 * fCos2;

		    return m3fDestination;
		};

		static fromXYZ(fX:  number , fY:  number , fZ:  number , m3fDestination?: IMat3): IMat3;
		static fromXYZ(v3fAngles: IVec3, m3fDestination?: IMat3): IMat3;
		static fromXYZ(fX?, fY?, fZ?, m3fDestination?) : IMat3{
			if(arguments.length <= 2){
//Vec3 + m3fDestination
				var v3fVec: IVec3 = arguments[0];
				return Mat3.fromYawPitchRoll(v3fVec.y,v3fVec.x,v3fVec.z,arguments[1]);
			}
			else{
//fX fY fZ m3fDestination
				var fX:  number  = arguments[0];
				var fY:  number  = arguments[1];
				var fZ:  number  = arguments[2];

				return Mat3.fromYawPitchRoll(fY, fX, fZ, arguments[3]);
			}
		};

		static get stackCeil(): Mat3 { Mat3.stackPosition = Mat3.stackPosition === Mat3.stackSize - 1? 0: Mat3.stackPosition; return Mat3.stack[Mat3.stackPosition ++]; } static stackSize: number = 100; static stackPosition: number = 0; static stack: Mat3[] = (function(): Mat3[]{ var pStack: Mat3[] = new Array(Mat3.stackSize); for(var i: number = 0; i<Mat3.stackSize; i++){ pStack[i] = new Mat3(); } return pStack})(); ;
    };
};
















module akra {

	export interface IVec2 {} ;
	export interface IVec3 {} ;
	export interface IColorValue {} ;

	export interface IVec4Constructor {
        ();
        (fValue:  number );
        (v4fVec: IVec4);
        (pArray:  number []);
        (fValue:  number , v3fVec: IVec3);
        (v2fVec1: IVec2, v2fVec2: IVec2);
        (v3fVec: IVec3, fValue:  number );
        (fValue1:  number , fValue2:  number , v2fVec: IVec2);
        (fValue1:  number , v2fVec: IVec2, fValue2:  number );
        (v2fVec: IVec2 ,fValue1:  number , fValue2:  number );
        (fValue1:  number , fValue2:  number , fValue3:  number , fValue4:  number );
    }


	export interface IVec4 {
		x:  number ;
		y:  number ;
		z:  number ;
		w:  number ;


/*represents two-component vector from original vector*/

xx: IVec2;
/*represents two-component vector from original vector*/

xy: IVec2;
/*represents two-component vector from original vector*/

xz: IVec2;
/*represents two-component vector from original vector*/

xw: IVec2;
/*represents two-component vector from original vector*/

yx: IVec2;
/*represents two-component vector from original vector*/

yy: IVec2;
/*represents two-component vector from original vector*/

yz: IVec2;
/*represents two-component vector from original vector*/

yw: IVec2;
/*represents two-component vector from original vector*/

zx: IVec2;
/*represents two-component vector from original vector*/

zy: IVec2;
/*represents two-component vector from original vector*/

zz: IVec2;
/*represents two-component vector from original vector*/

zw: IVec2;
/*represents two-component vector from original vector*/

wx: IVec2;
/*represents two-component vector from original vector*/

wy: IVec2;
/*represents two-component vector from original vector*/

wz: IVec2;
/*represents two-component vector from original vector*/

ww: IVec2;

/*represents three-component vector from original vector*/

xxx: IVec3;
/*represents three-component vector from original vector*/

xxy: IVec3;
/*represents three-component vector from original vector*/

xxz: IVec3;
/*represents three-component vector from original vector*/

xxw: IVec3;
/*represents three-component vector from original vector*/

xyx: IVec3;
/*represents three-component vector from original vector*/

xyy: IVec3;
/*represents three-component vector from original vector*/

xyz: IVec3;
/*represents three-component vector from original vector*/

xyw: IVec3;
/*represents three-component vector from original vector*/

xzx: IVec3;
/*represents three-component vector from original vector*/

xzy: IVec3;
/*represents three-component vector from original vector*/

xzz: IVec3;
/*represents three-component vector from original vector*/

xzw: IVec3;
/*represents three-component vector from original vector*/

xwx: IVec3;
/*represents three-component vector from original vector*/

xwy: IVec3;
/*represents three-component vector from original vector*/

xwz: IVec3;
/*represents three-component vector from original vector*/

xww: IVec3;
/*represents three-component vector from original vector*/

yxx: IVec3;
/*represents three-component vector from original vector*/

yxy: IVec3;
/*represents three-component vector from original vector*/

yxz: IVec3;
/*represents three-component vector from original vector*/

yxw: IVec3;
/*represents three-component vector from original vector*/

yyx: IVec3;
/*represents three-component vector from original vector*/

yyy: IVec3;
/*represents three-component vector from original vector*/

yyz: IVec3;
/*represents three-component vector from original vector*/

yyw: IVec3;
/*represents three-component vector from original vector*/

yzx: IVec3;
/*represents three-component vector from original vector*/

yzy: IVec3;
/*represents three-component vector from original vector*/

yzz: IVec3;
/*represents three-component vector from original vector*/

yzw: IVec3;
/*represents three-component vector from original vector*/

ywx: IVec3;
/*represents three-component vector from original vector*/

ywy: IVec3;
/*represents three-component vector from original vector*/

ywz: IVec3;
/*represents three-component vector from original vector*/

yww: IVec3;
/*represents three-component vector from original vector*/

zxx: IVec3;
/*represents three-component vector from original vector*/

zxy: IVec3;
/*represents three-component vector from original vector*/

zxz: IVec3;
/*represents three-component vector from original vector*/

zxw: IVec3;
/*represents three-component vector from original vector*/

zyx: IVec3;
/*represents three-component vector from original vector*/

zyy: IVec3;
/*represents three-component vector from original vector*/

zyz: IVec3;
/*represents three-component vector from original vector*/

zyw: IVec3;
/*represents three-component vector from original vector*/

zzx: IVec3;
/*represents three-component vector from original vector*/

zzy: IVec3;
/*represents three-component vector from original vector*/

zzz: IVec3;
/*represents three-component vector from original vector*/

zzw: IVec3;
/*represents three-component vector from original vector*/

zwx: IVec3;
/*represents three-component vector from original vector*/

zwy: IVec3;
/*represents three-component vector from original vector*/

zwz: IVec3;
/*represents three-component vector from original vector*/

zww: IVec3;
/*represents three-component vector from original vector*/

wxx: IVec3;
/*represents three-component vector from original vector*/

wxy: IVec3;
/*represents three-component vector from original vector*/

wxz: IVec3;
/*represents three-component vector from original vector*/

wxw: IVec3;
/*represents three-component vector from original vector*/

wyx: IVec3;
/*represents three-component vector from original vector*/

wyy: IVec3;
/*represents three-component vector from original vector*/

wyz: IVec3;
/*represents three-component vector from original vector*/

wyw: IVec3;
/*represents three-component vector from original vector*/

wzx: IVec3;
/*represents three-component vector from original vector*/

wzy: IVec3;
/*represents three-component vector from original vector*/

wzz: IVec3;
/*represents three-component vector from original vector*/

wzw: IVec3;
/*represents three-component vector from original vector*/

wwx: IVec3;
/*represents three-component vector from original vector*/

wwy: IVec3;
/*represents three-component vector from original vector*/

wwz: IVec3;
/*represents three-component vector from original vector*/

www: IVec3;

/*represents four-component vector from original vector*/

xxxx: IVec4;
/*represents four-component vector from original vector*/

xxxy: IVec4;
/*represents four-component vector from original vector*/

xxxz: IVec4;
/*represents four-component vector from original vector*/

xxxw: IVec4;
/*represents four-component vector from original vector*/

xxyx: IVec4;
/*represents four-component vector from original vector*/

xxyy: IVec4;
/*represents four-component vector from original vector*/

xxyz: IVec4;
/*represents four-component vector from original vector*/

xxyw: IVec4;
/*represents four-component vector from original vector*/

xxzx: IVec4;
/*represents four-component vector from original vector*/

xxzy: IVec4;
/*represents four-component vector from original vector*/

xxzz: IVec4;
/*represents four-component vector from original vector*/

xxzw: IVec4;
/*represents four-component vector from original vector*/

xxwx: IVec4;
/*represents four-component vector from original vector*/

xxwy: IVec4;
/*represents four-component vector from original vector*/

xxwz: IVec4;
/*represents four-component vector from original vector*/

xxww: IVec4;
/*represents four-component vector from original vector*/

xyxx: IVec4;
/*represents four-component vector from original vector*/

xyxy: IVec4;
/*represents four-component vector from original vector*/

xyxz: IVec4;
/*represents four-component vector from original vector*/

xyxw: IVec4;
/*represents four-component vector from original vector*/

xyyx: IVec4;
/*represents four-component vector from original vector*/

xyyy: IVec4;
/*represents four-component vector from original vector*/

xyyz: IVec4;
/*represents four-component vector from original vector*/

xyyw: IVec4;
/*represents four-component vector from original vector*/

xyzx: IVec4;
/*represents four-component vector from original vector*/

xyzy: IVec4;
/*represents four-component vector from original vector*/

xyzz: IVec4;
/*represents four-component vector from original vector*/

xyzw: IVec4;
/*represents four-component vector from original vector*/

xywx: IVec4;
/*represents four-component vector from original vector*/

xywy: IVec4;
/*represents four-component vector from original vector*/

xywz: IVec4;
/*represents four-component vector from original vector*/

xyww: IVec4;
/*represents four-component vector from original vector*/

xzxx: IVec4;
/*represents four-component vector from original vector*/

xzxy: IVec4;
/*represents four-component vector from original vector*/

xzxz: IVec4;
/*represents four-component vector from original vector*/

xzxw: IVec4;
/*represents four-component vector from original vector*/

xzyx: IVec4;
/*represents four-component vector from original vector*/

xzyy: IVec4;
/*represents four-component vector from original vector*/

xzyz: IVec4;
/*represents four-component vector from original vector*/

xzyw: IVec4;
/*represents four-component vector from original vector*/

xzzx: IVec4;
/*represents four-component vector from original vector*/

xzzy: IVec4;
/*represents four-component vector from original vector*/

xzzz: IVec4;
/*represents four-component vector from original vector*/

xzzw: IVec4;
/*represents four-component vector from original vector*/

xzwx: IVec4;
/*represents four-component vector from original vector*/

xzwy: IVec4;
/*represents four-component vector from original vector*/

xzwz: IVec4;
/*represents four-component vector from original vector*/

xzww: IVec4;
/*represents four-component vector from original vector*/

xwxx: IVec4;
/*represents four-component vector from original vector*/

xwxy: IVec4;
/*represents four-component vector from original vector*/

xwxz: IVec4;
/*represents four-component vector from original vector*/

xwxw: IVec4;
/*represents four-component vector from original vector*/

xwyx: IVec4;
/*represents four-component vector from original vector*/

xwyy: IVec4;
/*represents four-component vector from original vector*/

xwyz: IVec4;
/*represents four-component vector from original vector*/

xwyw: IVec4;
/*represents four-component vector from original vector*/

xwzx: IVec4;
/*represents four-component vector from original vector*/

xwzy: IVec4;
/*represents four-component vector from original vector*/

xwzz: IVec4;
/*represents four-component vector from original vector*/

xwzw: IVec4;
/*represents four-component vector from original vector*/

xwwx: IVec4;
/*represents four-component vector from original vector*/

xwwy: IVec4;
/*represents four-component vector from original vector*/

xwwz: IVec4;
/*represents four-component vector from original vector*/

xwww: IVec4;
/*represents four-component vector from original vector*/

yxxx: IVec4;
/*represents four-component vector from original vector*/

yxxy: IVec4;
/*represents four-component vector from original vector*/

yxxz: IVec4;
/*represents four-component vector from original vector*/

yxxw: IVec4;
/*represents four-component vector from original vector*/

yxyx: IVec4;
/*represents four-component vector from original vector*/

yxyy: IVec4;
/*represents four-component vector from original vector*/

yxyz: IVec4;
/*represents four-component vector from original vector*/

yxyw: IVec4;
/*represents four-component vector from original vector*/

yxzx: IVec4;
/*represents four-component vector from original vector*/

yxzy: IVec4;
/*represents four-component vector from original vector*/

yxzz: IVec4;
/*represents four-component vector from original vector*/

yxzw: IVec4;
/*represents four-component vector from original vector*/

yxwx: IVec4;
/*represents four-component vector from original vector*/

yxwy: IVec4;
/*represents four-component vector from original vector*/

yxwz: IVec4;
/*represents four-component vector from original vector*/

yxww: IVec4;
/*represents four-component vector from original vector*/

yyxx: IVec4;
/*represents four-component vector from original vector*/

yyxy: IVec4;
/*represents four-component vector from original vector*/

yyxz: IVec4;
/*represents four-component vector from original vector*/

yyxw: IVec4;
/*represents four-component vector from original vector*/

yyyx: IVec4;
/*represents four-component vector from original vector*/

yyyy: IVec4;
/*represents four-component vector from original vector*/

yyyz: IVec4;
/*represents four-component vector from original vector*/

yyyw: IVec4;
/*represents four-component vector from original vector*/

yyzx: IVec4;
/*represents four-component vector from original vector*/

yyzy: IVec4;
/*represents four-component vector from original vector*/

yyzz: IVec4;
/*represents four-component vector from original vector*/

yyzw: IVec4;
/*represents four-component vector from original vector*/

yywx: IVec4;
/*represents four-component vector from original vector*/

yywy: IVec4;
/*represents four-component vector from original vector*/

yywz: IVec4;
/*represents four-component vector from original vector*/

yyww: IVec4;
/*represents four-component vector from original vector*/

yzxx: IVec4;
/*represents four-component vector from original vector*/

yzxy: IVec4;
/*represents four-component vector from original vector*/

yzxz: IVec4;
/*represents four-component vector from original vector*/

yzxw: IVec4;
/*represents four-component vector from original vector*/

yzyx: IVec4;
/*represents four-component vector from original vector*/

yzyy: IVec4;
/*represents four-component vector from original vector*/

yzyz: IVec4;
/*represents four-component vector from original vector*/

yzyw: IVec4;
/*represents four-component vector from original vector*/

yzzx: IVec4;
/*represents four-component vector from original vector*/

yzzy: IVec4;
/*represents four-component vector from original vector*/

yzzz: IVec4;
/*represents four-component vector from original vector*/

yzzw: IVec4;
/*represents four-component vector from original vector*/

yzwx: IVec4;
/*represents four-component vector from original vector*/

yzwy: IVec4;
/*represents four-component vector from original vector*/

yzwz: IVec4;
/*represents four-component vector from original vector*/

yzww: IVec4;
/*represents four-component vector from original vector*/

ywxx: IVec4;
/*represents four-component vector from original vector*/

ywxy: IVec4;
/*represents four-component vector from original vector*/

ywxz: IVec4;
/*represents four-component vector from original vector*/

ywxw: IVec4;
/*represents four-component vector from original vector*/

ywyx: IVec4;
/*represents four-component vector from original vector*/

ywyy: IVec4;
/*represents four-component vector from original vector*/

ywyz: IVec4;
/*represents four-component vector from original vector*/

ywyw: IVec4;
/*represents four-component vector from original vector*/

ywzx: IVec4;
/*represents four-component vector from original vector*/

ywzy: IVec4;
/*represents four-component vector from original vector*/

ywzz: IVec4;
/*represents four-component vector from original vector*/

ywzw: IVec4;
/*represents four-component vector from original vector*/

ywwx: IVec4;
/*represents four-component vector from original vector*/

ywwy: IVec4;
/*represents four-component vector from original vector*/

ywwz: IVec4;
/*represents four-component vector from original vector*/

ywww: IVec4;
/*represents four-component vector from original vector*/

zxxx: IVec4;
/*represents four-component vector from original vector*/

zxxy: IVec4;
/*represents four-component vector from original vector*/

zxxz: IVec4;
/*represents four-component vector from original vector*/

zxxw: IVec4;
/*represents four-component vector from original vector*/

zxyx: IVec4;
/*represents four-component vector from original vector*/

zxyy: IVec4;
/*represents four-component vector from original vector*/

zxyz: IVec4;
/*represents four-component vector from original vector*/

zxyw: IVec4;
/*represents four-component vector from original vector*/

zxzx: IVec4;
/*represents four-component vector from original vector*/

zxzy: IVec4;
/*represents four-component vector from original vector*/

zxzz: IVec4;
/*represents four-component vector from original vector*/

zxzw: IVec4;
/*represents four-component vector from original vector*/

zxwx: IVec4;
/*represents four-component vector from original vector*/

zxwy: IVec4;
/*represents four-component vector from original vector*/

zxwz: IVec4;
/*represents four-component vector from original vector*/

zxww: IVec4;
/*represents four-component vector from original vector*/

zyxx: IVec4;
/*represents four-component vector from original vector*/

zyxy: IVec4;
/*represents four-component vector from original vector*/

zyxz: IVec4;
/*represents four-component vector from original vector*/

zyxw: IVec4;
/*represents four-component vector from original vector*/

zyyx: IVec4;
/*represents four-component vector from original vector*/

zyyy: IVec4;
/*represents four-component vector from original vector*/

zyyz: IVec4;
/*represents four-component vector from original vector*/

zyyw: IVec4;
/*represents four-component vector from original vector*/

zyzx: IVec4;
/*represents four-component vector from original vector*/

zyzy: IVec4;
/*represents four-component vector from original vector*/

zyzz: IVec4;
/*represents four-component vector from original vector*/

zyzw: IVec4;
/*represents four-component vector from original vector*/

zywx: IVec4;
/*represents four-component vector from original vector*/

zywy: IVec4;
/*represents four-component vector from original vector*/

zywz: IVec4;
/*represents four-component vector from original vector*/

zyww: IVec4;
/*represents four-component vector from original vector*/

zzxx: IVec4;
/*represents four-component vector from original vector*/

zzxy: IVec4;
/*represents four-component vector from original vector*/

zzxz: IVec4;
/*represents four-component vector from original vector*/

zzxw: IVec4;
/*represents four-component vector from original vector*/

zzyx: IVec4;
/*represents four-component vector from original vector*/

zzyy: IVec4;
/*represents four-component vector from original vector*/

zzyz: IVec4;
/*represents four-component vector from original vector*/

zzyw: IVec4;
/*represents four-component vector from original vector*/

zzzx: IVec4;
/*represents four-component vector from original vector*/

zzzy: IVec4;
/*represents four-component vector from original vector*/

zzzz: IVec4;
/*represents four-component vector from original vector*/

zzzw: IVec4;
/*represents four-component vector from original vector*/

zzwx: IVec4;
/*represents four-component vector from original vector*/

zzwy: IVec4;
/*represents four-component vector from original vector*/

zzwz: IVec4;
/*represents four-component vector from original vector*/

zzww: IVec4;
/*represents four-component vector from original vector*/

zwxx: IVec4;
/*represents four-component vector from original vector*/

zwxy: IVec4;
/*represents four-component vector from original vector*/

zwxz: IVec4;
/*represents four-component vector from original vector*/

zwxw: IVec4;
/*represents four-component vector from original vector*/

zwyx: IVec4;
/*represents four-component vector from original vector*/

zwyy: IVec4;
/*represents four-component vector from original vector*/

zwyz: IVec4;
/*represents four-component vector from original vector*/

zwyw: IVec4;
/*represents four-component vector from original vector*/

zwzx: IVec4;
/*represents four-component vector from original vector*/

zwzy: IVec4;
/*represents four-component vector from original vector*/

zwzz: IVec4;
/*represents four-component vector from original vector*/

zwzw: IVec4;
/*represents four-component vector from original vector*/

zwwx: IVec4;
/*represents four-component vector from original vector*/

zwwy: IVec4;
/*represents four-component vector from original vector*/

zwwz: IVec4;
/*represents four-component vector from original vector*/

zwww: IVec4;
/*represents four-component vector from original vector*/

wxxx: IVec4;
/*represents four-component vector from original vector*/

wxxy: IVec4;
/*represents four-component vector from original vector*/

wxxz: IVec4;
/*represents four-component vector from original vector*/

wxxw: IVec4;
/*represents four-component vector from original vector*/

wxyx: IVec4;
/*represents four-component vector from original vector*/

wxyy: IVec4;
/*represents four-component vector from original vector*/

wxyz: IVec4;
/*represents four-component vector from original vector*/

wxyw: IVec4;
/*represents four-component vector from original vector*/

wxzx: IVec4;
/*represents four-component vector from original vector*/

wxzy: IVec4;
/*represents four-component vector from original vector*/

wxzz: IVec4;
/*represents four-component vector from original vector*/

wxzw: IVec4;
/*represents four-component vector from original vector*/

wxwx: IVec4;
/*represents four-component vector from original vector*/

wxwy: IVec4;
/*represents four-component vector from original vector*/

wxwz: IVec4;
/*represents four-component vector from original vector*/

wxww: IVec4;
/*represents four-component vector from original vector*/

wyxx: IVec4;
/*represents four-component vector from original vector*/

wyxy: IVec4;
/*represents four-component vector from original vector*/

wyxz: IVec4;
/*represents four-component vector from original vector*/

wyxw: IVec4;
/*represents four-component vector from original vector*/

wyyx: IVec4;
/*represents four-component vector from original vector*/

wyyy: IVec4;
/*represents four-component vector from original vector*/

wyyz: IVec4;
/*represents four-component vector from original vector*/

wyyw: IVec4;
/*represents four-component vector from original vector*/

wyzx: IVec4;
/*represents four-component vector from original vector*/

wyzy: IVec4;
/*represents four-component vector from original vector*/

wyzz: IVec4;
/*represents four-component vector from original vector*/

wyzw: IVec4;
/*represents four-component vector from original vector*/

wywx: IVec4;
/*represents four-component vector from original vector*/

wywy: IVec4;
/*represents four-component vector from original vector*/

wywz: IVec4;
/*represents four-component vector from original vector*/

wyww: IVec4;
/*represents four-component vector from original vector*/

wzxx: IVec4;
/*represents four-component vector from original vector*/

wzxy: IVec4;
/*represents four-component vector from original vector*/

wzxz: IVec4;
/*represents four-component vector from original vector*/

wzxw: IVec4;
/*represents four-component vector from original vector*/

wzyx: IVec4;
/*represents four-component vector from original vector*/

wzyy: IVec4;
/*represents four-component vector from original vector*/

wzyz: IVec4;
/*represents four-component vector from original vector*/

wzyw: IVec4;
/*represents four-component vector from original vector*/

wzzx: IVec4;
/*represents four-component vector from original vector*/

wzzy: IVec4;
/*represents four-component vector from original vector*/

wzzz: IVec4;
/*represents four-component vector from original vector*/

wzzw: IVec4;
/*represents four-component vector from original vector*/

wzwx: IVec4;
/*represents four-component vector from original vector*/

wzwy: IVec4;
/*represents four-component vector from original vector*/

wzwz: IVec4;
/*represents four-component vector from original vector*/

wzww: IVec4;
/*represents four-component vector from original vector*/

wwxx: IVec4;
/*represents four-component vector from original vector*/

wwxy: IVec4;
/*represents four-component vector from original vector*/

wwxz: IVec4;
/*represents four-component vector from original vector*/

wwxw: IVec4;
/*represents four-component vector from original vector*/

wwyx: IVec4;
/*represents four-component vector from original vector*/

wwyy: IVec4;
/*represents four-component vector from original vector*/

wwyz: IVec4;
/*represents four-component vector from original vector*/

wwyw: IVec4;
/*represents four-component vector from original vector*/

wwzx: IVec4;
/*represents four-component vector from original vector*/

wwzy: IVec4;
/*represents four-component vector from original vector*/

wwzz: IVec4;
/*represents four-component vector from original vector*/

wwzw: IVec4;
/*represents four-component vector from original vector*/

wwwx: IVec4;
/*represents four-component vector from original vector*/

wwwy: IVec4;
/*represents four-component vector from original vector*/

wwwz: IVec4;
/*represents four-component vector from original vector*/

wwww: IVec4;

		set(): IVec4;
		set(fValue:  number ): IVec4;
		set(v4fVec: IVec4): IVec4;
		set(c4fColor: IColorValue): IVec4;
		set(pArray:  number []): IVec4;
		set(fValue:  number , v3fVec: IVec3): IVec4;
		set(v2fVec1: IVec2, v2fVec2: IVec2): IVec4;
		set(v3fVec: IVec3, fValue:  number ): IVec4;
		set(fValue1:  number , fValue2:  number , v2fVec: IVec2): IVec4;
		set(fValue1:  number , v2fVec: IVec2, fValue2:  number ): IVec4;
		set(v2fVec: IVec2, fValue1:  number , fValue2:  number ): IVec4;
		set(fValue1:  number , fValue2:  number , fValue3:  number , fValue4:  number ): IVec4;

		clear(): IVec4;

		add(v4fVec: IVec4, v4fDestination?: IVec4): IVec4;
		subtract(v4fVec: IVec4, v4fDestination?: IVec4): IVec4;
		dot(v4fVec: IVec4):  number ;

		isEqual(v4fVec: IVec4, fEps?:  number ): bool;
		isClear(fEps?:  number ): bool;

		negate(v4fDestination?: IVec4): IVec4;
		scale(fScale:  number , v4fDestination?: IVec4): IVec4;
		normalize(v4fDestination?: IVec4): IVec4;
		length():  number ;
		lengthSquare():  number ;

		direction(v4fVec: IVec4, v4fDestination?: IVec4): IVec4;

		mix(v4fVec: IVec4, fA:  number , v4fDestination?: IVec4): IVec4;

		toString(): string;
	};
};





module akra.math {
    export class Mat4 implements IMat4{
    	data: Float32Array;

		constructor();
		constructor(fValue:  number );
		constructor(v4fVec: IVec4);
		constructor(m3fMat: IMat3, v3fTranslation?: IVec3);
		constructor(m4fMat: IMat4);
		constructor(pArray:  number []);
		constructor(pArray: Float32Array, bFlag: bool);
		constructor(fValue1:  number , fValue2:  number ,
				fValue3:  number , fValue4:  number );
		constructor(v4fVec1: IVec4, v4fVec2: IVec4,
				v4fVec3: IVec4, v4fVec4: IVec4);
		constructor(pArray1:  number [], pArray2:  number [],
				pArray3:  number [], pArray4:  number []);
		constructor(fValue1:  number , fValue2:  number , fValue3:  number , fValue4:  number ,
				fValue5:  number , fValue6:  number , fValue7:  number , fValue8:  number ,
				fValue9:  number , fValue10:  number , fValue11:  number , fValue12:  number ,
				fValue13:  number , fValue14:  number , fValue15:  number , fValue16:  number );
		constructor(fValue1?, fValue2?, fValue3?, fValue4?,
					fValue5?, fValue6?, fValue7?, fValue8?,
					fValue9?, fValue10?, fValue11?, fValue12?,
					fValue13?, fValue14?, fValue15?, fValue16?){
			var nArgumentsLength:  number  = arguments.length;

			if(nArgumentsLength === 2){
				if(isBoolean(arguments[1])){
					if(arguments[1]){
						this.data = arguments[0];
					}
					else{
						this.data = new Float32Array(16);
						this.set(arguments[0]);
					}
				}
				else{
					this.data = new Float32Array(16);
					this.set(arguments[0], arguments[1]);
				}
			}
			else{
				this.data = new Float32Array(16);

				switch(nArgumentsLength){
					case 1:
						if(arguments[0] instanceof Mat3){
							this.set(arguments[0],vec3(0.));
						}
						else{
							this.set(arguments[0]);
						}
						break;
					case 4:
						this.set(arguments[0],arguments[1],arguments[2],arguments[3]);
						break;
					case 16:
						this.set(arguments[0], arguments[1], arguments[2], arguments[3],
							 arguments[4], arguments[5], arguments[6], arguments[7],
							 arguments[8], arguments[9], arguments[10], arguments[11],
							 arguments[12], arguments[13], arguments[14], arguments[15]);
						 break;
					 default:
					 	break;
				}
			}
		};

		set(): IMat4;
		set(fValue:  number ): IMat4;
		set(v4fVec: IVec4): IMat4;
		set(m3fMat: IMat3, v3fTranslation?: IVec3): IMat4;
		set(m4fMat: IMat4): IMat4;
		set(pArray:  number []): IMat4;
		set(fValue1:  number , fValue2:  number ,
			fValue3:  number , fValue4:  number ): IMat4;
		set(v4fVec1: IVec4, v4fVec2: IVec4,
			v4fVec3: IVec4, v4fVec4: IVec4): IMat4;
		set(pArray1:  number [], pArray2:  number [],
			pArray3:  number [], pArray4:  number []): IMat4;
		set(fValue1:  number , fValue2:  number , fValue3:  number , fValue4:  number ,
			fValue5:  number , fValue6:  number , fValue7:  number , fValue8:  number ,
			fValue9:  number , fValue10:  number , fValue11:  number , fValue12:  number ,
			fValue13:  number , fValue14:  number , fValue15:  number , fValue16:  number ): IMat4;
		set(fValue1?, fValue2?, fValue3?, fValue4?,
			fValue5?, fValue6?, fValue7?, fValue8?,
			fValue9?, fValue10?, fValue11?, fValue12?,
			fValue13?, fValue14?, fValue15?, fValue16?): IMat4{

			var nArgumentsLength:  number  = arguments.length;
			var pData: Float32Array = this.data;

			if(nArgumentsLength === 0){
				pData[ 0 ] = pData[ 4 ] = pData[ 8 ] = pData[ 12 ] =
				pData[ 1 ] = pData[ 5 ] = pData[ 9 ] = pData[ 13 ] =
				pData[ 2 ] = pData[ 6 ] = pData[ 10 ] = pData[ 14 ] =
				pData[ 3 ] = pData[ 7 ] = pData[ 11 ] = pData[ 15 ] = 0.;

				return this;
			}

			if(nArgumentsLength === 1){
				if(isFloat(arguments[0])){
					var fValue:  number  = arguments[0];

					pData[ 0 ] = fValue;
					pData[ 4 ] = 0.;
					pData[ 8 ] = 0.;
					pData[ 12 ] = 0.;

					pData[ 1 ] = 0.;
					pData[ 5 ] = fValue;
					pData[ 9 ] = 0.;
					pData[ 13 ] = 0.;

					pData[ 2 ] = 0.;
					pData[ 6 ] = 0.;
					pData[ 10 ] = fValue;
					pData[ 14 ] = 0.;

					pData[ 3 ] = 0.;
					pData[ 7 ] = 0.;
					pData[ 11 ] = 0.
					pData[ 15 ] = fValue;
				}
				else if(arguments[0] instanceof Vec4){
					var v4fVec = arguments[0];

					pData[ 0 ] = v4fVec.x;
					pData[ 4 ] = 0.;
					pData[ 8 ] = 0.;
					pData[ 12 ] = 0.;

					pData[ 1 ] = 0.;
					pData[ 5 ] = v4fVec.y;
					pData[ 9 ] = 0.;
					pData[ 13 ] = 0.;

					pData[ 2 ] = 0.;
					pData[ 6 ] = 0.;
					pData[ 10 ] = v4fVec.z;
					pData[ 14 ] = 0.;

					pData[ 3 ] = 0.;
					pData[ 7 ] = 0.;
					pData[ 11 ] = 0.
					pData[ 15 ] = v4fVec.w;
				}
				else if(isDef(arguments[0].data)){
					var pMatrixData: Float32Array = arguments[0].data;
					if(pMatrixData.length == 16){
//Mat4
						pData.set(pMatrixData);
					}
					else{
//Mat3
						pData[ 0 ] = pMatrixData[ 0 ];
						pData[ 4 ] = pMatrixData[ 3 ];
						pData[ 8 ] = pMatrixData[ 6 ];

						pData[ 1 ] = pMatrixData[ 1 ];
						pData[ 5 ] = pMatrixData[ 4 ];
						pData[ 9 ] = pMatrixData[ 7 ];

						pData[ 2 ] = pMatrixData[ 2 ];
						pData[ 6 ] = pMatrixData[ 5 ];
						pData[ 10 ] = pMatrixData[ 8 ];

						pData[ 3 ] = 0.;
						pData[ 7 ] = 0.;
						pData[ 11 ] = 0.;
						pData[ 15 ] = 1.;
					}
				}
				else{
//array
					var pArray:  number [] = arguments[0];

					if(pArray.length === 4){
						pData[ 0 ] = pArray[0];
						pData[ 4 ] = 0.;
						pData[ 8 ] = 0.;
						pData[ 12 ] = 0.;

						pData[ 1 ] = 0.;
						pData[ 5 ] = pArray[1];
						pData[ 9 ] = 0.;
						pData[ 13 ] = 0.;

						pData[ 2 ] = 0.;
						pData[ 6 ] = 0.;
						pData[ 10 ] = pArray[2];
						pData[ 14 ] = 0.;

						pData[ 3 ] = 0.;
						pData[ 7 ] = 0.;
						pData[ 11 ] = 0.
						pData[ 15 ] = pArray[3];
					}
					else{
//length == 16

						pData[ 0 ] = pArray[ 0 ];
						pData[ 4 ] = pArray[ 4 ];
						pData[ 8 ] = pArray[ 8 ];
						pData[ 12 ] = pArray[ 12 ];

						pData[ 1 ] = pArray[ 1 ];
						pData[ 5 ] = pArray[ 5 ];
						pData[ 9 ] = pArray[ 9 ];
						pData[ 13 ] = pArray[ 13 ];

						pData[ 2 ] = pArray[ 2 ];
						pData[ 6 ] = pArray[ 6 ];
						pData[ 10 ] = pArray[ 10 ];
						pData[ 14 ] = pArray[ 14 ];

						pData[ 3 ] = pArray[ 3 ];
						pData[ 7 ] = pArray[ 7 ];
						pData[ 11 ] = pArray[ 11 ];
						pData[ 15 ] = pArray[ 15 ];
					}
				}
			}
			else if(nArgumentsLength == 2){
				var pMatrixData: Float32Array = arguments[0];
				var v3fTranslation : IVec3 = arguments[1];

				pData[ 0 ] = pMatrixData[ 0 ];
				pData[ 4 ] = pMatrixData[ 3 ];
				pData[ 8 ] = pMatrixData[ 6 ];
				pData[ 12 ] = v3fTranslation.x;

				pData[ 1 ] = pMatrixData[ 1 ];
				pData[ 5 ] = pMatrixData[ 4 ];
				pData[ 9 ] = pMatrixData[ 7 ];
				pData[ 13 ] = v3fTranslation.y;

				pData[ 2 ] = pMatrixData[ 2 ];
				pData[ 6 ] = pMatrixData[ 5 ];
				pData[ 10 ] = pMatrixData[ 8 ];
				pData[ 14 ] = v3fTranslation.z;

				pData[ 3 ] = 0.;
				pData[ 7 ] = 0.;
				pData[ 11 ] = 0.;
				pData[ 15 ] = 1.;

			}
			else if(nArgumentsLength == 4){
				if(isFloat(arguments[0])){

					pData[ 0 ] = arguments[0];
					pData[ 4 ] = 0;
					pData[ 8 ] = 0;
					pData[ 12 ] = 0;

					pData[ 1 ] = 0;
					pData[ 5 ] = arguments[1];
					pData[ 9 ] = 0;
					pData[ 13 ] = 0;

					pData[ 2 ] = 0;
					pData[ 6 ] = 0;
					pData[ 10 ] = arguments[2];
					pData[ 14 ] = 0;

					pData[ 3 ] = 0;
					pData[ 7 ] = 0;
					pData[ 11 ] = 0;
					pData[ 15 ] = arguments[3];
				}
				else if(arguments[0] instanceof Vec4){

					var v4fColumn1: IVec4 = arguments[0];
					var v4fColumn2: IVec4 = arguments[1];
					var v4fColumn3: IVec4 = arguments[2];
					var v4fColumn4: IVec4 = arguments[3];

					pData[ 0 ] = v4fColumn1.x;
					pData[ 4 ] = v4fColumn2.x;
					pData[ 8 ] = v4fColumn3.x;
					pData[ 12 ] = v4fColumn4.x;

					pData[ 1 ] = v4fColumn1.y;
					pData[ 5 ] = v4fColumn2.y;
					pData[ 9 ] = v4fColumn3.y;
					pData[ 13 ] = v4fColumn4.y;

					pData[ 2 ] = v4fColumn1.z;
					pData[ 6 ] = v4fColumn2.z;
					pData[ 10 ] = v4fColumn3.z;
					pData[ 14 ] = v4fColumn4.z;

					pData[ 3 ] = v4fColumn1.w;
					pData[ 7 ] = v4fColumn2.w;
					pData[ 11 ] = v4fColumn3.w;
					pData[ 15 ] = v4fColumn4.w;
				}
				else{
//arrays

					var v4fColumn1:  number [] = arguments[0];
					var v4fColumn2:  number [] = arguments[1];
					var v4fColumn3:  number [] = arguments[2];
					var v4fColumn4:  number [] = arguments[3];

					pData[ 0 ] = v4fColumn1[0];
					pData[ 4 ] = v4fColumn2[0];
					pData[ 8 ] = v4fColumn3[0];
					pData[ 12 ] = v4fColumn4[0];

					pData[ 1 ] = v4fColumn1[1];
					pData[ 5 ] = v4fColumn2[1];
					pData[ 9 ] = v4fColumn3[1];
					pData[ 13 ] = v4fColumn4[1];

					pData[ 2 ] = v4fColumn1[2];
					pData[ 6 ] = v4fColumn2[2];
					pData[ 10 ] = v4fColumn3[2];
					pData[ 14 ] = v4fColumn4[2];

					pData[ 3 ] = v4fColumn1[3];
					pData[ 7 ] = v4fColumn2[3];
					pData[ 11 ] = v4fColumn3[3];
					pData[ 15 ] = v4fColumn4[3];

				}
			}
			else{
//nArgumentsLength === 16

				pData[ 0 ] = arguments[ 0 ];
				pData[ 4 ] = arguments[ 4 ];
				pData[ 8 ] = arguments[ 8 ];
				pData[ 12 ] = arguments[ 12 ];

				pData[ 1 ] = arguments[ 1 ];
				pData[ 5 ] = arguments[ 5 ];
				pData[ 9 ] = arguments[ 9 ];
				pData[ 13 ] = arguments[ 13 ];

				pData[ 2 ] = arguments[ 2 ];
				pData[ 6 ] = arguments[ 6 ];
				pData[ 10 ] = arguments[ 10 ];
				pData[ 14 ] = arguments[ 14 ];

				pData[ 3 ] = arguments[ 3 ];
				pData[ 7 ] = arguments[ 7 ];
				pData[ 11 ] = arguments[ 11 ];
				pData[ 15 ] = arguments[ 15 ];
			}
			return this;
		};

		identity() : IMat4{
			var pData: Float32Array = this.data;

			pData[ 0 ] = 1.;
			pData[ 4 ] = 0.;
			pData[ 8 ] = 0.;
			pData[ 12 ] = 0.;

			pData[ 1 ] = 0.;
			pData[ 5 ] = 1.;
			pData[ 9 ] = 0.;
			pData[ 13 ] = 0.;

			pData[ 2 ] = 0.;
			pData[ 6 ] = 0.;
			pData[ 10 ] = 1.;
			pData[ 14 ] = 0.;

			pData[ 3 ] = 0.;
			pData[ 7 ] = 0.;
			pData[ 11 ] = 0.;
			pData[ 15 ] = 1.;

			return this;
		};

		add(m4fMat: IMat4, m4fDestination?: IMat4): IMat4{
			if(!isDef(m4fDestination)){
				m4fDestination = this;
			}

			var pData1: Float32Array = this.data;
			var pData2: Float32Array = m4fMat.data;
			var pDataDestination: Float32Array = m4fDestination.data;

			pDataDestination[ 0 ] = pData1[ 0 ] + pData2[ 0 ];
			pDataDestination[ 4 ] = pData1[ 4 ] + pData2[ 4 ];
			pDataDestination[ 8 ] = pData1[ 8 ] + pData2[ 8 ];
			pDataDestination[ 12 ] = pData1[ 12 ] + pData2[ 12 ];

			pDataDestination[ 1 ] = pData1[ 1 ] + pData2[ 1 ];
			pDataDestination[ 5 ] = pData1[ 5 ] + pData2[ 5 ];
			pDataDestination[ 9 ] = pData1[ 9 ] + pData2[ 9 ];
			pDataDestination[ 13 ] = pData1[ 13 ] + pData2[ 13 ];

			pDataDestination[ 2 ] = pData1[ 2 ] + pData2[ 2 ];
			pDataDestination[ 6 ] = pData1[ 6 ] + pData2[ 6 ];
			pDataDestination[ 10 ] = pData1[ 10 ] + pData2[ 10 ];
			pDataDestination[ 14 ] = pData1[ 14 ] + pData2[ 14 ];

			pDataDestination[ 3 ] = pData1[ 3 ] + pData2[ 3 ];
			pDataDestination[ 7 ] = pData1[ 7 ] + pData2[ 7 ];
			pDataDestination[ 11 ] = pData1[ 11 ] + pData2[ 11 ];
			pDataDestination[ 15 ] = pData1[ 15 ] + pData2[ 15 ];

			return m4fDestination;
		};

		subtract(m4fMat: IMat4, m4fDestination?: IMat4): IMat4{
			if(!isDef(m4fDestination)){
				m4fDestination = this;
			}

			var pData1: Float32Array = this.data;
			var pData2: Float32Array = m4fMat.data;
			var pDataDestination: Float32Array = m4fDestination.data;

			pDataDestination[ 0 ] = pData1[ 0 ] - pData2[ 0 ];
			pDataDestination[ 4 ] = pData1[ 4 ] - pData2[ 4 ];
			pDataDestination[ 8 ] = pData1[ 8 ] - pData2[ 8 ];
			pDataDestination[ 12 ] = pData1[ 12 ] - pData2[ 12 ];

			pDataDestination[ 1 ] = pData1[ 1 ] - pData2[ 1 ];
			pDataDestination[ 5 ] = pData1[ 5 ] - pData2[ 5 ];
			pDataDestination[ 9 ] = pData1[ 9 ] - pData2[ 9 ];
			pDataDestination[ 13 ] = pData1[ 13 ] - pData2[ 13 ];

			pDataDestination[ 2 ] = pData1[ 2 ] - pData2[ 2 ];
			pDataDestination[ 6 ] = pData1[ 6 ] - pData2[ 6 ];
			pDataDestination[ 10 ] = pData1[ 10 ] - pData2[ 10 ];
			pDataDestination[ 14 ] = pData1[ 14 ] - pData2[ 14 ];

			pDataDestination[ 3 ] = pData1[ 3 ] - pData2[ 3 ];
			pDataDestination[ 7 ] = pData1[ 7 ] - pData2[ 7 ];
			pDataDestination[ 11 ] = pData1[ 11 ] - pData2[ 11 ];
			pDataDestination[ 15 ] = pData1[ 15 ] - pData2[ 15 ];

			return m4fDestination;
		};

		multiply(m4fMat: IMat4, m4fDestination?: IMat4): IMat4{
			if(!isDef(m4fDestination)){
	            m4fDestination = this;
	        }

			var pData1: Float32Array = this.data;
		    var pData2: Float32Array = m4fMat.data;
	        var pDataDestination: Float32Array = m4fDestination.data;

//кешируем значения матриц для ускорения

	        var a11:  number  = pData1[ 0 ], a12:  number  = pData1[ 4 ], a13:  number  = pData1[ 8 ], a14:  number  = pData1[ 12 ];
	        var a21:  number  = pData1[ 1 ], a22:  number  = pData1[ 5 ], a23:  number  = pData1[ 9 ], a24:  number  = pData1[ 13 ];
	        var a31:  number  = pData1[ 2 ], a32:  number  = pData1[ 6 ], a33:  number  = pData1[ 10 ], a34:  number  = pData1[ 14 ];
	        var a41:  number  = pData1[ 3 ], a42:  number  = pData1[ 7 ], a43:  number  = pData1[ 11 ], a44:  number  = pData1[ 15 ];

	        var b11:  number  = pData2[ 0 ], b12:  number  = pData2[ 4 ], b13:  number  = pData2[ 8 ], b14:  number  = pData2[ 12 ];
	        var b21:  number  = pData2[ 1 ], b22:  number  = pData2[ 5 ], b23:  number  = pData2[ 9 ], b24:  number  = pData2[ 13 ];
	        var b31:  number  = pData2[ 2 ], b32:  number  = pData2[ 6 ], b33:  number  = pData2[ 10 ], b34:  number  = pData2[ 14 ];
	        var b41:  number  = pData2[ 3 ], b42:  number  = pData2[ 7 ], b43:  number  = pData2[ 11 ], b44:  number  = pData2[ 15 ];

	        pDataDestination[ 0 ] = a11 * b11 + a12 * b21 + a13 * b31 + a14 * b41;
	        pDataDestination[ 4 ] = a11 * b12 + a12 * b22 + a13 * b32 + a14 * b42;
	        pDataDestination[ 8 ] = a11 * b13 + a12 * b23 + a13 * b33 + a14 * b43;
	        pDataDestination[ 12 ] = a11 * b14 + a12 * b24 + a13 * b34 + a14 * b44;

	        pDataDestination[ 1 ] = a21 * b11 + a22 * b21 + a23 * b31 + a24 * b41;
	        pDataDestination[ 5 ] = a21 * b12 + a22 * b22 + a23 * b32 + a24 * b42;
	        pDataDestination[ 9 ] = a21 * b13 + a22 * b23 + a23 * b33 + a24 * b43;
	        pDataDestination[ 13 ] = a21 * b14 + a22 * b24 + a23 * b34 + a24 * b44;

	        pDataDestination[ 2 ] = a31 * b11 + a32 * b21 + a33 * b31 + a34 * b41;
	        pDataDestination[ 6 ] = a31 * b12 + a32 * b22 + a33 * b32 + a34 * b42;
	        pDataDestination[ 10 ] = a31 * b13 + a32 * b23 + a33 * b33 + a34 * b43;
	        pDataDestination[ 14 ] = a31 * b14 + a32 * b24 + a33 * b34 + a34 * b44;

	        pDataDestination[ 3 ] = a41 * b11 + a42 * b21 + a43 * b31 + a44 * b41;
	        pDataDestination[ 7 ] = a41 * b12 + a42 * b22 + a43 * b32 + a44 * b42;
	        pDataDestination[ 11 ] = a41 * b13 + a42 * b23 + a43 * b33 + a44 * b43;
	        pDataDestination[ 15 ] = a41 * b14 + a42 * b24 + a43 * b34 + a44 * b44;

		    return m4fDestination;
		};

		/**@inline*/  multiplyLeft(m4fMat: IMat4, m4fDestination?: IMat4): IMat4{
			if(!isDef(m4fDestination)){
				m4fDestination = this;
			}
			return m4fMat.multiply(this,m4fDestination);
		};

		multiplyVec4(v4fVec: IVec4, v4fDestination?: IVec4): IVec4{
			if(!isDef(v4fDestination)){
				v4fDestination = new Vec4();
			}

			var pData: Float32Array = this.data;

			var x:  number  = v4fVec.x, y:  number  = v4fVec.y, z:  number  = v4fVec.z, w:  number  = v4fVec.w;

			v4fDestination.x = pData[ 0 ]*x + pData[ 4 ]*y + pData[ 8 ]*z + pData[ 12 ]*w;
	        v4fDestination.y = pData[ 1 ]*x + pData[ 5 ]*y + pData[ 9 ]*z + pData[ 13 ]*w;
	        v4fDestination.z = pData[ 2 ]*x + pData[ 6 ]*y + pData[ 10 ]*z + pData[ 14 ]*w;
	        v4fDestination.w = pData[ 3 ]*x + pData[ 7 ]*y + pData[ 11 ]*z + pData[ 15 ]*w;

	        return v4fDestination;
		};

		transpose(m4fDestination?: IMat4): IMat4{

			var pData = this.data;

		    if(!isDef(m4fDestination)){
		        var a12:  number  = pData[ 4 ], a13:  number  = pData[ 8 ], a14:  number  = pData[ 12 ];
		        var a23:  number  = pData[ 9 ], a24:  number  = pData[ 13 ];
		        var a34:  number  = pData[ 14 ];

		        pData[ 4 ] = pData[ 1 ];
		        pData[ 8 ] = pData[ 2 ];
		        pData[ 12 ] = pData[ 3 ];

		        pData[ 1 ] = a12;
		        pData[ 9 ] = pData[ 6 ];
		        pData[ 13 ] = pData[ 7 ];

		        pData[ 2 ] = a13;
		        pData[ 6 ] = a23;
		        pData[ 14 ] = pData[ 11 ];

		        pData[ 3 ] = a14;
		        pData[ 7 ] = a24;
		        pData[ 11 ] = a34;

		        return this;
		    }

		    var pDataDestination = m4fDestination.data;

		    pDataDestination[ 0 ] = pData[ 0 ];
		    pDataDestination[ 4 ] = pData[ 1 ];
		    pDataDestination[ 8 ] = pData[ 2 ];
		    pDataDestination[ 12 ] = pData[ 3 ];

		    pDataDestination[ 1 ] = pData[ 4 ];
		    pDataDestination[ 5 ] = pData[ 5 ];
		    pDataDestination[ 9 ] = pData[ 6 ];
		    pDataDestination[ 13 ] = pData[ 7 ];

		    pDataDestination[ 2 ] = pData[ 8 ];
		    pDataDestination[ 6 ] = pData[ 9 ];
		    pDataDestination[ 10 ] = pData[ 10 ];
		    pDataDestination[ 14 ] = pData[ 11 ];

		    pDataDestination[ 3 ] = pData[ 12 ];
		    pDataDestination[ 7 ] = pData[ 13 ];
		    pDataDestination[ 11 ] = pData[ 14 ];
		    pDataDestination[ 15 ] = pData[ 15 ];

		    return m4fDestination;
		};

		determinant():  number {
			var pData = this.data;

		    var a11:  number  = pData[ 0 ], a12:  number  = pData[ 4 ], a13:  number  = pData[ 8 ], a14:  number  = pData[ 12 ];
		    var a21:  number  = pData[ 1 ], a22:  number  = pData[ 5 ], a23:  number  = pData[ 9 ], a24:  number  = pData[ 13 ];
		    var a31:  number  = pData[ 2 ], a32:  number  = pData[ 6 ], a33:  number  = pData[ 10 ], a34:  number  = pData[ 14 ];
		    var a41:  number  = pData[ 3 ], a42:  number  = pData[ 7 ], a43:  number  = pData[ 11 ], a44:  number  = pData[ 15 ];

		    return  a41*a32*a23*a14 - a31*a42*a23*a14 - a41*a22*a33*a14 + a21*a42*a33*a14 +
			        a31*a22*a43*a14 - a21*a32*a43*a14 - a41*a32*a13*a24 + a31*a42*a13*a24 +
			        a41*a12*a33*a24 - a11*a42*a33*a24 - a31*a12*a43*a24 + a11*a32*a43*a24 +
			        a41*a22*a13*a34 - a21*a42*a13*a34 - a41*a12*a23*a34 + a11*a42*a23*a34 +
			        a21*a12*a43*a34 - a11*a22*a43*a34 - a31*a22*a13*a44 + a21*a32*a13*a44 +
			        a31*a12*a23*a44 - a11*a32*a23*a44 - a21*a12*a33*a44 + a11*a22*a33*a44;
		};

		inverse(m4fDestination?: IMat4): IMat4{
			if(!isDef(m4fDestination)){
		        m4fDestination = this;
		    }

		    var pData: Float32Array = this.data;
		    var pDataDestination: Float32Array = m4fDestination.data;

// Cache the matrix values (makes for huge speed increases!)
		    var a11:  number  = pData[ 0 ], a12:  number  = pData[ 4 ], a13:  number  = pData[ 8 ], a14:  number  = pData[ 12 ];
		    var a21:  number  = pData[ 1 ], a22:  number  = pData[ 5 ], a23:  number  = pData[ 9 ], a24:  number  = pData[ 13 ];
		    var a31:  number  = pData[ 2 ], a32:  number  = pData[ 6 ], a33:  number  = pData[ 10 ], a34:  number  = pData[ 14 ];
		    var a41:  number  = pData[ 3 ], a42:  number  = pData[ 7 ], a43:  number  = pData[ 11 ], a44:  number  = pData[ 15 ];

		    var b00:  number  = a11*a22 - a12*a21;
		    var b01:  number  = a11*a23 - a13*a21;
		    var b02:  number  = a11*a24 - a14*a21;
		    var b03:  number  = a12*a23 - a13*a22;
		    var b04:  number  = a12*a24 - a14*a22;
		    var b05:  number  = a13*a24 - a14*a23;
		    var b06:  number  = a31*a42 - a32*a41;
		    var b07:  number  = a31*a43 - a33*a41;
		    var b08:  number  = a31*a44 - a34*a41;
		    var b09:  number  = a32*a43 - a33*a42;
		    var b10:  number  = a32*a44 - a34*a42;
		    var b11:  number  = a33*a44 - a34*a43;

		    var fDeterminant:  number  = b00*b11 - b01*b10 + b02*b09 + b03*b08 - b04*b07 + b05*b06;

		    if(fDeterminant === 0.){
		        logger.setSourceLocation( "Mat4.ts" , 624 ); logger.assert(false,"обращение матрицы с нулевым детеминантом:\n" + this.toString());
                                            ;

//чтоб все не навернулось		        return m4fDestination.set(1.);
		    }

		    var fInverseDeterminant:  number  = 1/fDeterminant;

		    pDataDestination[ 0 ] = (a22 * b11 - a23 * b10 + a24 * b09) * fInverseDeterminant;
		    pDataDestination[ 4 ] = (-a12 * b11 + a13 * b10 - a14 * b09) * fInverseDeterminant;
		    pDataDestination[ 8 ] = (a42 * b05 - a43 * b04 + a44 * b03) * fInverseDeterminant;
		    pDataDestination[ 12 ] = (-a32 * b05 + a33 * b04 - a34 * b03) * fInverseDeterminant;

		    pDataDestination[ 1 ] = (-a21 * b11 + a23 * b08 - a24 * b07) * fInverseDeterminant;
		    pDataDestination[ 5 ] = (a11 * b11 - a13 * b08 + a14 * b07) * fInverseDeterminant;
		    pDataDestination[ 9 ] = (-a41 * b05 + a43 * b02 - a44 * b01) * fInverseDeterminant;
		    pDataDestination[ 13 ] = (a31 * b05 - a33 * b02 + a34 * b01) * fInverseDeterminant;

		    pDataDestination[ 2 ] = (a21 * b10 - a22 * b08 + a24 * b06) * fInverseDeterminant;
		    pDataDestination[ 6 ] = (-a11 * b10 + a12 * b08 - a14 * b06) * fInverseDeterminant;
		    pDataDestination[ 10 ] = (a41 * b04 - a42 * b02 + a44 * b00) * fInverseDeterminant;
		    pDataDestination[ 14 ] = (-a31 * b04 + a32 * b02 - a34 * b00) * fInverseDeterminant;

		    pDataDestination[ 3 ] = (-a21 * b09 + a22 * b07 - a23 * b06) * fInverseDeterminant;
		    pDataDestination[ 7 ] = (a11 * b09 - a12 * b07 + a13 * b06) * fInverseDeterminant;
		    pDataDestination[ 11 ] = (-a41 * b03 + a42 * b01 - a43 * b00) * fInverseDeterminant;
		    pDataDestination[ 15 ] = (a31 * b03 - a32 * b01 + a33 * b00) * fInverseDeterminant;

		    return m4fDestination;
		};

		/**@inline*/  trace():  number {
			var pData: Float32Array = this.data;
			return pData[ 0 ] + pData[ 5 ] + pData[ 10 ] + pData[ 15 ];
		};

		isEqual(m4fMat: IMat4, fEps:  number  = 0.): bool{
		    var pData1: Float32Array = this.data;
		    var pData2: Float32Array = m4fMat.data;

		    if(fEps === 0.){
		        if(    pData1[ 0 ] != pData2[ 0 ]
		            || pData1[ 4 ] != pData2[ 4 ]
		            || pData1[ 8 ] != pData2[ 8 ]
		            || pData1[ 12 ] != pData2[ 12 ]
		            || pData1[ 1 ] != pData2[ 1 ]
		            || pData1[ 5 ] != pData2[ 5 ]
		            || pData1[ 9 ] != pData2[ 9 ]
		            || pData1[ 13 ] != pData2[ 13 ]
		            || pData1[ 2 ] != pData2[ 2 ]
		            || pData1[ 6 ] != pData2[ 6 ]
		            || pData1[ 10 ] != pData2[ 10 ]
		            || pData1[ 14 ] != pData2[ 14 ]
		            || pData1[ 3 ] != pData2[ 3 ]
		            || pData1[ 7 ] != pData2[ 7 ]
		            || pData1[ 11 ] != pData2[ 11 ]
		            || pData1[ 15 ] != pData2[ 15 ]){

		            return false;
		        }
		    }
		    else{
		        if(    abs(pData1[ 0 ] - pData2[ 0 ]) > fEps
		            || abs(pData1[ 4 ] - pData2[ 4 ]) > fEps
		            || abs(pData1[ 8 ] - pData2[ 8 ]) > fEps
		            || abs(pData1[ 12 ] - pData2[ 12 ]) > fEps
		            || abs(pData1[ 1 ] - pData2[ 1 ]) > fEps
		            || abs(pData1[ 5 ] - pData2[ 5 ]) > fEps
		            || abs(pData1[ 9 ] - pData2[ 9 ]) > fEps
		            || abs(pData1[ 13 ] - pData2[ 13 ]) > fEps
		            || abs(pData1[ 2 ] - pData2[ 2 ]) > fEps
		            || abs(pData1[ 6 ] - pData2[ 6 ]) > fEps
		            || abs(pData1[ 10 ] - pData2[ 10 ]) > fEps
		            || abs(pData1[ 14 ] - pData2[ 14 ]) > fEps
		            || abs(pData1[ 3 ] - pData2[ 3 ]) > fEps
		            || abs(pData1[ 7 ] - pData2[ 7 ]) > fEps
		            || abs(pData1[ 11 ] - pData2[ 11 ]) > fEps
		            || abs(pData1[ 15 ] - pData2[ 15 ]) > fEps){

		            return false;
		        }
		    }
		    return true;
		};

		isDiagonal(fEps:  number  = 0.): bool{
			var pData: Float32Array = this.data;

		    if(fEps === 0.){
		        if(    pData[ 4 ] !== 0. || pData[ 8 ] !== 0. || pData[ 12 ] != 0.
		            || pData[ 1 ] !== 0. || pData[ 9 ] !== 0. || pData[ 13 ] != 0.
		            || pData[ 2 ] !== 0. || pData[ 6 ] !== 0. || pData[ 14 ] != 0.
		            || pData[ 3 ] !== 0. || pData[ 7 ] !== 0. || pData[ 11 ] != 0.){

		            return false;
		        }
		    }
		    else{
		        if(    abs(pData[ 4 ]) > fEps || abs(pData[ 8 ]) > fEps || abs(pData[ 12 ]) > fEps
		            || abs(pData[ 1 ]) > fEps || abs(pData[ 9 ]) > fEps || abs(pData[ 13 ]) > fEps
		            || abs(pData[ 2 ]) > fEps || abs(pData[ 6 ]) > fEps || abs(pData[ 14 ]) > fEps
		            || abs(pData[ 3 ]) > fEps || abs(pData[ 7 ]) > fEps || abs(pData[ 11 ]) > fEps){

		            return false;
		        }
		    }
		    return true;
		};

		toMat3(m3fDestination?: IMat3): IMat3{
			if(!isDef(m3fDestination)){
		        m3fDestination = new Mat3();
		    }

		    var pData: Float32Array = this.data;
		    var pDataDestination: Float32Array = m3fDestination.data;

		    pDataDestination[ 0 ] = pData[ 0 ];
		    pDataDestination[ 3 ] = pData[ 4 ];
		    pDataDestination[ 6 ] = pData[ 8 ];

		    pDataDestination[ 1 ] = pData[ 1 ];
		    pDataDestination[ 4 ] = pData[ 5 ];
		    pDataDestination[ 7 ] = pData[ 9 ];

		    pDataDestination[ 2 ] = pData[ 2 ];
		    pDataDestination[ 5 ] = pData[ 6 ];
		    pDataDestination[ 8 ] = pData[ 10 ];

		    return m3fDestination;
		};

		toQuat4(q4fDestination?: IQuat4){
			if(!isDef(q4fDestination)){
				q4fDestination = new Quat4();
			}

			var pData: Float32Array = this.data;

		    var a11:  number  = pData[ 0 ], a12:  number  = pData[ 4 ], a13:  number  = pData[ 8 ];
		    var a21:  number  = pData[ 1 ], a22:  number  = pData[ 5 ], a23:  number  = pData[ 9 ];
		    var a31:  number  = pData[ 2 ], a32:  number  = pData[ 6 ], a33:  number  = pData[ 10 ];

/*x^2*/
		    var x2:  number  = ((a11 - a22 - a33) + 1.)/4.;
/*y^2*/
		    var y2:  number  = ((a22 - a11 - a33) + 1.)/4.;
/*z^2*/
		    var z2:  number  = ((a33 - a11 - a22) + 1.)/4.;
/*w^2*/
		    var w2:  number  = ((a11 + a22 + a33) + 1.)/4.;

		    var fMax:  number  = max(x2,max(y2,max(z2,w2)));

		    if(fMax == x2){
//максимальная компонента берется положительной
		        var x:  number  = sqrt(x2);

		        q4fDestination.x = x;
		        q4fDestination.y = (a21 + a12)/4./x;
		        q4fDestination.z = (a31 + a13)/4./x;
		        q4fDestination.w = (a32 - a23)/4./x;
		    }
		    else if(fMax == y2){
//максимальная компонента берется положительной
		        var y:  number  = sqrt(y2);

		        q4fDestination.x = (a21 + a12)/4./y;
		        q4fDestination.y = y;
		        q4fDestination.z = (a32 + a23)/4./y;
		        q4fDestination.w = (a13 - a31)/4./y;
		    }
		    else if(fMax == z2){
//максимальная компонента берется положительной
		        var z:  number  = sqrt(z2);

		        q4fDestination.x = (a31 + a13)/4./z;
		        q4fDestination.y = (a32 + a23)/4./z;
		        q4fDestination.z = z;
		        q4fDestination.w = (a21 - a12)/4./z;
		    }
		    else{
//максимальная компонента берется положительной
		        var w:  number  = sqrt(w2);

		        q4fDestination.x = (a32 - a23)/4./w;
		        q4fDestination.y = (a13 - a31)/4./w;
		        q4fDestination.z = (a21 - a12)/4./w;
		        q4fDestination.w = w;
		    }

		    return q4fDestination;
		};

		toRotationMatrix(m4fDestination?: IMat4): IMat4{
			if(!isDef(m4fDestination)){
		        m4fDestination = new Mat4();
		    }

		    var pData: Float32Array = this.data;
		    var pDataDestination: Float32Array = m4fDestination.data;

		    pDataDestination[ 0 ] = pData[ 0 ];
		    pDataDestination[ 4 ] = pData[ 4 ];
		    pDataDestination[ 8 ] = pData[ 8 ];
		    pDataDestination[ 12 ] = 0.;

		    pDataDestination[ 1 ] = pData[ 1 ];
		    pDataDestination[ 5 ] = pData[ 5 ];
		    pDataDestination[ 9 ] = pData[ 9 ];
		    pDataDestination[ 13 ] = 0.;

		    pDataDestination[ 2 ] = pData[ 2 ];
		    pDataDestination[ 6 ] = pData[ 6 ];
		    pDataDestination[ 10 ] = pData[ 10 ];
		    pDataDestination[ 14 ] = 0.;

		    pDataDestination[ 3 ] = 0.;
		    pDataDestination[ 7 ] = 0.;
		    pDataDestination[ 11 ] = 0.;
		    pDataDestination[ 15 ] = 1.;

		    return m4fDestination;
		};

		toString(): string{
			var pData: Float32Array = this.data;

		    return '['  + pData[ 0 ] + ", " + pData[ 4 ] + ', ' + pData[ 8 ] + ', ' + pData[ 12 ] + ',\n'
		                + pData[ 1 ] + ", " + pData[ 5 ] + ', ' + pData[ 9 ] + ', ' + pData[ 13 ] + ',\n'
		                + pData[ 2 ] + ", " + pData[ 6 ] + ', ' + pData[ 10 ] + ', ' + pData[ 14 ] + ',\n'
		                + pData[ 3 ] + ", " + pData[ 7 ] + ', ' + pData[ 11 ] + ', ' + pData[ 15 ]+ ']';
		};

		rotateRight(fAngle:  number , v3fAxis: IVec3, m4fDestination?: IMat4): IMat4{
			var pData: Float32Array = this.data;

		    var x:  number  = v3fAxis.x, y:  number  = v3fAxis.y, z:  number  = v3fAxis.z;
		    var fLength:  number  = Math.sqrt(x*x + y*y + z*z);

		    if(fLength === 0.){
		    	logger.setSourceLocation( "Mat4.ts" , 860 ); logger.assert(false,"попытка вращения вокруг оси нулевой длины. Угол " + fAngle + ". Ось " + v3fAxis.toString()); ;
		    	if(isDef(m4fDestination)){
		    		m4fDestination.set(this);
		    	}
		    	else{
		    		m4fDestination = this;
		    	}
		    	return m4fDestination;
		    }

		    var fInvLength:  number  = 1./fLength;

		    x*=fInvLength;
		    y*=fInvLength;
		    z*=fInvLength;

		    var a11:  number  = pData[ 0 ], a12:  number  = pData[ 4 ], a13:  number  = pData[ 8 ];
		    var a21:  number  = pData[ 1 ], a22:  number  = pData[ 5 ], a23:  number  = pData[ 9 ];
		    var a31:  number  = pData[ 2 ], a32:  number  = pData[ 6 ], a33:  number  = pData[ 10 ];

		    var fSin:  number  = sin(fAngle);
		    var fCos:  number  = cos(fAngle);
		    var fTmp:  number  = 1. - fCos;

//build Rotation matrix

		    var b11:  number  = fCos + fTmp*x*x, b12:  number  = fTmp*x*y - fSin*z, b13:  number  = fTmp*x*z + fSin*y;
		    var b21:  number  = fTmp*y*z + fSin*z, b22:  number  = fCos + fTmp*y*y, b23:  number  = fTmp*y*z - fSin*x;
		    var b31:  number  = fTmp*z*x - fSin*y, b32:  number  = fTmp*z*y + fSin*x, b33:  number  = fCos + fTmp*z*z;

		    if(!isDef(m4fDestination)){
		        pData[ 0 ] = a11*b11 + a12*b21 + a13*b31;
		        pData[ 4 ] = a11*b12 + a12*b22 + a13*b32;
		        pData[ 8 ] = a11*b13 + a12*b23 + a13*b33;

		        pData[ 1 ] = a21*b11 + a22*b21 + a23*b31;
		        pData[ 5 ] = a21*b12 + a22*b22 + a23*b32;
		        pData[ 9 ] = a21*b13 + a22*b23 + a23*b33;

		        pData[ 2 ] = a31*b11 + a32*b21 + a33*b31;
		        pData[ 6 ] = a31*b12 + a32*b22 + a33*b32;
		        pData[ 10 ] = a31*b13 + a32*b23 + a33*b33;

		        return this;
		    }

		    var pDataDestination: Float32Array = m4fDestination.data;

		    pDataDestination[ 0 ] = a11*b11 + a12*b21 + a13*b31;
		    pDataDestination[ 4 ] = a11*b12 + a12*b22 + a13*b32;
		    pDataDestination[ 8 ] = a11*b13 + a12*b23 + a13*b33;
		    pDataDestination[ 12 ] = pData[ 12 ];

		    pDataDestination[ 1 ] = a21*b11 + a22*b21 + a23*b31;
		    pDataDestination[ 5 ] = a21*b12 + a22*b22 + a23*b32;
		    pDataDestination[ 9 ] = a21*b13 + a22*b23 + a23*b33;
		    pDataDestination[ 13 ] = pData[ 13 ];

		    pDataDestination[ 2 ] = a31*b11 + a32*b21 + a33*b31;
		    pDataDestination[ 6 ] = a31*b12 + a32*b22 + a33*b32;
		    pDataDestination[ 10 ] = a31*b13 + a32*b23 + a33*b33;
		    pDataDestination[ 14 ] = pData[ 14 ];

		    pDataDestination[ 3 ] = pData[ 3 ];
		    pDataDestination[ 7 ] = pData[ 7 ];
		    pDataDestination[ 11 ] = pData[ 11 ];
		    pDataDestination[ 15 ] = pData[ 15 ];

		    return m4fDestination;
		};

		rotateLeft(fAngle:  number , v3fAxis: IVec3, m4fDestination?: IMat4): IMat4{
			var pData: Float32Array = this.data;

		    var x:  number  = v3fAxis.x, y:  number  = v3fAxis.y, z:  number  = v3fAxis.z;
		    var fLength:  number  = Math.sqrt(x*x + y*y + z*z);

		    if(fLength === 0.){
		    	logger.setSourceLocation( "Mat4.ts" , 938 ); logger.assert(false,"попытка вращения вокруг оси нулевой длины. Угол " + fAngle + ". Ось " + v3fAxis.toString()); ;
		    	if(isDef(m4fDestination)){
		    		m4fDestination.set(this);
		    	}
		    	else{
		    		m4fDestination = this;
		    	}
		    	return m4fDestination;
		    }

		    var fInvLength:  number  = 1./fLength;

		    x*=fInvLength;
		    y*=fInvLength;
		    z*=fInvLength;

		    var a11:  number  = pData[ 0 ], a12:  number  = pData[ 4 ], a13:  number  = pData[ 8 ], a14:  number  = pData[ 12 ];
		    var a21:  number  = pData[ 1 ], a22:  number  = pData[ 5 ], a23:  number  = pData[ 9 ], a24:  number  = pData[ 13 ];
		    var a31:  number  = pData[ 2 ], a32:  number  = pData[ 6 ], a33:  number  = pData[ 10 ], a34:  number  = pData[ 14 ];

		    var fSin:  number  = sin(fAngle);
		    var fCos:  number  = cos(fAngle);
		    var fTmp:  number  = 1. - fCos;

//build Rotation matrix

		    var b11:  number  = fCos + fTmp*x*x, b12:  number  = fTmp*x*y - fSin*z, b13:  number  = fTmp*x*z + fSin*y;
		    var b21:  number  = fTmp*y*z + fSin*z, b22:  number  = fCos + fTmp*y*y, b23:  number  = fTmp*y*z - fSin*x;
		    var b31:  number  = fTmp*z*x - fSin*y, b32:  number  = fTmp*z*y + fSin*x, b33:  number  = fCos + fTmp*z*z;

		    if(!isDef(m4fDestination)){
		        pData[ 0 ] = b11*a11 + b12*a21 + b13*a31;
		        pData[ 4 ] = b11*a12 + b12*a22 + b13*a32;
		        pData[ 8 ] = b11*a13 + b12*a23 + b13*a33;
		        pData[ 12 ] = b11*a14 + b12*a24 + b13*a34;

		        pData[ 1 ] = b21*a11 + b22*a21 + b23*a31;
		        pData[ 5 ] = b21*a12 + b22*a22 + b23*a32;
		        pData[ 9 ] = b21*a13 + b22*a23 + b23*a33;
		        pData[ 13 ] = b21*a14 + b22*a24 + b23*a34;

		        pData[ 2 ] = b31*a11 + b32*a21 + b33*a31;
		        pData[ 6 ] = b31*a12 + b32*a22 + b33*a32;
		        pData[ 10 ] = b31*a13 + b32*a23 + b33*a33;
		        pData[ 14 ] = b31*a14 + b32*a24 + b33*a34;

		        return this;
		    }

		    var pDataDestination: Float32Array = m4fDestination.data;

		    pDataDestination[ 0 ] = b11*a11 + b12*a21 + b13*a31;
		    pDataDestination[ 4 ] = b11*a12 + b12*a22 + b13*a32;
		    pDataDestination[ 8 ] = b11*a13 + b12*a23 + b13*a33;
		    pDataDestination[ 12 ] = b11*a14 + b12*a24 + b13*a34;

		    pDataDestination[ 1 ] = b21*a11 + b22*a21 + b23*a31;
		    pDataDestination[ 5 ] = b21*a12 + b22*a22 + b23*a32;
		    pDataDestination[ 9 ] = b21*a13 + b22*a23 + b23*a33;
		    pDataDestination[ 13 ] = b21*a14 + b22*a24 + b23*a34;

		    pDataDestination[ 2 ] = b31*a11 + b32*a21 + b33*a31;
		    pDataDestination[ 6 ] = b31*a12 + b32*a22 + b33*a32;
		    pDataDestination[ 10 ] = b31*a13 + b32*a23 + b33*a33;
		    pDataDestination[ 14 ] = b31*a14 + b32*a24 + b33*a34;

		    pDataDestination[ 3 ] = pData[ 3 ];
		    pDataDestination[ 7 ] = pData[ 7 ];
		    pDataDestination[ 11 ] = pData[ 11 ];
		    pDataDestination[ 15 ] = pData[ 15 ];

		    return m4fDestination;
		};

		/**@inline*/  setTranslation(v3fTranslation: IVec3): IMat4{
			var pData: Float32Array = this.data;

			pData[ 12 ] = v3fTranslation.x;
			pData[ 13 ] = v3fTranslation.y;
			pData[ 14 ] = v3fTranslation.z;

			return this;
		};

		/**@inline*/  getTranslation(v3fTranslation?: IVec3): IVec3{
			if(!isDef(v3fTranslation)){
				v3fTranslation = new Vec3();
			}

			var pData: Float32Array = this.data;

			v3fTranslation.x = pData[ 12 ];
			v3fTranslation.y = pData[ 13 ];
			v3fTranslation.z = pData[ 14 ];

			return v3fTranslation;
		};

		translateRight(v3fTranslation: IVec3, m4fDestination?: IMat4): IMat4{
			var pData: Float32Array = this.data;

		    var x:  number  = v3fTranslation.x, y:  number  = v3fTranslation.y, z:  number  = v3fTranslation.z;

		    if(!isDef(m4fDestination)){
		        pData[ 12 ] = pData[ 0 ]*x + pData[ 4 ]*y + pData[ 8 ]*z + pData[ 12 ];
		        pData[ 13 ] = pData[ 1 ]*x + pData[ 5 ]*y + pData[ 9 ]*z + pData[ 13 ];
		        pData[ 14 ] = pData[ 2 ]*x + pData[ 6 ]*y + pData[ 10 ]*z + pData[ 14 ];
		        pData[ 15 ] = pData[ 3 ]*x + pData[ 7 ]*y + pData[ 11 ]*z + pData[ 15 ];
//строго говоря последнюю строчку умножать не обязательно, так как она должна быть -> 0 0 0 1
		        return this;
		    }

		    var pDataDestination: Float32Array = m4fDestination.data;

//кешируем матрицу вращений
		    var a11:  number  = pData[ 0 ], a12:  number  = pData[ 4 ], a13:  number  = pData[ 8 ];
		    var a21:  number  = pData[ 0 ], a22:  number  = pData[ 5 ], a23:  number  = pData[ 9 ];
		    var a31:  number  = pData[ 0 ], a32:  number  = pData[ 6 ], a33:  number  = pData[ 10 ];
		    var a41:  number  = pData[ 0 ], a42:  number  = pData[ 7 ], a43:  number  = pData[ 11 ];

		    pDataDestination[ 0 ] = a11;
		    pDataDestination[ 4 ] = a12;
		    pDataDestination[ 8 ] = a13;
		    pDataDestination[ 12 ] = a11*x + a12*y + a13*z + pData[ 12 ];

		    pDataDestination[ 1 ] = a21;
		    pDataDestination[ 5 ] = a22;
		    pDataDestination[ 9 ] = a23;
		    pDataDestination[ 13 ] = a21*x + a22*y + a23*z + pData[ 13 ];

		    pDataDestination[ 2 ] = a31;
		    pDataDestination[ 6 ] = a32;
		    pDataDestination[ 10 ] = a33;
		    pDataDestination[ 14 ] = a31*x + a32*y + a33*z + pData[ 14 ];

		    pDataDestination[ 3 ] = a41;
		    pDataDestination[ 7 ] = a42;
		    pDataDestination[ 11 ] = a43;
		    pDataDestination[ 15 ] = a41*x + a42*y + a43*z + pData[ 15 ];

		    return m4fDestination;
		};

		translateLeft(v3fTranslation: IVec3, m4fDestination?: IMat4): IMat4{
			var pData: Float32Array = this.data;

		    var x:  number  = v3fTranslation.x, y:  number  = v3fTranslation.y, z:  number  = v3fTranslation.z;

		    if(!isDef(m4fDestination)){
		        pData[ 12 ] = x + pData[ 12 ];
		        pData[ 13 ] = y + pData[ 13 ];
		        pData[ 14 ] = z + pData[ 14 ];
		        return this;
		    }

		    var pDataDestination: Float32Array = m4fDestination.data;

		    pDataDestination[ 0 ] = pData[ 0 ];
		    pDataDestination[ 4 ] = pData[ 4 ];
		    pDataDestination[ 8 ] = pData[ 8 ];
		    pDataDestination[ 12 ] = x + pData[ 12 ];

		    pDataDestination[ 1 ] = pData[ 1 ];
		    pDataDestination[ 5 ] = pData[ 5 ];
		    pDataDestination[ 9 ] = pData[ 9 ];
		    pDataDestination[ 13 ] = y + pData[ 13 ];

		    pDataDestination[ 2 ] = pData[ 2 ];
		    pDataDestination[ 6 ] = pData[ 6 ];
		    pDataDestination[ 10 ] = pData[ 10 ];
		    pDataDestination[ 14 ] = z + pData[ 14 ];

		    pDataDestination[ 3 ] = pData[ 3 ];
		    pDataDestination[ 7 ] = pData[ 7 ];
		    pDataDestination[ 11 ] = pData[ 11 ];
		    pDataDestination[ 15 ] = pData[ 15 ];

		    return m4fDestination;
		};

		scaleRight(v3fScale: IVec3, m4fDestination?: IMat4): IMat4{
			var pData: Float32Array = this.data;

		    var x:  number  = v3fScale.x, y:  number  = v3fScale.y, z:  number  = v3fScale.z;

		    if(!isDef(m4fDestination)){
		        pData[ 0 ] *= x;
		        pData[ 4 ] *= y;
		        pData[ 8 ] *= z;

		        pData[ 1 ] *= x;
		        pData[ 5 ] *= y;
		        pData[ 9 ] *= z;

		        pData[ 2 ] *= x;
		        pData[ 6 ] *= y;
		        pData[ 10 ] *= z;

//скейлить эти компоненты необязательно, так как там должны лежать нули
		        pData[ 3 ] *= x;
		        pData[ 7 ] *= y;
		        pData[ 11 ] *= z;

		        return this;
		    }

		    var pDataDestination: Float32Array = m4fDestination.data;

		    pDataDestination[ 0 ] = pData[ 0 ]*x;
		    pDataDestination[ 4 ] = pData[ 4 ]*y;
		    pDataDestination[ 8 ] = pData[ 8 ]*z;
		    pDataDestination[ 12 ] = pData[ 12 ];

		    pDataDestination[ 1 ] = pData[ 1 ]*x;
		    pDataDestination[ 5 ] = pData[ 5 ]*y;
		    pDataDestination[ 9 ] = pData[ 9 ]*z;
		    pDataDestination[ 13 ] = pData[ 13 ];

		    pDataDestination[ 2 ] = pData[ 2 ]*x;
		    pDataDestination[ 6 ] = pData[ 6 ]*y;
		    pDataDestination[ 10 ] = pData[ 10 ]*z;
		    pDataDestination[ 14 ] = pData[ 14 ];

//скейлить эти компоненты необязательно, так как там должны лежать нули
		    pDataDestination[ 3 ] = pData[ 3 ]*x;
		    pDataDestination[ 7 ] = pData[ 7 ]*y;
		    pDataDestination[ 11 ] = pData[ 11 ]*z;
		    pDataDestination[ 15 ] = pData[ 15 ];

		    return m4fDestination;
		};

		scaleLeft(v3fScale: IVec3, m4fDestination?: IMat4): IMat4{
			var pData: Float32Array = this.data;

		    var x:  number  = v3fScale.x, y:  number  = v3fScale.y, z:  number  = v3fScale.z;

		    if(!isDef(m4fDestination)){
		        pData[ 0 ] *= x;
		        pData[ 4 ] *= x;
		        pData[ 8 ] *= x;
		        pData[ 12 ] *= x;

		        pData[ 1 ] *= y;
		        pData[ 5 ] *= y;
		        pData[ 9 ] *= y;
		        pData[ 13 ] *= y;

		        pData[ 2 ] *= z;
		        pData[ 6 ] *= z;
		        pData[ 10 ] *= z;
		        pData[ 14 ] *= z;

		        return this;
		    }

		    var pDataDestination: Float32Array = m4fDestination.data;

		    pDataDestination[ 0 ] = pData[ 0 ]*x;
		    pDataDestination[ 4 ] = pData[ 4 ]*x;
		    pDataDestination[ 8 ] = pData[ 8 ]*x;
		    pDataDestination[ 12 ] = pData[ 12 ]*x;

		    pDataDestination[ 1 ] = pData[ 1 ]*y;
		    pDataDestination[ 5 ] = pData[ 5 ]*y;
		    pDataDestination[ 9 ] = pData[ 9 ]*y;
		    pDataDestination[ 13 ] = pData[ 13 ]*y;

		    pDataDestination[ 2 ] = pData[ 2 ]*z;
		    pDataDestination[ 6 ] = pData[ 6 ]*z;
		    pDataDestination[ 10 ] = pData[ 10 ]*z;
		    pDataDestination[ 14 ] = pData[ 14 ]*z;

		    pDataDestination[ 3 ] = pData[ 3 ];
		    pDataDestination[ 7 ] = pData[ 7 ];
		    pDataDestination[ 11 ] = pData[ 11 ];
		    pDataDestination[ 15 ] = pData[ 15 ];

		    return m4fDestination;
		};

		/**@inline*/  decompose(q4fRotation: IQuat4, v3fScale: IVec3, v3fTranslation: IVec3): bool{
			this.getTranslation(v3fTranslation);
			var m3fRotScale = this.toMat3(mat3());
			return m3fRotScale.decompose(q4fRotation,v3fScale);
		};

		row(iRow:  number , v4fDestination?: IVec4): IVec4{
			if(!isDef(v4fDestination)){
				v4fDestination = new Vec4();
			}

			var pData: Float32Array = this.data;

			switch(iRow){
				case 1:
					v4fDestination.x = pData[ 0 ];
					v4fDestination.y = pData[ 4 ];
					v4fDestination.z = pData[ 8 ];
					v4fDestination.w = pData[ 12 ];
					break;
				case 2:
					v4fDestination.x = pData[ 1 ];
					v4fDestination.y = pData[ 5 ];
					v4fDestination.z = pData[ 9 ];
					v4fDestination.w = pData[ 13 ];
					break;
				case 3:
					v4fDestination.x = pData[ 2 ];
					v4fDestination.y = pData[ 6 ];
					v4fDestination.z = pData[ 10 ];
					v4fDestination.w = pData[ 14 ];
					break;
				case 4:
					v4fDestination.x = pData[ 3 ];
					v4fDestination.y = pData[ 7 ];
					v4fDestination.z = pData[ 11 ];
					v4fDestination.w = pData[ 15 ];
					break;
			}

			return v4fDestination;
		};

		column(iColumn:  number , v4fDestination?: IVec4): IVec4{
			if(!isDef(v4fDestination)){
				v4fDestination = new Vec4();
			}

			var pData: Float32Array = this.data;

			switch(iColumn){
				case 1:
					v4fDestination.x = pData[ 0 ];
					v4fDestination.y = pData[ 1 ];
					v4fDestination.z = pData[ 2 ];
					v4fDestination.w = pData[ 3 ];
					break;
				case 2:
					v4fDestination.x = pData[ 4 ];
					v4fDestination.y = pData[ 5 ];
					v4fDestination.z = pData[ 6 ];
					v4fDestination.w = pData[ 7 ];
					break;
				case 3:
					v4fDestination.x = pData[ 8 ];
					v4fDestination.y = pData[ 9 ];
					v4fDestination.z = pData[ 10 ];
					v4fDestination.w = pData[ 11 ];
					break;
				case 4:
					v4fDestination.x = pData[ 12 ];
					v4fDestination.y = pData[ 13 ];
					v4fDestination.z = pData[ 14 ];
					v4fDestination.w = pData[ 15 ];
					break;
			}

			return v4fDestination;
		};

		unproj(v3fScreen: IVec3, v4fDestination?: IVec4): IVec4;
		unproj(v4fScreen: IVec4, v4fDestination?: IVec4): IVec4;
		unproj(v: any, v4fDestination?: IVec4): IVec4 {
			if(!isDef(v4fDestination)){
				v4fDestination = new Vec4();
			}

			var pData: Float32Array = this.data;
			var v3fScreen: IVec3 = <IVec3>v;
			var x:  number , y:  number , z:  number ;

			if(pData[ 15 ] === 1.){
//orthogonal projection case

				z = (v3fScreen.z - pData[ 14 ])/pData[ 10 ];
				y = (v3fScreen.y - pData[ 13 ])/pData[ 5 ];
				x = (v3fScreen.x - pData[ 12 ])/pData[ 0 ];
			}
			else{
//pData[__43] === -1
//frustum case

				z = -pData[ 14 ]/(pData[ 10 ] + v3fScreen.z);
			    y = -(v3fScreen.y + pData[ 9 ])*z/pData[ 5 ];
			    x = -(v3fScreen.x + pData[ 8 ])*z/pData[ 0 ];
			}

			v4fDestination.x = x;
			v4fDestination.y = y;
			v4fDestination.z = z;
			v4fDestination.w = 1.;

			return v4fDestination;
		};

		static fromYawPitchRoll(fYaw:  number , fPitch:  number , fRoll:  number , m4fDestination?: IMat4): IMat4;
		static fromYawPitchRoll(v3fAngles: IVec3, m4fDestination?: IMat4): IMat4;
		static fromYawPitchRoll(fYaw?,fPitch?,fRoll?,m4fDestination?): IMat4{
			if(arguments.length <= 2){
//Vec3 + m4fDestination
		        var v3fVec: IVec3 = arguments[0];

		        fYaw   = v3fVec.x;
		        fPitch = v3fVec.y;
		        fRoll  = v3fVec.z;

		        m4fDestination = arguments[1];
		    }

		    if(!isDef(m4fDestination)){
		        m4fDestination = new Mat4();
		    }

		    var pDataDestination: Float32Array = m4fDestination.data;

		    var fSin1:  number  = Math.sin(fYaw);
		    var fSin2:  number  = Math.sin(fPitch);
		    var fSin3:  number  = Math.sin(fRoll);

		    var fCos1:  number  = Math.cos(fYaw);
		    var fCos2:  number  = Math.cos(fPitch);
		    var fCos3:  number  = Math.cos(fRoll);

		    pDataDestination[ 0 ] = fCos1 * fCos3 + fSin1 * fSin2 * fSin3;
		    pDataDestination[ 4 ] = fCos3 * fSin1 * fSin2 - fCos1 * fSin3;
		    pDataDestination[ 8 ] = fCos2 * fSin1;
		    pDataDestination[ 12 ] = 0.;

		    pDataDestination[ 1 ] = fCos2 * fSin3;
		    pDataDestination[ 5 ] = fCos2 * fCos3;
		    pDataDestination[ 9 ] = -fSin2;
		    pDataDestination[ 13 ] = 0.;

		    pDataDestination[ 2 ] = fCos1 * fSin2 * fSin3 - fCos3 * fSin1;
		    pDataDestination[ 6 ] = fSin1 * fSin3 + fCos1 * fCos3 * fSin2;
		    pDataDestination[ 10 ] = fCos1 * fCos2;
		    pDataDestination[ 14 ] = 0.;

		    pDataDestination[ 3 ] = 0.;
		    pDataDestination[ 7 ] = 0.;
		    pDataDestination[ 11 ] = 0.;
		    pDataDestination[ 15 ] = 1.;

		    return m4fDestination;
		};

		static fromXYZ(fX:  number , fY:  number , fZ:  number , m4fDestination?: IMat4): IMat4;
		static fromXYZ(v3fAngles: IVec3, m4fDestination?: IMat4): IMat4;
		static fromXYZ(fX?, fY?, fZ?, m4fDestination?) : IMat4{
			if(arguments.length <= 2){
//Vec3 + m4fDestination
				var v3fVec: IVec3 = arguments[0];
				return Mat4.fromYawPitchRoll(v3fVec.y,v3fVec.x,v3fVec.z,arguments[1]);
			}
			else{
//fX fY fZ m4fDestination
				var fX:  number  = arguments[0];
				var fY:  number  = arguments[1];
				var fZ:  number  = arguments[2];

				return Mat4.fromYawPitchRoll(fY, fX, fZ, arguments[3]);
			}
		};

		static frustum(fLeft:  number , fRight:  number , fBottom:  number , fTop:  number , fNear:  number , fFar:  number , m4fDestination?: IMat4): IMat4{
			if(!isDef(m4fDestination)){
		        m4fDestination = new Mat4();
		    }

		    var pDataDestination: Float32Array = m4fDestination.data;

		    var fRL:  number  = fRight - fLeft;
		    var fTB:  number  = fTop - fBottom;
		    var fFN:  number  = fFar - fNear;

		    pDataDestination[ 0 ] = 2.*fNear/fRL;
		    pDataDestination[ 4 ] = 0.;
		    pDataDestination[ 8 ] = (fRight + fLeft)/fRL;
		    pDataDestination[ 12 ] = 0.;

		    pDataDestination[ 1 ] = 0.;
		    pDataDestination[ 5 ] = 2.*fNear/fTB;
		    pDataDestination[ 9 ] = (fTop + fBottom)/fTB;
		    pDataDestination[ 13 ] = 0.;

		    pDataDestination[ 2 ] = 0.;
		    pDataDestination[ 6 ] = 0.;
		    pDataDestination[ 10 ] = -(fFar + fNear)/fFN;
		    pDataDestination[ 14 ] = -2.*fFar*fNear/fFN;

		    pDataDestination[ 3 ] = 0.;
		    pDataDestination[ 7 ] = 0.;
		    pDataDestination[ 11 ] = -1.;
		    pDataDestination[ 15 ] = 0.;

		    return m4fDestination;
		};

		/**@inline*/  static perspective(fFovy:  number , fAspect:  number , fNear:  number , fFar:  number , m4fDestination?: IMat4): IMat4{
			var fTop:  number  = fNear*tan(fFovy/2.);
			var fRight:  number  = fTop*fAspect;

			return Mat4.frustum(-fRight, fRight, -fTop, fTop, fNear, fFar, m4fDestination);
		};

		static orthogonalProjectionAsymmetric(fLeft:  number , fRight:  number , fBottom:  number ,
												 fTop:  number , fNear:  number , fFar:  number , m4fDestination?: IMat4): IMat4{

			 if(!isDef(m4fDestination)){
		        m4fDestination = new Mat4();
		    }

		    var pDataDestination: Float32Array = m4fDestination.data;

		    var fRL:  number  = fRight - fLeft;
		    var fTB:  number  = fTop - fBottom;
		    var fFN:  number  = fFar - fNear;

		    pDataDestination[ 0 ] = 2./fRL;
		    pDataDestination[ 4 ] = 0.;
		    pDataDestination[ 8 ] = 0.;
		    pDataDestination[ 12 ] = -(fRight + fLeft)/fRL;

		    pDataDestination[ 1 ] = 0.;
		    pDataDestination[ 5 ] = 2./fTB;
		    pDataDestination[ 9 ] = 0.;
		    pDataDestination[ 13 ] = -(fTop + fBottom)/fTB;

		    pDataDestination[ 2 ] = 0.;
		    pDataDestination[ 6 ] = 0.;
		    pDataDestination[ 10 ] = -2./fFN;
		    pDataDestination[ 14 ] = -(fFar + fNear)/fFN;

		    pDataDestination[ 3 ] = 0.;
		    pDataDestination[ 7 ] = 0.;
		    pDataDestination[ 11 ] = 0.;
		    pDataDestination[ 15 ] = 1.;

		    return m4fDestination;
		};

		/**@inline*/  static orthogonalProjection(fWidth:  number , fHeight:  number , fNear:  number , fFar:  number , m4fDestination?: IMat4): IMat4{
			var fRight:  number  = fWidth/2.;
		    var fTop:  number  = fHeight/2.;
		    return Mat4.orthogonalProjectionAsymmetric(-fRight, fRight, -fTop, fTop, fNear, fFar, m4fDestination);
		};

		static lookAt(v3fEye: IVec3, v3fCenter: IVec3, v3fUp: IVec3, m4fDestination?: IMat4): IMat4{
			if(!isDef(m4fDestination)){
		        m4fDestination = new Mat4(1.);
		    }

		    var fEyeX:  number  = v3fEye.x, fEyeY:  number  = v3fEye.y, fEyeZ:  number  = v3fEye.z;
		    var fCenterX:  number  = v3fCenter.x, fCenterY:  number  = v3fCenter.y, fCenterZ:  number  = v3fCenter.z;
		    var fUpX:  number  = v3fUp.x, fUpY:  number  = v3fUp.y, fUpZ:  number  = v3fUp.z;

		    var fLength:  number ;
		    var fInvLength:  number ;

		    if(fEyeX === fCenterX && fEyeY === fCenterY && fEyeZ === fCenterZ){
		        return m4fDestination;
		    }

		    var fXNewX:  number , fXNewY:  number , fXNewZ:  number ;
		    var fYNewX:  number , fYNewY:  number , fYNewZ:  number ;
		    var fZNewX:  number , fZNewY:  number , fZNewZ:  number ;

//ось Z направлена на наблюдателя
		    fZNewX = fEyeX - fCenterX;
		    fZNewY = fEyeY - fCenterY;
		    fZNewZ = fEyeZ - fCenterZ;

		    fLength = sqrt(fZNewX*fZNewX + fZNewY*fZNewY + fZNewZ*fZNewZ);
		    fInvLength = 1./fLength;

//новая ось Z
		    fZNewX = fZNewX*fInvLength;
		    fZNewY = fZNewY*fInvLength;
		    fZNewZ = fZNewZ*fInvLength;

//новая ось X
		    fXNewX = fUpY*fZNewZ - fUpZ*fZNewY;
		    fXNewY = fUpZ*fZNewX - fUpX*fZNewZ;
		    fXNewZ = fUpX*fZNewY - fUpY*fZNewX;

		    fLength = sqrt(fXNewX*fXNewX + fXNewY*fXNewY + fXNewZ*fXNewZ);
		    if(fLength){
		    	fInvLength = 1./fLength;

		        fXNewX = fXNewX*fInvLength;
		        fXNewY = fXNewY*fInvLength;
		        fXNewZ = fXNewZ*fInvLength;
		    }

//новая ось Y

		    fYNewX = fZNewY*fXNewZ - fZNewZ*fXNewY;
		    fYNewY = fZNewZ*fXNewX - fZNewX*fXNewZ;
		    fYNewZ = fZNewX*fXNewY - fZNewY*fXNewX;

//нормировать ненужно, так как было векторное умножение двух ортонормированных векторов

//положение камеры в новых осях
		    var fEyeNewX:  number  = fEyeX*fXNewX + fEyeY*fXNewY + fEyeZ*fXNewZ;
		    var fEyeNewY:  number  = fEyeX*fYNewX + fEyeY*fYNewY + fEyeZ*fYNewZ;
		    var fEyeNewZ:  number  = fEyeX*fZNewX + fEyeY*fZNewY + fEyeZ*fZNewZ;

		    var pDataDestination: Float32Array = m4fDestination.data;

//lookAt matrix === camera view matrix 
//почему новый базис записывается по строкам?
//это сзязано с тем, что это получающаяся матрица - 
//это viewMatrix камеры, а на эту матрицу умножается при рендеринге, то есть
//модель должна испытать преобразования противоположные тем, которые испытывает камера
//то есть вращение в другую сторону(базис по строкам) и сдвиг в противоположную сторону

		    pDataDestination[ 0 ] = fXNewX;
		    pDataDestination[ 4 ] = fXNewY;
		    pDataDestination[ 8 ] = fXNewZ;
/*отъезжаем в позицию камеры*/
		    pDataDestination[ 12 ] = -fEyeNewX;

		    pDataDestination[ 1 ] = fYNewX;
		    pDataDestination[ 5 ] = fYNewY;
		    pDataDestination[ 9 ] = fYNewZ;
/*отъезжаем в позицию камеры*/
		    pDataDestination[ 13 ] = -fEyeNewY;

		    pDataDestination[ 2 ] = fZNewX;
		    pDataDestination[ 6 ] = fZNewY;
		    pDataDestination[ 10 ] = fZNewZ;
/*отъезжаем в позицию камеры*/
		    pDataDestination[ 14 ] = -fEyeNewZ;

		    pDataDestination[ 3 ] = 0.;
		    pDataDestination[ 7 ] = 0.;
		    pDataDestination[ 11 ] = 0.;
		    pDataDestination[ 15 ] = 1.;

		    return m4fDestination;
		};

		static get stackCeil(): Mat4 { Mat4.stackPosition = Mat4.stackPosition === Mat4.stackSize - 1? 0: Mat4.stackPosition; return Mat4.stack[Mat4.stackPosition ++]; } static stackSize: number = 100; static stackPosition: number = 0; static stack: Mat4[] = (function(): Mat4[]{ var pStack: Mat4[] = new Array(Mat4.stackSize); for(var i: number = 0; i<Mat4.stackSize; i++){ pStack[i] = new Mat4(); } return pStack})();
    }
}

















module akra.math {
    export class Quat4 implements IQuat4{
    	x:  number ;
    	y:  number ;
    	z:  number ;
    	w:  number ;

    	constructor();
    	constructor(q4fQuat: IQuat4);
    	constructor(pArray:  number []);
    	constructor(fValue:  number , fW:  number );
    	constructor(v3fValue: IVec3, fW:  number );
    	constructor(fX:  number , fY:  number , fZ:  number , fW:  number );
    	constructor(fX?, fY?, fZ?, fW?){
    		var nArgumentsLength:  number  = arguments.length;

    		switch(nArgumentsLength){
    			case 1:
    				this.set(arguments[0]);
    				break;
				case 2:
					this.set(arguments[0], arguments[1]);
					break;
				case 4:
					this.set(arguments[0], arguments[1], arguments[2], arguments[3]);
					break;
				default:
					this.x = this.y = this.z = 0.;
					this.w = 1.;
					break;
    		}
    	};

    	set(): IQuat4;
		set(q4fQuat: IQuat4): IQuat4;
		set(pArray:  number []): IQuat4;
		set(fValue:  number , fW:  number ): IQuat4;
		set(v3fValue: IVec3, fW:  number ): IQuat4;
		set(fX:  number , fY:  number , fZ:  number , fW:  number ): IQuat4;
		set(fX?, fY?, fZ?, fW?): IQuat4{
			var nArgumentsLength:  number  = arguments.length;

		    if(nArgumentsLength === 0){
		        this.x = this.y = this.z = 0.;
		        this.w = 1.;
		    }
		    if(nArgumentsLength === 1){
		        if(arguments[0] instanceof Quat4){
		        	var q4fQuat: IQuat4 = arguments[0];

		            this.x = q4fQuat.x;
		            this.y = q4fQuat.y;
		            this.z = q4fQuat.z;
		            this.w = q4fQuat.w;
		        }
		        else{
//Array
		            var pElements:  number [] = arguments[0];

		            this.x = pElements[0];
		            this.y = pElements[1];
		            this.z = pElements[2];
		            this.w = pElements[3];
		        }
		    }
		    else if(nArgumentsLength === 2){
//float float
//vec3 float
		        if(isFloat(arguments[0])){
//float float
		            var fValue:  number  = arguments[0];

		            this.x = fValue;
		            this.y = fValue;
		            this.z = fValue;
		            this.w = arguments[1];
		        }
		        else{
//vec3 float
		            var v3fValue: IVec3 = arguments[0];

		            this.x = v3fValue.x;
		            this.y = v3fValue.y;
		            this.z = v3fValue.z;
		            this.w = arguments[1];
		        }
		    }
		    else if(nArgumentsLength === 4){
		        this.x = arguments[0];
		        this.y = arguments[1];
		        this.z = arguments[2];
		        this.w = arguments[3];
		    }

		    return this;
		};

		multiply(q4fQuat: IQuat4, q4fDestination?: IQuat4): IQuat4{
			if(!isDef(q4fDestination)){
		        q4fDestination = this;
		    }

		    var x1:  number  = this.x, y1:  number  = this.y, z1:  number  = this.z, w1:  number  = this.w;
		    var x2:  number  = q4fQuat.x, y2:  number  = q4fQuat.y, z2:  number  = q4fQuat.z, w2:  number  = q4fQuat.w;

		    q4fDestination.x = x1*w2 + x2*w1 + y1*z2 - z1*y2;
		    q4fDestination.y = y1*w2 + y2*w1 + z1*x2 - x1*z2;
		    q4fDestination.z = z1*w2 + z2*w1 + x1*y2 - y1*x2;
		    q4fDestination.w = w1*w2 - x1*x2 - y1*y2 - z1*z2;

		    return q4fDestination;
		};

		multiplyVec3(v3fVec: IVec3, v3fDestination?: IVec3): IVec3{
			if(!isDef(v3fDestination)){
		        v3fDestination = v3fVec;
		    }

		    var q4fVec: IQuat4 = quat4(v3fVec,0);
		    var qInverse: IQuat4 = this.inverse(quat4());

		    var qResult: IQuat4 = this.multiply(q4fVec.multiply(qInverse),quat4());

		    v3fDestination.x = qResult.x;
		    v3fDestination.y = qResult.y;
		    v3fDestination.z = qResult.z;

		    return v3fDestination;
		};

		conjugate(q4fDestination?: IQuat4): IQuat4{
			if(!isDef(q4fDestination)){
			    this.x = -this.x;
			    this.y = -this.y;
			    this.z = -this.z;

			    return this;
			}

			q4fDestination.x = -this.x;
			q4fDestination.y = -this.y;
			q4fDestination.z = -this.z;
			q4fDestination.w = this.w;

			return q4fDestination;
		};

		inverse(q4fDestination?: IQuat4): IQuat4{
			if(!isDef(q4fDestination)){
		        q4fDestination = this;
		    }

		    var x:  number  = this.x, y:  number  = this.y, z:  number  = this.z, w:  number  = this.w;
		    var fSqLength:  number  = x*x + y*y + z*z + w*w;

		    if(fSqLength === 0.){
		        q4fDestination.x = 0.;
		        q4fDestination.y = 0.;
		        q4fDestination.z = 0.;
		        q4fDestination.w = 0.;
		    }
		    else{
		        var fInvSqLength :  number = 1./fSqLength;
		        q4fDestination.x = -x*fInvSqLength;
		        q4fDestination.y = -y*fInvSqLength;
		        q4fDestination.z = -z*fInvSqLength;
		        q4fDestination.w =  w*fInvSqLength;
		    }

		    return q4fDestination;
		};

		/**@inline*/  length() :  number {
			var x:  number  = this.x, y:  number  = this.y, z:  number  = this.z, w:  number  = this.w;
    		return sqrt(x*x + y*y + z*z + w*w);
		};

		normalize(q4fDestination?: IQuat4): IQuat4{
			if(!isDef(q4fDestination)){
		        q4fDestination = this;
		    }

		    var x:  number  = this.x, y:  number  = this.y, z:  number  = this.z, w:  number  = this.w;

		    var fLength:  number  = sqrt(x*x + y*y + z*z + w*w);

		    if(fLength === 0.){
		    	q4fDestination.x = 0.;
		    	q4fDestination.y = 0.;
		    	q4fDestination.z = 0.;
		    	q4fDestination.w = 0.;

		    }
		    else{
		    	var fInvLength:  number  = 1/fLength;

		    	q4fDestination.x = x*fInvLength;
		    	q4fDestination.y = y*fInvLength;
		    	q4fDestination.z = z*fInvLength;
		    	q4fDestination.w = w*fInvLength;
		    }

		    return q4fDestination;
		};

		calculateW(q4fDestination?: IQuat4): IQuat4{
			var x:  number  = this.x, y:  number  = this.y, z:  number  = this.z;

		    if(!isDef(q4fDestination)){
		        this.w = sqrt(1. - x*x - y*y - z*z);
		        return this;
		    }

		    q4fDestination.x = x;
		    q4fDestination.y = y;
		    q4fDestination.z = z;
		    q4fDestination.w = sqrt(1. - x*x - y*y - z*z);

		    return q4fDestination;
		};

		isEqual(q4fQuat: IQuat4, fEps:  number  = 0., asMatrix: bool = false): bool{

		    var x1:  number  = this.x, y1:  number  = this.y, z1:  number  = this.z, w1:  number  = this.w;
		    var x2:  number  = q4fQuat.x, y2:  number  = q4fQuat.y, z2:  number  = q4fQuat.z, w2:  number  = q4fQuat.w;

		    var fLength1:  number  = sqrt(x1*x1 + y1*y1 + z1*z1 + w1*w1);
		    var fLength2:  number  = sqrt(x2*x2 + y2*y2 + z2*z2 + w2*w2);

		    if(abs(fLength2 - fLength2) > fEps){
		        return false;
		    }

		    var cosHalfTheta:  number  = (x1*x2 + y1*y2 + z1*z2 + w1*w2)/fLength1/fLength2;

		    if(asMatrix){
		        cosHalfTheta = abs(cosHalfTheta);
		    }

		    if(1. - cosHalfTheta > fEps){
		        return false;
		    }
		    return true;
		};

		getYaw():  number {
		    var fYaw:  number ;

		    var x:  number  = this.x, y:  number  = this.y, z:  number  = this.z, w:  number  = this.w;

		    var fx2:  number  = x*2.;
		    var fy2:  number  = y*2.;

		    if(abs(x) == abs(w)){
//вырожденный случай обрабатывается отдельно
//
		        var wTemp:  number  = w*sqrt(2.);
//cos(Yaw/2)*cos(Roll/2) + sin(Yaw/2)*sin(Roll/2) = cos((Yaw-Roll)/2); Roll = 0;
//x==-w
//cos(Yaw/2)*cos(Roll/2) - sin(Yaw/2)*sin(Roll/2) = cos((Yaw+Roll)/2); Roll = 0;
		        var yTemp:  number  = y*sqrt(2.);
//sin(Yaw/2)*cos(Roll/2) - cos(Yaw/2)*sin(Roll/2) = sin((Yaw-Roll)/2); Roll = 0;
//x==-w
//sin(Yaw/2)*cos(Roll/2) + cos(Yaw/2)*sin(Roll/2) = sin((Yaw+Roll)/2); Roll = 0;

		        fYaw = atan2(yTemp,wTemp)*2.;
//fRoll = 0;

//убираем дополнительный оборот
		        var pi:  number  = PI;
		        if(fYaw > pi){
		            fYaw -= pi;
//fRoll = (x == w) ? -pi : pi;
		        }
		        else if(fYaw < -pi){
		            fYaw += pi;
//fRoll = (x == w) ? pi : -pi;
		        }
		    }
		    else{
//Math.atan2(sin(Yaw)*cos(Pitch),cos(Yaw)*cos(Pitch));
		        fYaw = atan2(fx2*z + fy2*w, 1. - (fx2*x + fy2*y));
		    }

		    return fYaw;
		};

		getPitch():  number {
			var fPitch:  number ;

		    var x:  number  = this.x, y:  number  = this.y, z:  number  = this.z, w:  number  = this.w;

		    var fx2:  number  = x*2.;
		    var fy2:  number  = y*2.;

/*в очень редких случаях из-за ошибок округления получается результат > 1*/
		    var fSinPitch:  number  = clamp(fx2*w - fy2*z,-1.,1.);
		    fPitch = asin(fSinPitch)

		    return fPitch;
		};

		getRoll():  number {
		    var fRoll:  number ;

		    var x:  number  = this.x, y:  number  = this.y, z:  number  = this.z, w:  number  = this.w;

		    var fx2:  number  = x*2.;
		    var fz2:  number  = z*2.;

		    if(abs(x) == abs(w)){
//вырожденный случай обрабатывается отдельно
//
		        var wTemp:  number  = w*sqrt(2.);
//cos(Yaw/2)*cos(Roll/2) + sin(Yaw/2)*sin(Roll/2) = cos((Yaw-Roll)/2); Roll = 0;
//x==-w
//cos(Yaw/2)*cos(Roll/2) - sin(Yaw/2)*sin(Roll/2) = cos((Yaw+Roll)/2); Roll = 0;
		        var yTemp:  number  = y*sqrt(2.);
//sin(Yaw/2)*cos(Roll/2) - cos(Yaw/2)*sin(Roll/2) = sin((Yaw-Roll)/2); Roll = 0;
//x==-w
//sin(Yaw/2)*cos(Roll/2) + cos(Yaw/2)*sin(Roll/2) = sin((Yaw+Roll)/2); Roll = 0;

		        var fYaw:  number  = atan2(yTemp,wTemp)*2.;
		        fRoll = 0.;

//убираем дополнительный оборот
		        var pi:  number  = PI;
		        if(fYaw > pi){
//fYaw -= pi;
		            fRoll = (x == w) ? -pi : pi;
		        }
		        else if(fYaw < -pi){
//fYaw += pi;
		            fRoll = (x == w) ? pi : -pi;
		        }
		    }
		    else{
//Math.atan2(cos(Pitch) * sin(Roll),cos(Pitch)*cos(Roll));
		        fRoll = atan2(fx2*y + fz2*w, 1. - (fx2*x + fz2*z));
		    }

		    return fRoll;
		};

		toYawPitchRoll(v3fDestination?: IVec3): IVec3{
			if(!isDef(v3fDestination)){
		        v3fDestination = new Vec3();
		    }

		    var fYaw:  number , fPitch:  number , fRoll:  number ;

		    var x:  number  = this.x, y:  number  = this.y, z:  number  = this.z, w:  number  = this.w;

		    var fx2:  number  = x*2.;
		    var fy2:  number  = y*2.;
		    var fz2:  number  = z*2.;
		    var fw2:  number  = w*2.;

/*в очень редких случаях из-за ошибок округления получается результат > 1*/
		    var fSinPitch:  number  = clamp(fx2*w - fy2*z,-1.,1.);
		    fPitch = asin(fSinPitch);
//не известен знак косинуса, как следствие это потребует дополнительной проверки.
//как показала практика - это не на что не влияет, просто один и тот же кватернион можно получить двумя разными вращениями

		    if(abs(x) == abs(w)){
//вырожденный случай обрабатывается отдельно
//
		        var wTemp:  number  = w*sqrt(2.);
//cos(Yaw/2)*cos(Roll/2) + sin(Yaw/2)*sin(Roll/2) = cos((Yaw-Roll)/2); Roll = 0;
//x==-w
//cos(Yaw/2)*cos(Roll/2) - sin(Yaw/2)*sin(Roll/2) = cos((Yaw+Roll)/2); Roll = 0;
		        var yTemp:  number  = y*sqrt(2.);
//sin(Yaw/2)*cos(Roll/2) - cos(Yaw/2)*sin(Roll/2) = sin((Yaw-Roll)/2); Roll = 0;
//x==-w
//sin(Yaw/2)*cos(Roll/2) + cos(Yaw/2)*sin(Roll/2) = sin((Yaw+Roll)/2); Roll = 0;

		        fYaw = atan2(yTemp,wTemp)*2.;
		        fRoll = 0.;

//убираем дополнительный оборот
		        var pi:  number  = PI;
		        if(fYaw > pi){
		            fYaw -= pi;
		            fRoll = (x == w) ? -pi : pi;
		        }
		        else if(fYaw < -pi){
		            fYaw += pi;
		            fRoll = (x == w) ? pi : -pi;
		        }
		    }
		    else{
//Math.atan2(sin(Yaw)*cos(Pitch),cos(Yaw)*cos(Pitch));
		        fYaw = atan2(fx2*z + fy2*w, 1. - (fx2*x + fy2*y));
//Math.atan2(cos(Pitch) * sin(Roll),cos(Pitch)*cos(Roll));
		        fRoll = atan2(fx2*y + fz2*w, 1. - (fx2*x + fz2*z));
		    }

		    v3fDestination.x = fYaw;
		    v3fDestination.y = fPitch;
		    v3fDestination.z = fRoll;

		    return v3fDestination;
		};

		toMat3(m3fDestination?: IMat3): IMat3{
			if(!isDef(m3fDestination)){
		        m3fDestination = new Mat3();
		    }
		    var pDataDestination: Float32Array = m3fDestination.data;

		    var x:  number  = this.x, y:  number  = this.y, z:  number  = this.z, w:  number  = this.w;

//потом необходимо ускорить

		    pDataDestination[ 0 ] = 1. - 2.*(y*y + z*z);
		    pDataDestination[ 3 ] = 2.*(x*y - z*w);
		    pDataDestination[ 6 ] = 2.*(x*z + y*w);

		    pDataDestination[ 1 ] = 2.*(x*y + z*w);
		    pDataDestination[ 4 ] = 1. - 2.*(x*x + z*z);
		    pDataDestination[ 7 ] = 2.*(y*z - x*w);

		    pDataDestination[ 2 ] = 2.*(x*z - y*w);
		    pDataDestination[ 5 ] = 2.*(y*z + x*w);
		    pDataDestination[ 8 ] = 1. - 2.*(x*x + y*y);

		    return m3fDestination;
		};

		toMat4(m4fDestination?: IMat4): IMat4{
			if(!isDef(m4fDestination)){
		        m4fDestination = new Mat4();
		    }
		    var pDataDestination: Float32Array = m4fDestination.data;

		    var x:  number  = this.x, y:  number  = this.y, z:  number  = this.z, w:  number  = this.w;

//потом необходимо ускорить

		    pDataDestination[ 0 ] = 1. - 2.*(y*y + z*z);
		    pDataDestination[ 4 ] = 2.*(x*y - z*w);
		    pDataDestination[ 8 ] = 2.*(x*z + y*w);
		    pDataDestination[ 12 ] = 0.;

		    pDataDestination[ 1 ] = 2.*(x*y + z*w);
		    pDataDestination[ 5 ] = 1. - 2.*(x*x + z*z);
		    pDataDestination[ 9 ] = 2.*(y*z - x*w);
		    pDataDestination[ 13 ] = 0.;

		    pDataDestination[ 2 ] = 2.*(x*z - y*w);
		    pDataDestination[ 6 ] = 2.*(y*z + x*w);
		    pDataDestination[ 10 ] = 1. - 2.*(x*x + y*y);
		    pDataDestination[ 14 ] = 0.;

		    pDataDestination[ 3 ] = 0.;
		    pDataDestination[ 7 ] = 0.;
		    pDataDestination[ 11 ] = 0.;
		    pDataDestination[ 15 ] = 1.;

    		return m4fDestination;
		};

		/**@inline*/  toString(): string{
			return "[x: " + this.x + ", y: " + this.y + ", z: " + this.z + ", w: " + this.w + "]";
		};

		mix(q4fQuat: IQuat4, fA:  number , q4fDestination?: IQuat4, bShortestPath: bool = true){
			if(!isDef(q4fDestination)){
		        q4fDestination = this;
		    }

		    fA = clamp(fA,0,1);

		    var x1:  number  = this.x, y1:  number  = this.y, z1:  number  = this.z, w1:  number  = this.w;
		    var x2:  number  = q4fQuat.x, y2:  number  = q4fQuat.y, z2:  number  = q4fQuat.z, w2:  number  = q4fQuat.w;

//скалярное произведение
		    var fCos:  number  = x1*x2 + y1*y2 + z1*z2 + w1*w2;

		    if(fCos < 0. && bShortestPath){
		        x2 = -x2;
		        y2 = -y2;
		        z2 = -z2;
		        w2 = -w2;
		    }

		    var k1:  number  = 1. - fA;
		    var k2:  number  = fA;

		    q4fDestination.x = x1*k1 + x2*k2;
		    q4fDestination.y = y1*k1 + y2*k2;
		    q4fDestination.z = z1*k1 + z2*k2;
		    q4fDestination.w = w1*k1 + w2*k2;

		    return q4fDestination;
		};

		smix(q4fQuat: IQuat4, fA:  number , q4fDestination?: IQuat4, bShortestPath: bool = true){
			if(!isDef(q4fDestination)){
		        q4fDestination = this;
		    }

		    fA = clamp(fA,0,1);

		    var x1:  number  = this.x, y1:  number  = this.y, z1:  number  = this.z, w1:  number  = this.w;
		    var x2:  number  = q4fQuat.x, y2:  number  = q4fQuat.y, z2:  number  = q4fQuat.z, w2:  number  = q4fQuat.w;

//скалярное произведение
		    var fCos:  number  = x1*x2 + y1*y2 + z1*z2 + w1*w2;

		    if(fCos < 0 && bShortestPath){
		        fCos = -fCos;
		        x2 = -x2;
		        y2 = -y2;
		        z2 = -z2;
		        w2 = -w2;
		    }

		    var fEps:  number  = 1e-3;
		    if(abs(fCos) < 1. - fEps){
		        var fSin:  number  = sqrt(1. - fCos*fCos);
		        var fInvSin:  number  = 1./fSin;

		        var fAngle:  number  = atan2(fSin,fCos);

		        var k1:  number  = sin((1. - fA) * fAngle)*fInvSin;
		        var k2:  number  = sin(fA * fAngle)*fInvSin;

		        q4fDestination.x = x1*k1 + x2*k2;
		        q4fDestination.y = y1*k1 + y2*k2;
		        q4fDestination.z = z1*k1 + z2*k2;
		        q4fDestination.w = w1*k1 + w2*k2;
		    }
		    else{
//два кватерниона или очень близки (тогда можно делать линейную интерполяцию) 
//или два кватениона диаметрально противоположны, тогда можно интерполировать любым способом
//позже надо будет реализовать какой-нибудь, а пока тоже линейная интерполяция

		        var k1:  number  = 1 - fA;
		        var k2:  number  = fA;

		        var x:  number  = x1*k1 + x2*k2;
		        var y:  number  = y1*k1 + y2*k2;
		        var z:  number  = z1*k1 + z2*k2;
		        var w:  number  = w1*k1 + w2*k2;

// и нормализуем так-как мы сошли со сферы

		        var fLength:  number  = sqrt(x*x + y*y + z*z + w*w);
		        var fInvLen:  number  = fLength ? 1/fLength : 0;

		        q4fDestination.x = x*fInvLen;
		        q4fDestination.y = y*fInvLen;
		        q4fDestination.z = z*fInvLen;
		        q4fDestination.w = w*fInvLen;
		    }

		    return q4fDestination;
		};

		static fromForwardUp(v3fForward: IVec3, v3fUp: IVec3, q4fDestination?: IQuat4): IQuat4{
			if(!isDef(q4fDestination)){
		        q4fDestination = new Quat4();
		    }

		    var fForwardX:  number  = v3fForward.x, fForwardY:  number  = v3fForward.y, fForwardZ:  number  = v3fForward.z;
		    var fUpX:  number  = v3fUp.x, fUpY:  number  = v3fUp.y, fUpZ:  number  = v3fUp.z;

		    var m3fTemp: IMat3 = mat3();
		    var pTempData: Float32Array = m3fTemp.data;

		    pTempData[ 0 ] = fUpY*fForwardZ - fUpZ*fForwardY;
		    pTempData[ 3 ] = fUpX;
		    pTempData[ 6 ] = fForwardX;

		    pTempData[ 1 ] = fUpZ*fForwardX - fUpX*fForwardZ;
		    pTempData[ 4 ] = fUpY;
		    pTempData[ 7 ] = fForwardY;

		    pTempData[ 2 ] = fUpX*fForwardY - fUpY*fForwardX;
		    pTempData[ 5 ] = fUpZ;
		    pTempData[ 8 ] = fForwardZ;

		    return m3fTemp.toQuat4(q4fDestination);
		};

		static fromAxisAngle(v3fAxis: IVec3, fAngle:  number , q4fDestination?: IQuat4): IQuat4{

			if(!isDef(q4fDestination)){
		        q4fDestination = new Quat4();
		    }

		    var x:  number  = v3fAxis.x, y:  number  = v3fAxis.y, z:  number  = v3fAxis.z;

		    var fLength:  number  = sqrt(x*x + y*y + z*z);

		    if(fLength === 0.){
		        q4fDestination.x = q4fDestination.y = q4fDestination.z = 0;
		        q4fDestination.w = 1;
		        return q4fDestination;
		    }

		    var fInvLength = 1/fLength;

		    x *= fInvLength;
		    y *= fInvLength;
		    z *= fInvLength;

		    var fSin:  number  = sin(fAngle/2);
		    var fCos:  number  = cos(fAngle/2);

		    q4fDestination.x = x * fSin;
		    q4fDestination.y = y * fSin;
		    q4fDestination.z = z * fSin;
		    q4fDestination.w = fCos;

		    return q4fDestination;
		};

		static fromYawPitchRoll(fYaw:  number , fPitch:  number , fRoll:  number ,q4fDestination?: IQuat4): IQuat4;
		static fromYawPitchRoll(v3fAngles: IVec3,q4fDestination?: IQuat4): IQuat4;
		static fromYawPitchRoll(fYaw? ,fPitch?, fRoll?, q4fDestination?): IQuat4{
			if(arguments.length <= 2){
				var v3fVec: IVec3 = arguments[0];

				fYaw = v3fVec.x;
				fPitch = v3fVec.y;
				fRoll = v3fVec.z;

				q4fDestination = arguments[1];
			}

			if(!isDef(q4fDestination)){
				q4fDestination = new Quat4();
			}

		    var fHalfYaw:  number  = fYaw * 0.5;
		    var fHalfPitch:  number  = fPitch * 0.5;
		    var fHalfRoll:  number  = fRoll * 0.5;

		    var fCos1:  number  = cos(fHalfYaw), fSin1:  number  = sin(fHalfYaw);
		    var fCos2:  number  = cos(fHalfPitch), fSin2:  number  = sin(fHalfPitch);
		    var fCos3:  number  = cos(fHalfRoll), fSin3:  number  = sin(fHalfRoll);

		    q4fDestination.x = fCos1 * fSin2 * fCos3 + fSin1 * fCos2 * fSin3;
		    q4fDestination.y = fSin1 * fCos2 * fCos3 - fCos1 * fSin2 * fSin3;
		    q4fDestination.z = fCos1 * fCos2 * fSin3 - fSin1 * fSin2 * fCos3;
		    q4fDestination.w = fCos1 * fCos2 * fCos3 + fSin1 * fSin2 * fSin3;

		    return q4fDestination;
		};

		static fromXYZ(fX:  number , fY:  number , fZ:  number , q4fDestination?: IQuat4): IQuat4;
		static fromXYZ(v3fAngles: IVec3, q4fDestination?: IQuat4): IQuat4;
		static fromXYZ(fX?, fY?, fZ?, q4fDestination?) : IQuat4{
			if(arguments.length <= 2){
//Vec3 + m4fDestination
				var v3fVec: IVec3 = arguments[0];
				return Quat4.fromYawPitchRoll(v3fVec.y,v3fVec.x,v3fVec.z,arguments[1]);
			}
			else{
//fX fY fZ m4fDestination
				var fX:  number  = arguments[0];
				var fY:  number  = arguments[1];
				var fZ:  number  = arguments[2];

				return Quat4.fromYawPitchRoll(fY, fX, fZ, arguments[3]);
			}
		};

		static get stackCeil(): Quat4 { Quat4.stackPosition = Quat4.stackPosition === Quat4.stackSize - 1? 0: Quat4.stackPosition; return Quat4.stack[Quat4.stackPosition ++]; } static stackSize: number = 100; static stackPosition: number = 0; static stack: Quat4[] = (function(): Quat4[]{ var pStack: Quat4[] = new Array(Quat4.stackSize); for(var i: number = 0; i<Quat4.stackSize; i++){ pStack[i] = new Quat4(); } return pStack})();
    }
}




module akra.math {

//
// BASIC MATH AND UNIT CONVERSION CONSTANTS
//

	export var E:  number  								= < number >Math.E;
	export var LN2:  number  								= < number >Math.LN2;
	export var LOG2E:  number  							= < number >Math.LOG2E;
	export var LOG10E:  number  							= < number >Math.LOG10E;
	export var PI:  number  								= < number >Math.PI;
	export var SQRT1_2:  number  							= < number >Math.SQRT1_2;
	export var SQRT2:  number  							= < number >Math.SQRT2;
	export var LN10:  number  								= < number >Math.LN10;

	export var POSITIVE_INFINITY:  number                  = < number >Number.POSITIVE_INFINITY;
	export var NEGATIVE_INFINITY:  number                  = < number >Number.NEGATIVE_INFINITY;


	export var FLOAT_PRECISION:  number 					= < number >(3.4e-8);
	export var TWO_PI:  number 							= < number >(2.0*PI);
	export var HALF_PI:  number 							= < number >(PI/2.0);
	export var QUARTER_PI:  number 						= < number >(PI/4.0);
	export var EIGHTH_PI:  number 							= < number >(PI/8.0);
	export var PI_SQUARED:  number 						= < number >(9.86960440108935861883449099987615113531369940724079);
	export var PI_INVERSE:  number 						= < number >(0.31830988618379067153776752674502872406891929148091);
	export var PI_OVER_180:  number 						= < number >(PI/180);
	export var PI_DIV_180:  number 						= < number >(180/PI);
	export var NATURAL_LOGARITHM_BASE:  number 			= < number >(2.71828182845904523536028747135266249775724709369996);
	export var EULERS_CONSTANT:  number 					= < number >(0.57721566490153286060651);
	export var SQUARE_ROOT_2:  number 						= < number >(1.41421356237309504880168872420969807856967187537695);
	export var INVERSE_ROOT_2:  number 					= < number >(0.707106781186547524400844362105198);
	export var SQUARE_ROOT_3:  number 						= < number >(1.73205080756887729352744634150587236694280525381038);
	export var SQUARE_ROOT_5:  number 						= < number >(2.23606797749978969640917366873127623544061835961153);
	export var SQUARE_ROOT_10:  number 					= < number >(3.16227766016837933199889354443271853371955513932522);
	export var CUBE_ROOT_2:  number 						= < number >(1.25992104989487316476721060727822835057025146470151);
	export var CUBE_ROOT_3:  number 						= < number >(1.44224957030740838232163831078010958839186925349935);
	export var FOURTH_ROOT_2:  number 						= < number >(1.18920711500272106671749997056047591529297209246382);
	export var NATURAL_LOG_2:  number 						= < number >(0.69314718055994530941723212145817656807550013436026);
	export var NATURAL_LOG_3:  number 						= < number >(1.09861228866810969139524523692252570464749055782275);
	export var NATURAL_LOG_10:  number 					= < number >(2.30258509299404568401799145468436420760110148862877);
	export var NATURAL_LOG_PI:  number 					= < number >(1.14472988584940017414342735135305871164729481291531);
	export var BASE_TEN_LOG_PI:  number 					= < number >(0.49714987269413385435126828829089887365167832438044);
	export var NATURAL_LOGARITHM_BASE_INVERSE:  number 	= < number >(0.36787944117144232159552377016146086744581113103177);
	export var NATURAL_LOGARITHM_BASE_SQUARED:  number 	= < number >(7.38905609893065022723042746057500781318031557055185);
	export var GOLDEN_RATIO:  number 						= < number >((SQUARE_ROOT_5 + 1.0) / 2.0);
	export var DEGREE_RATIO:  number 						= < number >(PI_DIV_180);
	export var RADIAN_RATIO:  number 						= < number >(PI_OVER_180);
	export var GRAVITY_CONSTANT:  number  					= 9.81;

//
// MATH AND UNIT CONVERSION FUNCTION PROTOTYPES
//

	export var abs = Math.abs;
	export var acos = Math.acos;
	export var asin = Math.asin;
	export var atan = Math.atan;
	export var atan2 = Math.atan2;
	export var exp = Math.exp;
	export var min = Math.min;
	export var random = Math.random;
	export var sqrt = Math.sqrt;
	export var log = Math.log;
	export var round = Math.round;
	export var floor = Math.floor;
	export var ceil = Math.ceil;
	export var sin = Math.sin;
	export var cos = Math.cos;
	export var tan = Math.tan;
	export var pow = Math.pow;
	export var max = Math.max;

/*	
	-----------------------------------------------------------------
	    
		Floating Point Macros
	    
	-----------------------------------------------------------------
	*/

// reinterpret a float as an int32
/** @inline */

	export var fpBits = (f:  number ):  number  => floor(f);

// reinterpret an int32 as a float
/** @inline */

	export var intBits = (i:  number ):  number  => < number > i;

// return 0 or -1 based on the sign of the float
/** @inline */

	export var fpSign = (f:  number ) => (f >> 31);

// extract the 8 bits of exponent as a signed integer
// by masking out this bits, shifting down by 23,
// and subtracting the bias value of 127
/** @inline */

	export var fpExponent = (f:  number ):  number  => (((fpBits(f) & 0x7fffffff) >> 23) - 127);

// return 0 or -1 based on the sign of the exponent
/** @inline */

	export var fpExponentSign = (f:  number ):  number  => (fpExponent(f) >> 31) ;

// get the 23 bits of mantissa without the implied bit
/** @inline */

	export var fpPureMantissa = (f:  number ):  number  => ((fpBits(f) & 0x7fffff));

// get the 23 bits of mantissa with the implied bit replaced
/** @inline */

	export var fpMantissa = (f:  number ):  number  => (fpPureMantissa(f) | (1 << 23));

	export var fpOneBits = 0x3F800000;

// flipSign is a helper Macro to
// invert the sign of i if flip equals -1, 
// if flip equals 0, it does nothing
//export var flipSign = (i, flip) ((i^ flip) - flip)
/** @inline */

	export var flipSign = (i: number, flip: number):  number  => ((flip == -1) ? -i : i);

/**
	 * Абсолютное значение числа
	 * @inline
	 */

	export var absoluteValue = abs;
/**
	 * Pow
	 * @inline
	 */

	export var raiseToPower = pow;
/**
	 * Число положительно?
	 * @inline
	 */

	export var isPositive = (a: number) => (a >= 0);
/**
	 * Число отрицательно?
	 * @inline
	 */

	export var isNegative = (a: number) => (a < 0);
/**
	 * Число одного знака?
	 * @inline
	 */

	export var sameSigns = (a: number, b: number): bool => (isNegative(a) == isNegative(b));
/**
	 * Копировать знак
	 * @inline
	 */

	export var copySign = (a: number, b: number): number => (isNegative(b) ? -absoluteValue(a) : absoluteValue(a));
/**
	 * Растояние между а и b меньше epsilon?
	 * @inline
	 */

	export var deltaRangeTest = (a: number, b: number, epsilon: number = 0.0000001): bool => ((absoluteValue(a - b) < epsilon) ? true : false);

/**
	 * Ограничивает value интервалом [low,high]
	 * @inline
	 */

	export var clamp = (value: number, low: number, high: number): number => max(low, min(value, high));
/**
	 * Ограничивает value интервалом [0,+Infinity]
	 * @inline
	 */

	export var clampPositive = (value: number): number => (value < 0 ? 0 : value);
/**
	 * Ограничивает value интервалом [-Infinity,0]
	 * @inline
	 */

	export var clampNegative = (value: number): number => (value > 0 ? 0 : value);
/**
	 * Ограничивает value интервалом [-1,1]
	 * @inline
	 */

	export var clampUnitSize = (value: number): number => clamp(value, -1, 1);


/**
	 * Номер с права начиная от нуля, самого левого установленного бита
	 * @inline
	 */

	export var highestBitSet = (value: number):  number  => value == 0 ? (null) : (value < 0 ? 31 : ((log(value) / LN2) << 0));
/**
	 * Номер с права начиная от нуля, самого правого установленного бита
	 * @inline
	 */

	export var lowestBitSet = (value:  number ):  number  => {
		var temp:  number ;

	    if (value == 0) {
	        return null;
	    }

	    for (temp = 0; temp <= 31; temp++) {
	        if (value & (1 << temp)) {
	            return temp;
	        }
	    }

	    return null;
	}

/**
	 * Является ли число степенью двойки
	 * @inline
	 */

	export var isPowerOfTwo = (value:  number ): bool => (value > 0 && highestBitSet(value) == lowestBitSet(value));
/**
	 * Округление до числа наиболее близкого к степени двойки
	 * @inline
	 */

	export var nearestPowerOfTwo = (value:  number ):  number  => {
		if (value <= 1) {
        	return 1;
	    }

	    var highestBit:  number  = highestBitSet(value);
	    var roundingTest:  number  = value & (1 << (highestBit - 1));

	    if (roundingTest != 0) {
	        ++ highestBit;
	    }

	    return 1 << highestBit;
	}

/**
	 * Округление до следующего числа являющегося к степени двойки
	 * @inline
	 */

	export var ceilingPowerOfTwo = (value:  number ):  number  => {
		if (value <= 1) {
	        return 1;
	    }

	    var highestBit:  number  = highestBitSet(value);
	    var mask:  number  = value & ((1 << highestBit) - 1);
	    highestBit += mask && 1;
	    return 1 << highestBit;
	}
/**
	 * Округление до предыдущего числа являющегося к степени двойки
	 * @inline
	 */

	export var floorPowerOfTwo = (value:  number ):  number  => {
		if (value <= 1) {
        	return 1;
	    }

	    var highestBit:  number  = highestBitSet(value);

	    return 1 << highestBit;
	}

/**
	 * Деление по модулю
	 * @inline
	 */

	export var modulus = (e:  number , divisor:  number ):  number  => (e - floor(e / divisor) * divisor);
/**
	 * 
	 * @inline
	 */

	export var mod = modulus;

/**
	 * Вырвнивание числа на alignment вверх
	 * @inline
	 */

	export var alignUp = (value:  number , alignment:  number ):  number  => {
		var iRemainder:  number  = modulus(value, alignment);
	    if (iRemainder == 0) {
	        return(value);
	    }

	    return(value + (alignment - iRemainder));
	}


/**
	 * Вырвнивание числа на alignment вниз
	 * @inline
	 */

	export var alignDown = (value:  number , alignment:  number ):  number  => {
		var remainder:  number  = modulus(value, alignment);
	    if (remainder == 0) {
	        return(value);
	    }

	    return(value - remainder);
	}

/**
	 * пнвертировать число
	 * @inline
	 */

	export var inverse = (a: number): number => 1. / a;
/**
	 * log base 2
	 * @inline
	 */

	export var log2 = (f:  number ):  number  => log(f) / LN2;
/**
	 * Округлени числа с определенной точностью, где округляется до значащих чисел как 1/(2^precision)
	 * @inline
	 */

	export var trimFloat = (f:  number , precision:  number ):  number  => f;

/**
	 * Перевод дробного в целое с усеением
	 * @inline
	 */

	export var realToInt32_chop = (a:  number ):  number  => round(a);
/**
	 * Перевод дробного в целое до меньшего
	 * @inline
	 */

	export var realToInt32_floor = (a:  number ):  number  => floor(a);
/**
	 * Перевод дробного в целое до большего
	 * @inline
	 */

	export var realToInt32_ceil = (a:  number ):  number  => ceil(a);

/**
	 * Наибольший общий делитель
	 * @inline
	 */

	export var nod = (n:  number , m:  number ):  number  => {
		var p:  number  = n % m;

		while (p != 0) {
			n = m
			m = p
			p = n % m
		}

		return m;
	}
/**
	 * Наименьшее общее кратное
	 * @inline
	 */

	export var nok = (n:  number , m:  number ):  number  => abs(n * m) / nod(n , m);
/**
	 * Greatest common devider
	 * @inline
	 */

	export var gcd = nod;
/**
	 * Least common multiple
	 * @inline
	 */

	export var lcm = nok;

// var pMat3Stack = new Array(100);
// var iMat3StackIndex = 0;

	export var isRealEqual = (a:  number , b:  number , tolerance:  number  = 1.19209e-007): bool => {
        if (math.abs(b - a) <= tolerance)
            return true;
        else
            return false;
    }

    export function vec2(): IVec2;
    export function vec2(fValue:  number ): IVec2;
    export function vec2(v2fVec: IVec2): IVec2;
    export function vec2(pArray:  number []): IVec2;
    export function vec2(fValue1:  number , fValue2:  number ): IVec2;
    export function vec2(fValue1?, fValue2?): IVec2{
        var nArgumentsLength:  number  = arguments.length;
        var v2fVec: IVec2 = Vec2.stack[Vec2.stackPosition ++];

        if(Vec2.stackPosition == Vec2.stackSize){
            Vec2.stackPosition = 0;
        }

        switch(nArgumentsLength){
            case 1:
                v2fVec.set(arguments[0]);
                break;
            case 2:
                v2fVec.set(arguments[0], arguments[1]);
                break;
            default:
                v2fVec.x = v2fVec.y = 0.;
                break;
        }

        return v2fVec;
    };

    export function vec3(): IVec3;
    export function vec3(fValue:  number ): IVec3;
    export function vec3(v3fVec: IVec3): IVec3;
    export function vec3(pArray:  number []): IVec3;
    export function vec3(fValue:  number , v2fVec: IVec2): IVec3;
    export function vec3(v2fVec: IVec2, fValue:  number ): IVec3;
    export function vec3(fValue1:  number , fValue2:  number , fValue3:  number ): IVec3;
    export function vec3(fValue1?, fValue2?, fValue3?): IVec3{
        var nArgumentsLength:  number  = arguments.length;
        var v3fVec: IVec3 = Vec3.stack[Vec3.stackPosition ++];

        if(Vec3.stackPosition == Vec3.stackSize){
            Vec3.stackPosition = 0;
        }

        switch(nArgumentsLength){
            case 1:
                v3fVec.set(arguments[0]);
                break;
            case 2:
                v3fVec.set(arguments[0], arguments[1]);
                break;
            case 3:
                v3fVec.set(arguments[0], arguments[1], arguments[2]);
                break;
            default:
                v3fVec.x = v3fVec.y = v3fVec.z = 0.;
                break;
        }

        return v3fVec;
    };

    export function vec4(): IVec4;
    export function vec4(fValue:  number ): IVec4;
    export function vec4(v4fVec: IVec4): IVec4;
    export function vec4(pArray:  number []): IVec4;
    export function vec4(fValue:  number , v3fVec: IVec3): IVec4;
    export function vec4(v2fVec1: IVec2, v2fVec2: IVec2): IVec4;
    export function vec4(v3fVec: IVec3, fValue:  number ): IVec4;
    export function vec4(fValue1:  number , fValue2:  number , v2fVec: IVec2): IVec4;
    export function vec4(fValue1:  number , v2fVec: IVec2, fValue2:  number ): IVec4;
    export function vec4(v2fVec: IVec2 ,fValue1:  number , fValue2:  number ): IVec4;
    export function vec4(fValue1:  number , fValue2:  number , fValue3:  number , fValue4:  number ): IVec4;
    export function vec4(fValue1?, fValue2?, fValue3?, fValue4?): IVec4{
        var nArgumentsLength:  number  = arguments.length;
        var v4fVec: IVec4 = Vec4.stack[Vec4.stackPosition ++];

        if(Vec4.stackPosition == Vec4.stackSize){
            Vec4.stackPosition = 0;
        }

        switch(nArgumentsLength){
            case 1:
                v4fVec.set(arguments[0]);
                break;
            case 2:
                v4fVec.set(arguments[0],arguments[1]);
                break;
            case 3:
                v4fVec.set(arguments[0],arguments[1], arguments[2]);
                break;
            case 4:
                v4fVec.set(arguments[0],arguments[1], arguments[2], arguments[3]);
                break;
            default:
                v4fVec.x = v4fVec.y = v4fVec.z = v4fVec.w = 0.;
                break;
        }

        return v4fVec;
    };

    export function quat4(): IQuat4;
	export function quat4(q4fQuat: IQuat4): IQuat4;
	export function quat4(pArray:  number []): IQuat4;
	export function quat4(fValue:  number , fW:  number ): IQuat4;
	export function quat4(v3fValue: IVec3, fW:  number ): IQuat4;
	export function quat4(fX:  number , fY:  number , fZ:  number , fW:  number ): IQuat4;
	export function quat4(fX?, fY?, fZ?, fW?): IQuat4{
		var nArgumentsLength:  number  = arguments.length;
		var q4fQuat: IQuat4 = Quat4.stack[Quat4.stackPosition ++];

		if(Quat4.stackPosition == Quat4.stackSize){
            Quat4.stackPosition = 0;
		}

		switch(nArgumentsLength){
			case 1:
				q4fQuat.set(arguments[0]);
				break;
			case 2:
				q4fQuat.set(arguments[0], arguments[1]);
				break;
			case 4:
				q4fQuat.set(arguments[0], arguments[1], arguments[2], arguments[3]);
				break;
			default:
				q4fQuat.x = q4fQuat.y = q4fQuat.z = 0.;
				q4fQuat.w = 1.;
				break;
		}

		return q4fQuat;
	};

	export function mat3(): IMat3;
	export function mat3(fValue:  number ): IMat3;
	export function mat3(v3fVec: IVec3): IMat3;
	export function mat3(m3fMat: IMat3): IMat3;
	export function mat3(m4fMat: IMat4): IMat3;
	export function mat3(pArray:  number []): IMat3;
	export function mat3(fValue1:  number , fValue2:  number , fValue3:  number ): IMat3;
	export function mat3(v3fVec1: IVec3, v3fVec2: IVec3, v3fVec3: IVec3): IMat3;
	export function mat3(pArray1:  number [], pArray2:  number [], pArray3:  number []): IMat3;
	export function mat3(fValue1:  number , fValue2:  number , fValue3:  number ,
				fValue4:  number , fValue5:  number , fValue6:  number ,
				fValue7:  number , fValue8:  number , fValue9:  number ): IMat3;
	export function mat3(fValue1?, fValue2?, fValue3?,
				fValue4?, fValue5?, fValue6?,
				fValue7?, fValue8?, fValue9?): IMat3{

		var nArgumentsLength:  number  = arguments.length;
		var m3fMat: IMat3 = Mat3.stack[Mat3.stackPosition ++];

        if(Mat3.stackPosition == Mat3.stackSize){
            Mat3.stackPosition = 0;
		}

		switch(nArgumentsLength){
			case 1:
				m3fMat.set(arguments[0]);
				break;
			case 3:
				m3fMat.set(arguments[0], arguments[1], arguments[2]);
				break;
			case 9:
				m3fMat.set(arguments[0], arguments[1], arguments[2],
						 arguments[3], arguments[4], arguments[5],
						 arguments[6], arguments[7], arguments[8]);
				break;
			default:
				m3fMat.set(0.);
				break;
		}

		return m3fMat;
	};

	export function mat4(): IMat4;
	export function mat4(fValue:  number ): IMat4;
	export function mat4(v4fVec: IVec4): IMat4;
	export function mat4(m3fMat: IMat3, v3fTranslation?: IVec3): IMat4;
	export function mat4(m4fMat: IMat4): IMat4;
	export function mat4(pArray:  number []): IMat4;
	export function mat4(pArray: Float32Array, bFlag: bool): IMat4;
	export function mat4(fValue1:  number , fValue2:  number ,
			fValue3:  number , fValue4:  number ): IMat4;
	export function mat4(v4fVec1: IVec4, v4fVec2: IVec4,
			v4fVec3: IVec4, v4fVec4: IVec4): IMat4;
	export function mat4(pArray1:  number [], pArray2:  number [],
			pArray3:  number [], pArray4:  number []): IMat4;
	export function mat4(fValue1:  number , fValue2:  number , fValue3:  number , fValue4:  number ,
			fValue5:  number , fValue6:  number , fValue7:  number , fValue8:  number ,
			fValue9:  number , fValue10:  number , fValue11:  number , fValue12:  number ,
			fValue13:  number , fValue14:  number , fValue15:  number , fValue16:  number ): IMat4;
	export function mat4(fValue1?, fValue2?, fValue3?, fValue4?,
				fValue5?, fValue6?, fValue7?, fValue8?,
				fValue9?, fValue10?, fValue11?, fValue12?,
				fValue13?, fValue14?, fValue15?, fValue16?): IMat4{

		var nArgumentsLength:  number  = arguments.length;
		var m4fMat: IMat4 = Mat4.stack[Mat4.stackPosition ++];

        if(Mat4.stackPosition == Mat4.stackSize){
            Mat4.stackPosition = 0;
		}

		if(nArgumentsLength === 2){
			if(isBoolean(arguments[1])){
				if(arguments[1]){
					m4fMat.data = arguments[0];
				}
				else{
					m4fMat.set(arguments[0]);
				}
			}
			else{
				m4fMat.set(arguments[0], arguments[1]);
			}
		}
		else{
			switch(nArgumentsLength){
				case 1:
					if(arguments[0] instanceof Mat3){
						m4fMat.set(arguments[0],vec3(0.));
					}
					else{
						m4fMat.set(arguments[0]);
					}
					break;
				case 4:
					m4fMat.set(arguments[0],arguments[1],arguments[2],arguments[3]);
					break;
				case 16:
					m4fMat.set(arguments[0], arguments[1], arguments[2], arguments[3],
						 arguments[4], arguments[5], arguments[6], arguments[7],
						 arguments[8], arguments[9], arguments[10], arguments[11],
						 arguments[12], arguments[13], arguments[14], arguments[15]);
					 break;
				 default:
				 	break;
			}
		}

		return m4fMat;
	};

	export function calcPOTtextureSize (nPixels:  number ):  number [] {
	    var w:  number , h:  number ;
	    var n:  number  = nPixels;


	    w = Math.ceil(Math.log(n) / Math.LN2 / 2.0);
	    h = Math.ceil(Math.log(n / Math.pow(2, w)) / Math.LN2);
	    w = Math.pow(2, w);
	    h = Math.pow(2, h);
	    n = w * h;
	    return [w, h, n];
	}

}

module akra {
	export var Vec2 = math.Vec2;
	export var Vec3 = math.Vec3;
	export var Vec4 = math.Vec4;

	export var Mat3 = math.Mat3;
	export var Mat4 = math.Mat4;
	export var Quat4 = math.Quat4;

	export var vec2 = math.vec2;
	export var vec3 = math.vec3;
	export var vec4 = math.vec4;
	export var quat4 = math.quat4;
	export var mat3 = math.mat3;
	export var mat4 = math.mat4;
}









module akra.webgl {
	export var maxTextureSize:  number  = 0;
	export var maxCubeMapTextureSize:  number  = 0;
	export var maxViewPortSize:  number  = 0;

	export var maxTextureImageUnits:  number  = 0;
	export var maxVertexAttributes:  number  = 0;
	export var maxVertexTextureImageUnits:  number  = 0;
	export var maxCombinedTextureImageUnits:  number  = 0;

	export var maxColorAttachments:  number  = 1;

	export var stencilBits:  number  = 0;
	export var colorBits:  number [] = [0, 0, 0];
	export var alphaBits:  number  = 0;
	export var multisampleType:  number  = 0.;

	export var shaderVersion:  number  = 0;
	export var hasNonPowerOf2Textures: bool = false;

	var pSupportedExtensionList: string[] = null;
	var pLoadedExtensionList: Object = null;

    export function createContext(
            pCanvas: HTMLCanvasElement = <HTMLCanvasElement>document.createElement("canvas"),
            pOptions?: { antialias?: bool; }): WebGLRenderingContext {

    	var pWebGLContext: WebGLRenderingContext = null;

		try {
			pWebGLContext = pCanvas.getContext("webgl", pOptions) ||
				pCanvas.getContext("experimental-webgl", pOptions);
    	}
		catch (e) {}

		if (!pWebGLContext) {
			logger.setSourceLocation( "webgl/WebGL.ts" , 58 ); logger.warning("cannot get 3d device"); ;
		}

		return pWebGLContext;
    }

	(function (pWebGLContext: WebGLRenderingContext): void {
		if (!pWebGLContext) {
			return;
		}

		maxTextureSize 					= pWebGLContext.getParameter( 0x0D33 );
		maxCubeMapTextureSize 			= pWebGLContext.getParameter( 0x851C );
		maxViewPortSize 				= pWebGLContext.getParameter( 0x0D3A );

		maxTextureImageUnits 			= pWebGLContext.getParameter( 0x8872 );
		maxVertexAttributes 			= pWebGLContext.getParameter( 0x8869 );
		maxVertexTextureImageUnits 		= pWebGLContext.getParameter( 0x8B4C );
		maxCombinedTextureImageUnits 	= pWebGLContext.getParameter( 0x8B4D );

		stencilBits 					= pWebGLContext.getParameter( 0x0D57 );
		colorBits 						= [
									        pWebGLContext.getParameter( 0x0D52 ),
									        pWebGLContext.getParameter( 0x0D53 ),
									        pWebGLContext.getParameter( 0x0D54 )
	   									];

	    alphaBits 						= pWebGLContext.getParameter( 0x0D55 );
	    multisampleType 				= pWebGLContext.getParameter( 0x80AA );

	    pSupportedExtensionList 		= pWebGLContext.getSupportedExtensions();


	    pSupportedExtensionList.push( "WEBGL_debug_shaders" ,  "WEBGL_debug_renderer_info" );

	    var pWebGLExtentionList: Object = {};
	    var pWebGLExtension: Object;

	    for (var i:  number  = 0; i < pSupportedExtensionList.length; ++ i) {
	        if (pWebGLExtension = pWebGLContext.getExtension(pSupportedExtensionList[i])) {
	            pWebGLExtentionList[pSupportedExtensionList[i]] = pWebGLExtension;

	            logger.setSourceLocation( "webgl/WebGL.ts" , 100 ); logger.log("loaded WebGL extension: %1", pSupportedExtensionList[i]); ;

	            for (var j in pWebGLExtension) {
	                if (isFunction(pWebGLExtension[j])) {

	                    pWebGLContext[j] = function () {
	                        pWebGLContext[j] = new Function(
	                            "var t = this.pWebGLExtentionList[" + pSupportedExtensionList[i] + "];" +
	                            "t." + j + ".apply(t, arguments);");
	                    }

	                }
	                else {
	                    pWebGLContext[j] = pWebGLExtentionList[pSupportedExtensionList[i]][j];
	                }
	            }
	        }
	        else {
	            logger.setSourceLocation( "webgl/WebGL.ts" , 118 ); logger.warning("cannot load extension: %1", pSupportedExtensionList[i]); ;
	            pSupportedExtensionList.splice(i, 1);
	        }
	    }


	    (<any>pWebGLContext).pWebGLExtentionList = pWebGLExtentionList;
	    pLoadedExtensionList = pWebGLExtentionList;

	})(createContext());

	export function hasExtension(sExtName: string): bool {
        for (var i:  number  = 0; i < pSupportedExtensionList.length; ++ i) {
            if (pSupportedExtensionList[i].search(sExtName) != -1) {
                return true;
            }
        }

        return false;
	}

	export function getWebGLUsage(iFlags:  number ):  number  {
		if ( (((iFlags) & (EHardwareBufferFlags.DYNAMIC)) != 0) ) {
	        return  0x88E8 ;
	    }
	    else if ( (((iFlags) & (EHardwareBufferFlags.STREAM)) != 0) ) {
	        return  0x88E0 ;
	    }

	    return  0x88E4 ;
	}

	export function getWebGLOriginFormat(eFormat: EPixelFormats):  number  {
		switch(eFormat){
			case EPixelFormats.A8:
                return  0x1906 ;

            case EPixelFormats.L8:
            case EPixelFormats.L16:
                return  0x1909 ;

            case EPixelFormats.FLOAT16_RGB:
            	return webgl.hasExtension( "OES_texture_half_float" ) ?  0x1907  : 0;

            case EPixelFormats.FLOAT16_RGBA:
            	return webgl.hasExtension( "OES_texture_half_float" ) ?  0x1908  : 0;

           	case EPixelFormats.FLOAT16_R:
            case EPixelFormats.R8:
                return webgl.hasExtension( "EXT_texture_rg" ) ?  0x1903  : 0;

            case EPixelFormats.FLOAT16_GR:
            case EPixelFormats.RG8:
                return webgl.hasExtension( "EXT_texture_rg" ) ?  0x8227  : 0;

            case EPixelFormats.BYTE_LA:
            case EPixelFormats.SHORT_GR:
                return  0x190A ;

// PVRTC compressed formats
            case EPixelFormats.PVRTC_RGB2:
                return webgl.hasExtension( "WEBGL_compressed_texture_pvrtc" ) ?  0x8C01  : 0;
            case EPixelFormats.PVRTC_RGB4:
                return webgl.hasExtension( "WEBGL_compressed_texture_pvrtc" ) ?  0x8C00  : 0;
            case EPixelFormats.PVRTC_RGBA2:
                return webgl.hasExtension( "WEBGL_compressed_texture_pvrtc" ) ?  0x8C03  : 0;
            case EPixelFormats.PVRTC_RGBA4:
                return webgl.hasExtension( "WEBGL_compressed_texture_pvrtc" ) ?  0x8C02  : 0;

            case EPixelFormats.R5G6B5:
            case EPixelFormats.B5G6R5:
            case EPixelFormats.R8G8B8:
            case EPixelFormats.B8G8R8:
                return  0x1907 ;

            case EPixelFormats.A1R5G5B5:
                return  0x80E1 ;

            case EPixelFormats.A4R4G4B4:
            case EPixelFormats.X8R8G8B8:
            case EPixelFormats.A8R8G8B8:
            case EPixelFormats.B8G8R8A8:
            case EPixelFormats.X8B8G8R8:
            case EPixelFormats.A8B8G8R8:
                return  0x1908 ;

            case EPixelFormats.DXT1:
                return webgl.hasExtension( "WEBGL_compressed_texture_s3tc" ) ?  0x83F1  : 0;

            case EPixelFormats.DXT3:
                return webgl.hasExtension( "WEBGL_compressed_texture_s3tc" ) ?  0x83F2  : 0;

            case EPixelFormats.DXT5:
                return webgl.hasExtension( "WEBGL_compressed_texture_s3tc" ) ?  0x83F3  : 0;

            case EPixelFormats.FLOAT32_GR:
            case EPixelFormats.FLOAT32_R:

            default:
                return 0;
        }

	}

	export function getWebGLOriginDataType(eFormat: EPixelFormats):  number  {
		switch(eFormat){
			case EPixelFormats.A8:
            case EPixelFormats.L8:
            case EPixelFormats.L16:
            case EPixelFormats.R8G8B8:
            case EPixelFormats.B8G8R8:
            case EPixelFormats.BYTE_LA:
                return  0x1401 ;
            case EPixelFormats.R5G6B5:
            case EPixelFormats.B5G6R5:
                return  0x8363 ;
            case EPixelFormats.A4R4G4B4:
				return  0x8033 ;
            case EPixelFormats.A1R5G5B5:
                return  0x8034 ;

            case EPixelFormats.X8B8G8R8:
            case EPixelFormats.A8B8G8R8:
                return  0x8367 ;
            case EPixelFormats.X8R8G8B8:
            case EPixelFormats.A8B8G8R8:
            case EPixelFormats.A8R8G8B8:
                return  0x8367 ;
            case EPixelFormats.B8G8R8A8:
                return  0x1401 ;
            case EPixelFormats.R8G8B8A8:
                return  0x1401 ;

            case EPixelFormats.FLOAT16_R:
            case EPixelFormats.FLOAT16_GR:
            case EPixelFormats.FLOAT16_RGB:
            case EPixelFormats.FLOAT16_RGBA:
                return webgl.hasExtension( "OES_texture_half_float" ) ?  0x8D61  : 0;

            case EPixelFormats.R8:
            case EPixelFormats.RG8:
                return webgl.hasExtension( "EXT_texture_rg" ) ?  0x1401  : 0;

            case EPixelFormats.FLOAT32_R:
            case EPixelFormats.FLOAT32_GR:
            case EPixelFormats.FLOAT32_RGB:
            case EPixelFormats.FLOAT32_RGBA:
                return  0x1406 ;
            case EPixelFormats.DXT1:
            case EPixelFormats.DXT3:
            case EPixelFormats.DXT5:
            case EPixelFormats.R3G3B2:
            case EPixelFormats.A2R10G10B10:
            case EPixelFormats.A2B10G10R10:
            case EPixelFormats.SHORT_RGBA:
            case EPixelFormats.SHORT_RGB:
            case EPixelFormats.SHORT_GR:
// TODO not supported
            default:
                return 0;
		}
	}

	export function getWebGLInternalFormat(eFormat: EPixelFormats, isHWGamma: bool = false):  number  {
        switch (eFormat) {
            case EPixelFormats.L8:
            case EPixelFormats.L16:
                return  0x1909 ;

            case EPixelFormats.A8:
                return  0x1906 ;

            case EPixelFormats.BYTE_LA:
                return  0x190A ;

            case EPixelFormats.PVRTC_RGB2:
                return webgl.hasExtension( "WEBGL_compressed_texture_pvrtc" ) ?  0x8C01  : 0;
            case EPixelFormats.PVRTC_RGB4:
                return webgl.hasExtension( "WEBGL_compressed_texture_pvrtc" ) ?  0x8C00  : 0;
            case EPixelFormats.PVRTC_RGBA2:
                return webgl.hasExtension( "WEBGL_compressed_texture_pvrtc" ) ?  0x8C03  : 0;
            case EPixelFormats.PVRTC_RGBA4:
                return webgl.hasExtension( "WEBGL_compressed_texture_pvrtc" ) ?  0x8C02  : 0;

            case EPixelFormats.X8B8G8R8:
            case EPixelFormats.X8R8G8B8:
			case EPixelFormats.A8B8G8R8:
            case EPixelFormats.A8R8G8B8:
            case EPixelFormats.B8G8R8A8:
            case EPixelFormats.A1R5G5B5:
            case EPixelFormats.A4R4G4B4:
                return  0x1908 ;
            case EPixelFormats.R5G6B5:
            case EPixelFormats.B5G6R5:
            case EPixelFormats.R8G8B8:
            case EPixelFormats.B8G8R8:
                return  0x1907 ;

            case EPixelFormats.FLOAT16_R:
            case EPixelFormats.FLOAT32_R:
            case EPixelFormats.R8:
                return webgl.hasExtension( "EXT_texture_rg" ) ?  0x1903  : 0;
            case EPixelFormats.FLOAT16_GR:
            case EPixelFormats.FLOAT32_GR:
            case EPixelFormats.RG8:
                return webgl.hasExtension( "EXT_texture_rg" ) ?  0x1903  : 0;

            case EPixelFormats.A4L4:
            case EPixelFormats.R3G3B2:
            case EPixelFormats.A2R10G10B10:
            case EPixelFormats.A2B10G10R10:
            case EPixelFormats.FLOAT16_RGBA:
            case EPixelFormats.FLOAT32_RGB:
            case EPixelFormats.FLOAT32_RGBA:
            case EPixelFormats.SHORT_RGBA:
            case EPixelFormats.SHORT_RGB:
            case EPixelFormats.SHORT_GR:

			case EPixelFormats.DXT1:
				if (!isHWGamma)
					return webgl.hasExtension( "WEBGL_compressed_texture_s3tc" ) ?  0x83F1  : 0;
            case EPixelFormats.DXT3:
				if (!isHWGamma)
	                return webgl.hasExtension( "WEBGL_compressed_texture_s3tc" ) ?  0x83F2  : 0;
            case EPixelFormats.DXT5:
				if (!isHWGamma)
	                return webgl.hasExtension( "WEBGL_compressed_texture_s3tc" ) ?  0x83F2  : 0;

            default:
                return 0;
        }
    }

    export function getClosestWebGLInternalFormat(eFormat: EPixelFormats, isHWGamma: bool = false):  number  {
        var iGLFormat = webgl.getWebGLInternalFormat(eFormat, isHWGamma);

        if (iGLFormat ===  0 ) {
            if (isHWGamma) {
// TODO not supported
                return 0;
            }
            else {
                return  0x1908 ;
            }
        }
        else {
            return iGLFormat;
        }
    }

    export function getClosestAkraFormat(iGLFormat:  number , iGLDataType:  number ): EPixelFormats {
        switch (iGLFormat) {

            case  0x8C01 :
                return webgl.hasExtension( "WEBGL_compressed_texture_pvrtc" ) ? EPixelFormats.PVRTC_RGB2 : EPixelFormats.A8R8G8B8;
            case  0x8C03 :
                return webgl.hasExtension( "WEBGL_compressed_texture_pvrtc" ) ? EPixelFormats.PVRTC_RGBA2 : EPixelFormats.A8R8G8B8;
            case  0x8C00 :
                return webgl.hasExtension( "WEBGL_compressed_texture_pvrtc" ) ? EPixelFormats.PVRTC_RGB4 : EPixelFormats.A8R8G8B8;
            case  0x8C02 :
                return webgl.hasExtension( "WEBGL_compressed_texture_pvrtc" ) ? EPixelFormats.PVRTC_RGBA4 : EPixelFormats.A8R8G8B8;

            case  0x1909 :
                return EPixelFormats.L8;
            case  0x1906 :
                return EPixelFormats.A8;
            case  0x190A :
                return EPixelFormats.BYTE_LA;

            case  0x1907 :
                switch(iGLDataType) {
	                case  0x8363 :
	                    return EPixelFormats.B5G6R5;
	                default:
	                    return EPixelFormats.R8G8B8;
            	};
            case  0x1908 :
                switch(iGLDataType) {
	                case  0x8034 :
	                    return EPixelFormats.A1R5G5B5;
	                case  0x8033 :
	                    return EPixelFormats.A4R4G4B4;
	                default:
	                    return EPixelFormats.A8B8G8R8;
	            }

            case  0x80E1 :
                return EPixelFormats.A8B8G8R8;

            case  0x83F0 :
            case  0x83F1 :
                return webgl.hasExtension( "WEBGL_compressed_texture_s3tc" ) ? EPixelFormats.DXT1 : EPixelFormats.A8R8G8B8;

            case  0x83F2 :
                return webgl.hasExtension( "WEBGL_compressed_texture_s3tc" ) ? EPixelFormats.DXT3 : EPixelFormats.A8R8G8B8;
            case  0x83F3 :
                return webgl.hasExtension( "WEBGL_compressed_texture_s3tc" ) ? EPixelFormats.DXT5 : EPixelFormats.A8R8G8B8;

            case  0x8229 :
                return webgl.hasExtension( "EXT_texture_rg" ) ? EPixelFormats.R8 : EPixelFormats.A8R8G8B8;
            case  0x822B :
                return webgl.hasExtension( "EXT_texture_rg" ) ? EPixelFormats.RG8 : EPixelFormats.A8R8G8B8;

            default:
//TODO: not supported
                return EPixelFormats.A8R8G8B8;
        };
    }

    export function getMaxMipmaps(iWidth:  number , iHeight:  number , iDepth:  number , eFormat: EPixelFormats) :  number  {
		var iCount:  number  = 0;
        if((iWidth > 0) && (iHeight > 0)) {
            do {
                if(iWidth>1)		iWidth = iWidth/2;
                if(iHeight>1)		iHeight = iHeight/2;
                if(iDepth>1)		iDepth = iDepth/2;
/*
                 NOT needed, compressed formats will have mipmaps up to 1x1
                 if(PixelUtil::isValidExtent(width, height, depth, format))
                 count ++;
                 else
                 break;
                 */


                iCount ++;
            } while(!(iWidth === 1 && iHeight === 1 && iDepth === 1));
        }
		return iCount;
    }

    export function optionalPO2(iValue:  number ) :  number  {
        if (webgl.hasNonPowerOf2Textures) {
            return iValue;
        }
        else {
            return math.ceilingPowerOfTwo(< number >iValue);
        }
    }


	export function convertToWebGLformat(pSource: IPixelBox, pDest: IPixelBox): void {
// Always need to convert PF_A4R4G4B4, GL expects the colors to be in the 
// reverse order
        if (pDest.format == EPixelFormats.A4R4G4B4) {
// Convert PF_A4R4G4B4 -> PF_B4G4R4A4
// Reverse pixel order
            var iSrcPtr:  number  = (pSource.left + pSource.top * pSource.rowPitch + pSource.front * pSource.slicePitch);
            var iDstPtr:  number  = (pDest.left + pDest.top * pDest.rowPitch + pDest.front * pDest.slicePitch);
            var iSrcSliceSkip:  number  = pSource.getSliceSkip();
            var iDstSliceSkip:  number  = pDest.getSliceSkip();
            var k:  number  = pSource.right - pSource.left;
            var x:  number  = 0,
            	y:  number  = 0,
            	z:  number  = 0;

            for(z = pSource.front; z < pSource.back; z++) {
                for(y = pSource.top; y < pSource.bottom; y++) {
                    for(x = 0; x < k; x++) {
// B                        pDest[iDstPtr + x] = ((pSource[iSrcPtr + x]&0x000F)<<12) |
// G                                    		 ((pSource[iSrcPtr + x]&0x00F0)<<4)  |
// R                                    		 ((pSource[iSrcPtr + x]&0x0F00)>>4)  |
// A                                    	     ((pSource[iSrcPtr + x]&0xF000)>>12);
                    }

                    iSrcPtr += pSource.rowPitch;
                    iDstPtr += pDest.rowPitch;
                }

                iSrcPtr += iSrcSliceSkip;
                iDstPtr += iDstSliceSkip;
            }
        }
	}

	export function checkFBOAttachmentFormat(eFormat: EPixelFormats): bool {
		return false;
	}

	export function getSupportedAlternative(eFormat: EPixelFormats): EPixelFormats {
		if (checkFBOAttachmentFormat(eFormat)) {
            return eFormat;
        }

/// Find first alternative
        var pct: EPixelComponentTypes = pixelUtil.getComponentType(eFormat);

        switch (pct) {
            case EPixelComponentTypes.BYTE:
                eFormat = EPixelFormats.A8R8G8B8;
                break;
            case EPixelComponentTypes.SHORT:
                eFormat = EPixelFormats.SHORT_RGBA;
                break;
            case EPixelComponentTypes.FLOAT16:
                eFormat = EPixelFormats.FLOAT16_RGBA;
                break;
            case EPixelComponentTypes.FLOAT32:
                eFormat = EPixelFormats.FLOAT32_RGBA;
                break;
            case EPixelComponentTypes.COUNT:
            default:
                break;
        }

        if (checkFBOAttachmentFormat(eFormat)){
            return eFormat;
        }

/// If none at all, return to default
		return EPixelFormats.A8R8G8B8;
	}

}



module akra.util {
	export class ApiInfo extends Singleton implements IApiInfo {
		private bWebGL: bool = false;
		private bWebAudio: bool = false;
		private bFile: bool = false;
		private bFileSystem: bool = false;
		private bWebWorker: bool = false;
		private bTransferableObjects: bool = false;
		private bLocalStorage: bool = false;
		private bWebSocket: bool = false;

		get webGL(): bool {
			if (!this.bWebGL) {
				this.bWebGL = ((<any>window).WebGLRenderingContext || this.checkWebGL() ? true : false);
			}

			return this.bWebGL;
		}

		get transferableObjects(): bool {
			if (!this.bTransferableObjects) {
				this.bTransferableObjects = (this.bWebWorker && this.chechTransferableObjects() ? true : false);
			}

			return this.bTransferableObjects;
		}

		get file(): bool {
			return this.bFile;
		}

		get fileSystem(): bool {
			return this.bFileSystem;
		}

		get webAudio(): bool {
			return this.bWebAudio;
		}

		get webWorker(): bool {
			return this.bWebWorker;
		}

		get localStorage(): bool {
			return this.bLocalStorage;
		}

		get webSocket(): bool {
			return this.bWebSocket;
		}

		constructor () {
			super();

			var pApi = {};

			this.bWebAudio = ((<any>window).AudioContext && (<any>window).webkitAudioContext ? true : false);
			this.bFile = ((<any>window).File && (<any>window).FileReader && (<any>window).FileList && (<any>window).Blob ? true : false);
			this.bFileSystem = (this.bFile && (<any>window).URL && (<any>window).requestFileSystem ? true : false);
			this.bWebWorker = isDef((<any>window).Worker);
			this.bLocalStorage = isDef((<any>window).localStorage);
			this.bWebSocket = isDef((<any>window).WebSocket);
		}

		private checkWebGL(): bool {
			var pCanvas: HTMLCanvasElement;
			var pDevice: WebGLRenderingContext;

			try {
				pCanvas = <HTMLCanvasElement> document.createElement('canvas');
				pDevice = pCanvas.getContext('webgl', {}) ||
                       		pCanvas.getContext('experimental-webgl', {});

                if (pDevice) {
                	return true;
                }
			}
			catch (e) {}

			return false;
		}

		private chechTransferableObjects(): bool {
			var pBlob: Blob = new Blob(["onmessage = function(e) { postMessage(true); }"]);
			var sBlobURL: string = (<any>window).URL.createObjectURL(pBlob);
			var pWorker: Worker = new Worker(sBlobURL);

			var pBuffer: ArrayBuffer = new ArrayBuffer(1);

		    try {
		        pWorker.postMessage(pBuffer, [pBuffer]);
		    }
		    catch (e) {
		        logger.setSourceLocation( "util/ApiInfo.ts" , 101 ); logger.log('transferable objects not supported in your browser...'); ;
		    }

		    pWorker.terminate();

		    if (pBuffer.byteLength) {
		        return false
		    }

		    return true;
		}
	}
}





module akra.info {
	export function canvas(pCanvas: HTMLCanvasElement): ICanvasInfo;
	export function canvas(id: string): ICanvasInfo;
	export function canvas(id): ICanvasInfo {
		var pCanvas: HTMLCanvasElement = isString(id) ? document.getElementById(id) : id;

		return {
			width: isInt(pCanvas.width) ? pCanvas.width : parseInt(pCanvas.style.width),
			height: isInt(pCanvas.height) ? pCanvas.height : parseInt(pCanvas.style.height),
			id: pCanvas.id
		};
	}

	export var browser: IBrowserInfo = new util.BrowserInfo;
	export var api: IApiInfo = new util.ApiInfo;
	export var screen: IScreenInfo = new util.ScreenInfo;

	export var uri: IURI = util.uri(document.location.href);

	module is {
/**
         * show status - online or offline
         */

		export var online;
/**
         * perform test on mobile device
         */

		export var mobile: bool = (/mobile|iphone|ipad|ipod|android|blackberry|mini|windows\sce|palm/i)
			.test(navigator.userAgent.toLowerCase());
		export var linux: bool = browser.os === 'Linux';
		export var windows: bool = browser.os === 'Windows';
		export var mac: bool = browser.os === 'Mac';
		export var iPhone: bool = browser.os === 'iPhone';
	}


//TODO: move it to [akra.info.is] module, when typescript access this.
	Object.defineProperty(is, 'online', {
		get: function () {
			return navigator.onLine;
		}
	});
}


/*local and remote via thread*/








module akra {

	export interface IFileMeta {
		lastModifiedDate: string;
		size:  number ;
	}

	export interface IFile {
		 path: string;
		 name: string;
		mode:  number ;

		onread: Function;
		onopen: Function;

		position:  number ;
		byteLength:  number ;


		open(sFilename: string, iMode:  number , fnCallback?: Function): void;
		open(sFilename: string, sMode: string, fnCallback?: Function): void;
		open(sFilename: string, fnCallback?: Function): void;
		open(iMode:  number , fnCallback?: Function): void;
		open(fnCallback?: Function): void;

		close(): void;
		clear(fnCallback?: Function): void;
		read(fnCallback?: Function): void;
		write(sData: string, fnCallback?: Function, sContentType?: string): void;
		write(pData: ArrayBuffer, fnCallback?: Function, sContentType?: string): void;
		move(sFilename: string, fnCallback?: Function): void;
		copy(sFilename: string, fnCallback?: Function): void;
		rename(sFilename: string, fnCallback?: Function): void;
		remove(fnCallback?: Function): void;

//return current position
		atEnd():  number ;
//return current position;
		seek(iOffset:  number ):  number ;

		isOpened(): bool;
		isExists(fnCallback: Function): void;
		isLocal(): bool;

		getMetaData(fnCallback: Function): void;
	}
}






module akra {
	export interface IThread {
		onmessage: Function;
		onerror: Function;
		id:  number ;

		send(pData: Object, pTransferables?: any[]): void;
		send(pData: ArrayBuffer, pTransferables?: any[]): void;
		send(pData: ArrayBufferView, pTransferables?: any[]): void;
	}
}

























//#define ERR_TM_REACHED_LIMIT 0



//seconds







module akra {
    export interface IManager {
        initialize(): bool;
        destroy(): void;
    }
}



module akra {

	export interface IThread {} ;

	export interface IThreadManager extends IManager {
		createThread(): bool;
		occupyThread(): IThread;
		releaseThread(iThread:  number ): bool;
		releaseThread(pThread: IThread): bool;
	}
}






module akra.util {

	export enum EThreadStatuses {
		k_WorkerBusy,
		k_WorkerFree
	}

	export interface IThreadStats {
		status: EThreadStatuses;
		creationTime:  number ;
		releaseTime:  number ;
	}

	export class ThreadManager implements IThreadManager {
		private _sDefaultScript: string;
		private _pWorkerList: IThread[] = [];
		private _pStatsList: IThreadStats[] = [];

		constructor (sScript: string = null) {

			this._sDefaultScript = sScript;


			setInterval((): void => {
				var pStats: IThreadStats;
				var iNow:  number  = now();

				for (var i:  number  = 0; i < this._pStatsList.length; ++ i) {
					pStats = this._pStatsList[i];

					if (pStats.releaseTime > 0 && iNow - pStats.releaseTime >  30  * 1000) {
						logger.setSourceLocation( "util/ThreadManager.ts" , 43 ); logger.warning("thread must be removed: " + i); ;
					}
				};
			}, 30000);
		}

		createThread(): bool {
//console.log((new Error).stack)
			if (this._pWorkerList.length ===  32 ) {
				logger.setSourceLocation( "util/ThreadManager.ts" , 52 ); logger.error("Reached limit the number of threads"); ;
				return false;
			}

			if (!info.api.webWorker) {
				logger.setSourceLocation( "util/ThreadManager.ts" , 57 ); logger.error("WebWorkers unsupprted.."); ;
				return false;
			}

			var pWorker: IThread = <IThread><any>(new Worker(this._sDefaultScript));

			pWorker.id = this._pWorkerList.length;
			pWorker.send = (<any>pWorker).postMessage;

			this._pWorkerList.push(<IThread>pWorker);
			this._pStatsList.push({
				status: EThreadStatuses.k_WorkerFree,
				creationTime: now(),
				releaseTime: now()
				});

			return true;
		}

		occupyThread(): IThread {
			var pStats: IThreadStats;
			for (var i:  number  = 0, n:  number  = this._pWorkerList.length; i < n; ++i) {
				pStats = this._pStatsList[i];
		        if (pStats.status == EThreadStatuses.k_WorkerFree) {
		            pStats.status = EThreadStatuses.k_WorkerBusy;
		            pStats.releaseTime = 0;

		            return this._pWorkerList[i];
		        }
		    }

		    if (this.createThread()) {
		    	return this.occupyThread();
		    }

		    else {
		    	logger.setSourceLocation( "util/ThreadManager.ts" , 93 ); logger.error("cannot occupy thread"); ;
		    	return null;
		    }
		}

		releaseThread(pThread: IThread): bool;
		releaseThread(iThread:  number ): bool;
		releaseThread(pThread: any): bool {
			var iThread:  number ;
			var pStats: IThreadStats;

			if (!isInt(pThread)) {
				iThread = pThread.id;
			}
			else {
				iThread = pThread;
			}

			if (isDef(this._pStatsList[iThread])) {
				pStats = this._pStatsList[iThread];

				pStats.status = EThreadStatuses.k_WorkerFree;
				pStats.releaseTime = now();
			}

			return false;
		}

		initialize(): bool { return true; }
        destroy(): void {}
	}
}
















module akra.io {

	export enum EFileActions {
		k_Open = 1,
		k_Read = 2,
		k_Write,
		k_Clear,
		k_Exists,
		k_Remove
	};

	export enum EFileTransferModes {
		k_Normal,
		k_Slow,
		k_Fast
	}

	export interface IFileCommand {
		act: EFileActions;
		name: string;
		mode:  number ;
		pos?:  number ;
		transfer?: EFileTransferModes;
		data?: any;
		contentType?: string;
	}


	var pLocalFileThreadManager = new  util.ThreadManager( "LocalFile.t.js" ) ;
	var pRemoteFileThreadManager = new  util.ThreadManager( "RemoteFile.t.js" ) ;

	export var getLocalFileThreadManager = (): IThreadManager => pLocalFileThreadManager;
	export var getRemoteFileThreadManager = (): IThreadManager => pRemoteFileThreadManager;


	export class TFile implements IFile {
		 _iMode:  number ;
		 _pUri: IURI = null;
		 _nCursorPosition:  number  = 0;
		 _bOpened: bool = false;
		 _eTransferMode: EFileTransferModes = EFileTransferModes.k_Normal;
		 _pFileMeta: IFileMeta = null;
		 _isLocal: bool = false;


		/**@inline*/  get path(): string {
			logger.setSourceLocation( "TFile.ts" , 78 ); logger.assert(isDefAndNotNull(this._pFileMeta), "There is no file handle open."); ;
        	return this._pUri.toString();
		}

		/**@inline*/  get name(): string {
			return util.pathinfo(this._pUri.path).basename;
		}

		/**@inline*/  get mode():  number  {
			return this._iMode;
		}

//set mode(sMode: string);
//set mode(iMode: int);
		set mode(sMode: any) {
			this._iMode = isString(sMode)? filemode(sMode): sMode;
		}

		/**@inline*/  set onread(fnCallback: Function) {
			this.read(fnCallback);
		}

		/**@inline*/  set onopen(fnCallback: Function) {
			this.open(fnCallback);
		}

		/**@inline*/  get position():  number  {
			logger.setSourceLocation( "TFile.ts" , 105 ); logger.assert(isDefAndNotNull(this._pFileMeta), 'There is no file handle open.'); ;
        	return this._nCursorPosition;
		}

		set position(iOffset:  number ) {
			logger.setSourceLocation( "TFile.ts" , 110 ); logger.assert(isDefAndNotNull(this._pFileMeta), 'There is no file handle open.'); ;
			this._nCursorPosition = iOffset;
		}

		/**@inline*/  get byteLength():  number  {
       	 return this._pFileMeta? this._pFileMeta.size: 0;
		}

		constructor (sFilename?: string, sMode?: string, fnCallback: Function = TFile.defaultCallback);
		constructor (sFilename?: string, iMode?:  number , fnCallback: Function = TFile.defaultCallback);
		constructor (sFilename?: string, sMode?: any, fnCallback: Function = TFile.defaultCallback) {
			if (isDef(sMode)) {
				this._iMode = isString(sMode)? filemode(sMode): sMode;
			}

			this.setAndValidateUri(util.uri(sFilename));

			if (info.api.transferableObjects) {
				this._eTransferMode = EFileTransferModes.k_Fast;
			}
			else if (info.browser.name == "Opera") {
				this._eTransferMode = EFileTransferModes.k_Slow;
			}

			if (arguments.length > 2) {
				this.open(sFilename, sMode, fnCallback);
			}
		}

		open(sFilename: string, iMode:  number , fnCallback?: Function): void;
//open(sFilename: string, sMode: string, fnCallback?: Function): void;
		open(sFilename: string, fnCallback?: Function): void;
		open(iMode:  number , fnCallback?: Function): void;
		open(fnCallback?: Function): void;
		open(sFilename?: any, iMode?: any, fnCallback?: any): void {
			var pFile: IFile = this;
			var hasMode: bool = !isFunction(iMode);

			 if (arguments.length < 3) {
		        if (isString(arguments[0])) {
		            this.setAndValidateUri(util.uri(sFilename));
		            fnCallback = arguments[1];
		        }
		        else if (isInt(arguments[0])) {
		            this._iMode = arguments[0];
		            fnCallback = arguments[1];
		        }
		        else {
		            fnCallback = arguments[0];
		        }

		        logger.setSourceLocation( "TFile.ts" , 161 ); logger.assert(isDefAndNotNull(this._pUri), "No filename provided."); ;


		        this.open(this._pUri.toString(), this._iMode, fnCallback);

		        return;
		    }

		    fnCallback = arguments[hasMode ? 2 : 1];
		    fnCallback = fnCallback || TFile.defaultCallback;

		    if (this.isOpened()) {
		        logger.setSourceLocation( "TFile.ts" , 173 ); logger.warning("file already opened: " + this.name); ;
		        (<Function>fnCallback)(null, this._pFileMeta);
		    }

		    this.setAndValidateUri(util.uri(arguments[0]));

		    if (hasMode) {
		    	this._iMode = (isString(arguments[1]) ? filemode(<string>arguments[1]) : arguments[1]);
		    }

		    this.update(function (err) {
		    	if (err) {
		    		logger.setSourceLocation( "TFile.ts" , 185 ); logger.warning("file update err", err); ;
		    		fnCallback.call(pFile, err);
		    		return;
		    	}

		        if ( ((this._iMode & (1 << (3)) ) != 0) ) {
		            this.position = this.size;
		        }

		        fnCallback.call(pFile, null, pFile);
		    });
		}

		close(): void {
			this._pUri = null;
			this._iMode = EIO.IN | EIO.OUT;
			this._nCursorPosition = 0;
			this._pFileMeta = null;
		}

		clear(fnCallback: Function = TFile.defaultCallback): void {
			if (!this.isOpened()) { var _pArgv: IArguments = arguments; this.open(function(err) { if (err) fnCallback(err); this.clear.apply(this, _pArgv); }); return; } ;

			var pCommand: IFileCommand = {
	                                          act:  EFileActions.k_Clear,
	                                          name: this.path,
	                                          mode: this._iMode
	                                      };

			this.execCommand(pCommand, fnCallback);
		}


		read(fnCallback: Function = TFile.defaultCallback): void {
			if (!this.isOpened()) { var _pArgv: IArguments = arguments; this.open(function(err) { if (err) fnCallback(err); this.read.apply(this, _pArgv); }); return; } ;

		    var pFile: IFile = this;
		    var eTransferMode: EFileTransferModes = this._eTransferMode;

		    logger.setSourceLocation( "TFile.ts" , 224 ); logger.assert( ((this._iMode & (1 << (0)) ) != 0) , "The file is not readable."); ;


		    var pCommand: IFileCommand = {
		                     act:      EFileActions.k_Read,
		                     name:     this.path,
		                     mode:     this._iMode,
		                     pos:      this._nCursorPosition,
		                     transfer: this._eTransferMode
		                 };

		    var fnCallbackSystem: Function = function (err, pData) {
				if (err) {
					fnCallback.call(pFile, err);
					return;
				}

		        if (eTransferMode == EFileTransferModes.k_Slow &&  ((this._iMode & (1 << (5)) ) != 0) ) {
		            pData = new Uint8Array(pData).buffer;
		        }

		        pFile.atEnd();

		        fnCallback.call(pFile, null, pData);
		    };

		    this.execCommand(pCommand, fnCallbackSystem);
		}

		write(sData: string, fnCallback: Function = TFile.defaultCallback, sContentType?: string): void;
		write(pData: ArrayBuffer, fnCallback: Function = TFile.defaultCallback, sContentType?: string): void;
		write(pData: any, fnCallback: Function = TFile.defaultCallback, sContentType?: string): void {
			if (!this.isOpened()) { var _pArgv: IArguments = arguments; this.open(function(err) { if (err) fnCallback(err); this.write.apply(this, _pArgv); }); return; } ;

		    var pFile: IFile = this;
		    var iMode:  number  = this._iMode;
		    var pCommand: IFileCommand;
			var fnCallbackSystem: Function = function (err, pMeta) {
				if (err) {
					fnCallback.call(pFile, err);
					return;
				}

		    	pFile.position += isString(pData)? pData.length: pData.byteLength;
		    	(<any>pFile)._pFileMeta = <IFileMeta>pMeta;

		    	fnCallback.call(pFile, null, pMeta);
		    };

		    logger.setSourceLocation( "TFile.ts" , 273 ); logger.assert( ((iMode & (1 << (1)) ) != 0) , "The file is not writable."); ;

		    sContentType = sContentType || ( ((iMode & (1 << (5)) ) != 0) ? "application/octet-stream" : "text/plain");

		    pCommand = {
                    act:         EFileActions.k_Write,
                    name:        this.path,
                    mode:        this._iMode,
                    data:        pData,
                    contentType: sContentType,
                    pos:         this._nCursorPosition
                 };

            if (!isString(pData)) {
            	this.execCommand(pCommand, fnCallbackSystem, [pData]);
            }
            else {
            	this.execCommand(pCommand, fnCallbackSystem);
        	}
		}

		move(sFilename: string, fnCallback: Function = TFile.defaultCallback): void {
			var pFile: IFile = this;

			this.copy(sFilename, function(err) {
				if (err) {
					fnCallback(err);
					return;
				}

				pFile.remove(fnCallback);
			});
		}

		copy(sFilename: string, fnCallback: Function = TFile.defaultCallback): void {
			var iMode:  number  = EIO.IN | EIO.OUT | EIO.TRUNC;
		    var pFile: IFile = this;
		    var pFileCopy: IFile;

		    if ( ((this._iMode & (1 << (5)) ) != 0) ) {
		        iMode |= EIO.BIN;
		    }

		    pFileCopy = new TFile(sFilename, iMode,
		                                     function (err) {
		                                     	if (err) {
		                                     		fnCallback(err);
		                                     	}

		                                        pFile.read(function (pData: ArrayBuffer) {
		                                            pFile.write(pData, fnCallback);
		                                        });
		                                     });
		}

		rename(sFilename: string, fnCallback: Function = TFile.defaultCallback): void {
			var pName: IPathinfo = util.pathinfo(sFilename);

		    logger.setSourceLocation( "TFile.ts" , 331 ); logger.assert(!pName.dirname, 'only filename can be specified.'); ;

		    this.move(util.pathinfo(this._pUri.path).dirname + "/" + pName.basename, fnCallback);
		}

		remove(fnCallback: Function = TFile.defaultCallback): void {
			if (!this.isOpened()) { var _pArgv: IArguments = arguments; this.open(function(err) { if (err) fnCallback(err); this.remove.apply(this, _pArgv); }); return; } ;

		    var pFile: IFile = this;
		    var pCommand: IFileCommand = {
		                     act:  EFileActions.k_Remove,
		                     name: this.path,
		                     mode: this._iMode
		                 };
		    var fnCallbackSystem: Function = function (err, pData) {
		        pFile.close();

		        if (isDef(fnCallback)) {
		            fnCallback.call(pFile, err, pData);
		        }
		    }

		    this.execCommand(pCommand, fnCallbackSystem);
		}

//return current position
		atEnd():  number  {
			this.position = this.byteLength;
			return this._nCursorPosition;
		}
//return current position;
		seek(iOffset:  number ):  number  {
			logger.setSourceLocation( "TFile.ts" , 363 ); logger.assert(isDefAndNotNull(this._pFileMeta), "There is no file handle open."); ;

		    var nSeek:  number  = this._nCursorPosition + iOffset;
		    if (nSeek < 0) {
		        nSeek = this.byteLength - (math.abs(nSeek) % this.byteLength);
		    }

		    logger.setSourceLocation( "TFile.ts" , 370 ); logger.assert(nSeek >= 0 && nSeek <= this.byteLength, "Invalid offset parameter"); ;

		    this._nCursorPosition = nSeek;

		    return this._nCursorPosition;
		}

		isOpened(): bool {
			return this._pFileMeta !== null;
		}

		isExists(fnCallback: Function): void {
			var pCommand: IFileCommand = {
                                              act:  EFileActions.k_Exists,
                                              name: this.path,
                                              mode: this._iMode
                                          };
			this.execCommand(pCommand, fnCallback);
		}

		/**@inline*/  isLocal(): bool {
			return this._isLocal;
		}

		getMetaData(fnCallback: Function): void {
			logger.setSourceLocation( "TFile.ts" , 395 ); logger.assert(isDefAndNotNull(this._pFileMeta), 'There is no file handle open.'); ;
		    fnCallback(null, {
		                  lastModifiedDate: this._pFileMeta.lastModifiedDate
		              });
		}
		private setAndValidateUri(sFilename: IURI);
		private setAndValidateUri(sFilename: string);
		private setAndValidateUri(sFilename: any) {
			var pUri: IURI = util.uri(sFilename);
			var pUriLocal: IURI;

			if (pUri.protocol === "filesystem") {
		        pUriLocal = util.uri(pUri.path);

		        logger.setSourceLocation( "TFile.ts" , 410 ); logger.assert(!(pUriLocal.protocol && pUriLocal.host != info.uri.host), "Поддерживаются только локальные файлы в пределах текущего домена.");
                                                                                                                                              ;

		        var pFolders: string[] = pUriLocal.path.split('/');

		        if (pFolders[0] == "" || pFolders[0] == ".") {
		            pFolders = pFolders.slice(1);
		        }

		        logger.setSourceLocation( "TFile.ts" , 419 ); logger.assert(pUri.host === "temporary", "Поддерживаются только файловые системы типа \"temporary\".");
                                                                                                                     ;

		        this._pUri = util.uri(pFolders.join("/"));
		        this._isLocal = true;
		    }
		    else {
		    	this._pUri = pUri;
			}
		}

		private update(fnCallback: Function = TFile.defaultCallback) {
			var pFile: IFile = this;
			var pCommand: IFileCommand = {
                     act:  EFileActions.k_Open,
                     name: this._pUri.toString(),
                     mode: this._iMode
                 };
			var fnCallbackSystem: Function = function (err, pMeta) {
				(<any>pFile)._pFileMeta = <IFileMeta>pMeta;
				fnCallback.call(pFile, err, pFile);
			};

			this.execCommand(pCommand, fnCallbackSystem);
		}

		private execCommand(pCommand: IFileCommand, fnCallback: Function, pTransferables?: any[]): void {
			TFile.execCommand(this.isLocal(), pCommand, fnCallback);
		}

		static defaultCallback: Function = function (err) {
			if (err) {
				throw err;
			}
		}

		private static execCommand(isLocal: bool, pCommand: IFileCommand, fnCallback: Function, pTransferables?: any[]): void {

			var pFile: IFile = this;
			var pManager: IThreadManager = isLocal? getLocalFileThreadManager(): getRemoteFileThreadManager();
			var pThread: IThread = pManager.occupyThread();

			pThread.onmessage = function (e) {
				pManager.releaseThread(pThread);
				pThread.onmessage = null;
				fnCallback.call(pFile, null, e.data);
			}

			pThread.onerror = function (e) {
				pManager.releaseThread(pThread);
				pThread.onmessage = null;
				fnCallback.call(pFile, e);
			}

			if (isDef(pTransferables)) {
				pThread.send(pCommand, pTransferables);
			}
			else {
				pThread.send(pCommand);
			}
		}

	}
}


/*local file via local files system(async)*/

/**
 * FIle implementation via <Local filesystem>.
 * ONLY FOR LOCAL FILES!!
 */



















module akra.io {

	class LocalFileSystem {
		private _pFileSystem: FileSystem = null;
		private _pCallbackQueue: Function[] = [];

		setFileSystem(pFS: FileSystem): void {
			this._pFileSystem = pFS;
		}

/**
		 * Инициализация файловой системы.
		 * @tparam Function fnCallback Функция, вызываемая
		 * при успешной(получет в 1ом параметре fs)
		 * инициализации системы.
		 */

		get (fnCallback: Function): void {
			if (this._pFileSystem) {
		        fnCallback(this._pFileSystem);
		        return;
		    }

		    var pFileSystem: LocalFileSystem = this;
		    var pQueue: Function[] = this._pCallbackQueue;

		    pQueue.push(fnCallback);

		    if (pQueue.length > 1) {
		        return;
		    }

    		window.storageInfo.requestQuota(window.TEMPORARY,  (32 * 1024 * 1024) ,
				function (nGrantedBytes:  number ) {
					window.requestFileSystem(
						window.TEMPORARY,
						nGrantedBytes,
						function (pFs: FileSystem) {

						   pFileSystem.setFileSystem(pFs);

						   if (pQueue.length) {
						       for (var i:  number  = 0; i < pQueue.length; ++i) {
						           pQueue[i](pFs);
						       }
						   }


						}, LocalFileSystem.errorHandler);
				});
		}

		static errorHandler (e: FileError): void {
			var sMesg: string = "init filesystem: ";

	        switch (e.code) {
	            case FileError.QUOTA_EXCEEDED_ERR:
	                sMesg += 'QUOTA_EXCEEDED_ERR';
	                break;
	            case FileError.NOT_FOUND_ERR:
	                sMesg += 'NOT_FOUND_ERR';
	                break;
	            case FileError.SECURITY_ERR:
	                sMesg += 'SECURITY_ERR';
	                break;
	            case FileError.INVALID_MODIFICATION_ERR:
	                sMesg += 'INVALID_MODIFICATION_ERR';
	                break;
	            case FileError.INVALID_STATE_ERR:
	                sMesg += 'INVALID_STATE_ERR';
	                break;
	            default:
	                sMesg += 'Unknown Error';
	                break;
	        }

	        logger.setSourceLocation( "LocalFile.ts" , 102 ); logger.error(sMesg); ;
		}
	}

	var pLocalFileSystem: LocalFileSystem = new LocalFileSystem;

	export function getFileSystem(fnCallback: (pFileSystem: FileSystem) => void): void {
		pLocalFileSystem.get(fnCallback);
	}

	export class LocalFile implements IFile {
		private _pUri: IURI;
		private _iMode:  number ;

//File
		private _pFile: File;
//file reader
		private _pFileReader: FileReader;
//pointer to file entry in filsystem
		private _pFileEntry: FileEntry;

		private _nCursorPosition:  number  = 0;

		/**@inline*/  get path(): string {
			logger.setSourceLocation( "LocalFile.ts" , 126 ); logger.assert(isDefAndNotNull(this._pFile), "There is no file handle open."); ;
        	return this._pUri.toString();
		}

		/**@inline*/  get name(): string {
			return util.pathinfo(this._pUri.path).basename;
		}

		/**@inline*/  get mode():  number  {
			return this._iMode;
		}

//set mode(sMode: string);
//set mode(iMode: int);
		set mode(sMode: any) {
			this._iMode = isString(sMode)? filemode(sMode): sMode;
		}

		/**@inline*/  set onread(fnCallback: Function) {
			this.read(fnCallback);
		}

		/**@inline*/  set onopen(fnCallback: Function) {
			this.open(fnCallback);
		}

		/**@inline*/  get position():  number  {
			logger.setSourceLocation( "LocalFile.ts" , 153 ); logger.assert(isDefAndNotNull(this._pFile), "There is no file handle open."); ;
        	return this._nCursorPosition;
		}

		set position(iOffset:  number ) {
			logger.setSourceLocation( "LocalFile.ts" , 158 ); logger.assert(isDefAndNotNull(this._pFile), "There is no file handle open."); ;
			this._nCursorPosition = iOffset;
		}

		/**@inline*/  get byteLength():  number  {
       		return this._pFile? this._pFile.size: 0;
		}


		constructor (sFilename?: string, sMode?: string, fnCallback: Function = LocalFile.defaultCallback);
		constructor (sFilename?: string, iMode?:  number , fnCallback: Function = LocalFile.defaultCallback);
		constructor (sFilename?: string, sMode?: any, fnCallback: Function = LocalFile.defaultCallback) {
			if (isDef(sMode)) {
				this._iMode = isString(sMode)? filemode(sMode): sMode;
			}

			this.setAndValidateUri(util.uri(sFilename));

			if (arguments.length > 2) {
				this.open(sFilename, sMode, fnCallback);
			}
		}


		open(sFilename: string, iMode:  number , fnCallback?: Function): void;
//open(sFilename: string, sMode: string, fnCallback?: Function): void;
		open(sFilename: string, fnCallback?: Function): void;
		open(iMode:  number , fnCallback?: Function): void;
		open(fnCallback?: Function): void;
		open(sFilename?: any, iMode?: any, fnCallback?: any): void {
			var pFile: IFile = this;
			var hasMode: bool = !isFunction(iMode);

			 if (arguments.length < 3) {
		        if (isString(arguments[0])) {
		            this.setAndValidateUri(util.uri(sFilename));
		            fnCallback = arguments[1];
		        }
		        else if (isInt(arguments[0])) {
		            this._iMode = arguments[0];
		            fnCallback = arguments[1];
		        }
		        else {
		            fnCallback = arguments[0];
		        }

		        logger.setSourceLocation( "LocalFile.ts" , 204 ); logger.assert(isDefAndNotNull(this._pUri), "No filename provided."); ;


		        this.open(this._pUri.toString(), this._iMode, fnCallback);

		        return;
		    }

		    fnCallback = arguments[hasMode ? 2 : 1];
		    fnCallback = fnCallback || LocalFile.defaultCallback;

		    if (this.isOpened()) {
		        logger.setSourceLocation( "LocalFile.ts" , 216 ); logger.warning("file already opened: " + this.name); ;
		        (<Function>fnCallback)(null, this._pFile);
		    }

		    this.setAndValidateUri(util.uri(arguments[0]));

		    if (hasMode) {
		    	this._iMode = (isString(arguments[1]) ? filemode(<string>arguments[1]) : arguments[1]);
		    }

		    var fnFSInited: Function;

		    var pFile: LocalFile = this;
		    var pFileSystem: FileSystem = null;
		    var fnErrorHandler: Function = function (e) {
		        if (e.code == FileError.NOT_FOUND_ERR &&  ((pFile.mode & (1 << (1)) ) != 0) ) {
					LocalFile.createDir(
						pFileSystem.root,
						util.pathinfo(pFile.path).dirname.split('/'),
		                function (e) {
		                	if (!isNull(e)) {
		                		fnCallback.call(pFile, e);
	                		}
	                		else {
	                			fnFSInited.call(pFile, pFileSystem);
	                		}
		                });
		        }
		        else {
		            fnCallback.call(pFile, e);
		        }
		    };

		    fnFSInited = function (pFs: FileSystem) {
		        logger.setSourceLocation( "LocalFile.ts" , 250 ); logger.assert(isDefAndNotNull(pFs), "local file system not initialized"); ;

		        pFileSystem = pFs;
		        pFs.root.getFile(this.path,
		                         {
		                             create:     ((this._iMode & (1 << (1)) ) != 0) ,
		                             exclusive: false
		                         },
		                         function (fileEntry: Entry) {
		                             (<LocalFile>pFile).setFileEntry(<FileEntry>fileEntry);

		                             (<FileEntry>fileEntry).file(function (file: File) {
		                                 (<LocalFile>pFile).setFile(file);

		                                 if ( ((pFile.mode & (1 << (4)) ) != 0)  && pFile.byteLength) {
		                                     pFile.clear(function (err) {
		                                     	if (err) {
		                                     		fnCallback(err);
		                                     	}
		                                     	else {
		                                        	fnCallback.call(pFile, null, file);
		                                        }
		                                     });
		                                     return;
		                                 }

		                                 if ( ((pFile.mode & (1 << (3)) ) != 0) ) {
		                                     pFile.position = pFile.byteLength;
		                                 }

		                                 fnCallback.call(pFile, null, file);
		                             }, <ErrorCallback>fnErrorHandler);

		                         },
		                         <ErrorCallback>fnErrorHandler);
		    };

		    getFileSystem(function (pFileSystem: FileSystem) {
		        fnFSInited.call(pFile, pFileSystem);
		    });
		}

		close (): void {
		    this._pUri = null;
		    this._iMode = EIO.IN | EIO.OUT;
		    this._nCursorPosition = 0;
		    this._pFile = null;
		};


		clear(fnCallback: Function = LocalFile.defaultCallback): void {
			if (!this.isOpened()) { var _pArgv: IArguments = arguments; this.open(function(err) { if (err) fnCallback(err); this.clear.apply(this, _pArgv); }); return; } ;

			logger.setSourceLocation( "LocalFile.ts" , 303 ); logger.assert(isDefAndNotNull(this._pFile), 'There is no file handle open'); ;

		    var pFile: IFile = this;
		    var pFileEntry: FileEntry = this._pFileEntry;

		    pFileEntry.createWriter(
		    	function (pWriter: FileWriter) {
			        pWriter.seek(0);

			        pWriter.onwriteend = function () {
		                fnCallback.call(pFile, null);
		            }

			        pWriter.truncate(0);

			    },
			    function (e: FileError) {
			        fnCallback.call(pFile, e);
			    });
		}

		read(fnCallback: Function = LocalFile.defaultCallback): void {
			if (!this.isOpened()) { var _pArgv: IArguments = arguments; this.open(function(err) { if (err) fnCallback(err); this.read.apply(this, _pArgv); }); return; } ;

		    var pFile: IFile = this;
		    var eTransferMode: EFileTransferModes = this._iMode;

		    logger.setSourceLocation( "LocalFile.ts" , 330 ); logger.assert( ((this._iMode & (1 << (0)) ) != 0) , "The file is not readable."); ;

			var pReader: FileReader = this._pFileReader;
			var pFileObject: File = this._pFile;

		    pReader.onloadend = function (e) {
		        var pData: any = (<any>(e.target)).result;
		        var nPos:  number  = pFile.position;

		        if (nPos) {
		            if ( ((pFile.mode & (1 << (5)) ) != 0) ) {
		                pData = (new Uint8Array((new Uint8Array(pData)).subarray(nPos))).buffer;
		            }
		            else {
		                pData = pData.substr(nPos);
		            }
		        }

		        pFile.atEnd();

		        fnCallback.call(pFile, null, pData);
		    };

		    if ( ((pFile.mode & (1 << (5)) ) != 0) ) {
		        pReader.readAsArrayBuffer(pFileObject);
		    }
		    else {
		        pReader.readAsText(pFileObject);
		    }
		}

		write(sData: string, fnCallback: Function = LocalFile.defaultCallback, sContentType?: string): void;
		write(pData: ArrayBuffer, fnCallback: Function = LocalFile.defaultCallback, sContentType?: string): void;
		write(pData: any, fnCallback: Function = LocalFile.defaultCallback, sContentType?: string): void {
			if (!this.isOpened()) { var _pArgv: IArguments = arguments; this.open(function(err) { if (err) fnCallback(err); this.write.apply(this, _pArgv); }); return; } ;

		    var pFile: IFile = this;
		    var iMode:  number  = this._iMode;

		    logger.setSourceLocation( "LocalFile.ts" , 369 ); logger.assert( ((iMode & (1 << (1)) ) != 0) , "The file is not writable."); ;

		    sContentType = sContentType || ( ((iMode & (1 << (5)) ) != 0)  ? "application/octet-stream" : "text/plain");

		    var pFile: IFile = this;
		    var pFileEntry: FileEntry = this._pFileEntry;

		    pFileEntry.createWriter(function (pWriter: FileWriter) {
		        pWriter.seek(pFile.position);

		        pWriter.onerror = function (e: FileError) {
		            fnCallback.call(pFileEntry, e);
		        }


	            pWriter.onwriteend = function () {
	                if ( ((iMode & (1 << (5)) ) != 0) ) {
	                    pFile.seek(pData.byteLength);
	                }
	                else {
	                    pFile.seek(pData.length);
	                }

	                fnCallback.call(pFile, null);
	            };

		        pWriter.write(<Blob>(new (<any>Blob)(pData, {type: sContentType})));

		    },
		    function (e: FileError) {
		        fnCallback.call(pFile, e);
		    });
		}


		move(sFilename: string, fnCallback: Function = LocalFile.defaultCallback): void {
			var pFile: IFile = this;

			this.copy(sFilename, function(err) {
				if (err) {
					fnCallback(err);
					return;
				}

				pFile.remove(fnCallback);
			});
		}

		copy(sFilename: string, fnCallback: Function = LocalFile.defaultCallback): void {
			var iMode:  number  = EIO.IN | EIO.OUT | EIO.TRUNC;
		    var pFile: IFile = this;
		    var pFileCopy: IFile;

		    if ( ((this._iMode & (1 << (5)) ) != 0) ) {
		        iMode |= EIO.BIN;
		    }

		    pFileCopy = new LocalFile(sFilename, iMode,
		                                     function (err) {
		                                     	if (err) {
		                                     		fnCallback(err);
		                                     	}

		                                        pFile.read(function (pData: ArrayBuffer) {
		                                            pFile.write(pData, fnCallback);
		                                        });
		                                     });
		}

		rename(sFilename: string, fnCallback: Function = LocalFile.defaultCallback): void {
			var pName: IPathinfo = util.pathinfo(sFilename);

		    logger.setSourceLocation( "LocalFile.ts" , 441 ); logger.assert(!pName.dirname, 'only filename can be specified.'); ;

		    this.move(util.pathinfo(this._pUri.path).dirname + "/" + pName.basename, fnCallback);
		}

		remove(fnCallback: Function = LocalFile.defaultCallback): void {
			if (!this.isOpened()) { var _pArgv: IArguments = arguments; this.open(function(err) { if (err) fnCallback(err); this.remove.apply(this, _pArgv); }); return; } ;

		    var pFile: IFile = this;
		    this._pFileEntry.remove(
		    <VoidCallback>function () {
		        pFile.close();
		        fnCallback.call(pFile, null);
		    }, <ErrorCallback>fnCallback);
		}

//return current position
		atEnd():  number  {
			this.position = this.byteLength;
			return this._nCursorPosition;
		}
//return current position;
		seek(iOffset:  number ):  number  {
			logger.setSourceLocation( "LocalFile.ts" , 464 ); logger.assert(isDefAndNotNull(this._pFile), "There is no file handle open."); ;

		    var nSeek:  number  = this._nCursorPosition + iOffset;
		    if (nSeek < 0) {
		        nSeek = this.byteLength - (math.abs(nSeek) % this.byteLength);
		    }

		    logger.setSourceLocation( "LocalFile.ts" , 471 ); logger.assert(nSeek >= 0 && nSeek <= this.byteLength, "Invalid offset parameter"); ;

		    this._nCursorPosition = nSeek;

		    return this._nCursorPosition;
		}

		isOpened(): bool {
			return this._pFile !== null;
		}

		isExists(fnCallback: Function): void {
			this.open(function(e: FileError) {
				fnCallback(isNull(e)? true: false);
			});
		}

		isLocal(): bool {
			return true;
		}

		getMetaData(fnCallback: Function): void {
			logger.setSourceLocation( "LocalFile.ts" , 493 ); logger.assert(isDefAndNotNull(this._pFile), 'There is no file handle open.'); ;
		    fnCallback(null, {
		                  lastModifiedDate: this._pFile.lastModifiedDate
		              });
		}

		setFileEntry(pFileEntry: FileEntry): bool {
			if (!isNull(this._pFileEntry)) {
				return false;
			}

			this._pFileEntry = pFileEntry;
			return true;
		}

		setFile(pFile: File): bool {
			if (!isNull(this._pFile)) {
				return false;
			}

			this._pFile = pFile;

			return true;
		}

		private setAndValidateUri(sFilename: IURI);
		private setAndValidateUri(sFilename: string);
		private setAndValidateUri(sFilename: any) {
			var pUri: IURI = util.uri(sFilename);
			var pUriLocal: IURI;

			if (pUri.protocol === "filesystem") {
		        pUriLocal = util.uri(pUri.path);

		        logger.setSourceLocation( "LocalFile.ts" , 528 ); logger.assert(!(pUriLocal.protocol && pUriLocal.host != info.uri.host), "Поддерживаются только локальные файлы в пределах текущего домена.");
                                                                                                                                              ;

		        var pFolders: string[] = pUriLocal.path.split('/');

		        if (pFolders[0] == "" || pFolders[0] == ".") {
		            pFolders = pFolders.slice(1);
		        }

		        logger.setSourceLocation( "LocalFile.ts" , 537 ); logger.assert(pUri.host === "temporary", "Поддерживаются только файловые системы типа \"temporary\".");
                                                                                                                     ;

		        this._pUri = util.uri(pFolders.join("/"));
		    }
		    else {
		    	logger.setSourceLocation( "LocalFile.ts" , 542 ); logger.error("used non local uri"); ;
			}
		}

		static errorHandler (e: FileError): void {
			var sMesg: string = "";

	        switch (e.code) {
	            case FileError.QUOTA_EXCEEDED_ERR:
	                sMesg += 'QUOTA_EXCEEDED_ERR';
	                break;
	            case FileError.NOT_FOUND_ERR:
	                sMesg += 'NOT_FOUND_ERR';
	                break;
	            case FileError.SECURITY_ERR:
	                sMesg += 'SECURITY_ERR';
	                break;
	            case FileError.INVALID_MODIFICATION_ERR:
	                sMesg += 'INVALID_MODIFICATION_ERR';
	                break;
	            case FileError.INVALID_STATE_ERR:
	                sMesg += 'INVALID_STATE_ERR';
	                break;
	            default:
	                sMesg += 'Unknown Error';
	                break;
	        }

	        logger.setSourceLocation( "LocalFile.ts" , 570 ); logger.error(sMesg); ;
		}

		static createDir(pRootDirEntry: DirectoryEntry, pFolders: string[], fnCallback) {
		    if (pFolders[0] == "." || pFolders[0] == "") {
		        pFolders = pFolders.slice(1);
		    }

		    pRootDirEntry.getDirectory(
		    	pFolders[0],
			    { create: true },
			    function (dirEntry: Entry) {
			        if (pFolders.length) {
			            LocalFile.createDir(<DirectoryEntry>dirEntry, pFolders.slice(1), fnCallback);
			        }
			        else {
			            fnCallback(null);
			        }
			    }, fnCallback);
		};

		static defaultCallback: Function = function (err) {
			if (err) {
				LocalFile.errorHandler(err);
			}
		}

	}
}


/*local file via local files system(async)*/

/**
 * FIle implementation via <Local Storage>.
 * ONLY FOR LOCAL FILES!!
 */















module akra.io {
	export class StorageFile extends TFile implements IFile {

		constructor (sFilename?: string, sMode?: string, fnCallback: Function = TFile.defaultCallback);
		constructor (sFilename?: string, iMode?:  number , fnCallback: Function = TFile.defaultCallback);
		constructor (sFilename?: string, sMode?: any, fnCallback: Function = TFile.defaultCallback) {
			super(sFilename, sMode, fnCallback);
		}

		clear(fnCallback: Function = TFile.defaultCallback): void {
			if (!this.isOpened()) { var _pArgv: IArguments = arguments; this.open(function(err) { if (err) fnCallback(err); this.clear.apply(this, _pArgv); }); return; } ;

			localStorage.setItem(this.path, "");
			this._pFileMeta.size = 0;

			fnCallback(null, this);
		}

		read(fnCallback: Function = TFile.defaultCallback): void {
			if (!this.isOpened()) { var _pArgv: IArguments = arguments; this.open(function(err) { if (err) fnCallback(err); this.read.apply(this, _pArgv); }); return; } ;

			logger.setSourceLocation( "StorageFile.ts" , 36 ); logger.assert( ((this._iMode & (1 << (1)) ) != 0) , "The file is not readable."); ;

		    var pData: any = this.readData();
		    var nPos:  number  = this._nCursorPosition;

		    if (nPos) {
		        if ( ((this._iMode & (1 << (5)) ) != 0) ) {
		            pData = (new Uint8Array((new Uint8Array(pData)).subarray(nPos))).buffer;
		        }
		        else {
		            pData = pData.substr(nPos);
		        }
		    }

		    this.atEnd();

		    if (fnCallback) {
		        fnCallback.call(this, null, pData);
		    }
		}

		write(sData: string, fnCallback: Function = TFile.defaultCallback, sContentType?: string): void;
		write(pData: ArrayBuffer, fnCallback: Function = TFile.defaultCallback, sContentType?: string): void;
		write(pData: any, fnCallback: Function = TFile.defaultCallback, sContentType?: string): void {
			if (!this.isOpened()) { var _pArgv: IArguments = arguments; this.open(function(err) { if (err) fnCallback(err); this.write.apply(this, _pArgv); }); return; } ;

			var iMode:  number  = this._iMode;
			var nSeek:  number ;
			var pCurrentData: any;

		    logger.setSourceLocation( "StorageFile.ts" , 66 ); logger.assert( ((iMode & (1 << (1)) ) != 0) , "The file is not writable."); ;

		    sContentType = sContentType || ( ((iMode & (1 << (5)) ) != 0)  ? "application/octet-stream" : "text/plain");

		    pCurrentData = this.readData();

		    if (!isString(pCurrentData)) {
		        pCurrentData = util.abtos(pCurrentData);
		    }

		    nSeek = (isString(pData) ? pData.length : pData.byteLength);

		    if (!isString(pData)) {
		        pData = util.abtos(pData);
		    }

		    pData = (<string>pCurrentData).substr(0, this._nCursorPosition) + (<string>pData) +
		    	(<string>pCurrentData).substr(this._nCursorPosition + (<string>pData).length);

		    try {
		        localStorage.setItem(this.path, pData);
		    }
		    catch (e) {
		       fnCallback(e);
		    }

		    this._pFileMeta.size = pData.length;
		    this._nCursorPosition += nSeek;

		    fnCallback(null);
		}

		isExists(fnCallback: Function = TFile.defaultCallback): void {
			fnCallback.call(this, null, localStorage.getItem(this.path) == null);
		}

		remove(fnCallback: Function = TFile.defaultCallback): void {
			localStorage.removeItem(this.path);
    		fnCallback.call(this, null);
		}

		private readData(): any {
			var pFileMeta: IFileMeta = this._pFileMeta;
		    var pData: string = localStorage.getItem(this.path);
		    var pDataBin: ArrayBuffer;

		    if (pData == null) {
		        pData = "";
		        if ( ((this._iMode & (1 << (1)) ) != 0) ) {
		            localStorage.setItem(this.path, pData);
		        }
		    }


		    if ( ((this._iMode & (1 << (5)) ) != 0) ) {
		        pDataBin = util.stoab(pData);
		        pFileMeta.size = pDataBin.byteLength;
		        return pDataBin;
		    }
		    else {
		        pFileMeta.size = pData.length;
		        return pData;
		    }

		    return null;
		}

		private update(fnCallback: Function): void {
			this._pFileMeta = null;
		    this.readData();
		    fnCallback.call(this, null);
		}
	}
}




module akra.io {

	export enum EIO {
		IN = 0x01,
		OUT = 0x02,
		ATE = 0x04,
		APP = 0x08,
		TRUNC = 0x10,
		BINARY = 0x20,
		BIN = 0x20,
		TEXT = 0x40
	};

	export function filemode(sMode: string):  number  {
		switch (sMode.toLowerCase()) {
	        case "a+t":
	            return EIO.IN | EIO.OUT | EIO.APP | EIO.TEXT;
	        case "w+t":
	            return EIO.IN | EIO.OUT | EIO.TRUNC | EIO.TEXT;
	        case "r+t":
	            return EIO.IN | EIO.OUT | EIO.TEXT;

	        case "at":
	            return EIO.APP | EIO.TEXT;
	        case "wt":
	            return EIO.OUT | EIO.TEXT;
	        case "rt":
	            return EIO.IN | EIO.TEXT;

	        case "a+b":
	            return EIO.IN | EIO.OUT | EIO.APP | EIO.BIN;
	        case "w+b":
	            return EIO.IN | EIO.OUT | EIO.TRUNC | EIO.BIN;
	        case "r+b":
	            return EIO.IN | EIO.OUT | EIO.BIN;

	        case "ab":
	            return EIO.APP | EIO.BIN;
	        case "wb":
	            return EIO.OUT | EIO.BIN;
	        case "rb":
	            return EIO.IN | EIO.BIN;

	        case "a+":
	            return EIO.IN | EIO.OUT | EIO.APP;
	        case "w+":
	            return EIO.IN | EIO.OUT | EIO.TRUNC;
	        case "r+":
	            return EIO.IN | EIO.OUT;

	        case "a":
	            return EIO.APP | EIO.OUT;
	        case "w":
	            return <number>EIO.OUT;
	        case "r":
	        default:
	            return <number>EIO.IN;
	    }
	}

// function _fopen (sUri: string, iMode?: int): IFile;
// function _fopen (sUri: string, sMode?: int): IFile;
// function _fopen (pUri: IURI, iMode: int): IFile;
// function _fopen (pUri: IURI, sMode: string): IFile;

	function _fopen(sUri: any, pMode: any = EIO.IN): IFile {
		if (info.api.webWorker) {
			return new TFile(<string>sUri, pMode);
		}
		else if (info.api.fileSystem) {
			return new LocalFile(<string>sUri, pMode);
		}
		else {
			return new StorageFile(<string>sUri, pMode);
		}
	}

	export var fopen = _fopen;
}



module akra.utils.test {

	var test_1 = () => {
		shouldBeTrue("Threads support");
		shouldBeTrue("File creation");
		shouldBeTrue("File openning");
		shouldBeTrue("File writing(string)");
		shouldBeTrue("File reading(should be \"test_data\")");

		check(info.api.webWorker);

		var pFile: IFile = io.fopen("filesystem://temporary/data/data.txt", "r+");

		check(pFile != null);

		pFile.open(function(err, pMeta) {
			if (err) {
				failed();
				return;
			}
			check(pMeta != null);
			pFile.write("test_data", function(err, pMeta) {
				if (err) check(null);
				else {
					check(pMeta != null);
					pFile.position = 0;
					pFile.read(function(err, sData: string) {
						check(!err && sData === "test_data");
						console.log(arguments);
					});
				}
			});
		});

	}

	new Test({
		name: "Local file API Test",
		main: test_1,
		description: "Test all file apis"
		});
}
