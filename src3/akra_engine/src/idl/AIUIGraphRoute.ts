// AIUIGraphRoute interface
// [write description here...]

#define UIGRAPH_INVALID_ROUTE -1


/// <reference path="AIUIGraphConnector.ts" />
/// <reference path="AIUIGraphEvent.ts" />
/// <reference path="AIColor.ts" />

interface AIUIGraphRoute {
	left: AIUIGraphConnector;
	right: AIUIGraphConnector;
	path: RaphaelPath;
	color: AIColor;
	enabled: boolean;

	isConnectedWithNode(pNode: AIUIGraphNode): boolean;
	isConnectedWith(pConnector: AIUIGraphConnector): boolean;
	isBridge(): boolean;

	sendEvent(e: AIUIGraphEvent): void;

	//silent remove connectors
	detach(): void;
	isActive(): boolean;

	activate(bValue?: boolean): void;
	remove(bRecirsive?: boolean): void;
	destroy(): void;
	
	routing(): void;
}

interface IUITempGraphRoute extends AIUIGraphRoute {
	routing(pRight?: AIPoint): void;
}