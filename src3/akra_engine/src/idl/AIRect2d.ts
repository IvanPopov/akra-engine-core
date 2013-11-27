// AIRect2d interface
// [write description here...]

/// <reference path="AIVec2.ts" />
/// <reference path="AICircle.ts" />

interface AIRect2d {
	x0: float;
	x1: float;
	y0: float;
	y1: float;

	left: float;
	top: float;

	width: float;
	height: float;

	set(): AIRect2d;
	set(pRect: AIRect2d): AIRect2d;
	set(v2fVec: AIVec2): AIRect2d;
	set(fSizeX: float, fSizeY: float): AIRect2d;
	set(v2fMinPoint: AIVec2, v2fMaxPoint: AIVec2): AIRect2d;
	set(fX0: float, fX1: float, fY0: float, fY1: float): AIRect2d;

	setFloor(pRect: AIRect2d): AIRect2d;
	setCeil(pRect: AIRect2d): AIRect2d;

	clear(): AIRect2d;

	addSelf(fValue: float): AIRect2d;
	addSelf(v2fVec: AIVec2): AIRect2d;

	subSelf(fValue: float): AIRect2d;
	subSelf(v2fVec: AIVec2): AIRect2d;

	multSelf(fValue: float): AIRect2d;
	multSelf(v2fVec: AIVec2): AIRect2d;

	divSelf(fValue: float): AIRect2d;
	divSelf(v2fVec: AIVec2): AIRect2d;

	offset(v2fOffset: AIVec2): AIRect2d;
	offset(fOffsetX: float, fOffsetY: float): AIRect2d;
	
	expand(fValue: float): AIRect2d;
	expand(v2fValue: AIVec2): AIRect2d;
	expand(fValueX: float, fValueY: float): AIRect2d;

	expandX(fValue: float): AIRect2d;
	expandY(fValue: float): AIRect2d;

	resize(v2fSize: AIVec2): AIRect2d;
	resize(fSizeX: float, fSizeY: float): AIRect2d;

	resizeX(fSize: float): AIRect2d;
	resizeY(fSize: float): AIRect2d;

	resizeMax(v2fSpan: AIVec2): AIRect2d;
	resizeMax(fSpanX: float, fSpanY: float): AIRect2d;

	resizeMaxX(fSpan: float): AIRect2d;
	resizeMaxY(fSpan: float): AIRect2d;

	resizeMin(v2fSpan: AIVec2): AIRect2d;
	resizeMin(fSpanX: float, fSpanY: float): AIRect2d;

	resizeMinX(fSpan: float): AIRect2d;
	resizeMinY(fSpan: float): AIRect2d;

	unionPoint(v2fPoint: AIVec2): AIRect2d;
	unionPoint(fX: float, fY: float): AIRect2d;
	unionRect(pRect: AIRect2d): AIRect2d;

	negate(pDestination?: AIRect2d): AIRect2d;
	normalize(): AIRect2d;

	isEqual(pRect: AIRect2d): boolean;
	isClear(): boolean;
	isValid(): boolean;
	isPointInRect(v2fPoint: AIVec2): boolean;

	midPoint(v2fDestination?: AIVec2): AIVec2;
	midX(): float;
	midY(): float;

	size(v2fDestination?: AIVec2): AIVec2;
	sizeX(): float;
	sizeY(): float;

	minPoint(v2fDestination?: AIVec2): AIVec2;
	maxPoint(v2fDestination?: AIVec2): AIVec2;

	area(): float;

	corner(iIndex: uint, v2fDestination?: AIVec2): AIVec2;

	createBoundingCircle(pCircle?: AICircle): AICircle;

	distanceToPoint(v2fPoint: AIVec2): float;

	toString(): string;
}


