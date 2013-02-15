#include "util/testutils.ts"
#include "akra.ts"

module akra {
	var pEngine: IEngine = createEngine();
	var pRmgr: IResourcePoolManager = pEngine.getResourceManager();
	var pCube: ICollada = pRmgr.loadModel("models/cube.dae");

	test("Collada basic usage", () => {
		shouldBeNotNull("Collada model must be laoded");

		check(pCube);
	});
}
