#ifndef IUILABEL_TS
#define IUILABEL_TS

#include "IUIComponent.ts"

module akra {
	export interface IUILabelOptions extends IUIComponentOptions {
		text?: string;
		editable?: bool;
	}
	
	export interface IUILabel extends IUIComponent {
		text: string;
		
		signal changed(value: string): void;
		editable(bValue?: bool): void;
		isEditable(): bool;
	}
}

#endif
