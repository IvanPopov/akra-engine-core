/// <reference path="idl/AIConverter.ts" />
/// <reference path="idl/AEDataTypes.ts" />
/// <reference path="idl/common.d.ts" />
/// <reference path="idl/fixes.d.ts" />

export var conversionFormats: AIConvertionTable;

export function parseBool(sValue: string): boolean {
    return (sValue === "true");
}

export function parseString(sValue: string): string {
    return String(sValue);
}

export function parseJSON(sJSON: string): Object {
    return eval('(' + sJSON + ')');
}

/**
 * Convert text/html into Dom object.
 */
export function parseHTML(sHTML: string): NodeList {
    var pDivEl: HTMLDivElement = <HTMLDivElement>document.createElement('div');
    var pDocFrag: DocumentFragment;

    pDivEl.innerHTML = sHTML;

    return pDivEl.childNodes;
}

export function parseHTMLDocument(sHtml: string): DocumentFragment {
    var pDocFrag: DocumentFragment;
    var pNodes: NodeList = parseHTML(sHtml);

    pDocFrag = document.createDocumentFragment();

    for (var i = 0, len: uint = pNodes.length; i < len; ++i) {
        if (!isDef(pNodes[i])) {
            continue;
        }

        pDocFrag.appendChild(pNodes[i]);
    }

    return pDocFrag;
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
export function stoia(sData: string, ppData: int[], iFrom?: uint): uint {
    return string2Array<number>(sData, ppData, parseInt, iFrom);
}
export function stofa(sData: string, ppData: float[], iFrom?: uint): uint {
    return string2Array<number>(sData, ppData, parseFloat, iFrom);
}
export function stoba(sData: string, ppData: boolean[], iFrom?: uint): uint {
    return string2Array<boolean>(sData, ppData, parseBool, iFrom);
}
export function stosa(sData: string, ppData: string[], iFrom?: uint): uint {
    return string2Array<string>(sData, ppData, parseString, iFrom);
}

export function stoa<T>(sData: string, n: number, sType: string, isArray?: boolean): T {
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
    "int": { type: Int32Array, converter: stoia },
    "float": { type: Float32Array, converter: stofa },
    "bool": { type: Array, converter: stoba },
    "string": { type: Array, converter: stosa }
};


//////////////////

/**
 * Convert string to ArrayBuffer.
 */
export function stoab(s: string): ArrayBuffer {
    var len: uint = s.length;
    var pCodeList: Uint8Array = new Uint8Array(len);

    for (var i: int = 0; i < len; ++i) {
        pCodeList[i] = s.charCodeAt(i); /*& 0xFF;*/
    }

    return pCodeList.buffer;
}


/**
 * Convert ArrayBuffer to string.
 */
export function abtos(pBuf: ArrayBuffer): string {
    var pData: Uint8Array = new Uint8Array(pBuf);
    var s: string = "";

    for (var n: uint = 0; n < pData.length; ++n) {
        s += String.fromCharCode(pData[n]);
    }

    return s;
    // return String.fromCharCode.apply(null, Array.prototype.slice.call(new Uint8Array(pBuf), 0));
}


/**
 * Convert ArrayBuffer to string via BlobReader.
 */
export function abtosAsync(pBuffer: ArrayBuffer, callback: (result: string) => void): void {
    var bb = new Blob([pBuffer]);
    var f = new FileReader();

    f.onload = function (e) {
        callback(e.target.result);
    }

    f.readAsText(bb);
}


/**
 * Convert ArrayBuffer to typed array.
 */
export function abtota(pBuffer: ArrayBuffer, eType: AEDataTypes): ArrayBufferView {
    switch (eType) {
        case AEDataTypes.FLOAT:
            return new Float32Array(pBuffer);
        case AEDataTypes.SHORT:
            return new Int16Array(pBuffer);
        case AEDataTypes.UNSIGNED_SHORT:
            return new Uint16Array(pBuffer);
        case AEDataTypes.INT:
            return new Int32Array(pBuffer);
        case AEDataTypes.UNSIGNED_INT:
            return new Uint32Array(pBuffer);
        case AEDataTypes.BYTE:
            return new Int8Array(pBuffer);
        default:
        case AEDataTypes.UNSIGNED_BYTE:
            return new Uint8Array(pBuffer);
    }
}

/**
 * Blob to ArrayBuffer async.
 */
export function btoaAsync(pBlob: Blob, fn: (e: ErrorEvent, pBuffer: ArrayBuffer) => void): void {
    var pReader: FileReader = new FileReader();

    pReader.onload = function (e) {
        fn(null, e.target.result);
    };

    pReader.onerror = function (e: ErrorEvent) {
        fn(e, null);
    };

    pReader.readAsArrayBuffer(pBlob);
}

//DataURL to Blob object async.
export function dutobAsync(sBlobURL: string, fn: (b: Blob) => void): void {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", sBlobURL, true);
    xhr.responseType = "blob";

    xhr.onload = function (e) {
        if (this.status == 200) {
            fn(<Blob>this.response);
        }
    };

    xhr.send();
}

/**
 * Data URL to JSON.
 */
export function dutojAsync(sBlobURL: string, fn: (json: Object) => void): void {
    var xhr = new XMLHttpRequest();

    xhr.open("GET", sBlobURL, true);
    xhr.overrideMimeType('application/json');
    xhr.responseType = "json";

    xhr.onload = function (e) {
        if (this.status == 200) {
            fn(<Object>this.response);
        }
    };

    xhr.send();
}

/**
 * Data URL to Blob object.
 */
export function dutob(dataURI): Blob {
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

//TODO: remove this

export function toURL(data: any, mime: string = "text/plain"): string {
    var blob: Blob;

    try {
        blob = new Blob([data], { type: mime });
    } catch (e) {
        // Backwards-compatibility
        var bb: BlobBuilder = new BlobBuilder();
        bb.append(data);
        blob = bb.getBlob(mime);
    }

    return URL.createObjectURL(blob);
}

/** Convert UTF8 string to Base64 string*/
export function utf8tob64(s: string): string {
    return window.btoa(unescape(encodeURIComponent(s)));
}