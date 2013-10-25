


/*---------------------------------------------
 * assembled at: Fri Oct 25 2013 18:31:52 GMT+0400 (Московское время (зима))
 * directory: tests/common/game/DEBUG/
 * file: tests/common/game/lab3.ts
 * name: lab3
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
                        path: "effects/custom/arteries2.afx"
                    }, 
                    {
                        path: "textures/arteries/AG/arteries.ara"
                    }, 
                    
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
        akra.util.navigation(pViewport, new akra.Vec3(0., 1., 0.));
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
        /*m*/
        var fSliceStep = 0.00781102 * (100. / 125.);
        var pSlices = [];
        for(var i = 1, t = 0; i <= 41; ++i) {
            var n = "ar.";
            if (i < 10) {
                n += "0";
            }
            n += String(i);
            var pTex = pRmgr.texturePool.loadResource(n);
            pTex.setFilter(akra.ETextureParameters.MIN_FILTER, akra.ETextureFilters.LINEAR);
            pTex.setFilter(akra.ETextureParameters.MAG_FILTER, akra.ETextureFilters.LINEAR);
            pSlices.push(pTex);
        }
        var pArteriesModelObj = pRmgr.loadModel(akra.DATA + "models/arteries_hp.obj", {
            shadows: false,
            axis: {
                x: {
                    index: 0,
                    inverse: false
                },
                y: {
                    index: 2,
                    inverse: false
                },
                z: {
                    index: 1,
                    inverse: false
                }
            }
        });
        var pArteriesMeshObj = null;
        var pArteriesObj = null;
        var pArteriesSceneModelObj = null;
        function parsePoydaFileCurveFromGodunov(content) {
            var lines = content.split("\n");
            var format = lines[0].split(",");
            if (format[0] !== "Mx" || format[1] !== "My" || format[2] !== "Mz") {
                alert("wrong coords format: " + lines[0]);
                return;
            }
            var vDelta = akra.Vec3.stackCeil.set(1.0588, -1.7443, -1.8989);
            // vDelta.set(0);
            /*note: last line is empty!!*/
            var fTopZcoord = parseFloat(lines[lines.length - 2].split(',')[2]);
            var pCoords = [];
            for(var i = 1; i < lines.length; ++i) {
                if (lines[i].length < 3) {
                    continue;
                }
                var coords = lines[i].split(",");
                pCoords.push(new akra.Vec3(parseFloat(coords[0]), parseFloat(coords[1]), parseFloat(coords[2])));
                var v = pCoords[i - 1];
                var vn = akra.Vec3.stackCeil.set();
                vn.x = v.y;
                vn.y = v.z;
                vn.z = v.x;
                v.set(vn);
            }
            return pCoords;
        }
        function createSpline(pCoords, pParent, bDebug) {
            if (typeof pParent === "undefined") { pParent = null; }
            if (typeof bDebug === "undefined") { bDebug = false; }
            var pParam = akra.animation.createParameter();
            var pFrame;
            var m;
            var v;
            for(var i = 0; i < pCoords.length; ++i) {
                v = pCoords[i];
                if (pParent) {
                    v.set(pParent.worldMatrix.multiplyVec4(akra.Vec4.stackCeil.set(v, 1.)).xyz);
                }
                m = akra.Mat4.stackCeil.set(1.);
                m.setTranslation(v);
                pFrame = new akra.animation.PositionFrame(i / (pCoords.length - 1), m);
                pParam.keyFrame(pFrame);
                if (bDebug) {
                    console.log(i / (pCoords.length - 1), v.toString());
                }
            }
            return pParam;
        }
        function visualizeCurve(pNode, pCoords, fScale) {
            if (typeof fScale === "undefined") { fScale = .1; }
            for(var i = 0; i < pCoords.length; ++i) {
                var v = pCoords[i];
                var pBasis = akra.util.basis(pScene);
                // pBasis.attachToParent(pArteriesSceneModelHP);
                pBasis.attachToParent(pNode);
                pBasis.setInheritance(akra.ENodeInheritance.ALL);
                pBasis.scale(fScale);
                pBasis.setPosition(v);
            }
        }
        function parsePoydaFileCurveFromAG(content) {
            var lines = content.split("\n");
            var format = lines[0].split(",");
            if (format[0] !== "Mx" || format[1] !== "My" || format[2] !== "Mz") {
                alert("wrong coords format: " + lines[0]);
                return;
            }
            var vDelta = akra.Vec3.stackCeil.set(1.0588, -1.7443, -1.8989);
            // vDelta.set(0);
            /*note: last line is empty!!*/
            var fTopZcoord = parseFloat(lines[lines.length - 2].split(',')[2]);
            var pCoords = [];
            for(var i = 1; i < lines.length; ++i) {
                if (lines[i].length < 3) {
                    continue;
                }
                var coords = lines[i].split(",");
                pCoords.push(new akra.Vec3(parseFloat(coords[0]), parseFloat(coords[1]), parseFloat(coords[2])));
                var v = pCoords[i - 1];
                var vn = akra.Vec3.stackCeil.set();
                var fScale = (100. / 125.) * 0.01;
                vn.x = ((v.y + 31.25) * fScale - 1.);
                vn.z = ((v.x) * fScale - 1.);
                vn.y = v.z * fScale + 1.;
                // / fTopZcoord * pSlices.length * fSliceStep + 1.;
                v.set(vn);
            }
            return pCoords;
        }
        akra.fopen(akra.DATA + "/models/coord_real_ag.txt", "r").read(/** @inline */function (err, data) {
            var pCoords = parsePoydaFileCurveFromAG(data);
            visualizeCurve(pScene.getRootNode(), pCoords, 0.01);
        });
        var pRealArtery = pRmgr.loadModel(akra.DATA + "models/tof_multislab_tra_2.obj", {
            shadows: false,
            axis: {
                x: {
                    index: 0,
                    inverse: false
                },
                y: {
                    index: 2,
                    inverse: false
                },
                z: {
                    index: 1,
                    inverse: false
                }
            }
        });
        pArteriesModelObj.bind("loaded", /** @inline */function () {
            var pParent = pScene.createNode();
            pParent.attachToParent(pScene.getRootNode());
            pArteriesObj = pArteriesModelObj.attachToScene(pParent);
            pArteriesObj.setInheritance(akra.ENodeInheritance.ALL);
            pParent.scale(0.0525);
            // pParent.setRotationByXYZAxis(-math.PI / 2, -math.PI/2, -math.PI / 2);
            pParent.setPosition(0.0415, 1.099, -0.026);
            pParent.update();
            akra.fopen(akra.DATA + "/models/coord4.txt", "r").read(/** @inline */function (err, data) {
                var pCoords = parsePoydaFileCurveFromGodunov(data);
                var pParam = createSpline(pCoords, pParent, true);
                // visualizeCurve(pParent, pCoords);
                function calcSplineParameterValueByY(pSpline, y) {
                    if (((pSpline.frame(0)).translation.y > y) || ((pSpline.frame(1.)).translation.y < y)) {
                        return 0.;
                    }
                    if ((akra.math.abs((pSpline.frame(0)).translation.y - y) < 0.01)) {
                        return 0;
                    }
                    if ((akra.math.abs((pSpline.frame(1)).translation.y - y) < 0.01)) {
                        return 1;
                    }
                    var p = 0;
                    var q = 1.;
                    while(p < q) {
                        var s = (p + q) / 2.;
                        if ((akra.math.abs((pSpline.frame(s)).translation.y - y) < 0.01)) {
                            return s;
                        } else if (((pSpline.frame(s)).translation.y < y)) {
                            p = s + 0.01;
                        } else {
                            q = s;
                        }
                    }
                    return 0;
                }
                var pBasis = akra.util.basis(pScene);
                pBasis.attachToParent(pScene.getRootNode());
                pBasis.scale(0.25);
                pBasis.setPosition((pParam.frame(0.5)).translation);
                var pParameter = (pGUI.add({
                    "parameter": 0.
                }, "parameter")).min(1.0).max(1. + pSlices.length * fSliceStep).step(.01);
                pParameter.onChange(function (f) {
                    var t = calcSplineParameterValueByY(pParam, f);
                    console.log(t);
                    pBasis.setPosition((pParam.frame(t)).translation);
                });
                // pGUI.add({"transform to real": () => {
                // 	var pArteriesNode: ISceneModel = (<ISceneModel>pArteriesObj.child);
                // 	var pArteriesMesh: IMesh = pArteriesNode.mesh;
                // 	var pSubset: IMeshSubset = pArteriesMesh.getSubset(0);
                // 	var pPosVd: IVertexData = pSubset.data._getData("POSITION");
                // 	var pNormVd: IVertexData = pSubset.data._getData("NORMAL");
                // 	var pPosInd: Float32Array = <Float32Array>pSubset.data.getIndexFor("POSITION");
                // 	var pNormInd: Float32Array = <Float32Array>pSubset.data.getIndexFor("NORMAL");
                // 	var iStride: int = pPosVd.stride;
                // 	var iAddition: int = pPosVd.byteOffset;
                // 	var iTypeSize: int = EDataTypeSizes.BYTES_PER_FLOAT;
                // 	for (var i = 0; i < pPosInd.length; ++ i) {
                // 		pPosInd[i] = (pPosInd[i] * iTypeSize - iAddition) / iStride;
                // 	}
                // 	var iStride: int = pNormVd.stride;
                // 	var iAddition: int = pNormVd.byteOffset;
                // 	var iTypeSize: int = EDataTypeSizes.BYTES_PER_FLOAT;
                // 	for (var i = 0; i < pNormInd.length; ++ i) {
                // 		pNormInd[i] = (pNormInd[i] * iTypeSize - iAddition) / iStride;
                // 	}
                // 	var pPos: Float32Array = new Float32Array(pPosVd.getData());
                // 	var pNorm: Float32Array = new Float32Array(pNormVd.getData());
                // 	var pPosNew: Float32Array = new Float32Array(pPos.length);
                // 	var m4World: IMat4 = pArteriesNode.worldMatrix;
                // 	for (var i = 0; i < pPos.length; i += 4) {
                // 		var vPos: IVec3 = vec3(pPos[i], pPos[i + 1], pPos[i + 2]);
                // 		var vWorldPos: IVec3 = m4World.multiplyVec4(vec4(vPos, 1.)).xyz;
                // 		//параметр кривой от 0. до 1.;
                // 		//в силу равномерно распределения точек после алгоритма пойды,
                // 		//параметр меняется линейно вдоль кривой - это ВАЖНО
                // 		var pFrame: IPositionFrame = <IPositionFrame>pParam.frame();
                // 		var vSrcCenter: IVec3 =
                // 		// var vNorm: IVec3 = vec3(pNormAvg[i], pNormAvg[i + 1], pNormAvg[i + 2]);
                // 		// vNorm.normalize();
                // 		// vPos.add(vNorm.scale(fValue));
                // 		// pPosNew[i] = vPos.x;
                // 		// pPosNew[i + 1] = vPos.y;
                // 		// pPosNew[i + 2] = vPos.z;
                // 	}
                // 	pPosVd.setData(pPosNew, 0, 16);
                // }}, "transform to real");
                            });
            var gui = pGUI.addFolder('modeled carotid artery');
            var wireframe = gui.add({
                mode: "edged faces"
            }, "mode", [
                "colored", 
                "wireframe", 
                "edged faces"
            ]);
            var visible = gui.add({
                visible: true
            }, "visible");
            visible.onChange(function (bValue) {
                (pArteriesObj.child).mesh.getSubset(0).setVisible(bValue);
                ;
            });
            wireframe.onChange(function (sMode) {
                switch(sMode) {
                    case "colored":
                        (pArteriesObj.child).mesh.getSubset(0).wireframe(false);
                        break;
                    case "wireframe":
                        (pArteriesObj.child).mesh.getSubset(0).wireframe(true, false);
                        break;
                    case "edged faces":
                        (pArteriesObj.child).mesh.getSubset(0).wireframe(true);
                        break;
                }
            });
            window["arteries_obj"] = pParent;
        });
        var pArteriesModelHP = null;
        var pArteriesMeshHP = null;
        var pArteriesHP = null;
        var pArteriesSceneModelHP = null;
        pRealArtery.bind("loaded", /** @inline */function () {
            var pRealArteryObj = pRealArtery.attachToScene(pScene);
            console.log("pRealArteryObj >> ", pRealArteryObj);
            //1m / 125mm
            pRealArteryObj.scale(1. / 125);
            pRealArteryObj.setPosition(-.75, 1., -1);
            var gui = pGUI.addFolder('real carotid artery');
            var wireframe = gui.add({
                mode: "edged faces"
            }, "mode", [
                "colored", 
                "wireframe", 
                "edged faces"
            ]);
            var visible = gui.add({
                visible: true
            }, "visible");
            visible.onChange(function (bValue) {
                (pRealArteryObj.child).mesh.getSubset(0).setVisible(bValue);
                ;
            });
            wireframe.onChange(function (sMode) {
                switch(sMode) {
                    case "colored":
                        (pRealArteryObj.child).mesh.getSubset(0).wireframe(false);
                        break;
                    case "wireframe":
                        (pRealArteryObj.child).mesh.getSubset(0).wireframe(true, false);
                        break;
                    case "edged faces":
                        (pRealArteryObj.child).mesh.getSubset(0).wireframe(true);
                        break;
                }
            });
            // pParent.setRotationByXYZAxis(-math.PI / 2, -math.PI/2, -math.PI / 2);
            window["arteries_real"] = pRealArteryObj;
            pArteriesModelHP = pRmgr.loadModel(akra.DATA + "models/arteries_hp.DAE", {
                shadows: false
            });
            pArteriesModelHP.bind("loaded", loadTestArteryForShrinkCallback);
        });
        //AKRA
        //X - вправо
        //Y - вверх
        //Z - на нас
        //MATLAB
        //Z - вверх
        //X - вправо
        //Y - от нас
        function loadTestArteryForShrinkCallback() {
            pArteriesHP = pArteriesModelHP.attachToScene(pScene);
            pArteriesHP.setRotationByXYZAxis(0., akra.math.PI, 0.);
            // var pBasis: ISceneModel = util.basis(pScene);
            // pBasis.scale(.25);
            // pBasis.attachToParent((<ISceneModel>pArteriesHP.child));
            // console.log(pArteriesHP.findEntity("node-main_arteries_L01").toString(true));
            pArteriesSceneModelHP = (pArteriesHP.findEntity("node-main_arteries_L01").child);
            pArteriesMeshHP = pArteriesSceneModelHP.mesh;
            /////
            var pSubset = pArteriesMeshHP.getSubset(0);
            var pPosVd = pSubset.data._getData("POSITION");
            var pNormVd = pSubset.data._getData("NORMAL");
            var pPosInd = pSubset.data.getIndexFor("POSITION");
            var pNormInd = pSubset.data.getIndexFor("NORMAL");
            var iStride = pPosVd.stride;
            var iAddition = pPosVd.byteOffset;
            var iTypeSize = akra.EDataTypeSizes.BYTES_PER_FLOAT;
            for(var i = 0; i < pPosInd.length; ++i) {
                pPosInd[i] = (pPosInd[i] * iTypeSize - iAddition) / iStride;
            }
            var iStride = pNormVd.stride;
            var iAddition = pNormVd.byteOffset;
            var iTypeSize = akra.EDataTypeSizes.BYTES_PER_FLOAT;
            for(var i = 0; i < pNormInd.length; ++i) {
                pNormInd[i] = (pNormInd[i] * iTypeSize - iAddition) / iStride;
            }
            var pPos = new Float32Array(pPosVd.getData());
            var pNorm = new Float32Array(pNormVd.getData());
            var gui = pGUI.addFolder('shrink deformation');
            var shrink = (gui.add({
                shrink: 0.0
            }, 'shrink')).min(-1.0).max(1.0).step(.01);
            var visible = gui.add({
                visible: false
            }, 'visible');
            pArteriesMeshHP.getSubset(0).setVisible(false);
            visible.onChange(function (bValue) {
                pArteriesMeshHP.getSubset(0).setVisible(bValue);
                ;
            });
            var pNormAvg = new Float32Array(pPos.length);
            var pNormCount = new Float32Array(pPos.length / 4);
            // for (var i: int = 0; i < pPosInd.length; ++ i) {
            // 	if (pPosInd[i] < 100) {
            // 		console.log(pPosInd[i], "<<<<");
            // 	}
            // }
            for(var i = 0; i < pPosInd.length; i++) {
                var n = pNormInd[i] * 4;
                var v = pPosInd[i] * 4;
                // var vPos: IVec3 = vec3(pPos[v], pPos[v + 1], pPos[v + 2]);
                var vNorm = akra.Vec3.stackCeil.set(pNorm[n], pNorm[n + 1], pNorm[n + 2]);
                var vNormAvg = akra.Vec3.stackCeil.set(pNormAvg[v], pNormAvg[v + 1], pNormAvg[v + 2]);
                // console.log(vNorm.toString(), "norm");
                vNormAvg.add(vNorm);
                pNormCount[v / 4]++;
                pNormAvg[v] = vNormAvg.x;
                pNormAvg[v + 1] = vNormAvg.y;
                pNormAvg[v + 2] = vNormAvg.z;
                // console.log(vNormAvg.toString(), "norm avg.")
                            }
            for(var i = 0; i < pNormCount.length; i++) {
                var n = i * 4;
                var c = pNormCount[i];
                if (!(pNormAvg[n] == 0 && pNormAvg[n + 1] == 0 && pNormAvg[n + 2] == 0)) {
                    pNormAvg[n] /= c;
                    pNormAvg[n + 1] /= c;
                    pNormAvg[n + 2] /= c;
                }
            }
            var pPosNew = new Float32Array(pPos.length);
            shrink.onChange(function (fValue) {
                for(var i = 0; i < pPos.length; i += 4) {
                    var vPos = akra.Vec3.stackCeil.set(pPos[i], pPos[i + 1], pPos[i + 2]);
                    var vNorm = akra.Vec3.stackCeil.set(pNormAvg[i], pNormAvg[i + 1], pNormAvg[i + 2]);
                    vNorm.normalize();
                    vPos.add(vNorm.scale(fValue));
                    pPosNew[i] = vPos.x;
                    pPosNew[i + 1] = vPos.y;
                    pPosNew[i + 2] = vPos.z;
                }
                /*var pPoints: IVec4[] = [];
                var nPointStep: float = 50;
                for (var i = 0; i < pPosInd.length; i += nPointStep) {
                
                var vA: IVec3 = vec3(0.);
                var fN: float = math.min(i + nPointStep, pPosInd.length);
                var nT: int = 0;
                
                for (var j = i; j < fN; ++ j) {
                var k: int = pPosInd[j];
                var v: float = k * 4;
                var vPos: IVec3 = vec3(pPosNew[v], pPosNew[v + 1], pPosNew[v + 2]);
                vA.add(vPos);
                nT ++;
                }
                
                vA.scale(1. / nT);
                
                var v4fWorldPos: IVec4 = pArteriesSceneModelHP.worldMatrix.multiplyVec4(vec4(vA, 1.), vec4());
                
                // var pBasis: ISceneModel = util.basis(pScene);
                // pBasis.attachToParent(pScene.getRootNode());
                // pBasis.scale(.02);
                // pBasis.setPosition(v4fWorldPos.xyz);
                pPoints.push(new Vec4(v4fWorldPos));
                }
                
                for (var i = 1; i < pPoints.length; ++ i) {
                if (pPoints[i].subtract(pPoints[i - 1], vec4()).length() > .075) {
                pPoints[i] = null;
                i ++;
                }
                }
                
                for (var i: int = 0; i < pPoints.length; ++ i) {
                if (isNull(pPoints[i])) continue;
                
                var pBasis: ISceneModel = util.basis(pScene);
                pBasis.attachToParent(pScene.getRootNode());
                pBasis.scale(.005);
                pBasis.setPosition(pPoints[i].xyz);
                
                console.log(pPoints[i].toString())
                }
                */
                // console.log(pPosNew);
                pPosVd.setData(pPosNew, 0, 16);
            });
            // pArteriesMeshHP.showBoundingBox();
            pArteriesMeshHP.getSubset(0).wireframe(true, false);
            pArteriesHP.scale(2.25);
            pArteriesHP.localScale.y *= 1.15;
            pArteriesHP.setPosition(-0.017, 1.1275, -0.20);
            (pArteriesHP.child).addRotationByXYZAxis(0., Math.PI / 2, 0.);
            // var pBasis: ISceneModel = util.basis(pScene);
            // pBasis.attachToParent(pArteriesHP);
            window["arteries_hp"] = pArteriesHP;
        }
        var pSprite = pScene.createSprite();
        var fSlice = 0.;
        var fKL = 0.;
        var iA = 0.;
        var iB = 1;
        var fSliceK = 0.;
        var fOpacity = 0.0;
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
            pSprite.setPosition(0., fValue * pSlices.length * fSliceStep + 1., 0.);
            // console.log(fValue * pSlices.length * fSliceStep + 1.)
            fSlice = fValue;
            fKL = fSlice * (pSlices.length - 1.);
            iA = akra.math.floor(fKL);
            iB = iA + 1;
            fSliceK = (fKL - iA) / (iB - iA);
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
        // pGUI.add({"save intersection": () => {
        // 	saveAs(util.dataURItoBlob(this.getCanvasElement().toDataURL("image/png")), "screen.png");
        // }}, "save intersection");
            }
    pEngine.bind("depsLoaded", main);
})(akra || (akra = {}));
