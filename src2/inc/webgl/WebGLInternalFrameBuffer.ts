#ifndef WEBGLINTERNALFRAMEBUFFER_TS
#define WEBGLINTERNALFRAMEBUFFER_TS

#include "IRenderer.ts"
#include "webgl/WebGLRenderer.ts"
#include "webgl/WebGLRenderTexture.ts"
#include "webgl/webgl.ts"
#include "IDepthBuffer.ts"
#include "webgl/WebGLInternalRenderBuffer.ts"
#include "IPixelBuffer.ts"

module akra.webgl {
	export interface IWebGLAttachments {
		[webGLAttachment: uint] : IPixelBuffer;
	}

	export class WebGLInternalFrameBuffer {
		private _pWebGLRenderer: WebGLRenderer = null;
		private _pWebGLFramebuffer: WebGLFramebuffer = null;
		private _pAttachments: IWebGLAttachments = null; 
		private _iWidth: uint = 0;
		private _iHeight: uint = 0;


		constructor(pWebGLRenderer: IRenderer) {
			this._pWebGLRenderer = <WebGLRenderer>pWebGLRenderer;

			this._pWebGLFramebuffer = this._pWebGLRenderer.createWebGLFramebuffer();
			this._pAttachments = {};

			for(var i: uint = 0; i < webgl.maxColorAttachments; i++) {
				this._pAttachments[GL_COLOR_ATTACHMENT0 + i] = null;
			}

			this._pAttachments[GL_DEPTH_ATTACHMENT] = null;
			this._pAttachments[GL_STENCIL_ATTACHMENT] = null;
			this._pAttachments[GL_DEPTH_STENCIL_ATTACHMENT] = null;
		}

		destroy(): void {
			this._pWebGLRenderer.deleteWebGLFramebuffer(this._pWebGLFramebuffer);
			this._pWebGLFramebuffer = null;
		}

		inline get width(): uint {
        	return this._iWidth;
		}

		inline get height(): uint {
			return this._iHeight;
		}

		inline get format(): uint {
			return this._pAttachments[GL_COLOR_ATTACHMENT0].format;
		}

		inline getSurface(iAttachment: uint): IPixelBuffer {
			return this._pColorDesc[iAttachment];
		}

		bindSurface(iWebGLAttachment: uint, pSurface: IPixelBuffer): void {
			if(!isDef(this._pAttachments[iWebGLAttachment])){
				return;
			}
			this.releaseAttachment(iWebGLAttachment);
			this._pAttachments[iWebGLAttachment] = pSurface;
			if(this.checkAttachment(iWebGLAttachment)){
				this.bind();
				pSurface._bindToFramebuffer(iWebGLAttachment, 0);
				pSurface.addRef();
			}
		}

		unbindSurface(iWebGLAttachment: uint): void {
			if(!isDef(this._pAttachments[iWebGLAttachment])){
				return;
			}
			var pWebGLContext: WebGLRenderingContext = this._pWebGLRenderer.getWebGLContext();
			this.releaseAttachment(iWebGLAttachment);
			this._pAttachments[iWebGLAttachment] = null;
			pWebGLContext.framebufferRenderbuffer(GL_FRAMEBUFFER, iWebGLAttachment,
									  			  GL_RENDERBUFFER, null);
		}

		inline bindColorSurface(iAttachment: uint, pSurface: IPixelBuffer): void {
			this.bindSurface(GL_COLOR_ATTACHMENT0 + iAttachment, pSurface);
		}

		inline bind(): void {
			this._pWebGLRenderer.bindWebGLFramebuffer(GL_FRAMEBUFFER, this._pWebGLFramebuffer);
		}

		attachDepthBuffer(pDepthBuffer: IDepthBuffer): void {
			if(!isNull(pDepthBuffer)) {
				var pDepthRenderBuffer: WebGLInternalRenderBuffer = pDepthBuffer.depthBuffer;
				var pStencilRenderBuffer: WebGLInternalRenderBuffer = pDepthBuffer.stencilBuffer;

				if(!isNull(pDepthRenderBuffer)){
					pDepthRenderBuffer._bindToFramebuffer(GL_DEPTH_ATTACHMENT, 0);
					this.releaseAttachment(GL_DEPTH_ATTACHMENT);
					this._pAttachments[GL_DEPTH_ATTACHMENT] = pDepthRenderBuffer;
					pDepthRenderBuffer.addRef();
				}

				if(!isNull(pStencilRenderBuffer)){
					pStencilRenderBuffer._bindToFramebuffer(GL_STENCIL_ATTACHMENT, 0);
					this.releaseAttachment(GL_STENCIL_ATTACHMENT);
					this._pAttachments[GL_STENCIL_ATTACHMENT] = pStencilRenderBuffer;
					pDepthRenderBuffer.addRef();
				}

				if( !this.checkAttachment(GL_DEPTH_ATTACHMENT) ||
					!this.checkAttachment(GL_STENCIL_ATTACHMENT) ){
					ERROR("Invalid frame buffer depthbuffer attachment. Wrong size.");
					return;
				}

			}
			else {
				var pWebGLContext: WebGLRenderingContext = this._pWebGLRenderer.getWebGLContext();

				pWebGLContext.framebufferRenderbuffer(GL_FRAMEBUFFER, GL_DEPTH_ATTACHMENT,
										  			  GL_RENDERBUFFER, null);

				pWebGLContext.framebufferRenderbuffer(GL_FRAMEBUFFER, GL_STENCIL_ATTACHMENT,
										  			  GL_RENDERBUFFER, null);

				this.releaseAttachment(GL_DEPTH_ATTACHMENT);
				this.releaseAttachment(GL_STENCIL_ATTACHMENT);
				this._pAttachments[GL_DEPTH_ATTACHMENT] = null;
				this._pAttachments[GL_STENCIL_ATTACHMENT] = null;
			}
		}
		
		detachDepthBuffer(): void {
			var pWebGLContext: WebGLRenderingContext = this._pWebGLRenderer.getWebGLContext();

			this._pWebGLRenderer.bindWebGLFramebuffer()GL_FRAMEBUFFER, this._pWebGLFramebuffer);

			pWebGLContext.framebufferRenderbuffer(GL_FRAMEBUFFER, GL_DEPTH_ATTACHMENT,
									  			  GL_RENDERBUFFER, null);

			pWebGLContext.framebufferRenderbuffer(GL_FRAMEBUFFER, GL_STENCIL_ATTACHMENT,
									  			  GL_RENDERBUFFER, null);

			this.releaseAttachment(GL_DEPTH_ATTACHMENT);
			this.releaseAttachment(GL_STENCIL_ATTACHMENT);
			this._pAttachments[GL_DEPTH_ATTACHMENT] = null;
			this._pAttachments[GL_STENCIL_ATTACHMENT] = null;
		}

		private checkAttachment(iWebGLAttachment: int): bool{
			if(iWebGLAttachment === GL_COLOR_ATTACHMENT0){	
				this._iWidth = this._pAttachments[GL_COLOR_ATTACHMENT0].width;
				this._iHeight = this._pAttachments[GL_COLOR_ATTACHMENT0].height;

				var isOk: bool = true;

				for(var i: uint = 1; i < webgl.maxColorAttachments; i++) {
					isOk = this.checkAttachment(GL_COLOR_ATTACHMENT0 + i);
					if(!isOk) return false;
				}

				isOk = checkAttachment(GL_DEPTH_ATTACHMENT);
				if(!isOk) return false;
				isOk = checkAttachment(GL_STENCIL_ATTACHMENT);
				if(!isOk) return false;
				isOK = checkAttachment(GL_DEPTH_STENCIL_ATTACHMENT);
				if(!isOk) return false;

				return true;
			}
			else {
				var pBuffer: IPixelBuffer = this._pAttachments[iWebGLAttachment];
				if(isNull(pBuffer)) return true;

				if(this._iWidth === 0 && this._iHeight === 0) return true;

				if(this._iWidth !== pBuffer.width && this._iHeight !== pBuffer.height) return false;

				if(iWebGLAttachment > GL_COLOR_ATTACHMENT0 && 
				   iWebGLAttachment < GL_COLOR_ATTACHMENT0 + webgl.maxColorAttachments) {

					if (!isNull(this._pAttachments[GL_COLOR_ATTACHMENT0]) &&
						this.format !== pBuffer.format) return false;
				}

				return true;
			}
		}

		// private initialize(): void {
		// 	var pColorAttachment: IPixelBuffer = this._pAttachments[GL_COLOR_ATTACHMENT0];

		// 	if(isNull(pColorAttachment)) {

		// 	}

		// 	var iWidth: uint = this._pAttachments[GL_COLOR_ATTACHMENT0].width,
		// 		iHeight: uint = this._pAttachments[GL_COLOR_ATTACHMENT0].height;

		// 	for(var i: uint = 0; i < webgl.maxColorAttachments; i++){

		// 	}
		// }

		private inline releaseAttachment(iWebGLAttachment): void {
			if(!isNull(this._pAttachments[iWebGLAttachment])){
				this._pAttachments[iWebGLAttachment].release();
			}
		}
	}
}

#endif