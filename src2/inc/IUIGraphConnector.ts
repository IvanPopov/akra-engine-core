#ifndef IUIGRAPHCONNECTOR_TS
#define IUIGRAPHCONNECTOR_TS

#include "IUIComponent.ts"

#define UIGRAPH_FLOATING_INPUT -1

module akra {
	IFACE (IUIGraphNode);

	export interface IUIGraphConnector extends IUIComponent {
		route: IUIGraphRoute;

		readonly area: IUIGraphConnectionArea;
		readonly node: IUIGraphNode;
		readonly graph: IUIGraph;
		readonly direction: EUIGraphDirections;

		isActive(): bool;

		activate(bValue?: bool): void;

		hasRoute(): bool;
		
		/** Mark as input connecotr */
		input(): bool;
		/** Mark as output connector */
		output(): bool;

		/** Mark connector as input/output */
		//setDirection(eDir: EUIGraphDirections): bool;

		highlight(bToogle?: bool): void;
		
		routing(): void;

		sendEvent(e: IUIGraphEvent): void;

		signal activated(bValue: bool): void;
		signal routeBreaked(pRoute: IUIGraphRoute): void;
		signal connected(pTarget: IUIGraphConnector);
	}
}

#endif
