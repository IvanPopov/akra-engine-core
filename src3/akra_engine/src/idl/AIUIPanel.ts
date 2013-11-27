// AIUIPanel interface
// [write description here...]

/// <reference path="AIUIComponent.ts" />

module akra {

interface IUIPanelOptions extends AIUIComponentOptions {
	title?: string;
}

interface AIUIPanel extends AIUIComponent {
	title: string;
	index: int;
	collapsed: boolean;


	collapse(bValue?: boolean): void;
	isCollapsible(): boolean;
	setCollapsible(bValue?: boolean): void;

	signal titleUpdated(sTitle: string): void;
	signal selected(): void;
}
}

#endif