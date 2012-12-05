#ifndef IRENDERMETHOD_TS
#define IRENDERMETHOD_TS

#include "IResourcePoolItem.ts"

module akra {
	
	IFACE(IEffect);
	IFACE(ISurfaceMaterial);

	export interface IRenderMethod extends IResourcePoolItem {
		effect: IEffect;
		surfaceMaterial: ISurfaceMaterial;

		isEqual(pRenderMethod: IRenderMethod): bool;

	}
}

#endif