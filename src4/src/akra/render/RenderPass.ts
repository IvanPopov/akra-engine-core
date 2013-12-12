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
		private _isActive: bool = true;

		constructor(pTechnique: IRenderTechnique, iPass: uint){
			this._pTechnique = pTechnique;
			this._iPassNumber = iPass;
		}	

		inline setForeign(sName: string, fValue: float): void {
			this._pInput.setForeign(sName, fValue);
		}

		inline setTexture(sName: string, pTexture: ITexture): void {
			this._pInput.setTexture(sName, pTexture);
		}

		inline setUniform(sName: string, pValue: any): void {
			this._pInput.setUniform(sName, pValue);
		}

		inline setStruct(sName: string, pValue: any): void {
			this._pInput.setStruct(sName, pValue);
		}

		inline setRenderState(eState: ERenderStates, eValue: ERenderStateValues): void {
			this._pInput.setRenderState(eState, eValue);
		}

		inline setSamplerTexture(sName: string, sTexture: string): void;
		inline setSamplerTexture(sName: string, pTexture: ITexture): void;
		inline setSamplerTexture(sName: string, pTexture: any): void {
			this._pInput.setSamplerTexture(sName, pTexture);
		}

		// inline setSamplerState(sName: string, pState: IAFXSamplerState): void {
		// 	this._pInput.setSamplerState(sName, pState);
		// }

		getRenderTarget(): IRenderTarget {
			return this._pRenderTarget;
		}

		setRenderTarget(pTarget: IRenderTarget): void {
			this._pRenderTarget = pTarget;
		}

		getPassInput(): IAFXPassInputBlend {
			return this._pInput;
		}

		setPassInput(pInput: IAFXPassInputBlend, isNeedRelocate: bool): void {
			if(isNeedRelocate){
				//pInput._copyFrom(pInput);
			}

			if(!isNull(this._pInput)) {
				this._pInput._release();
			}

			this._pInput = pInput;
		}

		blend(sComponentName: string, iPass: uint): bool {
			return this._pTechnique.addComponent(sComponentName, this._iPassNumber, iPass);
		}

		inline activate(): void {
			this._isActive = true;
		}

		inline deactivate(): void {
			this._isActive = false;
		}

		inline isActive(): bool {
			return this._isActive;
		}

		private relocateOldInput(pNewInput: IAFXPassInputBlend): void {
			//TODO: copy old uniforms to new
		}
	}
}

#endif