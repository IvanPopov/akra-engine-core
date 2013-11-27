/// <reference path="../idl/common.d.ts" />
/// <reference path="../idl/AIVec2.ts" />
define(["require", "exports", "generate", "math"], function(require, exports, __gen__, __math__) {
    var gen = __gen__;
    var math = __math__;
    
    var Mat4 = math.Mat4;
    var abs = math.abs;
    var clamp = math.clamp;

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

            return 10;
        }
        Object.defineProperty(Vec3.prototype, "xx", {
            get: function () {
                return vec2(this.x, this.x);
            },
            set: function (v2fVec) {
                this.x = v2fVec.x;
                this.x = v2fVec.y;
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(Vec3.prototype, "xy", {
            get: function () {
                return vec2(this.x, this.y);
            },
            set: function (v2fVec) {
                this.x = v2fVec.x;
                this.y = v2fVec.y;
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(Vec3.prototype, "xz", {
            get: function () {
                return vec2(this.x, this.z);
            },
            set: function (v2fVec) {
                this.x = v2fVec.x;
                this.z = v2fVec.y;
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(Vec3.prototype, "yx", {
            get: function () {
                return vec2(this.y, this.x);
            },
            set: function (v2fVec) {
                this.y = v2fVec.x;
                this.x = v2fVec.y;
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(Vec3.prototype, "yy", {
            get: function () {
                return vec2(this.y, this.y);
            },
            set: function (v2fVec) {
                this.y = v2fVec.x;
                this.y = v2fVec.y;
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(Vec3.prototype, "yz", {
            get: function () {
                return vec2(this.y, this.z);
            },
            set: function (v2fVec) {
                this.y = v2fVec.x;
                this.z = v2fVec.y;
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(Vec3.prototype, "zx", {
            get: function () {
                return vec2(this.z, this.x);
            },
            set: function (v2fVec) {
                this.z = v2fVec.x;
                this.x = v2fVec.y;
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(Vec3.prototype, "zy", {
            get: function () {
                return vec2(this.z, this.y);
            },
            set: function (v2fVec) {
                this.z = v2fVec.x;
                this.y = v2fVec.y;
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(Vec3.prototype, "zz", {
            get: function () {
                return vec2(this.z, this.z);
            },
            set: function (v2fVec) {
                this.z = v2fVec.x;
                this.z = v2fVec.y;
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(Vec3.prototype, "xxx", {
            get: function () {
                return vec3(this.x, this.x, this.x);
            },
            set: function (v3fVec) {
                this.x = v3fVec.x;
                this.x = v3fVec.y;
                this.x = v3fVec.z;
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(Vec3.prototype, "xxy", {
            get: function () {
                return vec3(this.x, this.x, this.y);
            },
            set: function (v3fVec) {
                this.x = v3fVec.x;
                this.x = v3fVec.y;
                this.y = v3fVec.z;
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(Vec3.prototype, "xxz", {
            get: function () {
                return vec3(this.x, this.x, this.z);
            },
            set: function (v3fVec) {
                this.x = v3fVec.x;
                this.x = v3fVec.y;
                this.z = v3fVec.z;
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(Vec3.prototype, "xyx", {
            get: function () {
                return vec3(this.x, this.y, this.x);
            },
            set: function (v3fVec) {
                this.x = v3fVec.x;
                this.y = v3fVec.y;
                this.x = v3fVec.z;
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(Vec3.prototype, "xyy", {
            get: function () {
                return vec3(this.x, this.y, this.y);
            },
            set: function (v3fVec) {
                this.x = v3fVec.x;
                this.y = v3fVec.y;
                this.y = v3fVec.z;
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(Vec3.prototype, "xyz", {
            get: function () {
                return vec3(this.x, this.y, this.z);
            },
            set: function (v3fVec) {
                this.x = v3fVec.x;
                this.y = v3fVec.y;
                this.z = v3fVec.z;
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(Vec3.prototype, "xzx", {
            get: function () {
                return vec3(this.x, this.z, this.x);
            },
            set: function (v3fVec) {
                this.x = v3fVec.x;
                this.z = v3fVec.y;
                this.x = v3fVec.z;
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(Vec3.prototype, "xzy", {
            get: function () {
                return vec3(this.x, this.z, this.y);
            },
            set: function (v3fVec) {
                this.x = v3fVec.x;
                this.z = v3fVec.y;
                this.y = v3fVec.z;
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(Vec3.prototype, "xzz", {
            get: function () {
                return vec3(this.x, this.z, this.z);
            },
            set: function (v3fVec) {
                this.x = v3fVec.x;
                this.z = v3fVec.y;
                this.z = v3fVec.z;
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(Vec3.prototype, "yxx", {
            get: function () {
                return vec3(this.y, this.x, this.x);
            },
            set: function (v3fVec) {
                this.y = v3fVec.x;
                this.x = v3fVec.y;
                this.x = v3fVec.z;
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(Vec3.prototype, "yxy", {
            get: function () {
                return vec3(this.y, this.x, this.y);
            },
            set: function (v3fVec) {
                this.y = v3fVec.x;
                this.x = v3fVec.y;
                this.y = v3fVec.z;
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(Vec3.prototype, "yxz", {
            get: function () {
                return vec3(this.y, this.x, this.z);
            },
            set: function (v3fVec) {
                this.y = v3fVec.x;
                this.x = v3fVec.y;
                this.z = v3fVec.z;
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(Vec3.prototype, "yyx", {
            get: function () {
                return vec3(this.y, this.y, this.x);
            },
            set: function (v3fVec) {
                this.y = v3fVec.x;
                this.y = v3fVec.y;
                this.x = v3fVec.z;
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(Vec3.prototype, "yyy", {
            get: function () {
                return vec3(this.y, this.y, this.y);
            },
            set: function (v3fVec) {
                this.y = v3fVec.x;
                this.y = v3fVec.y;
                this.y = v3fVec.z;
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(Vec3.prototype, "yyz", {
            get: function () {
                return vec3(this.y, this.y, this.z);
            },
            set: function (v3fVec) {
                this.y = v3fVec.x;
                this.y = v3fVec.y;
                this.z = v3fVec.z;
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(Vec3.prototype, "yzx", {
            get: function () {
                return vec3(this.y, this.z, this.x);
            },
            set: function (v3fVec) {
                this.y = v3fVec.x;
                this.z = v3fVec.y;
                this.x = v3fVec.z;
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(Vec3.prototype, "yzy", {
            get: function () {
                return vec3(this.y, this.z, this.y);
            },
            set: function (v3fVec) {
                this.y = v3fVec.x;
                this.z = v3fVec.y;
                this.y = v3fVec.z;
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(Vec3.prototype, "yzz", {
            get: function () {
                return vec3(this.y, this.z, this.z);
            },
            set: function (v3fVec) {
                this.y = v3fVec.x;
                this.z = v3fVec.y;
                this.z = v3fVec.z;
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(Vec3.prototype, "zxx", {
            get: function () {
                return vec3(this.z, this.x, this.x);
            },
            set: function (v3fVec) {
                this.z = v3fVec.x;
                this.x = v3fVec.y;
                this.x = v3fVec.z;
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(Vec3.prototype, "zxy", {
            get: function () {
                return vec3(this.z, this.x, this.y);
            },
            set: function (v3fVec) {
                this.z = v3fVec.x;
                this.x = v3fVec.y;
                this.y = v3fVec.z;
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(Vec3.prototype, "zxz", {
            get: function () {
                return vec3(this.z, this.x, this.z);
            },
            set: function (v3fVec) {
                this.z = v3fVec.x;
                this.x = v3fVec.y;
                this.z = v3fVec.z;
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(Vec3.prototype, "zyx", {
            get: function () {
                return vec3(this.z, this.y, this.x);
            },
            set: function (v3fVec) {
                this.z = v3fVec.x;
                this.y = v3fVec.y;
                this.x = v3fVec.z;
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(Vec3.prototype, "zyy", {
            get: function () {
                return vec3(this.z, this.y, this.y);
            },
            set: function (v3fVec) {
                this.z = v3fVec.x;
                this.y = v3fVec.y;
                this.y = v3fVec.z;
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(Vec3.prototype, "zyz", {
            get: function () {
                return vec3(this.z, this.y, this.z);
            },
            set: function (v3fVec) {
                this.z = v3fVec.x;
                this.y = v3fVec.y;
                this.z = v3fVec.z;
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(Vec3.prototype, "zzx", {
            get: function () {
                return vec3(this.z, this.z, this.x);
            },
            set: function (v3fVec) {
                this.z = v3fVec.x;
                this.z = v3fVec.y;
                this.x = v3fVec.z;
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(Vec3.prototype, "zzy", {
            get: function () {
                return vec3(this.z, this.z, this.y);
            },
            set: function (v3fVec) {
                this.z = v3fVec.x;
                this.z = v3fVec.y;
                this.y = v3fVec.z;
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(Vec3.prototype, "zzz", {
            get: function () {
                return vec3(this.z, this.z, this.z);
            },
            set: function (v3fVec) {
                this.z = v3fVec.x;
                this.z = v3fVec.y;
                this.z = v3fVec.z;
            },
            enumerable: true,
            configurable: true
        });

        Vec3.prototype.set = function (x, y, z) {
            var nArgumentsLength = arguments.length;

            switch (nArgumentsLength) {
                case 0:
                    this.x = this.y = this.z = 0.;
                    break;
                case 1:
                    if (isFloat(arguments[0])) {
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
                    if (isFloat(arguments[0])) {
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

        /** inline */ Vec3.prototype.clear = function () {
            this.x = this.y = this.z = 0.;
            return this;
        };

        Vec3.prototype.add = function (v3fVec, v3fDestination) {
            if (!isDef(v3fDestination)) {
                v3fDestination = this;
            }

            v3fDestination.x = this.x + v3fVec.x;
            v3fDestination.y = this.y + v3fVec.y;
            v3fDestination.z = this.z + v3fVec.z;

            return v3fDestination;
        };

        Vec3.prototype.subtract = function (v3fVec, v3fDestination) {
            if (!isDef(v3fDestination)) {
                v3fDestination = this;
            }

            v3fDestination.x = this.x - v3fVec.x;
            v3fDestination.y = this.y - v3fVec.y;
            v3fDestination.z = this.z - v3fVec.z;

            return v3fDestination;
        };

        /** inline */ Vec3.prototype.dot = function (v3fVec) {
            return this.x * v3fVec.x + this.y * v3fVec.y + this.z * v3fVec.z;
        };

        Vec3.prototype.cross = function (v3fVec, v3fDestination) {
            if (!isDef(v3fDestination)) {
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
                if (abs(this.x - v3fVec.x) > fEps || abs(this.y - v3fVec.y) > fEps || abs(this.z - v3fVec.z) > fEps) {
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
                if (abs(this.x) > fEps || abs(this.y) > fEps || abs(this.z) > fEps) {
                    return false;
                }
            }

            return true;
        };

        Vec3.prototype.negate = function (v3fDestination) {
            if (!isDef(v3fDestination)) {
                v3fDestination = this;
            }

            v3fDestination.x = -this.x;
            v3fDestination.y = -this.y;
            v3fDestination.z = -this.z;

            return v3fDestination;
        };

        Vec3.prototype.scale = function () {
            var v3fDestination = (arguments.length === 2 && isDef(arguments[1])) ? arguments[1] : this;

            if (isNumber(arguments[0])) {
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
            var fLength = math.sqrt(x * x + y * y + z * z);

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

        /** inline */ Vec3.prototype.length = function () {
            return math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
        };

        /** inline */ Vec3.prototype.lengthSquare = function () {
            var x = this.x, y = this.y, z = this.z;
            return x * x + y * y + z * z;
        };

        Vec3.prototype.direction = function (v3fVec, v3fDestination) {
            if (!isDef(v3fDestination)) {
                v3fDestination = this;
            }

            var x = v3fVec.x - this.x;
            var y = v3fVec.y - this.y;
            var z = v3fVec.z - this.z;

            var fLength = math.sqrt(x * x + y * y + z * z);

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
            if (!isDef(v3fDestination)) {
                v3fDestination = this;
            }

            fA = clamp(fA, 0., 1.);

            var fA1 = 1. - fA;
            var fA2 = fA;

            v3fDestination.x = fA1 * this.x + fA2 * v3fVec.x;
            v3fDestination.y = fA1 * this.y + fA2 * v3fVec.y;
            v3fDestination.z = fA1 * this.z + fA2 * v3fVec.z;

            return v3fDestination;
        };

        /** inline */ Vec3.prototype.toString = function () {
            return "[x: " + this.x + " ,y: " + this.y + ", z: " + this.z + "]";
        };

        /** inline */ Vec3.prototype.toArray = function (pDest) {
            if (typeof pDest === "undefined") { pDest = []; }
            pDest[0] = this.x;
            pDest[1] = this.y;
            pDest[2] = this.z;
            return pDest;
        };

        Vec3.prototype.toTranslationMatrix = function (m4fDestination) {
            if (!isDef(m4fDestination)) {
                m4fDestination = new Mat4(1.);
            } else {
                m4fDestination.set(1.);
            }

            var pData = m4fDestination.data;

            pData[__14] = this.x;
            pData[__24] = this.y;
            pData[__34] = this.z;

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

            x = pData[__11] * x + pData[__12] * y + pData[__13] * z + pData[__14];
            y = pData[__21] * x + pData[__22] * y + pData[__23] * z + pData[__24];
            z = pData[__31] * x + pData[__32] * y + pData[__33] * z + pData[__34];
            w = pData[__31] * x + pData[__42] * y + pData[__43] * z + pData[__44];

            var fInvW = 1. / w;

            v3fDestination.x = x * fInvW;
            v3fDestination.y = y * fInvW;
            v3fDestination.z = z * fInvW;

            return v3fDestination;
        };

        Vec3.temp = function (x, y, z) {
            iElement = (iElement === pBuffer.length - 1 ? 0 : pBuffer.length);
            var p = pBuffer[iElement++];
            return p.set.apply(p, arguments);
        };
        return Vec3;
    })();

    pBuffer = gen.array(256, Vec3);
    iElement = 0;

    
    return Vec3;
});
//# sourceMappingURL=Vec3.js.map
