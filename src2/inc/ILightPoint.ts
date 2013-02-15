#ifndef ILIGHTPOINT_TS
#define ILIGHTPOINT_TS

#include "ISceneObject.ts"

module akra {
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

		isShadowCaster(): bool;
		setShadowCasting(bValue?: bool): void;

		_calculateShadows(): void;
	}
}

#endif

