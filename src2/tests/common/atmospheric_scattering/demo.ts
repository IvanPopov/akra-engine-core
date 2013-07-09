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


	var pEngine: IEngine = createEngine(pOptions);
	var pCamera: ICamera = null;
	var pViewport: IViewport = null;
	var pScene: IScene3d = pEngine.getScene();
	var pCanvas: ICanvas3d = pEngine.getRenderer().getDefaultCanvas();
	var pKeymap: controls.KeyMap = <controls.KeyMap>controls.createKeymap();

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
	
    	// pCamera.addRelPosition(0, 0, -50.0);
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
		var pSunLight: ILightPoint = pScene.createLightPoint(ELightTypes.OMNI, true, 2048, "sun");
			
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

	function update(): void {
		updateCameras();
		pKeymap.update();
	}

	function main(pEngine: IEngine) {
		setup();
		createCameras();
		createViewports();
		createLighting();

		var pSky = new model.Sky(pEngine, 32, 32, 500.0);
		var pMesh: IMesh = pSky.createDome(32, 32);

		pMesh.getSubset(0).wireframe();

		var pSceneModel: ISceneModel = pScene.createModel("dome");
	    pSceneModel.mesh = pMesh; 

	    pSceneModel.attachToParent(pScene.getRootNode());
	    
	    pScene.bind("beforeUpdate", update);

		pEngine.exec();
	}

	pEngine.bind("depsLoaded", main)
}