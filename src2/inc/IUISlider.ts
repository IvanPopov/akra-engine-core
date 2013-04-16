#ifndef IUISLIDER_TS
#define IUISLIDER_TS

#include "IUIComponent.ts"

module akra {
	export interface IUISlider extends IUIComponent {
		readonly pin: IUIComponent;
		value: float;
		range: float;
		text: string;

		signal updated(fValue: float): void;
	}
}

#endif
