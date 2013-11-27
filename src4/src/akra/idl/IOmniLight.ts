

/// <reference path="ILightPoint.ts" />
/// <reference path="IShadowCaster.ts" />
/// <reference path="ITexture.ts" />
/// <reference path="IRenderTarget.ts" />
/// <reference path="ICamera.ts" />

module akra {
	export interface IOmniParameters extends ILightParameters {
		 //default parameters
		ambient: IColor;
		diffuse: IColor;
		specular: IColor;
		attenuation: IVec3;	
	}
	
	export interface IOmniLight extends ILightPoint {
		params: IOmniParameters;
	
		getShadowCaster(): IShadowCaster[];
		getDepthTextureCube(): ITexture[];
		getRenderTarget(iFace: uint): IRenderTarget;
	
		//false if lighting not active 
		//or it's effect don't seen
		_prepareForLighting(pCamera: ICamera): boolean;
	}
}
