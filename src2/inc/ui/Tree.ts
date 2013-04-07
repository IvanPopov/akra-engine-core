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
		public tree: IUITree = null;
		public source: IEntity = null;
		public expanded: bool = false;

		protected _pNodeMap: IUITreeNodeMap = <IUITreeNodeMap>{};
		protected $childrenNode: JQuery = null;

		inline get totalChildren(): uint {
			return Object.keys(this._pNodeMap).length;
		}

		constructor(pTree: IUITree, pSource: IEntity) {
			this.tree = pTree;
			this.source = pSource;

			debug_assert(!isNull(pSource), "source entity can not be null");

			

			this.el = $("<li><label  for=\""+ this.getID() + "\">" + this.sourceName() + "</label></li>");

			this.tree._link(this);

			this.sync();
		}

		expand(bValue: bool = true): void {
			if (this.totalChildren) {
				this.el.find("input").attr("checked", bValue);
			}

			this.expanded = bValue;
		}



		protected getID(): string {
			return "node-guid-" + this.source.getGuid();
		}


		protected sync(): void {
			//this.waitForSync();

			var pChild: IEntity = this.source.child;

			while (!isNull(pChild)) {
				if (!this.inChildren(pChild)) {
					this.addChild(this.tree._createNode(pChild));
				}

				pChild = pChild.sibling;
			}	

			//this.synced();		
		}

		synced(): void {
			this.el.find("label:first").removeClass("updating");
		}

		waitForSync(): void {
			this.el.find("label:first").addClass("updating");
		}

		protected removeChildren(): void {
			for (var i in this._pNodeMap) {
				this._pNodeMap[i].destroy();
				this._pNodeMap[i] = null;
			}
		}

		protected inChildren(pNode: IEntity): bool {
			return isDefAndNotNull(this._pNodeMap[pNode.getGuid()]);
		}

		inline protected sourceName(): string {
			return this.source.name? this.source.name: "<span class=\"unnamed\">[unnamed]</span>"
		}

		protected addChild(pNode: IUITreeNode): void {
			if (isNull(this.$childrenNode)) {
				this.el.append("<input " + (this.expanded? "checked": "") + 
					" type=\"checkbox\"  id=\"" + this.getID() + "\" />");
				this.el.removeClass("file");
				this.$childrenNode = $("<ol />");
				this.el.append(this.$childrenNode);
			}

			this.$childrenNode.append(pNode.el);
			this._pNodeMap[pNode.source.getGuid()] = pNode;
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
			this._pRootNode.sync();
			this._pRootNode.expand();
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

		sync(): void {
			// this.el.find(".updating:first").show();
			this.rootNode.sync();
		}


	}

	register("Tree", Tree);
}

#endif
