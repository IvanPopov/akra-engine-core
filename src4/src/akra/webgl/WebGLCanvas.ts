/// <reference path="../idl/IClickable.ts" />
/// <reference path="../idl/IRenderer.ts" />

/// <reference path="../render/Canvas3d.ts" />
/// <reference path="../info/info.ts" />

/// <reference path="webgl.ts" />

module akra.webgl {

	function absorbEvent(e) {
		e.preventDefault && e.preventDefault();
		e.stopPropagation && e.stopPropagation();
		e.cancelBubble = true;
		e.returnValue = false;
	}

	export class WebGLCanvas extends render.Canvas3d implements IClickable {
		click: ISignal<{ (pCanvas: ICanvas3d, x: uint, y: uint): void; }> = new Signal(<any>this, this._onClick);
		mousemove: ISignal<{ (pCanvas: ICanvas3d, x: uint, y: uint): void; }> = new Signal(<any>this, this._onMousemove);
		mousedown: ISignal<{ (pCanvas: ICanvas3d, eBtn: EMouseButton, x: uint, y: uint): void; }> = new Signal(<any>this, this._onMousedown);
		mouseup: ISignal<{ (pCanvas: ICanvas3d, eBtn: EMouseButton, x: uint, y: uint): void; }> = new Signal(<any>this, this._onMouseup);
		mouseover: ISignal<{ (pCanvas: ICanvas3d, x: uint, y: uint): void; }> = new Signal(<any>this, this._onMouseover);
		mouseout: ISignal<{ (pCanvas: ICanvas3d, x: uint, y: uint): void; }> = new Signal(<any>this, this._onMouseout);
		mousewheel: ISignal<{ (pCanvas: ICanvas3d, x: uint, y: uint, fDelta: float): void; }> = new Signal(<any>this, this._onMousewheel);

		dragstart: ISignal<{ (pCanvas: ICanvas3d, eBtn: EMouseButton, x: uint, y: uint): void; }> = new Signal(<any>this, this._onDragstart);
		dragstop: ISignal<{ (pCanvas: ICanvas3d, eBtn: EMouseButton, x: uint, y: uint): void; }> = new Signal(<any>this, this._onDragstop);
		dragging: ISignal<{ (pCanvas: ICanvas3d, eBtn: EMouseButton, x: uint, y: uint): void; }> = new Signal(<any>this, this._onDragging);

		protected _pCanvas: HTMLCanvasElement;
		protected _pCanvasCreationInfo: ICanvasInfo;

		//display size, if fullscreen not used
		protected _iRealWidth: uint;
		protected _iRealHeight: uint;

		//last viewport, that can be finded by mouse event
		//needed for simulating mouseover/mouseout events
		protected _p3DEventViewportLast: IViewport = null;
		protected _p3DEventDragTarget: IViewport = null;
		protected _p3DEventMouseDownPos: IPoint = { x: 0, y: 0 };
		//на сколько пикселей надо протащить курсор, чтобы сработал dragging
		protected _i3DEventDragDeadZone: uint = 2;
		protected _b3DEventDragging: boolean = false;
		protected _e3DEventDragBtn: EMouseButton = EMouseButton.UNKNOWN;
		//переменная нужна, для того чтобы пропустить событие клика приходящее после окончания драггинга
		//так как драггинг заканчивается вместе с событием отжатия мыши, которое в свою очередь всегда приходит раньше 
		//клика
		protected _b3DEventSkipNextClick: boolean = false;

		getLeft(): int {
			var el: HTMLElement = this._pCanvas;
			for (var lx: int = 0; el != null; lx += el.offsetLeft, el = <HTMLElement>el.offsetParent);
			return lx;
		}

		setLeft(iLeft: int): void {
			//TODO
		}

		getTop(): int {
			var el: HTMLElement = this._pCanvas;
			for (var ly: int = 0; el != null; ly += el.offsetTop, el = <HTMLElement>el.offsetParent);
			return ly;
		}

		setTop(iTop: int): void {
			//TODO
		}

		getElement(): HTMLCanvasElement {
			return this._pCanvas;
		}

		constructor(pRenderer: IRenderer) {
			super(pRenderer);
			this._pCanvas = (<WebGLRenderer>pRenderer).getHTMLCanvas();
			this._pCanvasCreationInfo = info.canvas(this._pCanvas);
		}

		hideCursor(bHide: boolean = true): void {
			if (bHide) {
				this.getElement().style.cursor = "none";
			}
			else {
				this.getElement().style.cursor = "auto";
			}
		}

		setCursor(sType: string): void {
			this.getElement().style.cursor = sType;
		}

		create(sName: string = null, iWidth: uint = this._pCanvasCreationInfo.width,
			iHeight: uint = this._pCanvasCreationInfo.height, isFullscreen: boolean = false): boolean {

			this.setName(sName);

			this.resize(iWidth, iHeight);
			this.setFullscreen(isFullscreen);

			return true;
		}


		enableSupportFor3DEvent(iType: int): int {

			var iActivated: int = super.enableSupportFor3DEvent(iType);

			if (iActivated & E3DEventTypes.CLICK) {
				debug.log("WebGLCanvas activate <CLICK> event handing");
				this.getElement().addEventListener("click", (e: MouseEvent): boolean => {
					absorbEvent(e);
					//0 --> 149, 149/150 --> 0
					this.click.emit(e.offsetX, this.getHeight() - e.offsetY - 1/*, e*/);
					return false;
				}, true);
			}

			if (iActivated & E3DEventTypes.MOUSEMOVE) {
				debug.log("WebGLCanvas activate <MOUSEMOVE> event handing");
				this.getElement().addEventListener("mousemove", (e: MouseEvent): boolean => {
					absorbEvent(e);
					this.mousemove.emit(e.offsetX, this.getHeight() - e.offsetY - 1/*, e*/);
					return false;
				}, true);
			}

			if (iActivated & E3DEventTypes.MOUSEDOWN) {
				debug.log("WebGLCanvas activate <MOUSEDOWN> event handing");
				this.getElement().addEventListener("mousedown", (e: MouseEvent): boolean => {
					absorbEvent(e);
					this.mousedown.emit(e.which, e.offsetX, this.getHeight() - e.offsetY - 1/*, e*/);
					return false;
				}, true);
			}

			if (iActivated & E3DEventTypes.MOUSEUP) {
				debug.log("WebGLCanvas activate <MOUSEUP> event handing");
				this.getElement().addEventListener("mouseup", (e: MouseEvent): boolean => {
					absorbEvent(e);
					this.mouseup.emit(e.which, e.offsetX, this.getHeight() - e.offsetY - 1/*, e*/);
					return false;
				}, true);
			}

			if (iActivated & E3DEventTypes.MOUSEOVER) {
				debug.log("WebGLCanvas activate <MOUSEOVER> event handing");
				this.getElement().addEventListener("mouseover", (e: MouseEvent): boolean => {
					absorbEvent(e);
					this.mouseover.emit(e.offsetX, this.getHeight() - e.offsetY - 1/*, e*/);
					return false;
				}, true);
			}

			if (iActivated & E3DEventTypes.MOUSEOUT) {
				debug.log("WebGLCanvas activate <MOUSEOUT> event handing");
				this.getElement().addEventListener("mouseout", (e: MouseEvent): boolean => {
					absorbEvent(e);
					this.mouseout.emit(e.offsetX, this.getHeight() - e.offsetY - 1/*, e*/);
					return false;
				}, true);
			}

			if (iActivated & E3DEventTypes.MOUSEWHEEL) {
				debug.log("WebGLCanvas activate <MOUSEWHEEL> event handing");
				this.getElement().addEventListener("mousewheel", (e: MouseWheelEvent): boolean => {
					absorbEvent(e);

					//FIXME: skipping middle button click
					if (isDef(e["wheelDeltaX"]) && e["wheelDeltaX"] > 0) {
						// console.log("skip mouse wheel event:", e);
						return;
					}

					this.mousewheel.emit(e.offsetX, this.getHeight() - e.offsetY - 1, e.wheelDelta/*, e*/);
					return false;
				}, true);
			}

			return iActivated;
		}


		destroy(): void {
			super.destroy();

			this._pCanvas = null;
			this._pCanvasCreationInfo = null;
		}

		getCustomAttribute(sName: string): any {
			return null;
		}

		setFullscreen(isFullscreen: boolean = true): void {
			var pCanvasElement: HTMLCanvasElement = this._pCanvas;
			var pScreen: IScreenInfo;
			var pCanvasInfo: ICanvasInfo;
			var iRealWidth: uint = this._iRealWidth;
			var iRealHeight: uint = this._iRealHeight;
			var pCanvas: WebGLCanvas = this;

			if (this._isFullscreen === isFullscreen) {
				return;
			}

			if (WebGLCanvas.fullscreenLock) {
				logger.warn("fullscreen is changing, do not try change before process will be ended");
				return;
			}

			this._isFullscreen = isFullscreen;

			if (isFullscreen) {
				iRealWidth = this._iRealWidth = this._iWidth;
				iRealHeight = this._iRealHeight = this._iHeight;
			}

			var el: any = pCanvasElement,
				doc: any = document,
				rfs =
				el.requestFullScreen
				|| el.webkitRequestFullScreen
				|| el.mozRequestFullScreen

			try {
				WebGLCanvas.fullscreenLock = true;

				if (isFullscreen) {
					rfs.call(el);
				}

				el.onfullscreenchange =
				el.onmozfullscreenchange =
				el.onwebkitfullscreenchange = el.onfullscreenchange || ((e): void => {

					if (!!(doc.webkitFullscreenElement ||
						doc.mozFullScreenElement ||
						doc.fullscreenElement)) {
						pCanvas.resize(info.screen.getWidth(), info.screen.getHeight());
					}
					else {
						this.setFullscreen(false);
						pCanvas.resize(iRealWidth, iRealHeight);
					}

					WebGLCanvas.fullscreenLock = false;
				});
			}
			catch (e) {
				logger.error("Fullscreen API not supported", e);
				throw e;
			}
		}


		isVisible(): boolean { return this._pCanvas.style.display !== "none"; }

		setVisible(bVisible: boolean = true): void {
			this._pCanvas.style.display = bVisible ? "block" : "none";
		}

		resize(iWidth: uint = this._iWidth, iHeight: uint = this._iHeight): void {
			if (this.getWidth() === iWidth && this.getHeight() === iHeight) {
				return;
			}

			var pCanvas: HTMLCanvasElement = this._pCanvas;

			this._iWidth = iWidth;
			this._iHeight = iHeight;

			pCanvas.width = iWidth;
			pCanvas.height = iHeight;

			this.resized.emit(iWidth, iHeight);
		}

		readPixels(ppDest: IPixelBox = null, eFramebuffer: EFramebuffer = EFramebuffer.AUTO): IPixelBox {
			if (isNull(ppDest)) {
				var ePixelFormat: EPixelFormats = EPixelFormats.BYTE_RGB;

				ppDest = new pixelUtil.PixelBox(this._iWidth, this._iHeight, 1, ePixelFormat,
					new Uint8Array(pixelUtil.getMemorySize(this._iWidth, this._iHeight, 1, ePixelFormat)));
			}

			if ((ppDest.right > this._iWidth) || (ppDest.bottom > this._iHeight) || (ppDest.front != 0) || (ppDest.back != 1)) {
				logger.critical("Invalid box.", "GLXWindow::copyContentsToMemory");
			}

			if (eFramebuffer == EFramebuffer.AUTO) {
				eFramebuffer = this._isFullscreen ? EFramebuffer.FRONT : EFramebuffer.BACK;
			}

			var eFormat: int = getWebGLFormat(ppDest.format);
			var eType: int = getWebGLDataType(ppDest.format);

			if (eFormat == gl.NONE || eType == 0) {
				logger.critical("Unsupported format.", "WebGLCanvas::readPixels");
			}

			var pWebGLRenderer: WebGLRenderer = <WebGLRenderer>this.getRenderer();
			var pWebGLContext: WebGLRenderingContext = pWebGLRenderer.getWebGLContext();

			pWebGLRenderer._setViewport(this.getViewport(0));
			pWebGLRenderer.bindWebGLFramebuffer(gl.FRAMEBUFFER, null);

			// Must change the packing to ensure no overruns!
			pWebGLRenderer.pixelStorei(gl.PACK_ALIGNMENT, 1);

			//glReadBuffer((buffer == FB_FRONT)? gl.FRONT : gl.BACK);
			// LOG("readPixels(", ppDest.left, ppDest.top, ppDest.width, ppDest.height, eFormat, eType, /*ppDest.data,*/ ")");
			pWebGLContext.readPixels(ppDest.left, ppDest.top, ppDest.getWidth(), ppDest.getHeight(), eFormat, eType, ppDest.data);

			// restore default alignment
			pWebGLRenderer.pixelStorei(gl.PACK_ALIGNMENT, 4);

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
		}


		private findViewportByPosition(x: uint, y: uint): IViewport {
			//propagation of click event to all viewports, that can be handle it
			var pViewport: IViewport = null;

			//finding top viewport, taht contains (x, y) point.
			for (var z in this._pViewportList) {
				var pVp: IViewport = this._pViewportList[z];
				if (pVp.getActualLeft() <= x && pVp.getActualTop() <= y &&
					pVp.getActualLeft() + pVp.getActualWidth() > x && pVp.getActualTop() + pVp.getActualHeight() > y) {
					if (isNull(pViewport) || pVp.getZIndex() > pViewport.getZIndex()) {
						pViewport = pVp;
					}
				}
			}

			return pViewport;
		}

		private getViewportByMouseEvent(x: uint, y: uint): IViewport {
			var pViewportCurr: IViewport = this.findViewportByPosition(x, y);
			var pViewportPrev: IViewport = this._p3DEventViewportLast;

			if (pViewportPrev !== pViewportCurr) {
				if (!isNull(pViewportPrev)) {
					pViewportPrev.mouseout.emit(x - pViewportPrev.getActualLeft(), y - pViewportPrev.getActualTop());
				}

				if (!isNull(pViewportCurr)) {
					pViewportCurr.mouseover.emit(x - pViewportCurr.getActualLeft(), y - pViewportCurr.getActualTop());
				}
			}

			this._p3DEventViewportLast = pViewportCurr;

			return pViewportCurr;
		}

		protected _onClick(x: uint, y: uint): void {
			if (this._b3DEventSkipNextClick) {
				this._b3DEventSkipNextClick = false;
				return;
			}

			var pViewport: IViewport = this.getViewportByMouseEvent(x, y);

			if (!isNull(pViewport)) {
				pViewport.click.emit(x - pViewport.getActualLeft(), y - pViewport.getActualTop());
			}
		}

		protected _onMousemove(x: uint, y: uint): void {
			var pViewport: IViewport = this.getViewportByMouseEvent(x, y);

			if (!isNull(pViewport)) {
				pViewport.mousemove.emit(x - pViewport.getActualLeft(), y - pViewport.getActualTop());
			}

			if (this.is3DEventSupported(E3DEventTypes.DRAGSTART | E3DEventTypes.DRAGSTOP)) {
				//dragging enabled
				if (!isNull(this._p3DEventDragTarget)) {
					//drag start event not emitted
					if (!this._b3DEventDragging &&
						//mouse shift from mousedown point greather than drag dead zone constant
						math.Vec2.temp(x - this._p3DEventMouseDownPos.x, y - this._p3DEventMouseDownPos.y).length() > this._i3DEventDragDeadZone) {
						this.dragstart.emit(this._e3DEventDragBtn, x, y);
					}
					else if (this._b3DEventDragging) {
						this.dragging.emit(this._e3DEventDragBtn, x, y);
					}
				}
			}
		}

		protected _onMousedown(eBtn: EMouseButton, x: uint, y: uint): void {
			var pViewport: IViewport = this.getViewportByMouseEvent(x, y);

			this._p3DEventMouseDownPos.x = x;
			this._p3DEventMouseDownPos.y = y;

			if (!isNull(pViewport)) {
				pViewport.mousedown.emit(eBtn, x - pViewport.getActualLeft(), y - pViewport.getActualTop());
			}
			if (this.is3DEventSupported(E3DEventTypes.DRAGSTART)
				&& this._e3DEventDragBtn === EMouseButton.UNKNOWN) {
				this._p3DEventDragTarget = pViewport;
				this._e3DEventDragBtn = eBtn;

				if (this._i3DEventDragDeadZone === 0) {
					this.dragstart.emit(eBtn, x, y);
				}
			}
		}

		protected _onMouseup(eBtn: EMouseButton, x: uint, y: uint): void {
			var pViewport: IViewport = this.getViewportByMouseEvent(x, y);

			if (!isNull(pViewport)) {
				pViewport.mouseup.emit(eBtn, x - pViewport.getActualLeft(), y - pViewport.getActualTop());
			}

			if (this.is3DEventSupported(E3DEventTypes.DRAGSTOP) &&
				this._e3DEventDragBtn === eBtn) {

				if (this._b3DEventDragging) {
					this.dragstop.emit(eBtn, x, y);
				}

				this._p3DEventDragTarget = null;
				this._e3DEventDragBtn = EMouseButton.UNKNOWN;
			}
		}

		protected _onMouseover(x: uint, y: uint): void {
			var pViewport: IViewport = this.getViewportByMouseEvent(x, y);

			if (!isNull(pViewport)) {
				pViewport.mouseover.emit(x - pViewport.getActualLeft(), y - pViewport.getActualTop());
			}
		}

		protected _onMouseout(x: uint, y: uint): void {
			var pViewport: IViewport = this.getViewportByMouseEvent(x, y);

			if (!isNull(pViewport)) {
				pViewport.mouseout.emit(x - pViewport.getActualLeft(), y - pViewport.getActualTop());
			}

			//stop dragging if mouse goes out of target
			if (this.is3DEventSupported(E3DEventTypes.DRAGSTOP)) {
				this.dragstop.emit(this._e3DEventDragBtn, x, y);

				this._p3DEventDragTarget = null;
				this._e3DEventDragBtn = EMouseButton.UNKNOWN;
			}
		}

		protected _onMousewheel(x: uint, y: uint, fDelta: float): void {
			var pViewport: IViewport = this.getViewportByMouseEvent(x, y);

			if (!isNull(pViewport)) {
				pViewport.mousewheel.emit(x - pViewport.getActualLeft(), y - pViewport.getActualTop(), fDelta);
			}
		}

		protected _onDragstart(eBtn: EMouseButton, x: uint, y: uint): void {
			this._b3DEventDragging = true;

			if (!isNull(this._p3DEventDragTarget)) {
				this._p3DEventDragTarget.dragstart.emit(
					eBtn,
					x - this._p3DEventDragTarget.getActualLeft(),
					y - this._p3DEventDragTarget.getActualTop());
			}
		}

		protected _onDragstop(eBtn: EMouseButton, x: uint, y: uint): void {
			this._b3DEventSkipNextClick = true;
			this._b3DEventDragging = false;

			if (!isNull(this._p3DEventDragTarget)) {
				this._p3DEventDragTarget.dragstop.emit(
					eBtn,
					x - this._p3DEventDragTarget.getActualLeft(),
					y - this._p3DEventDragTarget.getActualTop());
			}
		}

		protected _onDragging(eBtn: EMouseButton, x: uint, y: uint): void {
			if (!isNull(this._p3DEventDragTarget)) {
				this._p3DEventDragTarget.dragging.emit(
					eBtn,
					x - this._p3DEventDragTarget.getActualLeft(),
					y - this._p3DEventDragTarget.getActualTop());
			}
		}

		static fullscreenLock: boolean = false;
	}
}
