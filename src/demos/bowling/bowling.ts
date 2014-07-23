/// <reference path="../../../built/Lib/akra.d.ts" />
/// <reference path="../../../built/Lib/base3dObjects.addon.d.ts" />
/// <reference path="../../../built/Lib/progress.addon.d.ts" />
/// <reference path="../../../built/Lib/compatibility.addon.d.ts" />

/// <reference path="../std/std.ts" />

/// <reference path="../idl/3d-party/dat.gui.d.ts" />
/// <reference path="../idl/3d-party/ammo.d.ts" />

declare var AE_RESOURCES: akra.IDep;
declare var AE_MODELS: any;

module akra {

	addons.compatibility.requireWebGLExtension(webgl.WEBGL_COMPRESSED_TEXTURE_S3TC);
	addons.compatibility.verify("non-compatible");

	export var modelsPath = path.parse((AE_MODELS.content).split(';')[0]).getDirName() + '/';

	var pProgress = new addons.Progress(document.getElementById("progress"));

	var pRenderOpts: IRendererOptions = {
		premultipliedAlpha: false,
		preserveDrawingBuffer: true,
		depth: true,
		antialias: true
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
	export var pSkyboxTexture: ITexture = null;
	export var pSkyboxTextures: IMap<ITexture> = null;
	export var pEnvTexture = null;
	export var pDepthViewport = null;
	export var pModelsFiles = null;
	export var pFireTexture: ITexture = null;
	export var applyAlphaTest = null;
	export var bFPSCameraControls: boolean = false;
	export var AmmoInst: any = Ammo;

	export var pCameraParams = {
		current: {
			orbitRadius: 4.2,
			rotation: new math.Vec2(0., 0.)
		},
		target: {
			orbitRadius: 7.2,
			rotation: new math.Vec2(2.6, 0.3)
		}
	}
	export var pCameraFPSParams = {
		current: {
			position: new math.Vec3(),
			rotation: new math.Vec2(0., 0.)
		},
		target: {
			position: new math.Vec3(),
			rotation: new math.Vec2(0., 0.)
		}
	}

	export var pModels = null;
	export var pCurrentModel = null;
	export var pPhysObjects = null;
	export var pPhysics = null;

	function createCamera(): ICamera {
		var pCamera: ICamera = pScene.createCamera();

		pCamera.attachToParent(pScene.getRootNode());
		pCamera.setPosition(Vec3.temp(0., 0., 4.2));

		pCamera.update();

		return pCamera;
	}

	function animateCameras(): void {
		pScene.beforeUpdate.connect(() => {
			pCamera.update();
			if(bFPSCameraControls) {
				var newRot: IVec2 = math.Vec2.temp(pCameraFPSParams.current.rotation).add(math.Vec2.temp(pCameraFPSParams.target.rotation).subtract(pCameraFPSParams.current.rotation).scale(0.15));
				var newPos: IVec3 = math.Vec3.temp(pCameraFPSParams.current.position).add(math.Vec3.temp(pCameraFPSParams.target.position).subtract(pCameraFPSParams.current.position).scale(0.03));

				pCameraFPSParams.current.rotation.set(newRot);
				pCameraFPSParams.current.position.set(newPos);
				pCamera.setPosition(newPos);
				pCamera.setRotationByEulerAngles(-newRot.x,-newRot.y,0.);
			}
			else {
				var newRot = math.Vec2.temp(pCameraParams.current.rotation).add(math.Vec2.temp(pCameraParams.target.rotation).subtract(pCameraParams.current.rotation).scale(0.15));
				var newRad = pCameraParams.current.orbitRadius * (1. + (pCameraParams.target.orbitRadius - pCameraParams.current.orbitRadius) * 0.03);

				pCameraParams.current.rotation.set(newRot);
				pCameraParams.current.orbitRadius = newRad;
				pCamera.setPosition(
					newRad * -math.sin(newRot.x) * math.cos(newRot.y),
					newRad * math.sin(newRot.y),
					newRad * math.cos(newRot.x) * math.cos(newRot.y));
				pCamera.lookAt(math.Vec3.temp(0, 0, 0));
			}

			pCamera.update();
		});
	}

	function createKeymap(pCamera: ICamera): void {
		var pKeymap: IKeyMap = control.createKeymap();
		pKeymap.captureMouse((<any>pCanvas).getElement());
		pKeymap.captureKeyboard(document);

		pScene.beforeUpdate.connect(() => {
			if (pKeymap.isMousePress()) {
				if (pKeymap.isMouseMoved()) {
					var v2fMouseShift: IOffset = pKeymap.getMouseShift();

					if(bFPSCameraControls) {
						pCameraFPSParams.target.rotation.y = math.clamp(pCameraFPSParams.target.rotation.y + v2fMouseShift.y / pViewport.getActualHeight() * 4., -1.2, 1.2);
						pCameraFPSParams.target.rotation.x += v2fMouseShift.x / pViewport.getActualHeight() * 4.;
					}
					else {
						pCameraParams.target.rotation.y = math.clamp(pCameraParams.target.rotation.y + v2fMouseShift.y / pViewport.getActualHeight() * 2., -0.7, 1.2);
						pCameraParams.target.rotation.x += v2fMouseShift.x / pViewport.getActualHeight() * 2.;
					}
					pKeymap.update();
				}

			}
			var fSpeed: float = 0.1 * 3;
			if (pKeymap.isKeyPress(EKeyCodes.W)) {
				// pCamera.addRelPosition(0, 0, -fSpeed);
				if(bFPSCameraControls) {
					pCameraFPSParams.target.position.add(pCamera.getTempVectorForward().scale(-fSpeed));
				}
			}
			if (pKeymap.isKeyPress(EKeyCodes.S)) {
				// pCamera.addRelPosition(0, 0, fSpeed);
				if(bFPSCameraControls) {
					pCameraFPSParams.target.position.add(pCamera.getTempVectorForward().scale(fSpeed));
				}
			}
			if (pKeymap.isKeyPress(EKeyCodes.A) || pKeymap.isKeyPress(EKeyCodes.LEFT)) {
				// pCamera.addRelPosition(-fSpeed, 0, 0);
				if(bFPSCameraControls) {
					pCameraFPSParams.target.position.add(pCamera.getTempVectorRight().scale(fSpeed));
				}
			}
			if (pKeymap.isKeyPress(EKeyCodes.D) || pKeymap.isKeyPress(EKeyCodes.RIGHT)) {
				// pCamera.addRelPosition(fSpeed, 0, 0);
				if(bFPSCameraControls) {
					pCameraFPSParams.target.position.add(pCamera.getTempVectorRight().scale(-fSpeed));
				}
			}
			if (pKeymap.isKeyPress(EKeyCodes.UP)) {
				// pCamera.addRelPosition(0, fSpeed, 0);
				if(bFPSCameraControls) {
					pCameraFPSParams.target.position.add(pCamera.getTempVectorUp().scale(fSpeed));
				}
			}
			if (pKeymap.isKeyPress(EKeyCodes.DOWN)) {
				// pCamera.addRelPosition(0, -fSpeed, 0);
				if(bFPSCameraControls) {
					pCameraFPSParams.target.position.add(pCamera.getTempVectorUp().scale(-fSpeed));
				}
			}
		});
		(<ILPPViewport>pViewport).enableSupportForUserEvent(EUserEvents.MOUSEWHEEL);
		pViewport.mousewheel.connect((pViewport, x: float, y: float, fDelta: float) => {
			//console.log("mousewheel moved: ",x,y,fDelta);
			if(bFPSCameraControls) {
				pCameraFPSParams.target.position.add(pCamera.getTempVectorForward().scale( -fDelta / pViewport.getActualHeight() ));
			}
			else {
				pCameraParams.target.orbitRadius = math.clamp(pCameraParams.target.orbitRadius - fDelta / pViewport.getActualHeight() * 2., 2., 15.);
			}
		});
	}

	var pGUI;

	function createViewport(): IViewport3D {

		var pViewport: ILPPViewport = new render.LPPViewport(pCamera, 0., 0., 1., 1., 11);

		pCanvas.addViewport(pViewport);
		pCanvas.resize(window.innerWidth, window.innerHeight);

		window.onresize = function (event) {
			pCanvas.resize(window.innerWidth, window.innerHeight);
		};

		(<render.LPPViewport>pViewport).setFXAA(true);
		var counter = 0;

		pGUI = new dat.GUI();

		var pSkyboxTexturesKeys = [
			'desert',
			'sunset',
		];
		pSkyboxTextures = {};
		for (var i = 0; i < pSkyboxTexturesKeys.length; i++) {

			var pTexture: ITexture = pSkyboxTextures[pSkyboxTexturesKeys[i]] = pRmgr.createTexture(".sky-box-texture-" + pSkyboxTexturesKeys[i]);

			pTexture.setFlags(ETextureFlags.AUTOMIPMAP);
			pTexture.loadResource("SKYBOX_" + pSkyboxTexturesKeys[i].toUpperCase());
			pTexture.setFilter(ETextureParameters.MAG_FILTER, ETextureFilters.LINEAR);
			pTexture.setFilter(ETextureParameters.MIN_FILTER, ETextureFilters.LINEAR);
		};

		
		pGUI.add({ fps_camera: bFPSCameraControls }, "fps_camera").onChange((bNewValue) => {
			if(!bFPSCameraControls) {
				pCameraFPSParams.current.rotation.set(pCameraParams.current.rotation);
				pCameraFPSParams.target.rotation.set(pCameraFPSParams.current.rotation);
				pCameraFPSParams.current.position.set(pCamera.getWorldPosition());
				pCameraFPSParams.target.position.set(pCameraFPSParams.current.position);
			}
			bFPSCameraControls = bNewValue;
		})

		var bAdvancedSkybox: boolean = true;
		var fSkyboxSharpness: float = .52;
		pGUI.add({ skybox_sharpness: fSkyboxSharpness }, "skybox_sharpness", 0., 1., 0.01).onChange((fValue) => {
			fSkyboxSharpness = fValue;
		})

		pGUI.add({ skybox_blur: bAdvancedSkybox }, "skybox_blur").onChange((bValue) => {
			bAdvancedSkybox = bValue;
		});

		var pPBSFolder = pGUI.addFolder("pbs");

		(<dat.OptionController>pPBSFolder.add({ Skybox: "desert" }, 'Skybox', pSkyboxTexturesKeys)).name("Skybox").onChange((sKey) => {
			// if (pViewport.getType() === EViewportTypes.LPPVIEWPORT) {
			(<ILPPViewport>pViewport).setSkybox(pSkyboxTextures[sKey]);
			// }
			(<ITexture>pEnvTexture).unwrapCubeTexture(pSkyboxTextures[sKey]);
		});

		(<ILPPViewport>pViewport).setShadingModel(EShadingModel.PBS_SIMPLE);

		pViewport.render.connect((pViewport: IViewport, pTechnique: IRenderTechnique,
			iPass: uint, pRenderable: IRenderableObject, pSceneObject: ISceneObject) => {
			var pPass: IRenderPass = pTechnique.getPass(iPass);
			var pDepthTexture: ITexture = (<ILPPViewport>pViewport).getDepthTexture();

			pPass.setUniform("SCREEN_ASPECT_RATIO",
				math.Vec2.temp(pViewport.getActualWidth() / pViewport.getActualHeight(), 1.));

			pPass.setUniform("SKYBOX_ADVANCED_SHARPNESS", fSkyboxSharpness);
			pPass.setTexture("SKYBOX_UNWRAPED_TEXTURE", pEnvTexture);
			pPass.setForeign("IS_USED_ADVANCED_SKYBOX", bAdvancedSkybox);
		});

		return pViewport;
	}

	var lightPos1: math.Vec3 = new math.Vec3(1, 2, 2);
	var lightPos2: math.Vec3 = new math.Vec3(-3, 2, -2);

	export var pOmniLights: INode = null;
	function createLighting(): void {
		pOmniLights = pScene.createNode('lights-root');
		pOmniLights.attachToParent(pScene.getRootNode());
		// pOmniLights.setInheritance(ENodeInheritance.ALL);

		var pOmniLight: IOmniLight;
		var pOmniLightSphere;

		pOmniLight = <IOmniLight>pScene.createLightPoint(ELightTypes.OMNI, true, 2048, "test-omni-0");

		pOmniLight.attachToParent(pOmniLights);
		pOmniLight.setEnabled(true);
		pOmniLight.getParams().ambient.set(0.0);
		pOmniLight.getParams().diffuse.set(1.0, 0.6, 0.3);
		pOmniLight.getParams().specular.set(1.0, 1.0, 1.0, 1.0);
		pOmniLight.getParams().attenuation.set(1, 0, 2);
		pOmniLight.setShadowCaster(true);
		pOmniLight.setInheritance(ENodeInheritance.ALL);
		pOmniLight.setPosition(lightPos1);
		pOmniLightSphere = loadModel(modelsPath + "/Sphere.DAE",
			(model) => {
				model.explore(function (node) {
					if (scene.SceneModel.isModel(node)) {
						node.getMesh().getSubset(0).getMaterial().diffuse = new Color(1.0, 0.6, 0.3);
						node.getMesh().getSubset(0).getMaterial().emissive = new Color(1.0, 0.6, 0.3);
					}
				})
				}, "test-omni-0-model", pOmniLight).scale(0.15);
		pOmniLightSphere.setPosition(0., 0., 0.);

		pOmniLight = <IOmniLight>pScene.createLightPoint(ELightTypes.OMNI, true, 512, "test-omni-1");

		pOmniLight.attachToParent(pOmniLights);
		pOmniLight.setEnabled(true);
		pOmniLight.getParams().ambient.set(0.0);
		pOmniLight.getParams().diffuse.set(0.3, 0.6, 1.0);
		pOmniLight.getParams().specular.set(1.0, 1.0, 1.0, 1.0);
		pOmniLight.getParams().attenuation.set(1, 0, 2);
		pOmniLight.setShadowCaster(false);
		pOmniLight.setInheritance(ENodeInheritance.ALL);
		pOmniLight.setPosition(lightPos2);
		pOmniLightSphere = loadModel(modelsPath + "/Sphere.DAE",
			(model) => {
				model.explore(function (node) {
					if (scene.SceneModel.isModel(node)) {
						node.getMesh().getSubset(0).getMaterial().diffuse = new Color(0.3, 0.6, 1.0);
						node.getMesh().getSubset(0).getMaterial().emissive = new Color(0.3, 0.6, 1.0);
					}
				})
				}, "test-omni-1-model", pOmniLight).scale(0.15);
		pOmniLightSphere.setPosition(0., 0., 0.);
	}

	function createSky(): void {
		pSky = new model.Sky(pEngine, 32, 32, 1000.0);
		pSky.setTime(15.);

		pSky.sun.setShadowCaster(false);

		var pSceneModel: ISceneModel = pSky.skyDome;
		pSceneModel.attachToParent(pScene.getRootNode());
	}

	function createSkyBox(): void {
		pSkyboxTexture = pSkyboxTextures['desert'];

		if (pViewport.getType() === EViewportTypes.FORWARDVIEWPORT) {
			var pModel = addons.cube(pScene);
			(<IForwardViewport>pViewport).setSkyboxModel(pModel.getRenderable(0));
		}
		//if (pViewport.getType() === EViewportTypes.LPPVIEWPORT || pViewport.getType() === EViewportTypes.DSVIEWPORT) {
		(<ILPPViewport>pViewport).setSkybox(pSkyboxTexture);
		//}

		pEnvTexture = pRmgr.createTexture(".env-map-texture-01");
		pEnvTexture.create(1024, 512, 1, null, 0, 0, 0,
			ETextureTypes.TEXTURE_2D, EPixelFormats.R8G8B8);
		pEnvTexture.unwrapCubeTexture(pSkyboxTexture);

		(<ILPPViewport>pViewport).setDefaultEnvironmentMap(pEnvTexture);
	}

	function loadModel(sPath, fnCallback?: Function, name?: String, pRoot?: ISceneNode): ISceneNode {
		var pModelRoot: ISceneNode = pScene.createNode();
		var pModel: ICollada = <ICollada>pEngine.getResourceManager().loadModel(sPath);

		pModelRoot.setName(name || sPath.match(/[^\/]+$/)[0] || 'unnamed_model');
		if (pRoot != null) {
			pModelRoot.attachToParent(pRoot);
		}
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
			"font-family: Arial;" +
			"margin: 5px;");

		return pStatsDiv;
	}

	function main(pEngine: IEngine) {
		std.setup(pCanvas);

		pCamera = createCamera();
		pViewport = createViewport();
		// pMirror = createMirror();
		pViewport.setBackgroundColor(color.GRAY);
		pViewport.setClearEveryFrame(true);

		var pStatsDiv = createStatsDIV();

		pCanvas.postUpdate.connect((pCanvas: ICanvas3d) => {
			pStatsDiv.innerHTML = pCanvas.getAverageFPS().toFixed(2) + " fps";
		});

		window.onresize = () => {
			pCanvas.resize(window.innerWidth, window.innerHeight);
		};

		//createSky();

		// CREATE ENVIRONMENT
		createLighting();

		createSkyBox();

		// PLASTIC PARAMS:
		var plasticColorSpecular: color.Color = new Color(0.05, 0.05, 0.05, 1.0);
		// var plasticColorDiffuse: color.Color = silverColorDiffuse;
		var plasticColorDiffuse: color.Color = new Color(0.35, 0.35, 0.35, 1.0);
		var plasticDarkColorDiffuse: color.Color = new Color(0.08, 0.08, 0.08, 1.0);

		// INIT PHYSICS 
		pPhysics = {};
		pPhysObjects = []; // this will track our physics objects

		// -- CREATE PHYSICS GROUND
		var pPhysGroundShape = new AmmoInst.btBoxShape(new AmmoInst.btVector3( 25, 1, 25 )); // Create block 50x2x50
		var pPhysGroundTransform = new AmmoInst.btTransform();
		pPhysGroundTransform.setIdentity();
		pPhysGroundTransform.setOrigin(new AmmoInst.btVector3( 0, -5, 0 )); // Set initial position
		 
		var pPhysGroundMass = 0; // Mass of 0 means ground won't move from gravity or collisions
		var pPhysLocalInertia = new AmmoInst.btVector3(0, 0, 0);
		var pPhysMotionState = new AmmoInst.btDefaultMotionState( pPhysGroundTransform );
		var pPhysRbInfo = new AmmoInst.btRigidBodyConstructionInfo( pPhysGroundMass, pPhysMotionState, pPhysGroundShape, pPhysLocalInertia );
		var pPhysGroundAmmo = new AmmoInst.btRigidBody( pPhysRbInfo );

		var resetScene = window['fun_resetScene'] = function() {
		    for ( var i = 0; i < pPhysObjects.length; i++ ) {
		    	pPhysObjects[i].mesh.setRotation(pPhysObjects[i].initialModelRotation);
		    	pPhysObjects[i].mesh.setPosition(pPhysObjects[i].initialModelPosition);

		    	pPhysObjects[i].mesh.update();

		    	// var pInitTransform = new AmmoInst.btTransform();
		    	// pInitTransform.setIdentity();
		    	var pos = pPhysObjects[i].mesh.getWorldPosition();
		    	var rot = pPhysObjects[i].mesh.getLocalOrientation();
		    	// pInitTransform.setOrigin(new AmmoInst.btVector3(pos.x,pos.y,pos.z));
		    	// pInitTransform.setRotation(new AmmoInst.btQuaternion(rot.x,rot.y,rot.z,rot.w));
		    	// pPhysObjects[i].getMotionState().getWorldTransform( pInitTransform );
		    	pPhysObjects[i].getWorldTransform().setOrigin(new AmmoInst.btVector3(pos.x,pos.y,pos.z));
		    	pPhysObjects[i].getWorldTransform().setRotation(new AmmoInst.btQuaternion(rot.x,rot.y,rot.z,rot.w));
		    	if(pPhysObjects[i].mesh.getName().match('ball')) {
		    		pPhysObjects[i].setLinearVelocity(new AmmoInst.btVector3(math.random()-0.5,0.,12.));
		    	}
		    };
		}
		var resetPhysics = window['fun_resetPhysics'] = function() {
			resetScene();
			initPhysics(pModels['bowling']);
			resetScene();
		}

		var updatePhysics = window['fun_updatePhysics'] = function() {
			pPhysics.physWorld.stepSimulation( 1 / 60, 5 ); // Tells Ammo.js to apply physics for 1/60th of a second with a maximum of 5 steps
		    var i, transform = new AmmoInst.btTransform(), origin, rotation;
		     
		    for ( i = 0; i < pPhysObjects.length; i++ ) {
		        pPhysObjects[i].getMotionState().getWorldTransform( transform ); // Retrieve box position & rotation from Ammo

		        // Update rotation
		        rotation = transform.getRotation();
		        pPhysObjects[i].mesh.setRotation( math.Quat4.temp(rotation.x(),rotation.y(),rotation.z(),rotation.w()) );
		         
		        // Update position
		        origin = transform.getOrigin();
		        pPhysObjects[i].mesh.setPosition( math.Vec3.temp(origin.x(),origin.y(),origin.z()) );
		    };
		}

		var initPhysics = window['fun_initPhysics'] = function(model) {
			var pCollisionConfiguration = pPhysics.collisionConfiguration = new AmmoInst.btDefaultCollisionConfiguration();
			var pDispatcher = pPhysics.dispatcher = new AmmoInst.btCollisionDispatcher( pCollisionConfiguration );
			var pOverlappingPairCache = pPhysics.overlappingPairCache = new AmmoInst.btDbvtBroadphase();
			var pSolver = pPhysics.solver = new AmmoInst.btSequentialImpulseConstraintSolver();
			var pPhysWorld = pPhysics.physWorld = new AmmoInst.btDiscreteDynamicsWorld( pDispatcher, pOverlappingPairCache, pSolver, pCollisionConfiguration );
			pPhysWorld.setGravity(new AmmoInst.btVector3(0, -9.81, 0));
			pPhysWorld.addRigidBody( pPhysGroundAmmo );

			model.explore(function (node) {
				if (scene.SceneModel.isModel(node)) {
					if (node.getName().match("kegel")) {
						// -- -- INIT KEGEL SHAPE

						// -- CREATE PHYSICS OBJECT
						var mass = 1; // Matches box dimensions for simplicity
						var startTransform 	= new AmmoInst.btTransform();
						startTransform.setIdentity();
						var pos = node.getWorldPosition();
						startTransform.setOrigin(new AmmoInst.btVector3( pos.x, pos.y, pos.z )); // Set initial position
						 
						var localInertia = new AmmoInst.btVector3(0, 0, 0);

						var shape = new AmmoInst.btCylinderShape(new AmmoInst.btVector3(0.2,0.7,0.2));
						shape.calculateLocalInertia( mass, localInertia );
						 
						var motionState = new AmmoInst.btDefaultMotionState( startTransform );
						var rbInfo = new AmmoInst.btRigidBodyConstructionInfo( mass, motionState, shape, localInertia );
						var shapeAmmo = new AmmoInst.btRigidBody( rbInfo );
						pPhysWorld.addRigidBody( shapeAmmo );
						 
						shapeAmmo.initialModelPosition = new math.Vec3(node.getLocalPosition()); // Remember local position
						shapeAmmo.initialModelPosition.add(math.Vec3.temp(0.,0.3,0.));
						shapeAmmo.initialModelRotation = new math.Quat4(node.getLocalOrientation());
						shapeAmmo.mesh = node; // Assign the scene mesh in `shape`, this is used to update the model position later
						pPhysObjects.push( shapeAmmo ); // Keep track of this boxes
					
					}
					else if(node.getName().match("ball")) {
						// node.setPosition(0.,2.,0.);
						// node.update();
						// debug.log('Found ball: '+node.getName());
						// -- CREATE PHYSICS OBJECT
						var mass = 10.; // Matches box dimensions for simplicity
						var startTransform 	= new AmmoInst.btTransform();
						startTransform.setIdentity();
						var pos = node.getWorldPosition();
						startTransform.setOrigin(new AmmoInst.btVector3( pos.x, pos.y, pos.z )); // Set initial position
						 
						var localInertia = new AmmoInst.btVector3(0, 0, 0);

						var shape = new AmmoInst.btSphereShape(0.44);
						shape.calculateLocalInertia( mass, localInertia );
						 
						var motionState = new AmmoInst.btDefaultMotionState( startTransform );
						var rbInfo = new AmmoInst.btRigidBodyConstructionInfo( mass, motionState, shape, localInertia );
						var shapeAmmo = new AmmoInst.btRigidBody( rbInfo );
						pPhysWorld.addRigidBody( shapeAmmo );
						 
						shapeAmmo.initialModelPosition = new math.Vec3(node.getLocalPosition()); // Remember local position
						shapeAmmo.initialModelPosition.add(math.Vec3.temp(0.,0.3,0.));
						shapeAmmo.initialModelRotation = new math.Quat4(node.getLocalOrientation());
						shapeAmmo.mesh = node; // Assign the scene mesh in `shape`, this is used to update the model position later
						pPhysObjects.push( shapeAmmo ); // Keep track of this boxes
					}
					else if(node.getName().match('floor')) {
						// debug.log('Found floor: '+node.getName());
						// -- CREATE PHYSICS OBJECT
						var mass = 0.0; // Matches box dimensions for simplicity
						var startTransform 	= new AmmoInst.btTransform();
						startTransform.setIdentity();
						var pos = node.getWorldPosition();
						startTransform.setOrigin(new AmmoInst.btVector3( pos.x, pos.y, pos.z )); // Set initial position
						 
						var localInertia = new AmmoInst.btVector3(0, 0, 0);

						var shape = new AmmoInst.btBoxShape(new AmmoInst.btVector3( 1.857,0.108, 9.513 ));
						 
						var motionState = new AmmoInst.btDefaultMotionState( startTransform );
						var rbInfo = new AmmoInst.btRigidBodyConstructionInfo( mass, motionState, shape, localInertia );
						var shapeAmmo = new AmmoInst.btRigidBody( rbInfo );
						pPhysWorld.addRigidBody( shapeAmmo );
						 
						shapeAmmo.initialModelPosition = new math.Vec3(node.getLocalPosition()); // Remember local position
						shapeAmmo.initialModelRotation = new math.Quat4(node.getLocalOrientation());
						shapeAmmo.mesh = node; // Assign the scene mesh in `shape`, this is used to update the model position later
						pPhysObjects.push( shapeAmmo ); // Keep track of this boxes
					}
				}
			});
		}

		// MODEL LIBRARY SETUP
		var pModelsKeys = [
			'bowling',
		];
		pModelsFiles = {
			bowling: {
				path: "BOWLING.DAE",
				init: function (model) {
					model.explore(function (node) {
						if (scene.SceneModel.isModel(node)) {
							// first handle local matrices trouble

							var intPos = math.Vec3.temp(), intRot = math.Quat4.temp(), intScale = math.Vec3.temp();
							node.getLocalMatrix().decompose(intRot, intScale, intPos);

							node.setLocalMatrix(new math.Mat4(1.));
							node.setRotation(intRot);
							node.setLocalScale(intScale);
							node.setPosition(intPos);
						}
					});
					initPhysics(model);
					resetScene();

					pScene.postUpdate.connect((pScene: IScene3d) => {
						updatePhysics();
						});

					setInterval(resetPhysics, 10000);
				},
			},
		};

		// MODELS LOADING
		pModels = {};

		var sActiveModelKey = pModelsKeys[0];
		pModels[sActiveModelKey] = loadModel(pModelsFiles[sActiveModelKey].path, pModelsFiles[sActiveModelKey].init, sActiveModelKey, pScene.getRootNode()).setPosition(0., 0., 0.).addPosition(0., 0., 0.);
		pCurrentModel = pModels[sActiveModelKey];

		var pModelsFolder = pGUI.addFolder("models");

		(<dat.OptionController>pModelsFolder.add({ Model: sActiveModelKey }, 'Model', pModelsKeys)).name("Model").onChange((sKey) => {
			pCurrentModel.addPosition(0., -1000., 0.);
			if (pModels[sKey] == null) {
				pModels[sKey] = loadModel(pModelsFiles[sKey].path, pModelsFiles[sKey].init, sKey, pScene.getRootNode()).setPosition(0., 0., 0.).addPosition(0., -1000., 0.);
			}
			pCurrentModel = pModels[sKey];
			pCurrentModel.addPosition(0., 1000., 0.);
			sActiveModelKey = sKey;
		});

		// FINAL PREPARAIONS

		createKeymap(pCamera);

		animateCameras();

		pProgress.destroy();
		pEngine.exec();
	}

	pEngine.depsLoaded.connect(main);
}
