


/*---------------------------------------------
 * assembled at: Fri Jul 26 2013 18:57:00 GMT+0400 (Московское время (зима))
 * directory: tests/common/game/DEBUG/
 * file: tests/common/game/game.ts
 * name: game
 *--------------------------------------------*/


var akra;
(function (akra) {
    function setup(pCanvas, pUI) {
        if (typeof pUI === "undefined") { pUI = null; }
        var pIDE = null;
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
        return pIDE;
    }
    function createProgress() {
        var pProgress = new akra.util.Progress();
        var pCanvas = pProgress.canvas;
        pProgress.color = "white";
        pProgress.fontColor = "white";
        pCanvas.style.position = "absolute";
        pCanvas.style.left = "50%";
        pCanvas.style.top = "70%";
        pCanvas.style.zIndex = "100000";
        // pCanvas.style.backgroundColor = "rgba(70, 94, 118, .8)";
        // pCanvas.style.display = "none";
        pCanvas.style.marginTop = (-pProgress.height / 2) + "px";
        pCanvas.style.marginLeft = (-pProgress.width / 2) + "px";
        document.body.appendChild(pProgress.canvas);
        pProgress.drawText("Initializing demo");
        return pProgress;
    }
    function createCameras(pScene) {
        var pCamera = pScene.createCamera();
        pCamera.attachToParent(pScene.getRootNode());
        pCamera.addRelRotationByEulerAngles(-akra.math.PI / 5., 0., 0.);
        pCamera.addRelPosition(-8.0, 5.0, 11.0);
        pCamera.update();
        return pCamera;
    }
    function createSceneEnvironment(pScene, bHideQuad, bHideSurface) {
        if (typeof bHideQuad === "undefined") { bHideQuad = false; }
        if (typeof bHideSurface === "undefined") { bHideSurface = false; }
        var pSceneQuad = akra.util.createQuad(pScene, 500.);
        pSceneQuad.attachToParent(pScene.getRootNode());
        pSceneQuad.mesh.getSubset(0).setVisible(!bHideQuad);
        var pSceneSurface = akra.util.createSceneSurface(pScene, 100);
        // pSceneSurface.scale(5.);
        pSceneSurface.addPosition(0, 0.01, 0);
        pSceneSurface.attachToParent(pScene.getRootNode());
        pSceneSurface.mesh.getSubset(0).setVisible(!bHideSurface);
        // var pCameraTerrainProj: ISceneModel = util.basis(pScene);
        // pCameraTerrainProj.attachToParent(pScene.getRootNode());
        // pCameraTerrainProj.scale(.25);
        // self.cameraTerrainProj = pCameraTerrainProj;
            }
    function createViewports(pCamera, pCanvas, pUI) {
        if (typeof pUI === "undefined") { pUI = null; }
        var pViewport = pCanvas.addViewport(pCamera, akra.EViewportTypes.DSVIEWPORT);
        if (akra.isNull(pUI)) {
            pCanvas.resize(window.innerWidth, window.innerHeight);
            window.onresize = function (event) {
                pCanvas.resize(window.innerWidth, window.innerHeight);
            };
        }
        return pViewport;
    }
    function createTerrain(pScene) {
        var pRmgr = pScene.getManager().getEngine().getResourceManager();
        var pTerrain = pScene.createTerrainROAM("Terrain");
        var pTerrainMap = {};
        pTerrainMap["height"] = pRmgr.imagePool.findResource("TERRAIN_HEIGHT_MAP");
        pTerrainMap["normal"] = pRmgr.imagePool.findResource("TERRAIN_NORMAL_MAP");
        var isCreate = pTerrain.init(pTerrainMap, new akra.geometry.Rect3d(-250, 250, -250, 250, 0, 150), 6, 4, 4, "main");
        pTerrain.attachToParent(pScene.getRootNode());
        pTerrain.setInheritance(akra.ENodeInheritance.ALL);
        pTerrain.setRotationByXYZAxis(-Math.PI / 2, 0., 0.);
        pTerrain.setPosition(11, -109, -109.85);
        return pTerrain;
    }
    function createSkyBox(pRmgr, pViewport) {
        var pSkyBoxTexture = pRmgr.createTexture(".sky-box-texture");
        pSkyBoxTexture.loadResource("SKYBOX");
        if (pViewport.type === akra.EViewportTypes.DSVIEWPORT) {
            pViewport.setSkybox(pSkyBoxTexture);
        }
        return pSkyBoxTexture;
    }
    function createSky(pScene, fTime) {
        if (typeof fTime === "undefined") { fTime = 14.0; }
        var pEngine = pScene.getManager().getEngine();
        var pSky = new akra.model.Sky(pEngine, 32, 32, 1000.0);
        pSky.setTime(fTime);
        pSky.skyDome.attachToParent(pScene.getRootNode());
        return pSky;
    }
    function createModelEntry(pScene, sResource) {
        var pRmgr = pScene.getManager().getEngine().getResourceManager();
        var pModel = pRmgr.colladaPool.findResource(sResource);
        var pModelRoot = pModel.attachToScene(pScene);
        return pModelRoot;
    }
    function createModelEx(sName, pScene, pTerrain, pCamera, pController) {
        if (typeof pTerrain === "undefined") { pTerrain = null; }
        if (typeof pCamera === "undefined") { pCamera = null; }
        if (typeof pController === "undefined") { pController = null; }
        var pEngine = pScene.getManager().getEngine();
        var pRmgr = pEngine.getResourceManager();
        var pHeroModel = createModelEntry(pScene, sName);
        if (akra.isNull(pHeroModel)) {
            return null;
        }
        pEngine.renderFrame();
        var v3fsp = new akra.Vec3();
        if (!akra.isNull(pTerrain) && !akra.isNull(pCamera)) {
            if (pTerrain.projectPoint(pHeroModel.worldPosition, v3fsp)) {
                pHeroModel.setPosition(v3fsp);
                pHeroModel.setRotationByXYZAxis(0, akra.math.PI, 0);
                pCamera.addPosition(v3fsp);
                pCamera.lookAt(v3fsp);
            }
        }
        if (!akra.isNull(pController)) {
            pHeroModel.addController(pController);
        }
        return pHeroModel;
    }
    function putOnTerrain(pNode, pTerrain, v3fPlace) {
        if (!akra.isDef(v3fPlace)) {
            v3fPlace = pNode.worldPosition;
        }
        var v3fsp = new akra.Vec3();
        if (pTerrain.projectPoint(v3fPlace, v3fsp)) {
            pNode.setPosition(v3fsp);
        }
    }
    function fetchAllCameras(pScene) {
        var pCameras = [];
        pScene.getRootNode().explore(function (pEntity) {
            if (akra.scene.objects.isCamera(pEntity) && !akra.scene.light.isShadowCaster(pEntity)) {
                pCameras.push(pEntity);
            }
            return true;
        });
        return pCameras;
    }
    var pProgress = createProgress();
    var pGameDeps = {
        files: [
            {
                path: "textures/terrain/main_height_map_1025.dds",
                name: "TERRAIN_HEIGHT_MAP"
            }, 
            {
                path: "textures/terrain/main_terrain_normal_map.dds",
                name: "TERRAIN_NORMAL_MAP"
            }, 
            {
                path: "textures/skyboxes/desert-3.dds",
                name: "SKYBOX"
            }
        ],
        deps: {
            files: [
                {
                    path: "models/barrel/barrel_and_support.dae",
                    name: "BARREL"
                }, 
                {
                    path: "models/box/closed_box.dae",
                    name: "CLOSED_BOX"
                }, 
                {
                    path: "models/tube/tube.dae",
                    name: "TUBE"
                }, 
                {
                    path: "models/tubing/tube_beeween_rocks.DAE",
                    name: "TUBE_BETWEEN_ROCKS"
                }, 
                {
                    path: "models/hero/movie.dae",
                    name: "HERO_MODEL"
                }, 
                {
                    path: "models/hero/movie.dae",
                    name: "HERO_MODEL"
                }, 
                
            ],
            deps: {
                files: [
                    {
                        path: "models/hero/movement.json",
                        name: "HERO_CONTROLLER"
                    }
                ]
            }
        }
    };
    var pRenderOpts = {
        preserveDrawingBuffer: //for screenshoting
        true
    };
    var pControllerData = null;
    var pLoader = {
        changed: function (pManager, pFile, pInfo) {
            var sText = "";
            if (pFile.status === akra.EDependenceStatuses.LOADING) {
                sText += "Loading ";
            } else if (pFile.status === akra.EDependenceStatuses.UNPACKING) {
                sText += "Unpacking ";
            }
            if (pFile.status === akra.EDependenceStatuses.LOADING || pFile.status === akra.EDependenceStatuses.UNPACKING) {
                sText += ("resource " + akra.path.info(akra.path.uri(pFile.path).path).basename);
                if (!akra.isNull(pInfo)) {
                    sText += " (" + (pInfo.loaded / pInfo.total * 100).toFixed(2) + "%)";
                }
                pProgress.drawText(sText);
            } else if (pFile.status === akra.EDependenceStatuses.LOADED) {
                pProgress.total[pFile.deps.depth] = pFile.deps.total;
                pProgress.element = pFile.deps.loaded;
                pProgress.depth = pFile.deps.depth;
                pProgress.draw();
                if (pFile.name === "HERO_CONTROLLER") {
                    pControllerData = pFile.content;
                }
            }
        },
        loaded: function (pManager) {
            pProgress.cancel();
            document.body.removeChild(pProgress.canvas);
        }
    };
    var pOptions = {
        renderer: pRenderOpts,
        deps: pGameDeps,
        loader: pLoader
    };
    var pEngine = akra.createEngine(pOptions);
    var pUI = pEngine.getSceneManager().createUI();
    var pCanvas = pEngine.getRenderer().getDefaultCanvas();
    var pCamera = null;
    var pViewport = null;
    var pIDE = null;
    var pSkyBoxTexture = null;
    var pGamepads = pEngine.getGamepads();
    var pKeymap = akra.controls.createKeymap();
    var pTerrain = null;
    var pSky = null;
    var pMovementController = null;
    var pRmgr = pEngine.getResourceManager();
    var pScene = pEngine.getScene();
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
        hero: {
            root: null,
            head: null,
            pelvis: null,
            movie: null
        }
    };
    pKeymap.captureMouse((pCanvas).el);
    pKeymap.captureKeyboard(document);
    var v3fOffset = new akra.Vec3();
    function updateKeyboardControls(fLateralSpeed, fRotationSpeed) {
        var pGamepad = pGamepads.find(0);
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
        var pGamepad = pGamepads.find(0);
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
    function update() {
        updateCameras();
        akra.self.keymap.update();
    }
    function createModels() {
        var pImporter = new akra.io.Importer(pEngine);
        pImporter.loadDocument(pControllerData);
        pMovementController = pImporter.getController();
        akra.self.hero.root = createModelEx("HERO_MODEL", pScene, pTerrain, pCamera, pMovementController).findEntity("node-Bip001");
        var pBox = createModelEntry(pScene, "CLOSED_BOX");
        pBox.scale(.25);
        putOnTerrain(pBox, pTerrain, new akra.Vec3(-2., -3.85, -5.));
        pBox.addPosition(new akra.Vec3(0., 1., 0.));
        var pBarrel = createModelEntry(pScene, "BARREL");
        pBarrel.scale(.75);
        pBarrel.setPosition(new akra.Vec3(-30., -40.23, -15.00));
        pBarrel.setRotationByXYZAxis(-17. * akra.math.RADIAN_RATIO, -8. * akra.math.RADIAN_RATIO, -15. * akra.math.RADIAN_RATIO);
        var pTube = createModelEntry(pScene, "TUBE");
        pTube.scale(19.);
        pTube.setRotationByXYZAxis(0. * akra.math.RADIAN_RATIO, -55. * akra.math.RADIAN_RATIO, 0.);
        pTube.setPosition(new akra.Vec3(-16., -52.17, -66.));
        var pTubeBetweenRocks = createModelEntry(pScene, "TUBE_BETWEEN_ROCKS");
        pTubeBetweenRocks.scale(2.);
        pTubeBetweenRocks.setRotationByXYZAxis(5. * akra.math.RADIAN_RATIO, 100. * akra.math.RADIAN_RATIO, 0.);
        pTubeBetweenRocks.setPosition(new akra.Vec3(-55., -12.15, -82.00));
        pScene.bind("beforeUpdate", update);
        akra.self.cameras = fetchAllCameras(pScene);
        akra.self.activeCamera = akra.self.cameras.indexOf(akra.self.camera);
    }
    function main(pEngine) {
        setup(pCanvas, pUI);
        pCamera = akra.self.camera = createCameras(pScene);
        pViewport = createViewports(pCamera, pCanvas, pUI);
        pTerrain = akra.self.terrain = createTerrain(pScene);
        createModels();
        pSkyBoxTexture = createSkyBox(pRmgr, pViewport);
        pSky = akra.self.sky = createSky(pScene, 14.0);
        pKeymap.bind("equalsign", /** @inline */function () {
            akra.self.activeCamera++;
            if (akra.self.activeCamera === akra.self.cameras.length) {
                akra.self.activeCamera = 0;
            }
            var pCam = akra.self.cameras[akra.self.activeCamera];
            pViewport.setCamera(pCam);
        });
        createSceneEnvironment(pScene, true, true);
        pEngine.exec();
    }
    pEngine.bind("depsLoaded", main);
})(akra || (akra = {}));
