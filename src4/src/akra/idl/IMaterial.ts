/// <reference path="IVertexData.ts" />
/// <reference path="IColorValue.ts" />
/// <reference path="IUnique.ts" />

module akra {
	export interface IMaterialBase {
		diffuse: IColorValue;
		ambient: IColorValue;
		specular: IColorValue;
		emissive: IColorValue;

		shininess: float;
		/** 
		 * Determines whether the object is transparent. 
		 * @note 1. - opaque, 0. - fully transparent.
		 */
		transparency: float;
	}
	
	export interface IMaterial extends IMaterialBase, IUnique {
		guid: uint;
		/** Name of material */
		name: string;

		diffuse: IColor;
		ambient: IColor;
		specular: IColor;
		emissive: IColor;

		set(sMat: "gold"): IMaterial;
		set(sMat: "cooper"): IMaterial;
		set(sMat: "plastic"): IMaterial;
		set(sMat: "iron"): IMaterial;
		set(sMat: "aluminium"): IMaterial;
		set(sMat: "silver"): IMaterial;
		set(sMat: "water"): IMaterial;
		set(sMat: "glass"): IMaterial;
		set(sMat: string): IMaterial;
		set(pMat: IMaterialBase): IMaterial;

		isEqual(pMat: IMaterialBase): boolean;
		isTransparent(): boolean;
	}
}
