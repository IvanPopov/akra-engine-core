#include "akra.ts"
#include "controls/KeyMap.ts"
#include "util/SimpleGeometryObjects.ts"

/// @: demo.css|css()

/// @VEHABAR: 			{data}/models/vehabar/vehabar.dae|location()
/// @OIL: 				{data}/models/oil/oil.dae|location()
/// @CAN: 				{data}/models/can/can.dae|location()
/// @BARREL: 			{data}/models/barrel/barrel_and_support.dae|location()

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
		cameras 			: <ICamera[]>[],
		activeCamera  		: <int>null,
	}

	function setup(): void {

		var pCanvasElement: HTMLCanvasElement = (<any>pCanvas)._pCanvas;
		var pDiv: HTMLDivElement = <HTMLDivElement>document.createElement("div");

		document.body.appendChild(pDiv);
		pDiv.appendChild(pCanvasElement);


		pKeymap.captureMouse(pCanvasElement);
		pKeymap.captureKeyboard(document);

		pCanvas.bind(SIGNAL(viewportAdded), (pCanvas: ICanvas3d, pVp: IViewport) => {
			pViewport = self.viewport = pVp;
		});
	}

	function createCameras(): void {
		pCamera = self.camera = pScene.createCamera();
		pCamera.attachToParent(pScene.getRootNode());
	
    	pCamera.addRelPosition(0, 2.0, -2.0);
    	pCamera.lookAt(vec3(0., .75, 0.));

	}

	function createSceneEnvironment(): void {
		var pSceneQuad: ISceneModel = util.createQuad(pScene, 500.);
		pSceneQuad.attachToParent(pScene.getRootNode());
		// pSceneQuad.mesh.getSubset(0).setVisible(false);

		var pSceneSurface: ISceneModel = util.createSceneSurface(pScene, 100);
		// pSceneSurface.scale(5.);
		pSceneSurface.addPosition(0, 0.01, 0);
		pSceneSurface.attachToParent(pScene.getRootNode());
		// pSceneSurface.mesh.getSubset(0).setVisible(false);

		// var pCameraTerrainProj: ISceneModel = util.basis(pScene);

		// pCameraTerrainProj.attachToParent(pScene.getRootNode());
		// pCameraTerrainProj.scale(.25);

		// self.cameraTerrainProj = pCameraTerrainProj;
	}

	function createViewports(): void {
		pViewport = pCanvas.addViewport(pCamera, EViewportTypes.DSVIEWPORT);
		pViewport.backgroundColor = Color.BLACK;
		pCanvas.resize(window.innerWidth, window.innerHeight);
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


		pProject.setPosition(vec3(-5, 5, -5));
		pProject.lookAt(vec3(0., .75, 0.));	
	}




	function updateKeyboardControls(fLateralSpeed: float, fRotationSpeed: float): void {
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

	    var v3fOffset: IVec3 = vec3(0, 0, 0);
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

		// var pProj: IVec3 = vec3();
		// if (self.terrainLoaded && self.terrain.projectPoint(self.hero.root.worldPosition, pProj)) {
		// 	self.cameraTerrainProj.setPosition(pProj);

		// 	if (self.viewport.projectPoint(pProj)) {
		// 		var pOffset = $canvasContainer.offset();
		// 		$div.offset({left: pOffset.left + pProj.x, top: pOffset.top + pProj.y});
		// 	}
		// }
	}


	function main(pEngine: IEngine): void {
		setup();
		createSceneEnvironment();
		createCameras();
		createViewports();
		createLighting();

		pScene.bind(SIGNAL(beforeUpdate), update);
		
		loadModels("@OIL", (pNode: ISceneNode) => {
			pNode.addPosition(vec3(-.45, .75, 0.));

			pScene.bind(SIGNAL(beforeUpdate), () => {
				pNode.addRelRotationByXYZAxis(0.00, 0.003, 0);
			});
		});

		loadModels("@CAN", (pNode: ISceneNode) => {
			pNode.addPosition(vec3(.45, .75, 0.));

			pScene.bind(SIGNAL(beforeUpdate), () => {
				pNode.addRelRotationByXYZAxis(0.00, -0.003, 0);
			});
		});

		loadModels("@VEHABAR", (pNode: ISceneNode) => {
			pNode.addPosition(vec3(0., .75, .45));

			pScene.bind(SIGNAL(beforeUpdate), () => {
				pNode.addRelRotationByXYZAxis(0.00, -0.003, 0);
			});
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