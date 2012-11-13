#ifndef RAY3D_TS
#define RAY3D_TS

#include "../math/Vec3.ts"
#include "IRay3d.ts"

module akra.geometry{
	export struct Ray3d implements IRay3d{
		v3fPoint: IVec3;
		v3fNormal: IVec3;

		constructor(){
			this.v3fPoint = new Vec3();
			this.v3fNormal = new Vec3();
		};
	};
}

#endif