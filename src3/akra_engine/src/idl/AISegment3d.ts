// AISegment3d interface
// [write description here...]


/// <reference path="AIRay3d.ts" />

interface AISegment3d {
	ray: AIRay3d;
	distance: float;

	point: AIVec3;
	normal: AIVec3;
};