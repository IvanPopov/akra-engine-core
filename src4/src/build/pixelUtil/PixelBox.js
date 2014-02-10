/// <reference path="../idl/IPixelBox.ts" />
/// <reference path="../idl/IImg.ts" />
/// <reference path="../idl/EPixelFormats.ts" />
/// <reference path="../geometry/Box.ts" />
/// <reference path="../logger.ts" />
/// <reference path="../color/Color.ts" />
/// <reference path="../gen/generate.ts" />
/// <reference path="../config/config.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var akra;
(function (akra) {
    /// <reference path="pixelUtil.ts" />
    (function (pixelUtil) {
        var Box = akra.geometry.Box;
        var Color = akra.color.Color;

        var pBuffer;
        var iElement;

        var PixelBox = (function (_super) {
            __extends(PixelBox, _super);
            function PixelBox(iWidth, iHeight, iDepth, ePixelFormat, pPixelData) {
                if (typeof pPixelData === "undefined") { pPixelData = null; }
                _super.call(this);

                if (arguments.length === 0) {
                    this.data = null;
                    this.format = 0 /* UNKNOWN */;
                    this.setConsecutive();
                    return;
                }

                if (arguments.length >= 4) {
                    this.set(0, 0, 0, iWidth, iHeight, iDepth);
                    this.data = akra.isDef(arguments[4]) ? arguments[4] : null;
                    this.format = arguments[3];
                } else {
                    this.set(arguments[0]);
                    this.data = arguments[2];
                    this.format = arguments[1];
                }

                this.setConsecutive();
            }
            PixelBox.prototype.setConsecutive = function () {
                this.rowPitch = this.getWidth();
                this.slicePitch = this.getWidth() * this.getHeight();
            };

            PixelBox.prototype.getRowSkip = function () {
                return this.rowPitch - this.getWidth();
            };
            PixelBox.prototype.getSliceSkip = function () {
                return this.slicePitch - (this.getHeight() * this.rowPitch);
            };

            PixelBox.prototype.isConsecutive = function () {
                return this.rowPitch == this.getWidth() && this.slicePitch == this.getWidth() * this.getHeight();
            };

            PixelBox.prototype.getConsecutiveSize = function () {
                return akra.pixelUtil.getMemorySize(this.getWidth(), this.getHeight(), this.getDepth(), this.format);
            };

            PixelBox.prototype.getSubBox = function (pDest, pDestPixelBox) {
                if (typeof pDestPixelBox === "undefined") { pDestPixelBox = null; }
                if (akra.pixelUtil.isCompressed(this.format)) {
                    if (pDest.left == this.left && pDest.top == this.top && pDest.front == this.front && pDest.right == this.right && pDest.bottom == this.bottom && pDest.back == this.back) {
                        // Entire buffer is being queried
                        return this;
                    }

                    akra.logger.error("Cannot return subvolume of compressed PixelBuffer", "PixelBox::getSubVolume");
                }

                if (!this.contains(pDest)) {
                    akra.logger.error("Bounds out of range", "PixelBox::getSubVolume");
                }

                var elemSize = akra.pixelUtil.getNumElemBytes(this.format);

                // Calculate new data origin
                // Notice how we do not propagate left/top/front from the incoming box, since
                // the returned pointer is already offset
                var rval = null;

                if (akra.isNull(pDestPixelBox)) {
                    rval = new PixelBox();
                } else {
                    rval = pDestPixelBox;
                }

                rval.setPosition(0, 0, pDest.getWidth(), pDest.getHeight(), 0, pDest.getDepth());
                rval.format = this.format;
                rval.data = this.data.subarray(((pDest.left - this.left) * elemSize) + ((pDest.top - this.top) * this.rowPitch * elemSize) + ((pDest.front - this.front) * this.slicePitch * elemSize));

                rval.rowPitch = this.rowPitch;
                rval.slicePitch = this.slicePitch;
                rval.format = this.format;

                return rval;
            };

            PixelBox.prototype.getColorAt = function (pColor, x, y, z) {
                if (typeof z === "undefined") { z = 0; }
                if (akra.isNull(pColor)) {
                    pColor = new Color(0.);
                }

                var pixelSize = akra.pixelUtil.getNumElemBytes(this.format);
                var pixelOffset = pixelSize * (z * this.slicePitch + y * this.rowPitch + x);

                akra.pixelUtil.unpackColour(pColor, this.format, this.data.subarray(pixelOffset, pixelOffset + pixelSize));

                return pColor;
            };

            PixelBox.prototype.setColorAt = function (pColor, x, y, z) {
                if (typeof z === "undefined") { z = 0; }
                var pixelSize = akra.pixelUtil.getNumElemBytes(this.format);
                var pixelOffset = pixelSize * (z * this.slicePitch + y * this.rowPitch + x);
                akra.pixelUtil.packColour(pColor, this.format, this.data.subarray(pixelOffset, pixelOffset + pixelSize));
            };

            PixelBox.prototype.scale = function (pDest, eFilter) {
                if (typeof eFilter === "undefined") { eFilter = 2 /* BILINEAR */; }
                return false;
            };

            PixelBox.prototype.refresh = function (pExtents, ePixelFormat, pPixelData) {
                this.left = pExtents.left;
                this.top = pExtents.top;
                this.front = pExtents.front;

                this.right = pExtents.right;
                this.bottom = pExtents.bottom;
                this.back = pExtents.back;

                this.data = pPixelData;
                this.format = ePixelFormat;

                this.setConsecutive();
            };

            PixelBox.prototype.toString = function () {
                if (akra.config.DEBUG) {
                    return "|---------------------------|\n" + _super.prototype.toString.call(this) + "\n" + "length: " + (this.data ? this.data.length : 0) + "\n" + "|---------------------------|";
                }
                return null;
            };

            PixelBox.temp = function () {
                iElement = (iElement === pBuffer.length - 1 ? 0 : iElement);
                var pPixelBox = pBuffer[iElement++];

                var pBox = null;
                var pPixelData = null;
                var ePixelFormat = 0 /* UNKNOWN */;

                switch (arguments.length) {
                    case 2:
                    case 3:
                        pBox = arguments[0];
                        ePixelFormat = arguments[1];
                        pPixelData = arguments[2] || null;
                        break;
                    case 4:
                    case 5:
                        pBox = Box.temp(0, 0, 0, arguments[0], arguments[1], arguments[2]);
                        ePixelFormat = arguments[3];
                        pPixelData = arguments[4] || null;
                        break;
                    default:
                        pBox = Box.temp(0, 0, 0, 1, 1, 1);
                        break;
                }

                pPixelBox.refresh(pBox, ePixelFormat, pPixelData);

                return pPixelBox;
            };
            return PixelBox;
        })(Box);
        pixelUtil.PixelBox = PixelBox;

        pBuffer = akra.gen.array(20, PixelBox);
        iElement = 0;
    })(akra.pixelUtil || (akra.pixelUtil = {}));
    var pixelUtil = akra.pixelUtil;
})(akra || (akra = {}));
//# sourceMappingURL=PixelBox.js.map
