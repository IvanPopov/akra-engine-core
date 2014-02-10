/// <reference path="../idl/IViewport.ts" />
/// <reference path="../idl/ICamera.ts" />
/// <reference path="../idl/IRID.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var akra;
(function (akra) {
    /// <reference path="../events.ts" />
    /// <reference path="../color/colors.ts" />
    /// <reference path="../bf/bf.ts" />
    /// <reference path="../config/config.ts" />
    /// <reference path="../math/math.ts" />
    /// <reference path="../debug.ts" />
    /// <reference path="../geometry/Rect2d.ts" />
    /// <reference path="../util/ObjectArray.ts" />
    /// <reference path="../guid.ts" />
    (function (render) {
        var Color = akra.color.Color;

        var Vec3 = akra.math.Vec3;
        var Vec4 = akra.math.Vec4;

        //NOTE: This signal is not called directly from the viewport, call derives from render technique.
        var RenderSignal = (function (_super) {
            __extends(RenderSignal, _super);
            function RenderSignal() {
                _super.apply(this, arguments);
            }
            RenderSignal.prototype.emit = function (pTechnique, iPass, pRenderable, pSceneObject) {
                //is mouse under the viewport
                var pViewport = this.getSender();
                pViewport._onRender(pTechnique, iPass, pRenderable, pSceneObject);

                //EMIT_BROADCAST(render, _CALL(pTechnique, iPass, pRenderable, pSceneObject));
                _super.prototype.emit.call(this, pTechnique, iPass, pRenderable, pSceneObject);
            };
            return RenderSignal;
        })(akra.Signal);

        //3D events
        var DragstartSignal = (function (_super) {
            __extends(DragstartSignal, _super);
            function DragstartSignal() {
                _super.apply(this, arguments);
            }
            DragstartSignal.prototype.emit = function (eBtn, x, y) {
                var pViewport = this.getSender();
                pViewport._keepLastMousePosition(x, y);

                if (!pViewport.is3DEventSupported(64 /* DRAGSTART */)) {
                    return;
                }

                var p = pViewport.pick(x, y);

                pViewport._set3DEventDragTarget(p.object, p.renderable);

                p.object && p.object.dragstart.emit(pViewport, p.renderable, x, y);
                p.renderable && p.renderable.dragstart.emit(pViewport, p.object, x, y);

                _super.prototype.emit.call(this, eBtn, x, y);
            };
            return DragstartSignal;
        })(akra.Signal);

        var DragstopSignal = (function (_super) {
            __extends(DragstopSignal, _super);
            function DragstopSignal() {
                _super.apply(this, arguments);
            }
            DragstopSignal.prototype.emit = function (eBtn, x, y) {
                var pViewport = this.getSender();
                pViewport._keepLastMousePosition(x, y);

                if (!pViewport.is3DEventSupported(128 /* DRAGSTOP */)) {
                    return;
                }

                var p = pViewport._get3DEventDragTarget();

                p.object && p.object.dragstop.emit(pViewport, p.renderable, x, y);
                p.renderable && p.renderable.dragstop.emit(pViewport, p.object, x, y);

                this.emit(eBtn, x, y);
            };
            return DragstopSignal;
        })(akra.Signal);

        var DraggingSignal = (function (_super) {
            __extends(DraggingSignal, _super);
            function DraggingSignal() {
                _super.apply(this, arguments);
            }
            DraggingSignal.prototype.emit = function (eBtn, x, y) {
                var pViewport = this.getSender();

                pViewport._keepLastMousePosition(x, y);

                if (!pViewport.is3DEventSupported(256 /* DRAGGING */)) {
                    return;
                }

                var p = pViewport._get3DEventDragTarget();

                p.object && p.object.dragging.emit(pViewport, p.renderable, x, y);
                p.renderable && p.renderable.dragging.emit(pViewport, p.object, x, y);

                this.emit(eBtn, x, y);
            };
            return DraggingSignal;
        })(akra.Signal);

        var ClickSignal = (function (_super) {
            __extends(ClickSignal, _super);
            function ClickSignal() {
                _super.apply(this, arguments);
            }
            ClickSignal.prototype.emit = function (x, y) {
                var pViewport = this.getSender();

                pViewport._keepLastMousePosition(x, y);
                _super.prototype.emit.call(this, x, y);

                if (!pViewport.is3DEventSupported(1 /* CLICK */)) {
                    return;
                }

                var p = pViewport.pick(x, y);

                p.object && p.object.click.emit(pViewport, p.renderable, x, y);
                p.renderable && p.renderable.click.emit(pViewport, p.object, x, y);
            };
            return ClickSignal;
        })(akra.Signal);

        var MousemoveSignal = (function (_super) {
            __extends(MousemoveSignal, _super);
            function MousemoveSignal() {
                _super.apply(this, arguments);
            }
            MousemoveSignal.prototype.emit = function (x, y) {
                var pViewport = this.getSender();

                pViewport._keepLastMousePosition(x, y);
                _super.prototype.emit.call(this, x, y);

                if (!pViewport.is3DEventSupported(2 /* MOUSEMOVE */)) {
                    return;
                }

                var p = pViewport.pick(x, y);

                p.object && p.object.mousemove.emit(pViewport, p.renderable, x, y);
                p.renderable && p.renderable.mousemove.emit(pViewport, p.object, x, y);
            };
            return MousemoveSignal;
        })(akra.Signal);

        var MousedownSignal = (function (_super) {
            __extends(MousedownSignal, _super);
            function MousedownSignal() {
                _super.apply(this, arguments);
            }
            MousedownSignal.prototype.emit = function (eBtn, x, y) {
                var pViewport = this.getSender();

                pViewport._keepLastMousePosition(x, y);
                _super.prototype.emit.call(this, eBtn, x, y);

                if (!pViewport.is3DEventSupported(4 /* MOUSEDOWN */)) {
                    return;
                }

                var p = pViewport.pick(x, y);

                p.object && p.object.mousedown.emit(pViewport, p.renderable, x, y);
                p.renderable && p.renderable.mousedown.emit(pViewport, p.object, x, y);
            };
            return MousedownSignal;
        })(akra.Signal);

        var MouseupSignal = (function (_super) {
            __extends(MouseupSignal, _super);
            function MouseupSignal() {
                _super.apply(this, arguments);
            }
            MouseupSignal.prototype.emit = function (eBtn, x, y) {
                var pViewport = this.getSender();
                pViewport._keepLastMousePosition(x, y);

                _super.prototype.emit.call(this, eBtn, x, y);

                if (!pViewport.is3DEventSupported(8 /* MOUSEUP */)) {
                    return;
                }

                var p = pViewport.pick(x, y);

                p.object && p.object.mouseup.emit(pViewport, p.renderable, x, y);
                p.renderable && p.renderable.mouseup.emit(pViewport, p.object, x, y);
            };
            return MouseupSignal;
        })(akra.Signal);

        var MouseoverSignal = (function (_super) {
            __extends(MouseoverSignal, _super);
            function MouseoverSignal() {
                _super.apply(this, arguments);
            }
            MouseoverSignal.prototype.emit = function (x, y) {
                var pViewport = this.getSender();

                pViewport._keepLastMousePosition(x, y);
                pViewport._setMouseCaptured(true);
                _super.prototype.emit.call(this, x, y);
            };
            return MouseoverSignal;
        })(akra.Signal);

        var MouseoutSignal = (function (_super) {
            __extends(MouseoutSignal, _super);
            function MouseoutSignal() {
                _super.apply(this, arguments);
            }
            MouseoutSignal.prototype.emit = function (x, y) {
                var pViewport = this.getSender();

                pViewport._keepLastMousePosition(x, y);
                pViewport._setMouseCaptured(false);

                //FIXME: do not create object this!
                pViewport._handleMouseInout({ object: null, renderable: null }, x, y);
                _super.prototype.emit.call(this, x, y);
            };
            return MouseoutSignal;
        })(akra.Signal);

        var MousewheelSignal = (function (_super) {
            __extends(MousewheelSignal, _super);
            function MousewheelSignal() {
                _super.apply(this, arguments);
            }
            MousewheelSignal.prototype.emit = function (x, y, fDelta) {
                var pViewport = this.getSender();

                pViewport._keepLastMousePosition(x, y);
                _super.prototype.emit.call(this, x, y, fDelta);
            };
            return MousewheelSignal;
        })(akra.Signal);

        var Viewport = (function () {
            /**
            * @param csRenderMethod Name of render technique, that will be selected in the renderable for render.
            */
            function Viewport(pCamera, csRenderMethod, fLeft, fTop, fWidth, fHeight, iZIndex) {
                if (typeof csRenderMethod === "undefined") { csRenderMethod = null; }
                if (typeof fLeft === "undefined") { fLeft = 0.; }
                if (typeof fTop === "undefined") { fTop = 0.; }
                if (typeof fWidth === "undefined") { fWidth = 1.; }
                if (typeof fHeight === "undefined") { fHeight = 1.; }
                if (typeof iZIndex === "undefined") { iZIndex = 0; }
                this.guid = akra.guid();
                this._pCamera = null;
                this._pTarget = null;
                this._iActLeft = 0;
                this._iActTop = 0;
                this._iActWidth = 1;
                this._iActHeight = 1;
                this._pDepthRange = { min: -1., max: 1. };
                this._pViewportState = {
                    cullingMode: 1 /* NONE */,
                    depthTest: true,
                    depthWrite: true,
                    depthFunction: 2 /* LESS */,
                    clearColor: new Color(0., 0., 0., 0.),
                    clearDepth: 1.,
                    clearBuffers: 1 /* COLOR */ | 2 /* DEPTH */
                };
                this._bClearEveryFrame = true;
                this._bUpdated = false;
                this._iVisibilityMask = 0xFFFFFFFF;
                this._sMaterialSchemeName = akra.config.material.name;
                this._isAutoUpdated = true;
                this._csDefaultRenderMethod = null;
                this._isDepthRangeUpdated = false;
                //show/hide
                this._bHidden = false;
                //get last mouse postion backend
                this._pMousePositionLast = { x: 0, y: 0 };
                //is mouse under the viewport?
                this._bMouseIsCaptured = false;
                //3d event handing
                this._i3DEvents = 0;
                //friends for Mouse event signals...
                this._p3DEventPickLast = { object: null, renderable: null };
                this._p3DEventDragTarget = { object: null, renderable: null };
                this.setupSignals();

                this._fRelLeft = fLeft;
                this._fRelTop = fTop;
                this._fRelWidth = fWidth;
                this._fRelHeight = fHeight;

                this._iZIndex = iZIndex;

                this._csDefaultRenderMethod = csRenderMethod;

                this._setCamera(pCamera);
            }
            Viewport.prototype.setupSignals = function () {
                this.viewportDimensionsChanged = this.viewportDimensionsChanged || new akra.Signal(this);
                this.viewportCameraChanged = this.viewportCameraChanged || new akra.Signal(this);

                this.render = this.render || new RenderSignal(this);

                this.dragstart = this.dragstart || new DragstartSignal(this);
                this.dragstop = this.dragstop || new DragstopSignal(this);
                this.dragging = this.dragging || new DraggingSignal(this);

                this.click = this.click || new ClickSignal(this);
                this.mousemove = this.mousemove || new MousemoveSignal(this);

                this.mousedown = this.mousedown || new MousedownSignal(this);
                this.mouseup = this.mouseup || new MouseupSignal(this);

                this.mouseover = this.mouseover || new MouseoverSignal(this);
                this.mouseout = this.mouseout || new MouseoutSignal(this);
                this.mousewheel = this.mousewheel || new MousewheelSignal(this);
            };

            Viewport.prototype.getLeft = function () {
                return this._fRelLeft;
            };

            Viewport.prototype.getTop = function () {
                return this._fRelTop;
            };

            Viewport.prototype.getWidth = function () {
                return this._fRelWidth;
            };

            Viewport.prototype.getHeight = function () {
                return this._fRelHeight;
            };

            Viewport.prototype.getActualLeft = function () {
                return this._iActLeft;
            };

            Viewport.prototype.getActualTop = function () {
                return this._iActTop;
            };

            Viewport.prototype.getActualWidth = function () {
                return this._iActWidth;
            };

            Viewport.prototype.getActualHeight = function () {
                return this._iActHeight;
            };

            Viewport.prototype.getZIndex = function () {
                return this._iZIndex;
            };

            Viewport.prototype.getType = function () {
                return -1 /* DEFAULT */;
            };

            Viewport.prototype.getBackgroundColor = function () {
                return this._pViewportState.clearColor;
            };

            Viewport.prototype.setBackgroundColor = function (cColor) {
                this._pViewportState.clearColor.set(cColor);
            };

            Viewport.prototype.getDepthClear = function () {
                return this._pViewportState.clearDepth;
            };

            Viewport.prototype.setDepthClear = function (fDepthClearValue) {
                this._pViewportState.clearDepth = fDepthClearValue;
            };

            Viewport.prototype.destroy = function () {
                var pRenderer = this._pTarget.getRenderer();
                if (pRenderer && pRenderer._getViewport() === this) {
                    pRenderer._setViewport(null);
                }
            };

            Viewport.prototype.clear = function (iBuffers, cColor, fDepth, iStencil) {
                if (typeof iBuffers === "undefined") { iBuffers = 1 /* COLOR */ | 2 /* DEPTH */; }
                if (typeof cColor === "undefined") { cColor = Color.BLACK; }
                if (typeof fDepth === "undefined") { fDepth = 1.; }
                if (typeof iStencil === "undefined") { iStencil = 0; }
                var pRenderer = this._pTarget.getRenderer();

                if (pRenderer) {
                    var pCurrentViewport = pRenderer._getViewport();

                    if (pCurrentViewport === this) {
                        pRenderer.clearFrameBuffer(iBuffers, cColor, fDepth, iStencil);
                    } else {
                        pRenderer._setViewport(this);
                        pRenderer.clearFrameBuffer(iBuffers, cColor, fDepth, iStencil);
                        pRenderer._setViewport(pCurrentViewport);
                    }
                }
            };

            Viewport.prototype.enableSupportFor3DEvent = function (iType) {
                if (akra.isNull(this.getTarget())) {
                    return 0;
                }

                if (akra.bf.testAny(iType, 64 /* DRAGSTART */ | 128 /* DRAGSTOP */ | 256 /* DRAGGING */)) {
                    iType = akra.bf.setAll(iType, 64 /* DRAGSTART */ | 128 /* DRAGSTOP */ | 256 /* DRAGGING */ | 4 /* MOUSEDOWN */ | 8 /* MOUSEUP */ | 2 /* MOUSEMOVE */);
                }

                //mouse over and mouse out events require mouse move
                if (akra.bf.testAny(iType, 16 /* MOUSEOVER */ | 32 /* MOUSEOUT */)) {
                    iType = akra.bf.setAll(iType, 2 /* MOUSEMOVE */);
                }

                //get events that have not yet been activated
                var iNotActivate = (this._i3DEvents ^ akra.MAX_INT32) & iType;

                this._i3DEvents = akra.bf.setAll(this._i3DEvents, iNotActivate);

                this.getTarget().enableSupportFor3DEvent(iType);

                return iNotActivate;
            };

            Viewport.prototype.is3DEventSupported = function (eType) {
                return akra.bf.testAny(this._i3DEvents, eType);
            };

            Viewport.prototype.getTarget = function () {
                return this._pTarget;
            };

            Viewport.prototype.getCamera = function () {
                return this._pCamera;
            };

            Viewport.prototype.getDepth = function (x, y) {
                return 1.0;
            };

            Viewport.prototype.getDepthRange = function () {
                if (!this._isDepthRangeUpdated) {
                    this._isDepthRangeUpdated = true;
                    var pDepthRange = this._getDepthRangeImpl();

                    this._pDepthRange.min = pDepthRange.min;
                    this._pDepthRange.max = pDepthRange.max;
                }

                return this._pDepthRange;
            };

            Viewport.prototype._getDepthRangeImpl = function () {
                return { min: -1, max: 1 };
            };

            Viewport.prototype.setCamera = function (pCamera) {
                if (akra.isDefAndNotNull(pCamera)) {
                    if (this._pCamera._getLastViewport() == this) {
                        this._pCamera._keepLastViewport(null);
                    }
                }

                this._setCamera(pCamera);
                this.viewportCameraChanged.emit();

                return true;
            };

            Viewport.prototype._setCamera = function (pCamera) {
                this._pCamera = pCamera;

                if (akra.isDefAndNotNull(pCamera)) {
                    // update aspect ratio of new camera if needed.
                    if (!pCamera.isConstantAspect()) {
                        pCamera.setAspect(this._iActWidth / this._iActHeight);
                    }
                    pCamera._keepLastViewport(this);
                }
            };

            Viewport.prototype.setDimensions = function (fLeft, fTop, fWidth, fHeight) {
                var pRect;
                if (akra.isNumber(arguments[0])) {
                    this._fRelLeft = fLeft;
                    this._fRelTop = fTop;
                    this._fRelWidth = fWidth;
                    this._fRelHeight = fHeight;
                } else {
                    pRect = arguments[0];
                    this._fRelLeft = pRect.getLeft();
                    this._fRelTop = pRect.getTop();
                    this._fRelWidth = pRect.getWidth();
                    this._fRelHeight = pRect.getHeight();
                }

                this._updateDimensions();

                return true;
            };

            Viewport.prototype.getActualDimensions = function () {
                return new akra.geometry.Rect2d(this._iActLeft, this._iActTop, this._iActWidth, this._iActHeight);
            };

            Viewport.prototype.setClearEveryFrame = function (isClear, iBuffers) {
                if (typeof iBuffers === "undefined") { iBuffers = 1 /* COLOR */ | 2 /* DEPTH */; }
                this._bClearEveryFrame = isClear;
                this._pViewportState.clearBuffers = iBuffers;
            };

            Viewport.prototype.getClearEveryFrame = function () {
                return this._bClearEveryFrame;
            };

            Viewport.prototype.getClearBuffers = function () {
                return this._pViewportState.clearBuffers;
            };

            Viewport.prototype.setDepthParams = function (bDepthTest, bDepthWrite, eDepthFunction) {
                this._pViewportState.depthTest = bDepthTest;
                this._pViewportState.depthWrite = bDepthWrite;
                this._pViewportState.depthFunction = eDepthFunction;
            };

            Viewport.prototype.setCullingMode = function (eCullingMode) {
                this._pViewportState.cullingMode = eCullingMode;
            };

            Viewport.prototype.setAutoUpdated = function (bValue) {
                if (typeof bValue === "undefined") { bValue = true; }
                this._isAutoUpdated = bValue;
            };
            Viewport.prototype.isAutoUpdated = function () {
                return this._isAutoUpdated;
            };

            Viewport.prototype._updateDimensions = function (bEmitEvent) {
                if (typeof bEmitEvent === "undefined") { bEmitEvent = true; }
                var fHeight = this._pTarget.getHeight();
                var fWidth = this._pTarget.getWidth();

                this._iActLeft = akra.math.round(this._fRelLeft * fWidth);
                this._iActTop = akra.math.round(this._fRelTop * fHeight);
                this._iActWidth = akra.math.round(this._fRelWidth * fWidth);
                this._iActHeight = akra.math.round(this._fRelHeight * fHeight);

                // This will check if the cameras getAutoAspectRatio() property is set.
                // If it's true its aspect ratio is fit to the current viewport
                // If it's false the camera remains unchanged.
                // This allows cameras to be used to render to many viewports,
                // which can have their own dimensions and aspect ratios.
                if (this._pCamera) {
                    if (!this._pCamera.isConstantAspect())
                        this._pCamera.setAspect(this._iActWidth / this._iActHeight);
                }

                this._bUpdated = true;

                if (bEmitEvent) {
                    this.viewportDimensionsChanged.emit();
                }
            };

            Viewport.prototype.hide = function (bValue) {
                if (typeof bValue === "undefined") { bValue = true; }
                if (bValue !== this._bHidden) {
                    this.clear();
                    this._bHidden = bValue;
                }
            };

            Viewport.prototype.update = function () {
                if (this._bHidden) {
                    return;
                }

                if (akra.isDefAndNotNull(this._pCamera)) {
                    this._pCamera._keepLastViewport(this);
                }

                this.startFrame();

                this._isDepthRangeUpdated = false;

                this._updateImpl();

                this.endFrame();
            };

            Viewport.prototype._updateImpl = function () {
                if (this._pCamera) {
                    this.renderAsNormal(this._csDefaultRenderMethod, this._pCamera);
                }
            };

            Viewport.prototype.startFrame = function () {
                if (this._bClearEveryFrame) {
                    this.clear(this._pViewportState.clearBuffers, this._pViewportState.clearColor, this._pViewportState.clearDepth);
                }
            };

            Viewport.prototype.renderObject = function (pRenderable, csMethod) {
                if (typeof csMethod === "undefined") { csMethod = null; }
                pRenderable.render(this, csMethod || this._csDefaultRenderMethod, null);
            };

            Viewport.prototype.endFrame = function () {
                this.getTarget().getRenderer().executeQueue(true);
            };

            Viewport.prototype.renderAsNormal = function (csMethod, pCamera) {
                var pVisibleObjects = pCamera.display();
                var pRenderable;

                for (var i = 0; i < pVisibleObjects.getLength(); ++i) {
                    pVisibleObjects.value(i).prepareForRender(this);
                }

                for (var i = 0; i < pVisibleObjects.getLength(); ++i) {
                    var pSceneObject = pVisibleObjects.value(i);

                    for (var j = 0; j < pSceneObject.getTotalRenderable(); j++) {
                        pRenderable = pSceneObject.getRenderable(j);

                        if (!akra.isNull(pRenderable)) {
                            pRenderable.render(this, csMethod, pSceneObject);
                        }
                    }
                }
            };

            Viewport.prototype._onRender = function (pTechnique, iPass, pRenderable, pSceneObject) {
                if (this.isMouseCaptured() && iPass === 0 && (this.is3DEventSupported(16 /* MOUSEOVER */) || this.is3DEventSupported(32 /* MOUSEOUT */))) {
                    //check, if the object are loss the mouse
                    var pPos = this._getLastMousePosition();
                    var x = pPos.x;
                    var y = pPos.y;

                    this._handleMouseInout(this.pick(x, y), x, y);
                }
            };

            Viewport.prototype.projectPoint = function (v3fPoint, v3fDestination) {
                var pCamera = this.getCamera();
                var v3fResult = pCamera.projectPoint(v3fPoint, v3fDestination);

                if (akra.isNull(v3fResult)) {
                    return null;
                }

                var fX = v3fResult.x;
                var fY = v3fResult.y;
                var fZ = v3fResult.z;

                fX = fX * 0.5 + 0.5;
                fY = fY * 0.5 + 0.5;
                fZ = fZ * 0.5 + 0.5;

                //from top left angle of element
                fX = this.getActualLeft() + this.getActualWidth() * fX;
                fY = this.getActualTop() + this.getActualHeight() * fY;

                return v3fResult.set(fX, fY, fZ);
            };

            Viewport.prototype.unprojectPoint = function (a0, a1, a2) {
                var x, y;
                var v3fDestination;

                if (akra.isInt(arguments[0])) {
                    x = arguments[0];
                    y = arguments[1];
                    v3fDestination = arguments[2];
                } else {
                    x = arguments[0].x;
                    y = arguments[0].y;
                    v3fDestination = arguments[1];
                }

                if (!akra.isDef(v3fDestination)) {
                    v3fDestination = new Vec3;
                }

                var pCamera = this.getCamera();
                var m4fProjection = pCamera.getProjectionMatrix();
                var m4fWorld = pCamera.getWorldMatrix();

                var v4fIn = Vec4.temp(), v4fOut = Vec4.temp();

                //Transformation of normalized coordinates between -1 and 1
                v4fIn.x = ((x - this.getActualLeft()) / this.getActualWidth() * 2.0 - 1.0);

                //Y-axis look down for viewport, but look UP in GL
                v4fIn.y = ((y - this.getActualTop()) / this.getActualHeight() * 2.0 - 1.0);
                v4fIn.z = 2.0 * this.getDepth(x, y) - 1.0;
                v4fIn.w = 1.0;

                v3fDestination.set(m4fWorld.multiplyVec4(m4fProjection.unproj(v4fIn, v4fOut)).clone("xyz"));
                return v3fDestination;
            };

            Viewport.prototype._setTarget = function (pTarget) {
                if (!akra.isNull(this._pTarget)) {
                    akra.logger.critical("render target already exists in this viewport");
                    //this.disconnect(this._pTarget, SIGNAL(resized), SLOT(_updateDimensions));
                }

                this._pTarget = pTarget;

                if (!akra.isNull(this._pTarget)) {
                    //FIXME: unsafe <any> conversion used for _updateDimensins
                    this._pTarget.resized.connect(this, this._updateDimensions);
                    this._updateDimensions();
                    this._setCamera(this._pCamera);
                }
            };

            Viewport.prototype.isUpdated = function () {
                return this._bUpdated;
            };

            Viewport.prototype.isMouseCaptured = function () {
                return this._bMouseIsCaptured;
            };

            Viewport.prototype._setMouseCaptured = function (bValue) {
                this._bMouseIsCaptured = bValue;
            };

            Viewport.prototype._clearUpdatedFlag = function () {
                this._bUpdated = false;
            };

            Viewport.prototype._getNumRenderedPolygons = function () {
                return this._pCamera ? this._pCamera._getNumRenderedFaces() : 0;
            };

            Viewport.prototype._getViewportState = function () {
                return this._pViewportState;
            };

            Viewport.prototype.pick = function (x, y) {
                return { object: null, renderable: null };
            };

            Viewport.prototype.getObject = function (x, y) {
                return null;
            };

            Viewport.prototype.getRenderable = function (x, y) {
                return null;
            };

            //manual recall over/out events for objects
            Viewport.prototype.touch = function () {
                this._handleMouseInout({ object: null, renderable: null }, 0, 0);
            };

            //friends for RenderSignal.
            Viewport.prototype._handleMouseInout = function (pCurr, x, y) {
                // var pCurr: IRIDPair = this.pick(x, y);
                var pPrev = this._p3DEventPickLast;

                if (pCurr.object !== pPrev.object) {
                    if (!akra.isNull(pPrev.object)) {
                        pPrev.object.mouseout.emit(this, pPrev.renderable, x, y);
                    }

                    if (!akra.isNull(pCurr.object)) {
                        pCurr.object.mouseover.emit(this, pCurr.renderable, x, y);
                    }
                }

                // var ov = false;
                // var ou = false;
                // var n = math.floor(Math.random() * 100500);
                if (pCurr.renderable !== pPrev.renderable) {
                    if (!akra.isNull(pPrev.renderable)) {
                        // ou = true;
                        pPrev.renderable.mouseout.emit(this, pPrev.object, x, y);
                    }

                    if (!akra.isNull(pCurr.renderable)) {
                        // ov = true;
                        pCurr.renderable.mouseover.emit(this, pCurr.object, x, y);
                    }
                }

                // if (!ov && ou) {
                // console.log("opacity enabled");
                // }
                this._p3DEventPickLast = pCurr;

                return pCurr;
            };

            Viewport.prototype._keepLastMousePosition = function (x, y) {
                this._pMousePositionLast.x = x;
                this._pMousePositionLast.y = y;
            };

            Viewport.prototype._getLastMousePosition = function () {
                return this._pMousePositionLast;
            };

            Viewport.prototype._set3DEventDragTarget = function (pObject, pRenderable) {
                if (typeof pObject === "undefined") { pObject = null; }
                if (typeof pRenderable === "undefined") { pRenderable = null; }
                this._p3DEventDragTarget.object = pObject;
                this._p3DEventDragTarget.renderable = pRenderable;
            };

            Viewport.prototype._get3DEventDragTarget = function () {
                return this._p3DEventDragTarget;
            };

            Viewport.RenderSignal = RenderSignal;

            Viewport.DraggingSignal = DraggingSignal;
            Viewport.DragstartSignal = DragstartSignal;
            Viewport.DragstopSignal = DragstopSignal;

            Viewport.MousedownSignal = MousedownSignal;
            Viewport.MouseupSignal = MouseupSignal;

            Viewport.MouseoverSignal = MouseoverSignal;
            Viewport.MouseoutSignal = MouseoutSignal;

            Viewport.MousewheelSignal = MousewheelSignal;
            Viewport.MousemoveSignal = MousemoveSignal;

            Viewport.ClickSignal = ClickSignal;
            return Viewport;
        })();
        render.Viewport = Viewport;
    })(akra.render || (akra.render = {}));
    var render = akra.render;
})(akra || (akra = {}));
//# sourceMappingURL=Viewport.js.map
