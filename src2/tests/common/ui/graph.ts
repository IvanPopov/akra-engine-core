#include "ui/UI.ts"
#include "util/testutils.ts"

var ui = akra.ui;
var graph = ui.graph;

var pUI = new ui.UI();

var pRoot, pControls, pGraph;

test("ui basics", () => {

	pRoot = new ui.HTMLNode(pUI);
	pRoot.render();


	pControls = new graph.Controls(pRoot);
	pGraph = pControls.graph;
	//console.log(pControls.getHTMLElement());

	for (var i: int = 0; i < 3; ++ i) {
		new graph.Node(pGraph);
	};
});