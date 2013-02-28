#include "util/testutils.ts"
#include "akra.ts"

module akra {
	asyncTest("Collada basic usage", () => {
		shouldBeNotNull("Collada model must be laoded");

		var pEngine: IEngine = createEngine({depsRoot: "../../../data"});
		var pRmgr: IResourcePoolManager = pEngine.getResourceManager();
		var pCube: ICollada = pRmgr.loadModel("models/cube.dae");
		var pScene: IScene3d = pEngine.getScene();

		pCube.bind(SIGNAL(loaded), function (pCube: ICollada) {
			check(pCube);

			//pCube.attachToScene(pScene.getRootNode());

			run();
		});
	});
}
