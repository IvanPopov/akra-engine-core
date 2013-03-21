#ifndef IAFXPASSBLEND_TS
#define IAFXPASSBLEND_TS

#include "IUnique.ts"
#include "IAFXInstruction.ts"
#include "IAFXMaker.ts"
#include "IAFXPassInputBlend.ts"
#include "ISurfaceMaterial.ts"
#include "IBufferMap.ts"

module akra {

	export interface IAFXPassBlendMap {
		[index: uint]: IAFXPassBlend;
		[index: string]: IAFXPassBlend;
	}

	export interface IAFXPassBlend extends IUnique {
		initFromPassList(pPassList: IAFXPassInstruction[]): bool;
		generateFXMaker(pPassInput: IAFXPassInputBlend,
						pSurfaceMaterial: ISurfaceMaterial,
						pBuffer: IBufferMap): IAFXMaker;
	}
}

#endif
