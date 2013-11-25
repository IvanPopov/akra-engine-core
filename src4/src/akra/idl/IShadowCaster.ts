
/// <reference path="ILightPoint.ts" />
/// <reference path="IObjectArray.ts" />
/// <reference path="IMat4.ts" />
/// <reference path="IFrustum.ts" />

// #define SHADOW_DISCARD_DISTANCE 70.

module akra {
	interface IShadowCaster extends ICamera {
		/** readonly */ lightPoint: ILightPoint;
		/** readonly */ face: uint;
	    /** readonly */ affectedObjects: IObjectArray<ISceneObject>;
		/** readonly */ optimizedProjection: IMat4;
		//casted shadows in the last frame
		isShadowCasted: boolean;
	
		_optimizeProjectionMatrix(pEffectiveCameraFrustum: IFrustum): void;
	}
	
}
