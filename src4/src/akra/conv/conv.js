var akra;
(function (akra) {
    /// <reference path="../idl/IConverter.ts" />
    /// <reference path="../idl/EDataTypes.ts" />
    /// <reference path="../idl/3d-party/fixes.d.ts" />
    /// <reference path="../common.ts" />
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
            var pDocFrag;

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
            if (!akra.isDef(iCount)) {
                iCount = ((pSrc).length / iStride - iFrom);
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
                pCodeList[i] = s.charCodeAt(i);
            }

            return pCodeList.buffer;
        }
        conv.stoab = stoab;

        /**
        * Convert ArrayBuffer to string.
        */
        function abtos(pBuf) {
            var pData = new Uint8Array(pBuf);
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
                if (this.status == 200) {
                    fn(this.response);
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
                if (this.status == 200) {
                    fn(this.response);
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
