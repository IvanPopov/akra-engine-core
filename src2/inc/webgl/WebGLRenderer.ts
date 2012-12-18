#ifndef WEBGLRENDERER_TS
#define WEBGLRENDERER_TS

#include "WebGL.ts"
#include "IWebGLRenderer.ts"
#include "render/Renderer.ts"

#define WEBGL_MAX_FRAMEBUFFER_NUM 32

module akra.webgl {
	export class WebGLRenderer extends render.Renderer implements IWebGLRenderer {
		private _pCanvas: HTMLCanvasElement;

		private _pWebGLContext: WebGLRenderingContext;
		private _pWebGLFramebufferList: WebGLFramebuffer[];

		constructor (pEngine: IEngine);
		constructor (pEngine: IEngine, sCanvas: string);
		constructor (pEngine: IEngine, pCanvas: HTMLCanvasElement);
		constructor (pEngine: IEngine, pCanvas?: any) {
			super(pEngine);

			if (isDef(pCanvas)) {
				
				//get HTMLCanvasElement by id
				if (isString(pCanvas)) {
					this._pCanvas = <HTMLCanvasElement>document.getElementById(pCanvas);
				}
				else {
					this._pCanvas = <HTMLCanvasElement>pCanvas;
				}
			}
			else {
				this._pCanvas = <HTMLCanvasElement>document.createElement('canvas');
			}

			this._pWebGLContext = createContext(this._pCanvas);
			this._pWebGLFramebufferList = new Array(WEBGL_MAX_FRAMEBUFFER_NUM);


			for (var i: int = 0; i < this._pWebGLFramebufferList.length; ++ i) {
				this._pWebGLFramebufferList[i] = this._pWebGLContext.createFramebuffer();
			}
		}

		inline getHTMLCanvas(): HTMLCanvasElement {
			return this._pCanvas;
		}

		inline getWebGLContext(): WebGLRenderingContext {
			return this._pWebGLContext;
		}


		/** Buffer Objects. */
		inline bindWebGLBuffer(eTarget: uint, pBuffer: WebGLBuffer): void {
			this._pWebGLContext.bindBuffer(eTarget, pBuffer);
		}

		inline createWebGLBuffer(): WebGLBuffer {
			return this._pWebGLContext.createBuffer();
		}

		inline deleteWebGLBuffer(pBuffer: WebGLBuffer): void {
			this._pWebGLContext.deleteBuffer(pBuffer);
		}
		
		/** Texture Objects. */
		inline bindWebGLTexture(eTarget: uint, pTexture: WebGLTexture): void {
			this._pWebGLContext.bindTexture(eTarget, pTexture);
		}

		inline activateWebGLTexture(iSlot: int): void {
			this._pWebGLContext.activeTexture(iSlot);
		}

		inline createWebGLTexture(): WebGLTexture {
			return this._pWebGLContext.createTexture();
		}

		inline deleteWebGLTexture(pTexture: WebGLTexture): void {
			this._pWebGLContext.deleteTexture(pTexture);
		}

		/** Framebuffer Objects */
		inline createWebGLFramebuffer(): WebGLFramebuffer {
			
			if (this._pWebGLFramebufferList.length === 0) {
				CRITICAL("WebGL framebuffer limit exidit");
			}

			return this._pWebGLFramebufferList.pop();
		}

		inline bindWebGLFramebuffer(eTarget: uint, pBuffer: WebGLFramebuffer): void {
			this._pWebGLContext.bindFramebuffer(eTarget, pBuffer);
		}

		inline deleteWebGLFramebuffer(pBuffer: WebGLFramebuffer): void {
			this._pWebGLFramebufferList.push(pBuffer);
		}


		inline createWebGLProgram(): WebGLProgram {
			return this._pWebGLContext.createProgram();
		}

		inline deleteWebGLProgram(pProgram: WebGLProgram): void {
			this._pWebGLContext.deleteProgram(pProgram);
		}

		inline useWebGLProgram(pProgram: WebGLProgram): void {
			this._pWebGLContext.useProgram(pProgram);
		}

		inline disableAllWebGLVertexAttribs(): void {

			//TODO: check attrib array from last shader program
			var i:uint = 0;
			for(i = 0; i < 16; i++) {
				this._pWebGLContext.disableVertexAttribArray(i);	
			}
		
		}
	}
}

#endif