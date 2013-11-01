#ifndef SCENENODE_TS
#define SCENENODE_TS

#include "IEngine.ts"
#include "IScene3d.ts"
#include "ISceneNode.ts"
#include "scene/Node.ts"

#include "IAnimationController.ts"

module akra.scene {
	export class SceneNode extends Node implements ISceneNode {
		protected _pScene: IScene3d = null;
		protected _pAnimationControllers: IAnimationController[] = null;
		protected _iSceneNodeFlags: int = 0;

		inline get scene(): IScene3d { return this._pScene; }
		inline set scene(pScene: IScene3d) { this._pScene = pScene; }

		inline get totalControllers(): uint { return this._pAnimationControllers? this._pAnimationControllers.length: 0; }
		
		constructor (pScene: IScene3d, eType: EEntityTypes = EEntityTypes.SCENE_NODE) {
			super(eType);

			this.scene = pScene;
		}

		inline getController(i: uint = 0): IAnimationController {
			return isNull(this._pAnimationControllers) || this._pAnimationControllers.length <= i? 
				null: this._pAnimationControllers[i];
		}

		inline addController(pController: IAnimationController): void {
			if (isNull(this._pAnimationControllers)) {
				this._pAnimationControllers = [];
			}

			if (this._pAnimationControllers.indexOf(pController) != -1) {
				return;
			}

			pController.attach(this);
			this._pAnimationControllers.push(pController);
		}


    	inline isFrozen(): bool {
    		return TEST_ANY(this._iSceneNodeFlags, 
    			(FLAG(ESceneNodeFlags.FROZEN_SELF) | FLAG(ESceneNodeFlags.FROZEN_PARENT)));
    	}

    	inline isSelfFrozen(): bool {
    		return TEST_BIT(this._iSceneNodeFlags, ESceneNodeFlags.FROZEN_SELF);
    	}

    	inline isParentFrozen(): bool {
    		return TEST_BIT(this._iSceneNodeFlags, ESceneNodeFlags.FROZEN_PARENT);	
    	}

    	freeze(bValue: bool = true): void {
    		SET_BIT(this._iSceneNodeFlags, ESceneNodeFlags.FROZEN_SELF, bValue);
    		this.frozen(bValue);
    	}

    	inline isHidden(): bool {
    		return TEST_ANY(this._iSceneNodeFlags, 
    			(FLAG(ESceneNodeFlags.HIDDEN_SELF) | FLAG(ESceneNodeFlags.HIDDEN_PARENT)));
    	}

    	hide(bValue: bool = true): void {
    		SET_BIT(this._iSceneNodeFlags, ESceneNodeFlags.HIDDEN_SELF, bValue);
    		this.hidden(bValue);
    	}

    	_parentFrozen(pParent: ISceneNode, bValue: bool): void {
    		SET_BIT(this._iSceneNodeFlags, ESceneNodeFlags.FROZEN_PARENT, bValue);
    	}

    	_parentHidden(pParent: ISceneNode, bValue: bool): void {
    		SET_BIT(this._iSceneNodeFlags, ESceneNodeFlags.HIDDEN_PARENT, bValue);
    	}

		create(): bool {
			super.create();

			this._m4fLocalMatrix        = new Mat4(1);
		    this._m4fWorldMatrix        = new Mat4(1);
		    this._m4fInverseWorldMatrix = new Mat4(1);
		    this._m3fNormalMatrix       = new Mat3(1);
		    
		    this._v3fWorldPosition  = new Vec3();

		    this._v3fTranslation    = new Vec3(0);
		    this._v3fScale          = new Vec3(1);
		    this._qRotation         = new Quat4(0, 1);

		    return true;
		}


		update(): bool {
			var isOk = super.update();

			if (!isNull(this._pAnimationControllers)) {
				for (var i: int = 0; i < this._pAnimationControllers.length; ++ i) {
					this._pAnimationControllers[i].update();
				}
			}

			return isOk;
		}

		destroy(): void {
			super.destroy();
		}

		attachToParent(pParent: IEntity): bool {
			if ((<ISceneNode>pParent).scene !== this._pScene) {
				WARNING("transfer of the scene node between trees scene - forbidden");
				return false;
			}

			if (super.attachToParent(pParent)) {
				if (!isNull(this.parent)) {
					this.connect(this.parent, SIGNAL(frozen), SLOT(_parentFrozen));
					this.connect(this.parent, SIGNAL(hidden), SLOT(_parentHidden));
				}
				return true;
			}

			return false;
		}

		detachFromParent(): bool {
			if (super.detachFromParent()) {
				if (!isNull(this.parent)) {
					this.disconnect(this.parent, SIGNAL(frozen), SLOT(_parentFrozen));
					this.disconnect(this.parent, SIGNAL(hidden), SLOT(_parentHidden));
				}
				return true;
			}

			return false;
		}

		toString(isRecursive: bool = false, iDepth: uint = 0): string {
			if (!isRecursive) {
		        return "<scene_node" + (this.name? " " + this.name: "") + ">"/* + " height: " + this.worldPosition.y*/;
		    }

		    return super.toString(isRecursive, iDepth);
		}

		BROADCAST(frozen, CALL(value));
		BROADCAST(hidden, CALL(value));

	}
}

#endif