#ifndef WEBGLINTERNALFRAMEBUFFER_TS
#define WEBGLINTERNALFRAMEBUFFER_TS

#include "IRenderer.ts"
#include "webgl/WebGLRenderer.ts"
#include "webgl/WebGLRenderTexture.ts"
#include "webgl/webgl.ts"
#include "IDepthBuffer.ts"
#include "webgl/WebGLInternalRenderBuffer.ts"
#include "webgl/WebGLPixelBuffer.ts"
#include "webgl/WebGLDepthBuffer.ts"
#include "IPixelBuffer.ts"

module akra.webgl {
	export interface IWebGLAttachments {
		[webGLAttachment: uint] : WebGLPixelBuffer;
	}

	export class WebGLInternalFrameBuffer {
		private _pWebGLRenderer: WebGLRenderer = null;
		private _pWebGLFramebuffer: WebGLFramebuffer = null;
		private _pAttachments: IWebGLAttachments = null; 
		private _iWebglActiveAttachment: uint = 0;

		constructor(pWebGLRenderer: IRenderer) {
			this._pWebGLRenderer = <WebGLRenderer>pWebGLRenderer;

			this._pWebGLFramebuffer = this._pWebGLRenderer.createWebGLFramebuffer();
			this._pAttachments = <IWebGLAttachments>{};

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
        	return this._pAttachments[GL_COLOR_ATTACHMENT0].width;
		}

		inline get height(): uint {
			return this._pAttachments[GL_COLOR_ATTACHMENT0].height;
		}

		inline get format(): uint {
			return this._pAttachments[GL_COLOR_ATTACHMENT0].format;
		}

		inline getColorAttachment(iAttachment: uint): WebGLPixelBuffer {
			return this._pAttachments[GL_COLOR_ATTACHMENT0 + iAttachment];
		}

		inline getAttachment(iWebGLAttachment: uint): WebGLPixelBuffer {
			return this._pAttachments[iWebGLAttachment];
		}

		bindSurface(iWebGLAttachment: uint, pSurface: IPixelBuffer): void {
			if(!isDef(this._pAttachments[iWebGLAttachment])){
				return;
			}
			
			this.releaseAttachment(iWebGLAttachment);
			this._pAttachments[iWebGLAttachment] = <WebGLPixelBuffer>pSurface;
			if(this.checkAttachment(iWebGLAttachment)){
				this._bind();
				(<WebGLPixelBuffer>pSurface)._bindToFramebuffer(iWebGLAttachment, 0);
				(<WebGLPixelBuffer>pSurface).addRef();
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

		inline _bind(): void {
			this._pWebGLRenderer.bindWebGLFramebuffer(GL_FRAMEBUFFER, this._pWebGLFramebuffer);
		}

		attachDepthBuffer(pDepthBuffer: IDepthBuffer): void {
			var pWebGLContext: WebGLRenderingContext = this._pWebGLRenderer.getWebGLContext();
			var pOldFramebuffer: WebGLFramebuffer = this._pWebGLRenderer.getParameter(GL_FRAMEBUFFER_BINDING);

			this._pWebGLRenderer.bindWebGLFramebuffer(GL_FRAMEBUFFER, this._pWebGLFramebuffer);

			if(!isNull(pDepthBuffer)) {
				var pDepthRenderBuffer: WebGLInternalRenderBuffer = (<WebGLDepthBuffer>pDepthBuffer).depthBuffer;
				var pStencilRenderBuffer: WebGLInternalRenderBuffer = (<WebGLDepthBuffer>pDepthBuffer).stencilBuffer;

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
					!this.checkAttachment(GL_STENCIL_ATTACHMENT) ) {
					ERROR("Invalid frame buffer depthbuffer attachment. Wrong size.");
					return;
				}

			}
			else {

				pWebGLContext.framebufferRenderbuffer(GL_FRAMEBUFFER, GL_DEPTH_ATTACHMENT,
										  			  GL_RENDERBUFFER, null);

				pWebGLContext.framebufferRenderbuffer(GL_FRAMEBUFFER, GL_STENCIL_ATTACHMENT,
										  			  GL_RENDERBUFFER, null);

				this.releaseAttachment(GL_DEPTH_ATTACHMENT);
				this.releaseAttachment(GL_STENCIL_ATTACHMENT);
				this._pAttachments[GL_DEPTH_ATTACHMENT] = null;
				this._pAttachments[GL_STENCIL_ATTACHMENT] = null;
			}

			this._pWebGLRenderer.bindWebGLFramebuffer(GL_FRAMEBUFFER, pOldFramebuffer);
		}

		attachDepthTexture(pDepthTexture: ITexture): void {
			var pTextureBuffer: WebGLTextureBuffer = <WebGLTextureBuffer>(<WebGLInternalTexture>pDepthTexture).getBuffer();
			this._bind();
			this.bindSurface(GL_DEPTH_ATTACHMENT, pTextureBuffer);
		}

		detachDepthTexture(): void {
			this._bind();
			this.unbindSurface(GL_DEPTH_ATTACHMENT);
		}
		
		detachDepthBuffer(): void {
			var pWebGLContext: WebGLRenderingContext = this._pWebGLRenderer.getWebGLContext();
			var pOldFramebuffer: WebGLFramebuffer = this._pWebGLRenderer.getParameter(GL_FRAMEBUFFER_BINDING);

			this._pWebGLRenderer.bindWebGLFramebuffer(GL_FRAMEBUFFER, this._pWebGLFramebuffer);

			pWebGLContext.framebufferRenderbuffer(GL_FRAMEBUFFER, GL_DEPTH_ATTACHMENT,
									  			  GL_RENDERBUFFER, null);

			pWebGLContext.framebufferRenderbuffer(GL_FRAMEBUFFER, GL_STENCIL_ATTACHMENT,
									  			  GL_RENDERBUFFER, null);

			this.releaseAttachment(GL_DEPTH_ATTACHMENT);
			this.releaseAttachment(GL_STENCIL_ATTACHMENT);
			this._pAttachments[GL_DEPTH_ATTACHMENT] = null;
			this._pAttachments[GL_STENCIL_ATTACHMENT] = null;

			this._pWebGLRenderer.bindWebGLFramebuffer(GL_FRAMEBUFFER, pOldFramebuffer);
		}

		swapBuffers(): void {

		}

		private checkAttachment(iWebGLAttachment: int): bool{
			if(iWebGLAttachment === GL_COLOR_ATTACHMENT0){	
				var isOk: bool = true;

				for(var i: uint = 1; i < webgl.maxColorAttachments; i++) {
					isOk = this.checkAttachment(GL_COLOR_ATTACHMENT0 + i);
					if(!isOk) return false;
				}

				isOk = this.checkAttachment(GL_DEPTH_ATTACHMENT);
				if(!isOk) return false;
				isOk = this.checkAttachment(GL_STENCIL_ATTACHMENT);
				if(!isOk) return false;
				isOk = this.checkAttachment(GL_DEPTH_STENCIL_ATTACHMENT);
				if(!isOk) return false;

				return true;
			}
			else {
				var pBuffer: IPixelBuffer = this._pAttachments[iWebGLAttachment];
				if(isNull(pBuffer)) return true;

				if(this.width === 0 && this.height === 0) return true;

				if(this.width !== pBuffer.width && this.height !== pBuffer.height) return false;

				if(iWebGLAttachment > GL_COLOR_ATTACHMENT0 && 
				   iWebGLAttachment < GL_COLOR_ATTACHMENT0 + webgl.maxColorAttachments) {

					if (!isNull(this._pAttachments[GL_COLOR_ATTACHMENT0]) &&
						this.format !== pBuffer.format) return false;
				}

				return true;
			}
		}

		private inline releaseAttachment(iWebGLAttachment): void {
			if(!isNull(this._pAttachments[iWebGLAttachment])){
				this._pAttachments[iWebGLAttachment].release();
			}
		}
	}
}

#endif