// AIUIButton interface
// [write description here...]

/// <reference path="AIUIComponent.ts" />

module akra {
interface IUIButtonOptions extends AIUIComponentOptions {
	text?: string;
}

interface AIUIButton extends AIUIComponent {
	text: string;
}
}

#endif