#ifndef IVEC4_TS
#define IVEC4_TS

module akra {
	export interface IVec4 {
		x: float;
		y: float;
		z: float;
		w: float;

		set(x?, y?, z?, w?): IVec4;
	};
};

#endif