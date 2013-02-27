#ifndef RAY2D_TS
#define RAY2D_TS

#include "../math/Vec2.ts"
#include "IRay2d.ts"

module akra.geometry{
	export struct Ray2d implements IRay2d{
		point: IVec2;
		normal: IVec2;

		constructor(){
			this.point = new Vec2();
			this.normal = new Vec2();
		};
	};
}

#endif