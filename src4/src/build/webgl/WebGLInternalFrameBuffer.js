/// <reference path="../idl/IRenderer.ts" />
/// <reference path="../idl/IDepthBuffer.ts" />
/// <reference path="../idl/IPixelBuffer.ts" />
var akra;
(function (akra) {
    /// <reference path="WebGLRenderer.ts" />
    /// <reference path="WebGLRenderTexture.ts" />
    /// <reference path="webgl.ts" />
    /// <reference path="WebGLInternalRenderBuffer.ts" />
    /// <reference path="WebGLPixelBuffer.ts" />
    /// <reference path="WebGLDepthBuffer.ts" />
    (function (webgl) {
        var WebGLInternalFrameBuffer = (function () {
            function WebGLInternalFrameBuffer(pWebGLRenderer) {
                this._pWebGLRenderer = null;
                this._pWebGLFramebuffer = null;
                this._pAttachments = null;
                this._iWebglActiveAttachment = 0;
                this._pWebGLRenderer = pWebGLRenderer;

                this._pWebGLFramebuffer = this._pWebGLRenderer.createWebGLFramebuffer();
                this._pAttachments = {};

                for (var i = 0; i < akra.webgl.maxColorAttachments; i++) {
                    this._pAttachments[36064 /* COLOR_ATTACHMENT0 */ + i] = null;
                }

                this._pAttachments[36096 /* DEPTH_ATTACHMENT */] = null;
                this._pAttachments[36128 /* STENCIL_ATTACHMENT */] = null;
                this._pAttachments[33306 /* DEPTH_STENCIL_ATTACHMENT */] = null;
            }
            WebGLInternalFrameBuffer.prototype.destroy = function () {
                this._pWebGLRenderer.deleteWebGLFramebuffer(this._pWebGLFramebuffer);
                this._pWebGLFramebuffer = null;
            };

            WebGLInternalFrameBuffer.prototype.getWidth = function () {
                return this._pAttachments[36064 /* COLOR_ATTACHMENT0 */].getWidth();
            };

            WebGLInternalFrameBuffer.prototype.getHeight = function () {
                return this._pAttachments[36064 /* COLOR_ATTACHMENT0 */].getHeight();
            };

            WebGLInternalFrameBuffer.prototype.getFormat = function () {
                return this._pAttachments[36064 /* COLOR_ATTACHMENT0 */].getFormat();
            };

            WebGLInternalFrameBuffer.prototype.getColorAttachment = function (iAttachment) {
                return this._pAttachments[36064 /* COLOR_ATTACHMENT0 */ + iAttachment];
            };

            WebGLInternalFrameBuffer.prototype.getAttachment = function (iWebGLAttachment) {
                return this._pAttachments[iWebGLAttachment];
            };

            WebGLInternalFrameBuffer.prototype.bindSurface = function (iWebGLAttachment, pSurface) {
                if (!akra.isDef(this._pAttachments[iWebGLAttachment])) {
                    return;
                }

                this.releaseAttachment(iWebGLAttachment);
                this._pAttachments[iWebGLAttachment] = pSurface;
                if (this.checkAttachment(iWebGLAttachment)) {
                    this._bind();
                    pSurface._bindToFramebuffer(iWebGLAttachment, 0);
                    pSurface.addRef();
                }
            };

            WebGLInternalFrameBuffer.prototype.unbindSurface = function (iWebGLAttachment) {
                if (!akra.isDef(this._pAttachments[iWebGLAttachment])) {
                    return;
                }
                var pWebGLContext = this._pWebGLRenderer.getWebGLContext();
                this.releaseAttachment(iWebGLAttachment);
                this._pAttachments[iWebGLAttachment] = null;
                pWebGLContext.framebufferRenderbuffer(36160 /* FRAMEBUFFER */, iWebGLAttachment, 36161 /* RENDERBUFFER */, null);
            };

            WebGLInternalFrameBuffer.prototype.bindColorSurface = function (iAttachment, pSurface) {
                this.bindSurface(36064 /* COLOR_ATTACHMENT0 */ + iAttachment, pSurface);
            };

            WebGLInternalFrameBuffer.prototype._bind = function () {
                this._pWebGLRenderer.bindWebGLFramebuffer(36160 /* FRAMEBUFFER */, this._pWebGLFramebuffer);
            };

            WebGLInternalFrameBuffer.prototype.attachDepthBuffer = function (pDepthBuffer) {
                var pWebGLContext = this._pWebGLRenderer.getWebGLContext();
                var pOldFramebuffer = this._pWebGLRenderer.getParameter(36006 /* FRAMEBUFFER_BINDING */);

                this._pWebGLRenderer.bindWebGLFramebuffer(36160 /* FRAMEBUFFER */, this._pWebGLFramebuffer);

                if (!akra.isNull(pDepthBuffer)) {
                    var pDepthRenderBuffer = pDepthBuffer.getDepthBuffer();
                    var pStencilRenderBuffer = pDepthBuffer.getStencilBuffer();

                    if (!akra.isNull(pDepthRenderBuffer)) {
                        pDepthRenderBuffer._bindToFramebuffer(36096 /* DEPTH_ATTACHMENT */, 0);
                        this.releaseAttachment(36096 /* DEPTH_ATTACHMENT */);
                        this._pAttachments[36096 /* DEPTH_ATTACHMENT */] = pDepthRenderBuffer;
                        pDepthRenderBuffer.addRef();
                    }

                    if (!akra.isNull(pStencilRenderBuffer)) {
                        pStencilRenderBuffer._bindToFramebuffer(36128 /* STENCIL_ATTACHMENT */, 0);
                        this.releaseAttachment(36128 /* STENCIL_ATTACHMENT */);
                        this._pAttachments[36128 /* STENCIL_ATTACHMENT */] = pStencilRenderBuffer;
                        pDepthRenderBuffer.addRef();
                    }

                    if (!this.checkAttachment(36096 /* DEPTH_ATTACHMENT */) || !this.checkAttachment(36128 /* STENCIL_ATTACHMENT */)) {
                        akra.logger.error("Invalid frame buffer depthbuffer attachment. Wrong size.");
                        return;
                    }
                } else {
                    pWebGLContext.framebufferRenderbuffer(36160 /* FRAMEBUFFER */, 36096 /* DEPTH_ATTACHMENT */, 36161 /* RENDERBUFFER */, null);

                    pWebGLContext.framebufferRenderbuffer(36160 /* FRAMEBUFFER */, 36128 /* STENCIL_ATTACHMENT */, 36161 /* RENDERBUFFER */, null);

                    this.releaseAttachment(36096 /* DEPTH_ATTACHMENT */);
                    this.releaseAttachment(36128 /* STENCIL_ATTACHMENT */);
                    this._pAttachments[36096 /* DEPTH_ATTACHMENT */] = null;
                    this._pAttachments[36128 /* STENCIL_ATTACHMENT */] = null;
                }

                this._pWebGLRenderer.bindWebGLFramebuffer(36160 /* FRAMEBUFFER */, pOldFramebuffer);
            };

            WebGLInternalFrameBuffer.prototype.attachDepthTexture = function (pDepthTexture) {
                var pTextureBuffer = pDepthTexture.getBuffer();
                this._bind();
                this.bindSurface(36096 /* DEPTH_ATTACHMENT */, pTextureBuffer);
            };

            WebGLInternalFrameBuffer.prototype.detachDepthTexture = function () {
                this._bind();
                this.unbindSurface(36096 /* DEPTH_ATTACHMENT */);
            };

            WebGLInternalFrameBuffer.prototype.detachDepthBuffer = function () {
                var pWebGLContext = this._pWebGLRenderer.getWebGLContext();
                var pOldFramebuffer = this._pWebGLRenderer.getParameter(36006 /* FRAMEBUFFER_BINDING */);

                this._pWebGLRenderer.bindWebGLFramebuffer(36160 /* FRAMEBUFFER */, this._pWebGLFramebuffer);

                pWebGLContext.framebufferRenderbuffer(36160 /* FRAMEBUFFER */, 36096 /* DEPTH_ATTACHMENT */, 36161 /* RENDERBUFFER */, null);

                pWebGLContext.framebufferRenderbuffer(36160 /* FRAMEBUFFER */, 36128 /* STENCIL_ATTACHMENT */, 36161 /* RENDERBUFFER */, null);

                this.releaseAttachment(36096 /* DEPTH_ATTACHMENT */);
                this.releaseAttachment(36128 /* STENCIL_ATTACHMENT */);
                this._pAttachments[36096 /* DEPTH_ATTACHMENT */] = null;
                this._pAttachments[36128 /* STENCIL_ATTACHMENT */] = null;

                this._pWebGLRenderer.bindWebGLFramebuffer(36160 /* FRAMEBUFFER */, pOldFramebuffer);
            };

            WebGLInternalFrameBuffer.prototype.swapBuffers = function () {
            };

            WebGLInternalFrameBuffer.prototype.checkAttachment = function (iWebGLAttachment) {
                if (iWebGLAttachment === 36064 /* COLOR_ATTACHMENT0 */) {
                    var isOk = true;

                    for (var i = 1; i < akra.webgl.maxColorAttachments; i++) {
                        isOk = this.checkAttachment(36064 /* COLOR_ATTACHMENT0 */ + i);
                        if (!isOk)
                            return false;
                    }

                    isOk = this.checkAttachment(36096 /* DEPTH_ATTACHMENT */);
                    if (!isOk)
                        return false;
                    isOk = this.checkAttachment(36128 /* STENCIL_ATTACHMENT */);
                    if (!isOk)
                        return false;
                    isOk = this.checkAttachment(33306 /* DEPTH_STENCIL_ATTACHMENT */);
                    if (!isOk)
                        return false;

                    return true;
                } else {
                    var pBuffer = this._pAttachments[iWebGLAttachment];
                    if (akra.isNull(pBuffer))
                        return true;

                    if (this.getWidth() === 0 && this.getHeight() === 0)
                        return true;

                    if (this.getWidth() !== pBuffer.getWidth() && this.getHeight() !== pBuffer.getHeight())
                        return false;

                    if (iWebGLAttachment > 36064 /* COLOR_ATTACHMENT0 */ && iWebGLAttachment < 36064 /* COLOR_ATTACHMENT0 */ + akra.webgl.maxColorAttachments) {
                        if (!akra.isNull(this._pAttachments[36064 /* COLOR_ATTACHMENT0 */]) && this.getFormat() !== pBuffer.getFormat())
                            return false;
                    }

                    return true;
                }
            };

            WebGLInternalFrameBuffer.prototype.releaseAttachment = function (iWebGLAttachment) {
                if (!akra.isNull(this._pAttachments[iWebGLAttachment])) {
                    this._pAttachments[iWebGLAttachment].release();
                }
            };
            return WebGLInternalFrameBuffer;
        })();
        webgl.WebGLInternalFrameBuffer = WebGLInternalFrameBuffer;
    })(akra.webgl || (akra.webgl = {}));
    var webgl = akra.webgl;
})(akra || (akra = {}));
//# sourceMappingURL=WebGLInternalFrameBuffer.js.map
