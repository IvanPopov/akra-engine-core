function updateCamera(pCamera: ICamera, pKeymap: IKeyMap, pGamepad: Gamepad = null): void {
	updateKeyboardControls(pCamera, 0.25, 0.05, pKeymap, pGamepad);

    //default camera.
    var pCanvas: ICanvas3d = pCamera._getLastViewport().getTarget().getRenderer().getDefaultCanvas();
    if (pKeymap.isMousePress() && pKeymap.isMouseMoved()) {
    	var v2fD: IOffset = pKeymap.getMouseShift();
        var fdX = v2fD.x, fdY = v2fD.y;

        fdX /= pCanvas.width / 10.0;
        fdY /= pCanvas.height / 10.0;

        pCamera.addRelRotationByEulerAngles(-fdX, -fdY, 0);
    }

    if (!pGamepad) {
        return;
    }

    var fX = pGamepad.axes[EGamepadAxis.RIGHT_ANALOGUE_HOR];
    var fY = pGamepad.axes[EGamepadAxis.RIGHT_ANALOGUE_VERT];

    if (math.abs(fX) < 0.25) {
        fX = 0;
    }

    if (math.abs(fY) < 0.25) {
        fY = 0;
    }

    if (fX || fY) {
        pCamera.addRelRotationByEulerAngles(-fX / 10, -fY / 10, 0);
    }
}