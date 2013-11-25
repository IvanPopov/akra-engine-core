/// <reference path="../idl/AIBox.ts" />
define(["require", "exports", "logger", "generate"], function(require, exports, __logger__, __gen__) {
    var logger = __logger__;
    var gen = __gen__;

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
        Object.defineProperty(Box.prototype, "width", {
            get: function () {
                return this.right - this.left;
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(Box.prototype, "height", {
            get: function () {
                return this.bottom - this.top;
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(Box.prototype, "depth", {
            get: function () {
                return this.back - this.front;
            },
            enumerable: true,
            configurable: true
        });

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
                    logger.error("invalid number of arguments");
            }

            logger.assert(this.right >= this.left && this.bottom >= this.top && this.back >= this.front);

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
        };

        Box.prototype.isEqual = function (pDest) {
            return (pDest.left == this.left && pDest.top == this.top && pDest.front == this.front && pDest.right == this.right && pDest.bottom == this.bottom && pDest.back == this.back);
        };

        Box.prototype.toString = function () {
            return "---------------------------\n" + "left: " + this.left + ", right: " + this.right + "\n" + "top: " + this.top + ", bottom: " + this.bottom + "\n" + "front: " + this.front + ", back: " + this.back + "\n" + "---------------------------";
        };

        Box.temp = function () {
            iElement = (iElement === pBuffer.length - 1 ? 0 : pBuffer.length);
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
                    logger.error("Inavlid number of arguments");
                    return null;
            }

            pBox.setPosition(iLeft, iTop, iWidth, iHeight, iFront, iDepth);

            return pBox;
        };
        return Box;
    })();

    pBuffer = gen.array(20, Box);
    iElement = 0;

    
    return Box;
});
//# sourceMappingURL=Box.js.map
