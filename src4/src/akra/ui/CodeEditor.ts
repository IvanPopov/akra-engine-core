/// <reference path="../idl/3d-party/codemirror.d.ts" />
/// <reference path="../idl/IUICodeEditor.ts" />
/// <reference path="Component.ts" />

/// @: {data}/ui/3d-party/codemirror/lib/codemirror.css|location()|css()|data_location({data},DATA)
/// @: {data}/ui/3d-party/codemirror/lib/codemirror.js|location()|script()|data_location({data},DATA)
/// @: {data}/ui/3d-party/codemirror/addon/hint/show-hint.js|location()|script()|data_location({data},DATA)
/// @: {data}/ui/3d-party/codemirror/addon/hint/show-hint.css|location()|css()|data_location({data},DATA)
/// @: {data}/ui/3d-party/codemirror/addon/hint/javascript-hint.js|location()|script()|data_location({data},DATA)
/// @: {data}/ui/3d-party/codemirror/mode/javascript/javascript.js|location()|script()|data_location({data},DATA)


module akra.ui {
	export class CodeEditor extends Component implements IUICodeEditor {
		public codemirror: CodeMirrorEditor = null;

		 get value(): string { return this.codemirror.getValue(); }
		 set value(sValue: string) { this.codemirror.setValue(sValue); }

		constructor (parent, options) {
			super(parent, options, EUIComponents.CODE_EDITOR, $("<textarea />"));


		}

		protected finalizeRendere(): void {
			super.finalizeRender();

			CodeMirror.commands.autocomplete = function(cm) {
				(<any>CodeMirror).showHint(cm, (<any>CodeMirror).javascriptHint, {
					additionalContext: {self: ide._apiEntry}
				});
			}

			this.codemirror = CodeMirror.fromTextArea(<HTMLTextAreaElement>this.getHTMLElement(), {
				lineNumbers: true,
				extraKeys: {"Ctrl-Space": "autocomplete"},
				value: (<IUICodeEditorOptions>this.options).code || ""
			});
		}
	}

	register("CodeEditor", CodeEditor);
}


