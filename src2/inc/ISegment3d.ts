#ifndef ISEGMENT3D_TS
#define ISEGMENT3D_TS

module akra {

	IFACE(IRay3d);

	export interface ISegment3d{
		pRay: IRay3d;
		fDistance: float;

		point: IVec3;
		normal: IVec3;
	};
}

#endif