// AIUILabel interface
// [write description here...]

/// <reference path="AIUIComponent.ts" />

module akra {
interface IUILabelOptions extends AIUIComponentOptions {
	text?: string;
	editable?: boolean;
}

interface AIUILabel extends AIUIComponent {
	text: string;
	postfix: string;
	
	signal changed(value: string): void;
	editable(bValue?: boolean): void;
	isEditable(): boolean;
}
}

#endif