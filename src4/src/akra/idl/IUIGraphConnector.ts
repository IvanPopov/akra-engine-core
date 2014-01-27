// IUIGraphConnector export interface
// [write description here...]

/// <reference path="IUIComponent.ts" />
/// <reference path="IUIGraphNode.ts" />

//#define UIGRAPH_FLOATING_INPUT -1

module akra {

	export var UIGRAPH_FLOATING_INPUT = -1;



	export enum EGraphConnectorOrient {
		UNKNOWN,
		UP,
		DOWN,
		LEFT,
		RIGHT
	}

	export interface IUIGraphConnector extends IUIComponent {
		getRoute(): IUIGraphRoute;
		setRoute(pValue: IUIGraphRoute): void;
		getOrient(): EGraphConnectorOrient;
		setOrient(eValue: EGraphConnectorOrient): void;

		getArea(): IUIGraphConnectionArea;
		getNode(): IUIGraphNode;
		getGraph(): IUIGraph;
		getDirection(): EUIGraphDirections;

		isActive(): boolean;
		isConnected(): boolean;

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

		activated: ISignal<{ (pConnector: IUIGraphConnector, bValue: boolean): void; }>;
		connected: ISignal<{ (pConnector: IUIGraphConnector, pTarget: IUIGraphConnector): void; }>;
		routeBreaked: ISignal<{ (pConnector: IUIGraphConnector, pRoute: IUIGraphRoute): void; }>;
	}
}

