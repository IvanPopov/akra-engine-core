/// <reference path="../idl/IClickable.ts" />
/// <reference path="../idl/IRenderer.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var akra;
(function (akra) {
    /// <reference path="../render/Canvas3d.ts" />
    /// <reference path="../info/info.ts" />
    /// <reference path="webgl.ts" />
    (function (webgl) {
        function absorbEvent(e) {
            e.preventDefault && e.preventDefault();
            e.stopPropagation && e.stopPropagation();
            e.cancelBubble = true;
            e.preventDefault ? e.preventDefault() : e.returnValue = false;
        }

        var WebGLCanvas = (function (_super) {
            __extends(WebGLCanvas, _super);
            function WebGLCanvas(pRenderer) {
                _super.call(this, pRenderer);
                //last viewport, that can be finded by mouse event
                //needed for simulating mouseover/mouseout events
                this._p3DEventViewportLast = null;
                this._p3DEventDragTarget = null;
                this._p3DEventMouseDownPos = { x: 0, y: 0 };
                //на сколько пикселей надо протащить курсор, чтобы сработал dragging
                this._i3DEventDragDeadZone = 2;
                this._b3DEventDragging = false;
                this._e3DEventDragBtn = 0 /* UNKNOWN */;
                //переменная нужна, для того чтобы пропустить событие клика приходящее после окончания драггинга
                //так как драггинг заканчивается вместе с событием отжатия мыши, которое в свою очередь всегда приходит раньше
                //клика
                this._b3DEventSkipNextClick = false;
                this._pCanvas = pRenderer.getHTMLCanvas();
                this._pCanvasCreationInfo = akra.info.canvas(this._pCanvas);
            }
            WebGLCanvas.prototype.setupSignals = function () {
                this.click = this.click || new akra.Signal(this);
                this.mousemove = this.mousemove || new akra.Signal(this);
                this.mousedown = this.mousedown || new akra.Signal(this);
                this.mouseup = this.mouseup || new akra.Signal(this);
                this.mouseover = this.mouseover || new akra.Signal(this);
                this.mouseout = this.mouseout || new akra.Signal(this);
                this.mousewheel = this.mousewheel || new akra.Signal(this);

                this.dragstart = this.dragstart || new akra.Signal(this);
                this.dragstop = this.dragstop || new akra.Signal(this);
                this.dragging = this.dragging || new akra.Signal(this);

                this.click.setForerunner(this._onClick);
                this.mousemove.setForerunner(this._onMousemove);
                this.mousedown.setForerunner(this._onMousedown);
                this.mouseup.setForerunner(this._onMouseup);
                this.mouseover.setForerunner(this._onMouseover);
                this.mouseout.setForerunner(this._onMouseout);
                this.mousewheel.setForerunner(this._onMousewheel);

                this.dragstart.setForerunner(this._onDragstart);
                this.dragstop.setForerunner(this._onDragstop);
                this.dragging.setForerunner(this._onDragging);

                _super.prototype.setupSignals.call(this);
            };

            WebGLCanvas.prototype.getLeft = function () {
                var el = this._pCanvas;
                for (var lx = 0; el != null; lx += el.offsetLeft, el = el.offsetParent)
                    ;
                return lx;
            };

            WebGLCanvas.prototype.setLeft = function (iLeft) {
                //TODO
            };

            WebGLCanvas.prototype.getTop = function () {
                var el = this._pCanvas;
                for (var ly = 0; el != null; ly += el.offsetTop, el = el.offsetParent)
                    ;
                return ly;
            };

            WebGLCanvas.prototype.setTop = function (iTop) {
                //TODO
            };

            WebGLCanvas.prototype.getElement = function () {
                return this._pCanvas;
            };

            WebGLCanvas.prototype.hideCursor = function (bHide) {
                if (typeof bHide === "undefined") { bHide = true; }
                if (bHide) {
                    this.getElement().style.cursor = "none";
                } else {
                    this.getElement().style.cursor = "auto";
                }
            };

            WebGLCanvas.prototype.setCursor = function (sType) {
                this.getElement().style.cursor = sType;
            };

            WebGLCanvas.prototype.create = function (sName, iWidth, iHeight, isFullscreen) {
                if (typeof sName === "undefined") { sName = null; }
                if (typeof iWidth === "undefined") { iWidth = this._pCanvasCreationInfo.width; }
                if (typeof iHeight === "undefined") { iHeight = this._pCanvasCreationInfo.height; }
                if (typeof isFullscreen === "undefined") { isFullscreen = false; }
                this.setName(sName);

                this.resize(iWidth, iHeight);
                this.setFullscreen(isFullscreen);

                return true;
            };

            WebGLCanvas.prototype.enableSupportFor3DEvent = function (iType) {
                var _this = this;
                var iActivated = _super.prototype.enableSupportFor3DEvent.call(this, iType);

                if (iActivated & 1 /* CLICK */) {
                    akra.debug.log("WebGLCanvas activate <CLICK> event handing.");
                    this.getElement().addEventListener("click", function (e) {
                        absorbEvent(e);

                        //0 --> 149, 149/150 --> 0
                        _this.click.emit(e.offsetX, _this.getHeight() - e.offsetY - 1);
                        return false;
                    }, true);
                }

                if (iActivated & 2 /* MOUSEMOVE */) {
                    akra.debug.log("WebGLCanvas activate <MOUSEMOVE> event handing.");
                    this.getElement().addEventListener("mousemove", function (e) {
                        absorbEvent(e);
                        _this.mousemove.emit(e.offsetX, _this.getHeight() - e.offsetY - 1);
                        return false;
                    }, true);
                }

                if (iActivated & 4 /* MOUSEDOWN */) {
                    akra.debug.log("WebGLCanvas activate <MOUSEDOWN> event handing.");
                    this.getElement().addEventListener("mousedown", function (e) {
                        absorbEvent(e);
                        _this.mousedown.emit(e.which, e.offsetX, _this.getHeight() - e.offsetY - 1);
                        return false;
                    }, true);
                }

                if (iActivated & 8 /* MOUSEUP */) {
                    akra.debug.log("WebGLCanvas activate <MOUSEUP> event handing.");
                    this.getElement().addEventListener("mouseup", function (e) {
                        absorbEvent(e);
                        _this.mouseup.emit(e.which, e.offsetX, _this.getHeight() - e.offsetY - 1);
                        return false;
                    }, true);
                }

                if (iActivated & 16 /* MOUSEOVER */) {
                    akra.debug.log("WebGLCanvas activate <MOUSEOVER> event handing.");
                    this.getElement().addEventListener("mouseover", function (e) {
                        absorbEvent(e);
                        _this.mouseover.emit(e.offsetX, _this.getHeight() - e.offsetY - 1);
                        return false;
                    }, true);
                }

                if (iActivated & 32 /* MOUSEOUT */) {
                    akra.debug.log("WebGLCanvas activate <MOUSEOUT> event handing.");
                    this.getElement().addEventListener("mouseout", function (e) {
                        absorbEvent(e);
                        _this.mouseout.emit(e.offsetX, _this.getHeight() - e.offsetY - 1);
                        return false;
                    }, true);
                }

                if (iActivated & 512 /* MOUSEWHEEL */) {
                    akra.debug.log("WebGLCanvas activate <MOUSEWHEEL> event handing.");
                    this.getElement().addEventListener("mousewheel", function (e) {
                        absorbEvent(e);

                        //FIXME: skipping middle button click
                        if (akra.isDef(e["wheelDeltaX"]) && e["wheelDeltaX"] > 0) {
                            // console.log("skip mouse wheel event:", e);
                            return;
                        }

                        _this.mousewheel.emit(e.offsetX, _this.getHeight() - e.offsetY - 1, e.wheelDelta);
                        return false;
                    }, true);
                }

                return iActivated;
            };

            WebGLCanvas.prototype.destroy = function () {
                _super.prototype.destroy.call(this);

                this._pCanvas = null;
                this._pCanvasCreationInfo = null;
            };

            WebGLCanvas.prototype.getCustomAttribute = function (sName) {
                return null;
            };

            WebGLCanvas.prototype.setFullscreen = function (isFullscreen) {
                if (typeof isFullscreen === "undefined") { isFullscreen = true; }
                var _this = this;
                var pCanvasElement = this._pCanvas;
                var pScreen;
                var pCanvasInfo;
                var iRealWidth = this._iRealWidth;
                var iRealHeight = this._iRealHeight;
                var pCanvas = this;

                if (this._isFullscreen === isFullscreen) {
                    return;
                }

                if (WebGLCanvas.fullscreenLock) {
                    akra.logger.warn("fullscreen is changing, do not try change before process will be ended");
                    return;
                }

                this._isFullscreen = isFullscreen;

                if (isFullscreen) {
                    iRealWidth = this._iRealWidth = this._iWidth;
                    iRealHeight = this._iRealHeight = this._iHeight;
                }

                var el = pCanvasElement, doc = document, rfs = el.requestFullScreen || el.webkitRequestFullScreen || el.mozRequestFullScreen;

                try  {
                    WebGLCanvas.fullscreenLock = true;

                    if (isFullscreen) {
                        rfs.call(el);
                    }

                    el.onfullscreenchange = el.onmozfullscreenchange = el.onwebkitfullscreenchange = el.onfullscreenchange || (function (e) {
                        if (!!(doc.webkitFullscreenElement || doc.mozFullScreenElement || doc.fullscreenElement)) {
                            pCanvas.resize(akra.info.screen.getWidth(), akra.info.screen.getHeight());
                        } else {
                            _this.setFullscreen(false);
                            pCanvas.resize(iRealWidth, iRealHeight);
                        }

                        WebGLCanvas.fullscreenLock = false;
                    });
                } catch (e) {
                    akra.logger.error("Fullscreen API not supported", e);
                    throw e;
                }
            };

            WebGLCanvas.prototype.isVisible = function () {
                return this._pCanvas.style.display !== "none";
            };

            WebGLCanvas.prototype.setVisible = function (bVisible) {
                if (typeof bVisible === "undefined") { bVisible = true; }
                this._pCanvas.style.display = bVisible ? "block" : "none";
            };

            WebGLCanvas.prototype.resize = function (iWidth, iHeight) {
                if (typeof iWidth === "undefined") { iWidth = this._iWidth; }
                if (typeof iHeight === "undefined") { iHeight = this._iHeight; }
                if (this.getWidth() === iWidth && this.getHeight() === iHeight) {
                    return;
                }

                var pCanvas = this._pCanvas;

                this._iWidth = iWidth;
                this._iHeight = iHeight;

                pCanvas.width = iWidth;
                pCanvas.height = iHeight;

                this.resized.emit(iWidth, iHeight);
            };

            WebGLCanvas.prototype.readPixels = function (ppDest, eFramebuffer) {
                if (typeof ppDest === "undefined") { ppDest = null; }
                if (typeof eFramebuffer === "undefined") { eFramebuffer = 2 /* AUTO */; }
                if (akra.isNull(ppDest)) {
                    var ePixelFormat = 10 /* BYTE_RGB */;

                    ppDest = new akra.pixelUtil.PixelBox(this._iWidth, this._iHeight, 1, ePixelFormat, new Uint8Array(akra.pixelUtil.getMemorySize(this._iWidth, this._iHeight, 1, ePixelFormat)));
                }

                if ((ppDest.right > this._iWidth) || (ppDest.bottom > this._iHeight) || (ppDest.front != 0) || (ppDest.back != 1)) {
                    akra.logger.critical("Invalid box.", "GLXWindow::copyContentsToMemory");
                }

                if (eFramebuffer == 2 /* AUTO */) {
                    eFramebuffer = this._isFullscreen ? 0 /* FRONT */ : 1 /* BACK */;
                }

                var eFormat = akra.webgl.getWebGLFormat(ppDest.format);
                var eType = akra.webgl.getWebGLDataType(ppDest.format);

                if (eFormat == 0 /* NONE */ || eType == 0) {
                    akra.logger.critical("Unsupported format.", "WebGLCanvas::readPixels");
                }

                var pWebGLRenderer = this.getRenderer();
                var pWebGLContext = pWebGLRenderer.getWebGLContext();

                pWebGLRenderer._setViewport(this.getViewport(0));
                pWebGLRenderer.bindWebGLFramebuffer(36160 /* FRAMEBUFFER */, null);

                // Must change the packing to ensure no overruns!
                pWebGLRenderer.pixelStorei(3333 /* PACK_ALIGNMENT */, 1);

                //glReadBuffer((buffer == FB_FRONT)? gl.FRONT : gl.BACK);
                // LOG("readPixels(", ppDest.left, ppDest.top, ppDest.width, ppDest.height, eFormat, eType, /*ppDest.data,*/ ")");
                pWebGLContext.readPixels(ppDest.left, ppDest.top, ppDest.getWidth(), ppDest.getHeight(), eFormat, eType, ppDest.data);

                // restore default alignment
                pWebGLRenderer.pixelStorei(3333 /* PACK_ALIGNMENT */, 4);

                //vertical flip
                // {
                // 	size_t rowSpan = dst.getWidth() * PixelUtil::getNumElemBytes(dst.format);
                // 	size_t height = dst.getHeight();
                // 	uchar *tmpData = new uchar[rowSpan * height];
                // 	uchar *srcRow = (uchar *)dst.data, *tmpRow = tmpData + (height - 1) * rowSpan;
                // 	while (tmpRow >= tmpData)
                // 	{
                // 		memcpy(tmpRow, srcRow, rowSpan);
                // 		srcRow += rowSpan;
                // 		tmpRow -= rowSpan;
                // 	}
                // 	memcpy(dst.data, tmpData, rowSpan * height);
                // 	delete [] tmpData;
                // }
                return ppDest;
            };

            WebGLCanvas.prototype.findViewportByPosition = function (x, y) {
                //propagation of click event to all viewports, that can be handle it
                var pViewport = null;

                for (var z in this._pViewportList) {
                    var pVp = this._pViewportList[z];
                    if (pVp.getActualLeft() <= x && pVp.getActualTop() <= y && pVp.getActualLeft() + pVp.getActualWidth() > x && pVp.getActualTop() + pVp.getActualHeight() > y) {
                        if (akra.isNull(pViewport) || pVp.getZIndex() > pViewport.getZIndex()) {
                            pViewport = pVp;
                        }
                    }
                }

                return pViewport;
            };

            WebGLCanvas.prototype.getViewportByMouseEvent = function (x, y) {
                var pViewportCurr = this.findViewportByPosition(x, y);
                var pViewportPrev = this._p3DEventViewportLast;

                if (pViewportPrev !== pViewportCurr) {
                    if (!akra.isNull(pViewportPrev)) {
                        pViewportPrev.mouseout.emit(x - pViewportPrev.getActualLeft(), y - pViewportPrev.getActualTop());
                    }

                    if (!akra.isNull(pViewportCurr)) {
                        pViewportCurr.mouseover.emit(x - pViewportCurr.getActualLeft(), y - pViewportCurr.getActualTop());
                    }
                }

                this._p3DEventViewportLast = pViewportCurr;

                return pViewportCurr;
            };

            WebGLCanvas.prototype._onClick = function (x, y) {
                if (this._b3DEventSkipNextClick) {
                    this._b3DEventSkipNextClick = false;
                    return;
                }

                var pViewport = this.getViewportByMouseEvent(x, y);

                if (!akra.isNull(pViewport)) {
                    pViewport.click.emit(x - pViewport.getActualLeft(), y - pViewport.getActualTop());
                }
            };

            WebGLCanvas.prototype._onMousemove = function (x, y) {
                var pViewport = this.getViewportByMouseEvent(x, y);

                if (!akra.isNull(pViewport)) {
                    pViewport.mousemove.emit(x - pViewport.getActualLeft(), y - pViewport.getActualTop());
                }

                if (this.is3DEventSupported(64 /* DRAGSTART */ | 128 /* DRAGSTOP */)) {
                    //dragging enabled
                    if (!akra.isNull(this._p3DEventDragTarget)) {
                        //drag start event not emitted
                        if (!this._b3DEventDragging && akra.math.Vec2.temp(x - this._p3DEventMouseDownPos.x, y - this._p3DEventMouseDownPos.y).length() > this._i3DEventDragDeadZone) {
                            this.dragstart.emit(this._e3DEventDragBtn, x, y);
                        } else if (this._b3DEventDragging) {
                            this.dragging.emit(this._e3DEventDragBtn, x, y);
                        }
                    }
                }
            };

            WebGLCanvas.prototype._onMousedown = function (eBtn, x, y) {
                var pViewport = this.getViewportByMouseEvent(x, y);

                this._p3DEventMouseDownPos.x = x;
                this._p3DEventMouseDownPos.y = y;

                if (!akra.isNull(pViewport)) {
                    pViewport.mousedown.emit(eBtn, x - pViewport.getActualLeft(), y - pViewport.getActualTop());
                }
                if (this.is3DEventSupported(64 /* DRAGSTART */) && this._e3DEventDragBtn === 0 /* UNKNOWN */) {
                    this._p3DEventDragTarget = pViewport;
                    this._e3DEventDragBtn = eBtn;

                    if (this._i3DEventDragDeadZone === 0) {
                        this.dragstart.emit(eBtn, x, y);
                    }
                }
            };

            WebGLCanvas.prototype._onMouseup = function (eBtn, x, y) {
                var pViewport = this.getViewportByMouseEvent(x, y);

                if (!akra.isNull(pViewport)) {
                    pViewport.mouseup.emit(eBtn, x - pViewport.getActualLeft(), y - pViewport.getActualTop());
                }

                if (this.is3DEventSupported(128 /* DRAGSTOP */) && this._e3DEventDragBtn === eBtn) {
                    if (this._b3DEventDragging) {
                        this.dragstop.emit(eBtn, x, y);
                    }

                    this._p3DEventDragTarget = null;
                    this._e3DEventDragBtn = 0 /* UNKNOWN */;
                }
            };

            WebGLCanvas.prototype._onMouseover = function (x, y) {
                var pViewport = this.getViewportByMouseEvent(x, y);

                if (!akra.isNull(pViewport)) {
                    pViewport.mouseover.emit(x - pViewport.getActualLeft(), y - pViewport.getActualTop());
                }
            };

            WebGLCanvas.prototype._onMouseout = function (x, y) {
                var pViewport = this.getViewportByMouseEvent(x, y);

                if (!akra.isNull(pViewport)) {
                    pViewport.mouseout.emit(x - pViewport.getActualLeft(), y - pViewport.getActualTop());
                }

                //stop dragging if mouse goes out of target
                if (this.is3DEventSupported(128 /* DRAGSTOP */)) {
                    this.dragstop.emit(this._e3DEventDragBtn, x, y);

                    this._p3DEventDragTarget = null;
                    this._e3DEventDragBtn = 0 /* UNKNOWN */;
                }
            };

            WebGLCanvas.prototype._onMousewheel = function (x, y, fDelta) {
                var pViewport = this.getViewportByMouseEvent(x, y);

                if (!akra.isNull(pViewport)) {
                    pViewport.mousewheel.emit(x - pViewport.getActualLeft(), y - pViewport.getActualTop(), fDelta);
                }
            };

            WebGLCanvas.prototype._onDragstart = function (eBtn, x, y) {
                this._b3DEventDragging = true;

                if (!akra.isNull(this._p3DEventDragTarget)) {
                    this._p3DEventDragTarget.dragstart.emit(eBtn, x - this._p3DEventDragTarget.getActualLeft(), y - this._p3DEventDragTarget.getActualTop());
                }
            };

            WebGLCanvas.prototype._onDragstop = function (eBtn, x, y) {
                this._b3DEventSkipNextClick = true;
                this._b3DEventDragging = false;

                if (!akra.isNull(this._p3DEventDragTarget)) {
                    this._p3DEventDragTarget.dragstop.emit(eBtn, x - this._p3DEventDragTarget.getActualLeft(), y - this._p3DEventDragTarget.getActualTop());
                }
            };

            WebGLCanvas.prototype._onDragging = function (eBtn, x, y) {
                if (!akra.isNull(this._p3DEventDragTarget)) {
                    this._p3DEventDragTarget.dragging.emit(eBtn, x - this._p3DEventDragTarget.getActualLeft(), y - this._p3DEventDragTarget.getActualTop());
                }
            };

            WebGLCanvas.fullscreenLock = false;
            return WebGLCanvas;
        })(akra.render.Canvas3d);
        webgl.WebGLCanvas = WebGLCanvas;
    })(akra.webgl || (akra.webgl = {}));
    var webgl = akra.webgl;
})(akra || (akra = {}));
//# sourceMappingURL=WebGLCanvas.js.map
