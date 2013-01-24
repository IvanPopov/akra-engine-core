















//#define readonly  
//#define protected
//#define struct class
//#define const var










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

function crc32 (str: string): string {
// http://kevin.vanzonneveld.net
// +   original by: Webtoolkit.info (http://www.webtoolkit.info/)
// +   improved by: T0bsn
// -    depends on: utf8_encode
// *     example 1: crc32('Kevin van Zonneveld');
// *     returns 1: 1249991249
    str = utf8_encode(str);
    var table = "00000000 77073096 EE0E612C 990951BA 076DC419 706AF48F E963A535 9E6495A3 0EDB8832 79DCB8A4 E0D5E91E 97D2D988 09B64C2B 7EB17CBD E7B82D07 90BF1D91 1DB71064 6AB020F2 F3B97148 84BE41DE 1ADAD47D 6DDDE4EB F4D4B551 83D385C7 136C9856 646BA8C0 FD62F97A 8A65C9EC 14015C4F 63066CD9 FA0F3D63 8D080DF5 3B6E20C8 4C69105E D56041E4 A2677172 3C03E4D1 4B04D447 D20D85FD A50AB56B 35B5A8FA 42B2986C DBBBC9D6 ACBCF940 32D86CE3 45DF5C75 DCD60DCF ABD13D59 26D930AC 51DE003A C8D75180 BFD06116 21B4F4B5 56B3C423 CFBA9599 B8BDA50F 2802B89E 5F058808 C60CD9B2 B10BE924 2F6F7C87 58684C11 C1611DAB B6662D3D 76DC4190 01DB7106 98D220BC EFD5102A 71B18589 06B6B51F 9FBFE4A5 E8B8D433 7807C9A2 0F00F934 9609A88E E10E9818 7F6A0DBB 086D3D2D 91646C97 E6635C01 6B6B51F4 1C6C6162 856530D8 F262004E 6C0695ED 1B01A57B 8208F4C1 F50FC457 65B0D9C6 12B7E950 8BBEB8EA FCB9887C 62DD1DDF 15DA2D49 8CD37CF3 FBD44C65 4DB26158 3AB551CE A3BC0074 D4BB30E2 4ADFA541 3DD895D7 A4D1C46D D3D6F4FB 4369E96A 346ED9FC AD678846 DA60B8D0 44042D73 33031DE5 AA0A4C5F DD0D7CC9 5005713C 270241AA BE0B1010 C90C2086 5768B525 206F85B3 B966D409 CE61E49F 5EDEF90E 29D9C998 B0D09822 C7D7A8B4 59B33D17 2EB40D81 B7BD5C3B C0BA6CAD EDB88320 9ABFB3B6 03B6E20C 74B1D29A EAD54739 9DD277AF 04DB2615 73DC1683 E3630B12 94643B84 0D6D6A3E 7A6A5AA8 E40ECF0B 9309FF9D 0A00AE27 7D079EB1 F00F9344 8708A3D2 1E01F268 6906C2FE F762575D 806567CB 196C3671 6E6B06E7 FED41B76 89D32BE0 10DA7A5A 67DD4ACC F9B9DF6F 8EBEEFF9 17B7BE43 60B08ED5 D6D6A3E8 A1D1937E 38D8C2C4 4FDFF252 D1BB67F1 A6BC5767 3FB506DD 48B2364B D80D2BDA AF0A1B4C 36034AF6 41047A60 DF60EFC3 A867DF55 316E8EEF 4669BE79 CB61B38C BC66831A 256FD2A0 5268E236 CC0C7795 BB0B4703 220216B9 5505262F C5BA3BBE B2BD0B28 2BB45A92 5CB36A04 C2D7FFA7 B5D0CF31 2CD99E8B 5BDEAE1D 9B64C2B0 EC63F226 756AA39C 026D930A 9C0906A9 EB0E363F 72076785 05005713 95BF4A82 E2B87A14 7BB12BAE 0CB61B38 92D28E9B E5D5BE0D 7CDCEFB7 0BDBDF21 86D3D2D4 F1D4E242 68DDB3F8 1FDA836E 81BE16CD F6B9265B 6FB077E1 18B74777 88085AE6 FF0F6A70 66063BCA 11010B5C 8F659EFF F862AE69 616BFFD3 166CCF45 A00AE278 D70DD2EE 4E048354 3903B3C2 A7672661 D06016F7 4969474D 3E6E77DB AED16A4A D9D65ADC 40DF0B66 37D83BF0 A9BCAE53 DEBB9EC5 47B2CF7F 30B5FFE9 BDBDF21C CABAC28A 53B39330 24B4A3A6 BAD03605 CDD70693 54DE5729 23D967BF B3667A2E C4614AB8 5D681B02 2A6F2B94 B40BBE37 C30C8EA1 5A05DF1B 2D02EF8D";

    var crc = 0;
    var x = 0;
    var y = 0;

    crc = crc ^ (-1);
    for (var i = 0, iTop = str.length; i < iTop; i++) {
        y = (crc ^ str.charCodeAt(i)) & 0xFF;
        x = parseInt("0x" + table.substr(y * 9, 8));
        crc = (crc >>> 8) ^ x;
    }

    return String(crc ^ (-1));
}

function md5 (str) {
// http://kevin.vanzonneveld.net
// +   original by: Webtoolkit.info (http://www.webtoolkit.info/)
// + namespaced by: Michael White (http://getsprink.com)
// +    tweaked by: Jack
// +   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
// +      input by: Brett Zamir (http://brett-zamir.me)
// +   bugfixed by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
// -    depends on: utf8_encode
// *     example 1: md5('Kevin van Zonneveld');
// *     returns 1: '6e658d4bfcb59cc13f96c14450ac40b9'


    var xl, a, b, c ,d ,e;

    var rotateLeft = function (lValue, iShiftBits) {
        return (lValue << iShiftBits) | (lValue >>> (32 - iShiftBits));
    };

    var addUnsigned = function (lX, lY) {
        var lX4, lY4, lX8, lY8, lResult;
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
            }
            else {
                return (lResult ^ 0x40000000 ^ lX8 ^ lY8);
            }
        }
        else {
            return (lResult ^ lX8 ^ lY8);
        }
    };

    var _F = function (x, y, z) {
        return (x & y) | ((~x) & z);
    };
    var _G = function (x, y, z) {
        return (x & z) | (y & (~z));
    };
    var _H = function (x, y, z) {
        return (x ^ y ^ z);
    };
    var _I = function (x, y, z) {
        return (y ^ (x | (~z)));
    };

    var _FF = function (a, b, c, d, x, s, ac) {
        a = addUnsigned(a, addUnsigned(addUnsigned(_F(b, c, d), x), ac));
        return addUnsigned(rotateLeft(a, s), b);
    };

    var _GG = function (a, b, c, d, x, s, ac) {
        a = addUnsigned(a, addUnsigned(addUnsigned(_G(b, c, d), x), ac));
        return addUnsigned(rotateLeft(a, s), b);
    };

    var _HH = function (a, b, c, d, x, s, ac) {
        a = addUnsigned(a, addUnsigned(addUnsigned(_H(b, c, d), x), ac));
        return addUnsigned(rotateLeft(a, s), b);
    };

    var _II = function (a, b, c, d, x, s, ac) {
        a = addUnsigned(a, addUnsigned(addUnsigned(_I(b, c, d), x), ac));
        return addUnsigned(rotateLeft(a, s), b);
    };

    var convertToWordArray = function (str) {
        var lWordCount;
        var lMessageLength = str.length;
        var lNumberOfWords_temp1 = lMessageLength + 8;
        var lNumberOfWords_temp2 = (lNumberOfWords_temp1 - (lNumberOfWords_temp1 % 64)) / 64;
        var lNumberOfWords = (lNumberOfWords_temp2 + 1) * 16;
        var lWordArray = new Array(lNumberOfWords - 1);
        var lBytePosition = 0;
        var lByteCount = 0;
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

    var wordToHex = function (lValue) {
        var wordToHexValue = "",
            wordToHexValue_temp = "",
            lByte, lCount;
        for (lCount = 0; lCount <= 3; lCount++) {
            lByte = (lValue >>> (lCount * 8)) & 255;
            wordToHexValue_temp = "0" + lByte.toString(16);
            wordToHexValue = wordToHexValue + wordToHexValue_temp.substr(wordToHexValue_temp.length - 2, 2);
        }
        return wordToHexValue;
    };

    var x = [],
        k, AA, BB, CC, DD, a, b, c, d, S11 = 7,
        S12 = 12,
        S13 = 17,
        S14 = 22,
        S21 = 5,
        S22 = 9,
        S23 = 14,
        S24 = 20,
        S31 = 4,
        S32 = 11,
        S33 = 16,
        S34 = 23,
        S41 = 6,
        S42 = 10,
        S43 = 15,
        S44 = 21;

    str = utf8_encode(str);
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

    var temp = wordToHex(a) + wordToHex(b) + wordToHex(c) + wordToHex(d);

    return temp.toLowerCase();
}

function sha1 (str: string): string {
// http://kevin.vanzonneveld.net
// +   original by: Webtoolkit.info (http://www.webtoolkit.info/)
// + namespaced by: Michael White (http://getsprink.com)
// +      input by: Brett Zamir (http://brett-zamir.me)
// +   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
// -    depends on: utf8_encode
// *     example 1: sha1('Kevin van Zonneveld');
// *     returns 1: '54916d2e62f65b3afa6e192e6a601cdbe5cb5897'
    var rotate_left = function (n, s) {
        var t4 = (n << s) | (n >>> (32 - s));
        return t4;
    };

/*var lsb_hex = function (val) { // Not in use; needed?
     var str="";
     var i;
     var vh;
     var vl;

     for ( i=0; i<=6; i+=2 ) {
     vh = (val>>>(i*4+4))&0x0f;
     vl = (val>>>(i*4))&0x0f;
     str += vh.toString(16) + vl.toString(16);
     }
     return str;
     };*/


    var cvt_hex = function (val) {
        var str = "";
        var i;
        var v;

        for (i = 7; i >= 0; i--) {
            v = (val >>> (i * 4)) & 0x0f;
            str += v.toString(16);
        }
        return str;
    };

    var blockstart;
    var i, j;
    var W = new Array(80);
    var H0 = 0x67452301;
    var H1 = 0xEFCDAB89;
    var H2 = 0x98BADCFE;
    var H3 = 0x10325476;
    var H4 = 0xC3D2E1F0;
    var A, B, C, D, E;
    var temp;

    str = utf8_encode(str);
    var str_len = str.length;

    var word_array = [];
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
            i = str.charCodeAt(str_len - 3) << 24 | str.charCodeAt(str_len - 2) << 16 | str.charCodeAt(str_len - 1) << 8
                | 0x80;
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
}

interface String {
    toUTF8(): string;
    fromUTF8(): string;

    md5(): string;
    sha1(): string;
    crc32(): string;
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

    String.prototype.md5 = function () {
        return md5(this);
    };

    String.prototype.sha1 = function () {
        return sha1(this);
    };

    String.prototype.crc32 = function () {
        return crc32(this);
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
	 * Выставляет бит под номе��ом @a bit у числа @a value равным единице
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
// super();

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

module akra {
    logger = util.logger;
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
	export interface IListExplorerFunc {
		(data: any): bool;
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

		mid(pos:  number , size:  number ): IObjectList;
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
				for (var i:  number  = this._pData.length; i < n; ++ i) {
					this._pData[i] = null;
				}
			}
		}

		set(n:  number , pData: any): IObjectArray {
			logger.setSourceLocation( "ObjectArray.ts" , 79 ); logger.assert(!this._bLock, "cannot clear. array is locked."); ;

			var N:  number  = n + 1;

			this.extend(N);

			if (this._iLength < N) {
				this._iLength = N;
			}

			this._pData[n] = pData;

			return this;
		}

		fromArray(pElements: any[], iOffset:  number  = 0, iSize:  number  = 0): IObjectArray {
			logger.setSourceLocation( "ObjectArray.ts" , 95 ); logger.assert(!this._bLock, "cannot clear. array is locked."); ;

			iSize = iSize > 0? iSize < pElements.length? iSize: pElements.length: pElements.length;

			this.extend(iSize);

			for (var i:  number  = iOffset, j:  number  = 0; i < iSize; ++ i, ++ j) {
				this._pData[i] = pElements[j];
			}

			this._iLength = i;

			return this;
		}

		/**@inline*/  push(pElement: any): IObjectArray {

			logger.setSourceLocation( "ObjectArray.ts" , 112 ); logger.assert(!this._bLock, "cannot clear. array is locked."); ;

			return this.set(this._iLength, pElement);
		}

		/**@inline*/  pop(): any {
			logger.setSourceLocation( "ObjectArray.ts" , 118 ); logger.assert(!this._bLock, "cannot clear. array is locked."); ;
			return this._iLength > 0? this._pData[-- this._iLength]: null;
		}

		/**@inline*/  swap(i:  number , j:  number ): IObjectArray {
			logger.setSourceLocation( "ObjectArray.ts" , 123 ); logger.assert(!this._bLock, "cannot clear. array is locked."); ;
			logger.setSourceLocation( "ObjectArray.ts" , 124 ); logger.assert(i < this._iLength && j < this._iLength, "invalid swap index."); ;

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
			return (this._pCurrent = this._pHead);
		};

		/**@inline*/  get last(): any {
			return (this._pCurrent = this._pTail);
		}

		/**@inline*/  get current(): any {
			return (this._pCurrent);
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

			if(iPos > this._iLength-1){
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

		/**@inline*/  move(iFrom:  number , iTo:  number ): IObjectList{
			return this.insert(iTo - 1, this.takeAt(iFrom));
		};

		/**@inline*/  replace(iPos:  number , pData: any): IObjectList{
			logger.setSourceLocation( "util/ObjectList.ts" , 97 ); logger.assert(!this.isLocked(), "list locked."); ;
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
			logger.setSourceLocation( "util/ObjectList.ts" , 142 ); logger.assert(!this.isLocked(), "list locked."); ;

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

			n = Math.min(n, this._iLength);

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
			return this.insert(this._iLength - 1, pElement)
		};

		/**@inline*/  takeAt(n:  number ): any{
			logger.setSourceLocation( "util/ObjectList.ts" , 212 ); logger.assert(!this.isLocked(), "list locked."); ;

			if(n<0){
				return null;
			}

			var pItem: IObjectListItem = this.find(n);

			if(isNull(pItem.prev)){
				this._pHead = pItem.next;
			}
			else{
				pItem.prev.next = pItem.next;
			}

			if(isNull(pItem.next)){
				this._pTail = pItem.prev;
			}
			else{
				pItem.next.prev = pItem.prev;
			}

			this.releaseItem(pItem);

			this._iLength--;

			return pItem.data;
		};


		/**@inline*/  takeFirst(): any{
			return this.takeAt(0);
		};

		/**@inline*/  takeLast(): any{
			return this.takeAt(this._iLength - 1);
		};

		/**@inline*/  pop(): any{
			return this.takeAt(this._iLength - 1);
		};

		/**@inline*/  prepend(pElement: any): IObjectList{
			return this.insert(0,pElement)
		};

		/**@inline*/  private find(n:  number ): IObjectListItem{
			this.seek(n);
			return this._pCurrent;
		};

		/**@inline*/  private releaseItem(pItem: IObjectListItem): void{
			pItem.next = pItem.prev = pItem.data = null;
			ObjectList.listItemPool.push(pItem);
		};

		/**@inline*/  private createItem(): IObjectListItem {
			if (ObjectList.listItemPool.length == 0) {
				return {next: null, prev: null, data: null};
			}

			return <IObjectListItem>ObjectList.listItemPool.pop();
		}

		fromArray(elements: any[], iOffset:  number  = 0, iSize:  number  = this._iLength): IObjectList{
			iOffset = Math.min(iOffset, this._iLength);

			for(var i:  number =0; i<iSize; i++){
				this.insert(iOffset+i, elements[i]);
			}

			return this;
		}

		insert(n: number  ,pData: any): IObjectList{
			logger.setSourceLocation( "util/ObjectList.ts" , 287 ); logger.assert(!this.isLocked(), "list locked."); ;

			n = Math.min(n, this._iLength);

			var pNew: IObjectListItem = this.createItem();
			pNew.data = pData;

			var pItem: IObjectListItem = this.find(n-1);

			if(isNull(pItem.next)){
				this._pTail = pNew;
			}
			else{
				pNew.next = pItem.next;
			}

			if(isNull(pItem)){
				this._pHead = pNew;
			}
			else{
				pItem.next.prev = pNew;
				pItem.next = pNew;
				pNew.prev = pItem;
			}

			this._iLength++;

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
			logger.setSourceLocation( "util/ObjectList.ts" , 342 ); logger.assert(!this.isLocked(), "list locked."); ;

			var pPrev: IObjectListItem;
			var pNext: IObjectListItem = this.first;

			for (var i:  number  = 0; i < this._iLength; ++ i) {
				pPrev = pNext;
				pNext = this.next();

				this.releaseItem(pPrev);
			}

			return this;
		}

		forEach(fn: IListExplorerFunc): void {
			var pItem: IObjectListItem = this.first;

			for (var i:  number  = 0; i < this._iLength; ++ i) {
				if (!fn(pItem)) {
					return;
				}

				pItem = this.next();
			}
		}

		static private listItemPool: IObjectArray = new ObjectArray;

	}
}




module akra.utils.test {

	var test_1 = () => {
		shouldBeTrue("ObjectArray creation");
		shouldBeTrue("ObjectArray length correct");

		var pTpl:  number [] = [1, 2, 3, 4, 5];
		var pList: IObjectList = new ObjectList(pTpl);

		check(isDefAndNotNull(pList));
		check(pList.length === pTpl.length);

		for (var i = 0, n = pTpl.length; i < n; ++ i) {
			var t:  number  = pTpl.pop();
			shouldBeTrue("poped element is: " + t);
			check(pList.pop() == t);
		}

		shouldBeTrue("length is 0");
		check(pList.length === pTpl.length);

		for (var i:  number  = 0; i < 5; ++ i) {
			pList.push(i);
			pTpl.push(i);
			shouldBeTrue("pushed element is: " + i);
			check(pList.value(i) === pTpl[i] && pTpl.length == pList.length);
		}

		shouldBeTrue("length is 0 after cleaning");
		check(0 == pList.clear().length);
	}

	new Test({
		name: "ObjectList Tests",
		main: test_1,
		description: "Test all ObjectList apis"
		});
}
