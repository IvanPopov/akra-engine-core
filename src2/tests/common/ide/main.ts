#include "util/testutils.ts"
#include "akra.ts"
#include "controls/KeyMap.ts"
#include "ui/IDE.ts"

module akra {
	export var pEngine: IEngine = createEngine();
	var pRmgr: IResourcePoolManager = pEngine.getResourceManager();
	var pScene: IScene3d = pEngine.getScene();
	var pUI: IUI = pEngine.getSceneManager().createUI();
	var pCanvas: ICanvas3d = pEngine.getRenderer().getDefaultCanvas();
	var pCamera: ICamera = null;
	var pViewport: IViewport = null;
	var pIDE: ui.IDE = null;
	var pSkyBoxTexture: ITexture = null;

	function setup(): void {
		pIDE = <ui.IDE>pUI.createComponent("IDE");
		pIDE.render($(document.body));
	}

	function createCameras(): void {
		pCamera = pScene.createCamera();
	
		pCamera.addPosition(vec3(0,0, 10));
		pCamera.attachToParent(pScene.getRootNode());

		var pKeymap: IKeyMap = controls.createKeymap(pIDE.getCanvasElement());

		pScene.bind(SIGNAL(beforeUpdate), () => {
			 if (pKeymap.isMousePress() && pKeymap.isMouseMoved()) {
			 	var v2fMouseShift: IOffset = pKeymap.getMouseShift();

		        var fdX = v2fMouseShift.x / pViewport.actualWidth * 10.0;
		        var fdY = v2fMouseShift.y / pViewport.actualHeight * 10.0;

		        pCamera.setRotationByXYZAxis(-fdY, -fdX, 0);
		    }
		});
	}

	function createViewports(): void {
		pViewport = pCanvas.addViewport(pCamera, EViewportTypes.DSVIEWPORT);
		// pViewport.setClearEveryFrame(true);
		// pViewport.backgroundColor = Color.CYAN;
	}

	function createLighting(): void {
		var pOmniLight: ILightPoint = pScene.createLightPoint(ELightTypes.OMNI, false, 0, "test-omni");
		
		pOmniLight.attachToParent(pScene.getRootNode());
		pOmniLight.enabled = true;
		pOmniLight.params.ambient.set(0.1, 0.1, 0.1, 1);
		pOmniLight.params.diffuse.set(1.75);
		pOmniLight.params.specular.set(.5, .5, .5, .5);
		pOmniLight.params.attenuation.set(1,0,0);

		pOmniLight.addPosition(0, 0, 5);

	/*	var pLightProject: ILightPoint = pScene.createLightPoint(ELightTypes.PROJECT, true, 512, "test-project-shadow");
		
		pLightProject.attachToParent(pScene.getRootNode());
		pLightProject.enabled = true;
		pLightProject.params.ambient.set(0.1, 0.1, 0.1, 1);
		pLightProject.params.diffuse.set(1.75);
		pLightProject.params.specular.set(.5, .5, .5, .5);
		pLightProject.params.attenuation.set(1,0,0);

		pLightProject.addPosition(0, 0, 5);*/
	}

	function createSkyBox(): void {
		pSkyBoxTexture = pRmgr.createTexture(".sky-box-texture");
		pSkyBoxTexture.loadResource("../../../data/textures/skyboxes/sky_box1-1.dds");

		pSkyBoxTexture.bind(SIGNAL(loaded), (pTexture: ITexture) => {
			(<render.DSViewport>pViewport).setSkybox(pTexture);
		});
	}

	function loadModels(sPath, fnCallback?: Function): void {
		var pController: IAnimationController = null;

		var pModel: ICollada = <ICollada>pRmgr.loadModel(sPath);
		
		pController = animation.createController();

		pModel.bind(SIGNAL(loaded), (pModel: ICollada) => {
			var pModelRoot: IModelEntry = pModel.attachToScene(pScene, pController);
			pModelRoot.scale(3.);
			pModelRoot.addPosition(0, -1., 0);

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
	}

	function main(pEngine: IEngine): void {
		setup();
		createCameras();
		createViewports();
		createSkyBox();
		createLighting();
		
		// loadModels("../../../data/models/Weldinggun.dae");
		// loadModels("../../../data/models/kr360.dae");
		loadModels("../../../data/models/hero/walk.dae", (pModelRoot: ISceneNode) => {
			var pMesh: IMesh = (<ISceneModel>pModelRoot.findEntity("node-Bip001_Pelvis[mesh-container]")).mesh;
			pMesh.createBoundingBox();
			pMesh.showBoundingBox();
			// pMesh.createAndShowSubBoundingBox();
		});
		// loadModels("../../../data/models/WoodSoldier/WoodSoldier.DAE");
		// loadModels("../../../data/models/teapot.dae", (pModel: ISceneNode) => { pModel.scale(.01); });
		// loadModels("../../../data/models/cube.dae").scale(0.1);
	}

	pEngine.bind(SIGNAL(depsLoaded), main);		
	pEngine.exec();
	// pEngine.renderFrame();
}