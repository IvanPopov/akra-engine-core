#ifndef IUIGRAPHCONTROLS_TS
#define IUIGRAPHCONTROLS_TS

#include "IUIPanel.ts"

module akra {
	export interface IUIGraphControls extends IUIPanel {
		readonly graph: IUIGraph;
	}
}

#endif
