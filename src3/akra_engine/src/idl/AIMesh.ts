// AIMesh interface
// [write description here...]

/// <reference path="AIRenderData.ts" />
/// <reference path="AIEventProvider.ts" />
/// <reference path="AIHardwareBuffer.ts" />
/// <reference path="AIRenderDataCollection.ts" />
/// <reference path="AISkeleton.ts" />
/// <reference path="AIRect3d.ts" />
/// <reference path="AISphere.ts" />
/// <reference path="AIMeshSubset.ts" />
/// <reference path="AISceneNode.ts" />
/// <reference path="AISceneModel.ts" />
/// <reference path="AISkin.ts" />

enum AEMeshOptions {
	HB_READABLE = <int>AEHardwareBufferFlags.READABLE,
	RD_ADVANCED_INDEX = <int>AERenderDataOptions.ADVANCED_INDEX
};

enum AEMeshCloneOptions {
	GEOMETRY_ONLY = 0x00,   /*<! copy only geometry*/
	SHARED_GEOMETRY = 0x01  /*<! use shared geometry*/
};

interface AIMeshMap {
	[name: string]: AIMesh;
}

interface AIMesh extends AIEventProvider {
	/** readonly */ flexMaterials: AIMaterial[];
	/** readonly */ name: string;
	/** readonly */ data: AIRenderDataCollection;
	/** readonly */ length: uint; /*<! number of submeshes in. */
	/** readonly */ boundingBox: AIRect3d;
	/** readonly */ boundingSphere: AISphere;

	skeleton: AISkeleton;
	shadow: boolean;

	
	getOptions(): int;
	getEngine(): AIEngine;
	
	//setup(sName: string, eOptions: int, pDataBuffer?: AIRenderDataCollection): boolean;
	destroy(): void;	
	clone(iCloneOptions: int): AIMesh;

	/** @deprecated */
	replaceFlexMaterials(pFlexMaterials): void;
	/** @deprecated */
	getFlexMaterial(iMaterial: uint): AIMaterial;
	getFlexMaterial(csName: string): AIMaterial;
	/** @deprecated */
	addFlexMaterial(sName: string, pMaterial?: AIMaterial): boolean;
	/** @deprecated */
	setFlexMaterial(iMaterial: int): boolean;
	setFlexMaterial(csName: string): boolean;
	
	createSubset(sName: string, ePrimType: AEPrimitiveTypes, eOptions?: int);
	freeSubset(sName: string): boolean;
	getSubset(sMesh: string): AIMeshSubset;
	getSubset(i: uint): AIMeshSubset;
	appendSubset(sName: string, pData: AIRenderData): AIMeshSubset;
	
	setSkin(pSkin: AISkin): void;
	setSkeleton(pSkeleton: AISkeleton): void;
	createSkin(): AISkin;

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


	toSceneModel(pParent: AISceneNode, sName?: string): AISceneModel;

	/** Updtae all submeshes(apply bone matricie for skinned submeshes) */
	update(): boolean; 

	_drawSubset(iSubset: int): void;
	_draw(): void;

	/** notify, when one of substets added or removed shadow */
	signal shadowed(pSubset: AIMeshSubset, bShadow: boolean): void;
}
