/// <reference path="../../build/akra.d.ts" />
/// <reference path="../../build/addons/base3dObjects.addon.d.ts" />

module akra {
	export var pEngine = akra.createEngine();
	export var pScene = pEngine.getScene();
	export var pCanvas: ICanvas3d = pEngine.getRenderer().getDefaultCanvas();
	export var pCamera: ICamera = null;
	export var pViewport: IViewport = null;
	export var pRmgr: IResourcePoolManager = pEngine.getResourceManager();
	var data = "../../../src2/data/";

	function setup(pCanvas: ICanvas3d): void {
		var pCanvasElement: HTMLCanvasElement = (<any>pCanvas)._pCanvas;
		var pDiv: HTMLDivElement = <HTMLDivElement>document.createElement("div");

		document.body.appendChild(pDiv);
		pDiv.appendChild(pCanvasElement);
		pDiv.style.position = "fixed";
	}

	function createSceneEnvironment(): void {
		var pSceneQuad: ISceneModel = addons.createQuad(pScene, 100.);
		pSceneQuad.attachToParent(pScene.getRootNode());

		var pSceneSurface: ISceneModel = addons.createSceneSurface(pScene, 40);
		pSceneSurface.addPosition(0, 0.01, 0);
		pSceneSurface.scale(5.);
		pSceneSurface.attachToParent(pScene.getRootNode());
	}

	function createCamera(): ICamera {
		var pCamera: ICamera = pScene.createCamera();

		pCamera.addPosition(new math.Vec3(0, 4, 5));
		pCamera.addRelRotationByXYZAxis(-0.2, 0., 0.);
		pCamera.attachToParent(pScene.getRootNode());

		pCamera.update();

		return pCamera;
	}

	function createKeymap(pCamera: ICamera): void {
		var pKeymap: IKeyMap = control.createKeymap();
		pKeymap.captureMouse((<any>pCanvas)._pCanvas);
		pKeymap.captureKeyboard(document);

		pScene.beforeUpdate.connect(() => {
			if (pKeymap.isMousePress() && pKeymap.isMouseMoved()) {
				var v2fMouseShift: IOffset = pKeymap.getMouseShift();

				var fdX = v2fMouseShift.x / pViewport.getActualWidth() * 10.0;
				var fdY = v2fMouseShift.y / pViewport.getActualHeight() * 10.0;

				pCamera.setRotationByXYZAxis(-fdY, -fdX, 0);

				var fSpeed: float = 0.1 * 1 / 5;
				if (pKeymap.isKeyPress(EKeyCodes.W)) {
					pCamera.addRelPosition(0, 0, -fSpeed);
				}
				if (pKeymap.isKeyPress(EKeyCodes.S)) {
					pCamera.addRelPosition(0, 0, fSpeed);
				}
				if (pKeymap.isKeyPress(EKeyCodes.A)) {
					pCamera.addRelPosition(-fSpeed, 0, 0);
				}
				if (pKeymap.isKeyPress(EKeyCodes.D)) {
					pCamera.addRelPosition(fSpeed, 0, 0);
				}
			}
		});
	}

	function createViewport(): IViewport {
		var pViewport: IViewport = new render.DSViewport(pCamera);
		pCanvas.addViewport(pViewport);
		pCanvas.resize(window.innerWidth, window.innerHeight);

		//(<render.DSViewport>pViewport).setFXAA(false);
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
		pOmniLight.setShadowCaster(false);

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

	function loadModel(sPath, fnCallback?: Function): ISceneNode {
		var pModelRoot: ISceneNode = pScene.createNode();
		var pModel: ICollada = <ICollada>pEngine.getResourceManager().loadModel(sPath);

		pModelRoot.attachToParent(pScene.getRootNode());

		function fnLoadModel(pModel: ICollada): void {
			pModel.attachToScene(pModelRoot);

			if (pModel.isAnimationLoaded()) {
				var pController: IAnimationController = pEngine.createAnimationController();
				var pContainer: IAnimationContainer = animation.createContainer();
				var pAnimation: IAnimation = pModel.extractAnimation(0);

				pController.attach(pModelRoot);

				pContainer.setAnimation(pAnimation);
				pContainer.useLoop(true);
				pController.addAnimation(pContainer);
			}

			pScene.beforeUpdate.connect(() => {
				pModelRoot.addRelRotationByXYZAxis(0.00, 0.01, 0);
				// pController.update();
			});

			if (isFunction(fnCallback)) {
				fnCallback(pModelRoot);
			}
		}

		if (pModel.isResourceLoaded()) {
			fnLoadModel(pModel);
		}
		else {
			pModel.loaded.connect(fnLoadModel);
		}

		return pModelRoot;
	}

	function loadManyModels(nCount: uint, sPath: string): void {
		var iRow: uint = 0;
		var iCountInRow: uint = 0;

		var fDX: float = 2.;
		var fDZ: float = 2.;

		var fShiftX: float = 0.;
		var fShiftZ: float = 0.;

		var pCube: ISceneNode = pCube = loadModel(sPath, (pModelRoot: ISceneNode) => {
			for (var i: uint = 0; i < nCount; i++) {
				if (iCountInRow > iRow) {
					iCountInRow = 0;
					iRow++;

					fShiftX = -iRow * fDX / 2;
					fShiftZ = -iRow * fDZ;
				}

				pCube = i === 0 ? pCube : loadModel(sPath);
				pCube.setPosition(fShiftX, 0.8, fShiftZ - 2.);
				pCube.scale(0.1);

				fShiftX += fDX;
				iCountInRow++;
			}
			//pEngine.renderFrame();
		});
	}

	function loadHero() {
		var pModelRoot: ISceneNode = pScene.createNode();
		var pController: IAnimationController = pEngine.createAnimationController("movie");
		var pHeroData: ICollada = <ICollada>pRmgr.loadModel(data + "models/hero/movie.DAE");

		pModelRoot.attachToParent(pScene.getRootNode());

		pHeroData.loaded.connect(() => {
			pHeroData.attachToScene(pModelRoot);

			var pMovieData: ICollada = <ICollada>pRmgr.loadModel(data + "models/hero/movie_anim.DAE");

			pMovieData.loaded.connect(() => {
				var pAnim: IAnimation = pMovieData.extractAnimation(0);
				var pMovie: IAnimationContainer = animation.createContainer(pAnim, "movie");

				pMovie.useLoop(true);

				// LOG(pMovieData);
				// window["movieData"] = pMovieData;

				// pController.addAnimation(pMovie);
				// pMovie.rightInfinity(false);
				// pController.stop();

				var pWalkData: ICollada = <ICollada>pRmgr.loadModel(data + "models/hero/walk.DAE");
				pWalkData.loaded.connect(() => {
					var pAnim: IAnimation = pWalkData.extractAnimation(0);
					var pWalk: IAnimationContainer = animation.createContainer(pAnim, "walk");

					pWalk.useLoop(true);

					var pBlender: IAnimationBlend = animation.createBlend();
					// pBlender.addAnimation(pMovie, 1);
					pBlender.addAnimation(pWalk, 1);

					pController.addAnimation(pBlender);
					pModelRoot.addController(pController);

				});
			});
		});

	}

	function main(pEngine: IEngine) {
		setup(pCanvas);

		pCamera = createCamera();
		pViewport = createViewport();

		createKeymap(pCamera);

		//createSceneEnvironment();
		createLighting();
		createSkyBox();

		//loadHero();
		//loadManyModels(400, data + "models/cube.dae");
		//loadManyModels(150, data + "models/box/opened_box.dae");
		loadModel(data + "models/WoodSoldier/WoodSoldier.DAE").addPosition(0., 1.1, 0.);

		pEngine.exec();
		//pEngine.renderFrame();
	}

	pEngine.depsLoaded.connect(main);
}