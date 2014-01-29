/// <reference path="../../../build/akra.d.ts" />
var akra;
(function (akra) {
    (function (addons) {
        var Vec3 = akra.math.Vec3;
        var Quat4 = akra.math.Quat4;

        function navigation(pGeneralViewport, pRotationPoint) {
            if (typeof pRotationPoint === "undefined") { pRotationPoint = null; }
            var pCanvas = pGeneralViewport.getTarget();
            var pEngine = pCanvas.getRenderer().getEngine();
            var pSceneMgr = pEngine.getSceneManager();
            var pScene = pSceneMgr.createScene3D(".3d-box");
            var pGeneralScene = pEngine.getScene();
            var pRmgr = pEngine.getResourceManager();

            //scene with cube backend
            var pModel = pRmgr.loadModel(akra.config.data + "/models/ocube/cube.DAE", { shadows: false });

            var pCamera = pScene.createCamera();
            pCamera.attachToParent(pScene.getRootNode());

            var pLight = pScene.createLightPoint(1 /* PROJECT */);
            pLight.attachToParent(pCamera);
            pLight.setInheritance(4 /* ALL */);

            var pParams = pLight.getParams();

            pParams.ambient.set(0.0, 0.0, 0.0, 1);
            pParams.diffuse.set(1.);
            pParams.specular.set(.1);
            pParams.attenuation.set(0.5, 0, 0);

            var pViewport = pGeneralViewport.getTarget().addViewport(new akra.render.DSViewport(pCamera, .7, .05, .25, .25, 100));

            //detection of center point
            var pPlaneXZ = new akra.geometry.Plane3d(Vec3.temp(1., 0., 0.), Vec3.temp(0.), Vec3.temp(0., 0., 1.));
            var pCameraDir = new akra.geometry.Ray3d;

            function detectCenterPoint(pGeneralViewport) {
                var vDest = Vec3.temp(0.);
                var fDistXY;
                var fUnprojDist;
                var pCamera = pGeneralViewport.getCamera();

                var ui = akra["ui"];

                if (akra.config.UI && ui.ide && ui.ide.getSelectedObject()) {
                    vDest.set(ui.ide.getSelectedObject().getWorldPosition());
                    return vDest;
                }

                if (pRotationPoint) {
                    vDest.set(pRotationPoint);
                    return vDest;
                }

                pGeneralViewport.unprojectPoint(pGeneralViewport.getActualWidth() / 2., pGeneralViewport.getActualHeight() / 2., vDest);

                fUnprojDist = vDest.subtract(pCamera.getWorldPosition(), Vec3.temp()).length();

                if (fUnprojDist >= pCamera.getFarPlane()) {
                    pCameraDir.point = pCamera.getWorldPosition();
                    pCameraDir.normal = pCamera.getLocalOrientation().multiplyVec3(Vec3.temp(0., 0., -1.0));

                    if (!pPlaneXZ.intersectRay3d(pCameraDir, vDest)) {
                        vDest.set(pCameraDir.normal.scale(10., Vec3.temp()).add(pCameraDir.point));
                    }
                }

                return vDest;
            }

            function detectSpeedRation(pGeneralViewport) {
                var pCamera = pGeneralViewport.getCamera();
                var fLength = detectCenterPoint(pGeneralViewport).subtract(pCamera.getWorldPosition()).length();
                var fSpeedRation = detectCenterPoint(pGeneralViewport).subtract(pCamera.getWorldPosition()).length() / 5.;
                return fSpeedRation;
            }

            //zoom backend
            pCanvas.mousewheel.connect(function (pCanvas, x, y, fDelta) {
                pGeneralViewport.getCamera().addRelPosition(0., 0., akra.math.sign(-fDelta) * detectSpeedRation(pGeneralViewport));
            });

            //movemenet backend!
            pGeneralViewport.enableSupportFor3DEvent(64 /* DRAGSTART */ | 128 /* DRAGSTOP */);

            var vWorldPosition = new Vec3;
            var pStartPos = { x: 0, y: 0 };
            var fDragSpeedRatio = 1.;

            pGeneralViewport.dragstart.connect(function (pViewport, eBtn, x, y) {
                if (eBtn !== 2 /* MIDDLE */) {
                    return;
                }

                pCanvas.setCursor("move");

                vWorldPosition.set(pViewport.getCamera().getWorldPosition());
                pStartPos.x = x;
                pStartPos.y = y;
                fDragSpeedRatio = detectSpeedRation(pGeneralViewport);
            });

            pGeneralViewport.dragstop.connect(function (pViewport, eBtn, x, y) {
                if (eBtn !== 2 /* MIDDLE */) {
                    return;
                }

                pCanvas.setCursor("auto");
            });

            pGeneralViewport.dragging.connect(function (pViewport, eBtn, x, y) {
                if (eBtn !== 2 /* MIDDLE */) {
                    return;
                }

                var pCamera = pViewport.getCamera();
                var vDiff = Vec3.temp(-(x - pStartPos.x), -(y - pStartPos.y), 0.).scale(0.05 * fDragSpeedRatio);

                pCamera.setPosition(vWorldPosition.add(pCamera.getLocalOrientation().multiplyVec3(vDiff), Vec3.temp()));
            });

            //cube alpha
            var eSrcBlend = 7 /* SRCALPHA */;
            var eDestBlend = 9 /* DESTALPHA */;

            pViewport.render.connect(function (pViewport, pTechnique, iPass, pRenderable, pSceneObject) {
                var pPass = pTechnique.getPass(iPass);

                if (pTechnique.isLastPass(iPass)) {
                    pPass.setRenderState(2 /* ZENABLE */, 2 /* FALSE */);
                    pPass.setRenderState(0 /* BLENDENABLE */, 1 /* TRUE */);

                    pPass.setRenderState(10 /* SRCBLEND */, eSrcBlend);
                    pPass.setRenderState(11 /* DESTBLEND */, eDestBlend);
                }
            });

            pViewport.enableSupportFor3DEvent(1 /* CLICK */ | 16 /* MOUSEOVER */ | 32 /* MOUSEOUT */ | 64 /* DRAGSTART */ | 128 /* DRAGSTOP */ | 512 /* MOUSEWHEEL */);

            //cube scene synchronization backend
            function syncCubeWithCamera(pGeneralViewport, pViewport, pCenterPoint) {
                var pSceneCam = pGeneralViewport.getCamera();

                // logger.assert (pSceneCam.parent === pSceneCam.root, "only general camera may be used.");
                pViewport.hide(pSceneCam.getParent() !== pSceneCam.getRoot());

                var pCubeCam = pViewport.getCamera();
                var vPos = pSceneCam.getWorldPosition().subtract(pCenterPoint, Vec3.temp()).normalize().scale(5.5);

                pCubeCam.setPosition(vPos);
                pCubeCam.lookAt(Vec3.temp(0.), pSceneCam.getLocalOrientation().multiplyVec3(Vec3.temp(0., 1., 0.)));
            }

            pModel.loaded.connect(function () {
                var pModelRoot = pModel.attachToScene(pScene);

                var pCubeModel = pModelRoot.getChild();
                var pMesh = pCubeModel.getMesh();

                var pStartPos = { x: 0, y: 0 };
                var pCenterPoint = new Vec3(0.);
                var bDragStarted = false;

                var vWorldPosition = new Vec3;
                var vLocalPosition = new Vec3;
                var qLocalOrientation = new Quat4;

                pGeneralViewport.viewportCameraChanged.connect(function () {
                    syncCubeWithCamera(pGeneralViewport, pViewport, pCenterPoint);
                });

                syncCubeWithCamera(pGeneralViewport, pViewport, pCenterPoint);

                pCubeModel.dragstart.connect(function (pObject, pViewport, pRenderable, x, y) {
                    var pCamera = pGeneralViewport.getCamera();

                    pStartPos.x = x;
                    pStartPos.y = y;

                    bDragStarted = true;
                    pViewport.highlight(pCubeModel, null);

                    pCanvas.hideCursor();

                    pCenterPoint.set(detectCenterPoint(pGeneralViewport));

                    vWorldPosition.set(pCamera.getWorldPosition());
                    vLocalPosition.set(pCamera.getLocalPosition());
                    qLocalOrientation.set(pCamera.getLocalOrientation());
                });

                pCubeModel.dragstop.connect(function (pObject, pViewport, pRenderable, x, y) {
                    bDragStarted = false;
                    pViewport.getTarget().hideCursor(false);

                    eSrcBlend = 7 /* SRCALPHA */;
                    eDestBlend = 9 /* DESTALPHA */;
                    pViewport.highlight(null, null);
                    pViewport.touch();
                });

                function orbitRotation2(pNode, vCenter, vFrom, fX, fY, bLookAt) {
                    if (typeof bLookAt === "undefined") { bLookAt = true; }
                    if (akra.isNull(vFrom)) {
                        vFrom = pNode.getWorldPosition();
                    }

                    var qOrient;

                    var vDistance = vFrom.subtract(vCenter, Vec3.temp());

                    qOrient = Quat4.fromYawPitchRoll(fY, 0., 0., Quat4.temp());

                    pNode.setPosition(qOrient.multiplyVec3(vDistance, Vec3.temp()).add(vCenter));
                    pNode.setRotation(qOrient.multiply(qLocalOrientation, Quat4.temp()));

                    qOrient = Quat4.fromAxisAngle(pNode.getLocalOrientation().multiplyVec3(Vec3.temp(1., 0., 0.)), -fX);

                    vDistance = pNode.getLocalPosition().subtract(vCenter, Vec3.temp());

                    pNode.setPosition(qOrient.multiplyVec3(vDistance, Vec3.temp()).add(vCenter));
                    pNode.setRotation(qOrient.multiply(pNode.getLocalOrientation(), Quat4.temp()));
                }

                pCubeModel.dragging.connect(function (pObject, pViewport, pRenderable, x, y) {
                    var pCamera = pGeneralViewport.getCamera();
                    var fdX = (x - pStartPos.x) / 100;
                    var fdY = (y - pStartPos.y) / 100;

                    orbitRotation2(pCamera, pCenterPoint, vWorldPosition, -fdY, -fdX);

                    syncCubeWithCamera(pGeneralViewport, pViewport, pCenterPoint);
                });

                /*	function softAlignTo(vDir: IVec3, vUp: IVec3): void {
                var pCamera: ICamera = pGeneralViewport.getCamera();
                var qDest: IQuat4 = Quat4.fromForwardUp(vDir, vUp, Quat4.temp());
                var qSrc: IQuat4 = Quat4.fromForwardUp(pCamera.getWorldPosition().normalize(),
                pCamera.getLocalOrientation().multiplyVec3(Vec3.temp(0., 1., 0.), Vec3.temp()), Quat4.temp());
                var fDelta: float = 0.0;
                
                var i = setInterval(() => {
                if (fDelta >= 1.) {
                clearInterval(i);
                return;
                }
                
                fDelta = 1.0;
                
                var q = qDest;
                //qSrc.smix(qDest, fDelta, Quat4.temp());
                
                var vDistance: IVec3 = pCamera.getWorldPosition().subtract(pCenterPoint, Vec3.temp());
                pCamera.localPosition = q.multiplyVec3(vDistance, Vec3.temp()).add(pCenterPoint);
                pCamera.lookAt(pCenterPoint, vUp);
                pCamera.update();
                
                fDelta += 0.05;
                
                syncCubeWithCamera(pGeneralViewport);
                }, 18);
                }*/
                function alignTo(vDir, vUp) {
                    pCenterPoint.set(detectCenterPoint(pGeneralViewport));

                    var pCamera = pGeneralViewport.getCamera();
                    var fDist = pCamera.getWorldPosition().length();

                    pCamera.setPosition(pCenterPoint.add(vDir.normalize().scale(fDist), Vec3.temp()));
                    pCamera.lookAt(pCenterPoint, vUp);
                    pCamera.update();

                    syncCubeWithCamera(pGeneralViewport, pViewport, pCenterPoint);
                }

                for (var i = 0; i < pMesh.getLength(); ++i) {
                    var pSubset = pMesh.getSubset(i);

                    // pSubset.wireframe(true);
                    pSubset.mouseover.connect(function (pRenderable, pViewport, pObject) {
                        pViewport.highlight(pCubeModel, bDragStarted ? null : pRenderable);
                        eSrcBlend = 4 /* ONE */;
                        eDestBlend = 8 /* INVSRCALPHA */;
                    });

                    pSubset.mouseout.connect(function (pRenderable, pViewport, pObject) {
                        if (bDragStarted) {
                            pViewport.highlight(pCubeModel, null);
                            eSrcBlend = 4 /* ONE */;
                            eDestBlend = 8 /* INVSRCALPHA */;
                        } else {
                            pViewport.highlight(null, null);
                            eSrcBlend = 7 /* SRCALPHA */;
                            eDestBlend = 9 /* DESTALPHA */;
                        }
                    });

                    pSubset.click.connect(function (pSubset) {
                        var pCamera = pGeneralViewport.getCamera();

                        switch (pSubset.getName()) {
                            case "submesh-0":
                                alignTo(Vec3.temp(0., -1., 0.), Vec3.temp(0., 0., 1.));
                                console.log("bottom");
                                break;
                            case "submesh-1":
                                alignTo(Vec3.temp(1., 0., 0.), Vec3.temp(0., 1., 0.));
                                console.log("right");
                                break;
                            case "submesh-2":
                                console.log("left");
                                alignTo(Vec3.temp(-1., 0., 0.), Vec3.temp(0., 1., 0.));
                                break;
                            case "submesh-3":
                                console.log("top");
                                alignTo(Vec3.temp(0., 1., 0.), Vec3.temp(0., 0., -1.));
                                break;
                            case "submesh-4":
                                console.log("front");
                                alignTo(Vec3.temp(0., 0., 1.), Vec3.temp(0., 1., 0.));
                                break;

                            case "submesh-5":
                                alignTo(Vec3.temp(0., 0., -1.), Vec3.temp(0., 1., 0.));
                                console.log("back");
                                break;
                        }

                        syncCubeWithCamera(pGeneralViewport, pViewport, pCenterPoint);
                    });
                }
            });
        }
        addons.navigation = navigation;
    })(akra.addons || (akra.addons = {}));
    var addons = akra.addons;
})(akra || (akra = {}));
//# sourceMappingURL=navigation.js.map
