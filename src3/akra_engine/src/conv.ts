/// <reference path="idl/AIConverter.ts" />
/// <reference path="idl/type.d.ts" />

export var conversionFormats: AIConvertionTable;

export function parseBool(sValue: string): boolean {
    return (sValue === "true");
}

export function parseString(sValue: string): string {
    return String(sValue);
}

export function retrieve<SRC_ARRAY_TYPE, DST_ARRAY_TYPE>(
    pSrc: SRC_ARRAY_TYPE, pDst: DST_ARRAY_TYPE, iStride?: uint,
    iFrom?: uint, iCount?: uint, iOffset?: uint,
    iLen?: uint): uint {

    if (!isDef(iCount)) {
        iCount = ((<any[]><any>pSrc).length / iStride - iFrom);
    }

    if (iOffset + iLen > iStride) {
        iLen = iStride - iOffset;
    }

    var iBegin: uint = iFrom * iStride;
    var n: uint = 0;

    for (var i: uint = 0; i < iCount; ++i) {
        for (var j = 0; j < iLen; ++j) {
            pDst[n++] = (pSrc[iBegin + i * iStride + iOffset + j]);
        }
    }

    return n;
}

export function string2Array<T>(
    sData: string, ppData: T[],
    fnConv: (data: string) => T, iFrom?: number): number {
    var pData: string[] = sData.split(/[\s]+/g);

    for (var i = 0, n = pData.length, j = 0; i < n; ++i) {
        if (pData[i] != "") {
            ppData[iFrom + j] = fnConv(pData[i]);
            j++;
        }
    }

    return j;
}
export function string2IntArray(sData: string, ppData: int[], iFrom?: uint): uint {
    return string2Array<number>(sData, ppData, parseInt, iFrom);
}
export function string2FloatArray(sData: string, ppData: float[], iFrom?: uint): uint {
    return string2Array<number>(sData, ppData, parseFloat, iFrom);
}
export function string2BoolArray(sData: string, ppData: boolean[], iFrom?: uint): uint {
    return string2Array<boolean>(sData, ppData, parseBool, iFrom);
}
export function string2StringArray(sData: string, ppData: string[], iFrom?: uint): uint {
    return string2Array<string>(sData, ppData, parseString, iFrom);
}

export function string2Any<T>(sData: string, n: number, sType: string, isArray?: boolean): T {
    var pRow: AIConvertionTableRow<T> = conversionFormats[sType];
    var ppData: T = new (pRow.type)(n);
    pRow.converter(sData, ppData);

    if (n == 1 && !isArray) {
        return ppData[0];
    }

    return ppData;
}

// data convertion

conversionFormats = {
    "int": { type: Int32Array, converter: string2IntArray },
    "float": { type: Float32Array, converter: string2FloatArray },
    "bool": { type: Array, converter: string2BoolArray },
    "string": { type: Array, converter: string2StringArray }
};
