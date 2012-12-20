#ifndef WEBGLINTERNALFRAMEBUFFER_TS
#define WEBGLINTERNALFRAMEBUFFER_TS

#include "IRenderer.ts"
#include "webgl/WebGLRenderer.ts"
#include "webgl/WebGLRenderTexture.ts"
#include "webgl/webgl.ts"
#include "IDepthBuffer.ts"

module akra.webgl {
	export class WebGLInternalFrameBuffer {
		private _pWebGLRenderer: WebGLRenderer = null;
		private _pWebGLFramebuffer: WebGLFramebuffer = null;
		private _pDepthDesc: IWebGLSurfaceDesc = null;
		private _pStencilDesc: IWebGLSurfaceDesc = null;
		private _pColorDesc: IWebGLSurfaceDesc[] = null;


		constructor(pWebGLRenderer: IRenderer) {
			this._pWebGLRenderer = <WebGLRenderer>pWebGLRenderer;

			this._pWebGLFramebuffer = this._pWebGLRenderer.createWebGLFramebuffer();
			this._pDepthDesc = {buffer: null, zOffset: 0, numSamples: 0};
			this._pStencilDesc = {buffer: null, zOffset: 0, numSamples: 0};
			this._pColorDesc = new Array(webgl.maxColorAttachments); 	

			for(var i: uint = 0; i < webgl.maxColorAttachments; i++) {
				this._pColorDesc[i] = {buffer: null, zOffset: 0, numSamples: 0};

			}
		}

		destroy(): void {

			this._pWebGLRenderer.deleteWebGLFramebuffer(this._pWebGLFramebuffer);
			this._pWebGLFramebuffer = null;
		}

		inline get width(): uint {
        	return this._pColorDesc[0].buffer.width;
		}

		inline get height(): uint {
			return this._pColorDesc[0].buffer.height;
		}

		inline get format(): uint {
			return this._pColorDesc[0].buffer.format;
		}

		bindSurface(iAttachment: uint, pSurface: IWebGLSurfaceDesc): void {

		}

		unbindSurface(iAttachment: uint, pSurface: IWebGLSurfaceDesc): void {
			
		}

		bind(): void {

		}

		swapBuffers(): void {

		}

		attachDepthBuffer(pDepthBuffer: IDepthBuffer): void {

		}
		
		detachDepthBuffer(): void {

		}

		private releaseRenderBuffer(pSurface: IWebGLSurfaceDesc): void {

		}
	}
}

#endif