#ifndef ISUNLIGHT_TS
#define ISUNLIGHT_TS

module akra {

	IFACE(ILightPoint);
	IFACE(ICamera);

	export interface ISunParameters extends ILightParameters {
		eyePosition: IVec3;
		sunDir: IVec3;
		groundC0: IVec3;
		groundC1: IVec3;
		hg: IVec3;
	}

	export interface ISunLight extends ILightPoint {
		params: ISunParameters;
		
	}
}


#endif