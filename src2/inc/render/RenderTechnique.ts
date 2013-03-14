#ifndef RENDERTECHNIQUE_TS
#define RENDERTECHNIQUE_TS

#include "IRenderTechnique.ts"
#include "events/events.ts"

module akra.render {
	export class RenderTechnique implements IRenderTechnique {
		private _pMethod: IRenderMethod = null;
		private _pComposer: IAFXComposer = null;

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
			if(!isNull(pMethod)){
				this.setMethod(pMethod);
			}
		}


		destroy(): void {

		}

		getPass(n: uint): IRenderPass {
			return null;
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

		_setComposer(pComposer: IAFXComposer): void {
			this._pComposer = pComposer;
		}

		_updateMethod(pMethod: IRenderMethod): void {
			this.informComposer();
		} 

		private informComposer(): void {
			if(!isNull(this._pComposer)){
				this._pComposer.markTechniqueAsNeedUpdate(this);
			}
		}

		CREATE_EVENT_TABLE(RenderTechnique);
		UNICAST(render, VOID);
	}
}

#endif
