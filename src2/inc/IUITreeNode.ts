#ifndef IUITREENODE_TS
#define IUITREENODE_TS

#include "IUIComponent.ts"

module akra {
	IFACE(IUITree);

	export interface IUITreeNode extends IUIComponent {
		tree: IUITree;
	}
}

#endif

