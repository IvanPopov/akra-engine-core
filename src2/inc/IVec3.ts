#ifndef IVEC3_TS
#define IVEC3_TS

module akra {

	IFACE(IVec2);
	IFACE(IMat4);

	export interface IVec3Constructor {
        ();
        (fValue: float);
        (v3fVec: IVec3);
        (pArray: float[]);
        (fValue: float, v2fVec: IVec2);
        (v2fVec: IVec2, fValue: float);
        (fValue1: float, fValue2: float, fValue3: float);
    }

	export interface IVec3 {
		x: float;
		y: float;
		z: float;

		set(): IVec3;
		set(fValue: float): IVec3;
		set(v3fVec: IVec3): IVec3;
		set(pArray: float[]): IVec3;
		set(fValue: float, v2fVec: IVec2): IVec3;
		set(v2fVec: IVec2, fValue: float): IVec3;
		set(fValue1: float, fValue2: float, fValue3: float): IVec3;

		clear(): IVec3;

		add(v3fVec: IVec3, v3fDestination?: IVec3): IVec3;
		subtract(v3fVec: IVec3, v3fDestination?: IVec3): IVec3;
		dot(v3fVec: IVec3): float;
		cross(v3fVec: IVec3, v3fDestination?: IVec3): IVec3;

		isEqual(v3fVec: IVec3, fEps?: float): bool;
		isClear(fEps?: float): bool;

		negate(v3fDestination?: IVec3): IVec3;
		scale(fScale: float, v3fDestination?: IVec3): IVec3;
		scale(v3fScale: IVec3, v3fDestination?: IVec3): IVec3;
		normalize(v3fDestination?: IVec3): IVec3;
		length(): float;
		lengthSquare(): float;

		direction(v3fVec: IVec3, v3fDestination?: IVec3): IVec3;

		mix(v3fVec: IVec3, fA: float, v3fDestination?: IVec3): IVec3;

		toString(): string;
		toTranslationMatrix(m4fDestination?: IMat4);

		vec3TransformCoord(m4fTransformation: IMat4, v3fDestination?: IVec3): IVec3;
	};
};

#endif