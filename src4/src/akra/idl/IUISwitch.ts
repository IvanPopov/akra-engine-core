/// <reference path="IUIComponent.ts" />

module akra {
	interface IUISwitch extends IUIComponent {
		value: boolean;

		isOn(): boolean;

		signal changed(bValue: boolean): void;

		_setValue(bValue: boolean): void;
	}
}

