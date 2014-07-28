/// <reference path="../../../built/Lib/akra.d.ts" />
/// <reference path="../../../built/Lib/base3dObjects.addon.d.ts" />
/// <reference path="../../../built/Lib/progress.addon.d.ts" />
/// <reference path="../../../built/Lib/compatibility.addon.d.ts" />

/// <reference path="../std/std.ts" />

declare var AE_RESOURCES: akra.IDep;
declare var AE_MODELS: any;

module akra {
	console.time("LOADING");
	// addons.compatibility.requireWebGLExtension(webgl.WEBGL_COMPRESSED_TEXTURE_S3TC);
	addons.compatibility.verify("non-compatible");

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
			orbitRadius: 1.,
			rotation: new math.Vec2(0., 0.)
		},
		target: {
			orbitRadius: 3.,
			rotation: new math.Vec2(0., 0.)
		}
	}
	export var pCameraFPSParams = {
		current: {
			rotation: new math.Vec2(0., 0.),
			velocity: new math.Vec3(),
		},
		target: {
			rotation: new math.Vec2(0., 0.),
			velocity: new math.Vec3(),
			speed: 5
		}
	}

	export var pModels = null;
	export var pCurrentModel = null;
	export var pPhysObjects = null;
	export var pPhysics = null;
	export var funAnimation = null;
	export var pSceneParts: any = {};

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
				var newVel: IVec3 = math.Vec3.temp(pCameraFPSParams.current.velocity).add(math.Vec3.temp(pCameraFPSParams.target.velocity).subtract(pCameraFPSParams.current.velocity).scale(0.03));

				pCameraFPSParams.current.velocity.set(newVel);
				pCameraFPSParams.current.rotation.set(newRot);
				// pCamera.setPosition(newPos);
				pCamera.setRotationByEulerAngles(-newRot.x,-newRot.y,0.);
				pCamera.getLocalPosition().add( newVel.scale(pEngine.getElapsedTime()) );
				
				// Set world bounds
				var cameraPos = pCamera.getLocalPosition();
				cameraPos.x = Math.min(Math.max(cameraPos.x, -3.1), 3.1);
				cameraPos.z = Math.min(Math.max(cameraPos.z, -3.2), 3.2);
				cameraPos.y = Math.min(Math.max(cameraPos.y, 0.15), 2.4);
			}
			else {
				var newRot = math.Vec2.temp(pCameraParams.current.rotation).add(math.Vec2.temp(pCameraParams.target.rotation).subtract(pCameraParams.current.rotation).scale(0.15));
				var newRad = pCameraParams.current.orbitRadius * (1. + (pCameraParams.target.orbitRadius - pCameraParams.current.orbitRadius) * 0.03);

				pCameraParams.current.rotation.set(newRot);
				pCameraParams.current.orbitRadius = newRad;
				pCamera.setPosition(
					newRad * -math.sin(newRot.x) * math.cos(newRot.y),
					newRad * math.sin(newRot.y) + 1.2,
					newRad * math.cos(newRot.x) * math.cos(newRot.y));
				pCamera.lookAt(math.Vec3.temp(0, 1.2, 0));
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
			else {
				if(!bFPSCameraControls) {
					pCameraFPSParams.current.rotation.set(pCameraParams.current.rotation);
					pCameraFPSParams.target.rotation.set(pCameraFPSParams.current.rotation);
				}
				bFPSCameraControls = !bFPSCameraControls;
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
						pCameraParams.target.rotation.y = math.clamp(pCameraParams.target.rotation.y + v2fMouseShift.y / pViewport.getActualHeight() * 3., -0.29, 0.34);
						pCameraParams.target.rotation.x += v2fMouseShift.x / pViewport.getActualHeight() * 3.;
					}
					pKeymap.update();
				}

			}
			var fSpeed: float = pCameraFPSParams.target.speed;
			pCameraFPSParams.target.velocity.set(0., 0., 0.);
			if (pKeymap.isKeyPress(EKeyCodes.W)) {
				// pCamera.addRelPosition(0, 0, -fSpeed);
				if(bFPSCameraControls) {
					pCameraFPSParams.target.velocity.add(pCamera.getTempVectorForward().scale(-fSpeed));
				}
			}
			if (pKeymap.isKeyPress(EKeyCodes.S)) {
				// pCamera.addRelPosition(0, 0, fSpeed);
				if(bFPSCameraControls) {
					pCameraFPSParams.target.velocity.add(pCamera.getTempVectorForward().scale(fSpeed));
				}
			}
			if (pKeymap.isKeyPress(EKeyCodes.A) || pKeymap.isKeyPress(EKeyCodes.LEFT)) {
				// pCamera.addRelPosition(-fSpeed, 0, 0);
				if(bFPSCameraControls) {
					pCameraFPSParams.target.velocity.add(pCamera.getTempVectorRight().scale(fSpeed));
				}
			}
			if (pKeymap.isKeyPress(EKeyCodes.D) || pKeymap.isKeyPress(EKeyCodes.RIGHT)) {
				// pCamera.addRelPosition(fSpeed, 0, 0);
				if(bFPSCameraControls) {
					pCameraFPSParams.target.velocity.add(pCamera.getTempVectorRight().scale(-fSpeed));
				}
			}
			if (pKeymap.isKeyPress(EKeyCodes.UP)) {
				// pCamera.addRelPosition(0, fSpeed, 0);
				if(bFPSCameraControls) {
					pCameraFPSParams.target.velocity.add(pCamera.getTempVectorUp().scale(fSpeed));
				}
			}
			if (pKeymap.isKeyPress(EKeyCodes.DOWN)) {
				// pCamera.addRelPosition(0, -fSpeed, 0);
				if(bFPSCameraControls) {
					pCameraFPSParams.target.velocity.add(pCamera.getTempVectorUp().scale(-fSpeed));
				}
			}
		});
		(<ILPPViewport>pViewport).enableSupportForUserEvent(EUserEvents.MOUSEWHEEL);
		pViewport.mousewheel.connect((pViewport, x: float, y: float, fDelta: float) => {
			//console.log("mousewheel moved: ",x,y,fDelta);
			if(!bFPSCameraControls) {
				pCameraParams.target.orbitRadius = math.clamp(pCameraParams.target.orbitRadius - fDelta / pViewport.getActualHeight() * 2., 1., 4.);
			}
		});
	}

	var pGUI;

	function createViewport(): IViewport3D {

		var pViewport: ILPPViewport = new render./*LPP*/ForwardViewport(pCamera, 0., 0., 1., 1., 11);

		pCanvas.addViewport(pViewport);
		pCanvas.resize(window.innerWidth, window.innerHeight);

		var pHTMLCanvas: HTMLCanvasElement = (<webgl.WebGLCanvas>pCanvas).getElement();
		pHTMLCanvas.style["WebkitFilter"] = 
		pHTMLCanvas.style["MozFilter"] = 
		pHTMLCanvas.style["filter"] = "brightness(1.8)";

		window.onresize = function (event) {
			pCanvas.resize(window.innerWidth, window.innerHeight);
		};

		(<render.LPPViewport>pViewport).setFXAA(true);
		var counter = 0;

		var pSkyboxTexturesKeys = [
			'cube',
		];
		pSkyboxTextures = {};
		for (var i = 0; i < pSkyboxTexturesKeys.length; i++) {

			var pTexture: ITexture = pSkyboxTextures[pSkyboxTexturesKeys[i]] = pRmgr.createTexture(".sky-box-texture-" + pSkyboxTexturesKeys[i]);

			pTexture.setFlags(ETextureFlags.AUTOMIPMAP);
			pTexture.loadResource("SKYBOX_" + pSkyboxTexturesKeys[i].toUpperCase());
			pTexture.setFilter(ETextureParameters.MAG_FILTER, ETextureFilters.LINEAR);
			pTexture.setFilter(ETextureParameters.MIN_FILTER, ETextureFilters.LINEAR);
		};

		(<ILPPViewport>pViewport).setShadingModel(EShadingModel.PBS_SIMPLE);

		pViewport.render.connect((pViewport: IViewport, pTechnique: IRenderTechnique,
			iPass: uint, pRenderable: IRenderableObject, pSceneObject: ISceneObject) => {

			var pPass: IRenderPass = pTechnique.getPass(iPass);
			pPass.setForeign("PhysicalSpecG", 1/*Neumann*/);
		});


		if (pViewport.getType() === EViewportTypes.LPPVIEWPORT) {
			(<IViewport3D>pViewport).getEffect().addComponent("akra.system.filmgrain");

			pViewport.enableSupportForUserEvent(EUserEvents.CLICK);
			pViewport.enable3DEvents(false);

			pViewport.click.connect((pViewport: ILPPViewport, x: uint, y: uint) =>  {
				var pick = pViewport.pick(x, y);
				pViewport.highlight(pick);
				console.log(pick.renderable.getMaterial());
			});
		}

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
		var pLightSphere;

		pOmniLight = <IOmniLight>pScene.createLightPoint(ELightTypes.OMNI, true, 2048, "room-luster-light");

		pOmniLight.attachToParent(pOmniLights);
		pOmniLight.setEnabled(true);
		pOmniLight.getParams().ambient.set(0.0);
		pOmniLight.getParams().diffuse.set(1.0, 0.6, 0.3);
		pOmniLight.getParams().specular.set(1.0, 1.0, 1.0, 1.0);
		pOmniLight.getParams().attenuation.set(1, 0, 1.3);
		pOmniLight.setShadowCaster(true);
		pOmniLight.setInheritance(ENodeInheritance.ALL);
		pOmniLight.setPosition(0., 2, 0);
		// pLightSphere = loadModel(modelsPath + "/Sphere.DAE",
		// 	(model) => {
		// 		model.explore(function (node) {
		// 			if (scene.SceneModel.isModel(node)) {
		//  				node.getMesh().getSubset(0).getMaterial().diffuse.set(0);
		//  				node.getMesh().getSubset(0).getMaterial().emissive = new Color(1.0, 0.6, 0.3);
		// 				(<IMeshSubset>node.getMesh().getSubset(0)).setShadow(false);
		// 			}
		// 		})
		// 	}, "room-luster-light-model", pOmniLight).scale(0.15);
		// pLightSphere.setPosition(0., 0., 0.);


		var pProjectLight1: IProjectLight = <IProjectLight>pScene.createLightPoint(ELightTypes.PROJECT, true, 2048, "test-project-1");
		pProjectLight1.attachToParent(pOmniLights);
		pProjectLight1.setEnabled(true);
		pProjectLight1.getParams().ambient.set(0.0);
		pProjectLight1.getParams().diffuse.set(0.3, 0.6, 1.0);
		pProjectLight1.getParams().specular.set(0.3, 0.3, 0.3, 1.0);
		pProjectLight1.getParams().attenuation.set(1, 0, 0.3);
		pProjectLight1.setShadowCaster(true);
		pProjectLight1.setInheritance(ENodeInheritance.ALL);
		pProjectLight1.getShadowCaster().setFOV(1.5);
		pProjectLight1.lookAt(math.Vec3.temp(0, 0, -1));
		pProjectLight1.setPosition(0, 0.5, 3);
		pLightSphere = loadModel("SPHERE.DAE",
			(model) => {
				model.explore(function (node) {
					if (scene.SceneModel.isModel(node)) {
						node.getMesh().getSubset(0).getMaterial().diffuse.set(0);
						node.getMesh().getSubset(0).getMaterial().emissive = new Color(0.3, 0.6, 1.0);
						(<IMeshSubset>node.getMesh().getSubset(0)).setShadow(false);
					}
				})
			}, "test-omni-1-model", pProjectLight1).scale(0.07);
		pLightSphere.setPosition(0., 0., 0.);


		var pProjectLight2: IProjectLight = <IProjectLight>pScene.createLightPoint(ELightTypes.PROJECT, true, 2048, "test-project-2");

		pProjectLight2.attachToParent(pOmniLights);
		pProjectLight2.setEnabled(true);
		pProjectLight2.getParams().ambient.set(0.0);
		pProjectLight2.getParams().diffuse.set(0.3, 0.6, 1.0);
		pProjectLight2.getParams().specular.set(0.3, 0.3, 0.3, 1.0);
		pProjectLight2.getParams().attenuation.set(1, 0, 0.3);
		pProjectLight2.setShadowCaster(true);
		pProjectLight2.setInheritance(ENodeInheritance.ALL);
		pProjectLight2.getShadowCaster().setFOV(1.5);
		pProjectLight2.lookAt(math.Vec3.temp(0, 0, 1));
		pProjectLight2.setPosition(0, 1., -3);
		pLightSphere = loadModel("SPHERE.DAE",
			(model) => {
				model.explore(function (node) {
					if (scene.SceneModel.isModel(node)) {
						node.getMesh().getSubset(0).getMaterial().diffuse.set(0);
						node.getMesh().getSubset(0).getMaterial().emissive = new Color(0.3, 0.6, 1.0);
						(<IMeshSubset>node.getMesh().getSubset(0)).setShadow(false);
					}
				})
			}, "test-omni-1-model", pProjectLight2).scale(0.07);
		pLightSphere.setPosition(0., 0., 0.);


		var pProjectLight3: IProjectLight = <IProjectLight>pScene.createLightPoint(ELightTypes.PROJECT, true, 2048, "test-project-2");

		pProjectLight3.attachToParent(pOmniLights);
		pProjectLight3.setEnabled(true);
		pProjectLight3.getParams().ambient.set(0.0);
		pProjectLight3.getParams().diffuse.set(0.3, 0.6, 1.0);
		pProjectLight3.getParams().specular.set(0.3, 0.3, 0.3, 1.0);
		pProjectLight3.getParams().attenuation.set(1, 0, 0.3);
		pProjectLight3.setShadowCaster(true);
		pProjectLight3.setInheritance(ENodeInheritance.ALL);
		pProjectLight3.getShadowCaster().setFOV(1.5);
		pProjectLight3.lookAt(math.Vec3.temp(-1, 0, 0));
		pProjectLight3.setPosition(3, 1., 0);
		pLightSphere = loadModel("SPHERE.DAE",
			(model) => {
				model.explore(function (node) {
					if (scene.SceneModel.isModel(node)) {
						node.getMesh().getSubset(0).getMaterial().diffuse.set(0);
						node.getMesh().getSubset(0).getMaterial().emissive = new Color(1.0, 1.0, 1.0);
						(<IMeshSubset>node.getMesh().getSubset(0)).setShadow(false);
					}
				})
			}, "test-omni-1-model", pProjectLight3).scale(0.07);
		pLightSphere.setPosition(0., 0., 0.);

		pSceneParts.pOmniLight = pOmniLight;
		pSceneParts.pProjectLight1 = pProjectLight1;
		pSceneParts.pProjectLight2 = pProjectLight2;
		pSceneParts.pProjectLight3 = pProjectLight3;
	}

	function createSky(): void {
		pSky = new model.Sky(pEngine, 32, 32, 1000.0);
		pSky.setTime(15.);

		pSky.sun.setShadowCaster(false);

		var pSceneModel: ISceneModel = pSky.skyDome;
		pSceneModel.attachToParent(pScene.getRootNode());
	}

	function createSkyBox(): void {
		pSkyboxTexture = pSkyboxTextures['cube'];

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
		//pModel.setOptions({ forceOptimization: true });

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

		// pCanvas.postUpdate.connect((pCanvas: ICanvas3d) => {
		// 	pStatsDiv.innerHTML = pCanvas.getAverageFPS().toFixed(2) + " fps";
		// });

		// window.onresize = () => {
		// 	pCanvas.resize(window.innerWidth, window.innerHeight);
		// };

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
			'room_scene',
		];
		pModelsFiles = {
			room_scene: {
				path: 'ROOM.DAE',
				init: function (model) {
					model.setRotationByXYZAxis(-Math.PI/2., 0., 0.);
					model.findEntity("room").setShadow(false);
					model.findEntity("door").setShadow(false);
					var lamp = model.findEntity("light_bulb");
					lamp.setShadow(false);
					(<ISceneNode>pScene.getRootNode().findEntity("room-luster-light")).setPosition(0.,0.,0.).attachToParent(lamp);
					pSceneParts.fan_propeller = model.findEntity("fan_propeller");
					pSceneParts.luster = model.findEntity("luster");

					model.explore(function (node) {
						if (scene.SceneModel.isModel(node)) {
							// first handle local matrices trouble

							var intPos = math.Vec3.temp(), intRot = math.Quat4.temp(), intScale = math.Vec3.temp();
							node.getLocalMatrix().decompose(intRot, intScale, intPos);

							if(node.getName().match('hinge')) {
								node.setVisible(false);
							}

							node.setLocalMatrix(new math.Mat4(1.));
							if(!(node.getParent()&&node.getParent().getName().match('hinge'))) {
								node.setRotation(intRot);
								node.setLocalScale(intScale);
								node.setPosition(intPos);
							}
						}
					});

					pScene.beforeUpdate.connect(function() {
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

		// FINAL PREPARAIONS

		createKeymap(pCamera);

		animateCameras();

		var funPhaser = window['fun_phaser'] = (freq: float = 1., phase: float = 1.) => {
			return Math.sin(pEngine.getTime()*freq + phase);
		}

		var pos1 = 0;
		var pos2 = -1000;
		
		function animateLight(pLight: ILightPoint, fTime: float) {
			var pPos = pLight.getLocalPosition();
			pPos.x = 3 * math.cos(fTime);
			pPos.y = funPhaser(0.3)*0.7 + 1.;
			pPos.z = 3 * math.sin(fTime);

			pLight.setPosition(pPos);
			pLight.lookAt(math.Vec3.temp(0));
		}

		var t = 0;

		funAnimation = window['fun_animation'] = () => {

			t = pEngine.getTime();

			animateLight(pSceneParts.pProjectLight1, t * 0.27);
			animateLight(pSceneParts.pProjectLight2, t * 0.27 + Math.PI * 2. / 3.);
			animateLight(pSceneParts.pProjectLight3, t * 0.27 + Math.PI * 4. / 3.);

			pSceneParts.fan_propeller.addRelRotationByXYZAxis(0., -1. * Math.PI * pEngine.getElapsedTime(), 0.);
			pSceneParts.luster.setRotationByXYZAxis(funPhaser(1.6)*0.15, funPhaser(1.1, Math.PI/2.)*0.15, funPhaser(0.63)*0.15);

		}

		pProgress.destroy();
		pEngine.exec();

		console.timeEnd("LOADING");
	}

	pEngine.depsLoaded.connect(main);
}
