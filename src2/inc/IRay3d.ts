#ifndef IRAY3D_TS
#define IRAY3D_TS

module akra {

	IFACE(IVec3);

	export interface IRay3d {
		point: IVec3;
		normal: IVec3;
	};
}

#endif