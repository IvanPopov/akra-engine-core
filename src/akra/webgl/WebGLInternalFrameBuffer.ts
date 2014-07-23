/// <reference path="../idl/IRenderer.ts" />
/// <reference path="../idl/IDepthBuffer.ts" />
/// <reference path="../idl/IPixelBuffer.ts" />

/// <reference path="WebGLRenderer.ts" />
/// <reference path="WebGLRenderTexture.ts" />
/// <reference path="webgl.ts" />
/// <reference path="WebGLInternalRenderBuffer.ts" />
/// <reference path="WebGLPixelBuffer.ts" />
/// <reference path="WebGLDepthBuffer.ts" />


module akra.webgl {
	export interface IWebGLAttachments {
		[webGLAttachment: uint]: WebGLPixelBuffer;
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

			for (var i: uint = 0; i < webgl.maxColorAttachments; i++) {
				this._pAttachments[gl.COLOR_ATTACHMENT0 + i] = null;
			}

			this._pAttachments[gl.DEPTH_ATTACHMENT] = null;
			this._pAttachments[gl.STENCIL_ATTACHMENT] = null;
			this._pAttachments[gl.DEPTH_STENCIL_ATTACHMENT] = null;
		}

		destroy(): void {
			this._pWebGLRenderer.deleteWebGLFramebuffer(this._pWebGLFramebuffer);
			this._pWebGLFramebuffer = null;
		}

		getWidth(): uint {
			return this._pAttachments[gl.COLOR_ATTACHMENT0].getWidth();
		}

		getHeight(): uint {
			return this._pAttachments[gl.COLOR_ATTACHMENT0].getHeight();
		}

		getFormat(): uint {
			return this._pAttachments[gl.COLOR_ATTACHMENT0].getFormat();
		}

		getColorAttachment(iAttachment: uint): WebGLPixelBuffer {
			return this._pAttachments[gl.COLOR_ATTACHMENT0 + iAttachment];
		}

		getAttachment(iWebGLAttachment: uint): WebGLPixelBuffer {
			return this._pAttachments[iWebGLAttachment];
		}

		bindSurface(iWebGLAttachment: uint, pSurface: IPixelBuffer): void {
			if (!isDef(this._pAttachments[iWebGLAttachment])) {
				return;
			}

			this.releaseAttachment(iWebGLAttachment);
			this._pAttachments[iWebGLAttachment] = <WebGLPixelBuffer>pSurface;
			if (this.checkAttachment(iWebGLAttachment)) {
				this._bind();
				(<WebGLPixelBuffer>pSurface)._bindToFramebuffer(iWebGLAttachment, 0);
				(<WebGLPixelBuffer>pSurface).addRef();
			}
		}

		unbindSurface(iWebGLAttachment: uint): void {
			if (!isDef(this._pAttachments[iWebGLAttachment])) {
				return;
			}
			var pWebGLContext: WebGLRenderingContext = this._pWebGLRenderer.getWebGLContext();
			this.releaseAttachment(iWebGLAttachment);
			this._pAttachments[iWebGLAttachment] = null;
			pWebGLContext.framebufferRenderbuffer(gl.FRAMEBUFFER, iWebGLAttachment,
				gl.RENDERBUFFER, null);
		}

		bindColorSurface(iAttachment: uint, pSurface: IPixelBuffer): void {
			this.bindSurface(gl.COLOR_ATTACHMENT0 + iAttachment, pSurface);
		}

		_bind(): void {
			this._pWebGLRenderer.bindWebGLFramebuffer(gl.FRAMEBUFFER, this._pWebGLFramebuffer);
		}

		attachDepthBuffer(pDepthBuffer: IDepthBuffer): void {
			var pWebGLContext: WebGLRenderingContext = this._pWebGLRenderer.getWebGLContext();
			var pOldFramebuffer: WebGLFramebuffer = this._pWebGLRenderer.getParameter(gl.FRAMEBUFFER_BINDING);

			this._pWebGLRenderer.bindWebGLFramebuffer(gl.FRAMEBUFFER, this._pWebGLFramebuffer);

			if (!isNull(pDepthBuffer)) {
				var pDepthRenderBuffer: WebGLInternalRenderBuffer = (<WebGLDepthBuffer>pDepthBuffer).getDepthBuffer();
				var pStencilRenderBuffer: WebGLInternalRenderBuffer = (<WebGLDepthBuffer>pDepthBuffer).getStencilBuffer();

				if (!isNull(pDepthRenderBuffer)) {
					pDepthRenderBuffer._bindToFramebuffer(gl.DEPTH_ATTACHMENT, 0);
					this.releaseAttachment(gl.DEPTH_ATTACHMENT);
					this._pAttachments[gl.DEPTH_ATTACHMENT] = pDepthRenderBuffer;
					pDepthRenderBuffer.addRef();
				}

				if (!isNull(pStencilRenderBuffer)) {
					pStencilRenderBuffer._bindToFramebuffer(gl.STENCIL_ATTACHMENT, 0);
					this.releaseAttachment(gl.STENCIL_ATTACHMENT);
					this._pAttachments[gl.STENCIL_ATTACHMENT] = pStencilRenderBuffer;
					pDepthRenderBuffer.addRef();
				}

				if (!this.checkAttachment(gl.DEPTH_ATTACHMENT) ||
					!this.checkAttachment(gl.STENCIL_ATTACHMENT)) {
					logger.error("Invalid frame buffer depthbuffer attachment. Wrong size.");
					return;
				}

			}
			else {

				pWebGLContext.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT,
					gl.RENDERBUFFER, null);

				pWebGLContext.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.STENCIL_ATTACHMENT,
					gl.RENDERBUFFER, null);

				this.releaseAttachment(gl.DEPTH_ATTACHMENT);
				this.releaseAttachment(gl.STENCIL_ATTACHMENT);
				this._pAttachments[gl.DEPTH_ATTACHMENT] = null;
				this._pAttachments[gl.STENCIL_ATTACHMENT] = null;
			}

			this._pWebGLRenderer.bindWebGLFramebuffer(gl.FRAMEBUFFER, pOldFramebuffer);
		}

		attachDepthTexture(pDepthTexture: ITexture): void {
			var pTextureBuffer: WebGLTextureBuffer = <WebGLTextureBuffer>(<WebGLInternalTexture>pDepthTexture).getBuffer();
			this._bind();
			this.bindSurface(gl.DEPTH_ATTACHMENT, pTextureBuffer);
		}

		detachDepthTexture(): void {
			this._bind();
			this.unbindSurface(gl.DEPTH_ATTACHMENT);
		}

		detachDepthBuffer(): void {
			var pWebGLContext: WebGLRenderingContext = this._pWebGLRenderer.getWebGLContext();
			var pOldFramebuffer: WebGLFramebuffer = this._pWebGLRenderer.getParameter(gl.FRAMEBUFFER_BINDING);

			this._pWebGLRenderer.bindWebGLFramebuffer(gl.FRAMEBUFFER, this._pWebGLFramebuffer);

			pWebGLContext.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT,
				gl.RENDERBUFFER, null);

			pWebGLContext.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.STENCIL_ATTACHMENT,
				gl.RENDERBUFFER, null);

			this.releaseAttachment(gl.DEPTH_ATTACHMENT);
			this.releaseAttachment(gl.STENCIL_ATTACHMENT);
			this._pAttachments[gl.DEPTH_ATTACHMENT] = null;
			this._pAttachments[gl.STENCIL_ATTACHMENT] = null;

			this._pWebGLRenderer.bindWebGLFramebuffer(gl.FRAMEBUFFER, pOldFramebuffer);
		}

		swapBuffers(): void {

		}

		private checkAttachment(iWebGLAttachment: int): boolean {
			if (iWebGLAttachment === gl.COLOR_ATTACHMENT0) {
				var isOk: boolean = true;

				for (var i: uint = 1; i < webgl.maxColorAttachments; i++) {
					isOk = this.checkAttachment(gl.COLOR_ATTACHMENT0 + i);
					if (!isOk) return false;
				}

				isOk = this.checkAttachment(gl.DEPTH_ATTACHMENT);
				if (!isOk) return false;
				isOk = this.checkAttachment(gl.STENCIL_ATTACHMENT);
				if (!isOk) return false;
				isOk = this.checkAttachment(gl.DEPTH_STENCIL_ATTACHMENT);
				if (!isOk) return false;

				return true;
			}
			else {
				var pBuffer: IPixelBuffer = this._pAttachments[iWebGLAttachment];
				if (isNull(pBuffer)) return true;

				if (this.getWidth() === 0 && this.getHeight() === 0) return true;

				if (this.getWidth() !== pBuffer.getWidth() && this.getHeight() !== pBuffer.getHeight()) return false;

				if (iWebGLAttachment > gl.COLOR_ATTACHMENT0 &&
					iWebGLAttachment < gl.COLOR_ATTACHMENT0 + webgl.maxColorAttachments) {

					if (!isNull(this._pAttachments[gl.COLOR_ATTACHMENT0]) &&
						this.getFormat() !== pBuffer.getFormat()) return false;
				}

				return true;
			}
		}

		private releaseAttachment(iWebGLAttachment): void {
			if (!isNull(this._pAttachments[iWebGLAttachment])) {
				this._pAttachments[iWebGLAttachment].release();
			}
		}
	}
}