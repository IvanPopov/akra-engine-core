#ifndef RAY2D_TS
#define RAY2D_TS

#include "../math/Vec2.ts"
#include "IRay2d.ts"

module akra.geometry{
	export struct Ray2d implements IRay2d{
		v2fPoint: IVec2;
		v2fNormal: IVec2;

		constructor(){
			this.v2fPoint = new Vec2();
			this.v2fNormal = new Vec2();
		};
	};
}

#endif