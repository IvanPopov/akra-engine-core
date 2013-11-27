// AIUIListenerEditor interface
// [write description here...]

/// <reference path="AIUIPanel.ts" />
/// <reference path="AIUICodeEditor.ts" />

module akra {
interface AIUIListenerEditor extends AIUIPanel {
	editor: AIUICodeEditor;

	signal bindEvent(sCode: string): void;
}
}

#endif
