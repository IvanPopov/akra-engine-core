


/*---------------------------------------------
 * assembled at: Thu Sep 19 2013 17:02:12 GMT+0400 (Московское время (лето))
 * directory: tests/common/parser/DEBUG/
 * file: tests/common/parser/parser.ts
 * name: parser
 *--------------------------------------------*/


var __extends = this.__extends || function (d, b) {
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
/// @data: data
/// @DATA: {data}|location()
// #define CRYPTO_API 1
// #define GUI 1
// #define WEBGL_DEBUG 1
// #define DETAILED_LOG 1
//trace all render entry
// #define __VIEW_INTERNALS__ 1
var akra;
(function (akra) {
    (function (ELogLevel) {
        ELogLevel._map = [];
        ELogLevel.NONE = 0x0000;
        ELogLevel.LOG = 0x0001;
        ELogLevel.INFORMATION = 0x0002;
        ELogLevel.WARNING = 0x0004;
        ELogLevel.ERROR = 0x0008;
        ELogLevel.CRITICAL = 0x0010;
        ELogLevel.ALL = 0x001F;
    })(akra.ELogLevel || (akra.ELogLevel = {}));
    var ELogLevel = akra.ELogLevel;
})(akra || (akra = {}));
/*I ## */
/*I ## */
/*I ## */
/*I ## */
var akra;
(function (akra) {
    var p = document.getElementsByTagName("script");
    /**@const*/ akra.DATA = (akra.DATA || ((p[p.length - 1]).getAttribute("data")) || data) + "/";
    akra.DEBUG = true;
    akra.logger;
    akra.typeOf;
    akra.typeOf = function typeOf(x) {
        var s = typeof x;
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
                if ((sClassName == '[object Array]' || typeof x.length == 'number' && typeof x.splice != 'undefined' && typeof x.propertyIsEnumerable != 'undefined' && !x.propertyIsEnumerable('splice'))) {
                    return 'array';
                }
                if ((sClassName == '[object Function]' || typeof x.call != 'undefined' && typeof x.propertyIsEnumerable != 'undefined' && !x.propertyIsEnumerable('call'))) {
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
    akra.isDef = /** @inline */function (x) {
        return x !== undefined;
    };
    /** @inline */
    akra.isEmpty = /** @inline */function (x) {
        return x.length == 0;
    };
    // Note that undefined == null.
    /** @inline */
    akra.isDefAndNotNull = /** @inline */function (x) {
        return x != null;
    };
    /** @inline */
    akra.isNull = /** @inline */function (x) {
        return x === null;
    };
    /** @inline */
    akra.isBoolean = /** @inline */function (x) {
        return typeof x === "boolean";
    };
    /** @inline */
    akra.isString = /** @inline */function (x) {
        return typeof x === "string";
    };
    /** @inline */
    akra.isNumber = /** @inline */function (x) {
        return typeof x === "number";
    };
    /** @inline */
    akra.isFloat = akra.isNumber;
    /** @inline */
    akra.isInt = akra.isNumber;
    /** @inline */
    akra.isFunction = /** @inline */function (x) {
        return akra.typeOf(x) === "function";
    };
    /** @inline */
    akra.isObject = function (x) {
        var type = akra.typeOf(x);
        return type == "object" || type == "array" || type == "function";
    };
    akra.isArrayBuffer = /** @inline */function (x) {
        return x instanceof ArrayBuffer;
    };
    akra.isTypedArray = /** @inline */function (x) {
        return x !== null && typeof x === "object" && typeof x.byteOffset === "number";
    };
    akra.isBlob = /** @inline */function (x) {
        return x instanceof Blob;
    };
    /** @inline */
    akra.isArray = function (x) {
        return akra.typeOf(x) == "array";
    };
    function fnSortMinMax(a, b) {
        return a - b;
    }
    akra.fnSortMinMax = fnSortMinMax;
    function fnSortMaxMin(a, b) {
        return b - a;
    }
    akra.fnSortMaxMin = fnSortMaxMin;
    function binarySearchInSortIntArray(pArray, iValue) {
        if (iValue < pArray[0] || iValue > pArray[pArray.length - 1]) {
            return -1;
        }
        if (iValue === pArray[0]) {
            return 0;
        }
        if (iValue === pArray[pArray.length - 1]) {
            return pArray.length - 1;
        }
        var p = 0;
        var q = pArray.length - 1;
        while(p < q) {
            var s = (p + q) >> 1;
            if (iValue === pArray[s]) {
                return s;
            } else if (iValue > pArray[s]) {
                p = s + 1;
            } else {
                q = s;
            }
        }
        return -1;
    }
    akra.binarySearchInSortIntArray = binarySearchInSortIntArray;
    ;
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
    function genArray(pType, nSize) {
        var tmp = new Array(nSize);
        for(var i = 0; i < nSize; ++i) {
            tmp[i] = (pType ? new pType() : null);
        }
        return tmp;
    }
    akra.genArray = genArray;
    /**@const*/ akra.INVALID_INDEX = 0xffff;
    // (-2147483646);
    /**@const*/ akra.MIN_INT32 = 0xffffffff;
    // ( 2147483647);
    /**@const*/ akra.MAX_INT32 = 0x7fffffff;
    // (-32768);
    /**@const*/ akra.MIN_INT16 = 0xffff;
    // ( 32767);
    /**@const*/ akra.MAX_INT16 = 0x7fff;
    // (-128);
    /**@const*/ akra.MIN_INT8 = 0xff;
    // ( 127);
    /**@const*/ akra.MAX_INT8 = 0x7f;
    /**@const*/ akra.MIN_UINT32 = 0;
    /**@const*/ akra.MAX_UINT32 = 0xffffffff;
    /**@const*/ akra.MIN_UINT16 = 0;
    /**@const*/ akra.MAX_UINT16 = 0xffff;
    /**@const*/ akra.MIN_UINT8 = 0;
    /**@const*/ akra.MAX_UINT8 = 0xff;
    /**@const*/ akra.SIZE_FLOAT64 = 8;
    /**@const*/ akra.SIZE_REAL64 = 8;
    /**@const*/ akra.SIZE_FLOAT32 = 4;
    /**@const*/ akra.SIZE_REAL32 = 4;
    /**@const*/ akra.SIZE_INT32 = 4;
    /**@const*/ akra.SIZE_UINT32 = 4;
    /**@const*/ akra.SIZE_INT16 = 2;
    /**@const*/ akra.SIZE_UINT16 = 2;
    /**@const*/ akra.SIZE_INT8 = 1;
    /**@const*/ akra.SIZE_UINT8 = 1;
    /**@const*/ akra.SIZE_BYTE = 1;
    /**@const*/ akra.SIZE_UBYTE = 1;
    //1.7976931348623157e+308
    /**@const*/ akra.MAX_FLOAT64 = Number.MAX_VALUE;
    //-1.7976931348623157e+308
    /**@const*/ akra.MIN_FLOAT64 = -Number.MAX_VALUE;
    //5e-324
    /**@const*/ akra.TINY_FLOAT64 = Number.MIN_VALUE;
    //    export const MAX_REAL64: number = Number.MAX_VALUE;   //1.7976931348623157e+308
    //    export const MIN_REAL64: number = -Number.MAX_VALUE;  //-1.7976931348623157e+308
    //    export const TINY_REAL64: number = Number.MIN_VALUE;  //5e-324
    //3.4e38
    /**@const*/ akra.MAX_FLOAT32 = 3.4e38;
    //-3.4e38
    /**@const*/ akra.MIN_FLOAT32 = -3.4e38;
    //1.5e-45
    /**@const*/ akra.TINY_FLOAT32 = 1.5e-45;
    //    export const MAX_REAL32: number = 3.4e38;     //3.4e38
    //    export const MIN_REAL32: number = -3.4e38;    //-3.4e38
    //    export const TINY_REAL32: number = 1.5e-45;   //1.5e-45
    /**@const*/ akra.DEFAULT_MATERIAL_NAME = "default";
    (function (EDataTypes) {
        EDataTypes._map = [];
        EDataTypes.BYTE = 0x1400;
        EDataTypes.UNSIGNED_BYTE = 0x1401;
        EDataTypes.SHORT = 0x1402;
        EDataTypes.UNSIGNED_SHORT = 0x1403;
        EDataTypes.INT = 0x1404;
        EDataTypes.UNSIGNED_INT = 0x1405;
        EDataTypes.FLOAT = 0x1406;
    })(akra.EDataTypes || (akra.EDataTypes = {}));
    var EDataTypes = akra.EDataTypes;
    ;
    (function (EDataTypeSizes) {
        EDataTypeSizes._map = [];
        EDataTypeSizes.BYTES_PER_BYTE = 1;
        EDataTypeSizes.BYTES_PER_UNSIGNED_BYTE = 1;
        EDataTypeSizes.BYTES_PER_UBYTE = 1;
        EDataTypeSizes.BYTES_PER_SHORT = 2;
        EDataTypeSizes.BYTES_PER_UNSIGNED_SHORT = 2;
        EDataTypeSizes.BYTES_PER_USHORT = 2;
        EDataTypeSizes.BYTES_PER_INT = 4;
        EDataTypeSizes.BYTES_PER_UNSIGNED_INT = 4;
        EDataTypeSizes.BYTES_PER_UINT = 4;
        EDataTypeSizes.BYTES_PER_FLOAT = 4;
    })(akra.EDataTypeSizes || (akra.EDataTypeSizes = {}));
    var EDataTypeSizes = akra.EDataTypeSizes;
    ;
    ;
    ;
    ;
    ;
    ;
    ;
        function getTypeSize(eType) {
        switch(eType) {
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
 {
                    akra.logger.setSourceLocation("../../../inc/common.ts", 467);
                    akra.logger.error('unknown data/image type used');
                }
                ;
        }
    }
    akra.getTypeSize = getTypeSize;
    akra.sid = /** @inline */function () {
        return (++akra.sid._iTotal);
    };
    akra.sid._iTotal = 0;
    /** @inline */function now() {
        return Date.now();
    }
    akra.now = now;
    /** @inline */function memcpy(pDst, iDstOffset, pSrc, iSrcOffset, nLength) {
        var dstU8 = new Uint8Array(pDst, iDstOffset, nLength);
        var srcU8 = new Uint8Array(pSrc, iSrcOffset, nLength);
        dstU8.set(srcU8);
    }
    akra.memcpy = memcpy;
    ;
    //export function
    (window).URL = (window).URL ? (window).URL : (window).webkitURL ? (window).webkitURL : null;
    (window).BlobBuilder = (window).WebKitBlobBuilder || (window).MozBlobBuilder || (window).BlobBuilder;
    (window).requestFileSystem = (window).requestFileSystem || (window).webkitRequestFileSystem;
    (window).requestAnimationFrame = (window).requestAnimationFrame || (window).webkitRequestAnimationFrame || (window).mozRequestAnimationFrame;
    (window).WebSocket = (window).WebSocket || (window).MozWebSocket;
    // (<any>window).storageInfo = (<any>window).storageInfo || (<any>window).webkitPersistentStorage ;
    (window).storageInfo = (window).storageInfo || (window).webkitTemporaryStorage;
    (navigator).gamepads = (navigator).gamepads || (navigator).webkitGamepads;
    (navigator).getGamepads = (navigator).getGamepads || (navigator).webkitGetGamepads;
    Worker.prototype.postMessage = (Worker).prototype.webkitPostMessage || Worker.prototype.postMessage;
})(akra || (akra = {}));
;
function utf8_encode(argString) {
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
    var utftext = "", start, end, stringl = 0;
    start = end = 0;
    stringl = string.length;
    for(var n = 0; n < stringl; n++) {
        var c1 = string.charCodeAt(n);
        var enc = null;
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
}
function utf8_decode(str_data) {
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
        var tmp_arr = [], i = 0, ac = 0, c1 = 0, c2 = 0, c3 = 0;
    str_data += "";
    while(i < str_data.length) {
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
}
var akra;
(function (akra) {
    (function (libs) {
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
                    var t = this[i];
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
                    for(var i = 0, n = pElement.length; i < n; ++i) {
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
            var sValue = this.toString(16);
            for(var i = 0; i < iLength - sValue.length; ++i) {
                sValue = '0' + sValue;
            }
            return sValue;
        };
        Number.prototype.printBinary = function (isPretty) {
            if (typeof isPretty === "undefined") { isPretty = true; }
            var res = "";
            for(var i = 0; i < 32; ++i) {
                if (i && (i % 4) == 0 && isPretty) {
                    res = ' ' + res;
                }
                (this >> i & 0x1 ? res = '1' + res : res = '0' + res);
            }
            return res;
        };
    })(akra.libs || (akra.libs = {}));
    var libs = akra.libs;
})(akra || (akra = {}));
var akra;
(function (akra) {
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
    (function (bf) {
        /**
        * Сдвиг единицы на @a x позиций влево.
        * @inline
        */
        bf.flag = /** @inline */function (x) {
            return (1 << (x));
        };
        /**
        * Проверка того что у @a value бит под номером @a bit равен единице.
        * @inline
        */
        bf.testBit = /** @inline */function (value, bit) {
            return ((value & ((1 << (bit)))) != 0);
        };
        /**
        * Проверка того что у @a value равны единице все биты,
        * которые равны единице у @a set.
        * @inline
        */
        bf.testAll = /** @inline */function (value, set) {
            return (((value) & (set)) == (set));
        };
        /**
        * Проверка того что у @a value равны единице хотя бы какие то из битов,
        * которые равны единице у @a set.
        * @inline
        */
        bf.testAny = /** @inline */function (value, set) {
            return (((value) & (set)) != 0);
        };
        /**
        * Выставляет бит под номером @a bit у числа @a value равным единице
        * @inline
        */
        bf.setBit = /** @inline */function (value, bit, setting) {
            if (typeof setting === "undefined") { setting = true; }
            return (setting ? ((value) |= ((1 << ((bit))))) : (((value) &= ~((1 << ((bit)))))));
        };
        /**
        *
        * @inline
        */
        bf.clearBit = /** @inline */function (value, bit) {
            return ((value) &= ~((1 << ((bit)))));
        };
        /**
        * Выставляет бит под номером @a bit у числа @a value равным нулю
        * @inline
        */
        bf.setAll = /** @inline */function (value, set, setting) {
            if (typeof setting === "undefined") { setting = true; }
            return (setting ? ((value) |= (set)) : ((value) &= ~(set)));
        };
        /**
        * Выставляет все биты у числа @a value равными единице,
        * которые равны единице у числа @a set
        * @inline
        */
        bf.clearAll = /** @inline */function (value, set) {
            return ((value) &= ~(set));
        };
        /**
        * Выставляет все биты у числа @a value равными нулю,
        * которые равны единице у числа @a set
        * @inline
        */
        bf.equal = function (value, src) {
            value = src;
        };
        /**
        * Прирасваивает числу @a value число @a src
        * @inline
        */
        bf.isEqual = /** @inline */function (value, src) {
            return value == src;
        };
        /**
        * Если число @a value равно числу @a src возвращается true
        * @inline
        */
        bf.isNotEqaul = /** @inline */function (value, src) {
            return value != src;
        };
        /**
        * Прирасваивает числу @a value число @a src
        * @inline
        */
        bf.set = function (value, src) {
            value = src;
        };
        /**
        * Обнуляет число @a value
        * @inline
        */
        bf.clear = function (value) {
            value = 0;
        };
        /**
        * Выставляет все биты у числа @a value равными единице,
        * которые равны единице у числа @a src
        * @inline
        */
        bf.setFlags = /** @inline */function (value, src) {
            return (value |= src);
        };
        /**
        * Выставляет все биты у числа @a value равными нулю,
        * которые равны единице у числа @a src
        * @inline
        */
        bf.clearFlags = /** @inline */function (value, src) {
            return value &= ~src;
        };
        /**
        * Проверяет равно ли число @a value нулю. Если равно возвращает true.
        * Если не равно возвращает false.
        * @inline
        */
        bf.isEmpty = /** @inline */function (value) {
            return (value == 0);
        };
        /**
        * Возвращает общее количество бит числа @a value.
        * На самом деле возвращает всегда 32.
        * @inline
        */
        bf.totalBits = /** @inline */function (value) {
            return 32;
        };
        /**
        * Возвращает общее количество ненулевых бит числа @a value.
        * @inline
        */
        bf.totalSet = function (value) {
            var count = 0;
            var total = (32);
            for(var i = total; i; --i) {
                count += (value & 1);
                value >>= 1;
            }
            return (count);
        };
        /**
        * Convert N bit colour channel value to P bits. It fills P bits with the
        * bit pattern repeated. (this is /((1<<n)-1) in fixed point)
        */
        /** @inline */function fixedToFixed(value, n, p) {
            if (n > p) {
                // Less bits required than available; this is easy
                value >>= n - p;
            } else if (n < p) {
                // More bits required than are there, do the fill
                // Use old fashioned division, probably better than a loop
                if (value == 0) {
                    value = 0;
                } else if (value == ((1) << n) - 1) {
                    value = (1 << p) - 1;
                } else {
                    value = value * (1 << p) / ((1 << n) - 1);
                }
            }
            return value;
        }
        bf.fixedToFixed = fixedToFixed;
        /**
        * Convert floating point colour channel value between 0.0 and 1.0 (otherwise clamped)
        * to integer of a certain number of bits. Works for any value of bits between 0 and 31.
        */
        /** @inline */function floatToFixed(value, bits) {
            if (value <= 0.0) {
                return 0;
            } else if (value >= 1.0) {
                return (1 << bits) - 1;
            } else {
                return (value * (1 << bits));
            }
        }
        bf.floatToFixed = floatToFixed;
        /**
        * Fixed point to float
        */
        /** @inline */function fixedToFloat(value, bits) {
            return (value & ((1 << bits) - 1)) / ((1 << bits) - 1);
        }
        bf.fixedToFloat = fixedToFloat;
        /**
        * Write a n*8 bits integer value to memory in native endian.
        */
        /** @inline */function intWrite(pDest, n, value) {
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
        bf.intWrite = intWrite;
        /**
        * Read a n*8 bits integer value to memory in native endian.
        */
        /** @inline */function intRead(pSrc, n) {
            switch(n) {
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
        }
        bf.intRead = intRead;
                //float32/uint32 union
        var _u32 = new Uint32Array(1);
        var _f32 = new Float32Array(_u32.buffer);
        /** @inline */function floatToHalf(f) {
            _f32[0] = f;
            return floatToHalfI(_u32[0]);
        }
        bf.floatToHalf = floatToHalf;
        /** @inline */function floatToHalfI(i) {
            var s = (i >> 16) & 0x00008000;
            var e = ((i >> 23) & 0x000000ff) - (127 - 15);
            var m = i & 0x007fffff;
            if (e <= 0) {
                if (e < -10) {
                    return 0;
                }
                m = (m | 0x00800000) >> (1 - e);
                return (s | (m >> 13));
            } else if (e == 0xff - (127 - 15)) {
                // Inf
                if (m == 0) {
                    return (s | 0x7c00);
                } else// NAN
                 {
                    m >>= 13;
                    return (s | 0x7c00 | m | (m == 0));
                }
            } else {
                // Overflow
                if (e > 30) {
                    return (s | 0x7c00);
                }
                return (s | (e << 10) | (m >> 13));
            }
        }
        bf.floatToHalfI = floatToHalfI;
        /**
        * Convert a float16 (NV_half_float) to a float32
        * Courtesy of OpenEXR
        */
        /** @inline */function halfToFloat(y) {
            _u32[0] = /*not inlined, because supportes only single statement functions(cur. st. count: 8)*/halfToFloatI(y);
            return _f32[0];
        }
        bf.halfToFloat = halfToFloat;
        /** Converts a half in uint16 format to a float
        in uint32 format
        */
        /** @inline */function halfToFloatI(y) {
            var s = (y >> 15) & 0x00000001;
            var e = (y >> 10) & 0x0000001f;
            var m = y & 0x000003ff;
            if (e == 0) {
                // Plus or minus zero
                if (m == 0) {
                    return s << 31;
                } else// Denormalized number -- renormalize it
                 {
                    while(!(m & 0x00000400)) {
                        m <<= 1;
                        e -= 1;
                    }
                    e += 1;
                    m &= ~0x00000400;
                }
            } else if (e == 31) {
                //Inf
                if (m == 0) {
                    return (s << 31) | 0x7f800000;
                } else//NaN
                 {
                    return (s << 31) | 0x7f800000 | (m << 13);
                }
            }
            e = e + (127 - 15);
            m = m << 13;
            return (s << 31) | (e << 23) | m;
        }
        bf.halfToFloatI = halfToFloatI;
    })(akra.bf || (akra.bf = {}));
    var bf = akra.bf;
})(akra || (akra = {}));
var akra;
(function (akra) {
    // #include "Singleton.ts"
    (function (util) {
        /* extends Singleton*/
        var Logger = (function () {
            function Logger() {
                //super();
                this._eUnknownCode = 0;
                this._sUnknownMessage = "Unknown code";
                this._eLogLevel = akra.ELogLevel.ALL;
                this._pGeneralRoutineMap = {};
                this._pCurrentSourceLocation = {
                    file: "",
                    line: 0
                };
                this._pLastLogEntity = {
                    code: this._eUnknownCode,
                    location: this._pCurrentSourceLocation,
                    message: this._sUnknownMessage,
                    info: null
                };
                this._pCodeFamilyMap = {};
                this._pCodeFamilyList = [];
                this._pCodeInfoMap = {};
                this._pCodeFamilyRoutineDMap = {};
                this._nFamilyGenerator = 0;
            }
            Logger._sDefaultFamilyName = "CodeFamily";
            Logger.prototype.init = function () {
                //TODO: Load file
                return true;
            };
            Logger.prototype.setLogLevel = function (eLevel) {
                this._eLogLevel = eLevel;
            };
            Logger.prototype.getLogLevel = function () {
                return this._eLogLevel;
            };
            Logger.prototype.registerCode = function (eCode, sMessage) {
                if (typeof sMessage === "undefined") { sMessage = this._sUnknownMessage; }
                if (((((this)._pCodeInfoMap[(eCode)]) !== undefined))) {
                    return false;
                }
                var sFamilyName = this.getFamilyName(eCode);
                if (((sFamilyName) === null)) {
                    return false;
                }
                var pCodeInfo = {
                    code: eCode,
                    message: sMessage,
                    familyName: sFamilyName
                };
                this._pCodeInfoMap[eCode] = pCodeInfo;
                return true;
            };
            Logger.prototype.setUnknownCode = function (eCode, sMessage) {
                this._eUnknownCode = eCode;
                this._sUnknownMessage = sMessage;
            };
            Logger.prototype.registerCodeFamily = function (eCodeMin, eCodeMax, sFamilyName) {
                if (!((sFamilyName) !== undefined)) {
                    sFamilyName = this.generateFamilyName();
                }
                if (((((this)._pCodeFamilyMap[(sFamilyName)]) !== undefined))) {
                    return false;
                }
                if (!this.isValidCodeInterval(eCodeMin, eCodeMax)) {
                    return false;
                }
                var pCodeFamily = {
                    familyName: sFamilyName,
                    codeMin: eCodeMin,
                    codeMax: eCodeMax
                };
                this._pCodeFamilyMap[sFamilyName] = pCodeFamily;
                this._pCodeFamilyList.push(pCodeFamily);
                return true;
            };
            Logger.prototype.getFamilyName = function (eCode) {
                var i = 0;
                var pCodeFamilyList = this._pCodeFamilyList;
                var pCodeFamily;
                for(i = 0; i < pCodeFamilyList.length; i++) {
                    pCodeFamily = pCodeFamilyList[i];
                    if (pCodeFamily.codeMin <= eCode && pCodeFamily.codeMax >= eCode) {
                        return pCodeFamily.familyName;
                    }
                }
                return null;
            };
            Logger.prototype.setCodeFamilyRoutine = function () {
                var sFamilyName = null;
                var fnLogRoutine = null;
                var eLevel = akra.ELogLevel.LOG;
                if ((typeof (arguments[0]) === "number")) {
                    sFamilyName = this.getFamilyName(arguments[0]);
                    fnLogRoutine = arguments[1];
                    eLevel = arguments[2];
                    if (((sFamilyName) === null)) {
                        return false;
                    }
                } else if ((typeof (arguments[0]) === "string")) {
                    sFamilyName = arguments[0];
                    fnLogRoutine = arguments[1];
                    eLevel = arguments[2];
                }
                if (!((((this)._pCodeFamilyMap[(sFamilyName)]) !== undefined))) {
                    return false;
                }
                var pCodeFamilyRoutineMap = this._pCodeFamilyRoutineDMap[sFamilyName];
                if (!((pCodeFamilyRoutineMap) !== undefined)) {
                    pCodeFamilyRoutineMap = this._pCodeFamilyRoutineDMap[sFamilyName] = {};
                }
                if (((((eLevel) & (/*checked (origin: akra)>>*/akra.ELogLevel.LOG)) == (/*checked (origin: akra)>>*/akra.ELogLevel.LOG)))) {
                    pCodeFamilyRoutineMap[akra.ELogLevel.LOG] = fnLogRoutine;
                }
                if (((((eLevel) & (/*checked (origin: akra)>>*/akra.ELogLevel.INFORMATION)) == (/*checked (origin: akra)>>*/akra.ELogLevel.INFORMATION)))) {
                    pCodeFamilyRoutineMap[akra.ELogLevel.INFORMATION] = fnLogRoutine;
                }
                if (((((eLevel) & (/*checked (origin: akra)>>*/akra.ELogLevel.WARNING)) == (/*checked (origin: akra)>>*/akra.ELogLevel.WARNING)))) {
                    pCodeFamilyRoutineMap[akra.ELogLevel.WARNING] = fnLogRoutine;
                }
                if (((((eLevel) & (/*checked (origin: akra)>>*/akra.ELogLevel.ERROR)) == (/*checked (origin: akra)>>*/akra.ELogLevel.ERROR)))) {
                    pCodeFamilyRoutineMap[akra.ELogLevel.ERROR] = fnLogRoutine;
                }
                if (((((eLevel) & (/*checked (origin: akra)>>*/akra.ELogLevel.CRITICAL)) == (/*checked (origin: akra)>>*/akra.ELogLevel.CRITICAL)))) {
                    pCodeFamilyRoutineMap[akra.ELogLevel.CRITICAL] = fnLogRoutine;
                }
                return true;
            };
            Logger.prototype.setLogRoutine = function (fnLogRoutine, eLevel) {
                if (((((eLevel) & (/*checked (origin: akra)>>*/akra.ELogLevel.LOG)) == (/*checked (origin: akra)>>*/akra.ELogLevel.LOG)))) {
                    this._pGeneralRoutineMap[akra.ELogLevel.LOG] = fnLogRoutine;
                }
                if (((((eLevel) & (/*checked (origin: akra)>>*/akra.ELogLevel.INFORMATION)) == (/*checked (origin: akra)>>*/akra.ELogLevel.INFORMATION)))) {
                    this._pGeneralRoutineMap[akra.ELogLevel.INFORMATION] = fnLogRoutine;
                }
                if (((((eLevel) & (/*checked (origin: akra)>>*/akra.ELogLevel.WARNING)) == (/*checked (origin: akra)>>*/akra.ELogLevel.WARNING)))) {
                    this._pGeneralRoutineMap[akra.ELogLevel.WARNING] = fnLogRoutine;
                }
                if (((((eLevel) & (/*checked (origin: akra)>>*/akra.ELogLevel.ERROR)) == (/*checked (origin: akra)>>*/akra.ELogLevel.ERROR)))) {
                    this._pGeneralRoutineMap[akra.ELogLevel.ERROR] = fnLogRoutine;
                }
                if (((((eLevel) & (/*checked (origin: akra)>>*/akra.ELogLevel.CRITICAL)) == (/*checked (origin: akra)>>*/akra.ELogLevel.CRITICAL)))) {
                    this._pGeneralRoutineMap[akra.ELogLevel.CRITICAL] = fnLogRoutine;
                }
            };
            Logger.prototype.setSourceLocation = function () {
                var sFile;
                var iLine;
                if (arguments.length === 2) {
                    sFile = arguments[0];
                    iLine = arguments[1];
                } else {
                    if (((arguments[0]) !== undefined) && !(((arguments[0]) === null))) {
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
            Logger.prototype.log = function () {
                var pArgs = [];
                for (var _i = 0; _i < (arguments.length - 0); _i++) {
                    pArgs[_i] = arguments[_i + 0];
                }
                if (!((((this._eLogLevel) & (/*checked (origin: akra)>>*/akra.ELogLevel.LOG)) == (/*checked (origin: akra)>>*/akra.ELogLevel.LOG)))) {
                    return;
                }
                var fnLogRoutine = this._pGeneralRoutineMap[akra.ELogLevel.LOG];
                if (!((fnLogRoutine) !== undefined)) {
                    return;
                }
                var pLogEntity = this._pLastLogEntity;
                pLogEntity.code = this._eUnknownCode;
                pLogEntity.location = this._pCurrentSourceLocation;
                pLogEntity.info = pArgs;
                pLogEntity.message = this._sUnknownMessage;
                fnLogRoutine.call(null, pLogEntity);
            };
            Logger.prototype.info = function () {
                if (!((((this._eLogLevel) & (/*checked (origin: akra)>>*/akra.ELogLevel.INFORMATION)) == (/*checked (origin: akra)>>*/akra.ELogLevel.INFORMATION)))) {
                    return;
                }
                var pLogEntity;
                var fnLogRoutine;
                pLogEntity = this.prepareLogEntity.apply(this, arguments);
                fnLogRoutine = this.getCodeRoutineFunc(pLogEntity.code, akra.ELogLevel.INFORMATION);
                if (((fnLogRoutine) === null)) {
                    return;
                }
                fnLogRoutine.call(null, pLogEntity);
            };
            Logger.prototype.warning = function () {
                if (!((((this._eLogLevel) & (/*checked (origin: akra)>>*/akra.ELogLevel.WARNING)) == (/*checked (origin: akra)>>*/akra.ELogLevel.WARNING)))) {
                    return;
                }
                var pLogEntity;
                var fnLogRoutine;
                pLogEntity = this.prepareLogEntity.apply(this, arguments);
                fnLogRoutine = this.getCodeRoutineFunc(pLogEntity.code, akra.ELogLevel.WARNING);
                if (((fnLogRoutine) === null)) {
                    return;
                }
                fnLogRoutine.call(null, pLogEntity);
            };
            Logger.prototype.error = function () {
                if (!((((this._eLogLevel) & (/*checked (origin: akra)>>*/akra.ELogLevel.ERROR)) == (/*checked (origin: akra)>>*/akra.ELogLevel.ERROR)))) {
                    return;
                }
                var pLogEntity;
                var fnLogRoutine;
                pLogEntity = this.prepareLogEntity.apply(this, arguments);
                fnLogRoutine = this.getCodeRoutineFunc(pLogEntity.code, akra.ELogLevel.ERROR);
                if (((fnLogRoutine) === null)) {
                    return;
                }
                fnLogRoutine.call(null, pLogEntity);
            };
            Logger.prototype.criticalError = function () {
                var pLogEntity;
                var fnLogRoutine;
                pLogEntity = this.prepareLogEntity.apply(this, arguments);
                fnLogRoutine = this.getCodeRoutineFunc(pLogEntity.code, akra.ELogLevel.CRITICAL);
                var sSystemMessage = "A Critical error has occured! Code: " + pLogEntity.code.toString();
                if (((((this._eLogLevel) & (/*checked (origin: akra)>>*/akra.ELogLevel.CRITICAL)) == (/*checked (origin: akra)>>*/akra.ELogLevel.CRITICAL))) && !((fnLogRoutine) === null)) {
                    fnLogRoutine.call(null, pLogEntity);
                }
                alert(sSystemMessage);
                throw new Error(sSystemMessage);
            };
            Logger.prototype.assert = function () {
                var bCondition = arguments[0];
                if (!bCondition) {
                    var pLogEntity;
                    var fnLogRoutine;
                    var pArgs = [];
                    for(var i = 1; i < arguments.length; i++) {
                        pArgs[i - 1] = arguments[i];
                    }
                    pLogEntity = this.prepareLogEntity.apply(this, pArgs);
                    fnLogRoutine = this.getCodeRoutineFunc(pLogEntity.code, akra.ELogLevel.CRITICAL);
                    var sSystemMessage = "A error has occured! Code: " + pLogEntity.code.toString() + "\n Accept to exit, refuse to continue.";
                    if (((((this._eLogLevel) & (/*checked (origin: akra)>>*/akra.ELogLevel.CRITICAL)) == (/*checked (origin: akra)>>*/akra.ELogLevel.CRITICAL))) && !((fnLogRoutine) === null)) {
                        fnLogRoutine.call(null, pLogEntity);
                    }
                    if (confirm(sSystemMessage)) {
                        throw new Error(sSystemMessage);
                    }
                }
            };
            Logger.prototype.generateFamilyName = function () {
                var sSuffix = (this._nFamilyGenerator++);
                var sName = Logger._sDefaultFamilyName + sSuffix;
                if (((((this)._pCodeFamilyMap[(sName)]) !== undefined))) {
                    return this.generateFamilyName();
                } else {
                    return sName;
                }
            };
            Logger.prototype.isValidCodeInterval = function (eCodeMin, eCodeMax) {
                if (eCodeMin > eCodeMax) {
                    return false;
                }
                var i = 0;
                var pCodeFamilyList = this._pCodeFamilyList;
                var pCodeFamily;
                for(i = 0; i < pCodeFamilyList.length; i++) {
                    pCodeFamily = pCodeFamilyList[i];
                    if ((pCodeFamily.codeMin <= eCodeMin && pCodeFamily.codeMax >= eCodeMin) || (pCodeFamily.codeMin <= eCodeMax && pCodeFamily.codeMax >= eCodeMax)) {
                        return false;
                    }
                }
                return true;
            };
            Logger.prototype.isUsedFamilyName = /** @inline */function (sFamilyName) {
                return ((this._pCodeFamilyMap[sFamilyName]) !== undefined);
            };
            Logger.prototype.isUsedCode = /** @inline */function (eCode) {
                return ((this._pCodeInfoMap[eCode]) !== undefined);
            };
            Logger.prototype.isLogEntity = function (pObj) {
                if (akra.isObject(pObj) && ((pObj.code) !== undefined) && ((pObj.location) !== undefined)) {
                    return true;
                }
                return false;
            };
            Logger.prototype.isLogCode = /** @inline */function (eCode) {
                return (typeof (eCode) === "number");
            };
            Logger.prototype.prepareLogEntity = function () {
                var eCode = this._eUnknownCode;
                var sMessage = this._sUnknownMessage;
                var pInfo = null;
                if (arguments.length === 1 && this.isLogEntity(arguments[0])) {
                    var pEntity = arguments[0];
                    eCode = pEntity.code;
                    pInfo = pEntity.info;
                    this.setSourceLocation(pEntity.location);
                    if (!((pEntity.message) !== undefined)) {
                        var pCodeInfo = this._pCodeInfoMap[eCode];
                        if (((pCodeInfo) !== undefined)) {
                            sMessage = pCodeInfo.message;
                        }
                    }
                } else {
                    if (((typeof ((arguments[0])) === "number"))) {
                        eCode = arguments[0];
                        if (arguments.length > 1) {
                            pInfo = new Array(arguments.length - 1);
                            var i = 0;
                            for(i = 0; i < pInfo.length; i++) {
                                pInfo[i] = arguments[i + 1];
                            }
                        }
                    } else {
                        eCode = this._eUnknownCode;
                        // if(arguments.length > 0){
                        pInfo = new Array(arguments.length);
                        var i = 0;
                        for(i = 0; i < pInfo.length; i++) {
                            pInfo[i] = arguments[i];
                        }
                        // }
                        // else {
                        //     pInfo = null;
                        // }
                                            }
                    var pCodeInfo = this._pCodeInfoMap[eCode];
                    if (((pCodeInfo) !== undefined)) {
                        sMessage = pCodeInfo.message;
                    }
                }
                var pLogEntity = this._pLastLogEntity;
                pLogEntity.code = eCode;
                pLogEntity.location = this._pCurrentSourceLocation;
                pLogEntity.message = sMessage;
                pLogEntity.info = pInfo;
                return pLogEntity;
            };
            Logger.prototype.getCodeRoutineFunc = function (eCode, eLevel) {
                var pCodeInfo = this._pCodeInfoMap[eCode];
                var fnLogRoutine;
                if (!((pCodeInfo) !== undefined)) {
                    fnLogRoutine = this._pGeneralRoutineMap[eLevel];
                    return ((fnLogRoutine) !== undefined) ? fnLogRoutine : null;
                }
                var pCodeFamilyRoutineMap = this._pCodeFamilyRoutineDMap[pCodeInfo.familyName];
                if (!((pCodeFamilyRoutineMap) !== undefined) || !((pCodeFamilyRoutineMap[eLevel]) !== undefined)) {
                    fnLogRoutine = this._pGeneralRoutineMap[eLevel];
                    return ((fnLogRoutine) !== undefined) ? fnLogRoutine : null;
                }
                fnLogRoutine = pCodeFamilyRoutineMap[eLevel];
                return fnLogRoutine;
            };
            return Logger;
        })();
        util.Logger = Logger;        
    })(akra.util || (akra.util = {}));
    var util = akra.util;
})(akra || (akra = {}));
var akra;
(function (akra) {
    (function (util) {
        util.logger = new util.Logger();
        util.logger.init();
        util.logger.setUnknownCode(0, "Unknown code.");
        util.logger.setLogLevel(akra.ELogLevel.ALL);
        //Default code families
        util.logger.registerCodeFamily(0, 100, "SystemCodes");
        util.logger.registerCodeFamily(2000, 2199, "ParserSyntaxErrors");
        util.logger.registerCodeFamily(2200, 2500, "EffectSyntaxErrors");
        //Default log routines
        function sourceLocationToString(pLocation) {
            var pDate = new Date();
            var sTime = pDate.getHours() + ":" + pDate.getMinutes() + "." + pDate.getSeconds();
            var sLocation = "[" + pLocation.file + ":" + pLocation.line.toString() + " " + sTime + "]: ";
            return sLocation;
        }
        function logRoutine(pLogEntity) {
            var pArgs = pLogEntity.info;
            var sLocation = sourceLocationToString(pLogEntity.location);
            if ((typeof (pArgs[0]) === "string")) {
                pArgs[0] = sLocation + " " + pArgs[0];
            } else {
                pArgs.unshift(sLocation);
            }
            console["log"].apply(console, pArgs);
        }
        function warningRoutine(pLogEntity) {
            var pArgs = pLogEntity.info;
            var sCodeInfo = "Code: " + pLogEntity.code.toString() + ".";
            var sLocation = sourceLocationToString(pLogEntity.location);
            if ((typeof (pArgs[0]) === "string")) {
                pArgs[0] = sLocation + " " + sCodeInfo + " " + pArgs[0];
            } else {
                pArgs.unshift(sLocation + " " + sCodeInfo);
            }
            console["warn"].apply(console, pArgs);
        }
        function errorRoutine(pLogEntity) {
            var pArgs = pLogEntity.info;
            var sMessage = pLogEntity.message;
            var sCodeInfo = "Error code: " + pLogEntity.code.toString() + ".";
            var sLocation = sourceLocationToString(pLogEntity.location);
            if ((typeof (pArgs[0]) === "string")) {
                pArgs[0] = sLocation + " " + sCodeInfo + " " + sMessage + " " + pArgs[0];
            } else {
                pArgs.unshift(sLocation + " " + sCodeInfo + " " + sMessage);
            }
            console["error"].apply(console, pArgs);
        }
        util.logger.setLogRoutine(logRoutine, akra.ELogLevel.LOG | akra.ELogLevel.INFORMATION);
        util.logger.setLogRoutine(warningRoutine, akra.ELogLevel.WARNING);
        util.logger.setLogRoutine(errorRoutine, akra.ELogLevel.ERROR | akra.ELogLevel.CRITICAL);
    })(akra.util || (akra.util = {}));
    var util = akra.util;
})(akra || (akra = {}));
var akra;
(function (akra) {
    akra.logger = akra.util.logger;
})(akra || (akra = {}));
var akra;
(function (akra) {
    (function (ENodeCreateMode) {
        ENodeCreateMode._map = [];
        ENodeCreateMode._map[0] = "k_Default";
        ENodeCreateMode.k_Default = 0;
        ENodeCreateMode._map[1] = "k_Necessary";
        ENodeCreateMode.k_Necessary = 1;
        ENodeCreateMode._map[2] = "k_Not";
        ENodeCreateMode.k_Not = 2;
    })(akra.ENodeCreateMode || (akra.ENodeCreateMode = {}));
    var ENodeCreateMode = akra.ENodeCreateMode;
    (function (EParserCode) {
        EParserCode._map = [];
        EParserCode._map[0] = "k_Pause";
        EParserCode.k_Pause = 0;
        EParserCode._map[1] = "k_Ok";
        EParserCode.k_Ok = 1;
        EParserCode._map[2] = "k_Error";
        EParserCode.k_Error = 2;
    })(akra.EParserCode || (akra.EParserCode = {}));
    var EParserCode = akra.EParserCode;
    (function (EParserType) {
        EParserType._map = [];
        EParserType._map[0] = "k_LR0";
        EParserType.k_LR0 = 0;
        EParserType._map[1] = "k_LR1";
        EParserType.k_LR1 = 1;
        EParserType._map[2] = "k_LALR";
        EParserType.k_LALR = 2;
    })(akra.EParserType || (akra.EParserType = {}));
    var EParserType = akra.EParserType;
    (function (EParseMode) {
        EParseMode._map = [];
        EParseMode.k_AllNode = 0x0001;
        EParseMode.k_Negate = 0x0002;
        EParseMode.k_Add = 0x0004;
        EParseMode.k_Optimize = 0x0008;
        EParseMode.k_DebugMode = 0x0010;
    })(akra.EParseMode || (akra.EParseMode = {}));
    var EParseMode = akra.EParseMode;
    (function (ETokenType) {
        ETokenType._map = [];
        ETokenType.k_NumericLiteral = 1;
        ETokenType._map[2] = "k_CommentLiteral";
        ETokenType.k_CommentLiteral = 2;
        ETokenType._map[3] = "k_StringLiteral";
        ETokenType.k_StringLiteral = 3;
        ETokenType._map[4] = "k_PunctuatorLiteral";
        ETokenType.k_PunctuatorLiteral = 4;
        ETokenType._map[5] = "k_WhitespaceLiteral";
        ETokenType.k_WhitespaceLiteral = 5;
        ETokenType._map[6] = "k_IdentifierLiteral";
        ETokenType.k_IdentifierLiteral = 6;
        ETokenType._map[7] = "k_KeywordLiteral";
        ETokenType.k_KeywordLiteral = 7;
        ETokenType._map[8] = "k_Unknown";
        ETokenType.k_Unknown = 8;
        ETokenType._map[9] = "k_End";
        ETokenType.k_End = 9;
    })(akra.ETokenType || (akra.ETokenType = {}));
    var ETokenType = akra.ETokenType;
    (function (EOperationType) {
        EOperationType._map = [];
        EOperationType.k_Error = 100;
        EOperationType._map[101] = "k_Shift";
        EOperationType.k_Shift = 101;
        EOperationType._map[102] = "k_Reduce";
        EOperationType.k_Reduce = 102;
        EOperationType._map[103] = "k_Success";
        EOperationType.k_Success = 103;
        EOperationType._map[104] = "k_Pause";
        EOperationType.k_Pause = 104;
        EOperationType._map[105] = "k_Ok";
        EOperationType.k_Ok = 105;
    })(akra.EOperationType || (akra.EOperationType = {}));
    var EOperationType = akra.EOperationType;
})(akra || (akra = {}));
var akra;
(function (akra) {
    (function (util) {
        akra.logger.registerCode(2001, "Grammar not LALR(1)! Cannot to generate syntax table. Add operation error.\n" + "Conflict in state with index: {stateIndex}. With grammar symbol: \"{grammarSymbol}\"\n" + "Old operation: {oldOperation}\n" + "New operation: {newOperation}\n" + "For more info init parser in debug-mode and see syntax table and list of states.");
        akra.logger.registerCode(2002, "Grammar not LALR(1)! Cannot to generate syntax table. Add state link error.\n" + "Conflict in state with index: {stateIndex}. With grammar symbol: \"{grammarSymbol}\"\n" + "Old next state: {oldNextStateIndex}\n" + "New next state: {newNextStateIndex}\n" + "For more info init parser in debug-mode and see syntax table and list of states.");
        akra.logger.registerCode(2003, "Grammar error. Can`t generate rules from grammar\n" + "Unexpected symbol: {unexpectedSymbol}\n" + "Expected: {expectedSymbol}");
        akra.logger.registerCode(2004, "Grammar error. Empty additional function name.");
        akra.logger.registerCode(2005, "Grammar error. Bad keyword: {badKeyword}\n" + "All keyword must be define in lexer rule block.");
        akra.logger.registerCode(2051, "Syntax error during parsing. Token: {tokenValue}\n" + "Line: {line}. Column: {column}.");
        akra.logger.registerCode(2101, "Unknown token: {tokenValue}");
        akra.logger.registerCode(2102, "Bad token: {tokenValue}");
        function sourceLocationToString(pLocation) {
            var sLocation = "[" + pLocation.file + ":" + pLocation.line.toString() + "]: ";
            return sLocation;
        }
        function syntaxErrorLogRoutine(pLogEntity) {
            var sPosition = sourceLocationToString(pLogEntity.location);
            var sError = "Code: " + pLogEntity.code.toString() + ". ";
            var pParseMessage = pLogEntity.message.split(/\{(\w+)\}/);
            var pInfo = pLogEntity.info;
            for(var i = 0; i < pParseMessage.length; i++) {
                if (((pInfo[pParseMessage[i]]) !== undefined)) {
                    pParseMessage[i] = pInfo[pParseMessage[i]];
                }
            }
            var sMessage = sPosition + sError + pParseMessage.join("");
            console["error"].call(console, sMessage);
        }
        akra.logger.setCodeFamilyRoutine("ParserSyntaxErrors", syntaxErrorLogRoutine, akra.ELogLevel.ERROR);
    })(akra.util || (akra.util = {}));
    var util = akra.util;
})(akra || (akra = {}));
var akra;
(function (akra) {
    (function (util) {
        var Item = (function () {
            function Item(pRule, iPos, pExpected) {
                this._pRule = pRule;
                this._iPos = iPos;
                this._iIndex = 0;
                this._pState = null;
                this._isNewExpected = true;
                this._iLength = 0;
                this._pExpected = {};
                if (arguments.length === 3) {
                    var i = null;
                    for(i in arguments[2]) {
                        this.addExpected(i);
                    }
                }
            }
            Object.defineProperty(Item.prototype, "rule", {
                get: /** @inline */function () {
                    return this._pRule;
                },
                set: /** @inline */function (pRule) {
                    this._pRule = pRule;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Item.prototype, "position", {
                get: /** @inline */function () {
                    return this._iPos;
                },
                set: /** @inline */function (iPos) {
                    this._iPos = iPos;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Item.prototype, "state", {
                get: /** @inline */function () {
                    return this._pState;
                },
                set: /** @inline */function (pState) {
                    this._pState = pState;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Item.prototype, "index", {
                get: /** @inline */function () {
                    return this._iIndex;
                },
                set: /** @inline */function (iIndex) {
                    this._iIndex = iIndex;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Item.prototype, "expectedSymbols", {
                get: /** @inline */function () {
                    return this._pExpected;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Item.prototype, "length", {
                get: /** @inline */function () {
                    return this._iLength;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Item.prototype, "isNewExpected", {
                get: /** @inline */function () {
                    return this._isNewExpected;
                },
                set: /** @inline */function (_isNewExpected) {
                    this._isNewExpected = _isNewExpected;
                },
                enumerable: true,
                configurable: true
            });
            Item.prototype.isEqual = function (pItem, eType) {
                if (typeof eType === "undefined") { eType = akra.EParserType.k_LR0; }
                if (eType === akra.EParserType.k_LR0) {
                    return (this._pRule === pItem.rule && this._iPos === pItem.position);
                } else if (eType === akra.EParserType.k_LR1) {
                    if (!(this._pRule === pItem.rule && this._iPos === pItem.position && this._iLength === (pItem).length)) {
                        return false;
                    }
                    var i = null;
                    for(i in this._pExpected) {
                        if (!(pItem).isExpected(i)) {
                            return false;
                        }
                    }
                    return true;
                }
            };
            Item.prototype.isParentItem = function (pItem) {
                return (this._pRule === pItem.rule && this._iPos === pItem.position + 1);
            };
            Item.prototype.isChildItem = function (pItem) {
                return (this._pRule === pItem.rule && this._iPos === pItem.position - 1);
            };
            Item.prototype.mark = function () {
                var pRight = this._pRule.right;
                if (this._iPos === pRight.length) {
                    return "END";
                }
                return pRight[this._iPos];
            };
            Item.prototype.end = /** @inline */function () {
                return this._pRule.right[this._pRule.right.length - 1] || "EMPTY";
            };
            Item.prototype.nextMarked = /** @inline */function () {
                return this._pRule.right[this._iPos + 1] || "END";
            };
            Item.prototype.isExpected = /** @inline */function (sSymbol) {
                return !!(this._pExpected[sSymbol]);
            };
            Item.prototype.addExpected = function (sSymbol) {
                if (this._pExpected[sSymbol]) {
                    return false;
                }
                this._pExpected[sSymbol] = true;
                this._isNewExpected = true;
                this._iLength++;
                return true;
            };
            Item.prototype.toString = function () {
                var sMsg = this._pRule.left + " -> ";
                var sExpected = "";
                var pRight = this._pRule.right;
                for(var k = 0; k < pRight.length; k++) {
                    if (k === this._iPos) {
                        sMsg += ". ";
                    }
                    sMsg += pRight[k] + " ";
                }
                if (this._iPos === pRight.length) {
                    sMsg += ". ";
                }
                if (((this._pExpected) !== undefined)) {
                    sExpected = ", ";
                    for(var l in this._pExpected) {
                        sExpected += l + "/";
                    }
                    if (sExpected !== ", ") {
                        sMsg += sExpected;
                    }
                }
                sMsg = sMsg.slice(0, sMsg.length - 1);
                return sMsg;
            };
            return Item;
        })();        
        var State = (function () {
            function State() {
                this._pItemList = [];
                this._pNextStates = {};
                this._iIndex = 0;
                this._nBaseItems = 0;
            }
            Object.defineProperty(State.prototype, "items", {
                get: /** @inline */function () {
                    return this._pItemList;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(State.prototype, "numBaseItems", {
                get: /** @inline */function () {
                    return this._nBaseItems;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(State.prototype, "index", {
                get: /** @inline */function () {
                    return this._iIndex;
                },
                set: /** @inline */function (iIndex) {
                    this._iIndex = iIndex;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(State.prototype, "nextStates", {
                get: /** @inline */function () {
                    return this._pNextStates;
                },
                enumerable: true,
                configurable: true
            });
            State.prototype.hasItem = function (pItem, eType) {
                var i;
                var pItems = this._pItemList;
                for(i = 0; i < pItems.length; i++) {
                    if (pItems[i].isEqual(pItem, eType)) {
                        return pItems[i];
                    }
                }
                return null;
            };
            State.prototype.hasParentItem = function (pItem) {
                var i;
                var pItems = this._pItemList;
                for(i = 0; i < pItems.length; i++) {
                    if (pItems[i].isParentItem(pItem)) {
                        return pItems[i];
                    }
                }
                return null;
            };
            State.prototype.hasChildItem = function (pItem) {
                var i;
                var pItems = this._pItemList;
                for(i = 0; i < pItems.length; i++) {
                    if (pItems[i].isChildItem(pItem)) {
                        return pItems[i];
                    }
                }
                return null;
            };
            State.prototype.hasRule = function (pRule, iPos) {
                var i = 0;
                var pItemList = this._pItemList;
                var pItem;
                for(i = 0; i < this._nBaseItems; i++) {
                    pItem = pItemList[i];
                    if (pItem.rule === pRule && pItem.position === iPos) {
                        return true;
                    }
                }
                return false;
            };
            State.prototype.isEmpty = /** @inline */function () {
                return !(this._pItemList.length);
            };
            State.prototype.isEqual = function (pState, eType) {
                var pItemsA = this._pItemList;
                var pItemsB = pState.items;
                if (this._nBaseItems !== pState.numBaseItems) {
                    return false;
                }
                var nItems = this._nBaseItems;
                var i, j;
                var isEqual;
                for(i = 0; i < nItems; i++) {
                    isEqual = false;
                    for(j = 0; j < nItems; j++) {
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
            State.prototype.push = function (pItem) {
                if (this._pItemList.length === 0 || pItem.position > 0) {
                    this._nBaseItems += 1;
                }
                pItem.state = this;
                this._pItemList.push(pItem);
            };
            State.prototype.tryPush_LR0 = function (pRule, iPos) {
                var i;
                var pItems = this._pItemList;
                for(i = 0; i < pItems.length; i++) {
                    if (pItems[i].rule === pRule && pItems[i].position === iPos) {
                        return false;
                    }
                }
                var pItem = new Item(pRule, iPos);
                this.push(pItem);
                return true;
            };
            State.prototype.tryPush_LR = function (pRule, iPos, sExpectedSymbol) {
                var i;
                var pItems = (this._pItemList);
                for(i = 0; i < pItems.length; i++) {
                    if (pItems[i].rule === pRule && pItems[i].position === iPos) {
                        return pItems[i].addExpected(sExpectedSymbol);
                    }
                }
                var pExpected = {};
                pExpected[sExpectedSymbol] = true;
                var pItem = new Item(pRule, iPos, pExpected);
                this.push(pItem);
                return true;
            };
            State.prototype.getNextStateBySymbol = function (sSymbol) {
                if (((this._pNextStates[sSymbol]) !== undefined)) {
                    return this._pNextStates[sSymbol];
                } else {
                    return null;
                }
            };
            State.prototype.addNextState = function (sSymbol, pState) {
                if (((this._pNextStates[sSymbol]) !== undefined)) {
                    return false;
                } else {
                    this._pNextStates[sSymbol] = pState;
                    return true;
                }
            };
            State.prototype.deleteNotBase = /** @inline */function () {
                this._pItemList.length = this._nBaseItems;
            };
            State.prototype.toString = function (isBase) {
                var len = 0;
                var sMsg;
                var pItemList = this._pItemList;
                sMsg = "State " + this._iIndex + ":\n";
                len = isBase ? this._nBaseItems : pItemList.length;
                for(var j = 0; j < len; j++) {
                    sMsg += "\t\t";
                    sMsg += pItemList[j].toString();
                    sMsg += "\n";
                }
                return sMsg;
            };
            return State;
        })();        
        var ParseTree = (function () {
            function ParseTree() {
                this._pRoot = null;
                this._pNodes = [];
                this._pNodesCountStack = [];
                this._isOptimizeMode = false;
            }
            Object.defineProperty(ParseTree.prototype, "root", {
                get: /** @inline */function () {
                    return this._pRoot;
                },
                set: /** @inline */function (pRoot) {
                    this._pRoot = pRoot;
                },
                enumerable: true,
                configurable: true
            });
            ParseTree.prototype.setRoot = function () {
                this._pRoot = this._pNodes.pop();
            };
            ParseTree.prototype.setOptimizeMode = function (isOptimize) {
                this._isOptimizeMode = isOptimize;
            };
            ParseTree.prototype.addNode = function (pNode) {
                this._pNodes.push(pNode);
                this._pNodesCountStack.push(1);
            };
            ParseTree.prototype.reduceByRule = function (pRule, eCreate) {
                if (typeof eCreate === "undefined") { eCreate = akra.ENodeCreateMode.k_Default; }
                var iReduceCount = 0;
                var pNodesCountStack = this._pNodesCountStack;
                var pNode;
                var iRuleLength = pRule.right.length;
                var pNodes = this._pNodes;
                var nOptimize = this._isOptimizeMode ? 1 : 0;
                while(iRuleLength) {
                    iReduceCount += pNodesCountStack.pop();
                    iRuleLength--;
                }
                if ((eCreate === akra.ENodeCreateMode.k_Default && iReduceCount > nOptimize) || (eCreate === akra.ENodeCreateMode.k_Necessary)) {
                    pNode = {
                        name: pRule.left,
                        children: null,
                        parent: null,
                        value: "",
                        isAnalyzed: false,
                        position: this._pNodes.length
                    };
                    while(iReduceCount) {
                        this.addLink(pNode, pNodes.pop());
                        iReduceCount -= 1;
                    }
                    pNodes.push(pNode);
                    pNodesCountStack.push(1);
                } else {
                    pNodesCountStack.push(iReduceCount);
                }
            };
            ParseTree.prototype.toString = function () {
                if (this._pRoot) {
                    return this.toStringNode(this._pRoot);
                } else {
                    return "";
                }
            };
            ParseTree.prototype.clone = function () {
                var pTree = new ParseTree();
                (pTree._pRoot = (this.cloneNode(this._pRoot)));
                return pTree;
            };
            ParseTree.prototype.getNodes = /** @inline */function () {
                return this._pNodes;
            };
            ParseTree.prototype.getLastNode = /** @inline */function () {
                return this._pNodes[this._pNodes.length - 1];
            };
            ParseTree.prototype.addLink = function (pParent, pNode) {
                if (!pParent.children) {
                    pParent.children = [];
                }
                pParent.children.push(pNode);
                pNode.parent = pParent;
            };
            ParseTree.prototype.cloneNode = function (pNode) {
                var pNewNode;
                pNewNode = {
                    name: pNode.name,
                    value: pNode.value,
                    children: null,
                    parent: null,
                    isAnalyzed: pNode.isAnalyzed,
                    position: pNode.position
                };
                var pChildren = pNode.children;
                for(var i = 0; pChildren && i < pChildren.length; i++) {
                    this.addLink(pNewNode, this.cloneNode(pChildren[i]));
                }
                return pNewNode;
            };
            ParseTree.prototype.toStringNode = function (pNode, sPadding) {
                if (typeof sPadding === "undefined") { sPadding = ""; }
                var sRes = sPadding + "{\n";
                var sOldPadding = sPadding;
                var sDefaultPadding = "  ";
                sPadding += sDefaultPadding;
                if (pNode.value) {
                    sRes += sPadding + "name : \"" + pNode.name + "\"" + ",\n";
                    sRes += sPadding + "value : \"" + pNode.value + "\"" + "\n";
                } else {
                    sRes += sPadding + "name : \"" + pNode.name + "\"" + "\n";
                    sRes += sPadding + "children : [";
                    var pChildren = pNode.children;
                    if (pChildren) {
                        sRes += "\n";
                        sPadding += sDefaultPadding;
                        for(var i = pChildren.length - 1; i >= 0; i--) {
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
            return ParseTree;
        })();
        util.ParseTree = ParseTree;        
        var Lexer = (function () {
            function Lexer(pParser) {
                this._iLineNumber = 0;
                this._iColumnNumber = 0;
                this._sSource = "";
                this._iIndex = 0;
                this._pParser = pParser;
                this._pPunctuatorsMap = {};
                this._pKeywordsMap = {};
                this._pPunctuatorsFirstSymbols = {};
            }
            Lexer.prototype.addPunctuator = function (sValue, sName) {
                if (sName === undefined && sValue.length === 1) {
                    sName = "T_PUNCTUATOR_" + sValue.charCodeAt(0);
                }
                this._pPunctuatorsMap[sValue] = sName;
                this._pPunctuatorsFirstSymbols[sValue[0]] = true;
                return sName;
            };
            Lexer.prototype.addKeyword = function (sValue, sName) {
                this._pKeywordsMap[sValue] = sName;
                return sName;
            };
            Lexer.prototype.getTerminalValueByName = function (sName) {
                var sValue = null;
                for(sValue in this._pPunctuatorsMap) {
                    if (this._pPunctuatorsMap[sValue] === sName) {
                        return sValue;
                    }
                }
                for(sValue in this._pKeywordsMap) {
                    if (this._pKeywordsMap[sValue] === sName) {
                        return sValue;
                    }
                }
                return sName;
            };
            Lexer.prototype.init = function (sSource) {
                this._sSource = sSource;
                this._iLineNumber = 0;
                this._iColumnNumber = 0;
                this._iIndex = 0;
            };
            Lexer.prototype.getNextToken = function () {
                var ch = ((this)._sSource[(this)._iIndex]);
                if (!ch) {
                    return {
                        name: "$",
                        value: "$",
                        start: this._iColumnNumber,
                        end: this._iColumnNumber,
                        line: this._iLineNumber
                    };
                }
                var eType = this.identityTokenType();
                var pToken;
                switch(eType) {
                    case akra.ETokenType.k_NumericLiteral:
                        pToken = this.scanNumber();
                        break;
                    case akra.ETokenType.k_CommentLiteral:
                        this.scanComment();
                        pToken = this.getNextToken();
                        break;
                    case akra.ETokenType.k_StringLiteral:
                        pToken = this.scanString();
                        break;
                    case akra.ETokenType.k_PunctuatorLiteral:
                        pToken = this.scanPunctuator();
                        break;
                    case akra.ETokenType.k_IdentifierLiteral:
                        pToken = this.scanIdentifier();
                        break;
                    case akra.ETokenType.k_WhitespaceLiteral:
                        this.scanWhiteSpace();
                        pToken = this.getNextToken();
                        break;
                    default:
                        this._error(2101, {
                            name: "UNNOWN",
                            value: ch + this._sSource[this._iIndex + 1],
                            start: this._iColumnNumber,
                            end: this._iColumnNumber + 1,
                            line: this._iLineNumber
                        });
                }
                return pToken;
            };
            Lexer.prototype._getIndex = /** @inline */function () {
                return this._iIndex;
            };
            Lexer.prototype._setSource = /** @inline */function (sSource) {
                this._sSource = sSource;
            };
            Lexer.prototype._setIndex = /** @inline */function (iIndex) {
                this._iIndex = iIndex;
            };
            Lexer.prototype._error = function (eCode, pToken) {
                var pLocation = {
                    file: this._pParser.getParseFileName(),
                    line: this._iLineNumber
                };
                var pInfo = {
                    tokenValue: pToken.value,
                    tokenType: pToken.type
                };
                var pLogEntity = {
                    code: eCode,
                    info: pInfo,
                    location: pLocation
                };
                akra.logger["error"](pLogEntity);
                throw new Error(eCode.toString());
            };
            Lexer.prototype.identityTokenType = function () {
                if (this.isIdentifierStart()) {
                    return akra.ETokenType.k_IdentifierLiteral;
                }
                if (this.isWhiteSpaceStart()) {
                    return akra.ETokenType.k_WhitespaceLiteral;
                }
                if (this.isStringStart()) {
                    return akra.ETokenType.k_StringLiteral;
                }
                if (this.isCommentStart()) {
                    return akra.ETokenType.k_CommentLiteral;
                }
                if (this.isNumberStart()) {
                    return akra.ETokenType.k_NumericLiteral;
                }
                if (this.isPunctuatorStart()) {
                    return akra.ETokenType.k_PunctuatorLiteral;
                }
                return akra.ETokenType.k_Unknown;
            };
            Lexer.prototype.isNumberStart = function () {
                var ch = ((this)._sSource[(this)._iIndex]);
                if ((ch >= '0') && (ch <= '9')) {
                    return true;
                }
                var ch1 = ((this)._sSource[(this)._iIndex + 1]);
                if (ch === "." && (ch1 >= '0') && (ch1 <= '9')) {
                    return true;
                }
                return false;
            };
            Lexer.prototype.isCommentStart = function () {
                var ch = ((this)._sSource[(this)._iIndex]);
                var ch1 = ((this)._sSource[(this)._iIndex + 1]);
                if (ch === "/" && (ch1 === "/" || ch1 === "*")) {
                    return true;
                }
                return false;
            };
            Lexer.prototype.isStringStart = function () {
                var ch = ((this)._sSource[(this)._iIndex]);
                if (ch === "\"" || ch === "'") {
                    return true;
                }
                return false;
            };
            Lexer.prototype.isPunctuatorStart = function () {
                var ch = ((this)._sSource[(this)._iIndex]);
                if (this._pPunctuatorsFirstSymbols[ch]) {
                    return true;
                }
                return false;
            };
            Lexer.prototype.isWhiteSpaceStart = function () {
                var ch = ((this)._sSource[(this)._iIndex]);
                if (ch === ' ' || ch === '\n' || ch === '\r' || ch === '\t') {
                    return true;
                }
                return false;
            };
            Lexer.prototype.isIdentifierStart = function () {
                var ch = ((this)._sSource[(this)._iIndex]);
                if ((ch === '_') || (ch >= 'a' && ch <= 'z') || (ch >= 'A' && ch <= 'Z')) {
                    return true;
                }
                return false;
            };
            Lexer.prototype.isLineTerminator = function (sSymbol) {
                return (sSymbol === '\n' || sSymbol === '\r' || sSymbol === '\u2028' || sSymbol === '\u2029');
            };
            Lexer.prototype.isWhiteSpace = function (sSymbol) {
                return (sSymbol === ' ') || (sSymbol === '\t');
            };
            Lexer.prototype.isKeyword = /** @inline */function (sValue) {
                return !!(this._pKeywordsMap[sValue]);
            };
            Lexer.prototype.isPunctuator = /** @inline */function (sValue) {
                return !!(this._pPunctuatorsMap[sValue]);
            };
            Lexer.prototype.nextChar = /** @inline */function () {
                return this._sSource[this._iIndex + 1];
            };
            Lexer.prototype.currentChar = /** @inline */function () {
                return this._sSource[this._iIndex];
            };
            Lexer.prototype.readNextChar = /** @inline */function () {
                this._iIndex++;
                this._iColumnNumber++;
                return this._sSource[this._iIndex];
            };
            Lexer.prototype.scanString = function () {
                var chFirst = ((this)._sSource[(this)._iIndex]);
                var sValue = chFirst;
                var ch = null;
                var chPrevious = chFirst;
                var isGoodFinish = false;
                var iStart = this._iColumnNumber;
                while(true) {
                    ch = /*not inlined, because supportes only single statement functions(cur. st. count: 4)*/this.readNextChar();
                    if (!ch) {
                        break;
                    }
                    sValue += ch;
                    if (ch === chFirst && chPrevious !== '\\') {
                        isGoodFinish = true;
                        /*not inlined, because supportes only single statement functions(cur. st. count: 4)*/this.readNextChar();
                        break;
                    }
                    chPrevious = ch;
                }
                if (isGoodFinish) {
                    return {
                        name: "T_STRING",
                        value: sValue,
                        start: iStart,
                        end: this._iColumnNumber - 1,
                        line: this._iLineNumber
                    };
                } else {
                    if (!ch) {
                        ch = "EOF";
                    }
                    sValue += ch;
                    this._error(2102, {
                        type: akra.ETokenType.k_StringLiteral,
                        value: sValue,
                        start: iStart,
                        end: this._iColumnNumber,
                        line: this._iLineNumber
                    });
                    return null;
                }
            };
            Lexer.prototype.scanPunctuator = function () {
                var sValue = ((this)._sSource[(this)._iIndex]);
                var ch;
                var iStart = this._iColumnNumber;
                while(true) {
                    ch = /*not inlined, because supportes only single statement functions(cur. st. count: 4)*/this.readNextChar();
                    if (ch) {
                        sValue += ch;
                        this._iColumnNumber++;
                        if (!(!!((this)._pPunctuatorsMap[(sValue)]))) {
                            sValue = sValue.slice(0, sValue.length - 1);
                            break;
                        }
                    } else {
                        break;
                    }
                }
                return {
                    name: this._pPunctuatorsMap[sValue],
                    value: sValue,
                    start: iStart,
                    end: this._iColumnNumber - 1,
                    line: this._iLineNumber
                };
            };
            Lexer.prototype.scanNumber = function () {
                var ch = ((this)._sSource[(this)._iIndex]);
                var sValue = "";
                var isFloat = false;
                var chPrevious = ch;
                var isGoodFinish = false;
                var iStart = this._iColumnNumber;
                var isE = false;
                if (ch === '.') {
                    sValue += 0;
                    isFloat = true;
                }
                sValue += ch;
                while(true) {
                    ch = /*not inlined, because supportes only single statement functions(cur. st. count: 4)*/this.readNextChar();
                    if (ch === '.') {
                        if (isFloat) {
                            break;
                        } else {
                            isFloat = true;
                        }
                    } else if (ch === 'e') {
                        if (isE) {
                            break;
                        } else {
                            isE = true;
                        }
                    } else if (((ch === '+' || ch === '-') && chPrevious === 'e')) {
                        sValue += ch;
                        chPrevious = ch;
                        continue;
                    } else if (ch === 'f' && isFloat) {
                        ch = /*not inlined, because supportes only single statement functions(cur. st. count: 4)*/this.readNextChar();
                        if ((ch >= 'a' && ch <= 'z') || (ch >= 'A' && ch <= 'Z')) {
                            break;
                        }
                        isGoodFinish = true;
                        break;
                    } else if ((ch >= 'a' && ch <= 'z') || (ch >= 'A' && ch <= 'Z')) {
                        break;
                    } else if (!((ch >= '0') && (ch <= '9')) || !ch) {
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
                } else {
                    if (!ch) {
                        ch = "EOF";
                    }
                    sValue += ch;
                    this._error(2102, {
                        type: akra.ETokenType.k_NumericLiteral,
                        value: sValue,
                        start: iStart,
                        end: this._iColumnNumber,
                        line: this._iLineNumber
                    });
                    return null;
                }
            };
            Lexer.prototype.scanIdentifier = function () {
                var ch = ((this)._sSource[(this)._iIndex]);
                var sValue = ch;
                var iStart = this._iColumnNumber;
                var isGoodFinish = false;
                while(true) {
                    ch = /*not inlined, because supportes only single statement functions(cur. st. count: 4)*/this.readNextChar();
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
                    if ((!!((this)._pKeywordsMap[(sValue)]))) {
                        return {
                            name: this._pKeywordsMap[sValue],
                            value: sValue,
                            start: iStart,
                            end: this._iColumnNumber - 1,
                            line: this._iLineNumber
                        };
                    } else {
                        var sName = this._pParser.isTypeId(sValue) ? "T_TYPE_ID" : "T_NON_TYPE_ID";
                        return {
                            name: sName,
                            value: sValue,
                            start: iStart,
                            end: this._iColumnNumber - 1,
                            line: this._iLineNumber
                        };
                    }
                } else {
                    if (!ch) {
                        ch = "EOF";
                    }
                    sValue += ch;
                    this._error(2102, {
                        type: akra.ETokenType.k_IdentifierLiteral,
                        value: sValue,
                        start: iStart,
                        end: this._iColumnNumber,
                        line: this._iLineNumber
                    });
                    return null;
                }
            };
            Lexer.prototype.scanWhiteSpace = function () {
                var ch = ((this)._sSource[(this)._iIndex]);
                while(true) {
                    if (!ch) {
                        break;
                    }
                    if (this.isLineTerminator(ch)) {
                        if (ch === "\r" && ((this)._sSource[(this)._iIndex + 1]) === "\n") {
                            this._iLineNumber--;
                        }
                        this._iLineNumber++;
                        ch = /*not inlined, because supportes only single statement functions(cur. st. count: 4)*/this.readNextChar();
                        this._iColumnNumber = 0;
                        continue;
                    } else if (ch === '\t') {
                        this._iColumnNumber += 3;
                    } else if (ch !== ' ') {
                        break;
                    }
                    ch = /*not inlined, because supportes only single statement functions(cur. st. count: 4)*/this.readNextChar();
                }
                return true;
            };
            Lexer.prototype.scanComment = function () {
                var sValue = ((this)._sSource[(this)._iIndex]);
                var ch = /*not inlined, because supportes only single statement functions(cur. st. count: 4)*/this.readNextChar();
                sValue += ch;
                if (ch === '/') {
                    //Line Comment
                    while(true) {
                        ch = /*not inlined, because supportes only single statement functions(cur. st. count: 4)*/this.readNextChar();
                        if (!ch) {
                            break;
                        }
                        if (this.isLineTerminator(ch)) {
                            if (ch === "\r" && ((this)._sSource[(this)._iIndex + 1]) === "\n") {
                                this._iLineNumber--;
                            }
                            this._iLineNumber++;
                            /*not inlined, because supportes only single statement functions(cur. st. count: 4)*/this.readNextChar();
                            this._iColumnNumber = 0;
                            break;
                        }
                        sValue += ch;
                    }
                    return true;
                } else {
                    //Multiline Comment
                    var chPrevious = ch;
                    var isGoodFinish = false;
                    var iStart = this._iColumnNumber;
                    while(true) {
                        ch = /*not inlined, because supportes only single statement functions(cur. st. count: 4)*/this.readNextChar();
                        if (!ch) {
                            break;
                        }
                        sValue += ch;
                        if (ch === '/' && chPrevious === '*') {
                            isGoodFinish = true;
                            /*not inlined, because supportes only single statement functions(cur. st. count: 4)*/this.readNextChar();
                            break;
                        }
                        if (this.isLineTerminator(ch)) {
                            if (ch === "\r" && ((this)._sSource[(this)._iIndex + 1]) === "\n") {
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
                            ch = "EOF";
                        }
                        sValue += ch;
                        this._error(2102, {
                            type: akra.ETokenType.k_CommentLiteral,
                            value: sValue,
                            start: iStart,
                            end: this._iColumnNumber,
                            line: this._iLineNumber
                        });
                    }
                }
            };
            return Lexer;
        })();        
        var Parser = (function () {
            function Parser() {
                this._sSource = "";
                this._iIndex = 0;
                this._pSyntaxTree = null;
                this._pTypeIdMap = null;
                this._pLexer = null;
                this._pStack = [];
                this._pToken = null;
                this._fnFinishCallback = null;
                this._pCaller = null;
                this._pSymbolMap = {
                    "$": true
                };
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
                this._eType = akra.EParserType.k_LR0;
                this._pRuleCreationModeMap = null;
                this._eParseMode = akra.EParseMode.k_AllNode;
                // this._isSync = false;
                this._pStatesTempMap = null;
                this._pBaseItemList = null;
                this._pExpectedExtensionDMap = null;
                this._sFileName = "stdin";
                ;
            }
            Parser.prototype.isTypeId = function (sValue) {
                return !!(this._pTypeIdMap[sValue]);
            };
            Parser.prototype.returnCode = function (pNode) {
                if (pNode) {
                    if (pNode.value) {
                        return pNode.value + " ";
                    } else if (pNode.children) {
                        var sCode = "";
                        var i = 0;
                        for(i = pNode.children.length - 1; i >= 0; i--) {
                            sCode += this.returnCode(pNode.children[i]);
                        }
                        return sCode;
                    }
                }
                return "";
            };
            Parser.prototype.init = function (sGrammar, eMode, eType) {
                if (typeof eMode === "undefined") { eMode = akra.EParseMode.k_AllNode; }
                if (typeof eType === "undefined") { eType = akra.EParserType.k_LALR; }
                try  {
                    this._eType = eType;
                    this._pLexer = new Lexer(this);
                    this._eParseMode = eMode;
                    this.generateRules(sGrammar);
                    this.buildSyntaxTable();
                    this.generateFunctionByStateMap();
                    if (!((((eMode) & (/*checked (origin: akra)>>*/akra.EParseMode.k_DebugMode)) == (/*checked (origin: akra)>>*/akra.EParseMode.k_DebugMode)))) {
                        this.clearMem();
                    }
                    return true;
                } catch (e) {
 {
                        util.logger.setSourceLocation("../../../inc/util/Parser.ts", 1331);
                        util.logger.log(e.stack);
                    }
                    ;
                    // error("Could`not initialize parser. Error with code has occurred: " + e.message + ". See log for more info.");
                    return false;
                }
            };
            Parser.prototype.parse = function (sSource, fnFinishCallback, pCaller) {
                if (typeof fnFinishCallback === "undefined") { fnFinishCallback = null; }
                if (typeof pCaller === "undefined") { pCaller = null; }
                try  {
                    this.defaultInit();
                    this._sSource = sSource;
                    this._pLexer.init(sSource);
                    //this._isSync = isSync;
                    this._fnFinishCallback = fnFinishCallback;
                    this._pCaller = pCaller;
                    var pTree = this._pSyntaxTree;
                    var pStack = this._pStack;
                    var pSyntaxTable = this._pSyntaxTable;
                    var isStop = false;
                    var isError = false;
                    var isPause = false;
                    var pToken = this.readToken();
                    var pOperation;
                    var iRuleLength;
                    var eAdditionalOperationCode;
                    var iStateIndex = 0;
                    while(!isStop) {
                        pOperation = pSyntaxTable[pStack[pStack.length - 1]][pToken.name];
                        if (((pOperation) !== undefined)) {
                            switch(pOperation.type) {
                                case akra.EOperationType.k_Success:
                                    isStop = true;
                                    break;
                                case akra.EOperationType.k_Shift:
                                    iStateIndex = pOperation.index;
                                    pStack.push(iStateIndex);
                                    pTree.addNode(pToken);
                                    eAdditionalOperationCode = this.operationAdditionalAction(iStateIndex, pToken.name);
                                    if (eAdditionalOperationCode === akra.EOperationType.k_Error) {
                                        isError = true;
                                        isStop = true;
                                    } else if (eAdditionalOperationCode === akra.EOperationType.k_Pause) {
                                        this._pToken = null;
                                        isStop = true;
                                        isPause = true;
                                    } else if (eAdditionalOperationCode === akra.EOperationType.k_Ok) {
                                        pToken = this.readToken();
                                    }
                                    break;
                                case akra.EOperationType.k_Reduce:
                                    iRuleLength = pOperation.rule.right.length;
                                    pStack.length -= iRuleLength;
                                    iStateIndex = pSyntaxTable[pStack[pStack.length - 1]][pOperation.rule.left].index;
                                    pStack.push(iStateIndex);
                                    pTree.reduceByRule(pOperation.rule, this._pRuleCreationModeMap[pOperation.rule.left]);
                                    eAdditionalOperationCode = this.operationAdditionalAction(iStateIndex, pOperation.rule.left);
                                    if (eAdditionalOperationCode === akra.EOperationType.k_Error) {
                                        isError = true;
                                        isStop = true;
                                    } else if (eAdditionalOperationCode === akra.EOperationType.k_Pause) {
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
                    return akra.EParserCode.k_Error;
                }
                if (isPause) {
                    return akra.EParserCode.k_Pause;
                }
                if (!isError) {
                    pTree.setRoot();
                    if (!((this._fnFinishCallback) === null)) {
                        this._fnFinishCallback.call(this._pCaller, akra.EParserCode.k_Ok, this.getParseFileName());
                    }
                    this._sFileName = "stdin";
                    return akra.EParserCode.k_Ok;
                } else {
                    this._error(2051, pToken);
                    if (!((this._fnFinishCallback) === null)) {
                        this._fnFinishCallback.call(this._pCaller, akra.EParserCode.k_Error, this.getParseFileName());
                    }
                    this._sFileName = "stdin";
                    return akra.EParserCode.k_Error;
                }
            };
            Parser.prototype.setParseFileName = function (sFileName) {
                this._sFileName = sFileName;
            };
            Parser.prototype.getParseFileName = function () {
                return this._sFileName;
            };
            Parser.prototype.pause = function () {
                return akra.EParserCode.k_Pause;
            };
            Parser.prototype.resume = function () {
                return this.resumeParse();
            };
            Parser.prototype.printStates = function (isBaseOnly) {
                if (typeof isBaseOnly === "undefined") { isBaseOnly = true; }
                if (!((this._pStateList) !== undefined)) {
 {
                        util.logger.setSourceLocation("../../../inc/util/Parser.ts", 1470);
                        util.logger.log("It`s impossible to print states. You must init parser in debug-mode");
                    }
                    ;
                    return;
                }
                var sMsg = "\n" + this.statesToString(isBaseOnly);
 {
                    util.logger.setSourceLocation("../../../inc/util/Parser.ts", 1474);
                    util.logger.log(sMsg);
                }
                ;
            };
            Parser.prototype.printState = function (iStateIndex, isBaseOnly) {
                if (typeof isBaseOnly === "undefined") { isBaseOnly = true; }
                if (!((this._pStateList) !== undefined)) {
 {
                        util.logger.setSourceLocation("../../../inc/util/Parser.ts", 1479);
                        util.logger.log("It`s impossible to print states. You must init parser in debug-mode");
                    }
                    ;
                    return;
                }
                var pState = this._pStateList[iStateIndex];
                if (!((pState) !== undefined)) {
 {
                        util.logger.setSourceLocation("../../../inc/util/Parser.ts", 1485);
                        util.logger.log("Can not print stete with index: " + iStateIndex.toString());
                    }
                    ;
                    return;
                }
                var sMsg = "\n" + pState.toString(isBaseOnly);
 {
                    util.logger.setSourceLocation("../../../inc/util/Parser.ts", 1490);
                    util.logger.log(sMsg);
                }
                ;
            };
            Parser.prototype.getGrammarSymbols = function () {
                return this._pGrammarSymbols;
            };
            Parser.prototype.getSyntaxTree = /** @inline */function () {
                return this._pSyntaxTree;
            };
            Parser.prototype._saveState = function () {
                return {
                    source: this._sSource,
                    index: this._pLexer._getIndex(),
                    fileName: this._sFileName,
                    tree: this._pSyntaxTree,
                    types: this._pTypeIdMap,
                    stack: this._pStack,
                    token: this._pToken,
                    fnCallback: this._fnFinishCallback,
                    caller: this._pCaller
                };
            };
            Parser.prototype._loadState = function (pState) {
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
            Parser.prototype.addAdditionalFunction = /**@protected*/ function (sFuncName, fnRuleFunction) {
                if (((this._pAdditionalFunctionsMap) === null)) {
                    this._pAdditionalFunctionsMap = {};
                }
                this._pAdditionalFunctionsMap[sFuncName] = fnRuleFunction;
            };
            Parser.prototype.addTypeId = /**@protected*/ function (sIdentifier) {
                if (((this._pTypeIdMap) === null)) {
                    this._pTypeIdMap = {};
                }
                this._pTypeIdMap[sIdentifier] = true;
            };
            Parser.prototype.defaultInit = /**@protected*/ function () {
                this._iIndex = 0;
                this._pStack = [
                    0
                ];
                this._pSyntaxTree = new ParseTree();
                this._pTypeIdMap = {};
                this._pSyntaxTree.setOptimizeMode(((((this._eParseMode) & (/*checked (origin: akra)>>*/akra.EParseMode.k_Optimize)) == (/*checked (origin: akra)>>*/akra.EParseMode.k_Optimize))));
            };
            Parser.prototype._error = function (eCode, pErrorInfo) {
                var pLocation = {};
                var pInfo = {
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
                var pLogEntity = {
                    code: eCode,
                    info: pInfo,
                    location: pLocation
                };
                if (eCode === 2051) {
                    var pToken = pErrorInfo;
                    var iLine = pToken.line;
                    var iColumn = pToken.start;
                    pInfo.tokenValue = pToken.value;
                    pInfo.line = iLine;
                    pInfo.column = iColumn;
                    pLocation.file = this.getParseFileName();
                    pLocation.line = iLine;
                } else if (eCode === 2001) {
                    var iStateIndex = pErrorInfo.stateIndex;
                    var sSymbol = pErrorInfo.grammarSymbol;
                    var pOldOperation = pErrorInfo.oldOperation;
                    var pNewOperation = pErrorInfo.newOperation;
                    pInfo.stateIndex = iStateIndex;
                    pInfo.grammarSymbol = sSymbol;
                    pInfo.oldOperation = this.operationToString(pOldOperation);
                    pInfo.newOperation = this.operationToString(pNewOperation);
                    pLocation.file = "GRAMMAR";
                    pLocation.line = 0;
                } else if (eCode === 2002) {
                    var iStateIndex = pErrorInfo.stateIndex;
                    var sSymbol = pErrorInfo.grammarSymbol;
                    var iOldNextStateIndex = pErrorInfo.oldNextStateIndex;
                    var iNewNextStateIndex = pErrorInfo.newNextStateIndex;
                    pInfo.stateIndex = iStateIndex;
                    pInfo.grammarSymbol = sSymbol;
                    pInfo.oldNextStateIndex = iOldNextStateIndex;
                    pInfo.newNextStateIndex = iNewNextStateIndex;
                    pLocation.file = "GRAMMAR";
                    pLocation.line = 0;
                } else if (eCode === 2003) {
                    var iLine = pErrorInfo.grammarLine;
                    var sExpectedSymbol = pErrorInfo.expectedSymbol;
                    var sUnexpectedSymbol = pErrorInfo.unexpectedSymbol;
                    pInfo.expectedSymbol = sExpectedSymbol;
                    pInfo.unexpectedSymbol = sExpectedSymbol;
                    pLocation.file = "GRAMMAR";
                    pLocation.line = iLine || 0;
                } else if (eCode === 2004) {
                    var iLine = pErrorInfo.grammarLine;
                    pLocation.file = "GRAMMAR";
                    pLocation.line = iLine || 0;
                } else if (eCode === 2005) {
                    var iLine = pErrorInfo.grammarLine;
                    var sBadKeyword = pErrorInfo.badKeyword;
                    pInfo.badKeyword = sBadKeyword;
                    pLocation.file = "GRAMMAR";
                    pLocation.line = iLine || 0;
                }
                akra.logger["error"](pLogEntity);
                throw new Error(eCode.toString());
            };
            Parser.prototype.clearMem = function () {
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
            Parser.prototype.hasState = function (pState, eType) {
                var pStateList = this._pStateList;
                var i = 0;
                for(i = 0; i < pStateList.length; i++) {
                    if (pStateList[i].isEqual(pState, eType)) {
                        return pStateList[i];
                    }
                }
                return null;
            };
            Parser.prototype.isTerminal = function (sSymbol) {
                return !(this._pRulesDMap[sSymbol]);
            };
            Parser.prototype.pushState = function (pState) {
                pState.index = this._pStateList.length;
                this._pStateList.push(pState);
            };
            Parser.prototype.pushBaseItem = function (pItem) {
                pItem.index = this._pBaseItemList.length;
                this._pBaseItemList.push(pItem);
            };
            Parser.prototype.tryAddState = function (pState, eType) {
                var pRes = this.hasState(pState, eType);
                if (((pRes) === null)) {
                    if (eType === akra.EParserType.k_LR0) {
                        var pItems = pState.items;
                        for(var i = 0; i < pItems.length; i++) {
                            this.pushBaseItem(pItems[i]);
                        }
                    }
                    this.pushState(pState);
                    this.closure(pState, eType);
                    return pState;
                }
                return pRes;
            };
            Parser.prototype.hasEmptyRule = function (sSymbol) {
                if (this.isTerminal(sSymbol)) {
                    return false;
                }
                var pRulesDMap = this._pRulesDMap;
                for(var i in pRulesDMap[sSymbol]) {
                    if (pRulesDMap[sSymbol][i].right.length === 0) {
                        return true;
                    }
                }
                return false;
            };
            Parser.prototype.pushInSyntaxTable = function (iIndex, sSymbol, pOperation) {
                var pSyntaxTable = this._pSyntaxTable;
                if (!pSyntaxTable[iIndex]) {
                    pSyntaxTable[iIndex] = {};
                }
                if (((pSyntaxTable[iIndex][sSymbol]) !== undefined)) {
                    this._error(2001, {
                        stateIndex: iIndex,
                        grammarSymbol: this.convertGrammarSymbol(sSymbol),
                        oldOperation: this._pSyntaxTable[iIndex][sSymbol],
                        newOperation: pOperation
                    });
                }
                pSyntaxTable[iIndex][sSymbol] = pOperation;
            };
            Parser.prototype.addStateLink = function (pState, pNextState, sSymbol) {
                var isAddState = pState.addNextState(sSymbol, pNextState);
                if (!isAddState) {
                    this._error(2002, {
                        stateIndex: pState.index,
                        oldNextStateIndex: pState.getNextStateBySymbol(sSymbol),
                        newNextStateIndex: pNextState.index,
                        grammarSymbol: this.convertGrammarSymbol(sSymbol)
                    });
                }
            };
            Parser.prototype.firstTerminal = function (sSymbol) {
                if (this.isTerminal(sSymbol)) {
                    return null;
                }
                if (((this._pFirstTerminalsDMap[sSymbol]) !== undefined)) {
                    return this._pFirstTerminalsDMap[sSymbol];
                }
                var i = null, j = 0, k = null;
                var pRulesMap = this._pRulesDMap[sSymbol];
                var pTempRes = {};
                var pRes;
                var pRight;
                var isFinish;
                pRes = this._pFirstTerminalsDMap[sSymbol] = {};
                if (this.hasEmptyRule(sSymbol)) {
                    pRes["EMPTY"] = true;
                }
                for(i in pRulesMap) {
                    isFinish = false;
                    pRight = pRulesMap[i].right;
                    for(j = 0; j < pRight.length; j++) {
                        if (pRight[j] === sSymbol) {
                            if (pRes["EMPTY"]) {
                                continue;
                            }
                            isFinish = true;
                            break;
                        }
                        pTempRes = this.firstTerminal(pRight[j]);
                        if (((pTempRes) === null)) {
                            pRes[pRight[j]] = true;
                        } else {
                            for(k in pTempRes) {
                                pRes[k] = true;
                            }
                        }
                        if (!this.hasEmptyRule(pRight[j])) {
                            isFinish = true;
                            break;
                        }
                    }
                    if (!isFinish) {
                        pRes["EMPTY"] = true;
                    }
                }
                return pRes;
            };
            Parser.prototype.followTerminal = function (sSymbol) {
                if (((this._pFollowTerminalsDMap[sSymbol]) !== undefined)) {
                    return this._pFollowTerminalsDMap[sSymbol];
                }
                var i = null, j = null, k = 0, l = 0, m = null;
                var pRulesDMap = this._pRulesDMap;
                var pTempRes;
                var pRes;
                var pRight;
                var isFinish;
                pRes = this._pFollowTerminalsDMap[sSymbol] = {};
                for(i in pRulesDMap) {
                    for(j in pRulesDMap[i]) {
                        pRight = pRulesDMap[i][j].right;
                        for(k = 0; k < pRight.length; k++) {
                            if (pRight[k] === sSymbol) {
                                if (k === pRight.length - 1) {
                                    pTempRes = this.followTerminal(pRulesDMap[i][j].left);
                                    for(m in pTempRes) {
                                        pRes[m] = true;
                                    }
                                } else {
                                    isFinish = false;
                                    for(l = k + 1; l < pRight.length; l++) {
                                        pTempRes = this.firstTerminal(pRight[l]);
                                        if (((pTempRes) === null)) {
                                            pRes[pRight[l]] = true;
                                            isFinish = true;
                                            break;
                                        } else {
                                            for(m in pTempRes) {
                                                pRes[m] = true;
                                            }
                                        }
                                        if (!pTempRes["EMPTY"]) {
                                            isFinish = true;
                                            break;
                                        }
                                    }
                                    if (!isFinish) {
                                        pTempRes = this.followTerminal(pRulesDMap[i][j].left);
                                        for(m in pTempRes) {
                                            pRes[m] = true;
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
                return pRes;
            };
            Parser.prototype.firstTerminalForSet = function (pSet, pExpected) {
                var i = 0, j = null;
                var pTempRes;
                var pRes = {};
                var isEmpty;
                for(i = 0; i < pSet.length; i++) {
                    pTempRes = this.firstTerminal(pSet[i]);
                    if (((pTempRes) === null)) {
                        pRes[pSet[i]] = true;
                    }
                    isEmpty = false;
                    for(j in pTempRes) {
                        if (j === "EMPTY") {
                            isEmpty = true;
                            continue;
                        }
                        pRes[j] = true;
                    }
                    if (!isEmpty) {
                        return pRes;
                    }
                }
                for(j in pExpected) {
                    pRes[j] = true;
                }
                return pRes;
            };
            Parser.prototype.generateRules = function (sGrammarSource) {
                var pAllRuleList = sGrammarSource.split(/\r?\n/);
                var pTempRule;
                var pRule;
                var isLexerBlock = false;
                this._pRulesDMap = {};
                this._pAdditionalFuncInfoList = [];
                this._pRuleCreationModeMap = {};
                this._pGrammarSymbols = {};
                var i = 0, j = 0;
                var isAllNodeMode = ((((this._eParseMode) & (/*checked (origin: akra)>>*/akra.EParseMode.k_AllNode)) == (/*checked (origin: akra)>>*/akra.EParseMode.k_AllNode)));
                var isNegateMode = ((((this._eParseMode) & (/*checked (origin: akra)>>*/akra.EParseMode.k_Negate)) == (/*checked (origin: akra)>>*/akra.EParseMode.k_Negate)));
                var isAddMode = ((((this._eParseMode) & (/*checked (origin: akra)>>*/akra.EParseMode.k_Add)) == (/*checked (origin: akra)>>*/akra.EParseMode.k_Add)));
                var pSymbolsWithNodeMap = this._pRuleCreationModeMap;
                for(i = 0; i < pAllRuleList.length; i++) {
                    if (pAllRuleList[i] === "" || pAllRuleList[i] === "\r") {
                        continue;
                    }
                    pTempRule = pAllRuleList[i].split(/\s* \s*/);
                    if (isLexerBlock) {
                        if ((pTempRule.length === 3 || (pTempRule.length === 4 && pTempRule[3] === "")) && ((pTempRule[2][0] === "\"" || pTempRule[2][0] === "'") && pTempRule[2].length > 3)) {
                            //TERMINALS
                            if (pTempRule[2][0] !== pTempRule[2][pTempRule[2].length - 1]) {
                                this._error(2003, {
                                    unexpectedSymbol: pTempRule[2][pTempRule[2].length - 1],
                                    expectedSymbol: pTempRule[2][0],
                                    grammarLine: i
                                });
                            }
                            pTempRule[2] = pTempRule[2].slice(1, pTempRule[2].length - 1);
                            var ch = pTempRule[2][0];
                            var sName;
                            if ((ch === "_") || (ch >= "a" && ch <= "z") || (ch >= "A" && ch <= "Z")) {
                                sName = this._pLexer.addKeyword(pTempRule[2], pTempRule[0]);
                            } else {
                                sName = this._pLexer.addPunctuator(pTempRule[2], pTempRule[0]);
                            }
                            this._pGrammarSymbols[sName] = pTempRule[2];
                        }
                        continue;
                    }
                    if (pTempRule[0] === "--LEXER--") {
                        isLexerBlock = true;
                        continue;
                    }
                    //NON TERMNINAL RULES
                    if (((this._pRulesDMap[pTempRule[0]]) !== undefined) === false) {
                        this._pRulesDMap[pTempRule[0]] = {};
                    }
                    pRule = {
                        left: pTempRule[0],
                        right: [],
                        index: 0
                    };
                    this._pSymbolMap[pTempRule[0]] = true;
                    this._pGrammarSymbols[pTempRule[0]] = pTempRule[0];
                    if (isAllNodeMode) {
                        pSymbolsWithNodeMap[pTempRule[0]] = akra.ENodeCreateMode.k_Default;
                    } else if (isNegateMode && !((pSymbolsWithNodeMap[pTempRule[0]]) !== undefined)) {
                        pSymbolsWithNodeMap[pTempRule[0]] = akra.ENodeCreateMode.k_Default;
                    } else if (isAddMode && !((pSymbolsWithNodeMap[pTempRule[0]]) !== undefined)) {
                        pSymbolsWithNodeMap[pTempRule[0]] = akra.ENodeCreateMode.k_Not;
                    }
                    for(j = 2; j < pTempRule.length; j++) {
                        if (pTempRule[j] === "") {
                            continue;
                        }
                        if (pTempRule[j] === "--AN") {
                            if (isAddMode) {
                                pSymbolsWithNodeMap[pTempRule[0]] = akra.ENodeCreateMode.k_Necessary;
                            }
                            continue;
                        }
                        if (pTempRule[j] === "--NN") {
                            if (isNegateMode && !isAllNodeMode) {
                                pSymbolsWithNodeMap[pTempRule[0]] = akra.ENodeCreateMode.k_Not;
                            }
                            continue;
                        }
                        if (pTempRule[j] === "--F") {
                            if ((!pTempRule[j + 1] || pTempRule[j + 1].length === 0)) {
                                this._error(2004, {
                                    grammarLine: i
                                });
                            }
                            var pFuncInfo = {
                                name: pTempRule[j + 1],
                                position: pRule.right.length,
                                rule: pRule
                            };
                            this._pAdditionalFuncInfoList.push(pFuncInfo);
                            j++;
                            continue;
                        }
                        if (pTempRule[j][0] === "'" || pTempRule[j][0] === "\"") {
                            if (pTempRule[j].length !== 3) {
                                this._error(2005, {
                                    badKeyword: pTempRule[j],
                                    grammarLine: i
                                });
                            }
                            if (pTempRule[j][0] !== pTempRule[j][2]) {
                                this._error(2003, {
                                    unexpectedSymbol: pTempRule[j][2],
                                    expectedSymbol: pTempRule[j][0],
                                    grammarLine: i
                                });
                                //this._error("Can`t generate rules from grammar! Unexpected symbol! Must be");
                                                            }
                            var sName = this._pLexer.addPunctuator(pTempRule[j][1]);
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
            Parser.prototype.generateFunctionByStateMap = function () {
                if (((this._pAdditionalFunctionsMap) === null)) {
                    return;
                }
                var pStateList = this._pStateList;
                var pFuncInfoList = this._pAdditionalFuncInfoList;
                var pFuncInfo;
                var pRule;
                var iPos = 0;
                var pFunc;
                var sGrammarSymbol;
                var i = 0, j = 0;
                var pFuncByStateDMap = {};
                pFuncByStateDMap = this._pAdidtionalFunctByStateDMap = {};
                for(i = 0; i < pFuncInfoList.length; i++) {
                    pFuncInfo = pFuncInfoList[i];
                    pFunc = this._pAdditionalFunctionsMap[pFuncInfo.name];
                    if (!((pFunc) !== undefined)) {
                        continue;
                    }
                    pRule = pFuncInfo.rule;
                    iPos = pFuncInfo.position;
                    sGrammarSymbol = pRule.right[iPos - 1];
                    for(j = 0; j < pStateList.length; j++) {
                        if (pStateList[j].hasRule(pRule, iPos)) {
                            if (!((pFuncByStateDMap[pStateList[j].index]) !== undefined)) {
                                pFuncByStateDMap[pStateList[j].index] = {};
                            }
                            pFuncByStateDMap[pStateList[j].index][sGrammarSymbol] = pFunc;
                        }
                    }
                }
            };
            Parser.prototype.generateFirstState = function (eType) {
                if (eType === akra.EParserType.k_LR0) {
                    this.generateFirstState_LR0();
                } else {
                    this.generateFirstState_LR();
                }
            };
            Parser.prototype.generateFirstState_LR0 = function () {
                var pState = new State();
                var pItem = new Item(this._pRulesDMap["S"][0], 0);
                this.pushBaseItem(pItem);
                pState.push(pItem);
                this.closure_LR0(pState);
                this.pushState(pState);
            };
            Parser.prototype.generateFirstState_LR = function () {
                var pState = new State();
                var pExpected = {};
                pExpected["$"] = true;
                pState.push(new Item(this._pRulesDMap["S"][0], 0, pExpected));
                this.closure_LR(pState);
                this.pushState(pState);
            };
            Parser.prototype.closure = function (pState, eType) {
                if (eType === akra.EParserType.k_LR0) {
                    return this.closure_LR0(pState);
                } else {
                    this.closure_LR(pState);
                }
            };
            Parser.prototype.closure_LR0 = function (pState) {
                var pItemList = pState.items;
                var i = 0, j = null;
                var sSymbol;
                for(i = 0; i < pItemList.length; i++) {
                    sSymbol = pItemList[i].mark();
                    if (sSymbol !== "END" && (!this.isTerminal(sSymbol))) {
                        for(j in this._pRulesDMap[sSymbol]) {
                            pState.tryPush_LR0(this._pRulesDMap[sSymbol][j], 0);
                        }
                    }
                }
                return pState;
            };
            Parser.prototype.closure_LR = function (pState) {
                var pItemList = (pState.items);
                var i = 0, j = null, k = null;
                var sSymbol;
                var pSymbols;
                var pTempSet;
                var isNewExpected = false;
                while(true) {
                    if (i === pItemList.length) {
                        if (!isNewExpected) {
                            break;
                        }
                        i = 0;
                        isNewExpected = false;
                    }
                    sSymbol = pItemList[i].mark();
                    if (sSymbol !== "END" && (!this.isTerminal(sSymbol))) {
                        pTempSet = pItemList[i].rule.right.slice(pItemList[i].position + 1);
                        pSymbols = this.firstTerminalForSet(pTempSet, pItemList[i].expectedSymbols);
                        for(j in this._pRulesDMap[sSymbol]) {
                            for(k in pSymbols) {
                                if (pState.tryPush_LR(this._pRulesDMap[sSymbol][j], 0, k)) {
                                    isNewExpected = true;
                                }
                            }
                        }
                    }
                    i++;
                }
                return pState;
            };
            Parser.prototype.nexeState = function (pState, sSymbol, eType) {
                if (eType === akra.EParserType.k_LR0) {
                    return this.nextState_LR0(pState, sSymbol);
                } else {
                    return this.nextState_LR(pState, sSymbol);
                }
            };
            Parser.prototype.nextState_LR0 = function (pState, sSymbol) {
                var pItemList = pState.items;
                var i = 0;
                var pNewState = new State();
                for(i = 0; i < pItemList.length; i++) {
                    if (sSymbol === pItemList[i].mark()) {
                        pNewState.push(new Item(pItemList[i].rule, pItemList[i].position + 1));
                    }
                }
                return pNewState;
            };
            Parser.prototype.nextState_LR = function (pState, sSymbol) {
                var pItemList = pState.items;
                var i = 0;
                var pNewState = new State();
                for(i = 0; i < pItemList.length; i++) {
                    if (sSymbol === pItemList[i].mark()) {
                        pNewState.push(new Item(pItemList[i].rule, pItemList[i].position + 1, pItemList[i].expectedSymbols));
                    }
                }
                return pNewState;
            };
            Parser.prototype.deleteNotBaseItems = function () {
                var i = 0;
                for(i = 0; i < this._pStateList.length; i++) {
                    this._pStateList[i].deleteNotBase();
                }
            };
            Parser.prototype.closureForItem = function (pRule, iPos) {
                var sIndex = "";
                sIndex += pRule.index + "_" + iPos;
                var pState = this._pStatesTempMap[sIndex];
                if (((pState) !== undefined)) {
                    return pState;
                } else {
                    var pExpected = {};
                    pExpected["##"] = true;
                    pState = new State();
                    pState.push(new Item(pRule, iPos, pExpected));
                    this.closure_LR(pState);
                    this._pStatesTempMap[sIndex] = pState;
                    return pState;
                }
            };
            Parser.prototype.addLinkExpected = function (pItem, pItemX) {
                var pTable = this._pExpectedExtensionDMap;
                var iIndex = pItem.index;
                if (!((pTable[iIndex]) !== undefined)) {
                    pTable[iIndex] = {};
                }
                pTable[iIndex][pItemX.index] = true;
            };
            Parser.prototype.determineExpected = function (pTestState, sSymbol) {
                var pStateX = pTestState.getNextStateBySymbol(sSymbol);
                if (((pStateX) === null)) {
                    return;
                }
                var pItemListX = pStateX.items;
                var pItemList = pTestState.items;
                var pState;
                var pItem;
                var i = 0, j = 0, k = null;
                var nBaseItemTest = pTestState.numBaseItems;
                var nBaseItemX = pStateX.numBaseItems;
                for(i = 0; i < nBaseItemTest; i++) {
                    pState = this.closureForItem(pItemList[i].rule, pItemList[i].position);
                    for(j = 0; j < nBaseItemX; j++) {
                        pItem = pState.hasChildItem(pItemListX[j]);
                        if (pItem) {
                            var pExpected = pItem.expectedSymbols;
                            for(k in pExpected) {
                                if (k === "##") {
                                    this.addLinkExpected(pItemList[i], pItemListX[j]);
                                } else {
                                    pItemListX[j].addExpected(k);
                                }
                            }
                        }
                    }
                }
            };
            Parser.prototype.generateLinksExpected = function () {
                var i = 0, j = null;
                var pStates = this._pStateList;
                for(i = 0; i < pStates.length; i++) {
                    for(j in this._pSymbolMap) {
                        this.determineExpected(pStates[i], j);
                    }
                }
            };
            Parser.prototype.expandExpected = function () {
                var pItemList = this._pBaseItemList;
                var pTable = this._pExpectedExtensionDMap;
                var i = 0, j = null;
                var sSymbol = null;
                var isNewExpected = false;
                pItemList[0].addExpected("$");
                pItemList[0].isNewExpected = true;
                while(true) {
                    if (i === pItemList.length) {
                        if (!isNewExpected) {
                            break;
                        }
                        isNewExpected = false;
                        i = 0;
                    }
                    if (pItemList[i].isNewExpected) {
                        var pExpected = pItemList[i].expectedSymbols;
                        for(sSymbol in pExpected) {
                            for(j in pTable[i]) {
                                if (pItemList[j].addExpected(sSymbol)) {
                                    isNewExpected = true;
                                }
                            }
                        }
                    }
                    pItemList[i].isNewExpected = false;
                    i++;
                }
            };
            Parser.prototype.generateStates = function (eType) {
                if (eType === akra.EParserType.k_LR0) {
                    this.generateStates_LR0();
                } else if (eType === akra.EParserType.k_LR1) {
                    this.generateStates_LR();
                } else if (eType === akra.EParserType.k_LALR) {
                    this.generateStates_LALR();
                }
            };
            Parser.prototype.generateStates_LR0 = function () {
                this.generateFirstState_LR0();
                var i = 0;
                var pStateList = this._pStateList;
                var sSymbol = null;
                var pState;
                for(i = 0; i < pStateList.length; i++) {
                    for(sSymbol in this._pSymbolMap) {
                        pState = this.nextState_LR0(pStateList[i], sSymbol);
                        if (!pState.isEmpty()) {
                            pState = this.tryAddState(pState, akra.EParserType.k_LR0);
                            this.addStateLink(pStateList[i], pState, sSymbol);
                        }
                    }
                }
            };
            Parser.prototype.generateStates_LR = function () {
                this._pFirstTerminalsDMap = {};
                this.generateFirstState_LR();
                var i = 0;
                var pStateList = this._pStateList;
                var sSymbol = null;
                var pState;
                for(i = 0; i < pStateList.length; i++) {
                    for(sSymbol in this._pSymbolMap) {
                        pState = this.nextState_LR(pStateList[i], sSymbol);
                        if (!pState.isEmpty()) {
                            pState = this.tryAddState(pState, akra.EParserType.k_LR1);
                            this.addStateLink(pStateList[i], pState, sSymbol);
                        }
                    }
                }
            };
            Parser.prototype.generateStates_LALR = function () {
                this._pStatesTempMap = {};
                this._pBaseItemList = [];
                this._pExpectedExtensionDMap = {};
                this._pFirstTerminalsDMap = {};
                this.generateStates_LR0();
                this.deleteNotBaseItems();
                this.generateLinksExpected();
                this.expandExpected();
                var i = 0;
                var pStateList = this._pStateList;
                for(i = 0; i < pStateList.length; i++) {
                    this.closure_LR(pStateList[i]);
                }
            };
            Parser.prototype.calcBaseItem = function () {
                var num = 0;
                var i = 0;
                for(i = 0; i < this._pStateList.length; i++) {
                    num += this._pStateList[i].numBaseItems;
                }
                return num;
            };
            Parser.prototype.printExpectedTable = function () {
                var i = null, j = null;
                var sMsg = "";
                for(i in this._pExpectedExtensionDMap) {
                    sMsg += "State " + this._pBaseItemList[i].state.index + ":   ";
                    sMsg += this._pBaseItemList[i].toString() + "  |----->\n";
                    for(j in this._pExpectedExtensionDMap[i]) {
                        sMsg += "\t\t\t\t\t" + "State " + this._pBaseItemList[j].state.index + ":   ";
                        sMsg += this._pBaseItemList[j].toString() + "\n";
                    }
                    sMsg += "\n";
                }
                return sMsg;
            };
            Parser.prototype.addReducing = function (pState) {
                var i = 0, j = null;
                var pItemList = pState.items;
                for(i = 0; i < pItemList.length; i++) {
                    if (pItemList[i].mark() === "END") {
                        if (pItemList[i].rule.left === "S") {
                            this.pushInSyntaxTable(pState.index, "$", this._pSuccessOperation);
                        } else {
                            var pExpected = pItemList[i].expectedSymbols;
                            for(j in pExpected) {
                                this.pushInSyntaxTable(pState.index, j, this._pReduceOperationsMap[pItemList[i].rule.index]);
                            }
                        }
                    }
                }
            };
            Parser.prototype.addShift = function (pState) {
                var i = null;
                var pStateMap = pState.nextStates;
                for(i in pStateMap) {
                    this.pushInSyntaxTable(pState.index, i, this._pShiftOperationsMap[pStateMap[i].index]);
                }
            };
            Parser.prototype.buildSyntaxTable = function () {
                this._pStateList = [];
                var pStateList = this._pStateList;
                var pState;
                //Generate states
                this.generateStates(this._eType);
                //Init necessary properties
                this._pSyntaxTable = {};
                this._pReduceOperationsMap = {};
                this._pShiftOperationsMap = {};
                this._pSuccessOperation = {
                    type: akra.EOperationType.k_Success
                };
                var i = 0, j = null, k = null;
                for(i = 0; i < pStateList.length; i++) {
                    this._pShiftOperationsMap[pStateList[i].index] = {
                        type: akra.EOperationType.k_Shift,
                        index: pStateList[i].index
                    };
                }
                for(j in this._pRulesDMap) {
                    for(k in this._pRulesDMap[j]) {
                        this._pReduceOperationsMap[k] = {
                            type: akra.EOperationType.k_Reduce,
                            rule: this._pRulesDMap[j][k]
                        };
                    }
                }
                //Build syntax table
                for(var i = 0; i < pStateList.length; i++) {
                    pState = pStateList[i];
                    this.addReducing(pState);
                    this.addShift(pState);
                }
            };
            Parser.prototype.readToken = function () {
                return this._pLexer.getNextToken();
            };
            Parser.prototype.operationAdditionalAction = function (iStateIndex, sGrammarSymbol) {
                var pFuncDMap = this._pAdidtionalFunctByStateDMap;
                if (!((this._pAdidtionalFunctByStateDMap) === null) && ((pFuncDMap[iStateIndex]) !== undefined) && ((pFuncDMap[iStateIndex][sGrammarSymbol]) !== undefined)) {
                    return pFuncDMap[iStateIndex][sGrammarSymbol].call(this);
                }
                return akra.EOperationType.k_Ok;
            };
            Parser.prototype.resumeParse = function () {
                try  {
                    var pTree = this._pSyntaxTree;
                    var pStack = this._pStack;
                    var pSyntaxTable = this._pSyntaxTable;
                    var isStop = false;
                    var isError = false;
                    var isPause = false;
                    var pToken = ((this._pToken) === null) ? this.readToken() : this._pToken;
                    var pOperation;
                    var iRuleLength;
                    var eAdditionalOperationCode;
                    var iStateIndex = 0;
                    while(!isStop) {
                        pOperation = pSyntaxTable[pStack[pStack.length - 1]][pToken.name];
                        if (((pOperation) !== undefined)) {
                            switch(pOperation.type) {
                                case akra.EOperationType.k_Success:
                                    isStop = true;
                                    break;
                                case akra.EOperationType.k_Shift:
                                    iStateIndex = pOperation.index;
                                    pStack.push(iStateIndex);
                                    pTree.addNode(pToken);
                                    eAdditionalOperationCode = this.operationAdditionalAction(iStateIndex, pToken.name);
                                    if (eAdditionalOperationCode === akra.EOperationType.k_Error) {
                                        isError = true;
                                        isStop = true;
                                    } else if (eAdditionalOperationCode === akra.EOperationType.k_Pause) {
                                        this._pToken = null;
                                        isStop = true;
                                        isPause = true;
                                    } else if (eAdditionalOperationCode === akra.EOperationType.k_Ok) {
                                        pToken = this.readToken();
                                    }
                                    break;
                                case akra.EOperationType.k_Reduce:
                                    iRuleLength = pOperation.rule.right.length;
                                    pStack.length -= iRuleLength;
                                    iStateIndex = pSyntaxTable[pStack[pStack.length - 1]][pOperation.rule.left].index;
                                    pStack.push(iStateIndex);
                                    pTree.reduceByRule(pOperation.rule, this._pRuleCreationModeMap[pOperation.rule.left]);
                                    eAdditionalOperationCode = this.operationAdditionalAction(iStateIndex, pOperation.rule.left);
                                    if (eAdditionalOperationCode === akra.EOperationType.k_Error) {
                                        isError = true;
                                        isStop = true;
                                    } else if (eAdditionalOperationCode === akra.EOperationType.k_Pause) {
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
                    return akra.EParserCode.k_Error;
                }
                if (isPause) {
                    return akra.EParserCode.k_Pause;
                }
                if (!isError) {
                    pTree.setRoot();
                    if (((this._fnFinishCallback) !== undefined)) {
                        this._fnFinishCallback.call(this._pCaller, akra.EParserCode.k_Ok, this.getParseFileName());
                    }
                    this._sFileName = "stdin";
                    return akra.EParserCode.k_Ok;
                } else {
                    this._error(2051, pToken);
                    if (((this._fnFinishCallback) !== undefined)) {
                        this._fnFinishCallback.call(this._pCaller, akra.EParserCode.k_Error, this.getParseFileName());
                    }
                    this._sFileName = "stdin";
                    return akra.EParserCode.k_Error;
                }
            };
            Parser.prototype.statesToString = function (isBaseOnly) {
                if (typeof isBaseOnly === "undefined") { isBaseOnly = true; }
                if (!((this._pStateList) !== undefined)) {
                    return null;
                }
                var sMsg = "";
                var i = 0;
                for(i = 0; i < this._pStateList.length; i++) {
                    sMsg += this._pStateList[i].toString(isBaseOnly);
                    sMsg += " ";
                }
                return sMsg;
            };
            Parser.prototype.operationToString = function (pOperation) {
                var sOperation = null;
                switch(pOperation.type) {
                    case akra.EOperationType.k_Shift:
                        sOperation = "SHIFT to state " + pOperation.index.toString();
                        break;
                    case akra.EOperationType.k_Reduce:
                        sOperation = "REDUCE by rule { " + this.ruleToString(pOperation.rule) + " }";
                        break;
                    case akra.EOperationType.k_Success:
                        sOperation = "SUCCESS";
                        break;
                }
                return sOperation;
            };
            Parser.prototype.ruleToString = function (pRule) {
                var sRule;
                sRule = pRule.left + " : " + pRule.right.join(" ");
                return sRule;
            };
            Parser.prototype.convertGrammarSymbol = function (sSymbol) {
                if (!this.isTerminal(sSymbol)) {
                    return sSymbol;
                } else {
                    return this._pLexer.getTerminalValueByName(sSymbol);
                }
            };
            return Parser;
        })();
        util.Parser = Parser;        
    })(akra.util || (akra.util = {}));
    var util = akra.util;
})(akra || (akra = {}));
var akra;
(function (akra) {
    (function (path) {
        function normalizeArray(parts, allowAboveRoot) {
            // if the path tries to go above the root, `up` ends up > 0
            var up = 0;
            for(var i = parts.length - 1; i >= 0; i--) {
                var last = parts[i];
                if (last === '.') {
                    parts.splice(i, 1);
                } else if (last === "..") {
                    parts.splice(i, 1);
                    up++;
                } else if (up) {
                    parts.splice(i, 1);
                    up--;
                }
            }
            // if the path is allowed to go above the root, restore leading ..s
            if (allowAboveRoot) {
                for(; up--; up) {
                    parts.unshift("..");
                }
            }
            return parts;
        }
        var Info = (function () {
            function Info(pPath) {
                this._sDirname = null;
                this._sExtension = null;
                this._sFilename = null;
                if (((pPath) !== undefined)) {
                    this.set(pPath);
                }
            }
            Object.defineProperty(Info.prototype, "path", {
                get: /** @inline */function () {
                    return this.toString();
                },
                set: /** @inline */function (sPath) {
                    this.set(sPath);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Info.prototype, "dirname", {
                get: /** @inline */function () {
                    return this._sDirname;
                },
                set: /** @inline */function (sDirname) {
                    this._sDirname = sDirname;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Info.prototype, "filename", {
                get: /** @inline */function () {
                    return this._sFilename;
                },
                set: /** @inline */function (sFilename) {
                    this._sFilename = sFilename;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Info.prototype, "ext", {
                get: /** @inline */function () {
                    return this._sExtension;
                },
                set: /** @inline */function (sExtension) {
                    this._sExtension = sExtension;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Info.prototype, "basename", {
                get: /** @inline */function () {
                    return (this._sFilename ? this._sFilename + (this._sExtension ? "." + this._sExtension : "") : "");
                },
                set: /** @inline */function (sBasename) {
                    var nPos = sBasename.lastIndexOf(".");
                    if (nPos < 0) {
                        this._sFilename = sBasename.substr(0);
                        this._sExtension = null;
                    } else {
                        this._sFilename = sBasename.substr(0, nPos);
                        this._sExtension = sBasename.substr(nPos + 1);
                    }
                },
                enumerable: true,
                configurable: true
            });
            Info.prototype.set = function (sPath) {
                if ((typeof (sPath) === "string")) {
                    var pParts = sPath.replace('\\', '/').split('/');
                    /*not inlined, because supportes only single statement functions(cur. st. count: 3)*/this.basename = pParts.pop();
                    this._sDirname = pParts.join('/');
                } else if (sPath instanceof path.Info) {
                    this._sDirname = sPath.dirname;
                    this._sFilename = sPath.filename;
                    this._sExtension = sPath.ext;
                } else if (((sPath) === null)) {
                    return null;
                } else {
                    //critical_error
                     {
                        akra.logger.setSourceLocation("Pathinfo.ts", 97);
                        akra.logger.error("Unexpected data type was used.", sPath);
                    }
                    ;
                }
            };
            Info.prototype.isAbsolute = function () {
                return this._sDirname[0] === "/";
            };
            Info.prototype.toString = function () {
                return (this._sDirname ? this._sDirname + "/" : "") + ((((this)._sFilename ? (this)._sFilename + ((this)._sExtension ? "." + (this)._sExtension : "") : "")));
            };
            return Info;
        })();
        path.Info = Info;        
        path.info;
        function normalize(sPath) {
            var info = path.info(sPath);
            var isAbsolute = info.isAbsolute();
            var tail = info.dirname;
            var trailingSlash = /[\\\/]$/.test(tail);
            tail = normalizeArray(tail.split(/[\\\/]+/).filter(function (p) {
                return !!p;
            }), !isAbsolute).join("/");
            if (tail && trailingSlash) {
                tail += "/";
            }
            info.dirname = (isAbsolute ? "/" : "") + tail;
            return info.toString();
        }
        path.normalize = normalize;
        // export var pathinfo: (sPath: string) => IPathinfo;
        // export var pathinfo: (info: IPathinfo) => IPathinfo;
        path.info = function (info) {
            return new Info(info);
        };
    })(akra.path || (akra.path = {}));
    var path = akra.path;
})(akra || (akra = {}));
var akra;
(function (akra) {
    (function (path) {
        var URI = (function () {
            function URI(pUri) {
                this.sScheme = null;
                this.sUserinfo = null;
                this.sHost = null;
                this.nPort = 0;
                this.sPath = null;
                this.sQuery = null;
                this.sFragment = null;
                if (pUri) {
                    this.set(pUri);
                }
            }
            Object.defineProperty(URI.prototype, "urn", {
                get: function () {
                    return (this.sPath ? this.sPath : "") + (this.sQuery ? '?' + this.sQuery : "") + (this.sFragment ? '#' + this.sFragment : "");
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(URI.prototype, "url", {
                get: function () {
                    return (this.sScheme ? this.sScheme : "") + this.authority;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(URI.prototype, "authority", {
                get: function () {
                    return (this.sHost ? '//' + (this.sUserinfo ? this.sUserinfo + '@' : "") + this.sHost + (this.nPort ? ':' + this.nPort : "") : "");
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(URI.prototype, "scheme", {
                get: /** @inline */function () {
                    return this.sScheme;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(URI.prototype, "protocol", {
                get: function () {
                    if (!this.sScheme) {
                        return this.sScheme;
                    }
                    return (this.sScheme.substr(0, this.sScheme.lastIndexOf(':')));
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(URI.prototype, "userinfo", {
                get: /** @inline */function () {
                    return this.sUserinfo;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(URI.prototype, "host", {
                get: /** @inline */function () {
                    return this.sHost;
                },
                set: /** @inline */function (sHost) {
                    //TODO: check host format
                    this.sHost = sHost;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(URI.prototype, "port", {
                get: /** @inline */function () {
                    return this.nPort;
                },
                set: /** @inline */function (iPort) {
                    this.nPort = iPort;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(URI.prototype, "path", {
                get: /** @inline */function () {
                    return this.sPath;
                },
                set: /** @inline */function (sPath) {
                    // debug_assert(!isNull(sPath.match(new RegExp("^(/(?:[a-z0-9-._~!$&'()*+,;=:@/]|%[0-9A-F]{2})*)$"))),
                    // 	"invalid path used: " + sPath);
                    //TODO: check path format
                    this.sPath = sPath;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(URI.prototype, "query", {
                get: /** @inline */function () {
                    //TODO: check query format
                    return this.sQuery;
                },
                set: /** @inline */function (sQuery) {
                    this.sQuery = sQuery;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(URI.prototype, "fragment", {
                get: /** @inline */function () {
                    return this.sFragment;
                },
                enumerable: true,
                configurable: true
            });
            URI.prototype.set = function (pData) {
                if ((typeof (pData) === "string")) {
                    var pUri = URI.uriExp.exec(pData);
 {
                        akra.logger.setSourceLocation("URI.ts", 103);
                        akra.logger.assert(pUri !== null, 'Invalid URI format used.\nused uri: ' + pData);
                    }
                    ;
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
                } else if (pData instanceof URI) {
                    return this.set(pData.toString());
                }
 {
                    akra.logger.setSourceLocation("URI.ts", 124);
                    akra.logger.error('Unexpected data type was used.');
                }
                ;
                return null;
            };
            URI.prototype.toString = function () {
                return this.url + this.urn;
            };
            URI.here = function here() {
                return new URI(document.location.href);
            };
            URI.uriExp = new RegExp("^([a-z0-9+.-]+:)?(?:\\/\\/(?:((?:[a-z0-9-._~!$&'()*+,;=:]|%[0-9A-F]{2})*)@)?((?:[a-z0-9-._~!$&'()*+,;=]|%[0-9A-F]{2})*)(?::(\\d*))?(\\/(?:[a-z0-9-._~!$&'()*+,;=:@/]|%[0-9A-F]{2})*)?|(\\/?(?:[a-z0-9-._~!$&'()*+,;=:@]|%[0-9A-F]{2})*(?:[a-z0-9-._~!$&'()*+,;=:@/]|%[0-9A-F]{2})*)?)(?:\\?((?:[a-z0-9-._~!$&'()*+,;=:/?@]|%[0-9A-F]{2})*))?(?:#((?:[a-z0-9-._~!$&'()*+,;=:/?@]|%[0-9A-F]{2})*))?$", "i");
            return URI;
        })();
        path.URI = URI;        
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
        function normalizeURIPath(pFile) {
            if (!((pFile.path) === null)) {
                if (pFile.scheme === "filesystem:") {
                    var pUri = (new URI((pFile.path)));
                    pUri.path = akra.path.normalize(pUri.path);
                    pFile.path = pUri.toString();
                } else {
                    pFile.path = akra.path.normalize(pFile.path);
                }
            }
            return pFile;
        }
        function resolve(sFile, sAbsolutePath) {
            if (typeof sAbsolutePath === "undefined") { sAbsolutePath = document.location.pathname; }
            var pCurrentPath = (new URI((sAbsolutePath)));
            var pFile = (new URI((sFile)));
            var sDirname;
            // if (!isNull(pFile.path))
            // 	pFile.path = path.normalize(pFile.path);
            // if (!isNull(pCurrentPath.path))
            // 	pCurrentPath.path = path.normalize(pCurrentPath.path);
            normalizeURIPath(pFile);
            normalizeURIPath(pCurrentPath);
            if (!((pFile.scheme) === null) || !((pFile.host) === null) || akra.path.info(pFile.path).isAbsolute()) {
                //another server or absolute path
                return sFile;
            }
            sDirname = akra.path.info(pCurrentPath.path).dirname;
            pCurrentPath.path = sDirname ? sDirname + "/" + sFile : sFile;
            return normalizeURIPath(pCurrentPath).toString();
        }
        path.resolve = resolve;
        path.uri = /** @inline */function (sUri) {
            return new URI(sUri);
        };
    })(akra.path || (akra.path = {}));
    var path = akra.path;
})(akra || (akra = {}));
var akra;
(function (akra) {
    akra.uri = akra.path.uri;
})(akra || (akra = {}));
var akra;
(function (akra) {
    // #include "ReferenceCounter.ts"
    // #include "Singleton.ts"
    // #include "BrowserInfo.ts"
    // #include "ApiInfo.ts"
    // #include "ScreenInfo.ts"
    // #include "DeviceInfo.ts"
    // #include "UtilTimer.ts"
    // #include "Entity.ts"
    // #include "ThreadManager.ts"
    (function (util) {
        //string to array buffer
        util.stoab = function (s) {
            var len = s.length;
            var pCodeList = new Uint8Array(len);
            for(var i = 0; i < len; ++i) {
                /*& 0xFF;*/
                pCodeList[i] = s.charCodeAt(i);
            }
            return pCodeList.buffer;
        };
        util.abtos = function (pBuf) {
            var pData = new Uint8Array(pBuf);
            var s = "";
            for(var n = 0; n < pData.length; ++n) {
                s += String.fromCharCode(pData[n]);
            }
            return s;
            // return String.fromCharCode.apply(null, Array.prototype.slice.call(new Uint8Array(pBuf), 0));
                    };
        util.abtos_blobreader = function (buf, callback) {
            var bb = new Blob([
                buf
            ]);
            var f = new FileReader();
            f.onload = function (e) {
                callback(e.target.result);
            };
            f.readAsText(bb);
        };
        function abtota(pBuffer, eType) {
            switch(eType) {
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
        }
        util.abtota = abtota;
        function parseJSON(sJSON) {
            return eval('(' + sJSON + ')');
        }
        util.parseJSON = parseJSON;
        function btoa(pBlob, fn) {
            var pReader = new FileReader();
            pReader.onload = function (e) {
                fn(null, e.target.result);
            };
            pReader.onerror = function (e) {
                fn(e, null);
            };
            pReader.readAsArrayBuffer(pBlob);
        }
        util.btoa = btoa;
        /**
        * Преобразование html-сформированного текста
        * в dom.
        */
        function parseHTML(sHTML, useDocFragment) {
            if (typeof useDocFragment === "undefined") { useDocFragment = true; }
            var pDivEl = document.createElement('div');
            var pDocFrag;
            pDivEl.innerHTML = sHTML;
            if (!useDocFragment) {
                return pDivEl.childNodes;
            }
            pDocFrag = document.createDocumentFragment();
            for(var i = 0, len = pDivEl.childNodes.length; i < len; ++i) {
                if (!((pDivEl.childNodes[i]) !== undefined)) {
                    continue;
                }
                pDocFrag.appendChild(pDivEl.childNodes[i]);
            }
            return pDocFrag;
        }
        util.parseHTML = parseHTML;
        ;
        function blobFromDataURL(sBlobURL, fn) {
            var xhr = new XMLHttpRequest();
            xhr.open("GET", sBlobURL, true);
            xhr.responseType = "blob";
            xhr.onload = function (e) {
                if (this.status == 200) {
                    fn(this.response);
                }
            };
            xhr.send();
        }
        util.blobFromDataURL = blobFromDataURL;
        function jsonFromDataURL(sBlobURL, fn) {
            var xhr = new XMLHttpRequest();
            xhr.open("GET", sBlobURL, true);
            xhr.overrideMimeType('application/json');
            xhr.responseType = "json";
            xhr.onload = function (e) {
                if (this.status == 200) {
                    fn(this.response);
                }
            };
            xhr.send();
        }
        util.jsonFromDataURL = jsonFromDataURL;
        function dataURItoBlob(dataURI) {
            // convert base64 to raw binary data held in a string
            // doesn't handle URLEncoded DataURIs - see SO answer #6850276 for code that does this
            var byteString = atob(dataURI.split(',')[1]);
            // separate out the mime component
            var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
            // write the bytes of the string to an ArrayBuffer
            var ab = new ArrayBuffer(byteString.length);
            var ia = new Uint8Array(ab);
            for(var i = 0; i < byteString.length; i++) {
                ia[i] = byteString.charCodeAt(i);
            }
            // write the ArrayBuffer to a blob, and you're done
            var bb = new Blob([
                ab
            ], {
                type: mimeString
            });
            return bb;
        }
        util.dataURItoBlob = dataURItoBlob;
    })(akra.util || (akra.util = {}));
    var util = akra.util;
})(akra || (akra = {}));
var akra;
(function (akra) {
    (function (util) {
        var Singleton = (function () {
            function Singleton() {
                var _constructor = (this).constructor;
 {
                    util.logger.setSourceLocation("Singleton.ts", 10);
                    util.logger.assert(!((_constructor._pInstance) !== undefined), 'Singleton class may be created only one time.');
                }
                ;
                _constructor._pInstance = this;
            }
            return Singleton;
        })();
        util.Singleton = Singleton;        
    })(akra.util || (akra.util = {}));
    var util = akra.util;
})(akra || (akra = {}));
var akra;
(function (akra) {
    (function (util) {
        var BrowserInfo = (function (_super) {
            __extends(BrowserInfo, _super);
            function BrowserInfo() {
                        _super.call(this);
                this.sBrowser = null;
                this.sVersion = null;
                this.sOS = null;
                this.sVersionSearch = null;
                this.init();
            }
            Object.defineProperty(BrowserInfo.prototype, "name", {
                get: function () {
                    return this.sBrowser;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(BrowserInfo.prototype, "version", {
                get: function () {
                    return this.sVersion;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(BrowserInfo.prototype, "os", {
                get: function () {
                    return this.sOS;
                },
                enumerable: true,
                configurable: true
            });
            BrowserInfo.prototype.init = function () {
                this.sBrowser = this.searchString(BrowserInfo.dataBrowser) || "An unknown browser";
                this.sVersion = this.searchVersion(navigator.userAgent) || this.searchVersion(navigator.appVersion) || "an unknown version";
                this.sOS = this.searchString(BrowserInfo.dataOS) || "an unknown OS";
            };
            BrowserInfo.prototype.searchString = function (pDataBrowser) {
                for(var i = 0; i < pDataBrowser.length; i++) {
                    var sData = pDataBrowser[i].string;
                    var dataProp = pDataBrowser[i].prop;
                    this.sVersionSearch = pDataBrowser[i].versionSearch || pDataBrowser[i].identity;
                    if (sData) {
                        if (sData.indexOf(pDataBrowser[i].subString) != -1) {
                            return pDataBrowser[i].identity;
                        }
                    } else if (dataProp) {
                        return pDataBrowser[i].identity;
                    }
                }
                return null;
            };
            BrowserInfo.prototype.searchVersion = function (sData) {
                var iStartIndex = sData.indexOf(this.sVersionSearch);
                if (iStartIndex == -1) {
                    return null;
                }
                iStartIndex = sData.indexOf('/', iStartIndex + 1);
                if (iStartIndex == -1) {
                    return null;
                }
                var iEndIndex = sData.indexOf(' ', iStartIndex + 1);
                if (iEndIndex == -1) {
                    iEndIndex = sData.indexOf(';', iStartIndex + 1);
                    if (iEndIndex == -1) {
                        return null;
                    }
                    return sData.slice(iStartIndex + 1);
                }
                return sData.slice((iStartIndex + 1), iEndIndex);
            };
            BrowserInfo.dataBrowser = [
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
                    string: // for newer Netscapes (6+)
                    navigator.userAgent,
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
                    string: // for older Netscapes (4-)
                    navigator.userAgent,
                    subString: "Mozilla",
                    identity: "Netscape",
                    versionSearch: "Mozilla"
                }
            ];
            BrowserInfo.dataOS = [
                {
                    string: navigator.platform,
                    subString: "Win",
                    identity: "Windows"
                }, 
                {
                    string: navigator.platform,
                    subString: "Mac",
                    identity: "Mac"
                }, 
                {
                    string: navigator.userAgent,
                    subString: "iPhone",
                    identity: "iPhone/iPod"
                }, 
                {
                    string: navigator.platform,
                    subString: "Linux",
                    identity: "Linux"
                }
            ];
            return BrowserInfo;
        })(util.Singleton);
        util.BrowserInfo = BrowserInfo;        
    })(akra.util || (akra.util = {}));
    var util = akra.util;
})(akra || (akra = {}));
var akra;
(function (akra) {
    (function (util) {
        var ScreenInfo = (function () {
            function ScreenInfo() { }
            Object.defineProperty(ScreenInfo.prototype, "width", {
                get: function () {
                    return screen.width;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(ScreenInfo.prototype, "height", {
                get: function () {
                    return screen.height;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(ScreenInfo.prototype, "aspect", {
                get: function () {
                    return screen.width / screen.height;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(ScreenInfo.prototype, "pixelDepth", {
                get: function () {
                    return screen.pixelDepth;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(ScreenInfo.prototype, "colorDepth", {
                get: function () {
                    return screen.colorDepth;
                },
                enumerable: true,
                configurable: true
            });
            return ScreenInfo;
        })();
        util.ScreenInfo = ScreenInfo;        
    })(akra.util || (akra.util = {}));
    var util = akra.util;
})(akra || (akra = {}));
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
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
var akra;
(function (akra) {
    (function (EPixelFormats) {
        EPixelFormats._map = [];
        /*Unknown pixel format.*/
        EPixelFormats.UNKNOWN = 0;
        /*8-bit pixel format, all bits luminance.*/
        EPixelFormats.L8 = 1;
        EPixelFormats.BYTE_L = EPixelFormats.L8;
        /*16-bit pixel format, all bits luminance.*/
        EPixelFormats.L16 = 2;
        EPixelFormats.SHORT_L = EPixelFormats.L16;
        /*8-bit pixel format, all bits alpha.*/
        EPixelFormats.A8 = 3;
        EPixelFormats.BYTE_A = EPixelFormats.A8;
        /*8-bit pixel format, 4 bits alpha, 4 bits luminance.*/
        EPixelFormats.A4L4 = 4;
        /*2 byte pixel format, 1 byte luminance, 1 byte alpha*/
        EPixelFormats.BYTE_LA = 5;
        /*16-bit pixel format, 5 bits red, 6 bits green, 5 bits blue.*/
        EPixelFormats.R5G6B5 = 6;
        /*16-bit pixel format, 5 bits red, 6 bits green, 5 bits blue.*/
        EPixelFormats.B5G6R5 = 7;
        /*8-bit pixel format, 2 bits blue, 3 bits green, 3 bits red.*/
        EPixelFormats.R3G3B2 = 31;
        /*16-bit pixel format, 4 bits for alpha, red, green and blue.*/
        EPixelFormats.A4R4G4B4 = 8;
        /*16-bit pixel format, 5 bits for blue, green, red and 1 for alpha.*/
        EPixelFormats.A1R5G5B5 = 9;
        /*24-bit pixel format, 8 bits for red, green and blue.*/
        EPixelFormats.R8G8B8 = 10;
        /*24-bit pixel format, 8 bits for blue, green and red.*/
        EPixelFormats.B8G8R8 = 11;
        /*32-bit pixel format, 8 bits for alpha, red, green and blue.*/
        EPixelFormats.A8R8G8B8 = 12;
        /*32-bit pixel format, 8 bits for blue, green, red and alpha.*/
        EPixelFormats.A8B8G8R8 = 13;
        /*32-bit pixel format, 8 bits for blue, green, red and alpha.*/
        EPixelFormats.B8G8R8A8 = 14;
        /*32-bit pixel format, 8 bits for red, green, blue and alpha.*/
        EPixelFormats.R8G8B8A8 = 28;
        /*32-bit pixel format, 8 bits for red, 8 bits for green, 8 bits for blue like A8R8G8B8, but alpha will get discarded*/
        EPixelFormats.X8R8G8B8 = 26;
        /*32-bit pixel format, 8 bits for blue, 8 bits for green, 8 bits for red like A8B8G8R8, but alpha will get discarded*/
        EPixelFormats.X8B8G8R8 = 27;
        /*3 byte pixel format, 1 byte for red, 1 byte for green, 1 byte for blue*/
        EPixelFormats.BYTE_RGB = EPixelFormats.R8G8B8;
        /*3 byte pixel format, 1 byte for blue, 1 byte for green, 1 byte for red*/
        EPixelFormats.BYTE_BGR = EPixelFormats.B8G8R8;
        /*4 byte pixel format, 1 byte for blue, 1 byte for green, 1 byte for red and one byte for alpha*/
        EPixelFormats.BYTE_BGRA = EPixelFormats.B8G8R8A8;
        /*4 byte pixel format, 1 byte for red, 1 byte for green, 1 byte for blue, and one byte for alpha*/
        EPixelFormats.BYTE_RGBA = EPixelFormats.R8G8B8A8;
        EPixelFormats.BYTE_ABGR = EPixelFormats.A8B8G8R8;
        EPixelFormats.BYTE_ARGB = EPixelFormats.A8R8G8B8;
        /*32-bit pixel format, 2 bits for alpha, 10 bits for red, green and blue.*/
        EPixelFormats.A2R10G10B10 = 15;
        /*32-bit pixel format, 10 bits for blue, green and red, 2 bits for alpha.*/
        EPixelFormats.A2B10G10R10 = 16;
        /*DDS (DirectDraw Surface) DXT1 format.*/
        EPixelFormats.DXT1 = 17;
        /*DDS (DirectDraw Surface) DXT2 format.*/
        EPixelFormats.DXT2 = 18;
        /*DDS (DirectDraw Surface) DXT3 format.*/
        EPixelFormats.DXT3 = 19;
        /*DDS (DirectDraw Surface) DXT4 format.*/
        EPixelFormats.DXT4 = 20;
        /*DDS (DirectDraw Surface) DXT5 format.*/
        EPixelFormats.DXT5 = 21;
        /*16-bit pixel format, 16 bits (float) for red*/
        EPixelFormats.FLOAT16_R = 32;
        /*48-bit pixel format, 16 bits (float) for red, 16 bits (float) for green, 16 bits (float) for blue*/
        EPixelFormats.FLOAT16_RGB = 22;
        /*64-bit pixel format, 16 bits (float) for red, 16 bits (float) for green, 16 bits (float) for blue, 16 bits (float) for alpha*/
        EPixelFormats.FLOAT16_RGBA = 23;
        /*32-bit pixel format, 32 bits (float) for red*/
        EPixelFormats.FLOAT32_R = 33;
        /*96-bit pixel format, 32 bits (float) for red, 32 bits (float) for green, 32 bits (float) for blue*/
        EPixelFormats.FLOAT32_RGB = 24;
        /*128-bit pixel format, 32 bits (float) for red, 32 bits (float) for green, 32 bits (float) for blue, 32 bits (float) for alpha*/
        EPixelFormats.FLOAT32_RGBA = 25;
        /*32-bit, 2-channel s10e5 floating point pixel format, 16-bit green, 16-bit red*/
        EPixelFormats.FLOAT16_GR = 35;
        /*64-bit, 2-channel floating point pixel format, 32-bit green, 32-bit red*/
        EPixelFormats.FLOAT32_GR = 36;
        /*Float Depth texture format*/
        EPixelFormats.FLOAT32_DEPTH = 29;
        EPixelFormats.DEPTH8 = 44;
        /*Byte Depth texture format */
        EPixelFormats.BYTE_DEPTH = EPixelFormats.DEPTH8;
        EPixelFormats.DEPTH16 = 45;
        EPixelFormats.SHORT_DEPTH = EPixelFormats.DEPTH16;
        EPixelFormats.DEPTH32 = 46;
        EPixelFormats.DEPTH24STENCIL8 = 47;
        /*64-bit pixel format, 16 bits for red, green, blue and alpha*/
        EPixelFormats.SHORT_RGBA = 30;
        /*32-bit pixel format, 16-bit green, 16-bit red*/
        EPixelFormats.SHORT_GR = 34;
        /*48-bit pixel format, 16 bits for red, green and blue*/
        EPixelFormats.SHORT_RGB = 37;
        /*PVRTC (PowerVR) RGB 2 bpp.*/
        EPixelFormats.PVRTC_RGB2 = 38;
        /*PVRTC (PowerVR) RGBA 2 bpp.*/
        EPixelFormats.PVRTC_RGBA2 = 39;
        /*PVRTC (PowerVR) RGB 4 bpp.*/
        EPixelFormats.PVRTC_RGB4 = 40;
        /*PVRTC (PowerVR) RGBA 4 bpp.*/
        EPixelFormats.PVRTC_RGBA4 = 41;
        /*8-bit pixel format, all bits red.*/
        EPixelFormats.R8 = 42;
        /*16-bit pixel format, 8 bits red, 8 bits green.*/
        EPixelFormats.RG8 = 43;
        EPixelFormats.TOTAL = 48;
    })(akra.EPixelFormats || (akra.EPixelFormats = {}));
    var EPixelFormats = akra.EPixelFormats;
    ;
    /**
    * Flags defining some on/off properties of pixel formats
    */
    (function (EPixelFormatFlags) {
        EPixelFormatFlags._map = [];
        // This format has an alpha channel
        EPixelFormatFlags.HASALPHA = 0x00000001;
        // This format is compressed. This invalidates the values in elemBytes,
        // elemBits and the bit counts as these might not be fixed in a compressed format.
        EPixelFormatFlags.COMPRESSED = 0x00000002;
        // This is a floating point format
        EPixelFormatFlags.FLOAT = 0x00000004;
        // This is a depth format (for depth textures)
        EPixelFormatFlags.DEPTH = 0x00000008;
        // Format is in native endian. Generally true for the 16, 24 and 32 bits
        // formats which can be represented as machine integers.
        EPixelFormatFlags.NATIVEENDIAN = 0x00000010;
        // This is an intensity format instead of a RGB one. The luminance
        // replaces R,G and B. (but not A)
        EPixelFormatFlags.LUMINANCE = 0x00000020;
        EPixelFormatFlags.STENCIL = 0x00000040;
    })(akra.EPixelFormatFlags || (akra.EPixelFormatFlags = {}));
    var EPixelFormatFlags = akra.EPixelFormatFlags;
    /** Pixel component format */
    (function (EPixelComponentTypes) {
        EPixelComponentTypes._map = [];
        /*Byte per component (8 bit fixed 0.0..1.0)*/
        EPixelComponentTypes.BYTE = 0;
        /*Short per component (16 bit fixed 0.0..1.0))*/
        EPixelComponentTypes.SHORT = 1;
        EPixelComponentTypes.INT = 2;
        /*16 bit float per component*/
        EPixelComponentTypes.FLOAT16 = 3;
        /*32 bit float per component*/
        EPixelComponentTypes.FLOAT32 = 4;
        /*Number of pixel types*/
        EPixelComponentTypes.COUNT = 5;
    })(akra.EPixelComponentTypes || (akra.EPixelComponentTypes = {}));
    var EPixelComponentTypes = akra.EPixelComponentTypes;
    ;
    (function (EFilters) {
        EFilters._map = [];
        EFilters._map[0] = "NEAREST";
        EFilters.NEAREST = 0;
        EFilters._map[1] = "LINEAR";
        EFilters.LINEAR = 1;
        EFilters._map[2] = "BILINEAR";
        EFilters.BILINEAR = 2;
        EFilters._map[3] = "BOX";
        EFilters.BOX = 3;
        EFilters._map[4] = "TRIANGLE";
        EFilters.TRIANGLE = 4;
        EFilters._map[5] = "BICUBIC";
        EFilters.BICUBIC = 5;
    })(akra.EFilters || (akra.EFilters = {}));
    var EFilters = akra.EFilters;
    ;
})(akra || (akra = {}));
var akra;
(function (akra) {
    (function (EHardwareBufferFlags) {
        EHardwareBufferFlags._map = [];
        EHardwareBufferFlags.STATIC = 0x01;
        EHardwareBufferFlags.DYNAMIC = 0x02;
        EHardwareBufferFlags.STREAM = 0x80;
        EHardwareBufferFlags.READABLE = 0x04;
        EHardwareBufferFlags.BACKUP_COPY = 0x08;
        /** indicate, that buffer does not use GPU memory or other specific memory. */
        EHardwareBufferFlags.SOFTWARE = 0x10;
        /** Indicate, tha buffer uses specific data aligment */
        EHardwareBufferFlags.ALIGNMENT = 0x20;
        /** Indicates that the application will be refilling the contents
        of the buffer regularly (not just updating, but generating the
        contents from scratch), and therefore does not mind if the contents
        of the buffer are lost somehow and need to be recreated. This
        allows and additional level of optimisation on the buffer.
        This option only really makes sense when combined with
        DYNAMIC and without READING.
        */
        EHardwareBufferFlags.DISCARDABLE = 0x40;
        EHardwareBufferFlags.STATIC_READABLE = EHardwareBufferFlags.STATIC | EHardwareBufferFlags.READABLE;
        EHardwareBufferFlags.DYNAMIC_DISCARDABLE = EHardwareBufferFlags.DYNAMIC | EHardwareBufferFlags.DISCARDABLE;
    })(akra.EHardwareBufferFlags || (akra.EHardwareBufferFlags = {}));
    var EHardwareBufferFlags = akra.EHardwareBufferFlags;
    (function (ELockFlags) {
        ELockFlags._map = [];
        ELockFlags.READ = 0x01;
        ELockFlags.WRITE = 0x02;
        ELockFlags.DISCARD = 0x04;
        ELockFlags.NO_OVERWRITE = 0x08;
        ELockFlags.NORMAL = ELockFlags.READ | ELockFlags.WRITE;
    })(akra.ELockFlags || (akra.ELockFlags = {}));
    var ELockFlags = akra.ELockFlags;
})(akra || (akra = {}));
var akra;
(function (akra) {
    akra.__11 = 0;
    akra.__12 = 4;
    akra.__13 = 8;
    akra.__14 = 12;
    akra.__21 = 1;
    akra.__22 = 5;
    akra.__23 = 9;
    akra.__24 = 13;
    akra.__31 = 2;
    akra.__32 = 6;
    akra.__33 = 10;
    akra.__34 = 14;
    akra.__41 = 3;
    akra.__42 = 7;
    akra.__43 = 11;
    akra.__44 = 15;
})(akra || (akra = {}));
var akra;
(function (akra) {
    (function (math) {
        //
        // BASIC MATH AND UNIT CONVERSION CONSTANTS
        //
        math.E = Math.E;
        math.LN2 = Math.LN2;
        math.LOG2E = Math.LOG2E;
        math.LOG10E = Math.LOG10E;
        math.PI = Math.PI;
        math.SQRT1_2 = Math.SQRT1_2;
        math.SQRT2 = Math.SQRT2;
        math.LN10 = Math.LN10;
        math.POSITIVE_INFINITY = Number.POSITIVE_INFINITY;
        math.NEGATIVE_INFINITY = Number.NEGATIVE_INFINITY;
        math.FLOAT_PRECISION = (3.4e-8);
        math.TWO_PI = (2.0 * math.PI);
        math.HALF_PI = (math.PI / 2.0);
        math.QUARTER_PI = (math.PI / 4.0);
        math.EIGHTH_PI = (math.PI / 8.0);
        math.PI_SQUARED = (9.86960440108935861883449099987615113531369940724079);
        math.PI_INVERSE = (0.31830988618379067153776752674502872406891929148091);
        math.PI_OVER_180 = (math.PI / 180);
        math.PI_DIV_180 = (180 / math.PI);
        math.NATURAL_LOGARITHM_BASE = (2.71828182845904523536028747135266249775724709369996);
        math.EULERS_CONSTANT = (0.57721566490153286060651);
        math.SQUARE_ROOT_2 = (1.41421356237309504880168872420969807856967187537695);
        math.INVERSE_ROOT_2 = (0.707106781186547524400844362105198);
        math.SQUARE_ROOT_3 = (1.73205080756887729352744634150587236694280525381038);
        math.SQUARE_ROOT_5 = (2.23606797749978969640917366873127623544061835961153);
        math.SQUARE_ROOT_10 = (3.16227766016837933199889354443271853371955513932522);
        math.CUBE_ROOT_2 = (1.25992104989487316476721060727822835057025146470151);
        math.CUBE_ROOT_3 = (1.44224957030740838232163831078010958839186925349935);
        math.FOURTH_ROOT_2 = (1.18920711500272106671749997056047591529297209246382);
        math.NATURAL_LOG_2 = (0.69314718055994530941723212145817656807550013436026);
        math.NATURAL_LOG_3 = (1.09861228866810969139524523692252570464749055782275);
        math.NATURAL_LOG_10 = (2.30258509299404568401799145468436420760110148862877);
        math.NATURAL_LOG_PI = (1.14472988584940017414342735135305871164729481291531);
        math.BASE_TEN_LOG_PI = (0.49714987269413385435126828829089887365167832438044);
        math.NATURAL_LOGARITHM_BASE_INVERSE = (0.36787944117144232159552377016146086744581113103177);
        math.NATURAL_LOGARITHM_BASE_SQUARED = (7.38905609893065022723042746057500781318031557055185);
        math.GOLDEN_RATIO = ((math.SQUARE_ROOT_5 + 1.0) / 2.0);
        math.DEGREE_RATIO = (math.PI_DIV_180);
        math.RADIAN_RATIO = (math.PI_OVER_180);
        math.GRAVITY_CONSTANT = 9.81;
    })(akra.math || (akra.math = {}));
    var math = akra.math;
})(akra || (akra = {}));
;
var akra;
(function (akra) {
    (function (math) {
        var Vec2 = (function () {
            function Vec2(fValue1, fValue2) {
                this.x = 0.;
                this.y = 0.;
                var nArgumentsLength = arguments.length;
                var v2fVec = this;
                // if (<any>this === window || <any>this === akra || <any>this === akra.math) {
                //     v2fVec = Vec2.stack[Vec2.stackPosition ++];
                //     if(Vec2.stackPosition == Vec2.stackSize){
                //         Vec2.stackPosition = 0;
                //     }
                // }
                switch(nArgumentsLength) {
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
            }
            Object.defineProperty(Vec2.prototype, "xx", {
                get: function () {
                    return Vec2.stackCeil.set(this.x, this.x);
                },
                set: function (v2fVec) {
                    this.x = v2fVec.x;
                    this.x = v2fVec.y;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Vec2.prototype, "xy", {
                get: function () {
                    return Vec2.stackCeil.set(this.x, this.y);
                },
                set: function (v2fVec) {
                    this.x = v2fVec.x;
                    this.y = v2fVec.y;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Vec2.prototype, "yx", {
                get: function () {
                    return Vec2.stackCeil.set(this.y, this.x);
                },
                set: function (v2fVec) {
                    this.y = v2fVec.x;
                    this.x = v2fVec.y;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Vec2.prototype, "yy", {
                get: function () {
                    return Vec2.stackCeil.set(this.y, this.y);
                },
                set: function (v2fVec) {
                    this.y = v2fVec.x;
                    this.y = v2fVec.y;
                },
                enumerable: true,
                configurable: true
            });
            Vec2.prototype.set = function (fValue1, fValue2) {
                var nArgumentsLength = arguments.length;
                switch(nArgumentsLength) {
                    case 0:
                        this.x = this.y = 0.;
                        break;
                    case 1:
                        if ((typeof (arguments[0]) === "number")) {
                            this.x = this.y = arguments[0];
                        } else if (arguments[0] instanceof Vec2) {
                            var v2fVec = arguments[0];
                            this.x = v2fVec.x;
                            this.y = v2fVec.y;
                        } else {
                            var pArray = arguments[0];
                            this.x = pArray[0];
                            this.y = pArray[1];
                        }
                        break;
                    case 2:
                        this.x = arguments[0];
                        this.y = arguments[1];
                        break;
                }
                ;
                return this;
            };
            Vec2.prototype.clear = /** @inline */function () {
                this.x = this.y = 0.;
                return this;
            };
            Vec2.prototype.add = function (v2fVec, v2fDestination) {
                if (!((v2fDestination) !== undefined)) {
                    v2fDestination = this;
                }
                v2fDestination.x = this.x + v2fVec.x;
                v2fDestination.y = this.y + v2fVec.y;
                return v2fDestination;
            };
            Vec2.prototype.subtract = function (v2fVec, v2fDestination) {
                if (!((v2fDestination) !== undefined)) {
                    v2fDestination = this;
                }
                v2fDestination.x = this.x - v2fVec.x;
                v2fDestination.y = this.y - v2fVec.y;
                return v2fDestination;
            };
            Vec2.prototype.dot = /** @inline */function (v2fVec) {
                return this.x * v2fVec.x + this.y * v2fVec.y;
            };
            Vec2.prototype.isEqual = function (v2fVec, fEps) {
                if (typeof fEps === "undefined") { fEps = 0.; }
                if (fEps === 0.) {
                    if (this.x != v2fVec.x || this.y != v2fVec.y) {
                        return false;
                    }
                } else {
                    if (math.abs(this.x - v2fVec.x) > fEps || math.abs(this.y - v2fVec.y) > fEps) {
                        return false;
                    }
                }
                return true;
            };
            Vec2.prototype.isClear = function (fEps) {
                if (typeof fEps === "undefined") { fEps = 0.; }
                if (fEps === 0.) {
                    if (this.x != 0. || this.y != 0.) {
                        return false;
                    }
                } else {
                    if (math.abs(this.x) > fEps || math.abs(this.y) > fEps) {
                        return false;
                    }
                }
                return true;
            };
            Vec2.prototype.negate = function (v2fDestination) {
                if (!((v2fDestination) !== undefined)) {
                    v2fDestination = this;
                }
                v2fDestination.x = -this.x;
                v2fDestination.y = -this.y;
                return v2fDestination;
            };
            Vec2.prototype.scale = function (fScale, v2fDestination) {
                if (!((v2fDestination) !== undefined)) {
                    v2fDestination = this;
                }
                v2fDestination.x = this.x * fScale;
                v2fDestination.y = this.y * fScale;
                return v2fDestination;
            };
            Vec2.prototype.normalize = function (v2fDestination) {
                if (!((v2fDestination) !== undefined)) {
                    v2fDestination = this;
                }
                var x = this.x, y = this.y;
                var fLength = math.sqrt(x * x + y * y);
                if (fLength !== 0.) {
                    var fInvLength = 1. / fLength;
                    x *= fInvLength;
                    y *= fInvLength;
                }
                v2fDestination.x = x;
                v2fDestination.y = y;
                return v2fDestination;
            };
            Vec2.prototype.length = /** @inline */function () {
                var x = this.x, y = this.y;
                return math.sqrt(x * x + y * y);
            };
            Vec2.prototype.lengthSquare = /** @inline */function () {
                var x = this.x, y = this.y;
                return x * x + y * y;
            };
            Vec2.prototype.direction = function (v2fVec, v2fDestination) {
                if (!((v2fDestination) !== undefined)) {
                    v2fDestination = this;
                }
                var x = v2fVec.x - this.x;
                var y = v2fVec.y - this.y;
                var fLength = math.sqrt(x * x + y * y);
                if (fLength !== 0.) {
                    var fInvLength = 1. / fLength;
                    x *= fInvLength;
                    y *= fInvLength;
                }
                v2fDestination.x = x;
                v2fDestination.y = y;
                return v2fDestination;
            };
            Vec2.prototype.mix = function (v2fVec, fA, v2fDestination) {
                if (!((v2fDestination) !== undefined)) {
                    v2fDestination = this;
                }
                fA = (/*checked (origin: math)>>*/akra.math.max((0.), /*checked (origin: math)>>*/akra.math.min((fA), (1.))));
                var fA1 = 1. - fA;
                var fA2 = fA;
                v2fDestination.x = fA1 * this.x + fA2 * v2fVec.x;
                v2fDestination.y = fA1 * this.y + fA2 * v2fVec.y;
                return v2fDestination;
            };
            Vec2.prototype.toString = /** @inline */function () {
                return "[x: " + this.x + ", y: " + this.y + "]";
            };
            Object.defineProperty(Vec2, "stackCeil", {
                get: function () {
                    Vec2.stackPosition = Vec2.stackPosition === Vec2.stackSize - 1 ? 0 : Vec2.stackPosition;
                    return Vec2.stack[Vec2.stackPosition++];
                },
                enumerable: true,
                configurable: true
            });
            Vec2.stackSize = 256;
            Vec2.stackPosition = 0;
            Vec2.stack = (function () {
                var pStack = new Array(Vec2.stackSize);
                for(var i = 0; i < Vec2.stackSize; i++) {
                    pStack[i] = new Vec2();
                }
                return pStack;
            })();
            return Vec2;
        })();
        math.Vec2 = Vec2;        
    })(akra.math || (akra.math = {}));
    var math = akra.math;
})(akra || (akra = {}));
;
;
var akra;
(function (akra) {
    (function (math) {
        var Vec3 = (function () {
            function Vec3(fValue1, fValue2, fValue3) {
                var nArgumentsLength = arguments.length;
                switch(nArgumentsLength) {
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
            }
            Object.defineProperty(Vec3.prototype, "xx", {
                get: function () {
                    return math.Vec2.stackCeil.set(this.x, this.x);
                },
                set: function (v2fVec) {
                    this.x = v2fVec.x;
                    this.x = v2fVec.y;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Vec3.prototype, "xy", {
                get: function () {
                    return math.Vec2.stackCeil.set(this.x, this.y);
                },
                set: function (v2fVec) {
                    this.x = v2fVec.x;
                    this.y = v2fVec.y;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Vec3.prototype, "xz", {
                get: function () {
                    return math.Vec2.stackCeil.set(this.x, this.z);
                },
                set: function (v2fVec) {
                    this.x = v2fVec.x;
                    this.z = v2fVec.y;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Vec3.prototype, "yx", {
                get: function () {
                    return math.Vec2.stackCeil.set(this.y, this.x);
                },
                set: function (v2fVec) {
                    this.y = v2fVec.x;
                    this.x = v2fVec.y;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Vec3.prototype, "yy", {
                get: function () {
                    return math.Vec2.stackCeil.set(this.y, this.y);
                },
                set: function (v2fVec) {
                    this.y = v2fVec.x;
                    this.y = v2fVec.y;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Vec3.prototype, "yz", {
                get: function () {
                    return math.Vec2.stackCeil.set(this.y, this.z);
                },
                set: function (v2fVec) {
                    this.y = v2fVec.x;
                    this.z = v2fVec.y;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Vec3.prototype, "zx", {
                get: function () {
                    return math.Vec2.stackCeil.set(this.z, this.x);
                },
                set: function (v2fVec) {
                    this.z = v2fVec.x;
                    this.x = v2fVec.y;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Vec3.prototype, "zy", {
                get: function () {
                    return math.Vec2.stackCeil.set(this.z, this.y);
                },
                set: function (v2fVec) {
                    this.z = v2fVec.x;
                    this.y = v2fVec.y;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Vec3.prototype, "zz", {
                get: function () {
                    return math.Vec2.stackCeil.set(this.z, this.z);
                },
                set: function (v2fVec) {
                    this.z = v2fVec.x;
                    this.z = v2fVec.y;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Vec3.prototype, "xxx", {
                get: function () {
                    return Vec3.stackCeil.set(this.x, this.x, this.x);
                },
                set: function (v3fVec) {
                    this.x = v3fVec.x;
                    this.x = v3fVec.y;
                    this.x = v3fVec.z;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Vec3.prototype, "xxy", {
                get: function () {
                    return Vec3.stackCeil.set(this.x, this.x, this.y);
                },
                set: function (v3fVec) {
                    this.x = v3fVec.x;
                    this.x = v3fVec.y;
                    this.y = v3fVec.z;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Vec3.prototype, "xxz", {
                get: function () {
                    return Vec3.stackCeil.set(this.x, this.x, this.z);
                },
                set: function (v3fVec) {
                    this.x = v3fVec.x;
                    this.x = v3fVec.y;
                    this.z = v3fVec.z;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Vec3.prototype, "xyx", {
                get: function () {
                    return Vec3.stackCeil.set(this.x, this.y, this.x);
                },
                set: function (v3fVec) {
                    this.x = v3fVec.x;
                    this.y = v3fVec.y;
                    this.x = v3fVec.z;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Vec3.prototype, "xyy", {
                get: function () {
                    return Vec3.stackCeil.set(this.x, this.y, this.y);
                },
                set: function (v3fVec) {
                    this.x = v3fVec.x;
                    this.y = v3fVec.y;
                    this.y = v3fVec.z;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Vec3.prototype, "xyz", {
                get: function () {
                    return Vec3.stackCeil.set(this.x, this.y, this.z);
                },
                set: function (v3fVec) {
                    this.x = v3fVec.x;
                    this.y = v3fVec.y;
                    this.z = v3fVec.z;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Vec3.prototype, "xzx", {
                get: function () {
                    return Vec3.stackCeil.set(this.x, this.z, this.x);
                },
                set: function (v3fVec) {
                    this.x = v3fVec.x;
                    this.z = v3fVec.y;
                    this.x = v3fVec.z;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Vec3.prototype, "xzy", {
                get: function () {
                    return Vec3.stackCeil.set(this.x, this.z, this.y);
                },
                set: function (v3fVec) {
                    this.x = v3fVec.x;
                    this.z = v3fVec.y;
                    this.y = v3fVec.z;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Vec3.prototype, "xzz", {
                get: function () {
                    return Vec3.stackCeil.set(this.x, this.z, this.z);
                },
                set: function (v3fVec) {
                    this.x = v3fVec.x;
                    this.z = v3fVec.y;
                    this.z = v3fVec.z;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Vec3.prototype, "yxx", {
                get: function () {
                    return Vec3.stackCeil.set(this.y, this.x, this.x);
                },
                set: function (v3fVec) {
                    this.y = v3fVec.x;
                    this.x = v3fVec.y;
                    this.x = v3fVec.z;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Vec3.prototype, "yxy", {
                get: function () {
                    return Vec3.stackCeil.set(this.y, this.x, this.y);
                },
                set: function (v3fVec) {
                    this.y = v3fVec.x;
                    this.x = v3fVec.y;
                    this.y = v3fVec.z;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Vec3.prototype, "yxz", {
                get: function () {
                    return Vec3.stackCeil.set(this.y, this.x, this.z);
                },
                set: function (v3fVec) {
                    this.y = v3fVec.x;
                    this.x = v3fVec.y;
                    this.z = v3fVec.z;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Vec3.prototype, "yyx", {
                get: function () {
                    return Vec3.stackCeil.set(this.y, this.y, this.x);
                },
                set: function (v3fVec) {
                    this.y = v3fVec.x;
                    this.y = v3fVec.y;
                    this.x = v3fVec.z;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Vec3.prototype, "yyy", {
                get: function () {
                    return Vec3.stackCeil.set(this.y, this.y, this.y);
                },
                set: function (v3fVec) {
                    this.y = v3fVec.x;
                    this.y = v3fVec.y;
                    this.y = v3fVec.z;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Vec3.prototype, "yyz", {
                get: function () {
                    return Vec3.stackCeil.set(this.y, this.y, this.z);
                },
                set: function (v3fVec) {
                    this.y = v3fVec.x;
                    this.y = v3fVec.y;
                    this.z = v3fVec.z;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Vec3.prototype, "yzx", {
                get: function () {
                    return Vec3.stackCeil.set(this.y, this.z, this.x);
                },
                set: function (v3fVec) {
                    this.y = v3fVec.x;
                    this.z = v3fVec.y;
                    this.x = v3fVec.z;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Vec3.prototype, "yzy", {
                get: function () {
                    return Vec3.stackCeil.set(this.y, this.z, this.y);
                },
                set: function (v3fVec) {
                    this.y = v3fVec.x;
                    this.z = v3fVec.y;
                    this.y = v3fVec.z;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Vec3.prototype, "yzz", {
                get: function () {
                    return Vec3.stackCeil.set(this.y, this.z, this.z);
                },
                set: function (v3fVec) {
                    this.y = v3fVec.x;
                    this.z = v3fVec.y;
                    this.z = v3fVec.z;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Vec3.prototype, "zxx", {
                get: function () {
                    return Vec3.stackCeil.set(this.z, this.x, this.x);
                },
                set: function (v3fVec) {
                    this.z = v3fVec.x;
                    this.x = v3fVec.y;
                    this.x = v3fVec.z;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Vec3.prototype, "zxy", {
                get: function () {
                    return Vec3.stackCeil.set(this.z, this.x, this.y);
                },
                set: function (v3fVec) {
                    this.z = v3fVec.x;
                    this.x = v3fVec.y;
                    this.y = v3fVec.z;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Vec3.prototype, "zxz", {
                get: function () {
                    return Vec3.stackCeil.set(this.z, this.x, this.z);
                },
                set: function (v3fVec) {
                    this.z = v3fVec.x;
                    this.x = v3fVec.y;
                    this.z = v3fVec.z;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Vec3.prototype, "zyx", {
                get: function () {
                    return Vec3.stackCeil.set(this.z, this.y, this.x);
                },
                set: function (v3fVec) {
                    this.z = v3fVec.x;
                    this.y = v3fVec.y;
                    this.x = v3fVec.z;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Vec3.prototype, "zyy", {
                get: function () {
                    return Vec3.stackCeil.set(this.z, this.y, this.y);
                },
                set: function (v3fVec) {
                    this.z = v3fVec.x;
                    this.y = v3fVec.y;
                    this.y = v3fVec.z;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Vec3.prototype, "zyz", {
                get: function () {
                    return Vec3.stackCeil.set(this.z, this.y, this.z);
                },
                set: function (v3fVec) {
                    this.z = v3fVec.x;
                    this.y = v3fVec.y;
                    this.z = v3fVec.z;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Vec3.prototype, "zzx", {
                get: function () {
                    return Vec3.stackCeil.set(this.z, this.z, this.x);
                },
                set: function (v3fVec) {
                    this.z = v3fVec.x;
                    this.z = v3fVec.y;
                    this.x = v3fVec.z;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Vec3.prototype, "zzy", {
                get: function () {
                    return Vec3.stackCeil.set(this.z, this.z, this.y);
                },
                set: function (v3fVec) {
                    this.z = v3fVec.x;
                    this.z = v3fVec.y;
                    this.y = v3fVec.z;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Vec3.prototype, "zzz", {
                get: function () {
                    return Vec3.stackCeil.set(this.z, this.z, this.z);
                },
                set: function (v3fVec) {
                    this.z = v3fVec.x;
                    this.z = v3fVec.y;
                    this.z = v3fVec.z;
                },
                enumerable: true,
                configurable: true
            });
            Vec3.prototype.set = function (fValue1, fValue2, fValue3) {
                var nArgumentsLength = arguments.length;
                switch(nArgumentsLength) {
                    case 0:
                        this.x = this.y = this.z = 0.;
                        break;
                    case 1:
                        if ((typeof (arguments[0]) === "number")) {
                            this.x = this.y = this.z = arguments[0];
                        } else if (arguments[0] instanceof Vec3) {
                            var v3fVec = arguments[0];
                            this.x = v3fVec.x;
                            this.y = v3fVec.y;
                            this.z = v3fVec.z;
                        } else {
                            var pArray = arguments[0];
                            this.x = pArray[0];
                            this.y = pArray[1];
                            this.z = pArray[2];
                        }
                        break;
                    case 2:
                        if ((typeof (arguments[0]) === "number")) {
                            var fValue = arguments[0];
                            var v2fVec = arguments[1];
                            this.x = fValue;
                            this.y = v2fVec.x;
                            this.z = v2fVec.y;
                        } else {
                            var v2fVec = arguments[0];
                            var fValue = arguments[1];
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
            Vec3.prototype.clear = /** @inline */function () {
                this.x = this.y = this.z = 0.;
                return this;
            };
            Vec3.prototype.add = function (v3fVec, v3fDestination) {
                if (!((v3fDestination) !== undefined)) {
                    v3fDestination = this;
                }
                v3fDestination.x = this.x + v3fVec.x;
                v3fDestination.y = this.y + v3fVec.y;
                v3fDestination.z = this.z + v3fVec.z;
                return v3fDestination;
            };
            Vec3.prototype.subtract = function (v3fVec, v3fDestination) {
                if (!((v3fDestination) !== undefined)) {
                    v3fDestination = this;
                }
                v3fDestination.x = this.x - v3fVec.x;
                v3fDestination.y = this.y - v3fVec.y;
                v3fDestination.z = this.z - v3fVec.z;
                return v3fDestination;
            };
            Vec3.prototype.dot = /** @inline */function (v3fVec) {
                return this.x * v3fVec.x + this.y * v3fVec.y + this.z * v3fVec.z;
            };
            Vec3.prototype.cross = function (v3fVec, v3fDestination) {
                if (!((v3fDestination) !== undefined)) {
                    v3fDestination = this;
                }
                var x1 = this.x, y1 = this.y, z1 = this.z;
                var x2 = v3fVec.x, y2 = v3fVec.y, z2 = v3fVec.z;
                v3fDestination.x = y1 * z2 - z1 * y2;
                v3fDestination.y = z1 * x2 - x1 * z2;
                v3fDestination.z = x1 * y2 - y1 * x2;
                return v3fDestination;
            };
            Vec3.prototype.isEqual = function (v3fVec, fEps) {
                if (typeof fEps === "undefined") { fEps = 0.; }
                if (fEps === 0.) {
                    if (this.x != v3fVec.x || this.y != v3fVec.y || this.z != v3fVec.z) {
                        return false;
                    }
                } else {
                    if (math.abs(this.x - v3fVec.x) > fEps || math.abs(this.y - v3fVec.y) > fEps || math.abs(this.z - v3fVec.z) > fEps) {
                        return false;
                    }
                }
                return true;
            };
            Vec3.prototype.isClear = function (fEps) {
                if (typeof fEps === "undefined") { fEps = 0.; }
                if (fEps === 0.) {
                    if (this.x != 0. || this.y != 0. || this.z != 0.) {
                        return false;
                    }
                } else {
                    if (math.abs(this.x) > fEps || math.abs(this.y) > fEps || math.abs(this.z) > fEps) {
                        return false;
                    }
                }
                return true;
            };
            Vec3.prototype.negate = function (v3fDestination) {
                if (!((v3fDestination) !== undefined)) {
                    v3fDestination = this;
                }
                v3fDestination.x = -this.x;
                v3fDestination.y = -this.y;
                v3fDestination.z = -this.z;
                return v3fDestination;
            };
            Vec3.prototype.scale = function () {
                var v3fDestination = (arguments.length === 2 && ((arguments[1]) !== undefined)) ? arguments[1] : this;
                if ((typeof (arguments[0]) === "number")) {
                    var fScale = arguments[0];
                    v3fDestination.x = this.x * fScale;
                    v3fDestination.y = this.y * fScale;
                    v3fDestination.z = this.z * fScale;
                } else {
                    var v3fScale = arguments[0];
                    v3fDestination.x = this.x * v3fScale.x;
                    v3fDestination.y = this.y * v3fScale.y;
                    v3fDestination.z = this.z * v3fScale.z;
                }
                return v3fDestination;
            };
            Vec3.prototype.normalize = function (v3fDestination) {
                if (!v3fDestination) {
                    v3fDestination = this;
                }
                var x = this.x, y = this.y, z = this.z;
                var fLength = math.sqrt(x * x + y * y + z * z);
                if (fLength !== 0.) {
                    var fInvLength = 1. / fLength;
                    x *= fInvLength;
                    y *= fInvLength;
                    z *= fInvLength;
                }
                v3fDestination.x = x;
                v3fDestination.y = y;
                v3fDestination.z = z;
                return v3fDestination;
            };
            Vec3.prototype.length = /** @inline */function () {
                return math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
            };
            Vec3.prototype.lengthSquare = /** @inline */function () {
                var x = this.x, y = this.y, z = this.z;
                return x * x + y * y + z * z;
            };
            Vec3.prototype.direction = function (v3fVec, v3fDestination) {
                if (!((v3fDestination) !== undefined)) {
                    v3fDestination = this;
                }
                var x = v3fVec.x - this.x;
                var y = v3fVec.y - this.y;
                var z = v3fVec.z - this.z;
                var fLength = math.sqrt(x * x + y * y + z * z);
                if (fLength !== 0.) {
                    var fInvLength = 1. / fLength;
                    x *= fInvLength;
                    y *= fInvLength;
                    z *= fInvLength;
                }
                v3fDestination.x = x;
                v3fDestination.y = y;
                v3fDestination.z = z;
                return v3fDestination;
            };
            Vec3.prototype.mix = function (v3fVec, fA, v3fDestination) {
                if (!((v3fDestination) !== undefined)) {
                    v3fDestination = this;
                }
                fA = (/*checked (origin: math)>>*/akra.math.max((0.), /*checked (origin: math)>>*/akra.math.min((fA), (1.))));
                var fA1 = 1. - fA;
                var fA2 = fA;
                v3fDestination.x = fA1 * this.x + fA2 * v3fVec.x;
                v3fDestination.y = fA1 * this.y + fA2 * v3fVec.y;
                v3fDestination.z = fA1 * this.z + fA2 * v3fVec.z;
                return v3fDestination;
            };
            Vec3.prototype.toString = /** @inline */function () {
                return "[x: " + this.x + " ,y: " + this.y + ", z: " + this.z + "]";
            };
            Vec3.prototype.toTranslationMatrix = function (m4fDestination) {
                if (!((m4fDestination) !== undefined)) {
                    m4fDestination = new math.Mat4(1.);
                } else {
                    m4fDestination.set(1.);
                }
                var pData = m4fDestination.data;
                pData[12] = this.x;
                pData[13] = this.y;
                pData[14] = this.z;
                return m4fDestination;
            };
            Vec3.prototype.vec3TransformCoord = function (m4fTransformation, v3fDestination) {
                if (!v3fDestination) {
                    v3fDestination = this;
                }
                var pData = m4fTransformation.data;
                var x = this.x;
                var y = this.y;
                var z = this.z;
                var w;
                x = pData[0] * x + pData[4] * y + pData[8] * z + pData[12];
                y = pData[1] * x + pData[5] * y + pData[9] * z + pData[13];
                z = pData[2] * x + pData[6] * y + pData[10] * z + pData[14];
                w = pData[2] * x + pData[7] * y + pData[11] * z + pData[15];
                var fInvW = 1. / w;
                v3fDestination.x = x * fInvW;
                v3fDestination.y = y * fInvW;
                v3fDestination.z = z * fInvW;
                return v3fDestination;
            };
            Object.defineProperty(Vec3, "stackCeil", {
                get: function () {
                    Vec3.stackPosition = Vec3.stackPosition === Vec3.stackSize - 1 ? 0 : Vec3.stackPosition;
                    return Vec3.stack[Vec3.stackPosition++];
                },
                enumerable: true,
                configurable: true
            });
            Vec3.stackSize = 256;
            Vec3.stackPosition = 0;
            Vec3.stack = (function () {
                var pStack = new Array(Vec3.stackSize);
                for(var i = 0; i < Vec3.stackSize; i++) {
                    pStack[i] = new Vec3();
                }
                return pStack;
            })();
            return Vec3;
        })();
        math.Vec3 = Vec3;        
    })(akra.math || (akra.math = {}));
    var math = akra.math;
})(akra || (akra = {}));
var akra;
(function (akra) {
    (function (math) {
        var Vec4 = (function () {
            function Vec4(fValue1, fValue2, fValue3, fValue4) {
                var nArgumentsLength = arguments.length;
                var v4fVec = this;
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
                        v4fVec.set(arguments[0], arguments[1]);
                        break;
                    case 3:
                        v4fVec.set(arguments[0], arguments[1], arguments[2]);
                        break;
                    case 4:
                        v4fVec.set(arguments[0], arguments[1], arguments[2], arguments[3]);
                        break;
                    default:
                        v4fVec.x = v4fVec.y = v4fVec.z = v4fVec.w = 0.;
                        break;
                }
            }
            Object.defineProperty(Vec4.prototype, "xx", {
                get: function () {
                    return math.Vec2.stackCeil.set(this.x, this.x);
                },
                set: function (v2fVec) {
                    this.x = v2fVec.x;
                    this.x = v2fVec.y;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Vec4.prototype, "xy", {
                get: function () {
                    return math.Vec2.stackCeil.set(this.x, this.y);
                },
                set: function (v2fVec) {
                    this.x = v2fVec.x;
                    this.y = v2fVec.y;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Vec4.prototype, "xz", {
                get: function () {
                    return math.Vec2.stackCeil.set(this.x, this.z);
                },
                set: function (v2fVec) {
                    this.x = v2fVec.x;
                    this.z = v2fVec.y;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Vec4.prototype, "xw", {
                get: function () {
                    return math.Vec2.stackCeil.set(this.x, this.w);
                },
                set: function (v2fVec) {
                    this.x = v2fVec.x;
                    this.w = v2fVec.y;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Vec4.prototype, "yx", {
                get: function () {
                    return math.Vec2.stackCeil.set(this.y, this.x);
                },
                set: function (v2fVec) {
                    this.y = v2fVec.x;
                    this.x = v2fVec.y;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Vec4.prototype, "yy", {
                get: function () {
                    return math.Vec2.stackCeil.set(this.y, this.y);
                },
                set: function (v2fVec) {
                    this.y = v2fVec.x;
                    this.y = v2fVec.y;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Vec4.prototype, "yz", {
                get: function () {
                    return math.Vec2.stackCeil.set(this.y, this.z);
                },
                set: function (v2fVec) {
                    this.y = v2fVec.x;
                    this.z = v2fVec.y;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Vec4.prototype, "yw", {
                get: function () {
                    return math.Vec2.stackCeil.set(this.y, this.w);
                },
                set: function (v2fVec) {
                    this.y = v2fVec.x;
                    this.w = v2fVec.y;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Vec4.prototype, "zx", {
                get: function () {
                    return math.Vec2.stackCeil.set(this.z, this.x);
                },
                set: function (v2fVec) {
                    this.z = v2fVec.x;
                    this.x = v2fVec.y;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Vec4.prototype, "zy", {
                get: function () {
                    return math.Vec2.stackCeil.set(this.z, this.y);
                },
                set: function (v2fVec) {
                    this.z = v2fVec.x;
                    this.y = v2fVec.y;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Vec4.prototype, "zz", {
                get: function () {
                    return math.Vec2.stackCeil.set(this.z, this.z);
                },
                set: function (v2fVec) {
                    this.z = v2fVec.x;
                    this.z = v2fVec.y;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Vec4.prototype, "zw", {
                get: function () {
                    return math.Vec2.stackCeil.set(this.z, this.w);
                },
                set: function (v2fVec) {
                    this.z = v2fVec.x;
                    this.w = v2fVec.y;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Vec4.prototype, "wx", {
                get: function () {
                    return math.Vec2.stackCeil.set(this.w, this.x);
                },
                set: function (v2fVec) {
                    this.w = v2fVec.x;
                    this.x = v2fVec.y;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Vec4.prototype, "wy", {
                get: function () {
                    return math.Vec2.stackCeil.set(this.w, this.y);
                },
                set: function (v2fVec) {
                    this.w = v2fVec.x;
                    this.y = v2fVec.y;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Vec4.prototype, "wz", {
                get: function () {
                    return math.Vec2.stackCeil.set(this.w, this.z);
                },
                set: function (v2fVec) {
                    this.w = v2fVec.x;
                    this.z = v2fVec.y;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Vec4.prototype, "ww", {
                get: function () {
                    return math.Vec2.stackCeil.set(this.w, this.w);
                },
                set: function (v2fVec) {
                    this.w = v2fVec.x;
                    this.w = v2fVec.y;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Vec4.prototype, "xxx", {
                get: function () {
                    return math.Vec3.stackCeil.set(this.x, this.x, this.x);
                },
                set: function (v3fVec) {
                    this.x = v3fVec.x;
                    this.x = v3fVec.y;
                    this.x = v3fVec.z;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Vec4.prototype, "xxy", {
                get: function () {
                    return math.Vec3.stackCeil.set(this.x, this.x, this.y);
                },
                set: function (v3fVec) {
                    this.x = v3fVec.x;
                    this.x = v3fVec.y;
                    this.y = v3fVec.z;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Vec4.prototype, "xxz", {
                get: function () {
                    return math.Vec3.stackCeil.set(this.x, this.x, this.z);
                },
                set: function (v3fVec) {
                    this.x = v3fVec.x;
                    this.x = v3fVec.y;
                    this.z = v3fVec.z;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Vec4.prototype, "xxw", {
                get: function () {
                    return math.Vec3.stackCeil.set(this.x, this.x, this.w);
                },
                set: function (v3fVec) {
                    this.x = v3fVec.x;
                    this.x = v3fVec.y;
                    this.w = v3fVec.z;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Vec4.prototype, "xyx", {
                get: function () {
                    return math.Vec3.stackCeil.set(this.x, this.y, this.x);
                },
                set: function (v3fVec) {
                    this.x = v3fVec.x;
                    this.y = v3fVec.y;
                    this.x = v3fVec.z;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Vec4.prototype, "xyy", {
                get: function () {
                    return math.Vec3.stackCeil.set(this.x, this.y, this.y);
                },
                set: function (v3fVec) {
                    this.x = v3fVec.x;
                    this.y = v3fVec.y;
                    this.y = v3fVec.z;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Vec4.prototype, "xyz", {
                get: function () {
                    return math.Vec3.stackCeil.set(this.x, this.y, this.z);
                },
                set: function (v3fVec) {
                    this.x = v3fVec.x;
                    this.y = v3fVec.y;
                    this.z = v3fVec.z;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Vec4.prototype, "xyw", {
                get: function () {
                    return math.Vec3.stackCeil.set(this.x, this.y, this.w);
                },
                set: function (v3fVec) {
                    this.x = v3fVec.x;
                    this.y = v3fVec.y;
                    this.w = v3fVec.z;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Vec4.prototype, "xzx", {
                get: function () {
                    return math.Vec3.stackCeil.set(this.x, this.z, this.x);
                },
                set: function (v3fVec) {
                    this.x = v3fVec.x;
                    this.z = v3fVec.y;
                    this.x = v3fVec.z;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Vec4.prototype, "xzy", {
                get: function () {
                    return math.Vec3.stackCeil.set(this.x, this.z, this.y);
                },
                set: function (v3fVec) {
                    this.x = v3fVec.x;
                    this.z = v3fVec.y;
                    this.y = v3fVec.z;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Vec4.prototype, "xzz", {
                get: function () {
                    return math.Vec3.stackCeil.set(this.x, this.z, this.z);
                },
                set: function (v3fVec) {
                    this.x = v3fVec.x;
                    this.z = v3fVec.y;
                    this.z = v3fVec.z;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Vec4.prototype, "xzw", {
                get: function () {
                    return math.Vec3.stackCeil.set(this.x, this.z, this.w);
                },
                set: function (v3fVec) {
                    this.x = v3fVec.x;
                    this.z = v3fVec.y;
                    this.w = v3fVec.z;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Vec4.prototype, "xwx", {
                get: function () {
                    return math.Vec3.stackCeil.set(this.x, this.w, this.x);
                },
                set: function (v3fVec) {
                    this.x = v3fVec.x;
                    this.w = v3fVec.y;
                    this.x = v3fVec.z;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Vec4.prototype, "xwy", {
                get: function () {
                    return math.Vec3.stackCeil.set(this.x, this.w, this.y);
                },
                set: function (v3fVec) {
                    this.x = v3fVec.x;
                    this.w = v3fVec.y;
                    this.y = v3fVec.z;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Vec4.prototype, "xwz", {
                get: function () {
                    return math.Vec3.stackCeil.set(this.x, this.w, this.z);
                },
                set: function (v3fVec) {
                    this.x = v3fVec.x;
                    this.w = v3fVec.y;
                    this.z = v3fVec.z;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Vec4.prototype, "xww", {
                get: function () {
                    return math.Vec3.stackCeil.set(this.x, this.w, this.w);
                },
                set: function (v3fVec) {
                    this.x = v3fVec.x;
                    this.w = v3fVec.y;
                    this.w = v3fVec.z;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Vec4.prototype, "yxx", {
                get: function () {
                    return math.Vec3.stackCeil.set(this.y, this.x, this.x);
                },
                set: function (v3fVec) {
                    this.y = v3fVec.x;
                    this.x = v3fVec.y;
                    this.x = v3fVec.z;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Vec4.prototype, "yxy", {
                get: function () {
                    return math.Vec3.stackCeil.set(this.y, this.x, this.y);
                },
                set: function (v3fVec) {
                    this.y = v3fVec.x;
                    this.x = v3fVec.y;
                    this.y = v3fVec.z;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Vec4.prototype, "yxz", {
                get: function () {
                    return math.Vec3.stackCeil.set(this.y, this.x, this.z);
                },
                set: function (v3fVec) {
                    this.y = v3fVec.x;
                    this.x = v3fVec.y;
                    this.z = v3fVec.z;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Vec4.prototype, "yxw", {
                get: function () {
                    return math.Vec3.stackCeil.set(this.y, this.x, this.w);
                },
                set: function (v3fVec) {
                    this.y = v3fVec.x;
                    this.x = v3fVec.y;
                    this.w = v3fVec.z;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Vec4.prototype, "yyx", {
                get: function () {
                    return math.Vec3.stackCeil.set(this.y, this.y, this.x);
                },
                set: function (v3fVec) {
                    this.y = v3fVec.x;
                    this.y = v3fVec.y;
                    this.x = v3fVec.z;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Vec4.prototype, "yyy", {
                get: function () {
                    return math.Vec3.stackCeil.set(this.y, this.y, this.y);
                },
                set: function (v3fVec) {
                    this.y = v3fVec.x;
                    this.y = v3fVec.y;
                    this.y = v3fVec.z;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Vec4.prototype, "yyz", {
                get: function () {
                    return math.Vec3.stackCeil.set(this.y, this.y, this.z);
                },
                set: function (v3fVec) {
                    this.y = v3fVec.x;
                    this.y = v3fVec.y;
                    this.z = v3fVec.z;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Vec4.prototype, "yyw", {
                get: function () {
                    return math.Vec3.stackCeil.set(this.y, this.y, this.w);
                },
                set: function (v3fVec) {
                    this.y = v3fVec.x;
                    this.y = v3fVec.y;
                    this.w = v3fVec.z;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Vec4.prototype, "yzx", {
                get: function () {
                    return math.Vec3.stackCeil.set(this.y, this.z, this.x);
                },
                set: function (v3fVec) {
                    this.y = v3fVec.x;
                    this.z = v3fVec.y;
                    this.x = v3fVec.z;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Vec4.prototype, "yzy", {
                get: function () {
                    return math.Vec3.stackCeil.set(this.y, this.z, this.y);
                },
                set: function (v3fVec) {
                    this.y = v3fVec.x;
                    this.z = v3fVec.y;
                    this.y = v3fVec.z;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Vec4.prototype, "yzz", {
                get: function () {
                    return math.Vec3.stackCeil.set(this.y, this.z, this.z);
                },
                set: function (v3fVec) {
                    this.y = v3fVec.x;
                    this.z = v3fVec.y;
                    this.z = v3fVec.z;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Vec4.prototype, "yzw", {
                get: function () {
                    return math.Vec3.stackCeil.set(this.y, this.z, this.w);
                },
                set: function (v3fVec) {
                    this.y = v3fVec.x;
                    this.z = v3fVec.y;
                    this.w = v3fVec.z;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Vec4.prototype, "ywx", {
                get: function () {
                    return math.Vec3.stackCeil.set(this.y, this.w, this.x);
                },
                set: function (v3fVec) {
                    this.y = v3fVec.x;
                    this.w = v3fVec.y;
                    this.x = v3fVec.z;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Vec4.prototype, "ywy", {
                get: function () {
                    return math.Vec3.stackCeil.set(this.y, this.w, this.y);
                },
                set: function (v3fVec) {
                    this.y = v3fVec.x;
                    this.w = v3fVec.y;
                    this.y = v3fVec.z;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Vec4.prototype, "ywz", {
                get: function () {
                    return math.Vec3.stackCeil.set(this.y, this.w, this.z);
                },
                set: function (v3fVec) {
                    this.y = v3fVec.x;
                    this.w = v3fVec.y;
                    this.z = v3fVec.z;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Vec4.prototype, "yww", {
                get: function () {
                    return math.Vec3.stackCeil.set(this.y, this.w, this.w);
                },
                set: function (v3fVec) {
                    this.y = v3fVec.x;
                    this.w = v3fVec.y;
                    this.w = v3fVec.z;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Vec4.prototype, "zxx", {
                get: function () {
                    return math.Vec3.stackCeil.set(this.z, this.x, this.x);
                },
                set: function (v3fVec) {
                    this.z = v3fVec.x;
                    this.x = v3fVec.y;
                    this.x = v3fVec.z;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Vec4.prototype, "zxy", {
                get: function () {
                    return math.Vec3.stackCeil.set(this.z, this.x, this.y);
                },
                set: function (v3fVec) {
                    this.z = v3fVec.x;
                    this.x = v3fVec.y;
                    this.y = v3fVec.z;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Vec4.prototype, "zxz", {
                get: function () {
                    return math.Vec3.stackCeil.set(this.z, this.x, this.z);
                },
                set: function (v3fVec) {
                    this.z = v3fVec.x;
                    this.x = v3fVec.y;
                    this.z = v3fVec.z;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Vec4.prototype, "zxw", {
                get: function () {
                    return math.Vec3.stackCeil.set(this.z, this.x, this.w);
                },
                set: function (v3fVec) {
                    this.z = v3fVec.x;
                    this.x = v3fVec.y;
                    this.w = v3fVec.z;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Vec4.prototype, "zyx", {
                get: function () {
                    return math.Vec3.stackCeil.set(this.z, this.y, this.x);
                },
                set: function (v3fVec) {
                    this.z = v3fVec.x;
                    this.y = v3fVec.y;
                    this.x = v3fVec.z;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Vec4.prototype, "zyy", {
                get: function () {
                    return math.Vec3.stackCeil.set(this.z, this.y, this.y);
                },
                set: function (v3fVec) {
                    this.z = v3fVec.x;
                    this.y = v3fVec.y;
                    this.y = v3fVec.z;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Vec4.prototype, "zyz", {
                get: function () {
                    return math.Vec3.stackCeil.set(this.z, this.y, this.z);
                },
                set: function (v3fVec) {
                    this.z = v3fVec.x;
                    this.y = v3fVec.y;
                    this.z = v3fVec.z;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Vec4.prototype, "zyw", {
                get: function () {
                    return math.Vec3.stackCeil.set(this.z, this.y, this.w);
                },
                set: function (v3fVec) {
                    this.z = v3fVec.x;
                    this.y = v3fVec.y;
                    this.w = v3fVec.z;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Vec4.prototype, "zzx", {
                get: function () {
                    return math.Vec3.stackCeil.set(this.z, this.z, this.x);
                },
                set: function (v3fVec) {
                    this.z = v3fVec.x;
                    this.z = v3fVec.y;
                    this.x = v3fVec.z;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Vec4.prototype, "zzy", {
                get: function () {
                    return math.Vec3.stackCeil.set(this.z, this.z, this.y);
                },
                set: function (v3fVec) {
                    this.z = v3fVec.x;
                    this.z = v3fVec.y;
                    this.y = v3fVec.z;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Vec4.prototype, "zzz", {
                get: function () {
                    return math.Vec3.stackCeil.set(this.z, this.z, this.z);
                },
                set: function (v3fVec) {
                    this.z = v3fVec.x;
                    this.z = v3fVec.y;
                    this.z = v3fVec.z;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Vec4.prototype, "zzw", {
                get: function () {
                    return math.Vec3.stackCeil.set(this.z, this.z, this.w);
                },
                set: function (v3fVec) {
                    this.z = v3fVec.x;
                    this.z = v3fVec.y;
                    this.w = v3fVec.z;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Vec4.prototype, "zwx", {
                get: function () {
                    return math.Vec3.stackCeil.set(this.z, this.w, this.x);
                },
                set: function (v3fVec) {
                    this.z = v3fVec.x;
                    this.w = v3fVec.y;
                    this.x = v3fVec.z;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Vec4.prototype, "zwy", {
                get: function () {
                    return math.Vec3.stackCeil.set(this.z, this.w, this.y);
                },
                set: function (v3fVec) {
                    this.z = v3fVec.x;
                    this.w = v3fVec.y;
                    this.y = v3fVec.z;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Vec4.prototype, "zwz", {
                get: function () {
                    return math.Vec3.stackCeil.set(this.z, this.w, this.z);
                },
                set: function (v3fVec) {
                    this.z = v3fVec.x;
                    this.w = v3fVec.y;
                    this.z = v3fVec.z;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Vec4.prototype, "zww", {
                get: function () {
                    return math.Vec3.stackCeil.set(this.z, this.w, this.w);
                },
                set: function (v3fVec) {
                    this.z = v3fVec.x;
                    this.w = v3fVec.y;
                    this.w = v3fVec.z;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Vec4.prototype, "wxx", {
                get: function () {
                    return math.Vec3.stackCeil.set(this.w, this.x, this.x);
                },
                set: function (v3fVec) {
                    this.w = v3fVec.x;
                    this.x = v3fVec.y;
                    this.x = v3fVec.z;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Vec4.prototype, "wxy", {
                get: function () {
                    return math.Vec3.stackCeil.set(this.w, this.x, this.y);
                },
                set: function (v3fVec) {
                    this.w = v3fVec.x;
                    this.x = v3fVec.y;
                    this.y = v3fVec.z;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Vec4.prototype, "wxz", {
                get: function () {
                    return math.Vec3.stackCeil.set(this.w, this.x, this.z);
                },
                set: function (v3fVec) {
                    this.w = v3fVec.x;
                    this.x = v3fVec.y;
                    this.z = v3fVec.z;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Vec4.prototype, "wxw", {
                get: function () {
                    return math.Vec3.stackCeil.set(this.w, this.x, this.w);
                },
                set: function (v3fVec) {
                    this.w = v3fVec.x;
                    this.x = v3fVec.y;
                    this.w = v3fVec.z;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Vec4.prototype, "wyx", {
                get: function () {
                    return math.Vec3.stackCeil.set(this.w, this.y, this.x);
                },
                set: function (v3fVec) {
                    this.w = v3fVec.x;
                    this.y = v3fVec.y;
                    this.x = v3fVec.z;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Vec4.prototype, "wyy", {
                get: function () {
                    return math.Vec3.stackCeil.set(this.w, this.y, this.y);
                },
                set: function (v3fVec) {
                    this.w = v3fVec.x;
                    this.y = v3fVec.y;
                    this.y = v3fVec.z;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Vec4.prototype, "wyz", {
                get: function () {
                    return math.Vec3.stackCeil.set(this.w, this.y, this.z);
                },
                set: function (v3fVec) {
                    this.w = v3fVec.x;
                    this.y = v3fVec.y;
                    this.z = v3fVec.z;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Vec4.prototype, "wyw", {
                get: function () {
                    return math.Vec3.stackCeil.set(this.w, this.y, this.w);
                },
                set: function (v3fVec) {
                    this.w = v3fVec.x;
                    this.y = v3fVec.y;
                    this.w = v3fVec.z;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Vec4.prototype, "wzx", {
                get: function () {
                    return math.Vec3.stackCeil.set(this.w, this.z, this.x);
                },
                set: function (v3fVec) {
                    this.w = v3fVec.x;
                    this.z = v3fVec.y;
                    this.x = v3fVec.z;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Vec4.prototype, "wzy", {
                get: function () {
                    return math.Vec3.stackCeil.set(this.w, this.z, this.y);
                },
                set: function (v3fVec) {
                    this.w = v3fVec.x;
                    this.z = v3fVec.y;
                    this.y = v3fVec.z;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Vec4.prototype, "wzz", {
                get: function () {
                    return math.Vec3.stackCeil.set(this.w, this.z, this.z);
                },
                set: function (v3fVec) {
                    this.w = v3fVec.x;
                    this.z = v3fVec.y;
                    this.z = v3fVec.z;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Vec4.prototype, "wzw", {
                get: function () {
                    return math.Vec3.stackCeil.set(this.w, this.z, this.w);
                },
                set: function (v3fVec) {
                    this.w = v3fVec.x;
                    this.z = v3fVec.y;
                    this.w = v3fVec.z;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Vec4.prototype, "wwx", {
                get: function () {
                    return math.Vec3.stackCeil.set(this.w, this.w, this.x);
                },
                set: function (v3fVec) {
                    this.w = v3fVec.x;
                    this.w = v3fVec.y;
                    this.x = v3fVec.z;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Vec4.prototype, "wwy", {
                get: function () {
                    return math.Vec3.stackCeil.set(this.w, this.w, this.y);
                },
                set: function (v3fVec) {
                    this.w = v3fVec.x;
                    this.w = v3fVec.y;
                    this.y = v3fVec.z;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Vec4.prototype, "wwz", {
                get: function () {
                    return math.Vec3.stackCeil.set(this.w, this.w, this.z);
                },
                set: function (v3fVec) {
                    this.w = v3fVec.x;
                    this.w = v3fVec.y;
                    this.z = v3fVec.z;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Vec4.prototype, "www", {
                get: function () {
                    return math.Vec3.stackCeil.set(this.w, this.w, this.w);
                },
                set: function (v3fVec) {
                    this.w = v3fVec.x;
                    this.w = v3fVec.y;
                    this.w = v3fVec.z;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Vec4.prototype, "xxxx", {
                get: function () {
                    return Vec4.stackCeil.set(this.x, this.x, this.x, this.x);
                },
                set: function (v4fVec) {
                    this.x = v4fVec.x;
                    this.x = v4fVec.y;
                    this.x = v4fVec.z;
                    this.x = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Vec4.prototype, "xxxy", {
                get: function () {
                    return Vec4.stackCeil.set(this.x, this.x, this.x, this.y);
                },
                set: function (v4fVec) {
                    this.x = v4fVec.x;
                    this.x = v4fVec.y;
                    this.x = v4fVec.z;
                    this.y = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Vec4.prototype, "xxxz", {
                get: function () {
                    return Vec4.stackCeil.set(this.x, this.x, this.x, this.z);
                },
                set: function (v4fVec) {
                    this.x = v4fVec.x;
                    this.x = v4fVec.y;
                    this.x = v4fVec.z;
                    this.z = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Vec4.prototype, "xxxw", {
                get: function () {
                    return Vec4.stackCeil.set(this.x, this.x, this.x, this.w);
                },
                set: function (v4fVec) {
                    this.x = v4fVec.x;
                    this.x = v4fVec.y;
                    this.x = v4fVec.z;
                    this.w = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Vec4.prototype, "xxyx", {
                get: function () {
                    return Vec4.stackCeil.set(this.x, this.x, this.y, this.x);
                },
                set: function (v4fVec) {
                    this.x = v4fVec.x;
                    this.x = v4fVec.y;
                    this.y = v4fVec.z;
                    this.x = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Vec4.prototype, "xxyy", {
                get: function () {
                    return Vec4.stackCeil.set(this.x, this.x, this.y, this.y);
                },
                set: function (v4fVec) {
                    this.x = v4fVec.x;
                    this.x = v4fVec.y;
                    this.y = v4fVec.z;
                    this.y = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Vec4.prototype, "xxyz", {
                get: function () {
                    return Vec4.stackCeil.set(this.x, this.x, this.y, this.z);
                },
                set: function (v4fVec) {
                    this.x = v4fVec.x;
                    this.x = v4fVec.y;
                    this.y = v4fVec.z;
                    this.z = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Vec4.prototype, "xxyw", {
                get: function () {
                    return Vec4.stackCeil.set(this.x, this.x, this.y, this.w);
                },
                set: function (v4fVec) {
                    this.x = v4fVec.x;
                    this.x = v4fVec.y;
                    this.y = v4fVec.z;
                    this.w = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Vec4.prototype, "xxzx", {
                get: function () {
                    return Vec4.stackCeil.set(this.x, this.x, this.z, this.x);
                },
                set: function (v4fVec) {
                    this.x = v4fVec.x;
                    this.x = v4fVec.y;
                    this.z = v4fVec.z;
                    this.x = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Vec4.prototype, "xxzy", {
                get: function () {
                    return Vec4.stackCeil.set(this.x, this.x, this.z, this.y);
                },
                set: function (v4fVec) {
                    this.x = v4fVec.x;
                    this.x = v4fVec.y;
                    this.z = v4fVec.z;
                    this.y = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Vec4.prototype, "xxzz", {
                get: function () {
                    return Vec4.stackCeil.set(this.x, this.x, this.z, this.z);
                },
                set: function (v4fVec) {
                    this.x = v4fVec.x;
                    this.x = v4fVec.y;
                    this.z = v4fVec.z;
                    this.z = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Vec4.prototype, "xxzw", {
                get: function () {
                    return Vec4.stackCeil.set(this.x, this.x, this.z, this.w);
                },
                set: function (v4fVec) {
                    this.x = v4fVec.x;
                    this.x = v4fVec.y;
                    this.z = v4fVec.z;
                    this.w = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Vec4.prototype, "xxwx", {
                get: function () {
                    return Vec4.stackCeil.set(this.x, this.x, this.w, this.x);
                },
                set: function (v4fVec) {
                    this.x = v4fVec.x;
                    this.x = v4fVec.y;
                    this.w = v4fVec.z;
                    this.x = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Vec4.prototype, "xxwy", {
                get: function () {
                    return Vec4.stackCeil.set(this.x, this.x, this.w, this.y);
                },
                set: function (v4fVec) {
                    this.x = v4fVec.x;
                    this.x = v4fVec.y;
                    this.w = v4fVec.z;
                    this.y = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Vec4.prototype, "xxwz", {
                get: function () {
                    return Vec4.stackCeil.set(this.x, this.x, this.w, this.z);
                },
                set: function (v4fVec) {
                    this.x = v4fVec.x;
                    this.x = v4fVec.y;
                    this.w = v4fVec.z;
                    this.z = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Vec4.prototype, "xxww", {
                get: function () {
                    return Vec4.stackCeil.set(this.x, this.x, this.w, this.w);
                },
                set: function (v4fVec) {
                    this.x = v4fVec.x;
                    this.x = v4fVec.y;
                    this.w = v4fVec.z;
                    this.w = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Vec4.prototype, "xyxx", {
                get: function () {
                    return Vec4.stackCeil.set(this.x, this.y, this.x, this.x);
                },
                set: function (v4fVec) {
                    this.x = v4fVec.x;
                    this.y = v4fVec.y;
                    this.x = v4fVec.z;
                    this.x = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Vec4.prototype, "xyxy", {
                get: function () {
                    return Vec4.stackCeil.set(this.x, this.y, this.x, this.y);
                },
                set: function (v4fVec) {
                    this.x = v4fVec.x;
                    this.y = v4fVec.y;
                    this.x = v4fVec.z;
                    this.y = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Vec4.prototype, "xyxz", {
                get: function () {
                    return Vec4.stackCeil.set(this.x, this.y, this.x, this.z);
                },
                set: function (v4fVec) {
                    this.x = v4fVec.x;
                    this.y = v4fVec.y;
                    this.x = v4fVec.z;
                    this.z = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Vec4.prototype, "xyxw", {
                get: function () {
                    return Vec4.stackCeil.set(this.x, this.y, this.x, this.w);
                },
                set: function (v4fVec) {
                    this.x = v4fVec.x;
                    this.y = v4fVec.y;
                    this.x = v4fVec.z;
                    this.w = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Vec4.prototype, "xyyx", {
                get: function () {
                    return Vec4.stackCeil.set(this.x, this.y, this.y, this.x);
                },
                set: function (v4fVec) {
                    this.x = v4fVec.x;
                    this.y = v4fVec.y;
                    this.y = v4fVec.z;
                    this.x = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Vec4.prototype, "xyyy", {
                get: function () {
                    return Vec4.stackCeil.set(this.x, this.y, this.y, this.y);
                },
                set: function (v4fVec) {
                    this.x = v4fVec.x;
                    this.y = v4fVec.y;
                    this.y = v4fVec.z;
                    this.y = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Vec4.prototype, "xyyz", {
                get: function () {
                    return Vec4.stackCeil.set(this.x, this.y, this.y, this.z);
                },
                set: function (v4fVec) {
                    this.x = v4fVec.x;
                    this.y = v4fVec.y;
                    this.y = v4fVec.z;
                    this.z = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Vec4.prototype, "xyyw", {
                get: function () {
                    return Vec4.stackCeil.set(this.x, this.y, this.y, this.w);
                },
                set: function (v4fVec) {
                    this.x = v4fVec.x;
                    this.y = v4fVec.y;
                    this.y = v4fVec.z;
                    this.w = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Vec4.prototype, "xyzx", {
                get: function () {
                    return Vec4.stackCeil.set(this.x, this.y, this.z, this.x);
                },
                set: function (v4fVec) {
                    this.x = v4fVec.x;
                    this.y = v4fVec.y;
                    this.z = v4fVec.z;
                    this.x = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Vec4.prototype, "xyzy", {
                get: function () {
                    return Vec4.stackCeil.set(this.x, this.y, this.z, this.y);
                },
                set: function (v4fVec) {
                    this.x = v4fVec.x;
                    this.y = v4fVec.y;
                    this.z = v4fVec.z;
                    this.y = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Vec4.prototype, "xyzz", {
                get: function () {
                    return Vec4.stackCeil.set(this.x, this.y, this.z, this.z);
                },
                set: function (v4fVec) {
                    this.x = v4fVec.x;
                    this.y = v4fVec.y;
                    this.z = v4fVec.z;
                    this.z = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Vec4.prototype, "xyzw", {
                get: function () {
                    return Vec4.stackCeil.set(this.x, this.y, this.z, this.w);
                },
                set: function (v4fVec) {
                    this.x = v4fVec.x;
                    this.y = v4fVec.y;
                    this.z = v4fVec.z;
                    this.w = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Vec4.prototype, "xywx", {
                get: function () {
                    return Vec4.stackCeil.set(this.x, this.y, this.w, this.x);
                },
                set: function (v4fVec) {
                    this.x = v4fVec.x;
                    this.y = v4fVec.y;
                    this.w = v4fVec.z;
                    this.x = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Vec4.prototype, "xywy", {
                get: function () {
                    return Vec4.stackCeil.set(this.x, this.y, this.w, this.y);
                },
                set: function (v4fVec) {
                    this.x = v4fVec.x;
                    this.y = v4fVec.y;
                    this.w = v4fVec.z;
                    this.y = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Vec4.prototype, "xywz", {
                get: function () {
                    return Vec4.stackCeil.set(this.x, this.y, this.w, this.z);
                },
                set: function (v4fVec) {
                    this.x = v4fVec.x;
                    this.y = v4fVec.y;
                    this.w = v4fVec.z;
                    this.z = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Vec4.prototype, "xyww", {
                get: function () {
                    return Vec4.stackCeil.set(this.x, this.y, this.w, this.w);
                },
                set: function (v4fVec) {
                    this.x = v4fVec.x;
                    this.y = v4fVec.y;
                    this.w = v4fVec.z;
                    this.w = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Vec4.prototype, "xzxx", {
                get: function () {
                    return Vec4.stackCeil.set(this.x, this.z, this.x, this.x);
                },
                set: function (v4fVec) {
                    this.x = v4fVec.x;
                    this.z = v4fVec.y;
                    this.x = v4fVec.z;
                    this.x = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Vec4.prototype, "xzxy", {
                get: function () {
                    return Vec4.stackCeil.set(this.x, this.z, this.x, this.y);
                },
                set: function (v4fVec) {
                    this.x = v4fVec.x;
                    this.z = v4fVec.y;
                    this.x = v4fVec.z;
                    this.y = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Vec4.prototype, "xzxz", {
                get: function () {
                    return Vec4.stackCeil.set(this.x, this.z, this.x, this.z);
                },
                set: function (v4fVec) {
                    this.x = v4fVec.x;
                    this.z = v4fVec.y;
                    this.x = v4fVec.z;
                    this.z = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Vec4.prototype, "xzxw", {
                get: function () {
                    return Vec4.stackCeil.set(this.x, this.z, this.x, this.w);
                },
                set: function (v4fVec) {
                    this.x = v4fVec.x;
                    this.z = v4fVec.y;
                    this.x = v4fVec.z;
                    this.w = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Vec4.prototype, "xzyx", {
                get: function () {
                    return Vec4.stackCeil.set(this.x, this.z, this.y, this.x);
                },
                set: function (v4fVec) {
                    this.x = v4fVec.x;
                    this.z = v4fVec.y;
                    this.y = v4fVec.z;
                    this.x = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Vec4.prototype, "xzyy", {
                get: function () {
                    return Vec4.stackCeil.set(this.x, this.z, this.y, this.y);
                },
                set: function (v4fVec) {
                    this.x = v4fVec.x;
                    this.z = v4fVec.y;
                    this.y = v4fVec.z;
                    this.y = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Vec4.prototype, "xzyz", {
                get: function () {
                    return Vec4.stackCeil.set(this.x, this.z, this.y, this.z);
                },
                set: function (v4fVec) {
                    this.x = v4fVec.x;
                    this.z = v4fVec.y;
                    this.y = v4fVec.z;
                    this.z = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Vec4.prototype, "xzyw", {
                get: function () {
                    return Vec4.stackCeil.set(this.x, this.z, this.y, this.w);
                },
                set: function (v4fVec) {
                    this.x = v4fVec.x;
                    this.z = v4fVec.y;
                    this.y = v4fVec.z;
                    this.w = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Vec4.prototype, "xzzx", {
                get: function () {
                    return Vec4.stackCeil.set(this.x, this.z, this.z, this.x);
                },
                set: function (v4fVec) {
                    this.x = v4fVec.x;
                    this.z = v4fVec.y;
                    this.z = v4fVec.z;
                    this.x = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Vec4.prototype, "xzzy", {
                get: function () {
                    return Vec4.stackCeil.set(this.x, this.z, this.z, this.y);
                },
                set: function (v4fVec) {
                    this.x = v4fVec.x;
                    this.z = v4fVec.y;
                    this.z = v4fVec.z;
                    this.y = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Vec4.prototype, "xzzz", {
                get: function () {
                    return Vec4.stackCeil.set(this.x, this.z, this.z, this.z);
                },
                set: function (v4fVec) {
                    this.x = v4fVec.x;
                    this.z = v4fVec.y;
                    this.z = v4fVec.z;
                    this.z = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Vec4.prototype, "xzzw", {
                get: function () {
                    return Vec4.stackCeil.set(this.x, this.z, this.z, this.w);
                },
                set: function (v4fVec) {
                    this.x = v4fVec.x;
                    this.z = v4fVec.y;
                    this.z = v4fVec.z;
                    this.w = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Vec4.prototype, "xzwx", {
                get: function () {
                    return Vec4.stackCeil.set(this.x, this.z, this.w, this.x);
                },
                set: function (v4fVec) {
                    this.x = v4fVec.x;
                    this.z = v4fVec.y;
                    this.w = v4fVec.z;
                    this.x = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Vec4.prototype, "xzwy", {
                get: function () {
                    return Vec4.stackCeil.set(this.x, this.z, this.w, this.y);
                },
                set: function (v4fVec) {
                    this.x = v4fVec.x;
                    this.z = v4fVec.y;
                    this.w = v4fVec.z;
                    this.y = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Vec4.prototype, "xzwz", {
                get: function () {
                    return Vec4.stackCeil.set(this.x, this.z, this.w, this.z);
                },
                set: function (v4fVec) {
                    this.x = v4fVec.x;
                    this.z = v4fVec.y;
                    this.w = v4fVec.z;
                    this.z = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Vec4.prototype, "xzww", {
                get: function () {
                    return Vec4.stackCeil.set(this.x, this.z, this.w, this.w);
                },
                set: function (v4fVec) {
                    this.x = v4fVec.x;
                    this.z = v4fVec.y;
                    this.w = v4fVec.z;
                    this.w = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Vec4.prototype, "xwxx", {
                get: function () {
                    return Vec4.stackCeil.set(this.x, this.w, this.x, this.x);
                },
                set: function (v4fVec) {
                    this.x = v4fVec.x;
                    this.w = v4fVec.y;
                    this.x = v4fVec.z;
                    this.x = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Vec4.prototype, "xwxy", {
                get: function () {
                    return Vec4.stackCeil.set(this.x, this.w, this.x, this.y);
                },
                set: function (v4fVec) {
                    this.x = v4fVec.x;
                    this.w = v4fVec.y;
                    this.x = v4fVec.z;
                    this.y = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Vec4.prototype, "xwxz", {
                get: function () {
                    return Vec4.stackCeil.set(this.x, this.w, this.x, this.z);
                },
                set: function (v4fVec) {
                    this.x = v4fVec.x;
                    this.w = v4fVec.y;
                    this.x = v4fVec.z;
                    this.z = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Vec4.prototype, "xwxw", {
                get: function () {
                    return Vec4.stackCeil.set(this.x, this.w, this.x, this.w);
                },
                set: function (v4fVec) {
                    this.x = v4fVec.x;
                    this.w = v4fVec.y;
                    this.x = v4fVec.z;
                    this.w = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Vec4.prototype, "xwyx", {
                get: function () {
                    return Vec4.stackCeil.set(this.x, this.w, this.y, this.x);
                },
                set: function (v4fVec) {
                    this.x = v4fVec.x;
                    this.w = v4fVec.y;
                    this.y = v4fVec.z;
                    this.x = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Vec4.prototype, "xwyy", {
                get: function () {
                    return Vec4.stackCeil.set(this.x, this.w, this.y, this.y);
                },
                set: function (v4fVec) {
                    this.x = v4fVec.x;
                    this.w = v4fVec.y;
                    this.y = v4fVec.z;
                    this.y = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Vec4.prototype, "xwyz", {
                get: function () {
                    return Vec4.stackCeil.set(this.x, this.w, this.y, this.z);
                },
                set: function (v4fVec) {
                    this.x = v4fVec.x;
                    this.w = v4fVec.y;
                    this.y = v4fVec.z;
                    this.z = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Vec4.prototype, "xwyw", {
                get: function () {
                    return Vec4.stackCeil.set(this.x, this.w, this.y, this.w);
                },
                set: function (v4fVec) {
                    this.x = v4fVec.x;
                    this.w = v4fVec.y;
                    this.y = v4fVec.z;
                    this.w = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Vec4.prototype, "xwzx", {
                get: function () {
                    return Vec4.stackCeil.set(this.x, this.w, this.z, this.x);
                },
                set: function (v4fVec) {
                    this.x = v4fVec.x;
                    this.w = v4fVec.y;
                    this.z = v4fVec.z;
                    this.x = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Vec4.prototype, "xwzy", {
                get: function () {
                    return Vec4.stackCeil.set(this.x, this.w, this.z, this.y);
                },
                set: function (v4fVec) {
                    this.x = v4fVec.x;
                    this.w = v4fVec.y;
                    this.z = v4fVec.z;
                    this.y = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Vec4.prototype, "xwzz", {
                get: function () {
                    return Vec4.stackCeil.set(this.x, this.w, this.z, this.z);
                },
                set: function (v4fVec) {
                    this.x = v4fVec.x;
                    this.w = v4fVec.y;
                    this.z = v4fVec.z;
                    this.z = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Vec4.prototype, "xwzw", {
                get: function () {
                    return Vec4.stackCeil.set(this.x, this.w, this.z, this.w);
                },
                set: function (v4fVec) {
                    this.x = v4fVec.x;
                    this.w = v4fVec.y;
                    this.z = v4fVec.z;
                    this.w = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Vec4.prototype, "xwwx", {
                get: function () {
                    return Vec4.stackCeil.set(this.x, this.w, this.w, this.x);
                },
                set: function (v4fVec) {
                    this.x = v4fVec.x;
                    this.w = v4fVec.y;
                    this.w = v4fVec.z;
                    this.x = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Vec4.prototype, "xwwy", {
                get: function () {
                    return Vec4.stackCeil.set(this.x, this.w, this.w, this.y);
                },
                set: function (v4fVec) {
                    this.x = v4fVec.x;
                    this.w = v4fVec.y;
                    this.w = v4fVec.z;
                    this.y = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Vec4.prototype, "xwwz", {
                get: function () {
                    return Vec4.stackCeil.set(this.x, this.w, this.w, this.z);
                },
                set: function (v4fVec) {
                    this.x = v4fVec.x;
                    this.w = v4fVec.y;
                    this.w = v4fVec.z;
                    this.z = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Vec4.prototype, "xwww", {
                get: function () {
                    return Vec4.stackCeil.set(this.x, this.w, this.w, this.w);
                },
                set: function (v4fVec) {
                    this.x = v4fVec.x;
                    this.w = v4fVec.y;
                    this.w = v4fVec.z;
                    this.w = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Vec4.prototype, "yxxx", {
                get: function () {
                    return Vec4.stackCeil.set(this.y, this.x, this.x, this.x);
                },
                set: function (v4fVec) {
                    this.y = v4fVec.x;
                    this.x = v4fVec.y;
                    this.x = v4fVec.z;
                    this.x = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Vec4.prototype, "yxxy", {
                get: function () {
                    return Vec4.stackCeil.set(this.y, this.x, this.x, this.y);
                },
                set: function (v4fVec) {
                    this.y = v4fVec.x;
                    this.x = v4fVec.y;
                    this.x = v4fVec.z;
                    this.y = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Vec4.prototype, "yxxz", {
                get: function () {
                    return Vec4.stackCeil.set(this.y, this.x, this.x, this.z);
                },
                set: function (v4fVec) {
                    this.y = v4fVec.x;
                    this.x = v4fVec.y;
                    this.x = v4fVec.z;
                    this.z = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Vec4.prototype, "yxxw", {
                get: function () {
                    return Vec4.stackCeil.set(this.y, this.x, this.x, this.w);
                },
                set: function (v4fVec) {
                    this.y = v4fVec.x;
                    this.x = v4fVec.y;
                    this.x = v4fVec.z;
                    this.w = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Vec4.prototype, "yxyx", {
                get: function () {
                    return Vec4.stackCeil.set(this.y, this.x, this.y, this.x);
                },
                set: function (v4fVec) {
                    this.y = v4fVec.x;
                    this.x = v4fVec.y;
                    this.y = v4fVec.z;
                    this.x = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Vec4.prototype, "yxyy", {
                get: function () {
                    return Vec4.stackCeil.set(this.y, this.x, this.y, this.y);
                },
                set: function (v4fVec) {
                    this.y = v4fVec.x;
                    this.x = v4fVec.y;
                    this.y = v4fVec.z;
                    this.y = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Vec4.prototype, "yxyz", {
                get: function () {
                    return Vec4.stackCeil.set(this.y, this.x, this.y, this.z);
                },
                set: function (v4fVec) {
                    this.y = v4fVec.x;
                    this.x = v4fVec.y;
                    this.y = v4fVec.z;
                    this.z = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Vec4.prototype, "yxyw", {
                get: function () {
                    return Vec4.stackCeil.set(this.y, this.x, this.y, this.w);
                },
                set: function (v4fVec) {
                    this.y = v4fVec.x;
                    this.x = v4fVec.y;
                    this.y = v4fVec.z;
                    this.w = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Vec4.prototype, "yxzx", {
                get: function () {
                    return Vec4.stackCeil.set(this.y, this.x, this.z, this.x);
                },
                set: function (v4fVec) {
                    this.y = v4fVec.x;
                    this.x = v4fVec.y;
                    this.z = v4fVec.z;
                    this.x = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Vec4.prototype, "yxzy", {
                get: function () {
                    return Vec4.stackCeil.set(this.y, this.x, this.z, this.y);
                },
                set: function (v4fVec) {
                    this.y = v4fVec.x;
                    this.x = v4fVec.y;
                    this.z = v4fVec.z;
                    this.y = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Vec4.prototype, "yxzz", {
                get: function () {
                    return Vec4.stackCeil.set(this.y, this.x, this.z, this.z);
                },
                set: function (v4fVec) {
                    this.y = v4fVec.x;
                    this.x = v4fVec.y;
                    this.z = v4fVec.z;
                    this.z = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Vec4.prototype, "yxzw", {
                get: function () {
                    return Vec4.stackCeil.set(this.y, this.x, this.z, this.w);
                },
                set: function (v4fVec) {
                    this.y = v4fVec.x;
                    this.x = v4fVec.y;
                    this.z = v4fVec.z;
                    this.w = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Vec4.prototype, "yxwx", {
                get: function () {
                    return Vec4.stackCeil.set(this.y, this.x, this.w, this.x);
                },
                set: function (v4fVec) {
                    this.y = v4fVec.x;
                    this.x = v4fVec.y;
                    this.w = v4fVec.z;
                    this.x = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Vec4.prototype, "yxwy", {
                get: function () {
                    return Vec4.stackCeil.set(this.y, this.x, this.w, this.y);
                },
                set: function (v4fVec) {
                    this.y = v4fVec.x;
                    this.x = v4fVec.y;
                    this.w = v4fVec.z;
                    this.y = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Vec4.prototype, "yxwz", {
                get: function () {
                    return Vec4.stackCeil.set(this.y, this.x, this.w, this.z);
                },
                set: function (v4fVec) {
                    this.y = v4fVec.x;
                    this.x = v4fVec.y;
                    this.w = v4fVec.z;
                    this.z = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Vec4.prototype, "yxww", {
                get: function () {
                    return Vec4.stackCeil.set(this.y, this.x, this.w, this.w);
                },
                set: function (v4fVec) {
                    this.y = v4fVec.x;
                    this.x = v4fVec.y;
                    this.w = v4fVec.z;
                    this.w = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Vec4.prototype, "yyxx", {
                get: function () {
                    return Vec4.stackCeil.set(this.y, this.y, this.x, this.x);
                },
                set: function (v4fVec) {
                    this.y = v4fVec.x;
                    this.y = v4fVec.y;
                    this.x = v4fVec.z;
                    this.x = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Vec4.prototype, "yyxy", {
                get: function () {
                    return Vec4.stackCeil.set(this.y, this.y, this.x, this.y);
                },
                set: function (v4fVec) {
                    this.y = v4fVec.x;
                    this.y = v4fVec.y;
                    this.x = v4fVec.z;
                    this.y = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Vec4.prototype, "yyxz", {
                get: function () {
                    return Vec4.stackCeil.set(this.y, this.y, this.x, this.z);
                },
                set: function (v4fVec) {
                    this.y = v4fVec.x;
                    this.y = v4fVec.y;
                    this.x = v4fVec.z;
                    this.z = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Vec4.prototype, "yyxw", {
                get: function () {
                    return Vec4.stackCeil.set(this.y, this.y, this.x, this.w);
                },
                set: function (v4fVec) {
                    this.y = v4fVec.x;
                    this.y = v4fVec.y;
                    this.x = v4fVec.z;
                    this.w = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Vec4.prototype, "yyyx", {
                get: function () {
                    return Vec4.stackCeil.set(this.y, this.y, this.y, this.x);
                },
                set: function (v4fVec) {
                    this.y = v4fVec.x;
                    this.y = v4fVec.y;
                    this.y = v4fVec.z;
                    this.x = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Vec4.prototype, "yyyy", {
                get: function () {
                    return Vec4.stackCeil.set(this.y, this.y, this.y, this.y);
                },
                set: function (v4fVec) {
                    this.y = v4fVec.x;
                    this.y = v4fVec.y;
                    this.y = v4fVec.z;
                    this.y = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Vec4.prototype, "yyyz", {
                get: function () {
                    return Vec4.stackCeil.set(this.y, this.y, this.y, this.z);
                },
                set: function (v4fVec) {
                    this.y = v4fVec.x;
                    this.y = v4fVec.y;
                    this.y = v4fVec.z;
                    this.z = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Vec4.prototype, "yyyw", {
                get: function () {
                    return Vec4.stackCeil.set(this.y, this.y, this.y, this.w);
                },
                set: function (v4fVec) {
                    this.y = v4fVec.x;
                    this.y = v4fVec.y;
                    this.y = v4fVec.z;
                    this.w = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Vec4.prototype, "yyzx", {
                get: function () {
                    return Vec4.stackCeil.set(this.y, this.y, this.z, this.x);
                },
                set: function (v4fVec) {
                    this.y = v4fVec.x;
                    this.y = v4fVec.y;
                    this.z = v4fVec.z;
                    this.x = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Vec4.prototype, "yyzy", {
                get: function () {
                    return Vec4.stackCeil.set(this.y, this.y, this.z, this.y);
                },
                set: function (v4fVec) {
                    this.y = v4fVec.x;
                    this.y = v4fVec.y;
                    this.z = v4fVec.z;
                    this.y = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Vec4.prototype, "yyzz", {
                get: function () {
                    return Vec4.stackCeil.set(this.y, this.y, this.z, this.z);
                },
                set: function (v4fVec) {
                    this.y = v4fVec.x;
                    this.y = v4fVec.y;
                    this.z = v4fVec.z;
                    this.z = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Vec4.prototype, "yyzw", {
                get: function () {
                    return Vec4.stackCeil.set(this.y, this.y, this.z, this.w);
                },
                set: function (v4fVec) {
                    this.y = v4fVec.x;
                    this.y = v4fVec.y;
                    this.z = v4fVec.z;
                    this.w = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Vec4.prototype, "yywx", {
                get: function () {
                    return Vec4.stackCeil.set(this.y, this.y, this.w, this.x);
                },
                set: function (v4fVec) {
                    this.y = v4fVec.x;
                    this.y = v4fVec.y;
                    this.w = v4fVec.z;
                    this.x = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Vec4.prototype, "yywy", {
                get: function () {
                    return Vec4.stackCeil.set(this.y, this.y, this.w, this.y);
                },
                set: function (v4fVec) {
                    this.y = v4fVec.x;
                    this.y = v4fVec.y;
                    this.w = v4fVec.z;
                    this.y = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Vec4.prototype, "yywz", {
                get: function () {
                    return Vec4.stackCeil.set(this.y, this.y, this.w, this.z);
                },
                set: function (v4fVec) {
                    this.y = v4fVec.x;
                    this.y = v4fVec.y;
                    this.w = v4fVec.z;
                    this.z = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Vec4.prototype, "yyww", {
                get: function () {
                    return Vec4.stackCeil.set(this.y, this.y, this.w, this.w);
                },
                set: function (v4fVec) {
                    this.y = v4fVec.x;
                    this.y = v4fVec.y;
                    this.w = v4fVec.z;
                    this.w = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Vec4.prototype, "yzxx", {
                get: function () {
                    return Vec4.stackCeil.set(this.y, this.z, this.x, this.x);
                },
                set: function (v4fVec) {
                    this.y = v4fVec.x;
                    this.z = v4fVec.y;
                    this.x = v4fVec.z;
                    this.x = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Vec4.prototype, "yzxy", {
                get: function () {
                    return Vec4.stackCeil.set(this.y, this.z, this.x, this.y);
                },
                set: function (v4fVec) {
                    this.y = v4fVec.x;
                    this.z = v4fVec.y;
                    this.x = v4fVec.z;
                    this.y = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Vec4.prototype, "yzxz", {
                get: function () {
                    return Vec4.stackCeil.set(this.y, this.z, this.x, this.z);
                },
                set: function (v4fVec) {
                    this.y = v4fVec.x;
                    this.z = v4fVec.y;
                    this.x = v4fVec.z;
                    this.z = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Vec4.prototype, "yzxw", {
                get: function () {
                    return Vec4.stackCeil.set(this.y, this.z, this.x, this.w);
                },
                set: function (v4fVec) {
                    this.y = v4fVec.x;
                    this.z = v4fVec.y;
                    this.x = v4fVec.z;
                    this.w = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Vec4.prototype, "yzyx", {
                get: function () {
                    return Vec4.stackCeil.set(this.y, this.z, this.y, this.x);
                },
                set: function (v4fVec) {
                    this.y = v4fVec.x;
                    this.z = v4fVec.y;
                    this.y = v4fVec.z;
                    this.x = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Vec4.prototype, "yzyy", {
                get: function () {
                    return Vec4.stackCeil.set(this.y, this.z, this.y, this.y);
                },
                set: function (v4fVec) {
                    this.y = v4fVec.x;
                    this.z = v4fVec.y;
                    this.y = v4fVec.z;
                    this.y = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Vec4.prototype, "yzyz", {
                get: function () {
                    return Vec4.stackCeil.set(this.y, this.z, this.y, this.z);
                },
                set: function (v4fVec) {
                    this.y = v4fVec.x;
                    this.z = v4fVec.y;
                    this.y = v4fVec.z;
                    this.z = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Vec4.prototype, "yzyw", {
                get: function () {
                    return Vec4.stackCeil.set(this.y, this.z, this.y, this.w);
                },
                set: function (v4fVec) {
                    this.y = v4fVec.x;
                    this.z = v4fVec.y;
                    this.y = v4fVec.z;
                    this.w = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Vec4.prototype, "yzzx", {
                get: function () {
                    return Vec4.stackCeil.set(this.y, this.z, this.z, this.x);
                },
                set: function (v4fVec) {
                    this.y = v4fVec.x;
                    this.z = v4fVec.y;
                    this.z = v4fVec.z;
                    this.x = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Vec4.prototype, "yzzy", {
                get: function () {
                    return Vec4.stackCeil.set(this.y, this.z, this.z, this.y);
                },
                set: function (v4fVec) {
                    this.y = v4fVec.x;
                    this.z = v4fVec.y;
                    this.z = v4fVec.z;
                    this.y = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Vec4.prototype, "yzzz", {
                get: function () {
                    return Vec4.stackCeil.set(this.y, this.z, this.z, this.z);
                },
                set: function (v4fVec) {
                    this.y = v4fVec.x;
                    this.z = v4fVec.y;
                    this.z = v4fVec.z;
                    this.z = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Vec4.prototype, "yzzw", {
                get: function () {
                    return Vec4.stackCeil.set(this.y, this.z, this.z, this.w);
                },
                set: function (v4fVec) {
                    this.y = v4fVec.x;
                    this.z = v4fVec.y;
                    this.z = v4fVec.z;
                    this.w = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Vec4.prototype, "yzwx", {
                get: function () {
                    return Vec4.stackCeil.set(this.y, this.z, this.w, this.x);
                },
                set: function (v4fVec) {
                    this.y = v4fVec.x;
                    this.z = v4fVec.y;
                    this.w = v4fVec.z;
                    this.x = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Vec4.prototype, "yzwy", {
                get: function () {
                    return Vec4.stackCeil.set(this.y, this.z, this.w, this.y);
                },
                set: function (v4fVec) {
                    this.y = v4fVec.x;
                    this.z = v4fVec.y;
                    this.w = v4fVec.z;
                    this.y = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Vec4.prototype, "yzwz", {
                get: function () {
                    return Vec4.stackCeil.set(this.y, this.z, this.w, this.z);
                },
                set: function (v4fVec) {
                    this.y = v4fVec.x;
                    this.z = v4fVec.y;
                    this.w = v4fVec.z;
                    this.z = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Vec4.prototype, "yzww", {
                get: function () {
                    return Vec4.stackCeil.set(this.y, this.z, this.w, this.w);
                },
                set: function (v4fVec) {
                    this.y = v4fVec.x;
                    this.z = v4fVec.y;
                    this.w = v4fVec.z;
                    this.w = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Vec4.prototype, "ywxx", {
                get: function () {
                    return Vec4.stackCeil.set(this.y, this.w, this.x, this.x);
                },
                set: function (v4fVec) {
                    this.y = v4fVec.x;
                    this.w = v4fVec.y;
                    this.x = v4fVec.z;
                    this.x = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Vec4.prototype, "ywxy", {
                get: function () {
                    return Vec4.stackCeil.set(this.y, this.w, this.x, this.y);
                },
                set: function (v4fVec) {
                    this.y = v4fVec.x;
                    this.w = v4fVec.y;
                    this.x = v4fVec.z;
                    this.y = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Vec4.prototype, "ywxz", {
                get: function () {
                    return Vec4.stackCeil.set(this.y, this.w, this.x, this.z);
                },
                set: function (v4fVec) {
                    this.y = v4fVec.x;
                    this.w = v4fVec.y;
                    this.x = v4fVec.z;
                    this.z = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Vec4.prototype, "ywxw", {
                get: function () {
                    return Vec4.stackCeil.set(this.y, this.w, this.x, this.w);
                },
                set: function (v4fVec) {
                    this.y = v4fVec.x;
                    this.w = v4fVec.y;
                    this.x = v4fVec.z;
                    this.w = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Vec4.prototype, "ywyx", {
                get: function () {
                    return Vec4.stackCeil.set(this.y, this.w, this.y, this.x);
                },
                set: function (v4fVec) {
                    this.y = v4fVec.x;
                    this.w = v4fVec.y;
                    this.y = v4fVec.z;
                    this.x = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Vec4.prototype, "ywyy", {
                get: function () {
                    return Vec4.stackCeil.set(this.y, this.w, this.y, this.y);
                },
                set: function (v4fVec) {
                    this.y = v4fVec.x;
                    this.w = v4fVec.y;
                    this.y = v4fVec.z;
                    this.y = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Vec4.prototype, "ywyz", {
                get: function () {
                    return Vec4.stackCeil.set(this.y, this.w, this.y, this.z);
                },
                set: function (v4fVec) {
                    this.y = v4fVec.x;
                    this.w = v4fVec.y;
                    this.y = v4fVec.z;
                    this.z = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Vec4.prototype, "ywyw", {
                get: function () {
                    return Vec4.stackCeil.set(this.y, this.w, this.y, this.w);
                },
                set: function (v4fVec) {
                    this.y = v4fVec.x;
                    this.w = v4fVec.y;
                    this.y = v4fVec.z;
                    this.w = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Vec4.prototype, "ywzx", {
                get: function () {
                    return Vec4.stackCeil.set(this.y, this.w, this.z, this.x);
                },
                set: function (v4fVec) {
                    this.y = v4fVec.x;
                    this.w = v4fVec.y;
                    this.z = v4fVec.z;
                    this.x = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Vec4.prototype, "ywzy", {
                get: function () {
                    return Vec4.stackCeil.set(this.y, this.w, this.z, this.y);
                },
                set: function (v4fVec) {
                    this.y = v4fVec.x;
                    this.w = v4fVec.y;
                    this.z = v4fVec.z;
                    this.y = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Vec4.prototype, "ywzz", {
                get: function () {
                    return Vec4.stackCeil.set(this.y, this.w, this.z, this.z);
                },
                set: function (v4fVec) {
                    this.y = v4fVec.x;
                    this.w = v4fVec.y;
                    this.z = v4fVec.z;
                    this.z = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Vec4.prototype, "ywzw", {
                get: function () {
                    return Vec4.stackCeil.set(this.y, this.w, this.z, this.w);
                },
                set: function (v4fVec) {
                    this.y = v4fVec.x;
                    this.w = v4fVec.y;
                    this.z = v4fVec.z;
                    this.w = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Vec4.prototype, "ywwx", {
                get: function () {
                    return Vec4.stackCeil.set(this.y, this.w, this.w, this.x);
                },
                set: function (v4fVec) {
                    this.y = v4fVec.x;
                    this.w = v4fVec.y;
                    this.w = v4fVec.z;
                    this.x = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Vec4.prototype, "ywwy", {
                get: function () {
                    return Vec4.stackCeil.set(this.y, this.w, this.w, this.y);
                },
                set: function (v4fVec) {
                    this.y = v4fVec.x;
                    this.w = v4fVec.y;
                    this.w = v4fVec.z;
                    this.y = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Vec4.prototype, "ywwz", {
                get: function () {
                    return Vec4.stackCeil.set(this.y, this.w, this.w, this.z);
                },
                set: function (v4fVec) {
                    this.y = v4fVec.x;
                    this.w = v4fVec.y;
                    this.w = v4fVec.z;
                    this.z = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Vec4.prototype, "ywww", {
                get: function () {
                    return Vec4.stackCeil.set(this.y, this.w, this.w, this.w);
                },
                set: function (v4fVec) {
                    this.y = v4fVec.x;
                    this.w = v4fVec.y;
                    this.w = v4fVec.z;
                    this.w = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Vec4.prototype, "zxxx", {
                get: function () {
                    return Vec4.stackCeil.set(this.z, this.x, this.x, this.x);
                },
                set: function (v4fVec) {
                    this.z = v4fVec.x;
                    this.x = v4fVec.y;
                    this.x = v4fVec.z;
                    this.x = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Vec4.prototype, "zxxy", {
                get: function () {
                    return Vec4.stackCeil.set(this.z, this.x, this.x, this.y);
                },
                set: function (v4fVec) {
                    this.z = v4fVec.x;
                    this.x = v4fVec.y;
                    this.x = v4fVec.z;
                    this.y = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Vec4.prototype, "zxxz", {
                get: function () {
                    return Vec4.stackCeil.set(this.z, this.x, this.x, this.z);
                },
                set: function (v4fVec) {
                    this.z = v4fVec.x;
                    this.x = v4fVec.y;
                    this.x = v4fVec.z;
                    this.z = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Vec4.prototype, "zxxw", {
                get: function () {
                    return Vec4.stackCeil.set(this.z, this.x, this.x, this.w);
                },
                set: function (v4fVec) {
                    this.z = v4fVec.x;
                    this.x = v4fVec.y;
                    this.x = v4fVec.z;
                    this.w = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Vec4.prototype, "zxyx", {
                get: function () {
                    return Vec4.stackCeil.set(this.z, this.x, this.y, this.x);
                },
                set: function (v4fVec) {
                    this.z = v4fVec.x;
                    this.x = v4fVec.y;
                    this.y = v4fVec.z;
                    this.x = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Vec4.prototype, "zxyy", {
                get: function () {
                    return Vec4.stackCeil.set(this.z, this.x, this.y, this.y);
                },
                set: function (v4fVec) {
                    this.z = v4fVec.x;
                    this.x = v4fVec.y;
                    this.y = v4fVec.z;
                    this.y = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Vec4.prototype, "zxyz", {
                get: function () {
                    return Vec4.stackCeil.set(this.z, this.x, this.y, this.z);
                },
                set: function (v4fVec) {
                    this.z = v4fVec.x;
                    this.x = v4fVec.y;
                    this.y = v4fVec.z;
                    this.z = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Vec4.prototype, "zxyw", {
                get: function () {
                    return Vec4.stackCeil.set(this.z, this.x, this.y, this.w);
                },
                set: function (v4fVec) {
                    this.z = v4fVec.x;
                    this.x = v4fVec.y;
                    this.y = v4fVec.z;
                    this.w = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Vec4.prototype, "zxzx", {
                get: function () {
                    return Vec4.stackCeil.set(this.z, this.x, this.z, this.x);
                },
                set: function (v4fVec) {
                    this.z = v4fVec.x;
                    this.x = v4fVec.y;
                    this.z = v4fVec.z;
                    this.x = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Vec4.prototype, "zxzy", {
                get: function () {
                    return Vec4.stackCeil.set(this.z, this.x, this.z, this.y);
                },
                set: function (v4fVec) {
                    this.z = v4fVec.x;
                    this.x = v4fVec.y;
                    this.z = v4fVec.z;
                    this.y = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Vec4.prototype, "zxzz", {
                get: function () {
                    return Vec4.stackCeil.set(this.z, this.x, this.z, this.z);
                },
                set: function (v4fVec) {
                    this.z = v4fVec.x;
                    this.x = v4fVec.y;
                    this.z = v4fVec.z;
                    this.z = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Vec4.prototype, "zxzw", {
                get: function () {
                    return Vec4.stackCeil.set(this.z, this.x, this.z, this.w);
                },
                set: function (v4fVec) {
                    this.z = v4fVec.x;
                    this.x = v4fVec.y;
                    this.z = v4fVec.z;
                    this.w = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Vec4.prototype, "zxwx", {
                get: function () {
                    return Vec4.stackCeil.set(this.z, this.x, this.w, this.x);
                },
                set: function (v4fVec) {
                    this.z = v4fVec.x;
                    this.x = v4fVec.y;
                    this.w = v4fVec.z;
                    this.x = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Vec4.prototype, "zxwy", {
                get: function () {
                    return Vec4.stackCeil.set(this.z, this.x, this.w, this.y);
                },
                set: function (v4fVec) {
                    this.z = v4fVec.x;
                    this.x = v4fVec.y;
                    this.w = v4fVec.z;
                    this.y = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Vec4.prototype, "zxwz", {
                get: function () {
                    return Vec4.stackCeil.set(this.z, this.x, this.w, this.z);
                },
                set: function (v4fVec) {
                    this.z = v4fVec.x;
                    this.x = v4fVec.y;
                    this.w = v4fVec.z;
                    this.z = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Vec4.prototype, "zxww", {
                get: function () {
                    return Vec4.stackCeil.set(this.z, this.x, this.w, this.w);
                },
                set: function (v4fVec) {
                    this.z = v4fVec.x;
                    this.x = v4fVec.y;
                    this.w = v4fVec.z;
                    this.w = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Vec4.prototype, "zyxx", {
                get: function () {
                    return Vec4.stackCeil.set(this.z, this.y, this.x, this.x);
                },
                set: function (v4fVec) {
                    this.z = v4fVec.x;
                    this.y = v4fVec.y;
                    this.x = v4fVec.z;
                    this.x = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Vec4.prototype, "zyxy", {
                get: function () {
                    return Vec4.stackCeil.set(this.z, this.y, this.x, this.y);
                },
                set: function (v4fVec) {
                    this.z = v4fVec.x;
                    this.y = v4fVec.y;
                    this.x = v4fVec.z;
                    this.y = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Vec4.prototype, "zyxz", {
                get: function () {
                    return Vec4.stackCeil.set(this.z, this.y, this.x, this.z);
                },
                set: function (v4fVec) {
                    this.z = v4fVec.x;
                    this.y = v4fVec.y;
                    this.x = v4fVec.z;
                    this.z = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Vec4.prototype, "zyxw", {
                get: function () {
                    return Vec4.stackCeil.set(this.z, this.y, this.x, this.w);
                },
                set: function (v4fVec) {
                    this.z = v4fVec.x;
                    this.y = v4fVec.y;
                    this.x = v4fVec.z;
                    this.w = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Vec4.prototype, "zyyx", {
                get: function () {
                    return Vec4.stackCeil.set(this.z, this.y, this.y, this.x);
                },
                set: function (v4fVec) {
                    this.z = v4fVec.x;
                    this.y = v4fVec.y;
                    this.y = v4fVec.z;
                    this.x = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Vec4.prototype, "zyyy", {
                get: function () {
                    return Vec4.stackCeil.set(this.z, this.y, this.y, this.y);
                },
                set: function (v4fVec) {
                    this.z = v4fVec.x;
                    this.y = v4fVec.y;
                    this.y = v4fVec.z;
                    this.y = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Vec4.prototype, "zyyz", {
                get: function () {
                    return Vec4.stackCeil.set(this.z, this.y, this.y, this.z);
                },
                set: function (v4fVec) {
                    this.z = v4fVec.x;
                    this.y = v4fVec.y;
                    this.y = v4fVec.z;
                    this.z = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Vec4.prototype, "zyyw", {
                get: function () {
                    return Vec4.stackCeil.set(this.z, this.y, this.y, this.w);
                },
                set: function (v4fVec) {
                    this.z = v4fVec.x;
                    this.y = v4fVec.y;
                    this.y = v4fVec.z;
                    this.w = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Vec4.prototype, "zyzx", {
                get: function () {
                    return Vec4.stackCeil.set(this.z, this.y, this.z, this.x);
                },
                set: function (v4fVec) {
                    this.z = v4fVec.x;
                    this.y = v4fVec.y;
                    this.z = v4fVec.z;
                    this.x = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Vec4.prototype, "zyzy", {
                get: function () {
                    return Vec4.stackCeil.set(this.z, this.y, this.z, this.y);
                },
                set: function (v4fVec) {
                    this.z = v4fVec.x;
                    this.y = v4fVec.y;
                    this.z = v4fVec.z;
                    this.y = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Vec4.prototype, "zyzz", {
                get: function () {
                    return Vec4.stackCeil.set(this.z, this.y, this.z, this.z);
                },
                set: function (v4fVec) {
                    this.z = v4fVec.x;
                    this.y = v4fVec.y;
                    this.z = v4fVec.z;
                    this.z = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Vec4.prototype, "zyzw", {
                get: function () {
                    return Vec4.stackCeil.set(this.z, this.y, this.z, this.w);
                },
                set: function (v4fVec) {
                    this.z = v4fVec.x;
                    this.y = v4fVec.y;
                    this.z = v4fVec.z;
                    this.w = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Vec4.prototype, "zywx", {
                get: function () {
                    return Vec4.stackCeil.set(this.z, this.y, this.w, this.x);
                },
                set: function (v4fVec) {
                    this.z = v4fVec.x;
                    this.y = v4fVec.y;
                    this.w = v4fVec.z;
                    this.x = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Vec4.prototype, "zywy", {
                get: function () {
                    return Vec4.stackCeil.set(this.z, this.y, this.w, this.y);
                },
                set: function (v4fVec) {
                    this.z = v4fVec.x;
                    this.y = v4fVec.y;
                    this.w = v4fVec.z;
                    this.y = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Vec4.prototype, "zywz", {
                get: function () {
                    return Vec4.stackCeil.set(this.z, this.y, this.w, this.z);
                },
                set: function (v4fVec) {
                    this.z = v4fVec.x;
                    this.y = v4fVec.y;
                    this.w = v4fVec.z;
                    this.z = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Vec4.prototype, "zyww", {
                get: function () {
                    return Vec4.stackCeil.set(this.z, this.y, this.w, this.w);
                },
                set: function (v4fVec) {
                    this.z = v4fVec.x;
                    this.y = v4fVec.y;
                    this.w = v4fVec.z;
                    this.w = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Vec4.prototype, "zzxx", {
                get: function () {
                    return Vec4.stackCeil.set(this.z, this.z, this.x, this.x);
                },
                set: function (v4fVec) {
                    this.z = v4fVec.x;
                    this.z = v4fVec.y;
                    this.x = v4fVec.z;
                    this.x = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Vec4.prototype, "zzxy", {
                get: function () {
                    return Vec4.stackCeil.set(this.z, this.z, this.x, this.y);
                },
                set: function (v4fVec) {
                    this.z = v4fVec.x;
                    this.z = v4fVec.y;
                    this.x = v4fVec.z;
                    this.y = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Vec4.prototype, "zzxz", {
                get: function () {
                    return Vec4.stackCeil.set(this.z, this.z, this.x, this.z);
                },
                set: function (v4fVec) {
                    this.z = v4fVec.x;
                    this.z = v4fVec.y;
                    this.x = v4fVec.z;
                    this.z = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Vec4.prototype, "zzxw", {
                get: function () {
                    return Vec4.stackCeil.set(this.z, this.z, this.x, this.w);
                },
                set: function (v4fVec) {
                    this.z = v4fVec.x;
                    this.z = v4fVec.y;
                    this.x = v4fVec.z;
                    this.w = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Vec4.prototype, "zzyx", {
                get: function () {
                    return Vec4.stackCeil.set(this.z, this.z, this.y, this.x);
                },
                set: function (v4fVec) {
                    this.z = v4fVec.x;
                    this.z = v4fVec.y;
                    this.y = v4fVec.z;
                    this.x = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Vec4.prototype, "zzyy", {
                get: function () {
                    return Vec4.stackCeil.set(this.z, this.z, this.y, this.y);
                },
                set: function (v4fVec) {
                    this.z = v4fVec.x;
                    this.z = v4fVec.y;
                    this.y = v4fVec.z;
                    this.y = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Vec4.prototype, "zzyz", {
                get: function () {
                    return Vec4.stackCeil.set(this.z, this.z, this.y, this.z);
                },
                set: function (v4fVec) {
                    this.z = v4fVec.x;
                    this.z = v4fVec.y;
                    this.y = v4fVec.z;
                    this.z = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Vec4.prototype, "zzyw", {
                get: function () {
                    return Vec4.stackCeil.set(this.z, this.z, this.y, this.w);
                },
                set: function (v4fVec) {
                    this.z = v4fVec.x;
                    this.z = v4fVec.y;
                    this.y = v4fVec.z;
                    this.w = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Vec4.prototype, "zzzx", {
                get: function () {
                    return Vec4.stackCeil.set(this.z, this.z, this.z, this.x);
                },
                set: function (v4fVec) {
                    this.z = v4fVec.x;
                    this.z = v4fVec.y;
                    this.z = v4fVec.z;
                    this.x = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Vec4.prototype, "zzzy", {
                get: function () {
                    return Vec4.stackCeil.set(this.z, this.z, this.z, this.y);
                },
                set: function (v4fVec) {
                    this.z = v4fVec.x;
                    this.z = v4fVec.y;
                    this.z = v4fVec.z;
                    this.y = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Vec4.prototype, "zzzz", {
                get: function () {
                    return Vec4.stackCeil.set(this.z, this.z, this.z, this.z);
                },
                set: function (v4fVec) {
                    this.z = v4fVec.x;
                    this.z = v4fVec.y;
                    this.z = v4fVec.z;
                    this.z = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Vec4.prototype, "zzzw", {
                get: function () {
                    return Vec4.stackCeil.set(this.z, this.z, this.z, this.w);
                },
                set: function (v4fVec) {
                    this.z = v4fVec.x;
                    this.z = v4fVec.y;
                    this.z = v4fVec.z;
                    this.w = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Vec4.prototype, "zzwx", {
                get: function () {
                    return Vec4.stackCeil.set(this.z, this.z, this.w, this.x);
                },
                set: function (v4fVec) {
                    this.z = v4fVec.x;
                    this.z = v4fVec.y;
                    this.w = v4fVec.z;
                    this.x = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Vec4.prototype, "zzwy", {
                get: function () {
                    return Vec4.stackCeil.set(this.z, this.z, this.w, this.y);
                },
                set: function (v4fVec) {
                    this.z = v4fVec.x;
                    this.z = v4fVec.y;
                    this.w = v4fVec.z;
                    this.y = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Vec4.prototype, "zzwz", {
                get: function () {
                    return Vec4.stackCeil.set(this.z, this.z, this.w, this.z);
                },
                set: function (v4fVec) {
                    this.z = v4fVec.x;
                    this.z = v4fVec.y;
                    this.w = v4fVec.z;
                    this.z = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Vec4.prototype, "zzww", {
                get: function () {
                    return Vec4.stackCeil.set(this.z, this.z, this.w, this.w);
                },
                set: function (v4fVec) {
                    this.z = v4fVec.x;
                    this.z = v4fVec.y;
                    this.w = v4fVec.z;
                    this.w = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Vec4.prototype, "zwxx", {
                get: function () {
                    return Vec4.stackCeil.set(this.z, this.w, this.x, this.x);
                },
                set: function (v4fVec) {
                    this.z = v4fVec.x;
                    this.w = v4fVec.y;
                    this.x = v4fVec.z;
                    this.x = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Vec4.prototype, "zwxy", {
                get: function () {
                    return Vec4.stackCeil.set(this.z, this.w, this.x, this.y);
                },
                set: function (v4fVec) {
                    this.z = v4fVec.x;
                    this.w = v4fVec.y;
                    this.x = v4fVec.z;
                    this.y = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Vec4.prototype, "zwxz", {
                get: function () {
                    return Vec4.stackCeil.set(this.z, this.w, this.x, this.z);
                },
                set: function (v4fVec) {
                    this.z = v4fVec.x;
                    this.w = v4fVec.y;
                    this.x = v4fVec.z;
                    this.z = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Vec4.prototype, "zwxw", {
                get: function () {
                    return Vec4.stackCeil.set(this.z, this.w, this.x, this.w);
                },
                set: function (v4fVec) {
                    this.z = v4fVec.x;
                    this.w = v4fVec.y;
                    this.x = v4fVec.z;
                    this.w = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Vec4.prototype, "zwyx", {
                get: function () {
                    return Vec4.stackCeil.set(this.z, this.w, this.y, this.x);
                },
                set: function (v4fVec) {
                    this.z = v4fVec.x;
                    this.w = v4fVec.y;
                    this.y = v4fVec.z;
                    this.x = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Vec4.prototype, "zwyy", {
                get: function () {
                    return Vec4.stackCeil.set(this.z, this.w, this.y, this.y);
                },
                set: function (v4fVec) {
                    this.z = v4fVec.x;
                    this.w = v4fVec.y;
                    this.y = v4fVec.z;
                    this.y = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Vec4.prototype, "zwyz", {
                get: function () {
                    return Vec4.stackCeil.set(this.z, this.w, this.y, this.z);
                },
                set: function (v4fVec) {
                    this.z = v4fVec.x;
                    this.w = v4fVec.y;
                    this.y = v4fVec.z;
                    this.z = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Vec4.prototype, "zwyw", {
                get: function () {
                    return Vec4.stackCeil.set(this.z, this.w, this.y, this.w);
                },
                set: function (v4fVec) {
                    this.z = v4fVec.x;
                    this.w = v4fVec.y;
                    this.y = v4fVec.z;
                    this.w = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Vec4.prototype, "zwzx", {
                get: function () {
                    return Vec4.stackCeil.set(this.z, this.w, this.z, this.x);
                },
                set: function (v4fVec) {
                    this.z = v4fVec.x;
                    this.w = v4fVec.y;
                    this.z = v4fVec.z;
                    this.x = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Vec4.prototype, "zwzy", {
                get: function () {
                    return Vec4.stackCeil.set(this.z, this.w, this.z, this.y);
                },
                set: function (v4fVec) {
                    this.z = v4fVec.x;
                    this.w = v4fVec.y;
                    this.z = v4fVec.z;
                    this.y = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Vec4.prototype, "zwzz", {
                get: function () {
                    return Vec4.stackCeil.set(this.z, this.w, this.z, this.z);
                },
                set: function (v4fVec) {
                    this.z = v4fVec.x;
                    this.w = v4fVec.y;
                    this.z = v4fVec.z;
                    this.z = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Vec4.prototype, "zwzw", {
                get: function () {
                    return Vec4.stackCeil.set(this.z, this.w, this.z, this.w);
                },
                set: function (v4fVec) {
                    this.z = v4fVec.x;
                    this.w = v4fVec.y;
                    this.z = v4fVec.z;
                    this.w = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Vec4.prototype, "zwwx", {
                get: function () {
                    return Vec4.stackCeil.set(this.z, this.w, this.w, this.x);
                },
                set: function (v4fVec) {
                    this.z = v4fVec.x;
                    this.w = v4fVec.y;
                    this.w = v4fVec.z;
                    this.x = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Vec4.prototype, "zwwy", {
                get: function () {
                    return Vec4.stackCeil.set(this.z, this.w, this.w, this.y);
                },
                set: function (v4fVec) {
                    this.z = v4fVec.x;
                    this.w = v4fVec.y;
                    this.w = v4fVec.z;
                    this.y = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Vec4.prototype, "zwwz", {
                get: function () {
                    return Vec4.stackCeil.set(this.z, this.w, this.w, this.z);
                },
                set: function (v4fVec) {
                    this.z = v4fVec.x;
                    this.w = v4fVec.y;
                    this.w = v4fVec.z;
                    this.z = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Vec4.prototype, "zwww", {
                get: function () {
                    return Vec4.stackCeil.set(this.z, this.w, this.w, this.w);
                },
                set: function (v4fVec) {
                    this.z = v4fVec.x;
                    this.w = v4fVec.y;
                    this.w = v4fVec.z;
                    this.w = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Vec4.prototype, "wxxx", {
                get: function () {
                    return Vec4.stackCeil.set(this.w, this.x, this.x, this.x);
                },
                set: function (v4fVec) {
                    this.w = v4fVec.x;
                    this.x = v4fVec.y;
                    this.x = v4fVec.z;
                    this.x = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Vec4.prototype, "wxxy", {
                get: function () {
                    return Vec4.stackCeil.set(this.w, this.x, this.x, this.y);
                },
                set: function (v4fVec) {
                    this.w = v4fVec.x;
                    this.x = v4fVec.y;
                    this.x = v4fVec.z;
                    this.y = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Vec4.prototype, "wxxz", {
                get: function () {
                    return Vec4.stackCeil.set(this.w, this.x, this.x, this.z);
                },
                set: function (v4fVec) {
                    this.w = v4fVec.x;
                    this.x = v4fVec.y;
                    this.x = v4fVec.z;
                    this.z = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Vec4.prototype, "wxxw", {
                get: function () {
                    return Vec4.stackCeil.set(this.w, this.x, this.x, this.w);
                },
                set: function (v4fVec) {
                    this.w = v4fVec.x;
                    this.x = v4fVec.y;
                    this.x = v4fVec.z;
                    this.w = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Vec4.prototype, "wxyx", {
                get: function () {
                    return Vec4.stackCeil.set(this.w, this.x, this.y, this.x);
                },
                set: function (v4fVec) {
                    this.w = v4fVec.x;
                    this.x = v4fVec.y;
                    this.y = v4fVec.z;
                    this.x = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Vec4.prototype, "wxyy", {
                get: function () {
                    return Vec4.stackCeil.set(this.w, this.x, this.y, this.y);
                },
                set: function (v4fVec) {
                    this.w = v4fVec.x;
                    this.x = v4fVec.y;
                    this.y = v4fVec.z;
                    this.y = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Vec4.prototype, "wxyz", {
                get: function () {
                    return Vec4.stackCeil.set(this.w, this.x, this.y, this.z);
                },
                set: function (v4fVec) {
                    this.w = v4fVec.x;
                    this.x = v4fVec.y;
                    this.y = v4fVec.z;
                    this.z = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Vec4.prototype, "wxyw", {
                get: function () {
                    return Vec4.stackCeil.set(this.w, this.x, this.y, this.w);
                },
                set: function (v4fVec) {
                    this.w = v4fVec.x;
                    this.x = v4fVec.y;
                    this.y = v4fVec.z;
                    this.w = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Vec4.prototype, "wxzx", {
                get: function () {
                    return Vec4.stackCeil.set(this.w, this.x, this.z, this.x);
                },
                set: function (v4fVec) {
                    this.w = v4fVec.x;
                    this.x = v4fVec.y;
                    this.z = v4fVec.z;
                    this.x = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Vec4.prototype, "wxzy", {
                get: function () {
                    return Vec4.stackCeil.set(this.w, this.x, this.z, this.y);
                },
                set: function (v4fVec) {
                    this.w = v4fVec.x;
                    this.x = v4fVec.y;
                    this.z = v4fVec.z;
                    this.y = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Vec4.prototype, "wxzz", {
                get: function () {
                    return Vec4.stackCeil.set(this.w, this.x, this.z, this.z);
                },
                set: function (v4fVec) {
                    this.w = v4fVec.x;
                    this.x = v4fVec.y;
                    this.z = v4fVec.z;
                    this.z = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Vec4.prototype, "wxzw", {
                get: function () {
                    return Vec4.stackCeil.set(this.w, this.x, this.z, this.w);
                },
                set: function (v4fVec) {
                    this.w = v4fVec.x;
                    this.x = v4fVec.y;
                    this.z = v4fVec.z;
                    this.w = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Vec4.prototype, "wxwx", {
                get: function () {
                    return Vec4.stackCeil.set(this.w, this.x, this.w, this.x);
                },
                set: function (v4fVec) {
                    this.w = v4fVec.x;
                    this.x = v4fVec.y;
                    this.w = v4fVec.z;
                    this.x = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Vec4.prototype, "wxwy", {
                get: function () {
                    return Vec4.stackCeil.set(this.w, this.x, this.w, this.y);
                },
                set: function (v4fVec) {
                    this.w = v4fVec.x;
                    this.x = v4fVec.y;
                    this.w = v4fVec.z;
                    this.y = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Vec4.prototype, "wxwz", {
                get: function () {
                    return Vec4.stackCeil.set(this.w, this.x, this.w, this.z);
                },
                set: function (v4fVec) {
                    this.w = v4fVec.x;
                    this.x = v4fVec.y;
                    this.w = v4fVec.z;
                    this.z = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Vec4.prototype, "wxww", {
                get: function () {
                    return Vec4.stackCeil.set(this.w, this.x, this.w, this.w);
                },
                set: function (v4fVec) {
                    this.w = v4fVec.x;
                    this.x = v4fVec.y;
                    this.w = v4fVec.z;
                    this.w = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Vec4.prototype, "wyxx", {
                get: function () {
                    return Vec4.stackCeil.set(this.w, this.y, this.x, this.x);
                },
                set: function (v4fVec) {
                    this.w = v4fVec.x;
                    this.y = v4fVec.y;
                    this.x = v4fVec.z;
                    this.x = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Vec4.prototype, "wyxy", {
                get: function () {
                    return Vec4.stackCeil.set(this.w, this.y, this.x, this.y);
                },
                set: function (v4fVec) {
                    this.w = v4fVec.x;
                    this.y = v4fVec.y;
                    this.x = v4fVec.z;
                    this.y = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Vec4.prototype, "wyxz", {
                get: function () {
                    return Vec4.stackCeil.set(this.w, this.y, this.x, this.z);
                },
                set: function (v4fVec) {
                    this.w = v4fVec.x;
                    this.y = v4fVec.y;
                    this.x = v4fVec.z;
                    this.z = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Vec4.prototype, "wyxw", {
                get: function () {
                    return Vec4.stackCeil.set(this.w, this.y, this.x, this.w);
                },
                set: function (v4fVec) {
                    this.w = v4fVec.x;
                    this.y = v4fVec.y;
                    this.x = v4fVec.z;
                    this.w = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Vec4.prototype, "wyyx", {
                get: function () {
                    return Vec4.stackCeil.set(this.w, this.y, this.y, this.x);
                },
                set: function (v4fVec) {
                    this.w = v4fVec.x;
                    this.y = v4fVec.y;
                    this.y = v4fVec.z;
                    this.x = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Vec4.prototype, "wyyy", {
                get: function () {
                    return Vec4.stackCeil.set(this.w, this.y, this.y, this.y);
                },
                set: function (v4fVec) {
                    this.w = v4fVec.x;
                    this.y = v4fVec.y;
                    this.y = v4fVec.z;
                    this.y = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Vec4.prototype, "wyyz", {
                get: function () {
                    return Vec4.stackCeil.set(this.w, this.y, this.y, this.z);
                },
                set: function (v4fVec) {
                    this.w = v4fVec.x;
                    this.y = v4fVec.y;
                    this.y = v4fVec.z;
                    this.z = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Vec4.prototype, "wyyw", {
                get: function () {
                    return Vec4.stackCeil.set(this.w, this.y, this.y, this.w);
                },
                set: function (v4fVec) {
                    this.w = v4fVec.x;
                    this.y = v4fVec.y;
                    this.y = v4fVec.z;
                    this.w = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Vec4.prototype, "wyzx", {
                get: function () {
                    return Vec4.stackCeil.set(this.w, this.y, this.z, this.x);
                },
                set: function (v4fVec) {
                    this.w = v4fVec.x;
                    this.y = v4fVec.y;
                    this.z = v4fVec.z;
                    this.x = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Vec4.prototype, "wyzy", {
                get: function () {
                    return Vec4.stackCeil.set(this.w, this.y, this.z, this.y);
                },
                set: function (v4fVec) {
                    this.w = v4fVec.x;
                    this.y = v4fVec.y;
                    this.z = v4fVec.z;
                    this.y = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Vec4.prototype, "wyzz", {
                get: function () {
                    return Vec4.stackCeil.set(this.w, this.y, this.z, this.z);
                },
                set: function (v4fVec) {
                    this.w = v4fVec.x;
                    this.y = v4fVec.y;
                    this.z = v4fVec.z;
                    this.z = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Vec4.prototype, "wyzw", {
                get: function () {
                    return Vec4.stackCeil.set(this.w, this.y, this.z, this.w);
                },
                set: function (v4fVec) {
                    this.w = v4fVec.x;
                    this.y = v4fVec.y;
                    this.z = v4fVec.z;
                    this.w = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Vec4.prototype, "wywx", {
                get: function () {
                    return Vec4.stackCeil.set(this.w, this.y, this.w, this.x);
                },
                set: function (v4fVec) {
                    this.w = v4fVec.x;
                    this.y = v4fVec.y;
                    this.w = v4fVec.z;
                    this.x = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Vec4.prototype, "wywy", {
                get: function () {
                    return Vec4.stackCeil.set(this.w, this.y, this.w, this.y);
                },
                set: function (v4fVec) {
                    this.w = v4fVec.x;
                    this.y = v4fVec.y;
                    this.w = v4fVec.z;
                    this.y = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Vec4.prototype, "wywz", {
                get: function () {
                    return Vec4.stackCeil.set(this.w, this.y, this.w, this.z);
                },
                set: function (v4fVec) {
                    this.w = v4fVec.x;
                    this.y = v4fVec.y;
                    this.w = v4fVec.z;
                    this.z = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Vec4.prototype, "wyww", {
                get: function () {
                    return Vec4.stackCeil.set(this.w, this.y, this.w, this.w);
                },
                set: function (v4fVec) {
                    this.w = v4fVec.x;
                    this.y = v4fVec.y;
                    this.w = v4fVec.z;
                    this.w = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Vec4.prototype, "wzxx", {
                get: function () {
                    return Vec4.stackCeil.set(this.w, this.z, this.x, this.x);
                },
                set: function (v4fVec) {
                    this.w = v4fVec.x;
                    this.z = v4fVec.y;
                    this.x = v4fVec.z;
                    this.x = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Vec4.prototype, "wzxy", {
                get: function () {
                    return Vec4.stackCeil.set(this.w, this.z, this.x, this.y);
                },
                set: function (v4fVec) {
                    this.w = v4fVec.x;
                    this.z = v4fVec.y;
                    this.x = v4fVec.z;
                    this.y = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Vec4.prototype, "wzxz", {
                get: function () {
                    return Vec4.stackCeil.set(this.w, this.z, this.x, this.z);
                },
                set: function (v4fVec) {
                    this.w = v4fVec.x;
                    this.z = v4fVec.y;
                    this.x = v4fVec.z;
                    this.z = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Vec4.prototype, "wzxw", {
                get: function () {
                    return Vec4.stackCeil.set(this.w, this.z, this.x, this.w);
                },
                set: function (v4fVec) {
                    this.w = v4fVec.x;
                    this.z = v4fVec.y;
                    this.x = v4fVec.z;
                    this.w = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Vec4.prototype, "wzyx", {
                get: function () {
                    return Vec4.stackCeil.set(this.w, this.z, this.y, this.x);
                },
                set: function (v4fVec) {
                    this.w = v4fVec.x;
                    this.z = v4fVec.y;
                    this.y = v4fVec.z;
                    this.x = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Vec4.prototype, "wzyy", {
                get: function () {
                    return Vec4.stackCeil.set(this.w, this.z, this.y, this.y);
                },
                set: function (v4fVec) {
                    this.w = v4fVec.x;
                    this.z = v4fVec.y;
                    this.y = v4fVec.z;
                    this.y = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Vec4.prototype, "wzyz", {
                get: function () {
                    return Vec4.stackCeil.set(this.w, this.z, this.y, this.z);
                },
                set: function (v4fVec) {
                    this.w = v4fVec.x;
                    this.z = v4fVec.y;
                    this.y = v4fVec.z;
                    this.z = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Vec4.prototype, "wzyw", {
                get: function () {
                    return Vec4.stackCeil.set(this.w, this.z, this.y, this.w);
                },
                set: function (v4fVec) {
                    this.w = v4fVec.x;
                    this.z = v4fVec.y;
                    this.y = v4fVec.z;
                    this.w = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Vec4.prototype, "wzzx", {
                get: function () {
                    return Vec4.stackCeil.set(this.w, this.z, this.z, this.x);
                },
                set: function (v4fVec) {
                    this.w = v4fVec.x;
                    this.z = v4fVec.y;
                    this.z = v4fVec.z;
                    this.x = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Vec4.prototype, "wzzy", {
                get: function () {
                    return Vec4.stackCeil.set(this.w, this.z, this.z, this.y);
                },
                set: function (v4fVec) {
                    this.w = v4fVec.x;
                    this.z = v4fVec.y;
                    this.z = v4fVec.z;
                    this.y = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Vec4.prototype, "wzzz", {
                get: function () {
                    return Vec4.stackCeil.set(this.w, this.z, this.z, this.z);
                },
                set: function (v4fVec) {
                    this.w = v4fVec.x;
                    this.z = v4fVec.y;
                    this.z = v4fVec.z;
                    this.z = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Vec4.prototype, "wzzw", {
                get: function () {
                    return Vec4.stackCeil.set(this.w, this.z, this.z, this.w);
                },
                set: function (v4fVec) {
                    this.w = v4fVec.x;
                    this.z = v4fVec.y;
                    this.z = v4fVec.z;
                    this.w = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Vec4.prototype, "wzwx", {
                get: function () {
                    return Vec4.stackCeil.set(this.w, this.z, this.w, this.x);
                },
                set: function (v4fVec) {
                    this.w = v4fVec.x;
                    this.z = v4fVec.y;
                    this.w = v4fVec.z;
                    this.x = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Vec4.prototype, "wzwy", {
                get: function () {
                    return Vec4.stackCeil.set(this.w, this.z, this.w, this.y);
                },
                set: function (v4fVec) {
                    this.w = v4fVec.x;
                    this.z = v4fVec.y;
                    this.w = v4fVec.z;
                    this.y = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Vec4.prototype, "wzwz", {
                get: function () {
                    return Vec4.stackCeil.set(this.w, this.z, this.w, this.z);
                },
                set: function (v4fVec) {
                    this.w = v4fVec.x;
                    this.z = v4fVec.y;
                    this.w = v4fVec.z;
                    this.z = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Vec4.prototype, "wzww", {
                get: function () {
                    return Vec4.stackCeil.set(this.w, this.z, this.w, this.w);
                },
                set: function (v4fVec) {
                    this.w = v4fVec.x;
                    this.z = v4fVec.y;
                    this.w = v4fVec.z;
                    this.w = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Vec4.prototype, "wwxx", {
                get: function () {
                    return Vec4.stackCeil.set(this.w, this.w, this.x, this.x);
                },
                set: function (v4fVec) {
                    this.w = v4fVec.x;
                    this.w = v4fVec.y;
                    this.x = v4fVec.z;
                    this.x = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Vec4.prototype, "wwxy", {
                get: function () {
                    return Vec4.stackCeil.set(this.w, this.w, this.x, this.y);
                },
                set: function (v4fVec) {
                    this.w = v4fVec.x;
                    this.w = v4fVec.y;
                    this.x = v4fVec.z;
                    this.y = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Vec4.prototype, "wwxz", {
                get: function () {
                    return Vec4.stackCeil.set(this.w, this.w, this.x, this.z);
                },
                set: function (v4fVec) {
                    this.w = v4fVec.x;
                    this.w = v4fVec.y;
                    this.x = v4fVec.z;
                    this.z = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Vec4.prototype, "wwxw", {
                get: function () {
                    return Vec4.stackCeil.set(this.w, this.w, this.x, this.w);
                },
                set: function (v4fVec) {
                    this.w = v4fVec.x;
                    this.w = v4fVec.y;
                    this.x = v4fVec.z;
                    this.w = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Vec4.prototype, "wwyx", {
                get: function () {
                    return Vec4.stackCeil.set(this.w, this.w, this.y, this.x);
                },
                set: function (v4fVec) {
                    this.w = v4fVec.x;
                    this.w = v4fVec.y;
                    this.y = v4fVec.z;
                    this.x = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Vec4.prototype, "wwyy", {
                get: function () {
                    return Vec4.stackCeil.set(this.w, this.w, this.y, this.y);
                },
                set: function (v4fVec) {
                    this.w = v4fVec.x;
                    this.w = v4fVec.y;
                    this.y = v4fVec.z;
                    this.y = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Vec4.prototype, "wwyz", {
                get: function () {
                    return Vec4.stackCeil.set(this.w, this.w, this.y, this.z);
                },
                set: function (v4fVec) {
                    this.w = v4fVec.x;
                    this.w = v4fVec.y;
                    this.y = v4fVec.z;
                    this.z = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Vec4.prototype, "wwyw", {
                get: function () {
                    return Vec4.stackCeil.set(this.w, this.w, this.y, this.w);
                },
                set: function (v4fVec) {
                    this.w = v4fVec.x;
                    this.w = v4fVec.y;
                    this.y = v4fVec.z;
                    this.w = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Vec4.prototype, "wwzx", {
                get: function () {
                    return Vec4.stackCeil.set(this.w, this.w, this.z, this.x);
                },
                set: function (v4fVec) {
                    this.w = v4fVec.x;
                    this.w = v4fVec.y;
                    this.z = v4fVec.z;
                    this.x = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Vec4.prototype, "wwzy", {
                get: function () {
                    return Vec4.stackCeil.set(this.w, this.w, this.z, this.y);
                },
                set: function (v4fVec) {
                    this.w = v4fVec.x;
                    this.w = v4fVec.y;
                    this.z = v4fVec.z;
                    this.y = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Vec4.prototype, "wwzz", {
                get: function () {
                    return Vec4.stackCeil.set(this.w, this.w, this.z, this.z);
                },
                set: function (v4fVec) {
                    this.w = v4fVec.x;
                    this.w = v4fVec.y;
                    this.z = v4fVec.z;
                    this.z = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Vec4.prototype, "wwzw", {
                get: function () {
                    return Vec4.stackCeil.set(this.w, this.w, this.z, this.w);
                },
                set: function (v4fVec) {
                    this.w = v4fVec.x;
                    this.w = v4fVec.y;
                    this.z = v4fVec.z;
                    this.w = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Vec4.prototype, "wwwx", {
                get: function () {
                    return Vec4.stackCeil.set(this.w, this.w, this.w, this.x);
                },
                set: function (v4fVec) {
                    this.w = v4fVec.x;
                    this.w = v4fVec.y;
                    this.w = v4fVec.z;
                    this.x = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Vec4.prototype, "wwwy", {
                get: function () {
                    return Vec4.stackCeil.set(this.w, this.w, this.w, this.y);
                },
                set: function (v4fVec) {
                    this.w = v4fVec.x;
                    this.w = v4fVec.y;
                    this.w = v4fVec.z;
                    this.y = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Vec4.prototype, "wwwz", {
                get: function () {
                    return Vec4.stackCeil.set(this.w, this.w, this.w, this.z);
                },
                set: function (v4fVec) {
                    this.w = v4fVec.x;
                    this.w = v4fVec.y;
                    this.w = v4fVec.z;
                    this.z = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Vec4.prototype, "wwww", {
                get: function () {
                    return Vec4.stackCeil.set(this.w, this.w, this.w, this.w);
                },
                set: function (v4fVec) {
                    this.w = v4fVec.x;
                    this.w = v4fVec.y;
                    this.w = v4fVec.z;
                    this.w = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });
            Vec4.prototype.set = function () {
                var nArgumentsLength = arguments.length;
                switch(nArgumentsLength) {
                    case 0:
                        this.x = this.y = this.z = this.w = 0.;
                        break;
                    case 1:
                        if ((typeof (arguments[0]) === "number")) {
                            this.x = this.y = this.z = this.w = arguments[0];
                        } else if (arguments[0] instanceof Vec4) {
                            var v4fVec = arguments[0];
                            this.x = v4fVec.x;
                            this.y = v4fVec.y;
                            this.z = v4fVec.z;
                            this.w = v4fVec.w;
                        } else //color
                        if (((arguments[0].r) !== undefined)) {
                            this.x = arguments[0].r;
                            this.y = arguments[0].g;
                            this.z = arguments[0].b;
                            this.w = arguments[0].a;
                        } else {
                            //array
                            var pArray = arguments[0];
                            this.x = pArray[0];
                            this.y = pArray[1];
                            this.z = pArray[2];
                            this.w = pArray[3];
                        }
                        break;
                    case 2:
                        if ((typeof (arguments[0]) === "number")) {
                            var fValue = arguments[0];
                            var v3fVec = arguments[1];
                            this.x = fValue;
                            this.y = v3fVec.x;
                            this.z = v3fVec.y;
                            this.w = v3fVec.z;
                        } else if (arguments[0] instanceof math.Vec2) {
                            var v2fVec1 = arguments[0];
                            var v2fVec2 = arguments[1];
                            this.x = v2fVec1.x;
                            this.y = v2fVec1.y;
                            this.z = v2fVec2.x;
                            this.w = v2fVec2.y;
                        } else {
                            var v3fVec = arguments[0];
                            var fValue = arguments[1];
                            this.x = v3fVec.x;
                            this.y = v3fVec.y;
                            this.z = v3fVec.z;
                            this.w = fValue;
                        }
                        break;
                    case 3:
                        if ((typeof (arguments[0]) === "number")) {
                            var fValue1 = arguments[0];
                            if ((typeof (arguments[1]) === "number")) {
                                var fValue2 = arguments[1];
                                var v2fVec = arguments[2];
                                this.x = fValue1;
                                this.y = fValue2;
                                this.z = v2fVec.x;
                                this.w = v2fVec.y;
                            } else {
                                var v2fVec = arguments[1];
                                var fValue2 = arguments[2];
                                this.x = fValue1;
                                this.y = v2fVec.x;
                                this.z = v2fVec.y;
                                this.w = fValue2;
                            }
                        } else {
                            var v2fVec = arguments[0];
                            var fValue1 = arguments[1];
                            var fValue2 = arguments[2];
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
            Vec4.prototype.clear = /** @inline */function () {
                this.x = this.y = this.z = this.w = 0.;
                return this;
            };
            Vec4.prototype.add = function (v4fVec, v4fDestination) {
                if (!((v4fDestination) !== undefined)) {
                    v4fDestination = this;
                }
                v4fDestination.x = this.x + v4fVec.x;
                v4fDestination.y = this.y + v4fVec.y;
                v4fDestination.z = this.z + v4fVec.z;
                v4fDestination.w = this.w + v4fVec.w;
                return v4fDestination;
            };
            Vec4.prototype.subtract = function (v4fVec, v4fDestination) {
                if (!((v4fDestination) !== undefined)) {
                    v4fDestination = this;
                }
                v4fDestination.x = this.x - v4fVec.x;
                v4fDestination.y = this.y - v4fVec.y;
                v4fDestination.z = this.z - v4fVec.z;
                v4fDestination.w = this.w - v4fVec.w;
                return v4fDestination;
            };
            Vec4.prototype.dot = /** @inline */function (v4fVec) {
                return this.x * v4fVec.x + this.y * v4fVec.y + this.z * v4fVec.z + this.w * v4fVec.w;
            };
            Vec4.prototype.isEqual = function (v4fVec, fEps) {
                if (typeof fEps === "undefined") { fEps = 0.; }
                if (fEps === 0.) {
                    if (this.x != v4fVec.x || this.y != v4fVec.y || this.z != v4fVec.z || this.w != v4fVec.w) {
                        return false;
                    }
                } else {
                    if (math.abs(this.x - v4fVec.x) > fEps || math.abs(this.y - v4fVec.y) > fEps || math.abs(this.z - v4fVec.z) > fEps || math.abs(this.w - v4fVec.w) > fEps) {
                        return false;
                    }
                }
                return true;
            };
            Vec4.prototype.isClear = function (fEps) {
                if (typeof fEps === "undefined") { fEps = 0.; }
                if (fEps === 0.) {
                    if (this.x != 0. || this.y != 0. || this.z != 0. || this.w != 0.) {
                        return false;
                    }
                } else {
                    if (math.abs(this.x) > fEps || math.abs(this.y) > fEps || math.abs(this.z) > fEps || math.abs(this.w) > fEps) {
                        return false;
                    }
                }
                return true;
            };
            Vec4.prototype.negate = function (v4fDestination) {
                if (!((v4fDestination) !== undefined)) {
                    v4fDestination = this;
                }
                v4fDestination.x = -this.x;
                v4fDestination.y = -this.y;
                v4fDestination.z = -this.z;
                v4fDestination.w = -this.w;
                return v4fDestination;
            };
            Vec4.prototype.scale = function (fScale, v4fDestination) {
                if (!((v4fDestination) !== undefined)) {
                    v4fDestination = this;
                }
                v4fDestination.x = this.x * fScale;
                v4fDestination.y = this.y * fScale;
                v4fDestination.z = this.z * fScale;
                v4fDestination.w = this.w * fScale;
                return v4fDestination;
            };
            Vec4.prototype.normalize = function (v4fDestination) {
                if (!((v4fDestination) !== undefined)) {
                    v4fDestination = this;
                }
                var x = this.x, y = this.y, z = this.z, w = this.w;
                var fLength = math.sqrt(x * x + y * y + z * z + w * w);
                if (fLength !== 0.) {
                    var fInvLength = 1. / fLength;
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
            Vec4.prototype.length = /** @inline */function () {
                var x = this.x, y = this.y, z = this.z, w = this.w;
                return math.sqrt(x * x + y * y + z * z + w * w);
            };
            Vec4.prototype.lengthSquare = /** @inline */function () {
                var x = this.x, y = this.y, z = this.z, w = this.w;
                return x * x + y * y + z * z + w * w;
            };
            Vec4.prototype.direction = function (v4fVec, v4fDestination) {
                if (!((v4fDestination) !== undefined)) {
                    v4fDestination = this;
                }
                var x = v4fVec.x - this.x;
                var y = v4fVec.y - this.y;
                var z = v4fVec.z - this.z;
                var w = v4fVec.w - this.w;
                var fLength = math.sqrt(x * x + y * y + z * z + w * w);
                if (fLength !== 0.) {
                    var fInvLength = 1. / fLength;
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
            Vec4.prototype.mix = function (v4fVec, fA, v4fDestination) {
                if (!((v4fDestination) !== undefined)) {
                    v4fDestination = this;
                }
                fA = (/*checked (origin: math)>>*/akra.math.max((0.), /*checked (origin: math)>>*/akra.math.min((fA), (1.))));
                var fA1 = 1. - fA;
                var fA2 = fA;
                v4fDestination.x = fA1 * this.x + fA2 * v4fVec.x;
                v4fDestination.y = fA1 * this.y + fA2 * v4fVec.y;
                v4fDestination.z = fA1 * this.z + fA2 * v4fVec.z;
                v4fDestination.w = fA1 * this.w + fA2 * v4fVec.w;
                return v4fDestination;
            };
            Vec4.prototype.toString = /** @inline */function () {
                return "[x: " + this.x + ", y: " + this.y + ", z: " + this.z + ", w: " + this.w + "]";
            };
            Object.defineProperty(Vec4, "stackCeil", {
                get: function () {
                    Vec4.stackPosition = Vec4.stackPosition === Vec4.stackSize - 1 ? 0 : Vec4.stackPosition;
                    return Vec4.stack[Vec4.stackPosition++];
                },
                enumerable: true,
                configurable: true
            });
            Vec4.stackSize = 256;
            Vec4.stackPosition = 0;
            Vec4.stack = (function () {
                var pStack = new Array(Vec4.stackSize);
                for(var i = 0; i < Vec4.stackSize; i++) {
                    pStack[i] = new Vec4();
                }
                return pStack;
            })();
            return Vec4;
        })();
        math.Vec4 = Vec4;        
    })(akra.math || (akra.math = {}));
    var math = akra.math;
})(akra || (akra = {}));
;
;
var akra;
(function (akra) {
    (function (math) {
        var Mat3 = (function () {
            function Mat3(fValue1, fValue2, fValue3, fValue4, fValue5, fValue6, fValue7, fValue8, fValue9) {
                var nArgumentsLength = arguments.length;
                this.data = new Float32Array(9);
                switch(nArgumentsLength) {
                    case 1:
                        this.set(arguments[0]);
                        break;
                    case 3:
                        this.set(arguments[0], arguments[1], arguments[2]);
                        break;
                    case 9:
                        this.set(arguments[0], arguments[1], arguments[2], arguments[3], arguments[4], arguments[5], arguments[6], arguments[7], arguments[8]);
                        break;
                    default:
                        break;
                }
            }
            Mat3.prototype.set = function (fValue1, fValue2, fValue3, fValue4, fValue5, fValue6, fValue7, fValue8, fValue9) {
                var pData = this.data;
                //без аргументов инициализируется нулями
                var nArgumentsLength = arguments.length;
                if (nArgumentsLength == 0) {
                    pData[0] = pData[3] = pData[6] = 0;
                    pData[1] = pData[4] = pData[7] = 0;
                    pData[2] = pData[5] = pData[8] = 0;
                }
                if (nArgumentsLength == 1) {
                    if ((typeof (arguments[0]) === "number")) {
                        var nValue = arguments[0];
                        pData[0] = nValue;
                        pData[3] = 0;
                        pData[6] = 0;
                        pData[1] = 0;
                        pData[4] = nValue;
                        pData[7] = 0;
                        pData[2] = 0;
                        pData[5] = 0;
                        pData[8] = nValue;
                    } else if (((arguments[0].data) !== undefined)) {
                        var pElements = arguments[0].data;
                        if (pElements.length === 9) {
                            //Mat3
                            pData[0] = pElements[0];
                            pData[3] = pElements[3];
                            pData[6] = pElements[6];
                            pData[1] = pElements[1];
                            pData[4] = pElements[4];
                            pData[7] = pElements[7];
                            pData[2] = pElements[2];
                            pData[5] = pElements[5];
                            pData[8] = pElements[8];
                        } else {
                            //Mat4
                            pData[0] = pElements[0];
                            pData[3] = pElements[4];
                            pData[6] = pElements[8];
                            pData[1] = pElements[1];
                            pData[4] = pElements[5];
                            pData[7] = pElements[9];
                            pData[2] = pElements[2];
                            pData[5] = pElements[6];
                            pData[8] = pElements[10];
                        }
                    } else if (arguments[0] instanceof math.Vec3) {
                        var v3fVec = arguments[0];
                        //диагональ
                        pData[0] = v3fVec.x;
                        pData[3] = 0;
                        pData[6] = 0;
                        pData[1] = 0;
                        pData[4] = v3fVec.y;
                        pData[7] = 0;
                        pData[2] = 0;
                        pData[5] = 0;
                        pData[8] = v3fVec.z;
                    } else {
                        var pElements = arguments[0];
                        if (pElements.length == 3) {
                            //ложим диагональ
                            pData[0] = pElements[0];
                            pData[3] = 0;
                            pData[6] = 0;
                            pData[1] = 0;
                            pData[4] = pElements[1];
                            pData[7] = 0;
                            pData[2] = 0;
                            pData[5] = 0;
                            pData[8] = pElements[2];
                        } else {
                            pData[0] = pElements[0];
                            pData[3] = pElements[3];
                            pData[6] = pElements[6];
                            pData[1] = pElements[1];
                            pData[4] = pElements[4];
                            pData[7] = pElements[7];
                            pData[2] = pElements[2];
                            pData[5] = pElements[5];
                            pData[8] = pElements[8];
                        }
                    }
                } else if (nArgumentsLength == 3) {
                    if ((typeof (arguments[0]) === "number")) {
                        //выставляем диагональ
                        pData[0] = arguments[0];
                        pData[3] = 0;
                        pData[6] = 0;
                        pData[1] = 0;
                        pData[4] = arguments[1];
                        pData[7] = 0;
                        pData[2] = 0;
                        pData[5] = 0;
                        pData[8] = arguments[2];
                    } else {
                        var pData1, pData2, pData3;
                        if (arguments[0] instanceof math.Vec3) {
                            var v3fVec1 = arguments[0];
                            var v3fVec2 = arguments[1];
                            var v3fVec3 = arguments[2];
                            //ложим по столбцам
                            pData[0] = v3fVec1.x;
                            pData[3] = v3fVec2.x;
                            pData[6] = v3fVec3.x;
                            pData[1] = v3fVec1.y;
                            pData[4] = v3fVec2.y;
                            pData[7] = v3fVec3.y;
                            pData[2] = v3fVec1.z;
                            pData[5] = v3fVec2.z;
                            pData[8] = v3fVec3.z;
                        } else {
                            var v3fVec1 = arguments[0];
                            var v3fVec2 = arguments[1];
                            var v3fVec3 = arguments[2];
                            //ложим по столбцам
                            pData[0] = v3fVec1[0];
                            pData[3] = v3fVec2[0];
                            pData[6] = v3fVec3[0];
                            pData[1] = v3fVec1[1];
                            pData[4] = v3fVec2[1];
                            pData[7] = v3fVec3[1];
                            pData[2] = v3fVec1[2];
                            pData[5] = v3fVec2[2];
                            pData[8] = v3fVec3[2];
                        }
                    }
                } else if (nArgumentsLength == 9) {
                    //просто числа
                    pData[0] = arguments[0];
                    pData[3] = arguments[3];
                    pData[6] = arguments[6];
                    pData[1] = arguments[1];
                    pData[4] = arguments[4];
                    pData[7] = arguments[7];
                    pData[2] = arguments[2];
                    pData[5] = arguments[5];
                    pData[8] = arguments[8];
                }
                return this;
            };
            Mat3.prototype.identity = function () {
                var pData = this.data;
                pData[0] = 1.;
                pData[3] = 0.;
                pData[6] = 0.;
                pData[1] = 0.;
                pData[4] = 1.;
                pData[7] = 0.;
                pData[2] = 0.;
                pData[5] = 0.;
                pData[8] = 1.;
                return this;
            };
            Mat3.prototype.add = function (m3fMat, m3fDestination) {
                if (!((m3fDestination) !== undefined)) {
                    m3fDestination = this;
                }
                var pData1 = this.data;
                var pData2 = m3fMat.data;
                var pDataDestination = m3fDestination.data;
                pDataDestination[0] = pData1[0] + pData2[0];
                pDataDestination[3] = pData1[3] + pData2[3];
                pDataDestination[6] = pData1[6] + pData2[6];
                pDataDestination[1] = pData1[1] + pData2[1];
                pDataDestination[4] = pData1[4] + pData2[4];
                pDataDestination[7] = pData1[7] + pData2[7];
                pDataDestination[2] = pData1[2] + pData2[2];
                pDataDestination[5] = pData1[5] + pData2[5];
                pDataDestination[8] = pData1[8] + pData2[8];
                return m3fDestination;
            };
            Mat3.prototype.subtract = function (m3fMat, m3fDestination) {
                if (!((m3fDestination) !== undefined)) {
                    m3fDestination = this;
                }
                var pData1 = this.data;
                var pData2 = m3fMat.data;
                var pDataDestination = m3fDestination.data;
                pDataDestination[0] = pData1[0] - pData2[0];
                pDataDestination[3] = pData1[3] - pData2[3];
                pDataDestination[6] = pData1[6] - pData2[6];
                pDataDestination[1] = pData1[1] - pData2[1];
                pDataDestination[4] = pData1[4] - pData2[4];
                pDataDestination[7] = pData1[7] - pData2[7];
                pDataDestination[2] = pData1[2] - pData2[2];
                pDataDestination[5] = pData1[5] - pData2[5];
                pDataDestination[8] = pData1[8] - pData2[8];
                return m3fDestination;
            };
            Mat3.prototype.multiply = function (m3fMat, m3fDestination) {
                var pData1 = this.data;
                var pData2 = m3fMat.data;
                if (!((m3fDestination) !== undefined)) {
                    m3fDestination = this;
                }
                var pDataDestination = m3fDestination.data;
                // Cache the matrix values (makes for huge speed increases!)
                                var a11 = pData1[0], a12 = pData1[3], a13 = pData1[6];
                var a21 = pData1[1], a22 = pData1[4], a23 = pData1[7];
                var a31 = pData1[2], a32 = pData1[5], a33 = pData1[8];
                var b11 = pData2[0], b12 = pData2[3], b13 = pData2[6];
                var b21 = pData2[1], b22 = pData2[4], b23 = pData2[7];
                var b31 = pData2[2], b32 = pData2[5], b33 = pData2[8];
                pDataDestination[0] = a11 * b11 + a12 * b21 + a13 * b31;
                pDataDestination[3] = a11 * b12 + a12 * b22 + a13 * b32;
                pDataDestination[6] = a11 * b13 + a12 * b23 + a13 * b33;
                pDataDestination[1] = a21 * b11 + a22 * b21 + a23 * b31;
                pDataDestination[4] = a21 * b12 + a22 * b22 + a23 * b32;
                pDataDestination[7] = a21 * b13 + a22 * b23 + a23 * b33;
                pDataDestination[2] = a31 * b11 + a32 * b21 + a33 * b31;
                pDataDestination[5] = a31 * b12 + a32 * b22 + a33 * b32;
                pDataDestination[8] = a31 * b13 + a32 * b23 + a33 * b33;
                return m3fDestination;
            };
            Mat3.prototype.multiplyVec3 = function (v3fVec, v3fDestination) {
                var pData = this.data;
                if (!((v3fDestination) !== undefined)) {
                    v3fDestination = v3fVec;
                }
                var x = v3fVec.x, y = v3fVec.y, z = v3fVec.z;
                v3fDestination.x = pData[0] * x + pData[3] * y + pData[6] * z;
                v3fDestination.y = pData[1] * x + pData[4] * y + pData[7] * z;
                v3fDestination.z = pData[2] * x + pData[5] * y + pData[8] * z;
                return v3fDestination;
            };
            Mat3.prototype.transpose = function (m3fDestination) {
                var pData = this.data;
                if (!((m3fDestination) !== undefined)) {
                    //быстрее будет явно обработать оба случая
                                        var a12 = pData[3], a13 = pData[6], a23 = pData[7];
                    pData[3] = pData[1];
                    pData[6] = pData[2];
                    pData[1] = a12;
                    pData[7] = pData[5];
                    pData[2] = a13;
                    pData[5] = a23;
                    return this;
                }
                var pDataDestination = m3fDestination.data;
                pDataDestination[0] = pData[0];
                pDataDestination[3] = pData[1];
                pDataDestination[6] = pData[2];
                pDataDestination[1] = pData[3];
                pDataDestination[4] = pData[4];
                pDataDestination[7] = pData[5];
                pDataDestination[2] = pData[6];
                pDataDestination[5] = pData[7];
                pDataDestination[8] = pData[8];
                return m3fDestination;
            };
            Mat3.prototype.determinant = function () {
                var pData = this.data;
                var a11 = pData[0], a12 = pData[3], a13 = pData[6];
                var a21 = pData[1], a22 = pData[4], a23 = pData[7];
                var a31 = pData[2], a32 = pData[5], a33 = pData[8];
                return a11 * (a22 * a33 - a23 * a32) - a12 * (a21 * a33 - a23 * a31) + a13 * (a21 * a32 - a22 * a31);
            };
            Mat3.prototype.inverse = function (m3fDestination) {
                if (!((m3fDestination) !== undefined)) {
                    m3fDestination = this;
                }
                var pData = this.data;
                var pDataDestination = m3fDestination.data;
                var a11 = pData[0], a12 = pData[3], a13 = pData[6];
                var a21 = pData[1], a22 = pData[4], a23 = pData[7];
                var a31 = pData[2], a32 = pData[5], a33 = pData[8];
                var A11 = a22 * a33 - a23 * a32;
                var A12 = a21 * a33 - a23 * a31;
                var A13 = a21 * a32 - a22 * a31;
                var A21 = a12 * a33 - a13 * a32;
                var A22 = a11 * a33 - a13 * a31;
                var A23 = a11 * a32 - a12 * a31;
                var A31 = a12 * a23 - a13 * a22;
                var A32 = a11 * a23 - a13 * a21;
                var A33 = a11 * a22 - a12 * a21;
                var fDeterminant = a11 * A11 - a12 * A12 + a13 * A13;
                if (fDeterminant == 0.) {
 {
                        akra.logger.setSourceLocation("Mat3.ts", 445);
                        akra.logger.error("обращение матрицы с нулевым детеминантом:\n", this.toString());
                    }
                    ;
                    return m3fDestination.set(1.);
                    //чтоб все не навернулось
                                    }
                var fInverseDeterminant = 1. / fDeterminant;
                pDataDestination[0] = A11 * fInverseDeterminant;
                pDataDestination[3] = -A21 * fInverseDeterminant;
                pDataDestination[6] = A31 * fInverseDeterminant;
                pDataDestination[1] = -A12 * fInverseDeterminant;
                pDataDestination[4] = A22 * fInverseDeterminant;
                pDataDestination[7] = -A32 * fInverseDeterminant;
                pDataDestination[2] = A13 * fInverseDeterminant;
                pDataDestination[5] = -A23 * fInverseDeterminant;
                pDataDestination[8] = A33 * fInverseDeterminant;
                return m3fDestination;
            };
            Mat3.prototype.isEqual = function (m3fMat, fEps) {
                if (typeof fEps === "undefined") { fEps = 0.; }
                var pData1 = this.data;
                var pData2 = m3fMat.data;
                if (fEps == 0) {
                    if (pData1[0] != pData2[0] || pData1[3] != pData2[3] || pData1[6] != pData2[6] || pData1[1] != pData2[1] || pData1[4] != pData2[4] || pData1[7] != pData2[7] || pData1[2] != pData2[2] || pData1[5] != pData2[5] || pData1[8] != pData2[8]) {
                        return false;
                    }
                } else {
                    if (Math.abs(pData1[0] - pData2[0]) > fEps || Math.abs(pData1[3] - pData2[3]) > fEps || Math.abs(pData1[6] - pData2[6]) > fEps || Math.abs(pData1[1] - pData2[1]) > fEps || Math.abs(pData1[4] - pData2[4]) > fEps || Math.abs(pData1[7] - pData2[7]) > fEps || Math.abs(pData1[2] - pData2[2]) > fEps || Math.abs(pData1[5] - pData2[5]) > fEps || Math.abs(pData1[8] - pData2[8]) > fEps) {
                        return false;
                    }
                }
                return true;
            };
            Mat3.prototype.isDiagonal = function (fEps) {
                if (typeof fEps === "undefined") { fEps = 0.; }
                var pData = this.data;
                if (fEps == 0) {
                    if (pData[3] != 0 || pData[6] != 0 || pData[1] != 0 || pData[7] != 0 || pData[2] != 0 || pData[5] != 0) {
                        return false;
                    }
                } else {
                    if (Math.abs(pData[3]) > fEps || Math.abs(pData[6]) > fEps || Math.abs(pData[1]) > fEps || Math.abs(pData[7]) > fEps || Math.abs(pData[2]) > fEps || Math.abs(pData[5]) > fEps) {
                        return false;
                    }
                }
                return true;
            };
            Mat3.prototype.toMat4 = function (m4fDestination) {
                if (!((m4fDestination) !== undefined)) {
                    m4fDestination = new math.Mat4();
                }
                var pData = this.data;
                var pDataDestination = m4fDestination.data;
                pDataDestination[0] = pData[0];
                pDataDestination[4] = pData[3];
                pDataDestination[8] = pData[6];
                pDataDestination[12] = 0;
                pDataDestination[1] = pData[1];
                pDataDestination[5] = pData[4];
                pDataDestination[9] = pData[7];
                pDataDestination[13] = 0;
                pDataDestination[2] = pData[2];
                pDataDestination[6] = pData[5];
                pDataDestination[10] = pData[8];
                pDataDestination[14] = 0;
                pDataDestination[3] = 0;
                pDataDestination[7] = 0;
                pDataDestination[11] = 0;
                pDataDestination[15] = 1;
                return m4fDestination;
            };
            Mat3.prototype.toQuat4 = function (q4fDestination) {
                if (!((q4fDestination) !== undefined)) {
                    q4fDestination = new math.Quat4();
                }
                var pData = this.data;
                var a11 = pData[0], a12 = pData[3], a13 = pData[6];
                var a21 = pData[1], a22 = pData[4], a23 = pData[7];
                var a31 = pData[2], a32 = pData[5], a33 = pData[8];
                /*x^2*/
                var x2 = ((a11 - a22 - a33) + 1) / 4;
                /*y^2*/
                var y2 = ((a22 - a11 - a33) + 1) / 4;
                /*z^2*/
                var z2 = ((a33 - a11 - a22) + 1) / 4;
                /*w^2*/
                var w2 = ((a11 + a22 + a33) + 1) / 4;
                var fMax = Math.max(x2, Math.max(y2, Math.max(z2, w2)));
                if (fMax == x2) {
                    //максимальная компонента берется положительной
                    var x = Math.sqrt(x2);
                    q4fDestination.x = x;
                    q4fDestination.y = (a21 + a12) / 4 / x;
                    q4fDestination.z = (a31 + a13) / 4 / x;
                    q4fDestination.w = (a32 - a23) / 4 / x;
                } else if (fMax == y2) {
                    //максимальная компонента берется положительной
                    var y = Math.sqrt(y2);
                    q4fDestination.x = (a21 + a12) / 4 / y;
                    q4fDestination.y = y;
                    q4fDestination.z = (a32 + a23) / 4 / y;
                    q4fDestination.w = (a13 - a31) / 4 / y;
                } else if (fMax == z2) {
                    //максимальная компонента берется положительной
                    var z = Math.sqrt(z2);
                    q4fDestination.x = (a31 + a13) / 4 / z;
                    q4fDestination.y = (a32 + a23) / 4 / z;
                    q4fDestination.z = z;
                    q4fDestination.w = (a21 - a12) / 4 / z;
                } else {
                    //максимальная компонента берется положительной
                    var w = Math.sqrt(w2);
                    q4fDestination.x = (a32 - a23) / 4 / w;
                    q4fDestination.y = (a13 - a31) / 4 / w;
                    q4fDestination.z = (a21 - a12) / 4 / w;
                    q4fDestination.w = w;
                }
                return q4fDestination;
            };
            Mat3.prototype.toString = function () {
                var pData = this.data;
                return '[' + pData[0] + ', ' + pData[3] + ', ' + pData[6] + ',\n' + +pData[1] + ', ' + pData[4] + ', ' + pData[7] + ',\n' + +pData[2] + ', ' + pData[5] + ', ' + pData[8] + ']';
            };
            Mat3.prototype.decompose = function (q4fRotation, v3fScale) {
                //изначально предполагаем, что порядок умножения был rot * scale
                var m3fRotScale = this;
                var m3fRotScaleTransposed = this.transpose(Mat3.stackCeil.set());
                var isRotScale = true;
                //понадобятся если порядок умножения был другим
                                var m3fScaleRot = null, m3fScaleRotTransposed = null;
                //было отражение или нет
                var scaleSign = (m3fRotScale.determinant() >= 0.) ? 1 : -1;
                var m3fResult = Mat3.stackCeil.set();
                //first variant rot * scale
                // (rot * scale)T * (rot * scale) =
                // scaleT * rotT * rot * scale = scaleT *rot^-1 * rot * scale =
                // scaleT * scale
                m3fRotScaleTransposed.multiply(m3fRotScale, m3fResult);
                if (!m3fResult.isDiagonal(1e-4)) {
                    //предположение было неверным
                    isRotScale = false;
                    //просто переобозначения чтобы не было путаницы
                    m3fScaleRot = m3fRotScale;
                    m3fScaleRotTransposed = m3fRotScaleTransposed;
                    //second variant scale * rot
                    // (scale * rot) * (scale * rot)T =
                    // scale * rot * rotT * scaleT = scale *rot * rot^-1 * scaleT =
                    // scale * scaleT
                    m3fScaleRot.multiply(m3fScaleRotTransposed, m3fResult);
                }
                var pResultData = m3fResult.data;
                var x = math.sqrt(pResultData[0]);
                /*если было отражение, считается что оно было по y*/
                var y = math.sqrt(pResultData[4]) * scaleSign;
                var z = math.sqrt(pResultData[8]);
                v3fScale.x = x;
                v3fScale.y = y;
                v3fScale.z = z;
                var m3fInverseScale = Mat3.stackCeil.set(1. / x, 1. / y, 1. / z);
                if (isRotScale) {
                    m3fRotScale.multiply(m3fInverseScale, Mat3.stackCeil.set()).toQuat4(q4fRotation);
                    return true;
                } else {
                    m3fInverseScale.multiply(m3fScaleRot, Mat3.stackCeil.set()).toQuat4(q4fRotation);
 {
                        akra.logger.setSourceLocation("Mat3.ts", 674);
                        akra.logger.assert(false, "порядок умножения scale rot в данный момент не поддерживается");
                    }
                    ;
                    return false;
                }
            };
            Mat3.prototype.row = function (iRow, v3fDestination) {
                if (!((v3fDestination) !== undefined)) {
                    v3fDestination = new math.Vec3();
                }
                var pData = this.data;
                switch(iRow) {
                    case 1:
                        v3fDestination.x = pData[0];
                        v3fDestination.y = pData[3];
                        v3fDestination.z = pData[6];
                        break;
                    case 2:
                        v3fDestination.x = pData[1];
                        v3fDestination.y = pData[4];
                        v3fDestination.z = pData[7];
                        break;
                    case 3:
                        v3fDestination.x = pData[2];
                        v3fDestination.y = pData[5];
                        v3fDestination.z = pData[8];
                        break;
                }
                return v3fDestination;
            };
            Mat3.prototype.column = function (iColumn, v3fDestination) {
                if (!((v3fDestination) !== undefined)) {
                    v3fDestination = new math.Vec3();
                }
                var pData = this.data;
                switch(iColumn) {
                    case 1:
                        v3fDestination.x = pData[0];
                        v3fDestination.y = pData[1];
                        v3fDestination.z = pData[2];
                        break;
                    case 2:
                        v3fDestination.x = pData[3];
                        v3fDestination.y = pData[4];
                        v3fDestination.z = pData[5];
                        break;
                    case 3:
                        v3fDestination.x = pData[6];
                        v3fDestination.y = pData[7];
                        v3fDestination.z = pData[8];
                        break;
                }
                return v3fDestination;
            };
            Mat3.fromYawPitchRoll = function fromYawPitchRoll(fYaw, fPitch, fRoll, m3fDestination) {
                if (arguments.length <= 2) {
                    //Vec3 + m3fDestination
                    var v3fVec = arguments[0];
                    fYaw = v3fVec.x;
                    fPitch = v3fVec.y;
                    fRoll = v3fVec.z;
                    m3fDestination = arguments[1];
                }
                if (!((m3fDestination) !== undefined)) {
                    m3fDestination = new Mat3();
                }
                var pDataDestination = m3fDestination.data;
                var fSin1 = Math.sin(fYaw);
                var fSin2 = Math.sin(fPitch);
                var fSin3 = Math.sin(fRoll);
                var fCos1 = Math.cos(fYaw);
                var fCos2 = Math.cos(fPitch);
                var fCos3 = Math.cos(fRoll);
                pDataDestination[0] = fCos1 * fCos3 + fSin1 * fSin2 * fSin3;
                pDataDestination[3] = fCos3 * fSin1 * fSin2 - fCos1 * fSin3;
                pDataDestination[6] = fCos2 * fSin1;
                pDataDestination[1] = fCos2 * fSin3;
                pDataDestination[4] = fCos2 * fCos3;
                pDataDestination[7] = -fSin2;
                pDataDestination[2] = fCos1 * fSin2 * fSin3 - fCos3 * fSin1;
                pDataDestination[5] = fSin1 * fSin3 + fCos1 * fCos3 * fSin2;
                pDataDestination[8] = fCos1 * fCos2;
                return m3fDestination;
            };
            Mat3.fromXYZ = function fromXYZ(fX, fY, fZ, m3fDestination) {
                if (arguments.length <= 2) {
                    //Vec3 + m3fDestination
                    var v3fVec = arguments[0];
                    return Mat3.fromYawPitchRoll(v3fVec.y, v3fVec.x, v3fVec.z, arguments[1]);
                } else {
                    //fX fY fZ m3fDestination
                    var fX = arguments[0];
                    var fY = arguments[1];
                    var fZ = arguments[2];
                    return Mat3.fromYawPitchRoll(fY, fX, fZ, arguments[3]);
                }
            };
            Object.defineProperty(Mat3, "stackCeil", {
                get: function () {
                    Mat3.stackPosition = Mat3.stackPosition === Mat3.stackSize - 1 ? 0 : Mat3.stackPosition;
                    return Mat3.stack[Mat3.stackPosition++];
                },
                enumerable: true,
                configurable: true
            });
            Mat3.stackSize = 256;
            Mat3.stackPosition = 0;
            Mat3.stack = (function () {
                var pStack = new Array(Mat3.stackSize);
                for(var i = 0; i < Mat3.stackSize; i++) {
                    pStack[i] = new Mat3();
                }
                return pStack;
            })();
            return Mat3;
        })();
        math.Mat3 = Mat3;        
        ;
    })(akra.math || (akra.math = {}));
    var math = akra.math;
})(akra || (akra = {}));
;
;
var akra;
(function (akra) {
    (function (math) {
        var Mat4 = (function () {
            function Mat4(fValue1, fValue2, fValue3, fValue4, fValue5, fValue6, fValue7, fValue8, fValue9, fValue10, fValue11, fValue12, fValue13, fValue14, fValue15, fValue16) {
                var nArgumentsLength = arguments.length;
                if (nArgumentsLength === 2) {
                    if ((typeof (arguments[1]) === "boolean")) {
                        if (arguments[1]) {
                            this.data = arguments[0];
                        } else {
                            this.data = new Float32Array(16);
                            this.set(arguments[0]);
                        }
                    } else {
                        this.data = new Float32Array(16);
                        this.set(arguments[0], arguments[1]);
                    }
                } else {
                    this.data = new Float32Array(16);
                    switch(nArgumentsLength) {
                        case 1:
                            if (arguments[0] instanceof math.Mat3) {
                                this.set(arguments[0], math.Vec3.stackCeil.set(0.));
                            } else {
                                this.set(arguments[0]);
                            }
                            break;
                        case 4:
                            this.set(arguments[0], arguments[1], arguments[2], arguments[3]);
                            break;
                        case 16:
                            this.set(arguments[0], arguments[1], arguments[2], arguments[3], arguments[4], arguments[5], arguments[6], arguments[7], arguments[8], arguments[9], arguments[10], arguments[11], arguments[12], arguments[13], arguments[14], arguments[15]);
                            break;
                        default:
                            break;
                    }
                }
            }
            Mat4.prototype.set = function () {
                var nArgumentsLength = arguments.length;
                var pData = this.data;
                if (nArgumentsLength === 0) {
                    pData[0] = pData[4] = pData[8] = pData[12] = pData[1] = pData[5] = pData[9] = pData[13] = pData[2] = pData[6] = pData[10] = pData[14] = pData[3] = pData[7] = pData[11] = pData[15] = 0.;
                    return this;
                }
                if (nArgumentsLength === 1) {
                    if ((typeof (arguments[0]) === "number")) {
                        var fValue = arguments[0];
                        pData[0] = fValue;
                        pData[4] = 0.;
                        pData[8] = 0.;
                        pData[12] = 0.;
                        pData[1] = 0.;
                        pData[5] = fValue;
                        pData[9] = 0.;
                        pData[13] = 0.;
                        pData[2] = 0.;
                        pData[6] = 0.;
                        pData[10] = fValue;
                        pData[14] = 0.;
                        pData[3] = 0.;
                        pData[7] = 0.;
                        pData[11] = 0.;
                        pData[15] = fValue;
                    } else if (arguments[0] instanceof math.Vec4) {
                        var v4fVec = arguments[0];
                        pData[0] = v4fVec.x;
                        pData[4] = 0.;
                        pData[8] = 0.;
                        pData[12] = 0.;
                        pData[1] = 0.;
                        pData[5] = v4fVec.y;
                        pData[9] = 0.;
                        pData[13] = 0.;
                        pData[2] = 0.;
                        pData[6] = 0.;
                        pData[10] = v4fVec.z;
                        pData[14] = 0.;
                        pData[3] = 0.;
                        pData[7] = 0.;
                        pData[11] = 0.;
                        pData[15] = v4fVec.w;
                    } else if (((arguments[0].data) !== undefined)) {
                        var pMatrixData = arguments[0].data;
                        if (pMatrixData.length == 16) {
                            //Mat4
                            pData.set(pMatrixData);
                        } else {
                            //Mat3
                            pData[0] = pMatrixData[0];
                            pData[4] = pMatrixData[3];
                            pData[8] = pMatrixData[6];
                            pData[1] = pMatrixData[1];
                            pData[5] = pMatrixData[4];
                            pData[9] = pMatrixData[7];
                            pData[2] = pMatrixData[2];
                            pData[6] = pMatrixData[5];
                            pData[10] = pMatrixData[8];
                            pData[3] = 0.;
                            pData[7] = 0.;
                            pData[11] = 0.;
                            pData[15] = 1.;
                        }
                    } else {
                        //array
                        var pArray = arguments[0];
                        if (pArray.length === 4) {
                            pData[0] = pArray[0];
                            pData[4] = 0.;
                            pData[8] = 0.;
                            pData[12] = 0.;
                            pData[1] = 0.;
                            pData[5] = pArray[1];
                            pData[9] = 0.;
                            pData[13] = 0.;
                            pData[2] = 0.;
                            pData[6] = 0.;
                            pData[10] = pArray[2];
                            pData[14] = 0.;
                            pData[3] = 0.;
                            pData[7] = 0.;
                            pData[11] = 0.;
                            pData[15] = pArray[3];
                        } else {
                            //length == 16
                            pData[0] = pArray[0];
                            pData[4] = pArray[4];
                            pData[8] = pArray[8];
                            pData[12] = pArray[12];
                            pData[1] = pArray[1];
                            pData[5] = pArray[5];
                            pData[9] = pArray[9];
                            pData[13] = pArray[13];
                            pData[2] = pArray[2];
                            pData[6] = pArray[6];
                            pData[10] = pArray[10];
                            pData[14] = pArray[14];
                            pData[3] = pArray[3];
                            pData[7] = pArray[7];
                            pData[11] = pArray[11];
                            pData[15] = pArray[15];
                        }
                    }
                } else if (nArgumentsLength == 2) {
                    var pMatrixData = arguments[0];
                    var v3fTranslation = arguments[1];
                    pData[0] = pMatrixData[0];
                    pData[4] = pMatrixData[3];
                    pData[8] = pMatrixData[6];
                    pData[12] = v3fTranslation.x;
                    pData[1] = pMatrixData[1];
                    pData[5] = pMatrixData[4];
                    pData[9] = pMatrixData[7];
                    pData[13] = v3fTranslation.y;
                    pData[2] = pMatrixData[2];
                    pData[6] = pMatrixData[5];
                    pData[10] = pMatrixData[8];
                    pData[14] = v3fTranslation.z;
                    pData[3] = 0.;
                    pData[7] = 0.;
                    pData[11] = 0.;
                    pData[15] = 1.;
                } else if (nArgumentsLength == 4) {
                    if ((typeof (arguments[0]) === "number")) {
                        pData[0] = arguments[0];
                        pData[4] = 0;
                        pData[8] = 0;
                        pData[12] = 0;
                        pData[1] = 0;
                        pData[5] = arguments[1];
                        pData[9] = 0;
                        pData[13] = 0;
                        pData[2] = 0;
                        pData[6] = 0;
                        pData[10] = arguments[2];
                        pData[14] = 0;
                        pData[3] = 0;
                        pData[7] = 0;
                        pData[11] = 0;
                        pData[15] = arguments[3];
                    } else if (arguments[0] instanceof math.Vec4) {
                        var v4fColumn1 = arguments[0];
                        var v4fColumn2 = arguments[1];
                        var v4fColumn3 = arguments[2];
                        var v4fColumn4 = arguments[3];
                        pData[0] = v4fColumn1.x;
                        pData[4] = v4fColumn2.x;
                        pData[8] = v4fColumn3.x;
                        pData[12] = v4fColumn4.x;
                        pData[1] = v4fColumn1.y;
                        pData[5] = v4fColumn2.y;
                        pData[9] = v4fColumn3.y;
                        pData[13] = v4fColumn4.y;
                        pData[2] = v4fColumn1.z;
                        pData[6] = v4fColumn2.z;
                        pData[10] = v4fColumn3.z;
                        pData[14] = v4fColumn4.z;
                        pData[3] = v4fColumn1.w;
                        pData[7] = v4fColumn2.w;
                        pData[11] = v4fColumn3.w;
                        pData[15] = v4fColumn4.w;
                    } else {
                        //arrays
                        var v4fColumn1 = arguments[0];
                        var v4fColumn2 = arguments[1];
                        var v4fColumn3 = arguments[2];
                        var v4fColumn4 = arguments[3];
                        pData[0] = v4fColumn1[0];
                        pData[4] = v4fColumn2[0];
                        pData[8] = v4fColumn3[0];
                        pData[12] = v4fColumn4[0];
                        pData[1] = v4fColumn1[1];
                        pData[5] = v4fColumn2[1];
                        pData[9] = v4fColumn3[1];
                        pData[13] = v4fColumn4[1];
                        pData[2] = v4fColumn1[2];
                        pData[6] = v4fColumn2[2];
                        pData[10] = v4fColumn3[2];
                        pData[14] = v4fColumn4[2];
                        pData[3] = v4fColumn1[3];
                        pData[7] = v4fColumn2[3];
                        pData[11] = v4fColumn3[3];
                        pData[15] = v4fColumn4[3];
                    }
                } else {
                    //nArgumentsLength === 16
                    pData[0] = arguments[0];
                    pData[4] = arguments[4];
                    pData[8] = arguments[8];
                    pData[12] = arguments[12];
                    pData[1] = arguments[1];
                    pData[5] = arguments[5];
                    pData[9] = arguments[9];
                    pData[13] = arguments[13];
                    pData[2] = arguments[2];
                    pData[6] = arguments[6];
                    pData[10] = arguments[10];
                    pData[14] = arguments[14];
                    pData[3] = arguments[3];
                    pData[7] = arguments[7];
                    pData[11] = arguments[11];
                    pData[15] = arguments[15];
                }
                return this;
            };
            Mat4.prototype.identity = function () {
                var pData = this.data;
                pData[0] = 1.;
                pData[4] = 0.;
                pData[8] = 0.;
                pData[12] = 0.;
                pData[1] = 0.;
                pData[5] = 1.;
                pData[9] = 0.;
                pData[13] = 0.;
                pData[2] = 0.;
                pData[6] = 0.;
                pData[10] = 1.;
                pData[14] = 0.;
                pData[3] = 0.;
                pData[7] = 0.;
                pData[11] = 0.;
                pData[15] = 1.;
                return this;
            };
            Mat4.prototype.add = function (m4fMat, m4fDestination) {
                if (!((m4fDestination) !== undefined)) {
                    m4fDestination = this;
                }
                var pData1 = this.data;
                var pData2 = m4fMat.data;
                var pDataDestination = m4fDestination.data;
                pDataDestination[0] = pData1[0] + pData2[0];
                pDataDestination[4] = pData1[4] + pData2[4];
                pDataDestination[8] = pData1[8] + pData2[8];
                pDataDestination[12] = pData1[12] + pData2[12];
                pDataDestination[1] = pData1[1] + pData2[1];
                pDataDestination[5] = pData1[5] + pData2[5];
                pDataDestination[9] = pData1[9] + pData2[9];
                pDataDestination[13] = pData1[13] + pData2[13];
                pDataDestination[2] = pData1[2] + pData2[2];
                pDataDestination[6] = pData1[6] + pData2[6];
                pDataDestination[10] = pData1[10] + pData2[10];
                pDataDestination[14] = pData1[14] + pData2[14];
                pDataDestination[3] = pData1[3] + pData2[3];
                pDataDestination[7] = pData1[7] + pData2[7];
                pDataDestination[11] = pData1[11] + pData2[11];
                pDataDestination[15] = pData1[15] + pData2[15];
                return m4fDestination;
            };
            Mat4.prototype.subtract = function (m4fMat, m4fDestination) {
                if (!((m4fDestination) !== undefined)) {
                    m4fDestination = this;
                }
                var pData1 = this.data;
                var pData2 = m4fMat.data;
                var pDataDestination = m4fDestination.data;
                pDataDestination[0] = pData1[0] - pData2[0];
                pDataDestination[4] = pData1[4] - pData2[4];
                pDataDestination[8] = pData1[8] - pData2[8];
                pDataDestination[12] = pData1[12] - pData2[12];
                pDataDestination[1] = pData1[1] - pData2[1];
                pDataDestination[5] = pData1[5] - pData2[5];
                pDataDestination[9] = pData1[9] - pData2[9];
                pDataDestination[13] = pData1[13] - pData2[13];
                pDataDestination[2] = pData1[2] - pData2[2];
                pDataDestination[6] = pData1[6] - pData2[6];
                pDataDestination[10] = pData1[10] - pData2[10];
                pDataDestination[14] = pData1[14] - pData2[14];
                pDataDestination[3] = pData1[3] - pData2[3];
                pDataDestination[7] = pData1[7] - pData2[7];
                pDataDestination[11] = pData1[11] - pData2[11];
                pDataDestination[15] = pData1[15] - pData2[15];
                return m4fDestination;
            };
            Mat4.prototype.multiply = function (m4fMat, m4fDestination) {
                if (!((m4fDestination) !== undefined)) {
                    m4fDestination = this;
                }
                var pData1 = this.data;
                var pData2 = m4fMat.data;
                var pDataDestination = m4fDestination.data;
                //кешируем значения матриц для ускорения
                                var a11 = pData1[0], a12 = pData1[4], a13 = pData1[8], a14 = pData1[12];
                var a21 = pData1[1], a22 = pData1[5], a23 = pData1[9], a24 = pData1[13];
                var a31 = pData1[2], a32 = pData1[6], a33 = pData1[10], a34 = pData1[14];
                var a41 = pData1[3], a42 = pData1[7], a43 = pData1[11], a44 = pData1[15];
                var b11 = pData2[0], b12 = pData2[4], b13 = pData2[8], b14 = pData2[12];
                var b21 = pData2[1], b22 = pData2[5], b23 = pData2[9], b24 = pData2[13];
                var b31 = pData2[2], b32 = pData2[6], b33 = pData2[10], b34 = pData2[14];
                var b41 = pData2[3], b42 = pData2[7], b43 = pData2[11], b44 = pData2[15];
                pDataDestination[0] = a11 * b11 + a12 * b21 + a13 * b31 + a14 * b41;
                pDataDestination[4] = a11 * b12 + a12 * b22 + a13 * b32 + a14 * b42;
                pDataDestination[8] = a11 * b13 + a12 * b23 + a13 * b33 + a14 * b43;
                pDataDestination[12] = a11 * b14 + a12 * b24 + a13 * b34 + a14 * b44;
                pDataDestination[1] = a21 * b11 + a22 * b21 + a23 * b31 + a24 * b41;
                pDataDestination[5] = a21 * b12 + a22 * b22 + a23 * b32 + a24 * b42;
                pDataDestination[9] = a21 * b13 + a22 * b23 + a23 * b33 + a24 * b43;
                pDataDestination[13] = a21 * b14 + a22 * b24 + a23 * b34 + a24 * b44;
                pDataDestination[2] = a31 * b11 + a32 * b21 + a33 * b31 + a34 * b41;
                pDataDestination[6] = a31 * b12 + a32 * b22 + a33 * b32 + a34 * b42;
                pDataDestination[10] = a31 * b13 + a32 * b23 + a33 * b33 + a34 * b43;
                pDataDestination[14] = a31 * b14 + a32 * b24 + a33 * b34 + a34 * b44;
                pDataDestination[3] = a41 * b11 + a42 * b21 + a43 * b31 + a44 * b41;
                pDataDestination[7] = a41 * b12 + a42 * b22 + a43 * b32 + a44 * b42;
                pDataDestination[11] = a41 * b13 + a42 * b23 + a43 * b33 + a44 * b43;
                pDataDestination[15] = a41 * b14 + a42 * b24 + a43 * b34 + a44 * b44;
                return m4fDestination;
            };
            Mat4.prototype.multiplyLeft = /** @inline */function (m4fMat, m4fDestination) {
                if (!((m4fDestination) !== undefined)) {
                    m4fDestination = this;
                }
                return m4fMat.multiply(this, m4fDestination);
            };
            Mat4.prototype.multiplyVec4 = function (v4fVec, v4fDestination) {
                if (!((v4fDestination) !== undefined)) {
                    v4fDestination = v4fVec;
                }
                var pData = this.data;
                var x = v4fVec.x, y = v4fVec.y, z = v4fVec.z, w = v4fVec.w;
                v4fDestination.x = pData[0] * x + pData[4] * y + pData[8] * z + pData[12] * w;
                v4fDestination.y = pData[1] * x + pData[5] * y + pData[9] * z + pData[13] * w;
                v4fDestination.z = pData[2] * x + pData[6] * y + pData[10] * z + pData[14] * w;
                v4fDestination.w = pData[3] * x + pData[7] * y + pData[11] * z + pData[15] * w;
                return v4fDestination;
            };
            Mat4.prototype.transpose = function (m4fDestination) {
                var pData = this.data;
                if (!((m4fDestination) !== undefined)) {
                    var a12 = pData[4], a13 = pData[8], a14 = pData[12];
                    var a23 = pData[9], a24 = pData[13];
                    var a34 = pData[14];
                    pData[4] = pData[1];
                    pData[8] = pData[2];
                    pData[12] = pData[3];
                    pData[1] = a12;
                    pData[9] = pData[6];
                    pData[13] = pData[7];
                    pData[2] = a13;
                    pData[6] = a23;
                    pData[14] = pData[11];
                    pData[3] = a14;
                    pData[7] = a24;
                    pData[11] = a34;
                    return this;
                }
                var pDataDestination = m4fDestination.data;
                pDataDestination[0] = pData[0];
                pDataDestination[4] = pData[1];
                pDataDestination[8] = pData[2];
                pDataDestination[12] = pData[3];
                pDataDestination[1] = pData[4];
                pDataDestination[5] = pData[5];
                pDataDestination[9] = pData[6];
                pDataDestination[13] = pData[7];
                pDataDestination[2] = pData[8];
                pDataDestination[6] = pData[9];
                pDataDestination[10] = pData[10];
                pDataDestination[14] = pData[11];
                pDataDestination[3] = pData[12];
                pDataDestination[7] = pData[13];
                pDataDestination[11] = pData[14];
                pDataDestination[15] = pData[15];
                return m4fDestination;
            };
            Mat4.prototype.determinant = function () {
                var pData = this.data;
                var a11 = pData[0], a12 = pData[4], a13 = pData[8], a14 = pData[12];
                var a21 = pData[1], a22 = pData[5], a23 = pData[9], a24 = pData[13];
                var a31 = pData[2], a32 = pData[6], a33 = pData[10], a34 = pData[14];
                var a41 = pData[3], a42 = pData[7], a43 = pData[11], a44 = pData[15];
                return a41 * a32 * a23 * a14 - a31 * a42 * a23 * a14 - a41 * a22 * a33 * a14 + a21 * a42 * a33 * a14 + a31 * a22 * a43 * a14 - a21 * a32 * a43 * a14 - a41 * a32 * a13 * a24 + a31 * a42 * a13 * a24 + a41 * a12 * a33 * a24 - a11 * a42 * a33 * a24 - a31 * a12 * a43 * a24 + a11 * a32 * a43 * a24 + a41 * a22 * a13 * a34 - a21 * a42 * a13 * a34 - a41 * a12 * a23 * a34 + a11 * a42 * a23 * a34 + a21 * a12 * a43 * a34 - a11 * a22 * a43 * a34 - a31 * a22 * a13 * a44 + a21 * a32 * a13 * a44 + a31 * a12 * a23 * a44 - a11 * a32 * a23 * a44 - a21 * a12 * a33 * a44 + a11 * a22 * a33 * a44;
            };
            Mat4.prototype.inverse = function (m4fDestination) {
                if (!((m4fDestination) !== undefined)) {
                    m4fDestination = this;
                }
                var pData = this.data;
                var pDataDestination = m4fDestination.data;
                // Cache the matrix values (makes for huge speed increases!)
                                var a11 = pData[0], a12 = pData[4], a13 = pData[8], a14 = pData[12];
                var a21 = pData[1], a22 = pData[5], a23 = pData[9], a24 = pData[13];
                var a31 = pData[2], a32 = pData[6], a33 = pData[10], a34 = pData[14];
                var a41 = pData[3], a42 = pData[7], a43 = pData[11], a44 = pData[15];
                var b00 = a11 * a22 - a12 * a21;
                var b01 = a11 * a23 - a13 * a21;
                var b02 = a11 * a24 - a14 * a21;
                var b03 = a12 * a23 - a13 * a22;
                var b04 = a12 * a24 - a14 * a22;
                var b05 = a13 * a24 - a14 * a23;
                var b06 = a31 * a42 - a32 * a41;
                var b07 = a31 * a43 - a33 * a41;
                var b08 = a31 * a44 - a34 * a41;
                var b09 = a32 * a43 - a33 * a42;
                var b10 = a32 * a44 - a34 * a42;
                var b11 = a33 * a44 - a34 * a43;
                var fDeterminant = b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;
                if (fDeterminant === 0.) {
 {
                        akra.logger.setSourceLocation("Mat4.ts", 621);
                        akra.logger.assert(false, "обращение матрицы с нулевым детеминантом:\n" + this.toString());
                    }
                    ;
                    //чтоб все не навернулось
                    return m4fDestination.set(1.);
                }
                var fInverseDeterminant = 1 / fDeterminant;
                pDataDestination[0] = (a22 * b11 - a23 * b10 + a24 * b09) * fInverseDeterminant;
                pDataDestination[4] = (-a12 * b11 + a13 * b10 - a14 * b09) * fInverseDeterminant;
                pDataDestination[8] = (a42 * b05 - a43 * b04 + a44 * b03) * fInverseDeterminant;
                pDataDestination[12] = (-a32 * b05 + a33 * b04 - a34 * b03) * fInverseDeterminant;
                pDataDestination[1] = (-a21 * b11 + a23 * b08 - a24 * b07) * fInverseDeterminant;
                pDataDestination[5] = (a11 * b11 - a13 * b08 + a14 * b07) * fInverseDeterminant;
                pDataDestination[9] = (-a41 * b05 + a43 * b02 - a44 * b01) * fInverseDeterminant;
                pDataDestination[13] = (a31 * b05 - a33 * b02 + a34 * b01) * fInverseDeterminant;
                pDataDestination[2] = (a21 * b10 - a22 * b08 + a24 * b06) * fInverseDeterminant;
                pDataDestination[6] = (-a11 * b10 + a12 * b08 - a14 * b06) * fInverseDeterminant;
                pDataDestination[10] = (a41 * b04 - a42 * b02 + a44 * b00) * fInverseDeterminant;
                pDataDestination[14] = (-a31 * b04 + a32 * b02 - a34 * b00) * fInverseDeterminant;
                pDataDestination[3] = (-a21 * b09 + a22 * b07 - a23 * b06) * fInverseDeterminant;
                pDataDestination[7] = (a11 * b09 - a12 * b07 + a13 * b06) * fInverseDeterminant;
                pDataDestination[11] = (-a41 * b03 + a42 * b01 - a43 * b00) * fInverseDeterminant;
                pDataDestination[15] = (a31 * b03 - a32 * b01 + a33 * b00) * fInverseDeterminant;
                return m4fDestination;
            };
            Mat4.prototype.trace = /** @inline */function () {
                var pData = this.data;
                return pData[0] + pData[5] + pData[10] + pData[15];
            };
            Mat4.prototype.isEqual = function (m4fMat, fEps) {
                if (typeof fEps === "undefined") { fEps = 0.; }
                var pData1 = this.data;
                var pData2 = m4fMat.data;
                if (fEps === 0.) {
                    if (pData1[0] !== pData2[0] || pData1[4] !== pData2[4] || pData1[8] !== pData2[8] || pData1[12] !== pData2[12] || pData1[1] !== pData2[1] || pData1[5] !== pData2[5] || pData1[9] !== pData2[9] || pData1[13] !== pData2[13] || pData1[2] !== pData2[2] || pData1[6] !== pData2[6] || pData1[10] !== pData2[10] || pData1[14] !== pData2[14] || pData1[3] !== pData2[3] || pData1[7] !== pData2[7] || pData1[11] !== pData2[11] || pData1[15] !== pData2[15]) {
                        return false;
                    }
                } else {
                    if (math.abs(pData1[0] - pData2[0]) > fEps || math.abs(pData1[4] - pData2[4]) > fEps || math.abs(pData1[8] - pData2[8]) > fEps || math.abs(pData1[12] - pData2[12]) > fEps || math.abs(pData1[1] - pData2[1]) > fEps || math.abs(pData1[5] - pData2[5]) > fEps || math.abs(pData1[9] - pData2[9]) > fEps || math.abs(pData1[13] - pData2[13]) > fEps || math.abs(pData1[2] - pData2[2]) > fEps || math.abs(pData1[6] - pData2[6]) > fEps || math.abs(pData1[10] - pData2[10]) > fEps || math.abs(pData1[14] - pData2[14]) > fEps || math.abs(pData1[3] - pData2[3]) > fEps || math.abs(pData1[7] - pData2[7]) > fEps || math.abs(pData1[11] - pData2[11]) > fEps || math.abs(pData1[15] - pData2[15]) > fEps) {
                        return false;
                    }
                }
                return true;
            };
            Mat4.prototype.isDiagonal = function (fEps) {
                if (typeof fEps === "undefined") { fEps = 0.; }
                var pData = this.data;
                if (fEps === 0.) {
                    if (pData[4] !== 0. || pData[8] !== 0. || pData[12] != 0. || pData[1] !== 0. || pData[9] !== 0. || pData[13] != 0. || pData[2] !== 0. || pData[6] !== 0. || pData[14] != 0. || pData[3] !== 0. || pData[7] !== 0. || pData[11] != 0.) {
                        return false;
                    }
                } else {
                    if (math.abs(pData[4]) > fEps || math.abs(pData[8]) > fEps || math.abs(pData[12]) > fEps || math.abs(pData[1]) > fEps || math.abs(pData[9]) > fEps || math.abs(pData[13]) > fEps || math.abs(pData[2]) > fEps || math.abs(pData[6]) > fEps || math.abs(pData[14]) > fEps || math.abs(pData[3]) > fEps || math.abs(pData[7]) > fEps || math.abs(pData[11]) > fEps) {
                        return false;
                    }
                }
                return true;
            };
            Mat4.prototype.toMat3 = function (m3fDestination) {
                if (!((m3fDestination) !== undefined)) {
                    m3fDestination = new math.Mat3();
                }
                var pData = this.data;
                var pDataDestination = m3fDestination.data;
                pDataDestination[0] = pData[0];
                pDataDestination[3] = pData[4];
                pDataDestination[6] = pData[8];
                pDataDestination[1] = pData[1];
                pDataDestination[4] = pData[5];
                pDataDestination[7] = pData[9];
                pDataDestination[2] = pData[2];
                pDataDestination[5] = pData[6];
                pDataDestination[8] = pData[10];
                return m3fDestination;
            };
            Mat4.prototype.toQuat4 = function (q4fDestination) {
                if (!((q4fDestination) !== undefined)) {
                    q4fDestination = new math.Quat4();
                }
                var pData = this.data;
                var a11 = pData[0], a12 = pData[4], a13 = pData[8];
                var a21 = pData[1], a22 = pData[5], a23 = pData[9];
                var a31 = pData[2], a32 = pData[6], a33 = pData[10];
                /*x^2*/
                var x2 = ((a11 - a22 - a33) + 1.) / 4.;
                /*y^2*/
                var y2 = ((a22 - a11 - a33) + 1.) / 4.;
                /*z^2*/
                var z2 = ((a33 - a11 - a22) + 1.) / 4.;
                /*w^2*/
                var w2 = ((a11 + a22 + a33) + 1.) / 4.;
                var fMax = math.max(x2, math.max(y2, math.max(z2, w2)));
                if (fMax == x2) {
                    //максимальная компонента берется положительной
                    var x = math.sqrt(x2);
                    q4fDestination.x = x;
                    q4fDestination.y = (a21 + a12) / 4. / x;
                    q4fDestination.z = (a31 + a13) / 4. / x;
                    q4fDestination.w = (a32 - a23) / 4. / x;
                } else if (fMax == y2) {
                    //максимальная компонента берется положительной
                    var y = math.sqrt(y2);
                    q4fDestination.x = (a21 + a12) / 4. / y;
                    q4fDestination.y = y;
                    q4fDestination.z = (a32 + a23) / 4. / y;
                    q4fDestination.w = (a13 - a31) / 4. / y;
                } else if (fMax == z2) {
                    //максимальная компонента берется положительной
                    var z = math.sqrt(z2);
                    q4fDestination.x = (a31 + a13) / 4. / z;
                    q4fDestination.y = (a32 + a23) / 4. / z;
                    q4fDestination.z = z;
                    q4fDestination.w = (a21 - a12) / 4. / z;
                } else {
                    //максимальная компонента берется положительной
                    var w = math.sqrt(w2);
                    q4fDestination.x = (a32 - a23) / 4. / w;
                    q4fDestination.y = (a13 - a31) / 4. / w;
                    q4fDestination.z = (a21 - a12) / 4. / w;
                    q4fDestination.w = w;
                }
                return q4fDestination;
            };
            Mat4.prototype.toRotationMatrix = function (m4fDestination) {
                if (!((m4fDestination) !== undefined)) {
                    m4fDestination = new Mat4();
                }
                var pData = this.data;
                var pDataDestination = m4fDestination.data;
                pDataDestination[0] = pData[0];
                pDataDestination[4] = pData[4];
                pDataDestination[8] = pData[8];
                pDataDestination[12] = 0.;
                pDataDestination[1] = pData[1];
                pDataDestination[5] = pData[5];
                pDataDestination[9] = pData[9];
                pDataDestination[13] = 0.;
                pDataDestination[2] = pData[2];
                pDataDestination[6] = pData[6];
                pDataDestination[10] = pData[10];
                pDataDestination[14] = 0.;
                pDataDestination[3] = 0.;
                pDataDestination[7] = 0.;
                pDataDestination[11] = 0.;
                pDataDestination[15] = 1.;
                return m4fDestination;
            };
            Mat4.prototype.toString = function (iFixed) {
                if (typeof iFixed === "undefined") { iFixed = 2; }
                var pData = this.data;
                return '[' + pData[0].toFixed(iFixed) + ", " + pData[4].toFixed(iFixed) + ', ' + pData[8].toFixed(iFixed) + ', ' + pData[12].toFixed(iFixed) + ',\n' + pData[1].toFixed(iFixed) + ", " + pData[5].toFixed(iFixed) + ', ' + pData[9].toFixed(iFixed) + ', ' + pData[13].toFixed(iFixed) + ',\n' + pData[2].toFixed(iFixed) + ", " + pData[6].toFixed(iFixed) + ', ' + pData[10].toFixed(iFixed) + ', ' + pData[14].toFixed(iFixed) + ',\n' + pData[3].toFixed(iFixed) + ", " + pData[7].toFixed(iFixed) + ', ' + pData[11].toFixed(iFixed) + ', ' + pData[15].toFixed(iFixed) + ']';
            };
            Mat4.prototype.rotateRight = function (fAngle, v3fAxis, m4fDestination) {
                var pData = this.data;
                var x = v3fAxis.x, y = v3fAxis.y, z = v3fAxis.z;
                var fLength = Math.sqrt(x * x + y * y + z * z);
                if (fLength === 0.) {
 {
                        akra.logger.setSourceLocation("Mat4.ts", 857);
                        akra.logger.assert(false, "попытка вращения вокруг оси нулевой длины. Угол " + fAngle + ". Ось " + v3fAxis.toString());
                    }
                    ;
                    if (((m4fDestination) !== undefined)) {
                        m4fDestination.set(this);
                    } else {
                        m4fDestination = this;
                    }
                    return m4fDestination;
                }
                var fInvLength = 1. / fLength;
                x *= fInvLength;
                y *= fInvLength;
                z *= fInvLength;
                var a11 = pData[0], a12 = pData[4], a13 = pData[8];
                var a21 = pData[1], a22 = pData[5], a23 = pData[9];
                var a31 = pData[2], a32 = pData[6], a33 = pData[10];
                var fSin = math.sin(fAngle);
                var fCos = math.cos(fAngle);
                var fTmp = 1. - fCos;
                //build Rotation matrix
                                var b11 = fCos + fTmp * x * x, b12 = fTmp * x * y - fSin * z, b13 = fTmp * x * z + fSin * y;
                var b21 = fTmp * y * z + fSin * z, b22 = fCos + fTmp * y * y, b23 = fTmp * y * z - fSin * x;
                var b31 = fTmp * z * x - fSin * y, b32 = fTmp * z * y + fSin * x, b33 = fCos + fTmp * z * z;
                if (!((m4fDestination) !== undefined)) {
                    pData[0] = a11 * b11 + a12 * b21 + a13 * b31;
                    pData[4] = a11 * b12 + a12 * b22 + a13 * b32;
                    pData[8] = a11 * b13 + a12 * b23 + a13 * b33;
                    pData[1] = a21 * b11 + a22 * b21 + a23 * b31;
                    pData[5] = a21 * b12 + a22 * b22 + a23 * b32;
                    pData[9] = a21 * b13 + a22 * b23 + a23 * b33;
                    pData[2] = a31 * b11 + a32 * b21 + a33 * b31;
                    pData[6] = a31 * b12 + a32 * b22 + a33 * b32;
                    pData[10] = a31 * b13 + a32 * b23 + a33 * b33;
                    return this;
                }
                var pDataDestination = m4fDestination.data;
                pDataDestination[0] = a11 * b11 + a12 * b21 + a13 * b31;
                pDataDestination[4] = a11 * b12 + a12 * b22 + a13 * b32;
                pDataDestination[8] = a11 * b13 + a12 * b23 + a13 * b33;
                pDataDestination[12] = pData[12];
                pDataDestination[1] = a21 * b11 + a22 * b21 + a23 * b31;
                pDataDestination[5] = a21 * b12 + a22 * b22 + a23 * b32;
                pDataDestination[9] = a21 * b13 + a22 * b23 + a23 * b33;
                pDataDestination[13] = pData[13];
                pDataDestination[2] = a31 * b11 + a32 * b21 + a33 * b31;
                pDataDestination[6] = a31 * b12 + a32 * b22 + a33 * b32;
                pDataDestination[10] = a31 * b13 + a32 * b23 + a33 * b33;
                pDataDestination[14] = pData[14];
                pDataDestination[3] = pData[3];
                pDataDestination[7] = pData[7];
                pDataDestination[11] = pData[11];
                pDataDestination[15] = pData[15];
                return m4fDestination;
            };
            Mat4.prototype.rotateLeft = function (fAngle, v3fAxis, m4fDestination) {
                var pData = this.data;
                var x = v3fAxis.x, y = v3fAxis.y, z = v3fAxis.z;
                var fLength = Math.sqrt(x * x + y * y + z * z);
                if (fLength === 0.) {
 {
                        akra.logger.setSourceLocation("Mat4.ts", 935);
                        akra.logger.assert(false, "попытка вращения вокруг оси нулевой длины. Угол " + fAngle + ". Ось " + v3fAxis.toString());
                    }
                    ;
                    if (((m4fDestination) !== undefined)) {
                        m4fDestination.set(this);
                    } else {
                        m4fDestination = this;
                    }
                    return m4fDestination;
                }
                var fInvLength = 1. / fLength;
                x *= fInvLength;
                y *= fInvLength;
                z *= fInvLength;
                var a11 = pData[0], a12 = pData[4], a13 = pData[8], a14 = pData[12];
                var a21 = pData[1], a22 = pData[5], a23 = pData[9], a24 = pData[13];
                var a31 = pData[2], a32 = pData[6], a33 = pData[10], a34 = pData[14];
                var fSin = math.sin(fAngle);
                var fCos = math.cos(fAngle);
                var fTmp = 1. - fCos;
                //build Rotation matrix
                                var b11 = fCos + fTmp * x * x, b12 = fTmp * x * y - fSin * z, b13 = fTmp * x * z + fSin * y;
                var b21 = fTmp * y * z + fSin * z, b22 = fCos + fTmp * y * y, b23 = fTmp * y * z - fSin * x;
                var b31 = fTmp * z * x - fSin * y, b32 = fTmp * z * y + fSin * x, b33 = fCos + fTmp * z * z;
                if (!((m4fDestination) !== undefined)) {
                    pData[0] = b11 * a11 + b12 * a21 + b13 * a31;
                    pData[4] = b11 * a12 + b12 * a22 + b13 * a32;
                    pData[8] = b11 * a13 + b12 * a23 + b13 * a33;
                    pData[12] = b11 * a14 + b12 * a24 + b13 * a34;
                    pData[1] = b21 * a11 + b22 * a21 + b23 * a31;
                    pData[5] = b21 * a12 + b22 * a22 + b23 * a32;
                    pData[9] = b21 * a13 + b22 * a23 + b23 * a33;
                    pData[13] = b21 * a14 + b22 * a24 + b23 * a34;
                    pData[2] = b31 * a11 + b32 * a21 + b33 * a31;
                    pData[6] = b31 * a12 + b32 * a22 + b33 * a32;
                    pData[10] = b31 * a13 + b32 * a23 + b33 * a33;
                    pData[14] = b31 * a14 + b32 * a24 + b33 * a34;
                    return this;
                }
                var pDataDestination = m4fDestination.data;
                pDataDestination[0] = b11 * a11 + b12 * a21 + b13 * a31;
                pDataDestination[4] = b11 * a12 + b12 * a22 + b13 * a32;
                pDataDestination[8] = b11 * a13 + b12 * a23 + b13 * a33;
                pDataDestination[12] = b11 * a14 + b12 * a24 + b13 * a34;
                pDataDestination[1] = b21 * a11 + b22 * a21 + b23 * a31;
                pDataDestination[5] = b21 * a12 + b22 * a22 + b23 * a32;
                pDataDestination[9] = b21 * a13 + b22 * a23 + b23 * a33;
                pDataDestination[13] = b21 * a14 + b22 * a24 + b23 * a34;
                pDataDestination[2] = b31 * a11 + b32 * a21 + b33 * a31;
                pDataDestination[6] = b31 * a12 + b32 * a22 + b33 * a32;
                pDataDestination[10] = b31 * a13 + b32 * a23 + b33 * a33;
                pDataDestination[14] = b31 * a14 + b32 * a24 + b33 * a34;
                pDataDestination[3] = pData[3];
                pDataDestination[7] = pData[7];
                pDataDestination[11] = pData[11];
                pDataDestination[15] = pData[15];
                return m4fDestination;
            };
            Mat4.prototype.setTranslation = /** @inline */function (v3fTranslation) {
                var pData = this.data;
                pData[12] = v3fTranslation.x;
                pData[13] = v3fTranslation.y;
                pData[14] = v3fTranslation.z;
                return this;
            };
            Mat4.prototype.getTranslation = /** @inline */function (v3fTranslation) {
                if (!((v3fTranslation) !== undefined)) {
                    v3fTranslation = new math.Vec3();
                }
                var pData = this.data;
                v3fTranslation.x = pData[12];
                v3fTranslation.y = pData[13];
                v3fTranslation.z = pData[14];
                return v3fTranslation;
            };
            Mat4.prototype.translateRight = function (v3fTranslation, m4fDestination) {
                var pData = this.data;
                var x = v3fTranslation.x, y = v3fTranslation.y, z = v3fTranslation.z;
                if (!((m4fDestination) !== undefined)) {
                    pData[12] = pData[0] * x + pData[4] * y + pData[8] * z + pData[12];
                    pData[13] = pData[1] * x + pData[5] * y + pData[9] * z + pData[13];
                    pData[14] = pData[2] * x + pData[6] * y + pData[10] * z + pData[14];
                    pData[15] = pData[3] * x + pData[7] * y + pData[11] * z + pData[15];
                    //строго говоря последнюю строчку умножать не обязательно, так как она должна быть -> 0 0 0 1
                    return this;
                }
                var pDataDestination = m4fDestination.data;
                //кешируем матрицу вращений
                                var a11 = pData[0], a12 = pData[4], a13 = pData[8];
                var a21 = pData[0], a22 = pData[5], a23 = pData[9];
                var a31 = pData[0], a32 = pData[6], a33 = pData[10];
                var a41 = pData[0], a42 = pData[7], a43 = pData[11];
                pDataDestination[0] = a11;
                pDataDestination[4] = a12;
                pDataDestination[8] = a13;
                pDataDestination[12] = a11 * x + a12 * y + a13 * z + pData[12];
                pDataDestination[1] = a21;
                pDataDestination[5] = a22;
                pDataDestination[9] = a23;
                pDataDestination[13] = a21 * x + a22 * y + a23 * z + pData[13];
                pDataDestination[2] = a31;
                pDataDestination[6] = a32;
                pDataDestination[10] = a33;
                pDataDestination[14] = a31 * x + a32 * y + a33 * z + pData[14];
                pDataDestination[3] = a41;
                pDataDestination[7] = a42;
                pDataDestination[11] = a43;
                pDataDestination[15] = a41 * x + a42 * y + a43 * z + pData[15];
                return m4fDestination;
            };
            Mat4.prototype.translateLeft = function (v3fTranslation, m4fDestination) {
                var pData = this.data;
                var x = v3fTranslation.x, y = v3fTranslation.y, z = v3fTranslation.z;
                if (!((m4fDestination) !== undefined)) {
                    pData[12] = x + pData[12];
                    pData[13] = y + pData[13];
                    pData[14] = z + pData[14];
                    return this;
                }
                var pDataDestination = m4fDestination.data;
                pDataDestination[0] = pData[0];
                pDataDestination[4] = pData[4];
                pDataDestination[8] = pData[8];
                pDataDestination[12] = x + pData[12];
                pDataDestination[1] = pData[1];
                pDataDestination[5] = pData[5];
                pDataDestination[9] = pData[9];
                pDataDestination[13] = y + pData[13];
                pDataDestination[2] = pData[2];
                pDataDestination[6] = pData[6];
                pDataDestination[10] = pData[10];
                pDataDestination[14] = z + pData[14];
                pDataDestination[3] = pData[3];
                pDataDestination[7] = pData[7];
                pDataDestination[11] = pData[11];
                pDataDestination[15] = pData[15];
                return m4fDestination;
            };
            Mat4.prototype.scaleRight = function (v3fScale, m4fDestination) {
                var pData = this.data;
                var x = v3fScale.x, y = v3fScale.y, z = v3fScale.z;
                if (!((m4fDestination) !== undefined)) {
                    pData[0] *= x;
                    pData[4] *= y;
                    pData[8] *= z;
                    pData[1] *= x;
                    pData[5] *= y;
                    pData[9] *= z;
                    pData[2] *= x;
                    pData[6] *= y;
                    pData[10] *= z;
                    //скейлить эти компоненты необязательно, так как там должны лежать нули
                    pData[3] *= x;
                    pData[7] *= y;
                    pData[11] *= z;
                    return this;
                }
                var pDataDestination = m4fDestination.data;
                pDataDestination[0] = pData[0] * x;
                pDataDestination[4] = pData[4] * y;
                pDataDestination[8] = pData[8] * z;
                pDataDestination[12] = pData[12];
                pDataDestination[1] = pData[1] * x;
                pDataDestination[5] = pData[5] * y;
                pDataDestination[9] = pData[9] * z;
                pDataDestination[13] = pData[13];
                pDataDestination[2] = pData[2] * x;
                pDataDestination[6] = pData[6] * y;
                pDataDestination[10] = pData[10] * z;
                pDataDestination[14] = pData[14];
                //скейлить эти компоненты необязательно, так как там должны лежать нули
                pDataDestination[3] = pData[3] * x;
                pDataDestination[7] = pData[7] * y;
                pDataDestination[11] = pData[11] * z;
                pDataDestination[15] = pData[15];
                return m4fDestination;
            };
            Mat4.prototype.scaleLeft = function (v3fScale, m4fDestination) {
                var pData = this.data;
                var x = v3fScale.x, y = v3fScale.y, z = v3fScale.z;
                if (!((m4fDestination) !== undefined)) {
                    pData[0] *= x;
                    pData[4] *= x;
                    pData[8] *= x;
                    pData[12] *= x;
                    pData[1] *= y;
                    pData[5] *= y;
                    pData[9] *= y;
                    pData[13] *= y;
                    pData[2] *= z;
                    pData[6] *= z;
                    pData[10] *= z;
                    pData[14] *= z;
                    return this;
                }
                var pDataDestination = m4fDestination.data;
                pDataDestination[0] = pData[0] * x;
                pDataDestination[4] = pData[4] * x;
                pDataDestination[8] = pData[8] * x;
                pDataDestination[12] = pData[12] * x;
                pDataDestination[1] = pData[1] * y;
                pDataDestination[5] = pData[5] * y;
                pDataDestination[9] = pData[9] * y;
                pDataDestination[13] = pData[13] * y;
                pDataDestination[2] = pData[2] * z;
                pDataDestination[6] = pData[6] * z;
                pDataDestination[10] = pData[10] * z;
                pDataDestination[14] = pData[14] * z;
                pDataDestination[3] = pData[3];
                pDataDestination[7] = pData[7];
                pDataDestination[11] = pData[11];
                pDataDestination[15] = pData[15];
                return m4fDestination;
            };
            Mat4.prototype.decompose = /** @inline */function (q4fRotation, v3fScale, v3fTranslation) {
                /*not inlined, because supportes only single statement functions(cur. st. count: 7)*/this.getTranslation(v3fTranslation);
                var m3fRotScale = this.toMat3(math.Mat3.stackCeil.set());
                return m3fRotScale.decompose(q4fRotation, v3fScale);
            };
            Mat4.prototype.row = function (iRow, v4fDestination) {
                if (!((v4fDestination) !== undefined)) {
                    v4fDestination = new math.Vec4();
                }
                var pData = this.data;
                switch(iRow) {
                    case 1:
                        v4fDestination.x = pData[0];
                        v4fDestination.y = pData[4];
                        v4fDestination.z = pData[8];
                        v4fDestination.w = pData[12];
                        break;
                    case 2:
                        v4fDestination.x = pData[1];
                        v4fDestination.y = pData[5];
                        v4fDestination.z = pData[9];
                        v4fDestination.w = pData[13];
                        break;
                    case 3:
                        v4fDestination.x = pData[2];
                        v4fDestination.y = pData[6];
                        v4fDestination.z = pData[10];
                        v4fDestination.w = pData[14];
                        break;
                    case 4:
                        v4fDestination.x = pData[3];
                        v4fDestination.y = pData[7];
                        v4fDestination.z = pData[11];
                        v4fDestination.w = pData[15];
                        break;
                }
                return v4fDestination;
            };
            Mat4.prototype.column = function (iColumn, v4fDestination) {
                if (!((v4fDestination) !== undefined)) {
                    v4fDestination = new math.Vec4();
                }
                var pData = this.data;
                switch(iColumn) {
                    case 1:
                        v4fDestination.x = pData[0];
                        v4fDestination.y = pData[1];
                        v4fDestination.z = pData[2];
                        v4fDestination.w = pData[3];
                        break;
                    case 2:
                        v4fDestination.x = pData[4];
                        v4fDestination.y = pData[5];
                        v4fDestination.z = pData[6];
                        v4fDestination.w = pData[7];
                        break;
                    case 3:
                        v4fDestination.x = pData[8];
                        v4fDestination.y = pData[9];
                        v4fDestination.z = pData[10];
                        v4fDestination.w = pData[11];
                        break;
                    case 4:
                        v4fDestination.x = pData[12];
                        v4fDestination.y = pData[13];
                        v4fDestination.z = pData[14];
                        v4fDestination.w = pData[15];
                        break;
                }
                return v4fDestination;
            };
            Mat4.prototype.unproj = function (v, v4fDestination) {
                if (!((v4fDestination) !== undefined)) {
                    v4fDestination = new math.Vec4();
                }
                var pData = this.data;
                var v3fScreen = v;
                var x, y, z;
                if (((((this).data[15] === 1) ? true : false))) {
                    //orthogonal projection case
                    z = (v3fScreen.z - pData[14]) / pData[10];
                    y = (v3fScreen.y - pData[13]) / pData[5];
                    x = (v3fScreen.x - pData[12]) / pData[0];
                } else {
                    //frustum case
                    z = -pData[14] / (pData[10] + v3fScreen.z);
                    y = -(v3fScreen.y + pData[9]) * z / pData[5];
                    x = -(v3fScreen.x + pData[8]) * z / pData[0];
                }
                v4fDestination.x = x;
                v4fDestination.y = y;
                v4fDestination.z = z;
                v4fDestination.w = 1.;
                return v4fDestination;
            };
            Mat4.prototype.unprojZ = function (fZ) {
                var pData = this.data;
                if (((((this).data[15] === 1) ? true : false))) {
                    //orthogonal projection case
                    return (fZ - pData[14]) / pData[10];
                } else {
                    //pData[__43] === -1
                    //frustum case
                    return -pData[14] / (pData[10] + fZ);
                }
            };
            Mat4.prototype.isOrthogonalProjection = /** @inline */function () {
                // var pData: Float32Array = this.data;
                // if(pData[__44] === 1){
                // 	//orthogonal projection
                // 	return true;
                // }
                // else{
                // 	//pData[__43] === -1
                // 	//frustum projection
                // 	return false;
                // }
                return ((this.data[15] === 1) ? true : false);
            };
            Mat4.fromYawPitchRoll = function fromYawPitchRoll() {
                var fYaw = 0.0, fPitch = 0.0, fRoll = 0.0, m4fDestination = null;
                if (arguments.length <= 2) {
                    //Vec3 + m4fDestination
                    var v3fVec = arguments[0];
                    fYaw = v3fVec.x;
                    fPitch = v3fVec.y;
                    fRoll = v3fVec.z;
                    m4fDestination = arguments[1];
                } else {
                    fYaw = arguments[0];
                    fPitch = arguments[1];
                    fRoll = arguments[2];
                    m4fDestination = arguments[3];
                }
                if (!((m4fDestination) !== undefined)) {
                    m4fDestination = new Mat4();
                }
                var pDataDestination = m4fDestination.data;
                var fSin1 = Math.sin(fYaw);
                var fSin2 = Math.sin(fPitch);
                var fSin3 = Math.sin(fRoll);
                var fCos1 = Math.cos(fYaw);
                var fCos2 = Math.cos(fPitch);
                var fCos3 = Math.cos(fRoll);
                pDataDestination[0] = fCos1 * fCos3 + fSin1 * fSin2 * fSin3;
                pDataDestination[4] = fCos3 * fSin1 * fSin2 - fCos1 * fSin3;
                pDataDestination[8] = fCos2 * fSin1;
                pDataDestination[12] = 0.;
                pDataDestination[1] = fCos2 * fSin3;
                pDataDestination[5] = fCos2 * fCos3;
                pDataDestination[9] = -fSin2;
                pDataDestination[13] = 0.;
                pDataDestination[2] = fCos1 * fSin2 * fSin3 - fCos3 * fSin1;
                pDataDestination[6] = fSin1 * fSin3 + fCos1 * fCos3 * fSin2;
                pDataDestination[10] = fCos1 * fCos2;
                pDataDestination[14] = 0.;
                pDataDestination[3] = 0.;
                pDataDestination[7] = 0.;
                pDataDestination[11] = 0.;
                pDataDestination[15] = 1.;
                return m4fDestination;
            };
            Mat4.fromXYZ = function fromXYZ(fX, fY, fZ, m4fDestination) {
                if (arguments.length <= 2) {
                    //Vec3 + m4fDestination
                    var v3fVec = arguments[0];
                    return Mat4.fromYawPitchRoll(v3fVec.y, v3fVec.x, v3fVec.z, arguments[1]);
                } else {
                    //fX fY fZ m4fDestination
                    var fX = arguments[0];
                    var fY = arguments[1];
                    var fZ = arguments[2];
                    return Mat4.fromYawPitchRoll(fY, fX, fZ, arguments[3]);
                }
            };
            Mat4.frustum = function frustum(fLeft, fRight, fBottom, fTop, fNear, fFar, m4fDestination) {
                if (!((m4fDestination) !== undefined)) {
                    m4fDestination = new Mat4();
                }
                var pDataDestination = m4fDestination.data;
                var fRL = fRight - fLeft;
                var fTB = fTop - fBottom;
                var fFN = fFar - fNear;
                pDataDestination[0] = 2. * fNear / fRL;
                pDataDestination[4] = 0.;
                pDataDestination[8] = (fRight + fLeft) / fRL;
                pDataDestination[12] = 0.;
                pDataDestination[1] = 0.;
                pDataDestination[5] = 2. * fNear / fTB;
                pDataDestination[9] = (fTop + fBottom) / fTB;
                pDataDestination[13] = 0.;
                pDataDestination[2] = 0.;
                pDataDestination[6] = 0.;
                pDataDestination[10] = -(fFar + fNear) / fFN;
                pDataDestination[14] = -2. * fFar * fNear / fFN;
                pDataDestination[3] = 0.;
                pDataDestination[7] = 0.;
                pDataDestination[11] = -1.;
                pDataDestination[15] = 0.;
                return m4fDestination;
            };
            Mat4.perspective = /** @inline */function perspective(fFovy, fAspect, fNear, fFar, m4fDestination) {
                var fTop = fNear * math.tan(fFovy / 2.);
                var fRight = fTop * fAspect;
                return Mat4.frustum(-fRight, fRight, -fTop, fTop, fNear, fFar, m4fDestination);
            };
            Mat4.orthogonalProjectionAsymmetric = function orthogonalProjectionAsymmetric(fLeft, fRight, fBottom, fTop, fNear, fFar, m4fDestination) {
                if (!((m4fDestination) !== undefined)) {
                    m4fDestination = new Mat4();
                }
                var pDataDestination = m4fDestination.data;
                var fRL = fRight - fLeft;
                var fTB = fTop - fBottom;
                var fFN = fFar - fNear;
                pDataDestination[0] = 2. / fRL;
                pDataDestination[4] = 0.;
                pDataDestination[8] = 0.;
                pDataDestination[12] = -(fRight + fLeft) / fRL;
                pDataDestination[1] = 0.;
                pDataDestination[5] = 2. / fTB;
                pDataDestination[9] = 0.;
                pDataDestination[13] = -(fTop + fBottom) / fTB;
                pDataDestination[2] = 0.;
                pDataDestination[6] = 0.;
                pDataDestination[10] = -2. / fFN;
                pDataDestination[14] = -(fFar + fNear) / fFN;
                pDataDestination[3] = 0.;
                pDataDestination[7] = 0.;
                pDataDestination[11] = 0.;
                pDataDestination[15] = 1.;
                return m4fDestination;
            };
            Mat4.orthogonalProjection = /** @inline */function orthogonalProjection(fWidth, fHeight, fNear, fFar, m4fDestination) {
                var fRight = fWidth / 2.;
                var fTop = fHeight / 2.;
                return Mat4.orthogonalProjectionAsymmetric(-fRight, fRight, -fTop, fTop, fNear, fFar, m4fDestination);
            };
            Mat4.lookAt = function lookAt(v3fEye, v3fCenter, v3fUp, m4fDestination) {
                if (!((m4fDestination) !== undefined)) {
                    m4fDestination = new Mat4(1.);
                }
                var fEyeX = v3fEye.x, fEyeY = v3fEye.y, fEyeZ = v3fEye.z;
                var fCenterX = v3fCenter.x, fCenterY = v3fCenter.y, fCenterZ = v3fCenter.z;
                var fUpX = v3fUp.x, fUpY = v3fUp.y, fUpZ = v3fUp.z;
                var fLength;
                var fInvLength;
                if (fEyeX === fCenterX && fEyeY === fCenterY && fEyeZ === fCenterZ) {
                    return m4fDestination;
                }
                var fXNewX, fXNewY, fXNewZ;
                var fYNewX, fYNewY, fYNewZ;
                var fZNewX, fZNewY, fZNewZ;
                //ось Z направлена на наблюдателя
                fZNewX = fEyeX - fCenterX;
                fZNewY = fEyeY - fCenterY;
                fZNewZ = fEyeZ - fCenterZ;
                fLength = math.sqrt(fZNewX * fZNewX + fZNewY * fZNewY + fZNewZ * fZNewZ);
                fInvLength = 1. / fLength;
                //новая ось Z
                fZNewX = fZNewX * fInvLength;
                fZNewY = fZNewY * fInvLength;
                fZNewZ = fZNewZ * fInvLength;
                //новая ось X
                fXNewX = fUpY * fZNewZ - fUpZ * fZNewY;
                fXNewY = fUpZ * fZNewX - fUpX * fZNewZ;
                fXNewZ = fUpX * fZNewY - fUpY * fZNewX;
                fLength = math.sqrt(fXNewX * fXNewX + fXNewY * fXNewY + fXNewZ * fXNewZ);
                if (fLength) {
                    fInvLength = 1. / fLength;
                    fXNewX = fXNewX * fInvLength;
                    fXNewY = fXNewY * fInvLength;
                    fXNewZ = fXNewZ * fInvLength;
                }
                //новая ось Y
                fYNewX = fZNewY * fXNewZ - fZNewZ * fXNewY;
                fYNewY = fZNewZ * fXNewX - fZNewX * fXNewZ;
                fYNewZ = fZNewX * fXNewY - fZNewY * fXNewX;
                //нормировать ненужно, так как было векторное умножение двух ортонормированных векторов
                //положение камеры в новых осях
                var fEyeNewX = fEyeX * fXNewX + fEyeY * fXNewY + fEyeZ * fXNewZ;
                var fEyeNewY = fEyeX * fYNewX + fEyeY * fYNewY + fEyeZ * fYNewZ;
                var fEyeNewZ = fEyeX * fZNewX + fEyeY * fZNewY + fEyeZ * fZNewZ;
                var pDataDestination = m4fDestination.data;
                //lookAt matrix === camera view matrix
                //почему новый базис записывается по строкам?
                //это сзязано с тем, что это получающаяся матрица -
                //это viewMatrix камеры, а на эту матрицу умножается при рендеринге, то есть
                //модель должна испытать преобразования противоположные тем, которые испытывает камера
                //то есть вращение в другую сторону(базис по строкам) и сдвиг в противоположную сторону
                pDataDestination[0] = fXNewX;
                pDataDestination[4] = fXNewY;
                pDataDestination[8] = fXNewZ;
                /*отъезжаем в позицию камеры*/
                pDataDestination[12] = -fEyeNewX;
                pDataDestination[1] = fYNewX;
                pDataDestination[5] = fYNewY;
                pDataDestination[9] = fYNewZ;
                /*отъезжаем в позицию камеры*/
                pDataDestination[13] = -fEyeNewY;
                pDataDestination[2] = fZNewX;
                pDataDestination[6] = fZNewY;
                pDataDestination[10] = fZNewZ;
                /*отъезжаем в позицию камеры*/
                pDataDestination[14] = -fEyeNewZ;
                pDataDestination[3] = 0.;
                pDataDestination[7] = 0.;
                pDataDestination[11] = 0.;
                pDataDestination[15] = 1.;
                return m4fDestination;
            };
            Object.defineProperty(Mat4, "stackCeil", {
                get: function () {
                    Mat4.stackPosition = Mat4.stackPosition === Mat4.stackSize - 1 ? 0 : Mat4.stackPosition;
                    return Mat4.stack[Mat4.stackPosition++];
                },
                enumerable: true,
                configurable: true
            });
            Mat4.stackSize = 256;
            Mat4.stackPosition = 0;
            Mat4.stack = (function () {
                var pStack = new Array(Mat4.stackSize);
                for(var i = 0; i < Mat4.stackSize; i++) {
                    pStack[i] = new Mat4();
                }
                return pStack;
            })();
            return Mat4;
        })();
        math.Mat4 = Mat4;        
    })(akra.math || (akra.math = {}));
    var math = akra.math;
})(akra || (akra = {}));
var akra;
(function (akra) {
    (function (math) {
        var Quat4 = (function () {
            function Quat4(fX, fY, fZ, fW) {
                var nArgumentsLength = arguments.length;
                switch(nArgumentsLength) {
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
            }
            Quat4.prototype.set = function (fX, fY, fZ, fW) {
                var nArgumentsLength = arguments.length;
                if (nArgumentsLength === 0) {
                    this.x = this.y = this.z = 0.;
                    this.w = 1.;
                }
                if (nArgumentsLength === 1) {
                    if (arguments[0] instanceof Quat4) {
                        var q4fQuat = arguments[0];
                        this.x = q4fQuat.x;
                        this.y = q4fQuat.y;
                        this.z = q4fQuat.z;
                        this.w = q4fQuat.w;
                    } else {
                        //Array
                        var pElements = arguments[0];
                        this.x = pElements[0];
                        this.y = pElements[1];
                        this.z = pElements[2];
                        this.w = pElements[3];
                    }
                } else if (nArgumentsLength === 2) {
                    //float float
                    //vec3 float
                    if ((typeof (arguments[0]) === "number")) {
                        //float float
                        var fValue = arguments[0];
                        this.x = fValue;
                        this.y = fValue;
                        this.z = fValue;
                        this.w = arguments[1];
                    } else {
                        //vec3 float
                        var v3fValue = arguments[0];
                        this.x = v3fValue.x;
                        this.y = v3fValue.y;
                        this.z = v3fValue.z;
                        this.w = arguments[1];
                    }
                } else if (nArgumentsLength === 4) {
                    this.x = arguments[0];
                    this.y = arguments[1];
                    this.z = arguments[2];
                    this.w = arguments[3];
                }
                return this;
            };
            Quat4.prototype.multiply = function (q4fQuat, q4fDestination) {
                if (!((q4fDestination) !== undefined)) {
                    q4fDestination = this;
                }
                var x1 = this.x, y1 = this.y, z1 = this.z, w1 = this.w;
                var x2 = q4fQuat.x, y2 = q4fQuat.y, z2 = q4fQuat.z, w2 = q4fQuat.w;
                q4fDestination.x = x1 * w2 + x2 * w1 + y1 * z2 - z1 * y2;
                q4fDestination.y = y1 * w2 + y2 * w1 + z1 * x2 - x1 * z2;
                q4fDestination.z = z1 * w2 + z2 * w1 + x1 * y2 - y1 * x2;
                q4fDestination.w = w1 * w2 - x1 * x2 - y1 * y2 - z1 * z2;
                return q4fDestination;
            };
            Quat4.prototype.multiplyVec3 = function (v3fVec, v3fDestination) {
                if (!((v3fDestination) !== undefined)) {
                    v3fDestination = v3fVec;
                }
                var q4fVec = Quat4.stackCeil.set(v3fVec, 0.);
                var qInverse = this.inverse(Quat4.stackCeil.set());
                var qResult = this.multiply(q4fVec.multiply(qInverse), Quat4.stackCeil.set());
                v3fDestination.x = qResult.x;
                v3fDestination.y = qResult.y;
                v3fDestination.z = qResult.z;
                return v3fDestination;
            };
            Quat4.prototype.conjugate = function (q4fDestination) {
                if (!((q4fDestination) !== undefined)) {
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
            Quat4.prototype.inverse = function (q4fDestination) {
                if (!((q4fDestination) !== undefined)) {
                    q4fDestination = this;
                }
                var x = this.x, y = this.y, z = this.z, w = this.w;
                var fSqLength = x * x + y * y + z * z + w * w;
                if (fSqLength === 0.) {
                    q4fDestination.x = 0.;
                    q4fDestination.y = 0.;
                    q4fDestination.z = 0.;
                    q4fDestination.w = 0.;
                } else {
                    var fInvSqLength = 1. / fSqLength;
                    q4fDestination.x = -x * fInvSqLength;
                    q4fDestination.y = -y * fInvSqLength;
                    q4fDestination.z = -z * fInvSqLength;
                    q4fDestination.w = w * fInvSqLength;
                }
                return q4fDestination;
            };
            Quat4.prototype.length = /** @inline */function () {
                var x = this.x, y = this.y, z = this.z, w = this.w;
                return math.sqrt(x * x + y * y + z * z + w * w);
            };
            Quat4.prototype.normalize = function (q4fDestination) {
                if (!((q4fDestination) !== undefined)) {
                    q4fDestination = this;
                }
                var x = this.x, y = this.y, z = this.z, w = this.w;
                var fLength = math.sqrt(x * x + y * y + z * z + w * w);
                if (fLength === 0.) {
                    q4fDestination.x = 0.;
                    q4fDestination.y = 0.;
                    q4fDestination.z = 0.;
                    q4fDestination.w = 0.;
                } else {
                    var fInvLength = 1 / fLength;
                    q4fDestination.x = x * fInvLength;
                    q4fDestination.y = y * fInvLength;
                    q4fDestination.z = z * fInvLength;
                    q4fDestination.w = w * fInvLength;
                }
                return q4fDestination;
            };
            Quat4.prototype.calculateW = function (q4fDestination) {
                var x = this.x, y = this.y, z = this.z;
                if (!((q4fDestination) !== undefined)) {
                    this.w = math.sqrt(1. - x * x - y * y - z * z);
                    return this;
                }
                q4fDestination.x = x;
                q4fDestination.y = y;
                q4fDestination.z = z;
                q4fDestination.w = math.sqrt(1. - x * x - y * y - z * z);
                return q4fDestination;
            };
            Quat4.prototype.isEqual = function (q4fQuat, fEps, asMatrix) {
                if (typeof fEps === "undefined") { fEps = 0.; }
                if (typeof asMatrix === "undefined") { asMatrix = false; }
                var x1 = this.x, y1 = this.y, z1 = this.z, w1 = this.w;
                var x2 = q4fQuat.x, y2 = q4fQuat.y, z2 = q4fQuat.z, w2 = q4fQuat.w;
                var fLength1 = math.sqrt(x1 * x1 + y1 * y1 + z1 * z1 + w1 * w1);
                var fLength2 = math.sqrt(x2 * x2 + y2 * y2 + z2 * z2 + w2 * w2);
                if (math.abs(fLength2 - fLength2) > fEps) {
                    return false;
                }
                var cosHalfTheta = (x1 * x2 + y1 * y2 + z1 * z2 + w1 * w2) / fLength1 / fLength2;
                if (asMatrix) {
                    cosHalfTheta = math.abs(cosHalfTheta);
                }
                if (1. - cosHalfTheta > fEps) {
                    return false;
                }
                return true;
            };
            Quat4.prototype.getYaw = function () {
                var fYaw;
                var x = this.x, y = this.y, z = this.z, w = this.w;
                var fx2 = x * 2.;
                var fy2 = y * 2.;
                if (math.abs(x) == math.abs(w)) {
                    //вырожденный случай обрабатывается отдельно
                    //
                    var wTemp = w * math.sqrt(2.);
                    //cos(Yaw/2)*cos(Roll/2) + sin(Yaw/2)*sin(Roll/2) = cos((Yaw-Roll)/2); Roll = 0;
                    //x==-w
                    //cos(Yaw/2)*cos(Roll/2) - sin(Yaw/2)*sin(Roll/2) = cos((Yaw+Roll)/2); Roll = 0;
                    var yTemp = y * math.sqrt(2.);
                    //sin(Yaw/2)*cos(Roll/2) - cos(Yaw/2)*sin(Roll/2) = sin((Yaw-Roll)/2); Roll = 0;
                    //x==-w
                    //sin(Yaw/2)*cos(Roll/2) + cos(Yaw/2)*sin(Roll/2) = sin((Yaw+Roll)/2); Roll = 0;
                    fYaw = math.atan2(yTemp, wTemp) * 2.;
                    //fRoll = 0;
                    //убираем дополнительный оборот
                    var pi = math.PI;
                    if (fYaw > pi) {
                        fYaw -= pi;
                        //fRoll = (x == w) ? -pi : pi;
                                            } else if (fYaw < -pi) {
                        fYaw += pi;
                        //fRoll = (x == w) ? pi : -pi;
                                            }
                } else {
                    //Math.atan2(sin(Yaw)*cos(Pitch),cos(Yaw)*cos(Pitch));
                    fYaw = math.atan2(fx2 * z + fy2 * w, 1. - (fx2 * x + fy2 * y));
                }
                return fYaw;
            };
            Quat4.prototype.getPitch = function () {
                var fPitch;
                var x = this.x, y = this.y, z = this.z, w = this.w;
                var fx2 = x * 2.;
                var fy2 = y * 2.;
                /*в очень редких случаях из-за ошибок округления получается результат > 1*/
                var fSinPitch = (/*checked (origin: math)>>*/akra.math.max((-1.), /*checked (origin: math)>>*/akra.math.min((fx2 * w - fy2 * z), (1.))));
                fPitch = math.asin(fSinPitch);
                return fPitch;
            };
            Quat4.prototype.getRoll = function () {
                var fRoll;
                var x = this.x, y = this.y, z = this.z, w = this.w;
                var fx2 = x * 2.;
                var fz2 = z * 2.;
                if (math.abs(x) == math.abs(w)) {
                    //вырожденный случай обрабатывается отдельно
                    //
                    var wTemp = w * math.sqrt(2.);
                    //cos(Yaw/2)*cos(Roll/2) + sin(Yaw/2)*sin(Roll/2) = cos((Yaw-Roll)/2); Roll = 0;
                    //x==-w
                    //cos(Yaw/2)*cos(Roll/2) - sin(Yaw/2)*sin(Roll/2) = cos((Yaw+Roll)/2); Roll = 0;
                    var yTemp = y * math.sqrt(2.);
                    //sin(Yaw/2)*cos(Roll/2) - cos(Yaw/2)*sin(Roll/2) = sin((Yaw-Roll)/2); Roll = 0;
                    //x==-w
                    //sin(Yaw/2)*cos(Roll/2) + cos(Yaw/2)*sin(Roll/2) = sin((Yaw+Roll)/2); Roll = 0;
                    var fYaw = math.atan2(yTemp, wTemp) * 2.;
                    fRoll = 0.;
                    //убираем дополнительный оборот
                    var pi = math.PI;
                    if (fYaw > pi) {
                        //fYaw -= pi;
                        fRoll = (x == w) ? -pi : pi;
                    } else if (fYaw < -pi) {
                        //fYaw += pi;
                        fRoll = (x == w) ? pi : -pi;
                    }
                } else {
                    //Math.atan2(cos(Pitch) * sin(Roll),cos(Pitch)*cos(Roll));
                    fRoll = math.atan2(fx2 * y + fz2 * w, 1. - (fx2 * x + fz2 * z));
                }
                return fRoll;
            };
            Quat4.prototype.toYawPitchRoll = function (v3fDestination) {
                if (!((v3fDestination) !== undefined)) {
                    v3fDestination = new math.Vec3();
                }
                var fYaw, fPitch, fRoll;
                var x = this.x, y = this.y, z = this.z, w = this.w;
                var fx2 = x * 2.;
                var fy2 = y * 2.;
                var fz2 = z * 2.;
                var fw2 = w * 2.;
                /*в очень редких случаях из-за ошибок округления получается результат > 1*/
                var fSinPitch = (/*checked (origin: math)>>*/akra.math.max((-1.), /*checked (origin: math)>>*/akra.math.min((fx2 * w - fy2 * z), (1.))));
                fPitch = math.asin(fSinPitch);
                //не известен знак косинуса, как следствие это потребует дополнительной проверки.
                //как показала практика - это не на что не влияет, просто один и тот же кватернион можно получить двумя разными вращениями
                if (math.abs(x) == math.abs(w)) {
                    //вырожденный случай обрабатывается отдельно
                    //
                    var wTemp = w * math.sqrt(2.);
                    //cos(Yaw/2)*cos(Roll/2) + sin(Yaw/2)*sin(Roll/2) = cos((Yaw-Roll)/2); Roll = 0;
                    //x==-w
                    //cos(Yaw/2)*cos(Roll/2) - sin(Yaw/2)*sin(Roll/2) = cos((Yaw+Roll)/2); Roll = 0;
                    var yTemp = y * math.sqrt(2.);
                    //sin(Yaw/2)*cos(Roll/2) - cos(Yaw/2)*sin(Roll/2) = sin((Yaw-Roll)/2); Roll = 0;
                    //x==-w
                    //sin(Yaw/2)*cos(Roll/2) + cos(Yaw/2)*sin(Roll/2) = sin((Yaw+Roll)/2); Roll = 0;
                    fYaw = math.atan2(yTemp, wTemp) * 2.;
                    fRoll = 0.;
                    //убираем дополнительный оборот
                    var pi = math.PI;
                    if (fYaw > pi) {
                        fYaw -= pi;
                        fRoll = (x == w) ? -pi : pi;
                    } else if (fYaw < -pi) {
                        fYaw += pi;
                        fRoll = (x == w) ? pi : -pi;
                    }
                } else {
                    //Math.atan2(sin(Yaw)*cos(Pitch),cos(Yaw)*cos(Pitch));
                    fYaw = math.atan2(fx2 * z + fy2 * w, 1. - (fx2 * x + fy2 * y));
                    //Math.atan2(cos(Pitch) * sin(Roll),cos(Pitch)*cos(Roll));
                    fRoll = math.atan2(fx2 * y + fz2 * w, 1. - (fx2 * x + fz2 * z));
                }
                v3fDestination.x = fYaw;
                v3fDestination.y = fPitch;
                v3fDestination.z = fRoll;
                return v3fDestination;
            };
            Quat4.prototype.toMat3 = function (m3fDestination) {
                if (!((m3fDestination) !== undefined)) {
                    m3fDestination = new math.Mat3();
                }
                var pDataDestination = m3fDestination.data;
                var x = this.x, y = this.y, z = this.z, w = this.w;
                //потом необходимо ускорить
                pDataDestination[0] = 1. - 2. * (y * y + z * z);
                pDataDestination[3] = 2. * (x * y - z * w);
                pDataDestination[6] = 2. * (x * z + y * w);
                pDataDestination[1] = 2. * (x * y + z * w);
                pDataDestination[4] = 1. - 2. * (x * x + z * z);
                pDataDestination[7] = 2. * (y * z - x * w);
                pDataDestination[2] = 2. * (x * z - y * w);
                pDataDestination[5] = 2. * (y * z + x * w);
                pDataDestination[8] = 1. - 2. * (x * x + y * y);
                return m3fDestination;
            };
            Quat4.prototype.toMat4 = function (m4fDestination) {
                if (!((m4fDestination) !== undefined)) {
                    m4fDestination = new math.Mat4();
                }
                var pDataDestination = m4fDestination.data;
                var x = this.x, y = this.y, z = this.z, w = this.w;
                //потом необходимо ускорить
                pDataDestination[0] = 1. - 2. * (y * y + z * z);
                pDataDestination[4] = 2. * (x * y - z * w);
                pDataDestination[8] = 2. * (x * z + y * w);
                pDataDestination[12] = 0.;
                pDataDestination[1] = 2. * (x * y + z * w);
                pDataDestination[5] = 1. - 2. * (x * x + z * z);
                pDataDestination[9] = 2. * (y * z - x * w);
                pDataDestination[13] = 0.;
                pDataDestination[2] = 2. * (x * z - y * w);
                pDataDestination[6] = 2. * (y * z + x * w);
                pDataDestination[10] = 1. - 2. * (x * x + y * y);
                pDataDestination[14] = 0.;
                pDataDestination[3] = 0.;
                pDataDestination[7] = 0.;
                pDataDestination[11] = 0.;
                pDataDestination[15] = 1.;
                return m4fDestination;
            };
            Quat4.prototype.toString = /** @inline */function () {
                return "[x: " + this.x + ", y: " + this.y + ", z: " + this.z + ", w: " + this.w + "]";
            };
            Quat4.prototype.mix = function (q4fQuat, fA, q4fDestination, bShortestPath) {
                if (typeof bShortestPath === "undefined") { bShortestPath = true; }
                if (!((q4fDestination) !== undefined)) {
                    q4fDestination = this;
                }
                fA = (/*checked (origin: math)>>*/akra.math.max((0), /*checked (origin: math)>>*/akra.math.min((fA), (1))));
                var x1 = this.x, y1 = this.y, z1 = this.z, w1 = this.w;
                var x2 = q4fQuat.x, y2 = q4fQuat.y, z2 = q4fQuat.z, w2 = q4fQuat.w;
                //скалярное произведение
                var fCos = x1 * x2 + y1 * y2 + z1 * z2 + w1 * w2;
                if (fCos < 0. && bShortestPath) {
                    x2 = -x2;
                    y2 = -y2;
                    z2 = -z2;
                    w2 = -w2;
                }
                var k1 = 1. - fA;
                var k2 = fA;
                q4fDestination.x = x1 * k1 + x2 * k2;
                q4fDestination.y = y1 * k1 + y2 * k2;
                q4fDestination.z = z1 * k1 + z2 * k2;
                q4fDestination.w = w1 * k1 + w2 * k2;
                return q4fDestination;
            };
            Quat4.prototype.smix = function (q4fQuat, fA, q4fDestination, bShortestPath) {
                if (typeof bShortestPath === "undefined") { bShortestPath = true; }
                if (!((q4fDestination) !== undefined)) {
                    q4fDestination = this;
                }
                fA = (/*checked (origin: math)>>*/akra.math.max((0), /*checked (origin: math)>>*/akra.math.min((fA), (1))));
                var x1 = this.x, y1 = this.y, z1 = this.z, w1 = this.w;
                var x2 = q4fQuat.x, y2 = q4fQuat.y, z2 = q4fQuat.z, w2 = q4fQuat.w;
                //скалярное произведение
                var fCos = x1 * x2 + y1 * y2 + z1 * z2 + w1 * w2;
                if (fCos < 0 && bShortestPath) {
                    fCos = -fCos;
                    x2 = -x2;
                    y2 = -y2;
                    z2 = -z2;
                    w2 = -w2;
                }
                var fEps = 1e-3;
                if (math.abs(fCos) < 1. - fEps) {
                    var fSin = math.sqrt(1. - fCos * fCos);
                    var fInvSin = 1. / fSin;
                    var fAngle = math.atan2(fSin, fCos);
                    var k1 = math.sin((1. - fA) * fAngle) * fInvSin;
                    var k2 = math.sin(fA * fAngle) * fInvSin;
                    q4fDestination.x = x1 * k1 + x2 * k2;
                    q4fDestination.y = y1 * k1 + y2 * k2;
                    q4fDestination.z = z1 * k1 + z2 * k2;
                    q4fDestination.w = w1 * k1 + w2 * k2;
                } else {
                    //два кватерниона или очень близки (тогда можно делать линейную интерполяцию)
                    //или два кватениона диаметрально противоположны, тогда можно интерполировать любым способом
                    //позже надо будет реализовать какой-нибудь, а пока тоже линейная интерполяция
                    var k1 = 1 - fA;
                    var k2 = fA;
                    var x = x1 * k1 + x2 * k2;
                    var y = y1 * k1 + y2 * k2;
                    var z = z1 * k1 + z2 * k2;
                    var w = w1 * k1 + w2 * k2;
                    // и нормализуем так-как мы сошли со сферы
                    var fLength = math.sqrt(x * x + y * y + z * z + w * w);
                    var fInvLen = fLength ? 1 / fLength : 0;
                    q4fDestination.x = x * fInvLen;
                    q4fDestination.y = y * fInvLen;
                    q4fDestination.z = z * fInvLen;
                    q4fDestination.w = w * fInvLen;
                }
                return q4fDestination;
            };
            Quat4.fromForwardUp = function fromForwardUp(v3fForward, v3fUp, q4fDestination) {
                if (!((q4fDestination) !== undefined)) {
                    q4fDestination = new Quat4();
                }
                var fForwardX = v3fForward.x, fForwardY = v3fForward.y, fForwardZ = v3fForward.z;
                var fUpX = v3fUp.x, fUpY = v3fUp.y, fUpZ = v3fUp.z;
                var m3fTemp = math.Mat3.stackCeil.set();
                var pTempData = m3fTemp.data;
                pTempData[0] = fUpY * fForwardZ - fUpZ * fForwardY;
                pTempData[3] = fUpX;
                pTempData[6] = fForwardX;
                pTempData[1] = fUpZ * fForwardX - fUpX * fForwardZ;
                pTempData[4] = fUpY;
                pTempData[7] = fForwardY;
                pTempData[2] = fUpX * fForwardY - fUpY * fForwardX;
                pTempData[5] = fUpZ;
                pTempData[8] = fForwardZ;
                return m3fTemp.toQuat4(q4fDestination);
            };
            Quat4.fromAxisAngle = function fromAxisAngle(v3fAxis, fAngle, q4fDestination) {
                if (!((q4fDestination) !== undefined)) {
                    q4fDestination = new Quat4();
                }
                var x = v3fAxis.x, y = v3fAxis.y, z = v3fAxis.z;
                var fLength = math.sqrt(x * x + y * y + z * z);
                if (fLength === 0.) {
                    q4fDestination.x = q4fDestination.y = q4fDestination.z = 0;
                    q4fDestination.w = 1;
                    return q4fDestination;
                }
                var fInvLength = 1 / fLength;
                x *= fInvLength;
                y *= fInvLength;
                z *= fInvLength;
                var fSin = math.sin(fAngle / 2);
                var fCos = math.cos(fAngle / 2);
                q4fDestination.x = x * fSin;
                q4fDestination.y = y * fSin;
                q4fDestination.z = z * fSin;
                q4fDestination.w = fCos;
                return q4fDestination;
            };
            Quat4.fromYawPitchRoll = function fromYawPitchRoll(fYaw, fPitch, fRoll, q4fDestination) {
                if (arguments.length <= 2) {
                    var v3fVec = arguments[0];
                    fYaw = v3fVec.x;
                    fPitch = v3fVec.y;
                    fRoll = v3fVec.z;
                    q4fDestination = arguments[1];
                }
                if (!((q4fDestination) !== undefined)) {
                    q4fDestination = new Quat4();
                }
                var fHalfYaw = fYaw * 0.5;
                var fHalfPitch = fPitch * 0.5;
                var fHalfRoll = fRoll * 0.5;
                var fCos1 = math.cos(fHalfYaw), fSin1 = math.sin(fHalfYaw);
                var fCos2 = math.cos(fHalfPitch), fSin2 = math.sin(fHalfPitch);
                var fCos3 = math.cos(fHalfRoll), fSin3 = math.sin(fHalfRoll);
                q4fDestination.x = fCos1 * fSin2 * fCos3 + fSin1 * fCos2 * fSin3;
                q4fDestination.y = fSin1 * fCos2 * fCos3 - fCos1 * fSin2 * fSin3;
                q4fDestination.z = fCos1 * fCos2 * fSin3 - fSin1 * fSin2 * fCos3;
                q4fDestination.w = fCos1 * fCos2 * fCos3 + fSin1 * fSin2 * fSin3;
                return q4fDestination;
            };
            Quat4.fromXYZ = function fromXYZ(fX, fY, fZ, q4fDestination) {
                if (arguments.length <= 2) {
                    //Vec3 + m4fDestination
                    var v3fVec = arguments[0];
                    return Quat4.fromYawPitchRoll(v3fVec.y, v3fVec.x, v3fVec.z, arguments[1]);
                } else {
                    //fX fY fZ m4fDestination
                    var fX = arguments[0];
                    var fY = arguments[1];
                    var fZ = arguments[2];
                    return Quat4.fromYawPitchRoll(fY, fX, fZ, arguments[3]);
                }
            };
            Object.defineProperty(Quat4, "stackCeil", {
                get: function () {
                    Quat4.stackPosition = Quat4.stackPosition === Quat4.stackSize - 1 ? 0 : Quat4.stackPosition;
                    return Quat4.stack[Quat4.stackPosition++];
                },
                enumerable: true,
                configurable: true
            });
            Quat4.stackSize = 256;
            Quat4.stackPosition = 0;
            Quat4.stack = (function () {
                var pStack = new Array(Quat4.stackSize);
                for(var i = 0; i < Quat4.stackSize; i++) {
                    pStack[i] = new Quat4();
                }
                return pStack;
            })();
            return Quat4;
        })();
        math.Quat4 = Quat4;        
    })(akra.math || (akra.math = {}));
    var math = akra.math;
})(akra || (akra = {}));
var akra;
(function (akra) {
    (function (math) {
        //
        // MATH AND UNIT CONVERSION FUNCTION PROTOTYPES
        //
        math.abs = Math.abs;
        math.acos = Math.acos;
        math.asin = Math.asin;
        math.atan = Math.atan;
        math.atan2 = Math.atan2;
        math.exp = Math.exp;
        math.min = Math.min;
        math.random = Math.random;
        math.sqrt = Math.sqrt;
        math.log = Math.log;
        math.round = Math.round;
        math.floor = Math.floor;
        math.ceil = Math.ceil;
        math.sin = Math.sin;
        math.cos = Math.cos;
        math.tan = Math.tan;
        math.pow = Math.pow;
        math.max = Math.max;
        /*
        -----------------------------------------------------------------
        
        Floating Point Macros
        
        -----------------------------------------------------------------
        */
        // reinterpret a float as an int32
        /** @inline */
        math.fpBits = /** @inline */function (f) {
            return math.floor(f);
        };
        // reinterpret an int32 as a float
        /** @inline */
        math.intBits = /** @inline */function (i) {
            return i;
        };
        // return 0 or -1 based on the sign of the float
        /** @inline */
        math.fpSign = /** @inline */function (f) {
            return (f >> 31);
        };
        // extract the 8 bits of exponent as a signed integer
        // by masking out this bits, shifting down by 23,
        // and subtracting the bias value of 127
        /** @inline */
        math.fpExponent = /** @inline */function (f) {
            return ((((/*checked (origin: math)>>*/akra.math.floor((f))) & 0x7fffffff) >> 23) - 127);
        };
        // return 0 or -1 based on the sign of the exponent
        /** @inline */
        math.fpExponentSign = /** @inline */function (f) {
            return ((((((/*checked (origin: math)>>*/akra.math.floor(((f)))) & 0x7fffffff) >> 23) - 127)) >> 31);
        };
        // get the 23 bits of mantissa without the implied bit
        /** @inline */
        math.fpPureMantissa = /** @inline */function (f) {
            return ((/*checked (origin: math)>>*/akra.math.floor((f))) & 0x7fffff);
        };
        // get the 23 bits of mantissa with the implied bit replaced
        /** @inline */
        math.fpMantissa = /** @inline */function (f) {
            return ((((/*checked (origin: math)>>*/akra.math.floor(((f)))) & 0x7fffff)) | (1 << 23));
        };
        math.fpOneBits = 0x3F800000;
        // flipSign is a helper Macro to
        // invert the sign of i if flip equals -1,
        // if flip equals 0, it does nothing
        //export var flipSign = (i, flip) ((i^ flip) - flip)
        /** @inline */
        math.flipSign = /** @inline */function (i, flip) {
            return ((flip == -1) ? -i : i);
        };
        /**
        * Абсолютное значение числа
        */
        math.absoluteValue = math.abs;
        /**
        * Pow
        */
        math.raiseToPower = math.pow;
        /**
        * Число положительно?
        */
        math.isPositive = /** @inline */function (a) {
            return (a >= 0);
        };
        /**
        * Число отрицательно?
        */
        math.isNegative = /** @inline */function (a) {
            return (a < 0);
        };
        /**
        * Число одного знака?
        */
        math.sameSigns = /** @inline */function (a, b) {
            return ((((a) < 0)) == (((b) < 0)));
        };
        /**
        * Копировать знак
        */
        math.copySign = /** @inline */function (a, b) {
            return ((((b) < 0)) ? -math.absoluteValue(a) : math.absoluteValue(a));
        };
        /**
        * Растояние между а и b меньше epsilon?
        */
        math.deltaRangeTest = /** @inline */function (a, b, epsilon) {
            if (typeof epsilon === "undefined") { epsilon = 0.0000001; }
            return ((math.absoluteValue(a - b) < epsilon) ? true : false);
        };
        /**
        * Ограничивает value интервалом [low,high]
        */
        math.clamp = /** @inline */function (value, low, high) {
            return math.max(low, math.min(value, high));
        };
        /**
        * Ограничивает value интервалом [0,+Infinity]
        */
        math.clampPositive = /** @inline */function (value) {
            return (value < 0 ? 0 : value);
        };
        /**
        * Ограничивает value интервалом [-Infinity,0]
        */
        math.clampNegative = /** @inline */function (value) {
            return (value > 0 ? 0 : value);
        };
        /**
        * Ограничивает value интервалом [-1,1]
        */
        math.clampUnitSize = /** @inline */function (value) {
            return (/*checked (origin: math)>>*/akra.math.max((-1), /*checked (origin: math)>>*/akra.math.min((value), (1))));
        };
        math.sign = /** @inline */function (value) {
            return value >= 0 ? 1 : -1;
        };
        /**
        * Номер с права начиная от нуля, самого левого установленного бита
        */
        math.highestBitSet = /** @inline */function (value) {
            return value == 0 ? (null) : (value < 0 ? 31 : ((math.log(value) / math.LN2) << 0));
        };
        /**
        * Номер с права начиная от нуля, самого правого установленного бита
        */
        math.lowestBitSet = function (value) {
            var temp;
            if (value == 0) {
                return null;
            }
            for(temp = 0; temp <= 31; temp++) {
                if (value & (1 << temp)) {
                    return temp;
                }
            }
            return null;
        };
        /**
        * Является ли число степенью двойки
        */
        math.isPowerOfTwo = /** @inline */function (value) {
            return (value > 0 && ((value) == 0 ? (null) : ((value) < 0 ? 31 : ((/*checked (origin: math)>>*/akra.math.log((value)) / /*checked (origin: math)>>*/akra.math.LN2) << 0))) == math.lowestBitSet(value));
        };
        /**
        * Округление до числа наиболее близкого к степени двойки
        */
        math.nearestPowerOfTwo = function (value) {
            if (value <= 1) {
                return 1;
            }
            var highestBit = ((value) == 0 ? (null) : ((value) < 0 ? 31 : ((/*checked (origin: math)>>*/akra.math.log((value)) / /*checked (origin: math)>>*/akra.math.LN2) << 0)));
            var roundingTest = value & (1 << (highestBit - 1));
            if (roundingTest != 0) {
                ++highestBit;
            }
            return 1 << highestBit;
        };
        /**
        * Округление до следующего числа являющегося к степени двойки
        */
        math.ceilingPowerOfTwo = function (value) {
            if (value <= 1) {
                return 1;
            }
            var highestBit = ((value) == 0 ? (null) : ((value) < 0 ? 31 : ((/*checked (origin: math)>>*/akra.math.log((value)) / /*checked (origin: math)>>*/akra.math.LN2) << 0)));
            var mask = value & ((1 << highestBit) - 1);
            highestBit += mask && 1;
            return 1 << highestBit;
        };
        /**
        * Округление до предыдущего числа являющегося к степени двойки
        */
        math.floorPowerOfTwo = function (value) {
            if (value <= 1) {
                return 1;
            }
            var highestBit = ((value) == 0 ? (null) : ((value) < 0 ? 31 : ((/*checked (origin: math)>>*/akra.math.log((value)) / /*checked (origin: math)>>*/akra.math.LN2) << 0)));
            return 1 << highestBit;
        };
        /**
        * Деление по модулю
        */
        math.modulus = /** @inline */function (e, divisor) {
            return (e - math.floor(e / divisor) * divisor);
        };
        /**
        *
        */
        math.mod = math.modulus;
        /**
        * Вырвнивание числа на alignment вверх
        */
        math.alignUp = function (value, alignment) {
            var iRemainder = (((value) - /*checked (origin: math)>>*/akra.math.floor((value) / (alignment)) * (alignment)));
            if (iRemainder == 0) {
                return (value);
            }
            return (value + (alignment - iRemainder));
        };
        /**
        * Вырвнивание числа на alignment вниз
        */
        math.alignDown = function (value, alignment) {
            var remainder = (((value) - /*checked (origin: math)>>*/akra.math.floor((value) / (alignment)) * (alignment)));
            if (remainder == 0) {
                return (value);
            }
            return (value - remainder);
        };
        /**
        * пнвертировать число
        */
        math.inverse = /** @inline */function (a) {
            return 1. / a;
        };
        /**
        * log base 2
        */
        math.log2 = /** @inline */function (f) {
            return math.log(f) / math.LN2;
        };
        /**
        * Округлени числа с определенной точностью, где округляется до значащих чисел как 1/(2^precision)
        */
        math.trimFloat = /** @inline */function (f, precision) {
            return f;
        };
        /**
        * Перевод дробного в целое с усеением
        */
        math.realToInt32_chop = /** @inline */function (a) {
            return math.round(a);
        };
        /**
        * Перевод дробного в целое до меньшего
        */
        math.realToInt32_floor = /** @inline */function (a) {
            return math.floor(a);
        };
        /**
        * Перевод дробного в целое до большего
        */
        math.realToInt32_ceil = /** @inline */function (a) {
            return math.ceil(a);
        };
        /**
        * Наибольший общий делитель
        */
        math.nod = function (n, m) {
            var p = n % m;
            while(p != 0) {
                n = m;
                m = p;
                p = n % m;
            }
            return m;
        };
        /**
        * Наименьшее общее кратное
        */
        math.nok = /** @inline */function (n, m) {
            return math.abs(n * m) / math.nod(n, m);
        };
        /**
        * Greatest common devider
        */
        math.gcd = math.nod;
        /**
        * Least common multiple
        */
        math.lcm = math.nok;
        // var pMat3Stack = new Array(100);
        // var iMat3StackIndex = 0;
        math.isRealEqual = function (a, b, tolerance) {
            if (typeof tolerance === "undefined") { tolerance = 1.19209e-007; }
            if (akra.math.abs(b - a) <= tolerance) {
                return true;
            } else {
                return false;
            }
        };
        function calcPOTtextureSize(nPixels) {
            var w, h;
            var n = nPixels;
            w = Math.ceil(Math.log(n) / Math.LN2 / 2.0);
            h = Math.ceil(Math.log(n / Math.pow(2, w)) / Math.LN2);
            w = Math.pow(2, w);
            h = Math.pow(2, h);
            n = w * h;
            return [
                w, 
                h, 
                n
            ];
        }
        math.calcPOTtextureSize = calcPOTtextureSize;
    })(akra.math || (akra.math = {}));
    var math = akra.math;
})(akra || (akra = {}));
var akra;
(function (akra) {
    (function (math) {
        //    export function vec2(): IVec2;
        //    export function vec2(fValue: float): IVec2;
        //    export function vec2(v2fVec: IVec2): IVec2;
        //    export function vec2(pArray: float[]): IVec2;
        //    export function vec2(fValue1: float, fValue2: float): IVec2;
        //    export function vec2(fValue1?, fValue2?): IVec2{
        //        var nArgumentsLength: uint = arguments.length;
        //        var v2fVec: IVec2 = Vec2.stack[Vec2.stackPosition ++];
        //        if(Vec2.stackPosition == Vec2.stackSize){
        //            Vec2.stackPosition = 0;
        //        }
        //        switch(nArgumentsLength){
        //            case 1:
        //                v2fVec.set(arguments[0]);
        //                break;
        //            case 2:
        //                v2fVec.set(arguments[0], arguments[1]);
        //                break;
        //            default:
        //                v2fVec.x = v2fVec.y = 0.;
        //                break;
        //        }
        //        return v2fVec;
        //    };
        //    export function vec3(): IVec3;
        //    export function vec3(fValue: float): IVec3;
        //    export function vec3(v3fVec: IVec3): IVec3;
        //    export function vec3(pArray: float[]): IVec3;
        //    export function vec3(fValue: float, v2fVec: IVec2): IVec3;
        //    export function vec3(v2fVec: IVec2, fValue: float): IVec3;
        //    export function vec3(fValue1: float, fValue2: float, fValue3: float): IVec3;
        //    export function vec3(fValue1?, fValue2?, fValue3?): IVec3{
        //        var nArgumentsLength: uint = arguments.length;
        //        var v3fVec: IVec3 = Vec3.stack[Vec3.stackPosition ++];
        //        if(Vec3.stackPosition == Vec3.stackSize){
        //            Vec3.stackPosition = 0;
        //        }
        //        switch(nArgumentsLength){
        //            case 1:
        //                v3fVec.set(arguments[0]);
        //                break;
        //            case 2:
        //                v3fVec.set(arguments[0], arguments[1]);
        //                break;
        //            case 3:
        //                v3fVec.set(arguments[0], arguments[1], arguments[2]);
        //                break;
        //            default:
        //                v3fVec.x = v3fVec.y = v3fVec.z = 0.;
        //                break;
        //        }
        //        return v3fVec;
        //    };
        //    export function vec4(): IVec4;
        //    export function vec4(fValue: float): IVec4;
        //    export function vec4(v4fVec: IVec4): IVec4;
        //    export function vec4(pArray: float[]): IVec4;
        //    export function vec4(fValue: float, v3fVec: IVec3): IVec4;
        //    export function vec4(v2fVec1: IVec2, v2fVec2: IVec2): IVec4;
        //    export function vec4(v3fVec: IVec3, fValue: float): IVec4;
        //    export function vec4(fValue1: float, fValue2: float, v2fVec: IVec2): IVec4;
        //    export function vec4(fValue1: float, v2fVec: IVec2, fValue2: float): IVec4;
        //    export function vec4(v2fVec: IVec2 ,fValue1: float, fValue2: float): IVec4;
        //    export function vec4(fValue1: float, fValue2: float, fValue3: float, fValue4: float): IVec4;
        //    export function vec4(fValue1?, fValue2?, fValue3?, fValue4?): IVec4{
        //        var nArgumentsLength: uint = arguments.length;
        //        var v4fVec: IVec4 = Vec4.stack[Vec4.stackPosition ++];
        //        if(Vec4.stackPosition == Vec4.stackSize){
        //            Vec4.stackPosition = 0;
        //        }
        //        switch(nArgumentsLength){
        //            case 1:
        //                v4fVec.set(arguments[0]);
        //                break;
        //            case 2:
        //                v4fVec.set(arguments[0],arguments[1]);
        //                break;
        //            case 3:
        //                v4fVec.set(arguments[0],arguments[1], arguments[2]);
        //                break;
        //            case 4:
        //                v4fVec.set(arguments[0],arguments[1], arguments[2], arguments[3]);
        //                break;
        //            default:
        //                v4fVec.x = v4fVec.y = v4fVec.z = v4fVec.w = 0.;
        //                break;
        //        }
        //        return v4fVec;
        //    };
        //    export function quat4(): IQuat4;
        // export function quat4(q4fQuat: IQuat4): IQuat4;
        // export function quat4(pArray: float[]): IQuat4;
        // export function quat4(fValue: float, fW: float): IQuat4;
        // export function quat4(v3fValue: IVec3, fW: float): IQuat4;
        // export function quat4(fX: float, fY: float, fZ: float, fW: float): IQuat4;
        // export function quat4(fX?, fY?, fZ?, fW?): IQuat4{
        // 	var nArgumentsLength: uint = arguments.length;
        // 	var q4fQuat: IQuat4 = Quat4.stack[Quat4.stackPosition ++];
        // 	if(Quat4.stackPosition == Quat4.stackSize){
        //            Quat4.stackPosition = 0;
        // 	}
        // 	switch(nArgumentsLength){
        // 		case 1:
        // 			q4fQuat.set(arguments[0]);
        // 			break;
        // 		case 2:
        // 			q4fQuat.set(arguments[0], arguments[1]);
        // 			break;
        // 		case 4:
        // 			q4fQuat.set(arguments[0], arguments[1], arguments[2], arguments[3]);
        // 			break;
        // 		default:
        // 			q4fQuat.x = q4fQuat.y = q4fQuat.z = 0.;
        // 			q4fQuat.w = 1.;
        // 			break;
        // 	}
        // 	return q4fQuat;
        // };
        // export function mat3(): IMat3;
        // export function mat3(fValue: float): IMat3;
        // export function mat3(v3fVec: IVec3): IMat3;
        // export function mat3(m3fMat: IMat3): IMat3;
        // export function mat3(m4fMat: IMat4): IMat3;
        // export function mat3(pArray: float[]): IMat3;
        // export function mat3(fValue1: float, fValue2: float, fValue3: float): IMat3;
        // export function mat3(v3fVec1: IVec3, v3fVec2: IVec3, v3fVec3: IVec3): IMat3;
        // export function mat3(pArray1: float[], pArray2: float[], pArray3: float[]): IMat3;
        // export function mat3(fValue1: float, fValue2: float, fValue3: float,
        // 			fValue4: float, fValue5: float, fValue6: float,
        // 			fValue7: float, fValue8: float, fValue9: float): IMat3;
        // export function mat3(fValue1?, fValue2?, fValue3?,
        // 			fValue4?, fValue5?, fValue6?,
        // 			fValue7?, fValue8?, fValue9?): IMat3{
        // 	var nArgumentsLength: uint = arguments.length;
        // 	var m3fMat: IMat3 = Mat3.stack[Mat3.stackPosition ++];
        //        if(Mat3.stackPosition == Mat3.stackSize){
        //            Mat3.stackPosition = 0;
        // 	}
        // 	switch(nArgumentsLength){
        // 		case 1:
        // 			m3fMat.set(arguments[0]);
        // 			break;
        // 		case 3:
        // 			m3fMat.set(arguments[0], arguments[1], arguments[2]);
        // 			break;
        // 		case 9:
        // 			m3fMat.set(arguments[0], arguments[1], arguments[2],
        // 					 arguments[3], arguments[4], arguments[5],
        // 					 arguments[6], arguments[7], arguments[8]);
        // 			break;
        // 		default:
        // 			m3fMat.set(0.);
        // 			break;
        // 	}
        // 	return m3fMat;
        // };
        // export function mat4(): IMat4;
        // export function mat4(fValue: float): IMat4;
        // export function mat4(v4fVec: IVec4): IMat4;
        // export function mat4(m3fMat: IMat3, v3fTranslation?: IVec3): IMat4;
        // export function mat4(m4fMat: IMat4): IMat4;
        // export function mat4(pArray: float[]): IMat4;
        // export function mat4(pArray: Float32Array, bFlag: bool): IMat4;
        // export function mat4(fValue1: float, fValue2: float,
        // 		fValue3: float, fValue4: float): IMat4;
        // export function mat4(v4fVec1: IVec4, v4fVec2: IVec4,
        // 		v4fVec3: IVec4, v4fVec4: IVec4): IMat4;
        // export function mat4(pArray1: float[], pArray2: float[],
        // 		pArray3: float[], pArray4: float[]): IMat4;
        // export function mat4(fValue1: float, fValue2: float, fValue3: float, fValue4: float,
        // 		fValue5: float, fValue6: float, fValue7: float, fValue8: float,
        // 		fValue9: float, fValue10: float, fValue11: float, fValue12: float,
        // 		fValue13: float, fValue14: float, fValue15: float, fValue16: float): IMat4;
        // export function mat4(fValue1?, fValue2?, fValue3?, fValue4?,
        // 			fValue5?, fValue6?, fValue7?, fValue8?,
        // 			fValue9?, fValue10?, fValue11?, fValue12?,
        // 			fValue13?, fValue14?, fValue15?, fValue16?): IMat4{
        // 	var nArgumentsLength: uint = arguments.length;
        // 	var m4fMat: IMat4 = Mat4.stack[Mat4.stackPosition ++];
        //        if(Mat4.stackPosition == Mat4.stackSize){
        //            Mat4.stackPosition = 0;
        // 	}
        // 	if(nArgumentsLength === 2){
        // 		if(isBoolean(arguments[1])){
        // 			if(arguments[1]){
        // 				m4fMat.data = arguments[0];
        // 			}
        // 			else{
        // 				m4fMat.set(arguments[0]);
        // 			}
        // 		}
        // 		else{
        // 			m4fMat.set(arguments[0], arguments[1]);
        // 		}
        // 	}
        // 	else{
        // 		switch(nArgumentsLength){
        // 			case 1:
        // 				if(arguments[0] instanceof Mat3){
        // 					m4fMat.set(arguments[0],vec3(0.));
        // 				}
        // 				else{
        // 					m4fMat.set(arguments[0]);
        // 				}
        // 				break;
        // 			case 4:
        // 				m4fMat.set(arguments[0],arguments[1],arguments[2],arguments[3]);
        // 				break;
        // 			case 16:
        // 				m4fMat.set(arguments[0], arguments[1], arguments[2], arguments[3],
        // 					 arguments[4], arguments[5], arguments[6], arguments[7],
        // 					 arguments[8], arguments[9], arguments[10], arguments[11],
        // 					 arguments[12], arguments[13], arguments[14], arguments[15]);
        // 				 break;
        // 			 default:
        // 			 	break;
        // 		}
        // 	}
        // 	return m4fMat;
        // };
        function floatToFloat3(value) {
            var data = value;
            var result = math.Vec3.stackCeil.set(0.);
            if (data == 0.) {
                var signedZeroTest = 1. / value;
                if (signedZeroTest < 0.) {
                    result.x = 128.;
                }
                return result;
            }
            if (data < 0.) {
                result.x = 128.;
                data = -data;
            }
            var power = 0.;
            var counter = 0.;
            while(counter < 64.) {
                counter += 1.;
                if (data >= 2.) {
                    data = data * 0.5;
                    power += 1.;
                    if (power == 63.) {
                        counter = 65.;
                    }
                } else {
                    if (data < 1.) {
                        data = data * 2.;
                        power -= 1.;
                        if (power == -62.) {
                            counter = 65.;
                        }
                    } else {
                        counter = 65.;
                    }
                }
            }
            if (power == -62. && data < 1.) {
                power = 0.;
            } else {
                power = power + 63.;
                data = data - 1.;
            }
            result.x += power;
            data *= 256.;
            result.y = math.floor(data);
            data -= math.floor(data);
            data *= 256.;
            result.z = math.floor(data);
            return result;
        }
        math.floatToFloat3 = floatToFloat3;
    })(akra.math || (akra.math = {}));
    var math = akra.math;
})(akra || (akra = {}));
var akra;
(function (akra) {
    akra.Vec2 = akra.math.Vec2;
    akra.Vec3 = akra.math.Vec3;
    akra.Vec4 = akra.math.Vec4;
    akra.Mat3 = akra.math.Mat3;
    akra.Mat4 = akra.math.Mat4;
    akra.Quat4 = akra.math.Quat4;
    // export var vec2 = math.vec2;
    // export var vec3 = math.vec3;
    // export var vec4 = math.vec4;
    // export var quat4 = math.quat4;
    // export var mat3 = math.mat3;
    // export var mat4 = math.mat4;
    })(akra || (akra = {}));
var akra;
(function (akra) {
    ;
    (function (EEventTypes) {
        EEventTypes._map = [];
        EEventTypes._map[0] = "BROADCAST";
        EEventTypes.BROADCAST = 0;
        EEventTypes._map[1] = "UNICAST";
        EEventTypes.UNICAST = 1;
    })(akra.EEventTypes || (akra.EEventTypes = {}));
    var EEventTypes = akra.EEventTypes;
    ;
})(akra || (akra = {}));
var akra;
(function (akra) {
    (function (ECompareFunction) {
        ECompareFunction._map = [];
        ECompareFunction._map[0] = "ALWAYS_FAIL";
        ECompareFunction.ALWAYS_FAIL = 0;
        ECompareFunction._map[1] = "ALWAYS_PASS";
        ECompareFunction.ALWAYS_PASS = 1;
        ECompareFunction._map[2] = "LESS";
        ECompareFunction.LESS = 2;
        ECompareFunction._map[3] = "LESS_EQUAL";
        ECompareFunction.LESS_EQUAL = 3;
        ECompareFunction._map[4] = "EQUAL";
        ECompareFunction.EQUAL = 4;
        ECompareFunction._map[5] = "NOT_EQUAL";
        ECompareFunction.NOT_EQUAL = 5;
        ECompareFunction._map[6] = "GREATER_EQUAL";
        ECompareFunction.GREATER_EQUAL = 6;
        ECompareFunction._map[7] = "GREATER";
        ECompareFunction.GREATER = 7;
    })(akra.ECompareFunction || (akra.ECompareFunction = {}));
    var ECompareFunction = akra.ECompareFunction;
    (function (ECullingMode) {
        ECullingMode._map = [];
        ECullingMode.NONE = 1;
        ECullingMode.CLOCKWISE = 2;
        ECullingMode.ANTICLOCKWISE = 3;
    })(akra.ECullingMode || (akra.ECullingMode = {}));
    var ECullingMode = akra.ECullingMode;
    (function (EFrameBufferTypes) {
        EFrameBufferTypes._map = [];
        EFrameBufferTypes.COLOR = 0x1;
        EFrameBufferTypes.DEPTH = 0x2;
        EFrameBufferTypes.STENCIL = 0x4;
    })(akra.EFrameBufferTypes || (akra.EFrameBufferTypes = {}));
    var EFrameBufferTypes = akra.EFrameBufferTypes;
})(akra || (akra = {}));
var akra;
(function (akra) {
    ;
    ;
    ;
    ;
    ;
    ;
    ;
    ;
    ;
    ;
    ;
    ;
    ;
    ;
    ;
    ;
    ;
    ;
    ;
    //API SPECIFIFC CONSTANTS
    (function (EPrimitiveTypes) {
        EPrimitiveTypes._map = [];
        EPrimitiveTypes.POINTLIST = 0;
        EPrimitiveTypes._map[1] = "LINELIST";
        EPrimitiveTypes.LINELIST = 1;
        EPrimitiveTypes._map[2] = "LINELOOP";
        EPrimitiveTypes.LINELOOP = 2;
        EPrimitiveTypes._map[3] = "LINESTRIP";
        EPrimitiveTypes.LINESTRIP = 3;
        EPrimitiveTypes._map[4] = "TRIANGLELIST";
        EPrimitiveTypes.TRIANGLELIST = 4;
        EPrimitiveTypes._map[5] = "TRIANGLESTRIP";
        EPrimitiveTypes.TRIANGLESTRIP = 5;
        EPrimitiveTypes._map[6] = "TRIANGLEFAN";
        EPrimitiveTypes.TRIANGLEFAN = 6;
    })(akra.EPrimitiveTypes || (akra.EPrimitiveTypes = {}));
    var EPrimitiveTypes = akra.EPrimitiveTypes;
    ;
    (function (ERenderCapabilitiesCategory) {
        ERenderCapabilitiesCategory._map = [];
        ERenderCapabilitiesCategory.C_COMMON = 0;
        ERenderCapabilitiesCategory.C_COMMON_2 = 1;
        ERenderCapabilitiesCategory.C_WEBGL = 2;
        ERenderCapabilitiesCategory.COUNT = 3;
    })(akra.ERenderCapabilitiesCategory || (akra.ERenderCapabilitiesCategory = {}));
    var ERenderCapabilitiesCategory = akra.ERenderCapabilitiesCategory;
    (function (ERenderCapabilities) {
        ERenderCapabilities._map = [];
        ERenderCapabilities.AUTOMIPMAP = ((ERenderCapabilitiesCategory.C_COMMON << (32 - 4)) | (1 << 0));
        ERenderCapabilities.BLENDING = ((ERenderCapabilitiesCategory.C_COMMON << (32 - 4)) | (1 << 1));
        /// Supports anisotropic texture filtering
        ERenderCapabilities.ANISOTROPY = ((ERenderCapabilitiesCategory.C_COMMON << (32 - 4)) | (1 << 2));
        /// Supports fixed-function DOT3 texture blend
        ERenderCapabilities.DOT3 = ((ERenderCapabilitiesCategory.C_COMMON << (32 - 4)) | (1 << 3));
        /// Supports cube mapping
        ERenderCapabilities.CUBEMAPPING = ((ERenderCapabilitiesCategory.C_COMMON << (32 - 4)) | (1 << 4));
        /// Supports hardware stencil buffer
        ERenderCapabilities.HWSTENCIL = ((ERenderCapabilitiesCategory.C_COMMON << (32 - 4)) | (1 << 5));
        /// Supports hardware vertex and index buffers
        ERenderCapabilities.VBO = ((ERenderCapabilitiesCategory.C_COMMON << (32 - 4)) | (1 << 7));
        /// Supports vertex programs (vertex shaders)
        ERenderCapabilities.VERTEX_PROGRAM = ((ERenderCapabilitiesCategory.C_COMMON << (32 - 4)) | (1 << 9));
        /// Supports fragment programs (pixel shaders)
        ERenderCapabilities.FRAGMENT_PROGRAM = ((ERenderCapabilitiesCategory.C_COMMON << (32 - 4)) | (1 << 10));
        /// Supports performing a scissor test to exclude areas of the screen
        ERenderCapabilities.SCISSOR_TEST = ((ERenderCapabilitiesCategory.C_COMMON << (32 - 4)) | (1 << 11));
        /// Supports separate stencil updates for both front and back faces
        ERenderCapabilities.TWO_SIDED_STENCIL = ((ERenderCapabilitiesCategory.C_COMMON << (32 - 4)) | (1 << 12));
        /// Supports wrapping the stencil value at the range extremeties
        ERenderCapabilities.STENCIL_WRAP = ((ERenderCapabilitiesCategory.C_COMMON << (32 - 4)) | (1 << 13));
        /// Supports hardware occlusion queries
        ERenderCapabilities.HWOCCLUSION = ((ERenderCapabilitiesCategory.C_COMMON << (32 - 4)) | (1 << 14));
        /// Supports user clipping planes
        ERenderCapabilities.USER_CLIP_PLANES = ((ERenderCapabilitiesCategory.C_COMMON << (32 - 4)) | (1 << 15));
        /// Supports the VET_UBYTE4 vertex element type
        ERenderCapabilities.VERTEX_FORMAT_UBYTE4 = ((ERenderCapabilitiesCategory.C_COMMON << (32 - 4)) | (1 << 16));
        /// Supports infinite far plane projection
        ERenderCapabilities.INFINITE_FAR_PLANE = ((ERenderCapabilitiesCategory.C_COMMON << (32 - 4)) | (1 << 17));
        /// Supports hardware render-to-texture (bigger than framebuffer)
        ERenderCapabilities.HWRENDER_TO_TEXTURE = ((ERenderCapabilitiesCategory.C_COMMON << (32 - 4)) | (1 << 18));
        /// Supports float textures and render targets
        ERenderCapabilities.TEXTURE_FLOAT = ((ERenderCapabilitiesCategory.C_COMMON << (32 - 4)) | (1 << 19));
        /// Supports non-power of two textures
        ERenderCapabilities.NON_POWER_OF_2_TEXTURES = ((ERenderCapabilitiesCategory.C_COMMON << (32 - 4)) | (1 << 20));
        /// Supports 3d (volume) textures
        ERenderCapabilities.TEXTURE_3D = ((ERenderCapabilitiesCategory.C_COMMON << (32 - 4)) | (1 << 21));
        /// Supports basic point sprite rendering
        ERenderCapabilities.POINT_SPRITES = ((ERenderCapabilitiesCategory.C_COMMON << (32 - 4)) | (1 << 22));
        /// Supports extra point parameters (minsize, maxsize, attenuation)
        ERenderCapabilities.POINT_EXTENDED_PARAMETERS = ((ERenderCapabilitiesCategory.C_COMMON << (32 - 4)) | (1 << 23));
        /// Supports vertex texture fetch
        ERenderCapabilities.VERTEX_TEXTURE_FETCH = ((ERenderCapabilitiesCategory.C_COMMON << (32 - 4)) | (1 << 24));
        /// Supports mipmap LOD biasing
        ERenderCapabilities.MIPMAP_LOD_BIAS = ((ERenderCapabilitiesCategory.C_COMMON << (32 - 4)) | (1 << 25));
        /// Supports hardware geometry programs
        ERenderCapabilities.GEOMETRY_PROGRAM = ((ERenderCapabilitiesCategory.C_COMMON << (32 - 4)) | (1 << 26));
        /// Supports rendering to vertex buffers
        ERenderCapabilities.HWRENDER_TO_VERTEX_BUFFER = ((ERenderCapabilitiesCategory.C_COMMON << (32 - 4)) | (1 << 27));
        /// Supports compressed textures
        ERenderCapabilities.TEXTURE_COMPRESSION = ((ERenderCapabilitiesCategory.C_COMMON_2 << (32 - 4)) | (1 << 0));
        /// Supports compressed textures in the DXT/ST3C formats
        ERenderCapabilities.TEXTURE_COMPRESSION_DXT = ((ERenderCapabilitiesCategory.C_COMMON_2 << (32 - 4)) | (1 << 1));
        /// Supports compressed textures in the VTC format
        ERenderCapabilities.TEXTURE_COMPRESSION_VTC = ((ERenderCapabilitiesCategory.C_COMMON_2 << (32 - 4)) | (1 << 2));
        /// Supports compressed textures in the PVRTC format
        ERenderCapabilities.TEXTURE_COMPRESSION_PVRTC = ((ERenderCapabilitiesCategory.C_COMMON_2 << (32 - 4)) | (1 << 3));
        /// Supports fixed-function pipeline
        ERenderCapabilities.FIXED_FUNCTION = ((ERenderCapabilitiesCategory.C_COMMON_2 << (32 - 4)) | (1 << 4));
        /// Supports MRTs with different bit depths
        ERenderCapabilities.MRT_DIFFERENT_BIT_DEPTHS = ((ERenderCapabilitiesCategory.C_COMMON_2 << (32 - 4)) | (1 << 5));
        /// Supports Alpha to Coverage (A2C)
        ERenderCapabilities.ALPHA_TO_COVERAGE = ((ERenderCapabilitiesCategory.C_COMMON_2 << (32 - 4)) | (1 << 6));
        /// Supports Blending operations other than +
        ERenderCapabilities.ADVANCED_BLEND_OPERATIONS = ((ERenderCapabilitiesCategory.C_COMMON_2 << (32 - 4)) | (1 << 7));
        /// Supports a separate depth buffer for RTTs. D3D 9 & 10, OGL w/FBO (FBO implies this flag)
        ERenderCapabilities.RTT_SEPARATE_DEPTHBUFFER = ((ERenderCapabilitiesCategory.C_COMMON_2 << (32 - 4)) | (1 << 8));
        /// Supports using the MAIN depth buffer for RTTs. D3D 9&10, OGL w/FBO support unknown
        /// (undefined behavior?), OGL w/ copy supports it
        ERenderCapabilities.RTT_MAIN_DEPTHBUFFER_ATTACHABLE = ((ERenderCapabilitiesCategory.C_COMMON_2 << (32 - 4)) | (1 << 9));
        /// Supports attaching a depth buffer to an RTT that has width & height less or equal than RTT's.
        /// Otherwise must be of _exact_ same resolution. D3D 9, OGL 3.0 (not 2.0, not D3D10)
        ERenderCapabilities.RTT_DEPTHBUFFER_RESOLUTION_LESSEQUAL = ((ERenderCapabilitiesCategory.C_COMMON_2 << (32 - 4)) | (1 << 10));
        /// Supports using vertex buffers for instance data
        ERenderCapabilities.VERTEX_BUFFER_INSTANCE_DATA = ((ERenderCapabilitiesCategory.C_COMMON_2 << (32 - 4)) | (1 << 11));
        /// Supports using vertex buffers for instance data
        ERenderCapabilities.CAN_GET_COMPILED_SHADER_BUFFER = ((ERenderCapabilitiesCategory.C_COMMON_2 << (32 - 4)) | (1 << 12));
        // ***** GL Specific Caps *****
        /// Supports openGL GLEW version 1.5
        ERenderCapabilities.GL1_5_NOVBO = ((ERenderCapabilitiesCategory.C_WEBGL << (32 - 4)) | (1 << 1));
        /// Support for Frame Buffer Objects (FBOs)
        ERenderCapabilities.FBO = ((ERenderCapabilitiesCategory.C_WEBGL << (32 - 4)) | (1 << 2));
        /// Support for Frame Buffer Objects ARB implementation (regular FBO is higher precedence)
        ERenderCapabilities.FBO_ARB = ((ERenderCapabilitiesCategory.C_WEBGL << (32 - 4)) | (1 << 3));
        /// Support for Frame Buffer Objects ATI implementation (ARB FBO is higher precedence)
        ERenderCapabilities.FBO_ATI = ((ERenderCapabilitiesCategory.C_WEBGL << (32 - 4)) | (1 << 4));
        /// Support for PBuffer
        ERenderCapabilities.PBUFFER = ((ERenderCapabilitiesCategory.C_WEBGL << (32 - 4)) | (1 << 5));
        /// Support for GL 1.5 but without HW occlusion workaround
        ERenderCapabilities.GL1_5_NOHWOCCLUSION = ((ERenderCapabilitiesCategory.C_WEBGL << (32 - 4)) | (1 << 6));
        /// Support for point parameters ARB implementation
        ERenderCapabilities.POINT_EXTENDED_PARAMETERS_ARB = ((ERenderCapabilitiesCategory.C_WEBGL << (32 - 4)) | (1 << 7));
        /// Support for point parameters EXT implementation
        ERenderCapabilities.POINT_EXTENDED_PARAMETERS_EXT = ((ERenderCapabilitiesCategory.C_WEBGL << (32 - 4)) | (1 << 8));
        /// Support for Separate Shader Objects
        ERenderCapabilities.SEPARATE_SHADER_OBJECTS = ((ERenderCapabilitiesCategory.C_WEBGL << (32 - 4)) | (1 << 9));
    })(akra.ERenderCapabilities || (akra.ERenderCapabilities = {}));
    var ERenderCapabilities = akra.ERenderCapabilities;
    // export enum EGLSpecifics {
    //     UNPACK_ALIGNMENT = 0x0CF5,
    //     PACK_ALIGNMENT = 0x0D05,
    //     UNPACK_FLIP_Y_WEBGL = 0x9240,
    //     UNPACK_PREMULTIPLY_ALPHA_WEBGL = 0x9241,
    //     CONTEXT_LOST_WEBGL = 0x9242,
    //     UNPACK_COLORSPACE_CONVERSION_WEBGL = 0x9243,
    //     BROWSER_DEFAULT_WEBGL = 0x9244
    // };
    // export enum EBufferMasks {
    //     DEPTH_BUFFER_BIT               = 0x00000100,
    //     STENCIL_BUFFER_BIT             = 0x00000400,
    //     COLOR_BUFFER_BIT               = 0x00004000
    // };
    // export enum EBufferUsages {
    //     STREAM_DRAW = 0x88E0,
    //     STATIC_DRAW = 0x88E4,
    //     DYNAMIC_DRAW = 0x88E8
    // };
    // export enum EBufferTypes {
    //     ARRAY_BUFFER = 0x8892,
    //     ELEMENT_ARRAY_BUFFER = 0x8893,
    //     FRAME_BUFFER = 0x8D40,
    //     RENDER_BUFFER = 0x8D41
    // };
    (function (EAttachmentTypes) {
        EAttachmentTypes._map = [];
        EAttachmentTypes.COLOR_ATTACHMENT0 = 0x8CE0;
        EAttachmentTypes.DEPTH_ATTACHMENT = 0x8D00;
        EAttachmentTypes.STENCIL_ATTACHMENT = 0x8D20;
        EAttachmentTypes.DEPTH_STENCIL_ATTACHMENT = 0x821A;
    })(akra.EAttachmentTypes || (akra.EAttachmentTypes = {}));
    var EAttachmentTypes = akra.EAttachmentTypes;
    ;
    (function (ERenderStates) {
        ERenderStates._map = [];
        ERenderStates._map[0] = "BLENDENABLE";
        ERenderStates.BLENDENABLE = 0;
        ERenderStates._map[1] = "CULLFACEENABLE";
        ERenderStates.CULLFACEENABLE = 1;
        ERenderStates._map[2] = "ZENABLE";
        ERenderStates.ZENABLE = 2;
        ERenderStates._map[3] = "ZWRITEENABLE";
        ERenderStates.ZWRITEENABLE = 3;
        ERenderStates._map[4] = "DITHERENABLE";
        ERenderStates.DITHERENABLE = 4;
        ERenderStates._map[5] = "SCISSORTESTENABLE";
        ERenderStates.SCISSORTESTENABLE = 5;
        ERenderStates._map[6] = "STENCILTESTENABLE";
        ERenderStates.STENCILTESTENABLE = 6;
        ERenderStates._map[7] = "POLYGONOFFSETFILLENABLE";
        ERenderStates.POLYGONOFFSETFILLENABLE = 7;
        ERenderStates._map[8] = "CULLFACE";
        ERenderStates.CULLFACE = 8;
        ERenderStates._map[9] = "FRONTFACE";
        ERenderStates.FRONTFACE = 9;
        ERenderStates._map[10] = "SRCBLEND";
        ERenderStates.SRCBLEND = 10;
        ERenderStates._map[11] = "DESTBLEND";
        ERenderStates.DESTBLEND = 11;
        ERenderStates._map[12] = "ZFUNC";
        ERenderStates.ZFUNC = 12;
        ERenderStates._map[13] = "ALPHABLENDENABLE";
        ERenderStates.ALPHABLENDENABLE = 13;
        ERenderStates._map[14] = "ALPHATESTENABLE";
        ERenderStates.ALPHATESTENABLE = 14;
    })(akra.ERenderStates || (akra.ERenderStates = {}));
    var ERenderStates = akra.ERenderStates;
    //CULLMODE = FRONTFACE,
    ;
    (function (ERenderStateValues) {
        ERenderStateValues._map = [];
        ERenderStateValues.UNDEF = 0;
        ERenderStateValues._map[1] = "TRUE";
        ERenderStateValues.TRUE = 1;
        ERenderStateValues._map[2] = "FALSE";
        ERenderStateValues.FALSE = 2;
        ERenderStateValues._map[3] = "ZERO";
        ERenderStateValues.ZERO = 3;
        ERenderStateValues._map[4] = "ONE";
        ERenderStateValues.ONE = 4;
        ERenderStateValues._map[5] = "SRCCOLOR";
        ERenderStateValues.SRCCOLOR = 5;
        ERenderStateValues._map[6] = "INVSRCCOLOR";
        ERenderStateValues.INVSRCCOLOR = 6;
        ERenderStateValues._map[7] = "SRCALPHA";
        ERenderStateValues.SRCALPHA = 7;
        ERenderStateValues._map[8] = "INVSRCALPHA";
        ERenderStateValues.INVSRCALPHA = 8;
        ERenderStateValues._map[9] = "DESTALPHA";
        ERenderStateValues.DESTALPHA = 9;
        ERenderStateValues._map[10] = "INVDESTALPHA";
        ERenderStateValues.INVDESTALPHA = 10;
        ERenderStateValues._map[11] = "DESTCOLOR";
        ERenderStateValues.DESTCOLOR = 11;
        ERenderStateValues._map[12] = "INVDESTCOLOR";
        ERenderStateValues.INVDESTCOLOR = 12;
        ERenderStateValues._map[13] = "SRCALPHASAT";
        ERenderStateValues.SRCALPHASAT = 13;
        ERenderStateValues._map[14] = "NONE";
        ERenderStateValues.NONE = 14;
        ERenderStateValues._map[15] = "CW";
        ERenderStateValues.CW = 15;
        ERenderStateValues._map[16] = "CCW";
        ERenderStateValues.CCW = 16;
        ERenderStateValues._map[17] = "FRONT";
        ERenderStateValues.FRONT = 17;
        ERenderStateValues._map[18] = "BACK";
        ERenderStateValues.BACK = 18;
        ERenderStateValues._map[19] = "FRONT_AND_BACK";
        ERenderStateValues.FRONT_AND_BACK = 19;
        ERenderStateValues._map[20] = "NEVER";
        ERenderStateValues.NEVER = 20;
        ERenderStateValues._map[21] = "LESS";
        ERenderStateValues.LESS = 21;
        ERenderStateValues._map[22] = "EQUAL";
        ERenderStateValues.EQUAL = 22;
        ERenderStateValues._map[23] = "LESSEQUAL";
        ERenderStateValues.LESSEQUAL = 23;
        ERenderStateValues._map[24] = "GREATER";
        ERenderStateValues.GREATER = 24;
        ERenderStateValues._map[25] = "NOTEQUAL";
        ERenderStateValues.NOTEQUAL = 25;
        ERenderStateValues._map[26] = "GREATEREQUAL";
        ERenderStateValues.GREATEREQUAL = 26;
        ERenderStateValues._map[27] = "ALWAYS";
        ERenderStateValues.ALWAYS = 27;
    })(akra.ERenderStateValues || (akra.ERenderStateValues = {}));
    var ERenderStateValues = akra.ERenderStateValues;
    ;
})(akra || (akra = {}));
var akra;
(function (akra) {
    // #define color(...) Color.stackCeil.set(__VA_ARGS__)
    (function (util) {
        var Color = (function () {
            function Color(r, g, b, a) {
                this.set.apply(this, arguments);
            }
            Object.defineProperty(Color.prototype, "html", {
                get: function () {
                    // LOG(this.r, this.g, this.b);
                    var r = akra.math.round(this.r * 255).toString(16);
                    var g = akra.math.round(this.g * 255).toString(16);
                    var b = akra.math.round(this.b * 255).toString(16);
                    r = r.length < 2 ? "0" + r : r;
                    g = g.length < 2 ? "0" + g : g;
                    b = b.length < 2 ? "0" + b : b;
                    // LOG(r, g, b);
                    return "#" + r + g + b;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Color.prototype, "htmlRgba", {
                get: function () {
                    return "rgba(" + akra.math.floor(255 * this.r) + ", " + akra.math.floor(255 * this.g) + ", " + akra.math.floor(255 * this.b) + ", " + this.a + ")";
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Color.prototype, "rgba", {
                get: function () {
                    var val32 = 0;
                    // Convert to 32bit pattern
                    val32 = (this.a * 255) << 24;
                    val32 += (this.b * 255) << 16;
                    val32 += (this.g * 255) << 8;
                    val32 += (this.r * 255);
                    val32 = val32 >>> 0;
                    return val32;
                },
                set: function (c) {
                    var val32 = c;
                    // Convert from 32bit pattern
                    this.a = ((val32 >> 24) & 0xFF) / 255.0;
                    this.b = ((val32 >> 16) & 0xFF) / 255.0;
                    this.g = ((val32 >> 8) & 0xFF) / 255.0;
                    this.r = (val32 & 0xFF) / 255.0;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Color.prototype, "argb", {
                get: function () {
                    var val32 = 0;
                    // Convert to 32bit pattern
                    val32 = (this.b * 255) << 24;
                    val32 += (this.g * 255) << 16;
                    val32 += (this.r * 255) << 8;
                    val32 += (this.a * 255);
                    val32 = val32 >>> 0;
                    return val32;
                },
                set: function (c) {
                    var val32 = c;
                    // Convert from 32bit pattern
                    this.b = ((val32 >> 24) & 0xFF) / 255.0;
                    this.g = ((val32 >> 16) & 0xFF) / 255.0;
                    this.r = ((val32 >> 8) & 0xFF) / 255.0;
                    this.a = (val32 & 0xFF) / 255.0;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Color.prototype, "bgra", {
                get: function () {
                    var val32 = 0;
                    // Convert to 32bit pattern
                    val32 = (this.a * 255) << 24;
                    val32 += (this.r * 255) << 16;
                    val32 += (this.g * 255) << 8;
                    val32 += (this.b * 255);
                    val32 = val32 >>> 0;
                    return val32;
                },
                set: function (c) {
                    var val32 = c;
                    // Convert from 32bit pattern
                    this.a = ((val32 >> 24) & 0xFF) / 255.0;
                    this.r = ((val32 >> 16) & 0xFF) / 255.0;
                    this.g = ((val32 >> 8) & 0xFF) / 255.0;
                    this.b = (val32 & 0xFF) / 255.0;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Color.prototype, "abgr", {
                get: function () {
                    var val32 = 0;
                    // Convert to 32bit pattern
                    val32 = (this.r * 255) << 24;
                    val32 += (this.g * 255) << 16;
                    val32 += (this.b * 255) << 8;
                    val32 += (this.a * 255);
                    val32 = val32 >>> 0;
                    return val32;
                },
                set: function (c) {
                    var val32 = c;
                    // Convert from 32bit pattern
                    this.r = ((val32 >> 24) & 0xFF) / 255.0;
                    this.g = ((val32 >> 16) & 0xFF) / 255.0;
                    this.b = ((val32 >> 8) & 0xFF) / 255.0;
                    this.a = (val32 & 0xFF) / 255.0;
                },
                enumerable: true,
                configurable: true
            });
            Color.prototype.set = function (r, g, b, a) {
                switch(arguments.length) {
                    case 0:
                        this.r = this.g = this.b = 0.;
                        this.a = 1.;
                        break;
                    case 1:
                        if ((typeof (arguments[0]) === "number")) {
                            this.r = this.g = this.b = r;
                            this.a = 1.;
                        } else if (((arguments[0].buffer) !== undefined)) {
                            var c = arguments[0];
                            this.r = c[0];
                            this.g = c[1];
                            this.b = c[2];
                            this.a = c[3];
                        } else {
                            var v = arguments[0];
                            this.r = v.r;
                            this.g = v.g;
                            this.b = v.b;
                            this.a = v.a;
                        }
                        break;
                    case 2:
                        this.r = this.g = this.b = r;
                        this.a = g;
                        break;
                    case 3:
                    case 4:
                        this.r = r;
                        this.g = g;
                        this.b = b;
                        this.a = ((a) !== undefined) ? a : 1.;
                        break;
                }
                return this;
            };
            Color.prototype.saturate = function () {
                if (this.r < 0.) {
                    this.r = 0.;
                } else if (this.r > 1.) {
                    this.r = 1.;
                }
                if (this.g < 0.) {
                    this.g = 0.;
                } else if (this.g > 1.) {
                    this.g = 1.;
                }
                if (this.b < 0.) {
                    this.b = 0.;
                } else if (this.b > 1.) {
                    this.b = 1.;
                }
                if (this.a < 0.) {
                    this.a = 0.;
                } else if (this.a > 1.) {
                    this.a = 1.;
                }
                return this;
            };
            Color.prototype.saturateCopy = /** As saturate, except that this colour value is unaffected and
            the saturated colour value is returned as a copy. */
            function () {
                var ret = new Color(this);
                ret.saturate();
                return ret;
            };
            Color.prototype.add = function (cColor, ppDest) {
                if (typeof ppDest === "undefined") { ppDest = new Color(); }
                ppDest.r = this.r + cColor.r;
                ppDest.g = this.g + cColor.g;
                ppDest.b = this.b + cColor.b;
                ppDest.a = this.a + cColor.a;
                return ppDest;
            };
            Color.prototype.subtract = function (cColor, ppDest) {
                if (typeof ppDest === "undefined") { ppDest = new Color(); }
                ppDest.r = this.r - cColor.r;
                ppDest.g = this.g - cColor.g;
                ppDest.b = this.b - cColor.b;
                ppDest.a = this.a - cColor.a;
                return ppDest;
            };
            Color.prototype.multiply = function (fScalar, ppDest) {
                if (typeof ppDest === "undefined") { ppDest = new Color(); }
                if ((typeof (fScalar) === "number")) {
                    var f = fScalar;
                    ppDest.r = this.r * f;
                    ppDest.g = this.g * f;
                    ppDest.b = this.b * f;
                    ppDest.a = this.a * f;
                } else {
                    var c = arguments[0];
                    ppDest.r = this.r * c.r;
                    ppDest.g = this.g * c.g;
                    ppDest.b = this.b * c.b;
                    ppDest.a = this.a * c.a;
                }
                return ppDest;
            };
            Color.prototype.divide = function (fScalar, ppDest) {
                if (typeof ppDest === "undefined") { ppDest = new Color(); }
                if ((typeof (fScalar) === "number")) {
                    var f = fScalar;
                    ppDest.r = this.r / f;
                    ppDest.g = this.g / f;
                    ppDest.b = this.b / f;
                    ppDest.a = this.a / f;
                } else {
                    var c = arguments[0];
                    ppDest.r = this.r / c.r;
                    ppDest.g = this.g / c.g;
                    ppDest.b = this.b / c.b;
                    ppDest.a = this.a / c.a;
                }
                return ppDest;
            };
            Color.prototype.setHSB = function (fHue, fSaturation, fBrightness) {
                // wrap hue
                if (fHue > 1.0) {
                    fHue -= fHue;
                } else if (fHue < 0.0) {
                    fHue += fHue + 1;
                }
                // clamp saturation / fBrightness
                fSaturation = akra.math.min(fSaturation, 1.0);
                fSaturation = akra.math.max(fSaturation, 0.0);
                fBrightness = akra.math.min(fBrightness, 1.0);
                fBrightness = akra.math.max(fBrightness, 0.0);
                if (fBrightness == 0.0) {
                    // early exit, this has to be black
                    this.r = this.g = this.b = 0.0;
                    return;
                }
                if (fSaturation == 0.0) {
                    // early exit, this has to be grey
                    this.r = this.g = this.b = fBrightness;
                    return;
                }
                var fHueDomain = fHue * 6.0;
                if (fHueDomain >= 6.0) {
                    // wrap around, and allow mathematical errors
                    fHueDomain = 0.0;
                }
                var domain = fHueDomain;
                var f1 = fBrightness * (1 - fSaturation);
                var f2 = fBrightness * (1 - fSaturation * (fHueDomain - domain));
                var f3 = fBrightness * (1 - fSaturation * (1 - (fHueDomain - domain)));
                switch(domain) {
                    case 0:
                        // red domain; green ascends
                        this.r = fBrightness;
                        this.g = f3;
                        this.b = f1;
                        break;
                    case 1:
                        // yellow domain; red descends
                        this.r = f2;
                        this.g = fBrightness;
                        this.b = f1;
                        break;
                    case 2:
                        // green domain; blue ascends
                        this.r = f1;
                        this.g = fBrightness;
                        this.b = f3;
                        break;
                    case 3:
                        // cyan domain; green descends
                        this.r = f1;
                        this.g = f2;
                        this.b = fBrightness;
                        break;
                    case 4:
                        // blue domain; red ascends
                        this.r = f3;
                        this.g = f1;
                        this.b = fBrightness;
                        break;
                    case 5:
                        // magenta domain; blue descends
                        this.r = fBrightness;
                        this.g = f1;
                        this.b = f2;
                        break;
                }
                return this;
            };
            Color.prototype.getHSB = function (pHsb) {
                if (typeof pHsb === "undefined") { pHsb = [
                    0., 
                    0., 
                    0.
                ]; }
                var vMin = akra.math.min(this.r, akra.math.min(this.g, this.b));
                var vMax = akra.math.max(this.r, akra.math.max(this.g, this.b));
                var delta = vMax - vMin;
                var brightness = vMax;
                var hue = 0.;
                var saturation;
                if (akra.math.isRealEqual(delta, 0.0, 1e-6)) {
                    // grey
                    hue = 0.;
                    saturation = 0.;
                } else {
                    // a colour
                    saturation = delta / vMax;
                    var deltaR = (((vMax - this.r) / 6.0) + (delta / 2.0)) / delta;
                    var deltaG = (((vMax - this.g) / 6.0) + (delta / 2.0)) / delta;
                    var deltaB = (((vMax - this.b) / 6.0) + (delta / 2.0)) / delta;
                    if (akra.math.isRealEqual(this.r, vMax)) {
                        hue = deltaB - deltaG;
                    } else if (akra.math.isRealEqual(this.g, vMax)) {
                        hue = 0.3333333 + deltaR - deltaB;
                    } else if (akra.math.isRealEqual(this.b, vMax)) {
                        hue = 0.6666667 + deltaG - deltaR;
                    }
                    if (hue < 0.0) {
                        hue += 1.0;
                    }
                    if (hue > 1.0) {
                        hue -= 1.0;
                    }
                }
                pHsb[0] = hue;
                pHsb[1] = saturation;
                pHsb[2] = brightness;
                return pHsb;
            };
            Color.prototype.toString = function () {
                return "{R: " + this.r + ", G: " + this.g + ", B: " + this.b + ", A: " + this.a + "} " + "( 0x" + this.rgba.toString(16) + " )";
            };
            Color.toFloat32Array = function toFloat32Array(pValue) {
                var pArr = new Float32Array(4);
                pArr[0] = pValue.r;
                pArr[1] = pValue.g;
                pArr[2] = pValue.b;
                pArr[3] = pValue.a;
                return pArr;
            };
            Color.BLACK = new Color(0);
            Color.WHITE = new Color(0xFF, 0xFF, 0xFF);
            Color.ZERO = new Color(0., 0., 0., 0.);
            Color.isEqual = function isEqual(c1, c2) {
                return c1.r === c2.r && c1.g === c2.g && c1.b === c2.b && c1.a === c2.a;
            };
            Color.ALICE_BLUE = new Color(0xF0 / 255., 0xF8 / 255., 0xFF / 255.);
            Color.ANTIQUE_WHITE = new Color(0xFA / 255., 0xEB / 255., 0xD7 / 255.);
            Color.AQUA = new Color(0x00 / 255., 0xFF / 255., 0xFF / 255.);
            Color.AQUA_MARINE = new Color(0x7F / 255., 0xFF / 255., 0xD4 / 255.);
            Color.AZURE = new Color(0xF0 / 255., 0xFF / 255., 0xFF / 255.);
            Color.BEIGE = new Color(0xF5 / 255., 0xF5 / 255., 0xDC / 255.);
            Color.BISQUE = new Color(0xFF / 255., 0xE4 / 255., 0xC4 / 255.);
            Color.BLANCHED_ALMOND = new Color(0xFF / 255., 0xEB / 255., 0xCD / 255.);
            Color.BLUE = new Color(0x00 / 255., 0x00 / 255., 0xFF / 255.);
            Color.BLUE_VIOLET = new Color(0x8A / 255., 0x2B / 255., 0xE2 / 255.);
            Color.BROWN = new Color(0xA5 / 255., 0x2A / 255., 0x2A / 255.);
            Color.BURLY_WOOD = new Color(0xDE / 255., 0xB8 / 255., 0x87 / 255.);
            Color.CADET_BLUE = new Color(0x5F / 255., 0x9E / 255., 0xA0 / 255.);
            Color.CHARTREUSE = new Color(0x7F / 255., 0xFF / 255., 0x00 / 255.);
            Color.CHOCOLATE = new Color(0xD2 / 255., 0x69 / 255., 0x1E / 255.);
            Color.CORAL = new Color(0xFF / 255., 0x7F / 255., 0x50 / 255.);
            Color.CORNFLOWER_BLUE = new Color(0x64 / 255., 0x95 / 255., 0xED / 255.);
            Color.CORNSILK = new Color(0xFF / 255., 0xF8 / 255., 0xDC / 255.);
            Color.CRIMSON = new Color(0xDC / 255., 0x14 / 255., 0x3C / 255.);
            Color.CYAN = new Color(0x00 / 255., 0xFF / 255., 0xFF / 255.);
            Color.DARK_BLUE = new Color(0x00 / 255., 0x00 / 255., 0x8B / 255.);
            Color.DARK_CYAN = new Color(0x00 / 255., 0x8B / 255., 0x8B / 255.);
            Color.DARK_GOLDEN_ROD = new Color(0xB8 / 255., 0x86 / 255., 0x0B / 255.);
            Color.DARK_GRAY = new Color(0xA9 / 255., 0xA9 / 255., 0xA9 / 255.);
            Color.DARK_GREEN = new Color(0x00 / 255., 0x64 / 255., 0x00 / 255.);
            Color.DARK_KHAKI = new Color(0xBD / 255., 0xB7 / 255., 0x6B / 255.);
            Color.DARK_MAGENTA = new Color(0x8B / 255., 0x00 / 255., 0x8B / 255.);
            Color.DARK_OLIVE_GREEN = new Color(0x55 / 255., 0x6B / 255., 0x2F / 255.);
            Color.DARK_ORANGE = new Color(0xFF / 255., 0x8C / 255., 0x00 / 255.);
            Color.DARK_ORCHID = new Color(0x99 / 255., 0x32 / 255., 0xCC / 255.);
            Color.DARK_RED = new Color(0x8B / 255., 0x00 / 255., 0x00 / 255.);
            Color.DARK_SALMON = new Color(0xE9 / 255., 0x96 / 255., 0x7A / 255.);
            Color.DARK_SEA_GREEN = new Color(0x8F / 255., 0xBC / 255., 0x8F / 255.);
            Color.DARK_SLATE_BLUE = new Color(0x48 / 255., 0x3D / 255., 0x8B / 255.);
            Color.DARK_SLATE_GRAY = new Color(0x2F / 255., 0x4F / 255., 0x4F / 255.);
            Color.DARK_TURQUOISE = new Color(0x00 / 255., 0xCE / 255., 0xD1 / 255.);
            Color.DARK_VIOLET = new Color(0x94 / 255., 0x00 / 255., 0xD3 / 255.);
            Color.DEEP_PINK = new Color(0xFF / 255., 0x14 / 255., 0x93 / 255.);
            Color.DEEP_SKY_BLUE = new Color(0x00 / 255., 0xBF / 255., 0xFF / 255.);
            Color.DIM_GRAY = new Color(0x69 / 255., 0x69 / 255., 0x69 / 255.);
            Color.DIM_GREY = new Color(0x69 / 255., 0x69 / 255., 0x69 / 255.);
            Color.DODGER_BLUE = new Color(0x1E / 255., 0x90 / 255., 0xFF / 255.);
            Color.FIRE_BRICK = new Color(0xB2 / 255., 0x22 / 255., 0x22 / 255.);
            Color.FLORAL_WHITE = new Color(0xFF / 255., 0xFA / 255., 0xF0 / 255.);
            Color.FOREST_GREEN = new Color(0x22 / 255., 0x8B / 255., 0x22 / 255.);
            Color.FUCHSIA = new Color(0xFF / 255., 0x00 / 255., 0xFF / 255.);
            Color.GAINSBORO = new Color(0xDC / 255., 0xDC / 255., 0xDC / 255.);
            Color.GHOST_WHITE = new Color(0xF8 / 255., 0xF8 / 255., 0xFF / 255.);
            Color.GOLD = new Color(0xFF / 255., 0xD7 / 255., 0x00 / 255.);
            Color.GOLDEN_ROD = new Color(0xDA / 255., 0xA5 / 255., 0x20 / 255.);
            Color.GRAY = new Color(0x80 / 255., 0x80 / 255., 0x80 / 255.);
            Color.GREEN = new Color(0x00 / 255., 0x80 / 255., 0x00 / 255.);
            Color.GREEN_YELLOW = new Color(0xAD / 255., 0xFF / 255., 0x2F / 255.);
            Color.HONEY_DEW = new Color(0xF0 / 255., 0xFF / 255., 0xF0 / 255.);
            Color.HOT_PINK = new Color(0xFF / 255., 0x69 / 255., 0xB4 / 255.);
            Color.INDIAN_RED = new Color(0xCD / 255., 0x5C / 255., 0x5C / 255.);
            Color.INDIGO = new Color(0x4B / 255., 0x00 / 255., 0x82 / 255.);
            Color.IVORY = new Color(0xFF / 255., 0xFF / 255., 0xF0 / 255.);
            Color.KHAKI = new Color(0xF0 / 255., 0xE6 / 255., 0x8C / 255.);
            Color.LAVENDER = new Color(0xE6 / 255., 0xE6 / 255., 0xFA / 255.);
            Color.LAVENDER_BLUSH = new Color(0xFF / 255., 0xF0 / 255., 0xF5 / 255.);
            Color.LAWN_GREEN = new Color(0x7C / 255., 0xFC / 255., 0x00 / 255.);
            Color.LEMON_CHIFFON = new Color(0xFF / 255., 0xFA / 255., 0xCD / 255.);
            Color.LIGHT_BLUE = new Color(0xAD / 255., 0xD8 / 255., 0xE6 / 255.);
            Color.LIGHT_CORAL = new Color(0xF0 / 255., 0x80 / 255., 0x80 / 255.);
            Color.LIGHT_CYAN = new Color(0xE0 / 255., 0xFF / 255., 0xFF / 255.);
            Color.LIGHT_GOLDEN_ROD_YELLOW = new Color(0xFA / 255., 0xFA / 255., 0xD2 / 255.);
            Color.LIGHT_GRAY = new Color(0xD3 / 255., 0xD3 / 255., 0xD3 / 255.);
            Color.LIGHT_GREEN = new Color(0x90 / 255., 0xEE / 255., 0x90 / 255.);
            Color.LIGHT_PINK = new Color(0xFF / 255., 0xB6 / 255., 0xC1 / 255.);
            Color.LIGHT_SALMON = new Color(0xFF / 255., 0xA0 / 255., 0x7A / 255.);
            Color.LIGHT_SEA_GREEN = new Color(0x20 / 255., 0xB2 / 255., 0xAA / 255.);
            Color.LIGHT_SKY_BLUE = new Color(0x87 / 255., 0xCE / 255., 0xFA / 255.);
            Color.LIGHT_SLATE_GRAY = new Color(0x77 / 255., 0x88 / 255., 0x99 / 255.);
            Color.LIGHT_STEEL_BLUE = new Color(0xB0 / 255., 0xC4 / 255., 0xDE / 255.);
            Color.LIGHT_YELLOW = new Color(0xFF / 255., 0xFF / 255., 0xE0 / 255.);
            Color.LIME = new Color(0x00 / 255., 0xFF / 255., 0x00 / 255.);
            Color.LIME_GREEN = new Color(0x32 / 255., 0xCD / 255., 0x32 / 255.);
            Color.LINEN = new Color(0xFA / 255., 0xF0 / 255., 0xE6 / 255.);
            Color.MAGENTA = new Color(0xFF / 255., 0x00 / 255., 0xFF / 255.);
            Color.MAROON = new Color(0x80 / 255., 0x00 / 255., 0x00 / 255.);
            Color.MEDIUM_AQUA_MARINE = new Color(0x66 / 255., 0xCD / 255., 0xAA / 255.);
            Color.MEDIUM_BLUE = new Color(0x00 / 255., 0x00 / 255., 0xCD / 255.);
            Color.MEDIUM_ORCHID = new Color(0xBA / 255., 0x55 / 255., 0xD3 / 255.);
            Color.MEDIUM_PURPLE = new Color(0x93 / 255., 0x70 / 255., 0xDB / 255.);
            Color.MEDIUM_SEA_GREEN = new Color(0x3C / 255., 0xB3 / 255., 0x71 / 255.);
            Color.MEDIUM_SLATE_BLUE = new Color(0x7B / 255., 0x68 / 255., 0xEE / 255.);
            Color.MEDIUM_SPRING_GREEN = new Color(0x00 / 255., 0xFA / 255., 0x9A / 255.);
            Color.MEDIUM_TURQUOISE = new Color(0x48 / 255., 0xD1 / 255., 0xCC / 255.);
            Color.MEDIUM_VIOLET_RED = new Color(0xC7 / 255., 0x15 / 255., 0x85 / 255.);
            Color.MIDNIGHT_BLUE = new Color(0x19 / 255., 0x19 / 255., 0x70 / 255.);
            Color.MINT_CREAM = new Color(0xF5 / 255., 0xFF / 255., 0xFA / 255.);
            Color.MISTY_ROSE = new Color(0xFF / 255., 0xE4 / 255., 0xE1 / 255.);
            Color.MOCCASIN = new Color(0xFF / 255., 0xE4 / 255., 0xB5 / 255.);
            Color.NAVAJO_WHITE = new Color(0xFF / 255., 0xDE / 255., 0xAD / 255.);
            Color.NAVY = new Color(0x00 / 255., 0x00 / 255., 0x80 / 255.);
            Color.OLD_LACE = new Color(0xFD / 255., 0xF5 / 255., 0xE6 / 255.);
            Color.OLIVE = new Color(0x80 / 255., 0x80 / 255., 0x00 / 255.);
            Color.OLIVE_DRAB = new Color(0x6B / 255., 0x8E / 255., 0x23 / 255.);
            Color.ORANGE = new Color(0xFF / 255., 0xA5 / 255., 0x00 / 255.);
            Color.ORANGE_RED = new Color(0xFF / 255., 0x45 / 255., 0x00 / 255.);
            Color.ORCHID = new Color(0xDA / 255., 0x70 / 255., 0xD6 / 255.);
            Color.PALE_GOLDEN_ROD = new Color(0xEE / 255., 0xE8 / 255., 0xAA / 255.);
            Color.PALE_GREEN = new Color(0x98 / 255., 0xFB / 255., 0x98 / 255.);
            Color.PALE_TURQUOISE = new Color(0xAF / 255., 0xEE / 255., 0xEE / 255.);
            Color.PALE_VIOLET_RED = new Color(0xDB / 255., 0x70 / 255., 0x93 / 255.);
            Color.PAPAYA_WHIP = new Color(0xFF / 255., 0xEF / 255., 0xD5 / 255.);
            Color.PEACH_PUFF = new Color(0xFF / 255., 0xDA / 255., 0xB9 / 255.);
            Color.PERU = new Color(0xCD / 255., 0x85 / 255., 0x3F / 255.);
            Color.PINK = new Color(0xFF / 255., 0xC0 / 255., 0xCB / 255.);
            Color.PLUM = new Color(0xDD / 255., 0xA0 / 255., 0xDD / 255.);
            Color.POWDER_BLUE = new Color(0xB0 / 255., 0xE0 / 255., 0xE6 / 255.);
            Color.PURPLE = new Color(0x80 / 255., 0x00 / 255., 0x80 / 255.);
            Color.RED = new Color(0xFF / 255., 0x00 / 255., 0x00 / 255.);
            Color.ROSY_BROWN = new Color(0xBC / 255., 0x8F / 255., 0x8F / 255.);
            Color.ROYAL_BLUE = new Color(0x41 / 255., 0x69 / 255., 0xE1 / 255.);
            Color.SADDLE_BROWN = new Color(0x8B / 255., 0x45 / 255., 0x13 / 255.);
            Color.SALMON = new Color(0xFA / 255., 0x80 / 255., 0x72 / 255.);
            Color.SANDY_BROWN = new Color(0xF4 / 255., 0xA4 / 255., 0x60 / 255.);
            Color.SEA_GREEN = new Color(0x2E / 255., 0x8B / 255., 0x57 / 255.);
            Color.SEA_SHELL = new Color(0xFF / 255., 0xF5 / 255., 0xEE / 255.);
            Color.SIENNA = new Color(0xA0 / 255., 0x52 / 255., 0x2D / 255.);
            Color.SILVER = new Color(0xC0 / 255., 0xC0 / 255., 0xC0 / 255.);
            Color.SKY_BLUE = new Color(0x87 / 255., 0xCE / 255., 0xEB / 255.);
            Color.SLATE_BLUE = new Color(0x6A / 255., 0x5A / 255., 0xCD / 255.);
            Color.SLATE_GRAY = new Color(0x70 / 255., 0x80 / 255., 0x90 / 255.);
            Color.SNOW = new Color(0xFF / 255., 0xFA / 255., 0xFA / 255.);
            Color.SPRING_GREEN = new Color(0x00 / 255., 0xFF / 255., 0x7F / 255.);
            Color.STEEL_BLUE = new Color(0x46 / 255., 0x82 / 255., 0xB4 / 255.);
            Color.TAN = new Color(0xD2 / 255., 0xB4 / 255., 0x8C / 255.);
            Color.TEAL = new Color(0x00 / 255., 0x80 / 255., 0x80 / 255.);
            Color.THISTLE = new Color(0xD8 / 255., 0xBF / 255., 0xD8 / 255.);
            Color.TOMATO = new Color(0xFF / 255., 0x63 / 255., 0x47 / 255.);
            Color.TURQUOISE = new Color(0x40 / 255., 0xE0 / 255., 0xD0 / 255.);
            Color.VIOLET = new Color(0xEE / 255., 0x82 / 255., 0xEE / 255.);
            Color.WHEAT = new Color(0xF5 / 255., 0xDE / 255., 0xB3 / 255.);
            Color.WHITE_SMOKE = new Color(0xF5 / 255., 0xF5 / 255., 0xF5 / 255.);
            Color.YELLOW = new Color(0xFF / 255., 0xFF / 255., 0x00 / 255.);
            Color.YELLOW_GREEN = new Color(0x9A / 255., 0xCD / 255., 0x32 / 255.);
            Object.defineProperty(Color, "stackCeil", {
                get: function () {
                    Color.stackPosition = Color.stackPosition === Color.stackSize - 1 ? 0 : Color.stackPosition;
                    return Color.stack[Color.stackPosition++];
                },
                enumerable: true,
                configurable: true
            });
            Color.stackSize = 20;
            Color.stackPosition = 0;
            Color.stack = (function () {
                var pStack = new Array(Color.stackSize);
                for(var i = 0; i < Color.stackSize; i++) {
                    pStack[i] = new Color();
                }
                return pStack;
            })();
            return Color;
        })();
        util.Color = Color;        
        var pVariousColors = [
            "BLUE", 
            "BLUE_VIOLET", 
            "BROWN", 
            "CADET_BLUE", 
            "CHARTREUSE", 
            "CRIMSON", 
            "CYAN", 
            "DEEP_PINK", 
            "DEEP_SKY_BLUE", 
            "DODGER_BLUE", 
            "FIRE_BRICK", 
            "FUCHSIA", 
            "GOLD", 
            "GREEN", 
            "GREEN_YELLOW", 
            "HOT_PINK", 
            "LAWN_GREEN", 
            "LIME", 
            "LIME_GREEN", 
            "MAGENTA", 
            "MEDIUM_BLUE", 
            "MEDIUM_ORCHID", 
            "MEDIUM_SPRING_GREEN", 
            "MEDIUM_VIOLET_RED", 
            "ORANGE", 
            "ORANGE_RED", 
            "PURPLE", 
            "RED", 
            "SPRING_GREEN", 
            "STEEL_BLUE", 
            "TOMATO", 
            "TURQUOISE", 
            "VIOLET", 
            "WHEAT", 
            "YELLOW", 
            "YELLOW_GREEN"
        ];
        var iVariousColor = 0;
        function randomColor(bVarious) {
            if (typeof bVarious === "undefined") { bVarious = false; }
            if (!bVarious) {
                return new Color(Math.random(), Math.random(), Math.random(), 1.);
            }
            if (iVariousColor === pVariousColors.length) {
                iVariousColor = 0;
            }
            return (Color)[pVariousColors[iVariousColor++]] || Color.WHITE;
        }
        util.randomColor = randomColor;
        /** @inline */function colorToVec4(pValue) {
            return akra.Vec4.stackCeil.set(pValue.r, pValue.g, pValue.b, pValue.a);
        }
        util.colorToVec4 = colorToVec4;
        function color() {
            var argv = [];
            for (var _i = 0; _i < (arguments.length - 0); _i++) {
                argv[_i] = arguments[_i + 0];
            }
            var pColor = Color.stackCeil;
            return pColor.set.apply(pColor, arguments);
        }
        util.color = color;
    })(akra.util || (akra.util = {}));
    var util = akra.util;
})(akra || (akra = {}));
var akra;
(function (akra) {
    akra.Color = akra.util.Color;
    akra.color = akra.util.color;
})(akra || (akra = {}));
var akra;
(function (akra) {
    // #define box(...) Box.stackCeil.setPosition(__VA_ARGS__)
    (function (geometry) {
        var Box = (function () {
            function Box(l, t, ff, r, b, bb) {
                if (typeof l === "undefined") { l = 0; }
                if (typeof t === "undefined") { t = 0; }
                if (typeof ff === "undefined") { ff = 0; }
                if (typeof r === "undefined") { r = 1; }
                if (typeof b === "undefined") { b = 1; }
                if (typeof bb === "undefined") { bb = 1; }
                this.left = 0;
                this.top = 0;
                this.front = 0;
                this.right = 0;
                this.bottom = 0;
                this.back = 0;
                switch(arguments.length) {
                    case 1:
                        this.left = arguments[0].left;
                        this.top = arguments[0].top;
                        this.front = arguments[0].front;
                        this.right = arguments[0].right;
                        this.bottom = arguments[0].bottom;
                        this.back = arguments[0].back;
                        break;
                    case 0:
                        this.left = 0;
                        this.top = 0;
                        this.front = 0;
                        this.right = 1;
                        this.bottom = 1;
                        this.back = 1;
                        break;
                    case 3:
                        this.left = arguments[0];
                        this.top = arguments[1];
                        this.front = arguments[2];
                        this.right = arguments[0] + 1;
                        this.bottom = arguments[1] + 1;
                        this.back = arguments[2] + 1;
                        break;
                    case 6:
                        this.left = arguments[0];
                        this.top = arguments[1];
                        this.front = arguments[2];
                        this.right = arguments[3];
                        this.bottom = arguments[4];
                        this.back = arguments[5];
                        break;
                    case 4:
                        this.left = arguments[0];
                        this.top = arguments[1];
                        this.right = arguments[2];
                        this.bottom = arguments[3];
                        this.back = 1;
                        this.front = 0;
                        break;
                    case 5:
 {
                            akra.logger.setSourceLocation("geometry/Box.ts", 82);
                            akra.logger.error("invalid number of arguments");
                        }
                        ;
                }
 {
                    akra.logger.setSourceLocation("geometry/Box.ts", 85);
                    akra.logger.assert(this.right >= this.left && this.bottom >= this.top && this.back >= this.front);
                }
                ;
            }
            Object.defineProperty(Box.prototype, "width", {
                get: /** @inline */function () {
                    return this.right - this.left;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Box.prototype, "height", {
                get: /** @inline */function () {
                    return this.bottom - this.top;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Box.prototype, "depth", {
                get: /** @inline */function () {
                    return this.back - this.front;
                },
                enumerable: true,
                configurable: true
            });
            Box.prototype.contains = function (pDest) {
                return (pDest.left >= this.left && pDest.top >= this.top && pDest.front >= this.front && pDest.right <= this.right && pDest.bottom <= this.bottom && pDest.back <= this.back);
            };
            Box.prototype.setPosition = function (iLeft, iTop, iWidth, iHeight, iFront, iDepth) {
                if (typeof iFront === "undefined") { iFront = 0; }
                if (typeof iDepth === "undefined") { iDepth = 1; }
                this.left = iLeft;
                this.top = iTop;
                this.right = iLeft + iWidth;
                this.bottom = iTop + iHeight;
                this.front = iFront;
                this.back = iFront + iDepth;
            };
            Box.prototype.isEqual = function (pDest) {
                return (pDest.left == this.left && pDest.top == this.top && pDest.front == this.front && pDest.right == this.right && pDest.bottom == this.bottom && pDest.back == this.back);
            };
            Box.prototype.toString = function () {
                return "---------------------------\n" + "left: " + this.left + ", right: " + this.right + "\n" + "top: " + this.top + ", bottom: " + this.bottom + "\n" + "front: " + this.front + ", back: " + this.back + "\n" + "---------------------------";
            };
            Object.defineProperty(Box, "stackCeil", {
                get: function () {
                    Box.stackPosition = Box.stackPosition === Box.stackSize - 1 ? 0 : Box.stackPosition;
                    return Box.stack[Box.stackPosition++];
                },
                enumerable: true,
                configurable: true
            });
            Box.stackSize = 20;
            Box.stackPosition = 0;
            Box.stack = (function () {
                var pStack = new Array(Box.stackSize);
                for(var i = 0; i < Box.stackSize; i++) {
                    pStack[i] = new Box();
                }
                return pStack;
            })();
            return Box;
        })();
        geometry.Box = Box;        
                                                function box() {
            var pBox = Box.stack[Box.stackPosition++];
            if (Box.stackPosition === Box.stackSize) {
                Box.stackPosition = 0;
            }
            var iLeft = 0, iTop = 0, iFront = 0, iWidth = 0, iHeight = 0, iDepth = 0;
            switch(arguments.length) {
                case 1:
                    iLeft = arguments[0].left;
                    iTop = arguments[0].top;
                    iFront = arguments[0].front;
                    iWidth = arguments[0].width;
                    iHeight = arguments[0].height;
                    iDepth = arguments[0].depth;
                    break;
                case 0:
                    iLeft = 0;
                    iTop = 0;
                    iFront = 0;
                    iWidth = 1;
                    iHeight = 1;
                    iDepth = 1;
                    break;
                case 3:
                    iLeft = arguments[0];
                    iTop = arguments[1];
                    iFront = arguments[2];
                    iWidth = arguments[0] + 1;
                    iHeight = arguments[1] + 1;
                    iDepth = arguments[2] + 1;
                    break;
                    /*case 0:
                    case 3:
                    case 6:
                    pBox.setPosition(l, t, r - l, b - t, ff, bb - ff);
                    break;
                    case 4:
                    pBox.setPosition(l, t, arguments[2] - l, arguments[3]- t, 0, 1);
                    break;
                    default:
                    ERROR("Inavlid number of arguments");*/
                                    case 6:
                    iLeft = arguments[0];
                    iTop = arguments[1];
                    iFront = arguments[2];
                    iWidth = arguments[3] - arguments[0];
                    iHeight = arguments[4] - arguments[1];
                    iDepth = arguments[5] - arguments[2];
                    break;
                case 4:
                    iLeft = arguments[0];
                    iTop = arguments[1];
                    iFront = 0;
                    iWidth = arguments[2] - arguments[0];
                    iHeight = arguments[3] - arguments[1];
                    iDepth = 1;
                    break;
                default:
 {
                        akra.logger.setSourceLocation("geometry/Box.ts", 189);
                        akra.logger.error("Inavlid number of arguments");
                    }
                    ;
                    return null;
            }
            pBox.setPosition(iLeft, iTop, iWidth, iHeight, iFront, iDepth);
            return pBox;
        }
        geometry.box = box;
    })(akra.geometry || (akra.geometry = {}));
    var geometry = akra.geometry;
})(akra || (akra = {}));
var akra;
(function (akra) {
    ;
    ;
    ;
    ;
    ;
    ;
    /**
    * Отражает состояние ресурса
    **/
    (function (EResourceItemEvents) {
        EResourceItemEvents._map = [];
        EResourceItemEvents._map[0] = "CREATED";
        //ресур создан
        EResourceItemEvents.CREATED = 0;
        EResourceItemEvents._map[1] = "LOADED";
        //ресур заполнен данным и готов к использованию
        EResourceItemEvents.LOADED = 1;
        EResourceItemEvents._map[2] = "DISABLED";
        //ресур в данный момент отключен для использования
        EResourceItemEvents.DISABLED = 2;
        EResourceItemEvents._map[3] = "ALTERED";
        //ресур был изменен после загрузки
        EResourceItemEvents.ALTERED = 3;
        EResourceItemEvents._map[4] = "TOTALRESOURCEFLAGS";
        EResourceItemEvents.TOTALRESOURCEFLAGS = 4;
    })(akra.EResourceItemEvents || (akra.EResourceItemEvents = {}));
    var EResourceItemEvents = akra.EResourceItemEvents;
    ;
})(akra || (akra = {}));
var akra;
(function (akra) {
    (function (EImageFlags) {
        EImageFlags._map = [];
        EImageFlags.COMPRESSED = 0x00000001;
        EImageFlags.CUBEMAP = 0x00000002;
        EImageFlags.TEXTURE_3D = 0x00000004;
    })(akra.EImageFlags || (akra.EImageFlags = {}));
    var EImageFlags = akra.EImageFlags;
    ;
    (function (EImageCubeFlags) {
        EImageCubeFlags._map = [];
        EImageCubeFlags.POSITIVE_X = 0x00000001;
        EImageCubeFlags.NEGATIVE_X = 0x00000002;
        EImageCubeFlags.POSITIVE_Y = 0x00000004;
        EImageCubeFlags.NEGATIVE_Y = 0x00000008;
        EImageCubeFlags.POSITIVE_Z = 0x000000010;
        EImageCubeFlags.NEGATIVE_Z = 0x000000020;
    })(akra.EImageCubeFlags || (akra.EImageCubeFlags = {}));
    var EImageCubeFlags = akra.EImageCubeFlags;
    ;
})(akra || (akra = {}));
var akra;
(function (akra) {
    (function (pixelUtil) {
        var PixelBox = (function (_super) {
            __extends(PixelBox, _super);
            function PixelBox(iWidth, iHeight, iDepth, ePixelFormat, pPixelData) {
                if (typeof pPixelData === "undefined") { pPixelData = null; }
                if (arguments.length === 0) {
                                _super.call(this);
                    this.data = null;
                    this.format = akra.EPixelFormats.UNKNOWN;
                    this.setConsecutive();
                    return;
                }
                if (arguments.length >= 4) {
                                _super.call(this, 0, 0, 0, iWidth, iHeight, iDepth);
                    this.data = ((arguments[4]) !== undefined) ? (arguments[4]) : null;
                    this.format = arguments[3];
                } else {
                                _super.call(this, arguments[0]);
                    this.data = arguments[2];
                    this.format = arguments[1];
                }
                this.setConsecutive();
            }
            PixelBox.prototype.setConsecutive = function () {
                this.rowPitch = ((this).right - (this).left);
                this.slicePitch = ((this).right - (this).left) * ((this).bottom - (this).top);
            };
            PixelBox.prototype.getRowSkip = function () {
                return this.rowPitch - ((this).right - (this).left);
            };
            PixelBox.prototype.getSliceSkip = function () {
                return this.slicePitch - (((this).bottom - (this).top) * this.rowPitch);
            };
            PixelBox.prototype.isConsecutive = function () {
                return this.rowPitch == ((this).right - (this).left) && this.slicePitch == ((this).right - (this).left) * ((this).bottom - (this).top);
            };
            PixelBox.prototype.getConsecutiveSize = function () {
                return pixelUtil.getMemorySize(((this).right - (this).left), ((this).bottom - (this).top), ((this).back - (this).front), this.format);
            };
            PixelBox.prototype.getSubBox = function (pDest, pDestPixelBox) {
                if (typeof pDestPixelBox === "undefined") { pDestPixelBox = null; }
                if ((((/*not inlined, because supportes only single statement functions(cur. st. count: 5)*//*checked (origin: pixelUtil)>>*/akra.pixelUtil.getDescriptionFor(((this.format))).flags) & /*checked (origin: akra)>>*/akra.EPixelFormatFlags.COMPRESSED) > 0)) {
                    if (pDest.left == this.left && pDest.top == this.top && pDest.front == this.front && pDest.right == this.right && pDest.bottom == this.bottom && pDest.back == this.back) {
                        // Entire buffer is being queried
                        return this;
                    }
 {
                        akra.logger.setSourceLocation("PixelBox.ts", 69);
                        akra.logger.error("Cannot return subvolume of compressed PixelBuffer", "PixelBox::getSubVolume");
                    }
                    ;
                }
                if (!this.contains(pDest)) {
 {
                        akra.logger.setSourceLocation("PixelBox.ts", 74);
                        akra.logger.error("Bounds out of range", "PixelBox::getSubVolume");
                    }
                    ;
                }
                var elemSize = (/*not inlined, because supportes only single statement functions(cur. st. count: 5)*//*checked (origin: pixelUtil)>>*/akra.pixelUtil.getDescriptionFor((this.format)).elemBytes);
                // Calculate new data origin
                // Notice how we do not propagate left/top/front from the incoming box, since
                // the returned pointer is already offset
                var rval = null;
                if (((pDestPixelBox) === null)) {
                    rval = new PixelBox();
                } else {
                    rval = pDestPixelBox;
                }
                rval.setPosition(0, 0, pDest.width, pDest.height, 0, pDest.depth);
                rval.format = this.format;
                rval.data = (this.data).subarray(((pDest.left - this.left) * elemSize) + ((pDest.top - this.top) * this.rowPitch * elemSize) + ((pDest.front - this.front) * this.slicePitch * elemSize));
                rval.rowPitch = this.rowPitch;
                rval.slicePitch = this.slicePitch;
                rval.format = this.format;
                return rval;
            };
            PixelBox.prototype.getColorAt = function (pColor, x, y, z) {
                if (typeof z === "undefined") { z = 0; }
                if (((pColor) === null)) {
                    pColor = new akra.Color(0.);
                }
                var pixelSize = (/*not inlined, because supportes only single statement functions(cur. st. count: 5)*//*checked (origin: pixelUtil)>>*/akra.pixelUtil.getDescriptionFor((this.format)).elemBytes);
                var pixelOffset = pixelSize * (z * this.slicePitch + y * this.rowPitch + x);
                pixelUtil.unpackColour(pColor, this.format, this.data.subarray(pixelOffset, pixelOffset + pixelSize));
                return pColor;
            };
            PixelBox.prototype.setColorAt = function (pColor, x, y, z) {
                if (typeof z === "undefined") { z = 0; }
                var pixelSize = (/*not inlined, because supportes only single statement functions(cur. st. count: 5)*//*checked (origin: pixelUtil)>>*/akra.pixelUtil.getDescriptionFor((this.format)).elemBytes);
                var pixelOffset = pixelSize * (z * this.slicePitch + y * this.rowPitch + x);
                (/*checked (origin: pixelUtil)>>*/akra.pixelUtil.packColourFloat((pColor).r, (pColor).g, (pColor).b, (pColor).a, (this.format), (this.data.subarray(pixelOffset, pixelOffset + pixelSize))));
            };
            PixelBox.prototype.scale = function (pDest, eFilter) {
                if (typeof eFilter === "undefined") { eFilter = akra.EFilters.BILINEAR; }
                return false;
            };
            PixelBox.prototype.refresh = function (pExtents, ePixelFormat, pPixelData) {
                this.left = pExtents.left;
                this.top = pExtents.top;
                this.front = pExtents.front;
                this.right = pExtents.right;
                this.bottom = pExtents.bottom;
                this.back = pExtents.back;
                this.data = pPixelData;
                this.format = ePixelFormat;
                this.setConsecutive();
            };
            PixelBox.prototype.toString = function () {
                return "|---------------------------|\n" + _super.prototype.toString.call(this) + "\n" + "length: " + (this.data ? this.data.length : 0) + "\n" + "|---------------------------|";
            };
            Object.defineProperty(PixelBox, "stackCeil", {
                get: function () {
                    PixelBox.stackPosition = PixelBox.stackPosition === PixelBox.stackSize - 1 ? 0 : PixelBox.stackPosition;
                    return PixelBox.stack[PixelBox.stackPosition++];
                },
                enumerable: true,
                configurable: true
            });
            PixelBox.stackSize = 20;
            PixelBox.stackPosition = 0;
            PixelBox.stack = (function () {
                var pStack = new Array(PixelBox.stackSize);
                for(var i = 0; i < PixelBox.stackSize; i++) {
                    pStack[i] = new PixelBox();
                }
                return pStack;
            })();
            return PixelBox;
        })(akra.geometry.Box);
        pixelUtil.PixelBox = PixelBox;        
                                function pixelBox() {
            var pPixelBox = PixelBox.stack[PixelBox.stackPosition++];
            if (PixelBox.stackPosition === PixelBox.stackSize) {
                PixelBox.stackPosition = 0;
            }
            var pBox = null;
            var pPixelData = null;
            var ePixelFormat = akra.EPixelFormats.UNKNOWN;
            switch(arguments.length) {
                case 2:
                case 3:
                    pBox = arguments[0];
                    ePixelFormat = arguments[1];
                    pPixelData = arguments[2] || null;
                    break;
                case 4:
                case 5:
                    pBox = akra.geometry.box(0, 0, 0, arguments[0], arguments[1], arguments[2]);
                    ePixelFormat = arguments[3];
                    pPixelData = arguments[4] || null;
                    break;
                default:
                    pBox = akra.geometry.box(0, 0, 0, 1, 1, 1);
                    break;
            }
            pPixelBox.refresh(pBox, ePixelFormat, pPixelData);
            return pPixelBox;
        }
        pixelUtil.pixelBox = pixelBox;
    })(akra.pixelUtil || (akra.pixelUtil = {}));
    var pixelUtil = akra.pixelUtil;
})(akra || (akra = {}));
var akra;
(function (akra) {
    function fillPixelFormats(pData) {
        var pPixelFormats = [];
        for(var i = 0; i < pData.length; ++i) {
            var pEl = pData[i];
            pPixelFormats.push({
                name: pEl[0],
                elemBytes: pEl[1],
                flags: pEl[2],
                componentType: pEl[3],
                componentCount: pEl[4],
                rbits: pEl[5],
                gbits: pEl[6],
                bbits: pEl[7],
                abits: pEl[8],
                rmask: pEl[9],
                gmask: pEl[10],
                bmask: pEl[11],
                amask: pEl[12],
                rshift: pEl[13],
                gshift: pEl[14],
                bshift: pEl[15],
                ashift: pEl[16]
            });
        }
        return pPixelFormats;
    }
    var pPixelFormats = fillPixelFormats([
        [
            "PF_UNKNOWN", 
            /* Bytes per element */
            0, 
            /* Flags */
            0, 
            /* Component type and count */
            akra.EPixelComponentTypes.BYTE, 
            0, 
            /* rbits, gbits, bbits, abits */
            0, 
            0, 
            0, 
            0, 
            /* Masks and shifts */
            0, 
            0, 
            0, 
            0, 
            0, 
            0, 
            0, 
            0
        ], 
        //1-----------------------------------------------------------------------
        [
            "PF_L8", 
            /* Bytes per element */
            1, 
            /* Flags */
            akra.EPixelFormatFlags.LUMINANCE | akra.EPixelFormatFlags.NATIVEENDIAN, 
            /* Component type and count */
            akra.EPixelComponentTypes.BYTE, 
            1, 
            /* rbits, gbits, bbits, abits */
            8, 
            0, 
            0, 
            0, 
            /* Masks and shifts */
            0xFF, 
            0, 
            0, 
            0, 
            0, 
            0, 
            0, 
            0
        ], 
        //2-----------------------------------------------------------------------
        [
            "PF_L16", 
            /* Bytes per element */
            2, 
            /* Flags */
            akra.EPixelFormatFlags.LUMINANCE | akra.EPixelFormatFlags.NATIVEENDIAN, 
            /* Component type and count */
            akra.EPixelComponentTypes.SHORT, 
            1, 
            /* rbits, gbits, bbits, abits */
            16, 
            0, 
            0, 
            0, 
            /* Masks and shifts */
            0xFFFF, 
            0, 
            0, 
            0, 
            0, 
            0, 
            0, 
            0
        ], 
        //3-----------------------------------------------------------------------
        [
            "PF_A8", 
            /* Bytes per element */
            1, 
            /* Flags */
            akra.EPixelFormatFlags.HASALPHA | akra.EPixelFormatFlags.NATIVEENDIAN, 
            /* Component type and count */
            akra.EPixelComponentTypes.BYTE, 
            1, 
            /* rbits, gbits, bbits, abits */
            0, 
            0, 
            0, 
            8, 
            /* Masks and shifts */
            0, 
            0, 
            0, 
            0xFF, 
            0, 
            0, 
            0, 
            0
        ], 
        //4-----------------------------------------------------------------------
        [
            "PF_A4L4", 
            /* Bytes per element */
            1, 
            /* Flags */
            akra.EPixelFormatFlags.HASALPHA | akra.EPixelFormatFlags.LUMINANCE | akra.EPixelFormatFlags.NATIVEENDIAN, 
            /* Component type and count */
            akra.EPixelComponentTypes.BYTE, 
            2, 
            /* rbits, gbits, bbits, abits */
            4, 
            0, 
            0, 
            4, 
            /* Masks and shifts */
            0x0F, 
            0, 
            0, 
            0xF0, 
            0, 
            0, 
            0, 
            4
        ], 
        //5-----------------------------------------------------------------------
        [
            "PF_BYTE_LA", 
            /* Bytes per element */
            2, 
            /* Flags */
            akra.EPixelFormatFlags.HASALPHA | akra.EPixelFormatFlags.LUMINANCE, 
            /* Component type and count */
            akra.EPixelComponentTypes.BYTE, 
            2, 
            /* rbits, gbits, bbits, abits */
            8, 
            0, 
            0, 
            8, 
            /* Masks and shifts */
            0, 
            0, 
            0, 
            0, 
            0, 
            0, 
            0, 
            0
        ], 
        //6-----------------------------------------------------------------------
        [
            "PF_R5G6B5", 
            /* Bytes per element */
            2, 
            /* Flags */
            akra.EPixelFormatFlags.NATIVEENDIAN, 
            /* Component type and count */
            akra.EPixelComponentTypes.BYTE, 
            3, 
            /* rbits, gbits, bbits, abits */
            5, 
            6, 
            5, 
            0, 
            /* Masks and shifts */
            0xF800, 
            0x07E0, 
            0x001F, 
            0, 
            11, 
            5, 
            0, 
            0
        ], 
        //7-----------------------------------------------------------------------
        [
            "PF_B5G6R5", 
            /* Bytes per element */
            2, 
            /* Flags */
            akra.EPixelFormatFlags.NATIVEENDIAN, 
            /* Component type and count */
            akra.EPixelComponentTypes.BYTE, 
            3, 
            /* rbits, gbits, bbits, abits */
            5, 
            6, 
            5, 
            0, 
            /* Masks and shifts */
            0x001F, 
            0x07E0, 
            0xF800, 
            0, 
            0, 
            5, 
            11, 
            0
        ], 
        //8-----------------------------------------------------------------------
        [
            "PF_A4R4G4B4", 
            /* Bytes per element */
            2, 
            /* Flags */
            akra.EPixelFormatFlags.HASALPHA | akra.EPixelFormatFlags.NATIVEENDIAN, 
            /* Component type and count */
            akra.EPixelComponentTypes.BYTE, 
            4, 
            /* rbits, gbits, bbits, abits */
            4, 
            4, 
            4, 
            4, 
            /* Masks and shifts */
            0x0F00, 
            0x00F0, 
            0x000F, 
            0xF000, 
            8, 
            4, 
            0, 
            12
        ], 
        //9-----------------------------------------------------------------------
        [
            "PF_A1R5G5B5", 
            /* Bytes per element */
            2, 
            /* Flags */
            akra.EPixelFormatFlags.HASALPHA | akra.EPixelFormatFlags.NATIVEENDIAN, 
            /* Component type and count */
            akra.EPixelComponentTypes.BYTE, 
            4, 
            /* rbits, gbits, bbits, abits */
            5, 
            5, 
            5, 
            1, 
            /* Masks and shifts */
            0x7C00, 
            0x03E0, 
            0x001F, 
            0x8000, 
            10, 
            5, 
            0, 
            15, 
            
        ], 
        //10-----------------------------------------------------------------------
        [
            "PF_R8G8B8", 
            /* Bytes per element */
            /* 24 bit integer -- special*/
            3, 
            /* Flags */
            akra.EPixelFormatFlags.NATIVEENDIAN, 
            /* Component type and count */
            akra.EPixelComponentTypes.BYTE, 
            3, 
            /* rbits, gbits, bbits, abits */
            8, 
            8, 
            8, 
            0, 
            /* Masks and shifts */
            0xFF0000, 
            0x00FF00, 
            0x0000FF, 
            0, 
            16, 
            8, 
            0, 
            0
        ], 
        //11-----------------------------------------------------------------------
        [
            "PF_B8G8R8", 
            /* Bytes per element */
            /* 24 bit integer -- special*/
            3, 
            /* Flags */
            akra.EPixelFormatFlags.NATIVEENDIAN, 
            /* Component type and count */
            akra.EPixelComponentTypes.BYTE, 
            3, 
            /* rbits, gbits, bbits, abits */
            8, 
            8, 
            8, 
            0, 
            /* Masks and shifts */
            0x0000FF, 
            0x00FF00, 
            0xFF0000, 
            0, 
            0, 
            8, 
            16, 
            0
        ], 
        //12-----------------------------------------------------------------------
        [
            "PF_A8R8G8B8", 
            /* Bytes per element */
            4, 
            /* Flags */
            akra.EPixelFormatFlags.HASALPHA | akra.EPixelFormatFlags.NATIVEENDIAN, 
            /* Component type and count */
            akra.EPixelComponentTypes.BYTE, 
            4, 
            /* rbits, gbits, bbits, abits */
            8, 
            8, 
            8, 
            8, 
            /* Masks and shifts */
            0x00FF0000, 
            0x0000FF00, 
            0x000000FF, 
            0xFF000000, 
            16, 
            8, 
            0, 
            24
        ], 
        //13-----------------------------------------------------------------------
        [
            "PF_A8B8G8R8", 
            /* Bytes per element */
            4, 
            /* Flags */
            akra.EPixelFormatFlags.HASALPHA | akra.EPixelFormatFlags.NATIVEENDIAN, 
            /* Component type and count */
            akra.EPixelComponentTypes.BYTE, 
            4, 
            /* rbits, gbits, bbits, abits */
            8, 
            8, 
            8, 
            8, 
            /* Masks and shifts */
            0x000000FF, 
            0x0000FF00, 
            0x00FF0000, 
            0xFF000000, 
            0, 
            8, 
            16, 
            24, 
            
        ], 
        //14-----------------------------------------------------------------------
        [
            "PF_B8G8R8A8", 
            /* Bytes per element */
            4, 
            /* Flags */
            akra.EPixelFormatFlags.HASALPHA | akra.EPixelFormatFlags.NATIVEENDIAN, 
            /* Component type and count */
            akra.EPixelComponentTypes.BYTE, 
            4, 
            /* rbits, gbits, bbits, abits */
            8, 
            8, 
            8, 
            8, 
            /* Masks and shifts */
            0x0000FF00, 
            0x00FF0000, 
            0xFF000000, 
            0x000000FF, 
            8, 
            16, 
            24, 
            0
        ], 
        //15-----------------------------------------------------------------------
        [
            "PF_A2R10G10B10", 
            /* Bytes per element */
            4, 
            /* Flags */
            akra.EPixelFormatFlags.HASALPHA | akra.EPixelFormatFlags.NATIVEENDIAN, 
            /* Component type and count */
            akra.EPixelComponentTypes.BYTE, 
            4, 
            /* rbits, gbits, bbits, abits */
            10, 
            10, 
            10, 
            2, 
            /* Masks and shifts */
            0x3FF00000, 
            0x000FFC00, 
            0x000003FF, 
            0xC0000000, 
            20, 
            10, 
            0, 
            30
        ], 
        //16-----------------------------------------------------------------------
        [
            "PF_A2B10G10R10", 
            /* Bytes per element */
            4, 
            /* Flags */
            akra.EPixelFormatFlags.HASALPHA | akra.EPixelFormatFlags.NATIVEENDIAN, 
            /* Component type and count */
            akra.EPixelComponentTypes.BYTE, 
            4, 
            /* rbits, gbits, bbits, abits */
            10, 
            10, 
            10, 
            2, 
            /* Masks and shifts */
            0x000003FF, 
            0x000FFC00, 
            0x3FF00000, 
            0xC0000000, 
            0, 
            10, 
            20, 
            30
        ], 
        //17-----------------------------------------------------------------------
        [
            "PF_DXT1", 
            /* Bytes per element */
            0, 
            /* Flags */
            akra.EPixelFormatFlags.COMPRESSED | akra.EPixelFormatFlags.HASALPHA, 
            /* Component type and count */
            /* No alpha*/
            akra.EPixelComponentTypes.BYTE, 
            3, 
            /* rbits, gbits, bbits, abits */
            0, 
            0, 
            0, 
            0, 
            /* Masks and shifts */
            0, 
            0, 
            0, 
            0, 
            0, 
            0, 
            0, 
            0
        ], 
        //18-----------------------------------------------------------------------
        [
            "PF_DXT2", 
            /* Bytes per element */
            0, 
            /* Flags */
            akra.EPixelFormatFlags.COMPRESSED | akra.EPixelFormatFlags.HASALPHA, 
            /* Component type and count */
            akra.EPixelComponentTypes.BYTE, 
            4, 
            /* rbits, gbits, bbits, abits */
            0, 
            0, 
            0, 
            0, 
            /* Masks and shifts */
            0, 
            0, 
            0, 
            0, 
            0, 
            0, 
            0, 
            0
        ], 
        //19-----------------------------------------------------------------------
        [
            "PF_DXT3", 
            /* Bytes per element */
            0, 
            /* Flags */
            akra.EPixelFormatFlags.COMPRESSED | akra.EPixelFormatFlags.HASALPHA, 
            /* Component type and count */
            akra.EPixelComponentTypes.BYTE, 
            4, 
            /* rbits, gbits, bbits, abits */
            0, 
            0, 
            0, 
            0, 
            /* Masks and shifts */
            0, 
            0, 
            0, 
            0, 
            0, 
            0, 
            0, 
            0
        ], 
        //20-----------------------------------------------------------------------
        [
            "PF_DXT4", 
            /* Bytes per element */
            0, 
            /* Flags */
            akra.EPixelFormatFlags.COMPRESSED | akra.EPixelFormatFlags.HASALPHA, 
            /* Component type and count */
            akra.EPixelComponentTypes.BYTE, 
            4, 
            /* rbits, gbits, bbits, abits */
            0, 
            0, 
            0, 
            0, 
            /* Masks and shifts */
            0, 
            0, 
            0, 
            0, 
            0, 
            0, 
            0, 
            0
        ], 
        //21-----------------------------------------------------------------------
        [
            "PF_DXT5", 
            /* Bytes per element */
            0, 
            /* Flags */
            akra.EPixelFormatFlags.COMPRESSED | akra.EPixelFormatFlags.HASALPHA, 
            /* Component type and count */
            akra.EPixelComponentTypes.BYTE, 
            4, 
            /* rbits, gbits, bbits, abits */
            0, 
            0, 
            0, 
            0, 
            /* Masks and shifts */
            0, 
            0, 
            0, 
            0, 
            0, 
            0, 
            0, 
            0
        ], 
        //22-----------------------------------------------------------------------
        [
            "PF_FLOAT16_RGB", 
            /* Bytes per element */
            6, 
            /* Flags */
            akra.EPixelFormatFlags.FLOAT, 
            /* Component type and count */
            akra.EPixelComponentTypes.FLOAT16, 
            3, 
            /* rbits, gbits, bbits, abits */
            16, 
            16, 
            16, 
            0, 
            /* Masks and shifts */
            0, 
            0, 
            0, 
            0, 
            0, 
            0, 
            0, 
            0
        ], 
        //23-----------------------------------------------------------------------
        [
            "PF_FLOAT16_RGBA", 
            /* Bytes per element */
            8, 
            /* Flags */
            akra.EPixelFormatFlags.FLOAT | akra.EPixelFormatFlags.HASALPHA, 
            /* Component type and count */
            akra.EPixelComponentTypes.FLOAT16, 
            4, 
            /* rbits, gbits, bbits, abits */
            16, 
            16, 
            16, 
            16, 
            /* Masks and shifts */
            0, 
            0, 
            0, 
            0, 
            0, 
            0, 
            0, 
            0
        ], 
        //24-----------------------------------------------------------------------
        [
            "PF_FLOAT32_RGB", 
            /* Bytes per element */
            12, 
            /* Flags */
            akra.EPixelFormatFlags.FLOAT, 
            /* Component type and count */
            akra.EPixelComponentTypes.FLOAT32, 
            3, 
            /* rbits, gbits, bbits, abits */
            32, 
            32, 
            32, 
            0, 
            /* Masks and shifts */
            0, 
            0, 
            0, 
            0, 
            0, 
            0, 
            0, 
            0
        ], 
        //25-----------------------------------------------------------------------
        [
            "PF_FLOAT32_RGBA", 
            /* Bytes per element */
            16, 
            /* Flags */
            akra.EPixelFormatFlags.FLOAT | akra.EPixelFormatFlags.HASALPHA, 
            /* Component type and count */
            akra.EPixelComponentTypes.FLOAT32, 
            4, 
            /* rbits, gbits, bbits, abits */
            32, 
            32, 
            32, 
            32, 
            /* Masks and shifts */
            0, 
            0, 
            0, 
            0, 
            0, 
            0, 
            0, 
            0
        ], 
        //26-----------------------------------------------------------------------
        [
            "PF_X8R8G8B8", 
            /* Bytes per element */
            4, 
            /* Flags */
            akra.EPixelFormatFlags.NATIVEENDIAN, 
            /* Component type and count */
            akra.EPixelComponentTypes.BYTE, 
            3, 
            /* rbits, gbits, bbits, abits */
            8, 
            8, 
            8, 
            0, 
            /* Masks and shifts */
            0x00FF0000, 
            0x0000FF00, 
            0x000000FF, 
            0xFF000000, 
            16, 
            8, 
            0, 
            24
        ], 
        //27-----------------------------------------------------------------------
        [
            "PF_X8B8G8R8", 
            /* Bytes per element */
            4, 
            /* Flags */
            akra.EPixelFormatFlags.NATIVEENDIAN, 
            /* Component type and count */
            akra.EPixelComponentTypes.BYTE, 
            3, 
            /* rbits, gbits, bbits, abits */
            8, 
            8, 
            8, 
            0, 
            /* Masks and shifts */
            0x000000FF, 
            0x0000FF00, 
            0x00FF0000, 
            0xFF000000, 
            0, 
            8, 
            16, 
            24
        ], 
        //28-----------------------------------------------------------------------
        [
            "PF_R8G8B8A8", 
            /* Bytes per element */
            4, 
            /* Flags */
            akra.EPixelFormatFlags.HASALPHA | akra.EPixelFormatFlags.NATIVEENDIAN, 
            /* Component type and count */
            akra.EPixelComponentTypes.BYTE, 
            4, 
            /* rbits, gbits, bbits, abits */
            8, 
            8, 
            8, 
            8, 
            /* Masks and shifts */
            0xFF000000, 
            0x00FF0000, 
            0x0000FF00, 
            0x000000FF, 
            24, 
            16, 
            8, 
            0
        ], 
        //29-----------------------------------------------------------------------
        [
            "PF_FLOAT32_DEPTH", 
            /* Bytes per element */
            4, 
            /* Flags */
            akra.EPixelFormatFlags.DEPTH, 
            /* Component type and count */
            /* ?*/
            akra.EPixelComponentTypes.FLOAT32, 
            1, 
            /* rbits, gbits, bbits, abits */
            0, 
            0, 
            0, 
            0, 
            /* Masks and shifts */
            0, 
            0, 
            0, 
            0, 
            0, 
            0, 
            0, 
            0
        ], 
        //30-----------------------------------------------------------------------
        [
            "PF_SHORT_RGBA", 
            /* Bytes per element */
            8, 
            /* Flags */
            akra.EPixelFormatFlags.HASALPHA, 
            /* Component type and count */
            akra.EPixelComponentTypes.SHORT, 
            4, 
            /* rbits, gbits, bbits, abits */
            16, 
            16, 
            16, 
            16, 
            /* Masks and shifts */
            0, 
            0, 
            0, 
            0, 
            0, 
            0, 
            0, 
            0
        ], 
        //31-----------------------------------------------------------------------
        [
            "PF_R3G3B2", 
            /* Bytes per element */
            1, 
            /* Flags */
            akra.EPixelFormatFlags.NATIVEENDIAN, 
            /* Component type and count */
            akra.EPixelComponentTypes.BYTE, 
            3, 
            /* rbits, gbits, bbits, abits */
            3, 
            3, 
            2, 
            0, 
            /* Masks and shifts */
            0xE0, 
            0x1C, 
            0x03, 
            0, 
            5, 
            2, 
            0, 
            0
        ], 
        //32-----------------------------------------------------------------------
        [
            "PF_FLOAT16_R", 
            /* Bytes per element */
            2, 
            /* Flags */
            akra.EPixelFormatFlags.FLOAT, 
            /* Component type and count */
            akra.EPixelComponentTypes.FLOAT16, 
            1, 
            /* rbits, gbits, bbits, abits */
            16, 
            0, 
            0, 
            0, 
            /* Masks and shifts */
            0, 
            0, 
            0, 
            0, 
            0, 
            0, 
            0, 
            0
        ], 
        //33-----------------------------------------------------------------------
        [
            "PF_FLOAT32_R", 
            /* Bytes per element */
            4, 
            /* Flags */
            akra.EPixelFormatFlags.FLOAT, 
            /* Component type and count */
            akra.EPixelComponentTypes.FLOAT32, 
            1, 
            /* rbits, gbits, bbits, abits */
            32, 
            0, 
            0, 
            0, 
            /* Masks and shifts */
            0, 
            0, 
            0, 
            0, 
            0, 
            0, 
            0, 
            0
        ], 
        //34-----------------------------------------------------------------------
        [
            "PF_SHORT_GR", 
            /* Bytes per element */
            4, 
            /* Flags */
            akra.EPixelFormatFlags.NATIVEENDIAN, 
            /* Component type and count */
            akra.EPixelComponentTypes.SHORT, 
            2, 
            /* rbits, gbits, bbits, abits */
            16, 
            16, 
            0, 
            0, 
            /* Masks and shifts */
            0x0000FFFF, 
            0xFFFF0000, 
            0, 
            0, 
            0, 
            16, 
            0, 
            0
        ], 
        //35-----------------------------------------------------------------------
        [
            "PF_FLOAT16_GR", 
            /* Bytes per element */
            4, 
            /* Flags */
            akra.EPixelFormatFlags.FLOAT, 
            /* Component type and count */
            akra.EPixelComponentTypes.FLOAT16, 
            2, 
            /* rbits, gbits, bbits, abits */
            16, 
            16, 
            0, 
            0, 
            /* Masks and shifts */
            0, 
            0, 
            0, 
            0, 
            0, 
            0, 
            0, 
            0
        ], 
        //36-----------------------------------------------------------------------
        [
            "PF_FLOAT32_GR", 
            /* Bytes per element */
            8, 
            /* Flags */
            akra.EPixelFormatFlags.FLOAT, 
            /* Component type and count */
            akra.EPixelComponentTypes.FLOAT32, 
            2, 
            /* rbits, gbits, bbits, abits */
            32, 
            32, 
            0, 
            0, 
            /* Masks and shifts */
            0, 
            0, 
            0, 
            0, 
            0, 
            0, 
            0, 
            0
        ], 
        //37-----------------------------------------------------------------------
        [
            "PF_SHORT_RGB", 
            /* Bytes per element */
            6, 
            /* Flags */
            0, 
            /* Component type and count */
            akra.EPixelComponentTypes.SHORT, 
            3, 
            /* rbits, gbits, bbits, abits */
            16, 
            16, 
            16, 
            0, 
            /* Masks and shifts */
            0, 
            0, 
            0, 
            0, 
            0, 
            0, 
            0, 
            0
        ], 
        //38-----------------------------------------------------------------------
        [
            "PF_PVRTC_RGB2", 
            /* Bytes per element */
            0, 
            /* Flags */
            akra.EPixelFormatFlags.COMPRESSED, 
            /* Component type and count */
            akra.EPixelComponentTypes.BYTE, 
            3, 
            /* rbits, gbits, bbits, abits */
            0, 
            0, 
            0, 
            0, 
            /* Masks and shifts */
            0, 
            0, 
            0, 
            0, 
            0, 
            0, 
            0, 
            0
        ], 
        //39-----------------------------------------------------------------------
        [
            "PF_PVRTC_RGBA2", 
            /* Bytes per element */
            0, 
            /* Flags */
            akra.EPixelFormatFlags.COMPRESSED | akra.EPixelFormatFlags.HASALPHA, 
            /* Component type and count */
            akra.EPixelComponentTypes.BYTE, 
            4, 
            /* rbits, gbits, bbits, abits */
            0, 
            0, 
            0, 
            0, 
            /* Masks and shifts */
            0, 
            0, 
            0, 
            0, 
            0, 
            0, 
            0, 
            0
        ], 
        //40-----------------------------------------------------------------------
        [
            "PF_PVRTC_RGB4", 
            /* Bytes per element */
            0, 
            /* Flags */
            akra.EPixelFormatFlags.COMPRESSED, 
            /* Component type and count */
            akra.EPixelComponentTypes.BYTE, 
            3, 
            /* rbits, gbits, bbits, abits */
            0, 
            0, 
            0, 
            0, 
            /* Masks and shifts */
            0, 
            0, 
            0, 
            0, 
            0, 
            0, 
            0, 
            0
        ], 
        //41-----------------------------------------------------------------------
        [
            "PF_PVRTC_RGBA4", 
            /* Bytes per element */
            0, 
            /* Flags */
            akra.EPixelFormatFlags.COMPRESSED | akra.EPixelFormatFlags.HASALPHA, 
            /* Component type and count */
            akra.EPixelComponentTypes.BYTE, 
            4, 
            /* rbits, gbits, bbits, abits */
            0, 
            0, 
            0, 
            0, 
            /* Masks and shifts */
            0, 
            0, 
            0, 
            0, 
            0, 
            0, 
            0, 
            0
        ], 
        //42-----------------------------------------------------------------------
        [
            "PF_R8", 
            /* Bytes per element */
            1, 
            /* Flags */
            akra.EPixelFormatFlags.NATIVEENDIAN, 
            /* Component type and count */
            akra.EPixelComponentTypes.BYTE, 
            1, 
            /* rbits, gbits, bbits, abits */
            8, 
            0, 
            0, 
            0, 
            /* Masks and shifts */
            0xFF0000, 
            0, 
            0, 
            0, 
            0, 
            0, 
            0, 
            0
        ], 
        //43-----------------------------------------------------------------------
        [
            "PF_RG8", 
            /* Bytes per element */
            2, 
            /* Flags */
            akra.EPixelFormatFlags.NATIVEENDIAN, 
            /* Component type and count */
            akra.EPixelComponentTypes.BYTE, 
            2, 
            /* rbits, gbits, bbits, abits */
            8, 
            8, 
            0, 
            0, 
            /* Masks and shifts */
            0xFF0000, 
            0x00FF00, 
            0, 
            0, 
            8, 
            0, 
            0, 
            0
        ], 
        //44-----------------------------------------------------------------------
        [
            "PF_DEPTH_BYTE", 
            /* Bytes per element */
            1, 
            /* Flags */
            akra.EPixelFormatFlags.DEPTH, 
            /* Component type and count */
            akra.EPixelComponentTypes.BYTE, 
            1, 
            /* rbits, gbits, bbits, abits */
            8, 
            0, 
            0, 
            0, 
            /* Masks and shifts */
            0xFF, 
            0, 
            0, 
            0, 
            0, 
            0, 
            0, 
            0
        ], 
        //45-----------------------------------------------------------------------
        [
            "PF_DEPTH_SHORT", 
            /* Bytes per element */
            2, 
            /* Flags */
            akra.EPixelFormatFlags.DEPTH, 
            /* Component type and count */
            akra.EPixelComponentTypes.SHORT, 
            1, 
            /* rbits, gbits, bbits, abits */
            16, 
            0, 
            0, 
            0, 
            /* Masks and shifts */
            0xFFFF, 
            0, 
            0, 
            0, 
            0, 
            0, 
            0, 
            0
        ], 
        //46-----------------------------------------------------------------------
        [
            "PF_DEPTH_INT", 
            /* Bytes per element */
            4, 
            /* Flags */
            akra.EPixelFormatFlags.DEPTH, 
            /* Component type and count */
            akra.EPixelComponentTypes.INT, 
            1, 
            /* rbits, gbits, bbits, abits */
            32, 
            0, 
            0, 
            0, 
            /* Masks and shifts */
            0xFFFFFFFF, 
            0, 
            0, 
            0, 
            0, 
            0, 
            0, 
            0
        ], 
        //47-----------------------------------------------------------------------
        [
            "PF_DEPTH24STENCIL8", 
            /* Bytes per element */
            4, 
            /* Flags */
            akra.EPixelFormatFlags.DEPTH | akra.EPixelFormatFlags.STENCIL, 
            /* Component type and count */
            akra.EPixelComponentTypes.INT, 
            1, 
            /* rbits, gbits, bbits, abits */
            24, 
            8, 
            0, 
            0, 
            /* Masks and shifts */
            0x00FFFFFF, 
            0xFF000000, 
            0, 
            0, 
            0, 
            24, 
            0, 
            0
        ], 
        
    ]);
    var _pColorValue = {
        r: 0.,
        g: 0.,
        b: 0.,
        a: 1.
    };
    (function (pixelUtil) {
        /** @inline */function getDescriptionFor(eFmt) {
            var ord = eFmt;
 {
                akra.logger.setSourceLocation("pixelUtil/pixelUtil.ts", 736);
                akra.logger.assert(ord >= 0 && ord < akra.EPixelFormats.TOTAL, "getDescriptionFor:" + ord);
            }
            ;
            return pPixelFormats[ord];
        }
        pixelUtil.getDescriptionFor = getDescriptionFor;
        /** Returns the size in bytes of an element of the given pixel format.
        @return
        The size in bytes of an element. See Remarks.
        @remarks
        Passing PF_UNKNOWN will result in returning a size of 0 bytes.
        */
        /** @inline */function getNumElemBytes(eFormat) {
            return /*not inlined, because supportes only single statement functions(cur. st. count: 5)*/getDescriptionFor(eFormat).elemBytes;
        }
        pixelUtil.getNumElemBytes = getNumElemBytes;
        /** Returns the size in bits of an element of the given pixel format.
        @return
        The size in bits of an element. See Remarks.
        @remarks
        Passing PF_UNKNOWN will result in returning a size of 0 bits.
        */
        /** @inline */function getNumElemBits(eFormat) {
            return /*not inlined, because supportes only single statement functions(cur. st. count: 5)*/getDescriptionFor(eFormat).elemBytes * 8;
        }
        pixelUtil.getNumElemBits = getNumElemBits;
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
        function getMemorySize(iWidth, iHeight, iDepth, eFormat) {
            if ((((/*not inlined, because supportes only single statement functions(cur. st. count: 5)*/getDescriptionFor(((eFormat))).flags) & /*checked (origin: akra)>>*/akra.EPixelFormatFlags.COMPRESSED) > 0)) {
                switch(eFormat) {
                    case // DXT formats work by dividing the image into 4x4 blocks, then encoding each
                    // 4x4 block with a certain number of bytes.
                    akra.EPixelFormats.DXT1:
                        return Math.floor((iWidth + 3) / 4) * Math.floor((iHeight + 3) / 4) * 8 * iDepth;
                    case akra.EPixelFormats.DXT2:
                    case akra.EPixelFormats.DXT3:
                    case akra.EPixelFormats.DXT4:
                    case akra.EPixelFormats.DXT5:
                        return Math.floor((iWidth + 3) / 4) * Math.floor((iHeight + 3) / 4) * 16 * iDepth;
                        // Size calculations from the PVRTC OpenGL extension spec
                        // http://www.khronos.org/registry/gles/extensions/IMG/IMG_texture_compression_pvrtc.txt
                        // Basically, 32 bytes is the minimum texture size.  Smaller textures are padded up to 32 bytes
                                            case akra.EPixelFormats.PVRTC_RGB2:
                    case akra.EPixelFormats.PVRTC_RGBA2:
 {
                            akra.logger.setSourceLocation("pixelUtil/pixelUtil.ts", 798);
                            akra.logger.assert(iDepth == 1);
                        }
                        ;
                        return (akra.math.max(iWidth, 16) * akra.math.max(iHeight, 8) * 2 + 7) / 8;
                    case akra.EPixelFormats.PVRTC_RGB4:
                    case akra.EPixelFormats.PVRTC_RGBA4:
 {
                            akra.logger.setSourceLocation("pixelUtil/pixelUtil.ts", 802);
                            akra.logger.assert(iDepth == 1);
                        }
                        ;
                        return (akra.math.max(iWidth, 8) * akra.math.max(iHeight, 8) * 4 + 7) / 8;
                    default:
 {
                            akra.logger.setSourceLocation("pixelUtil/pixelUtil.ts", 805);
                            akra.logger.error("Invalid compressed pixel format", "PixelUtil::getMemorySize");
                        }
                        ;
                }
            } else {
                return iWidth * iHeight * iDepth * (/*not inlined, because supportes only single statement functions(cur. st. count: 5)*/getDescriptionFor((eFormat)).elemBytes);
            }
        }
        pixelUtil.getMemorySize = getMemorySize;
        /** Returns the property flags for this pixel format
        @return
        A bitfield combination of PFF_HASALPHA, PFF_ISCOMPRESSED,
        PFF_FLOAT, PFF_DEPTH, PFF_NATIVEENDIAN, PFF_LUMINANCE
        @remarks
        This replaces the separate functions for formatHasAlpha, formatIsFloat, ...
        */
        /** @inline */function getFlags(eFormat) {
            return /*not inlined, because supportes only single statement functions(cur. st. count: 5)*/getDescriptionFor(eFormat).flags;
        }
        pixelUtil.getFlags = getFlags;
        /** Shortcut method to determine if the format has an alpha component */
        /** @inline */function hasAlpha(eFormat) {
            return ((/*not inlined, because supportes only single statement functions(cur. st. count: 5)*/getDescriptionFor((eFormat)).flags) & akra.EPixelFormatFlags.HASALPHA) > 0;
        }
        pixelUtil.hasAlpha = hasAlpha;
        /** Shortcut method to determine if the format is floating point */
        /** @inline */function isFloatingPoint(eFormat) {
            return ((/*not inlined, because supportes only single statement functions(cur. st. count: 5)*/getDescriptionFor((eFormat)).flags) & akra.EPixelFormatFlags.FLOAT) > 0;
        }
        pixelUtil.isFloatingPoint = isFloatingPoint;
        /** Shortcut method to determine if the format is compressed */
        /** @inline */function isCompressed(eFormat) {
            return ((/*not inlined, because supportes only single statement functions(cur. st. count: 5)*/getDescriptionFor((eFormat)).flags) & akra.EPixelFormatFlags.COMPRESSED) > 0;
        }
        pixelUtil.isCompressed = isCompressed;
        /** Shortcut method to determine if the format is a depth format. */
        /** @inline */function isDepth(eFormat) {
            return ((/*not inlined, because supportes only single statement functions(cur. st. count: 5)*/getDescriptionFor((eFormat)).flags) & akra.EPixelFormatFlags.DEPTH) > 0;
        }
        pixelUtil.isDepth = isDepth;
        /** Shortcut method to determine if the format is in native endian format. */
        /** @inline */function isNativeEndian(eFormat) {
            return ((/*not inlined, because supportes only single statement functions(cur. st. count: 5)*/getDescriptionFor((eFormat)).flags) & akra.EPixelFormatFlags.NATIVEENDIAN) > 0;
        }
        pixelUtil.isNativeEndian = isNativeEndian;
        /** Shortcut method to determine if the format is a luminance format. */
        /** @inline */function isLuminance(eFormat) {
            return ((/*not inlined, because supportes only single statement functions(cur. st. count: 5)*/getDescriptionFor((eFormat)).flags) & akra.EPixelFormatFlags.LUMINANCE) > 0;
        }
        pixelUtil.isLuminance = isLuminance;
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
        function isValidExtent(iWidth, iHeight, iDepth, eFormat) {
            if ((((/*not inlined, because supportes only single statement functions(cur. st. count: 5)*/getDescriptionFor(((eFormat))).flags) & /*checked (origin: akra)>>*/akra.EPixelFormatFlags.COMPRESSED) > 0)) {
                switch(eFormat) {
                    case akra.EPixelFormats.DXT1:
                    case akra.EPixelFormats.DXT2:
                    case akra.EPixelFormats.DXT3:
                    case akra.EPixelFormats.DXT4:
                    case akra.EPixelFormats.DXT5:
                        return ((iWidth & 3) == 0 && (iHeight & 3) == 0 && iDepth == 1);
                    default:
                        return true;
                }
            } else {
                return true;
            }
        }
        pixelUtil.isValidExtent = isValidExtent;
        /** Gives the number of bits (RGBA) for a format. See remarks.
        @remarks      For non-colour formats (dxt, depth) this returns [0,0,0,0].
        */
        function getBitDepths(eFormat) {
            /**@const*/ var des = /*not inlined, because supportes only single statement functions(cur. st. count: 5)*/getDescriptionFor(eFormat);
            var rgba = [];
            rgba[0] = des.rbits;
            rgba[1] = des.gbits;
            rgba[2] = des.bbits;
            rgba[3] = des.abits;
            return rgba;
        }
        pixelUtil.getBitDepths = getBitDepths;
        /** Gives the masks for the R, G, B and A component
        @note			Only valid for native endian formats
        */
        function getBitMasks(eFormat) {
            /**@const*/ var des = /*not inlined, because supportes only single statement functions(cur. st. count: 5)*/getDescriptionFor(eFormat);
            var rgba = [];
            rgba[0] = des.rmask;
            rgba[1] = des.gmask;
            rgba[2] = des.bmask;
            rgba[3] = des.amask;
            return rgba;
        }
        pixelUtil.getBitMasks = getBitMasks;
        /** Gives the bit shifts for R, G, B and A component
        @note			Only valid for native endian formats
        */
        function getBitShifts(eFormat) {
            /**@const*/ var des = /*not inlined, because supportes only single statement functions(cur. st. count: 5)*/getDescriptionFor(eFormat);
            var rgba = [];
            rgba[0] = des.rshift;
            rgba[1] = des.gshift;
            rgba[2] = des.bshift;
            rgba[3] = des.ashift;
            return rgba;
        }
        pixelUtil.getBitShifts = getBitShifts;
        /** Gets the name of an image format
        */
        /** @inline */function getFormatName(eSrcFormat) {
            return /*not inlined, because supportes only single statement functions(cur. st. count: 5)*/getDescriptionFor(eSrcFormat).name;
        }
        pixelUtil.getFormatName = getFormatName;
        /** Returns wether the format can be packed or unpacked with the packColour()
        and unpackColour() functions. This is generally not true for compressed and
        depth formats as they are special. It can only be true for formats with a
        fixed element size.
        @return
        true if yes, otherwise false
        */
        function isAccessible(eSrcFormat) {
            if (eSrcFormat == akra.EPixelFormats.UNKNOWN) {
                return false;
            }
            var flags = (/*not inlined, because supportes only single statement functions(cur. st. count: 5)*/getDescriptionFor((eSrcFormat)).flags);
            return !((flags & akra.EPixelFormatFlags.COMPRESSED) || (flags & akra.EPixelFormatFlags.DEPTH));
        }
        pixelUtil.isAccessible = isAccessible;
        /** Returns the component type for a certain pixel format. Returns PCT_BYTE
        in case there is no clear component type like with compressed formats.
        This is one of PCT_BYTE, PCT_SHORT, PCT_FLOAT16, PCT_FLOAT32.
        */
        /** @inline */function getComponentType(eFmt) {
            return /*not inlined, because supportes only single statement functions(cur. st. count: 5)*/getDescriptionFor(eFmt).componentType;
        }
        pixelUtil.getComponentType = getComponentType;
        /** Returns the component count for a certain pixel format. Returns 3(no alpha) or
        4 (has alpha) in case there is no clear component type like with compressed formats.
        */
        /** @inline */function getComponentCount(eFmt) {
            return /*not inlined, because supportes only single statement functions(cur. st. count: 5)*/getDescriptionFor(eFmt).componentCount;
        }
        pixelUtil.getComponentCount = getComponentCount;
        /** @inline */function getComponentTypeBits(eFormat) {
            var eType = (/*not inlined, because supportes only single statement functions(cur. st. count: 5)*/getDescriptionFor((eFormat)).componentType);
            switch(eType) {
                case /*Byte per component (8 bit fixed 0.0..1.0)*/
                akra.EPixelComponentTypes.BYTE:
                    return 8;
                    /*Short per component (16 bit fixed 0.0..1.0))*/
                                    case akra.EPixelComponentTypes.SHORT:
                    return 16;
                    /*16 bit float per component*/
                                    case akra.EPixelComponentTypes.FLOAT16:
                    return 16;
                    /*32 bit float per component*/
                                    case akra.EPixelComponentTypes.FLOAT32:
                    return 32;
            }
            return 0;
        }
        pixelUtil.getComponentTypeBits = getComponentTypeBits;
        /** Gets the format from given name.
        @param  name            The string of format name
        @param  accessibleOnly  If true, non-accessible format will treat as invalid format,
        otherwise, all supported format are valid.
        @param  caseSensitive   Should be set true if string match should use case sensitivity.
        @return                The format match the format name, or PF_UNKNOWN if is invalid name.
        */
        function getFormatFromName(sName, isAccessibleOnly, isCaseSensitive) {
            if (typeof isAccessibleOnly === "undefined") { isAccessibleOnly = false; }
            if (typeof isCaseSensitive === "undefined") { isCaseSensitive = false; }
            var tmp = sName;
            if (!isCaseSensitive) {
                // We are stored upper-case format names.
                tmp = tmp.toUpperCase();
            }
            for(var i = 0; i < akra.EPixelFormats.TOTAL; ++i) {
                var ePf = i;
                if (!isAccessibleOnly || isAccessible(ePf)) {
                    if (tmp == (/*not inlined, because supportes only single statement functions(cur. st. count: 5)*/getDescriptionFor((ePf)).name)) {
                        return ePf;
                    }
                }
            }
            return akra.EPixelFormats.UNKNOWN;
        }
        pixelUtil.getFormatFromName = getFormatFromName;
        /** Gets the BNF expression of the pixel-formats.
        @note                   The string returned by this function is intended to be used as a BNF expression
        to work with Compiler2Pass.
        @param  accessibleOnly  If true, only accessible pixel format will take into account, otherwise all
        pixel formats list in EPixelFormats enumeration will being returned.
        @return                A string contains the BNF expression.
        */
        function getBNFExpressionOfPixelFormats(isAccessibleOnly) {
            if (typeof isAccessibleOnly === "undefined") { isAccessibleOnly = false; }
            // Collect format names sorted by length, it's required by BNF compiler
            // that similar tokens need longer ones comes first.
            var formatNames = new Array();
            for(var i = 0; i < akra.EPixelFormats.TOTAL; ++i) {
                var ePf = (i);
                if (!isAccessibleOnly || isAccessible(ePf)) {
                    var formatName = (/*not inlined, because supportes only single statement functions(cur. st. count: 5)*/getDescriptionFor((ePf)).name);
                    formatNames.push({
                        first: formatName.length,
                        second: formatName
                    });
                }
            }
            // Populate the BNF expression in reverse order
            var result = "";
            // Note: Stupid M$ VC7.1 can't dealing operator!= with FormatNameMap::const_reverse_iterator.
            for(var j in formatNames) {
                if (!((result).length == 0)) {
                    result += " | ";
                }
                result += "'" + formatNames[j] + "'";
            }
            return result;
        }
        pixelUtil.getBNFExpressionOfPixelFormats = getBNFExpressionOfPixelFormats;
        /** Returns the similar format but acoording with given bit depths.
        @param fmt      The original foamt.
        @param integerBits Preferred bit depth (pixel bits) for integer pixel format.
        Available values: 0, 16 and 32, where 0 (the default) means as it is.
        @param floatBits Preferred bit depth (channel bits) for float pixel format.
        Available values: 0, 16 and 32, where 0 (the default) means as it is.
        @return        The format that similar original format with bit depth according
        with preferred bit depth, or original format if no conversion occurring.
        */
        function getFormatForBitDepths(eFmt, iIntegerBits, iFloatBits) {
            switch(iIntegerBits) {
                case 16:
                    switch(eFmt) {
                        case akra.EPixelFormats.R8G8B8:
                        case akra.EPixelFormats.X8R8G8B8:
                            return akra.EPixelFormats.R5G6B5;
                        case akra.EPixelFormats.B8G8R8:
                        case akra.EPixelFormats.X8B8G8R8:
                            return akra.EPixelFormats.B5G6R5;
                        case akra.EPixelFormats.A8R8G8B8:
                        case akra.EPixelFormats.R8G8B8A8:
                        case akra.EPixelFormats.A8B8G8R8:
                        case akra.EPixelFormats.B8G8R8A8:
                            return akra.EPixelFormats.A4R4G4B4;
                        case akra.EPixelFormats.A2R10G10B10:
                        case akra.EPixelFormats.A2B10G10R10:
                            return akra.EPixelFormats.A1R5G5B5;
                        default:
                            // use original image format
                            break;
                    }
                    break;
                case 32:
                    switch(eFmt) {
                        case akra.EPixelFormats.R5G6B5:
                            return akra.EPixelFormats.X8R8G8B8;
                        case akra.EPixelFormats.B5G6R5:
                            return akra.EPixelFormats.X8B8G8R8;
                        case akra.EPixelFormats.A4R4G4B4:
                            return akra.EPixelFormats.A8R8G8B8;
                        case akra.EPixelFormats.A1R5G5B5:
                            return akra.EPixelFormats.A2R10G10B10;
                        default:
                            // use original image format
                            break;
                    }
                    break;
                default:
                    // use original image format
                    break;
            }
            switch(iFloatBits) {
                case 16:
                    switch(eFmt) {
                        case akra.EPixelFormats.FLOAT32_R:
                            return akra.EPixelFormats.FLOAT16_R;
                        case akra.EPixelFormats.FLOAT32_RGB:
                            return akra.EPixelFormats.FLOAT16_RGB;
                        case akra.EPixelFormats.FLOAT32_RGBA:
                            return akra.EPixelFormats.FLOAT16_RGBA;
                        default:
                            // use original image format
                            break;
                    }
                    break;
                case 32:
                    switch(eFmt) {
                        case akra.EPixelFormats.FLOAT16_R:
                            return akra.EPixelFormats.FLOAT32_R;
                        case akra.EPixelFormats.FLOAT16_RGB:
                            return akra.EPixelFormats.FLOAT32_RGB;
                        case akra.EPixelFormats.FLOAT16_RGBA:
                            return akra.EPixelFormats.FLOAT32_RGBA;
                        default:
                            // use original image format
                            break;
                    }
                    break;
                default:
                    // use original image format
                    break;
            }
            return eFmt;
        }
        pixelUtil.getFormatForBitDepths = getFormatForBitDepths;
        /** Pack a colour value to memory
        @param colour	The colour
        @param pf		Pixelformat in which to write the colour
        @param dest		Destination memory location
        */
        /** @inline */function packColour(cColour, ePf, pDest) {
            packColourFloat(cColour.r, cColour.g, cColour.b, cColour.a, ePf, pDest);
        }
        pixelUtil.packColour = packColour;
        /** Pack a colour value to memory
        @param r,g,b,a	The four colour components, range 0x00 to 0xFF
        @param pf		Pixelformat in which to write the colour
        @param dest		Destination memory location
        */
        function packColourUint(r, g, b, a, ePf, pDest) {
            // if (arguments.length < 4) {
            // 	var cColour: IColor = arguments[0];
            // 	packColour(cColour.r, cColour.g, cColour.b, cColour.a, ePf, pDest);
            // 	return;
            // }
            /**@const*/ var des = /*not inlined, because supportes only single statement functions(cur. st. count: 5)*/getDescriptionFor(ePf);
            if (des.flags & akra.EPixelFormatFlags.NATIVEENDIAN) {
                // Shortcut for integer formats packing
                var value = ((/*not inlined, because supportes only single statement functions(cur. st. count: 3)*/akra.bf.fixedToFixed(r, 8, des.rbits) << des.rshift) & des.rmask) | ((/*not inlined, because supportes only single statement functions(cur. st. count: 3)*/akra.bf.fixedToFixed(g, 8, des.gbits) << des.gshift) & des.gmask) | ((/*not inlined, because supportes only single statement functions(cur. st. count: 3)*/akra.bf.fixedToFixed(b, 8, des.bbits) << des.bshift) & des.bmask) | ((/*not inlined, because supportes only single statement functions(cur. st. count: 3)*/akra.bf.fixedToFixed(a, 8, des.abits) << des.ashift) & des.amask);
                // And write to memory
                /*not inlined, because first statement is not return/call/dot(cur st.: Switch)*/akra.bf.intWrite(pDest, des.elemBytes, value);
            } else {
                // Convert to float
                packColourFloat(r / 255.0, g / 255.0, b / 255.0, a / 255.0, ePf, pDest);
            }
        }
        pixelUtil.packColourUint = packColourUint;
        /** Pack a colour value to memory
        @param r,g,b,a	The four colour components, range 0.0f to 1.0f
        (an exception to this case exists for floating point pixel
        formats, which don't clamp to 0.0f..1.0f)
        @param pf		Pixelformat in which to write the colour
        @param dest		Destination memory location
        */
        function packColourFloat(r, g, b, a, ePf, pDest) {
            // Catch-it-all here
            /**@const*/ var des = /*not inlined, because supportes only single statement functions(cur. st. count: 5)*/getDescriptionFor(ePf);
            if (des.flags & akra.EPixelFormatFlags.NATIVEENDIAN) {
                // Do the packing
                //std::cerr << dest << " " << r << " " << g <<  " " << b << " " << a << std::endl;
                /**@const*/ var value = ((/*not inlined, because first statement is not return/call/dot(cur st.: If)*/akra.bf.floatToFixed(r, des.rbits) << des.rshift) & des.rmask) | ((/*not inlined, because first statement is not return/call/dot(cur st.: If)*/akra.bf.floatToFixed(g, des.gbits) << des.gshift) & des.gmask) | ((/*not inlined, because first statement is not return/call/dot(cur st.: If)*/akra.bf.floatToFixed(b, des.bbits) << des.bshift) & des.bmask) | ((/*not inlined, because first statement is not return/call/dot(cur st.: If)*/akra.bf.floatToFixed(a, des.abits) << des.ashift) & des.amask);
                // And write to memory
                /*not inlined, because first statement is not return/call/dot(cur st.: Switch)*/akra.bf.intWrite(pDest, des.elemBytes, value);
            } else {
                switch(ePf) {
                    case akra.EPixelFormats.FLOAT32_R:
                        (new Float32Array(pDest.buffer, pDest.byteOffset, 1))[0] = r;
                        break;
                    case akra.EPixelFormats.FLOAT32_GR:
                        (new Float32Array(pDest.buffer, pDest.byteOffset, 1))[0] = g;
                        (new Float32Array(pDest.buffer, pDest.byteOffset, 2))[1] = r;
                        break;
                    case akra.EPixelFormats.FLOAT32_RGB:
                        (new Float32Array(pDest.buffer, pDest.byteOffset, 1))[0] = r;
                        (new Float32Array(pDest.buffer, pDest.byteOffset, 2))[1] = g;
                        (new Float32Array(pDest.buffer, pDest.byteOffset, 3))[2] = b;
                        break;
                    case akra.EPixelFormats.FLOAT32_RGBA:
                        (new Float32Array(pDest.buffer, pDest.byteOffset, 1))[0] = r;
                        (new Float32Array(pDest.buffer, pDest.byteOffset, 2))[1] = g;
                        (new Float32Array(pDest.buffer, pDest.byteOffset, 3))[2] = b;
                        (new Float32Array(pDest.buffer, pDest.byteOffset, 4))[3] = a;
                        break;
                    case akra.EPixelFormats.FLOAT16_R:
                        (new Uint16Array(pDest.buffer, pDest.byteOffset, 1))[0] = /*not inlined, because supportes only single statement functions(cur. st. count: 3)*/akra.bf.floatToHalf(r);
                        break;
                    case akra.EPixelFormats.FLOAT16_GR:
                        (new Uint16Array(pDest.buffer, pDest.byteOffset, 1))[0] = /*not inlined, because supportes only single statement functions(cur. st. count: 3)*/akra.bf.floatToHalf(g);
                        (new Uint16Array(pDest.buffer, pDest.byteOffset, 2))[1] = /*not inlined, because supportes only single statement functions(cur. st. count: 3)*/akra.bf.floatToHalf(r);
                        break;
                    case akra.EPixelFormats.FLOAT16_RGB:
                        (new Uint16Array(pDest.buffer, pDest.byteOffset, 1))[0] = /*not inlined, because supportes only single statement functions(cur. st. count: 3)*/akra.bf.floatToHalf(r);
                        (new Uint16Array(pDest.buffer, pDest.byteOffset, 2))[1] = /*not inlined, because supportes only single statement functions(cur. st. count: 3)*/akra.bf.floatToHalf(g);
                        (new Uint16Array(pDest.buffer, pDest.byteOffset, 3))[2] = /*not inlined, because supportes only single statement functions(cur. st. count: 3)*/akra.bf.floatToHalf(b);
                        break;
                    case akra.EPixelFormats.FLOAT16_RGBA:
                        (new Uint16Array(pDest.buffer, pDest.byteOffset, 1))[0] = /*not inlined, because supportes only single statement functions(cur. st. count: 3)*/akra.bf.floatToHalf(r);
                        (new Uint16Array(pDest.buffer, pDest.byteOffset, 2))[1] = /*not inlined, because supportes only single statement functions(cur. st. count: 3)*/akra.bf.floatToHalf(g);
                        (new Uint16Array(pDest.buffer, pDest.byteOffset, 3))[2] = /*not inlined, because supportes only single statement functions(cur. st. count: 3)*/akra.bf.floatToHalf(b);
                        (new Uint16Array(pDest.buffer, pDest.byteOffset, 4))[3] = /*not inlined, because supportes only single statement functions(cur. st. count: 3)*/akra.bf.floatToHalf(a);
                        break;
                    case akra.EPixelFormats.SHORT_RGB:
                        (new Uint16Array(pDest.buffer, pDest.byteOffset, 1))[0] = /*not inlined, because first statement is not return/call/dot(cur st.: If)*/akra.bf.floatToFixed(r, 16);
                        (new Uint16Array(pDest.buffer, pDest.byteOffset, 2))[1] = /*not inlined, because first statement is not return/call/dot(cur st.: If)*/akra.bf.floatToFixed(g, 16);
                        (new Uint16Array(pDest.buffer, pDest.byteOffset, 3))[2] = /*not inlined, because first statement is not return/call/dot(cur st.: If)*/akra.bf.floatToFixed(b, 16);
                        break;
                    case akra.EPixelFormats.SHORT_RGBA:
                        (new Uint16Array(pDest.buffer, pDest.byteOffset, 1))[0] = /*not inlined, because first statement is not return/call/dot(cur st.: If)*/akra.bf.floatToFixed(r, 16);
                        (new Uint16Array(pDest.buffer, pDest.byteOffset, 2))[1] = /*not inlined, because first statement is not return/call/dot(cur st.: If)*/akra.bf.floatToFixed(g, 16);
                        (new Uint16Array(pDest.buffer, pDest.byteOffset, 3))[2] = /*not inlined, because first statement is not return/call/dot(cur st.: If)*/akra.bf.floatToFixed(b, 16);
                        (new Uint16Array(pDest.buffer, pDest.byteOffset, 4))[3] = /*not inlined, because first statement is not return/call/dot(cur st.: If)*/akra.bf.floatToFixed(a, 16);
                        break;
                    case akra.EPixelFormats.BYTE_LA:
                        pDest[0] = /*not inlined, because first statement is not return/call/dot(cur st.: If)*/akra.bf.floatToFixed(r, 8);
                        pDest[1] = /*not inlined, because first statement is not return/call/dot(cur st.: If)*/akra.bf.floatToFixed(a, 8);
                        break;
                    default:
                        // Not yet supported
                         {
                            akra.logger.setSourceLocation("pixelUtil/pixelUtil.ts", 1249);
                            akra.logger.error("pack to " + (/*not inlined, because supportes only single statement functions(cur. st. count: 5)*/getDescriptionFor((ePf)).name) + " not implemented", "PixelUtil::packColour");
                        }
                        ;
                        break;
                }
            }
        }
        pixelUtil.packColourFloat = packColourFloat;
        /** Unpack a colour value from memory
        @param colour	The colour is returned here
        @param pf		Pixelformat in which to read the colour
        @param src		Source memory location
        */
        function unpackColour(cColour, ePf, pSrc) {
            unpackColourFloat(cColour, ePf, pSrc);
        }
        pixelUtil.unpackColour = unpackColour;
        /** Unpack a colour value from memory
        @param r,g,b,a	The colour is returned here (as byte)
        @param pf		Pixelformat in which to read the colour
        @param src		Source memory location
        @remarks 	This function returns the colour components in 8 bit precision,
        this will lose precision when coming from PF_A2R10G10B10 or floating
        point formats.
        */
        function unpackColourUint(rgba, ePf, pSrc) {
            /**@const*/ var des = /*not inlined, because supportes only single statement functions(cur. st. count: 5)*/getDescriptionFor(ePf);
            var r = 0, g = 0, b = 0, a = 0;
            if (des.flags & akra.EPixelFormatFlags.NATIVEENDIAN) {
                // Shortcut for integer formats unpacking
                /**@const*/ var value = /*not inlined, because supportes only single statement functions(cur. st. count: 3)*/akra.bf.intRead(pSrc, des.elemBytes);
                if (des.flags & akra.EPixelFormatFlags.LUMINANCE) {
                    // Luminance format -- only rbits used
                    r = g = b = /*not inlined, because supportes only single statement functions(cur. st. count: 3)*/akra.bf.fixedToFixed((value & des.rmask) >> des.rshift, des.rbits, 8);
                } else {
                    r = /*not inlined, because supportes only single statement functions(cur. st. count: 3)*/akra.bf.fixedToFixed((value & des.rmask) >> des.rshift, des.rbits, 8);
                    g = /*not inlined, because supportes only single statement functions(cur. st. count: 3)*/akra.bf.fixedToFixed((value & des.gmask) >> des.gshift, des.gbits, 8);
                    b = /*not inlined, because supportes only single statement functions(cur. st. count: 3)*/akra.bf.fixedToFixed((value & des.bmask) >> des.bshift, des.bbits, 8);
                }
                if (des.flags & akra.EPixelFormatFlags.HASALPHA) {
                    a = /*not inlined, because supportes only single statement functions(cur. st. count: 3)*/akra.bf.fixedToFixed((value & des.amask) >> des.ashift, des.abits, 8);
                } else {
                    /* No alpha, default a component to full*/
                    a = 255;
                }
            } else {
                // Do the operation with the more generic floating point
                var pRGBA = _pColorValue;
                unpackColourFloat(pRGBA, ePf, pSrc);
                r = /*not inlined, because first statement is not return/call/dot(cur st.: If)*/akra.bf.floatToFixed(pRGBA.r, 8);
                g = /*not inlined, because first statement is not return/call/dot(cur st.: If)*/akra.bf.floatToFixed(pRGBA.g, 8);
                b = /*not inlined, because first statement is not return/call/dot(cur st.: If)*/akra.bf.floatToFixed(pRGBA.b, 8);
                a = /*not inlined, because first statement is not return/call/dot(cur st.: If)*/akra.bf.floatToFixed(pRGBA.a, 8);
            }
            rgba[0] = r;
            rgba[1] = g;
            rgba[2] = b;
            rgba[3] = a;
        }
        pixelUtil.unpackColourUint = unpackColourUint;
        /** Unpack a colour value from memory
        @param r,g,b,a	The colour is returned here (as float)
        @param pf		Pixelformat in which to read the colour
        @param src		Source memory location
        */
        function unpackColourFloat(rgba, ePf, pSrc) {
            /**@const*/ var des = /*not inlined, because supportes only single statement functions(cur. st. count: 5)*/getDescriptionFor(ePf);
            var r = 0., g = 0., b = 0., a = 0.;
            if (des.flags & akra.EPixelFormatFlags.NATIVEENDIAN) {
                // Shortcut for integer formats unpacking
                /**@const*/ var value = /*not inlined, because supportes only single statement functions(cur. st. count: 3)*/akra.bf.intRead(pSrc, des.elemBytes);
                if (des.flags & akra.EPixelFormatFlags.LUMINANCE) {
                    // Luminance format -- only rbits used
                    r = g = b = ((((value & des.rmask) >>> des.rshift) & ((1 << (des.rbits)) - 1)) / ((1 << (des.rbits)) - 1));
                } else {
                    r = ((((value & des.rmask) >>> des.rshift) & ((1 << (des.rbits)) - 1)) / ((1 << (des.rbits)) - 1));
                    g = ((((value & des.gmask) >>> des.gshift) & ((1 << (des.gbits)) - 1)) / ((1 << (des.gbits)) - 1));
                    b = ((((value & des.bmask) >>> des.bshift) & ((1 << (des.bbits)) - 1)) / ((1 << (des.bbits)) - 1));
                }
                if (des.flags & akra.EPixelFormatFlags.HASALPHA) {
                    a = ((((value & des.amask) >>> des.ashift) & ((1 << (des.abits)) - 1)) / ((1 << (des.abits)) - 1));
                } else {
                    /* No alpha, default a component to full*/
                    a = 1.0;
                }
            } else {
                switch(ePf) {
                    case akra.EPixelFormats.FLOAT32_DEPTH:
                    case akra.EPixelFormats.FLOAT32_R:
                        r = g = b = (new Float32Array(pSrc.buffer, pSrc.byteOffset, 1))[0];
                        a = 1.0;
                        break;
                    case akra.EPixelFormats.FLOAT32_GR:
                        g = (new Float32Array(pSrc.buffer, pSrc.byteOffset, 1))[0];
                        r = b = (new Float32Array(pSrc.buffer, pSrc.byteOffset, 2))[1];
                        a = 1.0;
                        break;
                    case akra.EPixelFormats.FLOAT32_RGB:
                        r = (new Float32Array(pSrc.buffer, pSrc.byteOffset, 1))[0];
                        g = (new Float32Array(pSrc.buffer, pSrc.byteOffset, 2))[1];
                        b = (new Float32Array(pSrc.buffer, pSrc.byteOffset, 3))[2];
                        a = 1.0;
                        break;
                    case akra.EPixelFormats.FLOAT32_RGBA:
                        r = (new Float32Array(pSrc.buffer, pSrc.byteOffset, 1))[0];
                        g = (new Float32Array(pSrc.buffer, pSrc.byteOffset, 2))[1];
                        b = (new Float32Array(pSrc.buffer, pSrc.byteOffset, 3))[2];
                        a = (new Float32Array(pSrc.buffer, pSrc.byteOffset, 4))[3];
                        break;
                    case akra.EPixelFormats.FLOAT16_R:
                        r = g = b = /*not inlined, because supportes only single statement functions(cur. st. count: 3)*/akra.bf.halfToFloat((new Uint16Array(pSrc.buffer, pSrc.byteOffset, 1))[0]);
                        a = 1.0;
                        break;
                    case akra.EPixelFormats.FLOAT16_GR:
                        g = /*not inlined, because supportes only single statement functions(cur. st. count: 3)*/akra.bf.halfToFloat((new Uint16Array(pSrc.buffer, pSrc.byteOffset, 1))[0]);
                        r = b = /*not inlined, because supportes only single statement functions(cur. st. count: 3)*/akra.bf.halfToFloat((new Uint16Array(pSrc.buffer, pSrc.byteOffset, 2))[1]);
                        a = 1.0;
                        break;
                    case akra.EPixelFormats.FLOAT16_RGB:
                        r = /*not inlined, because supportes only single statement functions(cur. st. count: 3)*/akra.bf.halfToFloat((new Uint16Array(pSrc.buffer, pSrc.byteOffset, 1))[0]);
                        g = /*not inlined, because supportes only single statement functions(cur. st. count: 3)*/akra.bf.halfToFloat((new Uint16Array(pSrc.buffer, pSrc.byteOffset, 1))[1]);
                        b = /*not inlined, because supportes only single statement functions(cur. st. count: 3)*/akra.bf.halfToFloat((new Uint16Array(pSrc.buffer, pSrc.byteOffset, 2))[2]);
                        a = 1.0;
                        break;
                    case akra.EPixelFormats.FLOAT16_RGBA:
                        r = /*not inlined, because supportes only single statement functions(cur. st. count: 3)*/akra.bf.halfToFloat((new Uint16Array(pSrc.buffer, pSrc.byteOffset, 1))[0]);
                        g = /*not inlined, because supportes only single statement functions(cur. st. count: 3)*/akra.bf.halfToFloat((new Uint16Array(pSrc.buffer, pSrc.byteOffset, 2))[1]);
                        b = /*not inlined, because supportes only single statement functions(cur. st. count: 3)*/akra.bf.halfToFloat((new Uint16Array(pSrc.buffer, pSrc.byteOffset, 3))[2]);
                        a = /*not inlined, because supportes only single statement functions(cur. st. count: 3)*/akra.bf.halfToFloat((new Uint16Array(pSrc.buffer, pSrc.byteOffset, 4))[3]);
                        break;
                    case akra.EPixelFormats.SHORT_RGB:
                        r = ((((new Uint16Array(pSrc.buffer, pSrc.byteOffset, 1))[0]) & ((1 << (16)) - 1)) / ((1 << (16)) - 1));
                        g = ((((new Uint16Array(pSrc.buffer, pSrc.byteOffset, 2))[1]) & ((1 << (16)) - 1)) / ((1 << (16)) - 1));
                        b = ((((new Uint16Array(pSrc.buffer, pSrc.byteOffset, 3))[2]) & ((1 << (16)) - 1)) / ((1 << (16)) - 1));
                        a = 1.0;
                        break;
                    case akra.EPixelFormats.SHORT_RGBA:
                        r = ((((new Uint16Array(pSrc.buffer, pSrc.byteOffset, 1))[0]) & ((1 << (16)) - 1)) / ((1 << (16)) - 1));
                        g = ((((new Uint16Array(pSrc.buffer, pSrc.byteOffset, 2))[1]) & ((1 << (16)) - 1)) / ((1 << (16)) - 1));
                        b = ((((new Uint16Array(pSrc.buffer, pSrc.byteOffset, 3))[2]) & ((1 << (16)) - 1)) / ((1 << (16)) - 1));
                        a = ((((new Uint16Array(pSrc.buffer, pSrc.byteOffset, 4))[3]) & ((1 << (16)) - 1)) / ((1 << (16)) - 1));
                        break;
                    case akra.EPixelFormats.BYTE_LA:
                        r = g = b = ((((pSrc)[0]) & ((1 << (8)) - 1)) / ((1 << (8)) - 1));
                        a = ((((pSrc)[1]) & ((1 << (8)) - 1)) / ((1 << (8)) - 1));
                        break;
                    default:
                        // Not yet supported
                         {
                            akra.logger.setSourceLocation("pixelUtil/pixelUtil.ts", 1421);
                            akra.logger.error("unpack from " + (/*not inlined, because supportes only single statement functions(cur. st. count: 5)*/getDescriptionFor((ePf)).name) + " not implemented", "PixelUtil::unpackColour");
                        }
                        ;
                        break;
                }
            }
            rgba.r = r;
            rgba.g = g;
            rgba.b = b;
            rgba.a = a;
        }
        pixelUtil.unpackColourFloat = unpackColourFloat;
                        function bulkPixelConversion(pSrc, eSrcFormat, pDest, eDstFormat, iCount) {
            var src = null, dst = null;
            if (arguments.length > 2) {
                src = new pixelUtil.PixelBox(iCount, 1, 1, eSrcFormat, pSrc);
                dst = new pixelUtil.PixelBox(iCount, 1, 1, eDstFormat, pDest);
            } else {
                src = arguments[0];
                dst = arguments[1];
            }
            if (src.width !== dst.width || src.height !== dst.height || src.depth !== dst.depth) {
 {
                    akra.logger.setSourceLocation("pixelUtil/pixelUtil.ts", 1469);
                    akra.logger.criticalError("Size dest and src pictures is different");
                }
                ;
                return;
            }
            // Check for compressed formats, we don't support decompression, compression or recoding
            if ((((/*not inlined, because supportes only single statement functions(cur. st. count: 5)*/getDescriptionFor(((src.format))).flags) & /*checked (origin: akra)>>*/akra.EPixelFormatFlags.COMPRESSED) > 0) || (((/*not inlined, because supportes only single statement functions(cur. st. count: 5)*/getDescriptionFor(((dst.format))).flags) & /*checked (origin: akra)>>*/akra.EPixelFormatFlags.COMPRESSED) > 0)) {
                if (src.format == dst.format) {
                    //_memcpy(dst.data.buffer, src.data.buffer, src.getConsecutiveSize());
                    dst.data.set(src.data.subarray(0, src.getConsecutiveSize()));
                    return;
                } else {
 {
                        akra.logger.setSourceLocation("pixelUtil/pixelUtil.ts", 1482);
                        akra.logger.error("This method can not be used to compress or decompress images", "PixelUtil::bulkPixelConversion");
                    }
                    ;
                }
            }
            // The easy case
            if (src.format == dst.format) {
                // Everything consecutive?
                if (src.isConsecutive() && dst.isConsecutive()) {
                    //_memcpy(dst.data.buffer, src.data.buffer, src.getConsecutiveSize());
                    dst.data.set(src.data.subarray(0, src.getConsecutiveSize()));
                    return;
                }
                var srcPixelSize = (/*not inlined, because supportes only single statement functions(cur. st. count: 5)*/getDescriptionFor((src.format)).elemBytes);
                var dstPixelSize = (/*not inlined, because supportes only single statement functions(cur. st. count: 5)*/getDescriptionFor((dst.format)).elemBytes);
                var srcptr = src.data.subarray((src.left + src.top * src.rowPitch + src.front * src.slicePitch) * srcPixelSize);
                var dstptr = dst.data.subarray((dst.left + dst.top * dst.rowPitch + dst.front * dst.slicePitch) * dstPixelSize);
                // Calculate pitches+skips in bytes
                var srcRowPitchBytes = src.rowPitch * srcPixelSize;
                //var size_t srcRowSkipBytes = src.getRowSkip()*srcPixelSize;
                var srcSliceSkipBytes = src.getSliceSkip() * srcPixelSize;
                var dstRowPitchBytes = dst.rowPitch * dstPixelSize;
                //var size_t dstRowSkipBytes = dst.getRowSkip()*dstPixelSize;
                var dstSliceSkipBytes = dst.getSliceSkip() * dstPixelSize;
                // Otherwise, copy per row
                /**@const*/ var rowSize = src.width * srcPixelSize;
                for(var z = src.front; z < src.back; z++) {
                    for(var y = src.top; y < src.bottom; y++) {
                        //_memcpy(dstptr.buffer, srcptr.buffer, rowSize);
                        dstptr.set(srcptr.subarray(0, rowSize));
                        srcptr = srcptr.subarray(srcRowPitchBytes);
                        dstptr = dstptr.subarray(dstRowPitchBytes);
                    }
                    srcptr = srcptr.subarray(srcSliceSkipBytes);
                    dstptr = dstptr.subarray(dstSliceSkipBytes);
                }
                return;
            }
            // Converting to PF_X8R8G8B8 is exactly the same as converting to
            // PF_A8R8G8B8. (same with PF_X8B8G8R8 and PF_A8B8G8R8)
            if (dst.format == akra.EPixelFormats.X8R8G8B8 || dst.format == akra.EPixelFormats.X8B8G8R8) {
                // Do the same conversion, with EPixelFormats.A8R8G8B8, which has a lot of
                // optimized conversions
                var tempdst = dst;
                tempdst.format = (dst.format == akra.EPixelFormats.X8R8G8B8) ? akra.EPixelFormats.A8R8G8B8 : akra.EPixelFormats.A8B8G8R8;
                bulkPixelConversion(src, tempdst);
                return;
            }
            // Converting from EPixelFormats.X8R8G8B8 is exactly the same as converting from
            // EPixelFormats.A8R8G8B8, given that the destination format does not have alpha.
            if ((src.format == akra.EPixelFormats.X8R8G8B8 || src.format == akra.EPixelFormats.X8B8G8R8) && !(((/*not inlined, because supportes only single statement functions(cur. st. count: 5)*/getDescriptionFor(((dst.format))).flags) & /*checked (origin: akra)>>*/akra.EPixelFormatFlags.HASALPHA) > 0)) {
                // Do the same conversion, with EPixelFormats.A8R8G8B8, which has a lot of
                // optimized conversions
                var tempsrc = src;
                tempsrc.format = src.format == akra.EPixelFormats.X8R8G8B8 ? akra.EPixelFormats.A8R8G8B8 : akra.EPixelFormats.A8B8G8R8;
                bulkPixelConversion(tempsrc, dst);
                return;
            }
            var srcPixelSize = (/*not inlined, because supportes only single statement functions(cur. st. count: 5)*/getDescriptionFor((src.format)).elemBytes);
            var dstPixelSize = (/*not inlined, because supportes only single statement functions(cur. st. count: 5)*/getDescriptionFor((dst.format)).elemBytes);
            var srcptr = src.data.subarray((src.left + src.top * src.rowPitch + src.front * src.slicePitch) * srcPixelSize);
            var dstptr = dst.data.subarray((dst.left + dst.top * dst.rowPitch + dst.front * dst.slicePitch) * dstPixelSize);
            // Old way, not taking into account box dimensions
            //uint8 *srcptr = static_cast<uint8*>(src.data), *dstptr = static_cast<uint8*>(dst.data);
            // Calculate pitches+skips in bytes
            var srcRowSkipBytes = src.getRowSkip() * srcPixelSize;
            var srcSliceSkipBytes = src.getSliceSkip() * srcPixelSize;
            var dstRowSkipBytes = dst.getRowSkip() * dstPixelSize;
            var dstSliceSkipBytes = dst.getSliceSkip() * dstPixelSize;
            // The brute force fallback
            // var r: float = 0, g: float = 0, b: float = 0, a: float = 1;
            var rgba = _pColorValue;
            for(var z = src.front; z < src.back; z++) {
                for(var y = src.top; y < src.bottom; y++) {
                    for(var x = src.left; x < src.right; x++) {
                        unpackColourFloat(rgba, src.format, srcptr);
                        packColourFloat(rgba.r, rgba.g, rgba.b, rgba.a, dst.format, dstptr);
                        srcptr = srcptr.subarray(srcPixelSize);
                        dstptr = dstptr.subarray(dstPixelSize);
                    }
                    srcptr = srcptr.subarray(srcRowSkipBytes);
                    dstptr = dstptr.subarray(dstRowSkipBytes);
                }
                srcptr = srcptr.subarray(srcSliceSkipBytes);
                dstptr = dstptr.subarray(dstSliceSkipBytes);
            }
        }
        pixelUtil.bulkPixelConversion = bulkPixelConversion;
        function calculateSizeForImage(nMipLevels, nFaces, iWidth, iHeight, iDepth, eFormat) {
            var iSize = 0;
            var mip = 0;
            for(mip = 0; mip < nMipLevels; ++mip) {
                iSize += getMemorySize(iWidth, iHeight, iDepth, eFormat) * nFaces;
                if (iWidth !== 1) {
                    iWidth /= 2;
                }
                if (iHeight !== 1) {
                    iHeight /= 2;
                }
                if (iDepth !== 1) {
                    iDepth /= 2;
                }
            }
            return iSize;
        }
        pixelUtil.calculateSizeForImage = calculateSizeForImage;
    })(akra.pixelUtil || (akra.pixelUtil = {}));
    var pixelUtil = akra.pixelUtil;
})(akra || (akra = {}));
var akra;
(function (akra) {
    (function (webgl) {
        webgl.maxTextureSize = 0;
        webgl.maxCubeMapTextureSize = 0;
        webgl.maxViewPortSize = 0;
        webgl.maxTextureImageUnits = 0;
        webgl.maxVertexAttributes = 0;
        webgl.maxVertexTextureImageUnits = 0;
        webgl.maxCombinedTextureImageUnits = 0;
        webgl.maxColorAttachments = 1;
        webgl.stencilBits = 0;
        webgl.colorBits = [
            0, 
            0, 
            0
        ];
        webgl.alphaBits = 0;
        webgl.multisampleType = 0.;
        webgl.shaderVersion = 0;
        webgl.hasNonPowerOf2Textures = false;
        webgl.isANGLE = false;
        var isSupported = false;
        webgl.pSupportedExtensionList = null;
        // var pLoadedExtensionList: Object = null;
        function makeDebugContext(pWebGLContext) {
            if ((((window).WebGLDebugUtils) !== undefined)) {
                pWebGLContext = WebGLDebugUtils.makeDebugContext(pWebGLContext, function (err, funcName, args) {
 {
                        akra.logger.setSourceLocation("webgl/WebGL.ts", 54);
                        akra.logger.log(("\n" + (new Error()).stack.split("\n").slice(1).join("\n")));
                    }
                    ;
                    throw WebGLDebugUtils.glEnumToString(err) + " was caused by call to: " + funcName;
                }, function (funcName, args) {
 {
                        akra.logger.setSourceLocation("webgl/WebGL.ts", 58);
                        akra.logger.log("gl." + funcName + "(" + WebGLDebugUtils.glFunctionArgsToString(funcName, args) + ")");
                    }
                    ;
                });
            }
            return pWebGLContext;
        }
        function loadExtension(pWebGLContext, sExtName) {
            var pWebGLExtentionList = (pWebGLContext).extentionList = (pWebGLContext).extentionList || {};
            var pWebGLExtension;
            if (!hasExtension(sExtName)) {
 {
                    akra.logger.setSourceLocation("webgl/WebGL.ts", 70);
                    akra.logger.warning("Extension " + sExtName + " unsupported for this platform.");
                }
                ;
                return false;
            }
            if (pWebGLExtension = pWebGLContext.getExtension(sExtName)) {
                if (((pWebGLExtentionList[sExtName]) != null)) {
                    // debug_print("Extension " + sExtName + " already loaded for this context.");
                    return true;
                }
                pWebGLExtentionList[sExtName] = pWebGLExtension;
 {
                    akra.logger.setSourceLocation("webgl/WebGL.ts", 82);
                    akra.logger.log("loaded WebGL extension: ", sExtName);
                }
                ;
                for(var j in pWebGLExtension) {
                    if ((/*checked (origin: akra)>>*/akra.typeOf((pWebGLExtension[j])) === "function")) {
                        //debug_print("created func WebGLRenderingContext::" + j + "(...)");
                        pWebGLContext[j] = function () {
                            pWebGLContext[j] = new Function("var t = this.extentionList[" + sExtName + "];" + "t." + j + ".apply(t, arguments);");
                        };
                    } else {
                        //debug_print("created const WebGLRenderingContext::" + j + " = " + pWebGLExtension[j]);
                        pWebGLContext[j] = pWebGLExtension[j];
                    }
                }
                return true;
            }
 {
                akra.logger.setSourceLocation("webgl/WebGL.ts", 103);
                akra.logger.warning("cannot load extension: ", sExtName);
            }
            ;
            return false;
        }
        webgl.loadExtension = loadExtension;
        function checkIsAngle(pWebGLContext) {
            var pProgram = pWebGLContext.createProgram();
            var sVertex = "            attribute vec3 pos;            struct S {              vec3 b[1];            };            uniform S s[1];            void main(void) {              float t = s[0].b[0].x;              gl_Position = vec4(pos, 1. + t);            }";
            var sFragment = "void main(void){}";
            var pVertexShader = pWebGLContext.createShader(0x8B31);
            var pFragmentShader = pWebGLContext.createShader(0x8B30);
            pWebGLContext.shaderSource(pVertexShader, sVertex);
            pWebGLContext.compileShader(pVertexShader);
            pWebGLContext.shaderSource(pFragmentShader, sFragment);
            pWebGLContext.compileShader(pFragmentShader);
            pWebGLContext.attachShader(pProgram, pVertexShader);
            pWebGLContext.attachShader(pProgram, pFragmentShader);
            pWebGLContext.linkProgram(pProgram);
            if (!pWebGLContext.getProgramParameter(pProgram, 0x8B82)) {
 {
                    akra.logger.setSourceLocation("webgl/WebGL.ts", 138);
                    akra.logger.error("cannot compile GLSL shader for ANGLE renderer");
                }
                ;
 {
                    akra.logger.setSourceLocation("webgl/WebGL.ts", 140);
                    akra.logger.log(pWebGLContext.getShaderInfoLog(pVertexShader));
                }
                ;
 {
                    akra.logger.setSourceLocation("webgl/WebGL.ts", 141);
                    akra.logger.log(pWebGLContext.getShaderSource(pVertexShader) || sVertex);
                }
                ;
 {
                    akra.logger.setSourceLocation("webgl/WebGL.ts", 143);
                    akra.logger.log(pWebGLContext.getShaderInfoLog(pFragmentShader));
                }
                ;
 {
                    akra.logger.setSourceLocation("webgl/WebGL.ts", 144);
                    akra.logger.log(pWebGLContext.getShaderSource(pFragmentShader) || sFragment);
                }
                ;
                return false;
            }
 {
                akra.logger.setSourceLocation("webgl/WebGL.ts", 150);
                akra.logger.assert(pWebGLContext.getProgramParameter(pProgram, 0x8B86) > 0, "no uniforms founded in angle test shader!");
            }
            ;
            return pWebGLContext.getActiveUniform(pProgram, 0).name != "s[0].b[0]";
        }
        function setupContext(pWebGLContext) {
            //test context not created yet
            if (((/*checked (origin: webgl)>>*/akra.webgl.pSupportedExtensionList) === null)) {
                return pWebGLContext;
            }
            for(var i = 0; i < webgl.pSupportedExtensionList.length; ++i) {
                if (!loadExtension(pWebGLContext, webgl.pSupportedExtensionList[i])) {
                    webgl.pSupportedExtensionList.splice(i, 1);
                }
            }
            return pWebGLContext;
        }
        webgl.isEnabled = /** @inline */function () {
            return isSupported;
        };
        function createContext(pCanvas, pOptions) {
            if (typeof pCanvas === "undefined") { pCanvas = document.createElement("canvas"); }
            var pWebGLContext = null;
            try  {
                pWebGLContext = pCanvas.getContext("webgl", pOptions) || pCanvas.getContext("experimental-webgl", pOptions);
            } catch (e) {
                throw e;
            }
            if (((pWebGLContext) != null)) {
                return setupContext(pWebGLContext);
            }
 {
                akra.logger.setSourceLocation("webgl/WebGL.ts", 196);
                akra.logger.warning("cannot get 3d device");
            }
            ;
            return null;
        }
        webgl.createContext = createContext;
        (function (pWebGLContext) {
            if (!pWebGLContext) {
                return;
            }
            webgl.maxTextureSize = pWebGLContext.getParameter(0x0D33);
            webgl.maxCubeMapTextureSize = pWebGLContext.getParameter(0x851C);
            webgl.maxViewPortSize = pWebGLContext.getParameter(0x0D3A);
            webgl.maxTextureImageUnits = pWebGLContext.getParameter(0x8872);
            webgl.maxVertexAttributes = pWebGLContext.getParameter(0x8869);
            webgl.maxVertexTextureImageUnits = pWebGLContext.getParameter(0x8B4C);
            webgl.maxCombinedTextureImageUnits = pWebGLContext.getParameter(0x8B4D);
            webgl.stencilBits = pWebGLContext.getParameter(0x0D57);
            webgl.colorBits = [
                pWebGLContext.getParameter(0x0D52), 
                pWebGLContext.getParameter(0x0D53), 
                pWebGLContext.getParameter(0x0D54)
            ];
            webgl.alphaBits = pWebGLContext.getParameter(0x0D55);
            webgl.multisampleType = pWebGLContext.getParameter(0x80AA);
            webgl.pSupportedExtensionList = pWebGLContext.getSupportedExtensions();
            //pSupportedExtensionList.push(WEBGL_DEBUG_SHADERS, WEBGL_DEBUG_RENDERER_INFO);
            isSupported = true;
            webgl.isANGLE = checkIsAngle(pWebGLContext);
 {
                akra.logger.setSourceLocation("webgl/WebGL.ts", 237);
                akra.logger.log("WebGL running under " + (webgl.isANGLE ? "ANGLE/DirectX" : "Native GL"));
            }
            ;
        })(createContext());
        function hasExtension(sExtName) {
            for(var i = 0; i < webgl.pSupportedExtensionList.length; ++i) {
                if (webgl.pSupportedExtensionList[i].search(sExtName) != -1) {
                    return true;
                }
            }
            return false;
        }
        webgl.hasExtension = hasExtension;
        function getWebGLUsage(iFlags) {
            if ((((iFlags) & (akra.EHardwareBufferFlags.DYNAMIC)) != 0)) {
                return 0x88E8;
            } else if ((((iFlags) & (akra.EHardwareBufferFlags.STREAM)) != 0)) {
                return 0x88E0;
            }
            return 0x88E4;
        }
        webgl.getWebGLUsage = getWebGLUsage;
        function getWebGLFormat(eFormat) {
            switch(eFormat) {
                case akra.EPixelFormats.L8:
                case akra.EPixelFormats.L16:
                    return 0x1909;
                case akra.EPixelFormats.A8:
                    return 0x1906;
                case akra.EPixelFormats.A4L4:
                case akra.EPixelFormats.BYTE_LA:
                    return 0x190A;
                case akra.EPixelFormats.R5G6B5:
                    return 0;
                case akra.EPixelFormats.B5G6R5:
                    return 0x1907;
                case akra.EPixelFormats.R3G3B2:
                    return 0;
                case akra.EPixelFormats.A4R4G4B4:
                case akra.EPixelFormats.A1R5G5B5:
                    return 0x1908;
                case akra.EPixelFormats.R8G8B8:
                case akra.EPixelFormats.B8G8R8:
                    return 0x1907;
                case akra.EPixelFormats.A8R8G8B8:
                case akra.EPixelFormats.A8B8G8R8:
                    return 0x1908;
                case akra.EPixelFormats.B8G8R8A8:
                case akra.EPixelFormats.R8G8B8A8:
                case akra.EPixelFormats.X8R8G8B8:
                case akra.EPixelFormats.X8B8G8R8:
                    return 0x1908;
                case akra.EPixelFormats.A2R10G10B10:
                    return 0;
                case akra.EPixelFormats.A2B10G10R10:
                    return 0x1908;
                case akra.EPixelFormats.DXT1:
                    return 0x83F1;
                case akra.EPixelFormats.DXT2:
                    return 0;
                case akra.EPixelFormats.DXT3:
                    return 0x83F2;
                case akra.EPixelFormats.DXT4:
                    return 0;
                case akra.EPixelFormats.DXT5:
                    return 0x83F3;
                case akra.EPixelFormats.FLOAT16_R:
                    return 0;
                case akra.EPixelFormats.FLOAT16_RGB:
                    return 0x1907;
                case akra.EPixelFormats.FLOAT16_RGBA:
                    return 0x1908;
                case akra.EPixelFormats.FLOAT32_R:
                    return 0;
                case akra.EPixelFormats.FLOAT32_RGB:
                    return 0x1907;
                case akra.EPixelFormats.FLOAT32_RGBA:
                    return 0x1908;
                case akra.EPixelFormats.FLOAT16_GR:
                case akra.EPixelFormats.FLOAT32_GR:
                    return 0;
                case akra.EPixelFormats.FLOAT32_DEPTH:
                case akra.EPixelFormats.DEPTH32:
                case akra.EPixelFormats.DEPTH16:
                case akra.EPixelFormats.DEPTH8:
                    return 0x1902;
                case akra.EPixelFormats.DEPTH24STENCIL8:
                    return 0x84F9;
                case akra.EPixelFormats.SHORT_RGBA:
                    return 0x1908;
                case akra.EPixelFormats.SHORT_GR:
                    return 0;
                case akra.EPixelFormats.SHORT_RGB:
                    return 0x1907;
                case akra.EPixelFormats.PVRTC_RGB2:
                    return 0x8C01;
                case akra.EPixelFormats.PVRTC_RGBA2:
                    return 0x8C03;
                case akra.EPixelFormats.PVRTC_RGB4:
                    return 0x8C00;
                case akra.EPixelFormats.PVRTC_RGBA4:
                    return 0x8C02;
                case akra.EPixelFormats.R8:
                case akra.EPixelFormats.RG8:
                    return 0;
                default:
 {
                        akra.logger.setSourceLocation("webgl/WebGL.ts", 364);
                        akra.logger.warning("getWebGLFormat unknown format", eFormat);
                    }
                    ;
                    return 0;
            }
        }
        webgl.getWebGLFormat = getWebGLFormat;
        function isWebGLFormatSupport(eFormat) {
            switch(eFormat) {
                case akra.EPixelFormats.DXT1:
                case akra.EPixelFormats.DXT3:
                case akra.EPixelFormats.DXT5:
                    return webgl.hasExtension("WEBGL_compressed_texture_s3tc");
                case akra.EPixelFormats.PVRTC_RGB2:
                case akra.EPixelFormats.PVRTC_RGBA2:
                case akra.EPixelFormats.PVRTC_RGB4:
                case akra.EPixelFormats.PVRTC_RGBA4:
                    return webgl.hasExtension("WEBGL_compressed_texture_pvrtc");
                case akra.EPixelFormats.DEPTH32:
                case akra.EPixelFormats.DEPTH16:
                case akra.EPixelFormats.DEPTH24STENCIL8:
                    return webgl.hasExtension("WEBGL_depth_texture");
                case akra.EPixelFormats.DEPTH32:
                case akra.EPixelFormats.DEPTH16:
                case akra.EPixelFormats.DEPTH24STENCIL8:
                    return webgl.hasExtension("WEBGL_depth_texture");
                case akra.EPixelFormats.FLOAT16_RGB:
                case akra.EPixelFormats.FLOAT16_RGBA:
                    return webgl.hasExtension("OES_texture_half_float");
                case akra.EPixelFormats.FLOAT32_RGB:
                case akra.EPixelFormats.FLOAT32_RGBA:
                    return webgl.hasExtension("OES_texture_float");
            }
            if (getWebGLFormat(eFormat) && getWebGLDataType(eFormat)) {
                // switch(eFormat)
                // {
                //     case EPixelFormats.FLOAT32_DEPTH:
                //     case EPixelFormats.L16:
                //         return false;
                // }
                return true;
            }
            return false;
        }
        webgl.isWebGLFormatSupport = isWebGLFormatSupport;
        function getWebGLDataType(eFormat) {
            switch(eFormat) {
                case akra.EPixelFormats.L8:
                    return 0x1401;
                case akra.EPixelFormats.L16:
                    //return GL_UNSIGNED_SHORT;
                    return 0x1401;
                case akra.EPixelFormats.A8:
                    return 0x1401;
                case akra.EPixelFormats.A4L4:
                    return 0;
                case akra.EPixelFormats.BYTE_LA:
                    return 0x1401;
                case akra.EPixelFormats.R5G6B5:
                case akra.EPixelFormats.B5G6R5:
                    return 0x8363;
                case akra.EPixelFormats.R3G3B2:
                    return 0;
                case akra.EPixelFormats.A4R4G4B4:
                    return 0x8033;
                case akra.EPixelFormats.A1R5G5B5:
                    return 0x8034;
                case akra.EPixelFormats.R8G8B8:
                case akra.EPixelFormats.B8G8R8:
                case akra.EPixelFormats.A8R8G8B8:
                case akra.EPixelFormats.A8B8G8R8:
                case akra.EPixelFormats.B8G8R8A8:
                case akra.EPixelFormats.R8G8B8A8:
                case akra.EPixelFormats.X8R8G8B8:
                case akra.EPixelFormats.X8B8G8R8:
                    return 0x1401;
                case akra.EPixelFormats.A2R10G10B10:
                    return 0;
                case akra.EPixelFormats.A2B10G10R10:
                    return 0;
                case akra.EPixelFormats.DXT1:
                case akra.EPixelFormats.DXT2:
                case akra.EPixelFormats.DXT3:
                case akra.EPixelFormats.DXT4:
                case akra.EPixelFormats.DXT5:
                    return 0;
                case akra.EPixelFormats.FLOAT16_R:
                case akra.EPixelFormats.FLOAT16_RGB:
                case akra.EPixelFormats.FLOAT16_RGBA:
                    return 0x8D61;
                case akra.EPixelFormats.FLOAT32_R:
                case akra.EPixelFormats.FLOAT32_RGB:
                case akra.EPixelFormats.FLOAT32_RGBA:
                case akra.EPixelFormats.FLOAT16_GR:
                case akra.EPixelFormats.FLOAT32_GR:
                    return 0x1406;
                case akra.EPixelFormats.FLOAT32_DEPTH:
                    return 0x1406;
                case akra.EPixelFormats.DEPTH8:
                    return 0x1401;
                case akra.EPixelFormats.DEPTH16:
                    return 0x1403;
                case akra.EPixelFormats.DEPTH32:
                    return 0x1405;
                case akra.EPixelFormats.DEPTH24STENCIL8:
                    return 0x8367;
                case akra.EPixelFormats.SHORT_RGBA:
                case akra.EPixelFormats.SHORT_GR:
                case akra.EPixelFormats.SHORT_RGB:
                    return 0x1403;
                case akra.EPixelFormats.PVRTC_RGB2:
                case akra.EPixelFormats.PVRTC_RGBA2:
                case akra.EPixelFormats.PVRTC_RGB4:
                case akra.EPixelFormats.PVRTC_RGBA4:
                    return 0;
                case akra.EPixelFormats.R8:
                case akra.EPixelFormats.RG8:
                    return 0x1401;
                default:
 {
                        akra.logger.setSourceLocation("webgl/WebGL.ts", 504);
                        akra.logger.criticalError("getWebGLFormat unknown format");
                    }
                    ;
                    return 0;
            }
        }
        webgl.getWebGLDataType = getWebGLDataType;
        function getWebGLInternalFormat(eFormat) {
            if (!(((/*not inlined, because supportes only single statement functions(cur. st. count: 5)*//*checked (origin: pixelUtil)>>*/akra.pixelUtil.getDescriptionFor(((eFormat))).flags) & /*checked (origin: akra)>>*/akra.EPixelFormatFlags.COMPRESSED) > 0)) {
                return getWebGLFormat(eFormat);
            } else {
                switch(eFormat) {
                    case akra.EPixelFormats.DXT1:
                        return 0x83F1;
                    case akra.EPixelFormats.DXT2:
                        return 0;
                    case akra.EPixelFormats.DXT3:
                        return 0x83F2;
                    case akra.EPixelFormats.DXT4:
                        return 0;
                    case akra.EPixelFormats.DXT5:
                        return 0x83F3;
                    case akra.EPixelFormats.PVRTC_RGB2:
                        return 0x8C01;
                    case akra.EPixelFormats.PVRTC_RGBA2:
                        return 0x8C03;
                    case akra.EPixelFormats.PVRTC_RGB4:
                        return 0x8C00;
                    case akra.EPixelFormats.PVRTC_RGBA4:
                        return 0x8C02;
                }
            }
        }
        webgl.getWebGLInternalFormat = getWebGLInternalFormat;
        function getWebGLPrimitiveType(eType) {
            switch(eType) {
                case akra.EPrimitiveTypes.POINTLIST:
                    return 0x0000;
                case akra.EPrimitiveTypes.LINELIST:
                    return 0x0001;
                case akra.EPrimitiveTypes.LINELOOP:
                    return 0x0002;
                case akra.EPrimitiveTypes.LINESTRIP:
                    return 0x0003;
                case akra.EPrimitiveTypes.TRIANGLELIST:
                    return 0x0004;
                case akra.EPrimitiveTypes.TRIANGLESTRIP:
                    return 0x0005;
                case akra.EPrimitiveTypes.TRIANGLEFAN:
                    return 0x0006;
            }
            return 0x0000;
        }
        webgl.getWebGLPrimitiveType = getWebGLPrimitiveType;
        //не знаю что делает эта функция
        function getClosestWebGLInternalFormat(eFormat, isHWGamma) {
            if (typeof isHWGamma === "undefined") { isHWGamma = false; }
            var iGLFormat = webgl.getWebGLInternalFormat(eFormat);
            if (iGLFormat === 0) {
                if (isHWGamma) {
                    // TODO not supported
                    return 0;
                } else {
                    return 0x1908;
                }
            } else {
                return iGLFormat;
            }
        }
        webgl.getClosestWebGLInternalFormat = getClosestWebGLInternalFormat;
        /**
        * Convert GL format to EPixelFormat.
        */
        function getClosestAkraFormat(iGLFormat, iGLDataType) {
            switch(iGLFormat) {
                case 0x8C01:
                    return webgl.hasExtension("WEBGL_compressed_texture_pvrtc") ? akra.EPixelFormats.PVRTC_RGB2 : akra.EPixelFormats.A8R8G8B8;
                case 0x8C03:
                    return webgl.hasExtension("WEBGL_compressed_texture_pvrtc") ? akra.EPixelFormats.PVRTC_RGBA2 : akra.EPixelFormats.A8R8G8B8;
                case 0x8C00:
                    return webgl.hasExtension("WEBGL_compressed_texture_pvrtc") ? akra.EPixelFormats.PVRTC_RGB4 : akra.EPixelFormats.A8R8G8B8;
                case 0x8C02:
                    return webgl.hasExtension("WEBGL_compressed_texture_pvrtc") ? akra.EPixelFormats.PVRTC_RGBA4 : akra.EPixelFormats.A8R8G8B8;
                case 0x1909:
                    return akra.EPixelFormats.L8;
                case 0x1906:
                    return akra.EPixelFormats.A8;
                case 0x190A:
                    return akra.EPixelFormats.BYTE_LA;
                case 0x1907:
                    switch(iGLDataType) {
                        case 0x8363:
                            return akra.EPixelFormats.B5G6R5;
                        default:
                            return akra.EPixelFormats.R8G8B8;
                    }
                case 0x1908:
                    switch(iGLDataType) {
                        case 0x8034:
                            return akra.EPixelFormats.A1R5G5B5;
                        case 0x8033:
                            return akra.EPixelFormats.A4R4G4B4;
                        case 0x1406:
                            return akra.EPixelFormats.FLOAT32_RGBA;
                        default:
                            return akra.EPixelFormats.R8G8B8A8;
                            // return EPixelFormats.A8B8G8R8;
                                                }
                case 0x80E1:
                    return akra.EPixelFormats.A8B8G8R8;
                case 0x83F0:
                case 0x83F1:
                    return webgl.hasExtension("WEBGL_compressed_texture_s3tc") ? akra.EPixelFormats.DXT1 : akra.EPixelFormats.A8R8G8B8;
                case 0x83F2:
                    return webgl.hasExtension("WEBGL_compressed_texture_s3tc") ? akra.EPixelFormats.DXT3 : akra.EPixelFormats.A8R8G8B8;
                case 0x83F3:
                    return webgl.hasExtension("WEBGL_compressed_texture_s3tc") ? akra.EPixelFormats.DXT5 : akra.EPixelFormats.A8R8G8B8;
                case 0x8229:
                    return webgl.hasExtension("EXT_texture_rg") ? akra.EPixelFormats.R8 : akra.EPixelFormats.A8R8G8B8;
                case 0x822B:
                    return webgl.hasExtension("EXT_texture_rg") ? akra.EPixelFormats.RG8 : akra.EPixelFormats.A8R8G8B8;
                case 0x1902:
                    switch(iGLDataType) {
                        case 0x1406:
                            return akra.EPixelFormats.FLOAT32_DEPTH;
                        case 0x1405:
                            return akra.EPixelFormats.DEPTH32;
                        case 0x1403:
                            return akra.EPixelFormats.DEPTH16;
                        case 0x1401:
                            return akra.EPixelFormats.DEPTH8;
                    }
                case 0x84F9:
                    return akra.EPixelFormats.DEPTH24STENCIL8;
                default:
                    //TODO: not supported
                    return akra.EPixelFormats.A8R8G8B8;
            }
        }
        webgl.getClosestAkraFormat = getClosestAkraFormat;
        function optionalPO2(iValue) {
            if (webgl.hasNonPowerOf2Textures) {
                return iValue;
            } else {
                return akra.math.ceilingPowerOfTwo(iValue);
            }
        }
        webgl.optionalPO2 = optionalPO2;
        function convertToWebGLformat(pSource, pDest) {
            // Always need to convert PF_A4R4G4B4, GL expects the colors to be in the
            // reverse order
            if (pDest.format == akra.EPixelFormats.A4R4G4B4) {
                // Convert PF_A4R4G4B4 -> PF_B4G4R4A4
                // Reverse pixel order
                var iSrcPtr = (pSource.left + pSource.top * pSource.rowPitch + pSource.front * pSource.slicePitch);
                var iDstPtr = (pDest.left + pDest.top * pDest.rowPitch + pDest.front * pDest.slicePitch);
                var iSrcSliceSkip = pSource.getSliceSkip();
                var iDstSliceSkip = pDest.getSliceSkip();
                var k = pSource.right - pSource.left;
                var x = 0, y = 0, z = 0;
                for(z = pSource.front; z < pSource.back; z++) {
                    for(y = pSource.top; y < pSource.bottom; y++) {
                        for(x = 0; x < k; x++) {
                            /* B*/
                            pDest[iDstPtr + x] = ((pSource[iSrcPtr + x] & 0x000F) << 12) | /* G*/
                            ((pSource[iSrcPtr + x] & 0x00F0) << 4) | /* R*/
                            ((pSource[iSrcPtr + x] & 0x0F00) >> 4) | /* A*/
                            ((pSource[iSrcPtr + x] & 0xF000) >> 12);
                        }
                        iSrcPtr += pSource.rowPitch;
                        iDstPtr += pDest.rowPitch;
                    }
                    iSrcPtr += iSrcSliceSkip;
                    iDstPtr += iDstSliceSkip;
                }
            }
        }
        webgl.convertToWebGLformat = convertToWebGLformat;
        function checkFBOAttachmentFormat(eFormat) {
            if (eFormat === akra.EPixelFormats.R8G8B8A8 || eFormat === akra.EPixelFormats.R8G8B8) {
                return true;
            } else if (eFormat === akra.EPixelFormats.A8B8G8R8) {
                return true;
            } else if (eFormat === akra.EPixelFormats.FLOAT32_RGBA) {
                // return hasExtension(WEBGL_COLOR_BUFFER_FLOAT);
                return hasExtension("OES_texture_float");
            } else if (eFormat === akra.EPixelFormats.FLOAT16_RGBA) {
                // return hasExtension(EXT_COLOR_BUFFER_HALF_FLOAT);
                return hasExtension("OES_texture_half_float");
            } else if (eFormat === akra.EPixelFormats.DEPTH32) {
                return true;
            } else {
                return false;
            }
        }
        webgl.checkFBOAttachmentFormat = checkFBOAttachmentFormat;
        function checkReadPixelFormat(eFormat) {
            if (eFormat === akra.EPixelFormats.R8G8B8A8 || eFormat === akra.EPixelFormats.R8G8B8) {
                return true;
            } else // else if(eFormat === EPixelFormats.A8B8G8R8){
            //     return true;
            // }
            if (eFormat === akra.EPixelFormats.FLOAT32_RGBA) {
                //hasExtension(WEBGL_COLOR_BUFFER_FLOAT) || hasExtension(EXT_COLOR_BUFFER_HALF_FLOAT);
                return false;
            } else {
                return false;
            }
        }
        webgl.checkReadPixelFormat = checkReadPixelFormat;
        function checkCopyTexImage(eFormat) {
            switch(eFormat) {
                case akra.EPixelFormats.R8G8B8A8:
                case akra.EPixelFormats.R8G8B8:
                case akra.EPixelFormats.L8:
                case akra.EPixelFormats.L16:
                case akra.EPixelFormats.A8:
                    return true;
                default:
                    return false;
            }
        }
        webgl.checkCopyTexImage = checkCopyTexImage;
        function getSupportedAlternative(eFormat) {
            if (checkFBOAttachmentFormat(eFormat)) {
                return eFormat;
            }
            /// Find first alternative
            var pct = (/*not inlined, because supportes only single statement functions(cur. st. count: 5)*//*checked (origin: pixelUtil)>>*/akra.pixelUtil.getDescriptionFor((eFormat)).componentType);
            switch(pct) {
                case akra.EPixelComponentTypes.BYTE:
                    eFormat = akra.EPixelFormats.A8R8G8B8;
                    break;
                case akra.EPixelComponentTypes.SHORT:
                    eFormat = akra.EPixelFormats.SHORT_RGBA;
                    break;
                case akra.EPixelComponentTypes.FLOAT16:
                    eFormat = akra.EPixelFormats.FLOAT16_RGBA;
                    break;
                case akra.EPixelComponentTypes.FLOAT32:
                    eFormat = akra.EPixelFormats.FLOAT32_RGBA;
                    break;
                case akra.EPixelComponentTypes.COUNT:
                default:
                    break;
            }
            if (checkFBOAttachmentFormat(eFormat)) {
                return eFormat;
            }
            /// If none at all, return to default
            return akra.EPixelFormats.A8R8G8B8;
        }
        webgl.getSupportedAlternative = getSupportedAlternative;
    })(akra.webgl || (akra.webgl = {}));
    var webgl = akra.webgl;
})(akra || (akra = {}));
var akra;
(function (akra) {
    (function (util) {
        var ApiInfo = (function (_super) {
            __extends(ApiInfo, _super);
            function ApiInfo() {
                        _super.call(this);
                this.bWebGL = false;
                this.bWebAudio = false;
                this.bFile = false;
                this.bFileSystem = false;
                this.bWebWorker = false;
                this.bTransferableObjects = false;
                this.bLocalStorage = false;
                this.bWebSocket = false;
                this.bGamepad = false;
                this.bZip = false;
                var pApi = {};
                this.bWebAudio = ((window).AudioContext && (window).webkitAudioContext ? true : false);
                this.bFile = ((window).File && (window).FileReader && (window).FileList && (window).Blob ? true : false);
                this.bFileSystem = (this.bFile && (window).URL && (window).requestFileSystem ? true : false);
                this.bWebWorker = (((window).Worker) !== undefined);
                this.bLocalStorage = (((window).localStorage) !== undefined);
                this.bWebSocket = (((window).WebSocket) !== undefined);
                this.bGamepad = !!(navigator).webkitGetGamepads || !!(navigator).webkitGamepads || (navigator.userAgent.indexOf('Firefox/') != -1);
                this.bZip = ((window["zip"]) != null);
            }
            Object.defineProperty(ApiInfo.prototype, "webGL", {
                get: /** @inline */function () {
                    return (isSupported);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(ApiInfo.prototype, "transferableObjects", {
                get: function () {
                    if (!this.bTransferableObjects) {
                        this.bTransferableObjects = (this.bWebWorker && this.chechTransferableObjects() ? true : false);
                    }
                    return this.bTransferableObjects;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(ApiInfo.prototype, "file", {
                get: /** @inline */function () {
                    return this.bFile;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(ApiInfo.prototype, "fileSystem", {
                get: /** @inline */function () {
                    return this.bFileSystem;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(ApiInfo.prototype, "webAudio", {
                get: /** @inline */function () {
                    return this.bWebAudio;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(ApiInfo.prototype, "webWorker", {
                get: /** @inline */function () {
                    return this.bWebWorker;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(ApiInfo.prototype, "localStorage", {
                get: /** @inline */function () {
                    return this.bLocalStorage;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(ApiInfo.prototype, "webSocket", {
                get: /** @inline */function () {
                    return this.bWebSocket;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(ApiInfo.prototype, "gamepad", {
                get: /** @inline */function () {
                    return this.bGamepad;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(ApiInfo.prototype, "zip", {
                get: /** @inline */function () {
                    return this.bZip;
                },
                enumerable: true,
                configurable: true
            });
            ApiInfo.prototype.chechTransferableObjects = function () {
                var pBlob = new Blob([
                    "onmessage = function(e) { postMessage(true); }"
                ], {
                    "type": "text\/javascript"
                });
                var sBlobURL = (window).URL.createObjectURL(pBlob);
                var pWorker = new Worker(sBlobURL);
                var pBuffer = new ArrayBuffer(1);
                try  {
                    pWorker.postMessage(pBuffer, [
                        pBuffer
                    ]);
                } catch (e) {
 {
                        util.logger.setSourceLocation("util/ApiInfo.ts", 92);
                        util.logger.log('transferable objects not supported in your browser...');
                    }
                    ;
                }
                pWorker.terminate();
                if (pBuffer.byteLength) {
                    return false;
                }
                return true;
            };
            return ApiInfo;
        })(util.Singleton);
        util.ApiInfo = ApiInfo;        
    })(akra.util || (akra.util = {}));
    var util = akra.util;
})(akra || (akra = {}));
var akra;
(function (akra) {
    (function (info) {
                        function canvas(id) {
            var pCanvas = (typeof (id) === "string") ? document.getElementById(id) : id;
            return {
                width: (typeof (pCanvas.width) === "number") ? pCanvas.width : parseInt(pCanvas.style.width),
                height: (typeof (pCanvas.height) === "number") ? pCanvas.height : parseInt(pCanvas.style.height),
                id: pCanvas.id
            };
        }
        info.canvas = canvas;
        info.browser = new akra.util.BrowserInfo();
        info.api = new akra.util.ApiInfo();
        info.screen = new akra.util.ScreenInfo();
        info.uri = (new /*checked (origin: path)>>*/akra.path.URI((document.location.href)));
        (function (is) {
            /**
            * show status - online or offline
            */
            is.online;
            /**
            * perform test on mobile device
            */
            is.mobile = (/mobile|iphone|ipad|ipod|android|blackberry|mini|windows\sce|palm/i).test(navigator.userAgent.toLowerCase());
            is.linux = info.browser.os === 'Linux';
            is.windows = info.browser.os === 'Windows';
            is.mac = info.browser.os === 'Mac';
            is.iPhone = info.browser.os === 'iPhone';
            is.Opera = info.browser.name === "Opera";
        })(info.is || (info.is = {}));
        var is = info.is;
        //TODO: move it to [akra.info.is] module, when typescript access this.
        Object.defineProperty(is, 'online', {
            get: function () {
                return navigator.onLine;
            }
        });
    })(akra.info || (akra.info = {}));
    var info = akra.info;
})(akra || (akra = {}));
var akra;
(function (akra) {
    /*console.error(this.getEventTable());*/
    /**event, signal, slot*/
    /**event, signal, slot*/
    //#define END_EVENT_TABLE()
    (function (events) {
        var EventTable = (function () {
            function EventTable() {
                this.broadcast = {};
                this.unicast = {};
            }
            EventTable.prototype.addDestination = function (iGuid, sSignal, pTarget, sSlot, eType) {
                if (typeof eType === "undefined") { eType = akra.EEventTypes.BROADCAST; }
                if (eType === akra.EEventTypes.BROADCAST) {
                    if (this.findDestinationIndexBC(iGuid, sSignal, pTarget, sSlot) === -1) {
                        this.findBroadcastSignalMap(iGuid, sSignal).push({
                            target: pTarget,
                            callback: sSlot,
                            listener: null
                        });
                    }
                    return true;
                } else {
                    this.unicast[iGuid] = this.unicast[iGuid] || {};
                    //console.log(iGuid, sSignal, pTarget, sSlot, eType);
                    //console.warn(this.unicast);
                    if (!((this.unicast[iGuid][sSignal]) !== undefined)) {
                        this.unicast[iGuid][sSignal] = {
                            target: pTarget,
                            callback: sSlot,
                            listener: null
                        };
                        return true;
                    }
                }
                return false;
            };
            EventTable.prototype.findDestinationIndexBC = function (iGuid, sSignal, pTarget, sSlot) {
                var pList = this.findBroadcastSignalMap(iGuid, sSignal);
                for(var i = 0; i < pList.length; ++i) {
                    if (pList[i].target === pTarget && pList[i].callback === sSlot) {
                        return i;
                    }
                }
                return -1;
            };
            EventTable.prototype.removeDestination = function (iGuid, sSignal, pTarget, sSlot, eType) {
                if (typeof eType === "undefined") { eType = akra.EEventTypes.BROADCAST; }
                if (eType === akra.EEventTypes.BROADCAST) {
                    var pList = this.findBroadcastSignalMap(iGuid, sSignal);
                    var i = this.findDestinationIndexBC(iGuid, sSignal, pTarget, sSlot);
                    if (i != -1) {
                        pList.splice(i, 1);
                        return true;
                    }
                } else {
                    if (this.unicast[iGuid] && this.unicast[iGuid][sSignal]) {
                        delete this.unicast[iGuid][sSignal];
                        return true;
                    }
                }
 {
                    akra.logger.setSourceLocation("events/events.ts", 134);
                    akra.logger.warning("cannot remove destination for GUID <%s> with signal <%s>", iGuid, sSignal);
                }
                ;
                return false;
            };
            EventTable.prototype.addListener = function (iGuid, sSignal, fnListener, eType) {
                if (typeof eType === "undefined") { eType = akra.EEventTypes.BROADCAST; }
                if (eType === akra.EEventTypes.BROADCAST) {
                    // console.log("add listener(", iGuid, "):: ", "listener: ", fnListener, "signal: ", sSignal);
                    this.findBroadcastSignalMap(iGuid, sSignal).push({
                        target: null,
                        callback: null,
                        listener: fnListener
                    });
                    return true;
                } else {
                    this.unicast[iGuid] = this.unicast[iGuid] || {};
                    if (!((this.unicast[iGuid][sSignal]) !== undefined)) {
                        this.unicast[iGuid][sSignal] = {
                            target: null,
                            callback: null,
                            listener: fnListener
                        };
                        return true;
                    }
                }
 {
                    akra.logger.setSourceLocation("events/events.ts", 151);
                    akra.logger.warning("cannot add listener for GUID <%s> with signal <%s>", iGuid, sSignal);
                }
                ;
                return false;
            };
            EventTable.prototype.removeListener = function (iGuid, sSignal, fnListener, eType) {
                if (typeof eType === "undefined") { eType = akra.EEventTypes.BROADCAST; }
                if (eType === akra.EEventTypes.BROADCAST) {
                    var pList = this.findBroadcastSignalMap(iGuid, sSignal);
                    for(var i = 0; i < pList.length; ++i) {
                        if (pList[i].listener === fnListener) {
                            pList.splice(i, 1);
                            return true;
                        }
                    }
                } else {
                    if (this.unicast[iGuid] && this.unicast[iGuid][sSignal]) {
                        delete this.unicast[iGuid][sSignal];
                        return true;
                    }
                }
                return false;
            };
            EventTable.prototype.findBroadcastList = /** @inline */function (iGuid) {
                return (this.broadcast[iGuid] = this.broadcast[iGuid] || {});
            };
            EventTable.prototype.findUnicastList = function (iGuid) {
                //console.error(iGuid,this.unicast[iGuid]);
                this.unicast[iGuid] = this.unicast[iGuid] || {};
                return this.unicast[iGuid];
            };
            EventTable.prototype._sync = function (pTarget, pFrom) {
                //FIXME: release events of target...
                this.broadcast[pTarget.getGuid()] = this.broadcast[pFrom.getGuid()];
                this.unicast[pTarget.getGuid()] = this.unicast[pFrom.getGuid()];
            };
            EventTable.prototype.findBroadcastSignalMap = function (iGuid, sSignal) {
                this.broadcast[iGuid] = this.broadcast[iGuid] || {};
                this.broadcast[iGuid][sSignal] = this.broadcast[iGuid][sSignal] || [];
                return this.broadcast[iGuid][sSignal];
            };
            return EventTable;
        })();
        events.EventTable = EventTable;        
        var EventProvider = (function () {
            function EventProvider() {
                /**@protected*/ this._iGuid = akra.sid();
                /**@protected*/ this._pUnicastSlotMap = null;
                /**@protected*/ this._pBroadcastSlotList = null;
            }
            EventProvider.prototype.getGuid = /** @inline */function () {
                return this._iGuid;
            };
            EventProvider._pEventTable = new events.EventTable();
            EventProvider.prototype.getEventTable = /** @inline */function () {
                return EventProvider._pEventTable;
            };
            EventProvider.prototype.connect = /** @inline */function (pSender, sSignal, sSlot, eType) {
                return pSender.getEventTable().addDestination((((pSender))._iGuid), sSignal, this, sSlot, eType);
            };
            EventProvider.prototype.disconnect = /** @inline */function (pSender, sSignal, sSlot, eType) {
                return pSender.getEventTable().removeDestination((((pSender))._iGuid), sSignal, this, sSlot, eType);
            };
            EventProvider.prototype.bind = /** @inline */function (sSignal, fnListener, eType) {
                return (EventProvider._pEventTable).addListener(((this)._iGuid), sSignal, fnListener, eType);
            };
            EventProvider.prototype.unbind = /** @inline */function (sSignal, fnListener, eType) {
                return (EventProvider._pEventTable).removeListener(((this)._iGuid), sSignal, fnListener, eType);
            };
            EventProvider.prototype._syncTable = /** @inline */function (pFrom) {
                (EventProvider._pEventTable)._sync(this, pFrom);
            };
            return EventProvider;
        })();
        events.EventProvider = EventProvider;        
    })(akra.events || (akra.events = {}));
    var events = akra.events;
})(akra || (akra = {}));
var akra;
(function (akra) {
    (function (util) {
        (function (EThreadStatuses) {
            EThreadStatuses._map = [];
            EThreadStatuses._map[0] = "k_WorkerBusy";
            EThreadStatuses.k_WorkerBusy = 0;
            EThreadStatuses._map[1] = "k_WorkerFree";
            EThreadStatuses.k_WorkerFree = 1;
        })(util.EThreadStatuses || (util.EThreadStatuses = {}));
        var EThreadStatuses = util.EThreadStatuses;
        var ThreadManager = (function () {
            function ThreadManager(sScript) {
                if (typeof sScript === "undefined") { sScript = null; }
                this._pWorkerList = [];
                this._pStatsList = [];
                this._pWaiters = [];
                this._iSysRoutine = -1;
                /**@protected*/ this._iGuid = akra.sid();
                /**@protected*/ this._pUnicastSlotMap = null;
                /**@protected*/ this._pBroadcastSlotList = null;
                this._sDefaultScript = sScript;
            }
            ThreadManager.prototype.startSystemRoutine = function () {
                var _this = this;
                if (this._iSysRoutine > 0) {
                    return;
                }
 {
                    util.logger.setSourceLocation("util/ThreadManager.ts", 46);
                    util.logger.log("start routine", this._sDefaultScript);
                }
                ;
                this._iSysRoutine = setInterval(function () {
                    var pStats;
                    var iNow = (Date.now());
                    for(var i = 0, n = _this._pStatsList.length; i < n; ++i) {
                        pStats = _this._pStatsList[i];
                        if (pStats.releaseTime > 0 && iNow - pStats.releaseTime > 30 * 1000) {
                            if (_this.terminateThread(i)) {
 {
                                    util.logger.setSourceLocation("util/ThreadManager.ts", 57);
                                    util.logger.log("thread with id - " + i + " terminated. (" + i + "/" + n + ")");
                                }
                                ;
                                i--, n--;
                                continue;
                            }
 {
                                util.logger.setSourceLocation("util/ThreadManager.ts", 62);
                                util.logger.warning("thread must be removed: " + i);
                            }
                            ;
                        }
                    }
                    ;
                }, 5000);
            };
            ThreadManager.prototype.stopSystemRoutine = function () {
 {
                    util.logger.setSourceLocation("util/ThreadManager.ts", 69);
                    util.logger.log("stop routine", this._sDefaultScript);
                }
                ;
                clearInterval(this._iSysRoutine);
            };
            ThreadManager.prototype.createThread = function () {
                //console.log((new Error).stack)
                if (this._pWorkerList.length === 4) {
 {
                        util.logger.setSourceLocation("util/ThreadManager.ts", 76);
                        util.logger.warning("Reached limit the number of threads");
                    }
                    ;
                    return false;
                }
                if (!akra.info.api.webWorker) {
 {
                        util.logger.setSourceLocation("util/ThreadManager.ts", 81);
                        util.logger.error("WebWorkers unsupprted..");
                    }
                    ;
                    return false;
                }
                var pWorker = (new Worker(this._sDefaultScript));
                pWorker.id = this._pWorkerList.length;
                pWorker.send = (pWorker).postMessage;
                this._pWorkerList.push(pWorker);
                this._pStatsList.push({
                    status: EThreadStatuses.k_WorkerFree,
                    creationTime: (Date.now()),
                    releaseTime: (Date.now())
                });
                if (this._pWorkerList.length == 1) {
                    this.startSystemRoutine();
                }
                return true;
            };
            ThreadManager.prototype.occupyThread = function () {
                var pStats;
                for(var i = 0, n = this._pWorkerList.length; i < n; ++i) {
                    pStats = this._pStatsList[i];
                    if (pStats.status == EThreadStatuses.k_WorkerFree) {
                        pStats.status = EThreadStatuses.k_WorkerBusy;
                        pStats.releaseTime = 0;
                        return this._pWorkerList[i];
                    }
                }
                if (this.createThread()) {
                    return this.occupyThread();
                } else {
 {
                        util.logger.setSourceLocation("util/ThreadManager.ts", 119);
                        util.logger.warning("cannot occupy thread");
                    }
                    ;
                    return null;
                }
            };
            ThreadManager.prototype.terminateThread = function (iThread) {
                var pStats = this._pStatsList[iThread];
                var pWorker = this._pWorkerList[iThread];
                if (!((pWorker) != null) && pStats.status != EThreadStatuses.k_WorkerFree) {
                    return false;
                }
                (pWorker).terminate();
                this._pStatsList.splice(iThread, 1);
                this._pWorkerList.splice(iThread, 1);
                if (this._pWorkerList.length == 0) {
                    this.stopSystemRoutine();
                }
                return true;
            };
            ThreadManager.prototype.checkWaiters = function (pThread) {
                if (typeof pThread === "undefined") { pThread = null; }
                if (this._pWaiters.length == 0) {
                    return;
                }
                if (((pThread) === null)) {
                    pThread = this.occupyThread();
                }
                if (!((pThread) === null)) {
                    (this._pWaiters.shift())(pThread);
                    return;
                }
                // console.log("unreleased threads: ", this.countUnreleasedThreds());
                return;
            };
            ThreadManager.prototype.waitForThread = // private countUnreleasedThreds(): uint {
            // 	var t = 0;
            // 	var pStats: IThreadStats;
            // 	for (var i: int = 0, n: int = this._pWorkerList.length; i < n; ++i) {
            // 		pStats = this._pStatsList[i];
            //         if (pStats.status != EThreadStatuses.k_WorkerFree) {
            //         	t ++;
            //         }
            //     }
            //     return t;
            // }
            function (fnWaiter) {
                if (!(/*checked (origin: akra)>>*/akra.typeOf((fnWaiter)) === "function")) {
                    return -1;
                }
                this._pWaiters.push(fnWaiter);
                this.checkWaiters();
                return this._pWaiters.length;
            };
            ThreadManager.prototype.releaseThread = function (pThread) {
                var iThread;
                var pStats;
                if (!(typeof (pThread) === "number")) {
                    iThread = pThread.id;
                } else {
                    iThread = pThread;
                }
                if (((this._pStatsList[iThread]) !== undefined)) {
                    pStats = this._pStatsList[iThread];
                    pStats.status = EThreadStatuses.k_WorkerFree;
                    pStats.releaseTime = (Date.now());
                    this.checkWaiters();
                    return true;
                }
                return false;
            };
            ThreadManager.prototype.initialize = function () {
                return true;
            };
            ThreadManager.prototype.destroy = function () {
            };
            ThreadManager.prototype.getGuid = /** @inline */function () {
                return this._iGuid;
            };
            ThreadManager._pEventTable = new akra.events.EventTable();
            ThreadManager.prototype.getEventTable = /** @inline */function () {
                return ThreadManager._pEventTable;
            };
            ThreadManager.prototype.connect = /** @inline */function (pSender, sSignal, sSlot, eType) {
                return pSender.getEventTable().addDestination((((pSender))._iGuid), sSignal, this, sSlot, eType);
            };
            ThreadManager.prototype.disconnect = /** @inline */function (pSender, sSignal, sSlot, eType) {
                return pSender.getEventTable().removeDestination((((pSender))._iGuid), sSignal, this, sSlot, eType);
            };
            ThreadManager.prototype.bind = /** @inline */function (sSignal, fnListener, eType) {
                return (ThreadManager._pEventTable).addListener(((this)._iGuid), sSignal, fnListener, eType);
            };
            ThreadManager.prototype.unbind = /** @inline */function (sSignal, fnListener, eType) {
                return (ThreadManager._pEventTable).removeListener(((this)._iGuid), sSignal, fnListener, eType);
            };
            ThreadManager.prototype._syncTable = /** @inline */function (pFrom) {
                (ThreadManager._pEventTable)._sync(this, pFrom);
            };
            return ThreadManager;
        })();
        util.ThreadManager = ThreadManager;        
        // BROADCAST(threadReleased, VOID);
            })(akra.util || (akra.util = {}));
    var util = akra.util;
})(akra || (akra = {}));
var akra;
(function (akra) {
    //переносим все зависисмости в папку js паки с данными
    //обычно, это data/js
    /// @: {data}/js/FileInterface.t.js|src(inc/io/FileInterface.t.js)|data_location({data},DATA)
    /// @FILE_LOCAL_THREAD: {data}/js/LocalFile.t.js|src(inc/io/LocalFile.t.js)|data_location({data},DATA)
    /// @FILE_REMOTE_THREAD: {data}/js/RemoteFile.t.js|src(inc/io/RemoteFile.t.js)|data_location({data},DATA)
    (function (io) {
        (function (EFileActions) {
            EFileActions._map = [];
            EFileActions.k_Open = 1;
            EFileActions.k_Read = 2;
            EFileActions._map[3] = "k_Write";
            EFileActions.k_Write = 3;
            EFileActions._map[4] = "k_Clear";
            EFileActions.k_Clear = 4;
            EFileActions._map[5] = "k_Exists";
            EFileActions.k_Exists = 5;
            EFileActions._map[6] = "k_Remove";
            EFileActions.k_Remove = 6;
        })(io.EFileActions || (io.EFileActions = {}));
        var EFileActions = io.EFileActions;
        ;
        (function (EFileTransferModes) {
            EFileTransferModes._map = [];
            EFileTransferModes._map[0] = "k_Normal";
            EFileTransferModes.k_Normal = 0;
            EFileTransferModes._map[1] = "k_Fast";
            EFileTransferModes.k_Fast = 1;
            EFileTransferModes._map[2] = "k_Slow";
            EFileTransferModes.k_Slow = 2;
        })(io.EFileTransferModes || (io.EFileTransferModes = {}));
        var EFileTransferModes = io.EFileTransferModes;
        var pLocalFileThreadManager = new akra.util.ThreadManager(akra.DATA + "/js/LocalFile.t.js");
        var pRemoteFileThreadManager = new akra.util.ThreadManager(akra.DATA + "/js/RemoteFile.t.js");
        io.getLocalFileThreadManager = /** @inline */function () {
            return pLocalFileThreadManager;
        };
        io.getRemoteFileThreadManager = /** @inline */function () {
            return pRemoteFileThreadManager;
        };
        var TFile = (function () {
            function TFile(sFilename, sMode, fnCallback) {
                if (typeof fnCallback === "undefined") { fnCallback = TFile.defaultCallback; }
                /**@protected*/ this._pUri = null;
                /**@protected*/ this._nCursorPosition = 0;
                /**@protected*/ this._bOpened = false;
                /**@protected*/ this._eTransferMode = EFileTransferModes.k_Normal;
                /**@protected*/ this._pFileMeta = null;
                /**@protected*/ this._isLocal = false;
                if (((sMode) !== undefined)) {
                    this._iMode = (typeof (sMode) === "string") ? io.filemode(sMode) : sMode;
                }
                this.setAndValidateUri((new /*checked (origin: path)>>*/akra.path.URI((sFilename))));
                if (akra.info.api.transferableObjects) {
                    this._eTransferMode = EFileTransferModes.k_Fast;
                }
                //OPERA MOVED TO WEBKIT, and this TRAP not more be needed!
                // else if (info.browser.name == "Opera") {
                // 	this._eTransferMode = EFileTransferModes.k_Slow;
                // }
                if (arguments.length > 2) {
                    this.open(sFilename, sMode, fnCallback);
                }
            }
            Object.defineProperty(TFile.prototype, "path", {
                get: /** @inline */function () {
                    //ASSERT(isDefAndNotNull(this._pFileMeta), "There is no file handle open.");
                    return this._pUri.toString();
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(TFile.prototype, "name", {
                get: /** @inline */function () {
                    return akra.path.info(this._pUri.path).basename;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(TFile.prototype, "mode", {
                get: /** @inline */function () {
                    return this._iMode;
                },
                set: //set mode(sMode: string);
                //set mode(iMode: int);
                function (sMode) {
                    this._iMode = (typeof (sMode) === "string") ? io.filemode(sMode) : sMode;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(TFile.prototype, "meta", {
                get: /** @inline */function () {
 {
                        akra.logger.setSourceLocation("TFile.ts", 97);
                        akra.logger.assert(((this._pFileMeta) != null), 'There is no file handle open.');
                    }
                    ;
                    return this._pFileMeta;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(TFile.prototype, "onread", {
                set: /** @inline */function (fnCallback) {
                    this.read(fnCallback);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(TFile.prototype, "onopen", {
                set: /** @inline */function (fnCallback) {
                    this.open(fnCallback);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(TFile.prototype, "position", {
                get: /** @inline */function () {
 {
                        akra.logger.setSourceLocation("TFile.ts", 116);
                        akra.logger.assert(((this._pFileMeta) != null), 'There is no file handle open.');
                    }
                    ;
                    return this._nCursorPosition;
                },
                set: function (iOffset) {
 {
                        akra.logger.setSourceLocation("TFile.ts", 121);
                        akra.logger.assert(((this._pFileMeta) != null), 'There is no file handle open.');
                    }
                    ;
                    this._nCursorPosition = iOffset;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(TFile.prototype, "byteLength", {
                get: /** @inline */function () {
                    return this._pFileMeta ? this._pFileMeta.size : 0;
                },
                enumerable: true,
                configurable: true
            });
            TFile.prototype.open = function (sFilename, iMode, fnCallback) {
                var pFile = this;
                var hasMode = !(/*checked (origin: akra)>>*/akra.typeOf((iMode)) === "function");
                if (arguments.length < 3) {
                    if ((typeof (arguments[0]) === "string")) {
                        this.setAndValidateUri((new /*checked (origin: path)>>*/akra.path.URI((sFilename))));
                        fnCallback = arguments[1];
                    } else if ((typeof (arguments[0]) === "number")) {
                        this._iMode = arguments[0];
                        fnCallback = arguments[1];
                    } else {
                        fnCallback = arguments[0];
                    }
 {
                        akra.logger.setSourceLocation("TFile.ts", 173);
                        akra.logger.assert(((this._pUri) != null), "No filename provided.");
                    }
                    ;
                    this.open(this._pUri.toString(), this._iMode, fnCallback);
                    return;
                }
                fnCallback = arguments[hasMode ? 2 : 1];
                fnCallback = fnCallback || TFile.defaultCallback;
                if (this.isOpened()) {
 {
                        akra.logger.setSourceLocation("TFile.ts", 185);
                        akra.logger.warning("file already opened: " + (/*checked (origin: akra)>>*/akra.path.info((this)._pUri.path).basename));
                    }
                    ;
                    (fnCallback).call(pFile, null, this._pFileMeta);
                }
                this.setAndValidateUri((new /*checked (origin: path)>>*/akra.path.URI((arguments[0]))));
                if (hasMode) {
                    this._iMode = ((typeof (arguments[1]) === "string") ? io.filemode(arguments[1]) : arguments[1]);
                }
                this.update(function (err) {
                    if (err) {
 {
                            akra.logger.setSourceLocation("TFile.ts", 197);
                            akra.logger.warning("file update err", err);
                        }
                        ;
                        fnCallback.call(pFile, err);
                        return;
                    }
                    if (((this._iMode & (1 << (3))) != 0)) {
                        this.position = this.size;
                    }
                    fnCallback.call(pFile, null, this._pFileMeta);
                });
            };
            TFile.prototype.close = function () {
                this._pUri = null;
                this._iMode = io.EIO.IN | io.EIO.OUT;
                this._nCursorPosition = 0;
                this._pFileMeta = null;
            };
            TFile.prototype.clear = function (fnCallback) {
                if (typeof fnCallback === "undefined") { fnCallback = TFile.defaultCallback; }
                if (!this.isOpened()) {
                    var _pArgv = arguments;
                    this.open(function (err) {
                        if (err) {
                            (fnCallback)(err);
                        }
                        this.clear.apply(this, _pArgv);
                    });
                    return;
                }
                ;
                var pCommand = {
                    act: EFileActions.k_Clear,
                    name: ((this)._pUri.toString()),
                    mode: this._iMode
                };
                this.execCommand(pCommand, fnCallback);
            };
            TFile.prototype.read = function (fnCallback, fnProgress) {
                if (typeof fnCallback === "undefined") { fnCallback = TFile.defaultCallback; }
                if (!this.isOpened()) {
                    var _pArgv = arguments;
                    this.open(function (err) {
                        if (err) {
                            (fnCallback)(err);
                        }
                        this.read.apply(this, _pArgv);
                    });
                    return;
                }
                ;
                var pFile = this;
                var eTransferMode = this._eTransferMode;
 {
                    akra.logger.setSourceLocation("TFile.ts", 239);
                    akra.logger.assert(((this._iMode & (1 << (0))) != 0), "The file is not readable.");
                }
                ;
                var pCommand = {
                    act: EFileActions.k_Read,
                    name: ((this)._pUri.toString()),
                    mode: this._iMode,
                    pos: this._nCursorPosition,
                    transfer: this._eTransferMode,
                    progress: ((fnProgress) != null)
                };
                var fnCallbackSystem = function (err, pData) {
                    if (err) {
                        fnCallback.call(pFile, err);
                        return;
                    }
                    if (pData.progress) {
                        fnProgress(pData.loaded, pData.total);
                        return false;
                    }
                    pFile.atEnd();
                    fnCallback.call(pFile, null, pData.data);
                };
                this.execCommand(pCommand, fnCallbackSystem);
            };
            TFile.prototype.write = function (pData, fnCallback, sContentType) {
                if (typeof fnCallback === "undefined") { fnCallback = TFile.defaultCallback; }
                if (!this.isOpened()) {
                    var _pArgv = arguments;
                    this.open(function (err) {
                        if (err) {
                            (fnCallback)(err);
                        }
                        this.write.apply(this, _pArgv);
                    });
                    return;
                }
                ;
                var pFile = this;
                var iMode = this._iMode;
                var pCommand;
                var fnCallbackSystem = function (err, pMeta) {
                    if (err) {
                        fnCallback.call(pFile, err);
                        return;
                    }
                    pFile.position += (typeof (pData) === "string") ? pData.length : pData.byteLength;
                    (pFile)._pFileMeta = pMeta;
                    fnCallback.call(pFile, null, pMeta);
                };
 {
                    akra.logger.setSourceLocation("TFile.ts", 289);
                    akra.logger.assert(((iMode & (1 << (1))) != 0), "The file is not writable.");
                }
                ;
                sContentType = sContentType || (((iMode & (1 << (5))) != 0) ? "application/octet-stream" : "text/plain");
                pCommand = {
                    act: EFileActions.k_Write,
                    name: ((this)._pUri.toString()),
                    mode: this._iMode,
                    data: pData,
                    contentType: sContentType,
                    pos: this._nCursorPosition
                };
                if (!(typeof (pData) === "string")) {
                    this.execCommand(pCommand, fnCallbackSystem, [
                        pData
                    ]);
                } else {
                    this.execCommand(pCommand, fnCallbackSystem);
                }
            };
            TFile.prototype.move = function (sFilename, fnCallback) {
                if (typeof fnCallback === "undefined") { fnCallback = TFile.defaultCallback; }
                var pFile = this;
                this.copy(sFilename, function (err) {
                    if (err) {
                        fnCallback(err);
                        return;
                    }
                    pFile.remove(fnCallback);
                });
            };
            TFile.prototype.copy = function (sFilename, fnCallback) {
                if (typeof fnCallback === "undefined") { fnCallback = TFile.defaultCallback; }
                var iMode = io.EIO.IN | io.EIO.OUT | io.EIO.TRUNC;
                var pFile = this;
                var pFileCopy;
                if (((this._iMode & (1 << (5))) != 0)) {
                    iMode |= io.EIO.BIN;
                }
                pFileCopy = new TFile(sFilename, iMode, function (err) {
                    if (err) {
                        fnCallback(err);
                    }
                    pFile.read(function (e, pData) {
                        pFile.write(pData, fnCallback);
                    });
                });
            };
            TFile.prototype.rename = function (sFilename, fnCallback) {
                if (typeof fnCallback === "undefined") { fnCallback = TFile.defaultCallback; }
                var pName = akra.path.info(sFilename);
 {
                    akra.logger.setSourceLocation("TFile.ts", 347);
                    akra.logger.assert(!pName.dirname, 'only filename can be specified.');
                }
                ;
                this.move(akra.path.info(this._pUri.path).dirname + "/" + pName.basename, fnCallback);
            };
            TFile.prototype.remove = function (fnCallback) {
                if (typeof fnCallback === "undefined") { fnCallback = TFile.defaultCallback; }
                if (!this.isOpened()) {
                    var _pArgv = arguments;
                    this.open(function (err) {
                        if (err) {
                            (fnCallback)(err);
                        }
                        this.remove.apply(this, _pArgv);
                    });
                    return;
                }
                ;
                var pFile = this;
                var pCommand = {
                    act: EFileActions.k_Remove,
                    name: ((this)._pUri.toString()),
                    mode: this._iMode
                };
                var fnCallbackSystem = function (err, pData) {
                    pFile.close();
                    if (((fnCallback) !== undefined)) {
                        fnCallback.call(pFile, err, pData);
                    }
                };
                this.execCommand(pCommand, fnCallbackSystem);
            };
            TFile.prototype.atEnd = //return current position
            function () {
                this.position = ((this)._pFileMeta ? (this)._pFileMeta.size : 0);
                return this._nCursorPosition;
            };
            TFile.prototype.seek = //return current position;
            function (iOffset) {
 {
                    akra.logger.setSourceLocation("TFile.ts", 379);
                    akra.logger.assert(((this._pFileMeta) != null), "There is no file handle open.");
                }
                ;
                var nSeek = this._nCursorPosition + iOffset;
                if (nSeek < 0) {
                    nSeek = ((this)._pFileMeta ? (this)._pFileMeta.size : 0) - (akra.math.abs(nSeek) % ((this)._pFileMeta ? (this)._pFileMeta.size : 0));
                }
 {
                    akra.logger.setSourceLocation("TFile.ts", 386);
                    akra.logger.assert(nSeek >= 0 && nSeek <= ((this)._pFileMeta ? (this)._pFileMeta.size : 0), "Invalid offset parameter");
                }
                ;
                this._nCursorPosition = nSeek;
                return this._nCursorPosition;
            };
            TFile.prototype.isOpened = function () {
                return this._pFileMeta !== null;
            };
            TFile.prototype.isExists = function (fnCallback) {
                var pCommand = {
                    act: EFileActions.k_Exists,
                    name: ((this)._pUri.toString()),
                    mode: this._iMode
                };
                this.execCommand(pCommand, fnCallback);
            };
            TFile.prototype.isLocal = /** @inline */function () {
                return this._isLocal;
            };
            TFile.prototype.getMetaData = function (fnCallback) {
 {
                    akra.logger.setSourceLocation("TFile.ts", 411);
                    akra.logger.assert(((this._pFileMeta) != null), 'There is no file handle open.');
                }
                ;
                fnCallback(null, {
                    lastModifiedDate: this._pFileMeta.lastModifiedDate
                });
            };
            TFile.prototype.setAndValidateUri = function (sFilename) {
                var pUri = (new /*checked (origin: path)>>*/akra.path.URI((sFilename)));
                var pUriLocal;
                if (pUri.scheme === "filesystem:") {
                    pUriLocal = (new /*checked (origin: path)>>*/akra.path.URI((pUri.path)));
                    // console.log(pUriLocal.toString());
                     {
                        akra.logger.setSourceLocation("TFile.ts", 426);
                        akra.logger.assert(!(pUriLocal.protocol && pUriLocal.host != akra.info.uri.host), "It supports only local files within the current domain.");
                    }
                    ;
                    var pFolders = pUriLocal.path.split('/');
                    if (pFolders[0] == "" || pFolders[0] == ".") {
                        pFolders = pFolders.slice(1);
                    }
 {
                        akra.logger.setSourceLocation("TFile.ts", 436);
                        akra.logger.assert(pFolders[0] === "temporary", "Supported only \"temporary\" filesystems. " + pUri.toString());
                    }
                    ;
                    //removing "temporary" from path...
                    pFolders = pFolders.slice(1);
                    this._pUri = (new /*checked (origin: path)>>*/akra.path.URI((pFolders.join("/"))));
                    // console.log(sFilename.toString(), "===>", this._pUri.toString());
                    this._isLocal = true;
                } else {
                    this._pUri = pUri;
                }
            };
            TFile.prototype.update = function (fnCallback) {
                if (typeof fnCallback === "undefined") { fnCallback = TFile.defaultCallback; }
                var pFile = this;
                var pCommand = {
                    act: EFileActions.k_Open,
                    name: this._pUri.toString(),
                    mode: this._iMode
                };
                var fnCallbackSystem = function (err, pMeta) {
                    (pFile)._pFileMeta = pMeta;
                    // console.log(pMeta);
                    fnCallback.call(pFile, err, pFile);
                };
                this.execCommand(pCommand, fnCallbackSystem);
            };
            TFile.prototype.execCommand = function (pCommand, fnCallback, pTransferables) {
                TFile.execCommand(this, ((this)._isLocal), pCommand, fnCallback, pTransferables);
            };
            TFile.defaultCallback = function (err) {
                if (err) {
                    throw err;
                }
            };
            TFile.execCommand = function execCommand(pFile, isLocal, pCommand, fnCallback, pTransferables) {
                // var pFile: IFile = this;
                var pManager = isLocal ? (pLocalFileThreadManager) : (pRemoteFileThreadManager);
                pManager.waitForThread(function (pThread) {
                    pThread.onmessage = function (e) {
                        if (fnCallback.call(pFile, null, e.data) === false) {
                            return;
                        }
                        pThread.onmessage = null;
                        pManager.releaseThread(pThread);
                    };
                    pThread.onerror = function (e) {
                        pThread.onmessage = null;
                        fnCallback.call(pFile, e);
                        pManager.releaseThread(pThread);
                    };
                    if (((pTransferables) !== undefined)) {
                        pThread.send(pCommand, pTransferables);
                    } else {
                        pThread.send(pCommand);
                    }
                });
            };
            return TFile;
        })();
        io.TFile = TFile;        
    })(akra.io || (akra.io = {}));
    var io = akra.io;
})(akra || (akra = {}));
var akra;
(function (akra) {
    /*local file via local files system(async)*/
    /**
    * FIle implementation via <Local filesystem>.
    * ONLY FOR LOCAL FILES!!
    */
    (function (io) {
        var LocalFileSystem = (function () {
            function LocalFileSystem() {
                // binaryType: EFileBinaryType = EFileBinaryType.ARRAY_BUFFER;
                this._pFileSystem = null;
                this._pCallbackQueue = [];
            }
            LocalFileSystem.prototype.setFileSystem = function (pFS) {
                this._pFileSystem = pFS;
            };
            LocalFileSystem.prototype.get = /**
            * Инициализация файловой системы.
            * @tparam Function fnCallback Функция, вызываемая
            * при успешной(получет в 1ом параметре fs)
            * инициализации системы.
            */
            function (fnCallback) {
                if (this._pFileSystem) {
                    fnCallback(this._pFileSystem);
                    return;
                }
                var pFileSystem = this;
                var pQueue = this._pCallbackQueue;
                pQueue.push(fnCallback);
                if (pQueue.length > 1) {
                    return;
                }
                window.storageInfo.requestQuota(window.TEMPORARY, (32 * 1024 * 1024), function (nGrantedBytes) {
                    window.requestFileSystem(window.TEMPORARY, nGrantedBytes, function (pFs) {
                        pFileSystem.setFileSystem(pFs);
                        if (pQueue.length) {
                            for(var i = 0; i < pQueue.length; ++i) {
                                pQueue[i](pFs);
                            }
                        }
                    }, LocalFileSystem.errorHandler);
                });
            };
            LocalFileSystem.errorHandler = function errorHandler(e) {
                var sMesg = "init filesystem: ";
                switch(e.code) {
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
 {
                    akra.logger.setSourceLocation("LocalFile.ts", 105);
                    akra.logger.error(sMesg);
                }
                ;
            };
            return LocalFileSystem;
        })();        
        var pLocalFileSystem = new LocalFileSystem();
        function getFileSystem(fnCallback) {
            pLocalFileSystem.get(fnCallback);
        }
        io.getFileSystem = getFileSystem;
        var LocalFile = (function () {
            function LocalFile(sFilename, sMode, fnCallback) {
                if (typeof fnCallback === "undefined") { fnCallback = LocalFile.defaultCallback; }
                this._nCursorPosition = 0;
                if (((sMode) !== undefined)) {
                    this._iMode = (typeof (sMode) === "string") ? io.filemode(sMode) : sMode;
                }
                this.setAndValidateUri((new /*checked (origin: path)>>*/akra.path.URI((sFilename))));
                if (arguments.length > 2) {
                    this.open(sFilename, sMode, fnCallback);
                }
            }
            Object.defineProperty(LocalFile.prototype, "path", {
                get: /** @inline */function () {
 {
                        akra.logger.setSourceLocation("LocalFile.ts", 129);
                        akra.logger.assert(((this._pFile) != null), "There is no file handle open.");
                    }
                    ;
                    return this._pUri.toString();
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(LocalFile.prototype, "name", {
                get: /** @inline */function () {
                    return akra.path.info(this._pUri.path).basename;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(LocalFile.prototype, "mode", {
                get: /** @inline */function () {
                    return this._iMode;
                },
                set: //set mode(sMode: string);
                //set mode(iMode: int);
                function (sMode) {
                    this._iMode = (typeof (sMode) === "string") ? io.filemode(sMode) : sMode;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(LocalFile.prototype, "meta", {
                get: /** @inline */function () {
                    return null;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(LocalFile.prototype, "onread", {
                set: /** @inline */function (fnCallback) {
                    this.read(fnCallback);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(LocalFile.prototype, "onopen", {
                set: /** @inline */function (fnCallback) {
                    this.open(fnCallback);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(LocalFile.prototype, "position", {
                get: /** @inline */function () {
 {
                        akra.logger.setSourceLocation("LocalFile.ts", 160);
                        akra.logger.assert(((this._pFile) != null), "There is no file handle open.");
                    }
                    ;
                    return this._nCursorPosition;
                },
                set: function (iOffset) {
 {
                        akra.logger.setSourceLocation("LocalFile.ts", 165);
                        akra.logger.assert(((this._pFile) != null), "There is no file handle open.");
                    }
                    ;
                    this._nCursorPosition = iOffset;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(LocalFile.prototype, "byteLength", {
                get: /** @inline */function () {
                    return this._pFile ? this._pFile.size : 0;
                },
                enumerable: true,
                configurable: true
            });
            LocalFile.prototype.open = function (sFilename, iMode, fnCallback) {
                var pFile = this;
                var hasMode = !(/*checked (origin: akra)>>*/akra.typeOf((iMode)) === "function");
                if (arguments.length < 3) {
                    if ((typeof (arguments[0]) === "string")) {
                        this.setAndValidateUri((new /*checked (origin: path)>>*/akra.path.URI((sFilename))));
                        fnCallback = arguments[1];
                    } else if ((typeof (arguments[0]) === "number")) {
                        this._iMode = arguments[0];
                        fnCallback = arguments[1];
                    } else {
                        fnCallback = arguments[0];
                    }
 {
                        akra.logger.setSourceLocation("LocalFile.ts", 211);
                        akra.logger.assert(((this._pUri) != null), "No filename provided.");
                    }
                    ;
                    this.open(this._pUri.toString(), this._iMode, fnCallback);
                    return;
                }
                fnCallback = arguments[hasMode ? 2 : 1];
                fnCallback = fnCallback || LocalFile.defaultCallback;
                if (this.isOpened()) {
 {
                        akra.logger.setSourceLocation("LocalFile.ts", 223);
                        akra.logger.warning("file already opened: " + (/*checked (origin: akra)>>*/akra.path.info((this)._pUri.path).basename));
                    }
                    ;
                    (fnCallback)(null, this._pFile);
                }
                this.setAndValidateUri((new /*checked (origin: path)>>*/akra.path.URI((arguments[0]))));
                if (hasMode) {
                    this._iMode = ((typeof (arguments[1]) === "string") ? io.filemode(arguments[1]) : arguments[1]);
                }
                var fnFSInited;
                var pFile = this;
                var pFileSystem = null;
                var fnErrorHandler = function (e) {
                    if (e.code == FileError.NOT_FOUND_ERR && ((pFile.mode & (1 << (1))) != 0)) {
                        LocalFile.createDir(pFileSystem.root, akra.path.info(pFile.path).dirname.split('/'), function (e) {
                            if (!((e) === null)) {
                                fnCallback.call(pFile, e);
                            } else {
                                fnFSInited.call(pFile, pFileSystem);
                            }
                        });
                    } else {
                        fnCallback.call(pFile, e);
                    }
                };
                fnFSInited = function (pFs) {
 {
                        akra.logger.setSourceLocation("LocalFile.ts", 257);
                        akra.logger.assert(((pFs) != null), "local file system not initialized");
                    }
                    ;
                    pFileSystem = pFs;
                    pFs.root.getFile(this.path, {
                        create: ((this._iMode & (1 << (1))) != 0),
                        exclusive: false
                    }, function (fileEntry) {
                        (pFile).setFileEntry(fileEntry);
                        (fileEntry).file(function (file) {
                            (pFile).setFile(file);
                            if (((pFile.mode & (1 << (4))) != 0) && pFile.byteLength) {
                                pFile.clear(function (err) {
                                    if (err) {
                                        fnCallback(err);
                                    } else {
                                        fnCallback.call(pFile, null, file);
                                    }
                                });
                                return;
                            }
                            if (((pFile.mode & (1 << (3))) != 0)) {
                                pFile.position = pFile.byteLength;
                            }
                            fnCallback.call(pFile, null, file);
                        }, fnErrorHandler);
                    }, fnErrorHandler);
                };
                getFileSystem(function (pFileSystem) {
                    fnFSInited.call(pFile, pFileSystem);
                });
            };
            LocalFile.prototype.close = function () {
                this._pUri = null;
                this._iMode = io.EIO.IN | io.EIO.OUT;
                this._nCursorPosition = 0;
                this._pFile = null;
            };
            LocalFile.prototype.clear = function (fnCallback) {
                if (typeof fnCallback === "undefined") { fnCallback = LocalFile.defaultCallback; }
                if (!this.isOpened()) {
                    var _pArgv = arguments;
                    this.open(function (err) {
                        if (err) {
                            (fnCallback)(err);
                        }
                        this.clear.apply(this, _pArgv);
                    });
                    return;
                }
                ;
 {
                    akra.logger.setSourceLocation("LocalFile.ts", 310);
                    akra.logger.assert(((this._pFile) != null), 'There is no file handle open');
                }
                ;
                var pFile = this;
                var pFileEntry = this._pFileEntry;
                pFileEntry.createWriter(function (pWriter) {
                    pWriter.seek(0);
                    pWriter.onwriteend = function () {
                        fnCallback.call(pFile, null);
                    };
                    pWriter.truncate(0);
                }, function (e) {
                    fnCallback.call(pFile, e);
                });
            };
            LocalFile.prototype.read = function (fnCallback) {
                if (typeof fnCallback === "undefined") { fnCallback = LocalFile.defaultCallback; }
                if (!this.isOpened()) {
                    var _pArgv = arguments;
                    this.open(function (err) {
                        if (err) {
                            (fnCallback)(err);
                        }
                        this.read.apply(this, _pArgv);
                    });
                    return;
                }
                ;
                var pFile = this;
                var eTransferMode = this._iMode;
 {
                    akra.logger.setSourceLocation("LocalFile.ts", 337);
                    akra.logger.assert(((this._iMode & (1 << (0))) != 0), "The file is not readable.");
                }
                ;
                var pReader = this._pFileReader;
                var pFileObject = this._pFile;
                pReader.onloadend = function (e) {
                    var pData = ((e.target)).result;
                    var nPos = pFile.position;
                    if (nPos) {
                        if (((pFile.mode & (1 << (5))) != 0)) {
                            pData = (new Uint8Array((new Uint8Array(pData)).subarray(nPos))).buffer;
                        } else {
                            pData = pData.substr(nPos);
                        }
                    }
                    pFile.atEnd();
                    fnCallback.call(pFile, null, pData);
                };
                if (((pFile.mode & (1 << (5))) != 0)) {
                    pReader.readAsArrayBuffer(pFileObject);
                } else {
                    pReader.readAsText(pFileObject);
                }
            };
            LocalFile.prototype.write = function (pData, fnCallback, sContentType) {
                if (typeof fnCallback === "undefined") { fnCallback = LocalFile.defaultCallback; }
                if (!this.isOpened()) {
                    var _pArgv = arguments;
                    this.open(function (err) {
                        if (err) {
                            (fnCallback)(err);
                        }
                        this.write.apply(this, _pArgv);
                    });
                    return;
                }
                ;
                var pFile = this;
                var iMode = this._iMode;
 {
                    akra.logger.setSourceLocation("LocalFile.ts", 376);
                    akra.logger.assert(((iMode & (1 << (1))) != 0), "The file is not writable.");
                }
                ;
                sContentType = sContentType || (((iMode & (1 << (5))) != 0) ? "application/octet-stream" : "text/plain");
                var pFile = this;
                var pFileEntry = this._pFileEntry;
                pFileEntry.createWriter(function (pWriter) {
                    pWriter.seek(pFile.position);
                    pWriter.onerror = function (e) {
                        fnCallback.call(pFileEntry, e);
                    };
                    pWriter.onwriteend = function () {
                        if (((iMode & (1 << (5))) != 0)) {
                            pFile.seek(pData.byteLength);
                        } else {
                            pFile.seek(pData.length);
                        }
                        fnCallback.call(pFile, null);
                    };
                    pWriter.write((new (Blob)(pData, {
                        type: sContentType
                    })));
                }, function (e) {
                    fnCallback.call(pFile, e);
                });
            };
            LocalFile.prototype.move = function (sFilename, fnCallback) {
                if (typeof fnCallback === "undefined") { fnCallback = LocalFile.defaultCallback; }
                var pFile = this;
                this.copy(sFilename, function (err) {
                    if (err) {
                        fnCallback(err);
                        return;
                    }
                    pFile.remove(fnCallback);
                });
            };
            LocalFile.prototype.copy = function (sFilename, fnCallback) {
                if (typeof fnCallback === "undefined") { fnCallback = LocalFile.defaultCallback; }
                var iMode = io.EIO.IN | io.EIO.OUT | io.EIO.TRUNC;
                var pFile = this;
                var pFileCopy;
                if (((this._iMode & (1 << (5))) != 0)) {
                    iMode |= io.EIO.BIN;
                }
                pFileCopy = new LocalFile(sFilename, iMode, function (e) {
                    if (e) {
                        fnCallback(e);
                    }
                    pFile.read(function (e, pData) {
                        pFile.write(pData, fnCallback);
                    });
                });
            };
            LocalFile.prototype.rename = function (sFilename, fnCallback) {
                if (typeof fnCallback === "undefined") { fnCallback = LocalFile.defaultCallback; }
                var pName = akra.path.info(sFilename);
 {
                    akra.logger.setSourceLocation("LocalFile.ts", 444);
                    akra.logger.assert(!pName.dirname, 'only filename can be specified.');
                }
                ;
                this.move(akra.path.info(this._pUri.path).dirname + "/" + pName.basename, fnCallback);
            };
            LocalFile.prototype.remove = function (fnCallback) {
                if (typeof fnCallback === "undefined") { fnCallback = LocalFile.defaultCallback; }
                if (!this.isOpened()) {
                    var _pArgv = arguments;
                    this.open(function (err) {
                        if (err) {
                            (fnCallback)(err);
                        }
                        this.remove.apply(this, _pArgv);
                    });
                    return;
                }
                ;
                var pFile = this;
                this._pFileEntry.remove(function () {
                    pFile.close();
                    fnCallback.call(pFile, null);
                }, fnCallback);
            };
            LocalFile.prototype.atEnd = //return current position
            function () {
                this.position = ((this)._pFile ? (this)._pFile.size : 0);
                return this._nCursorPosition;
            };
            LocalFile.prototype.seek = //return current position;
            function (iOffset) {
 {
                    akra.logger.setSourceLocation("LocalFile.ts", 467);
                    akra.logger.assert(((this._pFile) != null), "There is no file handle open.");
                }
                ;
                var nSeek = this._nCursorPosition + iOffset;
                if (nSeek < 0) {
                    nSeek = ((this)._pFile ? (this)._pFile.size : 0) - (akra.math.abs(nSeek) % ((this)._pFile ? (this)._pFile.size : 0));
                }
 {
                    akra.logger.setSourceLocation("LocalFile.ts", 474);
                    akra.logger.assert(nSeek >= 0 && nSeek <= ((this)._pFile ? (this)._pFile.size : 0), "Invalid offset parameter");
                }
                ;
                this._nCursorPosition = nSeek;
                return this._nCursorPosition;
            };
            LocalFile.prototype.isOpened = function () {
                return this._pFile !== null;
            };
            LocalFile.prototype.isExists = function (fnCallback) {
                this.open(function (e) {
                    fnCallback(((e) === null) ? true : false);
                });
            };
            LocalFile.prototype.isLocal = function () {
                return true;
            };
            LocalFile.prototype.getMetaData = function (fnCallback) {
 {
                    akra.logger.setSourceLocation("LocalFile.ts", 496);
                    akra.logger.assert(((this._pFile) != null), 'There is no file handle open.');
                }
                ;
                fnCallback(null, {
                    lastModifiedDate: this._pFile.lastModifiedDate
                });
            };
            LocalFile.prototype.setFileEntry = function (pFileEntry) {
                if (!((this._pFileEntry) === null)) {
                    return false;
                }
                this._pFileEntry = pFileEntry;
                return true;
            };
            LocalFile.prototype.setFile = function (pFile) {
                if (!((this._pFile) === null)) {
                    return false;
                }
                this._pFile = pFile;
                return true;
            };
            LocalFile.prototype.setAndValidateUri = function (sFilename) {
                var pUri = (new /*checked (origin: path)>>*/akra.path.URI((sFilename)));
                var pUriLocal;
                if (pUri.protocol === "filesystem") {
                    pUriLocal = (new /*checked (origin: path)>>*/akra.path.URI((pUri.path)));
 {
                        akra.logger.setSourceLocation("LocalFile.ts", 531);
                        akra.logger.assert(!(pUriLocal.protocol && pUriLocal.host != akra.info.uri.host), "Поддерживаются только локальные файлы в пределах текущего домена.");
                    }
                    ;
                    var pFolders = pUriLocal.path.split('/');
                    if (pFolders[0] == "" || pFolders[0] == ".") {
                        pFolders = pFolders.slice(1);
                    }
 {
                        akra.logger.setSourceLocation("LocalFile.ts", 540);
                        akra.logger.assert(pUri.host === "temporary", "Поддерживаются только файловые системы типа \"temporary\".");
                    }
                    ;
                    this._pUri = (new /*checked (origin: path)>>*/akra.path.URI((pFolders.join("/"))));
                } else {
 {
                        akra.logger.setSourceLocation("LocalFile.ts", 545);
                        akra.logger.error("used non local uri");
                    }
                    ;
                }
            };
            LocalFile.errorHandler = function errorHandler(e) {
                var sMesg = "";
                switch(e.code) {
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
 {
                    akra.logger.setSourceLocation("LocalFile.ts", 573);
                    akra.logger.error(sMesg);
                }
                ;
            };
            LocalFile.createDir = function createDir(pRootDirEntry, pFolders, fnCallback) {
                if (pFolders[0] == "." || pFolders[0] == "") {
                    pFolders = pFolders.slice(1);
                }
                pRootDirEntry.getDirectory(pFolders[0], {
                    create: true
                }, function (dirEntry) {
                    if (pFolders.length) {
                        LocalFile.createDir(dirEntry, pFolders.slice(1), fnCallback);
                    } else {
                        fnCallback(null);
                    }
                }, fnCallback);
            };
            LocalFile.defaultCallback = function (err) {
                if (err) {
                    LocalFile.errorHandler(err);
                }
            };
            return LocalFile;
        })();
        io.LocalFile = LocalFile;        
    })(akra.io || (akra.io = {}));
    var io = akra.io;
})(akra || (akra = {}));
var akra;
(function (akra) {
    /*local file via local files system(async)*/
    /**
    * FIle implementation via <Local Storage>.
    * ONLY FOR LOCAL FILES!!
    */
    (function (io) {
        var StorageFile = (function (_super) {
            __extends(StorageFile, _super);
            function StorageFile(sFilename, sMode, fnCallback) {
                if (typeof fnCallback === "undefined") { fnCallback = io.TFile.defaultCallback; }
                        _super.call(this, sFilename, sMode, fnCallback);
            }
            StorageFile.prototype.clear = function (fnCallback) {
                if (typeof fnCallback === "undefined") { fnCallback = io.TFile.defaultCallback; }
                if (!this.isOpened()) {
                    var _pArgv = arguments;
                    this.open(function (err) {
                        if (err) {
                            (fnCallback)(err);
                        }
                        this.clear.apply(this, _pArgv);
                    });
                    return;
                }
                ;
                localStorage.setItem(((this)._pUri.toString()), "");
                this._pFileMeta.size = 0;
                fnCallback(null, this);
            };
            StorageFile.prototype.read = function (fnCallback) {
                if (typeof fnCallback === "undefined") { fnCallback = io.TFile.defaultCallback; }
                if (!this.isOpened()) {
                    var _pArgv = arguments;
                    this.open(function (err) {
                        if (err) {
                            (fnCallback)(err);
                        }
                        this.read.apply(this, _pArgv);
                    });
                    return;
                }
                ;
 {
                    akra.logger.setSourceLocation("StorageFile.ts", 38);
                    akra.logger.assert(((this._iMode & (1 << (1))) != 0), "The file is not readable.");
                }
                ;
                var pData = this.readData();
                var nPos = this._nCursorPosition;
                if (nPos) {
                    if (((this._iMode & (1 << (5))) != 0)) {
                        pData = (new Uint8Array((new Uint8Array(pData)).subarray(nPos))).buffer;
                    } else {
                        pData = pData.substr(nPos);
                    }
                }
                this.atEnd();
                if (fnCallback) {
                    fnCallback.call(this, null, pData);
                }
            };
            StorageFile.prototype.write = function (pData, fnCallback, sContentType) {
                if (typeof fnCallback === "undefined") { fnCallback = io.TFile.defaultCallback; }
                if (!this.isOpened()) {
                    var _pArgv = arguments;
                    this.open(function (err) {
                        if (err) {
                            (fnCallback)(err);
                        }
                        this.write.apply(this, _pArgv);
                    });
                    return;
                }
                ;
                var iMode = this._iMode;
                var nSeek;
                var pCurrentData;
 {
                    akra.logger.setSourceLocation("StorageFile.ts", 68);
                    akra.logger.assert(((iMode & (1 << (1))) != 0), "The file is not writable.");
                }
                ;
                sContentType = sContentType || (((iMode & (1 << (5))) != 0) ? "application/octet-stream" : "text/plain");
                pCurrentData = this.readData();
                if (!(typeof (pCurrentData) === "string")) {
                    pCurrentData = akra.util.abtos(pCurrentData);
                }
                nSeek = ((typeof (pData) === "string") ? pData.length : pData.byteLength);
                if (!(typeof (pData) === "string")) {
                    pData = akra.util.abtos(pData);
                }
                pData = (pCurrentData).substr(0, this._nCursorPosition) + (pData) + (pCurrentData).substr(this._nCursorPosition + (pData).length);
                try  {
                    localStorage.setItem(((this)._pUri.toString()), pData);
                } catch (e) {
                    fnCallback(e);
                }
                this._pFileMeta.size = pData.length;
                this._nCursorPosition += nSeek;
                fnCallback(null);
            };
            StorageFile.prototype.isExists = function (fnCallback) {
                if (typeof fnCallback === "undefined") { fnCallback = io.TFile.defaultCallback; }
                fnCallback.call(this, null, localStorage.getItem(((this)._pUri.toString())) == null);
            };
            StorageFile.prototype.remove = function (fnCallback) {
                if (typeof fnCallback === "undefined") { fnCallback = io.TFile.defaultCallback; }
                localStorage.removeItem(((this)._pUri.toString()));
                fnCallback.call(this, null);
            };
            StorageFile.prototype.readData = function () {
                var pFileMeta = this._pFileMeta;
                var pData = localStorage.getItem(((this)._pUri.toString()));
                var pDataBin;
                if (pData == null) {
                    pData = "";
                    if (((this._iMode & (1 << (1))) != 0)) {
                        localStorage.setItem(((this)._pUri.toString()), pData);
                    }
                }
                if (((this._iMode & (1 << (5))) != 0)) {
                    pDataBin = akra.util.stoab(pData);
                    pFileMeta.size = pDataBin.byteLength;
                    return pDataBin;
                } else {
                    pFileMeta.size = pData.length;
                    return pData;
                }
                //return null;
                            };
            StorageFile.prototype.update = function (fnCallback) {
                this._pFileMeta = null;
                this.readData();
                fnCallback.call(this, null);
            };
            return StorageFile;
        })(io.TFile);
        io.StorageFile = StorageFile;        
    })(akra.io || (akra.io = {}));
    var io = akra.io;
})(akra || (akra = {}));
var akra;
(function (akra) {
    (function (io) {
        (function (EIO) {
            EIO._map = [];
            EIO.IN = 0x01;
            EIO.OUT = 0x02;
            EIO.ATE = 0x04;
            EIO.APP = 0x08;
            EIO.TRUNC = 0x10;
            EIO.BINARY = 0x20;
            EIO.TEXT = 0x40;
            EIO.JSON = 0x80;
            EIO.URL = 0x100;
            EIO.BIN = 0x20;
        })(io.EIO || (io.EIO = {}));
        var EIO = io.EIO;
        ;
        function filemode(sMode) {
            switch(sMode.toLowerCase()) {
                case //URL
                "a+u":
                    return EIO.IN | EIO.OUT | EIO.APP | EIO.URL;
                case "w+u":
                    return EIO.IN | EIO.OUT | EIO.TRUNC | EIO.URL;
                case "r+u":
                    return EIO.IN | EIO.OUT | EIO.URL;
                case "au":
                    return EIO.APP | EIO.URL;
                case "wu":
                    return EIO.OUT | EIO.URL;
                case "ru":
                    return EIO.IN | EIO.URL;
                    //JSON
                                    case "a+j":
                    return EIO.IN | EIO.OUT | EIO.APP | EIO.JSON;
                case "w+j":
                    return EIO.IN | EIO.OUT | EIO.TRUNC | EIO.JSON;
                case "r+j":
                    return EIO.IN | EIO.OUT | EIO.JSON;
                case "aj":
                    return EIO.APP | EIO.JSON;
                case "wj":
                    return EIO.OUT | EIO.JSON;
                case "rj":
                    return EIO.IN | EIO.JSON;
                    //TEXT
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
                    return EIO.OUT;
                case "r":
                default:
                    return EIO.IN;
            }
        }
        io.filemode = filemode;
        // function _fopen (sUri: string, iMode?: int): IFile;
        // function _fopen (sUri: string, sMode?: int): IFile;
        // function _fopen (pUri: IURI, iMode: int): IFile;
        // function _fopen (pUri: IURI, sMode: string): IFile;
        function _fopen(sUri, pMode) {
            if (typeof pMode === "undefined") { pMode = EIO.IN; }
            sUri = akra.path.resolve(sUri);
            if (akra.info.api.webWorker) {
                return new io.TFile(sUri, pMode);
            } else if (akra.info.api.fileSystem) {
                return new io.LocalFile(sUri, pMode);
            } else {
                return new io.StorageFile(sUri, pMode);
            }
        }
        io.fopen = _fopen;
    })(akra.io || (akra.io = {}));
    var io = akra.io;
})(akra || (akra = {}));
var akra;
(function (akra) {
    akra.fopen = akra.io.fopen;
})(akra || (akra = {}));
var akra;
(function (akra) {
    (function (util) {
        var EffectParser = (function (_super) {
            __extends(EffectParser, _super);
            function EffectParser() {
                        _super.call(this);
                this._pIncludedFilesMap = null;
                this.addAdditionalFunction("addType", this._addType);
                this.addAdditionalFunction("includeCode", this._includeCode);
            }
            EffectParser.prototype.defaultInit = /**@protected*/ function () {
                _super.prototype.defaultInit.call(this);
                this.addTypeId("float2");
                this.addTypeId("float3");
                this.addTypeId("float4");
                this.addTypeId("float2x2");
                this.addTypeId("float3x3");
                this.addTypeId("float4x4");
                this.addTypeId("int2");
                this.addTypeId("int3");
                this.addTypeId("int4");
                this.addTypeId("bool2");
                this.addTypeId("bool3");
                this.addTypeId("bool4");
                this._pIncludedFilesMap = {};
                this._pIncludedFilesMap[this.getParseFileName()] = true;
            };
            EffectParser.prototype._addIncludedFile = function (sFileName) {
                this._pIncludedFilesMap[sFileName] = true;
            };
            EffectParser.prototype._addType = function () {
                var pTree = ((this)._pSyntaxTree);
                var pNode = pTree.getLastNode();
                var sTypeId;
                sTypeId = pNode.children[pNode.children.length - 2].value;
                this.addTypeId(sTypeId);
                return akra.EOperationType.k_Ok;
            };
            EffectParser.prototype.normalizeIncludePath = function (sFile) {
                // console.log(sFile, this.getParseFileName(), path.resolve(sFile, this.getParseFileName()));
                return akra.path.resolve(sFile, this.getParseFileName());
            };
            EffectParser.prototype._includeCode = function () {
                var pTree = ((this)._pSyntaxTree);
                var pNode = pTree.getLastNode();
                var sFile = pNode.value;
                //cuttin qoutes
                sFile = this.normalizeIncludePath(sFile.substr(1, sFile.length - 2));
                if (this._pIncludedFilesMap[sFile]) {
                    return akra.EOperationType.k_Ok;
                } else {
                    var pParserState = this._saveState();
                    var me = this;
                    var pFile = akra.io.fopen(sFile, "r+t");
                    pFile.read(function (err, sData) {
                        if (err) {
 {
                                util.logger.setSourceLocation("../../../inc/util/EffectParser.ts", 85);
                                util.logger.error("Can not read file");
                            }
                            ;
                        } else {
                            pParserState.source = pParserState.source.substr(0, pParserState.index) + sData + pParserState.source.substr(pParserState.index);
                            me._loadState(pParserState);
                            me._addIncludedFile(sFile);
                            me.resume();
                        }
                    });
                    return akra.EOperationType.k_Pause;
                }
            };
            EffectParser.prototype._saveState = function () {
                var pState = _super.prototype._saveState.call(this);
                pState["includeFiles"] = this._pIncludedFilesMap;
                return pState;
            };
            EffectParser.prototype._loadState = function (pState) {
                _super.prototype._loadState.call(this, pState);
                this._pIncludedFilesMap = pState["includeFiles"];
            };
            return EffectParser;
        })(util.Parser);
        util.EffectParser = EffectParser;        
        util.parser = new EffectParser();
        function initAFXParser(sGrammar) {
            util.parser.init(sGrammar, akra.EParseMode.k_Add | akra.EParseMode.k_Negate | akra.EParseMode.k_Optimize | akra.EParseMode.k_DebugMode);
        }
        util.initAFXParser = initAFXParser;
    })(akra.util || (akra.util = {}));
    var util = akra.util;
})(akra || (akra = {}));
var akra;
(function (akra) {
    // var pHLSLGrammraFile: IFile = io.fopen("/akra-engine-core/src2/data/grammars/HLSL.gr", "r+t");
    // pHLSLGrammraFile.read(function(pErr: Error, sData: string){
    // 	if(!isNull(pErr)){
    // 		ERROR("Can not load grammar file.");
    // 	}
    // 	else {
    // 		LOG(sData);
    // 	}
    // });
    var client = new XMLHttpRequest();
    client.open('GET', '/akra-engine-core/src2/data/grammars/HLSL.gr');
    client.onreadystatechange = function () {
 {
            akra.logger.setSourceLocation("Z:/home/akra/www/akra-engine-core/src2/tests/common/parser/parser.ts", 19);
            akra.logger.log(client.responseText);
        }
        ;
    };
    client.send();
})(akra || (akra = {}));
