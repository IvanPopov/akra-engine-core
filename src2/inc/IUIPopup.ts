#ifndef IUIPOPUP_TS
#define IUIPOPUP_TS

#include "IUIComponent.ts"

module akra {
	IFACE(IUIEvent);

	export interface IUIPopup extends IUIComponent {
		close(): void;

		signal closed(): void;
	}
}

#endif
