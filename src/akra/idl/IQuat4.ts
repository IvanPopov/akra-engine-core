

/// <reference path="IVec3.ts" />
/// <reference path="IMat3.ts" />
/// <reference path="IMat4.ts" />

module akra {
	export interface IQuat4Constructor {
		();
		(q4fQuat: IQuat4);
		(pArray: float[]);
		(fValue: float, fW: float);
		(v3fValue: IVec3, fW: float);
		(fX: float, fY: float, fZ: float, fW: float);
	}
	
	export interface IQuat4 {
		x: float;
		y: float;
		z: float;
		w: float;
	
		set(): IQuat4;
		set(q4fQuat: IQuat4): IQuat4;
		set(pArray: float[]): IQuat4;
		set(fValue: float, fW: float): IQuat4;
		set(v3fValue: IVec3, fW: float): IQuat4;
		set(fX: float, fY: float, fZ: float, fW: float): IQuat4;
	
		multiply(q4fQuat: IQuat4, q4fDestination?: IQuat4): IQuat4;
		multiplyVec3(v3fVec: IVec3, v3fDestination?: IVec3): IVec3;
	
		conjugate(q4fDestination?: IQuat4): IQuat4;
		inverse(q4fDestination?: IQuat4): IQuat4;
	
		length(): float;
		normalize(q4fDestination?: IQuat4): IQuat4;
	
		calculateW(q4fDestination?: IQuat4): IQuat4;
	
		isEqual(q4fQuat: IQuat4, fEps?: float, asMatrix?: boolean): boolean;
	
		getYaw(): float;
		getPitch(): float;
		getRoll(): float;
		toYawPitchRoll(v3fDestination?: IVec3): IVec3;
	
		toMat3(m3fDestination?: IMat3): IMat3;
		toMat4(m4fDestination?: IMat4): IMat4;
		toString(): string;
	
		mix(q4fQuat: IQuat4, fA: float, q4fDestination?: IQuat4, bShortestPath?: boolean);
		smix(q4fQuat: IQuat4, fA: float, q4fDestination?: IQuat4, bShortestPath?: boolean);
	};
}
