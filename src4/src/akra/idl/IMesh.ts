
/// <reference path="IRenderData.ts" />
/// <reference path="IEventProvider.ts" />
/// <reference path="IHardwareBuffer.ts" />
/// <reference path="IRenderDataCollection.ts" />
/// <reference path="ISkeleton.ts" />
/// <reference path="IRect3d.ts" />
/// <reference path="ISphere.ts" />
/// <reference path="IMeshSubset.ts" />
/// <reference path="ISceneNode.ts" />
/// <reference path="ISceneModel.ts" />
/// <reference path="ISkin.ts" />

module akra {
	export enum EMeshOptions {
		HB_READABLE = <int>EHardwareBufferFlags.READABLE,
		RD_ADVANCED_INDEX = <int>ERenderDataOptions.ADVANCED_INDEX
	};
	
	export enum EMeshCloneOptions {
		GEOMETRY_ONLY = 0x00,   /*<! copy only geometry*/
		SHARED_GEOMETRY = 0x01  /*<! use shared geometry*/
	};
	
	export interface IMeshMap {
		[name: string]: IMesh;
	}
	
	export interface IMesh extends IEventProvider {
		flexMaterials: IMaterial[];
		name: string;
		data: IRenderDataCollection;
		length: uint; /*<! number of submeshes in. */
		boundingBox: IRect3d;
		boundingSphere: ISphere;
	
		skeleton: ISkeleton;
		shadow: boolean;
	
		
		getOptions(): int;
		getEngine(): IEngine;
		
		//setup(sName: string, eOptions: int, pDataBuffer?: IRenderDataCollection): boolean;
		destroy(): void;	
		clone(iCloneOptions: int): IMesh;
	
		/** @deprecated */
		replaceFlexMaterials(pFlexMaterials): void;
		/** @deprecated */
		getFlexMaterial(iMaterial: uint): IMaterial;
		getFlexMaterial(csName: string): IMaterial;
		/** @deprecated */
		addFlexMaterial(sName: string, pMaterial?: IMaterial): boolean;
		/** @deprecated */
		setFlexMaterial(iMaterial: int): boolean;
		setFlexMaterial(csName: string): boolean;
		
		createSubset(sName: string, ePrimType: EPrimitiveTypes, eOptions?: int);
		freeSubset(sName: string): boolean;
		getSubset(sMesh: string): IMeshSubset;
		getSubset(i: uint): IMeshSubset;
		appendSubset(sName: string, pData: IRenderData): IMeshSubset;
		
		setSkin(pSkin: ISkin): void;
		setSkeleton(pSkeleton: ISkeleton): void;
		createSkin(): ISkin;
	
		createBoundingBox(): boolean;
		deleteBoundingBox(): boolean;
		showBoundingBox(): boolean;
		hideBoundingBox(): boolean;
		isBoundingBoxVisible(): boolean;
		createAndShowSubBoundingBox(): void;
	
		createBoundingSphere(): boolean;
		deleteBoundingSphere(): boolean;
		showBoundingSphere(): boolean;
		hideBoundingSphere(): boolean;
		isBoundingSphereVisible(): boolean;
		createAndShowSubBoundingSphere(): void;
	
		isReadyForRender(): boolean;
	
	
		toSceneModel(pParent: ISceneNode, sName?: string): ISceneModel;
	
		/** Updtae all submeshes(apply bone matricie for skinned submeshes) */
		update(): boolean; 
	
		_drawSubset(iSubset: int): void;
		_draw(): void;
	
		/** notify, when one of substets added or removed shadow */
		signal shadowed(pSubset: IMeshSubset, bShadow: boolean): void;
	}
	
}
