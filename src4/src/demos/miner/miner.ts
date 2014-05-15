/// <reference path="../../../built/Lib/akra.d.ts" />
/// <reference path="../../../built/Lib/base3dObjects.addon.d.ts" />

/// <reference path="../../../built/Lib/navigation.addon.d.ts" />
/// <reference path="../../../built/Lib/progress.addon.d.ts" />
/// <reference path="../../../built/Lib/compatibility.addon.d.ts" />

/// <reference path="../std/std.ts" />

/// <reference path="../idl/3d-party/dat.gui.d.ts" />

declare var AE_RESOURCES: akra.IDep;

module akra {
	addons.checkCompatibility();
	console.log(addons.buildCompatibilityLog());

	var pProgress = new addons.Progress(document.getElementById("progress"));

	var pRenderOpts: IRendererOptions = {
		alpha: true,
		depth: true,
		premultipliedAlpha: true,
		antialias : true,
		//premultipliedAlpha: false,
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
	export var pViewport: I3DViewport = null;
	export var pRmgr: IResourcePoolManager = pEngine.getResourceManager();
    export var pScene: IScene3d = pEngine.getScene();
    export var pLightProject: IProjectLight = null;

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
        pCamera.setPosition(-2.367366313934326, 9.469015121459961, 0.9847351908683777);
		pCamera.lookAt(Vec3.temp(0., 1., 0.));

		//pViewport = new render.DSViewport(pCamera, 0.5, 0., 0.5, 1., 0.);
		var pDSViewport = new render.DSViewport(pCamera, 0.5, 0, 0.5, 1., 1);
		pViewport = new render.ForwardViewport(pCamera, 0., 0., 0.5, 1., 0.);
		pCanvas.addViewport(pViewport);
		pCanvas.addViewport(pDSViewport);

		//pViewport.setSkybox(<ITexture>pRmgr.getTexturePool().loadResource("SKYBOX"));
		
		pCanvas.resize(window.innerWidth, window.innerHeight);

		pViewport.setFXAA(true);
		
		//pViewport.enableSupportFor3DEvent(E3DEventTypes.CLICK | E3DEventTypes.MOUSEOVER | E3DEventTypes.MOUSEOUT);
		pViewport.setClearEveryFrame(true);
		pViewport.setBackgroundColor(color.GRAY);
		//pViewport.setFXAA(false);

		pDSViewport.setClearEveryFrame(true);
		pDSViewport.setBackgroundColor(color.GRAY);
		pDSViewport.setFXAA(false);

		

		//var pNormalViewport = new render.TextureViewport(pViewport["_pNormalBufferTexture"], 0.01, 0.17, 0.15, 0.15, 2);
		//pCanvas.addViewport(pNormalViewport);
		//pNormalViewport.getEffect().addComponent("akra.system.display_lpp_normals");

		//pLPPViewport.enableSupportFor3DEvent(E3DEventTypes.CLICK | E3DEventTypes.MOUSEOVER | E3DEventTypes.MOUSEOUT);

		window.onresize = () => {
			pCanvas.resize(window.innerWidth, window.innerHeight);
		};

		addons.navigation(pViewport);

		var pGUI = new dat.GUI();

		//std.createSceneEnvironment(pScene, true, false, 50);


        pLightProject = <IProjectLight>pScene.createLightPoint(ELightTypes.SPLIT_PROJECT, true, 512);
        pLightProject.attachToParent(pScene.getRootNode());
        pLightProject.setPosition(4.17600679397583, 3.924830913543701, -0.5841776132583618);
		var pSprite = pScene.createSprite();
		pSprite.scale(.25);
		pSprite.setTexture(<ITexture>pRmgr.getTexturePool().loadResource("LIGHT_ICON"));
		pSprite.setBillboard(true);
		pSprite.setShadow(false);
        pSprite.attachToParent(pLightProject);

        pLightProject.lookAt(Vec3.temp(0., 0., 0.));
        pLightProject.setInheritance(ENodeInheritance.ALL);
		//pLightOmni.params.ambient.set(math.random(), math.random(), math.random(), 1);
        pLightProject.getParams().diffuse.set(1, 1, 1);
        pLightProject.getParams().specular.set(math.random());
        pLightProject.getParams().attenuation.set(0.3, 0, 0);

        ((pSprite: ISprite, pLightProject: IProjectLight) => {
			pSprite.mouseover.connect(() => { pViewport.highlight(pSprite); });
			pSprite.mouseout.connect(() => { pViewport.highlight(null); });
			//pSprite.mouseover.connect(() => { pViewport.highlight(pSprite); pLPPViewport.highlight(pSprite);});
			//pSprite.mouseout.connect(() => { pViewport.highlight(null); pLPPViewport.highlight(null);});
			pSprite.click.connect(() => {
                pLightProject.setEnabled(!pLightProject.isEnabled());
                (<IColor>pSprite.getRenderable().getMaterial().emissive).set(pLightProject.isEnabled() ? 0 : 1);
				//debug.log(pLightOmni, pLightOmni.getName(), pLightOmni.isEnabled());
			});
        })(pSprite, pLightProject);

        var pLightOmni: IProjectLight = <IProjectLight>pScene.createLightPoint(ELightTypes.OMNI, false, 512);
        pLightOmni.attachToParent(pScene.getRootNode());
        pLightOmni.setPosition(math.random() * -10 + 5., math.random() * 5, math.random() * -10 + 5);

        pLightOmni.lookAt(Vec3.temp(0., 0., 0.));
        pLightOmni.setInheritance(ENodeInheritance.ALL);
        //pLightOmni.params.ambient.set(math.random(), math.random(), math.random(), 1);
        pLightOmni.getParams().diffuse.set(0.3, 0.3, 0.3);
        pLightOmni.getParams().specular.set(math.random());
        pLightOmni.getParams().attenuation.set(1., 0, 0);

		//animateLight(pLightOmni, pSprite);
		//animateLight(pLightOmni, null);

        pCanvas.addViewport(new render.TextureViewport(pLightProject.getDepthTexture(), 0.01, 0.01, 0.3, 0.3, 2));


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
		var pModel: ISceneNode = pMiner.extractFullScene(pScene);
		pModel.addController(pController);
		pModel.scale(.5);

		pController.play.emit(0);

		var pBB: IRect3d;
		var pLibeCube = addons.lineCube(pScene);
		var pMinerBody: model.MeshSubset = null;
		var pMinerMesh: IMesh = null;
		var pMinerModel: ISceneModel = null;

		pModel.explore((pEntity: IEntity): boolean => {
			if (scene.SceneModel.isModel(pEntity)) {
				var pNode = <ISceneModel>pEntity;
				if (pNode.getMesh().getName() !== "geom-Object007") {
					return;
				}

				pMinerModel = window["minerNode"] = pNode;
				pMinerMesh = pNode.getMesh();
				pMinerBody = <model.MeshSubset>pMinerMesh.getSubset(0);

				//////////////////////////
				//var pSubset = <model.MeshSubset>pMinerMesh.getSubset(0);

				//for (var i = 0; i < pSubset.getTotalBones(); ++i) {
				//	if (!pSubset.getBoneLocalBound(i)) {
				//		continue;
				//	}

				//	var pBox = pSubset.getBoneLocalBound(i);
				//	var pBone = pSubset.getSkin().getAffectedNode(i);

				//	var pCube = addons.lineCube(pScene);
				//	pCube.attachToParent(pBone);
				//	pCube.setInheritance(ENodeInheritance.ALL);
				//	pCube.setLocalScale(pBox.size(Vec3.temp())).scale(.5);
				//	pCube.setPosition(pBox.midPoint(Vec3.temp()));
				//	(<IColor>pCube.getMesh().getSubset(0).getMaterial().emissive).set(color.random(true));
				//}
			}

			return true;
		});

		pLibeCube.attachToParent(pScene.getRootNode());


		pScene.beforeUpdate.connect(() => {
			if (!pLibeCube.isVisible()) return;
			var pBB = geometry.Rect3d.temp(pMinerModel.getWorldBounds());

			//pBB.transform((<INode>pMinerModel.getMesh().getSubset(0).getSkin().getSkeleton().getRoot().getParent()).getWorldMatrix());

			pLibeCube.setLocalScale(pBB.size(Vec3.temp())).scale(.5);
			pLibeCube.setPosition(pBB.midPoint(Vec3.temp()));
		});

		pLibeCube.setVisible(false);

		pGUI.add({ "world bounds": true }, "world bounds").onChange((bValue: boolean) => {
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


		pGUI.add({ usePhong: true }, 'usePhong').onChange(function (bValue: boolean) {
			pViewport.setShadingModel(bValue ? EShadingModel.PHONG : EShadingModel.BLINNPHONG);
		});

		pGUI.add({ usePBS: true }, 'usePBS').onChange(function (bValue: boolean) {
			pViewport.setShadingModel(bValue ? EShadingModel.PBS_SIMPLE : EShadingModel.BLINNPHONG);
		});

		var pCubeCollada: ICollada = <ICollada>pRmgr.getColladaPool().findResource("CUBE.DAE");
		var pCubeModel = pCubeCollada.extractModel();

		pCubeModel.attachToParent(pScene.getRootNode());
		pCubeModel.setPosition(0., 2., -2.).scale(50.);
		pCubeModel.getRenderable().getMaterial().diffuse.a = 0.0;
		pCubeModel.getRenderable().getMaterial().diffuse.r = 0.0;
		pCubeModel.getRenderable().getMaterial().emissive.a = 0.0;
		pCubeModel.getRenderable().getMaterial().specular.a = 0.2;
		pCubeModel.getRenderable().getMaterial().ambient.a = 0.;
		pCubeModel.getRenderable().getMaterial().isTransparent = true;
		//var pGlass: ITexture = pRmgr.createTexture("GLASS");
		//pGlass.loadImage(<IImg>pRmgr.getImagePool().findResource("GLASS"));
		//pCubeModel.getRenderable().getSurfaceMaterial().setTexture(ESurfaceMaterialTextures.DIFFUSE, pGlass);
		pProgress.destroy();
	}

	pEngine.ready(main);
}


