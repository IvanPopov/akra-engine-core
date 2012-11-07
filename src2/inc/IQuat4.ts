#ifndef IQUAT4_TS
#define IQUAT4_TS

module akra {
	export interface IQuat4 {
		x: float;
		y: float;
		z: float;
		w: float;

		set(x?, y?, z?, w?): IQuat4;
		toMat4(m4fDestination?: IMat4): IMat4;
		multiplyVec3(v3fVec: IVec3, v3fDestionation?: IVec3): IVec3;
		multiply(q4fQuat: IQuat4, q4fDestination?: IQuat4): IQuat4;
	};
};

#endif