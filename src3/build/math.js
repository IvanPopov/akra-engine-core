define(["require", "exports", "math/Vec2"], function(require, exports, __Vec2__) {
    var Vec2 = __Vec2__;
    exports.Vec2 = Vec2;
    
    
    
    
    

    //matrix 4x4 elements
    exports.__11 = 0;
    exports.__12 = 4;
    exports.__13 = 8;
    exports.__14 = 12;
    exports.__21 = 1;
    exports.__22 = 5;
    exports.__23 = 9;
    exports.__24 = 13;
    exports.__31 = 2;
    exports.__32 = 6;
    exports.__33 = 10;
    exports.__34 = 14;
    exports.__41 = 3;
    exports.__42 = 7;
    exports.__43 = 11;
    exports.__44 = 15;

    //matrix 3x3 elements
    exports.__a11 = 0;
    exports.__a12 = 3;
    exports.__a13 = 6;
    exports.__a21 = 1;
    exports.__a22 = 4;
    exports.__a23 = 7;
    exports.__a31 = 2;
    exports.__a32 = 5;
    exports.__a33 = 8;

    exports.E = Math.E;
    exports.LN2 = Math.LN2;
    exports.LOG2E = Math.LOG2E;
    exports.LOG10E = Math.LOG10E;
    exports.PI = Math.PI;
    exports.SQRT1_2 = Math.SQRT1_2;
    exports.SQRT2 = Math.SQRT2;
    exports.LN10 = Math.LN10;

    exports.POSITIVE_INFINITY = Number.POSITIVE_INFINITY;
    exports.NEGATIVE_INFINITY = Number.NEGATIVE_INFINITY;

    exports.FLOAT_PRECISION = (3.4e-8);
    exports.TWO_PI = (2.0 * exports.PI);
    exports.HALF_PI = (exports.PI / 2.0);
    exports.QUARTER_PI = (exports.PI / 4.0);
    exports.EIGHTH_PI = (exports.PI / 8.0);
    exports.PI_SQUARED = (9.86960440108935861883449099987615113531369940724079);
    exports.PI_INVERSE = (0.31830988618379067153776752674502872406891929148091);
    exports.PI_OVER_180 = (exports.PI / 180);
    exports.PI_DIV_180 = (180 / exports.PI);
    exports.NATURAL_LOGARITHM_BASE = (2.71828182845904523536028747135266249775724709369996);
    exports.EULERS_CONSTANT = (0.57721566490153286060651);
    exports.SQUARE_ROOT_2 = (1.41421356237309504880168872420969807856967187537695);
    exports.INVERSE_ROOT_2 = (0.707106781186547524400844362105198);
    exports.SQUARE_ROOT_3 = (1.73205080756887729352744634150587236694280525381038);
    exports.SQUARE_ROOT_5 = (2.23606797749978969640917366873127623544061835961153);
    exports.SQUARE_ROOT_10 = (3.16227766016837933199889354443271853371955513932522);
    exports.CUBE_ROOT_2 = (1.25992104989487316476721060727822835057025146470151);
    exports.CUBE_ROOT_3 = (1.44224957030740838232163831078010958839186925349935);
    exports.FOURTH_ROOT_2 = (1.18920711500272106671749997056047591529297209246382);
    exports.NATURAL_LOG_2 = (0.69314718055994530941723212145817656807550013436026);
    exports.NATURAL_LOG_3 = (1.09861228866810969139524523692252570464749055782275);
    exports.NATURAL_LOG_10 = (2.30258509299404568401799145468436420760110148862877);
    exports.NATURAL_LOG_PI = (1.14472988584940017414342735135305871164729481291531);
    exports.BASE_TEN_LOG_PI = (0.49714987269413385435126828829089887365167832438044);
    exports.NATURAL_LOGARITHM_BASE_INVERSE = (0.36787944117144232159552377016146086744581113103177);
    exports.NATURAL_LOGARITHM_BASE_SQUARED = (7.38905609893065022723042746057500781318031557055185);
    exports.GOLDEN_RATIO = ((exports.SQUARE_ROOT_5 + 1.0) / 2.0);
    exports.DEGREE_RATIO = (exports.PI_DIV_180);
    exports.RADIAN_RATIO = (exports.PI_OVER_180);
    exports.GRAVITY_CONSTANT = 9.81;

    exports.abs = Math.abs;
    exports.acos = Math.acos;
    exports.asin = Math.asin;
    exports.atan = Math.atan;
    exports.atan2 = Math.atan2;
    exports.exp = Math.exp;
    exports.min = Math.min;
    exports.random = Math.random;
    exports.sqrt = Math.sqrt;
    exports.log = Math.log;
    exports.round = Math.round;
    exports.floor = Math.floor;
    exports.ceil = Math.ceil;
    exports.sin = Math.sin;
    exports.cos = Math.cos;
    exports.tan = Math.tan;
    exports.pow = Math.pow;
    exports.max = Math.max;

    /*
    -----------------------------------------------------------------
    
    Floating Point Macros
    
    -----------------------------------------------------------------
    */
    // reinterpret a float as an int32
    /** @inline */
    exports.fpBits = function (f) {
        return exports.floor(f);
    };

    // reinterpret an int32 as a float
    /** @inline */
    exports.intBits = function (i) {
        return i;
    };

    // return 0 or -1 based on the sign of the float
    /** @inline */
    exports.fpSign = function (f) {
        return (f >> 31);
    };

    // extract the 8 bits of exponent as a signed integer
    // by masking out this bits, shifting down by 23,
    // and subtracting the bias value of 127
    /** @inline */
    exports.fpExponent = function (f) {
        return (((exports.fpBits(f) & 0x7fffffff) >> 23) - 127);
    };

    // return 0 or -1 based on the sign of the exponent
    /** @inline */
    exports.fpExponentSign = function (f) {
        return (exports.fpExponent(f) >> 31);
    };

    // get the 23 bits of mantissa without the implied bit
    /** @inline */
    exports.fpPureMantissa = function (f) {
        return ((exports.fpBits(f) & 0x7fffff));
    };

    // get the 23 bits of mantissa with the implied bit replaced
    /** @inline */
    exports.fpMantissa = function (f) {
        return (exports.fpPureMantissa(f) | (1 << 23));
    };

    exports.fpOneBits = 0x3F800000;

    // flipSign is a helper Macro to
    // invert the sign of i if flip equals -1,
    // if flip equals 0, it does nothing
    //export var flipSign = (i, flip) ((i^ flip) - flip)
    /** @inline */
    exports.flipSign = function (i, flip) {
        return ((flip == -1) ? -i : i);
    };

    /**
    * Число положительно?
    */
    exports.isPositive = function (a) {
        return (a >= 0);
    };

    /**
    * Число отрицательно?
    */
    exports.isNegative = function (a) {
        return (a < 0);
    };

    /**
    * Число одного знака?
    */
    exports.sameSigns = function (a, b) {
        return (exports.isNegative(a) == exports.isNegative(b));
    };

    /**
    * Копировать знак
    */
    exports.copySign = function (a, b) {
        return (exports.isNegative(b) ? -exports.abs(a) : exports.abs(a));
    };

    /**
    * Растояние между а и b меньше epsilon?
    */
    exports.deltaRangeTest = function (a, b, epsilon) {
        if (typeof epsilon === "undefined") { epsilon = 0.0000001; }
        return ((exports.abs(a - b) < epsilon) ? true : false);
    };

    /**
    * Ограничивает value интервалом [low,high]
    */
    exports.clamp = function (value, low, high) {
        return exports.max(low, exports.min(value, high));
    };

    /**
    * Ограничивает value интервалом [0,+Infinity]
    */
    exports.clampPositive = function (value) {
        return (value < 0 ? 0 : value);
    };

    /**
    * Ограничивает value интервалом [-Infinity,0]
    */
    exports.clampNegative = function (value) {
        return (value > 0 ? 0 : value);
    };

    /**
    * Ограничивает value интервалом [-1,1]
    */
    exports.clampUnitSize = function (value) {
        return exports.clamp(value, -1, 1);
    };

    exports.sign = function (value) {
        return value >= 0 ? 1 : -1;
    };

    /**
    * Номер с права начиная от нуля, самого левого установленного бита
    */
    exports.highestBitSet = function (value) {
        return value == 0 ? (null) : (value < 0 ? 31 : ((exports.log(value) / exports.LN2) << 0));
    };

    /**
    * Номер с права начиная от нуля, самого правого установленного бита
    */
    exports.lowestBitSet = function (value) {
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
    exports.isPowerOfTwo = function (value) {
        return (value > 0 && exports.highestBitSet(value) == exports.lowestBitSet(value));
    };

    /**
    * Округление до числа наиболее близкого к степени двойки
    */
    exports.nearestPowerOfTwo = function (value) {
        if (value <= 1) {
            return 1;
        }

        var highestBit = exports.highestBitSet(value);
        var roundingTest = value & (1 << (highestBit - 1));

        if (roundingTest != 0) {
            ++highestBit;
        }

        return 1 << highestBit;
    };

    /**
    * Округление до следующего числа являющегося к степени двойки
    */
    exports.ceilingPowerOfTwo = function (value) {
        if (value <= 1) {
            return 1;
        }

        var highestBit = exports.highestBitSet(value);
        var mask = value & ((1 << highestBit) - 1);
        highestBit += mask && 1;
        return 1 << highestBit;
    };

    /**
    * Округление до предыдущего числа являющегося к степени двойки
    */
    exports.floorPowerOfTwo = function (value) {
        if (value <= 1) {
            return 1;
        }

        var highestBit = exports.highestBitSet(value);

        return 1 << highestBit;
    };

    /**
    * Деление по модулю
    */
    exports.modulus = function (e, divisor) {
        return (e - exports.floor(e / divisor) * divisor);
    };

    /**
    *
    */
    exports.mod = exports.modulus;

    /**
    * Вырвнивание числа на alignment вверх
    */
    exports.alignUp = function (value, alignment) {
        var iRemainder = exports.modulus(value, alignment);
        if (iRemainder == 0) {
            return (value);
        }

        return (value + (alignment - iRemainder));
    };

    /**
    * Вырвнивание числа на alignment вниз
    */
    exports.alignDown = function (value, alignment) {
        var remainder = exports.modulus(value, alignment);
        if (remainder == 0) {
            return (value);
        }

        return (value - remainder);
    };

    /**
    * пнвертировать число
    */
    exports.inverse = function (a) {
        return 1. / a;
    };

    /**
    * log base 2
    */
    exports.log2 = function (f) {
        return exports.log(f) / exports.LN2;
    };

    /**
    * Округлени числа с определенной точностью, где округляется до значащих чисел как 1/(2^precision)
    */
    exports.trimFloat = function (f, precision) {
        return f;
    };

    /**
    * Перевод дробного в целое с усеением
    */
    exports.realToInt32_chop = function (a) {
        return exports.round(a);
    };

    /**
    * Перевод дробного в целое до меньшего
    */
    exports.realToInt32_floor = function (a) {
        return exports.floor(a);
    };

    /**
    * Перевод дробного в целое до большего
    */
    exports.realToInt32_ceil = function (a) {
        return exports.ceil(a);
    };

    /**
    * Наибольший общий делитель
    */
    exports.nod = function (n, m) {
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
    exports.nok = function (n, m) {
        return exports.abs(n * m) / exports.nod(n, m);
    };

    /**
    * Greatest common devider
    */
    exports.gcd = exports.nod;

    /**
    * Least common multiple
    */
    exports.lcm = exports.nok;

    // var pMat3Stack = new Array(100);
    // var iMat3StackIndex = 0;
    exports.isRealEqual = function (a, b, tolerance) {
        if (typeof tolerance === "undefined") { tolerance = 1.19209e-007; }
        if (exports.abs(b - a) <= tolerance)
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
    exports.calcPOTtextureSize = calcPOTtextureSize;

    function floatToFloat3(value) {
        var data = value;
        var result = vec3(0.);

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

        result.y = exports.floor(data);

        data -= exports.floor(data);
        data *= 256.;

        result.z = exports.floor(data);

        return result;
    }
    exports.floatToFloat3 = floatToFloat3;
});
//# sourceMappingURL=math.js.map
