// AIShadowCaster interface
// [write description here...]

/// <reference path="AILightPoint.ts" />
/// <reference path="AIObjectArray.ts" />
/// <reference path="AIMat4.ts" />
/// <reference path="AIFrustum.ts" />

// #define SHADOW_DISCARD_DISTANCE 70.

interface AIShadowCaster extends AICamera {
	/** readonly */ lightPoint: AILightPoint;
	/** readonly */ face: uint;
    /** readonly */ affectedObjects: AIObjectArray<AISceneObject>;
	/** readonly */ optimizedProjection: AIMat4;
	//casted shadows in the last frame
	isShadowCasted: boolean;

	_optimizeProjectionMatrix(pEffectiveCameraFrustum: AIFrustum): void;
}
