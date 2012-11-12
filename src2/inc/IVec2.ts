#ifndef IVEC2_TS
#define IVEC2_TS

module akra {
	export interface IVec2 {
		x: float;
		y: float;

		set(): IVec2;
		set(fValue: float): IVec2;
		set(v2fVec: IVec2): IVec2;
		set(pArray: float[]): IVec2;
		set(fValue1: float, fValue2: float): IVec2;

		clear(): IVec2;

		add(v2fVec: IVec2, v2fDestination?: IVec2): IVec2;
		subtract(v2fVec: IVec2, v2fDestination?: IVec2): IVec2;
		dot(v2fVec: IVec2): float;

		isEqual(v2fVec: IVec2, fEps?: float): bool;
		isClear(fEps?: float): bool;

		negate(v2fDestination?: IVec2): IVec2;
		scale(fScale: float, v2fDestination?: IVec2): IVec2;
		normalize(v2fDestination?: IVec2): IVec2;
		length(): float;
		lengthSquare(): float;
		

		direction(v2fVec: IVec2, v2fDestination?: IVec2): IVec2;

		mix(v2fVec: IVec2, fA: float, v2fDestination?: IVec2): IVec2;

		toString(): string;
	};
};

#endif