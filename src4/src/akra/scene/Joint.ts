/// <reference path="../idl/IJoint.ts" />
/// <reference path="../idl/IEngine.ts" />

/// <reference path="../math/math.ts" />

/// <reference path="SceneNode.ts" />

module akra.scene {

	import Mat4 = math.Mat4;
	import Vec3 = math.Vec3;
	import Quat4 = math.Quat4;

	export class Joint extends SceneNode implements IJoint {
		private _sBone: string = null;
		// private _iUpdated: int = 0;
		// private _pEngine: IEngine = null;

		constructor(pScene: IScene3d) {
			super(pScene, EEntityTypes.JOINT);
		}

		getBoneName(): string {
			return this._sBone;
		}

		setBoneName(sBone: string): void {
			this._sBone = sBone;
		}

		// getEngine(): IEngine {
		// 	return this._pEngine;
		// }

		create(): boolean {
			var isOk = super.create();


			//maybe custom
			this.setInheritance(ENodeInheritance.ALL);
			return isOk;
		}

		toString(isRecursive: boolean = false, iDepth: int = 0): string {
			isRecursive = isRecursive || false;

			if (!isRecursive) {
				return "<joint" + (this._sName ? (' ' + this._sName) : "") + ">"/* + " height: " + this.worldPosition.y*/;
			}

			return Node.prototype.toString.call(this, isRecursive, iDepth);
		}

		static isJoint(pEntity: IEntity): boolean {
			return pEntity.getType() === EEntityTypes.JOINT;
		}
	}
}
