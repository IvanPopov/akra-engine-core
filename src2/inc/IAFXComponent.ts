#ifndef IAFXCOMPONENT_TS
#define IAFXCOMPONENT_TS

#include "IResourcePoolItem.ts"
#include "IAFXInstruction.ts"

module akra {
	export interface IAFXComponent extends IResourcePoolItem {
		getTechnique(): IAFXTechniqueInstruction;
		setTechnique(pTechnique: IAFXTechniqueInstruction): void;
	}
}

#endif