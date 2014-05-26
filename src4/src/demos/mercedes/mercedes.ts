/// <reference path="../../../built/Lib/akra.d.ts" />
/// <reference path="../../../built/Lib/base3dObjects.addon.d.ts" />
/// <reference path="../../../built/Lib/progress.addon.d.ts" />

/// <reference path="../std/std.ts" />

/// <reference path="../idl/3d-party/dat.gui.d.ts" />

declare var AE_RESOURCES: akra.IDep;

module akra {

	var pProgress = new addons.Progress(document.getElementById("progress"));

	var pRenderOpts: IRendererOptions = {
		premultipliedAlpha: false,
		preserveDrawingBuffer: true,
		antialias: true,
		depth: true
	};

	var pOptions: IEngineOptions = {
		renderer: pRenderOpts,
		progress: pProgress.getListener(),
		deps: { files: [AE_RESOURCES], root: "./" }
	};

	var pEngine = akra.createEngine(pOptions);

	var pScene = pEngine.getScene();

	var pCanvas: ICanvas3d = pEngine.getRenderer().getDefaultCanvas();
	var pCamera: ICamera = null;
	var pViewport: IViewport = null;
	var pReflectionCamera: ICamera = null;
	var pReflectionViewport: IViewport = null;
	var pReflectionTexture: ITexture = null;
	var pMirror: INode = null;
	var pRmgr: IResourcePoolManager = pEngine.getResourceManager();

	var pSkyboxTexture = null;
	var pSkyboxTextures = null;
	var pEnvTexture = null;
	var pDepthViewport = null;

	var pGUI = null;


	export var pCameraParams = {
		current: {
			orbitRadius: 4.2,
			rotation: new math.Vec2(0., 0.)
		},
		target: {
			orbitRadius: 4.2,
			rotation: new math.Vec2(0., 0.)
		}
	}

	export var pModelTable = null;
	export var pModels = null;
	export var pCurrentModel = null;
	export var pPodiumModel = null;

	function createCamera(): ICamera {
		var pCamera: ICamera = pScene.createCamera();

		pCamera.attachToParent(pScene.getRootNode());
		pCamera.setPosition(Vec3.temp(0., 0., 4.2));

		pCamera.update();

		return pCamera;
	}

	function animateCameras(): void {
		pScene.beforeUpdate.connect(() => {
			pCamera.update();
			pReflectionCamera.update();

			var newRot = math.Vec2.temp(pCameraParams.current.rotation).add(math.Vec2.temp(pCameraParams.target.rotation).subtract(pCameraParams.current.rotation).scale(0.15));
			var newRad = pCameraParams.current.orbitRadius * (1. + (pCameraParams.target.orbitRadius - pCameraParams.current.orbitRadius) * 0.03);

			pCameraParams.current.rotation.set(newRot);
			pCameraParams.current.orbitRadius = newRad;
			pCamera.setPosition(
				newRad * -math.sin(newRot.x) * math.cos(newRot.y),
				newRad * math.sin(newRot.y),
				newRad * math.cos(newRot.x) * math.cos(newRot.y));
			pCamera.lookAt(math.Vec3.temp(0, 0, 0));

			pCamera.update();

			var dist = math.Vec3.temp(pCamera.getWorldPosition()).subtract(pMirror.getWorldPosition());
			var up = pMirror.getTempVectorUp();

			pReflectionCamera.setPosition(math.Vec3.temp(pCamera.getWorldPosition()).add(math.Vec3.temp(up).scale(-2. * (up.dot(dist)))));
			pReflectionCamera.setRotationByForwardUp(
				pCamera.getTempVectorForward().add(math.Vec3.temp(up).scale(-2. * up.dot(pCamera.getTempVectorForward()))),
				pCamera.getTempVectorUp().add(math.Vec3.temp(up).scale(-2. * up.dot(pCamera.getTempVectorUp()))));
			pReflectionCamera.setAspect(pCamera.getAspect());

			pReflectionCamera.update();
		});
	}

	function createKeymap(pCamera: ICamera): void {
		var pKeymap: IKeyMap = control.createKeymap();
		pKeymap.captureMouse((<any>pCanvas).getElement());
		pKeymap.captureKeyboard(document);

		pScene.beforeUpdate.connect(() => {
			if (pKeymap.isMousePress()) {
				if (pKeymap.isMouseMoved()) {
					var v2fMouseShift: IOffset = pKeymap.getMouseShift();

					pCameraParams.target.rotation.y = math.clamp(pCameraParams.target.rotation.y + v2fMouseShift.y / pViewport.getActualHeight() * 2., -0.7, 1.2);
					pCameraParams.target.rotation.x += v2fMouseShift.x / pViewport.getActualHeight() * 2.;

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
			if (pKeymap.isKeyPress(EKeyCodes.UP)) {
				pCamera.addRelPosition(0, fSpeed, 0);
			}
			if (pKeymap.isKeyPress(EKeyCodes.DOWN)) {
				pCamera.addRelPosition(0, -fSpeed, 0);
			}
		});
		pViewport.enableSupportForUserEvent(EUserEvents.MOUSEWHEEL);
		pViewport.mousewheel.connect((pViewport, x: float, y: float, fDelta: float) => {
			//console.log("mousewheel moved: ",x,y,fDelta);
			pCameraParams.target.orbitRadius = math.clamp(pCameraParams.target.orbitRadius - fDelta / pViewport.getActualHeight() * 2., 2., 15.);
		});
	}




	function setupMaterialPicking(pViewport: ILPPViewport): void {
		var pControls: dat.GUI = pGUI.addFolder("material");
		(<any>pControls).open();

		var pMat = {
			origin: null,
			name: "unknown", glossiness: 1e-2,
			diffuse: "#000000", ambient: "#000000", emissive: "#000000", specular: "#000000"
		};

		pControls.add(pMat, "name").listen();
		pControls.add(pMat, "glossiness", 0., 1.).listen().onChange(() => {
			if (pMat.origin) {
				pMat.origin.shininess = pMat.glossiness;
			}
		});

		pControls.addColor(pMat, "diffuse").listen().onChange(() => {
			if (pMat.origin) {
				(<IColor>pMat.origin.diffuse).set(pMat.diffuse);
			}
		});

		pControls.addColor(pMat, "emissive").listen().onChange(() => {
			if (pMat.origin) {
				(<IColor>pMat.origin.emissive).set(pMat.emissive);
			}
		});
		pControls.addColor(pMat, "specular").listen().onChange(() => {
			if (pMat.origin) {
				(<IColor>pMat.origin.specular).set(pMat.specular);
			}
		});

		pViewport.enableSupportForUserEvent(EUserEvents.CLICK);
		pViewport.enable3DEvents(false);
		pViewport.click.connect((pViewport: ILPPViewport, x, y) => {
			var pResult = pViewport.pick(x, y);
			pViewport.highlight(pResult);

			if (pResult.renderable) {
				var pOrigin: IMaterial = pResult.renderable.getMaterial();

				pMat.origin = pOrigin;
				pMat.name = pOrigin.name;
				pMat.glossiness = pOrigin.shininess;
				pMat.diffuse = pOrigin.diffuse.getHtml();
				pMat.emissive = pOrigin.emissive.getHtml();
				pMat.specular = pOrigin.specular.getHtml();
			}
		});
	}

	function createViewport(): IViewport3D {
		var pViewport: IViewport3D = new render.LPPViewport(pCamera, 0., 0., 1., 1., 11);
		pCanvas.addViewport(pViewport);
		pCanvas.resize(window.innerWidth, window.innerHeight);

		window.onresize = function (event) {
			pCanvas.resize(window.innerWidth, window.innerHeight);
		};

		var counter = 0;
		var pEffect = (<render.ForwardViewport>pViewport).getEffect();


		pGUI = new dat.GUI();
		setupMaterialPicking(<ILPPViewport>pViewport);
		
		pViewport.getEffect().addComponent("akra.system.linearFog");
		pViewport.getEffect().addComponent("akra.system.exponentialFog");

		var fogType = {
			None: 0,
			linear: 1,
			exp: 2
		};

		var pFogData = {
			fogColor: 0,
			fogStart: 30,
			fogIndex: 30
		};

		var pFogFolder = pGUI.addFolder("fog");
		var iFogType = 0;
		(<dat.OptionController>pFogFolder.add({ FogType: "exp" }, 'FogType', Object.keys(fogType))).name("Type of fog").onChange((sKey) => {
			iFogType = fogType[sKey];
		});
		(<dat.NumberControllerSlider>pFogFolder.add(pFogData, 'fogColor')).min(0.).max(1.).step(0.01).name("color").__precision = 2;
		(<dat.NumberControllerSlider>pFogFolder.add(pFogData, 'fogStart')).min(0.).max(200.).name("start");
		(<dat.NumberControllerSlider>pFogFolder.add(pFogData, 'fogIndex')).min(0.01).max(200.).name("index");

		


		pViewport.render.connect((pViewport: IViewport, pTechnique: IRenderTechnique,
			iPass: uint, pRenderable: IRenderableObject, pSceneObject: ISceneObject) => {
			var pPass: IRenderPass = pTechnique.getPass(iPass);

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
		});

		var pSkyboxTexturesKeys = [
			'nightsky',
			'desert',
			'nature',
			'colosseum',
			'beach',
			'plains',
			'church',
			'basilica',
		];

		pSkyboxTextures = {};

		for (var i = 0; i < pSkyboxTexturesKeys.length; i++) {
			pSkyboxTextures[pSkyboxTexturesKeys[i]] = pRmgr.createTexture(".sky-box-texture-" + pSkyboxTexturesKeys[i]);
			(<ITexture>(pSkyboxTextures[pSkyboxTexturesKeys[i]])).loadResource("SKYBOX_" + pSkyboxTexturesKeys[i].toUpperCase());
		}




		var pPBSFolder = pGUI.addFolder("pbs");

		(<dat.OptionController>pPBSFolder.add({ Skybox: "nightsky" }, 'Skybox', pSkyboxTexturesKeys)).name("Skybox").onChange((sKey) => {
			if (pViewport.getType() === EViewportTypes.LPPVIEWPORT || pViewport.getType() === EViewportTypes.DSVIEWPORT) {
				//(<render.LPPViewport>pViewport).setSkybox(pSkyboxTextures[sKey]);
			}
			(<ITexture>pEnvTexture).unwrapCubeTexture(pSkyboxTextures[sKey]);
		});

		(<ILPPViewport>pViewport).setShadingModel(EShadingModel.PBS_SIMPLE);

		return pViewport;
	}




	function createMirror(): INode {
		var pNode: INode = pScene.createNode().setPosition(0., -1.5, 0.);
		pNode.setInheritance(ENodeInheritance.ROTPOSITION);
		pReflectionCamera = createMirrorCamera(pNode);
		pReflectionViewport = createMirrorViewport(pNode);

		return pNode;
	}

	function createMirrorCamera(pReflNode: INode): ICamera {
		var pReflectionCamera: ICamera = pScene.createCamera("reflection_camera_01");

		pReflectionCamera.attachToParent(pScene.getRootNode());
		pReflectionCamera.setInheritance(pCamera.getInheritance());

		return pReflectionCamera;
	}

	function createMirrorViewport(pReflNode: INode): IViewport {

		pReflectionTexture = pRmgr.createTexture(".reflection_texture");
		pReflectionTexture.create(512, 512, 1, null, ETextureFlags.RENDERTARGET, 0, 0,
			ETextureTypes.TEXTURE_2D, EPixelFormats.R8G8B8);

		var pRenderTarget = pReflectionTexture.getBuffer().getRenderTarget();
		pRenderTarget.setAutoUpdated(false);

		var pTexViewport: IMirrorViewport = <IMirrorViewport>pRenderTarget.addViewport(new render.MirrorViewport(pReflectionCamera, 0., 0., 1., 1., 0));
		var pEffect = (<render.LPPViewport>pTexViewport.getInternalViewport()).getEffect();

		pEffect.addComponent("akra.system.blur");

		(<render.LPPViewport>pTexViewport.getInternalViewport()).render.connect((pViewport: IViewport, pTechnique: IRenderTechnique,
			iPass: uint, pRenderable: IRenderableObject, pSceneObject: ISceneObject) => {
			var pPass: IRenderPass = pTechnique.getPass(iPass);
			pPass.setUniform("BLUR_RADIUS", 5.0);
		});

		return pTexViewport;
	}

	var lightPos1: math.Vec3 = new math.Vec3(1, 2, 2);
	var lightPos2: math.Vec3 = new math.Vec3(-1, -2, 2);

	export var pOmniLights: INode = null;
	function createLighting(): void {
		pOmniLights = pScene.createNode('lights-root');
		pOmniLights.attachToParent(pCamera);
		pOmniLights.setInheritance(ENodeInheritance.ALL);

		var pOmniLight: IOmniLight;
		var pOmniLightSphere;

		pOmniLight = <IOmniLight>pScene.createLightPoint(ELightTypes.OMNI, true, 2048, "test-omni-0");

		pOmniLight.attachToParent(pOmniLights);
		pOmniLight.setEnabled(true);
		pOmniLight.getParams().ambient.set(0.1);
		pOmniLight.getParams().diffuse.set(1.0, 1.0, 1.0);
		pOmniLight.getParams().specular.set(1.0, 1.0, 1.0, 1.0);
		pOmniLight.getParams().attenuation.set(1, 0, 0.3);
		pOmniLight.setShadowCaster(true);
		pOmniLight.setInheritance(ENodeInheritance.ALL);

		pOmniLight.setPosition(lightPos1);

		pOmniLight = <IOmniLight>pScene.createLightPoint(ELightTypes.OMNI, true, 512, "test-omni-0");

		pOmniLight.attachToParent(pOmniLights);
		pOmniLight.setEnabled(true);
		pOmniLight.getParams().ambient.set(0.1);
		pOmniLight.getParams().diffuse.set(1.0, 1.0, 1.0);
		pOmniLight.getParams().specular.set(1.0, 1.0, 1.0, 1.0);
		pOmniLight.getParams().attenuation.set(1, 0, 0.3);
		pOmniLight.setShadowCaster(false);
		pOmniLight.setInheritance(ENodeInheritance.ALL);

		pOmniLight.setPosition(lightPos2);
	}

	function createSkyBox(): void {
		pSkyboxTexture = pSkyboxTextures['nightsky'];

		if (pViewport.getType() === EViewportTypes.LPPVIEWPORT || pViewport.getType() === EViewportTypes.DSVIEWPORT) {
			//(<render.LPPViewport>pViewport).setSkybox(pSkyboxTexture);
		}

		pEnvTexture = pRmgr.createTexture(".env-map-texture-01");
		pEnvTexture.create(1024, 512, 1, null, 0, 0, 0,
			ETextureTypes.TEXTURE_2D, EPixelFormats.R8G8B8);
		pEnvTexture.unwrapCubeTexture(pSkyboxTexture);

		(<ILPPViewport>pViewport).setDefaultEnvironmentMap(pEnvTexture);
	}

	function loadModel(sPath, fnCallback?: Function, name?: String, pRoot?: ISceneNode): ISceneNode {
		var pModelRoot: ISceneNode = pScene.createNode();
		var pModel: ICollada = <ICollada>pEngine.getResourceManager().loadModel(sPath);

		pModelRoot.setName(name || sPath.match(/[^\/]+$/)[0] || 'unnamed_model');
		if (pRoot != null) {
			pModelRoot.attachToParent(pRoot);
		}
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
			"margin: 5px;" +
			"font-family: Arial;");

		return pStatsDiv;
	}

	function main(pEngine: IEngine) {
		std.setup(pCanvas);

		pCamera = createCamera();
		pViewport = createViewport();
		pMirror = createMirror();
		pViewport.setBackgroundColor(color.GRAY);
		pViewport.setClearEveryFrame(true);

		var pStatsDiv = createStatsDIV();

		pCanvas.postUpdate.connect((pCanvas: ICanvas3d) => {
			pStatsDiv.innerHTML = pCanvas.getAverageFPS().toFixed(2) + " fps";
		});

		createKeymap(pCamera);

		animateCameras();

		window.onresize = () => {
			pCanvas.resize(window.innerWidth, window.innerHeight);
		};

		createLighting();
		createSkyBox();

		var pPlasticMaterial: IMaterial = new material.Material();
		pPlasticMaterial.shininess = 0.7;
		pPlasticMaterial.set("plastic")

		pModelTable = addons.trifan(pScene, 2.5, 96);
		pModelTable.attachToParent(pScene.getRootNode());
		pModelTable.setPosition(0., -1.25, 0.);

		var pModelTableSubset = pModelTable.getMesh().getSubset(0);

		pModelTableSubset.getSurfaceMaterial().setMaterial(pPlasticMaterial);

		pModelTableSubset.getTechnique().render.connect((pTech: IRenderTechnique, iPass, pRenderable, pSceneObject, pLocalViewport) => {
			pTech.getPass(iPass).setTexture("MIRROR_TEXTURE", pReflectionTexture);
			pTech.getPass(iPass).setForeign("IS_USED_MIRROR_REFLECTION", true);
		});

		var pCylinder = addons.cylinder(pScene, 2.5, 2.5, .35, 96, 1.);
		pCylinder.attachToParent(pScene.getRootNode());
		pCylinder.setPosition(0., -1.25 - 0.35 / 2, 0.);
		var pCylinderSubset = pCylinder.getMesh().getSubset(0);
		pCylinderSubset.getMaterial().shininess = 0.7;
		pCylinderSubset.getSurfaceMaterial().setMaterial(pPlasticMaterial);


		var pMercedes = null;

		pMercedes = loadModel("MERCEDES.DAE", null, "mercedes", pModelTable).setPosition(0., 0., 0.);
		pMercedes.attachToParent(pModelTable);

		pMirror.attachToParent(pModelTable);
		pMirror.setPosition(0., 0., 0.);

		pCanvas.viewportPreUpdate.connect((pTarget: IRenderTarget, pInputViewport: IViewport) => {
			if (pInputViewport === pViewport) {
				var normal = pMirror.getTempVectorUp();
				var dist = pMirror.getWorldPosition().dot(normal);
				(<IMirrorViewport>pReflectionViewport).getReflectionPlane().set(normal, dist);
				if (pMirror.getTempVectorUp().dot(math.Vec3.temp(pCamera.getWorldPosition()).subtract(pMirror.getWorldPosition())) > 0.) {
					pReflectionTexture.getBuffer().getRenderTarget().update();
				}
			}
		});

		pProgress.destroy();
		pEngine.exec();
	}

	pEngine.depsLoaded.connect(main);
}
