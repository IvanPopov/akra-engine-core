#ifndef ISEGMENT2D_TS
#define ISEGMENT2D_TS

module akra {

	IFACE(IRay2d);

	export interface ISegment2d{
		pRay: IRay2d;
		fDistance: float;

		point: IVec2;
		normal: IVec2;
	};
}

#endif