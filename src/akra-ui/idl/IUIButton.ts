// IUIButton export interface
// [write description here...]

/// <reference path="IUIComponent.ts" />

module akra {
	export interface IUIButtonOptions extends IUIComponentOptions {
		text?: string;
	}

	export interface IUIButton extends IUIComponent {
		getText(): string;
		setText(sValue: string): void;
	}
}

