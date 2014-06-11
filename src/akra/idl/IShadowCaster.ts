
/// <reference path="ILightPoint.ts" />
/// <reference path="IObjectArray.ts" />
/// <reference path="IMat4.ts" />
/// <reference path="IFrustum.ts" />

module akra {
	export interface IShadowCaster extends ICamera {
		getLightPoint(): ILightPoint;
		getFace(): uint;
	    getAffectedObjects(): IObjectArray<ISceneObject>;
		getOptimizedProjection(): IMat4;

		/** casted shadows in the last frame*/
		isShadowCasted(): boolean;
		setShadowCasted(bValue: boolean): void;

		_optimizeProjectionMatrix(pEffectiveCameraFrustum: IFrustum): void;
	}
	
}
