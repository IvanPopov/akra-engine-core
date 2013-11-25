// IUIPanel interface
// [write description here...]

/// <reference path="IUIComponent.ts" />

module akra {

	interface IUIPanelOptions extends IUIComponentOptions {
		title?: string;
	}

	interface IUIPanel extends IUIComponent {
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

