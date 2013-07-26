function createSceneEnvironment(pScene: IScene3d, bHideQuad: bool = false, bHideSurface: bool = false): void {
	var pSceneQuad: ISceneModel = util.createQuad(pScene, 500.);
	pSceneQuad.attachToParent(pScene.getRootNode());
	pSceneQuad.mesh.getSubset(0).setVisible(!bHideQuad);

	var pSceneSurface: ISceneModel = util.createSceneSurface(pScene, 100);
	// pSceneSurface.scale(5.);
	pSceneSurface.addPosition(0, 0.01, 0);
	pSceneSurface.attachToParent(pScene.getRootNode());
	pSceneSurface.mesh.getSubset(0).setVisible(!bHideSurface);

	// var pCameraTerrainProj: ISceneModel = util.basis(pScene);

	// pCameraTerrainProj.attachToParent(pScene.getRootNode());
	// pCameraTerrainProj.scale(.25);

	// self.cameraTerrainProj = pCameraTerrainProj;
}