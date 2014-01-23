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
		protected _eOrient: EGraphConnectorOrient = EGraphConnectorOrient.UNKNOWN;
		protected _eDirect: EUIGraphDirections = EUIGraphDirections.IN;
		protected _bActive: boolean = false;
		protected _pRoute: IUIGraphRoute = null;


		 get orient(): EGraphConnectorOrient { return this._eOrient; }
		 get area(): IUIGraphConnectionArea { return (<IUIGraphConnectionArea>this.parent.parent); }
		 get node(): IUIGraphNode { return this.area.node; }
		 get graph(): IUIGraph { return this.node.graph; }
		 get route(): IUIGraphRoute { return this._pRoute; }
		 get direction(): EUIGraphDirections { return this._eDirect; }

		 set orient(e: EGraphConnectorOrient) {
			this._eOrient = e;
		}

		 set route(pRoute: IUIGraphRoute) {
			this._pRoute = pRoute;
			
			if (pRoute.isBridge()) {
				
				if (this === pRoute.left) {
					this.output();
					this.connected(pRoute.right);
				}
				else {
					this.input();
					this.connected(pRoute.left);
				}
			}
		}

		constructor (parent, options?) {
			super(parent, options, EUIComponents.GRAPH_CONNECTOR);

			this.handleEvent("mousedown mouseup");
			this.el.disableSelection();
		}


		mousedown(e: IUIEvent): void {
			e.preventDefault();
			e.stopPropagation();

			if (!isNull(this.route)) {
				return;
			}
			
			this.graph.createRouteFrom(this);
		}

		mouseup(e: IUIEvent): void {
			if (this.direction === EUIGraphDirections.IN && !this.isConnected() && this.node.isSuitable()) {
				e.stopPropagation();
				this.graph.connectTo(this);
			}
		}

		

		hasRoute(): boolean {
			return !isNull(this.route);
		}

		rendered(): void {
			super.rendered();
			this.el.addClass("component-graphconnector");
		}

		 isConnected(): boolean {
			return !isNull(this.route) && this.route.isBridge();
		}

		 isActive(): boolean {
			return this._bActive;
		}

		activate(bValue: boolean = true): void {
			if (this.isActive() === bValue) {
				return;
			}

			this._bActive = bValue;
			this.activated(bValue);
			this.highlight(bValue);

			this.route.activate(bValue);
		}

		sendEvent(e: IUIGraphEvent): void {
			this.node.sendEvent(e);			
		}

		input(): boolean {
			this.el.addClass("in");
			this._eDirect = EUIGraphDirections.IN;
			return true;
		}

		output(): boolean {
			this.el.addClass("out");
			this._eDirect = EUIGraphDirections.OUT;
			return true;
		}

		// setDirection(eDirect: EUIGraphDirections): boolean {
		// 	return (eDirect === EUIGraphDirections.IN? this.input(): this.output());
		// }

		highlight(bToggle: boolean = false): void {
			bToggle? this.$element.addClass("highlight"): this.$element.removeClass("highlight");
		}

		
		 routing(): void {
			// LOG("routing");
			this.route.routing();
		}		

		connected(pTarget: IUIGraphConnector): void {
			this.el.addClass("connected");
			EMIT_BROADCAST(connected, _CALL(pTarget));
		}

		BROADCAST(activated, CALL(value));	
		BROADCAST(routeBreaked, CALL(pRoute)); /*when route is destroyd(called from route)*/
	}

	register("GraphConnector", Connector);
}

#include "MouseConnector.ts"

#endif
