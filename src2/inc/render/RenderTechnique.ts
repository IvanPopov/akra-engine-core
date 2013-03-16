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
		
		private _iCurrentPass: uint = 0;
		private _pCurrentPass: IRenderPass = null;

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

			if(!isNull(pMethod)){
				this.setMethod(pMethod);
			}
		}


		destroy(): void {

		}

		getPass(iPass: uint): IRenderPass {
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

		addComponent(iComponentHandle: int, iShift?: int, iPass?: uint, isSet?: bool): bool;
		addComponent(pComponent: IAFXComponent, iShift?: int, iPass?: uint, isSet?: bool): bool;
		addComponent(sComponent: string, iShift?: int, iPass?: uint, isSet?: bool): bool;
		addComponent(pComponent: any, iShift?: int = 0, iPass?: uint = ALL_PASSES, isSet?: bool = true): bool {
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
				debug_error("Bad component for add/delete.");
				return false;
			}

			if(isSet){
				if(!this._pComposer.addOwnComponentToTechnique(this, <IAFXComponent>pComponent, iShift, iPass)){
					debug_error("Can not add component '" + <IAFXComponent>pComponent.findResourceName() + "'");
					return false;
				}
			}
			else {
				if(!this._pComposer.removeOwnComponentToTechnique(this, <IAFXComponent>pComponent, iShift, iPass)){
					debug_error("Can not delete component '" + <IAFXComponent>pComponent.findResourceName() + "'");
					return false;
				}
			}

			return true;
		}

		delComponent(iComponentHandle: int, iShift?: int, iPass?: uint): bool;
		delComponent(sComponent: string, iShift?: int, iPass?: uint): bool;
		delComponent(pComponent: IAFXComponent, iShift?: int, iPass?: uint): bool;
		delComponent(pComponent: any, iShift?: int = 0, iPass?: uint = ALL_PASSES): bool {
			return this.addComponent(pComponent, iShift, iPass, false);
		}

		isFreeze(): bool {
			return this._isFreeze;
		}

		updatePasses(bSaveOldUniformValue: bool): void {
			this._isFreeze = true;

			var iTotalPasses: uint = this.totalPasses;

			for(var i: uint = this._pPassList.length; i < iTotalPasses; i++){
				this._pPassList[i] = new RenderPass(this, i);
			}
			
			for(var i: uint = 0; i < iTotalPasses; i++){
				var pInput: IAFXPassInputBlend = this._pComposer.getPassInputBlend(this, i);
				this._pPassList[i].setPassInput(pInput, bSaveOldUniformValue);
			}

			this._isFreeze = false;
		}

		_setComposer(pComposer: IAFXComposer): void {
			this._pComposer = pComposer;
		}

		_renderTechnique(pSceneObject: ISceneObject): void {
			if(isNull(this._pComposer)){
				return;
			}

			var pComposer: IAFXComposer = this._pComposer;

			pComposer.setCurrentSceneObject(pSceneObject);
			pComposer.prepareTechniqueBlend(this);

			this._isFreeze = true;

			for(var i: uint = 0; i < this.totalPasses; i++){
				this.activatePass(i);
				this.render(i);

				pComposer.renderTechniquePass(this, i);
			}

			this._isFreeze = false;
			pComposer.setCurrentSceneObject(null);
		}

		_updateMethod(pMethod: IRenderMethod): void {
			this.informComposer();
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
		UNICAST(render, CALL(iPass));
	}
}

#endif
