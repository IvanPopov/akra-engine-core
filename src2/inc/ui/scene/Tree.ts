#ifndef UISCENETREE_TS
#define UISCENETREE_TS

#include "IScene3d.ts"
#include "../Tree.ts"

module akra.ui.scene {
	export class Tree extends ui.Tree {
		
		protected _pScene: IScene3d = null;

		fromScene(pScene: IScene3d): void {
			this._pScene = pScene;

			this.connect(pScene, SIGNAL(nodeAttachment), SLOT(updateTree));
			this.connect(pScene, SIGNAL(nodeDetachment), SLOT(updateTree));

			this.fromTree(pScene.getRootNode());
		}

		private updateTree(): void {
			LOG("before root >>>>>>");
			var pNode: TreeNode = <TreeNode>this.root;
			if (!isNull(pNode)) {
				LOG(">>>>>>");
				pNode.recursiveUpdate();
			}
		}
	}
}

#endif

