/// <reference path="../../../built/Lib/akra.d.ts" />
/// <reference path="../../../built/Lib/base3dObjects.addon.d.ts" />
/// <reference path="../../../built/Lib/progress.addon.d.ts" />

/// <reference path="../std/std.ts" />

/// <reference path="../idl/3d-party/dat.gui.d.ts" />

declare var AE_RESOURCES: akra.IDep;

module akra {
	var pProgress = new addons.Progress(document.getElementById("progress"));

	var pRenderOpts: IRendererOptions = {
		alpha: true,
		depth: true,
		premultipliedAlpha: true,
		antialias: true,
		//for screenshoting
		preserveDrawingBuffer: true,
		//for black background & and avoiding composing with other html
	};

	var pOptions: IEngineOptions = {
		renderer: pRenderOpts,
		progress: pProgress.getListener(),
		deps: { files: [AE_RESOURCES], root: "./" }
	};

	export var pEngine = akra.createEngine(pOptions);

	export var pScene = pEngine.getScene();
	export var pCanvas: ICanvas3d = pEngine.getRenderer().getDefaultCanvas();
	export var pCamera: ICamera = null;
	export var pViewport: IViewport = null;
	export var pRmgr: IResourcePoolManager = pEngine.getResourceManager();
	export var pSky: model.Sky = null;
	export var pPBSData = null;
	export var pSkyboxTexture = null;
	export var pSkyboxTextures = null;
	export var pEnvTexture = null;
	export var pFresnelTexture: ITexture = null;

	export var animateTimeOfDay = () => {
		pSky.setTime(new Date().getTime() % 24000 / 500 - 24);
		requestAnimationFrame(animateTimeOfDay);
	}

	function createCamera(): ICamera {
		var pCamera: ICamera = pScene.createCamera();

		pCamera.addPosition(Vec3.temp(-2.9563467216312262, 3.900536759964575, -15.853719720993343));
		pCamera.setRotation(Quat4.temp(-0.0002096413471319314, 0.999332356829426, -0.005808150890586638, -0.03607023740685555));
		pCamera.attachToParent(pScene.getRootNode());

		pCamera.update();

		return pCamera;
	}

	function createKeymap(pCamera: ICamera): void {
		var pKeymap: IKeyMap = control.createKeymap();
		pKeymap.captureMouse((<any>pCanvas).getElement());
		pKeymap.captureKeyboard(document);

		pScene.beforeUpdate.connect(() => {
			if (pKeymap.isMousePress()) {
				if (pKeymap.isMouseMoved()) {
					var v2fMouseShift: IOffset = pKeymap.getMouseShift();

					pCamera.addRelRotationByXYZAxis(-(v2fMouseShift.y / pViewport.getActualHeight() * 10.0), 0., 0.);
					pCamera.addRotationByXYZAxis(0., -(v2fMouseShift.x / pViewport.getActualWidth() * 10.0), 0.);

					pKeymap.update();
				}

			}
			var fSpeed: float = 0.1 * 10;
			if (pKeymap.isKeyPress(EKeyCodes.W)) {
				pCamera.addRelPosition(0, 0, -fSpeed);
			}
			if (pKeymap.isKeyPress(EKeyCodes.S)) {
				pCamera.addRelPosition(0, 0, fSpeed);
			}
			if (pKeymap.isKeyPress(EKeyCodes.A) || pKeymap.isKeyPress(EKeyCodes.LEFT)) {
				pCamera.addRelPosition(-fSpeed, 0, 0);
			}
			if (pKeymap.isKeyPress(EKeyCodes.D) || pKeymap.isKeyPress(EKeyCodes.RIGHT)) {
				pCamera.addRelPosition(fSpeed, 0, 0);
			}
			if (pKeymap.isKeyPress(EKeyCodes.UP) || pKeymap.isKeyPress(EKeyCodes.Q)) {
				pCamera.addRelPosition(0, fSpeed, 0);
			}
			if (pKeymap.isKeyPress(EKeyCodes.DOWN) || pKeymap.isKeyPress(EKeyCodes.E)) {
				pCamera.addRelPosition(0, -fSpeed, 0);
			}
		});
	}

	var teapotSpecular = new Color(0.999, 0.71, 0.29, 1.0);
	var teapotDiffuse = new Color(0.999, 0.86, 0.57, 1.0);
	var totalLightSources = 10;

	function createViewport(): IViewport3D {
		var pViewport: ILPPViewport = new render.DSViewport(pCamera);
		pCanvas.addViewport(pViewport);
		pCanvas.resize(window.innerWidth, window.innerHeight);

		window.onresize = function (event) {
			pCanvas.resize(window.innerWidth, window.innerHeight);
		};

		var counter = 0;
		var pEffect = (<render.LPPViewport>pViewport).getEffect();

		var pSkyboxTexturesKeys = [
			'desert',
			'nature',
			'colosseum',
			'beach',
			'plains',
			'church',
			'basilica',
		];
		pSkyboxTextures = { };
		for(var i=0; i<pSkyboxTexturesKeys.length; i++) {
			console.log("Creating skybox: ",pSkyboxTexturesKeys[i],pSkyboxTexturesKeys[i].toUpperCase());
			pSkyboxTextures[pSkyboxTexturesKeys[i]] = pRmgr.createTexture(".sky-box-texture-"+pSkyboxTexturesKeys[i]);
			(<ITexture>(pSkyboxTextures[pSkyboxTexturesKeys[i]])).loadResource("SKYBOX_"+pSkyboxTexturesKeys[i].toUpperCase());
			console.log("Done!");
		};

		var pGUI = new dat.GUI();

		var pMaterialPresets = {
			Gold: {
				_F0: new Color(1., 0.71, 0.29),
				_Diffuse: new Color(1.00, 0.86, 0.57),
			},
			Copper: {
				_F0: new Color(0.95, 0.64, 0.54),
				_Diffuse: new Color(0.98, 0.82, 0.76),
			},
			Plastic: {
				_F0: new Color(0.03, 0.03, 0.03),
				_Diffuse: new Color(0.21, 0.21, 0.21),
			},
			Iron: {
				_F0: new Color(0.56, 0.57, 0.58),
				_Diffuse: new Color(0.77, 0.78, 0.78),
			},
			Aluminium: {
				_F0: new Color(0.91, 0.92, 0.92),
				_Diffuse: new Color(0.96, 0.96, 0.97),
			},
			Silver: {
				_F0: new Color(0.95, 0.93, 0.88),
				_Diffuse: new Color(0.98, 0.97, 0.95),
			},
			Water: {
				_F0: new Color(0.02, 0.02, 0.02),
				_Diffuse: new Color(0.15, 0.15, 0.15),
			},
			Glass: {
				_F0: new Color(0.08, 0.08, 0.08),
				_Diffuse: new Color(0.31, 0.31, 0.31),
			}
		};

		var pPbsSpecG = {
			Implicit: 0,
			Neumann: 1,
			Kelemen: 2,
			Schlick: 3, //default
			Smith: 4
		};

		var pPbsDiffuse = {
			Lambert: 0, //default
			Burley: 1,
			OrenNayar: 2
		};

		var pPbsSpecD = {
			Blinn: 0,
			Beckmann: 1,
			GGX: 2 //default
		};

		var pPbsSpecF = {
			None: 0,
			Schlick: 1, //default
			Fresnel: 2
		};

		pPBSData = {
			isUsePBS: true,
			useFresnelTexture: false,
			_Material: pMaterialPresets.Gold,
			pPbsSpecG: pPbsSpecG.Schlick,
		}

		var pPBSFolder = pGUI.addFolder("pbs");
		(<dat.OptionController>pPBSFolder.add(pPBSData, 'isUsePBS')).name("use PBS").onChange((bPBS:boolean)=>{
			if (bPBS){
				(<IShadedViewport>pViewport).setShadingModel(EShadingModel.PBS_SIMPLE);
			}
			else {
				(<IShadedViewport>pViewport).setShadingModel(EShadingModel.BLINNPHONG);
			}

			});
		var bFresnelTexture = false;
		(<dat.OptionController>pPBSFolder.add(pPBSData, 'useFresnelTexture')).name("use FresTex").onChange((bFresTex:boolean)=>{
			bFresnelTexture = bFresTex;
			});
		(<dat.OptionController>pPBSFolder.add({Material:"Gold"}, 'Material', Object.keys(pMaterialPresets))).name("Material").onChange((sKey) => {
			teapotSpecular.set(pMaterialPresets[sKey]._F0);
			teapotDiffuse.set(pMaterialPresets[sKey]._Diffuse);
		});
		(<dat.OptionController>pPBSFolder.add({Skybox:"desert"}, 'Skybox', pSkyboxTexturesKeys)).name("Skybox").onChange((sKey) => {
			if (pViewport.getType() === EViewportTypes.LPPVIEWPORT) {
				(<render.LPPViewport>pViewport).setSkybox(pSkyboxTextures[sKey]);
			}
			(<ITexture>pEnvTexture).unwrapCubeTexture(pSkyboxTextures[sKey]);
		});

		var iPbsSpecG = 3;
		(<dat.OptionController>pPBSFolder.add({PbsSpecG:"Schlick"}, 'PbsSpecG', Object.keys(pPbsSpecG))).name("PBS Spec G").onChange((sKey) => {
			iPbsSpecG = pPbsSpecG[sKey];
			console.log(iPbsSpecG);
		});

		var iPbsDiffuse = 0;
		(<dat.OptionController>pPBSFolder.add({PbsDiffuse:"Lambert"}, 'PbsDiffuse', Object.keys(pPbsDiffuse))).name("PBS Diffuse").onChange((sKey) => {
			iPbsDiffuse = pPbsDiffuse[sKey];
			console.log(iPbsDiffuse);
		});

		var iPbsSpecD = 2;
		(<dat.OptionController>pPBSFolder.add({PbsSpecD:"GGX"}, 'PbsSpecD', Object.keys(pPbsSpecD))).name("PBS Spec D").onChange((sKey) => {
			iPbsSpecD = pPbsSpecD[sKey];
			console.log(iPbsSpecD);
		});

		var iPbsSpecF = 1;
		(<dat.OptionController>pPBSFolder.add({PbsSpecF:"Schlick"}, 'PbsSpecF', Object.keys(pPbsSpecF))).name("PBS Spec F").onChange((sKey) => {
			iPbsSpecF = pPbsSpecF[sKey];
			console.log(iPbsSpecF);
		});

		(<IShadedViewport>pViewport).setShadingModel(EShadingModel.PBS_SIMPLE);

		pViewport.render.connect((pViewport: IViewport, pTechnique: IRenderTechnique,
			iPass: uint, pRenderable: IRenderableObject, pSceneObject: ISceneObject) => {

			var pDeferredTexture: ITexture = (<ILPPViewport>pViewport).getTextureWithObjectID();
			var pDepthTexture: ITexture = (<render.LPPViewport>pViewport).getDepthTexture();
			var pPass: IRenderPass = pTechnique.getPass(iPass);

			var v3fLightDir: IVec3 = math.Vec3.temp( math.Vec3.temp(pLight.getWorldPosition()).subtract(pCamera.getWorldPosition()).normalize() );
			var pLightInDeviceSpace: IVec3 = math.Vec3.temp();
			pCamera.projectPoint(math.Vec3.temp(pCamera.getWorldPosition()).add(v3fLightDir), pLightInDeviceSpace);

			pLightInDeviceSpace.x = (pLightInDeviceSpace.x + 1) / 2;
			pLightInDeviceSpace.y = (pLightInDeviceSpace.y + 1) / 2;

			pPass.setTexture('CUBETEXTURE0', pSkyboxTexture);
			pPass.setTexture('FRESNEL_TEXTURE', pFresnelTexture);
			pPass.setForeign("bUseFresnelTexture", bFresnelTexture);

			pPass.setForeign("PhysicalSpecG", iPbsSpecG);
			pPass.setForeign("PhysicalDiffuse", iPbsDiffuse);
			pPass.setForeign("PhysicalSpecD", iPbsSpecD);
			pPass.setForeign("PhysicalSpecF", iPbsSpecF);

			pPass.setUniform("SCREEN_ASPECT_RATIO",
				math.Vec2.temp(pViewport.getActualWidth() / pViewport.getActualHeight(), 1.));


		});
		return pViewport;
	}

	var orbitalAngSpeed: float = 0.001
	// Light sources data
	var omniLightAttenuation: math.Vec3 = new math.Vec3(1., 0., 1.);
	var lightDiffColor: color.Color = new Color(0.1, 0.1, 0.1, 1.0);
	var spiralRadius: float = 40.;

	var omniLightConst: uint = 4;
	var lightPoss1: Array<math.Vec3> = [
		new math.Vec3(0, 11, 16),
		new math.Vec3(0, 6, 16),
		new math.Vec3(0, 3, 16),
		new math.Vec3(0, 0, 16)];

	var omniLightRound: uint = 4;
	var lightPoss2: Array<math.Vec3> = [
		new math.Vec3(0, 0, -(spiralRadius + 2.)),
		new math.Vec3(0, 0, (spiralRadius + 2.)),
		new math.Vec3((spiralRadius + 2.), 0, 0),
		new math.Vec3(-(spiralRadius + 2.), 0, 0)];

	var nd = pScene.createNode();
	nd.attachToParent(pScene.getRootNode());
	nd.setPosition(0., 0., 20.);
	var orbitalAngSpeed: float = 0.001
	var totalLightSources: uint = 20;

	function spiralPosition(i: uint): float {
		return -spiralRadius + 2. * spiralRadius * i / totalLightSources;
	};

	function spiralRotation(i: uint): float {
		return orbitalAngSpeed * 5 * Math.abs(i - totalLightSources / 2) / totalLightSources;
	};

	export var pLight: IOmniLight = null;
	function createLighting(): void {
		var pOmniLight: IOmniLight;

		// Four constant points of light in front of objects
		for (var i = 0; i < omniLightConst; i++) {
			pOmniLight = <IOmniLight>pScene.createLightPoint(ELightTypes.OMNI, false, 512, "omni-light-const-" + i.toString());
			pOmniLight.attachToParent(pScene.getRootNode());
			pOmniLight.setEnabled(true);
			pOmniLight.getParams().ambient.set(0);
			pOmniLight.getParams().diffuse.set(lightDiffColor);
			pOmniLight.getParams().specular.set(lightDiffColor);
			pOmniLight.getParams().attenuation.set(omniLightAttenuation);
			pOmniLight.setShadowCaster(false);
			pOmniLight.addPosition(lightPoss1[i]);
		};

		// Moving lights in round
		var pOmniLightRoundList: IOmniLight[] = new Array(omniLightRound);
		for (var i = 0; i < omniLightRound; i++) {
			pOmniLight = <IOmniLight>pScene.createLightPoint(ELightTypes.OMNI, false, 512, "omni-light-const-" + i.toString());
			pOmniLight.attachToParent(nd);
			pOmniLight.setEnabled(true);
			pOmniLight.getParams().ambient.set(0);
			pOmniLight.getParams().diffuse.set(lightDiffColor);
			pOmniLight.getParams().specular.set(lightDiffColor);
			pOmniLight.getParams().attenuation.set(omniLightAttenuation);
			pOmniLight.setShadowCaster(false);
			pOmniLight.addRelPosition(lightPoss2[i]);
			pOmniLightRoundList[i] = pOmniLight;
		};
		pScene.beforeUpdate.connect(() => {
			for (var i = 0; i < omniLightRound; i++) {
				pOmniLightRoundList[i].addOrbitRotationByEulerAngles(orbitalAngSpeed, 0, 0);
			}
		})

		// Moving lights in spiral
		var pOmniLightSpiralList: IOmniLight[] = new Array(totalLightSources);
		for (var i = 0; i < totalLightSources; i++) {
			pOmniLightSpiralList[i] = <IOmniLight>pScene.createLightPoint(ELightTypes.OMNI, false, 512, "omni-light-spiral-" + i.toString());
			pOmniLightSpiralList[i].attachToParent(nd);
			pOmniLightSpiralList[i].setEnabled(true);
			pOmniLightSpiralList[i].getParams().ambient.set(0);
			pOmniLightSpiralList[i].getParams().diffuse.set(lightDiffColor);
			pOmniLightSpiralList[i].getParams().specular.set(lightDiffColor);
			pOmniLightSpiralList[i].getParams().attenuation.set(omniLightAttenuation);
			pOmniLightSpiralList[i].setShadowCaster(false);
			pOmniLightSpiralList[i].addRelPosition(spiralPosition(i), 0, 0);
		};
		pScene.beforeUpdate.connect(() => {
			for (var i = 0; i < totalLightSources; i++) {
				pOmniLightSpiralList[i].addOrbitRotationByEulerAngles(spiralRotation(i), 0, 0);
			}
		})

		pLight = pOmniLight;
	}

	function createTextureFresnel(iWidth: uint, iHeight: uint): void {
		pFresnelTexture = pRmgr.createTexture("fresnel_texture_" + guid());
		pFresnelTexture.create(iWidth, iHeight, 1, null, ETextureFlags.RENDERTARGET, 0, 0, ETextureTypes.TEXTURE_2D, EPixelFormats.FLOAT32_R);

		var pRenderTarget: IRenderTarget = pFresnelTexture.getBuffer().getRenderTarget();
		pRenderTarget.setAutoUpdated(false);

		var pViewport: render.TextureViewport = <render.TextureViewport>pRenderTarget.addViewport(new render.TextureViewport(null));
		pViewport.render.connect((pViewport: IViewport, pTechnique: IRenderTechnique,
			iPass: uint, pRenderable: IRenderableObject, pSceneObject: ISceneObject) => {

			var pPass: IRenderPass = pTechnique.getPass(iPass);

		});
		pViewport.getEffect().addComponent("precalculateFresnel");

		//for render call
		pRenderTarget.update();
	}

	function createSkyBox(): void {
		pSkyboxTexture = pSkyboxTextures['desert'];

		if (pViewport.getType() === EViewportTypes.LPPVIEWPORT) {
			(<render.LPPViewport>pViewport).setSkybox(pSkyboxTexture);
		}

		pEnvTexture = pRmgr.createTexture(".env-map-texture-01");
		pEnvTexture.create(1024, 512, 1, null, 0, 0, 0,
			ETextureTypes.TEXTURE_2D, EPixelFormats.R8G8B8);
		pEnvTexture.unwrapCubeTexture(pSkyboxTexture);

		(<IShadedViewport>pViewport).setDefaultEnvironmentMap(pEnvTexture);
	}

	function loadModel(sPath, fnCallback?: Function, name?: String, pRoot?: ISceneNode): ISceneNode {
		var pModelRoot: ISceneNode = pScene.createNode();
		var pModel: ICollada = <ICollada>pEngine.getResourceManager().loadModel(sPath);

		pModelRoot.setName(name || sPath.match(/[^\/]+$/)[0] || 'unnamed_model');
		pModelRoot.attachToParent(pRoot || pScene.getRootNode());
		pModelRoot.setInheritance(ENodeInheritance.ROTPOSITION);

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
				pModelRoot.addRelRotationByXYZAxis(0, 0, 0);
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
		std.setup(pCanvas);

		createTextureFresnel(16, 16);

		pCamera = createCamera();
		pViewport = createViewport();
		pViewport.setBackgroundColor(color.BLACK);
		pViewport.setClearEveryFrame(true);

		var pStatsDiv = createStatsDIV();

		pCanvas.postUpdate.connect((pCanvas: ICanvas3d) => {
			pStatsDiv.innerHTML = pCanvas.getAverageFPS().toFixed(2) + " fps";
		});

		createKeymap(pCamera);
		pCamera.setFOV(Math.PI/4);

		window.onresize = () => {
			pCanvas.resize(window.innerWidth, window.innerHeight);
		};

		createLighting();
		createSkyBox();

		var x = 0;
		/////////////////// LIGHT SOURCES MARKS
		// Four constant points of light in front of objects
		var lightPointsScale: uint = 0.4;
		for (var i = 0; i < omniLightConst; i++) {
			var pModelRoot: INode = loadModel("SPHERE.DAE", 
				(model)=>{
					model.explore( function(node) {
						if(akra.scene.SceneModel.isModel(node)) {
							var pMat: IMaterial = material.create();
							pMat.shininess = 0.;
							pMat.specular = new Color(0.0, 0.0, 0.0, 1.0);
							pMat.diffuse = new Color(0.0, 0.0, 0.0, 1.0);
							pMat.emissive = new Color(0.9, 0.9, 0.9, 1.);

							node.getMesh().getSubset(0).getSurfaceMaterial().setMaterial(pMat);
							}
						});
					}, 'cube-light-const-'+i.toString(), nd).scale(lightPointsScale).setPosition(lightPoss1[i]);
		};

		// Moving lights in round
		var pCubeRoundList: INode[] = new Array(omniLightRound);
		for (var i = 0; i < omniLightRound; i++) {
			pCubeRoundList[i] = loadModel("SPHERE.DAE", 
				(model)=>{
					model.explore( function(node) {
						if(akra.scene.SceneModel.isModel(node)) {
							var pMat: IMaterial = material.create();
							pMat.shininess = 0.;
							pMat.specular = new Color(0.0, 0.0, 0.0, 1.0);
							pMat.diffuse = new Color(0.0, 0.0, 0.0, 1.0);
							pMat.emissive = new Color(0.9, 0.9, 0.9, 1.);

							node.getMesh().getSubset(0).getSurfaceMaterial().setMaterial(pMat);
							}
						});
					}, 'cube-light-round-'+i.toString(), nd).scale(lightPointsScale).setPosition(lightPoss2[i]);
		};
		pScene.beforeUpdate.connect(() => {
			for (var i = 0; i < omniLightRound; i++) {
				pCubeRoundList[i].addOrbitRotationByEulerAngles(orbitalAngSpeed, 0, 0);
			}
		})

		// Moving lights in spiral
		var pCubeSpiralList: INode[] = new Array(totalLightSources);
		for (var i = 0; i < totalLightSources; i++) {
			pCubeSpiralList[i] = loadModel("SPHERE.DAE", 
				(model)=>{
					model.explore( function(node) {
						if(akra.scene.SceneModel.isModel(node)) {
							var pMat: IMaterial = material.create();
							pMat.shininess = 0.;
							pMat.specular = new Color(0.0, 0.0, 0.0, 1.0);
							pMat.diffuse = new Color(0.0, 0.0, 0.0, 1.0);
							pMat.emissive = new Color(0.9, 0.9, 0.9, 1.);

							node.getMesh().getSubset(0).getSurfaceMaterial().setMaterial(pMat);
							}
						});
					}, 'cube-light-spiral-'+i.toString(), nd).scale(lightPointsScale).setPosition(spiralPosition(i), 0, 0);
		};
		pScene.beforeUpdate.connect(() => {
			for (var i = 0; i < totalLightSources; i++) {
				pCubeSpiralList[i].addOrbitRotationByEulerAngles(spiralRotation(i), 0, 0);
			}
		})

		// effective shininess range from 0.1 to 0.9
		function calcShi(i: uint, ma: uint) {
			return (1.0 - i / ma) * 0.8 + 0.1;
		}

		////////////////// JUST OBJECTS
		// GOLDEN TEAPOTS: first row
		var teapotDistance: float = 6.0; // distance between teapots
		var totalTeapots: float = 5;
		var goldenSpecular: color.Color = new Color(0.999, 0.71, 0.29, 1.0);
		var goldenDiffuse: color.Color = new Color(0.999, 0.86, 0.57, 1.0);
		for (var i = 0; i < totalTeapots; i++) {
			loadModel("TEAPOT.DAE",
				(model) => {
					model.explore(function (node) {
						if (akra.scene.SceneModel.isModel(node)) {
							var pMat: IMaterial = material.create();
							pMat.shininess=calcShi(i, totalTeapots);
							pMat.specular=goldenSpecular;
							pMat.diffuse=goldenDiffuse;
							pMat.emissive=new Color(0.0, 0.0, 0.0, 1.0);

							node.getMesh().getSubset(0).getSurfaceMaterial().setMaterial(pMat);
						}
					});
				}, 'teapot-' + i.toString(), nd).scale(3.0).addRelPosition(teapotDistance * (i - (totalTeapots - 1) / 2), 8.0, 0.0);
		};

		// SILVER CUBES: second row
		var cubeDistance: float = 5.0; // distance between cubes
		var totalCubes: float = 10;
		var silverSpecular: color.Color = new Color(0.95, 0.93, 0.88, 1.0);
		var silverDiffuse: color.Color = new Color(0.98, 0.97, 0.95, 1.0);
		for (var i = 0; i < totalCubes; i++) {
			loadModel("SPHERE.DAE", 
				(model)=>{
					model.explore( function(node) {
						if(akra.scene.SceneModel.isModel(node)) {
							var pMat: IMaterial = material.create();
							pMat.shininess=calcShi(i, totalCubes);
							pMat.specular=silverSpecular;
							pMat.diffuse=silverDiffuse;
							pMat.emissive=new Color(0.0, 0.0, 0.0, 1.0);

							node.getMesh().getSubset(0).getSurfaceMaterial().setMaterial(pMat);
							}
						});
					}, 'sphere-light-silver-'+i.toString(), nd).scale(4.0).setPosition(cubeDistance * (i - (totalCubes - 1) / 2), 2.0, 0.0);
		};

		// PLASTIC CUBES: third row
		var plasticSpecular: color.Color = new Color(0.05, 0.05, 0.05, 1.0);
		var plasticDiffuse: color.Color = new Color(0.21, 0.21, 0.21, 1.0);
		for (var i = 0; i < totalCubes; i++) {
			loadModel("SPHERE.DAE", 
				(model)=>{
					model.explore( function(node) {
						if(akra.scene.SceneModel.isModel(node)) {
							var pMat: IMaterial = material.create();
							pMat.shininess=calcShi(i, totalCubes);
							pMat.specular=plasticSpecular;
							pMat.diffuse=plasticDiffuse;
							pMat.emissive=new Color(0.0, 0.0, 0.0, 1.0);

							node.getMesh().getSubset(0).getSurfaceMaterial().setMaterial(pMat);
							}
						});
					}, 'sphere-light-plastic-'+i.toString(), nd).scale(4.0).setPosition(cubeDistance * (i - (totalCubes - 1) / 2), -4.0, 0.0);
		};

		pProgress.destroy();
		pEngine.exec();
	}

	pEngine.depsLoaded.connect(main);
}