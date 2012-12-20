#ifndef ILIGHTPOINT_TS
#ifndef ILIGHTPOINT_TS

module akra {
	export interface ILightParameters {
		 //default parameters
	    ambient: IColor;
	    diffuse: IColor;
	    specular: IColor;
	    attenuation: IColor;
	}

	export interface ILightPoint extends ISceneNode {
		type: ELightPointTypes;
		params: ILightParameters;

		isShadowCaster(): bool;
		setShadowCasting(bValue?: bool): void;

		isEnabled(): bool;

		setEnabled(bValue: bool): void;
		_calculateShadows(): void;
	}
}

#endif

