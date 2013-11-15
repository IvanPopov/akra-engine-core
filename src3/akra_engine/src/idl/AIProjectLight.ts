// AIProjectLight interface
// [write description here...]


/// <reference path="AILightPoint.ts" />
/// <reference path="AICamera.ts" />

interface IProjectParameters extends AILightParameters {
	 //default parameters
	ambient: AIColor;
	diffuse: AIColor;
	specular: AIColor;
	attenuation: AIVec3;	
}

interface AIProjectLight extends AILightPoint {
	params: IProjectParameters;
	
	getShadowCaster(): AIShadowCaster;
	getDepthTexture(): AITexture;
	getRenderTarget(): AIRenderTarget;

	//false if lighting not active 
	//or it's effect don't seen
	_prepareForLighting(pCamera: AICamera): boolean;
}