/// <reference path="../../../built/Lib/akra.d.ts" />
/// <reference path="../../../built/Lib/base3dObjects.addon.d.ts" />

/// <reference path="../../../built/Lib/navigation.addon.d.ts" />
/// <reference path="../../../built/Lib/progress.addon.d.ts" />

/// <reference path="../std/std.ts" />

/// <reference path="../idl/3d-party/dat.gui.d.ts" />

declare var AE_RESOURCES: akra.IDep;

module akra {
	var pProgress = new addons.Progress(document.getElementById("progress"));

	var pRenderOpts: IRendererOptions = {
		premultipliedAlpha: false,
		//for screenshoting
		preserveDrawingBuffer: true,
		//for black background & and avoiding composing with other html
	};

	var pOptions: IEngineOptions = {
		renderer: pRenderOpts,
		progress: pProgress.getListener(),
		deps: { files: [AE_RESOURCES], root: "./", deps: addons.getNavigationDependences() }
	};

	export var pEngine: IEngine = createEngine(pOptions);

	export var pCanvas: ICanvas3d = pEngine.getRenderer().getDefaultCanvas();
	export var pCamera: ICamera = null;
	export var pViewport: IDSViewport = null;
	export var pRmgr: IResourcePoolManager = pEngine.getResourceManager();
	export var pScene: IScene3d = pEngine.getScene();

	function animateLight(pLight: IOmniLight, pSprite: ISprite): void {
		var i = 1000;
		var bUp = false;
		var vAttenuation = new Vec3(pLight.getParams().attenuation);

		setInterval(() => {
			if ((i == 10 && !bUp) || (i == 2000 && bUp)) {
				bUp = !bUp;
			}

			if (bUp) {
				i++;
			}
			else {
				i--;
			}

			pLight.getParams().attenuation.set(vAttenuation.x * (i / 1000), vAttenuation.y * (i / 1000), vAttenuation.z * (i / 1000));

		}, math.random() * 20);
	}

	function main(pEngine: IEngine): void {
		std.setup(pCanvas);

		pCamera = pScene.createCamera();
		pCamera.attachToParent(pScene.getRootNode());
		pCamera.setPosition(4., 4., 3.5);
		pCamera.lookAt(Vec3.temp(0., 1., 0.));

		pViewport = new render.DSViewport(pCamera);


		pCanvas.addViewport(pViewport);
		//pCanvas.addViewport(new render.LPPViewport(pCamera, 0, 0, 0.5, 1., 1));
		pCanvas.resize(window.innerWidth, window.innerHeight);

		pViewport.enableSupportFor3DEvent(E3DEventTypes.CLICK | E3DEventTypes.MOUSEOVER | E3DEventTypes.MOUSEOUT);
		pViewport.setClearEveryFrame(true);
		pViewport.setBackgroundColor(color.BLACK);
		pViewport.setFXAA(false);

		window.onresize = () => {
			pCanvas.resize(window.innerWidth, window.innerHeight);
		};

		addons.navigation(pViewport);

		var pGUI = new dat.GUI();

		//std.createSceneEnvironment(pScene, true, false, 50);


		for (var i = 0; i < 10; ++i) {
			var pLightOmni: IOmniLight = <IOmniLight>pScene.createLightPoint(ELightTypes.OMNI, i == 0, 512);
			pLightOmni.attachToParent(pScene.getRootNode());
			pLightOmni.setPosition(math.random() * -10 + 5., math.random() * 5, math.random() * -10 + 5);
			var pSprite = pScene.createSprite();
			pSprite.scale(.25);
			pSprite.setTexture(<ITexture>pRmgr.getTexturePool().loadResource("LIGHT_ICON"));
			pSprite.setBillboard(true);
			pSprite.setShadow(false);




			pSprite.attachToParent(pLightOmni);
			pLightOmni.lookAt(Vec3.temp(0., 0., 0.));
			pLightOmni.setInheritance(ENodeInheritance.ALL);
			// pLightOmni.params.ambient.set(math.random(), math.random(), math.random(), 1);
			pLightOmni.getParams().diffuse.set(math.random(), math.random(), math.random());
			pLightOmni.getParams().specular.set(math.random(), math.random(), math.random());
			pLightOmni.getParams().attenuation.set(math.random(), math.random(), math.random());

			((pSprite: ISprite, pLightOmni: IOmniLight) => {
				pSprite.mouseover.connect(() => { pViewport.highlight(pSprite); });
				pSprite.mouseout.connect(() => { pViewport.highlight(null); });
				pSprite.click.connect(() => {
					pLightOmni.setEnabled(!pLightOmni.isEnabled());
					(<IColor>pSprite.getRenderable().getMaterial().emissive).set(pLightOmni.isEnabled() ? 0 : 1);
					//debug.log(pLightOmni, pLightOmni.getName(), pLightOmni.isEnabled());
				});
			})(pSprite, pLightOmni);

			animateLight(pLightOmni, pSprite);
		}


		var pGrid = pRmgr.createTexture("GRID");
		pGrid.loadImage(pRmgr.getImagePool().findResource("GRID_JPG"));
		pGrid.setWrapMode(ETextureParameters.WRAP_S, ETextureWrapModes.REPEAT);
		pGrid.setWrapMode(ETextureParameters.WRAP_T, ETextureWrapModes.REPEAT);
		pGrid.setFilter(ETextureParameters.MAG_FILTER, ETextureFilters.LINEAR);
		pGrid.setFilter(ETextureParameters.MIN_FILTER, ETextureFilters.LINEAR);

		var pQuad: ISceneModel = addons.createQuad(pScene, 50, Vec2.temp(20.));
		pQuad.attachToParent(pScene.getRootNode());
		pQuad.getMesh().getSubset(0).getSurfaceMaterial().setTexture(ESurfaceMaterialTextures.DIFFUSE, pGrid);
		pQuad.getMesh().getSubset(0).getMaterial().diffuse = new color.Color(0., 0., 0., 1.);

		pQuad = addons.createQuad(pScene, 10, Vec2.temp(4.));
		pQuad.setRotationByXYZAxis(math.PI / 2, 0, 0);
		pQuad.attachToParent(pScene.getRootNode());
		pQuad.setPosition(0, 10., -10.);
		pQuad.getMesh().getSubset(0).getSurfaceMaterial().setTexture(0, pGrid);
		pQuad.getMesh().getSubset(0).getMaterial().diffuse = new color.Color(0., 0., 0., 1.);


		pQuad = addons.createQuad(pScene, 10, Vec2.temp(4.));
		pQuad.setRotationByXYZAxis(math.PI / 2, math.PI / 2, 0);
		pQuad.attachToParent(pScene.getRootNode());
		pQuad.setPosition(-10, 10., 0.);
		pQuad.getMesh().getSubset(0).getSurfaceMaterial().setTexture(0, pGrid);
		pQuad.getMesh().getSubset(0).getMaterial().diffuse = new color.Color(0., 0., 0., 1.);

		//if (config.DEBUG) {
		//	pCanvas.addViewport(new render.TextureViewport(pGrid, 0.1, 0.1, 0.2, 0.2, 5));
		//}

		pEngine.exec();

		var pController: IAnimationController = pEngine.createAnimationController();
		var pMiner: ICollada = <ICollada>pRmgr.getColladaPool().findResource("MINER");



		function anim2controller(pController: IAnimationController, sAnim: string): IAnimationContainer {
			var pAnimModel: ICollada = <ICollada>pRmgr.getColladaPool().findResource(sAnim);
			if (isNull(pAnimModel)) {
				console.log("SKIP ANIMATION " + sAnim);
				return;
			}
			var pIdleAnim: IAnimation = pAnimModel.extractAnimation(0);
			var pCont: IAnimationContainer = animation.createContainer(pIdleAnim, sAnim);
			pCont.useLoop(true);
			pController.addAnimation(pCont);

			return pCont;
		}

		var pAnimWork1: IAnimationContainer = null;

		anim2controller(pController, "ANIM_MINER_IDLE0");
		anim2controller(pController, "ANIM_MINER_IDLE1");
		anim2controller(pController, "ANIM_MINER_IDLE2");
		anim2controller(pController, "ANIM_MINER_WALK1");
		anim2controller(pController, "ANIM_MINER_WALK2");
		anim2controller(pController, "ANIM_MINER_WALK3");
		pAnimWork1 = anim2controller(pController, "ANIM_MINER_WORK_GUN");
		pAnimWork1 = anim2controller(pController, "ANIM_MINER_WORK_HAMMER");

		pGUI.add({ animation: null }, 'animation', [
			'ANIM_MINER_IDLE0',
			'ANIM_MINER_IDLE1',
			'ANIM_MINER_IDLE2',
			'ANIM_MINER_WALK1',
			'ANIM_MINER_WALK2',
			'ANIM_MINER_WALK3',
			'ANIM_MINER_WORK_GUN',
			'ANIM_MINER_WORK_HAMMER'
		]).onChange((sName: string) => {
			pController.play.emit(sName);
		});



		pMiner.getOptions().wireframe = true;
		var pModel: ISceneNode = pMiner.attachToScene(pScene);
		pModel.addController(pController);
		pModel.scale(.5);

		pController.play.emit(0);

		var pBB: IRect3d;
		var pLibeCube = addons.lineCube(pScene);
		var pMinerBody: model.MeshSubset = null;

		pModel.explore((pEntity: IEntity): boolean => {
			if (scene.SceneModel.isModel(pEntity)) {
				var pNode = <ISceneModel>pEntity;
				if (pNode.getMesh().getName() !== "geom-Object007") {
					return;
				}

				window["meshSubset"] = pMinerBody = <model.MeshSubset>pNode.getMesh().getSubset(0);

				pBB = pNode.getMesh().getSubset(0).getSkin().getBonesBoundingBox();

				pGUI.add(pBB, "x0").listen().__precision = 4;
				pGUI.add(pBB, "x1").listen().__precision = 4;
				pGUI.add(pBB, "y0").listen().__precision = 4;
				pGUI.add(pBB, "y1").listen().__precision = 4;
				pGUI.add(pBB, "z0").listen().__precision = 4;
				pGUI.add(pBB, "z1").listen().__precision = 4;

				window["bb"] = pBB;

				//////////////////////////
				var pSubset = <model.MeshSubset>pNode.getMesh().getSubset(0);
				var pBoxes = pSubset.calculateBoneLocalBoundingBoxes();

				for (var i = 0; i < pBoxes.length; ++i) {
					if (!pBoxes[i]) {
						continue;
					}

					var pBox = pBoxes[i];
					var pBone = pSubset.getSkin().getAffectedNode(i);

					var pCube = addons.lineCube(pScene);
					pCube.attachToParent(pBone);
					pCube.setInheritance(ENodeInheritance.ALL);
					pCube.setLocalScale(pBox.size(Vec3.temp())).scale(.5);
					pCube.setPosition(pBox.midPoint(Vec3.temp()));
					(<IColor>pCube.getMesh().getSubset(0).getMaterial().emissive).set(color.random(true));
				}
			}

			return true;
		});

		pLibeCube.attachToParent(pScene.getRootNode());


		pScene.beforeUpdate.connect(() => {
			if (!pLibeCube.isVisible()) return;
			var pBB = pMinerBody._getSkinBasedWorldBounds();
			pLibeCube.setLocalScale(pBB.size(Vec3.temp())).scale(.5);
			pLibeCube.setPosition(pBB.midPoint(Vec3.temp()));
		});

		pLibeCube.setVisible(false);

		pGUI.add({ "bone-local-aabb": false }, "bone-local-aabb").onChange((bValue: boolean) => {
			pLibeCube.setVisible(bValue);
		});


		pGUI.add({ wireframe: true }, 'wireframe').onChange((bValue: boolean) => {
			pModel.explore((pEntity: IEntity): boolean => {
				if (scene.SceneModel.isModel(pEntity)) {
					var pNode = <ISceneModel>pEntity;
					for (var i: int = 0; i < pNode.getTotalRenderable(); ++i) {
						pNode.getRenderable(i).wireframe(bValue);
					}
				}

				return true;
			});
		});

		pProgress.destroy();
	}

	pEngine.ready(main);
}


