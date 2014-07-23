/// <reference path="../../idl/IRenderMethod.ts" />
/// <reference path="../../idl/IAFXComposer.ts" />
/// <reference path="../../idl/IAFXPassInputBlend.ts" />
/// <reference path="../../common.ts" />
/// <reference path="../../fx/fx.ts" />

/// <reference path="../ResourcePoolItem.ts" />

module akra.pool.resources {
	export class RenderMethod extends ResourcePoolItem implements IRenderMethod {
		protected _pEffect: IEffect = null;
		protected _pSurfaceMaterial: ISurfaceMaterial = null;

		protected _pPassInputList: IAFXPassInputBlend[] = null;
		protected _nTotalPasses: uint = 0;

		isReady(): boolean {
			if (this.isResourceDisabled()) {
				return false;
			}

			if (isDefAndNotNull(this._pEffect) || isDefAndNotNull(this._pSurfaceMaterial)) {
				return this.isResourceLoaded();
			}

			return this.isResourceCreated();
		}

		createResource(): boolean {
			this.notifyCreated();
			return true;
		}

		getEffect(): IEffect{
			return this._pEffect;
		}

		setEffect(pEffect: IEffect): void {
			if(!isNull(this._pEffect)){
				this.unsync(this._pEffect, EResourceItemEvents.LOADED, EResourceItemEvents.CREATED);
				this._pEffect.altered.disconnect(this, this.updateEffect, EEventTypes.BROADCAST);
				this._pEffect.release();
			}

			this._pEffect = pEffect;
			
			if(!isNull(pEffect)){
				this.sync(this._pEffect, EResourceItemEvents.LOADED, EResourceItemEvents.CREATED);
				this._pEffect.altered.connect(this, this.updateEffect, EEventTypes.BROADCAST);
				this._pEffect.addRef();
			}

			this.notifyLoaded();
			this.updateEffect(pEffect);
		}

		getSurfaceMaterial(): ISurfaceMaterial {
			return this._pSurfaceMaterial;
		}

		setSurfaceMaterial(pMaterial: ISurfaceMaterial): void {
			if(!isNull(this._pSurfaceMaterial)){
				this.unsync(this._pSurfaceMaterial, EResourceItemEvents.LOADED, EResourceItemEvents.CREATED);
				this._pSurfaceMaterial.altered.disconnect(this, this.notifyAltered, EEventTypes.BROADCAST);
				this._pSurfaceMaterial.release();
			}

			this._pSurfaceMaterial = pMaterial;
			
			if(!isNull(pMaterial)){
				this.sync(this._pSurfaceMaterial, EResourceItemEvents.LOADED, EResourceItemEvents.CREATED);
				this._pSurfaceMaterial.altered.connect(this, this.notifyAltered, EEventTypes.BROADCAST);
				this._pSurfaceMaterial.addRef();
			}

			this.notifyAltered();
			this.notifyLoaded();
		}

		getMaterial(): IMaterial {
			return this.getSurfaceMaterial().getMaterial();
		}

		isEqual(pRenderMethod: IRenderMethod): boolean {return false;}

		setForeign(sName: string, pValue: any, iPass: uint = fx.ALL_PASSES): void {
			if(iPass === fx.ALL_PASSES){
				for(var i: uint = 0; i < this._nTotalPasses; i++){
					this.setForeign(sName, pValue, i);
				}

				return;
			}

			if(iPass < 0 || iPass >= this._nTotalPasses){
				debug.error("RenderMethod::setForeign : wrong number of pass (" + iPass + ")");
				return;
			}

			this._pPassInputList[iPass].setForeign(sName, pValue);
		}

		setUniform(sName: string, pValue: any, iPass: uint = fx.ALL_PASSES): void {
			if(iPass === fx.ALL_PASSES){
				for(var i: uint = 0; i < this._nTotalPasses; i++){
					this.setUniform(sName, pValue, i);
				}

				return;
			}

			if(iPass < 0 || iPass >= this._nTotalPasses){
				debug.error("RenderMethod::setUniform : wrong number of pass (" + iPass + ")");
				return;
			}

			this._pPassInputList[iPass].setUniform(sName, pValue);
		}

		setTexture(sName: string, pValue: ITexture, iPass: uint = fx.ALL_PASSES): void {
			if(iPass === fx.ALL_PASSES){
				for(var i: uint = 0; i < this._nTotalPasses; i++){
					this.setTexture(sName, pValue, i);
				}

				return;
			}

			if(iPass < 0 || iPass >= this._nTotalPasses){
				debug.error("RenderMethod::setTexture : wrong number of pass (" + iPass + ")");
				return;
			}

			this._pPassInputList[iPass].setTexture(sName, pValue);
		}

		setRenderState(eState: ERenderStates, eValue: ERenderStateValues, iPass: uint = fx.ALL_PASSES): void {
			if(iPass === fx.ALL_PASSES){
				for(var i: uint = 0; i < this._nTotalPasses; i++){
					this.setRenderState(eState, eValue, i);
				}

				return;
			}

			if(iPass < 0 || iPass >= this._nTotalPasses){
				debug.error("RenderMethod::setRenderState : wrong number of pass (" + iPass + ")");
				return;
			}

			this._pPassInputList[iPass].setRenderState(eState, eValue);
		}

		setSamplerTexture(sName: string, sTexture: string, iPass?: uint): void;
		setSamplerTexture(sName: string, pTexture: ITexture, iPass?: uint): void;
		setSamplerTexture(sName: string, pTexture: any, iPass: uint = fx.ALL_PASSES): void {
			if(iPass === fx.ALL_PASSES){
				for(var i: uint = 0; i < this._nTotalPasses; i++){
					this.setSamplerTexture(sName, pTexture, i);
				}

				return;
			}

			if(iPass < 0 || iPass >= this._nTotalPasses){
				debug.error("RenderMethod::setSamplerTexture : wrong number of pass (" + iPass + ")");
				return;
			}

			this._pPassInputList[iPass].setSamplerTexture(sName, pTexture);
		}

		_getPassInput(iPass: uint): IAFXPassInputBlend {
			return this._pPassInputList[iPass];
		}

		/** Clear previous pass-inputs.*/
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

			var pComposer: IAFXComposer = this.getManager().getEngine().getComposer();
			var iTotalPasses: uint = pEffect.getTotalPasses();

			if(isNull(this._pPassInputList)){
				this._pPassInputList = new Array<IAFXPassInputBlend>(iTotalPasses);
				this._nTotalPasses = 0;
			}

			for(var i: uint = 0; i < iTotalPasses; i++){
				var pNewInput: IAFXPassInputBlend = pComposer.getPassInputBlendForEffect(pEffect, i);
				var pOldInput: IAFXPassInputBlend = this._pPassInputList[i];

				if(isDefAndNotNull(pOldInput) && isDefAndNotNull(pNewInput)){
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

