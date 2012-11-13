#ifndef PLANE2D_TS
#define PLANE2D_TS

#include "../math/Vec2.ts"
#include "IPlane2d.ts"

module akra.geometry{
	export class Plane2d implements IPlane2d{
		v2fNormal: IVec2;
		fDistance: float;

		constructor();
		constructor(pPlane: IPlane2d);
		constructor(v2fNormal: IVec2, fDistance: float);
		constructor(v2fPoint1: IVec2, v2fPoint2: IVec2);
		constructor(v2fPoint1?, v2fPoint2?){

			this.v2fNormal = new Vec2();
			this.fDistance = 0.;

			var nArgumentsLength = arguments.length;

			switch(nArgumentsLength){
				case 1:
					this.set(arguments[0]);
					break;
				case 2:
					this.set(arguments[0], arguments[1]);
					break;
				default:
					break;
			}
		};

		set(): IPlane2d;
		set(pPlane: IPlane2d): IPlane2d;
		set(v2fNormal: IVec2, fDistance: float): IPlane2d;
		set(v2fPoint1: IVec2, v2fPoint2: IVec2): IPlane2d;
		set(v2fPoint1?, v2fPoint2?): IPlane2d;

	};
}

#endif