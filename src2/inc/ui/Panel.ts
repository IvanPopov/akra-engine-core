#ifndef UIPANEL_TS
#define UIPANEL_TS

#include "IUIPanel.ts"
#include "Component.ts"

module akra.ui {
	export class Panel extends Component implements IUIPanel {
		constructor (parent, options?, eType: EUIComponents = EUIComponents.PANEL) {
			super(parent, mergeOptions({layout: EUILayouts.VERTICAL}, options), eType, $("<div style='text-align: center;';/>"));
		}

		rendered(): void {
			super.rendered();
			this.el.addClass("component-panel");
		}
	}

	register("Panel", Panel);
}

#endif

