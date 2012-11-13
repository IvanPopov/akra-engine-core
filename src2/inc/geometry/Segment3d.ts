#ifndef SEGMENT3D_TS
#define SEGMENT3D_TS

#include "Ray3d.ts"
#include "ISegment3d.ts"

module akra.geometry{
	export class Segment3d implements ISegment3d{
		pRay: IRay3d;
		fDistance: float;

		constructor(){
			this.pRay = new Ray3d();
			this.fDistance = 0.;
		};

		get point(): IVec3{
			return this.pRay.v3fPoint;
		};
		set point(v3fPoint: IVec3){
			this.pRay.v3fPoint.set(v3fPoint);
		};

		get normal(): IVec3{
			return this.pRay.v3fNormal;
		};
		set normal(v3fNormal: IVec3){
			this.pRay.v3fNormal.set(v3fNormal);
		};
	};
}

#endif