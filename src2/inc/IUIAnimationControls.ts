#ifndef IUIANIMATIONCONTROLS_TS
#define IUIANIMATIONCONTROLS_TS

#include "IUIGraphControls.ts"

module akra {
	IFACE(IUIAnimationGraph);
	
	export interface IUIAnimationControls extends IUIGraphControls {
		readonly graph: IUIAnimationGraph;
	}
}

#endif