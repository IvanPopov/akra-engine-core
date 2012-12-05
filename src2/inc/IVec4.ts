#ifndef IVEC4_TS
#define IVEC4_TS

module akra {

	IFACE(IVec2);
	IFACE(IVec3);

	export interface IVec4Constructor {
        ();
        (fValue: float);
        (v4fVec: IVec4);
        (pArray: float[]);
        (fValue: float, v3fVec: IVec3);
        (v2fVec1: IVec2, v2fVec2: IVec2);
        (v3fVec: IVec3, fValue: float);
        (fValue1: float, fValue2: float, v2fVec: IVec2);
        (fValue1: float, v2fVec: IVec2, fValue2: float);
        (v2fVec: IVec2 ,fValue1: float, fValue2: float);
        (fValue1: float, fValue2: float, fValue3: float, fValue4: float);
    }


	export interface IVec4 {
		x: float;
		y: float;
		z: float;
		w: float;

		set(): IVec4;
		set(fValue: float): IVec4;
		set(v4fVec: IVec4): IVec4;
		set(pArray: float[]): IVec4;
		set(fValue: float, v3fVec: IVec3): IVec4;
		set(v2fVec1: IVec2, v2fVec2: IVec2): IVec4;
		set(v3fVec: IVec3, fValue: float): IVec4;
		set(fValue1: float, fValue2: float, v2fVec: IVec2): IVec4;
		set(fValue1: float, v2fVec: IVec2, fValue2: float): IVec4;
		set(v2fVec: IVec2, fValue1: float, fValue2: float): IVec4;
		set(fValue1: float, fValue2: float, fValue3: float, fValue4: float): IVec4;

		clear(): IVec4;

		add(v4fVec: IVec4, v4fDestination?: IVec4): IVec4;
		subtract(v4fVec: IVec4, v4fDestination?: IVec4): IVec4;
		dot(v4fVec: IVec4): float;

		isEqual(v4fVec: IVec4, fEps?: float): bool;
		isClear(fEps?: float): bool;

		negate(v4fDestination?: IVec4): IVec4;
		scale(fScale: float, v4fDestination?: IVec4): IVec4;
		normalize(v4fDestination?: IVec4): IVec4;
		length(): float;
		lengthSquare(): float;

		direction(v4fVec: IVec4, v4fDestination?: IVec4): IVec4;

		mix(v4fVec: IVec4, fA: float, v4fDestination?: IVec4): IVec4;

		toString(): string;
	};
};

#endif