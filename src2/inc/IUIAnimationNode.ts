#ifndef IUIANIMATIONNODE_TS
#define IUIANIMATIONNODE_TS

#include "IUIGraphNode.ts"

module akra {
	IFACE(IAnimationBase);

	export interface IUIAnimationNode extends IUIGraphNode {
		animation: IAnimationBase;
	}
}

#endif