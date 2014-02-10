/// <reference path="../idl/IRenderTarget.ts" />
/// <reference path="../idl/IDepthBuffer.ts" />
/// <reference path="../idl/IFrameStats.ts" />
/// <reference path="../idl/IPixelBuffer.ts" />
var akra;
(function (akra) {
    /// <reference path="Viewport.ts" />
    /// <reference path="TextureViewport.ts" />
    /// <reference path="DSViewport.ts" />
    /// <reference path="ColorViewport.ts" />
    /// <reference path="ShadowViewport.ts" />
    /// <reference path="../events.ts" />
    /// <reference path="../pixelUtil/pixelUtil.ts" />
    /// <reference path="../config/config.ts" />
    /// <reference path="../guid.ts" />
    (function (render) {
        var RenderTarget = (function () {
            function RenderTarget(pRenderer) {
                this.guid = akra.guid();
                this._iPriority = RenderTarget.DEFAULT_RT_GROUP;
                this._pDepthBuffer = null;
                this._pDepthPixelBuffer = null;
                this._isActive = true;
                this._isAutoUpdate = true;
                this._bHwGamma = false;
                this._pViewportList = [];
                //3d event handing
                this._i3DEvents = 0;
                this.setupSignals();
                this._pRenderer = pRenderer;
                this._pTimer = pRenderer.getEngine().getTimer();
                this._pFrameStats = {
                    fps: {
                        last: 0.,
                        avg: 0.,
                        best: 0.,
                        worst: 0.
                    },
                    time: {
                        best: 0.,
                        worst: 0.
                    },
                    polygonsCount: 0
                };

                this.resetStatistics();
            }
            RenderTarget.prototype.setupSignals = function () {
                this.preUpdate = this.preUpdate || new akra.Signal(this);
                this.postUpdate = this.postUpdate || new akra.Signal(this);

                this.viewportPreUpdate = this.viewportPreUpdate || new akra.Signal(this);
                this.viewportPostUpdate = this.viewportPostUpdate || new akra.Signal(this);
                this.viewportAdded = this.viewportAdded || new akra.Signal(this);
                this.viewportRemoved = this.viewportRemoved || new akra.Signal(this);

                this.resized = this.resized || new akra.Signal(this);
                this.cameraRemoved = this.cameraRemoved || new akra.Signal(this);
            };

            RenderTarget.prototype.getWidth = function () {
                return this._iWidth;
            };

            RenderTarget.prototype.getHeight = function () {
                return this._iHeight;
            };

            RenderTarget.prototype.getColorDepth = function () {
                return this._iColorDepth;
            };

            RenderTarget.prototype.getTotalViewports = function () {
                return this._pViewportList.length;
            };

            RenderTarget.prototype.getTotalFrames = function () {
                return this._iFrameCount;
            };

            RenderTarget.prototype.getPriority = function () {
                return this._iPriority;
            };

            RenderTarget.prototype.getName = function () {
                return this._sName;
            };

            RenderTarget.prototype.setName = function (sName) {
                this._sName = sName;
            };

            RenderTarget.prototype.enableSupportFor3DEvent = function (iType) {
                if (akra.bf.testAny(iType, 64 /* DRAGSTART */ | 128 /* DRAGSTOP */ | 256 /* DRAGGING */)) {
                    iType = akra.bf.setAll(iType, 64 /* DRAGSTART */ | 128 /* DRAGSTOP */ | 256 /* DRAGGING */ | 4 /* MOUSEDOWN */ | 8 /* MOUSEUP */ | 2 /* MOUSEMOVE */);
                }

                //mouse over and mouse out events require mouse move
                if (akra.bf.testAny(iType, 16 /* MOUSEOVER */ | 32 /* MOUSEOUT */)) {
                    iType = akra.bf.setAll(iType, 2 /* MOUSEMOVE */);
                }

                //get events that have not yet been activated
                var iNotActivate = (this._i3DEvents ^ 0x7fffffff) & iType;

                this._i3DEvents = akra.bf.setAll(this._i3DEvents, iNotActivate);

                return iNotActivate;
            };

            RenderTarget.prototype.is3DEventSupported = function (eType) {
                return akra.bf.testAny(this._i3DEvents, eType);
            };

            RenderTarget.prototype.getRenderer = function () {
                return this._pRenderer;
            };

            RenderTarget.prototype.destroy = function () {
                var pViewport;

                for (var i in this._pViewportList) {
                    pViewport = this._pViewportList[i];
                    this.viewportRemoved.emit(pViewport);
                    pViewport.destroy();
                }

                this.detachDepthBuffer();

                akra.debug.log("RenderTarget '%s'\n Average FPS: %s\n Best FPS: %s\n Worst FPS: %s", this._sName, this._pFrameStats.fps.avg, this._pFrameStats.fps.best, this._pFrameStats.fps.worst);
            };

            RenderTarget.prototype.getDepthBuffer = function () {
                return this._pDepthBuffer;
            };

            RenderTarget.prototype.attachDepthBuffer = function (pBuffer) {
                var isOk = false;

                if ((isOk = pBuffer.isCompatible(this))) {
                    this.detachDepthBuffer();
                    this._pDepthBuffer = pBuffer;
                    this._pDepthBuffer._notifyRenderTargetAttached(this);
                }

                return isOk;
            };

            RenderTarget.prototype.attachDepthPixelBuffer = function (pBuffer) {
                if (this._iWidth !== pBuffer.getWidth() || this._iHeight !== pBuffer.getHeight()) {
                    return false;
                }

                var eFormat = pBuffer.getFormat();
                if (eFormat !== 29 /* FLOAT32_DEPTH */ || eFormat !== 44 /* DEPTH8 */) {
                    return false;
                }

                this.detachDepthPixelBuffer();
                this._pDepthPixelBuffer = pBuffer;

                return true;
            };

            RenderTarget.prototype.detachDepthPixelBuffer = function () {
                if (this._pDepthPixelBuffer) {
                    this._pDepthPixelBuffer = null;
                }
            };

            RenderTarget.prototype.detachDepthBuffer = function () {
                if (this._pDepthBuffer) {
                    this._pDepthBuffer._notifyRenderTargetDetached(this);
                    this._pDepthBuffer = null;
                }
            };

            RenderTarget.prototype.attachDepthTexture = function (pTexture) {
                return false;
            };

            RenderTarget.prototype.detachDepthTexture = function () {
            };

            RenderTarget.prototype._detachDepthBuffer = function () {
                this._pDepthBuffer = null;
            };

            RenderTarget.prototype._beginUpdate = function () {
                this.preUpdate.emit();

                this._pFrameStats.polygonsCount = 0;
            };

            RenderTarget.prototype._updateAutoUpdatedViewports = function (bUpdateStatistics) {
                if (typeof bUpdateStatistics === "undefined") { bUpdateStatistics = true; }
                var pViewport;

                for (var i in this._pViewportList) {
                    pViewport = this._pViewportList[i];

                    if (pViewport.isAutoUpdated()) {
                        this._updateViewport(pViewport, bUpdateStatistics);
                    }
                }
            };

            RenderTarget.prototype._endUpdate = function () {
                this.postUpdate.emit();
                this.updateStats();
            };

            RenderTarget.prototype._updateViewport = function (pViewportPtr, bUpdateStatistics) {
                if (typeof bUpdateStatistics === "undefined") { bUpdateStatistics = true; }
                var pViewport;
                var iZIndex;

                if (akra.isNumber(arguments[0])) {
                    iZIndex = arguments[0];
                    pViewport = this._pViewportList[iZIndex];

                    akra.logger.assert(akra.isDefAndNotNull(pViewport), "No viewport with given z-index : %s", iZIndex, "RenderTarget::_updateViewport");
                } else {
                    pViewport = arguments[0];
                }

                akra.logger.assert(pViewport.getTarget() == this, "RenderTarget::_updateViewport the requested viewport is not bound to the rendertarget!");

                this.viewportPreUpdate.emit(pViewport);

                pViewport.update();

                if (bUpdateStatistics) {
                    this._pFrameStats.polygonsCount += pViewport._getNumRenderedPolygons();
                }

                this.viewportPostUpdate.emit(pViewport);
            };

            RenderTarget.prototype.addViewport = function (pViewport) {
                if (akra.isNull(pViewport)) {
                    return null;
                }

                var iZIndex = pViewport.getZIndex();

                if (akra.isDefAndNotNull(this._pViewportList[iZIndex])) {
                    akra.logger.critical("Can't create another viewport for %s with Z-index %s \
					because a viewport exists with this Z-Order already.", this._sName, iZIndex, "RenderTarget::addViewport");
                }

                pViewport._setTarget(this);

                this._pViewportList[iZIndex] = pViewport;
                this.viewportAdded.emit(pViewport);

                return pViewport;
            };

            RenderTarget.prototype.removeViewport = function (iZIndex) {
                var pViewport = this._pViewportList[iZIndex];

                if (akra.isDefAndNotNull(pViewport)) {
                    this.viewportRemoved.emit(pViewport);

                    this._pViewportList.splice(iZIndex, 1);
                    pViewport = null;

                    return true;
                }

                return false;
            };

            RenderTarget.prototype.removeAllViewports = function () {
                var pViewport;
                var iTotal;

                for (var i in this._pViewportList) {
                    pViewport = this._pViewportList[i];
                    this.viewportRemoved.emit(pViewport);
                }

                iTotal = this._pViewportList.length;

                this._pViewportList.clear();

                return iTotal;
            };

            RenderTarget.prototype.getStatistics = function () {
                return this._pFrameStats;
            };

            RenderTarget.prototype.getLastFPS = function () {
                return this._pFrameStats.fps.last;
            };

            RenderTarget.prototype.getAverageFPS = function () {
                return this._pFrameStats.fps.avg;
            };

            RenderTarget.prototype.getBestFPS = function () {
                return this._pFrameStats.fps.best;
            };

            RenderTarget.prototype.getWorstFPS = function () {
                return this._pFrameStats.fps.worst;
            };

            RenderTarget.prototype.getPolygonCount = function () {
                return this._pFrameStats.polygonsCount;
            };

            RenderTarget.prototype.getBestFrameTime = function () {
                return this._pFrameStats.time.best;
            };

            RenderTarget.prototype.getWorstFrameTime = function () {
                return this._pFrameStats.time.worst;
            };

            RenderTarget.prototype.resetStatistics = function () {
                var pStats = this._pFrameStats;
                pStats.fps.avg = 0.;
                pStats.fps.best = 0.;
                pStats.fps.last = 0.;
                pStats.fps.worst = 999.;

                pStats.polygonsCount = 0;

                pStats.time.best = 9999999;
                pStats.time.worst = 0;

                //FIXME: get right time!!!
                this._fLastTime = this._pTimer.getAppTime();
                this._fLastSecond = this._fLastTime;
                this._iFrameCount = 0;
            };

            RenderTarget.prototype.updateStats = function () {
                this._iFrameCount++;

                var fThisTime = this._pTimer.getAppTime();

                var fFrameTime = fThisTime - this._fLastTime;

                this._pFrameStats.time.best = akra.math.min(this._pFrameStats.time.best, fFrameTime);
                this._pFrameStats.time.worst = akra.math.min(this._pFrameStats.time.worst, fFrameTime);

                if (fThisTime - this._fLastTime > 1.) {
                    this._pFrameStats.fps.last = this._iFrameCount / (fThisTime - this._fLastSecond);

                    if (this._pFrameStats.fps.avg == 0.) {
                        this._pFrameStats.fps.avg = this._pFrameStats.fps.last;
                    } else {
                        this._pFrameStats.fps.avg = (this._pFrameStats.fps.avg + this._pFrameStats.fps.last) / 2.;

                        this._pFrameStats.fps.best = akra.math.max(this._pFrameStats.fps.best, this._pFrameStats.fps.last);
                        this._pFrameStats.fps.worst = akra.math.max(this._pFrameStats.fps.worst, this._pFrameStats.fps.last);

                        this._fLastSecond = fThisTime;
                        this._iFrameCount = 0;
                    }

                    this._fLastTime = fThisTime;
                }
            };

            RenderTarget.prototype.getCustomAttribute = function (sName) {
                return null;
            };

            RenderTarget.prototype.getViewport = function (iIndex) {
                akra.logger.assert(iIndex < this._pViewportList.length, "Index out of bounds");

                for (var i in this._pViewportList) {
                    if (iIndex--) {
                        continue;
                    }

                    return this._pViewportList[i];
                }

                return null;
            };

            RenderTarget.prototype.getViewportByZIndex = function (iZIndex) {
                var pViewport = this._pViewportList[iZIndex];

                akra.logger.assert(akra.isDefAndNotNull(pViewport), "No viewport with given z-index : " + String(iZIndex), "RenderTarget::getViewportByZIndex");

                return pViewport;
            };

            RenderTarget.prototype.hasViewportByZIndex = function (iZIndex) {
                return akra.isDefAndNotNull(this._pViewportList[iZIndex]);
            };

            RenderTarget.prototype.isActive = function () {
                return this._isActive;
            };

            RenderTarget.prototype.setActive = function (bValue) {
                if (typeof bValue === "undefined") { bValue = true; }
                this._isActive = bValue;
            };

            RenderTarget.prototype.setAutoUpdated = function (isAutoUpdate) {
                if (typeof isAutoUpdate === "undefined") { isAutoUpdate = true; }
                this._isAutoUpdate = isAutoUpdate;
            };

            RenderTarget.prototype._notifyCameraRemoved = function (pCamera) {
                var isRemoved = false;
                for (var i in this._pViewportList) {
                    var pViewport = this._pViewportList[i];

                    if (pViewport.getCamera() === pCamera) {
                        pViewport.setCamera(null);
                        isRemoved = true;
                    }
                }

                if (isRemoved) {
                    this.cameraRemoved.emit(pCamera);
                }
            };

            RenderTarget.prototype.isAutoUpdated = function () {
                return this._isAutoUpdate;
            };

            RenderTarget.prototype.isPrimary = function () {
                // RenderWindow will override and return true for the primary window
                return false;
            };

            RenderTarget.prototype.update = function () {
                this.updateImpl();
            };

            RenderTarget.prototype.readPixels = function (ppDest, eFramebuffer) {
                return null;
            };

            RenderTarget.prototype.updateImpl = function () {
                this._beginUpdate();
                this._updateAutoUpdatedViewports(true);
                this._endUpdate();
            };

            RenderTarget.NUM_RENDERTARGET_GROUPS = 10;
            RenderTarget.DEFAULT_RT_GROUP = 4;
            RenderTarget.REND_TO_TEX_RT_GROUP = 2;
            return RenderTarget;
        })();
        render.RenderTarget = RenderTarget;
    })(akra.render || (akra.render = {}));
    var render = akra.render;
})(akra || (akra = {}));
//# sourceMappingURL=RenderTarget.js.map
