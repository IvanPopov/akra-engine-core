/// <reference path="../../idl/IUIGraphNode.ts" />
/// <reference path="../Component.ts" />

/// <reference path="Connector.ts" />
/// <reference path="Route.ts" />
/// <reference path="ConnectionArea.ts" />




module akra.ui.graph {
	class MouseenterSignal extends Signal<IUIGraphNode> {
		emit(e: IUIEvent): void {
			var pNode: IUIGraphNode = this.getSender();

			super.emit(e);
			// this.routing();
			pNode.sendEvent(Graph.event(EUIGraphEvents.SHOW_MAP));
		}
	}

	class MouseleaveSignal extends Signal<IUIGraphNode> {
		emit(e: IUIEvent): void {
			var pNode: IUIGraphNode = this.getSender();

			super.emit(e);
			// this.routing();
			pNode.sendEvent(Graph.event(EUIGraphEvents.HIDE_MAP));
		}
	}

	class MoveSignal extends Signal<IUIGraphNode> {
		emit(e: IUIEvent): void {
			var pNode: IUIGraphNode = this.getSender();

			pNode.routing();
		}
	}

	class DbclickSignal extends Signal<IUIGraphNode> {
		emit(e: IUIEvent): void {
			var pNode: IUIGraphNode = this.getSender();

			pNode.activate(!pNode.isActive());
		}
	}

	class ClickSignal extends Signal<IUIGraphNode> {
		emit(e: IUIEvent): void {
			var pNode: IUIGraphNode = this.getSender();

			e.stopPropagation();
			super.emit(e);
			pNode.selected.emit(false);
		}
	}





	export class Node extends Component implements IUIGraphNode {
		protected _eGraphNodeType: EUIGraphNodes;
		protected _isActive: boolean = false;
		protected _pAreas: IGraphNodeAreaMap = <any>{};
		protected _isSuitable: boolean = true;

		getGraphNodeType(): EUIGraphNodes {
			return this._eGraphNodeType;
		}

		getGraph(): IUIGraph { return <IUIGraph>this.getParent(); }

		getAreas(): IGraphNodeAreaMap {
			return this._pAreas;
		}

		constructor(pGraph: IUIGraph, options?, eType: EUIGraphNodes = EUIGraphNodes.UNKNOWN, $el?: JQuery) {
			super(getUI(pGraph), options, EUIComponents.GRAPH_NODE, $el);

			this._eGraphNodeType = eType;

			logger.assert(isComponent(pGraph, EUIComponents.GRAPH), "only graph may be as parent", pGraph);

			this.attachToParent(pGraph);

			if (!isDef(options) || options.init !== false) {
				this.template("graph.Node.tpl");
				this.init();
			}

			this.handleEvent("mouseenter mouseleave dblclick click");
			this.setDraggable();

			var node = this;
			//FIXME: without timeout must be all OK!
			setTimeout(() => {

				node.getElement().css("position", "absolute");
				node.getElement().offset(node.getGraph().getElement().offset());

			}, 5);


			//this.connect(pGraph, SIGNAL(connectionBegin), SLOT(onConnectionBegin));
			//this.connect(pGraph, SIGNAL(connectionEnd), SLOT(onConnectionEnd));
			pGraph.connectionBegin.connect(this, this.onConnectionBegin);
			pGraph.connectionEnd.connect(this, this.onConnectionEnd);

			this.getElement().disableSelection();
		}

		protected setupSignals(): void {
			this.mouseenter = this.mouseenter || new MouseenterSignal(this);
			this.mouseleave = this.mouseleave || new MouseleaveSignal(this);
			this.click = this.click || new ClickSignal(this);
			this.move = this.move || new MoveSignal(this);
			this.dblclick = this.dblclick || new DbclickSignal(this);

			this.beforeDestroy = this.beforeDestroy || new Signal(this);
			this.selected = this.selected || new Signal(this);
			super.setupSignals();
		}

		getOutputConnector(): IUIGraphConnector {
			for (var i in this.getAreas()) {
				if (this.getAreas()[i].isSupportsOutgoing()) {
					return this.getAreas()[i].prepareForConnect();
				}
			}

			return null;
		}

		getInputConnector(): IUIGraphConnector {
			for (var i in this.getAreas()) {
				if (this.getAreas()[i].isSupportsIncoming()) {
					return this.getAreas()[i].prepareForConnect();
				}
			}
		}

		protected onConnectionEnd(pGraph: IUIGraph): void {
			this._isSuitable = false;
			this.getElement().removeClass("open blocked");
			this.routing();
		}

		protected onConnectionBegin(pGraph: IUIGraph, pRoute: IUIGraphRoute): void {
			if (pRoute.getLeft().getNode() === this) {
				return;
			}

			if (!this.canAcceptConnect()) {
				this.getElement().addClass("blocked");
				return;
			}

			this._isSuitable = true;
			this.getElement().addClass("open");
		}

		//finding areas in direct childrens
		protected linkAreas(): void {
			var pChildren: IEntity[] = this.children();

			for (var i = 0; i < pChildren.length; ++i) {
				if (isConnectionArea(pChildren[i])) {
					this.addConnectionArea(pChildren[i].getName(), <IUIGraphConnectionArea>pChildren[i]);
				}
			}
		}

		isSuitable(): boolean {
			return this._isSuitable;
		}

		findRoute(pNode: IUIGraphNode): IUIGraphRoute {
			var pRoute: IUIGraphRoute = null;

			for (var i in this.getAreas()) {
				pRoute = this.getAreas()[i].findRoute(pNode)
				if (!isNull(pRoute)) {
					return pRoute;
				}
			}

			return null;
		}

		isConnectedWith(pNode: IUIGraphNode): boolean {
			return !isNull(this.findRoute(pNode));
		}

		canAcceptConnect(): boolean {
			for (var i in this.getAreas()) {
				if (this.getAreas()[i].isSupportsIncoming()) {
					return true;
				}
			}

			return false;
		}


		protected finalizeRender(): void {
			super.finalizeRender();
			this.getElement().addClass("component-graphnode");
		}

		
		activate(bValue: boolean = true): void {
			this._isActive = bValue;
			this.highlight(bValue);

			for (var sArea in this._pAreas) {
				this._pAreas[sArea].activate(bValue);
			}
		}


		isActive(): boolean {
			return this._isActive;
		}

		protected init(): void {
			var pSidesLR: string[] = ["left", "right"];
			var pSidesTB: string[] = ["top", "bottom"];
			var pSidePanels: IUIGraphConnectionArea[] = [];

			for (var i: int = 0; i < pSidesTB.length; ++i) {
				var sSide: string = pSidesTB[i];

				pSidePanels[i] = new ConnectionArea(this, { show: false });
				pSidePanels[i].setLayout(EUILayouts.HORIZONTAL);
				pSidePanels[i].render(this.getElement().find(".graph-node-" + sSide + ":first"));

				this._pAreas[sSide] = pSidePanels[i];
			}

			for (var i: int = 0; i < pSidesLR.length; ++i) {
				var sSide: string = pSidesLR[i];

				pSidePanels[i] = new ConnectionArea(this, { show: false });
				pSidePanels[i].render(this.getElement().find(".graph-node-" + sSide + ":first"));

				this.addConnectionArea(sSide, pSidePanels[i]);
			}
		}

		protected  addConnectionArea(sName: string, pArea: IUIGraphConnectionArea): void {
			//this.connect(pArea, SIGNAL(connected), SLOT(connected));
			pArea.connected.connect(this, this.connected);
			this._pAreas[sName] = pArea;
		}

		protected connected(pArea: IUIGraphConnectionArea, pFrom: IUIGraphConnector, pTo: IUIGraphConnector): void {

		}

		sendEvent(e: IUIGraphEvent): void {
			for (var i in this._pAreas) {
				this._pAreas[i].sendEvent(e);
			}

			if (e.type === EUIGraphEvents.DELETE) {
				if (this.isActive()) {
					this.beforeDestroy.emit();
					this.destroy();
				}
			}
		}

		highlight(bValue: boolean = true): void {
			if (bValue) {
				this.$element.addClass('highlight');
			}
			else {
				this.$element.removeClass('highlight');
			}
		}

		routing(): void {
			for (var i in this._pAreas) {
				this._pAreas[i].routing();
			}
		}


		beforeDestroy: ISignal<{ (pNode: IUIGraphNode): void; }>;
		selected: ISignal<{ (pNode: IUIGraphNode, bModified: boolean): void; }>;


		static MouseenterSignal: typeof Signal = MouseenterSignal;
		static MouseleaveSignal: typeof Signal = MouseleaveSignal;
		static ClickSignal: typeof Signal = ClickSignal;
		static MoveSignal: typeof Signal = MoveSignal
		static DbclickSignal: typeof Signal = DbclickSignal;
	}

	register("graph.Node", <any>Node);
}



