#ifndef AFXPASSBLEND_TS
#define AFXPASSBLEND_TS

#include "IAFXPassBlend.fx"
#include "IAFXComposer.ts"
#include "util/unique.ts"

module akra.fx {
	export class PassBlend implements IAFXPassBlend {
		UNIQUE();

		private _pComposer: IAFXComposer = null;

		constructor(pComposer: IAFXComposer){
			this._pComposer = pComposer;
		}

		initFromPassList(pPassList: IAFXPassInstruction[]): bool {
			return false;
		}

	}
}

#endif