#ifndef IAFXPASSBLEND_TS
#define IAFXPASSBLEND_TS

#include "IUnique.ts"
#include "IAFXInstruction.ts"
#include "IAFXShaderProgram.ts"
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
		generateShaderProgram(pPassInput: IAFXPassInputBlend,
							  pSurfaceMaterial: ISurfaceMaterial,
							  pBuffer: IBufferMap): IAFXShaderProgram;
	}
}

#endif
