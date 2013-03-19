#ifndef IUIANIMATIONNODE_TS
#define IUIANIMATIONNODE_TS

#include "IUIGraphNode.ts"

module akra {
	IFACE(IAnimationBase);

	export interface IUIAnimationNode extends IUIGraphNode {
		animation: IAnimationBase;
		
		_enterFrame(fTime: float): void;
		_selected(bValue: bool): void;
	}
}

#endif