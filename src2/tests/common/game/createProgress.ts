function createProgress(): IProgress {
	var pProgress: IProgress = new util.Progress();
	var pCanvas: HTMLCanvasElement = pProgress.canvas;

	pProgress.color = "white";
	pProgress.fontColor = "white";

	pCanvas.style.position = "absolute";
    pCanvas.style.left = "50%";
    pCanvas.style.top = "70%";
    pCanvas.style.zIndex = "100000";
    // pCanvas.style.backgroundColor = "rgba(70, 94, 118, .8)";
    // pCanvas.style.display = "none";

    pCanvas.style.marginTop = (-pProgress.height / 2) + "px";
    pCanvas.style.marginLeft = (-pProgress.width / 2) + "px";

    document.body.appendChild(pProgress.canvas);
	pProgress.drawText("Initializing demo");

    return pProgress;
}
