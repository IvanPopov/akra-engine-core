// AIMeshSubset interface
// [write description here...]

/// <reference path="AIEventProvider.ts" />
/// <reference path="AIMesh.ts" />
/// <reference path="AISkin.ts" />
/// <reference path="AIRenderData.ts" />
/// <reference path="AIRect3d.ts" />


interface AIMeshSubset extends AIEventProvider, AIRenderableObject {
	name: string;

	/** readonly */ mesh: AIMesh;
	/** readonly */ skin: AISkin;
	/** readonly */ data: AIRenderData;
	/** readonly */ boundingBox: AIRect3d;
	/** readonly */ boundingSphere: AISphere;

	createBoundingBox(): boolean;
	deleteBoundingBox(): boolean;
	showBoundingBox(): boolean;
	hideBoundingBox(): boolean;
	isBoundingBoxVisible(): boolean;

	createBoundingSphere(): boolean;
	deleteBoundingSphere(): boolean;
	showBoundingSphere(): boolean;
	hideBoundingSphere(): boolean;
	isBoundingSphereVisible(): boolean;

	computeNormals(): void;
	computeTangents(): void;
	computeBinormals(): void;

	isSkinned(): boolean;
	isOptimizedSkinned(): boolean;
	getSkin(): AISkin;
	setSkin(pSkin: AISkin): boolean;

	/** @deprecated */
	applyFlexMaterial(csMaterial: string, pMaterial?: AIMaterial): boolean;
	/** @deprecated */
	getFlexMaterial(iMaterial: int): AIMaterial;
	/** @deprecated */
	getFlexMaterial(csName: string): AIMaterial;
	/** @deprecated */
	setFlexMaterial(iMaterial: int): boolean;
	/** @deprecated */
	setFlexMaterial(csName: string): boolean;

	show(): void;
	hide(): void;
	isRenderable(): boolean;

	destroy(): void;

	_calculateSkin(): boolean;

	signal skinAdded(pSkin: AISkin): void;
}
