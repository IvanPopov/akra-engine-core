// AIUIGraphConnector interface
// [write description here...]

/// <reference path="AIUIComponent.ts" />

#define UIGRAPH_FLOATING_INPUT -1

module akra {
IFACE (AIUIGraphNode);

enum AEGraphConnectorOrient {
	UNKNOWN,
	UP,
	DOWN,
	LEFT,
	RIGHT
}

interface AIUIGraphConnector extends AIUIComponent {
	route: AIUIGraphRoute;
	orient: AEGraphConnectorOrient;
	
	/** readonly */ area: AIUIGraphConnectionArea;
	/** readonly */ node: AIUIGraphNode;
	/** readonly */ graph: AIUIGraph;
	/** readonly */ direction: AEUIGraphDirections;

	isActive(): boolean;

	activate(bValue?: boolean): void;

	hasRoute(): boolean;
	
	/** Mark as input connecotr */
	input(): boolean;
	/** Mark as output connector */
	output(): boolean;

	/** Mark connector as input/output */
	//setDirection(eDir: AEUIGraphDirections): boolean;

	highlight(bToogle?: boolean): void;
	
	routing(): void;

	sendEvent(e: AIUIGraphEvent): void;

	signal activated(bValue: boolean): void;
	signal routeBreaked(pRoute: AIUIGraphRoute): void;
	signal connected(pTarget: AIUIGraphConnector);
}
}

#endif