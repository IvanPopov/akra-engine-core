#ifndef IUIGRAPHCONNECTOR_TS
#define IUIGRAPHCONNECTOR_TS

#include "IUIComponent.ts"

#define UIGRAPH_FLOATING_INPUT -1

module akra {
	IFACE (IUIGraphNode);

	export interface IUIGraphConnector extends IUIComponent {
		readonly graphNode: IUIGraphNode;
		readonly connection: int;

		isValid(): bool;
		isActive(): bool;

		activate(bValue?: bool): void;
		/** Mark as input connecotr */
		input(): bool;
		/** Mark as output connector */
		output(): bool;

		/** Mark connector as input/output */
		setDirection(eDir: EUIGraphDirections): bool;

		highlight(bToogle?: bool): void;

		signal activated(bValue: bool): void;
	}
}

#endif
