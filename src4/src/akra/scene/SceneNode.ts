/// <reference path="../idl/IEngine.ts" />
/// <reference path="../idl/IScene3d.ts" />
/// <reference path="../idl/ISceneNode.ts" />
/// <reference path="../idl/IAnimationController.ts" />

/// <reference path="../bf/bf.ts" />
/// <reference path="../math/math.ts" />

/// <reference path="Node.ts" />

module akra.scene {

	import Mat4 = math.Mat4;
	import Mat3 = math.Mat3;
	import Vec3 = math.Vec3;
	import Vec4 = math.Vec4;
	import Quat4 = math.Quat4;

	export class SceneNode extends Node implements ISceneNode {
		frozen: ISignal<{ (pNode: ISceneNode, bValue: boolean): void; }>;
		hidden: ISignal<{ (pNode: ISceneNode, bValue: boolean): void; }>;

		protected _pScene: IScene3d = null;
		protected _pAnimationControllers: IAnimationController[] = null;
		protected _iSceneNodeFlags: int = 0;

		constructor(pScene: IScene3d, eType: EEntityTypes = EEntityTypes.SCENE_NODE) {
			super(eType);

			this._pScene = pScene;
		}

		protected setupSignals(): void {
			this.frozen = this.frozen || new Signal(this);
			this.hidden = this.hidden || new Signal(this);

			super.setupSignals();
		}

		getScene(): IScene3d {
			return this._pScene;
		}

		getTotalControllers(): uint {
			return this._pAnimationControllers ? this._pAnimationControllers.length : 0;
		}

		getController(i: uint = 0): IAnimationController {
			return isNull(this._pAnimationControllers) || this._pAnimationControllers.length <= i ?
				null : this._pAnimationControllers[i];
		}

		addController(pController: IAnimationController): void {
			if (isNull(this._pAnimationControllers)) {
				this._pAnimationControllers = [];
			}

			if (this._pAnimationControllers.indexOf(pController) != -1) {
				return;
			}

			pController.attach(this);
			this._pAnimationControllers.push(pController);
		}


		isFrozen(): boolean {
			return bf.testAny(this._iSceneNodeFlags,
				(bf.flag(ESceneNodeFlags.FROZEN_SELF) | bf.flag(ESceneNodeFlags.FROZEN_PARENT)));
		}

		isSelfFrozen(): boolean {
			return bf.testBit(this._iSceneNodeFlags, ESceneNodeFlags.FROZEN_SELF);
		}

		isParentFrozen(): boolean {
			return bf.testBit(this._iSceneNodeFlags, ESceneNodeFlags.FROZEN_PARENT);
		}

		freeze(bValue: boolean = true): void {
			this._iSceneNodeFlags = bf.setBit(this._iSceneNodeFlags, ESceneNodeFlags.FROZEN_SELF, bValue);
			this.frozen.emit(bValue);
		}

		isHidden(): boolean {
			return bf.testAny(this._iSceneNodeFlags,
				(bf.flag(ESceneNodeFlags.HIDDEN_SELF) | bf.flag(ESceneNodeFlags.HIDDEN_PARENT)));
		}

		hide(bValue: boolean = true): void {
			this._iSceneNodeFlags = bf.setBit(this._iSceneNodeFlags, ESceneNodeFlags.HIDDEN_SELF, bValue);
			this.hidden.emit(bValue);
		}

		_parentFrozen(pParent: ISceneNode, bValue: boolean): void {
			this._iSceneNodeFlags = bf.setBit(this._iSceneNodeFlags, ESceneNodeFlags.FROZEN_PARENT, bValue);
		}

		_parentHidden(pParent: ISceneNode, bValue: boolean): void {
			this._iSceneNodeFlags = bf.setBit(this._iSceneNodeFlags, ESceneNodeFlags.HIDDEN_PARENT, bValue);
		}

		create(): boolean {
			super.create();

			this._m4fLocalMatrix = new Mat4(1);
			this._m4fWorldMatrix = new Mat4(1);
			this._m4fInverseWorldMatrix = new Mat4(1);
			this._m3fNormalMatrix = new Mat3(1);

			this._v3fWorldPosition = new Vec3();

			this._v3fTranslation = new Vec3(0);
			this._v3fScale = new Vec3(1);
			this._qRotation = new Quat4(0, 1);

			return true;
		}


		update(): boolean {
			var isOk = super.update();

			if (!isNull(this._pAnimationControllers)) {
				for (var i: int = 0; i < this._pAnimationControllers.length; ++i) {
					this._pAnimationControllers[i].update();
				}
			}

			return isOk;
		}

		destroy(): void {
			super.destroy();
		}

		attachToParent(pParent: ISceneNode): boolean {
			if ((<ISceneNode>pParent).getScene() !== this._pScene) {
				logger.warn("transfer of the scene node between trees scene - forbidden");
				return false;
			}

			if (super.attachToParent(pParent)) {
				if (!isNull(this.getParent())) {
					(<ISceneNode>this.getParent()).frozen.connect(this, this._parentFrozen);
					//this.connect(this.parent, SIGNAL(frozen), SLOT(_parentFrozen));
					(<ISceneNode>this.getParent()).hidden.connect(this, this._parentHidden);
					//this.connect(this.parent, SIGNAL(hidden), SLOT(_parentHidden));
				}

				return true;
			}

			return false;
		}

		detachFromParent(): boolean {
			if (super.detachFromParent()) {
				if (!isNull(this.getParent())) {
					(<ISceneNode>this.getParent()).frozen.disconnect(this, this._parentFrozen);
					//this.disconnect(this.parent, SIGNAL(frozen), SLOT(_parentFrozen));
					(<ISceneNode>this.getParent()).hidden.disconnect(this, this._parentHidden);
					//this.disconnect(this.parent, SIGNAL(hidden), SLOT(_parentHidden));
				}
				return true;
			}

			return false;
		}

		toString(isRecursive: boolean = false, iDepth: uint = 0): string {
			if (!isRecursive) {
				return "<scene_node" + (this.getName() ? " " + this.getName() : "") + ">"/* + " height: " + this.worldPosition.y*/;
			}

			return super.toString(isRecursive, iDepth);
		}
	}
}
