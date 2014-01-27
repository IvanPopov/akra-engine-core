/// <reference path="IUIPanel.ts" />
/// <reference path="IUIGraphConnector.ts" />
/// <reference path="IUIGraphNode.ts" />
/// <reference path="IUIGraphRoute.ts" />

module akra {
	export interface IUIConnectionAreaOptions extends IUIComponentOptions {
		maxConnections?: uint;
		maxInConnections?: uint;
		maxOutConnections?: uint;
	}
	
	export interface IUIGraphConnectionArea extends IUIPanel {
		getConnectors(): IUIGraphConnector[];
		getNode(): IUIGraphNode;

		setMaxInConnections(nValue: uint): void;
		setMaxOutConnections(nValue: uint): void;
		setMaxConnections(nValue: uint): void;

		connectorsCount(eDir?: EUIGraphDirections): uint;

		findRoute(pNode: IUIGraphNode): IUIGraphRoute;

		setMode(iMode: int): void;
		isSupportsIncoming(): boolean;
		isSupportsOutgoing(): boolean;
		hasConnections(): boolean;

		prepareForConnect(): IUIGraphConnector;

		routing(): void;

		activate(bValue?: boolean): void;
		isActive(): boolean;

		sendEvent(e: IUIGraphEvent): void;

		connected: ISignal<{ (pArea: IUIGraphConnectionArea, pFrom: IUIGraphConnector, pTo: IUIGraphConnector): void; }>;
	}
}
