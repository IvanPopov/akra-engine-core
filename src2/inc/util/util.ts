#ifndef UTIL_TS
#define UTIL_TS

#include "Pathinfo.ts"
#include "URI.ts"

// #include "ReferenceCounter.ts"
// #include "Singleton.ts"

// #include "BrowserInfo.ts"
// #include "ApiInfo.ts"
// #include "ScreenInfo.ts"
// #include "DeviceInfo.ts"

// #include "UtilTimer.ts"

// #include "Entity.ts"

// #include "ThreadManager.ts"

module akra.util {
	//string to array buffer
	export var stoab = function (s: string): ArrayBuffer {
		var len: uint = s.length;
		var pCodeList: Uint8Array = new Uint8Array(len);

	    for (var i: int = 0; i < len; ++i) {
	        pCodeList[ i ] = s.charCodeAt(i); /*& 0xFF;*/
	    }
	    
	    return pCodeList.buffer;
	}

	export var abtos = function (pBuf: ArrayBuffer): string {
		var pData: Uint8Array = new Uint8Array(pBuf);
	    var s: string = "";

	    for (var n: uint = 0; n < pData.length; ++ n) {
	        s += String.fromCharCode(pData[n]);
	    }

	    return s;
        // return String.fromCharCode.apply(null, Array.prototype.slice.call(new Uint8Array(pBuf), 0));
	}


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

	export function parseJSON(sJSON: string): Object {
		return eval('(' + sJSON + ')');
	}

	export function btoa(pBlob: Blob, fn: (e: ErrorEvent, pBuffer: ArrayBuffer) => void): void {
		var pReader: FileReader = new FileReader();
		
		pReader.onload = function(e) {
			fn(null, e.target.result);
		};

		pReader.onerror = function(e: ErrorEvent) {
			fn(e, null);
		};

		pReader.readAsArrayBuffer(pBlob);
		
	}

	/**
	 * Преобразование html-сформированного текста
	 * в dom.
	 */
	export function parseHTML(sHTML: string, useDocFragment: bool = true): any {
	    var pDivEl: HTMLDivElement = <HTMLDivElement>document.createElement('div');
	    var pDocFrag: DocumentFragment;

	    pDivEl.innerHTML = sHTML;

	    if (!useDocFragment) {
	        return pDivEl.childNodes;
	    }

	    pDocFrag = document.createDocumentFragment();

	    for (var i = 0, len: uint = pDivEl.childNodes.length; i < len; ++ i) {
	        if (!isDef(pDivEl.childNodes[i])) {
	            continue;
	        }

	        pDocFrag.appendChild(pDivEl.childNodes[i]);
	    }

	    return pDocFrag;
	};

	export function blobFromDataURL(sBlobURL: string, fn: (b: Blob) => void): void {
		var xhr = new XMLHttpRequest();
		xhr.open("GET", sBlobURL, true);
		xhr.responseType = "blob";
		
		xhr.onload = function(e) {
			if (this.status == 200) {
				fn(<Blob>this.response);
			}
		};

		xhr.send();
	}

	export function dataURItoBlob(dataURI) {
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
	    var bb = new Blob([ab], {type: mimeString});
	    return bb;
	}

}

#endif