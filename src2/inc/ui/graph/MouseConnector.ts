#ifndef UIGRAPHMOUSECONNECTOR_TS
#define UIGRAPHMOUSECONNECTOR_TS

#include "IUIGraph.ts"
#include "Connector.ts"

module akra.ui.graph {
	export class MouseConnector extends Connector {

		constructor (pGraph: IUIGraph, options?) {
			super(pGraph, options);

			this.connect(pGraph, SIGNAL("mousemove"), SLOT(_onMouseMove));

			this.setDraggable();

			this.el.css({"background": "red"});
		}

		mousedown(e: IUIEvent): void {}

		_onMouseMove(pGraph: IUIGraph, e: IUIEvent): void {
			var pOffset = this.$element.offset();
			
			this.$element.offset({left: e.pageX - pOffset.left, top: e.pageY - pOffset.top});
		}
	}
}

#endif

