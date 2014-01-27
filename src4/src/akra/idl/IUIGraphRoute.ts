//#define UIGRAPH_INVALID_ROUTE -1

/// <reference path="IUIGraphConnector.ts" />
/// <reference path="IColor.ts" />

module akra {
	export interface IUIGraphRoute {
		left: IUIGraphConnector;
		right: IUIGraphConnector;
		path: RaphaelPath;
		color: IColor;
		enabled: boolean;
	
		isConnectedWithNode(pNode: IUIGraphNode): boolean;
		isConnectedWith(pConnector: IUIGraphConnector): boolean;
		isBridge(): boolean;
	
		sendEvent(e: IUIGraphEvent): void;
	
		//silent remove connectors
		detach(): void;
		isActive(): boolean;
	
		activate(bValue?: boolean): void;
		remove(bRecirsive?: boolean): void;
		destroy(): void;
		
		routing(): void;
	}
	
	export interface IUITempGraphRoute extends IUIGraphRoute {
		routing(pRight?: IPoint): void;
	}
}
