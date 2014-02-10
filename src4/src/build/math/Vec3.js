/// <reference path="../common.ts" />
/// <reference path="../logger.ts" />
/// <reference path="../idl/IVec3.ts" />
/// <reference path="math.ts" />
/// <reference path="../gen/generate.ts" />
var akra;
(function (akra) {
    (function (math) {
        var pBuffer;
        var iElement;

        var Vec3 = (function () {
            function Vec3(x, y, z) {
                var nArg = arguments.length;

                switch (nArg) {
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
                        this.x = this.y = this.z = 0.;
                        break;
                }
            }
            Vec3.prototype.set = function (x, y, z) {
                var nArgumentsLength = arguments.length;

                switch (nArgumentsLength) {
                    case 0:
                        this.x = this.y = this.z = 0.;
                        break;
                    case 1:
                        if (akra.isFloat(arguments[0])) {
                            this.x = this.y = this.z = arguments[0];
                        } else if (arguments[0] instanceof Vec3) {
                            var v3fVec = arguments[0];

                            this.x = v3fVec.x;
                            this.y = v3fVec.y;
                            this.z = v3fVec.z;
                        } else {
                            var pArray = arguments[0];

                            this.x = pArray[0];
                            this.y = pArray[1];
                            this.z = pArray[2];
                        }
                        break;
                    case 2:
                        if (akra.isFloat(arguments[0])) {
                            var fValue = arguments[0];
                            var v2fVec = arguments[1];

                            this.x = fValue;
                            this.y = v2fVec.x;
                            this.z = v2fVec.y;
                        } else {
                            var v2fVec = arguments[0];
                            var fValue = arguments[1];

                            this.x = v2fVec.x;
                            this.y = v2fVec.y;
                            this.z = fValue;
                        }
                        break;
                    case 3:
                        this.x = arguments[0];
                        this.y = arguments[1];
                        this.z = arguments[2];
                        break;
                }

                return this;
            };

            Vec3.prototype.X = function (fLength) {
                if (typeof fLength === "undefined") { fLength = 1.; }
                return this.set(fLength, 0., 0.);
            };

            Vec3.prototype.Y = function (fLength) {
                if (typeof fLength === "undefined") { fLength = 1.; }
                return this.set(0., fLength, 0.);
            };

            Vec3.prototype.Z = function (fLength) {
                if (typeof fLength === "undefined") { fLength = 1.; }
                return this.set(0., 0., fLength);
            };

            /**  */ Vec3.prototype.clear = function () {
                this.x = this.y = this.z = 0.;
                return this;
            };

            Vec3.prototype.add = function (v3fVec, v3fDestination) {
                if (!akra.isDef(v3fDestination)) {
                    v3fDestination = this;
                }

                v3fDestination.x = this.x + v3fVec.x;
                v3fDestination.y = this.y + v3fVec.y;
                v3fDestination.z = this.z + v3fVec.z;

                return v3fDestination;
            };

            Vec3.prototype.subtract = function (v3fVec, v3fDestination) {
                if (!akra.isDef(v3fDestination)) {
                    v3fDestination = this;
                }

                v3fDestination.x = this.x - v3fVec.x;
                v3fDestination.y = this.y - v3fVec.y;
                v3fDestination.z = this.z - v3fVec.z;

                return v3fDestination;
            };

            /**  */ Vec3.prototype.dot = function (v3fVec) {
                return this.x * v3fVec.x + this.y * v3fVec.y + this.z * v3fVec.z;
            };

            Vec3.prototype.cross = function (v3fVec, v3fDestination) {
                if (!akra.isDef(v3fDestination)) {
                    v3fDestination = this;
                }

                var x1 = this.x, y1 = this.y, z1 = this.z;
                var x2 = v3fVec.x, y2 = v3fVec.y, z2 = v3fVec.z;

                v3fDestination.x = y1 * z2 - z1 * y2;
                v3fDestination.y = z1 * x2 - x1 * z2;
                v3fDestination.z = x1 * y2 - y1 * x2;

                return v3fDestination;
            };

            Vec3.prototype.isEqual = function (v3fVec, fEps) {
                if (typeof fEps === "undefined") { fEps = 0.; }
                if (fEps === 0.) {
                    if (this.x != v3fVec.x || this.y != v3fVec.y || this.z != v3fVec.z) {
                        return false;
                    }
                } else {
                    if (akra.math.abs(this.x - v3fVec.x) > fEps || akra.math.abs(this.y - v3fVec.y) > fEps || akra.math.abs(this.z - v3fVec.z) > fEps) {
                        return false;
                    }
                }
                return true;
            };

            Vec3.prototype.isClear = function (fEps) {
                if (typeof fEps === "undefined") { fEps = 0.; }
                if (fEps === 0.) {
                    if (this.x != 0. || this.y != 0. || this.z != 0.) {
                        return false;
                    }
                } else {
                    if (akra.math.abs(this.x) > fEps || akra.math.abs(this.y) > fEps || akra.math.abs(this.z) > fEps) {
                        return false;
                    }
                }

                return true;
            };

            Vec3.prototype.negate = function (v3fDestination) {
                if (!akra.isDef(v3fDestination)) {
                    v3fDestination = this;
                }

                v3fDestination.x = -this.x;
                v3fDestination.y = -this.y;
                v3fDestination.z = -this.z;

                return v3fDestination;
            };

            Vec3.prototype.scale = function () {
                var v3fDestination = (arguments.length === 2 && akra.isDef(arguments[1])) ? arguments[1] : this;

                if (akra.isNumber(arguments[0])) {
                    var fScale = arguments[0];
                    v3fDestination.x = this.x * fScale;
                    v3fDestination.y = this.y * fScale;
                    v3fDestination.z = this.z * fScale;
                } else {
                    var v3fScale = arguments[0];
                    v3fDestination.x = this.x * v3fScale.x;
                    v3fDestination.y = this.y * v3fScale.y;
                    v3fDestination.z = this.z * v3fScale.z;
                }

                return v3fDestination;
            };

            Vec3.prototype.normalize = function (v3fDestination) {
                if (!v3fDestination) {
                    v3fDestination = this;
                }

                var x = this.x, y = this.y, z = this.z;
                var fLength = akra.math.sqrt(x * x + y * y + z * z);

                if (fLength !== 0.) {
                    var fInvLength = 1. / fLength;

                    x *= fInvLength;
                    y *= fInvLength;
                    z *= fInvLength;
                }

                v3fDestination.x = x;
                v3fDestination.y = y;
                v3fDestination.z = z;

                return v3fDestination;
            };

            /**  */ Vec3.prototype.length = function () {
                return akra.math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
            };

            /**  */ Vec3.prototype.lengthSquare = function () {
                var x = this.x, y = this.y, z = this.z;
                return x * x + y * y + z * z;
            };

            Vec3.prototype.direction = function (v3fVec, v3fDestination) {
                if (!akra.isDef(v3fDestination)) {
                    v3fDestination = this;
                }

                var x = v3fVec.x - this.x;
                var y = v3fVec.y - this.y;
                var z = v3fVec.z - this.z;

                var fLength = akra.math.sqrt(x * x + y * y + z * z);

                if (fLength !== 0.) {
                    var fInvLength = 1. / fLength;

                    x *= fInvLength;
                    y *= fInvLength;
                    z *= fInvLength;
                }

                v3fDestination.x = x;
                v3fDestination.y = y;
                v3fDestination.z = z;

                return v3fDestination;
            };

            Vec3.prototype.mix = function (v3fVec, fA, v3fDestination) {
                if (!akra.isDef(v3fDestination)) {
                    v3fDestination = this;
                }

                fA = akra.math.clamp(fA, 0., 1.);

                var fA1 = 1. - fA;
                var fA2 = fA;

                v3fDestination.x = fA1 * this.x + fA2 * v3fVec.x;
                v3fDestination.y = fA1 * this.y + fA2 * v3fVec.y;
                v3fDestination.z = fA1 * this.z + fA2 * v3fVec.z;

                return v3fDestination;
            };

            /**  */ Vec3.prototype.toString = function () {
                return "[x: " + this.x + " ,y: " + this.y + ", z: " + this.z + "]";
            };

            /**  */ Vec3.prototype.toArray = function (pDest) {
                if (typeof pDest === "undefined") { pDest = []; }
                pDest[0] = this.x;
                pDest[1] = this.y;
                pDest[2] = this.z;
                return pDest;
            };

            Vec3.prototype.toTranslationMatrix = function (m4fDestination) {
                if (!akra.isDef(m4fDestination)) {
                    m4fDestination = new akra.math.Mat4(1.);
                } else {
                    m4fDestination.set(1.);
                }

                var pData = m4fDestination.data;

                pData[akra.math.__14] = this.x;
                pData[akra.math.__24] = this.y;
                pData[akra.math.__34] = this.z;

                return m4fDestination;
            };

            Vec3.prototype.vec3TransformCoord = function (m4fTransformation, v3fDestination) {
                if (!v3fDestination) {
                    v3fDestination = this;
                }

                var pData = m4fTransformation.data;

                var x = this.x;
                var y = this.y;
                var z = this.z;
                var w;

                x = pData[akra.math.__11] * x + pData[akra.math.__12] * y + pData[akra.math.__13] * z + pData[akra.math.__14];
                y = pData[akra.math.__21] * x + pData[akra.math.__22] * y + pData[akra.math.__23] * z + pData[akra.math.__24];
                z = pData[akra.math.__31] * x + pData[akra.math.__32] * y + pData[akra.math.__33] * z + pData[akra.math.__34];
                w = pData[akra.math.__31] * x + pData[akra.math.__42] * y + pData[akra.math.__43] * z + pData[akra.math.__44];

                var fInvW = 1. / w;

                v3fDestination.x = x * fInvW;
                v3fDestination.y = y * fInvW;
                v3fDestination.z = z * fInvW;

                return v3fDestination;
            };

            Vec3.prototype.clone = function (sForm, pVec2OrVec3) {
                if (sForm.length === 2) {
                    var v2fDest = akra.isDefAndNotNull(pVec2OrVec3) ? pVec2OrVec3 : akra.math.Vec2.temp();

                    switch (sForm) {
                        case "xx":
                            return v2fDest.set(this.x, this.x);
                        case "xy":
                            return v2fDest.set(this.x, this.y);
                        case "xz":
                            return v2fDest.set(this.x, this.z);
                        case "yx":
                            return v2fDest.set(this.y, this.x);
                        case "yy":
                            return v2fDest.set(this.y, this.y);
                        case "yz":
                            return v2fDest.set(this.y, this.z);
                        case "zx":
                            return v2fDest.set(this.z, this.x);
                        case "zy":
                            return v2fDest.set(this.z, this.y);
                        case "zz":
                            return v2fDest.set(this.z, this.z);
                    }
                } else if (sForm.length === 3) {
                    var v3fDest = akra.isDefAndNotNull(pVec2OrVec3) ? pVec2OrVec3 : Vec3.temp();

                    switch (sForm) {
                        case "xxx":
                            return v3fDest.set(this.x, this.x, this.x);
                        case "xxy":
                            return v3fDest.set(this.x, this.x, this.y);
                        case "xxz":
                            return v3fDest.set(this.x, this.x, this.z);
                        case "xyx":
                            return v3fDest.set(this.x, this.y, this.x);
                        case "xyy":
                            return v3fDest.set(this.x, this.y, this.y);
                        case "xyz":
                            return v3fDest.set(this.x, this.y, this.z);
                        case "xzx":
                            return v3fDest.set(this.x, this.z, this.x);
                        case "xzy":
                            return v3fDest.set(this.x, this.z, this.y);
                        case "xzz":
                            return v3fDest.set(this.x, this.z, this.z);
                        case "yxx":
                            return v3fDest.set(this.y, this.x, this.x);
                        case "yxy":
                            return v3fDest.set(this.y, this.x, this.y);
                        case "yxz":
                            return v3fDest.set(this.y, this.x, this.z);
                        case "yyx":
                            return v3fDest.set(this.y, this.y, this.x);
                        case "yyy":
                            return v3fDest.set(this.y, this.y, this.y);
                        case "yyz":
                            return v3fDest.set(this.y, this.y, this.z);
                        case "yzx":
                            return v3fDest.set(this.y, this.z, this.x);
                        case "yzy":
                            return v3fDest.set(this.y, this.z, this.y);
                        case "yzz":
                            return v3fDest.set(this.y, this.z, this.z);
                        case "zxx":
                            return v3fDest.set(this.z, this.x, this.x);
                        case "zxy":
                            return v3fDest.set(this.z, this.x, this.y);
                        case "zxz":
                            return v3fDest.set(this.z, this.x, this.z);
                        case "zyx":
                            return v3fDest.set(this.z, this.y, this.x);
                        case "zyy":
                            return v3fDest.set(this.z, this.y, this.y);
                        case "zyz":
                            return v3fDest.set(this.z, this.y, this.z);
                        case "zzx":
                            return v3fDest.set(this.z, this.z, this.x);
                        case "zzy":
                            return v3fDest.set(this.z, this.z, this.y);
                        case "zzz":
                            return v3fDest.set(this.z, this.z, this.z);
                    }
                }

                akra.logger.error("Bad vector form", sForm);
                return null;
            };

            Vec3.prototype.copy = function (sForm, pVectorOrFloat) {
                if (sForm.length === 2) {
                    var v2fFrom = akra.isFloat(pVectorOrFloat) ? akra.math.Vec2.temp(pVectorOrFloat) : pVectorOrFloat;

                    switch (sForm) {
                        case "xx":
                            this.x = v2fFrom.x;
                            this.x = v2fFrom.y;
                            return this;
                        case "xy":
                            this.x = v2fFrom.x;
                            this.y = v2fFrom.y;
                            return this;
                        case "xz":
                            this.x = v2fFrom.x;
                            this.z = v2fFrom.y;
                            return this;
                        case "yx":
                            this.y = v2fFrom.x;
                            this.x = v2fFrom.y;
                            return this;
                        case "yy":
                            this.y = v2fFrom.x;
                            this.y = v2fFrom.y;
                            return this;
                        case "yz":
                            this.y = v2fFrom.x;
                            this.z = v2fFrom.y;
                            return this;
                        case "zx":
                            this.z = v2fFrom.x;
                            this.x = v2fFrom.y;
                            return this;
                        case "zy":
                            this.z = v2fFrom.x;
                            this.y = v2fFrom.y;
                            return this;
                        case "zz":
                            this.z = v2fFrom.x;
                            this.z = v2fFrom.y;
                            return this;
                    }
                } else if (sForm.length === 3) {
                    var v3fFrom = akra.isFloat(pVectorOrFloat) ? Vec3.temp(pVectorOrFloat) : pVectorOrFloat;

                    switch (sForm) {
                        case "xxx":
                            this.x = v3fFrom.x;
                            this.x = v3fFrom.y;
                            this.x = v3fFrom.z;
                            return this;
                        case "xxy":
                            this.x = v3fFrom.x;
                            this.x = v3fFrom.y;
                            this.y = v3fFrom.z;
                            return this;
                        case "xxz":
                            this.x = v3fFrom.x;
                            this.x = v3fFrom.y;
                            this.z = v3fFrom.z;
                            return this;
                        case "xyx":
                            this.x = v3fFrom.x;
                            this.y = v3fFrom.y;
                            this.x = v3fFrom.z;
                            return this;
                        case "xyy":
                            this.x = v3fFrom.x;
                            this.y = v3fFrom.y;
                            this.y = v3fFrom.z;
                            return this;
                        case "xyz":
                            this.x = v3fFrom.x;
                            this.y = v3fFrom.y;
                            this.z = v3fFrom.z;
                            return this;
                        case "xzx":
                            this.x = v3fFrom.x;
                            this.z = v3fFrom.y;
                            this.x = v3fFrom.z;
                            return this;
                        case "xzy":
                            this.x = v3fFrom.x;
                            this.z = v3fFrom.y;
                            this.y = v3fFrom.z;
                            return this;
                        case "xzz":
                            this.x = v3fFrom.x;
                            this.z = v3fFrom.y;
                            this.z = v3fFrom.z;
                            return this;
                        case "yxx":
                            this.y = v3fFrom.x;
                            this.x = v3fFrom.y;
                            this.x = v3fFrom.z;
                            return this;
                        case "yxy":
                            this.y = v3fFrom.x;
                            this.x = v3fFrom.y;
                            this.y = v3fFrom.z;
                            return this;
                        case "yxz":
                            this.y = v3fFrom.x;
                            this.x = v3fFrom.y;
                            this.z = v3fFrom.z;
                            return this;
                        case "yyx":
                            this.y = v3fFrom.x;
                            this.y = v3fFrom.y;
                            this.x = v3fFrom.z;
                            return this;
                        case "yyy":
                            this.y = v3fFrom.x;
                            this.y = v3fFrom.y;
                            this.y = v3fFrom.z;
                            return this;
                        case "yyz":
                            this.y = v3fFrom.x;
                            this.y = v3fFrom.y;
                            this.z = v3fFrom.z;
                            return this;
                        case "yzx":
                            this.y = v3fFrom.x;
                            this.z = v3fFrom.y;
                            this.x = v3fFrom.z;
                            return this;
                        case "yzy":
                            this.y = v3fFrom.x;
                            this.z = v3fFrom.y;
                            this.y = v3fFrom.z;
                            return this;
                        case "yzz":
                            this.y = v3fFrom.x;
                            this.z = v3fFrom.y;
                            this.z = v3fFrom.z;
                            return this;
                        case "zxx":
                            this.z = v3fFrom.x;
                            this.x = v3fFrom.y;
                            this.x = v3fFrom.z;
                            return this;
                        case "zxy":
                            this.z = v3fFrom.x;
                            this.x = v3fFrom.y;
                            this.y = v3fFrom.z;
                            return this;
                        case "zxz":
                            this.z = v3fFrom.x;
                            this.x = v3fFrom.y;
                            this.z = v3fFrom.z;
                            return this;
                        case "zyx":
                            this.z = v3fFrom.x;
                            this.y = v3fFrom.y;
                            this.x = v3fFrom.z;
                            return this;
                        case "zyy":
                            this.z = v3fFrom.x;
                            this.y = v3fFrom.y;
                            this.y = v3fFrom.z;
                            return this;
                        case "zyz":
                            this.z = v3fFrom.x;
                            this.y = v3fFrom.y;
                            this.z = v3fFrom.z;
                            return this;
                        case "zzx":
                            this.z = v3fFrom.x;
                            this.z = v3fFrom.y;
                            this.x = v3fFrom.z;
                            return this;
                        case "zzy":
                            this.z = v3fFrom.x;
                            this.z = v3fFrom.y;
                            this.y = v3fFrom.z;
                            return this;
                        case "zzz":
                            this.z = v3fFrom.x;
                            this.z = v3fFrom.y;
                            this.z = v3fFrom.z;
                            return this;
                    }
                }

                akra.logger.error("Bad vector form", sForm);
                return this;
            };

            Vec3.temp = function (x, y, z) {
                iElement = (iElement === pBuffer.length - 1 ? 0 : iElement);
                var p = pBuffer[iElement++];
                return p.set.apply(p, arguments);
            };
            return Vec3;
        })();
        math.Vec3 = Vec3;

        pBuffer = akra.gen.array(256, Vec3);
        iElement = 0;
    })(akra.math || (akra.math = {}));
    var math = akra.math;
})(akra || (akra = {}));
//# sourceMappingURL=Vec3.js.map
