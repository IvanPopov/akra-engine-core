#ifndef IUICONNECTIONAREA_TS
#define IUICONNECTIONAREA_TS

#include "IUIPanel.ts"

module akra {
	IFACE(IUIGraphConnector);
	IFACE(IUIGraphNode);
	IFACE(IUIGraphRoute);

	export interface IUIConnectionAreaOptions extends IUIComponentOptions {
		maxConnections?: uint;
		maxInConnections?: uint;
		maxOutConnections?: uint;
	}

	export interface IUIGraphConnectionArea extends IUIPanel {
		readonly connectors: IUIGraphConnector[];
		readonly node: IUIGraphNode;

		maxInConnections: uint;
		maxOutConnections: uint;
		maxConnections: uint;

		connectorsCount(eDir?: EUIGraphDirections): uint;

		findRoute(pNode: IUIGraphNode): IUIGraphRoute;

		setMode(iMode: int): void;
		isSupportsIncoming(): bool;
		isSupportsOutgoing(): bool;
		hasConnections(): bool;

		routing(): void;

		activate(bValue?: bool): void;
		isActive(): bool;

		sendEvent(e: IUIGraphEvent): void;

		signal connected(pFrom: IUIGraphConnector, pTo: IUIGraphConnector): void;
	}
}

#endif


