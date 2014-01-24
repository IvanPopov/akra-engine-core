/// <reference path="../../idl/IEffect.ts" />
/// <reference path="../ResourcePoolItem.ts" />
/// <reference path="../../idl/IAFXComposer.ts" />

/// <reference path="../../debug.ts" />

/// <reference path="../../fx/fx.ts" />

module akra.pool.resources {
	export class Effect extends ResourcePoolItem implements IEffect {
		protected _nTotalPasses: uint = 0;
		protected _nTotalComponents: uint = 0;

		getTotalComponents(): uint {
			return this._nTotalComponents;
		}

		getTotalPasses(): uint {
			return this._nTotalPasses;
		}

		constructor() {
			super();
		}

		isEqual(pEffect: IEffect): boolean { return false; }
		isReplicated(): boolean { return false; }
		isMixid(): boolean { return false; }
		isParameterUsed(pParam: any, iPass?: uint): boolean { return false; }

		createResource(): boolean {
			this.notifyLoaded();
			return true;
		}

		replicable(bValue: boolean): void { return; }
		miscible(bValue: boolean): void { return; }

		addComponent(iComponentHandle: int, iShift?: int, iPass?: uint): boolean;
		addComponent(pComponent: IAFXComponent, iShift?: int, iPass?: uint): boolean;
		addComponent(sComponent: string, iShift?: int, iPass?: uint): boolean;
		addComponent(pComponent: any, iShift: int = fx.DEFAULT_SHIFT, iPass: uint = fx.ALL_PASSES): boolean {
			var pComponentPool: IResourcePool<IAFXComponent> = this.getManager().getComponentPool();

			if (isInt(pComponent)) {
				pComponent = pComponentPool.getResource(<int>pComponent);
			}
			else if (isString(pComponent)) {
				pComponent = pComponentPool.findResource(<string>pComponent);
			}

			if (!isDef(pComponent) || isNull(pComponent)) {
				debug.error("Bad component for add: ", pComponent);
				return false;
			}

			if (!this.getComposer().addComponentToEffect(this, <IAFXComponent>pComponent, iShift, iPass)) {
				debug.error("Can not add component '" + <IAFXComponent>pComponent.findResourceName() + "'");
				return false;
			}

			this._nTotalComponents = this.getComposer().getComponentCountForEffect(this);
			this._nTotalPasses = this.getComposer().getTotalPassesForEffect(this);

			this.notifyAltered();

			if (this.getTotalComponents() === 1) {
				this.notifyRestored();
			}

			return true;
		}

		delComponent(iComponentHandle: int, iShift?: int, iPass?: uint): boolean;
		delComponent(sComponent: string, iShift?: int, iPass?: uint): boolean;
		delComponent(pComponent: IAFXComponent, iShift?: int, iPass?: uint): boolean;
		delComponent(pComponent: any, iShift: int = fx.DEFAULT_SHIFT, iPass: uint = fx.ALL_PASSES): boolean {
			var pComponentPool: IResourcePool<IAFXComponent> = this.getManager().getComponentPool();

			if (isInt(pComponent)) {
				pComponent = pComponentPool.getResource(<int>pComponent);
			}
			else if (isString(pComponent)) {
				pComponent = pComponentPool.findResource(<string>pComponent);
			}

			if (!isDef(pComponent) || isNull(pComponent)) {
				debug.error("Bad component for delete: ", pComponent);
				return false;
			}

			if (!this.getComposer().removeComponentFromEffect(this, <IAFXComponent>pComponent, iShift, iPass)) {
				debug.error("Can not delete component '" + <IAFXComponent>pComponent.findResourceName() + "'");
				return false;
			}

			this._nTotalComponents = this.getComposer().getComponentCountForEffect(this);
			this._nTotalPasses = this.getComposer().getTotalPassesForEffect(this);

			this.notifyAltered();

			if (this.getTotalComponents() === 0) {
				this.notifyDisabled();
			}

			return true;
		}

		hasComponent(sComponent: string, iShift: int = fx.ANY_SHIFT, iPass: int = fx.ANY_PASS): boolean {
			var pComponentPool: IResourcePool<IAFXComponent> = this.getManager().getComponentPool();
			var pComponent: IAFXComponent = null;

			pComponent = <IAFXComponent>pComponentPool.findResource(sComponent);

			if (isNull(pComponent)) {
				return false;
			}

			return this.getComposer().hasComponentForEffect(this, pComponent, iShift, iPass);
		}

		activate(iShift: int = 0): boolean {
			return this.getComposer().activateEffectResource(this, iShift);
		}

		deactivate(): boolean {
			return this.getComposer().deactivateEffectResource(this);
		}

		findParameter(pParam: any, iPass?: uint): any { return null; }

		private getComposer(): IAFXComposer {
			return this.getManager().getEngine().getComposer();
		}
	}
}
