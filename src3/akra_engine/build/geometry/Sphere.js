/// <reference path="../idl/AISphere.ts" />
define(["require", "exports", "math", "geometry/Circle"], function(require, exports, __math__, __Circle__) {
    var math = __math__;
    var Vec3 = math.Vec3;
    var Vec4 = math.Vec4;
    var Quat4 = math.Quat4;
    var Mat3 = math.Mat3;
    var Circle = __Circle__;

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
                    var fRadius = arguments[1];

                    this.center = new Vec3(v3fCenter);
                    this.radius = fRadius;
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
        Object.defineProperty(Sphere.prototype, "circle", {
            get: function () {
                var v3fCenter = this.center;
                return new Circle(v3fCenter.x, v3fCenter.y, this.radius);
            },
            set: function (pCircle) {
                var v3fCenter = this.center;
                var v2fCircleCenter = pCircle.center;
                v3fCenter.x = v2fCircleCenter.x;
                v3fCenter.y = v2fCircleCenter.y;
                this.radius = pCircle.radius;
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(Sphere.prototype, "z", {
            get: function () {
                return this.center.z;
            },
            set: function (fZ) {
                this.center.z = fZ;
            },
            enumerable: true,
            configurable: true
        });

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
                    var fRadius = arguments[1];

                    this.center.set(v3fCenter);
                    this.radius = fRadius;
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

        /** inline */ Sphere.prototype.clear = function () {
            this.center.clear();
            this.radius = 0.;

            return this;
        };

        /** inline */ Sphere.prototype.isEqual = function (pSphere) {
            return this.center.isEqual(pSphere.center) && (this.radius == pSphere.radius);
        };

        /** inline */ Sphere.prototype.isClear = function () {
            return this.center.isClear() && (this.radius === 0.);
        };

        /** inline */ Sphere.prototype.isValid = function () {
            return (this.radius >= 0.);
        };

        /** inline */ Sphere.prototype.offset = function (v3fOffset) {
            this.center.add(v3fOffset);
            return this;
        };

        /** inline */ Sphere.prototype.expand = function (fInc) {
            this.radius += fInc;
            return this;
        };

        /** inline */ Sphere.prototype.normalize = function () {
            this.radius = math.abs(this.radius);
            return this;
        };

        Sphere.prototype.transform = function (m4fMatrix) {
            var v4fTmp = Vec4.temp(this.center, 1.);
            v4fTmp = m4fMatrix.multiplyVec4(v4fTmp);

            this.center.set(v4fTmp.xyz);

            var m3fTmp = m4fMatrix.toMat3(Mat3.temp());
            var v3fScale = vec3();

            m3fTmp.decompose(Quat4.temp(), v3fScale);

            var fScaleX = math.abs(v3fScale.x);
            var fScaleY = math.abs(v3fScale.y);
            var fScaleZ = math.abs(v3fScale.z);

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

    
    return Sphere;
});
//# sourceMappingURL=Sphere.js.map
