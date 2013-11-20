/// <reference path="../idl/AIPlane3d.ts" />
define(["require", "exports", "math", "intersect"], function(require, exports, __math__, __intersect__) {
    var math = __math__;
    var Vec3 = math.Vec3;

    var intersect = __intersect__;

    var Plane3d = (function () {
        function Plane3d(v3fPoint1, v3fPoint2, v3fPoint3) {
            this.normal = new Vec3();
            this.distance = 0.;

            var nArgumentsLength = arguments.length;

            switch (nArgumentsLength) {
                case 1:
                    this.set(arguments[0]);
                    break;
                case 2:
                    this.set(arguments[0], arguments[1]);
                    break;
                case 3:
                    this.set(arguments[0], arguments[1], arguments[2]);
                    break;
                default:
                    break;
            }
        }
        Plane3d.prototype.set = function () {
            var nArgumentsLength = arguments.length;

            switch (nArgumentsLength) {
                case 1:
                    var pPlane = arguments[0];

                    this.normal.set(pPlane.normal);
                    this.distance = pPlane.distance;
                    break;
                case 2:
                    this.normal.set(arguments[0]);
                    this.distance = arguments[1];
                    break;
                case 3:
                    var v3fPoint1 = arguments[0];
                    var v3fPoint2 = arguments[1];
                    var v3fPoint3 = arguments[2];

                    var x1 = v3fPoint2.x - v3fPoint1.x;
                    var y1 = v3fPoint2.y - v3fPoint1.y;
                    var z1 = v3fPoint2.z - v3fPoint1.z;

                    var x2 = v3fPoint3.x - v3fPoint1.x;
                    var y2 = v3fPoint3.y - v3fPoint1.y;
                    var z2 = v3fPoint3.z - v3fPoint1.z;

                    var x = y1 * z2 - y2 * z1;
                    var y = z1 * x2 - z2 * x1;
                    var z = x1 * y2 - x2 * y1;

                    this.distance = -(x * v3fPoint1.x + y * v3fPoint1.y + z * v3fPoint1.z);
                    this.normal.set(x, y, z);

                    break;
                default:
                    this.normal.clear();
                    this.distance = 0.;
                    break;
            }

            return this.normalize();
        };

        /** inline */ Plane3d.prototype.clear = function () {
            this.normal.clear();
            this.distance = 0.;
            return this;
        };

        /** inline */ Plane3d.prototype.negate = function () {
            this.normal.negate();
            this.distance = -this.distance;
            return this;
        };

        Plane3d.prototype.normalize = function () {
            var v3fNormal = this.normal;
            var x = v3fNormal.x, y = v3fNormal.y, z = v3fNormal.z;

            var fLength = math.sqrt(x * x + y * y + z * z);

            if (fLength !== 0.) {
                var fInvLength = 1. / fLength;

                v3fNormal.x = x * fInvLength;
                v3fNormal.y = y * fInvLength;
                v3fNormal.z = z * fInvLength;

                this.distance *= fInvLength;
            }

            return this;
        };

        Plane3d.prototype.isEqual = function (pPlane) {
            return this.normal.isEqual(pPlane.normal) && (this.distance == pPlane.distance);
        };

        /*предполагается работа только с нормализованной плоскостью*/
        Plane3d.prototype.projectPointToPlane = function (v3fPoint, v3fDestination) {
            if (!isDef(v3fDestination)) {
                v3fDestination = new Vec3();
            }

            var v3fNormal = this.normal;
            var fDistance = this.distance + v3fNormal.dot(v3fPoint);

            v3fDestination.x = v3fPoint.x - fDistance * v3fNormal.x;
            v3fDestination.y = v3fPoint.y - fDistance * v3fNormal.y;
            v3fDestination.z = v3fPoint.z - fDistance * v3fNormal.z;

            return v3fDestination;
        };

        Plane3d.prototype.solveForX = function (fY, fZ) {
            /*Ax+By+Cz+D=0;
            x = -(D+By+Cz)/A;*/
            var v3fNormal = this.normal;

            if (v3fNormal.x !== 0.) {
                return -(this.distance + v3fNormal.y * fY + v3fNormal.z * fZ) / v3fNormal.x;
            }
            return 0.;
        };

        Plane3d.prototype.solveForY = function (fX, fZ) {
            /*Ax+By+Cz+D=0;
            y = -(D+Ax+Cz)/B;*/
            var v3fNormal = this.normal;

            if (v3fNormal.y !== 0.) {
                return -(this.distance + v3fNormal.x * fX + v3fNormal.z * fZ) / v3fNormal.y;
            }
            return 0.;
        };

        Plane3d.prototype.solveForZ = function (fX, fY) {
            /*Ax+By+Cz+D=0;
            z = -(D+Ax+By)/C;*/
            var v3fNormal = this.normal;

            if (v3fNormal.z !== 0.) {
                return -(this.distance + v3fNormal.x * fX + v3fNormal.y * fY) / v3fNormal.z;
            }

            return 0.;
        };

        Plane3d.prototype.intersectRay3d = function (pRay, vDest) {
            if (!intersect.plane3dRay3d(this, pRay)) {
                return false;
            }

            var r0 = pRay.point;
            var n = this.normal;
            var l = pRay.normal;
            var d = this.distance;

            var t0 = -(r0.dot(n) + d) / (l.dot(n));

            vDest.set(r0.x + l.x * t0, r0.y + l.y * t0, r0.z + l.z * t0);
            return true;
        };

        Plane3d.prototype.signedDistance = function (v3fPoint) {
            return this.distance + this.normal.dot(v3fPoint);
        };

        Plane3d.prototype.toString = function () {
            return "normal: " + this.normal.toString() + "; distance: " + this.distance;
        };
        return Plane3d;
    })();

    
    return Plane3d;
});
//# sourceMappingURL=Plane3d.js.map
