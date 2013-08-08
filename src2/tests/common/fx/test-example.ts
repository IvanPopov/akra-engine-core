// #include "util/testutils.ts"
// #include "core/Engine.ts"
// #include "common.ts"
// #include "IEffect.ts"
// #include "util/SimpleGeometryObjects.ts"

///<reference path="../../../bin/DEBUG/akra.ts"/>
// #include "core/Engine.ts"
// #include "terrain/TerrainROAM.ts"
// #include "util/testutils.ts"

#define int number
#define float number
#define uint number
#define SIGNAL(call) #call
declare var jQuery: JQueryStatic;
declare var $: JQueryStatic;

module akra {
	export var pEngine: IEngine = createEngine();
	var pRmgr: IResourcePoolManager = pEngine.getResourceManager();
	var pScene: IScene3d = pEngine.getScene();
	var pUI: IUI = pEngine.getSceneManager().createUI();
	var pCanvas: ICanvas3d = pEngine.getRenderer().getDefaultCanvas();
	var pMainScene: JQuery = null;
	export var pCamera: ICamera = null;
	export var pViewport: IViewport = null;
	var pSkyBoxTexture: ITexture = null;


	function setup(): void {
		var pCanvasElement: HTMLCanvasElement = (<any>pCanvas)._pCanvas;
		pMainScene = $("<div id='main-scene'/>");
		$(document.body).append(pMainScene);
		pMainScene.append(pCanvasElement);

		pCanvas.resize(800, 600);
	}

	function createSceneEnvironment(): void {
		var pSceneQuad: ISceneModel = util.createQuad(pScene, 100.);
		pSceneQuad.attachToParent(pScene.getRootNode());

		var pSceneSurface: ISceneModel = util.createSceneSurface(pScene, 40);
		pSceneSurface.addPosition(0, 0.01, 0);
		pSceneSurface.scale(5.);
		pSceneSurface.attachToParent(pScene.getRootNode());

		//pSceneQuad.addPosition(0., 0., )
		// pSceneQuad.addRelRotationByXYZAxis(0, Math.PI/2, 0);
	}

	function createCameras(): void {
		pCamera = pScene.createCamera();

		pCamera.addPosition(new Vec3(0, 4, 5));
		pCamera.addRelRotationByXYZAxis(-0.2, 0., 0.);
		pCamera.attachToParent(pScene.getRootNode());

		var pKeymap: IKeyMap = controls.createKeymap();
		pKeymap.captureMouse((<any>pCanvas)._pCanvas);
		pKeymap.captureKeyboard(document);

		pScene.bind(SIGNAL(beforeUpdate), () => {
			 if (pKeymap.isMousePress() && pKeymap.isMouseMoved()) {
			 	var v2fMouseShift: IOffset = pKeymap.getMouseShift();

		        var fdX = v2fMouseShift.x / pViewport.actualWidth * 10.0;
		        var fdY = v2fMouseShift.y / pViewport.actualHeight * 10.0;

		        pCamera.setRotationByXYZAxis(-fdY, -fdX, 0);

		        var fSpeed: float = 0.1 * 1/5;
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
		    }
		});
	}

	function createViewports(): void {
		pViewport = pCanvas.addViewport(pCamera, EViewportTypes.DSVIEWPORT);
		
		var pStats: IUIRenderTargetStats = <IUIRenderTargetStats>pUI.createComponent("RenderTargetStats");
		pStats.target = pViewport.getTarget();
		pStats.render(pMainScene);

		pStats.el.css({position: "relative", top: "-600"});
	}

	function createLighting(): void {
		var pOmniLight: IOmniLight = <IOmniLight>pScene.createLightPoint(ELightTypes.OMNI, false, 0, "test-omni-0");
		
		pOmniLight.attachToParent(pScene.getRootNode());
		pOmniLight.enabled = false;
		pOmniLight.params.ambient.set(0.1, 0.1, 0.1, 1);
		pOmniLight.params.diffuse.set(0.2);
		pOmniLight.params.specular.set(1, 1, 1, 1);
		pOmniLight.params.attenuation.set(0.5,0,0);

		pOmniLight.addPosition(1, 5, 3);

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

		// pProjectShadowLight = pScene.createLightPoint(ELightTypes.PROJECT, true, 512, "test-project-1");
		
		// pProjectShadowLight.attachToParent(pScene.getRootNode());
		// pProjectShadowLight.enabled = true;
		// pProjectShadowLight.params.ambient.set(0.1, 0.1, 0.1, 1);
		// pProjectShadowLight.params.diffuse.set(0.2);
		// pProjectShadowLight.params.specular.set(1, 1, 1, 1);
		// pProjectShadowLight.params.attenuation.set(1,0,0);
		// pProjectShadowLight.isShadowCaster = true;

		// pProjectShadowLight.addRelRotationByXYZAxis(0, 0.5, 0);
		// pProjectShadowLight.addRelPosition(0, 3, 10);

		// pProjectShadowLight = pScene.createLightPoint(ELightTypes.PROJECT, true, 512, "test-project-2");
		
		// pProjectShadowLight.attachToParent(pScene.getRootNode());
		// pProjectShadowLight.enabled = false;
		// pProjectShadowLight.params.ambient.set(0.1, 0.1, 0.1, 1);
		// pProjectShadowLight.params.diffuse.set(0.5);
		// pProjectShadowLight.params.specular.set(1, 1, 1, 1);
		// pProjectShadowLight.params.attenuation.set(1,0,0);
		// pProjectShadowLight.isShadowCaster = true;

		// pProjectShadowLight.addRelRotationByXYZAxis(0, 0, 0);
		// pProjectShadowLight.addRelPosition(0, 3, 10);

		// pProjectShadowLight = pScene.createLightPoint(ELightTypes.PROJECT, true, 512, "test-project-3");

		// pProjectShadowLight.attachToParent(pScene.getRootNode());
		// pProjectShadowLight.enabled = true;
		// pProjectShadowLight.params.ambient.set(0.1, 0.1, 0.1, 1);
		// pProjectShadowLight.params.diffuse.set(0.5);
		// pProjectShadowLight.params.specular.set(1, 1, 1, 1);
		// pProjectShadowLight.params.attenuation.set(1,0,0);
		// pProjectShadowLight.isShadowCaster = false;

		// pProjectShadowLight.addRelRotationByXYZAxis(0, -0.25, 0);
		// pProjectShadowLight.addRelPosition(0, 3, 10);

		// pProjectShadowLight = pScene.createLightPoint(ELightTypes.PROJECT, true, 512, "test-project-4");
		
		// pProjectShadowLight.attachToParent(pScene.getRootNode());
		// pProjectShadowLight.enabled = true;
		// pProjectShadowLight.params.ambient.set(0.1, 0.1, 0.1, 1);
		// pProjectShadowLight.params.diffuse.set(0.5);
		// pProjectShadowLight.params.specular.set(1, 1, 1, 1);
		// pProjectShadowLight.params.attenuation.set(1,0,0);
		// pProjectShadowLight.isShadowCaster = true;

		// pProjectShadowLight.addRelRotationByXYZAxis(0, 0.25, 0);
		// pProjectShadowLight.addRelPosition(0, 3, 10);

		// pProjectShadowLight = pScene.createLightPoint(ELightTypes.PROJECT, true, 512, "test-project-5");
		
		// pProjectShadowLight.attachToParent(pScene.getRootNode());
		// pProjectShadowLight.enabled = true;
		// pProjectShadowLight.params.ambient.set(0.1, 0.1, 0.1, 1);
		// pProjectShadowLight.params.diffuse.set(0.5);
		// pProjectShadowLight.params.specular.set(1, 1, 1, 1);
		// pProjectShadowLight.params.attenuation.set(1,0,0);
		// pProjectShadowLight.isShadowCaster = true;

		// pProjectShadowLight.addRelRotationByXYZAxis(0, 0.1, 0);
		// pProjectShadowLight.addRelPosition(0, 3, 10);

		// pProjectShadowLight = pScene.createLightPoint(ELightTypes.PROJECT, true, 512, "test-project-6");
		
		// pProjectShadowLight.attachToParent(pScene.getRootNode());
		// pProjectShadowLight.enabled = true;
		// pProjectShadowLight.params.ambient.set(0.1, 0.1, 0.1, 1);
		// pProjectShadowLight.params.diffuse.set(0.5);
		// pProjectShadowLight.params.specular.set(1, 1, 1, 1);
		// pProjectShadowLight.params.attenuation.set(1,0,0);
		// pProjectShadowLight.isShadowCaster = true;

		// pProjectShadowLight.addRelRotationByXYZAxis(0, -0.1, 0);
		// pProjectShadowLight.addRelPosition(0, 3, 10);


		var pOmniShadowLight: IOmniLight = <IOmniLight>pScene.createLightPoint(ELightTypes.OMNI, true, 512, "test-omni-1");
		
		pOmniShadowLight.attachToParent(pScene.getRootNode());
		pOmniShadowLight.enabled = true;
		pOmniShadowLight.params.ambient.set(0.1, 0.1, 0.1, 1);
		pOmniShadowLight.params.diffuse.set(0.5);
		pOmniShadowLight.params.specular.set(1, 1, 1, 1);
		pOmniShadowLight.params.attenuation.set(1,0.0,0);
		pOmniShadowLight.isShadowCaster = false;

		pOmniShadowLight.setPosition(1, 5, 5);
	}

	function createSkyBox(): void {
		pSkyBoxTexture = pRmgr.createTexture(".sky-box-texture");
		//pSkyBoxTexture.loadResource("../../../data/textures/skyboxes/sky_box1-1.dds");
		pSkyBoxTexture.loadResource(DATA + "textures/skyboxes/desert-2.dds");
		pSkyBoxTexture.bind(SIGNAL(loaded), (pTexture: ITexture) => {
			(<render.DSViewport>pViewport).setSkybox(pTexture);
		});
	}

	function loadModel(sPath, fnCallback?: Function): ISceneNode {
		var pModelRoot: ISceneNode = pScene.createNode();
		var pModel: ICollada = <ICollada>pRmgr.loadModel(sPath);

		pModelRoot.attachToParent(pScene.getRootNode());

		function fnLoadModel(pModel: ICollada): void {
			pModel.attachToScene(pModelRoot);

			if(pModel.isAnimationLoaded()) {
				var pController: IAnimationController = pEngine.createAnimationController();
				var pContainer: IAnimationContainer = animation.createContainer();
				var pAnimation: IAnimation = pModel.extractAnimation(0);

				pController.attach(pModelRoot);

				pContainer.setAnimation(pAnimation);
				pContainer.useLoop(true);
				pController.addAnimation(pContainer);	
			}

			pScene.bind(SIGNAL(beforeUpdate), () => {
				pModelRoot.addRelRotationByXYZAxis(0.00, 0.01, 0);
				// pController.update();
			});

			if (isFunction(fnCallback)) {
				fnCallback(pModelRoot);
			}
		}

		if(pModel.isResourceLoaded()){
			fnLoadModel(pModel);
		}
		else {
			pModel.bind(SIGNAL(loaded), fnLoadModel);
		}			

		return pModelRoot;
	}

	function loadManyModels(nCount: uint, sPath: string): void {
		var iRow: uint = 0;
		var iCountInRow: uint = 0;

		var fDX: float = 2.;
		var fDZ: float = 2.;

		var fShiftX: float = 0.;
		var fShiftZ: float = 0.;

		var pCube: ISceneNode = pCube = loadModel(sPath, (pModelRoot: ISceneNode) => {
			for(var i: uint = 0; i < nCount; i++) {
				if(iCountInRow > iRow){
					iCountInRow = 0;
					iRow++;

					fShiftX = -iRow * fDX/2;
					fShiftZ = -iRow * fDZ;
				}

				pCube = i === 0 ? pCube : loadModel(sPath);
				pCube.setPosition(fShiftX, 0.8, fShiftZ - 2.);
				pCube.scale(0.1);

				fShiftX += fDX;
				iCountInRow++;
			}
			// pEngine.exec();
		});			
	}

	function loadHero(){
		var pModelRoot: ISceneNode = pScene.createNode();
		var pController: IAnimationController = pEngine.createAnimationController("movie");
		var pHeroData: ICollada = <ICollada>pRmgr.loadModel(DATA + "models/hero/movie.DAE");

		pModelRoot.attachToParent(pScene.getRootNode());

		pHeroData.bind("loaded", () => {
			pHeroData.attachToScene(pModelRoot);

			var pMovieData: ICollada = <ICollada>pRmgr.loadModel(DATA + "models/hero/movie_anim.DAE");

			pMovieData.bind("loaded", () => {
				var pAnim: IAnimation = pMovieData.extractAnimation(0);
				var pMovie: IAnimationContainer = animation.createContainer(pAnim, "movie");

				pMovie.useLoop(true);
				
				// LOG(pMovieData);
				// window["movieData"] = pMovieData;
				
				// pController.addAnimation(pMovie);
				// pMovie.rightInfinity(false);
				// pController.stop();

				var pWalkData: ICollada = <ICollada>pRmgr.loadModel(DATA + "models/hero/walk.DAE");
				pWalkData.bind("loaded", () => {
					var pAnim: IAnimation = pWalkData.extractAnimation(0);
					var pWalk: IAnimationContainer = animation.createContainer(pAnim, "walk");

					pWalk.useLoop(true);

					var pBlender: IAnimationBlend = animation.createBlend();
				 	// pBlender.addAnimation(pMovie, 1);
				 	pBlender.addAnimation(pWalk, 1);

				 	pController.addAnimation(pBlender);
					pModelRoot.addController(pController);

				});
			});
		}); 

	}

	function main(pEngine: IEngine): void {
		setup();
		// createSceneEnvironment();
		createCameras();
		createViewports();
		createLighting();
		createSkyBox();
		
		// loadModels("../../../data/models/kr360.dae");
		// loadModel(DATA + "models/hero/walk.DAE", (pModelRoot: ISceneNode) => {
		// 	// var pMesh: IMesh = (<ISceneModel>pModelRoot.findEntity("node-Bip001_Pelvis[mesh-container]")).mesh;
		// 	// pMesh.createBoundingBox();h
		// 	// pMesh.showBoundingBox();
		// }).scale(2.);
		
		// // loadHero();

		

		// loadModel(DATA + "models/WoodSoldier/WoodSoldier.DAE").addPosition(0., 1.1, 0.);
		// var pCube: ISceneNode = loadModel("../../../data/models/cube.dae");
		// pCube.setPosition(2., 0.8, -3.);
		// pCube.scale(0.1);

		// var pCube2: ISceneNode = loadModel("../../../data/models/cube.dae");
		// pCube2.setPosition(2., 0.8, -5.);
		// pCube2.scale(0.1);
		// loadManyModels(300, DATA + "models/cube.dae");
		loadManyModels(100, DATA + "models/box/opened_box.dae");
	}

	pEngine.bind(SIGNAL(depsLoaded), main);	
	pEngine.exec();
}