

/// <reference path="ISceneNode.ts" />
/// <reference path="ICamera.ts" />
/// <reference path="IFrustum.ts" />

module akra {
	interface ILightParameters {
		 //default parameters
		// ambient: IColor;
		// diffuse: IColor;
		// specular: IColor;
		// attenuation: IVec3;
	}
	
	enum ELightTypes {
		UNKNOWN,
		PROJECT,
		OMNI,
		SUN
	}
	
	interface ILightPoint extends ISceneNode {
		params: ILightParameters;
		enabled: boolean;
		lightType: ELightTypes;
	
		isShadowCaster: boolean;
		lightingDistance: float;
	
		//optimized camera frustum for better shadow casting
		/** readonly */ optimizedCameraFrustum: IFrustum;
	
		create(isShadowCaster?: boolean, iMaxShadowResolution?: uint): boolean;
	
		//false if lighting not active 
		//or it's effect don't seen
		_prepareForLighting(pCamera: ICamera): boolean;
	
		_calculateShadows(): void;
	}
}
