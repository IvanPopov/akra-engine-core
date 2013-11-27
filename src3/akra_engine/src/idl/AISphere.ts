// AISphere interface
// [write description here...]


/// <reference path="AIVec3.ts" />
/// <reference path="AICircle.ts" />

interface AISphere {

	center: AIVec3;
	radius: float;

	circle: AICircle;
	z: float;

	set(): AISphere;
	set(pSphere: AISphere): AISphere;
	set(v3fCenter: AIVec3, fRadius: float): AISphere;
	set(fCenterX: float, fCenterY: float, fCenterZ: float, fRadius: float): AISphere;

	clear(): AISphere;

	isEqual(pSphere: AISphere): boolean;
	isClear(): boolean;
	isValid(): boolean;

	offset(v3fOffset: AIVec3): AISphere;
	expand(fInc: float): AISphere;
	normalize(): AISphere;

	transform(m4fMatrix: AIMat4): AISphere;
};