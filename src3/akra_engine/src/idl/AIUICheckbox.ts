// AIUICheckbox interface
// [write description here...]

/// <reference path="AIUIComponent.ts" />

module akra {
interface IUICheckboxOptions extends AIUIComponentOptions {
	text?: string;
}

interface AIUICheckbox extends AIUIComponent {
	checked: boolean;
	text: string;

	isChecked(): boolean;

	signal changed(bValue: boolean): void;

	_setValue(bValue: boolean): void;
}
}

#endif