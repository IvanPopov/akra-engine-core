/// <reference path="../idl/IRenderer.ts" />
var akra;
(function (akra) {
    /// <reference path="../idl/IAFXComponent.ts" />
    /// <reference path="../idl/IAFXEffect.ts" />
    /// <reference path="../idl/IAFXPreRenderState.ts" />
    /// <reference path="../idl/IAFXComponentBlend.ts" />
    /// <reference path="../idl/IAFXPassBlend.ts" />
    /// <reference path="../idl/IMesh.ts" />
    /// <reference path="../idl/IRenderableObject.ts" />
    /// <reference path="../idl/ISceneObject.ts" />
    /// <reference path="../idl/IBufferMap.ts" />
    /// <reference path="../idl/IShaderProgram.ts" />
    /// <reference path="../idl/ISurfaceMaterial.ts" />
    /// <reference path="../idl/IVertexData.ts" />
    /// <reference path="../idl/IVertexBuffer.ts" />
    /// <reference path="../idl/ITexture.ts" />
    /// <reference path="../idl/IIndexBuffer.ts" />
    /// <reference path="../idl/IRenderResource.ts" />
    /// <reference path="../idl/IRenderEntry.ts" />
    /// <reference path="../idl/IViewport.ts" />
    /// <reference path="../idl/ICanvas3d.ts" />
    /// <reference path="Viewport.ts" />
    /// <reference path="../events.ts" />
    /// <reference path="../render/RenderTarget.ts" />
    /// <reference path="../render/RenderQueue.ts" />
    /// <reference path="../sort/sort.ts" />
    (function (render) {
        render.SShaderPrefixes = {
            k_Sampler: "A_s_",
            k_Header: "A_h_",
            k_Attribute: "A_a_",
            k_Offset: "A_o_",
            k_Texture: "TEXTURE",
            k_Texcoord: "TEXCOORD",
            k_Texmatrix: "TEXMATRIX",
            k_Temp: "TEMP_",
            k_BlendType: "AUTO_BLEND_TYPE_"
        };

        render.ZEROSAMPLER = 19;

        render.SSystemSemantics = {
            MODEL_MATRIX: "MODEL_MATRIX",
            VIEW_MATRIX: "VIEW_MATRIX",
            PROJ_MATRIX: "PROJ_MATRIX",
            NORMAL_MATRIX: "NORMAL_MATRIX",
            BIND_MATRIX: "BIND_SHAPE_MATRIX",
            RENDER_OBJECT_ID: "RENDER_OBJECT_ID"
        };

        var Renderer = (function () {
            function Renderer(pEngine) {
                this.guid = akra.guid();
                this._isActive = false;
                this._pRenderTargets = [];
                this._pPrioritisedRenderTargets = {};
                this._pPriorityList = [];
                this._pRenderQueue = null;
                this._pActiveViewport = null;
                this._pActiveRenderTarget = null;
                /** TODO: FIX RENDER TARGET LOCK*/
                this._bLockRenderTarget = false;
                this.setupSignals();

                this._pEngine = pEngine;

                pEngine.active.connect(this.active);
                pEngine.inactive.connect(this.inactive);

                this._pRenderQueue = new akra.render.RenderQueue(this);
            }
            Renderer.prototype.setupSignals = function () {
                this.active = this.active || new akra.Signal(this);
                this.inactive = this.inactive || new akra.Signal(this);

                this.active.setForerunner(this._activated);
                this.inactive.setForerunner(this._inactivated);
            };

            Renderer.prototype.getType = function () {
                return 0 /* UNKNOWN */;
            };

            Renderer.prototype.getEngine = function () {
                return this._pEngine;
            };

            Renderer.prototype.hasCapability = function (eCapability) {
                return false;
            };

            Renderer.prototype.debug = function (bValue, useApiTrace) {
                return false;
            };

            Renderer.prototype.isDebug = function () {
                return false;
            };

            Renderer.prototype.isValid = function () {
                return true;
            };

            Renderer.prototype.getError = function () {
                return null;
            };

            Renderer.prototype._beginRender = function () {
            };

            Renderer.prototype._renderEntry = function (pEntry) {
            };

            Renderer.prototype._endRender = function () {
            };

            Renderer.prototype.clearFrameBuffer = function (iBuffer, cColor, fDepth, iStencil) {
            };

            Renderer.prototype.attachRenderTarget = function (pTarget) {
                if (this._pRenderTargets.indexOf(pTarget) != -1) {
                    return false;
                }

                var pList = this._pPrioritisedRenderTargets[pTarget.getPriority()];

                if (!akra.isDef(pList)) {
                    pList = this._pPrioritisedRenderTargets[pTarget.getPriority()] = [];
                    this._pPriorityList.push(pTarget.getPriority());
                    this._pPriorityList.sort(akra.sort.minMax);
                }

                pList.push(pTarget);

                this._pRenderTargets.push(pTarget);

                return true;
            };

            Renderer.prototype.detachRenderTarget = function (pTarget) {
                var i = this._pRenderTargets.indexOf(pTarget);

                if (i == -1) {
                    return false;
                }

                this._pRenderTargets.splice(i, 1);

                i = this._pPrioritisedRenderTargets[pTarget.getPriority()].indexOf(pTarget);
                this._pPrioritisedRenderTargets[pTarget.getPriority()].splice(i, 1);

                return true;
            };

            Renderer.prototype.destroyRenderTarget = function (pTarget) {
                var hasTarget = this.detachRenderTarget(pTarget);
                if (hasTarget) {
                    pTarget.destroy();
                    pTarget = null;
                }
            };

            Renderer.prototype.getActiveProgram = function () {
                akra.logger.critical("Renderer::getActiveProgram() is uncompleted method!");
                return null;
            };

            Renderer.prototype._disableAllTextureUnits = function () {
                this._disableTextureUnitsFrom(0);
            };

            Renderer.prototype._disableTextureUnitsFrom = function (iUnit) {
            };

            Renderer.prototype._initRenderTargets = function () {
                for (var i = 0; i < this._pRenderTargets.length; ++i) {
                    this._pRenderTargets[i].resetStatistics();
                }
            };

            Renderer.prototype._updateAllRenderTargets = function () {
                var pTarget;
                for (var i = 0; i < this._pPriorityList.length; i++) {
                    var iPriority = this._pPriorityList[i];
                    var pTargetList = this._pPrioritisedRenderTargets[iPriority];

                    for (var j = 0; j < pTargetList.length; ++j) {
                        pTarget = pTargetList[j];

                        if (pTarget.isActive() && pTarget.isAutoUpdated()) {
                            pTarget.update();
                        }
                    }
                }
            };

            Renderer.prototype._setViewport = function (pViewport) {
            };

            Renderer.prototype._setViewportForRender = function (pViewport) {
                var isViewportUpdate = pViewport !== this._pActiveViewport || pViewport.isUpdated();
                var isRenderTargetUpdate = pViewport.getTarget() !== this._pActiveRenderTarget;

                if (isViewportUpdate || isRenderTargetUpdate) {
                    this._setViewport(pViewport);

                    if (isViewportUpdate) {
                        // pViewport._clearForFrame();
                        var pState = pViewport._getViewportState();

                        this._setCullingMode(pState.cullingMode);
                        this._setDepthBufferParams(pState.depthTest, pState.depthWrite, pState.depthFunction, pState.clearDepth);
                    }
                }
            };

            Renderer.prototype._getViewport = function () {
                return this._pActiveViewport;
            };

            Renderer.prototype._setRenderTarget = function (pTarget) {
            };

            Renderer.prototype._setCullingMode = function (eMode) {
            };

            Renderer.prototype._setDepthBufferParams = function (bDepthTest, bDepthWrite, eDepthFunction, fClearDepth) {
            };

            Renderer.prototype.getDefaultCanvas = function () {
                return null;
            };

            Renderer.prototype.createEntry = function () {
                return this._pRenderQueue.createEntry();
            };

            Renderer.prototype.releaseEntry = function (pEntry) {
                this._pRenderQueue.releaseEntry(pEntry);
            };

            Renderer.prototype.pushEntry = function (pEntry) {
                this._pRenderQueue.push(pEntry);
            };

            Renderer.prototype.executeQueue = function (bSort) {
                if (typeof bSort === "undefined") { bSort = false; }
                this._pRenderQueue.execute(bSort);
            };

            Renderer.prototype._lockRenderTarget = function () {
                this._bLockRenderTarget = true;
            };

            Renderer.prototype._unlockRenderTarget = function () {
                this._bLockRenderTarget = false;
            };

            Renderer.prototype._isLockRenderTarget = function () {
                return this._bLockRenderTarget;
            };

            Renderer.prototype._activated = function () {
                this._isActive = true;
            };

            Renderer.prototype._inactivated = function () {
                this._isActive = false;
            };
            return Renderer;
        })();
        render.Renderer = Renderer;
    })(akra.render || (akra.render = {}));
    var render = akra.render;
})(akra || (akra = {}));
//# sourceMappingURL=Renderer.js.map
