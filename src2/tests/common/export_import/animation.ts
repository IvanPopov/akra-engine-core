#include "util/testutils.ts"
#include "akra.ts"
#include "io/Exporter.ts"
#include "io/Importer.ts"

module akra {	

	var pEngine: IEngine = createEngine();

	pEngine.bind(SIGNAL(depsLoaded), (pEngine: IEngine) => {
		var pRmgr: IResourcePoolManager = pEngine.getResourceManager();
		var pModel: ICollada = <ICollada>pRmgr.loadModel("../../../data/models/WoodSoldier/WoodSoldier.DAE");
		var pScene: IScene3d = pEngine.getScene();
		var pController: IAnimationController = animation.createController();
		var pExporter = new io.Exporter;
		var pImporter = new io.Importer;

		pModel.bind(SIGNAL(loaded), (pModel: ICollada) => {
			

			pModel.attachToScene(pScene, pController);

				test("Export basic usage", () => {
					shouldBeNotNull("Collada model must be laoded");
					check(pModel);

					shouldBeNotNull("Export must return result");
					pExporter.writeController(pController);

					var pData = pExporter.export(EDocumentFormat.BINARY_JSON);
				});
		});
	});	
}
