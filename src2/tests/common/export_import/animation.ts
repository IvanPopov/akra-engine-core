#include "util/testutils.ts"
#include "akra.ts"
#include "io/Exporter.ts"
#include "io/Importer.ts"

module akra {	

	// function copyAnimation(pSource: IAnimation, sName: string): IAnimationBase {
	// 	var pAnimation: IAnimation = animation.createAnimation(sName);
	// 	for (var i: int = 0; i < pSource.totalTracks; ++ i) {
	// 		pAnimation.push(pSource.getTrack(i));
	// 	}
	// 	return pAnimation;
	// }

	var pEngine: IEngine = createEngine();

	pEngine.bind(SIGNAL(depsLoaded), (pEngine: IEngine) => {
		var pRmgr: IResourcePoolManager = pEngine.getResourceManager();
		var pModel: ICollada = <ICollada>pRmgr.loadModel("../../../data/models/WoodSoldier/WoodSoldier.DAE");
		var pScene: IScene3d = pEngine.getScene();
		var pController: IAnimationController = animation.createController();
		var pExporter = new io.Exporter;
		var pImporter = new io.Importer(pEngine);

		pModel.bind(SIGNAL(loaded), (pModel: ICollada) => {
			pModel.attachToScene(pScene, pController);

			test("Export basic usage", () => {
				shouldBeNotNull("Collada model must be laoded");
				check(pModel);

				shouldBeNotNull("Export must return result");

				// var pAnimationCopy: IAnimationBase = copyAnimation(<IAnimation>pController.active, "MEGA COPY!!");

				// pController.addAnimation(pAnimationCopy);
				// LOG(pController.totalAnimations, " - total animatios!!!!!!!!!!!!!!!!!")

				var pController2 = animation.createController();
				pController2.addAnimation(pController.active);

				pExporter.writeController(pController);
				pExporter.writeController(pController2);

				var pDocument = pExporter.createDocument();
				// LOG(pDocument);
				check(pDocument);

				pImporter.loadDocument(pDocument);
				// LOG(pController);
				
				var pControllerCopy: IAnimationController = pImporter.getController(0);
				pControllerCopy.attach(pScene.getRootNode());
				// LOG(pControllerCopy, pImporter.getController(1));
				// LOG(pImporter);
			});

			run();
		});
	});	
}
