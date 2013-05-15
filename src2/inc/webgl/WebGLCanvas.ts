#ifndef WEBGLCANVAS_TS
#define WEBGLCANVAS_TS

#include "render/Canvas3d.ts"
#include "info/info.ts"
#include "IRenderer.ts"
#include "webgl.ts"

module akra.webgl {
	export class WebGLCanvas extends render.Canvas3d {
		protected _pCanvas: HTMLCanvasElement;
		protected _pCanvasCreationInfo: ICanvasInfo;

		//display size, if fullscreen not used
		protected _iRealWidth: uint;
		protected _iRealHeight: uint;

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

		inline get el(): HTMLCanvasElement { return this._pCanvas; }

		constructor (pRenderer: IRenderer) {
			super(pRenderer);
			this._pCanvas = (<any>pRenderer).getHTMLCanvas();
			this._pCanvasCreationInfo = info.canvas(this._pCanvas);
		}

		create(sName: string = null, iWidth: uint = this._pCanvasCreationInfo.width, 
				iHeight: uint = this._pCanvasCreationInfo.height, isFullscreen: bool = false): bool {
			
			this.name = sName;

			this.resize(iWidth, iHeight);
			this.setFullscreen(isFullscreen);

			return true;
		}

		destroy(): void {
			super.destroy();

			this._pCanvas = null;
			this._pCanvasCreationInfo = null;
		}

		getCustomAttribute(sName: string): any {
			// if(sName === "FBO") {
			// 	return null;
			// }

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
			// LOG(__CALLSTACK__, iWidth, iHeight);
			var pCanvas: HTMLCanvasElement = this._pCanvas;	

			this._iWidth = iWidth;
			this._iHeight = iHeight;

			pCanvas.width = iWidth;
			pCanvas.height = iHeight;

			// var pRoot: ISceneNode = this.getScene().getRootNode();

			// //TODO: update textures, lighting etc!

			// pRoot.explore(function(pNode: INode) {
			// 	var pCamera: ICamera;

			// 	if (pNode.type === EEntityTypes.CAMERA) {
			// 		pCamera = (<ICamera>pNode);
			// 		if (!pCamera.isConstantAspect()) {
			// 			pCamera.setProjParams(
			// 				pCamera.fov(),
			// 				pCanvas.width / pCanvas.height,
			// 				pCamera.nearPlane(),
			// 				pCamera.farPlane());

			// 			pCamera.setUpdatedLocalMatrixFlag();
			// 		}
			// 	}
			// });

			this.resized();
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
			pWebGLContext.pixelStorei(GL_PACK_ALIGNMENT, 1);
			
			//glReadBuffer((buffer == FB_FRONT)? GL_FRONT : GL_BACK);
			pWebGLContext.readPixels(ppDest.left, ppDest.top, ppDest.width, ppDest.height, eFormat, eType, ppDest.data);
			
			// restore default alignment
			pWebGLContext.pixelStorei(GL_PACK_ALIGNMENT, 4);

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

		static fullscreenLock: bool = false;
	}
}

#endif
