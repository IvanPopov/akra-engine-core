/// <reference path="../idl/IConverter.ts" />
/// <reference path="../idl/EDataTypes.ts" />
/// <reference path="../idl/3d-party/fixes.d.ts" />
/// <reference path="../common.ts" />

module akra.conv {
	export var conversionFormats: IConvertionTable;

	export function parseBool(sValue: string): boolean {
		return (sValue === "true");
	}

	export function parseString(sValue: string): string {
		return String(sValue);
	}

	export function parseJSON(sJSON: string): any {
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
		fnConv: (data: string, ...args: any[]) => T, iFrom?: number): number {
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
		var pRow: IConvertionTableRow<T> = conversionFormats[sType];
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
		"boolean": { type: Array, converter: stoba },
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
	export function abtota(pBuffer: ArrayBuffer, eType: EDataTypes): ArrayBufferView {
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

	export function toUTF8(argString: string): string {
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

	export function fromUTF8(str_data: string): string {
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
}