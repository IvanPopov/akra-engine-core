#include "ui/UI.ts"
#include "util/testutils.ts"

var ui = akra.ui;
var graph = ui.graph;

var pUI = new ui.UI();

var pRoot, pControls, pGraph;

test("ui basics", () => {

	pRoot = new ui.HTMLNode(pUI);

	pRoot.render();


	pControls = pUI.createComponent("GraphControls");
	pGraph = <akra.IUIGraph>pControls.child;
	pControls.attachToParent(pRoot);

	for (var i: int = 0; i < 3; ++ i) {
		new graph.Node(pGraph);
	};

	console.log(pControls.toString(true));
});