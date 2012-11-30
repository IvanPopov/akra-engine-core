#ifndef IMESH_TS
#define IMESH_TS

#include "IRenderData.ts"
#include "IHardwareBuffer.ts"
module akra {

	export enum EMeshOptions {
        HB_READABLE = EHardwareBufferFlags.READABLE,
        RD_ADVANCED_INDEX = ERenderDataFlags.ADVANCED_INDEX
    };

    export enum EMeshCloneOptions{
        GEOMETRY_ONLY = 0x00,   /*<! copy only geometry*/
        SHARED_GEOMETRY = 0x01  /*<! use shared geometry*/
    };

	export interface IMesh {
		readonly
	}
}

#endif
