///<reference path="../../../bin/DEBUG/akra.ts"/>

declare var jQuery: JQueryStatic;
declare var $: JQueryStatic;

/// @data: data

/// @BARREL: 				{data}/models/barrel/barrel_and_support.dae|location()
/// @CLOSED_BOX: 			{data}/models/box/closed_box.dae|location()
/// @TUBE: 					{data}/models/tube/tube.dae|location()
/// @TUBE_BETWEEN_ROCKS:	{data}/models/tubing/tube_beeween_rocks.DAE|location()
/// @HERO_MODEL: 			{data}/models/hero/movie.dae|location()
/// @HERO_CONTROLLER: 		{data}/models/hero/movie_anim.DAE|location()
/// @HERO_INTRO: 			{data}/models/hero/intro.part1.DAE|location()
/// @WINDSPOT_MODEL: 		{data}/models/windspot/WINDSPOT.DAE|location()
/// @MINER_MODEL: 			{data}/models/miner/miner.dae|location()
/// @ROCK_MODEL: 			{data}/models/rock/rock-1-low-p.DAE|location()
/// @TERRAIN_HEIGHT_MAP: 	{data}/textures/terrain/main_height_map_1025.dds|location()
/// @TERRAIN_NORMAL_MAP: 	{data}/textures/terrain/main_terrain_normal_map.dds|location()
/// @SKYBOX: 				{data}/textures/skyboxes/desert-3.dds|location()

module akra {
	var pEngine: IEngine = createEngine();

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
	export var pParentElement: HTMLDivElement 	= null;

	// var $canvasContainer: JQuery 		= null;
	// var $div: JQuery 					= null;

	

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
		terrainLoaded		: false,
		cameras 			: <ICamera[]>[],
		activeCamera  		: 0,
		cameraLight 		: <ILightPoint>null,
		voice  				: <any>null,
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

		audio0.src = 'assets/voice.wav';
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
		if (!isNull(pUI)) {
			pIDE = <ui.IDE>pUI.createComponent("IDE");
			pIDE.render($(document.body));
		}
		else {
			var pCanvasElement: HTMLCanvasElement = (<any>pCanvas)._pCanvas;
			var pDiv: HTMLDivElement = pParentElement;

			pDiv.appendChild(pCanvasElement);

			pCanvasElement.style.position = "absolute";
			pCanvasElement.style.top = "14px";
			// pDiv.style.position = "fixed";
		}

		pKeymap.captureMouse((<webgl.WebGLCanvas>pCanvas).el);
		pKeymap.captureKeyboard(document);

		pCanvas.bind("viewportAdded", (pCanvas: ICanvas3d, pVp: IViewport) => {
			pViewport = self.viewport = pVp;
		});


		// pIDE.bind("created", (): void => {
		// 	$canvasContainer = $((<webgl.WebGLCanvas>pCanvas).el).parent();

		// 	$div = $("<div>[ Fred ]</div>").css({
		// 		position 	: "absolute", 
		// 		background 	: "rgba(0,0,0,.75)", 
		// 		color 		: "white",
		// 		zIndex 		: "1000",
		// 		fontFamily 	: "Consolas",
		// 		fontSize 	: "10px",
		// 		padding 	: "2px",
		// 		width 		: "40px",
		// 		textAlign 	: "center",
		// 		whiteSpace 	: "nowrap"
		// 	});

		// 	$canvasContainer.append($div);
		// 	$canvasContainer.css({overflow: "hidden"});
		// });


		

		pKeymap.bind("equalsign", () => {
			nextCamera();
		});

		pKeymap.bind("delete", () => {
			playIntro();
		});

		pKeymap.bind("add", () => {
			var pMovie: IAnimationController = self.hero.movie;

			if (isNull(pMovie)) {
				return;
			}

			var pCont: IAnimationContainer = <IAnimationContainer>pMovie.findAnimation("movie");
			pCont.setSpeed(pCont.speed * 2.0);
		});

		pKeymap.bind("SUBTRACT", () => {
			var pMovie: IAnimationController = self.hero.movie;

			if (isNull(pMovie)) {
				return;
			}

			var pCont: IAnimationContainer = <IAnimationContainer>pMovie.findAnimation("movie");
			pCont.setSpeed(pCont.speed / 2.0);
		});
	}

	function createCameras(): void {
		pCamera = self.camera = pScene.createCamera();
		pCamera.attachToParent(pScene.getRootNode());
	
		pCamera.addRelRotationByEulerAngles(-math.PI / 5., 0., 0.);
    	pCamera.addRelPosition(-8.0, 5.0, 11.0);
    	pCamera.update();
	}

	function createSceneEnvironment(): void {
		var pSceneQuad: ISceneModel = util.createQuad(pScene, 500.);
		pSceneQuad.attachToParent(pScene.getRootNode());
		pSceneQuad.mesh.getSubset(0).setVisible(false);

		var pSceneSurface: ISceneModel = util.createSceneSurface(pScene, 100);
		// pSceneSurface.scale(5.);
		pSceneSurface.addPosition(0, 0.01, 0);
		pSceneSurface.attachToParent(pScene.getRootNode());
		pSceneSurface.mesh.getSubset(0).setVisible(false);

		// var pCameraTerrainProj: ISceneModel = util.basis(pScene);

		// pCameraTerrainProj.attachToParent(pScene.getRootNode());
		// pCameraTerrainProj.scale(.25);

		// self.cameraTerrainProj = pCameraTerrainProj;
	}

	function createViewports(): void {
		pViewport = pCanvas.addViewport(pCamera, EViewportTypes.DSVIEWPORT);

		if (isNull(pUI)) {
			pCanvas.resize(pParentElement.offsetWidth, pParentElement.offsetHeight);

			window.onresize = function(event) {
				pCanvas.resize(pParentElement.offsetWidth, pParentElement.offsetHeight);
			}
		}
	}

	function createLighting(): void {
		var pSunLight: ILightPoint = pScene.createLightPoint(ELightTypes.OMNI, true, 2048, "sun");
			
		pSunLight.attachToParent(pScene.getRootNode());
		pSunLight.enabled = true;
		pSunLight.params.ambient.set(0.0, 0.0, 0.0, 1);
		pSunLight.params.diffuse.set(1.);
		pSunLight.params.specular.set(1.);
		pSunLight.params.attenuation.set(1, 0, 0);

		pSunLight.addPosition(0, 500, 0);

		

		function createAmbient(sName: string, v3fPos: IVec3): void {
			var pOmniLight: ILightPoint = pScene.createLightPoint(ELightTypes.OMNI, false, 512, sName);
			
			pOmniLight.attachToParent(pScene.getRootNode());
			pOmniLight.enabled = true;
			pOmniLight.params.ambient.set(0.1, 0.1, 0.1, 1);
			pOmniLight.params.diffuse.set(0.25);
			pOmniLight.params.specular.set(0.);
			pOmniLight.params.attenuation.set(4., 0, 0);

			pOmniLight.addPosition(v3fPos);
		}

		createAmbient("Ambient LB", new Vec3(-500, 500, -500));
		createAmbient("Ambient RB", new Vec3(500, 500, -500));
		createAmbient("Ambient LF", new Vec3(-500, 500, 500));
		createAmbient("Ambient RF", new Vec3(500, 500, 500));
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
		pTerrain = pScene.createTerrainROAM();

		var pTerrainMap: IImageMap = <IImageMap>{};

		pTerrainMap["height"] = pRmgr.loadImage("@TERRAIN_HEIGHT_MAP");

		pTerrainMap["height"].bind("loaded", (pTexture: ITexture) => {
			pTerrainMap["normal"] = pRmgr.loadImage("@TERRAIN_NORMAL_MAP");
			
			pTerrainMap["normal"].bind("loaded", (pTexture: ITexture) => {
				var isCreate: bool = pTerrain.init(pTerrainMap, new geometry.Rect3d(-250, 250, -250, 250, 0, 150), 6, 4, 4, "main");
				pTerrain.attachToParent(pScene.getRootNode());
				pTerrain.setInheritance(ENodeInheritance.ALL);

				pTerrain.setRotationByXYZAxis(-Math.PI/2, 0., 0.);
				pTerrain.setPosition(11, -109, -109.85);
				// pTerrain.setPosition(0., -pTerrain.localBounds.sizeZ() / 2., 0.);
				// pTestNode.addRelRotationByXYZAxis(1, 1, 0);
				self.terrainLoaded = true;

				createHero();
				// pEngine.renderFrame();
			});
		});

		self.terrain = pTerrain;
	}

	function createSkyBox(): void {
		pSkyBoxTexture = pRmgr.createTexture(".sky-box-texture");
		pSkyBoxTexture.loadResource("@SKYBOX");

		pSkyBoxTexture.bind("loaded", (pTexture: ITexture) => {
			if (pViewport.type === EViewportTypes.DSVIEWPORT) {
				(<render.DSViewport>pViewport).setSkybox(pTexture);
			}
		});
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
		// var pProj: IVec3 = vec3();
		// if (self.terrainLoaded && self.terrain.projectPoint(self.hero.root.worldPosition, pProj)) {
		// 	self.cameraTerrainProj.setPosition(pProj);

		// 	if (self.viewport.projectPoint(pProj)) {
		// 		var pOffset = $canvasContainer.offset();
		// 		$div.offset({left: pOffset.left + pProj.x, top: pOffset.top + pProj.y});
		// 	}
		// }
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

	function createHero(): void {
		loadModels("@HERO_MODEL", (pNode: ISceneNode) => {
			self.hero.root = <ISceneNode>pNode.findEntity("node-Bip001");

			(<ISceneModel>pNode.findEntity("node-Sphere001")).mesh.getSubset(0).setVisible(false);
			
			var v3fsp: IVec3 = new Vec3();
			
			if (self.terrain.projectPoint(pNode.worldPosition, v3fsp)) {
				pNode.setPosition(v3fsp);
				pNode.setRotationByXYZAxis(0, math.PI, 0);
				pCamera.addPosition(v3fsp);
				pCamera.lookAt(v3fsp);
			}

			var pCamLight: ILightPoint = pScene.createLightPoint(ELightTypes.PROJECT, false, 0, "camera-light");

			console.log(<ISceneNode>pScene.getRootNode().findEntity("Camera001-camera"));
			pCamLight.attachToParent(<ISceneNode>pScene.getRootNode().findEntity("Camera001-camera"));

			pCamLight.setInheritance(ENodeInheritance.ALL);
			pCamLight.params.ambient.set(0.05, 0.05, 0.05, 1);
			pCamLight.params.diffuse.set(1.);
			pCamLight.params.specular.set(1.);
			pCamLight.params.attenuation.set(.35, 0, 0);
			pCamLight.enabled = false;

			self.cameraLight = pCamLight;

			loadModels("@CLOSED_BOX", (pBox: ISceneNode) => {
				pBox.scale(.25);
				putOnTerrain(pBox, new Vec3(-2., -3.85, -5.));
				pBox.addPosition(new Vec3(0., 1., 0.));
			});

			loadModels("@BARREL", (pBarrel: ISceneNode) => {
				pBarrel.scale(.75);
				pBarrel.setPosition(new Vec3(-30., -40.23, -15.00));
				pBarrel.setRotationByXYZAxis(-17. * math.RADIAN_RATIO, -8. * math.RADIAN_RATIO, -15. * math.RADIAN_RATIO);
			});

			loadModels("@TUBE", (pTube: ISceneNode) => {
				pTube.scale(19.);
				pTube.setRotationByXYZAxis(0. * math.RADIAN_RATIO, -55. * math.RADIAN_RATIO, 0.);
				pTube.setPosition(new Vec3(-16.  , -52.17  ,-66.));
			});

			loadModels("@TUBE_BETWEEN_ROCKS", (pTube: ISceneNode) => {
				pTube.scale(2.);
				pTube.setRotationByXYZAxis(5. * math.RADIAN_RATIO, 100. * math.RADIAN_RATIO, 0.);
				pTube.setPosition(new Vec3(-55., -12.15, -82.00));
			});

			pScene.bind("beforeUpdate", update);

			var pMovie: ICollada = <ICollada>pRmgr.loadModel("@HERO_INTRO");
			
			pMovie.bind("loaded", () => {

				var pAnim: IAnimation = pMovie.extractAnimation(0);
				var pContainer: IAnimationContainer = animation.createContainer(pAnim, "movie");
				var pController: IAnimationController = pEngine.createAnimationController("movie");
				
				pController.addAnimation(pContainer);
				pController.stop();

				pNode.addController(pController);

				self.hero.movie = pController;

				loaded();
				
			});


			fetchAllCameras();
		});
	}

	function main(pEngine: IEngine): void {
		setup();
		createSceneEnvironment();
		createCameras();
		createViewports();
		createTerrain();
		createSkyBox();
		createLighting();
		
		
/*
		loadModels("@MINER_MODEL");
		loadModels("@WINDSPOT_MODEL", (pNode: ISceneNode) => {
			pNode.setRelPosition(7.5, 0., 0.);
		});
		loadModels("@ROCK_MODEL", (pNode: ISceneNode) => {
			pNode.setRelPosition(0., 1., 5.);
		});

*/	}

	pEngine.bind("depsLoaded", main);		
	pEngine.exec();
}