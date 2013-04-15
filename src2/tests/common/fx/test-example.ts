#include "util/testutils.ts"
#include "core/Engine.ts"
#include "common.ts"
#include "IEffect.ts"
#include "util/SimpleGeometryObjects.ts"

module akra {
	export var pEngine: IEngine = createEngine();
	var pRmgr: IResourcePoolManager = pEngine.getResourceManager();
	var pScene: IScene3d = pEngine.getScene();
	var pUI: IUI = pEngine.getSceneManager().createUI();
	var pCanvas: ICanvas3d = pEngine.getRenderer().getDefaultCanvas();
	var pMainScene: JQuery = null;
	export var pCamera: ICamera = null;
	var pViewport: IViewport = null;
	var pSkyBoxTexture: ITexture = null;

	test("Example creation test", () => {
		function setup(): void {
			var pCanvasElement: HTMLCanvasElement = (<any>pCanvas)._pCanvas;
			pMainScene = $("<div id='main-scene'/>");
			$(document.body).append(pMainScene);
			pMainScene.append(pCanvasElement);

			pCanvas.resize(800, 600);
		}

		function createSceneEnvironment(): void {
			var pSceneQuad: ISceneModel = util.createQuad(pScene, 100.);
			pSceneQuad.attachToParent(pScene.getRootNode());

			var pSceneSurface: ISceneModel = util.createSceneSurface(pScene, 40);
			pSceneSurface.addPosition(0, 0.01, 0);
			pSceneSurface.scale(5.);
			pSceneSurface.attachToParent(pScene.getRootNode());

			//pSceneQuad.addPosition(0., 0., )
			// pSceneQuad.addRelRotationByXYZAxis(0, Math.PI/2, 0);
		}

		function createCameras(): void {
			pCamera = pScene.createCamera();

			pCamera.addPosition(vec3(0, 4, 5));
			pCamera.addRelRotationByXYZAxis(-0.2, 0., 0.);
			pCamera.attachToParent(pScene.getRootNode());

			var pKeymap: IKeyMap = controls.createKeymap((<any>pCanvas)._pCanvas);

			pScene.bind(SIGNAL(beforeUpdate), () => {
				 if (pKeymap.isMousePress() && pKeymap.isMouseMoved()) {
				 	var v2fMouseShift: IOffset = pKeymap.getMouseShift();

			        var fdX = v2fMouseShift.x / pViewport.actualWidth * 10.0;
			        var fdY = v2fMouseShift.y / pViewport.actualHeight * 10.0;

			        pCamera.setRotationByXYZAxis(-fdY, -fdX, 0);
			    }
			});
		}

		function createViewports(): void {
			pViewport = pCanvas.addViewport(pCamera, EViewportTypes.DSVIEWPORT);
			
			var pStats: IUIRenderTargetStats = <IUIRenderTargetStats>pUI.createComponent("RenderTargetStats");
			pStats.target = pViewport.getTarget();
			pStats.render(pMainScene);

			pStats.el.css({position: "relative", top: "-600"});
		}

		function createLighting(): void {
			var pOmniLight: ILightPoint = pScene.createLightPoint(ELightTypes.OMNI, false, 0, "test-omni-0");
			
			pOmniLight.attachToParent(pScene.getRootNode());
			pOmniLight.enabled = true;
			pOmniLight.params.ambient.set(0.1, 0.1, 0.1, 1);
			pOmniLight.params.diffuse.set(0.5);
			pOmniLight.params.specular.set(1, 1, 1, 1);
			pOmniLight.params.attenuation.set(0.5,0,0);

			pOmniLight.addPosition(1, 5, 3);
			/*var pProjectShadowLight: ILightPoint = pScene.createLightPoint(ELightTypes.PROJECT, true, 512, "test-project-0");
			
			pProjectShadowLight.attachToParent(pScene.getRootNode());
			pProjectShadowLight.enabled = true;
			pProjectShadowLight.params.ambient.set(0.1, 0.1, 0.1, 1);
			pProjectShadowLight.params.diffuse.set(0.5);
			pProjectShadowLight.params.specular.set(1, 1, 1, 1);
			pProjectShadowLight.params.attenuation.set(1,0,0);
			pProjectShadowLight.isShadowCaster = true;

			pProjectShadowLight.addRelRotationByXYZAxis(0, -0.5, 0);
			pProjectShadowLight.addRelPosition(0, 3, 10);

			var pOmniShadowLight: ILightPoint = pScene.createLightPoint(ELightTypes.OMNI, true, 512, "test-omni-1");
			
			pOmniShadowLight.attachToParent(pScene.getRootNode());
			pOmniShadowLight.enabled = true;
			pOmniShadowLight.params.ambient.set(0.1, 0.1, 0.1, 1);
			pOmniShadowLight.params.diffuse.set(1);
			pOmniShadowLight.params.specular.set(1, 1, 1, 1);
			pOmniShadowLight.params.attenuation.set(1,0.0,0);
			pOmniShadowLight.isShadowCaster = true;

			pOmniShadowLight.addPosition(5, 10, -10);*/
		}

		function createSkyBox(): void {
			pSkyBoxTexture = pRmgr.createTexture(".sky-box-texture");
			//pSkyBoxTexture.loadResource("../../../data/textures/skyboxes/sky_box1-1.dds");
			pSkyBoxTexture.loadResource("../../../data/textures/skyboxes/desert-2.dds");
			pSkyBoxTexture.bind(SIGNAL(loaded), (pTexture: ITexture) => {
				(<render.DSViewport>pViewport).setSkybox(pTexture);
			});
		}

		function loadModels(sPath, fnCallback?: Function): ISceneNode {
			var pController: IAnimationController = null;
			var pModelRoot: ISceneNode = pScene.createNode();
			var pModel: ICollada = <ICollada>pRmgr.loadModel(sPath);
			
			pController = animation.createController();

			pModelRoot.attachToParent(pScene.getRootNode());
			pModelRoot.scale(2.);
			pModelRoot.addPosition(0, -1., 0);

			pModel.bind(SIGNAL(loaded), (pModel: ICollada) => {
				pModel.attachToScene(pModelRoot, pController);

				pController.attach(pModelRoot);

				var pContainer: IAnimationContainer = animation.createContainer();

				if (pController.active) {
					pContainer.setAnimation(pController.active);
					pContainer.useLoop(true);
					pController.addAnimation(pContainer);		
				}


				pScene.bind(SIGNAL(beforeUpdate), () => {
					pModelRoot.addRelRotationByXYZAxis(0.00, 0.001, 0);
					pController.update(pEngine.time);
				});

				if (isFunction(fnCallback)) {
					fnCallback(pModelRoot);
				}
			});

			return pModelRoot;
		}

		function main(pEngine: IEngine): void {
			setup();
			createSceneEnvironment();
			createCameras();
			createViewports();
			createLighting();
			createSkyBox();
			
			// loadModels("../../../data/models/kr360.dae");
			loadModels("../../../data/models/hero/walk.DAE", (pModelRoot: ISceneNode) => {
				var pMesh: IMesh = (<ISceneModel>pModelRoot.findEntity("node-Bip001_Pelvis[mesh-container]")).mesh;
				pMesh.createBoundingBox();
				pMesh.showBoundingBox();
			}).addPosition(0, 1.1, 0);

			// loadModels("../../../data/models/WoodSoldier/WoodSoldier.DAE").addPosition(-3., 1.1, 0.);
			// var pCube: ISceneNode = loadModels("../../../data/models/cube.dae");
			// pCube.setPosition(20., 8., -30.);
			// pCube.scale(0.1);
		}

		pEngine.bind(SIGNAL(depsLoaded), main);	
		pEngine.exec();
	});
}