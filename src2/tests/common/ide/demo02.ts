#include "util/testutils.ts"
#include "akra.ts"
#include "controls/KeyMap.ts"
#include "ui/IDE.ts"
#include "util/SimpleGeometryObjects.ts"

/// @HERO_MODEL: {data}/models/hero/movie.dae|location()
/// @HERO_CONTROLLER: {data}/models/hero/movement.json|location()
/// @WINDSPOT_MODEL: {data}/models/windspot/WINDSPOT.DAE|location()
/// @MINER_MODEL: {data}/models/miner/miner.dae|location()
/// @ROCK_MODEL: {data}/models/rock/rock-1-low-p.DAE|location()
/// @TERRAIN_HEIGHT_MAP: {data}/textures/terrain/main_height_map_1025.dds|location()
/// @TERRAIN_NORMAL_MAP: {data}/textures/terrain/main_terrain_normal_map.dds|location()
/// @SKYBOX: {data}/textures/skyboxes/desert-3.dds|location()

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
	var pKeymap: IKeyMap				= controls.createKeymap();
	var pTerrain: ITerrain 				= null;

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
		cameraTerrainProj 	: <ISceneModel>null,
		terrain 			: <ITerrain>null,
		terrainLoaded		: false,

		hero: {
			root: 	<ISceneNode>null,
			head: 	<ISceneNode>null,
			pelvis: <ISceneNode>null
		}
	}

	var $div = $("<div>x, y, z</div>").css({
		position: "absolute", 
		background: "rgba(0,0,0,.75)", 
		border: "1px solid white", 
		color: "white",
		zIndex: "1000"
	});

	$(document).append($div);


	function setup(): void {
		pIDE = <ui.IDE>pUI.createComponent("IDE");
		pIDE.render($(document.body));

		pKeymap.captureMouse((<webgl.WebGLCanvas>pCanvas).el);
		pKeymap.captureKeyboard(document);

		pCanvas.bind(SIGNAL(viewportAdded), (pCanvas: ICanvas3d, pVp: IViewport) => {
			pViewport = self.viewport = pVp;
		});
	}

	function createCameras(): void {
		pCamera = self.camera = pScene.createCamera();
		pCamera.attachToParent(pScene.getRootNode());
	
		pCamera.addRelRotationByEulerAngles(-math.PI / 5., 0., 0.);
    	pCamera.addRelPosition(-8.0, 5.0, 11.0);
	}

	function createSceneEnvironment(): void {
		// var pSceneQuad: ISceneModel = util.createQuad(pScene, 500.);
		// pSceneQuad.attachToParent(pScene.getRootNode());

		var pSceneSurface: ISceneModel = util.createSceneSurface(pScene, 40);
		pSceneSurface.scale(5.);
		pSceneSurface.addPosition(0, 0.01, 0);
		pSceneSurface.attachToParent(pScene.getRootNode());

		var pCameraTerrainProj: ISceneModel = util.basis(pScene);

		pCameraTerrainProj.attachToParent(pScene.getRootNode());
		// pCameraTerrainProj.scale(.5);

		self.cameraTerrainProj = pCameraTerrainProj;
	}

	function createViewports(): void {
		pViewport = pCanvas.addViewport(pCamera, EViewportTypes.DSVIEWPORT);
	}

	function createLighting(): void {
		var pSunLight: ILightPoint = pScene.createLightPoint(ELightTypes.OMNI, true, 512, "sun");
			
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

		createAmbient("Ambient LB", vec3(-500, 500, -500));
		createAmbient("Ambient RB", vec3(500, 500, -500));
		createAmbient("Ambient LF", vec3(-500, 500, 500));
		createAmbient("Ambient RF", vec3(500, 500, 500));
	}




	function updateKeyboardControls(fLateralSpeed: float, fRotationSpeed: float): void {
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

	    var v3fOffset: IVec3 = vec3(0, 0, 0);
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
	    else if (pKeymap.isKeyPress(EKeyCodes.SPACE)) {
	        pEngine.isActive()? pEngine.pause(): pEngine.play();
	    }

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

		pTerrainMap["height"].bind(SIGNAL(loaded), (pTexture: ITexture) => {
			pTerrainMap["normal"] = pRmgr.loadImage("@TERRAIN_NORMAL_MAP");
			
			pTerrainMap["normal"].bind(SIGNAL(loaded), (pTexture: ITexture) => {
				var isCreate: bool = pTerrain.init(pTerrainMap, new geometry.Rect3d(-250, 250, -250, 250, 0, 200), 5, 5, 5, "main");
				pTerrain.attachToParent(pScene.getRootNode());
				pTerrain.setInheritance(ENodeInheritance.ALL);

				// pTerrain.scale(0.1);
				pTerrain.addRelRotationByXYZAxis(-Math.PI/2, 0, 0);
				pTerrain.setPosition(0., -pTerrain.localBounds.sizeZ(), 0.);
				// pTestNode.addRelRotationByXYZAxis(1, 1, 0);
				self.terrainLoaded = true;
			});
		});

		self.terrain = pTerrain;
	}

	function createSkyBox(): void {
		pSkyBoxTexture = pRmgr.createTexture(".sky-box-texture");
		pSkyBoxTexture.loadResource("@SKYBOX");

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

	function update(): void {
		updateCameras();
		self.keymap.update();

		var pProj: IVec3 = vec3();
		if (self.terrainLoaded && self.terrain.projectPoint(self.camera.worldPosition, pProj)) {
			self.cameraTerrainProj.setPosition(pProj);
			// $div.offset();
			console.log(self.viewport.projectPoint(pProj).toString());
		}
	}

	function main(pEngine: IEngine): void {
		setup();
		createSceneEnvironment();
		createCameras();
		createViewports();
		createTerrain();
		createSkyBox();
		createLighting();
		

		pScene.bind(SIGNAL(beforeUpdate), update);
		loadModels("@HERO_MODEL", (pNode: ISceneNode) => {
		});
/*
		loadModels("@MINER_MODEL");
		loadModels("@WINDSPOT_MODEL", (pNode: ISceneNode) => {
			pNode.setRelPosition(7.5, 0., 0.);
		});
		loadModels("@ROCK_MODEL", (pNode: ISceneNode) => {
			pNode.setRelPosition(0., 1., 5.);
		});

*/	}

	pEngine.bind(SIGNAL(depsLoaded), main);		
	pEngine.exec();
}