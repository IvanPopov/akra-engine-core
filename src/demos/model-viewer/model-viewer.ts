/// <reference path="../../../built/Lib/akra.d.ts" />
/// <reference path="../../../built/Lib/base3dObjects.addon.d.ts" />
/// <reference path="../../../built/Lib/progress.addon.d.ts" />

/// <reference path="../std/std.ts" />

/// <reference path="../idl/3d-party/dat.gui.d.ts" />

declare var AE_RESOURCES: akra.IDep;
declare var AE_MODELS: any;

module akra {
	var modelsPath = AE_MODELS.content;

	var pProgress = new addons.Progress(document.getElementById("progress"));

	var pRenderOpts: IRendererOptions = {
		depth: true,
		premultipliedAlpha: false,
		preserveDrawingBuffer: true,
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
	export var pReflectionCamera: ICamera = null;
	export var pReflectionViewport: IViewport = null;
	export var pReflectionTexture: ITexture = null;
	export var pMirror: INode = null;
	export var pRmgr: IResourcePoolManager = pEngine.getResourceManager();
	export var pSky: model.Sky = null;
	export var pLensflareData = null;
	export var pBlurData = null;
	export var pDofData = null;
	export var pPBSData = null;
	export var pSkyboxTexture = null;
	export var pSkyboxTextures = null;
	export var pEnvTexture = null;
	export var pDepthViewport = null;

	var pState = {
		animate: true,
		lightShafts: true,
		lensFlare: true
	};

	export var animateTimeOfDay = () => {
		pSky.setTime(new Date().getTime() % 24000 / 500 - 24);
		requestAnimationFrame(animateTimeOfDay);
	}

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
				newRad*-math.sin(newRot.x)*math.cos(newRot.y),
				newRad*math.sin(newRot.y),
				newRad*math.cos(newRot.x)*math.cos(newRot.y));
			pCamera.lookAt(math.Vec3.temp(0,0,0));

			pCamera.update();
					
			var dist = math.Vec3.temp(pCamera.getWorldPosition()).subtract(pMirror.getWorldPosition());
			var up = pMirror.getTempVectorUp();

			pReflectionCamera.setPosition( math.Vec3.temp(pCamera.getWorldPosition()).add( math.Vec3.temp(up).scale(-2.*(up.dot(dist))) ) );
			pReflectionCamera.setRotationByForwardUp(
				pCamera.getTempVectorForward().add( math.Vec3.temp(up).scale(-2.*up.dot(pCamera.getTempVectorForward())) ),
				pCamera.getTempVectorUp().add( math.Vec3.temp(up).scale(-2.*up.dot(pCamera.getTempVectorUp())) ) );
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
		(<render.LPPViewport>pViewport).enableSupportForUserEvent(EUserEvents.MOUSEWHEEL);
		pViewport.mousewheel.connect((pViewport, x: float, y: float, fDelta: float) => {
			//console.log("mousewheel moved: ",x,y,fDelta);
			pCameraParams.target.orbitRadius = math.clamp(pCameraParams.target.orbitRadius - fDelta/pViewport.getActualHeight()*2., 2., 15.);
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

		(<render.LPPViewport>pViewport).setFXAA(false);
		var counter = 0;
		var pEffect = (<render.LPPViewport>pViewport).getEffect();
		//pEffect.addComponent("akra.system.dof");
		pEffect.addComponent("akra.system.blur");
		// pEffect.addComponent("akra.system.lensflare");

		pGUI = new dat.GUI();

		pGUI.add(pState, 'animate');

		var pSkyboxTexturesKeys = [
			'desert',
			'nature',
			'colosseum',
			'beach',
			'plains',
			'church',
			'basilica',
		];
		pSkyboxTextures = { };
		for(var i=0; i<pSkyboxTexturesKeys.length; i++) {
			// console.log("Creating skybox: ",pSkyboxTexturesKeys[i],pSkyboxTexturesKeys[i].toUpperCase());
			pSkyboxTextures[pSkyboxTexturesKeys[i]] = pRmgr.createTexture(".sky-box-texture-"+pSkyboxTexturesKeys[i]);
			(<ITexture>(pSkyboxTextures[pSkyboxTexturesKeys[i]])).loadResource("SKYBOX_"+pSkyboxTexturesKeys[i].toUpperCase());
			// console.log("Done!");
		};

		var pMaterialPresets = {
			Gold: {
				_F0: new math.Vec3(1., 1., 1.),
				_Diffuse: new math.Vec3(1.00, 0.86, 0.57),
			},
			Copper: {
				_F0: new math.Vec3(1., 1., 1.),
				_Diffuse: new math.Vec3(0.98, 0.82, 0.76),
			},
			Plastic: {
				_F0: new math.Vec3(1., 1., 1.),
				_Diffuse: new math.Vec3(0.21, 0.21, 0.21),
			},
			Iron: {
				_F0: new math.Vec3(1., 1., 1.),
				_Diffuse: new math.Vec3(0.77, 0.78, 0.78),
			},
			Aluminium: {
				_F0: new math.Vec3(1., 1., 1.),
				_Diffuse: new math.Vec3(0.96, 0.96, 0.97),
			},
			Silver: {
				_F0: new math.Vec3(1., 1., 1.),
				_Diffuse: new math.Vec3(0.98, 0.97, 0.95),
			},
			Water: {
				_F0: new math.Vec3(0.15, 0.15, 0.15),
				_Diffuse: new math.Vec3(0.98, 0.97, 0.95),
			},
			Glass: {
				_F0: new math.Vec3(0.21, 0.21, 0.21),
				_Diffuse: new math.Vec3(0.98, 0.97, 0.95),
			}
		};

		pPBSData = {
			isUsePBS: true,
			_Material: pMaterialPresets.Aluminium,
			_Gloss: 0,
		}

		pGUI.add(pState, 'lensFlare').name('lensFlare').onChange((bEnabled) => {
			if (bEnabled) {
				// pEffect.addComponent("akra.system.lensflare");
			}
			else {
				// pEffect.delComponent("akra.system.lensflare", fx.ANY_SHIFT, fx.ANY_PASS);
			}
		});

		pBlurData = {
			BLUR_RADIUS: 0,
		};

		var pBlurFolder = pGUI.addFolder("blur");
		(<dat.NumberControllerSlider>pBlurFolder.add(pBlurData, 'BLUR_RADIUS')).min(0.).max(250.).name("radius");

        var pPBSFolder = pGUI.addFolder("pbs");
        (<dat.OptionController>pPBSFolder.add(pPBSData, 'isUsePBS')).name("use PBS");
        (<dat.OptionController>pPBSFolder.add({Skybox:"desert"}, 'Skybox', pSkyboxTexturesKeys)).name("Skybox").onChange((sKey) => {
	        //if (pViewport.getType() === EViewportTypes.LPPVIEWPORT) {
	        (<render.LPPViewport>pViewport).setSkybox(pSkyboxTextures[sKey]);
	        //}
	         (<ITexture>pEnvTexture).unwrapCubeTexture(pSkyboxTextures[sKey]);
        });

		(<ILPPViewport>pViewport).setShadingModel(EShadingModel.PBS_SIMPLE);

		//pViewport.render.connect((pViewport: IViewport, pTechnique: IRenderTechnique,
		//	iPass: uint, pRenderable: IRenderableObject, pSceneObject: ISceneObject) => {

		//	//var pDeferredTexture: ITexture = (<ILPPViewport>pViewport).getTextureWithObjectID();
		//	var pDepthTexture: ITexture = (<render.LPPViewport>pViewport).getDepthTexture();
		//	var pPass: IRenderPass = pTechnique.getPass(iPass);

		//	//pPass.setTexture('DEFERRED_TEXTURE', pDeferredTexture);

		//	pPass.setUniform('BLUR_RADIUS', pBlurData.BLUR_RADIUS);

		//	pPass.setTexture('CUBETEXTURE0', pSkyboxTexture);

		//	pPass.setUniform("INPUT_TEXTURE_RATIO",
		//		math.Vec2.temp(pViewport.getActualWidth() / pDepthTexture.getWidth(), pDepthTexture.getWidth() / pDepthTexture.getHeight()));
		//	pPass.setUniform("SCREEN_ASPECT_RATIO",
		//		math.Vec2.temp(pViewport.getActualWidth() / pViewport.getActualHeight(), 1.));


		//});
		return pViewport;
	}

	function createMirror(): INode {
		var pNode:INode = pScene.createNode().setPosition(0.,-1.5,0.);
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

		var pDepthTexture = pRmgr.createTexture(".mirror_depth");
		pDepthTexture.create(512, 512, 1, null, 0, 0, 0, ETextureTypes.TEXTURE_2D, EPixelFormats.DEPTH32);
		pRenderTarget.attachDepthTexture(pDepthTexture);

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
		pOmniLightSphere = loadModel( modelsPath + "/Sphere.dae", 
			(model) => {
				model.explore( function(node) {
					if(scene.SceneModel.isModel(node)) {
						node.getMesh().getSubset(0).getMaterial().emissive = new Color(1.,1.,1.);
						}
					})
				}, "test-omni-0-model", pOmniLight).scale(0.15);
		pOmniLightSphere.setPosition(0.,0.,0.);
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
		pOmniLightSphere = loadModel( modelsPath + "/Sphere.dae", 
			(model) => {
				model.explore( function(node) {
					if(scene.SceneModel.isModel(node)) {
						node.getMesh().getSubset(0).getMaterial().emissive = new Color(1.,1.,1.);
						}
					})
				}, "test-omni-0-model", pOmniLight).scale(0.15);
		pOmniLightSphere.setPosition(0.,0.,0.);
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
		pSkyboxTexture = pSkyboxTextures['desert'];

		if (pViewport.getType() === EViewportTypes.FORWARDVIEWPORT) {
			var pModel = addons.cube(pScene);
			(<IForwardViewport>pViewport).setSkyboxModel(pModel.getRenderable(0));
		}
		//if (pViewport.getType() === EViewportTypes.LPPVIEWPORT || pViewport.getType() === EViewportTypes.DSVIEWPORT) {
		(<render.LPPViewport>pViewport).setSkybox(pSkyboxTexture);
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
		if(pRoot != null) {
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
			"margin: 5px;");

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

		//createSky();
		createLighting();

		createSkyBox();

		// PLASTIC PARAMS:
		var plasticColorSpecular: color.Color = new Color(0.05, 0.05, 0.05, 1.0);
		// var plasticColorDiffuse: color.Color = silverColorDiffuse;
		var plasticColorDiffuse: color.Color = new Color(0.35, 0.35, 0.35, 1.0);

		console.log("-------------");
		console.log("-------------");
		console.log("-------------");
		console.log("-------------");
		console.log("-------------");
		console.log("-------------");
		console.log("------------- Start preloading models");
		console.log("------------- + Models table");

		pModelTable = addons.trifan(pScene, 2.5, 96);
		pModelTable.attachToParent( pScene.getRootNode() );
		pModelTable.setPosition( 0., -1.25, 0. );
		pModelTable.explore( function(node) {
				if(scene.SceneModel.isModel(node)) {
					node.getMesh().getSubset(0).getMaterial().shininess=0.7;
					node.getMesh().getSubset(0).getMaterial().specular=plasticColorSpecular;
					node.getMesh().getSubset(0).getMaterial().diffuse=plasticColorDiffuse;
					node.getMesh().getSubset(0).getTechnique().render.connect( (pTech: IRenderTechnique, iPass, pRenderable, pSceneObject, pLocalViewport) => {
						pTech.getPass(iPass).setTexture("MIRROR_TEXTURE", pReflectionTexture);
						pTech.getPass(iPass).setForeign("IS_USED_MIRROR_REFLECTION", true);
					});
				}
			});

		var pModelsKeys = [
			'mercedes',
			'miner',
			'character',
			'head',
			'sponza',
			'teapot',
			'donut',
			'sphere',
			'rock',
			'windspot',
			'can',
			// 'box',
			// 'barrel',
		];
		var pModelsFiles = {
			mercedes: {
				path: modelsPath + "/../../../mercedes/models/mercedes.DAE",
				init: () => { }
			},
			miner: {
				path: modelsPath+"/miner/miner.DAE",
				init: function(model) { },
			},
			character: {
				path: modelsPath+"/character/character.DAE",
				init: function(model) { model.scale(1.5); },
			},
			head: {
				path: modelsPath+"/head/head.DAE",
				init: function(model) { model.scale(0.7); },
			},
			sponza: {
				path: modelsPath+"/sponza/sponza.DAE",
				init: function(model) { model.scale(1.5); },
			},
			teapot: {
				path: modelsPath+"/teapot.DAE",
				init: function(model) { },
			},
			donut: {
				path: modelsPath+"/Donut.DAE",
				init: function(model) { },
			},
			sphere: {
				path: modelsPath+"/Sphere.dae",
				init: function(model) { },
			},
			rock: {
				path: modelsPath+"/rock/rock-1-low-p.DAE",
				init: function(model) { model.addPosition(0,0.8,0); },
			},
			windspot: {
				path: modelsPath+"/windspot/WINDSPOT.DAE",
				init: function(model) { },
			},
			can: {
				path: modelsPath+"/can/can.DAE",
				init: function(model) { model.addPosition(0,0.3,0); },
			},
		};
		pModels = { };

		pModels["miner"] = loadModel(pModelsFiles["miner"].path, null, "miner", pModelTable).setPosition( 0., 0., 0. ).addPosition(0.,-1000.,0.);
		pCurrentModel = pModels["miner"];
		pCurrentModel.addPosition(0.,1000.,0.);

		var pModelsFolder = pGUI.addFolder("models");

		(<dat.OptionController>pModelsFolder.add({Model:"miner"}, 'Model', pModelsKeys)).name("Model").onChange((sKey) => {
			pCurrentModel.addPosition(0.,-1000.,0.);
			if(pModels[sKey] == null) {
				pModels[sKey] = loadModel(pModelsFiles[sKey].path, null, sKey, pModelTable).setPosition( 0., 0., 0. ).addPosition(0.,-1000.,0.);
				pModelsFiles[sKey].init(pModels[sKey]);
			}
			pCurrentModel = pModels[sKey];
			pCurrentModel.addPosition(0.,1000.,0.);
		});

		pCurrentModel.attachToParent(pModelTable);

		pMirror.attachToParent(pModelTable);
		pMirror.setPosition(0.,0.,0.);
		var pCylinder = addons.cylinder(pScene, 2.5, 2.5, 0.5, 96);
		pCylinder.attachToParent(pModelTable);
		pCylinder.setPosition(0., -0.25, 0.);
		// pCylinder.explore( function(node) {
		// 		if(scene.SceneModel.isModel(node)) {
		// 			node.getMesh().getSubset(0).getMaterial().shininess=0.7;
		// 			node.getMesh().getSubset(0).getMaterial().specular=plasticColorSpecular;
		// 			node.getMesh().getSubset(0).getMaterial().diffuse=plasticColorDiffuse;
		// 		}
		// 	});

		pCanvas.viewportPreUpdate.connect((pTarget: IRenderTarget, pViewport: IViewport) => {
			if(pViewport === akra.pViewport){
				var normal = pMirror.getTempVectorUp();
				var dist = pMirror.getWorldPosition().dot(normal);
				(<IMirrorViewport>pReflectionViewport).getReflectionPlane().set(normal, dist);
				if (pMirror.getTempVectorUp().dot( math.Vec3.temp( pCamera.getWorldPosition() ).subtract( pMirror.getWorldPosition() ) ) > 0.) {
					pReflectionTexture.getBuffer().getRenderTarget().update();
				}
			}
		});

		pProgress.destroy();
		pEngine.exec();
	}

	pEngine.depsLoaded.connect(main);
}
