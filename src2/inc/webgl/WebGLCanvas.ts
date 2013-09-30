#ifndef WEBGLCANVAS_TS
#define WEBGLCANVAS_TS

#include "IClickable.ts"

#include "render/Canvas3d.ts"
#include "info/info.ts"
#include "IRenderer.ts"
#include "webgl.ts"

module akra.webgl {

	function absorbEvent(e) {
		e.preventDefault && e.preventDefault();
		e.stopPropagation && e.stopPropagation();
		e.cancelBubble = true;
		e.returnValue = false;
    }

	export class WebGLCanvas extends render.Canvas3d implements IClickable {
		protected _pCanvas: HTMLCanvasElement;
		protected _pCanvasCreationInfo: ICanvasInfo;

		//display size, if fullscreen not used
		protected _iRealWidth: uint;
		protected _iRealHeight: uint;

		//last viewport, that can be finded by mouse event
		//needed for simulating mouseover/mouseout events
		protected _p3DEventViewportLast: IViewport = null;
		protected _p3DEventDragTarget: IViewport = null;
		protected _p3DEventMouseDownPos: IPoint = {x: 0, y: 0};
		//на сколько пикселей надо протащить курсор, чтобы сработал dragging
		protected _i3DEventDragDeadZone: uint = 2;
		protected _b3DEventDragging: bool = false;
		protected _e3DEventDragBtn: EMouseButton = EMouseButton.UNKNOWN;
		//переменная нужна, для того чтобы пропустить событие клика приходящее после окончания драггинга
		//так как драггинг заканчивается вместе с событием отжатия мыши, которое в свою очередь всегда приходит раньше 
		//клика
		protected _b3DEventSkipNextClick: bool = false;



		get left(): int {
			var el: HTMLElement = this._pCanvas;
			for (var lx: int = 0; el != null; lx += el.offsetLeft, el = <HTMLElement>el.offsetParent);
			return lx;
		}

		get top(): int {
			var el: HTMLElement = this._pCanvas;
			for (var ly: int = 0; el != null; ly += el.offsetTop, el = <HTMLElement>el.offsetParent);
			return ly;
		}

		set left(x: int) {
			//TODO
		}

		set top(x: int) {
			//TODO
		}

		inline get el(): HTMLCanvasElement { return this._pCanvas; }

		constructor (pRenderer: IRenderer) {
			super(pRenderer);
			this._pCanvas = (<any>pRenderer).getHTMLCanvas();
			this._pCanvasCreationInfo = info.canvas(this._pCanvas);
		}

		hideCursor(bHide: bool = true): void {
			if (bHide) {
				this.el.style.cursor = "none";
			}
			else {
				this.el.style.cursor = "auto";
			}
		}

		setCursor(sType: string): void {
			this.el.style.cursor = sType;
		}

		create(sName: string = null, iWidth: uint = this._pCanvasCreationInfo.width, 
				iHeight: uint = this._pCanvasCreationInfo.height, isFullscreen: bool = false): bool {
			
			this.name = sName;

			this.resize(iWidth, iHeight);
			this.setFullscreen(isFullscreen);

			return true;
		}


		enableSupportFor3DEvent(iType: int): int {
			
			var iActivated: int = super.enableSupportFor3DEvent(iType);

			if (iActivated & E3DEventTypes.CLICK) {
				debug_print("WebGLCanvas activate <CLICK> event handing");
				this.el.addEventListener("click", (e: MouseEvent): bool => {
					absorbEvent(e);
					//0 --> 149, 149/150 --> 0
					this.click(e.offsetX, this.height - e.offsetY - 1/*, e*/);
					return false;
				}, true);
			}

			if (iActivated & E3DEventTypes.MOUSEMOVE) {
				debug_print("WebGLCanvas activate <MOUSEMOVE> event handing");
				this.el.addEventListener("mousemove", (e: MouseEvent): bool => {
					absorbEvent(e);
					this.mousemove(e.offsetX, this.height - e.offsetY - 1/*, e*/);
					return false;
				}, true);
			}

			if (iActivated & E3DEventTypes.MOUSEDOWN) {
				debug_print("WebGLCanvas activate <MOUSEDOWN> event handing");
				this.el.addEventListener("mousedown", (e: MouseEvent): bool => {
					absorbEvent(e);
					this.mousedown(e.which, e.offsetX, this.height - e.offsetY - 1/*, e*/);
					return false;
				}, true);
			}

			if (iActivated & E3DEventTypes.MOUSEUP) {
				debug_print("WebGLCanvas activate <MOUSEUP> event handing");
				this.el.addEventListener("mouseup", (e: MouseEvent): bool => {
					absorbEvent(e);
					this.mouseup(e.which, e.offsetX, this.height - e.offsetY - 1/*, e*/);
					return false;
				}, true);
			}

			if (iActivated & E3DEventTypes.MOUSEOVER) {
				debug_print("WebGLCanvas activate <MOUSEOVER> event handing");
				this.el.addEventListener("mouseover", (e: MouseEvent): bool => {
					absorbEvent(e);
					this.mouseover(e.offsetX, this.height - e.offsetY - 1/*, e*/);
					return false;
				}, true);
			}

			if (iActivated & E3DEventTypes.MOUSEOUT) {
				debug_print("WebGLCanvas activate <MOUSEOUT> event handing");
				this.el.addEventListener("mouseout", (e: MouseEvent): bool => {
					absorbEvent(e);
					this.mouseout(e.offsetX, this.height - e.offsetY - 1/*, e*/);
					return false;
				}, true);
			}

			if (iActivated & E3DEventTypes.MOUSEWHEEL) {
				debug_print("WebGLCanvas activate <MOUSEWHEEL> event handing");
				this.el.addEventListener("mousewheel", (e: MouseWheelEvent): bool => {
					absorbEvent(e);

					//FIXME: skipping middle button click
					if (isDef(e["wheelDeltaX"]) && e["wheelDeltaX"] > 0) {
						// console.log("skip mouse wheel event:", e);
						return;
					}

					this.mousewheel(e.offsetX, this.height - e.offsetY - 1, e.wheelDelta/*, e*/);
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

		setFullscreen(isFullscreen: bool = true): void  {
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
				WARNING("fullscreen is changing, do not try change before process will be ended");
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
				el.onwebkitfullscreenchange = el.onfullscreenchange || (e) => {

					if (!!( doc.webkitFullscreenElement || 
							doc.mozFullScreenElement || 
							doc.fullscreenElement)) {
						pCanvas.resize(info.screen.width, info.screen.height);
					}
					else {
						this.setFullscreen(false);
						pCanvas.resize(iRealWidth, iRealHeight);
					}

					WebGLCanvas.fullscreenLock = false;
				}
			}
			catch (e) {
				ERROR("Fullscreen API not supported", e);
				throw e;
			}
		}


		inline isVisible(): bool { return this._pCanvas.style.display !== "none"; }

		setVisible(bVisible: bool = true): void {
			this._pCanvas.style.display = bVisible? "block": "none";
		}

		resize(iWidth: uint = this._iWidth, iHeight: uint = this._iHeight): void {
			if (this.width === iWidth && this.height === iHeight) {
				return;
			}

			var pCanvas: HTMLCanvasElement = this._pCanvas;	

			this._iWidth = iWidth;
			this._iHeight = iHeight;

			pCanvas.width = iWidth;
			pCanvas.height = iHeight;

			this.resized(iWidth, iHeight);
		}

		readPixels(ppDest: IPixelBox = null, eFramebuffer: EFramebuffer = EFramebuffer.AUTO): IPixelBox {
			if (isNull(ppDest)) {
				var ePixelFormat: EPixelFormats = EPixelFormats.BYTE_RGB;

				ppDest = new pixelUtil.PixelBox(this._iWidth, this._iHeight, 1, ePixelFormat, 
					new Uint8Array(pixelUtil.getMemorySize(this._iWidth, this._iHeight, 1, ePixelFormat)));
			}

			if ((ppDest.right > this._iWidth) || (ppDest.bottom > this._iHeight) || (ppDest.front != 0) || (ppDest.back != 1)) {
				CRITICAL("Invalid box.", "GLXWindow::copyContentsToMemory" );
			}

			if (eFramebuffer == EFramebuffer.AUTO) {
				eFramebuffer = this._isFullscreen? EFramebuffer.FRONT: EFramebuffer.BACK;
			}

			var eFormat: int = getWebGLFormat(ppDest.format);
			var eType: int = getWebGLDataType(ppDest.format);

			if (eFormat == GL_NONE || eType == 0) {
				CRITICAL("Unsupported format.", "WebGLCanvas::readPixels");
			}

			var pWebGLRenderer: WebGLRenderer = <WebGLRenderer>this.getRenderer();
			var pWebGLContext: WebGLRenderingContext = pWebGLRenderer.getWebGLContext();

			pWebGLRenderer._setViewport(this.getViewport(0));
			pWebGLRenderer.bindWebGLFramebuffer(GL_FRAMEBUFFER, null);

			// Must change the packing to ensure no overruns!
			pWebGLRenderer.pixelStorei(GL_PACK_ALIGNMENT, 1);
			
			//glReadBuffer((buffer == FB_FRONT)? GL_FRONT : GL_BACK);
			// LOG("readPixels(", ppDest.left, ppDest.top, ppDest.width, ppDest.height, eFormat, eType, /*ppDest.data,*/ ")");
			pWebGLContext.readPixels(ppDest.left, ppDest.top, ppDest.width, ppDest.height, eFormat, eType, ppDest.data);
			
			// restore default alignment
			pWebGLRenderer.pixelStorei(GL_PACK_ALIGNMENT, 4);

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
				if (pVp.actualLeft <= x && pVp.actualTop <= y && 
					pVp.actualLeft + pVp.actualWidth > x && pVp.actualTop + pVp.actualHeight > y) {
					if (isNull(pViewport) || pVp.zIndex > pViewport.zIndex) {
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
					pViewportPrev.mouseout(x - pViewportPrev.actualLeft, y - pViewportPrev.actualTop);
				}

				if (!isNull(pViewportCurr)) {
					pViewportCurr.mouseover(x - pViewportCurr.actualLeft, y - pViewportCurr.actualTop);
				}
			}

			this._p3DEventViewportLast = pViewportCurr;

			return pViewportCurr;
		}

		inline set onclick(fn: (pCanvas: ICanvas3d, x: uint, y: uint) => void) {
        	this.bind(SIGNAL(click), fn);
        }

        inline set onmousemove(fn: (pCanvas: ICanvas3d, x: uint, y: uint) => void) {
        	this.bind(SIGNAL(mousemove), fn);
        }

        inline set onmousedown(fn: (pCanvas: ICanvas3d, eBtn: EMouseButton, x: uint, y: uint) => void) {
        	this.bind(SIGNAL(mousedown), fn);
        }

        inline set onmouseup(fn: (pCanvas: ICanvas3d, eBtn: EMouseButton, x: uint, y: uint) => void) {
        	this.bind(SIGNAL(mouseup), fn);
        }

        inline set onmouseover(fn: (pCanvas: ICanvas3d, x: uint, y: uint) => void) {
        	this.bind(SIGNAL(mouseover), fn);
        }

        inline set onmouseout(fn: (pCanvas: ICanvas3d, x: uint, y: uint) => void) {
        	this.bind(SIGNAL(mouseout), fn);
        }

        inline set onmousewheel(fn: (pCanvas: ICanvas3d, x: uint, y: uint, fDelta: float) => void) {
        	this.bind(SIGNAL(mousewheel), fn);
        }

        inline set ondragstart(fn: (pCanvas: ICanvas3d, eBtn: EMouseButton, x: uint, y: uint) => void) {
        	this.bind(SIGNAL(dragstart), fn);
        }

        inline set ondragstop(fn: (pCanvas: ICanvas3d, eBtn: EMouseButton, x: uint, y: uint) => void) {
        	this.bind(SIGNAL(dragstop), fn);
        }

        inline set ondragging(fn: (pCanvas: ICanvas3d, eBtn: EMouseButton, x: uint, y: uint) => void) {
        	this.bind(SIGNAL(dragging), fn);
        }


		signal click(x: uint, y: uint): void {
			if (this._b3DEventSkipNextClick) {
				this._b3DEventSkipNextClick = false;
				return;
			}

			var pViewport: IViewport = this.getViewportByMouseEvent(x, y);

			if (!isNull(pViewport)) {
				pViewport.click(x - pViewport.actualLeft, y - pViewport.actualTop);
			}

			EMIT_BROADCAST(click, _CALL(x, y));
		}

		signal mousemove(x: uint, y: uint): void {
			var pViewport: IViewport = this.getViewportByMouseEvent(x, y);
			
			if (!isNull(pViewport)) {
				pViewport.mousemove(x - pViewport.actualLeft, y - pViewport.actualTop);
			}

			if (this.is3DEventSupported(E3DEventTypes.DRAGSTART | E3DEventTypes.DRAGSTOP)) {
				//dragging enabled
				if (!isNull(this._p3DEventDragTarget)) {
					//drag start event not emitted
					if (!this._b3DEventDragging && 
						//mouse shift from mousedown point greather than drag dead zone constant
						vec2(x - this._p3DEventMouseDownPos.x, y - this._p3DEventMouseDownPos.y).length() > this._i3DEventDragDeadZone) {
						this.dragstart(this._e3DEventDragBtn, x, y);
					}
					else if (this._b3DEventDragging) {
						this.dragging(this._e3DEventDragBtn, x, y);
					}
				}
			}

			EMIT_BROADCAST(mousemove, _CALL(x, y));
		}

		signal mousedown(eBtn: EMouseButton, x: uint, y: uint): void {
			var pViewport: IViewport = this.getViewportByMouseEvent(x, y);
			
			this._p3DEventMouseDownPos.x = x;
			this._p3DEventMouseDownPos.y = y;

			if (!isNull(pViewport)) {
				pViewport.mousedown(eBtn, x - pViewport.actualLeft, y - pViewport.actualTop);
			}
			if (this.is3DEventSupported(E3DEventTypes.DRAGSTART) 
				&& this._e3DEventDragBtn === EMouseButton.UNKNOWN) {
				this._p3DEventDragTarget = pViewport;
				this._e3DEventDragBtn = eBtn;

				if (this._i3DEventDragDeadZone === 0) {
					this.dragstart(eBtn, x, y);
				}
			}
			
			EMIT_BROADCAST(mousedown, _CALL(eBtn, x, y));
		}

		signal mouseup(eBtn: EMouseButton, x: uint, y: uint): void {
			var pViewport: IViewport = this.getViewportByMouseEvent(x, y);

			if (!isNull(pViewport)) {
				pViewport.mouseup(eBtn, x - pViewport.actualLeft, y - pViewport.actualTop);
			}

			if (this.is3DEventSupported(E3DEventTypes.DRAGSTOP) && 
					this._e3DEventDragBtn === eBtn) {
				
				if (this._b3DEventDragging) {
					this.dragstop(eBtn, x, y);
				}

				this._p3DEventDragTarget = null;
				this._e3DEventDragBtn = EMouseButton.UNKNOWN;
			}

			
			
			EMIT_BROADCAST(mouseup, _CALL(eBtn, x, y));
		}

		signal mouseover(x: uint, y: uint): void {
			var pViewport: IViewport = this.getViewportByMouseEvent(x, y);

			if (!isNull(pViewport)) {
				pViewport.mouseover(x - pViewport.actualLeft, y - pViewport.actualTop);
			}
			
			EMIT_BROADCAST(mouseover, _CALL(x, y));
		}

		signal mouseout(x: uint, y: uint): void {
			var pViewport: IViewport = this.getViewportByMouseEvent(x, y);

			if (!isNull(pViewport)) {
				pViewport.mouseout(x - pViewport.actualLeft, y - pViewport.actualTop);
			}

			//stop dragging if mouse goes out of target
			if (this.is3DEventSupported(E3DEventTypes.DRAGSTOP)) {
				this.dragstop(this._e3DEventDragBtn, x, y);

				this._p3DEventDragTarget = null;
				this._e3DEventDragBtn = EMouseButton.UNKNOWN;
			}
			
			EMIT_BROADCAST(mouseout, _CALL(x, y));
		}

		signal mousewheel(x: uint, y: uint, fDelta: float): void {
			var pViewport: IViewport = this.getViewportByMouseEvent(x, y);

			if (!isNull(pViewport)) {
				pViewport.mousewheel(x - pViewport.actualLeft, y - pViewport.actualTop, fDelta);
			}
			
			EMIT_BROADCAST(mousewheel, _CALL(x, y, fDelta));
		}

		signal dragstart(eBtn: EMouseButton, x: uint, y: uint): void {
			this._b3DEventDragging = true;
			
			if (!isNull(this._p3DEventDragTarget)) {
				this._p3DEventDragTarget.dragstart(
					eBtn,
					x - this._p3DEventDragTarget.actualLeft, 
					y - this._p3DEventDragTarget.actualTop);
			}

			EMIT_BROADCAST(dragstart, _CALL(eBtn, x, y));
		}

		signal dragstop(eBtn: EMouseButton, x: uint, y: uint): void {
			this._b3DEventSkipNextClick = true;
			this._b3DEventDragging = false;

			if (!isNull(this._p3DEventDragTarget)) {
				this._p3DEventDragTarget.dragstop(
					eBtn,
					x - this._p3DEventDragTarget.actualLeft, 
					y - this._p3DEventDragTarget.actualTop);
			}
			
			EMIT_BROADCAST(dragstop, _CALL(eBtn, x, y));
		}

		signal dragging(eBtn: EMouseButton, x: uint, y: uint): void {
			if (!isNull(this._p3DEventDragTarget)) {
				this._p3DEventDragTarget.dragging(
					eBtn,
					x - this._p3DEventDragTarget.actualLeft, 
					y - this._p3DEventDragTarget.actualTop);
			}

			EMIT_BROADCAST(dragging, _CALL(eBtn, x, y));
		}

		static fullscreenLock: bool = false;
	}
}

#endif
