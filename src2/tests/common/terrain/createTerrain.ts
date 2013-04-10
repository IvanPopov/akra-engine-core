#include "core/Engine.ts"
#include "terrain/TerrainROAM.ts"
#include "util/testutils.ts"
module akra {

	export var pEngine: IEngine = createEngine();
	export var pTerrain: ITerrain = null;
	var pRmgr: IResourcePoolManager = pEngine.getResourceManager();
	var pScene: IScene3d = pEngine.getScene();
	var pUI: IUI = pEngine.getSceneManager().createUI();
	var pCanvas: ICanvas3d = pEngine.getRenderer().getDefaultCanvas();
	var pMainScene: JQuery = null;
	var pCamera: ICamera = null;
	var pViewport: IViewport = null;
	var pSkyBoxTexture: ITexture = null;

	test("init tests", () => {
		function setup(): void {
			var pCanvasElement: HTMLCanvasElement = (<any>pCanvas)._pCanvas;
			pMainScene = $("<div id='main-scene'/>");
			$(document.body).append(pMainScene);
			pMainScene.append(pCanvasElement);

			pCanvas.resize(800, 600);
		}

		function createCameras(): void {
			pCamera = pScene.createCamera();
		
			pCamera.addPosition(vec3(0, 200, 10));
			pCamera.attachToParent(pScene.getRootNode());

			var pKeymap: IKeyMap = controls.createKeymap((<any>pCanvas)._pCanvas);

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

			pOmniLight.addPosition(0, 100, 5);
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
			
			pTerrainMap["height"] = pRmgr.loadImage("../../../data/textures/terrain/main_height_map_513.dds");

			pTerrainMap["height"].bind(SIGNAL(loaded), (pTexture: ITexture) => {
				
				pTerrainMap["normal"] = pRmgr.loadImage("../../../data/textures/terrain/main_terrain_normal_map.dds");
				
				pTerrainMap["normal"].bind(SIGNAL(loaded), (pTexture: ITexture) => {
					var isCreate: bool = pTerrain.init(pTerrainMap, new geometry.Rect3d(1024, 1024, 1024), 4, 5, 5, "main_terrain");
					pTerrain.attachToParent(pScene.getRootNode());
					pTerrain.scale(0.1);
					shouldBeTrue("terrain create");
					ok(isCreate);

					// pEngine.renderFrame();
				});
			});
			



			// pTerrain.create();

			// ok(pTerrain);
		}

		function loadModels(sPath, fnCallback?: Function): ISceneNode {
			var pController: IAnimationController = null;
			var pModelRoot: ISceneNode = pScene.createNode();
			var pModel: ICollada = <ICollada>pRmgr.loadModel(sPath);
			
			pController = animation.createController();

			pModelRoot.attachToParent(pScene.getRootNode());
			pModelRoot.scale(2.);
			pModelRoot.addPosition(0, -1., 0);

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
					// pModelRoot.addRelRotationByXYZAxis(0.00, 0.01, 0);
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

