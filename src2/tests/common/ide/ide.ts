#include "util/testutils.ts"
#include "akra.ts"

module akra {
	export var pEngine: IEngine = createEngine();
	var pRmgr: IResourcePoolManager = pEngine.getResourceManager();
	var pScene: IScene3d = pEngine.getScene();
	var pUI: IUI = pEngine.getSceneManager().createUI();
	var pCanvas: ICanvas3d = pEngine.getRenderer().getDefaultCanvas();
	var pMainScene: JQuery = null;
	var pCamera: ICamera = null;
	var pViewport: IViewport = null;

	function setup(): void {
		var pCanvasElement: HTMLCanvasElement = (<any>pCanvas)._pCanvas;
		pMainScene = $("<div id='main-scene'/>");
		$(document.body).append(pMainScene);
		pMainScene.append(pCanvasElement);

		pCanvas.resize(800, 600);
	}

	function createCameras(): void {
		pCamera = pScene.createCamera();
	
		pCamera.addPosition(vec3(0,0, 10));
		pCamera.attachToParent(pScene.getRootNode());
	}

	function createViewports(): void {
		pViewport = pCanvas.addViewport(pCamera, EViewportTypes.DSVIEWPORT);
		
		var pStats: IUIRenderTargetStats = <IUIRenderTargetStats>pUI.createComponent("RenderTargetStats");
		pStats.target = pViewport.getTarget();
		pStats.render(pMainScene);

		pStats.el.css({position: "relative", top: "-600px"});
	}

	function createLighting(): void {
		var pOmniLight: ILightPoint = pScene.createLightPoint(ELightTypes.OMNI, false, 0, "test-omni");
		
		pOmniLight.attachToParent(pScene.getRootNode());
		pOmniLight.enabled = true;
		pOmniLight.params.ambient.set(0.1, 0.1, 0.1, 1);
		pOmniLight.params.diffuse.set(1);
		pOmniLight.params.specular.set(1, 1, 1, 1);
		pOmniLight.params.attenuation.set(1,0,0);

		pOmniLight.addPosition(0, 0, 5);
	}

	function loadModels(sPath, fnCallback?: Function): ISceneNode {
		var pController: IAnimationController = null;
		var pModelRoot: ISceneNode = pScene.createNode();
		var pModel: ICollada = <ICollada>pRmgr.loadModel(sPath, {animation: false});
		
		pController = animation.createController();

		pModelRoot.attachToParent(pScene.getRootNode());
		pModelRoot.scale(3.);
		pModelRoot.addPosition(0, -7., -30);

		pModel.bind(SIGNAL(loaded), (pModel: ICollada) => {
			pModel.attachToScene(pModelRoot, pController);

			pController.attach(pModelRoot);

			var pContainer: IAnimationContainer = animation.createContainer();

			if (pController.active) {
				pContainer.setAnimation(pController.active);
				pContainer.useLoop(true);
				pController.addAnimation(pContainer);		
			}


			pScene.bind(SIGNAL(beforeUpdate), () => {
				pModelRoot.addRelRotationByXYZAxis(0.00, 0.01, 0);
				pController.update(pEngine.time);
			});

			if (isFunction(fnCallback)) {
				fnCallback(pModelRoot);
			}
		});

		return pModelRoot;
	}

	function main(pEngine: IEngine): void {
		setup();
		createCameras();
		createViewports();
		createLighting();
		
		
		// loadModels("../../../data/models/dragon.dae");
		loadModels("../../../data/models/astroBoy_walk/astroBoy_walk_Max.DAE");
		// loadModels("../../../data/models/Weldinggun.dae");
		// loadModels("../../../data/models/kr360.dae");
		// loadModels("../../../data/models/hero/hero.DAE");
		// loadModels("../../../data/models/skeleton-regged.dae", (pModel: ISceneNode) => { pModel.scale(1.);});
		// loadModels("../../../data/models/seymourplane/seymourplane.DAE", (pModel: ISceneNode) => { pModel.scale(.1); });
		// loadModels("../../../data/models/WoodSoldier/WoodSoldier.DAE", (pModelRoot: ISceneNode) => {
		// 	(<ISceneModel>(<ISceneNode>pModelRoot.findEntity("node-Hips")).child.sibling).detachFromParent();
		// });
		// loadModels("../../../data/models/teapot.dae", (pModel: ISceneNode) => { pModel.scale(.01); });
		// loadModels("../../../data/models/cube.dae").scale(0.1);
	}

	pEngine.bind(SIGNAL(depsLoaded), main);		
	// pEngine.exec();
	// pEngine.renderFrame();
}