#ifndef RENDERTECHNIQUE_TS
#define RENDERTECHNIQUE_TS

#include "IRenderTechnique.ts"
#include "events/events.ts"
#include "render/RenderPass.ts"

module akra.render {
	export class RenderTechnique implements IRenderTechnique {
		private _pMethod: IRenderMethod = null;
		
		private _isFreeze: bool = false;
		private _pComposer: IAFXComposer = null;
		
		private _pPassList: IRenderPass[] = null;
		private _pPassBlackList: bool[] = null;
		
		private _iCurrentPass: uint = 0;
		private _pCurrentPass: IRenderPass = null;

		private _iGlobalPostEffectsStart: uint = 0;

		inline get modified(): uint {
			return this.getGuid();
		}

		get totalPasses(): uint {
			return this._pComposer.getTotalPassesForTechnique(this);
		}

		get data(): IAFXComponentBlend {
			return null;
		}

		constructor (pMethod: IRenderMethod = null) {
			this._pPassList = [];
			this._pPassBlackList = [];

			if(!isNull(pMethod)){
				this.setMethod(pMethod);
			}
		}


		destroy(): void {

		}

		inline getPass(iPass: uint): IRenderPass {
			this._pComposer.prepareTechniqueBlend(this);
			return this._pPassList[iPass];
		}

		getMethod(): IRenderMethod {
			return this._pMethod;
		}

		setMethod(pMethod: IRenderMethod): void {
			if(!isNull(this._pMethod)){
				this.disconnect(this._pMethod, SIGNAL(altered), SLOT(_updateMethod), EEventTypes.BROADCAST);
			}

			this._pMethod = pMethod;

			if(!isNull(pMethod)){
				var pComposer: IAFXComposer = pMethod.manager.getEngine().getComposer();
				this._setComposer(pComposer);
				this.connect(pMethod, SIGNAL(altered), SLOT(_updateMethod), EEventTypes.BROADCAST);
			}

			this.informComposer();			
		}

		setState(sName: string, pValue: any): void {

		}

		setForeign(sName: string, pValue: any): void {

		}

		setStruct(sName: string, pValue: any): void {
			//skip
		}

		setTextureBySemantics(sName: string, pValue: any): void {

		}

		setShadowSamplerArray(sName: string, pValue: any): void {

		}

		setVec2BySemantic(sName: string, pValue: any): void {
			
		}

		isReady(): bool {
			return this._pMethod.isResourceLoaded() && !this._pMethod.isResourceDisabled();
		}

		addComponent(iComponentHandle: int, iShift?: int, iPass?: uint): bool;
		addComponent(pComponent: IAFXComponent, iShift?: int, iPass?: uint): bool;
		addComponent(sComponent: string, iShift?: int, iPass?: uint): bool;
		addComponent(pComponent: any, iShift?: int = 0, iPass?: uint = ALL_PASSES): bool {
			if(isNull(this._pComposer)){
				return false;
			}

			var pComponentPool: IResourcePool = this._pComposer.getEngine().getResourceManager().componentPool;

			if(isInt(pComponent)) {
				pComponent = pComponentPool.getResource(<int>pComponent);
			}
			else if(isString(pComponent)){
				pComponent = pComponentPool.findResource(<string>pComponent);
			}
			
			if(!isDef(pComponent) || isNull(pComponent)){
				debug_error("Bad component for add.");
				return false;
			}

			if(!this._pComposer.addOwnComponentToTechnique(this, <IAFXComponent>pComponent, iShift, iPass)){
				debug_error("Can not add component '" + <IAFXComponent>pComponent.findResourceName() + "'");
				return false;
			}

			return true;
		}

		delComponent(iComponentHandle: int, iShift?: int, iPass?: uint): bool;
		delComponent(sComponent: string, iShift?: int, iPass?: uint): bool;
		delComponent(pComponent: IAFXComponent, iShift?: int, iPass?: uint): bool;
		delComponent(pComponent: any, iShift?: int = 0, iPass?: uint = ALL_PASSES): bool {
			if(isNull(this._pComposer)){
				return false;
			}

			var pComponentPool: IResourcePool = this._pComposer.getEngine().getResourceManager().componentPool;

			if(isInt(pComponent)) {
				pComponent = pComponentPool.getResource(<int>pComponent);
			}
			else if(isString(pComponent)){
				pComponent = pComponentPool.findResource(<string>pComponent);
			}
			
			if(!isDef(pComponent) || isNull(pComponent)){
				debug_error("Bad component for delete.");
				return false;
			}

			if(!this._pComposer.removeOwnComponentToTechnique(this, <IAFXComponent>pComponent, iShift, iPass)){
				debug_error("Can not delete component '" + <IAFXComponent>pComponent.findResourceName() + "'");
				return false;
			}

			return true;
		}

		hasComponent(sComponent: string, iShift?: int = ANY_SHIFT, iPass: uint = ANY_PASS): bool {
			return this._pMethod.effect.hasComponent(sComponent, iShift, iPass) || this.hasOwnComponent(sComponent, iShift, iPass);
		}

		hasOwnComponent(sComponent: string, iShift?: int = ANY_SHIFT, iPass: uint = ANY_PASS): bool {
			if(isNull(this._pComposer)){
				return false;
			}

			var pComponentPool: IResourcePool = this._pComposer.getEngine().getResourceManager().componentPool;
			var pComponent: IAFXComponent = null;

			pComponent = <IAFXComponent>pComponentPool.findResource(sComponent);
			
			if(isNull(pComponent)){
				return false;
			}

			return this._pComposer.hasOwnComponentInTechnique(this, pComponent, iShift, iPass);
		}

		hasPostEffect(): bool {
			return this._iGlobalPostEffectsStart > 0;
		}

		isPostEffectPass(iPass: uint): bool {
			return this._iGlobalPostEffectsStart <= iPass;
		}

		isLastPass(iPass: uint): bool {
			var iMaxPass: uint = this.totalPasses - 1;
			
			if(iMaxPass === iPass){
				return true;
			}

			if(!this._pPassBlackList[iMaxPass]){
				return false;
			}

			for(var i: uint = this._pPassBlackList.length - 2; i >=0; i--){
				if(!this._pPassBlackList[i]){
					if(i !== iPass){
						return false;
					}
					else {
						return true;
					}
				}
			}

			return false;
		}

		isFirstPass(iPass: uint): bool {
			if(iPass === 0){
				return true;
			}

			if(!this._pPassBlackList[0]){
				return false;
			}

			for(var i: uint = 1; i < this._pPassBlackList.length; i++){
				if(!this._pPassBlackList[i]){
					if(i !== iPass){
						return false;
					}
					else {
						return true;
					}
				}
			}

			return false;
		}

		isFreeze(): bool {
			return this._isFreeze;
		}

		updatePasses(bSaveOldUniformValue: bool): void {
			this._isFreeze = true;

			var iTotalPasses: uint = this.totalPasses;

			for(var i: uint = this._pPassList.length; i < iTotalPasses; i++) {
				if(!isDef(this._pPassBlackList[i]) || this._pPassBlackList[i] === false){
					this._pPassList[i] = new RenderPass(this, i);
					this._pPassBlackList[i] = false;
				}
			}
			
			for(var i: uint = 0; i < iTotalPasses; i++){
				if(!this._pPassBlackList[i]){
					var pInput: IAFXPassInputBlend = this._pComposer.getPassInputBlend(this, i);
					if(!isNull(pInput)){
						this._pPassList[i].setPassInput(pInput, bSaveOldUniformValue);
						this._pPassList[i].activate();
					}
					else {
						this._pPassList[i].deactivate();
					}
					
				}
			}

			this._isFreeze = false;
		}

		inline _setComposer(pComposer: IAFXComposer): void {
			this._pComposer = pComposer;
		}

		inline _getComposer(): IAFXComposer {
			return this._pComposer;
		}

		_renderTechnique(pViewport: IViewport, pRenderable: IRenderableObject, pSceneObject: ISceneObject): void {
			if(isNull(this._pComposer)){
				return;
			}

			var pComposer: IAFXComposer = this._pComposer;

			pComposer.prepareTechniqueBlend(this);
			pComposer._setCurrentViewport(pViewport);
			pComposer._setCurrentSceneObject(pSceneObject);
			pComposer._setCurrentRenderableObject(pRenderable);
			pComposer.applySurfaceMaterial(this._pMethod.surfaceMaterial);

			this._isFreeze = true;

			for(var i: uint = 0; i < this.totalPasses; i++){
				if(this._pPassBlackList[i] === false && this._pPassList[i].isActive()){
					this.activatePass(i);
					this.render(i, pRenderable, pSceneObject, pViewport);
					pViewport.render(this, i, pRenderable, pSceneObject);
					pComposer.renderTechniquePass(this, i);
				}
			}

			this._isFreeze = false;
			pComposer._setDefaultCurrentState();
		}

		_updateMethod(pMethod: IRenderMethod): void {
			this.informComposer();
		} 

		_blockPass(iPass: uint): void {
			this._pPassBlackList[iPass] = true;
			this._pComposer.prepareTechniqueBlend(this);
			// this._pPassList[iPass] = null; 
			
		}


        _setPostEffectsFrom(iPass: uint): void {
        	this._iGlobalPostEffectsStart = iPass;
        }

		private informComposer(): void {
			if(!isNull(this._pComposer)){
				this._pComposer.markTechniqueAsNeedUpdate(this);
			}
		}

		private activatePass(iPass: uint): void {
			this._iCurrentPass = iPass;
			this._pCurrentPass = this._pPassList[iPass];
		}


		CREATE_EVENT_TABLE(RenderTechnique);
		BROADCAST(render, CALL(iPass, pRenderable, pSceneObject, pViewport));
	}
}

#endif
