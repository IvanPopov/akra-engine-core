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
/// <reference path="../../../built/Lib/base3dObjects.addon.d.ts" />
/// <reference path="../../../built/Lib/progress.addon.d.ts" />
/// <reference path="../std/std.ts" />
/// <reference path="../idl/3d-party/dat.gui.d.ts" />

var akra;
(function (akra) {
    var pProgress = new akra.addons.Progress(document.getElementById("progress"));

    var pRenderOpts = {
        premultipliedAlpha: false,
        preserveDrawingBuffer: true
    };

    var pOptions = {
        renderer: pRenderOpts,
        progress: pProgress.getListener(),
        deps: { files: [{"path":"data.map","type":"map"}], root: "./" }
    };

    akra.pEngine = akra.createEngine(pOptions);

    akra.pScene = akra.pEngine.getScene();
    akra.pCanvas = akra.pEngine.getRenderer().getDefaultCanvas();
    akra.pCamera = null;
    akra.pViewport = null;
    akra.pRmgr = akra.pEngine.getResourceManager();
    akra.pSky = null;
    akra.pSunshaftData = null;
    akra.pLensflareData = null;
    akra.pBlurData = null;

    var pState = {
        animate: true,
        lightShafts: true,
        lensFlare: true
    };

    akra.animateTimeOfDay = function () {
        akra.pSky.setTime(new Date().getTime() % 24000 / 500 - 24);
        requestAnimationFrame(akra.animateTimeOfDay);
    };

    function createCamera() {
        var pCamera = akra.pScene.createCamera();

        pCamera.addPosition(akra.Vec3.temp(-2.9563467216312262, 3.900536759964575, -15.853719720993343));

        //pCamera.addRelRotationByXYZAxis(-0.2, 0., 0.);
        pCamera.setRotation(akra.Quat4.temp(-0.0002096413471319314, 0.999332356829426, -0.005808150890586638, -0.03607023740685555));
        pCamera.attachToParent(akra.pScene.getRootNode());

        pCamera.update();

        return pCamera;
    }

    function createKeymap(pCamera) {
        var pKeymap = akra.control.createKeymap();
        pKeymap.captureMouse(akra.pCanvas.getElement());
        pKeymap.captureKeyboard(document);

        akra.pScene.beforeUpdate.connect(function () {
            if (pKeymap.isMousePress()) {
                if (pKeymap.isMouseMoved()) {
                    var v2fMouseShift = pKeymap.getMouseShift();

                    pCamera.addRelRotationByXYZAxis(-(v2fMouseShift.y / akra.pViewport.getActualHeight() * 10.0), 0., 0.);
                    pCamera.addRotationByXYZAxis(0., -(v2fMouseShift.x / akra.pViewport.getActualWidth() * 10.0), 0.);

                    pKeymap.update();
                }
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

    function createViewport() {
        var pViewport = new akra.render.DSViewport(akra.pCamera);
        akra.pCanvas.addViewport(pViewport);
        akra.pCanvas.resize(window.innerWidth, window.innerHeight);

        window.onresize = function (event) {
            akra.pCanvas.resize(window.innerWidth, window.innerHeight);
        };

        // (<render.DSViewport>pViewport).setFXAA(false);
        var counter = 0;
        var pEffect = pViewport.getEffect();
        pEffect.addComponent("akra.system.sunshaft");
        pEffect.addComponent("akra.system.blur");
        pEffect.addComponent("akra.system.lensflare");

        akra.pSunshaftData = {
            SUNSHAFT_ANGLE: null,
            SUNSHAFT_SAMPLES: 70,
            SUNSHAFT_COLOR: new akra.math.Vec3(1., 0.96, 0.9),
            SUNSHAFT_INTENSITY: 0.25,
            SUNSHAFT_DECAY: 1.2,
            SUNSHAFT_SHARPNESS: 2
        };

        var pGUI = new dat.GUI();

        pGUI.add(pState, 'animate');
        pGUI.add(pState, 'lightShafts').name('light shafts').onChange(function (bEnabled) {
            if (bEnabled) {
                pEffect.addComponent("akra.system.sunshaft");
            } else {
                pEffect.delComponent("akra.system.sunshaft", akra.fx.ANY_SHIFT, akra.fx.ANY_PASS);
            }
        });

        pGUI.add(pState, 'lensFlare').name('lensFlare').onChange(function (bEnabled) {
            if (bEnabled) {
                pEffect.addComponent("akra.system.lensflare");
            } else {
                pEffect.delComponent("akra.system.lensflare", akra.fx.ANY_SHIFT, akra.fx.ANY_PASS);
            }
        });

        var pShaftsFolder = pGUI.addFolder("light-shafts");
        pShaftsFolder.add(akra.pSunshaftData, 'SUNSHAFT_SHARPNESS').min(0.0).max(30).step(0.1).name("sharpness");
        pShaftsFolder.add(akra.pSunshaftData, 'SUNSHAFT_INTENSITY').min(0.0).max(1.).step(0.1).name("intensity");
        pShaftsFolder.add(akra.pSunshaftData, 'SUNSHAFT_DECAY').min(0.0).max(10.).step(0.1).name("decay");
        pShaftsFolder.add(akra.pSunshaftData, 'SUNSHAFT_SAMPLES').min(20).max(120).step(1).name("samples");
        pShaftsFolder.addColor({ SUNSHAFT_COLOR: [1. * 255, 0.96 * 255, 0.9 * 255] }, 'SUNSHAFT_COLOR').onChange(function (c) {
            akra.pSunshaftData.SUNSHAFT_COLOR.set(c[0] / 255., c[1] / 255., c[2] / 255.);
        }).name("color");

        akra.pLensflareData = {
            LENSFLARE_COOKIES_TEXTURE: akra.pEngine.getResourceManager().createTexture("LENSFLARE_COOKIES_TEXTURE"),
            LENSFLARE_TEXTURE_LOCATIONS: {
                COOKIE1: new akra.math.Vec4(.0, .5, .5, .0),
                COOKIE2: new akra.math.Vec4(.5, .5, 1., .0),
                COOKIE3: new akra.math.Vec4(.0, .5625, 1., .5)
            },
            LENSFLARE_COOKIE_PARAMS: null,
            LENSFLARE_LIGHT_POSITION: null,
            LENSFLARE_LIGHT_ANGLE: null,
            LENSFLARE_DECAY: 16.,
            LENSFLARE_INTENSITY: 0.17,
            LENSFLARE_ABERRATION_SCALE: 0.07,
            LENSFLARE_ABERRATION_SAMPLES: 5,
            LENSFLARE_ABERRATION_FACTOR: 1.6
        };

        akra.pLensflareData.LENSFLARE_COOKIE_PARAMS = [
            { TEXTURE_LOCATION: akra.pLensflareData.LENSFLARE_TEXTURE_LOCATIONS.COOKIE2, PROPERTIES: new akra.math.Vec4(140., 140., 2.3, 0.2) },
            { TEXTURE_LOCATION: akra.pLensflareData.LENSFLARE_TEXTURE_LOCATIONS.COOKIE2, PROPERTIES: new akra.math.Vec4(180., 180., 1.9, 0.2) },
            { TEXTURE_LOCATION: akra.pLensflareData.LENSFLARE_TEXTURE_LOCATIONS.COOKIE2, PROPERTIES: new akra.math.Vec4(128., 128., 1.65, 0.3) },
            { TEXTURE_LOCATION: akra.pLensflareData.LENSFLARE_TEXTURE_LOCATIONS.COOKIE2, PROPERTIES: new akra.math.Vec4(64., 64., 1., 0.4) },
            { TEXTURE_LOCATION: akra.pLensflareData.LENSFLARE_TEXTURE_LOCATIONS.COOKIE3, PROPERTIES: new akra.math.Vec4(2048., 64., 1., 1.0) },
            //{ TEXTURE_LOCATION: pLensflareData.LENSFLARE_TEXTURE_LOCATIONS.COOKIE1, PROPERTIES: new math.Vec4(200., 200., 0.45, 0.5) },
            { TEXTURE_LOCATION: akra.pLensflareData.LENSFLARE_TEXTURE_LOCATIONS.COOKIE2, PROPERTIES: new akra.math.Vec4(100., 100., 0.5, 0.4) },
            { TEXTURE_LOCATION: akra.pLensflareData.LENSFLARE_TEXTURE_LOCATIONS.COOKIE2, PROPERTIES: new akra.math.Vec4(128., 128., 0.2, 0.3) },
            { TEXTURE_LOCATION: akra.pLensflareData.LENSFLARE_TEXTURE_LOCATIONS.COOKIE2, PROPERTIES: new akra.math.Vec4(200., 200., 0.05, 0.2) },
            { TEXTURE_LOCATION: akra.pLensflareData.LENSFLARE_TEXTURE_LOCATIONS.COOKIE2, PROPERTIES: new akra.math.Vec4(128., 128., -0.1, 0.3) },
            { TEXTURE_LOCATION: akra.pLensflareData.LENSFLARE_TEXTURE_LOCATIONS.COOKIE2, PROPERTIES: new akra.math.Vec4(100., 100., -0.3, 0.4) },
            //{ TEXTURE_LOCATION: pLensflareData.LENSFLARE_TEXTURE_LOCATIONS.COOKIE2, PROPERTIES: new math.Vec4(200., 200., -0.35, 0.3) },
            //{ TEXTURE_LOCATION: pLensflareData.LENSFLARE_TEXTURE_LOCATIONS.COOKIE2, PROPERTIES: new math.Vec4(128., 128., -0.45, 0.4) },
            { TEXTURE_LOCATION: akra.pLensflareData.LENSFLARE_TEXTURE_LOCATIONS.COOKIE2, PROPERTIES: new akra.math.Vec4(240., 240., -0.65, 0.2) },
            { TEXTURE_LOCATION: akra.pLensflareData.LENSFLARE_TEXTURE_LOCATIONS.COOKIE2, PROPERTIES: new akra.math.Vec4(128., 128., -0.85, 0.35) },
            { TEXTURE_LOCATION: akra.pLensflareData.LENSFLARE_TEXTURE_LOCATIONS.COOKIE2, PROPERTIES: new akra.math.Vec4(180., 180., -1.1, 0.2) },
            { TEXTURE_LOCATION: akra.pLensflareData.LENSFLARE_TEXTURE_LOCATIONS.COOKIE2, PROPERTIES: new akra.math.Vec4(100., 100., -1.7, 0.4) }
        ];

        akra.pBlurData = {
            BLUR_RADIUS: 0
        };

        var pBlurFolder = pGUI.addFolder("blur");
        pBlurFolder.add(akra.pBlurData, 'BLUR_RADIUS').min(0.).name("radius");

        console.log(akra.pLensflareData.LENSFLARE_COOKIES_TEXTURE.loadImage(akra.pEngine.getResourceManager().getImagePool().findResource("LENSFLARE_COOKIES_TEXTURE")));

        //var iCounter: int = 0;
        pViewport.render.connect(function (pViewport, pTechnique, iPass, pRenderable, pSceneObject) {
            var pDeferredTexture = pViewport.getColorTextures()[0];
            var pDepthTexture = pViewport.getDepthTexture();
            var pPass = pTechnique.getPass(iPass);

            var v3fLightDir = akra.math.Vec3.temp(akra.pSky.getSunDirection());
            var pLightInDeviceSpace = akra.math.Vec3.temp();
            akra.pCamera.projectPoint(akra.math.Vec3.temp(akra.pCamera.getWorldPosition()).add(v3fLightDir), pLightInDeviceSpace);
            akra.pSunshaftData.SUNSHAFT_ANGLE = akra.pCamera.getWorldMatrix().toQuat4().multiplyVec3(akra.math.Vec3.temp(0., 0., -1.)).dot(v3fLightDir);

            pLightInDeviceSpace.x = (pLightInDeviceSpace.x + 1) / 2;
            pLightInDeviceSpace.y = (pLightInDeviceSpace.y + 1) / 2;

            akra.pLensflareData.LENSFLARE_LIGHT_POSITION = pLightInDeviceSpace;
            akra.pLensflareData.LENSFLARE_LIGHT_ANGLE = akra.pSunshaftData.SUNSHAFT_ANGLE;

            pPass.setUniform('SUNSHAFT_ANGLE', akra.pSunshaftData.SUNSHAFT_ANGLE);
            pPass.setTexture('DEPTH_TEXTURE', pDepthTexture);
            pPass.setUniform('SUNSHAFT_SAMPLES', akra.pSunshaftData.SUNSHAFT_SAMPLES);
            pPass.setUniform('SUNSHAFT_DEPTH', 1.);
            pPass.setUniform('SUNSHAFT_COLOR', akra.pSunshaftData.SUNSHAFT_COLOR);
            pPass.setUniform('SUNSHAFT_INTENSITY', akra.pSunshaftData.SUNSHAFT_INTENSITY);
            pPass.setUniform('SUNSHAFT_DECAY', akra.pSunshaftData.SUNSHAFT_DECAY);
            pPass.setUniform('SUNSHAFT_SHARPNESS', akra.pSunshaftData.SUNSHAFT_SHARPNESS);
            pPass.setUniform('SUNSHAFT_POSITION', pLightInDeviceSpace.clone("xy"));

            pPass.setTexture('DEFERRED_TEXTURE', pDeferredTexture);
            pPass.setTexture('LENSFLARE_COOKIES_TEXTURE', akra.pLensflareData.LENSFLARE_COOKIES_TEXTURE);
            pPass.setUniform('LENSFLARE_COOKIE_PARAMS', akra.pLensflareData.LENSFLARE_COOKIE_PARAMS);
            pPass.setForeign('LENSFLARE_COOKIES_TOTAL', akra.pLensflareData.LENSFLARE_COOKIE_PARAMS.length);
            pPass.setUniform('LENSFLARE_LIGHT_POSITION', akra.pLensflareData.LENSFLARE_LIGHT_POSITION);
            pPass.setUniform('LENSFLARE_LIGHT_ANGLE', akra.pLensflareData.LENSFLARE_LIGHT_ANGLE);
            pPass.setUniform('LENSFLARE_INTENSITY', akra.pLensflareData.LENSFLARE_INTENSITY);
            pPass.setUniform('LENSFLARE_DECAY', akra.pLensflareData.LENSFLARE_DECAY);
            pPass.setUniform('LENSFLARE_SKYDOME_ID', akra.pSky.skyDome.getRenderID(0));
            pPass.setUniform('LENSFLARE_ABERRATION_SCALE', akra.pLensflareData.LENSFLARE_ABERRATION_SCALE);
            pPass.setUniform('LENSFLARE_ABERRATION_SAMPLES', akra.pLensflareData.LENSFLARE_ABERRATION_SAMPLES);
            pPass.setUniform('LENSFLARE_ABERRATION_FACTOR', akra.pLensflareData.LENSFLARE_ABERRATION_FACTOR);

            pPass.setUniform('BLUR_RADIUS', akra.pBlurData.BLUR_RADIUS);

            //if (iCounter++%240 === 0) {
            //console.log('sunshaft isVisible: ', pSunshaftData.SUNSHAFT_ANGLE, pCamera.getWorldMatrix().toQuat4().multiplyVec3(math.Vec3.temp(0., 0., -1.)).toString());
            //}
            pPass.setUniform("INPUT_TEXTURE_RATIO", akra.math.Vec2.temp(pViewport.getActualWidth() / pDepthTexture.getWidth(), pDepthTexture.getWidth() / pDepthTexture.getHeight()));
            pPass.setUniform("SCREEN_ASPECT_RATIO", akra.math.Vec2.temp(pViewport.getActualWidth() / pViewport.getActualHeight(), 1.));
        });
        return pViewport;
    }

    function createSky() {
        akra.pSky = new akra.model.Sky(akra.pEngine, 32, 32, 1000.0);
        akra.pSky.setTime(15.);

        akra.pSky.sun.setShadowCaster(false);

        var pSceneModel = akra.pSky.skyDome;
        pSceneModel.attachToParent(akra.pScene.getRootNode());
    }

    function loadModel(sPath, fnCallback, name, pRoot) {
        var pModelRoot = akra.pScene.createNode();
        var pModel = akra.pEngine.getResourceManager().loadModel(sPath);

        pModelRoot.setName(name || sPath.match(/[^\/]+$/)[0] || 'unnamed_model');
        pModelRoot.attachToParent(pRoot || akra.pScene.getRootNode());
        pModelRoot.setInheritance(3 /* ROTPOSITION */);

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
                pModelRoot.addRelRotationByXYZAxis(0, 0, 0);
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

    function createStatsDIV() {
        var pStatsDiv = document.createElement("div");

        document.body.appendChild(pStatsDiv);
        pStatsDiv.setAttribute("style", "position: fixed;" + "max-height: 40px;" + "max-width: 120px;" + "color: green;" + "margin: 5px;");

        return pStatsDiv;
    }

    function main(pEngine) {
        akra.std.setup(akra.pCanvas);

        akra.pCamera = createCamera();
        akra.pViewport = createViewport();

        var pStatsDiv = createStatsDIV();

        akra.pCanvas.postUpdate.connect(function (pCanvas) {
            pStatsDiv.innerHTML = pCanvas.getAverageFPS().toFixed(2) + " fps";
        });

        createKeymap(akra.pCamera);

        window.onresize = function () {
            akra.pCanvas.resize(window.innerWidth, window.innerHeight);
        };

        createSky();

        var pSceneQuad = akra.addons.createQuad(akra.pScene, 100.);
        pSceneQuad.attachToParent(akra.pScene.getRootNode());

        //loadModel("WOOD_SOLDIER.DAE", null, 'WoodSoldier-01');
        //loadModel("ROCK.DAE", null, 'Rock-01').addPosition(-2, 1, -4).addRotationByXYZAxis(0, math.PI, 0);
        //loadModel("ROCK.DAE", null, 'Rock-02').addPosition(2, 1, -4);
        //loadModel("ROCK.DAE", null, 'Rock-03').addPosition(2, 5, -4);
        //loadModel("ROCK.DAE", null, 'Rock-04', pCamera).scale(0.2).setPosition(0.4, -0.2, -2);
        var pTorus = loadModel("TORUSKNOT.DAE", null, 'Rock-04', akra.pScene.getRootNode());

        var x = 0;

        pTorus.scale(.1).addPosition(0., 3.5, 0.).addRelRotationByXYZAxis(akra.math.HALF_PI, 0., 0.).getScene().preUpdate.connect(function () {
            if (!pState.animate) {
                return;
            }

            pTorus.addRelRotationByEulerAngles(.01, .0025, 0.);

            var t = pEngine.getTime();
            akra.pCamera.setPosition(6 * akra.math.sin(t), 4 + 1 * Math.cos(t * 1.2), -24);
            akra.pCamera.lookAt(akra.Vec3.temp(0, 1.5, 0));
        });

        pProgress.destroy();
        pEngine.exec();
        //animateTimeOfDay();
    }

    akra.pEngine.depsLoaded.connect(main);
})(akra || (akra = {}));
