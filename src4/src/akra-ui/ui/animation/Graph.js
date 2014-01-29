/// <reference path="../../../../build/addons/filedrop.addon.d.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var akra;
(function (akra) {
    (function (ui) {
        /// <reference path="../../idl/IUIAnimationGraph.ts" />
        /// <reference path="../../idl/IUIAnimationNode.ts" />
        /// <reference path="../../idl/IUIAnimationBlender.ts" />
        /// <reference path="../../idl/IUIAnimationPlayer.ts" />
        /// <reference path="../graph/Graph.ts" />
        /// <reference path="Controls.ts" />
        /// <reference path="Blender.ts" />
        (function (animation) {
            var filedrop = akra.addons.filedrop;

            var DropSignal = (function (_super) {
                __extends(DropSignal, _super);
                function DropSignal() {
                    _super.apply(this, arguments);
                }
                DropSignal.prototype.emit = function (e, pComponent, pInfo) {
                    _super.prototype.emit.call(this, e, pComponent, akra.info);

                    var pGraph = this.getSender();

                    if (akra.ui.isComponent(pComponent, 18 /* COLLADA_ANIMATION */)) {
                        var pColladaAnimation = pComponent;
                        var pAnimation = pColladaAnimation.collada.extractAnimation(pColladaAnimation.index);

                        // this.addAnimation(pAnimation);
                        pGraph.createNodeByAnimation(pAnimation);
                    }
                };
                return DropSignal;
            })(akra.Signal);

            var Graph = (function (_super) {
                __extends(Graph, _super);
                function Graph(parent, options) {
                    _super.call(this, parent, options, 1 /* ANIMATION */);
                    this._pSelectedNode = null;
                    this._pAnimationController = null;

                    this.setupFileDropping();
                    this.setDroppable();
                }
                Graph.prototype.setupSignals = function () {
                    this.drop = this.drop || new DropSignal(this);
                    this.nodeSelected = this.nodeSelected || new akra.Signal(this);
                    _super.prototype.setupSignals.call(this);
                };

                Graph.prototype.setupFileDropping = function () {
                    var _this = this;
                    var pGraph = this;
                    var pRmgr = akra.ui.ide.getResourceManager();

                    filedrop.addHandler(null, {
                        drop: function (file, content, format, e) {
                            pGraph.getElement().removeClass("file-drag-over");

                            var pName = akra.path.parse(file.name);
                            var sExt = pName.getExt().toUpperCase();

                            if (sExt == "DAE") {
                                console.log("before resource creation...");
                                var pModelResource = pRmgr.getColladaPool().createResource(pName.toString());
                                console.log("before model parsing...");
                                pModelResource.parse(content, { scene: false, name: pName.toString() });

                                var pAnimations = pModelResource.extractAnimations();

                                for (var j = 0; j < pAnimations.length; ++j) {
                                    pGraph.addAnimation(pAnimations[j]);
                                    pGraph.createNodeByAnimation(pAnimations[j]);
                                }
                            }

                            if (sExt == "JSON") {
                                var pImporter = new akra.exchange.Importer(akra.ui.ide.getEngine());
                                pImporter.import(content);
                                _this.createNodeByController(pImporter.getController());
                            }
                        },
                        verify: function (file, e) {
                            if (e.target !== pGraph.$svg[0]) {
                                return false;
                            }

                            return true;
                        },
                        // dragenter: (e) => {
                        // 	pGraph.getElement().addClass("file-drag-over");
                        // },
                        dragover: function (e) {
                            pGraph.getElement().addClass("file-drag-over");
                        },
                        dragleave: function (e) {
                            pGraph.getElement().removeClass("file-drag-over");
                        },
                        format: 2 /* TEXT */
                    });
                };

                Graph.prototype.getController = function () {
                    return this._pAnimationController;
                };

                Graph.prototype.selectNode = function (pNode, bModified) {
                    if (typeof bModified === "undefined") { bModified = false; }
                    var bPlay = true;

                    if (this._pSelectedNode === pNode) {
                        if (bModified) {
                            akra.ui.ide.cmd(3 /* INSPECT_ANIMATION_NODE */, pNode);
                        }

                        return;
                    }

                    akra.ui.ide.cmd(3 /* INSPECT_ANIMATION_NODE */, pNode);

                    this._pSelectedNode = pNode;

                    if (bPlay) {
                        this._pAnimationController.play.emit(pNode.getAnimation());
                    }

                    this.nodeSelected.emit(pNode, bPlay);
                };

                //BROADCAST(nodeSelected, CALL(pNode, bPlay));
                Graph.prototype.addAnimation = function (pAnimation) {
                    this._pAnimationController.addAnimation(pAnimation);
                };

                Graph.prototype.removeAnimation = function (animation) {
                    this._pAnimationController.removeAnimation(animation);
                };

                Graph.prototype.findNodeByAnimation = function (animation) {
                    var sName = !akra.isString(animation) ? animation.getName() : animation;
                    var pNodes = this.getNodes();

                    for (var i = 0; i < pNodes.length; i++) {
                        var pAnim = pNodes[i].getAnimation();

                        if (!akra.isNull(pAnim) && pAnim.getName() === sName) {
                            return pNodes[i];
                        }
                    }

                    return null;
                };

                Graph.prototype.createNodeByController = function (pController) {
                    var pNode = null;

                    for (var i = 0; i < pController.getTotalAnimations(); ++i) {
                        var pAnimation = pController.getAnimation(i);
                        pNode = this.createNodeByAnimation(pAnimation);
                    }

                    return;
                };

                Graph.prototype.createNodeByAnimation = function (pAnimation) {
                    var pNode = this.findNodeByAnimation(pAnimation.getName());
                    var pSubAnim = null;
                    var pSubNode = null;
                    var pBlend = null;
                    var pBlender = null;
                    var pPlayer = null;
                    var pMaskNode = null;

                    var pMask = null;
                    var pGraph = this;

                    function connect(pGraph, pFrom, pTo) {
                        pGraph.createRouteFrom(pFrom.getOutputConnector());
                        pGraph.connectTo(pTo.getInputConnector());
                    }

                    if (!akra.isNull(pNode)) {
                        return pNode;
                    }

                    if (akra.animation.Animation.isAnimation(pAnimation)) {
                        pNode = new akra.ui.animation.Data(this, pAnimation);
                        this.addAnimation(pAnimation);
                    } else if (akra.animation.Blend.isBlend(pAnimation)) {
                        pBlender = pNode = new akra.ui.animation.Blender(this, pAnimation);
                        pBlend = pAnimation;

                        for (var i = 0; i < pBlend.getTotalAnimations(); i++) {
                            pSubAnim = pBlend.getAnimation(i);
                            pSubNode = this.createNodeByAnimation(pSubAnim);
                            pMask = pBlend.getAnimationMask(i);

                            if (akra.isDefAndNotNull(pMask)) {
                                pMaskNode = pBlender.getMaskNode(i);

                                if (!pMaskNode) {
                                    pMaskNode = new akra.ui.animation.Mask(this, pMask);
                                    // pMaskNode.animation = pSubAnim;
                                }

                                connect(this, pSubNode, pMaskNode);
                                connect(this, pMaskNode, pBlender);

                                // if (pSubAnim.extra && pSubAnim.extra.mask) {
                                //     if (pSubAnim.extra.mask.position) {
                                //         pMaskNode.position(pSubAnim.extra.mask.position.x, pSubAnim.extra.mask.position.y);
                                //     }
                                // }
                                pMaskNode.routing();
                            } else {
                                connect(this, pSubNode, pBlender);
                            }

                            pSubNode.routing();
                        }
                        ;

                        pBlender.setup();
                    } else if (akra.animation.Container.isContainer(pAnimation)) {
                        pPlayer = pNode = new akra.ui.animation.Player(this, pAnimation);

                        // pPlayer.animation = pAnimation;
                        pSubAnim = pAnimation.getAnimation();

                        // console.log(pSubAnim);
                        pSubNode = this.createNodeByAnimation(pSubAnim);

                        // console.log(this, pSubNode, pPlayer);
                        connect(this, pSubNode, pPlayer);
                    } else {
                        akra.logger.error("unsupported type of animation detected >> ", pAnimation);
                    }

                    if (pAnimation.extra) {
                        if (pAnimation.extra.graph) {
                            setTimeout(function () {
                                var o = pGraph.getElement().offset();
                                pNode.getElement().offset({ left: o.left + pAnimation.extra.graph.x, top: o.top + pAnimation.extra.graph.y });

                                if (pBlender) {
                                    var o = pBlender.getElement().offset();
                                    for (var i = 0; i < pBlender.getTotalMasks(); ++i) {
                                        var pMaskNode = pBlender.getMaskNode(i);

                                        if (!pMaskNode) {
                                            continue;
                                        }

                                        pMaskNode.getElement().offset({ left: o.left - 60 - pMaskNode.getElement().width() + i * 30, top: o.top - 30 + i * 30 });
                                        pMaskNode.routing();
                                    }
                                }

                                pNode.routing();
                            }, 15);
                        }
                    }

                    pNode.routing();

                    if (pAnimation === this.getController().getActive()) {
                        this.selectNode(pNode);
                    }

                    return pNode;
                };

                Graph.prototype.capture = function (pController) {
                    akra.logger.assert(akra.isNull(this._pAnimationController), ("controller exists!!!"));

                    this._pAnimationController = pController;

                    //this.connect(pController, SIGNAL(play), SLOT(onControllerPlay));
                    pController.play.connect(this, this.onControllerPlay);

                    //this.connect(pController, SIGNAL(animationAdded), SLOT(animationAdded));
                    pController.animationAdded.connect(this, this.animationAdded);

                    this.createNodeByController(pController);

                    return true;
                };

                Graph.prototype.animationAdded = function (pController, pAnimation) {
                };

                Graph.prototype.onControllerPlay = function (pController, pAnimation) {
                    // var pNode: IUIAnimationNode = this.findNodeByAnimation(pAnimation.name);
                    // this.selectNode(pNode);
                };

                Graph.prototype.addChild = function (pChild) {
                    pChild = _super.prototype.addChild.call(this, pChild);

                    if (akra.ui.isComponent(pChild, 20 /* GRAPH_NODE */)) {
                        var pNode = pChild;

                        //this.connect(pNode, SIGNAL(selected), SLOT(selectNode));
                        pNode.selected.connect(this, this.selectNode);
                    }

                    return pChild;
                };

                Graph.prototype.finalizeRender = function () {
                    _super.prototype.finalizeRender.call(this);
                    this.getElement().addClass("component-animationgraph");
                };

                Graph.DropSignal = DropSignal;
                return Graph;
            })(akra.ui.graph.Graph);
            animation.Graph = Graph;

            akra.ui.register("animation.Graph", Graph);
        })(ui.animation || (ui.animation = {}));
        var animation = ui.animation;
    })(akra.ui || (akra.ui = {}));
    var ui = akra.ui;
})(akra || (akra = {}));
//# sourceMappingURL=Graph.js.map
