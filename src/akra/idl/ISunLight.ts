/// <reference path="ILightPoint.ts" />
/// <reference path="ICamera.ts" />
/// <reference path="ISceneModel.ts" />
/// <reference path="IVec3.ts" />

module akra {
	export interface ISunParameters extends ILightParameters {
		eyePosition: IVec3;
		sunDir: IVec3;
		groundC0: IVec3;
		groundC1: IVec3;
		hg: IVec3;
	}
	
	export interface ISunLight extends ILightPoint {
		getParams(): ISunParameters;

		getSkyDome(): ISceneModel;
		setSkyDome(pSkyDome: ISceneModel): void;
	
		updateSunDirection(v3fSunDir: IVec3): void;
		
		getDepthTexture(): ITexture;
		getShadowCaster(): IShadowCaster;
	}
}
