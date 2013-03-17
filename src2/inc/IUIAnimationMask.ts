#ifndef IUIANIMATIONMASK_TS
#define IUIANIMATIONMASK_TS

#include "IUIAnimationNode.ts"

module akra {
	export interface IUIAnimationMask extends IUIAnimationNode {
		getMask(): FloatMap;
	}
}

#endif
