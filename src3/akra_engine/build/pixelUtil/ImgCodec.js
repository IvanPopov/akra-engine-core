/// <reference path="../idl/AIImgCodec.ts" />
/// <reference path="../idl/AEPixelFormats.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", "pixelUtil/Codec"], function(require, exports, __Codec__) {
    var Codec = __Codec__;

    var ImgCodec = (function (_super) {
        __extends(ImgCodec, _super);
        function ImgCodec() {
            _super.apply(this, arguments);
        }
        ImgCodec.prototype.getDataType = function () {
            return "ImgData";
        };
        return ImgCodec;
    })(Codec);

    
    return ImgCodec;
});
//# sourceMappingURL=ImgCodec.js.map
