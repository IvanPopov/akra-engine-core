// IUILabel interface
// [write description here...]

/// <reference path="IUIComponent.ts" />

module akra {
	interface IUILabelOptions extends IUIComponentOptions {
		text?: string;
		editable?: boolean;
	}

	interface IUILabel extends IUIComponent {
		text: string;
		postfix: string;
		
		signal changed(value: string): void;
		editable(bValue?: boolean): void;
		isEditable(): boolean;
	}
}

