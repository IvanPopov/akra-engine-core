/// <reference path="../../../built/Lib/akra.d.ts" />
/// <reference path="../../../built/Lib/base3dObjects.addon.d.ts" />
var akra;
(function (akra) {
    (function (std) {
        /**
        * Append canvas element to DOM. Default to document.body.
        * By default canvas will be appended with "position: fixed;"  style.
        *
        * @param pCanvas Canvas.
        * @param pParent Parent HTML element.
        */
        function setup(pCanvas, pParent) {
            if (typeof pParent === "undefined") { pParent = document.body; }
            var pCanvasElement = pCanvas.getElement();
            var pDiv = document.createElement("div");

            pParent.appendChild(pDiv);
            pDiv.appendChild(pCanvasElement);
            pDiv.style.position = "fixed";
        }
        std.setup = setup;

        /**
        * �reate a camera at @vPos, and looks into center of the stage.
        * @param pScene Scene.
        * @param vPos Camera position.
        * @return Created camera.
        */
        function createCamera(pScene, vPos) {
            if (typeof vPos === "undefined") { vPos = akra.Vec3.temp(0., 0., .0); }
            var pCamera = pScene.createCamera();

            pCamera.attachToParent(pScene.getRootNode());
            pCamera.setPosition(vPos);
            pCamera.lookAt(akra.Vec3.temp(0., 0., 0.));

            pCamera.update();

            return pCamera;
        }
        std.createCamera = createCamera;

        /**
        * Create light point at @vPos and look at @vTarget.
        * @param pScene Scene.
        * @param eType Type of light.
        * @return Light point;
        */
        function createLighting(pScene, eType, vPos, vTarget) {
            if (typeof eType === "undefined") { eType = 2 /* OMNI */; }
            if (typeof vPos === "undefined") { vPos = null; }
            if (typeof vTarget === "undefined") { vTarget = null; }
            var pLight = pScene.createLightPoint(eType, true, 512, "omni-light-" + akra.guid());

            pLight.attachToParent(pScene.getRootNode());
            pLight.setEnabled(true);

            switch (eType) {
                case 2 /* OMNI */:
                case 1 /* PROJECT */:
                    //IOmniParameters & IProjectParameters same.
                    var pParams = pLight.getParams();
                    pParams.ambient.set(0.1, 0.1, 0.1, 1);
                    pParams.diffuse.set(0.5);
                    pParams.specular.set(1, 1, 1, 1);
                    pParams.attenuation.set(1, 0, 0);
            }

            if (!akra.isNull(vPos)) {
                pLight.setPosition(vPos);
            }

            if (!akra.isNull(vTarget)) {
                pLight.lookAt(vTarget);
            }

            return pLight;
        }
        std.createLighting = createLighting;

        /**
        * Create keymap. Control camera via W,S,A,D and mouse.
        * @param pViewport Viewport where keymap will be work.
        * @param pCamera. If camera not specified, will be used camera from @pViewport.
        */
        function createKeymap(pViewport, pCamera) {
            if (typeof pCamera === "undefined") { pCamera = null; }
            var pCanvas = pViewport.getTarget().getRenderer().getDefaultCanvas();
            var pKeymap = akra.control.createKeymap();

            if (akra.isNull(pCamera)) {
                pCamera = pViewport.getCamera();
            }

            pKeymap.captureMouse(pCanvas.getElement());
            pKeymap.captureKeyboard(document);

            var pScene = pCamera.getScene();

            pScene.beforeUpdate.connect(function () {
                if (pKeymap.isMousePress() && pKeymap.isMouseMoved()) {
                    var v2fMouseShift = pKeymap.getMouseShift();

                    var fdX = v2fMouseShift.x / pViewport.getActualWidth() * 10.0;
                    var fdY = v2fMouseShift.y / pViewport.getActualHeight() * 10.0;

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

            return pKeymap;
        }
        std.createKeymap = createKeymap;

        /**
        * Create default scene objects: scene surface, scene plane.
        */
        function createSceneEnvironment(pScene, bCreateQuad, bCreateSurface, fSize) {
            if (typeof bCreateQuad === "undefined") { bCreateQuad = true; }
            if (typeof bCreateSurface === "undefined") { bCreateSurface = true; }
            if (typeof fSize === "undefined") { fSize = 100; }
            if (bCreateQuad) {
                var pSceneQuad = akra.addons.createQuad(pScene, fSize * 5.);
                pSceneQuad.attachToParent(pScene.getRootNode());
            }

            if (bCreateSurface) {
                var pSceneSurface = akra.addons.createSceneSurface(pScene, fSize);

                pSceneSurface.addPosition(0, -0.01, 0);
                pSceneSurface.attachToParent(pScene.getRootNode());
            }
        }
        std.createSceneEnvironment = createSceneEnvironment;

        /** Create model entry from Collada pool by name @sResource */
        function createModelEntry(pScene, sResource) {
            var pRmgr = pScene.getManager().getEngine().getResourceManager();
            var pModel = pRmgr.getColladaPool().findResource(sResource);
            var pModelRoot = pModel.attachToScene(pScene);

            return pModelRoot;
        }
        std.createModelEntry = createModelEntry;
    })(akra.std || (akra.std = {}));
    var std = akra.std;
})(akra || (akra = {}));
/// <reference path="../../../built/Lib/akra.d.ts" />
/// <reference path="../../../built/Lib/progress.addon.d.ts" />
/// <reference path="../std/std.ts" />

var akra;
(function (akra) {
    var pProgress = new akra.addons.Progress(document.getElementById("progress"));

    akra.pEngine = akra.createEngine({
        deps: { files: [{"path":"perfomance.map","type":"map"}], root: "./" },
        progress: pProgress.getListener(),
        renderer: {
            alpha: false
        }
    });
    var pScene = akra.pEngine.getScene();
    var pCanvas = akra.pEngine.getRenderer().getDefaultCanvas();
    var pCamera = null;
    var pViewport = null;

    function loadModel(sPath, fnCallback) {
        var pModelRoot = pScene.createNode();
        var pModel = akra.pEngine.getResourceManager().loadModel(sPath);

        pModelRoot.attachToParent(pScene.getRootNode());

        //pModel.setOptions({wireframe: true});
        pModel.attachToScene(pModelRoot);

        pScene.beforeUpdate.connect(function () {
            pModelRoot.addRelRotationByXYZAxis(0.00, 0.01, 0);
        });

        if (akra.isFunction(fnCallback)) {
            fnCallback(pModelRoot);
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

        loadModel(sPath, function (pCube) {
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
        });
    }

    function main(pEngine) {
        akra.std.setup(pCanvas);

        pCamera = akra.std.createCamera(pScene);
        pCamera.setPosition(akra.Vec3.temp(0., 7., 10.));
        pCamera.lookAt(akra.Vec3.temp(0, 0.8, -15));

        pViewport = new akra.render.DSViewport(pCamera);

        pCanvas.addViewport(pViewport);
        pCanvas.resize(window.innerWidth, window.innerHeight);

        window.onresize = function () {
            pCanvas.resize(window.innerWidth, window.innerHeight);
        };

        pViewport.setBackgroundColor(akra.color.DARK_BLUE);
        pViewport.setClearEveryFrame(true);

        akra.std.createKeymap(pViewport);

        var pLight = akra.std.createLighting(pScene, 2 /* OMNI */, akra.Vec3.temp(1, 5, 3));
        pLight.setShadowCaster(false);

        loadManyModels(400, "CUBE.DAE");
        pProgress.destroy();
        pEngine.exec();
    }

    akra.pEngine.ready(main);
})(akra || (akra = {}));
