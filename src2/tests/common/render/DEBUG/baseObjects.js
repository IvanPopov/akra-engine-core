


/*---------------------------------------------
 * assembled at: Thu Sep 19 2013 16:28:02 GMT+0400 (Московское время (лето))
 * directory: tests/common/render/DEBUG/
 * file: tests/common/render/baseObjects.ts
 * name: baseObjects
 *--------------------------------------------*/


///<reference path="../../../bin/DEBUG/akra.ts"/>
var akra;
(function (akra) {
    akra.pEngine = akra.createEngine();
    var pRmgr = akra.pEngine.getResourceManager();
    var pScene = akra.pEngine.getScene();
    var pCanvas = akra.pEngine.getRenderer().getDefaultCanvas();
    var pViewport = null;
    var pCamera = null;
    function setup() {
        var pCanvasElement = (pCanvas)._pCanvas;
        var pDiv = document.createElement("div");
        document.body.appendChild(pDiv);
        pDiv.appendChild(pCanvasElement);
        pDiv.style.position = "fixed";
    }
    function createCameras() {
        pCamera = pScene.createCamera();
        pCamera.attachToParent(pScene.getRootNode());
        pCamera.addRelRotationByEulerAngles(0., 0., 0.);
        pCamera.addRelPosition(0., 5.0, 11.0);
        pCamera.update();
        var pKeymap = akra.controls.createKeymap();
        pKeymap.captureMouse((pCanvas)._pCanvas);
        pKeymap.captureKeyboard(document);
        pScene.bind("beforeUpdate", /** @inline */function () {
            if (pKeymap.isMousePress() && pKeymap.isMouseMoved()) {
                var v2fMouseShift = pKeymap.getMouseShift();
                var fdX = v2fMouseShift.x / pViewport.actualWidth * 10.0;
                var fdY = v2fMouseShift.y / pViewport.actualHeight * 10.0;
                pCamera.setRotationByXYZAxis(-fdY, -fdX, 0);
                var fSpeed = 0.1 * 1 / 5;
                if (pKeymap.isKeyPress(akra.EKeyCodes.W)) {
                    pCamera.addRelPosition(0, 0, -fSpeed);
                }
                if (pKeymap.isKeyPress(akra.EKeyCodes.S)) {
                    pCamera.addRelPosition(0, 0, fSpeed);
                }
                if (pKeymap.isKeyPress(akra.EKeyCodes.A)) {
                    pCamera.addRelPosition(-fSpeed, 0, 0);
                }
                if (pKeymap.isKeyPress(akra.EKeyCodes.D)) {
                    pCamera.addRelPosition(fSpeed, 0, 0);
                }
            }
        });
    }
    function createViewports() {
        pViewport = new akra.render.DSViewport(pCamera);
        pCanvas.addViewport(pViewport);
        pCanvas.resize(window.innerWidth, window.innerHeight);
        window.onresize = function (event) {
            pCanvas.resize(window.innerWidth, window.innerHeight);
        };
    }
    function createLighting() {
        var pOmniLight = pScene.createLightPoint(akra.ELightTypes.OMNI, true, 512, "test-omni-1");
        pOmniLight.attachToParent(pScene.getRootNode());
        pOmniLight.enabled = true;
        pOmniLight.params.ambient.set(0.1, 0.1, 0.1, 1);
        pOmniLight.params.diffuse.set(0.5);
        pOmniLight.params.specular.set(1, 1, 1, 1);
        pOmniLight.params.attenuation.set(1, 0.0, 0);
        pOmniLight.isShadowCaster = false;
        pOmniLight.setPosition(1, 5, 5);
    }
    function createSceneEnvironment() {
        var pSceneSurface = akra.util.createSceneSurface(pScene, 40);
        pSceneSurface.addPosition(0, 0.01, 0);
        pSceneSurface.scale(5.);
        pSceneSurface.attachToParent(pScene.getRootNode());
    }
    var pEffect = null;
    function createObjects() {
        // var pSceneQuadA: ISceneModel = util.createQuad(pScene, 2.);
        // pSceneQuadA.attachToParent(pScene.getRootNode());
        // pSceneQuadA.setPosition(-4., 5., 0.);
        // pSceneQuadA.addRelRotationByXYZAxis(Math.PI/2, 0, 0);
        var pSceneQuadB = akra.util.createSimpleQuad(pScene, 2.);
        pSceneQuadB.attachToParent(pScene.getRootNode());
        pSceneQuadB.setPosition(4., 5., 0.);
        pSceneQuadB.addRelRotationByXYZAxis(Math.PI / 2, 0, 0);
        pEffect = pSceneQuadB.getRenderable().getTechnique().getMethod().effect;
        // pSceneQuadB.getRenderable().getTechnique().addComponent("test");
            }
    var isAdded = false;
    function test() {
        isAdded ? del() : add();
    }
    akra.test = test;
    function add() {
        pEffect.addComponent("test");
        isAdded = true;
    }
    akra.add = add;
    function del() {
        pEffect.delComponent("test");
        isAdded = false;
    }
    akra.del = del;
    function main(pEngine) {
        setup();
        createCameras();
        createViewports();
        createLighting();
        // createSceneEnvironment();
        createObjects();
        pEngine.exec();
    }
    akra.pEngine.bind("depsLoaded", main);
})(akra || (akra = {}));
