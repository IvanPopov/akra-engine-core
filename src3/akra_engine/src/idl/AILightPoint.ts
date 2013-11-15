// AILightPoint interface
// [write description here...]


/// <reference path="AISceneNode.ts" />
/// <reference path="AICamera.ts" />
/// <reference path="AIFrustum.ts" />

interface AILightParameters {
	 //default parameters
	// ambient: AIColor;
	// diffuse: AIColor;
	// specular: AIColor;
	// attenuation: AIVec3;
}

enum AELightTypes {
	UNKNOWN,
	PROJECT,
	OMNI,
	SUN
}

interface AILightPoint extends AISceneNode {
	params: AILightParameters;
	enabled: boolean;
	lightType: AELightTypes;

	isShadowCaster: boolean;
	lightingDistance: float;

	//optimized camera frustum for better shadow casting
	/** readonly */ optimizedCameraFrustum: AIFrustum;

	create(isShadowCaster?: boolean, iMaxShadowResolution?: uint): boolean;

	//false if lighting not active 
	//or it's effect don't seen
	_prepareForLighting(pCamera: AICamera): boolean;

	_calculateShadows(): void;
}