// AIPlane2d interface
// [write description here...]


/// <reference path="AIVec2.ts" />
/// <reference path="AICircle.ts" />

interface AIPlane2d {
	normal: AIVec2;
	distance: float;

	set(): AIPlane2d;
	set(pPlane: AIPlane2d): AIPlane2d;
	set(v2fNormal: AIVec2, fDistance: float): AIPlane2d;
	set(v2fPoint1: AIVec2, v2fPoint2: AIVec2): AIPlane2d;

	clear(): AIPlane2d;

	negate(): AIPlane2d;

	normalize(): AIPlane2d;

	isEqual(pPlane: AIPlane2d): boolean;

	projectPointToPlane(v2fPoint: AIVec2, v2fDestination?: AIVec2): AIVec2;

	solveForX(fY: float): float;
	solveForY(fX: float): float;

	signedDistance(v2fPoint): float;

	toString(): string;
}

