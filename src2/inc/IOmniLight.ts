#ifndef IOMNILIGHT_TS
#ifndef IOMNILIGHT_TS

#include "ILightPoint.ts"

module akra {
	export interface IOmniLight extends ILightPoint {
		optimizedProjectionCube: IMat4[];
		currentOptimizedProjection: IMat4;

		getShadowCaster(): IShadowCasterCube;
	}
}

#endif

