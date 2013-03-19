#ifndef UIGRAPHCONTROLS_TS
#define UIGRAPHCONTROLS_TS

#include "IUIGraph.ts"
#include "IUIGraphControls.ts"
#include "../Component.ts"

module akra.ui.graph {
	export class Controls extends Component implements IUIGraphControls {
		public controls: IUIComponent;

		inline get graph(): IUIGraph {
			return <IUIGraph>this.child.sibling;
		}

		constructor (parent) {
			super(parent, null, EUIComponents.GRAPH_CONTROLS);
			this.controls = <IUIComponent>this.child;
		}

		label(): string {
			return "GraphControls";
		}
	}

	Component.register("GraphControls", Controls);
}

#endif
