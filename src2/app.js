var akra;
(function (akra) {
    (function (bf) {
        bf.flag = function (x) {
            return (1 << (x));
        };
        bf.testBit = function (value, bit) {
            return ((value & bf.flag(bit)) != 0);
        };
        bf.testAll = function (value, set) {
            return (((value) & (set)) == (set));
        };
        bf.testAny = function (value, set) {
            return (((value) & (set)) != 0);
        };
        bf.setBit = function (value, bit, setting) {
            if (typeof setting === "undefined") { setting = true; }
            return (setting ? bf.setBit(value, bit) : bf.clearBit(value, bit));
        };
        bf.clearBit = function (value, bit) {
            return ((value) &= ~bf.flag((bit)));
        };
        bf.setAll = function (value, set, setting) {
            if (typeof setting === "undefined") { setting = true; }
            return (setting ? bf.setAll(value, set) : bf.clearAll(value, set));
        };
        bf.clearAll = function (value, set) {
            return ((value) &= ~(set));
        };
        bf.equal = function (value, src) {
            value = src;
        };
        bf.isEqual = function (value, src) {
            return value == src;
        };
        bf.isNotEqaul = function (value, src) {
            return value != src;
        };
        bf.set = function (value, src) {
            value = src;
        };
        bf.clear = function (value) {
            value = 0;
        };
        bf.setFlags = function (value, src) {
            return (value |= src);
        };
        bf.clearFlags = function (value, src) {
            return value &= ~src;
        };
        bf.isEmpty = function (value) {
            return (value == 0);
        };
        bf.totalBits = function (value) {
            return 32;
        };
        bf.totalSet = function (value) {
            var count = 0;
            var total = bf.totalBits(value);
            for(var i = total; i; --i) {
                count += (value & 1);
                value >>= 1;
            }
            return (count);
        };
    })(akra.bf || (akra.bf = {}));
    var bf = akra.bf;
})(akra || (akra = {}));
var akra;
(function (akra) {
    (function (math) {
        var Vec2 = (function () {
            function Vec2(x, y) {
                this.x = 0;
                this.y = 0;
                switch(arguments.length) {
                    case 0: {
                        this.x = this.y = 0;
                        break;

                    }
                    case 1: {
                        this.set(x);
                        break;

                    }
                    case 2: {
                        this.set(x, y);

                    }
                }
            }
            Vec2.prototype.set = function (x, y) {
                switch(arguments.length) {
                    case 0: {
                        this.x = this.y = 0;
                        break;

                    }
                    case 1: {
                        if(akra.isFloat(x)) {
                            this.x = x;
                            this.y = x;
                        } else {
                            this.x = x.x;
                            this.y = x.y;
                        }
                        break;

                    }
                    case 2: {
                        this.x = x;
                        this.y = y;

                    }
                }
                return this;
            };
            return Vec2;
        })();
        math.Vec2 = Vec2;        
    })(akra.math || (akra.math = {}));
    var math = akra.math;
})(akra || (akra = {}));
var akra;
(function (akra) {
    (function (math) {
        var Vec3 = (function () {
            function Vec3(x, y, z) {
                switch(arguments.length) {
                    case 0: {
                        this.x = this.y = this.z = 0;
                        break;

                    }
                    case 1: {
                        this.set(x);
                        break;

                    }
                    case 2: {
                        this.set(x, y);
                        break;

                    }
                    case 3: {
                        this.set(x, y, z);

                    }
                }
            }
            Object.defineProperty(Vec3.prototype, "xy", {
                get: function () {
                    return new math.Vec2(this.x, this.y);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Vec3.prototype, "xz", {
                get: function () {
                    return new math.Vec2(this.x, this.z);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Vec3.prototype, "yx", {
                get: function () {
                    return new math.Vec2(this.y, this.x);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Vec3.prototype, "yz", {
                get: function () {
                    return new math.Vec2(this.y, this.z);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Vec3.prototype, "zx", {
                get: function () {
                    return new math.Vec2(this.z, this.x);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Vec3.prototype, "zy", {
                get: function () {
                    return new math.Vec2(this.z, this.y);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Vec3.prototype, "xyz", {
                get: function () {
                    return new Vec3(this.x, this.y, this.z);
                },
                enumerable: true,
                configurable: true
            });
            Vec3.prototype.set = function (x, y, z) {
                switch(arguments.length) {
                    case 0:
                    case 1: {
                        if(akra.isFloat(x)) {
                            this.x = this.y = this.z = x || 0;
                        } else {
                            this.x = x.x;
                            this.y = x.y;
                            this.z = x.z;
                        }
                        break;

                    }
                    case 2: {
                        if(akra.isFloat(x)) {
                            this.x = x;
                            this.y = y.x;
                            this.z = y.y;
                        } else {
                            this.x = x.x;
                            this.y = x.y;
                            this.z = y;
                        }
                        break;

                    }
                    case 3: {
                        this.x = x;
                        this.y = y;
                        this.z = z;

                    }
                }
                return this;
            };
            Vec3.prototype.add = function (v3fVec, v3fDest) {
                if(!v3fDest) {
                    v3fDest = this;
                }
                v3fDest.x = this.x + v3fVec.x;
                v3fDest.y = this.y + v3fVec.y;
                v3fDest.z = this.z + v3fVec.z;
                return this;
            };
            Vec3.prototype.toString = function () {
                return "[x: " + this.x + ", y: " + this.y + ", z: " + this.z + "]";
            };
            Vec3.v3f = new Vec3();
            return Vec3;
        })();
        math.Vec3 = Vec3;        
    })(akra.math || (akra.math = {}));
    var math = akra.math;
})(akra || (akra = {}));
var akra;
(function (akra) {
    (function (math) {
        var Vec4 = (function () {
            function Vec4(x, y, z, w) {
                switch(arguments.length) {
                    case 0: {
                        this.x = this.y = this.z = this.w = 0;
                        break;

                    }
                    case 1: {
                        this.set(x);
                        break;

                    }
                    case 2: {
                        this.set(x, y);
                        break;

                    }
                    case 4: {
                        this.set(x, y, z, w);
                        break;

                    }
                }
            }
            Vec4.prototype.set = function (x, y, z, w) {
                switch(arguments.length) {
                    case 0: {
                        this.x = this.y = this.z = this.w = 0;
                        break;

                    }
                    case 1: {
                        if(akra.isFloat(x)) {
                            this.x = this.y = this.z = this.w = x;
                        } else {
                            this.x = x.x;
                            this.y = x.y;
                            this.z = x.z;
                            this.w = x.w;
                        }
                        break;

                    }
                    case 2: {
                        if(akra.isFloat(x)) {
                            this.x = x;
                            this.y = y.x;
                            this.z = y.y;
                            this.w = y.z;
                        } else {
                            if(akra.isFloat(y)) {
                                this.x = x.x;
                                this.y = x.y;
                                this.z = x.z;
                                this.w = y;
                            } else {
                                this.x = x.x;
                                this.y = x.y;
                                this.z = y.x;
                                this.w = y.y;
                            }
                        }
                        break;

                    }
                    case 4: {
                        this.x = x;
                        this.y = y;
                        this.z = z;
                        this.w = w;

                    }
                }
                return this;
            };
            return Vec4;
        })();
        math.Vec4 = Vec4;        
    })(akra.math || (akra.math = {}));
    var math = akra.math;
})(akra || (akra = {}));
var akra;
(function (akra) {
    (function (math) {
        var Mat2 = (function () {
            function Mat2(f11, f12, f21, f22) {
                this.pData = new Float32Array(4);
                switch(arguments.length) {
                    case 1: {
                        this.set(f11);
                        break;

                    }
                    case 4: {
                        this.set(f11, f12, f21, f22);
                        break;

                    }
                }
            }
            Mat2.prototype.set = function (f11, f12, f21, f22) {
                var pData = this.pData;
                switch(arguments.length) {
                    case 1: {
                        if(akra.isFloat(f11)) {
                            pData[0] = pData[1] = pData[2] = pData[3] = f11;
                        } else {
                        }
                        break;

                    }
                    case 4: {
                        pData[0] = f11;
                        pData[1] = f21;
                        pData[2] = f12;
                        pData[3] = f22;
                        break;

                    }
                }
                return this;
            };
            return Mat2;
        })();
        math.Mat2 = Mat2;        
    })(akra.math || (akra.math = {}));
    var math = akra.math;
})(akra || (akra = {}));
var akra;
(function (akra) {
    (function (math) {
        var Mat3 = (function () {
            function Mat3() { }
            return Mat3;
        })();
        math.Mat3 = Mat3;        
    })(akra.math || (akra.math = {}));
    var math = akra.math;
})(akra || (akra = {}));
var akra;
(function (akra) {
    (function (math) {
        var Mat4 = (function () {
            function Mat4() { }
            return Mat4;
        })();
        math.Mat4 = Mat4;        
    })(akra.math || (akra.math = {}));
    var math = akra.math;
})(akra || (akra = {}));
var akra;
(function (akra) {
    (function (math) {
        var Quat4 = (function () {
            function Quat4() { }
            return Quat4;
        })();
        math.Quat4 = Quat4;        
    })(akra.math || (akra.math = {}));
    var math = akra.math;
})(akra || (akra = {}));
var akra;
(function (akra) {
    (function (math) {
        math.E = Math.E;
        math.LN2 = Math.LN2;
        math.LOG2E = Math.LOG2E;
        math.LOG10E = Math.LOG10E;
        math.PI = Math.PI;
        math.SQRT1_2 = Math.SQRT1_2;
        math.SQRT2 = Math.SQRT2;
        math.LN10 = Math.LN10;
        math.FLOAT_PRECISION = (3.4e-8);
        math.TWO_PI = (2 * math.PI);
        math.HALF_PI = (math.PI / 2);
        math.QUARTER_PI = (math.PI / 4);
        math.EIGHTH_PI = (math.PI / 8);
        math.PI_SQUARED = (9.869604401089358);
        math.PI_INVERSE = (0.3183098861837907);
        math.PI_OVER_180 = (math.PI / 180);
        math.PI_DIV_180 = (180 / math.PI);
        math.NATURAL_LOGARITHM_BASE = (2.718281828459045);
        math.EULERS_CONSTANT = (0.5772156649015329);
        math.SQUARE_ROOT_2 = (1.4142135623730951);
        math.INVERSE_ROOT_2 = (0.7071067811865476);
        math.SQUARE_ROOT_3 = (1.7320508075688772);
        math.SQUARE_ROOT_5 = (2.23606797749979);
        math.SQUARE_ROOT_10 = (3.1622776601683795);
        math.CUBE_ROOT_2 = (1.2599210498948732);
        math.CUBE_ROOT_3 = (1.4422495703074083);
        math.FOURTH_ROOT_2 = (1.189207115002721);
        math.NATURAL_LOG_2 = (0.6931471805599453);
        math.NATURAL_LOG_3 = (1.0986122886681097);
        math.NATURAL_LOG_10 = (2.302585092994046);
        math.NATURAL_LOG_PI = (1.1447298858494001);
        math.BASE_TEN_LOG_PI = (0.49714987269413385);
        math.NATURAL_LOGARITHM_BASE_INVERSE = (0.36787944117144233);
        math.NATURAL_LOGARITHM_BASE_SQUARED = (7.38905609893065);
        math.GOLDEN_RATIO = ((math.SQUARE_ROOT_5 + 1) / 2);
        math.DEGREE_RATIO = (math.PI_DIV_180);
        math.RADIAN_RATIO = (math.PI_OVER_180);
        math.GRAVITY_CONSTANT = 9.81;
        math.abs = Math.abs;
        math.acos = Math.acos;
        math.asin = Math.asin;
        math.atan = Math.atan;
        math.atan2 = Math.atan2;
        math.exp = Math.exp;
        math.min = Math.min;
        math.random = Math.random;
        math.sqrt = Math.sqrt;
        math.log = Math.log;
        math.round = Math.round;
        math.floor = Math.floor;
        math.ceil = Math.ceil;
        math.sin = Math.sin;
        math.cos = Math.cos;
        math.tan = Math.tan;
        math.pow = Math.pow;
        math.max = Math.max;
        math.fpBits = function (f) {
            return math.floor(f);
        };
        math.intBits = function (i) {
            return i;
        };
        math.fpSign = function (f) {
            return (f >> 31);
        };
        math.fpExponent = function (f) {
            return (((math.fpBits(f) & 2147483647) >> 23) - 127);
        };
        math.fpExponentSign = function (f) {
            return (math.fpExponent(f) >> 31);
        };
        math.fpPureMantissa = function (f) {
            return (math.fpBits(f) & 8388607);
        };
        math.fpMantissa = function (f) {
            return (math.fpPureMantissa(f) | (1 << 23));
        };
        math.fpOneBits = 1065353216;
        math.flipSign = function (i, flip) {
            return ((flip == -1) ? -i : i);
        };
        math.absoluteValue = math.abs;
        math.raiseToPower = math.pow;
        math.isPositive = function (a) {
            return (a >= 0);
        };
        math.isNegative = function (a) {
            return (a < 0);
        };
        math.sameSigns = function (a, b) {
            return (math.isNegative(a) == math.isNegative(b));
        };
        math.copySign = function (a, b) {
            return (math.isNegative(b) ? -math.absoluteValue(a) : math.absoluteValue(a));
        };
        math.deltaRangeTest = function (a, b, epsilon) {
            if (typeof epsilon === "undefined") { epsilon = 1e-7; }
            return ((math.absoluteValue(a - b) < epsilon) ? true : false);
        };
        math.clamp = function (value, low, high) {
            return math.max(low, math.min(value, high));
        };
        math.clampPositive = function (value) {
            return (value < 0 ? 0 : value);
        };
        math.clampNegative = function (value) {
            return (value > 0 ? 0 : value);
        };
        math.clampUnitSize = function (value) {
            return math.clamp(value, -1, 1);
        };
        math.highestBitSet = function (value) {
            return value == 0 ? (null) : (value < 0 ? 31 : ((math.log(value) / math.LN2) << 0));
        };
        math.lowestBitSet = function (value) {
            var temp;
            if(value == 0) {
                return null;
            }
            for(temp = 0; temp <= 31; temp++) {
                if(value & (1 << temp)) {
                    return temp;
                }
            }
            return null;
        };
        math.isPowerOfTwo = function (value) {
            return (value > 0 && math.highestBitSet(value) == math.lowestBitSet(value));
        };
        math.nearestPowerOfTwo = function (value) {
            if(value <= 1) {
                return 1;
            }
            var highestBit = math.highestBitSet(value);
            var roundingTest = value & (1 << (highestBit - 1));
            if(roundingTest != 0) {
                ++highestBit;
            }
            return 1 << highestBit;
        };
        math.ceilingPowerOfTwo = function (value) {
            if(value <= 1) {
                return 1;
            }
            var highestBit = math.highestBitSet(value);
            var mask = value & ((1 << highestBit) - 1);
            highestBit += mask && 1;
            return 1 << highestBit;
        };
        math.floorPowerOfTwo = function (value) {
            if(value <= 1) {
                return 1;
            }
            var highestBit = math.highestBitSet(value);
            return 1 << highestBit;
        };
        math.modulus = function (e, divisor) {
            return (e - math.floor(e / divisor) * divisor);
        };
        math.mod = math.modulus;
        math.alignUp = function (value, alignment) {
            var iRemainder = math.modulus(value, alignment);
            if(iRemainder == 0) {
                return (value);
            }
            return (value + (alignment - iRemainder));
        };
        math.alignDown = function (value, alignment) {
            var remainder = math.modulus(value, alignment);
            if(remainder == 0) {
                return (value);
            }
            return (value - remainder);
        };
        math.inverse = function (a) {
            return 1 / a;
        };
        math.log2 = function (f) {
            return math.log(f) / math.LN2;
        };
        math.trimFloat = function (f, precision) {
            return f;
        };
        math.realToInt32_chop = function (a) {
            return math.round(a);
        };
        math.realToInt32_floor = function (a) {
            return math.floor(a);
        };
        math.realToInt32_ceil = function (a) {
            return math.ceil(a);
        };
        math.nod = function (n, m) {
            var p = n % m;
            while(p != 0) {
                n = m;
                m = p;
                p = n % m;
            }
            return m;
        };
        math.nok = function (n, m) {
            return math.abs(n * m) / math.nod(n, m);
        };
        math.gcd = math.nod;
        math.lcm = math.nok;
    })(akra.math || (akra.math = {}));
    var math = akra.math;
})(akra || (akra = {}));
var akra;
(function (akra) {
    akra.Vec2 = akra.math.Vec2;
    akra.Vec3 = akra.math.Vec3;
    akra.Vec4 = akra.math.Vec4;
    akra.Mat2 = akra.math.Mat2;
    akra.Mat3 = akra.math.Mat3;
    akra.Mat4 = akra.math.Mat4;
    akra.Quat4 = akra.math.Quat4;
})(akra || (akra = {}));
var akra;
(function (akra) {
    (function (geometry) {
        var Rect3d = (function () {
            function Rect3d(x0, y0, z0, x1, y1, z1) {
            }
            return Rect3d;
        })();
        geometry.Rect3d = Rect3d;        
    })(akra.geometry || (akra.geometry = {}));
    var geometry = akra.geometry;
})(akra || (akra = {}));
var akra;
(function (akra) {
    })(akra || (akra = {}));
var akra;
(function (akra) {
    (function (util) {
        var ReferenceCounter = (function () {
            function ReferenceCounter(pSrc) {
                this.nReferenceCount = 0;
            }
            ReferenceCounter.prototype.referenceCount = function () {
                return this.nReferenceCount;
            };
            ReferenceCounter.prototype.destructor = function () {
                akra.assert(this.nReferenceCount === 0, 'object is used');
            };
            ReferenceCounter.prototype.release = function () {
                akra.assert(this.nReferenceCount > 0, 'object is used');
                this.nReferenceCount--;
                return this.nReferenceCount;
            };
            ReferenceCounter.prototype.addRef = function () {
                akra.assert(this.nReferenceCount != akra.MIN_INT32, 'reference fail');
                this.nReferenceCount++;
                return this.nReferenceCount;
            };
            ReferenceCounter.prototype.eq = function (pSrc) {
                return this;
            };
            return ReferenceCounter;
        })();
        util.ReferenceCounter = ReferenceCounter;        
    })(akra.util || (akra.util = {}));
    var util = akra.util;
})(akra || (akra = {}));
var akra;
(function (akra) {
    (function (util) {
        var Singleton = (function () {
            function Singleton() {
                var _constructor = (this).constructor;
                akra.assert(!akra.isDef(_constructor._pInstance), 'Singleton class may be created only one time.');
                _constructor._pInstance = this;
            }
            return Singleton;
        })();
        util.Singleton = Singleton;        
    })(akra.util || (akra.util = {}));
    var util = akra.util;
})(akra || (akra = {}));
var akra;
(function (akra) {
    (function (util) {
        var URI = (function () {
            function URI(pUri) {
                this.sScheme = null;
                this.sUserinfo = null;
                this.sHost = null;
                this.nPort = 0;
                this.sPath = null;
                this.sQuery = null;
                this.sFragment = null;
                if(pUri) {
                    this.set(pUri);
                }
            }
            Object.defineProperty(URI.prototype, "urn", {
                get: function () {
                    return (this.sPath ? this.sPath : '') + (this.sQuery ? '?' + this.sQuery : '') + (this.sFragment ? '#' + this.sFragment : '');
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(URI.prototype, "url", {
                get: function () {
                    return (this.sScheme ? this.sScheme : '') + this.authority;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(URI.prototype, "authority", {
                get: function () {
                    return (this.sHost ? '//' + (this.sUserinfo ? this.sUserinfo + '@' : '') + this.sHost + (this.nPort ? ':' + this.nPort : '') : '');
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(URI.prototype, "scheme", {
                get: function () {
                    return this.sScheme;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(URI.prototype, "protocol", {
                get: function () {
                    if(!this.sScheme) {
                        return this.sScheme;
                    }
                    return (this.sScheme.substr(0, this.sScheme.lastIndexOf(':')));
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(URI.prototype, "userinfo", {
                get: function () {
                    return this.sUserinfo;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(URI.prototype, "host", {
                get: function () {
                    return this.sHost;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(URI.prototype, "port", {
                get: function () {
                    return this.nPort;
                },
                set: function (iPort) {
                    this.nPort = iPort;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(URI.prototype, "path", {
                get: function () {
                    return this.sPath;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(URI.prototype, "query", {
                get: function () {
                    return this.sQuery;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(URI.prototype, "fragment", {
                get: function () {
                    return this.sFragment;
                },
                enumerable: true,
                configurable: true
            });
            URI.prototype.set = function (pData) {
                if(akra.isString(pData)) {
                    var pUri = URI.uriExp.exec(pData);
                    akra.debug_assert(pUri !== null, 'Invalid URI format used.\nused uri: ' + pData);
                    if(!pUri) {
                        return null;
                    }
                    this.sScheme = pUri[1] || null;
                    this.sUserinfo = pUri[2] || null;
                    this.sHost = pUri[3] || null;
                    this.nPort = parseInt(pUri[4]) || null;
                    this.sPath = pUri[5] || pUri[6] || null;
                    this.sQuery = pUri[7] || null;
                    this.sFragment = pUri[8] || null;
                    return this;
                } else {
                    if(pData instanceof URI) {
                        return this.set(pData.toString());
                    }
                }
                akra.debug_error('Unexpected data type was used.');
                return null;
            };
            URI.prototype.toString = function () {
                return this.url + this.urn;
            };
            URI.uriExp = new RegExp("^([a-z0-9+.-]+:)?(?:\\/\\/(?:((?:[a-z0-9-._~!$&'()*+,;=:]|%[0-9A-F]{2})*)@)?((?:[a-z0-9-._~!$&'()*+,;=]|%[0-9A-F]{2})*)(?::(\\d*))?(\\/(?:[a-z0-9-._~!$&'()*+,;=:@/]|%[0-9A-F]{2})*)?|(\\/?(?:[a-z0-9-._~!$&'()*+,;=:@]|%[0-9A-F]{2})*(?:[a-z0-9-._~!$&'()*+,;=:@/]|%[0-9A-F]{2})*)?)(?:\\?((?:[a-z0-9-._~!$&'()*+,;=:/?@]|%[0-9A-F]{2})*))?(?:#((?:[a-z0-9-._~!$&'()*+,;=:/?@]|%[0-9A-F]{2})*))?$", "i");
            return URI;
        })();
        util.URI = URI;        
    })(akra.util || (akra.util = {}));
    var util = akra.util;
})(akra || (akra = {}));
var akra;
(function (akra) {
    akra.parseURI = function (sUri) {
        return new akra.util.URI(sUri);
    };
})(akra || (akra = {}));
var akra;
(function (akra) {
    (function (util) {
        var KeyMap = (function () {
            function KeyMap() { }
            return KeyMap;
        })();
        util.KeyMap = KeyMap;        
    })(akra.util || (akra.util = {}));
    var util = akra.util;
})(akra || (akra = {}));
var akra;
(function (akra) {
    (function (util) {
        var GamepadMap = (function () {
            function GamepadMap() { }
            return GamepadMap;
        })();
        util.GamepadMap = GamepadMap;        
    })(akra.util || (akra.util = {}));
    var util = akra.util;
})(akra || (akra = {}));
var __extends = this.__extends || function (d, b) {
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var akra;
(function (akra) {
    (function (util) {
        var BrowserInfo = (function (_super) {
            __extends(BrowserInfo, _super);
            function BrowserInfo() {
                _super.apply(this, arguments);

                this.sBrowser = null;
                this.sVersion = null;
                this.sOS = null;
                this.sVersionSearch = null;
            }
            Object.defineProperty(BrowserInfo.prototype, "name", {
                get: function () {
                    return this.sBrowser;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(BrowserInfo.prototype, "version", {
                get: function () {
                    return this.sVersion;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(BrowserInfo.prototype, "os", {
                get: function () {
                    return this.sOS;
                },
                enumerable: true,
                configurable: true
            });
            BrowserInfo.prototype.init = function () {
                this.sBrowser = this.searchString(BrowserInfo.dataBrowser) || "An unknown browser";
                this.sVersion = this.searchVersion(navigator.userAgent) || this.searchVersion(navigator.appVersion) || "an unknown version";
                this.sOS = this.searchString(BrowserInfo.dataOS) || "an unknown OS";
            };
            BrowserInfo.prototype.searchString = function (pDataBrowser) {
                for(var i = 0; i < pDataBrowser.length; i++) {
                    var sData = pDataBrowser[i].string;
                    var dataProp = pDataBrowser[i].prop;
                    this.sVersionSearch = pDataBrowser[i].versionSearch || pDataBrowser[i].identity;
                    if(sData) {
                        if(sData.indexOf(pDataBrowser[i].subString) != -1) {
                            return pDataBrowser[i].identity;
                        }
                    } else {
                        if(dataProp) {
                            return pDataBrowser[i].identity;
                        }
                    }
                }
                return null;
            };
            BrowserInfo.prototype.searchVersion = function (sData) {
                var iStartIndex = sData.indexOf(this.sVersionSearch);
                if(iStartIndex == -1) {
                    return null;
                }
                iStartIndex = sData.indexOf('/', iStartIndex + 1);
                if(iStartIndex == -1) {
                    return null;
                }
                var iEndIndex = sData.indexOf(' ', iStartIndex + 1);
                if(iEndIndex == -1) {
                    iEndIndex = sData.indexOf(';', iStartIndex + 1);
                    if(iEndIndex == -1) {
                        return null;
                    }
                    return sData.slice(iStartIndex + 1);
                }
                return sData.slice((iStartIndex + 1), iEndIndex);
            };
            BrowserInfo.dataBrowser = [
                {
                    string: navigator.userAgent,
                    subString: "Chrome",
                    identity: "Chrome"
                }, 
                {
                    string: navigator.userAgent,
                    subString: "OmniWeb",
                    versionSearch: "OmniWeb/",
                    identity: "OmniWeb"
                }, 
                {
                    string: navigator.vendor,
                    subString: "Apple",
                    identity: "Safari",
                    versionSearch: "Version"
                }, 
                {
                    prop: window.opera,
                    identity: "Opera",
                    versionSearch: "Version"
                }, 
                {
                    string: navigator.vendor,
                    subString: "iCab",
                    identity: "iCab"
                }, 
                {
                    string: navigator.vendor,
                    subString: "KDE",
                    identity: "Konqueror"
                }, 
                {
                    string: navigator.userAgent,
                    subString: "Firefox",
                    identity: "Firefox"
                }, 
                {
                    string: navigator.vendor,
                    subString: "Camino",
                    identity: "Camino"
                }, 
                {
                    string: navigator.userAgent,
                    subString: "Netscape",
                    identity: "Netscape"
                }, 
                {
                    string: navigator.userAgent,
                    subString: "MSIE",
                    identity: "Explorer",
                    versionSearch: "MSIE"
                }, 
                {
                    string: navigator.userAgent,
                    subString: "Gecko",
                    identity: "Mozilla",
                    versionSearch: "rv"
                }, 
                {
                    string: navigator.userAgent,
                    subString: "Mozilla",
                    identity: "Netscape",
                    versionSearch: "Mozilla"
                }
            ];
            BrowserInfo.dataOS = [
                {
                    string: navigator.platform,
                    subString: "Win",
                    identity: "Windows"
                }, 
                {
                    string: navigator.platform,
                    subString: "Mac",
                    identity: "Mac"
                }, 
                {
                    string: navigator.userAgent,
                    subString: "iPhone",
                    identity: "iPhone/iPod"
                }, 
                {
                    string: navigator.platform,
                    subString: "Linux",
                    identity: "Linux"
                }
            ];
            return BrowserInfo;
        })(util.Singleton);
        util.BrowserInfo = BrowserInfo;        
    })(akra.util || (akra.util = {}));
    var util = akra.util;
})(akra || (akra = {}));
var akra;
(function (akra) {
    (function (util) {
        var ApiInfo = (function (_super) {
            __extends(ApiInfo, _super);
            function ApiInfo() {
                        _super.call(this);
                this.bWebGL = false;
                this.bWebAudio = false;
                this.bFile = false;
                this.bFileSystem = false;
                this.bWebWorker = false;
                this.bTransferableObjects = false;
                this.bLocalStorage = false;
                this.bWebSocket = false;
                var pApi = {
                };
                this.bWebAudio = ((window).AudioContext && (window).webkitAudioContext ? true : false);
                this.bFile = ((window).File && (window).FileReader && (window).FileList && (window).Blob ? true : false);
                this.bFileSystem = (this.bFile && (window).URL && (window).requestFileSystem ? true : false);
                this.bWebWorker = akra.isDef((window).Worker);
                this.bLocalStorage = akra.isDef((window).localStorage);
                this.bWebSocket = akra.isDef((window).WebSocket);
            }
            Object.defineProperty(ApiInfo.prototype, "webGL", {
                get: function () {
                    if(!this.bWebGL) {
                        this.bWebGL = ((window).WebGLRenderingContext || this.checkWebGL() ? true : false);
                    }
                    return this.bWebGL;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(ApiInfo.prototype, "transferableObjects", {
                get: function () {
                    if(!this.bTransferableObjects) {
                        this.bTransferableObjects = (this.bWebWorker && this.chechTransferableObjects() ? true : false);
                    }
                    return this.bTransferableObjects;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(ApiInfo.prototype, "file", {
                get: function () {
                    return this.bFile;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(ApiInfo.prototype, "fileSystem", {
                get: function () {
                    return this.bFileSystem;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(ApiInfo.prototype, "webAudio", {
                get: function () {
                    return this.bWebAudio;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(ApiInfo.prototype, "webWorker", {
                get: function () {
                    return this.bWebWorker;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(ApiInfo.prototype, "localStorage", {
                get: function () {
                    return this.bLocalStorage;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(ApiInfo.prototype, "webSocket", {
                get: function () {
                    return this.bWebSocket;
                },
                enumerable: true,
                configurable: true
            });
            ApiInfo.prototype.checkWebGL = function () {
                var pCanvas;
                var pDevice;
                try  {
                    pCanvas = document.createElement('canvas');
                    pDevice = pCanvas.getContext('webgl', {
                    }) || pCanvas.getContext('experimental-webgl', {
                    });
                    if(pDevice) {
                        return true;
                    }
                } catch (e) {
                }
                return false;
            };
            ApiInfo.prototype.chechTransferableObjects = function () {
                var pBlob = new Blob([
                    "onmessage = function(e) { postMessage(true); }"
                ]);
                var sBlobURL = (window).URL.createObjectURL(pBlob);
                var pWorker = new Worker(sBlobURL);
                var pBuffer = new ArrayBuffer(1);
                try  {
                    pWorker.postMessage(pBuffer, [
                        pBuffer
                    ]);
                } catch (e) {
                    akra.debug_print('transferable objects not supported in your browser...');
                }
                pWorker.terminate();
                if(pBuffer.byteLength) {
                    return false;
                }
                return true;
            };
            return ApiInfo;
        })(util.Singleton);
        util.ApiInfo = ApiInfo;        
    })(akra.util || (akra.util = {}));
    var util = akra.util;
})(akra || (akra = {}));
var akra;
(function (akra) {
    (function (util) {
        var ScreenInfo = (function () {
            function ScreenInfo() { }
            Object.defineProperty(ScreenInfo.prototype, "width", {
                get: function () {
                    return screen.width;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(ScreenInfo.prototype, "height", {
                get: function () {
                    return screen.height;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(ScreenInfo.prototype, "aspect", {
                get: function () {
                    return screen.width / screen.height;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(ScreenInfo.prototype, "pixelDepth", {
                get: function () {
                    return screen.pixelDepth;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(ScreenInfo.prototype, "colorDepth", {
                get: function () {
                    return screen.colorDepth;
                },
                enumerable: true,
                configurable: true
            });
            return ScreenInfo;
        })();
        util.ScreenInfo = ScreenInfo;        
    })(akra.util || (akra.util = {}));
    var util = akra.util;
})(akra || (akra = {}));
var akra;
(function (akra) {
    (function (util) {
        var DeviceInfo = (function (_super) {
            __extends(DeviceInfo, _super);
            function DeviceInfo() {
                        _super.call(this);
                this.nMaxTextureSize = 0;
                this.nMaxCubeMapTextureSize = 0;
                this.nMaxViewPortSize = 0;
                this.nMaxTextureImageUnits = 0;
                this.nMaxVertexAttributes = 0;
                this.nMaxVertexTextureImageUnits = 0;
                this.nMaxCombinedTextureImageUnits = 0;
                this.nMaxColorAttachments = 1;
                this.nStencilBits = 0;
                this.pColorBits = [
                    0, 
                    0, 
                    0
                ];
                this.nAlphaBits = 0;
                this.fMultisampleType = 0;
                this.fShaderVersion = 0;
                var pDevice = akra.createDevice();
                if(!pDevice) {
                    return;
                }
                this.nMaxTextureSize = pDevice.getParameter(pDevice.MAX_TEXTURE_SIZE);
                this.nMaxCubeMapTextureSize = pDevice.getParameter(pDevice.MAX_CUBE_MAP_TEXTURE_SIZE);
                this.nMaxViewPortSize = pDevice.getParameter(pDevice.MAX_VIEWPORT_DIMS);
                this.nMaxTextureImageUnits = pDevice.getParameter(pDevice.MAX_TEXTURE_IMAGE_UNITS);
                this.nMaxVertexAttributes = pDevice.getParameter(pDevice.MAX_VERTEX_ATTRIBS);
                this.nMaxVertexTextureImageUnits = pDevice.getParameter(pDevice.MAX_VERTEX_TEXTURE_IMAGE_UNITS);
                this.nMaxCombinedTextureImageUnits = pDevice.getParameter(pDevice.MAX_COMBINED_TEXTURE_IMAGE_UNITS);
                this.nStencilBits = pDevice.getParameter(pDevice.STENCIL_BITS);
                this.pColorBits = [
                    pDevice.getParameter(pDevice.RED_BITS), 
                    pDevice.getParameter(pDevice.GREEN_BITS), 
                    pDevice.getParameter(pDevice.BLUE_BITS)
                ];
                this.nAlphaBits = pDevice.getParameter(pDevice.ALPHA_BITS);
                this.fMultisampleType = pDevice.getParameter(pDevice.SAMPLE_COVERAGE_VALUE);
            }
            Object.defineProperty(DeviceInfo.prototype, "maxTextureSize", {
                get: function () {
                    return this.nMaxTextureSize;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(DeviceInfo.prototype, "maxCubeMapTextureSize", {
                get: function () {
                    return this.nMaxCubeMapTextureSize;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(DeviceInfo.prototype, "maxViewPortSize", {
                get: function () {
                    return this.nMaxViewPortSize;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(DeviceInfo.prototype, "maxTextureImageUnits", {
                get: function () {
                    return this.nMaxTextureImageUnits;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(DeviceInfo.prototype, "maxVertexAttributes", {
                get: function () {
                    return this.nMaxVertexAttributes;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(DeviceInfo.prototype, "maxVertexTextureImageUnits", {
                get: function () {
                    return this.nMaxVertexTextureImageUnits;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(DeviceInfo.prototype, "maxCombinedTextureImageUnits", {
                get: function () {
                    return this.nMaxCombinedTextureImageUnits;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(DeviceInfo.prototype, "maxColorAttachments", {
                get: function () {
                    return this.nMaxColorAttachments;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(DeviceInfo.prototype, "stencilBits", {
                get: function () {
                    return this.nStencilBits;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(DeviceInfo.prototype, "colorBits", {
                get: function () {
                    return this.pColorBits;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(DeviceInfo.prototype, "alphaBits", {
                get: function () {
                    return this.nAlphaBits;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(DeviceInfo.prototype, "multisampleType", {
                get: function () {
                    return this.fMultisampleType;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(DeviceInfo.prototype, "shaderVersion", {
                get: function () {
                    return this.fShaderVersion;
                },
                enumerable: true,
                configurable: true
            });
            DeviceInfo.prototype.getExtention = function (pDevice, csExtension) {
                var pExtentions;
                var sExtention;
                var pExtention = null;
                pExtentions = pDevice.getSupportedExtensions();
                for(var i in pExtentions) {
                    sExtention = pExtentions[i];
                    if(sExtention.search(csExtension) != -1) {
                        pExtention = pDevice.getExtension(sExtention);
                        akra.trace('extension successfuly loaded: ' + sExtention);
                    }
                }
                return pExtention;
            };
            DeviceInfo.prototype.checkFormat = function (pDevice, eFormat) {
                switch(eFormat) {
                    case akra.ImageFormats.RGB_DXT1:
                    case akra.ImageFormats.RGBA_DXT1:
                    case akra.ImageFormats.RGBA_DXT2:
                    case akra.ImageFormats.RGBA_DXT3:
                    case akra.ImageFormats.RGBA_DXT4:
                    case akra.ImageFormats.RGBA_DXT5: {
                        for(var i in pDevice) {
                            if(akra.isNumber(pDevice[i]) && pDevice[i] == eFormat) {
                                return true;
                            }
                        }
                        return false;

                    }
                    case akra.ImageFormats.RGB8:
                    case akra.ImageFormats.RGBA8:
                    case akra.ImageFormats.RGBA4:
                    case akra.ImageFormats.RGB5_A1:
                    case akra.ImageFormats.RGB565: {
                        return true;

                    }
                    default: {
                        return false;

                    }
                }
            };
            return DeviceInfo;
        })(util.Singleton);
        util.DeviceInfo = DeviceInfo;        
    })(akra.util || (akra.util = {}));
    var util = akra.util;
})(akra || (akra = {}));
var akra;
(function (akra) {
    (function (ResourceCodes) {
        ResourceCodes._map = [];
        ResourceCodes.INVALID_CODE = 4294967295;
    })(akra.ResourceCodes || (akra.ResourceCodes = {}));
    var ResourceCodes = akra.ResourceCodes;
    ; ;
})(akra || (akra = {}));
var akra;
(function (akra) {
    (function (ResourceItemEvents) {
        ResourceItemEvents._map = [];
        ResourceItemEvents._map[0] = "k_Created";
        ResourceItemEvents.k_Created = 0;
        ResourceItemEvents._map[1] = "k_Loaded";
        ResourceItemEvents.k_Loaded = 1;
        ResourceItemEvents._map[2] = "k_Disabled";
        ResourceItemEvents.k_Disabled = 2;
        ResourceItemEvents._map[3] = "k_Altered";
        ResourceItemEvents.k_Altered = 3;
        ResourceItemEvents._map[4] = "k_TotalResourceFlags";
        ResourceItemEvents.k_TotalResourceFlags = 4;
    })(akra.ResourceItemEvents || (akra.ResourceItemEvents = {}));
    var ResourceItemEvents = akra.ResourceItemEvents;
    ; ;
})(akra || (akra = {}));
var akra;
(function (akra) {
    (function (ResourceFamilies) {
        ResourceFamilies._map = [];
        ResourceFamilies.VIDEO_RESOURCE = 0;
        ResourceFamilies._map[1] = "AUDIO_RESOURCE";
        ResourceFamilies.AUDIO_RESOURCE = 1;
        ResourceFamilies._map[2] = "GAME_RESOURCE";
        ResourceFamilies.GAME_RESOURCE = 2;
        ResourceFamilies._map[3] = "TOTAL_RESOURCE_FAMILIES";
        ResourceFamilies.TOTAL_RESOURCE_FAMILIES = 3;
    })(akra.ResourceFamilies || (akra.ResourceFamilies = {}));
    var ResourceFamilies = akra.ResourceFamilies;
    ; ;
    (function (VideoResources) {
        VideoResources._map = [];
        VideoResources._map[0] = "k_TextureResource";
        VideoResources.k_TextureResource = 0;
        VideoResources._map[1] = "k_VideoBufferResource";
        VideoResources.k_VideoBufferResource = 1;
        VideoResources._map[2] = "k_VertexBufferResource";
        VideoResources.k_VertexBufferResource = 2;
        VideoResources._map[3] = "k_IndexBufferResource";
        VideoResources.k_IndexBufferResource = 3;
        VideoResources._map[4] = "k_RenderResource";
        VideoResources.k_RenderResource = 4;
        VideoResources._map[5] = "k_RenderSetResource";
        VideoResources.k_RenderSetResource = 5;
        VideoResources._map[6] = "k_ModelResource";
        VideoResources.k_ModelResource = 6;
        VideoResources._map[7] = "k_EffectFileData";
        VideoResources.k_EffectFileData = 7;
        VideoResources._map[8] = "k_ImageResource";
        VideoResources.k_ImageResource = 8;
        VideoResources._map[9] = "k_SMaterialResource";
        VideoResources.k_SMaterialResource = 9;
        VideoResources._map[10] = "k_ShaderProgramResource";
        VideoResources.k_ShaderProgramResource = 10;
        VideoResources._map[11] = "k_ComponentResource";
        VideoResources.k_ComponentResource = 11;
        VideoResources._map[12] = "k_TotalVideoResources";
        VideoResources.k_TotalVideoResources = 12;
    })(akra.VideoResources || (akra.VideoResources = {}));
    var VideoResources = akra.VideoResources;
    ; ;
    (function (AudioResources) {
        AudioResources._map = [];
        AudioResources._map[0] = "k_TotalAudioResources";
        AudioResources.k_TotalAudioResources = 0;
    })(akra.AudioResources || (akra.AudioResources = {}));
    var AudioResources = akra.AudioResources;
    ; ;
    (function (GameResources) {
        GameResources._map = [];
        GameResources._map[0] = "k_TotalGameResources";
        GameResources.k_TotalGameResources = 0;
    })(akra.GameResources || (akra.GameResources = {}));
    var GameResources = akra.GameResources;
    ; ;
})(akra || (akra = {}));
var akra;
(function (akra) {
    (function (pool) {
        var ResourceCode = (function () {
            function ResourceCode(iFamily, iType) {
                this.iValue = (akra.ResourceCodes.INVALID_CODE);
                switch(arguments.length) {
                    case 0: {
                        this.iValue = akra.ResourceCodes.INVALID_CODE;
                        break;

                    }
                    case 1: {
                        if(arguments[0] instanceof ResourceCode) {
                            this.iValue = arguments[0].iValue;
                        } else {
                            this.iValue = arguments[0];
                        }
                        break;

                    }
                    case 2: {
                        this.family = arguments[0];
                        this.type = arguments[1];
                        break;

                    }
                }
            }
            Object.defineProperty(ResourceCode.prototype, "family", {
                get: function () {
                    return this.iValue >> 16;
                },
                set: function (iNewFamily) {
                    this.iValue &= 65535;
                    this.iValue |= iNewFamily << 16;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(ResourceCode.prototype, "type", {
                get: function () {
                    return this.iValue & 65535;
                },
                set: function (iNewType) {
                    this.iValue &= 4294901760;
                    this.iValue |= iNewType & 65535;
                },
                enumerable: true,
                configurable: true
            });
            ResourceCode.prototype.setInvalid = function () {
                this.iValue = akra.ResourceCodes.INVALID_CODE;
            };
            ResourceCode.prototype.less = function (pSrc) {
                return this.iValue < pSrc.valueOf();
            };
            ResourceCode.prototype.eq = function (pSrc) {
                this.iValue = pSrc.valueOf();
                return this;
            };
            ResourceCode.prototype.valueOf = function () {
                return this.iValue;
            };
            ResourceCode.prototype.toNumber = function () {
                return this.iValue;
            };
            return ResourceCode;
        })();
        pool.ResourceCode = ResourceCode;        
    })(akra.pool || (akra.pool = {}));
    var pool = akra.pool;
})(akra || (akra = {}));
var akra;
(function (akra) {
    (function (pool) {
        var PoolGroup = (function () {
            function PoolGroup(pEngine, tTemplate, iMaxCount) {
                this.iTotalOpen = 0;
                this.iFirstOpen = 0;
                this.iMaxCount = 0;
                this.pNextOpenList = null;
                this.pMemberList = null;
                this.pEngine = pEngine;
                this.tTemplate = tTemplate;
                this.iMaxCount = iMaxCount;
            }
            Object.defineProperty(PoolGroup.prototype, "totalOpen", {
                get: function () {
                    return this.iTotalOpen;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(PoolGroup.prototype, "totalUsed", {
                get: function () {
                    return this.iMaxCount - this.iTotalOpen;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(PoolGroup.prototype, "firstOpen", {
                get: function () {
                    return this.iFirstOpen;
                },
                enumerable: true,
                configurable: true
            });
            PoolGroup.prototype.create = function () {
                var i;
                akra.debug_assert(this.pMemberList == null && this.pNextOpenList == null, "Group has already been created");
                this.pNextOpenList = new Array(this.iMaxCount);
                akra.debug_assert(this.pNextOpenList != null, "tragic memory allocation failure!");
                this.pMemberList = new Array(this.iMaxCount);
                for(i = 0; i < this.iMaxCount; i++) {
                    this.pMemberList[i] = new this.tTemplate(this.pEngine);
                }
                akra.debug_assert(this.pNextOpenList != null, "tragic memory allocation failure!");
                for(i = 0; i < this.iMaxCount - 1; i++) {
                    this.pNextOpenList[i] = i + 1;
                }
                this.pNextOpenList[i] = i;
                this.iTotalOpen = this.iMaxCount;
                this.iFirstOpen = 0;
            };
            PoolGroup.prototype.destroy = function () {
                akra.debug_assert(this.pMemberList != null && this.pNextOpenList != null, "Group has not been created");
                akra.debug_assert(this.iTotalOpen == this.iMaxCount, "Group is not empty");
                delete this.pMemberList;
                this.pMemberList = null;
                delete this.pNextOpenList;
                this.pNextOpenList = null;
                this.iTotalOpen = 0;
                this.iMaxCount = 0;
            };
            PoolGroup.prototype.nextMember = function () {
                akra.debug_assert(this.pMemberList != null && this.pNextOpenList != null, "Group has not been created");
                akra.debug_assert(this.iTotalOpen != null, "no open slots");
                var iSlot = this.iFirstOpen;
                this.iFirstOpen = this.pNextOpenList[iSlot];
                this.iTotalOpen--;
                akra.debug_assert(this.iFirstOpen != akra.INVALID_INDEX, "Invalid Open Index");
                akra.debug_assert(this.isOpen(iSlot), "invalid index");
                this.pNextOpenList[iSlot] = akra.INVALID_INDEX;
                return iSlot;
            };
            PoolGroup.prototype.addMember = function (pMember) {
                var iSlot = this.nextMember();
                this.pMemberList[iSlot] = pMember;
                return iSlot;
            };
            PoolGroup.prototype.release = function (iIndex) {
                akra.debug_assert(this.pMemberList != null && this.pNextOpenList != null, "Group has not been created");
                akra.debug_assert(iIndex < this.iMaxCount, "invalid index");
                akra.debug_assert(this.isOpen(iIndex) == false, "invalid index to release");
                this.pNextOpenList[iIndex] = this.iTotalOpen > 0 ? this.iFirstOpen : iIndex;
                this.iTotalOpen++;
                this.iFirstOpen = iIndex;
            };
            PoolGroup.prototype.isOpen = function (iIndex) {
                akra.debug_assert(this.pMemberList != null && this.pNextOpenList != null, "Group has not been created");
                akra.debug_assert(iIndex < this.iMaxCount, "invalid index");
                return this.pNextOpenList[iIndex] != akra.INVALID_INDEX;
            };
            PoolGroup.prototype.member = function (iIndex) {
                akra.debug_assert(this.pMemberList != null && this.pNextOpenList != null, "Group has not been created");
                akra.debug_assert(iIndex < this.iMaxCount, "invalid index");
                return this.pMemberList[iIndex];
            };
            PoolGroup.prototype.memberPtr = function (iIndex) {
                akra.debug_assert(this.pMemberList != null && this.pNextOpenList != null, "Group has not been created");
                akra.debug_assert(iIndex < this.iMaxCount, "invalid index");
                return this.pMemberList[iIndex];
            };
            return PoolGroup;
        })();
        pool.PoolGroup = PoolGroup;        
        var DataPool = (function () {
            function DataPool(pEngine, tTemplate) {
                this.bInitialized = false;
                this.pGroupList = null;
                this.iTotalMembers = 0;
                this.iTotalOpen = 0;
                this.iGroupCount = 0;
                this.iIndexMask = 0;
                this.iIndexShift = 0;
                this.pEngine = pEngine;
                this.tTemplate = tTemplate;
            }
            DataPool.prototype.initialize = function (iGrowSize) {
                akra.debug_assert(this.isInitialized() == false, "the cDataPool is already initialized");
                this.bInitialized = true;
                this.iGroupCount = akra.math.nearestPowerOfTwo(iGrowSize);
                this.iIndexShift = akra.math.lowestBitSet(this.iGroupCount);
                this.iIndexShift = akra.math.clamp(this.iIndexShift, 1, 15);
                this.iGroupCount = 1 << this.iIndexShift;
                this.iIndexMask = this.iGroupCount - 1;
            };
            DataPool.prototype.isInitialized = function () {
                return this.bInitialized;
            };
            DataPool.prototype.destroy = function () {
                this.clear();
                this.bInitialized = false;
            };
            DataPool.prototype.release = function (iHandle) {
                akra.debug_assert(this.isInitialized() == true, "the cDataPool is not initialized");
                if(this.isHandleValid(iHandle) == true) {
                    akra.debug_assert(this.pGroupList.length != 0, "The cDataPool has not been properly created");
                    var iGroupIndex = this.getGroupNumber(iHandle);
                    var iItemIndex = this.getItemIndex(iHandle);
                    var pGroup = this.getGroup(iGroupIndex);
                    pGroup.release(iItemIndex);
                    var pGroupBack = this.pGroupList[this.pGroupList.length - 1];
                    if(pGroupBack.totalOpen == this.iGroupCount) {
                        pGroupBack.destroy();
                        this.pGroupList.splice(this.pGroupList.length - 1, 1);
                    }
                    this.iTotalOpen++;
                }
            };
            DataPool.prototype.clear = function () {
                for(var iGroupIter = 0; iGroupIter < this.pGroupList.length; ++iGroupIter) {
                    this.pGroupList[iGroupIter].destroy();
                }
                this.pGroupList.clear();
            };
            DataPool.prototype.add = function (pMembers) {
                akra.debug_assert(this.isInitialized() == true, "the cDataPool is not initialized");
                var iGroupNumber = {
                    value: 0
                };
                var pOpenGroup = this.findOpenGroup(iGroupNumber);
                var iIndex = pOpenGroup.addMember(pMembers);
                this.iTotalOpen--;
                return this.buildHandle(iGroupNumber.value, iIndex);
            };
            DataPool.prototype.forEach = function (fFunction) {
                akra.debug_assert(this.isInitialized() == true, "the cDataPool is not initialized");
                var iGroupNumber = 0;
                for(var iGroupIter = 0; iGroupIter < this.pGroupList.length; iGroupIter++) {
                    var nCallbackCount = this.pGroupList[iGroupIter].totalUsed;
                    var iItemIndex = 0;
                    while(nCallbackCount != 0 && iItemIndex < this.iGroupCount) {
                        if(this.pGroupList[iGroupIter].isOpen(iItemIndex) == false) {
                            fFunction(this, this.buildHandle(iGroupNumber, iItemIndex), this.pGroupList[iGroupIter].member(iItemIndex));
                            nCallbackCount--;
                        }
                        ++iItemIndex;
                    }
                    ++iGroupNumber;
                }
            };
            DataPool.prototype.nextHandle = function () {
                akra.debug_assert(this.isInitialized() == true, "the cDataPool is not initialized");
                var iGroupNumber = {
                    value: 0
                };
                var pOpenGroup = this.findOpenGroup(iGroupNumber);
                var iIndex = pOpenGroup.nextMember();
                this.iTotalOpen--;
                return this.buildHandle(iGroupNumber.value, iIndex);
            };
            DataPool.prototype.isHandleValid = function (iHandle) {
                akra.debug_assert(this.isInitialized() == true, "the cDataPool is not initialized");
                if(iHandle !== akra.INVALID_INDEX) {
                    akra.debug_assert(this.pGroupList.length != 0, "The cDataPool has not been properly created");
                    var pGroup = this.getGroup(this.getGroupNumber(iHandle));
                    return !pGroup.isOpen(this.getItemIndex(iHandle));
                }
                return false;
            };
            DataPool.prototype.get = function (iHandle) {
                akra.debug_assert(this.isInitialized() == true, "the cDataPool is not initialized");
                akra.debug_assert(this.pGroupList.length != 0, "The cDataPool has not been properly created");
                var pGroup = this.getGroup(this.getGroupNumber(iHandle));
                var iItemIndex = this.getItemIndex(iHandle);
                return pGroup.member(iItemIndex);
            };
            DataPool.prototype.getPtr = function (iHandle) {
                akra.debug_assert(this.isInitialized() == true, "the cDataPool is not initialized");
                akra.debug_assert(this.pGroupList.length != 0, "The cDataPool has not been properly created");
                var pGroup = this.getGroup(this.getGroupNumber(iHandle));
                var iItemIndex = this.getItemIndex(iHandle);
                return pGroup.memberPtr(iItemIndex);
            };
            DataPool.prototype.getGenericPtr = function (iHandle) {
                akra.debug_assert(this.isInitialized() == true, "the cDataPool is not initialized");
                return this.getPtr(iHandle);
            };
            DataPool.prototype.getGroupNumber = function (iHandle) {
                return iHandle >> this.iIndexShift;
            };
            DataPool.prototype.getItemIndex = function (iHandle) {
                return iHandle & this.iIndexMask;
            };
            DataPool.prototype.buildHandle = function (iGroup, iIndex) {
                return (iGroup << this.iIndexShift) + iIndex;
            };
            DataPool.prototype.addGroup = function () {
                var pNewGroup = new PoolGroup(this.pEngine, this.tTemplate, this.iGroupCount);
                this.pGroupList.push(pNewGroup);
                pNewGroup.create();
                this.iTotalMembers += this.iGroupCount;
                this.iTotalOpen += this.iGroupCount;
                return pNewGroup;
            };
            DataPool.prototype.findOpenGroup = function (pGroupNumber) {
                pGroupNumber.value = 0;
                for(var iGroupIter = 0; iGroupIter < this.pGroupList.length; iGroupIter++) {
                    if(this.pGroupList[iGroupIter].totalOpen > 0) {
                        return this.pGroupList[iGroupIter];
                    }
                    pGroupNumber.value++;
                }
                akra.debug_assert((this.pGroupList.length + 1) < akra.MAX_UINT16, "the cDataPool is full!!!!");
                return this.addGroup();
            };
            DataPool.prototype.getGroup = function (iIndex) {
                akra.debug_assert(iIndex < this.pGroupList.length, "Invalid group index requested");
                return this.pGroupList[iIndex];
            };
            return DataPool;
        })();
        pool.DataPool = DataPool;        
    })(akra.pool || (akra.pool = {}));
    var pool = akra.pool;
})(akra || (akra = {}));
var akra;
(function (akra) {
    (function (pool) {
        var ResourcePool = (function (_super) {
            __extends(ResourcePool, _super);
            function ResourcePool(pEngine, tTemplate) {
                        _super.call(this);
                this.pEngine = null;
                this.tTemplate = null;
                this.sExt = null;
                this.pRegistrationCode = new pool.ResourceCode(akra.ResourceCodes.INVALID_CODE);
                this.pNameMap = new Array();
                this.pDataPool = null;
                this.pEngine = pEngine;
                this.tTemplate = tTemplate;
                this.pDataPool = new pool.DataPool(pEngine, tTemplate);
            }
            Object.defineProperty(ResourcePool.prototype, "iFourcc", {
                get: function () {
                    return (this.sExt.charCodeAt(3) << 24) | (this.sExt.charCodeAt(2) << 16) | (this.sExt.charCodeAt(1) << 8) | (this.sExt.charCodeAt(0));
                },
                set: function (iNewFourcc) {
                    this.sExt = String.fromCharCode((iNewFourcc & 255), (iNewFourcc & 65280) >>> 8, (iNewFourcc & 16711680) >>> 16, (iNewFourcc & 4278190080) >>> 24);
                },
                enumerable: true,
                configurable: true
            });
            ResourcePool.prototype.registerResourcePool = function (pCode) {
                this.pRegistrationCode.eq(pCode);
                this.pEngine.resourceManager.registerResourcePool(this.pRegistrationCode, this);
            };
            ResourcePool.prototype.unregisterResourcePool = function (pCode) {
                this.pEngine.resourceManager.unregisterResourcePool(this.pRegistrationCode);
                this.pRegistrationCode.setInvalid();
            };
            ResourcePool.prototype.findResourceHandle = function (sName) {
                var iNewHandle = akra.INVALID_INDEX;
                for(var iHandle = 0; iHandle < this.pNameMap.length; ++iHandle) {
                    if(this.pNameMap[iHandle] === sName) {
                        return iHandle;
                    }
                }
                return iNewHandle;
            };
            ResourcePool.prototype.findResourceName = function (iHandle) {
                return this.pNameMap[iHandle];
            };
            ResourcePool.prototype.setResourceName = function (iHandle, sName) {
                this.pNameMap[iHandle] = sName;
            };
            ResourcePool.prototype.initialize = function (iGrowSize) {
                this.pDataPool.initialize(iGrowSize);
            };
            ResourcePool.prototype.destroy = function () {
                this.pDataPool.destroy();
            };
            ResourcePool.prototype.clean = function () {
                this.pDataPool.forEach(ResourcePool.callbackClean);
            };
            ResourcePool.prototype.destroyAll = function () {
                this.pDataPool.forEach(ResourcePool.callbackDestroy);
            };
            ResourcePool.prototype.restoreAll = function () {
                this.pDataPool.forEach(ResourcePool.callbackRestore);
            };
            ResourcePool.prototype.disableAll = function () {
                this.pDataPool.forEach(ResourcePool.callbackDisable);
            };
            ResourcePool.prototype.isInitialized = function () {
                return this.pDataPool.isInitialized();
            };
            ResourcePool.prototype.createResource = function (sResourceName) {
                var iHandle = this.internalCreateResource(sResourceName);
                if(iHandle !== akra.INVALID_INDEX) {
                    var pResource = this.getResource(iHandle);
                    pResource.setResourcePool(this);
                    pResource.setResourceHandle(iHandle);
                    pResource.setResourceCode(this.pRegistrationCode);
                    return pResource;
                }
                return null;
            };
            ResourcePool.prototype.loadResource = function (sResourceName) {
                var pResource = this.findResource(sResourceName);
                if(pResource == null) {
                    pResource = this.createResource(sResourceName);
                    if(pResource != null) {
                        if(pResource.loadResource(sResourceName)) {
                            return pResource;
                        }
                        pResource.release();
                        pResource = null;
                    }
                }
                return pResource;
            };
            ResourcePool.prototype.saveResource = function (pResource) {
                if(pResource != null) {
                    return pResource.saveResource();
                }
                return false;
            };
            ResourcePool.prototype.destroyResource = function (pResource) {
                if(pResource != null) {
                    var iReferenceCount = pResource.referenceCount();
                    akra.debug_assert(iReferenceCount == 0, "destruction of non-zero reference count!");
                    if(iReferenceCount <= 0) {
                        var iHandle = pResource.resourceHandle;
                        this.internalDestroyResource(iHandle);
                    }
                }
            };
            ResourcePool.prototype.findResource = function (sName) {
                for(var iHandle = 0; iHandle < this.pNameMap.length; ++iHandle) {
                    if(this.pNameMap[iHandle] == sName) {
                        if(iHandle != akra.INVALID_INDEX) {
                            var pResource = this.getResource(iHandle);
                            return pResource;
                        }
                    }
                }
                return null;
            };
            ResourcePool.prototype.getResource = function (iHandle) {
                var pResource = this.internalGetResource(iHandle);
                if(pResource != null) {
                    pResource.addRef();
                }
                return pResource;
            };
            ResourcePool.prototype.internalGetResource = function (iHandle) {
                return this.pDataPool.getPtr(iHandle);
            };
            ResourcePool.prototype.internalDestroyResource = function (iHandle) {
                var pResource = this.pDataPool.getPtr(iHandle);
                pResource.destroyResource();
                delete this.pNameMap[iHandle];
                this.pDataPool.release(iHandle);
            };
            ResourcePool.prototype.internalCreateResource = function (sResourceName) {
                var iHandle = this.pDataPool.nextHandle();
                for(var iter in this.pNameMap) {
                    akra.debug_assert((this.pNameMap[iter] != sResourceName), "A resource with this name already exists: " + sResourceName);
                }
                this.pNameMap[iHandle] = sResourceName;
                var pResource = this.pDataPool.getPtr(iHandle);
                pResource.createResource();
                return iHandle;
            };
            ResourcePool.callbackDestroy = function callbackDestroy(pPool, iHandle, pResource) {
                pResource.destroyResource();
            }
            ResourcePool.callbackDisable = function callbackDisable(pPool, iHandle, pResource) {
                pResource.disableResource();
            }
            ResourcePool.callbackRestore = function callbackRestore(pPool, iHandle, pResource) {
                pResource.restoreResource();
            }
            ResourcePool.callbackClean = function callbackClean(pPool, iHandle, pResource) {
                if(pResource.referenceCount() == 0) {
                    pPool.release(iHandle);
                }
            }
            return ResourcePool;
        })(akra.util.ReferenceCounter);
        pool.ResourcePool = ResourcePool;        
    })(akra.pool || (akra.pool = {}));
    var pool = akra.pool;
})(akra || (akra = {}));
var akra;
(function (akra) {
    (function (pool) {
        var ResourcePoolItem = (function (_super) {
            __extends(ResourcePoolItem, _super);
            function ResourcePoolItem(pEngine) {
                        _super.call(this);
                this.pResourcePool = null;
                this.iResourceHandle = 0;
                this.iResourceFlags = 0;
                this.pEngine = pEngine;
                this.pResourceCode = new pool.ResourceCode(0);
                this.iSystemId = akra.sid();
                this.pCallbackFunctions = [];
                this.pStateWatcher = [];
                this.pCallbackSlots = akra.genArray(null, akra.ResourceItemEvents.k_TotalResourceFlags);
            }
            Object.defineProperty(ResourcePoolItem.prototype, "resourceCode", {
                get: function () {
                    return this.pResourceCode;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(ResourcePoolItem.prototype, "resourcePool", {
                get: function () {
                    return this.pResourcePool;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(ResourcePoolItem.prototype, "resourceHandle", {
                get: function () {
                    return this.iResourceHandle;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(ResourcePoolItem.prototype, "resourceFlags", {
                get: function () {
                    return this.iResourceFlags;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(ResourcePoolItem.prototype, "alteredFlag", {
                get: function () {
                    return akra.bf.testBit(this.iResourceFlags, akra.ResourceItemEvents.k_Altered);
                },
                enumerable: true,
                configurable: true
            });
            ResourcePoolItem.prototype.valueOf = function () {
                return this.iSystemId;
            };
            ResourcePoolItem.prototype.toNumber = function () {
                return this.iSystemId;
            };
            ResourcePoolItem.prototype.getEngine = function () {
                return this.pEngine;
            };
            ResourcePoolItem.prototype.createResource = function () {
                return false;
            };
            ResourcePoolItem.prototype.destroyResource = function () {
                return false;
            };
            ResourcePoolItem.prototype.disableResource = function () {
                return false;
            };
            ResourcePoolItem.prototype.restoreResource = function () {
                return false;
            };
            ResourcePoolItem.prototype.loadResource = function (sFilename) {
                if (typeof sFilename === "undefined") { sFilename = null; }
                return false;
            };
            ResourcePoolItem.prototype.saveResource = function (sFilename) {
                if (typeof sFilename === "undefined") { sFilename = null; }
                return false;
            };
            ResourcePoolItem.prototype.setChangesNotifyRoutine = function (fn) {
                for(var i = 0; i < this.pCallbackFunctions.length; i++) {
                    if(this.pCallbackFunctions[i] == fn) {
                        return;
                    }
                }
                this.pCallbackFunctions.push(fn);
            };
            ResourcePoolItem.prototype.delChangesNotifyRoutine = function (fn) {
                for(var i = 0; i < this.pCallbackFunctions.length; i++) {
                    if(this.pCallbackFunctions[i] == fn) {
                        this.pCallbackFunctions[i] = null;
                    }
                }
            };
            ResourcePoolItem.prototype.setStateWatcher = function (eEvent, fnWatcher) {
                this.pStateWatcher[eEvent] = fnWatcher;
            };
            ResourcePoolItem.prototype.connect = function (pResourceItem, eSignal, eSlot) {
                eSlot = akra.isDef(eSlot) ? eSlot : eSignal;
                eSlot = ResourcePoolItem.parseEvent(eSlot);
                eSignal = ResourcePoolItem.parseEvent(eSignal);
                var pSlots = this.pCallbackSlots;
                var pSignSlots;

                var me = this;
                var n;
                var fn;
                var bState;
                if(akra.isNull(pSlots[eSlot])) {
                    pSlots[eSlot] = [];
                }
                pSignSlots = pSlots[eSlot];
                n = pSignSlots.length;
                bState = akra.bf.testBit(pResourceItem.resourceFlags, eSignal);
                fn = function (eFlag, iResourceFlags, isSet) {
                    if(eFlag == eSignal) {
                        pSignSlots[n].bState = isSet;
                        me.notifyStateChange(eSlot, this);
                        for(var i = 0; i < pSignSlots.length; ++i) {
                            if(pSignSlots[i].bState === false) {
                                if(akra.bf.testBit(me.resourceFlags, eFlag)) {
                                    me.setResourceFlag(eFlag, false);
                                }
                                return;
                            }
                        }
                        me.setResourceFlag(eFlag, true);
                    }
                };
                pSignSlots.push({
                    bState: bState,
                    fn: fn,
                    pResourceItem: pResourceItem
                });
                fn.call(pResourceItem, eSignal, pResourceItem.resourceFlags, bState);
                pResourceItem.setChangesNotifyRoutine(fn);
                return true;
            };
            ResourcePoolItem.prototype.disconnect = function (pResourceItem, eSignal, eSlot) {
                eSlot = akra.isDef(eSlot) ? eSlot : eSignal;
                eSlot = ResourcePoolItem.parseEvent(eSlot);
                eSignal = ResourcePoolItem.parseEvent(eSignal);
                var pSlots = this.pCallbackSlots;
                var pSignSlots;

                var me = this;
                var isRem = false;
                pSignSlots = pSlots[eSlot];
                for(var i = 0, n = pSignSlots.length; i < n; ++i) {
                    if(pSignSlots[i].pResourceItem === pResourceItem) {
                        pSignSlots[i].pResourceItem.delChangesNotifyRoutine(pSignSlots[i].fn);
                        pSignSlots.splice(i, 1);
                        --n;
                        --i;
                        isRem = true;
                    }
                }
                return isRem;
            };
            ResourcePoolItem.prototype.notifyCreated = function () {
                this.setResourceFlag(akra.ResourceItemEvents.k_Created, true);
            };
            ResourcePoolItem.prototype.notifyDestroyed = function () {
                this.setResourceFlag(akra.ResourceItemEvents.k_Created, false);
            };
            ResourcePoolItem.prototype.notifyLoaded = function () {
                this.setAlteredFlag(false);
                this.setResourceFlag(akra.ResourceItemEvents.k_Loaded, true);
            };
            ResourcePoolItem.prototype.notifyUnloaded = function () {
                this.setResourceFlag(akra.ResourceItemEvents.k_Loaded, false);
            };
            ResourcePoolItem.prototype.notifyRestored = function () {
                this.setResourceFlag(akra.ResourceItemEvents.k_Disabled, false);
            };
            ResourcePoolItem.prototype.notifyDisabled = function () {
                this.setResourceFlag(akra.ResourceItemEvents.k_Disabled, true);
            };
            ResourcePoolItem.prototype.notifyAltered = function () {
                this.setResourceFlag(akra.ResourceItemEvents.k_Altered, true);
            };
            ResourcePoolItem.prototype.notifySaved = function () {
                this.setAlteredFlag(false);
            };
            ResourcePoolItem.prototype.isResourceCreated = function () {
                return akra.bf.testBit(this.iResourceFlags, akra.ResourceItemEvents.k_Created);
            };
            ResourcePoolItem.prototype.isResourceLoaded = function () {
                return akra.bf.testBit(this.iResourceFlags, akra.ResourceItemEvents.k_Loaded);
            };
            ResourcePoolItem.prototype.isResourceDisabled = function () {
                return akra.bf.testBit(this.iResourceFlags, akra.ResourceItemEvents.k_Disabled);
            };
            ResourcePoolItem.prototype.isResourceAltered = function () {
                return akra.bf.testBit(this.iResourceFlags, akra.ResourceItemEvents.k_Altered);
            };
            ResourcePoolItem.prototype.setAlteredFlag = function (isOn) {
                if (typeof isOn === "undefined") { isOn = true; }
                this.setResourceFlag(akra.ResourceItemEvents.k_Altered, isOn);
            };
            ResourcePoolItem.prototype.setResourceName = function (sName) {
                if(this.pResourcePool != null) {
                    this.pResourcePool.setResourceName(this.iResourceHandle, sName);
                }
            };
            ResourcePoolItem.prototype.findResourceName = function () {
                if(this.pResourcePool != null) {
                    return this.pResourcePool.findResourceName(this.iResourceHandle);
                }
                return null;
            };
            ResourcePoolItem.prototype.release = function () {
                var iRefCount = _super.prototype.release.call(this);
                if(iRefCount == 0) {
                    if(this.pResourcePool != null) {
                        this.pResourcePool.destroyResource(this);
                    }
                }
                return iRefCount;
            };
            ResourcePoolItem.prototype.setResourceCode = function (pCode) {
                this.pResourceCode.eq(pCode);
            };
            ResourcePoolItem.prototype.setResourcePool = function (pPool) {
                this.pResourcePool = pPool;
            };
            ResourcePoolItem.prototype.setResourceHandle = function (iHandle) {
                this.iResourceHandle = iHandle;
            };
            ResourcePoolItem.prototype.notifyStateChange = function (eEvent, pTarget) {
                if (typeof pTarget === "undefined") { pTarget = null; }
                if(!this.pStateWatcher[eEvent]) {
                    return;
                }
                var pSignSlots = this.pCallbackSlots[eEvent];
                var nTotal = pSignSlots.length;
                var nLoaded = 0;

                for(var i = 0; i < nTotal; ++i) {
                    if(pSignSlots[i].bState) {
                        ++nLoaded;
                    }
                }
                this.pStateWatcher[eEvent](nLoaded, nTotal, pTarget);
            };
            ResourcePoolItem.prototype.setResourceFlag = function (iFlagBit, isSetting) {
                var iTempFlags = this.iResourceFlags;
                akra.bf.setBit(this.iResourceFlags, iFlagBit, isSetting);
                if(iTempFlags != this.iResourceFlags) {
                    for(var i = 0; i < this.pCallbackFunctions.length; i++) {
                        if(this.pCallbackFunctions[i]) {
                            this.pCallbackFunctions[i].call(this, iFlagBit, this.iResourceFlags, isSetting);
                        }
                    }
                }
            };
            ResourcePoolItem.parseEvent = function parseEvent(pEvent) {
                if(akra.isInt(pEvent)) {
                    return pEvent;
                }
                switch(pEvent.toLowerCase()) {
                    case 'loaded': {
                        return akra.ResourceItemEvents.k_Loaded;

                    }
                    case 'created': {
                        return akra.ResourceItemEvents.k_Created;

                    }
                    case 'disabled': {
                        return akra.ResourceItemEvents.k_Disabled;

                    }
                    case 'altered': {
                        return akra.ResourceItemEvents.k_Altered;

                    }
                    default: {
                        akra.error('Использовано неизвестное событие для ресурса.');
                        return 0;

                    }
                }
            }
            return ResourcePoolItem;
        })(akra.util.ReferenceCounter);
        pool.ResourcePoolItem = ResourcePoolItem;        
    })(akra.pool || (akra.pool = {}));
    var pool = akra.pool;
})(akra || (akra = {}));
var akra;
(function (akra) {
    (function (pool) {
        var ResourcePoolManager = (function () {
            function ResourcePoolManager(pEngine) {
                this.pResourceFamilyList = null;
                this.pResourceTypeMap = null;
                this.pWaiterResource = null;
                this.pResourceFamilyList = new Array(akra.ResourceFamilies.TOTAL_RESOURCE_FAMILIES);
                for(var i = 0; i < akra.ResourceFamilies.TOTAL_RESOURCE_FAMILIES; i++) {
                    this.pResourceFamilyList[i] = new Array();
                }
                this.pResourceTypeMap = new Array();
                this.pWaiterResource = new akra.pool.ResourcePoolItem(pEngine);
            }
            ResourcePoolManager.pTypedResourseTotal = [
                akra.VideoResources.k_TotalVideoResources, 
                akra.AudioResources.k_TotalAudioResources, 
                akra.GameResources.k_TotalGameResources
            ];
            return ResourcePoolManager;
        })();
        pool.ResourcePoolManager = ResourcePoolManager;        
    })(akra.pool || (akra.pool = {}));
    var pool = akra.pool;
})(akra || (akra = {}));
var akra;
(function (akra) {
    (function (scene) {
        var Node = (function () {
            function Node() {
                this.sName = null;
            }
            Object.defineProperty(Node.prototype, "name", {
                get: function () {
                    return this.sName;
                },
                set: function (sName) {
                    this.sName = sName;
                },
                enumerable: true,
                configurable: true
            });
            return Node;
        })();
        scene.Node = Node;        
    })(akra.scene || (akra.scene = {}));
    var scene = akra.scene;
})(akra || (akra = {}));
var akra;
(function (akra) {
    (function (scene) {
        var SceneNode = (function (_super) {
            __extends(SceneNode, _super);
            function SceneNode(pEngine) {
                        _super.call(this);
                this.pEngine = null;
                this.pEngine = pEngine;
            }
            return SceneNode;
        })(scene.Node);
        scene.SceneNode = SceneNode;        
    })(akra.scene || (akra.scene = {}));
    var scene = akra.scene;
})(akra || (akra = {}));
var akra;
(function (akra) {
    (function (scene) {
        var SceneObject = (function (_super) {
            __extends(SceneObject, _super);
            function SceneObject(pEngine) {
                        _super.call(this, pEngine);
            }
            return SceneObject;
        })(scene.SceneNode);
        scene.SceneObject = SceneObject;        
    })(akra.scene || (akra.scene = {}));
    var scene = akra.scene;
})(akra || (akra = {}));
var akra;
(function (akra) {
    (function (scene) {
        (function (objects) {
            var Camera = (function (_super) {
                __extends(Camera, _super);
                function Camera(pEngine) {
                                _super.call(this, pEngine);
                }
                return Camera;
            })(scene.SceneObject);
            objects.Camera = Camera;            
        })(scene.objects || (scene.objects = {}));
        var objects = scene.objects;
    })(akra.scene || (akra.scene = {}));
    var scene = akra.scene;
})(akra || (akra = {}));
var akra;
(function (akra) {
    (function (scene) {
        var OcTree = (function () {
            function OcTree() { }
            return OcTree;
        })();
        scene.OcTree = OcTree;        
    })(akra.scene || (akra.scene = {}));
    var scene = akra.scene;
})(akra || (akra = {}));
var akra;
(function (akra) {
    var Engine = (function () {
        function Engine(sCanvasId) {
            if (typeof sCanvasId === "undefined") { sCanvasId = null; }
            this.useHWAA = false;
            this.isShowCursorWhenFullscreen = false;
            this.iCreationWidth = 0;
            this.iCreationHeight = 0;
            this.isActive = false;
            this.isDeviceLost = false;
            this.isFrameMoving = true;
            this.isSingleStep = true;
            this.isFrameReady = false;
            this.fTime = 0;
            this.fElapsedTime = 0;
            this.fUpdateTimeCount = 0;
            this.fFPS = 0;
            this.sDeviceStats = "";
            this.sFrameStats = "";
            this.pFonts = null;
            this.isShowStats = false;
            this.pCanvas = null;
            this.pDevice = null;
            this.pRenderer = null;
            this.pResourceManager = null;
            this.pDisplayManager = null;
            this.pParticleManager = null;
            this.pSpriteManager = null;
            this.pLightManager = null;
            this.pRootNode = null;
            this.pDefaultCamera = null;
            this.pActiveCamera = null;
            this.pSceneTree = null;
            this.pWorldExtents = null;
            this.pRenderList = null;
            this.pRenderState = null;
            this.pause(true);
            if(sCanvasId) {
                this.create(sCanvasId);
            }
        }
        Engine.pKeymap = new akra.util.KeyMap();
        Engine.pGamepad = new akra.util.GamepadMap();
        Object.defineProperty(Engine.prototype, "displayManager", {
            get: function () {
                return null;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Engine.prototype, "particleManager", {
            get: function () {
                return null;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Engine.prototype, "spriteManager", {
            get: function () {
                return null;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Engine.prototype, "lightManager", {
            get: function () {
                return null;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Engine.prototype, "resourceManager", {
            get: function () {
                return null;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Engine.prototype, "rootNode", {
            get: function () {
                return null;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Engine.prototype, "sceneTree", {
            get: function () {
                return null;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Engine.prototype, "defaultCamera", {
            get: function () {
                return null;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Engine.prototype, "activeViewport", {
            get: function () {
                return {
                    width: 0,
                    height: 0,
                    x: 0,
                    y: 0
                };
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Engine.prototype, "worldExtents", {
            get: function () {
                return {
                };
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Engine.prototype, "device", {
            get: function () {
                return null;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Engine.prototype, "activeCamera", {
            get: function () {
                return null;
            },
            set: function (pCamera) {
                return;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Engine.prototype, "time", {
            get: function () {
                return this.fTime;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Engine.prototype, "elapsedTime", {
            get: function () {
                return this.fElapsedTime;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Engine.prototype, "fps", {
            get: function () {
                return this.fFPS;
            },
            enumerable: true,
            configurable: true
        });
        Engine.prototype.create = function (pCanvas) {
            if(akra.isString(pCanvas)) {
                this.pCanvas = document.getElementById(pCanvas);
            } else {
                this.pCanvas = pCanvas;
            }
            this.pRootNode = new akra.scene.SceneNode(this);
            this.pRootNode.name = ".root";
            this.pDefaultCamera = new akra.scene.objects.Camera(this);
            this.pDefaultCamera.name = ".default";
            this.pSceneTree = new akra.scene.OcTree();
            this.pActiveCamera = this.pDefaultCamera;
            this.iCreationWidth = this.pCanvas.width;
            this.iCreationHeight = this.pCanvas.height;
            this.pDevice = akra.createDevice(this.pCanvas, {
                antialias: this.useHWAA
            });
            if(!this.pDevice) {
                akra.debug_warning('cannot create device object');
                return false;
            }
            if(!this.initDefaultStates()) {
                akra.debug_warning('cannot init default states');
                return false;
            }
            return false;
        };
        Engine.prototype.run = function () {
            return false;
        };
        Engine.prototype.setupWorldOcTree = function (pWorldExtents) {
        };
        Engine.prototype.pause = function (isPause) {
        };
        Engine.prototype.showStats = function (isShow) {
        };
        Engine.prototype.fullscreen = function () {
            return false;
        };
        Engine.prototype.inFullscreenMode = function () {
            return false;
        };
        Engine.prototype.notifyOneTimeSceneInit = function () {
            return false;
        };
        Engine.prototype.notifyRestoreDeviceObjects = function () {
            return false;
        };
        Engine.prototype.notifyDeleteDeviceObjects = function () {
            return false;
        };
        Engine.prototype.notifyUpdateScene = function () {
            return false;
        };
        Engine.prototype.notifyPreUpdateScene = function () {
            return false;
        };
        Engine.prototype.notifyInitDeviceObjects = function () {
            return false;
        };
        Engine.prototype.updateCamera = function () {
        };
        Engine.prototype.updateStats = function () {
        };
        Engine.prototype.initDefaultStates = function () {
            this.pRenderState = {
                mesh: {
                    isSkinning: false
                },
                isAdvancedIndex: false,
                lights: {
                    omni: 0,
                    project: 0,
                    omniShadows: 0,
                    projectShadows: 0
                }
            };
            return true;
        };
        Engine.prototype.initialize3DEnvironment = function () {
            return false;
        };
        Engine.prototype.render3DEnvironment = function () {
            return false;
        };
        Engine.prototype.cleanup3DEnvironment = function () {
            return false;
        };
        Engine.prototype.invalidateDeviceObjects = function () {
            return false;
        };
        Engine.prototype.frameMove = function () {
            return false;
        };
        Engine.prototype.render = function () {
            return false;
        };
        Engine.prototype.finalCleanup = function () {
            return null;
        };
        return Engine;
    })();
    akra.Engine = Engine;    
})(akra || (akra = {}));
var akra;
(function (akra) {
    akra.DEBUG = true;
    function typeOf(x) {
        var s = typeof x;
        if(s === "object") {
            if(x) {
                if(x instanceof Array) {
                    return 'array';
                } else {
                    if(x instanceof Object) {
                        return s;
                    }
                }
                var sClassName = Object.prototype.toString.call(x);
                if(sClassName == '[object Window]') {
                    return 'object';
                }
                if((sClassName == '[object Array]' || typeof x.length == 'number' && typeof x.splice != 'undefined' && typeof x.propertyIsEnumerable != 'undefined' && !x.propertyIsEnumerable('splice'))) {
                    return 'array';
                }
                if((sClassName == '[object Function]' || typeof x.call != 'undefined' && typeof x.propertyIsEnumerable != 'undefined' && !x.propertyIsEnumerable('call'))) {
                    return 'function';
                }
            } else {
                return 'null';
            }
        } else {
            if(s == 'function' && typeof x.call == 'undefined') {
                return 'object';
            }
        }
        return s;
    }
    akra.typeOf = typeOf;
    ; ;
    akra.isDef = function (x) {
        return x !== undefined;
    };
    akra.isNull = function (x) {
        return x === null;
    };
    akra.isBoolean = function (x) {
        return typeof x === "boolean";
    };
    akra.isString = function (x) {
        return typeof x === "string";
    };
    akra.isNumber = function (x) {
        return typeof x === "number";
    };
    akra.isFloat = akra.isNumber;
    akra.isInt = akra.isNumber;
    akra.isFunction = function (x) {
        return typeOf(x) === "function";
    };
    akra.isObject = function (x) {
        var type = typeOf(x);
        return type == 'object' || type == 'array' || type == 'function';
    };
    if(!akra.isDef(console.assert)) {
        console.assert = function (isOK) {
            var pParams = [];
            for (var _i = 0; _i < (arguments.length - 1); _i++) {
                pParams[_i] = arguments[_i + 1];
            }
            if(!isOK) {
                akra.trace('---------------------------');
                akra.trace.apply(null, pParams);
                throw new Error("[assertion failed]");
            }
        };
    }
    akra.trace = console.log.bind(console);
    akra.assert = console.assert.bind(console);
    akra.warning = console.warn.bind(console);
    akra.error = console.error.bind(console);
    akra.debug_print = function (pArg) {
        var pParams = [];
        for (var _i = 0; _i < (arguments.length - 1); _i++) {
            pParams[_i] = arguments[_i + 1];
        }
        if(akra.DEBUG) {
            akra.trace.apply(null, arguments);
        }
    };
    akra.debug_assert = function (isOK) {
        var pParams = [];
        for (var _i = 0; _i < (arguments.length - 1); _i++) {
            pParams[_i] = arguments[_i + 1];
        }
        if(akra.DEBUG) {
            akra.assert.apply(null, arguments);
        }
    };
    akra.debug_warning = function (pArg) {
        var pParams = [];
        for (var _i = 0; _i < (arguments.length - 1); _i++) {
            pParams[_i] = arguments[_i + 1];
        }
        if(akra.DEBUG) {
            akra.warning.apply(null, arguments);
        }
    };
    akra.debug_error = function (pArg) {
        var pParams = [];
        for (var _i = 0; _i < (arguments.length - 1); _i++) {
            pParams[_i] = arguments[_i + 1];
        }
        if(akra.DEBUG) {
            akra.error.apply(null, arguments);
        }
    };
    function initDevice(pDevice) {
        return pDevice;
    }
    akra.initDevice = initDevice;
    function createDevice(pCanvas, pOptions) {
        if (typeof pCanvas === "undefined") { pCanvas = document.createElement("canvas"); }
        var pDevice = null;
        try  {
            pDevice = pCanvas.getContext("webgl", pOptions) || pCanvas.getContext("experimental-webgl", pOptions);
        } catch (e) {
        }
        if(!pDevice) {
            akra.debug_warning("cannot get 3d device");
        }
        return initDevice(pDevice);
    }
    akra.createDevice = createDevice;
    function genArray(pType, nSize) {
        var tmp = new Array(nSize);
        for(var i = 0; i < nSize; ++i) {
            tmp[i] = (pType ? new pType() : null);
        }
        return tmp;
    }
    akra.genArray = genArray;
    akra.INVALID_INDEX = 65535;
    akra.MIN_INT32 = 4294967295;
    akra.MAX_INT32 = 2147483647;
    akra.MIN_INT16 = 65535;
    akra.MAX_INT16 = 32767;
    akra.MIN_INT8 = 255;
    akra.MAX_INT8 = 127;
    akra.MIN_UINT32 = 0;
    akra.MAX_UINT32 = 4294967295;
    akra.MIN_UINT16 = 0;
    akra.MAX_UINT16 = 65535;
    akra.MIN_UINT8 = 0;
    akra.MAX_UINT8 = 255;
    akra.SIZE_FLOAT64 = 8;
    akra.SIZE_REAL64 = 8;
    akra.SIZE_FLOAT32 = 4;
    akra.SIZE_REAL32 = 4;
    akra.SIZE_INT32 = 4;
    akra.SIZE_UINT32 = 4;
    akra.SIZE_INT16 = 2;
    akra.SIZE_UINT16 = 2;
    akra.SIZE_INT8 = 1;
    akra.SIZE_UINT8 = 1;
    akra.SIZE_BYTE = 1;
    akra.SIZE_UBYTE = 1;
    akra.MAX_FLOAT64 = Number.MAX_VALUE;
    akra.MIN_FLOAT64 = -Number.MAX_VALUE;
    akra.TINY_FLOAT64 = Number.MIN_VALUE;
    akra.MAX_FLOAT32 = 3.4e+38;
    akra.MIN_FLOAT32 = -3.4e+38;
    akra.TINY_FLOAT32 = 1.5e-45;
    (function (DataTypes) {
        DataTypes._map = [];
        DataTypes.BYTE = 5120;
        DataTypes.UNSIGNED_BYTE = 5121;
        DataTypes.SHORT = 5122;
        DataTypes.UNSIGNED_SHORT = 5123;
        DataTypes.INT = 5124;
        DataTypes.UNSIGNED_INT = 5125;
        DataTypes.FLOAT = 5126;
    })(akra.DataTypes || (akra.DataTypes = {}));
    var DataTypes = akra.DataTypes;
    ; ;
    (function (DataTypeSizes) {
        DataTypeSizes._map = [];
        DataTypeSizes.BYTES_PER_BYTE = 1;
        DataTypeSizes.BYTES_PER_UNSIGNED_BYTE = 1;
        DataTypeSizes.BYTES_PER_UBYTE = 1;
        DataTypeSizes.BYTES_PER_SHORT = 2;
        DataTypeSizes.BYTES_PER_UNSIGNED_SHORT = 2;
        DataTypeSizes.BYTES_PER_USHORT = 2;
        DataTypeSizes.BYTES_PER_INT = 4;
        DataTypeSizes.BYTES_PER_UNSIGNED_INT = 4;
        DataTypeSizes.BYTES_PER_UINT = 4;
        DataTypeSizes.BYTES_PER_FLOAT = 4;
    })(akra.DataTypeSizes || (akra.DataTypeSizes = {}));
    var DataTypeSizes = akra.DataTypeSizes;
    ; ;
    (function (ResourceTypes) {
        ResourceTypes._map = [];
        ResourceTypes.SURFACE = 1;
        ResourceTypes._map[2] = "VOLUME";
        ResourceTypes.VOLUME = 2;
        ResourceTypes._map[3] = "TEXTURE";
        ResourceTypes.TEXTURE = 3;
        ResourceTypes._map[4] = "VOLUMETEXTURE";
        ResourceTypes.VOLUMETEXTURE = 4;
        ResourceTypes._map[5] = "CUBETEXTURE";
        ResourceTypes.CUBETEXTURE = 5;
        ResourceTypes._map[6] = "VERTEXBUFFER";
        ResourceTypes.VERTEXBUFFER = 6;
        ResourceTypes._map[7] = "INDEXBUFFER";
        ResourceTypes.INDEXBUFFER = 7;
        ResourceTypes.FORCE_DWORD = 2147483647;
    })(akra.ResourceTypes || (akra.ResourceTypes = {}));
    var ResourceTypes = akra.ResourceTypes;
    ; ;
    (function (PrimitiveTypes) {
        PrimitiveTypes._map = [];
        PrimitiveTypes.POINTLIST = 0;
        PrimitiveTypes._map[1] = "LINELIST";
        PrimitiveTypes.LINELIST = 1;
        PrimitiveTypes._map[2] = "LINELOOP";
        PrimitiveTypes.LINELOOP = 2;
        PrimitiveTypes._map[3] = "LINESTRIP";
        PrimitiveTypes.LINESTRIP = 3;
        PrimitiveTypes._map[4] = "TRIANGLELIST";
        PrimitiveTypes.TRIANGLELIST = 4;
        PrimitiveTypes._map[5] = "TRIANGLESTRIP";
        PrimitiveTypes.TRIANGLESTRIP = 5;
        PrimitiveTypes._map[6] = "TRIANGLEFAN";
        PrimitiveTypes.TRIANGLEFAN = 6;
    })(akra.PrimitiveTypes || (akra.PrimitiveTypes = {}));
    var PrimitiveTypes = akra.PrimitiveTypes;
    ; ;
    (function (ImageFormats) {
        ImageFormats._map = [];
        ImageFormats.RGB = 6407;
        ImageFormats.RGB8 = 6407;
        ImageFormats.BGR8 = 32864;
        ImageFormats.RGBA = 6408;
        ImageFormats.RGBA8 = 6408;
        ImageFormats.BGRA8 = 6409;
        ImageFormats.RGBA4 = 32854;
        ImageFormats.BGRA4 = 32857;
        ImageFormats.RGB5_A1 = 32855;
        ImageFormats.BGR5_A1 = 32856;
        ImageFormats.RGB565 = 36194;
        ImageFormats.BGR565 = 36195;
        ImageFormats.RGB_DXT1 = 33776;
        ImageFormats.RGBA_DXT1 = 33777;
        ImageFormats.RGBA_DXT2 = 33780;
        ImageFormats.RGBA_DXT3 = 33778;
        ImageFormats.RGBA_DXT4 = 33781;
        ImageFormats.RGBA_DXT5 = 33779;
        ImageFormats.DEPTH_COMPONENT = 6402;
        ImageFormats.ALPHA = 6406;
        ImageFormats.LUMINANCE = 6409;
        ImageFormats.LUMINANCE_ALPHA = 6410;
    })(akra.ImageFormats || (akra.ImageFormats = {}));
    var ImageFormats = akra.ImageFormats;
    ; ;
    (function (ImageShortFormats) {
        ImageShortFormats._map = [];
        ImageShortFormats.RGB = 6407;
        ImageShortFormats.RGBA = 6408;
    })(akra.ImageShortFormats || (akra.ImageShortFormats = {}));
    var ImageShortFormats = akra.ImageShortFormats;
    ; ;
    (function (ImageTypes) {
        ImageTypes._map = [];
        ImageTypes.UNSIGNED_BYTE = 5121;
        ImageTypes.UNSIGNED_SHORT_4_4_4_4 = 32819;
        ImageTypes.UNSIGNED_SHORT_5_5_5_1 = 32820;
        ImageTypes.UNSIGNED_SHORT_5_6_5 = 33635;
        ImageTypes.FLOAT = 5126;
    })(akra.ImageTypes || (akra.ImageTypes = {}));
    var ImageTypes = akra.ImageTypes;
    ; ;
    (function (TextureFilters) {
        TextureFilters._map = [];
        TextureFilters.NEAREST = 9728;
        TextureFilters.LINEAR = 9729;
        TextureFilters.NEAREST_MIPMAP_NEAREST = 9984;
        TextureFilters.LINEAR_MIPMAP_NEAREST = 9985;
        TextureFilters.NEAREST_MIPMAP_LINEAR = 9986;
        TextureFilters.LINEAR_MIPMAP_LINEAR = 9987;
    })(akra.TextureFilters || (akra.TextureFilters = {}));
    var TextureFilters = akra.TextureFilters;
    ; ;
    (function (TextureWrapModes) {
        TextureWrapModes._map = [];
        TextureWrapModes.REPEAT = 10497;
        TextureWrapModes.CLAMP_TO_EDGE = 33071;
        TextureWrapModes.MIRRORED_REPEAT = 33648;
    })(akra.TextureWrapModes || (akra.TextureWrapModes = {}));
    var TextureWrapModes = akra.TextureWrapModes;
    ; ;
    (function (TextureParameters) {
        TextureParameters._map = [];
        TextureParameters.MAG_FILTER = 10240;
        TextureParameters._map[10241] = "MIN_FILTER";
        TextureParameters.MIN_FILTER = 10241;
        TextureParameters._map[10242] = "WRAP_S";
        TextureParameters.WRAP_S = 10242;
        TextureParameters._map[10243] = "WRAP_T";
        TextureParameters.WRAP_T = 10243;
    })(akra.TextureParameters || (akra.TextureParameters = {}));
    var TextureParameters = akra.TextureParameters;
    ; ;
    (function (TextureTypes) {
        TextureTypes._map = [];
        TextureTypes.TEXTURE_2D = 3553;
        TextureTypes.TEXTURE = 5890;
        TextureTypes.TEXTURE_CUBE_MAP = 34067;
        TextureTypes.TEXTURE_BINDING_CUBE_MAP = 34068;
        TextureTypes.TEXTURE_CUBE_MAP_POSITIVE_X = 34069;
        TextureTypes.TEXTURE_CUBE_MAP_NEGATIVE_X = 34070;
        TextureTypes.TEXTURE_CUBE_MAP_POSITIVE_Y = 34071;
        TextureTypes.TEXTURE_CUBE_MAP_NEGATIVE_Y = 34072;
        TextureTypes.TEXTURE_CUBE_MAP_POSITIVE_Z = 34073;
        TextureTypes.TEXTURE_CUBE_MAP_NEGATIVE_Z = 34074;
        TextureTypes.MAX_CUBE_MAP_TEXTURE_SIZE = 34076;
    })(akra.TextureTypes || (akra.TextureTypes = {}));
    var TextureTypes = akra.TextureTypes;
    ; ;
    (function (GLSpecifics) {
        GLSpecifics._map = [];
        GLSpecifics.UNPACK_ALIGNMENT = 3317;
        GLSpecifics.PACK_ALIGNMENT = 3333;
        GLSpecifics.UNPACK_FLIP_Y_WEBGL = 37440;
        GLSpecifics.UNPACK_PREMULTIPLY_ALPHA_WEBGL = 37441;
        GLSpecifics.CONTEXT_LOST_WEBGL = 37442;
        GLSpecifics.UNPACK_COLORSPACE_CONVERSION_WEBGL = 37443;
        GLSpecifics.BROWSER_DEFAULT_WEBGL = 37444;
    })(akra.GLSpecifics || (akra.GLSpecifics = {}));
    var GLSpecifics = akra.GLSpecifics;
    ; ;
    (function (BufferMasks) {
        BufferMasks._map = [];
        BufferMasks.DEPTH_BUFFER_BIT = 256;
        BufferMasks.STENCIL_BUFFER_BIT = 1024;
        BufferMasks.COLOR_BUFFER_BIT = 16384;
    })(akra.BufferMasks || (akra.BufferMasks = {}));
    var BufferMasks = akra.BufferMasks;
    ; ;
    (function (BufferUsages) {
        BufferUsages._map = [];
        BufferUsages.STREAM_DRAW = 35040;
        BufferUsages.STATIC_DRAW = 35044;
        BufferUsages.DYNAMIC_DRAW = 35048;
    })(akra.BufferUsages || (akra.BufferUsages = {}));
    var BufferUsages = akra.BufferUsages;
    ; ;
    (function (BufferTypes) {
        BufferTypes._map = [];
        BufferTypes.ARRAY_BUFFER = 34962;
        BufferTypes.ELEMENT_ARRAY_BUFFER = 34963;
        BufferTypes.FRAME_BUFFER = 36160;
        BufferTypes.RENDER_BUFFER = 36161;
    })(akra.BufferTypes || (akra.BufferTypes = {}));
    var BufferTypes = akra.BufferTypes;
    ; ;
    (function (AttachmentTypes) {
        AttachmentTypes._map = [];
        AttachmentTypes.COLOR_ATTACHMENT0 = 36064;
        AttachmentTypes.DEPTH_ATTACHMENT = 36096;
        AttachmentTypes.STENCIL_ATTACHMENT = 36128;
        AttachmentTypes.DEPTH_STENCIL_ATTACHMENT = 33306;
    })(akra.AttachmentTypes || (akra.AttachmentTypes = {}));
    var AttachmentTypes = akra.AttachmentTypes;
    ; ;
    (function (ShaderTypes) {
        ShaderTypes._map = [];
        ShaderTypes.PIXEL = 35632;
        ShaderTypes._map[35633] = "VERTEX";
        ShaderTypes.VERTEX = 35633;
    })(akra.ShaderTypes || (akra.ShaderTypes = {}));
    var ShaderTypes = akra.ShaderTypes;
    ; ;
    (function (RenderStates) {
        RenderStates._map = [];
        RenderStates.ZENABLE = 7;
        RenderStates.ZWRITEENABLE = 14;
        RenderStates.SRCBLEND = 19;
        RenderStates.DESTBLEND = 20;
        RenderStates.CULLMODE = 22;
        RenderStates.ZFUNC = 23;
        RenderStates.DITHERENABLE = 26;
        RenderStates.ALPHABLENDENABLE = 27;
        RenderStates._map[28] = "ALPHATESTENABLE";
        RenderStates.ALPHATESTENABLE = 28;
    })(akra.RenderStates || (akra.RenderStates = {}));
    var RenderStates = akra.RenderStates;
    ; ;
    (function (BlendModes) {
        BlendModes._map = [];
        BlendModes.ZERO = 0;
        BlendModes.ONE = 1;
        BlendModes.SRCCOLOR = 768;
        BlendModes.INVSRCCOLOR = 769;
        BlendModes.SRCALPHA = 770;
        BlendModes.INVSRCALPHA = 771;
        BlendModes.DESTALPHA = 772;
        BlendModes.INVDESTALPHA = 773;
        BlendModes.DESTCOLOR = 774;
        BlendModes.INVDESTCOLOR = 775;
        BlendModes.SRCALPHASAT = 776;
    })(akra.BlendModes || (akra.BlendModes = {}));
    var BlendModes = akra.BlendModes;
    ; ;
    (function (CmpFuncs) {
        CmpFuncs._map = [];
        CmpFuncs.NEVER = 1;
        CmpFuncs.LESS = 2;
        CmpFuncs.EQUAL = 3;
        CmpFuncs.LESSEQUAL = 4;
        CmpFuncs.GREATER = 5;
        CmpFuncs.NOTEQUAL = 6;
        CmpFuncs.GREATEREQUAL = 7;
        CmpFuncs.ALWAYS = 8;
    })(akra.CmpFuncs || (akra.CmpFuncs = {}));
    var CmpFuncs = akra.CmpFuncs;
    ; ;
    (function (CullModes) {
        CullModes._map = [];
        CullModes.NONE = 0;
        CullModes.CW = 1028;
        CullModes.CCW = 1029;
        CullModes.FRONT_AND_BACK = 1032;
    })(akra.CullModes || (akra.CullModes = {}));
    var CullModes = akra.CullModes;
    ; ;
    (function (TextureUnits) {
        TextureUnits._map = [];
        TextureUnits.TEXTURE = 33984;
    })(akra.TextureUnits || (akra.TextureUnits = {}));
    var TextureUnits = akra.TextureUnits;
    ; ;
            function getTypeSize(eType) {
        switch(eType) {
            case DataTypes.BYTE:
            case DataTypes.UNSIGNED_BYTE: {
                return 1;

            }
            case DataTypes.SHORT:
            case DataTypes.UNSIGNED_SHORT:
            case ImageTypes.UNSIGNED_SHORT_4_4_4_4:
            case ImageTypes.UNSIGNED_SHORT_5_5_5_1:
            case ImageTypes.UNSIGNED_SHORT_5_6_5: {
                return 2;

            }
            case DataTypes.INT:
            case DataTypes.UNSIGNED_INT:
            case DataTypes.FLOAT: {
                return 4;

            }
            default: {
                akra.error('unknown data/image type used');

            }
        }
        return 0;
    }
    akra.getTypeSize = getTypeSize;
    function ab2ta(pBuffer, eType) {
        switch(eType) {
            case DataTypes.FLOAT: {
                return new Float32Array(pBuffer);

            }
            case DataTypes.SHORT: {
                return new Int16Array(pBuffer);

            }
            case DataTypes.UNSIGNED_SHORT: {
                return new Uint16Array(pBuffer);

            }
            case DataTypes.INT: {
                return new Int32Array(pBuffer);

            }
            case DataTypes.UNSIGNED_INT: {
                return new Uint32Array(pBuffer);

            }
            case DataTypes.BYTE: {
                return new Int8Array(pBuffer);

            }
            default:
            case DataTypes.UNSIGNED_BYTE: {
                return new Uint8Array(pBuffer);

            }
        }
    }
    akra.ab2ta = ab2ta;
    akra.sid = function () {
        return (++akra.sid._iTotal);
    };
    akra.sid._iTotal = 0;
    (window).URL = (window).URL ? (window).URL : (window).webkitURL ? (window).webkitURL : null;
    (window).BlobBuilder = (window).WebKitBlobBuilder || (window).MozBlobBuilder || (window).BlobBuilder;
    (window).requestFileSystem = (window).requestFileSystem || (window).webkitRequestFileSystem;
    (window).requestAnimationFrame = (window).requestAnimationFrame || (window).webkitRequestAnimationFrame || (window).mozRequestAnimationFrame;
    (window).WebSocket = (window).WebSocket || (window).MozWebSocket;
})(akra || (akra = {}));
; ;
var DemoApp = (function (_super) {
    __extends(DemoApp, _super);
    function DemoApp() {
        _super.apply(this, arguments);

    }
    DemoApp.prototype.oneTimeSceneInit = function () {
        this.notifyOneTimeSceneInit();
        this.setupWorldOcTree(new akra.geometry.Rect3d(-500, 500, -500, 500, 0, 500));
        return true;
    };
    return DemoApp;
})(akra.Engine);
var pApp = new DemoApp();
if(!pApp.create('canvas') || !pApp.run()) {
    akra.error('cannot create and run application.');
}
