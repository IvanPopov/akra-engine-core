







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

    export function genArray(pType: any, nSize:  number ) {
        var tmp = new Array(nSize);

        for (var i:  number  = 0; i < nSize; ++i) {
            tmp[i] = (pType? new pType: null);
        }

        return tmp;
    }


    export var INVALID_INDEX:  number  =  0xffff;

// (-2147483646);
    export var MIN_INT32:  number  = 0xffffffff;
// ( 2147483647);
    export var MAX_INT32:  number  = 0x7fffffff;
// (-32768);
    export var MIN_INT16:  number  = 0xffff;
// ( 32767);  
    export var MAX_INT16:  number  = 0x7fff;
// (-128);
    export var MIN_INT8:  number  = 0xff;
// ( 127);        
    export var MAX_INT8:  number  = 0x7f;
    export var MIN_UINT32:  number  = 0;
    export var MAX_UINT32:  number  = 0xffffffff;
    export var MIN_UINT16:  number  = 0;
    export var MAX_UINT16:  number  = 0xffff;
    export var MIN_UINT8:  number  = 0;
    export var MAX_UINT8:  number  = 0xff;


    export var SIZE_FLOAT64:  number  = 8;
    export var SIZE_REAL64:  number  = 8;
    export var SIZE_FLOAT32:  number  = 4;
    export var SIZE_REAL32:  number  = 4;
    export var SIZE_INT32:  number  = 4;
    export var SIZE_UINT32:  number  = 4;
    export var SIZE_INT16:  number  = 2;
    export var SIZE_UINT16:  number  = 2;
    export var SIZE_INT8:  number  = 1;
    export var SIZE_UINT8:  number  = 1;
    export var SIZE_BYTE:  number  = 1;
    export var SIZE_UBYTE:  number  = 1;

//1.7976931348623157e+308
    export var MAX_FLOAT64:  number  = Number.MAX_VALUE;
//-1.7976931348623157e+308
    export var MIN_FLOAT64:  number  = -Number.MAX_VALUE;
//5e-324
    export var TINY_FLOAT64:  number  = Number.MIN_VALUE;

//    export var MAX_REAL64: number = Number.MAX_VALUE;   //1.7976931348623157e+308
//    export var MIN_REAL64: number = -Number.MAX_VALUE;  //-1.7976931348623157e+308
//    export var TINY_REAL64: number = Number.MIN_VALUE;  //5e-324


//3.4e38
    export var MAX_FLOAT32:  number  = 3.4e38;
//-3.4e38
    export var MIN_FLOAT32:  number  = -3.4e38;
//1.5e-45  
    export var TINY_FLOAT32:  number  = 1.5e-45;

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
        [index: string]:  number ;
    };

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


    export var sid = ():  number  => (++ sid._iTotal);
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
}


// #include "math/math.ts"
// /*
// #include "IRect3d.ts"
// #include "IRect3d.ts"
// #include "IRect3d.ts"
// #include "IRect3d.ts"
// */
// #include "geometry/geometry.ts"
// /*
// #include "IWorldExtents.ts"
// #include "IViewport.ts"

// #include "IURI.ts"

// #include "IKeyMap.ts"
// #include "IGamepadMap.ts"

// #include "IColor.ts"

// #include "IReferenceCounter.ts"
// #include "IScreenInfo.ts"
// #include "ICanvasInfo.ts"
// #include "IBrowserInfo.ts"
// #include "IApiInfo.ts"
// #include "IDeviceInfo.ts"
// #include "IUtilTimer.ts"
// */
// #include "info/support/support.ts"
// #include "info/info.ts"
// /*
// #include "IFont2d.ts"
// #include "IString2d.ts"
// */
// #include "util/util.ts"
// #include "util/ReferenceCounter.ts"
// #include "util/Singleton.ts"
// #include "util/URI.ts"
// #include "util/BrowserInfo.ts"
// #include "util/ApiInfo.ts"
// #include "util/ScreenInfo.ts"
// #include "util/DeviceInfo.ts"
// #include "util/UtilTimer.ts"

// #include "controls/KeyMap.ts"
// #include "controls/GamepadMap.ts"

// #include "gui/Font2d.ts"
// #include "gui/String2d.ts"
// /*
// #include "IVertexElement.ts"
// #include "IvertexDeclaration.ts"
// */
// #include "util/VertexElement.ts"
// #include "util/VertexDeclaration.ts"
// /*
// #include "IBufferData.ts"
// #include "IVertexData.ts"
// #include "IIndexData.ts"
// #include "IBufferMap.ts"

// #include "IMesh.ts"

// #include "IResourceWatcherFunc.ts"
// #include "IResourceNotifyRoutineFunc.ts"
// #include "IResourceCode.ts"
// #include "IDataPool.ts"
// #include "IResourcePool.ts"
// #include "IResourcePoolItem.ts"
// #include "IResourcePoolManager.ts"

// #include "IRenderEntry.ts"
// #include "IRenderResource.ts"
// #include "IRenderableObject.ts"
// #include "IRenderSnapshot.ts"
// */

// #include "core/pool/ResourceCode.ts"
// #include "core/pool/DataPool.ts"
// #include "core/pool/ResourcePool.ts"
// #include "core/pool/ResourcePoolItem.ts"
// #include "core/pool/ResourcePoolManager.ts"


// #include "core/pool/resources/IndexBuffer.ts"
// #include "core/pool/resources/VertexBufferVBO.ts"
// #include "core/pool/resources/VertexBufferTBO.ts"
// #include "core/pool/resources/Texture.ts"
// #include "core/pool/resources/ShaderProgram.ts"
// #include "core/pool/resources/Component.ts"
// #include "core/pool/resources/Effect.ts"
// #include "core/pool/resources/SurfaceMaterial.ts"
// #include "core/pool/resources/Img.ts"
// #include "core/pool/resources/RenderMethod.ts"
// #include "core/pool/resources/Model.ts"
// /*
// #include "IBuffer.ts"
// #include "IFrameBuffer.ts"

// #include "ITexture.ts"
// #include "IImg.ts"
// #include "ISurfaceMaterial.ts"
// #include "IShaderProgram.ts"
// #include "IGPUBuffer.ts"
// #include "IIndexBuffer.ts"
// #include "IVertexBuffer.ts"
// #include "IRenderMethod.ts"
// #include "IVideoBuffer.ts"
// #include "IModel.ts"

// #include "IScene.ts"
// #include "IScene3d.ts"
// #include "IScene2d.ts"




// #include "ISceneTree.ts"
// #include "IRenderState.ts"
// #include "IRenderer.ts"
// #include "IScene3d.ts"

// #include "INode.ts"
// #include "ISceneNode.ts"
// #include "ISceneObject.ts"
// #include "ICamera.ts"

// #include "IFont2d.ts"

// #include "IDisplay.ts"
// #include "IDisplay2d.ts"
// #include "IDisplay3d.ts"

// #include "IManager.ts"
// #include "IResourceManager.ts"
// #include "IDisplayManager.ts"
// #include "IParticleManager.ts"

// #include "IAFXEffect.ts"
// #include "IAFXComponent.ts"
// #include "IAFXComponentBlend.ts"
// #include "IAFXPassBlend.ts"
// #include "IAFXPreRenderState.ts"

// #include "IScreen.ts"
// */
// #include "scene/Node.ts"
// #include "scene/SceneNode.ts"
// #include "scene/SceneObject.ts"
// #include "scene/objects/Camera.ts"
// #include "scene/OcTree.ts"
// #include "scene/Scene3d.ts"

// //#include "IBuildScenario.ts"
// //#include "ISceneBuilder.ts"

// #include "render/Renderer.ts"
// #include "scene/SceneBuilder.ts"


// //#include "IEngine.ts"

// #include "core/Engine.ts"
// #include "core/DisplayManager.ts"

// #include "display/Display2d.ts"
// #include "display/Display3d.ts"











module akra.util {











    export enum ENodeCreateMode {
        k_Default,
        k_Necessary,
        k_Not
    }

    export enum EParserCode {
        k_Pause,
        k_Ok,
        k_Error
    }

    export enum EParserType {
        k_LR0,
        k_LR1,
        k_LALR
    }

    export enum EParseMode {
        k_AllNode = 0x0001,
        k_Negate = 0x0002,
        k_Add = 0x0004,
        k_Optimize = 0x0008
    };


    export interface IRule {
        left: string;
        right: string[];
        index:  number ;
    }

    export interface IFinishFunc {
        (eCode: EParserCode): void;
    }

    export interface IParseNode {
        children: IParseNode[];
        parent: IParseNode;
        name: string;
        value: string;

        start?:  number ;
        end?:  number ;
        line?:  number ;
    }

    export interface IParseTree {
        setRoot(): void;

        setOptimizeMode(isOptimize: bool): void;

        addNode(pNode: IParseNode): void;
        reduceByRule(pRule: IRule, eCreate: ENodeCreateMode);

        toString(): string;

        clone(): IParseTree;

        root: IParseNode;
    }

    export interface ILexer {
        addPunctuator(sValue: string, sName?: string): string;
        addKeyword(sValue: string, sName: string): string;

        init(sSource: string): void;

        getNextToken(): IToken;
    }

    export interface IParser {

        isTypeId(sValue: string): bool;

        returnCode(pNode: IParseNode): string;

        init(sGrammar: string, eType?: EParserType, eMode?: EParseMode): bool;

        parse(sSource: string, isSync?: bool, fnFinishCallback?: IFinishFunc, pCaller?: any): EParserCode;

        pause(): EParserCode;
        resume(): EParserCode;
    }
}





module akra.util {

    enum EOperationType {
        k_Error = 100,
        k_Shift,
        k_Reduce,
        k_Success,
        k_Pause,
        k_Ok
    }



    enum ESyntaxErrorCode {
        k_Parser = 100,
        k_GrammarAddOperation,
        k_GrammarAddStateLink,
        k_GrammarUnexpectedSymbol,
        k_GrammarBadAdditionalFunctionName,
        k_GrammarBadKeyword,
        k_SyntaxError,

        k_Lexer = 200,
        k_UnknownToken,
        k_BadToken
    }

    enum ETokenType {
        k_NumericLiteral = 1,
        k_CommentLiteral,
        k_StringLiteral,
        k_PunctuatorLiteral,
        k_WhitespaceLiteral,
        k_IdentifierLiteral,
        k_KeywordLiteral,
        k_Unknown,
        k_End
    }

//     //    var SyntaxErrorMessages: StringEnum = <StringEnum>{};
//     //    SyntaxErrorMessages[ESyntaxErrorCode.k_UnknownToken] = "Uknown token: \'{Syntax.Lexer.VALUE}\'. In line: {Syntax.Lexer.LINE}. In column {Syntax.Lexer.START_COLUMN}.";

    interface IOperation {
        type: EOperationType;
        rule?: IRule;
        index?:  number ;
    }

    interface IItem {
        isEqual(pItem: IItem, eType?: EParserType): bool;
        isParentItem(pItem: IItem): bool;
        isChildItem(pItem: IItem): bool;

        mark(): string;
        end(): string;
        nextMarked(): string;

        toString(): string;

        isExpected(sSymbol: string): bool;
        addExpected(sSymbol: string): bool;

        rule: IRule;
        position:  number ;
        index:  number ;
        state: IState;
        expectedSymbols: BoolMap;
        isNewExpected: bool;
        length:  number ;
    }

    interface IState {

        hasItem(pItem: IItem, eType: EParserType): IItem;
        hasParentItem(pItem: IItem): IItem;
        hasChildItem(pItem: IItem): IItem;

        isEmpty(): bool;
        isEqual(pState: IState, eType: EParserType): bool;

        push(pItem: IItem): void;

        tryPush_LR0(pRule: IRule, iPos:  number ): bool;
        tryPush_LR(pRule: IRule, iPos:  number , sExpectedSymbol: string): bool;

        deleteNotBase(): void;

        getNextStateBySymbol(sSymbol: string): IState;
        addNextState(sSymbol: string, pState: IState): bool;

        toString(isBase: bool): string;

        items: IItem[];
        numBaseItems:  number ;
        index:  number ;
        nextStates: IStateMap;
    }

    interface IToken {
        value: string;
        start:  number ;
        end:  number ;
        line:  number ;

        name?: string;
        type?: ETokenType;
    }

    interface IStateMap {
        [index: string]: IState;
    }


    class Item implements IItem {
        private _pRule: IRule;
        private _iPos:  number ;
        private _iIndex:  number ;
        private _pState: IState;

        private _pExpected: BoolMap;
        private _isNewExpected: bool;
        private _iLength:  number ;

/** @inline */

        get rule(): IRule {
            return this._pRule;
        }
/** @inline */

        set rule(pRule: IRule) {
            this._pRule = pRule;
        }
/** @inline */

        get position():  number  {
            return this._iPos;
        }
/** @inline */

        set position(iPos:  number ) {
            this._iPos = iPos;
        }
/** @inline */

        get state(): IState {
            return this._pState;
        }
/** @inline */

        set state(pState: IState) {
            this._pState = pState;
        }
/** @inline */

        get index():  number  {
            return this._iIndex;
        }
/** @inline */

        set index(iIndex:  number ) {
            this._iIndex = iIndex;
        }

/** @inline */

        get expectedSymbols(): BoolMap {
            return this._pExpected;
        }
/** @inline */

        get length():  number  {
            return this._iLength;
        }
/** @inline */

        get isNewExpected(): bool {
            return this._isNewExpected;
        }
/** @inline */

        set isNewExpected(_isNewExpected: bool) {
            this._isNewExpected = _isNewExpected;
        }

        constructor (pRule: IRule, iPos:  number , pExpected?: BoolMap) {
            this._pRule = pRule;
            this._iPos = iPos;
            this._iIndex = 0;
            this._pState = null;

            this._isNewExpected = true;
            this._iLength = 0;
            this._pExpected = <BoolMap>{};

            if (arguments.length === 3) {
                var i: string;
                for (i in <BoolMap>arguments[2]) {
                    this.addExpected(i);
                }
            }
        }

        isEqual(pItem: IItem, eType?: EParserType = EParserType.k_LR0): bool {
            if (eType === EParserType.k_LR0) {
                return (this._pRule === pItem.rule && this._iPos === pItem.position);
            }
            else if (eType === EParserType.k_LR1) {
                if (!(this._pRule === pItem.rule && this._iPos === pItem.position && this._iLength === (<IItem>pItem).length)) {
                    return false;
                }
                var i: string;
                for (i in this._pExpected) {
                    if (!(<IItem>pItem).isExpected(i)) {
                        return false;
                    }
                }
                return true;
            }
        }

        isParentItem(pItem: IItem): bool {
            return (this._pRule === pItem.rule && this._iPos === pItem.position + 1);
        }

        isChildItem(pItem: IItem): bool {
            return (this._pRule === pItem.rule && this._iPos === pItem.position - 1);
        }

        mark(): string {
            var pRight: string[] = this._pRule.right;
            if (this._iPos === pRight.length) {
                return  "END" ;
            }
            return pRight[this._iPos];
        }

        end(): string {
            var pRight = this._pRule.right;
            return pRight[pRight.length - 1] ||  "EMPTY" ;
        }

        nextMarked(): string {
            return this._pRule.right[this._iPos + 1] ||  "END" ;
        }

        isExpected(sSymbol: string): bool {
            return !!(this._pExpected[sSymbol]);
        }

        addExpected(sSymbol: string): bool {
            if (this._pExpected[sSymbol]) {
                return false;
            }
            this._pExpected[sSymbol] = true;
            this._isNewExpected = true;
            this._iLength++;
            return true;
        }

        toString(): string {
            var sMsg: string = this._pRule.left + " -> ";
            var sExpected: string = "";
            var pRight: string[] = this._pRule.right;

            for (var k = 0; k < pRight.length; k++) {
                if (k === this._iPos) {
                    sMsg += ". ";
                }
                sMsg += pRight[k] + " ";
            }

            if (this._iPos === pRight.length) {
                sMsg += ". ";
            }

            if (isDef(this._pExpected)) {
                sExpected = ", ";
                for (var l in this._pExpected) {
                    sExpected += l + "/";
                }
                if (sExpected !== ", ") {
                    sMsg += sExpected;
                }
            }

            sMsg = sMsg.slice(0, sMsg.length - 1);
            return sMsg;
        }
    }

    class State implements IState {
        private _pItemList: IItem[];
        private _pNextStates: IStateMap;
        private _iIndex:  number ;
        private _nBaseItems:  number ;

/** @inline */

        get items(): IItem[] {
            return this._pItemList;
        }
/** @inline */

        get numBaseItems():  number  {
            return this._nBaseItems;
        }
/** @inline */

        get index():  number  {
            return this._iIndex;
        }
/** @inline */

        set index(iIndex:  number ) {
            this._iIndex = iIndex;
        }
/** @inline */

        get nextStates(): IStateMap {
            return this._pNextStates;
        }

        constructor () {
            this._pItemList = <IItem[]>[];
            this._pNextStates = <IStateMap>{};
            this._iIndex = 0;
            this._nBaseItems = 0;
        }

        hasItem(pItem: IItem, eType: EParserType): IItem {
            var i;
            var pItems: IItem[] = this._pItemList;
            for (i = 0; i < pItems.length; i++) {
                if (pItems[i].isEqual(pItem, eType)) {
                    return pItems[i];
                }
            }
            return null;
        }

        hasParentItem(pItem: IItem): IItem {
            var i;
            var pItems = this._pItemList;
            for (i = 0; i < pItems.length; i++) {
                if (pItems[i].isParentItem(pItem)) {
                    return pItems[i];
                }
            }
            return null;
        }

        hasChildItem(pItem: IItem): IItem {
            var i;
            var pItems = this._pItemList;
            for (i = 0; i < pItems.length; i++) {
                if (pItems[i].isChildItem(pItem)) {
                    return pItems[i];
                }
            }
            return null;
        }

        isEmpty(): bool {
            return !(this._pItemList.length);
        }

        isEqual(pState: IState, eType: EParserType): bool {

            var pItemsA: IItem[] = this._pItemList;
            var pItemsB: IItem[] = pState.items;

            if (this._nBaseItems !== pState.numBaseItems) {
                return false;
            }
            var nItems = this._nBaseItems;
            var i, j;
            var isEqual;
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
        }

        push(pItem: IItem): void {
            if (this._pItemList.length === 0 || pItem.position > 0) {
                this._nBaseItems += 1;
            }
            pItem.state = this;
            this._pItemList.push(pItem);
        }

        tryPush_LR0(pRule: IRule, iPos:  number ): bool {
            var i:  number ;
            var pItems: IItem[] = this._pItemList;
            for (i = 0; i < pItems.length; i++) {
                if (pItems[i].rule === pRule && pItems[i].position === iPos) {
                    return false;
                }
            }
            var pItem: IItem = new Item(pRule, iPos);
            this.push(pItem);
            return true;
        }

        tryPush_LR(pRule: IRule, iPos:  number , sExpectedSymbol: string): bool {
            var i:  number ;
            var pItems: IItem[] = <IItem[]>(this._pItemList);

            for (i = 0; i < pItems.length; i++) {
                if (pItems[i].rule === pRule && pItems[i].position === iPos) {
                    return pItems[i].addExpected(sExpectedSymbol);
                }
            }

            var pExpected: BoolMap = <BoolMap>{};
            pExpected[sExpectedSymbol] = true;

            var pItem: IItem = new Item(pRule, iPos, pExpected);
            this.push(pItem);
            return true;
        }

        getNextStateBySymbol(sSymbol: string): IState {
            if (isDef(this._pNextStates[sSymbol])) {
                return this._pNextStates[sSymbol];
            }
            else {
                return null;
            }
        }

        addNextState(sSymbol: string, pState: IState) {
            if (isDef(this._pNextStates[sSymbol])) {
                return false;
            }
            else {
                this._pNextStates[sSymbol] = pState;
                return true;
            }
        }

        deleteNotBase(): void {
            this._pItemList.length = this._nBaseItems;
        }

        toString(isBase: bool): string {
            var len:  number  = 0;
            var sMsg: string;
            var pItemList: IItem[] = this._pItemList;

            sMsg = "State " + this._iIndex + ":\n";
            len = isBase ? this._nBaseItems : pItemList.length;

            for (var j = 0; j < len; j++) {
                sMsg += "\t\t";
                sMsg += pItemList[j].toString();
                sMsg += "\n";
            }

            return sMsg;
        }
    }

    export class ParseTree implements IParseTree {
        private _pRoot: IParseNode;
        private _pNodes: IParseNode[];
        private _pNodesCountStack:  number [];
        private _isOptimizeMode: bool;

/** @inline */

        get root(): IParseNode {
            return this._pRoot;
        }
/** @inline */

        set root(pRoot: IParseNode) {
            this._pRoot = pRoot;
        }

        constructor () {
            this._pRoot = null;
            this._pNodes = <IParseNode[]>[];
            this._pNodesCountStack = < number []>[];
            this._isOptimizeMode = false;
        }

        setRoot(): void {
            this._pRoot = this._pNodes.pop();
        }

        setOptimizeMode(isOptimize: bool): void {
            this._isOptimizeMode = isOptimize;
        }

        addNode(pNode: IParseNode): void {
            this._pNodes.push(pNode);
            this._pNodesCountStack.push(1);
        }

        reduceByRule(pRule: IRule, eCreate: ENodeCreateMode = ENodeCreateMode.k_Default): void {
            var iReduceCount:  number  = 0;
            var pNodesCountStack:  number [] = this._pNodesCountStack;
            var pNode: IParseNode;
            var iRuleLength:  number  = pRule.right.length;
            var pNodes: IParseNode[] = this._pNodes;
            var nOptimize:  number  = this._isOptimizeMode ? 1 : 0;

            while (iRuleLength) {
                iReduceCount += pNodesCountStack.pop();
                iRuleLength--;
            }

            if ((eCreate === ENodeCreateMode.k_Default && iReduceCount > nOptimize) || (eCreate === ENodeCreateMode.k_Necessary)) {
                pNode = <IParseNode>{ name: pRule.left, children: null, parent: null, value: "" };

                while (iReduceCount) {
                    this.addLink(pNode, pNodes.pop());
                    iReduceCount -= 1;
                }

                pNodes.push(pNode);
                pNodesCountStack.push(1);
            }
            else {
                pNodesCountStack.push(iReduceCount);
            }
        }

        toString(): string {
            if (this._pRoot) {
                return this.toStringNode(this._pRoot);
            }
            else {
                return "";
            }
        }

        clone(): IParseTree {
            var pTree = new ParseTree();
            pTree.root = this.cloneNode(this._pRoot);
            return pTree;
        }

        private addLink(pParent: IParseNode, pNode: IParseNode): void {
            if (!pParent.children) {
                pParent.children = <IParseNode[]>[];
            }
            pParent.children.push(pParent);
            pNode.parent = pParent;
        }

        private cloneNode(pNode: IParseNode): IParseNode {
            var pNewNode: IParseNode;
            pNewNode = <IParseNode>{
                name: pNode.name,
                value: pNode.value,
                children: null,
                parent: null
            };

            var pChildren: IParseNode[] = pNode.children;
            for (var i = 0; pChildren && i < pChildren.length; i++) {
                this.addLink(pNewNode, this.cloneNode(pChildren[i]));
            }

            return pNewNode;
        }

        private toStringNode(pNode: IParseNode, sPadding: string = ""): string {
            var sRes: string = sPadding + "{\n";
            var sOldPadding: string = sPadding;
            var sDefaultPadding: string = "  ";

            sPadding += sDefaultPadding;

            if (pNode.value) {
                sRes += sPadding + "name : \"" + pNode.name + "\"" + ",\n";
                sRes += sPadding + "value : \"" + pNode.value + "\"" + "\n";
            }
            else {

                sRes += sPadding + "name : \"" + pNode.name + "\"" + "\n";
                sRes += sPadding + "children : [";

                var pChildren: IParseNode[] = pNode.children;

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
                }
                else {
                    sRes += " ]\n";
                }
            }
            sRes += sOldPadding + "}";
            return sRes;
        }
    }

    export class Lexer implements ILexer {
        private _iLineNumber:  number ;
        private _iColumnNumber:  number ;
        private _sSource: string;
        private _iIndex:  number ;
        private _pParser: IParser;
        private _pPunctuatorsMap: StringMap;
        private _pKeywordsMap: StringMap;
        private _pPunctuatorsFirstSymbols: BoolMap;

        constructor (pParser: IParser) {
            this._iLineNumber = 0;
            this._iColumnNumber = 0;
            this._sSource = "";
            this._iIndex = 0;
            this._pParser = pParser;
            this._pPunctuatorsMap = <StringMap>{};
            this._pKeywordsMap = <StringMap>{};
            this._pPunctuatorsFirstSymbols = <BoolMap>{};
        }

        addPunctuator(sValue: string, sName?: string): string {
            if (typeof (sName) === undefined && sValue.length === 1) {
                sName = "T_PUNCTUATOR_" + sValue.charCodeAt(0);

            }
            this._pPunctuatorsMap[sValue] = sName;
            this._pPunctuatorsFirstSymbols[sValue[0]] = true;
            return sName;
        }

        addKeyword(sValue: string, sName: string): string {
            this._pKeywordsMap[sValue] = sName;
            return sName;
        }

        init(sSource: string): void {
            this._sSource = sSource;
            this._iLineNumber = 0;
            this._iColumnNumber = 0;
            this._iIndex = 0;
        }

        getNextToken(): IToken {
            var ch: string = this.currentChar();
            if (!ch) {
                return <IToken>{
                    name:  "$" ,
                    value:  "$" ,
                    start: this._iColumnNumber,
                    end: this._iColumnNumber,
                    line: this._iLineNumber
                };
            }
            var eType: ETokenType = this.identityTokenType();
            var pToken: IToken;
            switch (eType) {
                case ETokenType.k_NumericLiteral:
                    pToken = this.scanNumber();
                    break;
                case ETokenType.k_CommentLiteral:
                    this.scanComment();
                    pToken = this.getNextToken();
                    break;
                case ETokenType.k_StringLiteral:
                    pToken = this.scanString();
                    break;
                case ETokenType.k_PunctuatorLiteral:
                    pToken = this.scanPunctuator();
                    break;
                case ETokenType.k_IdentifierLiteral:
                    pToken = this.scanIdentifier();
                    break;
                case ETokenType.k_WhitespaceLiteral:
                    this.scanWhiteSpace();
                    pToken = this.getNextToken();
                    break;
                default:
                    this.error(ESyntaxErrorCode.k_UnknownToken,
                                <IToken>{
                                    name:  "UNNOWN" ,
                                    value: ch + this._sSource[this._iIndex + 1],
                                    start: this._iColumnNumber,
                                    end: this._iColumnNumber + 1,
                                    line: this._iLineNumber
                                });
            }
            return pToken;
        }

        private error(eCode: ESyntaxErrorCode, pToken: IToken): void {
            console.log(eCode, pToken);
//ErrorContainer.Syntax.Lexer.
        }

        private identityTokenType(): ETokenType {
            if (this.isIdentifierStart()) {
                return ETokenType.k_IdentifierLiteral;
            }
            if (this.isWhiteSpaceStart()) {
                return ETokenType.k_WhitespaceLiteral;
            }
            if (this.isStringStart()) {
                return ETokenType.k_StringLiteral;
            }
            if (this.isCommentStart()) {
                return ETokenType.k_CommentLiteral;
            }
            if (this.isNumberStart()) {
                return ETokenType.k_NumericLiteral;
            }
            if (this.isPunctuatorStart()) {
                return ETokenType.k_PunctuatorLiteral;
            }
            return ETokenType.k_Unknown;
        }

        private isNumberStart(): bool {
            var ch: string = this.currentChar();

            if ((ch >= '0') && (ch <= '9')) {
                return true;
            }

            var ch1: string = this.nextChar();
            if (ch === "." && (ch1 >= '0') && (ch1 <= '9')) {
                return true;
            }

            return false;
        }

        private isCommentStart(): bool {
            var ch: string = this.currentChar();
            var ch1: string = this.nextChar();

            if (ch === "/" && (ch1 === "/" || ch1 === "*")) {
                return true;
            }

            return false;
        }

        private isStringStart(): bool {
            var ch: string = this.currentChar();
            if (ch === "\"" || ch === "'") {
                return true;
            }
            return false;
        }

        private isPunctuatorStart(): bool {
            var ch: string = this.currentChar();
            if (this._pPunctuatorsFirstSymbols[ch]) {
                return true;
            }
            return false;
        }

        private isWhiteSpaceStart(): bool {
            var ch: string = this.currentChar();
            if (ch === ' ' || ch === '\n' || ch === '\r' || ch === '\t') {
                return true;
            }
            return false;
        }

        private isIdentifierStart(): bool {
            var ch: string = this.currentChar();
            if ((ch === '_') || (ch >= 'a' && ch <= 'z') || (ch >= 'A' && ch <= 'Z')) {
                return true;
            }
            return false;
        }

        private isLineTerminator(sSymbol: string): bool {
            return (sSymbol === '\n' || sSymbol === '\r' || sSymbol === '\u2028' || sSymbol === '\u2029');
        }

        private isWhiteSpace(sSymbol: string): bool {
            return (sSymbol === ' ') || (sSymbol === '\t');
        }

/** @inline */

        private isKeyword(sValue: string): bool {
            return !!(this._pKeywordsMap[sValue]);
        }

/** @inline */

        private isPunctuator(sValue: string): bool {
            return !!(this._pPunctuatorsMap[sValue]);
        }

/** @inline */

        private nextChar(): string {
            return this._sSource[this._iIndex + 1];
        }

/** @inline */

        private currentChar(): string {
            return this._sSource[<number>this._iIndex];
        }

/** @inline */

        private readNextChar(): string {
            this._iIndex++;
            this._iColumnNumber++;
            return this._sSource[<number>this._iIndex];
        }

        private scanString(): IToken {
            var chFirst: string = this.currentChar();
            var sValue: string = chFirst;
            var ch: string;
            var chPrevious: string = chFirst;
            var isGoodFinish: bool = false;
            var iStart:  number  = this._iColumnNumber;

            while (true) {
                ch = this.readNextChar();
                if (!ch) {
                    break;
                }
                sValue += ch;
                if (ch === chFirst && chPrevious !== '\\') {
                    isGoodFinish = true;
                    this.readNextChar();
                    break;
                }
                chPrevious = ch;
            }

            if (isGoodFinish) {
                return <IToken>{
                    name: "T_STRING",
                    value: sValue,
                    start: iStart,
                    end: this._iColumnNumber - 1,
                    line: this._iLineNumber
                };
            }
            else {
                if (!ch) {
                    ch = "EOF";
                }
                sValue += ch;

                this.error(ESyntaxErrorCode.k_BadToken, <IToken> {
                    type: ETokenType.k_StringLiteral,
                    value: sValue,
                    start: iStart,
                    end: this._iColumnNumber,
                    line: this._iLineNumber
                });
                return null;
            }
        }

        private scanPunctuator(): IToken {
            var sValue: string = this.currentChar();
            var ch: string;
            var iStart:  number  = this._iColumnNumber;

            while (true) {
                ch = this.readNextChar();
                if (ch) {
                    sValue += ch;
                    this._iColumnNumber++;
                    if (!this.isPunctuator(sValue)) {
                        sValue = sValue.slice(0, sValue.length - 1);
                        break;
                    }
                }
                else {
                    break;
                }
            }

            return <IToken>{
                name: this._pPunctuatorsMap[sValue],
                value: sValue,
                start: iStart,
                end: this._iColumnNumber - 1,
                line: this._iLineNumber
            };
        }

        private scanNumber(): IToken {
            var ch: string = this.currentChar();
            var sValue: string = "";
            var isFloat: bool = false;
            var chPrevious: string = ch;
            var isGoodFinish: bool = false;
            var iStart:  number  = this._iColumnNumber;
            var isE: bool = false;

            if (ch === '.') {
                sValue += 0;
                isFloat = true;
            }

            sValue += ch;

            while (true) {
                ch = this.readNextChar();
                if (ch === '.') {
                    if (isFloat) {
                        break;
                    }
                    else {
                        isFloat = true;
                    }
                }
                else if (ch === 'e') {
                    if (isE) {
                        break;
                    }
                    else {
                        isE = true;
                    }
                }
                else if (((ch === '+' || ch === '-') && chPrevious === 'e')) {
                    sValue += ch;
                    chPrevious = ch;
                    continue;
                }
                else if (ch === 'f' && isFloat) {
                    ch = this.readNextChar();
                    if ((ch >= 'a' && ch <= 'z') || (ch >= 'A' && ch <= 'Z')) {
                        break;
                    }
                    isGoodFinish = true;
                    break;
                }
                else if ((ch >= 'a' && ch <= 'z') || (ch >= 'A' && ch <= 'Z')) {
                    break;
                }
                else if (!((ch >= '0') && (ch <= '9')) || !ch) {
                    if ((isE && chPrevious !== '+' && chPrevious !== '-' && chPrevious !== 'e') || !isE) {
                        isGoodFinish = true;
                    }
                    break;
                }
                sValue += ch;
                chPrevious = ch;
            }

            if (isGoodFinish) {
                var sName = isFloat ? "T_FLOAT" : "T_UINT";
                return {
                    name: sName,
                    value: sValue,
                    start: iStart,
                    end: this._iColumnNumber - 1,
                    line: this._iLineNumber
                };
            }
            else {
                if (!ch) {
                    ch = "EOF";
                }
                sValue += ch;
                this.error(ESyntaxErrorCode.k_BadToken, <IToken> {
                    type: ETokenType.k_NumericLiteral,
                    value: sValue,
                    start: iStart,
                    end: this._iColumnNumber,
                    line: this._iLineNumber
                });
                return null;
            }
        }

        private scanIdentifier(): IToken {
            var ch: string = this.currentChar();
            var sValue: string = ch;
            var iStart:  number  = this._iColumnNumber;
            var isGoodFinish: bool = false;

            while (1) {
                ch = this.readNextChar();
                if (!ch) {
                    isGoodFinish = true;
                    break;
                }
                if (!((ch === '_') || (ch >= 'a' && ch <= 'z') || (ch >= 'A' && ch <= 'Z') || (ch >= '0' && ch <= '9'))) {
                    isGoodFinish = true;
                    break;
                }
                sValue += ch;
            }

            if (isGoodFinish) {
                if (this.isKeyword(sValue)) {
                    return <IToken>{
                        name: this._pKeywordsMap[sValue],
                        value: sValue,
                        start: iStart,
                        end: this._iColumnNumber - 1,
                        line: this._iLineNumber
                    };
                }
                else {
                    var sName = this._pParser.isTypeId(sValue) ? "T_TYPE_ID" : "T_NON_TYPE_ID";
                    return <IToken> {
                        name: sName,
                        value: sValue,
                        start: iStart,
                        end: this._iColumnNumber - 1,
                        line: this._iLineNumber
                    };
                }
            }
            else {
                if (!ch) {
                    ch = "EOF";
                }
                sValue += ch;
                this.error(ESyntaxErrorCode.k_BadToken, <IToken> {
                    type: ETokenType.k_IdentifierLiteral,
                    value: sValue,
                    start: iStart,
                    end: this._iColumnNumber,
                    line: this._iLineNumber
                });
                return null;
            }
        }

        private scanWhiteSpace(): bool {
            var ch: string = this.currentChar();

            while (true) {
                if (!ch) {
                    break;
                }
                if (this.isLineTerminator(ch)) {
                    this._iLineNumber++;
                    ch = this.readNextChar();
                    this._iColumnNumber = 0;
                    continue;
                }
                else if (ch === '\t') {
                    this._iColumnNumber += 3;
                }
                else if (ch !== ' ') {
                    break;
                }
                ch = this.readNextChar();
            }

            return true;
        }

        private scanComment(): bool {
            var sValue: string = this.currentChar();
            var ch: string = this.readNextChar();
            sValue += ch;

            if (ch === '/') {
//Line Comment
                while (true) {
                    ch = this.readNextChar();
                    if (!ch) {
                        break;
                    }
                    if (this.isLineTerminator(ch)) {
                        this._iLineNumber++;
                        this.readNextChar();
                        this._iColumnNumber = 0;
                        break;
                    }
                    sValue += ch;
                }

                return true;
            }
            else {
//Multiline Comment
                var chPrevious: string = ch;
                var isGoodFinish: bool = false;
                var iStart:  number  = this._iColumnNumber;

                while (true) {
                    ch = this.readNextChar();
                    if (!ch) {
                        break;
                    }
                    sValue += ch;
                    if (ch === '/' && chPrevious === '*') {
                        isGoodFinish = true;
                        this.readNextChar();
                        break;
                    }
                    if (this.isLineTerminator(ch)) {
                        this._iLineNumber++;
                        this._iColumnNumber = -1;
                    }
                    chPrevious = ch;
                }

                if (isGoodFinish) {
                    return true;
                }
                else {
                    if (!ch) {
                        ch = "EOF";
                    }
                    sValue += ch;
                    this.error(ESyntaxErrorCode.k_BadToken, <IToken> {
                        type: ETokenType.k_CommentLiteral,
                        value: sValue,
                        start: iStart,
                        end: this._iColumnNumber,
                        line: this._iLineNumber
                    });

                }

            }
        }
    }


    interface IOperationMap {
        [k: string]: IOperation;
        [k: number]: IOperation;
    }

    interface IOperationDMap {
        [k: number]: IOperationMap;
    }

    interface IRuleMap {
        [k: number]: IRule;
        [k: string]: IRule;
    }

    interface IRuleDMap {
        [k: number]: IRuleMap;
        [k: string]: IRuleMap;
    }

    interface IRuleFunction {
        (pRule: IRule): EOperationType;
    }

    interface IRuleFunctionMap {
        [k: number]: IRuleFunction;
        [k: string]: IRuleFunction;
    }

    export class Parser implements IParser{
// //Input

        private _sSource: string;
        private _iIndex:  number ;

//Output

        private _pSyntaxTree: IParseTree;
        private _pTypeIdMap: BoolMap;

//Process params

        private _pLexer: ILexer;
        private _pStack:  number [];
        private _pToken: IToken;

//For async loading of files work fine

        private _fnFinishCallback: IFinishFunc;
        private _pCaller: any;

//Grammar Info

        private _pSymbols: BoolMap;
        private _pSyntaxTable: IOperationDMap;
        private _pReduceOperationsMap: IOperationMap;
        private _pShiftOperationsMap: IOperationMap;
        private _pSuccessOperation: IOperation;

        private _pFirstTerminalsDMap: BoolDMap;
        private _pFollowTerminalsDMap: BoolDMap;

        private _pRulesDMap: IRuleDMap;
        private _pStateList: IState[];
        private _nRules:  number ;

        private _pRuleFunctionNamesMap: StringMap;
        private _pAdditionalFunctionsMap: IRuleFunctionMap;

        private _eType: EParserType;

//Additioanal info

        private _pSymbolsWithNodesMap: IntMap;
        private _eParseMode: EParseMode;

        private _isSync: bool;

//Temp

        private _pStatesTempMap: IStateMap;
        private _pBaseItemList: IItem[];
        private _pExpectedExtensionDMap: BoolDMap;


        constructor () {
            this._sSource = "";
            this._iIndex = 0;

            this._pSyntaxTree = null;
            this._pTypeIdMap = null;

            this._pLexer = null;
            this._pStack = < number []>[];
            this._pToken = null;

            this._fnFinishCallback = null;
            this._pCaller = null;

            this._pSymbols = <BoolMap>{};
            this._pSymbols[ "$" ] = true;
            this._pSyntaxTable = null;
            this._pReduceOperationsMap = null;
            this._pShiftOperationsMap = null;
            this._pSuccessOperation = null;

            this._pFirstTerminalsDMap = null;
            this._pFollowTerminalsDMap = null;
            this._pRulesDMap = null;
            this._pStateList = null;
            this._nRules = 0;
            this._pRuleFunctionNamesMap = null;
            this._pAdditionalFunctionsMap = null;

            this._eType = EParserType.k_LR0;

            this._pSymbolsWithNodesMap = null;
            this._eParseMode = EParseMode.k_AllNode;

            this._isSync = false;

            this._pStatesTempMap = null;
            this._pBaseItemList = null;
            this._pExpectedExtensionDMap = null;

        }

        isTypeId(sValue: string): bool {
            return !!(this._pTypeIdMap[sValue]);
        }

        returnCode(pNode: IParseNode): string {
            if (pNode) {
                if (pNode.value) {
                    return pNode.value + " ";
                }
                else if (pNode.children) {
                    var sCode: string = "";
                    var i:  number  = 0;
                    for (i = pNode.children.length - 1; i >= 0; i--) {
                        sCode += this.returnCode(pNode.children[i]);
                    }
                    return sCode;
                }
            }
            return "";
        }

        init(sGrammar: string, eType?: EParserType = EParserType.k_LALR, eMode?: EParseMode = EParseMode.k_AllNode): bool {
            try {
                this._eType = eType;
                this._pLexer = new Lexer(this);
                this._eParseMode = eMode;
                this.generateRules(sGrammar);
                this.buildSyntaxTable();
                this.clearMem();
                return true;
            }
            catch (e) {
                return false;
            }
        }

        parse(sSource: string, isSync?: bool = true, fnFinishCallback?: IFinishFunc = null, pCaller?: any = null): EParserCode {
             try {
                this.defaultInit();
                this._sSource = sSource;
                this._pLexer.init(sSource);

                this._isSync = isSync;

                this._fnFinishCallback = fnFinishCallback;
                this._pCaller = pCaller;

                var pTree:IParseTree = this._pSyntaxTree;
                var pStack: number [] = this._pStack;
                var pSyntaxTable:IOperationDMap = this._pSyntaxTable;

                var isStop:bool = false;
                var isError:bool = false;
                var isPause:bool = false;
                var pToken:IToken = this.readToken();

                var pOperation:IOperation;
                var iRuleLength: number ;

                while (!isStop) {
                    pOperation = pSyntaxTable[pStack[pStack.length - 1]][pToken.name];
                    if (isDef(pOperation)) {
                        switch (pOperation.type) {
                            case EOperationType.k_Success:
                                isStop = true;
                                break;

                            case EOperationType.k_Shift:
                                pStack.push(pOperation.index);
                                pTree.addNode(<IParseNode>pToken);
                                pToken = this.readToken();
                                break;

                            case EOperationType.k_Reduce:
                                iRuleLength = pOperation.rule.right.length;
                                pStack.length -= iRuleLength;
                                pStack.push(pSyntaxTable[pStack[pStack.length - 1]][pOperation.rule.left].index);

                                if (this.ruleAction(pOperation.rule) === EOperationType.k_Pause) {
                                    this._pToken = pToken;
                                    isStop = true;
                                    isPause = true;
                                }
                                break;
                        }
                    }
                    else {
                        isError = true;
                        isStop = true;
                    }
                }
                if (isPause) {
                    return EParserCode.k_Pause;
                }

                if (!isError) {
                    pTree.setRoot();
                    if (isDef(this._fnFinishCallback)) {
                        this._fnFinishCallback.call(this._pCaller, EParserCode.k_Ok);
                    }
                    return EParserCode.k_Ok;
                }
                else {
                    this.error(ESyntaxErrorCode.k_SyntaxError);
                    if (isDef(this._fnFinishCallback)) {
                        this._fnFinishCallback.call(this._pCaller, EParserCode.k_Error);
                    }
                    return EParserCode.k_Error;
                }

            }
            catch (e) {
                 return EParserCode.k_Error;
            }
        }

        pause(): EParserCode {
            return EParserCode.k_Pause;
        }

        resume(): EParserCode {
            return this.resumeParse();
        }


        private error(eCode: ESyntaxErrorCode): void {
            console.log(this.printStates(true));
            console.log((new Error).stack);
            console.log(eCode);
        }

        private clearMem(): void {
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
        }

        private hasState(pState: IState, eType: EParserType) {
            var pStateList: IState[] = this._pStateList;
            var i:  number  = 0;

            for (i = 0; i < pStateList.length; i++) {
                if (pStateList[i].isEqual(pState, eType)) {
                    return pStateList[i];
                }
            }

            return null;
        }

        private isTerminal(sSymbol: string): bool {
            return !!(this._pRulesDMap[sSymbol]);
        }

        private pushState(pState: IState): void {
            pState.index = this._pStateList.length;
            this._pStateList.push(pState);
        }

        private pushBaseItem(pItem: IItem): void {
            pItem.index = this._pBaseItemList.length;
            this._pBaseItemList.push(pItem);
        }

        private tryAddState(pState: IState, eType: EParserType): IState {
            var pRes = this.hasState(pState, eType);

            if (isNull(pRes)) {
                if (eType === EParserType.k_LR0) {
                    var pItems = pState.items;
                    for (var i = 0; i < pItems.length; i++) {
                        this.pushBaseItem(pItems[i]);
                    }
                }

                this.pushState(pState);
                this.closure(pState, eType);

                return pState;
            }

            return pRes;
        }

        private hasEmptyRule(sSymbol: string): bool {
            if (this.isTerminal(sSymbol)) {
                return false;
            }

            var pRulesDMap: IRuleDMap = this._pRulesDMap;
            for (var i in pRulesDMap) {
                if (pRulesDMap[sSymbol][i].right.length === 0) {
                    return true;
                }
            }

            return false;
        }

        private pushInSyntaxTable(iIndex:  number , sSymbol: string, pOperation: IOperation): void {
            var pSyntaxTable: IOperationDMap = this._pSyntaxTable;
            if (!pSyntaxTable[iIndex]) {
                pSyntaxTable[iIndex] = <IOperationMap>{};
            }
            if (isDef(pSyntaxTable[iIndex][sSymbol])) {
                this.error(ESyntaxErrorCode.k_GrammarAddOperation);
//this.error("Grammar is not LALR(1)!", "State:", this._pStates[iIndex], "Symbol:", sSymbol, ":",
//            "Old value:", this._ppSynatxTable[iIndex][sSymbol], "New Value: ", pOperation);
            }
            pSyntaxTable[iIndex][sSymbol] = pOperation;
        }

        private addStateLink(pState: IState, pNextState: IState, sSymbol: string): void {
            var isAddState: bool = pState.addNextState(sSymbol, pNextState);
            if (!isAddState) {
                this.error(ESyntaxErrorCode.k_GrammarAddStateLink);
//this.error("AddlinkState: Grammar is not LALR(1)! Rewrite link!", "State", pState, "Link to", pNextState,
//    "Symbol", sSymbol);
            }
        }

        private firstTerminal(sSymbol: string): BoolMap {
            if (this.isTerminal(sSymbol)) {
                return null;
            }

            if (isDef(this._pFirstTerminalsDMap[sSymbol])) {
                return this._pFirstTerminalsDMap[sSymbol];
            }

            var i: string, j:  number , k: string;
            var pRulesMap: IRuleMap = this._pRulesDMap[sSymbol];

            var pTempRes: BoolMap;
            var pRes: BoolMap;

            var pRight: string[];
            var isFinish: bool;

            pRes = this._pFirstTerminalsDMap[sSymbol] = <BoolMap>{};

            if (this.hasEmptyRule(sSymbol)) {
                pRes[ "EMPTY" ] = true;
            }
            for (i in pRulesMap) {

                isFinish = false;
                pRight = pRulesMap[i].right;

                for (j = 0; j < pRight.length; j++) {

                    if (pRight[j] === sSymbol) {
                        if (pRes[ "EMPTY" ]) {
                            continue;
                        }
                        isFinish = true;
                        break;
                    }

                    pTempRes = this.firstTerminal(pRight[j]);

                    if (isNull(pTempRes)) {
                        pRes[pRight[j]] = true;
                    }
                    else {
                        for (k in pTempRes) {
                            pRes[k] = true;
                        }
                    }

                    if (!this.hasEmptyRule(pRight[j])) {
                        isFinish = true;
                        break;
                    }

                }

                if (!isFinish) {
                    pRes[ "EMPTY" ] = true;
                }

            }

            return pRes;
        }

        private followTerminal(sSymbol: string): BoolMap {
            if (isDef(this._pFollowTerminalsDMap[sSymbol])) {
                return this._pFollowTerminalsDMap[sSymbol];
            }

            var i: string, j: string, k:  number , l:  number , m: string;
            var pRulesDMap: IRuleDMap = this._pRulesDMap;

            var pTempRes: BoolMap;
            var pRes: BoolMap;

            var pRight: string[];
            var isFinish: bool;

            pRes = this._pFollowTerminalsDMap[sSymbol] = <BoolMap>{};

            for (i in pRulesDMap) {
                for (j in pRulesDMap[i]) {

                    pRight = pRulesDMap[i][j].right;

                    for (k = 0; k < pRight.length; k++) {

                        if (pRight[k] === sSymbol) {

                            if (k === pRight.length - 1) {
                                pTempRes = this.followTerminal(pRulesDMap[i][j].left);
                                for (m in pTempRes) {
                                    pRes[m] = true;
                                }
                            }
                            else {
                                isFinish = false;

                                for (l = k + 1; l < pRight.length; l++) {
                                    pTempRes = this.firstTerminal(pRight[l]);

                                    if (isNull(pTempRes)) {
                                        pRes[pRight[l]] = true;
                                        isFinish = true;
                                        break;
                                    }
                                    else {
                                        for (m in pTempRes) {
                                            pRes[m] = true;
                                        }
                                    }

                                    if (!pTempRes[ "EMPTY" ]) {
                                        isFinish = true;
                                        break;
                                    }
                                }

                                if (!isFinish) {
                                    pTempRes = this.followTerminal(pRulesDMap[i][j].left);
                                    for (m in pTempRes) {
                                        pRes[m] = true;
                                    }
                                }
                            }
                        }
                    }
                }
            }

            return pRes;
        }

        private firstTerminalForSet(pSet: string[], pExpected: BoolMap): BoolMap {
            var i:  number , j: string;

            var pTempRes: BoolMap;
            var pRes: BoolMap;

            var isEmpty: bool;

            for (i = 0; i < pSet.length; i++) {
                pTempRes = this.firstTerminal(pSet[i]);

                if (isNull(pTempRes)) {
                    pRes[pSet[i]] = true;
                }

                isEmpty = false;

                for (j in pTempRes) {
                    if (j ===  "EMPTY" ) {
                        isEmpty = true;
                        continue;
                    }
                    pRes[j] = true;
                }

                if (!isEmpty) {
                    return pRes;
                }
            }

            for (j in pExpected) {
                pRes[j] = true;
            }

            return pRes;
        }

        private generateRules(sGrammarSource: string): void {
            var pAllRuleList: string[] = sGrammarSource.split(/\r?\n/);
            var pTempRule: string[];
            var pRule: IRule;
            var isLexerBlock: bool = false;

            this._pRulesDMap = <IRuleDMap>{};
            this._pRuleFunctionNamesMap = <StringMap>{};
            this._pSymbolsWithNodesMap = <IntMap>{};

            var i:  number  = 0, j:  number  = 0;

            var isAllNodeMode: bool = bf.testAll(< number >this._eParseMode, < number >EParseMode.k_AllNode);
            var isNegateMode: bool = bf.testAll(< number >this._eParseMode, < number >EParseMode.k_Negate);
            var isAddMode: bool = bf.testAll(< number >this._eParseMode, < number >EParseMode.k_Add);

            var pSymbolsWithNodeMap: IntMap = this._pSymbolsWithNodesMap;


            for (i = 0; i < pAllRuleList.length; i++) {
                if (pAllRuleList[i] === "" || pAllRuleList[i] === "\r") {
                    continue;
                }

                pTempRule = pAllRuleList[i].split(/\s* \s*/);

                if (isLexerBlock) {
                    if ((pTempRule.length === 3 || (pTempRule.length === 4 && pTempRule[3] === "")) &&
                        ((pTempRule[2][0] === "\"" || pTempRule[2][0] === "'") && pTempRule[2].length > 3)) {

//TERMINALS
                        if (pTempRule[2][0] !== pTempRule[2][pTempRule[2].length - 1]) {
                            this.error(ESyntaxErrorCode.k_GrammarUnexpectedSymbol);
//this._error("Can`t generate rules from grammar! Unexpected symbol! Must be")
                        }

                        pTempRule[2] = pTempRule[2].slice(1, pTempRule[2].length - 1);

                        var ch = pTempRule[2][0];

                        if ((ch === "_") || (ch >= "a" && ch <= "z") || (ch >= "A" && ch <= "Z")) {
                            this._pLexer.addKeyword(pTempRule[2], pTempRule[0]);
                        }
                        else {
                            this._pLexer.addPunctuator(pTempRule[2], pTempRule[0]);
                        }
                    }

                    continue;
                }

                if (pTempRule[0] ===  "--LEXER--" ) {
                    isLexerBlock = true;
                    continue;
                }

//NON TERMNINAL RULES
                if (isDef(this._pRulesDMap[pTempRule[0]]) === false) {
                    this._pRulesDMap[pTempRule[0]] = <IRuleMap>{};
                }

                pRule = <IRule>{
                    left: pTempRule[0],
                    right: <string[]>[],
                    index: 0
                };
                this._pSymbols[pTempRule[0]] = true;

                if (isAllNodeMode) {
                    pSymbolsWithNodeMap[pTempRule[0]] = ENodeCreateMode.k_Default;
                }
                else if (isNegateMode && !isDef(pSymbolsWithNodeMap[pTempRule[0]])) {
                    pSymbolsWithNodeMap[pTempRule[0]] = ENodeCreateMode.k_Default;
                }
                else if (isAddMode && !isDef(pSymbolsWithNodeMap[pTempRule[0]])) {
                    pSymbolsWithNodeMap[pTempRule[0]] = ENodeCreateMode.k_Not;
                }

                for (j = 2; j < pTempRule.length; j++) {
                    if (pTempRule[j] === "") {
                        continue;
                    }
                    if (pTempRule[j] ===  "--AN" ) {
                        if (isAddMode) {
                            pSymbolsWithNodeMap[pTempRule[0]] = ENodeCreateMode.k_Necessary;
                        }
                        continue;
                    }
                    if (pTempRule[j] ===  "--NN" ) {
                        if (isNegateMode && !isAllNodeMode) {
                            pSymbolsWithNodeMap[pTempRule[0]] = ENodeCreateMode.k_Not;
                        }
                        continue;
                    }
                    if (pTempRule[j] ===  "--F" ) {
                        if ((!pTempRule[j + 1] || pTempRule[j + 1].length === 0)) {
                            this.error(ESyntaxErrorCode.k_GrammarBadAdditionalFunctionName);
//this._error("Can`t generate rule for grammar! Addititional functionhas has bad name");
                        }
                        this._pRuleFunctionNamesMap[this._nRules] = pTempRule[j + 1];
                        j++;
                        continue;
                    }
                    if (pTempRule[j][0] === "'" || pTempRule[j][0] === "\"") {
                        if (pTempRule[j].length !== 3) {
                            this.error(ESyntaxErrorCode.k_GrammarBadKeyword);
//this._error("Can`t generate rules from grammar! Keywords must be rules");
                        }
                        if (pTempRule[j][0] !== pTempRule[j][2]) {
                            this.error(ESyntaxErrorCode.k_GrammarUnexpectedSymbol);
//this._error("Can`t generate rules from grammar! Unexpected symbol! Must be");
                        }
                        var sName: string = this._pLexer.addPunctuator(pTempRule[j][1]);
                        pRule.right.push(sName);
                        this._pSymbols[sName] = true;
                    }
                    else {
                        pRule.right.push(pTempRule[j]);
                        this._pSymbols[pTempRule[j]] = true;
                    }
                }

                pRule.index = this._nRules;
                this._pRulesDMap[pTempRule[0]][pRule.index] = pRule;
                this._nRules += 1;

            }

        }


        private generateFirstState(eType: EParserType): void {
            if (eType === EParserType.k_LR0) {
                this.generateFirstState_LR0();
            }
            else {
                this.generateFirstState_LR();
            }
        }

        private generateFirstState_LR0(): void {
            var pState: IState = new State();
            var pItem: IItem = new Item(this._pRulesDMap[ "S" ][0], 0);

            this.pushBaseItem(pItem);
            pState.push(pItem);

            this.closure_LR0(pState);
            this.pushState(pState);
        }

        private generateFirstState_LR(): void {
            var pState: IState = new State();
            var pExpected: BoolMap = <BoolMap>{};
            pExpected[ "$" ] = true;

            pState.push(new Item(this._pRulesDMap[ "S" ][0], 0, pExpected));

            this.closure_LR(pState);
            this.pushState(pState);
        }

        private closure(pState: IState, eType: EParserType): IState {
            if (eType === EParserType.k_LR0) {
                return this.closure_LR0(pState);
            }
            else {
                this.closure_LR(pState);
            }
        }

        private closure_LR0(pState: IState): IState {
            var pItemList: IItem[] = pState.items;
            var i:  number  = 0, j: string;
            var sSymbol: string;

            for (i = 0; i < pItemList.length; i++) {
                sSymbol = pItemList[i].mark();

                if (sSymbol !==  "END"  && (!this.isTerminal(sSymbol))) {
                    for (j in this._pRulesDMap[sSymbol]) {
                        pState.tryPush_LR0(this._pRulesDMap[sSymbol][j], 0);
                    }
                }

            }
            return pState;
        }

        private closure_LR(pState: IState): IState {
            var pItemList: IItem[] = <IItem[]>(pState.items);
            var i:  number  = 0, j: string, k: string;
            var sSymbol: string;
            var pSymbols: BoolMap;
            var pTempSet: string[];
            var isNewExpected: bool = false;

            while (true) {
                if (i === pItemList.length) {
                    if (!isNewExpected) {
                        break;
                    }
                    i = 0;
                    isNewExpected = false;
                }
                sSymbol = pItemList[i].mark();

                if (sSymbol !==  "END"  && (!this.isTerminal(sSymbol))) {
                    pTempSet = pItemList[i].rule.right.slice(pItemList[i].position + 1);
                    pSymbols = this.firstTerminalForSet(pTempSet, pItemList[i].expectedSymbols);

                    for (j in this._pRulesDMap[sSymbol]) {
                        for (k in pSymbols) {
                            if (pState.tryPush_LR(this._pRulesDMap[sSymbol][j], 0, k)) {
                                isNewExpected = true;
                            }
                        }
                    }
                }

                i++;
            }

            return pState;
        }

        private nexeState(pState: IState, sSymbol: string, eType: EParserType): IState {
            if (eType === EParserType.k_LR0) {
                return this.nextState_LR0(pState, sSymbol);
            }
            else {
                return this.nextState_LR(pState, sSymbol);
            }
        }

        private nextState_LR0(pState: IState, sSymbol: string): IState {
            var pItemList: IItem[] = pState.items;
            var i:  number  = 0;
            var pNewState: IState = new State();

            for (i = 0; i < pItemList.length; i++) {
                if (sSymbol === pItemList[i].mark()) {
                    pNewState.push(new Item(pItemList[i].rule, pItemList[i].position + 1));
                }
            }

            return pNewState;
        }

        private nextState_LR(pState: IState, sSymbol: string): IState {
            var pItemList: IItem[] = <IItem[]>pState.items;
            var i:  number  = 0;
            var pNewState: IState = new State();

            for (i = 0; i < pItemList.length; i++) {
                if (sSymbol === pItemList[i].mark()) {
                    pNewState.push(new Item(pItemList[i].rule, pItemList[i].position + 1, pItemList[i].expectedSymbols));
                }
            }

            return pNewState;
        }

        private deleteNotBaseItems(): void {
            var i:  number  = 0;
            for (i = 0; i < this._pStateList.length; i++) {
                this._pStateList[i].deleteNotBase();
            }
        }

        private closureForItem(pRule: IRule, iPos:  number ): IState {
            var sIndex: string = "";
            sIndex += pRule.index + "_" + iPos;

            var pState: IState = this._pStatesTempMap[sIndex];
            if (isDef(pState)) {
                return pState;
            }
            else {
                var pExpected: BoolMap = <BoolMap>{};
                pExpected[ "##" ] = true;

                pState = new State();
                pState.push(new Item(pRule, iPos, pExpected));

                this.closure_LR(pState);
                this._pStatesTempMap[sIndex] = pState;

                return pState;
            }
        }

        private addLinkExpected(pItem: IItem, pItemX: IItem): void {
            var pTable: BoolDMap = this._pExpectedExtensionDMap;
            var iIndex:  number  = pItem.index;

            if (!isDef(pTable[iIndex])) {
                pTable[iIndex] = <BoolMap>{};
            }

            pTable[iIndex][pItemX.index] = true;
        }

        private determineExpected(pTestState: IState, sSymbol: string): void {
            var pStateX = pTestState.getNextStateBySymbol(sSymbol);

            if (isNull(pStateX)) {
                return;
            }

            var pItemListX: IItem[] = <IItem[]>pStateX.items;
            var pItemList: IItem[] = <IItem[]>pTestState.items;
            var pState: IState;
            var pItem: IItem;
                var i:  number , j:  number , k: string;

            var nBaseItemTest = pTestState.numBaseItems;
            var nBaseItemX = pStateX.numBaseItems;

            for (i = 0; i < nBaseItemTest; i++) {
                pState = this.closureForItem(pItemList[i].rule, pItemList[i].position);

                for (j = 0; j < nBaseItemX; j++) {
                    pItem = <IItem>pState.hasChildItem(pItemListX[j]);

                    if (pItem) {
                        var pExpected: BoolMap = pItem.expectedSymbols;

                        for (k in pExpected) {
                            if (k ===  "##" ) {
                                this.addLinkExpected(pItemList[i], pItemListX[j]);
                            }
                            else {
                                pItemListX[j].addExpected(k);
                            }
                        }
                    }
                }
            }
        }

        private generateLinksExpected(): void {
            var i:  number , j: string;
            var pStates: IState[] = this._pStateList;

            for (i = 0; i < pStates.length; i++) {
                for (j in this._pSymbols) {
                    this.determineExpected(pStates[i], j);
                }
            }
        }

        private expandExpected(): void {
            var pItemList: IItem[] = <IItem[]>this._pBaseItemList;
            var pTable: BoolDMap = this._pExpectedExtensionDMap;
            var i:  number  = 0, j: string;
            var sSymbol: string;
            var isNewExpected: bool = false;

            pItemList[0].addExpected( "$" );
            pItemList[0].isNewExpected = true;

            while (true) {

                if (i === pItemList.length) {
                    if (!isNewExpected) {
                        break;
                    }
                    isNewExpected = false;
                    i = 0;
                }

                if (pItemList[i].isNewExpected) {
                    var pExpected: BoolMap = pItemList[i].expectedSymbols;

                    for (sSymbol in pExpected) {
                        for (j in pTable[i]) {
                            if (pItemList[<number><any>j].addExpected(sSymbol)) {
                                isNewExpected = true;
                            }
                        }
                    }
                }

                pItemList[i].isNewExpected = false;
                i++;
            }
        }

        private generateStates(eType: EParserType): void {
            if (eType === EParserType.k_LR0) {
                this.generateStates_LR0();
            }
            else if (eType === EParserType.k_LR1) {
                this.generateStates_LR();
            }
            else if (eType === EParserType.k_LALR) {
                this.generateStates_LALR();
            }
        }

        private generateStates_LR0(): void {
            this.generateFirstState_LR0();

            var i:  number ;
            var pStateList: IState[] = this._pStateList;
            var sSymbol: string;
            var pState: IState;

            for (i = 0; i < pStateList.length; i++) {
                for (sSymbol in this._pSymbols) {
                    pState = this.nextState_LR0(pStateList[i], sSymbol);

                    if (!pState.isEmpty()) {
                        pState = this.tryAddState(pState, EParserType.k_LR0);
                        this.addStateLink(pStateList[i], pState, sSymbol);
                    }
                }
            }
        }

        private generateStates_LR(): void {
            this._pFirstTerminalsDMap = <BoolDMap>{};
            this.generateFirstState_LR();

            var i:  number ;
            var pStateList: IState[] = this._pStateList;
            var sSymbol: string;
            var pState: IState;

            for (i = 0; i < pStateList.length; i++) {
                for (sSymbol in this._pSymbols) {
                    pState = this.nextState_LR(pStateList[i], sSymbol);

                    if (!pState.isEmpty()) {
                        pState = this.tryAddState(pState, EParserType.k_LR1);
                        this.addStateLink(pStateList[i], pState, sSymbol);
                    }
                }
            }
        }

        private generateStates_LALR(): void {
            this._pStatesTempMap = <IStateMap>{};
            this._pBaseItemList = <IItem[]>[];
            this._pExpectedExtensionDMap = <BoolDMap>{};
            this._pFirstTerminalsDMap = <BoolDMap>{};

            this.generateStates_LR0();
            this.deleteNotBaseItems();
            this.generateLinksExpected();
            this.expandExpected();

            var i:  number  = 0;
            var pStateList: IState[] = this._pStateList;

            for (i = 0; i < pStateList.length; i++) {
                this.closure_LR(pStateList[i]);
            }
        }

        private calcBaseItem():  number  {
            var num:  number  = 0;
            var i:  number  = 0;

            for (i = 0; i < this._pStateList.length; i++) {
                num += this._pStateList[i].numBaseItems;
            }

            return num;
        }

        private printStates(isBase: bool): string {
            var sMsg: string = "";
            var i:  number  = 0;

            for (i = 0; i < this._pStateList.length; i++) {
                sMsg += this.printState(this._pStateList[i], isBase);
                sMsg += " ";
            }

            return sMsg;
        }

        private printState(pState: IState, isBase: bool): string {
            var sMsg: string = pState.toString(isBase);
            return sMsg;
        }

        private printExpectedTable(): string {
            var i: string, j: string;
            var sMsg: string = "";

            for (i in this._pExpectedExtensionDMap) {
                sMsg += "State " + this._pBaseItemList[<number><any>i].state.index + ":   ";
                sMsg += this._pBaseItemList[<number><any>i].toString() + "  |----->\n";

                for (j in this._pExpectedExtensionDMap[i]) {
                    sMsg += "\t\t\t\t\t" + "State " + this._pBaseItemList[<number><any>j].state.index + ":   ";
                    sMsg += this._pBaseItemList[<number><any>j].toString() + "\n";
                }

                sMsg += "\n";
            }

            return sMsg;
        }

        private addReducing(pState: IState): void {
            var i:  number , j: string;
            var pItemList: IItem[] = pState.items;

            for (i = 0; i < pItemList.length; i++) {
                if (pItemList[i].mark() ===  "END" ) {

                    if (pItemList[i].rule.left ===  "S" ) {
                        this.pushInSyntaxTable(pState.index,  "$" , this._pSuccessOperation);
                    }
                    else {
                        var pExpected = pItemList[i].expectedSymbols;

                        for (j in pExpected) {
                            this.pushInSyntaxTable(pState.index, j, this._pReduceOperationsMap[pItemList[i].rule.index]);
                        }
                    }
                }
            }
        }

        private addShift(pState: IState) {
            var i: string;
            var pStateMap: IStateMap = pState.nextStates;

            for (i in pStateMap) {
                this.pushInSyntaxTable(pState.index, i, this._pShiftOperationsMap[pStateMap[i].index]);
            }
        }

        private buildSyntaxTable(): void {
            this._pStateList = <IState[]>[];

            var pStateList: IState[] = this._pStateList;
            var pState: IState;

//Generate states
            this.generateStates(this._eType);

//Init necessary properties
            this._pSyntaxTable = <IOperationDMap>{};
            this._pReduceOperationsMap = <IOperationMap>{};
            this._pShiftOperationsMap = <IOperationMap>{};

            this._pSuccessOperation = <IOperation>{ type: EOperationType.k_Success };

            var i:  number  = 0, j: string, k: string;

            for (i = 0; i < pStateList.length; i++) {
                this._pShiftOperationsMap[pStateList[i].index] = <IOperation>{
                    type: EOperationType.k_Shift,
                    index: pStateList[i].index
                };
            }

            for (j in this._pRulesDMap) {
                for (k in this._pRulesDMap[j]) {
                    this._pReduceOperationsMap[k] = <IOperation>{
                        type: EOperationType.k_Reduce,
                        rule: this._pRulesDMap[j][k]
                    };
                }
            }

//Build syntax table
            for (var i = 0; i < pStateList.length; i++) {
                pState = pStateList[i];
                this.addReducing(pState);
                this.addShift(pState);
            }
        }

        private readToken(): IToken {
            return this._pLexer.getNextToken();
        }

        private ruleAction(pRule: IRule): EOperationType {
            this._pSyntaxTree.reduceByRule(pRule, this._pSymbolsWithNodesMap[pRule.left]);

            var sActionName:string = this._pRuleFunctionNamesMap[pRule.index];
            if (isDef(sActionName)) {
                return (this._pAdditionalFunctionsMap[sActionName]).call(this, pRule);
            }

            return EOperationType.k_Ok;
        }

        private defaultInit(): void {
            this._iIndex = 0;
            this._pStack = [0];
            this._pSyntaxTree = new ParseTree();
            this._pTypeIdMap = <BoolMap>{};
        }

        private resumeParse(): EParserCode {
            try {
                var pTree:IParseTree = this._pSyntaxTree;
                var pStack: number [] = this._pStack;
                var pSyntaxTable:IOperationDMap = this._pSyntaxTable;

                var isStop:bool = false;
                var isError:bool = false;
                var isPause:bool = false;
                var pToken:IToken = this._pToken;

                var pOperation:IOperation;
                var iRuleLength: number ;

                while (!isStop) {
                    pOperation = pSyntaxTable[pStack[pStack.length - 1]][pToken.name];
                    if (isDef(pOperation)) {
                        switch (pOperation.type) {
                            case EOperationType.k_Success:
                                isStop = true;
                                break;

                            case EOperationType.k_Shift:
                                pStack.push(pOperation.index);
                                pTree.addNode(<IParseNode>pToken);
                                pToken = this.readToken();
                                break;

                            case EOperationType.k_Reduce:
                                iRuleLength = pOperation.rule.right.length;
                                pStack.length -= iRuleLength;
                                pStack.push(pSyntaxTable[pStack[pStack.length - 1]][pOperation.rule.left].index);

                                if (this.ruleAction(pOperation.rule) === EOperationType.k_Pause) {
                                    this._pToken = pToken;
                                    isStop = true;
                                    isPause = true;
                                }
                                break;
                        }
                    }
                    else {
                        isError = true;
                        isStop = true;
                    }
                }
                if (isPause) {
                    return EParserCode.k_Pause;
                }

                if (!isError) {
                    pTree.setRoot();
                    if (isDef(this._fnFinishCallback)) {
                        this._fnFinishCallback.call(this._pCaller, EParserCode.k_Ok);
                    }
                    return EParserCode.k_Ok;
                }
                else {
                    this.error(ESyntaxErrorCode.k_SyntaxError);
//console.log("Error!!!", pToken);
                    if (isDef(this._fnFinishCallback)) {
                        this._fnFinishCallback.call(this._pCaller, EParserCode.k_Error);
                    }
                    return EParserCode.k_Error;
                }

            }
            catch (e) {
                 return EParserCode.k_Error;
            }
        }

    }

}





module akra {
// var engine: IEngine = createEngine();
// var dmgr: IDisplayManager = engine.getDisplayManager();
// var view: IDisplay3d = dmgr.createDisplay3D();
// var scene: IScene = view.getScene();
}

var x: akra.util.IParser = new akra.util.Parser;

var sGrammar:string = "S : E\n"			+
					  "E : T '+' E\n"	+
					  "E : T '-' E\n"	+
					  "E : T\n"			+
					  "T : F '*' T\n"	+
					  "T : F '/' T\n"	+
					  "T : F\n"			+
					  "F : T_UINT\n"	+
					  "F : '(' E ')'\n";

x.init(sGrammar);
x.parse("2+3-4*6");
console.log(x);
