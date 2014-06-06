/// <reference path="../../../built/Lib/akra.d.ts" />
/// <reference path="../../../built/Lib/base3dObjects.addon.d.ts" />
/// <reference path="../../../built/Lib/progress.addon.d.ts" />
/// <reference path="../../../built/Lib/filedrop.addon.d.ts" />
/// <reference path="../../../built/Lib/compatibility.addon.d.ts" />


/// <reference path="../std/std.ts" />

/// <reference path="../idl/3d-party/dat.gui.d.ts" />

declare var AE_MERCEDES_DATA: akra.IDep;

module akra {

	//config.DEBUG = false;

	if (!config.DEBUG) {
		addons.compatibility.ignoreWebGLExtension(webgl.WEBGL_DEPTH_TEXTURE);
		addons.compatibility.ignoreWebGLExtension(webgl.OES_ELEMENT_INDEX_UINT);
		addons.compatibility.ignoreWebGLExtension(webgl.OES_TEXTURE_FLOAT);
		addons.compatibility.ignoreWebGLExtension(webgl.WEBGL_COMPRESSED_TEXTURE_S3TC);
		addons.compatibility.ignoreWebGLExtension(webgl.OES_STANDARD_DERIVATIVES);
	}


	addons.compatibility.verify("non-compatible");

	var pProgress = new addons.Progress(document.getElementById("progress"));

	deps.addDependenceHandler(["skin"], null, deps.loadCustom);

	var pRenderOpts: IRendererOptions = {
		premultipliedAlpha: true,
		preserveDrawingBuffer: true,
		antialias: true,
		depth: true
	};

	var fnProgress = pProgress.getListener();

	var pSkinData: IMap<string> = {};

	var pOptions: IEngineOptions = {
		renderer: pRenderOpts,
		progress: (e: IDepEvent) => {
			if ((e.source.type === "skin" || path.parse(e.source.path).getExt() === "skin") && e.source.stats.status === EDependenceStatuses.LOADED) {
				pSkinData[e.source.name || path.parse(e.source.path).getBaseName()] = e.source.content;
			}

			fnProgress(e);
		},
		deps: { files: [AE_MERCEDES_DATA], root: "./" },
	};

	export var pEngine = akra.createEngine(pOptions);

	var pScene = pEngine.getScene();

	export var pCanvas: ICanvas3d = pEngine.getRenderer().getDefaultCanvas();
	export var pCamera: ICamera = null;
	export var pViewport: IViewport = null;
	var pReflectionCamera: ICamera = null;
	var pReflectionViewport: IViewport = null;
	var pReflectionTexture: ITexture = null;
	var pMirror: INode = null;
	var pRmgr: IResourcePoolManager = pEngine.getResourceManager();

	var pSkyboxTexture = null;
	var pSkyboxTextures: IMap<ITexture> = null;
	var pEnvTexture = null;
	var pDepthViewport = null;

	var pGUI: dat.GUI = null;
	var pAnimate = { animate: true };

	export var pPilotNode: INode = null;


	export var pCameraParams = {
		current: {
			orbitRadius: 6,
			rotation: new math.Vec2(0., 0.),
			center: new Vec3(0),
		},
		target: {
			orbitRadius: 6,
			rotation: new math.Vec2(0., 0.),
			center: new Vec3(0)
		}
	}

	export var pModelTable = null;
	export var pModels = null;
	export var pCurrentModel = null;
	export var pPodiumModel = null;

	function createCamera(): ICamera {
		var pCamera: ICamera = pScene.createCamera();

		pCamera.attachToParent(pScene.getRootNode());
		pCamera.setPosition(Vec3.temp(0., 0., 4.2));

		pCamera.update();

		return pCamera;
	}

	function switchToCabinView() {
		pCameraParams.target.orbitRadius = 0.;
		pCameraParams.target.center.set(0., 1., .4);
	}

	function switchToOutdoorView() {
		pCameraParams.target.center.set(0., 0., 0.);
	}

	function inCabinView(): boolean {
		return pCameraParams.target.orbitRadius == 0;
	}

	var bCabinSwitchLocked: boolean = false;

	function isCabinSwitchLocked() {
		return bCabinSwitchLocked;
	}

	var iLock: int = -1;
	function lockCabinSwitch() {
		clearTimeout(iLock);
		bCabinSwitchLocked = true;
		setTimeout(() => {
			bCabinSwitchLocked = false;
		}, 333);
	}

	function animateCameras(): void {
		pScene.beforeUpdate.connect(() => {
			if (pCameraParams.target.orbitRadius < 3. && !inCabinView() && !isCabinSwitchLocked()) {
				switchToCabinView();
			}
			else {
				pCameraParams.target.center.set(0.);
			}

			if (inCabinView()) {
				pCameraParams.target.center.set(pPilotNode.getWorldPosition());
			}

			pCamera.update();
			pReflectionCamera.update();

			var newRot = math.Vec2.temp(pCameraParams.current.rotation).add(math.Vec2.temp(pCameraParams.target.rotation).subtract(pCameraParams.current.rotation).scale(0.15));
			var newRad = pCameraParams.current.orbitRadius * (1. + (pCameraParams.target.orbitRadius - pCameraParams.current.orbitRadius) * 0.03);
			pCameraParams.current.center.add(pCameraParams.target.center.subtract(pCameraParams.current.center, Vec3.temp()).scale(0.03));

			pCameraParams.current.rotation.set(newRot);
			pCameraParams.current.orbitRadius = newRad;
			
			pCamera.setPosition(Vec3.temp(
				newRad * -math.sin(newRot.x) * math.cos(newRot.y),
				newRad * math.sin(newRot.y),
				newRad * math.cos(newRot.x) * math.cos(newRot.y)).add(pCameraParams.current.center));
			pCamera.lookAt(pCameraParams.current.center);

			pCamera.update();

			var dist = math.Vec3.temp(pCamera.getWorldPosition()).subtract(pMirror.getWorldPosition());
			var up = pMirror.getTempVectorUp();

			pReflectionCamera.setPosition(math.Vec3.temp(pCamera.getWorldPosition()).add(math.Vec3.temp(up).scale(-2. * (up.dot(dist)))));
			pReflectionCamera.setRotationByForwardUp(
				pCamera.getTempVectorForward().add(math.Vec3.temp(up).scale(-2. * up.dot(pCamera.getTempVectorForward()))),
				pCamera.getTempVectorUp().add(math.Vec3.temp(up).scale(-2. * up.dot(pCamera.getTempVectorUp()))));
			pReflectionCamera.setAspect(pCamera.getAspect());

			pReflectionCamera.update();
		});
	}

	var iXPrev: uint = 0, iYPrev: uint = 0;
	function cameraRotationCallback(pViewport: IViewport, eBtn: EMouseButton, x: uint, y: uint, dx: uint, dy: uint) {
		if (eBtn !== EMouseButton.LEFT) return;

		dx = x - iXPrev;
		dy = y - iYPrev;

		pCameraParams.target.rotation.y = math.clamp(pCameraParams.target.rotation.y - dy / pViewport.getActualHeight() * 2., 0.1, 1.2);
		pCameraParams.target.rotation.x += dx / pViewport.getActualHeight() * 2.;

		iXPrev = x;
		iYPrev = y;
	}

	function createKeymap(pCamera: ICamera, pViewport: IViewport3D): void {

		
		pViewport.dragstart.connect((pViewport, eBtn, x, y) => {
			iXPrev = x; iYPrev = y;
		});

		pViewport.dragging.connect(cameraRotationCallback);

		pViewport.enableSupportForUserEvent(EUserEvents.MOUSEWHEEL | EUserEvents.DRAGGING | EUserEvents.DRAGSTART | EUserEvents.DRAGSTOP);

		pViewport.mousewheel.connect((pViewport, x: float, y: float, fDelta: float) => {
			pCameraParams.target.orbitRadius = math.clamp(pCameraParams.target.orbitRadius - fDelta / pViewport.getActualHeight() * 2., 2.5, 10.);
			if (fDelta < 0) {
				lockCabinSwitch();
			}
		});

	}




	function setupMaterialPicking(pViewport: ILPPViewport, pList?: IMaterial[]): void {
		var pControls: dat.GUI = pGUI.addFolder("material");
		(<any>pControls).open();

		var pNames: string[] = [];

		if (pList) {
			pList.forEach((pMat) => { pNames.push(pMat.name); });
		}

		var pMat = {
			list: null,
			origin: null,
			surface: null,
			name: "unknown", glossiness: 1e-2, transparency: 1e-2,
			diffuse: "#000000", ambient: "#000000", emissive: "#000000", specular: "#000000",
			texture: false
		};

		function chose(pOrigin: IMaterial, pSurfaceMaterial: ISurfaceMaterial = null): void {
			pMat.surface = pSurfaceMaterial;
			pMat.origin = pOrigin;
			pMat.name = pOrigin.name;
			pMat.glossiness = pOrigin.shininess;
			pMat.transparency = pOrigin.transparency;
			pMat.diffuse = pOrigin.diffuse.getHtml();
			pMat.emissive = pOrigin.emissive.getHtml();
			pMat.specular = pOrigin.specular.getHtml();

			if (pSurfaceMaterial) {
				pMat.texture = pSurfaceMaterial.texture(ESurfaceMaterialTextures.DIFFUSE) !== null && !pSurfaceMaterial.texture(ESurfaceMaterialTextures.DIFFUSE).isResourceDisabled();
			}
		}


		pControls.add(pMat, "list", pNames).name("material").onChange((sName: string) => {
			chose(pList[pNames.indexOf(sName)], null);
		});

		pControls.add(pMat, "name").listen();
		pControls.add(pMat, "glossiness", 0., 1.).listen().onChange(() => {
			if (pMat.origin) {
				pMat.origin.shininess = pMat.glossiness;
			}
		});

		pControls.add(pMat, "transparency", 0., 1.).listen().onChange(() => {
			if (pMat.origin) {
				pMat.origin.transparency = pMat.transparency;
			}
		});

		pControls.addColor(pMat, "diffuse").listen().onChange(() => {
			if (pMat.origin) {
				(<IColor>pMat.origin.diffuse).set(pMat.diffuse);
			}
		});

		pControls.addColor(pMat, "emissive").listen().onChange(() => {
			if (pMat.origin) {
				(<IColor>pMat.origin.emissive).set(pMat.emissive);
			}
		});
		pControls.addColor(pMat, "specular").listen().onChange(() => {
			if (pMat.origin) {
				(<IColor>pMat.origin.specular).set(pMat.specular);
			}
		});

		pControls.add(pMat, "texture").listen().name("diffuse texture").onChange((bValue) => {
			if (pMat.surface) {
				if ((<ISurfaceMaterial>pMat.surface).texture(ESurfaceMaterialTextures.DIFFUSE)) {
					if (bValue) {
						(<ISurfaceMaterial>pMat.surface).texture(ESurfaceMaterialTextures.DIFFUSE).notifyRestored();
					}
					else {
						(<ISurfaceMaterial>pMat.surface).texture(ESurfaceMaterialTextures.DIFFUSE).notifyDisabled();
					}

					(<ISurfaceMaterial>pMat.surface).notifyAltered();
				}
			}
		});

		if (pViewport.getType() !== EViewportTypes.FORWARDVIEWPORT) {
			pViewport.enableSupportForUserEvent(EUserEvents.CLICK);
			pViewport.enable3DEvents(false);
			pViewport.click.connect((pViewport: ILPPViewport, x, y) => {
				var pResult = pViewport.pick(x, y);
				pViewport.highlight(pResult);

				if (pResult.renderable) {
					console.log(pResult.renderable);
					pResult.renderable.switchRenderMethod(null);
					if (pResult.renderable.getSurfaceMaterial()) {
						var pOrigin: IMaterial = pResult.renderable.getMaterial();

						chose(pOrigin, pResult.renderable.getSurfaceMaterial());
					}
				}
			});
		}
	}

	function createViewport(): IViewport3D {
		var pViewport: IViewport3D = config.DEBUG ?
			new render.LPPViewport(pCamera, 0., 0., 1., 1., 11) :
			new render.ForwardViewport(pCamera, 0., 0., 1., 1., 11);

		pCanvas.addViewport(pViewport);
		pCanvas.resize(window.innerWidth, window.innerHeight);

		window.onresize = function (event) {
			pCanvas.resize(window.innerWidth, window.innerHeight);
		};

		var counter = 0;
		var pEffect = (<render.ForwardViewport>pViewport).getEffect();

		if (config.DEBUG) {
			pGUI = <dat.GUI>(new (<any>dat.GUI)({ autoPlace: false }));
			document.body.appendChild(pGUI.domElement);
			pGUI.domElement.style.position = "absolute";
			pGUI.domElement.style.top = "100px";
		}
		
	

		

		var pFogEffectData = window['fog_effect_data'] = {
			fogColor: 0.,
			fogOpacity: 0.8,
			fogStart: 14,
			fogIndex: 11,
			fogHeight: 2.3
		};

		var bAdvancedSkybox: boolean = true;
		var fSkyboxSharpness: float = .72;
		(<IViewportFogged>pViewport).setFog(true);

		if (config.DEBUG) {
		
			var pFogEffectFolder = pGUI.addFolder("fogEffect");

			pGUI.add({ fog: true }, "fog").onChange((bValue) => {
				(<IViewportFogged>pViewport).setFog(bValue);
			});

			(<dat.NumberControllerSlider>pFogEffectFolder.add(pFogEffectData, 'fogColor')).min(0.).max(1.).step(0.01).name("color").__precision = 2;
			(<dat.NumberControllerSlider>pFogEffectFolder.add(pFogEffectData, 'fogOpacity')).min(0.).max(1.).step(0.01).name("opacity").__precision = 2;
			(<dat.NumberControllerSlider>pFogEffectFolder.add(pFogEffectData, 'fogStart')).min(0.).max(100.).step(0.01).name("start");
			(<dat.NumberControllerSlider>pFogEffectFolder.add(pFogEffectData, 'fogIndex')).min(0.01).max(100.).step(0.01).name("index");
			(<dat.NumberControllerSlider>pFogEffectFolder.add(pFogEffectData, 'fogHeight')).min(0.).max(10.).step(0.01).name("height").__precision = 2;

			pGUI.add({ skybox_sharpness: fSkyboxSharpness }, "skybox_sharpness", 0., 1., 0.01).onChange((fValue) => {
				fSkyboxSharpness = fValue;
			})

			pGUI.add({ skybox_blur: bAdvancedSkybox }, "skybox_blur").onChange((bValue) => {
				bAdvancedSkybox = bValue;
			});
		}

		pViewport.render.connect((pViewport: IViewport, pTechnique: IRenderTechnique,
			iPass: uint, pRenderable: IRenderableObject, pSceneObject: ISceneObject) => {
			var pPass: IRenderPass = pTechnique.getPass(iPass);
			//var pDepthTexture: ITexture = (<IShadedViewport>pViewport).getDepthTexture();

			pPass.setUniform("SKYBOX_ADVANCED_SHARPNESS", pCameraParams.current.orbitRadius < .2 ? 1. : fSkyboxSharpness);
			pPass.setTexture("SKYBOX_UNWRAPED_TEXTURE", pEnvTexture);
			pPass.setForeign("IS_USED_ADVANCED_SKYBOX", bAdvancedSkybox);

			pPass.setUniform("FOG_EFFECT_COLOR", math.Vec4.temp(pFogEffectData.fogColor, pFogEffectData.fogColor, pFogEffectData.fogColor, pFogEffectData.fogOpacity));
			pPass.setUniform("FOG_EFFECT_START", pFogEffectData.fogStart);
			pPass.setUniform("FOG_EFFECT_INDEX", pFogEffectData.fogIndex);
			pPass.setUniform("FOG_EFFECT_HEIGHT", pFogEffectData.fogHeight);

			//pPass.setUniform("SKYBOX_ADVANCED_SHARPNESS", fSkyboxSharpness);
			//pPass.setTexture("SKYBOX_UNWRAPED_TEXTURE", pEnvTexture);
		});

		if (pViewport.getType() === EViewportTypes.LPPVIEWPORT || pViewport.getType() === EViewportTypes.DSVIEWPORT) {
			var pTransparencyViewport: IForwardViewport = <IForwardViewport>(<IShadedViewport>pViewport)._getTransparencyViewport();
			pTransparencyViewport.render.connect((pViewport: IViewport, pTechnique: IRenderTechnique,
				iPass: uint, pRenderable: IRenderableObject, pSceneObject: ISceneObject) => {
				var pPass: IRenderPass = pTechnique.getPass(iPass);
				pPass.setUniform("FOG_EFFECT_COLOR", math.Vec4.temp(pFogEffectData.fogColor, pFogEffectData.fogColor, pFogEffectData.fogColor, pFogEffectData.fogOpacity));
				pPass.setUniform("FOG_EFFECT_START", pFogEffectData.fogStart);
				pPass.setUniform("FOG_EFFECT_INDEX", pFogEffectData.fogIndex);
				pPass.setUniform("FOG_EFFECT_HEIGHT", pFogEffectData.fogHeight);
			});
		}

		var pSkyboxTexturesKeys = [
			'nightsky.dds',
			//'desert',
			//'nature',
			//'colosseum',
			//'beach',
			//'plains',
			//'church',
			//'basilica',
		];

		pSkyboxTextures = {};

		for (var i = 0; i < pSkyboxTexturesKeys.length; i++) {
			pSkyboxTextures[pSkyboxTexturesKeys[i]] = pRmgr.createTexture(".sky-box-texture-" + pSkyboxTexturesKeys[i]);

			var sPrefix: string = "SKYBOX_" + pSkyboxTexturesKeys[i].toUpperCase();
			var pImages: string[] = [
				sPrefix + "_POS_X",
				sPrefix + "_NEG_X",
				sPrefix + "_POS_Y",
				sPrefix + "_NEG_Y",
				sPrefix + "_POS_Z",
				sPrefix + "_NEG_Z"
			];

			(<ITexture>(pSkyboxTextures[pSkyboxTexturesKeys[i]])).loadImages(pImages);
		}


		if (config.DEBUG) {
			var pPBSFolder = pGUI.addFolder("pbs");

			(<dat.OptionController>pPBSFolder.add({ Skybox: "nightsky.dds" }, 'Skybox', pSkyboxTexturesKeys)).name("Skybox").onChange((sKey) => {

				(<render.LPPViewport>pViewport).setSkybox(pSkyboxTextures[sKey]);


				(<ITexture>pEnvTexture).unwrapCubeTexture(pSkyboxTextures[sKey]);
			});
		}

		(<ILPPViewport>pViewport).setShadingModel(EShadingModel.PBS_SIMPLE);

		return pViewport;
	}
	

	function createMirror(): INode {
		var pNode: INode = pScene.createNode().setPosition(0., -1.5, 0.);
		pNode.setInheritance(ENodeInheritance.ROTPOSITION);
		pReflectionCamera = createMirrorCamera(pNode);
		pReflectionViewport = createMirrorViewport(pNode);

		return pNode;
	}

	function createMirrorCamera(pReflNode: INode): ICamera {
		var pReflectionCamera: ICamera = pScene.createCamera("reflection_camera_01");

		pReflectionCamera.attachToParent(pScene.getRootNode());
		pReflectionCamera.setInheritance(pCamera.getInheritance());

		return pReflectionCamera;
	}

	function createMirrorViewport(pReflNode: INode): IViewport {

		pReflectionTexture = pRmgr.createTexture(".reflection_texture");
		pReflectionTexture.create(1024, 1024, 1, null, ETextureFlags.RENDERTARGET, 0, 0,
			ETextureTypes.TEXTURE_2D, EPixelFormats.R8G8B8);

		var pRenderTarget = pReflectionTexture.getBuffer().getRenderTarget();
		pRenderTarget.setAutoUpdated(false);

		var pDepthTexture = pRmgr.createTexture(".mirror - depth");
		pDepthTexture.create(1024, 1024, 1, null, 0, 0, 0, ETextureTypes.TEXTURE_2D, EPixelFormats.DEPTH32);
		pRenderTarget.attachDepthTexture(pDepthTexture);

		var pTexViewport: IMirrorViewport = <IMirrorViewport>pRenderTarget.addViewport(new render.MirrorViewport(pReflectionCamera, 0., 0., 1., 1., 0));
		var pEffect = (<render.LPPViewport>pTexViewport.getInternalViewport()).getEffect();

		//pEffect.addComponent("akra.system.blur");

		(<render.LPPViewport>pTexViewport.getInternalViewport()).render.connect((pViewport: IViewport, pTechnique: IRenderTechnique,
			iPass: uint, pRenderable: IRenderableObject, pSceneObject: ISceneObject) => {
			var pPass: IRenderPass = pTechnique.getPass(iPass);
			pPass.setUniform("BLUR_RADIUS", 2.0);
		});

		return pTexViewport;
	}

	var lightPos1: math.Vec3 = new math.Vec3(1, 2, 2);
	var lightPos2: math.Vec3 = new math.Vec3(-1, -2, 2);

	export var pOmniLights: INode = null;
	function createLighting(): void {
		pOmniLights = pScene.createNode('lights-root');
		pOmniLights.attachToParent(pCamera);
		pOmniLights.setInheritance(ENodeInheritance.ALL);

		var pOmniLight: IOmniLight;
		var pOmniLightSphere;

		pOmniLight = <IOmniLight>pScene.createLightPoint(ELightTypes.OMNI, true, 2048, "test-omni-0");

		pOmniLight.attachToParent(pOmniLights);
		pOmniLight.setEnabled(true);
		pOmniLight.getParams().ambient.set(0.1);
		pOmniLight.getParams().diffuse.set(1.0, 1.0, 1.0);
		pOmniLight.getParams().specular.set(1.0, 1.0, 1.0, 1.0);
		pOmniLight.getParams().attenuation.set(1, 0, 0.3);
		pOmniLight.setShadowCaster(true);
		pOmniLight.setInheritance(ENodeInheritance.ALL);

		pOmniLight.setPosition(lightPos1);

		pOmniLight = <IOmniLight>pScene.createLightPoint(ELightTypes.OMNI, true, 512, "test-omni-0");

		pOmniLight.attachToParent(pOmniLights);
		pOmniLight.setEnabled(true);
		pOmniLight.getParams().ambient.set(0.1);
		pOmniLight.getParams().diffuse.set(1.0, 1.0, 1.0);
		pOmniLight.getParams().specular.set(1.0, 1.0, 1.0, 1.0);
		pOmniLight.getParams().attenuation.set(1, 0, 0.3);
		pOmniLight.setShadowCaster(false);
		pOmniLight.setInheritance(ENodeInheritance.ALL);

		pOmniLight.setPosition(lightPos2);
	}

	function createSkyBox(): void {
		pSkyboxTexture = pSkyboxTextures['nightsky.dds'];

		
		if (pViewport.getType() === EViewportTypes.FORWARDVIEWPORT) {
			//var pCube: ICollada = <ICollada>pRmgr.loadModel("CUBE.DAE");
			//var pModel = pCube.extractModel("box");
			var pModel = addons.cube(pScene);
			(<IForwardViewport>pViewport).setSkyboxModel(pModel.getRenderable(0));
		}

		(<render.LPPViewport>pViewport).setSkybox(pSkyboxTexture);
	

		pEnvTexture = pRmgr.createTexture(".env-map-texture-01");
		pEnvTexture.create(1024, 512, 1, null, 0, 0, 0,
			ETextureTypes.TEXTURE_2D, EPixelFormats.R8G8B8);
		pEnvTexture.unwrapCubeTexture(pSkyboxTexture);

		(<ILPPViewport>pViewport).setDefaultEnvironmentMap(pEnvTexture);
		(<ILPPViewport>((<render.MirrorViewport>pReflectionViewport).getInternalViewport())).setDefaultEnvironmentMap(pEnvTexture);
		(<ILPPViewport>((<render.MirrorViewport>pReflectionViewport).getInternalViewport())).setShadingModel(EShadingModel.PBS_SIMPLE);
	}


	function createStatsDIV() {
		var pStatsDiv = document.createElement("div");

		document.body.appendChild(pStatsDiv);
		pStatsDiv.setAttribute("style",
			"position: fixed;" +
			"max-height: 40px;" +
			"max-width: 120px;" +
			"color: green;" +
			"margin: 5px;" +
			"font-family: Arial;");

		return pStatsDiv;
	}

	interface IMercedesSkin {
		data: IMap<IMaterial>;
		name: string;
		intensity: float;
	}

	function main(pEngine: IEngine) {
		//console.profile("main");
		std.setup(pCanvas);

		pCamera = createCamera();
		pViewport = createViewport();
		pMirror = createMirror();
		pViewport.setBackgroundColor(color.GRAY);
		pViewport.setClearEveryFrame(true);

		if (config.DEBUG) {
			var pStatsDiv = createStatsDIV();

			pCanvas.postUpdate.connect((pCanvas: ICanvas3d) => {
				pStatsDiv.innerHTML = pCanvas.getAverageFPS().toFixed(2) + " fps";
			});
		}

		createKeymap(pCamera, <IViewport3D>pViewport);

		window.onresize = () => {
			pCanvas.resize(window.innerWidth, window.innerHeight);
		};

		createLighting();
		createSkyBox();

		var pPlasticMaterial: IMaterial = new material.Material();
		pPlasticMaterial.shininess = 0.176;
		pPlasticMaterial.diffuse.set("#bbbbbb");
		pPlasticMaterial.specular.set("#4a4a4a");

		var iTableRadius: float = 3.15;
		var iTableHeight: float = 0;

		pModelTable = addons.trifan(pScene, iTableRadius, 96);
		pModelTable.attachToParent(pScene.getRootNode());
		pModelTable.setPosition(0., iTableHeight, 0.);

		

		if (config.DEBUG) {
			pGUI.add(pAnimate, "animate");
		}

		pScene.beforeUpdate.connect(() => {
			if (!pAnimate.animate) return;
			pModelTable.addRelRotationByXYZAxis(0., 0.001, 0.);
		});

		function createSceneLights() {
			var h = 1.;
			var d = 200;
			var iPower = 1.;

			var pGroundLight: IOmniLight = window["ground_light"] = <IOmniLight>pScene.createLightPoint(ELightTypes.OMNI, false);
			pGroundLight.attachToParent(pModelTable);
			pGroundLight.setInheritance(ENodeInheritance.ALL);
			pGroundLight.restrictLight(true, geometry.Rect3d.temp(Vec3.temp(-1, 0, -1), Vec3.temp(1, .25, 1)));
			pGroundLight.setPosition(0., 0., 0.);
			pGroundLight.getParams().attenuation.set(.7, .2, 0.);
			pGroundLight.getParams().diffuse.set(color.LIGHT_BLUE);
			pGroundLight.getParams().specular.set(color.LIGHT_BLUE);
		}

		createSceneLights();

		var pModelTableSubset = pModelTable.getMesh().getSubset(0);

		var pMat: IMaterial = pModelTableSubset.getMaterial();
		pMat.diffuse.set("#525252");
		pMat.specular.set("#878787");
		pMat.shininess = 0.871;

		pModelTableSubset.getTechnique().render.connect((pTech: IRenderTechnique, iPass, pRenderable, pSceneObject, pLocalViewport) => {
			pTech.getPass(iPass).setTexture("MIRROR_TEXTURE", pReflectionTexture);
			pTech.getPass(iPass).setForeign("IS_USED_MIRROR_REFLECTION", true);
		});

		var iCylinderHeight = .025;
		var pCylinder = addons.cylinder(pScene, iTableRadius, iTableRadius, iCylinderHeight, 96, 1.);
		pCylinder.setInheritance(ENodeInheritance.ALL);
		pCylinder.attachToParent(pModelTable);
		pCylinder.setPosition(0., -iCylinderHeight / 2, 0.);
		var pCylinderSubset = pCylinder.getMesh().getSubset(0);
		pCylinderSubset.getMaterial().shininess = 0.7;
		//pCylinderSubset.getSurfaceMaterial().setMaterial(pPlasticMaterial);
		var pMat: IMaterial = pCylinderSubset.getMaterial();
		pMat.emissive.set("#00ff00");
		pMat.diffuse.set("#000000");
		pMat.specular.set("#6e6e6e");
		pMat.shininess = 0.;

		var pSurface = addons.createQuad(pScene, 100, Vec2.temp(100));
		pSurface.attachToParent(pScene.getRootNode());
		pSurface.setPosition(0., iTableHeight - iCylinderHeight, 0.);
		//pSurface.getMesh().getSubset(0).switchRenderMethod(null);
		pSurface.getMesh().getSubset(0).getSurfaceMaterial().setTexture(ESurfaceMaterialTextures.DIFFUSE, "GRID.PNG", 0);
		//pSurface.getMesh().getSubset(0).getSurfaceMaterial().setTexture(ESurfaceMaterialTextures.EMISSIVE, "GRID.PNG", 0);

		
		pSurface.getMesh().getSubset(0).getMaterial().diffuse.set(0, .0001);
		pSurface.getMesh().getSubset(0).getMaterial().transparency = 0.99;
		pSurface.getMesh().getSubset(0).getMaterial().emissive.set(0., 0.1, 0., 0.);
		
		var pGridTexture = pRmgr.getTexturePool().findResource("GRID.PNG");
		pGridTexture.setWrapMode(ETextureParameters.WRAP_S, ETextureWrapModes.REPEAT);
		pGridTexture.setWrapMode(ETextureParameters.WRAP_T, ETextureWrapModes.REPEAT);

		pGridTexture.setFilter(ETextureParameters.MIN_FILTER, ETextureFilters.LINEAR);
		pGridTexture.setFilter(ETextureParameters.MAG_FILTER, ETextureFilters.LINEAR);
		

		window["grid"] = pGridTexture;
		window["surface"] = pSurface.getMesh().getSubset(0);

		//var pPodiumLight: IOmniLight = window["podium_light"] = <IOmniLight>pScene.createLightPoint(ELightTypes.OMNI, false);
		//pPodiumLight.attachToParent(pSurface);
		//pPodiumLight.setPosition(0., 0.025 / 2, .0);
		//var fGroundLightRadius: float = iTableRadius + 1.
		//pPodiumLight.restrictLight(true, geometry.Rect3d.temp(-fGroundLightRadius, fGroundLightRadius, -1, 0.025 / 2, -fGroundLightRadius, fGroundLightRadius));
		//pPodiumLight.getParams().attenuation.x = .001;
		//pPodiumLight.getParams().diffuse.set(color.LIGHT_GREEN);

		var pLightMap = window["light_map"] = addons.createQuad(pScene);
		pLightMap.attachToParent(pSurface);
		pLightMap.setPosition(0., 1e-3, 0);
		pLightMap.getMesh().setShadow(false);
		pLightMap.getMesh().getSubset(0).getSurfaceMaterial().setTexture(0, "LIGHTMAP.PNG", ESurfaceMaterialTextures.DIFFUSE);
		pLightMap.getMesh().getSubset(0).getSurfaceMaterial().texture(0).setFilter(ETextureParameters.MAG_FILTER, ETextureFilters.LINEAR);
		pLightMap.getMesh().getSubset(0).getSurfaceMaterial().texture(0).setFilter(ETextureParameters.MIN_FILTER, ETextureFilters.LINEAR);
		pLightMap.setLocalScale(Vec3.temp(pViewport.getType() === EViewportTypes.FORWARDVIEWPORT? 0.1795: 0.1865));
		pLightMap.getMesh().getSubset(0).getMaterial().emissive.set(.3, 1., .3, 0.);
		pLightMap.getMesh().getSubset(0).getMaterial().diffuse.set(0., 0., 0., 0.);
		pLightMap.getMesh().getSubset(0).getMaterial().specular.set(0., 0., 0., 0.);
		pLightMap.getMesh().getSubset(0).getMaterial().ambient.set(0., 0., 0., 0.);
		pLightMap.getMesh().getSubset(0).getMaterial().transparency = 0.99;

		if (config.DEBUG) {
			pGUI.add({ glow: true }, "glow").onChange((bValue) => {
				pLightMap.getRenderable(0).setVisible(bValue);
			});
		}

		
		//var pSurfMat = pSurface.getMesh().getSubset(0).getSurfaceMaterial().setMaterial(pPlasticMaterial);
		//var pMat: IMaterial = pSurface.getMesh().getSubset(0).getMaterial();
		//pMat.emissive.set("#000000");
		//pMat.diffuse.set("#464646");
		//pMat.specular.set("#0f0f0f");
		//pMat.shininess = 0.386;

		var pMercedes: ISceneNode = pScene.createNode("mercedes");
		var pModel: ICollada = <ICollada>pEngine.getResourceManager().loadModel("MERCEDES.DAE");

		pMercedes.setInheritance(ENodeInheritance.ROTPOSITION);
		pModel.attachToScene(pMercedes);

		pMercedes.attachToParent(pModelTable);

		pMirror.attachToParent(pModelTable);
		pMirror.setPosition(0., 0., 0.);

		if (config.DEBUG) {

			setupMaterialPicking(<ILPPViewport>pViewport, (<pool.resources.Collada>pModel).extractUsedMaterials());

			pGUI.add({
				"save": () => {
					saveAs((<pool.resources.Collada>pModel).toBlob(), "mercedes.DAE");
				}
			}, "save");

			pGUI.add({
				"save materials": () => {
					var pMaterials: IMaterial[] = (<pool.resources.Collada>pModel).extractUsedMaterials();
					var pExporter: exchange.Exporter = new exchange.Exporter();

					pMaterials.forEach((pMat) => {
						pExporter.writeMaterial(pMat);
					});

					pExporter.saveAs(prompt("enter skin name", "unknown") + ".skin", EDocumentFormat.JSON);
				}
			}, "save materials");

		}

		pCanvas.viewportPreUpdate.connect((pTarget: IRenderTarget, pInputViewport: IViewport) => {
			if (pInputViewport === pViewport) {
				var normal = pMirror.getTempVectorUp();
				var dist = pMirror.getWorldPosition().dot(normal);
				(<IMirrorViewport>pReflectionViewport).getReflectionPlane().set(normal, dist);
				if (pMirror.getTempVectorUp().dot(math.Vec3.temp(pCamera.getWorldPosition()).subtract(pMirror.getWorldPosition())) > 0.) {
					pReflectionTexture.getBuffer().getRenderTarget().update();
				}
			}
		});

		function applySkin(pSkin: IMercedesSkin): void {
			var pUsedMaterials = (<pool.resources.Collada>pModel).extractUsedMaterials();

			pUsedMaterials.forEach((pMat, i) => {
				if (pSkin.data[pMat.name]) {
					pMat.set(pSkin.data[pMat.name]);
				}
			});
		}

		if (config.DEBUG) {
			addons.filedrop.addHandler(document.body, {
				drop: <any>((pFile: File, sContent: string, eFormat: EFileDataTypes, e: DragEvent): void => {
					var pImporter: exchange.Importer = new exchange.Importer(pEngine);
					pImporter.import(sContent, EDocumentFormat.JSON);
					
					applySkin({ name: "unknown", data: pImporter.getMaterials(), intensity: 0 });
				}),
				verify: (pFile: File, e: DragEvent): boolean => {
					return path.parse(pFile.name).getExt() === "skin";
				}
			});
		};

		

		var pSkins: IMercedesSkin[] = [];

		var pImporter: exchange.Importer = new exchange.Importer(pEngine);
		Object.keys(pSkinData).forEach((sSkinName: string) => {
			pImporter.import(pSkinData[sSkinName], EDocumentFormat.JSON);

			var pSkin: IMercedesSkin = { data: pImporter.getMaterials(), name: sSkinName, intensity: 0 };

			pSkin.intensity = pSkin.data["body_paint"].diffuse.getHSB()[1];

			pSkins.push(pSkin);

			pImporter.clear();

			if (sSkinName === "default") {
				applySkin(pSkin);
			}
		});

		pSkins.sort((a: IMercedesSkin, b: IMercedesSkin): int => {
			return a.intensity > b.intensity ? 1 : -1;
		});


		if (config.DEBUG) {
			pGUI.add({ skin: null }, "skin", Object.keys(pSkins)).onChange((sName: string) => { applySkin(pSkins[sName]); });
		}

		function createSkinTable() {
			var pTable = document.createElement("table");
			pTable.className = "skins";

			var pCaption = document.createElement("caption");
			pCaption.textContent = "COLOR";
			pTable.appendChild(pCaption);
			

			pSkins.forEach((pSkin) => {
				var sColor = pSkin.data["body_paint"].diffuse.getHtml();;
				
				var pTr = document.createElement("tr");
				var pTdColor = document.createElement("td");
				pTdColor.style.backgroundColor = sColor;
				pTdColor.style.boxShadow = "0 0 2px " + sColor;
				var pTdName = document.createElement("td");
				pTdName.textContent = pSkin.name;
				pTr.appendChild(pTdColor);
				pTr.appendChild(pTdName);
				
				pTable.appendChild(pTr);

				pTr.onclick = () => {
					applySkin(pSkin);
				};
			});

			document.body.appendChild(pTable);
		};

		pPilotNode = pScene.createNode("pilot-node");
		pPilotNode.setInheritance(ENodeInheritance.ALL);
		pPilotNode.attachToParent(<ISceneNode>pScene.getRootNode().findEntity("node-chassis"));
		pPilotNode.setPosition(-.5, .5, .5);
		animateCameras();


		createSkinTable();

		pProgress.destroy();
		pEngine.exec();

		cameraRotationCallback(pViewport, EMouseButton.LEFT, 0, 0, 0, 0);

		//console.profileEnd();
	}

	pEngine.depsLoaded.connect(main);
}
