/// <reference path="../../../built/Lib/akra.d.ts"/>
/// <reference path="../../../built/Lib/progress.addon.d.ts"/>
/// <reference path="../../../built/Lib/base3dObjects.addon.d.ts"/>
/// <reference path="../../../built/Lib/compatibility.addon.d.ts"/>

/// <reference path="../idl/3d-party/dat.gui.d.ts" />

declare var AE_RESOURCES: akra.IDep;


module akra {
	addons.compatibility.verify("non-compatible");

	var pProgress = new addons.Progress(document.getElementById("progress"));
	var pRenderOpts: IRendererOptions = {
		premultipliedAlpha: false,
		//for screenshoting
		preserveDrawingBuffer: true,
		//for black background & and avoiding composing with other html
		alpha: true,
	};

	var pDeps: IDependens = {
		root: "./",
		files: [AE_RESOURCES]
	};

	var pOptions: IEngineOptions = {
		renderer: pRenderOpts,
		progress: pProgress.getListener(),
		deps: pDeps
	};


	export var pEngine: IEngine = createEngine(pOptions);

	var pCamera: ICamera = null;
	var pViewport: IViewport = null;
	var pScene: IScene3d = pEngine.getScene();
	var pCanvas: ICanvas3d = pEngine.getRenderer().getDefaultCanvas();
	var pKeymap: control.KeyMap = <control.KeyMap>control.createKeymap();
	var pComposer: fx.Composer = <fx.Composer>pEngine.getComposer();

	export var pDragon: ISceneNode = null;

	var pRmgr: IResourcePoolManager = pEngine.getResourceManager();


	function createModelEntry(sResource: string): IModelEntry {
		var pModel: ICollada = <ICollada>pRmgr.getColladaPool().findResource(sResource);
		var pModelRoot: IModelEntry = pModel.attachToScene(pScene.getRootNode());

		return pModelRoot;
	}

	function setup(): void {
		var pCanvasElement: HTMLCanvasElement = (<any>pCanvas)._pCanvas;
		var pDiv: HTMLDivElement = <HTMLDivElement>document.createElement("div");

		document.body.appendChild(pDiv);
		pDiv.appendChild(pCanvasElement);
		pDiv.style.position = "fixed";

		pKeymap.captureMouse((<webgl.WebGLCanvas>pCanvas).getElement());
		pKeymap.captureKeyboard(document);
	}

	function createCameras(): void {
		pCamera = pScene.createCamera();
		pCamera.attachToParent(pScene.getRootNode());

		pCamera.setRotationByXYZAxis(0., Math.PI, 0.);
		//pCamera.setPosition(-0.3016333281993866, 0.6858968138694763, -0.8825510144233704);
		//{ x: 0.008565357068199952, y: 0.9979711939303939, z: -0.019909111055309386, w: -0.059864497313835335 }

		// pCamera.farPlane = MAX_UINT16;
		// pCamera.lookAt(vec3(0.));
	}

	function createViewports(): void {
		pViewport = pCanvas.addViewport(new render.LPPViewport(pCamera));
		pCanvas.resize(window.innerWidth, window.innerHeight);
		window.onresize = function (event) {
			pCanvas.resize(window.innerWidth, window.innerHeight);
		}
	}

	function createLighting(): void {
		var pSunLight: IOmniLight = <IOmniLight>pScene.createLightPoint(ELightTypes.OMNI, true, 2048, "sun");

		pSunLight.attachToParent(pScene.getRootNode());
		pSunLight.setEnabled(true);
		pSunLight.getParams().ambient.set(.1, .1, .1, 1);
		pSunLight.getParams().diffuse.set(0.75);
		pSunLight.getParams().specular.set(1.);
		pSunLight.getParams().attenuation.set(1.25, 0, 0);

		pSunLight.addPosition(10, 10, 0);
	}

	var v3fOffset: IVec3 = new Vec3;
	function updateKeyboardControls(fLateralSpeed: number, fRotationSpeed: number): void {

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
		var isCameraMoved: boolean = false;

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

		//default camera.

		if (pKeymap.isMousePress() && pKeymap.isMouseMoved()) {
			var v2fD: IOffset = pKeymap.getMouseShift();
			var fdX = v2fD.x, fdY = v2fD.y;

			fdX /= pCanvas.getWidth() / 10.0;
			fdY /= pCanvas.getHeight() / 10.0;

			pCamera.addRelRotationByEulerAngles(-fdX, -fdY, 0);
		}
	}
	export var pCylinder: ISceneModel = null;

	function createSceneEnvironment(pRoot: ISceneNode = pScene.getRootNode()): void {
		addons.createQuad(pScene, 600.).attachToParent(pRoot);
		//pCylinder = addons.cylinder(pScene, 5., 5., 5., 100, 1, true);
		//pCylinder.setPosition(0, 4., 0);
		//pCylinder.attachToParent(pRoot);
		//pCylinder.getScene().beforeUpdate.connect(() => {
		//	pCylinder.addRotationByXYZAxis(0.002, 0.002, 0.002);
		//});
	}

	// var T = 0.0;
	export var pSky: model.Sky = null;

	function update(): void {
		pDragon.addRotationByEulerAngles(0.01, 0., 0.0);
		updateCameras();
		pKeymap.update();
		// pSky.setTime(T);
		// T += 0.02;
		// console.log(T);
	}

	var pParams: string[] = [
		"_fKr",
		"_fKm",
		"_fESun",
		"_fg",
		"_fExposure",
		"_fInnerRadius",
		"_fRayleighScaleDepth",
		"_fMieScaleDepth",
	];

	export var pLight: IOmniLight = null;

	function main(pEngine: IEngine) {
		setup();

		createCameras();
		createViewports();

		createSceneEnvironment();
		//pDragon = createModelEntry("CUBE.DAE");
		pDragon = createModelEntry("SEYMOURPLANE.DAE");
		//pDragon.addOrbitRotationByXYZAxis(-math.HALF_PI, 0., 0).update();
		pDragon.setPosition(0., 1, 0.).scale(.25).update();
		//createLighting();


		pSky = new model.Sky(pEngine, 32, 32, 1000.0);
		pSky.setTime(13);
		//pSky.sun.setEnabled(false);


		pCamera.setRotationByForwardUp(pSky.getSunDirection().negate(Vec3.temp()), Vec3.temp(0, 1., 0));
		pCamera.setPosition(-0.7, 0.9356149435043335, -12.079059600830078);
		pCamera.update();


		var pSceneModel: ISceneModel = pSky.skyDome;



		pSceneModel.attachToParent(pScene.getRootNode());
		// pSceneModel.accessLocalBounds().set(MAX_UINT16, MAX_UINT16, MAX_UINT16);

		// pScene.recursiveUpdate();
		// console.log(pSceneModel.worldBounds.toString());

		pKeymap.bind("P", () => {
			pSceneModel.getMesh().getSubset(0).wireframe(true);
		});

		pKeymap.bind("M", () => {
			pSceneModel.getMesh().getSubset(0).wireframe(false);
		});


		//pLight = <IOmniLight>pScene.createLightPoint(ELightTypes.OMNI, false);
		//pLight.attachToParent(pScene.getRootNode());
		//pLight.setPosition(0, 10, 0);
		//pLight.setEnabled(true);
		//pLight.getParams().diffuse.set(1);
		//pLight.getParams().attenuation.set(1, 0, 0);

		var pGUI = new dat.GUI(); 
		pGUI.add(pComposer, "kFixNormal", 0., 1.).step(0.01).name("light transmission");
		pGUI.add(pComposer, "fSunSpecular", 0., 1.).step(0.01).name("sun specular");
		pGUI.add(pComposer, "fSunAmbient", 0., 1.).step(0.01).name("sun ambient");

		var pFog = pGUI.addFolder("fog");
		pFog.add(pComposer, "cHeightFalloff", 0., 1.).step(0.01).name("height falloff");
		pFog.add(pComposer, "cGlobalDensity", 0., 0.25).step(0.001).name("global density");

		//pGUI.add(pSky, "_nHorinLevel", 1., pSky.getSize()).step(1.).name("horizont level").onChange(() => { pSky.setTime(pSky.time);});

		pGUI.add({ time: pSky.time }, "time", 0., 24).step(0.1).onChange((t: float) => {
			pSky.setTime(t);
		});

		var f = pGUI.addFolder("wave length");
		var v3fWaveLength = pSky.getWaveLength(new Vec3);
		var cb = () => { pSky.setWaveLength(v3fWaveLength); pSky.setTime(pSky.time); }
		(<dat.NumberControllerSlider>f.add(v3fWaveLength, "x")).min(0.).onChange(cb);
		(<dat.NumberControllerSlider>f.add(v3fWaveLength, "y")).min(0.).onChange(cb);
		(<dat.NumberControllerSlider>f.add(v3fWaveLength, "z")).min(0.).onChange(cb);


		

		//cHeightFalloff
		//cGlobalDensity
		//_nHorinLevel -- // pSky.setTime(_fLastTime);

		pScene.beforeUpdate.connect(update);

		pProgress.destroy();
		pEngine.exec();
	}

	pEngine.ready(main);
}