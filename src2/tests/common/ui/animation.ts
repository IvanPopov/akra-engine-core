#include "ui/UI.ts"
#include "util/testutils.ts"

var ui = akra.ui;
var anim = ui.animation;

var pUI = new ui.UI();

var pRoot, pControls;

test("ui basics", () => {

	pRoot = new ui.HTMLNode(pUI);
	pRoot.render();


	pControls = new anim.Controls(pRoot);

	console.log(pControls)
});