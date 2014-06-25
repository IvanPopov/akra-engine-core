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
	export var pSkyboxTexture: ITexture = null;
	export var pSkyboxTextures: IMap<ITexture> = null;
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

	var teapotMaterialKey: string;
	var metalSphereMaterialKey: string;
	var nonmetalSphereMaterialKey: string;
	var teapotDistance: float = 6.0; // distance between teapots
	var totalTeapots: float = 7;
	var pTeapots: INode[] = new Array(totalTeapots);
	var sphereDistance: float = 5.0; // distance between spheres
	var totalSpheres: float = 10;
	var pNonmetalSpheres: INode[] = new Array(totalSpheres);
	var pMetalSpheres: INode[] = new Array(totalSpheres);

	function createViewport(): IViewport3D {
		var pViewport: ILPPViewport = new render.DSViewport(pCamera);
		pCanvas.addViewport(pViewport);
		pCanvas.resize(window.innerWidth, window.innerHeight);
		(<render.ForwardViewport>pViewport).setShadingModel(EShadingModel.PBS_SIMPLE);

		window.onresize = function (event) {
			pCanvas.resize(window.innerWidth, window.innerHeight);
		};

		var pGUI = new dat.GUI();

		var pSkyboxTexturesKeys = [
			'desert',
			'nature',
			'colosseum',
			'beach',
			'plains',
			'church',
			'basilica',
		];
		pSkyboxTextures = {};
		for (var i = 0; i < pSkyboxTexturesKeys.length; i++) {

			var pTexture: ITexture = pSkyboxTextures[pSkyboxTexturesKeys[i]] = pRmgr.createTexture(".sky-box-texture-" + pSkyboxTexturesKeys[i]);
			pTexture.loadResource("SKYBOX_" + pSkyboxTexturesKeys[i].toUpperCase());
		};

		var pMetalMaterialKeys = [
			"gold",
			"copper",
			"iron",
			"aluminium",
			"silver",
		];
		metalSphereMaterialKey = "aluminium";
		var pNonmetalMaterialKeys = [
			"plastic",
			"water",
			"glass"
		];
		nonmetalSphereMaterialKey = "plastic";
		var pMaterialKeys = [].concat(pMetalMaterialKeys, pNonmetalMaterialKeys);
		teapotMaterialKey = "gold";

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

		var pMaterialsFolder = pGUI.addFolder("materials");
		(<dat.OptionController>pMaterialsFolder.add({Material:"gold"}, 'Material', pMaterialKeys)).name("Teapot").onChange((sKey) => {
			for (var i = 0; i < totalTeapots; i++) {
				(<ISceneObject>pTeapots[i].getChild().getChild()).getRenderable().getSurfaceMaterial().getMaterial().set(sKey);
			};
		});
		(<dat.OptionController>pMaterialsFolder.add({Material:"silver"}, 'Material', pMetalMaterialKeys)).name("Metal Sphere").onChange((sKey) => {
			for (var i = 0; i < totalSpheres; i++) {
				(<ISceneObject>pMetalSpheres[i].getChild().getChild()).getRenderable().getSurfaceMaterial().getMaterial().set(sKey);
			};
		});
		(<dat.OptionController>pMaterialsFolder.add({Material:"plastic"}, 'Material', pNonmetalMaterialKeys)).name("Nonmetal Sphere").onChange((sKey) => {
			for (var i = 0; i < totalSpheres; i++) {
				(<ISceneObject>pNonmetalSpheres[i].getChild().getChild()).getRenderable().getSurfaceMaterial().getMaterial().set(sKey);
			};
		});
		var pPBSFolder = pGUI.addFolder("pbs");
		var bFresnelTexture : boolean = false;
		(<dat.OptionController>pPBSFolder.add({'use':bFresnelTexture}, 'use')).name("Precalc texture").onChange((bFresTex:boolean)=>{
			bFresnelTexture = bFresTex;
		});
		
		(<dat.OptionController>pPBSFolder.add({Skybox:"desert"}, 'Skybox', pSkyboxTexturesKeys)).name("Skybox").onChange((sKey) => {
			(<render.ForwardViewport>pViewport).setSkybox(pSkyboxTextures[sKey]);
			(<ITexture>pEnvTexture).unwrapCubeTexture(pSkyboxTextures[sKey]);
		});

		var iPbsSpecG = 3;
		(<dat.OptionController>pPBSFolder.add({PbsSpecG:"Schlick"}, 'PbsSpecG', Object.keys(pPbsSpecG))).name("Geometric visibility").onChange((sKey) => {
			iPbsSpecG = pPbsSpecG[sKey];
		});

		var iPbsDiffuse = 0;
		(<dat.OptionController>pPBSFolder.add({PbsDiffuse:"Lambert"}, 'PbsDiffuse', Object.keys(pPbsDiffuse))).name("Diffuse").onChange((sKey) => {
			iPbsDiffuse = pPbsDiffuse[sKey];
		});

		var iPbsSpecD = 2;
		(<dat.OptionController>pPBSFolder.add({PbsSpecD:"GGX"}, 'PbsSpecD', Object.keys(pPbsSpecD))).name("Scattering").onChange((sKey) => {
			iPbsSpecD = pPbsSpecD[sKey];
		});

		var iPbsSpecF = 1;
		(<dat.OptionController>pPBSFolder.add({PbsSpecF:"Schlick"}, 'PbsSpecF', Object.keys(pPbsSpecF))).name("Fresnel").onChange((sKey) => {
			iPbsSpecF = pPbsSpecF[sKey];
		});

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
	var omniLightAttenuation: math.Vec3 = new math.Vec3(1., 0., 0.01);
	var lightDiffColor: color.Color = new Color(0.1, 0.1, 0.1, 1.0);
	var spiralRadius: float = 40.;

	// var omniLightConst: uint = 4;
	// var lightPoss1: Array<math.Vec3> = [
	// 	new math.Vec3(0, 11, 0),
	// 	new math.Vec3(0, 6, 0),
	// 	new math.Vec3(0, 3, 0),
	// 	new math.Vec3(0, 0, 0)];

	var omniLightRound: uint = 4;
	var lightPoss2: Array<math.Vec3> = [
		new math.Vec3(0, 0, -(spiralRadius + 2.)),
		new math.Vec3(0, 0, (spiralRadius + 2.)),
		new math.Vec3((spiralRadius + 2.), 0, 0),
		new math.Vec3(-(spiralRadius + 2.), 0, 0)];

	var nd = pScene.createNode();
	nd.attachToParent(pScene.getRootNode());
	nd.setPosition(0., 0., 20.);
	var lightDiffColorSpiral: color.Color = new Color(0.05, 0.05, 0.05, 1.0);
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

		// // Four constant points of light in front of objects
		// for (var i = 0; i < omniLightConst; i++) {
		// 	pOmniLight = <IOmniLight>pScene.createLightPoint(ELightTypes.OMNI, false, 512, "omni-light-const-" + i.toString());
		// 	pOmniLight.attachToParent(pScene.getRootNode());
		// 	pOmniLight.setEnabled(true);
		// 	pOmniLight.getParams().ambient.set(0);
		// 	pOmniLight.getParams().diffuse.set(lightDiffColor);
		// 	pOmniLight.getParams().specular.set(lightDiffColor);
		// 	pOmniLight.getParams().attenuation.set(omniLightAttenuation);
		// 	pOmniLight.setShadowCaster(false);
		// 	pOmniLight.addPosition(lightPoss1[i]);
		// };

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
			pOmniLightSpiralList[i].getParams().diffuse.set(lightDiffColorSpiral);
			pOmniLightSpiralList[i].getParams().specular.set(lightDiffColorSpiral);
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
		pViewport.getEffect().addComponent("akra.system.precalculateFresnel");

		akra.config.__VIEW_INTERNALS__ = true;
		//for render call
		pRenderTarget.update();
		akra.config.__VIEW_INTERNALS__ = false;
	}

	function createSkyBox(): void {
		pSkyboxTexture = pSkyboxTextures['desert'];

		if (pViewport.getType() === EViewportTypes.FORWARDVIEWPORT) {
			var pModel = addons.cube(pScene);
			(<IForwardViewport>pViewport).setSkyboxModel(pModel.getRenderable(0));
		}
		(<render.ForwardViewport>pViewport).setSkybox(pSkyboxTexture);

		pEnvTexture = pRmgr.createTexture(".env-map-texture-01");
		pEnvTexture.create(1024, 512, 1, null, 0, 0, 0,
			ETextureTypes.TEXTURE_2D, EPixelFormats.R8G8B8);
		pEnvTexture.unwrapCubeTexture(pSkyboxTexture);

		(<IForwardViewport>pViewport).setDefaultEnvironmentMap(pEnvTexture);
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
		// for (var i = 0; i < omniLightConst; i++) {
		// 	var pModelRoot: INode = loadModel("SPHERE.DAE", 
		// 		(model)=>{
		// 			model.explore( function(node) {
		// 				if(akra.scene.SceneModel.isModel(node)) {
		// 					var pMat: IMaterial = material.create();
		// 					pMat.set("black");
		// 					pMat.shininess = 0.;
		// 					pMat.emissive.set(0.9, 0.9, 0.9, 1.);

		// 					node.getMesh().getSubset(0).getSurfaceMaterial().setMaterial(pMat);
		// 					}
		// 				});
		// 			}, 'sphere-light-const-'+i.toString(), nd).scale(lightPointsScale).setPosition(lightPoss1[i]);
		// };

		// Moving lights in round
		var pSphereRoundList: INode[] = new Array(omniLightRound);
		for (var i = 0; i < omniLightRound; i++) {
			pSphereRoundList[i] = loadModel("SPHERE.DAE", 
				(model)=>{
					model.explore( function(node) {
						if(akra.scene.SceneModel.isModel(node)) {
							var pMat: IMaterial = material.create();
							pMat.set("black");
							pMat.shininess = 0.;
							pMat.emissive.set(0.9, 0.9, 0.9, 1.);

							node.getMesh().getSubset(0).getSurfaceMaterial().setMaterial(pMat);
							}
						});
					}, 'sphere-light-round-'+i.toString(), nd).scale(lightPointsScale).setPosition(lightPoss2[i]);
		};
		pScene.beforeUpdate.connect(() => {
			for (var i = 0; i < omniLightRound; i++) {
				pSphereRoundList[i].addOrbitRotationByEulerAngles(orbitalAngSpeed, 0, 0);
			}
		})

		// Moving lights in spiral
		var pSphereSpiralList: INode[] = new Array(totalLightSources);
		for (var i = 0; i < totalLightSources; i++) {
			pSphereSpiralList[i] = loadModel("SPHERE.DAE", 
				(model)=>{
					model.explore( function(node) {
						if(akra.scene.SceneModel.isModel(node)) {
							var pMat: IMaterial = material.create();
							pMat.set("black");
							pMat.shininess = 0.;
							pMat.emissive.set(0.9, 0.9, 0.9, 1.);

							node.getMesh().getSubset(0).getSurfaceMaterial().setMaterial(pMat);
							}
						});
					}, 'sphere-light-spiral-'+i.toString(), nd).scale(lightPointsScale).setPosition(spiralPosition(i), 0, 0);
		};
		pScene.beforeUpdate.connect(() => {
			for (var i = 0; i < totalLightSources; i++) {
				pSphereSpiralList[i].addOrbitRotationByEulerAngles(spiralRotation(i), 0, 0);
			}
		})

		// effective shininess range from 0.1 to 0.9
		function calcShi(i: uint, ma: uint) {
			return (1.0 - i / ma) * 0.8 + 0.1;
		}
		function calcPos(i: uint, tot: uint, dis: float) {
			return dis * (i - (tot - 1) / 2);
		}

		////////////////// JUST OBJECTS
		// default(GOLDEN) TEAPOTS: first row
		for (var i = 0; i < totalTeapots; i++) {
			pTeapots[i] = loadModel("TEAPOT.DAE",
				(model) => {
					model.explore(function (node) {
						if (akra.scene.SceneModel.isModel(node)) {
							var pMat: IMaterial = material.create();
							pMat.set(teapotMaterialKey);
							pMat.shininess=calcShi(i, totalTeapots);
							pMat.emissive.set(0.0, 0.0, 0.0, 1.0);

							node.getMesh().getSubset(0).getSurfaceMaterial().setMaterial(pMat);
						}
					});
				}, 'teapot-' + i.toString(), nd).scale(3.0).addRelPosition(calcPos(i, totalTeapots, teapotDistance), 8.0, 0.0);
		};

		// default(SILVER) SPHERES: second row
		for (var i = 0; i < totalSpheres; i++) {
			pMetalSpheres[i] = loadModel("SPHERE.DAE", 
				(model)=>{
					model.explore( function(node) {
						if(akra.scene.SceneModel.isModel(node)) {
							var pMat: IMaterial = material.create();
							pMat.set(metalSphereMaterialKey);
							pMat.shininess=calcShi(i, totalSpheres);
							pMat.emissive.set(0.0, 0.0, 0.0, 1.0);

							node.getMesh().getSubset(0).getSurfaceMaterial().setMaterial(pMat);
							}
						});
					}, 'sphere-metal-'+i.toString(), nd).scale(4.0).setPosition(calcPos(i, totalSpheres, sphereDistance), 2.0, 0.0);
		};

		// default(PLASTIC) SPHERES: third row
		for (var i = 0; i < totalSpheres; i++) {
			pNonmetalSpheres[i] = loadModel("SPHERE.DAE", 
				(model)=>{
					model.explore( function(node) {
						if(akra.scene.SceneModel.isModel(node)) {
							var pMat: IMaterial = material.create();
							pMat.set(nonmetalSphereMaterialKey);
							pMat.shininess=calcShi(i, totalSpheres);
							pMat.emissive.set(0.0, 0.0, 0.0, 1.0);

							node.getMesh().getSubset(0).getSurfaceMaterial().setMaterial(pMat);
							}
						});
					}, 'sphere-nonmetal-'+i.toString(), nd).scale(4.0).setPosition(calcPos(i, totalSpheres, sphereDistance), -4.0, 0.0);
		};

		pProgress.destroy();
		pEngine.exec();
	}

	pEngine.depsLoaded.connect(main);
}