#ifndef IVEC3_TS
#define IVEC3_TS

module akra {
	export interface IVec3 {
		x: float;
		y: float;
		z: float;

		set(x?, y?, z?): IVec3;
		add(v3fVec: IVec3, v3fDest?: IVec3): IVec3;
		scale(x?, y?, z?): IVec3;
	};
};

#endif