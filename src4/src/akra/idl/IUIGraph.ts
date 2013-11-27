
/// <reference path="IUIComponent.ts" />


/// <reference path="IUIGraphConnector.ts" />
/// <reference path="IUIGraphRoute.ts" />

module akra {
	export enum EUIGraphDirections {
		IN = 0x01,
		OUT = 0x02
	}
	
	export enum EUIGraphTypes {
		UNKNOWN,
		ANIMATION
	}
	
	export enum EUIGraphEvents {
		UNKNOWN,
		DELETE,
		SHOW_MAP,
		HIDE_MAP
	}
	
	export interface IUIGraphEvent {
		type: EUIGraphEvents;
		traversedRoutes: IUIGraphRoute[];
	}
	
	export interface IUIGraph extends IUIComponent {
		/** readonly */ graphType: EUIGraphTypes;
		/** readonly */ nodes: IUIGraphNode[];
		/** readonly */ canvas: RaphaelPaper;
	
		createRouteFrom(pConnector: IUIGraphConnector): void;
		removeTempRoute(): void;
		connectTo(pConnector: IUIGraphConnector): void;
	
		isReadyForConnect(): boolean;
	}
}
