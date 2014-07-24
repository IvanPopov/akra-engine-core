/// <reference path="../../../built/Lib/akra.d.ts" />
/// <reference path="../../../built/Lib/base3dObjects.addon.d.ts" />
/// <reference path="../../../built/Lib/progress.addon.d.ts" />
/// <reference path="../../../built/Lib/compatibility.addon.d.ts" />

/// <reference path="../std/std.ts" />

/// <reference path="../idl/3d-party/dat.gui.d.ts" />

declare var AE_RESOURCES: akra.IDep;
declare var AE_SOUND_ENGINE: any;

module akra {

	addons.compatibility.requireWebGLExtension(webgl.WEBGL_COMPRESSED_TEXTURE_S3TC);
	addons.compatibility.verify("non-compatible");

	var pProgress = new addons.Progress(document.getElementById("progress"));
	var sEngineSound: string = AE_SOUND_ENGINE.content;

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
	export var funAnimation = null;

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

		pKeymap.bind("T", () => {
			if (pGUI) {
				for (var i = 0; i < pGUI.__controllers.length; i++) {
					if (pGUI.__controllers[i].property === "fps_camera") {
						pGUI.__controllers[i].__checkbox.click();
						break;
					}
				}
			}
		});

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

		var pViewport: ILPPViewport = new render.ForwardViewport(pCamera, 0., 0., 1., 1., 11);

		pCanvas.addViewport(pViewport);
		pCanvas.resize(window.innerWidth, window.innerHeight);

		window.onresize = function (event) {
			pCanvas.resize(window.innerWidth, window.innerHeight);
		};

		(<render.LPPViewport>pViewport).setFXAA(true);
		var counter = 0;

		pGUI = new dat.GUI();

		var fogType = {
			none: 0,
			linear: 1,
			exponential: 2,
			vertical: 3
		};

		var pFogData = {
			fColorR: 230,
			fColorG: 210,
			fColorB: 180,
			fStart: 99,
			fIndex: 160,
			fHeight: 0.39,
			fDensity: 0.
		};

		(<IViewportFogged>pViewport).setFog(3);

		var pFogFolder = pGUI.addFolder("fog");
		(<dat.OptionController>pFogFolder.add({ FogType: "vertical" }, 'FogType', Object.keys(fogType))).name("Type of fog").onChange((sKey) => {
			(<IViewportFogged>pViewport).setFog(fogType[sKey]);
		});
		(<dat.NumberControllerSlider>pFogFolder.add(pFogData, 'fColorR')).min(0).max(255).step(1).name("colorR").__precision = 0;
		(<dat.NumberControllerSlider>pFogFolder.add(pFogData, 'fColorG')).min(0).max(255).step(1).name("colorG").__precision = 0;
		(<dat.NumberControllerSlider>pFogFolder.add(pFogData, 'fColorB')).min(0).max(255).step(1).name("colorB").__precision = 0;
		(<dat.NumberControllerSlider>pFogFolder.add(pFogData, 'fStart')).min(0.).max(200.).name("start");
		(<dat.NumberControllerSlider>pFogFolder.add(pFogData, 'fIndex')).min(0.01).max(200.).name("index");
		(<dat.NumberControllerSlider>pFogFolder.add(pFogData, 'fHeight')).min(0.).max(1.).step(0.01).name("height").__precision = 2;
		(<dat.NumberControllerSlider>pFogFolder.add(pFogData, 'fDensity')).min(0.).max(1.).step(0.01).name("density").__precision = 2;

		var pSkyboxTexturesKeys = [
			'sunset',
			'cloudtop'
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

		var bAdvancedSkybox: boolean = false;
		var fSkyboxSharpness: float = .52;
		pGUI.add({ skybox_sharpness: fSkyboxSharpness }, "skybox_sharpness", 0., 1., 0.01).onChange((fValue) => {
			fSkyboxSharpness = fValue;
		})

		pGUI.add({ skybox_blur: bAdvancedSkybox }, "skybox_blur").onChange((bValue) => {
			bAdvancedSkybox = bValue;
		});

		var pPBSFolder = pGUI.addFolder("pbs");

		(<dat.OptionController>pPBSFolder.add({ Skybox: 'sunset' }, 'Skybox', pSkyboxTexturesKeys)).name("Skybox").onChange((sKey) => {
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

			pPass.setUniform("FOG_EFFECT_COLOR", new math.Vec4(
				pFogData.fColorR/255, pFogData.fColorG/255, pFogData.fColorB/255, pFogData.fDensity));
			pPass.setUniform("FOG_EFFECT_START", pFogData.fStart);
			pPass.setUniform("FOG_EFFECT_INDEX", pFogData.fIndex);
			pPass.setUniform("FOG_EFFECT_HEIGHT", pFogData.fHeight);
		});

		pViewport.setAntialiasing(true);
		// (<IViewport3D>pViewport).getEffect().addComponent("akra.system.filmgrain");


		// pGUI.add({filmgrain: true}, 'filmgrain').name('film grain').onChange((bEnabled) => {
		// 	if (bEnabled) {
		// 		(<IViewport3D>pViewport).getEffect().addComponent("akra.system.filmgrain");
		// 	}
		// 	else {
		// 		(<IViewport3D>pViewport).getEffect().delComponent("akra.system.filmgrain");
		// 	}
		// });

		var canvas: HTMLCanvasElement = (<webgl.WebGLCanvas>pCanvas).getElement();
		// canvas.style["WebkitFilter"] = canvas.style["MozFilter"] = canvas.style["filter"]  ="sepia(1)";
		
		pGUI.add({sepia: false}, 'sepia').name('sepia').onChange((bEnabled) => {
			
			if (bEnabled) {
				canvas.style["WebkitFilter"] = canvas.style["MozFilter"] = canvas.style["filter"]  ="sepia(1)";
			}
			else {
				canvas.style["WebkitFilter"] = canvas.style["MozFilter"] = canvas.style["filter"]  ="none";
			}
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
		pOmniLight.setShadowCaster(false);
		pOmniLight.setInheritance(ENodeInheritance.ALL);
		pOmniLight.setPosition(lightPos1);


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

	}

	function createSky(): void {
		pSky = new model.Sky(pEngine, 32, 32, 1000.0);
		pSky.setTime(15.);

		pSky.sun.setShadowCaster(false);

		var pSceneModel: ISceneModel = pSky.skyDome;
		pSceneModel.attachToParent(pScene.getRootNode());
	}

	function createSkyBox(): void {
		pSkyboxTexture = pSkyboxTextures['sunset'];

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

	function createOcean(sub: String): ISceneModel {
		var pOceanQuad: ISceneModel = addons.createQuad(pScene, 500, new math.Vec2(5000, 5000));
		var pTexture: ITexture = pRmgr.createTexture("water_texture"+sub);
		pTexture.loadImages(pRmgr.getImagePool().findResource("WATER_NORMALS"));
		pOceanQuad.getRenderable(0).getSurfaceMaterial().setTexture(ESurfaceMaterialTextures.NORMAL, pTexture, 0);

		pTexture.setFilter(ETextureParameters.MIN_FILTER, ETextureFilters.LINEAR);
		pTexture.setFilter(ETextureParameters.MAG_FILTER, ETextureFilters.LINEAR);
		pTexture.setWrapMode(ETextureParameters.WRAP_S, ETextureWrapModes.REPEAT);
		pTexture.setWrapMode(ETextureParameters.WRAP_T, ETextureWrapModes.REPEAT);

		pOceanQuad.getRenderable(0).getEffect().addComponent("akra.system.water_surface");

		var time: float = 0.0;
		pOceanQuad.getRenderable(0).getTechniqueDefault().render.connect(
			(pTech: IRenderTechnique, iPass: uint, pRenderable: IRenderableObject, pSceneObject: ISceneObject, pViewport: IViewport) => {
				pTech.getPass(iPass).setUniform("WATER_TIME", time);
				time += 0.5 / 60.;
			});
		pOceanQuad.attachToParent(pScene.getRootNode());
		pOceanQuad.setShadow(false);

		var pMaterial = pOceanQuad.getRenderable(0).getMaterial();
		pMaterial.emissive.set(0.0);
		pMaterial.diffuse.set(0.0, 50/255, 30/255);
		pMaterial.specular.set(0.2);
		pMaterial.shininess = 0.8;

		return pOceanQuad;
	}

	function main(pEngine: IEngine) {
		std.setup(pCanvas);

		pCamera = createCamera();
		pViewport = createViewport();
		// pMirror = createMirror();
		pViewport.setBackgroundColor(color.GRAY);
		pViewport.setClearEveryFrame(true);

		var pStatsDiv = createStatsDIV();

		window.onresize = () => {
			pCanvas.resize(window.innerWidth, window.innerHeight);
		};


		// CREATE ENVIRONMENT
		createLighting();

		createSkyBox();
		var ocean1 = window["ocean1"] = createOcean('1').setPosition(0, -30, 0);
		var ocean2 = window["ocean2"] = createOcean('2').setPosition(-500, -30, 0);

		// PLASTIC PARAMS:
		var plasticColorSpecular: color.Color = new Color(0.05, 0.05, 0.05, 1.0);
		// var plasticColorDiffuse: color.Color = silverColorDiffuse;
		var plasticColorDiffuse: color.Color = new Color(0.35, 0.35, 0.35, 1.0);
		var plasticDarkColorDiffuse: color.Color = new Color(0.08, 0.08, 0.08, 1.0);

		// MODEL LIBRARY SETUP
		var pModelsKeys = [
			'air06',
		];
		var pPlaneParts = window['object_planeParts'] = {};
		pModelsFiles = {
			air06: {
				path: 'AIR06.DAE',
				init: function (model) {
					var hinges = [];
					model.explore(function (node) {
						if (scene.SceneModel.isModel(node)) {
							// first handle local matrices trouble

							var intPos = math.Vec3.temp(), intRot = math.Quat4.temp(), intScale = math.Vec3.temp();
							node.getLocalMatrix().decompose(intRot, intScale, intPos);

							if(node.getName().match('hinge')) {
								node.setVisible(false);
							}
							else {
								pPlaneParts[node.getName()] = node;
							}

							node.setLocalMatrix(new math.Mat4(1.));
							if(!(node.getParent()&&node.getParent().getName().match('hinge'))) {
								node.setRotation(intRot);
								node.setLocalScale(intScale);
								node.setPosition(intPos);
							}
						}
					});
					
					

					var audio = new Audio(sEngineSound);
					audio.loop = true;
					audio.play();

					pScene.beforeUpdate.connect(function() {
						audio.volume = math.clamp(15 - pCamera.getWorldPosition().length(), 0., 10.) / 50.;
						// console.log(audio.volume);
						funAnimation();
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

		var funPhaser = window['fun_phaser'] = (freq: float = 1., phase: float = 1.) => {
			return Math.sin(pEngine.getTime()*freq + phase);
		}

		var pos1 = 0;
		var pos2 = -1000;

		funAnimation = window['fun_animation'] = () => {
			pPlaneParts['plane_body'].setRotationByEulerAngles( 0, funPhaser(0.7,0.3)*0.05, funPhaser()*funPhaser(0.2)*0.06 );
			pPlaneParts['plane_motor'].addRelRotationByEulerAngles( 0, -0.6, 0 );
			pPlaneParts['plane_body'].setPosition( funPhaser(0.2)*0.1, funPhaser()*funPhaser(0.2)*0.1, 0);
			pPlaneParts['plane_body_antenna_L'].setRotationByEulerAngles( funPhaser(60)*0.04, 0, funPhaser(58)*0.04 );
			pPlaneParts['plane_body_antenna_R'].setRotationByEulerAngles( funPhaser(60,1)*0.04, 0, funPhaser(58)*0.04 );
			pPlaneParts['plane_body_wing_eleron_R'].setRotationByEulerAngles( 0., 0., funPhaser(0.7,-0.8)*0.16 );
			pPlaneParts['plane_body_wing_eleron_L'].setRotationByEulerAngles( 0., 0., funPhaser(0.7,2.4)*0.16 );
			pPlaneParts['plane_body_wing_flap_L'].setRotationByEulerAngles( 0., 0., funPhaser(1,-0.6)*funPhaser(0.2)*0.07 );
			pPlaneParts['plane_body_wing_flap_R'].setRotationByEulerAngles( 0., 0., funPhaser(1,-0.6)*funPhaser(0.2)*0.07 );
			pPlaneParts['plane_body_tail_elevator_L'].setRotationByEulerAngles( 0., 0., funPhaser(1,-0.6)*funPhaser(0.2)*0.2 );
			pPlaneParts['plane_body_tail_elevator_R'].setRotationByEulerAngles( 0., 0., funPhaser(1,-0.6)*funPhaser(0.2)*0.2 );
			pos1 = (pos1 + 30*pEngine.getElapsedTime() + 1000) % 2000 - 1000;
			pos2 = (pos2 + 30*pEngine.getElapsedTime() + 1000) % 2000 - 1000;
			ocean1.setPosition(pos1,-50,0);
			ocean2.setPosition(pos2,-50,0);
		}

		var funSmartPow = window['fun_smartPow'] = function( val, pow ) {
			var sign=val>=0?1:-1;
			return Math.pow(sign*val,pow)*sign;
		}

		pProgress.destroy();
		pEngine.exec();
	}

	pEngine.depsLoaded.connect(main);
}
