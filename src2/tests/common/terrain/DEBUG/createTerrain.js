


/*---------------------------------------------
 * assembled at: Mon Jul 22 2013 14:35:35 GMT+0400 (Московское время (лето))
 * directory: tests/common/terrain/DEBUG/
 * file: tests/common/terrain/createTerrain.ts
 * name: createTerrain
 *--------------------------------------------*/


var akra;
(function (akra) {
    akra.pEngine = akra.createEngine();
    akra.pTerrain = null;
    akra.pCamera = null;
    akra.pMainLightPoint = null;
    var pRmgr = akra.pEngine.getResourceManager();
    var pScene = akra.pEngine.getScene();
    var pUI = akra.pEngine.getSceneManager().createUI();
    var pCanvas = akra.pEngine.getRenderer().getDefaultCanvas();
    var pMainScene = null;
    var pViewport = null;
    var pSkyBoxTexture = null;
    akra.pTestNode = null;
    function setup() {
        var pCanvasElement = (pCanvas)._pCanvas;
        pMainScene = $("<div id='main-scene'/>");
        $(document.body).append(pMainScene);
        pMainScene.append(pCanvasElement);
        pCanvas.resize(960, 720);
        // var pCanvasLOD = $("<canvas id='canvasLOD' width=600 height=600 style='float: right'>");
        // pMainScene.append(pCanvasLOD);
        //
        // for(var i: uint = 0; i < 4; i++){
        // 	pMainScene.append($("<canvas id='canvasVariance" + i + "' width=512 height=512 style='float: bottom'>"));
        // }
            }
    function createCameras() {
        akra.pTestNode = pScene.createNode();
        akra.pTestNode.attachToParent(pScene.getRootNode());
        akra.pCamera = pScene.createCamera();
        //pCamera.addRelRotationByXYZAxis(1, 1, 0);
        akra.pCamera.farPlane = 700;
        akra.pCamera.setPosition(new akra.Vec3(0, 500, 0));
        akra.pCamera.attachToParent(pScene.getRootNode());
        akra.pCamera.addRelRotationByXYZAxis(-Math.PI / 2, 0, 0);
        akra.pCamera.setInheritance(akra.ENodeInheritance.ALL);
        var pKeymap = akra.controls.createKeymap();
        pKeymap.captureMouse((pCanvas)._pCanvas);
        pKeymap.captureKeyboard(document);
        var iCounter = 0;
        var iSign = 1;
        pScene.bind("beforeUpdate", /** @inline */function () {
            if (pKeymap.isMousePress() && pKeymap.isMouseMoved()) {
                var v2fMouseShift = pKeymap.getMouseShift();
                var fdX = v2fMouseShift.x / pViewport.actualWidth * 10.0;
                var fdY = v2fMouseShift.y / pViewport.actualHeight * 10.0;
                akra.pCamera.setRotationByXYZAxis(-fdY, -fdX, 0);
            }
            var fSpeed = 0.1 * 10;
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
            if (pKeymap.isKeyPress(akra.EKeyCodes.SPACE)) {
                (akra.pEngine).pause(akra.pEngine.isActive());
            }
            // if(pKeymap.isKeyPress())
            // if((iCounter++) % 1000 === 0){
            // 	iSign *= -1;
            // }
            // pCamera.addRelPosition(iSign * 0.05, iSign * 0.05, 0);
                    });
    }
    function createViewports() {
        pViewport = pCanvas.addViewport(akra.pCamera, akra.EViewportTypes.DSVIEWPORT);
        var pStats = pUI.createComponent("RenderTargetStats");
        pStats.target = pViewport.getTarget();
        pStats.render(pMainScene);
        pStats.el.css({
            position: "relative",
            top: "-720px"
        });
    }
    function createLighting() {
        var pOmniLight = pScene.createLightPoint(akra.ELightTypes.OMNI, false, 0, "test-omni");
        pOmniLight.attachToParent(pScene.getRootNode());
        pOmniLight.enabled = true;
        pOmniLight.params.ambient.set(0.1, 0.1, 0.1, 1);
        pOmniLight.params.ambient.set(0., 0., 0., 0);
        pOmniLight.params.diffuse.set(1);
        //pOmniLight.params.specular.set(1, 1, 1, 1);
        pOmniLight.params.specular.set(0, 0, 0, 0);
        pOmniLight.params.attenuation.set(1, 0, 0);
        pOmniLight.addPosition(0, 1000, 0);
        akra.pMainLightPoint = pOmniLight;
    }
    function createSkyBox() {
        pSkyBoxTexture = pRmgr.createTexture(".sky-box-texture");
        pSkyBoxTexture.loadResource(akra.DATA + "textures/skyboxes/desert-3.dds");
        pSkyBoxTexture.bind("loaded", function (pTexture) {
            (pViewport).setSkybox(pTexture);
        });
    }
    function createTerrain() {
        akra.pTerrain = pScene.createTerrainROAM();
        var pTerrainMap = {};
        // shouldBeNotNull("new terrain");
        // ok(pTerrain);
        pTerrainMap["height"] = pRmgr.loadImage(akra.DATA + "textures/terrain/main_height_map_1025.dds");
        pTerrainMap["height"].bind("loaded", function (pTexture) {
            pTerrainMap["normal"] = pRmgr.loadImage(akra.DATA + "textures/terrain/main_terrain_normal_map.dds");
            pTerrainMap["normal"].bind("loaded", function (pTexture) {
                var isCreate = akra.pTerrain.init(pTerrainMap, new akra.geometry.Rect3d(-250, 250, -250, 250, 0, 200), 5, 5, 5, "main");
                akra.pTerrain.attachToParent(pScene.getRootNode());
                akra.pTerrain.setInheritance(akra.ENodeInheritance.ALL);
                // pTerrain.addRelRotationByXYZAxis(1, 1, 0);
                // pTerrain.scale(0.1);
                akra.pTerrain.addRelRotationByXYZAxis(-Math.PI / 2, 0, 0);
                // shouldBeTrue("terrain create");
                // ok(isCreate);
                // pTestNode.addRelRotationByXYZAxis(1, 1, 0);
                akra.pTerrain.megaTexture.bind("minLevelLoaded", /** @inline */function () {
                    akra.pEngine.exec();
                });
            });
        });
        // pTerrain.create();
        // ok(pTerrain);
            }
    function main(pEngine) {
        setup();
        createCameras();
        createViewports();
        createLighting();
        createTerrain();
        createSkyBox();
        // loadModels("../../../data/models/kr360.dae");
        // loadModels("../../../data/models/hero/hero.DAE");
        // loadModels("../../../data/models/WoodSoldier/WoodSoldier.DAE");
        // loadModels("../../../data/models/cube.dae").scale(0.1);
            }
    akra.pEngine.bind("depsLoaded", main);
    // pEngine.exec();
    // pEngine.renderFrame();
    })(akra || (akra = {}));
