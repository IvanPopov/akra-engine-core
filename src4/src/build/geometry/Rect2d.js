/// <reference path="../idl/IRect2d.ts" />
/// <reference path="../math/math.ts" />
/// <reference path="../logger.ts" />
/// <reference path="Circle.ts" />
var akra;
(function (akra) {
    (function (geometry) {
        var Vec2 = akra.math.Vec2;

        var Rect2d = (function () {
            function Rect2d(fX0, fX1, fY0, fY1) {
                var nArgumentsLength = arguments.length;

                switch (nArgumentsLength) {
                    case 1:
                        this.set(arguments[0]);
                        break;
                    case 2:
                        this.set(arguments[0], arguments[1]);
                        break;
                    case 4:
                        this.set(arguments[0], arguments[1], arguments[2], arguments[3]);
                        break;
                    default:
                        this.x0 = this.x1 = this.y0 = this.y1 = 0.;
                        break;
                }
            }
            Rect2d.prototype.getLeft = function () {
                return this.x0;
            };

            Rect2d.prototype.getTop = function () {
                return this.y0;
            };

            Rect2d.prototype.getWidth = function () {
                return this.x1 - this.x0;
            };

            Rect2d.prototype.getHeight = function () {
                return this.y1 - this.y0;
            };

            Rect2d.prototype.set = function (fX0, fX1, fY0, fY1) {
                var nArgumentsLength = arguments.length;

                switch (nArgumentsLength) {
                    case 1:
                        if (arguments[0] instanceof Rect2d) {
                            var pRect = arguments[0];

                            this.x0 = pRect.x0;
                            this.x1 = pRect.x1;
                            this.y0 = pRect.y0;
                            this.y1 = pRect.y1;
                        } else {
                            var v2fSizes = arguments[0];

                            this.x1 = v2fSizes.x * 0.5;
                            this.x0 = -this.x1;

                            this.y1 = v2fSizes.y * 0.5;
                            this.y0 = -this.y1;
                        }
                        break;
                    case 2:
                        if (akra.isNumber(arguments[0])) {
                            var fSizeX = arguments[0];
                            var fSizeY = arguments[1];

                            this.x1 = fSizeX * 0.5;
                            this.x0 = -this.x1;

                            this.y1 = fSizeY * 0.5;
                            this.y0 = -this.y1;
                        } else {
                            this.x0 = arguments[0].x;
                            this.y0 = arguments[0].y;

                            this.x1 = arguments[1].x;
                            this.y1 = arguments[1].y;
                        }
                        break;
                    case 4:
                        this.x0 = arguments[0];
                        this.x1 = arguments[1];
                        this.y0 = arguments[2];
                        this.y1 = arguments[3];
                        break;
                    default:
                        this.x0 = this.x1 = this.y0 = this.y1 = 0.;
                        break;
                }

                return this;
            };

            Rect2d.prototype.setFloor = function (pRect) {
                this.x0 = akra.math.floor(pRect.x0);
                this.x1 = akra.math.floor(pRect.x1);
                this.y0 = akra.math.floor(pRect.y0);
                this.y1 = akra.math.floor(pRect.y1);

                return this;
            };

            Rect2d.prototype.setCeil = function (pRect) {
                this.x0 = akra.math.ceil(pRect.x0);
                this.x1 = akra.math.ceil(pRect.x1);
                this.y0 = akra.math.ceil(pRect.y0);
                this.y1 = akra.math.ceil(pRect.y1);

                return this;
            };

            Rect2d.prototype.clear = function () {
                this.x0 = this.x1 = this.y0 = this.y1 = 0.;
                return this;
            };

            Rect2d.prototype.addSelf = function () {
                if (akra.isFloat(arguments[0])) {
                    var fValue = arguments[0];

                    this.x0 += fValue;
                    this.x1 += fValue;
                    this.y0 += fValue;
                    this.y1 += fValue;
                } else {
                    var v2fVec = arguments[0];

                    this.x0 += v2fVec.x;
                    this.x1 += v2fVec.x;

                    this.y0 += v2fVec.y;
                    this.y1 += v2fVec.y;
                }

                return this;
            };

            Rect2d.prototype.subSelf = function () {
                if (akra.isFloat(arguments[0])) {
                    var fValue = arguments[0];

                    this.x0 -= fValue;
                    this.x1 -= fValue;
                    this.y0 -= fValue;
                    this.y1 -= fValue;
                } else {
                    var v2fVec = arguments[0];

                    this.x0 -= v2fVec.x;
                    this.x1 -= v2fVec.x;

                    this.y0 -= v2fVec.y;
                    this.y1 -= v2fVec.y;
                }

                return this;
            };

            Rect2d.prototype.multSelf = function () {
                if (akra.isFloat(arguments[0])) {
                    var fValue = arguments[0];

                    this.x0 *= fValue;
                    this.x1 *= fValue;
                    this.y0 *= fValue;
                    this.y1 *= fValue;
                } else {
                    var v2fVec = arguments[0];

                    this.x0 *= v2fVec.x;
                    this.x1 *= v2fVec.x;

                    this.y0 *= v2fVec.y;
                    this.y1 *= v2fVec.y;
                }

                return this;
            };

            Rect2d.prototype.divSelf = function () {
                if (akra.isFloat(arguments[0])) {
                    var fValue = arguments[0];
                    akra.logger.assert(fValue != 0., "divide by zero error");

                    var fInvValue = 1. / fValue;

                    this.x0 *= fInvValue;
                    this.x1 *= fInvValue;
                    this.y0 *= fInvValue;
                    this.y1 *= fInvValue;
                } else {
                    var v2fVec = arguments[0];

                    akra.logger.assert(v2fVec.x != 0., "divide by zero error");
                    akra.logger.assert(v2fVec.y != 0., "divide by zero error");

                    var fInvX = 1. / v2fVec.x;
                    var fInvY = 1. / v2fVec.y;

                    this.x0 *= fInvX;
                    this.x1 *= fInvX;

                    this.y0 *= fInvY;
                    this.y1 *= fInvY;
                }

                return this;
            };

            Rect2d.prototype.offset = function (fOffsetX, fOffsetY) {
                if (arguments.length === 1) {
                    var v2fOffset = arguments[0];

                    this.x0 += v2fOffset.x;
                    this.x1 += v2fOffset.x;

                    this.y0 += v2fOffset.y;
                    this.y1 += v2fOffset.y;
                } else {
                    this.x0 += arguments[0];
                    this.x1 += arguments[0];

                    this.y0 += arguments[1];
                    this.y1 += arguments[1];
                }

                return this;
            };

            Rect2d.prototype.expand = function (fValueX, fValueY) {
                if (arguments.length == 1) {
                    if (akra.isFloat(arguments[0])) {
                        var fValue = arguments[0];

                        this.x0 -= fValue;
                        this.x1 += fValue;

                        this.y0 -= fValue;
                        this.y1 += fValue;
                    } else {
                        var v2fValue = arguments[0];

                        this.x0 -= v2fValue.x;
                        this.x1 += v2fValue.x;

                        this.y0 -= v2fValue.y;
                        this.y1 += v2fValue.y;
                    }
                } else {
                    //arguments.length == 2
                    this.x0 -= arguments[0];
                    this.x1 += arguments[0];

                    this.y0 -= arguments[1];
                    this.y1 += arguments[1];
                }

                return this;
            };

            Rect2d.prototype.expandX = function (fValue) {
                this.x0 -= fValue;
                this.x1 += fValue;

                return this;
            };

            Rect2d.prototype.expandY = function (fValue) {
                this.y0 -= fValue;
                this.y1 += fValue;

                return this;
            };

            Rect2d.prototype.resize = function () {
                var fSizeX, fSizeY;

                if (arguments.length == 1) {
                    var v2fSize = arguments[0];

                    fSizeX = v2fSize.x;
                    fSizeY = v2fSize.y;
                } else {
                    fSizeX = arguments[0];
                    fSizeY = arguments[1];
                }

                this.x1 = (this.x0 + this.x1 + fSizeX) * 0.5;
                this.x0 = this.x1 - fSizeX;

                this.y1 = (this.y0 + this.y1 + fSizeY) * 0.5;
                this.y0 = this.y1 - fSizeY;

                return this;
            };

            Rect2d.prototype.resizeX = function (fSize) {
                this.x1 = (this.x0 + this.x1 + fSize) * 0.5;
                this.x0 = this.x1 - fSize;

                return this;
            };

            Rect2d.prototype.resizeY = function (fSize) {
                this.y1 = (this.y0 + this.y1 + fSize) * 0.5;
                this.y0 = this.y1 - fSize;

                return this;
            };

            Rect2d.prototype.resizeMax = function (fSpanX, fSpanY) {
                if (arguments.length == 1) {
                    var v2fSpan = arguments[0];

                    this.x1 = this.x0 + v2fSpan.x;
                    this.y1 = this.y0 + v2fSpan.y;
                } else {
                    this.x1 = this.x0 + arguments[0];
                    this.y1 = this.y0 + arguments[1];
                }

                return this;
            };

            Rect2d.prototype.resizeMaxX = function (fSpan) {
                this.x1 = this.x0 + fSpan;
                return this;
            };

            Rect2d.prototype.resizeMaxY = function (fSpan) {
                this.y1 = this.y0 + fSpan;
                return this;
            };

            Rect2d.prototype.resizeMin = function (fSpanX, fSpanY) {
                if (arguments.length == 1) {
                    var v2fSpan = arguments[0];

                    this.x0 = this.x1 - v2fSpan.x;
                    this.y0 = this.y1 - v2fSpan.y;
                } else {
                    this.x0 = this.x1 - arguments[0];
                    this.y0 = this.y1 - arguments[1];
                }

                return this;
            };

            Rect2d.prototype.resizeMinX = function (fSpan) {
                this.x0 = this.x1 - fSpan;
                return this;
            };

            Rect2d.prototype.resizeMinY = function (fSpan) {
                this.y0 = this.y1 - fSpan;
                return this;
            };

            Rect2d.prototype.unionPoint = function () {
                if (arguments.length === 1) {
                    var v2fPoint = arguments[0];

                    this.x0 = akra.math.min(this.x0, v2fPoint.x);
                    this.x1 = akra.math.max(this.x1, v2fPoint.x);

                    this.y0 = akra.math.min(this.y0, v2fPoint.y);
                    this.y1 = akra.math.max(this.y1, v2fPoint.y);
                } else {
                    var fX = arguments[0];
                    var fY = arguments[1];

                    this.x0 = akra.math.min(this.x0, fX);
                    this.x1 = akra.math.max(this.x1, fX);

                    this.y0 = akra.math.min(this.y0, fY);
                    this.y1 = akra.math.max(this.y1, fY);
                }

                return this;
            };

            Rect2d.prototype.unionRect = function (pRect) {
                this.normalize();
                pRect.normalize();

                this.x0 = akra.math.min(this.x0, pRect.x0);
                this.x1 = akra.math.max(this.x1, pRect.x1);

                this.y0 = akra.math.min(this.y0, pRect.y0);
                this.y1 = akra.math.max(this.y1, pRect.y1);

                return this;
            };

            Rect2d.prototype.negate = function (pDestination) {
                if (!akra.isDef(pDestination)) {
                    pDestination = this;
                }

                return pDestination.set(-this.x1, -this.x0, -this.y1, -this.y0);
            };

            Rect2d.prototype.normalize = function () {
                var fTmp;
                if (this.x0 > this.x1) {
                    fTmp = this.x0;
                    this.x0 = this.x1;
                    this.x1 = fTmp;
                }
                if (this.y0 > this.y1) {
                    fTmp = this.y0;
                    this.y0 = this.y1;
                    this.y1 = fTmp;
                }
                return this;
            };

            Rect2d.prototype.isEqual = function (pRect) {
                return this.x0 == pRect.x0 && this.x1 == pRect.x1 && this.y0 == pRect.y0 && this.y1 == pRect.y1;
            };

            Rect2d.prototype.isClear = function () {
                return this.x0 == 0. && this.x1 == 0. && this.y0 == 0. && this.y1 == 0.;
            };

            Rect2d.prototype.isValid = function () {
                return this.x0 <= this.x1 && this.y0 <= this.y1;
            };

            Rect2d.prototype.isPointInRect = function (v2fPoint) {
                var x = v2fPoint.x;
                var y = v2fPoint.y;

                return (this.x0 <= x && x <= this.x1) && (this.y0 <= y && y <= this.y1);
            };

            Rect2d.prototype.midPoint = function (v2fDestination) {
                if (!akra.isDef(v2fDestination)) {
                    v2fDestination = new Vec2();
                }

                v2fDestination.x = (this.x0 + this.x1) * 0.5;
                v2fDestination.y = (this.y0 + this.y1) * 0.5;

                return v2fDestination;
            };

            Rect2d.prototype.midX = function () {
                return (this.x0 + this.x1) * 0.5;
            };

            Rect2d.prototype.midY = function () {
                return (this.y0 + this.y1) * 0.5;
            };

            Rect2d.prototype.size = function (v2fDestination) {
                if (!akra.isDef(v2fDestination)) {
                    v2fDestination = new Vec2();
                }

                v2fDestination.x = this.x1 - this.x0;
                v2fDestination.y = this.y1 - this.y0;

                return v2fDestination;
            };

            Rect2d.prototype.sizeX = function () {
                return this.x1 - this.x0;
            };

            Rect2d.prototype.sizeY = function () {
                return this.y1 - this.y0;
            };

            Rect2d.prototype.minPoint = function (v2fDestination) {
                if (!akra.isDef(v2fDestination)) {
                    v2fDestination = new Vec2();
                }

                v2fDestination.x = this.x0;
                v2fDestination.y = this.y0;

                return v2fDestination;
            };

            Rect2d.prototype.maxPoint = function (v2fDestination) {
                if (!akra.isDef(v2fDestination)) {
                    v2fDestination = new Vec2();
                }

                v2fDestination.x = this.x1;
                v2fDestination.y = this.y1;

                return v2fDestination;
            };

            Rect2d.prototype.area = function () {
                return (this.x1 - this.x0) * (this.y1 - this.y0);
            };

            /**
            * counter-clockwise
            * x0,y0 -> x1,y0 -> x1,y1 -> x0,y1;
            */
            Rect2d.prototype.corner = function (iIndex, v2fDestination) {
                if (!akra.isDef(v2fDestination)) {
                    v2fDestination = new Vec2();
                }

                akra.logger.assert(0 <= iIndex && iIndex < 4, "invalid index");

                switch (iIndex) {
                    case 0:
                        v2fDestination.set(this.x0, this.y0);
                        break;
                    case 1:
                        v2fDestination.set(this.x1, this.y0);
                        break;
                    case 2:
                        v2fDestination.set(this.x1, this.y1);
                        break;
                    case 3:
                        v2fDestination.set(this.x0, this.y1);
                        break;
                }
                return v2fDestination;
            };

            Rect2d.prototype.createBoundingCircle = function (pCircle) {
                if (!akra.isDef(pCircle)) {
                    pCircle = new akra.geometry.Circle();
                }

                var fX0 = this.x0, fX1 = this.x1;
                var fY0 = this.y0, fY1 = this.y1;

                var fHalfSizeX = (fX1 - fX0) * 0.5;
                var fHalfSizeY = (fY1 - fY0) * 0.5;

                pCircle.set((fX0 + fX1) * 0.5, (fY0 + fY1) * 0.5, akra.math.sqrt(fHalfSizeX * fHalfSizeX + fHalfSizeY * fHalfSizeY));

                return pCircle;
            };

            Rect2d.prototype.distanceToPoint = function (v2fPoint) {
                var fX = v2fPoint.x, fY = v2fPoint.y;

                var fX0 = this.x0, fY0 = this.y0;
                var fX1 = this.x1, fY1 = this.y1;

                var fXN, fYN;

                fXN = (akra.math.abs(fX0 - fX) < akra.math.abs(fX1 - fX)) ? fX0 : fX1;
                fYN = (akra.math.abs(fY0 - fY) < akra.math.abs(fY1 - fY)) ? fY0 : fY1;

                return akra.math.sqrt((fXN - fX) * (fXN - fX) + (fYN - fY) * (fYN - fY));
            };

            Rect2d.prototype.toString = function () {
                return "(" + this.x0 + ", " + this.y0 + ") --> (" + this.x1 + ", " + this.y1 + ")";
            };
            return Rect2d;
        })();
        geometry.Rect2d = Rect2d;
    })(akra.geometry || (akra.geometry = {}));
    var geometry = akra.geometry;
})(akra || (akra = {}));
//# sourceMappingURL=Rect2d.js.map
