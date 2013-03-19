#ifndef IUIGRAPH_TS
#define IUIGRAPH_TS

#include "IUIComponent.ts"

module akra {

	export enum EUIGraphDirections {
		IN,
		OUT
		//CONNECTOR_POINTER = -1
	}

	export enum EUIGraphTypes {
		UNKNOWN,
		ANIMATION
	}

	export interface IUIGraph extends IUIComponent {
		readonly graphType: EUIGraphTypes;
		readonly nodes: IUIGraphNode[];

		abortConnection(): void;
		connectPair(pOut: IUIGraphNode, pIn: IUIGraphNode): void;
		routing(pRoute: IUIGraphRoute): void;

		_setInputNode(pNode: IUIGraphNode): bool;
		_setOutputNode(pNode: IUIGraphNode): bool;
		_readyForConnect(bStatus: bool): void;
	}
}

#endif

