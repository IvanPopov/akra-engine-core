#ifndef UILISTENEREDITOR_TS
#define UILISTENEREDITOR_TS

#include "IUIListenerEditor.ts"
#include "CodeEditor.ts"
#include "Panel.ts"


module akra.ui.graph {
	export class ListenerEditor extends Panel implements IUIListenerEditor {
		
		public editor: IUICodeEditor;
		protected _pBindBtn: IUIButton;

		constructor (parent, options?) {
			super(parent, options);
			
			this.template("ListenerEditor.tpl");
			
			var editor = this.editor = <IUICodeEditor>this.findEntity("js-editor");
			this._pBindBtn = <IUIButton>this.findEntity("bind-event");

			this.connect(this._pBindBtn, SIGNAL(click), SLOT(_bindEvent));

			(<IUIButton>this.findEntity("mouse-controls-tip")).bind(SIGNAL(click), () => {
				editor.value += "\n\
if (self.keymap.isMousePress() && self.keymap.isMouseMoved()) {\n\
        var v2fMouseShift = self.keymap.getMouseShift();\n\
        var fdX = v2fMouseShift.x / self.viewport.actualWidth * 10.0;\n\
        var fdY = v2fMouseShift.y / self.viewport.actualHeight * 10.0;\n\
        self.camera.setRotationByXYZAxis(-fdY, -fdX, 0);\n\
    }\n\
";
			});
		}

		_bindEvent(pBtn: IUIButton): void {
			this.bindEvent(this.editor.value);
		}

		rendered(): void {
			super.rendered();
			this.el.addClass("component-listenereditor");
		}

		BROADCAST(bindEvent, CALL(sCode));
	}

	register("ListenerEditor", ListenerEditor);
}

#endif
