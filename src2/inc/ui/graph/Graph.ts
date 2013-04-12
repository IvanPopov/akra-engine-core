#ifndef UIGRAPH_TS
#define UIGRAPH_TS

#include "IUIGraphRoute.ts"
#include "IUIGraph.ts"
#include "IUIGraphNode.ts"
#include "IUIGraphConnector.ts"

#include "Route.ts"
#include "../Component.ts"

module akra.ui.graph {

	export class Graph extends Component implements IUIGraph {
		protected _eGraphType: EUIGraphTypes;
		protected _pCanvas: RaphaelPaper = null;
		protected _pTempRoute: IUITempGraphRoute = null;

		inline get nodes(): IUIGraphNode[] {
			var pNodes: IUIGraphNode[] = [];
			var pChild: IEntity = this.child;
			
			while(!isNull(pChild)) {
				pNodes.push(<IUIGraphNode>pChild);
				pChild = pChild.sibling;
			}

			return pNodes;
		}

		inline get graphType(): EUIGraphTypes { return this._eGraphType; }
		inline get canvas(): RaphaelPaper { return this._pCanvas; }

		constructor (parent, options?, eType: EUIGraphTypes = EUIGraphTypes.UNKNOWN) {
			super(parent, options, EUIComponents.GRAPH);

			this._eGraphType = eType;

			//FIXME: unblock selection
			// this.getHTMLElement().onselectstart = () => { return false };
			this.el.disableSelection();
			this.handleEvent("mouseup mousemove keydown click");
		}


		createRouteFrom(pConnector: IUIGraphConnector): void {
			this._pTempRoute = new TempRoute(pConnector);
			this.connectionBegin(this._pTempRoute);
		}

		removeTempRoute(): void {
			this._pTempRoute.destroy();
			this._pTempRoute = null;
			this.connectionEnd();
		}

		isReadyForConnect(): bool {
			return !isNull(this._pTempRoute);
		}

		connectTo(pTo: IUIGraphConnector): void {
			if (isNull(this._pTempRoute)) {
				return;
			}

			var pFrom: IUIGraphConnector = this._pTempRoute.left;

			if (pFrom.node === pTo.node) {
				debug_print("connection to same node forbidden");
				this.removeTempRoute();
				return;
			}

			var pRoute: IUIGraphRoute = new Route(pFrom, pTo);
			pRoute.routing();

			this._pTempRoute.detach();
			this.removeTempRoute();
		}

		rendered(): void {
			super.rendered();

			this._pCanvas = Raphael(this.getHTMLElement(), 0, 0);

			var $svg = this.$element.children(":first");

			$svg.css({
				width: "100%",
				height: "100%"
			});

			this.el.addClass("component-graph");
		}

		mouseup(e: IUIEvent): void {
			if (!isNull(this._pTempRoute)) {
				// LOG("remove temp route!");
				this.removeTempRoute();
			}
		}

		mousemove(e: IUIEvent): void {
			if (!isNull(this._pTempRoute)) {
				var pOffset = this.el.offset();
				this._pTempRoute.routing({x: e.pageX - pOffset.left, y: e.pageY - pOffset.top});
			}
		}

		keydown(e: IUIEvent): void {
			var pNodes: IUIGraphNode[] = this.nodes;

			for (var i: int = 0; i < pNodes.length; ++ i) {
				var iKeyCode: int = (<KeyboardEvent><any>e).keyCode;
				if (iKeyCode === EKeyCodes.DELETE) {
					pNodes[i].sendEvent(Graph.event(EUIGraphEvents.DELETE));
				}
			}

			super.keydown(e);
		}

		click(e: IUIEvent): void {
			var pNodes: IUIGraphNode[] = this.nodes;
			for (var i: int = 0; i < pNodes.length; ++ i) {
				pNodes[i].activate(false);
			}
			super.click(e);
		}

		BROADCAST(connectionBegin, CALL(pRoute));
		BROADCAST(connectionEnd, VOID);
		
		static event(eType: EUIGraphEvents): IUIGraphEvent {
			return {
				type: eType,
				traversedRoutes: []
			};
		}
	}

	register("Graph", Graph);
}

#endif

