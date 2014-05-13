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
		//premultipliedAlpha: false,
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

	function createViewport(): I3DViewport {
		var pViewport: ILPPViewport = new render.DSViewport(pCamera);
		pCanvas.addViewport(pViewport);
		pCanvas.resize(window.innerWidth, window.innerHeight);

        pViewport.getEffect().addComponent("akra.system.linearFog");
        pViewport.getEffect().addComponent("akra.system.exponentialFog");
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
                (<I3DViewport>pViewport).setShadingModel(EShadingModel.PBS_SIMPLE);
            }
            else {
                (<I3DViewport>pViewport).setShadingModel(EShadingModel.BLINNPHONG);
            }

            });
		var bFresnelTexture;
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

        (<I3DViewport>pViewport).setShadingModel(EShadingModel.PBS_SIMPLE);

		pViewport.render.connect((pViewport: IViewport, pTechnique: IRenderTechnique,
			iPass: uint, pRenderable: IRenderableObject, pSceneObject: ISceneObject) => {

			var pDeferredTexture: ITexture = (<I3DViewport>pViewport).getTextureWithObjectID();
			var pDepthTexture: ITexture = (<render.LPPViewport>pViewport).getDepthTexture();
			var pPass: IRenderPass = pTechnique.getPass(iPass);

			var v3fLightDir: IVec3 = math.Vec3.temp( math.Vec3.temp(pLight.getWorldPosition()).subtract(pCamera.getWorldPosition()).normalize() );
			var pLightInDeviceSpace: IVec3 = math.Vec3.temp();
			pCamera.projectPoint(math.Vec3.temp(pCamera.getWorldPosition()).add(v3fLightDir), pLightInDeviceSpace);

			if (iPass == 0) {
				//pPass.setForeign('IS_USE_PBS_SIMPLE', pPBSData.isUsePBS ? 2 : 1 );
				//pPass.setUniform('PBS_F0', pPBSData._Material._F0);
				//pPass.setUniform('PBS_DIFFUSE', pPBSData._Material._Diffuse);
			}

			pLightInDeviceSpace.x = (pLightInDeviceSpace.x + 1) / 2;
			pLightInDeviceSpace.y = (pLightInDeviceSpace.y + 1) / 2;

			pPass.setTexture('CUBETEXTURE0', pSkyboxTexture);
			pPass.setTexture('FRESNEL_TEXTURE', pFresnelTexture);
			pPass.setUniform("USE_FRESNEL_TEXTURE", bFresnelTexture);

			pPass.setUniform("PHYSICAL_SPEC_G", iPbsSpecG);
			pPass.setForeign("PhysicalSpecG", iPbsSpecG);
			pPass.setUniform("PHYSICAL_DIFFUSE", iPbsDiffuse);
			pPass.setForeign("PhysicalDiffuse", iPbsDiffuse);
			pPass.setUniform("PHYSICAL_SPEC_D", iPbsSpecD);
			pPass.setForeign("PhysicalSpecD", iPbsSpecD);
			pPass.setUniform("PHYSICAL_SPEC_F", iPbsSpecF);
			pPass.setForeign("PhysicalSpecF", iPbsSpecF);

            pPass.setForeign("USE_LINEAR_FOG", false);
            pPass.setForeign("USE_EXPONENTIAL_FOG", true);

			pPass.setUniform("SCREEN_ASPECT_RATIO",
				math.Vec2.temp(pViewport.getActualWidth() / pViewport.getActualHeight(), 1.));


		});
		return pViewport;
	}

	var lightPos1: math.Vec3 = new math.Vec3(0, 11.5, 16);
	var lightPos2: math.Vec3 = new math.Vec3(0, 6, 16);
	var lightPos3: math.Vec3 = new math.Vec3(0, 3, 16);
	var lightPos4: math.Vec3 = new math.Vec3(0, -6, 16);
	var lightDiffColor: color.Color = new Color(0.2, 0.2, 0.2, 1.0);
	var lightDiffColor2: color.Color = new Color(0.02, 0.02, 0.02, 1.0);

    var orbitalAngSpeed: float = 0.001

	export var pLight: IOmniLight = null;
	function createLighting(): void {
		var pOmniLight: IOmniLight;

		pOmniLight = <IOmniLight>pScene.createLightPoint(ELightTypes.OMNI, false, 512, "test-omni-0");
		pOmniLight.attachToParent(pScene.getRootNode());
		pOmniLight.setEnabled(true);
		pOmniLight.getParams().ambient.set(0);
		pOmniLight.getParams().diffuse.set(lightDiffColor);
		pOmniLight.getParams().specular.set(lightDiffColor);
		pOmniLight.getParams().attenuation.set(1, 0, 0.01);
		pOmniLight.setShadowCaster(false);
		pOmniLight.addPosition(lightPos1);

		pOmniLight = <IOmniLight>pScene.createLightPoint(ELightTypes.OMNI, false, 512, "test-omni-0");
		pOmniLight.attachToParent(pScene.getRootNode());
		pOmniLight.setEnabled(true);
		pOmniLight.getParams().ambient.set(0);
		pOmniLight.getParams().diffuse.set(lightDiffColor);
		pOmniLight.getParams().specular.set(lightDiffColor);
		pOmniLight.getParams().attenuation.set(1, 0, 0.01);
		pOmniLight.setShadowCaster(false);
		pOmniLight.addPosition(lightPos2);

		pOmniLight = <IOmniLight>pScene.createLightPoint(ELightTypes.OMNI, false, 512, "test-omni-0");
		pOmniLight.attachToParent(pScene.getRootNode());
		pOmniLight.setEnabled(true);
		pOmniLight.getParams().ambient.set(0);
		pOmniLight.getParams().diffuse.set(lightDiffColor);
		pOmniLight.getParams().specular.set(lightDiffColor);
		pOmniLight.getParams().attenuation.set(1, 0, 0.01);
		pOmniLight.setShadowCaster(false);
		pOmniLight.addPosition(lightPos3);

		pOmniLight = <IOmniLight>pScene.createLightPoint(ELightTypes.OMNI, false, 512, "test-omni-0");
		pOmniLight.attachToParent(pScene.getRootNode());
		pOmniLight.setEnabled(true);
		pOmniLight.getParams().ambient.set(0);
		pOmniLight.getParams().diffuse.set(lightDiffColor);
		pOmniLight.getParams().specular.set(lightDiffColor);
		pOmniLight.getParams().attenuation.set(1, 0, 0.01);
		pOmniLight.setShadowCaster(false);
		pOmniLight.addPosition(lightPos4);
        
        var nd = pScene.createNode();
        nd.attachToParent(pScene.getRootNode());
        nd.setPosition(0., 6., 20.);

        var pOmniLight1 = <IOmniLight>pScene.createLightPoint(ELightTypes.OMNI, false, 512, "test-omni-0");
        pOmniLight1.attachToParent(nd);
        pOmniLight1.setEnabled(true);
        pOmniLight1.getParams().ambient.set(0);
        pOmniLight1.getParams().diffuse.set(lightDiffColor);
        pOmniLight1.getParams().specular.set(lightDiffColor);
        pOmniLight1.getParams().attenuation.set(1, 0, 0.01);
        pOmniLight1.setShadowCaster(false);
        pOmniLight1.addRelPosition( 0, 0, -20 );
        pScene.beforeUpdate.connect(()=>{
                pOmniLight1.addOrbitRotationByEulerAngles(orbitalAngSpeed, 0, 0);
            })

        var pOmniLight2 = <IOmniLight>pScene.createLightPoint(ELightTypes.OMNI, false, 512, "test-omni-0");
        pOmniLight2.attachToParent(nd);
        pOmniLight2.setEnabled(true);
        pOmniLight2.getParams().ambient.set(0);
        pOmniLight2.getParams().diffuse.set(lightDiffColor);
        pOmniLight2.getParams().specular.set(lightDiffColor);
        pOmniLight2.getParams().attenuation.set(1, 0, 0.01);
        pOmniLight2.setShadowCaster(false);
        pOmniLight2.addRelPosition( 0, 0, 20 );
        pScene.beforeUpdate.connect(()=>{
                pOmniLight2.addOrbitRotationByEulerAngles(orbitalAngSpeed, 0, 0);
            })

        var pOmniLight3 = <IOmniLight>pScene.createLightPoint(ELightTypes.OMNI, false, 512, "test-omni-0");
        pOmniLight3.attachToParent(nd);
        pOmniLight3.setEnabled(true);
        pOmniLight3.getParams().ambient.set(0);
        pOmniLight3.getParams().diffuse.set(lightDiffColor);
        pOmniLight3.getParams().specular.set(lightDiffColor);
        pOmniLight3.getParams().attenuation.set(1, 0, 0.01);
        pOmniLight3.setShadowCaster(false);
        pOmniLight3.addRelPosition( 20, 0, 0 );
        pScene.beforeUpdate.connect(()=>{
                pOmniLight3.addOrbitRotationByEulerAngles(orbitalAngSpeed, 0, 0);
            })

        var pOmniLight4 = <IOmniLight>pScene.createLightPoint(ELightTypes.OMNI, false, 512, "test-omni-0");
        pOmniLight4.attachToParent(nd);
        pOmniLight4.setEnabled(true);
        pOmniLight4.getParams().ambient.set(0);
        pOmniLight4.getParams().diffuse.set(lightDiffColor);
        pOmniLight4.getParams().specular.set(lightDiffColor);
        pOmniLight4.getParams().attenuation.set(1, 0, 0.01);
        pOmniLight4.setShadowCaster(false);
        pOmniLight4.addRelPosition( -20, 0, 0 );
        pScene.beforeUpdate.connect(()=>{
                pOmniLight4.addOrbitRotationByEulerAngles(orbitalAngSpeed, 0, 0);
            })

        var pOmniLightLotList: IOmniLight[] = new Array(totalLightSources);
        for(var i=0; i<totalLightSources; i++) {
	        pOmniLightLotList[i] = <IOmniLight>pScene.createLightPoint(ELightTypes.OMNI, false, 512, "test-omni-0");
	        pOmniLightLotList[i].attachToParent(nd);
	        pOmniLightLotList[i].setEnabled(true);
	        pOmniLightLotList[i].getParams().ambient.set(0);
	        pOmniLightLotList[i].getParams().diffuse.set(lightDiffColor2);
	        pOmniLightLotList[i].getParams().specular.set(lightDiffColor2);
	        pOmniLightLotList[i].getParams().attenuation.set(1, 0, 0.01);
	        pOmniLightLotList[i].setShadowCaster(false);
	        pOmniLightLotList[i].addRelPosition( -18.0 + 36.0*i/totalLightSources, 0, 0 );
        };
        pScene.beforeUpdate.connect(()=>{
        	for(var i=0; i<totalLightSources; i++){
                pOmniLightLotList[i].addOrbitRotationByEulerAngles(
                	orbitalAngSpeed * 5 * Math.abs(i-totalLightSources/2)/totalLightSources, 0, 0);
            }
        })

		pLight = pOmniLight;
	}

	function createSky(): void {
		pSky = new model.Sky(pEngine, 32, 32, 1000.0);
		pSky.setTime(15.);

		pSky.sun.setShadowCaster(false);

		var pSceneModel: ISceneModel = pSky.skyDome;
		pSceneModel.attachToParent(pScene.getRootNode());
	}

	function createTextureFresnel(iWidth: uint, iHeight: uint): void {
		pFresnelTexture = pRmgr.createTexture("fresnel_texture" + guid());
		pFresnelTexture.create(iWidth, iHeight, 1, null, ETextureFlags.RENDERTARGET, 0, 0, ETextureTypes.TEXTURE_2D, EPixelFormats.FLOAT32_R);

		var pRenderTarget: IRenderTarget = pFresnelTexture.getBuffer().getRenderTarget();
		pRenderTarget.setAutoUpdated(false);

		var pViewport: render.TextureViewport = <render.TextureViewport>pRenderTarget.addViewport(new render.TextureViewport(null));
		pViewport.render.connect((pViewport: IViewport, pTechnique: IRenderTechnique,
			iPass: uint, pRenderable: IRenderableObject, pSceneObject: ISceneObject) => {

			var pPass: IRenderPass = pTechnique.getPass(iPass);

		});
		pViewport.getEffect().addComponent("precalculate_fresnel");

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

		(<I3DViewport>pViewport).setDefaultEnvironmentMap(pEnvTexture);
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

		//createSky();
		createLighting();

		createSkyBox();

		var x = 0;

		//LIGHT SOURCES MARKS:
		loadModel("SPHERE.DAE", 
		    (model)=>{
		        model.explore( function(node) {
		            if(akra.scene.SceneModel.isModel(node)) {
		                node.getMesh().getSubset(0).getMaterial().shininess=0.99;
		                node.getMesh().getSubset(0).getMaterial().specular=new Color(0.0, 0.0, 0.0, 1.0);
		                node.getMesh().getSubset(0).getMaterial().diffuse=new Color(0.0, 0.0, 0.0, 1.0);
                        node.getMesh().getSubset(0).getMaterial().emissive =new Color(0.9, 0.9, 0.9, 1.);
		                }
		            });
		        }, 'sphere-light-00', pScene.getRootNode()).scale(0.5).addRelPosition( lightPos1 );
		loadModel("SPHERE.DAE", 
		    (model)=>{
		        model.explore( function(node) {
		            if(akra.scene.SceneModel.isModel(node)) {
		                node.getMesh().getSubset(0).getMaterial().shininess=0.99;
		                node.getMesh().getSubset(0).getMaterial().specular=new Color(0.0, 0.0, 0.0, 1.0);
		                node.getMesh().getSubset(0).getMaterial().diffuse=new Color(0.0, 0.0, 0.0, 1.0);
                        node.getMesh().getSubset(0).getMaterial().emissive =new Color(0.9, 0.9, 0.9, 1.);
		                }
		            });
		        }, 'sphere-light-01', pScene.getRootNode()).scale(0.5).addRelPosition( lightPos2 );
		loadModel("SPHERE.DAE", 
		    (model)=>{
		        model.explore( function(node) {
		            if(akra.scene.SceneModel.isModel(node)) {
		                node.getMesh().getSubset(0).getMaterial().shininess=0.99;
		                node.getMesh().getSubset(0).getMaterial().specular=new Color(0.0, 0.0, 0.0, 1.0);
		                node.getMesh().getSubset(0).getMaterial().diffuse=new Color(0.0, 0.0, 0.0, 1.0);
                        node.getMesh().getSubset(0).getMaterial().emissive =new Color(0.9, 0.9, 0.9, 1.);
		                }
		            });
		        }, 'sphere-light-02', pScene.getRootNode()).scale(0.5).addRelPosition( lightPos3 );
        loadModel("SPHERE.DAE", 
            (model)=>{
                model.explore( function(node) {
                    if(akra.scene.SceneModel.isModel(node)) {
                        node.getMesh().getSubset(0).getMaterial().shininess=0.99;
                        node.getMesh().getSubset(0).getMaterial().specular=new Color(0.0, 0.0, 0.0, 1.0);
                        node.getMesh().getSubset(0).getMaterial().diffuse=new Color(0.0, 0.0, 0.0, 1.0);
                        node.getMesh().getSubset(0).getMaterial().emissive =new Color(0.9, 0.9, 0.9, 1.);
                        }
                    });
                }, 'sphere-light-022', pScene.getRootNode()).scale(0.5).addRelPosition( lightPos4 );

        // Moving light sources marks
        var nd = pScene.createNode();
        nd.attachToParent(pScene.getRootNode());
        nd.setPosition(0., 6., 20.);

        var pSphere1 = loadModel("SPHERE.DAE", 
            (model)=>{
                model.explore( function(node) {
                    if(akra.scene.SceneModel.isModel(node)) {
                        node.getMesh().getSubset(0).getMaterial().shininess=0.99;
                        node.getMesh().getSubset(0).getMaterial().specular=new Color(0.0, 0.0, 0.0, 1.0);
                        node.getMesh().getSubset(0).getMaterial().diffuse=new Color(0.0, 0.0, 0.0, 1.0);
                        node.getMesh().getSubset(0).getMaterial().emissive =new Color(0.9, 0.9, 0.9, 1.);
                        }
                    });
                }, 'sphere-light-03', nd).scale(0.5).addRelPosition( 0, 0, -20 );
        pScene.beforeUpdate.connect(()=>{
                pSphere1.addOrbitRotationByEulerAngles(orbitalAngSpeed, 0, 0);
            })
        var pSphere2 = loadModel("SPHERE.DAE", 
            (model)=>{
                model.explore( function(node) {
                    if(akra.scene.SceneModel.isModel(node)) {
                        node.getMesh().getSubset(0).getMaterial().shininess=0.99;
                        node.getMesh().getSubset(0).getMaterial().specular=new Color(0.0, 0.0, 0.0, 1.0);
                        node.getMesh().getSubset(0).getMaterial().diffuse=new Color(0.0, 0.0, 0.0, 1.0);
                        node.getMesh().getSubset(0).getMaterial().emissive =new Color(0.9, 0.9, 0.9, 1.);
                        }
                    });
                }, 'sphere-light-04', nd).scale(0.5).addRelPosition( 0, 0, 20 );
        pScene.beforeUpdate.connect(()=>{
                pSphere2.addOrbitRotationByEulerAngles(orbitalAngSpeed, 0, 0);
            })
        var pSphere3 = loadModel("SPHERE.DAE", 
            (model)=>{
                model.explore( function(node) {
                    if(akra.scene.SceneModel.isModel(node)) {
                        node.getMesh().getSubset(0).getMaterial().shininess=0.99;
                        node.getMesh().getSubset(0).getMaterial().specular=new Color(0.0, 0.0, 0.0, 1.0);
                        node.getMesh().getSubset(0).getMaterial().diffuse=new Color(0.0, 0.0, 0.0, 1.0);
                        node.getMesh().getSubset(0).getMaterial().emissive =new Color(0.9, 0.9, 0.9, 1.);
                        }
                    });
                }, 'sphere-light-05', nd).scale(0.5).addRelPosition( 20, 0, 0 );
        pScene.beforeUpdate.connect(()=>{
                pSphere3.addOrbitRotationByEulerAngles(orbitalAngSpeed, 0, 0);
            })
        var pSphere4 = loadModel("SPHERE.DAE", 
            (model)=>{
                model.explore( function(node) {
                    if(akra.scene.SceneModel.isModel(node)) {
                        node.getMesh().getSubset(0).getMaterial().shininess=0.99;
                        node.getMesh().getSubset(0).getMaterial().specular=new Color(0.0, 0.0, 0.0, 1.0);
                        node.getMesh().getSubset(0).getMaterial().diffuse=new Color(0.0, 0.0, 0.0, 1.0);
                        node.getMesh().getSubset(0).getMaterial().emissive =new Color(0.9, 0.9, 0.9, 1.);
                        }
                    });
                }, 'sphere-light-06', nd).scale(0.5).addRelPosition( -20, 0, 0 );
        pScene.beforeUpdate.connect(()=>{
                pSphere4.addOrbitRotationByEulerAngles(orbitalAngSpeed, 0, 0);
            })

        var pOmniLightPList: INode[] = new Array(totalLightSources);
        for(var i=0; i<totalLightSources; i++) {
	        pOmniLightPList[i] = loadModel("SPHERE.DAE", 
	            (model)=>{
	                model.explore( function(node) {
	                    if(akra.scene.SceneModel.isModel(node)) {
	                        node.getMesh().getSubset(0).getMaterial().shininess=0.99;
	                        node.getMesh().getSubset(0).getMaterial().specular=new Color(0.0, 0.0, 0.0, 1.0);
	                        node.getMesh().getSubset(0).getMaterial().diffuse=new Color(0.0, 0.0, 0.0, 1.0);
	                        node.getMesh().getSubset(0).getMaterial().emissive =new Color(0.9, 0.9, 0.9, 1.);
	                        }
	                    });
	                }, 'sphere-light-p'+i, nd).scale(0.2).addRelPosition( -18.0 + 36.0*i/totalLightSources, 0, 0 );
        };
        pScene.beforeUpdate.connect(()=>{
        	for(var i=0; i<totalLightSources; i++){
                pOmniLightPList[i].addOrbitRotationByEulerAngles(
                	orbitalAngSpeed * 5 * Math.abs(i-totalLightSources/2)/totalLightSources, 0, 0);
            }
        })


		function calcShi(i: uint, max: uint) {
			return Math.min(Math.max(1.0 - i / max, 0.001), 0.999);
		}


		// GOLDEN TEAPOTS: first row
        for(var i=0; i<5; i++) {
			loadModel("TEAPOT.DAE",
				(model)=>{
					model.explore( function(node) {
						if(akra.scene.SceneModel.isModel(node)) {
							node.getMesh().getSubset(0).getMaterial().shininess=calcShi(i, 5);
							node.getMesh().getSubset(0).getMaterial().specular=teapotSpecular;
							node.getMesh().getSubset(0).getMaterial().diffuse=teapotDiffuse;
							node.getMesh().getSubset(0).getMaterial().emissive=new Color(0.0, 0.0, 0.0, 0.0);
							}
						});
					}, 'teapot-'+i.toString(), pScene.getRootNode()).scale(3.0).addRelPosition(-12.0 + 6.0 * i, 8.0, 20.0);
        };

		// SILVER BALLS: second row
		var ballDistance: float = 10.0; // distance between balls
		var silverColorSpecular: color.Color = new Color(0.95, 0.93, 0.88, 1.0);
		var silverColorDiffuse: color.Color = new Color(0.98, 0.97, 0.95, 1.0);
		var totalBalls: float = 10;
        for(var i=0; i<totalBalls; i++) {
			loadModel("SPHERE.DAE", 
				(model)=>{
					model.explore( function(node) {
						if(akra.scene.SceneModel.isModel(node)) {
							node.getMesh().getSubset(0).getMaterial().shininess=calcShi(i, totalBalls);
							node.getMesh().getSubset(0).getMaterial().specular=silverColorSpecular;
							node.getMesh().getSubset(0).getMaterial().diffuse=silverColorDiffuse;
							}
						});
					}, 'sphere-metal-'+i, pScene.getRootNode()).scale(2.5).addRelPosition(ballDistance*(i-(totalBalls-1)/2), 4.0, 20.0);
        };

		// PLASTIC BALLS: third row
		var plasticColorSpecular: color.Color = new Color(0.05, 0.05, 0.05, 1.0);
		var plasticColorDiffuse: color.Color = new Color(0.21, 0.21, 0.21, 1.0);
        for(var i=0; i<totalBalls; i++) {
			loadModel("SPHERE.DAE",  
				(model)=>{
					model.explore( function(node) {
						if(akra.scene.SceneModel.isModel(node)) {
							node.getMesh().getSubset(0).getMaterial().shininess=calcShi(i, totalBalls);
							node.getMesh().getSubset(0).getMaterial().specular=plasticColorSpecular;
							node.getMesh().getSubset(0).getMaterial().diffuse=plasticColorDiffuse;
							}
						});
					}, 'sphere-diel-00', pScene.getRootNode()).scale(2.5).addRelPosition(ballDistance*(i-(totalBalls-1)/2), 0.0, 20.0);
        };

        // OIL THING
		var pOil = loadModel("OIL.DAE", null, 'oil-00', pScene.getRootNode()).scale(5.0).addRelPosition( 0., -5., 20. );
		pScene.beforeUpdate.connect(()=>{
				pOil.addRotationByXYZAxis(0., 0.01, 0.);
			})

		pProgress.destroy();
		pEngine.exec();

		//animateTimeOfDay();
	}

	pEngine.depsLoaded.connect(main);
}