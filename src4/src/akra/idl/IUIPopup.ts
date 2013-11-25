// IUIPopup interface
// [write description here...]

/// <reference path="IUIComponent.ts" />

module akra {

	interface IUIPopup extends IUIComponent {
		close(): void;

		signal closed(): void;
	}
}

