#ifndef UICODEEDITOR_TS
#define UICODEEDITOR_TS

#include "IUICodeEditor.ts"
#include "Component.ts"
#include "codemirror.d.ts"

/// @: {data}/ui/3d-party/codemirror/lib/codemirror.css|location()|css()
/// @: {data}/ui/3d-party/codemirror/lib/codemirror.js|location()|script()
/// @: {data}/ui/3d-party/codemirror/addon/hint/show-hint.js|location()|script()
/// @: {data}/ui/3d-party/codemirror/addon/hint/show-hint.css|location()|css()
/// @: {data}/ui/3d-party/codemirror/addon/hint/javascript-hint.js|location()|script()
/// @: {data}/ui/3d-party/codemirror/mode/javascript/javascript.js|location()|script()

/* @: {data}/ui/3d-party/codemirror/doc/docs.css|location()|css()*/

module akra.ui {
	export class CodeEditor extends Component implements IUICodeEditor {
		public codemirror: CodeMirrorEditor = null;

		inline get value(): string { return this.codemirror.getValue(); }
		inline set value(sValue: string) { this.codemirror.setValue(sValue); }

		constructor (parent, options) {
			super(parent, options, EUIComponents.CODE_EDITOR, $("<textarea />"));


		}

		rendered(): void {
			super.rendered();

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

#endif

