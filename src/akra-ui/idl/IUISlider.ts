/// <reference path="IUIComponent.ts" />

module akra {
	export interface IUISlider extends IUIComponent {
		getPin(): IUIComponent;
		getValue(): float;
		setValue(fValue: float): void;
		getRange(): float;
		setRange(fRange: float): void;
		getText(): string;
		setText(sValue: string): void;

		updated: ISignal<{ (pSlider: IUISlider, fValue: float): void; }>;
	}
}

