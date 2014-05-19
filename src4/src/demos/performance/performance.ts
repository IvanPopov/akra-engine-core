/// <reference path="../../../built/Lib/akra.d.ts" />
/// <reference path="../../../built/Lib/progress.addon.d.ts" />
/// <reference path="../../../built/Lib/base3dobjects.addon.d.ts" />
/// <reference path="../../../built/Lib/compatibility.addon.d.ts" />

/// <reference path="../std/std.ts" />

module akra {
	addons.compatibility.verify("non-compatible");

	var pProgress = new addons.Progress(document.getElementById("progress"));

	export var pEngine = createEngine({
		progress: pProgress.getListener(),
		renderer: {
			alpha: false
		}
	});

	var pScene = pEngine.getScene();
	var pCanvas: ICanvas3d = pEngine.getRenderer().getDefaultCanvas();
	var pCamera: ICamera = null;
	var pViewport: ILPPViewport = null;
	var pRmgr: IResourcePoolManager = pEngine.getResourceManager();

	function loadManyCubes(nCount: uint): void {
		var iRow: uint = 0;
		var iCountInRow: uint = 0;

		var fDX: float = 2.;
		var fDZ: float = 2.;

		var fShiftX: float = 0.;
		var fShiftZ: float = 0.;

		var pCube: ISceneModel = addons.cube(pScene);
		for (var i: uint = 0; i < nCount; i++) {
			if (iCountInRow > iRow) {
				iCountInRow = 0;
				iRow++;

				fShiftX = -iRow * fDX / 2;
				fShiftZ = -iRow * fDZ;
			}

			pCube = i === 0 ? pCube : addons.cube(pScene);
			pCube.attachToParent(pScene.getRootNode());
			pCube.scale(.5);
			pCube.setPosition(fShiftX, 0.8, fShiftZ - 2.);

			(<IColor>pCube.getMesh().getSubset(0).getMaterial().diffuse).set(color.random(true));
			(<IColor>pCube.getMesh().getSubset(0).getMaterial().ambient).set(color.BLACK);
			
			//pCube.scale(0.1);
			((pCube) => {
				pScene.beforeUpdate.connect(() => {
					pCube.addRelRotationByXYZAxis(0.00, 0.01, 0);
				});
			})(pCube);

			fShiftX += fDX;
			iCountInRow++;
		}
	}

	function main(pEngine: IEngine) {
		std.setup(pCanvas);

		pCamera = std.createCamera(pScene);
		pCamera.setPosition(Vec3.temp(0., 7., 10.));
		pCamera.lookAt(Vec3.temp(0, 0.8, -15));

		pViewport = new render.LPPViewport(pCamera, 0., 0., 1., 1., 1);
		pViewport.setShadingModel(EShadingModel.BLINNPHONG);

		pCanvas.addViewport(pViewport);
		pCanvas.resize(window.innerWidth, window.innerHeight);

		window.onresize = () => {
			pCanvas.resize(window.innerWidth, window.innerHeight);
		};

		pViewport.setBackgroundColor(color.DARK_BLUE);
		pViewport.setClearEveryFrame(true);

		std.createKeymap(pViewport);

		var pLight: ILightPoint = std.createLighting(pScene, ELightTypes.OMNI, Vec3.temp(1, 5, 3));
		pLight.setShadowCaster(true);

		//loadManyModels(400, "CUBE.DAE");
		loadManyCubes(800);
		pProgress.destroy();
		pEngine.exec();
	}

	pEngine.ready(main);
}