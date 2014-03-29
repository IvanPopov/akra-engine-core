/// <reference path="../../build/akra.d.ts" />
/// <reference path="../../build/addons/base3dObjects.addon.d.ts" />
/// <reference path="../../build/addons/navigation.addon.d.ts" />

module akra {
	var pDeps = {
		root: "../../../src2/data/",
		files: [
			{ path: "textures/terrain/main_height_map_1025.dds", name: "TERRAIN_HEIGHT_MAP" },
			{ path: "textures/terrain/main_terrain_normal_map.dds", name: "TERRAIN_NORMAL_MAP" },
			{ path: "textures/skyboxes/desert-3.dds", name: "SKYBOX" },
			{ path: "textures/terrain/diffuse.dds", name: "MEGATEXTURE_MIN_LEVEL" }
		]
	};

	class SimpleSceneObject extends akra.scene.SceneObject {
		protected _pRenderable: IRenderableObject = null;

		constructor(pScene: IScene3d, eType: EEntityTypes = EEntityTypes.SCENE_OBJECT) {
			super(pScene, eType);

			this._pLocalBounds.set(-1, 1, -1, 1, -1, 1);

			var pRenderable: IRenderableObject = new render.RenderableObject();
			var pCollection: IRenderDataCollection = pEngine.createRenderDataCollection(0);
			var pData: IRenderData = pCollection.getEmptyRenderData(EPrimitiveTypes.TRIANGLELIST);

			pData.allocateAttribute(akra.data.VertexDeclaration.normalize([akra.data.VertexElement.float3(akra.data.Usages.POSITION)]),
				new Float32Array([
					// Front face
					-1.0, -1.0, 1.0,
					1.0, -1.0, 1.0,
					1.0, 1.0, 1.0,
					-1.0, 1.0, 1.0,

					// Back face
					-1.0, -1.0, -1.0,
					-1.0, 1.0, -1.0,
					1.0, 1.0, -1.0,
					1.0, -1.0, -1.0,

					// Top face
					-1.0, 1.0, -1.0,
					-1.0, 1.0, 1.0,
					1.0, 1.0, 1.0,
					1.0, 1.0, -1.0,

					// Bottom face
					-1.0, -1.0, -1.0,
					1.0, -1.0, -1.0,
					1.0, -1.0, 1.0,
					-1.0, -1.0, 1.0,

					// Right face
					1.0, -1.0, -1.0,
					1.0, 1.0, -1.0,
					1.0, 1.0, 1.0,
					1.0, -1.0, 1.0,

					// Left face
					-1.0, -1.0, -1.0,
					-1.0, -1.0, 1.0,
					-1.0, 1.0, 1.0,
					-1.0, 1.0, -1.0,
				]));

			pData.allocateAttribute(akra.data.VertexDeclaration.normalize([akra.data.VertexElement.float3(akra.data.Usages.NORMAL)]),
				new Float32Array([
					// Front face
					0.0, 0.0, 1.0,
					0.0, 0.0, 1.0,
					0.0, 0.0, 1.0,
					0.0, 0.0, 1.0,

					// Back face
					0.0, 0.0, -1.0,
					0.0, 0.0, -1.0,
					0.0, 0.0, -1.0,
					0.0, 0.0, -1.0,

					// Top face
					0.0, 1.0, 0.0,
					0.0, 1.0, 0.0,
					0.0, 1.0, 0.0,
					0.0, 1.0, 0.0,

					// Bottom face
					0.0, -1.0, 0.0,
					0.0, -1.0, 0.0,
					0.0, -1.0, 0.0,
					0.0, -1.0, 0.0,

					// Right face
					1.0, 0.0, 0.0,
					1.0, 0.0, 0.0,
					1.0, 0.0, 0.0,
					1.0, 0.0, 0.0,

					// Left face
					-1.0, 0.0, 0.0,
					-1.0, 0.0, 0.0,
					-1.0, 0.0, 0.0,
					-1.0, 0.0, 0.0,
				]));

			var pMap: IBufferMap = pData["_pMap"];
			var pIndexBuffer: IIndexBuffer = pRmgr.createIndexBuffer("simple-cube-indecies");
			pIndexBuffer.create(36, EHardwareBufferFlags.BACKUP_COPY | EHardwareBufferFlags.STATIC);

			pMap.setIndex(pIndexBuffer.allocateData(EPrimitiveTypes.TRIANGLELIST, EDataTypes.UNSIGNED_SHORT, new Uint16Array([
				0, 1, 2, 0, 2, 3,    // Front face
				4, 5, 6, 4, 6, 7,    // Back face
				8, 9, 10, 8, 10, 11,  // Top face
				12, 13, 14, 12, 14, 15, // Bottom face
				16, 17, 18, 16, 18, 19, // Right face
				20, 21, 22, 20, 22, 23  // Left face
			])));

			pRenderable._setRenderData(pData);
			pRenderable._setup(pEngine.getRenderer());

			pRenderable.getEffect().addComponent("akra.system.mesh_geometry");
			pRenderable.getEffect().addComponent("akra.system.mesh_texture");

			pRenderable.getMaterial().emissive = new color.Color(0., 0., 0., 1.);
			pRenderable.getMaterial().ambient = new color.Color(1., 1., 1., 1.);
			pRenderable.getMaterial().diffuse = new color.Color(1., 0., 0., 1.);
			pRenderable.getMaterial().specular = new color.Color(1., 0., 0., 1.);
			pRenderable.getMaterial().shininess = 20;

			this._pRenderable = pRenderable;
		}

		getTotalRenderable(): uint {
			return 1;
		}

		getRenderable(i?: uint): IRenderableObject {
			return this._pRenderable;
		}
	}

	function createSimpleCube(sName: string = null): ISceneObject {
		var pCube = new SimpleSceneObject(pScene);

		pCube.create();

		pCube.setName(sName);
		pCube.attached.connect(pScene.nodeAttachment);
		pCube.detached.connect(pScene.nodeDetachment);

		pCube.attachToParent(pScene.getRootNode());

		return pCube;
	}

	export var pEngine = akra.createEngine({ deps: pDeps });
	export var pScene = pEngine.getScene();
	export var pCanvas: ICanvas3d = pEngine.getRenderer().getDefaultCanvas();
	export var pCamera: ICamera = null;
	export var pViewport: IViewport = null;
	export var pRmgr: IResourcePoolManager = pEngine.getResourceManager();
	export var pSky: model.Sky = null;
	export var pTerrain: ITerrain = null;

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

		pCamera.addPosition(new math.Vec3(0, 4, 5));
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
			if (pKeymap.isMousePress() && pKeymap.isMouseMoved()) {
				var v2fMouseShift: IOffset = pKeymap.getMouseShift();

				var fdX = v2fMouseShift.x / pViewport.getActualWidth() * 5.0;
				var fdY = v2fMouseShift.y / pViewport.getActualHeight() * 5.0;

				pCamera.addRelRotationByEulerAngles(-fdX, -fdY, 0);
				pKeymap.update();
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
		var pViewport: IDSViewport = new render.DSViewport(pCamera);
		pCanvas.addViewport(pViewport);
		pCanvas.resize(window.innerWidth, window.innerHeight);

		window.onresize = function (event) {
			pCanvas.resize(window.innerWidth, window.innerHeight);
		}

		//(<render.DSViewport>pViewport).setFXAA(false);
		return pViewport;
	}

	function createLPPViewport(): IViewport {
		var pViewport: ILPPViewport = new render.LPPViewport(pCamera);
		pCanvas.addViewport(pViewport);
		pCanvas.resize(window.innerWidth, window.innerHeight);

		window.onresize = function (event) {
			pCanvas.resize(window.innerWidth, window.innerHeight);
		}

		var pTextureViewport1: render.TextureViewport = <any>pCanvas.addViewport(new render.TextureViewport(pViewport["_pLightMapTexture"], 0.02, 0.01, .15, .15, 20));
		var pTextureViewport2: render.TextureViewport = <any>pCanvas.addViewport(new render.TextureViewport(pViewport["_pNormalBufferTexture"], 0.02, 0.17, .15, .15, 21));

		return pViewport;
	}

	export var pDepthRange: IVec2 = new math.Vec2(0.5, 1.);
	var zIndex = 40.;
	function createTextureViewportForDepthTexture(pTexture: ITexture, fLeft: float, fTop: float): void {
		var pTextureViewport: render.TextureViewport = <any>pCanvas.addViewport(new render.TextureViewport(pTexture, fLeft, fTop, .15, .15, zIndex++));
		pTextureViewport.getEffect().addComponent("akra.system.display_depth");
		pTextureViewport.render.connect((pViewport: IViewport, pTechnique: IRenderTechnique, iPass: uint) => {
			pTechnique.getPass(iPass).setUniform("depthRange", pDepthRange);
		});
	}

	function createLighting(): void {
		var pOmniLight: IOmniLight = <IOmniLight>pScene.createLightPoint(ELightTypes.OMNI, true, 512, "test-omni-0");

		pOmniLight.attachToParent(pScene.getRootNode());
		pOmniLight.setEnabled(true);
		pOmniLight.getParams().ambient.set(0.1, 0.1, 0.1, 1);
		pOmniLight.getParams().diffuse.set(0.5);
		pOmniLight.getParams().specular.set(1, 1, 1, 1);
		pOmniLight.getParams().attenuation.set(1, 0, 0);
		pOmniLight.setShadowCaster(false);

		pOmniLight.addPosition(1, 5, 3);

		//for (var i = 0; i < pOmniLight.getDepthTextureCube().length; i++) {
		//	createTextureViewportForDepthTexture(pOmniLight.getDepthTextureCube()[i], 0.02, 0.01 + 0.16 * (i));
		//}

		//var pProjectShadowLight: IProjectLight = <IProjectLight>pScene.createLightPoint(ELightTypes.PROJECT, true, 512, "test-project-0");

		//pProjectShadowLight.attachToParent(pScene.getRootNode());
		//pProjectShadowLight.setEnabled(true);
		//pProjectShadowLight.getParams().ambient.set(0.1, 0.1, 0.1, 1);
		//pProjectShadowLight.getParams().diffuse.set(0.5);
		//pProjectShadowLight.getParams().specular.set(1, 1, 1, 1);
		//pProjectShadowLight.getParams().attenuation.set(1, 0, 0);
		//pProjectShadowLight.setShadowCaster(true);

		//pProjectShadowLight.addRelRotationByXYZAxis(0, -0.5, 0);
		//pProjectShadowLight.addRelPosition(0, 3, 10);

		//createTextureViewportForDepthTexture(pProjectShadowLight.getDepthTexture(), 0.18, 0.01);
	}

	function createSky(): void {
		pSky = new model.Sky(pEngine, 32, 32, 1000.0);
		pSky.setTime(15.);

		pSky.sun.setShadowCaster(false);

		var pSceneModel: ISceneModel = pSky.skyDome;
		pSceneModel.attachToParent(pScene.getRootNode());
	}

	function createSkyBox(): void {
		var pSkyBoxTexture: ITexture = pRmgr.createTexture(".sky-box-texture");
		pSkyBoxTexture.loadResource("SKYBOX");

		if (pViewport.getType() === EViewportTypes.DSVIEWPORT) {
			(<render.DSViewport>pViewport).setSkybox(pSkyBoxTexture);
		}
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
		pViewport = createLPPViewport();

		var pStatsDiv = createStatsDIV();

		pCanvas.postUpdate.connect((pCanvas: ICanvas3d) => {
			pStatsDiv.innerHTML = pCanvas.getAverageFPS().toFixed(2) + " fps";
		});

		//addons.navigation(pViewport);

		createKeymap(pCamera);

		createSceneEnvironment();
		createLighting();
		//createSkyBox();
		//createSimpleCube();
		//createSky();

		//pTerrain = createTerrain(pScene, true, EEntityTypes.TERRAIN);
		//loadHero();
		loadManyModels(20, data + "models/cube.dae");
		//loadManyModels(100, data + "models/box/opened_box.dae");
		//var pSoldier = loadModel(data + "models/WoodSoldier/WoodSoldier.DAE", () => {
		//	(<ISceneModel>pSoldier.getChild().getChild().getChild()).getMesh().showBoundingBox();
		//	(<ISceneModel>pSoldier.getChild().getChild().getChild().getSibling()).getMesh().showBoundingBox();
		//});
		//pSoldier.addPosition(0., 1.1, 0.);		

		pEngine.exec();
		//pEngine.renderFrame();
	}

	pEngine.depsLoaded.connect(main);
}