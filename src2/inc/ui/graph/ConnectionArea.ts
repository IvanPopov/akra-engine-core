#ifndef UIGRAPHCONNECTIONAREA_TS
#define UIGRAPHCONNECTIONAREA_TS

#include "IUIGraphConnectionArea.ts"
#include "../Panel.ts" 

module akra.ui.graph {
	export class ConnectionArea extends Panel implements IUIGraphConnectionArea {
		protected _iMode: int = EUIGraphDirections.IN | EUIGraphDirections.OUT;
		protected _pConnectors: IUIGraphConnector[] = new Connector[];
		protected _pTempConnect: IUIGraphConnector = null;
		protected _iConnectionLimit: int = -1;
		protected _iInConnectionLimit: int = MAX_INT8;
		protected _iOutConnectionLimit: uint = MAX_INT8;

		inline get connectors(): IUIGraphConnector[] {
			return this._pConnectors;
		}

		inline get node(): IUIGraphNode { return <IUIGraphNode>this.parent; }
		inline get graph(): IUIGraph { return this.node.graph; }

		constructor(parent: IUIGraphNode, options?: IUIConnectionAreaOptions, eType: EUIComponents = EUIComponents.GRAPH_CONNECTIONAREA) {
			super(parent, options, eType);

			this.connect(this.node, SIGNAL(mouseenter), SLOT(_onNodeMouseover));
			this.connect(this.node, SIGNAL(mouseleave), SLOT(_onNodeMouseout));

			if (!isNull(options)) {
				this._iConnectionLimit = isInt((<IUIConnectionAreaOptions>options).maxConnections)? options.maxConnections: -1;
				this._iInConnectionLimit = isInt((<IUIConnectionAreaOptions>options).maxInConnections)? options.maxInConnections: MAX_INT8;
				this._iOutConnectionLimit = isInt((<IUIConnectionAreaOptions>options).maxOutConnections)? options.maxOutConnections: MAX_INT8;
			}

			if (this._iConnectionLimit == -1) {
				this._iConnectionLimit = this._iInConnectionLimit + this._iOutConnectionLimit;
			}
		}

		findRoute(pNode: IUIGraphNode): IUIGraphRoute {
			for (var i: int = 0; i < this._pConnectors.length; ++ i) {
				var pRoute: IUIGraphRoute = this._pConnectors[i].route;
				if (pRoute.isConnectedWithNode(pNode)) {
					return pRoute;
				}
			}

			return null;
		}

		connectorsCount(eDir?: EUIGraphDirections): uint { 
			if (arguments.length === 0) {
				return this._pConnectors.length;
			}

			var n: uint = 0;

			for (var i = 0; i < this._pConnectors.length; ++ i) {
				if (this._pConnectors[i].direction === eDir) {
					n ++;
				}
			}

			return n;
		}

		inline setMode(iMode: int) {
			this._iMode = iMode;
		}

		inline isSupportsIncoming(): bool {
			return this.connectorsCount(EUIGraphDirections.IN) < this._iInConnectionLimit && 
				TEST_ANY(this._iMode, EUIGraphDirections.IN) && !this.isLimitReached();
		}

		inline isSupportsOutgoing(): bool {
			return this.connectorsCount(EUIGraphDirections.OUT) < this._iOutConnectionLimit && 
				TEST_ANY(this._iMode, EUIGraphDirections.OUT) && !this.isLimitReached();
		}

		inline isLimitReached(): bool {
			return this._pConnectors.length >= this._iConnectionLimit;
		}

		hasConnections(): bool {
			return !(this.connectors.length == 0 || isNull(this.connectors[0]));
		}

		isActive(): bool {
			return this.node.isActive();
		}

		activate(bValue: bool = true): void {
			for (var i: int = 0; i < this._pConnectors.length; ++ i) {
				this._pConnectors[i].activate(bValue);
			}
		}

		sendEvent(e: IUIGraphEvent): void {
			for (var i = 0; i < this._pConnectors.length; ++ i) {
	        	if (this._pConnectors[i].direction === EUIGraphDirections.OUT) {
					this._pConnectors[i].route.sendEvent(e);
				}
			}
		
			if (e.type === EUIGraphEvents.DELETE) {
		        if (this.isActive()) {
		            this.destroy();
		        }
		    }
		}

		_onNodeMouseover(pNode: IUIGraphNode, e: IUIEvent): void {
			if ((!this.isSupportsIncoming() && this.graph.isReadyForConnect()) || 
				(!this.isSupportsOutgoing() && !this.graph.isReadyForConnect())) {
				return;
			}

			if (!isNull(this._pTempConnect)) {
				return;
			}

			var pConnector: IUIGraphConnector = this._pTempConnect = new Connector(this);
			//this.graph.isReadyForConnect()? pConnector.input(): pConnector.output();
			this.connect(pConnector, SIGNAL(routeBreaked), SLOT(destroyTempConnect));
			this.connect(pConnector, SIGNAL(connected), SLOT(onConnection));
		}

		private onConnection(pConnector: IUIGraphConnector, pTarget: IUIGraphConnector): void {
			debug_assert(pConnector === this._pTempConnect, "oO!!");
			// LOG("connected!! node(" + this.node.getGuid() + ") connector(" + pConnector.getGuid() + ")");
			this.disconnect(pConnector, SIGNAL(connected), SLOT(onConnection));
			this._pTempConnect = null;
			this._pConnectors.push(pConnector);

			this.connected(pConnector.node, pConnector.route);
		}

		private destroyTempConnect(): void {
			this._pTempConnect.destroy();
			this._pTempConnect = null;
		}

		_onNodeMouseout(pNode: IUIGraphNode, e: IUIEvent): void {
			if (isNull(this._pTempConnect) || this._pTempConnect.hasRoute()) {
				return;
			}

			this.destroyTempConnect();
		}

		
		inline routing(): void {
			for (var i = 0; i < this._pConnectors.length; ++ i) {
				this._pConnectors[i].routing();
			}
		}

		BROADCAST(connected, CALL(pNode, pRoute));
	}

	register("GraphConnectionArea", ConnectionArea);
}

#endif
