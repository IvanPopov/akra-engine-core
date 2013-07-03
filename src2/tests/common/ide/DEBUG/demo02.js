


/*---------------------------------------------
 * assembled at: Wed Jul 03 2013 19:29:43 GMT+0400 (Московское время (зима))
 * directory: tests/common/ide/DEBUG/
 * file: tests/common/ide/demo02.ts
 * name: demo02
 *--------------------------------------------*/


var akra;
(function (akra) {
    /// @WINDSPOT_MODEL: 		"/models/windspot/WINDSPOT.DAE"
    /// @MINER_MODEL: 			"/models/miner/miner.dae"
    /// @ROCK_MODEL: 			"/models/rock/rock-1-low-p.DAE"
    (function (util) {
        var Progress = (function () {
            function Progress(iSize, iFontSize) {
                if (typeof iSize === "undefined") { iSize = 200; }
                if (typeof iFontSize === "undefined") { iFontSize = 30; }
                this.step = 5.;
                this.counterclockwise = false;
                this.radius = 0;
                this.thickness = 20;
                this.total = [
                    10, 
                    5, 
                    3
                ];
                this.border = 2;
                this.lineWidth = 8;
                this.indent = 3;
                this.color = "#000000";
                this.depth = 0;
                this.element = 0;
                this.fontColor = "black";
                this.fontSize = 30;
                this.size = 0;
                var pCanvas = document.createElement("canvas");
                this.fontSize = iFontSize;
                this.size = iSize;
                pCanvas.width = iSize + 120;
                pCanvas.height = iSize;
                this.canvas = pCanvas;
                this.context = pCanvas.getContext("2d");
                this.radius = iSize / 2. - this.thickness;
            }
            Object.defineProperty(Progress.prototype, "width", {
                get: function () {
                    return this.canvas.width;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Progress.prototype, "height", {
                get: function () {
                    return this.canvas.height;
                },
                enumerable: true,
                configurable: true
            });
            Progress.prototype.loaded = function () {
                if (this.element < this.total[this.depth]) {
                    this.draw();
                    this.element++;
                }
            };
            Progress.prototype.next = function () {
                if (this.depth < this.total.length) {
                    this.element = 0;
                    this.depth++;
                }
            };
            Progress.prototype.reset = function () {
                this.depth = 0;
                this.element = 0;
                this.context.clearRect(0, 0, this.width, this.height);
            };
            Progress.prototype.draw = function () {
                this.loadLevel();
                this.updateInfo();
            };
            Progress.prototype.updateInfo = function () {
                var pCtx = this.context;
                var x = this.size;
                var y = this.size - this.fontSize - 2;
                var n = 0;
                var m = 0;
                for(var i = 0; i < this.total.length; ++i) {
                    if (i < this.depth) {
                        m += this.total[i];
                    }
                    n += this.total[i];
                }
                m += this.element;
                pCtx.clearRect(x, 0, this.width, this.height);
                pCtx.fillStyle = this.fontColor;
                pCtx.font = "bold " + this.fontSize + "px Consolas";
                /*this.depth / this.total.length*/
                pCtx.fillText(((m / n) * 100).toFixed(1) + "%", x, y);
            };
            Progress.prototype.loadLevel = function (i, iDepth) {
                if (typeof i === "undefined") { i = this.element; }
                if (typeof iDepth === "undefined") { iDepth = this.depth; }
                var fFrom = 360 / this.total[iDepth] * i + this.border / 2.;
                var fTo = 360 / this.total[iDepth] * (i + 1) - this.border / 2.;
                this.animate(fFrom, fTo, iDepth);
            };
            Progress.prototype.animate = function (fFrom, fTo, iDepth) {
                if (typeof fFrom === "undefined") { fFrom = 0; }
                if (typeof fTo === "undefined") { fTo = 360; }
                if (typeof iDepth === "undefined") { iDepth = 0; }
                var _this = this;
                var x = this.height / 2., y = this.height / 2.;
                var pCtx = this.context;
                var fCurrent = fFrom;
                var fRatio = Progress.RADIAN_RATIO;
                var iTimer = setInterval(/** @inline */function () {
                    var fNext = fCurrent + _this.step;
                    pCtx.beginPath();
                    pCtx.arc(x, y, Math.max(0, _this.radius - iDepth * (_this.lineWidth + _this.indent)), fCurrent * fRatio, fNext * fRatio, _this.counterclockwise);
                    pCtx.lineWidth = _this.lineWidth;
                    pCtx.lineCap = "butt";
                    pCtx.strokeStyle = _this.color;
                    pCtx.stroke();
                    fCurrent = fNext;
                    if (fCurrent >= fTo) {
                        clearInterval(iTimer);
                    }
                }, 5);
            };
            Progress.RADIAN_RATIO = Math.PI / 180.0;
            Progress.prototype.valueOf = function () {
                return this.canvas;
            };
            return Progress;
        })();
        util.Progress = Progress;        
    })(akra.util || (akra.util = {}));
    var util = akra.util;
})(akra || (akra = {}));
// module akra {
// 	export var bar = new util.Progress();
// 	document.body.appendChild(bar.canvas);
// }
var akra;
(function (akra) {
    var pProgress = new akra.util.Progress();
    var $cv = $(pProgress.canvas);
    $cv.css({
        position: "absolute",
        left: "50%",
        top: "50%",
        zIndex: "100",
        display: "none",
        marginTop: (-pProgress.height / 2) + "px",
        marginLeft: (-pProgress.width / 2) + "px"
    });
    document.body.appendChild($cv[0]);
    var pEngine = akra.createEngine({
        renderer: {
            preserveDrawingBuffer: true
        },
        deps: {
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
                        path: "models/hero/film.DAE",
                        name: "HERO_FILM"
                    }
                ]
            }
        },
        loader: {
            before: function (pManager, pInfo) {
                pProgress.total = pInfo;
                $cv.fadeIn(400);
            },
            onload: function (pManager, iDepth, nLoaded, nTotal) {
                pProgress.element = nLoaded;
                pProgress.depth = iDepth;
                pProgress.draw();
            },
            loaded: function (pManager) {
                $cv.fadeOut(1000, /** @inline */function () {
                    document.body.removeChild($cv[0]);
                });
            }
        }
    });
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
        audio0.src = "assets/voice.wav";
        audio0.controls = true;
        audio0.autoplay = false;
        audio0.loop = false;
        source = context.createMediaElementSource(audio0);
        source.connect(analyser);
        analyser.connect(context.destination);
        akra.self.voice = audio0;
    }
    loadAssets();
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
            pMovie.stop();
            pMovie.play("movie");
            akra.self.cameraLight.enabled = false;
            setTimeout(/** @inline */function () {
                // self.voice.currentTime = 0;
                akra.self.voice.play();
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
        });
        pKeymap.bind("add", /** @inline */function () {
            var pMovie = akra.self.hero.movie;
            if (akra.isNull(pMovie)) {
                return;
            }
            // var pCont: IAnimationContainer = <IAnimationContainer>pMovie.findAnimation("movie");
            // pCont.setSpeed(pCont.speed * 2.0);
                    });
        pKeymap.bind("SUBTRACT", /** @inline */function () {
            var pMovie = akra.self.hero.movie;
            if (akra.isNull(pMovie)) {
                return;
            }
            // var pCont: IAnimationContainer = <IAnimationContainer>pMovie.findAnimation("movie");
            // pCont.setSpeed(pCont.speed / 2.0);
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
        pTerrainMap["height"] = pRmgr.imagePool.findResource("TERRAIN_HEIGHT_MAP");
        pTerrainMap["normal"] = pRmgr.imagePool.findResource("TERRAIN_NORMAL_MAP");
        var isCreate = pTerrain.init(pTerrainMap, new akra.geometry.Rect3d(-250, 250, -250, 250, 0, 150), 6, 4, 4, "main");
        pTerrain.attachToParent(pScene.getRootNode());
        pTerrain.setInheritance(akra.ENodeInheritance.ALL);
        pTerrain.setRotationByXYZAxis(-Math.PI / 2, 0., 0.);
        pTerrain.setPosition(11, -109, -109.85);
        akra.self.terrain = pTerrain;
    }
    function createSkyBox() {
        pSkyBoxTexture = pRmgr.createTexture(".sky-box-texture");
        pSkyBoxTexture.loadResource("SKYBOX");
        if (pViewport.type === akra.EViewportTypes.DSVIEWPORT) {
            (pViewport).setSkybox(pSkyBoxTexture);
        }
    }
    function createModelEntry(sResource) {
        var pModel = pRmgr.colladaPool.findResource(sResource);
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
        pCamLight.params.diffuse.set(1.);
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
        var pTubeBetweenRocks = createModelEntry("TUBE_BETWEEN_ROCKS");
        pTubeBetweenRocks.scale(2.);
        pTubeBetweenRocks.setRotationByXYZAxis(5. * akra.math.RADIAN_RATIO, 100. * akra.math.RADIAN_RATIO, 0.);
        pTubeBetweenRocks.setPosition(new akra.Vec3(-55., -12.15, -82.00));
        pScene.bind("beforeUpdate", update);
        var pMovie = pRmgr.colladaPool.findResource("HERO_FILM");
        var pAnim = pMovie.extractAnimation(0);
        var pContainer = akra.animation.createContainer(pAnim, "movie");
        var pController = pEngine.createAnimationController("movie");
        pController.addAnimation(pContainer);
        pController.stop();
        pHeroModel.addController(pController);
        akra.self.hero.movie = pController;
        fetchAllCameras();
    }
    function main(pEngine) {
        setup();
        createSceneEnvironment();
        createCameras();
        createViewports();
        createTerrain();
        createModels();
        createSkyBox();
        createLighting();
        pEngine.exec();
    }
    pEngine.bind("depsLoaded", main);
})(akra || (akra = {}));
