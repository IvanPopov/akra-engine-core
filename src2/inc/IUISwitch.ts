#ifndef IUISwitch_TS
#define IUISwitch_TS

#include "IUIComponent.ts"

module akra {
	export interface IUISwitch extends IUIComponent {
		value: bool;

		isOn(): bool;

		signal changed(bValue: bool): void;
	}
}

#endif
