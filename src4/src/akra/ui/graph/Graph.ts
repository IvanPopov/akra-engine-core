/// <reference path="../../idl/IUIGraphRoute.ts" />
/// <reference path="../../idl/IUIGraph.ts" />
/// <reference path="../../idl/IUIGraphNode.ts" />
/// <reference path="../../idl/IUIGraphConnector.ts" />

/// <reference path="Route.ts" />
/// <reference path="../Component.ts" />

module akra.ui.graph {

	class KeydownSignal extends Signal<{ (pGraph: IUIGraph, e: IUIEvent): void;}, IUIGraph> {
		emit(e?: IUIEvent): void {
			var pGraph: IUIGraph = this.getSender();
			var pNodes: IUIGraphNode[] = pGraph.nodes;

			for (var i: int = 0; i < pNodes.length; ++i) {
				var iKeyCode: int = (<KeyboardEvent><any>e).keyCode;
				if (iKeyCode === EKeyCodes.DELETE) {
					pNodes[i].sendEvent(Graph.event(EUIGraphEvents.DELETE));
				}
			}

			super.emit(e);
		}
	}

	class MouseupSignal extends Signal<{ (pGraph: IUIGraph, e: IUIEvent): void; }, IUIGraph> {
		emit(e?: IUIEvent): void {
			var pGraph: Graph = <Graph>this.getSender();

			if (!isNull(pGraph.tempRoute)) {
				pGraph.removeTempRoute();
			}
		}
	}

	class MousemoveSignal extends Signal<{ (pGraph: IUIGraph, e: IUIEvent): void; }, IUIGraph> {
		emit(e?: IUIEvent): void {
			var pGraph: Graph = <Graph>this.getSender();

			if (!isNull(pGraph.tempRoute)) {
				var pOffset = pGraph.el.offset();
				pGraph.tempRoute.routing({ x: e.pageX - pOffset.left, y: e.pageY - pOffset.top });
			}
		}
	}


	class ClickSignal extends Signal<{ (pGraph: IUIGraph, e: IUIEvent): void; }, IUIGraph> {
		emit(e?: IUIEvent): void {
			var pGraph: IUIGraph = this.getSender();

			super.emit(e);

			var pNodes: IUIGraphNode[] = pGraph.nodes;

			for (var i: int = 0; i < pNodes.length; ++i) {
				// LOG("deactivate node > ", pNodes[i]);
				pNodes[i].activate(false);
			}

			super.emit(e);

			
		}
	}

	export class Graph extends Component implements IUIGraph {
		protected _eGraphType: EUIGraphTypes;
		protected _pCanvas: RaphaelPaper = null;
		protected _pTempRoute: IUITempGraphRoute = null;
		protected $svg: JQuery = null;

		 get nodes(): IUIGraphNode[] {
			var pNodes: IUIGraphNode[] = [];
			var pChild: IEntity = this.child;
			
			while(!isNull(pChild)) {
				pNodes.push(<IUIGraphNode>pChild);
				pChild = pChild.sibling;
			}

			return pNodes;
		 }

		get tempRoute(): IUITempGraphRoute {
			return this._pTempRoute;
		}

		 get graphType(): EUIGraphTypes { return this._eGraphType; }
		 get canvas(): RaphaelPaper { return this._pCanvas; }

		constructor (parent, options?, eType: EUIGraphTypes = EUIGraphTypes.UNKNOWN) {
			super(parent, options, EUIComponents.GRAPH);

			this._eGraphType = eType;

			//FIXME: unblock selection
			// this.getHTMLElement().onselectstart = () => { return false };
			this.el.disableSelection();
			this.handleEvent("mouseup mousemove keydown click");
		}

		protected setupSignals(): void {
			this.keydown = this.keydown || new KeydownSignal(this);
			this.mousemove = this.mousemove || new MousemoveSignal(this);
			this.mouseup = this.mouseup || new MouseupSignal(this);
			this.click = this.click || new ClickSignal(this);

			this.connectionBegin = this.connectionBegin || new Signal(<any>this);
			this.connectionEnd = this.connectionEnd || new Signal(<any>this);
			super.setupSignals();
		}

		createRouteFrom(pFrom: IUIGraphConnector): void {
			this._pTempRoute = new TempRoute(pFrom);
			this.connectionBegin.emit(this._pTempRoute);
		}

		removeTempRoute(): void {
			this._pTempRoute.destroy();
			this._pTempRoute = null;
			this.connectionEnd.emit();
		}

		isReadyForConnect(): boolean {
			return !isNull(this._pTempRoute);
		}

		connectTo(pTo: IUIGraphConnector): void {
			if (isNull(this._pTempRoute)) {
				return;
			}

			var pFrom: IUIGraphConnector = this._pTempRoute.left;

			if (pFrom.node === pTo.node) {
				debug.log("connection to same node forbidden");
				this.removeTempRoute();
				return;
			}

			var pRoute: IUIGraphRoute = new Route(pFrom, pTo);
			pRoute.routing();

			this._pTempRoute.detach();
			this.removeTempRoute();
		}

		protected finalizeRender(): void {
			super.finalizeRender();

			this._pCanvas = Raphael(this.getHTMLElement(), 0, 0);

			var $svg = this.$svg = this.$element.children(":first");

			$svg.css({
				width: "100%",
				height: "100%"
			});

			this.el.addClass("component-graph");
		}


		connectionBegin: ISignal<{ (pGraph: IUIGraph, pRoute: IUIGraphRoute): void; }>;
		connectionEnd: ISignal<{ (pGraph: IUIGraph): void; }>;


		static KeydownSignal = KeydownSignal;
		static MousemoveSignal = MousemoveSignal;
		static MouseupSignal = MouseupSignal;
		static ClickSignal = ClickSignal;

		static event(eType: EUIGraphEvents): IUIGraphEvent {
			return {
				type: eType,
				traversedRoutes: []
			};
		}
	}

	register("Graph", Graph);
}
