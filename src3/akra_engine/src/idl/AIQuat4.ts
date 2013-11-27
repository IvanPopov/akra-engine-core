// AIQuat4 interface
// [write description here...]


/// <reference path="AIVec3.ts" />
/// <reference path="AIMat3.ts" />
/// <reference path="AIMat4.ts" />

interface AIQuat4Constructor {
	();
	(q4fQuat: AIQuat4);
	(pArray: float[]);
	(fValue: float, fW: float);
	(v3fValue: AIVec3, fW: float);
	(fX: float, fY: float, fZ: float, fW: float);
}

interface AIQuat4 {
	x: float;
	y: float;
	z: float;
	w: float;

	set(): AIQuat4;
	set(q4fQuat: AIQuat4): AIQuat4;
	set(pArray: float[]): AIQuat4;
	set(fValue: float, fW: float): AIQuat4;
	set(v3fValue: AIVec3, fW: float): AIQuat4;
	set(fX: float, fY: float, fZ: float, fW: float): AIQuat4;

	multiply(q4fQuat: AIQuat4, q4fDestination?: AIQuat4): AIQuat4;
	multiplyVec3(v3fVec: AIVec3, v3fDestination?: AIVec3): AIVec3;

	conjugate(q4fDestination?: AIQuat4): AIQuat4;
	inverse(q4fDestination?: AIQuat4): AIQuat4;

	length(): float;
	normalize(q4fDestination?: AIQuat4): AIQuat4;

	calculateW(q4fDestination?: AIQuat4): AIQuat4;

	isEqual(q4fQuat: AIQuat4, fEps?: float, asMatrix?: boolean): boolean;

	getYaw(): float;
	getPitch(): float;
	getRoll(): float;
	toYawPitchRoll(v3fDestination?: AIVec3): AIVec3;

	toMat3(m3fDestination?: AIMat3): AIMat3;
	toMat4(m4fDestination?: AIMat4): AIMat4;
	toString(): string;

	mix(q4fQuat: AIQuat4, fA: float, q4fDestination?: AIQuat4, bShortestPath?: boolean);
	smix(q4fQuat: AIQuat4, fA: float, q4fDestination?: AIQuat4, bShortestPath?: boolean);
};