/// <reference path="../../../build/akra.d.ts" />

/// <reference path="IUIGraphConnector.ts" />

module akra {
	export interface IUIGraphRoute {
		getPath(): RaphaelPath;
		setPath(pPath: RaphaelPath): void;

		getLeft(): IUIGraphConnector;
		setLeft(pConnector: IUIGraphConnector): void;
		getRight(): IUIGraphConnector;
		setRight(pConnector: IUIGraphConnector): void;
		getColor(): IColor;
		isEnabled(): boolean;
		setEnabled(bValue: boolean): void;
	
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
