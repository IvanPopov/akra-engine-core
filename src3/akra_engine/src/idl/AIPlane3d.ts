// AIPlane3d interface

/// <reference path="AIVec3.ts" />
/// <reference path="AIRay3d.ts" />

interface AIPlane3d {
	normal: AIVec3;
	distance: float;

	set(): AIPlane3d;
	set(pPlane: AIPlane3d): AIPlane3d;
	set(v3fNormal: AIVec3, fDistance: float): AIPlane3d;
	set(v3fPoint1: AIVec3, v3fPoint2: AIVec3, v3fPoint3: AIVec3): AIPlane3d;

	clear(): AIPlane3d;

	negate(): AIPlane3d;

	normalize(): AIPlane3d;

	isEqual(pPlane: AIPlane3d): boolean;

	projectPointToPlane(v3fPoint: AIVec3, v3fDestination?: AIVec3): AIVec3;

	intersectRay3d(pRay: AIRay3d, vDest: AIVec3): boolean;

	solveForX(fY: float, fZ: float): float;
	solveForY(fX: float, fZ: float): float;
	solveForZ(fX: float, fY: float): float;

	signedDistance(v3fPoint: AIVec3): float;

	toString(): string;
}

