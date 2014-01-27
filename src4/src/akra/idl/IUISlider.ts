/// <reference path="IUIComponent.ts" />

module akra {
	export interface IUISlider extends IUIComponent {
		/** readonly */ pin: IUIComponent;
		value: float;
		range: float;
		text: string;

		updated: ISignal<{ (pSlider: IUISlider, fValue: float): void; }>;
	}
}

