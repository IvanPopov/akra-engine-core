#ifndef SEGMENT3D_TS
#define SEGMENT3D_TS

#include "Ray3d.ts"
#include "ISegment3d.ts"

module akra.geometry{
	export class Segment3d implements ISegment3d{
		ray: IRay3d;
		distance: float;

		constructor(){
			this.ray = new Ray3d();
			this.distance = 0.;
		};

		get point(): IVec3{
			return this.ray.point;
		};
		set point(v3fPoint: IVec3){
			this.ray.point.set(v3fPoint);
		};

		get normal(): IVec3{
			return this.ray.normal;
		};
		set normal(v3fNormal: IVec3){
			this.ray.normal.set(v3fNormal);
		};
	};
}

#endif