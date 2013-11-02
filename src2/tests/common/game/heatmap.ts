#include "def.ts"
#include "util/navigation.ts"

#include "dat.gui.d.ts"

module akra {

	#include "setup.ts"
	#include "createProgress.ts"
	#include "createViewports.ts"


	var pProgress: IProgress = createProgress();

	var pRenderOpts: IRendererOptions = {
		premultipliedAlpha: false,
		//for screenshoting
		preserveDrawingBuffer: true,
		//for black background & and avoiding composing with other html
	};

	
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
				{path: "http://akra/akra-engine-core/src2/tests/common/game/DEBUG/bonner.jpg", name: "akra_logo"},
				{path: "http://akra/akra-engine-core/src2/tests/common/game/DEBUG/girl.jpg", name: "girl"},
				{path: "effects/custom/heatmap.afx"}
			],
		}
	};

	export var pEngine: IEngine = createEngine(pOptions);
	
	
	var pCanvas: ICanvas3d 				= pEngine.getRenderer().getDefaultCanvas();
	var pCamera: ICamera 				= null;
	var pViewport: IViewport 			= null;
	// var pIDE: ui.IDE 					= null;
	var pRmgr: IResourcePoolManager 	= pEngine.getResourceManager();
	var pScene: IScene3d 				= pEngine.getScene();


	function main(pEngine: IEngine): void {
		setup(pCanvas);

		var pGirlImage: IImg = pRmgr.loadImage("girl");
		var pLogoImage: IImg = pRmgr.loadImage("akra_logo");
		var pLogo: ITexture = pRmgr.createTexture("akra_logo_texture");
		var pGirl: ITexture = pRmgr.createTexture("girl_texture");
		
		pLogo.loadImage(pLogoImage);
		pGirl.loadImage(pGirlImage);
		pViewport = pCanvas.addViewport(new render.TextureViewport(pLogo));
		
		pCanvas.resize(pLogo.width, pLogo.height);

		var pGUI = new dat.GUI();
		var pHSV = {hue: 1.0, saturation: 1.0, value: 1.0, enabled: true};

		(<IDSViewport>pViewport).bind("render", (
			pViewport: IDSViewport,
			pTechnique: IRenderTechnique, 
			iPass: uint, 
			pRenderable: IRenderableObject, 
			pSceneObject: ISceneObject): void => {

			if (iPass == 1) {
				var pPass: IRenderPass = pTechnique.getPass(iPass);

				pPass.setTexture("BACKGROUND_MAP", pGirl);
				pPass.setUniform("HUE_MULTIPLIER", pHSV.hue);
				pPass.setUniform("SATURATION_MULTIPLIER", pHSV.saturation);
				pPass.setUniform("VALUE_MULTIPLIER", pHSV.value);
				pPass.setUniform("HEATMAP_ENABLED", pHSV.enabled);
			}
		});
		// (<any>pViewport).effect.addComponent("akra.custom.heatmap", 0, 1);
		pGUI.add({heatmap: false}, "heatmap").onChange((use: bool) => {
			if (use) {
				(<any>pViewport).effect.addComponent("akra.custom.heatmap", 1, 0);
			}
			else {
				(<any>pViewport).effect.delComponent("akra.custom.heatmap", 1, 0);	
			}
		});

		(<dat.NumberControllerSlider>pGUI.add(pHSV, "hue")).min(0.).max(10.).step(0.01);
		(<dat.NumberControllerSlider>pGUI.add(pHSV, "saturation")).min(0.).max(10.).step(0.01);
		(<dat.NumberControllerSlider>pGUI.add(pHSV, "value")).min(0.).max(10.).step(0.01);
		pGUI.add(pHSV, "enabled");



		pEngine.exec();
	}

	pEngine.bind("depsLoaded", main);	
}