// AIUIGraphNode interface
// [write description here...]

/// <reference path="AIUIComponent.ts" />


/// <reference path="AIUIGraph.ts" />
/// <reference path="AIUIGraphRoute.ts" />
/// <reference path="AIUIGraphConnectionArea.ts" />

enum AEUIGraphNodes {
	UNKNOWN,
	
	ANIMATION_DATA,
	ANIMATION_PLAYER,
	ANIMATION_BLENDER,
	ANIMATION_MASK
}

interface AIGraphNodeAreaMap {
	[name: string]: AIUIGraphConnectionArea;
}


interface AIUIGraphNode extends AIUIComponent {
	/** readonly */ graphNodeType: AEUIGraphNodes;
	/** readonly */ graph: AIUIGraph;
	/** readonly */ areas: AIGraphNodeAreaMap;

	getOutputConnector(): AIUIGraphConnector;
	getInputConnector(): AIUIGraphConnector;

	findRoute(pNode: AIUIGraphNode): AIUIGraphRoute;
	isConnectedWith(pNode: AIUIGraphNode): boolean;

	activate(bState?: boolean): void;
	isActive(): boolean;

	isSuitable(): boolean;

	sendEvent(e: AIUIGraphEvent): void;
	highlight(bValue?: boolean);
	canAcceptConnect(): boolean;

	
	routing(): void;

	signal selected(bModified: boolean): void;
	signal beforeDestroy(): void;
}