#include "def.ts"
#include "util/navigation.ts"

#include "dat.gui.d.ts"

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
				{path: "grammars/HLSL.gr"}
			],
			deps: {
				files: [
					{path: "effects/custom/arteries.afx"},
					{path: "textures/arteries/arteries.ara"}
				]
			}
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

		pCamera = pScene.createCamera();
		pCamera.attachToParent(pScene.getRootNode());
		pCamera.setPosition(4., 4., 3.5);
		pCamera.lookAt(vec3(0., 1., 0.));

		window["camera"] = pCamera;

		



		pViewport = createViewports(new render.DSViewport(pCamera), pCanvas, pUI);

		util.navigation(pViewport);

		createSceneEnvironment(pScene, true, false, 2);
		pEngine.exec();

		var pLight: IProjectLight = <IProjectLight>pScene.createLightPoint(ELightTypes.PROJECT);
		pLight.attachToParent(pCamera);
		pLight.setInheritance(ENodeInheritance.ALL);
		pLight.params.ambient.set(0.0, 0.0, 0.0, 1);
		pLight.params.diffuse.set(1.);
		pLight.params.specular.set(.1);
		pLight.params.attenuation.set(0.5, 0, 0);


		var pCube: ISceneModel = util.lineCube(pScene);
		pCube.attachToParent(pScene.getRootNode());
		pCube.setPosition(0., 1., 0.);

		var pGUI = new dat.GUI();


	    
	    // pGUI.add(pViewer, 'threshold', 0, 1.);
	    // pGUI.add(pViewer, 'colored');
	    // pGUI.add(pViewer, 'waveStripStep', 1, 25).step(1);
	    // pGUI.add(pViewer, 'waveStripWidth', 1, 10).step(1);
	    // pGUI.addColor(pViewer, 'waveColor');
	    // pGUI.addColor(pViewer, 'waveStripColor');

	    var pSlices: ITexture[] = [];
	    for (var i = 2, t = 0; i <= 92; ++ i) {
	    	var n: string = "ar.";

	    	if (i < 10) {
	    		n += "0";
	    	}

	    	n += String(i);
	    	
	    	var pTex: ITexture = <ITexture>pRmgr.texturePool.loadResource(n);
	    	
	    	pTex.setFilter(ETextureParameters.MIN_FILTER, ETextureFilters.LINEAR);
			pTex.setFilter(ETextureParameters.MAG_FILTER, ETextureFilters.LINEAR);
	    	
	    	pSlices.push(pTex);
	    	// console.log(n, t++);
	    }

		var pArteriesModel: IModel = pRmgr.loadModel(DATA + "/models/artery_system.DAE", {shadows: false});

		pArteriesModel.bind("loaded", () => {
			var pArteries: IModelEntry = pArteriesModel.attachToScene(pScene);
			pArteries.setRotationByXYZAxis(0., math.PI, 0.);
			var pArteriesMesh: IMesh = (<ISceneModel>pArteries.findEntity("node-_Artery_system")).mesh;
			// pArteriesMesh.showBoundingBox();
			// pArteriesMesh.getSubset(0).wireframe(true);



			(<IColor> pArteriesMesh.getSubset(0).material.emissive).set(0., 0., 0., 0.);
			(<IColor>pArteriesMesh.getSubset(0).material.ambient).set(0., 0., 0., 0.);
			(<IColor>pArteriesMesh.getSubset(0).material.diffuse).set(0.5, 0., 0., 0.);
			pArteries.scale(2.25);
			pArteries.addPosition(0.,1., -0.3);

			pArteriesMesh.getSubset(0).getRenderMethodDefault().effect.addComponent("akra.custom.highlight_mri_slice");

			pArteriesMesh.getSubset(0).bind("beforeRender", (pRenderable, pViewportCurrent, pMethod) => {
				// console.log(pSprite.worldMatrix.multiplyVec4(vec4(0., 0., -1., 1.)).xyz);
				pMethod.setUniform("SPLICE_NORMAL", vec3(0., -1., 0.));
				pMethod.setUniform("SPLICE_D", pSprite.worldPosition.y);
			});

			window["arteries_mesh"] = pArteriesMesh;
			window["arteries"] = pArteries;

			var gui = pGUI.addFolder('arteries');
			var controller = gui.add({wireframe: false}, 'wireframe');

			controller.onChange(function(value) {
				pArteriesMesh.getSubset(0).wireframe(value);
			});

		});
		

		
		var pSprite: ISprite = pScene.createSprite();
		var fSlice: float = 0.;
		var fKL: float = 0.;
		var iA: int = 0.;
		var iB: int = 1;
		var fSliceK: float = 0.;
		var fOpacity: float = 0.05;

		
		pSprite.attachToParent(pScene.getRootNode());
		pSprite.setRotationByXYZAxis(math.PI / 2., 0., 0.);
		pSprite.setPosition(0., 1., 0.);
		pSprite.setTexture(pSlices[0]);
		
		window["billboard"] = pSprite;

		var gui = pGUI.addFolder('slice');
		var slice = (<dat.NumberControllerSlider>gui.add({slice: 0.}, 'slice')).min(0.).max(1.).step(.005);
		var opacity = (<dat.NumberControllerSlider>gui.add({opacity: fOpacity}, 'opacity')).min(0.0).max(1.).step(.01);

		opacity.onChange(function(fValue: float) {
			fOpacity = fValue;
		});

		slice.onChange(function(fValue: float) {
			// console.log(fValue, fValue * 0.55 + 1.);
			
			pSprite.setPosition(0., fValue * 0.55 + 1., 0.);
			
			fSlice = fValue;
			fKL = fSlice * (pSlices.length - 1.);
			iA = math.floor(fKL);
			iB = iA + 1;
			fSliceK = (fKL - iA) / (iB - iA);

			// console.log("A:", iA, "B:", iB, "k:", fSliceK);
		});

		pSprite.getRenderable().getRenderMethodDefault().effect.addComponent("akra.custom.arteries_slice");
		pSprite.getRenderable().bind("beforeRender", (pRenderable, pViewport, pMethod) => {
			pMethod.setTexture("SLICE_A", pSlices[iA]);
			pMethod.setTexture("SLICE_B", pSlices[iB] || null);
			pMethod.setUniform("SLICE_K", fSliceK);
			pMethod.setUniform("SLICE_OPACITY", fOpacity);
		});
		

		var pProjCam: ICamera = pScene.createCamera();
		var fDelta: float = 0.01;
		pProjCam.setOrthoParams(2., 2., -fDelta, fDelta);
		pProjCam.attachToParent(pSprite);
		pProjCam.setInheritance(ENodeInheritance.ALL);
		pProjCam.setPosition(0., 0., 0.);
		pProjCam.setRotationByXYZAxis(math.PI, 0., 0.);
		window["projCam"] = pProjCam;

		
		var pTexTarget: ITexture = pRmgr.createTexture("slice");
		var iRes: int = 2048;
		pTexTarget.create(iRes, iRes, 1, null, ETextureFlags.RENDERTARGET, 0, 0, ETextureTypes.TEXTURE_2D, EPixelFormats.R8G8B8);
		pTexTarget.getBuffer().getRenderTarget()
			.addViewport(new render.DSViewport(pProjCam));

		pCanvas.addViewport(new render.TextureViewport(pTexTarget, 0.05, 0.05, .5 * 512/pViewport.actualWidth, .5 * 512/pViewport.actualHeight, 5.));

		
	}

	pEngine.bind("depsLoaded", main);	
}