
/// <reference path="IVertexData.ts" />
/// <reference path="IColorValue.ts" />

module akra {
	interface IMaterialBase {
		diffuse: IColorValue;
		ambient: IColorValue;
		specular: IColorValue;
		emissive: IColorValue;
		shininess: float;
	}
	
	interface IMaterial extends IMaterialBase {
		name: string;
	
		set(pMat: IMaterialBase): IMaterial;
		isEqual(pMat: IMaterialBase): boolean;
	}
	
	/** @deprecated */
	interface IFlexMaterial extends IMaterial {
		data: IVertexData;
	}
	
	
}
