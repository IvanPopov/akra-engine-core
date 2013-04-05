#ifndef UITREE_TS
#define UITREE_TS

#include "IUITree.ts"
#include "IUITreeNode.ts"
#include "Component.ts"
#include "util/ObjectArray.ts"

module akra.ui {
	export class TreeNode implements IUITreeNode {
		public el: JQuery = null;
		public parent: IUITreeNode = null;
		public children: IObjectArray = new util.ObjectArray;
		public tree: IUITree = null;
		public source: IEntity = null;

		protected $childrenNode: JQuery = null;


		constructor(pTree: IUITree, pSource: IEntity) {
			this.tree = pTree;
			this.source = pSource;

			debug_assert(!isNull(pSource), "source entity can not be null");

			var id: string = "guid-" + this.source.getGuid();

			this.el = $("<li><label for=\""+ id + "\">" + this.source.name + "</label>\
<input type=\"checkbox\" checked disabled id=\"" + id + "\" /></li>");

			this.tree._link(this);
		}

		protected rebuild(): void {
			this.removeChildren();

			var pChild: IEntity = this.source.child;

			while (!isNull(pChild)) {
				var pNode: IUITreeNode = this.tree._createNode(pChild);
				pNode.attachTo(this);
				pNode.rebuild();

				pChild = pChild.sibling;
			}
		}

		protected removeChildren(): void {
			for (var i = 0; i < this.children.length; ++ i) {
				this.children.value(i).destroy();
			}

			this.children.clear();
		}

		attachTo(pNode: IUITreeNode): void {
			this.parent = pNode;
			this.parent._addChild(this);
		}

		_addChild(pNode: IUITreeNode): void {
			if (isNull(this.$childrenNode)) {
				this.$childrenNode = $("<ol />");
				this.el.append(this.$childrenNode);
			}

			this.$childrenNode.append(pNode.el);
			this.children.push(pNode);
		}

		destroy(): void {
			this.removeChildren();

			this.tree._unlink(this);
			this.tree = null;
			this.source = null;
			this.el.remove();
		}
	}

	export interface IUITreeNodeMap {
		[guid: int]: IUITreeNode;
	}

	export class Tree extends Component implements IUITree {
		protected _pNodeMap: IUITreeNodeMap = <IUITreeNodeMap>{};
		protected _pRootNode: IUITreeNode = null;

		fromTree(pEntity: IEntity): void {
			if (!isNull(this._pRootNode)) {
				CRITICAL("TODO: replace node");
			}

			this._pRootNode = this._createNode(pEntity);
			this._pRootNode.rebuild();
			this.el.append(this._pRootNode.el);
		}

		inline get rootNode(): IUITreeNode {
			return this._pRootNode;
		}

		constructor (ui, options?, eType: EUIComponents = EUIComponents.TREE) {
			super(ui, options, eType, $("<ol class='tree'/>"));

		}

		rendered(): void {
			super.rendered();
			this.el.addClass("component-tree");
		}

		_createNode(pEntity: IEntity): IUITreeNode {
			var pNode: IUITreeNode = new TreeNode(this, pEntity);
			return pNode;
		}

		_link(pNode: IUITreeNode): void {
			this._pNodeMap[pNode.source.getGuid()] = pNode;
		}

		_unlink(pNode: IUITreeNode): void {
			this._pNodeMap[pNode.source.getGuid()] = null;
		}
	}

	register("Tree", Tree);
}

#endif
