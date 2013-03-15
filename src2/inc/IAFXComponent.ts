#ifndef IAFXCOMPONENT_TS
#define IAFXCOMPONENT_TS

#include "IResourcePoolItem.ts"
#include "IAFXInstruction.ts"

module akra {
	export interface IAFXComponentMap {
		[index: uint]: IAFXComponent;
		[index: string]: IAFXComponent;
	}
	
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