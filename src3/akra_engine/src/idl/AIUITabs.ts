// AIUITabs interface
// [write description here...]

/// <reference path="AIUIComponent.ts" />


/// <reference path="AIUIPanel.ts" />

interface AIUITabs extends AIUIComponent {
	active: AIUIPanel;

	tab(iTab: int): AIUIPanel;

	select(i: uint): void;
	select(pPanel: AIUIPanel): void;

	findTabByTitle(sName: string): int;
	findTab(sName: string): int;

	tabIndex(pPanel: AIUIPanel): uint;
}