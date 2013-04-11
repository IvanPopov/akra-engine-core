#ifndef IUIPANEL_TS
#define IUIPANEL_TS

#include "IUIComponent.ts"

module akra {

	export interface IUIPanelOptions extends IUIComponentOptions {
		title?: string;
	}

	export interface IUIPanel extends IUIComponent {
		title: string;
		index: int;

		isCollapsible(): bool;
		setCollapsible(bValue?: bool): void;

		signal titleUpdated(sTitle: string): void;
	}
}

#endif
