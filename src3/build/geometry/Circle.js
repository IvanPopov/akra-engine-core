/// <reference path="../idl/AICircle.ts" />
define(["require", "exports", "math/Vec2"], function(require, exports, __Vec2__) {
    var Vec2 = __Vec2__;

    var Circle = (function () {
        function Circle(fCenterX, fCenterY, fRadius) {
            var n = arguments.length;

            switch (n) {
                case 1:
                    var pCircle = arguments[0];
                    this.center = new Vec2(pCircle.center);
                    this.radius = pCircle.radius;
                    break;
                case 2:
                    var v2fCenter = arguments[0];
                    var fRadius = arguments[1];

                    this.center = new Vec2(v2fCenter);
                    this.radius = fRadius;
                    break;
                case 3:
                    this.center = new Vec2(arguments[0], arguments[1]);
                    this.radius = arguments[2];
                    break;
                default:
                    this.center = new Vec2();
                    this.radius = 0.;
                    break;
            }
        }
        Circle.prototype.set = function (fCenterX, fCenterY, fRadius) {
            var nArgumentsLength = arguments.length;

            switch (nArgumentsLength) {
                case 1:
                    var pCircle = arguments[0];
                    this.center.set(pCircle.center);
                    this.radius = pCircle.radius;
                    break;
                case 2:
                    var v2fCenter = arguments[0];
                    var fRadius = arguments[1];

                    this.center.set(v2fCenter);
                    this.radius = fRadius;
                    break;
                case 3:
                    this.center.set(arguments[0], arguments[1]);
                    this.radius = arguments[2];
                    break;
                default:
                    this.center.set(0.);
                    this.radius = 0.;
            }

            return this;
        };

        /** inline */ Circle.prototype.clear = function () {
            this.center.clear();
            this.radius = 0.;

            return this;
        };

        /** inline */ Circle.prototype.isEqual = function (pCircle) {
            return this.center.isEqual(pCircle.center) && (this.radius == pCircle.radius);
        };

        /** inline */ Circle.prototype.isClear = function () {
            return this.center.isClear() && (this.radius === 0.);
        };

        /** inline */ Circle.prototype.isValid = function () {
            return (this.radius >= 0.);
        };

        /** inline */ Circle.prototype.offset = function (v2fOffset) {
            this.center.add(v2fOffset);
            return this;
        };

        /** inline */ Circle.prototype.expand = function (fInc) {
            this.radius += fInc;
            return this;
        };

        /** inline */ Circle.prototype.normalize = function () {
            this.radius = math.abs(this.radius);
            return this;
        };
        return Circle;
    })();

    
    return Circle;
});
//# sourceMappingURL=Circle.js.map
