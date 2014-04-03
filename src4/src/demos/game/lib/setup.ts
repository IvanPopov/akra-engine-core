/// <reference path="../../../../built/Lib/akra.d.ts"/>
/// <reference path="../../../../built/Lib/akra-ui.d.ts"/>

module akra {
	export function setup(pCanvas: ICanvas3d, pUI: IUI = null): IUIIDE {
		var pIDE: IUIIDE = null;

		if (!isNull(pUI)) {
			pIDE = <ui.IDE>pUI.createComponent("IDE");
			pIDE.render($(document.body));
		}
		else {
			var pCanvasElement: HTMLCanvasElement = (<any>pCanvas)._pCanvas;
			var pDiv: HTMLDivElement = <HTMLDivElement>document.createElement("div");

			document.body.appendChild(pDiv);
			pDiv.appendChild(pCanvasElement);
			pDiv.style.position = "fixed";
		}

		return pIDE;
	}
}