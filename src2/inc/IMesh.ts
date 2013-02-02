#ifndef IMESH_TS
#define IMESH_TS

#include "IRenderData.ts"
#include "IEventProvider.ts"
//#include "IHardwareBuffer.ts"
module akra {
    IFACE(IRenderDataCollection);
    IFACE(ISkeleton);
    IFACE(IRect3d);
    IFACE(ISphere);
    IFACE(IMeshSubset);
    IFACE(ISceneNode);
    IFACE(ISceneModel);
    IFACE(ISkin);
    
	export enum EMeshOptions {
        HB_READABLE = <int>EHardwareBufferFlags.READABLE,
        RD_ADVANCED_INDEX = <int>ERenderDataOptions.ADVANCED_INDEX
    };

    export enum EMeshCloneOptions{
        GEOMETRY_ONLY = 0x00,   /*<! copy only geometry*/
        SHARED_GEOMETRY = 0x01  /*<! use shared geometry*/
    };

	export interface IMesh extends IEventProvider {
        readonly flexMaterials: IMaterial[];
        readonly name: string;
        readonly data: IRenderDataCollection;
        readonly length: uint; /*<! number of submeshes in. */
        readonly boundingBox: IRect3d;
        readonly boundingSphere: ISphere;

		skeleton: ISkeleton;

        
        getOptions(): int;
        getEngine(): IEngine;
        
        //setup(sName: string, eOptions: int, pDataBuffer?: IRenderDataCollection): bool;
        destroy(): void;    
        clone(iCloneOptions: int): IMesh;

        /** @deprecated */
        replaceFlexMaterials(pFlexMaterials): void;
        /** @deprecated */
        getFlexMaterial(iMaterial: uint): IMaterial;
        getFlexMaterial(sName: string): IMaterial;
        /** @deprecated */
        addFlexMaterial(sName: string, pMaterial?: IMaterial): bool;
        /** @deprecated */
        setFlexMaterial(iMaterial: int): bool;
        
        createSubset(sName: string, ePrimType: EPrimitiveTypes, eOptions: int);
        freeSubset(sName: string): bool;
        getSubset(sMesh: string): IMeshSubset;
        getSubset(i: uint): IMeshSubset;
        appendSubset(sName: string, pData: IRenderData): IMeshSubset;
        
        setSkin(pSkin: ISkin): void;
        setSkeleton(pSkeleton: ISkeleton): void;

        createBoundingBox(): bool;
        deleteBoundingBox(): bool;
        showBoundingBox(): bool;
        hideBoundingBox(): bool;
        createAndShowSubBoundingBox(): void;

        createBoundingSphere(): bool;
        deleteBoundingSphere(): bool;
        showBoundingSphere(): bool;
        hideBoundingSphere(): bool;
        createAndShowSubBoundingSphere(): void;

        /** TRUE if only one mesh subset has a shadow. */
        hasShadow(): bool;
        /** Add shadow for all subsets. */
        setShadow(bValue?: bool): void;

        isReadyForRender(): bool;

        toSceneModel(pParent: ISceneNode, sName?: string): ISceneModel;

        _drawSubset(iSubset: int): void;
        _draw(): void;

        /** notify, when one of substets added or removed shadow */
        signal shadow(pSubset: IMeshSubset, bShadow: bool): void;
	}
}

#endif
