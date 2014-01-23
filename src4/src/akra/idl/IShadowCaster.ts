
/// <reference path="ILightPoint.ts" />
/// <reference path="IObjectArray.ts" />
/// <reference path="IMat4.ts" />
/// <reference path="IFrustum.ts" />

// #define SHADOW_DISCARD_DISTANCE 70.

module akra {
	export interface IShadowCaster extends ICamera {
		getLightPoint(): ILightPoint;
		getFace(): uint;
	    getAffectedObjects(): IObjectArray<ISceneObject>;
		getOptimizedProjection(): IMat4;

		/** casted shadows in the last frame*/
		getIsShadowCasted(): boolean;
		setIsShadowCasted(bValue: boolean): void;

		_optimizeProjectionMatrix(pEffectiveCameraFrustum: IFrustum): void;
	}
	
}
