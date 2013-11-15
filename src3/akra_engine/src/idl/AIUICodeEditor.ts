// AIUICodeEditor interface
// [write description here...]

/// <reference path="AIUIComponent.ts" />

module akra {
interface IUICodeEditorOptions extends AIUIComponentOptions {
	code?: string;
}
interface AIUICodeEditor extends AIUIComponent {
	/** readonly */ codemirror: CodeMirrorEditor;

	value: string;
}
}

#endif
