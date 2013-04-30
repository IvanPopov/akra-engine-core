#ifndef EFFECT_TS
#define EFFECT_TS

#include "IEffect.ts"
#include "../ResourcePoolItem.ts"
#include "IAFXComposer.ts"

module akra.core.pool.resources {
	export class Effect implements IEffect extends ResourcePoolItem {
		get totalComponents(): uint{
			return this.getComposer().getComponentCountForEffect(this);
		}

		get totalPasses(): uint{
			return this.getComposer().getTotalPassesForEffect(this);
		}

		constructor () {
            super();
        }

		isEqual(pEffect: IEffect): bool {return false;}
		isReplicated(): bool {return false;}
		isMixid(): bool {return false;}
		isParameterUsed(pParam: any, iPass?: uint): bool {return false;}

		createResource(): bool {
			this.notifyLoaded();
			return true;
		}

		replicable(bValue: bool): void {return;}
		miscible(bValue: bool): void {return;}

		addComponent(iComponentHandle: int, iShift?: int, iPass?: uint, isSet?: bool): bool;
		addComponent(pComponent: IAFXComponent, iShift?: int, iPass?: uint, isSet?: bool): bool;
		addComponent(sComponent: string, iShift?: int, iPass?: uint, isSet?: bool): bool;
		addComponent(pComponent: any, iShift?: int = 0, iPass?: uint = ALL_PASSES, isSet?: bool = true): bool {
			var pComponentPool: IResourcePool = this.manager.componentPool;

			if(isInt(pComponent)) {
				pComponent = pComponentPool.getResource(<int>pComponent);
			}
			else if(isString(pComponent)){
				pComponent = pComponentPool.findResource(<string>pComponent);
			}
			
			if(!isDef(pComponent) || isNull(pComponent)){
				debug_error("Bad component for add/delete: ", pComponent);
				return false;
			}

			if(isSet){
				if(!this.getComposer().addComponentToEffect(this, <IAFXComponent>pComponent, iShift, iPass)){
					debug_error("Can not add component '" + <IAFXComponent>pComponent.findResourceName() + "'");
					return false;
				}
			}
			else {
				if(!this.getComposer().removeComponentFromEffect(this, <IAFXComponent>pComponent, iShift, iPass)){
					debug_error("Can not delete component '" + <IAFXComponent>pComponent.findResourceName() + "'");
					return false;
				}
			}

			this.notifyAltered();

		    if (this.totalComponents === 1 && isSet) {
		        this.notifyRestored();
		    }
		    else if (this.totalComponents === 0 && !isSet) {
		        this.notifyDisabled();
		    }

			return true;
		}

		delComponent(iComponentHandle: int, iShift?: int, iPass?: uint): bool;
		delComponent(sComponent: string, iShift?: int, iPass?: uint): bool;
		delComponent(pComponent: IAFXComponent, iShift?: int, iPass?: uint): bool;
		delComponent(pComponent: any, iShift?: int = 0, iPass?: uint = ALL_PASSES): bool {
			return this.addComponent(pComponent, iShift, iPass, false);
		}

		hasComponent(sComponent: string, iShift?: int = ANY_SHIFT, iPass?: int = ANY_PASS): bool {
			var pComponentPool: IResourcePool = this.manager.componentPool;
			var pComponent: IAFXComponent = null;

			pComponent = <IAFXComponent>pComponentPool.findResource(sComponent);
			
			if(isNull(pComponent)){
				return false;
			}

			return this.getComposer().hasComponentForEffect(this, pComponent, iShift, iPass);
		}

		activate(iShift?: int = 0): bool {
 			return this.getComposer().activateEffectResource(this, iShift);
		}

		deactivate(): bool {
			return this.getComposer().deactivateEffectResource(this);
		}

		findParameter(pParam: any, iPass?: uint): any {return null;}

		private inline getComposer(): IAFXComposer {
			return this.manager.getEngine().getComposer();
		}
	}
}

#endif