/// <reference path="../pixelUtil/pixelUtil.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var akra;
(function (akra) {
    /// <reference path="WebGLPixelBuffer.ts" />
    /// <reference path="webgl.ts" />
    (function (webgl) {
        var WebGLInternalRenderBuffer = (function (_super) {
            __extends(WebGLInternalRenderBuffer, _super);
            function WebGLInternalRenderBuffer() {
                _super.call(this);
                this._pWebGLRenderbuffer = null;
            }
            WebGLInternalRenderBuffer.prototype.create = function () {
                if (arguments.length !== 4) {
                    akra.logger.critical("Invalid number of arguments. For PixelBuffer it must be four");
                }

                var iWebGLFormat = arguments[0];
                var iWidth = arguments[1];
                var iHeight = arguments[2];
                var bCreateStorage = arguments[3];

                var pWebGLRenderer = this.getManager().getEngine().getRenderer();
                var pWebGLContext = pWebGLRenderer.getWebGLContext();

                _super.prototype.create.call(this, iWidth, iHeight, 1, akra.webgl.getClosestAkraFormat(iWebGLFormat, 12 /* A8R8G8B8 */), 0);

                this._iWebGLInternalFormat = iWebGLFormat;
                this._pWebGLRenderbuffer = pWebGLRenderer.createWebGLRenderbuffer();

                pWebGLRenderer.bindWebGLRenderbuffer(36161 /* RENDERBUFFER */, this._pWebGLRenderbuffer);

                if (bCreateStorage) {
                    pWebGLContext.renderbufferStorage(36161 /* RENDERBUFFER */, iWebGLFormat, iWidth, iHeight);
                }

                this.notifyCreated();
                return true;
            };

            WebGLInternalRenderBuffer.prototype.destroy = function () {
                _super.prototype.destroy.call(this);
                var pWebGLRenderer = this.getManager().getEngine().getRenderer();

                pWebGLRenderer.deleteWebGLRenderbuffer(this._pWebGLRenderbuffer);
                this._pWebGLRenderbuffer = null;
            };

            WebGLInternalRenderBuffer.prototype._bindToFramebuffer = function (iAttachment, iZOffset) {
                akra.logger.assert(iZOffset < this._iDepth);

                var pWebGLRenderer = this.getManager().getEngine().getRenderer();
                var pWebGLContext = pWebGLRenderer.getWebGLContext();

                pWebGLContext.framebufferRenderbuffer(36160 /* FRAMEBUFFER */, iAttachment, 36161 /* RENDERBUFFER */, this._pWebGLRenderbuffer);
            };
            return WebGLInternalRenderBuffer;
        })(akra.webgl.WebGLPixelBuffer);
        webgl.WebGLInternalRenderBuffer = WebGLInternalRenderBuffer;
    })(akra.webgl || (akra.webgl = {}));
    var webgl = akra.webgl;
})(akra || (akra = {}));
//# sourceMappingURL=WebGLInternalRenderBuffer.js.map
