


/*---------------------------------------------
 * assembled at: Tue Jul 02 2013 18:59:28 GMT+0400 (Московское время (зима))
 * directory: tests/common/loader/DEBUG/
 * file: tests/common/loader/loader.ts
 * name: loader
 *--------------------------------------------*/


var akra;
(function (akra) {
    (function (util) {
        var ProgressBar = (function () {
            function ProgressBar(iWidth, iHeight) {
                if (typeof iWidth === "undefined") { iWidth = 256; }
                if (typeof iHeight === "undefined") { iHeight = 256; }
                this.step = 5.;
                this.counterclockwise = false;
                this.radius = 0;
                this.thickness = 20;
                this.total = [
                    10, 
                    5, 
                    3
                ];
                this.border = 10;
                this.lineWidth = 20;
                this.indent = 5;
                this.depth = 0;
                this.element = 0;
                var pCanvas = document.createElement("canvas");
                pCanvas.width = iWidth;
                pCanvas.height = iHeight;
                this.canvas = pCanvas;
                this.context = pCanvas.getContext("2d");
                this.radius = Math.min(iWidth, iHeight) / 2. - this.thickness;
            }
            Object.defineProperty(ProgressBar.prototype, "width", {
                get: function () {
                    return this.canvas.width;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(ProgressBar.prototype, "height", {
                get: function () {
                    return this.canvas.height;
                },
                enumerable: true,
                configurable: true
            });
            ProgressBar.prototype.loaded = function () {
                if (this.element < this.total[this.depth]) {
                    this.loadLevel();
                    this.element++;
                }
            };
            ProgressBar.prototype.next = function () {
                if (this.depth < this.total.length) {
                    this.element = 0;
                    this.depth++;
                }
            };
            ProgressBar.prototype.loadLevel = function (i, iDepth) {
                if (typeof i === "undefined") { i = this.element; }
                if (typeof iDepth === "undefined") { iDepth = this.depth; }
                var fFrom = 360 / this.total[iDepth] * i + this.border / 2.;
                var fTo = 360 / this.total[iDepth] * (i + 1) - this.border / 2.;
                this.animate(fFrom, fTo, iDepth);
            };
            ProgressBar.prototype.animate = function (fFrom, fTo, iDepth) {
                if (typeof fFrom === "undefined") { fFrom = 0; }
                if (typeof fTo === "undefined") { fTo = 360; }
                if (typeof iDepth === "undefined") { iDepth = 0; }
                var _this = this;
                var x = this.width / 2., y = this.height / 2.;
                var pCtx = this.context;
                var fCurrent = fFrom;
                var fRatio = ProgressBar.RADIAN_RATIO;
                var iTimer = setInterval(/** @inline */function () {
                    var fNext = fCurrent + _this.step;
                    pCtx.beginPath();
                    pCtx.arc(x, y, _this.radius - iDepth * (_this.lineWidth + _this.indent), fCurrent * fRatio, fNext * fRatio, _this.counterclockwise);
                    pCtx.lineWidth = _this.lineWidth;
                    pCtx.lineCap = "butt";
                    pCtx.strokeStyle = "#000000";
                    pCtx.stroke();
                    fCurrent = fNext;
                    if (fCurrent >= fTo) {
                        clearInterval(iTimer);
                    }
                }, 5);
            };
            ProgressBar.RADIAN_RATIO = Math.PI / 180.0;
            ProgressBar.prototype.valueOf = function () {
                return this.canvas;
            };
            return ProgressBar;
        })();
        util.ProgressBar = ProgressBar;        
    })(akra.util || (akra.util = {}));
    var util = akra.util;
})(akra || (akra = {}));
var akra;
(function (akra) {
    akra.bar = new akra.util.ProgressBar();
    document.body.appendChild(akra.bar.canvas);
})(akra || (akra = {}));