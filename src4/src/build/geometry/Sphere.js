/// <reference path="../idl/ISphere.ts" />
/// <reference path="../math/math.ts" />
/// <reference path="Circle.ts" />
var akra;
(function (akra) {
    (function (geometry) {
        var Vec3 = akra.math.Vec3;
        var Vec4 = akra.math.Vec4;
        var Quat4 = akra.math.Quat4;
        var Mat3 = akra.math.Mat3;

        var Sphere = (function () {
            function Sphere(fCenterX, fCenterY, fCenterZ, fRadius) {
                var nArgumentsLength = arguments.length;

                switch (nArgumentsLength) {
                    case 1:
                        var pSphere = arguments[0];

                        this.center = new Vec3(pSphere.v3fCenter);
                        this.radius = pSphere.fRadius;
                        break;
                    case 2:
                        var v3fCenter = arguments[0];

                        //var fRadius: float = arguments[1];
                        this.center = new Vec3(v3fCenter);
                        this.radius = arguments[1];
                        break;
                    case 4:
                        this.center = new Vec3(arguments[0], arguments[1], arguments[2]);
                        this.radius = arguments[3];
                        break;
                    default:
                        this.center = new Vec3();
                        this.radius = 0.;
                        break;
                }
            }
            Sphere.prototype.getCircle = function () {
                var v3fCenter = this.center;
                return new akra.geometry.Circle(v3fCenter.x, v3fCenter.y, this.radius);
            };

            Sphere.prototype.setCircle = function (pCircle) {
                var v3fCenter = this.center;
                var v2fCircleCenter = pCircle.center;
                v3fCenter.x = v2fCircleCenter.x;
                v3fCenter.y = v2fCircleCenter.y;
                this.radius = pCircle.radius;
            };

            Sphere.prototype.getZ = function () {
                return this.center.z;
            };

            Sphere.prototype.setZ = function (fZ) {
                this.center.z = fZ;
            };

            Sphere.prototype.set = function (fCenterX, fCenterY, fCenterZ, fRadius) {
                var nArgumentsLength = arguments.length;

                switch (nArgumentsLength) {
                    case 1:
                        var pSphere = arguments[0];

                        this.center.set(pSphere.center);
                        this.radius = pSphere.radius;
                        break;
                    case 2:
                        var v3fCenter = arguments[0];

                        //var fRadius: float = arguments[1];
                        this.center.set(v3fCenter);
                        this.radius = arguments[1];
                        break;
                    case 4:
                        this.center.set(arguments[0], arguments[1], arguments[2]);
                        this.radius = arguments[3];
                        break;
                    default:
                        this.center.set(0.);
                        this.radius = 0.;
                        break;
                }

                return this;
            };

            /**  */ Sphere.prototype.clear = function () {
                this.center.clear();
                this.radius = 0.;

                return this;
            };

            /**  */ Sphere.prototype.isEqual = function (pSphere) {
                return this.center.isEqual(pSphere.center) && (this.radius == pSphere.radius);
            };

            /**  */ Sphere.prototype.isClear = function () {
                return this.center.isClear() && (this.radius === 0.);
            };

            /**  */ Sphere.prototype.isValid = function () {
                return (this.radius >= 0.);
            };

            /**  */ Sphere.prototype.offset = function (v3fOffset) {
                this.center.add(v3fOffset);
                return this;
            };

            /**  */ Sphere.prototype.expand = function (fInc) {
                this.radius += fInc;
                return this;
            };

            /**  */ Sphere.prototype.normalize = function () {
                this.radius = akra.math.abs(this.radius);
                return this;
            };

            Sphere.prototype.transform = function (m4fMatrix) {
                var v4fTmp = Vec4.temp(this.center, 1.);
                v4fTmp = m4fMatrix.multiplyVec4(v4fTmp);

                this.center.set(v4fTmp.clone("xyz"));

                var m3fTmp = m4fMatrix.toMat3(Mat3.temp());
                var v3fScale = Vec3.temp();

                m3fTmp.decompose(Quat4.temp(), v3fScale);

                var fScaleX = akra.math.abs(v3fScale.x);
                var fScaleY = akra.math.abs(v3fScale.y);
                var fScaleZ = akra.math.abs(v3fScale.z);

                var fMaxScale;

                if (fScaleX >= fScaleY && fScaleX >= fScaleZ) {
                    fMaxScale = fScaleX;
                } else if (fScaleY >= fScaleX && fScaleY >= fScaleZ) {
                    fMaxScale = fScaleY;
                } else {
                    fMaxScale = fScaleZ;
                }

                this.radius *= fMaxScale;

                return this;
            };
            return Sphere;
        })();
        geometry.Sphere = Sphere;
    })(akra.geometry || (akra.geometry = {}));
    var geometry = akra.geometry;
})(akra || (akra = {}));
//# sourceMappingURL=Sphere.js.map
