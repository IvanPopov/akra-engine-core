


/*---------------------------------------------
 * assembled at: Wed Jul 31 2013 20:12:20 GMT+0400 (Московское время (зима))
 * directory: tests/common/game/DEBUG/
 * file: tests/common/game/game.ts
 * name: game
 *--------------------------------------------*/


var akra;
(function (akra) {
    (function (EGameHeroStates) {
        EGameHeroStates._map = [];
        EGameHeroStates._map[0] = "GUN_NOT_DRAWED";
        EGameHeroStates.GUN_NOT_DRAWED = 0;
        EGameHeroStates._map[1] = "GUN_BEFORE_DRAW";
        EGameHeroStates.GUN_BEFORE_DRAW = 1;
        EGameHeroStates._map[2] = "GUN_DRAWING";
        EGameHeroStates.GUN_DRAWING = 2;
        EGameHeroStates._map[3] = "GUN_DRAWED";
        EGameHeroStates.GUN_DRAWED = 3;
        EGameHeroStates._map[4] = "GUN_BEFORE_IDLE";
        EGameHeroStates.GUN_BEFORE_IDLE = 4;
        EGameHeroStates._map[5] = "GUN_IDLE";
        EGameHeroStates.GUN_IDLE = 5;
        EGameHeroStates._map[6] = "GUN_BEFORE_UNDRAW";
        EGameHeroStates.GUN_BEFORE_UNDRAW = 6;
        EGameHeroStates._map[7] = "GUN_UNDRAWING";
        EGameHeroStates.GUN_UNDRAWING = 7;
        EGameHeroStates._map[8] = "GUN_UNDRAWED";
        EGameHeroStates.GUN_UNDRAWED = 8;
        EGameHeroStates._map[9] = "GUN_END";
        EGameHeroStates.GUN_END = 9;
    })(akra.EGameHeroStates || (akra.EGameHeroStates = {}));
    var EGameHeroStates = akra.EGameHeroStates;
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
                // {path: "models/hero/movie.dae", name: "HERO_MODEL"},
                {
                    path: "models/character/character.dae",
                    name: "CHARACTER_MODEL"
                }, 
                
            ],
            deps: {
                files: [
                    {
                        path: "models/character/movement.json",
                        name: "HERO_CONTROLLER"
                    }
                ]
            }
        }
    };
    var pRenderOpts = {
        preserveDrawingBuffer: //for screenshoting
        true,
        alpha: false
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
                movementRate: 0,
                movementRateThreshold: 0.0001,
                movementSpeedMax: /* sec */
                9.0,
                rotationSpeedMax: /* rad/sec*/
                10,
                rotationRate: /* current speed*/
                0,
                runSpeed: /* m/sec*/
                9.0,
                walkToRunSpeed: /* m/sec*/
                2.5,
                walkSpeed: /* m/sec*/
                1.5,
                walWithWeaponSpeed: /* m/sec */
                1.0,
                walWithoutWeaponSpeed: /* m/sec */
                1.5,
                movementDerivativeMax: 1.0,
                movementDerivativeMin: 0.5,
                movementDerivativeConst: (2 * (Math.E + 1) / (Math.E - 1) * /*(fSpeedDerivativeMax - fSpeedDerivativeMin)*/
                (1.0 - 0.5)),
                walkBackAngleRange: /*rad*/
                -0.85,
                cameraPitchChaseSpeed: /*rad/sec*/
                10.0,
                cameraPitchSpeed: 3.0,
                cameraPitchMax: -60.0 * akra.math.RADIAN_RATIO,
                cameraPitchMin: +30.0 * akra.math.RADIAN_RATIO,
                cameraPitchBase: Math.PI / 10,
                blocked: true,
                lastTriggers: 1,
                position: new akra.Vec3(0.),
                cameraCharacterDistanceBase: /*метров [расстояние на которое можно убежать от центра камеры]*/
                5.0,
                cameraCharacterDistanceMax: 15.0,
                cameraCharacterChaseSpeed: /* m/sec*/
                25,
                cameraCharacterChaseRotationSpeed: /* rad/sec*/
                5.,
                cameraCharacterFocusPoint: /*meter*/
                new akra.Vec3(0.0, 0.5, 0.0),
                state: EGameHeroStates.GUN_NOT_DRAWED,
                fallDown: false,
                fallTransSpeed: 0,
                fallStartTime: 0,
                anim: {}
            }
        }
    };
    pKeymap.captureMouse((pCanvas).el);
    pKeymap.captureKeyboard(document);
    //>>>>>>>>>>>>>>>>>>>>>
    function initState(pHeroNode) {
        var pStat = akra.self.hero.parameters;
        function findAnimation(sName, sPseudo) {
            pStat.anim[sPseudo || sName] = pHeroNode.getController().findAnimation(sName);
            return pStat.anim[sPseudo || sName];
        }
        pStat.time = akra.self.engine.time;
        pStat.position.set(akra.self.hero.root.worldPosition);
        //    ((a) => {
        // 	a["_fTime"] = 0;
        // 	a["_fRealTime"] = 0;
        // 	a["_fTrueTime"] = 0;
        // })(findAnimation("RUN.player"));
        // ((a) => {
        // 	a["_fTime"] = 0;
        // 	a["_fRealTime"] = 0;
        // 	a["_fTrueTime"] = 0;
        // })(findAnimation("WALK.player"));
        // ((a) => {
        // 	a["_fTime"] = 0;
        // 	a["_fRealTime"] = 0;
        // 	a["_fTrueTime"] = 0;
        // })(findAnimation("WALKBACK.player"));
        findAnimation("MOVEMENT.player");
        /*.setWeights(0., 0., 0.);*/
        findAnimation("MOVEMENT.blend");
        // findAnimation("RUN.player").stop();
        // findAnimation("WALK.player").stop();
        // findAnimation("WALKBACK.player").stop();
        // findAnimation("MOVEMENT.player");
        // findAnimation("MOVEMENT.blend");
        findAnimation('STATE.player');
        findAnimation('STATE.blend');
        findAnimation("RUN.player");
        findAnimation("WALK.player");
        activateTrigger([
            moveHero, 
            movementHero, 
            checkHeroState
        ]);
    }
    function updateCharacterCamera(pControls, pHero, pStat, pController) {
        var pCamera = akra.self.hero.camera;
        var fTimeDelta = pStat.timeDelta;
        var pGamepad = akra.self.gamepads.find(0);
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
            pCamera.update();
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
    function movementHero(pControls, pHero, pStat, pController) {
        var pAnim = pStat.anim;
        var fMovementRate = pStat.movementRate;
        var fMovementRateAbs = akra.math.abs(fMovementRate);
        var fRunSpeed = pStat.runSpeed;
        var fWalkSpeed = pStat.walkSpeed;
        var fWalkToRunSpeed = pStat.walkToRunSpeed;
        var fSpeed;
        var fRunWeight;
        var fWalkWeight;
        //pStat.movementSpeedMax = pStat.state? pStat.walkToRunSpeed: pStat.runSpeed;
        pStat.walkSpeed = pStat.walWithoutWeaponSpeed;
        pStat.movementSpeedMax = pStat.runSpeed;
        fSpeed = fMovementRateAbs * pStat.movementSpeedMax;
        if (pController.active) {
            if (pController.active.name !== "STATE.player") {
                // pController.play('STATE.player', this.fTime);
                            }
        } else {
            console.warn("controller::active is null ;(");
        }
        //character move
        if (fSpeed > fWalkSpeed) {
            // if ((<IAnimationContainer>pAnim["MOVEMENT.player"]).isPaused()) {
            //     (<IAnimationContainer>pAnim["MOVEMENT.player"]).pause(false);
            // }
            if (fMovementRate > 0.0) {
                //run forward
                if (fSpeed < pStat.walkToRunSpeed) {
                    if (pStat.state) {
                        //walk with gun
                        /*only walk*/
                        (pAnim["MOVEMENT.blend"]).setWeights(0., 0., 0., 1.);
                    } else {
                        /* only walk */
                        (pAnim["MOVEMENT.blend"]).setWeights(0., 1., 0.);
                    }
                    (pAnim["WALK.player"]).setSpeed(fSpeed / fWalkSpeed);
                } else {
                    fRunWeight = (fSpeed - fWalkToRunSpeed) / (fRunSpeed - fWalkToRunSpeed);
                    fWalkWeight = 1. - fRunWeight;
                    //run //walk frw //walk back
                    if (pStat.state) {
                        //with gun
                        (pAnim["MOVEMENT.blend"]).setWeights(fRunWeight, 0., 0., fWalkWeight);
                    } else {
                        (pAnim["MOVEMENT.blend"]).setWeights(fRunWeight, fWalkWeight, 0.);
                    }
                    (pAnim["MOVEMENT.player"]).setSpeed(1.);
                }
            } else {
                //run //walk frw //walk back
                (pAnim["MOVEMENT.blend"]).setWeights(0., 0., 1.);
                (pAnim["MOVEMENT.player"]).setSpeed(fMovementRateAbs);
                pStat.movementSpeedMax = fWalkSpeed;
            }
            //дабы быть уверенными что IDLE не считается
            // pAnim["STATE.blend"].setAnimationWeight(0, 0.); /* idle */
            // pAnim["STATE.blend"].setAnimationWeight(2, 0.); /* gun */
                    } else//character IDLE
         {
            var iIDLE = pStat.state ? 2 : 0.;
            var iMOVEMENT = 2;
            // (<IAnimationContainer>pAnim["MOVEMENT.player"]).pause(true);
            if (pStat.state == EGameHeroStates.GUN_NOT_DRAWED || pStat.state >= EGameHeroStates.GUN_IDLE) {
                /* idle ---> run */
                (pAnim["STATE.blend"]).setWeightSwitching(fSpeed / fWalkSpeed, iIDLE, iMOVEMENT);
            }
            // trace(pAnim["STATE.blend"].getAnimationWeight(0), pAnim["STATE.blend"].getAnimationWeight(1), pAnim["STATE.blend"].getAnimationWeight(2))
            if (fMovementRate > 0.0) {
                //walk forward --> idle
                if (pStat.state) {
                    //with gun
                    (pAnim["MOVEMENT.blend"]).setWeights(null, 0., 0., fSpeed / fWalkSpeed);
                } else {
                    (pAnim["MOVEMENT.blend"]).setWeights(null, fSpeed / fWalkSpeed, 0.);
                }
            } else if (fMovementRate < 0.0) {
                //walk back --> idle
                (pAnim["MOVEMENT.blend"]).setWeights(null, 0, fSpeed / fWalkSpeed);
            }
            (pAnim["MOVEMENT.player"]).setSpeed(1);
        }
        // if (pController.dodge) {
        //     this.activateTrigger([this.dodgeHero, this.moveHero]);
        // }
            }
    function checkHeroState(pControls, pHero, pStat, pController) {
        // if (pControls.gun) {
        //     this.activateTrigger([this.gunWeaponHero, this.moveHero]);
        // }
            }
    /** @inline */function isFirstFrameOfTrigger() {
        return akra.self.hero.parameters.lastTriggers !== akra.self.hero.triggers.length;
    }
    ;
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
        fMovementSpeedMax = pStat.movementSpeedMax;
        fWalkRate = pStat.walkSpeed / pStat.movementSpeedMax;
        if (fTimeDelta != 0.0) {
            fMovementDerivative = (fMovementRate - pStat.movementRate) / fTimeDelta;
            f = akra.math.exp(akra.math.abs(pStat.movementRate));
            fMovementDerivativeMax = pStat.movementDerivativeMin + ((f - 1.) / (f + 1.)) * pStat.movementDerivativeConst;
            fMovementRate = pStat.movementRate + fTimeDelta * akra.math.clamp(fMovementDerivative, -fMovementDerivativeMax, fMovementDerivativeMax);
        }
        fMovementRateAbs = akra.math.abs(fMovementRate);
        if (fMovementRateAbs < pStat.movementRateThreshold) {
            fMovementRate = 0.;
            // this.pCurrentSpeedField.edit("0.00 m/sec");
                    }
        if (fRotationRate != 0.) {
            pHero.addRelRotationByEulerAngles(fRotationRate * pStat.rotationSpeedMax * fTimeDelta, 0.0, 0.0);
        }
        // var _p = vec3(pHero.worldPosition);
        if (pStat.fallDown || fMovementRateAbs >= fWalkRate || (fMovementRate < 0. && fMovementRateAbs > pStat.walkSpeed / pStat.runSpeed)) {
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
            // this.pCurrentSpeedField.edit((fMovementRate * fMovementSpeedMax).toFixed(2) + " m/sec");
                    }
        // pHero.setPosition(_p);
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
    function updateHero() {
        var pGamepad = akra.self.gamepads.find(0);
        var pHero = akra.self.hero.root;
        var pStat = akra.self.hero.parameters;
        var pController = akra.self.hero.root.getController();
        var pTriggers = akra.self.hero.triggers.last;
        var pControls = akra.self.hero.controls;
        var pTriggersData = pTriggers.triggers;
        if (!pGamepad) {
            return;
        }
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
    function update() {
        var pCharacterCamera = akra.self.hero.camera;
        var pGamepad = pGamepads.find(0);
        if (isDefaultCamera(pViewport, pKeymap, pCamera, pCharacterCamera, pGamepad)) {
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
        pEngine.getComposer()["bShowTriangles"] = true;
        if (pTerrain.megaTexture) {
            pTerrain.megaTexture["_bColored"] = true;
        }
        pEngine.exec();
    }
    pEngine.bind("depsLoaded", main);
})(akra || (akra = {}));
