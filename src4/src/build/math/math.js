/// <reference path="matrixIndecies.ts" />
/// <reference path="Vec2.ts" />
/// <reference path="Vec3.ts" />
/// <reference path="Vec4.ts" />
/// <reference path="Mat3.ts" />
/// <reference path="Mat4.ts" />
/// <reference path="Quat4.ts" />
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

        math.POSITIVE_INFINITY = Number.POSITIVE_INFINITY;
        math.NEGATIVE_INFINITY = Number.NEGATIVE_INFINITY;

        math.FLOAT_PRECISION = (3.4e-8);
        math.TWO_PI = (2.0 * math.PI);
        math.HALF_PI = (math.PI / 2.0);
        math.QUARTER_PI = (math.PI / 4.0);
        math.EIGHTH_PI = (math.PI / 8.0);
        math.PI_SQUARED = (9.86960440108935861883449099987615113531369940724079);
        math.PI_INVERSE = (0.31830988618379067153776752674502872406891929148091);
        math.PI_OVER_180 = (math.PI / 180);
        math.PI_DIV_180 = (180 / math.PI);
        math.NATURAL_LOGARITHM_BASE = (2.71828182845904523536028747135266249775724709369996);
        math.EULERS_CONSTANT = (0.57721566490153286060651);
        math.SQUARE_ROOT_2 = (1.41421356237309504880168872420969807856967187537695);
        math.INVERSE_ROOT_2 = (0.707106781186547524400844362105198);
        math.SQUARE_ROOT_3 = (1.73205080756887729352744634150587236694280525381038);
        math.SQUARE_ROOT_5 = (2.23606797749978969640917366873127623544061835961153);
        math.SQUARE_ROOT_10 = (3.16227766016837933199889354443271853371955513932522);
        math.CUBE_ROOT_2 = (1.25992104989487316476721060727822835057025146470151);
        math.CUBE_ROOT_3 = (1.44224957030740838232163831078010958839186925349935);
        math.FOURTH_ROOT_2 = (1.18920711500272106671749997056047591529297209246382);
        math.NATURAL_LOG_2 = (0.69314718055994530941723212145817656807550013436026);
        math.NATURAL_LOG_3 = (1.09861228866810969139524523692252570464749055782275);
        math.NATURAL_LOG_10 = (2.30258509299404568401799145468436420760110148862877);
        math.NATURAL_LOG_PI = (1.14472988584940017414342735135305871164729481291531);
        math.BASE_TEN_LOG_PI = (0.49714987269413385435126828829089887365167832438044);
        math.NATURAL_LOGARITHM_BASE_INVERSE = (0.36787944117144232159552377016146086744581113103177);
        math.NATURAL_LOGARITHM_BASE_SQUARED = (7.38905609893065022723042746057500781318031557055185);
        math.GOLDEN_RATIO = ((math.SQUARE_ROOT_5 + 1.0) / 2.0);
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

        /*
        -----------------------------------------------------------------
        Floating Point Macros
        -----------------------------------------------------------------
        */
        // reinterpret a float as an int32
        /** @ */
        math.fpBits = function (f) {
            return math.floor(f);
        };

        // reinterpret an int32 as a float
        /** @ */
        math.intBits = function (i) {
            return i;
        };

        // return 0 or -1 based on the sign of the float
        /** @ */
        math.fpSign = function (f) {
            return (f >> 31);
        };

        // extract the 8 bits of exponent as a signed integer
        // by masking out this bits, shifting down by 23,
        // and subtracting the bias value of 127
        /** @ */
        math.fpExponent = function (f) {
            return (((math.fpBits(f) & 0x7fffffff) >> 23) - 127);
        };

        // return 0 or -1 based on the sign of the exponent
        /** @ */
        math.fpExponentSign = function (f) {
            return (math.fpExponent(f) >> 31);
        };

        // get the 23 bits of mantissa without the implied bit
        /** @ */
        math.fpPureMantissa = function (f) {
            return ((math.fpBits(f) & 0x7fffff));
        };

        // get the 23 bits of mantissa with the implied bit replaced
        /** @ */
        math.fpMantissa = function (f) {
            return (math.fpPureMantissa(f) | (1 << 23));
        };

        math.fpOneBits = 0x3F800000;

        // flipSign is a helper Macro to
        // invert the sign of i if flip equals -1,
        // if flip equals 0, it does nothing
        //export var flipSign = (i, flip) ((i^ flip) - flip)
        /** @ */
        math.flipSign = function (i, flip) {
            return ((flip == -1) ? -i : i);
        };

        /**
        * Число положительно?
        */
        math.isPositive = function (a) {
            return (a >= 0);
        };

        /**
        * Число отрицательно?
        */
        math.isNegative = function (a) {
            return (a < 0);
        };

        /**
        * Число одного знака?
        */
        math.sameSigns = function (a, b) {
            return (math.isNegative(a) == math.isNegative(b));
        };

        /**
        * Копировать знак
        */
        math.copySign = function (a, b) {
            return (math.isNegative(b) ? -math.abs(a) : math.abs(a));
        };

        /**
        * Растояние между а и b меньше epsilon?
        */
        math.deltaRangeTest = function (a, b, epsilon) {
            if (typeof epsilon === "undefined") { epsilon = 0.0000001; }
            return ((math.abs(a - b) < epsilon) ? true : false);
        };

        /**
        * Ограничивает value интервалом [low,high]
        */
        math.clamp = function (value, low, high) {
            return math.max(low, math.min(value, high));
        };

        /**
        * Ограничивает value интервалом [0,+Infinity]
        */
        math.clampPositive = function (value) {
            return (value < 0 ? 0 : value);
        };

        /**
        * Ограничивает value интервалом [-Infinity,0]
        */
        math.clampNegative = function (value) {
            return (value > 0 ? 0 : value);
        };

        /**
        * Ограничивает value интервалом [-1,1]
        */
        math.clampUnitSize = function (value) {
            return math.clamp(value, -1, 1);
        };
        math.sign = function (value) {
            return value >= 0 ? 1 : -1;
        };

        /**
        * Номер с права начиная от нуля, самого левого установленного бита
        */
        math.highestBitSet = function (value) {
            return value == 0 ? (null) : (value < 0 ? 31 : ((math.log(value) / math.LN2) << 0));
        };

        /**
        * Номер с права начиная от нуля, самого правого установленного бита
        */
        math.lowestBitSet = function (value) {
            var temp;

            if (value == 0) {
                return null;
            }

            for (temp = 0; temp <= 31; temp++) {
                if (value & (1 << temp)) {
                    return temp;
                }
            }

            return null;
        };

        /**
        * Является ли число степенью двойки
        */
        math.isPowerOfTwo = function (value) {
            return (value > 0 && math.highestBitSet(value) == math.lowestBitSet(value));
        };

        /**
        * Округление до числа наиболее близкого к степени двойки
        */
        math.nearestPowerOfTwo = function (value) {
            if (value <= 1) {
                return 1;
            }

            var highestBit = math.highestBitSet(value);
            var roundingTest = value & (1 << (highestBit - 1));

            if (roundingTest != 0) {
                ++highestBit;
            }

            return 1 << highestBit;
        };

        /**
        * Округление до следующего числа являющегося к степени двойки
        */
        math.ceilingPowerOfTwo = function (value) {
            if (value <= 1) {
                return 1;
            }

            var highestBit = math.highestBitSet(value);
            var mask = value & ((1 << highestBit) - 1);

            highestBit += mask && 1;

            return 1 << highestBit;
        };

        /**
        * Округление до предыдущего числа являющегося к степени двойки
        */
        math.floorPowerOfTwo = function (value) {
            if (value <= 1) {
                return 1;
            }

            var highestBit = math.highestBitSet(value);
            return 1 << highestBit;
        };

        /**
        * Деление по модулю
        */
        math.modulus = function (e, divisor) {
            return (e - math.floor(e / divisor) * divisor);
        };

        /**
        *
        */
        math.mod = math.modulus;

        /**
        * Вырвнивание числа на alignment вверх
        */
        math.alignUp = function (value, alignment) {
            var iRemainder = math.modulus(value, alignment);
            if (iRemainder == 0) {
                return (value);
            }
            return (value + (alignment - iRemainder));
        };

        /**
        * Вырвнивание числа на alignment вниз
        */
        math.alignDown = function (value, alignment) {
            var remainder = math.modulus(value, alignment);

            if (remainder == 0) {
                return (value);
            }

            return (value - remainder);
        };

        /**
        * пнвертировать число
        */
        math.inverse = function (a) {
            return 1. / a;
        };

        /**
        * log base 2
        */
        math.log2 = function (f) {
            return math.log(f) / math.LN2;
        };

        /**
        * Округлени числа с определенной точностью, где округляется до значащих чисел как 1/(2^precision)
        */
        math.trimFloat = function (f, precision) {
            return f;
        };

        /**
        * Перевод дробного в целое с усеением
        */
        math.realToInt32_chop = function (a) {
            return math.round(a);
        };

        /**
        * Перевод дробного в целое до меньшего
        */
        math.realToInt32_floor = function (a) {
            return math.floor(a);
        };

        /**
        * Перевод дробного в целое до большего
        */
        math.realToInt32_ceil = function (a) {
            return math.ceil(a);
        };

        /**
        * Наибольший общий делитель
        */
        math.nod = function (n, m) {
            var p = n % m;

            while (p != 0) {
                n = m;
                m = p;
                p = n % m;
            }

            return m;
        };

        /**
        * Наименьшее общее кратное
        */
        math.nok = function (n, m) {
            return math.abs(n * m) / math.nod(n, m);
        };

        /**
        * Greatest common devider
        */
        math.gcd = math.nod;

        /**
        * Least common multiple
        */
        math.lcm = math.nok;

        // var pMat3Stack = new Array(100);
        // var iMat3StackIndex = 0;
        math.isRealEqual = function (a, b, tolerance) {
            if (typeof tolerance === "undefined") { tolerance = 1.19209e-007; }
            if (math.abs(b - a) <= tolerance)
                return true;
            else
                return false;
        };

        function calcPOTtextureSize(nPixels) {
            var w, h;
            var n = nPixels;

            w = Math.ceil(Math.log(n) / Math.LN2 / 2.0);
            h = Math.ceil(Math.log(n / Math.pow(2, w)) / Math.LN2);
            w = Math.pow(2, w);
            h = Math.pow(2, h);
            n = w * h;

            return [w, h, n];
        }
        math.calcPOTtextureSize = calcPOTtextureSize;

        function floatToFloat3(value) {
            var data = value;
            var result = akra.math.Vec3.temp(0.);

            if (data == 0.) {
                var signedZeroTest = 1. / value;
                if (signedZeroTest < 0.) {
                    result.x = 128.;
                }
                return result;
            }

            if (data < 0.) {
                result.x = 128.;
                data = -data;
            }

            var power = 0.;
            var counter = 0.;

            while (counter < 64.) {
                counter += 1.;
                if (data >= 2.) {
                    data = data * 0.5;
                    power += 1.;
                    if (power == 63.) {
                        counter = 65.;
                    }
                } else {
                    if (data < 1.) {
                        data = data * 2.;
                        power -= 1.;
                        if (power == -62.) {
                            counter = 65.;
                        }
                    } else {
                        counter = 65.;
                    }
                }
            }

            if (power == -62. && data < 1.) {
                power = 0.;
            } else {
                power = power + 63.;
                data = data - 1.;
            }

            result.x += power;
            data *= 256.;
            result.y = math.floor(data);

            data -= math.floor(data);
            data *= 256.;

            result.z = math.floor(data);
            return result;
        }
        math.floatToFloat3 = floatToFloat3;
    })(akra.math || (akra.math = {}));
    var math = akra.math;
})(akra || (akra = {}));
//# sourceMappingURL=math.js.map
