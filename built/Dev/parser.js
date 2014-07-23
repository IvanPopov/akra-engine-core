/// <reference path="../IMap.ts" />
var akra;
(function (akra) {
    (function (parser) {
        (function (ENodeCreateMode) {
            ENodeCreateMode[ENodeCreateMode["k_Default"] = 0] = "k_Default";
            ENodeCreateMode[ENodeCreateMode["k_Necessary"] = 1] = "k_Necessary";
            ENodeCreateMode[ENodeCreateMode["k_Not"] = 2] = "k_Not";
        })(parser.ENodeCreateMode || (parser.ENodeCreateMode = {}));
        var ENodeCreateMode = parser.ENodeCreateMode;

        (function (EParserCode) {
            EParserCode[EParserCode["k_Pause"] = 0] = "k_Pause";
            EParserCode[EParserCode["k_Ok"] = 1] = "k_Ok";
            EParserCode[EParserCode["k_Error"] = 2] = "k_Error";
        })(parser.EParserCode || (parser.EParserCode = {}));
        var EParserCode = parser.EParserCode;

        (function (EParserType) {
            EParserType[EParserType["k_LR0"] = 0] = "k_LR0";
            EParserType[EParserType["k_LR1"] = 1] = "k_LR1";
            EParserType[EParserType["k_LALR"] = 2] = "k_LALR";
        })(parser.EParserType || (parser.EParserType = {}));
        var EParserType = parser.EParserType;

        (function (EParseMode) {
            EParseMode[EParseMode["k_AllNode"] = 0x0001] = "k_AllNode";
            EParseMode[EParseMode["k_Negate"] = 0x0002] = "k_Negate";
            EParseMode[EParseMode["k_Add"] = 0x0004] = "k_Add";
            EParseMode[EParseMode["k_Optimize"] = 0x0008] = "k_Optimize";
            EParseMode[EParseMode["k_DebugMode"] = 0x0010] = "k_DebugMode";
        })(parser.EParseMode || (parser.EParseMode = {}));
        var EParseMode = parser.EParseMode;

        (function (ETokenType) {
            ETokenType[ETokenType["k_NumericLiteral"] = 1] = "k_NumericLiteral";
            ETokenType[ETokenType["k_CommentLiteral"] = 2] = "k_CommentLiteral";
            ETokenType[ETokenType["k_StringLiteral"] = 3] = "k_StringLiteral";
            ETokenType[ETokenType["k_PunctuatorLiteral"] = 4] = "k_PunctuatorLiteral";
            ETokenType[ETokenType["k_WhitespaceLiteral"] = 5] = "k_WhitespaceLiteral";
            ETokenType[ETokenType["k_IdentifierLiteral"] = 6] = "k_IdentifierLiteral";
            ETokenType[ETokenType["k_KeywordLiteral"] = 7] = "k_KeywordLiteral";
            ETokenType[ETokenType["k_Unknown"] = 8] = "k_Unknown";
            ETokenType[ETokenType["k_End"] = 9] = "k_End";
        })(parser.ETokenType || (parser.ETokenType = {}));
        var ETokenType = parser.ETokenType;

        (function (EOperationType) {
            EOperationType[EOperationType["k_Error"] = 100] = "k_Error";
            EOperationType[EOperationType["k_Shift"] = 101] = "k_Shift";
            EOperationType[EOperationType["k_Reduce"] = 102] = "k_Reduce";
            EOperationType[EOperationType["k_Success"] = 103] = "k_Success";
            EOperationType[EOperationType["k_Pause"] = 104] = "k_Pause";
            EOperationType[EOperationType["k_Ok"] = 105] = "k_Ok";
        })(parser.EOperationType || (parser.EOperationType = {}));
        var EOperationType = parser.EOperationType;
    })(akra.parser || (akra.parser = {}));
    var parser = akra.parser;
})(akra || (akra = {}));
var akra;
(function (akra) {
    (function (bf) {
        /**
        * Сдвиг единицы на @a x позиций влево.
        */
        bf.flag = function (x) {
            return (1 << (x));
        };

        /**
        * Проверка того что у @a value бит под номером @a bit равен единице.
        */
        bf.testBit = function (value, bit) {
            return ((value & bf.flag(bit)) != 0);
        };

        /**
        * Проверка того что у @a value равны единице все биты,
        * которые равны единице у @a set.
        */
        bf.testAll = function (value, set) {
            return (((value) & (set)) == (set));
        };

        /**
        * Проверка того что у @a value равны единице хотя бы какие то из битов,
        * которые равны единице у @a set.
        */
        bf.testAny = function (value, set) {
            return (((value) & (set)) != 0);
        };

        /**
        * Выставляет бит под номером @a bit у числа @a value равным единице
        */
        bf.setBit = function (value, bit, setting) {
            if (typeof setting === "undefined") { setting = true; }
            return (setting ? ((value) |= bf.flag((bit))) : bf.clearBit(value, bit));
        };

        /**
        *
        */
        bf.clearBit = function (value, bit) {
            return ((value) &= ~bf.flag((bit)));
        };

        /**
        * Выставляет бит под номером @a bit у числа @a value равным нулю
        */
        bf.setAll = function (value, set, setting) {
            if (typeof setting === "undefined") { setting = true; }
            return (setting ? ((value) |= (set)) : ((value) &= ~(set)));
        };

        /**
        * Выставляет все биты у числа @a value равными единице,
        * которые равны единице у числа @a set
        */
        bf.clearAll = function (value, set) {
            return ((value) &= ~(set));
        };

        /**
        * Выставляет все биты у числа @a value равными нулю,
        * которые равны единице у числа @a set
        */
        bf.equal = function (value, src) {
            value = src;
        };

        /**
        * Прирасваивает числу @a value число @a src
        */
        bf.isEqual = function (value, src) {
            return value == src;
        };

        /**
        * Если число @a value равно числу @a src возвращается true
        */
        bf.isNotEqaul = function (value, src) {
            return value != src;
        };

        /**
        * Прирасваивает числу @a value число @a src
        */
        bf.set = function (value, src) {
            value = src;
        };

        /**
        * Обнуляет число @a value
        */
        bf.clear = function (value) {
            value = 0;
        };

        /**
        * Выставляет все биты у числа @a value равными единице,
        * которые равны единице у числа @a src
        */
        bf.setFlags = function (value, src) {
            return (value |= src);
        };

        /**
        * Выставляет все биты у числа @a value равными нулю,
        * которые равны единице у числа @a src
        */
        bf.clearFlags = function (value, src) {
            return value &= ~src;
        };

        /**
        * Проверяет равно ли число @a value нулю. Если равно возвращает true.
        * Если не равно возвращает false.
        */
        bf.isEmpty = function (value) {
            return (value == 0);
        };

        /**
        * Возвращает общее количество бит числа @a value.
        * На самом деле возвращает всегда 32.
        */
        bf.totalBits = function (value) {
            return 32;
        };

        /**
        * Возвращает общее количество ненулевых бит числа @a value.
        */
        bf.totalSet = function (value) {
            var count = 0;
            var total = bf.totalBits(value);

            for (var i = total; i; --i) {
                count += (value & 1);
                value >>= 1;
            }

            return (count);
        };

        /**
        * Convert N bit colour channel value to P bits. It fills P bits with the
        * bit pattern repeated. (this is /((1<<n)-1) in fixed point)
        */
        function fixedToFixed(value, n, p) {
            if (n > p) {
                // Less bits required than available; this is easy
                value >>= n - p;
            } else if (n < p) {
                // More bits required than are there, do the fill
                // Use old fashioned division, probably better than a loop
                if (value == 0)
                    value = 0;
                else if (value == ((1) << n) - 1)
                    value = (1 << p) - 1;
                else
                    value = value * (1 << p) / ((1 << n) - 1);
            }
            return value;
        }
        bf.fixedToFixed = fixedToFixed;

        /**
        * Convert floating point colour channel value between 0.0 and 1.0 (otherwise clamped)
        * to integer of a certain number of bits. Works for any value of bits between 0 and 31.
        */
        function floatToFixed(value, bits) {
            if (value <= 0.0)
                return 0;
            else if (value >= 1.0)
                return (1 << bits) - 1;
            else
                return (value * (1 << bits));
        }
        bf.floatToFixed = floatToFixed;

        /**
        * Fixed point to float
        */
        function fixedToFloat(value, bits) {
            return (value & ((1 << bits) - 1)) / ((1 << bits) - 1);
        }
        bf.fixedToFloat = fixedToFloat;

        /**
        * Write a n*8 bits integer value to memory in native endian.
        */
        function intWrite(pDest, n, value) {
            switch (n) {
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

            return;
        }
        bf.intWrite = intWrite;

        /**
        * Read a n*8 bits integer value to memory in native endian.
        */
        function intRead(pSrc, n) {
            switch (n) {
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

        function floatToHalf(f) {
            _f32[0] = f;
            return floatToHalfI(_u32[0]);
        }
        bf.floatToHalf = floatToHalf;

        function floatToHalfI(i) {
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
                } else {
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
        function halfToFloat(y) {
            _u32[0] = halfToFloatI(y);
            return _f32[0];
        }
        bf.halfToFloat = halfToFloat;

        /** Converts a half in uint16 format to a float
        in uint32 format
        */
        function halfToFloatI(y) {
            var s = (y >> 15) & 0x00000001;
            var e = (y >> 10) & 0x0000001f;
            var m = y & 0x000003ff;

            if (e == 0) {
                // Plus or minus zero
                if (m == 0) {
                    return s << 31;
                } else {
                    while (!(m & 0x00000400)) {
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
                } else {
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
    (function (EDataTypes) {
        EDataTypes[EDataTypes["BYTE"] = 0x1400] = "BYTE";
        EDataTypes[EDataTypes["UNSIGNED_BYTE"] = 0x1401] = "UNSIGNED_BYTE";
        EDataTypes[EDataTypes["SHORT"] = 0x1402] = "SHORT";
        EDataTypes[EDataTypes["UNSIGNED_SHORT"] = 0x1403] = "UNSIGNED_SHORT";
        EDataTypes[EDataTypes["INT"] = 0x1404] = "INT";
        EDataTypes[EDataTypes["UNSIGNED_INT"] = 0x1405] = "UNSIGNED_INT";
        EDataTypes[EDataTypes["FLOAT"] = 0x1406] = "FLOAT";
    })(akra.EDataTypes || (akra.EDataTypes = {}));
    var EDataTypes = akra.EDataTypes;

    (function (EDataTypeSizes) {
        EDataTypeSizes[EDataTypeSizes["BYTES_PER_BYTE"] = 1] = "BYTES_PER_BYTE";
        EDataTypeSizes[EDataTypeSizes["BYTES_PER_UNSIGNED_BYTE"] = 1] = "BYTES_PER_UNSIGNED_BYTE";
        EDataTypeSizes[EDataTypeSizes["BYTES_PER_UBYTE"] = 1] = "BYTES_PER_UBYTE";

        EDataTypeSizes[EDataTypeSizes["BYTES_PER_SHORT"] = 2] = "BYTES_PER_SHORT";
        EDataTypeSizes[EDataTypeSizes["BYTES_PER_UNSIGNED_SHORT"] = 2] = "BYTES_PER_UNSIGNED_SHORT";
        EDataTypeSizes[EDataTypeSizes["BYTES_PER_USHORT"] = 2] = "BYTES_PER_USHORT";

        EDataTypeSizes[EDataTypeSizes["BYTES_PER_INT"] = 4] = "BYTES_PER_INT";
        EDataTypeSizes[EDataTypeSizes["BYTES_PER_UNSIGNED_INT"] = 4] = "BYTES_PER_UNSIGNED_INT";
        EDataTypeSizes[EDataTypeSizes["BYTES_PER_UINT"] = 4] = "BYTES_PER_UINT";

        EDataTypeSizes[EDataTypeSizes["BYTES_PER_FLOAT"] = 4] = "BYTES_PER_FLOAT";
    })(akra.EDataTypeSizes || (akra.EDataTypeSizes = {}));
    var EDataTypeSizes = akra.EDataTypeSizes;
})(akra || (akra = {}));
/// <reference path="../idl/IConverter.ts" />
/// <reference path="../idl/EDataTypes.ts" />
/// <reference path="../idl/3d-party/fixes.d.ts" />
/// <reference path="../common.ts" />
var akra;
(function (akra) {
    (function (conv) {
        conv.conversionFormats;

        function parseBool(sValue) {
            return (sValue === "true");
        }
        conv.parseBool = parseBool;

        function parseString(sValue) {
            return String(sValue);
        }
        conv.parseString = parseString;

        function parseJSON(sJSON) {
            return eval('(' + sJSON + ')');
        }
        conv.parseJSON = parseJSON;

        /**
        * Convert text/html into Dom object.
        */
        function parseHTML(sHTML) {
            var pDivEl = document.createElement('div');

            pDivEl.innerHTML = sHTML;

            return pDivEl.childNodes;
        }
        conv.parseHTML = parseHTML;

        function parseHTMLDocument(sHtml) {
            var pDocFrag;
            var pNodes = parseHTML(sHtml);

            pDocFrag = document.createDocumentFragment();

            for (var i = 0, len = pNodes.length; i < len; ++i) {
                if (!akra.isDef(pNodes[i])) {
                    continue;
                }

                pDocFrag.appendChild(pNodes[i]);
            }

            return pDocFrag;
        }
        conv.parseHTMLDocument = parseHTMLDocument;

        function retrieve(pSrc, pDst, iStride, iFrom, iCount, iOffset, iLen) {
            if (typeof iStride === "undefined") { iStride = 1; }
            if (typeof iFrom === "undefined") { iFrom = 0; }
            if (typeof iOffset === "undefined") { iOffset = 0; }
            if (typeof iLen === "undefined") { iLen = iStride - iOffset; }
            if (!akra.isDef(iCount)) {
                iCount = (pSrc.length / iStride - iFrom);
            }

            if (iOffset + iLen > iStride) {
                iLen = iStride - iOffset;
            }

            var iBegin = iFrom * iStride;
            var n = 0;

            for (var i = 0; i < iCount; ++i) {
                for (var j = 0; j < iLen; ++j) {
                    pDst[n++] = (pSrc[iBegin + i * iStride + iOffset + j]);
                }
            }

            return n;
        }
        conv.retrieve = retrieve;

        function string2Array(sData, ppData, fnConv, iFrom) {
            if (typeof iFrom === "undefined") { iFrom = 0; }
            var pData = sData.split(/[\s]+/g);

            for (var i = 0, n = pData.length, j = 0; i < n; ++i) {
                if (pData[i] != "") {
                    ppData[iFrom + j] = fnConv(pData[i]);
                    j++;
                }
            }

            return j;
        }
        conv.string2Array = string2Array;
        function stoia(sData, ppData, iFrom) {
            return string2Array(sData, ppData, parseInt, iFrom);
        }
        conv.stoia = stoia;
        function stofa(sData, ppData, iFrom) {
            return string2Array(sData, ppData, parseFloat, iFrom);
        }
        conv.stofa = stofa;
        function stoba(sData, ppData, iFrom) {
            return string2Array(sData, ppData, parseBool, iFrom);
        }
        conv.stoba = stoba;
        function stosa(sData, ppData, iFrom) {
            return string2Array(sData, ppData, parseString, iFrom);
        }
        conv.stosa = stosa;

        function stoa(sData, n, sType, isArray) {
            if (typeof isArray === "undefined") { isArray = false; }
            var pRow = conv.conversionFormats[sType];
            var ppData = new (pRow.type)(n);
            pRow.converter(sData, ppData);

            if (n == 1 && !isArray) {
                return ppData[0];
            }

            return ppData;
        }
        conv.stoa = stoa;

        // data convertion
        conv.conversionFormats = {
            "int": { type: Int32Array, converter: stoia },
            "float": { type: Float32Array, converter: stofa },
            "boolean": { type: Array, converter: stoba },
            "string": { type: Array, converter: stosa }
        };

        //////////////////
        /**
        * Convert string to ArrayBuffer.
        */
        function stoab(s) {
            var len = s.length;
            var pCodeList = new Uint8Array(len);

            for (var i = 0; i < len; ++i) {
                pCodeList[i] = s.charCodeAt(i); /*& 0xFF;*/
            }

            return pCodeList.buffer;
        }
        conv.stoab = stoab;

        /**
        * Convert ArrayBuffer to string.
        */
        function abtos(pBuf, iByteOffset, iByteLength) {
            if (typeof iByteOffset === "undefined") { iByteOffset = 0; }
            if (typeof iByteLength === "undefined") { iByteLength = pBuf.byteLength; }
            var pData = new Uint8Array(pBuf, iByteOffset, iByteLength);
            var s = "";

            for (var n = 0; n < pData.length; ++n) {
                s += String.fromCharCode(pData[n]);
            }

            return s;
            // return String.fromCharCode.apply(null, Array.prototype.slice.call(new Uint8Array(pBuf), 0));
        }
        conv.abtos = abtos;

        /**
        * Convert ArrayBuffer to string via BlobReader.
        */
        function abtosAsync(pBuffer, callback) {
            var bb = new Blob([pBuffer]);
            var f = new FileReader();

            f.onload = function (e) {
                callback(e.target.result);
            };

            f.readAsText(bb);
        }
        conv.abtosAsync = abtosAsync;

        /**
        * Convert ArrayBuffer to typed array.
        */
        function abtota(pBuffer, eType) {
            switch (eType) {
                case 5126 /* FLOAT */:
                    return new Float32Array(pBuffer);
                case 5122 /* SHORT */:
                    return new Int16Array(pBuffer);
                case 5123 /* UNSIGNED_SHORT */:
                    return new Uint16Array(pBuffer);
                case 5124 /* INT */:
                    return new Int32Array(pBuffer);
                case 5125 /* UNSIGNED_INT */:
                    return new Uint32Array(pBuffer);
                case 5120 /* BYTE */:
                    return new Int8Array(pBuffer);
                default:
                case 5121 /* UNSIGNED_BYTE */:
                    return new Uint8Array(pBuffer);
            }
        }
        conv.abtota = abtota;

        /**
        * Blob to ArrayBuffer async.
        */
        function btoaAsync(pBlob, fn) {
            var pReader = new FileReader();

            pReader.onload = function (e) {
                fn(null, e.target.result);
            };

            pReader.onerror = function (e) {
                fn(e, null);
            };

            pReader.readAsArrayBuffer(pBlob);
        }
        conv.btoaAsync = btoaAsync;

        //DataURL to Blob object async.
        function dutobAsync(sBlobURL, fn) {
            var xhr = new XMLHttpRequest();
            xhr.open("GET", sBlobURL, true);
            xhr.responseType = "blob";

            xhr.onload = function (e) {
                if (xhr.status == 200) {
                    fn(xhr.response);
                }
            };

            xhr.send();
        }
        conv.dutobAsync = dutobAsync;

        /**
        * Data URL to JSON.
        */
        function dutojAsync(sBlobURL, fn) {
            var xhr = new XMLHttpRequest();

            xhr.open("GET", sBlobURL, true);
            xhr.overrideMimeType('application/json');
            xhr.responseType = "json";

            xhr.onload = function (e) {
                if (xhr.status === 200) {
                    fn(xhr.response);
                }
            };

            xhr.send();
        }
        conv.dutojAsync = dutojAsync;

        /**
        * Data URL to Blob object.
        */
        function dutob(dataURI) {
            // convert base64 to raw binary data held in a string
            // doesn't handle URLEncoded DataURIs - see SO answer #6850276 for code that does this
            var byteString = atob(dataURI.split(',')[1]);

            // separate out the mime component
            var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

            // write the bytes of the string to an ArrayBuffer
            var ab = new ArrayBuffer(byteString.length);
            var ia = new Uint8Array(ab);
            for (var i = 0; i < byteString.length; i++) {
                ia[i] = byteString.charCodeAt(i);
            }

            // write the ArrayBuffer to a blob, and you're done
            var bb = new Blob([ab], { type: mimeString });
            return bb;
        }
        conv.dutob = dutob;

        //TODO: remove this
        function toURL(data, mime) {
            if (typeof mime === "undefined") { mime = "text/plain"; }
            var blob;

            try  {
                blob = new Blob([data], { type: mime });
            } catch (e) {
                // Backwards-compatibility
                var bb = new BlobBuilder();
                bb.append(data);
                blob = bb.getBlob(mime);
            }

            return URL.createObjectURL(blob);
        }
        conv.toURL = toURL;

        /** Convert UTF8 string to Base64 string*/
        function utf8tob64(s) {
            return window.btoa(unescape(encodeURIComponent(s)));
        }
        conv.utf8tob64 = utf8tob64;

        function toUTF8(argString) {
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
            for (var n = 0; n < stringl; n++) {
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
        conv.toUTF8 = toUTF8;

        function fromUTF8(str_data) {
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

            while (i < str_data.length) {
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
        conv.fromUTF8 = fromUTF8;
    })(akra.conv || (akra.conv = {}));
    var conv = akra.conv;
})(akra || (akra = {}));
/// <reference path="../conv/conv.ts" />
var akra;
(function (akra) {
    (function (crypto) {
        function sha1(str) {
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

            /*var lsb_hex = function (val) {
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

            str = akra.conv.toUTF8(str);
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
                    i = str.charCodeAt(str_len - 3) << 24 | str.charCodeAt(str_len - 2) << 16 | str.charCodeAt(str_len - 1) << 8 | 0x80;
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
        crypto.sha1 = sha1;
    })(akra.crypto || (akra.crypto = {}));
    var crypto = akra.crypto;
})(akra || (akra = {}));
/// <reference path="../conv/conv.ts" />
var akra;
(function (akra) {
    (function (crypto) {
        function md5(str) {
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
            var xl, a, b, c, d, e;

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
                    } else {
                        return (lResult ^ 0x40000000 ^ lX8 ^ lY8);
                    }
                } else {
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
                var wordToHexValue = "", wordToHexValue_temp = "", lByte, lCount;
                for (lCount = 0; lCount <= 3; lCount++) {
                    lByte = (lValue >>> (lCount * 8)) & 255;
                    wordToHexValue_temp = "0" + lByte.toString(16);
                    wordToHexValue = wordToHexValue + wordToHexValue_temp.substr(wordToHexValue_temp.length - 2, 2);
                }
                return wordToHexValue;
            };

            var x = [], k, AA, BB, CC, DD, a, b, c, d, S11 = 7, S12 = 12, S13 = 17, S14 = 22, S21 = 5, S22 = 9, S23 = 14, S24 = 20, S31 = 4, S32 = 11, S33 = 16, S34 = 23, S41 = 6, S42 = 10, S43 = 15, S44 = 21;

            str = akra.conv.toUTF8(str);
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
        crypto.md5 = md5;
    })(akra.crypto || (akra.crypto = {}));
    var crypto = akra.crypto;
})(akra || (akra = {}));
/// <reference path="../conv/conv.ts" />
var akra;
(function (akra) {
    (function (crypto) {
        function crc32(str) {
            // http://kevin.vanzonneveld.net
            // +   original by: Webtoolkit.info (http://www.webtoolkit.info/)
            // +   improved by: T0bsn
            // -    depends on: utf8_encode
            // *     example 1: crc32('Kevin van Zonneveld');
            // *     returns 1: 1249991249
            str = akra.conv.toUTF8(str);
            var table = "00000000 77073096 EE0E612C 990951BA 076DC419 706AF48F E963A535 9E6495A3 0EDB8832 79DCB8A4 E0D5E91E 97D2D988 09B64C2B 7EB17CBD E7B82D07 90BF1D91 1DB71064 6AB020F2 F3B97148 84BE41DE 1ADAD47D 6DDDE4EB F4D4B551 83D385C7 136C9856 646BA8C0 FD62F97A 8A65C9EC 14015C4F 63066CD9 FA0F3D63 8D080DF5 3B6E20C8 4C69105E D56041E4 A2677172 3C03E4D1 4B04D447 D20D85FD A50AB56B 35B5A8FA 42B2986C DBBBC9D6 ACBCF940 32D86CE3 45DF5C75 DCD60DCF ABD13D59 26D930AC 51DE003A C8D75180 BFD06116 21B4F4B5 56B3C423 CFBA9599 B8BDA50F 2802B89E 5F058808 C60CD9B2 B10BE924 2F6F7C87 58684C11 C1611DAB B6662D3D 76DC4190 01DB7106 98D220BC EFD5102A 71B18589 06B6B51F 9FBFE4A5 E8B8D433 7807C9A2 0F00F934 9609A88E E10E9818 7F6A0DBB 086D3D2D 91646C97 E6635C01 6B6B51F4 1C6C6162 856530D8 F262004E 6C0695ED 1B01A57B 8208F4C1 F50FC457 65B0D9C6 12B7E950 8BBEB8EA FCB9887C 62DD1DDF 15DA2D49 8CD37CF3 FBD44C65 4DB26158 3AB551CE A3BC0074 D4BB30E2 4ADFA541 3DD895D7 A4D1C46D D3D6F4FB 4369E96A 346ED9FC AD678846 DA60B8D0 44042D73 33031DE5 AA0A4C5F DD0D7CC9 5005713C 270241AA BE0B1010 C90C2086 5768B525 206F85B3 B966D409 CE61E49F 5EDEF90E 29D9C998 B0D09822 C7D7A8B4 59B33D17 2EB40D81 B7BD5C3B C0BA6CAD EDB88320 9ABFB3B6 03B6E20C 74B1D29A EAD54739 9DD277AF 04DB2615 73DC1683 E3630B12 94643B84 0D6D6A3E 7A6A5AA8 E40ECF0B 9309FF9D 0A00AE27 7D079EB1 F00F9344 8708A3D2 1E01F268 6906C2FE F762575D 806567CB 196C3671 6E6B06E7 FED41B76 89D32BE0 10DA7A5A 67DD4ACC F9B9DF6F 8EBEEFF9 17B7BE43 60B08ED5 D6D6A3E8 A1D1937E 38D8C2C4 4FDFF252 D1BB67F1 A6BC5767 3FB506DD 48B2364B D80D2BDA AF0A1B4C 36034AF6 41047A60 DF60EFC3 A867DF55 316E8EEF 4669BE79 CB61B38C BC66831A 256FD2A0 5268E236 CC0C7795 BB0B4703 220216B9 5505262F C5BA3BBE B2BD0B28 2BB45A92 5CB36A04 C2D7FFA7 B5D0CF31 2CD99E8B 5BDEAE1D 9B64C2B0 EC63F226 756AA39C 026D930A 9C0906A9 EB0E363F 72076785 05005713 95BF4A82 E2B87A14 7BB12BAE 0CB61B38 92D28E9B E5D5BE0D 7CDCEFB7 0BDBDF21 86D3D2D4 F1D4E242 68DDB3F8 1FDA836E 81BE16CD F6B9265B 6FB077E1 18B74777 88085AE6 FF0F6A70 66063BCA 11010B5C 8F659EFF F862AE69 616BFFD3 166CCF45 A00AE278 D70DD2EE 4E048354 3903B3C2 A7672661 D06016F7 4969474D 3E6E77DB AED16A4A D9D65ADC 40DF0B66 37D83BF0 A9BCAE53 DEBB9EC5 47B2CF7F 30B5FFE9 BDBDF21C CABAC28A 53B39330 24B4A3A6 BAD03605 CDD70693 54DE5729 23D967BF B3667A2E C4614AB8 5D681B02 2A6F2B94 B40BBE37 C30C8EA1 5A05DF1B 2D02EF8D";

            var crc = 0;
            var x = 0;
            var y = 0;

            crc = crc ^ (-1);
            for (var i = 0, iTop = str.length; i < iTop; i++) {
                y = (crc ^ str.charCodeAt(i)) & 0xFF;
                x = parseInt("0x" + table.substr(y * 9, 8), 10);
                crc = (crc >>> 8) ^ x;
            }

            return String(crc ^ (-1));
        }
        crypto.crc32 = crc32;
    })(akra.crypto || (akra.crypto = {}));
    var crypto = akra.crypto;
})(akra || (akra = {}));
/// <reference path="conv/conv.ts" />
/// <reference path="crypto/sha-1.ts" />
/// <reference path="crypto/md5.ts" />
/// <reference path="crypto/crc32.ts" />

var akra;
(function (akra) {
    akra.typeOf = function (x) {
        var s = typeof x;

        if (s === "object") {
            if (x) {
                if (x instanceof Array) {
                    return "array";
                } else if (x instanceof Object) {
                    return s;
                }

                var sClassName = Object.prototype.toString.call(x);

                if (sClassName === "[object Window]") {
                    return "object";
                }

                if ((sClassName === "[object Array]" || (typeof x.length) === "number" && (typeof x.splice) !== "undefined" && (typeof x.propertyIsEnumerable) !== "undefined" && !x.propertyIsEnumerable("splice"))) {
                    return "array";
                }

                if ((sClassName === "[object Function]" || (typeof x.call) !== "undefined" && (typeof x.propertyIsEnumerable) !== "undefined" && !x.propertyIsEnumerable("call"))) {
                    return "function";
                }
            } else {
                return "null";
            }
        } else if (s === "function" && (typeof x.call) === "undefined") {
            return "object";
        }

        return s;
    };

    akra.isDef = function (x) {
        return x !== undefined;
    };
    akra.isDefAndNotNull = function (x) {
        return x != null;
    };
    akra.isEmpty = function (x) {
        return x.length === 0;
    };
    akra.isNull = function (x) {
        return x === null;
    };
    akra.isBoolean = function (x) {
        return typeof x === "boolean";
    };
    akra.isString = function (x) {
        return typeof x === "string";
    };
    akra.isNumber = function (x) {
        return typeof x === "number";
    };
    akra.isFloat = akra.isNumber;

    //export var isInt = isNumber;
    //export var isUint = isNumber;
    akra.isInt = function (x) {
        return akra.isNumber(x) && (~~x === x);
    };
    akra.isUint = function (x) {
        return akra.isInt(x) && x > 0;
    };
    akra.isFunction = function (x) {
        return akra.typeOf(x) === "function";
    };
    akra.isObject = function (x) {
        var type = akra.typeOf(x);
        return type === "object" || type === "array" || type === "function";
    };
    akra.isArrayBuffer = function (x) {
        return x instanceof ArrayBuffer;
    };
    akra.isTypedArray = function (x) {
        return x !== null && typeof x === "object" && typeof x.byteOffset === "number";
    };
    akra.isBlob = function (x) {
        return x instanceof Blob;
    };
    akra.isArray = function (x) {
        return akra.typeOf(x) === "array";
    };

    String.prototype.replaceAt = function (n, chr) {
        return this.substr(0, n) + chr + this.substr(n + chr.length);
    };

    /** @expose */
    Array.prototype.first;
    Object.defineProperty(Array.prototype, 'first', {
        enumerable: false,
        configurable: true,
        get: function () {
            return this[0];
        }
    });

    /** @expose */
    Array.prototype.last;
    Object.defineProperty(Array.prototype, 'last', {
        enumerable: false,
        configurable: true,
        get: function () {
            return this[this.length - 1];
        }
    });

    /** @expose */
    Array.prototype.el;
    Object.defineProperty(Array.prototype, 'el', {
        enumerable: false,
        configurable: true,
        value: function (i) {
            i = i || 0;
            return this[i < 0 ? this.length + i : i];
        }
    });

    /** @expose */
    Array.prototype.clear;
    Object.defineProperty(Array.prototype, 'clear', {
        enumerable: false,
        configurable: true,
        value: function () {
            this.length = 0;
        }
    });

    /** @expose */
    Array.prototype.swap;
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

    /** @expose */
    Array.prototype.insert;
    Object.defineProperty(Array.prototype, 'insert', {
        enumerable: false,
        configurable: true,
        value: function (pElement) {
            if (typeof pElement.length === 'number') {
                for (var i = 0, n = pElement.length; i < n; ++i) {
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

        for (var i = 0; i < iLength - sValue.length; ++i) {
            sValue = '0' + sValue;
        }

        return sValue;
    };

    Number.prototype.printBinary = function (isPretty) {
        if (typeof isPretty === "undefined") { isPretty = true; }
        var res = "";
        for (var i = 0; i < 32; ++i) {
            if (i && (i % 4) == 0 && isPretty) {
                res = ' ' + res;
            }
            (this >> i & 0x1 ? res = '1' + res : res = '0' + res);
        }
        return res;
    };
})(akra || (akra = {}));
var akra;
(function (akra) {
    (function (ELogLevel) {
        ELogLevel[ELogLevel["NONE"] = 0x0000] = "NONE";
        ELogLevel[ELogLevel["LOG"] = 0x0001] = "LOG";
        ELogLevel[ELogLevel["INFORMATION"] = 0x0002] = "INFORMATION";
        ELogLevel[ELogLevel["WARNING"] = 0x0004] = "WARNING";
        ELogLevel[ELogLevel["ERROR"] = 0x0008] = "ERROR";
        ELogLevel[ELogLevel["CRITICAL"] = 0x0010] = "CRITICAL";
        ELogLevel[ELogLevel["ALL"] = 0x001F] = "ALL";
    })(akra.ELogLevel || (akra.ELogLevel = {}));
    var ELogLevel = akra.ELogLevel;
})(akra || (akra = {}));
/// <reference path="../common.ts" />
var akra;
(function (akra) {
    (function (util) {
        var Singleton = (function () {
            function Singleton() {
                var _this = this;
                var _constructor = _this.constructor;

                if (_constructor._instance != null) {
                    throw new Error("Singleton class may be created only one time.");
                }

                _constructor._instance = this;
            }
            Singleton._instance = null;
            return Singleton;
        })();
        util.Singleton = Singleton;
    })(akra.util || (akra.util = {}));
    var util = akra.util;
})(akra || (akra = {}));
/// <reference path="../idl/ILogger.ts" />
/// <reference path="../common.ts" />
/// <reference path="../bf/bf.ts" />
/// <reference path="../util/Singleton.ts" />
var akra;
(function (akra) {
    (function (util) {
        var Logger = (function () {
            function Logger() {
                this._eUnknownCode = 0;
                this._sUnknownMessage = "Unknown code";

                this._eLogLevel = 31 /* ALL */;
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
                if (this.isUsedCode(eCode)) {
                    //debug.error("Error code " + String(eCode) + " already in use.");
                    return false;
                }

                var sFamilyName = this.getFamilyName(eCode);
                if (akra.isNull(sFamilyName)) {
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
                if (typeof sFamilyName === "undefined") { sFamilyName = this.generateFamilyName(); }
                if (this.isUsedFamilyName(sFamilyName)) {
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

                for (i = 0; i < pCodeFamilyList.length; i++) {
                    pCodeFamily = pCodeFamilyList[i];

                    if (pCodeFamily.codeMin <= eCode && pCodeFamily.codeMax >= eCode) {
                        return pCodeFamily.familyName;
                    }
                }

                return "";
            };

            Logger.prototype.setCodeFamilyRoutine = function () {
                var sFamilyName = "";
                var fnLogRoutine = null;
                var eLevel = 1 /* LOG */;

                if (akra.isInt(arguments[0])) {
                    sFamilyName = this.getFamilyName(arguments[0]);
                    fnLogRoutine = arguments[1];
                    eLevel = arguments[2];

                    if (sFamilyName === "") {
                        return false;
                    }
                } else if (akra.isString(arguments[0])) {
                    sFamilyName = arguments[0];
                    fnLogRoutine = arguments[1];
                    eLevel = arguments[2];
                }

                if (!this.isUsedFamilyName(sFamilyName)) {
                    return false;
                }

                var pCodeFamilyRoutineMap = this._pCodeFamilyRoutineDMap[sFamilyName];

                if (!akra.isDef(pCodeFamilyRoutineMap)) {
                    pCodeFamilyRoutineMap = this._pCodeFamilyRoutineDMap[sFamilyName] = {};
                }

                if (akra.bf.testAll(eLevel, 1 /* LOG */)) {
                    pCodeFamilyRoutineMap[1 /* LOG */] = fnLogRoutine;
                }
                if (akra.bf.testAll(eLevel, 2 /* INFORMATION */)) {
                    pCodeFamilyRoutineMap[2 /* INFORMATION */] = fnLogRoutine;
                }
                if (akra.bf.testAll(eLevel, 4 /* WARNING */)) {
                    pCodeFamilyRoutineMap[4 /* WARNING */] = fnLogRoutine;
                }
                if (akra.bf.testAll(eLevel, 8 /* ERROR */)) {
                    pCodeFamilyRoutineMap[8 /* ERROR */] = fnLogRoutine;
                }
                if (akra.bf.testAll(eLevel, 16 /* CRITICAL */)) {
                    pCodeFamilyRoutineMap[16 /* CRITICAL */] = fnLogRoutine;
                }

                return true;
            };

            Logger.prototype.setLogRoutine = function (fnLogRoutine, eLevel) {
                if (akra.bf.testAll(eLevel, 1 /* LOG */)) {
                    this._pGeneralRoutineMap[1 /* LOG */] = fnLogRoutine;
                }
                if (akra.bf.testAll(eLevel, 2 /* INFORMATION */)) {
                    this._pGeneralRoutineMap[2 /* INFORMATION */] = fnLogRoutine;
                }
                if (akra.bf.testAll(eLevel, 4 /* WARNING */)) {
                    this._pGeneralRoutineMap[4 /* WARNING */] = fnLogRoutine;
                }
                if (akra.bf.testAll(eLevel, 8 /* ERROR */)) {
                    this._pGeneralRoutineMap[8 /* ERROR */] = fnLogRoutine;
                }
                if (akra.bf.testAll(eLevel, 16 /* CRITICAL */)) {
                    this._pGeneralRoutineMap[16 /* CRITICAL */] = fnLogRoutine;
                }
            };

            Logger.prototype.setSourceLocation = function () {
                var sFile;
                var iLine;

                if (arguments.length === 2) {
                    sFile = arguments[0];
                    iLine = arguments[1];
                } else {
                    if (akra.isDef(arguments[0]) && !(akra.isNull(arguments[0]))) {
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

            Logger.prototype.time = function (sLabel) {
                console.time(sLabel);
            };

            Logger.prototype.timeEnd = function (sLabel) {
                console.timeEnd(sLabel);
            };

            Logger.prototype.group = function () {
                var pArgs = [];
                for (var _i = 0; _i < (arguments.length - 0); _i++) {
                    pArgs[_i] = arguments[_i + 0];
                }
                console.group.apply(console, arguments);
            };

            Logger.prototype.groupEnd = function () {
                console.groupEnd();
            };

            Logger.prototype.log = function () {
                var pArgs = [];
                for (var _i = 0; _i < (arguments.length - 0); _i++) {
                    pArgs[_i] = arguments[_i + 0];
                }
                if (!akra.bf.testAll(this._eLogLevel, 1 /* LOG */)) {
                    return;
                }

                var fnLogRoutine = this._pGeneralRoutineMap[1 /* LOG */];
                if (!akra.isDef(fnLogRoutine)) {
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
                if (!akra.bf.testAll(this._eLogLevel, 2 /* INFORMATION */)) {
                    return;
                }

                var pLogEntity;
                var fnLogRoutine;

                pLogEntity = this.prepareLogEntity.apply(this, arguments);
                fnLogRoutine = this.getCodeRoutineFunc(pLogEntity.code, 2 /* INFORMATION */);

                if (akra.isNull(fnLogRoutine)) {
                    return;
                }

                fnLogRoutine.call(null, pLogEntity);
            };

            Logger.prototype.warn = function () {
                if (!akra.bf.testAll(this._eLogLevel, 4 /* WARNING */)) {
                    return;
                }

                var pLogEntity;
                var fnLogRoutine;

                pLogEntity = this.prepareLogEntity.apply(this, arguments);
                fnLogRoutine = this.getCodeRoutineFunc(pLogEntity.code, 4 /* WARNING */);

                if (akra.isNull(fnLogRoutine)) {
                    return;
                }

                fnLogRoutine.call(null, pLogEntity);
            };

            Logger.prototype.error = function () {
                if (!akra.bf.testAll(this._eLogLevel, 8 /* ERROR */)) {
                    return;
                }

                var pLogEntity;
                var fnLogRoutine;

                pLogEntity = this.prepareLogEntity.apply(this, arguments);
                fnLogRoutine = this.getCodeRoutineFunc(pLogEntity.code, 8 /* ERROR */);

                if (akra.isNull(fnLogRoutine)) {
                    return;
                }

                fnLogRoutine.call(null, pLogEntity);
            };

            Logger.prototype.critical = function () {
                var pLogEntity;
                var fnLogRoutine;

                pLogEntity = this.prepareLogEntity.apply(this, arguments);
                fnLogRoutine = this.getCodeRoutineFunc(pLogEntity.code, 16 /* CRITICAL */);

                var sSystemMessage = "A Critical error has occured! Code: " + pLogEntity.code.toString();

                if (akra.bf.testAll(this._eLogLevel, 16 /* CRITICAL */) && !akra.isNull(fnLogRoutine)) {
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

                    for (var i = 1; i < arguments.length; i++) {
                        pArgs[i - 1] = arguments[i];
                    }

                    pLogEntity = this.prepareLogEntity.apply(this, pArgs);
                    fnLogRoutine = this.getCodeRoutineFunc(pLogEntity.code, 16 /* CRITICAL */);

                    var sSystemMessage = "A error has occured! Code: " + pLogEntity.code.toString() + "\n Accept to exit, refuse to continue.";

                    if (akra.bf.testAll(this._eLogLevel, 16 /* CRITICAL */) && !akra.isNull(fnLogRoutine)) {
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

                if (this.isUsedFamilyName(sName)) {
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

                for (i = 0; i < pCodeFamilyList.length; i++) {
                    pCodeFamily = pCodeFamilyList[i];

                    if ((pCodeFamily.codeMin <= eCodeMin && pCodeFamily.codeMax >= eCodeMin) || (pCodeFamily.codeMin <= eCodeMax && pCodeFamily.codeMax >= eCodeMax)) {
                        return false;
                    }
                }

                return true;
            };

            Logger.prototype.isUsedFamilyName = function (sFamilyName) {
                return akra.isDef(this._pCodeFamilyMap[sFamilyName]);
            };

            Logger.prototype.isUsedCode = function (eCode) {
                return akra.isDef(this._pCodeInfoMap[eCode]);
            };

            Logger.prototype.isLogEntity = function (pObj) {
                if (akra.isObject(pObj) && akra.isDef(pObj.code) && akra.isDef(pObj.location)) {
                    return true;
                }

                return false;
            };

            Logger.prototype.isLogCode = function (eCode) {
                return akra.isInt(eCode);
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

                    if (!akra.isDef(pEntity.message)) {
                        var pCodeInfo = this._pCodeInfoMap[eCode];
                        if (akra.isDef(pCodeInfo)) {
                            sMessage = pCodeInfo.message;
                        }
                    }
                } else {
                    if (this.isLogCode(arguments[0])) {
                        eCode = arguments[0];
                        if (arguments.length > 1) {
                            pInfo = new Array(arguments.length - 1);

                            for (var i = 0; i < pInfo.length; i++) {
                                pInfo[i] = arguments[i + 1];
                            }
                        }
                    } else {
                        eCode = this._eUnknownCode;

                        // if(arguments.length > 0){
                        pInfo = new Array(arguments.length);

                        for (var i = 0; i < pInfo.length; i++) {
                            pInfo[i] = arguments[i];
                        }
                        // }
                        // else {
                        //     pInfo = null;
                        // }
                    }

                    var pCodeInfo = this._pCodeInfoMap[eCode];
                    if (akra.isDef(pCodeInfo)) {
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

                if (!akra.isDef(pCodeInfo)) {
                    fnLogRoutine = this._pGeneralRoutineMap[eLevel];
                    return akra.isDef(fnLogRoutine) ? fnLogRoutine : null;
                }

                var pCodeFamilyRoutineMap = this._pCodeFamilyRoutineDMap[pCodeInfo.familyName];

                if (!akra.isDef(pCodeFamilyRoutineMap) || !akra.isDef(pCodeFamilyRoutineMap[eLevel])) {
                    fnLogRoutine = this._pGeneralRoutineMap[eLevel];
                    return akra.isDef(fnLogRoutine) ? fnLogRoutine : null;
                }

                fnLogRoutine = pCodeFamilyRoutineMap[eLevel];

                return fnLogRoutine;
            };
            Logger._sDefaultFamilyName = "CodeFamily";
            return Logger;
        })();
        util.Logger = Logger;
    })(akra.util || (akra.util = {}));
    var util = akra.util;
})(akra || (akra = {}));
/// <reference path="common.ts" />
/// <reference path="util/Logger.ts" />

var akra;
(function (akra) {
    //export var logger: ILogger = util.Logger.getInstance();
    akra.logger = new akra.util.Logger();

    akra.logger.init();
    akra.logger.setUnknownCode(0, "unknown");
    akra.logger.setLogLevel(31 /* ALL */);

    akra.logger.registerCodeFamily(0, 100, "SystemCodes");

    //Default log routines
    function logRoutine(pLogEntity) {
        var pArgs = pLogEntity.info;

        console.log.apply(console, pArgs);
    }

    function warningRoutine(pLogEntity) {
        var pArgs = pLogEntity.info || [];

        if (true) {
            var sCodeInfo = "%cwarning" + (pLogEntity.code != 0 ? " AE" + pLogEntity.code.toString() : "") + ":";
            pArgs.unshift(sCodeInfo, "color: red;");
        }

        console.warn.apply(console, pArgs);
    }

    function errorRoutine(pLogEntity) {
        var pArgs = pLogEntity.info || [];

        if (true) {
            var sMessage = pLogEntity.message;
            var sCodeInfo = "error" + (pLogEntity.code != 0 ? " AE" + pLogEntity.code.toString() : "") + ":";

            pArgs.unshift("%c " + sCodeInfo, "color: red;", sMessage);
        } else {
            pArgs.unshift(sMessage);
        }

        console.error.apply(console, pArgs);
    }

    akra.logger.setLogRoutine(logRoutine, 1 /* LOG */ | 2 /* INFORMATION */);
    akra.logger.setLogRoutine(warningRoutine, 4 /* WARNING */);
    akra.logger.setLogRoutine(errorRoutine, 8 /* ERROR */ | 16 /* CRITICAL */);
})(akra || (akra = {}));
var akra;
(function (akra) {
    (function (parser) {
        parser.END_POSITION = "END";
        parser.T_EMPTY = "EMPTY";
        parser.UNKNOWN_TOKEN = "UNNOWN";
        parser.START_SYMBOL = "S";
        parser.UNUSED_SYMBOL = "##";
        parser.END_SYMBOL = "$";
        parser.LEXER_RULES = "--LEXER--";
        parser.FLAG_RULE_CREATE_NODE = "--AN";
        parser.FLAG_RULE_NOT_CREATE_NODE = "--NN";
        parser.FLAG_RULE_FUNCTION = "--F";
        parser.EOF = "EOF";
        parser.T_STRING = "T_STRING";
        parser.T_FLOAT = "T_FLOAT";
        parser.T_UINT = "T_UINT";
        parser.T_TYPE_ID = "T_TYPE_ID";
        parser.T_NON_TYPE_ID = "T_NON_TYPE_ID";
    })(akra.parser || (akra.parser = {}));
    var parser = akra.parser;
})(akra || (akra = {}));
/// <reference path="../idl/parser/IParser.ts" />
var akra;
(function (akra) {
    /// <reference path="../logger.ts" />
    /// <reference path="symbols.ts" />
    (function (parser) {
        var LEXER_UNKNOWN_TOKEN = 2101;
        var LEXER_BAD_TOKEN = 2102;

        akra.logger.registerCodeFamily(2000, 2199, "ParserSyntaxErrors");

        akra.logger.registerCode(LEXER_UNKNOWN_TOKEN, "Unknown token: {tokenValue}");
        akra.logger.registerCode(LEXER_BAD_TOKEN, "Bad token: {tokenValue}");

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
            Lexer._getPunctuatorName = function (sValue) {
                return "T_PUNCTUATOR_" + sValue.charCodeAt(0);
            };

            Lexer.prototype._addPunctuator = function (sValue, sName) {
                if (typeof sName === "undefined") { sName = Lexer._getPunctuatorName(sValue); }
                this._pPunctuatorsMap[sValue] = sName;
                this._pPunctuatorsFirstSymbols[sValue[0]] = true;
                return sName;
            };

            Lexer.prototype._addKeyword = function (sValue, sName) {
                this._pKeywordsMap[sValue] = sName;
                return sName;
            };

            Lexer.prototype._getTerminalValueByName = function (sName) {
                var sValue = "";

                for (sValue in this._pPunctuatorsMap) {
                    if (this._pPunctuatorsMap[sValue] === sName) {
                        return sValue;
                    }
                }

                for (sValue in this._pKeywordsMap) {
                    if (this._pKeywordsMap[sValue] === sName) {
                        return sValue;
                    }
                }

                return sName;
            };

            Lexer.prototype._init = function (sSource) {
                this._sSource = sSource;
                this._iLineNumber = 0;
                this._iColumnNumber = 0;
                this._iIndex = 0;
            };

            Lexer.prototype._getNextToken = function () {
                var ch = this.currentChar();
                if (!ch) {
                    return {
                        name: parser.END_SYMBOL,
                        value: parser.END_SYMBOL,
                        start: this._iColumnNumber,
                        end: this._iColumnNumber,
                        line: this._iLineNumber
                    };
                }
                var eType = this.identityTokenType();
                var pToken;
                switch (eType) {
                    case 1 /* k_NumericLiteral */:
                        pToken = this.scanNumber();
                        break;
                    case 2 /* k_CommentLiteral */:
                        this.scanComment();
                        pToken = this._getNextToken();
                        break;
                    case 3 /* k_StringLiteral */:
                        pToken = this.scanString();
                        break;
                    case 4 /* k_PunctuatorLiteral */:
                        pToken = this.scanPunctuator();
                        break;
                    case 6 /* k_IdentifierLiteral */:
                        pToken = this.scanIdentifier();
                        break;
                    case 5 /* k_WhitespaceLiteral */:
                        this.scanWhiteSpace();
                        pToken = this._getNextToken();
                        break;
                    default:
                        this._error(LEXER_UNKNOWN_TOKEN, {
                            name: parser.UNKNOWN_TOKEN,
                            value: ch + this._sSource[this._iIndex + 1],
                            start: this._iColumnNumber,
                            end: this._iColumnNumber + 1,
                            line: this._iLineNumber
                        });
                }
                return pToken;
            };

            Lexer.prototype._getIndex = function () {
                return this._iIndex;
            };

            Lexer.prototype._setSource = function (sSource) {
                this._sSource = sSource;
            };

            Lexer.prototype._setIndex = function (iIndex) {
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

                var pLogEntity = { code: eCode, info: pInfo, location: pLocation };

                akra.logger.error(pLogEntity);

                throw new Error(eCode.toString());
            };

            Lexer.prototype.identityTokenType = function () {
                if (this.isIdentifierStart()) {
                    return 6 /* k_IdentifierLiteral */;
                }
                if (this.isWhiteSpaceStart()) {
                    return 5 /* k_WhitespaceLiteral */;
                }
                if (this.isStringStart()) {
                    return 3 /* k_StringLiteral */;
                }
                if (this.isCommentStart()) {
                    return 2 /* k_CommentLiteral */;
                }
                if (this.isNumberStart()) {
                    return 1 /* k_NumericLiteral */;
                }
                if (this.isPunctuatorStart()) {
                    return 4 /* k_PunctuatorLiteral */;
                }
                return 8 /* k_Unknown */;
            };

            Lexer.prototype.isNumberStart = function () {
                var ch = this.currentChar();

                if ((ch >= "0") && (ch <= "9")) {
                    return true;
                }

                var ch1 = this.nextChar();
                if (ch === "." && (ch1 >= "0") && (ch1 <= "9")) {
                    return true;
                }

                return false;
            };

            Lexer.prototype.isCommentStart = function () {
                var ch = this.currentChar();
                var ch1 = this.nextChar();

                if (ch === "/" && (ch1 === "/" || ch1 === "*")) {
                    return true;
                }

                return false;
            };

            Lexer.prototype.isStringStart = function () {
                var ch = this.currentChar();
                if (ch === "\"" || ch === "'") {
                    return true;
                }
                return false;
            };

            Lexer.prototype.isPunctuatorStart = function () {
                var ch = this.currentChar();
                if (this._pPunctuatorsFirstSymbols[ch]) {
                    return true;
                }
                return false;
            };

            Lexer.prototype.isWhiteSpaceStart = function () {
                var ch = this.currentChar();
                if (ch === " " || ch === "\n" || ch === "\r" || ch === "\t") {
                    return true;
                }
                return false;
            };

            Lexer.prototype.isIdentifierStart = function () {
                var ch = this.currentChar();
                if ((ch === "_") || (ch >= "a" && ch <= "z") || (ch >= "A" && ch <= "Z")) {
                    return true;
                }
                return false;
            };

            Lexer.prototype.isLineTerminator = function (sSymbol) {
                return (sSymbol === "\n" || sSymbol === "\r" || sSymbol === "\u2028" || sSymbol === "\u2029");
            };

            Lexer.prototype.isWhiteSpace = function (sSymbol) {
                return (sSymbol === " ") || (sSymbol === "\t");
            };

            Lexer.prototype.isKeyword = function (sValue) {
                return !!(this._pKeywordsMap[sValue]);
            };

            Lexer.prototype.isPunctuator = function (sValue) {
                return !!(this._pPunctuatorsMap[sValue]);
            };

            Lexer.prototype.nextChar = function () {
                return this._sSource[this._iIndex + 1];
            };

            Lexer.prototype.currentChar = function () {
                return this._sSource[this._iIndex];
            };

            Lexer.prototype.readNextChar = function () {
                this._iIndex++;
                this._iColumnNumber++;
                return this._sSource[this._iIndex];
            };

            Lexer.prototype.scanString = function () {
                var chFirst = this.currentChar();
                var sValue = chFirst;
                var ch = "";
                var chPrevious = chFirst;
                var isGoodFinish = false;
                var iStart = this._iColumnNumber;

                while (true) {
                    ch = this.readNextChar();
                    if (!ch) {
                        break;
                    }
                    sValue += ch;
                    if (ch === chFirst && chPrevious !== "\\") {
                        isGoodFinish = true;
                        this.readNextChar();
                        break;
                    }
                    chPrevious = ch;
                }

                if (isGoodFinish) {
                    return {
                        name: parser.T_STRING,
                        value: sValue,
                        start: iStart,
                        end: this._iColumnNumber - 1,
                        line: this._iLineNumber
                    };
                } else {
                    if (!ch) {
                        ch = parser.EOF;
                    }
                    sValue += ch;

                    this._error(LEXER_BAD_TOKEN, {
                        type: 3 /* k_StringLiteral */,
                        value: sValue,
                        start: iStart,
                        end: this._iColumnNumber,
                        line: this._iLineNumber
                    });
                    return null;
                }
            };

            Lexer.prototype.scanPunctuator = function () {
                var sValue = this.currentChar();
                var ch;
                var iStart = this._iColumnNumber;

                while (true) {
                    ch = this.readNextChar();
                    if (ch) {
                        sValue += ch;
                        this._iColumnNumber++;
                        if (!this.isPunctuator(sValue)) {
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
                var ch = this.currentChar();
                var sValue = "";
                var isFloat = false;
                var chPrevious = ch;
                var isGoodFinish = false;
                var iStart = this._iColumnNumber;
                var isE = false;

                if (ch === ".") {
                    sValue += 0;
                    isFloat = true;
                }

                sValue += ch;

                while (true) {
                    ch = this.readNextChar();
                    if (ch === ".") {
                        if (isFloat) {
                            break;
                        } else {
                            isFloat = true;
                        }
                    } else if (ch === "e") {
                        if (isE) {
                            break;
                        } else {
                            isE = true;
                        }
                    } else if (((ch === "+" || ch === "-") && chPrevious === "e")) {
                        sValue += ch;
                        chPrevious = ch;
                        continue;
                    } else if (ch === "f" && isFloat) {
                        ch = this.readNextChar();
                        if ((ch >= "a" && ch <= "z") || (ch >= "A" && ch <= "Z")) {
                            break;
                        }
                        isGoodFinish = true;
                        break;
                    } else if ((ch >= "a" && ch <= "z") || (ch >= "A" && ch <= "Z")) {
                        break;
                    } else if (!((ch >= "0") && (ch <= "9")) || !ch) {
                        if ((isE && chPrevious !== "+" && chPrevious !== "-" && chPrevious !== "e") || !isE) {
                            isGoodFinish = true;
                        }
                        break;
                    }
                    sValue += ch;
                    chPrevious = ch;
                }

                if (isGoodFinish) {
                    var sName = isFloat ? parser.T_FLOAT : parser.T_UINT;
                    return {
                        name: sName,
                        value: sValue,
                        start: iStart,
                        end: this._iColumnNumber - 1,
                        line: this._iLineNumber
                    };
                } else {
                    if (!ch) {
                        ch = parser.EOF;
                    }
                    sValue += ch;
                    this._error(LEXER_BAD_TOKEN, {
                        type: 1 /* k_NumericLiteral */,
                        value: sValue,
                        start: iStart,
                        end: this._iColumnNumber,
                        line: this._iLineNumber
                    });
                    return null;
                }
            };

            Lexer.prototype.scanIdentifier = function () {
                var ch = this.currentChar();
                var sValue = ch;
                var iStart = this._iColumnNumber;
                var isGoodFinish = false;

                while (true) {
                    ch = this.readNextChar();
                    if (!ch) {
                        isGoodFinish = true;
                        break;
                    }
                    if (!((ch === "_") || (ch >= "a" && ch <= "z") || (ch >= "A" && ch <= "Z") || (ch >= "0" && ch <= "9"))) {
                        isGoodFinish = true;
                        break;
                    }
                    sValue += ch;
                }

                if (isGoodFinish) {
                    if (this.isKeyword(sValue)) {
                        return {
                            name: this._pKeywordsMap[sValue],
                            value: sValue,
                            start: iStart,
                            end: this._iColumnNumber - 1,
                            line: this._iLineNumber
                        };
                    } else {
                        var sName = this._pParser.isTypeId(sValue) ? parser.T_TYPE_ID : parser.T_NON_TYPE_ID;
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
                        ch = parser.EOF;
                    }
                    sValue += ch;
                    this._error(LEXER_BAD_TOKEN, {
                        type: 6 /* k_IdentifierLiteral */,
                        value: sValue,
                        start: iStart,
                        end: this._iColumnNumber,
                        line: this._iLineNumber
                    });
                    return null;
                }
            };

            Lexer.prototype.scanWhiteSpace = function () {
                var ch = this.currentChar();

                while (true) {
                    if (!ch) {
                        break;
                    }
                    if (this.isLineTerminator(ch)) {
                        if (ch === "\r" && this.nextChar() === "\n") {
                            this._iLineNumber--;
                        }
                        this._iLineNumber++;
                        ch = this.readNextChar();
                        this._iColumnNumber = 0;
                        continue;
                    } else if (ch === "\t") {
                        this._iColumnNumber += 3;
                    } else if (ch !== " ") {
                        break;
                    }
                    ch = this.readNextChar();
                }

                return true;
            };

            Lexer.prototype.scanComment = function () {
                var sValue = this.currentChar();
                var ch = this.readNextChar();
                sValue += ch;

                if (ch === "/") {
                    while (true) {
                        ch = this.readNextChar();
                        if (!ch) {
                            break;
                        }
                        if (this.isLineTerminator(ch)) {
                            if (ch === "\r" && this.nextChar() === "\n") {
                                this._iLineNumber--;
                            }
                            this._iLineNumber++;
                            this.readNextChar();
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

                    while (true) {
                        ch = this.readNextChar();
                        if (!ch) {
                            break;
                        }
                        sValue += ch;
                        if (ch === "/" && chPrevious === "*") {
                            isGoodFinish = true;
                            this.readNextChar();
                            break;
                        }
                        if (this.isLineTerminator(ch)) {
                            if (ch === "\r" && this.nextChar() === "\n") {
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
                            ch = parser.EOF;
                        }
                        sValue += ch;
                        this._error(LEXER_BAD_TOKEN, {
                            type: 2 /* k_CommentLiteral */,
                            value: sValue,
                            start: iStart,
                            end: this._iColumnNumber,
                            line: this._iLineNumber
                        });
                        return false;
                    }
                }
            };
            return Lexer;
        })();
        parser.Lexer = Lexer;
    })(akra.parser || (akra.parser = {}));
    var parser = akra.parser;
})(akra || (akra = {}));
/// <reference path="../idl/parser/IParser.ts" />
var akra;
(function (akra) {
    (function (parser) {
        var ParseTree = (function () {
            function ParseTree() {
                this._pRoot = null;
                this._pNodes = [];
                this._pNodesCountStack = [];
                this._isOptimizeMode = false;
            }
            ParseTree.prototype.getRoot = function () {
                return this._pRoot;
            };

            ParseTree.prototype.setRoot = function (pRoot) {
                this._pRoot = pRoot;
            };

            ParseTree.prototype.finishTree = function () {
                this._pRoot = this._pNodes.pop();
            };

            ParseTree.prototype.setOptimizeMode = function (isOptimize) {
                this._isOptimizeMode = isOptimize;
            };

            ParseTree.prototype.addToken = function (pToken) {
                var pNode = {
                    name: pToken.name,
                    value: pToken.value,
                    start: pToken.start,
                    end: pToken.end,
                    line: pToken.line,
                    children: null,
                    parent: null,
                    isAnalyzed: false,
                    position: this._pNodes.length
                };

                this.addNode(pNode);
            };

            ParseTree.prototype.addNode = function (pNode) {
                this._pNodes.push(pNode);
                this._pNodesCountStack.push(1);
            };

            ParseTree.prototype.reduceByRule = function (pRule, eCreate) {
                if (typeof eCreate === "undefined") { eCreate = 0 /* k_Default */; }
                var iReduceCount = 0;
                var pNodesCountStack = this._pNodesCountStack;
                var pNode;
                var iRuleLength = pRule.right.length;
                var pNodes = this._pNodes;
                var nOptimize = this._isOptimizeMode ? 1 : 0;

                while (iRuleLength) {
                    iReduceCount += pNodesCountStack.pop();
                    iRuleLength--;
                }

                if ((eCreate === 0 /* k_Default */ && iReduceCount > nOptimize) || (eCreate === 1 /* k_Necessary */)) {
                    pNode = {
                        name: pRule.left,
                        children: null,
                        parent: null,
                        value: "",
                        isAnalyzed: false,
                        position: this._pNodes.length
                    };

                    while (iReduceCount) {
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
                pTree.setRoot(this.cloneNode(this._pRoot));
                return pTree;
            };

            ParseTree.prototype.getNodes = function () {
                return this._pNodes;
            };

            ParseTree.prototype.getLastNode = function () {
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
                for (var i = 0; pChildren && i < pChildren.length; i++) {
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

                        for (var i = pChildren.length - 1; i >= 0; i--) {
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
        parser.ParseTree = ParseTree;
    })(akra.parser || (akra.parser = {}));
    var parser = akra.parser;
})(akra || (akra = {}));
/// <reference path="IItem.ts" />
/// <reference path="../IMap.ts" />
/// <reference path="../IMap.ts" />
/// <reference path="IState.ts" />
/// <reference path="IParser.ts" />
/// <reference path="../idl/IMap.ts" />
var akra;
(function (akra) {
    /// <reference path="../idl/parser/IParser.ts" />
    /// <reference path="../idl/parser/IItem.ts" />
    /// <reference path="../common.ts" />
    /// <reference path="symbols.ts" />
    (function (parser) {
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
                    var pKeys = Object.getOwnPropertyNames(arguments[2]);

                    for (var i = 0; i < pKeys.length; i++) {
                        this.addExpected(pKeys[i]);
                    }
                }
            }
            Item.prototype.getRule = function () {
                return this._pRule;
            };

            Item.prototype.setRule = function (pRule) {
                this._pRule = pRule;
            };

            Item.prototype.getPosition = function () {
                return this._iPos;
            };

            Item.prototype.setPosition = function (iPos) {
                this._iPos = iPos;
            };

            Item.prototype.getState = function () {
                return this._pState;
            };

            Item.prototype.setState = function (pState) {
                this._pState = pState;
            };

            Item.prototype.getIndex = function () {
                return this._iIndex;
            };

            Item.prototype.setIndex = function (iIndex) {
                this._iIndex = iIndex;
            };

            Item.prototype.getIsNewExpected = function () {
                return this._isNewExpected;
            };

            Item.prototype.setIsNewExpected = function (_isNewExpected) {
                this._isNewExpected = _isNewExpected;
            };

            Item.prototype.getExpectedSymbols = function () {
                return this._pExpected;
            };

            Item.prototype.getLength = function () {
                return this._iLength;
            };

            Item.prototype.isEqual = function (pItem, eType) {
                if (typeof eType === "undefined") { eType = 0 /* k_LR0 */; }
                if (eType === 0 /* k_LR0 */) {
                    return (this._pRule === pItem.getRule() && this._iPos === pItem.getPosition());
                } else if (eType === 1 /* k_LR1 */) {
                    if (!(this._pRule === pItem.getRule() && this._iPos === pItem.getPosition() && this._iLength === pItem.getLength())) {
                        return false;
                    }
                    var i = "";
                    for (i in this._pExpected) {
                        if (!pItem.isExpected(i)) {
                            return false;
                        }
                    }
                    return true;
                } else {
                    //We never must be here, for LALR(1) we work with LR0 items. This 'else'-stmt onlu for closure-compliler.
                    return false;
                }
            };

            Item.prototype.isParentItem = function (pItem) {
                return (this._pRule === pItem.getRule() && this._iPos === pItem.getPosition() + 1);
            };

            Item.prototype.isChildItem = function (pItem) {
                return (this._pRule === pItem.getRule() && this._iPos === pItem.getPosition() - 1);
            };

            Item.prototype.mark = function () {
                var pRight = this._pRule.right;
                if (this._iPos === pRight.length) {
                    return parser.END_POSITION;
                }
                return pRight[this._iPos];
            };

            Item.prototype.end = function () {
                return this._pRule.right[this._pRule.right.length - 1] || parser.T_EMPTY;
            };

            Item.prototype.nextMarked = function () {
                return this._pRule.right[this._iPos + 1] || parser.END_POSITION;
            };

            Item.prototype.isExpected = function (sSymbol) {
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

                for (var k = 0; k < pRight.length; k++) {
                    if (k === this._iPos) {
                        sMsg += ". ";
                    }
                    sMsg += pRight[k] + " ";
                }

                if (this._iPos === pRight.length) {
                    sMsg += ". ";
                }

                if (akra.isDef(this._pExpected)) {
                    sExpected = ", ";
                    var pKeys = Object.getOwnPropertyNames(this._pExpected);

                    for (var l = 0; l < pKeys.length; ++l) {
                        sExpected += pKeys[l] + "/";
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
        parser.Item = Item;
    })(akra.parser || (akra.parser = {}));
    var parser = akra.parser;
})(akra || (akra = {}));
/// <reference path="../idl/IMap.ts" />
/// <reference path="../idl/parser/IItem.ts" />
/// <reference path="../idl/parser/IState.ts" />
var akra;
(function (akra) {
    (function (parser) {
        var State = (function () {
            function State() {
                this._pItemList = [];
                this._pNextStates = {};
                this._iIndex = 0;
                this._nBaseItems = 0;
            }
            State.prototype.getIndex = function () {
                return this._iIndex;
            };

            State.prototype.setIndex = function (iIndex) {
                this._iIndex = iIndex;
            };

            State.prototype.getItems = function () {
                return this._pItemList;
            };

            State.prototype.getNumBaseItems = function () {
                return this._nBaseItems;
            };

            State.prototype.getNextStates = function () {
                return this._pNextStates;
            };

            State.prototype.hasItem = function (pItem, eType) {
                var i;
                var pItems = this._pItemList;
                for (i = 0; i < pItems.length; i++) {
                    if (pItems[i].isEqual(pItem, eType)) {
                        return pItems[i];
                    }
                }
                return null;
            };

            State.prototype.hasParentItem = function (pItem) {
                var i;
                var pItems = this._pItemList;
                for (i = 0; i < pItems.length; i++) {
                    if (pItems[i].isParentItem(pItem)) {
                        return pItems[i];
                    }
                }
                return null;
            };

            State.prototype.hasChildItem = function (pItem) {
                var i;
                var pItems = this._pItemList;
                for (i = 0; i < pItems.length; i++) {
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

                for (i = 0; i < this._nBaseItems; i++) {
                    pItem = pItemList[i];
                    if (pItem.getRule() === pRule && pItem.getPosition() === iPos) {
                        return true;
                    }
                }

                return false;
            };

            State.prototype.isEmpty = function () {
                return !(this._pItemList.length);
            };

            State.prototype.isEqual = function (pState, eType) {
                var pItemsA = this._pItemList;
                var pItemsB = pState.getItems();

                if (this._nBaseItems !== pState.getNumBaseItems()) {
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
            };

            State.prototype.push = function (pItem) {
                if (this._pItemList.length === 0 || pItem.getPosition() > 0) {
                    this._nBaseItems += 1;
                }
                pItem.setState(this);
                this._pItemList.push(pItem);
            };

            State.prototype.tryPush_LR0 = function (pRule, iPos) {
                var i;
                var pItems = this._pItemList;
                for (i = 0; i < pItems.length; i++) {
                    if (pItems[i].getRule() === pRule && pItems[i].getPosition() === iPos) {
                        return false;
                    }
                }
                var pItem = new parser.Item(pRule, iPos);
                this.push(pItem);
                return true;
            };

            State.prototype.tryPush_LR = function (pRule, iPos, sExpectedSymbol) {
                var i;
                var pItems = (this._pItemList);

                for (i = 0; i < pItems.length; i++) {
                    if (pItems[i].getRule() === pRule && pItems[i].getPosition() === iPos) {
                        return pItems[i].addExpected(sExpectedSymbol);
                    }
                }

                var pExpected = {};
                pExpected[sExpectedSymbol] = true;

                var pItem = new parser.Item(pRule, iPos, pExpected);
                this.push(pItem);
                return true;
            };

            State.prototype.getNextStateBySymbol = function (sSymbol) {
                if (akra.isDef(this._pNextStates[sSymbol])) {
                    return this._pNextStates[sSymbol];
                } else {
                    return null;
                }
            };

            State.prototype.addNextState = function (sSymbol, pState) {
                if (akra.isDef(this._pNextStates[sSymbol])) {
                    return false;
                } else {
                    this._pNextStates[sSymbol] = pState;
                    return true;
                }
            };

            State.prototype.deleteNotBase = function () {
                this._pItemList.length = this._nBaseItems;
            };

            State.prototype.toString = function (isBase) {
                if (typeof isBase === "undefined") { isBase = true; }
                var len = 0;
                var sMsg;
                var pItemList = this._pItemList;

                sMsg = "State " + this._iIndex + ":\n";
                len = isBase ? this._nBaseItems : pItemList.length;

                for (var j = 0; j < len; j++) {
                    sMsg += "\t\t";
                    sMsg += pItemList[j].toString();
                    sMsg += "\n";
                }

                return sMsg;
            };
            return State;
        })();
        parser.State = State;
    })(akra.parser || (akra.parser = {}));
    var parser = akra.parser;
})(akra || (akra = {}));
/// <reference path="../idl/parser/IParser.ts" />
/// <reference path="../idl/IMap.ts" />
/// <reference path="../bf/bf.ts" />
/// <reference path="../logger.ts" />
var akra;
(function (akra) {
    /// <reference path="Lexer.ts" />
    /// <reference path="ParseTree.ts" />
    /// <reference path="Item.ts" />
    /// <reference path="State.ts" />
    /// <reference path="symbols.ts" />
    (function (parser) {
        var PARSER_GRAMMAR_ADD_OPERATION = 2001;
        var PARSER_GRAMMAR_ADD_STATE_LINK = 2002;
        var PARSER_GRAMMAR_UNEXPECTED_SYMBOL = 2003;
        var PARSER_GRAMMAR_BAD_ADDITIONAL_FUNC_NAME = 2004;
        var PARSER_GRAMMAR_BAD_KEYWORD = 2005;
        var PARSER_SYNTAX_ERROR = 2051;

        akra.logger.registerCode(PARSER_GRAMMAR_ADD_OPERATION, "Grammar not LALR(1)! Cannot to generate syntax table. Add operation error.\n" + "Conflict in state with index: {stateIndex}. With grammar symbol: \"{grammarSymbol}\"\n" + "Old operation: {oldOperation}\n" + "New operation: {newOperation}\n" + "For more info init parser in debug-mode and see syntax table and list of states.");

        akra.logger.registerCode(PARSER_GRAMMAR_ADD_STATE_LINK, "Grammar not LALR(1)! Cannot to generate syntax table. Add state link error.\n" + "Conflict in state with index: {stateIndex}. With grammar symbol: \"{grammarSymbol}\"\n" + "Old next state: {oldNextStateIndex}\n" + "New next state: {newNextStateIndex}\n" + "For more info init parser in debug-mode and see syntax table and list of states.");

        akra.logger.registerCode(PARSER_GRAMMAR_UNEXPECTED_SYMBOL, "Grammar error. Can`t generate rules from grammar\n" + "Unexpected symbol: {unexpectedSymbol}\n" + "Expected: {expectedSymbol}");

        akra.logger.registerCode(PARSER_GRAMMAR_BAD_ADDITIONAL_FUNC_NAME, "Grammar error. Empty additional function name.");
        akra.logger.registerCode(PARSER_GRAMMAR_BAD_KEYWORD, "Grammar error. Bad keyword: {badKeyword}\n" + "All keyword must be define in lexer rule block.");

        akra.logger.registerCode(PARSER_SYNTAX_ERROR, "Syntax error during parsing. Token: {tokenValue}\n" + "Line: {line}. Column: {column}.");

        function sourceLocationToString(pLocation) {
            var sLocation = "[" + pLocation.file + ":" + pLocation.line.toString() + "]: ";
            return sLocation;
        }

        function syntaxErrorLogRoutine(pLogEntity) {
            var sPosition = sourceLocationToString(pLogEntity.location);
            var sError = "Code: " + pLogEntity.code.toString() + ". ";
            var pParseMessage = pLogEntity.message.split(/\{(\w+)\}/);
            var pInfo = pLogEntity.info;

            for (var i = 0; i < pParseMessage.length; i++) {
                if (akra.isDef(pInfo[pParseMessage[i]])) {
                    pParseMessage[i] = pInfo[pParseMessage[i]];
                }
            }

            var sMessage = sPosition + sError + pParseMessage.join("");

            console.error.call(console, sMessage);
        }

        akra.logger.setCodeFamilyRoutine("ParserSyntaxErrors", syntaxErrorLogRoutine, 8 /* ERROR */);

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

                this._pSymbolMap = { END_SYMBOL: true };
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

                this._eType = 0 /* k_LR0 */;

                this._pRuleCreationModeMap = null;
                this._eParseMode = 1 /* k_AllNode */;

                // this._isSync = false;
                this._pStatesTempMap = null;
                this._pBaseItemList = null;

                this._pExpectedExtensionDMap = null;

                this._sFileName = "stdin";
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
                        for (i = pNode.children.length - 1; i >= 0; i--) {
                            sCode += this.returnCode(pNode.children[i]);
                        }
                        return sCode;
                    }
                }
                return "";
            };

            Parser.prototype.init = function (sGrammar, eMode, eType) {
                if (typeof eMode === "undefined") { eMode = 1 /* k_AllNode */; }
                if (typeof eType === "undefined") { eType = 2 /* k_LALR */; }
                try  {
                    this._eType = eType;
                    this._pLexer = new parser.Lexer(this);
                    this._eParseMode = eMode;
                    this.generateRules(sGrammar);
                    this.buildSyntaxTable();
                    this.generateFunctionByStateMap();
                    if (!akra.bf.testAll(eMode, 16 /* k_DebugMode */)) {
                        this.clearMem();
                    }
                    return true;
                } catch (e) {
                    akra.logger.log(e.stack);

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
                    this._pLexer._init(sSource);

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

                    while (!isStop) {
                        pOperation = pSyntaxTable[pStack[pStack.length - 1]][pToken.name];
                        if (akra.isDef(pOperation)) {
                            switch (pOperation.type) {
                                case 103 /* k_Success */:
                                    isStop = true;
                                    break;

                                case 101 /* k_Shift */:
                                    iStateIndex = pOperation.index;
                                    pStack.push(iStateIndex);
                                    pTree.addToken(pToken);

                                    eAdditionalOperationCode = this.operationAdditionalAction(iStateIndex, pToken.name);

                                    if (eAdditionalOperationCode === 100 /* k_Error */) {
                                        isError = true;
                                        isStop = true;
                                    } else if (eAdditionalOperationCode === 104 /* k_Pause */) {
                                        this._pToken = null;
                                        isStop = true;
                                        isPause = true;
                                    } else if (eAdditionalOperationCode === 105 /* k_Ok */) {
                                        pToken = this.readToken();
                                    }

                                    break;

                                case 102 /* k_Reduce */:
                                    iRuleLength = pOperation.rule.right.length;
                                    pStack.length -= iRuleLength;
                                    iStateIndex = pSyntaxTable[pStack[pStack.length - 1]][pOperation.rule.left].index;
                                    pStack.push(iStateIndex);
                                    pTree.reduceByRule(pOperation.rule, this._pRuleCreationModeMap[pOperation.rule.left]);

                                    eAdditionalOperationCode = this.operationAdditionalAction(iStateIndex, pOperation.rule.left);

                                    if (eAdditionalOperationCode === 100 /* k_Error */) {
                                        isError = true;
                                        isStop = true;
                                    } else if (eAdditionalOperationCode === 104 /* k_Pause */) {
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
                    return 2 /* k_Error */;
                }

                if (isPause) {
                    return 0 /* k_Pause */;
                }

                if (!isError) {
                    pTree.finishTree();
                    if (!akra.isNull(this._fnFinishCallback)) {
                        this._fnFinishCallback.call(this._pCaller, 1 /* k_Ok */, this.getParseFileName());
                    }
                    this._sFileName = "stdin";
                    return 1 /* k_Ok */;
                } else {
                    this._error(PARSER_SYNTAX_ERROR, pToken);
                    if (!akra.isNull(this._fnFinishCallback)) {
                        this._fnFinishCallback.call(this._pCaller, 2 /* k_Error */, this.getParseFileName());
                    }
                    this._sFileName = "stdin";
                    return 2 /* k_Error */;
                }
            };

            Parser.prototype.setParseFileName = function (sFileName) {
                this._sFileName = sFileName;
            };

            Parser.prototype.getParseFileName = function () {
                return this._sFileName;
            };

            Parser.prototype.pause = function () {
                return 0 /* k_Pause */;
            };

            Parser.prototype.resume = function () {
                return this.resumeParse();
            };

            Parser.prototype.printStates = function (isBaseOnly) {
                if (typeof isBaseOnly === "undefined") { isBaseOnly = true; }
                if (!akra.isDef(this._pStateList)) {
                    akra.logger.log("It`s impossible to print states. You must init parser in debug-mode");
                    return;
                }
                var sMsg = "\n" + this.statesToString(isBaseOnly);
                akra.logger.log(sMsg);
            };

            Parser.prototype.printState = function (iStateIndex, isBaseOnly) {
                if (typeof isBaseOnly === "undefined") { isBaseOnly = true; }
                if (!akra.isDef(this._pStateList)) {
                    akra.logger.log("It`s impossible to print states. You must init parser in debug-mode");
                    return;
                }

                var pState = this._pStateList[iStateIndex];
                if (!akra.isDef(pState)) {
                    akra.logger.log("Can not print stete with index: " + iStateIndex.toString());
                    return;
                }

                var sMsg = "\n" + pState.toString(isBaseOnly);
                akra.logger.log(sMsg);
            };

            Parser.prototype.getGrammarSymbols = function () {
                return this._pGrammarSymbols;
            };

            Parser.prototype.getSyntaxTree = function () {
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

            Parser.prototype.addAdditionalFunction = function (sFuncName, fnRuleFunction) {
                if (akra.isNull(this._pAdditionalFunctionsMap)) {
                    this._pAdditionalFunctionsMap = {};
                }
                this._pAdditionalFunctionsMap[sFuncName] = fnRuleFunction;
            };

            Parser.prototype.addTypeId = function (sIdentifier) {
                if (akra.isNull(this._pTypeIdMap)) {
                    this._pTypeIdMap = {};
                }
                this._pTypeIdMap[sIdentifier] = true;
            };

            Parser.prototype.defaultInit = function () {
                this._iIndex = 0;
                this._pStack = [0];
                this._pSyntaxTree = new parser.ParseTree();
                this._pTypeIdMap = {};

                this._pSyntaxTree.setOptimizeMode(akra.bf.testAll(this._eParseMode, 8 /* k_Optimize */));
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

                var pLogEntity = { code: eCode, info: pInfo, location: pLocation };

                var pToken;
                var iLine;
                var iColumn;
                var iStateIndex;
                var sSymbol;
                var pOldOperation;
                var pNewOperation;
                var iOldNextStateIndex;
                var iNewNextStateIndex;
                var sExpectedSymbol;
                var sUnexpectedSymbol;
                var sBadKeyword;

                if (eCode === PARSER_SYNTAX_ERROR) {
                    pToken = pErrorInfo;
                    iLine = pToken.line;
                    iColumn = pToken.start;

                    pInfo.tokenValue = pToken.value;
                    pInfo.line = iLine;
                    pInfo.column = iColumn;

                    pLocation.file = this.getParseFileName();
                    pLocation.line = iLine;
                } else if (eCode === PARSER_GRAMMAR_ADD_OPERATION) {
                    iStateIndex = pErrorInfo.stateIndex;
                    sSymbol = pErrorInfo.grammarSymbol;
                    pOldOperation = pErrorInfo.oldOperation;
                    pNewOperation = pErrorInfo.newOperation;

                    pInfo.stateIndex = iStateIndex;
                    pInfo.grammarSymbol = sSymbol;
                    pInfo.oldOperation = this.operationToString(pOldOperation);
                    pInfo.newOperation = this.operationToString(pNewOperation);

                    pLocation.file = "GRAMMAR";
                    pLocation.line = 0;
                } else if (eCode === PARSER_GRAMMAR_ADD_STATE_LINK) {
                    iStateIndex = pErrorInfo.stateIndex;
                    sSymbol = pErrorInfo.grammarSymbol;
                    iOldNextStateIndex = pErrorInfo.oldNextStateIndex;
                    iNewNextStateIndex = pErrorInfo.newNextStateIndex;

                    pInfo.stateIndex = iStateIndex;
                    pInfo.grammarSymbol = sSymbol;
                    pInfo.oldNextStateIndex = iOldNextStateIndex;
                    pInfo.newNextStateIndex = iNewNextStateIndex;

                    pLocation.file = "GRAMMAR";
                    pLocation.line = 0;
                } else if (eCode === PARSER_GRAMMAR_UNEXPECTED_SYMBOL) {
                    iLine = pErrorInfo.grammarLine;
                    sExpectedSymbol = pErrorInfo.expectedSymbol;
                    sUnexpectedSymbol = pErrorInfo.unexpectedSymbol;

                    pInfo.expectedSymbol = sExpectedSymbol;
                    pInfo.unexpectedSymbol = sExpectedSymbol;

                    pLocation.file = "GRAMMAR";
                    pLocation.line = iLine || 0;
                } else if (eCode === PARSER_GRAMMAR_BAD_ADDITIONAL_FUNC_NAME) {
                    iLine = pErrorInfo.grammarLine;

                    pLocation.file = "GRAMMAR";
                    pLocation.line = iLine || 0;
                } else if (eCode === PARSER_GRAMMAR_BAD_KEYWORD) {
                    iLine = pErrorInfo.grammarLine;
                    sBadKeyword = pErrorInfo.badKeyword;

                    pInfo.badKeyword = sBadKeyword;

                    pLocation.file = "GRAMMAR";
                    pLocation.line = iLine || 0;
                }

                akra.logger.error(pLogEntity);

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

                for (i = 0; i < pStateList.length; i++) {
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
                pState.setIndex(this._pStateList.length);
                this._pStateList.push(pState);
            };

            Parser.prototype.pushBaseItem = function (pItem) {
                pItem.setIndex(this._pBaseItemList.length);
                this._pBaseItemList.push(pItem);
            };

            Parser.prototype.tryAddState = function (pState, eType) {
                var pRes = this.hasState(pState, eType);

                if (akra.isNull(pRes)) {
                    if (eType === 0 /* k_LR0 */) {
                        var pItems = pState.getItems();
                        for (var i = 0; i < pItems.length; i++) {
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
                for (var i in pRulesDMap[sSymbol]) {
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
                if (akra.isDef(pSyntaxTable[iIndex][sSymbol])) {
                    this._error(PARSER_GRAMMAR_ADD_OPERATION, {
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
                    this._error(PARSER_GRAMMAR_ADD_STATE_LINK, {
                        stateIndex: pState.getIndex(),
                        oldNextStateIndex: pState.getNextStateBySymbol(sSymbol),
                        newNextStateIndex: pNextState.getIndex(),
                        grammarSymbol: this.convertGrammarSymbol(sSymbol)
                    });
                }
            };

            Parser.prototype.firstTerminal = function (sSymbol) {
                if (this.isTerminal(sSymbol)) {
                    return null;
                }

                if (akra.isDef(this._pFirstTerminalsDMap[sSymbol])) {
                    return this._pFirstTerminalsDMap[sSymbol];
                }

                var sRule, sName;
                var pNames;
                var i = 0, j = 0, k = 0;
                var pRulesMap = this._pRulesDMap[sSymbol];

                var pTempRes = {};
                var pRes;

                var pRight;
                var isFinish;

                pRes = this._pFirstTerminalsDMap[sSymbol] = {};

                if (this.hasEmptyRule(sSymbol)) {
                    pRes[parser.T_EMPTY] = true;
                }

                if (akra.isNull(pRulesMap)) {
                    return pRes;
                }

                var pRuleNames = Object.keys(pRulesMap);

                for (i = 0; i < pRuleNames.length; ++i) {
                    sRule = pRuleNames[i];

                    isFinish = false;
                    pRight = pRulesMap[sRule].right;

                    for (j = 0; j < pRight.length; j++) {
                        if (pRight[j] === sSymbol) {
                            if (pRes[parser.T_EMPTY]) {
                                continue;
                            }

                            isFinish = true;
                            break;
                        }

                        pTempRes = this.firstTerminal(pRight[j]);

                        if (akra.isNull(pTempRes)) {
                            pRes[pRight[j]] = true;
                        } else {
                            for (pNames = Object.keys(pTempRes), k = 0; k < pNames.length; ++k) {
                                sName = pNames[k];
                                pRes[sName] = true;
                            }
                        }

                        if (!this.hasEmptyRule(pRight[j])) {
                            isFinish = true;
                            break;
                        }
                    }

                    if (!isFinish) {
                        pRes[parser.T_EMPTY] = true;
                    }
                }

                return pRes;
            };

            Parser.prototype.followTerminal = function (sSymbol) {
                if (akra.isDef(this._pFollowTerminalsDMap[sSymbol])) {
                    return this._pFollowTerminalsDMap[sSymbol];
                }

                var i = 0, j = 0, k = 0, l = 0, m = 0;
                var pRulesDMap = this._pRulesDMap;
                var pRulesDMapKeys, pRulesMapKeys;

                var pRule;
                var pTempRes;
                var pTempKeys;
                var pRes;

                var pRight;
                var isFinish;

                var sFirstKey;
                var sSecondKey;

                pRes = this._pFollowTerminalsDMap[sSymbol] = {};

                if (akra.isNull(pRulesDMap)) {
                    return pRes;
                }

                pRulesDMapKeys = Object.keys(pRulesDMap);
                for (i = 0; i < pRulesDMapKeys.length; i++) {
                    sFirstKey = pRulesDMapKeys[i];

                    if (akra.isNull(pRulesDMap[sFirstKey])) {
                        continue;
                    }

                    pRulesMapKeys = Object.keys(pRulesDMap[sFirstKey]);

                    for (j = 0; j < pRulesMapKeys.length; j++) {
                        pRule = pRulesDMap[sFirstKey][sSecondKey];
                        pRight = pRule.right;

                        for (k = 0; k < pRight.length; k++) {
                            if (pRight[k] === sSymbol) {
                                if (k === pRight.length - 1) {
                                    pTempRes = this.followTerminal(pRule.left);

                                    pTempKeys = Object.keys(pTempRes);
                                    for (m = 0; m < pTempKeys.length; i++) {
                                        pRes[pTempKeys[m]] = true;
                                    }
                                } else {
                                    isFinish = false;

                                    for (l = k + 1; l < pRight.length; l++) {
                                        pTempRes = this.firstTerminal(pRight[l]);

                                        if (akra.isNull(pTempRes)) {
                                            pRes[pRight[l]] = true;
                                            isFinish = true;
                                            break;
                                        } else {
                                            pTempKeys = Object.keys(pTempRes);
                                            for (m = 0; m < pTempKeys.length; i++) {
                                                pRes[pTempKeys[m]] = true;
                                            }
                                        }

                                        if (!pTempRes[parser.T_EMPTY]) {
                                            isFinish = true;
                                            break;
                                        }
                                    }

                                    if (!isFinish) {
                                        pTempRes = this.followTerminal(pRule.left);

                                        pTempKeys = Object.keys(pTempRes);
                                        for (m = 0; m < pTempKeys.length; i++) {
                                            pRes[pTempKeys[m]] = true;
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
                var i = 0, j = 0;

                var pTempRes;
                var pRes = {};

                var isEmpty;

                var pKeys;
                var sKey;

                for (i = 0; i < pSet.length; i++) {
                    pTempRes = this.firstTerminal(pSet[i]);

                    if (akra.isNull(pTempRes)) {
                        pRes[pSet[i]] = true;

                        return pRes;
                    }

                    isEmpty = false;

                    pKeys = Object.keys(pTempRes);

                    for (j = 0; j < pKeys.length; j++) {
                        sKey = pKeys[j];

                        if (sKey === parser.T_EMPTY) {
                            isEmpty = true;
                            continue;
                        }
                        pRes[sKey] = true;
                    }

                    if (!isEmpty) {
                        return pRes;
                    }
                }

                if (!akra.isNull(pExpected)) {
                    pKeys = Object.keys(pExpected);
                    for (j = 0; j < pKeys.length; j++) {
                        pRes[pKeys[j]] = true;
                    }
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

                var isAllNodeMode = akra.bf.testAll(this._eParseMode, 1 /* k_AllNode */);
                var isNegateMode = akra.bf.testAll(this._eParseMode, 2 /* k_Negate */);
                var isAddMode = akra.bf.testAll(this._eParseMode, 4 /* k_Add */);

                var pSymbolsWithNodeMap = this._pRuleCreationModeMap;

                var sName;

                for (i = 0; i < pAllRuleList.length; i++) {
                    if (pAllRuleList[i] === "" || pAllRuleList[i] === "\r") {
                        continue;
                    }

                    pTempRule = pAllRuleList[i].split(/\s* \s*/);

                    if (isLexerBlock) {
                        if ((pTempRule.length === 3 || (pTempRule.length === 4 && pTempRule[3] === "")) && ((pTempRule[2][0] === "\"" || pTempRule[2][0] === "'") && pTempRule[2].length > 3)) {
                            //TERMINALS
                            if (pTempRule[2][0] !== pTempRule[2][pTempRule[2].length - 1]) {
                                this._error(PARSER_GRAMMAR_UNEXPECTED_SYMBOL, {
                                    unexpectedSymbol: pTempRule[2][pTempRule[2].length - 1],
                                    expectedSymbol: pTempRule[2][0],
                                    grammarLine: i
                                });
                            }

                            pTempRule[2] = pTempRule[2].slice(1, pTempRule[2].length - 1);

                            var ch = pTempRule[2][0];

                            if ((ch === "_") || (ch >= "a" && ch <= "z") || (ch >= "A" && ch <= "Z")) {
                                sName = this._pLexer._addKeyword(pTempRule[2], pTempRule[0]);
                            } else {
                                sName = this._pLexer._addPunctuator(pTempRule[2], pTempRule[0]);
                            }

                            this._pGrammarSymbols[sName] = pTempRule[2];
                        }

                        continue;
                    }

                    if (pTempRule[0] === parser.LEXER_RULES) {
                        isLexerBlock = true;
                        continue;
                    }

                    //NON TERMNINAL RULES
                    if (akra.isDef(this._pRulesDMap[pTempRule[0]]) === false) {
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
                        pSymbolsWithNodeMap[pTempRule[0]] = 0 /* k_Default */;
                    } else if (isNegateMode && !akra.isDef(pSymbolsWithNodeMap[pTempRule[0]])) {
                        pSymbolsWithNodeMap[pTempRule[0]] = 0 /* k_Default */;
                    } else if (isAddMode && !akra.isDef(pSymbolsWithNodeMap[pTempRule[0]])) {
                        pSymbolsWithNodeMap[pTempRule[0]] = 2 /* k_Not */;
                    }

                    for (j = 2; j < pTempRule.length; j++) {
                        if (pTempRule[j] === "") {
                            continue;
                        }
                        if (pTempRule[j] === parser.FLAG_RULE_CREATE_NODE) {
                            if (isAddMode) {
                                pSymbolsWithNodeMap[pTempRule[0]] = 1 /* k_Necessary */;
                            }
                            continue;
                        }
                        if (pTempRule[j] === parser.FLAG_RULE_NOT_CREATE_NODE) {
                            if (isNegateMode && !isAllNodeMode) {
                                pSymbolsWithNodeMap[pTempRule[0]] = 2 /* k_Not */;
                            }
                            continue;
                        }
                        if (pTempRule[j] === parser.FLAG_RULE_FUNCTION) {
                            if ((!pTempRule[j + 1] || pTempRule[j + 1].length === 0)) {
                                this._error(PARSER_GRAMMAR_BAD_ADDITIONAL_FUNC_NAME, { grammarLine: i });
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
                                this._error(PARSER_GRAMMAR_BAD_KEYWORD, {
                                    badKeyword: pTempRule[j],
                                    grammarLine: i
                                });
                            }
                            if (pTempRule[j][0] !== pTempRule[j][2]) {
                                this._error(PARSER_GRAMMAR_UNEXPECTED_SYMBOL, {
                                    unexpectedSymbol: pTempRule[j][2],
                                    expectedSymbol: pTempRule[j][0],
                                    grammarLine: i
                                });
                                //this._error("Can`t generate rules from grammar! Unexpected symbol! Must be");
                            }

                            sName = this._pLexer._addPunctuator(pTempRule[j][1]);
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
                if (akra.isNull(this._pAdditionalFunctionsMap)) {
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

                for (i = 0; i < pFuncInfoList.length; i++) {
                    pFuncInfo = pFuncInfoList[i];

                    pFunc = this._pAdditionalFunctionsMap[pFuncInfo.name];
                    if (!akra.isDef(pFunc)) {
                        continue;
                    }

                    pRule = pFuncInfo.rule;
                    iPos = pFuncInfo.position;
                    sGrammarSymbol = pRule.right[iPos - 1];

                    for (j = 0; j < pStateList.length; j++) {
                        if (pStateList[j].hasRule(pRule, iPos)) {
                            if (!akra.isDef(pFuncByStateDMap[pStateList[j].getIndex()])) {
                                pFuncByStateDMap[pStateList[j].getIndex()] = {};
                            }

                            pFuncByStateDMap[pStateList[j].getIndex()][sGrammarSymbol] = pFunc;
                        }
                    }
                }
            };

            Parser.prototype.generateFirstState = function (eType) {
                if (eType === 0 /* k_LR0 */) {
                    this.generateFirstState_LR0();
                } else {
                    this.generateFirstState_LR();
                }
            };

            Parser.prototype.generateFirstState_LR0 = function () {
                var pState = new parser.State();
                var pItem = new parser.Item(this._pRulesDMap[parser.START_SYMBOL][0], 0);

                this.pushBaseItem(pItem);
                pState.push(pItem);

                this.closure_LR0(pState);
                this.pushState(pState);
            };

            Parser.prototype.generateFirstState_LR = function () {
                var pState = new parser.State();
                var pExpected = {};
                pExpected[parser.END_SYMBOL] = true;

                pState.push(new parser.Item(this._pRulesDMap[parser.START_SYMBOL][0], 0, pExpected));

                this.closure_LR(pState);
                this.pushState(pState);
            };

            Parser.prototype.closure = function (pState, eType) {
                if (eType === 0 /* k_LR0 */) {
                    return this.closure_LR0(pState);
                } else {
                    return this.closure_LR(pState);
                }
            };

            Parser.prototype.closure_LR0 = function (pState) {
                var pItemList = pState.getItems();
                var i = 0, j = 0;
                var sSymbol;
                var pKeys;

                for (i = 0; i < pItemList.length; i++) {
                    sSymbol = pItemList[i].mark();

                    if (sSymbol !== parser.END_POSITION && (!this.isTerminal(sSymbol))) {
                        pKeys = Object.keys(this._pRulesDMap[sSymbol]);
                        for (j = 0; j < pKeys.length; j++) {
                            pState.tryPush_LR0(this._pRulesDMap[sSymbol][pKeys[j]], 0);
                        }
                    }
                }
                return pState;
            };

            Parser.prototype.closure_LR = function (pState) {
                var pItemList = (pState.getItems());
                var i = 0, j = 0, k = 0;
                var sSymbol;
                var pSymbols;
                var pTempSet;
                var isNewExpected = false;

                var pRulesMapKeys, pSymbolsKeys;

                while (true) {
                    if (i === pItemList.length) {
                        if (!isNewExpected) {
                            break;
                        }
                        i = 0;
                        isNewExpected = false;
                    }
                    sSymbol = pItemList[i].mark();

                    if (sSymbol !== parser.END_POSITION && (!this.isTerminal(sSymbol))) {
                        pTempSet = pItemList[i].getRule().right.slice(pItemList[i].getPosition() + 1);
                        pSymbols = this.firstTerminalForSet(pTempSet, pItemList[i].getExpectedSymbols());

                        pRulesMapKeys = Object.keys(this._pRulesDMap[sSymbol]);
                        pSymbolsKeys = Object.keys(pSymbols);

                        for (j = 0; j < pRulesMapKeys.length; j++) {
                            for (k = 0; k < pSymbolsKeys.length; k++) {
                                if (pState.tryPush_LR(this._pRulesDMap[sSymbol][pRulesMapKeys[j]], 0, pSymbolsKeys[k])) {
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
                if (eType === 0 /* k_LR0 */) {
                    return this.nextState_LR0(pState, sSymbol);
                } else {
                    return this.nextState_LR(pState, sSymbol);
                }
            };

            Parser.prototype.nextState_LR0 = function (pState, sSymbol) {
                var pItemList = pState.getItems();
                var i = 0;
                var pNewState = new parser.State();

                for (i = 0; i < pItemList.length; i++) {
                    if (sSymbol === pItemList[i].mark()) {
                        pNewState.push(new parser.Item(pItemList[i].getRule(), pItemList[i].getPosition() + 1));
                    }
                }

                return pNewState;
            };

            Parser.prototype.nextState_LR = function (pState, sSymbol) {
                var pItemList = pState.getItems();
                var i = 0;
                var pNewState = new parser.State();

                for (i = 0; i < pItemList.length; i++) {
                    if (sSymbol === pItemList[i].mark()) {
                        pNewState.push(new parser.Item(pItemList[i].getRule(), pItemList[i].getPosition() + 1, pItemList[i].getExpectedSymbols()));
                    }
                }

                return pNewState;
            };

            Parser.prototype.deleteNotBaseItems = function () {
                var i = 0;
                for (i = 0; i < this._pStateList.length; i++) {
                    this._pStateList[i].deleteNotBase();
                }
            };

            Parser.prototype.closureForItem = function (pRule, iPos) {
                var sIndex = "";
                sIndex += pRule.index + "_" + iPos;

                var pState = this._pStatesTempMap[sIndex];
                if (akra.isDef(pState)) {
                    return pState;
                } else {
                    var pExpected = {};
                    pExpected[parser.UNUSED_SYMBOL] = true;

                    pState = new parser.State();
                    pState.push(new parser.Item(pRule, iPos, pExpected));

                    this.closure_LR(pState);
                    this._pStatesTempMap[sIndex] = pState;

                    return pState;
                }
            };

            Parser.prototype.addLinkExpected = function (pItem, pItemX) {
                var pTable = this._pExpectedExtensionDMap;
                var iIndex = pItem.getIndex();

                if (!akra.isDef(pTable[iIndex])) {
                    pTable[iIndex] = {};
                }

                pTable[iIndex][pItemX.getIndex()] = true;
            };

            Parser.prototype.determineExpected = function (pTestState, sSymbol) {
                var pStateX = pTestState.getNextStateBySymbol(sSymbol);

                if (akra.isNull(pStateX)) {
                    return;
                }

                var pItemListX = pStateX.getItems();
                var pItemList = pTestState.getItems();
                var pState;
                var pItem;
                var i = 0, j = 0, k;

                var nBaseItemTest = pTestState.getNumBaseItems();
                var nBaseItemX = pStateX.getNumBaseItems();

                for (i = 0; i < nBaseItemTest; i++) {
                    pState = this.closureForItem(pItemList[i].getRule(), pItemList[i].getPosition());

                    for (j = 0; j < nBaseItemX; j++) {
                        pItem = pState.hasChildItem(pItemListX[j]);

                        if (pItem) {
                            var pExpected = pItem.getExpectedSymbols();

                            for (k in pExpected) {
                                if (k === parser.UNUSED_SYMBOL) {
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
                var i = 0, j = 0;
                var pStates = this._pStateList;
                var pKeys;

                for (i = 0; i < pStates.length; i++) {
                    pKeys = Object.keys(this._pSymbolMap);
                    for (j = 0; j < pKeys.length; j++) {
                        this.determineExpected(pStates[i], pKeys[j]);
                    }
                }
            };

            Parser.prototype.expandExpected = function () {
                var pItemList = this._pBaseItemList;
                var pTable = this._pExpectedExtensionDMap;
                var i = 0, j = 0, k = 0;
                var sSymbol = "";
                var isNewExpected = false;

                pItemList[0].addExpected(parser.END_SYMBOL);
                pItemList[0].setIsNewExpected(true);

                while (true) {
                    if (i === pItemList.length) {
                        if (!isNewExpected) {
                            break;
                        }
                        isNewExpected = false;
                        i = 0;
                    }

                    if (pItemList[i].getIsNewExpected() && akra.isDefAndNotNull(pTable[i]) && akra.isDefAndNotNull(pItemList[i].getExpectedSymbols())) {
                        var pExpectedSymbols = Object.keys(pItemList[i].getExpectedSymbols());
                        var pKeys = Object.keys(pTable[i]);

                        for (j = 0; j < pExpectedSymbols.length; j++) {
                            sSymbol = pExpectedSymbols[j];
                            for (k = 0; k < pKeys.length; k++) {
                                if (pItemList[pKeys[k]].addExpected(sSymbol)) {
                                    isNewExpected = true;
                                }
                            }
                        }
                    }

                    pItemList[i].setIsNewExpected(false);
                    i++;
                }
            };

            Parser.prototype.generateStates = function (eType) {
                if (eType === 0 /* k_LR0 */) {
                    this.generateStates_LR0();
                } else if (eType === 1 /* k_LR1 */) {
                    this.generateStates_LR();
                } else if (eType === 2 /* k_LALR */) {
                    this.generateStates_LALR();
                }
            };

            Parser.prototype.generateStates_LR0 = function () {
                this.generateFirstState_LR0();

                var i = 0, j = 0;
                var pStateList = this._pStateList;
                var sSymbol = "";
                var pState;
                var pSymbols = Object.keys(this._pSymbolMap);

                for (i = 0; i < pStateList.length; i++) {
                    for (j = 0; j < pSymbols.length; j++) {
                        sSymbol = pSymbols[j];
                        pState = this.nextState_LR0(pStateList[i], sSymbol);

                        if (!pState.isEmpty()) {
                            pState = this.tryAddState(pState, 0 /* k_LR0 */);
                            this.addStateLink(pStateList[i], pState, sSymbol);
                        }
                    }
                }
            };

            Parser.prototype.generateStates_LR = function () {
                this._pFirstTerminalsDMap = {};
                this.generateFirstState_LR();

                var i = 0, j = 0;
                var pStateList = this._pStateList;
                var sSymbol = "";
                var pState;
                var pSymbols = Object.keys(this._pSymbolMap);

                for (i = 0; i < pStateList.length; i++) {
                    for (j = 0; j < pSymbols.length; j++) {
                        sSymbol = pSymbols[j];
                        pState = this.nextState_LR(pStateList[i], sSymbol);

                        if (!pState.isEmpty()) {
                            pState = this.tryAddState(pState, 1 /* k_LR1 */);
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

                for (i = 0; i < pStateList.length; i++) {
                    this.closure_LR(pStateList[i]);
                }
            };

            Parser.prototype.calcBaseItem = function () {
                var num = 0;
                var i = 0;

                for (i = 0; i < this._pStateList.length; i++) {
                    num += this._pStateList[i].getNumBaseItems();
                }

                return num;
            };

            Parser.prototype.printExpectedTable = function () {
                var i = 0, j = 0;
                var sMsg = "";

                var pKeys = Object.keys(this._pExpectedExtensionDMap);
                for (i = 0; i < pKeys.length; i++) {
                    sMsg += "State " + this._pBaseItemList[pKeys[i]].getState().getIndex() + ":   ";
                    sMsg += this._pBaseItemList[pKeys[i]].toString() + "  |----->\n";

                    var pExtentions = Object.keys(this._pExpectedExtensionDMap[pKeys[i]]);
                    for (j = 0; j < pExtentions.length; j++) {
                        sMsg += "\t\t\t\t\t" + "State " + this._pBaseItemList[pExtentions[j]].getState().getIndex() + ":   ";
                        sMsg += this._pBaseItemList[pExtentions[j]].toString() + "\n";
                    }

                    sMsg += "\n";
                }

                return sMsg;
            };

            Parser.prototype.addReducing = function (pState) {
                var i = 0, j = 0;
                var pItemList = pState.getItems();

                for (i = 0; i < pItemList.length; i++) {
                    if (pItemList[i].mark() === parser.END_POSITION) {
                        if (pItemList[i].getRule().left === parser.START_SYMBOL) {
                            this.pushInSyntaxTable(pState.getIndex(), parser.END_SYMBOL, this._pSuccessOperation);
                        } else {
                            var pExpected = pItemList[i].getExpectedSymbols();

                            var pKeys = Object.keys(pExpected);
                            for (j = 0; j < pKeys.length; j++) {
                                this.pushInSyntaxTable(pState.getIndex(), pKeys[j], this._pReduceOperationsMap[pItemList[i].getRule().index]);
                            }
                        }
                    }
                }
            };

            Parser.prototype.addShift = function (pState) {
                var i = 0;
                var pStateMap = pState.getNextStates();

                var pStateKeys = Object.keys(pStateMap);

                for (i = 0; i < pStateKeys.length; i++) {
                    var sSymbol = pStateKeys[i];
                    this.pushInSyntaxTable(pState.getIndex(), sSymbol, this._pShiftOperationsMap[pStateMap[sSymbol].getIndex()]);
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

                this._pSuccessOperation = { type: 103 /* k_Success */ };

                var i = 0, j = 0, k = 0;

                for (i = 0; i < pStateList.length; i++) {
                    this._pShiftOperationsMap[pStateList[i].getIndex()] = {
                        type: 101 /* k_Shift */,
                        index: pStateList[i].getIndex()
                    };
                }

                var pRulesDMapKeys = Object.keys(this._pRulesDMap);
                for (j = 0; j < pRulesDMapKeys.length; j++) {
                    var pRulesMapKeys = Object.keys(this._pRulesDMap[pRulesDMapKeys[j]]);
                    for (k = 0; k < pRulesMapKeys.length; k++) {
                        var sSymbol = pRulesMapKeys[k];
                        var pRule = this._pRulesDMap[pRulesDMapKeys[j]][sSymbol];

                        this._pReduceOperationsMap[sSymbol] = {
                            type: 102 /* k_Reduce */,
                            rule: pRule
                        };
                    }
                }

                for (i = 0; i < pStateList.length; i++) {
                    pState = pStateList[i];
                    this.addReducing(pState);
                    this.addShift(pState);
                }
            };

            Parser.prototype.readToken = function () {
                return this._pLexer._getNextToken();
            };

            Parser.prototype.operationAdditionalAction = function (iStateIndex, sGrammarSymbol) {
                var pFuncDMap = this._pAdidtionalFunctByStateDMap;

                if (!akra.isNull(this._pAdidtionalFunctByStateDMap) && akra.isDef(pFuncDMap[iStateIndex]) && akra.isDef(pFuncDMap[iStateIndex][sGrammarSymbol])) {
                    return pFuncDMap[iStateIndex][sGrammarSymbol].call(this);
                }

                return 105 /* k_Ok */;
            };

            Parser.prototype.resumeParse = function () {
                try  {
                    var pTree = this._pSyntaxTree;
                    var pStack = this._pStack;
                    var pSyntaxTable = this._pSyntaxTable;

                    var isStop = false;
                    var isError = false;
                    var isPause = false;
                    var pToken = akra.isNull(this._pToken) ? this.readToken() : this._pToken;

                    var pOperation;
                    var iRuleLength;

                    var eAdditionalOperationCode;
                    var iStateIndex = 0;

                    while (!isStop) {
                        pOperation = pSyntaxTable[pStack[pStack.length - 1]][pToken.name];
                        if (akra.isDef(pOperation)) {
                            switch (pOperation.type) {
                                case 103 /* k_Success */:
                                    isStop = true;
                                    break;

                                case 101 /* k_Shift */:
                                    iStateIndex = pOperation.index;
                                    pStack.push(iStateIndex);
                                    pTree.addToken(pToken);

                                    eAdditionalOperationCode = this.operationAdditionalAction(iStateIndex, pToken.name);

                                    if (eAdditionalOperationCode === 100 /* k_Error */) {
                                        isError = true;
                                        isStop = true;
                                    } else if (eAdditionalOperationCode === 104 /* k_Pause */) {
                                        this._pToken = null;
                                        isStop = true;
                                        isPause = true;
                                    } else if (eAdditionalOperationCode === 105 /* k_Ok */) {
                                        pToken = this.readToken();
                                    }

                                    break;

                                case 102 /* k_Reduce */:
                                    iRuleLength = pOperation.rule.right.length;
                                    pStack.length -= iRuleLength;
                                    iStateIndex = pSyntaxTable[pStack[pStack.length - 1]][pOperation.rule.left].index;
                                    pStack.push(iStateIndex);
                                    pTree.reduceByRule(pOperation.rule, this._pRuleCreationModeMap[pOperation.rule.left]);

                                    eAdditionalOperationCode = this.operationAdditionalAction(iStateIndex, pOperation.rule.left);

                                    if (eAdditionalOperationCode === 100 /* k_Error */) {
                                        isError = true;
                                        isStop = true;
                                    } else if (eAdditionalOperationCode === 104 /* k_Pause */) {
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
                    return 2 /* k_Error */;
                }
                if (isPause) {
                    return 0 /* k_Pause */;
                }

                if (!isError) {
                    pTree.finishTree();
                    if (akra.isDef(this._fnFinishCallback)) {
                        this._fnFinishCallback.call(this._pCaller, 1 /* k_Ok */, this.getParseFileName());
                    }
                    this._sFileName = "stdin";
                    return 1 /* k_Ok */;
                } else {
                    this._error(PARSER_SYNTAX_ERROR, pToken);
                    if (akra.isDef(this._fnFinishCallback)) {
                        this._fnFinishCallback.call(this._pCaller, 2 /* k_Error */, this.getParseFileName());
                    }
                    this._sFileName = "stdin";
                    return 2 /* k_Error */;
                }
            };

            Parser.prototype.statesToString = function (isBaseOnly) {
                if (typeof isBaseOnly === "undefined") { isBaseOnly = true; }
                if (!akra.isDef(this._pStateList)) {
                    return "";
                }

                var sMsg = "";
                var i = 0;

                for (i = 0; i < this._pStateList.length; i++) {
                    sMsg += this._pStateList[i].toString(isBaseOnly);
                    sMsg += " ";
                }

                return sMsg;
            };

            Parser.prototype.operationToString = function (pOperation) {
                var sOperation = "";

                switch (pOperation.type) {
                    case 101 /* k_Shift */:
                        sOperation = "SHIFT to state " + pOperation.index.toString();
                        break;
                    case 102 /* k_Reduce */:
                        sOperation = "REDUCE by rule { " + this.ruleToString(pOperation.rule) + " }";
                        break;
                    case 103 /* k_Success */:
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
                    return this._pLexer._getTerminalValueByName(sSymbol);
                }
            };
            return Parser;
        })();
        parser.Parser = Parser;
    })(akra.parser || (akra.parser = {}));
    var parser = akra.parser;
})(akra || (akra = {}));
