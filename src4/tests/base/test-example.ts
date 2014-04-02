/// <reference path="../../build/akra.d.ts" />
/// <reference path="../../build/addons/base3dObjects.addon.d.ts" />
/// <reference path="../../build/addons/navigation.addon.d.ts" />

module akra {
	var pDeps = {
		root: "../../../src2/data/",
		files: [
            { path: "textures/lensflare_cookies_new.png", name: "LENSFLARE_COOKIES_TEXTURE" },
            { path: "textures/terrain/main_height_map_1025.dds", name: "TERRAIN_HEIGHT_MAP" },
			{ path: "textures/terrain/main_terrain_normal_map.dds", name: "TERRAIN_NORMAL_MAP" },
			{ path: "textures/skyboxes/desert-3.dds", name: "SKYBOX" },
			{ path: "textures/terrain/diffuse.dds", name: "MEGATEXTURE_MIN_LEVEL" },
            { path: "effects/sunshaft.afx" },
            { path: "effects/lensflare.afx" },
            { path: "effects/blur.afx" }
		]
	};

	export var pEngine = akra.createEngine({ deps: pDeps });
	export var pScene = pEngine.getScene();
	export var pCanvas: ICanvas3d = pEngine.getRenderer().getDefaultCanvas();
	export var pCamera: ICamera = null;
	export var pViewport: IViewport = null;
	export var pRmgr: IResourcePoolManager = pEngine.getResourceManager();
	export var pSky: model.Sky = null;
    export var pTerrain: ITerrain = null;
    export var pSunshaftData = null;
    export var pLensflareData = null;
    export var pBlurData = null;
    export var animateTimeOfDay = function () { akra.pSky.setTime(new Date().getTime() % 24000 / 500 - 24); requestAnimationFrame(animateTimeOfDay); }
    export var animateBlurRadius = function () { akra.pBlurData.BLUR_RADIUS = (math.sin(new Date().getTime() * 0.0002 % 1 * 2 * Math.PI) + 1) * 30; requestAnimationFrame(animateBlurRadius); }

	var data = "../../../src2/data/";

	function setup(pCanvas: ICanvas3d): void {
		var pCanvasElement: HTMLCanvasElement = (<any>pCanvas).getElement();
		var pDiv: HTMLDivElement = <HTMLDivElement>document.createElement("div");

		document.body.appendChild(pDiv);
		pDiv.appendChild(pCanvasElement);
		pDiv.style.position = "fixed";
	}

	function createSceneEnvironment(): void {
		var pSceneQuad: ISceneModel = addons.createQuad(pScene, 100.);
		pSceneQuad.attachToParent(pScene.getRootNode());
		//pSceneQuad.addPosition(0., 1., 0.);

		var pSceneSurface: ISceneModel = addons.createSceneSurface(pScene, 40);
		pSceneSurface.addPosition(0, 0.01, 0);
		pSceneSurface.scale(5.);
		pSceneSurface.attachToParent(pScene.getRootNode());
	}

	function createCamera(): ICamera {
		var pCamera: ICamera = pScene.createCamera();

		pCamera.addPosition(math.Vec3.temp(0, 4, 5));
		pCamera.addRelRotationByXYZAxis(-0.2, 0., 0.);
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

	function createTerrain(pScene: IScene3d, bShowMegaTex: boolean = true, eType: EEntityTypes = EEntityTypes.TERRAIN_ROAM): ITerrain {
		var pRmgr: IResourcePoolManager = pScene.getManager().getEngine().getResourceManager();
		var pTerrain: ITerrain = null;
		if (eType === EEntityTypes.TERRAIN_ROAM) {
			pTerrain = pScene.createTerrainROAM("Terrain");
			(<ITerrainROAM>pTerrain).setUseTessellationThread(false);
		}
		else {
			pTerrain = pScene.createTerrain("Terrain");
		}

		var pTerrainMap: ITerrainMaps = {
			height: pRmgr.getImagePool().findResource("TERRAIN_HEIGHT_MAP"),
			normal: pRmgr.getImagePool().findResource("TERRAIN_NORMAL_MAP")
		};
		// pTerrain.manualMegaTextureInit = !bShowMegaTex;

		var isCreate: boolean = pTerrain.init(pTerrainMap, new geometry.Rect3d(-250, 250, -250, 250, 0, 150), 7, 3, 3, "main");
		pTerrain.attachToParent(pScene.getRootNode());
		pTerrain.setInheritance(ENodeInheritance.ALL);

		pTerrain.setRotationByXYZAxis(-Math.PI / 2, 0., 0.);
		pTerrain.setPosition(11, -109, -109.85);

		var pMinLevel: IImg = pRmgr.getImagePool().findResource("MEGATEXTURE_MIN_LEVEL");
		if (pMinLevel) {
			pTerrain.getMegaTexture().setMinLevelTexture(pMinLevel);
			//(<terrain.MegaTexture>pTerrain.getMegaTexture()).enableStreaming(true);
		}

		pTerrain.setShowMegaTexture(bShowMegaTex);

		return pTerrain;
	}

	function createViewport(): IViewport {
		var pViewport: IViewport = new render.DSViewport(pCamera);
		pCanvas.addViewport(pViewport);
		pCanvas.resize(window.innerWidth, window.innerHeight);

		window.onresize = function (event) {
			pCanvas.resize(window.innerWidth, window.innerHeight);
		};

		// (<render.DSViewport>pViewport).setFXAA(false);
		var counter = 0;
        (<render.DSViewport>pViewport).getEffect().addComponent("akra.system.sunshaft");
        (<render.DSViewport>pViewport).getEffect().addComponent("akra.system.blur");
        (<render.DSViewport>pViewport).getEffect().addComponent("akra.system.lensflare");

        pSunshaftData = {
            SUNSHAFT_ANGLE: null,
            SUNSHAFT_SAMPLES: 70,
            SUNSHAFT_COLOR: new math.Vec3(1., 0.96, 0.9),
            SUNSHAFT_INTENSITY: 0.14,
            SUNSHAFT_DECAY: 1.2,
            SUNSHAFT_SHARPNESS: 2,
        };

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
            { TEXTURE_LOCATION: pLensflareData.LENSFLARE_TEXTURE_LOCATIONS.COOKIE2, PROPERTIES: new math.Vec4(64., 64., 1., 0.4) },
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
            BLUR_SAMPLES: 25,
            BLUR_RADIUS: 0,
        };

        console.log((<ITexture>pLensflareData.LENSFLARE_COOKIES_TEXTURE).loadImage(pEngine.getResourceManager().getImagePool().findResource("LENSFLARE_COOKIES_TEXTURE")));
        //var iCounter: int = 0;

		pViewport.render.connect((pViewport: IViewport, pTechnique: IRenderTechnique,
			iPass: uint, pRenderable: IRenderableObject, pSceneObject: ISceneObject) => {

			var pDeferredTexture: ITexture = (<render.DSViewport>pViewport).getColorTextures()[0];
			var pDepthTexture: ITexture = (<render.DSViewport>pViewport).getDepthTexture();
			var pPass: IRenderPass = pTechnique.getPass(iPass);

            var v3fLightDir: IVec3 = math.Vec3.temp(akra.pSky['_v3fSunDir']);
            var pLightInDeviceSpace: IVec3 = math.Vec3.temp();
            pCamera.projectPoint(math.Vec3.temp(pCamera.getWorldPosition()).add(v3fLightDir), pLightInDeviceSpace);
            pSunshaftData.SUNSHAFT_ANGLE = pCamera.getWorldMatrix().toQuat4().multiplyVec3(math.Vec3.temp(0., 0., -1.)).dot(v3fLightDir);

			pLightInDeviceSpace.x = (pLightInDeviceSpace.x + 1) / 2;
            pLightInDeviceSpace.y = (pLightInDeviceSpace.y + 1) / 2;

            pLensflareData.LENSFLARE_LIGHT_POSITION = pLightInDeviceSpace;
            pLensflareData.LENSFLARE_LIGHT_ANGLE = pSunshaftData.SUNSHAFT_ANGLE;

            pPass.setUniform('SUNSHAFT_ANGLE', pSunshaftData.SUNSHAFT_ANGLE);
            pPass.setTexture('DEPTH_TEXTURE', pDepthTexture);
            pPass.setUniform('SUNSHAFT_SAMPLES', pSunshaftData.SUNSHAFT_SAMPLES);
            pPass.setUniform('SUNSHAFT_DEPTH', 1.);
            pPass.setUniform('SUNSHAFT_COLOR', pSunshaftData.SUNSHAFT_COLOR);
            pPass.setUniform('SUNSHAFT_INTENSITY', pSunshaftData.SUNSHAFT_INTENSITY);
            pPass.setUniform('SUNSHAFT_DECAY', pSunshaftData.SUNSHAFT_DECAY);
            pPass.setUniform('SUNSHAFT_SHARPNESS', pSunshaftData.SUNSHAFT_SHARPNESS);
            pPass.setUniform('SUNSHAFT_POSITION', pLightInDeviceSpace.clone("xy"));

            pPass.setTexture('DEFERRED_TEXTURE', pDeferredTexture);
            pPass.setTexture('LENSFLARE_COOKIES_TEXTURE', pLensflareData.LENSFLARE_COOKIES_TEXTURE);
            pPass.setUniform('LENSFLARE_COOKIE_PARAMS', pLensflareData.LENSFLARE_COOKIE_PARAMS);
            pPass.setForeign('LENSFLARE_COOKIES_TOTAL', pLensflareData.LENSFLARE_COOKIE_PARAMS.length);
            pPass.setUniform('LENSFLARE_LIGHT_POSITION', pLensflareData.LENSFLARE_LIGHT_POSITION);
            pPass.setUniform('LENSFLARE_LIGHT_ANGLE', pLensflareData.LENSFLARE_LIGHT_ANGLE);
            pPass.setUniform('LENSFLARE_INTENSITY', pLensflareData.LENSFLARE_INTENSITY);
            pPass.setUniform('LENSFLARE_DECAY', pLensflareData.LENSFLARE_DECAY);
            pPass.setUniform('LENSFLARE_SKYDOME_ID', pEngine.getComposer()._calcRenderID(pSky.skyDome, pSky.skyDome.getRenderable()));
            pPass.setUniform('LENSFLARE_ABERRATION_SCALE', pLensflareData.LENSFLARE_ABERRATION_SCALE);
            pPass.setUniform('LENSFLARE_ABERRATION_SAMPLES', pLensflareData.LENSFLARE_ABERRATION_SAMPLES);
            pPass.setUniform('LENSFLARE_ABERRATION_FACTOR', pLensflareData.LENSFLARE_ABERRATION_FACTOR);

            pPass.setUniform('BLUR_SAMPLES', pBlurData.BLUR_SAMPLES);
            pPass.setUniform('BLUR_RADIUS', pBlurData.BLUR_RADIUS / pViewport.getActualHeight());

            //if (iCounter++%240 === 0) {
                //console.log('sunshaft isVisible: ', pSunshaftData.SUNSHAFT_ANGLE, pCamera.getWorldMatrix().toQuat4().multiplyVec3(math.Vec3.temp(0., 0., -1.)).toString());
            //}

			pPass.setUniform("INPUT_TEXTURE_RATIO",
                math.Vec2.temp(pViewport.getActualWidth() / pDepthTexture.getWidth(), pDepthTexture.getWidth() / pDepthTexture.getHeight()));
            pPass.setUniform("SCREEN_ASPECT_RATIO",
                math.Vec2.temp(pViewport.getActualWidth()/pViewport.getActualHeight(), 1.));
		});
		return pViewport;
	}
	var pLight: ISunLight;
	function createLighting(): void {
		var pOmniLight: IOmniLight = <IOmniLight>pScene.createLightPoint(ELightTypes.OMNI, true, 512, "test-omni-0");

		pOmniLight.attachToParent(pScene.getRootNode());
		pOmniLight.setEnabled(true);
		pOmniLight.getParams().ambient.set(0.27, 0.23, 0.2);
		pOmniLight.getParams().diffuse.set(1.);
		pOmniLight.getParams().specular.set(1, 1, 1, 1);
		pOmniLight.getParams().attenuation.set(1, 0, 0);
		pOmniLight.setShadowCaster(false);

		pOmniLight.addPosition(1, 5, 3);

		//loadModel(data + "models/cube.DAE", null, 'camera').setPosition(1, 5, 3).scale(0.1);

	    //pLight = pOmniLight;
	}

	function createSky(): void {
		pSky = new model.Sky(pEngine, 32, 32, 1000.0);
		pSky.setTime(15.);

		pSky.sun.setShadowCaster(false);

		var pSceneModel: ISceneModel = pSky.skyDome;
        pSceneModel.attachToParent(pScene.getRootNode());

        //pLight = pSky.sun;
	}

	function createSkyBox(): void {
		var pSkyBoxTexture: ITexture = pRmgr.createTexture(".sky-box-texture");
		pSkyBoxTexture.loadResource("SKYBOX");

		if (pViewport.getType() === EViewportTypes.DSVIEWPORT) {
			(<render.DSViewport>pViewport).setSkybox(pSkyBoxTexture);
		}
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
		setup(pCanvas);

		pCamera = createCamera();
		pViewport = createViewport();

		var pStatsDiv = createStatsDIV();

		pCanvas.postUpdate.connect((pCanvas: ICanvas3d) => {
			pStatsDiv.innerHTML = pCanvas.getAverageFPS().toFixed(2) + " fps";
		});

		//addons.navigation(pViewport);

		createKeymap(pCamera);

		// createSceneEnvironment();
		//createLighting();
		//createSkyBox();
		createSky();

		//pTerrain = createTerrain(pScene, true, EEntityTypes.TERRAIN);
		//loadHero();
		loadManyModels(400, data + "models/cube.dae");
		//loadManyModels(100, data + "models/box/opened_box.dae");
		var pSceneQuad: ISceneModel = addons.createQuad(pScene, 100.);
		pSceneQuad.attachToParent(pScene.getRootNode());

		loadModel(data + "models/WoodSoldier/WoodSoldier.dae", null, 'WoodSoldier-01');
		loadModel(data + "models/rock/rock-1-low-p.DAE", null, 'Rock-01').addPosition(-2, 1, -4).addRotationByXYZAxis(0, math.PI, 0);
        loadModel(data + "models/rock/rock-1-low-p.DAE", null, 'Rock-02').addPosition(2, 1, -4);
        loadModel(data + "models/rock/rock-1-low-p.DAE", null, 'Rock-03').addPosition(2, 5, -4);
        loadModel(data + "models/rock/rock-1-low-p.DAE", null, 'Rock-04', pCamera).scale(0.2).setPosition(0.4, -0.2, -2);
		// loadModel(data + "models/hero/hero.DAE", null, 'Hero').addPosition(2, 0, -4); 

		pEngine.exec();
		//pEngine.renderFrame();

        //animateTimeOfDay();
        //animateBlurRadius();
	}

	pEngine.depsLoaded.connect(main);
}