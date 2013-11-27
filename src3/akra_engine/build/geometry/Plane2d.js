/// <reference path="../idl/AIPlane2d.ts" />
define(["require", "exports", "math"], function(require, exports, __math__) {
    var math = __math__;
    var Vec2 = math.Vec2;

    var Plane2d = (function () {
        function Plane2d(v2fPoint1, v2fPoint2) {
            this.normal = new Vec2();
            this.distance = 0.;

            var nArgumentsLength = arguments.length;

            switch (nArgumentsLength) {
                case 1:
                    this.set(arguments[0]);
                    break;
                case 2:
                    this.set(arguments[0], arguments[1]);
                    break;
                default:
                    break;
            }
        }
        Plane2d.prototype.set = function (v2fPoint1, v2fPoint2) {
            var nArgumentsLength = arguments.length;

            switch (nArgumentsLength) {
                case 1:
                    var pPlane = arguments[0];

                    this.normal.set(pPlane.normal);
                    this.distance = pPlane.distance;
                    break;
                case 2:
                    if (isFloat(arguments[1])) {
                        this.normal.set(arguments[0]);
                        this.distance = arguments[1];
                    } else {
                        var v2fLine = vec2(arguments[1]).subtract(arguments[0]);
                        var v2fNormal = this.normal;

                        v2fNormal.set(-v2fLine.y, v2fLine.x);
                        this.distance = -v2fNormal.dot(arguments[0]);
                    }
                    break;
                default:
                    this.normal.clear();
                    this.distance = 0.;
                    break;
            }

            return this.normalize();
        };

        /** inline */ Plane2d.prototype.clear = function () {
            this.normal.clear();
            this.distance = 0.;
            return this;
        };

        /** inline */ Plane2d.prototype.negate = function () {
            this.normal.negate();
            this.distance = -this.distance;
            return this;
        };

        Plane2d.prototype.normalize = function () {
            var v2fNormal = this.normal;

            var x = v2fNormal.x;
            var y = v2fNormal.y;

            var fLength = math.sqrt(x * x + y * y);

            if (fLength !== 0.) {
                var fInvLength = 1. / fLength;

                v2fNormal.x = x * fInvLength;
                v2fNormal.y = y * fInvLength;

                this.distance = this.distance * fInvLength;
            }

            return this;
        };

        /** inline */ Plane2d.prototype.isEqual = function (pPlane) {
            return this.normal.isEqual(pPlane.normal) && (this.distance == pPlane.distance);
        };

        /*предполагается работа только с нормализованной плоскостью*/
        Plane2d.prototype.projectPointToPlane = function (v2fPoint, v2fDestination) {
            if (!isDef(v2fDestination)) {
                v2fDestination = new Vec2();
            }

            var v2fNormal = this.normal;
            var fDistance = this.distance + v2fNormal.dot(v2fPoint);

            v2fDestination.x = v2fPoint.x - fDistance * v2fNormal.x;
            v2fDestination.y = v2fPoint.y - fDistance * v2fNormal.y;

            return v2fDestination;
        };

        Plane2d.prototype.solveForX = function (fY) {
            /*Ax+By+d=0;
            x=-(d+By)/A;*/
            var v2fNormal = this.normal;

            if (v2fNormal.x !== 0.) {
                return -(this.distance + v2fNormal.y * fY) / v2fNormal.x;
            }
            return 0.;
        };

        Plane2d.prototype.solveForY = function (fX) {
            /*Ax+By+d=0;
            y=-(d+Ax)/B;*/
            var v2fNormal = this.normal;

            if (v2fNormal.y !== 0.) {
                return -(this.distance + v2fNormal.x * fX) / v2fNormal.y;
            }
            return 0.;
        };

        /*предполагается работа только с нормализованной плоскостью*/
        /** inline */ Plane2d.prototype.signedDistance = function (v2fPoint) {
            return this.distance + this.normal.dot(v2fPoint);
        };

        Plane2d.prototype.toString = function () {
            return "normal: " + this.normal.toString() + "; distance: " + this.distance;
        };
        return Plane2d;
    })();

    
    return Plane2d;
});
//# sourceMappingURL=Plane2d.js.map
