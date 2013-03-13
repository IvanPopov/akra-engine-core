#ifndef MATH_CONST_TS
#define MATH_CONST_TS

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
}

#endif
