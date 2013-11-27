#ifndef IUISwitch_TS
#define IUISwitch_TS

/// <reference path="IUIComponent.ts" />

module akra {
export interface IUISwitch extends IUIComponent {
	value: boolean;

	isOn(): boolean;

	signal changed(bValue: boolean): void;

	_setValue(bValue: boolean): void;
}
}

#endif