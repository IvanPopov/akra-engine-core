function createViewports(pCamera: ICamera, pCanvas: ICanvas3d, pUI: IUI = null): IViewport {
	var pViewport: IViewport = pCanvas.addViewport(pCamera, EViewportTypes.DSVIEWPORT);

	if (isNull(pUI)) {
		pCanvas.resize(window.innerWidth, window.innerHeight);
		window.onresize = function(event) {
			pCanvas.resize(window.innerWidth, window.innerHeight);
		}
	}

	return pViewport;
}