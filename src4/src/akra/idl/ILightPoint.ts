

/// <reference path="ISceneNode.ts" />
/// <reference path="ICamera.ts" />
/// <reference path="IFrustum.ts" />

module akra {
	export interface ILightParameters {
		 //default parameters
		// ambient: IColor;
		// diffuse: IColor;
		// specular: IColor;
		// attenuation: IVec3;
	}
	
	export enum ELightTypes {
		UNKNOWN,
		PROJECT,
		OMNI,
		SUN
	}
	
	export interface ILightPoint extends ISceneNode {
		getParams(): ILightParameters;
		getLightType(): ELightTypes;

		/** optimized camera frustum for better shadow casting */
		getPptimizedCameraFrustum(): IFrustum;
		
		getEnabled(): boolean;
		setEnabled(bValue: boolean): void;

		getIsShadowCaster(): boolean;
		setIsShadowCaster(bValue: boolean): void;

		getLightingDistance(): float;
		setLightingDistance(fValue: float): void;		
	
		create(isShadowCaster?: boolean, iMaxShadowResolution?: uint): boolean;
	
		/** false if lighting not active or it's effect don't seen */
		_prepareForLighting(pCamera: ICamera): boolean;
	
		_calculateShadows(): void;
	}
}
