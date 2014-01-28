/// <reference path="../Tree.ts" />


module akra.ui.scene {
	export class CameraNode extends TreeNode {
		constructor(pTree: IUITree, pSource: IEntity) {
			super(pTree, pSource);

			this.el.bind("dblclick", () => {
				logger.log("look through");
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

	export class SceneTree extends akra.ui.Tree {
		
		protected _pScene: IScene3d = null;
		protected _iUpdateTimer: int = -1;
		protected _pIDE: IUIIDE = null;

		constructor (parent, options?) {
			super(parent, options);
		}

		fromScene(pScene: IScene3d): void {
			this._pScene = pScene;

			//this.connect(pScene, SIGNAL(nodeAttachment), SLOT(updateTree));
			//this.connect(pScene, SIGNAL(nodeDetachment), SLOT(updateTree));
			pScene.nodeAttachment.connect(this, this.updateTree);
			pScene.nodeDetachment.connect(this, this.updateTree);

			this.fromTree(pScene.getRootNode());
		}

		select(pNode: IUITreeNode): boolean {
			if (ide.cmd(ECMD.INSPECT_SCENE_NODE, pNode.source)) {
				return super.select(pNode);
			}

			return false;
		}

		private updateTree(pScene: IScene3d, pSceneNode: ISceneNode): void {
			clearTimeout(this._iUpdateTimer);

			var pTree: IUITree = this;
			pTree.getRootNode().waitForSync();

			this._iUpdateTimer = setTimeout(() => { 
				pTree.sync(); 
				pTree.getRootNode().synced(); 
			}, 1000);
		}

		_createNode(pEntity: IEntity): IUITreeNode {
			if (akra.scene.light.ShadowCaster.isShadowCaster(pEntity)) {
				return new ShadowCasterNode(this, pEntity);
			}

			if (akra.scene.SceneModel.isModel(pEntity)) {
				return new SceneModelNode(this, pEntity);
			}

			if (akra.scene.Joint.isJoint(pEntity)) {
				return new JointNode(this, pEntity);
			}

			if (akra.scene.light.LightPoint.isLightPoint(pEntity)) {
				return new LightPointNode(this, pEntity);
			}

			if (akra.scene.objects.ModelEntry.isModelEntry(pEntity)) {
				return new ModelEntryNode(this, pEntity);
			}

			if (akra.scene.objects.Camera.isCamera(pEntity)) {
				return new CameraNode(this, pEntity);
			}

			return super._createNode(pEntity);
		}
	}

	export var Tree = SceneTree;

	register("SceneTree", SceneTree);
}


