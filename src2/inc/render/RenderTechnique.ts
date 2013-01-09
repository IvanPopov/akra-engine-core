#ifndef RENDERTECHNIQUE_TS
#define RENDERTECHNIQUE_TS

#include "IRenderTechnique.ts"

module akra.render {
	export class RenderTechnque implements IRenderTechnique {
		private _pMethod: IRenderMethod;

		get totalPasses(): uint {
			return 0;
		}

		constructor (pMethod: IRenderMethod = null) {
			this._pMethod = pMethod;
		}


		destroy(): void {

		}

		getPass(n: uint): IRenderPass {
			return null;
		}

		getMethod(): IRenderMethod {
			return null;
		}

		setMethod(pMethod: IRenderMethod): void {
			
		}

		isReady(): bool {
			return false;
		}
	}
}

#endif
