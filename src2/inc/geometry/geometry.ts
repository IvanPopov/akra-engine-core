#ifndef GEOMETRY_TS
#define GEOMETRY_TS

#include "Ray2d.ts"
#include "Ray3d.ts"

#include "Segment2d.ts"
#include "Segment3d.ts"

#include "Circle.ts"
#include "Sphere.ts"

#include "Plane2d.ts"
#include "Plane3d.ts"

#include "Rect2d.ts"

module akra.geometry{
	export enum EVolumeClassifications{
		NO_RELATION = 0,
		EQUAL,
		A_CONTAINS_B,
		B_CONTAINS_A,
		INTERSECTING
	};

	export enum EPlaneClassifications{
		PLANE_FRONT = 0,
		PLANE_BACK,
		PLANE_INTERSECT
	};
};

#endif