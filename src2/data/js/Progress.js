var akra;
(function (akra) {
    (function (util) {
        var Progress = (function () {
            function Progress(iWidth, iHeight, iFontSize) {
                if (typeof iWidth === "undefined") { iWidth = 400; }
                if (typeof iHeight === "undefined") { iHeight = 150; }
                if (typeof iFontSize === "undefined") { iFontSize = 18; }
                this.step = 5.;
                this.counterclockwise = false;
                this.radius = 0;
                this.thickness = 12;
                this.total = [
                    10, 
                    5, 
                    3
                ];
                this.border = 2;
                this.lineWidth = 4;
                this.indent = 2;
                this.color = "#000000";
                this.depth = 0;
                this.element = 0;
                this.fontColor = "black";
                this.fontSize = 30;
                this.size = 0;
                this._iLastIntervalId = null;
                var pCanvas = document.createElement("canvas");
                this.fontSize = iFontSize;
                this.size = Math.min(iWidth, iHeight);
                pCanvas.width = iWidth;
                pCanvas.height = iHeight;
                this.canvas = pCanvas;
                this.context = pCanvas.getContext("2d");
                this.radius = this.size / 2. - this.fontSize;
            }
            Object.defineProperty(Progress.prototype, "width", {
                get: function () {
                    return this.canvas.width;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Progress.prototype, "height", {
                get: function () {
                    return this.canvas.height;
                },
                enumerable: true,
                configurable: true
            });
            Progress.prototype.loaded = function () {
                if (this.element < this.total[this.depth]) {
                    this.draw();
                    this.element++;
                }
            };
            Progress.prototype.next = function () {
                if (this.depth < this.total.length) {
                    this.element = 0;
                    this.depth++;
                }
            };
            Progress.prototype.reset = function () {
                this.depth = 0;
                this.element = 0;
                this.context.clearRect(0, 0, this.width, this.height);
            };
            Progress.prototype.draw = function () {
                this.loadLevel();
                //this.updateInfo();
                            };
            Progress.prototype.cancel = function () {
                clearInterval(this._iLastIntervalId);
            };
            Progress.prototype.drawText = function (sText) {
                if (this._iLastIntervalId !== null) {
                    clearInterval(this._iLastIntervalId);
                }
                var iCounter = 0;
                var me = this;
                var fnDraw = /** @inline */function () {
                    var sSuffix = "";
                    if (iCounter % 3 === 0) {
                        sSuffix = ".  ";
                    } else if (iCounter % 3 === 1) {
                        sSuffix = ".. ";
                    } else if (iCounter % 3 === 2) {
                        sSuffix = "...";
                    }
                    //else sSuffix = ".";
                    iCounter++;
                    me.printText(sText + sSuffix);
                };
                this._iLastIntervalId = setInterval(/** @inline */function () {
                    /*not inlined, because supportes only single statement functions(cur. st. count: 5)*/fnDraw();
                }, 333);
                /*not inlined, because supportes only single statement functions(cur. st. count: 5)*/fnDraw();
            };
            Progress.prototype.printText = function (sText) {
                var pCtx = this.context;
                var x = this.width / 2.;
                var y = this.height - 2;
                pCtx.clearRect(0, y - this.fontSize, this.width, this.height);
                pCtx.textBaseline = "bottom";
                pCtx.fillStyle = this.fontColor;
                pCtx.textAlign = "center";
                pCtx.font = " " + this.fontSize + "px Tahoma";
                pCtx.fillText(sText, x, y);
            };
            Progress.prototype.updateInfo = function () {
                var pCtx = this.context;
                var x = this.size;
                var y = this.size - this.fontSize - 2;
                var n = 0;
                var m = 0;
                for(var i = 0; i < this.total.length; ++i) {
                    if (i < this.depth) {
                        m += this.total[i];
                    }
                    n += this.total[i];
                }
                m += this.element;
                pCtx.clearRect(x, 0, this.width, this.height);
                pCtx.fillStyle = this.fontColor;
                pCtx.font = "bold " + this.fontSize + "px Consolas";
                /*this.depth / this.total.length*/
                pCtx.fillText(((m / n) * 100).toFixed(1) + "%", x, y);
            };
            Progress.prototype.loadLevel = function (i, iDepth) {
                if (typeof i === "undefined") { i = this.element; }
                if (typeof iDepth === "undefined") { iDepth = this.depth; }
                var fFrom = 360 / this.total[iDepth] * i + this.border / 2.;
                var fTo = 360 / this.total[iDepth] * (i + 1) - this.border / 2.;
                this.animate(fFrom, fTo, iDepth);
            };
            Progress.prototype.animate = function (fFrom, fTo, iDepth) {
                if (typeof fFrom === "undefined") { fFrom = 0; }
                if (typeof fTo === "undefined") { fTo = 360; }
                if (typeof iDepth === "undefined") { iDepth = 0; }
                var _this = this;
                var x = this.width / 2., y = this.radius + this.lineWidth;
                var pCtx = this.context;
                var fCurrent = fFrom;
                var fRatio = Progress.RADIAN_RATIO;
                var iTimer = setInterval(/** @inline */function () {
                    var fNext = fCurrent + _this.step;
                    pCtx.beginPath();
                    pCtx.arc(x, y, Math.max(0, _this.radius - iDepth * (_this.lineWidth + _this.indent)), fCurrent * fRatio, fNext * fRatio, _this.counterclockwise);
                    pCtx.lineWidth = _this.lineWidth;
                    pCtx.lineCap = "butt";
                    pCtx.strokeStyle = _this.color;
                    pCtx.stroke();
                    fCurrent = fNext;
                    if (fCurrent >= fTo) {
                        clearInterval(iTimer);
                    }
                }, 5);
            };
            Progress.RADIAN_RATIO = Math.PI / 180.0;
            Progress.prototype.valueOf = function () {
                return this.canvas;
            };
            return Progress;
        })();
        util.Progress = Progress;        
    })(akra.util || (akra.util = {}));
    var util = akra.util;
})(akra || (akra = {}));
// module akra {
//     export var Progress = util.Progress;
// }
// module akra {
//  export var bar = new util.Progress();
//  document.body.appendChild(bar.canvas);
// }
