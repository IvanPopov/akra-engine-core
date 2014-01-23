/// <reference path="IUIComponent.ts" />

module akra {
	export interface IUISwitch extends IUIComponent {
		changed: ISignal<{ (pSwitch: IUISwitch, bValue: boolean): void; }>;

		value: boolean;

		isOn(): boolean;

		_setValue(bValue: boolean): void;
	}
}
