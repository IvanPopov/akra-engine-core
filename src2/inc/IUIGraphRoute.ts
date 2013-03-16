#ifndef IUIGRAPHROUTE_TS
#define IUIGRAPHROUTE_TS

#define UIGRAPH_INVALID_ROUTE -1

#include "raphael.d.ts"

module akra {
	IFACE(IUIGraphNode);
	//IFACE(RaphaelPath);

	export interface IUIGraphFloatNode extends IPoint {
		width: int;
		height: int;
	}

	export interface IUIGraphRoute {
		left: IUIGraphNode;
		right: IUIGraphNode;
		floatNode: IUIGraphFloatNode;

		input: int;
		output: int;

		path: RaphaelPath;

		isFloat(): bool;
		isActive(): bool;

		activate(bValue?: bool): void;
		remove(bRecirsive?: bool): void;
		
		routing(): void;
		distribute(): void;
	}
}

#endif
