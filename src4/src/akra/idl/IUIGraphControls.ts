// IUIGraphControls interface
// [write description here...]

/// <reference path="IUIPanel.ts" />

module akra {
	interface IUIGraphControls extends IUIPanel {
		/** readonly */ graph: IUIGraph;
	}
}

