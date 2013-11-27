// IUIListenerEditor export interface
// [write description here...]

/// <reference path="IUIPanel.ts" />
/// <reference path="IUICodeEditor.ts" />

module akra {
export interface IUIListenerEditor extends IUIPanel {
	editor: IUICodeEditor;

	signal bindEvent(sCode: string): void;
}
}

#endif
