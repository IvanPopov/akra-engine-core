#ifndef UTIL_TS
#define UTIL_TS

#include "Pathinfo.ts"
#include "URI.ts"

#include "ReferenceCounter.ts"
#include "Singleton.ts"

#include "BrowserInfo.ts"
#include "ApiInfo.ts"
#include "ScreenInfo.ts"
#include "DeviceInfo.ts"

#include "UtilTimer.ts"

#include "Entity.ts"

#include "ThreadManager.ts"

module akra.util {

	export var uri = (sUri:string): IURI => new util.URI(sUri);

	// export var pathinfo: (sPath: string) => IPathinfo;
	// export var pathinfo: (pPath: IPathinfo) => IPathinfo;
	export var pathinfo: (pPath?) => IPathinfo;

	pathinfo = function (pPath?): IPathinfo {
		return new Pathinfo(pPath);
	}

	//string to array buffer
	export stoab = function (s: string): ArrayBuffer {
		var pCodeList: int = new Array(len);
	    for (var i: int = 0, len = s.length; i < len; ++i) {
	        pCodeList[ i ] = s.charCodeAt(i);// & 0xFF;
	    }
	    return (new Uint8Array(pCodeList)).buffer;
	}
}

#endif