// IUIButton interface
// [write description here...]

/// <reference path="IUIComponent.ts" />

module akra {
	interface IUIButtonOptions extends IUIComponentOptions {
		text?: string;
	}

	interface IUIButton extends IUIComponent {
		text: string;
	}
}


