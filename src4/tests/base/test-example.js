/// <reference path="../../build/akra.d.ts" />
/// <reference path="../../build/addons/base3dObjects.addon.d.ts" />
/// <reference path="../../build/addons/navigation.addon.d.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
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

    var SimpleSceneObject = (function (_super) {
        __extends(SimpleSceneObject, _super);
        function SimpleSceneObject(pScene, eType) {
            if (typeof eType === "undefined") { eType = 64 /* SCENE_OBJECT */; }
            _super.call(this, pScene, eType);
            this._pRenderable = null;

            this._pLocalBounds.set(-1, 1, -1, 1, -1, 1);

            var pRenderable = new akra.render.RenderableObject();
            var pCollection = akra.pEngine.createRenderDataCollection(0);
            var pData = pCollection.getEmptyRenderData(5 /* TRIANGLESTRIP */);

            pData.allocateAttribute(akra.data.VertexDeclaration.normalize([akra.data.VertexElement.float3(akra.data.Usages.POSITION)]), new Float32Array([
                -1.0, -1.0, 1.0,
                1.0, -1.0, 1.0,
                1.0, 1.0, 1.0,
                -1.0, 1.0, 1.0,
                -1.0, -1.0, -1.0,
                -1.0, 1.0, -1.0,
                1.0, 1.0, -1.0,
                1.0, -1.0, -1.0,
                -1.0, 1.0, -1.0,
                -1.0, 1.0, 1.0,
                1.0, 1.0, 1.0,
                1.0, 1.0, -1.0,
                -1.0, -1.0, -1.0,
                1.0, -1.0, -1.0,
                1.0, -1.0, 1.0,
                -1.0, -1.0, 1.0,
                // Right face
                1.0, -1.0, -1.0,
                1.0, 1.0, -1.0,
                1.0, 1.0, 1.0,
                1.0, -1.0, 1.0,
                -1.0, -1.0, -1.0,
                -1.0, -1.0, 1.0,
                -1.0, 1.0, 1.0,
                -1.0, 1.0, -1.0
            ]));

            pRenderable._setRenderData(pData);
            pRenderable._setup(akra.pEngine.getRenderer());

            pRenderable.getEffect().addComponent("akra.system.mesh_geometry");
            pRenderable.getEffect().addComponent("akra.system.mesh_texture");

            pRenderable.getMaterial().emissive = new akra.color.Color(1., 0., 0., 1.);

            this._pRenderable = pRenderable;
        }
        SimpleSceneObject.prototype.getTotalRenderable = function () {
            return 1;
        };

        SimpleSceneObject.prototype.getRenderable = function (i) {
            return this._pRenderable;
        };
        return SimpleSceneObject;
    })(akra.scene.SceneObject);

    function createSimpleCube(sName) {
        if (typeof sName === "undefined") { sName = null; }
        var pCube = new SimpleSceneObject(akra.pScene);

        pCube.create();

        pCube.setName(sName);
        pCube.attached.connect(akra.pScene.nodeAttachment);
        pCube.detached.connect(akra.pScene.nodeDetachment);

        pCube.attachToParent(akra.pScene.getRootNode());

        return pCube;
    }

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
        var pCanvasElement = pCanvas.getElement();
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
        pKeymap.captureMouse(akra.pCanvas.getElement());
        pKeymap.captureKeyboard(document);

        akra.pScene.beforeUpdate.connect(function () {
            if (pKeymap.isMousePress() && pKeymap.isMouseMoved()) {
                var v2fMouseShift = pKeymap.getMouseShift();

                var fdX = v2fMouseShift.x / akra.pViewport.getActualWidth() * 5.0;
                var fdY = v2fMouseShift.y / akra.pViewport.getActualHeight() * 5.0;

                pCamera.addRelRotationByEulerAngles(-fdX, -fdY, 0);
                pKeymap.update();
            }

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

        window.onresize = function (event) {
            akra.pCanvas.resize(window.innerWidth, window.innerHeight);
        };

        //(<render.DSViewport>pViewport).setFXAA(false);
        return pViewport;
    }

    akra.pDepthRange = new akra.math.Vec2(0.5, 1.);
    var zIndex = 40.;
    function createTextureViewportForDepthTexture(pTexture, fLeft, fTop) {
        var pTextureViewport = akra.pCanvas.addViewport(new akra.render.TextureViewport(pTexture, fLeft, fTop, .15, .15, zIndex++));
        pTextureViewport.getEffect().addComponent("akra.system.display_depth");
        pTextureViewport.render.connect(function (pViewport, pTechnique, iPass) {
            pTechnique.getPass(iPass).setUniform("depthRange", akra.pDepthRange);
        });
    }

    function createLighting() {
        var pOmniLight = akra.pScene.createLightPoint(2 /* OMNI */, true, 512, "test-omni-0");

        pOmniLight.attachToParent(akra.pScene.getRootNode());
        pOmniLight.setEnabled(true);
        pOmniLight.getParams().ambient.set(0.1, 0.1, 0.1, 1);
        pOmniLight.getParams().diffuse.set(0.5);
        pOmniLight.getParams().specular.set(1, 1, 1, 1);
        pOmniLight.getParams().attenuation.set(1, 0, 0);
        pOmniLight.setShadowCaster(true);

        pOmniLight.addPosition(1, 5, 3);

        for (var i = 0; i < pOmniLight.getDepthTextureCube().length; i++) {
            createTextureViewportForDepthTexture(pOmniLight.getDepthTextureCube()[i], 0.02, 0.01 + 0.16 * (i));
        }

        var pProjectShadowLight = akra.pScene.createLightPoint(1 /* PROJECT */, true, 512, "test-project-0");

        pProjectShadowLight.attachToParent(akra.pScene.getRootNode());
        pProjectShadowLight.setEnabled(true);
        pProjectShadowLight.getParams().ambient.set(0.1, 0.1, 0.1, 1);
        pProjectShadowLight.getParams().diffuse.set(0.5);
        pProjectShadowLight.getParams().specular.set(1, 1, 1, 1);
        pProjectShadowLight.getParams().attenuation.set(1, 0, 0);
        pProjectShadowLight.setShadowCaster(true);

        pProjectShadowLight.addRelRotationByXYZAxis(0, -0.5, 0);
        pProjectShadowLight.addRelPosition(0, 3, 10);

        createTextureViewportForDepthTexture(pProjectShadowLight.getDepthTexture(), 0.18, 0.01);
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

    function createStatsDIV() {
        var pStatsDiv = document.createElement("div");

        document.body.appendChild(pStatsDiv);
        pStatsDiv.setAttribute("style", "position: fixed;" + "max-height: 40px;" + "max-width: 120px;" + "color: green;" + "margin: 5px;");

        return pStatsDiv;
    }

    function main(pEngine) {
        setup(akra.pCanvas);

        akra.pCamera = createCamera();
        akra.pViewport = createViewport();

        var pStatsDiv = createStatsDIV();

        akra.pCanvas.postUpdate.connect(function (pCanvas) {
            pStatsDiv.innerHTML = pCanvas.getAverageFPS().toFixed(2) + " fps";
        });

        //addons.navigation(pViewport);
        createKeymap(akra.pCamera);

        //createSceneEnvironment();
        //createLighting();
        //createSkyBox();
        createSimpleCube();

        //createSky();
        //pTerrain = createTerrain(pScene, true, EEntityTypes.TERRAIN);
        //loadHero();
        //loadManyModels(1, data + "models/cube.dae");
        //loadManyModels(100, data + "models/box/opened_box.dae");
        //var pSoldier = loadModel(data + "models/WoodSoldier/WoodSoldier.DAE", () => {
        //	(<ISceneModel>pSoldier.getChild().getChild().getChild()).getMesh().showBoundingBox();
        //	(<ISceneModel>pSoldier.getChild().getChild().getChild().getSibling()).getMesh().showBoundingBox();
        //});
        //pSoldier.addPosition(0., 1.1, 0.);
        pEngine.exec();
        //pEngine.renderFrame();
    }

    akra.pEngine.depsLoaded.connect(main);
})(akra || (akra = {}));
