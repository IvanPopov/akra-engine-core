/// <reference path="../../../built/Lib/akra.d.ts" />
/// <reference path="../../../built/Lib/base3dObjects.addon.d.ts" />
/// <reference path="../../../built/Lib/progress.addon.d.ts" />
/// <reference path="../../../built/Lib/compatibility.addon.d.ts" />

/// <reference path="../std/std.ts" />

/// <reference path="../idl/3d-party/dat.gui.d.ts" />
/// <reference path="../idl/3d-party/ammo.d.ts" />

declare var AE_RESOURCES: akra.IDep;
declare var AE_MODELS: any;

module akra {

	addons.compatibility.requireWebGLExtension(webgl.WEBGL_COMPRESSED_TEXTURE_S3TC);
	addons.compatibility.verify("non-compatible");

	export var modelsPath = path.parse((AE_MODELS.content).split(';')[0]).getDirName() + '/';

	var pProgress = new addons.Progress(document.getElementById("progress"));

	var pRenderOpts: IRendererOptions = {
		premultipliedAlpha: false,
		preserveDrawingBuffer: true,
		depth: true,
		antialias: true
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
	export var pSky: model.Sky = null;
	export var pSkyboxTexture: ITexture = null;
	export var pSkyboxTextures: IMap<ITexture> = null;
	export var pEnvTexture = null;
	export var pDepthViewport = null;
	export var pModelsFiles = null;
	export var pFireTexture: ITexture = null;
	export var applyAlphaTest = null;
	export var bFPSCameraControls: boolean = false;

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
	export var pCameraFPSParams = {
		current: {
			position: new math.Vec3(),
			rotation: new math.Vec2(0., 0.)
		},
		target: {
			position: new math.Vec3(),
			rotation: new math.Vec2(0., 0.)
		}
	}

	export var pModels = null;
	export var pCurrentModel = null;
	export var pPhysObjects = null;
	export var pPhysics = null;

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
			if(bFPSCameraControls) {
				var newRot: IVec2 = math.Vec2.temp(pCameraFPSParams.current.rotation).add(math.Vec2.temp(pCameraFPSParams.target.rotation).subtract(pCameraFPSParams.current.rotation).scale(0.15));
				var newPos: IVec3 = math.Vec3.temp(pCameraFPSParams.current.position).add(math.Vec3.temp(pCameraFPSParams.target.position).subtract(pCameraFPSParams.current.position).scale(0.03));

				pCameraFPSParams.current.rotation.set(newRot);
				pCameraFPSParams.current.position.set(newPos);
				pCamera.setPosition(newPos);
				pCamera.setRotationByEulerAngles(-newRot.x,-newRot.y,0.);
			}
			else {
				var newRot = math.Vec2.temp(pCameraParams.current.rotation).add(math.Vec2.temp(pCameraParams.target.rotation).subtract(pCameraParams.current.rotation).scale(0.15));
				var newRad = pCameraParams.current.orbitRadius * (1. + (pCameraParams.target.orbitRadius - pCameraParams.current.orbitRadius) * 0.03);

				pCameraParams.current.rotation.set(newRot);
				pCameraParams.current.orbitRadius = newRad;
				pCamera.setPosition(
					newRad * -math.sin(newRot.x) * math.cos(newRot.y),
					newRad * math.sin(newRot.y),
					newRad * math.cos(newRot.x) * math.cos(newRot.y));
				pCamera.lookAt(math.Vec3.temp(0, 0, 0));
			}

			pCamera.update();
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

					if(bFPSCameraControls) {
						pCameraFPSParams.target.rotation.y = math.clamp(pCameraFPSParams.target.rotation.y + v2fMouseShift.y / pViewport.getActualHeight() * 4., -1.2, 1.2);
						pCameraFPSParams.target.rotation.x += v2fMouseShift.x / pViewport.getActualHeight() * 4.;
					}
					else {
						pCameraParams.target.rotation.y = math.clamp(pCameraParams.target.rotation.y + v2fMouseShift.y / pViewport.getActualHeight() * 2., -0.7, 1.2);
						pCameraParams.target.rotation.x += v2fMouseShift.x / pViewport.getActualHeight() * 2.;
					}
					pKeymap.update();
				}

			}
			var fSpeed: float = 0.1 * 3;
			if (pKeymap.isKeyPress(EKeyCodes.W)) {
				// pCamera.addRelPosition(0, 0, -fSpeed);
				if(bFPSCameraControls) {
					pCameraFPSParams.target.position.add(pCamera.getTempVectorForward().scale(-fSpeed));
				}
			}
			if (pKeymap.isKeyPress(EKeyCodes.S)) {
				// pCamera.addRelPosition(0, 0, fSpeed);
				if(bFPSCameraControls) {
					pCameraFPSParams.target.position.add(pCamera.getTempVectorForward().scale(fSpeed));
				}
			}
			if (pKeymap.isKeyPress(EKeyCodes.A) || pKeymap.isKeyPress(EKeyCodes.LEFT)) {
				// pCamera.addRelPosition(-fSpeed, 0, 0);
				if(bFPSCameraControls) {
					pCameraFPSParams.target.position.add(pCamera.getTempVectorRight().scale(fSpeed));
				}
			}
			if (pKeymap.isKeyPress(EKeyCodes.D) || pKeymap.isKeyPress(EKeyCodes.RIGHT)) {
				// pCamera.addRelPosition(fSpeed, 0, 0);
				if(bFPSCameraControls) {
					pCameraFPSParams.target.position.add(pCamera.getTempVectorRight().scale(-fSpeed));
				}
			}
			if (pKeymap.isKeyPress(EKeyCodes.UP)) {
				// pCamera.addRelPosition(0, fSpeed, 0);
				if(bFPSCameraControls) {
					pCameraFPSParams.target.position.add(pCamera.getTempVectorUp().scale(fSpeed));
				}
			}
			if (pKeymap.isKeyPress(EKeyCodes.DOWN)) {
				// pCamera.addRelPosition(0, -fSpeed, 0);
				if(bFPSCameraControls) {
					pCameraFPSParams.target.position.add(pCamera.getTempVectorUp().scale(-fSpeed));
				}
			}
		});
		(<ILPPViewport>pViewport).enableSupportForUserEvent(EUserEvents.MOUSEWHEEL);
		pViewport.mousewheel.connect((pViewport, x: float, y: float, fDelta: float) => {
			//console.log("mousewheel moved: ",x,y,fDelta);
			if(bFPSCameraControls) {
				pCameraFPSParams.target.position.add(pCamera.getTempVectorForward().scale( -fDelta / pViewport.getActualHeight() ));
			}
			else {
				pCameraParams.target.orbitRadius = math.clamp(pCameraParams.target.orbitRadius - fDelta / pViewport.getActualHeight() * 2., 2., 15.);
			}
		});
	}

	var pGUI;

	function createViewport(): IViewport3D {

		var pViewport: ILPPViewport = new render.LPPViewport(pCamera, 0., 0., 1., 1., 11);

		pCanvas.addViewport(pViewport);
		pCanvas.resize(window.innerWidth, window.innerHeight);

		window.onresize = function (event) {
			pCanvas.resize(window.innerWidth, window.innerHeight);
		};

		(<render.LPPViewport>pViewport).setFXAA(true);
		var counter = 0;

		pGUI = new dat.GUI();

		var pSkyboxTexturesKeys = [
			'nature',
			'plains',
		];
		pSkyboxTextures = {};
		for (var i = 0; i < pSkyboxTexturesKeys.length; i++) {

			var pTexture: ITexture = pSkyboxTextures[pSkyboxTexturesKeys[i]] = pRmgr.createTexture(".sky-box-texture-" + pSkyboxTexturesKeys[i]);

			pTexture.setFlags(ETextureFlags.AUTOMIPMAP);
			pTexture.loadResource("SKYBOX_" + pSkyboxTexturesKeys[i].toUpperCase());
			pTexture.setFilter(ETextureParameters.MAG_FILTER, ETextureFilters.LINEAR);
			pTexture.setFilter(ETextureParameters.MIN_FILTER, ETextureFilters.LINEAR);
		};

		
		pGUI.add({ fps_camera: bFPSCameraControls }, "fps_camera").onChange((bNewValue) => {
			if(!bFPSCameraControls) {
				pCameraFPSParams.current.rotation.set(pCameraParams.current.rotation);
				pCameraFPSParams.target.rotation.set(pCameraFPSParams.current.rotation);
				pCameraFPSParams.current.position.set(pCamera.getWorldPosition());
				pCameraFPSParams.target.position.set(pCameraFPSParams.current.position);
			}
			bFPSCameraControls = bNewValue;
		})

		var bAdvancedSkybox: boolean = true;
		var fSkyboxSharpness: float = .52;
		pGUI.add({ skybox_sharpness: fSkyboxSharpness }, "skybox_sharpness", 0., 1., 0.01).onChange((fValue) => {
			fSkyboxSharpness = fValue;
		})

		pGUI.add({ skybox_blur: bAdvancedSkybox }, "skybox_blur").onChange((bValue) => {
			bAdvancedSkybox = bValue;
		});

		var pPBSFolder = pGUI.addFolder("pbs");

		(<dat.OptionController>pPBSFolder.add({ Skybox: 'nature' }, 'Skybox', pSkyboxTexturesKeys)).name("Skybox").onChange((sKey) => {
			// if (pViewport.getType() === EViewportTypes.LPPVIEWPORT) {
			(<ILPPViewport>pViewport).setSkybox(pSkyboxTextures[sKey]);
			// }
			(<ITexture>pEnvTexture).unwrapCubeTexture(pSkyboxTextures[sKey]);
		});

		(<ILPPViewport>pViewport).setShadingModel(EShadingModel.PBS_SIMPLE);

		pViewport.render.connect((pViewport: IViewport, pTechnique: IRenderTechnique,
			iPass: uint, pRenderable: IRenderableObject, pSceneObject: ISceneObject) => {
			var pPass: IRenderPass = pTechnique.getPass(iPass);
			var pDepthTexture: ITexture = (<ILPPViewport>pViewport).getDepthTexture();

			pPass.setUniform("SCREEN_ASPECT_RATIO",
				math.Vec2.temp(pViewport.getActualWidth() / pViewport.getActualHeight(), 1.));

			pPass.setUniform("SKYBOX_ADVANCED_SHARPNESS", fSkyboxSharpness);
			pPass.setTexture("SKYBOX_UNWRAPED_TEXTURE", pEnvTexture);
			pPass.setForeign("IS_USED_ADVANCED_SKYBOX", bAdvancedSkybox);
		});

		return pViewport;
	}

	var lightPos1: math.Vec3 = new math.Vec3(1, 2, 2);
	var lightPos2: math.Vec3 = new math.Vec3(-3, 2, -2);

	export var pOmniLights: INode = null;
	function createLighting(): void {
		pOmniLights = pScene.createNode('lights-root');
		pOmniLights.attachToParent(pScene.getRootNode());
		// pOmniLights.setInheritance(ENodeInheritance.ALL);

		var pOmniLight: IOmniLight;
		var pOmniLightSphere;

		pOmniLight = <IOmniLight>pScene.createLightPoint(ELightTypes.OMNI, true, 2048, "test-omni-0");

		pOmniLight.attachToParent(pOmniLights);
		pOmniLight.setEnabled(true);
		pOmniLight.getParams().ambient.set(0.0);
		pOmniLight.getParams().diffuse.set(1.0, 0.6, 0.3);
		pOmniLight.getParams().specular.set(1.0, 1.0, 1.0, 1.0);
		pOmniLight.getParams().attenuation.set(1, 0, 2);
		pOmniLight.setShadowCaster(true);
		pOmniLight.setInheritance(ENodeInheritance.ALL);
		pOmniLight.setPosition(lightPos1);
		pOmniLightSphere = loadModel(modelsPath + "/Sphere.DAE",
			(model) => {
				model.explore(function (node) {
					if (scene.SceneModel.isModel(node)) {
						node.getMesh().getSubset(0).getMaterial().diffuse = new Color(1.0, 0.6, 0.3);
						node.getMesh().getSubset(0).getMaterial().emissive = new Color(1.0, 0.6, 0.3);
					}
				})
				}, "test-omni-0-model", pOmniLight).scale(0.15);
		pOmniLightSphere.setPosition(0., 0., 0.);

		pOmniLight = <IOmniLight>pScene.createLightPoint(ELightTypes.OMNI, true, 512, "test-omni-1");

		pOmniLight.attachToParent(pOmniLights);
		pOmniLight.setEnabled(true);
		pOmniLight.getParams().ambient.set(0.0);
		pOmniLight.getParams().diffuse.set(0.3, 0.6, 1.0);
		pOmniLight.getParams().specular.set(1.0, 1.0, 1.0, 1.0);
		pOmniLight.getParams().attenuation.set(1, 0, 2);
		pOmniLight.setShadowCaster(false);
		pOmniLight.setInheritance(ENodeInheritance.ALL);
		pOmniLight.setPosition(lightPos2);
		pOmniLightSphere = loadModel(modelsPath + "/Sphere.DAE",
			(model) => {
				model.explore(function (node) {
					if (scene.SceneModel.isModel(node)) {
						node.getMesh().getSubset(0).getMaterial().diffuse = new Color(0.3, 0.6, 1.0);
						node.getMesh().getSubset(0).getMaterial().emissive = new Color(0.3, 0.6, 1.0);
					}
				})
				}, "test-omni-1-model", pOmniLight).scale(0.15);
		pOmniLightSphere.setPosition(0., 0., 0.);
	}

	function createSky(): void {
		pSky = new model.Sky(pEngine, 32, 32, 1000.0);
		pSky.setTime(15.);

		pSky.sun.setShadowCaster(false);

		var pSceneModel: ISceneModel = pSky.skyDome;
		pSceneModel.attachToParent(pScene.getRootNode());
	}

	function createSkyBox(): void {
		pSkyboxTexture = pSkyboxTextures['nature'];

		if (pViewport.getType() === EViewportTypes.FORWARDVIEWPORT) {
			var pModel = addons.cube(pScene);
			(<IForwardViewport>pViewport).setSkyboxModel(pModel.getRenderable(0));
		}
		//if (pViewport.getType() === EViewportTypes.LPPVIEWPORT || pViewport.getType() === EViewportTypes.DSVIEWPORT) {
		(<ILPPViewport>pViewport).setSkybox(pSkyboxTexture);
		//}

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
			"font-family: Arial;" +
			"margin: 5px;");

		return pStatsDiv;
	}

	function main(pEngine: IEngine) {
		std.setup(pCanvas);

		pCamera = createCamera();
		pViewport = createViewport();
		// pMirror = createMirror();
		pViewport.setBackgroundColor(color.GRAY);
		pViewport.setClearEveryFrame(true);

		var pStatsDiv = createStatsDIV();

		pCanvas.postUpdate.connect((pCanvas: ICanvas3d) => {
			pStatsDiv.innerHTML = pCanvas.getAverageFPS().toFixed(2) + " fps";
		});

		window.onresize = () => {
			pCanvas.resize(window.innerWidth, window.innerHeight);
		};

		//createSky();

		// CREATE ENVIRONMENT
		createLighting();

		createSkyBox();

		// PLASTIC PARAMS:
		var plasticColorSpecular: color.Color = new Color(0.05, 0.05, 0.05, 1.0);
		// var plasticColorDiffuse: color.Color = silverColorDiffuse;
		var plasticColorDiffuse: color.Color = new Color(0.35, 0.35, 0.35, 1.0);
		var plasticDarkColorDiffuse: color.Color = new Color(0.08, 0.08, 0.08, 1.0);

		// MODEL LIBRARY SETUP
		var pModelsKeys = [
			'air06',
		];
		pModelsFiles = {
			air06: {
				path: modelsPath + "/air06/air06.dae",
				init: function (model) {
					model.explore(function (node) {
						if (scene.SceneModel.isModel(node)) {
							// first handle local matrices trouble

							// var intPos = math.Vec3.temp(), intRot = math.Quat4.temp(), intScale = math.Vec3.temp();
							// node.getLocalMatrix().decompose(intRot, intScale, intPos);

							// node.setLocalMatrix(new math.Mat4(1.));
							// node.setRotation(intRot);
							// node.setLocalScale(intScale);
							// node.setPosition(intPos);
						}
					});
				},
			},
		};

		// MODELS LOADING
		pModels = {};

		var sActiveModelKey = pModelsKeys[0];
		pModels[sActiveModelKey] = loadModel(pModelsFiles[sActiveModelKey].path, pModelsFiles[sActiveModelKey].init, sActiveModelKey, pScene.getRootNode()).setPosition(0., 0., 0.).addPosition(0., 0., 0.);
		pCurrentModel = pModels[sActiveModelKey];

		var pModelsFolder = pGUI.addFolder("models");

		(<dat.OptionController>pModelsFolder.add({ Model: sActiveModelKey }, 'Model', pModelsKeys)).name("Model").onChange((sKey) => {
			pCurrentModel.addPosition(0., -1000., 0.);
			if (pModels[sKey] == null) {
				pModels[sKey] = loadModel(pModelsFiles[sKey].path, pModelsFiles[sKey].init, sKey, pScene.getRootNode()).setPosition(0., 0., 0.).addPosition(0., -1000., 0.);
			}
			pCurrentModel = pModels[sKey];
			pCurrentModel.addPosition(0., 1000., 0.);
			sActiveModelKey = sKey;
		});

		// FINAL PREPARAIONS

		createKeymap(pCamera);

		animateCameras();

		pProgress.destroy();
		pEngine.exec();
	}

	pEngine.depsLoaded.connect(main);
}
