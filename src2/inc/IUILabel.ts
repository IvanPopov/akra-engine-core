#ifndef IUILABEL_TS
#define IUILABEL_TS

#include "IUIComponent.ts"

module akra {
	export interface IUILabel extends IUIComponent {
		text: string;
		
		signal changed(value: string): void;
	}
}

#endif
