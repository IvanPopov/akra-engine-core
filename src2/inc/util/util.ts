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

	export var uri = (sUri:string): IURI => new util.URI(sUri);

	// export var pathinfo: (sPath: string) => IPathinfo;
	// export var pathinfo: (pPath: IPathinfo) => IPathinfo;
	export var pathinfo: (pPath?) => IPathinfo;

	pathinfo = function (pPath?): IPathinfo {
		return new Pathinfo(pPath);
	}

	//string to array buffer
	export var stoab = function (s: string): ArrayBuffer {
		var pCodeList: int[] = new Array(len);

	    for (var i: int = 0, len = s.length; i < len; ++i) {
	        pCodeList[ i ] = s.charCodeAt(i); /*& 0xFF;*/
	    }
	    
	    return (new Uint8Array(pCodeList)).buffer;
	}

	export var abtos = function (pBuf: ArrayBuffer): string {
		var pData: Uint8Array = new Uint8Array(pBuf);
	    var s: string = "";

	    for (var n: uint = 0; n < pData.length; ++ n) {
	        s += String.fromCharCode(pData[n]);
	    }

	    return s;
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
	};

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

}

#endif