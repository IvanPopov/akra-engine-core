#ifndef MATH_GLOBAL_TS
#define MATH_GLOBAL_TS

#include "const.ts"

module akra.math {
	//
	// MATH AND UNIT CONVERSION FUNCTION PROTOTYPES
	//

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
	export var fpExponentSign = (f: float): int => (fpExponent(f) >> 31) ;

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
	 * Абсолютное значение числа
	 */
	export var absoluteValue = abs;
	/**
	 * Pow
	 */ 
	export var raiseToPower = pow;
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
	export var sameSigns = (a: number, b: number): bool => (isNegative(a) == isNegative(b));
	/**
	 * Копировать знак
	 */
	export var copySign = (a: number, b: number): number => (isNegative(b) ? -absoluteValue(a) : absoluteValue(a));
	/**
	 * Растояние между а и b меньше epsilon?
	 */
	export var deltaRangeTest = (a: number, b: number, epsilon: number = 0.0000001): bool => ((absoluteValue(a - b) < epsilon) ? true : false);
	
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
	
	export var sign = (value: number): number => value >= 0? 1: -1;
	
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
	export var isPowerOfTwo = (value: uint): bool => (value > 0 && highestBitSet(value) == lowestBitSet(value));
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
	        ++ highestBit;
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
	        return(value);
	    }

	    return(value + (alignment - iRemainder));
	}
	

	/**
	 * Вырвнивание числа на alignment вниз
	 */
	export var alignDown = (value: int, alignment: int): int => {
		var remainder: int = modulus(value, alignment);
	    if (remainder == 0) {
	        return(value);
	    }

	    return(value - remainder);
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
	export var nok = (n: int, m: int): int => abs(n * m) / nod(n , m);
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

	export var isRealEqual = (a: float, b: float, tolerance: float = 1.19209e-007): bool => {
        if (math.abs(b - a) <= tolerance)
            return true;
        else
            return false;
    }

    export function calcPOTtextureSize (nPixels: uint): uint[] {
	    var w: uint, h: uint;
	    var n: uint = nPixels;


	    w = Math.ceil(Math.log(n) / Math.LN2 / 2.0);
	    h = Math.ceil(Math.log(n / Math.pow(2, w)) / Math.LN2);
	    w = Math.pow(2, w);
	    h = Math.pow(2, h);
	    n = w * h;
	    return [w, h, n];
	}
}

#endif
