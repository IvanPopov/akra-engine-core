

/// <reference path="IUITree.ts" />

module akra {
	export interface IUITreeNode {
		/** readonly */ el: JQuery;
	
		/** readonly */ parent: IUITreeNode;
	
		/** readonly */ tree: IUITree;
		/** readonly */ source: IEntity;
	
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
}
