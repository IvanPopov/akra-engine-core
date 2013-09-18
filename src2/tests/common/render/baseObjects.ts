///<reference path="../../../bin/DEBUG/akra.ts"/>

#define int number
#define float number
#define uint number
#define SIGNAL(call) #call

module akra{
	export var pEngine: IEngine = createEngine();
	var pRmgr: IResourcePoolManager = pEngine.getResourceManager();
	var pScene: IScene3d = pEngine.getScene();
	var pCanvas: ICanvas3d = pEngine.getRenderer().getDefaultCanvas();
	var pViewport: IDSViewport = null;
	var pCamera: ICamera = null;

	function setup(){
		var pCanvasElement: HTMLCanvasElement = (<any>pCanvas)._pCanvas;
		var pDiv: HTMLDivElement = <HTMLDivElement>document.createElement("div");

		document.body.appendChild(pDiv);
		pDiv.appendChild(pCanvasElement);
		pDiv.style.position = "fixed";
	}

	function createCameras(): void {
		pCamera = pScene.createCamera();
		pCamera.attachToParent(pScene.getRootNode());

		pCamera.addRelRotationByEulerAngles(0., 0., 0.);
		pCamera.addRelPosition(0., 5.0, 11.0);
		pCamera.update();

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
		pViewport = new render.DSViewport(pCamera);
		pCanvas.addViewport(pViewport);

		pCanvas.resize(window.innerWidth, window.innerHeight);
		window.onresize = function(event) {
			pCanvas.resize(window.innerWidth, window.innerHeight);
		}
	}

	function createLighting(): void {
		var pOmniLight: IOmniLight = <IOmniLight>pScene.createLightPoint(ELightTypes.OMNI, true, 512, "test-omni-1");
		
		pOmniLight.attachToParent(pScene.getRootNode());
		pOmniLight.enabled = true;
		pOmniLight.params.ambient.set(0.1, 0.1, 0.1, 1);
		pOmniLight.params.diffuse.set(0.5);
		pOmniLight.params.specular.set(1, 1, 1, 1);
		pOmniLight.params.attenuation.set(1,0.0,0); 
		pOmniLight.isShadowCaster = false;

		pOmniLight.setPosition(1, 5, 5);
	}

	function createSceneEnvironment(): void {
		var pSceneSurface: ISceneModel = util.createSceneSurface(pScene, 40);
		pSceneSurface.addPosition(0, 0.01, 0);
		pSceneSurface.scale(5.);
		pSceneSurface.attachToParent(pScene.getRootNode());
	}

	function createObjects(): void {
		// var pSceneQuadA: ISceneModel = util.createQuad(pScene, 2.);
		// pSceneQuadA.attachToParent(pScene.getRootNode());
		// pSceneQuadA.setPosition(-4., 5., 0.);
		// pSceneQuadA.addRelRotationByXYZAxis(Math.PI/2, 0, 0);

		var pSceneQuadB: ISceneModel = util.createSimpleQuad(pScene, 2.);
		pSceneQuadB.attachToParent(pScene.getRootNode());
		pSceneQuadB.setPosition(4., 5., 0.);
		pSceneQuadB.addRelRotationByXYZAxis(Math.PI/2, 0, 0);
	}

	function main(pEngine: IEngine): void {
		setup();
		createCameras();
		createViewports();
		createLighting();
		// createSceneEnvironment();

		createObjects();

		pEngine.exec();
	}

	pEngine.bind(SIGNAL(depsLoaded), main);
}