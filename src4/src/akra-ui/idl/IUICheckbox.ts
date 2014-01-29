// IUICheckbox export interface
// [write description here...]

/// <reference path="IUIComponent.ts" />

module akra {
	export interface IUICheckboxOptions extends IUIComponentOptions {
		text?: string;
	}

	export interface IUICheckbox extends IUIComponent {
		changed: ISignal<{ (pChekbox: IUICheckbox, bValue: boolean): void; }>;

		setChecked(bValue: boolean): void;
		getText(): string;
		setText(sValue: string): void;

		isChecked(): boolean;

		_setValue(bValue: boolean): void;
	}
}

