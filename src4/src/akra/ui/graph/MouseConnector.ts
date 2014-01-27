/// <reference path="../../idl/IUIGraph.ts" />
/// <reference path="Connector.ts" />

module akra.ui.graph {
	export class MouseConnector extends Connector {

		constructor (pGraph: IUIGraph, options?) {
			super(pGraph, options);

			pGraph.mousemove.connect(this, this._onMouseMove);

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


