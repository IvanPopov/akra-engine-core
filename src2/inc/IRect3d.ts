#ifndef IRECT3D_TS
#define IRECT3D_TS

module akra {

	IFACE(IRect2d);
	IFACE(IVec3);

	export interface IRect3d {
		x0: float;
		x1: float;
		y0: float;
		y1: float;
		z0: float;
		z1: float;

		rect2d: IRect2d;

		set(): IRect3d;
		set(pRect: IRect3d): IRect3d;
		set(v3fSize: IVec3): IRect3d;
		set(fSizeX: float, fSizeY: float, fSizeZ: float): IRect3d;
		set(v3fMinPoint: IVec3, v3fMaxPoint: IVec3): IRect3d;
		set(fX0: float, fX1: float, fY0: float,
			fY1: float, fZ0: float, fZ1: float): IRect3d;

		setFloor(pRect: IRect3d): IRect3d;
		setCeil(pRect: IRect3d): IRect3d;

		clear(): IRect3d;

		addSelf(fValue: float): IRect3d;
		addSelf(v3fVec: IVec3): IRect3d;

		subSelf(fValue: float): IRect3d;
		subSelf(v3fVec: IVec3): IRect3d;

		multSelf(fValue: float): IRect3d;
		multSelf(v3fVec: IVec3): IRect3d;

		divSelf(fValue: float): IRect3d;
		divSelf(v3fVec: IVec3): IRect3d;

		offset(v3fOffset: IVec3): IRect3d;
		offset(fOffsetX: float, fOffsetY: float, fOffsetZ: float): IRect3d;

		expand(fValue: float): IRect3d;
		expand(v3fVec: IVec3): IRect3d;
		expand(fValueX: float, fValueY: float, fValueZ: float): IRect3d;

		expandX(fValue: float): IRect3d;
		expandY(fValue: float): IRect3d;
		expandZ(fValue: float): IRect3d;

		resize(v3fSize: IVec3): IRect3d;
		resize(fSizeX: float, fSizeY: float, fSizeZ: float): IRect3d;

		resizeX(fSize: float): IRect3d;
		resizeY(fSize: float): IRect3d;
		resizeZ(fSize: float): IRect3d;

		resizeMax(v3fSpan: IVec3): IRect3d;
		resizeMax(fSpanX: float, fSpanY: float, fSpanZ: float): IRect3d;

		resizeMaxX(fSpan: float): IRect3d;
		resizeMaxY(fSpan: float): IRect3d;
		resizeMaxZ(fSpan: float): IRect3d;

		resizeMin(v3fSpan: IVec3): IRect3d;
		resizeMin(fSpanX: float, fSpanY: float, fSpanZ: float): IRect3d;

		resizeMinX(fSpan: float): IRect3d;
		resizeMinY(fSpan: float): IRect3d;
		resizeMinZ(fSpan: float): IRect3d;

		unionPoint(v3fPoint: IVec3): IRect3d;
		unionPoint(fX: float, fY: float, fZ: float): IRect3d;
		unionRect(pRect: IRect3d): IRect3d;

		negate(pDestination?: IRect3d): IRect3d;
		normalize(): IRect3d;

		transform(m4fMatrix: IMat4): IRect3d;

		isEqual(pRect: IRect3d): bool;
		isClear(): bool;
		isValid(): bool;
		isPointInRect(v3fPoint: IVec3): bool;

		midPoint(v3fDestination?: IVec3): IVec3;
		midX(): float;
		midY(): float;
		midZ(): float;

		size(v3fDestination: IVec3): IVec3;
		sizeX(): float;
		sizeY(): float;
		sizeZ(): float;

		minPoint(v3fDestination?: IVec3): IVec3;
		maxPoint(v3fDestination?: IVec3): IVec3;

		volume(): float;

		corner(iIndex: uint, v3fDestination?: IVec3): IVec3;

		createBoundingSphere(pSphere?: ISphere): ISphere;

		toString(): string;
	}
}

#endif