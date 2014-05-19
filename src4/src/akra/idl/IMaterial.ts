/// <reference path="IVertexData.ts" />
/// <reference path="IColorValue.ts" />

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
	
	export interface IMaterial extends IMaterialBase {
		/** Name of material */
		name: string;

		diffuse: IColor;
		ambient: IColor;
		specular: IColor;
		emissive: IColor;

		set(pMat: IMaterialBase): IMaterial;

		isEqual(pMat: IMaterialBase): boolean;
		isTransparent(): boolean;
	}

}
