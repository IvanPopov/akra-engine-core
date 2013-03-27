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

		constructor (parent, eType: EUIGraphTypes = EUIGraphTypes.UNKNOWN) {
			super(parent, null, EUIComponents.GRAPH);

			this._eGraphType = eType;

			//FIXME: unblock selection
			this.getHTMLElement().onselectstart = () => { return false };
		}

		isReadyForConnect(): bool {
			return !isNull(this._pTempRoute);
		}

		createRouteFrom(pConnector: IUIGraphConnector): void {
			this._pTempRoute = new TempRoute(pConnector);
		}

		removeTempRoute(): void {
			this._pTempRoute.destroy();
			this._pTempRoute = null;
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
				pNodes[i].grabEvent((<KeyboardEvent><any>e).keyCode);
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
	
	}

	register("Graph", Graph);
}

#endif

