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

		getValue(): string { return this.codemirror.getValue(); }
		setValue(sValue: string) { this.codemirror.setValue(sValue); }

		private codemirror: CodeMirrorEditor = null;


		constructor(parent, options) {
			super(parent, options, EUIComponents.CODE_EDITOR, $("<textarea />"));
		}

		getCodeMirror(): CodeMirrorEditor {
			return this.codemirror;
		}

		protected finalizeRendere(): void {
			super.finalizeRender();

			CodeMirror.commands.autocomplete = function (cm) {
				(<any>CodeMirror).showHint(cm, (<any>CodeMirror).javascriptHint, {
					additionalContext: { self: ide._apiEntry }
				});
			}

			this.codemirror = CodeMirror.fromTextArea(<HTMLTextAreaElement>this.getHTMLElement(), {
				lineNumbers: true,
				extraKeys: { "Ctrl-Space": "autocomplete" },
				value: (<IUICodeEditorOptions>this.getOptions()).code || ""
			});
		}
	}

	register("CodeEditor", <any>CodeEditor);
}


