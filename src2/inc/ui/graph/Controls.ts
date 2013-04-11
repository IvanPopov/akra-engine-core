#ifndef UIGRAPHCONTROLS_TS
#define UIGRAPHCONTROLS_TS

#include "IUIGraph.ts"
#include "IUIGraphControls.ts"
#include "../Panel.ts"

module akra.ui.graph {
	export class Controls extends Panel implements IUIGraphControls {
		public controls: IUIComponent;
		public graph: IUIGraph;

		constructor (parent, options?, pGraph: IUIGraph = null) {
			super(parent, options);/*EUIComponents.GRAPH_CONTROLS*/
			
			this.controls = this.ui.createComponent("Controls");
			this.graph = pGraph || <IUIGraph>this.ui.createComponent("Graph");

			this.controls.attachToParent(this);
			this.graph.attachToParent(this);

			var pControlPanel: IUIComponent = this.controls;
			var pNodeBtn: IUIButton = new Button(pControlPanel, {text: "Create graph node"});
			this.connect(pNodeBtn, SIGNAL(click), SLOT(createNode));
		}

		createNode(): IUIGraphNode {
			return new graph.Node(this.graph);
		}

		rendered(): void {
			super.rendered();
			this.el.addClass("component-graphcontrols");
		}
	}

	register("GraphControls", Controls);
}

#endif
