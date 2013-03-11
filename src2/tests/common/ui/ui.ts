#include "ui/UI.ts"
#include "util/testutils.ts"

module akra {
	var pUI: IUI = new ui.UI();
	var pNode: IUIHTMLNode = pUI.createHTMLNode(document.createElement("div"));

	test("ui basics", () => {
		shouldBeNotNull("UI creation");
		shouldBeNotNull("HTML node creation");

		ok(pUI);
		ok(pNode);
	});
}