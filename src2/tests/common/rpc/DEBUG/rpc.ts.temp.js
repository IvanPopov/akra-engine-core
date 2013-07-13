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
                    akra.logger.setSourceLocation("common.ts", 425);
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
            pArgs.unshift(sourceLocationToString(pLogEntity.location));
            console["log"].apply(console, pArgs);
        }
        function warningRoutine(pLogEntity) {
            var pArgs = pLogEntity.info;
            pArgs.unshift("Code: " + pLogEntity.code.toString());
            pArgs.unshift(sourceLocationToString(pLogEntity.location));
            console["warn"].apply(console, pArgs);
        }
        function errorRoutine(pLogEntity) {
            var pArgs = pLogEntity.info;
            pArgs.unshift(pLogEntity.message);
            pArgs.unshift("Error code: " + pLogEntity.code.toString() + ".");
            pArgs.unshift(sourceLocationToString(pLogEntity.location));
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
    (function (util) {
        window.prompt = function (message, defaul) {
            console.warn("prompt > " + message);
            return null;
        };
        /*window.alert = function(message?: string): void {
        console.warn("alert > " + message);
        }*/
        window.confirm = function (message) {
            console.warn("confirm > " + message);
            return false;
        };
        var pTestCondList = [];
        var pTestList = [];
        var isPassed;
        var pTest = null;
        var iBegin;
        function addCond(pCond) {
            pTestCondList.unshift(pCond);
        }
        var TestCond = (function () {
            function TestCond(sDescription) {
                this.sDescription = sDescription;
            }
            TestCond.prototype.toString = function () {
                return this.sDescription;
            };
            TestCond.prototype.verify = function (pArgv) {
                return false;
            };
            Object.defineProperty(TestCond.prototype, "description", {
                get: function () {
                    return this.sDescription;
                },
                enumerable: true,
                configurable: true
            });
            return TestCond;
        })();        
        var ArrayCond = (function (_super) {
            __extends(ArrayCond, _super);
            function ArrayCond(sDescription, pArr) {
                        _super.call(this, sDescription);
                this._pArr = pArr;
            }
            ArrayCond.prototype.verify = function (pArgv) {
                var pArr = pArgv[0];
                if (pArr.length != this._pArr.length) {
                    return false;
                }
                for(var i = 0; i < pArr.length; ++i) {
                    if (pArr[i] != this._pArr[i]) {
                        return false;
                    }
                }
                ;
                return true;
            };
            return ArrayCond;
        })(TestCond);        
        var ValueCond = (function (_super) {
            __extends(ValueCond, _super);
            function ValueCond(sDescription, pValue, isNegate) {
                if (typeof isNegate === "undefined") { isNegate = false; }
                        _super.call(this, sDescription);
                this._pValue = pValue;
                this._isNegate = isNegate;
            }
            ValueCond.prototype.verify = function (pArgv) {
                var bResult = pArgv[0] === this._pValue;
                // console.warn(">", pArgv[0], "!==", this._pValue);
                return this._isNegate ? !bResult : bResult;
            };
            return ValueCond;
        })(TestCond);        
        // function output(sText: string): void {
        // 	document.body.innerHTML += sText;
        // }
        function output(sText) {
            var pElement = document.createElement("div");
            pElement.innerHTML = sText;
            document.body.appendChild(pElement);
        }
        function check() {
            var pArgv = [];
            for (var _i = 0; _i < (arguments.length - 0); _i++) {
                pArgv[_i] = arguments[_i + 0];
            }
            var pTest = pTestCondList.pop();
            var bResult;
            if (!pTest) {
                console.log(((new Error())).stack);
                console.warn("chech() without condition...");
                return;
            }
            bResult = pTest.verify(pArgv);
            isPassed = isPassed && bResult;
            if (bResult) {
                output("<pre style=\"margin: 0; margin-left: 20px;\"><span style=\"color: green;\"><b>[ PASSED ]</b></span> " + pTest.toString() + "</pre>");
            } else {
                output("<pre style=\"margin: 0; margin-left: 20px;\"><span style=\"color: red;\"><b>[ FAILED ]</b></span> " + pTest.toString() + "</pre>");
            }
        }
        util.check = check;
        function failed(e) {
            if (((e) !== undefined)) {
                printError(e.message, (e).stack);
            }
            var iTotal = pTestCondList.length;
            for(var i = 0; i < iTotal; ++i) {
                check(false);
            }
            isPassed = false;
            pTest = null;
            printResults();
            run();
        }
        util.failed = failed;
        function shouldBeTrue(sDescription) {
            addCond(new ValueCond(sDescription, true));
        }
        util.shouldBeTrue = shouldBeTrue;
        function shouldBeFalse(sDescription) {
            addCond(new ValueCond(sDescription, false));
        }
        util.shouldBeFalse = shouldBeFalse;
        function shouldBeArray(sDescription, pArr) {
            addCond(new ArrayCond(sDescription, pArr));
        }
        util.shouldBeArray = shouldBeArray;
        function shouldBe(sDescription, pValue) {
            addCond(new ValueCond(sDescription, pValue));
        }
        util.shouldBe = shouldBe;
        function shouldBeNotNull(sDescription) {
            addCond(new ValueCond(sDescription, null, true));
        }
        util.shouldBeNotNull = shouldBeNotNull;
                        function test(manifest, fnWrapper, isAsync) {
            if (typeof isAsync === "undefined") { isAsync = false; }
            var pManifest;
            if ((typeof (manifest) === "string")) {
                pManifest = {
                    name: arguments[0],
                    description: null,
                    entry: fnWrapper
                };
            } else {
                pManifest = arguments[0];
                pManifest.entry = fnWrapper;
            }
            pManifest.async = isAsync;
            pTestList.unshift(pManifest);
        }
        util.test = test;
        function printInfo() {
            output("<h4 style=\"font-family: monospace;\">" + pTest.name || "" + "</h4>");
        }
        function printResults() {
            output("<pre style=\"margin-left: 20px;\">" + "<hr align=\"left\" style=\"border: 0; background-color: gray; height: 1px; width: 500px;\"/><span style=\"color: gray;\">total time: " + ((Date.now()) - iBegin) + " msec" + "</span>" + "<br /><b>" + (isPassed ? "<span style=\"color: green\">TEST PASSED</span>" : "<span style=\"color: red\">TEST FAILED</span>") + "</b>" + "</pre>");
        }
        function printError(message, stack) {
            message = "<b>" + message + "</b>";
            if (((stack) !== undefined)) {
                message += "\n" + stack;
            }
            output("<pre style=\"margin-left: 20px;\">" + "<span style=\"color: red; background-color: rgba(255, 0, 0, .1);\">" + message + "</span>" + "</pre>");
        }
        function asyncTest(manifest, fnWrapper) {
            test(manifest, fnWrapper, true);
        }
        util.asyncTest = asyncTest;
        function run() {
            //если вдруг остались тесты.
            if (pTestCondList.length) {
                failed();
            }
            //если предыдущий тест был асинхронным, значит он кончился и надо распечатать результаты
            if (!((pTest) === null) && pTest.async == true) {
                printResults();
            }
            while(pTestList.length) {
                //начинаем новый тест
                pTest = pTestList.pop();
                iBegin = (Date.now());
                isPassed = true;
                printInfo();
                //start test
                try  {
                    pTest.entry();
                } catch (e) {
                    failed(e);
                    return;
                }
                if (!pTest.async) {
                    printResults();
                    pTest = null;
                } else {
                    return;
                }
            }
            ;
        }
        util.run = run;
        window.onload = function () {
            run();
        };
    })(akra.util || (akra.util = {}));
    var util = akra.util;
})(akra || (akra = {}));
var test = akra.util.test;
var asyncTest = akra.util.asyncTest;
var failed = akra.util.failed;
var run = akra.util.run;
var shouldBe = akra.util.shouldBe;
var shouldBeArray = akra.util.shouldBeArray;
var shouldBeTrue = akra.util.shouldBeTrue;
var shouldBeFalse = akra.util.shouldBeFalse;
var shouldBeNotNull = akra.util.shouldBeNotNull;
var check = akra.util.check;
var ok = check;
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
    // callOnce(sSignal: string, fnListener?: Function, eType?: EEventTypes): bool;
    })(akra || (akra = {}));
var akra;
(function (akra) {
    (function (ERPCPacketTypes) {
        ERPCPacketTypes._map = [];
        ERPCPacketTypes._map[0] = "FAILURE";
        ERPCPacketTypes.FAILURE = 0;
        ERPCPacketTypes._map[1] = "REQUEST";
        ERPCPacketTypes.REQUEST = 1;
        ERPCPacketTypes._map[2] = "RESPONSE";
        ERPCPacketTypes.RESPONSE = 2;
    })(akra.ERPCPacketTypes || (akra.ERPCPacketTypes = {}));
    var ERPCPacketTypes = akra.ERPCPacketTypes;
})(akra || (akra = {}));
var akra;
(function (akra) {
    (function (EPipeTypes) {
        EPipeTypes._map = [];
        EPipeTypes._map[0] = "UNKNOWN";
        EPipeTypes.UNKNOWN = 0;
        EPipeTypes._map[1] = "WEBSOCKET";
        /** Connect to websocket. */
        EPipeTypes.WEBSOCKET = 1;
        EPipeTypes._map[2] = "WEBWORKER";
        /** Connect to webworker. */
        EPipeTypes.WEBWORKER = 2;
    })(akra.EPipeTypes || (akra.EPipeTypes = {}));
    var EPipeTypes = akra.EPipeTypes;
    (function (EPipeDataTypes) {
        EPipeDataTypes._map = [];
        EPipeDataTypes._map[0] = "BINARY";
        EPipeDataTypes.BINARY = 0;
        EPipeDataTypes._map[1] = "STRING";
        EPipeDataTypes.STRING = 1;
    })(akra.EPipeDataTypes || (akra.EPipeDataTypes = {}));
    var EPipeDataTypes = akra.EPipeDataTypes;
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
        var Pathinfo = (function () {
            function Pathinfo(pPath) {
                this._sDirname = null;
                this._sExtension = null;
                this._sFilename = null;
                if (((pPath) !== undefined)) {
                    this.set(pPath);
                }
            }
            Object.defineProperty(Pathinfo.prototype, "path", {
                get: /** @inline */function () {
                    return this.toString();
                },
                set: /** @inline */function (sPath) {
                    this.set(sPath);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Pathinfo.prototype, "dirname", {
                get: /** @inline */function () {
                    return this._sDirname;
                },
                set: /** @inline */function (sDirname) {
                    this._sDirname = sDirname;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Pathinfo.prototype, "filename", {
                get: /** @inline */function () {
                    return this._sFilename;
                },
                set: /** @inline */function (sFilename) {
                    this._sFilename = sFilename;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Pathinfo.prototype, "ext", {
                get: /** @inline */function () {
                    return this._sExtension;
                },
                set: /** @inline */function (sExtension) {
                    this._sExtension = sExtension;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Pathinfo.prototype, "basename", {
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
            Pathinfo.prototype.set = function (sPath) {
                if ((typeof (sPath) === "string")) {
                    var pParts = sPath.replace('\\', '/').split('/');
                    /*not inlined, because supportes only single statement functions(cur. st. count: 3)*/this.basename = pParts.pop();
                    this._sDirname = pParts.join('/');
                } else if (sPath instanceof Pathinfo) {
                    this._sDirname = sPath.dirname;
                    this._sFilename = sPath.filename;
                    this._sExtension = sPath.ext;
                } else {
                    //critical_error
                     {
                        util.logger.setSourceLocation("Pathinfo.ts", 68);
                        util.logger.error("Unexpected data type was used.");
                    }
                    ;
                }
            };
            Pathinfo.prototype.isAbsolute = function () {
                return this._sDirname[0] === "/";
            };
            Pathinfo.prototype.toString = function () {
                return (this._sDirname ? this._sDirname + "/" : "") + ((((this)._sFilename ? (this)._sFilename + ((this)._sExtension ? "." + (this)._sExtension : "") : "")));
            };
            return Pathinfo;
        })();
        util.Pathinfo = Pathinfo;        
        // export var pathinfo: (sPath: string) => IPathinfo;
        // export var pathinfo: (pPath: IPathinfo) => IPathinfo;
        util.pathinfo;
        util.pathinfo = function (pPath) {
            return new Pathinfo(pPath);
        };
    })(akra.util || (akra.util = {}));
    var util = akra.util;
})(akra || (akra = {}));
var akra;
(function (akra) {
    akra.Pathinfo = akra.util.Pathinfo;
    akra.pathinfo = akra.util.pathinfo;
})(akra || (akra = {}));
var akra;
(function (akra) {
    (function (util) {
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
                        util.logger.setSourceLocation("URI.ts", 103);
                        util.logger.assert(pUri !== null, 'Invalid URI format used.\nused uri: ' + pData);
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
                    util.logger.setSourceLocation("URI.ts", 124);
                    util.logger.error('Unexpected data type was used.');
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
            URI.resolve = /*
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
            function resolve(sFile, sAbsolutePath) {
                if (typeof sAbsolutePath === "undefined") { sAbsolutePath = document.location.pathname; }
                var pCurrentPath = null;
                var pFile = (new /*checked (origin: akra)>>*/akra.util.URI((sFile)));
                if (!((pFile.host) === null) || akra.util.pathinfo(pFile.path).isAbsolute()) {
                    //another server or absolute path
                    return sFile;
                }
                pCurrentPath = (new /*checked (origin: akra)>>*/akra.util.URI((sAbsolutePath)));
                pCurrentPath.path = akra.util.pathinfo(pCurrentPath.path).dirname + "/" + sFile;
                // console.log(sFile, sAbsolutePath, pCurrentPath.toString());
                return pCurrentPath.toString();
            };
            return URI;
        })();
        util.URI = URI;        
        util.uri = /** @inline */function (sUri) {
            return new akra.util.URI(sUri);
        };
    })(akra.util || (akra.util = {}));
    var util = akra.util;
})(akra || (akra = {}));
var akra;
(function (akra) {
    akra.uri = akra.util.uri;
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
    (function (net) {
        /**@const*/ net.WEBSOCKET_PORT = 1337;
        var Pipe = (function () {
            function Pipe(sAddr) {
                if (typeof sAddr === "undefined") { sAddr = null; }
                /**@protected*/ this._pAddr = null;
                /** Number of sended messages.*/
                /**@protected*/ this._nMesg = 0;
                /**@protected*/ this._eType = akra.EPipeTypes.UNKNOWN;
                /**@protected*/ this._pConnect = null;
                /**@protected*/ this._bSetupComplete = false;
                /**@protected*/ this._iGuid = akra.sid();
                /**@protected*/ this._pUnicastSlotMap = null;
                /**@protected*/ this._pBroadcastSlotList = null;
                if (!((sAddr) === null)) {
                    this.open(sAddr);
                }
            }
            Object.defineProperty(Pipe.prototype, "uri", {
                get: /** @inline */function () {
                    return (new /*checked (origin: akra)>>*/akra.util.URI((this._pAddr.toString())));
                },
                enumerable: true,
                configurable: true
            });
            Pipe.prototype.open = function (sAddr) {
                if (typeof sAddr === "undefined") { sAddr = null; }
                var pAddr;
                var eType;
                var pSocket = null;
                var pWorker = null;
                var pPipe = this;
                if (!((sAddr) === null)) {
                    pAddr = (new /*checked (origin: akra)>>*/akra.util.URI((sAddr)));
                } else {
                    if ((!(((this)._pConnect) === null))) {
                        this.close();
                    }
                    pAddr = ((new /*checked (origin: akra)>>*/akra.util.URI(((this)._pAddr.toString()))));
                }
                // pipe to websocket
                if (pAddr.protocol.toLowerCase() === "ws") {
                    //unknown port
                    if (!(pAddr.port > 0)) {
                        pAddr.port = net.WEBSOCKET_PORT;
                    }
                    //websocket unsupported
                    if (!((WebSocket) != null)) {
 {
                            akra.logger.setSourceLocation("Pipe.ts", 64);
                            akra.logger.error("Your browser does not support websocket api.");
                        }
                        ;
                        return false;
                    }
                    pSocket = new WebSocket(pAddr.toString());
                    pSocket.binaryType = "arraybuffer";
                    eType = akra.EPipeTypes.WEBSOCKET;
                } else if (akra.util.pathinfo(pAddr.path).ext.toLowerCase() === "js") {
                    if (!((Worker) != null)) {
 {
                            akra.logger.setSourceLocation("Pipe.ts", 76);
                            akra.logger.error("Your browser does not support webworker api.");
                        }
                        ;
                        return false;
                    }
                    pWorker = new Worker(pAddr.toString());
                    eType = akra.EPipeTypes.WEBWORKER;
                } else {
 {
                        akra.logger.setSourceLocation("Pipe.ts", 84);
                        akra.logger.error("Pipe supported only websockets/webworkers.");
                    }
                    ;
                    return false;
                }
                this._pConnect = pWorker || pSocket;
                this._pAddr = pAddr;
                this._eType = eType;
                if (((window) != null)) {
                    window.onunload = function () {
                        pPipe.close();
                    };
                }
                if (!((this._pConnect) === null)) {
                    this.setupConnect();
                    return true;
                }
                return false;
            };
            Pipe.prototype.setupConnect = function () {
                var pConnect = this._pConnect;
                var pPipe = this;
                var pAddr = this._pAddr;
                if (this._bSetupComplete) {
                    return;
                }
                pConnect.onmessage = function (pMessage) {
                    if (((pMessage.data) instanceof ArrayBuffer)) {
                        pPipe.message(pMessage.data, akra.EPipeDataTypes.BINARY);
                    } else {
                        pPipe.message(pMessage.data, akra.EPipeDataTypes.STRING);
                    }
                };
                pConnect.onopen = function (pEvent) {
 {
                        akra.logger.setSourceLocation("Pipe.ts", 126);
                        akra.logger.log("created connect to: " + pAddr.toString());
                    }
                    ;
                    pPipe.opened(pEvent);
                };
                pConnect.onerror = function (pErr) {
 {
                        akra.logger.setSourceLocation("Pipe.ts", 132);
                        akra.logger.warning("pipe error detected: " + pErr.message);
                    }
                    ;
                    pPipe.error(pErr);
                };
                pConnect.onclose = function (pEvent) {
 {
                        akra.logger.setSourceLocation("Pipe.ts", 137);
                        akra.logger.log("connection to " + pAddr.toString() + " closed");
                    }
                    ;
 {
                        akra.logger.setSourceLocation("Pipe.ts", 138);
                        akra.logger.log("Close event:", pEvent);
                    }
                    ;
                    pPipe.closed(pEvent);
                };
                this._bSetupComplete = true;
            };
            Pipe.prototype.close = function () {
                var pSocket;
                var pWorker;
                if (this.isOpened()) {
                    switch(this._eType) {
                        case akra.EPipeTypes.WEBSOCKET:
                            pSocket = this._pConnect;
                            pSocket.onmessage = null;
                            pSocket.onerror = null;
                            pSocket.onopen = null;
                            pSocket.close();
                            break;
                        case akra.EPipeTypes.WEBWORKER:
                            pWorker = this._pConnect;
                            pWorker.terminate();
                    }
                }
                this._pConnect = null;
                this._bSetupComplete = false;
            };
            Pipe.prototype.write = function (pValue) {
                var pSocket;
                var pWorker;
                if (this.isOpened()) {
                    this._nMesg++;
                    switch(this._eType) {
                        case akra.EPipeTypes.WEBSOCKET:
                            pSocket = this._pConnect;
                            if (akra.isObject(pValue)) {
                                pValue = JSON.stringify(pValue);
                            }
                            pSocket.send(pValue);
                            return true;
                        case akra.EPipeTypes.WEBWORKER:
                            pWorker = this._pConnect;
                            if (((pValue.byteLength) !== undefined)) {
                                pWorker.postMessage(pValue, [
                                    pValue
                                ]);
                            } else {
                                pWorker.postMessage(pValue);
                            }
                            return true;
                    }
                }
                return false;
            };
            Pipe.prototype.isClosed = function () {
                switch(this._eType) {
                    case akra.EPipeTypes.WEBSOCKET:
                        return ((this._pConnect) === null) || ((this._pConnect).readyState === WebSocket.CLOSED);
                }
                return ((this._pConnect) === null);
            };
            Pipe.prototype.isOpened = function () {
                switch(this._eType) {
                    case akra.EPipeTypes.WEBSOCKET:
                        return !((this._pConnect) === null) && (this._pConnect).readyState === WebSocket.OPEN;
                }
                return !((this._pConnect) === null);
            };
            Pipe.prototype.isCreated = /** @inline */function () {
                return !((this._pConnect) === null);
            };
            Pipe.prototype.getGuid = /** @inline */function () {
                return this._iGuid;
            };
            Pipe._pEventTable = new akra.events.EventTable();
            Pipe.prototype.getEventTable = /** @inline */function () {
                return Pipe._pEventTable;
            };
            Pipe.prototype.connect = /** @inline */function (pSender, sSignal, sSlot, eType) {
                return pSender.getEventTable().addDestination((((pSender))._iGuid), sSignal, this, sSlot, eType);
            };
            Pipe.prototype.disconnect = /** @inline */function (pSender, sSignal, sSlot, eType) {
                return pSender.getEventTable().removeDestination((((pSender))._iGuid), sSignal, this, sSlot, eType);
            };
            Pipe.prototype.bind = /** @inline */function (sSignal, fnListener, eType) {
                return (Pipe._pEventTable).addListener(((this)._iGuid), sSignal, fnListener, eType);
            };
            Pipe.prototype.unbind = /** @inline */function (sSignal, fnListener, eType) {
                return (Pipe._pEventTable).removeListener(((this)._iGuid), sSignal, fnListener, eType);
            };
            Pipe.prototype._syncTable = /** @inline */function (pFrom) {
                (Pipe._pEventTable)._sync(this, pFrom);
            };
            Pipe.prototype.opened = function () {
                this._pBroadcastSlotList = this._pBroadcastSlotList || (((((Pipe._pEventTable))).broadcast[(this._iGuid)] = (((Pipe._pEventTable))).broadcast[(this._iGuid)] || {}));
                var _broadcast = (this._pBroadcastSlotList).opened;
                var _recivier = this;
                if (((_broadcast) !== undefined)) {
                    for(var i = 0; i < _broadcast.length; ++i) {
                        _broadcast[i].target ? _broadcast[i].target[_broadcast[i].callback](_recivier) : _broadcast[i].listener(_recivier);
                    }
                }
            };
            Pipe.prototype.closed = function (ev) {
                this._pBroadcastSlotList = this._pBroadcastSlotList || (((((Pipe._pEventTable))).broadcast[(this._iGuid)] = (((Pipe._pEventTable))).broadcast[(this._iGuid)] || {}));
                var _broadcast = (this._pBroadcastSlotList).closed;
                var _recivier = this;
                if (((_broadcast) !== undefined)) {
                    for(var i = 0; i < _broadcast.length; ++i) {
                        _broadcast[i].target ? _broadcast[i].target[_broadcast[i].callback](_recivier, ev) : _broadcast[i].listener(_recivier, ev);
                    }
                }
            };
            Pipe.prototype.error = function (err) {
                this._pBroadcastSlotList = this._pBroadcastSlotList || (((((Pipe._pEventTable))).broadcast[(this._iGuid)] = (((Pipe._pEventTable))).broadcast[(this._iGuid)] || {}));
                var _broadcast = (this._pBroadcastSlotList).error;
                var _recivier = this;
                if (((_broadcast) !== undefined)) {
                    for(var i = 0; i < _broadcast.length; ++i) {
                        _broadcast[i].target ? _broadcast[i].target[_broadcast[i].callback](_recivier, err) : _broadcast[i].listener(_recivier, err);
                    }
                }
            };
            Pipe.prototype.message = function (data, type) {
                this._pBroadcastSlotList = this._pBroadcastSlotList || (((((Pipe._pEventTable))).broadcast[(this._iGuid)] = (((Pipe._pEventTable))).broadcast[(this._iGuid)] || {}));
                var _broadcast = (this._pBroadcastSlotList).message;
                var _recivier = this;
                if (((_broadcast) !== undefined)) {
                    for(var i = 0; i < _broadcast.length; ++i) {
                        _broadcast[i].target ? _broadcast[i].target[_broadcast[i].callback](_recivier, data, type) : _broadcast[i].listener(_recivier, data, type);
                    }
                }
            };
            return Pipe;
        })();        
        function createPipe(sAddr) {
            if (typeof sAddr === "undefined") { sAddr = null; }
            return new Pipe(sAddr);
        }
        net.createPipe = createPipe;
    })(akra.net || (akra.net = {}));
    var net = akra.net;
})(akra || (akra = {}));
var akra;
(function (akra) {
    (function (util) {
        var ObjectArray = (function () {
            // set length(n: uint) {
            // 	if (this._bLock) {
            // 		return;
            // 	}
            // 	this.extend(n);
            // 	this._iLength = n;
            // }
            function ObjectArray(pElements) {
                /**@protected*/ this._pData = [];
                /**@protected*/ this._bLock = false;
                /**@protected*/ this._iLength = 0;
                if (arguments.length) {
                    this.fromArray(pElements);
                }
            }
            Object.defineProperty(ObjectArray.prototype, "length", {
                get: /** @inline */function () {
                    return this._iLength;
                },
                enumerable: true,
                configurable: true
            });
            ObjectArray.prototype.lock = /** @inline */function () {
                this._bLock = true;
            };
            ObjectArray.prototype.unlock = /** @inline */function () {
                this._bLock = false;
            };
            ObjectArray.prototype.isLocked = /** @inline */function () {
                return this._bLock;
            };
            ObjectArray.prototype.clear = function (bRemoveLinks) {
                if (typeof bRemoveLinks === "undefined") { bRemoveLinks = false; }
 {
                    util.logger.setSourceLocation("ObjectArray.ts", 47);
                    util.logger.assert(!this._bLock, "cannot clear. array is locked.");
                }
                ;
                this._iLength = 0;
                if (bRemoveLinks) {
                    for(var i = 0; i < this._pData.length; ++i) {
                        this._pData[i] = null;
                    }
                }
                return this;
            };
            ObjectArray.prototype.release = function () {
                this.clear(true);
                this._pData.clear();
                return this;
            };
            ObjectArray.prototype.value = /** @inline */function (n) {
                return this._pData[n];
            };
            ObjectArray.prototype.extend = function (n) {
                if (this._pData.length < n) {
                    //LOG("extending object array to > " + n);
                    for(var i = this._pData.length; i < n; ++i) {
                        this._pData[i] = null;
                    }
                }
            };
            ObjectArray.prototype.set = function (n, pData) {
 {
                    util.logger.setSourceLocation("ObjectArray.ts", 80);
                    util.logger.assert(!this._bLock, "cannot clear. array is locked.");
                }
                ;
                var N = n + 1;
                this.extend(N);
                if (this._iLength < N) {
                    this._iLength = N;
                }
                this._pData[n] = pData;
                return this;
            };
            ObjectArray.prototype.fromArray = function (pElements, iOffset, iSize) {
                if (typeof iOffset === "undefined") { iOffset = 0; }
                if (typeof iSize === "undefined") { iSize = 0; }
 {
                    util.logger.setSourceLocation("ObjectArray.ts", 96);
                    util.logger.assert(!this._bLock, "cannot clear. array is locked.");
                }
                ;
                iSize = iSize > 0 ? iSize < pElements.length ? iSize : pElements.length : pElements.length;
                this.extend(iSize);
                for(var i = iOffset, j = 0; i < iSize; ++i, ++j) {
                    this._pData[i] = pElements[j];
                }
                this._iLength = i;
                return this;
            };
            ObjectArray.prototype.push = /** @inline */function (pElement) {
 {
                    util.logger.setSourceLocation("ObjectArray.ts", 113);
                    util.logger.assert(!this._bLock, "cannot clear. array is locked.");
                }
                ;
                return this.set(this._iLength, pElement);
            };
            ObjectArray.prototype.pop = /** @inline */function () {
 {
                    util.logger.setSourceLocation("ObjectArray.ts", 119);
                    util.logger.assert(!this._bLock, "cannot clear. array is locked.");
                }
                ;
                return this._iLength > 0 ? this._pData[--this._iLength] : null;
            };
            ObjectArray.prototype.swap = /** @inline */function (i, j) {
 {
                    util.logger.setSourceLocation("ObjectArray.ts", 124);
                    util.logger.assert(!this._bLock, "cannot clear. array is locked.");
                }
                ;
 {
                    util.logger.setSourceLocation("ObjectArray.ts", 125);
                    util.logger.assert(i < this._iLength && j < this._iLength, "invalid swap index.");
                }
                ;
                this._pData.swap(i, j);
                return this;
            };
            ObjectArray.prototype.takeAt = function (iPos) {
                var pValue = ((this)._pData[(iPos)]);
                for(var i = iPos + 1, j = iPos; i < ((this)._iLength); ++i, ++j) {
                    this._pData[j] = this._pData[i];
                }
                this._iLength--;
                return pValue;
            };
            ObjectArray.prototype.indexOf = function (pObject) {
                for(var i = 0; i < this._iLength; i++) {
                    if (pObject === this._pData[i]) {
                        return i;
                    }
                }
                return -1;
            };
            return ObjectArray;
        })();
        util.ObjectArray = ObjectArray;        
    })(akra.util || (akra.util = {}));
    var util = akra.util;
})(akra || (akra = {}));
var akra;
(function (akra) {
    akra.ObjectArray = akra.util.ObjectArray;
})(akra || (akra = {}));
var akra;
(function (akra) {
    (function (util) {
        ;
        var ObjectList = (function () {
            function ObjectList(pData) {
                /**@protected*/ this._pHead = null;
                /**@protected*/ this._pTail = null;
                /**@protected*/ this._pCurrent = null;
                /**@protected*/ this._iLength = 0;
                /**@protected*/ this._bLock = false;
                if (arguments.length) {
                    this.fromArray(pData);
                }
            }
            Object.defineProperty(ObjectList.prototype, "length", {
                get: /** @inline */function () {
                    return this._iLength;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(ObjectList.prototype, "first", {
                get: /** @inline */function () {
                    this._pCurrent = this._pHead;
                    return (((this._pCurrent) != null)) ? this._pCurrent.data : null;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(ObjectList.prototype, "last", {
                get: /** @inline */function () {
                    this._pCurrent = this._pTail;
                    return (((this._pCurrent) != null)) ? this._pCurrent.data : null;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(ObjectList.prototype, "current", {
                get: /** @inline */function () {
                    return (((this._pCurrent) != null)) ? this._pCurrent.data : null;
                },
                enumerable: true,
                configurable: true
            });
            ObjectList.prototype.lock = /** @inline */function () {
                this._bLock = true;
            };
            ObjectList.prototype.unlock = /** @inline */function () {
                this._bLock = false;
            };
            ObjectList.prototype.isLocked = /** @inline */function () {
                return this._bLock;
            };
            ObjectList.prototype.value = /** @inline */function (n) {
                return /*not inlined, because supportes only single statement functions(cur. st. count: 3)*/this.find(n).data;
            };
            ObjectList.prototype.indexOf = function (pData, iFrom) {
                if (typeof iFrom === "undefined") { iFrom = 0; }
                var pItem = /*not inlined, because supportes only single statement functions(cur. st. count: 3)*/this.find(iFrom);
                for(var i = iFrom; i < this._iLength; i++) {
                    if (pItem.data === pData) {
                        return i;
                    }
                    pItem = pItem.next;
                }
                return -1;
            };
            ObjectList.prototype.mid = function (iPos, iSize) {
                if (typeof iPos === "undefined") { iPos = 0; }
                if (typeof iSize === "undefined") { iSize = this._iLength; }
                iSize = Math.min(this._iLength - iPos, iSize);
                if (iPos > this._iLength - 1) {
                    return null;
                }
                var pNewList = new ObjectList();
                var pItem = /*not inlined, because supportes only single statement functions(cur. st. count: 3)*/this.find(iPos);
                for(var i = 0; i < iSize; ++i) {
                    pNewList.push(pItem.data);
                    pItem = pItem.next;
                }
                ;
                return pNewList;
            };
            ObjectList.prototype.slice = /** @inline */function (iStart, iEnd) {
                if (typeof iStart === "undefined") { iStart = 0; }
                if (typeof iEnd === "undefined") { iEnd = Math.max(this._iLength - iStart, 0); }
                return this.mid(iStart, iEnd - iStart);
            };
            ObjectList.prototype.move = /** @inline */function (iFrom, iTo) {
                return this.insert(iTo - 1, /*not inlined, because supportes only single statement functions(cur. st. count: 5)*/this.takeAt(iFrom));
            };
            ObjectList.prototype.replace = /** @inline */function (iPos, pData) {
 {
                    util.logger.setSourceLocation("util/ObjectList.ts", 102);
                    util.logger.assert(!((this)._bLock), "list locked.");
                }
                ;
                /*not inlined, because supportes only single statement functions(cur. st. count: 3)*/this.find(iPos).data = pData;
                return this;
            };
            ObjectList.prototype.erase = function (begin, end) {
                if (arguments.length < 2) {
                    /*not inlined, because supportes only single statement functions(cur. st. count: 5)*/this.takeAt(arguments[0]);
                } else {
                    end = Math.min(end, this._iLength);
                    for(var i = begin; i < end; i++) {
                        /*not inlined, because supportes only single statement functions(cur. st. count: 5)*/this.takeAt(i);
                    }
                }
                return this;
            };
            ObjectList.prototype.contains = /** @inline */function (pData) {
                return (this.indexOf(pData) >= 0);
            };
            ObjectList.prototype.removeAt = /** @inline */function (n) {
                /*not inlined, because supportes only single statement functions(cur. st. count: 5)*/this.takeAt(n);
            };
            ObjectList.prototype.removeOne = /** @inline */function (pData) {
                (/*not inlined, because supportes only single statement functions(cur. st. count: 5)*/(this).takeAt((this.indexOf(pData))));
            };
            ObjectList.prototype.removeAll = /** @inline */function (pData) {
                var i;
                var n = ((this)._iLength);
                while((i = this.indexOf(pData)) >= 0) {
                    (/*not inlined, because supportes only single statement functions(cur. st. count: 5)*/(this).takeAt((i)));
                    i--;
                }
                return n;
            };
            ObjectList.prototype.swap = function (i, j) {
 {
                    util.logger.setSourceLocation("util/ObjectList.ts", 147);
                    util.logger.assert(!((this)._bLock), "list locked.");
                }
                ;
                i = Math.min(i, this._iLength - 1);
                j = Math.min(j, this._iLength - 1);
                if (i != j) {
                    var pItem1 = /*not inlined, because supportes only single statement functions(cur. st. count: 3)*/this.find(i);
                    var pItem2 = /*not inlined, because supportes only single statement functions(cur. st. count: 3)*/this.find(j);
                    var pTmp = pItem1.data;
                    pItem1.data = pItem2.data;
                    pItem2.data = pTmp;
                }
                return this;
            };
            ObjectList.prototype.add = function (pList) {
                pList.seek(0);
                if (pList.length > 1) {
                    ((this).insert((this)._iLength, (pList.first())));
                }
                for(var i = 1; i < pList.length; i++) {
                    ((this).insert((this)._iLength, (pList.next())));
                }
                return this;
            };
            ObjectList.prototype.seek = function (n) {
                if (typeof n === "undefined") { n = 0; }
                var pElement;
                n = Math.min(n, this._iLength - 1);
                if (n > this._iLength / 2) {
                    pElement = this._pTail;
                    for(var m = this._iLength - 1 - n; m > 0; --m) {
                        pElement = pElement.prev;
                    }
                } else {
                    pElement = this._pHead;
                    for(var i = 0; i < n; ++i) {
                        pElement = pElement.next;
                    }
                }
                this._pCurrent = pElement;
                return this;
            };
            ObjectList.prototype.next = /** @inline */function () {
                return (((this._pCurrent) != null) && ((this._pCurrent.next) != null)) ? (this._pCurrent = this._pCurrent.next).data : null;
            };
            ObjectList.prototype.prev = /** @inline */function () {
                return (((this._pCurrent) != null) && ((this._pCurrent.prev) != null)) ? (this._pCurrent = this._pCurrent.prev).data : null;
            };
            ObjectList.prototype.push = /** @inline */function (pElement) {
                return this.insert(this._iLength, pElement);
            };
            ObjectList.prototype.takeAt = /** @inline */function (n) {
 {
                    util.logger.setSourceLocation("util/ObjectList.ts", 217);
                    util.logger.assert(!((this)._bLock), "list locked.");
                }
                ;
                if (n < 0) {
                    return null;
                }
                return this.pullElement(/*not inlined, because supportes only single statement functions(cur. st. count: 3)*/this.find(n));
            };
            ObjectList.prototype.pullElement = function (pItem) {
                if (((pItem) === null)) {
                    //this case theoretically cannot happen, but ....
                    return null;
                }
                if (((pItem.prev) === null)) {
                    this._pHead = pItem.next;
                } else {
                    pItem.prev.next = pItem.next;
                }
                if (((pItem.next) === null)) {
                    this._pTail = pItem.prev;
                } else {
                    pItem.next.prev = pItem.prev;
                }
                this._iLength--;
                if (((pItem.next) === null)) {
                    this._pCurrent = this._pTail;
                } else {
                    this._pCurrent = pItem.next;
                }
                return /*not inlined, because supportes only single statement functions(cur. st. count: 7)*/this.releaseItem(pItem);
            };
            ObjectList.prototype.takeFirst = /** @inline */function () {
                return /*not inlined, because supportes only single statement functions(cur. st. count: 5)*/this.takeAt(0);
            };
            ObjectList.prototype.takeLast = /** @inline */function () {
                return /*not inlined, because supportes only single statement functions(cur. st. count: 5)*/this.takeAt(this._iLength - 1);
            };
            ObjectList.prototype.takeCurrent = /** @inline */function (isPrev) {
                if (typeof isPrev === "undefined") { isPrev = false; }
                //console.log(isDefAndNotNull(this._pCurrent));
                return this.pullElement(this._pCurrent);
            };
            ObjectList.prototype.pop = /** @inline */function () {
                return /*not inlined, because supportes only single statement functions(cur. st. count: 5)*/this.takeAt(this._iLength - 1);
            };
            ObjectList.prototype.prepend = /** @inline */function (pElement) {
                return this.insert(0, pElement);
            };
            ObjectList.prototype.find = /** @inline */function (n) {
                if (n < this._iLength) {
                    this.seek(n);
                    return this._pCurrent;
                }
                return null;
            };
            ObjectList.prototype.releaseItem = /** @inline */function (pItem) {
                var pData = pItem.data;
                pItem.next = null;
                pItem.prev = null;
                pItem.data = null;
                ObjectList.listItemPool.push(pItem);
                return pData;
            };
            ObjectList.prototype.createItem = /** @inline */function () {
                if (ObjectList.listItemPool.length == 0) {
                    // LOG("allocated object list item");
                    return {
                        next: null,
                        prev: null,
                        data: null
                    };
                }
                // LOG("before pop <----------", this._iLength, this.first);
                return ObjectList.listItemPool.pop();
            };
            ObjectList.prototype.fromArray = function (elements, iOffset, iSize) {
                if (typeof iOffset === "undefined") { iOffset = 0; }
                if (typeof iSize === "undefined") { iSize = elements.length; }
                iOffset = Math.min(iOffset, this._iLength);
                for(var i = 0; i < iSize; i++) {
                    this.insert(iOffset + i, elements[i]);
                }
                return this;
            };
            ObjectList.prototype.insert = function (n, pData) {
 {
                    util.logger.setSourceLocation("util/ObjectList.ts", 321);
                    util.logger.assert(!((this)._bLock), "list locked.");
                }
                ;
                var pNew = /*not inlined, because supportes only single statement functions(cur. st. count: 3)*/this.createItem();
                var pItem;
                n = Math.min(n, this._iLength);
                pNew.data = pData;
                if (n == 0) {
                    if (((this._pHead) === null)) {
                        this._pTail = pNew;
                    }
                    pNew.next = this._pHead;
                    this._pHead = pNew;
                } else {
                    pItem = /*not inlined, because supportes only single statement functions(cur. st. count: 3)*/this.find(n - 1);
                    if (pItem == null) {
                        this._pHead = pNew;
                    } else {
                        if (pItem.next == null) {
                            this._pTail = pNew;
                        } else {
                            pNew.next = pItem.next;
                            pItem.next.prev = pNew;
                        }
                        pItem.next = pNew;
                        pNew.prev = pItem;
                    }
                }
                this._iLength++;
                this._pCurrent = pNew;
                return this;
            };
            ObjectList.prototype.isEqual = function (pList) {
                if (this._iLength == pList.length) {
                    if (this === pList) {
                        return true;
                    }
                    var l1 = /*not inlined, because supportes only single statement functions(cur. st. count: 3)*/this.first;
                    var l2 = pList.first;
                    for(var i = 0; i < this._iLength; ++i) {
                        if (l1 != l2) {
                            return false;
                        }
                        l1 = (((((this)._pCurrent) != null) && (((this)._pCurrent.next) != null)) ? ((this)._pCurrent = (this)._pCurrent.next).data : null);
                        l2 = pList.next();
                    }
                    return true;
                }
                return false;
            };
            ObjectList.prototype.clear = function () {
 {
                    util.logger.setSourceLocation("util/ObjectList.ts", 390);
                    util.logger.assert(!((this)._bLock), "list locked.");
                }
                ;
                var pPrev;
                var pNext;
                this._pCurrent = this._pHead;
                for(var i = 0; i < this._iLength; ++i) {
                    pPrev = this._pCurrent;
                    pNext = this._pCurrent = this._pCurrent.next;
                    /*not inlined, because supportes only single statement functions(cur. st. count: 7)*/this.releaseItem(pPrev);
                }
                this._pHead = this._pCurrent = this._pTail = null;
                this._iLength = 0;
                return this;
            };
            ObjectList.prototype.forEach = function (fn) {
                var pItem = this._pHead;
                var n = 0;
                do {
                    if (fn(pItem.data, n++) === false) {
                        return;
                    }
                } while((pItem = pItem.next));
            };
            ObjectList.listItemPool = new util.ObjectArray();
            return ObjectList;
        })();
        util.ObjectList = ObjectList;        
    })(akra.util || (akra.util = {}));
    var util = akra.util;
})(akra || (akra = {}));
var akra;
(function (akra) {
    akra.ObjectList = akra.util.ObjectList;
})(akra || (akra = {}));
var akra;
(function (akra) {
    /// @: {data}/server|src(inc/net/server)|location()|data_location({data},DATA)
    (function (net) {
        var ERpcStates;
        (function (ERpcStates) {
            ERpcStates._map = [];
            ERpcStates._map[0] = "k_Deteached";
            //not connected
            ERpcStates.k_Deteached = 0;
            ERpcStates._map[1] = "k_Joined";
            //connected, and connection must be established
            ERpcStates.k_Joined = 1;
            ERpcStates._map[2] = "k_Closing";
            //must be closed
            ERpcStates.k_Closing = 2;
        })(ERpcStates || (ERpcStates = {}));
        var RPC = (function () {
            function RPC(pAddr, pOption) {
                if (typeof pAddr === "undefined") { pAddr = null; }
                if (typeof pOption === "undefined") { pOption = {}; }
                /**@protected*/ this._pPipe = null;
                /**@protected*/ this._iGroupID = -1;
                /**@protected*/ this._pGroupCalls = null;
                //стек вызововы, которые были отложены
                /**@protected*/ this._pDefferedRequests = new akra.ObjectList();
                //стек вызовов, ожидающих результата
                //type: ObjectList<IRPCCallback>
                /**@protected*/ this._pCallbacks = new akra.ObjectList();
                //число совершенных вызовов
                /**@protected*/ this._nCalls = 0;
                /**@protected*/ this._pRemoteAPI = {};
                /**@protected*/ this._eState = ERpcStates.k_Deteached;
                //rejoin timer
                /**@protected*/ this._iReconnect = -1;
                //timer for system routine
                /**@protected*/ this._iSystemRoutine = -1;
                /**@protected*/ this._iGroupCallRoutine = -1;
                /**@protected*/ this._iGuid = akra.sid();
                /**@protected*/ this._pUnicastSlotMap = null;
                /**@protected*/ this._pBroadcastSlotList = null;
                for(var i in RPC.OPTIONS) {
                    if (!((pOption[i]) !== undefined)) {
                        pOption[i] = RPC.OPTIONS[i];
                    }
                }
                this._pOption = pOption;
                if (!((pOption.procMap) != null)) {
                    pOption.procMap = {};
                }
                pOption.procMap[pOption.procListName] = {
                    lifeTime: -1,
                    priority: 10
                };
                pAddr = pAddr || pOption.addr;
                if (((pAddr) != null)) {
                    this.join(pAddr);
                }
            }
            Object.defineProperty(RPC.prototype, "remote", {
                get: /** @inline */function () {
                    return this._pRemoteAPI;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(RPC.prototype, "options", {
                get: /** @inline */function () {
                    return this._pOption;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(RPC.prototype, "group", {
                get: /** @inline */function () {
                    return !((this._pGroupCalls) === null) ? this._iGroupID : -1;
                },
                enumerable: true,
                configurable: true
            });
            RPC.prototype.join = function (sAddr) {
                if (typeof sAddr === "undefined") { sAddr = null; }
                var pPipe = this._pPipe;
                var pRPC = this;
                var pDeffered = this._pDefferedRequests;
                if (((pPipe) === null)) {
                    pPipe = akra.net.createPipe();
                    pPipe.bind("message", function (pPipe, pMessage, eType) {
                        // LOG(pMessage);
                        if (eType !== akra.EPipeDataTypes.BINARY) {
                            pRPC.parse(JSON.parse(pMessage));
                        } else {
                            pRPC.parseBinary(new Uint8Array(pMessage));
                        }
                    });
                    pPipe.bind("opened", function (pPipe, pEvent) {
                        pRPC._startRoutines();
                        //if we have unhandled call in deffered...
                        if (pDeffered.length) {
                            pDeffered.seek(0);
                            while(pDeffered.length > 0) {
                                pPipe.write(pDeffered.current);
                                pRPC._releaseRequest(pDeffered.takeCurrent());
                            }
 {
                                akra.logger.setSourceLocation("net/RPC.ts", 122);
                                akra.logger.assert(pDeffered.length === 0, "something going wrong. length is: " + pDeffered.length);
                            }
                            ;
                        }
                        pRPC.proc((pRPC._pOption).procListName, function (pError, pList) {
                            if (!((pError) === null)) {
 {
                                    akra.logger.setSourceLocation("net/RPC.ts", 128);
                                    akra.logger.criticalError("could not get proc. list");
                                }
                                ;
                            }
                            //TODO: FIX akra. prefix...
                            if (!((pList) === null) && akra.isArray(pList)) {
                                for(var i = 0; i < pList.length; ++i) {
                                    (function (sMethod) {
                                        (pRPC._pOption).procMap[sMethod] = (pRPC._pOption).procMap[sMethod] || {
                                            lifeTime: -1,
                                            priority: 0
                                        };
                                        (pRPC._pRemoteAPI)[sMethod] = function () {
                                            var pArguments = [
                                                sMethod
                                            ];
                                            for(var j = 0; j < arguments.length; ++j) {
                                                pArguments.push(arguments[j]);
                                            }
                                            return pRPC.proc.apply(pRPC, pArguments);
                                        };
                                    })(String(pList[i]));
                                }
                                // debug_print("rpc options: ", pRPC.options);
                                                            }
                            pRPC.joined();
                        });
                    });
                    pPipe.bind("error", function (pPipe, pError) {
 {
                            akra.logger.setSourceLocation("net/RPC.ts", 164);
                            akra.logger.error("pipe error occured...");
                        }
                        ;
                        //pRPC.rejoin();
                                            });
                    pPipe.bind("closed", function (pPipe, pEvent) {
                        pRPC._stopRoutines();
                        pRPC.rejoin();
                    });
                }
                pPipe.open(sAddr);
                this._pPipe = pPipe;
                this._eState = ERpcStates.k_Joined;
            };
            RPC.prototype.rejoin = function () {
                var pRPC = this;
                clearTimeout(this._iReconnect);
                //rejoin not needed, because pipe already connected
                if (this._pPipe.isOpened()) {
                    this._eState = ERpcStates.k_Joined;
                    return;
                }
                //rejoin not needed, because we want close connection
                if (this._eState == ERpcStates.k_Closing) {
                    this._eState = ERpcStates.k_Deteached;
                    return;
                }
                if (this._pPipe.isClosed()) {
                    //callbacks that will not be called, because connection was lost
                    this.freeCallbacks();
                    if ((((this)._pOption).reconnectTimeout > 0)) {
                        this._iReconnect = setTimeout(/** @inline */function () {
                            pRPC.join();
                        }, ((this)._pOption).reconnectTimeout);
                    }
                }
            };
            RPC.prototype.parse = function (pRes) {
                if (!((pRes.n) !== undefined)) {
 {
                        akra.logger.setSourceLocation("net/RPC.ts", 214);
                        akra.logger.log(pRes);
                    }
                    ;
 {
                        akra.logger.setSourceLocation("net/RPC.ts", 215);
                        akra.logger.warning("message droped, because seriial not recognized.");
                    }
                    ;
                }
                ;
                this.response(pRes.n, pRes.type, pRes.res);
            };
            RPC.prototype.parseBinary = function (pBuffer) {
                var iHeaderByteLength = 12;
                var pHeader = new Uint32Array(pBuffer.buffer, pBuffer.byteOffset, iHeaderByteLength / 4);
                var nMsg = pHeader[0];
                var eType = pHeader[1];
                var iByteLength = pHeader[2];
                var pResult = pBuffer.subarray(iHeaderByteLength, iHeaderByteLength + iByteLength);
                this.response(nMsg, eType, pResult);
                var iPacketByteLength = iHeaderByteLength + iByteLength;
                if (pBuffer.byteLength > iPacketByteLength) {
                    // console.log("group message detected >> ");
                    this.parseBinary(pBuffer.subarray(iPacketByteLength));
                }
            };
            RPC.prototype.response = function (nSerial, eType, pResult) {
                var pStack = this._pCallbacks;
                var fn = null;
                if (eType === akra.ERPCPacketTypes.RESPONSE) {
                    var pCallback = pStack.last;
                    // WARNING("---------------->",nSerial,"<-----------------");
                    // LOG(pStack.length);
                    do {
                        // LOG("#n: ", nSerial, " result: ", pResult);
                        if (pCallback.n === nSerial) {
                            fn = pCallback.fn;
                            this._releaseCallback(pStack.takeCurrent());
                            if (!((fn) === null)) {
                                fn(null, pResult);
                            }
                            return;
                        }
                    } while(pCallback = pStack.prev());
                    // WARNING("package droped, invalid serial: " + nSerial);
                                    } else if (eType === akra.ERPCPacketTypes.REQUEST) {
 {
                        akra.logger.setSourceLocation("net/RPC.ts", 268);
                        akra.logger.error("TODO: REQUEST package type temprary unsupported.");
                    }
                    ;
                } else if (eType === akra.ERPCPacketTypes.FAILURE) {
 {
                        akra.logger.setSourceLocation("net/RPC.ts", 271);
                        akra.logger.error("detected FAILURE on " + nSerial + " package");
                    }
                    ;
 {
                        akra.logger.setSourceLocation("net/RPC.ts", 272);
                        akra.logger.log(pResult);
                    }
                    ;
                } else {
 {
                        akra.logger.setSourceLocation("net/RPC.ts", 275);
                        akra.logger.error("unsupported response type detected: " + eType);
                    }
                    ;
                }
            };
            RPC.prototype.freeRequests = function () {
                var pStack = this._pDefferedRequests;
                var pReq = pStack.first;
                if (pReq) {
                    do {
                        this._releaseRequest(pReq);
                    } while(pReq = pStack.next());
                    pStack.clear();
                }
            };
            RPC.prototype.freeCallbacks = function () {
                var pStack = this._pCallbacks;
                var pCallback = pStack.first;
                if (pCallback) {
                    do {
                        this._releaseCallback(pCallback);
                    } while(pCallback = pStack.next());
                    pStack.clear();
                }
            };
            RPC.prototype.free = function () {
                this.freeRequests();
                this.freeCallbacks();
            };
            RPC.prototype.detach = function () {
                this._eState = ERpcStates.k_Closing;
                if (!((this._pPipe) === null) && this._pPipe.isOpened()) {
                    this._pPipe.close();
                }
                this.free();
            };
            RPC.prototype.findLifeTimeFor = /** @inline */function (sProc) {
                var pProcOpt = this._pOption.procMap[sProc];
                if (pProcOpt) {
                    var iProcLt = pProcOpt.lifeTime;
                    if (iProcLt >= 0) {
                        return iProcLt;
                    }
                }
                return this._pOption.callbackLifetime;
            };
            RPC.prototype.findPriorityFor = function (sProc) {
                var pProcOpt = this._pOption.procMap[sProc];
                if (pProcOpt) {
                    var iProcPr = pProcOpt.priority || 0;
                    return iProcPr;
                }
                return 0;
            };
            RPC.prototype.setProcedureOption = function (sProc, sOpt, pValue) {
                var pOptions = ((this)._pOption).procMap[sProc];
                if (!pOptions) {
                    pOptions = ((this)._pOption).procMap[sProc] = {
                        lifeTime: -1
                    };
                }
                pOptions[sOpt] = pValue;
            };
            RPC.prototype.proc = function () {
                var argv = [];
                for (var _i = 0; _i < (arguments.length - 0); _i++) {
                    argv[_i] = arguments[_i + 0];
                }
                var IRPCCallback = arguments.length - 1;
                var fnCallback = (/*checked (origin: akra)>>*/akra.typeOf((arguments[IRPCCallback])) === "function") ? arguments[IRPCCallback] : null;
                var nArg = arguments.length - (fnCallback ? 2 : 1);
                var pArgv = new Array(nArg);
                var pPipe = this._pPipe;
                var pCallback = null;
                for(var i = 0; i < nArg; ++i) {
                    pArgv[i] = arguments[i + 1];
                }
                var pProc = this._createRequest();
                pProc.n = this._nCalls++;
                pProc.type = akra.ERPCPacketTypes.REQUEST;
                pProc.proc = String(arguments[0]);
                pProc.argv = pArgv;
                pProc.next = null;
                pProc.lt = /*not inlined, because supportes only single statement functions(cur. st. count: 4)*/this.findLifeTimeFor(pProc.proc);
                pProc.pr = this.findPriorityFor(pProc.proc);
                pCallback = this._createCallback();
                pCallback.n = pProc.n;
                pCallback.fn = fnCallback;
                pCallback.timestamp = (Date.now());
                pCallback.procInfo = pProc.proc + "(" + pArgv.join(',') + ")";
                if (((pPipe) === null) || !pPipe.isOpened()) {
                    if (!(((this)._pOption).deferredCallsLimit >= 0) || this._pDefferedRequests.length <= ((this)._pOption).deferredCallsLimit) {
                        this._pDefferedRequests.push(pProc);
                        this._pCallbacks.push(pCallback);
                    } else {
                        pCallback.fn(RPC.ERRORS.STACK_SIZE_EXCEEDED);
 {
                            akra.logger.setSourceLocation("net/RPC.ts", 398);
                            akra.logger.warning(RPC.ERRORS.STACK_SIZE_EXCEEDED);
                        }
                        ;
                        this._releaseCallback(pCallback);
                        this._releaseRequest(pProc);
                    }
                    return false;
                }
                this._pCallbacks.push(pCallback);
                return this.callProc(pProc);
            };
            RPC.prototype.callProc = function (pProc) {
                var pPipe = this._pPipe;
                var bResult = false;
                if ((((this)._pOption).callsFrequency > 0)) {
                    if (((this._pGroupCalls) === null)) {
                        this._pGroupCalls = pProc;
                        this._iGroupID++;
                    } else {
                        pProc.next = this._pGroupCalls;
                        this._pGroupCalls = pProc;
                    }
                    return true;
                } else {
                    bResult = pPipe.write(pProc);
                    this._releaseRequest(pProc);
                }
                return bResult;
            };
            RPC.prototype._systemRoutine = /** @inline */function () {
                this._removeExpiredCallbacks();
            };
            RPC.prototype._startRoutines = function () {
                var pRPC = this;
                if ((((this)._pOption).systemRoutineInterval > 0)) {
                    this._iSystemRoutine = setInterval(/** @inline */function () {
                        (pRPC._removeExpiredCallbacks());
                    }, ((this)._pOption).systemRoutineInterval);
                }
                if ((((this)._pOption).callsFrequency > 0)) {
                    this._iGroupCallRoutine = setInterval(/** @inline */function () {
                        pRPC.groupCall();
                    }, ((this)._pOption).callsFrequency);
                }
            };
            RPC.prototype._stopRoutines = function () {
                clearInterval(this._iSystemRoutine);
                ((this)._removeExpiredCallbacks());
                clearInterval(this._iGroupCallRoutine);
                //TODO: remove calls from group call, if RPC finally detached!
                            };
            RPC.prototype.groupCall = function () {
                var pReq = this._pGroupCalls;
                if (((pReq) === null)) {
                    return;
                }
                this._pPipe.write(pReq);
                return this.dropGroupCall();
            };
            RPC.prototype.dropGroupCall = function () {
                var pReq = this._pGroupCalls;
                for(; ; ) {
                    var pNext = pReq.next;
                    this._releaseRequest(pReq);
                    if (!pNext) {
                        break;
                    }
                    pReq = pNext;
                }
                this._pGroupCalls = null;
                return this._iGroupID;
            };
            RPC.prototype._removeExpiredCallbacks = function () {
                var pCallbacks = this._pCallbacks;
                var pCallback = pCallbacks.first;
                var iNow = (Date.now());
                var fn = null;
                var sInfo = null;
                while(!((pCallback) === null)) {
                    if ((((this)._pOption).callbackLifetime > 0) && (iNow - pCallback.timestamp) >= ((this)._pOption).callbackLifetime) {
                        fn = pCallback.fn;
                        sInfo = pCallback.procInfo;
                        this._releaseCallback(pCallbacks.takeCurrent());
                        pCallback = pCallbacks.current;
                        if (!((fn) === null)) {
                            // debug_print("procedure info: ", sInfo);
                            fn(RPC.ERRORS.CALLBACK_LIFETIME_EXPIRED, null);
                        }
                    } else {
                        pCallback = pCallbacks.next();
                    }
                }
            };
            RPC.prototype._releaseRequest = function (pReq) {
                pReq.n = 0;
                pReq.proc = null;
                pReq.argv = null;
                pReq.next = null;
                pReq.lt = 0;
                pReq.pr = 0;
                RPC.requestPool.push(pReq);
            };
            RPC.prototype._createRequest = function () {
                if (RPC.requestPool.length == 0) {
                    // LOG("allocated rpc request");
                    return {
                        n: 0,
                        type: akra.ERPCPacketTypes.REQUEST,
                        proc: null,
                        argv: null,
                        next: null,
                        lt: 0,
                        pr: 0
                    };
                }
                return RPC.requestPool.pop();
            };
            RPC.prototype._releaseCallback = function (pCallback) {
                pCallback.n = 0;
                pCallback.fn = null;
                pCallback.timestamp = 0;
                pCallback.procInfo = null;
                RPC.callbackPool.push(pCallback);
            };
            RPC.prototype._createCallback = function () {
                if (RPC.callbackPool.length == 0) {
                    // LOG("allocated callback");
                    return {
                        n: 0,
                        fn: null,
                        timestamp: 0,
                        procInfo: null
                    };
                }
                return RPC.callbackPool.pop();
            };
            RPC.prototype.getGuid = /** @inline */function () {
                return this._iGuid;
            };
            RPC._pEventTable = new akra.events.EventTable();
            RPC.prototype.getEventTable = /** @inline */function () {
                return RPC._pEventTable;
            };
            RPC.prototype.connect = /** @inline */function (pSender, sSignal, sSlot, eType) {
                return pSender.getEventTable().addDestination((((pSender))._iGuid), sSignal, this, sSlot, eType);
            };
            RPC.prototype.disconnect = /** @inline */function (pSender, sSignal, sSlot, eType) {
                return pSender.getEventTable().removeDestination((((pSender))._iGuid), sSignal, this, sSlot, eType);
            };
            RPC.prototype.bind = /** @inline */function (sSignal, fnListener, eType) {
                return (RPC._pEventTable).addListener(((this)._iGuid), sSignal, fnListener, eType);
            };
            RPC.prototype.unbind = /** @inline */function (sSignal, fnListener, eType) {
                return (RPC._pEventTable).removeListener(((this)._iGuid), sSignal, fnListener, eType);
            };
            RPC.prototype._syncTable = /** @inline */function (pFrom) {
                (RPC._pEventTable)._sync(this, pFrom);
            };
            RPC.prototype.joined = function () {
                this._pBroadcastSlotList = this._pBroadcastSlotList || (((((RPC._pEventTable))).broadcast[(this._iGuid)] = (((RPC._pEventTable))).broadcast[(this._iGuid)] || {}));
                var _broadcast = (this._pBroadcastSlotList).joined;
                var _recivier = this;
                if (((_broadcast) !== undefined)) {
                    for(var i = 0; i < _broadcast.length; ++i) {
                        _broadcast[i].target ? _broadcast[i].target[_broadcast[i].callback](_recivier) : _broadcast[i].listener(_recivier);
                    }
                }
            };
            RPC.requestPool = new akra.ObjectArray();
            RPC.callbackPool = new akra.ObjectArray();
            RPC.OPTIONS = {
                deferredCallsLimit: 20000,
                reconnectTimeout: 2500,
                systemRoutineInterval: 10000,
                callbackLifetime: 60000,
                procListName: "proc_list",
                callsFrequency: -1
            };
            RPC.ERRORS = {
                STACK_SIZE_EXCEEDED: new Error("stack size exceeded"),
                CALLBACK_LIFETIME_EXPIRED: new Error("procedure life time expired")
            };
            return RPC;
        })();        
                        function createRpc(addr, opt) {
            if (arguments.length == 1) {
                if ((typeof (addr) === "string")) {
                    return new RPC(addr);
                }
                return new RPC(null, arguments[0]);
            }
            return new RPC(addr, opt);
        }
        net.createRpc = createRpc;
    })(akra.net || (akra.net = {}));
    var net = akra.net;
})(akra || (akra = {}));
var akra;
(function (akra) {
    (function (util) {
        util.test("RPC tests", /** @inline */function () {
            var pRpc = akra.net.createRpc();
            var i = 0;
            pRpc.join("ws://192.168.88.53:6112");
            pRpc.bind("joined", function (pRpc) {
                setInterval(function () {
                    var iSendTime = (Date.now());
                    (function (n) {
                        pRpc.remote.echo(n, function (pErr, j) {
                            if (!((pErr) === null)) {
 {
                                    util.logger.setSourceLocation("C:/WebServers/home/akra/www/akra-engine-core/src2/tests/common/rpc/rpc.ts", 22);
                                    util.logger.warning(pErr.message);
                                }
                                ;
                                return;
                            }
                            util.shouldBeTrue("ping: " + ((Date.now()) - iSendTime) + " ms" + "[ echo: " + j + " ]");
                            util.check(n == j);
                        });
                    })(i++);
                }, 1000);
            });
        });
    })(akra.util || (akra.util = {}));
    var util = akra.util;
})(akra || (akra = {}));
