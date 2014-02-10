/// <reference path="../idl/IRenderTarget.ts" />
/// <reference path="../idl/IPixelBuffer.ts" />
/// <reference path="../idl/IRenderer.ts" />
/// <reference path="../idl/IPixelBox.ts" />
/// <reference path="../idl/IRenderTexture.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var akra;
(function (akra) {
    /// <reference path="../pixelUtil/pixelUtil.ts" />
    /// <reference path="RenderTarget.ts" />
    (function (render) {
        var RenderTexture = (function (_super) {
            __extends(RenderTexture, _super);
            function RenderTexture(pRenderer, pBuffer, iZOffset) {
                _super.call(this, pRenderer);
                this._pBuffer = null;
                this._iZOffset = 0;
                this._pBuffer = pBuffer;
                this._iZOffset = iZOffset;
                this._iWidth = pBuffer.getWidth();
                this._iHeight = pBuffer.getHeight();
                this._iColorDepth = akra.pixelUtil.getNumElemBits(pBuffer.getFormat());
            }
            RenderTexture.prototype.enableSupportFor3DEvent = function (iType) {
                return 0;
            };

            RenderTexture.prototype.getPixelBuffer = function () {
                return this._pBuffer;
            };

            RenderTexture.prototype.destroy = function () {
                this._pBuffer._clearRTT(this._iZOffset);
                this._pBuffer = null;
            };

            RenderTexture.prototype.suggestPixelFormat = function () {
                return this._pBuffer.getFormat();
            };

            RenderTexture.prototype.copyContentsToMemory = function (pDest, eBuffer) {
                if (eBuffer === 2 /* AUTO */) {
                    eBuffer = 0 /* FRONT */;
                }

                if (eBuffer !== 0 /* FRONT */) {
                    akra.logger.critical("Invalid buffer.");
                }

                this._pBuffer.blitToMemory(pDest);
            };

            RenderTexture.prototype.readPixels = function (ppDest, eFramebuffer) {
                if (akra.isNull(ppDest)) {
                    var ePixelFormat = 10 /* BYTE_RGB */;

                    ppDest = new akra.pixelUtil.PixelBox(this._iWidth, this._iHeight, 1, ePixelFormat, new Uint8Array(akra.pixelUtil.getMemorySize(this._iWidth, this._iHeight, 1, ePixelFormat)));
                }

                if ((ppDest.right > this._iWidth) || (ppDest.bottom > this._iHeight) || (ppDest.front != 0) || (ppDest.back != 1)) {
                    akra.logger.critical("Invalid box.", "RenderTexture::readPixels");
                }

                this._pBuffer.readPixels(ppDest);

                return ppDest;
            };
            return RenderTexture;
        })(akra.render.RenderTarget);
        render.RenderTexture = RenderTexture;
    })(akra.render || (akra.render = {}));
    var render = akra.render;
})(akra || (akra = {}));
//# sourceMappingURL=RenderTexture.js.map
