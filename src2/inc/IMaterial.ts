#ifndef IMATERIAL_TS
#define IMATERIAL_TS

module akra {
	export interface IMaterial {
		diffuse: any;
		ambient: any;
		specular: any;
		emissive: any;
		shininess: float;
	}
}

#endif
