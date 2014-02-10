/// <reference path="../idl/IImgCodec.ts" />
/// <reference path="../idl/EPixelFormats.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var akra;
(function (akra) {
    /// <reference path="CodecData.ts" />
    /// <reference path="../pool/resources/Img.ts" />
    (function (pixelUtil) {
        var ImgData = (function (_super) {
            __extends(ImgData, _super);
            function ImgData() {
                _super.apply(this, arguments);
                this._iHeight = 0;
                this._iWidth = 0;
                this._iDepth = 1;
                this._iSize = 0;
                this._nMipMaps = 0;
                this._iFlags = 0;
                this._eFormat = 0 /* UNKNOWN */;
            }
            ImgData.prototype.getWidth = function () {
                return this._iWidth;
            };

            ImgData.prototype.setWidth = function (iWidth) {
                this._iWidth = iWidth;
            };

            ImgData.prototype.getHeight = function () {
                return this._iHeight;
            };

            ImgData.prototype.setHeight = function (iHeight) {
                this._iHeight = iHeight;
            };

            ImgData.prototype.getDepth = function () {
                return this._iDepth;
            };

            ImgData.prototype.setDepth = function (iDepth) {
                this._iDepth = iDepth;
            };

            ImgData.prototype.getNumMipMaps = function () {
                return this._nMipMaps;
            };

            ImgData.prototype.setNumMipMaps = function (nNumMipMaps) {
                this._nMipMaps = nNumMipMaps;
            };

            ImgData.prototype.getFormat = function () {
                return this._eFormat;
            };

            ImgData.prototype.setFormat = function (ePixelFormat) {
                this._eFormat = ePixelFormat;
            };

            ImgData.prototype.getFlags = function () {
                return this._iFlags;
            };

            ImgData.prototype.setFlags = function (iFlags) {
                this._iFlags = iFlags;
            };

            ImgData.prototype.getCubeFlags = function () {
                return this._iCubeFlags;
            };

            ImgData.prototype.setCubeFlags = function (iFlags) {
                this._iCubeFlags = iFlags;
            };

            ImgData.prototype.getSize = function () {
                return akra.pool.resources.Img.calculateSize(this.getNumMipMaps(), this.getNumFace(), this.getWidth(), this.getHeight(), this.getDepth(), this.getFormat());
            };

            ImgData.prototype.getNumFace = function () {
                if (this._iFlags & 2 /* CUBEMAP */) {
                    var nFace = 0;
                    for (var i = 0; i < 32; i++) {
                        nFace++;
                    }
                    return nFace;
                } else {
                    return 1;
                }
            };

            ImgData.prototype.getDataType = function () {
                return "ImgData";
            };
            return ImgData;
        })(akra.pixelUtil.CodecData);
        pixelUtil.ImgData = ImgData;
    })(akra.pixelUtil || (akra.pixelUtil = {}));
    var pixelUtil = akra.pixelUtil;
})(akra || (akra = {}));
//# sourceMappingURL=ImgData.js.map
