#ifndef UIGRAPHNODE_TS
#define UIGRAPHNODE_TS

#include "IUIGraphNode.ts"
#include "IKeyMap.ts"
#include "../Component.ts"
#include "Connector.ts"
#include "Route.ts"
#include "io/ajax.ts"
#include "ConnectionArea.ts"




module akra.ui.graph {
	export class Node extends Component implements IUIGraphNode {
		protected _eGraphNodeType: EUIGraphNodes;
		protected _isActive: bool = false;
		protected _pAreas: IGraphNodeAreaMap = <any>{};
		protected _isSuitable: bool = true;

		inline get graphNodeType(): EUIGraphNodes {
			return this._eGraphNodeType;
		}

		inline get graph(): IUIGraph { return <IUIGraph>this.parent; }

		inline get areas(): IGraphNodeAreaMap {
			return this._pAreas;
		}

		constructor (pGraph: IUIGraph, options?, eType: EUIGraphNodes = EUIGraphNodes.UNKNOWN, $el?: JQuery) {
			super(getUI(pGraph), options, EUIComponents.GRAPH_NODE, $el);

			this._eGraphNodeType = eType;

			ASSERT(isComponent(pGraph, EUIComponents.GRAPH), "only graph may be as parent", pGraph);
			
			this.attachToParent(pGraph);

			if (!isDef(options) || options.init !== false) {
				this.template("graph.Node.tpl");
				this.init();
			}

			this.handleEvent("mouseenter mouseleave dblclick click");
			this.setDraggable();

			this.$element.css("position", "absolute");	
			this.$element.offset(this.graph.$element.offset());

			this.connect(pGraph, SIGNAL(connectionBegin), SLOT(onConnectionBegin));
			this.connect(pGraph, SIGNAL(connectionEnd), SLOT(onConnectionEnd));

			this.el.disableSelection();
		}
		
		protected onConnectionEnd(pGraph: IUIGraph): void {
			this._isSuitable = false;
			this.el.removeClass("open blocked");
			this.routing();
		}

		protected onConnectionBegin(pGraph: IUIGraph, pRoute: IUIGraphRoute): void {
			if (pRoute.left.node === this) {
				return;
			}

			if (!this.canAcceptConnect()) {
				this.el.addClass("blocked");
				return;
			}

			this._isSuitable = true;
			this.el.addClass("open");
		}

		//finding areas in direct childrens
		protected linkAreas(): void {
			var pChildren: IEntity[] = this.children();

			for (var i = 0; i < pChildren.length; ++ i) {
				if (isConnectionArea(pChildren[i])) {
					this.addConnectionArea(pChildren[i].name, <IUIGraphConnectionArea>pChildren[i]);
				}
			}
		}

		inline isSuitable(): bool {
			return this._isSuitable;
		}

		findRoute(pNode: IUIGraphNode): IUIGraphRoute {
			var pRoute: IUIGraphRoute = null;

			for (var i in this._pAreas) {
				pRoute = this._pAreas[i].findRoute(pNode)
				if (!isNull(pRoute)) {
					return pRoute;
				}
			}

			return null;
		}

		inline isConnectedWith(pNode: IUIGraphNode): bool {
			return !isNull(this.findRoute(pNode));
		}

		canAcceptConnect(): bool {
			for (var i in this._pAreas) {
				if (this._pAreas[i].isSupportsIncoming()) {
					return true;
				}
			}

			return false	;
		}

		mouseenter(e: IUIEvent): void {
			super.mouseenter(e);
			// this.routing();
			this.sendEvent(Graph.event(EUIGraphEvents.SHOW_MAP));
		}

		mouseleave(e: IUIEvent): void {
			super.mouseleave(e);
			// this.routing();
			this.sendEvent(Graph.event(EUIGraphEvents.HIDE_MAP));
		}

		rendered(): void {
			super.rendered();
			this.el.addClass("component-graphnode");
		}

		move(e: IUIEvent): void {
			this.routing();
		}

		dblclick(e: IUIEvent): void {
			this.activate(!this.isActive());
		}

		activate(bValue: bool = true): void {
			this._isActive = bValue;
			this.highlight(bValue);

			for (var sArea in this._pAreas) {
				this._pAreas[sArea].activate(bValue);
			}
		}

		click(e: IUIEvent): void {
			e.stopPropagation();
			super.click(e);
			this.selected(false);
		}

		inline isActive(): bool {
			return this._isActive;
		}

		protected init(): void {
			var pSidesLR: string[] = ["left", "right"];
			var pSidesTB: string[] = ["top", "bottom"];
			var pSidePanels: IUIGraphConnectionArea[] = [];
			
			for (var i: int = 0; i < pSidesTB.length; ++ i) {
				var sSide: string = pSidesTB[i];

				pSidePanels[i] = new ConnectionArea(this, {show: false});
				pSidePanels[i].setLayout(EUILayouts.HORIZONTAL);
				pSidePanels[i].render(this.el.find(".graph-node-" + sSide + ":first"));

				this._pAreas[sSide] = pSidePanels[i];
			}

			for (var i: int = 0; i < pSidesLR.length; ++ i) {
				var sSide: string = pSidesLR[i];

				pSidePanels[i] = new ConnectionArea(this, {show: false});
				pSidePanels[i].render(this.el.find(".graph-node-" + sSide + ":first"));

				this.addConnectionArea(sSide, pSidePanels[i]);
			}
		}

		protected inline addConnectionArea(sName: string, pArea: IUIGraphConnectionArea): void {
			this.connect(pArea, SIGNAL(connected), SLOT(connected));
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
		            this.beforeDestroy();
		            this.destroy();
		        }
		    }
		}
		
		highlight(bValue: bool = true): void {
		    if (bValue) {
		        this.$element.addClass('highlight');
		    }
		    else {
		        this.$element.removeClass('highlight');
		    }
		}

		routing(): void {
			for(var i in this._pAreas) {
				this._pAreas[i].routing();
			}
		}


		//BROADCAST(routeBreaked, CALL(route, connection, dir));
		BROADCAST(beforeDestroy, VOID);
		BROADCAST(selected, CALL(bModified));
	}

	register("graph.Node", Node);
}

#endif

