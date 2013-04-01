#ifndef IUIGRAPHROUTE_TS
#define IUIGRAPHROUTE_TS

#define UIGRAPH_INVALID_ROUTE -1

module akra {
	IFACE(IUIGraphConnector);
	IFACE(IUIGraphEvent);
	IFACE(IColor);
	IFACE(RaphaelPath);

	export interface IUIGraphRoute {
		left: IUIGraphConnector;
		right: IUIGraphConnector;
		path: RaphaelPath;
		color: IColor;

		isConnectedWithNode(pNode: IUIGraphNode): bool;
		isConnectedWith(pConnector: IUIGraphConnector): bool;
		isBridge(): bool;

		sendEvent(e: IUIGraphEvent): void;

		//silent remove connectors
		detach(): void;
		isActive(): bool;

		activate(bValue?: bool): void;
		remove(bRecirsive?: bool): void;
		destroy(): void;
		
		routing(): void;
	}

	export interface IUITempGraphRoute extends IUIGraphRoute {
		routing(pRight?: IPoint): void;
	}
}

#endif
