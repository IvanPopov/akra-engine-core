export import Vec2 = require("math/Vec2");
export import Vec3 = require("math/Vec3");
export import Vec4 = require("math/Vec4");
export import Mat3 = require("math/Mat3");
export import Mat4 = require("math/Mat4");
export import Quat4 = require("math/Quat4");





//matrix 4x4 elements

export var __11 = 0;
export var __12 = 4;
export var __13 = 8;
export var __14 = 12;
export var __21 = 1;
export var __22 = 5;
export var __23 = 9;
export var __24 = 13;
export var __31 = 2;
export var __32 = 6;
export var __33 = 10;
export var __34 = 14;
export var __41 = 3;
export var __42 = 7;
export var __43 = 11;
export var __44 = 15;



//matrix 3x3 elements

export var __a11 = 0;
export var __a12 = 3;
export var __a13 = 6;
export var __a21 = 1;
export var __a22 = 4;
export var __a23 = 7;
export var __a31 = 2;
export var __a32 = 5;
export var __a33 = 8;





export var E: float = <float>Math.E;
export var LN2: float = <float>Math.LN2;
export var LOG2E: float = <float>Math.LOG2E;
export var LOG10E: float = <float>Math.LOG10E;
export var PI: float = <float>Math.PI;
export var SQRT1_2: float = <float>Math.SQRT1_2;
export var SQRT2: float = <float>Math.SQRT2;
export var LN10: float = <float>Math.LN10;


export var POSITIVE_INFINITY: float = <float>Number.POSITIVE_INFINITY;
export var NEGATIVE_INFINITY: float = <float>Number.NEGATIVE_INFINITY;


export var FLOAT_PRECISION: float = <float>(3.4e-8);
export var TWO_PI: float = <float>(2.0 * PI);
export var HALF_PI: float = <float>(PI / 2.0);
export var QUARTER_PI: float = <float>(PI / 4.0);
export var EIGHTH_PI: float = <float>(PI / 8.0);
export var PI_SQUARED: float = <float>(9.86960440108935861883449099987615113531369940724079);
export var PI_INVERSE: float = <float>(0.31830988618379067153776752674502872406891929148091);
export var PI_OVER_180: float = <float>(PI / 180);
export var PI_DIV_180: float = <float>(180 / PI);
export var NATURAL_LOGARITHM_BASE: float = <float>(2.71828182845904523536028747135266249775724709369996);
export var EULERS_CONSTANT: float = <float>(0.57721566490153286060651);
export var SQUARE_ROOT_2: float = <float>(1.41421356237309504880168872420969807856967187537695);
export var INVERSE_ROOT_2: float = <float>(0.707106781186547524400844362105198);
export var SQUARE_ROOT_3: float = <float>(1.73205080756887729352744634150587236694280525381038);
export var SQUARE_ROOT_5: float = <float>(2.23606797749978969640917366873127623544061835961153);
export var SQUARE_ROOT_10: float = <float>(3.16227766016837933199889354443271853371955513932522);
export var CUBE_ROOT_2: float = <float>(1.25992104989487316476721060727822835057025146470151);
export var CUBE_ROOT_3: float = <float>(1.44224957030740838232163831078010958839186925349935);
export var FOURTH_ROOT_2: float = <float>(1.18920711500272106671749997056047591529297209246382);
export var NATURAL_LOG_2: float = <float>(0.69314718055994530941723212145817656807550013436026);
export var NATURAL_LOG_3: float = <float>(1.09861228866810969139524523692252570464749055782275);
export var NATURAL_LOG_10: float = <float>(2.30258509299404568401799145468436420760110148862877);
export var NATURAL_LOG_PI: float = <float>(1.14472988584940017414342735135305871164729481291531);
export var BASE_TEN_LOG_PI: float = <float>(0.49714987269413385435126828829089887365167832438044);
export var NATURAL_LOGARITHM_BASE_INVERSE: float = <float>(0.36787944117144232159552377016146086744581113103177);
export var NATURAL_LOGARITHM_BASE_SQUARED: float = <float>(7.38905609893065022723042746057500781318031557055185);
export var GOLDEN_RATIO: float = <float>((SQUARE_ROOT_5 + 1.0) / 2.0);
export var DEGREE_RATIO: float = <float>(PI_DIV_180);
export var RADIAN_RATIO: float = <float>(PI_OVER_180);
export var GRAVITY_CONSTANT: float = 9.81;



export var abs = Math.abs;
export var acos = Math.acos;
export var asin = Math.asin;
export var atan = Math.atan;
export var atan2 = Math.atan2;
export var exp = Math.exp;
export var min = Math.min;
export var random = Math.random;
export var sqrt = Math.sqrt;
export var log = Math.log;
export var round = Math.round;
export var floor = Math.floor;
export var ceil = Math.ceil;
export var sin = Math.sin;
export var cos = Math.cos;
export var tan = Math.tan;
export var pow = Math.pow;
export var max = Math.max;


/*  
-----------------------------------------------------------------
    Floating Point Macros
-----------------------------------------------------------------
*/
// reinterpret a float as an int32
/** @inline */
export var fpBits = (f: float): int => floor(f);

// reinterpret an int32 as a float
/** @inline */
export var intBits = (i: int): float => <float> i;

// return 0 or -1 based on the sign of the float
/** @inline */
export var fpSign = (f: int) => (f >> 31);

// extract the 8 bits of exponent as a signed integer
// by masking out this bits, shifting down by 23,
// and subtracting the bias value of 127
/** @inline */
export var fpExponent = (f: float): int => (((fpBits(f) & 0x7fffffff) >> 23) - 127);



// return 0 or -1 based on the sign of the exponent
/** @inline */
export var fpExponentSign = (f: float): int => (fpExponent(f) >> 31);



// get the 23 bits of mantissa without the implied bit
/** @inline */
export var fpPureMantissa = (f: float): int => ((fpBits(f) & 0x7fffff));



// get the 23 bits of mantissa with the implied bit replaced
/** @inline */
export var fpMantissa = (f: float): int => (fpPureMantissa(f) | (1 << 23));


export var fpOneBits = 0x3F800000;

// flipSign is a helper Macro to
// invert the sign of i if flip equals -1, 
// if flip equals 0, it does nothing
//export var flipSign = (i, flip) ((i^ flip) - flip)
/** @inline */
export var flipSign = (i: number, flip: number): int => ((flip == -1) ? -i : i);



/**
 * Число положительно?
 */
export var isPositive = (a: number) => (a >= 0);

/**
 * Число отрицательно?
 */
export var isNegative = (a: number) => (a < 0);

/**
 * Число одного знака?
 */
export var sameSigns = (a: number, b: number): boolean => (isNegative(a) == isNegative(b));

/**
 * Копировать знак
 */
export var copySign = (a: number, b: number): number => (isNegative(b) ? -abs(a) : abs(a));

/**
 * Растояние между а и b меньше epsilon?
 */
export var deltaRangeTest = (a: number, b: number, epsilon: number = 0.0000001): boolean => ((abs(a - b) < epsilon) ? true : false);



/**
 * Ограничивает value интервалом [low,high]
 */
export var clamp = (value: number, low: number, high: number): number => max(low, min(value, high));

/**
 * Ограничивает value интервалом [0,+Infinity]
 */
export var clampPositive = (value: number): number => (value < 0 ? 0 : value);

/**
 * Ограничивает value интервалом [-Infinity,0]
 */
export var clampNegative = (value: number): number => (value > 0 ? 0 : value);

/**
 * Ограничивает value интервалом [-1,1]
 */

export var clampUnitSize = (value: number): number => clamp(value, -1, 1);
export var sign = (value: number): number => value >= 0 ? 1 : -1;



/**
 * Номер с права начиная от нуля, самого левого установленного бита
 */
export var highestBitSet = (value: number): uint => value == 0 ? (null) : (value < 0 ? 31 : ((log(value) / LN2) << 0));
    /**
     * Номер с права начиная от нуля, самого правого установленного бита
     */
    export var lowestBitSet = (value: uint): uint => {

    var temp: uint;

    if (value == 0) {
        return null;
    }

    for (temp = 0; temp <= 31; temp++) {
        if (value & (1 << temp)) {
            return temp;
        }
    }

    return null;
}



/**
 * Является ли число степенью двойки
 */
export var isPowerOfTwo = (value: uint): boolean => (value > 0 && highestBitSet(value) == lowestBitSet(value));


/**
 * Округление до числа наиболее близкого к степени двойки
 */
export var nearestPowerOfTwo = (value: uint): uint => {
    if (value <= 1) {
        return 1;
    }


    var highestBit: uint = highestBitSet(value);
    var roundingTest: uint = value & (1 << (highestBit - 1));


    if (roundingTest != 0) {
        ++highestBit;
    }

    return 1 << highestBit;
}



/**
 * Округление до следующего числа являющегося к степени двойки
 */

export var ceilingPowerOfTwo = (value: uint): uint => {
    if (value <= 1) {
        return 1;
    }

    var highestBit: int = highestBitSet(value);
    var mask: int = value & ((1 << highestBit) - 1);

    highestBit += mask && 1;

    return 1 << highestBit;
}





/**
 * Округление до предыдущего числа являющегося к степени двойки
 */
export var floorPowerOfTwo = (value: uint): uint => {
    if (value <= 1) {
        return 1;
    }


    var highestBit: int = highestBitSet(value);
    return 1 << highestBit;
}


/**
 * Деление по модулю
 */
export var modulus = (e: int, divisor: int): int => (e - floor(e / divisor) * divisor);



/**
 * 
 */
export var mod = modulus;


/**
 * Вырвнивание числа на alignment вверх
 */

export var alignUp = (value: int, alignment: int): int => {
    var iRemainder: int = modulus(value, alignment);
    if (iRemainder == 0) {
        return (value);

    }
    return (value + (alignment - iRemainder));

}





/**
 * Вырвнивание числа на alignment вниз
 */

export var alignDown = (value: int, alignment: int): int => {
    var remainder: int = modulus(value, alignment);

    if (remainder == 0) {
        return (value);
    }

    return (value - remainder);

}



/**
 * пнвертировать число
 */
export var inverse = (a: number): number => 1. / a;



/**
 * log base 2
 */
export var log2 = (f: float): float => log(f) / LN2;

/**
 * Округлени числа с определенной точностью, где округляется до значащих чисел как 1/(2^precision)
 */
export var trimFloat = (f: float, precision: float): float => f;

/**
 * Перевод дробного в целое с усеением
 */

export var realToInt32_chop = (a: float): int => round(a);

/**
 * Перевод дробного в целое до меньшего
 */

export var realToInt32_floor = (a: float): int => floor(a);

/**
 * Перевод дробного в целое до большего
 */

export var realToInt32_ceil = (a: float): int => ceil(a);

    /**
     * Наибольший общий делитель
     */

    export var nod = (n: int, m: int): int => {
    var p: int = n % m;


    while (p != 0) {
        n = m
        m = p
         p = n % m
     }

    return m;

}



    /**
    * Наименьшее общее кратное
    */

export var nok = (n: int, m: int): int => abs(n * m) / nod(n, m);

/**
 * Greatest common devider
 */

export var gcd = nod;

/**
 * Least common multiple
 */

export var lcm = nok;



    // var pMat3Stack = new Array(100);
    // var iMat3StackIndex = 0;



export var isRealEqual = (a: float, b: float, tolerance: float = 1.19209e-007): boolean => {
    if (abs(b - a) <= tolerance)
        return true;
    else
        return false;
}



export function calcPOTtextureSize(nPixels: uint): uint[] {
    var w: uint, h: uint;
    var n: uint = nPixels;


    w = Math.ceil(Math.log(n) / Math.LN2 / 2.0);
    h = Math.ceil(Math.log(n / Math.pow(2, w)) / Math.LN2);
    w = Math.pow(2, w);
    h = Math.pow(2, h);
    n = w * h;

    return [w, h, n];

}



export function floatToFloat3(value: float): AIVec3 {

    var data: float = value;
    var result: AIVec3 = vec3(0.);

    if (data == 0.) {
        var signedZeroTest: float = 1. / value;
        if (signedZeroTest < 0.) {
            result.x = 128.;
        }
        return result;
    }

    if (data < 0.) {
        result.x = 128.;
        data = -data;
    }



    var power: float = 0.;
    var counter: float = 0.;

    while (counter < 64.) {
        counter += 1.;
        if (data >= 2.) {
            data = data * 0.5;
            power += 1.;
            if (power == 63.) {
                counter = 65.;
            }
        }
        else {
            if (data < 1.) {
                data = data * 2.;
                power -= 1.;
                if (power == -62.) {
                    counter = 65.;
                }
            }
            else {
                counter = 65.;
            }
        }
    }


    if (power == -62. && data < 1.) {
        power = 0.;
    }
    else {
        power = power + 63.;
        data = data - 1.;
    }

    result.x += power;
    data *= 256.;
    result.y = floor(data);

    data -= floor(data);
    data *= 256.;

    result.z = floor(data);
    return result;
}
