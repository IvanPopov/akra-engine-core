#ifndef UICODEEDITOR_TS
#define UICODEEDITOR_TS

#include "Component.ts"

// <link rel="stylesheet" href="../lib/codemirror.css">
// <script src="../lib/codemirror.js"></script>
// <script src="../addon/hint/show-hint.js"></script>
// <link rel="stylesheet" href="../addon/hint/show-hint.css">
// <script src="../addon/hint/javascript-hint.js"></script>
// <script src="../mode/javascript/javascript.js"></script>
// <link rel="stylesheet" href="../doc/docs.css">

/// @script ui/3d-party/raphael/raphael-min.js
/// @script ui/3d-party/swig/swig.pack.min.js

/// @dep ../data/ui
/// @css ui/css/main.css




module akra.ui {
	export class CodeEditor extends Component {
		constructor (parent, options) {
			super(parent, options, EUIComponents.CODE_EDITOR);
		}
	}
}

#endif

