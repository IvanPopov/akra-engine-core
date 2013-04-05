#ifndef IUITREE_TS
#define IUITREE_TS

#include "IUIComponent.ts"

module akra {
	export interface IUITree extends IUIComponent {
		root: IUITreeNode;
		fromTree(pEntity: IEntity): void;
		createNode(pEntity?: IEntity): IUITreeNode;
	}
}

#endif

