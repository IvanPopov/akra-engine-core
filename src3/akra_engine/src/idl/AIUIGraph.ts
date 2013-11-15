// AIUIGraph interface
// [write description here...]

/// <reference path="AIUIComponent.ts" />


/// <reference path="AIUIGraphConnector.ts" />
/// <reference path="AIUIGraphRoute.ts" />

enum AEUIGraphDirections {
	IN = 0x01,
	OUT = 0x02
}

enum AEUIGraphTypes {
	UNKNOWN,
	ANIMATION
}

enum AEUIGraphEvents {
	UNKNOWN,
	DELETE,
	SHOW_MAP,
	HIDE_MAP
}

interface AIUIGraphEvent {
	type: AEUIGraphEvents;
	traversedRoutes: AIUIGraphRoute[];
}

interface AIUIGraph extends AIUIComponent {
	/** readonly */ graphType: AEUIGraphTypes;
	/** readonly */ nodes: AIUIGraphNode[];
	/** readonly */ canvas: RaphaelPaper;

	createRouteFrom(pConnector: AIUIGraphConnector): void;
	removeTempRoute(): void;
	connectTo(pConnector: AIUIGraphConnector): void;

	isReadyForConnect(): boolean;
}