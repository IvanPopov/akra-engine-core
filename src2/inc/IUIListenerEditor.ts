#ifndef IUILISTENEREDITOR_TS
#define IUILISTENEREDITOR_TS

#include "IUIPanel.ts"
#include "IUICodeEditor.ts"

module akra {
	export interface IUIListenerEditor extends IUIPanel {
		editor: IUICodeEditor;

		signal bindEvent(sCode: string): void;
	}
}

#endif

