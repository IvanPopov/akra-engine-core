#include "def.ts"
#include "util/navigation.ts"

module akra {

	#include "setup.ts"
	#include "createProgress.ts"
	#include "createCameras.ts"
	#include "createSceneEnvironment.ts"
	#include "createViewports.ts"
	#include "createModelEntry.ts"

	var pProgress: IProgress = createProgress();

	var pRenderOpts: IRendererOptions = {
		premultipliedAlpha: false,
		//for screenshoting
		preserveDrawingBuffer: true,
		//for black background & and avoiding composing with other html
	};

	
	var pControllerData: IDocument = null;
	var pLoader = {
		changed: (pManager: IDepsManager, pFile: IDep, pInfo: any): void => {
			var sText: string = "";

			switch (pFile.status) {
				case EDependenceStatuses.LOADING: 
					sText += "Loading "; 
					break;
				case EDependenceStatuses.UNPACKING: 
					sText += "Unpacking "; 
					break;
			}

			switch (pFile.status) {
				case EDependenceStatuses.LOADING: 
				case EDependenceStatuses.UNPACKING: 
					sText += ("resource " + path.info(path.uri(pFile.path).path).basename);
				
					if (!isNull(pInfo)) {
						sText += " (" + (pInfo.loaded / pInfo.total * 100).toFixed(2) + "%)";
					}

					pProgress.drawText(sText);
					break;
				case EDependenceStatuses.LOADED:
					pProgress.total[pFile.deps.depth] = pFile.deps.total;
					pProgress.element = pFile.deps.loaded;
					pProgress.depth = pFile.deps.depth;
					pProgress.draw();
					break;
			}
		},
		loaded: (pManager: IDepsManager): void => {
			pProgress.cancel();
			document.body.removeChild(pProgress.canvas);
		}
	};

	var pOptions: IEngineOptions = {
		renderer: pRenderOpts,
		loader: pLoader,
		deps: {
			files: [
				//{path: "models/arteries.DAE", name: "arteries"}
				//{path: "", name: "TEST_IMAGE"}
			]
		}
	};

	var pEngine: IEngine = createEngine(pOptions);
	
	
	var pUI: IUI 						= pEngine.getSceneManager().createUI();
	var pCanvas: ICanvas3d 				= pEngine.getRenderer().getDefaultCanvas();
	var pCamera: ICamera 				= null;
	var pViewport: IViewport 			= null;
	var pIDE: ui.IDE 					= null;
	var pRmgr: IResourcePoolManager 	= pEngine.getResourceManager();
	var pScene: IScene3d 				= pEngine.getScene();


	function main(pEngine: IEngine): void {
		setup(pCanvas, pUI);

		pCamera = createCameras(pScene);
		pCamera.lookAt(vec3(0.));
		pViewport = createViewports(new render.DSViewport(pCamera), pCanvas, pUI);

		util.navigation(pViewport);

		createSceneEnvironment(pScene, true);
		pEngine.exec();

		var pLight: IProjectLight = <IProjectLight>pScene.createLightPoint(ELightTypes.PROJECT);
		pLight.attachToParent(pCamera);
		pLight.setInheritance(ENodeInheritance.ALL);
		pLight.params.ambient.set(0.0, 0.0, 0.0, 1);
		pLight.params.diffuse.set(1.);
		pLight.params.specular.set(.1);
		pLight.params.attenuation.set(0.5, 0, 0);



		var pArteriesModel: IModel = pRmgr.loadModel(DATA + "/models/arteries.DAE", {shadows: false});
		pArteriesModel.bind("loaded", () => {
			var pArteries: IModelEntry = pArteriesModel.attachToScene(pScene);
			var pArteriesMesh: IMesh = (<ISceneModel>pArteries.child.child).mesh;
			pArteriesMesh.showBoundingBox();
			pArteriesMesh.getSubset(0).wireframe(true);
			(<IColor>pArteriesMesh.getSubset(0).material.diffuse).set(1., 0., 0., 0.);

			window["arteries_mesh"] = pArteriesMesh;
		});
		

		var pCubeModel: IModel = pRmgr.loadModel(DATA + "/models/ocube/cube.DAE", {shadows: false, wireframe: true});
		pCubeModel.bind("loaded", () => {
			var pCube: IModelEntry = pCubeModel.attachToScene(pScene);
		
			
		});

		
		/*var pTex: ITexture = <ITexture>pRmgr.texturePool.loadResource(DATA + "/textures/10004.jpg");
		var pSprite: ISprite = pScene.createSprite();
		pTex.bind("loaded", () => {
			pSprite.setTexture(pTex);
			pCanvas.addViewport(new render.TextureViewport(pTex, 0.05, 0.05, .5 * 512/pViewport.actualWidth, .5 * 512/pViewport.actualHeight, 4.));
			// pTex.setFilter(ETextureParameters.MIN_FILTER, ETextureFilters.LINEAR);
			// pTex.setFilter(ETextureParameters.MAG_FILTER, ETextureFilters.LINEAR);

			window["billboard"] = pSprite;
		});
		
		pSprite.attachToParent(pScene.getRootNode());*/

	}

	pEngine.bind("depsLoaded", main);	
}