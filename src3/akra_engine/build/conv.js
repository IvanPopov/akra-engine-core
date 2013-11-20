define(["require", "exports"], function(require, exports) {
    /// <reference path="idl/AIConverter.ts" />
    /// <reference path="idl/AEDataTypes.ts" />
    /// <reference path="idl/common.d.ts" />
    /// <reference path="idl/fixes.d.ts" />
    exports.conversionFormats;

    function parseBool(sValue) {
        return (sValue === "true");
    }
    exports.parseBool = parseBool;

    function parseString(sValue) {
        return String(sValue);
    }
    exports.parseString = parseString;

    function parseJSON(sJSON) {
        return eval('(' + sJSON + ')');
    }
    exports.parseJSON = parseJSON;

    /**
    * Convert text/html into Dom object.
    */
    function parseHTML(sHTML) {
        var pDivEl = document.createElement('div');
        var pDocFrag;

        pDivEl.innerHTML = sHTML;

        return pDivEl.childNodes;
    }
    exports.parseHTML = parseHTML;

    function parseHTMLDocument(sHtml) {
        var pDocFrag;
        var pNodes = exports.parseHTML(sHtml);

        pDocFrag = document.createDocumentFragment();

        for (var i = 0, len = pNodes.length; i < len; ++i) {
            if (!isDef(pNodes[i])) {
                continue;
            }

            pDocFrag.appendChild(pNodes[i]);
        }

        return pDocFrag;
    }
    exports.parseHTMLDocument = parseHTMLDocument;

    function retrieve(pSrc, pDst, iStride, iFrom, iCount, iOffset, iLen) {
        if (!isDef(iCount)) {
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
    exports.retrieve = retrieve;

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
    exports.string2Array = string2Array;
    function stoia(sData, ppData, iFrom) {
        return exports.string2Array(sData, ppData, parseInt, iFrom);
    }
    exports.stoia = stoia;
    function stofa(sData, ppData, iFrom) {
        return exports.string2Array(sData, ppData, parseFloat, iFrom);
    }
    exports.stofa = stofa;
    function stoba(sData, ppData, iFrom) {
        return exports.string2Array(sData, ppData, exports.parseBool, iFrom);
    }
    exports.stoba = stoba;
    function stosa(sData, ppData, iFrom) {
        return exports.string2Array(sData, ppData, exports.parseString, iFrom);
    }
    exports.stosa = stosa;

    function stoa(sData, n, sType, isArray) {
        var pRow = exports.conversionFormats[sType];
        var ppData = new (pRow.type)(n);
        pRow.converter(sData, ppData);

        if (n == 1 && !isArray) {
            return ppData[0];
        }

        return ppData;
    }
    exports.stoa = stoa;

    // data convertion
    exports.conversionFormats = {
        "int": { type: Int32Array, converter: exports.stoia },
        "float": { type: Float32Array, converter: exports.stofa },
        "bool": { type: Array, converter: exports.stoba },
        "string": { type: Array, converter: exports.stosa }
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
    exports.stoab = stoab;

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
    exports.abtos = abtos;

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
    exports.abtosAsync = abtosAsync;

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
    exports.abtota = abtota;

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
    exports.btoaAsync = btoaAsync;

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
    exports.dutobAsync = dutobAsync;

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
    exports.dutojAsync = dutojAsync;

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
    exports.dutob = dutob;

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
    exports.toURL = toURL;

    /** Convert UTF8 string to Base64 string*/
    function utf8tob64(s) {
        return window.btoa(unescape(encodeURIComponent(s)));
    }
    exports.utf8tob64 = utf8tob64;
});
//# sourceMappingURL=conv.js.map
