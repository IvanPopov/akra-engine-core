/// <reference path="../idl/IRenderableObject.ts" />
/// <reference path="../idl/IRenderMethod.ts" />
/// <reference path="../idl/IMap.ts" />
var akra;
(function (akra) {
    /// <reference path="RenderTechnique.ts" />
    /// <reference path="../data/VertexElement.ts" />
    /// <reference path="../config/config.ts" />
    /// <reference path="../debug.ts" />
    /// <reference path="../events.ts" />
    /// <reference path="../guid.ts" />
    (function (render) {
        var VE = akra.data.VertexElement;
        var DEFAULT_RM = akra.config.defaultName;
        var DEFAULT_RT = akra.config.defaultName;

        var RenderableObject = (function () {
            function RenderableObject(eType) {
                if (typeof eType === "undefined") { eType = 0 /* UNKNOWN */; }
                this.guid = akra.guid();
                this._pRenderData = null;
                this._pTechnique = null;
                this._pTechniqueMap = {};
                this._bShadow = true;
                this._bVisible = true;
                this._bFrozen = false;
                this._bWireframeOverlay = false;
                this.setupSignals();

                this._eRenderableType = eType;
            }
            RenderableObject.prototype.setupSignals = function () {
                this.shadowed = this.shadowed || new akra.Signal(this);
                this.beforeRender = this.beforeRender || new akra.Signal(this);

                this.click = this.click || new akra.Signal(this);
                this.mousemove = this.mousemove || new akra.Signal(this);
                this.mousedown = this.mousedown || new akra.Signal(this);
                this.mouseup = this.mouseup || new akra.Signal(this);
                this.mouseover = this.mouseover || new akra.Signal(this);
                this.mouseout = this.mouseout || new akra.Signal(this);
                this.dragstart = this.dragstart || new akra.Signal(this);
                this.dragstop = this.dragstop || new akra.Signal(this);
                this.dragging = this.dragging || new akra.Signal(this);
            };

            RenderableObject.prototype.getType = function () {
                return this._eRenderableType;
            };

            RenderableObject.prototype.getEffect = function () {
                return this._pTechnique.getMethod().getEffect();
            };

            RenderableObject.prototype.getSurfaceMaterial = function () {
                return this._pTechnique.getMethod().getSurfaceMaterial();
            };

            RenderableObject.prototype.getMaterial = function () {
                return this.getSurfaceMaterial().getMaterial();
            };

            RenderableObject.prototype.getData = function () {
                return this._pRenderData;
            };

            RenderableObject.prototype.getRenderMethod = function () {
                return this._pTechnique.getMethod();
            };

            RenderableObject.prototype.setRenderMethod = function (pMethod) {
                this.switchRenderMethod(pMethod);
            };

            RenderableObject.prototype.getShadow = function () {
                return this._bShadow;
            };

            RenderableObject.prototype.setShadow = function (bShadow) {
                if (this._bShadow !== bShadow) {
                    this._bShadow = bShadow;
                    this.shadowed.emit(bShadow);
                }
            };

            RenderableObject.prototype._setRenderData = function (pData) {
                this._pRenderData = pData;
                return;
            };

            RenderableObject.prototype._setup = function (pRenderer, csDefaultMethod) {
                if (typeof csDefaultMethod === "undefined") { csDefaultMethod = null; }
                this._pRenderer = pRenderer;

                if (!this.addRenderMethod(csDefaultMethod) || this.switchRenderMethod(null) === false) {
                    akra.logger.critical("cannot add & switch render method to default");
                }
            };

            RenderableObject.prototype.getRenderer = function () {
                return this._pRenderer;
            };

            RenderableObject.prototype.destroy = function () {
                this._pRenderer = null;
                this._pTechnique = null;

                for (var i in this._pTechniqueMap) {
                    this._pTechniqueMap[i].destroy();
                }

                this._pTechniqueMap = null;
            };

            RenderableObject.prototype.addRenderMethod = function (csMethod, csName) {
                var pTechnique = new akra.render.RenderTechnique;
                var pRmgr = this.getRenderer().getEngine().getResourceManager();
                var pMethod = null;

                if (akra.isNull(csMethod)) {
                    csMethod = DEFAULT_RM;
                }

                if (akra.isString(csMethod) || arguments.length === 0) {
                    pMethod = pRmgr.createRenderMethod((csMethod) + this.guid);

                    if (!akra.isDefAndNotNull(pMethod)) {
                        akra.logger.critical("resource manager failed to create method...");
                        return false;
                    }

                    //adding empty, but NOT NULL effect & material
                    pMethod.setSurfaceMaterial(pRmgr.createSurfaceMaterial(csMethod + ".material." + this.guid));
                    pMethod.setEffect(pRmgr.createEffect(csMethod + ".effect." + this.guid));
                } else {
                    pMethod = arguments[0];
                }

                akra.debug.assert(pMethod.getManager().getEngine().getRenderer() === this._pRenderer, "Render method should belong to the same engine instance that the renderable object.");

                pTechnique.setMethod(pMethod);

                //pTechnique.name = csName || DEFAULT_RT;
                this._pTechniqueMap[csName || DEFAULT_RT] = pTechnique;

                return true;
            };

            RenderableObject.prototype.switchRenderMethod = function (csName) {
                var pTechnique;
                var sName = null;

                if (akra.isNull(arguments[0])) {
                    sName = DEFAULT_RT;
                } else if (akra.isString(arguments[0])) {
                    sName = csName;
                } else if (akra.isDefAndNotNull(arguments[0])) {
                    sName = arguments[0].findResourceName();

                    if (!akra.isDefAndNotNull(this._pTechniqueMap[sName])) {
                        if (!this.addRenderMethod(arguments[0], sName)) {
                            return false;
                        }
                    }
                }

                pTechnique = this._pTechniqueMap[sName];

                if (akra.isDefAndNotNull(pTechnique)) {
                    this._pTechnique = pTechnique;
                    return true;
                }

                return false;
            };

            RenderableObject.prototype.removeRenderMethod = function (csName) {
                var pTechnique = this._pTechniqueMap[csName];

                if (akra.isDefAndNotNull(pTechnique)) {
                    delete this._pTechniqueMap[csName || DEFAULT_RT];
                    return true;
                }

                return false;
            };

            RenderableObject.prototype.getRenderMethodByName = function (csName) {
                if (typeof csName === "undefined") { csName = null; }
                var pTechnique = this._pTechniqueMap[csName || DEFAULT_RT];
                return pTechnique ? pTechnique.getMethod() : null;
            };

            RenderableObject.prototype.getRenderMethodDefault = function () {
                return this.getRenderMethodByName(DEFAULT_RM);
            };

            RenderableObject.prototype.isReadyForRender = function () {
                return this._bVisible && this._pTechnique.isReady();
            };

            RenderableObject.prototype.isAllMethodsLoaded = function () {
                for (var i in this._pTechniqueMap) {
                    var pMethod = this._pTechniqueMap[i].getMethod();

                    if (!akra.isDefAndNotNull(pMethod) || !pMethod.isResourceLoaded()) {
                        return false;
                    }
                }

                return true;
            };

            RenderableObject.prototype.isFrozen = function () {
                return this._bFrozen;
            };

            RenderableObject.prototype.wireframe = function (bEnable, bOverlay) {
                if (typeof bEnable === "undefined") { bEnable = true; }
                if (typeof bOverlay === "undefined") { bOverlay = true; }
                var pDefaultRm = this.getRenderMethodDefault();

                if (!bEnable) {
                    if (pDefaultRm.getEffect().hasComponent("akra.system.wireframe")) {
                        pDefaultRm.getEffect().delComponent("akra.system.wireframe", 0, 0);
                    }
                    return;
                }

                if (this.getData().getDataLocation("BARYCENTRIC") == -1) {
                    var ePrimType = this.getData().getPrimitiveType();

                    if (ePrimType !== 4 /* TRIANGLELIST */) {
                        akra.logger.warn("wireframe supported only for TRIANGLELIST");
                        return false;
                    }

                    var iPosition = this.getData().getDataLocation('POSITION');
                    var pIndices = this.getData().getIndexFor("POSITION");

                    // var pIndices: Float32Array = <any>this.data._getFlow("POSITION").mapper.data.getTypedData(this.data._getFlow("POSITION").mapper.semantics);
                    var pBarycentric = new Float32Array(pIndices.length);

                    if (ePrimType == 4 /* TRIANGLELIST */) {
                        for (var n = 0; n < pIndices.length; ++n) {
                            pIndices[n] = n;
                            pBarycentric[n] = n % 3;
                        }
                    }

                    this.getData().allocateData([VE.float('BARYCENTRIC')], pBarycentric);
                    this.getData().allocateIndex([VE.float('BARYCENTRIC_INDEX')], pIndices);

                    this.getData().index('BARYCENTRIC', 'BARYCENTRIC_INDEX');
                }

                this._bWireframeOverlay = bOverlay;

                pDefaultRm.getEffect().addComponent("akra.system.wireframe", 0, 0);
            };

            RenderableObject.prototype.render = function (pViewport, csMethod, pSceneObject) {
                if (typeof csMethod === "undefined") { csMethod = null; }
                if (typeof pSceneObject === "undefined") { pSceneObject = null; }
                if (!this.isReadyForRender() || (!akra.isNull(pSceneObject) && pSceneObject.isHidden())) {
                    return;
                }

                if (!this.switchRenderMethod(csMethod)) {
                    //debug.error("could not switch render method <" + csMethod + ">");
                    return;
                }

                this.beforeRender.emit(pViewport, this._pTechnique.getMethod());

                this.getData()._draw(this._pTechnique, pViewport, this, pSceneObject);
            };

            RenderableObject.prototype.getTechnique = function (sName) {
                if (typeof sName === "undefined") { sName = DEFAULT_RT; }
                return this._pTechniqueMap[sName] || null;
            };

            RenderableObject.prototype.getTechniqueDefault = function () {
                return this.getTechnique(DEFAULT_RT);
            };

            RenderableObject.prototype._draw = function () {
                akra.logger.error("RenderableObject::_draw() pure virtual method() isn't callable!!");
            };

            RenderableObject.prototype.isVisible = function () {
                return this._bVisible;
            };
            RenderableObject.prototype.setVisible = function (bVisible) {
                if (typeof bVisible === "undefined") { bVisible = true; }
                this._bVisible = bVisible;
            };
            return RenderableObject;
        })();
        render.RenderableObject = RenderableObject;

        function isScreen(pObject) {
            return pObject.getType() === 2 /* SCREEN */;
        }
        render.isScreen = isScreen;

        function isSprite(pObject) {
            return pObject.getType() === 3 /* SPRITE */;
        }
        render.isSprite = isSprite;
    })(akra.render || (akra.render = {}));
    var render = akra.render;
})(akra || (akra = {}));
//# sourceMappingURL=RenderableObject.js.map
