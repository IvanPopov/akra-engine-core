

/// <reference path="ILightPoint.ts" />
/// <reference path="ICamera.ts" />

module akra {
	export interface IProjectParameters extends ILightParameters {
		 //default parameters
		ambient: IColor;
		diffuse: IColor;
		specular: IColor;
		attenuation: IVec3;	
	}
	
	export interface IProjectLight extends ILightPoint {
		getParams(): IProjectParameters;
		
		getShadowCaster(): IShadowCaster;
		getDepthTexture(): ITexture;
		getRenderTarget(): IRenderTarget;
	
		//false if lighting not active 
		//or it's effect don't seen
		_prepareForLighting(pCamera: ICamera): boolean;
	}
}
