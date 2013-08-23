function createViewports(pViewport: IViewport, pCanvas: ICanvas3d, pUI: IUI = null): IViewport {
	pCanvas.addViewport(pViewport);

	if (isNull(pUI)) {
		pCanvas.resize(window.innerWidth, window.innerHeight);
		window.onresize = function(event) {
			pCanvas.resize(window.innerWidth, window.innerHeight);
		}
	}

	return pViewport;
}