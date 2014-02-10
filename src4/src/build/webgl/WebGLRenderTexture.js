/// <reference path="../idl/IRenderer.ts" />
/// <reference path="../idl/IDepthBuffer.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var akra;
(function (akra) {
    /// <reference path="WebGLInternalFrameBuffer.ts" />
    /// <reference path="WebGLPixelBuffer.ts" />
    /// <reference path="../render/RenderTexture.ts" />
    (function (webgl) {
        var WebGLRenderTexture = (function (_super) {
            __extends(WebGLRenderTexture, _super);
            function WebGLRenderTexture(pRenderer, pTarget) {
                _super.call(this, pRenderer, pTarget, 0);
                this._pFrameBuffer = null;
                this._pFrameBuffer = new akra.webgl.WebGLInternalFrameBuffer(pRenderer);

                this._pFrameBuffer.bindSurface(36064 /* COLOR_ATTACHMENT0 */, pTarget);

                this._iWidth = this._pFrameBuffer.getWidth();
                this._iHeight = this._pFrameBuffer.getHeight();
            }
            WebGLRenderTexture.prototype.getWidth = function () {
                return this._iWidth = this._pFrameBuffer.getWidth();
            };

            WebGLRenderTexture.prototype.getHeight = function () {
                return this._iHeight = this._pFrameBuffer.getHeight();
            };

            WebGLRenderTexture.prototype.destroy = function () {
                _super.prototype.destroy.call(this);
            };

            WebGLRenderTexture.prototype.requiresTextureFlipping = function () {
                return true;
            };

            WebGLRenderTexture.prototype.getCustomAttribute = function (sName) {
                if (sName === "FBO") {
                    return this._pFrameBuffer;
                }

                return null;
            };

            WebGLRenderTexture.prototype.swapBuffers = function () {
                this._pFrameBuffer.swapBuffers();
            };

            WebGLRenderTexture.prototype.attachDepthBuffer = function (pDepthBuffer) {
                var bResult = false;
                bResult = _super.prototype.attachDepthBuffer.call(this, pDepthBuffer);

                if (bResult) {
                    this._pFrameBuffer.attachDepthBuffer(pDepthBuffer);
                }

                return bResult;
            };

            WebGLRenderTexture.prototype.attachDepthPixelBuffer = function (pBuffer) {
                var bResult = false;

                bResult = _super.prototype.attachDepthPixelBuffer.call(this, pBuffer);
                if (bResult) {
                    if (pBuffer.getFormat() !== 44 /* DEPTH8 */) {
                        this.detachDepthPixelBuffer();
                        return false;
                    }

                    this._pFrameBuffer.bindSurface(36096 /* DEPTH_ATTACHMENT */, pBuffer);
                    pBuffer.addRef();
                }

                return bResult;
            };

            WebGLRenderTexture.prototype.attachDepthTexture = function (pTexture) {
                this._pFrameBuffer.attachDepthTexture(pTexture);
                return true;
            };

            WebGLRenderTexture.prototype.detachDepthPixelBuffer = function () {
                this._pFrameBuffer.unbindSurface(36096 /* DEPTH_ATTACHMENT */);
                this._pDepthPixelBuffer.release();
                _super.prototype.detachDepthPixelBuffer.call(this);
            };

            WebGLRenderTexture.prototype.detachDepthBuffer = function () {
                this._pFrameBuffer.detachDepthBuffer();
                _super.prototype.detachDepthBuffer.call(this);
            };

            WebGLRenderTexture.prototype.detachDepthTexture = function () {
                this._pFrameBuffer.detachDepthTexture();
            };
            return WebGLRenderTexture;
        })(akra.render.RenderTexture);
        webgl.WebGLRenderTexture = WebGLRenderTexture;
    })(akra.webgl || (akra.webgl = {}));
    var webgl = akra.webgl;
})(akra || (akra = {}));
//# sourceMappingURL=WebGLRenderTexture.js.map
