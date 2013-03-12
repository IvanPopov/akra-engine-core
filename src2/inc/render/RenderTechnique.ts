#ifndef RENDERTECHNIQUE_TS
#define RENDERTECHNIQUE_TS

#include "IRenderTechnique.ts"
#include "events/events.ts"

module akra.render {
	export class RenderTechnique implements IRenderTechnique {
		private _pMethod: IRenderMethod;

		get modified(): uint {
			return 0;
		}

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

		setState(sName: string, pValue: any): void {

		}

		setForeign(sName: string, pValue: any): void {

		}

		setStruct(sName: string, pValue: any): void {

		}

		setTextureBySemantics(sName: string, pValue: any): void {

		}

		setShadowSamplerArray(sName: string, pValue: any): void {

		}

		setVec2BySemantic(sName: string, pValue: any): void {
			
		}

		isReady(): bool {
			return false;
		}

		CREATE_EVENT_TABLE(RenderTechnique);
		UNICAST(render, VOID);
	}
}

#endif
