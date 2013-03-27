#ifndef IUIGRAPH_TS
#define IUIGRAPH_TS

#include "IUIComponent.ts"

module akra {
	IFACE(RaphaelPaper);

	export enum EUIGraphDirections {
		IN = 0x01,
		OUT = 0x02
	}

	export enum EUIGraphTypes {
		UNKNOWN,
		ANIMATION
	}

	export interface IUIGraph extends IUIComponent {
		readonly graphType: EUIGraphTypes;
		readonly nodes: IUIGraphNode[];
		readonly canvas: RaphaelPaper;

		createRouteFrom(pConnector: IUIGraphConnector): void;
		removeTempRoute(): void;

		isReadyForConnect(): bool;
	}
}

#endif

