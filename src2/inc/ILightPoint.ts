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

	export enum ELightPointTypes {
		PROJECT = 86,
		OMNI_DIRECTIONAL
	}

	export interface ILightPoint extends ISceneObject {
		params: ILightParameters;

		isShadowCaster(): bool;
		setShadowCasting(bValue?: bool): void;

		isEnabled(): bool;

		setEnabled(bValue: bool): void;
		_calculateShadows(): void;
	}
}

#endif

