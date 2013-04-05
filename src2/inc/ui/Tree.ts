#ifndef UITREE_TS
#define UITREE_TS

#include "IUITree.ts"
#include "IUITreeNode.ts"
#include "Component.ts"

module akra.ui {
	export class TreeNode extends Component implements IUITreeNode {
		protected _pTree: IUITree;
		protected _pTargetNode: IEntity = null;

		inline get targetNode(): IEntity {
			return this._pTargetNode;
		}

		inline set targetNode(pEntity: IEntity) {
			this._pTargetNode = pEntity;	
			this.el.html(this.targetNode.name);
			this.update();
		}

		inline get tree(): IUITree {
			return this._pTree;
		}

		constructor (pTree: IUITree, options?, pNode: IEntity = null);
		constructor (pTree: IUITreeNode, options?, pNode: IEntity = null);
		constructor (parent, options?, pNode: IEntity = null) {
			super(parent, options, EUIComponents.TREE_NODE, $("<li />"));

			this._pTree = isComponent(parent, EUIComponents.TREE)? <IUITree>parent: (<IUITreeNode>parent).tree;
			
			if (!isNull(pNode)) {
				this.targetNode = pNode;
			}
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

		update(): bool {
			var pTarget: IEntity = this.targetNode;
			
			if (isNull(pTarget)) {
				return true;
			}
LOG("here..");
			if (this.childCount() == 0 && pTarget.childCount() > 0) {
				var pEntityChild: IEntity = pTarget.child;
				var pNodeChild: TreeNode = null;

				while(pEntityChild) {
					var pChild: TreeNode = <TreeNode>this.tree.createNode(pEntityChild);
					pChild.parent = this;

					if (!pNodeChild) {
						pNodeChild = pChild;
					}
					else {
						pNodeChild.sibling = pChild;
					}

					pEntityChild = pEntityChild.sibling;
					pNodeChild = <TreeNode>pNodeChild.sibling;
				}
			}
			else {
				if (this.childCount() != pTarget.childCount()) {
					this.removeAllChildren();
					return this.update();
				}

				if (pTarget.child) {
					var pNodeChild: TreeNode = <TreeNode>this.child;
					var pEntityChild: IEntity = pTarget.child;

					while(pNodeChild) {
						if (pNodeChild.targetNode != pEntityChild) {
							this.removeAllChildren();
							return this.update();
						}

						pEntityChild = pEntityChild.sibling;
						pNodeChild = <TreeNode>pNodeChild.sibling;
					}
				}
			}

			return true;
		}
	}


	export class Tree extends Component implements IUITree {
		protected _pRootNode: IUITreeNode = null;

		fromTree(pEntity: IEntity): void {
			if (!isNull(this._pRootNode)) {
				CRITICAL("TODO: replace node");
			}

			var pRoot: TreeNode = this._pRootNode = <TreeNode>this.createNode(pEntity);
			pRoot.recursiveUpdate();
		}

		inline get root(): IUITreeNode {
			return this._pRootNode;
		}

		constructor (ui, options?, eType: EUIComponents = EUIComponents.TREE) {
			super(ui, options, eType, $("<ul />"));

		}

		rendered(): void {
			super.rendered();
			this.el.addClass("component-tree");
		}

		createNode(pEntity?: IEntity): IUITreeNode {
			return new TreeNode(this, null, pEntity);
		}
	}

	register("Tree", Tree);
}

#endif
