#ifndef IPLANE2D_TS
#define IPLANE2D_TS

module akra{

	IFACE(IVec2);

	export interface IPlane2d{
		v2fNormal: IVec2;
		fDistance: float;

		set(): IPlane2d;
		set(pPlane: IPlane2d): IPlane2d;
		set(v2fNormal: IVec2, fDistance: float): IPlane2d;
		set(v2fPoint1: IVec2, v2fPoint2: IVec2): IPlane2d;

		isEqual(pPlane: IPlane2d): bool;

		projectPointToPlane(v2fPoint: IVec2, v2fDestination?: IVec2): IVec2;

		solveForX(fY: float): float;
		solveForY(fX: float): float;

		signedDistance(v2fPoint): float;
	}
}

#endif