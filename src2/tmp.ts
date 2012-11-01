







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
    export var DEBUG: bool = true;

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
        if (DEBUG) {
            trace.apply(null, arguments);
        }
    }

    export var debug_assert = (isOK: bool, ...pParams: any[]): void => {
        if (DEBUG) {
            assert.apply(null, arguments);
        }
    }

    export var debug_warning = (pArg:any, ...pParams: any[]): void => {
        if (DEBUG) {
            warning.apply(null, arguments);
        }
    }

	export var debug_error = (pArg:any, ...pParams: any[]): void => {
        if (DEBUG) {
            error.apply(null, arguments);
        }
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


    export var INVALID_INDEX: int =  0xffff;

// (-2147483646);    export var MIN_INT32: int = 0xffffffff;
// ( 2147483647);    export var MAX_INT32: int = 0x7fffffff;
// (-32768);    export var MIN_INT16: int = 0xffff;
// ( 32767);    export var MAX_INT16: int = 0x7fff;
// (-128);    export var MIN_INT8: int = 0xff;
// ( 127);    export var MAX_INT8: int = 0x7f;
    export var MIN_UINT32: int = 0;
    export var MAX_UINT32: int = 0xffffffff;
    export var MIN_UINT16: int = 0;
    export var MAX_UINT16: int = 0xffff;
    export var MIN_UINT8: int = 0;
    export var MAX_UINT8: int = 0xff;


    export var SIZE_FLOAT64: int = 8;
    export var SIZE_REAL64: int = 8;
    export var SIZE_FLOAT32: int = 4;
    export var SIZE_REAL32: int = 4;
    export var SIZE_INT32: int = 4;
    export var SIZE_UINT32: int = 4;
    export var SIZE_INT16: int = 2;
    export var SIZE_UINT16: int = 2;
    export var SIZE_INT8: int = 1;
    export var SIZE_UINT8: int = 1;
    export var SIZE_BYTE: int = 1;
    export var SIZE_UBYTE: int = 1;


//1.7976931348623157e+308    export var MAX_FLOAT64: float = Number.MAX_VALUE;
//-1.7976931348623157e+308    export var MIN_FLOAT64: float = -Number.MAX_VALUE;
//5e-324    export var TINY_FLOAT64: float = Number.MIN_VALUE;

//    export var MAX_REAL64: number = Number.MAX_VALUE;   //1.7976931348623157e+308
//    export var MIN_REAL64: number = -Number.MAX_VALUE;  //-1.7976931348623157e+308
//    export var TINY_REAL64: number = Number.MIN_VALUE;  //5e-324


//3.4e38    export var MAX_FLOAT32: float = 3.4e38;
//-3.4e38    export var MIN_FLOAT32: float = -3.4e38;
//1.5e-45    export var TINY_FLOAT32: float = 1.5e-45;

//    export var MAX_REAL32: number = 3.4e38;     //3.4e38
//    export var MIN_REAL32: number = -3.4e38;    //-3.4e38
//    export var TINY_REAL32: number = 1.5e-45;   //1.5e-45

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

//export function 

	(<any>window).URL = (<any>window).URL ? (<any>window).URL : (<any>window).webkitURL ? (<any>window).webkitURL : null;
	(<any>window).BlobBuilder = (<any>window).WebKitBlobBuilder || (<any>window).MozBlobBuilder || (<any>window).BlobBuilder;
	(<any>window).requestFileSystem = (<any>window).requestFileSystem || (<any>window).webkitRequestFileSystem;
	(<any>window).requestAnimationFrame = (<any>window).requestAnimationFrame || (<any>window).webkitRequestAnimationFrame ||
		(<any>window).mozRequestAnimationFrame;
	(<any>window).WebSocket = (<any>window).WebSocket || (<any>window).MozWebSocket;
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





///<reference path="../akra.ts" />

module akra.math {
    export class Vec2 {
        x: float = 0.;
        y: float = 0.;

        constructor ();
        constructor (v2f: Vec2);
        constructor (x: float, y: float);
        constructor (x?, y?) {
            switch (arguments.length) {
                case 0:
                    this.x = this.y =  0.;
                break;
                case 1:
                    this.set(x);
                break;
                case 2:
                    this.set(x, y);
            }

        }


        set(): Vec2;
        set (v2f: Vec2): Vec2;
        set (x: float, y: float): Vec2;
        set (x?, y?): Vec2 {
            switch(arguments.length) {
                case 0:
                    this.x = this.y = 0.;
                    break;
                case 1:
                    if (isFloat(x)) {
                        this.x = x;
                        this.y = x;
                    }
                    else {
                        this.x = x.x;
                        this.y = x.y;
                    }
                    break;
                case 2:
                    this.x = x;
                    this.y = y;
            }

            return this;
        }

    }
}

///<reference path="../akra.ts" />

module akra.math {
    export class Vec3 {
        x: number;
        y: number;
        z: number;


        constructor (f? );
        constructor (v3f: Vec3);
        constructor (v2f: Vec2, z: number);
        constructor (x: number, v2f: Vec2);
        constructor (x: number, y: number, z: number);


        get xy(): Vec2  { return new Vec2(this.x, this.y); }
        get xz(): Vec2  { return new Vec2(this.x, this.z); }
        get yx(): Vec2  { return new Vec2(this.y, this.x); }
        get yz(): Vec2  { return new Vec2(this.y, this.z); }
        get zx(): Vec2  { return new Vec2(this.z, this.x); }
        get zy(): Vec2  { return new Vec2(this.z, this.y); }
        get xyz(): Vec3 { return new Vec3(this.x, this.y, this.z); }

        constructor (x? , y? , z? ) {
//TODO: may be use only simple constructor(x, y, z)?
            switch (arguments.length) {
                case 0:
                    this.x = this.y = this.z = 0.;
                    break;
                case 1:
                    this.set(x);
                    break;
                case 2:
                    this.set(x, y);
                    break;
                case 3:
                    this.set(x, y, z);
            }
        }


        set(v3f: Vec3);
        set(v2f: Vec2, z: number);
        set(x: number, v2f: Vec2);
        set(x: number, y: number, z: number);

/**
         * @inline
         */

        set(x? , y? , z? ): Vec3 {

            switch (arguments.length) {
                case 0:
                case 1:
//number
                    if (isFloat(x)) {
                        this.x = this.y = this.z = x || 0.;
                    }
                    else {
                        this.x = x.x;
                        this.y = x.y;
                        this.z = x.z;
                    }
                    break;
                case 2:
//number and vec2
                    if (isFloat(x)) {
                        this.x = x;
                        this.y = y.x;
                        this.z = y.y;
                    }
//number and vec3
                    else {
                        this.x = x.x;
                        this.y = x.y;
                        this.z = y;
                    }
                    break;
                case 3:
                    this.x = x;
                    this.y = y;
                    this.z = z;
            }

            return this;
        }

/*
         * Performs a vector addition
         * @inline
         */

        add(v3fVec: Vec3, v3fDest?: Vec3): Vec3 {
            if (!v3fDest) {
                v3fDest = this;
            }

            v3fDest.x = this.x + v3fVec.x;
            v3fDest.y = this.y + v3fVec.y;
            v3fDest.z = this.z + v3fVec.z;

            return this;
        }


/**
         * @inline
         */

        toString(): string {
            return "[x: " + this.x + ", y: " + this.y + ", z: " + this.z + "]";
        }

        static v3f: Vec3 = new Vec3;
    }


}

module akra.math {
    export class Vec4 {
        x: float;
        y: float;
        z: float;
        w: float;

        constructor ();
        constructor (f: float);
        constructor (v4f: Vec4);
        constructor (v3f: Vec3, w?: float);
        constructor (x: float, v3f: Vec3);
        constructor (v2f1: Vec2, v2f2: Vec2);
        constructor (x: float, y: float, z: float, w: float);
        constructor (x? , y? , z? , w? ) {
            switch (arguments.length) {
                case 0:
                    this.x = this.y = this.z = this.w = 0.;
                    break;
                case 1:
                    this.set(x);
                    break;
                case 2:
                    this.set(x, y);
                    break;
                case 4:
                    this.set(x, y, z, w);
                    break;
            }

        }


        set(): Vec4;
        set(f: float): Vec4;
        set(v4f: Vec4): Vec4;
        set(v3f: Vec3, w?: float): Vec4;
        set(x: float, v3f: Vec3): Vec4;
        set(v2f1: Vec2, v2f2: Vec2): Vec4;
        set(x: float, y: float, z: float, w: float): Vec4;
        set(x? , y? , z? , w? ): Vec4 {
            switch (arguments.length) {
                case 0:
                    this.x = this.y = this.z = this.w = 0.;
                    break;
                case 1:
//float
                    if (isFloat(x)) {
                        this.x = this.y = this.z = this.w = x;
                    }
//vec4
                    else {
                        this.x = x.x;
                        this.y = x.y;
                        this.z = x.z;
                        this.w = x.w;
                    }
                    break;
                case 2:
//float and vec3
                    if (isFloat(x)) {
                        this.x = x;
                        this.y = y.x;
                        this.z = y.y;
                        this.w = y.z;
                    }
//vec3 and float
                    else if (isFloat(y)) {
                        this.x = x.x;
                        this.y = x.y;
                        this.z = x.z;
                        this.w = y;
                    }
//vec2 and vec2
                    else {
                        this.x = x.x;
                        this.y = x.y;
                        this.z = y.x;
                        this.w = y.y;
                    }
                    break;
                case 4:
                    this.x = x;
                    this.y = y;
                    this.z = z;
                    this.w = w;
            }
            return this;
        }
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

///<reference path="../akra.ts" />

module akra.math {
    export class Mat3 {
    }
}

///<reference path="../akra.ts" />

module akra.math {
    export class Mat4 {

    }
}


///<reference path="../akra.ts" />

module akra.math {
    export class Quat4 {

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
}

module akra {
	export var Vec2 = math.Vec2;
	export var Vec3 = math.Vec3;
	export var Vec4 = math.Vec4;
	export var Mat2 = math.Mat2;
	export var Mat3 = math.Mat3;
	export var Mat4 = math.Mat4;
	export var Quat4 = math.Quat4;
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




/*
#include "IWorldExtents.ts"
#include "IViewport.ts"

#include "IURI.ts"

#include "IKeyMap.ts"
#include "IGamepadMap.ts"

#include "IColor.ts"

#include "IReferenceCounter.ts"
#include "IScreenInfo.ts"
#include "ICanvasInfo.ts"
#include "IBrowserInfo.ts"
#include "IApiInfo.ts"
#include "IDeviceInfo.ts"
#include "IUtilTimer.ts"

#include "info/support/support.ts"
#include "info/info.ts"

#include "IFont2d.ts"
#include "IString2d.ts"

#include "util/util.ts"
#include "util/ReferenceCounter.ts"
#include "util/Singleton.ts"
#include "util/URI.ts"
#include "util/BrowserInfo.ts"
#include "util/ApiInfo.ts"
#include "util/ScreenInfo.ts"
#include "util/DeviceInfo.ts"
#include "util/UtilTimer.ts"

#include "controls/KeyMap.ts"
#include "controls/GamepadMap.ts"

#include "gui/Font2d.ts"
#include "gui/String2d.ts"

#include "IVertexElement.ts"
#include "IvertexDeclaration.ts"

#include "util/VertexElement.ts"
#include "util/VertexDeclaration.ts"

#include "IBufferData.ts"
#include "IVertexData.ts"
#include "IIndexData.ts"
#include "IBufferMap.ts"

#include "IMesh.ts"

#include "IResourceWatcherFunc.ts"
#include "IResourceNotifyRoutineFunc.ts"
#include "IResourceCode.ts"
#include "IDataPool.ts"
#include "IResourcePool.ts"
#include "IResourcePoolItem.ts"
#include "IResourcePoolManager.ts"

#include "IRenderEntry.ts"
#include "IRenderResource.ts"
#include "IRenderableObject.ts"
#include "IRenderSnapshot.ts"


#include "core/pool/ResourceCode.ts"
#include "core/pool/DataPool.ts"
#include "core/pool/ResourcePool.ts"
#include "core/pool/ResourcePoolItem.ts"
#include "core/pool/ResourcePoolManager.ts"

#include "core/pool/resources/IndexBuffer.ts"
#include "core/pool/resources/VertexBuffer.ts"
#include "core/pool/resources/VideoBuffer.ts"
#include "core/pool/resources/Texture.ts"
#include "core/pool/resources/ShaderProgram.ts"
#include "core/pool/resources/Component.ts"
#include "core/pool/resources/Effect.ts"
#include "core/pool/resources/SurfaceMaterial.ts"
#include "core/pool/resources/Img.ts"
#include "core/pool/resources/RenderMethod.ts"
#include "core/pool/resources/Model.ts"

#include "IBuffer.ts"
#include "IFrameBuffer.ts"

#include "ITexture.ts"
#include "IImg.ts"
#include "ISurfaceMaterial.ts"
#include "IShaderProgram.ts"
#include "IGPUBuffer.ts"
#include "IIndexBuffer.ts"
#include "IVertexBuffer.ts"
#include "IRenderMethod.ts"
#include "IVideoBuffer.ts"
#include "IModel.ts"

#include "IScene.ts"
#include "IScene3d.ts"
#include "IScene2d.ts"




#include "ISceneTree.ts"
#include "IRenderState.ts"
#include "IRenderer.ts"
#include "IScene3d.ts"

#include "INode.ts"
#include "ISceneNode.ts"
#include "ISceneObject.ts"
#include "ICamera.ts"

#include "IFont2d.ts"

#include "IDisplay.ts"
#include "IDisplay2d.ts"
#include "IDisplay3d.ts"

#include "IManager.ts"
#include "IResourceManager.ts"
#include "IDisplayManager.ts"
#include "IParticleManager.ts"

#include "IAFXEffect.ts"
#include "IAFXComponent.ts"
#include "IAFXComponentBlend.ts"
#include "IAFXPassBlend.ts"
#include "IAFXPreRenderState.ts"

#include "IScreen.ts"
*/


///<reference path="../akra.ts" />

module akra.scene {
	export class Node implements INode {
		private sName: string = null;

		get name(): string { return this.sName; }
		set name(sName: string) { this.sName = sName; }

		constructor () {

		}
	}
}

///<reference path="../akra.ts" />

module akra.scene {
	export class SceneNode extends Node implements ISceneNode {
		private pEngine: IEngine = null;

		constructor (pEngine: IEngine) {
			super();

			this.pEngine = pEngine;
		}
	}
}

///<reference path="../akra.ts" />

module akra.scene {
	export class SceneObject extends SceneNode implements ISceneObject {
		constructor (pEngine: IEngine) {
			super(pEngine);
		}
	}
}

///<reference path="../../akra.ts" />

module akra.scene.objects {
	export class Camera extends SceneObject implements ICamera {
		constructor (pEngine: IEngine) {
			super(pEngine);
		}
	}
}

///<reference path="../akra.ts" />

module akra.scene {
	export class OcTree implements ISceneTree {

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

//#include "IBuildScenario.ts"
//#include "ISceneBuilder.ts"









interface IAFXComponent {} ;
interface IAFXEffect {} ;
interface IRenderableObject {} ;
interface IRenderSnapshot {} ;
interface ISceneObject {} ;
interface IBufferMap {} ;
interface IShaderProgram {} ;
interface ISurfaceMaterial {} ;
interface IVertexData {} ;
interface IVertexBuffer {} ;
interface ITexture {} ;
interface IIndexBuffer {} ;
interface IRenderResource {} ;
interface IRenderEntry {} ;
interface IFrameBuffer {} ;
interface IViewport {} ;


module akra {

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

interface IEngine {} ;
interface IResourceWatcherFunc {} ;
interface IResourceNotifyRoutineFunc {} ;
interface IResourceCode {} ;
interface IResourcePool {} ;

module akra {

/**
     * Отражает состояние ресурса
     **/

    export enum EResourceItemEvents{
//ресур создан		k_Created,
//ресур заполнен данным и готов к использованию		k_Loaded,
//ресур в данный момент отключен для использования		k_Disabled,
//ресур был изменен после загрузки		k_Altered,
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


		getGuid(): int;
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
		new (pEngine: IEngine): IResourcePoolItem;
	}
}



module akra {
	export interface IAFXComponent extends IResourcePoolItem {

	}
}









module akra {
	export interface IAFXEffect extends IResourcePoolItem {

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



///<reference path="akra.ts" />

module akra {
    export interface ISceneObject extends ISceneNode {

    }
}




module akra {
	export interface IBufferMap {

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






module akra {
    export interface ISurfaceMaterial {

    }

}







module akra {
	export interface IVertexData extends IBufferData {

	}
}







///<reference path="akra.ts" />

module akra {
	export interface IVertexBufferBase extends IGPUBuffer {
		getVertexData(iOffset: uint, iCount: uint, pElements: IVertexElement[]): IVertexData;
		getVertexData(iOffset: uint, iCount: uint, pDecl: IVertexDeclaration): IVertexData;

		getEmptyVertexData(iCount: uint, pElements: IVertexElement[], ppVertexDataIn?: IVertexData): IVertexData;
		getEmptyVertexData(iCount: uint, pDecl: IVertexDeclaration, ppVertexDataIn?: IVertexData): IVertexData;

		freeVertexData(pVertexData: IVertexData): bool;

		allocateData(pElements: IVertexElement[], pData: ArrayBufferView): IVertexData;
		allocateData(pDecl: IVertexDeclaration, pData: ArrayBufferView): IVertexData;
	}
}







module akra {
    export interface IRenderResource extends IResourcePoolItem {
        getHardwareObject(): WebGLObject;
    };
}




module akra {
	export interface IVertexBuffer extends IVertexBufferBase, IRenderResource {


	}
}









interface IImg {} ;


module akra {
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

        uploadCubeFace(pImage: IImg, eFace: ETextureTypes, isCopyAll?: bool);
        uploadHTMLElement(pElement: HTMLElement);
        uploadImage(pImage: IImg);

        resize(iWidth: uint, iHeight: uint): bool;
        repack(iWidth: uint, iHeight: uint, eFormat?: EImageFormats, eType?: EImageTypes): bool;
        extend(iWidth: uint, iHeight: uint, cColor: IColor);

        createTexture(
            iWidth?: uint,
            iHeight?: uint,
            iFlags?: int,
            eFormat?: EImageFormats,
            eType?: EImageTypes,
            pData?: ArrayBufferView);

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







///<reference path="akra.ts" />

module akra {
	export enum EGPUBufferFlags {
		MANY_UPDATES = 0,
		MANY_DRAWS,
		READABLE,
		RAM_BACKUP,
		SOFTWARE
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

		getData(iOffset: uint, iSize: uint): ArrayBuffer;
		setData(pData: ArrayBuffer, iOffset: uint, iSize: uint): bool;

		getHardwareBuffer(): WebGLObject;
		getFlags(): int;
	}
}



module akra {
	export interface IIndexBuffer extends IGPUBuffer, IRenderResource {

		getIndexData(iOffset: uint, iCount: uint, ePrimitiveType: EPrimitiveTypes, eElementsType: EDataTypes): IIndexData;
		getEmptyIndexData(iCount: uint, ePrimitiveType: EPrimitiveTypes, eElementsType: EDataTypes): IIndexData;

		freeIndexData(pIndexData: IIndexData): bool;


		allocateData(ePrimitiveType: EPrimitiveTypes, eElementsType: EDataTypes, pData: ArrayBufferView): IIndexData;
		getCountIndexForStripGrid(iXVerts: int, iYVerts: int): int;

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
	export var ShaderPrefixes: StringMap = {
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

	export var SystemSemantics: StringMap = {
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



///<reference path="../akra.ts" />

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


//#include "IEngine.ts"









interface IDisplayManager {} ;
interface IParticleManager {} ;
interface IResourcePoolManager {} ;
interface IRenderer {} ;

module akra {
    export interface IEngine {
        getDisplayManager(): IDisplayManager;
        getParticleManager(): IParticleManager;
        getResourceManager(): IResourcePoolManager;

        getDefaultRenderer(): IRenderer;

//start execution
        exec(): bool;
    };

}









module akra {
    export interface IManager {
        initialize(): bool;
        destroy(): void;
    }
}

interface IEngine {} ;
interface IDisplay {} ;
interface IDisplay2d {} ;
interface IDisplay3d {} ;

module akra {
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
    export interface IParticleManager {

    }
}






interface IResourceCode {} ;
interface IResourcePool {} ;
interface IResourceWatcherFunc {} ;
interface IResourcePoolItem {} ;

module akra {

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
	export function createEngine() {
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
	export interface IDisplay2d extends IDisplay {

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






interface IBuildScenario {} ;

module akra {
	export interface ISceneBuilder {
		build(pScenario: IBuildScenario): bool;
	}
}





///<reference path="akra.ts" />

module akra {
	export interface IScreen extends IMesh {

	}
}

///<reference path="akra.ts" />

module akra {
	export enum EUtilTimerCommands {
//! <to reset the timer		TIMER_RESET,
//! <to start the timer		TIMER_START,
//! <to stop (or pause) the timer		TIMER_STOP,
//! <to advance the timer by 0.1 seconds		TIMER_ADVANCE,
//! <to get the absolute system time		TIMER_GET_ABSOLUTE_TIME,
//! <to get the current time		TIMER_GET_APP_TIME,
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




module akra {
	export interface IBuildScenario {

	}
}







module akra {
	export interface ICanvasInfo {
		width: int;
		height: int;
		id: string;
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
				if (DEBUG) {
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





var engine = akra.createEngine();
var dmgr = engine.getDisplayManager();
var view = dmgr.createDisplay3D();
var scene = view.getScene();
