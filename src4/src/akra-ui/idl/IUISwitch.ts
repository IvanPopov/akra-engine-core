/// <reference path="IUIComponent.ts" />

module akra {
	export interface IUISwitch extends IUIComponent {
		changed: ISignal<{ (pSwitch: IUISwitch, bValue: boolean): void; }>;

		getValue(): boolean;
		setValue(bValue: boolean): void;

		isOn(): boolean;

		_setValue(bValue: boolean): void;
	}
}
