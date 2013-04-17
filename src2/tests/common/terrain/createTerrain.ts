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
	export var pCamera: ICamera = null;
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

			var pCanvasLOD = $("<canvas id='canvasLOD' width=600 height=600 style='float: right'>");
			pMainScene.append(pCanvasLOD);
		}

		function createCameras(): void {
			pTestNode = pScene.createNode();
			pTestNode.attachToParent(pScene.getRootNode());
			pCamera = pScene.createCamera();
		
			//pCamera.addRelRotationByXYZAxis(1, 1, 0);
			pCamera.setPosition(vec3(0, 0, 1000));
			pCamera.attachToParent(pTestNode);
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

			    var fSpeed: float = 0.1 * 10;
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
			pOmniLight.params.diffuse.set(1);
			pOmniLight.params.specular.set(1, 1, 1, 1);
			pOmniLight.params.attenuation.set(1,0,0);

			pOmniLight.addPosition(0, 750, 1000);
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
					var isCreate: bool = pTerrain.init(pTerrainMap, new geometry.Rect3d(1024, 1024, 300), 4, 5, 5, "main_terrain");
					pTerrain.attachToParent(pTestNode);
					pTerrain.setInheritance(ENodeInheritance.ALL);
					// pTerrain.addRelRotationByXYZAxis(1, 1, 0);
					// pTerrain.scale(0.1);
					// pTerrain.addRelRotationByXYZAxis(Math.PI/2, 0, 0);
					shouldBeTrue("terrain create");
					ok(isCreate);
					// setTimeout(function() {pEngine.renderFrame()}, 5000);
					// pEngine.renderFrame();
					// pTestNode.addRelRotationByXYZAxis(1, 1, 0);
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

	// test("pixelUtil", () => {
	// 	//var pPixelBoxSrc: IPixelBox = new pixelUtil.PixelBox(32, 32, 1, 11, new Uint8Array(32 * 32 * 3));
	// 	var iSize: uint = 32;
	// 	var pPixelBoxDst: IPixelBox = new pixelUtil.PixelBox(iSize, iSize, 1, 11, new Uint8Array(iSize * iSize * 3));
	// 	var pTempBox: IBox = new geometry.Box();
	// 	var pTempPixelBox: IPixelBox = new pixelUtil.PixelBox();
	// 	var iBlockW: uint = iSize/4, iBlockH: uint = iSize/4;

	// 	function setData(x: uint, y: uint){
	// 		var pData: Uint8Array = new Uint8Array(iBlockW *  iBlockH * 3);
			
	// 		for(var i: uint = 0; i < iBlockW *  iBlockH * 3; i++){
	// 			pData[i] = 10;
	// 		}

	// 		pTempBox.setPosition(0, 0, iBlockW, iBlockH);
	// 		pTempPixelBox.refresh(pTempBox, 11, pData);

	// 		pTempBox.setPosition(x, y, iBlockW, iBlockH);
	// 		var pSubBox: IPixelBox = pPixelBoxDst.getSubBox(pTempBox);
	// 		pixelUtil.bulkPixelConversion(pTempPixelBox, pSubBox);
	// 	}

	// 	for(var i: uint = 0; i < iSize; i += iBlockW){
	// 		for(var j: uint = 0; j < iSize; j += iBlockH){
	// 			setData(i, j);
	// 		}
	// 	}

	// 	LOG(pPixelBoxDst);

	// });

}

