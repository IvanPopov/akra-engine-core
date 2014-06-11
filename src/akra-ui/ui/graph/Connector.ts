/// <reference path="../../idl/IUIGraph.ts" />
/// <reference path="../../idl/IUIGraphNode.ts" />
/// <reference path="../../idl/IUIGraphConnector.ts" />
/// <reference path="../../idl/IUIGraphConnectionArea.ts"/>
/// <reference path="../Component.ts" />

module akra.ui.graph {
	class ConnectedSignal extends Signal<IUIGraphConnector> {
		emit(pTarget: IUIGraphConnector): void {
			this.getSender().getElement().addClass("connected");
			super.emit(pTarget);
		}
	}

	class MousedownSignal extends Signal<IUIGraphConnector> {
		emit(e: IUIEvent): void {
			var pConnector: IUIGraphConnector = this.getSender();

			e.preventDefault();
			e.stopPropagation();

			if (!isNull(pConnector.getRoute())) {
				return;
			}

			pConnector.getGraph().createRouteFrom(pConnector);
		}
	}

	class MouseupSignal extends Signal<IUIGraphConnector> {
		emit(e: IUIEvent): void {
			var pConnector: IUIGraphConnector = this.getSender();

			if (pConnector.getDirection() === EUIGraphDirections.IN && !pConnector.isConnected() && pConnector.getNode().isSuitable()) {
				e.stopPropagation();
				pConnector.getGraph().connectTo(pConnector);
			}
		}
	}



	export class Connector extends Component implements IUIGraphConnector {
		protected _eOrient: EGraphConnectorOrient = EGraphConnectorOrient.UNKNOWN;
		protected _eDirect: EUIGraphDirections = EUIGraphDirections.IN;
		protected _bActive: boolean = false;
		protected _pRoute: IUIGraphRoute = null;


		getOrient(): EGraphConnectorOrient { return this._eOrient; }
		getArea(): IUIGraphConnectionArea { return (<IUIGraphConnectionArea>this.getParent().getParent()); }
		getNode(): IUIGraphNode { return this.getArea().getNode(); }
		getGraph(): IUIGraph { return this.getNode().getGraph(); }
		getRoute(): IUIGraphRoute { return this._pRoute; }
		getDirection(): EUIGraphDirections { return this._eDirect; }

		setOrient(e: EGraphConnectorOrient) {
			this._eOrient = e;
		}

		setRoute(pRoute: IUIGraphRoute) {
			this._pRoute = pRoute;

			if (pRoute.isBridge()) {

				if (this === pRoute.getLeft()) {
					this.output();
					this.connected.emit(pRoute.getRight());
				}
				else {
					this.input();
					this.connected.emit(pRoute.getLeft());
				}
			}
		}

		constructor(parent, options?) {
			super(parent, options, EUIComponents.GRAPH_CONNECTOR);

			this.handleEvent("mousedown mouseup");
			this.getElement().disableSelection();
		}

		protected setupSignals(): void {
			this.mouseup = this.mouseup || new MouseupSignal(this);
			this.mousedown = this.mousedown || new MousedownSignal(this);

			this.activated = this.activated || new Signal(this);
			this.connected = this.connected || new ConnectedSignal(this);
			this.routeBreaked = this.routeBreaked || new Signal(this);
			super.setupSignals();
		}




		hasRoute(): boolean {
			return !isNull(this.getRoute());
		}

		protected finalizeRender(): void {
			super.finalizeRender();
			this.getElement().addClass("component-graphconnector");
		}

		isConnected(): boolean {
			return !isNull(this.getRoute()) && this.getRoute().isBridge();
		}

		isActive(): boolean {
			return this._bActive;
		}

		activate(bValue: boolean = true): void {
			if (this.isActive() === bValue) {
				return;
			}

			this._bActive = bValue;
			this.activated.emit(bValue);
			this.highlight(bValue);

			this.getRoute().activate(bValue);
		}

		sendEvent(e: IUIGraphEvent): void {
			this.getNode().sendEvent(e);
		}

		input(): boolean {
			this.getElement().addClass("in");
			this._eDirect = EUIGraphDirections.IN;
			return true;
		}

		output(): boolean {
			this.getElement().addClass("out");
			this._eDirect = EUIGraphDirections.OUT;
			return true;
		}

		// setDirection(eDirect: EUIGraphDirections): boolean {
		// 	return (eDirect === EUIGraphDirections.IN? this.input(): this.output());
		// }

		highlight(bToggle: boolean = false): void {
			bToggle ? this.$element.addClass("highlight") : this.$element.removeClass("highlight");
		}


		routing(): void {
			// LOG("routing");
			this.getRoute().routing();
		}


		activated: ISignal<{ (pConnector: IUIGraphConnector, bValue: boolean): void; }>;
		connected: ISignal<{ (pConnector: IUIGraphConnector, pTarget: IUIGraphConnector): void; }>;
		routeBreaked: ISignal<{ (pConnector: IUIGraphConnector, pRoute: IUIGraphRoute): void; }>;

		static UIGRAPH_INVALID_CONNECTION = -1;

		static ConnectedSignal: typeof Signal = ConnectedSignal;
		static MousedownSignal: typeof Signal = MousedownSignal;
		static MouseupSignal: typeof Signal = MouseupSignal;
	}

	register("GraphConnector", Connector);

}
