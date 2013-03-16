#ifndef IAFXPASSBLEND_TS
#define IAFXPASSBLEND_TS

#include "IUnique.ts"
#include "IAFXInstruction.ts"

module akra {

	export interface IAFXPassBlendMap {
		[index: uint]: IAFXPassBlend;
		[index: string]: IAFXPassBlend;
	}

	export interface IAFXPassBlend extends IUnique {
		initFromPassList(pPassList: IAFXPassInstruction[]): bool;
	}
}

#endif
