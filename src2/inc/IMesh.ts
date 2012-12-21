#ifndef IMESH_TS
#define IMESH_TS

#include "IRenderData.ts"
//#include "IHardwareBuffer.ts"
module akra {
    IFACE(IReferenceCounter);
    IFACE(ISkeleton);
    IFACE(ISphere);
	export enum EMeshOptions {
        HB_READABLE = EHardwareBufferFlags.READABLE,
        RD_ADVANCED_INDEX = ERenderDataFlags.ADVANCED_INDEX
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
        replaceFlexMaterials(pFlexMaterials): void;
        freeSubset(sName: string): bool;
        getFlexMaterial();
        addFlexMaterial(sName: string, pMaterialData): bool;
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
        getBoundingBox(): IRec3d;
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
