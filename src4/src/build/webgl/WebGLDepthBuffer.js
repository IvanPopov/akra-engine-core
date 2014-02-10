/// <reference path="../pool/resources/DepthBuffer.ts" />
/// <reference path="WebGLInternalRenderBuffer.ts" />
/// <reference path="WebGLInternalFrameBuffer.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var akra;
(function (akra) {
    (function (webgl) {
        var WebGLDepthBuffer = (function (_super) {
            __extends(WebGLDepthBuffer, _super);
            function WebGLDepthBuffer() {
                _super.call(this);
                this._pDepthBuffer = null;
                this._pStencilBuffer = null;
            }
            WebGLDepthBuffer.prototype.getDepthBuffer = function () {
                return this._pDepthBuffer;
            };

            WebGLDepthBuffer.prototype.getStencilBuffer = function () {
                return this._pStencilBuffer;
            };

            WebGLDepthBuffer.prototype.create = function () {
                if (arguments.length !== 5) {
                    akra.logger.critical("Invalid number of arguments. For WebGLDepthBuffer it must be five");
                }

                _super.prototype.create.call(this, 0, arguments[2], arguments[3], arguments[4]);
                var pDepth = arguments[0];
                var pStencil = arguments[1];

                this._pDepthBuffer = pDepth;
                this._pStencilBuffer = pStencil;

                if (!akra.isNull(pDepth)) {
                    switch (pDepth._getWebGLFormat()) {
                        case 33189 /* DEPTH_COMPONENT16 */:
                            this._iBitDepth = 16;
                            break;
                        case 33190 /* DEPTH_COMPONENT24_OES */:
                        case 33191 /* DEPTH_COMPONENT32_OES */:
                        case 35056 /* DEPTH24_STENCIL8_OES */:
                            if (akra.webgl.hasExtension(akra.webgl.OES_DEPTH24) || akra.webgl.hasExtension(akra.webgl.OES_DEPTH32) || akra.webgl.hasExtension(akra.webgl.OES_PACKED_DEPTH_STENCIL)) {
                                this._iBitDepth = 32;
                            }
                            break;
                    }
                }

                return true;
            };

            WebGLDepthBuffer.prototype.destroy = function () {
                _super.prototype.destroy.call(this);

                if (!akra.isNull(this._pStencilBuffer) && this._pStencilBuffer !== this._pDepthBuffer) {
                    this._pStencilBuffer.release();
                }

                if (!akra.isNull(this._pDepthBuffer)) {
                    this._pDepthBuffer.release();
                }

                this._pStencilBuffer = null;
                this._pDepthBuffer = null;
            };

            WebGLDepthBuffer.prototype.isCompatible = function (pTarget) {
                if (this._iWidth >= pTarget.getWidth() && this._iHeight >= pTarget.getHeight()) {
                    return true;
                }

                return false;
            };
            return WebGLDepthBuffer;
        })(akra.pool.resources.DepthBuffer);
        webgl.WebGLDepthBuffer = WebGLDepthBuffer;
    })(akra.webgl || (akra.webgl = {}));
    var webgl = akra.webgl;
})(akra || (akra = {}));
//# sourceMappingURL=WebGLDepthBuffer.js.map
