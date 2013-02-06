#ifndef IMATERIAL_TS
#define IMATERIAL_TS

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
		isEqual(pMat: IMaterialBase): bool;
	}

	// export interface IMaterialEx extends IMaterial {
	// 	reflective: 
	// 	reflectivity
	// 	transparent
	// 	transparency
	// 	indexofrefraction
	// }
}

#endif
