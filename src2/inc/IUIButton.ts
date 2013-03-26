#ifndef IUIBUTTON_TS
#define IUIBUTTON_TS

#include "IUIComponent.ts"

module akra {
	export interface IUIButtonOptions extends IUIComponentOptions {
		text?: string;
	}

	export interface IUIButton extends IUIComponent {
		text: string;
	}
}

#endif
