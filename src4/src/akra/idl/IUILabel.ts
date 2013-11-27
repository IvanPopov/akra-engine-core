// IUILabel export interface
// [write description here...]

/// <reference path="IUIComponent.ts" />

module akra {
export interface IUILabelOptions extends IUIComponentOptions {
	text?: string;
	editable?: boolean;
}

export interface IUILabel extends IUIComponent {
	text: string;
	postfix: string;
	
	signal changed(value: string): void;
	editable(bValue?: boolean): void;
	isEditable(): boolean;
}
}

#endif