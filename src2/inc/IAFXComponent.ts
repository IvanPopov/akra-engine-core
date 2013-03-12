#ifndef IAFXCOMPONENT_TS
#define IAFXCOMPONENT_TS

#include "IResourcePoolItem.ts"
#include "IAFXInstruction.ts"

module akra {
	export interface IAFXComponent extends IResourcePoolItem {
		create(): void;

		getTechnique(): IAFXTechniqueInstruction;
		setTechnique(pTechnique: IAFXTechniqueInstruction): void;

		getName(): string;
		getTotalPasses(): uint;
		getHash(iShift: int, iPass: uint): string;

	}
}

#endif