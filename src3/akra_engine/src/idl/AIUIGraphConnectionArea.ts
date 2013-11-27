#ifndef IUICONNECTIONAREA_TS
#define IUICONNECTIONAREA_TS

/// <reference path="AIUIPanel.ts" />


/// <reference path="AIUIGraphConnector.ts" />
/// <reference path="AIUIGraphNode.ts" />
/// <reference path="AIUIGraphRoute.ts" />

interface IUIConnectionAreaOptions extends AIUIComponentOptions {
	maxConnections?: uint;
	maxInConnections?: uint;
	maxOutConnections?: uint;
}

interface AIUIGraphConnectionArea extends AIUIPanel {
	/** readonly */ connectors: AIUIGraphConnector[];
	/** readonly */ node: AIUIGraphNode;

	maxInConnections: uint;
	maxOutConnections: uint;
	maxConnections: uint;

	connectorsCount(eDir?: AEUIGraphDirections): uint;

	findRoute(pNode: AIUIGraphNode): AIUIGraphRoute;

	setMode(iMode: int): void;
	isSupportsIncoming(): boolean;
	isSupportsOutgoing(): boolean;
	hasConnections(): boolean;

	prepareForConnect(): AIUIGraphConnector;

	routing(): void;

	activate(bValue?: boolean): void;
	isActive(): boolean;

	sendEvent(e: AIUIGraphEvent): void;

	signal connected(pFrom: AIUIGraphConnector, pTo: AIUIGraphConnector): void;
}