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

		inline get connectors(): IUIGraphConnector[] {
			return this._pConnectors;
		}

		inline get node(): IUIGraphNode { return <IUIGraphNode>this.parent; }
		inline get graph(): IUIGraph { return this.node.graph; }

		constructor(parent: IUIGraphNode, options?: IUIConnectionAreaOptions, eType: EUIComponents = EUIComponents.GRAPH_CONNECTIONAREA) {
			super(parent, options, eType);

			this.connect(this.node, SIGNAL(mouseenter), SLOT(_onNodeMouseover));
			this.connect(this.node, SIGNAL(mouseleave), SLOT(_onNodeMouseout));

			if (!isNull(options) && isInt((<IUIConnectionAreaOptions>options).maxConnections)) {
				this._iConnectionLimit = options.maxConnections;
			}

			LOG("connection limit is: ", this._iConnectionLimit);
		}

		inline setMode(iMode: int) {
			this._iMode = iMode;
		}

		inline isSupportsIncoming(): bool {
			return !this.isLimitReached() && TEST_ANY(this._iMode, EUIGraphDirections.IN);
		}

		inline isSupportsOutgoing(): bool {
			return !this.isLimitReached() && TEST_ANY(this._iMode, EUIGraphDirections.OUT);
		}

		inline isLimitReached(): bool {
			return this._iConnectionLimit != -1 && this._pConnectors.length >= this._iConnectionLimit;
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
			if (!this.isSupportsIncoming() && this.graph.isReadyForConnect()) {
				return;
			}

			if (!this.isSupportsOutgoing()) {
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
	}

	register("GraphConnectionArea", ConnectionArea);
}

#endif
