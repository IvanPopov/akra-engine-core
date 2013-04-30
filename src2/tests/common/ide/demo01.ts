#include "util/testutils.ts"
#include "akra.ts"
#include "controls/KeyMap.ts"
#include "ui/IDE.ts"
#include "util/SimpleGeometryObjects.ts"

/// @HERO_MODEL: {data}/models/hero/walk.dae|location()
/// @HERO_CONTROLLER: {data}/models/hero/movement.json|location()

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

	export var self = {
		engine: 	pEngine,
		scene: 		pScene,
		camera: 	pCamera,
		viewport: 	pViewport,
		canvas: 	pCanvas,
		rsmgr: 		pRmgr,
		renderer: 	pEngine.getRenderer(),
		keymap: 	<IKeyMap>null,
		gamepads: 	pGamepads,

		hero: {
			root: 	<ISceneNode>null,
			head: 	<ISceneNode>null,
			pelvis: <ISceneNode>null,

			camera: <ICamera>null
		}
	};

	function setup(): void {
		pIDE = <ui.IDE>pUI.createComponent("IDE");
		pIDE.render($(document.body));
	}

	function createCameras(): void {
		pCamera = pScene.createCamera();
		pCamera.attachToParent(pScene.getRootNode());
	
		pCamera.addRelRotationByEulerAngles(-math.PI / 5., 0., 0.);
    	pCamera.addRelRotationByEulerAngles(-8.0, 5.0, 11.0);
	}

	function createSceneEnvironment(): void {
		var pSceneQuad: ISceneModel = util.createQuad(pScene, 500.);
		pSceneQuad.attachToParent(pScene.getRootNode());

		var pSceneSurface: ISceneModel = util.createSceneSurface(pScene, 500);
		
		pSceneSurface.addPosition(0, 0.01, 0);
		pSceneSurface.attachToParent(pScene.getRootNode());
	}

	function createViewports(): void {
		pViewport = pCanvas.addViewport(pCamera, EViewportTypes.DSVIEWPORT);
	}

	function createLighting(): void {
		var pOmniLight: ILightPoint = pScene.createLightPoint(ELightTypes.OMNI, true, 512, "sun");
			
		pOmniLight.attachToParent(pScene.getRootNode());
		pOmniLight.enabled = true;
		pOmniLight.params.ambient.set(0.1, 0.1, 0.1, 1);
		pOmniLight.params.diffuse.set(1.);
		pOmniLight.params.specular.set(1, 1, 1, 1);
		pOmniLight.params.attenuation.set(1, 0, 0);

		pOmniLight.addPosition(0, 100, 100);

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

	function setupAnimation(): void {

	}

	function setupCameras(): void {
		var pCharacterCamera: ICamera = pScene.createCamera("character-camera");
	    var pCharacterRoot: ISceneNode = self.hero.root;
	    var pCharacterPelvis: ISceneNode = <ISceneNode>pCharacterRoot.findEntity("node-Bip001");
	    var pCharacterHead: ISceneNode = <ISceneNode>pCharacterRoot.findEntity("node-Bip001_Head");

	    pCharacterCamera.setInheritance(ENodeInheritance.POSITION);
	    pCharacterCamera.attachToParent(pCharacterRoot);
	    pCharacterCamera.setProjParams(Math.PI / 4.0, pCanvas.width / pCanvas.height, 0.1, 3000.0);
	    pCharacterCamera.setRelPosition(vec3(0, 2.5, -5));

	    self.hero.camera = pCharacterCamera;
	    self.hero.head = pCharacterHead;
	    self.hero.pelvis = pCharacterPelvis;
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
	        this.pause(true);
	    }

	    if (isCameraMoved) {
	        pCamera.addRelPosition(v3fOffset);
	    }
	}

	function updateCamera(): void {
		updateKeyboardControls(0.25, 0.05);

		var pKeymap: IKeyMap 			= self.keymap;
		var pGamepad: Gamepad 			= self.gamepads.find(0);
		var pCharacterCamera: ICamera 	= self.hero.camera;
		var pCamera: ICamera 			= self.camera;
		var pCanvas: ICanvas3d 			= self.canvas;
		var pViewport: IViewport 		= self.viewport;

	    if (pKeymap.isKeyPress(EKeyCodes.N1) ||
	        (pGamepad && pGamepad.buttons[EGamepadCodes.RIGHT_SHOULDER])) {
	        pCharacterCamera.lookAt(self.hero.head.worldPosition);
	        pViewport.setCamera(pCharacterCamera);
	    }
	    else if (pKeymap.isKeyPress(EKeyCodes.N2) ||
	             (pGamepad && pGamepad.buttons[EGamepadCodes.LEFT_SHOULDER])) {
	        pViewport.setCamera(pCamera);
	    }

	    if (pCharacterCamera.isActive()) {
	        return;
	    }

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
		

		loadModels("@HERO_MODEL", (pNode: ISceneNode) => {
			fopen("@HERO_CONTROLLER", "r").read((err: Error, content: string) => {
				if (!isNull(err)) {
					throw err;
				}
	
				pNode.addController((new io.Importer(pEngine)).import(content).getController());

				self.hero.root = pNode;

				setupCameras();
			});
		});
	}

	pEngine.bind(SIGNAL(depsLoaded), main);		
	pEngine.exec();
}