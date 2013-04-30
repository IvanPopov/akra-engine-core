#include "util/testutils.ts"
#include "akra.ts"
#include "controls/KeyMap.ts"
#include "ui/IDE.ts"
#include "util/SimpleGeometryObjects.ts"

/// @HERO_MODEL: {data}/models/hero/walk.dae|location()
/// @HERO_CONTROLLER: {data}/models/hero/movement.json|location()

module akra {
	var pEngine: IEngine = createEngine();

	var pRmgr: IResourcePoolManager = pEngine.getResourceManager();
	var pScene: IScene3d = pEngine.getScene();
	var pUI: IUI = pEngine.getSceneManager().createUI();
	var pCanvas: ICanvas3d = pEngine.getRenderer().getDefaultCanvas();
	var pCamera: ICamera = null;
	var pViewport: IViewport = null;
	var pIDE: ui.IDE = null;
	var pSkyBoxTexture: ITexture = null;

	export var self = {
		engine: pEngine,
		scene: pScene,
		camera: pCamera,
		viewport: pViewport,
		canvas: pCanvas,
		rsmgr: pRmgr,
		renderer: pEngine.getRenderer(),
		keymap: null
	};

	function setup(): void {
		pIDE = <ui.IDE>pUI.createComponent("IDE");
		pIDE.render($(document.body));
	}

	function createCameras(): void {
		pCamera = pScene.createCamera();
	
		pCamera.addPosition(vec3(0, 5, 15));
		pCamera.addRelRotationByXYZAxis(-0.2, 0., 0.);
		pCamera.attachToParent(pScene.getRootNode());

		// var pKeymap: IKeyMap = controls.createKeymap(pIDE.getCanvasElement());

		// pScene.bind(SIGNAL(beforeUpdate), () => {
		// 	 if (pKeymap.isMousePress() && pKeymap.isMouseMoved()) {
		// 	 	var v2fMouseShift: IOffset = pKeymap.getMouseShift();

		//         var fdX = v2fMouseShift.x / pViewport.actualWidth * 10.0;
		//         var fdY = v2fMouseShift.y / pViewport.actualHeight * 10.0;

		//         pCamera.setRotationByXYZAxis(-fdY, -fdX, 0);
		//     }
		// });
	}

	function createSceneEnvironment(): void {
		var pSceneQuad: ISceneModel = util.createQuad(pScene, 500.);
		pSceneQuad.attachToParent(pScene.getRootNode());

		var pSceneSurface: ISceneModel = util.createSceneSurface(pScene, 500);
		pSceneSurface.addPosition(0, 0.01, 0);
		// pSceneSurface.scale(5.);
		pSceneSurface.attachToParent(pScene.getRootNode());
	}

	function createViewports(): void {
		pViewport = pCanvas.addViewport(pCamera, EViewportTypes.DSVIEWPORT);
	}

	function createLighting(): void {
		var pOmniLight: ILightPoint = pScene.createLightPoint(ELightTypes.OMNI, true, 0, "sun");
			
		pOmniLight.attachToParent(pScene.getRootNode());
		pOmniLight.enabled = true;
		pOmniLight.params.ambient.set(0.1, 0.1, 0.1, 1);
		pOmniLight.params.diffuse.set(0.5);
		pOmniLight.params.specular.set(1, 1, 1, 1);
		pOmniLight.params.attenuation.set(1, 0, 0);

		pOmniLight.addPosition(0, 10, 5);

		// var pProjectShadowLight: ILightPoint = pScene.createLightPoint(ELightTypes.PROJECT, true, 512, "test-project-0");
		
		// pProjectShadowLight.attachToParent(pScene.getRootNode());
		// pProjectShadowLight.enabled = true;
		// pProjectShadowLight.params.ambient.set(0.1, 0.1, 0.1, 1);
		// pProjectShadowLight.params.diffuse.set(0.5);
		// pProjectShadowLight.params.specular.set(1, 1, 1, 1);
		// pProjectShadowLight.params.attenuation.set(1,0,0);
		// pProjectShadowLight.isShadowCaster = true;
		// pProjectShadowLight.addRelRotationByXYZAxis(0, -0.5, 0);
		// pProjectShadowLight.addRelPosition(0, 3, 10);

		// var pOmniShadowLight: ILightPoint = pScene.createLightPoint(ELightTypes.OMNI, true, 512, "test-omni-1");
		
		// pOmniShadowLight.attachToParent(pScene.getRootNode());
		// pOmniShadowLight.enabled = true;
		// pOmniShadowLight.params.ambient.set(0.1, 0.1, 0.1, 1);
		// pOmniShadowLight.params.diffuse.set(1);
		// pOmniShadowLight.params.specular.set(1, 1, 1, 1);
		// pOmniShadowLight.params.attenuation.set(1,0.,0);
		// pOmniShadowLight.isShadowCaster = false;

		// pOmniShadowLight.addPosition(0, 10, -10);
	}

	function createSkyBox(): void {
		pSkyBoxTexture = pRmgr.createTexture(".sky-box-texture");
		pSkyBoxTexture.loadResource("../../../data/textures/skyboxes/desert-2.dds");

		pSkyBoxTexture.bind(SIGNAL(loaded), (pTexture: ITexture) => {
			(<render.DSViewport>pViewport).setSkybox(pTexture);
		});
	}

	function loadModels(sPath, fnCallback?: Function): void {
		var pModel: ICollada = <ICollada>pRmgr.loadModel(sPath);

		pModel.bind(SIGNAL(loaded), (pModel: ICollada) => {
			var pModelRoot: IModelEntry = pModel.attachToScene(pScene);

			if (isFunction(fnCallback)) {
				fnCallback(pModelRoot);
			}
		});
	}

	function main(pEngine: IEngine): void {
		setup();
		createSceneEnvironment();
		createCameras();
		createViewports();
		createSkyBox();
		createLighting();
		
		// loadModels("../../../data/models/Weldinggun.dae");
		// loadModels("../../../data/models/kr360.dae");
		loadModels("@HERO_MODEL", (pNode: ISceneNode) => {
			fopen("@HERO_CONTROLLER", "r").read((err: Error, content: string) => {
				if (!isNull(err)) {
					throw err;
				}
	
				pNode.addController((new io.Importer(pEngine)).import(content).getController());
			});
		});
		/*loadModels("../../../data/models/hero/walk.dae", (pModelRoot: ISceneNode) => {
			var pMesh: IMesh = (<ISceneModel>pModelRoot.findEntity("node-Bip001_Pelvis[mesh-container]")).mesh;
			pMesh.createBoundingBox();
			pMesh.showBoundingBox();
			// pMesh.createAndShowSubBoundingBox();
		});*/
		// loadModels("../../../data/models/WoodSoldier/WoodSoldier.DAE");
		// loadModels("../../../data/models/teapot.dae", (pModel: ISceneNode) => { pModel.scale(.01); });
		// loadModels("../../../data/models/cube.dae").scale(0.1);
	}

	pEngine.bind(SIGNAL(depsLoaded), main);		
	pEngine.exec();
	// pEngine.renderFrame();
}