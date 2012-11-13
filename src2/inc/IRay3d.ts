#ifndef IRAY3D_TS
#define IRAY3D_TS

module akra {

	IFACE(IVec3);

	export interface IRay3d {
		v3fPoint: IVec3;
		v3fNormal: IVec3;
	};
}

#endif