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
		constructor (parent, options) {
			super(parent, options, EUIComponents.CODE_EDITOR, $("<textarea />"));
		}

		rendered(): void {
			super.rendered();

			CodeMirror.commands.autocomplete = function(cm) {
				(<any>CodeMirror).showHint(cm, (<any>CodeMirror).javascriptHint, {
					additionalContext: {
						engine: ide.getEngine(),
						camera: ide.getCamera(),
						viewport: ide.getViewport(),
						canvas: ide.getCanvas(),
						scene: ide.getScene(),
						rsmgr: ide.getResourceManager(),
						renderer: ide.getEngine().getRenderer()
					}
				});
			}
			var editor = CodeMirror.fromTextArea(<HTMLTextAreaElement>this.getHTMLElement(), {
				lineNumbers: true,
				extraKeys: {"Ctrl-Space": "autocomplete"}
			});
		}
	}

	register("CodeEditor", CodeEditor);
}

#endif

