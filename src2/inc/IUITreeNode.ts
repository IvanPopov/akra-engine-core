#ifndef IUITREENODE_TS
#define IUITREENODE_TS

module akra {
	IFACE(IUITree);

	export interface IUITreeNode {
		readonly el: JQuery;

		readonly parent: IUITreeNode;

		readonly tree: IUITree;
		readonly source: IEntity;

		readonly expanded: bool;

		readonly totalChildren: uint;

		selected: bool;

		expand(bValue?: bool): void;

		destroy(): void;

		sync(bRecursive?: bool): void;
		select(bValue?: bool): bool;

		waitForSync(): void;
		synced(): void;
	}
}

#endif

