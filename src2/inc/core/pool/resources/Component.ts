#ifndef AFXCOMPONENT_TS
#define AFXCOMPONENT_TS

#include "IAFXComponent.ts"
#include "../ResourcePoolItem.ts"

module akra.core.pool.resources {
	export class Component extends ResourcePoolItem implements IAFXComponent{
		private _pTechnique: IAFXTechniqueInstruction = null;

		constructor(){
			super();
		}

		inline getTechnique(): IAFXTechniqueInstruction {
			return this._pTechnique;
		}

		inline setTechnique(pTechnique: IAFXTechniqueInstruction): void {
			this._pTechnique = pTechnique;
		}
	}
}

#endif