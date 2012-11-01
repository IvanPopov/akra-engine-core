#ifndef IRENDERRESOURCE_TS
#define IRENDERRESOURCE_TS

#include "IResourcePoolItem.ts"

module akra {
    export interface IRenderResource extends IResourcePoolItem {
        getHardwareObject(): WebGLObject;
    };
}

#endif
