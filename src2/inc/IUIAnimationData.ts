#ifndef IUIANIMATIONDATA_TS
#define IUIANIMATIONDATA_TS

#include "IUIGraphNode.ts"

module akra {
	IFACE (IAnimation);
	IFACE (IUIlabel);

	export interface IUIAnimationData extends IUIGraphNode {
		animation: IAnimation;

		enterFrame(fTime: float): void;
	}
}

#endif
