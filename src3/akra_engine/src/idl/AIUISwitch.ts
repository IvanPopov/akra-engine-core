#ifndef IUISwitch_TS
#define IUISwitch_TS

/// <reference path="AIUIComponent.ts" />

module akra {
interface AIUISwitch extends AIUIComponent {
	value: boolean;

	isOn(): boolean;

	signal changed(bValue: boolean): void;

	_setValue(bValue: boolean): void;
}
}

#endif