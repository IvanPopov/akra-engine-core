#ifndef JOINT_TS
#define JOINT_TS

#include "IJoint.ts"
#include "IEngine.ts"
#include "SceneNode.ts"

module akra.scene {
	export class Joint extends SceneNode implements IJoint {
		private _sBone: string = null;
		// private _iUpdated: int = 0;
		// private _pEngine: IEngine = null;

		constructor (pScene: IScene3d) {
			super(pScene, EEntityTypes.JOINT);
		}

		inline get boneName(): string{
			return this._sBone;
		}

		inline set boneName(sBone: string) {
			this._sBone = sBone;
		}

		// getEngine(): IEngine {
		// 	return this._pEngine;
		// }

		create(): bool {
			this._m4fLocalMatrix = new Mat4(1);
			this._m4fWorldMatrix = new Mat4(1);
			
			this._v3fWorldPosition  = new Vec3();
			this._v3fTranslation    = new Vec3(0, 0, 0);
			this._v3fScale          = new Vec3(1);
			this._qRotation         = new Quat4(0, 1);


			//maybe custom
			this.setInheritance(ENodeInheritance.ALL);
			return true;
		}

		toString(isRecursive: bool = false, iDepth: int = 0): string {
			isRecursive = isRecursive || false;

			if (!isRecursive) {
			    return "<joint" + (this._sName ? (' ' + this._sName) : "") + ">";
			}

			return Node.prototype.toString.call(this, isRecursive, iDepth);
		}
	}

	export inline function isJoint(pEntity: IEntity): bool {
		return pEntity.type == EEntityTypes.JOINT;
	}
}

#endif