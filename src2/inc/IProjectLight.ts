#ifndef IPROJECTLIGHT_TS
#ifndef IPROJECTLIGHT_TS

#include "ILightPoint.ts"

module akra {
	export interface IProjectLight extends ILightPoint {
		optimizedProjection: IMat4;
		currentOptimizedProjection: IMat4;

		getShadowCaster(): IShadowCaster;
		getDepthTexture(): ITexture;
		getRenderTarget(): IRenderTarget;
	}
}

#endif

