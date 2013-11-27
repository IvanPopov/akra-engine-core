// AIUITreeNode interface
// [write description here...]


/// <reference path="AIUITree.ts" />

interface AIUITreeNode {
	/** readonly */ el: JQuery;

	/** readonly */ parent: AIUITreeNode;

	/** readonly */ tree: AIUITree;
	/** readonly */ source: AIEntity;

	/** readonly */ expanded: boolean;

	/** readonly */ totalChildren: uint;

	selected: boolean;

	expand(bValue?: boolean): void;

	destroy(): void;

	sync(bRecursive?: boolean): void;
	select(bValue?: boolean): boolean;

	waitForSync(): void;
	synced(): void;
}