var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var akra;
(function (akra) {
    /// <reference path="../idl/IImgCodec.ts" />
    /// <reference path="../idl/EPixelFormats.ts" />
    /// <reference path="Codec.ts" />
    (function (pixelUtil) {
        var ImgCodec = (function (_super) {
            __extends(ImgCodec, _super);
            function ImgCodec() {
                _super.apply(this, arguments);
            }
            ImgCodec.prototype.getDataType = function () {
                return "ImgData";
            };
            return ImgCodec;
        })(pixelUtil.Codec);
        pixelUtil.ImgCodec = ImgCodec;
    })(akra.pixelUtil || (akra.pixelUtil = {}));
    var pixelUtil = akra.pixelUtil;
})(akra || (akra = {}));
