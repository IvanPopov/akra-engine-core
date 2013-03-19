#ifndef IUIGRAPHNODE_TS
#define IUIGRAPHNODE_TS

#include "IUIComponent.ts"

module akra {
	IFACE(IUIGraph);

	export enum EUIGraphNodes {
		UNKNOWN,
		
		ANIMATION_DATA,
		ANIMATION_PLAYER,
		ANIMATION_BLENDER,
		ANIMATION_MASK
	}

	export interface IUIGraphNode extends IUIComponent {
		readonly graphNodeType: EUIGraphNodes;
		readonly graph: IUIGraph;
		readonly connectors: IUIGraphConnector[];

		activate(bState?: bool): void;
		isActive(): bool;

		grabEvent(iKeyCode: int): void;
		removeRoute(pRoute: IUIGraphRoute, iConnection: int, eDir: EUIGraphDirections): void;
		addConnector(pNode: IUINode): void;

		activateRoute(pRoute: IUIGraphRoute, bValue: bool, iConnection: int): void;

		uponConnection(pTarget: IUIGraphNode): void;
		prepareForConnect(): bool;
		input(iConnection: int): IPoint;
		output(iConnection: int): IPoint;
		highlight(bValue?: bool);
		route(eDirection: EUIGraphDirections, pTarget?: IUIGraphFloatNode): int;
		route(eDir: EUIGraphDirections, pTarget?: IUIGraphNode): int;
		routing(): void;
		addRoute(pRoute: IUIGraphRoute, iConnection: int): void;
		findRoute(pTarget: IUIGraphNode): int;
		getRoute(i: int): IUIGraphRoute;
		isSuitable(pTarget: IUIGraphNode): bool;
		hasConnections(): bool;
	}
}

#endif
