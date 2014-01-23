/// <reference path="../idl/IUITree.ts" />
/// <reference path="../idl/IUITreeNode.ts" />

/// <reference path="Component.ts" />

module akra.ui {
	export interface IUITreeNodeMap {
		[guid: int]: IUITreeNode;
	}

	export class TreeNode implements IUITreeNode {
		public el: JQuery = null;
		public parent: IUITreeNode = null;
		public tree: IUITree = null;
		public source: IEntity = null;
		public expanded: boolean = false;

		protected _pNodeMap: IUITreeNodeMap = <IUITreeNodeMap>{};
		protected $childrenNode: JQuery = null;

		 get totalChildren(): uint {
			return Object.keys(this._pNodeMap).length;
		}

		 get selected(): boolean {
			return this.tree.isSelected(this);
		}

		set selected(bValue: boolean) {
			if (!this.selected && !bValue) {
				this.el.find("label:first").removeClass("selected");
			}
			else if (this.selected && bValue) {
				this.el.find("label:first").addClass("selected");
			}
		}

		constructor(pTree: IUITree, pSource: IEntity) {
			this.tree = pTree;
			this.source = pSource;

			debug.assert(!isNull(pSource), "source entity can not be null");

			var pNode: TreeNode = this;

			this.el = $("<li><label  for=\""+ this.getID() + "\">" + this.sourceName() + "</label></li>");
			this.el.find("label:first").click((e: IUIEvent) => {
				e.stopPropagation();
				pNode.select();
			});

			this.tree._link(this);

			this.sync();
		}

		expand(bValue: boolean = true): void {
			if (this.totalChildren) {
				this.el.find("input").attr("checked", bValue);
			}

			this.expanded = bValue;
		}

		select(isSelect: boolean = true): boolean {
			return this.tree.select(this);
		}


		protected getID(): string {
			return "node-guid-" + this.source.guid;
		}


		protected sync(bRecursive: boolean = true): void {
			this.el.find("label:first").html(this.sourceName());

			if (bRecursive) {

				var pChildren: IEntity[] = this.source.children();
				
				var pChildMap: { [guid: int]: IEntity; } = <any>{};
				
				for (var i: int = 0; i < pChildren.length; ++ i) {
					var pChild: IEntity = pChildren[i];
					pChildMap[pChild.guid] = pChild;
					
					if (!this.inChildren(pChild)) {
						this.addChild(this.tree._createNode(pChild));
					}
				}

				//remove non-existance nodes

				for (var iGuid in this._pNodeMap) {
					if (!isDef(pChildMap[iGuid])) {
						this._pNodeMap[iGuid].destroy();
					}
				}
		
			}
		}

		synced(): void {
			this.el.find("label:first").removeClass("updating");
		}

		waitForSync(): void {
			this.el.find("label:first").addClass("updating");
		}

		protected removeChildren(): void {
			for (var i in this._pNodeMap) {
				if (!isNull(this._pNodeMap[i])) {
					this._pNodeMap[i].destroy();
					this._pNodeMap[i] = null;
				}
			}
		}

		protected inChildren(pNode: IEntity): boolean {
			return isDefAndNotNull(this._pNodeMap[pNode.guid]);
		}

		 protected sourceName(): string {
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
			this._pNodeMap[pNode.source.guid] = pNode;
		}

		destroy(): void {
			this.removeChildren();

			if (!isNull(this.tree)) {
				this.tree._unlink(this);
				this.tree = null;
			}
			
			this.source = null;
			this.el.remove();
		}
	}

	export class Tree extends Component implements IUITree {
		protected _pNodeMap: IUITreeNodeMap = <IUITreeNodeMap>{};
		protected _pRootNode: IUITreeNode = null;
		protected _pSelectedNode: IUITreeNode = null;

		fromTree(pEntity: IEntity): void {
			if (!isNull(this._pRootNode)) {
				logger.critical("TODO: replace node");
			}

			this._pRootNode = this._createNode(pEntity);
			this._pRootNode.sync();
			this._pRootNode.expand();
			this.el.append(this._pRootNode.el);

			this._pRootNode.select();
		}

		 get rootNode(): IUITreeNode {
			return this._pRootNode;
		}

		 get selectedNode(): IEntity {
			return !isNull(this._pSelectedNode)? this._pSelectedNode.source: null;
		}

		constructor (ui, options?, eType: EUIComponents = EUIComponents.TREE) {
			super(ui, options, eType, $("<ol class='tree'/>"));

		}

		private _select(pNode: IUITreeNode): boolean {
			var pPrev: IUITreeNode = this._pSelectedNode;

			this._pSelectedNode = null;

			if (!isNull(pPrev)) {
				pPrev.selected = false;
			}

			this._pSelectedNode = pNode;
			
			if (!isNull(this._pSelectedNode)) {
				this._pSelectedNode.selected = true;
			}

			return true;
		}

		select(pNode: IUITreeNode): boolean {
			return this._select(pNode);
		}

		selectByGuid(iGuid: int): void {
			if (this._pSelectedNode && this._pSelectedNode.source.guid === iGuid) {
				return;
			}

			var pNode: IUITreeNode = this._pNodeMap[iGuid];

			if (pNode) {
				this._select(pNode);
			}
		}

		isSelected(pNode: IUITreeNode): boolean {
			return this._pSelectedNode === pNode;
		}

		protected finalizeRender(): void {
			super.finalizeRender();
			this.el.addClass("component-tree");
		}

		_createNode(pEntity: IEntity): IUITreeNode {
			var pNode: IUITreeNode = new TreeNode(this, pEntity);
			return pNode;
		}

		_link(pNode: IUITreeNode): void {
			this._pNodeMap[pNode.source.guid] = pNode;
		}

		_unlink(pNode: IUITreeNode): void {
			this._pNodeMap[pNode.source.guid] = null;
		}

		sync(pEntity?: IEntity): void {
			if (arguments.length && !isNull(pEntity)) {
				this._pNodeMap[pEntity.guid].sync(false);
			}
			else {
				this.rootNode.sync();
			}
		}


	}

	register("Tree", Tree);
}

