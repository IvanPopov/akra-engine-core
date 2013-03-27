#ifndef UIGRAPHCONNECTOR_TS
#define UIGRAPHCONNECTOR_TS

#define UIGRAPH_INVALID_CONNECTION -1

#include "IUIGraph.ts"
#include "IUIGraphNode.ts"
#include "IUIGraphConnector.ts"
#include "IUIGraphConnectionArea.ts"
#include "../Component.ts"

module akra.ui.graph {
	export class Connector extends Component implements IUIGraphConnector {
		protected _eDirect: EUIGraphDirections = EUIGraphDirections.IN;
		protected _bActive: bool = false;
		protected _pRoute: IUIGraphRoute = null;

		inline get route(): IUIGraphRoute { return this._pRoute; }
		inline get area(): IUIGraphConnectionArea { return (<IUIGraphConnectionArea>this.parent.parent); }
		inline get node(): IUIGraphNode { return this.area.node; }
		inline get graph(): IUIGraph { return this.node.graph; }

		set route(pRoute: IUIGraphRoute) {
			this._pRoute = pRoute;
		}

		constructor (parent, options?) {
			super(parent, options, EUIComponents.GRAPH_CONNECTOR);

			// this.disableEvent("mouseover");
			// this.disableEvent("mouseout");
		}

		mousedown(e: IUIEvent): void {
			e.stopPropagation();
			
			this.graph.createRouteFrom(this);
		}

		hasRoute(): bool {
			return !isNull(this._pRoute);
		}

		rendered(): void {
			super.rendered();
			this.el.addClass("component-graphconnector");
		}

		inline isActive(): bool {
			return this._bActive;
		}

		activate(bValue: bool = true): void {
			this._bActive = bValue;
			this.activated(bValue);
			this.highlight(bValue);
		}

		input(): bool {
			this._eDirect = EUIGraphDirections.IN;
			return true;
		}

		output(): bool {
			this._eDirect = EUIGraphDirections.OUT;
			return true;
		}

		setDirection(eDirect: EUIGraphDirections): bool {
			return (eDirect === EUIGraphDirections.IN? this.input(): this.output());
		}

		highlight(bToggle: bool = false): void {
			bToggle? this.$element.addClass("highlight"): this.$element.removeClass("highlight");
		}

		
		routing(): void {
			this.area.routing(this);
		}		

		BROADCAST(activated, CALL(value));
		BROADCAST(routeBreaked, CALL(pRoute));
		// BROADCAST(routeCreated, CALL(_pRoute));
		// BROADCAST(routeDestroyed, CALL(_pRoute));
	}

	register("GraphConnector", Connector);
}

#include "MouseConnector.ts"

#endif
