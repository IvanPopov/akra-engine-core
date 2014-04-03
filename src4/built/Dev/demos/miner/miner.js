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
/// <reference path="../../../built/Lib/navigation.addon.d.ts" />
/// <reference path="../../../built/Lib/progress.addon.d.ts" />
/// <reference path="../std/std.ts" />
/// <reference path="../idl/3d-party/dat.gui.d.ts" />

var akra;
(function (akra) {
    var pProgress = new akra.addons.Progress(document.getElementById("progress"));

    var pRenderOpts = {
        premultipliedAlpha: false,
        //for screenshoting
        preserveDrawingBuffer: true
    };

    var pOptions = {
        renderer: pRenderOpts,
        progress: pProgress.getListener(),
        deps: { files: [{"path":"data.map","type":"map"}], root: "./", deps: akra.addons.getNavigationDependences() }
    };

    akra.pEngine = akra.createEngine(pOptions);

    akra.pCanvas = akra.pEngine.getRenderer().getDefaultCanvas();
    akra.pCamera = null;
    akra.pViewport = null;
    akra.pRmgr = akra.pEngine.getResourceManager();
    akra.pScene = akra.pEngine.getScene();

    function animateLight(pLight, pSprite) {
        var i = 1000;
        var bUp = false;
        var vAttenuation = new akra.Vec3(pLight.getParams().attenuation);

        setInterval(function () {
            if ((i == 10 && !bUp) || (i == 2000 && bUp)) {
                bUp = !bUp;
            }

            if (bUp) {
                i++;
            } else {
                i--;
            }

            pLight.getParams().attenuation.set(vAttenuation.x * (i / 1000), vAttenuation.y * (i / 1000), vAttenuation.z * (i / 1000));
        }, akra.math.random() * 20);
    }

    function main(pEngine) {
        akra.std.setup(akra.pCanvas);

        akra.pCamera = akra.pScene.createCamera();
        akra.pCamera.attachToParent(akra.pScene.getRootNode());
        akra.pCamera.setPosition(4., 4., 3.5);
        akra.pCamera.lookAt(akra.Vec3.temp(0., 1., 0.));

        akra.pViewport = new akra.render.DSViewport(akra.pCamera);

        akra.pCanvas.addViewport(akra.pViewport);

        //pCanvas.addViewport(new render.LPPViewport(pCamera, 0, 0, 0.5, 1., 1));
        akra.pCanvas.resize(window.innerWidth, window.innerHeight);

        akra.pViewport.enableSupportFor3DEvent(1 /* CLICK */ | 16 /* MOUSEOVER */ | 32 /* MOUSEOUT */);
        akra.pViewport.setClearEveryFrame(true);
        akra.pViewport.setBackgroundColor(akra.color.BLACK);

        window.onresize = function () {
            akra.pCanvas.resize(window.innerWidth, window.innerHeight);
        };

        akra.addons.navigation(akra.pViewport);

        var pGUI = new dat.GUI();

        for (var i = 0; i < 10; ++i) {
            var pLightOmni = akra.pScene.createLightPoint(2 /* OMNI */, i == 0, 512);
            pLightOmni.attachToParent(akra.pScene.getRootNode());
            pLightOmni.setPosition(akra.math.random() * -10 + 5., akra.math.random() * 5, akra.math.random() * -10 + 5);
            var pSprite = akra.pScene.createSprite();
            pSprite.scale(.25);
            pSprite.setTexture(akra.pRmgr.getTexturePool().loadResource("LIGHT_ICON"));
            pSprite.setBillboard(true);
            pSprite.setShadow(false);

            pSprite.attachToParent(pLightOmni);
            pLightOmni.lookAt(akra.Vec3.temp(0., 0., 0.));
            pLightOmni.setInheritance(4 /* ALL */);

            // pLightOmni.params.ambient.set(math.random(), math.random(), math.random(), 1);
            pLightOmni.getParams().diffuse.set(akra.math.random(), akra.math.random(), akra.math.random());
            pLightOmni.getParams().specular.set(akra.math.random(), akra.math.random(), akra.math.random());
            pLightOmni.getParams().attenuation.set(akra.math.random(), akra.math.random(), akra.math.random());

            (function (pSprite, pLightOmni) {
                pSprite.mouseover.connect(function () {
                    akra.pViewport.highlight(pSprite);
                });
                pSprite.mouseout.connect(function () {
                    akra.pViewport.highlight(null);
                });
                pSprite.click.connect(function () {
                    pLightOmni.setEnabled(!pLightOmni.isEnabled());
                    pSprite.getRenderable().getMaterial().emissive.set(pLightOmni.isEnabled() ? 0 : 1);
                    //debug.log(pLightOmni, pLightOmni.getName(), pLightOmni.isEnabled());
                });
            })(pSprite, pLightOmni);

            animateLight(pLightOmni, pSprite);
        }

        var pGrid = akra.pRmgr.createTexture("GRID");
        pGrid.loadImage(akra.pRmgr.getImagePool().findResource("GRID_JPG"));
        pGrid.setWrapMode(10242 /* WRAP_S */, 10497 /* REPEAT */);
        pGrid.setWrapMode(10243 /* WRAP_T */, 10497 /* REPEAT */);
        pGrid.setFilter(10240 /* MAG_FILTER */, 9729 /* LINEAR */);
        pGrid.setFilter(10241 /* MIN_FILTER */, 9729 /* LINEAR */);

        var pQuad = akra.addons.createQuad(akra.pScene, 50, akra.Vec2.temp(20.));
        pQuad.attachToParent(akra.pScene.getRootNode());
        pQuad.getMesh().getSubset(0).getSurfaceMaterial().setTexture(0 /* DIFFUSE */, pGrid);
        pQuad.getMesh().getSubset(0).getMaterial().diffuse = new akra.color.Color(0., 0., 0., 1.);

        pQuad = akra.addons.createQuad(akra.pScene, 10, akra.Vec2.temp(4.));
        pQuad.setRotationByXYZAxis(akra.math.PI / 2, 0, 0);
        pQuad.attachToParent(akra.pScene.getRootNode());
        pQuad.setPosition(0, 10., -10.);
        pQuad.getMesh().getSubset(0).getSurfaceMaterial().setTexture(0, pGrid);
        pQuad.getMesh().getSubset(0).getMaterial().diffuse = new akra.color.Color(0., 0., 0., 1.);

        pQuad = akra.addons.createQuad(akra.pScene, 10, akra.Vec2.temp(4.));
        pQuad.setRotationByXYZAxis(akra.math.PI / 2, akra.math.PI / 2, 0);
        pQuad.attachToParent(akra.pScene.getRootNode());
        pQuad.setPosition(-10, 10., 0.);
        pQuad.getMesh().getSubset(0).getSurfaceMaterial().setTexture(0, pGrid);
        pQuad.getMesh().getSubset(0).getMaterial().diffuse = new akra.color.Color(0., 0., 0., 1.);

        //if (config.DEBUG) {
        //	pCanvas.addViewport(new render.TextureViewport(pGrid, 0.1, 0.1, 0.2, 0.2, 5));
        //}
        pEngine.exec();

        var pController = pEngine.createAnimationController();
        var pMiner = akra.pRmgr.getColladaPool().findResource("MINER");

        function anim2controller(pController, sAnim) {
            var pAnimModel = akra.pRmgr.getColladaPool().findResource(sAnim);
            if (akra.isNull(pAnimModel)) {
                console.log("SKIP ANIMATION " + sAnim);
                return;
            }
            var pIdleAnim = pAnimModel.extractAnimation(0);
            var pCont = akra.animation.createContainer(pIdleAnim, sAnim);
            pCont.useLoop(true);
            pController.addAnimation(pCont);

            return pCont;
        }

        var pAnimWork1 = null;

        anim2controller(pController, "ANIM_MINER_IDLE0");
        anim2controller(pController, "ANIM_MINER_IDLE1");
        anim2controller(pController, "ANIM_MINER_IDLE2");
        anim2controller(pController, "ANIM_MINER_WALK1");
        anim2controller(pController, "ANIM_MINER_WALK2");
        anim2controller(pController, "ANIM_MINER_WALK3");
        pAnimWork1 = anim2controller(pController, "ANIM_MINER_WORK_GUN");
        pAnimWork1 = anim2controller(pController, "ANIM_MINER_WORK_HAMMER");

        pGUI.add({ animation: null }, 'animation', [
            'ANIM_MINER_IDLE0',
            'ANIM_MINER_IDLE1',
            'ANIM_MINER_IDLE2',
            'ANIM_MINER_WALK1',
            'ANIM_MINER_WALK2',
            'ANIM_MINER_WALK3',
            'ANIM_MINER_WORK_GUN',
            'ANIM_MINER_WORK_HAMMER'
        ]).onChange(function (sName) {
            pController.play.emit(sName);
        });

        pMiner.getOptions().wireframe = true;
        var pModel = pMiner.attachToScene(akra.pScene);
        pModel.addController(pController);
        pModel.scale(.5);

        pController.play.emit(0);

        pGUI.add({ wireframe: true }, 'wireframe').onChange(function (bValue) {
            pModel.explore(function (pEntity) {
                if (akra.scene.SceneModel.isModel(pEntity)) {
                    var pNode = pEntity;
                    for (var i = 0; i < pNode.getTotalRenderable(); ++i) {
                        pNode.getRenderable(i).wireframe(bValue);
                    }
                }

                return true;
            });
        });
        pProgress.destroy();
    }

    akra.pEngine.ready(main);
})(akra || (akra = {}));
