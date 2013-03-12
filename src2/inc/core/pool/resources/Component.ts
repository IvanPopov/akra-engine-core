#ifndef AFXCOMPONENT_TS
#define AFXCOMPONENT_TS

#include "IAFXComponent.ts"
#include "../ResourcePoolItem.ts"

module akra.core.pool.resources {
	export class Component extends ResourcePoolItem implements IAFXComponent{
		private _pTechnique: IAFXTechniqueInstruction = null;
		private _pComposer: IAFXComposer = null;

		constructor(){
			super();
		}

		create(): void {
			this._pComposer = this.manager.getEngine().getComposer();
		}

		inline getTechnique(): IAFXTechniqueInstruction {
			return this._pTechnique;
		}

		inline setTechnique(pTechnique: IAFXTechniqueInstruction): void {
			this._pTechnique = pTechnique;
		}

		inline getName(): string {
			return this._pTechnique.getName();
		}

		inline getHash(iShift: int): string {
			return this.getName() + ">>" + iShift.toString();
		}
	}
}

#endif