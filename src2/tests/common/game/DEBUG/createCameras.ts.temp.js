function createCameras(pScene) {
    var pCamera = pScene.createCamera();
    pCamera.attachToParent(pScene.getRootNode());
    pCamera.addRelRotationByEulerAngles(-math.PI / 5., 0., 0.);
    pCamera.addRelPosition(-8.0, 5.0, 11.0);
    pCamera.update();
    return pCamera;
}
