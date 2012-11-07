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

	export var pathinfo: (sPath: string) => IPathinfo;
	export var pathinfo: (pPath: IPathinfo) => IPathinfo;

	pathinfo = (pPath?): IPathinfo => new Pathinfo(pPath);

	
}

#endif