// AISunLight interface
// [write description here...]


/// <reference path="AILightPoint.ts" />
/// <reference path="AICamera.ts" />
/// <reference path="AISceneModel.ts" />
/// <reference path="AIVec3.ts" />

interface ISunParameters extends AILightParameters {
	eyePosition: AIVec3;
	sunDir: AIVec3;
	groundC0: AIVec3;
	groundC1: AIVec3;
	hg: AIVec3;
}

interface AISunLight extends AILightPoint {
	params: ISunParameters;
	skyDome: AISceneModel;

	updateSunDirection(v3fSunDir: AIVec3): void;
	
	getDepthTexture(): AITexture;
	getShadowCaster(): AIShadowCaster;
}