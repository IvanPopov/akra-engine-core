/// <reference path="../../idl/IAFXComponent.ts" />
/// <reference path="../../common.ts" />

/// <reference path="../ResourcePoolItem.ts" />
/// <reference path="../../fx/fx.ts" />

module akra.pool.resources {
	export class Component extends ResourcePoolItem implements IAFXComponent {
		private _pTechnique: IAFXTechniqueInstruction = null;
		private _pComposer: IAFXComposer = null;

		constructor() {
			super();
		}

		create(): void {
			this._pComposer = this.getManager().getEngine().getComposer();
		}

		getTechnique(): IAFXTechniqueInstruction {
			return this._pTechnique;
		}

		setTechnique(pTechnique: IAFXTechniqueInstruction): void {
			this._pTechnique = pTechnique;
		}

		isPostEffect(): boolean {
			return isNull(this._pTechnique) ? false : this._pTechnique._isPostEffect();
		}

		getName(): string {
			return this._pTechnique._getName();
		}

		getTotalPasses(): uint {
			return this._pTechnique._totalOwnPasses();
		}

		getHash(iShift: int, iPass: uint): string {
			return this.guid.toString() + ">" + iShift.toString() +
				">" + (iPass === fx.ALL_PASSES ? "A" : iPass.toString());
		}
	}
}

