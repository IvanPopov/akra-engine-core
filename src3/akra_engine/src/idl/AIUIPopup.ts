// AIUIPopup interface
// [write description here...]

/// <reference path="AIUIComponent.ts" />

module akra {

interface AIUIPopup extends AIUIComponent {
	close(): void;

	signal closed(): void;
}
}

#endif