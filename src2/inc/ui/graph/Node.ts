#ifndef UIGRAPHNODE_TS
#define UIGRAPHNODE_TS

#include "IUIGraphNode.ts"
#include "IKeyMap.ts"
#include "../Component.ts"
#include "Connector.ts"
#include "Route.ts"

module akra.ui.graph {
	export class Node extends Component implements IUIGraphNode {
		protected _eGraphNodeType: EUIGraphNodes;

		protected _pRoutes: IUIGraphRoute[] = new Route[];
		protected _pConnectors: IUIGraphConnector[] = new Connector[];
		protected _iLastConnection: int = 0;
		protected _isActive: bool = false;

		public $zoneOut: JQuery = null;
		public $zoneIn: JQuery = null;


		inline get connectors(): IUIGraphConnector[] {
			return this._pConnectors;
		}

		inline get graphNodeType(): EUIGraphNodes {
			return this._eGraphNodeType;
		}

		inline get graph(): IUIGraph { return <IUIGraph>this.parent; }

		constructor (pGraph: IUIGraph, eType: EUIGraphNodes = EUIGraphNodes.UNKNOWN) {
			super(pGraph, null, EUIComponents.GRAPH_NODE);
			this._eGraphNodeType = eType;

			ASSERT(isComponent(pGraph, EUIComponents.GRAPH), "only graph may be as parent");

			this.init();
			this.setDraggable();
		}

		label(): string {
			return "GraphNode";
		}

		move(e: IUIEvent): void {
			this.routing();
		}

		// click(e: IUIEvent): void {
		// 	e.stopPropagation();
		// }

		dblclick(e: IUIEvent): void {
			this.activate(!this.isActive());
		}

		activate(bValue: bool = true): void {
			var pConnectors: IUIGraphConnector[] = this._pConnectors;
			
			this._isActive = bValue;
			this.highlight(bValue);

			for (var i: int = 0; i < pConnectors.length; ++ i) {
				if (!isNull(pConnectors[i])) {
					pConnectors[i].activate(bValue);
				}
			}
		}

		inline isActive(): bool {
			return this._isActive;
		}

		private init(): void {
			var $sides: JQuery = this.$element.find("[side]");
			this.setRouteAreas($sides);
		}

		protected getRouteArea($zone: JQuery, eDirection: EUIGraphDirections = EUIGraphDirections.IN): IUILayout {
						
			if (eDirection === EUIGraphDirections.OUT) {
		
				var pChild: IEntity = this.child;
				while (pChild.sibling) {
					var $layout = (<IUILayout>pChild).$element.parent();
					if (isLayout(pChild) && $layout[0] == $zone[0]) {
						console.log("!!!BINGGO!!!!");
						return <IUILayout>pChild;
					}

					pChild = pChild.sibling;
				}

			}
			//if (eDirection === EUIGraphDirections.OUT) {
				var pChild: IEntity = this.child;
				while (pChild.sibling) {
					if (isLayout(pChild)/* && (!$zone.attr("side") || <IUILayout>pChild).attr("comment") == $zone.attr("side")*/) {
						return <IUILayout>pChild;
					}
					pChild = pChild.sibling;
				}
			//}
			return null;
		}

		protected setupOutConnection($zoneOut?: JQuery): void {
			$zoneOut = $zoneOut || this.$zoneOut;
		    this.graph._readyForConnect(true);
		    this.graph._setOutputNode(this);
		    var pLayout: IUILayout = this.getRouteArea($zoneOut, EUIGraphDirections.OUT);
		    this.addConnector(pLayout);
		}

		setRouteDragAreas($zoneOut: JQuery): void {
			var pNode: Node = this;

			this.$zoneOut = $zoneOut;
		
			$zoneOut.bind({
		      mousedown: (e: IUIEvent) => { 
		      	e.stopPropagation();
		      	return pNode.setupOutConnection($(e.delegateTarget)); 
		      }
		    });
		}

		setRouteDropAreas($zoneIn: JQuery): void {
			var pNode: Node = this;
			var pGraph: IUIGraph = this.graph;
		    
		    $zoneIn.bind({
		    	mouseup: (e: IUIEvent) => { 
		    		pNode.$zoneIn = $(e.delegateTarget);
		    		pGraph._readyForConnect(false);
		    	}
		   	}); 
		        
		    //подсветить все стороны    
		    $zoneIn.bind({
		    	mouseover: (e: IUIEvent) => { pGraph._setInputNode(pNode); }
		   	}); 
		}

		setRouteAreas($zoneIn: JQuery, $zoneOut?: JQuery) {
			if (arguments.length < 2) {
				$zoneOut = $zoneIn;
			}

			this.setRouteDragAreas($zoneOut);
    		this.setRouteDropAreas($zoneIn);
		}

		grabEvent(iKeyCode: int): void {
			if (iKeyCode === EKeyCodes.DELETE) {
		        var pConnectors: IUIGraphConnector[] = this._pConnectors;

		        for (var i = 0; i < pConnectors.length; i++) {
		            if (isDefAndNotNull(pConnectors[i]) && pConnectors[i].isActive()) {
		                this.getRoute(i).remove(true);
		            }
		        }

		        if (this.isActive()) {
		            this.beforeDestroy(this);
		            this.destroy();
		        }
		    }
		}

		removeRoute(pRoute: IUIGraphRoute, iConnection: int, eDir: EUIGraphDirections): void {
		    this.routeBreaked(pRoute, iConnection, eDir);

		    this._pConnectors[iConnection].destroy();
		    this._pConnectors[iConnection] = null;
		    this._pRoutes[iConnection] = null;
		    this.routing();
		}

		addConnector(pLayout: IUILayout) {
			var pConnector: IUIGraphConnector = new Connector(pLayout, this);
			console.log(pLayout.toString(true));
		    var iConnector: int = UIGRAPH_INVALID_CONNECTION;

		    this.connect(pConnector, SIGNAL(mousedown), SLOT(_onConnectorMouseDown));

		    for (var i = 0; i < this._pConnectors.length; ++ i) {
		        if (this._pConnectors[i] === null) {
		            this._pConnectors[i] = pConnector;
		            iConnector = i;
		            break;
		        }
		    }

		    if (!Connector.isValidConnection(iConnector)) {
		        this._pConnectors.push(pConnector);
		        iConnector = this._pConnectors.length - 1;
		    }

		    pConnector.connection = iConnector;
		    this._iLastConnection = iConnector;

		    pConnector.activate(this.isActive());

		    this.connect(pConnector, SIGNAL(activated), SLOT(_onConnectorActivation));
		    this.routing();
		}

		_onConnectorMouseDown(pConnector: IUIGraphConnector, e: IUIEvent): void {
			pConnector.activate(!pConnector.isActive());
		}

		_onConnectorActivation(pConnector: IUIGraphConnector, bState: bool): void {
			if (pConnector.isValid()) {
				var pRoute = this._pRoutes[pConnector.connection];
		       
		        if (isDefAndNotNull(pRoute)) {
		            pRoute.activate(bState);
		            pRoute.routing();
		        }
	        }
		}

		activateRoute(pRoute: IUIGraphRoute, bValue: bool, iConnection: int): void {
			this._pConnectors[iConnection].activate(bValue);
		}

		isSuitable(pTarget: IUIGraphNode): bool {
			return true;
		}

		uponConnection(pTarget: IUIGraphNode = null): void {
			if (isNull(pTarget)) {
				this._pConnectors[this._iLastConnection].destroy();
				this._pConnectors[this._iLastConnection] = null;
				this.routing();
			}
		}

		prepareForConnect(): bool {
			return true;
			//this.graph.connectNode(this);
		}

		input(i: int): IPoint {
		    if (isNull(this._pConnectors)) {
		        //LOG('ooops...', this.getAnimation().name);
		    }
//getAbsolutePosition(this.getGraph());
			var pGraphOffset = this.graph.$element.offset();
		    var pPosition = this._pConnectors[i].$element.offset();
		    var pOut: IPoint = {x: pPosition.left - pGraphOffset.left, y: pPosition.top - pGraphOffset.top};
		    
		    pOut.x += this._pConnectors[i].$element.width() / 2.;
		    pOut.y += this._pConnectors[i].$element.height() / 2.;

		    return pOut;
		};

		inline output(i: int): IPoint {
			return this.input(i);
		}

		highlight(bValue: bool = true): void {
		    if (bValue) {
		        this.$element.addClass('highlight');
		    }
		    else {
		        this.$element.removeClass('highlight');
		    }
		}

		route(eDirection: EUIGraphDirections, pTarget?: IUIGraphNode): int;
		route(eDirection: EUIGraphDirections, pTarget?: IUIGraphFloatNode): int;
		route(eDirection: EUIGraphDirections, pTarget?): int {

		    if (eDirection === EUIGraphDirections.IN) {
		        this.addConnector(this.getRouteArea(this.$zoneIn, EUIGraphDirections.IN));    
		    }

		    return this._iLastConnection;
		}

		routing(): void {
		    for (var i: int = 0; i < this._pRoutes.length; ++ i) {
		        if (this._pRoutes[i]) {
		            this.graph.routing(this._pRoutes[i]);
		        }
		    }
		}

		addRoute(pRoute: IUIGraphRoute, iConnection: int): void {
		    this._pRoutes[iConnection] = pRoute;
		    pRoute.activate(this.isActive());
		}

		findRoute(pTarget: IUIGraphNode): int {
		    for (var i: int = 0; i < this._pRoutes.length; i++) {
		        if (isNull(this._pRoutes[i])) {
		            continue;
		        }
		        
		        if (this._pRoutes[i].left === pTarget || this._pRoutes[i].right === pTarget) {
		            return i;
		        }
		    };

		    return UIGRAPH_INVALID_ROUTE;
		}

		getRoute(i): IUIGraphRoute {
		    return this._pRoutes[i];
		};

		BROADCAST(routeBreaked, CALL(route, connection, dir));
		BROADCAST(beforeDestroy, CALL(node));
	}

	Component.register("GraphNode", Node);
}

#endif

