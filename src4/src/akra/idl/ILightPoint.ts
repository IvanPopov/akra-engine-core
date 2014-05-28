

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
		getOptimizedCameraFrustum(): IFrustum;
		
		isEnabled(): boolean;
		setEnabled(bValue: boolean): void;

		isShadowCaster(): boolean;
		setShadowCaster(bValue: boolean): void;

		getLightingDistance(): float;
		setLightingDistance(fValue: float): void;		
	
		isRestricted(): boolean;
		setRestrictedLocalBounds(pBox: IRect3d): void;
		getRestrictedLocalBounds(): IRect3d;

		restrictLight(bEnable: boolean, pBox?: IRect3d): void;

		create(isShadowCaster?: boolean, iMaxShadowResolution?: uint): boolean;
	
		/** false if lighting not active or it's effect don't seen */
		_prepareForLighting(pCamera: ICamera): boolean;
	
		_calculateShadows(): void;
	}
}
