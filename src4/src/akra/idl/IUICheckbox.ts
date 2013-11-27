// IUICheckbox export interface
// [write description here...]

/// <reference path="IUIComponent.ts" />

module akra {
export interface IUICheckboxOptions extends IUIComponentOptions {
	text?: string;
}

export interface IUICheckbox extends IUIComponent {
	checked: boolean;
	text: string;

	isChecked(): boolean;

	signal changed(bValue: boolean): void;

	_setValue(bValue: boolean): void;
}
}

#endif