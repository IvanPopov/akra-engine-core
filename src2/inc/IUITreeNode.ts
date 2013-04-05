#ifndef IUITREENODE_TS
#define IUITREENODE_TS

module akra {
	IFACE(IUITree);

	export interface IUITreeNode {
		el: JQuery;

		parent: IUITreeNode;
		children: IObjectArray;

		tree: IUITree;
		source: IEntity;

		destroy(): void;
		attachTo(pNode: IUITreeNode): void;
		_addChild(pNode: IUITreeNode): void;

		rebuild(): void;
	}
}

#endif

