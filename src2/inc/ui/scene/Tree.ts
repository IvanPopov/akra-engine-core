#ifndef UISCENETREE_TS
#define UISCENETREE_TS

#include "IScene3d.ts"
#include "../Tree.ts"

module akra.ui.scene {
	export class CameraNode extends TreeNode {
		constructor(pTree: IUITree, pSource: IEntity) {
			super(pTree, pSource);

			this.el.bind("dblclick", () => {
				LOG("look through");
			});

			this.el.find("label:first").addClass("camera");
		}
	}

	export class SceneObjectNode extends TreeNode {
		constructor(pTree: IUITree, pSource: IEntity) {
			super(pTree, pSource);

			//this.el.find("label:first").before("<div class=\"scene-object-show-btn\" />");
		}
	}

	export class SceneModelNode extends SceneObjectNode {
		constructor(pTree: IUITree, pSource: IEntity) {
			super(pTree, pSource);

			this.el.find("label:first").addClass("scene-model");
		}
	}

	export class ShadowCasterNode extends TreeNode {
		constructor(pTree: IUITree, pSource: IEntity) {
			super(pTree, pSource);

			this.el.find("label:first").addClass("shadow-caster");
		}
	}

	export class JointNode extends TreeNode {
		constructor(pTree: IUITree, pSource: IEntity) {
			super(pTree, pSource);

			this.el.find("label:first").addClass("joint");
		}
	}

	export class LightPointNode extends TreeNode {
		constructor(pTree: IUITree, pSource: IEntity) {
			super(pTree, pSource);

			this.el.find("label:first").addClass("light-point");
		}
	}

	export class ModelEntryNode extends TreeNode {
		constructor(pTree: IUITree, pSource: IEntity) {
			super(pTree, pSource);

			this.el.find("label:first").addClass("model-entry");
		}
	}

	export class Tree extends ui.Tree {
		
		protected _pScene: IScene3d = null;
		protected _iUpdateTimer: int = -1;
		protected _pIDE: IUIIDE = null;

		constructor (parent, options?) {
			super(parent, options);
		}

		fromScene(pScene: IScene3d): void {
			this._pScene = pScene;

			this.connect(pScene, SIGNAL(nodeAttachment), SLOT(updateTree));
			this.connect(pScene, SIGNAL(nodeDetachment), SLOT(updateTree));

			this.fromTree(pScene.getRootNode());
		}

		select(pNode: IUITreeNode): bool {
			if (ide.cmd(ECMD.INSPECT_SCENE_NODE, pNode.source)) {
				return super.select(pNode);
			}

			return false;
		}

		private updateTree(pScene: IScene3d, pSceneNode: ISceneNode): void {
			clearTimeout(this._iUpdateTimer);

			var pTree: IUITree = this;
			pTree.rootNode.waitForSync();

			this._iUpdateTimer = setTimeout(() => { 
				pTree.sync(); 
				pTree.rootNode.synced(); 
			}, 1000);
		}

		_createNode(pEntity: IEntity): IUITreeNode {
			if (akra.scene.light.isShadowCaster(pEntity)) {
				return new ShadowCasterNode(this, pEntity);
			}

			if (akra.scene.isModel(pEntity)) {
				return new SceneModelNode(this, pEntity);
			}

			if (akra.scene.isJoint(pEntity)) {
				return new JointNode(this, pEntity);
			}

			if (akra.scene.light.isLightPoint(pEntity)) {
				return new LightPointNode(this, pEntity);
			}

			if (akra.scene.objects.isModelEntry(pEntity)) {
				return new ModelEntryNode(this, pEntity);
			}

			if (akra.scene.objects.isCamera(pEntity)) {
				return new CameraNode(this, pEntity);
			}

			return super._createNode(pEntity);
		}
	}

	register("SceneTree", Tree);
}

#endif

