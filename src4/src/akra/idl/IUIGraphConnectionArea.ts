#ifndef IUICONNECTIONAREA_TS
#define IUICONNECTIONAREA_TS

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
		/** readonly */ connectors: IUIGraphConnector[];
		/** readonly */ node: IUIGraphNode;
	
		maxInConnections: uint;
		maxOutConnections: uint;
		maxConnections: uint;
	
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
	
		signal connected(pFrom: IUIGraphConnector, pTo: IUIGraphConnector): void;
	}
}
