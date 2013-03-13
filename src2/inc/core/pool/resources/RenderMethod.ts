#ifndef RENDERMETHOD_TS
#define RENDERMETHOD_TS

#include "IRenderMethod.ts"
#include "../ResourcePoolItem.ts"

module akra.core.pool.resources {
	export class RenderMethod extends ResourcePoolItem implements IRenderMethod {
		effect: IEffect;
		surfaceMaterial: ISurfaceMaterial;

		isEqual(pRenderMethod: IRenderMethod): bool {return false;}
	}

	
}

#endif
