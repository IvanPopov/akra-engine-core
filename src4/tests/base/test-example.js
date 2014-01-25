/// <reference path="../../build/akra.d.ts" />
var akra;
(function (akra) {
    akra.pEngine = akra.createEngine();
    akra.pScene = akra.pEngine.getScene();
    akra.pCanvas = akra.pEngine.getRenderer().getDefaultCanvas();
    akra.pCamera = null;
    akra.pViewport = null;

    function setup(pCanvas) {
        var pCanvasElement = pCanvas._pCanvas;
        var pDiv = document.createElement("div");

        document.body.appendChild(pDiv);
        pDiv.appendChild(pCanvasElement);
        pDiv.style.position = "fixed";
    }

    function createCamera() {
        var pCamera = akra.pScene.createCamera();

        pCamera.addPosition(new akra.math.Vec3(0, 4, 5));
        pCamera.addRelRotationByXYZAxis(-0.2, 0., 0.);
        pCamera.attachToParent(akra.pScene.getRootNode());

        pCamera.update();

        return pCamera;
    }

    function createViewport() {
        var pViewport = new akra.render.DSViewport(akra.pCamera);
        akra.pCanvas.addViewport(pViewport);
        akra.pCanvas.resize(window.innerWidth, window.innerHeight);

        return pViewport;
    }

    function createLighting() {
        var pOmniLight = akra.pScene.createLightPoint(2 /* OMNI */, false, 0, "test-omni-0");

        pOmniLight.attachToParent(akra.pScene.getRootNode());
        pOmniLight.setEnabled(true);
        pOmniLight.getParams().ambient.set(0.1, 0.1, 0.1, 1);
        pOmniLight.getParams().diffuse.set(0.5);
        pOmniLight.getParams().specular.set(1, 1, 1, 1);
        pOmniLight.getParams().attenuation.set(1, 0, 0);
        pOmniLight.setIsShadowCaster(false);

        pOmniLight.addPosition(1, 5, 3);
    }

    function createSkyBox() {
        var pSkyBoxTexture = akra.pEngine.getResourceManager().createTexture(".sky-box-texture");

        //pSkyBoxTexture.loadResource("../../../data/textures/skyboxes/sky_box1-1.dds");
        pSkyBoxTexture.loadResource("../../../src2/data/" + "textures/skyboxes/desert-2.dds");
        pSkyBoxTexture.loaded.connect(function (pTexture) {
            akra.pViewport.setSkybox(pTexture);
        });
    }

    function main(pEngine) {
        setup(akra.pCanvas);

        akra.pCamera = createCamera();
        akra.pViewport = createViewport();

        createLighting();
        createSkyBox();

        pEngine.exec();
    }

    akra.pEngine.depsLoaded.connect(main);
})(akra || (akra = {}));
