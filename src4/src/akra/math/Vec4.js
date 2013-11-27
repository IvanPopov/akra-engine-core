var akra;
(function (akra) {
    /// <reference path="../common.ts" />
    /// <reference path="../logger.ts" />
    /// <reference path="../idl/IVec4.ts" />
    /// <reference path="math.ts" />
    /// <reference path="../gen/generate.ts" />
    (function (math) {
        var pBuffer;
        var iElement;

        var Vec4 = (function () {
            function Vec4(x, y, z, w) {
                var n = arguments.length;
                var v = this;

                switch (n) {
                    case 1:
                        v.set(arguments[0]);
                        break;
                    case 2:
                        v.set(arguments[0], arguments[1]);
                        break;
                    case 3:
                        v.set(arguments[0], arguments[1], arguments[2]);
                        break;
                    case 4:
                        v.set(arguments[0], arguments[1], arguments[2], arguments[3]);
                        break;
                    default:
                        v.x = v.y = v.z = v.w = 0.;
                        break;
                }
            }
            Object.defineProperty(Vec4.prototype, "xx", {
                get: function () {
                    return math.Vec2.temp(this.x, this.x);
                },
                set: function (v2fVec) {
                    this.x = v2fVec.x;
                    this.x = v2fVec.y;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Vec4.prototype, "xy", {
                get: function () {
                    return math.Vec2.temp(this.x, this.y);
                },
                set: function (v2fVec) {
                    this.x = v2fVec.x;
                    this.y = v2fVec.y;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Vec4.prototype, "xz", {
                get: function () {
                    return math.Vec2.temp(this.x, this.z);
                },
                set: function (v2fVec) {
                    this.x = v2fVec.x;
                    this.z = v2fVec.y;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Vec4.prototype, "xw", {
                get: function () {
                    return math.Vec2.temp(this.x, this.w);
                },
                set: function (v2fVec) {
                    this.x = v2fVec.x;
                    this.w = v2fVec.y;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Vec4.prototype, "yx", {
                get: function () {
                    return math.Vec2.temp(this.y, this.x);
                },
                set: function (v2fVec) {
                    this.y = v2fVec.x;
                    this.x = v2fVec.y;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Vec4.prototype, "yy", {
                get: function () {
                    return math.Vec2.temp(this.y, this.y);
                },
                set: function (v2fVec) {
                    this.y = v2fVec.x;
                    this.y = v2fVec.y;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Vec4.prototype, "yz", {
                get: function () {
                    return math.Vec2.temp(this.y, this.z);
                },
                set: function (v2fVec) {
                    this.y = v2fVec.x;
                    this.z = v2fVec.y;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Vec4.prototype, "yw", {
                get: function () {
                    return math.Vec2.temp(this.y, this.w);
                },
                set: function (v2fVec) {
                    this.y = v2fVec.x;
                    this.w = v2fVec.y;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Vec4.prototype, "zx", {
                get: function () {
                    return math.Vec2.temp(this.z, this.x);
                },
                set: function (v2fVec) {
                    this.z = v2fVec.x;
                    this.x = v2fVec.y;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Vec4.prototype, "zy", {
                get: function () {
                    return math.Vec2.temp(this.z, this.y);
                },
                set: function (v2fVec) {
                    this.z = v2fVec.x;
                    this.y = v2fVec.y;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Vec4.prototype, "zz", {
                get: function () {
                    return math.Vec2.temp(this.z, this.z);
                },
                set: function (v2fVec) {
                    this.z = v2fVec.x;
                    this.z = v2fVec.y;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Vec4.prototype, "zw", {
                get: function () {
                    return math.Vec2.temp(this.z, this.w);
                },
                set: function (v2fVec) {
                    this.z = v2fVec.x;
                    this.w = v2fVec.y;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Vec4.prototype, "wx", {
                get: function () {
                    return math.Vec2.temp(this.w, this.x);
                },
                set: function (v2fVec) {
                    this.w = v2fVec.x;
                    this.x = v2fVec.y;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Vec4.prototype, "wy", {
                get: function () {
                    return math.Vec2.temp(this.w, this.y);
                },
                set: function (v2fVec) {
                    this.w = v2fVec.x;
                    this.y = v2fVec.y;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Vec4.prototype, "wz", {
                get: function () {
                    return math.Vec2.temp(this.w, this.z);
                },
                set: function (v2fVec) {
                    this.w = v2fVec.x;
                    this.z = v2fVec.y;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Vec4.prototype, "ww", {
                get: function () {
                    return math.Vec2.temp(this.w, this.w);
                },
                set: function (v2fVec) {
                    this.w = v2fVec.x;
                    this.w = v2fVec.y;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Vec4.prototype, "xxx", {
                get: function () {
                    return math.Vec3.temp(this.x, this.x, this.x);
                },
                set: function (v3fVec) {
                    this.x = v3fVec.x;
                    this.x = v3fVec.y;
                    this.x = v3fVec.z;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Vec4.prototype, "xxy", {
                get: function () {
                    return math.Vec3.temp(this.x, this.x, this.y);
                },
                set: function (v3fVec) {
                    this.x = v3fVec.x;
                    this.x = v3fVec.y;
                    this.y = v3fVec.z;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Vec4.prototype, "xxz", {
                get: function () {
                    return math.Vec3.temp(this.x, this.x, this.z);
                },
                set: function (v3fVec) {
                    this.x = v3fVec.x;
                    this.x = v3fVec.y;
                    this.z = v3fVec.z;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Vec4.prototype, "xxw", {
                get: function () {
                    return math.Vec3.temp(this.x, this.x, this.w);
                },
                set: function (v3fVec) {
                    this.x = v3fVec.x;
                    this.x = v3fVec.y;
                    this.w = v3fVec.z;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Vec4.prototype, "xyx", {
                get: function () {
                    return math.Vec3.temp(this.x, this.y, this.x);
                },
                set: function (v3fVec) {
                    this.x = v3fVec.x;
                    this.y = v3fVec.y;
                    this.x = v3fVec.z;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Vec4.prototype, "xyy", {
                get: function () {
                    return math.Vec3.temp(this.x, this.y, this.y);
                },
                set: function (v3fVec) {
                    this.x = v3fVec.x;
                    this.y = v3fVec.y;
                    this.y = v3fVec.z;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Vec4.prototype, "xyz", {
                get: function () {
                    return math.Vec3.temp(this.x, this.y, this.z);
                },
                set: function (v3fVec) {
                    this.x = v3fVec.x;
                    this.y = v3fVec.y;
                    this.z = v3fVec.z;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Vec4.prototype, "xyw", {
                get: function () {
                    return math.Vec3.temp(this.x, this.y, this.w);
                },
                set: function (v3fVec) {
                    this.x = v3fVec.x;
                    this.y = v3fVec.y;
                    this.w = v3fVec.z;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Vec4.prototype, "xzx", {
                get: function () {
                    return math.Vec3.temp(this.x, this.z, this.x);
                },
                set: function (v3fVec) {
                    this.x = v3fVec.x;
                    this.z = v3fVec.y;
                    this.x = v3fVec.z;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Vec4.prototype, "xzy", {
                get: function () {
                    return math.Vec3.temp(this.x, this.z, this.y);
                },
                set: function (v3fVec) {
                    this.x = v3fVec.x;
                    this.z = v3fVec.y;
                    this.y = v3fVec.z;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Vec4.prototype, "xzz", {
                get: function () {
                    return math.Vec3.temp(this.x, this.z, this.z);
                },
                set: function (v3fVec) {
                    this.x = v3fVec.x;
                    this.z = v3fVec.y;
                    this.z = v3fVec.z;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Vec4.prototype, "xzw", {
                get: function () {
                    return math.Vec3.temp(this.x, this.z, this.w);
                },
                set: function (v3fVec) {
                    this.x = v3fVec.x;
                    this.z = v3fVec.y;
                    this.w = v3fVec.z;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Vec4.prototype, "xwx", {
                get: function () {
                    return math.Vec3.temp(this.x, this.w, this.x);
                },
                set: function (v3fVec) {
                    this.x = v3fVec.x;
                    this.w = v3fVec.y;
                    this.x = v3fVec.z;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Vec4.prototype, "xwy", {
                get: function () {
                    return math.Vec3.temp(this.x, this.w, this.y);
                },
                set: function (v3fVec) {
                    this.x = v3fVec.x;
                    this.w = v3fVec.y;
                    this.y = v3fVec.z;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Vec4.prototype, "xwz", {
                get: function () {
                    return math.Vec3.temp(this.x, this.w, this.z);
                },
                set: function (v3fVec) {
                    this.x = v3fVec.x;
                    this.w = v3fVec.y;
                    this.z = v3fVec.z;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Vec4.prototype, "xww", {
                get: function () {
                    return math.Vec3.temp(this.x, this.w, this.w);
                },
                set: function (v3fVec) {
                    this.x = v3fVec.x;
                    this.w = v3fVec.y;
                    this.w = v3fVec.z;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Vec4.prototype, "yxx", {
                get: function () {
                    return math.Vec3.temp(this.y, this.x, this.x);
                },
                set: function (v3fVec) {
                    this.y = v3fVec.x;
                    this.x = v3fVec.y;
                    this.x = v3fVec.z;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Vec4.prototype, "yxy", {
                get: function () {
                    return math.Vec3.temp(this.y, this.x, this.y);
                },
                set: function (v3fVec) {
                    this.y = v3fVec.x;
                    this.x = v3fVec.y;
                    this.y = v3fVec.z;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Vec4.prototype, "yxz", {
                get: function () {
                    return math.Vec3.temp(this.y, this.x, this.z);
                },
                set: function (v3fVec) {
                    this.y = v3fVec.x;
                    this.x = v3fVec.y;
                    this.z = v3fVec.z;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Vec4.prototype, "yxw", {
                get: function () {
                    return math.Vec3.temp(this.y, this.x, this.w);
                },
                set: function (v3fVec) {
                    this.y = v3fVec.x;
                    this.x = v3fVec.y;
                    this.w = v3fVec.z;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Vec4.prototype, "yyx", {
                get: function () {
                    return math.Vec3.temp(this.y, this.y, this.x);
                },
                set: function (v3fVec) {
                    this.y = v3fVec.x;
                    this.y = v3fVec.y;
                    this.x = v3fVec.z;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Vec4.prototype, "yyy", {
                get: function () {
                    return math.Vec3.temp(this.y, this.y, this.y);
                },
                set: function (v3fVec) {
                    this.y = v3fVec.x;
                    this.y = v3fVec.y;
                    this.y = v3fVec.z;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Vec4.prototype, "yyz", {
                get: function () {
                    return math.Vec3.temp(this.y, this.y, this.z);
                },
                set: function (v3fVec) {
                    this.y = v3fVec.x;
                    this.y = v3fVec.y;
                    this.z = v3fVec.z;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Vec4.prototype, "yyw", {
                get: function () {
                    return math.Vec3.temp(this.y, this.y, this.w);
                },
                set: function (v3fVec) {
                    this.y = v3fVec.x;
                    this.y = v3fVec.y;
                    this.w = v3fVec.z;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Vec4.prototype, "yzx", {
                get: function () {
                    return math.Vec3.temp(this.y, this.z, this.x);
                },
                set: function (v3fVec) {
                    this.y = v3fVec.x;
                    this.z = v3fVec.y;
                    this.x = v3fVec.z;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Vec4.prototype, "yzy", {
                get: function () {
                    return math.Vec3.temp(this.y, this.z, this.y);
                },
                set: function (v3fVec) {
                    this.y = v3fVec.x;
                    this.z = v3fVec.y;
                    this.y = v3fVec.z;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Vec4.prototype, "yzz", {
                get: function () {
                    return math.Vec3.temp(this.y, this.z, this.z);
                },
                set: function (v3fVec) {
                    this.y = v3fVec.x;
                    this.z = v3fVec.y;
                    this.z = v3fVec.z;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Vec4.prototype, "yzw", {
                get: function () {
                    return math.Vec3.temp(this.y, this.z, this.w);
                },
                set: function (v3fVec) {
                    this.y = v3fVec.x;
                    this.z = v3fVec.y;
                    this.w = v3fVec.z;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Vec4.prototype, "ywx", {
                get: function () {
                    return math.Vec3.temp(this.y, this.w, this.x);
                },
                set: function (v3fVec) {
                    this.y = v3fVec.x;
                    this.w = v3fVec.y;
                    this.x = v3fVec.z;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Vec4.prototype, "ywy", {
                get: function () {
                    return math.Vec3.temp(this.y, this.w, this.y);
                },
                set: function (v3fVec) {
                    this.y = v3fVec.x;
                    this.w = v3fVec.y;
                    this.y = v3fVec.z;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Vec4.prototype, "ywz", {
                get: function () {
                    return math.Vec3.temp(this.y, this.w, this.z);
                },
                set: function (v3fVec) {
                    this.y = v3fVec.x;
                    this.w = v3fVec.y;
                    this.z = v3fVec.z;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Vec4.prototype, "yww", {
                get: function () {
                    return math.Vec3.temp(this.y, this.w, this.w);
                },
                set: function (v3fVec) {
                    this.y = v3fVec.x;
                    this.w = v3fVec.y;
                    this.w = v3fVec.z;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Vec4.prototype, "zxx", {
                get: function () {
                    return math.Vec3.temp(this.z, this.x, this.x);
                },
                set: function (v3fVec) {
                    this.z = v3fVec.x;
                    this.x = v3fVec.y;
                    this.x = v3fVec.z;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Vec4.prototype, "zxy", {
                get: function () {
                    return math.Vec3.temp(this.z, this.x, this.y);
                },
                set: function (v3fVec) {
                    this.z = v3fVec.x;
                    this.x = v3fVec.y;
                    this.y = v3fVec.z;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Vec4.prototype, "zxz", {
                get: function () {
                    return math.Vec3.temp(this.z, this.x, this.z);
                },
                set: function (v3fVec) {
                    this.z = v3fVec.x;
                    this.x = v3fVec.y;
                    this.z = v3fVec.z;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Vec4.prototype, "zxw", {
                get: function () {
                    return math.Vec3.temp(this.z, this.x, this.w);
                },
                set: function (v3fVec) {
                    this.z = v3fVec.x;
                    this.x = v3fVec.y;
                    this.w = v3fVec.z;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Vec4.prototype, "zyx", {
                get: function () {
                    return math.Vec3.temp(this.z, this.y, this.x);
                },
                set: function (v3fVec) {
                    this.z = v3fVec.x;
                    this.y = v3fVec.y;
                    this.x = v3fVec.z;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Vec4.prototype, "zyy", {
                get: function () {
                    return math.Vec3.temp(this.z, this.y, this.y);
                },
                set: function (v3fVec) {
                    this.z = v3fVec.x;
                    this.y = v3fVec.y;
                    this.y = v3fVec.z;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Vec4.prototype, "zyz", {
                get: function () {
                    return math.Vec3.temp(this.z, this.y, this.z);
                },
                set: function (v3fVec) {
                    this.z = v3fVec.x;
                    this.y = v3fVec.y;
                    this.z = v3fVec.z;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Vec4.prototype, "zyw", {
                get: function () {
                    return math.Vec3.temp(this.z, this.y, this.w);
                },
                set: function (v3fVec) {
                    this.z = v3fVec.x;
                    this.y = v3fVec.y;
                    this.w = v3fVec.z;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Vec4.prototype, "zzx", {
                get: function () {
                    return math.Vec3.temp(this.z, this.z, this.x);
                },
                set: function (v3fVec) {
                    this.z = v3fVec.x;
                    this.z = v3fVec.y;
                    this.x = v3fVec.z;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Vec4.prototype, "zzy", {
                get: function () {
                    return math.Vec3.temp(this.z, this.z, this.y);
                },
                set: function (v3fVec) {
                    this.z = v3fVec.x;
                    this.z = v3fVec.y;
                    this.y = v3fVec.z;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Vec4.prototype, "zzz", {
                get: function () {
                    return math.Vec3.temp(this.z, this.z, this.z);
                },
                set: function (v3fVec) {
                    this.z = v3fVec.x;
                    this.z = v3fVec.y;
                    this.z = v3fVec.z;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Vec4.prototype, "zzw", {
                get: function () {
                    return math.Vec3.temp(this.z, this.z, this.w);
                },
                set: function (v3fVec) {
                    this.z = v3fVec.x;
                    this.z = v3fVec.y;
                    this.w = v3fVec.z;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Vec4.prototype, "zwx", {
                get: function () {
                    return math.Vec3.temp(this.z, this.w, this.x);
                },
                set: function (v3fVec) {
                    this.z = v3fVec.x;
                    this.w = v3fVec.y;
                    this.x = v3fVec.z;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Vec4.prototype, "zwy", {
                get: function () {
                    return math.Vec3.temp(this.z, this.w, this.y);
                },
                set: function (v3fVec) {
                    this.z = v3fVec.x;
                    this.w = v3fVec.y;
                    this.y = v3fVec.z;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Vec4.prototype, "zwz", {
                get: function () {
                    return math.Vec3.temp(this.z, this.w, this.z);
                },
                set: function (v3fVec) {
                    this.z = v3fVec.x;
                    this.w = v3fVec.y;
                    this.z = v3fVec.z;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Vec4.prototype, "zww", {
                get: function () {
                    return math.Vec3.temp(this.z, this.w, this.w);
                },
                set: function (v3fVec) {
                    this.z = v3fVec.x;
                    this.w = v3fVec.y;
                    this.w = v3fVec.z;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Vec4.prototype, "wxx", {
                get: function () {
                    return math.Vec3.temp(this.w, this.x, this.x);
                },
                set: function (v3fVec) {
                    this.w = v3fVec.x;
                    this.x = v3fVec.y;
                    this.x = v3fVec.z;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Vec4.prototype, "wxy", {
                get: function () {
                    return math.Vec3.temp(this.w, this.x, this.y);
                },
                set: function (v3fVec) {
                    this.w = v3fVec.x;
                    this.x = v3fVec.y;
                    this.y = v3fVec.z;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Vec4.prototype, "wxz", {
                get: function () {
                    return math.Vec3.temp(this.w, this.x, this.z);
                },
                set: function (v3fVec) {
                    this.w = v3fVec.x;
                    this.x = v3fVec.y;
                    this.z = v3fVec.z;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Vec4.prototype, "wxw", {
                get: function () {
                    return math.Vec3.temp(this.w, this.x, this.w);
                },
                set: function (v3fVec) {
                    this.w = v3fVec.x;
                    this.x = v3fVec.y;
                    this.w = v3fVec.z;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Vec4.prototype, "wyx", {
                get: function () {
                    return math.Vec3.temp(this.w, this.y, this.x);
                },
                set: function (v3fVec) {
                    this.w = v3fVec.x;
                    this.y = v3fVec.y;
                    this.x = v3fVec.z;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Vec4.prototype, "wyy", {
                get: function () {
                    return math.Vec3.temp(this.w, this.y, this.y);
                },
                set: function (v3fVec) {
                    this.w = v3fVec.x;
                    this.y = v3fVec.y;
                    this.y = v3fVec.z;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Vec4.prototype, "wyz", {
                get: function () {
                    return math.Vec3.temp(this.w, this.y, this.z);
                },
                set: function (v3fVec) {
                    this.w = v3fVec.x;
                    this.y = v3fVec.y;
                    this.z = v3fVec.z;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Vec4.prototype, "wyw", {
                get: function () {
                    return math.Vec3.temp(this.w, this.y, this.w);
                },
                set: function (v3fVec) {
                    this.w = v3fVec.x;
                    this.y = v3fVec.y;
                    this.w = v3fVec.z;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Vec4.prototype, "wzx", {
                get: function () {
                    return math.Vec3.temp(this.w, this.z, this.x);
                },
                set: function (v3fVec) {
                    this.w = v3fVec.x;
                    this.z = v3fVec.y;
                    this.x = v3fVec.z;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Vec4.prototype, "wzy", {
                get: function () {
                    return math.Vec3.temp(this.w, this.z, this.y);
                },
                set: function (v3fVec) {
                    this.w = v3fVec.x;
                    this.z = v3fVec.y;
                    this.y = v3fVec.z;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Vec4.prototype, "wzz", {
                get: function () {
                    return math.Vec3.temp(this.w, this.z, this.z);
                },
                set: function (v3fVec) {
                    this.w = v3fVec.x;
                    this.z = v3fVec.y;
                    this.z = v3fVec.z;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Vec4.prototype, "wzw", {
                get: function () {
                    return math.Vec3.temp(this.w, this.z, this.w);
                },
                set: function (v3fVec) {
                    this.w = v3fVec.x;
                    this.z = v3fVec.y;
                    this.w = v3fVec.z;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Vec4.prototype, "wwx", {
                get: function () {
                    return math.Vec3.temp(this.w, this.w, this.x);
                },
                set: function (v3fVec) {
                    this.w = v3fVec.x;
                    this.w = v3fVec.y;
                    this.x = v3fVec.z;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Vec4.prototype, "wwy", {
                get: function () {
                    return math.Vec3.temp(this.w, this.w, this.y);
                },
                set: function (v3fVec) {
                    this.w = v3fVec.x;
                    this.w = v3fVec.y;
                    this.y = v3fVec.z;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Vec4.prototype, "wwz", {
                get: function () {
                    return math.Vec3.temp(this.w, this.w, this.z);
                },
                set: function (v3fVec) {
                    this.w = v3fVec.x;
                    this.w = v3fVec.y;
                    this.z = v3fVec.z;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Vec4.prototype, "www", {
                get: function () {
                    return math.Vec3.temp(this.w, this.w, this.w);
                },
                set: function (v3fVec) {
                    this.w = v3fVec.x;
                    this.w = v3fVec.y;
                    this.w = v3fVec.z;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Vec4.prototype, "xxxx", {
                get: function () {
                    return Vec4.temp(this.x, this.x, this.x, this.x);
                },
                set: function (v4fVec) {
                    this.x = v4fVec.x;
                    this.x = v4fVec.y;
                    this.x = v4fVec.z;
                    this.x = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Vec4.prototype, "xxxy", {
                get: function () {
                    return Vec4.temp(this.x, this.x, this.x, this.y);
                },
                set: function (v4fVec) {
                    this.x = v4fVec.x;
                    this.x = v4fVec.y;
                    this.x = v4fVec.z;
                    this.y = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Vec4.prototype, "xxxz", {
                get: function () {
                    return Vec4.temp(this.x, this.x, this.x, this.z);
                },
                set: function (v4fVec) {
                    this.x = v4fVec.x;
                    this.x = v4fVec.y;
                    this.x = v4fVec.z;
                    this.z = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Vec4.prototype, "xxxw", {
                get: function () {
                    return Vec4.temp(this.x, this.x, this.x, this.w);
                },
                set: function (v4fVec) {
                    this.x = v4fVec.x;
                    this.x = v4fVec.y;
                    this.x = v4fVec.z;
                    this.w = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Vec4.prototype, "xxyx", {
                get: function () {
                    return Vec4.temp(this.x, this.x, this.y, this.x);
                },
                set: function (v4fVec) {
                    this.x = v4fVec.x;
                    this.x = v4fVec.y;
                    this.y = v4fVec.z;
                    this.x = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Vec4.prototype, "xxyy", {
                get: function () {
                    return Vec4.temp(this.x, this.x, this.y, this.y);
                },
                set: function (v4fVec) {
                    this.x = v4fVec.x;
                    this.x = v4fVec.y;
                    this.y = v4fVec.z;
                    this.y = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Vec4.prototype, "xxyz", {
                get: function () {
                    return Vec4.temp(this.x, this.x, this.y, this.z);
                },
                set: function (v4fVec) {
                    this.x = v4fVec.x;
                    this.x = v4fVec.y;
                    this.y = v4fVec.z;
                    this.z = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Vec4.prototype, "xxyw", {
                get: function () {
                    return Vec4.temp(this.x, this.x, this.y, this.w);
                },
                set: function (v4fVec) {
                    this.x = v4fVec.x;
                    this.x = v4fVec.y;
                    this.y = v4fVec.z;
                    this.w = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Vec4.prototype, "xxzx", {
                get: function () {
                    return Vec4.temp(this.x, this.x, this.z, this.x);
                },
                set: function (v4fVec) {
                    this.x = v4fVec.x;
                    this.x = v4fVec.y;
                    this.z = v4fVec.z;
                    this.x = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Vec4.prototype, "xxzy", {
                get: function () {
                    return Vec4.temp(this.x, this.x, this.z, this.y);
                },
                set: function (v4fVec) {
                    this.x = v4fVec.x;
                    this.x = v4fVec.y;
                    this.z = v4fVec.z;
                    this.y = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Vec4.prototype, "xxzz", {
                get: function () {
                    return Vec4.temp(this.x, this.x, this.z, this.z);
                },
                set: function (v4fVec) {
                    this.x = v4fVec.x;
                    this.x = v4fVec.y;
                    this.z = v4fVec.z;
                    this.z = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Vec4.prototype, "xxzw", {
                get: function () {
                    return Vec4.temp(this.x, this.x, this.z, this.w);
                },
                set: function (v4fVec) {
                    this.x = v4fVec.x;
                    this.x = v4fVec.y;
                    this.z = v4fVec.z;
                    this.w = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Vec4.prototype, "xxwx", {
                get: function () {
                    return Vec4.temp(this.x, this.x, this.w, this.x);
                },
                set: function (v4fVec) {
                    this.x = v4fVec.x;
                    this.x = v4fVec.y;
                    this.w = v4fVec.z;
                    this.x = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Vec4.prototype, "xxwy", {
                get: function () {
                    return Vec4.temp(this.x, this.x, this.w, this.y);
                },
                set: function (v4fVec) {
                    this.x = v4fVec.x;
                    this.x = v4fVec.y;
                    this.w = v4fVec.z;
                    this.y = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Vec4.prototype, "xxwz", {
                get: function () {
                    return Vec4.temp(this.x, this.x, this.w, this.z);
                },
                set: function (v4fVec) {
                    this.x = v4fVec.x;
                    this.x = v4fVec.y;
                    this.w = v4fVec.z;
                    this.z = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Vec4.prototype, "xxww", {
                get: function () {
                    return Vec4.temp(this.x, this.x, this.w, this.w);
                },
                set: function (v4fVec) {
                    this.x = v4fVec.x;
                    this.x = v4fVec.y;
                    this.w = v4fVec.z;
                    this.w = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Vec4.prototype, "xyxx", {
                get: function () {
                    return Vec4.temp(this.x, this.y, this.x, this.x);
                },
                set: function (v4fVec) {
                    this.x = v4fVec.x;
                    this.y = v4fVec.y;
                    this.x = v4fVec.z;
                    this.x = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Vec4.prototype, "xyxy", {
                get: function () {
                    return Vec4.temp(this.x, this.y, this.x, this.y);
                },
                set: function (v4fVec) {
                    this.x = v4fVec.x;
                    this.y = v4fVec.y;
                    this.x = v4fVec.z;
                    this.y = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Vec4.prototype, "xyxz", {
                get: function () {
                    return Vec4.temp(this.x, this.y, this.x, this.z);
                },
                set: function (v4fVec) {
                    this.x = v4fVec.x;
                    this.y = v4fVec.y;
                    this.x = v4fVec.z;
                    this.z = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Vec4.prototype, "xyxw", {
                get: function () {
                    return Vec4.temp(this.x, this.y, this.x, this.w);
                },
                set: function (v4fVec) {
                    this.x = v4fVec.x;
                    this.y = v4fVec.y;
                    this.x = v4fVec.z;
                    this.w = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Vec4.prototype, "xyyx", {
                get: function () {
                    return Vec4.temp(this.x, this.y, this.y, this.x);
                },
                set: function (v4fVec) {
                    this.x = v4fVec.x;
                    this.y = v4fVec.y;
                    this.y = v4fVec.z;
                    this.x = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Vec4.prototype, "xyyy", {
                get: function () {
                    return Vec4.temp(this.x, this.y, this.y, this.y);
                },
                set: function (v4fVec) {
                    this.x = v4fVec.x;
                    this.y = v4fVec.y;
                    this.y = v4fVec.z;
                    this.y = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Vec4.prototype, "xyyz", {
                get: function () {
                    return Vec4.temp(this.x, this.y, this.y, this.z);
                },
                set: function (v4fVec) {
                    this.x = v4fVec.x;
                    this.y = v4fVec.y;
                    this.y = v4fVec.z;
                    this.z = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Vec4.prototype, "xyyw", {
                get: function () {
                    return Vec4.temp(this.x, this.y, this.y, this.w);
                },
                set: function (v4fVec) {
                    this.x = v4fVec.x;
                    this.y = v4fVec.y;
                    this.y = v4fVec.z;
                    this.w = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Vec4.prototype, "xyzx", {
                get: function () {
                    return Vec4.temp(this.x, this.y, this.z, this.x);
                },
                set: function (v4fVec) {
                    this.x = v4fVec.x;
                    this.y = v4fVec.y;
                    this.z = v4fVec.z;
                    this.x = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Vec4.prototype, "xyzy", {
                get: function () {
                    return Vec4.temp(this.x, this.y, this.z, this.y);
                },
                set: function (v4fVec) {
                    this.x = v4fVec.x;
                    this.y = v4fVec.y;
                    this.z = v4fVec.z;
                    this.y = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Vec4.prototype, "xyzz", {
                get: function () {
                    return Vec4.temp(this.x, this.y, this.z, this.z);
                },
                set: function (v4fVec) {
                    this.x = v4fVec.x;
                    this.y = v4fVec.y;
                    this.z = v4fVec.z;
                    this.z = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Vec4.prototype, "xyzw", {
                get: function () {
                    return Vec4.temp(this.x, this.y, this.z, this.w);
                },
                set: function (v4fVec) {
                    this.x = v4fVec.x;
                    this.y = v4fVec.y;
                    this.z = v4fVec.z;
                    this.w = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Vec4.prototype, "xywx", {
                get: function () {
                    return Vec4.temp(this.x, this.y, this.w, this.x);
                },
                set: function (v4fVec) {
                    this.x = v4fVec.x;
                    this.y = v4fVec.y;
                    this.w = v4fVec.z;
                    this.x = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Vec4.prototype, "xywy", {
                get: function () {
                    return Vec4.temp(this.x, this.y, this.w, this.y);
                },
                set: function (v4fVec) {
                    this.x = v4fVec.x;
                    this.y = v4fVec.y;
                    this.w = v4fVec.z;
                    this.y = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Vec4.prototype, "xywz", {
                get: function () {
                    return Vec4.temp(this.x, this.y, this.w, this.z);
                },
                set: function (v4fVec) {
                    this.x = v4fVec.x;
                    this.y = v4fVec.y;
                    this.w = v4fVec.z;
                    this.z = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Vec4.prototype, "xyww", {
                get: function () {
                    return Vec4.temp(this.x, this.y, this.w, this.w);
                },
                set: function (v4fVec) {
                    this.x = v4fVec.x;
                    this.y = v4fVec.y;
                    this.w = v4fVec.z;
                    this.w = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Vec4.prototype, "xzxx", {
                get: function () {
                    return Vec4.temp(this.x, this.z, this.x, this.x);
                },
                set: function (v4fVec) {
                    this.x = v4fVec.x;
                    this.z = v4fVec.y;
                    this.x = v4fVec.z;
                    this.x = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Vec4.prototype, "xzxy", {
                get: function () {
                    return Vec4.temp(this.x, this.z, this.x, this.y);
                },
                set: function (v4fVec) {
                    this.x = v4fVec.x;
                    this.z = v4fVec.y;
                    this.x = v4fVec.z;
                    this.y = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Vec4.prototype, "xzxz", {
                get: function () {
                    return Vec4.temp(this.x, this.z, this.x, this.z);
                },
                set: function (v4fVec) {
                    this.x = v4fVec.x;
                    this.z = v4fVec.y;
                    this.x = v4fVec.z;
                    this.z = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Vec4.prototype, "xzxw", {
                get: function () {
                    return Vec4.temp(this.x, this.z, this.x, this.w);
                },
                set: function (v4fVec) {
                    this.x = v4fVec.x;
                    this.z = v4fVec.y;
                    this.x = v4fVec.z;
                    this.w = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Vec4.prototype, "xzyx", {
                get: function () {
                    return Vec4.temp(this.x, this.z, this.y, this.x);
                },
                set: function (v4fVec) {
                    this.x = v4fVec.x;
                    this.z = v4fVec.y;
                    this.y = v4fVec.z;
                    this.x = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Vec4.prototype, "xzyy", {
                get: function () {
                    return Vec4.temp(this.x, this.z, this.y, this.y);
                },
                set: function (v4fVec) {
                    this.x = v4fVec.x;
                    this.z = v4fVec.y;
                    this.y = v4fVec.z;
                    this.y = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Vec4.prototype, "xzyz", {
                get: function () {
                    return Vec4.temp(this.x, this.z, this.y, this.z);
                },
                set: function (v4fVec) {
                    this.x = v4fVec.x;
                    this.z = v4fVec.y;
                    this.y = v4fVec.z;
                    this.z = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Vec4.prototype, "xzyw", {
                get: function () {
                    return Vec4.temp(this.x, this.z, this.y, this.w);
                },
                set: function (v4fVec) {
                    this.x = v4fVec.x;
                    this.z = v4fVec.y;
                    this.y = v4fVec.z;
                    this.w = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Vec4.prototype, "xzzx", {
                get: function () {
                    return Vec4.temp(this.x, this.z, this.z, this.x);
                },
                set: function (v4fVec) {
                    this.x = v4fVec.x;
                    this.z = v4fVec.y;
                    this.z = v4fVec.z;
                    this.x = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Vec4.prototype, "xzzy", {
                get: function () {
                    return Vec4.temp(this.x, this.z, this.z, this.y);
                },
                set: function (v4fVec) {
                    this.x = v4fVec.x;
                    this.z = v4fVec.y;
                    this.z = v4fVec.z;
                    this.y = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Vec4.prototype, "xzzz", {
                get: function () {
                    return Vec4.temp(this.x, this.z, this.z, this.z);
                },
                set: function (v4fVec) {
                    this.x = v4fVec.x;
                    this.z = v4fVec.y;
                    this.z = v4fVec.z;
                    this.z = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Vec4.prototype, "xzzw", {
                get: function () {
                    return Vec4.temp(this.x, this.z, this.z, this.w);
                },
                set: function (v4fVec) {
                    this.x = v4fVec.x;
                    this.z = v4fVec.y;
                    this.z = v4fVec.z;
                    this.w = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Vec4.prototype, "xzwx", {
                get: function () {
                    return Vec4.temp(this.x, this.z, this.w, this.x);
                },
                set: function (v4fVec) {
                    this.x = v4fVec.x;
                    this.z = v4fVec.y;
                    this.w = v4fVec.z;
                    this.x = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Vec4.prototype, "xzwy", {
                get: function () {
                    return Vec4.temp(this.x, this.z, this.w, this.y);
                },
                set: function (v4fVec) {
                    this.x = v4fVec.x;
                    this.z = v4fVec.y;
                    this.w = v4fVec.z;
                    this.y = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Vec4.prototype, "xzwz", {
                get: function () {
                    return Vec4.temp(this.x, this.z, this.w, this.z);
                },
                set: function (v4fVec) {
                    this.x = v4fVec.x;
                    this.z = v4fVec.y;
                    this.w = v4fVec.z;
                    this.z = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Vec4.prototype, "xzww", {
                get: function () {
                    return Vec4.temp(this.x, this.z, this.w, this.w);
                },
                set: function (v4fVec) {
                    this.x = v4fVec.x;
                    this.z = v4fVec.y;
                    this.w = v4fVec.z;
                    this.w = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Vec4.prototype, "xwxx", {
                get: function () {
                    return Vec4.temp(this.x, this.w, this.x, this.x);
                },
                set: function (v4fVec) {
                    this.x = v4fVec.x;
                    this.w = v4fVec.y;
                    this.x = v4fVec.z;
                    this.x = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Vec4.prototype, "xwxy", {
                get: function () {
                    return Vec4.temp(this.x, this.w, this.x, this.y);
                },
                set: function (v4fVec) {
                    this.x = v4fVec.x;
                    this.w = v4fVec.y;
                    this.x = v4fVec.z;
                    this.y = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Vec4.prototype, "xwxz", {
                get: function () {
                    return Vec4.temp(this.x, this.w, this.x, this.z);
                },
                set: function (v4fVec) {
                    this.x = v4fVec.x;
                    this.w = v4fVec.y;
                    this.x = v4fVec.z;
                    this.z = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Vec4.prototype, "xwxw", {
                get: function () {
                    return Vec4.temp(this.x, this.w, this.x, this.w);
                },
                set: function (v4fVec) {
                    this.x = v4fVec.x;
                    this.w = v4fVec.y;
                    this.x = v4fVec.z;
                    this.w = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Vec4.prototype, "xwyx", {
                get: function () {
                    return Vec4.temp(this.x, this.w, this.y, this.x);
                },
                set: function (v4fVec) {
                    this.x = v4fVec.x;
                    this.w = v4fVec.y;
                    this.y = v4fVec.z;
                    this.x = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Vec4.prototype, "xwyy", {
                get: function () {
                    return Vec4.temp(this.x, this.w, this.y, this.y);
                },
                set: function (v4fVec) {
                    this.x = v4fVec.x;
                    this.w = v4fVec.y;
                    this.y = v4fVec.z;
                    this.y = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Vec4.prototype, "xwyz", {
                get: function () {
                    return Vec4.temp(this.x, this.w, this.y, this.z);
                },
                set: function (v4fVec) {
                    this.x = v4fVec.x;
                    this.w = v4fVec.y;
                    this.y = v4fVec.z;
                    this.z = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Vec4.prototype, "xwyw", {
                get: function () {
                    return Vec4.temp(this.x, this.w, this.y, this.w);
                },
                set: function (v4fVec) {
                    this.x = v4fVec.x;
                    this.w = v4fVec.y;
                    this.y = v4fVec.z;
                    this.w = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Vec4.prototype, "xwzx", {
                get: function () {
                    return Vec4.temp(this.x, this.w, this.z, this.x);
                },
                set: function (v4fVec) {
                    this.x = v4fVec.x;
                    this.w = v4fVec.y;
                    this.z = v4fVec.z;
                    this.x = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Vec4.prototype, "xwzy", {
                get: function () {
                    return Vec4.temp(this.x, this.w, this.z, this.y);
                },
                set: function (v4fVec) {
                    this.x = v4fVec.x;
                    this.w = v4fVec.y;
                    this.z = v4fVec.z;
                    this.y = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Vec4.prototype, "xwzz", {
                get: function () {
                    return Vec4.temp(this.x, this.w, this.z, this.z);
                },
                set: function (v4fVec) {
                    this.x = v4fVec.x;
                    this.w = v4fVec.y;
                    this.z = v4fVec.z;
                    this.z = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Vec4.prototype, "xwzw", {
                get: function () {
                    return Vec4.temp(this.x, this.w, this.z, this.w);
                },
                set: function (v4fVec) {
                    this.x = v4fVec.x;
                    this.w = v4fVec.y;
                    this.z = v4fVec.z;
                    this.w = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Vec4.prototype, "xwwx", {
                get: function () {
                    return Vec4.temp(this.x, this.w, this.w, this.x);
                },
                set: function (v4fVec) {
                    this.x = v4fVec.x;
                    this.w = v4fVec.y;
                    this.w = v4fVec.z;
                    this.x = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Vec4.prototype, "xwwy", {
                get: function () {
                    return Vec4.temp(this.x, this.w, this.w, this.y);
                },
                set: function (v4fVec) {
                    this.x = v4fVec.x;
                    this.w = v4fVec.y;
                    this.w = v4fVec.z;
                    this.y = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Vec4.prototype, "xwwz", {
                get: function () {
                    return Vec4.temp(this.x, this.w, this.w, this.z);
                },
                set: function (v4fVec) {
                    this.x = v4fVec.x;
                    this.w = v4fVec.y;
                    this.w = v4fVec.z;
                    this.z = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Vec4.prototype, "xwww", {
                get: function () {
                    return Vec4.temp(this.x, this.w, this.w, this.w);
                },
                set: function (v4fVec) {
                    this.x = v4fVec.x;
                    this.w = v4fVec.y;
                    this.w = v4fVec.z;
                    this.w = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Vec4.prototype, "yxxx", {
                get: function () {
                    return Vec4.temp(this.y, this.x, this.x, this.x);
                },
                set: function (v4fVec) {
                    this.y = v4fVec.x;
                    this.x = v4fVec.y;
                    this.x = v4fVec.z;
                    this.x = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Vec4.prototype, "yxxy", {
                get: function () {
                    return Vec4.temp(this.y, this.x, this.x, this.y);
                },
                set: function (v4fVec) {
                    this.y = v4fVec.x;
                    this.x = v4fVec.y;
                    this.x = v4fVec.z;
                    this.y = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Vec4.prototype, "yxxz", {
                get: function () {
                    return Vec4.temp(this.y, this.x, this.x, this.z);
                },
                set: function (v4fVec) {
                    this.y = v4fVec.x;
                    this.x = v4fVec.y;
                    this.x = v4fVec.z;
                    this.z = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Vec4.prototype, "yxxw", {
                get: function () {
                    return Vec4.temp(this.y, this.x, this.x, this.w);
                },
                set: function (v4fVec) {
                    this.y = v4fVec.x;
                    this.x = v4fVec.y;
                    this.x = v4fVec.z;
                    this.w = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Vec4.prototype, "yxyx", {
                get: function () {
                    return Vec4.temp(this.y, this.x, this.y, this.x);
                },
                set: function (v4fVec) {
                    this.y = v4fVec.x;
                    this.x = v4fVec.y;
                    this.y = v4fVec.z;
                    this.x = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Vec4.prototype, "yxyy", {
                get: function () {
                    return Vec4.temp(this.y, this.x, this.y, this.y);
                },
                set: function (v4fVec) {
                    this.y = v4fVec.x;
                    this.x = v4fVec.y;
                    this.y = v4fVec.z;
                    this.y = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Vec4.prototype, "yxyz", {
                get: function () {
                    return Vec4.temp(this.y, this.x, this.y, this.z);
                },
                set: function (v4fVec) {
                    this.y = v4fVec.x;
                    this.x = v4fVec.y;
                    this.y = v4fVec.z;
                    this.z = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Vec4.prototype, "yxyw", {
                get: function () {
                    return Vec4.temp(this.y, this.x, this.y, this.w);
                },
                set: function (v4fVec) {
                    this.y = v4fVec.x;
                    this.x = v4fVec.y;
                    this.y = v4fVec.z;
                    this.w = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Vec4.prototype, "yxzx", {
                get: function () {
                    return Vec4.temp(this.y, this.x, this.z, this.x);
                },
                set: function (v4fVec) {
                    this.y = v4fVec.x;
                    this.x = v4fVec.y;
                    this.z = v4fVec.z;
                    this.x = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Vec4.prototype, "yxzy", {
                get: function () {
                    return Vec4.temp(this.y, this.x, this.z, this.y);
                },
                set: function (v4fVec) {
                    this.y = v4fVec.x;
                    this.x = v4fVec.y;
                    this.z = v4fVec.z;
                    this.y = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Vec4.prototype, "yxzz", {
                get: function () {
                    return Vec4.temp(this.y, this.x, this.z, this.z);
                },
                set: function (v4fVec) {
                    this.y = v4fVec.x;
                    this.x = v4fVec.y;
                    this.z = v4fVec.z;
                    this.z = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Vec4.prototype, "yxzw", {
                get: function () {
                    return Vec4.temp(this.y, this.x, this.z, this.w);
                },
                set: function (v4fVec) {
                    this.y = v4fVec.x;
                    this.x = v4fVec.y;
                    this.z = v4fVec.z;
                    this.w = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Vec4.prototype, "yxwx", {
                get: function () {
                    return Vec4.temp(this.y, this.x, this.w, this.x);
                },
                set: function (v4fVec) {
                    this.y = v4fVec.x;
                    this.x = v4fVec.y;
                    this.w = v4fVec.z;
                    this.x = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Vec4.prototype, "yxwy", {
                get: function () {
                    return Vec4.temp(this.y, this.x, this.w, this.y);
                },
                set: function (v4fVec) {
                    this.y = v4fVec.x;
                    this.x = v4fVec.y;
                    this.w = v4fVec.z;
                    this.y = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Vec4.prototype, "yxwz", {
                get: function () {
                    return Vec4.temp(this.y, this.x, this.w, this.z);
                },
                set: function (v4fVec) {
                    this.y = v4fVec.x;
                    this.x = v4fVec.y;
                    this.w = v4fVec.z;
                    this.z = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Vec4.prototype, "yxww", {
                get: function () {
                    return Vec4.temp(this.y, this.x, this.w, this.w);
                },
                set: function (v4fVec) {
                    this.y = v4fVec.x;
                    this.x = v4fVec.y;
                    this.w = v4fVec.z;
                    this.w = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Vec4.prototype, "yyxx", {
                get: function () {
                    return Vec4.temp(this.y, this.y, this.x, this.x);
                },
                set: function (v4fVec) {
                    this.y = v4fVec.x;
                    this.y = v4fVec.y;
                    this.x = v4fVec.z;
                    this.x = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Vec4.prototype, "yyxy", {
                get: function () {
                    return Vec4.temp(this.y, this.y, this.x, this.y);
                },
                set: function (v4fVec) {
                    this.y = v4fVec.x;
                    this.y = v4fVec.y;
                    this.x = v4fVec.z;
                    this.y = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Vec4.prototype, "yyxz", {
                get: function () {
                    return Vec4.temp(this.y, this.y, this.x, this.z);
                },
                set: function (v4fVec) {
                    this.y = v4fVec.x;
                    this.y = v4fVec.y;
                    this.x = v4fVec.z;
                    this.z = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Vec4.prototype, "yyxw", {
                get: function () {
                    return Vec4.temp(this.y, this.y, this.x, this.w);
                },
                set: function (v4fVec) {
                    this.y = v4fVec.x;
                    this.y = v4fVec.y;
                    this.x = v4fVec.z;
                    this.w = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Vec4.prototype, "yyyx", {
                get: function () {
                    return Vec4.temp(this.y, this.y, this.y, this.x);
                },
                set: function (v4fVec) {
                    this.y = v4fVec.x;
                    this.y = v4fVec.y;
                    this.y = v4fVec.z;
                    this.x = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Vec4.prototype, "yyyy", {
                get: function () {
                    return Vec4.temp(this.y, this.y, this.y, this.y);
                },
                set: function (v4fVec) {
                    this.y = v4fVec.x;
                    this.y = v4fVec.y;
                    this.y = v4fVec.z;
                    this.y = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Vec4.prototype, "yyyz", {
                get: function () {
                    return Vec4.temp(this.y, this.y, this.y, this.z);
                },
                set: function (v4fVec) {
                    this.y = v4fVec.x;
                    this.y = v4fVec.y;
                    this.y = v4fVec.z;
                    this.z = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Vec4.prototype, "yyyw", {
                get: function () {
                    return Vec4.temp(this.y, this.y, this.y, this.w);
                },
                set: function (v4fVec) {
                    this.y = v4fVec.x;
                    this.y = v4fVec.y;
                    this.y = v4fVec.z;
                    this.w = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Vec4.prototype, "yyzx", {
                get: function () {
                    return Vec4.temp(this.y, this.y, this.z, this.x);
                },
                set: function (v4fVec) {
                    this.y = v4fVec.x;
                    this.y = v4fVec.y;
                    this.z = v4fVec.z;
                    this.x = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Vec4.prototype, "yyzy", {
                get: function () {
                    return Vec4.temp(this.y, this.y, this.z, this.y);
                },
                set: function (v4fVec) {
                    this.y = v4fVec.x;
                    this.y = v4fVec.y;
                    this.z = v4fVec.z;
                    this.y = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Vec4.prototype, "yyzz", {
                get: function () {
                    return Vec4.temp(this.y, this.y, this.z, this.z);
                },
                set: function (v4fVec) {
                    this.y = v4fVec.x;
                    this.y = v4fVec.y;
                    this.z = v4fVec.z;
                    this.z = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Vec4.prototype, "yyzw", {
                get: function () {
                    return Vec4.temp(this.y, this.y, this.z, this.w);
                },
                set: function (v4fVec) {
                    this.y = v4fVec.x;
                    this.y = v4fVec.y;
                    this.z = v4fVec.z;
                    this.w = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Vec4.prototype, "yywx", {
                get: function () {
                    return Vec4.temp(this.y, this.y, this.w, this.x);
                },
                set: function (v4fVec) {
                    this.y = v4fVec.x;
                    this.y = v4fVec.y;
                    this.w = v4fVec.z;
                    this.x = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Vec4.prototype, "yywy", {
                get: function () {
                    return Vec4.temp(this.y, this.y, this.w, this.y);
                },
                set: function (v4fVec) {
                    this.y = v4fVec.x;
                    this.y = v4fVec.y;
                    this.w = v4fVec.z;
                    this.y = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Vec4.prototype, "yywz", {
                get: function () {
                    return Vec4.temp(this.y, this.y, this.w, this.z);
                },
                set: function (v4fVec) {
                    this.y = v4fVec.x;
                    this.y = v4fVec.y;
                    this.w = v4fVec.z;
                    this.z = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Vec4.prototype, "yyww", {
                get: function () {
                    return Vec4.temp(this.y, this.y, this.w, this.w);
                },
                set: function (v4fVec) {
                    this.y = v4fVec.x;
                    this.y = v4fVec.y;
                    this.w = v4fVec.z;
                    this.w = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Vec4.prototype, "yzxx", {
                get: function () {
                    return Vec4.temp(this.y, this.z, this.x, this.x);
                },
                set: function (v4fVec) {
                    this.y = v4fVec.x;
                    this.z = v4fVec.y;
                    this.x = v4fVec.z;
                    this.x = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Vec4.prototype, "yzxy", {
                get: function () {
                    return Vec4.temp(this.y, this.z, this.x, this.y);
                },
                set: function (v4fVec) {
                    this.y = v4fVec.x;
                    this.z = v4fVec.y;
                    this.x = v4fVec.z;
                    this.y = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Vec4.prototype, "yzxz", {
                get: function () {
                    return Vec4.temp(this.y, this.z, this.x, this.z);
                },
                set: function (v4fVec) {
                    this.y = v4fVec.x;
                    this.z = v4fVec.y;
                    this.x = v4fVec.z;
                    this.z = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Vec4.prototype, "yzxw", {
                get: function () {
                    return Vec4.temp(this.y, this.z, this.x, this.w);
                },
                set: function (v4fVec) {
                    this.y = v4fVec.x;
                    this.z = v4fVec.y;
                    this.x = v4fVec.z;
                    this.w = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Vec4.prototype, "yzyx", {
                get: function () {
                    return Vec4.temp(this.y, this.z, this.y, this.x);
                },
                set: function (v4fVec) {
                    this.y = v4fVec.x;
                    this.z = v4fVec.y;
                    this.y = v4fVec.z;
                    this.x = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Vec4.prototype, "yzyy", {
                get: function () {
                    return Vec4.temp(this.y, this.z, this.y, this.y);
                },
                set: function (v4fVec) {
                    this.y = v4fVec.x;
                    this.z = v4fVec.y;
                    this.y = v4fVec.z;
                    this.y = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Vec4.prototype, "yzyz", {
                get: function () {
                    return Vec4.temp(this.y, this.z, this.y, this.z);
                },
                set: function (v4fVec) {
                    this.y = v4fVec.x;
                    this.z = v4fVec.y;
                    this.y = v4fVec.z;
                    this.z = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Vec4.prototype, "yzyw", {
                get: function () {
                    return Vec4.temp(this.y, this.z, this.y, this.w);
                },
                set: function (v4fVec) {
                    this.y = v4fVec.x;
                    this.z = v4fVec.y;
                    this.y = v4fVec.z;
                    this.w = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Vec4.prototype, "yzzx", {
                get: function () {
                    return Vec4.temp(this.y, this.z, this.z, this.x);
                },
                set: function (v4fVec) {
                    this.y = v4fVec.x;
                    this.z = v4fVec.y;
                    this.z = v4fVec.z;
                    this.x = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Vec4.prototype, "yzzy", {
                get: function () {
                    return Vec4.temp(this.y, this.z, this.z, this.y);
                },
                set: function (v4fVec) {
                    this.y = v4fVec.x;
                    this.z = v4fVec.y;
                    this.z = v4fVec.z;
                    this.y = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Vec4.prototype, "yzzz", {
                get: function () {
                    return Vec4.temp(this.y, this.z, this.z, this.z);
                },
                set: function (v4fVec) {
                    this.y = v4fVec.x;
                    this.z = v4fVec.y;
                    this.z = v4fVec.z;
                    this.z = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Vec4.prototype, "yzzw", {
                get: function () {
                    return Vec4.temp(this.y, this.z, this.z, this.w);
                },
                set: function (v4fVec) {
                    this.y = v4fVec.x;
                    this.z = v4fVec.y;
                    this.z = v4fVec.z;
                    this.w = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Vec4.prototype, "yzwx", {
                get: function () {
                    return Vec4.temp(this.y, this.z, this.w, this.x);
                },
                set: function (v4fVec) {
                    this.y = v4fVec.x;
                    this.z = v4fVec.y;
                    this.w = v4fVec.z;
                    this.x = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Vec4.prototype, "yzwy", {
                get: function () {
                    return Vec4.temp(this.y, this.z, this.w, this.y);
                },
                set: function (v4fVec) {
                    this.y = v4fVec.x;
                    this.z = v4fVec.y;
                    this.w = v4fVec.z;
                    this.y = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Vec4.prototype, "yzwz", {
                get: function () {
                    return Vec4.temp(this.y, this.z, this.w, this.z);
                },
                set: function (v4fVec) {
                    this.y = v4fVec.x;
                    this.z = v4fVec.y;
                    this.w = v4fVec.z;
                    this.z = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Vec4.prototype, "yzww", {
                get: function () {
                    return Vec4.temp(this.y, this.z, this.w, this.w);
                },
                set: function (v4fVec) {
                    this.y = v4fVec.x;
                    this.z = v4fVec.y;
                    this.w = v4fVec.z;
                    this.w = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Vec4.prototype, "ywxx", {
                get: function () {
                    return Vec4.temp(this.y, this.w, this.x, this.x);
                },
                set: function (v4fVec) {
                    this.y = v4fVec.x;
                    this.w = v4fVec.y;
                    this.x = v4fVec.z;
                    this.x = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Vec4.prototype, "ywxy", {
                get: function () {
                    return Vec4.temp(this.y, this.w, this.x, this.y);
                },
                set: function (v4fVec) {
                    this.y = v4fVec.x;
                    this.w = v4fVec.y;
                    this.x = v4fVec.z;
                    this.y = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Vec4.prototype, "ywxz", {
                get: function () {
                    return Vec4.temp(this.y, this.w, this.x, this.z);
                },
                set: function (v4fVec) {
                    this.y = v4fVec.x;
                    this.w = v4fVec.y;
                    this.x = v4fVec.z;
                    this.z = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Vec4.prototype, "ywxw", {
                get: function () {
                    return Vec4.temp(this.y, this.w, this.x, this.w);
                },
                set: function (v4fVec) {
                    this.y = v4fVec.x;
                    this.w = v4fVec.y;
                    this.x = v4fVec.z;
                    this.w = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Vec4.prototype, "ywyx", {
                get: function () {
                    return Vec4.temp(this.y, this.w, this.y, this.x);
                },
                set: function (v4fVec) {
                    this.y = v4fVec.x;
                    this.w = v4fVec.y;
                    this.y = v4fVec.z;
                    this.x = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Vec4.prototype, "ywyy", {
                get: function () {
                    return Vec4.temp(this.y, this.w, this.y, this.y);
                },
                set: function (v4fVec) {
                    this.y = v4fVec.x;
                    this.w = v4fVec.y;
                    this.y = v4fVec.z;
                    this.y = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Vec4.prototype, "ywyz", {
                get: function () {
                    return Vec4.temp(this.y, this.w, this.y, this.z);
                },
                set: function (v4fVec) {
                    this.y = v4fVec.x;
                    this.w = v4fVec.y;
                    this.y = v4fVec.z;
                    this.z = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Vec4.prototype, "ywyw", {
                get: function () {
                    return Vec4.temp(this.y, this.w, this.y, this.w);
                },
                set: function (v4fVec) {
                    this.y = v4fVec.x;
                    this.w = v4fVec.y;
                    this.y = v4fVec.z;
                    this.w = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Vec4.prototype, "ywzx", {
                get: function () {
                    return Vec4.temp(this.y, this.w, this.z, this.x);
                },
                set: function (v4fVec) {
                    this.y = v4fVec.x;
                    this.w = v4fVec.y;
                    this.z = v4fVec.z;
                    this.x = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Vec4.prototype, "ywzy", {
                get: function () {
                    return Vec4.temp(this.y, this.w, this.z, this.y);
                },
                set: function (v4fVec) {
                    this.y = v4fVec.x;
                    this.w = v4fVec.y;
                    this.z = v4fVec.z;
                    this.y = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Vec4.prototype, "ywzz", {
                get: function () {
                    return Vec4.temp(this.y, this.w, this.z, this.z);
                },
                set: function (v4fVec) {
                    this.y = v4fVec.x;
                    this.w = v4fVec.y;
                    this.z = v4fVec.z;
                    this.z = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Vec4.prototype, "ywzw", {
                get: function () {
                    return Vec4.temp(this.y, this.w, this.z, this.w);
                },
                set: function (v4fVec) {
                    this.y = v4fVec.x;
                    this.w = v4fVec.y;
                    this.z = v4fVec.z;
                    this.w = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Vec4.prototype, "ywwx", {
                get: function () {
                    return Vec4.temp(this.y, this.w, this.w, this.x);
                },
                set: function (v4fVec) {
                    this.y = v4fVec.x;
                    this.w = v4fVec.y;
                    this.w = v4fVec.z;
                    this.x = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Vec4.prototype, "ywwy", {
                get: function () {
                    return Vec4.temp(this.y, this.w, this.w, this.y);
                },
                set: function (v4fVec) {
                    this.y = v4fVec.x;
                    this.w = v4fVec.y;
                    this.w = v4fVec.z;
                    this.y = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Vec4.prototype, "ywwz", {
                get: function () {
                    return Vec4.temp(this.y, this.w, this.w, this.z);
                },
                set: function (v4fVec) {
                    this.y = v4fVec.x;
                    this.w = v4fVec.y;
                    this.w = v4fVec.z;
                    this.z = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Vec4.prototype, "ywww", {
                get: function () {
                    return Vec4.temp(this.y, this.w, this.w, this.w);
                },
                set: function (v4fVec) {
                    this.y = v4fVec.x;
                    this.w = v4fVec.y;
                    this.w = v4fVec.z;
                    this.w = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Vec4.prototype, "zxxx", {
                get: function () {
                    return Vec4.temp(this.z, this.x, this.x, this.x);
                },
                set: function (v4fVec) {
                    this.z = v4fVec.x;
                    this.x = v4fVec.y;
                    this.x = v4fVec.z;
                    this.x = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Vec4.prototype, "zxxy", {
                get: function () {
                    return Vec4.temp(this.z, this.x, this.x, this.y);
                },
                set: function (v4fVec) {
                    this.z = v4fVec.x;
                    this.x = v4fVec.y;
                    this.x = v4fVec.z;
                    this.y = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Vec4.prototype, "zxxz", {
                get: function () {
                    return Vec4.temp(this.z, this.x, this.x, this.z);
                },
                set: function (v4fVec) {
                    this.z = v4fVec.x;
                    this.x = v4fVec.y;
                    this.x = v4fVec.z;
                    this.z = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Vec4.prototype, "zxxw", {
                get: function () {
                    return Vec4.temp(this.z, this.x, this.x, this.w);
                },
                set: function (v4fVec) {
                    this.z = v4fVec.x;
                    this.x = v4fVec.y;
                    this.x = v4fVec.z;
                    this.w = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Vec4.prototype, "zxyx", {
                get: function () {
                    return Vec4.temp(this.z, this.x, this.y, this.x);
                },
                set: function (v4fVec) {
                    this.z = v4fVec.x;
                    this.x = v4fVec.y;
                    this.y = v4fVec.z;
                    this.x = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Vec4.prototype, "zxyy", {
                get: function () {
                    return Vec4.temp(this.z, this.x, this.y, this.y);
                },
                set: function (v4fVec) {
                    this.z = v4fVec.x;
                    this.x = v4fVec.y;
                    this.y = v4fVec.z;
                    this.y = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Vec4.prototype, "zxyz", {
                get: function () {
                    return Vec4.temp(this.z, this.x, this.y, this.z);
                },
                set: function (v4fVec) {
                    this.z = v4fVec.x;
                    this.x = v4fVec.y;
                    this.y = v4fVec.z;
                    this.z = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Vec4.prototype, "zxyw", {
                get: function () {
                    return Vec4.temp(this.z, this.x, this.y, this.w);
                },
                set: function (v4fVec) {
                    this.z = v4fVec.x;
                    this.x = v4fVec.y;
                    this.y = v4fVec.z;
                    this.w = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Vec4.prototype, "zxzx", {
                get: function () {
                    return Vec4.temp(this.z, this.x, this.z, this.x);
                },
                set: function (v4fVec) {
                    this.z = v4fVec.x;
                    this.x = v4fVec.y;
                    this.z = v4fVec.z;
                    this.x = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Vec4.prototype, "zxzy", {
                get: function () {
                    return Vec4.temp(this.z, this.x, this.z, this.y);
                },
                set: function (v4fVec) {
                    this.z = v4fVec.x;
                    this.x = v4fVec.y;
                    this.z = v4fVec.z;
                    this.y = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Vec4.prototype, "zxzz", {
                get: function () {
                    return Vec4.temp(this.z, this.x, this.z, this.z);
                },
                set: function (v4fVec) {
                    this.z = v4fVec.x;
                    this.x = v4fVec.y;
                    this.z = v4fVec.z;
                    this.z = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Vec4.prototype, "zxzw", {
                get: function () {
                    return Vec4.temp(this.z, this.x, this.z, this.w);
                },
                set: function (v4fVec) {
                    this.z = v4fVec.x;
                    this.x = v4fVec.y;
                    this.z = v4fVec.z;
                    this.w = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Vec4.prototype, "zxwx", {
                get: function () {
                    return Vec4.temp(this.z, this.x, this.w, this.x);
                },
                set: function (v4fVec) {
                    this.z = v4fVec.x;
                    this.x = v4fVec.y;
                    this.w = v4fVec.z;
                    this.x = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Vec4.prototype, "zxwy", {
                get: function () {
                    return Vec4.temp(this.z, this.x, this.w, this.y);
                },
                set: function (v4fVec) {
                    this.z = v4fVec.x;
                    this.x = v4fVec.y;
                    this.w = v4fVec.z;
                    this.y = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Vec4.prototype, "zxwz", {
                get: function () {
                    return Vec4.temp(this.z, this.x, this.w, this.z);
                },
                set: function (v4fVec) {
                    this.z = v4fVec.x;
                    this.x = v4fVec.y;
                    this.w = v4fVec.z;
                    this.z = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Vec4.prototype, "zxww", {
                get: function () {
                    return Vec4.temp(this.z, this.x, this.w, this.w);
                },
                set: function (v4fVec) {
                    this.z = v4fVec.x;
                    this.x = v4fVec.y;
                    this.w = v4fVec.z;
                    this.w = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Vec4.prototype, "zyxx", {
                get: function () {
                    return Vec4.temp(this.z, this.y, this.x, this.x);
                },
                set: function (v4fVec) {
                    this.z = v4fVec.x;
                    this.y = v4fVec.y;
                    this.x = v4fVec.z;
                    this.x = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Vec4.prototype, "zyxy", {
                get: function () {
                    return Vec4.temp(this.z, this.y, this.x, this.y);
                },
                set: function (v4fVec) {
                    this.z = v4fVec.x;
                    this.y = v4fVec.y;
                    this.x = v4fVec.z;
                    this.y = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Vec4.prototype, "zyxz", {
                get: function () {
                    return Vec4.temp(this.z, this.y, this.x, this.z);
                },
                set: function (v4fVec) {
                    this.z = v4fVec.x;
                    this.y = v4fVec.y;
                    this.x = v4fVec.z;
                    this.z = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Vec4.prototype, "zyxw", {
                get: function () {
                    return Vec4.temp(this.z, this.y, this.x, this.w);
                },
                set: function (v4fVec) {
                    this.z = v4fVec.x;
                    this.y = v4fVec.y;
                    this.x = v4fVec.z;
                    this.w = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Vec4.prototype, "zyyx", {
                get: function () {
                    return Vec4.temp(this.z, this.y, this.y, this.x);
                },
                set: function (v4fVec) {
                    this.z = v4fVec.x;
                    this.y = v4fVec.y;
                    this.y = v4fVec.z;
                    this.x = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Vec4.prototype, "zyyy", {
                get: function () {
                    return Vec4.temp(this.z, this.y, this.y, this.y);
                },
                set: function (v4fVec) {
                    this.z = v4fVec.x;
                    this.y = v4fVec.y;
                    this.y = v4fVec.z;
                    this.y = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Vec4.prototype, "zyyz", {
                get: function () {
                    return Vec4.temp(this.z, this.y, this.y, this.z);
                },
                set: function (v4fVec) {
                    this.z = v4fVec.x;
                    this.y = v4fVec.y;
                    this.y = v4fVec.z;
                    this.z = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Vec4.prototype, "zyyw", {
                get: function () {
                    return Vec4.temp(this.z, this.y, this.y, this.w);
                },
                set: function (v4fVec) {
                    this.z = v4fVec.x;
                    this.y = v4fVec.y;
                    this.y = v4fVec.z;
                    this.w = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Vec4.prototype, "zyzx", {
                get: function () {
                    return Vec4.temp(this.z, this.y, this.z, this.x);
                },
                set: function (v4fVec) {
                    this.z = v4fVec.x;
                    this.y = v4fVec.y;
                    this.z = v4fVec.z;
                    this.x = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Vec4.prototype, "zyzy", {
                get: function () {
                    return Vec4.temp(this.z, this.y, this.z, this.y);
                },
                set: function (v4fVec) {
                    this.z = v4fVec.x;
                    this.y = v4fVec.y;
                    this.z = v4fVec.z;
                    this.y = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Vec4.prototype, "zyzz", {
                get: function () {
                    return Vec4.temp(this.z, this.y, this.z, this.z);
                },
                set: function (v4fVec) {
                    this.z = v4fVec.x;
                    this.y = v4fVec.y;
                    this.z = v4fVec.z;
                    this.z = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Vec4.prototype, "zyzw", {
                get: function () {
                    return Vec4.temp(this.z, this.y, this.z, this.w);
                },
                set: function (v4fVec) {
                    this.z = v4fVec.x;
                    this.y = v4fVec.y;
                    this.z = v4fVec.z;
                    this.w = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Vec4.prototype, "zywx", {
                get: function () {
                    return Vec4.temp(this.z, this.y, this.w, this.x);
                },
                set: function (v4fVec) {
                    this.z = v4fVec.x;
                    this.y = v4fVec.y;
                    this.w = v4fVec.z;
                    this.x = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Vec4.prototype, "zywy", {
                get: function () {
                    return Vec4.temp(this.z, this.y, this.w, this.y);
                },
                set: function (v4fVec) {
                    this.z = v4fVec.x;
                    this.y = v4fVec.y;
                    this.w = v4fVec.z;
                    this.y = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Vec4.prototype, "zywz", {
                get: function () {
                    return Vec4.temp(this.z, this.y, this.w, this.z);
                },
                set: function (v4fVec) {
                    this.z = v4fVec.x;
                    this.y = v4fVec.y;
                    this.w = v4fVec.z;
                    this.z = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Vec4.prototype, "zyww", {
                get: function () {
                    return Vec4.temp(this.z, this.y, this.w, this.w);
                },
                set: function (v4fVec) {
                    this.z = v4fVec.x;
                    this.y = v4fVec.y;
                    this.w = v4fVec.z;
                    this.w = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Vec4.prototype, "zzxx", {
                get: function () {
                    return Vec4.temp(this.z, this.z, this.x, this.x);
                },
                set: function (v4fVec) {
                    this.z = v4fVec.x;
                    this.z = v4fVec.y;
                    this.x = v4fVec.z;
                    this.x = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Vec4.prototype, "zzxy", {
                get: function () {
                    return Vec4.temp(this.z, this.z, this.x, this.y);
                },
                set: function (v4fVec) {
                    this.z = v4fVec.x;
                    this.z = v4fVec.y;
                    this.x = v4fVec.z;
                    this.y = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Vec4.prototype, "zzxz", {
                get: function () {
                    return Vec4.temp(this.z, this.z, this.x, this.z);
                },
                set: function (v4fVec) {
                    this.z = v4fVec.x;
                    this.z = v4fVec.y;
                    this.x = v4fVec.z;
                    this.z = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Vec4.prototype, "zzxw", {
                get: function () {
                    return Vec4.temp(this.z, this.z, this.x, this.w);
                },
                set: function (v4fVec) {
                    this.z = v4fVec.x;
                    this.z = v4fVec.y;
                    this.x = v4fVec.z;
                    this.w = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Vec4.prototype, "zzyx", {
                get: function () {
                    return Vec4.temp(this.z, this.z, this.y, this.x);
                },
                set: function (v4fVec) {
                    this.z = v4fVec.x;
                    this.z = v4fVec.y;
                    this.y = v4fVec.z;
                    this.x = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Vec4.prototype, "zzyy", {
                get: function () {
                    return Vec4.temp(this.z, this.z, this.y, this.y);
                },
                set: function (v4fVec) {
                    this.z = v4fVec.x;
                    this.z = v4fVec.y;
                    this.y = v4fVec.z;
                    this.y = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Vec4.prototype, "zzyz", {
                get: function () {
                    return Vec4.temp(this.z, this.z, this.y, this.z);
                },
                set: function (v4fVec) {
                    this.z = v4fVec.x;
                    this.z = v4fVec.y;
                    this.y = v4fVec.z;
                    this.z = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Vec4.prototype, "zzyw", {
                get: function () {
                    return Vec4.temp(this.z, this.z, this.y, this.w);
                },
                set: function (v4fVec) {
                    this.z = v4fVec.x;
                    this.z = v4fVec.y;
                    this.y = v4fVec.z;
                    this.w = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Vec4.prototype, "zzzx", {
                get: function () {
                    return Vec4.temp(this.z, this.z, this.z, this.x);
                },
                set: function (v4fVec) {
                    this.z = v4fVec.x;
                    this.z = v4fVec.y;
                    this.z = v4fVec.z;
                    this.x = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Vec4.prototype, "zzzy", {
                get: function () {
                    return Vec4.temp(this.z, this.z, this.z, this.y);
                },
                set: function (v4fVec) {
                    this.z = v4fVec.x;
                    this.z = v4fVec.y;
                    this.z = v4fVec.z;
                    this.y = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Vec4.prototype, "zzzz", {
                get: function () {
                    return Vec4.temp(this.z, this.z, this.z, this.z);
                },
                set: function (v4fVec) {
                    this.z = v4fVec.x;
                    this.z = v4fVec.y;
                    this.z = v4fVec.z;
                    this.z = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Vec4.prototype, "zzzw", {
                get: function () {
                    return Vec4.temp(this.z, this.z, this.z, this.w);
                },
                set: function (v4fVec) {
                    this.z = v4fVec.x;
                    this.z = v4fVec.y;
                    this.z = v4fVec.z;
                    this.w = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Vec4.prototype, "zzwx", {
                get: function () {
                    return Vec4.temp(this.z, this.z, this.w, this.x);
                },
                set: function (v4fVec) {
                    this.z = v4fVec.x;
                    this.z = v4fVec.y;
                    this.w = v4fVec.z;
                    this.x = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Vec4.prototype, "zzwy", {
                get: function () {
                    return Vec4.temp(this.z, this.z, this.w, this.y);
                },
                set: function (v4fVec) {
                    this.z = v4fVec.x;
                    this.z = v4fVec.y;
                    this.w = v4fVec.z;
                    this.y = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Vec4.prototype, "zzwz", {
                get: function () {
                    return Vec4.temp(this.z, this.z, this.w, this.z);
                },
                set: function (v4fVec) {
                    this.z = v4fVec.x;
                    this.z = v4fVec.y;
                    this.w = v4fVec.z;
                    this.z = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Vec4.prototype, "zzww", {
                get: function () {
                    return Vec4.temp(this.z, this.z, this.w, this.w);
                },
                set: function (v4fVec) {
                    this.z = v4fVec.x;
                    this.z = v4fVec.y;
                    this.w = v4fVec.z;
                    this.w = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Vec4.prototype, "zwxx", {
                get: function () {
                    return Vec4.temp(this.z, this.w, this.x, this.x);
                },
                set: function (v4fVec) {
                    this.z = v4fVec.x;
                    this.w = v4fVec.y;
                    this.x = v4fVec.z;
                    this.x = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Vec4.prototype, "zwxy", {
                get: function () {
                    return Vec4.temp(this.z, this.w, this.x, this.y);
                },
                set: function (v4fVec) {
                    this.z = v4fVec.x;
                    this.w = v4fVec.y;
                    this.x = v4fVec.z;
                    this.y = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Vec4.prototype, "zwxz", {
                get: function () {
                    return Vec4.temp(this.z, this.w, this.x, this.z);
                },
                set: function (v4fVec) {
                    this.z = v4fVec.x;
                    this.w = v4fVec.y;
                    this.x = v4fVec.z;
                    this.z = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Vec4.prototype, "zwxw", {
                get: function () {
                    return Vec4.temp(this.z, this.w, this.x, this.w);
                },
                set: function (v4fVec) {
                    this.z = v4fVec.x;
                    this.w = v4fVec.y;
                    this.x = v4fVec.z;
                    this.w = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Vec4.prototype, "zwyx", {
                get: function () {
                    return Vec4.temp(this.z, this.w, this.y, this.x);
                },
                set: function (v4fVec) {
                    this.z = v4fVec.x;
                    this.w = v4fVec.y;
                    this.y = v4fVec.z;
                    this.x = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Vec4.prototype, "zwyy", {
                get: function () {
                    return Vec4.temp(this.z, this.w, this.y, this.y);
                },
                set: function (v4fVec) {
                    this.z = v4fVec.x;
                    this.w = v4fVec.y;
                    this.y = v4fVec.z;
                    this.y = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Vec4.prototype, "zwyz", {
                get: function () {
                    return Vec4.temp(this.z, this.w, this.y, this.z);
                },
                set: function (v4fVec) {
                    this.z = v4fVec.x;
                    this.w = v4fVec.y;
                    this.y = v4fVec.z;
                    this.z = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Vec4.prototype, "zwyw", {
                get: function () {
                    return Vec4.temp(this.z, this.w, this.y, this.w);
                },
                set: function (v4fVec) {
                    this.z = v4fVec.x;
                    this.w = v4fVec.y;
                    this.y = v4fVec.z;
                    this.w = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Vec4.prototype, "zwzx", {
                get: function () {
                    return Vec4.temp(this.z, this.w, this.z, this.x);
                },
                set: function (v4fVec) {
                    this.z = v4fVec.x;
                    this.w = v4fVec.y;
                    this.z = v4fVec.z;
                    this.x = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Vec4.prototype, "zwzy", {
                get: function () {
                    return Vec4.temp(this.z, this.w, this.z, this.y);
                },
                set: function (v4fVec) {
                    this.z = v4fVec.x;
                    this.w = v4fVec.y;
                    this.z = v4fVec.z;
                    this.y = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Vec4.prototype, "zwzz", {
                get: function () {
                    return Vec4.temp(this.z, this.w, this.z, this.z);
                },
                set: function (v4fVec) {
                    this.z = v4fVec.x;
                    this.w = v4fVec.y;
                    this.z = v4fVec.z;
                    this.z = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Vec4.prototype, "zwzw", {
                get: function () {
                    return Vec4.temp(this.z, this.w, this.z, this.w);
                },
                set: function (v4fVec) {
                    this.z = v4fVec.x;
                    this.w = v4fVec.y;
                    this.z = v4fVec.z;
                    this.w = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Vec4.prototype, "zwwx", {
                get: function () {
                    return Vec4.temp(this.z, this.w, this.w, this.x);
                },
                set: function (v4fVec) {
                    this.z = v4fVec.x;
                    this.w = v4fVec.y;
                    this.w = v4fVec.z;
                    this.x = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Vec4.prototype, "zwwy", {
                get: function () {
                    return Vec4.temp(this.z, this.w, this.w, this.y);
                },
                set: function (v4fVec) {
                    this.z = v4fVec.x;
                    this.w = v4fVec.y;
                    this.w = v4fVec.z;
                    this.y = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Vec4.prototype, "zwwz", {
                get: function () {
                    return Vec4.temp(this.z, this.w, this.w, this.z);
                },
                set: function (v4fVec) {
                    this.z = v4fVec.x;
                    this.w = v4fVec.y;
                    this.w = v4fVec.z;
                    this.z = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Vec4.prototype, "zwww", {
                get: function () {
                    return Vec4.temp(this.z, this.w, this.w, this.w);
                },
                set: function (v4fVec) {
                    this.z = v4fVec.x;
                    this.w = v4fVec.y;
                    this.w = v4fVec.z;
                    this.w = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Vec4.prototype, "wxxx", {
                get: function () {
                    return Vec4.temp(this.w, this.x, this.x, this.x);
                },
                set: function (v4fVec) {
                    this.w = v4fVec.x;
                    this.x = v4fVec.y;
                    this.x = v4fVec.z;
                    this.x = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Vec4.prototype, "wxxy", {
                get: function () {
                    return Vec4.temp(this.w, this.x, this.x, this.y);
                },
                set: function (v4fVec) {
                    this.w = v4fVec.x;
                    this.x = v4fVec.y;
                    this.x = v4fVec.z;
                    this.y = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Vec4.prototype, "wxxz", {
                get: function () {
                    return Vec4.temp(this.w, this.x, this.x, this.z);
                },
                set: function (v4fVec) {
                    this.w = v4fVec.x;
                    this.x = v4fVec.y;
                    this.x = v4fVec.z;
                    this.z = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Vec4.prototype, "wxxw", {
                get: function () {
                    return Vec4.temp(this.w, this.x, this.x, this.w);
                },
                set: function (v4fVec) {
                    this.w = v4fVec.x;
                    this.x = v4fVec.y;
                    this.x = v4fVec.z;
                    this.w = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Vec4.prototype, "wxyx", {
                get: function () {
                    return Vec4.temp(this.w, this.x, this.y, this.x);
                },
                set: function (v4fVec) {
                    this.w = v4fVec.x;
                    this.x = v4fVec.y;
                    this.y = v4fVec.z;
                    this.x = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Vec4.prototype, "wxyy", {
                get: function () {
                    return Vec4.temp(this.w, this.x, this.y, this.y);
                },
                set: function (v4fVec) {
                    this.w = v4fVec.x;
                    this.x = v4fVec.y;
                    this.y = v4fVec.z;
                    this.y = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Vec4.prototype, "wxyz", {
                get: function () {
                    return Vec4.temp(this.w, this.x, this.y, this.z);
                },
                set: function (v4fVec) {
                    this.w = v4fVec.x;
                    this.x = v4fVec.y;
                    this.y = v4fVec.z;
                    this.z = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Vec4.prototype, "wxyw", {
                get: function () {
                    return Vec4.temp(this.w, this.x, this.y, this.w);
                },
                set: function (v4fVec) {
                    this.w = v4fVec.x;
                    this.x = v4fVec.y;
                    this.y = v4fVec.z;
                    this.w = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Vec4.prototype, "wxzx", {
                get: function () {
                    return Vec4.temp(this.w, this.x, this.z, this.x);
                },
                set: function (v4fVec) {
                    this.w = v4fVec.x;
                    this.x = v4fVec.y;
                    this.z = v4fVec.z;
                    this.x = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Vec4.prototype, "wxzy", {
                get: function () {
                    return Vec4.temp(this.w, this.x, this.z, this.y);
                },
                set: function (v4fVec) {
                    this.w = v4fVec.x;
                    this.x = v4fVec.y;
                    this.z = v4fVec.z;
                    this.y = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Vec4.prototype, "wxzz", {
                get: function () {
                    return Vec4.temp(this.w, this.x, this.z, this.z);
                },
                set: function (v4fVec) {
                    this.w = v4fVec.x;
                    this.x = v4fVec.y;
                    this.z = v4fVec.z;
                    this.z = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Vec4.prototype, "wxzw", {
                get: function () {
                    return Vec4.temp(this.w, this.x, this.z, this.w);
                },
                set: function (v4fVec) {
                    this.w = v4fVec.x;
                    this.x = v4fVec.y;
                    this.z = v4fVec.z;
                    this.w = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Vec4.prototype, "wxwx", {
                get: function () {
                    return Vec4.temp(this.w, this.x, this.w, this.x);
                },
                set: function (v4fVec) {
                    this.w = v4fVec.x;
                    this.x = v4fVec.y;
                    this.w = v4fVec.z;
                    this.x = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Vec4.prototype, "wxwy", {
                get: function () {
                    return Vec4.temp(this.w, this.x, this.w, this.y);
                },
                set: function (v4fVec) {
                    this.w = v4fVec.x;
                    this.x = v4fVec.y;
                    this.w = v4fVec.z;
                    this.y = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Vec4.prototype, "wxwz", {
                get: function () {
                    return Vec4.temp(this.w, this.x, this.w, this.z);
                },
                set: function (v4fVec) {
                    this.w = v4fVec.x;
                    this.x = v4fVec.y;
                    this.w = v4fVec.z;
                    this.z = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Vec4.prototype, "wxww", {
                get: function () {
                    return Vec4.temp(this.w, this.x, this.w, this.w);
                },
                set: function (v4fVec) {
                    this.w = v4fVec.x;
                    this.x = v4fVec.y;
                    this.w = v4fVec.z;
                    this.w = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Vec4.prototype, "wyxx", {
                get: function () {
                    return Vec4.temp(this.w, this.y, this.x, this.x);
                },
                set: function (v4fVec) {
                    this.w = v4fVec.x;
                    this.y = v4fVec.y;
                    this.x = v4fVec.z;
                    this.x = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Vec4.prototype, "wyxy", {
                get: function () {
                    return Vec4.temp(this.w, this.y, this.x, this.y);
                },
                set: function (v4fVec) {
                    this.w = v4fVec.x;
                    this.y = v4fVec.y;
                    this.x = v4fVec.z;
                    this.y = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Vec4.prototype, "wyxz", {
                get: function () {
                    return Vec4.temp(this.w, this.y, this.x, this.z);
                },
                set: function (v4fVec) {
                    this.w = v4fVec.x;
                    this.y = v4fVec.y;
                    this.x = v4fVec.z;
                    this.z = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Vec4.prototype, "wyxw", {
                get: function () {
                    return Vec4.temp(this.w, this.y, this.x, this.w);
                },
                set: function (v4fVec) {
                    this.w = v4fVec.x;
                    this.y = v4fVec.y;
                    this.x = v4fVec.z;
                    this.w = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Vec4.prototype, "wyyx", {
                get: function () {
                    return Vec4.temp(this.w, this.y, this.y, this.x);
                },
                set: function (v4fVec) {
                    this.w = v4fVec.x;
                    this.y = v4fVec.y;
                    this.y = v4fVec.z;
                    this.x = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Vec4.prototype, "wyyy", {
                get: function () {
                    return Vec4.temp(this.w, this.y, this.y, this.y);
                },
                set: function (v4fVec) {
                    this.w = v4fVec.x;
                    this.y = v4fVec.y;
                    this.y = v4fVec.z;
                    this.y = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Vec4.prototype, "wyyz", {
                get: function () {
                    return Vec4.temp(this.w, this.y, this.y, this.z);
                },
                set: function (v4fVec) {
                    this.w = v4fVec.x;
                    this.y = v4fVec.y;
                    this.y = v4fVec.z;
                    this.z = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Vec4.prototype, "wyyw", {
                get: function () {
                    return Vec4.temp(this.w, this.y, this.y, this.w);
                },
                set: function (v4fVec) {
                    this.w = v4fVec.x;
                    this.y = v4fVec.y;
                    this.y = v4fVec.z;
                    this.w = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Vec4.prototype, "wyzx", {
                get: function () {
                    return Vec4.temp(this.w, this.y, this.z, this.x);
                },
                set: function (v4fVec) {
                    this.w = v4fVec.x;
                    this.y = v4fVec.y;
                    this.z = v4fVec.z;
                    this.x = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Vec4.prototype, "wyzy", {
                get: function () {
                    return Vec4.temp(this.w, this.y, this.z, this.y);
                },
                set: function (v4fVec) {
                    this.w = v4fVec.x;
                    this.y = v4fVec.y;
                    this.z = v4fVec.z;
                    this.y = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Vec4.prototype, "wyzz", {
                get: function () {
                    return Vec4.temp(this.w, this.y, this.z, this.z);
                },
                set: function (v4fVec) {
                    this.w = v4fVec.x;
                    this.y = v4fVec.y;
                    this.z = v4fVec.z;
                    this.z = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Vec4.prototype, "wyzw", {
                get: function () {
                    return Vec4.temp(this.w, this.y, this.z, this.w);
                },
                set: function (v4fVec) {
                    this.w = v4fVec.x;
                    this.y = v4fVec.y;
                    this.z = v4fVec.z;
                    this.w = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Vec4.prototype, "wywx", {
                get: function () {
                    return Vec4.temp(this.w, this.y, this.w, this.x);
                },
                set: function (v4fVec) {
                    this.w = v4fVec.x;
                    this.y = v4fVec.y;
                    this.w = v4fVec.z;
                    this.x = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Vec4.prototype, "wywy", {
                get: function () {
                    return Vec4.temp(this.w, this.y, this.w, this.y);
                },
                set: function (v4fVec) {
                    this.w = v4fVec.x;
                    this.y = v4fVec.y;
                    this.w = v4fVec.z;
                    this.y = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Vec4.prototype, "wywz", {
                get: function () {
                    return Vec4.temp(this.w, this.y, this.w, this.z);
                },
                set: function (v4fVec) {
                    this.w = v4fVec.x;
                    this.y = v4fVec.y;
                    this.w = v4fVec.z;
                    this.z = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Vec4.prototype, "wyww", {
                get: function () {
                    return Vec4.temp(this.w, this.y, this.w, this.w);
                },
                set: function (v4fVec) {
                    this.w = v4fVec.x;
                    this.y = v4fVec.y;
                    this.w = v4fVec.z;
                    this.w = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Vec4.prototype, "wzxx", {
                get: function () {
                    return Vec4.temp(this.w, this.z, this.x, this.x);
                },
                set: function (v4fVec) {
                    this.w = v4fVec.x;
                    this.z = v4fVec.y;
                    this.x = v4fVec.z;
                    this.x = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Vec4.prototype, "wzxy", {
                get: function () {
                    return Vec4.temp(this.w, this.z, this.x, this.y);
                },
                set: function (v4fVec) {
                    this.w = v4fVec.x;
                    this.z = v4fVec.y;
                    this.x = v4fVec.z;
                    this.y = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Vec4.prototype, "wzxz", {
                get: function () {
                    return Vec4.temp(this.w, this.z, this.x, this.z);
                },
                set: function (v4fVec) {
                    this.w = v4fVec.x;
                    this.z = v4fVec.y;
                    this.x = v4fVec.z;
                    this.z = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Vec4.prototype, "wzxw", {
                get: function () {
                    return Vec4.temp(this.w, this.z, this.x, this.w);
                },
                set: function (v4fVec) {
                    this.w = v4fVec.x;
                    this.z = v4fVec.y;
                    this.x = v4fVec.z;
                    this.w = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Vec4.prototype, "wzyx", {
                get: function () {
                    return Vec4.temp(this.w, this.z, this.y, this.x);
                },
                set: function (v4fVec) {
                    this.w = v4fVec.x;
                    this.z = v4fVec.y;
                    this.y = v4fVec.z;
                    this.x = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Vec4.prototype, "wzyy", {
                get: function () {
                    return Vec4.temp(this.w, this.z, this.y, this.y);
                },
                set: function (v4fVec) {
                    this.w = v4fVec.x;
                    this.z = v4fVec.y;
                    this.y = v4fVec.z;
                    this.y = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Vec4.prototype, "wzyz", {
                get: function () {
                    return Vec4.temp(this.w, this.z, this.y, this.z);
                },
                set: function (v4fVec) {
                    this.w = v4fVec.x;
                    this.z = v4fVec.y;
                    this.y = v4fVec.z;
                    this.z = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Vec4.prototype, "wzyw", {
                get: function () {
                    return Vec4.temp(this.w, this.z, this.y, this.w);
                },
                set: function (v4fVec) {
                    this.w = v4fVec.x;
                    this.z = v4fVec.y;
                    this.y = v4fVec.z;
                    this.w = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Vec4.prototype, "wzzx", {
                get: function () {
                    return Vec4.temp(this.w, this.z, this.z, this.x);
                },
                set: function (v4fVec) {
                    this.w = v4fVec.x;
                    this.z = v4fVec.y;
                    this.z = v4fVec.z;
                    this.x = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Vec4.prototype, "wzzy", {
                get: function () {
                    return Vec4.temp(this.w, this.z, this.z, this.y);
                },
                set: function (v4fVec) {
                    this.w = v4fVec.x;
                    this.z = v4fVec.y;
                    this.z = v4fVec.z;
                    this.y = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Vec4.prototype, "wzzz", {
                get: function () {
                    return Vec4.temp(this.w, this.z, this.z, this.z);
                },
                set: function (v4fVec) {
                    this.w = v4fVec.x;
                    this.z = v4fVec.y;
                    this.z = v4fVec.z;
                    this.z = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Vec4.prototype, "wzzw", {
                get: function () {
                    return Vec4.temp(this.w, this.z, this.z, this.w);
                },
                set: function (v4fVec) {
                    this.w = v4fVec.x;
                    this.z = v4fVec.y;
                    this.z = v4fVec.z;
                    this.w = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Vec4.prototype, "wzwx", {
                get: function () {
                    return Vec4.temp(this.w, this.z, this.w, this.x);
                },
                set: function (v4fVec) {
                    this.w = v4fVec.x;
                    this.z = v4fVec.y;
                    this.w = v4fVec.z;
                    this.x = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Vec4.prototype, "wzwy", {
                get: function () {
                    return Vec4.temp(this.w, this.z, this.w, this.y);
                },
                set: function (v4fVec) {
                    this.w = v4fVec.x;
                    this.z = v4fVec.y;
                    this.w = v4fVec.z;
                    this.y = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Vec4.prototype, "wzwz", {
                get: function () {
                    return Vec4.temp(this.w, this.z, this.w, this.z);
                },
                set: function (v4fVec) {
                    this.w = v4fVec.x;
                    this.z = v4fVec.y;
                    this.w = v4fVec.z;
                    this.z = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Vec4.prototype, "wzww", {
                get: function () {
                    return Vec4.temp(this.w, this.z, this.w, this.w);
                },
                set: function (v4fVec) {
                    this.w = v4fVec.x;
                    this.z = v4fVec.y;
                    this.w = v4fVec.z;
                    this.w = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Vec4.prototype, "wwxx", {
                get: function () {
                    return Vec4.temp(this.w, this.w, this.x, this.x);
                },
                set: function (v4fVec) {
                    this.w = v4fVec.x;
                    this.w = v4fVec.y;
                    this.x = v4fVec.z;
                    this.x = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Vec4.prototype, "wwxy", {
                get: function () {
                    return Vec4.temp(this.w, this.w, this.x, this.y);
                },
                set: function (v4fVec) {
                    this.w = v4fVec.x;
                    this.w = v4fVec.y;
                    this.x = v4fVec.z;
                    this.y = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Vec4.prototype, "wwxz", {
                get: function () {
                    return Vec4.temp(this.w, this.w, this.x, this.z);
                },
                set: function (v4fVec) {
                    this.w = v4fVec.x;
                    this.w = v4fVec.y;
                    this.x = v4fVec.z;
                    this.z = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Vec4.prototype, "wwxw", {
                get: function () {
                    return Vec4.temp(this.w, this.w, this.x, this.w);
                },
                set: function (v4fVec) {
                    this.w = v4fVec.x;
                    this.w = v4fVec.y;
                    this.x = v4fVec.z;
                    this.w = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Vec4.prototype, "wwyx", {
                get: function () {
                    return Vec4.temp(this.w, this.w, this.y, this.x);
                },
                set: function (v4fVec) {
                    this.w = v4fVec.x;
                    this.w = v4fVec.y;
                    this.y = v4fVec.z;
                    this.x = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Vec4.prototype, "wwyy", {
                get: function () {
                    return Vec4.temp(this.w, this.w, this.y, this.y);
                },
                set: function (v4fVec) {
                    this.w = v4fVec.x;
                    this.w = v4fVec.y;
                    this.y = v4fVec.z;
                    this.y = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Vec4.prototype, "wwyz", {
                get: function () {
                    return Vec4.temp(this.w, this.w, this.y, this.z);
                },
                set: function (v4fVec) {
                    this.w = v4fVec.x;
                    this.w = v4fVec.y;
                    this.y = v4fVec.z;
                    this.z = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Vec4.prototype, "wwyw", {
                get: function () {
                    return Vec4.temp(this.w, this.w, this.y, this.w);
                },
                set: function (v4fVec) {
                    this.w = v4fVec.x;
                    this.w = v4fVec.y;
                    this.y = v4fVec.z;
                    this.w = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Vec4.prototype, "wwzx", {
                get: function () {
                    return Vec4.temp(this.w, this.w, this.z, this.x);
                },
                set: function (v4fVec) {
                    this.w = v4fVec.x;
                    this.w = v4fVec.y;
                    this.z = v4fVec.z;
                    this.x = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Vec4.prototype, "wwzy", {
                get: function () {
                    return Vec4.temp(this.w, this.w, this.z, this.y);
                },
                set: function (v4fVec) {
                    this.w = v4fVec.x;
                    this.w = v4fVec.y;
                    this.z = v4fVec.z;
                    this.y = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Vec4.prototype, "wwzz", {
                get: function () {
                    return Vec4.temp(this.w, this.w, this.z, this.z);
                },
                set: function (v4fVec) {
                    this.w = v4fVec.x;
                    this.w = v4fVec.y;
                    this.z = v4fVec.z;
                    this.z = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Vec4.prototype, "wwzw", {
                get: function () {
                    return Vec4.temp(this.w, this.w, this.z, this.w);
                },
                set: function (v4fVec) {
                    this.w = v4fVec.x;
                    this.w = v4fVec.y;
                    this.z = v4fVec.z;
                    this.w = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Vec4.prototype, "wwwx", {
                get: function () {
                    return Vec4.temp(this.w, this.w, this.w, this.x);
                },
                set: function (v4fVec) {
                    this.w = v4fVec.x;
                    this.w = v4fVec.y;
                    this.w = v4fVec.z;
                    this.x = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Vec4.prototype, "wwwy", {
                get: function () {
                    return Vec4.temp(this.w, this.w, this.w, this.y);
                },
                set: function (v4fVec) {
                    this.w = v4fVec.x;
                    this.w = v4fVec.y;
                    this.w = v4fVec.z;
                    this.y = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Vec4.prototype, "wwwz", {
                get: function () {
                    return Vec4.temp(this.w, this.w, this.w, this.z);
                },
                set: function (v4fVec) {
                    this.w = v4fVec.x;
                    this.w = v4fVec.y;
                    this.w = v4fVec.z;
                    this.z = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Vec4.prototype, "wwww", {
                get: function () {
                    return Vec4.temp(this.w, this.w, this.w, this.w);
                },
                set: function (v4fVec) {
                    this.w = v4fVec.x;
                    this.w = v4fVec.y;
                    this.w = v4fVec.z;
                    this.w = v4fVec.w;
                },
                enumerable: true,
                configurable: true
            });

            Vec4.prototype.set = function () {
                var nArgumentsLength = arguments.length;

                switch (nArgumentsLength) {
                    case 0:
                        this.x = this.y = this.z = this.w = 0.;
                        break;
                    case 1:
                        if (akra.isFloat(arguments[0])) {
                            this.x = this.y = this.z = this.w = arguments[0];
                        } else if (arguments[0] instanceof Vec4) {
                            var v4fVec = arguments[0];

                            this.x = v4fVec.x;
                            this.y = v4fVec.y;
                            this.z = v4fVec.z;
                            this.w = v4fVec.w;
                        } else if (akra.isDef(arguments[0].r)) {
                            this.x = arguments[0].r;
                            this.y = arguments[0].g;
                            this.z = arguments[0].b;
                            this.w = arguments[0].a;
                        } else {
                            //array
                            var pArray = arguments[0];

                            this.x = pArray[0];
                            this.y = pArray[1];
                            this.z = pArray[2];
                            this.w = pArray[3];
                        }
                        break;
                    case 2:
                        if (akra.isFloat(arguments[0])) {
                            var fValue = arguments[0];
                            var v3fVec = arguments[1];

                            this.x = fValue;
                            this.y = v3fVec.x;
                            this.z = v3fVec.y;
                            this.w = v3fVec.z;
                        } else if (arguments[0] instanceof math.Vec2) {
                            var v2fVec1 = arguments[0];
                            var v2fVec2 = arguments[1];

                            this.x = v2fVec1.x;
                            this.y = v2fVec1.y;
                            this.z = v2fVec2.x;
                            this.w = v2fVec2.y;
                        } else {
                            var v3fVec = arguments[0];
                            var fValue = arguments[1];

                            this.x = v3fVec.x;
                            this.y = v3fVec.y;
                            this.z = v3fVec.z;
                            this.w = fValue;
                        }
                        break;
                    case 3:
                        if (akra.isFloat(arguments[0])) {
                            var fValue1 = arguments[0];

                            if (akra.isFloat(arguments[1])) {
                                var fValue2 = arguments[1];
                                var v2fVec = arguments[2];

                                this.x = fValue1;
                                this.y = fValue2;
                                this.z = v2fVec.x;
                                this.w = v2fVec.y;
                            } else {
                                var v2fVec = arguments[1];
                                var fValue2 = arguments[2];

                                this.x = fValue1;
                                this.y = v2fVec.x;
                                this.z = v2fVec.y;
                                this.w = fValue2;
                            }
                        } else {
                            var v2fVec = arguments[0];
                            var fValue1 = arguments[1];
                            var fValue2 = arguments[2];

                            this.x = v2fVec.x;
                            this.y = v2fVec.y;
                            this.z = fValue1;
                            this.w = fValue2;
                        }
                        break;
                    case 4:
                        this.x = arguments[0];
                        this.y = arguments[1];
                        this.z = arguments[2];
                        this.w = arguments[3];
                        break;
                }

                return this;
            };

            /**  */ Vec4.prototype.clear = function () {
                this.x = this.y = this.z = this.w = 0.;
                return this;
            };

            Vec4.prototype.add = function (v4fVec, v4fDestination) {
                if (!akra.isDef(v4fDestination)) {
                    v4fDestination = this;
                }

                v4fDestination.x = this.x + v4fVec.x;
                v4fDestination.y = this.y + v4fVec.y;
                v4fDestination.z = this.z + v4fVec.z;
                v4fDestination.w = this.w + v4fVec.w;

                return v4fDestination;
            };

            Vec4.prototype.subtract = function (v4fVec, v4fDestination) {
                if (!akra.isDef(v4fDestination)) {
                    v4fDestination = this;
                }

                v4fDestination.x = this.x - v4fVec.x;
                v4fDestination.y = this.y - v4fVec.y;
                v4fDestination.z = this.z - v4fVec.z;
                v4fDestination.w = this.w - v4fVec.w;

                return v4fDestination;
            };

            /**  */ Vec4.prototype.dot = function (v4fVec) {
                return this.x * v4fVec.x + this.y * v4fVec.y + this.z * v4fVec.z + this.w * v4fVec.w;
            };

            Vec4.prototype.isEqual = function (v4fVec, fEps) {
                if (typeof fEps === "undefined") { fEps = 0.; }
                if (fEps === 0.) {
                    if (this.x != v4fVec.x || this.y != v4fVec.y || this.z != v4fVec.z || this.w != v4fVec.w) {
                        return false;
                    }
                } else {
                    if (math.abs(this.x - v4fVec.x) > fEps || math.abs(this.y - v4fVec.y) > fEps || math.abs(this.z - v4fVec.z) > fEps || math.abs(this.w - v4fVec.w) > fEps) {
                        return false;
                    }
                }
                return true;
            };

            Vec4.prototype.isClear = function (fEps) {
                if (typeof fEps === "undefined") { fEps = 0.; }
                if (fEps === 0.) {
                    if (this.x != 0. || this.y != 0. || this.z != 0. || this.w != 0.) {
                        return false;
                    }
                } else {
                    if (math.abs(this.x) > fEps || math.abs(this.y) > fEps || math.abs(this.z) > fEps || math.abs(this.w) > fEps) {
                        return false;
                    }
                }
                return true;
            };

            Vec4.prototype.negate = function (v4fDestination) {
                if (!akra.isDef(v4fDestination)) {
                    v4fDestination = this;
                }

                v4fDestination.x = -this.x;
                v4fDestination.y = -this.y;
                v4fDestination.z = -this.z;
                v4fDestination.w = -this.w;

                return v4fDestination;
            };

            Vec4.prototype.scale = function (fScale, v4fDestination) {
                if (!akra.isDef(v4fDestination)) {
                    v4fDestination = this;
                }

                v4fDestination.x = this.x * fScale;
                v4fDestination.y = this.y * fScale;
                v4fDestination.z = this.z * fScale;
                v4fDestination.w = this.w * fScale;

                return v4fDestination;
            };

            Vec4.prototype.normalize = function (v4fDestination) {
                if (!akra.isDef(v4fDestination)) {
                    v4fDestination = this;
                }

                var x = this.x, y = this.y, z = this.z, w = this.w;
                var fLength = math.sqrt(x * x + y * y + z * z + w * w);

                if (fLength !== 0.) {
                    var fInvLength = 1. / fLength;

                    x *= fInvLength;
                    y *= fInvLength;
                    z *= fInvLength;
                    w *= fInvLength;
                }

                v4fDestination.x = x;
                v4fDestination.y = y;
                v4fDestination.z = z;
                v4fDestination.w = w;

                return v4fDestination;
            };

            /**  */ Vec4.prototype.length = function () {
                var x = this.x, y = this.y, z = this.z, w = this.w;
                return math.sqrt(x * x + y * y + z * z + w * w);
            };

            /**  */ Vec4.prototype.lengthSquare = function () {
                var x = this.x, y = this.y, z = this.z, w = this.w;
                return x * x + y * y + z * z + w * w;
            };

            Vec4.prototype.direction = function (v4fVec, v4fDestination) {
                if (!akra.isDef(v4fDestination)) {
                    v4fDestination = this;
                }

                var x = v4fVec.x - this.x;
                var y = v4fVec.y - this.y;
                var z = v4fVec.z - this.z;
                var w = v4fVec.w - this.w;

                var fLength = math.sqrt(x * x + y * y + z * z + w * w);

                if (fLength !== 0.) {
                    var fInvLength = 1. / fLength;

                    x *= fInvLength;
                    y *= fInvLength;
                    z *= fInvLength;
                    w *= fInvLength;
                }

                v4fDestination.x = x;
                v4fDestination.y = y;
                v4fDestination.z = z;
                v4fDestination.w = w;

                return v4fDestination;
            };

            Vec4.prototype.mix = function (v4fVec, fA, v4fDestination) {
                if (!akra.isDef(v4fDestination)) {
                    v4fDestination = this;
                }

                fA = math.clamp(fA, 0., 1.);

                var fA1 = 1. - fA;
                var fA2 = fA;

                v4fDestination.x = fA1 * this.x + fA2 * v4fVec.x;
                v4fDestination.y = fA1 * this.y + fA2 * v4fVec.y;
                v4fDestination.z = fA1 * this.z + fA2 * v4fVec.z;
                v4fDestination.w = fA1 * this.w + fA2 * v4fVec.w;

                return v4fDestination;
            };

            /**  */ Vec4.prototype.toString = function () {
                return "[x: " + this.x + ", y: " + this.y + ", z: " + this.z + ", w: " + this.w + "]";
            };

            Vec4.temp = function (x, y, z, w) {
                iElement = (iElement === pBuffer.length - 1 ? 0 : pBuffer.length);
                var p = pBuffer[iElement++];
                return p.set.apply(p, arguments);
            };
            return Vec4;
        })();

        pBuffer = akra.gen.array(256, Vec4);
        iElement = 0;
    })(akra.math || (akra.math = {}));
    var math = akra.math;
})(akra || (akra = {}));
