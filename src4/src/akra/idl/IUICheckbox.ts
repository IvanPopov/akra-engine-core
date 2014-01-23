// IUICheckbox export interface
// [write description here...]

/// <reference path="IUIComponent.ts" />

module akra {
	export interface IUICheckboxOptions extends IUIComponentOptions {
		text?: string;
	}

	export interface IUICheckbox extends IUIComponent {
		changed: ISignal<{ (pChekbox: IUICheckbox, bValue: boolean): void; }>;

		checked: boolean;
		text: string;

		isChecked(): boolean;

		_setValue(bValue: boolean): void;
	}
}

