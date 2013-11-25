// IUICodeEditor interface
// [write description here...]

/// <reference path="IUIComponent.ts" />

module akra {
	interface IUICodeEditorOptions extends IUIComponentOptions {
		code?: string;
	}
	interface IUICodeEditor extends IUIComponent {
		/** readonly */ codemirror: CodeMirrorEditor;

		value: string;
	}
}


