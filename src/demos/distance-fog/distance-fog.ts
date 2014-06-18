/// <reference path="../../../built/Lib/akra.d.ts" />
/// <reference path="../../../built/Lib/base3dObjects.addon.d.ts" />
/// <reference path="../../../built/Lib/progress.addon.d.ts" />

/// <reference path="../std/std.ts" />

/// <reference path="../idl/3d-party/dat.gui.d.ts" />

declare var AE_RESOURCES: akra.IDep;

module akra {
	var pProgress = new addons.Progress(document.getElementById("progress"));

	var pRenderOpts: IRendererOptions = {
		alpha: true,
		depth: true,
		premultipliedAlpha: true,
		antialias: true,
		//for screenshoting
		preserveDrawingBuffer: true,
		//for black background & and avoiding composing with other html
	};

	var pOptions: IEngineOptions = {
		renderer: pRenderOpts,
		progress: pProgress.getListener(),
		deps: { files: [AE_RESOURCES], root: "./" }
	};

	export var pEngine = akra.createEngine(pOptions);

	export var pScene = pEngine.getScene();
	export var pCanvas: ICanvas3d = pEngine.getRenderer().getDefaultCanvas();
	export var pCamera: ICamera = null;
	export var pViewport: IViewport = null;
	export var pRmgr: IResourcePoolManager = pEngine.getResourceManager();

	function createCamera(): ICamera {
		var pCamera: ICamera = pScene.createCamera();

		pCamera.addPosition(Vec3.temp(-2.9563467216312262, 3.900536759964575, -15.853719720993343));
		pCamera.setRotation(Quat4.temp(-0.0002096413471319314, 0.999332356829426, -0.005808150890586638, -0.03607023740685555));
		pCamera.attachToParent(pScene.getRootNode());

		pCamera.update();

		return pCamera;
	}

	function createKeymap(pCamera: ICamera): void {
		var pKeymap: IKeyMap = control.createKeymap();
		pKeymap.captureMouse((<any>pCanvas).getElement());
		pKeymap.captureKeyboard(document);

		pScene.beforeUpdate.connect(() => {
			if (pKeymap.isMousePress()) {
				if (pKeymap.isMouseMoved()) {
					var v2fMouseShift: IOffset = pKeymap.getMouseShift();

					pCamera.addRelRotationByXYZAxis(-(v2fMouseShift.y / pViewport.getActualHeight() * 10.0), 0., 0.);
					pCamera.addRotationByXYZAxis(0., -(v2fMouseShift.x / pViewport.getActualWidth() * 10.0), 0.);

					pKeymap.update();
				}

			}
			var fSpeed: float = 0.1 * 10;
			if (pKeymap.isKeyPress(EKeyCodes.W)) {
				pCamera.addRelPosition(0, 0, -fSpeed);
			}
			if (pKeymap.isKeyPress(EKeyCodes.S)) {
				pCamera.addRelPosition(0, 0, fSpeed);
			}
			if (pKeymap.isKeyPress(EKeyCodes.A) || pKeymap.isKeyPress(EKeyCodes.LEFT)) {
				pCamera.addRelPosition(-fSpeed, 0, 0);
			}
			if (pKeymap.isKeyPress(EKeyCodes.D) || pKeymap.isKeyPress(EKeyCodes.RIGHT)) {
				pCamera.addRelPosition(fSpeed, 0, 0);
			}
			if (pKeymap.isKeyPress(EKeyCodes.UP) || pKeymap.isKeyPress(EKeyCodes.Q)) {
				pCamera.addRelPosition(0, fSpeed, 0);
			}
			if (pKeymap.isKeyPress(EKeyCodes.DOWN) || pKeymap.isKeyPress(EKeyCodes.E)) {
				pCamera.addRelPosition(0, -fSpeed, 0);
			}
		});
	}

	function createViewport(): IViewport3D {
		var pViewport: ILPPViewport = new render.DSViewport(pCamera);
		pCanvas.addViewport(pViewport);
		pCanvas.resize(window.innerWidth, window.innerHeight);

		pViewport.getEffect().addComponent("akra.system.linearFog");
		pViewport.getEffect().addComponent("akra.system.exponentialFog");
		window.onresize = function (event) {
			pCanvas.resize(window.innerWidth, window.innerHeight);
		};

		var counter = 0;
		var pEffect = (<render.LPPViewport>pViewport).getEffect();

		var pGUI = new dat.GUI();

		var fogType = {
			none: 0,
			linear: 1,
			exponential: 2
		};

		var pFogData = {
			fogColor: 0,
			fogStart: 35,
			fogIndex: 15
		};

		var pFogFolder = pGUI.addFolder("fog");
		var iFogType = 2;
		(<dat.OptionController>pFogFolder.add({ FogType: "exponential" }, 'FogType', Object.keys(fogType))).name("Type of fog").onChange((sKey) => {
			iFogType = fogType[sKey];
		});
		(<dat.NumberControllerSlider>pFogFolder.add(pFogData, 'fogColor')).min(0.).max(1.).step(0.01).name("color").__precision = 2;
		(<dat.NumberControllerSlider>pFogFolder.add(pFogData, 'fogStart')).min(0.).max(200.).name("start");
		(<dat.NumberControllerSlider>pFogFolder.add(pFogData, 'fogIndex')).min(0.01).max(200.).name("index");

		(<IShadedViewport>pViewport).setShadingModel(EShadingModel.PBS_SIMPLE);

		pViewport.render.connect((pViewport: IViewport, pTechnique: IRenderTechnique,
			iPass: uint, pRenderable: IRenderableObject, pSceneObject: ISceneObject) => {

			var pDeferredTexture: ITexture = (<IDSViewport>pViewport).getTextureWithObjectID();
			var pDepthTexture: ITexture = (<render.LPPViewport>pViewport).getDepthTexture();
			var pPass: IRenderPass = pTechnique.getPass(iPass);

			var v3fLightDir: IVec3 = math.Vec3.temp(math.Vec3.temp(pLight.getWorldPosition()).subtract(pCamera.getWorldPosition()).normalize());
			var pLightInDeviceSpace: IVec3 = math.Vec3.temp();
			pCamera.projectPoint(math.Vec3.temp(pCamera.getWorldPosition()).add(v3fLightDir), pLightInDeviceSpace);

			pLightInDeviceSpace.x = (pLightInDeviceSpace.x + 1) / 2;
			pLightInDeviceSpace.y = (pLightInDeviceSpace.y + 1) / 2;

			if (iFogType == 0) {
				pPass.setForeign("USE_LINEAR_FOG", false);
				pPass.setForeign("USE_EXPONENTIAL_FOG", false);
			}
			else if (iFogType == 1) {
				pPass.setForeign("USE_LINEAR_FOG", true);
				pPass.setForeign("USE_EXPONENTIAL_FOG", false);
			}
			else if (iFogType == 2) {
				pPass.setForeign("USE_LINEAR_FOG", false);
				pPass.setForeign("USE_EXPONENTIAL_FOG", true);
			}
			pPass.setUniform("FOG_COLOR", new math.Vec3(pFogData.fogColor));
			pPass.setUniform("FOG_START", pFogData.fogStart);
			pPass.setUniform("FOG_INDEX", pFogData.fogIndex);

			pPass.setUniform("SCREEN_ASPECT_RATIO",
				math.Vec2.temp(pViewport.getActualWidth() / pViewport.getActualHeight(), 1.));

		});
		return pViewport;
	}

	// Light sources data
	var omniLightAttenuation: math.Vec3 = new math.Vec3(1., 0., 0.);
	var lightDiffColor: color.Color = new Color(0.2, 0.2, 0.2, 1.0);
	var spiralRadius: float = 40.;

	var omniLightConst: uint = 4;
	var lightPoss1: Array<math.Vec3> = [
		new math.Vec3(0, 11, 16),
		new math.Vec3(0, 6, 16),
		new math.Vec3(0, 3, 16),
		new math.Vec3(0, 0, 16)];

	var omniLightRound: uint = 4;
	var lightPoss2: Array<math.Vec3> = [
		new math.Vec3(0, 0, -(spiralRadius + 2.)),
		new math.Vec3(0, 0, (spiralRadius + 2.)),
		new math.Vec3((spiralRadius + 2.), 0, 0),
		new math.Vec3(-(spiralRadius + 2.), 0, 0)];

	var nd = pScene.createNode();
	nd.attachToParent(pScene.getRootNode());
	nd.setPosition(0., 6., 20.);
	var orbitalAngSpeed: float = 0.001
	var totalLightSources: uint = 20;

	function spiralPosition(i: uint): float {
		return -spiralRadius + 2. * spiralRadius * i / totalLightSources;
	};

	function spiralRotation(i: uint): float {
		return orbitalAngSpeed * 5 * Math.abs(i - totalLightSources / 2) / totalLightSources;
	};

	export var pLight: IOmniLight = null;
	function createLighting(): void {
		var pOmniLight: IOmniLight;

		// Four constant points of light in front of objects
		for (var i = 0; i < omniLightConst; i++) {
			pOmniLight = <IOmniLight>pScene.createLightPoint(ELightTypes.OMNI, false, 512, "omni-light-const-" + i.toString());
			pOmniLight.attachToParent(pScene.getRootNode());
			pOmniLight.setEnabled(true);
			pOmniLight.getParams().ambient.set(0);
			pOmniLight.getParams().diffuse.set(lightDiffColor);
			pOmniLight.getParams().specular.set(lightDiffColor);
			pOmniLight.getParams().attenuation.set(omniLightAttenuation);
			pOmniLight.setShadowCaster(false);
			pOmniLight.addPosition(lightPoss1[i]);
		};

		// Moving lights in round
		var pOmniLightRoundList: IOmniLight[] = new Array(omniLightRound);
		for (var i = 0; i < omniLightRound; i++) {
			pOmniLight = <IOmniLight>pScene.createLightPoint(ELightTypes.OMNI, false, 512, "omni-light-const-" + i.toString());
			pOmniLight.attachToParent(nd);
			pOmniLight.setEnabled(true);
			pOmniLight.getParams().ambient.set(0);
			pOmniLight.getParams().diffuse.set(lightDiffColor);
			pOmniLight.getParams().specular.set(lightDiffColor);
			pOmniLight.getParams().attenuation.set(omniLightAttenuation);
			pOmniLight.setShadowCaster(false);
			pOmniLight.addRelPosition(lightPoss2[i]);
			pOmniLightRoundList[i] = pOmniLight;
		};
		pScene.beforeUpdate.connect(() => {
			for (var i = 0; i < omniLightRound; i++) {
				pOmniLightRoundList[i].addOrbitRotationByEulerAngles(orbitalAngSpeed, 0, 0);
			}
		})

		// Moving lights in spiral
		var pOmniLightSpiralList: IOmniLight[] = new Array(totalLightSources);
		for (var i = 0; i < totalLightSources; i++) {
			pOmniLightSpiralList[i] = <IOmniLight>pScene.createLightPoint(ELightTypes.OMNI, false, 512, "omni-light-spiral-" + i.toString());
			pOmniLightSpiralList[i].attachToParent(nd);
			pOmniLightSpiralList[i].setEnabled(true);
			pOmniLightSpiralList[i].getParams().ambient.set(0);
			pOmniLightSpiralList[i].getParams().diffuse.set(lightDiffColor);
			pOmniLightSpiralList[i].getParams().specular.set(lightDiffColor);
			pOmniLightSpiralList[i].getParams().attenuation.set(omniLightAttenuation);
			pOmniLightSpiralList[i].setShadowCaster(false);
			pOmniLightSpiralList[i].addRelPosition(spiralPosition(i), 0, 0);
		};
		pScene.beforeUpdate.connect(() => {
			for (var i = 0; i < totalLightSources; i++) {
				pOmniLightSpiralList[i].addOrbitRotationByEulerAngles(spiralRotation(i), 0, 0);
			}
		})

		pLight = pOmniLight;
	}

	function loadModel(sPath, fnCallback?: Function, name?: String, pRoot?: ISceneNode): ISceneNode {
		var pModelRoot: ISceneNode = pScene.createNode();
		var pModel: ICollada = <ICollada>pEngine.getResourceManager().loadModel(sPath);

		pModelRoot.setName(name || sPath.match(/[^\/]+$/)[0] || 'unnamed_model');
		pModelRoot.attachToParent(pRoot || pScene.getRootNode());
		pModelRoot.setInheritance(ENodeInheritance.ROTPOSITION);

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
				pModelRoot.addRelRotationByXYZAxis(0, 0, 0);
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

	function createStatsDIV() {
		var pStatsDiv = document.createElement("div");

		document.body.appendChild(pStatsDiv);
		pStatsDiv.setAttribute("style",
			"position: fixed;" +
			"max-height: 40px;" +
			"max-width: 120px;" +
			"color: green;" +
			"margin: 5px;");

		return pStatsDiv;
	}

	function main(pEngine: IEngine) {
		std.setup(pCanvas);

		pCamera = createCamera();
		pViewport = createViewport();
		pViewport.setBackgroundColor(color.BLACK);
		pViewport.setClearEveryFrame(true);

		var pStatsDiv = createStatsDIV();

		pCanvas.postUpdate.connect((pCanvas: ICanvas3d) => {
			pStatsDiv.innerHTML = pCanvas.getAverageFPS().toFixed(2) + " fps";
		});

		createKeymap(pCamera);
		pCamera.setFOV(Math.PI / 4);

		window.onresize = () => {
			pCanvas.resize(window.innerWidth, window.innerHeight);
		};

		createLighting();

		/////////////////// LIGHT SOURCES MARKS
		// Four constant points of light in front of objects
		var pSphere = pEngine.getResourceManager().getColladaPool().loadResource("SPHERE.DAE");
		var pCube = pEngine.getResourceManager().getColladaPool().loadResource("CUBE.DAE");

		for (var i = 0; i < omniLightConst; i++) {
			var pModelRoot: ISceneModel = window["cube_olc_" + i] = pCube.extractModel(pScene);//addons.cube(pScene);

			var pMat: IMaterial = pModelRoot.getMesh().getSubset(0).getMaterial();
			pMat.shininess = 0.;
			pMat.specular = new Color(0.0, 0.0, 0.0, 1.0);
			pMat.diffuse = new Color(0.0, 0.0, 0.0, 1.0);
			pMat.emissive = new Color(0.9, 0.9, 0.9, 1.);

			pModelRoot.setName('cube-light-const-' + i.toString());
			pModelRoot.setInheritance(ENodeInheritance.ALL);
			pModelRoot.attachToParent(pScene.getRootNode());
			pModelRoot.scale(0.2).setPosition(lightPoss1[i]);

		};

		// Moving lights in round
		var pCubeRoundList: ISceneModel[] = new Array(omniLightRound);
		for (var i = 0; i < omniLightRound; i++) {
			pCubeRoundList[i] = window["cube_olr_" + i] = pCube.extractModel(pScene);

			var pMat: IMaterial = pCubeRoundList[i].getMesh().getSubset(0).getMaterial();
			pMat.shininess = 0.;
			pMat.specular = new Color(0.0, 0.0, 0.0, 1.0);
			pMat.diffuse = new Color(0.0, 0.0, 0.0, 1.0);
			pMat.emissive = new Color(0.9, 0.9, 0.9, 1.);

			pCubeRoundList[i].setName('cube-light-round-' + i.toString());
			pCubeRoundList[i].setInheritance(ENodeInheritance.ALL);
			pCubeRoundList[i].attachToParent(nd);
			pCubeRoundList[i].scale(0.2).addRelPosition(lightPoss2[i]);
		};
		pScene.beforeUpdate.connect(() => {
			for (var i = 0; i < omniLightRound; i++) {
				pCubeRoundList[i].addOrbitRotationByEulerAngles(orbitalAngSpeed, 0, 0);
			}
		})

		// Moving lights in spiral
		var pCubeSpiralList: ISceneModel[] = new Array(totalLightSources);
		for (var i = 0; i < totalLightSources; i++) {
			pCubeSpiralList[i] = window["cube_tls_" + i] = pCube.extractModel(pScene);

			var pMat: IMaterial = pCubeSpiralList[i].getMesh().getSubset(0).getMaterial();
			pMat.shininess = 0.;
			pMat.specular = new Color(0.0, 0.0, 0.0, 1.0);
			pMat.diffuse = new Color(0.0, 0.0, 0.0, 1.0);
			pMat.emissive = new Color(0.9, 0.9, 0.9, 1.);

			pCubeSpiralList[i].setName('cube-light-round-' + i.toString());
			pCubeSpiralList[i].setInheritance(ENodeInheritance.ALL);
			pCubeSpiralList[i].attachToParent(nd);
			pCubeSpiralList[i].scale(0.2).addRelPosition(spiralPosition(i), 0, 0);
		};
		pScene.beforeUpdate.connect(() => {
			for (var i = 0; i < totalLightSources; i++) {
				pCubeSpiralList[i].addOrbitRotationByEulerAngles(spiralRotation(i), 0, 0);
			}
		})

		function calcShi(i: uint, ma: uint) {
			return (1.0 - i / ma) * 0.95 + 0.02;
		}

		////////////////// JUST OBJECTS
		// GOLDEN TEAPOTS: first row
		var teapotDistance: float = 6.0; // distance between teapots
		var totalTeapots: float = 5;
		var teapotSpecular: color.Color = new Color(0.999, 0.71, 0.29, 1.0);
		var teapotDiffuse: color.Color = new Color(0.999, 0.86, 0.57, 1.0);
		for (var i = 0; i < totalTeapots; i++) {
			loadModel("TEAPOT.DAE",
				(model) => {
					model.explore(function (node) {
						if (akra.scene.SceneModel.isModel(node)) {
							node.getMesh().getSubset(0).getMaterial().shininess = calcShi(i, totalTeapots);
							node.getMesh().getSubset(0).getMaterial().specular = teapotSpecular;
							node.getMesh().getSubset(0).getMaterial().diffuse = teapotDiffuse;
							node.getMesh().getSubset(0).getMaterial().emissive = new Color(0.0, 0.0, 0.0, 0.0);
						}
					});
				}, 'teapot-' + i.toString(), pScene.getRootNode()).scale(3.0).addRelPosition(teapotDistance * (i - (totalTeapots - 1) / 2), 8.0, 20.0);
		};

		// SILVER CUBES: second row
		var cubeDistance: float = 10.0; // distance between cubes
		var totalCubes: float = 10;
		var silverColorSpecular: color.Color = new Color(0.95, 0.93, 0.88, 1.0);
		var silverColorDiffuse: color.Color = new Color(0.98, 0.97, 0.95, 1.0);
		for (var i = 0; i < totalCubes; i++) {
			var pModelRoot: ISceneModel = window["cube_tc_" + i] = pCube.extractModel(pScene);

			var pMat: IMaterial = pModelRoot.getMesh().getSubset(0).getMaterial();
			pMat.shininess = calcShi(i, totalCubes);
			pMat.specular = silverColorSpecular;
			pMat.diffuse = silverColorDiffuse;
			pMat.emissive = new Color(0.0, 0.0, 0.0, 1.);

			pModelRoot.setName('cube-metal-' + i.toString());
			pModelRoot.setInheritance(ENodeInheritance.ALL);
			pModelRoot.attachToParent(pScene.getRootNode());
			pModelRoot.scale(0.8).setPosition(cubeDistance * (i - (totalCubes - 1) / 2), 4.0, 20.0);
		};

		// PLASTIC CUBES: third row
		var plasticColorSpecular: color.Color = new Color(0.05, 0.05, 0.05, 1.0);
		var plasticColorDiffuse: color.Color = new Color(0.21, 0.21, 0.21, 1.0);
		for (var i = 0; i < totalCubes; i++) {
			var pModelRoot: ISceneModel = window["cube_tc2_" + i] = pCube.extractModel(pScene);

			var pMat: IMaterial = pModelRoot.getMesh().getSubset(0).getMaterial();
			pMat.shininess = calcShi(i, totalCubes);
			pMat.specular = plasticColorSpecular;
			pMat.diffuse = plasticColorDiffuse;
			pMat.emissive = new Color(0.0, 0.0, 0.0, 1.);

			pModelRoot.setName('cube-plastic-' + i.toString());
			pModelRoot.setInheritance(ENodeInheritance.ALL);
			pModelRoot.attachToParent(pScene.getRootNode());
			pModelRoot.scale(0.8).setPosition(cubeDistance * (i - (totalCubes - 1) / 2), 0.0, 20.0);
		};

		// PLASTIC CUBE: wigwag
		var cubePeriod: float = 3;
		var pModelRoot: ISceneModel = addons.cube(pScene);

		var pMat: IMaterial = pModelRoot.getMesh().getSubset(0).getMaterial();
		pMat.shininess = 0.7;
		pMat.specular = plasticColorSpecular;
		pMat.diffuse = plasticColorDiffuse;
		pMat.emissive = new Color(0.0, 0.0, 0.0, 1.);

		pModelRoot.setName('cube-plastic-wigwag-0');
		pModelRoot.setInheritance(ENodeInheritance.ALL);
		pModelRoot.attachToParent(pScene.getRootNode());
		pModelRoot.scale(0.8).setPosition(-4, 6, 4.0);
		pScene.beforeUpdate.connect(() => {
			pModelRoot.setPosition(-4, 6, math.sin(akra.time() / 1000. / cubePeriod) * 40. + 10.)
		})

		// SILVER CUBE: wigwag
		var pModelRoot2: ISceneModel = addons.cube(pScene);

		var pMat2: IMaterial = pModelRoot2.getMesh().getSubset(0).getMaterial();
		pMat2.shininess = 0.7;
		pMat2.specular = silverColorSpecular;
		pMat2.diffuse = silverColorDiffuse;
		pMat2.emissive = new Color(0.0, 0.0, 0.0, 1.);

		pModelRoot2.setName('cube-silver-wigwag-0');
		pModelRoot2.setInheritance(ENodeInheritance.ALL);
		pModelRoot2.attachToParent(pScene.getRootNode());
		pModelRoot2.scale(0.8).setPosition(-4, 6, 50.0);
		pScene.beforeUpdate.connect(() => {
			pModelRoot2.setPosition(4, 6, math.cos(akra.time() / 1000. / cubePeriod) * 40. + 10.)
		})

		pProgress.destroy();
		pEngine.exec();
	}

	pEngine.depsLoaded.connect(main);
}