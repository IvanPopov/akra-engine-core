#include "util/testutils.ts"
#include "akra.ts"

module akra {
	asyncTest("Collada basic usage", () => {
		shouldBeNotNull("Collada model must be laoded");

		var pEngine: IEngine = createEngine();

		if (pEngine.getRenderer().debug(true, true)) {
			LOG("context debugging enabled");
		}

		var pRmgr: IResourcePoolManager = pEngine.getResourceManager();
		var pModel: ICollada = pRmgr.loadModel("../../../data/models/WoodSoldier/WoodSoldier.DAE");
		var pScene: IScene3d = pEngine.getScene();

		pModel.bind(SIGNAL(loaded), function (pModel: ICollada) {
			check(pModel);

			pModel.attachToScene(pScene.getRootNode());

			run();
		});
	});
}
