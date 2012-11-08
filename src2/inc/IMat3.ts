#ifndef IMAT3_TS
#define IMAT3_TS

/**
 * @important Если внезапно задумаем перейти обратно на 
 * хранение данных в матрицах по строкам, как собственно и было в начале,
 * то необходимо раскомментить definы и переписать метод set, 
 * так как он ложит по столбцам
 */

// #define __a11 0
// #define __a12 1
// #define __a13 2
// #define __a21 3
// #define __a22 4
// #define __a23 5
// #define __a31 6
// #define __a32 7
// #define __a33 8

#define __a11 0
#define __a12 3
#define __a13 6
#define __a21 1
#define __a22 4
#define __a23 7
#define __a31 2
#define __a32 5
#define __a33 8

module akra {
	IFACE(IMat4);
	IFACE(IVec3);
	IFACE(IQuat4);

	export interface IMat3 {
		data: Float32Array;

		set(): IMat3;
		set(fValue: float): IMat3;
		set(v3fVec: IVec3): IMat3;
		set(m3fMat: IMat3): IMat3;
		set(m4fMat: IMat4): IMat3;
		set(pArray: float[]): IMat3;
		set(fValue1: float, fValue2: float, fValue3: float): IMat3;
		set(v3fVec1: IVec3, v3fVec2: IVec3, v3fVec3: IVec3): IMat3;
		set(pArray1: float[], pArray2: float[], pArray3: float[]): IMat3;
		set(fValue1: float, fValue2: float, fValue3: float,
			fValue4: float, fValue5: float, fValue6: float,
			fValue7: float, fValue8: float, fValue9: float): IMat3;

		identity(): IMat3;

		add(m3fMat: IMat3, m3fDestination?: IMat3): IMat3;
		subtract(m3fMat: IMat3, m3fDestination?: IMat3): IMat3;
		multiply(m3fMat: IMat3, m3fDestination?: IMat3): IMat3;
		multiplyVec3(v3fVec: IVec3, v3fDestination?: IVec3): IVec3;

		transpose(m3fDestination?: IMat3): IMat3;
		determinant(): float;
		inverse(m3fDestination?: IMat3): IMat3;

		isEqual(m3fMat: IMat3, fEps?: float): bool;
		isDiagonal(fEps?: float) : bool;

		toMat4(m4fDestination?: IMat4): IMat4;
		toQuat4(q4fDestination?: IQuat4): IQuat4;
		toString(): string;

		decompose(q4fRotation: IQuat4, v3fScale: IVec3): bool;
		row(iRow: int, v3fDestination?: IVec3): IVec3;
		column(iColumn: int, v3fDestination?: IVec3): IVec3;
	};
};

#endif