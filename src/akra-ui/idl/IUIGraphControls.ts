// IUIGraphControls export interface
// [write description here...]

/// <reference path="IUIPanel.ts" />

module akra {
	export interface IUIGraphControls extends IUIPanel {
		getGraph(): IUIGraph;
	}
}
