/// <reference path="../../idl/IUIGraphConnectionArea.ts" />
/// <reference path="../../idl/IUIGraphConnector.ts" />
/// <reference path="../../idl/IUIGraph.ts" />
/// <reference path="../../idl/IUIGraphNode.ts" />
/// <reference path="../Panel.ts" />
/// <reference path="Connector.ts" />

module akra.ui.graph {
	export class ConnectionArea extends Panel implements IUIGraphConnectionArea {
		protected _iMode: int = EUIGraphDirections.IN | EUIGraphDirections.OUT;
		protected _pConnectors: IUIGraphConnector[] = new Connector[];
		protected _pTempConnect: IUIGraphConnector = null;
		protected _iConnectionLimit: int = -1;
		protected _iInConnectionLimit: int = MAX_INT8;
		protected _iOutConnectionLimit: uint = MAX_INT8;
		protected _eConectorOrient: EGraphConnectorOrient = EGraphConnectorOrient.UNKNOWN;

		 get connectors(): IUIGraphConnector[] {
			return this._pConnectors;
		}

		 get node(): IUIGraphNode { return <IUIGraphNode>this.parent; }
		 get graph(): IUIGraph { return this.node.graph; }

		 set maxInConnections(n: uint) {
			this._iInConnectionLimit = n;
		}

		 set maxOutConnections(n: uint) {
			this._iOutConnectionLimit = n;
		}

		 set maxConnections(n: uint) {
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

		protected setupSignals(): void {
			this.connected = this.connected || new Signal(<any>this);
			super.setupSignals();
		}

		attachToParent(pParent: IUIGraphNode): boolean {
			logger.assert(isComponent(pParent, EUIComponents.GRAPH_NODE), "only graph node can be parent!!");
			if (super.attachToParent(pParent)) {
				//this.connect(this.node, SIGNAL(mouseenter), SLOT(_onNodeMouseover));
				this.node.mouseenter.connect(this, this._onNodeMouseover);
				//this.connect(this.node, SIGNAL(mouseleave), SLOT(_onNodeMouseout));
				this.node.mouseleave.connect(this, this._onNodeMouseout);
			}

			return false;
		}

		_createdFrom($comp: JQuery): void {
			super._createdFrom($comp);

			var sMode: string = $comp.attr("mode");
			var sMaxConnections: string = $comp.attr("connections-limit");
			var sMaxInConnections: string = $comp.attr("connections-in-limit");
			var sMaxOutConnections: string = $comp.attr("connections-out-limit");
			var sOrient: string = $comp.attr("orientation");

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

			if (isString(sOrient)) {
				switch (sOrient.toLowerCase()) {
					case "up": 
						this._eConectorOrient = EGraphConnectorOrient.UP;
						break;
					case "down": 
						this._eConectorOrient = EGraphConnectorOrient.DOWN;
						break;
					case "left": 
						this._eConectorOrient = EGraphConnectorOrient.LEFT;
						break;
					case "right": 
						this._eConectorOrient = EGraphConnectorOrient.RIGHT;
						break;
				}
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

		 setMode(iMode: int) {
			this._iMode = iMode;
		}

		 isSupportsIncoming(): boolean {
			return this.connectorsCount(EUIGraphDirections.IN) < this._iInConnectionLimit && 
				bf.testAny(this._iMode, EUIGraphDirections.IN) && !this.isLimitReached();
		}

		 isSupportsOutgoing(): boolean {
			return this.connectorsCount(EUIGraphDirections.OUT) < this._iOutConnectionLimit && 
				bf.testAny(this._iMode, EUIGraphDirections.OUT) && !this.isLimitReached();
		}

		 isLimitReached(): boolean {
			return this._pConnectors.length >= this._iConnectionLimit;
		}

		hasConnections(): boolean {
			return !(this.connectors.length == 0 || isNull(this.connectors[0]));
		}

		isActive(): boolean {
			return this.node.isActive();
		}

		activate(bValue: boolean = true): void {
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

		prepareForConnect(): IUIGraphConnector {
			var pConnector: IUIGraphConnector = this._pTempConnect = new Connector(this);
			pConnector.orient = this._eConectorOrient;
			//this.graph.isReadyForConnect()? pConnector.input(): pConnector.output();
			//this.connect(pConnector, SIGNAL(routeBreaked), SLOT(destroyTempConnect));
			pConnector.routeBreaked.connect(this, this.destroyTempConnect);
			//this.connect(pConnector, SIGNAL(connected), SLOT(onConnection));
			pConnector.connected.connect(this, this.onConnection);

			return pConnector;
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

			this.prepareForConnect();
		}

		private onConnection(pConnector: IUIGraphConnector, pTarget: IUIGraphConnector): void {
			debug.assert(pConnector === this._pTempConnect, "oO!!");
			// LOG("connected!! node(" + this.node.getGuid() + ") connector(" + pConnector.getGuid() + ")");
			//this.disconnect(pConnector, SIGNAL(connected), SLOT(onConnection));
			pConnector.connected.disconnect(this, this.onConnection);
			this._pTempConnect = null;
			this._pConnectors.push(pConnector);

			this.connected.emit(pConnector, pTarget);
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

		
		 routing(): void {
			for (var i = 0; i < this._pConnectors.length; ++ i) {
				this._pConnectors[i].routing();
			}
		}

		protected finalizeRender(): void {
			super.finalizeRender();
			this.el.addClass("component-connectionarea");
		}

		//BROADCAST(connected, CALL(pFrom, pTo));
		connected: ISignal<{ (pArea: IUIGraphConnectionArea, pFrom: IUIGraphConnector, pTo: IUIGraphConnector): void; }>;
	}

	export  function isConnectionArea(pEntity: IEntity): boolean {
		return isComponent(pEntity, EUIComponents.GRAPH_CONNECTIONAREA);
	}

	register("GraphConnectionArea", ConnectionArea);
}
