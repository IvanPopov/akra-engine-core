#ifndef ISEGMENT3D_TS
#define ISEGMENT3D_TS

module akra {

	IFACE(IRay3d);

	export interface ISegment3d{
		ray: IRay3d;
		distance: float;

		point: IVec3;
		normal: IVec3;
	};
}

#endif