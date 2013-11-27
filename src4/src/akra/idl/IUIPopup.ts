// IUIPopup export interface
// [write description here...]

/// <reference path="IUIComponent.ts" />

module akra {

export interface IUIPopup extends IUIComponent {
	close(): void;

	signal closed(): void;
}
}

#endif