#ifndef RENDERMETHOD_TS
#define RENDERMETHOD_TS

#include "IRenderMethod.ts"
#include "../ResourcePoolItem.ts"
#include "IAFXComposer.ts"
#include "IAFXPassInputBlend.ts"

module akra.core.pool.resources {
	export class RenderMethod extends ResourcePoolItem implements IRenderMethod {
		protected _pEffect: IEffect = null;
		protected _pSurfaceMaterial: ISurfaceMaterial = null;

		protected _pPassInputList: IAFXPassInputBlend[] = null;
		protected _nTotalPasses: uint = 0;

		inline get effect(): IEffect{
			return this._pEffect;
		}

		set effect(pEffect: IEffect) {
			if(!isNull(this._pEffect)){
				this.unsync(this._pEffect, EResourceItemEvents.LOADED);
				this.disconnect(this._pEffect, SIGNAL(altered), SLOT(updateEffect), EEventTypes.BROADCAST);
				this._pEffect.release();
			}

			this._pEffect = pEffect;
			
			if(!isNull(pEffect)){
				this.sync(this._pEffect, EResourceItemEvents.LOADED);
				this.connect(this._pEffect, SIGNAL(altered), SLOT(updateEffect), EEventTypes.BROADCAST);
				this._pEffect.addRef();
			}

			this.updateEffect(pEffect);
		}

		inline get surfaceMaterial(): ISurfaceMaterial {
			return this._pSurfaceMaterial;
		}

		inline set surfaceMaterial(pMaterial: ISurfaceMaterial) {
			if(!isNull(this._pSurfaceMaterial)){
				this.unsync(this._pSurfaceMaterial, EResourceItemEvents.LOADED);
				this.disconnect(this._pSurfaceMaterial, SIGNAL(altered), SLOT(notifyAltered), EEventTypes.BROADCAST);
				this._pSurfaceMaterial.release();
			}

			this._pSurfaceMaterial = pMaterial;
			
			if(!isNull(pMaterial)){
				this.sync(this._pSurfaceMaterial, EResourceItemEvents.LOADED);
				this.connect(this._pSurfaceMaterial, SIGNAL(altered), SLOT(notifyAltered), EEventTypes.BROADCAST);
			}

			this._pSurfaceMaterial.addRef();

			this.notifyAltered();
		}

		isEqual(pRenderMethod: IRenderMethod): bool {return false;}

		setForeign(sName: string, pValue: any, iPass?: uint = ALL_PASSES): void {
			if(iPass === ALL_PASSES){
				for(var i: uint = 0; i < this._nTotalPasses; i++){
					this.setForeign(sName, pValue, i);
				}

				return;
			}

			if(iPass < 0 || iPass >= this._nTotalPasses){
				debug_error("RenderMethod::setForeign : wrong number of pass (" + iPass + ")");
				return;
			}

			this._pPassInputList[iPass].setForeign(sName, pValue);
		}

		setUniform(sName: string, pValue: any, iPass?: uint = ALL_PASSES): void {
			if(iPass === ALL_PASSES){
				for(var i: uint = 0; i < this._nTotalPasses; i++){
					this.setUniform(sName, pValue, i);
				}

				return;
			}

			if(iPass < 0 || iPass >= this._nTotalPasses){
				debug_error("RenderMethod::setUniform : wrong number of pass (" + iPass + ")");
				return;
			}

			this._pPassInputList[iPass].setUniform(sName, pValue);
		}

		setTexture(sName: string, pValue: ITexture, iPass?: uint = ALL_PASSES): void {
			if(iPass === ALL_PASSES){
				for(var i: uint = 0; i < this._nTotalPasses; i++){
					this.setTexture(sName, pValue, i);
				}

				return;
			}

			if(iPass < 0 || iPass >= this._nTotalPasses){
				debug_error("RenderMethod::setTexture : wrong number of pass (" + iPass + ")");
				return;
			}

			this._pPassInputList[iPass].setTexture(sName, pValue);
		}

		setRenderState(eState: ERenderStates, eValue: ERenderStateValues, iPass?: uint = ALL_PASSES): void {
			if(iPass === ALL_PASSES){
				for(var i: uint = 0; i < this._nTotalPasses; i++){
					this.setRenderState(eState, eValue, i);
				}

				return;
			}

			if(iPass < 0 || iPass >= this._nTotalPasses){
				debug_error("RenderMethod::setRenderState : wrong number of pass (" + iPass + ")");
				return;
			}

			this._pPassInputList[iPass].setRenderState(eState, eValue);
		}

		setSamplerTexture(sName: string, sTexture: string, iPass?: uint): void;
		setSamplerTexture(sName: string, pTexture: ITexture, iPass?: uint): void;
		setSamplerTexture(sName: string, pTexture: any, iPass?: uint = ALL_PASSES): void {
			if(iPass === ALL_PASSES){
				for(var i: uint = 0; i < this._nTotalPasses; i++){
					this.setSamplerTexture(sName, pTexture, i);
				}

				return;
			}

			if(iPass < 0 || iPass >= this._nTotalPasses){
				debug_error("RenderMethod::setSamplerTexture : wrong number of pass (" + iPass + ")");
				return;
			}

			this._pPassInputList[iPass].setSamplerTexture(sName, pTexture);
		}

		_getPassInput(iPass: uint): IAFXPassInputBlend {
			return this._pPassInputList[iPass];
		}

		protected updateEffect(pEffect: IEffect): void {
			if(isNull(pEffect)){
				for(var i: uint = 0; i < this._nTotalPasses; i++){
					var pOldInput: IAFXPassInputBlend = this._pPassInputList[i];

					if(isDefAndNotNull(pOldInput)){
						pOldInput._release();
						this._pPassInputList[i] = null;
					}
				}

				this._nTotalPasses = 0;
				this.notifyAltered();
				return;
			}

			var pComposer: IAFXComposer = this.manager.getEngine().getComposer();
			var iTotalPasses: uint = pEffect.totalPasses;

			if(isNull(this._pPassInputList)){
				this._pPassInputList = new Array(iTotalPasses);
				this._nTotalPasses = 0;
			}

			for(var i: uint = 0; i < iTotalPasses; i++){
				var pNewInput: IAFXPassInputBlend = pComposer.getPassInputBlendForEffect(pEffect, i);
				var pOldInput: IAFXPassInputBlend = this._pPassInputList[i];

				if(isDefAndNotNull(pOldInput)){
					if(pNewInput._isFromSameBlend(pOldInput)){
						return;
					}

					pNewInput._copyFrom(pOldInput);
					pOldInput._release();
				}

				this._pPassInputList[i] = pNewInput;
			}

			if(this._nTotalPasses > iTotalPasses){
				for(var i: uint = iTotalPasses; i < this._nTotalPasses; i++){
					var pOldInput: IAFXPassInputBlend = this._pPassInputList[i];

					if(isDefAndNotNull(pOldInput)){
						pOldInput._release();
						this._pPassInputList[i] = null;
					}
				}
			}

			this._nTotalPasses = iTotalPasses;

			this.notifyAltered();
		}
	}

	
}

#endif
