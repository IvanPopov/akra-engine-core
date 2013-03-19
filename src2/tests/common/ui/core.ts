#include "ui/UI.ts"
#include "util/testutils.ts"

var ui = akra.ui;

var pUI = new ui.UI();
var pNode = new ui.Component(pUI, {draggable: true, name: "root"});

var pButton = new ui.Button(pNode);
var pLabel = new ui.Label(pNode);
var pSlider = new ui.Slider(pNode);
var pCheckbox = new ui.Checkbox(pNode, {text: "on"});

var pCheckboxList = new ui.CheckboxList(pNode);

for (var i = 0; i < 5; ++ i) {
	new ui.Checkbox(pCheckboxList, {text: "ch " + i, name: "checkbox-item-" + i });
}


pButton.text = "Button";
pLabel.text = "Label";

test("ui basics", () => {
	shouldBeNotNull("UI creation");
	shouldBeNotNull("HTML node creation");
	shouldBeTrue("button parent is div node");
	shouldBeTrue("layout for node");

	ok(pUI);
	ok(pNode);

	pNode.$element.css({
		width: 250,
		minHeight: 100,
		background: "#ccc"
	});

	pNode.render();

	ok(pButton.parent === pNode);
	ok(pNode.setLayout("vertical"));

	console.log(pNode.toString(true));
});
