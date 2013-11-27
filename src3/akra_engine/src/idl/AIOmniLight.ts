// AIOmniLight interface
// [write description here...]


/// <reference path="AILightPoint.ts" />
/// <reference path="AIShadowCaster.ts" />
/// <reference path="AITexture.ts" />
/// <reference path="AIRenderTarget.ts" />
/// <reference path="AICamera.ts" />

interface IOmniParameters extends AILightParameters {
	 //default parameters
	ambient: AIColor;
	diffuse: AIColor;
	specular: AIColor;
	attenuation: AIVec3;	
}

interface AIOmniLight extends AILightPoint {
	params: IOmniParameters;

	getShadowCaster(): AIShadowCaster[];
	getDepthTextureCube(): AITexture[];
	getRenderTarget(iFace: uint): AIRenderTarget;

	//false if lighting not active 
	//or it's effect don't seen
	_prepareForLighting(pCamera: AICamera): boolean;
}