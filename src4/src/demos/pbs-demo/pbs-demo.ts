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
	export var pRmgr: IResourcePoolManager = pEngine.getResourceManager();
	export var pSky: model.Sky = null;
	export var pLensflareData = null;
	export var pBlurData = null;
    export var pDofData = null;
    export var pPBSData = null;
    export var pSkyboxTexture = null;
    export var pSkyboxTextures = null;
    export var pEnvTexture = null;

	var pState = {
		animate: true,
		lightShafts: true,
		lensFlare: true
	};

	export var animateTimeOfDay = () => {
		pSky.setTime(new Date().getTime() % 24000 / 500 - 24);
		requestAnimationFrame(animateTimeOfDay);
	}


	function createCamera(): ICamera {
		var pCamera: ICamera = pScene.createCamera();

		pCamera.addPosition(Vec3.temp(-2.9563467216312262, 3.900536759964575, -15.853719720993343));
		//pCamera.addRelRotationByXYZAxis(-0.2, 0., 0.);
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
			if (pKeymap.isKeyPress(EKeyCodes.A)) {
				pCamera.addRelPosition(-fSpeed, 0, 0);
			}
			if (pKeymap.isKeyPress(EKeyCodes.D)) {
				pCamera.addRelPosition(fSpeed, 0, 0);
			}
		});
	}

	function createViewport(): IViewport {
		var pViewport: IDSViewport = new render.DSViewport(pCamera);
		pCanvas.addViewport(pViewport);
		pCanvas.resize(window.innerWidth, window.innerHeight);

		window.onresize = function (event) {
			pCanvas.resize(window.innerWidth, window.innerHeight);
		};

		// (<render.DSViewport>pViewport).setFXAA(false);
		var counter = 0;
		var pEffect = (<render.DSViewport>pViewport).getEffect();
        pEffect.addComponent("akra.system.dof");
        pEffect.addComponent("akra.system.blur");
        // pEffect.addComponent("akra.system.lensflare");

		var pGUI = new dat.GUI();

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

        pPBSData = {
            isUsePBS: true
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

        var pPBSFolder = pGUI.addFolder("pbs");
        (<dat.OptionController>pPBSFolder.add(pPBSData, 'isUsePBS')).name("use PBS");
        (<dat.OptionController>pPBSFolder.add({Skybox:"desert"}, 'Skybox', Object.keys(pSkyboxTextures))).name("Skybox").onChange((sKey) => {
	        if (pViewport.getType() === EViewportTypes.DSVIEWPORT) {
	            (<render.DSViewport>pViewport).setSkybox(pSkyboxTextures[sKey]);
	        }
	        pEnvTexture.unwrapCubeTexture(pSkyboxTextures[sKey]);
        });

		console.log((<ITexture>pLensflareData.LENSFLARE_COOKIES_TEXTURE).loadImage(pEngine.getResourceManager().getImagePool().findResource("LENSFLARE_COOKIES_TEXTURE")));
        //var iCounter: int = 0;

		pViewport.render.connect((pViewport: IViewport, pTechnique: IRenderTechnique,
			iPass: uint, pRenderable: IRenderableObject, pSceneObject: ISceneObject) => {

			var pDeferredTexture: ITexture = (<render.DSViewport>pViewport).getColorTextures()[0];
			var pDepthTexture: ITexture = (<render.DSViewport>pViewport).getDepthTexture();
			var pPass: IRenderPass = pTechnique.getPass(iPass);

			//var v3fLightDir: IVec3 = math.Vec3.temp( math.Vec3.temp(pLight.getWorldPosition()).subtract(pCamera.getWorldPosition()).normalize() );
			//var pLightInDeviceSpace: IVec3 = math.Vec3.temp();
            //pCamera.projectPoint(math.Vec3.temp(pCamera.getWorldPosition()).add(v3fLightDir), pLightInDeviceSpace);

            if (iPass == 0) {
                pPass.setForeign('IS_USE_PBS_SIMPLE', pPBSData.isUsePBS ? 2 : 1 );
                // pPass.setUniform('PBS_GLOSS', pPBSData._Gloss );
                // pPass.setUniform('PBS_F0', pPBSData._Material._F0);
                // pPass.setUniform('PBS_DIFFUSE', pPBSData._Material._Diffuse);
                pPass.setTexture('ENVMAP', pEnvTexture);
            }


			//pLightInDeviceSpace.x = (pLightInDeviceSpace.x + 1) / 2;
			//pLightInDeviceSpace.y = (pLightInDeviceSpace.y + 1) / 2;

			//pLensflareData.LENSFLARE_LIGHT_POSITION = pLightInDeviceSpace;
            //pLensflareData.LENSFLARE_LIGHT_ANGLE = pCamera.getWorldMatrix().toQuat4().multiplyVec3(math.Vec3.temp(0., 0., -1.)).dot(v3fLightDir);;

            pDofData.DOF_FOCAL_PLANE = pViewport.unprojectPoint(math.Vec3.temp(pViewport.getActualWidth()/2., pViewport.getActualHeight()/2., 1.)).subtract(pCamera.getWorldPosition()).length();

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

			//if (iCounter++%240 === 0) {
			//console.log('sunshaft isVisible: ', pSunshaftData.SUNSHAFT_ANGLE, pCamera.getWorldMatrix().toQuat4().multiplyVec3(math.Vec3.temp(0., 0., -1.)).toString());
			//}

			pPass.setUniform("INPUT_TEXTURE_RATIO",
				math.Vec2.temp(pViewport.getActualWidth() / pDepthTexture.getWidth(), pDepthTexture.getWidth() / pDepthTexture.getHeight()));
			pPass.setUniform("SCREEN_ASPECT_RATIO",
                math.Vec2.temp(pViewport.getActualWidth() / pViewport.getActualHeight(), 1.));


		});
		return pViewport;
    }

    export var pLight: IOmniLight = null;
    export var pOmniLights: INode = null;
    function createLighting(): void {
        pOmniLights = pScene.createNode('lights-root');
        pOmniLights.attachToParent(pScene.getRootNode());

        var pOmniLight: IOmniLight;

        pOmniLight = <IOmniLight>pScene.createLightPoint(ELightTypes.OMNI, true, 512, "test-omni-0");

        pOmniLight.attachToParent(pOmniLights);
        pOmniLight.setEnabled(true);
        pOmniLight.getParams().ambient.set(0.1);
        pOmniLight.getParams().diffuse.set(1., 1., 1.);
        pOmniLight.getParams().specular.set(0.1, 0.3, 0.1, 0.3);
        pOmniLight.getParams().attenuation.set(1, 0, 0.02);
        pOmniLight.setShadowCaster(false);

        pOmniLight.addPosition(0, 13, 20);

        pOmniLight = <IOmniLight>pScene.createLightPoint(ELightTypes.OMNI, true, 512, "test-omni-0");

        pOmniLight.attachToParent(pOmniLights);
        pOmniLight.setEnabled(true);
        pOmniLight.getParams().ambient.set(0.1);
        pOmniLight.getParams().diffuse.set(1., 1., 1.);
        pOmniLight.getParams().specular.set(0.0, 0.1, 0.3, 0.3);
        pOmniLight.getParams().attenuation.set(1, 0, 0.02);
        pOmniLight.setShadowCaster(false);

        pOmniLight.addPosition(0, 6, 20);

        pOmniLight = <IOmniLight>pScene.createLightPoint(ELightTypes.OMNI, true, 512, "test-omni-0");

        pOmniLight.attachToParent(pOmniLights);
        pOmniLight.setEnabled(true);
        pOmniLight.getParams().ambient.set(0.1);
        pOmniLight.getParams().diffuse.set(1., 1., 1.);
        pOmniLight.getParams().specular.set(0.3, 0.1, 0.,0.3);
        pOmniLight.getParams().attenuation.set(1, 0, 0.02);
        pOmniLight.setShadowCaster(false);

        pOmniLight.addPosition(0, 3, 20);

        //pLight = pOmniLight;

        pScene.beforeUpdate.connect(() => {
            var t = akra.time() * 0.001 * 0.3;
            pOmniLights.setLocalPosition(math.Vec3.temp(10.*math.sin(t), 0., 4.*math.cos(t)));

            //pOmniLight.addRelRotationByXYZAxis(0.,0.,0.);
        });

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

        if (pViewport.getType() === EViewportTypes.DSVIEWPORT) {
            (<render.DSViewport>pViewport).setSkybox(pSkyboxTexture);
        }

        pEnvTexture = pRmgr.createTexture(".env-map-texture-01");
        pEnvTexture.create(1024, 512, 1, null, 0, 0, 0,
            ETextureTypes.TEXTURE_2D, EPixelFormats.R8G8B8);
        pEnvTexture.unwrapCubeTexture(pSkyboxTexture);
        
        //pCanvas.addViewport(new render.TextureViewport(pEnvTexture, 10. / pViewport.getActualWidth(), 10. / pViewport.getActualHeight(), pEnvTexture.getWidth() / pViewport.getActualWidth(), pEnvTexture.getHeight() / pViewport.getActualHeight(),10));
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
        pViewport.setBackgroundColor(color.GRAY);
        pViewport.setClearEveryFrame(true);

		var pStatsDiv = createStatsDIV();

		pCanvas.postUpdate.connect((pCanvas: ICanvas3d) => {
			pStatsDiv.innerHTML = pCanvas.getAverageFPS().toFixed(2) + " fps";
		});

		createKeymap(pCamera);

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

		var x = 0;

        /*(<ISceneNode>pTorus
            .scale(.1)
            .addPosition(0., 3.5, 0.)
            .addRelRotationByXYZAxis(math.HALF_PI, 0., 0.))
            .getScene().preUpdate.connect(() => {
                if (!pState.animate) { return; }

                pTorus.addRelRotationByEulerAngles(.01, .0025, 0.);

                var t = pEngine.getTime();
                pCamera.setPosition(6 * math.sin(t), 4 + 1 * Math.cos(t * 1.2), -24);
                pCamera.lookAt(Vec3.temp(0, 1.5, 0));
            });*/


        // LIGHT POSITION pOmniLight.addPosition(0, 6, 3);
        //var room: ISceneNode = loadModel("ROOMWITHROOM.DAE", null, 'Room', pScene.getRootNode());
        //var cube1: ISceneNode = <ISceneNode>loadModel("CUBE.DAE", null, 'Cube-01', pScene.getRootNode()).scale(0.3).addRelPosition( 2., .3, 4. );
        //var cube2: ISceneNode = <ISceneNode>loadModel("CUBE.DAE", null, 'Cube-02', pScene.getRootNode()).scale(0.3).addRelPosition(5., 0.3, 3.);
        
        loadModel("TEAPOT.DAE",
            (model)=>{
                model.explore( function(node) {
                    if(akra.scene.SceneModel.isModel(node)) {
                        //console.log(node.getMesh().getSubset(0).getMaterial().shininess);
                        node.getMesh().getSubset(0).getMaterial().shininess=0.99;
                        node.getMesh().getSubset(0).getMaterial().specular=new Color(0.999, 0.71, 0.29, 1.0);
                        node.getMesh().getSubset(0).getMaterial().diffuse=new Color(0.999, 0.86, 0.57, 1.0);
                        }
                    });
                }, 'teapot-01', pScene.getRootNode()).scale(3.0).addRelPosition( -12., 8., 20. );
        loadModel("TEAPOT.DAE", 
            (model)=>{
                model.explore( function(node) {
                    if(akra.scene.SceneModel.isModel(node)) {
                        node.getMesh().getSubset(0).getMaterial().shininess=0.75;
                        node.getMesh().getSubset(0).getMaterial().specular=new Color(0.999, 0.71, 0.29, 1.0);
                        node.getMesh().getSubset(0).getMaterial().diffuse=new Color(0.999, 0.86, 0.57, 1.0);
                        }
                    });
                }, 'teapot-02', pScene.getRootNode()).scale(3.0).addRelPosition( -6., 8., 20. );
        loadModel("TEAPOT.DAE", 
            (model)=>{
                model.explore( function(node) {
                    if(akra.scene.SceneModel.isModel(node)) {
                        node.getMesh().getSubset(0).getMaterial().shininess=0.50;
                        node.getMesh().getSubset(0).getMaterial().specular=new Color(0.999, 0.71, 0.29, 1.0);
                        node.getMesh().getSubset(0).getMaterial().diffuse=new Color(0.999, 0.86, 0.57, 1.0);
                        }
                    });
                }, 'teapot-03', pScene.getRootNode()).scale(3.0).addRelPosition( 0., 8., 20. );
        loadModel("TEAPOT.DAE", 
            (model)=>{
                model.explore( function(node) {
                    if(akra.scene.SceneModel.isModel(node)) {
                        node.getMesh().getSubset(0).getMaterial().shininess=0.25;
                        node.getMesh().getSubset(0).getMaterial().specular=new Color(0.999, 0.71, 0.29, 1.0);
                        node.getMesh().getSubset(0).getMaterial().diffuse=new Color(0.999, 0.86, 0.57, 1.0);
                        }
                    });
                }, 'teapot-04', pScene.getRootNode()).scale(3.0).addRelPosition( 6., 8., 20. );
        loadModel("TEAPOT.DAE", 
            (model)=>{
                model.explore( function(node) {
                    if(akra.scene.SceneModel.isModel(node)) {
                        node.getMesh().getSubset(0).getMaterial().shininess=0.01;
                        node.getMesh().getSubset(0).getMaterial().specular=new Color(0.999, 0.71, 0.29, 1.0);
                        node.getMesh().getSubset(0).getMaterial().diffuse=new Color(0.999, 0.86, 0.57, 1.0);
                        }
                    });
                }, 'teapot-05', pScene.getRootNode()).scale(3.0).addRelPosition( 12., 8., 20. );
        

        // loadModel("DONUT.DAE", null, 'donut-00', pScene.getRootNode()).scale(3.0).addRelPosition( -18., -3., 6. );
        // loadModel("DONUT.DAE", null, 'donut-01', pScene.getRootNode()).scale(3.0).addRelPosition( -14., -3., 6. );
        // loadModel("DONUT.DAE", null, 'donut-02', pScene.getRootNode()).scale(3.0).addRelPosition( -10., -3., 6. );
        // loadModel("DONUT.DAE", null, 'donut-03', pScene.getRootNode()).scale(3.0).addRelPosition( -6., -3., 6. );
        // loadModel("DONUT.DAE", null, 'donut-04', pScene.getRootNode()).scale(3.0).addRelPosition( -2., -3., 6. );
        // loadModel("DONUT.DAE", null, 'donut-05', pScene.getRootNode()).scale(3.0).addRelPosition( 2., -3., 6. );
        // loadModel("DONUT.DAE", null, 'donut-06', pScene.getRootNode()).scale(3.0).addRelPosition( 6., -3., 6. );
        // loadModel("DONUT.DAE", null, 'donut-07', pScene.getRootNode()).scale(3.0).addRelPosition( 10., -3., 6. );
        // loadModel("DONUT.DAE", null, 'donut-08', pScene.getRootNode()).scale(3.0).addRelPosition( 14., -3., 6. );
        // loadModel("DONUT.DAE", null, 'donut-09', pScene.getRootNode()).scale(3.0).addRelPosition( 18., -3., 6. );

        var ballDistance: float = 3.;

        loadModel("SPHERE.DAE", 
            (model)=>{
                model.explore( function(node) {
                    if(akra.scene.SceneModel.isModel(node)) {
                        node.getMesh().getSubset(0).getMaterial().shininess=0.99;
                        node.getMesh().getSubset(0).getMaterial().specular=new Color(0.95, 0.93, 0.88, 1.0);
                        node.getMesh().getSubset(0).getMaterial().diffuse=new Color(0.98, 0.97, 0.95, 1.0);
                        }
                    });
                }, 'sphere-metal-00', pScene.getRootNode()).scale(2.5).addRelPosition( -ballDistance/2*9, 4., 20. );
        loadModel("SPHERE.DAE", 
            (model)=>{
                model.explore( function(node) {
                    if(akra.scene.SceneModel.isModel(node)) {
                        node.getMesh().getSubset(0).getMaterial().shininess=0.88;
                        node.getMesh().getSubset(0).getMaterial().specular=new Color(0.95, 0.93, 0.88, 1.0);
                        node.getMesh().getSubset(0).getMaterial().diffuse=new Color(0.98, 0.97, 0.95, 1.0);
                        }
                    });
                }, 'sphere-metal-01', pScene.getRootNode()).scale(2.5).addRelPosition( -ballDistance/2*7, 4., 20. );
        loadModel("SPHERE.DAE", 
            (model)=>{
                model.explore( function(node) {
                    if(akra.scene.SceneModel.isModel(node)) {
                        node.getMesh().getSubset(0).getMaterial().shininess=0.77;
                        node.getMesh().getSubset(0).getMaterial().specular=new Color(0.95, 0.93, 0.88, 1.0);
                        node.getMesh().getSubset(0).getMaterial().diffuse=new Color(0.98, 0.97, 0.95, 1.0);
                        }
                    });
                }, 'sphere-metal-02', pScene.getRootNode()).scale(2.5).addRelPosition( -ballDistance/2*5, 4., 20. );
        loadModel("SPHERE.DAE", 
            (model)=>{
                model.explore( function(node) {
                    if(akra.scene.SceneModel.isModel(node)) {
                        node.getMesh().getSubset(0).getMaterial().shininess=0.66;
                        node.getMesh().getSubset(0).getMaterial().specular=new Color(0.95, 0.93, 0.88, 1.0);
                        node.getMesh().getSubset(0).getMaterial().diffuse=new Color(0.98, 0.97, 0.95, 1.0);
                        }
                    });
                }, 'sphere-metal-03', pScene.getRootNode()).scale(2.5).addRelPosition( -ballDistance/2*3, 4., 20. );
        loadModel("SPHERE.DAE", 
            (model)=>{
                model.explore( function(node) {
                    if(akra.scene.SceneModel.isModel(node)) {
                        node.getMesh().getSubset(0).getMaterial().shininess=0.55;
                        node.getMesh().getSubset(0).getMaterial().specular=new Color(0.95, 0.93, 0.88, 1.0);
                        node.getMesh().getSubset(0).getMaterial().diffuse=new Color(0.98, 0.97, 0.95, 1.0);
                        }
                    });
                }, 'sphere-metal-04', pScene.getRootNode()).scale(2.5).addRelPosition( -ballDistance/2, 4., 20. );
        loadModel("SPHERE.DAE", 
            (model)=>{
                model.explore( function(node) {
                    if(akra.scene.SceneModel.isModel(node)) {
                        node.getMesh().getSubset(0).getMaterial().shininess=0.44;
                        node.getMesh().getSubset(0).getMaterial().specular=new Color(0.95, 0.93, 0.88, 1.0);
                        node.getMesh().getSubset(0).getMaterial().diffuse=new Color(0.98, 0.97, 0.95, 1.0);
                        }
                    });
                }, 'sphere-metal-05', pScene.getRootNode()).scale(2.5).addRelPosition( ballDistance/2, 4., 20. );
        loadModel("SPHERE.DAE", 
            (model)=>{
                model.explore( function(node) {
                    if(akra.scene.SceneModel.isModel(node)) {
                        node.getMesh().getSubset(0).getMaterial().shininess=0.33;
                        node.getMesh().getSubset(0).getMaterial().specular=new Color(0.95, 0.93, 0.88, 1.0);
                        node.getMesh().getSubset(0).getMaterial().diffuse=new Color(0.98, 0.97, 0.95, 1.0);
                        }
                    });
                }, 'sphere-metal-06', pScene.getRootNode()).scale(2.5).addRelPosition( ballDistance/2*3, 4., 20. );
        loadModel("SPHERE.DAE", 
            (model)=>{
                model.explore( function(node) {
                    if(akra.scene.SceneModel.isModel(node)) {
                        node.getMesh().getSubset(0).getMaterial().shininess=0.22;
                        node.getMesh().getSubset(0).getMaterial().specular=new Color(0.95, 0.93, 0.88, 1.0);
                        node.getMesh().getSubset(0).getMaterial().diffuse=new Color(0.98, 0.97, 0.95, 1.0);
                        }
                    });
                }, 'sphere-metal-07', pScene.getRootNode()).scale(2.5).addRelPosition( ballDistance/2*5, 4., 20. );
        loadModel("SPHERE.DAE", 
            (model)=>{
                model.explore( function(node) {
                    if(akra.scene.SceneModel.isModel(node)) {
                        node.getMesh().getSubset(0).getMaterial().shininess=0.11;
                        node.getMesh().getSubset(0).getMaterial().specular=new Color(0.95, 0.93, 0.88, 1.0);
                        node.getMesh().getSubset(0).getMaterial().diffuse=new Color(0.98, 0.97, 0.95, 1.0);
                        }
                    });
                }, 'sphere-metal-08', pScene.getRootNode()).scale(2.5).addRelPosition( ballDistance/2*7, 4., 20. );
        loadModel("SPHERE.DAE", 
            (model)=>{
                model.explore( function(node) {
                    if(akra.scene.SceneModel.isModel(node)) {
                        node.getMesh().getSubset(0).getMaterial().shininess=0.01;
                        node.getMesh().getSubset(0).getMaterial().specular=new Color(0.95, 0.93, 0.88, 1.0);
                        node.getMesh().getSubset(0).getMaterial().diffuse=new Color(0.98, 0.97, 0.95, 1.0);
                        }
                    });
                }, 'sphere-metal-09', pScene.getRootNode()).scale(2.5).addRelPosition( ballDistance/2*9, 4., 20. );


        loadModel("SPHERE.DAE",  
            (model)=>{
                model.explore( function(node) {
                    if(akra.scene.SceneModel.isModel(node)) {
                        node.getMesh().getSubset(0).getMaterial().shininess=0.99;
                        node.getMesh().getSubset(0).getMaterial().specular=new Color(0.05, 0.05, 0.05, 1.0);
                        node.getMesh().getSubset(0).getMaterial().diffuse=new Color(0.85, 0.21, 0.21, 1.0);
                        }
                    });
                }, 'sphere-diel-00', pScene.getRootNode()).scale(2.5).addRelPosition( -ballDistance/2*9, 0., 20. );
        loadModel("SPHERE.DAE",  
            (model)=>{
                model.explore( function(node) {
                    if(akra.scene.SceneModel.isModel(node)) {
                        node.getMesh().getSubset(0).getMaterial().shininess=0.88;
                        node.getMesh().getSubset(0).getMaterial().specular=new Color(0.05, 0.05, 0.05, 1.0);
                        node.getMesh().getSubset(0).getMaterial().diffuse=new Color(0.85, 0.21, 0.21, 1.0);
                        }
                    });
                }, 'sphere-diel-01', pScene.getRootNode()).scale(2.5).addRelPosition( -ballDistance/2*7, 0., 20. );
        loadModel("SPHERE.DAE",  
            (model)=>{
                model.explore( function(node) {
                    if(akra.scene.SceneModel.isModel(node)) {
                        node.getMesh().getSubset(0).getMaterial().shininess=0.77;
                        node.getMesh().getSubset(0).getMaterial().specular=new Color(0.05, 0.05, 0.05, 1.0);
                        node.getMesh().getSubset(0).getMaterial().diffuse=new Color(0.85, 0.21, 0.21, 1.0);
                        }
                    });
                }, 'sphere-diel-02', pScene.getRootNode()).scale(2.5).addRelPosition( -ballDistance/2*5, 0., 20. );
        loadModel("SPHERE.DAE",  
            (model)=>{
                model.explore( function(node) {
                    if(akra.scene.SceneModel.isModel(node)) {
                        node.getMesh().getSubset(0).getMaterial().shininess=0.66;
                        node.getMesh().getSubset(0).getMaterial().specular=new Color(0.05, 0.05, 0.05, 1.0);
                        node.getMesh().getSubset(0).getMaterial().diffuse=new Color(0.85, 0.21, 0.21, 1.0);
                        }
                    });
                }, 'sphere-diel-03', pScene.getRootNode()).scale(2.5).addRelPosition( -ballDistance/2*3, 0., 20. );
        loadModel("SPHERE.DAE",  
            (model)=>{
                model.explore( function(node) {
                    if(akra.scene.SceneModel.isModel(node)) {
                        node.getMesh().getSubset(0).getMaterial().shininess=0.55;
                        node.getMesh().getSubset(0).getMaterial().specular=new Color(0.05, 0.05, 0.05, 1.0);
                        node.getMesh().getSubset(0).getMaterial().diffuse=new Color(0.85, 0.21, 0.21, 1.0);
                        }
                    });
                }, 'sphere-diel-04', pScene.getRootNode()).scale(2.5).addRelPosition( -ballDistance/2, 0., 20. );
        loadModel("SPHERE.DAE",  
            (model)=>{
                model.explore( function(node) {
                    if(akra.scene.SceneModel.isModel(node)) {
                        node.getMesh().getSubset(0).getMaterial().shininess=0.44;
                        node.getMesh().getSubset(0).getMaterial().specular=new Color(0.05, 0.05, 0.05, 1.0);
                        node.getMesh().getSubset(0).getMaterial().diffuse=new Color(0.85, 0.21, 0.21, 1.0);
                        }
                    });
                }, 'sphere-diel-05', pScene.getRootNode()).scale(2.5).addRelPosition( ballDistance/2, 0., 20. );
        loadModel("SPHERE.DAE",  
            (model)=>{
                model.explore( function(node) {
                    if(akra.scene.SceneModel.isModel(node)) {
                        node.getMesh().getSubset(0).getMaterial().shininess=0.33;
                        node.getMesh().getSubset(0).getMaterial().specular=new Color(0.05, 0.05, 0.05, 1.0);
                        node.getMesh().getSubset(0).getMaterial().diffuse=new Color(0.85, 0.21, 0.21, 1.0);
                        }
                    });
                }, 'sphere-diel-06', pScene.getRootNode()).scale(2.5).addRelPosition( ballDistance/2*3, 0., 20. );
        loadModel("SPHERE.DAE",  
            (model)=>{
                model.explore( function(node) {
                    if(akra.scene.SceneModel.isModel(node)) {
                        node.getMesh().getSubset(0).getMaterial().shininess=0.22;
                        node.getMesh().getSubset(0).getMaterial().specular=new Color(0.05, 0.05, 0.05, 1.0);
                        node.getMesh().getSubset(0).getMaterial().diffuse=new Color(0.85, 0.21, 0.21, 1.0);
                        }
                    });
                }, 'sphere-diel-07', pScene.getRootNode()).scale(2.5).addRelPosition( ballDistance/2*5, 0., 20. );
        loadModel("SPHERE.DAE",  
            (model)=>{
                model.explore( function(node) {
                    if(akra.scene.SceneModel.isModel(node)) {
                        node.getMesh().getSubset(0).getMaterial().shininess=0.11;
                        node.getMesh().getSubset(0).getMaterial().specular=new Color(0.05, 0.05, 0.05, 1.0);
                        node.getMesh().getSubset(0).getMaterial().diffuse=new Color(0.85, 0.21, 0.21, 1.0);
                        }
                    });
                }, 'sphere-diel-08', pScene.getRootNode()).scale(2.5).addRelPosition( ballDistance/2*7, 0., 20. );
        loadModel("SPHERE.DAE",  
            (model)=>{
                model.explore( function(node) {
                    if(akra.scene.SceneModel.isModel(node)) {
                        node.getMesh().getSubset(0).getMaterial().shininess=0.01;
                        node.getMesh().getSubset(0).getMaterial().specular=new Color(0.05, 0.05, 0.05, 1.0);
                        node.getMesh().getSubset(0).getMaterial().diffuse=new Color(0.85, 0.21, 0.21, 1.0);
                        }
                    });
                }, 'sphere-diel-09', pScene.getRootNode()).scale(2.5).addRelPosition( ballDistance/2*9, 0., 20. );

		pProgress.destroy();
		pEngine.exec();

		//animateTimeOfDay();
	}

	pEngine.depsLoaded.connect(main);
}