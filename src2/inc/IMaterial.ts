#ifndef IMATERIAL_TS
#define IMATERIAL_TS

module akra {
	export interface IMaterial {
		name: string;

		diffuse: IColorValue;
		ambient: IColorValue;
		specular: IColorValue;
		emissive: IColorValue;
		shininess: float;

		set(pMat: IMaterial): IMaterial;
		isEqual(pMat: IMaterial): bool;
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
