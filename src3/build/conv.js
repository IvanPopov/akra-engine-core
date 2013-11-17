define(["require", "exports"], function(require, exports) {
    /// <reference path="idl/AIConverter.ts" />
    /// <reference path="idl/common.d.ts" />
    exports.conversionFormats;

    function parseBool(sValue) {
        return (sValue === "true");
    }
    exports.parseBool = parseBool;

    function parseString(sValue) {
        return String(sValue);
    }
    exports.parseString = parseString;

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
    function string2IntArray(sData, ppData, iFrom) {
        return exports.string2Array(sData, ppData, parseInt, iFrom);
    }
    exports.string2IntArray = string2IntArray;
    function string2FloatArray(sData, ppData, iFrom) {
        return exports.string2Array(sData, ppData, parseFloat, iFrom);
    }
    exports.string2FloatArray = string2FloatArray;
    function string2BoolArray(sData, ppData, iFrom) {
        return exports.string2Array(sData, ppData, exports.parseBool, iFrom);
    }
    exports.string2BoolArray = string2BoolArray;
    function string2StringArray(sData, ppData, iFrom) {
        return exports.string2Array(sData, ppData, exports.parseString, iFrom);
    }
    exports.string2StringArray = string2StringArray;

    function string2Any(sData, n, sType, isArray) {
        var pRow = exports.conversionFormats[sType];
        var ppData = new (pRow.type)(n);
        pRow.converter(sData, ppData);

        if (n == 1 && !isArray) {
            return ppData[0];
        }

        return ppData;
    }
    exports.string2Any = string2Any;

    // data convertion
    exports.conversionFormats = {
        "int": { type: Int32Array, converter: exports.string2IntArray },
        "float": { type: Float32Array, converter: exports.string2FloatArray },
        "bool": { type: Array, converter: exports.string2BoolArray },
        "string": { type: Array, converter: exports.string2StringArray }
    };
});
//# sourceMappingURL=conv.js.map
