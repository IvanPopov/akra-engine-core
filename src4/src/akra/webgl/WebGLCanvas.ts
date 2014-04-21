/// <reference path="../idl/IClickable.ts" />
/// <reference path="../idl/IRenderer.ts" />

/// <reference path="../render/Canvas3d.ts" />
/// <reference path="../info/info.ts" />

/// <reference path="webgl.ts" />

module akra.webgl {

	import Vec2 = math.Vec2;

	function absorbEvent(e) {
		e.preventDefault && e.preventDefault();
		e.stopPropagation && e.stopPropagation();
		e.cancelBubble = true;
		e.preventDefault ? e.preventDefault() : e.returnValue = false;
	}

	export class WebGLCanvas extends render.Canvas3d implements IClickable {
		click: ISignal<{ (pCanvas: ICanvas3d, x: uint, y: uint): void; }>;
		mousemove: ISignal<{ (pCanvas: ICanvas3d, x: uint, y: uint): void; }>;
		mousedown: ISignal<{ (pCanvas: ICanvas3d, eBtn: EMouseButton, x: uint, y: uint): void; }>;
		mouseup: ISignal<{ (pCanvas: ICanvas3d, eBtn: EMouseButton, x: uint, y: uint): void; }>;
		mouseover: ISignal<{ (pCanvas: ICanvas3d, x: uint, y: uint): void; }>;
		mouseout: ISignal<{ (pCanvas: ICanvas3d, x: uint, y: uint): void; }>;
		mousewheel: ISignal<{ (pCanvas: ICanvas3d, x: uint, y: uint, fDelta: float): void; }>;

		dragstart: ISignal<{ (pCanvas: ICanvas3d, eBtn: EMouseButton, x: uint, y: uint): void; }>;
		dragstop: ISignal<{ (pCanvas: ICanvas3d, eBtn: EMouseButton, x: uint, y: uint): void; }>;
		dragging: ISignal<{ (pCanvas: ICanvas3d, eBtn: EMouseButton, x: uint, y: uint): void; }>;

		protected _pCanvas: HTMLCanvasElement;
		protected _pCanvasCreationInfo: ICanvasInfo;

		//display size, if fullscreen not used
		protected _iRealWidth: uint;
		protected _iRealHeight: uint;

		//last viewport, that can be finded by mouse event
		//needed for simulating mouseover/mouseout events
		protected _pUserEventViewportLast: IViewport = null;
		protected _pUserEventDragTarget: IViewport = null;
		protected _pUserEventMouseDownPos: IPoint = { x: 0, y: 0 };
		//на сколько пикселей надо протащить курсор, чтобы сработал dragging
		protected _iUserEventDragDeadZone: uint = 2;
		protected _bUserEventDragging: boolean = false;
		protected _eUserEventDragBtn: EMouseButton = EMouseButton.UNKNOWN;
		//переменная нужна, для того чтобы пропустить событие клика приходящее после окончания драггинга
		//так как драггинг заканчивается вместе с событием отжатия мыши, которое в свою очередь всегда приходит раньше 
		//клика
		protected _bUserEventSkipNextClick: boolean = false;
		//events, that already has listeners via EventTarget.addEventListener()
		protected _iUserHandledEvents: int = 0;

		constructor(pRenderer: IRenderer) {
			super(pRenderer);
			this._pCanvas = (<WebGLRenderer>pRenderer).getHTMLCanvas();
			this._pCanvasCreationInfo = info.canvas(this._pCanvas);
		}

		protected setupSignals(): void {
			this.click = this.click || new Signal(this);
			this.mousemove = this.mousemove || new Signal(this);
			this.mousedown = this.mousedown || new Signal(this);
			this.mouseup = this.mouseup || new Signal(this);
			this.mouseover = this.mouseover || new Signal(this);
			this.mouseout = this.mouseout || new Signal(this);
			this.mousewheel = this.mousewheel || new Signal(this);

			this.dragstart = this.dragstart || new Signal(this);
			this.dragstop = this.dragstop || new Signal(this);
			this.dragging = this.dragging || new Signal(this);

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

			super.setupSignals();
		}

		getLeft(): int {
			var el: HTMLElement = this._pCanvas;
			for (var lx: int = 0; el != null; lx += el.offsetLeft, el = <HTMLElement>el.offsetParent) { };
			return lx;
		}

		setLeft(iLeft: int): void {
			//TODO
		}

		getTop(): int {
			var el: HTMLElement = this._pCanvas;
			for (var ly: int = 0; el != null; ly += el.offsetTop, el = <HTMLElement>el.offsetParent) { };
			return ly;
		}

		setTop(iTop: int): void {
			//TODO
		}

		getElement(): HTMLCanvasElement {
			return this._pCanvas;
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

		/** @return TRUE if event already handled, FALSE if not handled */
		private checkOrSaveEventHandler(eType: EUserEvents): boolean {
			if (this._iUserHandledEvents & eType) return true;
			this._iUserHandledEvents = bf.setAll(this._iUserHandledEvents, eType);
			return false;
		}

		enableSupportForUserEvent(iType: int): int {

			var iActivated: int = super.enableSupportForUserEvent(iType);
			var pEl: HTMLCanvasElement = this.getElement();
			if ((iActivated & EUserEvents.CLICK) && !this.checkOrSaveEventHandler(EUserEvents.CLICK)) {
				debug.log("WebGLCanvas activate <CLICK> event handing.");
				pEl.addEventListener("click", (e: MouseEvent): boolean => {
					absorbEvent(e);
					//0 --> 149, 149/150 --> 0
					//debug.log(e.offsetX, e.offsetY);
					this.click.emit(e.offsetX, this.getHeight() - e.offsetY - 1/*, e*/);
					return false;
				}, true);
			}

			if (bf.testAny(iActivated, EUserEvents.MOUSEMOVE | EUserEvents.MOUSEOVER | EUserEvents.MOUSEOUT | EUserEvents.DRAGGING) && !this.checkOrSaveEventHandler(EUserEvents.MOUSEMOVE)) {
				debug.log("WebGLCanvas activate <MOUSEMOVE> event handing.");
				pEl.addEventListener("mousemove", (e: MouseEvent): boolean => {
					absorbEvent(e);
					this.mousemove.emit(e.offsetX, this.getHeight() - e.offsetY - 1/*, e*/);
					return false;
				}, true);
			}

			if (bf.testAny(iActivated, EUserEvents.MOUSEDOWN | EUserEvents.DRAGSTART) && !this.checkOrSaveEventHandler(EUserEvents.MOUSEDOWN)) {
				debug.log("WebGLCanvas activate <MOUSEDOWN> event handing.");
				pEl.addEventListener("mousedown", (e: MouseEvent): boolean => {
					absorbEvent(e);
					this.mousedown.emit(e.which, e.offsetX, this.getHeight() - e.offsetY - 1/*, e*/);
					return false;
				}, true);
			}

			if (bf.testAny(iActivated, EUserEvents.MOUSEUP | EUserEvents.DRAGSTOP) &&
				!this.checkOrSaveEventHandler(EUserEvents.MOUSEUP)) {
				debug.log("WebGLCanvas activate <MOUSEUP> event handing.");
				pEl.addEventListener("mouseup", (e: MouseEvent): boolean => {
					absorbEvent(e);
					this.mouseup.emit(e.which, e.offsetX, this.getHeight() - e.offsetY - 1/*, e*/);
					return false;
				}, true);
			}

			if ((iActivated & EUserEvents.MOUSEOVER) && !this.checkOrSaveEventHandler(EUserEvents.MOUSEOVER)) {
				debug.log("WebGLCanvas activate <MOUSEOVER> event handing.");
				pEl.addEventListener("mouseover", (e: MouseEvent): boolean => {
					absorbEvent(e);
					this.mouseover.emit(e.offsetX, this.getHeight() - e.offsetY - 1/*, e*/);
					return false;
				}, true);
			}

			if ((iActivated & EUserEvents.MOUSEOUT) && !this.checkOrSaveEventHandler(EUserEvents.MOUSEOUT)) {
				debug.log("WebGLCanvas activate <MOUSEOUT> event handing.");
				pEl.addEventListener("mouseout", (e: MouseEvent): boolean => {
					absorbEvent(e);
					this.mouseout.emit(e.offsetX, this.getHeight() - e.offsetY - 1/*, e*/);
					return false;
				}, true);
			}

			if ((iActivated & EUserEvents.MOUSEWHEEL) && !this.checkOrSaveEventHandler(EUserEvents.MOUSEWHEEL)) {
				debug.log("WebGLCanvas activate <MOUSEWHEEL> event handing.");
				pEl.addEventListener("mousewheel", (e: MouseWheelEvent): boolean => {
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

			//finding top viewport, that contains (x, y) point.
			for (var z in this._pViewportList) {
				var pVp: IViewport = this._pViewportList[z];
				if (pVp.getActualLeft() <= x && pVp.getActualTop() <= y &&
					pVp.getActualLeft() + pVp.getActualWidth() > x && pVp.getActualTop() + pVp.getActualHeight() > y) {
					if (isNull(pViewport) || pVp.getZIndex() > pViewport.getZIndex()) {

						if (!pVp.isUserEventSupported(EUserEvents.ANY)) {
							debug.log("Dropping the viewport, by virtue of his lack of support for 3D events.", pViewport);
							continue;
						}

						pViewport = pVp;
					}
				}
			}

			return pViewport;
		}

		private getViewportByMouseEvent(x: uint, y: uint): IViewport {
			var pViewportCurr: IViewport = this.findViewportByPosition(x, y);
			var pViewportPrev: IViewport = this._pUserEventViewportLast;

			if (pViewportPrev !== pViewportCurr) {
				if (!isNull(pViewportPrev) && pViewportPrev.isUserEventSupported(EUserEvents.MOUSEOUT)) {
					pViewportPrev.mouseout.emit(x - pViewportPrev.getActualLeft(), y - pViewportPrev.getActualTop());
				}

				if (!isNull(pViewportCurr) && pViewportCurr.isUserEventSupported(EUserEvents.MOUSEOVER)) {
					pViewportCurr.mouseover.emit(x - pViewportCurr.getActualLeft(), y - pViewportCurr.getActualTop());
				}
			}

			this._pUserEventViewportLast = pViewportCurr;

			return pViewportCurr;
		}

		protected _onClick(x: uint, y: uint): void {
			if (this._bUserEventSkipNextClick) {
				this._bUserEventSkipNextClick = false;
				return;
			}

			var pViewport: IViewport = this.getViewportByMouseEvent(x, y);

			if (!isNull(pViewport) && pViewport.isUserEventSupported(EUserEvents.CLICK)) {
				pViewport.click.emit(x - pViewport.getActualLeft(), y - pViewport.getActualTop());
			}
		}

		protected _onMousemove(x: uint, y: uint): void {
			var pViewport: IViewport = this.getViewportByMouseEvent(x, y);
			if (this.isUserEventSupported(EUserEvents.MOUSEMOVE | EUserEvents.MOUSEOVER | EUserEvents.MOUSEOUT)) {
				if (!isNull(pViewport) &&
					pViewport.isUserEventSupported(EUserEvents.MOUSEMOVE | EUserEvents.MOUSEOUT | EUserEvents.MOUSEOVER)) {
					pViewport.mousemove.emit(x - pViewport.getActualLeft(), y - pViewport.getActualTop());
				}
			}

			//dragging enabled
			if (!isNull(this._pUserEventDragTarget)) {
				if (this._bUserEventDragging) {
					if (this.isUserEventSupported(EUserEvents.DRAGGING)) {
						this.dragging.emit(this._eUserEventDragBtn, x, y);
					}
				}
				else 
				//drag start event not emitted
				if (
					//mouse shift from mousedown point greather than drag dead zone constant
					Vec2.temp(x - this._pUserEventMouseDownPos.x, y - this._pUserEventMouseDownPos.y).length() > this._iUserEventDragDeadZone) {
					if (this.isUserEventSupported(EUserEvents.DRAGSTART)) {
						this.dragstart.emit(this._eUserEventDragBtn, x, y);
					}
				}
			}

		}

		protected _onMousedown(eBtn: EMouseButton, x: uint, y: uint): void {
			var pViewport: IViewport = this.getViewportByMouseEvent(x, y);

			this._pUserEventMouseDownPos.x = x;
			this._pUserEventMouseDownPos.y = y;

			if (this.isUserEventSupported(EUserEvents.MOUSEDOWN)) {
				if (!isNull(pViewport) && pViewport.isUserEventSupported(EUserEvents.MOUSEDOWN)) {
					pViewport.mousedown.emit(eBtn, x - pViewport.getActualLeft(), y - pViewport.getActualTop());
				}
			}

			if (this.isUserEventSupported(EUserEvents.DRAGSTART)
				&& this._eUserEventDragBtn === EMouseButton.UNKNOWN) {
				//only for viewport with drag events
				if (pViewport.isUserEventSupported(EUserEvents.DRAGSTART)) {
					this._pUserEventDragTarget = pViewport;
				}
				else {
					this._pUserEventDragTarget = null;
				}

				this._eUserEventDragBtn = eBtn;

				if (this._iUserEventDragDeadZone === 0) {
					this.dragstart.emit(eBtn, x, y);
				}
			}
		}

		protected _onMouseup(eBtn: EMouseButton, x: uint, y: uint): void {
			var pViewport: IViewport = this.getViewportByMouseEvent(x, y);

			if (!isNull(pViewport) && pViewport.isUserEventSupported(EUserEvents.MOUSEUP)) {
				pViewport.mouseup.emit(eBtn, x - pViewport.getActualLeft(), y - pViewport.getActualTop());
			}

			if (this.isUserEventSupported(EUserEvents.DRAGSTOP) &&
				this._eUserEventDragBtn === eBtn) {

				if (this._bUserEventDragging) {
					this.dragstop.emit(eBtn, x, y);
				}

				this._pUserEventDragTarget = null;
				this._eUserEventDragBtn = EMouseButton.UNKNOWN;
			}
		}

		protected _onMouseover(x: uint, y: uint): void {
			//mouseover event will be sended automaticli insine getViewportByMouseEvent() function.
			var pViewport: IViewport = this.getViewportByMouseEvent(x, y);
		}

		protected _onMouseout(x: uint, y: uint): void {
			//mouseout event will be sended automaticli insine getViewportByMouseEvent() function.
			var pViewport: IViewport = this.getViewportByMouseEvent(x, y);

			//stop dragging if mouse goes out of target
			if (this.isUserEventSupported(EUserEvents.DRAGSTOP)) {
				this.dragstop.emit(this._eUserEventDragBtn, x, y);

				this._pUserEventDragTarget = null;
				this._eUserEventDragBtn = EMouseButton.UNKNOWN;
			}
		}

		protected _onMousewheel(x: uint, y: uint, fDelta: float): void {
			var pViewport: IViewport = this.getViewportByMouseEvent(x, y);

			if (!isNull(pViewport) && pViewport.isUserEventSupported(EUserEvents.MOUSEWHEEL)) {
				pViewport.mousewheel.emit(x - pViewport.getActualLeft(), y - pViewport.getActualTop(), fDelta);
			}
		}

		protected _onDragstart(eBtn: EMouseButton, x: uint, y: uint): void {
			this._bUserEventDragging = true;

			if (!isNull(this._pUserEventDragTarget)) {
				this._pUserEventDragTarget.dragstart.emit(
					eBtn,
					x - this._pUserEventDragTarget.getActualLeft(),
					y - this._pUserEventDragTarget.getActualTop());
			}
		}

		protected _onDragstop(eBtn: EMouseButton, x: uint, y: uint): void {
			this._bUserEventSkipNextClick = true;
			this._bUserEventDragging = false;

			if (!isNull(this._pUserEventDragTarget)) {
				this._pUserEventDragTarget.dragstop.emit(
					eBtn,
					x - this._pUserEventDragTarget.getActualLeft(),
					y - this._pUserEventDragTarget.getActualTop());
			}
		}

		protected _onDragging(eBtn: EMouseButton, x: uint, y: uint): void {
			if (!isNull(this._pUserEventDragTarget) &&
				this._pUserEventDragTarget.isUserEventSupported(EUserEvents.DRAGGING)) {
				this._pUserEventDragTarget.dragging.emit(
					eBtn,
					x - this._pUserEventDragTarget.getActualLeft(),
					y - this._pUserEventDragTarget.getActualTop());
			}
		}

		static fullscreenLock: boolean = false;
	}
}
