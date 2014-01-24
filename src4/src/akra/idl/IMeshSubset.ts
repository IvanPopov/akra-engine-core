
/// <reference path="IEventProvider.ts" />
/// <reference path="IMesh.ts" />
/// <reference path="ISkin.ts" />
/// <reference path="IRenderData.ts" />
/// <reference path="IRect3d.ts" />


module akra {
	export interface IMeshSubset extends IEventProvider, IRenderableObject {
		getName(): string;

		getMesh(): IMesh;
		getSkin(): ISkin;
		getBoundingBox(): IRect3d;
		getBoundingSphere(): ISphere;

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
		setSkin(pSkin: ISkin): boolean;

		/** @deprecated */
		applyFlexMaterial(csMaterial: string, pMaterial?: IMaterial): boolean;
		/** @deprecated */
		getFlexMaterial(iMaterial: int): IMaterial;
		/** @deprecated */
		getFlexMaterial(csName: string): IMaterial;
		/** @deprecated */
		setFlexMaterial(iMaterial: int): boolean;
		/** @deprecated */
		setFlexMaterial(csName: string): boolean;

		show(): void;
		hide(): void;
		isRenderable(): boolean;

		destroy(): void;

		_calculateSkin(): boolean;

		skinAdded: ISignal<{ (pSubset: IMeshSubset, pSkin: ISkin) }>;
	}
	
}
