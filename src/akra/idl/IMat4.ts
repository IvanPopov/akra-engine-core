
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


/// <reference path="IVec3.ts" />
/// <reference path="IVec4.ts" />
/// <reference path="IMat3.ts" />
/// <reference path="IQuat4.ts" />


module akra {
	export interface IMat4Constructor {
		();
		(fValue: float);
		(v4fVec: IVec4);
		(m4fMat: IMat4);
		(pArray: float[]);
		(m3fMat: IMat3, v3fTranslation?: IVec3);
		(pArray: Float32Array, bFlag: boolean);
		(fValue1: float, fValue2: float, fValue3: float, fValue4: float);
		(v4fVec1: IVec4, v4fVec2: IVec4, v4fVec3: IVec4, v4fVec4: IVec4);
		(pArray1: float[], pArray2: float[], pArray3: float[], pArray4: float[]);
		(fValue1: float, fValue2: float, fValue3: float, fValue4: float,
				fValue5: float, fValue6: float, fValue7: float, fValue8: float,
				fValue9: float, fValue10: float, fValue11: float, fValue12: float,
				fValue13: float, fValue14: float, fValue15: float, fValue16: float);
	}
	
	export interface IMat4 {
		data: Float32Array;
	
		set(): IMat4;
		set(fValue: float): IMat4;
		set(v4fVec: IVec4): IMat4;
		set(m3fMat: IMat3, v3fTranslation?: IVec3): IMat4;
		set(m4fMat: IMat4): IMat4;
		set(pArray: float[]): IMat4;
		set(fValue1: float, fValue2: float,
			fValue3: float, fValue4: float): IMat4;
		set(v4fVec1: IVec4, v4fVec2: IVec4,
			v4fVec3: IVec4, v4fVec4: IVec4): IMat4;
		set(pArray1: float[], pArray2: float[],
			pArray3: float[], pArray4: float[]): IMat4;
		set(fValue1: float, fValue2: float, fValue3: float, fValue4: float,
			fValue5: float, fValue6: float, fValue7: float, fValue8: float,
			fValue9: float, fValue10: float, fValue11: float, fValue12: float,
			fValue13: float, fValue14: float, fValue15: float, fValue16: float): IMat4;
	
		identity(): IMat4;
	
		add(m4fMat: IMat4, m4fDestination?: IMat4): IMat4;
		subtract(m4fMat: IMat4, m4fDestination?: IMat4): IMat4;
		multiply(m4fMat: IMat4, m4fDestination?: IMat4): IMat4;
		multiplyLeft(m4fMat: IMat4, m4fDestination?: IMat4): IMat4;
		multiplyVec4(v4fVec: IVec4, v4fDestination?: IVec4): IVec4;
		/** 
		 * @copydoc Mat4::multiplyNumber()
		 */
		multiplyNumber(fValue: float, m4fDestination?: IMat4): IMat4;
	
		transpose(m4fDestination?: IMat4): IMat4;
		determinant(): float;
		inverse(m4fDestination?: IMat4): IMat4;
		trace(): float;
	
		isEqual(m4fMat: IMat4, fEps?: float): boolean;
		isDiagonal(fEps?: float): boolean;
	
		toMat3(m3fDestination?: IMat3): IMat3;
		toQuat4(q4fDestination?: IQuat4): IQuat4;
		toRotationMatrix(m4fDestination?: IMat4): IMat4;
		toString(): string;
		toArray(pDest?: float[]): float[];
	
		rotateRight(fAngle: float, v3fAxis: IVec3, m4fDestination?: IMat4): IMat4;
		rotateLeft(fAngle: float, v3fAxis: IVec3, m4fDestination?: IMat4): IMat4;
	
		//rotateXRight(fAngle: float, m4fDestination?: IMat4): IMat4;
		//rotateXLeft(fAngle: float, m4fDestination?: IMat4): IMat4;
		//rotateYRight(fAngle: float, m4fDestination?: IMat4): IMat4;
		//rotateYLeft(fAngle: float, m4fDestination?: IMat4): IMat4;
		//rotateZRight(fAngle: float, m4fDestination?: IMat4): IMat4;
		//rotateZLeft(fAngle: float, m4fDestination?: IMat4): IMat4;
	
		setTranslation(v3fTranslation: IVec3): IMat4;
		getTranslation(v3fTranslation?: IVec3): IVec3;
		
		translateRight(v3fTranslation: IVec3, m4fDestination?: IMat4): IMat4;
		translateLeft(v3fTranslation: IVec3, m4fDestination?: IMat4): IMat4;
	
		scaleRight(fScale: float, m4fDestination?: IMat4): IMat4;
		scaleRight(v3fScale: IVec3, m4fDestination?: IMat4): IMat4;
		scaleLeft(fScale: float, m4fDestination?: IMat4): IMat4;
		scaleLeft(v3fScale: IVec3, m4fDestination?: IMat4): IMat4;
	
		decompose(q4fRotation: IQuat4, v3fScale: IVec3, v3fTranslation: IVec3): boolean;
	
		row(iRow: int, v4fDestination?: IVec4): IVec4;
		column(iColumn: int, v4fDestination?: IVec4): IVec4;
	
		/*v3fScreen - coordinates in screen space from -1 to 1
		* returns vec4(wsCoord,1.), where wsCoord - coordinates in world space
		* use with projection matrix only
		*/
		unproj(v3fScreen: IVec3, v4fDestination?: IVec4): IVec4;
		unproj(v4fScreen: IVec4, v4fDestination?: IVec4): IVec4;
	
		unprojZ(fZ: float): float;
	
		/**
		 * use only this projection matrix otherwise result doesn't have any sense
		 */
		isOrthogonalProjection(): boolean;
	}
	
}
