// IUICheckbox interface
// [write description here...]

/// <reference path="IUIComponent.ts" />

module akra {
	interface IUICheckboxOptions extends IUIComponentOptions {
		text?: string;
	}

	interface IUICheckbox extends IUIComponent {
		checked: boolean;
		text: string;

		isChecked(): boolean;

		signal changed(bValue: boolean): void;

		_setValue(bValue: boolean): void;
	}
}


