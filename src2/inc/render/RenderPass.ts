#ifndef RENDERPASS_TS
#define RENDERPASS_TS

#include "IRenderPass.ts"
#include "util/unique.ts"

module akra.render {
	export class RenderPass implements IRenderPass {
		UNIQUE();

		private _pTechnique: IRenderTechnique = null;
		private _pRenderTarget: IRenderTarget = null;
		private _iPassNumber: uint = 0;
		private _pInput: IAFXPassInputBlend = null;

		constructor(pTechnique: IRenderTechnique, iPass: uint){
			this._pTechnique = pTechnique;
			this._iPassNumber = iPass;
		}	

		getRenderTarget(): IRenderTarget {
			return this._pRenderTarget;
		}

		setRenderTarget(pTarget: IRenderTarget): void {
			this._pRenderTarget = pTarget;
		}

		getPassInput(): IAFXPassInputBlend {
			return this._pInput;
		}

		inline setSamplerState(): void {
			// this._pInput.setSamplerState();
		}

		setPassInput(pInput: IAFXPassInputBlend, isNeedRelocate: bool): void {
			if(isNeedRelocate){
				this.relocateOldInput(pInput);
			}

			if(!isNull(this._pInput)) {
				this._pInput._release();
			}

			this._pInput = pInput;
		}

		blend(sComponentName: string, iPass: uint): bool {
			return this._pTechnique.addComponent(sComponentName, this._iPassNumber, iPass);
		}

		private relocateOldInput(pNewInput: IAFXPassInputBlend): void {
			//TODO: copy old uniforms to new
		}
	}
}

#endif