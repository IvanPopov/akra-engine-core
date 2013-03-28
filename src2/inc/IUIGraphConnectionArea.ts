#ifndef IUICONNECTIONAREA_TS
#define IUICONNECTIONAREA_TS

#include "IUIPanel.ts"

module akra {
	IFACE(IUIGraphConnector);
	IFACE(IUIGraphNode);

	export interface IUIConnectionAreaOptions extends IUIComponentOptions {
		maxConnections?: uint;
	}

	export interface IUIGraphConnectionArea extends IUIPanel {
		readonly connectors: IUIGraphConnector[];
		readonly node: IUIGraphNode;

		setMode(iMode: int): void;
		isSupportsIncoming(): bool;
		isSupportsOutgoing(): bool;
		hasConnections(): bool;

		routing(): void;

		activate(bValue?: bool): void;
		isActive(): bool;

		sendEvent(e: IUIGraphEvent): void;
	}
}

#endif


