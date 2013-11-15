// AICircle interface
// [write description here...]


/// <reference path="AIVec2.ts" />

interface AICircle {

	radius: float;
	center: AIVec2;

	set(): AICircle;
	set(pCircle: AICircle): AICircle;
	set(v2fCenter: AIVec2, fRadius: float): AICircle;
	set(fCenterX: float, fCenterY: float, fRadius: float): AICircle;

	clear(): AICircle;

	isEqual(pCircle: AICircle): boolean;
	isClear(): boolean;
	isValid(): boolean;

	offset(v2fOffset: AIVec2): AICircle;
	expand(fInc: float): AICircle;
	normalize(): AICircle;
};