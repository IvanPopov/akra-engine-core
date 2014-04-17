


/*---------------------------------------------
 * assembled at: Wed Dec 25 2013 22:17:43 GMT+0400 (Московское время (зима))
 * directory: tests/common/game/DEBUG/
 * file: tests/common/game/game.ts
 * name: game
 *--------------------------------------------*/


var akra;
(function (akra) {
    (function (EGameHeroStates) {
        EGameHeroStates._map = [];
        EGameHeroStates._map[0] = "WEAPON_NOT_DRAWED";
        EGameHeroStates.WEAPON_NOT_DRAWED = 0;
        EGameHeroStates._map[1] = "WEAPON_IDLE";
        EGameHeroStates.WEAPON_IDLE = 1;
        EGameHeroStates._map[2] = "GUN_BEFORE_DRAW";
        EGameHeroStates.GUN_BEFORE_DRAW = 2;
        EGameHeroStates._map[3] = "GUN_DRAWING";
        EGameHeroStates.GUN_DRAWING = 3;
        EGameHeroStates._map[4] = "GUN_DRAWED";
        EGameHeroStates.GUN_DRAWED = 4;
        EGameHeroStates._map[5] = "GUN_BEFORE_IDLE";
        EGameHeroStates.GUN_BEFORE_IDLE = 5;
        EGameHeroStates._map[6] = "GUN_BEFORE_UNDRAW";
        EGameHeroStates.GUN_BEFORE_UNDRAW = 6;
        EGameHeroStates._map[7] = "GUN_UNDRAWING";
        EGameHeroStates.GUN_UNDRAWING = 7;
        EGameHeroStates._map[8] = "GUN_UNDRAWED";
        EGameHeroStates.GUN_UNDRAWED = 8;
        EGameHeroStates._map[9] = "HARPOON_BEFORE_DRAW";
        EGameHeroStates.HARPOON_BEFORE_DRAW = 9;
        EGameHeroStates._map[10] = "HARPOON_DRAWING";
        EGameHeroStates.HARPOON_DRAWING = 10;
        EGameHeroStates._map[11] = "HARPOON_DRAWED";
        EGameHeroStates.HARPOON_DRAWED = 11;
        EGameHeroStates._map[12] = "HARPOON_BEFORE_IDLE";
        EGameHeroStates.HARPOON_BEFORE_IDLE = 12;
        EGameHeroStates._map[13] = "HARPOON_BEFORE_UNDRAW";
        EGameHeroStates.HARPOON_BEFORE_UNDRAW = 13;
        EGameHeroStates._map[14] = "HARPOON_UNDRAWING";
        EGameHeroStates.HARPOON_UNDRAWING = 14;
        EGameHeroStates._map[15] = "HARPOON_UNDRAWED";
        EGameHeroStates.HARPOON_UNDRAWED = 15;
        EGameHeroStates._map[16] = "HARPOON_BEFORE_ATTACK";
        EGameHeroStates.HARPOON_BEFORE_ATTACK = 16;
        EGameHeroStates._map[17] = "HARPOON_ATTACKING";
        EGameHeroStates.HARPOON_ATTACKING = 17;
        EGameHeroStates._map[18] = "HARPOON_ATTACK_FINISHED";
        EGameHeroStates.HARPOON_ATTACK_FINISHED = 18;
    })(akra.EGameHeroStates || (akra.EGameHeroStates = {}));
    var EGameHeroStates = akra.EGameHeroStates;
    (function (EGameHeroWeapons) {
        EGameHeroWeapons._map = [];
        EGameHeroWeapons._map[0] = "NONE";
        EGameHeroWeapons.NONE = 0;
        EGameHeroWeapons._map[1] = "GUN";
        EGameHeroWeapons.GUN = 1;
        EGameHeroWeapons._map[2] = "HARPOON";
        EGameHeroWeapons.HARPOON = 2;
    })(akra.EGameHeroWeapons || (akra.EGameHeroWeapons = {}));
    var EGameHeroWeapons = akra.EGameHeroWeapons;
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
    function createSceneEnvironment(pScene, bHideQuad, bHideSurface, fSize) {
        if (typeof bHideQuad === "undefined") { bHideQuad = false; }
        if (typeof bHideSurface === "undefined") { bHideSurface = false; }
        if (typeof fSize === "undefined") { fSize = 100; }
        var pSceneQuad = akra.util.createQuad(pScene, fSize * 5.);
        pSceneQuad.attachToParent(pScene.getRootNode());
        pSceneQuad.mesh.getSubset(0).setVisible(!bHideQuad);
        var pSceneSurface = akra.util.createSceneSurface(pScene, fSize);
        // pSceneSurface.scale(5.);
        pSceneSurface.addPosition(0, -0.01, 0);
        pSceneSurface.attachToParent(pScene.getRootNode());
        pSceneSurface.mesh.getSubset(0).setVisible(!bHideSurface);
        // var pCameraTerrainProj: ISceneModel = util.basis(pScene);
        // pCameraTerrainProj.attachToParent(pScene.getRootNode());
        // pCameraTerrainProj.scale(.25);
        // self.cameraTerrainProj = pCameraTerrainProj;
            }
    function createViewports(pViewport, pCanvas, pUI) {
        if (typeof pUI === "undefined") { pUI = null; }
        pCanvas.addViewport(pViewport);
        if (akra.isNull(pUI)) {
            pCanvas.resize(window.innerWidth, window.innerHeight);
            window.onresize = function (event) {
                pCanvas.resize(window.innerWidth, window.innerHeight);
            };
        }
        return pViewport;
    }
    function createTerrain(pScene, bShowMegaTex) {
        if (typeof bShowMegaTex === "undefined") { bShowMegaTex = true; }
        var pRmgr = pScene.getManager().getEngine().getResourceManager();
        var pTerrain = pScene.createTerrainROAM("Terrain");
        var pTerrainMap = {};
        pTerrainMap["height"] = pRmgr.imagePool.findResource("TERRAIN_HEIGHT_MAP");
        pTerrainMap["normal"] = pRmgr.imagePool.findResource("TERRAIN_NORMAL_MAP");
        // pTerrain.manualMegaTextureInit = !bShowMegaTex;
        (pTerrain).useTessellationThread = false;
        var isCreate = pTerrain.init(pTerrainMap, new akra.geometry.Rect3d(-250, 250, -250, 250, 0, 150), 6, 4, 4, "main");
        pTerrain.attachToParent(pScene.getRootNode());
        pTerrain.setInheritance(akra.ENodeInheritance.ALL);
        pTerrain.setRotationByXYZAxis(-Math.PI / 2, 0., 0.);
        pTerrain.setPosition(11, -109, -109.85);
        var pMinLevel = pRmgr.imagePool.findResource("MEGATEXTURE_MIN_LEVEL");
        if (pMinLevel) {
            pTerrain.megaTexture.setMinLevelTexture(pMinLevel);
        }
        pTerrain.showMegaTexture = bShowMegaTex;
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
    var v3fOffset = new akra.Vec3();
    function updateKeyboardControls(pCamera, fLateralSpeed, fRotationSpeed, pKeymap, pGamepad) {
        if (typeof pGamepad === "undefined") { pGamepad = null; }
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
    function updateCamera(pCamera, pKeymap, pGamepad) {
        if (typeof pGamepad === "undefined") { pGamepad = null; }
        updateKeyboardControls(pCamera, 0.25, 0.05, pKeymap, pGamepad);
        //default camera.
        var pCanvas = pCamera._getLastViewport().getTarget().getRenderer().getDefaultCanvas();
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
        if (akra.math.abs(fX) < 0.25) {
            fX = 0;
        }
        if (akra.math.abs(fY) < 0.25) {
            fY = 0;
        }
        if (fX || fY) {
            pCamera.addRelRotationByEulerAngles(-fX / 10, -fY / 10, 0);
        }
    }
    var pVirtualGamepad = {
        id: "akra virtual gamepad",
        index: -1,
        timestamp: akra.now(),
        axes: [],
        buttons: []
    };
    function virtualGamepad(pKeymap) {
        var pGamepad = pVirtualGamepad;
        pGamepad.buttons[akra.EGamepadCodes.SELECT] = pKeymap.isKeyPress(akra.EKeyCodes.ENTER);
        pGamepad.buttons[akra.EGamepadCodes.START] = pKeymap.isKeyPress(akra.EKeyCodes.G);
        pGamepad.buttons[akra.EGamepadCodes.PAD_TOP] = pKeymap.isKeyPress(akra.EKeyCodes.UP);
        pGamepad.buttons[akra.EGamepadCodes.PAD_BOTTOM] = pKeymap.isKeyPress(akra.EKeyCodes.DOWN);
        pGamepad.buttons[akra.EGamepadCodes.PAD_LEFT] = pKeymap.isKeyPress(akra.EKeyCodes.LEFT);
        pGamepad.buttons[akra.EGamepadCodes.PAD_RIGHT] = pKeymap.isKeyPress(akra.EKeyCodes.RIGHT);
        pGamepad.buttons[akra.EGamepadCodes.FACE_1] = pKeymap.isKeyPress(akra.EKeyCodes.N5);
        pGamepad.buttons[akra.EGamepadCodes.FACE_2] = pKeymap.isKeyPress(akra.EKeyCodes.N6);
        pGamepad.buttons[akra.EGamepadCodes.FACE_3] = pKeymap.isKeyPress(akra.EKeyCodes.N7);
        pGamepad.buttons[akra.EGamepadCodes.FACE_4] = pKeymap.isKeyPress(akra.EKeyCodes.N8);
        pGamepad.buttons[akra.EGamepadCodes.RIGHT_SHOULDER_BOTTOM] = pKeymap.isKeyPress(akra.EKeyCodes.CTRL) ? 1.0 : 0.0;
        pGamepad.buttons[akra.EGamepadCodes.LEFT_SHOULDER_BOTTOM] = pKeymap.isKeyPress(akra.EKeyCodes.SHIFT) ? 1.0 : 0.0;
        var fX = (pKeymap.isKeyPress(akra.EKeyCodes.A) ? -1.0 : 0.0) + (pKeymap.isKeyPress(akra.EKeyCodes.D) ? 1.0 : 0.0);
        var fY = (pKeymap.isKeyPress(akra.EKeyCodes.S) ? 1.0 : 0.0) + (pKeymap.isKeyPress(akra.EKeyCodes.W) ? -1.0 : 0.0);
        pGamepad.axes[akra.EGamepadAxis.LEFT_ANALOGUE_VERT] = fY;
        pGamepad.axes[akra.EGamepadAxis.LEFT_ANALOGUE_HOR] = fX;
        fX = (pKeymap.isKeyPress(akra.EKeyCodes.NUMPAD4) ? -1.0 : 0.0) + (pKeymap.isKeyPress(akra.EKeyCodes.NUMPAD6) ? 1.0 : 0.0);
        fY = (pKeymap.isKeyPress(akra.EKeyCodes.NUMPAD5) ? 1.0 : 0.0) + (pKeymap.isKeyPress(akra.EKeyCodes.NUMPAD8) ? -1.0 : 0.0);
        pGamepad.axes[akra.EGamepadAxis.RIGHT_ANALOGUE_VERT] = fY;
        pGamepad.axes[akra.EGamepadAxis.RIGHT_ANALOGUE_HOR] = fX;
        return pGamepad;
    }
    var pProgress = createProgress();
    var pGameDeps = {
        root: "../",
        files: [
            {
                path: "game.ara",
                name: "DEMO_DATA_ARCHIVE"
            }
        ]
    };
    // files: [
    // 	{path: "textures/terrain/main_height_map_1025.dds", name: "TERRAIN_HEIGHT_MAP"},
    // 	{path: "textures/terrain/main_terrain_normal_map.dds", name: "TERRAIN_NORMAL_MAP"},
    // 	{path: "textures/skyboxes/desert-3.dds", name: "SKYBOX"}
    // ],
    // deps: {
    // 	files: [
    // 		{path: "models/barrel/barrel_and_support.dae", name: "BARREL"},
    // 		{path: "models/box/closed_box.dae", name: "CLOSED_BOX"},
    // 		{path: "models/tube/tube.dae", name: "TUBE"},
    // 		{path: "models/tubing/tube_beeween_rocks.DAE", name: "TUBE_BETWEEN_ROCKS"},
    // 		{path: "models/character/charZ.dae", name: "CHARACTER_MODEL"},
    // 		{path: "textures/terrain/diffuse.dds", name: "MEGATEXTURE_MIN_LEVEL"}
    // 	],
    // 	deps: {
    // 		files: [{path: "models/character/all-ih.json", name: "HERO_CONTROLLER"}]
    // 	}
    // }
    var pRenderOpts = {
        premultipliedAlpha: false,
        preserveDrawingBuffer: //for screenshoting
        true,
        alpha: //for black background & and avoiding composing with other html
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
                sText += ("resource " + (pFile.name || akra.path.info(akra.path.uri(pFile.path).path).basename));
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
    var pTestViewport = null;
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
            camera: null,
            triggers: [],
            controls: {
                direct: {
                    x: 0,
                    y: 0
                },
                forward: false,
                back: false,
                right: false,
                left: false,
                dodge: false,
                gun: false
            },
            parameters: {
                analogueButtonThreshold: 0.25,
                time: /*this.fTime*/
                0,
                timeDelta: 0.,
                manualSpeedControl: false,
                manualSpeedRate: 0.,
                movementRate: 0,
                movementRateThreshold: 0.0001,
                movementSpeedMax: /* sec */
                9.0,
                rotationSpeedMax: /* rad/sec*/
                10,
                rotationRate: /* current speed*/
                0,
                runSpeed: /* m/sec*/
                6.0,
                walkToRunSpeed: /* m/sec*/
                2.5,
                walkSpeed: /* m/sec*/
                1.8,
                walkbackSpeed: /* m/sec*/
                1.6,
                walkbackSpeedMin: /* m/sec*/
                0.5,
                walkWithWeaponSpeed: /* m/sec */
                1.4,
                walkWithWeaponSpeedMin: /* m/sec */
                0.75,
                walkWithoutWeaponSpeed: /* m/sec */
                1.8,
                movementDerivativeMax: 1.0,
                movementDerivativeMin: 0.5,
                movementDerivativeConst: (2 * (Math.E + 1) / (Math.E - 1) * /*(fSpeedDerivativeMax - fSpeedDerivativeMin)*/
                (1.0 - 0.5)),
                walkBackAngleRange: /*rad*/
                -0.85,
                cameraPitchChaseSpeed: //camera parameters
                /*rad/sec*/
                10.0,
                cameraPitchSpeed: 3.0,
                cameraPitchMax: -60.0 * akra.math.RADIAN_RATIO,
                cameraPitchMin: +30.0 * akra.math.RADIAN_RATIO,
                cameraPitchBase: Math.PI / 10,
                blocked: //triggers parameters
                true,
                lastTriggers: 1,
                position: //current hero postion
                new akra.Vec3(0.),
                cameraCharacterDistanceBase: //camer parameters
                /*метров [расстояние на которое можно убежать от центра камеры]*/
                5.0,
                cameraCharacterDistanceMax: 15.0,
                cameraCharacterChaseSpeed: /* m/sec*/
                25,
                cameraCharacterChaseRotationSpeed: /* rad/sec*/
                5.,
                cameraCharacterFocusPoint: /*meter*/
                new akra.Vec3(0.0, 0.5, 0.0),
                state: EGameHeroStates.WEAPON_NOT_DRAWED,
                weapon: EGameHeroWeapons.NONE,
                movementToHarpoonTime: //harpoon trigger params
                /*sec*/
                1.,
                stateToHarpoonTime: /*sec*/
                0.35,
                harpoonIdleToUndrawTime: /*sec*/
                .15,
                harpoonUndrawToIdleTime: /*sec*/
                .3,
                harpoonDrawToIdleTime: /*sec*/
                .2,
                harpoonToStateTime: /*sec*/
                0.35,
                movementToHarpoonEndTime: //temp variables for harpoon
                /*sec [temp/system] DO NOT EDIT!!!*/
                0.,
                harpoonDrawStartTime: /*sec [temp/system] DO NOT EDIT!!!*/
                0.,
                harpoonDrawToIdleStartTime: /*sec [temp/system] DO NOT EDIT!!!*/
                0.,
                harpoonIdleToUnDrawStartTime: /*sec [temp/system] DO NOT EDIT!!!*/
                0.,
                harpoonUndrawedTime: /*sec [temp/system] DO NOT EDIT!!!*/
                0.,
                harpoonUndrawStartTime: /*sec [temp/system] DO NOT EDIT!!!*/
                0.,
                temp: [
                    0., 
                    0., 
                    0., 
                    0.
                ],
                movementToGunTime: //gun trigger params
                /*sec*/
                1.,
                stateToGunTime: /*sec*/
                0.35,
                gunIdleToUndrawTime: /*sec*/
                .15,
                gunUndrawToIdleTime: /*sec*/
                .3,
                gunDrawToIdleTime: /*sec*/
                .2,
                gunToStateTime: /*sec*/
                0.35,
                movementToGunEndTime: //temp variables for gun
                /*sec [temp/system] DO NOT EDIT!!!*/
                0,
                idleWeightBeforeDraw: /*sec [temp/system] DO NOT EDIT!!!*/
                10,
                movementWeightBeforeUnDraw: /*sec [temp/system] DO NOT EDIT!!!*/
                10,
                gunDrawStartTime: /*sec [temp/system] DO NOT EDIT!!!*/
                0,
                gunDrawToIdleStartTime: /*sec [temp/system] DO NOT EDIT!!!*/
                0,
                gunIdleToUnDrawStartTime: /*sec [temp/system] DO NOT EDIT!!!*/
                0,
                gunUndrawedTime: /*sec [temp/system] DO NOT EDIT!!!*/
                0,
                gunUndrawStartTime: /*sec [temp/system] DO NOT EDIT!!!*/
                0,
                gunDirection: //gund direction beetween top and bottom(across Y-axis)
                0,
                inAttack: //attack state
                false,
                fallDown: //fall params
                false,
                fallTransSpeed: 0,
                fallStartTime: 0,
                anim: {}
            }
        }
    };
    pKeymap.captureMouse((pCanvas).el);
    pKeymap.captureKeyboard(document);
    function initState(pHeroNode) {
        var pStat = akra.self.hero.parameters;
        var pHeroRoot = akra.self.hero.root;
        //add animation to common object with fast access by string names
        function findAnimation(sName, sPseudo) {
            pStat.anim[sPseudo || sName] = pHeroNode.getController().findAnimation(sName);
            return pStat.anim[sPseudo || sName];
        }
        pStat.time = akra.self.engine.time;
        pStat.position.set(pHeroRoot.worldPosition);
        findAnimation("MOVEMENT.player");
        findAnimation("MOVEMENT.blend");
        findAnimation('STATE.player');
        findAnimation('STATE.blend');
        findAnimation("RUN.player");
        findAnimation("WALK.player");
        findAnimation("GUN.blend");
        findAnimation("HARPOON.blend");
        //harpoon animations
        var pAnimHarpoonCombo = findAnimation("HARPOON_COMBO.player");
        var pAnimHarpoonDraw = findAnimation("HARPOON_DRAW.player");
        var pAnimHarpoonUndraw = findAnimation("HARPOON_UNDRAW.player");
        //gun animations
        var pAnimGunDraw = findAnimation("GUN_DRAW.player");
        var pGunDrawBlend = findAnimation("GUN_DRAW.blend");
        var pAnimGunUnDraw = findAnimation("GUN_UNDRAW.player");
        var pGunUnDrawBlend = findAnimation("GUN_UNDRAW.blend");
        var pAnimGunIdle = findAnimation("GUN_IDLE.player");
        var pGunIdleBlend = findAnimation("GUN_IDLE.blend");
        var pAnimGunFire = findAnimation("GUN_FIRE.player");
        var pGunFireBlend = findAnimation("GUN_FIRE.blend");
        //right hand for nnode
        var pGunNode = pHeroRoot.findEntity("node-pistol_in_r_hand");
        var pRightHolster = pHeroRoot.findEntity("node-Dummy01");
        var pRightHand = pHeroRoot.findEntity("node-Dummy06");
        //harpoon.blend
        //	0 - combo
        //	1 - idle
        //	2 - draw
        //	3 - undraw
        //gun.blend
        //	0 - idle
        //	1 - fire
        //	2 - draw
        //	3 - undraw
        //movement.blend
        //	0 - run
        //	1 - walk
        //	2 - walkback
        //	3 - gun-walk
        //	4 - gun-fire
        //	5 - harpoon-walk
        //state.blend
        // 0 - idle_0
        // 1 - idle_1
        // 2 - movement
        // 3 - gun
        // 4 - harpoon
        //node with harpoon in right hand
        var pHarpoonNode = [
            (pHeroRoot.findEntity("node-Mesh04").child), 
            (pHeroRoot.findEntity("node-Mesh05").child), 
            (pHeroRoot.findEntity("node-Mesh06").child)
        ];
        //nodes with harpoon in backpack
        var pHarpoonBackpackNode = [
            (pHeroRoot.findEntity("node-Mesh002").child), 
            (pHeroRoot.findEntity("node-Mesh003").child), 
            (pHeroRoot.findEntity("node-Mesh07").child)
        ];
        //hide harpoon in right hand
        pHarpoonNode.forEach(function (pModel) {
            pModel.visible = false;
        });
        //disable loops (not nessasary)
        pAnimGunDraw.useLoop(false);
        pAnimGunUnDraw.useLoop(false);
        //disable loops (not nessasary)
        pAnimHarpoonDraw.useLoop(false);
        pAnimHarpoonUndraw.useLoop(false);
        pAnimHarpoonCombo.useLoop(false);
        pGunNode.attachToParent(pRightHolster);
        if (akra.isDefAndNotNull(pAnimGunDraw)) {
            var fGunDrawAttachmentTime = (15 / 46) * pAnimGunDraw.duration;
            pAnimGunDraw.bind("enterFrame", function (pAnim, fRealTime, fTime) {
                if (fTime < fGunDrawAttachmentTime) {
                    pGunNode.attachToParent(pRightHolster);
                } else {
                    pGunNode.attachToParent(pRightHand);
                }
            });
        }
        if (akra.isDefAndNotNull(pAnimGunUnDraw)) {
            var fGunUnDrawAttachmentTime = (21 / 53) * pAnimGunUnDraw.duration;
            pAnimGunUnDraw.bind("enterFrame", function (pAnim, fRealTime, fTime) {
                if (fTime < fGunUnDrawAttachmentTime) {
                    pGunNode.attachToParent(pRightHand);
                } else {
                    pGunNode.attachToParent(pRightHolster);
                }
            });
        }
        pAnimGunFire.setSpeed(1.);
        if (akra.isDefAndNotNull(pAnimGunFire)) {
            var fGunFireTime = (9 / 53) * pAnimGunUnDraw.duration;
            pAnimGunFire.bind("enterFrame", function (pAnim, fRealTime, fTime) {
                if (fTime >= fGunFireTime) {
                    // console.log("fire...");
                                    }
            });
        }
        //hide harpoon in backpack and show  harpoon in right hand
        if (akra.isDefAndNotNull(pAnimHarpoonDraw)) {
            var fHarpoonDrawTime = (29 / 75) * pAnimHarpoonDraw.duration;
            pAnimHarpoonDraw.bind("enterFrame", function (pAnim, fRealTime, fTime) {
                if (fTime < fHarpoonDrawTime) {
                    pHarpoonBackpackNode.forEach(function (pModel, i) {
                        pHarpoonBackpackNode[i].visible = true;
                        pHarpoonNode[i].visible = false;
                    });
                } else {
                    pHarpoonBackpackNode.forEach(function (pModel, i) {
                        pHarpoonBackpackNode[i].visible = false;
                        pHarpoonNode[i].visible = true;
                    });
                }
            });
        }
        //hide harpoon in right hand and show backpack harpoon
        if (akra.isDefAndNotNull(pAnimHarpoonUndraw)) {
            var fHarpoonUndrawTime = (44 / 70) * pAnimHarpoonUndraw.duration;
            pAnimHarpoonUndraw.bind("enterFrame", function (pAnim, fRealTime, fTime) {
                if (fTime < fHarpoonUndrawTime) {
                    pHarpoonBackpackNode.forEach(function (pModel, i) {
                        pHarpoonBackpackNode[i].visible = false;
                        pHarpoonNode[i].visible = true;
                    });
                } else {
                    pHarpoonBackpackNode.forEach(function (pModel, i) {
                        pHarpoonBackpackNode[i].visible = true;
                        pHarpoonNode[i].visible = false;
                    });
                }
            });
        }
        /*
        run,
        walk,
        walkback,
        weapon_walk,
        gun-fire
        harpoon-walk
        */
        findAnimation('MOVEMENT.blend').setWeights(0., 1., 0., 0., 0., 0.);
        /*
        idle_0,
        idle_1,
        movement,
        gun,
        harpoon
        */
        findAnimation('STATE.blend').setWeights(1., 0., 0., 0., 0.);
        activateTrigger([
            moveHero, 
            movementHero, 
            checkHeroState
        ]);
    }
    function updateCharacterCamera(pControls, pHero, pStat, pController) {
        var pCamera = akra.self.hero.camera;
        var fTimeDelta = pStat.timeDelta;
        var pGamepad = akra.self.gamepads.find(0) || virtualGamepad(pKeymap);
        if (!pGamepad || !pCamera.isActive()) {
            return;
        }
        var fX = -pGamepad.axes[akra.EGamepadAxis.RIGHT_ANALOGUE_HOR];
        var fY = -pGamepad.axes[akra.EGamepadAxis.RIGHT_ANALOGUE_VERT];
        if (akra.math.abs(fX) < pStat.analogueButtonThreshold) {
            fX = 0;
        }
        if (akra.math.abs(fY) < pStat.analogueButtonThreshold) {
            fY = 0;
        }
        // var pCameraWorldData: Float32Array = pCamera.worldMatrix.data;
        var v3fHeroFocusPoint = pStat.cameraCharacterFocusPoint.add(akra.self.hero.pelvis.worldPosition, akra.Vec3.stackCeil.set());
        var v3fCameraHeroDist;
        // camera orientation
        var v3fCameraYPR = pCamera.localOrientation.toYawPitchRoll(akra.Vec3.stackCeil.set());
        var fPitchRotation = 0;
        var qPitchRot;
        var fYawRotation = 0;
        var qYawRot;
        /*
        Pitch
        | -90(-PI/2)
        0   |
        --|-- +
        / \  |
        | +90(+PI/2)
        */
        // console.log(pStat.cameraPitchMax * math.DEGREE_RATIO, "<", v3fCameraYPR.y * math.DEGREE_RATIO, "<", pStat.cameraPitchMin * math.DEGREE_RATIO, fY, (v3fCameraYPR.y > pStat.cameraPitchMax && fY > 0));
        if ((v3fCameraYPR.y > pStat.cameraPitchMax && fY > 0) || (v3fCameraYPR.y < pStat.cameraPitchMin && fY < 0)) {
            fPitchRotation = fY * pStat.cameraPitchSpeed * fTimeDelta;
            var pCameraWorldData = pCamera.worldMatrix.data;
            var v3fCameraDir = akra.Vec3.stackCeil.set(-pCameraWorldData[akra.__13], 0, -pCameraWorldData[akra.__33]).normalize();
            var v3fCameraOrtho = akra.Vec3.stackCeil.set(v3fCameraDir.z, 0, -v3fCameraDir.x);
            qPitchRot = akra.Quat4.fromAxisAngle(v3fCameraOrtho, fPitchRotation, akra.Quat4.stackCeil.set());
            v3fCameraHeroDist = pCamera.worldPosition.subtract(v3fHeroFocusPoint, akra.Vec3.stackCeil.set());
            pCamera.localPosition = qPitchRot.multiplyVec3(v3fCameraHeroDist, akra.Vec3.stackCeil.set()).add(v3fHeroFocusPoint);
            pCamera.update();
            // pCamera.localPosition.scale(1. + fY / 25);
            // pCamera.update();
                    }
        fYawRotation = fX * pStat.cameraPitchChaseSpeed * fTimeDelta;
        qYawRot = akra.Quat4.fromYawPitchRoll(fYawRotation, 0, 0., akra.Quat4.stackCeil.set());
        v3fCameraHeroDist = pCamera.worldPosition.subtract(v3fHeroFocusPoint, akra.Vec3.stackCeil.set());
        pCamera.localPosition = qYawRot.multiplyVec3(v3fCameraHeroDist, akra.Vec3.stackCeil.set()).add(v3fHeroFocusPoint);
        pCamera.update();
        //camera position
        var fCharChaseSpeedDelta = (pStat.cameraCharacterChaseSpeed * fTimeDelta);
        var fCameraHeroDist = v3fCameraHeroDist.length();
        var fDist = (fCameraHeroDist - pStat.cameraCharacterDistanceBase) / pStat.cameraCharacterDistanceMax * fCharChaseSpeedDelta;
        var v3fHeroZX = akra.Vec3.stackCeil.set(v3fHeroFocusPoint);
        v3fHeroZX.y = 0.0;
        var v3fCameraZX = akra.Vec3.stackCeil.set(pCamera.worldPosition);
        v3fCameraZX.y = 0.0;
        //направление в плоскости XZ от камеры к персонажу(фокус поинту)
        var v3fHorDist = v3fHeroZX.subtract(v3fCameraZX, akra.Vec3.stackCeil.set());
        var v3fDir = v3fHorDist.normalize(akra.Vec3.stackCeil.set());
        if (v3fHorDist.length() > 2.0 || fDist <= 0) {
            pCamera.addPosition(v3fDir.scale(fDist));
        }
        //настигаем нужную высоту
        var fDeltaHeight = (v3fHeroFocusPoint.y + akra.math.sin(pStat.cameraPitchBase) * fCameraHeroDist - pCamera.worldPosition.y);
        pCamera.addPosition(akra.Vec3.stackCeil.set(0., (fDeltaHeight * fCharChaseSpeedDelta * akra.math.abs(fDeltaHeight / 100)), 0.));
        pCamera.update();
        if (!akra.isNull(pTerrain)) {
            var v3fDt = akra.Vec3.stackCeil.set(0.);
            pTerrain.projectPoint(pCamera.worldPosition, v3fDt);
            v3fDt.x = pCamera.worldPosition.x;
            v3fDt.y = akra.math.max(v3fDt.y + 1.0, pCamera.worldPosition.y);
            v3fDt.z = pCamera.worldPosition.z;
            pCamera.setPosition(v3fDt);
        }
        // pCamera.update();
        //camera orientation
        /* + fPitchRotation*/
        var qCamera = akra.Quat4.fromYawPitchRoll(v3fCameraYPR.x + fYawRotation, v3fCameraYPR.y, v3fCameraYPR.z);
        var qHeroView = akra.Mat4.lookAt(pCamera.worldPosition, v3fHeroFocusPoint, akra.Vec3.stackCeil.set(0., 1., 0.), akra.Mat4.stackCeil.set()).toQuat4(akra.Quat4.stackCeil.set());
        qCamera.smix(qHeroView.conjugate(), pStat.cameraCharacterChaseRotationSpeed * fTimeDelta);
        pCamera.localOrientation = qCamera;
        pCamera.update();
        //====================
        //pStat.cameraPitchChaseSpeed
        //-pStat.cameraPitchBase
        //-pStat.cameraPitchMin
        //-pStat.cameraPitchMax
        //pStat.cameraPitchSpeed
            }
    function fireInWalk(pControls, pHero, pStat, pController) {
        var pAnim = pStat.anim;
        var pMovementBlend = pAnim["MOVEMENT.blend"];
        var pFirePlayer = pAnim["GUN_FIRE.player"];
        var fTimeDelta = pStat.timeDelta;
        var iFireAnim = 4;
        var iTotalFireAnimWeight = 100;
        var iWeight = pMovementBlend.getAnimationWeight(iFireAnim);
        if (((pControls).fire > 0.2)) {
            if (iWeight == 0) {
                console.log("fire player > rewind && pause");
                pFirePlayer.rewind(0.);
                pFirePlayer.pause(true);
            }
            var iSpeed = 3.;
            if (iWeight > 1.) {
                iSpeed = 10.;
            }
            if (iWeight < iTotalFireAnimWeight) {
                iWeight += iSpeed * fTimeDelta;
            }
            iWeight = akra.math.clamp(iWeight, 0., iTotalFireAnimWeight);
            if (iWeight > 10. && pFirePlayer.isPaused()) {
                pFirePlayer.pause(false);
            }
            //добавляем выстрелы
            pMovementBlend.setAnimationWeight(iFireAnim, iWeight);
        } else {
            var fK = (1. - pFirePlayer.animationTime / pFirePlayer.duration);
            if (fK > iWeight) {
                pMovementBlend.setAnimationWeight(iFireAnim, 0);
            } else {
                pMovementBlend.setAnimationWeight(iFireAnim, fK);
            }
        }
    }
    function movementHero(pControls, pHero, pStat, pController) {
        var pAnim = pStat.anim;
        var pMovementPlayer = pAnim["MOVEMENT.player"];
        var pMovementBlend = pAnim["MOVEMENT.blend"];
        var pWalkPlayer = pAnim["WALK.player"];
        var pRunPlayer = pAnim["RUN.player"];
        var pStateBlend = pAnim["STATE.blend"];
        var fMovementRate = pStat.movementRate;
        var fMovementRateAbs = akra.math.abs(fMovementRate);
        var fRunSpeed = pStat.runSpeed;
        var fWalkToRunSpeed = pStat.walkToRunSpeed;
        var fWalkSpeed = determWalkSpeed(pStat);
        var fMinSpeed = determMinSpeed(pStat);
        var fMaxSpeed = determMaxSpeed(pStat);
        var fSpeed;
        var fRunWeight;
        var fWalkWeight;
        fSpeed = fMovementRateAbs * fMaxSpeed;
        if (pController.active) {
            if (pController.active.name !== "STATE.player") {
                pController.play('STATE.player');
            }
        } else {
            console.warn("controller::active is null ;(");
        }
        //character move
        if (fSpeed > fMinSpeed) {
            var iWEAPON = ((pStat).weapon === EGameHeroWeapons.GUN) ? 3 : 4;
            if (pMovementPlayer.isPaused()) {
                pMovementPlayer.pause(false);
            }
            //зануляем IDLE'ы чтобы избежать проблем с тазом
            pStateBlend.setWeights(0., 0., 1., 0.);
            if (fMovementRate > 0.0) {
                //run forward
                if (fSpeed < fWalkToRunSpeed || ((pStat).weapon != EGameHeroWeapons.NONE)) {
                    if (((pStat).weapon != EGameHeroWeapons.NONE)) {
                        if (((pStat).weapon === EGameHeroWeapons.GUN)) {
                            /*only walk*/
                            pMovementBlend.setWeights(0., 0., 0., 1., 0.);
                            fireInWalk(pControls, pHero, pStat, pController);
                        }
                        if (((pStat).weapon === EGameHeroWeapons.HARPOON)) {
                            /*only walk*/
                            pMovementBlend.setWeights(0., 0., 0., 0., 0., 1.);
                        }
                    } else {
                        /* only walk */
                        pMovementBlend.setWeights(0., 1., 0., 0., 0.);
                    }
                    pWalkPlayer.setSpeed(fSpeed / fWalkSpeed);
                } else {
                    pWalkPlayer.setSpeed(1.);
                    fRunWeight = (fSpeed - fWalkToRunSpeed) / (fRunSpeed - fWalkToRunSpeed);
                    fWalkWeight = 1. - fRunWeight;
                    //run //walk frw //walk back
                    pMovementBlend.setWeights(fRunWeight, fWalkWeight, 0., 0., 0.);
                    pMovementPlayer.setSpeed(1.);
                }
            } else {
                //walkback
                pMovementBlend.setWeights(0., 0., 1., 0., 0.);
                pMovementPlayer.setSpeed(fMovementRateAbs);
            }
        } else//character IDLE
         {
            pMovementPlayer.pause(true);
            //pMovementPlayer.rewind(0);
            var iWEAPON = ((pStat).weapon === EGameHeroWeapons.GUN) ? 3 : 4;
            var iIDLE = ((pStat).weapon != EGameHeroWeapons.NONE) ? iWEAPON : 0.;
            var iMOVEMENT = 2;
            if ((!((pStat).weapon != EGameHeroWeapons.NONE) || pStat.state == EGameHeroStates.WEAPON_IDLE)) {
                /* idle ---> run */
                pStateBlend.setWeightSwitching(fSpeed / fMinSpeed, iIDLE, iMOVEMENT);
            }
            if (fMovementRate > 0.0) {
                //walk forward --> idle
                if (((pStat).weapon != EGameHeroWeapons.NONE)) {
                    if (((pStat).weapon === EGameHeroWeapons.GUN)) {
                        pMovementBlend.setWeights(0., 0., 0., fSpeed / fMinSpeed, 0., 0.);
                    }
                    if (((pStat).weapon === EGameHeroWeapons.HARPOON)) {
                        pMovementBlend.setWeights(0., 0., 0., 0., 0., fSpeed / fMinSpeed);
                    }
                } else {
                    pMovementBlend.setWeights(0., fSpeed / fMinSpeed, 0., 0., 0., 0., 0.);
                }
            } else if (fMovementRate < 0.0) {
                //walk back --> idle
                pMovementBlend.setWeights(0., 0, fSpeed / fMinSpeed, 0., 0., 0.);
            }
            pMovementPlayer.setSpeed(1);
        }
        // if (pController.dodge) {
        //     this.activateTrigger([this.dodgeHero, this.moveHero]);
        // }
            }
    /** @inline */function inAttack(pControls) {
        return pControls.fire > 0.2;
    }
    /** @inline */function hasWeapon(pStat) {
        return pStat.weapon != EGameHeroWeapons.NONE;
    }
    function checkHeroState(pControls, pHero, pStat, pController) {
        if (pControls.gun) {
            activateTrigger([
                gunWeaponHero, 
                moveHero
            ]);
        } else if (pControls.harpoon) {
            activateTrigger([
                harpoonWeaponHero, 
                moveHero
            ]);
        }
    }
    function determWalkSpeed(pStat) {
        return pStat.movementRate > 0.0 ? (!((pStat).weapon != EGameHeroWeapons.NONE) ? pStat.walkWithoutWeaponSpeed : pStat.walkWithWeaponSpeed) : pStat.walkbackSpeed;
    }
    function determMaxSpeed(pStat) {
        return pStat.movementRate > 0.0 ? (!((pStat).weapon != EGameHeroWeapons.NONE) ? pStat.runSpeed : pStat.walkWithWeaponSpeed) : pStat.walkbackSpeed;
    }
    function determMinSpeed(pStat) {
        return pStat.movementRate > 0.0 ? (!((pStat).weapon != EGameHeroWeapons.NONE) ? pStat.walkWithoutWeaponSpeed : pStat.walkWithWeaponSpeedMin) : pStat.walkbackSpeedMin;
    }
    /** @inline */function isGun(pStat) {
        return pStat.weapon === EGameHeroWeapons.GUN;
    }
    /** @inline */function isHarpoon(pStat) {
        return pStat.weapon === EGameHeroWeapons.HARPOON;
    }
    /** @inline */function disableMovement(pControls) {
        pControls.direct.x = pControls.direct.y = 0.;
    }
    function harpoonWeaponHero(pControls, pHero, pStat, pController) {
        // console.log((<IAnimationBlend>pStat.anim["STATE.blend"]).getAnimationWeight(3.), "gun weight << ");
        var pAnim = pStat.anim;
        var fMovementRate = pStat.movementRate;
        var fMovementRateAbs = akra.math.abs(fMovementRate);
        var fWalkSpeed = determWalkSpeed(pStat);
        var fMinSpeed = determMinSpeed(pStat);
        var fMaxSpeed = determMaxSpeed(pStat);
        var fSpeed = fMaxSpeed * fMovementRateAbs;
        var fDelta;
        var pHarpoonDrawPlayer = pAnim['HARPOON_DRAW.player'];
        var pHarpoonUnDrawPlayer = pAnim['HARPOON_UNDRAW.player'];
        var pHarpoonIdlePlayer = pAnim['HARPOON_IDLE.player'];
        var pHarpoonComboPlayer = pAnim['HARPOON_COMBO.player'];
        var pHarpoonBlend = pAnim['HARPOON.blend'];
        var pStateBlend = pAnim['STATE.blend'];
        var pMovementBlend = pAnim["MOVEMENT.blend"];
        var pWalkPlayer = pAnim["WALK.player"];
        var pRunPlayer = pAnim["RUN.player"];
        var fNow = akra.now() / 1000;
        if ((/*checked (origin: akra)>>*/akra.self.hero.parameters.lastTriggers !== /*checked (origin: akra)>>*/akra.self.hero.triggers.length)) {
            pStat.weapon = EGameHeroWeapons.HARPOON;
            //переводим персонажа в состоянии убранного гарпуна
            //имеенно в это состояние мы будем переходим, при условии, что у нас нету гарпуна
            pHarpoonDrawPlayer.rewind(0.);
            pHarpoonDrawPlayer.pause(true);
            /*combo, idle, draw, undraw*/
            pHarpoonBlend.setWeights(0., 0., 1., 0.);
        }
        if (pStat.state !== EGameHeroStates.WEAPON_IDLE) {
            ((pControls).direct.x = (pControls).direct.y = 0.);
        }
        if (pStat.state == EGameHeroStates.WEAPON_NOT_DRAWED && fSpeed < 0.5) {
            pStat.state = EGameHeroStates.HARPOON_BEFORE_DRAW;
            //с этого времени стало понятно, что надо достать гарпун
            pStat.movementToHarpoonEndTime = fNow;
            //необходимо для перехода в состояние с оружием, надо быстро
            //перевести персонажа state::IDLE --> state::HARPOON
            //за время stat.stateToHarpoonTime(sec.)
            pStat.idleWeightBeforeDraw = pStateBlend.getAnimationWeight(0);
        }
        //переводим персонажа в состояние state::HARPOON при условии, что
        //его скорость меньше скорости хотьбы, это важно, так как во всех остальных случаях
        //мы зануляем controls.direct.x = controls.direct.y = 0, принуждая его остановиться
        if (fSpeed < fMinSpeed) {
            //время с момента, как стало ясно, что надо доставать гарпун
            fDelta = fNow - pStat.movementToHarpoonEndTime;
            if (fDelta <= pStat.stateToHarpoonTime) {
                //вес state::HARPOON
                var fK = fDelta / pStat.stateToHarpoonTime;
                //вес state::IDLE
                var fkInv = 1. - fK;
                pStateBlend.setWeights(pStat.idleWeightBeforeDraw * fkInv, null, null, null, fK);
            }
        }
        if (pStat.state == EGameHeroStates.HARPOON_BEFORE_DRAW) {
            //с этого момента, должна начать играться анимация доставания питолета
            pHarpoonDrawPlayer.pause(false);
            pStat.state = EGameHeroStates.HARPOON_DRAWING;
            pStat.harpoonDrawStartTime = fNow;
        } else if (pStat.state == EGameHeroStates.HARPOON_DRAWING) {
            fDelta = fNow - pStat.harpoonDrawStartTime;
            if (fDelta >= pHarpoonBlend.duration) {
                pStat.state = EGameHeroStates.HARPOON_DRAWED;
                pStat.harpoonDrawToIdleStartTime = fNow;
            }
        }
        if (pStat.state == EGameHeroStates.HARPOON_DRAWED) {
            fDelta = fNow - pStat.harpoonDrawToIdleStartTime;
            if (fDelta <= pStat.harpoonDrawToIdleTime) {
                //переходим от harpoon::DRAW --> harpoon::IDLE
                pHarpoonBlend.setWeightSwitching(fDelta / pStat.harpoonDrawToIdleTime, 2, 1);
            } else {
                pStat.state = EGameHeroStates.WEAPON_IDLE;
                pHarpoonBlend.setWeights(0., 1., 0., 0.);
                pStateBlend.setWeights(0., 0., 0., 0., 1.);
            }
        } else if (pStat.state == EGameHeroStates.WEAPON_IDLE) {
            if (((pControls).fire > 0.2) && !pStat.inAttack) {
                pStat.inAttack = true;
                pStat.state = EGameHeroStates.HARPOON_BEFORE_ATTACK;
                pHarpoonComboPlayer.pause(true);
                pHarpoonComboPlayer.rewind(0.);
                pStat.temp[0] = fNow;
                pStat.temp[1] = pHarpoonBlend.getAnimationWeight(1.);
            }
            // if (pStat.inAttack && !inAttack(pControls)) {
            // 	var fK: float = (1. - pHarpoonComboPlayer.animationTime / pHarpoonComboPlayer.duration);
            // 	if (fK > pHarpoonBlend.getAnimationWeight(0)) {
            // 		pHarpoonBlend.setAnimationWeight(0, 0);
            // 		pStat.inAttack = false;
            // 	}
            // 	else {
            // 		pHarpoonBlend.setAnimationWeight(0, fK);
            // 	}
            // }
            if (pControls.harpoon) {
                pHarpoonUnDrawPlayer.rewind(0.);
                pHarpoonUnDrawPlayer.pause(true);
                pStat.harpoonIdleToUnDrawStartTime = fNow;
                pStat.movementWeightBeforeUnDraw = pStateBlend.getAnimationWeight(2.);
                pStat.state = EGameHeroStates.HARPOON_BEFORE_UNDRAW;
            }
        } else if (pStat.state == EGameHeroStates.HARPOON_BEFORE_ATTACK) {
            fDelta = fNow - pStat.temp[0];
            if (fDelta <= pStat.harpoonIdleToUndrawTime) {
                //переходим из harpoon::IDLE --> harpoon::COMBO
                pHarpoonBlend.setWeightSwitching(fDelta / pStat.harpoonIdleToUndrawTime, 1, 0);
            } else {
                pHarpoonBlend.setWeights(1., 0., 0., 0.);
                pHarpoonComboPlayer.pause(false);
                pStat.state = EGameHeroStates.HARPOON_ATTACKING;
            }
        } else if (pStat.state == EGameHeroStates.HARPOON_ATTACKING) {
            //in attacking
            pStat.manualSpeedControl = true;
            pStat.manualSpeedRate = 1.5 / 1.4;
            var iJumpTime = 70 / 125 * pHarpoonComboPlayer.duration;
            if (pHarpoonComboPlayer.animationTime >= iJumpTime) {
            }
            //attack finished
            if (pHarpoonComboPlayer.animationTime >= pHarpoonComboPlayer.duration) {
                pStat.manualSpeedRate = 0.;
                pStat.state = EGameHeroStates.HARPOON_ATTACK_FINISHED;
                pStat.temp[0] = fNow;
            }
        } else if (pStat.state == EGameHeroStates.HARPOON_ATTACK_FINISHED) {
            fDelta = fNow - pStat.temp[0];
            if (fDelta <= pStat.harpoonIdleToUndrawTime) {
                pStat.manualSpeedControl = false;
                //переходим из harpoon::IDLE --> harpoon::COMBO
                pHarpoonBlend.setWeightSwitching(fDelta / pStat.harpoonIdleToUndrawTime, 0, 1);
            } else {
                pHarpoonBlend.setWeights(0., 1., 0., 0.);
                pStat.state = EGameHeroStates.WEAPON_IDLE;
                pStat.inAttack = false;
            }
        } else if (pStat.state == EGameHeroStates.HARPOON_BEFORE_UNDRAW) {
            fDelta = fNow - pStat.harpoonIdleToUnDrawStartTime;
            if (fDelta <= pStat.harpoonIdleToUndrawTime) {
                var fK = fDelta / pStat.harpoonIdleToUndrawTime;
                pStateBlend.setWeights(pStat.movementWeightBeforeUnDraw * (1. - fK), null, null, 0., fK);
                //переходим из harpoon::IDLE --> harpoon.UNDRAW
                pHarpoonBlend.setWeightSwitching(fDelta / pStat.harpoonIdleToUndrawTime, 1, 3);
            } else {
                /* idle_0, idle_1, movement, gun, harpoon */
                pStateBlend.setWeights(0., 0., 0., 0., 1.);
                //undraw only!
                pHarpoonBlend.setWeights(0., 0., 0., 1.);
                pStat.harpoonUndrawStartTime = fNow;
                pStat.state = EGameHeroStates.HARPOON_UNDRAWING;
                pHarpoonUnDrawPlayer.pause(false);
            }
        } else if (pStat.state == EGameHeroStates.HARPOON_UNDRAWING) {
            fDelta = fNow - pStat.harpoonUndrawStartTime;
            if (fDelta >= pHarpoonBlend.duration) {
                pStat.state = EGameHeroStates.HARPOON_UNDRAWED;
                pStat.harpoonUndrawedTime = fNow;
            }
        } else if (pStat.state == EGameHeroStates.HARPOON_UNDRAWED) {
            fDelta = fNow - pStat.harpoonUndrawedTime;
            if (fDelta <= pStat.harpoonUndrawToIdleTime) {
                //переходим из state::HARPOON --> state.IDLE
                console.log("переходим из state::HARPOON --> state.IDLE");
                pStateBlend.setWeightSwitching(fDelta / pStat.harpoonUndrawToIdleTime, 4, 0);
            } else {
                console.log("EGameHeroStates.HARPOON_UNDRAWED finished!");
                pStateBlend.setWeights(1., 0., 0., 0., 0.);
                pMovementBlend.setWeights(0., 1., 0., 0., 0.);
                pRunPlayer.rewind(0.);
                pWalkPlayer.rewind(0.);
                pRunPlayer.setSpeed(1.);
                pWalkPlayer.setSpeed(1.);
                pRunPlayer.pause(false);
                pWalkPlayer.pause(false);
                pStat.state = EGameHeroStates.WEAPON_NOT_DRAWED;
                pStat.weapon = EGameHeroWeapons.NONE;
                deactivateTrigger();
            }
        }
        if (pStat.state < EGameHeroStates.HARPOON_BEFORE_UNDRAW) {
            movementHero(pControls, pHero, pStat, pController);
        }
    }
    ;
    function gunWeaponHero(pControls, pHero, pStat, pController/*, fTriggerTime*/
    ) {
        var pAnim = pStat.anim;
        var fMovementRate = pStat.movementRate;
        var fMovementRateAbs = akra.math.abs(fMovementRate);
        var fRunSpeed = pStat.runSpeed;
        var fWalkToRunSpeed = pStat.walkToRunSpeed;
        var fWalkSpeed = determWalkSpeed(pStat);
        var fMinSpeed = determMinSpeed(pStat);
        var fMaxSpeed = determMaxSpeed(pStat);
        var fSpeed = fMaxSpeed * fMovementRateAbs;
        var fDelta;
        var pGunDrawAnim = pAnim['GUN_DRAW.player'];
        var pGunDrawBlend = pAnim['GUN_DRAW.blend'];
        var pGunUnDrawAnim = pAnim['GUN_UNDRAW.player'];
        var pGunUnDrawBlend = pAnim['GUN_UNDRAW.blend'];
        var pGunIdleAnim = pAnim['GUN_IDLE.player'];
        var pGunIdleBlend = pAnim['GUN_IDLE.blend'];
        var pGunBlend = pAnim['GUN.blend'];
        var pStateBlend = pAnim['STATE.blend'];
        var pFireBlend = pAnim['GUN_FIRE.blend'];
        var pFirePlayer = pAnim['GUN_FIRE.player'];
        var pMovementBlend = pAnim["MOVEMENT.blend"];
        var pWalkPlayer = pAnim["WALK.player"];
        var pRunPlayer = pAnim["RUN.player"];
        var fNow = akra.now() / 1000;
        if (pControls.forward && pStat.gunDirection < 1.) {
            pStat.gunDirection += 0.05;
        }
        if (pControls.back && pStat.gunDirection > -1.) {
            pStat.gunDirection -= 0.05;
        }
        //положение пистолета(куда направлен, вверх или вниз)
        var fGd = akra.math.clamp(pStat.gunDirection, -1, 1);
        //веса верхнего, прямого и нижнего положений
        var fGKup = akra.math.max(fGd, 0.);
        var fGKfrw = (1. - akra.math.abs(fGd));
        var fGKdown = akra.math.abs(akra.math.min(fGd, 0));
        var isOK = true;
        if ((/*checked (origin: akra)>>*/akra.self.hero.parameters.lastTriggers !== /*checked (origin: akra)>>*/akra.self.hero.triggers.length)) {
            pStat.weapon = EGameHeroWeapons.GUN;
            //переводим персонажа в состоянии убранного пистолета
            //имеенно в это состояние мы будем переходим, при условии, что у нас нету пистолета
            pGunDrawAnim.rewind(0.);
            pGunDrawAnim.pause(true);
            /*idle, fire, draw, undraw*/
            pGunBlend.setWeights(0., 0., 1., 0.);
        }
        if (pStat.state !== EGameHeroStates.WEAPON_IDLE) {
            pControls.direct.x = pControls.direct.y = 0.;
        }
        if (pStat.state == EGameHeroStates.WEAPON_NOT_DRAWED && fSpeed < 0.5) {
            console.log('getting gun...');
            pStat.state = EGameHeroStates.GUN_BEFORE_DRAW;
            //с этого времени стало понятно, что надо достать пистолет
            pStat.movementToGunEndTime = fNow;
            //необходимо для перехода в состояние с оружием, надо быстро
            //перевести персонажа state::IDLE --> state::GUN
            //за время stat.stateToGunTime(sec.)
            pStat.idleWeightBeforeDraw = pStateBlend.getAnimationWeight(0);
        }
        //переводим персонажа в состояние state::GUN при условии, что
        //его скорость меньше скорости хотьбы, это важно, так как во всех остальных случаях
        //мы зануляем controls.direct.x = controls.direct.y = 0, принуждая его остановиться
        if (fSpeed < fMinSpeed) {
            //время с момента, как стало ясно, что надо доставать пистолет
            fDelta = fNow - pStat.movementToGunEndTime;
            if (fDelta <= pStat.stateToGunTime) {
                //вес state::GUN
                var fK = fDelta / pStat.stateToGunTime;
                //вес state::IDLE
                var fkInv = 1. - fK;
                console.log("state::IDLE --> state::GUN (" + fK + ")");
                pStateBlend.setWeights(pStat.idleWeightBeforeDraw * fkInv, null, null, fK);
            }
        }
        if (pStat.state == EGameHeroStates.GUN_BEFORE_DRAW) {
            //с этого момента, должна начать играться анимация доставания питолета
            pGunDrawAnim.pause(false);
            pStat.state = EGameHeroStates.GUN_DRAWING;
            pStat.gunDrawStartTime = fNow;
            // pStateBlend.setWeights(0., 0., 0., 1.);
                    } else if (pStat.state == EGameHeroStates.GUN_DRAWING) {
            //во время доставания пистолета, можно целиться
            pGunDrawBlend.setWeights(fGKup, fGKfrw, fGKdown);
            fDelta = fNow - pStat.gunDrawStartTime;
            if (fDelta >= pGunBlend.duration) {
                // console.log('go to idle with gun..');
                pStat.state = EGameHeroStates.GUN_DRAWED;
                pStat.gunDrawToIdleStartTime = fNow;
                //оставляем только IDLE, для упрощения вычислений
                            }
        }
        if (pStat.state == EGameHeroStates.GUN_DRAWED) {
            fDelta = fNow - pStat.gunDrawToIdleStartTime;
            pGunIdleBlend.setWeights(fGKup, fGKfrw, fGKdown);
            if (fDelta <= pStat.gunDrawToIdleTime) {
                //переходим от gun::DRAW --> gun::IDLE
                pGunBlend.setWeightSwitching(fDelta / pStat.gunDrawToIdleTime, 2, 0);
            } else {
                pStat.state = EGameHeroStates.WEAPON_IDLE;
                pGunBlend.setWeights(1., 0., 0., 0.);
                // console.log('only idle with gun..');
                //idle --> 0
                // pStateBlend.setAnimationWeight(0, 0);
                            }
        } else if (pStat.state == EGameHeroStates.WEAPON_IDLE) {
            pGunIdleBlend.setWeights(fGKup, fGKfrw, fGKdown);
            if (pControls.fire > 0.20 && !pStat.inAttack) {
                pStat.inAttack = true;
                pFirePlayer.rewind(0.);
                pGunBlend.setAnimationWeight(1, pControls.fire * 100);
            }
            if (pStat.inAttack && pControls.fire < 0.20) {
                var fK = (1. - pFirePlayer.animationTime / pFirePlayer.duration);
                if (fK > pGunBlend.getAnimationWeight(1)) {
                    pGunBlend.setAnimationWeight(1, 0);
                    console.log("end of fire anim");
                    pStat.inAttack = false;
                } else {
                    pGunBlend.setAnimationWeight(1, fK);
                }
            }
            if (pStat.inAttack) {
                pFireBlend.setWeights(fGKup, fGKfrw, fGKdown);
            }
            if (pControls.gun) {
                //undraw gun
                //pStat.state
                // console.log('before gun undrawing...');
                pGunUnDrawAnim.rewind(0.);
                pGunUnDrawAnim.pause(true);
                pGunUnDrawBlend.setWeights(fGKup, fGKfrw, fGKdown);
                pStat.gunIdleToUnDrawStartTime = fNow;
                pStat.movementWeightBeforeUnDraw = pStateBlend.getAnimationWeight(2.);
                pStat.state = EGameHeroStates.GUN_BEFORE_UNDRAW;
            }
        } else if (pStat.state == EGameHeroStates.GUN_BEFORE_UNDRAW) {
            fDelta = fNow - pStat.gunIdleToUnDrawStartTime;
            if (fDelta <= pStat.gunIdleToUndrawTime) {
                var fK = fDelta / pStat.gunIdleToUndrawTime;
                pStateBlend.setWeights(pStat.movementWeightBeforeUnDraw * (1. - fK), null, null, fK);
                //переходим из gun::IDLE --> gun.UNDRAW
                pGunBlend.setWeightSwitching(fDelta / pStat.gunIdleToUndrawTime, 2, 3);
            } else {
                pStateBlend.setWeights(0., 0., 0., 1.);
                pGunBlend.setWeights(0., 0., 0., 1.);
                pStat.gunUndrawStartTime = fNow;
                pStat.state = EGameHeroStates.GUN_UNDRAWING;
                pGunUnDrawAnim.pause(false);
                // console.log('go to gun undrawning....');
                            }
        } else if (pStat.state == EGameHeroStates.GUN_UNDRAWING) {
            fDelta = fNow - pStat.gunUndrawStartTime;
            pGunUnDrawBlend.setWeights(fGKup, fGKfrw, fGKdown);
            if (fDelta >= pGunBlend.duration) {
                // console.log('gun undrawed.');
                pStat.state = EGameHeroStates.GUN_UNDRAWED;
                pStat.gunUndrawedTime = fNow;
            }
        } else if (pStat.state == EGameHeroStates.GUN_UNDRAWED) {
            fDelta = fNow - pStat.gunUndrawedTime;
            if (fDelta <= pStat.gunUndrawToIdleTime) {
                //переходим из state::GUN --> state.IDLE
                pStateBlend.setWeightSwitching(fDelta / pStat.gunUndrawToIdleTime, 3, 0);
            } else {
                pStateBlend.setWeights(1.0, 0., 0., 0.);
                pMovementBlend.setWeights(0., 1., 0., 0., 0.);
                pRunPlayer.rewind(0.);
                pWalkPlayer.rewind(0.);
                pRunPlayer.setSpeed(1.);
                pWalkPlayer.setSpeed(1.);
                pRunPlayer.pause(false);
                pWalkPlayer.pause(false);
                pStat.state = EGameHeroStates.WEAPON_NOT_DRAWED;
                pStat.weapon = EGameHeroWeapons.NONE;
                deactivateTrigger();
                // console.log("deactivateTrigger();");
                            }
        }
        if (pStat.state < EGameHeroStates.GUN_BEFORE_UNDRAW) {
            movementHero(pControls, pHero, pStat, pController);
        }
    }
    ;
    /** @inline */function isFirstFrameOfTrigger() {
        return akra.self.hero.parameters.lastTriggers !== akra.self.hero.triggers.length;
    }
    ;
    /** @inline */function isSpeedControlEnabled(pStat) {
        return pStat.manualSpeedControl;
    }
    function moveHero(pControls, pHero, pStat, pController) {
        var fMovementRate;
        var fMovementSpeedMax;
        var fTimeDelta;
        var fDirectX, fDirectY;
        var fMovementDerivative;
        var fMovementDerivativeMax;
        var fRotationRate = 0;
        var fMovementRateAbs;
        var fWalkRate;
        var f;
        var pCamera, pCameraWorldData;
        var v3fCameraDir, v3fCameraOrtho;
        var fCameraYaw;
        var pHeroWorldData;
        var v3fHeroDir;
        var v2fStick;
        var fScalar;
        var fPower;
        var v2fStickDir;
        var v3fRealDir;
        var fMovementDot;
        var fMovementTest;
        var fMovementDir;
        //analogue stick values
        fDirectY = pControls.direct.y;
        fDirectX = -pControls.direct.x;
        //camera data
        pCamera = akra.self.hero.camera;
        pCameraWorldData = pCamera.worldMatrix.data;
        //camera view direction projection to XZ axis
        v3fCameraDir = akra.Vec3.stackCeil.set(-pCameraWorldData[akra.__13], 0., -pCameraWorldData[akra.__33]).normalize();
        //v3fCameraOrtho  = Vec3(v3fCameraDir.z, 0., -v3fCameraDir.x);
        //hero directiob proj to XZ axis
        pHeroWorldData = pHero.worldMatrix.data;
        v3fHeroDir = akra.Vec3.stackCeil.set(pHeroWorldData[akra.__13], 0., pHeroWorldData[akra.__33]).normalize();
        //stick data
        v2fStick = akra.Vec2.stackCeil.set(fDirectX, fDirectY);
        //calculating stick power
        if (v2fStick.x == v2fStick.y && v2fStick.x == 0.) {
            fScalar = 0.;
        } else if (akra.math.abs(v2fStick.x) > akra.math.abs(v2fStick.y)) {
            fScalar = akra.math.sqrt(1. + akra.math.pow(v2fStick.y / v2fStick.x, 2.));
        } else {
            fScalar = akra.math.sqrt(akra.math.pow(v2fStick.x / v2fStick.y, 2.) + 1.);
        }
        //stick power value
        fPower = fScalar ? v2fStick.length() / fScalar : 0.;
        //stick dir
        v2fStickDir = v2fStick.normalize(akra.Vec2.stackCeil.set());
        //camera yaw
        fCameraYaw = -akra.math.atan2(v3fCameraDir.z, v3fCameraDir.x);
        //real direction in hero-space
        v3fRealDir = akra.Vec3.stackCeil.set(v2fStickDir.y, 0., v2fStickDir.x);
        akra.Quat4.fromYawPitchRoll(fCameraYaw, 0., 0., akra.Quat4.stackCeil.set()).multiplyVec3(v3fRealDir);
        //movement parameters
        fMovementDot = v3fRealDir.dot(v3fHeroDir);
        fMovementTest = akra.math.abs(fMovementDot - 1.) / 2.;
        fMovementDir = 1.;
        fMovementRate = fPower * akra.math.sign(fMovementDot);
        if (fMovementDot > pStat.walkBackAngleRange) {
            fMovementDir = v3fRealDir.x * v3fHeroDir.z - v3fRealDir.z * v3fHeroDir.x;
            fRotationRate = fPower * akra.math.sign(fMovementDir) * fMovementTest;
        } else {
            fRotationRate = 0.0;
        }
        fTimeDelta = pEngine.time - pStat.time;
        fMovementSpeedMax = determMaxSpeed(pStat);
        fWalkRate = determMinSpeed(pStat) / fMovementSpeedMax;
        if (fTimeDelta != 0.0) {
            fMovementDerivative = (fMovementRate - pStat.movementRate) / fTimeDelta;
            f = akra.math.exp(akra.math.abs(pStat.movementRate));
            fMovementDerivativeMax = pStat.movementDerivativeMin + ((f - 1.) / (f + 1.)) * pStat.movementDerivativeConst;
            fMovementRate = pStat.movementRate + fTimeDelta * akra.math.clamp(fMovementDerivative, -fMovementDerivativeMax, fMovementDerivativeMax);
        }
        //use manual speed
        if (((pStat).manualSpeedControl)) {
            fMovementRate = pStat.manualSpeedRate;
        }
        fMovementRateAbs = akra.math.abs(fMovementRate);
        if (fMovementRateAbs < pStat.movementRateThreshold) {
            fMovementRate = 0.;
        }
        if (fRotationRate != 0.) {
            pHero.addRelRotationByEulerAngles(fRotationRate * pStat.rotationSpeedMax * fTimeDelta, 0.0, 0.0);
        }
        /* ||
        (fMovementRate < 0. && fMovementRateAbs > pStat.walkSpeed / pStat.runSpeed)*/
        if (pStat.fallDown || fMovementRateAbs >= fWalkRate) {
            //projection of the hero on the terrin
            var v3fHeroTerrainProjPoint = akra.Vec3.stackCeil.set(0.);
            //prev. hero position
            var v3fHeroPos = akra.Vec3.stackCeil.set(pHero.worldPosition);
            var fMovementSpeed = fMovementRate * fMovementSpeedMax;
            if (pStat.fallDown) {
                fMovementSpeed = pStat.fallTransSpeed;
            }
            //hero orinted along Z-axis
            pHero.addRelPosition(akra.Vec3.stackCeil.set(0.0, 0.0, fMovementSpeed * fTimeDelta));
            pHero.update();
            if (!akra.isNull(pTerrain)) {
                pTerrain.projectPoint(pHero.worldPosition, v3fHeroTerrainProjPoint);
                if (v3fHeroPos.y - v3fHeroTerrainProjPoint.y > 0.1) {
                    if (pStat.fallDown == false) {
                        pStat.fallDown = true;
                        pStat.fallTransSpeed = fMovementSpeed;
                        pStat.fallStartTime = akra.now();
                    }
                    var fFallSpeed = ((akra.now() - pStat.fallStartTime) / 1000) * akra.math.GRAVITY_CONSTANT;
                    pHero.setPosition(pHero.worldPosition.x, pHero.worldPosition.y - fFallSpeed * fTimeDelta, pHero.worldPosition.z);
                } else {
                    pStat.fallDown = false;
                    pHero.setPosition(v3fHeroTerrainProjPoint);
                }
            }
            //console.log((fMovementRate * fMovementSpeedMax).toFixed(2) + " m/sec");
                    }
        pStat.rotationRate = fRotationRate;
        pStat.movementRate = fMovementRate;
        pStat.time = pEngine.time;
        pStat.timeDelta = fTimeDelta;
    }
    ;
    function activateTrigger(pTriggersList) {
        pTriggersList.push(updateCharacterCamera);
        akra.self.hero.triggers.push({
            triggers: pTriggersList,
            time: pEngine.time
        });
    }
    ;
    function deactivateTrigger() {
        return akra.self.hero.triggers.pop();
    }
    ;
    var EDisplayModes;
    (function (EDisplayModes) {
        EDisplayModes._map = [];
        EDisplayModes._map[0] = "WIREFRAME";
        EDisplayModes.WIREFRAME = 0;
        EDisplayModes._map[1] = "COLORED";
        EDisplayModes.COLORED = 1;
        EDisplayModes._map[2] = "COLORED_WIREFRAME";
        EDisplayModes.COLORED_WIREFRAME = 2;
        EDisplayModes._map[3] = "TEXTURE";
        EDisplayModes.TEXTURE = 3;
    })(EDisplayModes || (EDisplayModes = {}));
    ;
    var iSWTimer = -1;
    var eMode = EDisplayModes.WIREFRAME;
    function switchDisplayMode() {
        switch(eMode) {
            case EDisplayModes.WIREFRAME:
                pEngine.getComposer()["bShowTriangles"] = true;
                pTerrain.megaTexture["_bColored"] = false;
                pTerrain.showMegaTexture = false;
                break;
            case EDisplayModes.COLORED:
                pEngine.getComposer()["bShowTriangles"] = false;
                pTerrain.megaTexture["_bColored"] = true;
                pTerrain.showMegaTexture = true;
                break;
            case EDisplayModes.COLORED_WIREFRAME:
                pEngine.getComposer()["bShowTriangles"] = true;
                pTerrain.megaTexture["_bColored"] = true;
                pTerrain.showMegaTexture = true;
                break;
            case EDisplayModes.TEXTURE:
                pEngine.getComposer()["bShowTriangles"] = false;
                pTerrain.megaTexture["_bColored"] = false;
                pTerrain.showMegaTexture = true;
                break;
        }
        if (eMode == EDisplayModes.TEXTURE) {
            eMode = EDisplayModes.WIREFRAME;
        } else {
            eMode++;
        }
    }
    function updateHero() {
        var pGamepad = akra.self.gamepads.find(0) || virtualGamepad(pKeymap);
        var pHero = akra.self.hero.root;
        var pStat = akra.self.hero.parameters;
        var pController = akra.self.hero.root.getController();
        var pTriggers = akra.self.hero.triggers.last;
        var pControls = akra.self.hero.controls;
        var pTriggersData = pTriggers.triggers;
        if (pGamepad.buttons[akra.EGamepadCodes.SELECT]) {
            pStat.blocked = true;
        }
        if (pGamepad.buttons[akra.EGamepadCodes.START]) {
            pStat.blocked = false;
        }
        if (pStat.blocked) {
            return;
        }
        var fDirectY = -pGamepad.axes[akra.EGamepadAxis.LEFT_ANALOGUE_VERT];
        var fDirectX = -pGamepad.axes[akra.EGamepadAxis.LEFT_ANALOGUE_HOR];
        var fAnalogueButtonThresholdInv = 1. - pStat.analogueButtonThreshold;
        if (akra.math.abs(fDirectX) < pStat.analogueButtonThreshold) {
            fDirectX = 0.;
        } else {
            fDirectX = akra.math.sign(fDirectX) * (akra.math.abs(fDirectX) - pStat.analogueButtonThreshold) / fAnalogueButtonThresholdInv;
        }
        if (akra.math.abs(fDirectY) < pStat.analogueButtonThreshold) {
            fDirectY = 0.;
        } else {
            fDirectY = akra.math.sign(fDirectY) * (akra.math.abs(fDirectY) - pStat.analogueButtonThreshold) / fAnalogueButtonThresholdInv;
        }
        pControls.direct.y = fDirectY;
        pControls.direct.x = fDirectX;
        pControls.forward = !!pGamepad.buttons[akra.EGamepadCodes.PAD_TOP];
        pControls.back = !!pGamepad.buttons[akra.EGamepadCodes.PAD_BOTTOM];
        pControls.left = !!pGamepad.buttons[akra.EGamepadCodes.PAD_LEFT];
        pControls.right = !!pGamepad.buttons[akra.EGamepadCodes.PAD_RIGHT];
        pControls.dodge = !!pGamepad.buttons[akra.EGamepadCodes.FACE_1];
        pControls.gun = !!pGamepad.buttons[akra.EGamepadCodes.FACE_4];
        pControls.harpoon = !!pGamepad.buttons[akra.EGamepadCodes.FACE_3];
        pControls.fire = pGamepad.buttons[akra.EGamepadCodes.RIGHT_SHOULDER_BOTTOM];
        if (pGamepad.buttons[akra.EGamepadCodes.LEFT_SHOULDER_BOTTOM] > 0.5) {
            if (iSWTimer == -1) {
                iSWTimer = setTimeout(/** @inline */function () {
                    iSWTimer = -1;
                    switchDisplayMode();
                }, 200);
            }
        }
        var iTrigger = akra.self.hero.triggers.length;
        for(var i = 0; i < pTriggersData.length; ++i) {
            pTriggersData[i](pControls, pHero, pStat, pController, pTriggers.time);
        }
        pStat.lastTriggers = iTrigger;
    }
    function updateCameraAxes() {
        // var pCameraWorldData = this.getActiveCamera().worldMatrix().pData;
        // var v3fCameraDir = Vec3(-pCameraWorldData._13, 0, -pCameraWorldData._33).normalize();
        // this.pCameraBasis.setRotation(Vec3(0, 1, 0), -Math.atan2(v3fCameraDir.z, v3fCameraDir.x));
            }
    function setupCameras(pHeroNode) {
        akra.self.hero.root = pHeroNode;
        var pCharacterCamera = pScene.createCamera("character-camera");
        var pCharacterRoot = akra.self.hero.root;
        var pCharacterPelvis = pCharacterRoot.findEntity("node-Bip001");
        var pCharacterHead = pCharacterRoot.findEntity("node-Bip001_Head");
        pCharacterCamera.setInheritance(akra.ENodeInheritance.NONE);
        pCharacterCamera.attachToParent(pCharacterRoot);
        pCharacterCamera.setProjParams(Math.PI / 4.0, pCanvas.width / pCanvas.height, 0.1, 3000.0);
        pCharacterCamera.setRelPosition(akra.Vec3.stackCeil.set(0, 2.5, -5));
        akra.self.hero.camera = pCharacterCamera;
        akra.self.hero.head = pCharacterHead;
        akra.self.hero.pelvis = pCharacterPelvis;
    }
    //>>>>>>>>>>>>>>>>>>>>>
    function isDefaultCamera(pViewport, pKeymap, pCamera, pCharacterCamera, pGamepad) {
        if (pKeymap.isKeyPress(akra.EKeyCodes.N1) || (pGamepad && pGamepad.buttons[akra.EGamepadCodes.RIGHT_SHOULDER])) {
            pCharacterCamera.lookAt(akra.self.hero.head.worldPosition);
            pViewport.setCamera(pCharacterCamera);
        } else if (pKeymap.isKeyPress(akra.EKeyCodes.N2) || (pGamepad && pGamepad.buttons[akra.EGamepadCodes.LEFT_SHOULDER])) {
            pViewport.setCamera(pCamera);
        }
        if (pCharacterCamera.isActive()) {
            return false;
        }
        return true;
    }
    function edgeDetection(pViewport) {
        pViewport.effect.addComponent("akra.system.edgeDetection", 2, 0);
        var pParams = {
            lineWidth: 2.0,
            threshold: 0.2
        };
        pViewport.bind("render", function (pViewport, pTechnique, iPass, pRenderable, pSceneObject) {
            var pPass = pTechnique.getPass(iPass);
            switch(iPass) {
                case 2:
                    pPass.setUniform("EDGE_DETECTION_THRESHOLD", pParams.threshold);
                    pPass.setUniform("EDGE_DETECTION_LINEWIDTH", pParams.lineWidth);
            }
        });
        return pParams;
    }
    function motionBlur(pViewport) {
        var pPrevViewMat = new akra.Mat4(1.);
        var pCamera = pViewport.getCamera();
        pViewport.effect.addComponent("akra.system.motionBlur", 2, 0);
        setInterval(/** @inline */function () {
            pPrevViewMat.set(pCamera.viewMatrix);
        }, 10);
        pViewport.bind("render", function (pViewport, pTechnique, iPass, pRenderable, pSceneObject) {
            var pPass = pTechnique.getPass(iPass);
            var pDepthTex = pViewport.depth;
            var pCamera = pViewport.getCamera();
            // console.log(pCamera.isWorldMatrixNew());
            switch(iPass) {
                case 2:
                    pCamera.update();
                    pPass.setUniform("SCREEN_TEXTURE_RATIO", akra.Vec2.stackCeil.set(pViewport.actualWidth / pDepthTex.width, pViewport.actualHeight / pDepthTex.height));
                    pPass.setTexture("SCENE_DEPTH_TEXTURE", pDepthTex);
                    pPass.setUniform("PREV_VIEW_MATRIX", pPrevViewMat);
                    // pPass.setUniform("CURR_INV_VIEW_CAMERA_MAT", pCamera.worldMatrix);
                    // pPass.setUniform("CURR_PROJ_MATRIX", pCamera.projectionMatrix);
                    // pPass.setUniform("CURR_VIEW_MATRIX", t2);
                                }
        });
    }
    function update() {
        var pCharacterCamera = akra.self.hero.camera;
        var pGamepad = pGamepads.find(0) || virtualGamepad(pKeymap);
        if (isDefaultCamera(pViewport, pKeymap, pCamera, pCharacterCamera, pGamepad) && akra.isNull(pUI)) {
            updateCamera(pCamera, pKeymap, pGamepad);
        }
        updateHero();
        akra.self.keymap.update();
    }
    function createModels() {
        var pImporter = new akra.io.Importer(pEngine);
        pImporter.loadDocument(pControllerData);
        pMovementController = pImporter.getController();
        var pHeroNode = createModelEx("CHARACTER_MODEL", pScene, pTerrain, pCamera, pMovementController);
        setupCameras(pHeroNode);
        initState(pHeroNode);
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
        pViewport = createViewports(new akra.render.DSViewport(pCamera), pCanvas, pUI);
        pTerrain = akra.self.terrain = createTerrain(pScene, true);
        createModels();
        pSkyBoxTexture = createSkyBox(pRmgr, pViewport);
        pSky = akra.self.sky = createSky(pScene, 14.);
        //test viewports
        // var pTestViewport = pCanvas.addViewport(new render.DSViewport(pCamera, .25, .25, .5, .5, 1.));
        /*		var pTex: ITexture = <ITexture>pViewport["_pDeferredColorTextures"][0];
        var pColorViewport: render.TextureViewport = <any>pCanvas.addViewport(new render.TextureViewport(pTex, 0.05, 0.05, .30, .30, 4.));
        var pNormalViewport: render.TextureViewport = <any>pCanvas.addViewport(new render.TextureViewport(pTex, 0.05, 0.40, .30, .30, 5.));
        
        function onResize(pViewport: IViewport) {
        pColorViewport.setMapping(0., 0., pViewport.actualWidth / pTex.width, pViewport.actualHeight / pTex.height);
        pNormalViewport.setMapping(0., 0., pViewport.actualWidth / pTex.width, pViewport.actualHeight / pTex.height);
        }
        
        onResize(pViewport);
        
        pViewport.bind("viewportDimensionsChanged", onResize);
        
        pColorViewport.effect.addComponent("akra.system.display_consistent_colors");
        pNormalViewport.effect.addComponent("akra.system.display_normals");*/
        //end of test
        // var pSprite = pScene.createSprite("sprite");
        // pSprite.attachToParent(pScene.getRootNode());
        // pSprite.setPosition(0., -1., 0.);
        // pSprite.setTexture(pViewport["_pDeferredDepthTexture"]);
        var pProject = pScene.createLightPoint(akra.ELightTypes.PROJECT, true, 512);
        pProject.attachToParent(pScene.getRootNode());
        pProject.enabled = false;
        var pParams = pProject.params;
        pParams.ambient.set(0.0, 0.0, 0.0, 1);
        pParams.diffuse.set(1.);
        pParams.specular.set(1.);
        pParams.attenuation.set(0.5, 0, 0);
        pProject.setPosition(new akra.Vec3(-300, 300, -300));
        pProject.lookAt(new akra.Vec3(0., .0, 0.));
        pProject.lightingDistance = 10000.;
        pKeymap.bind("equalsign", /** @inline */function () {
            akra.self.activeCamera++;
            if (akra.self.activeCamera === akra.self.cameras.length) {
                akra.self.activeCamera = 0;
            }
            var pCam = akra.self.cameras[akra.self.activeCamera];
            pViewport.setCamera(pCam);
        });
        pKeymap.bind("M", /** @inline */function () {
            pEngine.getComposer()["bShowTriangles"] = !pEngine.getComposer()["bShowTriangles"];
        });
        pKeymap.bind("N", /** @inline */function () {
            if (pTerrain.megaTexture) {
                pTerrain.megaTexture["_bColored"] = !pTerrain.megaTexture["_bColored"];
            }
        });
        // (<any>sefl).edgeDetection = edgeDetection(<IDSViewport>pViewport);
        // motionBlur(<IDSViewport>pViewport);
        createSceneEnvironment(pScene, true, true);
        pEngine.getComposer()["bShowTriangles"] = true;
        if (pTerrain.megaTexture) {
            pTerrain.megaTexture["_bColored"] = true;
        }
        pEngine.exec();
    }
    pEngine.bind("depsLoaded", main);
})(akra || (akra = {}));
