/// <reference path="../../build/akra.d.ts" />
/// <reference path="../../build/addons/base3dObjects.addon.d.ts" />
/// <reference path="../../build/addons/navigation.addon.d.ts" />
var akra;
(function (akra) {
    var pDeps = {
        root: "../../../src2/data/",
        files: [
            { path: "textures/terrain/main_height_map_1025.dds", name: "TERRAIN_HEIGHT_MAP" },
            { path: "textures/terrain/main_terrain_normal_map.dds", name: "TERRAIN_NORMAL_MAP" },
            { path: "textures/skyboxes/desert-3.dds", name: "SKYBOX" },
            { path: "textures/terrain/diffuse.dds", name: "MEGATEXTURE_MIN_LEVEL" }
        ]
    };

    akra.pEngine = akra.createEngine({ deps: pDeps });
    akra.pScene = akra.pEngine.getScene();
    akra.pCanvas = akra.pEngine.getRenderer().getDefaultCanvas();
    akra.pCamera = null;
    akra.pViewport = null;
    akra.pRmgr = akra.pEngine.getResourceManager();
    akra.pSky = null;
    akra.pTerrain = null;

    var data = "../../../src2/data/";

    function setup(pCanvas) {
        var pCanvasElement = pCanvas._pCanvas;
        var pDiv = document.createElement("div");

        document.body.appendChild(pDiv);
        pDiv.appendChild(pCanvasElement);
        pDiv.style.position = "fixed";
    }

    function createSceneEnvironment() {
        var pSceneQuad = akra.addons.createQuad(akra.pScene, 100.);
        pSceneQuad.attachToParent(akra.pScene.getRootNode());

        //pSceneQuad.addPosition(0., 1., 0.);
        var pSceneSurface = akra.addons.createSceneSurface(akra.pScene, 40);
        pSceneSurface.addPosition(0, 0.01, 0);
        pSceneSurface.scale(5.);
        pSceneSurface.attachToParent(akra.pScene.getRootNode());
    }

    function createCamera() {
        var pCamera = akra.pScene.createCamera();

        pCamera.addPosition(new akra.math.Vec3(0, 4, 5));
        pCamera.addRelRotationByXYZAxis(-0.2, 0., 0.);
        pCamera.attachToParent(akra.pScene.getRootNode());

        pCamera.update();

        return pCamera;
    }

    function createKeymap(pCamera) {
        var pKeymap = akra.control.createKeymap();
        pKeymap.captureMouse(akra.pCanvas._pCanvas);
        pKeymap.captureKeyboard(document);

        akra.pScene.beforeUpdate.connect(function () {
            if (pKeymap.isMousePress() && pKeymap.isMouseMoved()) {
                var v2fMouseShift = pKeymap.getMouseShift();

                var fdX = v2fMouseShift.x / akra.pViewport.getActualWidth() * 10.0;
                var fdY = v2fMouseShift.y / akra.pViewport.getActualHeight() * 10.0;

                pCamera.setRotationByXYZAxis(-fdY, -fdX, 0);

                var fSpeed = 0.1 * 10;
                if (pKeymap.isKeyPress(87 /* W */)) {
                    pCamera.addRelPosition(0, 0, -fSpeed);
                }
                if (pKeymap.isKeyPress(83 /* S */)) {
                    pCamera.addRelPosition(0, 0, fSpeed);
                }
                if (pKeymap.isKeyPress(65 /* A */)) {
                    pCamera.addRelPosition(-fSpeed, 0, 0);
                }
                if (pKeymap.isKeyPress(68 /* D */)) {
                    pCamera.addRelPosition(fSpeed, 0, 0);
                }
            }
        });
    }

    function createTerrain(pScene, bShowMegaTex, eType) {
        if (typeof bShowMegaTex === "undefined") { bShowMegaTex = true; }
        if (typeof eType === "undefined") { eType = 67 /* TERRAIN_ROAM */; }
        var pRmgr = pScene.getManager().getEngine().getResourceManager();
        var pTerrain = null;
        if (eType === 67 /* TERRAIN_ROAM */) {
            pTerrain = pScene.createTerrainROAM("Terrain");
            pTerrain.setUseTessellationThread(false);
        } else {
            pTerrain = pScene.createTerrain("Terrain");
        }

        var pTerrainMap = {
            height: pRmgr.getImagePool().findResource("TERRAIN_HEIGHT_MAP"),
            normal: pRmgr.getImagePool().findResource("TERRAIN_NORMAL_MAP")
        };

        // pTerrain.manualMegaTextureInit = !bShowMegaTex;
        var isCreate = pTerrain.init(pTerrainMap, new akra.geometry.Rect3d(-250, 250, -250, 250, 0, 150), 7, 3, 3, "main");
        pTerrain.attachToParent(pScene.getRootNode());
        pTerrain.setInheritance(4 /* ALL */);

        pTerrain.setRotationByXYZAxis(-Math.PI / 2, 0., 0.);
        pTerrain.setPosition(11, -109, -109.85);

        var pMinLevel = pRmgr.getImagePool().findResource("MEGATEXTURE_MIN_LEVEL");
        if (pMinLevel) {
            pTerrain.getMegaTexture().setMinLevelTexture(pMinLevel);
            //(<terrain.MegaTexture>pTerrain.getMegaTexture()).enableStreaming(true);
        }

        pTerrain.setShowMegaTexture(bShowMegaTex);

        return pTerrain;
    }

    function createViewport() {
        var pViewport = new akra.render.DSViewport(akra.pCamera);
        akra.pCanvas.addViewport(pViewport);
        akra.pCanvas.resize(window.innerWidth, window.innerHeight);

        //(<render.DSViewport>pViewport).setFXAA(false);
        return pViewport;
    }

    function createLighting() {
        var pOmniLight = akra.pScene.createLightPoint(2 /* OMNI */, true, 512, "test-omni-0");

        pOmniLight.attachToParent(akra.pScene.getRootNode());
        pOmniLight.setEnabled(true);
        pOmniLight.getParams().ambient.set(0.1, 0.1, 0.1, 1);
        pOmniLight.getParams().diffuse.set(0.5);
        pOmniLight.getParams().specular.set(1, 1, 1, 1);
        pOmniLight.getParams().attenuation.set(1, 0, 0);
        pOmniLight.setShadowCaster(false);

        pOmniLight.addPosition(1, 100, 3);
    }

    function createSky() {
        akra.pSky = new akra.model.Sky(akra.pEngine, 32, 32, 1000.0);
        akra.pSky.setTime(15.);

        akra.pSky.sun.setShadowCaster(false);

        var pSceneModel = akra.pSky.skyDome;
        pSceneModel.attachToParent(akra.pScene.getRootNode());
    }

    function createSkyBox() {
        var pSkyBoxTexture = akra.pRmgr.createTexture(".sky-box-texture");
        pSkyBoxTexture.loadResource("SKYBOX");

        if (akra.pViewport.getType() === 1 /* DSVIEWPORT */) {
            akra.pViewport.setSkybox(pSkyBoxTexture);
        }
    }

    function loadModel(sPath, fnCallback) {
        var pModelRoot = akra.pScene.createNode();
        var pModel = akra.pEngine.getResourceManager().loadModel(sPath);

        pModelRoot.attachToParent(akra.pScene.getRootNode());

        function fnLoadModel(pModel) {
            pModel.attachToScene(pModelRoot);

            if (pModel.isAnimationLoaded()) {
                var pController = akra.pEngine.createAnimationController();
                var pContainer = akra.animation.createContainer();
                var pAnimation = pModel.extractAnimation(0);

                pController.attach(pModelRoot);

                pContainer.setAnimation(pAnimation);
                pContainer.useLoop(true);
                pController.addAnimation(pContainer);
            }

            akra.pScene.beforeUpdate.connect(function () {
                pModelRoot.addRelRotationByXYZAxis(0.00, 0.01, 0);
                // pController.update();
            });

            if (akra.isFunction(fnCallback)) {
                fnCallback(pModelRoot);
            }
        }

        if (pModel.isResourceLoaded()) {
            fnLoadModel(pModel);
        } else {
            pModel.loaded.connect(fnLoadModel);
        }

        return pModelRoot;
    }

    function loadManyModels(nCount, sPath) {
        var iRow = 0;
        var iCountInRow = 0;

        var fDX = 2.;
        var fDZ = 2.;

        var fShiftX = 0.;
        var fShiftZ = 0.;

        var pCube = pCube = loadModel(sPath, function (pModelRoot) {
            for (var i = 0; i < nCount; i++) {
                if (iCountInRow > iRow) {
                    iCountInRow = 0;
                    iRow++;

                    fShiftX = -iRow * fDX / 2;
                    fShiftZ = -iRow * fDZ;
                }

                pCube = i === 0 ? pCube : loadModel(sPath);
                pCube.setPosition(fShiftX, 0.8, fShiftZ - 2.);
                pCube.scale(0.1);

                fShiftX += fDX;
                iCountInRow++;
            }
            //pEngine.renderFrame();
        });
    }

    function loadHero() {
        var pModelRoot = akra.pScene.createNode();
        var pController = akra.pEngine.createAnimationController("movie");
        var pHeroData = akra.pRmgr.loadModel(data + "models/hero/movie.DAE");

        pModelRoot.attachToParent(akra.pScene.getRootNode());

        pHeroData.loaded.connect(function () {
            pHeroData.attachToScene(pModelRoot);

            var pMovieData = akra.pRmgr.loadModel(data + "models/hero/movie_anim.DAE");

            pMovieData.loaded.connect(function () {
                var pAnim = pMovieData.extractAnimation(0);
                var pMovie = akra.animation.createContainer(pAnim, "movie");

                pMovie.useLoop(true);

                // LOG(pMovieData);
                // window["movieData"] = pMovieData;
                // pController.addAnimation(pMovie);
                // pMovie.rightInfinity(false);
                // pController.stop();
                var pWalkData = akra.pRmgr.loadModel(data + "models/hero/walk.DAE");
                pWalkData.loaded.connect(function () {
                    var pAnim = pWalkData.extractAnimation(0);
                    var pWalk = akra.animation.createContainer(pAnim, "walk");

                    pWalk.useLoop(true);

                    var pBlender = akra.animation.createBlend();

                    // pBlender.addAnimation(pMovie, 1);
                    pBlender.addAnimation(pWalk, 1);

                    pController.addAnimation(pBlender);
                    pModelRoot.addController(pController);
                });
            });
        });
    }

    function main(pEngine) {
        setup(akra.pCanvas);

        akra.pCamera = createCamera();
        akra.pViewport = createViewport();

        akra.addons.navigation(akra.pViewport, null, function () {
            alert(1);
        });

        createKeymap(akra.pCamera);

        //createSceneEnvironment();
        //createLighting();
        createSkyBox();
        createSky();

        //pTerrain = createTerrain(pScene, true, EEntityTypes.TERRAIN);
        //loadHero();
        loadManyModels(300, data + "models/cube.dae");

        //loadManyModels(100, data + "models/box/opened_box.dae");
        //loadModel(data + "models/WoodSoldier/WoodSoldier.DAE").addPosition(0., 1.1, 0.);
        pEngine.exec();
        //pEngine.renderFrame();
    }

    akra.pEngine.depsLoaded.connect(main);
})(akra || (akra = {}));
