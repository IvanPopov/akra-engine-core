


/*---------------------------------------------
 * assembled at: Wed Sep 25 2013 17:02:34 GMT+0400 (Московское время (зима))
 * directory: tests/common/game/DEBUG/
 * file: tests/common/game/lab.ts
 * name: lab
 *--------------------------------------------*/


var __extends = this.__extends || function (d, b) {
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var akra;
(function (akra) {
    (function (util) {
        function navigation(pGeneralViewport, pRotationPoint) {
            if (typeof pRotationPoint === "undefined") { pRotationPoint = null; }
            var pCanvas = pGeneralViewport.getTarget();
            var pEngine = pCanvas.getRenderer().getEngine();
            var pSceneMgr = pEngine.getSceneManager();
            var pScene = pSceneMgr.createScene3D(".3d-box");
            var pGeneralScene = pEngine.getScene();
            var pRmgr = pEngine.getResourceManager();
            //scene with cube backend
            var pModel = pRmgr.loadModel(akra.DATA + "/models/ocube/cube.DAE", {
                shadows: false
            });
            var pCamera = pScene.createCamera();
            pCamera.attachToParent(pScene.getRootNode());
            var pLight = pScene.createLightPoint(akra.ELightTypes.PROJECT);
            pLight.attachToParent(pCamera);
            pLight.setInheritance(akra.ENodeInheritance.ALL);
            pLight.params.ambient.set(0.0, 0.0, 0.0, 1);
            pLight.params.diffuse.set(1.);
            pLight.params.specular.set(.1);
            pLight.params.attenuation.set(0.5, 0, 0);
            var pViewport = pGeneralViewport.getTarget().addViewport(new akra.render.DSViewport(pCamera, .7, .05, .25, .25, 100));
            //detection of center point
            var pPlaneXZ = new akra.geometry.Plane3d(akra.Vec3.stackCeil.set(1., 0., 0.), akra.Vec3.stackCeil.set(0.), akra.Vec3.stackCeil.set(0., 0., 1.));
            var pCameraDir = new akra.geometry.Ray3d();
            function detectCenterPoint(pGeneralViewport) {
                var vDest = akra.Vec3.stackCeil.set(0.);
                var fDistXY;
                var fUnprojDist;
                var pCamera = pGeneralViewport.getCamera();
                if (akra.ide && akra.ide.selectedObject) {
                    vDest.set(akra.ide.selectedObject.worldPosition);
                    return vDest;
                }
                if (pRotationPoint) {
                    vDest.set(pRotationPoint);
                    return vDest;
                }
                pGeneralViewport.unprojectPoint(pGeneralViewport.actualWidth / 2., pGeneralViewport.actualHeight / 2., vDest);
                fUnprojDist = vDest.subtract(pCamera.worldPosition, akra.Vec3.stackCeil.set()).length();
                if (fUnprojDist >= pCamera.farPlane) {
                    pCameraDir.point = pCamera.worldPosition;
                    pCameraDir.normal = pCamera.localOrientation.multiplyVec3(akra.Vec3.stackCeil.set(0., 0., -1.0));
                    if (!pPlaneXZ.intersectRay3d(pCameraDir, vDest)) {
                        vDest.set(pCameraDir.normal.scale(10., akra.Vec3.stackCeil.set()).add(pCameraDir.point));
                    }
                }
                return vDest;
            }
            function detectSpeedRation(pGeneralViewport) {
                var pCamera = pGeneralViewport.getCamera();
                var fLength = detectCenterPoint(pGeneralViewport).subtract(pCamera.worldPosition).length();
                var fSpeedRation = detectCenterPoint(pGeneralViewport).subtract(pCamera.worldPosition).length() / 5.;
                return fSpeedRation;
            }
            //zoom backend
            pCanvas.onmousewheel = function (pCanvas, x, y, fDelta) {
                pGeneralViewport.getCamera().addRelPosition(0., 0., akra.math.sign(-fDelta) * detectSpeedRation(pGeneralViewport));
            };
            //movemenet backend!
            pGeneralViewport.enableSupportFor3DEvent(akra.E3DEventTypes.DRAGSTART | akra.E3DEventTypes.DRAGSTOP);
            var vWorldPosition = new akra.Vec3();
            var pStartPos = {
                x: 0,
                y: 0
            };
            var fDragSpeedRatio = 1.;
            pGeneralViewport.ondragstart = function (pViewport, eBtn, x, y) {
                if (eBtn !== akra.EMouseButton.MIDDLE) {
                    return;
                }
                pCanvas.setCursor("move");
                vWorldPosition.set(pViewport.getCamera().worldPosition);
                pStartPos.x = x;
                pStartPos.y = y;
                fDragSpeedRatio = detectSpeedRation(pGeneralViewport);
            };
            pGeneralViewport.ondragstop = function (pViewport, eBtn, x, y) {
                if (eBtn !== akra.EMouseButton.MIDDLE) {
                    return;
                }
                pCanvas.setCursor("auto");
            };
            pGeneralViewport.ondragging = function (pViewport, eBtn, x, y) {
                if (eBtn !== akra.EMouseButton.MIDDLE) {
                    return;
                }
                var pCamera = pViewport.getCamera();
                var vDiff = akra.Vec3.stackCeil.set(-(x - pStartPos.x), -(y - pStartPos.y), 0.).scale(0.05 * fDragSpeedRatio);
                pCamera.setPosition(vWorldPosition.add(pCamera.localOrientation.multiplyVec3(vDiff), akra.Vec3.stackCeil.set()));
            };
            //cube alpha
            var eSrcBlend = akra.ERenderStateValues.SRCALPHA;
            var eDestBlend = akra.ERenderStateValues.DESTALPHA;
            pViewport.bind("render", function (pViewport, pTechnique, iPass, pRenderable, pSceneObject) {
                var pPass = pTechnique.getPass(iPass);
                if (pTechnique.isLastPass(iPass)) {
                    pPass.setRenderState(akra.ERenderStates.ZENABLE, akra.ERenderStateValues.FALSE);
                    pPass.setRenderState(akra.ERenderStates.BLENDENABLE, akra.ERenderStateValues.TRUE);
                    pPass.setRenderState(akra.ERenderStates.SRCBLEND, eSrcBlend);
                    pPass.setRenderState(akra.ERenderStates.DESTBLEND, eDestBlend);
                }
            });
            pViewport.enableSupportFor3DEvent(akra.E3DEventTypes.CLICK | akra.E3DEventTypes.MOUSEOVER | akra.E3DEventTypes.MOUSEOUT | akra.E3DEventTypes.DRAGSTART | akra.E3DEventTypes.DRAGSTOP | akra.E3DEventTypes.MOUSEWHEEL);
            //cube scene synchronization backend
            function syncCubeWithCamera(pGeneralViewport, pViewport, pCenterPoint) {
                var pSceneCam = pGeneralViewport.getCamera();
                // ASSERT (pSceneCam.parent === pSceneCam.root, "only general camera may be used.");
                pViewport.hide(pSceneCam.parent !== pSceneCam.root);
                var pCubeCam = pViewport.getCamera();
                var vPos = pSceneCam.worldPosition.subtract(pCenterPoint, akra.Vec3.stackCeil.set()).normalize().scale(5.5);
                pCubeCam.setPosition(vPos);
                pCubeCam.lookAt(akra.Vec3.stackCeil.set(0.), pSceneCam.localOrientation.multiplyVec3(akra.Vec3.stackCeil.set(0., 1., 0.)));
            }
            pModel.bind("loaded", function () {
                var pModelRoot = pModel.attachToScene(pScene);
                var pCubeModel = pModelRoot.child;
                var pMesh = pCubeModel.mesh;
                var pStartPos = {
                    x: 0,
                    y: 0
                };
                var pCenterPoint = new akra.Vec3(0.);
                var bDragStarted = false;
                var vWorldPosition = new akra.Vec3();
                var vLocalPosition = new akra.Vec3();
                var qLocalOrientation = new akra.Quat4();
                pGeneralViewport.bind("viewportCameraChanged", /** @inline */function () {
                    syncCubeWithCamera(pGeneralViewport, pViewport, pCenterPoint);
                });
                syncCubeWithCamera(pGeneralViewport, pViewport, pCenterPoint);
                pCubeModel.ondragstart = function (pObject, pViewport, pRenderable, x, y) {
                    var pCamera = pGeneralViewport.getCamera();
                    pStartPos.x = x;
                    pStartPos.y = y;
                    bDragStarted = true;
                    pViewport.highlight(pCubeModel, null);
                    pCanvas.hideCursor();
                    pCenterPoint.set(detectCenterPoint(pGeneralViewport));
                    vWorldPosition.set(pCamera.worldPosition);
                    vLocalPosition.set(pCamera.localPosition);
                    qLocalOrientation.set(pCamera.localOrientation);
                };
                pCubeModel.ondragstop = function (pObject, pViewport, pRenderable, x, y) {
                    bDragStarted = false;
                    (pViewport.getTarget()).hideCursor(false);
                    eSrcBlend = akra.ERenderStateValues.SRCALPHA;
                    eDestBlend = akra.ERenderStateValues.DESTALPHA;
                    pViewport.highlight(null, null);
                    pViewport.touch();
                };
                function orbitRotation2(pNode, vCenter, vFrom, fX, fY, bLookAt) {
                    if (typeof bLookAt === "undefined") { bLookAt = true; }
                    if (akra.isNull(vFrom)) {
                        vFrom = pNode.worldPosition;
                    }
                    var qOrient;
                    var vDistance = vFrom.subtract(vCenter, akra.Vec3.stackCeil.set());
                    qOrient = akra.Quat4.fromYawPitchRoll(fY, 0., 0., akra.Quat4.stackCeil.set());
                    pNode.setPosition(qOrient.multiplyVec3(vDistance, akra.Vec3.stackCeil.set()).add(vCenter));
                    pNode.setRotation(qOrient.multiply(qLocalOrientation, akra.Quat4.stackCeil.set()));
                    qOrient = akra.Quat4.fromAxisAngle(pNode.localOrientation.multiplyVec3(akra.Vec3.stackCeil.set(1., 0., 0.)), -fX);
                    vDistance = pNode.localPosition.subtract(vCenter, akra.Vec3.stackCeil.set());
                    pNode.setPosition(qOrient.multiplyVec3(vDistance, akra.Vec3.stackCeil.set()).add(vCenter));
                    pNode.setRotation(qOrient.multiply(pNode.localOrientation, akra.Quat4.stackCeil.set()));
                }
                pCubeModel.ondragging = function (pObject, pViewport, pRenderable, x, y) {
                    var pCamera = pGeneralViewport.getCamera();
                    var fdX = (x - pStartPos.x) / 100;
                    var fdY = (y - pStartPos.y) / 100;
                    orbitRotation2(pCamera, pCenterPoint, vWorldPosition, -fdY, -fdX);
                    syncCubeWithCamera(pGeneralViewport, pViewport, pCenterPoint);
                };
                /*	function softAlignTo(vDir: IVec3, vUp: IVec3): void {
                var pCamera: ICamera = pGeneralViewport.getCamera();
                var qDest: IQuat4 = Quat4.fromForwardUp(vDir, vUp, quat4());
                var qSrc: IQuat4 = Quat4.fromForwardUp(pCamera.worldPosition.normalize(),
                pCamera.localOrientation.multiplyVec3(vec3(0., 1., 0.), vec3()), quat4());
                var fDelta: float = 0.0;
                
                var i = setInterval(() => {
                if (fDelta >= 1.) {
                clearInterval(i);
                return;
                }
                
                fDelta = 1.0;
                
                var q = qDest;
                //qSrc.smix(qDest, fDelta, quat4());
                
                var vDistance: IVec3 = pCamera.worldPosition.subtract(pCenterPoint, vec3());
                pCamera.localPosition = q.multiplyVec3(vDistance, vec3()).add(pCenterPoint);
                pCamera.lookAt(pCenterPoint, vUp);
                pCamera.update();
                
                fDelta += 0.05;
                
                syncCubeWithCamera(pGeneralViewport);
                }, 18);
                }*/
                function alignTo(vDir, vUp) {
                    pCenterPoint.set(detectCenterPoint(pGeneralViewport));
                    var pCamera = pGeneralViewport.getCamera();
                    var fDist = pCamera.worldPosition.length();
                    pCamera.setPosition(pCenterPoint.add(vDir.normalize().scale(fDist), akra.Vec3.stackCeil.set()));
                    pCamera.lookAt(pCenterPoint, vUp);
                    pCamera.update();
                    syncCubeWithCamera(pGeneralViewport, pViewport, pCenterPoint);
                }
                for(var i = 0; i < pMesh.length; ++i) {
                    var pSubset = pMesh.getSubset(i);
                    // pSubset.wireframe(true);
                    pSubset.onmouseover = function (pRenderable, pViewport, pObject) {
                        pViewport.highlight(pCubeModel, bDragStarted ? null : pRenderable);
                        eSrcBlend = akra.ERenderStateValues.ONE;
                        eDestBlend = akra.ERenderStateValues.INVSRCALPHA;
                    };
                    pSubset.onmouseout = function (pRenderable, pViewport, pObject) {
                        if (bDragStarted) {
                            pViewport.highlight(pCubeModel, null);
                            eSrcBlend = akra.ERenderStateValues.ONE;
                            eDestBlend = akra.ERenderStateValues.INVSRCALPHA;
                        } else {
                            pViewport.highlight(null, null);
                            eSrcBlend = akra.ERenderStateValues.SRCALPHA;
                            eDestBlend = akra.ERenderStateValues.DESTALPHA;
                        }
                    };
                    pSubset.onclick = function (pSubset) {
                        var pCamera = pGeneralViewport.getCamera();
                        switch(pSubset.name) {
                            case "submesh-0":
                                alignTo(akra.Vec3.stackCeil.set(0., -1., 0.), akra.Vec3.stackCeil.set(0., 0., 1.));
                                console.log("bottom");
                                break;
                            case "submesh-1":
                                alignTo(akra.Vec3.stackCeil.set(1., 0., 0.), akra.Vec3.stackCeil.set(0., 1., 0.));
                                console.log("right");
                                break;
                            case "submesh-2":
                                console.log("left");
                                alignTo(akra.Vec3.stackCeil.set(-1., 0., 0.), akra.Vec3.stackCeil.set(0., 1., 0.));
                                break;
                            case "submesh-3":
                                console.log("top");
                                alignTo(akra.Vec3.stackCeil.set(0., 1., 0.), akra.Vec3.stackCeil.set(0., 0., -1.));
                                break;
                            case "submesh-4":
                                console.log("front");
                                alignTo(akra.Vec3.stackCeil.set(0., 0., 1.), akra.Vec3.stackCeil.set(0., 1., 0.));
                                break;
                            case "submesh-5":
                                alignTo(akra.Vec3.stackCeil.set(0., 0., -1.), akra.Vec3.stackCeil.set(0., 1., 0.));
                                console.log("back");
                                break;
                        }
                        syncCubeWithCamera(pGeneralViewport, pViewport, pCenterPoint);
                    };
                }
            });
        }
        util.navigation = navigation;
    })(akra.util || (akra.util = {}));
    var util = akra.util;
})(akra || (akra = {}));
var akra;
(function (akra) {
    function setup(pCanvas, pUI) {
        if (typeof pUI === "undefined") { pUI = null; }
        var pIDE = null;
        if (!akra.isNull(pUI)) {
            pIDE = pUI.createComponent("IDE");
            pIDE.render($(document.body));
        } else {
            var pCanvasElement = (pCanvas)._pCanvas;
            var pDiv = document.createElement("div");
            document.body.appendChild(pDiv);
            pDiv.appendChild(pCanvasElement);
            pDiv.style.position = "fixed";
        }
        return pIDE;
    }
    function createProgress() {
        var pProgress = new akra.util.Progress();
        var pCanvas = pProgress.canvas;
        pProgress.color = "white";
        pProgress.fontColor = "white";
        pCanvas.style.position = "absolute";
        pCanvas.style.left = "50%";
        pCanvas.style.top = "70%";
        pCanvas.style.zIndex = "100000";
        // pCanvas.style.backgroundColor = "rgba(70, 94, 118, .8)";
        // pCanvas.style.display = "none";
        pCanvas.style.marginTop = (-pProgress.height / 2) + "px";
        pCanvas.style.marginLeft = (-pProgress.width / 2) + "px";
        document.body.appendChild(pProgress.canvas);
        pProgress.drawText("Initializing demo");
        return pProgress;
    }
    function createCameras(pScene) {
        var pCamera = pScene.createCamera();
        pCamera.attachToParent(pScene.getRootNode());
        pCamera.addRelRotationByEulerAngles(-akra.math.PI / 5., 0., 0.);
        pCamera.addRelPosition(-8.0, 5.0, 11.0);
        pCamera.update();
        return pCamera;
    }
    function createSceneEnvironment(pScene, bHideQuad, bHideSurface, fSize) {
        if (typeof bHideQuad === "undefined") { bHideQuad = false; }
        if (typeof bHideSurface === "undefined") { bHideSurface = false; }
        if (typeof fSize === "undefined") { fSize = 100; }
        var pSceneQuad = akra.util.createQuad(pScene, fSize * 5.);
        pSceneQuad.attachToParent(pScene.getRootNode());
        pSceneQuad.mesh.getSubset(0).setVisible(!bHideQuad);
        var pSceneSurface = akra.util.createSceneSurface(pScene, fSize);
        // pSceneSurface.scale(5.);
        pSceneSurface.addPosition(0, -0.01, 0);
        pSceneSurface.attachToParent(pScene.getRootNode());
        pSceneSurface.mesh.getSubset(0).setVisible(!bHideSurface);
        // var pCameraTerrainProj: ISceneModel = util.basis(pScene);
        // pCameraTerrainProj.attachToParent(pScene.getRootNode());
        // pCameraTerrainProj.scale(.25);
        // self.cameraTerrainProj = pCameraTerrainProj;
            }
    function createViewports(pViewport, pCanvas, pUI) {
        if (typeof pUI === "undefined") { pUI = null; }
        pCanvas.addViewport(pViewport);
        if (akra.isNull(pUI)) {
            pCanvas.resize(window.innerWidth, window.innerHeight);
            window.onresize = function (event) {
                pCanvas.resize(window.innerWidth, window.innerHeight);
            };
        }
        return pViewport;
    }
    function createModelEntry(pScene, sResource) {
        var pRmgr = pScene.getManager().getEngine().getResourceManager();
        var pModel = pRmgr.colladaPool.findResource(sResource);
        var pModelRoot = pModel.attachToScene(pScene);
        return pModelRoot;
    }
    var pProgress = createProgress();
    var pRenderOpts = {
        premultipliedAlpha: false,
        preserveDrawingBuffer: //for screenshoting
        true
    };
    //for black background & and avoiding composing with other html
    var pControllerData = null;
    var pLoader = {
        changed: function (pManager, pFile, pInfo) {
            var sText = "";
            switch(pFile.status) {
                case akra.EDependenceStatuses.LOADING:
                    sText += "Loading ";
                    break;
                case akra.EDependenceStatuses.UNPACKING:
                    sText += "Unpacking ";
                    break;
            }
            switch(pFile.status) {
                case akra.EDependenceStatuses.LOADING:
                case akra.EDependenceStatuses.UNPACKING:
                    sText += ("resource " + akra.path.info(akra.path.uri(pFile.path).path).basename);
                    if (!akra.isNull(pInfo)) {
                        sText += " (" + (pInfo.loaded / pInfo.total * 100).toFixed(2) + "%)";
                    }
                    pProgress.drawText(sText);
                    break;
                case akra.EDependenceStatuses.LOADED:
                    pProgress.total[pFile.deps.depth] = pFile.deps.total;
                    pProgress.element = pFile.deps.loaded;
                    pProgress.depth = pFile.deps.depth;
                    pProgress.draw();
                    break;
            }
        },
        loaded: function (pManager) {
            pProgress.cancel();
            document.body.removeChild(pProgress.canvas);
        }
    };
    var pOptions = {
        renderer: pRenderOpts,
        loader: pLoader,
        deps: {
            files: [
                {
                    path: "grammars/HLSL.gr"
                }
            ],
            deps: {
                files: [
                    {
                        path: "effects/custom/arteries.afx"
                    }, 
                    {
                        path: "textures/arteries/arteries.ara"
                    }
                ]
            }
        }
    };
    var pEngine = akra.createEngine(pOptions);
    var pUI = pEngine.getSceneManager().createUI();
    var pCanvas = pEngine.getRenderer().getDefaultCanvas();
    var pCamera = null;
    var pViewport = null;
    var pIDE = null;
    var pRmgr = pEngine.getResourceManager();
    var pScene = pEngine.getScene();
    function main(pEngine) {
        setup(pCanvas, pUI);
        pCamera = pScene.createCamera();
        pCamera.attachToParent(pScene.getRootNode());
        pCamera.setPosition(4., 4., 3.5);
        pCamera.lookAt(akra.Vec3.stackCeil.set(0., 1., 0.));
        window["camera"] = pCamera;
        pViewport = createViewports(new akra.render.DSViewport(pCamera), pCanvas, pUI);
        akra.util.navigation(pViewport);
        createSceneEnvironment(pScene, true, false, 2);
        pEngine.exec();
        var pLight = pScene.createLightPoint(akra.ELightTypes.PROJECT);
        pLight.attachToParent(pCamera);
        pLight.setInheritance(akra.ENodeInheritance.ALL);
        pLight.params.ambient.set(0.0, 0.0, 0.0, 1);
        pLight.params.diffuse.set(1.);
        pLight.params.specular.set(.1);
        pLight.params.attenuation.set(0.5, 0, 0);

        var pCube = akra.util.lineCube(pScene);
        pCube.attachToParent(pScene.getRootNode());
        pCube.setPosition(0., 1., 0.);
        var pGUI = new dat.GUI();
        // pGUI.add(pViewer, 'threshold', 0, 1.);
        // pGUI.add(pViewer, 'colored');
        // pGUI.add(pViewer, 'waveStripStep', 1, 25).step(1);
        // pGUI.add(pViewer, 'waveStripWidth', 1, 10).step(1);
        // pGUI.addColor(pViewer, 'waveColor');
        // pGUI.addColor(pViewer, 'waveStripColor');
        var pSlices = [];
        for(var i = 2, t = 0; i <= 92; ++i) {
            var n = "ar.";
            if (i < 10) {
                n += "0";
            }
            n += String(i);
            var pTex = pRmgr.texturePool.loadResource(n);
            pTex.setFilter(akra.ETextureParameters.MIN_FILTER, akra.ETextureFilters.LINEAR);
            pTex.setFilter(akra.ETextureParameters.MAG_FILTER, akra.ETextureFilters.LINEAR);
            pSlices.push(pTex);
            // console.log(n, t++);
                    }
        var pArteriesModel = pRmgr.loadModel(akra.DATA + "/models/artery_system.DAE", {
            shadows: false
        });
        pArteriesModel.bind("loaded", /** @inline */function () {
            var pArteries = pArteriesModel.attachToScene(pScene);
            pArteries.setRotationByXYZAxis(0., akra.math.PI, 0.);
            var pArteriesMesh = (pArteries.findEntity("node-_Artery_system")).mesh;
            // pArteriesMesh.showBoundingBox();
            // pArteriesMesh.getSubset(0).wireframe(true);
            (pArteriesMesh.getSubset(0).material.emissive).set(0., 0., 0., 0.);
            (pArteriesMesh.getSubset(0).material.ambient).set(0., 0., 0., 0.);
            (pArteriesMesh.getSubset(0).material.diffuse).set(0.5, 0., 0., 0.);
            pArteries.scale(2.25);
            pArteries.addPosition(0., 1., -0.3);
            pArteriesMesh.getSubset(0).getRenderMethodDefault().effect.addComponent("akra.custom.highlight_mri_slice");
            pArteriesMesh.getSubset(0).bind("beforeRender", /** @inline */function (pRenderable, pViewportCurrent, pMethod) {
                // console.log(pSprite.worldMatrix.multiplyVec4(vec4(0., 0., -1., 1.)).xyz);
                pMethod.setUniform("SPLICE_NORMAL", akra.Vec3.stackCeil.set(0., -1., 0.));
                pMethod.setUniform("SPLICE_D", pSprite.worldPosition.y);
            });
            window["arteries_mesh"] = pArteriesMesh;
            window["arteries"] = pArteries;
            var gui = pGUI.addFolder('arteries');
            var controller = gui.add({
                wireframe: false
            }, 'wireframe');
            controller.onChange(function (value) {
                pArteriesMesh.getSubset(0).wireframe(value);
            });
        });
        var pSprite = pScene.createSprite();
        var fSlice = 0.;
        var fKL = 0.;
        var iA = 0.;
        var iB = 1;
        var fSliceK = 0.;
        var fOpacity = 0.05;
        pSprite.attachToParent(pScene.getRootNode());
        pSprite.setRotationByXYZAxis(akra.math.PI / 2., 0., 0.);
        pSprite.setPosition(0., 1., 0.);
        pSprite.setTexture(pSlices[0]);
        window["billboard"] = pSprite;
        var gui = pGUI.addFolder('slice');
        var slice = (gui.add({
            slice: 0.
        }, 'slice')).min(0.).max(1.).step(.005);
        var opacity = (gui.add({
            opacity: fOpacity
        }, 'opacity')).min(0.0).max(1.).step(.01);
        opacity.onChange(function (fValue) {
            fOpacity = fValue;
        });
        slice.onChange(function (fValue) {
            // console.log(fValue, fValue * 0.55 + 1.);
            pSprite.setPosition(0., fValue * 0.55 + 1., 0.);
            fSlice = fValue;
            fKL = fSlice * (pSlices.length - 1.);
            iA = akra.math.floor(fKL);
            iB = iA + 1;
            fSliceK = (fKL - iA) / (iB - iA);
            // console.log("A:", iA, "B:", iB, "k:", fSliceK);
                    });
        pSprite.getRenderable().getRenderMethodDefault().effect.addComponent("akra.custom.arteries_slice");
        pSprite.getRenderable().bind("beforeRender", /** @inline */function (pRenderable, pViewport, pMethod) {
            pMethod.setTexture("SLICE_A", pSlices[iA]);
            pMethod.setTexture("SLICE_B", pSlices[iB] || null);
            pMethod.setUniform("SLICE_K", fSliceK);
            pMethod.setUniform("SLICE_OPACITY", fOpacity);
        });
        var pProjCam = pScene.createCamera();
        var fDelta = 0.01;
        pProjCam.setOrthoParams(2., 2., -fDelta, fDelta);
        pProjCam.attachToParent(pSprite);
        pProjCam.setInheritance(akra.ENodeInheritance.ALL);
        pProjCam.setPosition(0., 0., 0.);
        pProjCam.setRotationByXYZAxis(akra.math.PI, 0., 0.);
        window["projCam"] = pProjCam;
        var pTexTarget = pRmgr.createTexture("slice");
        var iRes = 2048;
        pTexTarget.create(iRes, iRes, 1, null, akra.ETextureFlags.RENDERTARGET, 0, 0, akra.ETextureTypes.TEXTURE_2D, akra.EPixelFormats.R8G8B8);
        pTexTarget.getBuffer().getRenderTarget().addViewport(new akra.render.DSViewport(pProjCam));
        pCanvas.addViewport(new akra.render.TextureViewport(pTexTarget, 0.05, 0.05, .5 * 512 / pViewport.actualWidth, .5 * 512 / pViewport.actualHeight, 5.));
    }
    pEngine.bind("depsLoaded", main);
})(akra || (akra = {}));
