#ifndef UITREE_TS
#define UITREE_TS

#include "IUITree.ts"
#include "IUITreeNode.ts"
#include "Component.ts"

module akra.ui {
	export class TreeNode extends Component implements IUITreeNode {
		protected _pTree: IUITree;
		protected _pTargetNode: IEntity;

		inline get targetNode(): IEntity {
			return this._pTargetNode;
		}

		inline get tree(): IUITree {
			return this._pTree;
		}

		constructor (pTree: IUITree, options?, pNode: IEntity = null) {
			super(pTree, options, EUIComponents.TREE_NODE, $("<li />"));

			this._pTree = pTree;
			this._pTargetNode = pNode;
		}

		toString(bRecursive?: bool, iDepth?: int): string {
			if (bRecursive) {
				return super.toString(bRecursive);
			}

			return super.toString() + " --> { " + this.targetNode.name + " }";
		}

		renderTarget(): JQuery {
			var $list: JQuery = $("<ul />");
			this.el.append($list);
			return $list;
		}
	}

	function generateTree(pSrc: IEntity, pDst: TreeNode): void {
		pDst.targetNode = pSrc;

		var pSibling: IEntity = pSrc.sibling;
		var pChild: IEntity = pSrc.child;

		if (!isNull(pSibling)) {
			var pNode: TreeNode = new TreeNode(pDst.tree);
			pNode.attachToParent(<IUINode>pDst.parent);
			generateTree(pSibling, pNode);
		}

		if (!isNull(pChild)) {
			var pNode: TreeNode = new TreeNode(pDst.tree);
			pNode.attachToParent(pDst);
			generateTree(pChild, pNode);
		}
	}

	export class Tree extends Component implements IUITree {
		protected _pRootNode: IUITreeNode = null;

		fromTree(pEntity: IEntity): void {
			if (!isNull(this._pRootNode)) {
				CRITICAL("TODO: replace node");
			}

			var pRoot: TreeNode = new TreeNode(this);
			generateTree(pEntity, pRoot);
		}

		inline get root(): IUITreeNode {
			return this._pRootNode;
		}

		constructor (ui, options?, eType: EUIComponents = EUIComponents.TREE) {
			super(ui, options, eType);

		}

		rendered(): void {
			super.rendered();
			this.el.addClass("component-tree");
		}
	}

	register("Tree", Tree);
}

#endif
