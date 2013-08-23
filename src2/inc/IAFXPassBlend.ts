#ifndef IAFXPASSBLEND_TS
#define IAFXPASSBLEND_TS

#include "IUnique.ts"
#include "IAFXInstruction.ts"
#include "IAFXMaker.ts"
#include "IAFXPassInputBlend.ts"
#include "ISurfaceMaterial.ts"
#include "IBufferMap.ts"

module akra {
	IFACE(IRenderStateMap)
	
	export interface IAFXPassBlendMap {
		[index: uint]: IAFXPassBlend;
		[index: string]: IAFXPassBlend;
	}

	export interface IAFXPassBlend extends IUnique {
		initFromPassList(pPassList: IAFXPassInstruction[]): bool;
		generateFXMaker(pPassInput: IAFXPassInputBlend,
						pSurfaceMaterial: ISurfaceMaterial,
						pBuffer: IBufferMap): IAFXMaker;
		
		_hasUniformWithName(sName: string): bool;
		_hasUniformWithNameIndex(iNameIndex: uint): bool;
		_getRenderStates(): IRenderStateMap;
	}
}

#endif
