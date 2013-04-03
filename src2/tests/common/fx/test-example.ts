 #include "util/testutils.ts"
#include "core/Engine.ts"
#include "common.ts"
#include "IEffect.ts"

module akra {
	export var pEngine: IEngine = null;
	export var pController: IAnimationController = null;

	test("Example creation test", () => {
		pEngine = createEngine();
		var pRmgr = pEngine.getResourceManager();

		if (pEngine.getRenderer().debug(true, true)) {
			 LOG("context debugging enabled");
		}

		pEngine.bind(SIGNAL(depsLoaded), (pEngine: IEngine, pDeps: IDependens) => {
			var pModel: ICollada = <ICollada>pRmgr.loadModel("../../../data/models/WoodSoldier/WoodSoldier.DAE");
			// var pModel: ICollada = <ICollada>pRmgr.loadModel("../../../data/models/cube.dae");
			// var pModel: ICollada = <ICollada>pRmgr.loadModel("../../../data/models/hero/hero.DAE");
			var pScene: IScene3d = pEngine.getScene();
			var pModelRoot: ISceneNode = pScene.createNode("model-root");
			pController = animation.createController();

			pModelRoot.attachToParent(pScene.getRootNode());
			pModelRoot.scale(2.);
			pModelRoot.addPosition(0, -1., 0);

			pModel.bind(SIGNAL(loaded), (pModel: ICollada) => {
				pModel.attachToScene(pModelRoot, pController);

				pController.attach(pModelRoot);

				var pContainer: IAnimationContainer = animation.createContainer();

				pContainer.setAnimation(pController.active);
				pContainer.useLoop(true);
				pController.addAnimation(pContainer);

				var pCanvas: ICanvas3d = pEngine.getRenderer().getDefaultCanvas();

				document.body.appendChild((<any>pCanvas)._pCanvas);

				pCanvas.resize(800, 600);

				var pCamera = pScene.createCamera("non-default");
				pCamera.addPosition(vec3(0,0, 10));
				pCamera.attachToParent(pScene.getRootNode());

				var pOmniLight: ILightPoint = pScene.createLightPoint(ELightTypes.OMNI, false, 0, "test-omni");
				pOmniLight.attachToParent(pScene.getRootNode());
				pOmniLight.enabled = true;
				pOmniLight.params.ambient.set(0.1, 0.1, 0.1, 1);
				pOmniLight.params.diffuse.set(1);
				pOmniLight.params.specular.set(1, 1, 1, 1);
				pOmniLight.params.attenuation.set(1,0,0);

				pOmniLight.addPosition(0, 0, 5);

				var pViewport = pCanvas.addViewport(pCamera, EViewportTypes.DSVIEWPORT);
				// pViewport.setAutoUpdated();

				// LOG(pEngine.getComposer());
				
				// var pBoxNode: ISceneModel = <ISceneModel>pScene.getRootNode().findEntity("Box");
				// pBoxNode.scale(1/10);
				// pBoxNode.addRotationByXYZAxis(Math.PI/6, Math.PI/6, 0);



				pScene.bind(SIGNAL(beforeUpdate), () => {
					pModelRoot.addRelRotationByXYZAxis(0.00, 0.01, 0);
					pController.update(pEngine.time);

				});



				
				pEngine.exec();
				// LOG("BEFORE UPDATE CONTROLLER");

				// LOG("AFTER UPDATE CONTROLLER");
				// pEngine.renderFrame();

				// // WARNING("RENDER FARME 1");

				// pEngine.renderFrame();

				// pEngine.renderFrame();

				// LOG(pCamera);
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