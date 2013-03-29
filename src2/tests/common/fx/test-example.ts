 #include "util/testutils.ts"
#include "core/Engine.ts"
#include "common.ts"
#include "IEffect.ts"

module akra {
	export var pEngine: IEngine = null;

	test("Example creation test", () => {
		pEngine = createEngine();
		var pRmgr = pEngine.getResourceManager();

		if (pEngine.getRenderer().debug(true, true)) {
			 LOG("context debugging enabled");
		}

		pEngine.bind(SIGNAL(depsLoaded), (pEngine: IEngine, pDeps: IDependens) => {
			var pModel: ICollada = <ICollada>pRmgr.loadModel("../../../data/models/WoodSoldier/WoodSoldier.DAE");
			// var pModel: ICollada = <ICollada>pRmgr.loadModel("../../../data/models/cube.dae");
			var pScene: IScene3d = pEngine.getScene();

			pModel.bind(SIGNAL(loaded), (pModel: ICollada) => {
				pModel.attachToScene(pScene);

				var pCanvas: ICanvas3d = pEngine.getRenderer().getDefaultCanvas();

				document.body.appendChild((<any>pCanvas)._pCanvas);

				pCanvas.resize(800, 600);

				var pCamera = pScene.createCamera("non-default");

				pCamera.addPosition(vec3(0,0, 10));

				pCamera.attachToParent(pScene.getRootNode());
				var pViewport = pCanvas.addViewport(pCamera, EViewportTypes.DSVIEWPORT);
				// pViewport.setAutoUpdated();

				LOG(pEngine.getComposer());
				
				// var pBoxNode: ISceneModel = <ISceneModel>pScene.getRootNode().findEntity("Box");
				// pBoxNode.scale(1/20);
				// pBoxNode.addRotationByXYZAxis(Math.PI/6, Math.PI/6, 0);

				// pEngine.exec();
				pEngine.renderFrame();

				LOG(pCamera);
			});

			
			// var pTestRenderable: IRenderableObject = new render.RenderableObject();
			// pTestRenderable._setup(pEngine.getRenderer(), "test-method");

			// var pDefaultTechnique: IRenderTechnique = pTestRenderable.getTechniqueDefault();
			// var pDefaultEffect: IEffect = pTestRenderable.getRenderMethod().effect;

			// pDefaultEffect.addComponent("akra.system.mesh_texture");

			// LOG(pDefaultTechnique.totalPasses);

			// pDefaultTechnique.addComponent("akra.system.prepareForDeferredShading", 0, 0);
			// pDefaultTechnique.addComponent("akra.system.prepareForDeferredShading", 1, 1);

			// LOG(pDefaultTechnique, pDefaultTechnique.totalPasses);

			// var pComposer: IAFXComposer = pEngine.getComposer();
			// LOG(pEngine.getComposer());

			// pDefaultTechnique._renderTechnique(null);
			
		});		
	});
}