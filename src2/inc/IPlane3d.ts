#ifndef IPLANE3D_TS
#define IPLANE3D_TS

module akra{

	IFACE(IVec3);

	export interface IPlane3d{
		normal: IVec3;
		distance: float;

		set(): IPlane3d;
		set(pPlane: IPlane3d): IPlane3d;
		set(v3fNormal: IVec3, fDistance: float): IPlane3d;
		set(v3fPoint1: IVec3, v3fPoint2: IVec3, v3fPoint3: IVec3): IPlane3d;

		clear(): IPlane3d;

		negate(): IPlane3d;

		normalize(): IPlane3d;

		isEqual(pPlane: IPlane3d): bool;

		projectPointToPlane(v3fPoint: IVec3, v3fDestination?: IVec3): IVec3;

		intersectRay3d(pRay: IRay3d, vDest: IVec3): bool;

		solveForX(fY: float, fZ: float): float;
		solveForY(fX: float, fZ: float): float;
		solveForZ(fX: float, fY: float): float;

		signedDistance(v3fPoint: IVec3): float;

		toString(): string;
	};
}

#endif