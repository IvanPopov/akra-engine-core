#ifndef EFFECT_TS
#define EFFECT_TS

#include "IEffect.ts"
#include "../ResourcePoolItem.ts"
#include "IAFXComposer.ts"

module akra.core.pool.resources {
	export class Effect implements IEffect extends ResourcePoolItem {
		private _pComposer: IAFXComposer = null;


		get totalComponents(): uint{
			return this._pComposer.getComponentCountForEffect(this);
		}

		get totalPasses(): uint{
			return this._pComposer.getTotalPassesForEffect(this);
		}

		 constructor () {
            super();
        }

		isEqual(pEffect: IEffect): bool {return false;}
		isReplicated(): bool {return false;}
		isMixid(): bool {return false;}
		isParameterUsed(pParam: any, iPass?: uint): bool {return false;}

		create(): void {
			this._pComposer = this.manager.getEngine().getComposer();
		}

		replicable(bValue: bool): void {return;}
		miscible(bValue: bool): void {return;}

		addComponent(iComponentHandle: int, iShift?: int, isSet?: bool): bool;
		addComponent(pComponent: IAFXComponent, iShift?: int, isSet?: bool): bool;
		addComponent(sComponent: string, iShift?: int, isSet?: bool): bool;
		addComponent(pComponent: any, iShift?: int = 0, isSet?: bool = true): bool {
			var pComponentPool: IResourcePool = this.manager.componentPool;

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
				if(!this._pComposer.addComponentToEffect(this, <IAFXComponent>pComponent, iShift)){
					debug_error("Can not add component '" + <IAFXComponent>pComponent.findResourceName() + "'");
					return false;
				}
			}
			else {
				if(!this._pComposer.removeComponentFromEffect(this, <IAFXComponent>pComponent, iShift)){
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

		delComponent(iComponentHandle: int, iShift?: int): bool;
		delComponent(sComponent: string, iShift?: int): bool;
		delComponent(pComponent: IAFXComponent, iShift?: int): bool;
		delComponent(pComponent: any, iShift?: int = 0): bool {
			return this.addComponent(pComponent, iShift, false);
		}

		findParameter(pParam: any, iPass?: uint): any {return null;}
	}
}

#endif