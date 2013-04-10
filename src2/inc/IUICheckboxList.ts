#ifndef IUICHECKBOXLIST_TS
#define IUICHECKBOXLIST_TS

#include "IUIComponent.ts"

module akra {
	IFACE(IUICheckbox);

	export interface IUICheckboxList extends IUIComponent {
		readonly length: uint;
		readonly items: IUICheckbox[];
		//режим, в котором хотябы 1 чекбокс должен оставаться выбранным
		radio: bool;

		hasMultiSelect(): bool;

		signal changed(pCheckbox: IUICheckbox);
	}
}

#endif

