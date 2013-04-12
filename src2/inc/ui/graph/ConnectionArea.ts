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

		inline set maxInConnections(n: uint) {
			this._iInConnectionLimit = n;
		}

		inline set maxOutConnections(n: uint) {
			this._iOutConnectionLimit = n;
		}

		inline set maxConnections(n: uint) {
			this._iConnectionLimit = n;
		}

		constructor(parent, options?: IUIConnectionAreaOptions, eType: EUIComponents = EUIComponents.GRAPH_CONNECTIONAREA) {
			super(parent, options, eType);

			if (!isNull(options)) {
				this._iConnectionLimit = isInt((<IUIConnectionAreaOptions>options).maxConnections)? options.maxConnections: -1;
				this._iInConnectionLimit = isInt((<IUIConnectionAreaOptions>options).maxInConnections)? options.maxInConnections: MAX_INT8;
				this._iOutConnectionLimit = isInt((<IUIConnectionAreaOptions>options).maxOutConnections)? options.maxOutConnections: MAX_INT8;
			}

			if (this._iConnectionLimit == -1) {
				this._iConnectionLimit = this._iInConnectionLimit + this._iOutConnectionLimit;
			}

			this.el.disableSelection();
		}

		attachToParent(pParent: IUIGraphNode): bool {
			ASSERT(isComponent(pParent, EUIComponents.GRAPH_NODE), "only graph node can be parent!!");
			if (super.attachToParent(pParent)) {
				this.connect(this.node, SIGNAL(mouseenter), SLOT(_onNodeMouseover));
				this.connect(this.node, SIGNAL(mouseleave), SLOT(_onNodeMouseout));
			}

			return false;
		}

		_createdFrom($comp: JQuery): void {
			super._createdFrom($comp);

			var sMode: string = $comp.attr("mode");
			var sMaxConnections: string = $comp.attr("connections-limit");
			var sMaxInConnections: string = $comp.attr("connections-in-limit");
			var sMaxOutConnections: string = $comp.attr("connections-out-limit");

			if (isString(sMode)) {
				if (sMode === "out") {
					this.setMode(EUIGraphDirections.OUT);
				}
				else if (sMode === "in") {
					this.setMode(EUIGraphDirections.IN);	
				}
				else if (sMode === "inout") {
					this.setMode(EUIGraphDirections.IN|EUIGraphDirections.OUT);
				}
			}

			if (isString(sMaxConnections)) {
				this.maxConnections = parseInt(sMaxConnections);
			}

			if (isString(sMaxInConnections)) {
				this.maxConnections = parseInt(sMaxInConnections);
			}

			if (isString(sMaxOutConnections)) {
				this.maxConnections = parseInt(sMaxOutConnections);
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
			//FIXME
			var pArea: ConnectionArea = this;
			setTimeout(() => {pArea.routing()}, 10);

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

			this.connected(pConnector, pTarget);
		}

		private destroyTempConnect(): void {
			this._pTempConnect.destroy();
			this._pTempConnect = null;
		}

		_onNodeMouseout(pNode: IUIGraphNode, e: IUIEvent): void {
			//FIXME
			var pArea: ConnectionArea = this;
			setTimeout(() => {pArea.routing()}, 10);
			
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

		rendered(): void {
			super.rendered();
			this.el.addClass("component-connectionarea");
		}

		BROADCAST(connected, CALL(pFrom, pTo));
	}

	export inline function isConnectionArea(pEntity: IEntity): bool {
		return isComponent(pEntity, EUIComponents.GRAPH_CONNECTIONAREA);
	}

	register("GraphConnectionArea", ConnectionArea);
}

#endif
