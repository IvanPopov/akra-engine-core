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

            var newRot = math.Vec2.temp(pCameraParams.current.rotation).add(math.Vec2.temp(pCameraParams.target.rotation).subtract(pCameraParams.current.rotation).scale(0.03));
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
			// var right = pMirror.getTempVectorRight();
			// var forward = pMirror.getTempVectorForward();

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


					//pCamera.addRelRotationByXYZAxis(-(v2fMouseShift.y / pViewport.getActualHeight() * 10.0), 0., 0.);
					//pCamera.addRotationByXYZAxis(0., -(v2fMouseShift.x / pViewport.getActualWidth() * 10.0), 0.);
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
        pViewport.enableSupportFor3DEvent(E3DEventTypes.MOUSEWHEEL);
        pViewport.mousewheel.connect((pViewport, x: float, y: float, fDelta: float) => {
            //console.log("mousewheel moved: ",x,y,fDelta);
            pCameraParams.target.orbitRadius = math.clamp(pCameraParams.target.orbitRadius + fDelta/pViewport.getActualHeight()*2., 2., 15.);
        });
	}

	var pGUI;

	function createViewport(): I3DViewport {
		var pViewport: ILPPViewport = new render.LPPViewport(pCamera, 0., 0., 1., 1., 11);
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

		pLensflareData = {
			LENSFLARE_COOKIES_TEXTURE: pEngine.getResourceManager().createTexture("LENSFLARE_COOKIES_TEXTURE"),
			LENSFLARE_TEXTURE_LOCATIONS: {
				COOKIE1: new math.Vec4(.0, .5, .5, .0),
				COOKIE2: new math.Vec4(.5, .5, 1., .0),
				COOKIE3: new math.Vec4(.0, .5625, 1., .5),
				//COOKIE4: new math.Vec4(.25, .5, .5, .25),
				//COOKIE5: new math.Vec4(.5, .5, 1., .0),
				//COOKIE6: new math.Vec4(.0, 1., .5, .5),
				//COOKIE7: new math.Vec4(.5, 1., 1., .5),
			},
			LENSFLARE_COOKIE_PARAMS: null,
			LENSFLARE_LIGHT_POSITION: null,
			LENSFLARE_LIGHT_ANGLE: null,
			LENSFLARE_DECAY: 16.,
			LENSFLARE_INTENSITY: 0.17,
			LENSFLARE_ABERRATION_SCALE: 0.07,
			LENSFLARE_ABERRATION_SAMPLES: 5,
			LENSFLARE_ABERRATION_FACTOR: 1.6,
		};

		pLensflareData.LENSFLARE_COOKIE_PARAMS = [
			{ TEXTURE_LOCATION: pLensflareData.LENSFLARE_TEXTURE_LOCATIONS.COOKIE2, PROPERTIES: new math.Vec4(140., 140., 2.3, 0.2) },
			{ TEXTURE_LOCATION: pLensflareData.LENSFLARE_TEXTURE_LOCATIONS.COOKIE2, PROPERTIES: new math.Vec4(180., 180., 1.9, 0.2) },
			{ TEXTURE_LOCATION: pLensflareData.LENSFLARE_TEXTURE_LOCATIONS.COOKIE2, PROPERTIES: new math.Vec4(128., 128., 1.65, 0.3) },
			{ TEXTURE_LOCATION: pLensflareData.LENSFLARE_TEXTURE_LOCATIONS.COOKIE2, PROPERTIES: new math.Vec4(64., 64., 1.4, 0.4) },
			{ TEXTURE_LOCATION: pLensflareData.LENSFLARE_TEXTURE_LOCATIONS.COOKIE1, PROPERTIES: new math.Vec4(1024., 1024., 1., 2.0) },
			{ TEXTURE_LOCATION: pLensflareData.LENSFLARE_TEXTURE_LOCATIONS.COOKIE3, PROPERTIES: new math.Vec4(2048., 64., 1., 1.0) },
			//{ TEXTURE_LOCATION: pLensflareData.LENSFLARE_TEXTURE_LOCATIONS.COOKIE1, PROPERTIES: new math.Vec4(200., 200., 0.45, 0.5) },
			{ TEXTURE_LOCATION: pLensflareData.LENSFLARE_TEXTURE_LOCATIONS.COOKIE2, PROPERTIES: new math.Vec4(100., 100., 0.5, 0.4) },
			{ TEXTURE_LOCATION: pLensflareData.LENSFLARE_TEXTURE_LOCATIONS.COOKIE2, PROPERTIES: new math.Vec4(128., 128., 0.2, 0.3) },
			{ TEXTURE_LOCATION: pLensflareData.LENSFLARE_TEXTURE_LOCATIONS.COOKIE2, PROPERTIES: new math.Vec4(200., 200., 0.05, 0.2) },
			{ TEXTURE_LOCATION: pLensflareData.LENSFLARE_TEXTURE_LOCATIONS.COOKIE2, PROPERTIES: new math.Vec4(128., 128., -0.1, 0.3) },
			{ TEXTURE_LOCATION: pLensflareData.LENSFLARE_TEXTURE_LOCATIONS.COOKIE2, PROPERTIES: new math.Vec4(100., 100., -0.3, 0.4) },
			//{ TEXTURE_LOCATION: pLensflareData.LENSFLARE_TEXTURE_LOCATIONS.COOKIE2, PROPERTIES: new math.Vec4(200., 200., -0.35, 0.3) },
			//{ TEXTURE_LOCATION: pLensflareData.LENSFLARE_TEXTURE_LOCATIONS.COOKIE2, PROPERTIES: new math.Vec4(128., 128., -0.45, 0.4) },
			{ TEXTURE_LOCATION: pLensflareData.LENSFLARE_TEXTURE_LOCATIONS.COOKIE2, PROPERTIES: new math.Vec4(240., 240., -0.65, 0.2) },
			{ TEXTURE_LOCATION: pLensflareData.LENSFLARE_TEXTURE_LOCATIONS.COOKIE2, PROPERTIES: new math.Vec4(128., 128., -0.85, 0.35) },
			{ TEXTURE_LOCATION: pLensflareData.LENSFLARE_TEXTURE_LOCATIONS.COOKIE2, PROPERTIES: new math.Vec4(180., 180., -1.1, 0.2) },
			{ TEXTURE_LOCATION: pLensflareData.LENSFLARE_TEXTURE_LOCATIONS.COOKIE2, PROPERTIES: new math.Vec4(100., 100., -1.7, 0.4) },
		];

		pBlurData = {
			BLUR_RADIUS: 0,
		};

		pDofData = {
			DOF_RADIUS: 0,
			DOF_FOCAL_PLANE: 10.,
			DOF_FOCUS_POWER: 0.6,
			DOF_QUALITY: 0.7,
		};

		var pBlurFolder = pGUI.addFolder("blur");
		(<dat.NumberControllerSlider>pBlurFolder.add(pBlurData, 'BLUR_RADIUS')).min(0.).max(250.).name("radius");

		var pDofFolder = pGUI.addFolder("dof");
		(<dat.NumberControllerSlider>pDofFolder.add(pDofData, 'DOF_RADIUS')).min(0.).max(50.).name("dof radius");
		(<dat.NumberControllerSlider>pDofFolder.add(pDofData, 'DOF_FOCUS_POWER')).min(0.1).max(1.2).name("focus power");
		(<dat.NumberControllerSlider>pDofFolder.add(pDofData, 'DOF_FOCAL_PLANE')).min(1.).max(100.).name("focal plane");
		(<dat.NumberControllerSlider>pDofFolder.add(pDofData, 'DOF_QUALITY')).min(0.1).max(1.).name("quality");

		// var pPBSFolder = pGUI.addFolder("pbs");
		// (<dat.OptionController>pPBSFolder.add(pPBSData, 'isUsePBS')).name("use PBS");
		// (<dat.NumberControllerSlider>pPBSFolder.add(pPBSData, '_Gloss')).step(0.01).min(0).max(1).name("gloss");
		// (<dat.OptionController>pPBSFolder.add({Material:"Plastic"}, 'Material', Object.keys(pMaterialPresets))).name("Material").onChange((sKey) => {
		// 	pPBSData._Material = pMaterialPresets[sKey];
		// });

		console.log((<ITexture>pLensflareData.LENSFLARE_COOKIES_TEXTURE).loadImage(pEngine.getResourceManager().getImagePool().findResource("LENSFLARE_COOKIES_TEXTURE")));
		//var iCounter: int = 0;

        var pPBSFolder = pGUI.addFolder("pbs");
        (<dat.OptionController>pPBSFolder.add(pPBSData, 'isUsePBS')).name("use PBS");
        (<dat.OptionController>pPBSFolder.add({Skybox:"desert"}, 'Skybox', pSkyboxTexturesKeys)).name("Skybox").onChange((sKey) => {
	        if (pViewport.getType() === EViewportTypes.LPPVIEWPORT) {
	            (<render.LPPViewport>pViewport).setSkybox(pSkyboxTextures[sKey]);
	        }
	        // if (pReflectionViewport.getType() === EViewportTypes.LPPVIEWPORT) {
	            // (<render.LPPViewport>pReflectionViewport).setSkybox(pSkyboxTextures[sKey]);
	        // }
	         (<ITexture>pEnvTexture).unwrapCubeTexture(pSkyboxTextures[sKey]);
        });

        (<I3DViewport>pViewport).setShadingModel(EShadingModel.PBS_SIMPLE);

		pViewport.render.connect((pViewport: IViewport, pTechnique: IRenderTechnique,
			iPass: uint, pRenderable: IRenderableObject, pSceneObject: ISceneObject) => {

			var pDeferredTexture: ITexture = (<I3DViewport>pViewport).getTextureWithObjectID();
			var pDepthTexture: ITexture = (<render.LPPViewport>pViewport).getDepthTexture();
			var pPass: IRenderPass = pTechnique.getPass(iPass);

			pPass.setTexture('DEFERRED_TEXTURE', pDeferredTexture);
			pPass.setTexture('LENSFLARE_COOKIES_TEXTURE', pLensflareData.LENSFLARE_COOKIES_TEXTURE);
			pPass.setUniform('LENSFLARE_COOKIE_PARAMS', pLensflareData.LENSFLARE_COOKIE_PARAMS);
			pPass.setForeign('LENSFLARE_COOKIES_TOTAL', pLensflareData.LENSFLARE_COOKIE_PARAMS.length);
			pPass.setUniform('LENSFLARE_LIGHT_POSITION', pLensflareData.LENSFLARE_LIGHT_POSITION);
			pPass.setUniform('LENSFLARE_LIGHT_ANGLE', pLensflareData.LENSFLARE_LIGHT_ANGLE);
			pPass.setUniform('LENSFLARE_INTENSITY', pLensflareData.LENSFLARE_INTENSITY);
			pPass.setUniform('LENSFLARE_DECAY', pLensflareData.LENSFLARE_DECAY);
			pPass.setUniform('LENSFLARE_SKYDOME_ID', 0.);
			pPass.setUniform('LENSFLARE_ABERRATION_SCALE', pLensflareData.LENSFLARE_ABERRATION_SCALE);
			pPass.setUniform('LENSFLARE_ABERRATION_SAMPLES', pLensflareData.LENSFLARE_ABERRATION_SAMPLES);
			pPass.setUniform('LENSFLARE_ABERRATION_FACTOR', pLensflareData.LENSFLARE_ABERRATION_FACTOR);

			pPass.setUniform('BLUR_RADIUS', pBlurData.BLUR_RADIUS);

			pPass.setUniform('DOF_RADIUS', pDofData.DOF_RADIUS);
			pPass.setUniform('DOF_FOCAL_PLANE', pDofData.DOF_FOCAL_PLANE);
			pPass.setUniform('DOF_FOCUS_POWER', pDofData.DOF_FOCUS_POWER);
			pPass.setUniform('DOF_QUALITY', pDofData.DOF_QUALITY);

			pPass.setTexture('CUBETEXTURE0', pSkyboxTexture);

			pPass.setUniform("INPUT_TEXTURE_RATIO",
				math.Vec2.temp(pViewport.getActualWidth() / pDepthTexture.getWidth(), pDepthTexture.getWidth() / pDepthTexture.getHeight()));
			pPass.setUniform("SCREEN_ASPECT_RATIO",
				math.Vec2.temp(pViewport.getActualWidth() / pViewport.getActualHeight(), 1.));


		});
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

		var pTexViewport: IMirrorViewport = <IMirrorViewport>pRenderTarget.addViewport(new render.MirrorViewport(pReflectionCamera, 0., 0., 1., 1., 0));
		// pTexViewport.setFXAA(false);

		// pCanvas.addViewport(pViewport);
        // pCanvas.addViewport(new render.TextureViewport(pReflectionTexture, 10. / pViewport.getActualWidth(), 10. / pViewport.getActualHeight(), 0.3, 0.3, 10));
        // (<I3DViewport>pTexViewport).setShadingModel(EShadingModel.PBS_SIMPLE);

        // pDepthViewport = pCanvas.addViewport(new render.TextureViewport((<I3DViewport>pViewport).getDepthTexture(), 10. / pViewport.getActualWidth(), 20. / pViewport.getActualHeight() + 0.3, 0.3, 0.3, 11));
        // pDepthViewport.getEffect().addComponent("akra.system.display_depth");
        // pDepthViewport.render.connect( (pViewport: IViewport, pTechnique: IRenderTechnique,
			// iPass: uint, pRenderable: IRenderableObject, pSceneObject: ISceneObject) => {

			// pTechnique.getPass(iPass).setUniform("depthRange", math.Vec2.temp(.9,1.));

        	// });

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
		pOmniLightSphere = loadModel("data/models/Sphere.dae", 
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
		pOmniLightSphere = loadModel("data/models/Sphere.dae", 
			(model) => {
				model.explore( function(node) {
					if(scene.SceneModel.isModel(node)) {
						node.getMesh().getSubset(0).getMaterial().emissive = new Color(1.,1.,1.);
						}
					})
				}, "test-omni-0-model", pOmniLight).scale(0.15);
		pOmniLightSphere.setPosition(0.,0.,0.);
		pOmniLight.setPosition(lightPos2);

		//loadModel(data + "models/cube.DAE", null, 'camera').setPosition(1, 5, 3).scale(0.1);

		//pLight = pOmniLight;
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

        if (pViewport.getType() === EViewportTypes.LPPVIEWPORT) {
            (<render.LPPViewport>pViewport).setSkybox(pSkyboxTexture);
        }

        // if (pReflectionViewport.getType() === EViewportTypes.LPPVIEWPORT) {
            // (<render.LPPViewport>pReflectionViewport).setSkybox(pSkyboxTexture);
        // }

        pEnvTexture = pRmgr.createTexture(".env-map-texture-01");
        pEnvTexture.create(1024, 512, 1, null, 0, 0, 0,
            ETextureTypes.TEXTURE_2D, EPixelFormats.R8G8B8);
        pEnvTexture.unwrapCubeTexture(pSkyboxTexture);
        
        // pCanvas.addViewport(new render.TextureViewport(pEnvTexture, 10. / pViewport.getActualWidth(), 10. / pViewport.getActualHeight(), pEnvTexture.getWidth() / pViewport.getActualWidth(), pEnvTexture.getHeight() / pViewport.getActualHeight(),10));

		(<I3DViewport>pViewport).setDefaultEnvironmentMap(pEnvTexture);
		// (<I3DViewport>pReflectionViewport).setDefaultEnvironmentMap(pEnvTexture);
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


		//var pSceneQuad: ISceneModel = addons.createQuad(pScene, 100.);
		//pSceneQuad.attachToParent(pScene.getRootNode());

        createSkyBox();

		//loadModel("WOOD_SOLDIER.DAE", null, 'WoodSoldier-01');
		//loadModel("ROCK.DAE", null, 'Rock-01').addPosition(-2, 1, -4).addRotationByXYZAxis(0, math.PI, 0);
		//loadModel("ROCK.DAE", null, 'Rock-02').addPosition(2, 1, -4);
		//loadModel("ROCK.DAE", null, 'Rock-03').addPosition(2, 5, -4);
		//loadModel("ROCK.DAE", null, 'Rock-04', pCamera).scale(0.2).setPosition(0.4, -0.2, -2);
		//var pTorus: ISceneNode = loadModel("TORUSKNOT.DAE", null, 'TorusKnot-01', pScene.getRootNode());
		//var pRock1: ISceneNode = loadModel("ROCK.DAE", null, 'Rock-01', pScene.getRootNode());
		//pRock1.setPosition(-3., 0., 10.);
		//var pRock2: ISceneNode = loadModel("ROCK.DAE", null, 'Rock-02', pScene.getRootNode());
		//pRock2.setPosition(5., 0., -10.);

		// LIGHT POSITION pOmniLight.addPosition(0, 6, 3);
		//var room: ISceneNode = loadModel("ROOMWITHROOM.DAE", null, 'Room', pScene.getRootNode());
		//var cube1: ISceneNode = <ISceneNode>loadModel("CUBE.DAE", null, 'Cube-01', pScene.getRootNode()).scale(0.3).addRelPosition( 2., .3, 4. );
		//var cube2: ISceneNode = <ISceneNode>loadModel("CUBE.DAE", null, 'Cube-02', pScene.getRootNode()).scale(0.3).addRelPosition(5., 0.3, 3.);
		
		// LIGHT SOURCES MARKS: (crazy water)
	// loadModel("SPHERE.DAE", 
		//     (model)=>{
		//         model.explore( function(node) {
		//             if(akra.scene.SceneModel.isModel(node)) {
		//                 node.getMesh().getSubset(0).getMaterial().shininess=0.50;
		//                 node.getMesh().getSubset(0).getMaterial().specular=new Color(0.02, 0.02, 0.02, 1.0);
		//                 node.getMesh().getSubset(0).getMaterial().diffuse=new Color(1.15, 1.15, 1.15, 1.0);
		//                 }
		//             });
		//         }, 'sphere-light-00', pScene.getRootNode()).scale(0.5).addRelPosition( lightPos1 );
		// loadModel("SPHERE.DAE", 
		//     (model)=>{
		//         model.explore( function(node) {
		//             if(akra.scene.SceneModel.isModel(node)) {
		//                 node.getMesh().getSubset(0).getMaterial().shininess=0.50;
		//                 node.getMesh().getSubset(0).getMaterial().specular=new Color(0.02, 0.02, 0.02, 1.0);
		//                 node.getMesh().getSubset(0).getMaterial().diffuse=new Color(1.15, 1.15, 1.15, 1.0);
		//                 }
		//             });
		//         }, 'sphere-light-01', pScene.getRootNode()).scale(0.5).addRelPosition( lightPos2 );
		// loadModel("SPHERE.DAE", 
		//     (model)=>{
		//         model.explore( function(node) {
		//             if(akra.scene.SceneModel.isModel(node)) {
		//                 node.getMesh().getSubset(0).getMaterial().shininess=0.50;
		//                 node.getMesh().getSubset(0).getMaterial().specular=new Color(0.02, 0.02, 0.02, 1.0);
		//                 node.getMesh().getSubset(0).getMaterial().diffuse=new Color(1.15, 1.15, 1.15, 1.0);
		//                 }
		//             });
		//         }, 'sphere-light-02', pScene.getRootNode()).scale(0.5).addRelPosition( lightPos3 );

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

		pModelTable = <ISceneNode>loadModel("CUBE.DAE",
			(model) => {
				model.explore( function(node) {
					if(scene.SceneModel.isModel(node)) {
						node.getMesh().getSubset(0).getMaterial().shininess=0.7;
						node.getMesh().getSubset(0).getMaterial().specular=plasticColorSpecular;
						node.getMesh().getSubset(0).getMaterial().diffuse=plasticColorDiffuse;
						node.getMesh().getSubset(0).getTechnique().render.connect( (pTech: IRenderTechnique, iPass, pRenderable, pSceneObject, pLocalViewport) => {
							pTech.getPass(iPass).setTexture("MIRROR_TEXTURE", pReflectionTexture);
							pTech.getPass(iPass).setForeign("IS_USED_MIRROR_REFLECTION", true);
						});
						}
					})
				}, 'cube-01', pScene.getRootNode()).scale(.5,0.05,.5).setPosition(0.,-1.5,0.);

        var pModelsKeys = [
        	'miner',
        	'character',
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
        	miner: {
        		path: "data/models/miner/miner.DAE",
        		init: function(model) { },
        	},
        	character: {
        		path: "data/models/character/character.DAE",
        		init: function(model) { model.scale(1.5); },
        	},
        	teapot: {
        		path: "data/models/teapot.DAE",
        		init: function(model) { },
        	},
        	donut: {
        		path: "data/models/Donut.DAE",
        		init: function(model) { },
        	},
        	sphere: {
        		path: "data/models/Sphere.dae",
        		init: function(model) { },
        	},
        	rock: {
        		path: "data/models/rock/rock-1-low-p.DAE",
        		init: function(model) { model.addPosition(0,0.8,0); },
        	},
        	windspot: {
        		path: "data/models/windspot/WINDSPOT.DAE",
        		init: function(model) { },
        	},
        	can: {
        		path: "data/models/can/can.DAE",
        		init: function(model) { model.addPosition(0,0.3,0); },
        	},
        };
        pModels = { };

    	pModels["miner"] = loadModel(pModelsFiles["miner"].path, null, "miner", pModelTable).setPosition( 0., .25, 0. ).addPosition(0.,-1000.,0.);
        pCurrentModel = pModels["miner"];
    	// pCurrentModel.attachToParent(pScene.getRootNode());
        pCurrentModel.addPosition(0.,1000.,0.);

        var pModelsFolder = pGUI.addFolder("models");

        (<dat.OptionController>pModelsFolder.add({Model:"miner"}, 'Model', pModelsKeys)).name("Model").onChange((sKey) => {
        	// pCurrentModel.detachFromParent();
        	pCurrentModel.addPosition(0.,-1000.,0.);
        	if(pModels[sKey] == null) {
        		pModels[sKey] = loadModel(pModelsFiles[sKey].path, null, sKey, pModelTable).setPosition( 0., .25, 0. ).addPosition(0.,-1000.,0.);
        		pModelsFiles[sKey].init(pModels[sKey]);
        	}
        	pCurrentModel = pModels[sKey];
        	pCurrentModel.addPosition(0.,1000.,0.);
        	// pCurrentModel.attachToParent(pScene.getRootNode());
            // console.log("Unwrapping cubemap: ", (<ITexture>pEnvTexture).unwrapCubeTexture(pSkyboxTextures[sKey]));
        });

        pCurrentModel.attachToParent(pModelTable);

		pMirror.attachToParent(pModelTable);
		pMirror.setPosition(0.,.25,0.);



		pCanvas.viewportPreUpdate.connect((pTarget: IRenderTarget, pViewport: IViewport) => {
			if(pViewport === akra.pViewport){
				var normal = pMirror.getTempVectorUp();
				var dist = pMirror.getWorldPosition().dot(normal);
				(<IMirrorViewport>pReflectionViewport).getReflectionPlane().set(normal, dist);
				pReflectionTexture.getBuffer().getRenderTarget().update();
			}
		});
		
		pProgress.destroy();
		pEngine.exec();

		//animateTimeOfDay();
	}

	pEngine.depsLoaded.connect(main);
}
