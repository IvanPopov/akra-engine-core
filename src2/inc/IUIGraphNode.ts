#ifndef IUIGRAPHNODE_TS
#define IUIGRAPHNODE_TS

#include "IUIComponent.ts"

module akra {
	IFACE(IUIGraph);
	IFACE(IUIGraphRoute);
	IFACE(IUIGraphConnectionArea);

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
		readonly graphNodeType: EUIGraphNodes;
		readonly graph: IUIGraph;
		readonly areas: IGraphNodeAreaMap;


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
