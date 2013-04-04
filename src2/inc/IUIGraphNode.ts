#ifndef IUIGRAPHNODE_TS
#define IUIGRAPHNODE_TS

#include "IUIComponent.ts"

module akra {
	IFACE(IUIGraph);
	IFACE(IUIGraphRoute);

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

		findRoute(pNode: IUIGraphNode): IUIGraphRoute;
		isConnectedWith(pNode: IUIGraphNode): bool;

		activate(bState?: bool): void;
		isActive(): bool;

		isSuitable(): bool;

		sendEvent(e: IUIGraphEvent): void;
		highlight(bValue?: bool);
		canAcceptConnect(): bool;

		
		routing(): void;
	}
}

#endif
