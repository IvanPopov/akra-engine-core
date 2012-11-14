











interface String {
	toUTF8(): string;
	fromUTF8(): string;

	md5(): string;
	sha1(): string;
	crc32(): string;
	replaceAt(n: int, s: string);
}

interface Array {
    last: any;
    first: any;
    el(i :int): any;
    clear(): any[];
    swap(i: int, j: int): any[];
    insert(elements: any[]): any[];
}

interface Number {
	toHex(length: int): string;
	printBinary(isPretty?: bool);
}












module akra {


    export var  DEBUG : bool = true;


    export function typeOf(x: any): string {
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
        return type == 'object' || type == 'array' || type == 'function';
    };

/** @inline */

    export var isArray = (x: any): bool => {
        return typeOf(x) == 'array';
    };

    if (!isDef(console.assert)) {
        console.assert = function (isOK?: bool, ...pParams: any[]): void {
            if (!isOK) {
                trace('---------------------------');
                trace.apply(null, pParams);
                throw new Error("[assertion failed]");
            }
        }
    }

    export var trace = console.log.bind(console);
    export var assert = console.assert.bind(console);
    export var warning = console.warn.bind(console);
	export var error = console.error.bind(console);


    export var debug_print = (pArg:any, ...pParams: any[]): void => {
            trace.apply(null, arguments);
    }

    export var debug_assert = (isOK: bool, ...pParams: any[]): void => {
            assert.apply(null, arguments);
    }

    export var debug_warning = (pArg:any, ...pParams: any[]): void => {
            warning.apply(null, arguments);
    }

	export var debug_error = (pArg:any, ...pParams: any[]): void => {
            error.apply(null, arguments);
    }


    export function initDevice(pDevice: WebGLRenderingContext):WebGLRenderingContext {
    	return pDevice;
    }

    export function createDevice(
            pCanvas: HTMLCanvasElement = <HTMLCanvasElement>document.createElement("canvas"),
            pOptions?: { antialias?: bool; }) {

    	var pDevice: WebGLRenderingContext = null;

		try {
			pDevice = pCanvas.getContext("webgl", pOptions) ||
				pCanvas.getContext("experimental-webgl", pOptions);
    	}
		catch (e) {}

		if (!pDevice) {
			debug_warning("cannot get 3d device");
		}

		return initDevice(pDevice);
    }

    export function genArray(pType: any, nSize: uint) {
        var tmp = new Array(nSize);

        for (var i: int = 0; i < nSize; ++i) {
            tmp[i] = (pType? new pType: null);
        }

        return tmp;
    }


    export  var  INVALID_INDEX: int =  0xffff;

// (-2147483646);
    export  var  MIN_INT32: int = 0xffffffff;
// ( 2147483647);
    export  var  MAX_INT32: int = 0x7fffffff;
// (-32768);
    export  var  MIN_INT16: int = 0xffff;
// ( 32767);  
    export  var  MAX_INT16: int = 0x7fff;
// (-128);
    export  var  MIN_INT8: int = 0xff;
// ( 127);        
    export  var  MAX_INT8: int = 0x7f;
    export  var  MIN_UINT32: int = 0;
    export  var  MAX_UINT32: int = 0xffffffff;
    export  var  MIN_UINT16: int = 0;
    export  var  MAX_UINT16: int = 0xffff;
    export  var  MIN_UINT8: int = 0;
    export  var  MAX_UINT8: int = 0xff;


    export  var  SIZE_FLOAT64: int = 8;
    export  var  SIZE_REAL64: int = 8;
    export  var  SIZE_FLOAT32: int = 4;
    export  var  SIZE_REAL32: int = 4;
    export  var  SIZE_INT32: int = 4;
    export  var  SIZE_UINT32: int = 4;
    export  var  SIZE_INT16: int = 2;
    export  var  SIZE_UINT16: int = 2;
    export  var  SIZE_INT8: int = 1;
    export  var  SIZE_UINT8: int = 1;
    export  var  SIZE_BYTE: int = 1;
    export  var  SIZE_UBYTE: int = 1;

//1.7976931348623157e+308
    export  var  MAX_FLOAT64: float = Number.MAX_VALUE;
//-1.7976931348623157e+308
    export  var  MIN_FLOAT64: float = -Number.MAX_VALUE;
//5e-324
    export  var  TINY_FLOAT64: float = Number.MIN_VALUE;

//    export const MAX_REAL64: number = Number.MAX_VALUE;   //1.7976931348623157e+308
//    export const MIN_REAL64: number = -Number.MAX_VALUE;  //-1.7976931348623157e+308
//    export const TINY_REAL64: number = Number.MIN_VALUE;  //5e-324


//3.4e38
    export  var  MAX_FLOAT32: float = 3.4e38;
//-3.4e38
    export  var  MIN_FLOAT32: float = -3.4e38;
//1.5e-45  
    export  var  TINY_FLOAT32: float = 1.5e-45;

//    export const MAX_REAL32: number = 3.4e38;     //3.4e38
//    export const MIN_REAL32: number = -3.4e38;    //-3.4e38
//    export const TINY_REAL32: number = 1.5e-45;   //1.5e-45

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


    export interface StringEnum {
        [index: string]: string;
        [index: string]: int;
    };

    export interface StringMap {
        [index: string]: string;
        [index: number]: string;
    };

    export interface IntMap {
        [index: string]: int;
        [index: number]: int;
    };

    export interface UintMap {
        [index: string]: uint;
        [index: number]: uint;
    };

    export interface FloatMap {
        [index: string]: float;
        [index: number]: float;
    };

/**
     * Возвращет размер типа в байтах
     **/

//export function getTypeSize(eType: EImageTypes): uint;
    export function getTypeSize(eType: EDataTypes): uint;
    export function getTypeSize(eType): uint {
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
                error('unknown data/image type used');
        }

        return 0;
    }

    export function ab2ta(pBuffer: ArrayBuffer, eType: EDataTypes): ArrayBufferView {
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


    export var sid = (): uint => (++ sid._iTotal);
    sid._iTotal = 0;

//export var now = (): uint => ((new Date()).getTime());

//export function 

	(<any>window).URL = (<any>window).URL ? (<any>window).URL : (<any>window).webkitURL ? (<any>window).webkitURL : null;
	(<any>window).BlobBuilder = (<any>window).WebKitBlobBuilder || (<any>window).MozBlobBuilder || (<any>window).BlobBuilder;
	(<any>window).requestFileSystem = (<any>window).requestFileSystem || (<any>window).webkitRequestFileSystem;
	(<any>window).requestAnimationFrame = (<any>window).requestAnimationFrame || (<any>window).webkitRequestAnimationFrame ||
		(<any>window).mozRequestAnimationFrame;
	(<any>window).WebSocket = (<any>window).WebSocket || (<any>window).MozWebSocket;

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

//declare function utf8_encode(src: string): string;
//declare function utf8_decode(src: string): string;

//declare function md5(src: string): string;
//declare function sha1(src: string): string;
//declare function crc32(src: string): string;

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

    Number.prototype.toHex = function (iLength: int): string {
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

	export var flag = (x: int) => (1 << (x));
/**
	 * Проверка того что у @a value бит под номером @a bit равен единице.
	 * @inline
	 */

	export var testBit = (value: int, bit: int) => ((value & flag(bit)) != 0);
/**
	 * Проверка того что у @a value равны единице все биты,
 	 * которые равны единице у @a set.
	 * @inline
	 */

	export var testAll = (value: int, set: int) => (((value) & (set)) == (set));
/**
	 * Проверка того что у @a value равны единице хотя бы какие то из битов,
 	 * которые равны единице у @a set.
	 * @inline
	 */

	export var testAny = (value: int, set: int) => (((value) & (set)) != 0);
/**
	 * Выставляет бит под номером @a bit у числа @a value равным единице
	 * @inline
	 */

	export var setBit = (value: int, bit: int, setting: bool = true) => (setting ? ((value) |= flag((bit))) : clearBit(value, bit));
/**
	 * 
	 * @inline
	 */

	export var clearBit = (value: int, bit: int) => ((value) &= ~flag((bit)));
/**
	 * Выставляет бит под номером @a bit у числа @a value равным нулю
	 * @inline
	 */

	export var setAll = (value: int, set: int, setting: bool = true) => (setting ? setAll(value, set) : clearAll(value, set));
/**
	 * Выставляет все биты у числа @a value равными единице,
 	 * которые равны единице у числа @a set
	 * @inline
	 */

	export var clearAll = (value: int, set: int) => ((value) &= ~(set));
/**
	 * Выставляет все биты у числа @a value равными нулю,
 	 * которые равны единице у числа @a set
	 * @inline
	 */

	export var equal = (value: int, src: int) => { value = src; };
/**
	 * Прирасваивает числу @a value число @a src
	 * @inline
	 */

	export var isEqual = (value: int, src: int) => value == src;
/**
	 * Если число @a value равно числу @a src возвращается true
	 * @inline
	 */

	export var isNotEqaul = (value: int, src: int) => value != src;
/**
	 * Прирасваивает числу @a value число @a src
	 * @inline
	 */

	export var set = (value: int, src: int) => { value = src; };
/**
	 * Обнуляет число @a value
	 * @inline
	 */

	export var clear = (value: int) => { value = 0; };
/**
	 * Выставляет все биты у числа @a value равными единице,
 	 * которые равны единице у числа @a src
	 * @inline
	 */

	export var setFlags = (value: int, src: int) => (value |= src);
/**
	 * Выставляет все биты у числа @a value равными нулю,
 	 * которые равны единице у числа @a src
	 * @inline
	 */

	export var clearFlags = (value: int, src: int) => value &= ~src;
/**
	 * Проверяет равно ли число @a value нулю. Если равно возвращает true.
 	 * Если не равно возвращает false.
	 * @inline
	 */

	export var isEmpty = (value: int) => (value == 0);
/**
	 * Возвращает общее количество бит числа @a value.
 	 * На самом деле возвращает всегда 32.
	 * @inline
	 */

	export var totalBits = (value: int) => 32;
/**
	 * Возвращает общее количество ненулевых бит числа @a value.
	 * @inline
	 */

	export var totalSet = (value: int): int => {
		var count: int = 0;
        var total: int = totalBits(value);

        for (var i: int = total; i; --i) {
            count += (value & 1);
            value >>= 1;
        }

        return(count);
	}
}














module akra {
	export interface IVec2 {
		x: float;
		y: float;

		set(): IVec2;
		set(fValue: float): IVec2;
		set(v2fVec: IVec2): IVec2;
		set(pArray: float[]): IVec2;
		set(fValue1: float, fValue2: float): IVec2;

		clear(): IVec2;

		add(v2fVec: IVec2, v2fDestination?: IVec2): IVec2;
		subtract(v2fVec: IVec2, v2fDestination?: IVec2): IVec2;
		dot(v2fVec: IVec2): float;

		isEqual(v2fVec: IVec2, fEps?: float): bool;
		isClear(fEps?: float): bool;

		negate(v2fDestination?: IVec2): IVec2;
		scale(fScale: float, v2fDestination?: IVec2): IVec2;
		normalize(v2fDestination?: IVec2): IVec2;
		length(): float;
		lengthSquare(): float;


		direction(v2fVec: IVec2, v2fDestination?: IVec2): IVec2;

		mix(v2fVec: IVec2, fA: float, v2fDestination?: IVec2): IVec2;

		toString(): string;
	};
};



module akra.math {
    export class Vec2 implements IVec2{
        x: float = 0.;
        y: float = 0.;

        constructor();
        constructor(fValue: float);
        constructor(v2fVec: IVec2);
        constructor(pArray: float[]);
        constructor(fValue1: float, fValue2: float);
        constructor(fValue1?, fValue2?){
            var nArgumentsLength: uint = arguments.length;

            switch(nArgumentsLength){
                case 1:
                    this.set(arguments[0]);
                    break;
                case 2:
                    this.set(arguments[0], arguments[1]);
                    break;
                default:
                    this.x = this.y = 0.;
                    break;
            };
        };

        set(): IVec2;
        set(fValue: float): IVec2;
        set(v2fVec: IVec2): IVec2;
        set(pArray: float[]): IVec2;
        set(fValue1: float, fValue2: float): IVec2;
        set(fValue1?, fValue2?): IVec2{
            var nArgumentsLength: uint = arguments.length;

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
                        var pArray: float[] = arguments[0];

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

        /**@inline*/  dot(v2fVec: IVec2): float{
            return this.x*v2fVec.x + this.y*v2fVec.y;
        };

        isEqual(v2fVec: IVec2, fEps: float = 0.): bool{
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

        isClear(fEps: float = 0.): bool{
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

        scale(fScale: float, v2fDestination?: IVec2): IVec2{
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

            var x: float = this.x, y: float = this.y;
            var fLength: float = sqrt(x*x + y*y);

            if(fLength !== 0.){
                var fInvLength: float = 1./fLength;

                x *= fInvLength;
                y *= fInvLength;
            }

            v2fDestination.x = x;
            v2fDestination.y = y;

            return v2fDestination;
        };

        /**@inline*/  length(): float{
            var x: float = this.x, y: float = this.y;
            return sqrt(x*x + y*y);
        };

        /**@inline*/  lengthSquare(): float{
            var x: float = this.x, y: float = this.y;
            return x*x + y*y;
        };

        direction(v2fVec: IVec2, v2fDestination?: IVec2): IVec2{
            if(!isDef(v2fDestination)){
                v2fDestination = this;
            }

            var x: float = v2fVec.x - this.x;
            var y: float = v2fVec.y - this.y;

            var fLength: float = sqrt(x*x + y*y);

            if(fLength !== 0.){
                var fInvLength: float = 1./fLength;

                x *= fInvLength;
                y *= fInvLength;
            }

            v2fDestination.x = x;
            v2fDestination.y = y;

            return v2fDestination;
        };

        mix(v2fVec: IVec2, fA: float, v2fDestination?: IVec2): IVec2{
            if(!isDef(v2fDestination)){
                v2fDestination = this;
            }

            fA = clamp(fA,0.,1.);

            var fA1: float = 1. - fA;
            var fA2: float = fA;

            v2fDestination.x = fA1*this.x + fA2*v2fVec.x;
            v2fDestination.y = fA1*this.y + fA2*v2fVec.y;

            return v2fDestination;
        };

        /**@inline*/  toString(): string{
            return "[x: " + this.x + ", y: " + this.y + "]";
        }
   }
}












module akra {

	export interface IVec2 {} ;
	export interface IMat4 {} ;

	export interface IVec3 {
		x: float;
		y: float;
		z: float;

		set(): IVec3;
		set(fValue: float): IVec3;
		set(v3fVec: IVec3): IVec3;
		set(pArray: float[]): IVec3;
		set(fValue: float, v2fVec: IVec2): IVec3;
		set(v2fVec: IVec2, fValue: float): IVec3;
		set(fValue1: float, fValue2: float, fValue3: float): IVec3;

		clear(): IVec3;

		add(v3fVec: IVec3, v3fDestination?: IVec3): IVec3;
		subtract(v3fVec: IVec3, v3fDestination?: IVec3): IVec3;
		dot(v3fVec: IVec3): float;
		cross(v3fVec: IVec3, v3fDestination?: IVec3): IVec3;

		isEqual(v3fVec: IVec3, fEps?: float): bool;
		isClear(fEps?: float): bool;

		negate(v3fDestination?: IVec3): IVec3;
		scale(fScale: float, v3fDestination?: IVec3): IVec3;
		scale(v3fScale: IVec3, v3fDestination?: IVec3): IVec3;
		normalize(v3fDestination?: IVec3): IVec3;
		length(): float;
		lengthSquare(): float;

		direction(v3fVec: IVec3, v3fDestination?: IVec3): IVec3;

		mix(v3fVec: IVec3, fA: float, v3fDestination?: IVec3): IVec3;

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

	export interface IMat4 {
		data: Float32Array;

		set(): IMat4;
		set(fValue: float): IMat4;
		set(v4fVec: IVec4): IMat4;
		set(m3fMat: IMat3, v3fTranslation?: IVec3): IMat4;
		set(m4fMat: IMat4): IMat4;
		set(pArray: float[]): IMat4;
		set(fValue1: float, fValue2: float,
			fValue3: float, fValue4: float): IMat4;
		set(v4fVec1: IVec4, v4fVec2: IVec4,
			v4fVec3: IVec4, v4fVec4: IVec4): IMat4;
		set(pArray1: float[], pArray2: float[],
			pArray3: float[], pArray4: float[]): IMat4;
		set(fValue1: float, fValue2: float, fValue3: float, fValue4: float,
			fValue5: float, fValue6: float, fValue7: float, fValue8: float,
			fValue9: float, fValue10: float, fValue11: float, fValue12: float,
			fValue13: float, fValue14: float, fValue15: float, fValue16: float): IMat4;

		identity(): IMat4;

		add(m4fMat: IMat4, m4fDestination?: IMat4): IMat4;
		subtract(m4fMat: IMat4, m4fDestination?: IMat4): IMat4;
		multiply(m4fMat: IMat4, m4fDestination?: IMat4): IMat4;
		multiplyLeft(m4fMat: IMat4, m4fDestination?: IMat4): IMat4;
		multiplyVec4(v4fVec: IVec4, v4fDestination?: IVec4): IVec4;

		transpose(m4fDestination?: IMat4): IMat4;
		determinant(): float;
		inverse(m4fDestination?: IMat4): IMat4;
		trace(): float;

		isEqual(m4fMat: IMat4, fEps?: float): bool;
		isDiagonal(fEps?: float): bool;

		toMat3(m3fDestination?: IMat3): IMat3;
		toQuat4(q4fDestination?: IQuat4): IQuat4;
		toRotationMatrix(m4fDestination?: IMat4): IMat4;
		toString(): string;

		rotateRight(fAngle: float, v3fAxis: IVec3, m4fDestination?: IMat4): IMat4;
		rotateLeft(fAngle: float, v3fAxis: IVec3, m4fDestination?: IMat4): IMat4;

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

		row(iRow: int, v4fDestination?: IVec4): IVec4;
		column(iColumn: int, v4fDestination?: IVec4): IVec4;

	};
};



module akra.math {
    export class Vec3 {
        x: float;
        y: float;
        z: float;

        constructor();
        constructor(fValue: float);
        constructor(v3fVec: IVec3);
        constructor(pArray: float[]);
        constructor(fValue: float, v2fVec: IVec2);
        constructor(v2fVec: IVec2, fValue: float);
        constructor(fValue1: float, fValue2: float, fValue3: float);
        constructor(fValue1?, fValue2?, fValue3?){
            var nArgumentsLength = arguments.length;

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
        set(fValue: float): IVec3;
        set(v3fVec: IVec3): IVec3;
        set(pArray: float[]): IVec3;
        set(fValue: float, v2fVec: IVec2): IVec3;
        set(v2fVec: IVec2, fValue: float): IVec3;
        set(fValue1: float, fValue2: float, fValue3: float): IVec3;
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
                        var pArray: float[] = arguments[0];

                        this.x = pArray[0];
                        this.y = pArray[1];
                        this.z = pArray[2];
                    }
                    break;
                case 2:
                    if(isFloat(arguments[0])){
                        var fValue: float = arguments[0];
                        var v2fVec: IVec2 = arguments[1];

                        this.x = fValue;
                        this.y = v2fVec.x;
                        this.z = v2fVec.y;
                    }
                    else{
                        var v2fVec: IVec2 = arguments[0];
                        var fValue: float = arguments[1];

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

        /**@inline*/  dot(v3fVec: IVec3): float{
            return this.x*v3fVec.x + this.y*v3fVec.y + this.z*v3fVec.z;
        };

        cross(v3fVec: IVec3, v3fDestination?: IVec3): IVec3{
            if(!isDef(v3fDestination)){
                v3fDestination = this;
            }

            var x1: float = this.x, y1: float = this.y, z1: float = this.z;
            var x2: float = v3fVec.x, y2: float = v3fVec.y, z2: float = v3fVec.z;

            v3fDestination.x = y1*z2 - z1*y2;
            v3fDestination.y = z1*x2 - x1*z2;
            v3fDestination.z = x1*y2 - y1*x2;

            return v3fDestination;
        };

        isEqual(v3fVec: IVec3, fEps: float = 0.): bool{
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

        isClear(fEps: float = 0.): bool{
            if(fEps === 0.){
                if(    this.x != 0.
                    || this.y != 0.
                    || this.z != 0.){

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
        scale(fScale: float, v3fDestination?: IVec3): IVec3;
        scale(fScale?, v3fDestination?): IVec3{
            if(!isDef(v3fDestination)){
                v3fDestination = this;
            }

            if(isNumber(arguments[0])){
                var fScale: float = arguments[0];
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

            var x: float = this.x, y: float = this.y, z: float = this.z;
            var fLength: float = sqrt(x*x + y*y + z*z);

            if(fLength !== 0.){
                var fInvLength: float = 1./fLength;

                x *= fInvLength;
                y *= fInvLength;
                z *= fInvLength;
            }

            v3fDestination.x = x;
            v3fDestination.y = y;
            v3fDestination.z = z;

            return v3fDestination;
        };

        /**@inline*/  length(): float{
            var x: float = this.x, y: float = this.y, z: float = this.z;
            return sqrt(x*x + y*y + z*z);
        };

        /**@inline*/  lengthSquare(): float{
            var x: float = this.x, y: float = this.y, z: float = this.z;
            return x*x + y*y + z*z;
        };

        direction(v3fVec: IVec3, v3fDestination?: IVec3): IVec3{
            if(!isDef(v3fDestination)){
                v3fDestination = this;
            }

            var x: float = v3fVec.x - this.x;
            var y: float = v3fVec.y - this.y;
            var z: float = v3fVec.z - this.z;

            var fLength: float = sqrt(x*x + y*y + z*z);

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

        mix(v3fVec: IVec3, fA: float, v3fDestination?: IVec3): IVec3{
           if(!isDef(v3fDestination)){
                v3fDestination = this;
            }

            fA = clamp(fA,0.,1.);

            var fA1: float = 1. - fA;
            var fA2: float = fA;

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

            var x: float = this.x;
            var y: float = this.y;
            var z: float = this.z;
            var w: float;

            x = pData[ 0 ]*x + pData[ 4 ]*y + pData[ 8 ]*z + pData[ 12 ];
            y = pData[ 1 ]*x + pData[ 5 ]*y + pData[ 9 ]*z + pData[ 13 ];
            z = pData[ 2 ]*x + pData[ 6 ]*y + pData[ 10 ]*z + pData[ 14 ];
            w = pData[ 2 ]*x + pData[ 7 ]*y + pData[ 11 ]*z + pData[ 15 ];

            var fInvW: float = 1./w;

            v3fDestination.x = x*fInvW;
            v3fDestination.y = y*fInvW;
            v3fDestination.z = z*fInvW;

            return v3fDestination;
        };

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
        x: float;
        y: float;
        z: float;
        w: float;

        constructor();
        constructor(fValue: float);
        constructor(v4fVec: IVec4);
        constructor(pArray: float[]);
        constructor(fValue: float, v3fVec: IVec3);
        constructor(v2fVec1: IVec2, v2fVec2: IVec2);
        constructor(v3fVec: IVec3, fValue: float);
        constructor(fValue1: float, fValue2: float, v2fVec: IVec2);
        constructor(fValue1: float, v2fVec: IVec2, fValue2: float);
        constructor(v2fVec: IVec2 ,fValue1: float, fValue2: float);
        constructor(fValue1: float, fValue2: float, fValue3: float, fValue4: float);
        constructor(fValue1?, fValue2?, fValue3?, fValue4?){
            var nArgumentsLength: uint = arguments.length;

            switch(nArgumentsLength){
                case 1:
                    this.set(arguments[0]);
                    break;
                case 2:
                    this.set(arguments[0],arguments[1]);
                    break;
                case 3:
                    this.set(arguments[0],arguments[1], arguments[2]);
                    break;
                case 4:
                    this.set(arguments[0],arguments[1], arguments[2], arguments[3]);
                    break;
                default:
                    this.x = this.y = this.z = this.w = 0.;
                    break;
            }
        };

        set(): IVec4;
        set(fValue: float): IVec4;
        set(v4fVec: IVec4): IVec4;
        set(pArray: float[]): IVec4;
        set(fValue: float, v3fVec: IVec3): IVec4;
        set(v2fVec1: IVec2, v2fVec2: IVec2): IVec4;
        set(v3fVec: IVec3, fValue: float): IVec4;
        set(fValue1: float, fValue2: float, v2fVec: IVec2): IVec4;
        set(fValue1: float, v2fVec: IVec2, fValue2: float): IVec4;
        set(v2fVec: IVec2, fValue1: float, fValue2: float): IVec4;
        set(fValue1: float, fValue2: float, fValue3: float, fValue4: float): IVec4;
        set(fValue1?, fValue2?, fValue3?, fValue4?): IVec4{
            var nArgumentsLength: uint = arguments.length;

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
                    else{
//array
                        var pArray: float[] = arguments[0];

                        this.x = pArray[0];
                        this.y = pArray[1];
                        this.z = pArray[2];
                        this.w = pArray[3];
                    }
                    break;
                case 2:
                    if(isFloat(arguments[0])){
                        var fValue: float = arguments[0];
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
                        var fValue: float = arguments[1];

                        this.x = v3fVec.x;
                        this.y = v3fVec.y;
                        this.z = v3fVec.z;
                        this.w = fValue;
                    }
                    break;
                case 3:
                    if(isFloat(arguments[0])){
                        var fValue1: float = arguments[0];

                        if(isFloat(arguments[1])){
                            var fValue2: float = arguments[1];
                            var v2fVec: IVec2 = arguments[2];

                            this.x = fValue1;
                            this.y = fValue2;
                            this.z = v2fVec.x;
                            this.w = v2fVec.y;
                        }
                        else{
                            var v2fVec: IVec2 = arguments[1];
                            var fValue2: float = arguments[2];

                            this.x = fValue1;
                            this.y = v2fVec.x;
                            this.z = v2fVec.y;
                            this.w = fValue2;
                        }
                    }
                    else{
                        var v2fVec: IVec2 = arguments[0];
                        var fValue1: float = arguments[1];
                        var fValue2: float = arguments[2];

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

        /**@inline*/  dot(v4fVec: IVec4): float{
            return this.x*v4fVec.x + this.y*v4fVec.y + this.z*v4fVec.z + this.w*v4fVec.w;
        };

        isEqual(v4fVec: IVec4, fEps: float = 0.): bool{
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

        isClear(fEps: float = 0.): bool{

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

        scale(fScale: float, v4fDestination?: IVec4): IVec4{
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

            var x: float = this.x, y: float = this.y, z: float = this.z, w: float = this.w;
            var fLength: float = sqrt(x*x + y*y +z*z + w*w);

            if(fLength !== 0.){
                var fInvLength: float = 1./fLength;

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

        /**@inline*/  length(): float{
            var x: float = this.x, y: float = this.y, z: float = this.z, w: float = this.w;
            return sqrt(x*x + y*y + z*z + w*w);
        };

        /**@inline*/  lengthSquare(): float{
            var x: float = this.x, y: float = this.y, z: float = this.z, w: float = this.w;
            return x*x + y*y + z*z + w*w;
        };

        direction(v4fVec: IVec4, v4fDestination?: IVec4): IVec4{
            if(!isDef(v4fDestination)){
                v4fDestination = this;
            }

            var x: float = v4fVec.x - this.x;
            var y: float = v4fVec.y - this.y;
            var z: float = v4fVec.z - this.z;
            var w: float = v4fVec.w - this.w;

            var fLength: float = sqrt(x*x + y*y + z*z + w*w);

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

        mix(v4fVec: IVec4, fA: float, v4fDestination?: IVec4): IVec4{
            if(!isDef(v4fDestination)){
                v4fDestination = this;
            }

            fA = clamp(fA,0.,1.);

            var fA1: float = 1. - fA;
            var fA2: float = fA;

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
    }
}




///<reference path="../akra.ts" />

module akra.math {
    export class Mat2 {
        private pData: Float32Array = new Float32Array(4);

        constructor ();
        constructor (m2f: Mat2);
        constructor (f11: float, f12: float, f21: float, f22: float);
        constructor (f11? , f12? , f21? , f22? ) {
            switch (arguments.length) {
                case 1:
                    this.set(f11);
                    break;
                case 4:
                    this.set(f11, f12, f21, f22);
                    break;
            }
        }

        set(): Mat2;
        set(m2f: Mat2): Mat2;
        set(f11: float, f12: float, f21: float, f22: float): Mat2;
        set(f11? , f12? , f21? , f22? ): Mat2 {

            var pData: Float32Array = this.pData;

            switch (arguments.length) {
                case 1:
                    if (isFloat(f11)) {
                        pData[0] = pData[1] = pData[2] = pData[3] = f11;
                    }
                    else {
//pData.set(f11.pData);
                    }
                    break;
                case 4:
                    pData[0] = f11;
                    pData[1] = f21;
                    pData[2] = f12;
                    pData[3] = f22;
                    break;
            }

            return this;
        }
    }
}








/**
 * @important Если внезапно задумаем перейти обратно на 
 * хранение данных в матрицах по строкам, как собственно и было в начале,
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

	export interface IMat3 {
		data: Float32Array;

		set(): IMat3;
		set(fValue: float): IMat3;
		set(v3fVec: IVec3): IMat3;
		set(m3fMat: IMat3): IMat3;
		set(m4fMat: IMat4): IMat3;
		set(pArray: float[]): IMat3;
		set(fValue1: float, fValue2: float, fValue3: float): IMat3;
		set(v3fVec1: IVec3, v3fVec2: IVec3, v3fVec3: IVec3): IMat3;
		set(pArray1: float[], pArray2: float[], pArray3: float[]): IMat3;
		set(fValue1: float, fValue2: float, fValue3: float,
			fValue4: float, fValue5: float, fValue6: float,
			fValue7: float, fValue8: float, fValue9: float): IMat3;

		identity(): IMat3;

		add(m3fMat: IMat3, m3fDestination?: IMat3): IMat3;
		subtract(m3fMat: IMat3, m3fDestination?: IMat3): IMat3;
		multiply(m3fMat: IMat3, m3fDestination?: IMat3): IMat3;
		multiplyVec3(v3fVec: IVec3, v3fDestination?: IVec3): IVec3;

		transpose(m3fDestination?: IMat3): IMat3;
		determinant(): float;
		inverse(m3fDestination?: IMat3): IMat3;

		isEqual(m3fMat: IMat3, fEps?: float): bool;
		isDiagonal(fEps?: float) : bool;

		toMat4(m4fDestination?: IMat4): IMat4;
		toQuat4(q4fDestination?: IQuat4): IQuat4;
		toString(): string;

		decompose(q4fRotation: IQuat4, v3fScale: IVec3): bool;
		row(iRow: int, v3fDestination?: IVec3): IVec3;
		column(iColumn: int, v3fDestination?: IVec3): IVec3;
	};
};










module akra {

	export interface IVec3 {} ;
	export interface IMat3 {} ;
	export interface IMat4 {} ;

	export interface IQuat4 {
		x: float;
		y: float;
		z: float;
		w: float;

		set(): IQuat4;
		set(q4fQuat: IQuat4): IQuat4;
		set(pArray: float[]): IQuat4;
		set(fValue: float, fW: float): IQuat4;
		set(v3fValue: IVec3, fW: float): IQuat4;
		set(fX: float, fY: float, fZ: float, fW: float): IQuat4;

		multiply(q4fQuat: IQuat4, q4fDestination?: IQuat4): IQuat4;
		multiplyVec3(v3fVec: IVec3, v3fDestination?: IVec3): IVec3;

		conjugate(q4fDestination?: IQuat4): IQuat4;
		inverse(q4fDestination?: IQuat4): IQuat4;

		length(): float;
		normalize(q4fDestination?: IQuat4): IQuat4;

		calculateW(q4fDestination?: IQuat4): IQuat4;

		isEqual(q4fQuat: IQuat4, fEps?: float, asMatrix?: bool): bool;

		getYaw(): float;
		getPitch(): float;
		getRoll(): float;
		toYawPitchRoll(v3fDestination?: IVec3): IVec3;

		toMat3(m3fDestination?: IMat3): IMat3;
		toMat4(m4fDestination?: IMat4): IMat4;
		toString(): string;

		mix(q4fQuat: IQuat4, fA: float, q4fDestination?: IQuat4, bShortestPath?: bool);
		smix(q4fQuat: IQuat4, fA: float, q4fDestination?: IQuat4, bShortestPath?: bool);
	};
};



module akra.math {
    export class Mat3 {
/*var m3fMat;

	    if(this === window  || this === window.AKRA){
	        m3fMat = Mat3._pStorage[Mat3._iIndex++];
	        if(Mat3._iIndex == Mat3._nStorageSize){
	            Mat3._iIndex = 0;
	        }        

	        //clear
	        if(arguments.length == 0){
	            // var pData = m3fMat.pData;
	            // pData.a11 = pData.a12 = pData.a13 = 
	            // pData.a21 = pData.a22 = pData.a23 = 
	            // pData.a31 = pData.a32 = pData.a33 = 0;
	            return m3fMat;
	        }
	    }
	    else{
	        this.pData = new Float32Array(9);
	        m3fMat = this;
	    }*/


	    data : Float32Array;

	    constructor();
		constructor(fValue: float);
		constructor(v3fVec: IVec3);
		constructor(m3fMat: IMat3);
		constructor(m4fMat: IMat4);
		constructor(pArray: float[]);
		constructor(fValue1: float, fValue2: float, fValue3: float);
		constructor(v3fVec1: IVec3, v3fVec2: IVec3, v3fVec3: IVec3);
		constructor(pArray1: float[], pArray2: float[], pArray3: float[]);
		constructor(fValue1: float, fValue2: float, fValue3: float,
					fValue4: float, fValue5: float, fValue6: float,
					fValue7: float, fValue8: float, fValue9: float);

		constructor(fValue1?, fValue2?, fValue3?,
					fValue4?, fValue5?, fValue6?,
					fValue7?, fValue8?, fValue9?){

			this.data = new Float32Array(9);

			var nArgumentsLength: uint = arguments.length;

			if(nArgumentsLength == 1){
		        this.set(arguments[0]);
		    }
		    else if(nArgumentsLength == 3){
		        this.set(arguments[0],arguments[1],arguments[2]);
		    }
		    else if(nArgumentsLength == 9){
		        this.set(arguments[0],arguments[1],arguments[2],
                        arguments[3],arguments[4],arguments[5],
                        arguments[6],arguments[7],arguments[8]);
		    }
		};

		set(): IMat3;
		set(fValue: float): IMat3;
		set(v3fVec: IVec3): IMat3;
		set(m3fMat: IMat3): IMat3;
		set(m4fMat: IMat4): IMat3;
		set(pArray: float[]): IMat3;
		set(fValue1: float, fValue2: float, fValue3: float): IMat3;
		set(v3fVec1: IVec3, v3fVec2: IVec3, v3fVec3: IVec3): IMat3;
		set(pArray1: float[], pArray2: float[], pArray3: float[]): IMat3;
		set(fValue1: float, fValue2: float, fValue3: float,
			fValue4: float, fValue5: float, fValue6: float,
			fValue7: float, fValue8: float, fValue9: float): IMat3;

		set(fValue1?, fValue2?, fValue3?,
			fValue4?, fValue5?, fValue6?,
			fValue7?, fValue8?, fValue9?): IMat3{

			var pData: Float32Array = this.data;

//без аргументов инициализируется нулями

		    var nArgumentsLength: uint = arguments.length;
		    if(nArgumentsLength == 0){
		        pData[ 0 ] = pData[ 3 ] = pData[ 6 ] = 0;
		        pData[ 1 ] = pData[ 4 ] = pData[ 7 ] = 0;
		        pData[ 2 ] = pData[ 5 ] = pData[ 8 ] = 0;
		    }
		    if(nArgumentsLength == 1){
		        if(isFloat(arguments[0])){
		            var nValue: float = arguments[0];

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
		            var pElements: float[] = arguments[0];

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

		                var v3fVec1: float[] = arguments[0];
		                var v3fVec2: float[] = arguments[1];
		                var v3fVec3: float[] = arguments[2];

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
	        var a11: float = pData1[ 0 ], a12: float = pData1[ 3 ], a13: float = pData1[ 6 ];
	        var a21: float = pData1[ 1 ], a22: float = pData1[ 4 ], a23: float = pData1[ 7 ];
	        var a31: float = pData1[ 2 ], a32: float = pData1[ 5 ], a33: float = pData1[ 8 ];

	        var b11: float = pData2[ 0 ], b12: float = pData2[ 3 ], b13: float = pData2[ 6 ];
	        var b21: float = pData2[ 1 ], b22: float = pData2[ 4 ], b23: float = pData2[ 7 ];
	        var b31: float = pData2[ 2 ], b32: float = pData2[ 5 ], b33: float = pData2[ 8 ];

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

	        var x: float = v3fVec.x, y: float = v3fVec.y, z: float = v3fVec.z;

	        v3fDestination.x = pData[ 0 ] * x + pData[ 3 ] * y + pData[ 6 ] * z;
	        v3fDestination.y = pData[ 1 ] * x + pData[ 4 ] * y + pData[ 7 ] * z;
	        v3fDestination.z = pData[ 2 ] * x + pData[ 5 ] * y + pData[ 8 ] * z;

		    return v3fDestination;
		};

		transpose(m3fDestination?: IMat3): IMat3{
			var pData: Float32Array = this.data;
		    if(!isDef(m3fDestination)){
//быстрее будет явно обработать оба случая
		        var a12: float = pData[ 3 ], a13: float = pData[ 6 ], a23: float = pData[ 7 ];

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

		determinant(): float{
			var pData: Float32Array = this.data;

		    var a11: float = pData[ 0 ], a12: float = pData[ 3 ], a13: float = pData[ 6 ];
		    var a21: float = pData[ 1 ], a22: float = pData[ 4 ], a23: float = pData[ 7 ];
		    var a31: float = pData[ 2 ], a32: float = pData[ 5 ], a33: float = pData[ 8 ];

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

		    var a11: float = pData[ 0 ], a12: float = pData[ 3 ], a13: float = pData[ 6 ];
		    var a21: float = pData[ 1 ], a22: float = pData[ 4 ], a23: float = pData[ 7 ];
		    var a31: float = pData[ 2 ], a32: float = pData[ 5 ], a33: float = pData[ 8 ];

		    var A11: float = a22 * a33 - a23 * a32;
		    var A12: float = a21 * a33 - a23 * a31;
		    var A13: float = a21 * a32 - a22 * a31;

		    var A21: float = a12 * a33 - a13 * a32;
		    var A22: float = a11 * a33 - a13 * a31;
		    var A23: float = a11 * a32 - a12 * a31;

		    var A31: float = a12 * a23 - a13 * a22;
		    var A32: float = a11 * a23 - a13 * a21;
		    var A33: float = a11 * a22 - a12 * a21;

		    var fDeterminant: float = a11*A11 - a12 * A12 + a13 * A13;

		    if(fDeterminant == 0.){
		        error("обращение матрицы с нулевым детеминантом:\n",
		                    this.toString());

		        return m3fDestination.set(1.);
//чтоб все не навернулось
		    }

		    var fInverseDeterminant: float = 1./fDeterminant;

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

		isEqual(m3fMat: IMat3, fEps: float = 0.): bool{
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

		isDiagonal(fEps: float = 0.) : bool{
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

		    var a11: float = pData[ 0 ], a12: float = pData[ 3 ], a13: float = pData[ 6 ];
		    var a21: float = pData[ 1 ], a22: float = pData[ 4 ], a23: float = pData[ 7 ];
		    var a31: float = pData[ 2 ], a32: float = pData[ 5 ], a33: float = pData[ 8 ];

/*x^2*/
		    var x2: float = ((a11 - a22 - a33) + 1)/4;
/*y^2*/
		    var y2: float = ((a22 - a11 - a33) + 1)/4;
/*z^2*/
		    var z2: float = ((a33 - a11 - a22) + 1)/4;
/*w^2*/
		    var w2: float = ((a11 + a22 + a33) + 1)/4;

		    var fMax: float = Math.max(x2,Math.max(y2,Math.max(z2,w2)));

		    if(fMax == x2){
//максимальная компонента берется положительной
		        var x: float = Math.sqrt(x2);

		        q4fDestination.x = x;
		        q4fDestination.y = (a21 + a12)/4/x;
		        q4fDestination.z = (a31 + a13)/4/x;
		        q4fDestination.w = (a32 - a23)/4/x;
		    }
		    else if(fMax == y2){
//максимальная компонента берется положительной
		        var y: float = Math.sqrt(y2); x

		        q4fDestination.x = (a21 + a12)/4/y;
		        q4fDestination.y = y;
		        q4fDestination.z = (a32 + a23)/4/y;
		        q4fDestination.w = (a13 - a31)/4/y;
		    }
		    else if(fMax == z2){
//максимальная компонента берется положительной
		        var z: float = Math.sqrt(z2);

		        q4fDestination.x = (a31 + a13)/4/z;
		        q4fDestination.y = (a32 + a23)/4/z;
		        q4fDestination.z = z;
		        q4fDestination.w = (a21 - a12)/4/z;
		    }
		    else{
//максимальная компонента берется положительной
		        var w: float = Math.sqrt(w2);

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
    		var scaleSign: int = (m3fRotScale.determinant() >= 0.) ? 1 : -1;

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

		   	var x: float = sqrt(pResultData[ 0 ]);
/*если было отражение, считается что оно было по y*/
		   	var y: float = sqrt(pResultData[ 4 ])*scaleSign;
		   	var z: float = sqrt(pResultData[ 8 ]);

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
		   		debug_assert(false,"порядок умножения scale rot в данный момент не поддерживается");
		   		return false;
		   	}
		};

		row(iRow: int, v3fDestination?: IVec3): IVec3{
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

		column(iColumn: int, v3fDestination?: IVec3): IVec3{
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

		static fromYawPitchRoll(fYaw: float, fPitch: float, fRoll: float, m3fDestination?: IMat3): IMat3;
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

		    var fSin1: float = Math.sin(fYaw);
		    var fSin2: float = Math.sin(fPitch);
		    var fSin3: float = Math.sin(fRoll);

		    var fCos1: float = Math.cos(fYaw);
		    var fCos2: float = Math.cos(fPitch);
		    var fCos3: float = Math.cos(fRoll);

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

		static fromXYZ(fX: float, fY: float, fZ: float, m3fDestination?: IMat3): IMat3;
		static fromXYZ(v3fAngles: IVec3, m3fDestination?: IMat3): IMat3;
		static fromXYZ(fX?, fY?, fZ?, m3fDestination?) : IMat3{
			if(arguments.length <= 2){
//Vec3 + m3fDestination
				var v3fVec: IVec3 = arguments[0];
				return Mat3.fromYawPitchRoll(v3fVec.y,v3fVec.x,v3fVec.z,arguments[1]);
			}
			else{
//fX fY fZ m3fDestination
				var fX: float = arguments[0];
				var fY: float = arguments[1];
				var fZ: float = arguments[2];

				return Mat3.fromYawPitchRoll(fY, fX, fZ, arguments[3]);
			}
		};

		static stackSize: uint = 100; static stackPosition: int = 0; static stack: IMat3 [] = (function(): IMat3 []{ var pStack: IMat3 [] = new Array(Mat3.stackSize); for(var i:int = 0; i<Mat3.stackSize; i++){ pStack[i] = new Mat3(); } return pStack})(); ;
    };
};
















module akra {

	export interface IVec2 {} ;
	export interface IVec3 {} ;

	export interface IVec4 {
		x: float;
		y: float;
		z: float;
		w: float;

		set(): IVec4;
		set(fValue: float): IVec4;
		set(v4fVec: IVec4): IVec4;
		set(pArray: float[]): IVec4;
		set(fValue: float, v3fVec: IVec3): IVec4;
		set(v2fVec1: IVec2, v2fVec2: IVec2): IVec4;
		set(v3fVec: IVec3, fValue: float): IVec4;
		set(fValue1: float, fValue2: float, v2fVec: IVec2): IVec4;
		set(fValue1: float, v2fVec: IVec2, fValue2: float): IVec4;
		set(v2fVec: IVec2, fValue1: float, fValue2: float): IVec4;
		set(fValue1: float, fValue2: float, fValue3: float, fValue4: float): IVec4;

		clear(): IVec4;

		add(v4fVec: IVec4, v4fDestination?: IVec4): IVec4;
		subtract(v4fVec: IVec4, v4fDestination?: IVec4): IVec4;
		dot(v4fVec: IVec4): float;

		isEqual(v4fVec: IVec4, fEps?: float): bool;
		isClear(fEps?: float): bool;

		negate(v4fDestination?: IVec4): IVec4;
		scale(fScale: float, v4fDestination?: IVec4): IVec4;
		normalize(v4fDestination?: IVec4): IVec4;
		length(): float;
		lengthSquare(): float;

		direction(v4fVec: IVec4, v4fDestination?: IVec4): IVec4;

		mix(v4fVec: IVec4, fA: float, v4fDestination?: IVec4): IVec4;

		toString(): string;
	};
};





module akra.math {
    export class Mat4 implements IMat4{
    	data: Float32Array;

		constructor();
		constructor(fValue: float);
		constructor(v4fVec: IVec4);
		constructor(m3fMat: IMat3, v3fTranslation?: IVec3);
		constructor(m4fMat: IMat4);
		constructor(pArray: float[]);
		constructor(pArray: Float32Array, bFlag: bool);
		constructor(fValue1: float, fValue2: float,
				fValue3: float, fValue4: float);
		constructor(v4fVec1: IVec4, v4fVec2: IVec4,
				v4fVec3: IVec4, v4fVec4: IVec4);
		constructor(pArray1: float[], pArray2: float[],
				pArray3: float[], pArray4: float[]);
		constructor(fValue1: float, fValue2: float, fValue3: float, fValue4: float,
				fValue5: float, fValue6: float, fValue7: float, fValue8: float,
				fValue9: float, fValue10: float, fValue11: float, fValue12: float,
				fValue13: float, fValue14: float, fValue15: float, fValue16: float);
		constructor(fValue1?, fValue2?, fValue3?, fValue4?,
					fValue5?, fValue6?, fValue7?, fValue8?,
					fValue9?, fValue10?, fValue11?, fValue12?,
					fValue13?, fValue14?, fValue15?, fValue16?){

			var nArgumentsLength: uint = arguments.length;

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

				if(nArgumentsLength === 1){
					if(arguments[0] instanceof Mat3){
						this.set(arguments[0],vec3(0.));
					}
					else{
						this.set(arguments[0]);
					}
				}
				else if(nArgumentsLength === 4){
					this.set(arguments[0],arguments[1],arguments[2],arguments[3]);
				}
				else if(nArgumentsLength === 16){
					this.set(arguments[0], arguments[1], arguments[2], arguments[3],
							 arguments[4], arguments[5], arguments[6], arguments[7],
							 arguments[8], arguments[9], arguments[10], arguments[11],
							 arguments[12], arguments[13], arguments[14], arguments[15]);
				}
			}
		};

		set(): IMat4;
		set(fValue: float): IMat4;
		set(v4fVec: IVec4): IMat4;
		set(m3fMat: IMat3, v3fTranslation?: IVec3): IMat4;
		set(m4fMat: IMat4): IMat4;
		set(pArray: float[]): IMat4;
		set(fValue1: float, fValue2: float,
			fValue3: float, fValue4: float): IMat4;
		set(v4fVec1: IVec4, v4fVec2: IVec4,
			v4fVec3: IVec4, v4fVec4: IVec4): IMat4;
		set(pArray1: float[], pArray2: float[],
			pArray3: float[], pArray4: float[]): IMat4;
		set(fValue1: float, fValue2: float, fValue3: float, fValue4: float,
			fValue5: float, fValue6: float, fValue7: float, fValue8: float,
			fValue9: float, fValue10: float, fValue11: float, fValue12: float,
			fValue13: float, fValue14: float, fValue15: float, fValue16: float): IMat4;
		set(fValue1?, fValue2?, fValue3?, fValue4?,
			fValue5?, fValue6?, fValue7?, fValue8?,
			fValue9?, fValue10?, fValue11?, fValue12?,
			fValue13?, fValue14?, fValue15?, fValue16?): IMat4{

			var nArgumentsLength: uint = arguments.length;
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
					var fValue: float = arguments[0];

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
					var pArray: float[] = arguments[0];

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

					var v4fColumn1: float[] = arguments[0];
					var v4fColumn2: float[] = arguments[1];
					var v4fColumn3: float[] = arguments[2];
					var v4fColumn4: float[] = arguments[3];

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

	        var a11: float = pData1[ 0 ], a12: float = pData1[ 4 ], a13: float = pData1[ 8 ], a14: float = pData1[ 12 ];
	        var a21: float = pData1[ 1 ], a22: float = pData1[ 5 ], a23: float = pData1[ 9 ], a24: float = pData1[ 13 ];
	        var a31: float = pData1[ 2 ], a32: float = pData1[ 6 ], a33: float = pData1[ 10 ], a34: float = pData1[ 14 ];
	        var a41: float = pData1[ 3 ], a42: float = pData1[ 7 ], a43: float = pData1[ 11 ], a44: float = pData1[ 15 ];

	        var b11: float = pData2[ 0 ], b12: float = pData2[ 4 ], b13: float = pData2[ 8 ], b14: float = pData2[ 12 ];
	        var b21: float = pData2[ 1 ], b22: float = pData2[ 5 ], b23: float = pData2[ 9 ], b24: float = pData2[ 13 ];
	        var b31: float = pData2[ 2 ], b32: float = pData2[ 6 ], b33: float = pData2[ 10 ], b34: float = pData2[ 14 ];
	        var b41: float = pData2[ 3 ], b42: float = pData2[ 7 ], b43: float = pData2[ 11 ], b44: float = pData2[ 15 ];

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

			var x: float = v4fVec.x, y: float = v4fVec.y, z: float = v4fVec.z, w: float = v4fVec.w;

			v4fDestination.x = pData[ 0 ]*x + pData[ 4 ]*y + pData[ 8 ]*z + pData[ 12 ]*w;
	        v4fDestination.y = pData[ 1 ]*x + pData[ 5 ]*y + pData[ 9 ]*z + pData[ 13 ]*w;
	        v4fDestination.z = pData[ 2 ]*x + pData[ 6 ]*y + pData[ 10 ]*z + pData[ 14 ]*w;
	        v4fDestination.w = pData[ 3 ]*x + pData[ 7 ]*y + pData[ 11 ]*z + pData[ 15 ]*w;

	        return v4fDestination;
		};

		transpose(m4fDestination?: IMat4): IMat4{

			var pData = this.data;

		    if(!isDef(m4fDestination)){
		        var a12: float = pData[ 4 ], a13: float = pData[ 8 ], a14: float = pData[ 12 ];
		        var a23: float = pData[ 9 ], a24: float = pData[ 13 ];
		        var a34: float = pData[ 14 ];

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

		determinant(): float{
			var pData = this.data;

		    var a11: float = pData[ 0 ], a12: float = pData[ 4 ], a13: float = pData[ 8 ], a14: float = pData[ 12 ];
		    var a21: float = pData[ 1 ], a22: float = pData[ 5 ], a23: float = pData[ 9 ], a24: float = pData[ 13 ];
		    var a31: float = pData[ 2 ], a32: float = pData[ 6 ], a33: float = pData[ 10 ], a34: float = pData[ 14 ];
		    var a41: float = pData[ 3 ], a42: float = pData[ 7 ], a43: float = pData[ 11 ], a44: float = pData[ 15 ];

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
		    var a11: float = pData[ 0 ], a12: float = pData[ 4 ], a13: float = pData[ 8 ], a14: float = pData[ 12 ];
		    var a21: float = pData[ 1 ], a22: float = pData[ 5 ], a23: float = pData[ 9 ], a24: float = pData[ 13 ];
		    var a31: float = pData[ 2 ], a32: float = pData[ 6 ], a33: float = pData[ 10 ], a34: float = pData[ 14 ];
		    var a41: float = pData[ 3 ], a42: float = pData[ 7 ], a43: float = pData[ 11 ], a44: float = pData[ 15 ];

		    var b00: float = a11*a22 - a12*a21;
		    var b01: float = a11*a23 - a13*a21;
		    var b02: float = a11*a24 - a14*a21;
		    var b03: float = a12*a23 - a13*a22;
		    var b04: float = a12*a24 - a14*a22;
		    var b05: float = a13*a24 - a14*a23;
		    var b06: float = a31*a42 - a32*a41;
		    var b07: float = a31*a43 - a33*a41;
		    var b08: float = a31*a44 - a34*a41;
		    var b09: float = a32*a43 - a33*a42;
		    var b10: float = a32*a44 - a34*a42;
		    var b11: float = a33*a44 - a34*a43;

		    var fDeterminant: float = b00*b11 - b01*b10 + b02*b09 + b03*b08 - b04*b07 + b05*b06;

		    if(fDeterminant === 0.){
		        debug_assert(false,"обращение матрицы с нулевым детеминантом:\n"
		                        + this.toString());

//чтоб все не навернулось		        return m4fDestination.set(1.);
		    }

		    var fInverseDeterminant: float = 1/fDeterminant;

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

		/**@inline*/  trace(): float{
			var pData: Float32Array = this.data;
			return pData[ 0 ] + pData[ 5 ] + pData[ 10 ] + pData[ 15 ];
		};

		isEqual(m4fMat: IMat4, fEps: float = 0.): bool{
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

		isDiagonal(fEps: float = 0.): bool{
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

		    var a11: float = pData[ 0 ], a12: float = pData[ 4 ], a13: float = pData[ 8 ];
		    var a21: float = pData[ 1 ], a22: float = pData[ 5 ], a23: float = pData[ 9 ];
		    var a31: float = pData[ 2 ], a32: float = pData[ 6 ], a33: float = pData[ 10 ];

/*x^2*/
		    var x2: float = ((a11 - a22 - a33) + 1.)/4.;
/*y^2*/
		    var y2: float = ((a22 - a11 - a33) + 1.)/4.;
/*z^2*/
		    var z2: float = ((a33 - a11 - a22) + 1.)/4.;
/*w^2*/
		    var w2: float = ((a11 + a22 + a33) + 1.)/4.;

		    var fMax: float = max(x2,max(y2,max(z2,w2)));

		    if(fMax == x2){
//максимальная компонента берется положительной
		        var x: float = sqrt(x2);

		        q4fDestination.x = x;
		        q4fDestination.y = (a21 + a12)/4./x;
		        q4fDestination.z = (a31 + a13)/4./x;
		        q4fDestination.w = (a32 - a23)/4./x;
		    }
		    else if(fMax == y2){
//максимальная компонента берется положительной
		        var y: float = sqrt(y2);

		        q4fDestination.x = (a21 + a12)/4./y;
		        q4fDestination.y = y;
		        q4fDestination.z = (a32 + a23)/4./y;
		        q4fDestination.w = (a13 - a31)/4./y;
		    }
		    else if(fMax == z2){
//максимальная компонента берется положительной
		        var z: float = sqrt(z2);

		        q4fDestination.x = (a31 + a13)/4./z;
		        q4fDestination.y = (a32 + a23)/4./z;
		        q4fDestination.z = z;
		        q4fDestination.w = (a21 - a12)/4./z;
		    }
		    else{
//максимальная компонента берется положительной
		        var w: float = sqrt(w2);

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

		rotateRight(fAngle: float, v3fAxis: IVec3, m4fDestination?: IMat4): IMat4{
			var pData: Float32Array = this.data;

		    var x: float = v3fAxis.x, y: float = v3fAxis.y, z: float = v3fAxis.z;
		    var fLength: float = Math.sqrt(x*x + y*y + z*z);

		    if(fLength === 0.){
		    	debug_assert(false,"попытка вращения вокруг оси нулевой длины. Угол " + fAngle + ". Ось " + v3fAxis.toString());
		    	if(isDef(m4fDestination)){
		    		m4fDestination.set(this);
		    	}
		    	else{
		    		m4fDestination = this;
		    	}
		    	return m4fDestination;
		    }

		    var fInvLength: float = 1./fLength;

		    x*=fInvLength;
		    y*=fInvLength;
		    z*=fInvLength;

		    var a11: float = pData[ 0 ], a12: float = pData[ 4 ], a13: float = pData[ 8 ];
		    var a21: float = pData[ 1 ], a22: float = pData[ 5 ], a23: float = pData[ 9 ];
		    var a31: float = pData[ 2 ], a32: float = pData[ 6 ], a33: float = pData[ 10 ];

		    var fSin: float = sin(fAngle);
		    var fCos: float = cos(fAngle);
		    var fTmp: float = 1. - fCos;

//build Rotation matrix

		    var b11: float = fCos + fTmp*x*x, b12: float = fTmp*x*y - fSin*z, b13: float = fTmp*x*z + fSin*y;
		    var b21: float = fTmp*y*z + fSin*z, b22: float = fCos + fTmp*y*y, b23: float = fTmp*y*z - fSin*x;
		    var b31: float = fTmp*z*x - fSin*y, b32: float = fTmp*z*y + fSin*x, b33: float = fCos + fTmp*z*z;

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

		rotateLeft(fAngle: float, v3fAxis: IVec3, m4fDestination?: IMat4): IMat4{
			var pData: Float32Array = this.data;

		    var x: float = v3fAxis.x, y: float = v3fAxis.y, z: float = v3fAxis.z;
		    var fLength: float = Math.sqrt(x*x + y*y + z*z);

		    if(fLength === 0.){
		    	debug_assert(false,"попытка вращения вокруг оси нулевой длины. Угол " + fAngle + ". Ось " + v3fAxis.toString());
		    	if(isDef(m4fDestination)){
		    		m4fDestination.set(this);
		    	}
		    	else{
		    		m4fDestination = this;
		    	}
		    	return m4fDestination;
		    }

		    var fInvLength: float = 1./fLength;

		    x*=fInvLength;
		    y*=fInvLength;
		    z*=fInvLength;

		    var a11: float = pData[ 0 ], a12: float = pData[ 4 ], a13: float = pData[ 8 ], a14: float = pData[ 12 ];
		    var a21: float = pData[ 1 ], a22: float = pData[ 5 ], a23: float = pData[ 9 ], a24: float = pData[ 13 ];
		    var a31: float = pData[ 2 ], a32: float = pData[ 6 ], a33: float = pData[ 10 ], a34: float = pData[ 14 ];

		    var fSin: float = sin(fAngle);
		    var fCos: float = cos(fAngle);
		    var fTmp: float = 1. - fCos;

//build Rotation matrix

		    var b11: float = fCos + fTmp*x*x, b12: float = fTmp*x*y - fSin*z, b13: float = fTmp*x*z + fSin*y;
		    var b21: float = fTmp*y*z + fSin*z, b22: float = fCos + fTmp*y*y, b23: float = fTmp*y*z - fSin*x;
		    var b31: float = fTmp*z*x - fSin*y, b32: float = fTmp*z*y + fSin*x, b33: float = fCos + fTmp*z*z;

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

		    var x: float = v3fTranslation.x, y: float = v3fTranslation.y, z: float = v3fTranslation.z;

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
		    var a11: float = pData[ 0 ], a12: float = pData[ 4 ], a13: float = pData[ 8 ];
		    var a21: float = pData[ 0 ], a22: float = pData[ 5 ], a23: float = pData[ 9 ];
		    var a31: float = pData[ 0 ], a32: float = pData[ 6 ], a33: float = pData[ 10 ];
		    var a41: float = pData[ 0 ], a42: float = pData[ 7 ], a43: float = pData[ 11 ];

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

		    var x: float = v3fTranslation.x, y: float = v3fTranslation.y, z: float = v3fTranslation.z;

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

		    var x: float = v3fScale.x, y: float = v3fScale.y, z: float = v3fScale.z;

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

		    var x: float = v3fScale.x, y: float = v3fScale.y, z: float = v3fScale.z;

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

		row(iRow: int, v4fDestination?: IVec4): IVec4{
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

		column(iColumn: int, v4fDestination?: IVec4): IVec4{
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

		static fromYawPitchRoll(fYaw: float, fPitch: float, fRoll: float, m4fDestination?: IMat4): IMat4;
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

		    var fSin1: float = Math.sin(fYaw);
		    var fSin2: float = Math.sin(fPitch);
		    var fSin3: float = Math.sin(fRoll);

		    var fCos1: float = Math.cos(fYaw);
		    var fCos2: float = Math.cos(fPitch);
		    var fCos3: float = Math.cos(fRoll);

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

		static fromXYZ(fX: float, fY: float, fZ: float, m4fDestination?: IMat4): IMat4;
		static fromXYZ(v3fAngles: IVec3, m4fDestination?: IMat4): IMat4;
		static fromXYZ(fX?, fY?, fZ?, m4fDestination?) : IMat4{
			if(arguments.length <= 2){
//Vec3 + m4fDestination
				var v3fVec: IVec3 = arguments[0];
				return Mat4.fromYawPitchRoll(v3fVec.y,v3fVec.x,v3fVec.z,arguments[1]);
			}
			else{
//fX fY fZ m4fDestination
				var fX: float = arguments[0];
				var fY: float = arguments[1];
				var fZ: float = arguments[2];

				return Mat4.fromYawPitchRoll(fY, fX, fZ, arguments[3]);
			}
		};

		static frustum(fLeft: float, fRight: float, fBottom: float, fTop: float, fNear: float, fFar: float, m4fDestination?: IMat4): IMat4{
			if(!isDef(m4fDestination)){
		        m4fDestination = new Mat4();
		    }

		    var pDataDestination: Float32Array = m4fDestination.data;

		    var fRL: float = fRight - fLeft;
		    var fTB: float = fTop - fBottom;
		    var fFN: float = fFar - fNear;

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

		/**@inline*/  static perspective(fFovy: float, fAspect: float, fNear: float, fFar: float, m4fDestination?: IMat4): IMat4{
			var fTop: float = fNear*tan(fFovy/2.);
			var fRight: float = fTop*fAspect;

			return Mat4.frustum(-fRight, fRight, -fTop, fTop, fNear, fFar, m4fDestination);
		};

		static orthogonalProjectionAsymmetric(fLeft: float, fRight: float, fBottom: float,
												 fTop: float, fNear: float, fFar: float, m4fDestination?: IMat4): IMat4{

			 if(!isDef(m4fDestination)){
		        m4fDestination = new Mat4();
		    }

		    var pDataDestination: Float32Array = m4fDestination.data;

		    var fRL: float = fRight - fLeft;
		    var fTB: float = fTop - fBottom;
		    var fFN: float = fFar - fNear;

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

		/**@inline*/  static orthogonalProjection(fWidth: float, fHeight: float, fNear: float, fFar: float, m4fDestination?: IMat4): IMat4{
			var fRight: float = fWidth/2.;
		    var fTop: float = fHeight/2.;
		    return Mat4.orthogonalProjectionAsymmetric(-fRight, fRight, -fTop, fTop, fNear, fFar, m4fDestination);
		};

		static lookAt(v3fEye: IVec3, v3fCenter: IVec3, v3fUp: IVec3, m4fDestination?: IMat4): IMat4{
			if(!isDef(m4fDestination)){
		        m4fDestination = new Mat4(1.);
		    }

		    var fEyeX: float = v3fEye.x, fEyeY: float = v3fEye.y, fEyeZ: float = v3fEye.z;
		    var fCenterX: float = v3fCenter.x, fCenterY: float = v3fCenter.y, fCenterZ: float = v3fCenter.z;
		    var fUpX: float = v3fUp.x, fUpY: float = v3fUp.y, fUpZ: float = v3fUp.z;

		    var fLength: float;
		    var fInvLength: float;

		    if(fEyeX === fCenterX && fEyeY === fCenterY && fEyeZ === fCenterZ){
		        return m4fDestination;
		    }

		    var fXNewX: float, fXNewY: float, fXNewZ: float;
		    var fYNewX: float, fYNewY: float, fYNewZ: float;
		    var fZNewX: float, fZNewY: float, fZNewZ: float;

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
		    var fEyeNewX: float = fEyeX*fXNewX + fEyeY*fXNewY + fEyeZ*fXNewZ;
		    var fEyeNewY: float = fEyeX*fYNewX + fEyeY*fYNewY + fEyeZ*fYNewZ;
		    var fEyeNewZ: float = fEyeX*fZNewX + fEyeY*fZNewY + fEyeZ*fZNewZ;

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

		static stackSize: uint = 100; static stackPosition: int = 0; static stack: IMat4 [] = (function(): IMat4 []{ var pStack: IMat4 [] = new Array(Mat4.stackSize); for(var i:int = 0; i<Mat4.stackSize; i++){ pStack[i] = new Mat4(); } return pStack})();
    }
}
















module akra.math {
    export class Quat4 implements IQuat4{
    	x: float;
    	y: float;
    	z: float;
    	w: float;

    	constructor();
    	constructor(q4fQuat: IQuat4);
    	constructor(pArray: float[]);
    	constructor(fValue: float, fW: float);
    	constructor(v3fValue: IVec3, fW: float);
    	constructor(fX: float, fY: float, fZ: float, fW: float);
    	constructor(fX?, fY?, fZ?, fW?){
    		var nArgumentsLength: uint = arguments.length;

    		if(nArgumentsLength === 1){
    			this.set(arguments[0]);
    		}
    		else if(nArgumentsLength === 2){
    			this.set(arguments[0],arguments[1]);
    		}
    		else if(nArgumentsLength === 4){
    			this.set(arguments[0], arguments[1], arguments[2], arguments[3]);
    		}
    		else{
    			this.x = 0.;
    			this.y = 0.;
    			this.z = 0.;
    			this.w = 1.;
    		}
    	};

    	set(): IQuat4;
		set(q4fQuat: IQuat4): IQuat4;
		set(pArray: float[]): IQuat4;
		set(fValue: float, fW: float): IQuat4;
		set(v3fValue: IVec3, fW: float): IQuat4;
		set(fX: float, fY: float, fZ: float, fW: float): IQuat4;
		set(fX?, fY?, fZ?, fW?): IQuat4{
			var nArgumentsLength: uint = arguments.length;

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
		            var pElements: float[] = arguments[0];

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
		            var fValue: float = arguments[0];

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

		    var x1: float = this.x, y1: float = this.y, z1: float = this.z, w1: float = this.w;
		    var x2: float = q4fQuat.x, y2: float = q4fQuat.y, z2: float = q4fQuat.z, w2: float = q4fQuat.w;

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

		    var x: float = this.x, y: float = this.y, z: float = this.z, w: float = this.w;
		    var fSqLength: float = x*x + y*y + z*z + w*w;

		    if(fSqLength === 0.){
		        q4fDestination.x = 0.;
		        q4fDestination.y = 0.;
		        q4fDestination.z = 0.;
		        q4fDestination.w = 0.;
		    }
		    else{
		        var fInvSqLength : float= 1./fSqLength;
		        q4fDestination.x = -x*fInvSqLength;
		        q4fDestination.y = -y*fInvSqLength;
		        q4fDestination.z = -z*fInvSqLength;
		        q4fDestination.w =  w*fInvSqLength;
		    }

		    return q4fDestination;
		};

		/**@inline*/  length() : float{
			var x: float = this.x, y: float = this.y, z: float = this.z, w: float = this.w;
    		return sqrt(x*x + y*y + z*z + w*w);
		};

		normalize(q4fDestination?: IQuat4): IQuat4{
			if(!isDef(q4fDestination)){
		        q4fDestination = this;
		    }

		    var x: float = this.x, y: float = this.y, z: float = this.z, w: float = this.w;

		    var fLength: float = sqrt(x*x + y*y + z*z + w*w);

		    if(fLength === 0.){
		    	q4fDestination.x = 0.;
		    	q4fDestination.y = 0.;
		    	q4fDestination.z = 0.;
		    	q4fDestination.w = 0.;

		    }
		    else{
		    	var fInvLength: float = 1/fLength;

		    	q4fDestination.x = x*fInvLength;
		    	q4fDestination.y = y*fInvLength;
		    	q4fDestination.z = z*fInvLength;
		    	q4fDestination.w = w*fInvLength;
		    }

		    return q4fDestination;
		};

		calculateW(q4fDestination?: IQuat4): IQuat4{
			var x: float = this.x, y: float = this.y, z: float = this.z;

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

		isEqual(q4fQuat: IQuat4, fEps: float = 0., asMatrix: bool = false): bool{

		    var x1: float = this.x, y1: float = this.y, z1: float = this.z, w1: float = this.w;
		    var x2: float = q4fQuat.x, y2: float = q4fQuat.y, z2: float = q4fQuat.z, w2: float = q4fQuat.w;

		    var fLength1: float = sqrt(x1*x1 + y1*y1 + z1*z1 + w1*w1);
		    var fLength2: float = sqrt(x2*x2 + y2*y2 + z2*z2 + w2*w2);

		    if(abs(fLength2 - fLength2) > fEps){
		        return false;
		    }

		    var cosHalfTheta: float = (x1*x2 + y1*y2 + z1*z2 + w1*w2)/fLength1/fLength2;

		    if(asMatrix){
		        cosHalfTheta = abs(cosHalfTheta);
		    }

		    if(1. - cosHalfTheta > fEps){
		        return false;
		    }
		    return true;
		};

		getYaw(): float{
		    var fYaw: float;

		    var x: float = this.x, y: float = this.y, z: float = this.z, w: float = this.w;

		    var fx2: float = x*2.;
		    var fy2: float = y*2.;

		    if(abs(x) == abs(w)){
//вырожденный случай обрабатывается отдельно
//
		        var wTemp: float = w*sqrt(2.);
//cos(Yaw/2)*cos(Roll/2) + sin(Yaw/2)*sin(Roll/2) = cos((Yaw-Roll)/2); Roll = 0;
//x==-w
//cos(Yaw/2)*cos(Roll/2) - sin(Yaw/2)*sin(Roll/2) = cos((Yaw+Roll)/2); Roll = 0;
		        var yTemp: float = y*sqrt(2.);
//sin(Yaw/2)*cos(Roll/2) - cos(Yaw/2)*sin(Roll/2) = sin((Yaw-Roll)/2); Roll = 0;
//x==-w
//sin(Yaw/2)*cos(Roll/2) + cos(Yaw/2)*sin(Roll/2) = sin((Yaw+Roll)/2); Roll = 0;

		        fYaw = atan2(yTemp,wTemp)*2.;
//fRoll = 0;

//убираем дополнительный оборот
		        var pi: float = PI;
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

		getPitch(): float{
			var fPitch: float;

		    var x: float = this.x, y: float = this.y, z: float = this.z, w: float = this.w;

		    var fx2: float = x*2.;
		    var fy2: float = y*2.;

/*в очень редких случаях из-за ошибок округления получается результат > 1*/
		    var fSinPitch: float = clamp(fx2*w - fy2*z,-1.,1.);
		    fPitch = asin(fSinPitch)

		    return fPitch;
		};

		getRoll(): float{
		    var fRoll: float;

		    var x: float = this.x, y: float = this.y, z: float = this.z, w: float = this.w;

		    var fx2: float = x*2.;
		    var fz2: float = z*2.;

		    if(abs(x) == abs(w)){
//вырожденный случай обрабатывается отдельно
//
		        var wTemp: float = w*sqrt(2.);
//cos(Yaw/2)*cos(Roll/2) + sin(Yaw/2)*sin(Roll/2) = cos((Yaw-Roll)/2); Roll = 0;
//x==-w
//cos(Yaw/2)*cos(Roll/2) - sin(Yaw/2)*sin(Roll/2) = cos((Yaw+Roll)/2); Roll = 0;
		        var yTemp: float = y*sqrt(2.);
//sin(Yaw/2)*cos(Roll/2) - cos(Yaw/2)*sin(Roll/2) = sin((Yaw-Roll)/2); Roll = 0;
//x==-w
//sin(Yaw/2)*cos(Roll/2) + cos(Yaw/2)*sin(Roll/2) = sin((Yaw+Roll)/2); Roll = 0;

		        var fYaw: float = atan2(yTemp,wTemp)*2.;
		        fRoll = 0.;

//убираем дополнительный оборот
		        var pi: float = PI;
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

		    var fYaw: float, fPitch: float, fRoll: float;

		    var x: float = this.x, y: float = this.y, z: float = this.z, w: float = this.w;

		    var fx2: float = x*2.;
		    var fy2: float = y*2.;
		    var fz2: float = z*2.;
		    var fw2: float = w*2.;

/*в очень редких случаях из-за ошибок округления получается результат > 1*/
		    var fSinPitch: float = clamp(fx2*w - fy2*z,-1.,1.);
		    fPitch = asin(fSinPitch);
//не известен знак косинуса, как следствие это потребует дополнительной проверки.
//как показала практика - это не на что не влияет, просто один и тот же кватернион можно получить двумя разными вращениями

		    if(abs(x) == abs(w)){
//вырожденный случай обрабатывается отдельно
//
		        var wTemp: float = w*sqrt(2.);
//cos(Yaw/2)*cos(Roll/2) + sin(Yaw/2)*sin(Roll/2) = cos((Yaw-Roll)/2); Roll = 0;
//x==-w
//cos(Yaw/2)*cos(Roll/2) - sin(Yaw/2)*sin(Roll/2) = cos((Yaw+Roll)/2); Roll = 0;
		        var yTemp: float = y*sqrt(2.);
//sin(Yaw/2)*cos(Roll/2) - cos(Yaw/2)*sin(Roll/2) = sin((Yaw-Roll)/2); Roll = 0;
//x==-w
//sin(Yaw/2)*cos(Roll/2) + cos(Yaw/2)*sin(Roll/2) = sin((Yaw+Roll)/2); Roll = 0;

		        fYaw = atan2(yTemp,wTemp)*2.;
		        fRoll = 0.;

//убираем дополнительный оборот
		        var pi: float = PI;
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

		    var x: float = this.x, y: float = this.y, z: float = this.z, w: float = this.w;

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

		    var x: float = this.x, y: float = this.y, z: float = this.z, w: float = this.w;

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

		mix(q4fQuat: IQuat4, fA: float, q4fDestination?: IQuat4, bShortestPath: bool = true){
			if(!isDef(q4fDestination)){
		        q4fDestination = this;
		    }

		    fA = clamp(fA,0,1);

		    var x1: float = this.x, y1: float = this.y, z1: float = this.z, w1: float = this.w;
		    var x2: float = q4fQuat.x, y2: float = q4fQuat.y, z2: float = q4fQuat.z, w2: float = q4fQuat.w;

//скалярное произведение
		    var fCos: float = x1*x2 + y1*y2 + z1*z2 + w1*w2;

		    if(fCos < 0. && bShortestPath){
		        x2 = -x2;
		        y2 = -y2;
		        z2 = -z2;
		        w2 = -w2;
		    }

		    var k1: float = 1. - fA;
		    var k2: float = fA;

		    q4fDestination.x = x1*k1 + x2*k2;
		    q4fDestination.y = y1*k1 + y2*k2;
		    q4fDestination.z = z1*k1 + z2*k2;
		    q4fDestination.w = w1*k1 + w2*k2;

		    return q4fDestination;
		};

		smix(q4fQuat: IQuat4, fA: float, q4fDestination?: IQuat4, bShortestPath: bool = true){
			if(!isDef(q4fDestination)){
		        q4fDestination = this;
		    }

		    fA = clamp(fA,0,1);

		    var x1: float = this.x, y1: float = this.y, z1: float = this.z, w1: float = this.w;
		    var x2: float = q4fQuat.x, y2: float = q4fQuat.y, z2: float = q4fQuat.z, w2: float = q4fQuat.w;

//скалярное произведение
		    var fCos: float = x1*x2 + y1*y2 + z1*z2 + w1*w2;

		    if(fCos < 0 && bShortestPath){
		        fCos = -fCos;
		        x2 = -x2;
		        y2 = -y2;
		        z2 = -z2;
		        w2 = -w2;
		    }

		    var fEps: float = 1e-3;
		    if(abs(fCos) < 1. - fEps){
		        var fSin: float = sqrt(1. - fCos*fCos);
		        var fInvSin: float = 1./fSin;

		        var fAngle: float = atan2(fSin,fCos);

		        var k1: float = sin((1. - fA) * fAngle)*fInvSin;
		        var k2: float = sin(fA * fAngle)*fInvSin;

		        q4fDestination.x = x1*k1 + x2*k2;
		        q4fDestination.y = y1*k1 + y2*k2;
		        q4fDestination.z = z1*k1 + z2*k2;
		        q4fDestination.w = w1*k1 + w2*k2;
		    }
		    else{
//два кватерниона или очень близки (тогда можно делать линейную интерполяцию) 
//или два кватениона диаметрально противоположны, тогда можно интерполировать любым способом
//позже надо будет реализовать какой-нибудь, а пока тоже линейная интерполяция

		        var k1: float = 1 - fA;
		        var k2: float = fA;

		        var x: float = x1*k1 + x2*k2;
		        var y: float = y1*k1 + y2*k2;
		        var z: float = z1*k1 + z2*k2;
		        var w: float = w1*k1 + w2*k2;

// и нормализуем так-как мы сошли со сферы

		        var fLength: float = sqrt(x*x + y*y + z*z + w*w);
		        var fInvLen: float = fLength ? 1/fLength : 0;

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

		    var fForwardX: float = v3fForward.x, fForwardY: float = v3fForward.y, fForwardZ: float = v3fForward.z;
		    var fUpX: float = v3fUp.x, fUpY: float = v3fUp.y, fUpZ: float = v3fUp.z;

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

		static fromAxisAngle(v3fAxis: IVec3, fAngle: float, q4fDestination?: IQuat4): IQuat4{

			if(!isDef(q4fDestination)){
		        q4fDestination = new Quat4();
		    }

		    var x: float = v3fAxis.x, y: float = v3fAxis.y, z: float = v3fAxis.z;

		    var fLength: float = sqrt(x*x + y*y + z*z);

		    if(fLength === 0.){
		        q4fDestination.x = q4fDestination.y = q4fDestination.z = 0;
		        q4fDestination.w = 1;
		        return q4fDestination;
		    }

		    var fInvLength = 1/fLength;

		    x *= fInvLength;
		    y *= fInvLength;
		    z *= fInvLength;

		    var fSin: float = sin(fAngle/2);
		    var fCos: float = cos(fAngle/2);

		    q4fDestination.x = x * fSin;
		    q4fDestination.y = y * fSin;
		    q4fDestination.z = z * fSin;
		    q4fDestination.w = fCos;

		    return q4fDestination;
		};

		static fromYawPitchRoll(fYaw: float, fPitch: float, fRoll: float,q4fDestination?: IQuat4): IQuat4;
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

		    var fHalfYaw: float = fYaw * 0.5;
		    var fHalfPitch: float = fPitch * 0.5;
		    var fHalfRoll: float = fRoll * 0.5;

		    var fCos1: float = cos(fHalfYaw), fSin1: float = sin(fHalfYaw);
		    var fCos2: float = cos(fHalfPitch), fSin2: float = sin(fHalfPitch);
		    var fCos3: float = cos(fHalfRoll), fSin3: float = sin(fHalfRoll);

		    q4fDestination.x = fCos1 * fSin2 * fCos3 + fSin1 * fCos2 * fSin3;
		    q4fDestination.y = fSin1 * fCos2 * fCos3 - fCos1 * fSin2 * fSin3;
		    q4fDestination.z = fCos1 * fCos2 * fSin3 - fSin1 * fSin2 * fCos3;
		    q4fDestination.w = fCos1 * fCos2 * fCos3 + fSin1 * fSin2 * fSin3;

		    return q4fDestination;
		};

		static fromXYZ(fX: float, fY: float, fZ: float, q4fDestination?: IQuat4): IQuat4;
		static fromXYZ(v3fAngles: IVec3, q4fDestination?: IQuat4): IQuat4;
		static fromXYZ(fX?, fY?, fZ?, q4fDestination?) : IQuat4{
			if(arguments.length <= 2){
//Vec3 + m4fDestination
				var v3fVec: IVec3 = arguments[0];
				return Quat4.fromYawPitchRoll(v3fVec.y,v3fVec.x,v3fVec.z,arguments[1]);
			}
			else{
//fX fY fZ m4fDestination
				var fX: float = arguments[0];
				var fY: float = arguments[1];
				var fZ: float = arguments[2];

				return Quat4.fromYawPitchRoll(fY, fX, fZ, arguments[3]);
			}
		};

		static stackSize: uint = 100; static stackPosition: int = 0; static stack: IQuat4 [] = (function(): IQuat4 []{ var pStack: IQuat4 [] = new Array(Quat4.stackSize); for(var i:int = 0; i<Quat4.stackSize; i++){ pStack[i] = new Quat4(); } return pStack})();
    }
}



module akra.math {

//
// BASIC MATH AND UNIT CONVERSION CONSTANTS
//

	export var E: float 								= <float>Math.E;
	export var LN2: float 								= <float>Math.LN2;
	export var LOG2E: float 							= <float>Math.LOG2E;
	export var LOG10E: float 							= <float>Math.LOG10E;
	export var PI: float 								= <float>Math.PI;
	export var SQRT1_2: float 							= <float>Math.SQRT1_2;
	export var SQRT2: float 							= <float>Math.SQRT2;
	export var LN10: float 								= <float>Math.LN10;

	export var FLOAT_PRECISION: float					= <float>(3.4e-8);
	export var TWO_PI: float							= <float>(2.0*PI);
	export var HALF_PI: float							= <float>(PI/2.0);
	export var QUARTER_PI: float						= <float>(PI/4.0);
	export var EIGHTH_PI: float							= <float>(PI/8.0);
	export var PI_SQUARED: float						= <float>(9.86960440108935861883449099987615113531369940724079);
	export var PI_INVERSE: float						= <float>(0.31830988618379067153776752674502872406891929148091);
	export var PI_OVER_180: float						= <float>(PI/180);
	export var PI_DIV_180: float						= <float>(180/PI);
	export var NATURAL_LOGARITHM_BASE: float			= <float>(2.71828182845904523536028747135266249775724709369996);
	export var EULERS_CONSTANT: float					= <float>(0.57721566490153286060651);
	export var SQUARE_ROOT_2: float						= <float>(1.41421356237309504880168872420969807856967187537695);
	export var INVERSE_ROOT_2: float					= <float>(0.707106781186547524400844362105198);
	export var SQUARE_ROOT_3: float						= <float>(1.73205080756887729352744634150587236694280525381038);
	export var SQUARE_ROOT_5: float						= <float>(2.23606797749978969640917366873127623544061835961153);
	export var SQUARE_ROOT_10: float					= <float>(3.16227766016837933199889354443271853371955513932522);
	export var CUBE_ROOT_2: float						= <float>(1.25992104989487316476721060727822835057025146470151);
	export var CUBE_ROOT_3: float						= <float>(1.44224957030740838232163831078010958839186925349935);
	export var FOURTH_ROOT_2: float						= <float>(1.18920711500272106671749997056047591529297209246382);
	export var NATURAL_LOG_2: float						= <float>(0.69314718055994530941723212145817656807550013436026);
	export var NATURAL_LOG_3: float						= <float>(1.09861228866810969139524523692252570464749055782275);
	export var NATURAL_LOG_10: float					= <float>(2.30258509299404568401799145468436420760110148862877);
	export var NATURAL_LOG_PI: float					= <float>(1.14472988584940017414342735135305871164729481291531);
	export var BASE_TEN_LOG_PI: float					= <float>(0.49714987269413385435126828829089887365167832438044);
	export var NATURAL_LOGARITHM_BASE_INVERSE: float	= <float>(0.36787944117144232159552377016146086744581113103177);
	export var NATURAL_LOGARITHM_BASE_SQUARED: float	= <float>(7.38905609893065022723042746057500781318031557055185);
	export var GOLDEN_RATIO: float						= <float>((SQUARE_ROOT_5 + 1.0) / 2.0);
	export var DEGREE_RATIO: float						= <float>(PI_DIV_180);
	export var RADIAN_RATIO: float						= <float>(PI_OVER_180);
	export var GRAVITY_CONSTANT: float 					= 9.81;

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

	export var fpBits = (f: float): int => floor(f);

// reinterpret an int32 as a float
/** @inline */

	export var intBits = (i: int): float => <float> i;

// return 0 or -1 based on the sign of the float
/** @inline */

	export var fpSign = (f: int) => (f >> 31);

// extract the 8 bits of exponent as a signed integer
// by masking out this bits, shifting down by 23,
// and subtracting the bias value of 127
/** @inline */

	export var fpExponent = (f: float): int => (((fpBits(f) & 0x7fffffff) >> 23) - 127);

// return 0 or -1 based on the sign of the exponent
/** @inline */

	export var fpExponentSign = (f: float): int => (fpExponent(f) >> 31) ;

// get the 23 bits of mantissa without the implied bit
/** @inline */

	export var fpPureMantissa = (f: float): int => ((fpBits(f) & 0x7fffff));

// get the 23 bits of mantissa with the implied bit replaced
/** @inline */

	export var fpMantissa = (f: float): int => (fpPureMantissa(f) | (1 << 23));

	export var fpOneBits = 0x3F800000;

// flipSign is a helper Macro to
// invert the sign of i if flip equals -1, 
// if flip equals 0, it does nothing
//export var flipSign = (i, flip) ((i^ flip) - flip)
/** @inline */

	export var flipSign = (i: number, flip: number): int => ((flip == -1) ? -i : i);

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

	export var highestBitSet = (value: number): uint => value == 0 ? (null) : (value < 0 ? 31 : ((log(value) / LN2) << 0));
/**
	 * Номер с права начиная от нуля, самого правого установленного бита
	 * @inline
	 */

	export var lowestBitSet = (value: uint): uint => {
		var temp: uint;

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

	export var isPowerOfTwo = (value: uint): bool => (value > 0 && highestBitSet(value) == lowestBitSet(value));
/**
	 * Округление до числа наиболее близкого к степени двойки
	 * @inline
	 */

	export var nearestPowerOfTwo = (value: uint): uint => {
		if (value <= 1) {
        	return 1;
	    }

	    var highestBit: uint = highestBitSet(value);
	    var roundingTest: uint = value & (1 << (highestBit - 1));

	    if (roundingTest != 0) {
	        ++ highestBit;
	    }

	    return 1 << highestBit;
	}

/**
	 * Округление до следующего числа являющегося к степени двойки
	 * @inline
	 */

	export var ceilingPowerOfTwo = (value: uint): uint => {
		if (value <= 1) {
	        return 1;
	    }

	    var highestBit: int = highestBitSet(value);
	    var mask: int = value & ((1 << highestBit) - 1);
	    highestBit += mask && 1;
	    return 1 << highestBit;
	}
/**
	 * Округление до предыдущего числа являющегося к степени двойки
	 * @inline
	 */

	export var floorPowerOfTwo = (value: uint): uint => {
		if (value <= 1) {
        	return 1;
	    }

	    var highestBit: int = highestBitSet(value);

	    return 1 << highestBit;
	}

/**
	 * Деление по модулю
	 * @inline
	 */

	export var modulus = (e: int, divisor: int): int => (e - floor(e / divisor) * divisor);
/**
	 * 
	 * @inline
	 */

	export var mod = modulus;

/**
	 * Вырвнивание числа на alignment вверх
	 * @inline
	 */

	export var alignUp = (value: int, alignment: int): int => {
		var iRemainder: int = modulus(value, alignment);
	    if (iRemainder == 0) {
	        return(value);
	    }

	    return(value + (alignment - iRemainder));
	}


/**
	 * Вырвнивание числа на alignment вниз
	 * @inline
	 */

	export var alignDown = (value: int, alignment: int): int => {
		var remainder: int = modulus(value, alignment);
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

	export var log2 = (f: float): float => log(f) / LN2;
/**
	 * Округлени числа с определенной точностью, где округляется до значащих чисел как 1/(2^precision)
	 * @inline
	 */

	export var trimFloat = (f: float, precision: float): float => f;

/**
	 * Перевод дробного в целое с усеением
	 * @inline
	 */

	export var realToInt32_chop = (a: float): int => round(a);
/**
	 * Перевод дробного в целое до меньшего
	 * @inline
	 */

	export var realToInt32_floor = (a: float): int => floor(a);
/**
	 * Перевод дробного в целое до большего
	 * @inline
	 */

	export var realToInt32_ceil = (a: float): int => ceil(a);

/**
	 * Наибольший общий делитель
	 * @inline
	 */

	export var nod = (n: int, m: int): int => {
		var p: int = n % m;

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

	export var nok = (n: int, m: int): int => abs(n * m) / nod(n , m);
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

// function mat3 ();
// function mat3 (fValue: float);
// function mat3 (fValue?) {
// 	var pStorage: IMat3[] = Mat3.stack;
// 	var iIndex = Mat3.iIndex;
// 	var nMax = Mat3.nMax;
// }


	export var vec2 = vec2;
	export var vec3 = vec3;
	export var vec4 = vec4;
	export var quat4 = quat4;
	export var mat3 = mat3;
	export var mat4 = mat4;
}

module akra {
	export var Vec2 = math.Vec2;
	export var Vec3 = math.Vec3;
	export var Vec4 = math.Vec4;
	export var Mat2 = math.Mat2;
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















module akra {
	export interface IRect3d {
		x0: float;
		y0: float;
		z0: float;
		x1: float;
		y1: float;
		z1: float;
	}
}



module akra.geometry {
    export class Rect3d implements IRect3d{
    	x0: float;
		y0: float;
		z0: float;
		x1: float;
		y1: float;
		z1: float;

        constructor ();
        constructor (pRect3d: Rect3d);
        constructor (x0: float, y0:float, z0:float, x1:float, y1:float, z1:float);
		constructor (fXSize: float, fYSize: float, fZSize: float);
		constructor (pData: Float32Array);

		constructor (x0?, y0?, z0?, x1?, y1?, z1?) {

		}
    }
}






///<reference path="../../akra.ts" />

module akra.info.support {

}








module akra {
	export interface ICanvasInfo {
		width: int;
		height: int;
		id: string;
	}
}






module akra {
	export interface IURI {
		scheme: string;
		userinfo: string;
		host: string;
		port: uint;
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










module akra {
	export interface IBrowserInfo {
		name: string;
		version: string;
		os: string;
	}
}






module akra.util {
	export class Singleton {
		constructor () {
			var _constructor = (<any>this).constructor;

			assert(!isDef(_constructor._pInstance),
				'Singleton class may be created only one time.');

			_constructor._pInstance = this;
		}
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
			for (var i:int = 0; i < pDataBrowser.length; i++) {
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
			var iStartIndex:int = sData.indexOf(this.sVersionSearch);

			if (iStartIndex == -1) {
				return null;
			}

			iStartIndex = sData.indexOf('/', iStartIndex + 1);

			if (iStartIndex == -1) {
				return null;
			}

			var iEndIndex:int = sData.indexOf(' ', iStartIndex + 1);

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
		width: int;
		height: int;
		aspect: float;
		pixelDepth: int;
		colorDepth: int;
	}
}



module akra.util {
	export class ScreenInfo implements IScreenInfo {
		get width(): int {
			return screen.width;
		}

		get height(): int {
			return screen.height;
		}

		get aspect(): float {
			return screen.width / screen.height;
		}

		get pixelDepth(): int {
			return screen.pixelDepth;
		}

		get colorDepth(): int {
			return screen.colorDepth;
		}
	}
}










module akra {
	export interface IDeviceInfo {
		maxTextureSize: uint;
		maxCubeMapTextureSize: uint;
		maxViewPortSize: uint;

		maxTextureImageUnits: uint;
		maxVertexAttributes: uint;
		maxVertexTextureImageUnits: uint;
		maxCombinedTextureImageUnits: uint;

		stencilBits: uint;
		colorBits: uint[];
		alphaBits: uint;
		multisampleType: float;

		shaderVersion: float;

		getExtention(pDevice: WebGLRenderingContext, csExtension: string);
		checkFormat(pDevice: WebGLRenderingContext, eFormat: EImageFormats);
	}
}














module akra {
	export interface IReferenceCounter {
/**
		 * Текущее количесвто ссылок  на объект
		 **/

		referenceCount(): uint;

/** Предупреждает если объект еще используется */

		destructor(): void;


/**
		 * Добаволение ссылки  на объект, увеличивает внутренний счетчки на 1,
		 * проверяет не достигнуто ли максимальное количесвто
		 **/

		addRef(): uint;

/**
		 * Уведомление об удалении ссылки  на объект, уменьшает внутренний счетчки на 1,
		 * проверяет есть ли ее объекты
		 **/

		release(): uint;


/** 
		 * Данная функция нужна чтобы обеспечить наследникам ее возможность,
		 * само количестdо ссылок не копируется
		 */

		eq(pSrc: IReferenceCounter): IReferenceCounter;
	}
}



module akra {

	export interface IEngine {} ;
	export interface IResourceWatcherFunc {} ;
	export interface IResourceNotifyRoutineFunc {} ;
	export interface IResourceCode {} ;
	export interface IResourcePool {} ;
	export interface IResourcePoolManager {} ;

/**
     * Отражает состояние ресурса
     **/

    export enum EResourceItemEvents{
//ресур создан
		k_Created,
//ресур заполнен данным и готов к использованию
		k_Loaded,
//ресур в данный момент отключен для использования
		k_Disabled,
//ресур был изменен после загрузки		
		k_Altered,
		k_TotalResourceFlags
	};

	export interface IResourcePoolItem extends IReferenceCounter {
/** resource code */

		 resourceCode: IResourceCode;
/** resource pool */

		 resourcePool: IResourcePool;
/** resource handle */

		 resourceHandle: int;
/** resource flags */

		 resourceFlags: int;
/** Проверка был ли изменен ресур после загрузки */

		 alteredFlag: bool;

		 manager: IResourcePoolManager;


		/**@inline*/  getGuid(): int;
/** Get current Engine. */

		getEngine(): IEngine;

/** Инициализация ресурса, вызывается один раз. Виртуальная. */

		createResource(): bool;
/** Уничтожение ресурса. Виртуальная. */

		destroyResource(): bool;
/**  Удаление ресурса из энергозависимой памяти. Виртуальная. */

		disableResource(): bool;
/** Возвращение ресурса в энегрозависимю память. Виртуальная. */

		restoreResource(): bool;

/** Загрузка ресурса из файла, или null при использовании имени ресурса. Виртуальная. */

		loadResource(sFilename?: string): bool;
/** Сохранение ресурса в файл, или null при использовании имени ресурса. */

		saveResource(sFilename?: string): bool;

/** Добавление и удаление функции, которая будет вызываться при изменении состояния ресурса( fnFunc(iNewSost,iOldSost) ) */

		setChangesNotifyRoutine(fn: IResourceNotifyRoutineFunc): void;
		delChangesNotifyRoutine(fn: IResourceNotifyRoutineFunc): void;

		setStateWatcher(eEvent: EResourceItemEvents, fnWatcher: IResourceWatcherFunc): void;

/** sinchronize events with other resourse */

		connect(pResourceItem: IResourcePoolItem, eSignal: EResourceItemEvents, eSlot?: EResourceItemEvents): bool;
		disconnect(pResourceItem: IResourcePoolItem, eSignal: EResourceItemEvents, eSlot?: EResourceItemEvents): bool;

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

		notifyStateChange(eEvent: EResourceItemEvents, pTarget?: IResourcePoolItem);

/** Проверка создан ли ресурс */

		isResourceCreated(): bool;
/** Проверка загружен ли ресурс */

		isResourceLoaded(): bool;
/** Проверка активен ли ресурс */

		isResourceDisabled(): bool;
/** Проверка обновлен ли ресурс */

		isResourceAltered(): bool;

/** Установка состояния в изменен после загружки */

		setAlteredFlag(isOn?: bool): void;

/** Пиписывание ресурсу имени */

		setResourceName(sName: string);

/** Поиск имени ресурса */

		findResourceName(): string;

/** оповещение о уменьшении количесва ссылок на ресурс */

		release(): uint;

		setResourceCode(pCode: IResourceCode): void;
		setResourcePool(pPool: IResourcePool): void;
		setResourceHandle(iHandle: int): void;

		setResourceFlag(eFlagBit: EResourceItemEvents, isSetting: bool): void;
		setResourceFlag(iFlagBit: int, isSetting: bool): void;
	}

	export interface IResourcePoolItemType {
		new (pManager: IResourcePoolManager): IResourcePoolItem;
	}
}



module akra {
	 export enum EImageFormats {
        RGB = 0x1907,
        RGB8 = 0x1907,
        BGR8 = 0x8060,
        RGBA = 0x1908,
        RGBA8 = 0x1908,
        BGRA8 = 0x1909,
        RGBA4 = 0x8056,
        BGRA4 = 0x8059,
        RGB5_A1 = 0x8057,
        BGR5_A1 = 0x8058,
        RGB565 = 0x8D62,
        BGR565 = 0x8D63,
        RGB_DXT1 = 0x83F0,
        RGBA_DXT1 = 0x83F1,
        RGBA_DXT2 = 0x83F4,
        RGBA_DXT3 = 0x83F2,
        RGBA_DXT4 = 0x83F5,
        RGBA_DXT5 = 0x83F3,

        DEPTH_COMPONENT = 0x1902,
        ALPHA = 0x1906,
        LUMINANCE = 0x1909,
        LUMINANCE_ALPHA = 0x190A
    };

    export enum EImageShortFormats {
        RGB = 0x1907,
        RGBA = 0x1908
    };

    export enum EImageTypes {
        UNSIGNED_BYTE = 0x1401,
        UNSIGNED_SHORT_4_4_4_4 = 0x8033,
        UNSIGNED_SHORT_5_5_5_1 = 0x8034,
        UNSIGNED_SHORT_5_6_5 = 0x8363,
        FLOAT = 0x1406
    };

    export interface IImg extends IResourcePoolItem {

    }

}





module akra.util {
	export class DeviceInfo extends Singleton implements IDeviceInfo {
		private nMaxTextureSize: uint = 0;
		private nMaxCubeMapTextureSize: uint = 0;
		private nMaxViewPortSize: uint = 0;

		private nMaxTextureImageUnits: uint = 0;
		private nMaxVertexAttributes: uint = 0;
		private nMaxVertexTextureImageUnits: uint = 0;
		private nMaxCombinedTextureImageUnits: uint = 0;

		private nMaxColorAttachments: uint = 1;

		private nStencilBits: uint = 0;
		private pColorBits: uint[] = [0, 0, 0];
		private nAlphaBits: uint = 0;
		private fMultisampleType: float = 0.;

		private fShaderVersion: float = 0;

		get maxTextureSize(): uint { return this.nMaxTextureSize; }
		get maxCubeMapTextureSize(): uint { return this.nMaxCubeMapTextureSize; }
		get maxViewPortSize(): uint { return this.nMaxViewPortSize; }

 		get maxTextureImageUnits(): uint { return this.nMaxTextureImageUnits; }
		get maxVertexAttributes(): uint { return this.nMaxVertexAttributes; }
		get maxVertexTextureImageUnits(): uint { return this.nMaxVertexTextureImageUnits; }
		get maxCombinedTextureImageUnits(): uint { return this.nMaxCombinedTextureImageUnits; }

		get maxColorAttachments(): uint { return this.nMaxColorAttachments; }

		get stencilBits(): uint { return this.nStencilBits; }
		get colorBits(): uint[] { return this.pColorBits; }
		get alphaBits(): uint { return this.nAlphaBits; }
		get multisampleType(): float { return this.fMultisampleType; }

		get shaderVersion(): float { return this.fShaderVersion; }

		constructor () {
			super();

			var pDevice = createDevice();

			if (!pDevice) {
				return;
			}

			this.nMaxTextureSize = pDevice.getParameter(pDevice.MAX_TEXTURE_SIZE);
			this.nMaxCubeMapTextureSize = pDevice.getParameter(pDevice.MAX_CUBE_MAP_TEXTURE_SIZE);
			this.nMaxViewPortSize = pDevice.getParameter(pDevice.MAX_VIEWPORT_DIMS);

			this.nMaxTextureImageUnits = pDevice.getParameter(pDevice.MAX_TEXTURE_IMAGE_UNITS);
			this.nMaxVertexAttributes = pDevice.getParameter(pDevice.MAX_VERTEX_ATTRIBS);
			this.nMaxVertexTextureImageUnits = pDevice.getParameter(pDevice.MAX_VERTEX_TEXTURE_IMAGE_UNITS);
			this.nMaxCombinedTextureImageUnits = pDevice.getParameter(pDevice.MAX_COMBINED_TEXTURE_IMAGE_UNITS);

			this.nStencilBits = pDevice.getParameter(pDevice.STENCIL_BITS);
			this.pColorBits = [
                pDevice.getParameter(pDevice.RED_BITS),
                pDevice.getParameter(pDevice.GREEN_BITS),
                pDevice.getParameter(pDevice.BLUE_BITS)
            ];

            this.nAlphaBits = pDevice.getParameter(pDevice.ALPHA_BITS);
            this.fMultisampleType = pDevice.getParameter(pDevice.SAMPLE_COVERAGE_VALUE);
		}


		getExtention(pDevice: WebGLRenderingContext, csExtension: string): any {
			var pExtentions: string[];
			var sExtention: string;
			var pExtention: any = null;

	        pExtentions = pDevice.getSupportedExtensions();

	        for (var i in pExtentions) {
	            sExtention = pExtentions[i];
	            if (sExtention.search(csExtension) != -1) {
	                pExtention = pDevice.getExtension(sExtention);

	                trace('extension successfuly loaded: ' + sExtention);
	            }
	        }

	        return pExtention;
		}

		checkFormat(pDevice: WebGLRenderingContext, eFormat: EImageFormats) {
	        switch (eFormat) {
	            case EImageFormats.RGB_DXT1:
	            case EImageFormats.RGBA_DXT1:
	            case EImageFormats.RGBA_DXT2:
	            case EImageFormats.RGBA_DXT3:
	            case EImageFormats.RGBA_DXT4:
	            case EImageFormats.RGBA_DXT5:
	                for (var i in pDevice) {
	                    if (isNumber(pDevice[i]) && pDevice[i] == eFormat) {
	                        return true;
	                    }
	                }
	                return false;
	            case EImageFormats.RGB8:
	            case EImageFormats.RGBA8:
	            case EImageFormats.RGBA4:
	            case EImageFormats.RGB5_A1:
	            case EImageFormats.RGB565:
	                return true;
	            default:
	                return false;
	        }
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
	export var device: IDeviceInfo = new util.DeviceInfo;
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
			var nPos: uint = sBasename.lastIndexOf(".");

	        if (nPos < 0) {
	            this._sFilename = sBasename.substr(0);
	            this._sExtension = null;
	        }
	        else {
	            this._sFilename = sBasename.substr(0, nPos);
	            this._sExtension = sBasename.substr(nPos + 1);
	        }
		}

		constructor(sPath: string);
		constructor(pPath: IPathinfo);
		constructor(pPath?: any) {
			if (isDef(pPath)) {
				this.set(pPath);
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
		        error("Unexpected data type was used.");
		    }
		}

		isAbsolute(): bool { return this._sDirname[0] === "/"; }

		toString(): string { return null; }
	}

}









module akra.util {
	export class URI implements IURI {
		private sScheme: string = null;
		private sUserinfo: string = null;
		private sHost: string = null;
		private nPort: uint = 0;
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

		/**@inline*/  get port(): uint {
			return this.nPort;
		}

		/**@inline*/  set port(iPort: uint) {
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

				debug_assert(pUri !== null, 'Invalid URI format used.\nused uri: ' + pData);

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

			debug_error('Unexpected data type was used.');

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










module akra.util {
	export class ReferenceCounter implements IReferenceCounter {
		private nReferenceCount: uint = 0;

/** Выстанавливает чило ссылок  на объект в ноль */

		constructor ();
/** 
		 * Выстанавливает чило ссылок  на объект в ноль
 		 * количесвто ссылок привязаны к конкретному экземпляру, поэтому никогда не копируются 
 		 */

		constructor (pSrc: IReferenceCounter);
		constructor (pSrc?) {}

/** @inline */

		referenceCount(): uint {
			return this.nReferenceCount;
		}

/** @inline */

		destructor(): void {
			assert(this.nReferenceCount === 0, 'object is used');
		}

		release(): uint {
			assert(this.nReferenceCount > 0, 'object is used');
		    this.nReferenceCount--;
		    return this.nReferenceCount;
		}

		addRef(): uint {
			assert(this.nReferenceCount != MIN_INT32, 'reference fail');

    		this.nReferenceCount ++;

			return this.nReferenceCount;
		}

/** @inline */

		eq (pSrc: IReferenceCounter): IReferenceCounter {
		    return this;
		};
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
		        debug_print('transferable objects not supported in your browser...');
		    }

		    pWorker.terminate();

		    if (pBuffer.byteLength) {
		        return false
		    }

		    return true;
		}
	}
}















module akra {
	export enum EUtilTimerCommands {
//! <to reset the timer
		TIMER_RESET,
//! <to start the timer
		TIMER_START,
//! <to stop (or pause) the timer
		TIMER_STOP,
//! <to advance the timer by 0.1 seconds
		TIMER_ADVANCE,
//! <to get the absolute system time
		TIMER_GET_ABSOLUTE_TIME,
//! <to get the current time
		TIMER_GET_APP_TIME,
		TIMER_GET_ELAPSED_TIME
//! to get the time that elapsed between TIMER_GETELAPSEDTIME calls
	}

    export interface IUtilTimer {
        absoluteTime: float;
        appTime: float;
        elapsedTime: float;

        start(): bool;
        stop(): bool;
        reset(): bool;
        execCommand(e: EUtilTimerCommands): float;

//static start(): IUtilTimer;
    }
}



module akra.util {

	export class UtilTimer implements IUtilTimer {
		private isTimerInitialized: bool = false;
		private isTimerStopped: bool = false;
		private fTicksPerSec: float = 0.;
		private iStopTime: int = 0;
		private iLastElapsedTime: int = 0;
		private iBaseTime: int = 0;

		get absoluteTime(): float {
			return this.execCommand(EUtilTimerCommands.TIMER_GET_ABSOLUTE_TIME);
		}

		get appTime(): float {
			return this.execCommand(EUtilTimerCommands.TIMER_GET_APP_TIME);
		}

		get elapsedTime(): float {
			return this.execCommand(EUtilTimerCommands.TIMER_GET_ELAPSED_TIME);
		}

		start(): bool {
			return this.execCommand(EUtilTimerCommands.TIMER_START) === 0;
		}
        stop(): bool {
        	return this.execCommand(EUtilTimerCommands.TIMER_STOP) === 0;
        }

        reset(): bool {
        	return this.execCommand(EUtilTimerCommands.TIMER_RESET) === 0;
        }

        execCommand(eCommand: EUtilTimerCommands): float {
		    var fTime: float = 0.;
		    var fElapsedTime: float = 0.;
		    var iTime: int;

		    if (this.isTimerInitialized == false) {
		        this.isTimerInitialized = true;
		        this.fTicksPerSec = 1000;
		    }

// Get either the current time or the stop time, depending
// on whether we're stopped and what command was sent
		    if (this.iStopTime != 0 && eCommand != EUtilTimerCommands.TIMER_START &&
		    	eCommand != EUtilTimerCommands.TIMER_GET_ABSOLUTE_TIME) {
		        iTime = this.iStopTime;
		    }
		    else {
		        iTime = (new Date()).getTime();
		    }

// Return the elapsed time
		    if (eCommand == EUtilTimerCommands.TIMER_GET_ELAPSED_TIME) {
		        fElapsedTime = (iTime - this.iLastElapsedTime) / this.fTicksPerSec;
		        this.iLastElapsedTime = iTime;
		        return fElapsedTime;
		    }

// Return the current time
		    if (eCommand == EUtilTimerCommands.TIMER_GET_APP_TIME) {
		        var fAppTime = ( iTime - this.iBaseTime ) / this.fTicksPerSec;
		        return fAppTime;
		    }

// Reset the timer
		    if (eCommand == EUtilTimerCommands.TIMER_RESET) {
		        this.iBaseTime = iTime;
		        this.iLastElapsedTime = iTime;
		        this.iStopTime = 0;
		        this.isTimerStopped = false;
		        return 0;
		    }

// Start the timer
		    if (eCommand == EUtilTimerCommands.TIMER_START) {
		        if (this.isTimerStopped) {
		            this.iBaseTime += iTime - this.iStopTime;
		        }
		        this.iStopTime = 0;
		        this.iLastElapsedTime = iTime;
		        this.isTimerStopped = false;
		        return 0;
		    }

// Stop the timer
		    if (eCommand == EUtilTimerCommands.TIMER_STOP) {
		        if (!this.isTimerStopped) {
		            this.iStopTime = iTime;
		            this.iLastElapsedTime = iTime;
		            this.isTimerStopped = true;
		        }
		        return 0;
		    }

// Advance the timer by 1/10th second
		    if (eCommand == EUtilTimerCommands.TIMER_ADVANCE) {
		        this.iStopTime += this.fTicksPerSec / 10;
		        return 0;
		    }

		    if (eCommand == EUtilTimerCommands.TIMER_GET_ABSOLUTE_TIME) {
		        fTime = iTime / this.fTicksPerSec;
		        return  fTime;
		    }

// Invalid command specified		    return -1;
        }

        static start(): UtilTimer {
        	var pTimer: UtilTimer = new UtilTimer;

        	if (pTimer.start()) {
        		return pTimer;
        	}

        	debug_error('cannot start util timer');

        	return null;
        }
	}
}











module akra {

	export interface IExplorerFunc {} ;
	export interface IReferenceCounter {} ;

	export interface IEntity extends IReferenceCounter {
		name: string;

		parent: IEntity;
		sibling: IEntity;
		child: IEntity;

		 depth: int;
		 root: IEntity;

		create(): bool;
		destroy(): void;

		findEntity(sName: string): IEntity;
		explore(fn: IExplorerFunc): void;
		childOf(pParent: IEntity): bool;
		siblingCount(): uint;
		childCount(): uint;

		update(): void;
		recursiveUpdate(): void;
		recursivePreUpdate(): void;
		prepareForUpdate(): void;

		hasParent(): bool;
		hasChild(): bool;
		hasSibling(): bool;

		isASibling(pSibling: IEntity): bool;
		isAChild(pChild: IEntity): bool;
		isInFamily(pEntity: IEntity, bSearchEntireTree?: bool): bool;


		addSibling(pSibling: IEntity): IEntity;
		addChild(pChild: IEntity): IEntity;
		removeChild(pChild: IEntity): IEntity;
		removeAllChildren(): void;

		attachToParent(pParent: IEntity): bool;
		detachFromParent(): bool;

		promoteChildren(): void;
		relocateChildren(pParent: IEntity): void;

		toString(isRecursive?: bool, iDepth?: int): string;
	}

}






module akra {

	export interface IEntity {} ;

	export interface IExplorerFunc {
		(pEntity: IEntity): bool;
	}
}



module akra.util {
	export class Entity extends ReferenceCounter implements IEntity {
		 _sName: string = null;
		 _pParent: IEntity = null;
		 _pSibling: IEntity = null;
		 _pChild: IEntity = null;

		/**@inline*/  get name(): string { return this._sName; }
		/**@inline*/  set name(sName: string) { this._sName = sName; }

		/**@inline*/  get parent(): IEntity { return this._pParent; }
		/**@inline*/  set parent(pParent: IEntity) { this.attachToParent(pParent); }

		/**@inline*/  get sibling(): IEntity { return this._pSibling; }
		/**@inline*/  set sibling(pSibling: IEntity) { this._pSibling = pSibling; }

		/**@inline*/  get child(): IEntity { return this._pChild; }
		/**@inline*/  set child(pChild: IEntity) { this._pChild = pChild; }

		get depth(): int {
			var iDepth: int = -1;
	        for (var pEntity: IEntity = this; pEntity; pEntity = pEntity.parent, ++ iDepth){};
	        return iDepth;
		}

		get root(): IEntity {
	        for (var pEntity: IEntity = this, iDepth: int = -1; pEntity.parent; pEntity = pEntity.parent, ++ iDepth){};
	        return pEntity;
		}


		create(): bool {
			return true;
		}

		destroy(): void {
// destroy anything attached to this node
//	destroySceneObject();
// promote any children up to our parent
		    this.promoteChildren();
// now remove ourselves from our parent
		    this.detachFromParent();
// we should now be removed from the tree, and have no dependants
		    debug_assert(this.referenceCount() == 0, "Attempting to delete a scene node which is still in use");
		    debug_assert(this._pSibling == null, "Failure Destroying Node");
		    debug_assert(this._pChild == null, "Failure Destroying Node");
		}

		findEntity(sName: string): IEntity {
			 var pEntity: IEntity = null;

		    if (this._sName === sName) {
		        return this;
		    }

		    if (this._pSibling) {
		        pEntity = this._pSibling.findEntity(sName);
		    }

		    if (pEntity == null && this._pChild) {
		        pEntity = this._pChild.findEntity(sName);
		    }

		    return pEntity;
		}

		explore(fn: IExplorerFunc): void {
			if (fn(this) === false) {
		        return;
		    }

		    if (this._pSibling) {
		        this._pSibling.explore(fn);
		    }

		    if (this._pChild) {
		        this._pChild.explore(fn);
		    }
		}


		childOf(pParent: IEntity): bool {
			for (var pEntity: IEntity = this; pEntity; pEntity = pEntity.parent) {
		        if (pEntity.parent === pParent) {
		            return true;
		        }
		    }

		    return false;
		}


/**
		 * Returns the current number of siblings of this object.
		 */

		siblingCount(): uint {
			var iCount: uint = 0;

		    if (this._pParent) {
		        var pNextSibling = this._pParent.child;
		        if (pNextSibling) {
		            while (pNextSibling) {
		                pNextSibling = pNextSibling.sibling;
		                ++ iCount;
		            }
		        }
		    }

		    return iCount;
		}


/**
		 * Returns the current number of children of this object
		 */

		childCount(): uint {
			var iCount: uint = 0;

		    var pNextChild: IEntity = this.child;

		    if (pNextChild) {
		        ++ iCount;
		        while (pNextChild) {
		            pNextChild = pNextChild.sibling;
		            ++ iCount;
		        }
		    }
		    return iCount;
		}


		update(): void {}


		recursiveUpdate(): void {
// update myself
		    this.update();
// update my sibling
		    if (this._pSibling) {
		        this._pSibling.recursiveUpdate();
		    }
// update my child
		    if (this._pChild) {
		        this._pChild.recursiveUpdate();
		    }
		}

		recursivePreUpdate(): void {
// clear the flags from the previous update
		    this.prepareForUpdate();

// update my sibling
		    if (this._pSibling) {
		        this._pSibling.recursivePreUpdate();
		    }
// update my child
		    if (this._pChild) {
		        this._pChild.recursivePreUpdate();
		    }
		}


		prepareForUpdate(): void {};

/** Parent is not undef */

		/**@inline*/  hasParent(): bool {
		    return isDefAndNotNull(this._pParent);
		}

/** Child is not undef*/

		/**@inline*/  hasChild(): bool {
		    return isDefAndNotNull(this._pChild);
		}

/** Sibling is not undef */

		/**@inline*/  hasSibling(): bool {
			return isDefAndNotNull(this._pSibling);
		}

/**
		 * Checks to see if the provided item is a sibling of this object
		 */

		isASibling(pSibling: IEntity): bool {
			if (!pSibling) {
		        return false;
		    }
// if the sibling we are looking for is me, or my FirstSibling, return true
		    if (this == pSibling || this._pSibling == pSibling) {
		        return true;
		    }
// if we have a sibling, continue searching
		    if (this._pSibling) {
		        return this._pSibling.isASibling(pSibling);
		    }
// it's not us, and we have no sibling to check. This is not a sibling of ours.
		    return false;
		}

/** Checks to see if the provided item is a child of this object. (one branch depth only) */

		isAChild(pChild: IEntity): bool {
			if (!pChild) {
		        return (false);
		    }
// if the sibling we are looking for is my FirstChild return true
		    if (this._pChild == pChild) {
		        return (true);
		    }
// if we have a child, continue searching
		    if (this._pChild) {
		        return (this._pChild.isASibling(pChild));
		    }
// it's not us, and we have no child to check. This is not a sibling of ours.
		    return (false);
		}

/**
		 * Checks to see if the provided item is a child or sibling of this object. If SearchEntireTree
		 * is TRUE, the check is done recursivly through all siblings and children. SearchEntireTree
		 * is FALSE by default.
		 */

		isInFamily(pEntity: IEntity, bSearchEntireTree?: bool): bool {
			if (!pEntity) {
		        return (false);
		    }
// if the model we are looking for is me or my immediate family, return true
		    if (this == pEntity || this._pChild == pEntity || this._pSibling == pEntity) {
		        return (true);
		    }
// if not set to seach entire tree, just check my siblings and kids
		    if (!bSearchEntireTree) {
		        if (this.isASibling(pEntity)) {
		            return (true);
		        }
		        if (this._pChild && this._pChild.isASibling(pEntity)) {
		            return (true);
		        }
		    }
// seach entire Tree!!!
		    else {
		        if (this._pSibling && this._pSibling.isInFamily(pEntity, bSearchEntireTree)) {
		            return (true);
		        }

		        if (this._pChild && this._pChild.isInFamily(pEntity, bSearchEntireTree)) {
		            return (true);
		        }
		    }

		    return (false);
		}

/**
		 * Adds the provided ModelSpace object to the descendant list of this object. The provided
		 * ModelSpace object is removed from any parent it may already belong to.
		 */

		addSibling(pSibling: IEntity): IEntity {
			if (pSibling) {
// replace objects current sibling pointer with this new one
		        pSibling.sibling = this._pSibling;
		        this.sibling = pSibling;
		    }

		    return pSibling;
		}

/**
		 * Adds the provided ModelSpace object to the descendant list of this object. The provided
		 * ModelSpace object is removed from any parent it may already belong to.
		 */

		addChild(pChild: IEntity): IEntity {
			if (pChild) {
// Replace the new child's sibling pointer with our old first child.
		        pChild.sibling = this._pChild;
// the new child becomes our first child pointer.
		        this._pChild = pChild;
    		}

    		return pChild;
		}

/**
		 * Removes a specified child object from this parent object. If the child is not the
		 * FirstChild of this object, all of the Children are searched to find the object to remove.
		 */

		removeChild(pChild: IEntity): IEntity {
			if (this._pChild && pChild) {
		        if (this._pChild == pChild) {
		            this._pChild = pChild.sibling;
		            pChild.sibling  = null;
		        }
		        else {
		            var pTempNode: IEntity = this._pChild;
// keep searching until we find the node who's sibling is our target
// or we reach the end of the sibling chain
		            while (pTempNode && (pTempNode.sibling != pChild)) {
		                pTempNode = pTempNode.sibling;
		            }
// if we found the proper item, set it's FirstSibling to be the FirstSibling of the child
// we are removing
		            if (pTempNode) {
		                pTempNode.sibling = pChild.sibling;
		                pChild.sibling = null;
		            }
		        }
	    	}

	    	return pChild;
		}

/** Removes all Children from this parent object */

		removeAllChildren(): void {
// keep removing children until end of chain is reached
		    while (!isNull(this._pChild)) {
		        var pNextSibling = this._pChild.sibling;
		        this._pChild.detachFromParent();
		        this._pChild = pNextSibling;
		    }
		}

/** Attaches this object ot a new parent. Same as calling the parent's addChild() routine. */

		attachToParent(pParent: IEntity): bool {
			if (pParent != this._pParent) {

		        this.detachFromParent();

		        if (pParent) {
		            this._pParent = pParent;
		            this._pParent.addChild(this);
		            this._pParent.addRef();
		            return true;
		        }
	    	}

	    	return false;
		}

		detachFromParent(): bool {
// tell our current parent to release us
		    if (this._pParent) {
		        this._pParent.removeChild(this);
//TODO: разобраться что за херня!!!!
		        if (this._pParent) {
		            this._pParent.release();
		        }

		        this._pParent = null;
// my world matrix is now my local matrix

		        return true;
		    }

		    return false;
		}

/**
		 * Attaches this object's children to it's parent, promoting them up the tree
		 */

		promoteChildren(): void {
// Do I have any children to promote?
		    while (!isNull(this._pChild)) {
		        var pNextSibling: IEntity = this._pChild.sibling;
		        this._pChild.attachToParent(this._pParent);
		        this._pChild = pNextSibling;
		    }
		}

		relocateChildren(pParent: IEntity): void {
			if (pParent != this) {
// Do I have any children to relocate?
		        while (!isNull(this._pChild)) {
		            var pNextSibling: IEntity = this._pChild.sibling;
		            this._pChild.attachToParent(pParent);
		            this._pChild = pNextSibling;
		        }
		    }
		}

		toString(isRecursive: bool = false, iDepth: int = 0): string {

		    if (!isRecursive) {
		        return '<entity' + (this._sName? ' ' + this._sName: "") + '>';
		    }

		    var pSibling: IEntity = this.sibling;
		    var pChild: IEntity = this.child;
		    var s: string = "";

		    for (var i = 0; i < iDepth; ++ i) {
		        s += ':  ';
		    }

		    s += '+----[depth: ' + this.depth + ']' + this.toString() + '\n';

		    if (pChild) {
		        s += pChild.toString(true, iDepth + 1);
		    }

		    if (pSibling) {
		        s += pSibling.toString(true, iDepth);
		    }

		    return s;


		}

	}
}




//#include "ThreadManager.ts"

module akra.util {

	export var uri = (sUri:string): IURI => new util.URI(sUri);

//export var pathinfo: (sPath: string) => IPathinfo;
//export var pathinfo: (pPath: IPathinfo) => IPathinfo;
	export var pathinfo: (pPath?) => IPathinfo;

	pathinfo = function (pPath?): IPathinfo {
		return new Pathinfo(<string>pPath);
	}


}












module akra {
	export interface IKeyMap {

	}
}



module akra.controls {
	export class KeyMap implements IKeyMap {

	}
}










module akra {
    export interface IGamepadMap {

    }
}



module akra.controls {
	export class GamepadMap implements IGamepadMap {

	}
}











module akra {
	export enum FontStyle {
		ITALIC,
		BOLD
	};

	export interface IFont2d {
		size: uint;
		htmlSize: string;
		color: uint;
		htmlColor: string;
		family: string;
		bold: bool;
		italic: bool;
	}
}



module akra.gui {
	export class Font2d implements IFont2d {
		private iColor: uint;
		private nSize: uint;
		private iStyle: int;
		private sFamily: string;

		constructor (nSize: uint = 12, iColor: uint = 0xFFFFFF, iStyle: int = 0, sFontFamily: string = "monospace") {
			this.nSize = nSize;
			this.iColor = iColor;
			this.iStyle = iStyle;
		}

/** @inline */

		get size(): uint { return this.nSize; }
/** @inline */

		set size(nSize: uint) { this.nSize = nSize; }

/** @inline */

		get color(): uint { return this.iColor; }
/** @inline */

		set color(iColor: uint) { this.iColor = iColor; }

/** @inline */

		get family(): string { return this.sFamily; }
/** @inline */

		set family(sFamily: string) { this.sFamily = sFamily; }

/** @inline */

		get bold(): bool { return bf.testBit(this.iStyle, <number>FontStyle.BOLD); }
/** @inline */

		set bold(bValue: bool) { this.iStyle = bf.setBit(this.iStyle, <number>FontStyle.BOLD, bValue); }

/** @inline */

		get italic(): bool { return bf.testBit(this.iStyle, <number>FontStyle.BOLD); }
/** @inline */

		set italic(bValue: bool) { this.iStyle = bf.setBit(this.iStyle, <number>FontStyle.ITALIC, bValue); }

/** @inline */

		get htmlColor(): string {
			return "#" + Number(this.iColor).toString(16);
		}

/** @inline */

		get htmlSize(): string {
			return String(this.size) + "px";
		}
	}
}










module akra {
	export interface IString2d {
		x: int;
		y: int;
//font: IFont2d;


		hide(): void;
		show(isVisible?: bool): void;

		append(s: string, pFont?: IFont2d): void;
		clear(): void;
		edit(s: string): void;

		toString(): string;
	}
}





module akra.gui {
	export class String2d implements IString2d {
		private pSpan: HTMLSpanElement = null;
		private pLastSpan: HTMLSpanElement = null;
		private pFont: IFont2d;

		get x(): int { return parseInt(this.pSpan.style.left); }
		get y(): int { return parseInt(this.pSpan.style.top); }
//font: IFont2d;

		constructor (iX: int = 0, iY: int = 0, sStr: string = "", pParent: HTMLElement = document.body, pFont: IFont2d = new gui.Font2d()) {
			var pSpan: HTMLSpanElement = <HTMLSpanElement>document.createElement("span");
			var pStyle: CSSStyleDeclaration = pSpan.style;

			pStyle.position = "absolute";
		    pStyle.left = String(iX) + 'px';
		    pStyle.top = String(iY) + 'px';

		    this.addSpan(sStr, pFont, pSpan);

    		pParent.appendChild(pSpan);

    		this.pSpan = pSpan;
    		this.pLastSpan = pSpan;
		}

		hide(): void {
			this.show(false);
		}

		show(isVisible: bool = true): void {
			this.pSpan.style.visibility = isVisible? "visible": "hidden";
		}

		append(sStr: string, pFont?: IFont2d): void {
			if (isDef(pFont)) {
		        var pStyle: CSSStyleDeclaration = this.pLastSpan.style;

		        if (pStyle.fontSize != pFont.htmlSize ||
		            pStyle.color != pFont.htmlColor ||
		            pStyle.fontFamily != pFont.family ||
		            pStyle.fontWeight != (pFont.bold? "bold": "") ||
		            pStyle.fontStyle != (pFont.italic? "italic": "")) {

		            this.addSpan(sStr, pFont);
		        }
		        else {
		            this.pLastSpan.innerHTML += sStr;
		        }
		    }
		    else {
		        this.pLastSpan.innerHTML += sStr;
		    }
		}

		clear(): void {
			this.pSpan.innerHTML = null;
    		this.pLastSpan = this.pSpan;
		}

		edit(sStr: string): void {
			this.pSpan.innerHTML = sStr;
			this.pLastSpan = this.pSpan;
		}

		toString(): string {
			return this.pSpan.innerHTML;
		}

		private addSpan(sStr: string, pFont: IFont2d, pSpan: HTMLSpanElement = <HTMLSpanElement>document.createElement('span')): void {
			var pStyle: CSSStyleDeclaration = pSpan.style;

		    pStyle.fontSize = pFont.htmlSize;
		    pStyle.color = pFont.htmlColor;
		    pStyle.fontFamily = pFont.family;
		    pStyle.fontWeight = (pFont.bold? "bold": "");
		    pStyle.fontStyle = (pFont.italic? "italic": "");

		    (<any>pStyle).webkitUserSelect = "none";
    		(<any>pStyle).mozUserSelect = "none";

		    pSpan.innerHTML = sStr;

		    if (this.pSpan) {
			    this.pSpan.appendChild(pSpan);
			    this.pLastSpan = pSpan;
		    }
		}
	}
}







module akra.util {

}

module akra {

}











module akra {

	export interface IVertexElement {} ;

	export var DeclarationUsages = {
		POSITION 	: "POSITION",
	    POSITION1	: "POSITION1",
	    POSITION2	: "POSITION2",
	    POSITION3	: "POSITION3",

	    BLENDWEIGHT	: "BLENDWEIGHT",
	    BLENDINDICES: "BLENDINDICES",
	    BLENDMETA	: "BLENDMETA",

	    NORMAL 		: "NORMAL",
	    NORMAL1		: "NORMAL1",
	    NORMAL2		: "NORMAL2",
	    NORMAL3		: "NORMAL3",

	    PSIZE		: "PSIZE",

	    TEXCOORD 	: "TEXCOORD",
	    TEXCOORD1	: "TEXCOORD1",
	    TEXCOORD2	: "TEXCOORD2",
	    TEXCOORD3	: "TEXCOORD3",
	    TEXCOORD4	: "TEXCOORD4",
	    TEXCOORD5	: "TEXCOORD5",

	    TANGENT		: "TANGENT",
	    BINORMAL 	: "BINORMAL",

	    TESSFACTOR	: "TESSFACTOR",
	    COLOR 		: "COLOR",
	    FOG 		: "FOG",
	    DEPTH 		: "DEPTH",
	    SAMPLE 		: "SAMPLE",

	    INDEX 		: "INDEX",
		INDEX0 		: "INDEX0",
	    INDEX1 		: "INDEX1",
	    INDEX2 		: "INDEX2",
	    INDEX3 		: "INDEX3",
//system indices starts from 10	    INDEX10 	: "INDEX10",
	    INDEX11 	: "INDEX11",
	    INDEX12 	: "INDEX12",
	    INDEX13 	: "INDEX13",

	    MATERIAL 	: "MATERIAL",
	    MATERIAL1 	: "MATERIAL1",
	    MATERIAL2 	: "MATERIAL2",

	    DIFFUSE		: "DIFFUSE",
	    AMBIENT 	: "AMBIENT",
	    SPECULAR 	: "SPECULAR",
	    EMISSIVE 	: "EMISSIVE",
	    SHININESS 	: "SHININESS",
	    UNKNOWN 	: "UNKNOWN",
	    END 		: "\a\n\r"
	};

	export var DeclUsages = DeclarationUsages;

	export interface IVertexDeclaration {
		stride: uint;
		length: uint;


//[index: number]: IVertexElement;

		append(...pElement: IVertexElement[]): bool;
		append(pElements: IVertexElement[]): bool;

		extend(pDecl: IVertexDeclaration): bool;

		hasSemantics(sSemantics: string): bool;
		findElement(sSemantics: string, iCount?: uint): IVertexElement;
		clone(): IVertexDeclaration;



///DEBUG!!!
		toString(): string;
	}



	export function VE_CUSTOM(sUsage: string, eType: EDataTypes = EDataTypes.FLOAT, iCount: uint = 1, iOffset?: uint) {
		return {count: iCount, type: eType, usage: sUsage, offset: iOffset};
	}

	export function VE_FLOAT(sName: string, iOffset?: uint) { return VE_CUSTOM(sName, EDataTypes.FLOAT, 1, iOffset); };
	export function VE_FLOAT2(sName: string, iOffset: uint = 2) { return VE_CUSTOM(sName, EDataTypes.FLOAT, 2, iOffset); };
	export function VE_FLOAT3(sName: string, iOffset: uint = 3) { return VE_CUSTOM(sName, EDataTypes.FLOAT, 3, iOffset); };
	export function VE_FLOAT4(sName: string, iOffset: uint = 4) { return VE_CUSTOM(sName, EDataTypes.FLOAT, 4, iOffset); };
	export function VE_FLOAT4x4(sName: string, iOffset: uint = 16) { return VE_CUSTOM(sName, EDataTypes.FLOAT, 16, iOffset); };
	export function VE_VEC2(sName: string, iOffset: uint = 2) { return VE_CUSTOM(sName, EDataTypes.FLOAT, 2, iOffset); };
	export function VE_VEC3(sName: string, iOffset: uint = 3) { return VE_CUSTOM(sName, EDataTypes.FLOAT, 3, iOffset); };
	export function VE_VEC4(sName: string, iOffset: uint = 4) { return VE_CUSTOM(sName, EDataTypes.FLOAT, 4, iOffset); };
	export function VE_MAT4(sName: string, iOffset: uint = 16) { return VE_CUSTOM(sName, EDataTypes.FLOAT, 16, iOffset); };
	export function VE_INT(sName: string, iOffset: uint) { return VE_CUSTOM(sName, EDataTypes.INT, 1, iOffset);};

	export function VE_END(iOffset: uint = 0) { return VE_CUSTOM(DeclUsages.END, EDataTypes.UNSIGNED_BYTE, 0, iOffset); };

	export var createVertexDeclaration: (pData?) => IVertexDeclaration;
}



module akra.util {
	export class VertexDeclaration implements IVertexDeclaration {
		stride: uint = 0;
		length: uint;

//FIXME: typescript error "Overload signature is not compatible with function definition" ???
//constructor (...pElement: IVertexElement[]) 
		constructor (pElements: IVertexElement[]) {
			if (arguments.length) {
				if (arguments.length > 1) {
					this.append(<IVertexElement[]><any>arguments);
				}
				else {
					this.append(<IVertexElement[]><any>arguments[0]);
				}
			}
		}

//append(...pElement: IVertexElement[]): bool;
		append(pElements?: IVertexElement[]): bool {
			return false;
		}



		extend(pDecl: IVertexDeclaration): bool {
			return false;
		}

		hasSemantics(sSemantics: string): bool {
			return false;
		}

		findElement(sSemantics: string, iCount?: uint): IVertexElement {
			return null;
		}

		clone(): IVertexDeclaration {
			return null;
		}

///DEBUG!!!
		toString(): string {
			if ( DEBUG ) {

			}

			return null;
		}
	}

//FIXME: typescript hack, to extends with Array

	var __extends = function (d, b) {
	    function __() { this.constructor = d; }
	    __.prototype = b.prototype;
	    d.prototype = new __();
	};

	__extends(VertexDeclaration, Array);
}

module akra {
	export var VertexDeclaration = util.VertexDeclaration;

	createVertexDeclaration = function (pData?): IVertexDeclaration {
		if (!(pData instanceof VertexDeclaration)) {
	        if (!(pData instanceof Array)) {
	            pData = [pData];
	        }

	        pData = new VertexDeclaration(pData);
	    }

	    return pData;
	}

}












module akra {
	export enum EResourceCodes {
		INVALID_CODE = 0xFFFFFFFF
	};

	export interface IResourceCode {
		family: int;
		type: int;
/** Пеерводит текущее состояние идентифиакора в невалидное */

		setInvalid(): void;
/** operator "<" */

		less(pSrc: IResourceCode): bool;
/** operator = */

		eq(pSrc: IResourceCode): IResourceCode;

		valueOf(): int;
		toNumber(): int;
	}
}



module akra.core.pool {
	export class ResourceCode implements IResourceCode {
		private iValue: int = <number>(EResourceCodes.INVALID_CODE);

		get family(): int {
			return this.iValue >> 16;
		}

		set family(iNewFamily: int) {
			this.iValue &= 0x0000FFFF;
	        this.iValue |= iNewFamily << 16;
		}

		get type(): int {
			return this.iValue & 0x0000FFFF;
		}

		set type(iNewType: int) {
			this.iValue &= 0xFFFF0000;
            this.iValue |= iNewType & 0x0000FFFF;
		}

		constructor ();
		constructor(iCode: int);
		constructor(eCode: EResourceCodes);
		constructor(pCode: IResourceCode);
		constructor(iFamily: int, iType: int);
		constructor (iFamily?, iType?) {
			switch (arguments.length) {
		        case 0:
		            this.iValue = <number>EResourceCodes.INVALID_CODE;
		            break;
		        case 1:
		            if (arguments[0] instanceof ResourceCode) {
		                this.iValue = arguments[0].iValue;
		            }
		            else {
		                this.iValue = arguments[0];
		            }
		            break;
		        case 2:
		            this.family = arguments[0];
		            this.type = arguments[1];
		            break;
		    }
		}

		setInvalid(): void {
		    this.iValue = <number>EResourceCodes.INVALID_CODE;
		}

		less (pSrc: IResourceCode): bool {
		    return this.iValue < pSrc.valueOf();
		}

		eq(pSrc: IResourceCode): IResourceCode {
		    this.iValue = pSrc.valueOf();
		    return this;
		};

		valueOf(): int {
		    return this.iValue;
		};

		toNumber(): int {
			return this.iValue;
		}
	}


}










module akra {

	export interface IDisplayManager {} ;
	export interface IParticleManager {} ;
	export interface IResourcePoolManager {} ;
	export interface IRenderer {} ;

    export interface IEngine {
        getDisplayManager(): IDisplayManager;
        getParticleManager(): IParticleManager;
        getResourceManager(): IResourcePoolManager;

        getDefaultRenderer(): IRenderer;

//start execution
        exec(): bool;
    };

    export var createEngine: () => IEngine;
}







module akra {

	export interface IEngine {} ;
	export interface IResourcePoolManager {} ;

	export interface IDataPool {
		manager: IResourcePoolManager;
/** Инициализация пула данных */

		initialize(iGrowSize: uint): void;

/** Инициализирован ли пул */

		isInitialized(): bool;

/** Очистка пула и пометка о том что он больш не инициализирован */

		destroy(): void;

/** Высвобождаем элемент в пуле по его номеру */

		release(iHandle: int): void;
/*
		 * даление всех групп
 		 * Все группы должны быть пусты, иначе во время удаления произойдет ошибка
		 **/

		clear(): void;
/** Добавляет новый элемент в пул */

		add(pMembers: IResourcePoolItem): int;

/** Цикл по всем объектам с приминением к ним функции, как fFunction(текущий пул данных, объект к торому применяется); */

		forEach(fFunction: (pPool: IDataPool, iHandle: int, pMember: IResourcePoolItem) => void): void;

/** Ищет первый свободный элемент в пуле */

		nextHandle(): int;
/** Проверяется используется лм этот элемент */

		isHandleValid(iHandle: int): bool;

/** Возвратитть элемент по хендлу */

		get(iHandle: int): IResourcePoolItem;
/** Возвратитть элемент по хендлу */

		getPtr(iHandle: int): IResourcePoolItem;
/** Возвратитть элемент по хендлу */

		getGenericPtr(iHandle: int): IResourcePoolItem;
	}
}












module akra {
    export interface IManager {
        initialize(): bool;
        destroy(): void;
    }
}



module akra {

    export interface IEngine {} ;
    export interface IResourceCode {} ;
    export interface IResourcePool {} ;
    export interface IResourceWatcherFunc {} ;
    export interface IResourcePoolItem {} ;

/** Семейства ресурсов */

	export enum EResourceFamilies {
		VIDEO_RESOURCE = 0,
		AUDIO_RESOURCE,
		GAME_RESOURCE,
		TOTAL_RESOURCE_FAMILIES
	};

/** Члены семейства видео ресурсов */

	export enum EVideoResources {
		TEXTURE_RESOURCE,
		VIDEOBUFFER_RESOURCE,
		VERTEXBUFFER_RESOURCE,
		INDEXBUFFER_RESOURCE,
		EFFECT_RESOURCE,
		RENDERMETHOD_RESOURCE,
		MODEL_RESOURCE,
		EFFECTFILEDATA_RESOURCE,
		IMAGE_RESOURCE,
		SURFACEMATERIAL_RESOURCE,
		SHADERPROGRAM_RESOURCE,
		COMPONENT_RESOURCE,
		TOTAL_VIDEO_RESOURCES
	};

	export enum EAudioResources {
		TOTAL_AUDIO_RESOURCES
	};

	export enum EGameResources {
		TOTAL_GAME_RESOURCES
	};

/** Конструктор класса, занимается очисткой списков пулов по семействам ресурсвов и краты пулов по коду ресурсов */

    export interface IResourcePoolManager extends IManager {
    	texturePool: IResourcePool;
    	surfaceMaterialPool: IResourcePool;
    	vertexBufferPool: IResourcePool;
    	videoBufferPool: IResourcePool;
    	indexBufferPool: IResourcePool;
    	renderMethodPool: IResourcePool;
    	modelPool: IResourcePool;
    	imagePool: IResourcePool;
//ex: private    	shaderProgramPool: IResourcePool;
//ex: private    	effectPool: IResourcePool;
//ex: private    	componentPool: IResourcePool;

/** Регистрируется пул ресурсов опредленного типа в менеджере русурсов */

    	registerResourcePool(pCode: IResourceCode, pPool: IResourcePool): void;
/** Удаляет пул ресурсов опредленного типа в менеджере русурсов */

    	unregisterResourcePool(pCode: IResourceCode): IResourcePool;

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

    	findResourcePool(pCode: IResourceCode): IResourcePool;
/**
		 * Возвращает хендл конкретного ресурса по его имени из конкретного пула опредленного типа
		 **/

    	findResourceHandle(pCode: IResourceCode, sName: string): int;
/** Возвращает конкретный ресурс по его имени из конкретного пула опредленного типа */

    	findResource(pCode: IResourceCode, sName: string): IResourcePoolItem;
        findResource(pCode: IResourceCode, iHandle: int): IResourcePoolItem;

    	monitorInitResources(fnMonitor: IResourceWatcherFunc): void;
    	setLoadedAllRoutine(fnCallback: Function): void;

/** Удаление всех ресурсов */

    	destroyAll(): void;
    	restoreAll(): void;
    	disableAll(): void;

    	clean(): void;

    	createDeviceResources(): bool;
    	destroyDeviceResources(): bool;
    	restoreDeviceResources(): bool;
    	disableDeviceResources(): bool;

        getEngine(): IEngine;
    }
}




module akra.core.pool {

	export interface IGroupNumber {
		value: uint;
	}

	export class PoolGroup {
		private pManager: IResourcePoolManager;

/** Конструктор для создания данных в группе */

		private tTemplate: IResourcePoolItemType;

/** Число свободных элементов группы */

		private iTotalOpen: uint = 0;
/** Первый свободный элемент группы */

		private iFirstOpen: uint = 0;
/** Колмичество элементов в группе */

		private iMaxCount: uint = 0;

/** Список свободных элементов группы */

		private pNextOpenList: uint[] = null;
/** Массив элементов группы */

		private pMemberList: IResourcePoolItem[] = null;

		/**@inline*/  get manager(): IResourcePoolManager { return this.pManager; }

/** 
		 * Возвращает количесвто свободных мест в группе 
		 * @inline
		 */

		get totalOpen(): uint {
			return this.iTotalOpen;
		}

/** 
		 * Возвращает количесвто занятых мест в группе 
		 * @inline
		 */

		get totalUsed(): uint {
			return this.iMaxCount - this.iTotalOpen;
		}

/**
		 * Номер первого свободного элемента в группе
		 * @inline
		 */

		get firstOpen(): uint {
			return this.iFirstOpen;
		}

		constructor (pManager: IResourcePoolManager, tTemplate: IResourcePoolItemType, iMaxCount: uint) {
			this.pManager = pManager;
			this.tTemplate = tTemplate;
			this.iMaxCount = iMaxCount;
		}

/** Создание группы, создается массив элементов, инициализирется список свободный и т.д. */

		create(): void {
			var i: int;

		    debug_assert(this.pMemberList == null && this.pNextOpenList == null, "Group has already been created");

		    this.pNextOpenList = new Array(this.iMaxCount);

		    debug_assert(this.pNextOpenList != null, "tragic memory allocation failure!");

		    this.pMemberList = new Array(this.iMaxCount);


		    for (i = 0; i < this.iMaxCount; i++) {
		        this.pMemberList[i] = new this.tTemplate(this.pManager);
		    }

		    debug_assert(this.pNextOpenList != null, "tragic memory allocation failure!");

		    for (i = 0; i < this.iMaxCount - 1; i++) {
		        this.pNextOpenList[i] = i + 1;
		    }

		    this.pNextOpenList[i] = i;
		    this.iTotalOpen = this.iMaxCount;
		    this.iFirstOpen = 0;
		}

/**  
		 * Удаление группы: удаление массива элементов, списка совбодных элементов и т.д.
		 * Выдается ошибка если группа не пуста 
		 * */

		destroy(): void {
		    debug_assert(this.pMemberList != null && this.pNextOpenList != null, "Group has not been created");
		    debug_assert(this.iTotalOpen == this.iMaxCount, "Group is not empty");

		    delete this.pMemberList;
		    this.pMemberList = null;

		    delete this.pNextOpenList;
		    this.pNextOpenList = null;

		    this.iTotalOpen = 0;
		    this.iMaxCount = 0;
		}

/** Возвращает номер следующего совбодного элемента в списке, и помечает его как используемый */

		nextMember() {
		    debug_assert(this.pMemberList != null && this.pNextOpenList != null, "Group has not been created");
		    debug_assert(this.iTotalOpen != null, "no open slots");
//Возвращает номер первого свободного элемента в группе,
//и изменяет номер первого свободного на следующего свободного

		    var iSlot = this.iFirstOpen;
		    this.iFirstOpen = this.pNextOpenList[iSlot];
		    this.iTotalOpen --;

		    debug_assert(this.iFirstOpen != INVALID_INDEX, "Invalid Open Index");
		    debug_assert(this.isOpen(iSlot), "invalid index");

//помечаем что элемент который отдали является используемым
		    this.pNextOpenList[iSlot] = INVALID_INDEX;

		    return iSlot;
		}

/** Добавляем новый элемент в список */

		addMember(pMember: IResourcePoolItem): uint {
			var iSlot: uint = this.nextMember();
		    this.pMemberList[iSlot] = pMember;

		    return iSlot;
		}

/** Исключение элемента из списка по его номеру */

		release(iIndex: uint): void {
			debug_assert(this.pMemberList != null && this.pNextOpenList != null, "Group has not been created");
		    debug_assert(iIndex < this.iMaxCount, "invalid index");
		    debug_assert(this.isOpen(iIndex) == false, "invalid index to release");

		    this.pNextOpenList[iIndex] = this.iTotalOpen > 0 ? this.iFirstOpen : iIndex;
		    this.iTotalOpen ++;
		    this.iFirstOpen = iIndex;
		}


/** Проверить свободна ли эта ячейка в группе */

		isOpen (iIndex: uint): bool {
		    debug_assert(this.pMemberList != null && this.pNextOpenList != null, "Group has not been created");
		    debug_assert(iIndex < this.iMaxCount, "invalid index");

		    return this.pNextOpenList[iIndex] != INVALID_INDEX;
		}

/** Получение элемента по его номеру */

		member(iIndex: uint): IResourcePoolItem {
		    debug_assert(this.pMemberList != null && this.pNextOpenList != null, "Group has not been created");
		    debug_assert(iIndex < this.iMaxCount, "invalid index");
		    return this.pMemberList[iIndex];
		}

		memberPtr(iIndex: uint): IResourcePoolItem {
		    debug_assert(this.pMemberList != null && this.pNextOpenList != null, "Group has not been created");
		    debug_assert(iIndex < this.iMaxCount, "invalid index");
		    return this.pMemberList[iIndex];
		}
	}

	export class DataPool implements IDataPool {
		private pManager: IResourcePoolManager;
		private tTemplate: IResourcePoolItemType;
		private bInitialized: bool = false;

/** Массив групп */

		private pGroupList: PoolGroup[] = null;

/** Общее число ячеек */

		private iTotalMembers: uint = 0;
/** Количесвто свободных ячеек */

		private iTotalOpen: uint = 0;
/** Количесвто элементов в группе */

		private iGroupCount: uint = 0;
/**
		 * Номер элемента состоит из номер группы сдвинутого на _iIndexShift
    	 * и номера элемента в этой группе, который можно вырезать маской _iIndexMask
		 */

		private iIndexMask: int = 0;
/**
		 * Номер элемента состоит из номер группы сдвинутого на _iIndexShift
     	 * и номера элемента в этой группе, который можно вырезать маской _iIndexMask
		 */

		private iIndexShift: int = 0;


		/**@inline*/  get manager(): IResourcePoolManager { return this.pManager; }

		constructor(pManager: IResourcePoolManager, tTemplate: IResourcePoolItemType) {
			this.pManager = pManager;
			this.tTemplate = tTemplate;
		}


		initialize(iGrowSize: uint): void {
			debug_assert(this.isInitialized() == false, "the cDataPool is already initialized");

		    this.bInitialized = true;
		    this.iGroupCount = math.nearestPowerOfTwo(iGrowSize);
		    this.iIndexShift = math.lowestBitSet(this.iGroupCount);
		    this.iIndexShift = math.clamp(this.iIndexShift, 1, 15);
		    this.iGroupCount = 1 << this.iIndexShift;
		    this.iIndexMask = this.iGroupCount - 1;
		}


/** @inline */

		isInitialized(): bool {
			return this.bInitialized;
		}


		destroy(): void {
			this.clear();
    		this.bInitialized = false;
		}


		release(iHandle: int): void {
			debug_assert(this.isInitialized() == true, "the cDataPool is not initialized");

		    if (this.isHandleValid(iHandle) == true) {
		        debug_assert(this.pGroupList.length != 0, "The cDataPool has not been properly created");

		        var iGroupIndex: uint = this.getGroupNumber(iHandle);
		        var iItemIndex: uint = this.getItemIndex(iHandle);

		        var pGroup: PoolGroup = this.getGroup(iGroupIndex);
		        pGroup.release(iItemIndex);
		        var pGroupBack: PoolGroup = this.pGroupList[this.pGroupList.length - 1];

		        if (pGroupBack.totalOpen == this.iGroupCount) {
		            pGroupBack.destroy();
		            this.pGroupList.splice(this.pGroupList.length - 1, 1);
		        }

		        this.iTotalOpen ++;
		    }
		}

		clear(): void {
// destroy all groups in the list
		    for (var iGroupIter: uint = 0; iGroupIter < this.pGroupList.length; ++ iGroupIter) {
		        this.pGroupList[iGroupIter].destroy();
		    }

// now clear the list itself
		    this.pGroupList.clear();
		}

		add(pMembers: IResourcePoolItem): int {
			debug_assert(this.isInitialized() == true, "the cDataPool is not initialized");

		    var iGroupNumber: IGroupNumber = {value: 0};

		    var pOpenGroup: PoolGroup = this.findOpenGroup(iGroupNumber);
		    var iIndex: uint = pOpenGroup.addMember(pMembers);

		    this.iTotalOpen --;

		    return this.buildHandle(iGroupNumber.value, iIndex);
		}

		forEach(fFunction: (pPool: IDataPool, iHandle: int, pMember: IResourcePoolItem) => void): void {
			debug_assert(this.isInitialized() == true, "the cDataPool is not initialized");
// iterate through every group

		    var iGroupNumber: uint = 0;
		    for (var iGroupIter: uint = 0; iGroupIter < this.pGroupList.length; iGroupIter++) {

		        var nCallbackCount: uint = this.pGroupList[iGroupIter].totalUsed;
		        var iItemIndex: uint = 0;

		        while (nCallbackCount != 0 && iItemIndex < this.iGroupCount) {
		            if (this.pGroupList[iGroupIter].isOpen(iItemIndex) == false) {
		                fFunction(
		                	this,
		                	this.buildHandle(iGroupNumber, iItemIndex),
		                	this.pGroupList[iGroupIter].member(iItemIndex)
		                	);
		                nCallbackCount--;
		            }

		            ++iItemIndex;
		        }

		        ++iGroupNumber;
		    }
		}

		nextHandle(): int {
			debug_assert(this.isInitialized() == true, "the cDataPool is not initialized");

		    var iGroupNumber: IGroupNumber = {value: 0};
		    var pOpenGroup: PoolGroup = this.findOpenGroup(iGroupNumber);
		    var iIndex: uint = pOpenGroup.nextMember();

		    this.iTotalOpen --;

		    return this.buildHandle(iGroupNumber.value, iIndex);
		}

		isHandleValid(iHandle: int): bool {
			debug_assert(this.isInitialized() == true, "the cDataPool is not initialized");

		    if (iHandle !== INVALID_INDEX) {
		        debug_assert(this.pGroupList.length != 0, "The cDataPool has not been properly created");

		        var pGroup: PoolGroup = this.getGroup(this.getGroupNumber(iHandle));

		        return !pGroup.isOpen(this.getItemIndex(iHandle));
		    }

		    return false;
		}

		get(iHandle: int): IResourcePoolItem {
			debug_assert(this.isInitialized() == true, "the cDataPool is not initialized");
		    debug_assert(this.pGroupList.length != 0, "The cDataPool has not been properly created");

		    var pGroup: PoolGroup = this.getGroup(this.getGroupNumber(iHandle));
		    var iItemIndex: uint = this.getItemIndex(iHandle);

		    return pGroup.member(iItemIndex);
		}

		getPtr(iHandle: int): IResourcePoolItem {
			debug_assert(this.isInitialized() == true, "the cDataPool is not initialized");
		    debug_assert(this.pGroupList.length != 0, "The cDataPool has not been properly created");

		    var pGroup: PoolGroup = this.getGroup(this.getGroupNumber(iHandle));
		    var iItemIndex: uint = this.getItemIndex(iHandle);

		    return pGroup.memberPtr(iItemIndex);
		}

		getGenericPtr(iHandle: int): IResourcePoolItem {
			debug_assert(this.isInitialized() == true, "the cDataPool is not initialized");

    		return this.getPtr(iHandle);
		}


/** 
		 * @inline 
		 * Получение номера группы по номеру элемента
		 */

		private getGroupNumber(iHandle: int): int {
			return iHandle >> this.iIndexShift;
		}

/** 
		 * @inline 
		 * Получение номера элеменат в группе по его номеру
		 */

		private getItemIndex(iHandle: int): int {
			return iHandle & this.iIndexMask;
		}

/** 
		 * @inline 
		 * Полученяи номера элеменат по его номеру группы и группе
		 */

		private buildHandle(iGroup, iIndex): int {
			return (iGroup << this.iIndexShift) + iIndex;
		}

/** Добавление группы в пул */

		private addGroup(): PoolGroup {
// append a new group to the list to start things off
		    var pNewGroup: PoolGroup = new PoolGroup(this.pManager, this.tTemplate, this.iGroupCount);
		    this.pGroupList.push(pNewGroup);
// gain access to the new group and innitialize it
		    pNewGroup.create();
// increment our internal counters
		    this.iTotalMembers += this.iGroupCount;
		    this.iTotalOpen += this.iGroupCount;

		    return pNewGroup;
		}

/** Поиск первой группы которая имеет свободную область */

		private findOpenGroup(pGroupNumber: IGroupNumber): PoolGroup {
			pGroupNumber.value = 0;

//найдем и вренем первую группу имеющую свободную группу
		    for (var iGroupIter: uint = 0; iGroupIter < this.pGroupList.length; iGroupIter++) {
		        if (this.pGroupList[iGroupIter].totalOpen > 0) {
		            return this.pGroupList[iGroupIter];
		        }

		        pGroupNumber.value ++;
		    }

//свободных областей нет, поэтому мы должны добавить новую группу в пул,
//но пержде чем содавать убедимся что не достигли максимума

		    debug_assert((this.pGroupList.length + 1) < MAX_UINT16, "the cDataPool is full!!!!");
//добавим новую группу

		    return this.addGroup();
		}

/** 
		 * @inline 
		 * Возвращает группу по ее номеру
		 */

		private getGroup(iIndex: uint): PoolGroup {
			debug_assert(iIndex < this.pGroupList.length, "Invalid group index requested");
    		return this.pGroupList[iIndex];
		}


	}
}













module akra {

        export interface IEngine {} ;
        export interface IResourceCode {} ;
        export interface IResourcePoolItem {} ;
        export interface IResourcePoolManager {} ;

        export interface IResourcePool {
                iFourcc: int;
                 manager: IResourcePoolManager;

/** Добавление данного пула в менеджер ресурсво по его коду */

                registerResourcePool(pCode: IResourceCode): void;
/** Удаление данного пула в менеджер ресурсво по его коду */

                unregisterResourcePool(): void;
/** По имени ресурса возвращает его хендл */

                findResourceHandle(sName: string): int;
/** По хендлу ресурва возвращает его имя */

                findResourceName(iHandle: int): string;

/** set resource name */

                setResourceName(iHandle: int, sName: string): void;

                initialize(iGrowSize: int): void;
                destroy(): void;
                clean(): void;

                destroyAll(): void;
                restoreAll(): void;
                disableAll(): void;

                isInitialized(): bool;

//callbackDestroy(pPool: IDataPool, iHandle: int, pResource: IResourcePoolItem): void;
//callbackDisable(pPool: IDataPool, iHandle: int, pResource: IResourcePoolItem): void;
//callbackRestore(pPool: IDataPool, iHandle: int, pResource: IResourcePoolItem): void;
//callbackClean(pPool: IDataPool, iHandle: int, pResource: IResourcePoolItem): void;

                createResource(sResourceName: string): IResourcePoolItem;
                loadResource(sResourceName: string): IResourcePoolItem;
                saveResource(pResource: IResourcePoolItem): bool;
                destroyResource(pResource: IResourcePoolItem): void;

                findResource(sName: string): IResourcePoolItem;
                getResource(iHandle: int): IResourcePoolItem;
                getResources(): IResourcePoolItem[];
        }
}













module akra.core.pool {
    export class ResourcePool extends util.ReferenceCounter implements IResourcePool {
        private pManager: IResourcePoolManager = null;
/** Конструктор для создания данных в пуле ресурсов */

        private tTemplate: IResourcePoolItemType = null;
        private sExt: string = null;
        private pRegistrationCode: IResourceCode = new ResourceCode(EResourceCodes.INVALID_CODE);
/*{[index: number]: string;}*/
        private pNameMap: string[]                               = new Array();
        private pDataPool: IDataPool = null;


        /**@inline*/  get iFourcc(): int {
            return (this.sExt.charCodeAt(3) << 24)
                      | (this.sExt.charCodeAt(2) << 16)
                      | (this.sExt.charCodeAt(1) << 8)
                      | (this.sExt.charCodeAt(0));
        }



        set iFourcc(iNewFourcc: int) {
            this.sExt = String.fromCharCode((iNewFourcc & 0x000000FF),
                                             (iNewFourcc & 0x0000FF00) >>> 8,
                                             (iNewFourcc & 0x00FF0000) >>> 16,
                                             (iNewFourcc & 0xFF000000) >>> 24);
        }

        /**@inline*/  get manager(): IResourcePoolManager {
            return this.pManager;
        }

        constructor (pManager: IResourcePoolManager, tTemplate: IResourcePoolItemType) {
            super();

            this.pManager = pManager;
            this.tTemplate = tTemplate;
            this.pDataPool = new DataPool(this.pManager, tTemplate);
        }

/** Добавление данного пула в менеджер ресурсво по его коду */

        registerResourcePool(pCode: IResourceCode): void {
            this.pRegistrationCode.eq(pCode);
            this.pManager.registerResourcePool(this.pRegistrationCode, this);
        }

/** Удаление данного пула в менеджер ресурсво по его коду */

        unregisterResourcePool(): void {
            this.pManager.unregisterResourcePool(this.pRegistrationCode);
            this.pRegistrationCode.setInvalid();
        }

/** По имени ресурса возвращает его хендл */

        findResourceHandle(sName: string): int {
// look up the name in our map
            var iNewHandle = INVALID_INDEX;

            for (var iHandle: int = 0; iHandle < this.pNameMap.length; ++ iHandle) {
                if (this.pNameMap[iHandle] === sName) {
                    return iHandle;
                }
            }

            return iNewHandle;
        }

/** 
         * Get resource name by handle.
         * @inline
         */

        findResourceName(iHandle: int): string {
            return this.pNameMap[iHandle];
        }

        setResourceName(iHandle: int, sName: string): void {
            this.pNameMap[iHandle] = sName;
        }


        initialize(iGrowSize: int): void {
            this.pDataPool.initialize(iGrowSize);
        }

/** @inline */

        destroy(): void {
            this.pDataPool.destroy();
        }


        clean(): void {
            this.pDataPool.forEach(ResourcePool.callbackClean);
        }

        destroyAll(): void {
            this.pDataPool.forEach(ResourcePool.callbackDestroy);
        }

        restoreAll(): void {
            this.pDataPool.forEach(ResourcePool.callbackRestore);
        }

        disableAll(): void {
            this.pDataPool.forEach(ResourcePool.callbackDisable);
        }

/** @inline */

        isInitialized(): bool {
            return this.pDataPool.isInitialized();
        }



        createResource(sResourceName: string): IResourcePoolItem {
            var iHandle: int = this.internalCreateResource(sResourceName);

            if (iHandle !== INVALID_INDEX) {
                var pResource: IResourcePoolItem = this.getResource(iHandle);

                pResource.setResourcePool(this);
                pResource.setResourceHandle(iHandle);
                pResource.setResourceCode(this.pRegistrationCode);

                return pResource;
            }

            return null;
        }

        loadResource(sResourceName: string): IResourcePoolItem {
// does the resource already exist?
            var pResource: IResourcePoolItem = this.findResource(sResourceName);

            if (pResource == null) {
// create a new resource
                pResource = this.createResource(sResourceName);

                if (pResource != null) {
// attempt to load the desired data
                    if (pResource.loadResource(sResourceName)) {
// ok!
                        return pResource;
                    }

// loading failed.
// destroy the resource we created
// destroyResource(pResource);
                    pResource.release();
                    pResource = null;
                }

            }

            return pResource;
        }

        saveResource(pResource: IResourcePoolItem): bool {
            if (pResource != null) {
// save the resource using it's own name as the file path
                return pResource.saveResource();
            }
            return false;
        }

        destroyResource(pResource: IResourcePoolItem): void {
            if (pResource != null) {
                var iReferenceCount: int = pResource.referenceCount();

                debug_assert(iReferenceCount == 0, "destruction of non-zero reference count!");

                if (iReferenceCount <= 0) {
                    var iHandle: int = pResource.resourceHandle;
                    this.internalDestroyResource(iHandle);
                }
            }
        }

        findResource(sName: string): IResourcePoolItem {

// look up the name in our map
            for (var iHandle: int = 0; iHandle < this.pNameMap.length; ++ iHandle) {
                if (this.pNameMap[iHandle] == sName) {
                    if (iHandle != INVALID_INDEX) {
                        var pResource = this.getResource(iHandle);
                        return pResource;
                    }
                }
            }

            return null;
        }

        getResource(iHandle: int): IResourcePoolItem {
            var pResource: IResourcePoolItem = this.internalGetResource(iHandle);

            if (pResource != null) {
                pResource.addRef();
            }

            return pResource;
        }

        getResources(): IResourcePoolItem[] {
            var pResources: IResourcePoolItem[] = [];

            for (var iHandleResource in this.pNameMap) {
                pResources.push(this.getResource(parseInt(iHandleResource)));
            }

            return pResources;
        }


        private internalGetResource(iHandle: int): IResourcePoolItem {
            return this.pDataPool.getPtr(iHandle);
        }

        private internalDestroyResource(iHandle: int): void {
// get a pointer to the resource and call it's destruction handler
            var pResource = this.pDataPool.getPtr(iHandle);

            pResource.destroyResource();

            delete this.pNameMap[iHandle];

// free the resource slot associated with the handle
            this.pDataPool.release(iHandle);
        };

        private internalCreateResource(sResourceName: string): int {
            var iHandle: int = this.pDataPool.nextHandle();

// make sure this name is not already in use
            for (var iter in this.pNameMap) {
                debug_assert((this.pNameMap[iter] != sResourceName),
                            "A resource with this name already exists: " + sResourceName);
            }

// add this resource name to our map of handles
            this.pNameMap[iHandle] = sResourceName;

// get a pointer to the resource and call it's creation function
            var pResource = this.pDataPool.getPtr(iHandle);

            pResource.createResource();

            return iHandle;
        }

        private static callbackDestroy(pPool: IDataPool, iHandle: int, pResource: IResourcePoolItem): void {
            pResource.destroyResource();
        }

        private static callbackDisable(pPool: IDataPool, iHandle: int, pResource: IResourcePoolItem): void {
            pResource.disableResource();
        }

        private static callbackRestore(pPool: IDataPool, iHandle: int, pResource: IResourcePoolItem): void {
            pResource.restoreResource();
        }

        private static callbackClean(pPool: IDataPool, iHandle: int, pResource: IResourcePoolItem): void {
            if (pResource.referenceCount() == 0) {
                pPool.release(iHandle);
            }
        }
    }
}


















module akra {

	export interface IResourcePoolItem {} ;

	export interface IResourceWatcherFunc {
		(nLoaded?: uint, nTotal?: uint, pTarget?: IResourcePoolItem): void;
	}
}







module akra {
	export interface IResourceNotifyRoutineFunc {
		(iFlagBit?: int, iResourceFlags?: int, isSet?: bool): void;
		(eEvent?: EResourceItemEvents, iResourceFlags?: int, isSet?: bool): void;
	}
}







module akra.core.pool {

	export interface ICallbackSlot {
		bState: bool;
		fn: IResourceNotifyRoutineFunc;
		pResourceItem: IResourcePoolItem;
	}

	export class ResourcePoolItem extends util.ReferenceCounter implements IResourcePoolItem {
		private pManager: IResourcePoolManager;
		private pResourceCode: IResourceCode;
		private pResourcePool: IResourcePool = null;
		private iResourceHandle: int = 0;
		private iResourceFlags: int = 0;
		private iGuid: uint;
		private pCallbackFunctions: IResourceNotifyRoutineFunc[];
		private pStateWatcher: IResourceWatcherFunc[];
		private pCallbackSlots: ICallbackSlot[][];


		/**@inline*/  get resourceCode(): IResourceCode {
			return this.pResourceCode;
		}

		/**@inline*/  get resourcePool(): IResourcePool {
			return this.pResourcePool;
		}

		/**@inline*/  get resourceHandle(): int {
			return this.iResourceHandle;
		}

		/**@inline*/  get resourceFlags(): int {
			return this.iResourceFlags;
		}

		/**@inline*/  get alteredFlag(): bool {
			return bf.testBit(this.iResourceFlags, <number>EResourceItemEvents.k_Altered);
		}

		/**@inline*/  get manager(): IResourcePoolManager { return this.pManager; }

/** Constructor of ResourcePoolItem class */

		constructor (pManager: IResourcePoolManager) {
			super();

			this.pManager = pManager;
			this.pResourceCode = new ResourceCode(0);
			this.iGuid = sid();
			this.pCallbackFunctions = [];
			this.pStateWatcher = [];
			this.pCallbackSlots = genArray(null, <number>EResourceItemEvents.k_TotalResourceFlags);
		}

		/**@inline*/  getGuid(): int {
			return this.iGuid;
		}

		/**@inline*/  getEngine(): IEngine {
			return this.pManager.getEngine();
		}

		createResource(): bool {
			return false;
		}

		destroyResource(): bool {
			return false;
		}

		disableResource(): bool{
			return false;
		}

		restoreResource(): bool {
			return false;
		}

		loadResource(sFilename: string = null): bool {
			return false;
		}

		saveResource(sFilename: string = null): bool {
			return false;
		}


		setChangesNotifyRoutine(fn: IResourceNotifyRoutineFunc): void {
			for (var i: int = 0; i < this.pCallbackFunctions.length; i ++) {

			    if (this.pCallbackFunctions[i] == fn) {
			        return;
			    }
			}

			this.pCallbackFunctions.push(fn);
		}

		delChangesNotifyRoutine(fn: IResourceNotifyRoutineFunc): void {
			for (var i: int = 0; i < this.pCallbackFunctions.length; i ++) {
		        if (this.pCallbackFunctions[i] == fn) {
		            this.pCallbackFunctions[i] = null;
		        }
		    }
		}

		setStateWatcher(eEvent: EResourceItemEvents, fnWatcher: IResourceWatcherFunc): void {
			this.pStateWatcher[eEvent] = fnWatcher;
		}

		connect(pResourceItem: IResourcePoolItem, eSignal: EResourceItemEvents, eSlot?: EResourceItemEvents): bool {
			eSlot = isDef(eSlot)? eSlot: eSignal;

		    eSlot = ResourcePoolItem.parseEvent(<number>eSlot);
		    eSignal = ResourcePoolItem.parseEvent(<number>eSignal);

		    var pSlots: ICallbackSlot[][] = this.pCallbackSlots, pSignSlots: ICallbackSlot[];

		    var me: IResourcePoolItem = this;
		    var n: uint;
		    var fn: IResourceNotifyRoutineFunc;
		    var bState: bool;

		    if (isNull(pSlots[eSlot])) {
		        pSlots[eSlot] = [];
		    }

		    pSignSlots = pSlots[eSlot];
		    n = pSignSlots.length;
		    bState = bf.testBit(pResourceItem.resourceFlags, <number>eSignal);

		    fn = function (eFlag?: EResourceItemEvents, iResourceFlags?: int, isSet?: bool) {
		        if (eFlag == <number>eSignal) {
		            pSignSlots[n].bState = isSet;
		            me.notifyStateChange(eSlot, this);

		            for (var i: int = 0; i < pSignSlots.length; ++i) {
		                if (pSignSlots[i].bState === false) {
		                    if (bf.testBit(me.resourceFlags, <number>eFlag)) {
		                        me.setResourceFlag(eFlag, false);
		                    }
		                    return;
		                }
		            }

		            me.setResourceFlag(eFlag, true);
		        }
		    };

		    pSignSlots.push({bState : bState, fn : fn, pResourceItem : pResourceItem});

		    fn.call(pResourceItem, eSignal, pResourceItem.resourceFlags, bState);
		    pResourceItem.setChangesNotifyRoutine(fn);

		    return true;
		}

		disconnect(pResourceItem: IResourcePoolItem, eSignal: EResourceItemEvents, eSlot?: EResourceItemEvents): bool {
			eSlot = isDef(eSlot)? eSlot: eSignal;
		    eSlot = ResourcePoolItem.parseEvent(<number>eSlot);
		    eSignal = ResourcePoolItem.parseEvent(<number>eSignal);

		    var pSlots: ICallbackSlot[][] = this.pCallbackSlots, pSignSlots: ICallbackSlot[];
		    var me: IResourcePoolItem = this;
		    var isRem: bool = false;

		    pSignSlots = pSlots[eSlot];


		    for (var i: int = 0, n: uint = pSignSlots.length; i < n; ++i) {
		        if (pSignSlots[i].pResourceItem === pResourceItem) {
		            pSignSlots[i].pResourceItem.delChangesNotifyRoutine(pSignSlots[i].fn);
		            pSignSlots.splice(i, 1);

		            --n;
		            --i;

		            isRem = true;
		        }
		    }

		    return isRem;
		}

/** @inline */

		notifyCreated(): void {
			this.setResourceFlag(EResourceItemEvents.k_Created, true);
		}

/** @inline */

		notifyDestroyed(): void {
			this.setResourceFlag(EResourceItemEvents.k_Created, false);
		}

/** @inline */

		notifyLoaded(): void {
			this.setAlteredFlag(false);
    		this.setResourceFlag(EResourceItemEvents.k_Loaded, true);
		}

/** @inline */

		notifyUnloaded(): void {
			this.setResourceFlag(EResourceItemEvents.k_Loaded, false);
		}

/** @inline */

		notifyRestored(): void {
			this.setResourceFlag(EResourceItemEvents.k_Disabled, false);
		}

/** @inline */

		notifyDisabled(): void {
			this.setResourceFlag(EResourceItemEvents.k_Disabled, true);
		}

/** @inline */

		notifyAltered(): void {
			this.setResourceFlag(EResourceItemEvents.k_Altered, true);
		}

/** @inline */

		notifySaved(): void {
			this.setAlteredFlag(false);
		}

/** @inline */

		isResourceCreated(): bool {
			return bf.testBit(this.iResourceFlags, <number>EResourceItemEvents.k_Created);
		}

/** @inline */

		isResourceLoaded(): bool {
			return bf.testBit(this.iResourceFlags, <number>EResourceItemEvents.k_Loaded);
		}

/** @inline */

		isResourceDisabled(): bool {
			return bf.testBit(this.iResourceFlags, <number>EResourceItemEvents.k_Disabled);
		}

/** @inline */

		isResourceAltered(): bool {
			return bf.testBit(this.iResourceFlags, <number>EResourceItemEvents.k_Altered );
		}

		setAlteredFlag(isOn: bool = true): void {
    		this.setResourceFlag(EResourceItemEvents.k_Altered, isOn);
		}

/** @inline */

		setResourceName(sName: string) {
			if (this.pResourcePool != null) {
		        this.pResourcePool.setResourceName(this.iResourceHandle, sName);
		    }
		}

		findResourceName(): string {
			if (this.pResourcePool != null) {
		        return this.pResourcePool.findResourceName(this.iResourceHandle);
		    }

		    return null;
		}

		release(): uint {
			var iRefCount = super.release();

		    if (iRefCount == 0) {
//Если у нас есть менеджер попросим его удалить нас
		        if (this.pResourcePool != null) {
		            this.pResourcePool.destroyResource(this);
		        }
		    }

		    return iRefCount;
		}

/**
		 * Назначение кода ресурсу
		 * @inline
		 */

		setResourceCode(pCode: IResourceCode): void {
			this.pResourceCode.eq(pCode);
		}

/**
		 * Чтобы ресурс знал какому пулу ресурсов принадлжит
		 * @inline
		 */

		setResourcePool(pPool: IResourcePool): void {
			this.pResourcePool = pPool;
		}

/**
		 * Назначение хендла ресурсу
		 * @inline
		 */

		setResourceHandle(iHandle: int): void {
			this.iResourceHandle = iHandle;
		}

		notifyStateChange(eEvent: EResourceItemEvents, pTarget: IResourcePoolItem = null): void {
			if (!this.pStateWatcher[eEvent]) {
		        return;
		    }

		    var pSignSlots: ICallbackSlot[]  = this.pCallbackSlots[eEvent];
		    var nTotal: uint = pSignSlots.length, nLoaded: uint = 0;

		    for (var i: int = 0; i < nTotal; ++i) {
		        if (pSignSlots[i].bState) {
		            ++ nLoaded;
		        }
		    }

		    this.pStateWatcher[eEvent](nLoaded, nTotal, pTarget);
		}

		setResourceFlag(eFlagBit: EResourceItemEvents, isSetting: bool): void;
		setResourceFlag(iFlagBit: int, isSetting: bool): void;
		setResourceFlag(iFlagBit, isSetting: bool): void {
			var iTempFlags: int = this.iResourceFlags;

		    bf.setBit(this.iResourceFlags, iFlagBit, isSetting);

		    if (iTempFlags != this.iResourceFlags) {
		        for (var i: int = 0; i < this.pCallbackFunctions.length; i++) {
		            if (this.pCallbackFunctions[i]) {
		                this.pCallbackFunctions[i].call(this, iFlagBit, this.iResourceFlags, isSetting);
		            }
		        }
		    }
		}

		static private parseEvent(sEvent: string): EResourceItemEvents;
		static private parseEvent(iEvent: int): EResourceItemEvents;
		static private parseEvent(pEvent) {
		 	if (isInt(pEvent)) {
		        return <EResourceItemEvents>pEvent;
		    }

		    switch (pEvent.toLowerCase()) {
		        case 'loaded':
		            return EResourceItemEvents.k_Loaded;
		        case 'created':
		            return EResourceItemEvents.k_Created;
		        case 'disabled':
		            return EResourceItemEvents.k_Disabled;
		        case 'altered':
		            return EResourceItemEvents.k_Altered;
		        default:
		            error('Использовано неизвестное событие для ресурса.');
		            return 0;
		    }
		}
	}

}

















module akra.core.pool {
//is this class really singleton??
    export class ResourcePoolManager implements IResourcePoolManager {
//all predefined pools
        private pSurfaceMaterialPool: IResourcePool;
        private pEffectPool: IResourcePool;
        private pRenderMethodPool: IResourcePool;
        private pVertexBufferPool: IResourcePool;
        private pIndexBufferPool: IResourcePool;
        private pModelPool: IResourcePool;
        private pImagePool: IResourcePool;
        private pTexturePool: IResourcePool;
        private pVideoBufferPool: IResourcePool;
        private pShaderProgramPool: IResourcePool;
        private pComponentPool: IResourcePool;

/** Списки пулов по семействам ресурсов */

    	private pResourceFamilyList: IResourcePool[][] = null;
/** Карта пулов по коду ресурса */

    	private pResourceTypeMap: IResourcePool[] = null;
/** Ресурс для ожидания остальных */

    	private pWaiterResource: IResourcePoolItem = null;

        private pEngine: IEngine;

        get surfaceMaterialPool(): IResourcePool { return this.pSurfaceMaterialPool; }
        get effectPool(): IResourcePool { return this.pEffectPool; }
        get renderMethodPool(): IResourcePool { return this.pRenderMethodPool; }
        get vertexBufferPool(): IResourcePool { return this.pVertexBufferPool; }
        get indexBufferPool(): IResourcePool { return this.pIndexBufferPool; }
        get modelPool(): IResourcePool { return this.pModelPool; }
        get imagePool(): IResourcePool { return this.pImagePool; }
        get texturePool(): IResourcePool { return this.pTexturePool; }
        get videoBufferPool(): IResourcePool { return this.pVideoBufferPool; }
        get shaderProgramPool(): IResourcePool { return this.pShaderProgramPool; }
        get componentPool(): IResourcePool { return this.pComponentPool; }

    	constructor(pEngine: IEngine) {
//super();

            this.pEngine = pEngine;

    		this.pResourceFamilyList = new Array(EResourceFamilies.TOTAL_RESOURCE_FAMILIES);

    		for (var i = 0; i < EResourceFamilies.TOTAL_RESOURCE_FAMILIES; i++) {
		        this.pResourceFamilyList[i] = new Array();
		    }

		    this.pResourceTypeMap = new Array();
		    this.pWaiterResource = new pool.ResourcePoolItem(this);

            this.createDeviceResource();
    	}

        initialize(): bool {
            this.registerDeviceResources();
            return true;
        }

        destroy(): void {
            this.unregisterDeviceResources();
        }

        registerResourcePool(pCode: IResourceCode, pPool: IResourcePool): void {
            debug_assert(pCode.family >= 0 && pCode.family < <number>EResourceFamilies.TOTAL_RESOURCE_FAMILIES,
                "invalid code familyi index");

            debug_assert(!isDef(this.pResourceTypeMap[pCode.toNumber()]), "Resource type code already registered");

            this.pResourceTypeMap[pCode.toNumber()] = pPool;
            this.pResourceFamilyList[pCode.family].push(pPool);
        }

    	unregisterResourcePool(pCode: IResourceCode): IResourcePool {
            debug_assert(pCode.family >= 0, "invalid family index");
            debug_assert(pCode.family < <number>EResourceFamilies.TOTAL_RESOURCE_FAMILIES, "invalid family index");

            var iCode = pCode.toNumber();
            var pPool = null;
            if (this.pResourceTypeMap[iCode] != undefined) {
                pPool = this.pResourceTypeMap[iCode];
                delete this.pResourceTypeMap[iCode];
            }

            if (pPool != null) {
                for (var i in this.pResourceFamilyList[pCode.family]) {
                    if (this.pResourceFamilyList[pCode.family][i] == pPool) {
                        delete this.pResourceFamilyList[pCode.family][i];
                        return pPool;
                    }
                }
            }

            return pPool;
        }


        destroyResourceFamily(eFamily: EResourceFamilies): void {
            debug_assert(eFamily < <number>EResourceFamilies.TOTAL_RESOURCE_FAMILIES, "invalid family index");


            for (var i in this.pResourceFamilyList[eFamily]) {
                this.pResourceFamilyList[eFamily][i].destroyAll();
            }
        }

        restoreResourceFamily(eFamily: EResourceFamilies): void {
            debug_assert(eFamily >= 0, "invalid family index");
            debug_assert(eFamily < <number>EResourceFamilies.TOTAL_RESOURCE_FAMILIES, "invalid family index");

            for (var i in this.pResourceFamilyList[eFamily]) {
                this.pResourceFamilyList[eFamily][i].restoreAll();
            }
        }

        disableResourceFamily(eFamily: EResourceFamilies): void {
            debug_assert(eFamily >= 0, "invalid family index");
            debug_assert(eFamily < <number>EResourceFamilies.TOTAL_RESOURCE_FAMILIES, "invalid family index");

            for (var i in this.pResourceFamilyList[eFamily]) {
                this.pResourceFamilyList[eFamily][i].disableAll();
            }
        }

        cleanResourceFamily(eFamily: EResourceFamilies): void  {
            debug_assert(eFamily >= 0, "invalid family index");
            debug_assert(eFamily < <number>EResourceFamilies.TOTAL_RESOURCE_FAMILIES, "invalid family index");

            for (var i in this.pResourceFamilyList[eFamily]) {
                this.pResourceFamilyList[eFamily][i].clean();
            }
        }

        destroyResourceType(pCode: IResourceCode): void {
            if (isDef(this.pResourceTypeMap[pCode.toNumber()])) {
                this.pResourceTypeMap[pCode.toNumber()].destroyAll();
            }
        }

        restoreResourceType(pCode: IResourceCode): void {
            if (isDef(this.pResourceTypeMap[pCode.toNumber()])) {
                this.pResourceTypeMap[pCode.toNumber()].restoreAll();
            }
        }

        disableResourceType(pCode: IResourceCode): void {
            if (isDef(this.pResourceTypeMap[pCode.toNumber()])) {
                this.pResourceTypeMap[pCode.toNumber()].disableAll();
            }
        }

        cleanResourceType(pCode: IResourceCode): void {
            if (isDef(this.pResourceTypeMap[pCode.toNumber()])) {
                this.pResourceTypeMap[pCode.toNumber()].clean();
            }
        }

        findResourcePool(pCode: IResourceCode): IResourcePool {
            if (isDef(this.pResourceTypeMap[pCode.toNumber()])) {
                return this.pResourceTypeMap[pCode.toNumber()];
            }

            return null;
        }

        findResourceHandle(pCode: IResourceCode, sName: string): int {
            var pPool: IResourcePool = this.findResourcePool(pCode);
            var iHandle: int = INVALID_INDEX;

            if (!isNull(pPool)) {
                iHandle = pPool.findResourceHandle(sName);
            }

            return iHandle;
        }

        findResource(pCode: IResourceCode, sName: string): IResourcePoolItem;
        findResource(pCode: IResourceCode, iHandle: int): IResourcePoolItem;
        findResource(pCode, sName): IResourcePoolItem {
            var pPool: IResourcePool = this.findResourcePool(pCode);
            var pResult: IResourcePoolItem = null;
            var iHandle: int;

            if (isString(arguments[1])) {
                iHandle = pPool.findResourceHandle(sName);
            }
            else if (isInt(arguments[1])) {
                iHandle = arguments[1];
            }

            if (pPool != null && iHandle != INVALID_INDEX) {
                pResult = pPool.getResource(iHandle);
            }

            return pResult;
        }

        monitorInitResources(fnMonitor: IResourceWatcherFunc): void {
            var me: IResourcePoolManager = this;

            this.pWaiterResource.setStateWatcher(EResourceItemEvents.k_Loaded, function () {
                fnMonitor.apply(me, arguments);
            });
        }

        setLoadedAllRoutine(fnCallback: Function): void {
            var pPool: IResourcePool;
            var pResource: IResourcePoolItem;
            var iHandleResource: int;
            var pWaiterResouse: IResourcePoolItem = this.pWaiterResource;

            var fnResCallback = function (iFlagBit?: int, iResourceFlags?: int, isSetting?: bool) {
                if (iFlagBit == <number>EResourceItemEvents.k_Loaded && isSetting) {
                    fnCallback();
                }
            };

            pWaiterResouse.notifyLoaded();

            for (var n: uint = 0; n < <number>EResourceFamilies.TOTAL_RESOURCE_FAMILIES; n ++) {
                for (var i: int = 0; i < ResourcePoolManager.pTypedResourseTotal[n]; i ++) {
                    pPool = this.findResourcePool(new ResourceCode(n, i));

                    if (pPool) {
                        var pResources: IResourcePoolItem[] = pPool.getResources();
                        var pResource: IResourcePoolItem;

                        for (var i: int = 0; i < pResources.length; ++ i) {
                            pResource = pResources[i];
                            pWaiterResouse.connect(pResource, EResourceItemEvents.k_Loaded);
                        }
                    }

                }
            }

            if (pWaiterResouse.isResourceLoaded()) {
                fnCallback();
            }
            else {
                pWaiterResouse.setChangesNotifyRoutine(fnResCallback);
            }
        }

        destroyAll(): void {
            for (var i: int = 0; i < <number>EResourceFamilies.TOTAL_RESOURCE_FAMILIES; i ++) {
                this.destroyResourceFamily(<EResourceFamilies><number>i);
            }
        }

        restoreAll(): void {
            for (var i: int = 0; i < <number>EResourceFamilies.TOTAL_RESOURCE_FAMILIES; i ++) {
                this.restoreResourceFamily(<EResourceFamilies><number>i);
            }
        }

        disableAll(): void {
            for (var i: int = 0; i < <number>EResourceFamilies.TOTAL_RESOURCE_FAMILIES; i ++) {
                this.disableResourceFamily(<EResourceFamilies><number>i);
            }
        }


        clean(): void {
            for (var i: int = 0; i < <number>EResourceFamilies.TOTAL_RESOURCE_FAMILIES; i ++) {
                this.cleanResourceFamily(<EResourceFamilies><number>i);
            }
        }

        createDeviceResources(): bool {
            return true;
        }

        destroyDeviceResources(): bool {
            this.disableDeviceResources();

// then destroy...
            debug_print("Destroying Video Device Resources\n");

            this.destroyResourceFamily(EResourceFamilies.VIDEO_RESOURCE);

            return true;
        }

        restoreDeviceResources(): bool {
            debug_print("Restoring Video Device Resources\n");
            this.restoreResourceFamily(EResourceFamilies.VIDEO_RESOURCE);
            return true;
        }

        disableDeviceResources(): bool {
            debug_print("Disabling Video Device Resources\n");
            this.disableResourceFamily(EResourceFamilies.VIDEO_RESOURCE);
            return true;
        }

        /**@inline*/  getEngine(): IEngine { return this.pEngine; }

        private createDeviceResource(): void {
            this.pSurfaceMaterialPool = new ResourcePool(this, resources.SurfaceMaterial);
            this.pSurfaceMaterialPool.initialize(16);

            this.pEffectPool = new ResourcePool(this, resources.Effect);
            this.pEffectPool.initialize(16);

            this.pRenderMethodPool = new ResourcePool(this, resources.RenderMethod);
            this.pRenderMethodPool.initialize(16);

            this.pVertexBufferPool = new ResourcePool(this, resources.VertexBufferVBO);
            this.pVertexBufferPool.initialize(16);

            this.pIndexBufferPool = new ResourcePool(this, resources.IndexBuffer);
            this.pIndexBufferPool.initialize(16);

            this.pModelPool = new ResourcePool(this, resources.Model);
            this.pModelPool.initialize(16);

            this.pImagePool = new ResourcePool(this, resources.Img);
            this.pImagePool.initialize(16);

            this.pTexturePool = new ResourcePool(this, resources.Texture);
            this.pTexturePool.initialize(16);

            this.pVideoBufferPool = new ResourcePool(this, resources.VertexBufferTBO);
            this.pVideoBufferPool.initialize(16);

            this.pShaderProgramPool = new ResourcePool(this, resources.ShaderProgram);
            this.pShaderProgramPool.initialize(16);

            this.pComponentPool = new ResourcePool(this, resources.Component);
            this.pComponentPool.initialize(16);
        }

        private registerDeviceResources(): void {
            debug_print("Registering Video Device Resources\n");
            this.pTexturePool.registerResourcePool(
                new ResourceCode(
                    <number>EResourceFamilies.VIDEO_RESOURCE,
                    <number>EVideoResources.TEXTURE_RESOURCE));
            this.pVertexBufferPool.registerResourcePool(
                new ResourceCode(
                    <number>EResourceFamilies.VIDEO_RESOURCE,
                    <number>EVideoResources.VERTEXBUFFER_RESOURCE));
            this.pIndexBufferPool.registerResourcePool(
                new ResourceCode(
                    <number>EResourceFamilies.VIDEO_RESOURCE,
                    <number>EVideoResources.INDEXBUFFER_RESOURCE));
            this.pEffectPool.registerResourcePool(
                new ResourceCode(
                    <number>EResourceFamilies.VIDEO_RESOURCE,
                    <number>EVideoResources.EFFECT_RESOURCE));
            this.pRenderMethodPool.registerResourcePool(
                new ResourceCode(
                    <number>EResourceFamilies.VIDEO_RESOURCE,
                    <number>EVideoResources.RENDERMETHOD_RESOURCE));
            this.pModelPool.registerResourcePool(
                new ResourceCode(
                    <number>EResourceFamilies.VIDEO_RESOURCE,
                    <number>EVideoResources.MODEL_RESOURCE));
            this.pImagePool.registerResourcePool(
                new ResourceCode(
                    <number>EResourceFamilies.VIDEO_RESOURCE,
                    <number>EVideoResources.IMAGE_RESOURCE));
            this.pSurfaceMaterialPool.registerResourcePool(
                new ResourceCode(
                    <number>EResourceFamilies.VIDEO_RESOURCE,
                    <number>EVideoResources.SURFACEMATERIAL_RESOURCE));
            this.pVideoBufferPool.registerResourcePool(
                new ResourceCode(
                    <number>EResourceFamilies.VIDEO_RESOURCE,
                    <number>EVideoResources.VIDEOBUFFER_RESOURCE));
            this.pShaderProgramPool.registerResourcePool(
                new ResourceCode(
                    <number>EResourceFamilies.VIDEO_RESOURCE,
                    <number>EVideoResources.SHADERPROGRAM_RESOURCE));
            this.pComponentPool.registerResourcePool(
                new ResourceCode(
                    <number>EResourceFamilies.VIDEO_RESOURCE,
                    <number>EVideoResources.COMPONENT_RESOURCE));
        }

        private unregisterDeviceResources(): void {
            debug_print("Unregistering Video Device Resources");

            this.pTexturePool.unregisterResourcePool();
            this.pVertexBufferPool.unregisterResourcePool();
            this.pIndexBufferPool.unregisterResourcePool();
            this.pEffectPool.unregisterResourcePool();
            this.pRenderMethodPool.unregisterResourcePool();
            this.pModelPool.unregisterResourcePool();
            this.pImagePool.unregisterResourcePool();
            this.pSurfaceMaterialPool.unregisterResourcePool();
            this.pVideoBufferPool.unregisterResourcePool();
            this.pShaderProgramPool.unregisterResourcePool();
            this.pComponentPool.unregisterResourcePool();
        }

    	static private pTypedResourseTotal: uint[] = [
	        <number>EVideoResources.TOTAL_VIDEO_RESOURCES,
	        <number>EAudioResources.TOTAL_AUDIO_RESOURCES,
	        <number>EGameResources.TOTAL_GAME_RESOURCES
	    ];
    }
}




















module akra {
	export interface IBuffer {
//number of elements
		 length: int;

//size in bytes
		 byteLength: int;


	}
}



module akra {
	export enum EGPUBufferFlags {
		MANY_UPDATES = 0,
		MANY_DRAWS,
		READABLE,
		RAM_BACKUP,
		SOFTWARE,
		ALIGNMENT
	}

	export interface IGPUBuffer extends IBuffer {
		clone(pSrc: IGPUBuffer): bool;

		isValid(): bool;
		isDynamic(): bool;
		isStatic(): bool;
		isStream(): bool;
		isReadable(): bool;
		isRAMBufferPresent(): bool;
		isSoftware(): bool;

		getData(): ArrayBuffer;
		getData(iOffset: uint, iSize: uint): ArrayBuffer;
		setData(pData: ArrayBuffer, iOffset: uint, iSize: uint): bool;

		getFlags(): int;

		destroy(): void;
		create(iByteSize: uint, iFlags: int, pData: ArrayBuffer): bool;
		resize(iSize: uint): bool;
	}
}









module akra {
    export interface IRenderResource extends IResourcePoolItem {
        getHardwareObject(): WebGLObject;
    };
}






module akra {

    export interface IAFXComponent {} ;
    export interface IAFXEffect {} ;
    export interface IRenderableObject {} ;
    export interface IRenderSnapshot {} ;
    export interface ISceneObject {} ;
    export interface IBufferMap {} ;
    export interface IShaderProgram {} ;
    export interface ISurfaceMaterial {} ;
    export interface IVertexData {} ;
    export interface IVertexBuffer {} ;
    export interface ITexture {} ;
    export interface IIndexBuffer {} ;
    export interface IRenderResource {} ;
    export interface IRenderEntry {} ;
    export interface IFrameBuffer {} ;
    export interface IViewport {} ;
    export interface IColor {} ;


//API SPECIFIFC CONSTANTS

	export enum EPrimitiveTypes {
        POINTLIST = 0,
        LINELIST,
        LINELOOP,
        LINESTRIP,
        TRIANGLELIST,
        TRIANGLESTRIP,
        TRIANGLEFAN
    };

    export enum EGLSpecifics {
        UNPACK_ALIGNMENT = 0x0CF5,
        PACK_ALIGNMENT = 0x0D05,
        UNPACK_FLIP_Y_WEBGL = 0x9240,
        UNPACK_PREMULTIPLY_ALPHA_WEBGL = 0x9241,
        CONTEXT_LOST_WEBGL = 0x9242,
        UNPACK_COLORSPACE_CONVERSION_WEBGL = 0x9243,
        BROWSER_DEFAULT_WEBGL = 0x9244
    };

    export enum EBufferMasks {
        DEPTH_BUFFER_BIT               = 0x00000100,
        STENCIL_BUFFER_BIT             = 0x00000400,
        COLOR_BUFFER_BIT               = 0x00004000
    };

    export enum EBufferUsages {
        STREAM_DRAW = 0x88E0,
        STATIC_DRAW = 0x88E4,
        DYNAMIC_DRAW = 0x88E8
    };

    export enum EBufferTypes {
        ARRAY_BUFFER = 0x8892,
        ELEMENT_ARRAY_BUFFER = 0x8893,
        FRAME_BUFFER = 0x8D40,
        RENDER_BUFFER = 0x8D41
    };

    export enum EAttachmentTypes {
        COLOR_ATTACHMENT0 = 0x8CE0,
        DEPTH_ATTACHMENT = 0x8D00,
        STENCIL_ATTACHMENT = 0x8D20,
        DEPTH_STENCIL_ATTACHMENT = 0x821A
    };

    export enum ERenderStates {
        ZENABLE = 7,
        ZWRITEENABLE = 14,
        SRCBLEND = 19,
        DESTBLEND = 20,
        CULLMODE = 22,
        ZFUNC = 23,
        DITHERENABLE = 26,
        ALPHABLENDENABLE = 27,
        ALPHATESTENABLE
    };

    export enum EBlendModes {
        ZERO = 0,
        ONE = 1,
        SRCCOLOR = 0x0300,
        INVSRCCOLOR = 0x301,
        SRCALPHA = 0x0302,
        INVSRCALPHA = 0x0303,
        DESTALPHA = 0x0304,
        INVDESTALPHA = 0x0305,
        DESTCOLOR = 0x0306,
        INVDESTCOLOR = 0x0307,
        SRCALPHASAT = 0x0308
    };

    export enum ECmpFuncs {
        NEVER = 1,
        LESS = 2,
        EQUAL = 3,
        LESSEQUAL = 4,
        GREATER = 5,
        NOTEQUAL = 6,
        GREATEREQUAL = 7,
        ALWAYS = 8
    };

    export enum ECullModes {
        NONE = 0,
//FRONT        CW = 0x404,
//BACK        CCW = 0x0405,
        FRONT_AND_BACK = 0x0408
    };

//END OF API SPECIFIC

	export enum ERenderStages {
		SHADOWS = 2,
		LIGHTING,
		GLOBALPOSTEFFECTS,
		DEFAULT
	}

    export interface IRenderer {
//// frendly for EffectResource

/** * Регистрация компонента эффекта. **/

    	registerComponent(pComponent: IAFXComponent): bool;
/** Активация компонента для эффект ресурса. */

    	activateComponent(pEffectResource: IAFXEffect, iComponentHandle: int, nShift?: uint): bool;
/** Деактивация компонента для эффект ресурса. */

    	deactivateComponent(pEffectResource: IAFXEffect, iComponentHandle: int, nShift?: uint): bool;
/** Get effect components number */

    	getComponentCount(pEffectResource: IAFXEffect): uint;

//// frendly for Snapshot
    	push(pRenderObject: IRenderableObject, pSnapshot: IRenderSnapshot): bool;
    	pop(): bool;

    	activatePass(pSnapshot: IRenderSnapshot, iPass: int): bool;
    	deactivatePass(pSnapshot: IRenderSnapshot): bool;

    	activateSceneObject(pSceneObject: ISceneObject): void;
    	deactivateSceneObject(): void;

    	finishPass(iPass: int): bool;

    	applyBufferMap(pMap: IBufferMap): bool;
    	applyVertexData(pData: IVertexData, ePrimType: EPrimitiveTypes): bool;
    	applyFrameBufferTexture(pTexture: ITexture, eAttachment: EAttachmentTypes, eTexTarget: ETextureTypes, iLevel?: uint): bool;
    	applySurfaceMaterial(pMaterial: ISurfaceMaterial): bool;

    	getUniformRealName(sName: string): string;
    	getTextureRealName(sName: string): string;
    	getActiveProgram(): IShaderProgram;
    	getActiveTexture(iSlot: uint): ITexture;
    	getTextureSlot(pTexture: ITexture): uint;
    	getFrameBuffer(iFrameBuffer?: int): IFrameBuffer;

    	isUniformTypeBase(sRealName: string): bool;

		totalPasses(pEffect: IAFXEffect): uint;

//frendly for ShaderProgram

    	activateTexture(pTexture: ITexture): bool;
    	activateVertexBuffer(pBuffer: IVertexBuffer): bool;
    	activateIndexBuffer(pBuffer: IIndexBuffer): bool;
    	activateProgram(pProgram: IShaderProgram): bool;
    	activateFrameBuffer(pFrameBuffer: IFrameBuffer): bool;
    	deactivateFrameBuffer(pFrameBuffer: IFrameBuffer): bool;

    	getRenderResourceState(pResource: IRenderResource): int;


//// frendly for resources

    	registerRenderResource(pResource: IRenderResource): void;
    	releaseRenderResource(pResource: IRenderResource): void;
/** Регистрация нового эффект ресурса. */

        registerEffect(pEffectResource: IAFXEffect): bool;

//// frendly for Texture

    	bindTexture(pTexture: ITexture): bool;
    	unbindTexture(): bool;


//// frendly for render queue
    	render(pEntry: IRenderEntry): void;


///public API
    	findEffect(sName?: string): IAFXEffect;
    	clearScreen(eValue: EBufferMasks, c4Color: IColor): void;
    	switchRenderStage(eType: ERenderStages): void;
    	processRenderStage(): bool;
    	updateScreen(): bool;
/** Load *.fx file or *.abf */

        loadEffectFile(sFilename: string, isSync?: bool): bool;

        debug(bValue?: bool, bTrace?: bool): bool;
        isDeviceLost(): bool;
    }
}



module akra {

	export interface IIndexData {} ;

	export interface IIndexBuffer extends IGPUBuffer, IRenderResource {

		getIndexData(iOffset: uint, iCount: uint, ePrimitiveType: EPrimitiveTypes, eElementsType: EDataTypes): IIndexData;
		getEmptyIndexData(iCount: uint, ePrimitiveType: EPrimitiveTypes, eElementsType: EDataTypes): IIndexData;

		freeIndexData(pIndexData: IIndexData): bool;


		allocateData(ePrimitiveType: EPrimitiveTypes, eElementsType: EDataTypes, pData: ArrayBufferView): IIndexData;
		getCountIndexForStripGrid(iXVerts: int, iYVerts: int): int;
	}
}





module akra.core.pool.resources {
	export class IndexBuffer extends ResourcePoolItem implements IIndexBuffer {

		/**@inline*/  get byteLength(): uint {
			return 0;
		}

		/**@inline*/  get length(): uint {
			return 0;
		}

		clone(pSrc: IGPUBuffer): bool {
			return false;
		}

		isValid(): bool {
			return false;
		}

		isDynamic(): bool {
			return false;
		}

		isStatic(): bool {
			return false;
		}

		isStream(): bool {
			return false;
		}

		isReadable(): bool {
			return false;
		}

		isRAMBufferPresent(): bool {
			return false;
		}

		isSoftware(): bool {
			return false;
		}

		getData(): ArrayBuffer;
		getData(iOffset?: uint, iSize?: uint): ArrayBuffer {
			return null;
		}

		setData(pData: ArrayBuffer, iOffset: uint, iSize: uint): bool {
			return false;
		}




		/**@inline*/  getFlags(): int {
			return 0;
		}

		getIndexData(iOffset: uint, iCount: uint, ePrimitiveType: EPrimitiveTypes, eElementsType: EDataTypes): IIndexData {
			return null;
		}

		getEmptyIndexData(iCount: uint, ePrimitiveType: EPrimitiveTypes, eElementsType: EDataTypes): IIndexData {
			return null;
		}

		freeIndexData(pIndexData: IIndexData): bool {
			return false;
		}


		allocateData(ePrimitiveType: EPrimitiveTypes, eElementsType: EDataTypes, pData: ArrayBufferView): IIndexData {
			return null;
		}

		getCountIndexForStripGrid(iXVerts: int, iYVerts: int): int {
			return 0;
		}

		/**@inline*/  getHardwareObject(): WebGLObject {
			return null;
		}

		destroy(): void {}
		create(iByteSize: uint, iFlags: int, pData: ArrayBuffer): bool { return false; }
		resize(iSize: uint): bool { return false; }
	}
}
















module akra {
	export interface IBufferData {
		offset: uint;
		byteLength: uint;
		buffer: IBuffer;
	}
}



module akra {
	export interface IBufferDataModifier {} ;
	export interface IVertexDeclaration {} ;
	export interface IVertexBuffer {} ;
	export interface IEventProvider {} ;

	export interface IVertexData extends IBufferData, IBuffer, IEventProvider {
		 stride: uint;
		 startIndex: uint;

		getVertexDeclaration(): IVertexDeclaration;
		setVertexDeclaration(pDecl: IVertexDeclaration): bool;

		getVertexElementCount(): uint;
		hasSemantics(sSemantics: string): bool;

		destroy(): void;

		extend(pDecl: IVertexDeclaration, pData?: ArrayBufferView): bool;
		resize(nCount: uint, pDecl?: IVertexDeclaration): bool;
		resize(nCount: uint, iStride?: uint): bool;
		applyModifier(sUsage: string, fnModifier: IBufferDataModifier): bool;

		setData(pData: ArrayBufferView, iOffset: int, iSize?: uint, nCountStart?: uint, nCount?: uint): bool;
		setData(pData: ArrayBufferView, sUsage?: string, iSize?: uint, nCountStart?: uint, nCount?: uint): bool;

		getData(): ArrayBuffer;
		getData(iOffset: int, iSize: uint, iFrom?: uint, iCount?: uint): ArrayBuffer;
		getData(sUsage: string): ArrayBuffer;
		getData(sUsage: string, iFrom: uint, iCount: uint): ArrayBuffer;

		getTypedData(sUsage: string, iFrom?: int, iCount?: uint): ArrayBufferView;
		getBufferHandle(): int;

		toString(): string;
	}
}















module akra {

	export interface IVertexData {} ;
	export interface IVertexElement {} ;
	export interface IVertexDeclaration {} ;

	export enum EVertexBufferTypes {
		TYPE_UNKNOWN,
		TYPE_VBO,
		TYPE_TBO
	};

	export interface IVertexBuffer extends IGPUBuffer, IResourcePoolItem {

		 type: EVertexBufferTypes;

		getVertexData(iOffset: uint, iCount: uint, pElements: IVertexElement[]): IVertexData;
		getVertexData(iOffset: uint, iCount: uint, pDecl: IVertexDeclaration): IVertexData;

		getEmptyVertexData(iCount: uint, pElements: IVertexElement[], ppVertexDataIn?: IVertexData): IVertexData;
		getEmptyVertexData(iCount: uint, pDecl: IVertexDeclaration, ppVertexDataIn?: IVertexData): IVertexData;
		getEmptyVertexData(iCount: uint, pSize: uint, ppVertexDataIn?: IVertexData): IVertexData;

		freeVertexData(pVertexData: IVertexData): bool;

		allocateData(pElements: IVertexElement[], pData: ArrayBufferView): IVertexData;
		allocateData(pDecl: IVertexDeclaration, pData: ArrayBufferView): IVertexData;
	}
}






module akra {
	export interface IVertexBufferVBO extends IVertexBuffer, IRenderResource {


	}
}






















module akra {
	export interface IVertexElement {
		count: uint;
		type: EDataTypes;
		usage: string;
		offset: int;
		size: uint;
		index: uint;
		semantics: string;

		clone(): IVertexElement;

//DEBUG!!
		toString(): string;
	}
}








module akra {
	export interface IBufferDataModifier {
		(pData: ArrayBufferView): void;
	}
}










module akra {
	export interface IEventSlot {
		target: any;
		callback: string;
		listener: Function;
	}

	export interface IEventSlotMap {
		[index: string]: IEventSlot[];
	}

	export interface IEventSlotTable {
		[index: number]: IEventSlotMap;
		[index: string]: IEventSlotMap;
	}

	export interface IEventSlotList {
		[index: number]: {[index: string]: IEventSlot;};
		[index: string]: {[index: string]: IEventSlot;};
	}

	export interface IEventTable {
		broadcast: IEventSlotTable;
		unicast: IEventSlotList;

		addDestination(iGuid: int, sSignal: string, pTarget: IEventProvider, sSlot: string, eType?: EEventTypes): bool;
		addListener(iGuid: int, sSignal: string, fnListener: Function, eType?: EEventTypes): bool;
	}
}






module akra {
	export interface IEventTable {} ;

	export enum EEventTypes {
		BROADCAST,
		UNICAST
	};

	export interface IEventProvider {
		getGuid(): uint;
		getEventTable(): IEventTable;
		connect(pSender: IEventProvider, sSignal: string, sSlot: string, eType?: EEventTypes): bool;
	}
}



















module akra.events {
	export class EventTable implements IEventTable {
		broadcast: IEventSlotTable = <IEventSlotTable>{};
		unicast: IEventSlotList = <IEventSlotList>{};

		addDestination(iGuid: int, sSignal: string, pTarget: IEventProvider, sSlot: string, eType: EEventTypes = EEventTypes.BROADCAST): bool {
			if (eType === EEventTypes.BROADCAST) {
				this.findBroadcastList(iGuid, sSignal).push({target: pTarget, callback: sSlot, listener: null});
			}
			else {
				this.unicast[iGuid] = this.unicast[iGuid] || {};
				this.unicast[iGuid][sSignal] = {target: pTarget, callback: sSlot, listener: null};
			}
			return true;
		}

		addListener(iGuid: int, sSignal: string, fnListener: Function, eType: EEventTypes = EEventTypes.BROADCAST): bool {
			if (eType === EEventTypes.BROADCAST) {
				this.findBroadcastList(iGuid, sSignal).push({target: null, callback: null, listener: fnListener});
			}
			else {
				this.unicast[iGuid] = this.unicast[iGuid] || {};
				this.unicast[iGuid][sSignal] = {target: null, callback: null, listener: fnListener};
			}
			return true;
		}

		private findBroadcastList(iGuid: int, sSignal: string): IEventSlot[] {
			this.broadcast[iGuid] = this.broadcast[iGuid] || {};
			this.broadcast[iGuid][sSignal] = this.broadcast[iGuid][sSignal] || [];
			return this.broadcast[iGuid][sSignal];
		}

		private
	}
}




module akra.data {

	export enum EVertexDataLimits {
		k_MaxElementsSize = 256
	};

	export class VertexData implements IVertexData {
		private _pVertexBuffer: IVertexBuffer;
		private _iOffset: uint;
		private _iStride: uint;
		private _iLength: uint;
		private _pVertexDeclaration: IVertexDeclaration;
		private _iId: uint;

		/**@inline*/  get id(): uint { return this._iId; }
		/**@inline*/  get length(): uint { return this._iLength; };
		/**@inline*/  get offset(): uint { return this._iOffset; };
		/**@inline*/  get byteLength(): uint { return this._iLength * this._iStride; };
		/**@inline*/  get buffer(): IVertexBuffer { return this._pVertexBuffer; };
		/**@inline*/  get stride(): uint { return this._iStride; };
		/**@inline*/  get startIndex(): uint {
			var iIndex: uint = this.offset / this.stride;
    		debug_assert(iIndex % 1 == 0, "cannot calc first element index");
   			return iIndex;
   		};


		constructor (pVertexBuffer: IVertexBuffer, id: uint, iOffset: uint, iCount: uint, nSize: uint);
		constructor (pVertexBuffer: IVertexBuffer, id: uint, iOffset: uint, iCount: uint, pDecl: IVertexDeclaration);
		constructor (pVertexBuffer: IVertexBuffer, id: uint, iOffset: uint, iCount: uint, pDecl: any) {

			this._pVertexBuffer = pVertexBuffer;
			this._iOffset = iOffset;
			this._iLength = iCount;
			this._iId = id;
			this._pVertexDeclaration = null;
			this._iStride = 0;

			if (isInt(pDecl)) {
				this._iStride = <uint>pDecl;
			}
			else {
				this.setVertexDeclaration(pDecl);
			}

			debug_assert(pVertexBuffer.byteLength >= this.byteLength + this.offset, "vertex data out of array linits");
		}



		getVertexDeclaration(): IVertexDeclaration {
			return this._pVertexDeclaration;
		}

		setVertexDeclaration(pDecl: IVertexDeclaration): bool {
			if (this._pVertexDeclaration) {
				debug_error("vertex declaration already exists");

				return false;
			}

			var iStride: uint = pDecl.stride;

		    this._pVertexDeclaration = pDecl.clone();


		    debug_assert(iStride < <number>EVertexDataLimits.k_MaxElementsSize, "stride max is 255 bytes");
		    debug_assert(iStride <= this.stride, "stride in VertexDeclaration grather than stride in construtor");

		    return true;
		}

		/**@inline*/  getVertexElementCount(): uint {
			return this._pVertexDeclaration.length;
		}

		hasSemantics(sUsage: string): bool {
			if (this._pVertexDeclaration != null) {
		        return this._pVertexDeclaration.hasSemantics(sUsage);
		    }

		    return false;
		}

		destroy(): void {
			this._pVertexDeclaration = null;
    		this._iLength = 0;
		}

		extend(pDecl: IVertexDeclaration, pData: ArrayBufferView = null): bool {
			pDecl = createVertexDeclaration(pDecl);

			if (isNull(pData)) {
				pData = new Uint8Array(this.length * pDecl.stride);
			}
			else {
				pData = new Uint8Array(pData.buffer);
			}

		    debug_assert(this.length === pData.byteLength / pDecl.stride, 'invalid data size for extending');

		    var nCount: uint = this._iLength;
//strides modifications
		    var nStrideNew: uint = pDecl.stride;
		    var nStridePrev: uint = this.stride;
		    var nStrideNext: uint = nStridePrev + nStrideNew;
//total bytes after extending
		    var nTotalSize: uint = nStrideNext * this.length;
		    var pDeclNew: IVertexDeclaration = this.getVertexDeclaration().clone();

//data migration
		    var pDataPrev: Uint8Array = new Uint8Array(<ArrayBuffer>this.getData());
		    var pDataNext: Uint8Array = new Uint8Array(nTotalSize);

		    for (var i: int = 0, iOffset: int; i < nCount; ++i) {
		        iOffset = i * nStrideNext;
		        pDataNext.set(pDataPrev.subarray(i * nStridePrev, (i + 1) * nStridePrev), iOffset);
		        pDataNext.set((<Uint8Array>pData).subarray(i * nStrideNew, (i + 1) * nStrideNew), iOffset + nStridePrev);
		    }

		    if (!pDeclNew.extend(pDecl)) {
		        return false;
		    }

		    if (!this.resize(nCount, pDeclNew)) {
		        return false;
		    }

		    return this.setData(pDataNext, 0, nStrideNext);
		}


		resize(nCount: uint, pDecl?: IVertexDeclaration): bool;
		resize(nCount: uint, iStride?: uint): bool;
		resize(nCount: uint, pDecl?: any) {
			var iStride: uint = 0;
		    var iOldOffset: uint = this.offset;
		    var pOldVertexBuffer: IVertexBuffer;
		    var pOldVertexDeclaration: IVertexDeclaration;
		    var iOldStride: uint

		    if (arguments.length == 2) {
		        if (isInt(pDecl)) {
		            iStride = <uint>pDecl;
		        }
		        else {
		            iStride = (<IVertexDeclaration>pDecl).stride;
		        }

		        if (nCount * iStride <= this.byteLength) {
		            this._iLength = nCount;
		            this._iStride = iStride;
		            this._pVertexDeclaration = null;

		            if (!isInt(pDecl)) {
		                this.setVertexDeclaration(pDecl);
		            }

		            return true;
		        }
		        else {
		            pOldVertexBuffer = this.buffer;

		            pOldVertexBuffer.freeVertexData(this);

		            if (pOldVertexBuffer.getEmptyVertexData(nCount, pDecl, this) !== this) {
		                return false;
		            }

		            if (this.offset != iOldOffset) {
		                warning('vertex data moved from ' + iOldOffset + ' ---> ' + this.offset);
		                this.relocation(this, iOldOffset, this.offset);
		            }

		            return true;
		        }
		    }
		    else if (arguments.length == 1) {
		        if (nCount <= this.length) {
		            this._iLength = nCount;
		            return true;
		        }
		        else {
		            pOldVertexBuffer = this.buffer;
		            pOldVertexDeclaration = this.getVertexDeclaration();
		            iOldStride = this.stride;

		            pOldVertexBuffer.freeVertexData(this);

		            if (pOldVertexBuffer.getEmptyVertexData(nCount, iOldStride, this) == null) {
		                return false;
		            }

		            this.setVertexDeclaration(pOldVertexDeclaration);

		            if (this.offset != iOldOffset) {
		                warning('vertex data moved from ' + iOldOffset + ' ---> ' + this.offset);
		                this.relocation(this, iOldOffset, this.offset);
		            }

		            return true;
		        }
		    }

		    return false;
		}

		applyModifier(sUsage: string, fnModifier: IBufferDataModifier): bool {
			var pData = this.getTypedData(sUsage);
		    fnModifier(pData);
		    return this.setData(pData, sUsage);
		}

		setData(pData: ArrayBufferView, iOffset: int, iSize?: uint, nCountStart?: uint, nCount?: uint): bool;
		setData(pData: ArrayBufferView, sUsage?: string, iSize?: uint, nCountStart?: uint, nCount?: uint): bool;
		setData(pData: ArrayBufferView, iOffset?: any, iSize?: uint, nCountStart?: uint, nCount?: uint): bool {
			var iStride: uint;
			var pVertexBuffer: IVertexBuffer = this._pVertexBuffer;
			var pBackupBuf: Uint8Array;
			var pDataU8: Uint8Array;
			var k: uint;
			var iOffsetBuffer: uint;
			var pDeclaration: IVertexDeclaration = this._pVertexDeclaration;
			var pElement: IVertexElement;

			switch (arguments.length) {
		        case 5:
		            iStride = this.stride;
		            if (iStride != iSize) {
//FIXME: очень тормознутое место, крайне медленно работает...
						if(pVertexBuffer.isRAMBufferPresent() && nCount > 1) {
							pBackupBuf = new Uint8Array(this._pVertexBuffer.getData());
							pDataU8 = new Uint8Array(pData.buffer);
							iOffsetBuffer = this.offset;

							for (var i = nCountStart; i < nCount + nCountStart; i++) {
								for(k = 0; k < iSize; k++) {
									pBackupBuf[iStride * i + iOffset + iOffsetBuffer + k] = pDataU8[iSize * (i - nCountStart) + k];
								}
							}

							pVertexBuffer.setData(pBackupBuf.buffer, 0, pVertexBuffer.byteLength);
						}
						else {
							for (var i: uint = nCountStart; i < nCount + nCountStart; i++) {
								pVertexBuffer.setData(
										pData.buffer.slice(
											iSize * (i - nCountStart),
											iSize * (i - nCountStart) + iSize),
										iStride * i + iOffset + this.offset,
										iSize);
							}
						}
		            }
		            else {
		                pVertexBuffer.setData(pData.buffer.slice(0, iStride * nCount), iOffset + this.offset,
		                    iStride * nCount);
		            }
		            return true;
		        case 4:
		            pElement = null;

		            if (isString(arguments[1])) {
		                pElement = pDeclaration.findElement(arguments[1]);

		                if (pElement) {
		                    return this.setData(
		                        pData,
		                        pElement.offset,
		                        pElement.size,
		                        arguments[2],
		                        arguments[3]);
		                }

		                return false;
		            }

		            nCountStart = nCountStart || 0;

		            if (!nCount) {
		                nCount = pData.buffer.byteLength / iSize;
		            }

		            return this.setData(pData, iOffset, iSize, nCountStart, nCount);


		        case 2:
		        case 3:
		            var pDeclaration = this._pVertexDeclaration,
		                pElement = null;

		            if (isString(arguments[1])) {
		                pElement = pDeclaration.findElement(arguments[1]);

		                if (pElement) {
		                    arguments[2] = arguments[2] || 0;

		                    if (!arguments[3]) {
		                        arguments[3] = pData.buffer.byteLength / pElement.size;
		                    }

		                    return this.setData(
		                    	pData,
		                        pElement.offset,
		                        pElement.size,
		                        arguments[2],
		                        arguments[3])
		                }
		                return false
		            }
		            else if (arguments.length === 3) {

		                nCountStart = nCountStart || 0;

		                if (!nCount) {
		                    nCount = pData.byteLength / iSize;
		                }

		                return this.setData(pData, iOffset, iSize, nCountStart, nCount);
		            }

		            return false;
		        case 1:
		            return this.setData(pData, this._pVertexDeclaration[0].eUsage);
		        default:
		            return false;
		    }
		}


		getData(): ArrayBuffer;
		getData(iOffset: int, iSize: uint, iFrom?: uint, iCount?: uint): ArrayBuffer;
		getData(sUsage: string): ArrayBuffer;
		getData(sUsage: string, iFrom: uint, iCount: uint): ArrayBuffer;
		getData(iOffset?: any, iSize?: any, iFrom?: any, iCount?: any): ArrayBuffer {
			switch (arguments.length) {
		        case 4:
		        case 2:
		            if (isString(arguments[0])) {
						return null;
		            }

		            iFrom = iFrom || 0;
		            iCount = iCount || this._iLength;
		            iCount = math.min(iCount, this._iLength);

		            var iStride: uint = this.stride;
		            var pBufferData: Uint8Array = new Uint8Array(iSize * this.length);

		            for (var i: int = iFrom; i < iCount; i++) {
		                pBufferData.set(
		                	new Uint8Array(
		                		this._pVertexBuffer.getData(iStride * i + iOffset + this.offset, iSize)),
		                		i * iSize);
		            }

		            return pBufferData.buffer;
		        case 3:
		        case 1:
		            var pDeclaration: IVertexDeclaration = this._pVertexDeclaration,
		                pElement: IVertexElement = null;

		            if (isString("string")) {
		                pElement = pDeclaration.findElement(arguments[0]);

		                if (pElement) {
		                    return this.getData(
		                        pElement.offset,
		                        pElement.size,
		                        arguments[1],
		                        arguments[2]
		                        )
		                }
		                return null;
		            }

		            return null;

		        case 0:
		            return this.getData(0, this._pVertexDeclaration.stride);
		        default:
		            return null;
		    }
		}

		getTypedData(sUsage: string, iFrom?: int, iCount?: uint): ArrayBufferView {
		    sUsage = sUsage || this._pVertexDeclaration[0].sUsage;

		    var pVertexElement: IVertexElement = this._pVertexDeclaration.findElement(sUsage);

		    if (pVertexElement) {
		        return ab2ta(this.getData(sUsage, iFrom, iCount), pVertexElement.type);
		    }

		    return null;
		}

		/**@inline*/  getBufferHandle(): int {
			return this._pVertexBuffer.resourceHandle;
		}

		toString(): string {
		    if ( DEBUG ) {

			    var s: string = "";

			    s += "          VERTEX DATA  #" + this.id + "\n";
			    s += "---------------+-----------------------\n";
			    s += "        BUFFER : " + this.getBufferHandle() + "\n";
			    s += "          SIZE : " + this.byteLength + " b.\n";
			    s += "        OFFSET : " + this.offset + " b.\n";
			    s += "---------------+-----------------------\n";
			    s += " MEMBERS COUNT : " + this.length + " \n";
			    s += "        STRIDE : " + this.stride + " \n";
			    s += "---------------+-----------------------\n";
			    s += this.getVertexDeclaration().toString();

			    return s;
		    }

		    return null;
		}



		private _iGuid: uint = sid(); private static _pEvenetTable: IEventTable = new events.EventTable(); /**@inline*/ getEventTable(): IEventTable {return VertexData._pEvenetTable; } /**@inline*/ getGuid(): uint {return this._iGuid; } /**@inline*/ connect(pSender: IEventProvider, sSignal: string, sSlot: string, eType?: EEventTypes): bool { return pSender.getEventTable().addDestination(pSender.getGuid(), sSignal, this, sSlot, eType); }; /**@inline*/ bind(sSignal: string, fnListener: Function, eType?: EEventTypes): bool { return this.getEventTable().addListener(this.getGuid(), sSignal, fnListener, eType); } ;
			relocation (pTarget, iFrom, iTo) : void { var broadcast: IEventSlot[] = (this.getEventTable()).broadcast[this._iGuid]["relocation"]; for (var i = 0; i < broadcast.length; ++ i) { broadcast[i].target? broadcast[i].target[broadcast[i].callback] (pTarget, iFrom, iTo) : broadcast[i].listener (pTarget, iFrom, iTo) ; } } ; ;
		;

	}

}





module akra.core.pool.resources {
	interface IBufferHole {
		start: uint;
		end: uint;
	}

	export class VertexBuffer extends ResourcePoolItem implements IVertexBuffer {
		 _pBackupCopy: ArrayBuffer = null;
		 _iFlags: int = 0;
		 _pVertexDataArray: IVertexData[] = [];
		 _iDataCounter: uint = 0;

		/**@inline*/  get type(): EVertexBufferTypes { return EVertexBufferTypes.TYPE_UNKNOWN; }

		/**@inline*/  get byteLength(): uint {
			return 0;
		}

		/**@inline*/  get length(): uint {
			return 0;
		}

		constructor (pManager: IResourcePoolManager) {
			super(pManager);

		}

		clone(pSrc: IGPUBuffer): bool {
			var pBuffer: IVertexBuffer = <IVertexBuffer> pSrc;

// destroy any local data
			this.destroy();

			return this.create(pBuffer.byteLength, pBuffer.getFlags(), pBuffer.getData());
		}

		isValid(): bool {
			return false;
		}

		isDynamic(): bool {
			return ( ((this._iFlags & (1 << (EGPUBufferFlags.MANY_UPDATES)) ) != 0)  &&
    	   		((this._iFlags & (1 << (EGPUBufferFlags.MANY_DRAWS)) ) != 0) );
		}

		isStatic(): bool {
			return ((! ((this._iFlags & (1 << (EGPUBufferFlags.MANY_UPDATES)) ) != 0) ) &&
				((this._iFlags & (1 << (EGPUBufferFlags.MANY_DRAWS)) ) != 0) );
		}

		isStream(): bool {
			return (! ((this._iFlags & (1 << (EGPUBufferFlags.MANY_UPDATES)) ) != 0) ) &&
					(! ((this._iFlags & (1 << (EGPUBufferFlags.MANY_DRAWS)) ) != 0) );
		}

		isReadable(): bool {
//Вроде как на данный момент нельхзя в вебЖл считывать буферы из видио памяти
//(но нужно ли это вообще и есть ли смысл просто обратиться к локальной копии)
			return  ((this._iFlags & (1 << (EGPUBufferFlags.READABLE)) ) != 0) ;
		}

		isRAMBufferPresent(): bool {
			return this._pBackupCopy != null;
		}

		isSoftware(): bool {
//на данный момент у нас нету понятия софтварной обработки и рендеренга
    		return  ((this._iFlags & (1 << (EGPUBufferFlags.SOFTWARE)) ) != 0) ;
		}

		isAlignment(): bool {
			return  ((this._iFlags & (1 << (EGPUBufferFlags.ALIGNMENT)) ) != 0) ;
		}

		getData(): ArrayBuffer;
		getData(iOffset?: uint, iSize?: uint): ArrayBuffer {
			return null;
		}

		setData(pData: ArrayBuffer, iOffset: uint, iSize: uint): bool {
			return false;
		}

		/**@inline*/  getFlags(): int {
			return this._iFlags;
		}


		getVertexData(iOffset: uint, iCount: uint, pElements: IVertexElement[]): IVertexData;
		getVertexData(iOffset: uint, iCount: uint, pDecl: IVertexDeclaration): IVertexData;
		getVertexData(iOffset: uint, iCount: uint, pData: any): IVertexData {
			var pDecl: IVertexDeclaration = createVertexDeclaration(pData);
			var pVertexData: IVertexData = new data.VertexData(this, this._iDataCounter ++, iOffset, iCount, pDecl);

			this._pVertexDataArray.push(pVertexData);
			return pVertexData;
		}


		getEmptyVertexData(iCount: uint, pElements: IVertexElement[], ppVertexDataIn?: IVertexData): IVertexData;
		getEmptyVertexData(iCount: uint, pDecl: IVertexDeclaration, ppVertexDataIn?: IVertexData): IVertexData;
		getEmptyVertexData(iCount: uint, pSize: uint, ppVertexDataIn?: IVertexData): IVertexData;
		getEmptyVertexData(iCount: uint, pDeclData: any, ppVertexDataIn?: IVertexData): IVertexData {
			var pDecl: IVertexDeclaration;
			var pHole: IBufferHole[] = [];
			var i: int;
			var pVertexData: IVertexData;
			var iTemp: int;
			var iStride: int = 0;
			var iAligStart: int;

			while(true) {

				pHole[0] = {start:0, end: this.byteLength};

				for(var k: uint = 0; k < this._pVertexDataArray.length; ++ k) {
					pVertexData = this._pVertexDataArray[k];

					for(i = 0; i < pHole.length; i++) {
//Полностью попадает внутрь
						if(pVertexData.offset > pHole[i].start &&
							pVertexData.offset + pVertexData.byteLength < pHole[i].end) {
							iTemp = pHole[i].end;
							pHole[i].end=pVertexData.offset;
							pHole.splice(i + 1, 0, {start: pVertexData.offset + pVertexData.byteLength, end: iTemp});
							i--;
						}
						else if(pVertexData.offset == pHole[i].start &&
							pVertexData.offset + pVertexData.byteLength < pHole[i].end) {
							pHole[i].start = pVertexData.offset + pVertexData.byteLength;
						}
						else if(pVertexData.offset > pHole[i].start &&
							pVertexData.offset + pVertexData.byteLength == pHole[i].end) {

						}
						else if(pVertexData.offset == pHole[i].start &&
							pVertexData.byteLength == (pHole[i].end - pHole[i].start)) {
							pHole.splice(i, 1);
							i--;
						}
//Перекрывает снизу
						else if(pVertexData.offset < pHole[i].start &&
							pVertexData.offset + pVertexData.byteLength > pHole[i].start &&
							pVertexData.offset + pVertexData.byteLength < pHole[i].end) {
							pHole[i].start = pVertexData.offset + pVertexData.byteLength;
						}
						else if(pVertexData.offset < pHole[i].start &&
							pVertexData.offset + pVertexData.byteLength > pHole[i].start &&
							pVertexData.offset + pVertexData.byteLength == pHole[i].end) {
							pHole.splice(i,1);
							i--;
						}
//Перекрывается сверху
						else if(pVertexData.offset + pVertexData.byteLength > pHole[i].end &&
							pVertexData.offset > pHole[i].start && pVertexData.offset < pHole[i].end) {
							pHole[i].end=pVertexData.offset;
						}
						else if(pVertexData.offset + pVertexData.byteLength > pHole[i].end &&
							pVertexData.offset == pHole[i].start && pVertexData.offset < pHole[i].end) {
							pHole.splice(i,1);
							i--;
						}
//полнстью перекрывает
						else if(pVertexData.offset < pHole[i].start &&
							pVertexData.offset + pVertexData.byteLength > pHole[i].end) {
							i--;
						}
					}
				}


				pHole.sort((a: IBufferHole, b: IBufferHole): number => ((a.end - a.start) - (b.end - b.start)));



				if(isInt(pDeclData)) {
					pDecl = createVertexDeclaration(pDeclData);
					iStride = pDecl.stride;
				}
				else {
					iStride = pDeclData;
				}

				for (i = 0; i < pHole.length; i++) {
					iAligStart = this.isAlignment() ?
						math.alignUp(pHole[i].start, math.nok(iStride,4)):
						math.alignUp(pHole[i].start, iStride);

					if((pHole[i].end - iAligStart) >= iCount * iStride) {
						if(arguments.length == 2) {
							pVertexData = new data.VertexData(this, this._iDataCounter ++, iAligStart, iCount, pDeclData);
							this._pVertexDataArray.push(pVertexData);

							return pVertexData;
						}
						else if(arguments.length == 3) {
							((<any>ppVertexDataIn).constructor).call(ppVertexDataIn, this, iAligStart, iCount, pDeclData);
							this._pVertexDataArray.push(ppVertexDataIn);

							return ppVertexDataIn;
						}

						return null;
					}
				}

				if (this.resize(math.max(this.byteLength * 2, this.byteLength + iCount * iStride)) == false) {
					break;
				}
			}

			return null;
		}


		freeVertexData(pVertexData: IVertexData): bool {
			if(arguments.length == 0) {
				for(var i: uint = 0; i < this._pVertexDataArray.length; i ++) {
					this._pVertexDataArray[Number(i)].destroy();
				}

				this._pVertexDataArray = null;
			}
			else {
				for(var i: uint = 0; i < this._pVertexDataArray.length; i ++) {
					if(this._pVertexDataArray[i] == pVertexData) {
						this._pVertexDataArray.splice(i, 1);
						return true;
					}
				}

				pVertexData.destroy();

				return false;
			}
		}


		allocateData(pElements: IVertexElement[], pData: ArrayBufferView): IVertexData;
		allocateData(pDecl: IVertexDeclaration, pData: ArrayBufferView): IVertexData;
		allocateData(pDeclData: any, pData: ArrayBufferView): IVertexData {
			var pDecl: IVertexDeclaration = createVertexDeclaration(pDeclData);

			var pVertexData: IVertexData;
		    var iCount: uint = pData.byteLength / pDecl.stride;

		    debug_assert(iCount === math.floor(iCount), 'Data size should be a multiple of the vertex declaration.');

		    pVertexData = this.getEmptyVertexData(iCount, pDecl);
		    pVertexData.setData(pData, 0, pDecl.stride);

		    return pVertexData;
		}

		destroy(): void {}
		create(iByteSize: uint, iFlags: int, pData: ArrayBuffer): bool { return false; }
		resize(iSize: uint): bool { return false; }
	}
}



module akra.core.pool.resources {
	export class VertexBufferVBO extends VertexBuffer implements IVertexBufferVBO {
		/**@inline*/  get type(): EVertexBufferTypes { return EVertexBufferTypes.TYPE_VBO; }
		/**@inline*/  get byteLength(): uint { return 0; }
		/**@inline*/  get length(): uint { return 0; }

		/**@inline*/  getHardwareObject(): WebGLObject {
			return null;
		}

		constructor (pManager: IResourcePoolManager) {
			super(pManager);
		}
	}
}


















module akra {
	export interface IVertexBufferTBO extends IVertexBuffer, IRenderResource {


	}
}







module akra.core.pool.resources {
	export class VertexBufferTBO extends VertexBuffer implements IVertexBufferTBO {
		/**@inline*/  get type(): EVertexBufferTypes { return EVertexBufferTypes.TYPE_TBO; }
		/**@inline*/  get byteLength(): uint { return 0; }
		/**@inline*/  get length(): uint { return 0; }



		/**@inline*/  getHardwareObject(): WebGLObject {
			return null;
		}

		constructor (pManager: IResourcePoolManager) {
			super(pManager);
		}
	}


}













module akra {

    export interface IImg {} ;

	export enum ETextureFilters {
        NEAREST = 0x2600,
        LINEAR = 0x2601,
        NEAREST_MIPMAP_NEAREST = 0x2700,
        LINEAR_MIPMAP_NEAREST = 0x2701,
        NEAREST_MIPMAP_LINEAR = 0x2702,
        LINEAR_MIPMAP_LINEAR = 0x2703
    };

    export enum ETextureWrapModes {
        REPEAT = 0x2901,
        CLAMP_TO_EDGE = 0x812F,
        MIRRORED_REPEAT = 0x8370
    };

    export enum ETextureParameters {
        MAG_FILTER = 0x2800,
        MIN_FILTER,
        WRAP_S,
        WRAP_T
    };

    export enum ETextureTypes {
        TEXTURE_2D = 0x0DE1,
        TEXTURE = 0x1702,
        TEXTURE_CUBE_MAP = 0x8513,
        TEXTURE_BINDING_CUBE_MAP = 0x8514,
        TEXTURE_CUBE_MAP_POSITIVE_X = 0x8515,
        TEXTURE_CUBE_MAP_NEGATIVE_X = 0x8516,
        TEXTURE_CUBE_MAP_POSITIVE_Y = 0x8517,
        TEXTURE_CUBE_MAP_NEGATIVE_Y = 0x8518,
        TEXTURE_CUBE_MAP_POSITIVE_Z = 0x8519,
        TEXTURE_CUBE_MAP_NEGATIVE_Z = 0x851A,
        MAX_CUBE_MAP_TEXTURE_SIZE = 0x851C
    };

    export enum ETextureUnits {
        TEXTURE = 0x84C0
    };

    export interface ITexture extends IRenderResource {
    	width: uint;
        height: uint;

        type: EImageTypes;
        format: EImageFormats;


//number of color components per pixel. usually: 1, 3, 4
        componentsPerPixel: uint;
        bytesPerPixel: uint;

        magFilter: ETextureFilters;
        minFilter: ETextureFilters;

        wrapS: ETextureWrapModes;
        wrapT: ETextureWrapModes;

        target: ETextureTypes;
        mipLevels: uint;

        isTexture2D(): bool;
        isTextureCube(): bool;
        isCompressed(): bool;

        getParameter(): int;
        setParameter(eParam: ETextureParameters, eValue: ETextureFilters): void;
        setParameter(eParam: ETextureParameters, eValue: ETextureWrapModes): void;

        getPixels(
            iX?: uint,
            iY?: uint,
            iWidth?: uint,
            iHeight?: uint,
            ppPixelBuffer?: ArrayBufferView,
            iMipMap?: uint,
            eCubeFlag?: ETextureTypes): ArrayBufferView;
        setPixels(
            iX?: uint,
            iY?: uint,
            iWidth?: uint,
            iHeight?: uint,
            pPixelBuffer?: ArrayBufferView,
            iMipMap?: uint,
            eCubeFlag?: ETextureTypes): bool;

        generateNormalMap(pHeightMap: IImg, iChannel?: uint, fAmplitude?: float): bool;
        generateNormalizationCubeMap(): bool;

        convertToNormalMap(iChannel: uint, iFlags: uint, fAmplitude: float): bool;

        maskWithImage(pImage: IImg): bool;

        uploadCubeFace(pImage: IImg, eFace: ETextureTypes, isCopyAll?: bool): bool;
        uploadHTMLElement(pElement: HTMLElement): bool;
        uploadImage(pImage: IImg): bool;

        resize(iWidth: uint, iHeight: uint): bool;
        repack(iWidth: uint, iHeight: uint, eFormat?: EImageFormats, eType?: EImageTypes): bool;
        extend(iWidth: uint, iHeight: uint, cColor: IColor);

        createTexture(
            iWidth?: uint,
            iHeight?: uint,
            iFlags?: int,
            eFormat?: EImageFormats,
            eType?: EImageTypes,
            pData?: ArrayBufferView): bool;

//------------
// Эти вызовы надо убрать, так как пользователю не положено делать их самому,
// а соответственно их не должно быть в API, пусть рендерер, делает эти вещи.

//bind()
//unbind()
//activate()
//getSlot()
//setSlot()
    }
}





module akra.core.pool.resources {
	export class Texture extends ResourcePoolItem implements ITexture {
		/**@inline*/  get width(): uint {
			return 0;
		}

        /**@inline*/  get height(): uint {
        	return 0;
        }

        /**@inline*/  get type(): EImageTypes {
        	return null;
        }

        /**@inline*/  get format(): EImageFormats {
        	return null;
        }


//number of color components per pixel. usually: 1, 3, 4
        /**@inline*/  get componentsPerPixel(): uint {
        	return 0;
        }

        /**@inline*/  get bytesPerPixel(): uint {
        	return 0;
        }

        get magFilter(): ETextureFilters {
        	return 0;
        }

        get minFilter(): ETextureFilters {
        	return 0;
        }

        get wrapS(): ETextureWrapModes {
        	return 0;
        }

        get wrapT(): ETextureWrapModes {
        	return 0;
        }

        get target(): ETextureTypes {
        	return 0;
        }

        get mipLevels(): uint {
        	return 0;
        }

        isTexture2D(): bool {
        	return false;
        }

        isTextureCube(): bool {
        	return false;
        }

        isCompressed(): bool {
        	return false;
        }


        getParameter(): int {
        	return 0;
        }

        setParameter(eParam: ETextureParameters, eValue: ETextureFilters): void;
        setParameter(eParam: ETextureParameters, eValue: ETextureWrapModes): void;

        setParameter(eParam: ETextureParameters, eValue): void {
        	return;
        }


        getPixels(
            iX?: uint,
            iY?: uint,
            iWidth?: uint,
            iHeight?: uint,
            ppPixelBuffer?: ArrayBufferView,
            iMipMap?: uint,
            eCubeFlag?: ETextureTypes): ArrayBufferView {
        	return null;
        }

        setPixels(
            iX?: uint,
            iY?: uint,
            iWidth?: uint,
            iHeight?: uint,
            pPixelBuffer?: ArrayBufferView,
            iMipMap?: uint,
            eCubeFlag?: ETextureTypes): bool {
        	return null;
        }

        generateNormalMap(pHeightMap: IImg, iChannel?: uint, fAmplitude?: float): bool {
        	return false;
        }

        generateNormalizationCubeMap(): bool {
        	return false;
        }

        convertToNormalMap(iChannel: uint, iFlags: uint, fAmplitude: float): bool {
        	return false;
        }

        maskWithImage(pImage: IImg): bool {
        	return false;
        }

        uploadCubeFace(pImage: IImg, eFace: ETextureTypes, isCopyAll?: bool): bool {
        	return false;
        }

        uploadHTMLElement(pElement: HTMLElement): bool {
        	return false;
        }

        uploadImage(pImage: IImg): bool {
        	return false;
        }

        resize(iWidth: uint, iHeight: uint): bool {
        	return false;
        }

        repack(iWidth: uint, iHeight: uint, eFormat?: EImageFormats, eType?: EImageTypes): bool {
        	return false;
        }

        extend(iWidth: uint, iHeight: uint, cColor: IColor) {
        	return false;
        }

        createTexture(
            iWidth?: uint,
            iHeight?: uint,
            iFlags?: int,
            eFormat?: EImageFormats,
            eType?: EImageTypes,
            pData?: ArrayBufferView): bool {
        	return false;
        }

        /**@inline*/  getHardwareObject(): WebGLObject {
        	return null;
        }
	}
}










module akra {
    export enum ShaderTypes {
        PIXEL = 0x8B30,
        VERTEX
    };

    export interface IShaderProgram extends IRenderResource {

    }
}





module akra.core.pool.resources {
	export class ShaderProgram extends ResourcePoolItem implements IShaderProgram {
		/**@inline*/  getHardwareObject(): WebGLObject {
			return null;
		}
	}
}













module akra {
	export interface IAFXComponent extends IResourcePoolItem {

	}
}





module akra.core.pool.resources {
	export class Component extends ResourcePoolItem implements IAFXComponent{

	}
}













module akra {
	export interface IAFXEffect extends IResourcePoolItem {

	}
}






module akra.core.pool.resources {
	export class Effect extends ResourcePoolItem implements IAFXEffect {

	}
}










module akra {
    export interface ISurfaceMaterial {

    }

}






module akra.core.pool.resources {
	export class SurfaceMaterial extends ResourcePoolItem implements ISurfaceMaterial {

	}
}











module akra.core.pool.resources {
	export class Img extends ResourcePoolItem implements IImg {

	}
}













module akra {
	export interface IRenderMethod extends IResourcePoolItem {

	}
}





module akra.core.pool.resources {
	export class RenderMethod extends ResourcePoolItem implements IRenderMethod {

	}


}










module akra {
    export interface IModel extends IResourcePoolItem {

    }
}





module akra.core.pool.resources {
	export class Model extends ResourcePoolItem implements IModel {

	}


}














module akra {

	export interface IVec3 {} ;
	export interface IMat3 {} ;
	export interface IMat4 {} ;
	export interface IQuat4 {} ;

	export enum ENodeInheritance {
//inheritance only position
		POSITION = 0,
//inheritance rotation and scale only
        ROTSCALE,
//inheritance all
    	ALL
	};

	export interface INode extends IEntity {
		localOrientation: IQuat4;
		localPosition: IVec3;
		localScale: IVec3;
		localMatrix: IMat4;

		 worldMatrix: IMat4;
		 worldPosition: IVec3;

		 inverseWorldMatrix: IMat4;
		 normalMatrix: IMat3;

		setInheritance(eInheritance: ENodeInheritance);
		getInheritance(): ENodeInheritance;

		isWorldMatrixNew(): bool;
		isLocalMatrixNew(): bool;

		recalcWorldMatrix(): bool;

		setPosition(v3fPosition: IVec3): void;
		setPosition(fX: float, fY: float, fZ: float): void;

		addPosition(v3fPosition: IVec3): void;
		addPosition(fX: float, fY: float, fZ: float): void;
		addRelPosition(v3fPosition: IVec3): void;
		addRelPosition(fX: float, fY: float, fZ: float): void;

		setRotationByMatrix(m3fRotation: IMat3): void;
		setRotationByMatrix(m4fRotation: IMat4): void;
		setRotationByAxisAngle(v3fAxis: IVec3, fAngle: float): void;
		setRotationByForwardUp(v3fForward: IVec3, v3fUp: IVec3): void;
		setRotationByEulerAngles(fYaw: float, fPitch: float, fRoll: float): void;
		setRotationByXYZAxis(fX: float, fY: float, fZ: float): void;
		setRotation(q4fRotation: IQuat4): void;

		addRelRotationByMatrix(m4fRotation: IMat4): void;
		addRelRotationByMatrix(m3fRotation: IMat3): void;
		addRelRotationByAxisAngle(v3fAxis: IVec3, fAngle: float): void;
		addRelRotationByForwardUp(v3fForward: IVec3, v3fUp: IVec3): void;
		addRelRotationByEulerAngles(fYaw: float, fPitch: float, fRoll: float): void;
		addRelRotationByXYZAxis(fX: float, fY: float, fZ: float): void;
		addRelRotation(q4fRotation: IQuat4): void;

		addRotationByMatrix(m4fRotation: IMat4): void;
		addRotationByMatrix(m3fRotation: IMat3): void;
		addRotationByAxisAngle(v3fAxis: IVec3, fAngle: float): void;
		addRotationByForwardUp(v3fForward: IVec3, v3fUp: IVec3): void;
		addRotationByEulerAngles(fYaw: float, fPitch: float, fRoll: float): void;
		addRotationByXYZAxis(fX: float, fY: float, fZ: float): void;
		addRotation(q4fRotation: IQuat4): void;

		scale(fScale: float): void;
		scale(fX: float, fY: float, fZ: float): void;
	}
}







module akra.scene {

	export enum ENodeUpdateFlags {
		k_SetForDestruction = 0,
//if changed scale, otation or position
		k_NewOrientation,
// k_NewTranslation,
// k_NewScale,
		k_NewWorldMatrix,
		k_NewLocalMatrix,
		k_RebuildInverseWorldMatrix,
		k_RebuildNormalMatrix,
     };

	export class Node extends util.Entity implements INode {
		private _m4fLocalMatrix: IMat4 = null;
		private _m4fWorldMatrix: IMat4 = null;
		private _m4fInverseWorldMatrix: IMat4 = null;
		private _m3fNormalMatrix: IMat3 = null;

		private _v3fWorldPosition: IVec3 = null;

		private _qRotation: IQuat4 = null;
		private _v3fTranslation: IVec3 = null;
		private _v3fScale: IVec3 = null;

		private _iUpdateFlags: int = 0;
		private _eInheritance: ENodeInheritance = ENodeInheritance.POSITION;


		/**@inline*/  get localOrientation(): IQuat4 {
			return this._qRotation;
		}

		/**@inline*/  set localOrientation(qOrient: IQuat4) {
			((this._iUpdateFlags) |= (1 << ((ENodeUpdateFlags.k_NewOrientation))) ) ;
			this._qRotation.set(qOrient);
		}

		/**@inline*/  get localPosition(): IVec3 {
			return this._v3fTranslation;
		}

		/**@inline*/  set localPosition(v3fPosition: IVec3) {
			((this._iUpdateFlags) |= (1 << ((ENodeUpdateFlags.k_NewOrientation))) ) ;
			this._v3fTranslation.set(v3fPosition);
		}

		/**@inline*/  get localScale(): IVec3 {
			return this._v3fScale;
		}

		/**@inline*/  set localScale(v3fScale: IVec3) {
			((this._iUpdateFlags) |= (1 << ((ENodeUpdateFlags.k_NewOrientation))) ) ;
			this._v3fScale.set(v3fScale);
		}

		/**@inline*/  get localMatrix(): IMat4 {
			return this._m4fLocalMatrix;
		}

		/**@inline*/  set localMatrix(m4fLocalMatrix: IMat4) {
			((this._iUpdateFlags) |= (1 << ((ENodeUpdateFlags.k_NewLocalMatrix))) ) ;
			this._m4fLocalMatrix.set(m4fLocalMatrix);
		}


		/**@inline*/  get worldMatrix(): IMat4 {
			return this._m4fWorldMatrix;
		}

		/**@inline*/  get worldPosition(): IVec3 {
			return this._v3fWorldPosition;
		}

		get inverseWorldMatrix(): IMat4 {
			if ( ((this._iUpdateFlags & (1 << (ENodeUpdateFlags.k_RebuildInverseWorldMatrix)) ) != 0) ) {
		        this._m4fWorldMatrix.inverse(this._m4fInverseWorldMatrix);
		        ((this._iUpdateFlags) &= ~ (1 << ((ENodeUpdateFlags.k_RebuildInverseWorldMatrix))) ) ;
		    }

			return this._m4fInverseWorldMatrix;
		}

		get normalMatrix(): IMat3 {
			if ( ((this._iUpdateFlags & (1 << (ENodeUpdateFlags.k_RebuildNormalMatrix)) ) != 0) ) {
		        this._m4fWorldMatrix.toMat3(this._m3fNormalMatrix).inverse().transpose();
		        ((this._iUpdateFlags) &= ~ (1 << ((ENodeUpdateFlags.k_RebuildNormalMatrix))) ) ;
		    }

			return this._m3fNormalMatrix;
		}


		update(): void {
// derived classes update the local matrix
// then call this base function to complete
// the update
		    this.recalcWorldMatrix();
		}


		prepareForUpdate(): void {
// clear the temporary flags
			((this._iUpdateFlags) &= ~( (1 << (ENodeUpdateFlags.k_NewLocalMatrix)) | (1 << (ENodeUpdateFlags.k_NewOrientation)) | (1 << (ENodeUpdateFlags.k_NewWorldMatrix)) ))
                                                                                            ;
		}


		/**@inline*/  setInheritance(eInheritance: ENodeInheritance) {
			this._eInheritance = eInheritance;
		}

		/**@inline*/  getInheritance(): ENodeInheritance {
			return this._eInheritance;
		}

		/**@inline*/  isWorldMatrixNew(): bool {
			return  ((this._iUpdateFlags & (1 << (ENodeUpdateFlags.k_NewWorldMatrix)) ) != 0) ;
		}

		/**@inline*/  isLocalMatrixNew(): bool {
			return  ((this._iUpdateFlags & (1 << (ENodeUpdateFlags.k_NewLocalMatrix)) ) != 0) ;
		}

		recalcWorldMatrix(): bool {
			var isParentMoved: bool = this._pParent && (<Node>this._pParent).isWorldMatrixNew();
		    var isOrientModified: bool =  ((this._iUpdateFlags & (1 << (ENodeUpdateFlags.k_NewOrientation)) ) != 0) ;
		    var isLocalModified: bool =  ((this._iUpdateFlags & (1 << (ENodeUpdateFlags.k_NewLocalMatrix)) ) != 0) ;

		    if (isOrientModified || isParentMoved || isLocalModified) {

		        var m4fLocal: IMat4 = this._m4fLocalMatrix;
		        var m4fWorld: IMat4 = this._m4fWorldMatrix;
		        var m4fParent: IMat4 = (<Node>this._pParent).worldMatrix;
		        var m4fOrient: IMat4 = Node._m4fTemp;
		        var v3fTemp: IVec3 = Node._v3fTemp;

		        var pWorldData: Float32Array = m4fWorld.data;
		        var pParentData: Float32Array = m4fParent.data;
		        var pOrientData: Float32Array = m4fOrient.data;

		        this._qRotation.toMat4(m4fOrient);

		        m4fOrient.setTranslation(this._v3fTranslation);
		        m4fOrient.scaleLeft(this._v3fScale);
		        m4fOrient.multiply(m4fLocal);


		        if (this._pParent) {
		            if (this._eInheritance === ENodeInheritance.ALL) {
		                m4fParent.multiply(m4fOrient, m4fWorld);
		            }
		            else if (this._eInheritance === ENodeInheritance.POSITION) {
		                m4fWorld.set(m4fOrient);

		                pWorldData[ 12 ] = pParentData[ 12 ] + pOrientData[ 12 ];
		                pWorldData[ 13 ] = pParentData[ 13 ] + pOrientData[ 13 ];
		                pWorldData[ 14 ] = pParentData[ 14 ] + pOrientData[ 14 ];
		            }
		            else if (this._eInheritance === ENodeInheritance.ROTSCALE) {
		                var p11 = pParentData[ 0 ], p12 = pParentData[ 4 ],
		                    p13 = pParentData[ 8 ];
		                var p21 = pParentData[ 1 ], p22 = pParentData[ 5 ],
		                    p23 = pParentData[ 9 ];
		                var p31 = pParentData[ 2 ], p32 = pParentData[ 6 ],
		                    p33 = pParentData[ 10 ];

		                var l11 = pOrientData[ 0 ], l12 = pOrientData[ 4 ],
		                    l13 = pOrientData[ 8 ];
		                var l21 = pOrientData[ 1 ], l22 = pOrientData[ 5 ],
		                    l23 = pOrientData[ 9 ];
		                var l31 = pOrientData[ 2 ], l32 = pOrientData[ 6 ],
		                    l33 = pOrientData[ 10 ];

		                pWorldData[ 0 ] = p11 * l11 + p12 * l21 + p13 * l31;
		                pWorldData[ 4 ] = p11 * l12 + p12 * l22 + p13 * l32;
		                pWorldData[ 8 ] = p11 * l13 + p12 * l23 + p13 * l33;
		                pWorldData[ 12 ] = pOrientData[ 12 ];
		                pWorldData[ 1 ] = p21 * l11 + p22 * l21 + p23 * l31;
		                pWorldData[ 5  = p21 * l12 + p22 * l22 + p23 * l32];
		                pWorldData[ 9 ] = p21 * l13 + p22 * l23 + p23 * l33;
		                pWorldData[ 13 ] = pOrientData[ 13 ];
		                pWorldData[ 2 ] = p31 * l11 + p32 * l21 + p33 * l31;
		                pWorldData[ 6 ] = p31 * l12 + p32 * l22 + p33 * l32;
		                pWorldData[ 10 ] = p31 * l13 + p32 * l23 + p33 * l33;
		                pWorldData[ 14 ] = pOrientData[ 14 ];

		                pWorldData[ 3 ] = pOrientData[ 3 ];
		                pWorldData[ 7 ] = pOrientData[ 7 ];
		                pWorldData[ 11 ] = pOrientData[ 11 ];
		                pWorldData[ 15 ] = pOrientData[ 15 ];
		            }
		        }
		        else {
		            m4fWorld.set(m4fOrient);
		        }

		        this._v3fWorldPosition.x = pWorldData[ 12 ];
		        this._v3fWorldPosition.y = pWorldData[ 13 ];
		        this._v3fWorldPosition.z = pWorldData[ 14 ];

// set the flag that our world matrix has changed
		        ((this._iUpdateFlags) |= (1 << ((ENodeUpdateFlags.k_NewWorldMatrix))) ) ;
// and it's inverse & vectors are out of date
		        ((this._iUpdateFlags) |= (1 << ((ENodeUpdateFlags.k_RebuildInverseWorldMatrix))) ) ;
		        ((this._iUpdateFlags) |= (1 << ((ENodeUpdateFlags.k_RebuildNormalMatrix))) ) ;

		        return true;
		    }

		    return false;
		}

		setPosition(v3fPosition: IVec3): void;
		setPosition(fX: float, fY: float, fZ: float): void;
		setPosition(fX?: any, fY?: any, fZ?: any): void {
			var pPos: IVec3 = arguments.length === 1? arguments[0]: vec3(fX, fY, fZ);
		    var v3fTranslation: IVec3 = this._v3fTranslation;

		    v3fTranslation.set(pPos);

		    ((this._iUpdateFlags) |= (1 << ((ENodeUpdateFlags.k_NewOrientation))) ) ;
		}

		addPosition(v3fPosition: IVec3): void;
		addPosition(fX: float, fY: float, fZ: float): void;
		addPosition(fX?: any, fY?: any, fZ?: any): void {
			var pPos: IVec3 = arguments.length === 1? arguments[0]: vec3(fX, fY, fZ);
		    var v3fTranslation: IVec3 = this._v3fTranslation;

		    v3fTranslation.add(pPos);

		    ((this._iUpdateFlags) |= (1 << ((ENodeUpdateFlags.k_NewOrientation))) ) ;
		}

		addRelPosition(v3fPosition: IVec3): void;
		addRelPosition(fX: float, fY: float, fZ: float): void;
		addRelPosition(fX?: any, fY?: any, fZ?: any): void {
			var pPos: IVec3 = arguments.length === 1? arguments[0]: vec3(fX, fY, fZ);
		    var v3fTranslation: IVec3 = this._v3fTranslation;

		    this._qRotation.multiplyVec3(pPos);
    		v3fTranslation.add(pPos);

		    ((this._iUpdateFlags) |= (1 << ((ENodeUpdateFlags.k_NewOrientation))) ) ;
		}

		setRotationByMatrix(m3fRotation: IMat3): void;
		setRotationByMatrix(m4fRotation: IMat4): void;
		setRotationByMatrix(matrix: any): void {
			matrix.toQuat4(this._qRotation);
			((this._iUpdateFlags) |= (1 << ((ENodeUpdateFlags.k_NewOrientation))) ) ;
		}

		setRotationByAxisAngle(v3fAxis: IVec3, fAngle: float): void {
			Quat4.fromAxisAngle(v3fAxis, fAngle, this._qRotation);
			((this._iUpdateFlags) |= (1 << ((ENodeUpdateFlags.k_NewOrientation))) ) ;
		}

		setRotationByForwardUp(v3fForward: IVec3, v3fUp: IVec3): void {
			Quat4.fromForwardUp(v3fForward, v3fUp, this._qRotation);
			((this._iUpdateFlags) |= (1 << ((ENodeUpdateFlags.k_NewOrientation))) ) ;
		}

		setRotationByEulerAngles(fYaw: float, fPitch: float, fRoll: float): void {
			Quat4.fromYawPitchRoll(fYaw, fPitch, fRoll, this._qRotation);
			((this._iUpdateFlags) |= (1 << ((ENodeUpdateFlags.k_NewOrientation))) ) ;
		}

		setRotationByXYZAxis(fX: float, fY: float, fZ: float): void {
			Quat4.fromYawPitchRoll(fY, fX, fZ, this._qRotation);
			((this._iUpdateFlags) |= (1 << ((ENodeUpdateFlags.k_NewOrientation))) ) ;
		}

		setRotation(q4fRotation: IQuat4): void {
			this._qRotation.set(q4fRotation);
			((this._iUpdateFlags) |= (1 << ((ENodeUpdateFlags.k_NewOrientation))) ) ;
		}

		addRelRotationByMatrix(m3fRotation: IMat3): void;
		addRelRotationByMatrix(m4fRotation: IMat4): void;
		addRelRotationByMatrix(matrix: any): void {
			this.addRelRotation(arguments[0].toQuat4(Node._q4fTemp));
		}

		addRelRotationByAxisAngle(v3fAxis: IVec3, fAngle: float): void {
			this.addRelRotation(Quat4.fromAxisAngle(v3fAxis, fAngle, Node._q4fTemp));
		}

		addRelRotationByForwardUp(v3fForward: IVec3, v3fUp: IVec3): void {
			this.addRelRotation(Quat4.fromForwardUp(v3fForward, v3fUp, Node._q4fTemp));
		}

		addRelRotationByEulerAngles(fYaw: float, fPitch: float, fRoll: float): void {
			this.addRelRotation(Quat4.fromYawPitchRoll(fYaw, fPitch, fRoll, Node._q4fTemp));
		}

		addRelRotationByXYZAxis(fX: float, fY: float, fZ: float): void {
			this.addRelRotation(Quat4.fromYawPitchRoll(fY, fX, fZ, Node._q4fTemp));
		}

		addRelRotation(q4fRotation: IQuat4): void {
			this._qRotation.multiply(q4fRotation);
			((this._iUpdateFlags) |= (1 << ((ENodeUpdateFlags.k_NewOrientation))) ) ;
		}

		addRotationByMatrix(m3fRotation: IMat3): void;
		addRotationByMatrix(m4fRotation: IMat4): void;
		addRotationByMatrix(matrix: any): void {
			this.addRotation(arguments[0].toQuat4(Node._q4fTemp));
		}

		addRotationByAxisAngle(v3fAxis: IVec3, fAngle: float): void {
			this.addRotation(Quat4.fromAxisAngle(v3fAxis, fAngle, Node._q4fTemp));
		}

		addRotationByForwardUp(v3fForward: IVec3, v3fUp: IVec3): void {
			this.addRotation(Quat4.fromForwardUp(v3fForward, v3fUp, Node._q4fTemp));
		}

		addRotationByEulerAngles(fYaw: float, fPitch: float, fRoll: float): void {
			this.addRotation(Quat4.fromYawPitchRoll(fYaw, fPitch, fRoll, Node._q4fTemp));
		}

		addRotationByXYZAxis(fX: float, fY: float, fZ: float): void {
			this.addRotation(Quat4.fromYawPitchRoll(fY, fX, fZ, Node._q4fTemp));
		}

		addRotation(q4fRotation: IQuat4): void {
			q4fRotation.multiplyVec3(this._v3fTranslation);
    		q4fRotation.multiply(this._qRotation, this._qRotation);
    		((this._iUpdateFlags) |= (1 << ((ENodeUpdateFlags.k_NewOrientation))) ) ;
		}


		scale(fScale: float): void;
		scale(fX: float, fY: float, fZ: float): void;
		scale(fX: any, fY?: any, fZ?: any): void {
			var pScale: IVec3 = arguments.length === 1? arguments[0]: vec3(fX);
		    var v3fScale: IVec3 = this._v3fScale;

		    v3fScale.scale(pScale);

		    ((this._iUpdateFlags) |= (1 << ((ENodeUpdateFlags.k_NewOrientation))) ) ;
		}



		attachToParent(pParent: IEntity): bool {
			if (super.attachToParent(pParent)) {
// adjust my local matrix to be relative to this new parent
	            var m4fInvertedParentMatrix: IMat4 = mat4();
	            (<Node>this._pParent)._m4fWorldMatrix.inverse(m4fInvertedParentMatrix);
	            return true;
			}

			return false;
		}

		detachFromParent(): bool {
			if (super.detachFromParent()) {
				this._m4fWorldMatrix.identity();
				return true;
			}

			return false;
		}

		toString(isRecursive: bool = false, iDepth: int = 0): string {


		    if (!isRecursive) {
		        return '<node' + (this.name? " " + this.name: "") + '>';
		    }

		    var pSibling: IEntity = this.sibling;
		    var pChild: IEntity = this.child;
		    var s = "";

		    for (var i = 0; i < iDepth; ++ i) {
		        s += ':  ';
		    }

		    s += '+----[depth: ' + this.depth + ']' + this.toString() + '\n';

		    if (pChild) {
		        s += pChild.toString(true, iDepth + 1);
		    }

		    if (pSibling) {
		        s += pSibling.toString(true, iDepth);
		    }

		    return s;

		};

		private static _v3fTemp: IVec3 = vec3();
		private static _v4fTemp: IVec4 = vec4();
		private static _m3fTemp: IMat3 = mat3();
		private static _m4fTemp: IMat4 = mat4();
		private static _q4fTemp: IQuat4 = quat4();
	}
}















module akra {
    export interface ISceneNode extends INode {
//render(): void;
//prepareForRender(): void;
//recursiveRender(): void;
    }
}





module akra.scene {
	export class SceneNode extends Node implements ISceneNode {
		private pEngine: IEngine = null;

		constructor (pEngine: IEngine) {
			super();

			this.pEngine = pEngine;
		}
	}
}















module akra {
	export interface IRect3d {} ;

    export interface ISceneObject extends ISceneNode {
//    	worldBounds: IRect3d;
//   	localBounds: IRect3d;


// 	getObjectFlags(): int;
    }
}





module akra.scene {
	export class SceneObject extends SceneNode implements ISceneObject {
		constructor (pEngine: IEngine) {
			super(pEngine);
		}
	}
}












module akra {
    export interface ICamera extends ISceneObject {

    }
}





module akra.scene.objects {
	export class Camera extends SceneObject implements ICamera {
		constructor (pEngine: IEngine) {
			super(pEngine);
		}
	}
}










module akra {
	export interface ISceneTree {

	}
}



module akra.scene {
	export class OcTree implements ISceneTree {

	}
}














module akra {
	export interface IScene {

	}
}



module akra {
	export interface IScene3d extends IScene {
		recursivePreUpdate(): void;
		updateCamera(): bool;
		updateScene(): bool;
		recursiveUpdate(): void;
	}
}










module akra {
	export enum EDisplayTypes {
		TYPE_UNKNOWN = -1,
		TYPE_2D = 1,
		TYPE_3D
	};

	export interface IDisplay {
		type: EDisplayTypes;


		isFullscreen(): bool;
		fullscreen(): bool;
	}
}



module akra {
	export interface IDisplay3d extends IDisplay {
		render(): void;
		renderFrame(): bool;

		play(): bool;
		pause(isPaused?: bool): bool;

		inRendering(): bool;


		getCanvas(): HTMLCanvasElement;
		getScene(): IScene3d;
		getBuilder(): ISceneBuilder;
		getRenderer(): IRenderer;
		getScreen(): IScreen;

		getTime(): float;
		getElapsedTime(): float;
		getFPS(): float;

	}
}



module akra.scene {
	export class Scene3d implements IScene3d {
		constructor (pDisplay: IDisplay3d) {

		}

		recursivePreUpdate(): void {

		}

		recursiveUpdate(): void {

		}

		updateCamera(): bool {
			return false;
		}

		updateScene(): bool {
			return false;
		}
	}
}



















module akra {
	export interface IAFXPreRenderState {

	}
}







module akra {
	export interface IAFXComponentBlend {

	}
}







module akra {
	export interface IAFXPassBlend {

	}
}






module akra {
	export interface IMesh {

	}
}






module akra {
	export interface IRenderableObject {

	}
}






module akra {
	export interface IRenderSnapshot {

	}
}








module akra {
	export interface IBufferMap {

	}
}






















module akra {
    export interface IRenderEntry {

    }
}






module akra {
	export interface IFrameBuffer {

	}
}







module akra {
    export interface IViewport {
        x: number;
        y: number;
        width: number;
        height: number;
    }
}



module  akra.render {



	export var SShaderPrefixes = {
		k_Sampler    : "A_s_",
	    k_Header     : "A_h_",
	    k_Attribute  : "A_a_",
	    k_Offset     : "A_o_",
	    k_Texture    : "TEXTURE",
	    k_Texcoord   : "TEXCOORD",
	    k_Texmatrix  : "TEXMATRIX",
	    k_Temp       : "TEMP_",
	    k_BlendType  : "AUTO_BLEND_TYPE_"
	};

	export var ZEROSAMPLER: int = 19;

	export var SSystemSemantics = {
		MODEL_MATRIX: 		"MODEL_MATRIX",
		VIEW_MATRIX: 		"VIEW_MATRIX",
		PROJ_MATRIX: 		"PROJ_MATRIX",
		NORMAL_MATRIX: 		"NORMAL_MATRIX",
		BIND_MATRIX: 		"BIND_SHAPE_MATRIX",
		RENDER_OBJECT_ID: 	"RENDER_OBJECT_ID"
	}

	interface IAFXComponentBlendMap {
		[index: string]: IAFXComponentBlend;
	};


	interface IAFXPassBlendMap {
		[index: string]: IAFXPassBlend;
	};

	interface IAFXEffectMap {
		[index: string]: IAFXEffect;
	};

	interface IRenderResourceMap {
		[index: number]: IRenderResource;
	}

	export class Renderer implements IRenderer {
		private pEngine: IEngine;
		private pDevice: WebGLRenderingContext;

		private nEffectFile: uint = 1;
		private pEffectFileStack: IAFXEffect[] = [];

		private pComponentBlendMap: IAFXComponentBlendMap = {};
		private pPassBlendMap: IAFXPassBlendMap = {};
		private pEffectMap: IAFXEffectMap = {};

		private pActiveSceneObject: ISceneObject = null;
		private pActiveRenderObject: IRenderableObject = null;

// WHAT IS THIS???, WHY THIS NEED???
		private pSceneObjectStack: ISceneObject[] = [];
		private pPreRenderStateStack: IAFXPreRenderState[] = [];
		private pPreRenderStateActive: IAFXPreRenderState = null;
		private pPreRenderStatePool: IAFXPreRenderState[] = new Array(20);

		private pCurrentViewport: IViewport;
//private pProgramsMap; //--> TO FAT SEARCH TREE
		private pRenderResourceMap: IRenderResourceMap;
		private pRenderResourceCounter: IntMap;

		private pScreen: IMesh;

		constructor (pDisplay: IDisplay3d) {

		}

//// frendly for EffectResource

/** * Регистрация компонента эффекта. **/

    	registerComponent(pComponent: IAFXComponent): bool {
    		return false;
    	}

/** Активация компонента для эффект ресурса. */

    	activateComponent(pEffectResource: IAFXEffect, iComponentHandle: int, nShift?: uint): bool {
    		return false;
    	}

/** Деактивация компонента для эффект ресурса. */

    	deactivateComponent(pEffectResource: IAFXEffect, iComponentHandle: int, nShift?: uint): bool {
    		return false;
    	}

/** Get effect components number */

    	getComponentCount(pEffectResource: IAFXEffect): uint {
    		return 0;
    	}

//// frendly for Snapshot
    	push(pRenderObject: IRenderableObject, pSnapshot: IRenderSnapshot): bool {
    		return false;
    	}

    	pop(): bool {
    		return false;
    	}

    	activatePass(pSnapshot: IRenderSnapshot, iPass: int): bool {
    		return false;
    	}

    	deactivatePass(pSnapshot: IRenderSnapshot): bool {
    		return false;
    	}

    	activateSceneObject(pSceneObject: ISceneObject): void {}
    	deactivateSceneObject(): void{}

    	finishPass(iPass: int): bool{
    		return false;
    	}

    	applyBufferMap(pMap: IBufferMap): bool {
    		return false;
    	}
    	applyVertexData(pData: IVertexData, ePrimType: EPrimitiveTypes): bool {
    		return false;
    	}

    	applyFrameBufferTexture(pTexture: ITexture, eAttachment: EAttachmentTypes, eTexTarget: ETextureTypes, iLevel?: uint): bool {
    		return false;
    	}

    	applySurfaceMaterial(pMaterial: ISurfaceMaterial): bool {
    		return false;
    	}

    	getUniformRealName(sName: string): string {
    		return null;
    	}

    	getTextureRealName(sName: string): string {
    		return null;
    	}
    	getActiveProgram(): IShaderProgram {
    		return null;
    	}
    	getActiveTexture(iSlot: uint): ITexture {
    		return null;
    	}
    	getTextureSlot(pTexture: ITexture): uint {
    		return 0;
    	}
    	getFrameBuffer(iFrameBuffer?: int): IFrameBuffer {
    		return null;
    	}

    	isUniformTypeBase(sRealName: string): bool {
    		return false;
    	}

		totalPasses(pEffect: IAFXEffect): uint {
			return 0;
		}

//frendly for ShaderProgram

    	activateTexture(pTexture: ITexture): bool {
    		return false;
    	}

    	activateVertexBuffer(pBuffer: IVertexBuffer): bool {
    		return false;
    	}

    	activateIndexBuffer(pBuffer: IIndexBuffer): bool {
    		return false;
    	}

    	activateProgram(pProgram: IShaderProgram): bool {
    		return false;
    	}

    	activateFrameBuffer(pFrameBuffer: IFrameBuffer): bool {
    		return false;
    	}

    	deactivateFrameBuffer(pFrameBuffer: IFrameBuffer): bool {
    		return false;
    	}


    	getRenderResourceState(pResource: IRenderResource): int {
    		return 0;
    	}



//// frendly for resources

    	registerRenderResource(pResource: IRenderResource): void {
    		return;
    	}

    	releaseRenderResource(pResource: IRenderResource): void {
    		return;
    	}

/** Регистрация нового эффект ресурса. */

        registerEffect(pEffectResource: IAFXEffect): bool {
    		return false;
    	}


//// frendly for Texture

    	bindTexture(pTexture: ITexture): bool {
    		return false;
    	}

    	unbindTexture(): bool {
    		return false;
    	}



//// frendly for render queue
    	render(pEntry: IRenderEntry): void {
    		return;
    	}



///public API
    	findEffect(sName?: string): IAFXEffect {
    		return null;
    	}



    	clearScreen(eValue: EBufferMasks, c4Color: IColor): void {
    		return;
    	}

    	switchRenderStage(eType: ERenderStages): void {
    		return;
    	}

    	processRenderStage(): bool {
    		return false;
    	}

    	updateScreen(): bool {
    		return false;
    	}

/** Load *.fx file or *.abf */

        loadEffectFile(sFilename: string, isSync?: bool): bool {
    		return false;
    	}


        debug(bValue?: bool, bTrace?: bool): bool {
    		return false;
    	}

        isDeviceLost(): bool {
    		return false;
    	}



	}
};












module akra {

	export interface IBuildScenario {} ;

	export interface ISceneBuilder {
		build(pScenario: IBuildScenario): bool;
	}
}






module akra {
	export interface IBuildScenario {

	}
}






module akra.scene {
	export class SceneBuilder extends util.Singleton implements ISceneBuilder {

		constructor () {
			super();
		}

		build(pScenario: IBuildScenario): bool {
			return false;
		}

//FIXME: hack for typescript limitaions. 
		static getSingleton(): ISceneBuilder {
			return <ISceneBuilder>((<any>SceneBuilder)._pInstance);
		}
	}

//create singleton instance
	new SceneBuilder();
}











module akra {
	export interface INode {} ;
	export interface IJoint {} ;
	export interface IAnimationFrame {} ;
	export interface IAnimationTrack {} ;
	export interface IAnimationTarget{
		target: INode;
		index: int;
		name: string;
		track?: IAnimationTrack;
	}

	export interface IAnimationBase extends IEventProvider {
		duration: float;
		name: string;


		play(fRealTime: float): void;
		stop(fRealTime: float): void;

		attach(pTarget: INode): void;

		frame(sName: string, fRealTime: float): IAnimationFrame;
		apply(fRealTime: float): void;

		addTarget(sName: string, pTarget: INode): IAnimationTarget;
		setTarget(sName: string, pTarget: INode): IAnimationTarget;
		getTarget(sTargetName: string): IAnimationTarget;
		getTargetList(): IAnimationTarget[];
		getTargetByName(sName: string): IAnimationTarget;
		targetNames(): string[];
		targetList(): INode[];
		jointList(): IJoint[];
		grab(pAnimationBase: IAnimationBase, bRewrite?: bool): void;

		createAnimationMask(): FloatMap;

	}
}








module akra {
	export interface IMat4 {} ;
	export interface IQuat4 {} ;
	export interface IVec3 {} ;
	export interface IAnimationFrame {} ;
	export enum EAnimationInterpolations {
		MATRIX_LINEAR,
		LINEAR
	}

	export interface IAnimationFrame {
		time: float;
		weight: float;
		matrix: IMat4;
		rotation: IQuat4;
		scale: IVec3;
		translation: IVec3;
		toMatrix(): IMat4;
		toMatrixFromMatrix(): IMat4;
		reset(): IAnimationFrame;
		set(pFrame: IAnimationFrame): void;
		add(pFrame: IAnimationFrame, isFirst: bool): IAnimationFrame;
		addMatrix(pFrame: IAnimationFrame): IAnimationFrame;
		mult(fScalar: float): IAnimationFrame;
		normilize(): IAnimationFrame;
		normilizeMatrix(): IAnimationFrame;
		interpolate(pStartFrame: IAnimationFrame, pEndFrame: IAnimationFrame, fBlend: float): void;
		interpolateMatrix(pStartFrame: IAnimationFrame, pEndFrame: IAnimationFrame, fBlend: float): void;
	}
}






module akra {
	export interface IAnimationFrame {} ;
	export interface ISkeleton {} ;
	export interface INode {} ;
	export interface IMat4 {} ;
	export interface IAnimationTrack {
		targetName: string;
		 target: INode;
		 duration: float;

		keyFrame(fTime: float, pMatrix: IMat4): bool;
		getKeyFrame(iFrame: int): IAnimationFrame;
		findKeyFrame(fTime: float): int;
		bind(sJoint: string, pSkeleton: ISkeleton);
		bind(pSkeleton: ISkeleton);
		bind(pNode: INode);
		frame(fTime: float): IAnimationFrame;
	}
}










module akra {
	export interface IJoint extends INode {

	}
}




module akra.scene {
	export class Joint extends Node implements IJoint {

	}
}




module akra.animation {
	export interface IAnimationTargetMap{
		[index: string]: IAnimationTarget;
	}

	export class AnimationBase implements IAnimationBase {

		private _pTargetMap: IAnimationTargetMap = {};
    	private _pTargetList: IAnimationTarget[] = [];

    	 _fDuration: float = 0.0;
		private _sName: string;

		/**@inline*/  get duration(): float{
			return this._fDuration;
		}

		/**@inline*/  set duration(fValue: float){
			this._fDuration = fValue;
		}

		/**@inline*/  get name(): string{
			return this._sName;
		};

		/**@inline*/  set name(sName: string){
			this._sName = sName;
		};


		play(fRealTime: float): void {
			this.onplay(fRealTime);
		}

		stop(fRealTime: float): void {
			this.onstop(fRealTime);
		}

		attach(pTarget: INode): void {
			debug_error("method AnimationBase::bind() must be overwritten.");
		}

		frame(sName: string, fRealTime: float): IAnimationFrame {
			return null;
		}

		apply(fRealTime: float): void {
			var pTargetList: IAnimationTarget[] = this._pTargetList;
		    var pTarget: INode;
		    var pFrame: IAnimationFrame;
		    var pTransform;

			for (var i = 0; i < pTargetList.length; ++ i) {
				pFrame = this.frame(pTargetList[i].name, fRealTime);
				pTarget = pTargetList[i].target;

				if (!pFrame || !pTarget) {
					continue;
				}

				pTransform = pFrame.toMatrix();
				pTarget.localMatrix.set(pTransform);
			};

		}

		addTarget(sName: string, pTarget: INode = null): IAnimationTarget {
//pTarget = pTarget || null;

		    var pPointer: IAnimationTarget = this._pTargetMap[sName];

		    if (pPointer) {
		    	pPointer.target = pTarget || pPointer.target || null;
		    	return pPointer;
		    }

		    pPointer = {
				target: pTarget,
				index: this._pTargetList.length,
				name: sName
			};

		    this._pTargetList.push(pPointer);
			this._pTargetMap[sName] = pPointer;

			return pPointer;
		}

		setTarget(sName: string, pTarget: INode): IAnimationTarget {

		    var pPointer: IAnimationTarget = this._pTargetMap[sName];
			pPointer.target = pTarget;
			return pPointer;
		}

		getTarget(sTargetName: string): IAnimationTarget {
			return this._pTargetMap[sTargetName];
		}

		/**@inline*/  getTargetList(): IAnimationTarget[] {
			return this._pTargetList;
		}

		/**@inline*/  getTargetByName(sName: string): IAnimationTarget {
			return this._pTargetMap[sName];
		}

		targetNames(): string[] {
			var pTargets: IAnimationTarget[] = this._pTargetList;
			var pTargetNames: string[] = [];

			for (var i = 0; i < pTargets.length; ++ i) {
				pTargetNames.push(pTargets[i].name);
			}

			return pTargetNames;
		}

		targetList(): INode[] {
			var pTargets: IAnimationTarget[] = this._pTargetList;
			var pTargetList: INode[] = [];

			for (var i = 0; i < pTargets.length; ++ i) {
				pTargetList.push(pTargets[i].target);
			}

			return pTargetList;
		}

		jointList(): IJoint[] {
			var pTargets: IAnimationTarget[] = this._pTargetList;
			var pJointList: IJoint[] = [];

			for (var i = 0; i < pTargets.length; ++ i) {
				if (pTargets[i].target instanceof scene.Joint) {
					pJointList.push(pTargets[i].target);
				}
			}

			return pJointList;
		}

		grab(pAnimationBase: IAnimationBase, bRewrite: bool = true): void{

		    var pAdoptTargets: IAnimationTarget[] = pAnimationBase.getTargetList();

			for (var i = 0; i < pAdoptTargets.length; ++ i) {

				if (!pAdoptTargets[i].target) {
//warning('cannot grab target <' + pAdoptTargets[i].name + '>, becaus "target" is null');
					continue;
				}

				if (bRewrite || !this.getTarget(pAdoptTargets[i].name)) {
					this.addTarget(pAdoptTargets[i].name, pAdoptTargets[i].target);
				}
			};
		}

		createAnimationMask(): FloatMap {
			var pTargets: string[] = this.targetNames();
		    var pMask: FloatMap = <FloatMap>{};

		    for (var i = 0; i < pTargets.length; ++ i) {
		    	pMask[pTargets[i]] = 1.0;
		    }

		    return pMask;
		}

		private _iGuid: uint = sid(); private static _pEvenetTable: IEventTable = new events.EventTable(); /**@inline*/ getEventTable(): IEventTable {return AnimationBase._pEvenetTable; } /**@inline*/ getGuid(): uint {return this._iGuid; } /**@inline*/ connect(pSender: IEventProvider, sSignal: string, sSlot: string, eType?: EEventTypes): bool { return pSender.getEventTable().addDestination(pSender.getGuid(), sSignal, this, sSlot, eType); }; /**@inline*/ bind(sSignal: string, fnListener: Function, eType?: EEventTypes): bool { return this.getEventTable().addListener(this.getGuid(), sSignal, fnListener, eType); } ;
			onplay (fRealTime) : void { var broadcast: IEventSlot[] = (this.getEventTable()).broadcast[this._iGuid]["onplay"]; for (var i = 0; i < broadcast.length; ++ i) { broadcast[i].target? broadcast[i].target[broadcast[i].callback] (fRealTime) : broadcast[i].listener (fRealTime) ; } } ; ;
			onstop (fRealTime) : void { var broadcast: IEventSlot[] = (this.getEventTable()).broadcast[this._iGuid]["onstop"]; for (var i = 0; i < broadcast.length; ++ i) { broadcast[i].target? broadcast[i].target[broadcast[i].callback] (fRealTime) : broadcast[i].listener (fRealTime) ; } } ; ;
		;
	}
}










module akra {
	export interface INode {} ;
	export interface IAnimationFrame {} ;
	export interface IAnimationTrack {} ;

	export interface IAnimation extends IAnimationBase {
		 totalTracks: int;

		push(pTrack: IAnimationTrack): void;
		attach(pTarget: INode): void;

		getTracks(): IAnimationTrack[];

		frame(sName: string, fTime: float): IAnimationFrame;
		extend(pAnimation: IAnimation): void;
	}
}










module akra.animation {
	export class Animation implements IAnimation extends AnimationBase {

		private _pTracks: IAnimationTrack[] = [];


		/**@inline*/  get totalTracks(): float{
			return this._pTracks.length;
		}

		push(pTrack: IAnimationTrack): void {
			this._pTracks.push(pTrack);
			this._fDuration = Math.max(this._fDuration, pTrack.duration);
			this.addTarget(pTrack.targetName);
		}

		attach(pTarget: INode): void {
			var pPointer;
		    var pTracks: IAnimationTrack[] = this._pTracks;
			for (var i = 0; i < pTracks.length; ++ i) {
				if (!pTracks[i].bind(pTarget)) {
					trace('cannot bind animation track [', i, '] to joint <', pTracks[i].target, '>');
				}
				else {
					pPointer = this.setTarget(pTracks[i].targetName, pTracks[i].target);
					pPointer.track = pTracks[i];
				}
			};
		}

		getTracks(): IAnimationTrack[] {
			return this._pTracks;
		}

		frame(sName: string, fTime: float): IAnimationFrame {
			var pPointer: IAnimationTarget = this.getTargetByName(sName);

		    if (!pPointer || !pPointer.track) {
		    	return null;
		    }

			return pPointer.track.frame(math.clamp(fTime, 0, this._fDuration));
		}

		extend(pAnimation: IAnimation): void {
			var pTracks: IAnimationTrack[] = pAnimation.getTracks();

			for (var i = 0; i < pTracks.length; ++ i) {
				if (!this.getTarget(pTracks[i].targetName)) {
					this.push(pTracks[i]);
				}
			}
		}
	}
}
















module akra {
	export interface INode {} ;
	export interface ISkeleton {
		findJoint(sJoint: string): INode;
	}
}





module akra.model {
	export class Skeleton implements ISkeleton{
		findJoint(sJoint: string): INode {
			return null;
		}
	}
}











module akra.animation {
	export class AnimationFrame implements IAnimationFrame{
		private _fTime:   float = 0.0;
		private _fWeight: float = 1.0;

		private _pMatrix: IMat4 = null;

		private _qRotation:      IQuat4 = new Quat4;
		private _v3fScale:       IVec3  = new Vec3;
		private _v3fTranslation: IVec3  = new Vec3;

		/**@inline*/  get time(): float{
			return this._fTime;
		}

		/**@inline*/  set time(fValue: float){
			this._fTime = fValue;
		}

		/**@inline*/  get weight(): float{
			return this._fWeight;
		}

		/**@inline*/  set weight(fValue: float){
			this._fWeight = fValue;
		}

		/**@inline*/  get matrix(): IMat4{
			return this._pMatrix;
		}

		/**@inline*/  set matrix(pMatrix: IMat4){
			this._pMatrix = pMatrix;
		}

		/**@inline*/  get rotation(): IQuat4{
			return this._qRotation;
		}

		/**@inline*/  set rotation(qRotation: IQuat4){
			this._qRotation = qRotation;
		}

		/**@inline*/  get scale(): IVec3{
			return this._v3fScale;
		}

		/**@inline*/  set scale(v3fScale: IVec3){
			this._v3fScale = v3fScale;
		}

		/**@inline*/  get translation(): IVec3{
			return this._v3fTranslation;
		}

		/**@inline*/  set translation(v3fTranslation: IVec3){
			this._v3fTranslation = v3fTranslation;
		}

		constructor(fTime?: float, pMatrix?: IMat4, fWeight?: float) {
			switch (arguments.length) {
				case 0:
					this.matrix = new Mat4;
					return;
				case 3:
					this.weight = fWeight;
				case 2:
					this.matrix = pMatrix;
				case 1:
					this.time = fTime;
			};

			this.matrix.decompose(this.rotation, this.scale, this.translation);
		}

		toMatrix(): IMat4{
			return this.rotation.toMat4(this.matrix)
				.setTranslation(this.translation).scaleRight(this.scale);
		}

		toMatrixFromMatrix(): IMat4 {
			return this.matrix;
		}

		reset(): IAnimationFrame {
			this.weight = 0.0;
			this.time = 0.0;

			var pData = this.matrix.data;
			pData[ 0 ] = pData[ 4 ] = pData[ 8 ] = pData[ 12 ] =
			pData[ 1 ] = pData[ 5 ] = pData[ 9 ] = pData[ 13 ] =
			pData[ 2 ] = pData[ 6 ] = pData[ 10 ] = pData[ 14 ] =
			pData[ 3 ] = pData[ 7 ] = pData[ 11 ] = pData[ 15 ] = 0;

			this.rotation.x = this.rotation.y = this.rotation.z = 0;
			this.rotation.w = 1.0;

			this.translation.x = this.translation.y = this.translation.z = 0;

			this.scale.x = this.scale.y = this.scale.z = 0;

			return this;
		}

		set(pFrame: IAnimationFrame): void {
//FIXME: расписать побыстрее
			this.matrix.set(pFrame.matrix);

			this.rotation.set(pFrame.rotation);
			this.scale.set(pFrame.scale);
			this.translation.set(pFrame.translation);

			this.time = pFrame.time;
			this.weight = pFrame.weight;
		}

		add(pFrame: IAnimationFrame, isFirst: bool): IAnimationFrame {
			var fWeight: float = pFrame.weight;

			this.scale.x += pFrame.scale.x * fWeight;
			this.scale.y += pFrame.scale.y * fWeight;
			this.scale.z += pFrame.scale.z * fWeight;

			this.translation.x += pFrame.translation.x * fWeight;
			this.translation.y += pFrame.translation.y * fWeight;
			this.translation.z += pFrame.translation.z * fWeight;

			this.weight += fWeight;

			if (!isFirst) {
				this.rotation.smix(pFrame.rotation, fWeight / this.weight);
			}
			else {
				this.rotation.set(pFrame.rotation);
			}

			return this;
		}

		addMatrix(pFrame: IAnimationFrame): IAnimationFrame {
			var pMatData = pFrame.matrix.data;
			var fWeight: float = pFrame.weight;
			var pResData = this.matrix.data;

			for (var i = 0; i < 16; ++ i) {
				pResData[i] += pMatData[i] * fWeight;
			}

			this.weight += fWeight;
			return this;
		}

		mult(fScalar: float): IAnimationFrame{
			this.weight *= fScalar;
			return this;
		}

		normilize(): IAnimationFrame{
			var fScalar: float = 1.0 / this.weight;

		    this.scale.x *= fScalar;
		    this.scale.y *= fScalar;
		    this.scale.z *= fScalar;

		    this.translation.x *= fScalar;
		    this.translation.y *= fScalar;
		    this.translation.z *= fScalar;

			return this;
		}

		normilizeMatrix(): IAnimationFrame{
			var fScalar: float = 1.0 / this.weight;
		    var pData = this.matrix.data;

		    pData[ 0 ] *= fScalar;
		    pData[ 4 ] *= fScalar;
		    pData[ 8 ] *= fScalar;
		    pData[ 12 ] *= fScalar;

			pData[ 1 ] *= fScalar;
		    pData[ 5 ] *= fScalar;
		    pData[ 9 ] *= fScalar;
		    pData[ 13 ] *= fScalar;

			pData[ 2 ] *= fScalar;
		    pData[ 6 ] *= fScalar;
		    pData[ 10 ] *= fScalar;
		    pData[ 14 ] *= fScalar;

			pData[ 3 ] *= fScalar;
		    pData[ 7 ] *= fScalar;
		    pData[ 11 ] *= fScalar;
		    pData[ 15 ] *= fScalar;

			return this;
		}

		interpolate(pStartFrame: IAnimationFrame, pEndFrame: IAnimationFrame, fBlend: float): void {
			var pResultData = this.matrix.data;
			var pStartData = pStartFrame.matrix.data;
			var pEndData = pEndFrame.matrix.data;
			var fBlendInv = 1. - fBlend;

			for (var i = 0; i < 16; i++) {
				pResultData[i] = pEndData[i] * fBlend + pStartData[i] * fBlendInv;
			};
		}

		interpolateMatrix(pStartFrame: IAnimationFrame, pEndFrame: IAnimationFrame, fBlend: float): void {
			var pResultData = this.matrix.data;
			var pStartData = pStartFrame.matrix.data;
			var pEndData = pEndFrame.matrix.data;
			var fBlendInv: float = 1. - fBlend;

			for (var i = 0; i < 16; i++) {
				pResultData[i] = pEndData[i] * fBlend + pStartData[i] * fBlendInv;
			};
		}
	}

	export function animationFrame(): IAnimationFrame {
		return null;
	}
}










module akra.animation {
	export class AnimationTrack implements IAnimationTrack{
		private _sTarget: string;
		private _pTarget: INode = null;
		private _pKeyFrames: IAnimationFrame[] = [];
		private _eInterpolationType: EAnimationInterpolations = EAnimationInterpolations.MATRIX_LINEAR;

		/**@inline*/  get target(): INode{
			return this._pTarget;
		}

		/**@inline*/  get targetName(): string{
			return this._sTarget;
		}

		/**@inline*/  set targetName(sValue: string){
			this._sTarget = sValue;
		}

		/**@inline*/  get duration(): float{
			return this._pKeyFrames.last.fTime;
		}

		keyFrame(fTime: float, pMatrix: IMat4): bool {
			var pFrame: IAnimationFrame;
		    var iFrame: int;

		    var pKeyFrames: IAnimationFrame[] = this._pKeyFrames;
		  	var nTotalFrames: int = pKeyFrames.length;

		  	if (arguments.length > 1) {
		  		pFrame = new animation.AnimationFrame(fTime, pMatrix);
		  	}
		    else {
		    	pFrame = arguments[0];
		    }

		    if (nTotalFrames && (iFrame = this.findKeyFrame(pFrame.time)) >= 0) {
				pKeyFrames.splice(iFrame, 0, pFrame);
			}
			else {
				pKeyFrames.push(pFrame);
			}

			return true;
		}

		getKeyFrame(iFrame: int): IAnimationFrame {
			debug_assert(iFrame < this._pKeyFrames.length, 'iFrame must be less then number of total jey frames.');

			return this._pKeyFrames[iFrame];
		}

		findKeyFrame(fTime: float): int {
			var pKeyFrames: IAnimationFrame[] = this._pKeyFrames;
		    var nTotalFrames: int             = pKeyFrames.length;

			if (pKeyFrames[nTotalFrames - 1].time == fTime) {
				return nTotalFrames - 1;
			}
			else {
				for (var i: int = nTotalFrames - 1; i >= 0; i--) {
					if (pKeyFrames[i].time > fTime && pKeyFrames[i - 1].time <= fTime) {
						return i - 1;
					}
				}
			}

			return -1;
		}

		bind(sJoint: string, pSkeleton: ISkeleton): bool;
		bind(pSkeleton: ISkeleton): bool;
		bind(pNode: INode): bool;
		bind(pJoint: any, pSkeleton?: any): bool {
			var pNode: INode = null,
				pRootNode: INode;

			var sJoint: string;

			switch (arguments.length) {
				case 2:
//bind by pair <String joint, Skeleton skeleton>
					sJoint = <string>pJoint;

					this._sTarget = sJoint;
					pNode = (<ISkeleton>pSkeleton).findJoint(sJoint);
					break;
				default:
//bind by <Skeleton skeleton>
					if (arguments[0] instanceof model.Skeleton) {

						if (this._sTarget == null) {
							return false;
						}

						pSkeleton = <ISkeleton>arguments[0];
						pNode = (<ISkeleton>pSkeleton).findJoint(this._sTarget);
					}
//bind by <Node node>
					else if (arguments[0] instanceof scene.Node) {
						pRootNode = <INode>arguments[0];
						pNode = <INode>pRootNode.findEntity(this.targetName);
					}
			}

			this._pTarget = pNode;

			return isDefAndNotNull(pNode);
		}

		frame(fTime: float): IAnimationFrame {
			var iKey1: int = 0, iKey2: int = 0;
			var fScalar: float;
			var fTimeDiff: float;

			var pKeys:  IAnimationFrame[] = this._pKeyFrames
			var nKeys:  int = pKeys.length;
			var pFrame: IAnimationFrame = animation.animationFrame();

			debug_assert(nKeys > 0, 'no frames :(');

			if (nKeys === 1) {
				pFrame.set(pKeys[0]);
			}
			else {
//TODO: реализовать существенно более эффективный поиск кадра.
				for (var i: int = 0; i < nKeys; i ++) {
			    	if (fTime >= this._pKeyFrames[i].time) {
			            iKey1 = i;
			        }
			    }

			    iKey2 = (iKey1 >= (nKeys - 1))? iKey1 : iKey1 + 1;

			    fTimeDiff = pKeys[iKey2].time - pKeys[iKey1].time;

			    if (!fTimeDiff)
			        fTimeDiff = 1;

				fScalar = (fTime - pKeys[iKey1].time) / fTimeDiff;

				pFrame.interpolate(
					this._pKeyFrames[iKey1],
					this._pKeyFrames[iKey2],
					fScalar);
			}

			pFrame.time = fTime;
			pFrame.weight = 1.0;

			return pFrame;
		}
	}
}












module akra {
	export interface IAnimationBase {} ;

	export interface IAnimationElement{
		animation: IAnimationBase;
		weight: float;
		mask: FloatMap;
		acceleration?: float;
		time: float;
		realTime: float;
	}

	export interface IAnimationBlend extends IAnimationBase {
		 totalAnimations: int;

		play(fRealTime: float): void;
		stop(): void;

		attach(pTarget: INode): void;

		addAnimation(pAnimation: IAnimationBase, fWeight: float, pMask: FloatMap): int;
		setAnimation(iAnimation: int, pAnimation: IAnimationBase, fWeight: float, pMask: FloatMap): int;
		updateDuration(): void;
		getAnimationIndex(sName: string): int;
		getAnimation(iAnimation: int): IAnimationBase;
		getAnimationWeight(iAnimation: int): float;
		setWeights(): bool;
		setWeightSwitching(fWeight: float, iAnimationFrom: int, iAnimationTo: int): bool;
		setAnimationWeight(iAnimation: int, fWeight: float): bool;

		setAnimationMask(iAnimation: int, pMask: FloatMap): bool;
		getAnimationMask(iAnimation: int): FloatMap;
		createAnimationMask(iAnimation?: int): FloatMap;

		frame(sName: string, fRealTime: float): IAnimationFrame;
	}
}




module akra.animation {
	export class AnimationBlend extends AnimationBase implements IAnimationBlend {

		private _pAnimationList: IAnimationElement[] = [];
		public  duration = 0;

		/**@inline*/  get totalAnimations(): int{
			return this._pAnimationList.length;
		}

		play(fRealTime: float): void {
			var pAnimationList: IAnimationElement[] = this._pAnimationList;
			var n: int = pAnimationList.length;
//trace('AnimationBlend::play(', this.name, fRealTime, ')');
			for (var i: int = 0; i < n; ++ i) {

				pAnimationList[i].realTime = fRealTime;
				pAnimationList[i].time = fRealTime * pAnimationList[i].acceleration;
//trace(pAnimationList[i]);
			}

			this.onplay(fRealTime);
		}

		stop(): void {
			this.onstop();
		}

		attach(pTarget: INode): void {
			var pAnimationList: IAnimationElement[] = this._pAnimationList;

			for (var i: int = 0; i < pAnimationList.length; ++ i) {
				var pAnim: IAnimationBase = pAnimationList[i].animation;
				pAnim.attach(pTarget);
				this.grab(pAnim, true);
			}
		}

		addAnimation(pAnimation: IAnimationBase, fWeight: float, pMask: FloatMap): int {
			debug_assert(isDef(pAnimation), 'animation must be setted.');

			this._pAnimationList.push(null);
			return this.setAnimation(this._pAnimationList.length - 1, pAnimation, fWeight, pMask);
		}

		setAnimation(iAnimation: int, pAnimation: IAnimationBase, fWeight: float = 1.0, pMask: FloatMap = null): int {
			debug_assert(iAnimation <= this._pAnimationList.length, 'invalid animation slot: ' + iAnimation + '/' + this._pAnimationList.length);

		    var pPointer: IAnimationElement = this._pAnimationList[iAnimation];
		    var pAnimationList: IAnimationElement[] = this._pAnimationList;

		    if (!pAnimation) {
		    	pAnimationList[iAnimation] = null;
		    	return iAnimation;
		    }

		    if (!pPointer) {
		    	pPointer = {
					animation: pAnimation,
					weight: fWeight,
					mask: pMask,
					acceleration: 1.0,
					time: 0.0,
					realTime: 0.0
				};

				this.connect(pAnimation, "updateAnimation" , "onUpdateAnimation" )

				if (iAnimation == this._pAnimationList.length) {
					pAnimationList.push(pPointer);
				}
				else {
					pAnimationList[iAnimation] = pPointer;
				}
			}

			this.grab(pAnimation);
			this.updateDuration();

			return iAnimation;
		}

		updateDuration(): void {
			var fWeight: float = 0;
			var fSumm: float = 0;
			var pAnimationList: IAnimationElement[] = this._pAnimationList;
			var n: int = pAnimationList.length;

			for (var i: int = 0; i < n; ++ i) {
				if (pAnimationList[i] === null) {
					continue;
				}

				fSumm += pAnimationList[i].weight * pAnimationList[i].animation.duration;
				fWeight += pAnimationList[i].weight;
			}

			if (fWeight === 0) {
				this.duration = 0;
			}
			else {

				this.duration = fSumm / fWeight;

				for (var i: int = 0; i < n; ++ i) {
					if (pAnimationList[i] === null) {
						continue;
					}

					pAnimationList[i].acceleration = pAnimationList[i].animation.duration / this.duration;
//trace(pAnimationList[i].animation.name, '> acceleration > ', pAnimationList[i].acceleration);
				}
			}

			this.onUpdateDuration();
		}

		getAnimationIndex(sName: string): int {
			var pAnimationList: IAnimationElement[] = this._pAnimationList;

			for (var i: int = 0; i < pAnimationList.length; i++) {
				if (pAnimationList[i].animation.name === sName) {
					return i;
				}
			};

			return -1;
		}


		getAnimation(iAnimation: int): IAnimationBase {
			if (typeof arguments[0] === 'string') {
		    	iAnimation = this.getAnimationIndex(arguments[0]);
		    }

			return this._pAnimationList[iAnimation].animation;
		}

		getAnimationWeight(iAnimation: int): float {
			if (typeof arguments[0] === 'string') {
				iAnimation = this.getAnimationIndex(arguments[0]);
			}

			return this._pAnimationList[iAnimation].weight;
		}

		setWeights(): bool {
			var fWeight: float;
    		var isModified: bool = false;
		    var pAnimationList: IAnimationElement[] = this._pAnimationList;

			for (var i: int = 0; i < arguments.length; ++ i) {
				fWeight = arguments[i];

				if (fWeight < 0 || fWeight === null || !pAnimationList[i]) {
					continue;
				}

				if (pAnimationList[i].weight !== fWeight) {
					pAnimationList[i].weight = fWeight;
					isModified = true;
				}
			}

			if (isModified) {
				this.updateDuration();
			}

			return true;
		}

		setWeightSwitching(fWeight: float, iAnimationFrom: int, iAnimationTo: int): bool {
			var pAnimationList: IAnimationElement[] = this._pAnimationList;
		    var isModified: bool = false;
		    var fWeightInv: float = 1. - fWeight;

		    if (!pAnimationList[iAnimationFrom] || !pAnimationList[iAnimationTo]) {
		    	return false;
		    }

		    if (pAnimationList[iAnimationFrom].weight !== fWeightInv) {
				pAnimationList[iAnimationFrom].weight = fWeightInv;
				isModified = true;
			}

			if (pAnimationList[iAnimationTo].weight !== fWeight) {
				pAnimationList[iAnimationTo].weight = fWeight;
				isModified = true;
			}

			if (isModified) {
				this.updateDuration();
			}

			return true;
		}

		setAnimationWeight(iAnimation: int, fWeight: float): bool {
			var pAnimationList = this._pAnimationList;
		    var isModified = false;
		    if (arguments.length === 1) {
		    	fWeight = arguments[0];

		    	for (var i = 0; i < pAnimationList.length; i++) {
		    		pAnimationList[i].weight = fWeight;
		    	};

		    	isModified = true;
		    }
		    else {
			    if (typeof arguments[0] === 'string') {
			    	iAnimation = this.getAnimationIndex(arguments[0]);
			    }

//trace('set weight for animation: ', iAnimation, 'to ', fWeight);
			    if (pAnimationList[iAnimation].weight !== fWeight) {
					pAnimationList[iAnimation].weight = fWeight;
					isModified = true;
				}
			}

			if (isModified) { this.updateDuration(); }

			return true;
		}

		setAnimationMask(iAnimation: int, pMask: FloatMap): bool {
			if (typeof arguments[0] === 'string') {
		    	iAnimation = this.getAnimationIndex(arguments[0]);
		    }

			this._pAnimationList[iAnimation].mask = pMask;

			return true;
		}

		getAnimationMask(iAnimation: int): FloatMap {
			if (typeof arguments[0] === 'string') {
		    	iAnimation = this.getAnimationIndex(arguments[0]);
		    }

			return this._pAnimationList[iAnimation].mask;
		}

		createAnimationMask(iAnimation?: int): FloatMap {
			if (arguments.length === 0) {
				return animation.AnimationBase.prototype.createAnimationMask.call(this);
			}

			if (typeof arguments[0] === 'string') {
		    	iAnimation = this.getAnimationIndex(arguments[0]);
		    }

		    var pAnimation: IAnimationBase = this._pAnimationList[iAnimation].animation;
			return pAnimation.createAnimationMask();
		}

		frame(sName: string, fRealTime: float) {
			var pAnimationList: IAnimationElement[] = this._pAnimationList;
			var pResultFrame: IAnimationFrame = animation.animationFrame().reset();
			var pFrame: IAnimationFrame;
			var pMask: FloatMap;
			var pPointer: IAnimationElement;
			var fAcceleration: float;

			var fBoneWeight: float;
			var fWeight: float;
			var iAnim: int = 0;


			for (var i: int = 0; i < pAnimationList.length; i++) {
				pPointer = pAnimationList[i];

				if (!pPointer) {
					continue;
				}

				fAcceleration = pPointer.acceleration;
				pMask = pPointer.mask;
				fBoneWeight = 1.0;

				pPointer.time = pPointer.time + (fRealTime - pPointer.realTime) * fAcceleration;
		    	pPointer.realTime = fRealTime;

		    	if (pMask) {
					fBoneWeight = isDef(pMask[sName]) ? pMask[sName] : 1.0;
				}

				fWeight = fBoneWeight * pPointer.weight;

				if (fWeight > 0.0) {
					pFrame = pPointer.animation.frame(sName, pPointer.time);

					if (pFrame) {
						iAnim ++;
//first, if 1						pResultFrame.add(pFrame.mult(fWeight), iAnim === 1);
					}
				}
			}

			if (pResultFrame.weight === 0.0) {
				return null;
			}

			return pResultFrame.normilize();
		}


		private _iGuid: uint = sid(); private static _pEvenetTable: IEventTable = new events.EventTable(); /**@inline*/ getEventTable(): IEventTable {return AnimationBase._pEvenetTable; } /**@inline*/ getGuid(): uint {return this._iGuid; } /**@inline*/ connect(pSender: IEventProvider, sSignal: string, sSlot: string, eType?: EEventTypes): bool { return pSender.getEventTable().addDestination(pSender.getGuid(), sSignal, this, sSlot, eType); }; /**@inline*/ bind(sSignal: string, fnListener: Function, eType?: EEventTypes): bool { return this.getEventTable().addListener(this.getGuid(), sSignal, fnListener, eType); } ;
			onplay (fRealTime) : void { var broadcast: IEventSlot[] = (this.getEventTable()).broadcast[this._iGuid]["onplay"]; for (var i = 0; i < broadcast.length; ++ i) { broadcast[i].target? broadcast[i].target[broadcast[i].callback] (fRealTime) : broadcast[i].listener (fRealTime) ; } } ; ;
			onstop () : void { var broadcast: IEventSlot[] = (this.getEventTable()).broadcast[this._iGuid]["onstop"]; for (var i = 0; i < broadcast.length; ++ i) { broadcast[i].target? broadcast[i].target[broadcast[i].callback] () : broadcast[i].listener () ; } } ; ;
			onUpdateDuration () : void { var broadcast: IEventSlot[] = (this.getEventTable()).broadcast[this._iGuid]["onUpdateDuration"]; for (var i = 0; i < broadcast.length; ++ i) { broadcast[i].target? broadcast[i].target[broadcast[i].callback] () : broadcast[i].listener () ; } } ; ;
		;
	}
}










module akra {
	export interface IAnimationBase {} ;
	export interface IAnimationFrame {} ;

	export interface IAnimationContainer extends IAnimationBase {
		 animationName: string;
		 speed: float;
		 animationTime: float;

		getTime(): float;
		play(fRealTime: float): void;
		stop(): void;

		attach(pTarget: INode): void;

		setAnimation(pAnimation: IAnimationBase): void;
		getAnimation(): IAnimationBase;

		enable(): void;
		disable(): void;
		isEnabled(): bool;

		leftInfinity(bValue: bool): void;
		rightInfinity(bValue: bool): void;

		setStartTime(fRealTime: float): void;
		getStartTime(): float;

		setSpeed(fSpeed: float): void;
		getSpeed(): float;

		useLoop(bValue: bool): void;
		inLoop(): bool;

		reverse(bValue: bool): void;
		isReversed(): bool;

		pause(bValue: bool): void;
		rewind(fRealTime: float): void;
		isPaused(): bool;

		time(fRealTime: float): void;

		frame(sName: string, fRealTime: float): IAnimationFrame;
	}
}








module akra.animation {
	export class AnimationContainer extends AnimationBase implements IAnimationContainer {

		private _bEnable: bool = true;
		private _fStartTime: float = 0;
		private _fSpeed: float = 1.0;
		private _bLoop: bool = false;
		private _pAnimation: IAnimationBase = null;
		private _bReverse: bool = false;

//Время учитывающее циклы и прочее.		private _fTrueTime: float = 0;
//реальное время на сцене		private _fRealTime: float = 0;
//время с учетом ускорений		private _fTime: float = 0;
		private _bPause: bool = false;

//определена ли анимация до первого и после последнего кадров
		private _bLeftInfinity: bool = true;
		private _bRightInfinity: bool = true;

		constructor(pAnimation?: IAnimationBase){
			if (pAnimation) {
				this.setAnimation(pAnimation);
			}
		}

		/**@inline*/  get animationName(): string{
			return this._pAnimation.name;
		}

		/**@inline*/  get speed(): float{
			return this._fSpeed;
		}

		/**@inline*/  get animationTime(): float{
			return this._fTrueTime;
		}

		getTime(): float {
			return this._fTime;
		}

		play(fRealTime: float): void {
			this._fRealTime = fRealTime;
		    this._fTime = 0;

		    this.onplay(fTime);
		}

		stop(): void {
			this.onstop(this._fTime);
		}

		attach(pTarget: INode): void {
			this._pAnimation.bind(pTarget);
			this.grab(this._pAnimation, true);
		}

		setAnimation(pAnimation: IAnimationBase): void {
			debug_assert(!this._pAnimation, 'anim. already exists');

			this._pAnimation = pAnimation;
			this.setSpeed(this.speed);

			var me = this;

/*FIX THIS*/

			this.connect(pAnimation, "updateDuration" , "setSpeed" )

/*pAnimation.on('updateDuration', function () {
				me.setSpeed(me.speed);
			});*/


			this.grab(pAnimation);
		}

		getAnimation(): IAnimationBase {
			return this._pAnimation;
		}

		enable(): void {
			this._bEnable = true;
		}

		disable(): void {
			this._bEnable = false;
		}

		isEnabled(): bool {
			return this._bEnable;
		}

		leftInfinity(bValue: bool): void {
			this._bLeftInfinity = bValue;
		}

		rightInfinity(bValue: bool): void {
			this._bRightInfinity = bValue;
		}

		setStartTime(fRealTime: float): void {
			this._fStartTime = fRealTime;
		}

		getStartTime(): float {
			return this._fStartTime;
		}

		setSpeed(fSpeed: float): void {
			this._fSpeed = fSpeed;
			this._fDuration = this._pAnimation._fDuration / fSpeed;

			this.onUpdateDuration();
		}

		getSpeed(): float {
			return this._fSpeed;
		}

		useLoop(bValue: bool): void {
			this._bLoop = bValue;
		}

		inLoop(): bool {
			return this._bLoop;
		}

		reverse(bValue: bool): void {
			this._bReverse = bValue;
		}

		isReversed(): bool {
			return this._bReverse;
		}

		pause(bValue: bool): void {
			this._fRealTime = -1;
			this._bPause = bValue;
		}

		rewind(fRealTime: float): void {
			this._fTime = fRealTime;
		}

		isPaused(): bool {
			return this._bPause;
		}

		time(fRealTime: float): void{
			if (this._bPause) {
		    	return;
		    }

		    if (this._fRealTime < 0) {
		    	this._fRealTime = fRealTime;
		    }

		    this._fTime = this._fTime + (fRealTime - this._fRealTime) * this._fSpeed;
		    this._fRealTime = fRealTime;

		    var fTime = this._fTime;

		    if (this._bLoop) {
		    	fTime = Math.mod(fTime, (this._pAnimation._fDuration));
		    	if (this._bReverse) {
		    		fTime = this._pAnimation._fDuration - fTime;
		    	}
		    }

		    this._fTrueTime = fTime;
		}

		frame(sName: string, fRealTime: float): IAnimationFrame {
			if (!this._bEnable) {
		    	return null;
		    }

		    if (this._fRealTime !== fRealTime) {
		    	this.time(fRealTime);
		    	this.fire(a.Animation.EVT_ENTER_FRAME, fRealTime);
//trace('--->', this.name);
		    }

		    if (!this._bLeftInfinity && this._fRealTime < this._fStartTime) {
		    	return null;
		    }

			if (!this._bRightInfinity && this._fRealTime > this._fDuration + this._fStartTime) {
		    	return null;
		    }

			return this._pAnimation.frame(sName, this._fTrueTime);
		}


		private _iGuid: uint = sid(); private static _pEvenetTable: IEventTable = new events.EventTable(); /**@inline*/ getEventTable(): IEventTable {return AnimationBase._pEvenetTable; } /**@inline*/ getGuid(): uint {return this._iGuid; } /**@inline*/ connect(pSender: IEventProvider, sSignal: string, sSlot: string, eType?: EEventTypes): bool { return pSender.getEventTable().addDestination(pSender.getGuid(), sSignal, this, sSlot, eType); }; /**@inline*/ bind(sSignal: string, fnListener: Function, eType?: EEventTypes): bool { return this.getEventTable().addListener(this.getGuid(), sSignal, fnListener, eType); } ;
			onplay (fTime) : void { var broadcast: IEventSlot[] = (this.getEventTable()).broadcast[this._iGuid]["onplay"]; for (var i = 0; i < broadcast.length; ++ i) { broadcast[i].target? broadcast[i].target[broadcast[i].callback] (fTime) : broadcast[i].listener (fTime) ; } } ; ;
			onstop (fTime) : void { var broadcast: IEventSlot[] = (this.getEventTable()).broadcast[this._iGuid]["onstop"]; for (var i = 0; i < broadcast.length; ++ i) { broadcast[i].target? broadcast[i].target[broadcast[i].callback] (fTime) : broadcast[i].listener (fTime) ; } } ; ;
			onUpdateDuration () : void { var broadcast: IEventSlot[] = (this.getEventTable()).broadcast[this._iGuid]["onUpdateDuration"]; for (var i = 0; i < broadcast.length; ++ i) { broadcast[i].target? broadcast[i].target[broadcast[i].callback] () : broadcast[i].listener () ; } } ; ;
		;
	}
}
















module akra {

    export interface IEngine {} ;
    export interface IDisplay {} ;
    export interface IDisplay2d {} ;
    export interface IDisplay3d {} ;

    export interface IDisplayManager extends IManager {
        createDisplay3D(): IDisplay3d;
        createDisplay3D(pCanvas: HTMLCanvasElement): IDisplay3d;
    	createDisplay3D(sCanvas?: string): IDisplay3d;

        createDisplay2D(): IDisplay2d;

        getDisplay3D(iDisplay?: uint): IDisplay3d;
        getDisplay2D(iDisplay?: uint): IDisplay2d;
        getDisplay(iDisplay?: uint, eType?: EDisplayTypes): IDisplay;

//enable all display
        display(): bool;
    }
}









module akra {
    export interface IParticleManager extends IManager {

    }
}







module akra.core {
	export class Engine implements IEngine {

		private pResourceManager: IResourcePoolManager = null;
		private pDisplayManager: IDisplayManager = null;
		private pParticleManager: IParticleManager = null;

		constructor () {
			this.pResourceManager = new pool.ResourcePoolManager(this);
			this.pDisplayManager = new DisplayManager(this);


			if (!this.pResourceManager.initialize()) {
				debug_error('cannot initialize ResourcePoolManager');
			}

			if (!this.pDisplayManager.initialize()) {
				debug_error("cannot initialize DisplayManager");
			}
		}

		getDisplayManager(): IDisplayManager {
			return null;
		}

		getParticleManager(): IParticleManager {
			return null;
		}

		getResourceManager(): IResourcePoolManager {
			return null;
		}

		getDefaultRenderer(): IRenderer {
			var pDisplay: IDisplay3d = this.pDisplayManager.getDisplay3D();

			if (isNull(pDisplay)) {
				return null;
			}

			return pDisplay.getRenderer();
		}


		exec(): bool {
			return this.pDisplayManager.display();
		}

	}

}

module akra {
	createEngine = function (): IEngine {
		return new core.Engine();
	}
}

/*
		private initDefaultStates(): bool {
			this.pRenderState = {
		        mesh            : {
		            isSkinning : false
		        },
		        isAdvancedIndex : false,
		        lights          : {
		            omni : 0,
		            project : 0,
		            omniShadows : 0,
		            projectShadows : 0
		        }
		    };

			return true;
		}
 */




















module akra {
	export interface IDisplay2d extends IDisplay {

	}
}






module akra {
    export class DisplayManager implements IDisplayManager {
        private pEngine: IEngine = null;
        private pDisplayList: IDisplay[] = [];


        constructor (pEngine: IEngine) {
            this.pEngine = pEngine;
        }

        createDisplay3D(): IDisplay3d;
        createDisplay3D(pCanvas: HTMLCanvasElement): IDisplay3d;
        createDisplay3D(sCanvas?: string): IDisplay3d {
            var pDisplay: IDisplay3d = new display.Display3d(this, sCanvas);
            this.pDisplayList.push(pDisplay);

            return pDisplay;
        }

        createDisplay2D(): IDisplay2d {
            return null;
        }

        getDisplay3D(iDisplay: uint = 0): IDisplay3d {
            var pDisplay: IDisplay = this.pDisplayList[iDisplay];

            if (pDisplay && pDisplay.type === EDisplayTypes.TYPE_3D) {
                return <IDisplay3d>pDisplay;
            }

            return null;
        }

        getDisplay2D(iDisplay?: uint): IDisplay2d {
            var pDisplay: IDisplay = this.pDisplayList[iDisplay];

            if (pDisplay && pDisplay.type === EDisplayTypes.TYPE_2D) {
                return pDisplay;
            }

            return null;
        }

        getDisplay(iDisplay?: uint, eType?: EDisplayTypes): IDisplay {
            return this.pDisplayList[iDisplay] || null;
        }

//enable all display
        display(): bool {
            return false;
        }

        initialize(): bool {
//this.initText2Dlayer();
            return true;
        }

        destroy(): void {

        }
    }
}





/** @inline */
/*
        draw2DText(iX: int = 0, iY: int = 0, sText: string = "", pFont: IFont2d = new util.Font2d()): IString2d {
            return (new a.String2D(iX, iY, pFont, sStr, this.pTextLayer));
        }

        

        private initText2Dlayer(): void {
            var pCanvas: HTMLCanvasElement = this.pEngine.canvas;
            var x: int = findPosX(pCanvas);
            var y: int = findPosY(pCanvas);

            var pDiv: HTMLDivElement = <HTMLDivElement>document.createElement('div');
            var pStyle: CSSStyleDeclaration = pDiv.style;
            var pScreen: IScreenInfo = info.screen;

            var iBorder: int = 0;

            pDiv.setAttribute("id", "akra-canvas-overlay");

            pStyle.width = String(pScreen.width) + "px";
            pStyle.height = String(pScreen.height) + "px";
            
            if (pCanvas.style.border != "none") {
                iBorder = parseInt(pCanvas.style.border);
            }

            pStyle.position = 'absolute';
            pStyle.left = String(x) + 'px';
            pStyle.top = String(y) + 'px';

            pStyle.overflow = 'hidden';
            pStyle.whiteSpace = 'nowrap';

            if (pCanvas.style.zIndex) {
                pStyle.zIndex = pCanvas.style.zIndex + 1;
            }
            else {
                pStyle.zIndex = 2;
            }

            document.body.appendChild(pDiv);

            this.pTextLayer = pDiv;
        }
*/







module akra.display {

}

















///<reference path="akra.ts" />

module akra {
	export interface IScreen extends IMesh {

	}
}









module akra.display {
	export class Display3d implements IDisplay3d {
		private fMillisecondsPerTick: float = 0.0333;

		private pDisplayManager: IDisplayManager;
		private pCanvas: HTMLCanvasElement;
		private pScene: IScene3d;
		private pBuilder: ISceneBuilder;
		private pRenderer: IRenderer;
		private pScreen: IScreen;

		private pTimer: IUtilTimer;
		private iAppPausedCount: int = 0;

		private pBuildScript: IBuildScenario = null;

/**
		 * Frame sync.
		 */


/** is paused? */

		private isActive: bool = false;
/** frame rendering sync / render next frame? */

		private isFrameMoving: bool = true;
/** render only one frame */

		private isSingleStep: bool = true;
/** can we update scene? */

		private isFrameReady: bool = false;

/**
		 * Time statistics
		 */


/** current time */

		private fTime: float = 0.;
/** time elapsed since the last frame */

		private fElapsedTime: float = 0.;
/** time elapsed since the last rendered frame */

		private fUpdateTimeCount: float = 0.;
/** frame per second */

		private fFPS: float = 0.;
		private fLastTime: float = 0.;
		private nTotalFrames: uint = 0;
		private iFrames: uint = 0;

		private useHarwareAntialiasing: bool = false;
		private pCreationInfo: ICanvasInfo = null;


		get type(): EDisplayTypes {
			return EDisplayTypes.TYPE_3D;
		}

		get totalFrames(): uint {
			return this.nTotalFrames;
		}

		constructor (pDisplayManager: IDisplayManager);
		constructor (pDisplayManager: IDisplayManager, pCanvas?: HTMLCanvasElement);
		constructor (pDisplayManager: IDisplayManager, sCanvas?: string);
		constructor (pDisplayManager: IDisplayManager, pCanvas?: any) {
			if (isDef(pCanvas)) {

//get HTMLCanvasElement by id
				if (isString(pCanvas)) {
					this.pCanvas = <HTMLCanvasElement>document.getElementById(pCanvas);
				}
				else {
					this.pCanvas = <HTMLCanvasElement>pCanvas;
				}
			}
			else {
				this.pCanvas = <HTMLCanvasElement>document.createElement('canvas');
			}

			this.pDisplayManager = pDisplayManager;
			this.pRenderer = new render.Renderer(this);
			this.pScene = new scene.Scene3d(this);
			this.pBuilder = scene.SceneBuilder.getSingleton();

			this.pTimer = util.UtilTimer.start();

			this.pause(true);

			this.pCreationInfo = info.canvas(this.pCanvas);
//this._pResourceManager.restoreResourceFamily(a.ResourcePoolManager.VideoResource);
		}

		render() {
			var pDisplay: IDisplay3d = this;
			var pRenderer: IRenderer = this.pRenderer;
			var fnRender = (iTime: int): void => {
				if ( DEBUG ) {
					if (pRenderer.isDeviceLost()) {
						debug_error("Device lost");
					}
				}

				if (pDisplay.inRendering()) {
					if (!pDisplay.renderFrame()) {
		                debug_error("Display3d::renderFrame() error.");
		            }
				}

				requestAnimationFrame(fnRender, pDisplay.getCanvas());
			}

			requestAnimationFrame(fnRender, this.pCanvas);
		}



		renderFrame(): bool {
			var fAppTime = this.pTimer.execCommand(EUtilTimerCommands.TIMER_GET_APP_TIME);
		    var fElapsedAppTime = this.pTimer.execCommand(EUtilTimerCommands.TIMER_GET_ELAPSED_TIME);

		    if ((0 == fElapsedAppTime ) && this.isFrameMoving) {
		        return true;
		    }

// FrameMove (animate) the scene
		    if (this.isFrameMoving || this.isSingleStep) {
// Store the time for the app
		        this.fTime = fAppTime;
		        this.fElapsedTime = fElapsedAppTime;

// Frame move the scene
		        if (!this.frameMove()) {
		            return false;
		        }

		        this.isSingleStep = false;
		    }

// Render the scene as normal
		    if (!this.pBuilder.build(this.pBuildScript)) {
		    	return false;
		    }

		    if (this.isFrameReady) {
//notifyPreUpdateScene();
		        this.pScene.recursivePreUpdate();
		    }

		    this.updateStats();
			return true;
		}

		play(): bool {
			if (!this.isActive) {
				this.iAppPausedCount = 0;
				this.isActive = true;

				if (this.isFrameMoving) {
		            this.pTimer.start();
		        }
	        }

	        return this.isActive;
		}

		pause(isPause: bool = false): bool {
			this.iAppPausedCount += ( isPause ? +1 : -1 );
		    this.isActive = ( this.iAppPausedCount ? false : true );

// Handle the first pause request (of many, nestable pause requests)
		    if (isPause && ( 1 == this.iAppPausedCount )) {
// Stop the scene from animating
		        if (this.isFrameMoving) {
		            this.pTimer.stop();
		        }
		    }

		    if (0 == this.iAppPausedCount) {
// Restart the timers
		        if (this.isFrameMoving) {
		            this.pTimer.start();
		        }
		    }

		    return !this.isActive;
		}

		fullscreen(): bool {
			return false;
		}

		getCanvas(): HTMLCanvasElement {
			return this.pCanvas;
		}

		getScene(): IScene3d {
			return this.pScene;
		}

		getBuilder(): ISceneBuilder {
			return this.pBuilder;
		}

		getRenderer(): IRenderer {
			return this.pRenderer;
		}

		getScreen(): IScreen {
			return this.pScreen;
		}

		getTime(): float {
			return this.fTime;
		}

		getElapsedTime(): float {
			return this.fElapsedTime;
		}

		getFPS(): float {
			return this.fFPS;
		}

/** @inline */

		inRendering(): bool {
			return this.isActive;
		}

/** @inline */

		isFullscreen(): bool {
			return false;
		}

		private frameMove(): bool {
// add the real time elapsed to our
// internal delay counter
		    this.fUpdateTimeCount += this.fElapsedTime;
// is there an update ready to happen?

		    while (this.fUpdateTimeCount > this.fMillisecondsPerTick) {
// update the scene

		        this.pScene.updateCamera();

		        if (!this.pScene.updateScene()) {
		            return false;
		        }

//notifyUpdateScene()
		        this.pScene.recursiveUpdate();
		        this.isFrameReady = true;


// subtract the time interval
// emulated with each tick
		        this.fUpdateTimeCount -= this.fMillisecondsPerTick;
		    }
		    return true;
		}

		private updateStats(): void {
			var fTime = this.pTimer.execCommand(EUtilTimerCommands.TIMER_GET_ABSOLUTE_TIME);

		    this.iFrames ++;
		    this.nTotalFrames ++;

// Update the scene stats once per second
		    if (fTime - this.fLastTime > 1.0) {
		        this.fFPS = <float>this.iFrames / (fTime - this.fLastTime);
		        this.fLastTime = fTime;
		        this.iFrames = 0;
		    }
		}
	}
}





module akra {
	var engine: IEngine = createEngine();
	var dmgr: IDisplayManager = engine.getDisplayManager();
	var view: IDisplay3d = dmgr.createDisplay3D();
	var scene: IScene = view.getScene();
}
