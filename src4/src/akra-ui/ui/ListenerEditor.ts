/// <reference path="../idl/IUIListenerEditor.ts" />
/// <reference path="../idl/IUIButton.ts" />
/// <reference path="CodeEditor.ts" />
/// <reference path="Panel.ts" />


module akra.ui.graph {
	export class ListenerEditor extends Panel implements IUIListenerEditor {
		bindEvent: ISignal<{ (pEditor: IUIListenerEditor, sCode: string): void; }>;

		public editor: IUICodeEditor;
		protected _pBindBtn: IUIButton;

		constructor(parent, options?) {
			super(parent, options);

			this.template("ListenerEditor.tpl");

			var editor = this.editor = <IUICodeEditor>this.findEntity("js-editor");
			this._pBindBtn = <IUIButton>this.findEntity("bind-event");

			// this.connect(this._pBindBtn, SIGNAL(click), SLOT(_bindEvent));
			this._pBindBtn.click.connect(this, this._bindEvent);

			(<IUIButton>this.findEntity("mouse-controls-tip")).click.connect(() => {
				editor.setValue(editor.getValue() + "\n\
if (self.keymap.isMousePress() && self.keymap.isMouseMoved()) {\n\
		var v2fMouseShift = self.keymap.getMouseShift();\n\
		var fdX = v2fMouseShift.x / self.viewport.actualWidth * 10.0;\n\
		var fdY = v2fMouseShift.y / self.viewport.actualHeight * 10.0;\n\
		self.camera.setRotationByXYZAxis(-fdY, -fdX, 0);\n\
	}\n\
");
			});
		}

		protected setupSignals(): void {
			this.bindEvent = this.bindEvent || new Signal(this);

			super.setupSignals();
		}

		_bindEvent(pBtn: IUIButton): void {
			this.bindEvent.emit(this.editor.getValue());
		}

		protected finalizeRender(): void {
			super.finalizeRender();
			this.getElement().addClass("component-listenereditor");
		}
	}

	register("ListenerEditor", ListenerEditor);
}

