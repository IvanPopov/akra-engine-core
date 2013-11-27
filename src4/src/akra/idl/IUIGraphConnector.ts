// IUIGraphConnector export interface
// [write description here...]

/// <reference path="IUIComponent.ts" />

#define UIGRAPH_FLOATING_INPUT -1

module akra {
IFACE (IUIGraphNode);

export enum EGraphConnectorOrient {
	UNKNOWN,
	UP,
	DOWN,
	LEFT,
	RIGHT
}

export interface IUIGraphConnector extends IUIComponent {
	route: IUIGraphRoute;
	orient: EGraphConnectorOrient;
	
	/** readonly */ area: IUIGraphConnectionArea;
	/** readonly */ node: IUIGraphNode;
	/** readonly */ graph: IUIGraph;
	/** readonly */ direction: EUIGraphDirections;

	isActive(): boolean;

	activate(bValue?: boolean): void;

	hasRoute(): boolean;
	
	/** Mark as input connecotr */
	input(): boolean;
	/** Mark as output connector */
	output(): boolean;

	/** Mark connector as input/output */
	//setDirection(eDir: EUIGraphDirections): boolean;

	highlight(bToogle?: boolean): void;
	
	routing(): void;

	sendEvent(e: IUIGraphEvent): void;

	signal activated(bValue: boolean): void;
	signal routeBreaked(pRoute: IUIGraphRoute): void;
	signal connected(pTarget: IUIGraphConnector);
}
}

#endif