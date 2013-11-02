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
				{path: "models/miner/miner.DAE", name: "MINER"},
				{path: "models/miner/idle0.DAE", name: "ANIM_MINER_IDLE0"},
				{path: "models/miner/idle1.DAE", name: "ANIM_MINER_IDLE1"},
				{path: "models/miner/idle2.DAE", name: "ANIM_MINER_IDLE2"},
				{path: "models/miner/walk1.DAE", name: "ANIM_MINER_WALK1"},
				{path: "models/miner/walk2.DAE", name: "ANIM_MINER_WALK2"},
				{path: "models/miner/walk3.DAE", name: "ANIM_MINER_WALK3"},
				{path: "models/miner/work_gun.DAE", name: "ANIM_MINER_WORK_GUN"},
				{path: "models/miner/work_hammer.DAE", name: "ANIM_MINER_WORK_HAMMER"},

				{path: "textures/light_icon.png", name: "LIGHT_ICON"},

				{path: "models/cube.DAE", name: "CUBE"},

				{path: "effects/custom/heatmap.afx"}
			],
		}
	};

	export var pEngine: IEngine = createEngine(pOptions);
	
	
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

		pViewport = createViewports(new render.DSViewport(pCamera), pCanvas, pUI);

		var pGUI = new dat.GUI();

		// (<IDSViewport>pViewport).bind("render", (
		// 	pViewport: IDSViewport,
		// 	pTechnique: IRenderTechnique, 
		// 	iPass: uint, 
		// 	pRenderable: IRenderableObject, 
		// 	pSceneObject: ISceneObject): void => {

		// 	if (iPass == 2) {
		// 		var pPass: IRenderPass = pTechnique.getPass(iPass);

		// 		pPass.setTexture("DEFERRED_TEXTURE0", pViewport["_pDeferredColorTextures"][0]);
		// 		pPass.setTexture("DEFERRED_TEXTURE1", pViewport["_pDeferredColorTextures"][1]);
		// 	}

		// });

		pGUI.add({heatmap: false}, "heatmap").onChange((use: bool) => {
			if (use) {
				(<IDSViewport>pViewport).effect.addComponent("akra.custom.heatmap", 3, 0);
			}
			else {
				(<IDSViewport>pViewport).effect.delComponent("akra.custom.heatmap", 3, 0);	
			}
		});


		util.navigation(pViewport);

		createSceneEnvironment(pScene, false, true, 10);
		pEngine.exec();

		// var pLight: IProjectLight = <IProjectLight>pScene.createLightPoint(ELightTypes.PROJECT, true, 1024);
		// pLight.attachToParent(pScene.getRootNode());
		// pLight.setPosition(0., 5., 5.);
		// pLight.lookAt(vec3(0., 0., 0.))
		// pLight.setInheritance(ENodeInheritance.ALL);
		// pLight.params.ambient.set(0.0, 0.0, 0.0, 1);
		// pLight.params.diffuse.set(1.);
		// pLight.params.specular.set(1.);
		// pLight.params.attenuation.set(0.5, 0, 0);

		function animateLight(pLight: IOmniLight, pSprite: ISprite): void {
			var i = 1000;
			var bUp = false;
			var vAttenuation = new Vec3(pLight.params.attenuation);

			setInterval(() => {
				if ((i == 10 && !bUp) || (i == 2000 && bUp)) {
					bUp = !bUp;
				}

				if (bUp) {
					i ++;
				}
				else {
					i --;
				}

				pLight.params.attenuation.set(vAttenuation.x * (i / 1000), vAttenuation.y * (i / 1000), vAttenuation.z * (i / 1000));
				
			}, math.random() * 20);
		}


		for (var i = 0; i < 16; ++ i) {
			var pLightOmni: IOmniLight = <IOmniLight>pScene.createLightPoint(ELightTypes.OMNI, false);
			pLightOmni.attachToParent(pScene.getRootNode());
			pLightOmni.setPosition(math.random() * -10 + 5., math.random() * 5, math.random()  * -10 + 5);
			var pSprite = pScene.createSprite();
			pSprite.scale(.25);
			pSprite.setTexture(<ITexture>pRmgr.texturePool.loadResource("LIGHT_ICON"));
			pSprite.billboard = true;
			pSprite.shadow = false;


			// pSprite.attachToParent(pLightOmni);
			pLightOmni.lookAt(vec3(0., 0., 0.))
			pLightOmni.setInheritance(ENodeInheritance.ALL);
			// pLightOmni.params.ambient.set(math.random(), math.random(), math.random(), 1);
			pLightOmni.params.diffuse.set(math.random(), math.random(), math.random());
			pLightOmni.params.specular.set(math.random(), math.random(), math.random());
			pLightOmni.params.attenuation.set(math.random(), math.random(), math.random());

			
			
			
			animateLight(pLightOmni, pSprite);
		}

		
		var pQuad: ISceneNode = util.createQuad(pScene, 10);
		pQuad.setRotationByXYZAxis(math.PI/2, 0, 0);
		pQuad.attachToParent(pScene.getRootNode());
		pQuad.setPosition(0, 10., -10.);

		var pQuad: ISceneNode = util.createQuad(pScene, 10);
		pQuad.setRotationByXYZAxis(math.PI/2, math.PI/2, 0);
		pQuad.attachToParent(pScene.getRootNode());
		pQuad.setPosition(-10, 10., 0.);


		var pController: IAnimationController = pEngine.createAnimationController();
		var pMiner: ICollada = <ICollada>pRmgr.colladaPool.findResource("MINER");

		

		function anim2controller(pController: IAnimationController, sAnim: string): IAnimationContainer {
			var pAnimModel: ICollada = <ICollada>pRmgr.colladaPool.findResource(sAnim);
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

		
		// if (pAnimWork1) {
		// 	var fHammerDropTime: float = (21/115) * pAnimWork1.duration;
		// 	var fHammerTakeTime: float = (95/115) * pAnimWork1.duration;
		        
	 //        pAnimWork1.bind("enterFrame", 
	 //        	(pAnim: IAnimationContainer, fRealTime: float, fTime: float): void => {

	 //            if (fTime < fHammerDropTime) {
	            	
	 //            }
	 //            else {
	            	
	 //            }
	 //        });

  //       }

		
		pGUI.add({animation: null}, 'animation', [ 
			'ANIM_MINER_IDLE0', 
			'ANIM_MINER_IDLE1', 
			'ANIM_MINER_IDLE2', 
			'ANIM_MINER_WALK1',
			'ANIM_MINER_WALK2',
			'ANIM_MINER_WALK3',
			'ANIM_MINER_WORK_GUN',
			'ANIM_MINER_WORK_HAMMER'
		]).onChange(function(sName: string) {
			pController.play(sName);
		});



	    // pGUI.add(pViewer, 'threshold', 0, 1.);
	    // pGUI.add(pViewer, 'colored');
	    // pGUI.add(pViewer, 'waveStripStep', 1, 25).step(1);
	    // pGUI.add(pViewer, 'waveStripWidth', 1, 10).step(1);
	    // pGUI.addColor(pViewer, 'waveColor');
	    // pGUI.addColor(pViewer, 'waveStripColor');
    	pMiner.options.wireframe = true;
		var pModel: ISceneNode = pMiner.attachToScene(pScene);
		pModel.addController(pController);
		pModel.scale(.5);

		pController.play(0);
		
	}

	pEngine.bind("depsLoaded", main);	
}