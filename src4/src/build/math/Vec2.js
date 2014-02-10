/// <reference path="../common.ts" />
/// <reference path="../logger.ts" />
/// <reference path="../idl/IVec2.ts" />
/// <reference path="math.ts" />
/// <reference path="../gen/generate.ts" />
var akra;
(function (akra) {
    (function (math) {
        var pBuffer;
        var iElement;

        var Vec2 = (function () {
            function Vec2(x, y) {
                this.x = 0.;
                this.y = 0.;
                var n = arguments.length;
                var v = this;

                switch (n) {
                    case 1:
                        v.set(arguments[0]);
                        break;
                    case 2:
                        v.set(arguments[0], arguments[1]);
                        break;
                    default:
                        v.x = v.y = 0.;
                }
            }
            Vec2.prototype.set = function (x, y) {
                var n = arguments.length;

                switch (n) {
                    case 0:
                        this.x = this.y = 0.;
                        break;
                    case 1:
                        if (akra.isFloat(arguments[0])) {
                            this.x = this.y = arguments[0];
                        } else if (arguments[0] instanceof Vec2) {
                            var v2fVec = arguments[0];

                            this.x = v2fVec.x;
                            this.y = v2fVec.y;
                        } else {
                            var pArray = arguments[0];

                            this.x = pArray[0];
                            this.y = pArray[1];
                        }
                        break;
                    case 2:
                        this.x = arguments[0];
                        this.y = arguments[1];
                        break;
                }

                return this;
            };

            /**  */ Vec2.prototype.clear = function () {
                this.x = this.y = 0.;
                return this;
            };

            Vec2.prototype.add = function (v2fVec, v2fDestination) {
                if (!akra.isDef(v2fDestination)) {
                    v2fDestination = this;
                }

                v2fDestination.x = this.x + v2fVec.x;
                v2fDestination.y = this.y + v2fVec.y;

                return v2fDestination;
            };

            Vec2.prototype.subtract = function (v2fVec, v2fDestination) {
                if (!akra.isDef(v2fDestination)) {
                    v2fDestination = this;
                }

                v2fDestination.x = this.x - v2fVec.x;
                v2fDestination.y = this.y - v2fVec.y;

                return v2fDestination;
            };

            /**  */ Vec2.prototype.dot = function (v2fVec) {
                return this.x * v2fVec.x + this.y * v2fVec.y;
            };

            Vec2.prototype.isEqual = function (v2fVec, fEps) {
                if (typeof fEps === "undefined") { fEps = 0.; }
                if (fEps === 0.) {
                    if (this.x != v2fVec.x || this.y != v2fVec.y) {
                        return false;
                    }
                } else {
                    if (akra.math.abs(this.x - v2fVec.x) > fEps || akra.math.abs(this.y - v2fVec.y) > fEps) {
                        return false;
                    }
                }

                return true;
            };

            Vec2.prototype.isClear = function (fEps) {
                if (typeof fEps === "undefined") { fEps = 0.; }
                if (fEps === 0.) {
                    if (this.x != 0. || this.y != 0.) {
                        return false;
                    }
                } else {
                    if (akra.math.abs(this.x) > fEps || akra.math.abs(this.y) > fEps) {
                        return false;
                    }
                }

                return true;
            };

            Vec2.prototype.negate = function (v2fDestination) {
                if (!akra.isDef(v2fDestination)) {
                    v2fDestination = this;
                }

                v2fDestination.x = -this.x;
                v2fDestination.y = -this.y;

                return v2fDestination;
            };

            Vec2.prototype.scale = function (fScale, v2fDestination) {
                if (!akra.isDef(v2fDestination)) {
                    v2fDestination = this;
                }

                v2fDestination.x = this.x * fScale;
                v2fDestination.y = this.y * fScale;

                return v2fDestination;
            };

            Vec2.prototype.normalize = function (v2fDestination) {
                if (!akra.isDef(v2fDestination)) {
                    v2fDestination = this;
                }

                var x = this.x, y = this.y;
                var fLength = akra.math.sqrt(x * x + y * y);

                if (fLength !== 0.) {
                    var fInvLength = 1. / fLength;

                    x *= fInvLength;
                    y *= fInvLength;
                }

                v2fDestination.x = x;
                v2fDestination.y = y;

                return v2fDestination;
            };

            /**  */ Vec2.prototype.length = function () {
                var x = this.x, y = this.y;
                return akra.math.sqrt(x * x + y * y);
            };

            /**  */ Vec2.prototype.lengthSquare = function () {
                var x = this.x, y = this.y;
                return x * x + y * y;
            };

            Vec2.prototype.direction = function (v2fVec, v2fDestination) {
                if (!akra.isDef(v2fDestination)) {
                    v2fDestination = this;
                }

                var x = v2fVec.x - this.x;
                var y = v2fVec.y - this.y;

                var fLength = akra.math.sqrt(x * x + y * y);

                if (fLength !== 0.) {
                    var fInvLength = 1. / fLength;

                    x *= fInvLength;
                    y *= fInvLength;
                }

                v2fDestination.x = x;
                v2fDestination.y = y;

                return v2fDestination;
            };

            Vec2.prototype.mix = function (v2fVec, fA, v2fDestination) {
                if (!akra.isDef(v2fDestination)) {
                    v2fDestination = this;
                }

                fA = akra.math.clamp(fA, 0., 1.);

                var fA1 = 1. - fA;
                var fA2 = fA;

                v2fDestination.x = fA1 * this.x + fA2 * v2fVec.x;
                v2fDestination.y = fA1 * this.y + fA2 * v2fVec.y;

                return v2fDestination;
            };

            /**  */ Vec2.prototype.toString = function () {
                return "[x: " + this.x + ", y: " + this.y + "]";
            };

            Vec2.prototype.clone = function (sForm, v2fDest) {
                if (!akra.isDefAndNotNull(v2fDest)) {
                    v2fDest = Vec2.temp();
                }

                switch (sForm) {
                    case "xx":
                        return v2fDest.set(this.x);
                    case "xy":
                        return v2fDest.set(this.x, this.y);
                    case "yx":
                        return v2fDest.set(this.y, this.x);
                    case "yy":
                        return v2fDest.set(this.y);
                }

                akra.logger.error("Bad vector form", sForm);
                return null;
            };

            Vec2.prototype.copy = function (sForm, pVec2OrFloat) {
                var v2fFrom = akra.isFloat(pVec2OrFloat) ? Vec2.temp(pVec2OrFloat) : pVec2OrFloat;

                switch (sForm) {
                    case "xx":
                        this.x = v2fFrom.x;
                        this.x = v2fFrom.y;
                        break;
                    case "xy":
                        this.x = v2fFrom.x;
                        this.y = v2fFrom.y;
                        break;
                    case "yx":
                        this.y = v2fFrom.x;
                        this.x = v2fFrom.y;
                        break;
                    case "yy":
                        this.y = v2fFrom.x;
                        this.y = v2fFrom.y;
                        break;
                    default:
                        akra.logger.error("Bad vector form", sForm);
                        break;
                }

                return this;
            };

            Vec2.temp = function (x, y) {
                iElement = ((iElement === pBuffer.length - 1) ? 0 : iElement);
                var p = pBuffer[iElement++];
                return p.set.apply(p, arguments);
            };
            return Vec2;
        })();
        math.Vec2 = Vec2;

        pBuffer = akra.gen.array(256, Vec2);
        iElement = 0;
    })(akra.math || (akra.math = {}));
    var math = akra.math;
})(akra || (akra = {}));
//# sourceMappingURL=Vec2.js.map
