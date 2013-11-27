// AISegment2d interface
// [write description here...]


/// <reference path="AIRay2d.ts" />

interface AISegment2d {
	ray: AIRay2d;
	distance: float;

	point: AIVec2;
	normal: AIVec2;
};