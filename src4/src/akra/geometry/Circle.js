var akra;
(function (akra) {
    /// <reference path="../idl/ICircle.ts" />
    /// <reference path="../math/math.ts" />
    (function (geometry) {
        var Vec2 = math.Vec2;

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

            /**  */ Circle.prototype.clear = function () {
                this.center.clear();
                this.radius = 0.;

                return this;
            };

            /**  */ Circle.prototype.isEqual = function (pCircle) {
                return this.center.isEqual(pCircle.center) && (this.radius == pCircle.radius);
            };

            /**  */ Circle.prototype.isClear = function () {
                return this.center.isClear() && (this.radius === 0.);
            };

            /**  */ Circle.prototype.isValid = function () {
                return (this.radius >= 0.);
            };

            /**  */ Circle.prototype.offset = function (v2fOffset) {
                this.center.add(v2fOffset);
                return this;
            };

            /**  */ Circle.prototype.expand = function (fInc) {
                this.radius += fInc;
                return this;
            };

            /**  */ Circle.prototype.normalize = function () {
                this.radius = akra.math.abs(this.radius);
                return this;
            };
            return Circle;
        })();
        geometry.Circle = Circle;
    })(akra.geometry || (akra.geometry = {}));
    var geometry = akra.geometry;
})(akra || (akra = {}));
