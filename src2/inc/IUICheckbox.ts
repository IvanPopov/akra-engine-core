#ifndef IUICHECKBOX_TS
#define IUICHECKBOX_TS

#include "IUIComponent.ts"

module akra {
	export interface IUICheckboxOptions extends IUIComponentOptions {
		text?: string;
	}

	export interface IUICheckbox extends IUIComponent {
		checked: bool;
		text: string;

		isChecked(): bool;

		signal changed(bValue: bool): void;

		_setValue(bValue: bool): void;
	}
}

#endif
