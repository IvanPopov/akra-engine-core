#ifndef AFXCOMPONENTBLEND_TS
#define AFXCOMPONENTBLEND_TS

#include "IAFXComponentBlend.ts"
#include "IAFXComposer.ts"

module akra.fx {
	export class ComponentBlend implements IAFXComponentBlend {
		private _pComposer: IAFXComposer = null;

		private _sHash: string = "";

		constructor(pComposer: IAFXComposer){
			this._pComposer = pComposer;
		}

		inline getComponentCount(): uint {
			return 0;
		}

		inline getTotalValidPasses(): uint {
			return 0;
		}

		inline getHash(): string {
			return this._sHash;
		}

		addComponent(pComponent: IAFXComponent, iShift: int): void{

		}

		clone(): IAFXComponentBlend{
			return null;
		}

	}
}

#endif