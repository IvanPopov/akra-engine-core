///<reference path="../../../bin/DEBUG/akra.ts"/>

/// @data: data
/// @: ../demo.css|css()
/// @: ../../../../bin/DEBUG/akra.js|script()

/// @HERO_MODEL: 		{data}/models/hero/movie.DAE|location()
/// @HERO_INTRO: 		{data}/models/hero/intro.part1.DAE|location()
/// @HERO_MOVIE: 			{data}/models/hero/movie_anim.dae|location()

module akra {
	var pEngine: IEngine = createEngine();

	var pRmgr: IResourcePoolManager 	= pEngine.getResourceManager();
	var pScene: IScene3d 				= pEngine.getScene();
	var pUI: IUI 						= pEngine.getSceneManager().createUI();
	var pCanvas: ICanvas3d 				= pEngine.getRenderer().getDefaultCanvas();
	var pCamera: ICamera 				= null;
	var pViewport: IViewport 			= null;
	var pKeymap: controls.KeyMap		= <controls.KeyMap>controls.createKeymap();

	export var self = {
		engine 				: pEngine,
		scene 				: pScene,
		camera 				: pCamera,
		viewport 			: pViewport,
		canvas 				: pCanvas,
		rsmgr 				: pRmgr,
		renderer 			: pEngine.getRenderer(),
		keymap 				: pKeymap,
		blend 				: <IAnimationBlend>null
	}

	function setup(): void {

		var pCanvasElement: HTMLCanvasElement = (<any>pCanvas)._pCanvas;
		var pDiv: HTMLDivElement = <HTMLDivElement>document.createElement("div");

		document.body.appendChild(pDiv);
		pDiv.appendChild(pCanvasElement);
		pDiv.style.position = "fixed";

		pKeymap.captureMouse(pCanvasElement);
		pKeymap.captureKeyboard(document);

		pCanvas.bind("viewportAdded", (pCanvas: ICanvas3d, pVp: IViewport) => {
			pViewport = self.viewport = pVp;
		});
	}

	function createCameras(): void {
		pCamera = self.camera = pScene.createCamera();
		pCamera.attachToParent(pScene.getRootNode());
	
    	pCamera.addRelPosition(0, 2.0, -2.0);
    	pCamera.lookAt(new Vec3(0., .75, 0.));

	}

	function createSceneEnvironment(): void {
		var pSceneQuad: ISceneModel = util.createQuad(pScene, 500.);
		pSceneQuad.attachToParent(pScene.getRootNode());

		var pSceneSurface: ISceneModel = util.createSceneSurface(pScene, 100);
		pSceneSurface.addPosition(0, 0.01, 0);
		pSceneSurface.attachToParent(pScene.getRootNode());

		//----

		// pSceneSurface.scale(5.);
		// pSceneQuad.mesh.getSubset(0).setVisible(false);
		// pSceneSurface.mesh.getSubset(0).setVisible(false);
	}

	function createViewports(): void {
		pViewport = pCanvas.addViewport(pCamera, EViewportTypes.DSVIEWPORT);
		pViewport.backgroundColor = Color.BLACK;
		// pViewport.setClearEveryFrame(true);
		pCanvas.resize(window.innerWidth, window.innerHeight);
		window.onresize = function(event) {
			pCanvas.resize(window.innerWidth, window.innerHeight);
		}
	}

	function createLighting(): void {
		var pSunLight: ILightPoint = pScene.createLightPoint(ELightTypes.OMNI, true, 512, "sun");
			
		pSunLight.attachToParent(pScene.getRootNode());
		pSunLight.enabled = true;
		pSunLight.params.ambient.set(0.0, 0.0, 0.0, 1);
		pSunLight.params.diffuse.set(.5);
		pSunLight.params.specular.set(.5);
		pSunLight.params.attenuation.set(1, 0, 0);

		pSunLight.setPosition(5, 5, -5);

		

		var pProject: ILightPoint = pScene.createLightPoint(ELightTypes.PROJECT, true, 512);
			
		pProject.attachToParent(pScene.getRootNode());
		pProject.enabled = true;
		pProject.params.ambient.set(0.0, 0.0, 0.0, 1);
		pProject.params.diffuse.set(1.);
		pProject.params.specular.set(1.);
		pProject.params.attenuation.set(1, 0, 0);


		pProject.setPosition(new Vec3(-5, 5, -5));
		pProject.lookAt(new Vec3(0., .75, 0.));	
	}



	var v3fOffset: IVec3 = new Vec3;

	function updateKeyboardControls(fLateralSpeed: number, fRotationSpeed: number): void {
		var pKeymap: IKeyMap = self.keymap;
		// var pGamepad: Gamepad = self.gamepads.find(0);

		if (pKeymap.isKeyPress(EKeyCodes.RIGHT)) {
	        pCamera.addRelRotationByEulerAngles(0.0, 0.0, -fRotationSpeed);
	        //v3fCameraUp.Z >0.0 ? fRotationSpeed: -fRotationSpeed);
	    }
	    else if (pKeymap.isKeyPress(EKeyCodes.LEFT)) {
	        pCamera.addRelRotationByEulerAngles(0.0, 0.0, fRotationSpeed);
	        //v3fCameraUp.Z >0.0 ? -fRotationSpeed: fRotationSpeed);
	    }

	    if (pKeymap.isKeyPress(EKeyCodes.UP)) {
	        pCamera.addRelRotationByEulerAngles(0, fRotationSpeed, 0);
	    }
	    else if (pKeymap.isKeyPress(EKeyCodes.DOWN)) {
	        pCamera.addRelRotationByEulerAngles(0, -fRotationSpeed, 0);
	    }

	    v3fOffset.set(0.);
	    
	    var isCameraMoved: bool = false;

	    if (pKeymap.isKeyPress(EKeyCodes.D)) {
	        v3fOffset.x = fLateralSpeed;
	        isCameraMoved = true;
	    }
	    else if (pKeymap.isKeyPress(EKeyCodes.A)) {
	        v3fOffset.x = -fLateralSpeed;
	        isCameraMoved = true;
	    }
	    if (pKeymap.isKeyPress(EKeyCodes.R)) {
	        v3fOffset.y = fLateralSpeed;
	        isCameraMoved = true;
	    }
	    else if (pKeymap.isKeyPress(EKeyCodes.F)) {
	        v3fOffset.y = -fLateralSpeed;
	        isCameraMoved = true;
	    }
	    if (pKeymap.isKeyPress(EKeyCodes.W)) {
	        v3fOffset.z = -fLateralSpeed;
	        isCameraMoved = true;
	    }
	    else if (pKeymap.isKeyPress(EKeyCodes.S)) {
	        v3fOffset.z = fLateralSpeed;
	        isCameraMoved = true;
	    }

	    if (isCameraMoved) {
	        pCamera.addRelPosition(v3fOffset);
	    }
	}

	function updateCameras(): void {
		updateKeyboardControls(0.25, 0.05);

		var pKeymap: IKeyMap 			= self.keymap;
		var pCamera: ICamera 			= self.camera;
		var pCanvas: ICanvas3d 			= self.canvas;
		var pViewport: IViewport 		= self.viewport;

	    //default camera.

	    if (pKeymap.isMousePress() && pKeymap.isMouseMoved()) {
	    	var v2fD: IOffset = pKeymap.getMouseShift();
	        var fdX = v2fD.x, fdY = v2fD.y;

	        fdX /= pCanvas.width / 10.0;
	        fdY /= pCanvas.height / 10.0;

	        pCamera.addRelRotationByEulerAngles(-fdX, -fdY, 0);
	    }
	}

	

	function loadModels(sPath, fnCallback?: Function): void {
		var pModel: ICollada = <ICollada>pRmgr.loadModel(sPath);

		pModel.bind("loaded", (pModel: ICollada) => {
			var pModelRoot: IModelEntry = pModel.attachToScene(pScene);

			if (isFunction(fnCallback)) {
				fnCallback(pModelRoot);
			}
		});
	}

	function update(): void {
		updateCameras();
		self.keymap.update();
	}


	function main(pEngine: IEngine): void {
		setup();
		createSceneEnvironment();
		createCameras();
		createViewports();
		createLighting();

		pScene.bind("beforeUpdate", update);
		
		loadModels("@HERO_MODEL", (pNode: ISceneNode) => {
			pNode.addPosition(new Vec3(-2.45, .75, 0.));

			var pIntroData: ICollada = <ICollada>pRmgr.loadModel("@HERO_INTRO");
			
			pIntroData.bind("loaded", () => {

				var pAnim: IAnimation = pIntroData.extractAnimation(0);
				var pIntro: IAnimationContainer = animation.createContainer(pAnim, "walk");
				
				pIntro.useLoop(true);
				pIntro.rightInfinity(false);

				var pMovieData: ICollada = <ICollada>pRmgr.loadModel("@HERO_MOVIE");
				pMovieData.bind("loaded", () => {
					var pAnim: IAnimation = pMovieData.extractAnimation(0);
					var pMovie: IAnimationContainer = animation.createContainer(pAnim, "run");

					pMovie.useLoop(true);
					pMovie.leftInfinity(false);

					var pMovement: IAnimationBlend = animation.createBlend("movement");


					pMovement.addAnimation(pIntro, 1.0);
					pMovement.addAnimation(pMovie, 1.0);
					
					var pController: IAnimationController = pEngine.createAnimationController("movement");
					pController.addAnimation(pMovement);
					// pController.stop();

					pNode.addController(pController);
					self.blend = pMovement;
				});
			});


			pScene.bind("beforeUpdate", () => {
				pNode.addRelRotationByXYZAxis(0.00, 0.003, 0);
			});
		});
	}
	
	pEngine.bind("depsLoaded", main);		
	pEngine.exec();
}