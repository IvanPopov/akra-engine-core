#ifndef RAY3D_TS
#define RAY3D_TS

#include "../math/Vec3.ts"
#include "IRay3d.ts"

module akra.geometry{
	export struct Ray3d implements IRay3d{
		point: IVec3;
		normal: IVec3;

		constructor(){
			this.point = new Vec3();
			this.normal = new Vec3();
		};
	};
}

#endif