


/*---------------------------------------------
 * assembled at: Wed Aug 07 2013 12:30:14 GMT+0400 (Московское время (лето))
 * directory: tests/common/fx/DEBUG/
 * file: tests/common/fx/test-example.ts
 * name: test-example
 *--------------------------------------------*/


var akra;
(function (akra) {
    akra.pEngine = akra.createEngine();
    var pRmgr = akra.pEngine.getResourceManager();
    var pScene = akra.pEngine.getScene();
    var pUI = akra.pEngine.getSceneManager().createUI();
    var pCanvas = akra.pEngine.getRenderer().getDefaultCanvas();
    var pMainScene = null;
    akra.pCamera = null;
    akra.pViewport = null;
    var pSkyBoxTexture = null;
    function setup() {
        var pCanvasElement = (pCanvas)._pCanvas;
        pMainScene = $("<div id='main-scene'/>");
        $(document.body).append(pMainScene);
        pMainScene.append(pCanvasElement);
        pCanvas.resize(800, 600);
    }
    function createSceneEnvironment() {
        var pSceneQuad = akra.util.createQuad(pScene, 100.);
        pSceneQuad.attachToParent(pScene.getRootNode());
        var pSceneSurface = akra.util.createSceneSurface(pScene, 40);
        pSceneSurface.addPosition(0, 0.01, 0);
        pSceneSurface.scale(5.);
        pSceneSurface.attachToParent(pScene.getRootNode());
        //pSceneQuad.addPosition(0., 0., )
        // pSceneQuad.addRelRotationByXYZAxis(0, Math.PI/2, 0);
            }
    function createCameras() {
        akra.pCamera = pScene.createCamera();
        akra.pCamera.addPosition(new akra.Vec3(0, 4, 5));
        akra.pCamera.addRelRotationByXYZAxis(-0.2, 0., 0.);
        akra.pCamera.attachToParent(pScene.getRootNode());
        var pKeymap = akra.controls.createKeymap();
        pKeymap.captureMouse((pCanvas)._pCanvas);
        pKeymap.captureKeyboard(document);
        pScene.bind("beforeUpdate", /** @inline */function () {
            if (pKeymap.isMousePress() && pKeymap.isMouseMoved()) {
                var v2fMouseShift = pKeymap.getMouseShift();
                var fdX = v2fMouseShift.x / akra.pViewport.actualWidth * 10.0;
                var fdY = v2fMouseShift.y / akra.pViewport.actualHeight * 10.0;
                akra.pCamera.setRotationByXYZAxis(-fdY, -fdX, 0);
                var fSpeed = 0.1 * 1 / 5;
                if (pKeymap.isKeyPress(akra.EKeyCodes.W)) {
                    akra.pCamera.addRelPosition(0, 0, -fSpeed);
                }
                if (pKeymap.isKeyPress(akra.EKeyCodes.S)) {
                    akra.pCamera.addRelPosition(0, 0, fSpeed);
                }
                if (pKeymap.isKeyPress(akra.EKeyCodes.A)) {
                    akra.pCamera.addRelPosition(-fSpeed, 0, 0);
                }
                if (pKeymap.isKeyPress(akra.EKeyCodes.D)) {
                    akra.pCamera.addRelPosition(fSpeed, 0, 0);
                }
            }
        });
    }
    function createViewports() {
        akra.pViewport = pCanvas.addViewport(akra.pCamera, akra.EViewportTypes.DSVIEWPORT);
        var pStats = pUI.createComponent("RenderTargetStats");
        pStats.target = akra.pViewport.getTarget();
        pStats.render(pMainScene);
        pStats.el.css({
            position: "relative",
            top: "-600"
        });
    }
    function createLighting() {
        var pOmniLight = pScene.createLightPoint(akra.ELightTypes.OMNI, false, 0, "test-omni-0");
        pOmniLight.attachToParent(pScene.getRootNode());
        pOmniLight.enabled = false;
        pOmniLight.params.ambient.set(0.1, 0.1, 0.1, 1);
        pOmniLight.params.diffuse.set(0.2);
        pOmniLight.params.specular.set(1, 1, 1, 1);
        pOmniLight.params.attenuation.set(0.5, 0, 0);
        pOmniLight.addPosition(1, 5, 3);
        // var pProjectShadowLight: ILightPoint = pScene.createLightPoint(ELightTypes.PROJECT, true, 512, "test-project-0");
        // pProjectShadowLight.attachToParent(pScene.getRootNode());
        // pProjectShadowLight.enabled = true;
        // pProjectShadowLight.params.ambient.set(0.1, 0.1, 0.1, 1);
        // pProjectShadowLight.params.diffuse.set(0.5);
        // pProjectShadowLight.params.specular.set(1, 1, 1, 1);
        // pProjectShadowLight.params.attenuation.set(1,0,0);
        // pProjectShadowLight.isShadowCaster = true;
        // pProjectShadowLight.addRelRotationByXYZAxis(0, -0.5, 0);
        // pProjectShadowLight.addRelPosition(0, 3, 10);
        // pProjectShadowLight = pScene.createLightPoint(ELightTypes.PROJECT, true, 512, "test-project-1");
        // pProjectShadowLight.attachToParent(pScene.getRootNode());
        // pProjectShadowLight.enabled = true;
        // pProjectShadowLight.params.ambient.set(0.1, 0.1, 0.1, 1);
        // pProjectShadowLight.params.diffuse.set(0.2);
        // pProjectShadowLight.params.specular.set(1, 1, 1, 1);
        // pProjectShadowLight.params.attenuation.set(1,0,0);
        // pProjectShadowLight.isShadowCaster = true;
        // pProjectShadowLight.addRelRotationByXYZAxis(0, 0.5, 0);
        // pProjectShadowLight.addRelPosition(0, 3, 10);
        // pProjectShadowLight = pScene.createLightPoint(ELightTypes.PROJECT, true, 512, "test-project-2");
        // pProjectShadowLight.attachToParent(pScene.getRootNode());
        // pProjectShadowLight.enabled = false;
        // pProjectShadowLight.params.ambient.set(0.1, 0.1, 0.1, 1);
        // pProjectShadowLight.params.diffuse.set(0.5);
        // pProjectShadowLight.params.specular.set(1, 1, 1, 1);
        // pProjectShadowLight.params.attenuation.set(1,0,0);
        // pProjectShadowLight.isShadowCaster = true;
        // pProjectShadowLight.addRelRotationByXYZAxis(0, 0, 0);
        // pProjectShadowLight.addRelPosition(0, 3, 10);
        // pProjectShadowLight = pScene.createLightPoint(ELightTypes.PROJECT, true, 512, "test-project-3");
        // pProjectShadowLight.attachToParent(pScene.getRootNode());
        // pProjectShadowLight.enabled = true;
        // pProjectShadowLight.params.ambient.set(0.1, 0.1, 0.1, 1);
        // pProjectShadowLight.params.diffuse.set(0.5);
        // pProjectShadowLight.params.specular.set(1, 1, 1, 1);
        // pProjectShadowLight.params.attenuation.set(1,0,0);
        // pProjectShadowLight.isShadowCaster = false;
        // pProjectShadowLight.addRelRotationByXYZAxis(0, -0.25, 0);
        // pProjectShadowLight.addRelPosition(0, 3, 10);
        // pProjectShadowLight = pScene.createLightPoint(ELightTypes.PROJECT, true, 512, "test-project-4");
        // pProjectShadowLight.attachToParent(pScene.getRootNode());
        // pProjectShadowLight.enabled = true;
        // pProjectShadowLight.params.ambient.set(0.1, 0.1, 0.1, 1);
        // pProjectShadowLight.params.diffuse.set(0.5);
        // pProjectShadowLight.params.specular.set(1, 1, 1, 1);
        // pProjectShadowLight.params.attenuation.set(1,0,0);
        // pProjectShadowLight.isShadowCaster = true;
        // pProjectShadowLight.addRelRotationByXYZAxis(0, 0.25, 0);
        // pProjectShadowLight.addRelPosition(0, 3, 10);
        // pProjectShadowLight = pScene.createLightPoint(ELightTypes.PROJECT, true, 512, "test-project-5");
        // pProjectShadowLight.attachToParent(pScene.getRootNode());
        // pProjectShadowLight.enabled = true;
        // pProjectShadowLight.params.ambient.set(0.1, 0.1, 0.1, 1);
        // pProjectShadowLight.params.diffuse.set(0.5);
        // pProjectShadowLight.params.specular.set(1, 1, 1, 1);
        // pProjectShadowLight.params.attenuation.set(1,0,0);
        // pProjectShadowLight.isShadowCaster = true;
        // pProjectShadowLight.addRelRotationByXYZAxis(0, 0.1, 0);
        // pProjectShadowLight.addRelPosition(0, 3, 10);
        // pProjectShadowLight = pScene.createLightPoint(ELightTypes.PROJECT, true, 512, "test-project-6");
        // pProjectShadowLight.attachToParent(pScene.getRootNode());
        // pProjectShadowLight.enabled = true;
        // pProjectShadowLight.params.ambient.set(0.1, 0.1, 0.1, 1);
        // pProjectShadowLight.params.diffuse.set(0.5);
        // pProjectShadowLight.params.specular.set(1, 1, 1, 1);
        // pProjectShadowLight.params.attenuation.set(1,0,0);
        // pProjectShadowLight.isShadowCaster = true;
        // pProjectShadowLight.addRelRotationByXYZAxis(0, -0.1, 0);
        // pProjectShadowLight.addRelPosition(0, 3, 10);
        var pOmniShadowLight = pScene.createLightPoint(akra.ELightTypes.OMNI, true, 512, "test-omni-1");
        pOmniShadowLight.attachToParent(pScene.getRootNode());
        pOmniShadowLight.enabled = true;
        pOmniShadowLight.params.ambient.set(0.1, 0.1, 0.1, 1);
        pOmniShadowLight.params.diffuse.set(0.5);
        pOmniShadowLight.params.specular.set(1, 1, 1, 1);
        pOmniShadowLight.params.attenuation.set(1, 0.0, 0);
        pOmniShadowLight.isShadowCaster = false;
        pOmniShadowLight.setPosition(1, 5, 5);
    }
    function createSkyBox() {
        pSkyBoxTexture = pRmgr.createTexture(".sky-box-texture");
        //pSkyBoxTexture.loadResource("../../../data/textures/skyboxes/sky_box1-1.dds");
        pSkyBoxTexture.loadResource(akra.DATA + "textures/skyboxes/desert-2.dds");
        pSkyBoxTexture.bind("loaded", function (pTexture) {
            (akra.pViewport).setSkybox(pTexture);
        });
    }
    function loadModel(sPath, fnCallback) {
        var pModelRoot = pScene.createNode();
        var pModel = pRmgr.loadModel(sPath);
        pModelRoot.attachToParent(pScene.getRootNode());
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
            pScene.bind("beforeUpdate", /** @inline */function () {
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
            pModel.bind("loaded", fnLoadModel);
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
            for(var i = 0; i < nCount; i++) {
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
            // pEngine.exec();
                    });
    }
    function loadHero() {
        var pModelRoot = pScene.createNode();
        var pController = akra.pEngine.createAnimationController("movie");
        var pHeroData = pRmgr.loadModel(akra.DATA + "models/hero/movie.DAE");
        pModelRoot.attachToParent(pScene.getRootNode());
        pHeroData.bind("loaded", /** @inline */function () {
            pHeroData.attachToScene(pModelRoot);
            var pMovieData = pRmgr.loadModel(akra.DATA + "models/hero/movie_anim.DAE");
            pMovieData.bind("loaded", /** @inline */function () {
                var pAnim = pMovieData.extractAnimation(0);
                var pMovie = akra.animation.createContainer(pAnim, "movie");
                pMovie.useLoop(true);
                // LOG(pMovieData);
                // window["movieData"] = pMovieData;
                // pController.addAnimation(pMovie);
                // pMovie.rightInfinity(false);
                // pController.stop();
                var pWalkData = pRmgr.loadModel(akra.DATA + "models/hero/walk.DAE");
                pWalkData.bind("loaded", /** @inline */function () {
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
        setup();
        // createSceneEnvironment();
        createCameras();
        createViewports();
        createLighting();
        createSkyBox();
        // loadModels("../../../data/models/kr360.dae");
        // loadModel(DATA + "models/hero/walk.DAE", (pModelRoot: ISceneNode) => {
        // 	// var pMesh: IMesh = (<ISceneModel>pModelRoot.findEntity("node-Bip001_Pelvis[mesh-container]")).mesh;
        // 	// pMesh.createBoundingBox();h
        // 	// pMesh.showBoundingBox();
        // }).scale(2.);
        // // loadHero();
        // loadModel(DATA + "models/WoodSoldier/WoodSoldier.DAE").addPosition(0., 1.1, 0.);
        // var pCube: ISceneNode = loadModel("../../../data/models/cube.dae");
        // pCube.setPosition(2., 0.8, -3.);
        // pCube.scale(0.1);
        // var pCube2: ISceneNode = loadModel("../../../data/models/cube.dae");
        // pCube2.setPosition(2., 0.8, -5.);
        // pCube2.scale(0.1);
        // loadManyModels(1, DATA + "models/cube.dae");
        loadManyModels(100, akra.DATA + "models/box/opened_box.dae");
    }
    akra.pEngine.bind("depsLoaded", main);
    akra.pEngine.exec();
})(akra || (akra = {}));
