function createSceneEnvironment(pScene: IScene3d, bHideQuad: bool = false, bHideSurface: bool = false, fSize: float = 100): void {
	var pSceneQuad: ISceneModel = util.createQuad(pScene, fSize * 5.);
	pSceneQuad.attachToParent(pScene.getRootNode());
	pSceneQuad.mesh.getSubset(0).setVisible(!bHideQuad);

	var pSceneSurface: ISceneModel = util.createSceneSurface(pScene, fSize);
	// pSceneSurface.scale(5.);
	pSceneSurface.addPosition(0, -0.01, 0);
	pSceneSurface.attachToParent(pScene.getRootNode());
	pSceneSurface.mesh.getSubset(0).setVisible(!bHideSurface);

	// var pCameraTerrainProj: ISceneModel = util.basis(pScene);

	// pCameraTerrainProj.attachToParent(pScene.getRootNode());
	// pCameraTerrainProj.scale(.25);

	// self.cameraTerrainProj = pCameraTerrainProj;
}