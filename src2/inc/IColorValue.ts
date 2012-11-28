#ifndef ICOLORVALUE_TS
#define ICOLORVALUE_TS

module akra {

	export interface IColorIValue {
		r: uint;
		g: uint;
		b: uint;
		a: uint;
	}

	export interface IColorValue {
		r: float;
		g: float;
		b: float;
		a: float;
	}
}

#endif