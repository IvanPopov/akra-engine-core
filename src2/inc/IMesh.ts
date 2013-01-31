#ifndef IMESH_TS
#define IMESH_TS

#include "IRenderData.ts"
//#include "IHardwareBuffer.ts"
module akra {
    IFACE(IRenderDataCollection);
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
        readonly flexMaterials: IMaterial[];
        readonly name: string;
        readonly data: IRenderDataCollection;
        readonly boundingBox: IRect3d;
        readonly boundingSphere: ISphere;
        readonly length: uint; /*<! number of submeshes in. */

		skeleton: ISkeleton;

        setSkeleton(pSkeleton: ISkeleton): void;
        getOptions(): int;
        getEngine(): IEngine;
        // drawSubset(iSubset: int): void;
        // draw(): void;
        isReadyForRender(): bool;
        setup(sName: string, eOptions: int, pDataBuffer?: IRenderDataCollection): bool;
        createSubset(sName: string, ePrimType: EPrimitiveTypes, eOptions: int);
        freeSubset(sName: string): bool;

        /** @deprecated */
        replaceFlexMaterials(pFlexMaterials): void;
        /** @deprecated */
        getFlexMaterial(iMaterial: uint): IMaterial;
        getFlexMaterial(sName: string): IMaterial;
        /** @deprecated */
        addFlexMaterial(sName: string, pMaterial?: IMaterial): bool;
        /** @deprecated */
        setFlexMaterial(iMaterial: int): bool;
        
        destroy(): void;
        destructor(): void;
        getSubset(sMesh: string): IMeshSubset;
        getSubset(i: uint): IMeshSubset;
        setSkin(pSkin: ISkin): void;
        clone(eCloneOptions: EMeshCloneOptions);
        createAndShowSubBoundingBox(): void;
        createAndShowSubBoundingSphere(): void;
        createBoundingBox(): bool;
        deleteBoundingBox(): bool;

        showBoundingBox(): bool;
        hideBoundingBox(): bool;
        createBoundingSphere(): bool;
        deleteBoundingSphere(): bool;
        showBoundingSphere(): bool;
        hideBoundingSphere(): bool;

        appendSubset(sName: string, pData: IRenderData): IMeshSubset;
	}
}

#endif
