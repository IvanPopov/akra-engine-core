/// <reference path="../pixelUtil/pixelUtil.ts" />

/// <reference path="WebGLPixelBuffer.ts" />
/// <reference path="webgl.ts" />

module akra.webgl {
	export class WebGLInternalRenderBuffer extends WebGLPixelBuffer {
		protected _pWebGLRenderbuffer: WebGLRenderbuffer = null;

		constructor() {
			super();
		}
		
		create(iFlags: int): boolean;
		create(iWidth: int, iHeight: int, iDepth: int, eFormat: EPixelFormats, iFlags: int): boolean;
		create(iWebGLFormat: int, iWidth: uint, iHeight: uint, bCreateStorage: boolean): boolean;
		create(): boolean {
			if(arguments.length !== 4){
				logger.critical("Invalid number of arguments. For PixelBuffer it must be four");
			}
			
			var iWebGLFormat: int = arguments[0];
			var iWidth: uint = arguments[1];
			var iHeight: uint = arguments[2];
			var bCreateStorage: boolean = arguments[3];

			var pWebGLRenderer: WebGLRenderer = <WebGLRenderer>this.getManager().getEngine().getRenderer();
			var pWebGLContext: WebGLRenderingContext = pWebGLRenderer.getWebGLContext();
			
			super.create(iWidth, iHeight, 1, webgl.getClosestAkraFormat(iWebGLFormat, EPixelFormats.A8R8G8B8), 0);
			
			this._iWebGLInternalFormat = iWebGLFormat;
			this._pWebGLRenderbuffer = pWebGLRenderer.createWebGLRenderbuffer();

			pWebGLRenderer.bindWebGLRenderbuffer(gl.RENDERBUFFER, this._pWebGLRenderbuffer);

			if(bCreateStorage) {
				pWebGLContext.renderbufferStorage(gl.RENDERBUFFER, iWebGLFormat, iWidth, iHeight);
			}

			this.notifyCreated();
			return true;
		}

		destroy(): void {
			super.destroy();
			var pWebGLRenderer: WebGLRenderer = <WebGLRenderer>this.getManager().getEngine().getRenderer();

			pWebGLRenderer.deleteWebGLRenderbuffer(this._pWebGLRenderbuffer);
			this._pWebGLRenderbuffer = null;
		}

		_bindToFramebuffer(iAttachment: int, iZOffset: uint): void {
			logger.assert(iZOffset < this._iDepth);

			var pWebGLRenderer: WebGLRenderer = <WebGLRenderer>this.getManager().getEngine().getRenderer();
			var pWebGLContext: WebGLRenderingContext = pWebGLRenderer.getWebGLContext();

			pWebGLContext.framebufferRenderbuffer(gl.FRAMEBUFFER, iAttachment, gl.RENDERBUFFER, this._pWebGLRenderbuffer);		
		}	
	}
	
}