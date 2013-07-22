


/*---------------------------------------------
 * assembled at: Mon Jul 22 2013 21:23:28 GMT+0400 (Московское время (зима))
 * directory: tests/common/ide/RELEASE/
 * file: tests/common/ide/intro2.ts
 * name: intro2
 *--------------------------------------------*/


///<reference path="../../../bin/RELEASE/akra.ts"/>
///<reference path="../../../bin/DEBUG/Progress.ts"/>
// declare var jQuery: JQueryStatic;
// declare var $: JQueryStatic;
/// @WINDSPOT_MODEL: 		"/models/windspot/WINDSPOT.DAE"
/// @MINER_MODEL: 			"/models/miner/miner.DAE"
/// @ROCK_MODEL: 			"/models/rock/rock-1-low-p.DAE"
var akra;
(function (akra) {
    function createProgress() {
        var pProgress = new akra.util.Progress();
        var pCanvas = pProgress.canvas;
        pProgress.color = "white";
        pProgress.fontColor = "white";
        pProgress.fontSize = 22;
        pCanvas.style.position = "absolute";
        pCanvas.style.left = "50%";
        pCanvas.style.top = "50%";
        pCanvas.style.zIndex = "100000";
        // pCanvas.style.display = "none";
        pCanvas.style.marginTop = (-pProgress.height / 2) + "px";
        pCanvas.style.marginLeft = (-pProgress.width / 2) + "px";
        return pProgress;
    }
    var pProgress = createProgress();
    var bMegaTextureLoaded = false;
    var pEngine = akra.createEngine({
        renderer: {
            preserveDrawingBuffer: true,
            alpha: false
        },
        deps: {
            root: "../",
            files: [
                {
                    path: "demo02.ara"
                }
            ]
        },
        loader: {
            before: function (pManager, pInfo) {
                pProgress.total = pInfo;
                document.body.appendChild(pProgress.canvas);
            },
            onload: function (pManager, iDepth, nLoaded, nTotal, pDep, pFile, pData) {
                pProgress.element = nLoaded;
                pProgress.depth = iDepth;
                pProgress.draw();
                if (!akra.isNull(pFile) && pFile.name === "HERO_FILM_JSON") {
                    var pImporter = new akra.io.Importer(pEngine);
                    pImporter.import(pData);
                    pFilmController = pImporter.getController();
                    // console.log(pFilmController);
                                    }
            },
            loaded: function (pManager) {
                var iCounter = 0;
                var iIntervalId = setInterval(/** @inline */function () {
                    if (bMegaTextureLoaded) {
                        document.body.removeChild(pProgress.canvas);
                        clearInterval(iIntervalId);
                    } else {
                        var sSuffix = "";
                        if (iCounter % 2 === 0) {
                            sSuffix = ".";
                        } else if (iCounter % 2 === 1) {
                            sSuffix = "";
                        }
                        //else sSuffix = ".";
                        iCounter++;
                        pProgress.printText("Prepare" + sSuffix);
                    }
                }, 500);
            }
        }
    });
    var pRmgr = pEngine.getResourceManager();
    var pScene = pEngine.getScene();
    var pUI = pEngine.getSceneManager().createUI();
    var pCanvas = pEngine.getRenderer().getDefaultCanvas();
    var pCamera = null;
    var pViewport = null;
    // var pIDE: ui.IDE 					= null;
    var pSkyBoxTexture = null;
    var pGamepads = pEngine.getGamepads();
    var pKeymap = akra.controls.createKeymap();
    var pTerrain = null;
    var pSky = null;
    var pParentElement = null;
    var pFilmController = null;
    // var pDepsManager: IDepsManager 		= pEngine.getDepsManager()
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
        cameras: [],
        activeCamera: 0,
        cameraLight: null,
        voice: null,
        sky: null,
        go: null,
        hero: {
            root: null,
            head: null,
            pelvis: null,
            movie: null
        }
    };
    function loadAssets() {
        var context = new ((window).AudioContext || (window).mozAudioContext || (window).webkitAudioContext)();
        var analyser = context.createAnalyser();
        var source;
        var audio0 = new Audio();
        audio0.src = akra.DATA + "/sounds/voice.wav";
        // audio0.load();
        audio0.controls = true;
        audio0.autoplay = false;
        audio0.loop = false;
        source = context.createMediaElementSource(audio0);
        source.connect(analyser);
        analyser.connect(context.destination);
        akra.self.voice = audio0;
    }
    loadAssets();
    function loaded() {
        console.log("loaded!!");
        nextCamera();
        nextCamera();
        setTimeout(/** @inline */function () {
            pEngine.exec();
            playIntro();
        }, 2000);
    }
    function nextCamera() {
        akra.self.activeCamera++;
        if (akra.self.activeCamera === akra.self.cameras.length) {
            akra.self.activeCamera = 0;
        }
        console.log("switched to camera", akra.self.activeCamera);
        var pCam = akra.self.cameras[akra.self.activeCamera];
        pViewport.setCamera(pCam);
    }
    function playIntro() {
        function _playIntro() {
            var pMovie = akra.self.hero.movie;
            if (akra.isNull(pMovie)) {
                return;
            }
            var pCont = pMovie.findAnimation("movie");
            pMovie.stop();
            pMovie.play("movie");
            akra.self.cameraLight.enabled = false;
            setTimeout(/** @inline */function () {
                if (akra.self.voice) {
                    akra.self.voice.currentTime = 0;
                    akra.self.voice.play();
                }
            }, 2500);
            setTimeout(/** @inline */function () {
                akra.self.cameraLight.enabled = true;
                setTimeout(/** @inline */function () {
                    akra.self.cameraLight.enabled = false;
                    setTimeout(/** @inline */function () {
                        akra.self.cameraLight.enabled = true;
                        setTimeout(/** @inline */function () {
                            akra.self.cameraLight.enabled = false;
                            setTimeout(/** @inline */function () {
                                akra.self.cameraLight.enabled = true;
                            }, 30);
                        }, 30);
                    }, 100);
                }, 50);
            }, 7000);
            // pCont.rewind(33.33);
                    }
        akra.self.go ? akra.self.go(_playIntro) : _playIntro();
    }
    function setup() {
        var pCanvasElement = (pCanvas)._pCanvas;
        pParentElement = document.getElementById("viewport") || document.body;
        pParentElement.innerHTML = "";
        pParentElement.appendChild(pCanvasElement);
        // pParentElement.style.position = "fixed";
        // pCanvasElement.style.position = "absolute";
        // pCanvasElement.style.top = "14px";
        pKeymap.captureMouse((pCanvas).el);
        pKeymap.captureKeyboard(document);
        pCanvas.bind("viewportAdded", function (pCanvas, pVp) {
            pViewport = akra.self.viewport = pVp;
        });
        pKeymap.bind("equalsign", nextCamera);
        pKeymap.bind("delete", playIntro);
    }
    function createCameras() {
        pCamera = akra.self.camera = pScene.createCamera();
        pCamera.attachToParent(pScene.getRootNode());
        pCamera.addRelRotationByEulerAngles(-akra.math.PI / 5., 0., 0.);
        pCamera.addRelPosition(-8.0, 5.0, 11.0);
        pCamera.update();
    }
    // function createViewports(): void {
    // 	pViewport = pCanvas.addViewport(pCamera, EViewportTypes.DSVIEWPORT);
    // 	if (isNull(pUI)) {
    // 		pCanvas.resize(window.innerWidth, window.innerHeight);
    // 		window.onresize = function(event) {
    // 			pCanvas.resize(window.innerWidth, window.innerHeight);
    // 		}
    // 	}
    // }
    function createViewports() {
        pViewport = pCanvas.addViewport(pCamera, akra.EViewportTypes.DSVIEWPORT);
        if (akra.isNull(pUI)) {
            pCanvas.resize(pParentElement.offsetWidth, pParentElement.offsetHeight);
            window.onresize = function (event) {
                pCanvas.resize(pParentElement.offsetWidth, pParentElement.offsetHeight);
            };
        }
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
        pTerrain = pScene.createTerrainROAM("Terrain");
        var pTerrainMap = {};
        pTerrainMap["height"] = pRmgr.imagePool.findResource("TERRAIN_HEIGHT_MAP");
        pTerrainMap["normal"] = pRmgr.imagePool.findResource("TERRAIN_NORMAL_MAP");
        var isCreate = pTerrain.init(pTerrainMap, new akra.geometry.Rect3d(-250, 250, -250, 250, 0, 150), 6, 4, 4, "main");
        pTerrain.attachToParent(pScene.getRootNode());
        pTerrain.setInheritance(akra.ENodeInheritance.ALL);
        pTerrain.setRotationByXYZAxis(-Math.PI / 2, 0., 0.);
        pTerrain.setPosition(11, -109, -109.85);
        akra.self.terrain = pTerrain;
        pTerrain.megaTexture.bind("minLevelLoaded", /** @inline */function () {
            if (!bMegaTextureLoaded) {
                bMegaTextureLoaded = true;
                loaded();
            }
        });
    }
    function createSky() {
        pSky = new akra.model.Sky(pEngine, 32, 32, 1000.0);
        pSky.setTime(14.0);
        pSky.skyDome.attachToParent(pScene.getRootNode());
        akra.self.sky = pSky;
        pSky._nHorinLevel = 15;
        var i = setInterval(/** @inline */function () {
            pSky.setTime(pSky.time + 0.001);
            // if (math.abs(pSky.time) == 30.0) clearInterval(i);
                    }, 100);
    }
    function createSkyBox() {
        var pSkyBoxTexture = pRmgr.createTexture("SKYBOX");
        pSkyBoxTexture.loadImage(pRmgr.imagePool.findResource("SKYBOX"));
        (pViewport).setSkybox(pSkyBoxTexture);
    }
    function createModelEntry(sResource, bShadows) {
        if (typeof bShadows === "undefined") { bShadows = true; }
        var pModel = pRmgr.colladaPool.findResource(sResource);
        pModel.options.shadows = bShadows;
        var pModelRoot = pModel.attachToScene(pScene);
        return pModelRoot;
    }
    function update() {
        updateCameras();
        akra.self.keymap.update();
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
    function createModels() {
        var pHeroModel = createModelEntry("HERO_MODEL");
        akra.self.hero.root = pHeroModel.findEntity("node-Bip001");
        (pHeroModel.findEntity("node-Sphere001")).mesh.getSubset(0).setVisible(false);
        pEngine.renderFrame();
        var v3fsp = new akra.Vec3();
        if (akra.self.terrain.projectPoint(pHeroModel.worldPosition, v3fsp)) {
            pHeroModel.setPosition(v3fsp);
            pHeroModel.setRotationByXYZAxis(0, akra.math.PI, 0);
            pCamera.addPosition(v3fsp);
            pCamera.lookAt(v3fsp);
        }
        var pCamLight = pScene.createLightPoint(akra.ELightTypes.PROJECT, false, 0, "camera-light");
        pCamLight.attachToParent(pScene.getRootNode().findEntity("Camera001-camera"));
        pCamLight.setInheritance(akra.ENodeInheritance.ALL);
        pCamLight.params.ambient.set(0.05, 0.05, 0.05, 1);
        pCamLight.params.diffuse.set(0.35);
        pCamLight.params.specular.set(1.);
        pCamLight.params.attenuation.set(.35, 0, 0);
        pCamLight.enabled = false;
        akra.self.cameraLight = pCamLight;
        var pBox = createModelEntry("CLOSED_BOX");
        pBox.scale(.25);
        putOnTerrain(pBox, new akra.Vec3(-2., -3.85, -5.));
        pBox.addPosition(new akra.Vec3(0., 1., 0.));
        var pBarrel = createModelEntry("BARREL");
        pBarrel.scale(.75);
        pBarrel.setPosition(new akra.Vec3(-30., -40.23, -15.00));
        pBarrel.setRotationByXYZAxis(-17. * akra.math.RADIAN_RATIO, -8. * akra.math.RADIAN_RATIO, -15. * akra.math.RADIAN_RATIO);
        var pTube = createModelEntry("TUBE");
        pTube.scale(19.);
        pTube.setRotationByXYZAxis(0. * akra.math.RADIAN_RATIO, -55. * akra.math.RADIAN_RATIO, 0.);
        pTube.setPosition(new akra.Vec3(-16., -52.17, -66.));
        var pTubeBetweenRocks = createModelEntry("TUBE_BETWEEN_ROCKS", false);
        pTubeBetweenRocks.scale(2.);
        pTubeBetweenRocks.setRotationByXYZAxis(5. * akra.math.RADIAN_RATIO, 100. * akra.math.RADIAN_RATIO, 0.);
        pTubeBetweenRocks.setPosition(new akra.Vec3(-55., -12.15, -82.00));
        pScene.bind("beforeUpdate", update);
        var pController = null;
        if (akra.isNull(pFilmController)) {
            var pMovie = pRmgr.colladaPool.findResource("HERO_FILM");
            if (pMovie) {
                var pAnim = pMovie.extractAnimation(0);
                var pContainer = akra.animation.createContainer(pAnim, "movie");
                pController = pEngine.createAnimationController("movie");
                pController.addAnimation(pContainer);
                pController.stop();
            }
        } else {
            pController = pFilmController;
            pController.stop();
        }
        if (pController) {
            pHeroModel.addController(pController);
        }
        akra.self.hero.movie = pController;
        fetchAllCameras();
    }
    function main(pEngine) {
        setup();
        createCameras();
        createViewports();
        createTerrain();
        createModels();
        createSky();
        createSkyBox();
        // pEngine.exec();
            }
    pEngine.bind("depsLoaded", main);
})(akra || (akra = {}));
