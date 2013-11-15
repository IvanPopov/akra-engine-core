// AIMat3 interface
// [write description here...]

/**
 * @important Если внезапно задумаем перейти обратно на 
 * хранение данных в матрицах по строкам, как собственно и было в начале,
 * то необходимо раскомментить definы и переписать метод set, 
 * так как он ложит по столбцам
 */


// #define __a11 0
// #define __a12 3
// #define __a13 6
// #define __a21 1
// #define __a22 4
// #define __a23 7
// #define __a31 2
// #define __a32 5
// #define __a33 8

/// <reference path="AIMat4.ts" />
/// <reference path="AIVec3.ts" />
/// <reference path="AIQuat4.ts" />

interface AIMat3Constructor {
	();
	(fValue: float);
	(v3fVec: AIVec3);
	(m3fMat: AIMat3);
	(m4fMat: AIMat4);
	(pArray: float[]);
	(fValue1: float, fValue2: float, fValue3: float);
	(v3fVec1: AIVec3, v3fVec2: AIVec3, v3fVec3: AIVec3);
	(pArray1: float[], pArray2: float[], pArray3: float[]);
	(fValue1: float, fValue2: float, fValue3: float,
				fValue4: float, fValue5: float, fValue6: float,
				fValue7: float, fValue8: float, fValue9: float);
}

interface AIMat3 {
	data: Float32Array;

	set(): AIMat3;
	set(fValue: float): AIMat3;
	set(v3fVec: AIVec3): AIMat3;
	set(m3fMat: AIMat3): AIMat3;
	set(m4fMat: AIMat4): AIMat3;
	set(pArray: float[]): AIMat3;
	set(fValue1: float, fValue2: float, fValue3: float): AIMat3;
	set(v3fVec1: AIVec3, v3fVec2: AIVec3, v3fVec3: AIVec3): AIMat3;
	set(pArray1: float[], pArray2: float[], pArray3: float[]): AIMat3;
	set(fValue1: float, fValue2: float, fValue3: float,
		fValue4: float, fValue5: float, fValue6: float,
		fValue7: float, fValue8: float, fValue9: float): AIMat3;

	identity(): AIMat3;

	add(m3fMat: AIMat3, m3fDestination?: AIMat3): AIMat3;
	subtract(m3fMat: AIMat3, m3fDestination?: AIMat3): AIMat3;
	multiply(m3fMat: AIMat3, m3fDestination?: AIMat3): AIMat3;
	multiplyVec3(v3fVec: AIVec3, v3fDestination?: AIVec3): AIVec3;

	transpose(m3fDestination?: AIMat3): AIMat3;
	determinant(): float;
	inverse(m3fDestination?: AIMat3): AIMat3;

	isEqual(m3fMat: AIMat3, fEps?: float): boolean;
	isDiagonal(fEps?: float) : boolean;

	toMat4(m4fDestination?: AIMat4): AIMat4;
	toQuat4(q4fDestination?: AIQuat4): AIQuat4;
	toString(): string;

	decompose(q4fRotation: AIQuat4, v3fScale: AIVec3): boolean;
	row(iRow: int, v3fDestination?: AIVec3): AIVec3;
	column(iColumn: int, v3fDestination?: AIVec3): AIVec3;
}
