/// <reference path="../idl/AIImgCodec.ts" />
/// <reference path="../idl/AEPixelFormats.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", "pixelUtil/CodecData", "resources/Img"], function(require, exports, __CodecData__, __Img__) {
    var CodecData = __CodecData__;
    var Img = "resources/Img";

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
        Object.defineProperty(ImgData.prototype, "width", {
            get: /** inline */ function () {
                return this._iWidth;
            },
            set: /** inline */ function (iWidth) {
                this._iWidth = iWidth;
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(ImgData.prototype, "height", {
            get: /** inline */ function () {
                return this._iHeight;
            },
            set: /** inline */ function (iHeight) {
                this._iHeight = iHeight;
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(ImgData.prototype, "depth", {
            get: /** inline */ function () {
                return this._iDepth;
            },
            set: /** inline */ function (iDepth) {
                this._iDepth = iDepth;
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(ImgData.prototype, "size", {
            get: /** inline */ function () {
                return Img.calculateSize(this.numMipMaps, this.numFace, this.width, this.height, this.depth, this.format);
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(ImgData.prototype, "numMipMaps", {
            get: /** inline */ function () {
                return this._nMipMaps;
            },
            set: /** inline */ function (nNumMipMaps) {
                this._nMipMaps = nNumMipMaps;
            },
            enumerable: true,
            configurable: true
        });


        Object.defineProperty(ImgData.prototype, "format", {
            get: /** inline */ function () {
                return this._eFormat;
            },
            set: /** inline */ function (ePixelFormat) {
                this._eFormat = ePixelFormat;
            },
            enumerable: true,
            configurable: true
        });


        Object.defineProperty(ImgData.prototype, "flags", {
            get: /** inline */ function () {
                return this._iFlags;
            },
            set: /** inline */ function (iFlags) {
                this._iFlags = iFlags;
            },
            enumerable: true,
            configurable: true
        });


        Object.defineProperty(ImgData.prototype, "cubeFlags", {
            get: /** inline */ function () {
                return this._iCubeFlags;
            },
            set: /** inline */ function (iFlags) {
                this._iCubeFlags = iFlags;
            },
            enumerable: true,
            configurable: true
        });


        Object.defineProperty(ImgData.prototype, "numFace", {
            get: /** inline */ function () {
                if (this._iFlags & 2 /* CUBEMAP */) {
                    var nFace = 0;
                    for (var i = 0; i < 32; i++) {
                        nFace++;
                    }
                    return nFace;
                } else {
                    return 1;
                }
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(ImgData.prototype, "dataType", {
            get: /** inline */ function () {
                return "ImgData";
            },
            enumerable: true,
            configurable: true
        });
        return ImgData;
    })(CodecData);

    
    return ImgData;
});
//# sourceMappingURL=ImgData.js.map
