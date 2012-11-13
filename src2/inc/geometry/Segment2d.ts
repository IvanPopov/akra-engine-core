#ifndef SEGMENT2D_TS
#define SEGMENT2D_TS

#include "Ray2d.ts"
#include "ISegment2d.ts"

module akra.geometry{
	export class Segment2d implements ISegment2d{
		pRay: IRay2d;
		fDistance: float;

		constructor(){
			this.pRay = new Ray2d();
			this.fDistance = 0.;
		};

		get point(): IVec2{
			return this.pRay.v2fPoint;
		};
		set point(v2fPoint: IVec2){
			this.pRay.v2fPoint.set(v2fPoint);
		};

		get normal(): IVec2{
			return this.pRay.v2fNormal;
		};
		set normal(v2fNormal: IVec2){
			this.pRay.v2fNormal.set(v2fNormal);
		};
	};
}

#endif