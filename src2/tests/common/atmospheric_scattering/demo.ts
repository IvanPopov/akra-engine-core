///<reference path="../../../bin/DEBUG/akra.ts"/>
///<reference path="../../../bin/DEBUG/Progress.ts"/>

#define int number
#define uint number
#define float number

#define vec2(...) Vec2.stackCeil.set(__VA_ARGS__)
#define vec3(...) Vec3.stackCeil.set(__VA_ARGS__)
#define vec4(...) Vec4.stackCeil.set(__VA_ARGS__)
#define quat4(...) Quat4.stackCeil.set(__VA_ARGS__)
#define mat3(...) Mat3.stackCeil.set(__VA_ARGS__)
#define mat4(...) Mat4.stackCeil.set(__VA_ARGS__)

declare var jQuery: JQueryStatic;
declare var $: JQueryStatic;


module akra {
	function createProgress(): IProgress {
		var pProgress: IProgress = new util.Progress();
		var pCanvas: HTMLCanvasElement = pProgress.canvas;

		pCanvas.style.position = "absolute";
	    pCanvas.style.left = "50%";
	    pCanvas.style.top = "50%";
	    pCanvas.style.zIndex = "100";
	    // pCanvas.style.display = "none";

	    pCanvas.style.marginTop = (-pProgress.height / 2) + "px";
	    pCanvas.style.marginLeft = (-pProgress.width / 2) + "px";

	    return pProgress;
	}

	var pProgress: IProgress = createProgress();

	var pOptions: IEngineOptions = {
		deps: {
			files: [
				{path: "models/hero/movie.dae", name: "HERO_MODEL"},
			]
		},
		loader: {
			before: (pManager: IDepsManager, pInfo: number[]): void => {
				pProgress.total = pInfo;

				document.body.appendChild(pProgress.canvas);
			},
			onload: (pManager: IDepsManager, iDepth: number, nLoaded: number, nTotal: number): void => {
				pProgress.element = nLoaded;
				pProgress.depth = iDepth;
				pProgress.draw();
			},
			loaded: (pManager: IDepsManager): void => {
				setTimeout(() => {
					document.body.removeChild(pProgress.canvas);
				}, 500);
			}
		}
	};


	export var pEngine: IEngine = createEngine(pOptions);
	var pCamera: ICamera = null;
	export var pViewport: IViewport = null;
	var pScene: IScene3d = pEngine.getScene();
	var pCanvas: ICanvas3d = pEngine.getRenderer().getDefaultCanvas();
	var pKeymap: controls.KeyMap = <controls.KeyMap>controls.createKeymap();
	var pUI: IUI = pEngine.getSceneManager().createUI();
	var pRmgr: IResourcePoolManager = pEngine.getResourceManager();

	var pEditDlg: IUIPopup = <IUIPopup>pUI.createComponent("Popup", {
					name: "edit-atmospheric-scattering-dlg",
					title: "Edit atmospheric scattering",
					template: "custom.Sky.tpl"
				});

	function createDialog() {
		pEditDlg.render($(document.body));

		var iHeight: int = pEditDlg.el.height();

		pEditDlg.el.css({
			height: "auto",
			width: "350px",
			fontSize: "12px",

			top: 'auto',
			left: 'auto',
			bottom: -iHeight, 
			right: "10"
		});
		
		pEditDlg.show();
		pEditDlg.el.animate({bottom: 0}, 350, "easeOutCirc");		
	}

	function createModelEntry(sResource: string): IModelEntry {
		var pModel: ICollada = <ICollada>pRmgr.colladaPool.findResource(sResource);
		var pModelRoot: IModelEntry = pModel.attachToScene(pScene);

		return pModelRoot;
	}

	function setup(): void {
		var pCanvasElement: HTMLCanvasElement = (<any>pCanvas)._pCanvas;
		var pDiv: HTMLDivElement = <HTMLDivElement>document.createElement("div");

		document.body.appendChild(pDiv);
		pDiv.appendChild(pCanvasElement);
		pDiv.style.position = "fixed";
	
		pKeymap.captureMouse((<webgl.WebGLCanvas>pCanvas).el);
		pKeymap.captureKeyboard(document);
	}

	function createCameras(): void {
		pCamera = pScene.createCamera();
		pCamera.attachToParent(pScene.getRootNode());
	
    	pCamera.setRotationByXYZAxis(0., Math.PI, 0.);
    	pCamera.setPosition(vec3(0.0, 10.0, 0.0));
    	pCamera.farPlane = MAX_UINT16;
    	// pCamera.lookAt(vec3(0.));
	}

	function createViewports(): void {
		pViewport = pCanvas.addViewport(pCamera, EViewportTypes.DSVIEWPORT);
		pCanvas.resize(window.innerWidth, window.innerHeight);
		window.onresize = function(event) {
			pCanvas.resize(window.innerWidth, window.innerHeight);
		}
	}

	function createLighting(): void {
		var pSunLight: IOmniLight = <IOmniLight>pScene.createLightPoint(ELightTypes.OMNI, true, 2048, "sun");
			
		pSunLight.attachToParent(pScene.getRootNode());
		pSunLight.enabled = true;
		pSunLight.params.ambient.set(.1, .1, .1, 1);
		pSunLight.params.diffuse.set(0.75);
		pSunLight.params.specular.set(1.);
		pSunLight.params.attenuation.set(1.25, 0, 0);

		pSunLight.addPosition(0, 500, 0);
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

	    //default camera.

	    if (pKeymap.isMousePress() && pKeymap.isMouseMoved()) {
	    	var v2fD: IOffset = pKeymap.getMouseShift();
	        var fdX = v2fD.x, fdY = v2fD.y;

	        fdX /= pCanvas.width / 10.0;
	        fdY /= pCanvas.height / 10.0;

	        pCamera.addRelRotationByEulerAngles(-fdX, -fdY, 0);
	    }
	}

	function createSceneEnvironment(): void {
		var pSceneQuad: ISceneModel = util.createQuad(pScene, 40000.);
		pSceneQuad.attachToParent(pScene.getRootNode());
		

		// var pSceneSurface: ISceneModel = util.createSceneSurface(pScene, 100);
		// pSceneSurface.scale(10.);
		// pSceneSurface.addPosition(0, 0.01, 0);
		// pSceneSurface.attachToParent(pScene.getRootNode());
		// pSceneSurface.mesh.getSubset(0).setVisible(true);
	}

	// var T = 0.0;
	export var pSky: model.Sky = null;

	function update(): void {
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

	function main(pEngine: IEngine) {
		setup();
		createDialog();
		createCameras();
		createViewports();
		createSceneEnvironment();
		createModelEntry("HERO_MODEL");
		// createLighting();

		pSky = new model.Sky(pEngine, 32, 32, 1000.0);
		pSky.setTime(0);

		var pSceneModel: ISceneModel = pSky.skyDome;



	    pSceneModel.attachToParent(pScene.getRootNode());
	    // pSceneModel.accessLocalBounds().set(MAX_UINT16, MAX_UINT16, MAX_UINT16);

	    // pScene.recursiveUpdate();
	    // console.log(pSceneModel.worldBounds.toString());

	    pKeymap.bind("P", () => {
			pSceneModel.mesh.getSubset(0).wireframe(true);
		});

		pKeymap.bind("M", () => {
			pSceneModel.mesh.getSubset(0).wireframe(false);
		});		

		function reloadParams(): void {
			for (var i = 0; i < pParams.length; ++ i) {
				(function (sParam): void {
					// console.log(sParam, (<IUILabel>pEditDlg.findEntity(sParam)));
					(<IUILabel>pEditDlg.findEntity(sParam)).text = String(pSky[sParam]);				
				})(pParams[i]);
			}
		}

		reloadParams();

		for (var i = 0; i < pParams.length; ++ i) {
			(function (sParam): void {
				(<IUILabel>pEditDlg.findEntity(sParam)).text = String(pSky[sParam]);				
				(<IUILabel>pEditDlg.findEntity(sParam)).bind("changed", (pLabel: IUILabel, sValue: string) => {
					console.log(sParam, parseFloat(sValue));
					pSky[sParam] = parseFloat(sValue);
					pSky.init();
					reloadParams();
				});
			})(pParams[i]);
		}
		
		var _fLastTime: float = 0;
		(<IUISlider>pEditDlg.findEntity("time")).bind("updated", (pSlider: IUISlider, fValue: float) => {
			console.log("time is: ", fValue);
			_fLastTime = fValue;
			pSky.setTime(fValue);
		});

		(<IUISlider>pEditDlg.findEntity("nm")).value = (<any>pEngine.getComposer()).kFixNormal * 1000;
		(<IUISlider>pEditDlg.findEntity("nm")).bind("updated", (pSlider: IUISlider, fValue: float) => {
			console.log("fix normal kof.", fValue / 1000.);
			(<any>pEngine.getComposer()).kFixNormal = fValue / 1000.;
		});

		(<IUISlider>pEditDlg.findEntity("spec")).value = (<any>pEngine.getComposer()).fSunSpecular * 1000;
		(<IUISlider>pEditDlg.findEntity("spec")).bind("updated", (pSlider: IUISlider, fValue: float) => {
			console.log("fSunSpecular kof.", fValue / 1000.);
			(<any>pEngine.getComposer()).fSunSpecular = fValue / 1000.;
		});

		(<IUISlider>pEditDlg.findEntity("ambient")).value = (<any>pEngine.getComposer()).fSunAmbient * 1000;
		(<IUISlider>pEditDlg.findEntity("ambient")).bind("updated", (pSlider: IUISlider, fValue: float) => {
			console.log("fSunAmbient kof.", fValue / 1000.);
			(<any>pEngine.getComposer()).fSunAmbient = fValue / 1000.;
		});

		//==
		
		(<IUISlider>pEditDlg.findEntity("cHeightFalloff")).value = (<any>pEngine.getComposer()).cHeightFalloff * 1000;
		(<IUISlider>pEditDlg.findEntity("cHeightFalloff")).bind("updated", (pSlider: IUISlider, fValue: float) => {
			console.log("cHeightFalloff kof.", fValue / 1000.);
			(<any>pEngine.getComposer()).cHeightFalloff = fValue / 1000.;
		});

		(<IUISlider>pEditDlg.findEntity("cGlobalDensity")).value = (<any>pEngine.getComposer()).cGlobalDensity * 1000;
		(<IUISlider>pEditDlg.findEntity("cGlobalDensity")).bind("updated", (pSlider: IUISlider, fValue: float) => {
			console.log("cGlobalDensity kof.", fValue / 1000.);
			(<any>pEngine.getComposer()).cGlobalDensity = fValue / 1000.;
		});

		//==

		


		(<IUISlider>pEditDlg.findEntity("_nHorinLevel")).value = pSky["_nHorinLevel"];
		(<IUISlider>pEditDlg.findEntity("_nHorinLevel")).bind("updated", (pSlider: IUISlider, fValue: float) => {
			console.log("_nHorinLevel: ", math.round(fValue));
			pSky["_nHorinLevel"] = (math.round(fValue));
			pSky.setTime(_fLastTime);
		});
	    
	    pScene.bind("beforeUpdate", update);

		pEngine.exec();
	}

	pEngine.bind("depsLoaded", main)
}