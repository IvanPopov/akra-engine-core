/// <reference path="Component.ts" />
/// <reference path="scene/Tree.ts" />
/// <reference path="Inspector.ts" />
/// <reference path="ViewportProperties.ts" />
/// <reference path="ListenerEditor.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var akra;
(function (akra) {
    /// <reference path="../idl/IUITabs.ts" />
    /// <reference path="../idl/IUIPopup.ts" />
    /// <reference path="../idl/IUICheckboxList.ts" />
    /// <reference path="../idl/IUIAnimationControls.ts" />
    /// <reference path="../idl/IUIIDE.ts" />
    (function (ui) {
        ui.ide = null;

        var Vec2 = akra.math.Vec2;
        var Vec3 = akra.math.Vec3;
        var Vec4 = akra.math.Vec4;

        (function (IAxis) {
            IAxis[IAxis["X"] = 0x01] = "X";
            IAxis[IAxis["Y"] = 0x04] = "Y";
            IAxis[IAxis["Z"] = 0x02] = "Z";
        })(ui.IAxis || (ui.IAxis = {}));
        var IAxis = ui.IAxis;

        function getFuncBody(f) {
            var s = f.toString();
            var sCode = s.slice(s.indexOf("{") + 1, s.lastIndexOf("}"));
            if (sCode.match(/^\s*$/)) {
                sCode = "";
            }
            return sCode;
        }

        function buildFuncByCodeWithSelfContext(sCode, self) {
            var f = new Function("self", sCode);
            var fnCallback = function () {
                return f(self);
            };
            fnCallback.toString = function () {
                return "function (self) {" + sCode + "}";
            };
            return fnCallback;
        }

        (function (EEditModes) {
            EEditModes[EEditModes["NONE"] = 0] = "NONE";
            EEditModes[EEditModes["PICK"] = 1] = "PICK";
            EEditModes[EEditModes["MOVE"] = 2] = "MOVE";
            EEditModes[EEditModes["ROTATE"] = 3] = "ROTATE";
            EEditModes[EEditModes["SCALE"] = 4] = "SCALE";
        })(ui.EEditModes || (ui.EEditModes = {}));
        var EEditModes = ui.EEditModes;

        var IDE = (function (_super) {
            __extends(IDE, _super);
            function IDE(parent, options) {
                var _this = this;
                _super.call(this, parent, options, 0 /* UNKNOWN */);
                this._fnMainScript = function () {
                };
                this._pEngine = null;
                this._pColladaDialog = null;
                //picking
                this._pSelectedObject = { object: null, renderable: null };
                //editing
                this._eEditMode = 0 /* NONE */;

                //common setup
                ui.ide = this;

                this._pEngine = akra.ui.getUI(parent).getManager().getEngine();
                akra.debug.assert(!akra.isNull(this._pEngine), "Engine required!");

                //this.connect(this.getCanvas(), SIGNAL(viewportAdded), SLOT(_viewportAdded));
                this.getCanvas().viewportAdded.connect(this, this._viewportAdded);

                this.template("IDE.tpl");

                //viewport setup
                var pViewportProperties = this._pPreview = this.findEntity("Preview");

                //setup Node properties
                var pInspector = this._pInspector = this.findEntity("Inspector");

                //setup Scene tree
                var pTree = this._pSceneTree = this.findEntity("SceneTree");
                pTree.fromScene(this.getScene());

                //setup 3d controls
                var p3DControls = this._p3DControls = this.findEntity("3d-controls");

                //this.connect(<IUICheckbox>p3DControls.findEntity("pick"), SIGNAL(changed), SLOT(_enablePickMode));
                //this.connect(<IUICheckbox>p3DControls.findEntity("translate"), SIGNAL(changed), SLOT(_enableTranslateMode));
                //this.connect(<IUICheckbox>p3DControls.findEntity("rotate"), SIGNAL(changed), SLOT(_enableRotateMode));
                //this.connect(<IUICheckbox>p3DControls.findEntity("scale-control"), SIGNAL(changed), SLOT(_enableScaleMode));
                p3DControls.findEntity("pick").changed.connect(this, this._enablePickMode);
                p3DControls.findEntity("translate").changed.connect(this, this._enableTranslateMode);
                p3DControls.findEntity("rotate").changed.connect(this, this._enableRotateMode);
                p3DControls.findEntity("scale-control").changed.connect(this, this._enableScaleMode);

                //connect node properties to scene tree
                //FIXME: Enter the interface IUIInspector and describe it signals.
                pInspector.nodeNameChanged.connect(this, this._updateSceneNodeName);

                var pTabs = this._pTabs = this.findEntity("WorkTabs");

                //create mode basis
                var pScene = this.getScene();

                // var pBasis: ISceneModel = util.basis(pScene);
                // pBasis.name = ".model-basis";
                // pBasis.visible = false;
                // pBasis.setInheritance(ENodeInheritance.ROTPOSITION);
                // this._pModelBasis = pBasis;
                var pBasisTranslation = this.getResourceManager().loadModel(akra.config.data + "/models/basis_translation.DAE", { shadows: false });

                pBasisTranslation.loaded.connect(function (pModel) {
                    var pModelRoot = pModel.attachToScene(pScene);

                    pModelRoot.attachToParent(pScene.getRootNode());

                    var pEl = pModelRoot.getChild();

                    /*while(!isNull(pEl)) {
                    var pMesh: IMesh = pEl.mesh;
                    
                    for (var i = 0; i < pMesh.length; ++ i) {
                    // console.log(pMesh.getSubset(i));
                    // pMesh.getSubset(i).bind(SIGNAL(beforeRender),
                    // 	(pRenderable: IRenderableObject, pViewport: IViewport, pTechnique: IRenderTechnique) => {
                    // 	pTechnique.getPass(0).setRenderState(ERenderStates.ZENABLE, ERenderStateValues.FALSE);
                    // });
                    }
                    
                    pEl = <ISceneModel>pEl.sibling;
                    }*/
                    _this._pModelBasisTrans = pModelRoot;

                    pModelRoot.setInheritance(akra.ENodeInheritance.ALL);
                    pModelRoot.hide(true);

                    var iAxis = 0;

                    //basis-model center in world coord system
                    var vCenter = new Vec3;

                    //point under cursor in screen space
                    var vB = new Vec2;

                    //drag start point in screen space
                    var vO = new Vec2;

                    //basis model world position before dragging
                    var vStart = new Vec3;

                    //axis modifiers info array
                    var am = [];

                    function createAxisModifier(pModelRoot, pViewport, iAx) {
                        if (!akra.isDef(am[iAx])) {
                            am[iAx] = {
                                dir: new Vec3,
                                axis: new Vec4,
                                axisOrigin: new Vec4,
                                a: new Vec2
                            };
                        }

                        var vDir = am[iAx].dir;
                        var vAxis = am[iAx].axis;
                        var vAxisOrigin = am[iAx].axisOrigin;
                        var vA = am[iAx].a;

                        switch (iAx) {
                            case 1 /* X */:
                                vAxisOrigin.set(0.1, 0., 0., 1.);
                                break;
                            case 2 /* Z */:
                                vAxisOrigin.set(0., 0., 0.1, 1.);
                                break;
                            case 4 /* Y */:
                                vAxisOrigin.set(0., 0.1, 0., 1.);
                                break;
                        }

                        iAxis |= iAx;

                        pModelRoot.getWorldMatrix().multiplyVec4(vAxisOrigin, vAxis);

                        pViewport.projectPoint(vAxis.clone('xyz'), vDir);

                        vDir.clone('xy').subtract(vCenter.clone('xy'), vA);
                    }

                    function applyAxisModifier(m) {
                        var vA = m.a;
                        var vAxisOrigin = m.axisOrigin;

                        //угол между направлением куда тянет пользователь и проекциец ветора вдоль которго тянуть на экран.
                        var cosAlpha = vA.dot(vB) / (vA.length() * vB.length());

                        var fX = (cosAlpha * vB.length()) / vA.length();

                        //длинна вектора на который надо сдвинуть объект в пространстве камеры.
                        var vAx = Vec2.temp(vA.x * fX, vA.y * fX);
                        var vC = vO.add(vAx, Vec2.temp(0.));

                        var vC3d = vAxisOrigin.clone('xyz').scale(fX);

                        return vC3d.add(vStart);
                    }

                    var pNodes = pModelRoot.children();

                    for (var i = 0; i < pNodes.length; ++i) {
                        pNodes[i].mouseover.connect(function (pModel, pViewport, pSubset) {
                            var c = pSubset.getRenderMethodDefault().getMaterial().emissive;
                            c.set(c.r / 2., c.g / 2., c.b / 2., c.a / 2.);
                        });

                        pNodes[i].mouseout.connect(function (pModel, pViewport, pSubset) {
                            var c = pSubset.getRenderMethodDefault().getMaterial().emissive;
                            c.set(c.r * 2., c.g * 2., c.b * 2., c.a * 2.);
                        });

                        pNodes[i].dragstart.connect(function (pModel, pViewport, pSubset, x, y) {
                            var c = pSubset.getRenderMethodDefault().getMaterial().emissive;

                            vO.set(x, y);
                            vStart.set(pModelRoot.getWorldPosition());
                            pViewport.projectPoint(pModelRoot.getWorldPosition(), vCenter);

                            //colors at basis model on Y and Z axis was swaped, FAIL :(
                            if (c.r > 0) {
                                createAxisModifier(pModelRoot, pViewport, 1 /* X */);
                            }

                            if (c.g > 0) {
                                createAxisModifier(pModelRoot, pViewport, 2 /* Z */);
                            }

                            if (c.b > 0) {
                                createAxisModifier(pModelRoot, pViewport, 4 /* Y */);
                            }
                        });

                        pNodes[i].dragstop.connect(function (pModel, pViewport, pSubset) {
                            iAxis = 0;
                        });

                        pNodes[i].dragging.connect(function (pModel, pViewport, pSubset, x, y) {
                            Vec2.temp(x, y).subtract(vO, vB);

                            var vPos = Vec3.temp(0.);

                            if (iAxis & 1 /* X */) {
                                vPos.add(applyAxisModifier(am[1 /* X */]));
                            }

                            if (iAxis & 4 /* Y */) {
                                vPos.add(applyAxisModifier(am[4 /* Y */]));
                            }

                            if (iAxis & 2 /* Z */) {
                                vPos.add(applyAxisModifier(am[2 /* Z */]));
                            }

                            vPos.scale(1. / (iAxis).toString(2).match(/1/gi).length);

                            pModelRoot.setPosition(vPos);
                            _this.getSelectedObject().setWorldPosition(vPos);
                        });
                    }
                });
            }
            IDE.prototype.getScript = function () {
                return this._fnMainScript;
            };

            IDE.prototype.setScript = function (fn) {
                this._fnMainScript = fn;
            };

            //-===============================
            IDE.prototype.getSelectedObject = function () {
                return this._pSelectedObject.object;
            };

            IDE.prototype.getSelectedRenderable = function () {
                return this._pSelectedObject.renderable;
            };

            IDE.prototype.getEditMode = function () {
                return this._eEditMode;
            };

            IDE.prototype.setupSignals = function () {
                this.created = this.created || new akra.Signal(this);
                _super.prototype.setupSignals.call(this);
            };

            IDE.prototype._enablePickMode = function (pCb, bValue) {
                this._eEditMode = bValue ? 1 /* PICK */ : 0 /* NONE */;
                this.updateEditting();
            };

            IDE.prototype._enableTranslateMode = function (pCb, bValue) {
                this._eEditMode = bValue ? 2 /* MOVE */ : 0 /* NONE */;
                this.updateEditting();
            };

            IDE.prototype._enableRotateMode = function (pCb, bValue) {
                this._eEditMode = bValue ? 3 /* ROTATE */ : 0 /* NONE */;
                this.updateEditting();
            };

            IDE.prototype._enableScaleMode = function (pCb, bValue) {
                this._eEditMode = bValue ? 4 /* SCALE */ : 0 /* NONE */;
                this.updateEditting();
            };

            IDE.prototype._sceneUpdate = function (pScene) {
            };

            IDE.prototype.setupApiEntry = function () {
                this._apiEntry = {
                    engine: this.getEngine(),
                    camera: this.getCamera(),
                    viewport: this.getViewport(),
                    canvas: this.getCanvas(),
                    scene: this.getScene(),
                    rsmgr: this.getResourceManager(),
                    renderer: this.getEngine().getRenderer()
                };
            };

            IDE.prototype.getEngine = function () {
                return this._pEngine;
            };
            IDE.prototype.getCanvas = function () {
                return this.getEngine().getRenderer().getDefaultCanvas();
            };
            IDE.prototype.getScene = function () {
                return this.getEngine().getScene();
            };
            IDE.prototype.getCanvasElement = function () {
                return this.getCanvas()._pCanvas;
            };
            IDE.prototype.getResourceManager = function () {
                return this.getEngine().getResourceManager();
            };
            IDE.prototype.getViewport = function () {
                return this._pPreview.getViewport();
            };
            IDE.prototype.getCamera = function () {
                return this.getViewport().getCamera();
            };
            IDE.prototype.getComposer = function () {
                return this.getEngine().getComposer();
            };

            IDE.prototype._updateSceneNodeName = function (pInspector, pNode) {
                this._pSceneTree.sync(pNode);
            };

            IDE.prototype._viewportAdded = function (pTarget, pViewport) {
                var _this = this;
                //this.disconnect(this.getCanvas(), SIGNAL(viewportAdded), SLOT(_viewportAdded));
                this.getCanvas().viewportAdded.disconnect(this, this._viewportAdded);

                pViewport.enableSupportFor3DEvent(akra.E3DEventTypes.CLICK | akra.E3DEventTypes.MOUSEOVER | akra.E3DEventTypes.MOUSEOUT | akra.E3DEventTypes.DRAGSTART | akra.E3DEventTypes.DRAGSTOP);

                this._pPreview.setViewport(pViewport);
                this.setupApiEntry();

                //this.connect(this.getScene(), SIGNAL(beforeUpdate), SLOT(_sceneUpdate));
                this.getScene().beforeUpdate.connect(this, this._sceneUpdate);
                this.created.emit();

                pViewport.click.connect(function (pViewport, x, y) {
                    if (_this.getEditMode() !== 0 /* NONE */) {
                        var pRes = pViewport.pick(x, y);

                        if (!_this._pModelBasisTrans.isAChild(pRes.object)) {
                            _this.selected(pRes.object, pRes.renderable);
                            _this.inspectNode(pRes.object);
                        }
                    }
                });
            };

            IDE.prototype.updateEditting = function (pObjectPrev, pRenderablePrev) {
                if (typeof pObjectPrev === "undefined") { pObjectPrev = null; }
                if (typeof pRenderablePrev === "undefined") { pRenderablePrev = null; }
                var pViewport = this.getViewport();
                var pObject = this.getSelectedObject();
                var pRenderable = this.getSelectedRenderable();

                if (akra.isNull(pViewport)) {
                    return;
                }

                if (!akra.isNull(pObjectPrev)) {
                    if (akra.scene.SceneModel.isModel(pObjectPrev)) {
                        pObjectPrev.getMesh().hideBoundingBox();
                    }
                }

                if (this.getEditMode() === 0 /* NONE */) {
                    pViewport.highlight(null, null);
                }

                if (this.getEditMode() !== 0 /* NONE */) {
                    pViewport.highlight(pObject, pRenderable);

                    if (akra.scene.SceneModel.isModel(pObject)) {
                        pObject.getMesh().hideBoundingBox();
                    }
                }

                if (this.getEditMode() === 2 /* MOVE */ && !akra.isNull(pObject)) {
                    if (akra.scene.SceneModel.isModel(pObject)) {
                        pObject.getMesh().showBoundingBox();
                    }

                    this._pModelBasisTrans.hide(false);
                    this._pModelBasisTrans.setPosition(pObject.getWorldPosition());
                } else {
                    this._pModelBasisTrans.hide();
                }
            };

            IDE.prototype.selected = function (pObj, pRenderable) {
                if (typeof pRenderable === "undefined") { pRenderable = null; }
                var pObjectPrev = this.getSelectedObject();
                var pRenderablePrev = this.getSelectedRenderable();

                var p = this._pSelectedObject;

                p.object = pObj;
                p.renderable = pRenderable;

                this.updateEditting(pObjectPrev, pRenderablePrev);
            };

            IDE.prototype.cmd = function (eCommand) {
                var argv = [];
                for (var _i = 0; _i < (arguments.length - 1); _i++) {
                    argv[_i] = arguments[_i + 1];
                }
                switch (eCommand) {
                    case 0 /* SET_PREVIEW_RESOLUTION */:
                        return this.setPreviewResolution(parseInt(argv[0]), parseInt(argv[1]));
                    case 1 /* SET_PREVIEW_FULLSCREEN */:
                        return this.setFullscreen();
                    case 2 /* INSPECT_SCENE_NODE */:
                        this.selected(argv[0]);
                        return this.inspectNode(argv[0]);

                    case 5 /* EDIT_ANIMATION_CONTROLLER */:
                        return this.editAnimationController(argv[0]);
                    case 3 /* INSPECT_ANIMATION_NODE */:
                        return this.inspectAnimationNode(argv[0]);
                    case 4 /* INSPECT_ANIMATION_CONTROLLER */:
                        return this.inspectAnimationController(argv[0]);
                    case 6 /* CHANGE_AA */:
                        return this.changeAntiAliasing(argv[0]);
                    case 9 /* LOAD_COLLADA */:
                        return this.loadColladaModel();
                    case 7 /* EDIT_EVENT */:
                        return this.editEvent(argv[0], argv[1]);
                    case 8 /* EDIT_MAIN_SCRIPT */:
                        return this.editMainScript();
                    case 10 /* CHANGE_CAMERA */:
                        return this.changeCamera(argv[0]);
                    case 11 /* SCREENSHOT */:
                        return this.saveScreenshot();
                }

                return false;
            };

            IDE.prototype.saveScreenshot = function () {
                saveAs(akra.conv.dutob(this.getCanvasElement().toDataURL("image/png")), "screen.png");
                return true;
            };

            IDE.prototype.changeCamera = function (pCamera) {
                this.getViewport().setCamera(pCamera);
                return true;
            };

            IDE.prototype.setPreviewResolution = function (iWidth, iHeight) {
                this.getCanvas().resize(iWidth, iHeight);
                return true;
            };

            IDE.prototype.setFullscreen = function () {
                this.getCanvas().setFullscreen(true);
                return true;
            };

            IDE.prototype.inspectNode = function (pNode) {
                if (akra.isNull(pNode)) {
                    return false;
                }

                this._pSceneTree.selectByGuid(pNode.guid);
                this._pInspector.inspectNode(pNode);
                return true;
            };

            IDE.prototype.inspectAnimationController = function (pController) {
                this._pInspector.inspectAnimationController(pController);
                return true;
            };

            IDE.prototype.editAnimationController = function (pController) {
                var sName = "controller-" + pController.guid;
                var iTab = this._pTabs.findTab(sName);

                if (iTab < 0) {
                    var pControls = this._pTabs.createComponent("animation.Controls", {
                        title: "Edit controller: " + pController.guid,
                        name: sName
                    });

                    pControls.graph.capture(pController);
                    iTab = this._pTabs.findTab(sName);
                }

                this._pTabs.select(iTab);

                return true;
            };

            IDE.prototype.inspectAnimationNode = function (pNode) {
                this._pInspector.inspectAnimationNode(pNode);
                return true;
            };

            IDE.prototype.changeAntiAliasing = function (bValue) {
                var pViewport = this.getViewport();
                if (pViewport.getType() === akra.EViewportTypes.DSVIEWPORT) {
                    this._pPreview.getViewport().setFXAA(bValue);
                }
                return true;
            };

            IDE.prototype.loadColladaModel = function () {
                var pDlg = this._pColladaDialog;

                if (akra.isNull(this._pColladaDialog)) {
                    pDlg = this._pColladaDialog = this.createComponent("Popup", {
                        name: "load-collada-dlg",
                        title: "Load collada",
                        controls: "close",
                        template: "custom.LoadColladaDlg.tpl"
                    });

                    pDlg.closed.connect(function () {
                        if (parseInt(pDlg.getElement().css("bottom")) == 0) {
                            pDlg.getElement().animate({ bottom: -pDlg.getElement().height() }, 350, "easeInCirc", function () {
                                pDlg.hide();
                            });
                        } else {
                            pDlg.hide();
                        }
                    });

                    var pLoadBtn = pDlg.findEntity("load");
                    var $input = pDlg.getElement().find("input[name=url]");
                    var pRmgr = this.getResourceManager();
                    var pScene = this.getScene();

                    pLoadBtn.click.connect(function () {
                        var pModel = pRmgr.loadModel($input.val());

                        if (pModel.isResourceLoaded()) {
                            var pModelRoot = pModel.attachToScene(pScene);
                        }

                        pModel.loaded.connect(function (pModel) {
                            var pModelRoot = pModel.attachToScene(pScene);
                        });

                        pDlg.close();
                    });
                }

                var iHeight = pDlg.getElement().height();

                pDlg.getElement().css('top', 'auto').css('left', 'auto').css({ bottom: -iHeight, right: 10 });
                pDlg.show();
                pDlg.getElement().animate({ bottom: 0 }, 350, "easeOutCirc");

                return true;
            };

            IDE.prototype.editMainScript = function () {
                var sName = "main-script";
                var pListenerEditor;
                var iTab = this._pTabs.findTab(sName);
                var sCode = getFuncBody(this._fnMainScript);
                var self = this._apiEntry;
                var pIDE = this;

                if (iTab < 0) {
                    pListenerEditor = this._pTabs.createComponent("ListenerEditor", {
                        title: "Project code",
                        name: sName
                    });

                    pListenerEditor.bindEvent.connect(function (pEditor, sCode) {
                        pIDE.setScript(buildFuncByCodeWithSelfContext(sCode, self));
                        (pIDE.getScript())();
                    });

                    iTab = pListenerEditor.index;
                } else {
                    pListenerEditor = this._pTabs.tab(iTab);
                }

                this._pTabs.select(iTab);

                pListenerEditor.editor.setValue(sCode);

                return true;
            };

            //предпологается, что мы редактируем любого листенера, и что, исполнитель команды сам укажет нам,
            //какой номер у листенера, созданного им.
            IDE.prototype.editEvent = function (pTarget, sEvent, iListener, eType) {
                if (typeof iListener === "undefined") { iListener = 0; }
                if (typeof eType === "undefined") { eType = akra.EEventTypes.BROADCAST; }
                var sName = "event-" + sEvent + pTarget.guid;
                var pListenerEditor;
                var iTab = this._pTabs.findTab(sName);

                var pSign = pTarget[sEvent];
                var pListeners = pSign.getListeners(akra.EEventTypes.BROADCAST);

                //editable listener
                var pListener = null;

                var sCode = "";
                var self = this._apiEntry;

                for (var i = 0; i < pListeners.length; ++i) {
                    if (akra.isNull(pListeners[i].reciever)) {
                        pListener = pListeners[i];
                        break;
                    }
                }

                if (akra.isNull(pListener.callback)) {
                    pSign.connect(function () {
                    });
                    return this.editEvent(pTarget, sEvent);
                }

                sCode = getFuncBody(pListener.callback);

                if (iTab < 0) {
                    pListenerEditor = this._pTabs.createComponent("ListenerEditor", {
                        title: "Ev.: " + sEvent + "(obj.: " + pTarget.guid + ")",
                        name: sName
                    });

                    pListenerEditor.bindEvent.connect(function (pEditor, sCode) {
                        pListener.callback = buildFuncByCodeWithSelfContext(sCode, self);
                    });

                    iTab = pListenerEditor.index;
                } else {
                    pListenerEditor = this._pTabs.tab(iTab);
                }

                this._pTabs.select(iTab);

                pListenerEditor.editor.setValue(sCode);

                return true;
            };
            return IDE;
        })(akra.ui.Component);
        ui.IDE = IDE;

        akra.ui.register("IDE", IDE);
    })(akra.ui || (akra.ui = {}));
    var ui = akra.ui;
})(akra || (akra = {}));
//# sourceMappingURL=IDE.js.map
