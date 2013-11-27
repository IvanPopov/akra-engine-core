// AIRect3d interface
// [write description here...]

/// <reference path="AIRect2d.ts" />
/// <reference path="AIVec3.ts" />

interface AIRect3d {
	x0: float;
	x1: float;
	y0: float;
	y1: float;
	z0: float;
	z1: float;

	rect2d: AIRect2d;

	set(): AIRect3d;
	set(pRect: AIRect3d): AIRect3d;
	set(v3fSize: AIVec3): AIRect3d;
	set(fSizeX: float, fSizeY: float, fSizeZ: float): AIRect3d;
	set(v3fMinPoint: AIVec3, v3fMaxPoint: AIVec3): AIRect3d;
	set(fX0: float, fX1: float, fY0: float,
		fY1: float, fZ0: float, fZ1: float): AIRect3d;

	setFloor(pRect: AIRect3d): AIRect3d;
	setCeil(pRect: AIRect3d): AIRect3d;

	clear(): AIRect3d;

	addSelf(fValue: float): AIRect3d;
	addSelf(v3fVec: AIVec3): AIRect3d;

	subSelf(fValue: float): AIRect3d;
	subSelf(v3fVec: AIVec3): AIRect3d;

	multSelf(fValue: float): AIRect3d;
	multSelf(v3fVec: AIVec3): AIRect3d;

	divSelf(fValue: float): AIRect3d;
	divSelf(v3fVec: AIVec3): AIRect3d;

	offset(v3fOffset: AIVec3): AIRect3d;
	offset(fOffsetX: float, fOffsetY: float, fOffsetZ: float): AIRect3d;

	expand(fValue: float): AIRect3d;
	expand(v3fVec: AIVec3): AIRect3d;
	expand(fValueX: float, fValueY: float, fValueZ: float): AIRect3d;

	expandX(fValue: float): AIRect3d;
	expandY(fValue: float): AIRect3d;
	expandZ(fValue: float): AIRect3d;

	resize(v3fSize: AIVec3): AIRect3d;
	resize(fSizeX: float, fSizeY: float, fSizeZ: float): AIRect3d;

	resizeX(fSize: float): AIRect3d;
	resizeY(fSize: float): AIRect3d;
	resizeZ(fSize: float): AIRect3d;

	resizeMax(v3fSpan: AIVec3): AIRect3d;
	resizeMax(fSpanX: float, fSpanY: float, fSpanZ: float): AIRect3d;

	resizeMaxX(fSpan: float): AIRect3d;
	resizeMaxY(fSpan: float): AIRect3d;
	resizeMaxZ(fSpan: float): AIRect3d;

	resizeMin(v3fSpan: AIVec3): AIRect3d;
	resizeMin(fSpanX: float, fSpanY: float, fSpanZ: float): AIRect3d;

	resizeMinX(fSpan: float): AIRect3d;
	resizeMinY(fSpan: float): AIRect3d;
	resizeMinZ(fSpan: float): AIRect3d;

	unionPoint(v3fPoint: AIVec3): AIRect3d;
	unionPoint(fX: float, fY: float, fZ: float): AIRect3d;
	unionRect(pRect: AIRect3d): AIRect3d;

	negate(pDestination?: AIRect3d): AIRect3d;
	normalize(): AIRect3d;

	transform(m4fMatrix: AIMat4): AIRect3d;

	isEqual(pRect: AIRect3d): boolean;
	isClear(): boolean;
	isValid(): boolean;
	isPointInRect(v3fPoint: AIVec3): boolean;

	midPoint(v3fDestination?: AIVec3): AIVec3;
	midX(): float;
	midY(): float;
	midZ(): float;

	size(v3fDestination: AIVec3): AIVec3;
	sizeX(): float;
	sizeY(): float;
	sizeZ(): float;

	minPoint(v3fDestination?: AIVec3): AIVec3;
	maxPoint(v3fDestination?: AIVec3): AIVec3;

	volume(): float;

	corner(iIndex: uint, v3fDestination?: AIVec3): AIVec3;

	createBoundingSphere(pSphere?: AISphere): AISphere;

	distanceToPoint(v3fPoint: AIVec3): float;

	toString(): string;
}
