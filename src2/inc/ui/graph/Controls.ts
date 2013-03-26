#ifndef UIGRAPHCONTROLS_TS
#define UIGRAPHCONTROLS_TS

#include "IUIGraph.ts"
#include "IUIGraphControls.ts"
#include "../Component.ts"

module akra.ui.graph {
	export class Controls extends Component implements IUIGraphControls {
		public controls: IUIComponent;
		public graph: IUIGraph;

		constructor (parent) {
			super(parent, null, EUIComponents.GRAPH_CONTROLS);
			
			this.controls = this.ui.createComponent("Controls");
			this.graph = <IUIGraph>this.ui.createComponent("Graph");

			this.controls.attachToParent(this);
			this.graph.attachToParent(this);
		}

		rendered(): void {
			super.rendered();
			this.el.addClass("component-graphcontrols");
		}
	}

	register("GraphControls", Controls);
}

#endif
