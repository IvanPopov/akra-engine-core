#ifndef ILIGHTPOINT_TS
#define ILIGHTPOINT_TS

module akra {
	export interface ILightParameters {
		 //default parameters
	    ambient: IColor;
	    diffuse: IColor;
	    specular: IColor;
	    attenuation: IVec3;
	}

	export enum ELightPointTypes {
		PROJECT = 100,
		OMNI_DIRECTIONAL
	}

	export interface ILightPoint extends ISceneNode {
		params: ILightParameters;

		isShadowCaster(): bool;
		setShadowCasting(bValue?: bool): void;

		isEnabled(): bool;

		setEnabled(bValue: bool): void;
		_calculateShadows(): void;
	}
}

#endif

