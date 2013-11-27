
/// <reference path="IVertexData.ts" />
/// <reference path="IColorValue.ts" />

module akra {
	export interface IMaterialBase {
		diffuse: IColorValue;
		ambient: IColorValue;
		specular: IColorValue;
		emissive: IColorValue;
		shininess: float;
	}
	
	export interface IMaterial extends IMaterialBase {
		name: string;
	
		set(pMat: IMaterialBase): IMaterial;
		isEqual(pMat: IMaterialBase): boolean;
	}
	
	/** @deprecated */
	export interface IFlexMaterial extends IMaterial {
		data: IVertexData;
	}
	
	
}
