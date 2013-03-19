#include "util/testutils.ts"
#include "akra.ts"
#include "io/Exporter.ts"

module akra {
	
	

	asyncTest("Export basic usage", () => {
		shouldBeNotNull("Collada model must be laoded");

		var pEngine: IEngine = createEngine();


		pEngine.bind(SIGNAL(depsLoaded), (pEngine: IEngine) => {
			var pRmgr: IResourcePoolManager = pEngine.getResourceManager();
			var pModel: ICollada = <ICollada>pRmgr.loadModel("../../../data/models/WoodSoldier/WoodSoldier.DAE");
			var pScene: IScene3d = pEngine.getScene();
			var pController: IAnimationController = animation.createController();
			var pDocument = new io.Document(pEngine);

			pModel.bind(SIGNAL(loaded), (pModel: ICollada) => {
				check(pModel);

				pModel.attachToScene(pScene, pController);

				pDocument.writeController(pController);

				saveAs(pDocument.export(io.EDocumentFormat.BINARY_JSON), "animation.json");

				run();
			});
		});

	});
}
