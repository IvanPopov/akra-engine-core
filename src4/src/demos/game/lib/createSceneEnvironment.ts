/// <reference path="../../../../built/Lib/akra.d.ts"/>
/// <reference path="../../../../built/Lib/base3dObjects.addon.d.ts"/>

module akra {
	export function createSceneEnvironment(pScene: IScene3d, bHideQuad: boolean = false, bHideSurface: boolean = false, fSize: float = 100): void {
		var pSceneQuad: ISceneModel = addons.createQuad(pScene, fSize * 5.);
		pSceneQuad.attachToParent(pScene.getRootNode());
		pSceneQuad.getMesh().getSubset(0).setVisible(!bHideQuad);

		var pSceneSurface: ISceneModel = addons.createSceneSurface(pScene, fSize);
		// pSceneSurface.scale(5.);
		pSceneSurface.addPosition(0, -0.01, 0);
		pSceneSurface.attachToParent(pScene.getRootNode());
		pSceneSurface.getMesh().getSubset(0).setVisible(!bHideSurface);

		// var pCameraTerrainProj: ISceneModel = util.basis(pScene);

		// pCameraTerrainProj.attachToParent(pScene.getRootNode());
		// pCameraTerrainProj.scale(.25);

		// self.cameraTerrainProj = pCameraTerrainProj;
	}
}

