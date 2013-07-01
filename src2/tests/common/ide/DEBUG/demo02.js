


/*---------------------------------------------
 * assembled at: Thu Jun 06 2013 13:35:44 GMT+0400 (Московское время (лето))
 * directory: tests/common/ide/DEBUG/
 * file: tests/common/ide/demo02.ts
 * name: demo02
 *--------------------------------------------*/


/// @data: data
/// @BARREL: 				{data}/models/barrel/barrel_and_support.dae|location()
/// @CLOSED_BOX: 			{data}/models/box/closed_box.dae|location()
/// @TUBE: 					{data}/models/tube/tube.dae|location()
/// @TUBE_BETWEEN_ROCKS:	{data}/models/tubing/tube_beeween_rocks.DAE|location()
/// @HERO_MODEL: 			{data}/models/hero/movie.dae|location()
/// @HERO_CONTROLLER: 		{data}/models/hero/movie_anim.DAE|location()
/// @HERO_INTRO: 			{data}/models/hero/intro.part1.DAE|location()
/// @WINDSPOT_MODEL: 		{data}/models/windspot/WINDSPOT.DAE|location()
/// @MINER_MODEL: 			{data}/models/miner/miner.dae|location()
/// @ROCK_MODEL: 			{data}/models/rock/rock-1-low-p.DAE|location()
/// @TERRAIN_HEIGHT_MAP: 	{data}/textures/terrain/main_height_map_1025.dds|location()
/// @TERRAIN_NORMAL_MAP: 	{data}/textures/terrain/main_terrain_normal_map.dds|location()
/// @SKYBOX: 				{data}/textures/skyboxes/desert-3.dds|location()
var akra;
(function (akra) {
    var pEngine = akra.createEngine();
    var pRmgr = pEngine.getResourceManager();
    var pScene = pEngine.getScene();
    var pUI = pEngine.getSceneManager().createUI();
    var pCanvas = pEngine.getRenderer().getDefaultCanvas();
    var pCamera = null;
    var pViewport = null;
    var pIDE = null;
    var pSkyBoxTexture = null;
    var pGamepads = pEngine.getGamepads();
    var pKeymap = akra.controls.createKeymap();
    var pTerrain = null;
    // var $canvasContainer: JQuery 		= null;
    // var $div: JQuery 					= null;
    akra.self = {
        engine: pEngine,
        scene: pScene,
        camera: pCamera,
        viewport: pViewport,
        canvas: pCanvas,
        rsmgr: pRmgr,
        renderer: pEngine.getRenderer(),
        keymap: pKeymap,
        gamepads: pGamepads,
        terrain: // cameraTerrainProj 	: <ISceneModel>null,
        null,
        terrainLoaded: false,
        cameras: [],
        activeCamera: 0,
        hero: {
            root: null,
            head: null,
            pelvis: null,
            movie: null
        }
    };
    function setup() {
        if (!akra.isNull(pUI)) {
            pIDE = pUI.createComponent("IDE");
            pIDE.render($(document.body));
        } else {
            var pCanvasElement = (pCanvas)._pCanvas;
            var pDiv = document.createElement("div");
            document.body.appendChild(pDiv);
            pDiv.appendChild(pCanvasElement);
            pDiv.style.position = "fixed";
        }
        pKeymap.captureMouse((pCanvas).el);
        pKeymap.captureKeyboard(document);
        pCanvas.bind("viewportAdded", function (pCanvas, pVp) {
            pViewport = akra.self.viewport = pVp;
        });
        // pIDE.bind("created", (): void => {
        // 	$canvasContainer = $((<webgl.WebGLCanvas>pCanvas).el).parent();
        // 	$div = $("<div>[ Fred ]</div>").css({
        // 		position 	: "absolute",
        // 		background 	: "rgba(0,0,0,.75)",
        // 		color 		: "white",
        // 		zIndex 		: "1000",
        // 		fontFamily 	: "Consolas",
        // 		fontSize 	: "10px",
        // 		padding 	: "2px",
        // 		width 		: "40px",
        // 		textAlign 	: "center",
        // 		whiteSpace 	: "nowrap"
        // 	});
        // 	$canvasContainer.append($div);
        // 	$canvasContainer.css({overflow: "hidden"});
        // });
        pKeymap.bind("equalsign", /** @inline */function () {
            akra.self.activeCamera++;
            if (akra.self.activeCamera === akra.self.cameras.length) {
                akra.self.activeCamera = 0;
            }
            var pCam = akra.self.cameras[akra.self.activeCamera];
            pViewport.setCamera(pCam);
        });
        pKeymap.bind("delete", /** @inline */function () {
            var pMovie = akra.self.hero.movie;
            if (akra.isNull(pMovie)) {
                return;
            }
            var pCont = pMovie.findAnimation("movie");
            pMovie.stop();
            pMovie.play("movie");
            // pCont.rewind(33.33);
                    });
        pKeymap.bind("add", /** @inline */function () {
            var pMovie = akra.self.hero.movie;
            if (akra.isNull(pMovie)) {
                return;
            }
            var pCont = pMovie.findAnimation("movie");
            pCont.setSpeed(pCont.speed * 2.0);
        });
        pKeymap.bind("SUBTRACT", /** @inline */function () {
            var pMovie = akra.self.hero.movie;
            if (akra.isNull(pMovie)) {
                return;
            }
            var pCont = pMovie.findAnimation("movie");
            pCont.setSpeed(pCont.speed / 2.0);
        });
    }
    function createCameras() {
        pCamera = akra.self.camera = pScene.createCamera();
        pCamera.attachToParent(pScene.getRootNode());
        pCamera.addRelRotationByEulerAngles(-akra.math.PI / 5., 0., 0.);
        pCamera.addRelPosition(-8.0, 5.0, 11.0);
        pCamera.update();
    }
    function createSceneEnvironment() {
        var pSceneQuad = akra.util.createQuad(pScene, 500.);
        pSceneQuad.attachToParent(pScene.getRootNode());
        pSceneQuad.mesh.getSubset(0).setVisible(false);
        var pSceneSurface = akra.util.createSceneSurface(pScene, 100);
        // pSceneSurface.scale(5.);
        pSceneSurface.addPosition(0, 0.01, 0);
        pSceneSurface.attachToParent(pScene.getRootNode());
        pSceneSurface.mesh.getSubset(0).setVisible(false);
        // var pCameraTerrainProj: ISceneModel = util.basis(pScene);
        // pCameraTerrainProj.attachToParent(pScene.getRootNode());
        // pCameraTerrainProj.scale(.25);
        // self.cameraTerrainProj = pCameraTerrainProj;
            }
    function createViewports() {
        pViewport = pCanvas.addViewport(pCamera, akra.EViewportTypes.DSVIEWPORT);
        if (akra.isNull(pUI)) {
            pCanvas.resize(window.innerWidth, window.innerHeight);
            window.onresize = function (event) {
                pCanvas.resize(window.innerWidth, window.innerHeight);
            };
        }
    }
    function createLighting() {
        var pSunLight = pScene.createLightPoint(akra.ELightTypes.OMNI, true, 2048, "sun");
        pSunLight.attachToParent(pScene.getRootNode());
        pSunLight.enabled = true;
        pSunLight.params.ambient.set(0.0, 0.0, 0.0, 1);
        pSunLight.params.diffuse.set(1.);
        pSunLight.params.specular.set(1.);
        pSunLight.params.attenuation.set(1, 0, 0);
        pSunLight.addPosition(0, 500, 0);
        function createAmbient(sName, v3fPos) {
            var pOmniLight = pScene.createLightPoint(akra.ELightTypes.OMNI, false, 512, sName);
            pOmniLight.attachToParent(pScene.getRootNode());
            pOmniLight.enabled = true;
            pOmniLight.params.ambient.set(0.1, 0.1, 0.1, 1);
            pOmniLight.params.diffuse.set(0.25);
            pOmniLight.params.specular.set(0.);
            pOmniLight.params.attenuation.set(4., 0, 0);
            pOmniLight.addPosition(v3fPos);
        }
        createAmbient("Ambient LB", new akra.Vec3(-500, 500, -500));
        createAmbient("Ambient RB", new akra.Vec3(500, 500, -500));
        createAmbient("Ambient LF", new akra.Vec3(-500, 500, 500));
        createAmbient("Ambient RF", new akra.Vec3(500, 500, 500));
    }
    var v3fOffset = new akra.Vec3();
    function updateKeyboardControls(fLateralSpeed, fRotationSpeed) {
        var pKeymap = akra.self.keymap;
        var pGamepad = akra.self.gamepads.find(0);
        if (pKeymap.isKeyPress(akra.EKeyCodes.RIGHT)) {
            pCamera.addRelRotationByEulerAngles(0.0, 0.0, -fRotationSpeed);
            //v3fCameraUp.Z >0.0 ? fRotationSpeed: -fRotationSpeed);
                    } else if (pKeymap.isKeyPress(akra.EKeyCodes.LEFT)) {
            pCamera.addRelRotationByEulerAngles(0.0, 0.0, fRotationSpeed);
            //v3fCameraUp.Z >0.0 ? -fRotationSpeed: fRotationSpeed);
                    }
        if (pKeymap.isKeyPress(akra.EKeyCodes.UP)) {
            pCamera.addRelRotationByEulerAngles(0, fRotationSpeed, 0);
        } else if (pKeymap.isKeyPress(akra.EKeyCodes.DOWN)) {
            pCamera.addRelRotationByEulerAngles(0, -fRotationSpeed, 0);
        }
        v3fOffset.set(0.);
        var isCameraMoved = false;
        if (pKeymap.isKeyPress(akra.EKeyCodes.D) || (pGamepad && pGamepad.buttons[akra.EGamepadCodes.PAD_RIGHT])) {
            v3fOffset.x = fLateralSpeed;
            isCameraMoved = true;
        } else if (pKeymap.isKeyPress(akra.EKeyCodes.A) || (pGamepad && pGamepad.buttons[akra.EGamepadCodes.PAD_LEFT])) {
            v3fOffset.x = -fLateralSpeed;
            isCameraMoved = true;
        }
        if (pKeymap.isKeyPress(akra.EKeyCodes.R)) {
            v3fOffset.y = fLateralSpeed;
            isCameraMoved = true;
        } else if (pKeymap.isKeyPress(akra.EKeyCodes.F)) {
            v3fOffset.y = -fLateralSpeed;
            isCameraMoved = true;
        }
        if (pKeymap.isKeyPress(akra.EKeyCodes.W) || (pGamepad && pGamepad.buttons[akra.EGamepadCodes.PAD_TOP])) {
            v3fOffset.z = -fLateralSpeed;
            isCameraMoved = true;
        } else if (pKeymap.isKeyPress(akra.EKeyCodes.S) || (pGamepad && pGamepad.buttons[akra.EGamepadCodes.PAD_BOTTOM])) {
            v3fOffset.z = fLateralSpeed;
            isCameraMoved = true;
        }
        // else if (pKeymap.isKeyPress(EKeyCodes.SPACE)) {
        //     pEngine.isActive()? pEngine.pause(): pEngine.play();
        // }
        if (isCameraMoved) {
            pCamera.addRelPosition(v3fOffset);
        }
    }
    function updateCameras() {
        updateKeyboardControls(0.25, 0.05);
        var pKeymap = akra.self.keymap;
        var pGamepad = akra.self.gamepads.find(0);
        var pCamera = akra.self.camera;
        var pCanvas = akra.self.canvas;
        var pViewport = akra.self.viewport;
        //default camera.
        if (pKeymap.isMousePress() && pKeymap.isMouseMoved()) {
            var v2fD = pKeymap.getMouseShift();
            var fdX = v2fD.x, fdY = v2fD.y;
            fdX /= pCanvas.width / 10.0;
            fdY /= pCanvas.height / 10.0;
            pCamera.addRelRotationByEulerAngles(-fdX, -fdY, 0);
        }
        if (!pGamepad) {
            return;
        }
        var fX = pGamepad.axes[akra.EGamepadAxis.RIGHT_ANALOGUE_HOR];
        var fY = pGamepad.axes[akra.EGamepadAxis.RIGHT_ANALOGUE_VERT];
        if (Math.abs(fX) < 0.25) {
            fX = 0;
        }
        if (Math.abs(fY) < 0.25) {
            fY = 0;
        }
        if (fX || fY) {
            pCamera.addRelRotationByEulerAngles(-fX / 10, -fY / 10, 0);
        }
    }
    function createTerrain() {
        pTerrain = pScene.createTerrainROAM();
        var pTerrainMap = {};
        pTerrainMap["height"] = pRmgr.loadImage("../../../../data/textures/terrain/main_height_map_1025.dds");
        pTerrainMap["height"].bind("loaded", function (pTexture) {
            pTerrainMap["normal"] = pRmgr.loadImage("../../../../data/textures/terrain/main_terrain_normal_map.dds");
            pTerrainMap["normal"].bind("loaded", function (pTexture) {
                var isCreate = pTerrain.init(pTerrainMap, new akra.geometry.Rect3d(-250, 250, -250, 250, 0, 150), 6, 4, 4, "main");
                pTerrain.attachToParent(pScene.getRootNode());
                pTerrain.setInheritance(akra.ENodeInheritance.ALL);
                pTerrain.setRotationByXYZAxis(-Math.PI / 2, 0., 0.);
                pTerrain.setPosition(11, -109, -109.85);
                // pTerrain.setPosition(0., -pTerrain.localBounds.sizeZ() / 2., 0.);
                // pTestNode.addRelRotationByXYZAxis(1, 1, 0);
                akra.self.terrainLoaded = true;
                createHero();
                // pEngine.renderFrame();
                            });
        });
        akra.self.terrain = pTerrain;
    }
    function createSkyBox() {
        pSkyBoxTexture = pRmgr.createTexture(".sky-box-texture");
        pSkyBoxTexture.loadResource("../../../../data/textures/skyboxes/desert-3.dds");
        pSkyBoxTexture.bind("loaded", function (pTexture) {
            if (pViewport.type === akra.EViewportTypes.DSVIEWPORT) {
                (pViewport).setSkybox(pTexture);
            }
        });
    }
    function loadModels(sPath, fnCallback) {
        var pModel = pRmgr.loadModel(sPath);
        pModel.bind("loaded", function (pModel) {
            var pModelRoot = pModel.attachToScene(pScene);
            if (akra.isFunction(fnCallback)) {
                fnCallback(pModelRoot);
            }
        });
    }
    function update() {
        updateCameras();
        akra.self.keymap.update();
        // var pProj: IVec3 = vec3();
        // if (self.terrainLoaded && self.terrain.projectPoint(self.hero.root.worldPosition, pProj)) {
        // 	self.cameraTerrainProj.setPosition(pProj);
        // 	if (self.viewport.projectPoint(pProj)) {
        // 		var pOffset = $canvasContainer.offset();
        // 		$div.offset({left: pOffset.left + pProj.x, top: pOffset.top + pProj.y});
        // 	}
        // }
            }
    function fetchAllCameras() {
        akra.self.scene.getRootNode().explore(function (pEntity) {
            if (akra.scene.objects.isCamera(pEntity) && !akra.scene.light.isShadowCaster(pEntity)) {
                akra.self.cameras.push(pEntity);
            }
            return true;
        });
        akra.self.activeCamera = akra.self.cameras.indexOf(akra.self.camera);
    }
    function putOnTerrain(pNode, v3fPlace) {
        if (!akra.isDef(v3fPlace)) {
            v3fPlace = pNode.worldPosition;
        }
        var v3fsp = new akra.Vec3();
        if (akra.self.terrain.projectPoint(v3fPlace, v3fsp)) {
            pNode.setPosition(v3fsp);
        }
    }
    function createHero() {
        loadModels("../../../../data/models/hero/movie.dae", function (pNode) {
            akra.self.hero.root = pNode.findEntity("node-Bip001");
            (pNode.findEntity("node-Sphere001")).mesh.getSubset(0).setVisible(false);
            var v3fsp = new akra.Vec3();
            if (akra.self.terrain.projectPoint(pNode.worldPosition, v3fsp)) {
                pNode.setPosition(v3fsp);
                pNode.setRotationByXYZAxis(0, akra.math.PI, 0);
                pCamera.addPosition(v3fsp);
                pCamera.lookAt(v3fsp);
            }
            loadModels("../../../../data/models/box/closed_box.dae", function (pBox) {
                pBox.scale(.25);
                putOnTerrain(pBox, new akra.Vec3(-2., -3.85, -5.));
                pBox.addPosition(new akra.Vec3(0., 1., 0.));
            });
            loadModels("../../../../data/models/barrel/barrel_and_support.dae", function (pBarrel) {
                pBarrel.scale(.75);
                pBarrel.setPosition(new akra.Vec3(-30., -40.23, -15.00));
                pBarrel.setRotationByXYZAxis(-17. * akra.math.RADIAN_RATIO, -8. * akra.math.RADIAN_RATIO, -15. * akra.math.RADIAN_RATIO);
            });
            loadModels("../../../../data/models/tube/tube.dae", function (pTube) {
                pTube.scale(19.);
                pTube.setRotationByXYZAxis(0. * akra.math.RADIAN_RATIO, -55. * akra.math.RADIAN_RATIO, 0.);
                pTube.setPosition(new akra.Vec3(-16., -52.17, -66.));
            });
            loadModels("../../../../data/models/tubing/tube_beeween_rocks.DAE", function (pTube) {
                pTube.scale(2.);
                pTube.setRotationByXYZAxis(5. * akra.math.RADIAN_RATIO, 100. * akra.math.RADIAN_RATIO, 0.);
                pTube.setPosition(new akra.Vec3(-55., -12.15, -82.00));
            });
            pScene.bind("beforeUpdate", update);
            var pMovie = pRmgr.loadModel("../../../../data/models/hero/intro.part1.DAE");
            pMovie.bind("loaded", /** @inline */function () {
                var pAnim = pMovie.extractAnimation(0);
                var pContainer = akra.animation.createContainer(pAnim, "movie");
                var pController = pEngine.createAnimationController("movie");
                pController.addAnimation(pContainer);
                pController.stop();
                pNode.addController(pController);
                akra.self.hero.movie = pController;
            });
            fetchAllCameras();
        });
    }
    function main(pEngine) {
        setup();
        createSceneEnvironment();
        createCameras();
        createViewports();
        createTerrain();
        createSkyBox();
        createLighting();
        /*
        loadModels("../../../../data/models/miner/miner.dae");
        loadModels("../../../../data/models/windspot/WINDSPOT.DAE", (pNode: ISceneNode) => {
        pNode.setRelPosition(7.5, 0., 0.);
        });
        loadModels("../../../../data/models/rock/rock-1-low-p.DAE", (pNode: ISceneNode) => {
        pNode.setRelPosition(0., 1., 5.);
        });
        
        */
            }
    pEngine.bind("depsLoaded", main);
    pEngine.exec();
})(akra || (akra = {}));
