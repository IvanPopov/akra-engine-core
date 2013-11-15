// AIMat4 interface
// [write description here...]

/**
 * @important Если внезапно задумаем перейти обратно на 
 * хранение данных в матрицах по строкам, как собственно и было в начале,
 * то необходимо раскомментить definы и переписать метод set, 
 * так как он ложит по столбцам
 */


// #define __11 0
// #define __12 4
// #define __13 8
// #define __14 12
// #define __21 1
// #define __22 5
// #define __23 9
// #define __24 13
// #define __31 2
// #define __32 6
// #define __33 10
// #define __34 14
// #define __41 3
// #define __42 7
// #define __43 11
// #define __44 15


/// <reference path="AIVec3.ts" />
/// <reference path="AIVec4.ts" />
/// <reference path="AIMat3.ts" />
/// <reference path="AIQuat4.ts" />


interface AIMat4Constructor {
	();
	(fValue: float);
	(v4fVec: AIVec4);
	(m4fMat: AIMat4);
	(pArray: float[]);
	(m3fMat: AIMat3, v3fTranslation?: AIVec3);
	(pArray: Float32Array, bFlag: boolean);
	(fValue1: float, fValue2: float, fValue3: float, fValue4: float);
	(v4fVec1: AIVec4, v4fVec2: AIVec4, v4fVec3: AIVec4, v4fVec4: AIVec4);
	(pArray1: float[], pArray2: float[], pArray3: float[], pArray4: float[]);
	(fValue1: float, fValue2: float, fValue3: float, fValue4: float,
			fValue5: float, fValue6: float, fValue7: float, fValue8: float,
			fValue9: float, fValue10: float, fValue11: float, fValue12: float,
			fValue13: float, fValue14: float, fValue15: float, fValue16: float);
}

interface AIMat4 {
	data: Float32Array;

	set(): AIMat4;
	set(fValue: float): AIMat4;
	set(v4fVec: AIVec4): AIMat4;
	set(m3fMat: AIMat3, v3fTranslation?: AIVec3): AIMat4;
	set(m4fMat: AIMat4): AIMat4;
	set(pArray: float[]): AIMat4;
	set(fValue1: float, fValue2: float,
		fValue3: float, fValue4: float): AIMat4;
	set(v4fVec1: AIVec4, v4fVec2: AIVec4,
		v4fVec3: AIVec4, v4fVec4: AIVec4): AIMat4;
	set(pArray1: float[], pArray2: float[],
		pArray3: float[], pArray4: float[]): AIMat4;
	set(fValue1: float, fValue2: float, fValue3: float, fValue4: float,
		fValue5: float, fValue6: float, fValue7: float, fValue8: float,
		fValue9: float, fValue10: float, fValue11: float, fValue12: float,
		fValue13: float, fValue14: float, fValue15: float, fValue16: float): AIMat4;

	identity(): AIMat4;

	add(m4fMat: AIMat4, m4fDestination?: AIMat4): AIMat4;
	subtract(m4fMat: AIMat4, m4fDestination?: AIMat4): AIMat4;
	multiply(m4fMat: AIMat4, m4fDestination?: AIMat4): AIMat4;
	multiplyLeft(m4fMat: AIMat4, m4fDestination?: AIMat4): AIMat4;
	multiplyVec4(v4fVec: AIVec4, v4fDestination?: AIVec4): AIVec4;

	transpose(m4fDestination?: AIMat4): AIMat4;
	determinant(): float;
	inverse(m4fDestination?: AIMat4): AIMat4;
	trace(): float;

	isEqual(m4fMat: AIMat4, fEps?: float): boolean;
	isDiagonal(fEps?: float): boolean;

	toMat3(m3fDestination?: AIMat3): AIMat3;
	toQuat4(q4fDestination?: AIQuat4): AIQuat4;
	toRotationMatrix(m4fDestination?: AIMat4): AIMat4;
	toString(): string;
	toArray(pDest?: float[]): float[];

	rotateRight(fAngle: float, v3fAxis: AIVec3, m4fDestination?: AIMat4): AIMat4;
	rotateLeft(fAngle: float, v3fAxis: AIVec3, m4fDestination?: AIMat4): AIMat4;

	//rotateXRight(fAngle: float, m4fDestination?: AIMat4): AIMat4;
	//rotateXLeft(fAngle: float, m4fDestination?: AIMat4): AIMat4;
	//rotateYRight(fAngle: float, m4fDestination?: AIMat4): AIMat4;
	//rotateYLeft(fAngle: float, m4fDestination?: AIMat4): AIMat4;
	//rotateZRight(fAngle: float, m4fDestination?: AIMat4): AIMat4;
	//rotateZLeft(fAngle: float, m4fDestination?: AIMat4): AIMat4;

	setTranslation(v3fTranslation: AIVec3): AIMat4;
	getTranslation(v3fTranslation?: AIVec3): AIVec3;
	
	translateRight(v3fTranslation: AIVec3, m4fDestination?: AIMat4): AIMat4;
	translateLeft(v3fTranslation: AIVec3, m4fDestination?: AIMat4): AIMat4;

	scaleRight(v3fScale: AIVec3, m4fDestination?: AIMat4): AIMat4;
	scaleLeft(v3fScale: AIVec3, m4fDestination?: AIMat4): AIMat4;

	decompose(q4fRotation: AIQuat4, v3fScale: AIVec3, v3fTranslation: AIVec3): boolean;

	row(iRow: int, v4fDestination?: AIVec4): AIVec4;
	column(iColumn: int, v4fDestination?: AIVec4): AIVec4;

	/*v3fScreen - coordinates in screen space from -1 to 1
	* returns vec4(wsCoord,1.), where wsCoord - coordinates in world space
	* use with projection matrix only
	*/
	unproj(v3fScreen: AIVec3, v4fDestination?: AIVec4): AIVec4;
	unproj(v4fScreen: AIVec4, v4fDestination?: AIVec4): AIVec4;

	unprojZ(fZ: float): float;

	/**
	 * use only this projection matrix otherwise result doesn't have any sense
	 */
	isOrthogonalProjection(): boolean;
}
