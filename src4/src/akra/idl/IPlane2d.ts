

/// <reference path="IVec2.ts" />
/// <reference path="ICircle.ts" />

module akra {
	interface IPlane2d {
		normal: IVec2;
		distance: float;
	
		set(): IPlane2d;
		set(pPlane: IPlane2d): IPlane2d;
		set(v2fNormal: IVec2, fDistance: float): IPlane2d;
		set(v2fPoint1: IVec2, v2fPoint2: IVec2): IPlane2d;
	
		clear(): IPlane2d;
	
		negate(): IPlane2d;
	
		normalize(): IPlane2d;
	
		isEqual(pPlane: IPlane2d): boolean;
	
		projectPointToPlane(v2fPoint: IVec2, v2fDestination?: IVec2): IVec2;
	
		solveForX(fY: float): float;
		solveForY(fX: float): float;
	
		signedDistance(v2fPoint): float;
	
		toString(): string;
	}
	
	
}
