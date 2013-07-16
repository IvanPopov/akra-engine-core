


/*---------------------------------------------
 * assembled at: Tue Jul 16 2013 16:53:56 GMT+0400 (Московское время (лето))
 * directory: tests/common/atmospheric_scattering/DEBUG/
 * file: tests/common/atmospheric_scattering/demo.ts
 * name: demo
 *--------------------------------------------*/


var akra;
(function (akra) {
    function createProgress() {
        var pProgress = new akra.util.Progress();
        var pCanvas = pProgress.canvas;
        pCanvas.style.position = "absolute";
        pCanvas.style.left = "50%";
        pCanvas.style.top = "50%";
        pCanvas.style.zIndex = "100";
        // pCanvas.style.display = "none";
        pCanvas.style.marginTop = (-pProgress.height / 2) + "px";
        pCanvas.style.marginLeft = (-pProgress.width / 2) + "px";
        return pProgress;
    }
    var pProgress = createProgress();
    var pOptions = {
        deps: {
            files: [
                {
                    path: "models/hero/movie.dae",
                    name: "HERO_MODEL"
                }, 
                
            ]
        },
        loader: {
            before: function (pManager, pInfo) {
                pProgress.total = pInfo;
                document.body.appendChild(pProgress.canvas);
            },
            onload: function (pManager, iDepth, nLoaded, nTotal) {
                pProgress.element = nLoaded;
                pProgress.depth = iDepth;
                pProgress.draw();
            },
            loaded: function (pManager) {
                setTimeout(/** @inline */function () {
                    document.body.removeChild(pProgress.canvas);
                }, 500);
            }
        }
    };
    akra.pEngine = akra.createEngine(pOptions);
    var pCamera = null;
    akra.pViewport = null;
    var pScene = akra.pEngine.getScene();
    var pCanvas = akra.pEngine.getRenderer().getDefaultCanvas();
    var pKeymap = akra.controls.createKeymap();
    var pUI = akra.pEngine.getSceneManager().createUI();
    var pRmgr = akra.pEngine.getResourceManager();
    var pEditDlg = pUI.createComponent("Popup", {
        name: "edit-atmospheric-scattering-dlg",
        title: "Edit atmospheric scattering",
        template: "custom.Sky.tpl"
    });
    function createDialog() {
        pEditDlg.render($(document.body));
        var iHeight = pEditDlg.el.height();
        pEditDlg.el.css({
            height: "auto",
            width: "350px",
            fontSize: "12px",
            top: 'auto',
            left: 'auto',
            bottom: -iHeight,
            right: "10"
        });
        pEditDlg.show();
        pEditDlg.el.animate({
            bottom: 0
        }, 350, "easeOutCirc");
    }
    function createModelEntry(sResource) {
        var pModel = pRmgr.colladaPool.findResource(sResource);
        var pModelRoot = pModel.attachToScene(pScene.getRootNode());
        return pModelRoot;
    }
    function setup() {
        var pCanvasElement = (pCanvas)._pCanvas;
        var pDiv = document.createElement("div");
        document.body.appendChild(pDiv);
        pDiv.appendChild(pCanvasElement);
        pDiv.style.position = "fixed";
        pKeymap.captureMouse((pCanvas).el);
        pKeymap.captureKeyboard(document);
    }
    function createCameras() {
        pCamera = pScene.createCamera();
        pCamera.attachToParent(pScene.getRootNode());
        pCamera.setRotationByXYZAxis(0., Math.PI, 0.);
        pCamera.setPosition(akra.Vec3.stackCeil.set(0.0, 10.0, 0.0));
        // pCamera.farPlane = MAX_UINT16;
        // pCamera.lookAt(vec3(0.));
            }
    function createViewports() {
        akra.pViewport = pCanvas.addViewport(pCamera, akra.EViewportTypes.DSVIEWPORT);
        pCanvas.resize(window.innerWidth, window.innerHeight);
        window.onresize = function (event) {
            pCanvas.resize(window.innerWidth, window.innerHeight);
        };
    }
    function createLighting() {
        var pSunLight = pScene.createLightPoint(akra.ELightTypes.OMNI, true, 2048, "sun");
        pSunLight.attachToParent(pScene.getRootNode());
        pSunLight.enabled = true;
        pSunLight.params.ambient.set(.1, .1, .1, 1);
        pSunLight.params.diffuse.set(0.75);
        pSunLight.params.specular.set(1.);
        pSunLight.params.attenuation.set(1.25, 0, 0);
        pSunLight.addPosition(10, 10, 0);
    }
    var v3fOffset = new akra.Vec3();
    function updateKeyboardControls(fLateralSpeed, fRotationSpeed) {
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
        if (pKeymap.isKeyPress(akra.EKeyCodes.D)) {
            v3fOffset.x = fLateralSpeed;
            isCameraMoved = true;
        } else if (pKeymap.isKeyPress(akra.EKeyCodes.A)) {
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
        if (pKeymap.isKeyPress(akra.EKeyCodes.W)) {
            v3fOffset.z = -fLateralSpeed;
            isCameraMoved = true;
        } else if (pKeymap.isKeyPress(akra.EKeyCodes.S)) {
            v3fOffset.z = fLateralSpeed;
            isCameraMoved = true;
        }
        if (isCameraMoved) {
            pCamera.addRelPosition(v3fOffset);
        }
    }
    function updateCameras() {
        updateKeyboardControls(0.25, 0.05);
        //default camera.
        if (pKeymap.isMousePress() && pKeymap.isMouseMoved()) {
            var v2fD = pKeymap.getMouseShift();
            var fdX = v2fD.x, fdY = v2fD.y;
            fdX /= pCanvas.width / 10.0;
            fdY /= pCanvas.height / 10.0;
            pCamera.addRelRotationByEulerAngles(-fdX, -fdY, 0);
        }
    }
    function createSceneEnvironment(pRoot) {
        if (typeof pRoot === "undefined") { pRoot = pScene.getRootNode(); }
        var pSceneQuad = akra.util.createQuad(pScene, 600.);
        pSceneQuad.attachToParent(pRoot);
        // var pSceneSurface: ISceneModel = util.createSceneSurface(pScene, 100);
        // pSceneSurface.scale(10.);
        // pSceneSurface.addPosition(0, 0.01, 0);
        // pSceneSurface.attachToParent(pScene.getRootNode());
        // pSceneSurface.mesh.getSubset(0).setVisible(true);
            }
    // var T = 0.0;
    akra.pSky = null;
    function update() {
        updateCameras();
        pKeymap.update();
        // pSky.setTime(T);
        // T += 0.02;
        // console.log(T);
            }
    var pParams = [
        "_fKr", 
        "_fKm", 
        "_fESun", 
        "_fg", 
        "_fExposure", 
        "_fInnerRadius", 
        "_fRayleighScaleDepth", 
        "_fMieScaleDepth", 
        
    ];
    function main(pEngine) {
        setup();
        createDialog();
        createCameras();
        createViewports();
        // createModelEntry("HERO_MODEL");
        createSceneEnvironment(createModelEntry("HERO_MODEL"));
        createLighting();
        akra.pSky = new akra.model.Sky(pEngine, 32, 32, 1000.0);
        akra.pSky.setTime(0);
        var pSceneModel = akra.pSky.skyDome;
        pSceneModel.attachToParent(pScene.getRootNode());
        // pSceneModel.accessLocalBounds().set(MAX_UINT16, MAX_UINT16, MAX_UINT16);
        // pScene.recursiveUpdate();
        // console.log(pSceneModel.worldBounds.toString());
        pKeymap.bind("P", /** @inline */function () {
            pSceneModel.mesh.getSubset(0).wireframe(true);
        });
        pKeymap.bind("M", /** @inline */function () {
            pSceneModel.mesh.getSubset(0).wireframe(false);
        });
        function reloadParams() {
            for(var i = 0; i < pParams.length; ++i) {
                (function (sParam) {
                    // console.log(sParam, (<IUILabel>pEditDlg.findEntity(sParam)));
                    (pEditDlg.findEntity(sParam)).text = String(akra.pSky[sParam]);
                })(pParams[i]);
            }
        }
        reloadParams();
        for(var i = 0; i < pParams.length; ++i) {
            (function (sParam) {
                (pEditDlg.findEntity(sParam)).text = String(akra.pSky[sParam]);
                (pEditDlg.findEntity(sParam)).bind("changed", function (pLabel, sValue) {
                    console.log(sParam, parseFloat(sValue));
                    akra.pSky[sParam] = parseFloat(sValue);
                    akra.pSky.init();
                    reloadParams();
                });
            })(pParams[i]);
        }
        var _fLastTime = 0;
        (pEditDlg.findEntity("time")).bind("updated", function (pSlider, fValue) {
            console.log("time is: ", fValue);
            _fLastTime = fValue;
            akra.pSky.setTime(fValue);
        });
        (pEditDlg.findEntity("_v3fInvWavelength4")).setVec3(akra.pSky["_v3fInvWavelength4"]);
        (pEditDlg.findEntity("_v3fInvWavelength4")).bind("changed", function (pVec, v3fValue) {
            console.log("_v3fInvWavelength4: ", v3fValue.toString());
            akra.pSky["_v3fInvWavelength4"].set(v3fValue);
            akra.pSky.setTime(_fLastTime);
        });
        (pEditDlg.findEntity("nm")).value = (pEngine.getComposer()).kFixNormal * 1000;
        (pEditDlg.findEntity("nm")).bind("updated", function (pSlider, fValue) {
            console.log("fix normal kof.", fValue / 1000.);
            (pEngine.getComposer()).kFixNormal = fValue / 1000.;
        });
        (pEditDlg.findEntity("spec")).value = (pEngine.getComposer()).fSunSpecular * 1000;
        (pEditDlg.findEntity("spec")).bind("updated", function (pSlider, fValue) {
            console.log("fSunSpecular kof.", fValue / 1000.);
            (pEngine.getComposer()).fSunSpecular = fValue / 1000.;
        });
        (pEditDlg.findEntity("ambient")).value = (pEngine.getComposer()).fSunAmbient * 1000;
        (pEditDlg.findEntity("ambient")).bind("updated", function (pSlider, fValue) {
            console.log("fSunAmbient kof.", fValue / 1000.);
            (pEngine.getComposer()).fSunAmbient = fValue / 1000.;
        });
        //==
        (pEditDlg.findEntity("cHeightFalloff")).value = (pEngine.getComposer()).cHeightFalloff * 1000;
        (pEditDlg.findEntity("cHeightFalloff")).bind("updated", function (pSlider, fValue) {
            console.log("cHeightFalloff kof.", fValue / 1000.);
            (pEngine.getComposer()).cHeightFalloff = fValue / 1000.;
        });
        (pEditDlg.findEntity("cGlobalDensity")).value = (pEngine.getComposer()).cGlobalDensity * 1000;
        (pEditDlg.findEntity("cGlobalDensity")).bind("updated", function (pSlider, fValue) {
            console.log("cGlobalDensity kof.", fValue / 1000.);
            (pEngine.getComposer()).cGlobalDensity = fValue / 1000.;
        });
        //==
        (pEditDlg.findEntity("_nHorinLevel")).value = akra.pSky["_nHorinLevel"];
        (pEditDlg.findEntity("_nHorinLevel")).bind("updated", function (pSlider, fValue) {
            console.log("_nHorinLevel: ", akra.math.round(fValue));
            akra.pSky["_nHorinLevel"] = (akra.math.round(fValue));
            akra.pSky.setTime(_fLastTime);
        });
        pScene.bind("beforeUpdate", update);
        pEngine.exec();
    }
    akra.pEngine.bind("depsLoaded", main);
})(akra || (akra = {}));
