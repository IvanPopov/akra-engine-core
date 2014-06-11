// IUIListenerEditor export interface
// [write description here...]

/// <reference path="IUIPanel.ts" />
/// <reference path="IUICodeEditor.ts" />

module akra {
	export interface IUIListenerEditor extends IUIPanel {
		editor: IUICodeEditor;

		bindEvent: ISignal<{ (pEditor: IUIListenerEditor, sCode: string): void; }>;
	}
}
