#ifndef MATH_TS
#define MATH_TS

#include "Vec2.ts"
#include "Vec3.ts"
#include "Vec4.ts"

#include "Mat2.ts"
#include "Mat3.ts"
#include "Mat4.ts"

#include "Quat4.ts"

module akra.math {

	//
	// BASIC MATH AND UNIT CONVERSION CONSTANTS
	//
	
	export var E: float 								= <float>Math.E;
	export var LN2: float 								= <float>Math.LN2;
	export var LOG2E: float 							= <float>Math.LOG2E;
	export var LOG10E: float 							= <float>Math.LOG10E;
	export var PI: float 								= <float>Math.PI;
	export var SQRT1_2: float 							= <float>Math.SQRT1_2;
	export var SQRT2: float 							= <float>Math.SQRT2;
	export var LN10: float 								= <float>Math.LN10;

	export var POSITIVE_INFINITY: float                 = <float>Number.POSITIVE_INFINITY;
	export var NEGATIVE_INFINITY: float                 = <float>Number.NEGATIVE_INFINITY;


	export var FLOAT_PRECISION: float					= <float>(3.4e-8);
	export var TWO_PI: float							= <float>(2.0*PI);
	export var HALF_PI: float							= <float>(PI/2.0);
	export var QUARTER_PI: float						= <float>(PI/4.0);
	export var EIGHTH_PI: float							= <float>(PI/8.0);
	export var PI_SQUARED: float						= <float>(9.86960440108935861883449099987615113531369940724079);
	export var PI_INVERSE: float						= <float>(0.31830988618379067153776752674502872406891929148091);
	export var PI_OVER_180: float						= <float>(PI/180);
	export var PI_DIV_180: float						= <float>(180/PI);
	export var NATURAL_LOGARITHM_BASE: float			= <float>(2.71828182845904523536028747135266249775724709369996);
	export var EULERS_CONSTANT: float					= <float>(0.57721566490153286060651);
	export var SQUARE_ROOT_2: float						= <float>(1.41421356237309504880168872420969807856967187537695);
	export var INVERSE_ROOT_2: float					= <float>(0.707106781186547524400844362105198);
	export var SQUARE_ROOT_3: float						= <float>(1.73205080756887729352744634150587236694280525381038);
	export var SQUARE_ROOT_5: float						= <float>(2.23606797749978969640917366873127623544061835961153);
	export var SQUARE_ROOT_10: float					= <float>(3.16227766016837933199889354443271853371955513932522);
	export var CUBE_ROOT_2: float						= <float>(1.25992104989487316476721060727822835057025146470151);
	export var CUBE_ROOT_3: float						= <float>(1.44224957030740838232163831078010958839186925349935);
	export var FOURTH_ROOT_2: float						= <float>(1.18920711500272106671749997056047591529297209246382);
	export var NATURAL_LOG_2: float						= <float>(0.69314718055994530941723212145817656807550013436026);
	export var NATURAL_LOG_3: float						= <float>(1.09861228866810969139524523692252570464749055782275);
	export var NATURAL_LOG_10: float					= <float>(2.30258509299404568401799145468436420760110148862877);
	export var NATURAL_LOG_PI: float					= <float>(1.14472988584940017414342735135305871164729481291531);
	export var BASE_TEN_LOG_PI: float					= <float>(0.49714987269413385435126828829089887365167832438044);
	export var NATURAL_LOGARITHM_BASE_INVERSE: float	= <float>(0.36787944117144232159552377016146086744581113103177);
	export var NATURAL_LOGARITHM_BASE_SQUARED: float	= <float>(7.38905609893065022723042746057500781318031557055185);
	export var GOLDEN_RATIO: float						= <float>((SQUARE_ROOT_5 + 1.0) / 2.0);
	export var DEGREE_RATIO: float						= <float>(PI_DIV_180);
	export var RADIAN_RATIO: float						= <float>(PI_OVER_180);
	export var GRAVITY_CONSTANT: float 					= 9.81;

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

    export function vec2(): IVec2;
    export function vec2(fValue: float): IVec2;
    export function vec2(v2fVec: IVec2): IVec2;
    export function vec2(pArray: float[]): IVec2;
    export function vec2(fValue1: float, fValue2: float): IVec2;
    export function vec2(fValue1?, fValue2?): IVec2{
        var nArgumentsLength: uint = arguments.length;
        var v2fVec: IVec2 = Vec2.stack[Vec2.stackPosition ++];

        if(Vec2.stackPosition == Vec2.stackSize){
            Vec2.stackPosition = 0;
        }

        switch(nArgumentsLength){
            case 1:
                v2fVec.set(arguments[0]);
                break;
            case 2:
                v2fVec.set(arguments[0], arguments[1]);
                break;
            default:
                v2fVec.x = v2fVec.y = 0.;
                break;
        }

        return v2fVec;
    };

    export function vec3(): IVec3;
    export function vec3(fValue: float): IVec3;
    export function vec3(v3fVec: IVec3): IVec3;
    export function vec3(pArray: float[]): IVec3;
    export function vec3(fValue: float, v2fVec: IVec2): IVec3;
    export function vec3(v2fVec: IVec2, fValue: float): IVec3;
    export function vec3(fValue1: float, fValue2: float, fValue3: float): IVec3;
    export function vec3(fValue1?, fValue2?, fValue3?): IVec3{
        var nArgumentsLength: uint = arguments.length;
        var v3fVec: IVec3 = Vec3.stack[Vec3.stackPosition ++];

        if(Vec3.stackPosition == Vec3.stackSize){
            Vec3.stackPosition = 0;
        }

        switch(nArgumentsLength){
            case 1:
                v3fVec.set(arguments[0]);
                break;
            case 2:
                v3fVec.set(arguments[0], arguments[1]);
                break;
            case 3: 
                v3fVec.set(arguments[0], arguments[1], arguments[2]);
                break;
            default:
                v3fVec.x = v3fVec.y = v3fVec.z = 0.;
                break;
        }

        return v3fVec;
    };

    export function vec4(): IVec4;
    export function vec4(fValue: float): IVec4;
    export function vec4(v4fVec: IVec4): IVec4;
    export function vec4(pArray: float[]): IVec4;
    export function vec4(fValue: float, v3fVec: IVec3): IVec4;
    export function vec4(v2fVec1: IVec2, v2fVec2: IVec2): IVec4;
    export function vec4(v3fVec: IVec3, fValue: float): IVec4;
    export function vec4(fValue1: float, fValue2: float, v2fVec: IVec2): IVec4;
    export function vec4(fValue1: float, v2fVec: IVec2, fValue2: float): IVec4;
    export function vec4(v2fVec: IVec2 ,fValue1: float, fValue2: float): IVec4;
    export function vec4(fValue1: float, fValue2: float, fValue3: float, fValue4: float): IVec4;
    export function vec4(fValue1?, fValue2?, fValue3?, fValue4?): IVec4{
        var nArgumentsLength: uint = arguments.length;
        var v4fVec: IVec4 = Vec4.stack[Vec4.stackPosition ++];

        if(Vec4.stackPosition == Vec4.stackSize){
            Vec4.stackPosition = 0;
        }

        switch(nArgumentsLength){
            case 1:
                v4fVec.set(arguments[0]);
                break;
            case 2:
                v4fVec.set(arguments[0],arguments[1]);
                break;
            case 3:
                v4fVec.set(arguments[0],arguments[1], arguments[2]);
                break;
            case 4:
                v4fVec.set(arguments[0],arguments[1], arguments[2], arguments[3]);
                break;
            default: 
                v4fVec.x = v4fVec.y = v4fVec.z = v4fVec.w = 0.;
                break;
        }

        return v4fVec;
    };

    export function quat4(): IQuat4;
	export function quat4(q4fQuat: IQuat4): IQuat4;
	export function quat4(pArray: float[]): IQuat4;
	export function quat4(fValue: float, fW: float): IQuat4;
	export function quat4(v3fValue: IVec3, fW: float): IQuat4;
	export function quat4(fX: float, fY: float, fZ: float, fW: float): IQuat4;
	export function quat4(fX?, fY?, fZ?, fW?): IQuat4{
		var nArgumentsLength: uint = arguments.length;
		var q4fQuat: IQuat4 = Quat4.stack[Quat4.stackPosition ++];

		if(Quat4.stackPosition == Quat4.stackSize){
            Quat4.stackPosition = 0;
		}

		switch(nArgumentsLength){
			case 1:
				q4fQuat.set(arguments[0]);
				break;
			case 2:
				q4fQuat.set(arguments[0], arguments[1]);
				break;
			case 4:
				q4fQuat.set(arguments[0], arguments[1], arguments[2], arguments[3]);
				break;
			default:
				q4fQuat.x = q4fQuat.y = q4fQuat.z = 0.;
				q4fQuat.w = 1.;
				break;
		}

		return q4fQuat;
	};

	export function mat3(): IMat3;
	export function mat3(fValue: float): IMat3;
	export function mat3(v3fVec: IVec3): IMat3;
	export function mat3(m3fMat: IMat3): IMat3;
	export function mat3(m4fMat: IMat4): IMat3;
	export function mat3(pArray: float[]): IMat3;
	export function mat3(fValue1: float, fValue2: float, fValue3: float): IMat3;
	export function mat3(v3fVec1: IVec3, v3fVec2: IVec3, v3fVec3: IVec3): IMat3;
	export function mat3(pArray1: float[], pArray2: float[], pArray3: float[]): IMat3;
	export function mat3(fValue1: float, fValue2: float, fValue3: float,
				fValue4: float, fValue5: float, fValue6: float,
				fValue7: float, fValue8: float, fValue9: float): IMat3;
	export function mat3(fValue1?, fValue2?, fValue3?,
				fValue4?, fValue5?, fValue6?,
				fValue7?, fValue8?, fValue9?): IMat3{

		var nArgumentsLength: uint = arguments.length;
		var m3fMat: IMat3 = Mat3.stack[Mat3.stackPosition ++];

        if(Mat3.stackPosition == Mat3.stackSize){
            Mat3.stackPosition = 0;
		}

		switch(nArgumentsLength){
			case 1:
				m3fMat.set(arguments[0]);
				break;
			case 3:
				m3fMat.set(arguments[0], arguments[1], arguments[2]);
				break;
			case 9:
				m3fMat.set(arguments[0], arguments[1], arguments[2],
						 arguments[3], arguments[4], arguments[5],
						 arguments[6], arguments[7], arguments[8]);
				break;
			default:
				m3fMat.set(0.);
				break;
		}

		return m3fMat;
	};

	export function mat4(): IMat4;
	export function mat4(fValue: float): IMat4;
	export function mat4(v4fVec: IVec4): IMat4;
	export function mat4(m3fMat: IMat3, v3fTranslation?: IVec3): IMat4;
	export function mat4(m4fMat: IMat4): IMat4;
	export function mat4(pArray: float[]): IMat4;
	export function mat4(pArray: Float32Array, bFlag: bool): IMat4;
	export function mat4(fValue1: float, fValue2: float,
			fValue3: float, fValue4: float): IMat4;
	export function mat4(v4fVec1: IVec4, v4fVec2: IVec4,
			v4fVec3: IVec4, v4fVec4: IVec4): IMat4;
	export function mat4(pArray1: float[], pArray2: float[],
			pArray3: float[], pArray4: float[]): IMat4;
	export function mat4(fValue1: float, fValue2: float, fValue3: float, fValue4: float,
			fValue5: float, fValue6: float, fValue7: float, fValue8: float,
			fValue9: float, fValue10: float, fValue11: float, fValue12: float,
			fValue13: float, fValue14: float, fValue15: float, fValue16: float): IMat4;
	export function mat4(fValue1?, fValue2?, fValue3?, fValue4?,
				fValue5?, fValue6?, fValue7?, fValue8?,
				fValue9?, fValue10?, fValue11?, fValue12?,
				fValue13?, fValue14?, fValue15?, fValue16?): IMat4{

		var nArgumentsLength: uint = arguments.length;
		var m4fMat: IMat4 = Mat4.stack[Mat4.stackPosition ++];

        if(Mat4.stackPosition == Mat4.stackSize){
            Mat4.stackPosition = 0;
		}

		if(nArgumentsLength === 2){
			if(isBoolean(arguments[1])){
				if(arguments[1]){
					m4fMat.data = arguments[0];
				}
				else{
					m4fMat.set(arguments[0]);			
				}
			}
			else{
				m4fMat.set(arguments[0], arguments[1]);
			}
		}
		else{
			switch(nArgumentsLength){
				case 1:
					if(arguments[0] instanceof Mat3){
						m4fMat.set(arguments[0],vec3(0.));	
					}
					else{
						m4fMat.set(arguments[0]);	
					}	
					break;
				case 4:
					m4fMat.set(arguments[0],arguments[1],arguments[2],arguments[3]);
					break;
				case 16:
					m4fMat.set(arguments[0], arguments[1], arguments[2], arguments[3],
						 arguments[4], arguments[5], arguments[6], arguments[7],
						 arguments[8], arguments[9], arguments[10], arguments[11],
						 arguments[12], arguments[13], arguments[14], arguments[15]);
					 break;
				 default:
				 	break;	
			}
		}

		return m4fMat;
	};

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

module akra {
	export var Vec2 = math.Vec2;
	export var Vec3 = math.Vec3;
	export var Vec4 = math.Vec4;
#ifdef MAT2_TS	
	export var Mat2 = math.Mat2;
#endif	
	export var Mat3 = math.Mat3;
	export var Mat4 = math.Mat4;
	export var Quat4 = math.Quat4;

	export var vec2 = math.vec2;
	export var vec3 = math.vec3;
	export var vec4 = math.vec4;
	export var quat4 = math.quat4;
	export var mat3 = math.mat3;
	export var mat4 = math.mat4;
}

#endif