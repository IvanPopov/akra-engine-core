#ifndef UIGRAPHCONNECTIONAREA_TS
#define UIGRAPHCONNECTIONAREA_TS

#include "IUIGraphConnectionArea.ts"
#include "../Panel.ts" 

module akra.ui.graph {
	export class ConnectionArea extends Panel implements IUIGraphConnectionArea {
		protected _iMode: int = EUIGraphDirections.IN | EUIGraphDirections.OUT;
		protected _pConnectors: IUIGraphConnector[] = new Connector[];
		protected _pTempConnect: IUIGraphConnector = null;

		inline get connectors(): IUIGraphConnector[] {
			return this._pConnectors;
		}

		inline get node(): IUIGraphNode { return <IUIGraphNode>this.parent; }
		inline get graph(): IUIGraph { return this.node.graph; }

		constructor(parent: IUIGraphNode, options?, eType: EUIComponents = EUIComponents.GRAPH_CONNECTIONAREA) {
			super(parent, options, eType);

			this.connect(this.node, SIGNAL(mouseenter), SLOT(_onNodeMouseover));
			this.connect(this.node, SIGNAL(mouseleave), SLOT(_onNodeMouseout));

			// this.disableEvent("mouseover");
			// this.disableEvent("mouseout");
		}

		inline setMode(iMode: int) {
			this._iMode = iMode;
		}

		inline isSupportsIncoming(): bool {
			return TEST_ANY(this._iMode, EUIGraphDirections.IN);
		}

		inline isSupportsOutgoing(): bool {
			return TEST_ANY(this._iMode, EUIGraphDirections.OUT);
		}

		hasConnections(): bool {
			return !(this.connectors.length == 0 || isNull(this.connectors[0]));
		}

		isActive(): bool {
			return this.node.isActive();
		}

		activate(): void {
			for (var i: int = 0; i < this._pConnectors.length; ++ i) {
				this._pConnectors[i].activate();
			}
		}

		grabEvent(iKeyCode: int): void {

		}

		_onNodeMouseover(pNode: IUIGraphNode, e: IUIEvent): void {
			if (!this.isSupportsIncoming() && this.graph.isReadyForConnect()) {
				return;
			}

			if (!isNull(this._pTempConnect)) {
				return;
			}

			var pConnector: IUIGraphConnector = this._pTempConnect = new Connector(this);
			this.connect(pConnector, SIGNAL(routeBreaked), SLOT(destroyTempConnect));
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

		
		inline routing(pConnector?: IUIGraphConnector): void {
			this.node.routing(pConnector, this);
		}
	}

	register("GraphConnectionArea", ConnectionArea);
}

#endif
