/// <reference path="../../../../built/Lib/akra.d.ts"/>

module akra {
	export function createModelEx(
		sName: string,
		pScene: IScene3d,
		pTerrain: ITerrain = null,
		pCamera: ICamera = null,
		pController: IAnimationController = null): ISceneNode {

		var pEngine: IEngine = pScene.getManager().getEngine();
		var pRmgr: IResourcePoolManager = pEngine.getResourceManager();
		var pHeroModel: ISceneNode = createModelEntry(pScene, sName);

		if (isNull(pHeroModel)) {
			return null;
		}

		pEngine.renderFrame();

		var v3fsp: IVec3 = new Vec3();

		if (!isNull(pTerrain) && !isNull(pCamera)) {
			if (pTerrain.projectPoint(pHeroModel.getWorldPosition(), v3fsp)) {
				pHeroModel.setPosition(v3fsp);
				pHeroModel.setRotationByXYZAxis(0, math.PI, 0);

				pCamera.addPosition(v3fsp);
				pCamera.lookAt(v3fsp);
			}
		}

		if (!isNull(pController)) {
			pHeroModel.addController(pController);
		}

		return pHeroModel;
	}
}

