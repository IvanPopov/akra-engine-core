#ifndef IOMNILIGHT_TS
#define IOMNILIGHT_TS

#include "ILightPoint.ts"

module akra {
	export interface IOmniLight extends ILightPoint {
		optimizedProjectionCube: IMat4[];
		currentOptimizedProjection: IMat4;

		getShadowCaster(): IShadowCasterCube;
		getDepthTexture(iFace: uint): ITexture;
		getRenderTarget(iFace: uint): IRenderTarget;

		getDepthTextureCube(): ITexture[];
	}
}

#endif

