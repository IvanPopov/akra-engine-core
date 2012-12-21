#ifndef WEBGLINTERNALFRAMEBUFFER_TS
#define WEBGLINTERNALFRAMEBUFFER_TS

#include "IRenderer.ts"
#include "webgl/WebGLRenderer.ts"
#include "webgl/WebGLRenderTexture.ts"
#include "webgl/webgl.ts"
#include "IDepthBuffer.ts"
#include "webgl/WebGLInternalRenderBuffer.ts"

module akra.webgl {
	export interface IWebGLSurfaceAttachments {
		[webGLAttachment: uint] : IWebGLSurfaceDesc;
	}

	export class WebGLInternalFrameBuffer {
		private _pWebGLRenderer: WebGLRenderer = null;
		private _pWebGLFramebuffer: WebGLFramebuffer = null;
		private _pAttachments: IWebGLSurfaceAttachments = null; 


		constructor(pWebGLRenderer: IRenderer) {
			this._pWebGLRenderer = <WebGLRenderer>pWebGLRenderer;

			this._pWebGLFramebuffer = this._pWebGLRenderer.createWebGLFramebuffer();
			this._pAttachments = {};

			for(var i: uint = 0; i < webgl.maxColorAttachments; i++) {
				this._pAttachments[GL_COLOR_ATTACHMENT0 + i] = {buffer: null, zOffset: 0, numSamples: 0};
			}

			this._pAttachments[GL_DEPTH_ATTACHMENT] = {buffer: null, zOffset: 0, numSamples: 0};
			this._pAttachments[GL_STENCIL_ATTACHMENT] = {buffer: null, zOffset: 0, numSamples: 0};
			this._pAttachments[GL_DEPTH_STENCIL_ATTACHMENT] = {buffer: null, zOffset: 0, numSamples: 0};
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

		inline getSurface(iAttachment: uint): IWebGLSurfaceDesc {
			return this._pColorDesc[iAttachment];
		}

		bindSurface(iWebGLAttachment: uint, pSurface: IWebGLSurfaceDesc): void {
			this._pAttachments[iWebGLAttachment] = pSurface;
			this.initialize();
		}

		unbindSurface(iAttachment: uint, pSurface: IWebGLSurfaceDesc): void {
			this._pAttachments[iWebGLAttachment].buffer = 0;
			this.initialize();
		}

		inline bindColorSurface(iAttachment: uint, pSurface: IWebGLSurfaceDesc): void {
			this.bindSurface(GL_COLOR_ATTACHMENT0 + iAttachment, pSurface);
		}

		inline bind(): void {
			this._pWebGLRenderer.bindWebGLFramebuffer(GL_FRAMEBUFFER, this._pWebGLFramebuffer);
		}

		attachDepthBuffer(pDepthBuffer: IDepthBuffer): void {
			if(!isNull(pDepthBuffer)){
				var pDepthRenderBuffer: WebGLInternalRenderBuffer = pDepthBuffer.depthBuffer;
				var pStencilRenderBuffer: WebGLInternalRenderBuffer = pDepthBuffer.stencilBuffer;

				pDepthRenderBuffer._bindToFramebuffer(GL_DEPTH_ATTACHMENT, 0);
			}
		}
		
		detachDepthBuffer(): void {

		}

		private initialize(): void {

		}

		private releaseRenderBuffer(pSurface: IWebGLSurfaceDesc): void {

		}
	}
}

#endif