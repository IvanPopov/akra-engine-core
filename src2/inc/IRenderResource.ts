#ifndef IRENDERRESOURCE_TS
#define IRENDERRESOURCE_TS

#include "IResourcePoolItem.ts"

module akra {
	IFACE(IHardwareObject);
	
    export interface IRenderResource extends IResourcePoolItem {
        //getHardwareObject(): IHardwareObject;
    };
}

#endif
