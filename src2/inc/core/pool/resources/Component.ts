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

		inline isPostEffect(): bool {
			return isNull(this._pTechnique) ? false : this._pTechnique.isPostEffect(); 
		}

		inline getName(): string {
			return this._pTechnique.getName();
		}

		inline getTotalPasses(): uint {
			return this._pTechnique.totalOwnPasses();
		}

		inline getHash(iShift: int, iPass: uint): string {
			return this.getGuid() + ">" + iShift.toString() + 
				   ">" + (iPass === ALL_PASSES ? "A" : iPass.toString());
		}
	}
}

#endif