#include "core/Engine.ts"
#include "terrain/TerrainROAM.ts"
#include "util/testutils.ts"
module akra {

	export var pEngine: IEngine = createEngine();
	export var pTerrain: ITerrain = null;
	export var pCamera: ICamera = null;
	export var pMainLightPoint: ILightPoint = null;

	var pRmgr: IResourcePoolManager = pEngine.getResourceManager();
	var pScene: IScene3d = pEngine.getScene();
	var pUI: IUI = pEngine.getSceneManager().createUI();
	var pCanvas: ICanvas3d = pEngine.getRenderer().getDefaultCanvas();
	var pMainScene: JQuery = null;
	var pViewport: IViewport = null;
	var pSkyBoxTexture: ITexture = null;

	export var pTestNode: ISceneNode = null;

	test("init tests", () => {
		function setup(): void {
			var pCanvasElement: HTMLCanvasElement = (<any>pCanvas)._pCanvas;
			pMainScene = $("<div id='main-scene'/>");
			$(document.body).append(pMainScene);
			pMainScene.append(pCanvasElement);

			pCanvas.resize(800, 600);

			// var pCanvasLOD = $("<canvas id='canvasLOD' width=600 height=600 style='float: right'>");
			// pMainScene.append(pCanvasLOD);
			// 
			// for(var i: uint = 0; i < 4; i++){
			// 	pMainScene.append($("<canvas id='canvasVariance" + i + "' width=512 height=512 style='float: bottom'>"));
			// }
		}

		function createCameras(): void {
			pTestNode = pScene.createNode();
			pTestNode.attachToParent(pScene.getRootNode());
			pCamera = pScene.createCamera();
		
			//pCamera.addRelRotationByXYZAxis(1, 1, 0);
			pCamera.farPlane = 500;
			pCamera.setPosition(vec3(0, 75, 0));
			pCamera.attachToParent(pScene.getRootNode());
			pCamera.addRelRotationByXYZAxis(-Math.PI/2, 0, 0);
			pCamera.setInheritance(ENodeInheritance.ALL);

			var pKeymap: IKeyMap = controls.createKeymap();
			pKeymap.captureMouse((<any>pCanvas)._pCanvas);
			pKeymap.captureKeyboard(document);
			var iCounter: int = 0;
			var iSign: int = 1;

			pScene.bind(SIGNAL(beforeUpdate), () => {
				 if (pKeymap.isMousePress() && pKeymap.isMouseMoved()) {
				 	var v2fMouseShift: IOffset = pKeymap.getMouseShift();

			        var fdX = v2fMouseShift.x / pViewport.actualWidth * 10.0;
			        var fdY = v2fMouseShift.y / pViewport.actualHeight * 10.0;

			        pCamera.setRotationByXYZAxis(-fdY, -fdX, 0);
			    }

			    var fSpeed: float = 0.1 * 1;
			    if(pKeymap.isKeyPress(EKeyCodes.W)){
			    	pCamera.addRelPosition(0, 0, -fSpeed);
			    }
			    if(pKeymap.isKeyPress(EKeyCodes.S)){
			    	pCamera.addRelPosition(0, 0, fSpeed);
			    }
			    if(pKeymap.isKeyPress(EKeyCodes.A)){
			    	pCamera.addRelPosition(-fSpeed, 0, 0);
			    }
			    if(pKeymap.isKeyPress(EKeyCodes.D)){
			    	pCamera.addRelPosition(fSpeed, 0, 0);
			    }
			    if(pKeymap.isKeyPress(EKeyCodes.SPACE)){
			    	(<akra.core.Engine>pEngine).pause(pEngine.isActive());
			    }

			    // if(pKeymap.isKeyPress())
			    // if((iCounter++) % 1000 === 0){
			    // 	iSign *= -1;
			    // }
			    // pCamera.addRelPosition(iSign * 0.05, iSign * 0.05, 0);
			});
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
			pOmniLight.params.ambient.set(0., 0., 0., 0);
			pOmniLight.params.diffuse.set(1);
			//pOmniLight.params.specular.set(1, 1, 1, 1);
			pOmniLight.params.specular.set(0, 0, 0, 0);
			pOmniLight.params.attenuation.set(1,0,0);

			pOmniLight.addPosition(0, 100, 0);

			pMainLightPoint = pOmniLight;
		}

		function createSkyBox(): void {
			pSkyBoxTexture = pRmgr.createTexture(".sky-box-texture");
			pSkyBoxTexture.loadResource("../../../data/textures/skyboxes/sky_box1-1.dds");

			pSkyBoxTexture.bind(SIGNAL(loaded), (pTexture: ITexture) => {
				(<render.DSViewport>pViewport).setSkybox(pTexture);
			});
		}

		function createTerrain(): void {
			pTerrain = pScene.createTerrainROAM();
			var pTerrainMap: IImageMap = <IImageMap>{};

			shouldBeNotNull("new terrain");
			ok(pTerrain);
			
			pTerrainMap["height"] = pRmgr.loadImage("../../../data/textures/terrain/main_height_map_1025.dds");

			pTerrainMap["height"].bind(SIGNAL(loaded), (pTexture: ITexture) => {
				pTerrainMap["normal"] = pRmgr.loadImage("../../../data/textures/terrain/main_terrain_normal_map.dds");
				
				pTerrainMap["normal"].bind(SIGNAL(loaded), (pTexture: ITexture) => {
					var isCreate: bool = pTerrain.init(pTerrainMap, new geometry.Rect3d(-250, 250, -250, 250, 0, 200), 5, 5, 5, "main");
					pTerrain.attachToParent(pScene.getRootNode());
					pTerrain.setInheritance(ENodeInheritance.ALL);
					// pTerrain.addRelRotationByXYZAxis(1, 1, 0);
					pTerrain.scale(0.1);
					pTerrain.addRelRotationByXYZAxis(-Math.PI/2, 0, 0);
					shouldBeTrue("terrain create");
					ok(isCreate);
					// pTestNode.addRelRotationByXYZAxis(1, 1, 0);
				});
			});
			



			// pTerrain.create();

			// ok(pTerrain);
		}

		// function loadModels(sPath, fnCallback?: Function): ISceneNode {
		// 	var pController: IAnimationController = null;
		// 	var pModelRoot: ISceneNode = pScene.createNode();
		// 	var pModel: ICollada = <ICollada>pRmgr.loadModel(sPath);
			
		// 	pController = pEngine.createAnimationController();

		// 	pModelRoot.attachToParent(pScene.getRootNode());
		// 	pModelRoot.scale(2.);
		// 	pModelRoot.addPosition(0, -1., 0);

		// 	pModel.bind(SIGNAL(loaded), (pModel: ICollada) => {
		// 		pModel.attachToScene(pModelRoot, pController);

		// 		pController.attach(pModelRoot);

		// 		var pContainer: IAnimationContainer = animation.createContainer();

		// 		if (pController.active) {
		// 			pContainer.setAnimation(pController.active);
		// 			pContainer.useLoop(true);
		// 			pController.addAnimation(pContainer);		
		// 		}


		// 		pScene.bind(SIGNAL(beforeUpdate), () => {
		// 			// pModelRoot.addRelRotationByXYZAxis(0.00, 0.01, 0);
		// 			pController.update(pEngine.time);
		// 		});

		// 		if (isFunction(fnCallback)) {
		// 			fnCallback(pModelRoot);
		// 		}
		// 	});

		// 	return pModelRoot;
		// }

		function main(pEngine: IEngine): void {
			setup();
			createCameras();
			createViewports();
			createLighting();
			createTerrain();
			createSkyBox();

			// loadModels("../../../data/models/kr360.dae");
			// loadModels("../../../data/models/hero/hero.DAE");
			// loadModels("../../../data/models/WoodSoldier/WoodSoldier.DAE");
			// loadModels("../../../data/models/cube.dae").scale(0.1);
		}

		pEngine.bind(SIGNAL(depsLoaded), main);	
		pEngine.exec();
		// pEngine.renderFrame();
	});
}

