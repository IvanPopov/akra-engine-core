// AIVec4 interface
// [write description here...]


/// <reference path="AIVec2.ts" />
/// <reference path="AIVec3.ts" />
/// <reference path="AIColorValue.ts" />

interface AIVec4Constructor {
	();
	(fValue: float);
	(v4fVec: AIVec4);
	(pArray: float[]);
	(fValue: float, v3fVec: AIVec3);
	(v2fVec1: AIVec2, v2fVec2: AIVec2);
	(v3fVec: AIVec3, fValue: float);
	(fValue1: float, fValue2: float, v2fVec: AIVec2);
	(fValue1: float, v2fVec: AIVec2, fValue2: float);
	(v2fVec: AIVec2 ,fValue1: float, fValue2: float);
	(fValue1: float, fValue2: float, fValue3: float, fValue4: float);
}


interface AIVec4 {
	x: float;
	y: float;
	z: float;
	w: float;

	

	set(): AIVec4;
	set(fValue: float): AIVec4;
	set(v4fVec: AIVec4): AIVec4;
	set(c4fColor: AIColorValue): AIVec4;
	set(pArray: float[]): AIVec4;
	set(fValue: float, v3fVec: AIVec3): AIVec4;
	set(v2fVec1: AIVec2, v2fVec2: AIVec2): AIVec4;
	set(v3fVec: AIVec3, fValue: float): AIVec4;
	set(fValue1: float, fValue2: float, v2fVec: AIVec2): AIVec4;
	set(fValue1: float, v2fVec: AIVec2, fValue2: float): AIVec4;
	set(v2fVec: AIVec2, fValue1: float, fValue2: float): AIVec4;
	set(fValue1: float, fValue2: float, fValue3: float, fValue4: float): AIVec4;

	clear(): AIVec4;

	add(v4fVec: AIVec4, v4fDestination?: AIVec4): AIVec4;
	subtract(v4fVec: AIVec4, v4fDestination?: AIVec4): AIVec4;
	dot(v4fVec: AIVec4): float;

	isEqual(v4fVec: AIVec4, fEps?: float): boolean;
	isClear(fEps?: float): boolean;

	negate(v4fDestination?: AIVec4): AIVec4;
	scale(fScale: float, v4fDestination?: AIVec4): AIVec4;
	normalize(v4fDestination?: AIVec4): AIVec4;
	length(): float;
	lengthSquare(): float;

	direction(v4fVec: AIVec4, v4fDestination?: AIVec4): AIVec4;

	mix(v4fVec: AIVec4, fA: float, v4fDestination?: AIVec4): AIVec4;

	toString(): string;
};