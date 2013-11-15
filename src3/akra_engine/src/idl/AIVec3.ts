// AIVec3 interface
// [write description here...]


/// <reference path="AIVec2.ts" />
/// <reference path="AIMat4.ts" />

interface AIVec3Constructor {
	();
	(fValue: float);
	(v3fVec: AIVec3);
	(pArray: float[]);
	(fValue: float, v2fVec: AIVec2);
	(v2fVec: AIVec2, fValue: float);
	(fValue1: float, fValue2: float, fValue3: float);
}


interface AIVec3 {
	x: float;
	y: float;
	z: float;

	

	set(): AIVec3;
	set(fValue: float): AIVec3;
	set(v3fVec: AIVec3): AIVec3;
	set(pArray: float[]): AIVec3;
	set(fValue: float, v2fVec: AIVec2): AIVec3;
	set(v2fVec: AIVec2, fValue: float): AIVec3;
	set(fValue1: float, fValue2: float, fValue3: float): AIVec3;

	clear(): AIVec3;

	add(v3fVec: AIVec3, v3fDestination?: AIVec3): AIVec3;
	subtract(v3fVec: AIVec3, v3fDestination?: AIVec3): AIVec3;
	dot(v3fVec: AIVec3): float;
	cross(v3fVec: AIVec3, v3fDestination?: AIVec3): AIVec3;

	isEqual(v3fVec: AIVec3, fEps?: float): boolean;
	isClear(fEps?: float): boolean;

	negate(v3fDestination?: AIVec3): AIVec3;
	scale(fScale: float, v3fDestination?: AIVec3): AIVec3;
	scale(v3fScale: AIVec3, v3fDestination?: AIVec3): AIVec3;
	normalize(v3fDestination?: AIVec3): AIVec3;
	length(): float;
	lengthSquare(): float;

	direction(v3fVec: AIVec3, v3fDestination?: AIVec3): AIVec3;

	mix(v3fVec: AIVec3, fA: float, v3fDestination?: AIVec3): AIVec3;

	toString(): string;
	toArray(): float[];
	toTranslationMatrix(m4fDestination?: AIMat4);

	vec3TransformCoord(m4fTransformation: AIMat4, v3fDestination?: AIVec3): AIVec3;
};