// AIUISlider interface
// [write description here...]

/// <reference path="AIUIComponent.ts" />

module akra {
interface AIUISlider extends AIUIComponent {
	/** readonly */ pin: AIUIComponent;
	value: float;
	range: float;
	text: string;

	signal updated(fValue: float): void;
}
}

#endif