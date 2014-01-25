/// <reference path="../../build/akra.d.ts" />

module akra {
	export var pEngine = akra.createEngine();
	export var pScene = pEngine.getScene();
	export var pCanvas: ICanvas3d = pEngine.getRenderer().getDefaultCanvas();
	export var pCamera: ICamera = null;
	export var pViewport: IViewport = null;

	function setup(pCanvas: ICanvas3d): void {
		var pCanvasElement: HTMLCanvasElement = (<any>pCanvas)._pCanvas;
		var pDiv: HTMLDivElement = <HTMLDivElement>document.createElement("div");

		document.body.appendChild(pDiv);
		pDiv.appendChild(pCanvasElement);
		pDiv.style.position = "fixed";
	}

	function createCamera(): ICamera {
		var pCamera: ICamera = pScene.createCamera();

		pCamera.addPosition(new math.Vec3(0, 4, 5));
		pCamera.addRelRotationByXYZAxis(-0.2, 0., 0.);
		pCamera.attachToParent(pScene.getRootNode());

		pCamera.update();

		return pCamera;
	}

	function createViewport(): IViewport {
		var pViewport: IViewport = new render.DSViewport(pCamera);
		pCanvas.addViewport(pViewport);
		pCanvas.resize(window.innerWidth, window.innerHeight);

		return pViewport;
	}

	function createLighting(): void {
		var pOmniLight: IOmniLight = <IOmniLight>pScene.createLightPoint(ELightTypes.OMNI, false, 0, "test-omni-0");

		pOmniLight.attachToParent(pScene.getRootNode());
		pOmniLight.setEnabled(true);
		pOmniLight.getParams().ambient.set(0.1, 0.1, 0.1, 1);
		pOmniLight.getParams().diffuse.set(0.5);
		pOmniLight.getParams().specular.set(1, 1, 1, 1);
		pOmniLight.getParams().attenuation.set(1, 0, 0);
		pOmniLight.setIsShadowCaster(false);

		pOmniLight.addPosition(1, 5, 3);
	}

	function createSkyBox(): void {
		var pSkyBoxTexture: ITexture = pEngine.getResourceManager().createTexture(".sky-box-texture");
		//pSkyBoxTexture.loadResource("../../../data/textures/skyboxes/sky_box1-1.dds");
		pSkyBoxTexture.loadResource("../../../src2/data/" + "textures/skyboxes/desert-2.dds");
		pSkyBoxTexture.loaded.connect((pTexture: ITexture) => {
			(<render.DSViewport>pViewport).setSkybox(pTexture);
		});
	}

	function main(pEngine: IEngine) {
		setup(pCanvas);

		pCamera = createCamera();
		pViewport = createViewport();

		createLighting();
		createSkyBox();

		pEngine.exec();
	}

	pEngine.depsLoaded.connect(main);
}