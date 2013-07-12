///<reference path="../../../bin/DEBUG/akra.ts"/>
///<reference path="../../../bin/DEBUG/Progress.ts"/>


declare var jQuery: JQueryStatic;
declare var $: JQueryStatic;


/// @WINDSPOT_MODEL: 		"/models/windspot/WINDSPOT.DAE"
/// @MINER_MODEL: 			"/models/miner/miner.dae"
/// @ROCK_MODEL: 			"/models/rock/rock-1-low-p.DAE"


module akra {

	var pProgress = new util.Progress();

	var $cv = $(pProgress.canvas);


	$cv.css({
	    position: "absolute",
	    left: "50%",
	    top: "50%",
	    zIndex: "100",
	    display: "none",

	    marginTop: (-pProgress.height / 2) + "px",
	    marginLeft: (-pProgress.width / 2) + "px",
	});

	document.body.appendChild($cv[0]);

	var pEngine: IEngine = createEngine({
		renderer: {preserveDrawingBuffer: true},
		deps: {
			files: [
				{path: "textures/terrain/main_height_map_1025.dds", name: "TERRAIN_HEIGHT_MAP"},
				{path: "textures/terrain/main_terrain_normal_map.dds", name: "TERRAIN_NORMAL_MAP"},
				// {path: "textures/skyboxes/desert-3.dds", name: "SKYBOX"}
			],
			deps: {
				files: [
					{path: "models/barrel/barrel_and_support.dae", name: "BARREL"},
					{path: "models/box/closed_box.dae", name: "CLOSED_BOX"},
					{path: "models/tube/tube.dae", name: "TUBE"},
					{path: "models/tubing/tube_beeween_rocks.DAE", name: "TUBE_BETWEEN_ROCKS"},
					{path: "models/hero/movie.dae", name: "HERO_MODEL"},
					{path: "models/hero/film.DAE", name: "HERO_FILM"}
				]
			}
		},
		loader: {
			before: (pManager: IDepsManager, pInfo: number[]): void => {
				pProgress.total = pInfo;

				$cv.fadeIn(400);
			},
			onload: (pManager: IDepsManager, iDepth: number, nLoaded: number, nTotal: number): void => {
				pProgress.element = nLoaded;
				pProgress.depth = iDepth;
				pProgress.draw();
			},
			loaded: (pManager: IDepsManager): void => {
				$cv.fadeOut(1000, () => {
					document.body.removeChild($cv[0]);
				});
			}
		}
	});

	


	var pRmgr: IResourcePoolManager 	= pEngine.getResourceManager();
	var pScene: IScene3d 				= pEngine.getScene();
	var pUI: IUI 						= pEngine.getSceneManager().createUI();
	var pCanvas: ICanvas3d 				= pEngine.getRenderer().getDefaultCanvas();
	var pCamera: ICamera 				= null;
	var pViewport: IViewport 			= null;
	var pIDE: ui.IDE 					= null;
	var pSkyBoxTexture: ITexture 		= null;
	var pGamepads: IGamepadMap 			= pEngine.getGamepads();
	var pKeymap: controls.KeyMap		= <controls.KeyMap>controls.createKeymap();
	var pTerrain: ITerrain 				= null;
	var pSky 							= null;
	// var pDepsManager: IDepsManager 		= pEngine.getDepsManager()


	

	export var self = {
		engine 				: pEngine,
		scene 				: pScene,
		camera 				: pCamera,
		viewport 			: pViewport,
		canvas 				: pCanvas,
		rsmgr 				: pRmgr,
		renderer 			: pEngine.getRenderer(),
		keymap 				: pKeymap,
		gamepads 			: pGamepads,
		// cameraTerrainProj 	: <ISceneModel>null,
		terrain 			: <ITerrain>null,
		cameras 			: <ICamera[]>[],
		activeCamera  		: 0,
		cameraLight 		: <ILightPoint>null,
		voice  				: <any>null,
		sky   				: null,
		go 					: <Function>null,

		hero: {
			root: 	<ISceneNode>null,
			head: 	<ISceneNode>null,
			pelvis: <ISceneNode>null,
			movie:  <IAnimationController>null
		}
	}

	
	function loadAssets(): void {
		var context = new ((<any>window).AudioContext || (<any>window).mozAudioContext || (<any>window).webkitAudioContext)();
		var analyser = context.createAnalyser();
		var source; 
		var audio0 = new Audio();   

		audio0.src = "assets/voice.wav";
		audio0.controls = true;
		audio0.autoplay = false;
		audio0.loop = false;
		source = context.createMediaElementSource(audio0);
		source.connect(analyser);
		analyser.connect(context.destination);
		self.voice = audio0;
	}

	loadAssets();

	function loaded(): void {
		nextCamera();
		nextCamera();
		setTimeout(() => {
			document.getElementById("loader").style.display = "none";
			pEngine.exec();
			playIntro();

		}, 2000);
	}

	function nextCamera(): void {
		self.activeCamera ++;
    	
    	if (self.activeCamera === self.cameras.length) {
    		self.activeCamera = 0;
    	}

    	var pCam: ICamera = self.cameras[self.activeCamera];
    	
    	pViewport.setCamera(pCam);
	}

	function playIntro(): void {
		function _playIntro(): void {
			var pMovie: IAnimationController = self.hero.movie;

			if (isNull(pMovie)) {
				return;
			}

			var pCont: IAnimationContainer = <IAnimationContainer>pMovie.findAnimation("movie");

			pMovie.stop();
			pMovie.play("movie");

			self.cameraLight.enabled = false;
			
			setTimeout(() => {
				self.voice.currentTime = 0;
				self.voice.play();
			}, 2500);

			setTimeout(() => {
				self.cameraLight.enabled = true;
				setTimeout(() => {
					self.cameraLight.enabled = false;
					setTimeout(() => {
						self.cameraLight.enabled = true;
						setTimeout(() => {
							self.cameraLight.enabled = false;
							setTimeout(() => {
								self.cameraLight.enabled = true;
							}, 30);
						}, 30);
					}, 100);
				}, 50);
			}, 7000);
			// pCont.rewind(33.33);
		}


		self.go? self.go(_playIntro): _playIntro();
	}

	function setup(): void {

		var pCanvasElement: HTMLCanvasElement = (<any>pCanvas)._pCanvas;
		var pDiv: HTMLDivElement = <HTMLDivElement>document.createElement("div");

		document.body.appendChild(pDiv);
		pDiv.appendChild(pCanvasElement);
		pDiv.style.position = "fixed";
		

		pKeymap.captureMouse((<webgl.WebGLCanvas>pCanvas).el);
		pKeymap.captureKeyboard(document);

		pCanvas.bind("viewportAdded", (pCanvas: ICanvas3d, pVp: IViewport) => {
			pViewport = self.viewport = pVp;
		});

		pKeymap.bind("equalsign", nextCamera);
		pKeymap.bind("delete", playIntro);
	}

	function createCameras(): void {
		pCamera = self.camera = pScene.createCamera();
		pCamera.attachToParent(pScene.getRootNode());
	
		pCamera.addRelRotationByEulerAngles(-math.PI / 5., 0., 0.);
    	pCamera.addRelPosition(-8.0, 5.0, 11.0);
    	pCamera.update();
	}

	function createViewports(): void {
		pViewport = pCanvas.addViewport(pCamera, EViewportTypes.DSVIEWPORT);

		if (isNull(pUI)) {
			pCanvas.resize(window.innerWidth, window.innerHeight);
			window.onresize = function(event) {
				pCanvas.resize(window.innerWidth, window.innerHeight);
			}
		}
	}

	var v3fOffset: IVec3 = new Vec3;
	function updateKeyboardControls(fLateralSpeed: number, fRotationSpeed: number): void {
		var pKeymap: IKeyMap = self.keymap;
		var pGamepad: Gamepad = self.gamepads.find(0);


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

	    if (pKeymap.isKeyPress(EKeyCodes.D) || (pGamepad && pGamepad.buttons[EGamepadCodes.PAD_RIGHT])) {
	        v3fOffset.x = fLateralSpeed;
	        isCameraMoved = true;
	    }
	    else if (pKeymap.isKeyPress(EKeyCodes.A) || (pGamepad && pGamepad.buttons[EGamepadCodes.PAD_LEFT])) {
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
	    if (pKeymap.isKeyPress(EKeyCodes.W) || (pGamepad && pGamepad.buttons[EGamepadCodes.PAD_TOP])) {
	        v3fOffset.z = -fLateralSpeed;
	        isCameraMoved = true;
	    }
	    else if (pKeymap.isKeyPress(EKeyCodes.S) || (pGamepad && pGamepad.buttons[EGamepadCodes.PAD_BOTTOM])) {
	        v3fOffset.z = fLateralSpeed;
	        isCameraMoved = true;
	    }
	    // else if (pKeymap.isKeyPress(EKeyCodes.SPACE)) {
	    //     pEngine.isActive()? pEngine.pause(): pEngine.play();
	    // }

	    if (isCameraMoved) {
	        pCamera.addRelPosition(v3fOffset);
	    }
	}

	function updateCameras(): void {
		updateKeyboardControls(0.25, 0.05);

		var pKeymap: IKeyMap 			= self.keymap;
		var pGamepad: Gamepad 			= self.gamepads.find(0);
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

	    if (!pGamepad) {
	        return;
	    }

	    var fX = pGamepad.axes[EGamepadAxis.RIGHT_ANALOGUE_HOR];
	    var fY = pGamepad.axes[EGamepadAxis.RIGHT_ANALOGUE_VERT];

	    if (Math.abs(fX) < 0.25) {
	        fX = 0;
	    }

	    if (Math.abs(fY) < 0.25) {
	        fY = 0;
	    }

	    if (fX || fY) {
	        pCamera.addRelRotationByEulerAngles(-fX / 10, -fY / 10, 0);
	    }
	}

	function createTerrain(): void {
		pTerrain = pScene.createTerrainROAM("Terrain");

		var pTerrainMap: IImageMap = <IImageMap>{};

		pTerrainMap["height"] = <IImg>pRmgr.imagePool.findResource("TERRAIN_HEIGHT_MAP");
		pTerrainMap["normal"] = <IImg>pRmgr.imagePool.findResource("TERRAIN_NORMAL_MAP");
			
		var isCreate: bool = pTerrain.init(pTerrainMap, new geometry.Rect3d(-250, 250, -250, 250, 0, 150), 6, 4, 4, "main");
		pTerrain.attachToParent(pScene.getRootNode());
		pTerrain.setInheritance(ENodeInheritance.ALL);

		pTerrain.setRotationByXYZAxis(-Math.PI/2, 0., 0.);
		pTerrain.setPosition(11, -109, -109.85);

		self.terrain = pTerrain;
	}


	function createSky(): void {
		pSky = new model.Sky(pEngine, 32, 32, 1000.0);
		pSky.setTime(47.0);
	    pSky.skyDome.attachToParent(pScene.getRootNode());
	    self.sky = pSky;
	}

	function createModelEntry(sResource: string): IModelEntry {
		var pModel: ICollada = <ICollada>pRmgr.colladaPool.findResource(sResource);
		var pModelRoot: IModelEntry = pModel.attachToScene(pScene);

		return pModelRoot;
	}

	function update(): void {
		updateCameras();
		self.keymap.update();
	}

	function fetchAllCameras(): void {
		self.scene.getRootNode().explore((pEntity: IEntity): bool => {
			if (scene.objects.isCamera(pEntity) && !scene.light.isShadowCaster(pEntity)) {
				self.cameras.push(<ICamera>pEntity);
			}

			return true;
		});

		self.activeCamera = self.cameras.indexOf(self.camera);
	}

	function putOnTerrain(pNode: ISceneNode, v3fPlace?: IVec3) {
		if (!isDef(v3fPlace)) {
			v3fPlace = pNode.worldPosition;
		}

		var v3fsp: IVec3 = new Vec3;

		if (self.terrain.projectPoint(v3fPlace, v3fsp)) {
			pNode.setPosition(v3fsp);
		}
	}

	function createModels(): void {
		var pHeroModel: ISceneNode = createModelEntry("HERO_MODEL");

		self.hero.root = <ISceneNode>pHeroModel.findEntity("node-Bip001");

		(<ISceneModel>pHeroModel.findEntity("node-Sphere001")).mesh.getSubset(0).setVisible(false);
		
		pEngine.renderFrame();

		var v3fsp: IVec3 = new Vec3();
		
		if (self.terrain.projectPoint(pHeroModel.worldPosition, v3fsp)) {
			pHeroModel.setPosition(v3fsp);
			pHeroModel.setRotationByXYZAxis(0, math.PI, 0);

			pCamera.addPosition(v3fsp);
			pCamera.lookAt(v3fsp);
		}
		
		var pCamLight: IProjectLight = <IProjectLight>pScene.createLightPoint(ELightTypes.PROJECT, false, 0, "camera-light");

		pCamLight.attachToParent(<ISceneNode>pScene.getRootNode().findEntity("Camera001-camera"));

		pCamLight.setInheritance(ENodeInheritance.ALL);
		pCamLight.params.ambient.set(0.05, 0.05, 0.05, 1);
		pCamLight.params.diffuse.set(1.);
		pCamLight.params.specular.set(1.);
		pCamLight.params.attenuation.set(.35, 0, 0);
		pCamLight.enabled = false;

		self.cameraLight = pCamLight;

		var pBox: ISceneNode = createModelEntry("CLOSED_BOX");

		pBox.scale(.25);
		putOnTerrain(pBox, new Vec3(-2., -3.85, -5.));
		pBox.addPosition(new Vec3(0., 1., 0.));

		var pBarrel: ISceneNode = createModelEntry("BARREL");

		pBarrel.scale(.75);
		pBarrel.setPosition(new Vec3(-30., -40.23, -15.00));
		pBarrel.setRotationByXYZAxis(-17. * math.RADIAN_RATIO, -8. * math.RADIAN_RATIO, -15. * math.RADIAN_RATIO);
		

		var pTube: ISceneNode = createModelEntry("TUBE");

		pTube.scale(19.);
		pTube.setRotationByXYZAxis(0. * math.RADIAN_RATIO, -55. * math.RADIAN_RATIO, 0.);
		pTube.setPosition(new Vec3(-16.  , -52.17  ,-66.));
		

		var pTubeBetweenRocks: ISceneNode = createModelEntry("TUBE_BETWEEN_ROCKS");
	
		pTubeBetweenRocks.scale(2.);
		pTubeBetweenRocks.setRotationByXYZAxis(5. * math.RADIAN_RATIO, 100. * math.RADIAN_RATIO, 0.);
		pTubeBetweenRocks.setPosition(new Vec3(-55., -12.15, -82.00));
		

		pScene.bind("beforeUpdate", update);

		var pMovie: ICollada = <ICollada>pRmgr.colladaPool.findResource("HERO_FILM");
		var pAnim: IAnimation = pMovie.extractAnimation(0);
		var pContainer: IAnimationContainer = animation.createContainer(pAnim, "movie");
		var pController: IAnimationController = pEngine.createAnimationController("movie");
		
		pController.addAnimation(pContainer);
		pController.stop();

		pHeroModel.addController(pController);

		self.hero.movie = pController;
		
		fetchAllCameras();
		loaded();
	}

	function main(pEngine: IEngine): void {
		setup();
		createCameras();
		createViewports();
		createTerrain();
		createModels();
		createSky();
		
		pEngine.exec();
	}

	pEngine.bind("depsLoaded", main);	
}