#ifndef AFXPASSBLEND_TS
#define AFXPASSBLEND_TS

#include "IAXFPassBlend.fx"
#include "IAFXComposer.ts"

module akra.fx {
	export class PassBlend implements IAXFPassBlend {
		private _pComposer: IAFXComposer = null;

		constructor(pComposer: IAFXComposer){
			this._pComposer = pComposer;
		}

		blend(csComponent: string, iPass: uint): bool{
			return false;
		}
	}
}

#endif