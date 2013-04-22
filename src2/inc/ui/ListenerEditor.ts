#ifndef UILISTENEREDITOR_TS
#define UILISTENEREDITOR_TS

#include "IUIListenerEditor.ts"
#include "CodeEditor.ts"
#include "Panel.ts"


module akra.ui.graph {
	export class ListenerEditor extends Panel implements IUIListenerEditor {
		
		public editor: IUICodeEditor;

		constructor (parent, options?) {
			super(parent, options);
			
			this.template("ListenerEditor.tpl");
			this.editor = <IUICodeEditor>this.findEntity("js-editor");
		}

		rendered(): void {
			super.rendered();
			this.el.addClass("component-listenereditor");
		}
	}

	register("ListenerEditor", ListenerEditor);
}

#endif
