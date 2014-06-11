
/// <reference path="IEventProvider.ts" />
/// <reference path="IMesh.ts" />
/// <reference path="ISkin.ts" />
/// <reference path="IRenderData.ts" />
/// <reference path="IRect3d.ts" />


module akra {
	export interface IMeshSubset extends IEventProvider, IRenderableObject {
		skinAdded: ISignal<{ (pSubset: IMeshSubset, pSkin: ISkin): void; }>;
		skinRemoved: ISignal<{ (pSubset: IMeshSubset, pSkin: ISkin): void; }>;

		/**
	     * Emit when mesh geometry transformated by skin.
		 */
		transformed: ISignal<{ (pSubset: IMeshSubset, pSkin: ISkin): void; }>;

		/**
		 * @return False - if persisted geometry.
	     */
		update(): boolean;

		getName(): string;
		getMesh(): IMesh;
		getSkin(): ISkin;

		getBoundingBox(): IRect3d;
		getBoundingSphere(): ISphere;

		/**
		 * @copydoc Skin::getTotalBones()
		 * Alias for Skin::getTotalBones()
		 */
		getTotalBones(): uint;
		getBoneLocalBound(sBone: string): IRect3d;
		getBoneLocalBound(iBone: uint): IRect3d;

		getInitialGeometryBoundingBox(): IRect3d;
		getInitialGeometryBoundingSphere(): ISphere;

		computeNormals(): void;
		computeTangents(): void;
		computeBinormals(): void;

		isSkinned(): boolean;
		isOptimizedSkinned(): boolean;
		setSkin(pSkin: ISkin): boolean;

		destroy(): void;
	}
	
}
