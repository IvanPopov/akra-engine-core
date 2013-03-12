#include "ui/UI.ts"
#include "util/testutils.ts"

var ui = akra.ui;

var pUI = new ui.UI();
var pNode = new ui.Component(pUI, {draggable: true});
var pButton = new ui.Button(pNode);
var pLabel = new ui.Label(pNode);

pButton.text = "Button";
pLabel.text = "Label";

test("ui basics", () => {
	shouldBeNotNull("UI creation");
	shouldBeNotNull("HTML node creation");
	shouldBeTrue("button parent is div node");

	ok(pUI);
	ok(pNode);

	pNode.$element.css({
		width: 100,
		height: 100,
		background: "#ccc"
	});

	pNode.render();

	
	ok(pButton.parent === pNode);
});
