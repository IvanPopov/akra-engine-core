#ifndef ILIGHTPOINT_TS
#define ILIGHTPOINT_TS

module akra {

	IFACE(ISceneNode);
	IFACE(ICamera);

	export interface ILightParameters {
		 //default parameters
	    ambient: IColor;
	    diffuse: IColor;
	    specular: IColor;
	    attenuation: IVec3;
	}

	export interface ILightPoint extends ISceneNode {
		params: ILightParameters;
		enabled: bool;

		isShadowCaster: bool;

		//false if lighting not active 
		//or it's effect don't seen
		_prepareForLighting(pCamera: ICamera): bool;

		_calculateShadows(): void;
	}
}

#endif

