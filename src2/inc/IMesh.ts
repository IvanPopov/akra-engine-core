#ifndef IMESH_TS
#define IMESH_TS

#include "IRenderData.ts"
//#include "IHardwareBuffer.ts"
module akra {
    IFACE(IReferenceCounter);
    IFACE(ISkeleton);
    IFACE(IRect3d);
    IFACE(ISphere);
    IFACE(IMeshSubset);
    IFACE(ISkin);
    
	export enum EMeshOptions {
        HB_READABLE = <int>EHardwareBufferFlags.READABLE,
        RD_ADVANCED_INDEX = <int>ERenderDataOptions.ADVANCED_INDEX
    };

    export enum EMeshCloneOptions{
        GEOMETRY_ONLY = 0x00,   /*<! copy only geometry*/
        SHARED_GEOMETRY = 0x01  /*<! use shared geometry*/
    };

	export interface IMesh {
        readonly flexMaterials;
        readonly name: string;
        readonly data: IReferenceCounter;
        readonly buffer: IReferenceCounter;
		skeleton: ISkeleton;

        setSkeleton(pSkeleton: ISkeleton): void;
        getOptions(): int;
        getEngine(): IEngine;
        drawSubset(iSubset: int): void;
        draw(): void;
        isReadyForRender(): bool;
        setup(sName: string, eOptions: int, pDataBuffer: IReferenceCounter): bool;
        createSubset(sName: string, ePrimType: EPrimitiveTypes, eOptions: int);
        freeSubset(sName: string): bool;

        /** @deprecated */
        replaceFlexMaterials(pFlexMaterials): void;
        /** @deprecated */
        getFlexMaterial();
        /** @deprecated */
        addFlexMaterial(sName: string, pMaterial: IMaterial): bool;
        /** @deprecated */
        setFlexMaterial(iMaterial: int): bool;
        
        destroy(): void;
        destructor(): void;
        getSubset(): IMeshSubset;
        setSkin(pSkin: ISkin): void;
        clone(eCloneOptions: EMeshCloneOptions);
        createAndShowSubBoundingBox(): void;
        createAndShowSubBoundingSphere(): void;
        createBoundingBox(): bool;
        deleteBoundingBox(): bool;
        getBoundingBox(): IRect3d;
        showBoundingBox(): bool;
        hideBoundingBox(): bool;
        createBoundingSphere(): bool;
        deleteBoundingSphere(): bool;
        getBoundingSphere(): ISphere;
        showBoundingSphere(): bool;
        hideBoundingSphere(): bool;
	}
}

#endif
