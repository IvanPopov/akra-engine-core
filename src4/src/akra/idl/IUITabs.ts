
/// <reference path="IUIComponent.ts" />


/// <reference path="IUIPanel.ts" />

module akra {
	export interface IUITabs extends IUIComponent {
		active: IUIPanel;
	
		tab(iTab: int): IUIPanel;
	
		select(i: uint): void;
		select(pPanel: IUIPanel): void;
	
		findTabByTitle(sName: string): int;
		findTab(sName: string): int;
	
		tabIndex(pPanel: IUIPanel): uint;
	}
}
