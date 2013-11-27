
/// <reference path="IUIComponent.ts" />


/// <reference path="IUIGraph.ts" />
/// <reference path="IUIGraphRoute.ts" />
/// <reference path="IUIGraphConnectionArea.ts" />

module akra {
	export enum EUIGraphNodes {
		UNKNOWN,
		
		ANIMATION_DATA,
		ANIMATION_PLAYER,
		ANIMATION_BLENDER,
		ANIMATION_MASK
	}
	
	export interface IGraphNodeAreaMap {
		[name: string]: IUIGraphConnectionArea;
	}
	
	
	export interface IUIGraphNode extends IUIComponent {
		/** readonly */ graphNodeType: EUIGraphNodes;
		/** readonly */ graph: IUIGraph;
		/** readonly */ areas: IGraphNodeAreaMap;
	
		getOutputConnector(): IUIGraphConnector;
		getInputConnector(): IUIGraphConnector;
	
		findRoute(pNode: IUIGraphNode): IUIGraphRoute;
		isConnectedWith(pNode: IUIGraphNode): boolean;
	
		activate(bState?: boolean): void;
		isActive(): boolean;
	
		isSuitable(): boolean;
	
		sendEvent(e: IUIGraphEvent): void;
		highlight(bValue?: boolean);
		canAcceptConnect(): boolean;
	
		
		routing(): void;
	
		signal selected(bModified: boolean): void;
		signal beforeDestroy(): void;
	}
}
