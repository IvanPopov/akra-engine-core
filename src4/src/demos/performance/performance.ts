/// <reference path="../../../built/Lib/akra.d.ts" />
/// <reference path="../../../built/Lib/progress.addon.d.ts" />
/// <reference path="../../../built/Lib/base3dobjects.addon.d.ts" />

/// <reference path="../std/std.ts" />

declare var AE_RESOURCES: akra.IDep;

module akra {
	var pProgress = new addons.Progress(document.getElementById("progress"));

	export var pEngine = createEngine({
		deps: { files: [AE_RESOURCES], root: "./" },
		progress: pProgress.getListener(),
		renderer: {
			alpha: false
		}
	});
	var pScene = pEngine.getScene();
	var pCanvas: ICanvas3d = pEngine.getRenderer().getDefaultCanvas();
	var pCamera: ICamera = null;
	var pViewport: IViewport = null;
	var pRmgr: IResourcePoolManager = pEngine.getResourceManager();

	function loadModel(sPath, fnCallback?: Function): ISceneNode {
		//var pModelRoot: ISceneNode = pScene.createNode();
		var pModel: ICollada = <ICollada>pEngine.getResourceManager().loadModel(sPath);

		//pModelRoot.attachToParent(pScene.getRootNode());

		//pModel.setOptions({wireframe: true});
		var pModelRoot: ISceneNode = pModel.extractModel(pModelRoot);
		pModelRoot.attachToParent(pScene.getRootNode());

		pScene.beforeUpdate.connect(() => {
			pModelRoot.addRelRotationByXYZAxis(0.00, 0.01, 0);
		});

		if (isFunction(fnCallback)) {
			fnCallback(pModelRoot);
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

		loadModel(sPath, (pCube: ISceneNode) => {
			for (var i: uint = 0; i < nCount; i++) {
				if (iCountInRow > iRow) {
					iCountInRow = 0;
					iRow++;

					fShiftX = -iRow * fDX / 2;
					fShiftZ = -iRow * fDZ;
				}

				pCube = i === 0 ? pCube : loadModel(sPath);
				pCube.setPosition(fShiftX, 0.8, fShiftZ - 2.);
				//pCube.scale(0.1);

				fShiftX += fDX;
				iCountInRow++;
			}
		});
	}

	//function loadModel2(sPath, fnCallback?: Function): ISceneNode {
	//	var pModelRoot: ISceneNode = pScene.createNode();
	//	var pModel: ICollada = <ICollada>pRmgr.loadModel(sPath);

	//	pModelRoot.attachToParent(pScene.getRootNode());

	//	function fnLoadModel(pModel: ICollada): void {
	//		pModel.attachToScene(pModelRoot);

	//		if (pModel.isAnimationLoaded()) {
	//			var pController: IAnimationController = pEngine.createAnimationController();
	//			var pContainer: IAnimationContainer = animation.createContainer();
	//			var pAnimation: IAnimation = pModel.extractAnimation(0);

	//			pController.attach(pModelRoot);

	//			pContainer.setAnimation(pAnimation);
	//			pContainer.useLoop(true);
	//			pController.addAnimation(pContainer);
	//		}

	//		if (isFunction(fnCallback)) {
	//			fnCallback(pModelRoot);
	//		}
	//	}

	//	if (pModel.isResourceLoaded()) {
	//		fnLoadModel(pModel);
	//	}
	//	else {
	//		pModel.loaded.connect(fnLoadModel);
	//	}

	//	return pModelRoot;
	//}

	function main(pEngine: IEngine) {
		std.setup(pCanvas);

		pCamera = std.createCamera(pScene);
		pCamera.setPosition(Vec3.temp(0., 7., 10.));
		pCamera.lookAt(Vec3.temp(0, 0.8, -15));

		pViewport = new render.DSViewport(pCamera);

		pCanvas.addViewport(pViewport);
		pCanvas.resize(window.innerWidth, window.innerHeight);

		window.onresize = () => {
			pCanvas.resize(window.innerWidth, window.innerHeight);
		};

		pViewport.setBackgroundColor(color.DARK_BLUE);
		pViewport.setClearEveryFrame(true);

		std.createKeymap(pViewport);


		//std.createSceneEnvironment(pScene, true, false, 100);
		//var pModel: ISceneModel;

		//loadModel2("WOODSOLDIER.DAE").addPosition(0., 1.1, 0.).explore((pNode: IEntity): boolean => {
		//	if (scene.SceneModel.isModel(pNode)) {
		//		pModel = <ISceneModel>pNode;

		//		var pSubset = <model.MeshSubset>pModel.getMesh().getSubset(0);

		//		for (var i = 0; i < pSubset.getTotalBones(); ++i) {
		//			if (!pSubset.getBoneLocalBound(i)) {
		//				continue;
		//			}

		//			var pBox = pSubset.getBoneLocalBound(i);
		//			var pBone = pSubset.getSkin().getAffectedNode(i);

		//			var pCube = addons.lineCube(pScene);
		//			pCube.attachToParent(pBone);
		//			pCube.setInheritance(ENodeInheritance.ALL);
		//			pCube.setLocalScale(pBox.size(Vec3.temp())).scale(.5);
		//			pCube.setPosition(pBox.midPoint(Vec3.temp()));
		//			(<IColor>pCube.getMesh().getSubset(0).getMaterial().emissive).set(color.random(true));
		//		}

		//		return false;
		//	}
		//});
		
		//var pLibeCube = addons.lineCube(pScene);
		//pLibeCube.attachToParent(pScene.getRootNode());
		//pScene.beforeUpdate.connect(() => {
		//	var pBB = geometry.Rect3d.temp(pModel.getWorldBounds());

		//	pLibeCube.setLocalScale(pBB.size(Vec3.temp())).scale(.5);
		//	pLibeCube.setPosition(pBB.midPoint(Vec3.temp()));
		//});


		var pLight: ILightPoint = std.createLighting(pScene, ELightTypes.OMNI, Vec3.temp(1, 5, 3));
		pLight.setShadowCaster(false);

		loadManyModels(400, "CUBE.DAE");
		pProgress.destroy();
		pEngine.exec();
	}

	pEngine.ready(main);
}