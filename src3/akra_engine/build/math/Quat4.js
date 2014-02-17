/// <reference path="../idl/common.d.ts" />
/// <reference path="../idl/AIQuat4.ts" />
define(["require", "exports", "generate"], function(require, exports, __gen__) {
    var gen = __gen__;
    

    var sqrt = math.sqrt;
    var abs = math.abs;
    var clamp = math.clamp;

    var atan2 = math.atan2;
    var asin = math.asin;
    var sin = math.sin;
    var cos = math.cos;

    var Mat3 = math.Mat3;
    var Mat4 = math.Mat4;
    var Vec3 = math.Vec3;

    var PI = math.PI;

    var pBuffer;
    var iElement;

    var Quat4 = (function () {
        function Quat4(fX, fY, fZ, fW) {
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
                    this.x = this.y = this.z = 0.;
                    this.w = 1.;
                    break;
            }
        }
        Quat4.prototype.set = function (x, y, z, w) {
            var nArgumentsLength = arguments.length;

            if (nArgumentsLength === 0) {
                this.x = this.y = this.z = 0.;
                this.w = 1.;
            }
            if (nArgumentsLength === 1) {
                if (arguments[0] instanceof Quat4) {
                    var q4fQuat = arguments[0];

                    this.x = q4fQuat.x;
                    this.y = q4fQuat.y;
                    this.z = q4fQuat.z;
                    this.w = q4fQuat.w;
                } else {
                    //Array
                    var pElements = arguments[0];

                    this.x = pElements[0];
                    this.y = pElements[1];
                    this.z = pElements[2];
                    this.w = pElements[3];
                }
            } else if (nArgumentsLength === 2) {
                if (isFloat(arguments[0])) {
                    //float float
                    var fValue = arguments[0];

                    this.x = fValue;
                    this.y = fValue;
                    this.z = fValue;
                    this.w = arguments[1];
                } else {
                    //vec3 float
                    var v3fValue = arguments[0];

                    this.x = v3fValue.x;
                    this.y = v3fValue.y;
                    this.z = v3fValue.z;
                    this.w = arguments[1];
                }
            } else if (nArgumentsLength === 4) {
                this.x = arguments[0];
                this.y = arguments[1];
                this.z = arguments[2];
                this.w = arguments[3];
            }

            return this;
        };

        Quat4.prototype.multiply = function (q4fQuat, q4fDestination) {
            if (!isDef(q4fDestination)) {
                q4fDestination = this;
            }

            var x1 = this.x, y1 = this.y, z1 = this.z, w1 = this.w;
            var x2 = q4fQuat.x, y2 = q4fQuat.y, z2 = q4fQuat.z, w2 = q4fQuat.w;

            q4fDestination.x = x1 * w2 + x2 * w1 + y1 * z2 - z1 * y2;
            q4fDestination.y = y1 * w2 + y2 * w1 + z1 * x2 - x1 * z2;
            q4fDestination.z = z1 * w2 + z2 * w1 + x1 * y2 - y1 * x2;
            q4fDestination.w = w1 * w2 - x1 * x2 - y1 * y2 - z1 * z2;

            return q4fDestination;
        };

        Quat4.prototype.multiplyVec3 = function (v3fVec, v3fDestination) {
            if (!isDef(v3fDestination)) {
                v3fDestination = v3fVec;
            }

            var q4fVec = Quat4.temp(v3fVec, 0.);
            var qInverse = this.inverse(Quat4.temp());
            var qResult = this.multiply(q4fVec.multiply(qInverse), Quat4.temp());

            v3fDestination.x = qResult.x;
            v3fDestination.y = qResult.y;
            v3fDestination.z = qResult.z;

            return v3fDestination;
        };

        Quat4.prototype.conjugate = function (q4fDestination) {
            if (!isDef(q4fDestination)) {
                this.x = -this.x;
                this.y = -this.y;
                this.z = -this.z;

                return this;
            }

            q4fDestination.x = -this.x;
            q4fDestination.y = -this.y;
            q4fDestination.z = -this.z;
            q4fDestination.w = this.w;

            return q4fDestination;
        };

        Quat4.prototype.inverse = function (q4fDestination) {
            if (!isDef(q4fDestination)) {
                q4fDestination = this;
            }

            var x = this.x, y = this.y, z = this.z, w = this.w;
            var fSqLength = x * x + y * y + z * z + w * w;

            if (fSqLength === 0.) {
                q4fDestination.x = 0.;
                q4fDestination.y = 0.;
                q4fDestination.z = 0.;
                q4fDestination.w = 0.;
            } else {
                var fInvSqLength = 1. / fSqLength;
                q4fDestination.x = -x * fInvSqLength;
                q4fDestination.y = -y * fInvSqLength;
                q4fDestination.z = -z * fInvSqLength;
                q4fDestination.w = w * fInvSqLength;
            }

            return q4fDestination;
        };

        /** inline */ Quat4.prototype.length = function () {
            var x = this.x, y = this.y, z = this.z, w = this.w;
            return sqrt(x * x + y * y + z * z + w * w);
        };

        Quat4.prototype.normalize = function (q4fDestination) {
            if (!isDef(q4fDestination)) {
                q4fDestination = this;
            }

            var x = this.x, y = this.y, z = this.z, w = this.w;

            var fLength = sqrt(x * x + y * y + z * z + w * w);

            if (fLength === 0.) {
                q4fDestination.x = 0.;
                q4fDestination.y = 0.;
                q4fDestination.z = 0.;
                q4fDestination.w = 0.;
            } else {
                var fInvLength = 1 / fLength;

                q4fDestination.x = x * fInvLength;
                q4fDestination.y = y * fInvLength;
                q4fDestination.z = z * fInvLength;
                q4fDestination.w = w * fInvLength;
            }

            return q4fDestination;
        };

        Quat4.prototype.calculateW = function (q4fDestination) {
            var x = this.x, y = this.y, z = this.z;

            if (!isDef(q4fDestination)) {
                this.w = sqrt(1. - x * x - y * y - z * z);
                return this;
            }

            q4fDestination.x = x;
            q4fDestination.y = y;
            q4fDestination.z = z;
            q4fDestination.w = sqrt(1. - x * x - y * y - z * z);

            return q4fDestination;
        };

        Quat4.prototype.isEqual = function (q4fQuat, fEps, asMatrix) {
            if (typeof fEps === "undefined") { fEps = 0.; }
            if (typeof asMatrix === "undefined") { asMatrix = false; }
            var x1 = this.x, y1 = this.y, z1 = this.z, w1 = this.w;
            var x2 = q4fQuat.x, y2 = q4fQuat.y, z2 = q4fQuat.z, w2 = q4fQuat.w;

            var fLength1 = sqrt(x1 * x1 + y1 * y1 + z1 * z1 + w1 * w1);
            var fLength2 = sqrt(x2 * x2 + y2 * y2 + z2 * z2 + w2 * w2);

            if (abs(fLength2 - fLength2) > fEps) {
                return false;
            }

            var cosHalfTheta = (x1 * x2 + y1 * y2 + z1 * z2 + w1 * w2) / fLength1 / fLength2;

            if (asMatrix) {
                cosHalfTheta = abs(cosHalfTheta);
            }

            if (1. - cosHalfTheta > fEps) {
                return false;
            }
            return true;
        };

        Quat4.prototype.getYaw = function () {
            var fYaw;

            var x = this.x, y = this.y, z = this.z, w = this.w;

            var fx2 = x * 2.;
            var fy2 = y * 2.;

            if (abs(x) == abs(w)) {
                //вырожденный случай обрабатывается отдельно
                //
                var wTemp = w * sqrt(2.);

                //cos(Yaw/2)*cos(Roll/2) + sin(Yaw/2)*sin(Roll/2) = cos((Yaw-Roll)/2); Roll = 0;
                //x==-w
                //cos(Yaw/2)*cos(Roll/2) - sin(Yaw/2)*sin(Roll/2) = cos((Yaw+Roll)/2); Roll = 0;
                var yTemp = y * sqrt(2.);

                //sin(Yaw/2)*cos(Roll/2) - cos(Yaw/2)*sin(Roll/2) = sin((Yaw-Roll)/2); Roll = 0;
                //x==-w
                //sin(Yaw/2)*cos(Roll/2) + cos(Yaw/2)*sin(Roll/2) = sin((Yaw+Roll)/2); Roll = 0;
                fYaw = atan2(yTemp, wTemp) * 2.;

                //fRoll = 0;
                //убираем дополнительный оборот
                var pi = PI;
                if (fYaw > pi) {
                    fYaw -= pi;
                    //fRoll = (x == w) ? -pi : pi;
                } else if (fYaw < -pi) {
                    fYaw += pi;
                    //fRoll = (x == w) ? pi : -pi;
                }
            } else {
                //Math.atan2(sin(Yaw)*cos(Pitch),cos(Yaw)*cos(Pitch));
                fYaw = atan2(fx2 * z + fy2 * w, 1. - (fx2 * x + fy2 * y));
            }

            return fYaw;
        };

        Quat4.prototype.getPitch = function () {
            var fPitch;

            var x = this.x, y = this.y, z = this.z, w = this.w;

            var fx2 = x * 2.;
            var fy2 = y * 2.;

            var fSinPitch = clamp(fx2 * w - fy2 * z, -1., 1.);
            fPitch = asin(fSinPitch);

            return fPitch;
        };

        Quat4.prototype.getRoll = function () {
            var fRoll;

            var x = this.x, y = this.y, z = this.z, w = this.w;

            var fx2 = x * 2.;
            var fz2 = z * 2.;

            if (abs(x) == abs(w)) {
                //вырожденный случай обрабатывается отдельно
                //
                var wTemp = w * sqrt(2.);

                //cos(Yaw/2)*cos(Roll/2) + sin(Yaw/2)*sin(Roll/2) = cos((Yaw-Roll)/2); Roll = 0;
                //x==-w
                //cos(Yaw/2)*cos(Roll/2) - sin(Yaw/2)*sin(Roll/2) = cos((Yaw+Roll)/2); Roll = 0;
                var yTemp = y * sqrt(2.);

                //sin(Yaw/2)*cos(Roll/2) - cos(Yaw/2)*sin(Roll/2) = sin((Yaw-Roll)/2); Roll = 0;
                //x==-w
                //sin(Yaw/2)*cos(Roll/2) + cos(Yaw/2)*sin(Roll/2) = sin((Yaw+Roll)/2); Roll = 0;
                var fYaw = atan2(yTemp, wTemp) * 2.;
                fRoll = 0.;

                //убираем дополнительный оборот
                var pi = PI;
                if (fYaw > pi) {
                    //fYaw -= pi;
                    fRoll = (x == w) ? -pi : pi;
                } else if (fYaw < -pi) {
                    //fYaw += pi;
                    fRoll = (x == w) ? pi : -pi;
                }
            } else {
                //Math.atan2(cos(Pitch) * sin(Roll),cos(Pitch)*cos(Roll));
                fRoll = atan2(fx2 * y + fz2 * w, 1. - (fx2 * x + fz2 * z));
            }

            return fRoll;
        };

        Quat4.prototype.toYawPitchRoll = function (v3fDestination) {
            if (!isDef(v3fDestination)) {
                v3fDestination = new Vec3();
            }

            var fYaw, fPitch, fRoll;

            var x = this.x, y = this.y, z = this.z, w = this.w;

            var fx2 = x * 2.;
            var fy2 = y * 2.;
            var fz2 = z * 2.;
            var fw2 = w * 2.;

            var fSinPitch = clamp(fx2 * w - fy2 * z, -1., 1.);
            fPitch = asin(fSinPitch);

            if (abs(x) == abs(w)) {
                //вырожденный случай обрабатывается отдельно
                //
                var wTemp = w * sqrt(2.);

                //cos(Yaw/2)*cos(Roll/2) + sin(Yaw/2)*sin(Roll/2) = cos((Yaw-Roll)/2); Roll = 0;
                //x==-w
                //cos(Yaw/2)*cos(Roll/2) - sin(Yaw/2)*sin(Roll/2) = cos((Yaw+Roll)/2); Roll = 0;
                var yTemp = y * sqrt(2.);

                //sin(Yaw/2)*cos(Roll/2) - cos(Yaw/2)*sin(Roll/2) = sin((Yaw-Roll)/2); Roll = 0;
                //x==-w
                //sin(Yaw/2)*cos(Roll/2) + cos(Yaw/2)*sin(Roll/2) = sin((Yaw+Roll)/2); Roll = 0;
                fYaw = atan2(yTemp, wTemp) * 2.;
                fRoll = 0.;

                //убираем дополнительный оборот
                var pi = PI;
                if (fYaw > pi) {
                    fYaw -= pi;
                    fRoll = (x == w) ? -pi : pi;
                } else if (fYaw < -pi) {
                    fYaw += pi;
                    fRoll = (x == w) ? pi : -pi;
                }
            } else {
                //Math.atan2(sin(Yaw)*cos(Pitch),cos(Yaw)*cos(Pitch));
                fYaw = atan2(fx2 * z + fy2 * w, 1. - (fx2 * x + fy2 * y));

                //Math.atan2(cos(Pitch) * sin(Roll),cos(Pitch)*cos(Roll));
                fRoll = atan2(fx2 * y + fz2 * w, 1. - (fx2 * x + fz2 * z));
            }

            v3fDestination.x = fYaw;
            v3fDestination.y = fPitch;
            v3fDestination.z = fRoll;

            return v3fDestination;
        };

        Quat4.prototype.toMat3 = function (m3fDestination) {
            if (!isDef(m3fDestination)) {
                m3fDestination = new Mat3();
            }
            var pDataDestination = m3fDestination.data;

            var x = this.x, y = this.y, z = this.z, w = this.w;

            //потом необходимо ускорить
            pDataDestination[__a11] = 1. - 2. * (y * y + z * z);
            pDataDestination[__a12] = 2. * (x * y - z * w);
            pDataDestination[__a13] = 2. * (x * z + y * w);

            pDataDestination[__a21] = 2. * (x * y + z * w);
            pDataDestination[__a22] = 1. - 2. * (x * x + z * z);
            pDataDestination[__a23] = 2. * (y * z - x * w);

            pDataDestination[__a31] = 2. * (x * z - y * w);
            pDataDestination[__a32] = 2. * (y * z + x * w);
            pDataDestination[__a33] = 1. - 2. * (x * x + y * y);

            return m3fDestination;
        };

        Quat4.prototype.toMat4 = function (m4fDestination) {
            if (!isDef(m4fDestination)) {
                m4fDestination = new Mat4();
            }
            var pDataDestination = m4fDestination.data;

            var x = this.x, y = this.y, z = this.z, w = this.w;

            //потом необходимо ускорить
            pDataDestination[__11] = 1. - 2. * (y * y + z * z);
            pDataDestination[__12] = 2. * (x * y - z * w);
            pDataDestination[__13] = 2. * (x * z + y * w);
            pDataDestination[__14] = 0.;

            pDataDestination[__21] = 2. * (x * y + z * w);
            pDataDestination[__22] = 1. - 2. * (x * x + z * z);
            pDataDestination[__23] = 2. * (y * z - x * w);
            pDataDestination[__24] = 0.;

            pDataDestination[__31] = 2. * (x * z - y * w);
            pDataDestination[__32] = 2. * (y * z + x * w);
            pDataDestination[__33] = 1. - 2. * (x * x + y * y);
            pDataDestination[__34] = 0.;

            pDataDestination[__41] = 0.;
            pDataDestination[__42] = 0.;
            pDataDestination[__43] = 0.;
            pDataDestination[__44] = 1.;

            return m4fDestination;
        };

        /** inline */ Quat4.prototype.toString = function () {
            return "[x: " + this.x + ", y: " + this.y + ", z: " + this.z + ", w: " + this.w + "]";
        };

        Quat4.prototype.mix = function (q4fQuat, fA, q4fDestination, bShortestPath) {
            if (typeof bShortestPath === "undefined") { bShortestPath = true; }
            if (!isDef(q4fDestination)) {
                q4fDestination = this;
            }

            fA = clamp(fA, 0, 1);

            var x1 = this.x, y1 = this.y, z1 = this.z, w1 = this.w;
            var x2 = q4fQuat.x, y2 = q4fQuat.y, z2 = q4fQuat.z, w2 = q4fQuat.w;

            //скалярное произведение
            var fCos = x1 * x2 + y1 * y2 + z1 * z2 + w1 * w2;

            if (fCos < 0. && bShortestPath) {
                x2 = -x2;
                y2 = -y2;
                z2 = -z2;
                w2 = -w2;
            }

            var k1 = 1. - fA;
            var k2 = fA;

            q4fDestination.x = x1 * k1 + x2 * k2;
            q4fDestination.y = y1 * k1 + y2 * k2;
            q4fDestination.z = z1 * k1 + z2 * k2;
            q4fDestination.w = w1 * k1 + w2 * k2;

            return q4fDestination;
        };

        Quat4.prototype.smix = function (q4fQuat, fA, q4fDestination, bShortestPath) {
            if (typeof bShortestPath === "undefined") { bShortestPath = true; }
            if (!isDef(q4fDestination)) {
                q4fDestination = this;
            }

            fA = clamp(fA, 0, 1);

            var x1 = this.x, y1 = this.y, z1 = this.z, w1 = this.w;
            var x2 = q4fQuat.x, y2 = q4fQuat.y, z2 = q4fQuat.z, w2 = q4fQuat.w;

            //скалярное произведение
            var fCos = x1 * x2 + y1 * y2 + z1 * z2 + w1 * w2;

            if (fCos < 0 && bShortestPath) {
                fCos = -fCos;
                x2 = -x2;
                y2 = -y2;
                z2 = -z2;
                w2 = -w2;
            }

            var fEps = 1e-3;
            if (abs(fCos) < 1. - fEps) {
                var fSin = sqrt(1. - fCos * fCos);
                var fInvSin = 1. / fSin;

                var fAngle = atan2(fSin, fCos);

                var k1 = sin((1. - fA) * fAngle) * fInvSin;
                var k2 = sin(fA * fAngle) * fInvSin;

                q4fDestination.x = x1 * k1 + x2 * k2;
                q4fDestination.y = y1 * k1 + y2 * k2;
                q4fDestination.z = z1 * k1 + z2 * k2;
                q4fDestination.w = w1 * k1 + w2 * k2;
            } else {
                //два кватерниона или очень близки (тогда можно делать линейную интерполяцию)
                //или два кватениона диаметрально противоположны, тогда можно интерполировать любым способом
                //позже надо будет реализовать какой-нибудь, а пока тоже линейная интерполяция
                var k1 = 1 - fA;
                var k2 = fA;

                var x = x1 * k1 + x2 * k2;
                var y = y1 * k1 + y2 * k2;
                var z = z1 * k1 + z2 * k2;
                var w = w1 * k1 + w2 * k2;

                // и нормализуем так-как мы сошли со сферы
                var fLength = sqrt(x * x + y * y + z * z + w * w);
                var fInvLen = fLength ? 1 / fLength : 0;

                q4fDestination.x = x * fInvLen;
                q4fDestination.y = y * fInvLen;
                q4fDestination.z = z * fInvLen;
                q4fDestination.w = w * fInvLen;
            }

            return q4fDestination;
        };

        Quat4.fromForwardUp = function (v3fForward, v3fUp, q4fDestination) {
            if (!isDef(q4fDestination)) {
                q4fDestination = new Quat4();
            }

            var fForwardX = v3fForward.x, fForwardY = v3fForward.y, fForwardZ = v3fForward.z;
            var fUpX = v3fUp.x, fUpY = v3fUp.y, fUpZ = v3fUp.z;

            var m3fTemp = Mat3.temp();
            var pTempData = m3fTemp.data;

            pTempData[__a11] = fUpY * fForwardZ - fUpZ * fForwardY;
            pTempData[__a12] = fUpX;
            pTempData[__a13] = fForwardX;

            pTempData[__a21] = fUpZ * fForwardX - fUpX * fForwardZ;
            pTempData[__a22] = fUpY;
            pTempData[__a23] = fForwardY;

            pTempData[__a31] = fUpX * fForwardY - fUpY * fForwardX;
            pTempData[__a32] = fUpZ;
            pTempData[__a33] = fForwardZ;

            return m3fTemp.toQuat4(q4fDestination);
        };

        Quat4.fromAxisAngle = function (v3fAxis, fAngle, q4fDestination) {
            if (!isDef(q4fDestination)) {
                q4fDestination = new Quat4();
            }

            var x = v3fAxis.x, y = v3fAxis.y, z = v3fAxis.z;

            var fLength = sqrt(x * x + y * y + z * z);

            if (fLength === 0.) {
                q4fDestination.x = q4fDestination.y = q4fDestination.z = 0;
                q4fDestination.w = 1;
                return q4fDestination;
            }

            var fInvLength = 1 / fLength;

            x *= fInvLength;
            y *= fInvLength;
            z *= fInvLength;

            var fSin = sin(fAngle / 2);
            var fCos = cos(fAngle / 2);

            q4fDestination.x = x * fSin;
            q4fDestination.y = y * fSin;
            q4fDestination.z = z * fSin;
            q4fDestination.w = fCos;

            return q4fDestination;
        };

        Quat4.fromYawPitchRoll = function (fYaw, fPitch, fRoll, q4fDestination) {
            if (arguments.length <= 2) {
                var v3fVec = arguments[0];

                fYaw = v3fVec.x;
                fPitch = v3fVec.y;
                fRoll = v3fVec.z;

                q4fDestination = arguments[1];
            }

            if (!isDef(q4fDestination)) {
                q4fDestination = new Quat4();
            }

            var fHalfYaw = fYaw * 0.5;
            var fHalfPitch = fPitch * 0.5;
            var fHalfRoll = fRoll * 0.5;

            var fCos1 = cos(fHalfYaw), fSin1 = sin(fHalfYaw);
            var fCos2 = cos(fHalfPitch), fSin2 = sin(fHalfPitch);
            var fCos3 = cos(fHalfRoll), fSin3 = sin(fHalfRoll);

            q4fDestination.x = fCos1 * fSin2 * fCos3 + fSin1 * fCos2 * fSin3;
            q4fDestination.y = fSin1 * fCos2 * fCos3 - fCos1 * fSin2 * fSin3;
            q4fDestination.z = fCos1 * fCos2 * fSin3 - fSin1 * fSin2 * fCos3;
            q4fDestination.w = fCos1 * fCos2 * fCos3 + fSin1 * fSin2 * fSin3;

            return q4fDestination;
        };

        Quat4.fromXYZ = function (fX, fY, fZ, q4fDestination) {
            if (arguments.length <= 2) {
                //Vec3 + m4fDestination
                var v3fVec = arguments[0];
                return Quat4.fromYawPitchRoll(v3fVec.y, v3fVec.x, v3fVec.z, arguments[1]);
            } else {
                //fX fY fZ m4fDestination
                var fX = arguments[0];
                var fY = arguments[1];
                var fZ = arguments[2];

                return Quat4.fromYawPitchRoll(fY, fX, fZ, arguments[3]);
            }
        };

        Quat4.temp = function (x, y, z, w) {
            iElement = (iElement === pBuffer.length - 1 ? 0 : pBuffer.length);
            var p = pBuffer[iElement++];
            return p.set.apply(p, arguments);
        };
        return Quat4;
    })();

    pBuffer = gen.array(256, Quat4);
    iElement = 0;

    
    return Quat4;
});
//# sourceMappingURL=Quat4.js.map