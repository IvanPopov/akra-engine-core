/// <reference path="../../../../built/Lib/akra.d.ts"/>

module akra {
	export function createViewports(pViewport: IViewport, pCanvas: ICanvas3d, pUI: any = null): IViewport {
		pCanvas.addViewport(pViewport);

		if (isNull(pUI)) {
			pCanvas.resize(window.innerWidth, window.innerHeight);
			window.onresize = function (event) {
				pCanvas.resize(window.innerWidth, window.innerHeight);
			}
	}

		return pViewport;
	}
}