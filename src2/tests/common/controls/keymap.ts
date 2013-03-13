#include "akra.ts"
#include "util/testutils.ts"

module akra {
	var pDivList: HTMLDivElement[] = new HTMLDivElement[];

	for (var i = 0; i < EKeyCodes.TOTAL; ++ i) {
		pDivList[i] = <HTMLDivElement>document.createElement("div");
		pDivList[i].textContent = "UNKNOWN";
		pDivList[i].style.fontSize = "12px";
		pDivList[i].style.fontFamily = "Consolas";
		pDivList[i].style.borderBottom = "1px solid #CCC";
		pDivList[i].style.width = "150px";
		pDivList[i].style["float"] = "left";
		document.body.appendChild(pDivList[i]);
	}

	var pHr: HTMLElement = document.createElement("hr");
	pHr.style.width = "100%";
	document.body.appendChild(pHr);

	export var pEngine: IEngine = createEngine();

	test("Keymap", () => {
		var pKeymap: IKeyMap = controls.createKeymap(document.body);

		pEngine.bind(SIGNAL(frameStarted), () => {
			pKeymap.update();
			for (var i: int = 0, s: string; i < EKeyCodes.TOTAL; ++ i) {
				s = String.fromCharCode(i);
				
				var j = i;

				pDivList[j].textContent = s + " (" + (j < 10? "  " + String(j): (j < 100? " " + String(j): String(j))) + ") [" + (pKeymap.isKeyPress(j)? "DOWN": "UP") + "]";
			}
		});

		pEngine.exec();
	});
}