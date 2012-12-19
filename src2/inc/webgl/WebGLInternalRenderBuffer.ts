#ifndef WEBGLINTERNALRENDERBUFFER_TS
#define WEBGLINTERNALRENDERBUFFER_TS

#include "WebGLPixelBuffer.ts"
#include "pixelUtil/pixelUtil.ts"
#include "webgl/webgl.ts"

module akra.webgl {
	export class WebGLInternalRenderBuffer extends WebGLPixelBuffer {
		protected _pWebGLRenderbuffer: WebGLRenderbuffer = null;

		constructor() {
			super();
		}
		create(iFlags: int): bool;
		create(iWidth: int, iHeight: int, iDepth: int, eFormat: EPixelFormats, iFlags: int): bool;
		create(iWebGLFormat: int, iWidth: uint, iHeight: uint, bCreateStorage: bool): bool;
		create(): bool {
			if(arguments.length !== 4){
				CRITICAL("Invalid number of arguments. For PixelBuffer it must be four");
			}
			
			var iWebGLFormat: int = arguments[0];
			var iWidth: uint = arguments[1];
			var iHeight: uint = arguments[2];
			var bCreateStorage: bool = arguments[3];

			var pWebGLRenderer: IWebGLRenderer = <IWebGLRenderer>this.getManager().getEngine().getRenderer();
			var pWebGLContext: WebGLRenderingContext = pWebGLRenderer.getWebGLContext();
			
			super.create(iWidth, iHeight, 1, webgl.getClosestAkraFormat(iWebGLFormat, EPixelFormats.A8R8G8B8), 0);
			
			this._iWebGLInternalFormat = iWebGLFormat;
			this._pWebGLRenderbuffer = pWebGLRenderer.createWebGLRenderbuffer();

			pWebGLRenderer.bindWebGLRenderbuffer(GL_RENDERBUFFER, this._pWebGLRenderbuffer);

			if(bCreateStorage) {
				pWebGLContext.renderbufferStorage(GL_RENDERBUFFER, iWebGLFormat, iWidth, iHeight);
			}

			this.notifyCreated();
			return true;
		}

		destroy(): void {
			super.destroy();
			var pWebGLRenderer: IWebGLRenderer = <IWebGLRenderer>this.getManager().getEngine().getRenderer();

			pWebGLRenderer.deleteWebGLRenderbuffer(this._pWebGLRenderbuffer);
			this._pWebGLRenderbuffer = null;
		}

		_bindToFramebuffer(iAttachment: int, iZOffset: uint): void {
			ASSERT(iZOffset < this._iDepth);

			var pWebGLRenderer: IWebGLRenderer = <IWebGLRenderer>this.getManager().getEngine().getRenderer();
			var pWebGLContext: WebGLRenderingContext = pWebGLRenderer.getWebGLContext();

			pWebGLContext.framebufferRenderbuffer(GL_FRAMEBUFFER, iAttachment, GL_RENDERBUFFER, this._pWebGLRenderbuffer);		
		}	
	}
	
}

#endif