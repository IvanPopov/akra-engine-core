#ifndef ILIGHTPOINT_TS
#define ILIGHTPOINT_TS

module akra {

	IFACE(ISceneNode);
	IFACE(ICamera);
	IFACE(IFrustum);

	export interface ILightParameters {
		 //default parameters
	    ambient: IColor;
	    diffuse: IColor;
	    specular: IColor;
	    attenuation: IVec3;
	}

	export enum ELightTypes {
		UNKNOWN,
		PROJECT,
		OMNI
	}

	export interface ILightPoint extends ISceneNode {
		params: ILightParameters;
		enabled: bool;
		lightType: ELightTypes;

		isShadowCaster: bool;

		//optimized camera frustum for better shadow casting
		readonly optimizedCameraFrustum: IFrustum;

		create(isShadowCaster?: bool, iMaxShadowResolution?: uint): bool;

		//false if lighting not active 
		//or it's effect don't seen
		_prepareForLighting(pCamera: ICamera): bool;

		_calculateShadows(): void;
	}
}

#endif

