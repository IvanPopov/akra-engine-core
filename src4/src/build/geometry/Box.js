/// <reference path="../idl/IBox.ts" />
/// <reference path="../logger.ts" />
/// <reference path="../gen/generate.ts" />
var akra;
(function (akra) {
    (function (geometry) {
        var pBuffer;
        var iElement;

        var Box = (function () {
            function Box() {
                this.left = 0;
                this.top = 0;
                this.front = 0;
                this.right = 0;
                this.bottom = 0;
                this.back = 0;
                this.set.apply(this, arguments);
            }
            Box.prototype.getWidth = function () {
                return this.right - this.left;
            };

            Box.prototype.getHeight = function () {
                return this.bottom - this.top;
            };

            Box.prototype.getDepth = function () {
                return this.back - this.front;
            };

            Box.prototype.set = function () {
                switch (arguments.length) {
                    case 1:
                        this.left = arguments[0].left;
                        this.top = arguments[0].top;
                        this.front = arguments[0].front;

                        this.right = arguments[0].right;
                        this.bottom = arguments[0].bottom;
                        this.back = arguments[0].back;
                        break;

                    case 0:
                        this.left = 0;
                        this.top = 0;
                        this.front = 0;

                        this.right = 1;
                        this.bottom = 1;
                        this.back = 1;
                        break;

                    case 3:
                        this.left = arguments[0];
                        this.top = arguments[1];
                        this.front = arguments[2];

                        this.right = arguments[0] + 1;
                        this.bottom = arguments[1] + 1;
                        this.back = arguments[2] + 1;
                        break;
                    case 6:
                        this.left = arguments[0];
                        this.top = arguments[1];
                        this.front = arguments[2];

                        this.right = arguments[3];
                        this.bottom = arguments[4];
                        this.back = arguments[5];
                        break;
                    case 4:
                        this.left = arguments[0];
                        this.top = arguments[1];
                        this.right = arguments[2];
                        this.bottom = arguments[3];

                        this.back = 1;
                        this.front = 0;
                        break;
                    case 5:
                        akra.logger.error("invalid number of arguments");
                }

                akra.logger.assert(this.right >= this.left && this.bottom >= this.top && this.back >= this.front);

                return this;
            };

            Box.prototype.contains = function (pDest) {
                return (pDest.left >= this.left && pDest.top >= this.top && pDest.front >= this.front && pDest.right <= this.right && pDest.bottom <= this.bottom && pDest.back <= this.back);
            };

            Box.prototype.setPosition = function (iLeft, iTop, iWidth, iHeight, iFront, iDepth) {
                if (typeof iFront === "undefined") { iFront = 0; }
                if (typeof iDepth === "undefined") { iDepth = 1; }
                this.left = iLeft;
                this.top = iTop;
                this.right = iLeft + iWidth;
                this.bottom = iTop + iHeight;
                this.front = iFront;
                this.back = iFront + iDepth;
                return;
            };

            Box.prototype.isEqual = function (pDest) {
                return (pDest.left == this.left && pDest.top == this.top && pDest.front == this.front && pDest.right == this.right && pDest.bottom == this.bottom && pDest.back == this.back);
            };

            Box.prototype.toString = function () {
                return "---------------------------\n" + "left: " + this.left + ", right: " + this.right + "\n" + "top: " + this.top + ", bottom: " + this.bottom + "\n" + "front: " + this.front + ", back: " + this.back + "\n" + "---------------------------";
            };

            Box.temp = function () {
                iElement = (iElement === pBuffer.length - 1 ? 0 : iElement);
                var pBox = pBuffer[iElement++];

                var iLeft = 0, iTop = 0, iFront = 0, iWidth = 0, iHeight = 0, iDepth = 0;

                switch (arguments.length) {
                    case 1:
                        iLeft = arguments[0].left;
                        iTop = arguments[0].top;
                        iFront = arguments[0].front;
                        iWidth = arguments[0].width;
                        iHeight = arguments[0].height;
                        iDepth = arguments[0].depth;
                        break;
                    case 0:
                        iLeft = 0;
                        iTop = 0;
                        iFront = 0;
                        iWidth = 1;
                        iHeight = 1;
                        iDepth = 1;
                        break;
                    case 3:
                        iLeft = arguments[0];
                        iTop = arguments[1];
                        iFront = arguments[2];
                        iWidth = arguments[0] + 1;
                        iHeight = arguments[1] + 1;
                        iDepth = arguments[2] + 1;
                        break;

                    case 6:
                        iLeft = arguments[0];
                        iTop = arguments[1];
                        iFront = arguments[2];
                        iWidth = arguments[3] - arguments[0];
                        iHeight = arguments[4] - arguments[1];
                        iDepth = arguments[5] - arguments[2];
                        break;
                    case 4:
                        iLeft = arguments[0];
                        iTop = arguments[1];
                        iFront = 0;
                        iWidth = arguments[2] - arguments[0];
                        iHeight = arguments[3] - arguments[1];
                        iDepth = 1;
                        break;
                    default:
                        akra.logger.error("Inavlid number of arguments");
                        return null;
                }

                pBox.setPosition(iLeft, iTop, iWidth, iHeight, iFront, iDepth);

                return pBox;
            };
            return Box;
        })();
        geometry.Box = Box;

        pBuffer = akra.gen.array(20, Box);
        iElement = 0;
    })(akra.geometry || (akra.geometry = {}));
    var geometry = akra.geometry;
})(akra || (akra = {}));
//# sourceMappingURL=Box.js.map
